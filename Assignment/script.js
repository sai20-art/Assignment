const products = [
    { id: 1, name: "Tie-Dye Lounge Set", price: 150.00, image: "images/image-1.jpg" },
    { id: 2, name: "Sunburst Tracksuit", price: 150.00, image: "images/image-2.jpg" },
    { id: 3, name: "Retro Red Streetwear", price: 150.00, image: "images/image-3.jpg" },
    { id: 4, name: "Urban Sportwear Combo", price: 150.00, image: "images/image-4.jpg" },
    { id: 5, name: "Oversized Knit & Coat", price: 150.00, image: "images/image-5.jpg" },
    { id: 6, name: "Chic Monochrome Blazer", price: 150.00, image: "images/image-6.jpg" }
];

let bundle = {};
const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_RATE = 0.30;

const productsGrid = document.getElementById('productsGrid');
const bundleItems = document.getElementById('bundleItems');
const subtotalAmount = document.getElementById('subtotalAmount');
const discountAmount = document.getElementById('discountAmount');
const discountRow = document.getElementById('discountRow');
const addToCartBtn = document.getElementById('addToCartBtn');

function init() {
    renderProducts();
    updateBundleDisplay();
}

function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-bundle-btn" onclick="toggleProduct(${product.id})">
                    <span class="btn-text">Add to Bundle</span>
                    <span class="btn-icon">+</span>
                </button>
            </div>
        </div>
    `).join('');
}

function toggleProduct(productId) {
    const product = products.find(p => p.id === productId);

    if (bundle[productId]) {
        delete bundle[productId];
    } else {
        bundle[productId] = { ...product, quantity: 1 };
    }

    updateProductButtons();
    updateBundleDisplay();
}

function updateProductButtons() {
    const buttons = productsGrid.querySelectorAll('.add-to-bundle-btn');

    products.forEach((product, index) => {
        const button = buttons[index];
        const btnText = button.querySelector('.btn-text');
        const btnIcon = button.querySelector('.btn-icon');

        if (bundle[product.id]) {
            button.classList.add('added');
            btnText.textContent = 'Added to Bundle';
            btnIcon.textContent = '✓';
        } else {
            button.classList.remove('added');
            btnText.textContent = 'Add to Bundle';
            btnIcon.textContent = '+';
        }
    });
}

function updateBundleDisplay() {
    const bundleArray = Object.values(bundle);
    const totalItems = bundleArray.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = bundleArray.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (bundleArray.length === 0) {
        bundleItems.innerHTML = '<p style="color: #9ca3af; font-style: italic; text-align: center; padding: 2rem 0;">No items in bundle</p>';
    } else {
        bundleItems.innerHTML = bundleArray.map(item => `
            <div class="bundle-item">
                <img src="${item.image}" alt="${item.name}" class="bundle-item-image">
                <div class="bundle-item-info">
                    <div class="bundle-item-name">${item.name}</div>
                    <div class="bundle-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})" title="Remove item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    const hasDiscount = totalItems >= DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? subtotal * DISCOUNT_RATE : 0;
    const finalTotal = subtotal - discount;

    if (hasDiscount && discount > 0) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = `- $${discount.toFixed(2)} (30%)`;
    } else {
        discountRow.style.display = 'none';
    }

    subtotalAmount.textContent = `$${finalTotal.toFixed(2)}`;
    addToCartBtn.disabled = bundleArray.length === 0;

    const btnText = addToCartBtn.querySelector('.btn-text');

    if (bundleArray.length === 0) {
        btnText.textContent = 'Add to Cart';
    } else if (hasDiscount) {
        btnText.textContent = `Add to Cart (${totalItems} items)`;
    } else {
        btnText.textContent = `Add ${DISCOUNT_THRESHOLD - totalItems} items to Proceed`;
    }
}

function updateQuantity(productId, change) {
    if (bundle[productId]) {
        bundle[productId].quantity += change;

        if (bundle[productId].quantity <= 0) {
            delete bundle[productId];
            updateProductButtons();
        }

        updateBundleDisplay();
    }
}

function removeItem(productId) {
    delete bundle[productId];
    updateProductButtons();
    updateBundleDisplay();
}


addToCartBtn.addEventListener('click', () => {
    const bundleArray = Object.values(bundle);
    const totalItems = bundleArray.reduce((sum, item) => sum + item.quantity, 0);

    if (bundleArray.length === 0) return;

    const btnText = addToCartBtn.querySelector('.btn-text');

    if (totalItems >= DISCOUNT_THRESHOLD) {
        btnText.textContent = "Added to Cart";
        addToCartBtn.disabled = true;
    } else {
        updateBundleDisplay();
    }
});

document.addEventListener('DOMContentLoaded', init);