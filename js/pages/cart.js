import { loadCart, saveCart, updateCartCount, calculateTotal } from '../utils/cart.js';

function initCart() {
  const cartContainer = document.getElementById('cart-items-container');
  const cart = loadCart();
  
  function updateCartUI() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-basket fa-3x"></i>
          <p>Your cart is empty</p>
          <a href="/" class="btn-primary">Browse Menu</a>
        </div>
      `;
      return;
    }

    cartContainer.innerHTML = cart.map((item, index) => 
      `
      <div class="cart-item animate-on-scroll" style="--delay: ${index * 0.1}s">
        <div class="cart-item-image">
          <img src="${item.image || 'https://placehold.co/100x100'}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p class="price">$${item.price.toFixed(2)}</p>
          ${item.type === 'subscription' ? 
            `<span class="subscription-badge">
              <i class="fas fa-sync-alt"></i> Subscription
            </span>` : ''}
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-total">
          $${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      `
    ).join('');

    const total = calculateTotal(cart).toFixed(2);
    document.getElementById('cart-total').textContent = total;
    document.getElementById('cart-final-total').textContent = total;
  }

  window.updateQuantity = (index, change) => {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity > 0) {
      item.quantity = newQuantity;
      saveCart(cart);
      updateCartUI();
      updateCartCount();
    }
  };

  window.removeItem = (index) => {
    cart.splice(index, 1);
    saveCart(cart);
    updateCartUI();
    updateCartCount();
  };

  updateCartUI();
}

document.addEventListener('DOMContentLoaded', initCart);