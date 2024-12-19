let products = document.getElementById("products");
let productForm = document.getElementById("product-form");
let formContainer = document.querySelector(".form-container");
let formInputs = document.querySelectorAll(".form-input");
let sidebar = document.querySelector(".sidebar");
let sidebarToggleBtn = document.querySelector(".sidebar-toggle-btn");
let viewButtons = document.querySelectorAll(".view-btn");
let sortingOptions = document.querySelectorAll(".sort-by");
let productCollection = JSON.parse(localStorage.getItem("products")) || [];
let id = productCollection.length + 1;
let editingProductID = null;
let currentPage = 1;

function showListView() {
  if (viewButtons[1].classList.contains("active-view")) {
    viewButtons[1].classList.remove("active-view");
    viewButtons[0].classList.add("active-view");
  }
}

function showGridView() {
  if (viewButtons[0].classList.contains("active-view")) {
    viewButtons[0].classList.remove("active-view");
    viewButtons[1].classList.add("active-view");
  }
}

function setProduct(event) {
  event.preventDefault();
  const data = new FormData(productForm);
  const product = Object.fromEntries(data.entries());

  if (editingProductID !== null) {
    // Edit product
    productCollection[editingProductID] = {
      ...product,
      id: productCollection[editingProductID].id,
    };
    editingProductID = null;
  } else {
    // Add product
    product.id = productCollection.length + 1;
    productCollection.push(product);
  }
  productForm.reset();

  localStorage.setItem("products", JSON.stringify(productCollection));
  getData();
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
  managePagination();
  document.querySelector(".add-btn").addEventListener("click", showHideForm);
  document
    .querySelector(".sort-btn")
    .addEventListener("click", toggleSortingOptions);
  sidebarToggleBtn.onclick = toggleSidebar;
});

function fillTheForm(i) {
  formContainer.style.display = "flex";
  editingProductID = i - 1;
  let objValues = Object.values(productCollection[i - 1]);
  for (let index = 1; index < formInputs.length; index++) {
    formInputs[index].value = objValues[index - 1];
  }
}

function getData() {
  let myProducts = JSON.parse(localStorage.getItem("products"));
  const productsPerPage = 10;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = currentPage * productsPerPage;

  if (productCollection.length === 0) {
    products.innerHTML = `<h1>No products available. Add a product to get started!</h1>`;
    localStorage.removeItem("products");
  } else if (myProducts && myProducts.length > 0) {
    products.innerHTML = "";
    const paginatedProducts = myProducts.slice(startIndex, endIndex);

    for (const product of paginatedProducts) {
      let div = document.createElement("div");
      div.classList.add("product");

      div.innerHTML = `
              <div class="product-top">
                <div class="product-id">${product.id}</div>
                <div class="product-image flex flex-center">
                  <img
                    src="${product.image}"
                    alt="image"
                  />
                </div>
              </div>
              <hr />
              <div class="product-middle">
                <div class="product-details flex flex-column">
                  <div class="product-title">
                    <h3 class="h3">${product.name
                      .split(" ")
                      .map(
                        (element) =>
                          element[0].toUpperCase() +
                          element.slice(1).toLowerCase()
                      )
                      .join(" ")}</h3>
                  </div>
                  <div class="product-description flex">
                    <p>${
                      product.description[0].toUpperCase() +
                      product.description.slice(1).toLowerCase()
                    }</p>
                  </div>
                  <div class="product-price">
                    <p>Price:&#8377;<span>${product.price}</span></p>
                  </div>
                  <div class="product-quantity">
                    <p>Quantity:<span>${product.quantity}</span></p>
                  </div>
                  <div class="tags flex">
                  ${tagTemplate(product.tags)}  
                  </div>
                </div>
              </div>
              <div class="product-bottom flex">
                <div class="product-bottom-left">
                  <button class="btn edit-btn" data-id="${
                    product.id
                  }" onclick="fillTheForm(${product.id})">Edit</button>
                </div>
                <div class="product-bottom-right">
                  <button class="btn delete-btn" data-id="${
                    product.id
                  }" onclick="deleteProduct(event)">Delete</button>
                </div>`;
      products.appendChild(div);
    }
  }
}

function setID() {
  productCollection.forEach((element, index) => {
    element.id = index + 1;
  });
  localStorage.setItem("products", JSON.stringify(productCollection));
}

function deleteProduct(event) {
  if (confirm("Do you want to delete?")) {
    let removeID = parseInt(event.target.getAttribute("data-id"));
    productCollection.splice(removeID - 1, 1);
    localStorage.setItem("products", JSON.stringify(productCollection));
    productForm.reset();
    setID();
    getData();
    managePagination();
  }
}

function validateForm(event) {
  event.preventDefault();

  let allInputsValid = true;
  let formData = new FormData(document.getElementById("product-form"));
  let formValues = Object.fromEntries(formData.entries());

  let { image, name, description, price, quantity, tags } = formValues;

  document.querySelectorAll(".input-error-message").forEach((element) => {
    element.innerHTML = "";
  });

  for (const input of formInputs) {
    if (input.classList.contains("input-error")) {
      input.classList.remove("input-error");
    }
  }

  if (
    !/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))(\?.*)?$/i.test(image.trim())
  ) {
    allInputsValid = manageFormInputErrors(1, "Please enter valid image URL.");
  }

  if (!/^[\w\s.,\-()&]+$/i.test(name.trim())) {
    allInputsValid = manageFormInputErrors(2, "Please enter a valid name.");
  }

  if (description.trim().length < 3 || description.trim().length > 100) {
    allInputsValid = manageFormInputErrors(
      3,
      "Description length should be between 3 and 100."
    );
  }

  if (!/^\d+$/.test(price) || parseInt(price) <= 0) {
    allInputsValid = manageFormInputErrors(
      4,
      "Price must be a positive integer."
    );
  }

  if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
    allInputsValid = manageFormInputErrors(
      5,
      "Quantity must be a positive integer."
    );
  }

  if (tags && !/^([\w\s]+,)*[\w\s]+$/.test(tags.trim())) {
    allInputsValid = manageFormInputErrors(
      6,
      "Tags must be comma-separated words."
    );
  }

  if (allInputsValid) {
    setProduct(event);
  }
}

function manageFormInputErrors(inputFieldNo, errorMessage) {
  let div = document.createElement("div");
  div.className = "input-error-message";
  div.innerHTML = errorMessage;
  formInputs[inputFieldNo].parentElement.appendChild(div);
  if (!formInputs[inputFieldNo].classList.contains("input-error")) {
    formInputs[inputFieldNo].classList.add("input-error");
    return false;
  }
}

function showHideForm() {
  if (getComputedStyle(formContainer).display === "none") {
    formContainer.style.display = "flex";
    productForm.reset();
  } else {
    formContainer.style.display = "none";
  }
}

function tagTemplate(tags) {
  let tagsString = "";
  if (tags && typeof tags === "string") {
    tags = tags.split(",");
    tags.forEach((tag) => {
      tagsString += `<div class="tag">${tag.trim()}</div>`;
    });
    return tagsString;
  }
}

function searchProduct(event) {
  let searchInput = event.target.value.toLowerCase().trim();

  productCollection.forEach((product, index) => {
    let productDiv = products.children[index];

    let nameMatch = product.name.toLowerCase().includes(searchInput);
    let tagsMatch =
      product.tags && product.tags.toLowerCase().includes(searchInput);

    if (nameMatch || tagsMatch) {
      productDiv.style.display = "";
    } else {
      productDiv.style.display = "none";
    }
  });
}

function toggleSortingOptions() {
  for (const option of sortingOptions) {
    if (getComputedStyle(option).display === "none") {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  }
}

function sortData(sortBy) {
  if (sortBy === "name") {
    productCollection.sort((a, b) => a.name.localeCompare(b.name));
    localStorage.setItem("products", JSON.stringify(productCollection));
    setID();
    getData();
  }

  if (sortBy === "price") {
    productCollection.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    localStorage.setItem("products", JSON.stringify(productCollection));
    setID();
    getData();
  }
}

function toggleSidebar() {
  if (getComputedStyle(sidebar).display === "none") {
    sidebar.style.display = "block";
    sidebarToggleBtn.innerHTML = `<i class="fa-solid fa-x"></i>`;
  } else {
    sidebar.style.display = "none";
    sidebarToggleBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
  }
}

function plusPage(n) {
  gotoPage(currentPage + n);
}

function managePagination() {
  let noOfProducts = productCollection.length;
  const productsPerPage = 10;
  let noOfPages = Math.ceil(noOfProducts / productsPerPage);

  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > noOfPages) {
    currentPage = noOfPages;
  }

  let paginationDiv = document.querySelector(".pagination");
  if (!paginationDiv) {
    paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination flex flex-center";
    products.parentElement.appendChild(paginationDiv);
  }

  paginationDiv.innerHTML = `
    <div class="previous-page-btn page-btn ${
      currentPage === 1 ? "disabled" : ""
    }" onclick="changePage(-1)">
      <i class="fa-solid fa-less-than"></i>
    </div>
    ${managePages(noOfPages)}
    <div class="next-page-btn page-btn ${
      currentPage === noOfPages ? "disabled" : ""
    }" onclick="changePage(1)">
      <i class="fa-solid fa-greater-than"></i>
    </div>`;
}

function managePages(totalPages) {
  let str = "";
  for (let i = 1; i <= totalPages; i++) {
    str += `<div class="page-btn ${
      currentPage === i ? "active-page" : ""
    }" onclick="gotoPage(${i})">${i}</div>`;
  }
  return str;
}

function changePage(direction) {
  currentPage += direction;

  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > Math.ceil(productCollection.length / 10)) {
    currentPage = Math.ceil(productCollection.length / 10);
  }
  getData();
  managePagination();
}

function gotoPage(page) {
  currentPage = page;
  getData();
  managePagination();
}
