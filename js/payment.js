
"use strict";

/* ==========================================
   KANTINKITA - PAYMENT.JS
   Simulasi Pembayaran dan Pembuatan Pesanan
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const cart = window.KantinCart;
  if (!cart) return;

  const payButton = document.getElementById("pay-btn");
  const payTotal = document.getElementById("pay-total");
  const payTotal2 = document.getElementById("pay-tot2");
  const detail = document.getElementById("pay-detail");

  const options = document.querySelectorAll(
    '[data-action="pay-select"]'
  );

  let selectedMethod = "QRIS";

  function getPreferences() {
    try {
      return JSON.parse(
        localStorage.getItem("kantinkita_checkout_prefs") || "{}"
      );
    } catch {
      return {};
    }
  }

  function calculateTotal() {
    const subtotal = cart.getTotal();
    const prefs = getPreferences();

    const discount = prefs.jam === "12.45"
      ? Math.floor(subtotal * 0.10)
      : 0;

    return {
      subtotal,
      discount,
      total: subtotal - discount,
      jam: prefs.jam === "12.45" ? "12.45" : "12.15",
      catatan: String(prefs.catatan || "")
    };
  }

  function renderPayment() {
    const items = cart.getItems();
    const calculation = calculateTotal();

    if (payTotal) {
      payTotal.textContent = cart.rupiah(calculation.total);
    }

    if (payTotal2) {
      payTotal2.textContent = cart.rupiah(calculation.total);
    }

    if (payButton) {
      payButton.disabled = items.length === 0;
    }

    if (!detail) return;

    detail.replaceChildren();

    if (items.length === 0) {
      const message = document.createElement("p");
      message.className = "al ay2";
      message.textContent =
        "Keranjang kosong. Tambahkan makanan terlebih dahulu.";
      detail.appendChild(message);
      return;
    }

    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "pr";

      const name = document.createElement("span");
      name.className = "pl";
      name.textContent = item.name + " ×" + item.qty;

      const price = document.createElement("span");
      price.className = "pv";
      price.textContent = cart.rupiah(
        item.price * item.qty
      );

      row.append(name, price);
      detail.appendChild(row);
    });

    if (calculation.discount > 0) {
      const row = document.createElement("div");
      row.className = "pr";

      const label = document.createElement("span");
      label.className = "pl";
      label.textContent = "Diskon slot 12.45 (10%)";

      const value = document.createElement("span");
      value.className = "pv";
      value.textContent = "- " +
        cart.rupiah(calculation.discount);

      row.append(label, value);
      detail.appendChild(row);
    }
  }

  /* PILIH METODE PEMBAYARAN */

  function selectMethod(option) {
    options.forEach(item => {
      const active = item === option;

      item.classList.toggle("on", active);
      item.setAttribute(
        "aria-checked",
        String(active)
      );
    });

    const methodName = option.querySelector(".pn");

    selectedMethod = methodName
      ? methodName.textContent.trim()
      : "QRIS";
  }

  options.forEach(option => {
    option.addEventListener("click", function () {
      selectMethod(option);
    });

    option.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectMethod(option);
      }
    });
  });

  /* BUAT PESANAN */

  function createOrder() {
    const items = cart.getItems();

    if (items.length === 0) {
      Toast.show("Keranjang masih kosong.", "error");
      return;
    }

    const calculation = calculateTotal();

    let sequence = Number(
      localStorage.getItem("kantinkita_order_sequence") || "28"
    );

    if (!Number.isSafeInteger(sequence) || sequence < 28) {
      sequence = 28;
    }

    const orderId = "A-" + sequence;
    const createdAt = Date.now();

    const order = {
      id: orderId,
      name: "Mahasiswa",
      items: items,
      subtotal: calculation.subtotal,
      discount: calculation.discount,
      total: calculation.total,
      jam: calculation.jam,
      catatan: calculation.catatan,
      method: selectedMethod,
      status: "baru",
      createdAt: createdAt
    };

    try {
      localStorage.setItem(
        "kantinkita_last_order_v1",
        JSON.stringify(order)
      );

      const history = JSON.parse(
        localStorage.getItem("kantinkita_orders_v1") || "[]"
      );

      const orders = Array.isArray(history)
        ? history
        : [];

      orders.push(order);

      localStorage.setItem(
        "kantinkita_orders_v1",
        JSON.stringify(orders)
      );

      localStorage.setItem(
        "kantinkita_order_sequence",
        String(sequence + 1)
      );
    } catch (error) {
      console.error("Gagal menyimpan pesanan:", error);
      Toast.show("Pesanan gagal disimpan.", "error");
      return;
    }

    cart.clearCart();
    go("status");
  }

  if (payButton) {
    payButton.addEventListener("click", createOrder);
  }

  renderPayment();
});