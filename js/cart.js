"use strict";

/* ==========================================
   KANTINKITA - CART.JS
   Pengelolaan Keranjang Belanja
========================================== */

(function () {
  const STORAGE_KEY = "kantinkita_cart_v1";

  function rupiah(angka) {
    return "Rp " + Number(angka || 0).toLocaleString("id-ID");
  }

  function getItems() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(data)) return [];

      return data.filter(item =>
        item &&
        typeof item.id === "string" &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) >= 0 &&
        Number.isInteger(Number(item.qty)) &&
        Number(item.qty) > 0
      );
    } catch (error) {
      console.error("Gagal membaca keranjang:", error);
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );

      renderCart();

      window.dispatchEvent(
        new CustomEvent("kantinkita:cart-updated", {
          detail: { items: getItems() }
        })
      );
    } catch (error) {
      console.error("Gagal menyimpan keranjang:", error);
      notify("Keranjang gagal disimpan.", "error");
    }
  }

  function notify(message, type = "success") {
    if (typeof Toast !== "undefined") {
      Toast.show(message, type);
    } else {
      console.log(message);
    }
  }

  function getTotal() {
    return getItems().reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
  }

  function getCount() {
    return getItems().reduce(
      (total, item) => total + item.qty,
      0
    );
  }

  function addItem(item) {
    // PROTEKSI STATUS STAN (Jika stan Tutup / Tidak Terima Pesanan)
    const stanStatus = localStorage.getItem("kantinkita_stan_status") || "Buka";
    const acceptOrders = localStorage.getItem("kantinkita_accept_orders") !== "false";

    if (stanStatus === "Tutup" || !acceptOrders) {
      notify("Maaf, stan sedang TUTUP. Tidak bisa menambah pesanan.", "error");
      return;
    }

    const id = String(item.id || "").trim();
    const name = String(item.name || "").trim();
    const price = Number(item.price);

    if (
      !id ||
      !name ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      notify("Data menu tidak valid.", "error");
      return;
    }

    const items = getItems();
    const existing = items.find(food => food.id === id);

    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: id,
        name: name,
        price: price,
        emoji: String(item.emoji || "🍽️"),
        qty: 1
      });
    }

    saveItems(items);
    notify(name + " ditambahkan ke keranjang!");
  }

  function setQuantity(id, quantity) {
    const items = getItems();
    const index = items.findIndex(item => item.id === id);

    if (index === -1) return;

    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].qty = Math.min(99, quantity);
    }

    saveItems(items);
  }

  function removeItem(id) {
    const items = getItems().filter(
      item => item.id !== id
    );

    saveItems(items);
    notify("Menu dihapus dari keranjang.");
  }

  function clearCart() {
    saveItems([]);
    notify("Keranjang dikosongkan.");
  }

  /* ======================================
     MEMBUAT ELEMEN HTML DENGAN AMAN
  ====================================== */

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function makeButton(symbol, action, id, label) {
    const button = makeElement(
      "button",
      "qb",
      symbol
    );

    button.type = "button";
    button.dataset.action = action;
    button.dataset.itemId = id;
    button.setAttribute("aria-label", label);

    return button;
  }

  /* ======================================
     MENAMPILKAN KERANJANG
  ====================================== */

  function renderCart() {
    const items = getItems();
    const count = getCount();
    const total = getTotal();

    // Memperbarui seluruh badge keranjang (.cb)
    document.querySelectorAll(".cb").forEach(badge => {
      badge.textContent = count > 99 ? "99+" : count;
      badge.classList.toggle("on", count > 0);
    });

    // Ringkasan pada halaman menu stan
    const menuSummary = document.getElementById(
      "menu-cart-sum"
    );

    if (menuSummary) {
      menuSummary.textContent = count === 0
        ? "Tambahkan menu dulu..."
        : count + " menu · " + rupiah(total);
    }

    // Komponen khusus halaman keranjang
    const cartItems = document.getElementById(
      "cart-items"
    );

    if (!cartItems) return;

    const empty = document.getElementById("cart-empty");
    const content = document.getElementById("cart-content");
    const sub = document.getElementById("cart-sub");
    const totalElement = document.getElementById("cart-tot");

    if (empty) {
      empty.classList.toggle("hid", items.length > 0);
    }

    if (content) {
      content.classList.toggle("hid", items.length === 0);
    }

    const checkoutBtn = document.getElementById("btn-checkout") || document.querySelector('[data-action="go"][data-target="bayar"]');

    if (checkoutBtn) {
      checkoutBtn.disabled = items.length === 0;
    }

    cartItems.replaceChildren();

    items.forEach(item => {
      const row = makeElement("article", "mi");

      const emoji = makeElement(
        "div",
        "fi fi-s fi-y",
        item.emoji
      );

      const description = makeElement("div", "mb2");

      const name = makeElement(
        "h3",
        "mn",
        item.name
      );

      const price = makeElement(
        "p",
        "mp",
        rupiah(item.price * item.qty)
      );

      description.append(name, price);

      const controls = makeElement("div", "qc");

      const minus = makeButton(
        "−",
        "cart-decrease",
        item.id,
        "Kurangi " + item.name
      );

      const quantity = makeElement(
        "span",
        "qv",
        String(item.qty)
      );

      const plus = makeButton(
        "+",
        "cart-increase",
        item.id,
        "Tambah " + item.name
      );

      const remove = makeButton(
        "×",
        "cart-remove",
        item.id,
        "Hapus " + item.name
      );

      controls.append(minus, quantity, plus, remove);
      row.append(emoji, description, controls);
      cartItems.appendChild(row);
    });

    if (sub) sub.textContent = rupiah(total);
    if (totalElement) {
      totalElement.textContent = rupiah(total);
    }
  }

  /* ======================================
     AKSI TOMBOL
  ====================================== */

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.itemId;

    if (action === "cart-add") {
      addItem({
        id: button.dataset.itemId,
        name: button.dataset.itemName,
        price: button.dataset.itemPrice,
        emoji: button.dataset.itemEmoji
      });
    }

    if (action === "cart-increase") {
      const item = getItems().find(food => food.id === id);

      if (item) {
        setQuantity(id, item.qty + 1);
      }
    }

    if (action === "cart-decrease") {
      const item = getItems().find(food => food.id === id);

      if (item) {
        setQuantity(id, item.qty - 1);
      }
    }

    if (action === "cart-remove") {
      removeItem(id);
    }

    if (action === "cart-clear") {
      if (getItems().length > 0) {
        clearCart();
      } else {
        notify("Keranjang sudah kosong.");
      }
    }
  });

  /* ======================================
     API UNTUK FITUR PEMBAYARAN & LAINNYA
  ====================================== */

  window.KantinCart = {
    getItems,
    getTotal,
    getCount,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    renderCart,
    rupiah
  };

  document.addEventListener(
    "DOMContentLoaded",
    renderCart
  );

  window.addEventListener("storage", renderCart);

})();