document.getElementById("checkout-btn").addEventListener("click", prosesCheckout);

function prosesCheckout() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const checkboxes = document.querySelectorAll(".pilih-item");

  const selectedItems = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const index = cb.dataset.index;
      selectedItems.push(keranjang[index]);
    }
  });

  if (selectedItems.length === 0) {
    alert("Silakan pilih minimal satu produk untuk checkout.");
    return;
  }

  localStorage.setItem("checkoutSementara", JSON.stringify(selectedItems));

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("checkout-summary").textContent = `Total: ${formatDollar(total)}`;

  document.getElementById("checkout-modal").classList.remove("hidden");
}

function formatDollar(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function renderKeranjang() {
  const container = document.getElementById("cart-items");
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const checkboxStatus = JSON.parse(localStorage.getItem("checkboxStatus")) || {};
  container.innerHTML = "";

  keranjang.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "relative flex items-center bg-white rounded-lg shadow p-4 gap-4";

    itemDiv.innerHTML = `
      <input type="checkbox" class="pilih-item absolute left-2 top-1/2 -translate-y-1/2 scale-125" data-index="${index}" ${checkboxStatus[index] ? "checked" : ""}>
      <button class="absolute top-2 right-2 hapus-btn" data-index="${index}" title="Delete">
        <img src="/foto/sampah.png" alt="Delete" class="w-5 h-5 hover:scale-110 transition-transform">
      </button>
      <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-contain ml-6" />
      <div class="flex-1">
        <h3 class="font-semibold">${item.title}</h3>
        <p class="text-sm text-gray-600">${formatDollar(item.price)}</p>
        <div class="flex items-center mt-2 space-x-2">
          <button class="decrease px-2 py-1 bg-gray-300 rounded text-sm font-bold" data-index="${index}">-</button>
          <span class="text-sm font-semibold">${item.quantity}</span>
          <button class="increase px-2 py-1 bg-gray-300 rounded text-sm font-bold" data-index="${index}">+</button>
        </div>
      </div>
    `;

    container.appendChild(itemDiv);
  });

  attachEventHandlers();
}

function attachEventHandlers() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const checkboxStatus = JSON.parse(localStorage.getItem("checkboxStatus")) || {};

  document.querySelectorAll(".increase").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      keranjang[index].quantity++;
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      renderKeranjang();
    }); 
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      if (keranjang[index].quantity > 1) {
        keranjang[index].quantity--;
        localStorage.setItem("keranjang", JSON.stringify(keranjang));
        renderKeranjang();
      }
    });
  });

  document.querySelectorAll(".hapus-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.currentTarget.dataset.index;
      keranjang.splice(index, 1);
      localStorage.setItem("keranjang", JSON.stringify(keranjang));
      delete checkboxStatus[index];
      localStorage.setItem("checkboxStatus", JSON.stringify(checkboxStatus));
      renderKeranjang();
    });
  });

  document.querySelectorAll(".pilih-item").forEach(cb => {
    cb.addEventListener("change", () => {
      checkboxStatus[cb.dataset.index] = cb.checked;
      localStorage.setItem("checkboxStatus", JSON.stringify(checkboxStatus));
      hitungTotalTerpilih();

      const semuaCb = document.querySelectorAll(".pilih-item");
      const semuaDicentang = Array.from(semuaCb).every(cb => cb.checked);
      document.getElementById("pilih-semua").checked = semuaDicentang;
    });
  });

  // Update status "pilih semua"
  const semuaCb = document.querySelectorAll(".pilih-item");
  const semuaDicentang = Array.from(semuaCb).length > 0 && Array.from(semuaCb).every(cb => cb.checked);
  document.getElementById("pilih-semua").checked = semuaDicentang;
}

function hitungTotalTerpilih() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const checkboxes = document.querySelectorAll(".pilih-item");
  let total = 0;

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const index = cb.dataset.index;
      total += keranjang[index].price * keranjang[index].quantity;
    }
  });

  document.getElementById("total-harga").textContent = formatDollar(total);
  return total;
}

function togglePopup() {
  document.getElementById("popup-order-summary").classList.toggle("hidden");
}

function togglePaymentPopup() {
  const popup = document.getElementById("payment-method-popup");
  popup.classList.toggle("hidden");

  const keranjang = JSON.parse(localStorage.getItem("checkoutSementara")) || [];
  const subtotal = keranjang.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  document.getElementById("subtotal-text").textContent = formatDollar(subtotal);
  document.getElementById("total-text").textContent = formatDollar(total);
}

function selectPayment(method) {
  localStorage.setItem("metodePembayaran", method);
}

function proceedToOrderSummary() {
  togglePaymentPopup();
  togglePopup();
}

const checkoutBtn = document.getElementById("checkout-btn");
const modal = document.getElementById("checkout-modal");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const summary = document.getElementById("checkout-summary");
const pilihSemua = document.getElementById("pilih-semua");

checkoutBtn.addEventListener("click", () => {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const checkboxes = document.querySelectorAll(".pilih-item");
  const selectedItems = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      const index = cb.dataset.index;
      selectedItems.push(keranjang[index]);
    }
  });

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  summary.textContent = `Your total: ${formatDollar(total)}`;

  if (selectedItems.length === 0) {
    alert("Please select at least one item for checkout.");
    return;
  }

  localStorage.setItem("checkoutSementara", JSON.stringify(selectedItems));
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

confirmBtn.addEventListener("click", () => {
  togglePaymentPopup();

  const checkoutItems = JSON.parse(localStorage.getItem("checkoutSementara")) || [];
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  keranjang = keranjang.filter(itemInCart => {
    return !checkoutItems.some(itemCheckout => itemCheckout.id === itemInCart.id);
  });

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  localStorage.removeItem("checkoutSementara");

  // Hapus status checkbox yang sudah dibeli
  let checkboxStatus = JSON.parse(localStorage.getItem("checkboxStatus")) || {};
  checkoutItems.forEach(item => {
    const index = keranjang.findIndex(k => k.id === item.id);
    if (index !== -1) delete checkboxStatus[index];
  });
  localStorage.setItem("checkboxStatus", JSON.stringify(checkboxStatus));

  renderKeranjang();
  hitungTotalTerpilih();
  modal.classList.add("hidden");

  alert("Checkout berhasil! Item telah dihapus dari keranjang.");
});

pilihSemua.addEventListener("change", () => {
  const status = pilihSemua.checked;
  const checkboxStatus = JSON.parse(localStorage.getItem("checkboxStatus")) || {};

  document.querySelectorAll(".pilih-item").forEach(cb => {
    cb.checked = status;
    checkboxStatus[cb.dataset.index] = status;
  });

  localStorage.setItem("checkboxStatus", JSON.stringify(checkboxStatus));
  hitungTotalTerpilih();
});

renderKeranjang();
