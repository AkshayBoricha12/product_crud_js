let products = document.getElementById("products");
let productForm = document.getElementById("product-form");
let formContainer = document.querySelector(".form-container");
let ids = [];
let id;
let productCollection = JSON.parse(localStorage.getItem("products")) || [];

for (const product of productCollection) {
  ids.push(product.id);
}

let maximumID = Math.max.apply(null, ids);
if (ids.length === 0 || maximumID === -Infinity) {
  id = 1;
} else {
  id = maximumID + 1;
}

function addProduct(event) {
  event.preventDefault();

  let data = new FormData(event.target);
  let product = Object.fromEntries(data.entries());
  product.id = id;
  productCollection.push(product);

  localStorage.setItem("products", JSON.stringify(productCollection));
  getData();
  id++;
}

document.addEventListener("DOMContentLoaded", () => {
  getData();
});

function getData() {
  let myProducts = JSON.parse(localStorage.getItem("products"));

  if (products && myProducts && myProducts.length > 0) {
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
  } else {
    console.log("Something went wrong");
  }
}

function editProduct() {}
function deleteProduct() {}
function validateForm(event) {
  addProduct(event);
  productForm.reset();
}

function showHideForm() {
  if (productForm.style.top != "0px") {
    productForm.style.top = "0px";
    formContainer.style.display = "flex";
  } else {
    productForm.style.display = "-5000px";
    formContainer.style.display = "none";
  }
}

function tagTemplate(tags) {
  tags = tags.split(",");
  let tagsString = "";
  tags.forEach((tag) => {
    tagsString += `<div class="tag col-3">${tag}</div>`;
  });
  return tagsString;
}
