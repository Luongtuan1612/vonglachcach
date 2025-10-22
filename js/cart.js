// ===================== GIỎ HÀNG =====================
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// Lấy giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cập nhật hiển thị
function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<tr><td colspan="6" class="py-4 text-muted">🛍️ Giỏ hàng trống!</td></tr>';
    if (cartTotal) cartTotal.textContent = "0₫";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.img}" width="70" class="rounded shadow-sm"></td>
      <td>${item.name}</td>
      <td>${item.price.toLocaleString("vi-VN")}₫</td>
      <td>
        <input type="number" value="${item.quantity}" min="1"
          class="form-control text-center quantity-input"
          data-index="${index}">
      </td>
      <td class="text-gold">${itemTotal.toLocaleString("vi-VN")}₫</td>
      <td>
        <button class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    cartItemsContainer.appendChild(row);
  });

  if (cartTotal) cartTotal.textContent = total.toLocaleString("vi-VN") + "₫";
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Xóa sản phẩm
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn") || e.target.closest(".remove-btn")) {
    const btn = e.target.closest(".remove-btn");
    const index = btn.dataset.index;
    cart.splice(index, 1);
    renderCart();
  }
});

// Thay đổi số lượng
document.addEventListener("input", (e) => {
  if (e.target.classList.contains("quantity-input")) {
    const index = e.target.dataset.index;
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      cart[index].quantity = newQuantity;
      renderCart();
    }
  }
});

// Gọi khi tải trang
renderCart();


// ===================== FORM & ĐẶT HÀNG =====================
const showFormBtn = document.getElementById("show-form-btn");
const orderForm = document.getElementById("orderForm");
const orderSummary = document.getElementById("orderSummary");
const overlay = document.getElementById("overlay");
const finalOrderBtn = document.getElementById("finalOrderBtn");

// Hiện form đặt hàng
if (showFormBtn) {
  showFormBtn.addEventListener("click", () => {
    overlay.style.display = "block";
    orderForm.classList.add("show");
  });
}

// ===================== LẤY ĐỊA CHỈ VIỆT NAM =====================
const provinceSelect = document.getElementById("province");
const districtSelect = document.getElementById("district");
const wardSelect = document.getElementById("ward");

if (provinceSelect && districtSelect && wardSelect) {
  // Load tỉnh
  fetch("https://provinces.open-api.vn/api/p/")
    .then(res => res.json())
    .then(data => {
      data.forEach(province => {
        const option = document.createElement("option");
        option.value = province.code;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
      });
    });

  // Khi chọn tỉnh -> load huyện
  provinceSelect.addEventListener("change", () => {
    districtSelect.innerHTML = '<option value="">-- Chọn huyện/quận --</option>';
    wardSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
    if (!provinceSelect.value) return;

    fetch(`https://provinces.open-api.vn/api/p/${provinceSelect.value}?depth=2`)
      .then(res => res.json())
      .then(data => {
        data.districts.forEach(district => {
          const option = document.createElement("option");
          option.value = district.code;
          option.textContent = district.name;
          districtSelect.appendChild(option);
        });
      });
  });

  // Khi chọn huyện -> load xã
  districtSelect.addEventListener("change", () => {
    wardSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
    if (!districtSelect.value) return;

    fetch(`https://provinces.open-api.vn/api/d/${districtSelect.value}?depth=2`)
      .then(res => res.json())
      .then(data => {
        data.wards.forEach(ward => {
          const option = document.createElement("option");
          option.value = ward.name;
          option.textContent = ward.name;
          wardSelect.appendChild(option);
        });
      });
  });
}


// ===================== GỬI FORM XEM ĐƠN HÀNG =====================
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const note = document.getElementById("note");

    const provinceName = provinceSelect?.selectedOptions[0]?.text || "";
    const districtName = districtSelect?.selectedOptions[0]?.text || "";
    const wardName = wardSelect?.selectedOptions[0]?.text || "";

    let isValid = true;
    clearErrors();

    if (name.value.trim().length < 3) {
      showError(name, "Vui lòng nhập họ tên hợp lệ (tối thiểu 3 ký tự)");
      isValid = false;
    }

    const phoneRegex = /^(0[0-9]{9})$/;
    if (!phoneRegex.test(phone.value.trim())) {
      showError(phone, "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)");
      isValid = false;
    }

    if (address.value.trim().length < 5) {
      showError(address, "Vui lòng nhập địa chỉ cụ thể");
      isValid = false;
    }

    if (!provinceName || !districtName || !wardName) {
      alert("⚠️ Vui lòng chọn đầy đủ Tỉnh/Thành - Quận/Huyện - Xã/Phường!");
      isValid = false;
    }

    if (note.value.trim().length > 150) {
      showError(note, "Ghi chú quá dài (tối đa 150 ký tự)");
      isValid = false;
    }

    if (!isValid) return;

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartData.length === 0) return alert("⚠️ Giỏ hàng trống!");

    const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const fullAddress = `${address.value}, ${wardName}, ${districtName}, ${provinceName}`;

    const orderHTML = `
      <p><strong>👤 Khách hàng:</strong> ${name.value}</p>
      <p><strong>📞 Số điện thoại:</strong> ${phone.value}</p>
      <p><strong>🏠 Địa chỉ giao hàng:</strong> ${fullAddress}</p>
      ${note.value ? `<p><strong>📝 Ghi chú:</strong> ${note.value}</p>` : ""}
      <hr>
      <h5 class="text-gold mb-3">Sản phẩm đã đặt:</h5>
      <ul style="list-style:none; padding-left:0;">
        ${cartData.map(item => `
          <li class="mb-2">
            <img src="${item.img}" width="60" class="me-2 rounded"> 
            ${item.name} × ${item.quantity} — 
            <span class="text-gold">${(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
          </li>
        `).join("")}
      </ul>
      <hr>
      <h5 class="text-end text-gold">Tổng cộng: ${total.toLocaleString("vi-VN")}₫</h5>
    `;

    document.getElementById("orderDetails").innerHTML = orderHTML;

    orderForm.classList.remove("show");
    orderSummary.classList.add("show");
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
  });
}


// ===================== HỖ TRỢ VALIDATE =====================
function showError(input, message) {
  let error = document.createElement("small");
  error.className = "text-danger mt-1 d-block";
  error.textContent = message;
  input.classList.add("is-invalid");
  input.parentElement.appendChild(error);
}

function clearErrors() {
  document.querySelectorAll(".text-danger").forEach(el => el.remove());
  document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
}


// ===================== NÚT "ĐẶT HÀNG" (BƯỚC CUỐI) =====================
if (finalOrderBtn) {
  finalOrderBtn.addEventListener("click", () => {
    const orderInfo = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      province: provinceSelect?.selectedOptions[0]?.text || "",
      district: districtSelect?.selectedOptions[0]?.text || "",
      ward: wardSelect?.selectedOptions[0]?.text || "",
      note: document.getElementById("note").value,
      date: new Date().toLocaleString("vi-VN"),
      order: document.getElementById("orderDetails").innerHTML,
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderInfo);
    localStorage.setItem("orders", JSON.stringify(orders));

    showToast("🎉 Đơn hàng của bạn đã được gửi thành công!");
    overlay.style.display = "none";
    orderSummary.classList.remove("show");
  });
}


// ===================== ẨN POPUP KHI CLICK NỀN =====================
if (overlay) {
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    orderForm.classList.remove("show");
    orderSummary.classList.remove("show");
  });
}


// ===================== TOAST MESSAGE =====================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
