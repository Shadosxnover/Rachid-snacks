// Cart management utilities
export function saveCart(cart) {
  localStorage.setItem('ayoubCart', JSON.stringify(cart));
}

export function loadCart() {
  const savedCart = localStorage.getItem('ayoubCart');
  return savedCart ? JSON.parse(savedCart) : [];
}

export function updateCartCount() {
  const cart = loadCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

export function calculateTotal(cart) {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}