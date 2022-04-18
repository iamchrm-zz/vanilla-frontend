const deleteItemCart = document.querySelector("#deleteItemCart");
//QUANTITY OF ITEMS IN CART
const quantityItem = document.querySelector("#quantityItem");
const totalItemCartNav = document.querySelector("#cart-total");
const totalItemCart = document.querySelector("#cart-total-cart");
const totalItemCartSummary = document.querySelector(
  "#cart-total-car-item-summary"
);
// TOTAL PRICE OF ITEMS IN CART
const totalPriceBefore = document.querySelector("#cart-price-total");
const totalPriceAfter = document.querySelector("#cart-price-item-summary");

const productItems = document.querySelector("#product-items");
const productsSelected = document.querySelector("#products-selected");
// CART OVERLAY

const cartOverlay = document.querySelector(".cart-overlay");
const cartContent = document.querySelector("#cartContent");

// const cartDOM = document.querySelector(".cart");
// console.log(totalPrice);

//cart
let cart = [];

let buttonsDOM = [];

//headers
const getHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};
//getting the producs
class Products {
  async getProducts() {
    try {
      const result = await fetch("http://localhost:4000/getProducts", {
        method: "GET",
        mode: "cors",
        headers: getHeaders(),
      });
      //return products to json method
      const products = await result.json();
      return products;
    } catch (error) {
      console.log("[getProducts]: " + error);
    }
  }
}

//displaying products
class UI {
  //display products
  displayProducts(products) {
    let result = " ";
    products.forEach(({ id, name, url_image, price, discount, category }) => {
      result += `
      <div class="col-4">
      <div class="card mb-4">
       ${
         !url_image
           ? ` <img src="static/media/images/product_notfound.png" class="card-img-top" alt="..."></img>`
           : `<img src="${url_image}" class="card-img-top" alt="..."></img>`
       }
  
      <div class="card-body">
      ${
        name.lenght > "10"
          ? `<h5 class="card-title">${name.slice(0, 10)}...</h5>`
          : `<h5 class="card-title">${name}</h5>`
      }
          
          <p class="card-price">$${price}</p>
          ${
            discount > 0
              ? ` <p class="card-discount animate__animated animate__pulse animate__infinite">${discount}% OFF 🔥</p>`
              : ""
          }
         
          <p class="card-category"> category <i class="fa-solid fa-angle-right me-2"></i> ${
            category.name
          }</p>
          <div class="d-flex justify-content-end">
              <a id="addCartButton" class="btn btn-c-add" data-id=${id} >Add to cart <i class="fa-solid fa-cart-plus"></i>
              </a>
          </div>

            </div>
        </div>
        </div>
      `;
    });
    productItems.innerHTML = result;
  }

  getCardButtons() {
    //get all buttons of card items
    const allCardButtons = [...document.querySelectorAll("#addCartButton")];
    buttonsDOM = allCardButtons;
    allCardButtons.forEach((button) => {
      //save in id variable the data set id of the al buttons of the products
      let id = button.dataset.id;
      //check if the id is in the cart
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } else {
        button.addEventListener("click", (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          //get product from products
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          //add product to cart, it return all the products in the cart and add new item
          cart = [...cart, cartItem];
          console.log(cart);
          //save cart in local storage
          Storage.saveCart(cart);
          //set cart values
          this.setCartValues(cart);
          //display cart item
          this.addCartItem(cartItem);
          //show cart
          //   this.showCart();
        });
      }
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    totalItemCartNav.innerText = parseFloat(tempTotal.toFixed(2));
    // totalItemCart.innerText = parseFloat(tempTotal.toFixed(2));
    // totalItemCartSummary.innerText = parseFloat(tempTotal.toFixed(2));

    //
    document.querySelector("#cart-total").innerText = itemsTotal;
    document.querySelector("#cart-total-cart").innerText = itemsTotal;
    document.querySelector("#cart-total-car-item-summary").innerText =
      itemsTotal;
    // console.log(totalCart, itemsTotal);
  }

  addCartItem(item) {
    let carItemAdded = "";
    carItemAdded += `
    
    <div class="col-md-2 col-lg-2 col-xl-2">
        <img src="${item.url_image}" class="img-fluid rounded-3" alt="Cotton T-shirt">
    </div>
    <div class="col-md-3 col-lg-3 col-xl-3">
        <h6 id="cart-category" class="text-muted">${item.category.name}</h6>
        <h6 id="cart-title" class="text-black mb-0">${item.name}</h6>
      
    </div>
    <div class="col-md-3 col-lg-3 col-xl-2 d-flex " >
        <button class="btn btn-link px-2  "
            onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
            <i class="fas fa-minus setColor-primary"></i>
        </button>

        <input id="quantityItem" min="0" value="1"
            type="number"
            class="form-control form-control-sm" />

        <button class="btn btn-link px-2 "
            onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
            <i class="fas fa-plus setColor-primary"></i>
        </button>
    </div>
    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
        <h6 id="cart-price" class="mb-0"> $ ${item.price}</h6>
    </div>
    <span id="remove-item" class="remove-item mt-4" data-id="${item.id}">
       remove
    </span>

<hr class="my-4">
    `;
    cartContent.innerHTML += carItemAdded;
  }

  showCart() {
    cartOverlay.classList.remove("d-none");
    // console.log(cartOverlay);
    // console.log(que);
    // cartDOM.classList.add("showCartOverlay");
  }

  closeCart() {
    cartOverlay.classList.add("d-none");
  }
  // populate cart with items from local storage
  populateCart(cart) {
    cart = Storage.getCart();
    cart.map((item) => this.addCartItem(item));
    this.setCartValues(cart);
  }
  getJustOneButton(id) {
    return buttonsDOM.find((button) => button.dataset.id == id);
  }
  removeItem(id) {
    //car filter
    cart = cart.filter((item) => item.id == id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getJustOneButton(id);
    button.disabled = false;
    button.innerText = "Add to Cart";
  }
  clearCart() {}
  cartLogic() {
    //clear cart button
    // deleteItemCart.addEventListener("click", () => {
    //   this.clearCart();
    // });
    //cart functionality
    cartOverlay.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart-overlay")) {
        this.closeCart();
      }
    });
    //cart functionality
    // cartBtn.addEventListener("click", () => {
    //   this.showCart();
    // });
  }
  mainApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartToggle.addEventListener("click", this.showCart);
    closeCart.addEventListener("click", this.closeCart);
    cartContent.addEventListener("click", (e) => {
      let element = document.getElementById("remove-item");
      if (e.target !== element && !element.contains(e.target)) {
        console.log(e.target);
      } else {
        let id = e.target.dataset.id;
        console.log(id);
        element.parentNode.removeChild(element);
        this.removeItem(id);
      }
    });
  }
}

//local storage
class Storage {
  //save products to local storage
  static saveProductsToStorage(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  //get products from local storage
  //   static getProductsToStorage() {
  //     return localStorage.getItem("products")
  //       ? JSON.parse(localStorage.getItem("products"))
  //       : [];
  //   }

  //get product id
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id == id);
  }
  //save cart to local storage
  static saveCart(cart) {
    //first name of the cart and then the cart
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  //get cart from local storage
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //   const storage = new Storage();
  ui.mainApp();
  //getting all products and displaying them
  products
    .getProducts()
    .then((products) => {
      //showing products
      ui.displayProducts(products);
      //save to storage
      Storage.saveProductsToStorage(products);
    })
    .then(() => {
      ui.getCardButtons();
      ui.cartLogic();
    });
});
