// js/script.js

// Fungsi Notifikasi Toast Kustom
function showNotification(msg) {
  let toast = document.getElementById("custom-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.className = "custom-toast";
    document.body.appendChild(toast);
  }

  toast.innerText = msg;
  toast.style.display = "block";

  // reset agar toast tidak tumpang tindih
  toast.style.opacity = "1";
  clearTimeout(showNotification._t);
  showNotification._t = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.display = "none";
  }, 2800);
}

// Tambah Barang ke Keranjang (Halaman Katalog)
function beliProduk(nama, harga, img) {
  let cart = JSON.parse(localStorage.getItem("cart_uas")) || [];
  let itemIndex = cart.findIndex((item) => item.nama === nama);

  if (itemIndex > -1) {
    cart[itemIndex].qty += 1;
  } else {
    cart.push({ nama, harga, img, qty: 1 });
  }

  localStorage.setItem("cart_uas", JSON.stringify(cart));
  showNotification(`${nama} ditambahkan ke keranjang!`);
  updateCounter();
}

// Update Jumlah Indikator Keranjang Belanja
function updateCounter() {
  const cart = JSON.parse(localStorage.getItem("cart_uas")) || [];
  const total = cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  const badge = document.getElementById("cart-badge");
  if (badge) badge.innerText = total;
}

// Render Data di Halaman Pembayaran (bayar.html)
function renderCheckout() {
  let container = document.getElementById("checkout-items");
  if (!container) return;

  let cart = JSON.parse(localStorage.getItem("cart_uas")) || [];
  if (cart.length === 0) {
    container.innerHTML =
      '<p class="text-muted text-center py-4">Keranjang belanja kosong.</p>';
    return;
  }

  let html = "";
  let grandTotal = 0;

  cart.forEach((item, index) => {
    let subtotal = item.harga * item.qty;
    grandTotal += subtotal;
    html += `
            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.img}" style="width: 50px; height: 60px; object-fit:cover;">
                    <div>
                        <h6 class="mb-0 fw-bold">${item.nama}</h6>
                        <small class="text-muted">Rp ${item.harga.toLocaleString()} x ${item.qty}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold text-danger">Rp ${subtotal.toLocaleString()}</span>
                    <button class="btn btn-sm btn-link text-muted" onclick="hapusItem(${index})"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `;
  });

  html += `
        <div class="d-flex justify-content-between fw-bold fs-5 mt-4">
            <span>Total Bayar:</span>
            <span class="text-success">Rp ${grandTotal.toLocaleString()}</span>
        </div>
    `;
  container.innerHTML = html;
}

function hapusItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart_uas")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart_uas", JSON.stringify(cart));
  renderCheckout();
  updateCounter();
}

// Simulasi Form Pemesanan Selesai
function prosesBayar(e) {
  e.preventDefault();
  localStorage.removeItem("cart_uas");
  let modal = new bootstrap.Modal(document.getElementById("modalSukses"));
  modal.show();
}

// Pencarian Dinamis Halaman Katalog
function cariKatalog() {
  let keyword = document.getElementById("search-input").value.toLowerCase();
  let cards = document.querySelectorAll(".product-card-item");

  cards.forEach((card) => {
    let name = card.getAttribute("data-name").toLowerCase();
    if (name.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Jalankan otomatis saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateCounter();
  renderCheckout();
});
