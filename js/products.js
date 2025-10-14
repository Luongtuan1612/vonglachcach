// Xử lý thêm sản phẩm vào giỏ
const addButtons = document.querySelectorAll('.add-to-cart');

addButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      img: btn.dataset.img,
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Thông báo đẹp hơn
    alert(`✨ Đã thêm "${product.name}" vào giỏ hàng!`);
  });
});
