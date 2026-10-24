
/* =========================================
   SHOPEASE E-COMMERCE WEBSITE
   
========================================= */


// STEP 1: CONNECT HTML ELEMENTS

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartButton = document.getElementById("cart-button");
const cartSection = document.getElementById("cart");
const clearCartButton = document.getElementById("clear-cart-button");
const checkoutButton = document.getElementById("checkout-button");


// STEP 2: PRODUCT DATA

const products = [
  {
    id: 1,
    name: "Smartphone",
    price: 250000,
    category: "Electronics",
    image: "smartphone.jpg",
    description: "A modern smartphone for everyday use."
  },
  {
    id: 2,
    name: "Headphones",
    price: 35000,
    category: "Electronics",
    image: "headphones.jpg",
    description: "Enjoy your favourite music with clear sound."
  },
  {
    id: 3,
    name: "Sneakers",
    price: 45000,
    category: "Fashion",
    image: "sneakers.jpg",
    description: "Comfortable sneakers for everyday activities."
  },
  {
    id: 4,
    name: "Wristwatch",
    price: 28000,
    category: "Accessories",
    image: "wristwatch.jpg",
    description: "A stylish watch for every occasion."
  },
  {
    id: 5,
    name: "Backpack",
    price: 22000,
    category: "Fashion",
    image: "backpack.jpg",
    description: "A practical backpack for work and school."
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 15000,
    category: "Electronics",
    image: "mouse.jpg",
    description: "A wireless mouse for smooth navigation."
  },
  {
    id: 7,
    name: "T-Shirt",
    price: 12000,
    category: "Fashion",
    image: "tshirt.jpg",
    description: "A comfortable T-shirt for casual wear."
  },
  {
    id: 8,
    name: "Laptop",
    price: 230000,
    category: "Electronics",
    image: "laptop.jpg",
    description: "A laptop for work, learning and entertainment."
  }
];


// STEP 3: SAVE THE CART

function saveCart() {
  localStorage.setItem("shopEaseCart", JSON.stringify(cart));
}


// STEP 4: LOAD THE CART AND QUANTITIES

function loadCart() {
  try {
    const savedCart = localStorage.getItem("shopEaseCart");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        const loadedCart = [];

        parsedCart.forEach(function(item) {
          const product = products.find(function(product) {
            return product.id === item.id;
          });

          if (product) {
            const quantity =
              Number.isInteger(item.quantity) && item.quantity > 0
                ? item.quantity
                : 1;

            const existingProduct = loadedCart.find(function(item) {
              return item.id === product.id;
            });

            if (existingProduct) {
              existingProduct.quantity += quantity;
            } else {
              loadedCart.push({
                ...product,
                quantity: quantity
              });
            }
          }
        });

        return loadedCart;
      }
    }
  } catch (error) {
    
  }

  return [];
}

let cart = loadCart();


// STEP 5: DISPLAY PRODUCTS

function renderProducts(productArray) {
  productList.innerHTML = "";

  if (productArray.length === 0) {
    productList.innerHTML = `
      <p class="empty-message">
        No products found. Try another search.
      </p>
    `;
    return;
  }

  productArray.forEach(function(product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <img
        src="${product.image}"
        alt="${product.name}"
        class="product-image"
      >

      <div class="product-info">
        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <p class="product-category">
          ${product.category}
        </p>

        <p class="product-price">
          ₦${product.price.toLocaleString("en-NG")}
        </p>

        <button
          type="button"
          class="add-to-cart"
          data-id="${product.id}"
        >
          Add to Cart
        </button>
      </div>
    `;

    productList.appendChild(productCard);
  });
}


// STEP 6: SEARCH AND CATEGORY FILTERS

function applyFilters() {
  const searchTerm = searchInput.value
    .toLowerCase()
    .trim();

  const selectedCategory = categoryFilter.value;

  const filteredProducts = products.filter(function(product) {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);


// STEP 7: NOTIFICATION MESSAGES

function showToast(message, type = "success") {
  let toast = document.getElementById("shop-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "shop-toast";
    toast.className = "shop-toast";

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = "shop-toast " + type + " show";

  clearTimeout(toast.hideTimer);

  toast.hideTimer = setTimeout(function() {
    toast.classList.remove("show");
  }, 2500);
}


// STEP 8: ADD PRODUCTS TO CART

productList.addEventListener("click", function(event) {
  if (event.target.classList.contains("add-to-cart")) {
    const productId = Number(event.target.dataset.id);

    const existingProduct = cart.find(function(product) {
      return product.id === productId;
    });

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const selectedProduct = products.find(function(product) {
        return product.id === productId;
      });

      if (selectedProduct) {
        cart.push({
          ...selectedProduct,
          quantity: 1
        });
      }
    }

    saveCart();
    renderCart();

    showToast("Cart updated successfully!");
  }
});


// STEP 9: DISPLAY CART ITEMS AND TOTAL

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Your cart is empty. Add some products!
      </p>
    `;

    cartCount.textContent = 0;
    document.getElementById("cart-total").textContent = "₦0";

    return;
  }

  cart.forEach(function(product) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const subtotal = product.price * product.quantity;

    cartItem.innerHTML = `
      <span>
        ${product.name} — ₦${product.price.toLocaleString("en-NG")}
      </span>

      <div class="quantity-controls">
        <button
          type="button"
          class="quantity-minus"
          data-id="${product.id}"
        >−</button>

        <span>${product.quantity}</span>

        <button
          type="button"
          class="quantity-plus"
          data-id="${product.id}"
        >+</button>

        <button
          type="button"
          class="remove-cart-item"
          data-id="${product.id}"
        >
          Remove
        </button>
      </div>

      <p>
        Subtotal: ₦${subtotal.toLocaleString("en-NG")}
      </p>
    `;

    cartItems.appendChild(cartItem);
  });

  const total = cart.reduce(function(sum, product) {
    return sum + product.price * product.quantity;
  }, 0);

  const totalQuantity = cart.reduce(function(sum, product) {
    return sum + product.quantity;
  }, 0);

  document.getElementById("cart-total").textContent =
    "₦" + total.toLocaleString("en-NG");

  cartCount.textContent = totalQuantity;

  const uniqueProducts = new Set(
    cart.map(function(product) {
      return product.id;
    })
  );

  
}


// STEP 10: CHANGE QUANTITIES AND REMOVE PRODUCTS

cartItems.addEventListener("click", function(event) {
  const button = event.target;

  const isPlus = button.classList.contains("quantity-plus");
  const isMinus = button.classList.contains("quantity-minus");
  const isRemove = button.classList.contains("remove-cart-item");

  if (!isPlus && !isMinus && !isRemove) {
    return;
  }

  const productId = Number(button.dataset.id);

  const cartIndex = cart.findIndex(function(product) {
    return product.id === productId;
  });

  if (cartIndex === -1) {
    return;
  }

  if (isPlus) {
    cart[cartIndex].quantity += 1;
  } else if (isMinus) {
    cart[cartIndex].quantity -= 1;

    if (cart[cartIndex].quantity <= 0) {
      cart.splice(cartIndex, 1);
    }
  } else if (isRemove) {
    cart.splice(cartIndex, 1);
  }

  saveCart();
  renderCart();

  showToast("Cart updated successfully!");
});


// STEP 11: CONFIRMATION POPUP

function showConfirm(message, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "shop-modal-overlay";

  const modal = document.createElement("div");
  modal.className = "shop-modal";

  const heading = document.createElement("h3");
  heading.textContent = "Are you sure?";

  const text = document.createElement("p");
  text.textContent = message;

  const actions = document.createElement("div");
  actions.className = "shop-modal-actions";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.className = "shop-modal-cancel";

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.textContent = "Yes, clear";
  confirmButton.className = "shop-modal-confirm";

  actions.appendChild(cancelButton);
  actions.appendChild(confirmButton);

  modal.appendChild(heading);
  modal.appendChild(text);
  modal.appendChild(actions);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  cancelButton.addEventListener("click", function() {
    overlay.remove();
  });

  confirmButton.addEventListener("click", function() {
    overlay.remove();
    onConfirm();
  });
}


// STEP 12: CLEAR THE CART

clearCartButton.addEventListener("click", function() {
  if (cart.length === 0) {
    showToast("Your cart is already empty!", "warning");
    return;
  }

  showConfirm(
    "This will remove every product from your shopping cart.",
    function() {
      cart = [];

      saveCart();
      renderCart();

      showToast("Your cart has been cleared!");
    }
  );
});


// STEP 13: CHECKOUT PANEL

function openCheckoutPanel() {
  // Prevent duplicate checkout panels.

  if (document.querySelector(".checkout-panel")) {
    return;
  }

  // Calculate the subtotal, including quantities.

  const total = cart.reduce(function(sum, product) {
    return sum + product.price * product.quantity;
  }, 0);

  // STEP 105: COUPON VARIABLES

  let discount = 0;
  let finalTotal = total;

  // Create the order summary.

  const orderSummary = cart.map(function(product) {
    const subtotal = product.price * product.quantity;

    return `
      <p>
        ${product.name} × ${product.quantity}
        — ₦${subtotal.toLocaleString("en-NG")}
      </p>
    `;
  }).join("");

  const overlay = document.createElement("div");
  overlay.className = "shop-modal-overlay";

  const panel = document.createElement("div");
  panel.className = "shop-modal checkout-panel";

  panel.innerHTML = `
    <h3>Complete Your Order 🛍️</h3>

    <p>Review your items and enter your delivery details.</p>

    <div class="checkout-summary">
      <h4>Your Order</h4>

      ${orderSummary}

      <h4>Subtotal: ₦${total.toLocaleString("en-NG")}</h4>

      <div class="coupon-section">
        <label for="coupon-code">Coupon Code</label>

        <input
          type="text"
          id="coupon-code"
          placeholder="Enter coupon code"
        >

        <button type="button" id="apply-coupon">
          Apply Coupon
        </button>

        <p id="coupon-message"></p>

        <h4 id="discount-amount">Discount: ₦0</h4>

        <h4 id="final-total">
          Final Total: ₦${total.toLocaleString("en-NG")}
        </h4>
      </div>
    </div>

    <form id="checkout-form">
      <label for="customer-name">Full Name</label>

      <input
        id="customer-name"
        name="customerName"
        type="text"
        placeholder="Enter your full name"
        required
      >

      <label for="customer-phone">Phone Number</label>

      <input
        id="customer-phone"
        name="customerPhone"
        type="tel"
        placeholder="Enter your phone number"
        required
      >

      <label for="delivery-address">Delivery Address</label>

      <textarea
        id="delivery-address"
        name="deliveryAddress"
        placeholder="Enter your delivery address"
        required
      ></textarea>

      <div class="shop-modal-actions">
        <button
          type="button"
          class="shop-modal-cancel"
          id="cancel-checkout"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="shop-modal-confirm checkout-submit"
        >
          Place Order
        </button>
      </div>
    </form>

    <button
      type="button"
      id="continue-shopping"
      class="shop-modal-cancel"
    >
      Continue Shopping
    </button>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);


  // STEP 14: CANCEL CHECKOUT

  document.getElementById("cancel-checkout")
    .addEventListener("click", function() {
      overlay.remove();
    });


  // STEP 15: CONTINUE SHOPPING

  document.getElementById("continue-shopping")
    .addEventListener("click", function() {
      overlay.remove();

      cartSection.scrollIntoView({
        behavior: "smooth"
      });
    });


  // STEP 16: APPLY DISCOUNT COUPONS

  document.getElementById("apply-coupon")
    .addEventListener("click", function() {
      const couponInput = document.getElementById("coupon-code");
      const couponMessage = document.getElementById("coupon-message");

      const couponCode = couponInput.value.trim().toUpperCase();

      if (couponCode === "SHOPEASE10") {
        discount = total * 0.10;
      } else if (couponCode === "SHOPEASE20") {
        discount = total * 0.20;
      } else {
        discount = 0;
        finalTotal = total;

        couponMessage.textContent =
          "Invalid coupon code. Try again.";

        document.getElementById("discount-amount").textContent =
          "Discount: ₦0";

        document.getElementById("final-total").textContent =
          "Final Total: ₦" + finalTotal.toLocaleString("en-NG");

        showToast("Invalid coupon code!", "warning");

        return;
      }

      finalTotal = total - discount;

      couponMessage.textContent =
        "Coupon applied successfully!";

      document.getElementById("discount-amount").textContent =
        "Discount: ₦" + discount.toLocaleString("en-NG");

      document.getElementById("final-total").textContent =
        "Final Total: ₦" + finalTotal.toLocaleString("en-NG");

      showToast("Coupon applied successfully!");
    });


  // STEP 17: SUBMIT CHECKOUT AND CONFIRM ORDER

  document.getElementById("checkout-form")
    .addEventListener("submit", function(event) {
      event.preventDefault();

      const customerName =
        document.getElementById("customer-name").value.trim();

      const customerPhone =
        document.getElementById("customer-phone").value.trim();

      const deliveryAddress =
        document.getElementById("delivery-address").value.trim();

      if (!customerName || !customerPhone || !deliveryAddress) {
        showToast(
          "Please complete all delivery details.",
          "warning"
        );

        return;
      }

      // Save the discounted total before clearing the cart.

      const orderTotal = finalTotal;

      // Generate a demo order reference.

      const orderReference =
        "SE-" + Date.now() + "-" +
        Math.floor(Math.random() * 1000);

      overlay.remove();

      cart = [];

      saveCart();
      renderCart();

      // Show order confirmation.

      const successOverlay = document.createElement("div");
      successOverlay.className = "shop-modal-overlay";

      const successPanel = document.createElement("div");
      successPanel.className = "shop-modal";

      successPanel.innerHTML = `
        <h3>🎉 Order Successful!</h3>

        <p>Thank you, ${customerName}!</p>

        <p>Your demo order has been recorded on this page.</p>

        <p><strong>Order Reference:</strong></p>

        <p>${orderReference}</p>

        <p><strong>Order Total:</strong></p>

        <p>₦${orderTotal.toLocaleString("en-NG")}</p>

        <button type="button" id="close-success">
          Continue Shopping
        </button>
      `;

      successOverlay.appendChild(successPanel);
      document.body.appendChild(successOverlay);

      document.getElementById("close-success")
        .addEventListener("click", function() {
          successOverlay.remove();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        });
    });
}


// STEP 18: OPEN CHECKOUT

checkoutButton.addEventListener("click", function() {
  if (cart.length === 0) {
    showToast(
      "Please add products before checkout!",
      "warning"
    );

    return;
  }

  openCheckoutPanel();
});


// STEP 19: SCROLL TO CART

cartButton.addEventListener("click", function() {
  cartSection.scrollIntoView({
    behavior: "smooth"
  });
});


// STEP 20: START THE WEBSITE

renderProducts(products);
renderCart();
