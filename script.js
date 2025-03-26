// Select the necessary elements
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
const addCartButtons = document.querySelectorAll(".add-cart");
const cartContent = document.querySelector(".cart-content");
const cartItemCountBadge = document.querySelector(".cart-item-count");

// Modal Elements
const modal = document.getElementById("order-modal");
const orderForm = document.getElementById("order-form");
const confirmOrderButton = document.getElementById("confirm-order");
const cartTitle = document.querySelector(".cart-title");

// Load cart from localStorage when the page is loaded
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Function to render the cart content from localStorage
function renderCart() {
    // Clear the current cart
    cartContent.innerHTML = "";

    // Go over the items and add them back to the cart
    cartItems.forEach(item => {
        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        cartBox.innerHTML = `
            <img src="${item.imgSrc}" class="cart-img">
            <div class="cart-detail">
                <h2 class="cart-product-title">${item.title}</h2>
                <span class="cart-price">${item.price}</span>
                <div class="cart-quantity">
                    <button class="decrement">-</button>
                    <span class="number">${item.quantity}</span>
                    <button class="increment">+</button>
                </div>
            </div>
            <i class="ri-delete-bin-line cart-remove"></i>
        `;
        
        // Add event listener to remove item
        cartBox.querySelector(".cart-remove").addEventListener("click", () => {
            removeItemFromCart(item.title);
        });

        // Add event listener for quantity change
        cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
            if (event.target.classList.contains("decrement")) {
                updateQuantity(item.title, -1);
            } else if (event.target.classList.contains("increment")) {
                updateQuantity(item.title, 1);
            }
        });

        // Append the item to the cart content
        cartContent.appendChild(cartBox);
    });

    // Update the cart count and total price
    updateCartCount();
    updateTotalPrice();
}

// Function to update the cart count badge/red circle
function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCountBadge.style.visibility = totalItems > 0 ? "visible" : "hidden";
    cartItemCountBadge.textContent = totalItems;
}

// Function to update total price based on the current cart contents
function updateTotalPrice() {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += parseFloat(item.price.replace('$', '')) * item.quantity;
    });
    const totalPriceElement = document.querySelector(".total-price");
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

// Function to add product to the cart
function addToCart(productContent) {
    const productImgSrc = productContent.querySelector(".product-box img").src;
    const productTitle = productContent.querySelector(".product-title").textContent;
    const productPrice = productContent.querySelector(".price").textContent;

    // Check if the item already exists in the cart
    const existingItem = cartItems.find(item => item.title === productTitle);

    if (existingItem) {
        // If the item exists, increment the quantity
        existingItem.quantity++;
    } else {
        // If the item doesn't exist, add a new item to the cart
        cartItems.push({
            imgSrc: productImgSrc,
            title: productTitle,
            price: productPrice,
            quantity: 1
        });
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Re-render the cart
    renderCart();
}

// Function to remove an item from the cart
function removeItemFromCart(productTitle) {
    cartItems = cartItems.filter(item => item.title !== productTitle);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    renderCart();
}

// Function to update the quantity of an item
function updateQuantity(productTitle, change) {
    const item = cartItems.find(item => item.title === productTitle);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItemFromCart(productTitle);
        } else {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            renderCart();
        }
    }
}

// Function to show the modal
function showModal() {
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

// Open/Close the cart
cartIcon.addEventListener("click", () => cart.classList.toggle("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

// Add event listeners to each "Add to Cart" button
addCartButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        const productContent = event.target.closest(".product-content"); 
        addToCart(productContent);
    });
});

// Event listener for confirming the order in the modal
orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get user details from the form
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const birthday = document.getElementById("birthday").value;

    if (name && email && birthday) {
        alert(`Order Confirmed! \nName: ${name} \nEmail: ${email} \nBirthday: ${birthday}`);
        
        // Clear cart after order confirmation
        cartItems = [];
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        renderCart();

        // Close the modal
        closeModal();
    } else {
        alert("Please fill in all fields!");
    }
});

// Open the modal when "Buy Now" is clicked
const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", showModal);

// Close the modal when the "Close" button is clicked
const closeModalButton = document.querySelector("#cart-close");
closeModalButton.addEventListener("click", closeModal);

// Initial render of the cart when the page loads
document.addEventListener("DOMContentLoaded", renderCart);







