// main.js – xử lý header & menu mobile & hiệu ứng cuộn
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const header = document.getElementById("mainHeader");

  // Toggle menu mobile
  menuToggle?.addEventListener("click", () => {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("show");
    mobileMenu.style.display = mobileMenu.classList.contains("show") ? "block" : "none";
  });

  // Đóng menu khi click link
  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("show");
      mobileMenu.style.display = "none";
    });
  });

  // Hiệu ứng header khi cuộn
  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 50);
  });

  // Cập nhật số lượng giỏ hàng khi load trang
  updateCartCount();
});

// Cập nhật số lượng hiển thị trên icon 🛍️
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => (el.textContent = total));
}
