let jumlah = 1;

function ubahJumlah(change) {
  jumlah += change;
  if (jumlah < 1) jumlah = 1;
  document.getElementById("jumlah").textContent = jumlah;
}

function togglePopup() {
  document.getElementById("popup-order-summary").classList.add("hidden");
}

function tambahKeKeranjang(produk) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const index = keranjang.findIndex(item => item.id === produk.id);

  if (index !== -1) {
    keranjang[index].quantity += jumlah;
  } else {
    keranjang.push({
      id: produk.id,
      title: produk.title,
      price: produk.price,
      image: produk.image,
      quantity: jumlah
    });
  }

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  jumlah = 1;
  document.getElementById("jumlah").textContent = jumlah;
}

function updateCartCount() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const total = keranjang.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = total;
}

const produk = JSON.parse(localStorage.getItem("produkDetail"));

if (!produk) {
  document.getElementById("detail-container").innerHTML = "<p class='text-red-500'>Produk tidak ditemukan.</p>";
} else {
  document.getElementById("detail-container").innerHTML = `
   <div class="w-full md:w-1/2 flex justify-center">
  <img src="${produk.image}" alt="${produk.title}" class="rounded-lg shadow-md max-w-xs w-full h-auto" />
</div>
    <div class="flex-1 space-y-4">
      <h1 class="text-2xl font-extrabold text-[#6b3030]">${produk.title}</h1>
      <p class="text-green-600 text-lg font-semibold">Rp ${produk.price.toLocaleString()}</p>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="flex items-center gap-1">
          <span class="text-yellow-400">★★★★★</span>
          <span class="text-black font-medium">5.0</span>
        </span>
        <span>•</span>
        <span>8k Penilaian</span>
        <span>•</span>
        <span>10k Sold</span>
      </div>
      <div class="text-sm text-black leading-relaxed space-y-2">
        ${produk.description.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
      <div class="border-t border-gray-200 pt-4 text-sm">
        <p>Pengiriman ke <strong>Kota Depok</strong></p>
        <p>Ongkos kirim <strong>Rp35.000</strong></p>
      </div>
      <div class="controls flex items-center gap-2 text-sm">
        <label class="font-semibold">Jumlah:</label>
        <button onclick="ubahJumlah(-1)" class="px-2 py-1 bg-gray-200 rounded">-</button>
        <span id="jumlah" class="font-medium">1</span>
        <button onclick="ubahJumlah(1)" class="px-2 py-1 bg-gray-200 rounded">+</button>
      </div>
      <div class="flex gap-4 pt-4">
        <button id="add-to-cart-detail" class="bg-[#6b3030] text-white px-4 py-2 rounded shadow hover:bg-[#532424]">Tambah Ke Troli</button>
        <button id="beli-sekarang-btn" class="bg-[#e3c2b1] text-white px-4 py-2 rounded shadow hover:bg-[#d4a089]">Beli Sekarang</button>
      </div>
    </div>
  `;

  document.getElementById("add-to-cart-detail").addEventListener("click", () => {
    tambahKeKeranjang(produk);
    alert(`${jumlah}x ${produk.title} ditambahkan ke keranjang!`);
    updateCartCount();
  });

  document.getElementById("beli-sekarang-btn").addEventListener("click", () => {
    const totalHarga = jumlah * produk.price;
    document.getElementById("checkout-summary").textContent = `Total belanja Anda: Rp${totalHarga.toLocaleString()}`;
    document.getElementById("checkout-modal").classList.remove("hidden");
  });

  updateCartCount();
}

document.getElementById('cancel-btn').addEventListener('click', function () {
  document.getElementById('checkout-modal').classList.add('hidden');
});

document.getElementById('confirm-btn').addEventListener('click', function () {
  document.getElementById('checkout-modal').classList.add('hidden');
  document.getElementById('popup-order-summary').classList.remove('hidden');
});
