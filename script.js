// Sample Products
const products = {
    clothes: [
        { id: 1, name: 'Classic Tee', price: 29.99, emoji: '👕', category: 'clothes' },
        { id: 2, name: 'Hoodie', price: 59.99, emoji: '🧥', category: 'clothes' },
        { id: 3, name: 'Baseball Cap', price: 24.99, emoji: '🧢', category: 'clothes' },
        { id: 4, name: 'Cargo Pants', price: 74.99, emoji: '👖', category: 'clothes' },
        { id: 5, name: 'Jacket', price: 99.99, emoji: '🧥', category: 'clothes' },
        { id: 6, name: 'Socks Pack', price: 14.99, emoji: '🧦', category: 'clothes' }
    ],
    music: [
        { id: 101, name: 'Digital Album - Vol.1', price: 9.99, emoji: '🎵', category: 'music' },
        { id: 102, name: 'Digital Album - Vol.2', price: 9.99, emoji: '🎵', category: 'music' },
        { id: 103, name: 'Exclusive EP', price: 4.99, emoji: '🎧', category: 'music' },
        { id: 104, name: 'Beat Pack', price: 19.99, emoji: '🎼', category: 'music' },
        { id: 105, name: 'Vinyl Record - Collector\'s Edition', price: 29.99, emoji: '🎛️', category: 'music' },
        { id: 106, name: 'Merch Bundle + Album', price: 49.99, emoji: '🎁', category: 'music' }
    ]
};

let cart = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('clothes');
    renderProducts('music');
    loadCartFromStorage();
});

// Render products to the DOM
function renderProducts(category) {
    const gridId = `${category}-grid`;
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    products[category].forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    let product = null;

    // Find the product
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }

    if (product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCartToStorage();
        updateCartCount();
        alert(`${product.name} added to cart!`);
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    renderCart();
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
        renderCart();
    } else {
        modal.style.display = 'none';
    }
}

// Render cart items
function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} (x${item.quantity})</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItemsDiv.appendChild(cartItem);
        });
    }

    updateTotal();
}

// Update cart count in navbar
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Update total price
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-price').textContent = total.toFixed(2);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Proceeding to checkout. Total: $${total.toFixed(2)}\n\nIntegrate with Stripe or PayPal here!`);
    // Here you would integrate with Stripe, PayPal, or another payment processor
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('painmademdot-cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('painmademdot-cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};