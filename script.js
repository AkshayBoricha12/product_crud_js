let products = document.getElementById("products");
let productForm = document.getElementById("product-form");
let formContainer = document.querySelector(".form-container");
let productCollection = JSON.parse(localStorage.getItem("products")) || [];
let id = productCollection.length + 1;

function addProduct(event, productID) {
  event.preventDefault();
  console.log(productID);
  if (productID === -1) {
    // add product
    let data = new FormData(event.target);
    let product = Object.fromEntries(data.entries());
    product.id = id;
    productCollection.push(product);
    id++;
  } else {
    // edit product

    let formInputs = productForm.getElementsByClassName("form-input");
    let values = Object.values(productCollection[productID]);

    for (let i = 0; i < 6; i++) {
      formInputs[i].value = values[i];
    }

    productForm.value = values;

    // productCollection[productID].image = formInputs[0].value;
    // productCollection[productID].name = formInputs[1].value;
    // productCollection[productID].description = formInputs[2].value;
    // productCollection[productID].price = formInputs[3].value;
    // productCollection[productID].quantity = formInputs[4].value;
    // productCollection[productID].tags = formInputs[5].value;
  }
  localStorage.setItem("products", JSON.stringify(productCollection));
  getData();
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});

function getData() {
  let myProducts = JSON.parse(localStorage.getItem("products"));

  if (myProducts && myProducts.length > 0) {
    products.innerHTML = "";
    for (const product of myProducts) {
      let div = document.createElement("div");
      div.classList += "product col-4";

      div.innerHTML = `
              <div class="product-top">
                <div class="product-id">1</div>
                <div class="product-image">
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
                    <h2 class="h2">${product.name}</h2>
                  </div>
                  <div class="product-description">
                    <p>
                      ${product.description}
                    </p>
                  </div>
                  <div class="product-price">
                    <p>&#8377;<span>${product.price}</span></p>
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
                  <button class="btn edit-btn flex flex-center">Edit</button>
                </div>
                <div class="product-bottom-right">
                  <button class="btn delete-btn flex flex-center">
                    Delete
                  </button>
                </div>`;
      products.appendChild(div);
    }
  }
  let editBtn = document.querySelectorAll(".edit-btn");
  let deleteBtn = document.querySelectorAll(".delete-btn");

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", () => {
      deleteProduct(i);
    });
    editBtn[i].addEventListener("click", (event) => {
      formContainer.style.display = "flex";
      editProduct(event, i);
    });
  }
}

function editProduct(event, id) {
  addProduct(event, id);
}

function deleteProduct(id) {
  productCollection.splice(id, 1);
  localStorage.setItem("products", JSON.stringify(productCollection));
  getData();
}
function validateForm(event) {
  addProduct(event, -1);
  productForm.reset();
}

function showHideForm() {
  if (formContainer.style.display === "none") {
    formContainer.style.display = "flex";
  } else {
    formContainer.style.display = "none";
  }
}

function tagTemplate(tags) {
  if (tags != "" && typeof tags === "string") {
    tags = tags.split(",");
    let tagsString = "";
    tags.forEach((tag) => {
      tagsString += `<div class="tag col-3">${tag}</div>`;
    });
    return tagsString;
  }
}
