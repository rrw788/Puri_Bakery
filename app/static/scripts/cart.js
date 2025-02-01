const cartContainer = document.querySelector(".cart-items");
const subtotalElement = document.querySelector(".subtotal");
const totalElement = document.querySelector(".total");
const cartCountElement = document.querySelector(".cart-count");

// Ambil data keranjang dari localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fungsi untuk menampilkan keranjang
function displayCart() {
  cartContainer.innerHTML = ""; // Kosongkan container
  let subtotal = 0;

  cart.forEach((product, index) => {
    subtotal += product.price * product.quantity;

    const itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
      <span>${product.name} x${product.quantity}</span>
      <span>Rp${(product.price * product.quantity).toLocaleString("id-ID")}</span>
      <button class="remove" data-index="${index}">Hapus</button>
    `;
    cartContainer.appendChild(itemElement);
  });

  const serviceFee = 10000;
  subtotalElement.innerText = `Rp${subtotal.toLocaleString("id-ID")}`;
  totalElement.innerText = `Rp${(subtotal + serviceFee).toLocaleString("id-ID")}`;
  cartCountElement.innerText = cart.length;

  // Tambahkan event listener untuk tombol hapus
  const removeButtons = document.querySelectorAll(".remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      cart.splice(index, 1); // Hapus item dari keranjang
      localStorage.setItem("cart", JSON.stringify(cart)); // Simpan kembali ke localStorage
      displayCart(); // Tampilkan keranjang yang diperbarui
    });
  });
}

// Panggil fungsi untuk menampilkan keranjang saat halaman dimuat
displayCart();

// Event listener untuk tombol Add to Cart
const addCartButtons = document.querySelectorAll(".add-cart");

function addToCart(productName, productPrice, productImage) {
  const existingProduct = cart.find((product) => product.name === productName);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  alert(`${productName} berhasil ditambahkan ke keranjang!`);
}

addCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const product = this.closest(".swiper-slide");
    const productName = product.querySelector("h3").innerText;
    const productPrice = parseInt(product.querySelector(".price").innerText.replace("Rp", "").replace(".", ""));
    const productImage = product.querySelector("img").src;

    addToCart(productName, productPrice, productImage);
  });
});

// Event listener untuk tombol Checkout
document.querySelector(".checkout").addEventListener("click", () => {
  const customerName = document.querySelector("#customer-name").value;
  const customerPhone = document.querySelector("#customer-phone").value;
  const customerAddress = document.querySelector("#customer-address").value;

  // Ambil produk dari keranjang
  const products = cart.map((product) => `${product.name} x${product.quantity}`).join(", ");
  const totalPrice = totalElement.innerText.replace("Rp", "").replace(".", "").replace(",", ""); // Hapus format Rp dan titik

  // Kirim data checkout ke server
  fetch("/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress, // Tambahkan alamat ke data yang dikirim
      products: products,
      total_price: parseInt(totalPrice), // Pastikan total price adalah angka
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      localStorage.removeItem("cart"); // Bersihkan keranjang setelah checkout
      window.location.href = "/"; // Redirect ke home
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
