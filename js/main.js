// Hiển thị menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle?.addEventListener('click', () => {
  navbar.classList.toggle('d-none');
  navbar.classList.toggle('flex-column');
  navbar.classList.toggle('bg-white');
  navbar.classList.toggle('p-3');
});
