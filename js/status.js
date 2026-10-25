"use strict";

/* KANTINKITA - STATUS PESANAN */

document.addEventListener("DOMContentLoaded", function () {
  const ORDER_KEY = "kantinkita_last_order_v1";

  let selectedRating = 0;
  let order = null;

  function getOrder() {
    try {
      return JSON.parse(localStorage.getItem(ORDER_KEY) || "null");
    } catch {
      return null;
    }
  }

  order = getOrder();

  const title = document.querySelector("#s-status .hdr-title");
  const subtitle = document.querySelector("#s-status .hdr-sub");
  const timer = document.getElementById("status-timer");
  const statusNote = document.querySelector(".al.ag2");

  let detail = document.getElementById("status-order-detail");
  if (!detail) {
    detail = document.querySelector("#s-status .page .sec:nth-of-type(4)");
  }

  function rupiah(number) {
    return "Rp " + Number(number || 0).toLocaleString("id-ID");
  }

  function makeRow(label, value, isTotal = false) {
    const row = document.createElement("div");
    row.className = isTotal ? "pt" : "pr";

    const left = document.createElement("span");
    left.className = "pl";
    left.textContent = label;

    const right = document.createElement("span");
    right.className = "pv";
    right.textContent = value;

    row.append(left, right);
    return row;
  }

  /* RENDER INDIKATOR ALUR PESANAN (STEPS) */
  function updateStepsUI(currentStatus) {
    const steps = document.querySelectorAll(".steps .stp");
    if (steps.length < 5) return;

    // Reset semua step
    steps.forEach((stp, idx) => {
      stp.className = "stp";
      const numSpan = stp.querySelector(".sd2");
      if (numSpan) numSpan.textContent = String(idx + 1);
    });

    // Tentukan step mana yang aktif / selesai berdasarkan status
    let activeIndex = 2; // Default: Dimasak (step 3)

    if (currentStatus === "baru") activeIndex = 0;
    else if (currentStatus === "konfirmasi") activeIndex = 1;
    else if (currentStatus === "diproses") activeIndex = 2;
    else if (currentStatus === "siap") activeIndex = 3;
    else if (currentStatus === "selesai") activeIndex = 4;

    steps.forEach((stp, idx) => {
      const numSpan = stp.querySelector(".sd2");
      if (idx < activeIndex) {
        stp.className = "stp dn"; // Step selesai (centang)
        if (numSpan) numSpan.textContent = "✓";
      } else if (idx === activeIndex) {
        stp.className = "stp ac"; // Step aktif saat ini
        if (numSpan) numSpan.textContent = "✓";
      }
    });

    // Update Pesan Notifikasi Hijau di Bawah
    if (statusNote) {
      if (currentStatus === "siap") {
        statusNote.textContent = "🔔 Pesanan kamu sudah SIAP! Silakan ambil di stan.";
        statusNote.style.background = "#d4edda";
        statusNote.style.color = "#155724";
      } else if (currentStatus === "selesai") {
        statusNote.textContent = "🎉 Pesanan sudah selesai diambil. Terima kasih!";
      } else if (currentStatus === "ditolak") {
        statusNote.textContent = "❌ Pesanan kamu ditolak oleh penjual.";
        statusNote.style.background = "#f8d7da";
        statusNote.style.color = "#721c24";
      } else {
        statusNote.textContent = "🔔 Pesanan sedang diproses.";
      }
    }
  }

  /* RENDER DETAIL PESANAN DINAMIS */
  function renderOrderDetail() {
    order = getOrder();
    if (!order) return;

    const orderId = order.id || order.orderId || "A-74";

    if (title) title.textContent = "Pesanan #" + orderId;
    if (subtitle) subtitle.textContent = "Stan KantinKita";

    // Update Kode Pengambilan
    const codeElements = document.querySelectorAll(".cdn .cdnn");
    codeElements.forEach(el => {
      if (el.id !== "status-timer") el.textContent = orderId;
    });

    const pickup = document.querySelector(".cdnl");
    if (pickup) {
      pickup.textContent = "Slot " + (order.jam || "12.45") + " · Gedung B";
    }

    // Update Indikator Visual Step
    updateStepsUI(order.status || "diproses");

    // Render Rincian Item Makanan
    if (detail) {
      detail.replaceChildren();

      const heading = document.createElement("h2");
      heading.className = "stit";
      heading.textContent = "Detail Pesanan";
      detail.appendChild(heading);

      const itemsList = order.items || order.cart || [];

      if (Array.isArray(itemsList) && itemsList.length > 0) {
        let calculatedTotal = 0;

        itemsList.forEach(item => {
          const qty = Number(item.qty || item.quantity || 1);
          const price = Number(item.price || item.harga || 0);
          const subtotal = price * qty;
          calculatedTotal += subtotal;

          detail.appendChild(
            makeRow(
              (item.name || item.nama) + " ×" + qty,
              rupiah(subtotal)
            )
          );
        });

        const discountVal = Number(order.discount || order.diskon || 0);
        if (discountVal > 0) {
          detail.appendChild(makeRow("Diskon", "- " + rupiah(discountVal)));
        }

        let finalTotal = calculatedTotal - discountVal;
        if (order.total !== undefined && order.total !== null) {
          finalTotal = Number(order.total);
        }

        detail.appendChild(makeRow("Total", rupiah(finalTotal), true));
        detail.appendChild(makeRow("Pembayaran", order.method || "Tunai saat Ambil"));
      } else {
        detail.appendChild(makeRow("Status", "Belum ada item pesanan."));
      }
    }
  }

  /* REFRESH REAL-TIME DAN HITUNG MUNDUR */
  function refreshOrder() {
    order = getOrder();
    if (!order) return;

    const currentStatus = order.status || "diproses";
    updateStepsUI(currentStatus);

    if (currentStatus === "siap") {
      if (timer) timer.textContent = "Siap!";
      return;
    }

    if (currentStatus === "selesai") {
      if (timer) timer.textContent = "Selesai";
      return;
    }

    if (currentStatus === "ditolak") {
      if (timer) timer.textContent = "Dibatalkan";
      return;
    }

    const createdAt = Number(order.createdAt) || Date.now();
    const remaining = Math.max(0, createdAt + 8 * 60 * 1000 - Date.now());

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (timer) {
      timer.textContent = minutes + ":" + String(seconds).padStart(2, "0");
    }
  }

  renderOrderDetail();
  setInterval(refreshOrder, 1000);

  /* RATING BINTANG */
  const stars = document.querySelectorAll('[data-action="rating-star"]');
  stars.forEach(star => {
    star.addEventListener("click", function () {
      selectedRating = Number(star.dataset.rating);
      stars.forEach(s => {
        s.textContent = Number(s.dataset.rating) <= selectedRating ? "★" : "☆";
      });
    });
  });

  const submit = document.querySelector('[data-action="rating-submit"]');
  if (submit) {
    submit.addEventListener("click", function () {
      if (selectedRating < 1) {
        if (typeof Toast !== "undefined") Toast.show("Pilih bintang dahulu.", "error");
        return;
      }
      if (typeof Modal !== "undefined") Modal.close("ratingM");
      if (typeof Toast !== "undefined") Toast.show("Terima kasih atas rating kamu!");
    });
  }
});