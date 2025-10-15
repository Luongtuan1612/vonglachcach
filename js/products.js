// products.js – xử lý thêm sản phẩm vào giỏ hàng

document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart");

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const product = {
        id: parseInt(btn.dataset.id),
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
        img: btn.dataset.img,
        quantity: 1
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      showToast(`✨ Đã thêm "${product.name}" vào giỏ hàng!`);
    });
  });
});

// Hiệu ứng toast thông báo
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
