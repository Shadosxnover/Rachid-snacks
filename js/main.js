import { initScrollAnimations, initParallaxEffect } from './utils/animations.js';
import { loadCart, saveCart, updateCartCount } from './utils/cart.js';

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initParallaxEffect();
  updateCartCount();
});

// Handle quantity changes
document.querySelectorAll('.quantity-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const button = e.target.closest('.quantity-btn');
    const action = button.dataset.action;
    const input = button.parentElement.querySelector('.quantity-input');
    let value = parseInt(input.value);

    if (action === 'increase') {
      value++;
    } else if (action === 'decrease' && value > 1) {
      value--;
    }

    input.value = value;
  });
});

// Handle adding items to cart
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    const cart = loadCart();
    
    if (button.dataset.subscription) {
      addSubscriptionToCart(button, cart);
    } else {
      addItemToCart(button, cart);
    }
  });
});

// Add regular item to cart
function addItemToCart(button, cart) {
  const menuItem = button.closest('.menu-item');
  const id = button.dataset.id;
  const name = menuItem.querySelector('h2').textContent;
  const price = parseFloat(button.dataset.price);
  const quantity = parseInt(menuItem.querySelector('.quantity-input').value);
  // Get the image URL from the menu item
  const imageUrl = menuItem.querySelector('img').src;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity,
      type: 'item',
      image: imageUrl // Add the image URL to the cart item
    });
  }

  saveCart(cart);
  updateCartCount();
  showNotification(`Added ${quantity} ${name} to cart`);
}

// Add subscription to cart
function addSubscriptionToCart(button, cart) {
  const tierCard = button.closest('.tier-card');
  const name = tierCard.querySelector('h3').textContent;
  const priceText = tierCard.querySelector('.price').textContent;
  const price = parseFloat(priceText.replace('$', ''));
  const id = `sub-${button.dataset.subscription}`;
  // Get the subscription icon or default image
  const iconElement = tierCard.querySelector('.tier-icon i');
  const iconClass = iconElement ? iconElement.className : 'fas fa-crown';

  const existingItem = cart.find(item => item.id === id);

  if (!existingItem) {
    cart.push({
      id,
      name: `${name} Subscription`,
      price,
      quantity: 1,
      type: 'subscription',
      iconClass: iconClass, // Store the icon class for subscriptions
      image: null // Set to null for subscriptions as they use icons
    });

    saveCart(cart);
    updateCartCount();
    showNotification(`Added ${name} Subscription to cart`);
  } else {
    showNotification('Subscription already in cart');
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});