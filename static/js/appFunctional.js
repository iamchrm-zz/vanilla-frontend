//CONSTANTS
const productItems = document.querySelector("#product-items");
const cartOverlay = document.querySelector(".cart-overlay");
const cartContent = document.querySelector("#cartContent");
const cartToggleOpen = document.querySelector("#cart-toggle");
const cartToggleClose = document.querySelector("#closeCart");
// console.log(productItems);
const getHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};
const getProducts = async () => {
  try {
    const result = await fetch("http://localhost:4000/getProducts", {
      method: "GET",
      mode: "cors",
      headers: getHeaders(),
    });
    //return products to json method
    const valores = ([] = await result.json());
    localStorage.setItem("products", JSON.stringify(valores));
    const products = valores.map((product) => {
      // console.log(product);
      return product;
    });
    return products;
  } catch (error) {
    console.log("[getProducts]: " + error);
  }
};

function renderProducts() {
  let result = " ";

  getProducts().then((products) => {
    products.map(
      ({ id, name, url_image, price, discount, category }) =>
        (result += `
      <div class="col-4">
      <div class="card mb-4">
       ${
         !url_image
           ? ` <img src="static/media/images/product_notfound.png" class="card-img-top" alt="..."></img>`
           : `<img src="${url_image}" class="card-img-top" alt="..."></img>`
       }

      <div class="card-body">

      <h5 class="card-title">${name}</h5>
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
              <a id="addCartButton"  class="btn btn-c-add" onclick="addToCart(${id})">Add to cart <i class="fa-solid fa-cart-plus"></i>
              </a>
          </div>

            </div>
        </div>
        </div>
          `)
    );
    productItems.innerHTML = result;
  });
}

renderProducts();

//cart array
let cart = JSON.parse(localStorage.getItem("cart"));

//add to cart
const removeItemToCart = (id) => {
  console.log("clicked");
  //filter items in cart what do not match with the id param
  cart = cart.filter((item) => item.id !== id);
  updateCart();
};
const addToCart = (id) => {
  // console.log(id);
  getProducts().then((products) => {
    if (cart.some((product) => product.id == id)) {
      changeQuantityUnits("plus", id);
    } else {
      const item = products.find((product) => product.id == id);
      console.log("adding producto to cart");
      cart.push({ ...item, quantity: 1 });
      updateCart();
    }
  });
};
const renderSubTotal = () => {
  let subTotal = 0,
    totalItems = 0,
    subTotalDiscount = 0;
  total = 0;

  cart.forEach((item) => {
    if (item.discount > 1) {
      let itemDescuento = item.discount;
      let itemPrecio = item.price;
      totalItems += item.quantity;
      subTotal = item.quantity * itemPrecio;

      subTotalDiscount = subTotal - (subTotal * itemDescuento) / 100;
      total += subTotalDiscount;
      console.log(`total descuento ${total}`);
    } else {
      subTotal += item.price * item.quantity;
      totalItems += item.quantity;

      total += subTotal;
      console.log(`total sin des${total}`);
    }
  });
  document.querySelector("#cart-subtotal").innerHTML = `$${subTotal}`;
  document.querySelector(
    "#cart-item-total"
  ).innerHTML = `quantity: ${totalItems}`;

  document.querySelector("#cart-price-total").innerHTML = `$${total}`;
};
const renderCartItem = () => {
  cartContent.innerHTML = "";
  cart.forEach((item) => {
    cartContent.innerHTML += ` <div class="col-md-2 col-lg-2 col-xl-2">
        <img src="${item.url_image}" class="img-fluid rounded-3" alt="Cotton T-shirt">
    </div>
    <div class="col-md-3 col-lg-3 col-xl-3">
        <h6 id="cart-category" class="text-muted">${item.category.name}</h6>
        <h6 id="cart-title" class="text-black mb-0">${item.name}</h6>
      
    </div>
    <div class="col-md-3 col-lg-3 col-xl-2 d-flex " >
        <button class="btn btn-link px-2  "
            onclick="changeQuantityUnits('minus', ${item.id})">
            <i class="fas fa-minus setColor-primary"></i>
        </button>

        <input id="quantityItem" min="0" value="${item.quantity}" 
            type="number"
            class="form-control form-control-sm" />

        <button class="btn btn-link px-2 "
            onclick="changeQuantityUnits('plus', ${item.id})">
            <i class="fas fa-plus setColor-primary"></i>
        </button>
    </div>
    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
        <h6 id="cart-price" class="mb-0"> $ ${item.price}</h6>
    </div>
    <div class="col-md-1 col-lg-1 col-xl-1"> 
    <span id="remove-item" class="remove-item me-2" onclick="removeItemToCart(${item.id})" data-id="${item.id}">
    <i class="fa-solid fa-trash-can"></i>
    </span>
    </div>

<hr class="my-4">
    `;
  });
};

const updateCart = () => {
  renderCartItem();
  renderSubTotal();

  //save cart to local storage

  localStorage.setItem("cart", JSON.stringify(cart));
};
updateCart();
//render cart Items

const changeQuantityUnits = (action, id) => {
  cart = cart.map((item) => {
    let quantity = item.quantity;
    if (item.id == id) {
      if (action === "plus" && quantity < 90) {
        quantity++;
      } else if (action === "minus" && quantity > 1) {
        quantity--;
      }
    }

    return {
      ...item,
      quantity,
    };
  });
  updateCart();
  console.log(cart);
};
const openCart = () => {
  cartOverlay.classList.contains("d-none")
    ? cartOverlay.classList.remove("d-none")
    : cartOverlay.classList.add("d-none");
};
const closeCart = () => {
  cartOverlay.classList.add("d-none");
};
