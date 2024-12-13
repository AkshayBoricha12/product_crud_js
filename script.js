let products = document.getElementById("products");
console.log(products);
let productForm = document.getElementById("product-form");
let id = 1;
let productCollection = [];

productForm.addEventListener("submit", validateForm);

function addProduct(event) {
  event.preventDefault();

  let data = new FormData(event.target);
  let product = Object.fromEntries(data.entries());
  console.log(product);

  productCollection.push(product);

  console.log("productCollection:", productCollection);
  localStorage.setItem("products", JSON.stringify(productCollection));
  console.log("Successful");
  getData();
  console.log("ID:", id);
  id++;
}

function getData() {
  let myProducts = JSON.parse(localStorage.getItem("products"));

  if (products && myProducts && myProducts.length > 0) {
    for (const product of myProducts) {
      let div = document.createElement("div");
      div.classList += "product col-4";
      div.innerHTML = `<div>Hello check - ${product.name}</div>`;
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
}
