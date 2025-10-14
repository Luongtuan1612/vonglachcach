const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <tr><td colspan="6" class="text-center text-secondary py-4">🛍️ Giỏ hàng trống!</td></tr>
    `;
    cartTotal.textContent = '0₫';
    return;
  }

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.img}" alt="${item.name}" width="80" class="rounded"></td>
      <td>${item.name}</td>
      <td>${item.price.toLocaleString('vi-VN')}₫</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateQuantity(${index}, -1)">-</button>
        ${item.quantity}
        <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateQuantity(${index}, 1)">+</button>
      </td>
      <td class="fw-semibold">${subtotal.toLocaleString('vi-VN')}₫</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Xóa</button></td>
    `;
    cartItemsContainer.appendChild(row);
  });

  cartTotal.textContent = total.toLocaleString('vi-VN') + '₫';
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveAndRender();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

checkoutBtn?.addEventListener('click', () => {
  if (cart.length === 0) return alert('🛒 Giỏ hàng trống!');
  alert('🎉 Cảm ơn bạn đã mua hàng! Thanh toán thành công.');
  localStorage.removeItem('cart');
  cart = [];
  renderCart();
});

renderCart();
