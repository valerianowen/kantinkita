
"use strict";

/* =========================================
   KANTINKITA - COMMON.JS
   NAVIGASI SELURUH FITUR
========================================= */

// DAFTAR HALAMAN
const pages = {
  login: "index.html",
  beranda: "beranda.html",
  cari: "cari.html",
  menu: "menu-stan.html",
  keranjang: "keranjang.html",
  bayar: "pembayaran.html",
  pembayaran: "pembayaran.html",
  status: "status.html",
  dasbor: "dasbor-stan.html",
  laporan: "laporan.html"
};

// FUNGSI PINDAH HALAMAN
function go(page) {
  const tujuan = pages[page];

  if (!tujuan) {
    console.error("Halaman tidak ditemukan:", page);
    return;
  }

  window.location.href = tujuan;
}

// HAMBURGER MENU
const Drawer = {
  open() {
    document.getElementById("drw")?.classList.add("on");
    document.getElementById("ov")?.classList.add("on");
  },

  close() {
    document.getElementById("drw")?.classList.remove("on");
    document.getElementById("ov")?.classList.remove("on");
  }
};

// NOTIFIKASI
const Toast = {
  show(message, type = "success") {
    const container = document.getElementById("tc");

    if (!container) {
      console.log(message);
      return;
    }

    const toast = document.createElement("div");
    toast.className = "toast";

    if (type === "error") {
      toast.classList.add("err");
    }

    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("on");
    });

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

// POPUP / MODAL
const Modal = {
  open(id) {
    document.getElementById(id)?.classList.add("on");
  },

  close(id) {
    document.getElementById(id)?.classList.remove("on");
  }
};

// MENANGANI SEMUA TOMBOL NAVIGASI
document.addEventListener("click", function (event) {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const action = button.dataset.action;

  switch (action) {
    case "go":
      event.preventDefault();
      go(button.dataset.target);
      break;

    case "drawer-open":
      Drawer.open();
      break;

    case "drawer-close":
      Drawer.close();
      break;

    case "modal-open":
      Modal.open(button.dataset.modal);
      break;

    case "modal-close":
      Modal.close(button.dataset.modal);
      break;

    case "modal-overlay-close":
      if (event.target === button) {
        Modal.close(button.dataset.modal);
      }
      break;
  }
});

// TUTUP MENU DAN POPUP DENGAN ESC
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    Drawer.close();

    document.querySelectorAll(".mb.on").forEach(modal => {
      Modal.close(modal.id);
    });
  }
});

console.log("KantinKita common.js berhasil dijalankan!");