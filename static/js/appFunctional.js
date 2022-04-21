//CONSTANTS can be set in UPPERCASE
const productItems = document.querySelector("#product-items");
const cartOverlay = document.querySelector(".cart-overlay");
const cartContent = document.querySelector("#cartContent");
const cartToggleOpen = document.querySelector("#cart-toggle");
const cartToggleClose = document.querySelector("#closeCart");
// buscar
const inputBuscar = document.getElementById("inputBuscar");
const carouselItems = document.querySelector("#discountProducts");

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

// searching product with input
const productSearching = () => {
  inputBuscar.addEventListener("keyup", (e) => {
    let texto = e.target.value;
    console.log(texto);

    let er = new RegExp(texto, "i");

    for (let i = 0; i < productItems.children.length; i++) {
      let product = productItems.children[i];
      let name = product.querySelector("h5").innerText;
      if (!er.test(name)) {
        product.classList.add("d-none");
      } else {
        product.classList.remove("d-none");
      }
    }
  });
};

productSearching();

const setupPagination = () => {
  //pagination
  const pagination = document.querySelector(".custom-pagination");
  const products = JSON.parse(localStorage.getItem("products"));
  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const pageButtonsContainer = document.createElement("div");
  pageButtonsContainer.classList.add("pagination");

  pagination.appendChild(pageButtonsContainer);

  for (let i = 0; i < totalPages; i++) {
    const test = document.createElement("li");
    test.classList.add("page-item");
    const button = document.createElement("a");
    button.classList.add("page-link");
    button.innerText = i + 1;
    pageButtonsContainer.appendChild(button);
    // pageButtonsContainer.appendChild(button);
  }
  const buttons = pageButtonsContainer.querySelectorAll("a");
  buttons[0].classList.add("active");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", (e) => {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
      }
      e.target.classList.add("active");
      const page = e.target.innerText;
      const start = (page - 1) * productsPerPage;
      const end = page * productsPerPage;
      for (let i = 0; i < productItems.children.length; i++) {
        const product = productItems.children[i];
        if (i >= start && i < end) {
          product.classList.remove("d-none");
        } else {
          product.classList.add("d-none");
        }
      }
    });
  }
};

setupPagination();

const addDiscountProducts = () => {
  let result = " ";
  getProducts().then((products) => {
    products.map(({ id, name, url_image, price, discount, category }) =>
      discount > 1
        ? (result += `
        <div class="item">
        ${
          !url_image
            ? ` <img src="static/media/images/product_notfound.png" class="img-promotion" alt="..."></img>`
            : `<img src="${url_image}" class="img-promotion" alt="..."></img>`
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
            ${
              !cart.some((product) => product.id == id)
                ? ` <a id="addCartButton"  class="btn btn-c-add" onclick="addToCart(${id})">Add right now! 😍
            </a>`
                : ` <a id="addCartButton"  class="btn btn-c-add" onclick="addToCart(${id})">Already in cart!👌
            </a>`
            }
               
            </div>
  
              </div>
          </div>
       
        

        `)
        : null
    );
    carouselItems.innerHTML = result;
  });
};
addDiscountProducts();

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
            ${
              !cart.some((product) => product.id == id)
                ? ` <a id="addCartButton"  class="btn btn-c-add" onclick="addToCart(${id})">Add to cart <i class="fa-solid fa-cart-plus"></i>
            </a>`
                : ` <a id="addCartButton"  class="btn btn-c-add" onclick="addToCart(${id})">in Cart <i class="fa-solid fa-cart-plus"></i>
            </a>`
            }
               
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
//add to carta
const removeItemToCart = (id) => {
  console.log("clicked");
  //filter items in cart what do not match with the id param
  cart = cart.filter((item) => item.id !== id);
  updateCart();
};
const addToCart = (id) => {
  getProducts().then((products) => {
    if (cart.some((product) => product.id == id)) {
      changeQuantityUnits("plus", id);
    } else {
      alert("product added to cart");
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
