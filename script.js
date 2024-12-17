let products = document.getElementById("products");
let productForm = document.getElementById("product-form");
let formContainer = document.querySelector(".form-container");
let formInputs = document.querySelectorAll(".form-input");
let productCollection = JSON.parse(localStorage.getItem("products")) || [];
let id = productCollection.length + 1;
let editingProductID = null;

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
  setID();

  localStorage.setItem("products", JSON.stringify(productCollection));
  getData();
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});

function fillTheForm(i) {
  formContainer.style.display = "flex";
  editingProductID = i - 1;
  let objValues = Object.values(productCollection[i - 1]);
  for (let index = 0; index < formInputs.length; index++) {
    formInputs[index].value = objValues[index];
  }
}

function getData() {
  let myProducts = JSON.parse(localStorage.getItem("products"));
  if (productCollection.length === 0) {
    products.innerHTML = `<h1>No products available. Add a product to get started!</h1>`;
    localStorage.removeItem("products");
  } else if (myProducts && myProducts.length > 0) {
    products.innerHTML = "";
    for (const product of myProducts) {
      let div = document.createElement("div");
      div.classList += "product col-4";

      div.innerHTML = `
              <div class="product-top">
                <div class="product-id">1</div>
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
                  <div class="product-title flex flex-center">
                    <h2 class="h2">${product.name
                      .split(" ")
                      .map((element) => {
                        return (
                          element[0].toUpperCase() +
                          element.slice(1).toLowerCase()
                        );
                      })
                      .join(" ")}</h2>
                  </div>
                  <div class="product-description flex">
                    <p>
                      ${
                        product.description[0].toUpperCase() +
                        product.description.slice(1).toLowerCase()
                      }
                    </p>
                  </div>
                  <div class="product-price">
                    <p>Price:&#8377;<span>${product.price}</span></p>
                  </div>
                  <div class="product-quantity">
                    <p>Quantity:<span>${product.quantity}</span></p>
                  </div>
                  <div class="tags flex flex-center">
                  ${tagTemplate(product.tags)}
                  </div>
                </div>
              </div>
              <div class="product-bottom flex">
                <div class="product-bottom-left">
                  <button class="btn edit-btn flex flex-center" data-id="${
                    product.id
                  }" onclick="fillTheForm(${product.id})">Edit</button>
                </div>
                <div class="product-bottom-right">
                  <button class="btn delete-btn flex flex-center" data-id="${
                    product.id
                  }" onclick="deleteProduct(event)">
                    Delete
                  </button>
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
  let removeID = parseInt(event.target.getAttribute("data-id"));
  productCollection.splice(removeID - 1, 1);
  localStorage.setItem("products", JSON.stringify(productCollection));
  setID();
  getData();
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
    allInputsValid = manageFormInputErrors(0, "Please enter valid image URL.");
  }

  if (!/^(?!^\d+$)[A-Za-z\d\s]+$/.test(name.trim())) {
    allInputsValid = manageFormInputErrors(1, "Please enter a valid name.");
  }

  if (description.trim().length < 3 || description.trim().length > 100) {
    allInputsValid = manageFormInputErrors(
      2,
      "Description length should be between 3 and 100."
    );
  }

  if (!/^\d+$/.test(price) || parseInt(price) <= 0) {
    allInputsValid = manageFormInputErrors(
      3,
      "Price must be a positive integer."
    );
  }

  if (!/^\d+$/.test(quantity) || parseInt(quantity) <= 0) {
    allInputsValid = manageFormInputErrors(
      4,
      "Quantity must be a positive integer."
    );
  }

  if (tags && !/^([\w\s]+,)*[\w\s]+$/.test(tags.trim())) {
    allInputsValid = manageFormInputErrors(
      5,
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
  if (formContainer.style.display === "none") {
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
      tagsString += `<div class="tag col-3">${tag.trim()}</div>`;
    });
    return tagsString;
  }
}
