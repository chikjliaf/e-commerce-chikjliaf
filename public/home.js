let allProducts = [];

async function ambilData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json(); // untuk menunggu hasil sebelum melanjutkan eksekusi kode berikutnya
    allProducts = data;
    tampilkanProduk(data);
  } catch (error) {
    console.error("Terjadi error", error);
    document.getElementById("data-product").innerHTML =
      '<p class="text-center text-red-500">Gagal memuat produk.</p>';
  }
}

function tampilkanProduk(data) {
  const displayhtml = document.getElementById("data-product"); //nilai yang gabisa di ubah
  displayhtml.innerHTML = "";

  data.forEach((post, index) => {
    const postElement = document.createElement("div");
    postElement.className =
      "flex flex-col justify-between border border-gray-200 rounded-xl p-4 w-64 bg-white shadow-md transition-transform duration-200 hover:scale-105";

    postElement.innerHTML = `
      <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-contain mb-3" />
      <h3 class="text-base font-semibold mb-1 h-10 overflow-hidden">${post.title}</h3>
      <p class="text-sm text-gray-600 leading-tight text-justify line-clamp-2 mb-2">
        ${post.description}
      </p>
      <div class="flex justify-between items-center mt-3">
        <h2 class="text-green-400 text-sm font-light">$${post.price}</h2>
        <button class="add-to-cart bg-white-500 text-white px-3 py-1 rounded text-sm hover:bg-[#e3c2b1]" data-index="${index}">🛒</button> 
      </div>
    `;

    postElement.addEventListener("click", () => {
      localStorage.setItem("produkDetail", JSON.stringify(post));
      window.location.href = "detail product.html";
    });

    displayhtml.appendChild(postElement);
  });

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); //e.stopPropagation() mencegah klik ini menjalankan fungsi click yang ada di seluruh postElement (yang akan membawa ke halaman detail).
      const index = this.getAttribute("data-index");
      const produk = data[index]; //mengambil objek produk sesuai dengan index tersebut.
      tambahKeKeranjang(produk);
      alert(`${produk.title} ditambahkan ke keranjang!`);
    });
  });

  updateCartCount();
}

function tambahKeKeranjang(produk) {
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const index = keranjang.findIndex(item => item.id === produk.id);

  if (index !== -1) {
    keranjang[index].quantity += 1;
  } else {
    keranjang.push({
      id: produk.id,
      title: produk.title,
      price: produk.price,
      image: produk.image,
      quantity: 1
    });
  }

  localStorage.setItem("keranjang", JSON.stringify(keranjang));
  updateCartCount();
}

function updateCartCount() {
  const keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
  const totalItem = keranjang.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItem;
}

document.getElementById("search").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const hasilFilter = allProducts.filter(product =>
    product.title.toLowerCase().includes(keyword)
  );
  tampilkanProduk(hasilFilter);
});

ambilData();
