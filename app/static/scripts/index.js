document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");
  const orderForm = document.getElementById("order-form");
  const orderSummary = document.getElementById("order-summary");
  const customerNameInput = document.getElementById("customer-name");
  const customerAddressInput = document.getElementById("customer-address");
  const orderMessageInput = document.getElementById("order-message");
  const placeOrderButton = document.getElementById("place-order");

  let cart = [];

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
                <span>${item.name} - ${item.price.toLocaleString()} x ${item.quantity}</span>
                <button class="remove-from-cart" data-index="${index}">Hapus</button>
            `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price * item.quantity;
    });

    cartTotalElement.textContent = total.toLocaleString();
    checkoutButton.disabled = cart.length === 0;
  }

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productElement = this.closest(".product");
      const name = productElement.querySelector("h3").textContent;
      const price = parseInt(productElement.querySelector(".price").textContent.replace(/[^0-9]/g, ""));

      const existingItem = cart.find((item) => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      updateCart();
    });
  });

  cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart")) {
      const index = event.target.getAttribute("data-index");
      cart.splice(index, 1);
      updateCart();
    }
  });

  checkoutButton.addEventListener("click", function () {
    orderSummary.innerHTML = cart.map((item) => `<p>${item.name} - ${item.price.toLocaleString()} x ${item.quantity}</p>`).join("");
    orderForm.style.display = "block";
  });

  placeOrderButton.addEventListener("click", function () {
    const name = customerNameInput.value.trim();
    const address = customerAddressInput.value.trim();
    const message = orderMessageInput.value.trim();

    if (!name || !address) {
      alert("Silakan isi nama dan alamat sebelum memesan.");
      return;
    }

    let orderText = `Halo, saya ingin memesan:\n`;
    cart.forEach((item) => {
      orderText += `- ${item.name} x ${item.quantity}\n`;
    });
    orderText += `\nNama: ${name}\nAlamat: ${address}\nPesan tambahan: ${message}`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=6281234567890&text=${encodeURIComponent(orderText)}`;
    window.open(whatsappURL, "_blank");
  });
});

var reviewSwiper = new Swiper(".review-row", {
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

var blogsSwiper = new Swiper(".blogs-row", {
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 1 },
    1024: { slidesPerView: 1 },
  },
});

var productSwiper = new Swiper(".product-row", {
  spaceBetween: 30,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

let navbar = document.querySelector(".navbar");
document.querySelector("#menu-bar").onclick = () => {
  navbar.classList.toggle("active");
};

let search = document.querySelector(".search");
document.querySelector("#search").onclick = () => {
  search.classList.toggle("active");
};
// SEARCH FUNCTIONALITY
let searchInput = document.querySelector(".search input"); // Elemen input search
let productRow = document.querySelector(".product-row"); // Kontainer produk
let products = document.querySelectorAll(".product-row .swiper-slide"); // Semua produk

searchInput.addEventListener("input", () => {
  let query = searchInput.value.toLowerCase().trim(); // Ambil input pencarian
  let matchFound = false; // Untuk mengecek apakah ada produk yang cocok

  // Jika input pencarian kosong
  if (query === "") {
    // Tampilkan semua produk kembali
    products.forEach((product) => {
      product.style.display = "block";
    });

    // Aktifkan kembali slider dengan menambahkan class 'swiper-wrapper'
    productRow.classList.add("swiper-pagination");
    return; // Stop di sini karena tidak ada query
  }

  // Jika ada query, cari produk yang cocok
  productRow.classList.remove("swiper-pagination"); // Hilangkan slider
  products.forEach((product) => {
    let productName = product.querySelector("h3").innerText.toLowerCase(); // Nama produk
    if (productName.includes(query)) {
      product.style.display = "block"; // Tampilkan jika cocok
      matchFound = true; // Ada produk yang cocok
    } else {
      product.style.display = "none"; // Sembunyikan jika tidak cocok
    }
  });

  // Jika tidak ada produk yang cocok
  if (!matchFound) {
    productRow.innerHTML = `<p style="text-align: center; font-size: 1.2rem;">No products found for "${query}"</p>`;
  } else {
    // Kembalikan produk ke tampilan awal jika query dihapus
    productRow.innerHTML = ""; // Hapus elemen pesan "No products found"
    products.forEach((product) => {
      productRow.appendChild(product); // Tampilkan kembali semua produk
    });
  }
});
// Simpan elemen asli untuk reset
const originalProducts = [...products];

// Event listener untuk pencarian
searchInput.addEventListener("input", () => {
  let query = searchInput.value.toLowerCase().trim(); // Ambil input pencarian
  let matchFound = false; // Cek apakah ada produk yang cocok

  // Jika pencarian kosong
  if (query === "") {
    // Reset ke tampilan awal (semua produk & slider aktif)
    productRow.innerHTML = ""; // Kosongkan kontainer
    productRow.classList.add("swiper-pagination"); // Tambahkan kembali class slider
    originalProducts.forEach((product) => {
      product.style.display = "block"; // Tampilkan semua produk
      productRow.appendChild(product); // Masukkan produk ke kontainer
    });

    // Restart Swiper untuk slider
    new Swiper(".product-row", {
      spaceBetween: 30,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 9500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
    return; // Stop di sini karena query kosong
  }

  // Jika ada pencarian
  productRow.innerHTML = ""; // Kosongkan kontainer
  productRow.classList.remove("swiper-pagination"); // Hapus slider
  productRow.style.display = "flex"; // Ubah ke flexbox
  productRow.style.flexWrap = "wrap"; // Supaya produk rapi
  productRow.style.gap = "20px"; // Jarak antar produk

  // Filter produk yang cocok dengan query
  products.forEach((product) => {
    let productName = product.querySelector("h3").innerText.toLowerCase();
    if (productName.includes(query)) {
      product.style.display = "block"; // Tampilkan produk yang cocok
      productRow.appendChild(product); // Masukkan ke kontainer
      matchFound = true; // Ada produk yang cocok
    }
  });

  // Jika tidak ada produk yang cocok
  if (!matchFound) {
    productRow.innerHTML = `<p style="text-align: center; font-size: 1.2rem; width: 100%;">No products found for "${query}"</p>`;
  }
});

// ADD TO CART FUNCTIONALITY
let cart = []; // Array untuk menyimpan produk di keranjang
let cartCount = document.querySelector("#cart-count"); // Elemen untuk menampilkan jumlah barang di keranjang
let addCartButtons = document.querySelectorAll(".add-cart"); // Ambil semua tombol "Add to Cart"

addCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    let product = event.target.closest(".swiper-slide"); // Ambil elemen produk
    let productName = product.querySelector("h3").innerText; // Nama produk
    let productPrice = product.querySelector("p").innerText; // Harga produk

    // Masukkan produk ke dalam keranjang
    cart.push({ name: productName, price: productPrice });

    // Perbarui jumlah barang di keranjang
    cartCount.innerText = cart.length;
  });
});
