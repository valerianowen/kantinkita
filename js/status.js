
"use strict";

/* KANTINKITA - STATUS PESANAN */

document.addEventListener("DOMContentLoaded", function () {
  const ORDER_KEY = "kantinkita_last_order_v1";

  let selectedRating = 0;
  let order = null;

  try {
    order = JSON.parse(
      localStorage.getItem(ORDER_KEY) || "null"
    );
  } catch {
    order = null;
  }

  const title = document.querySelector(
    "#s-status .hdr-title"
  );

  const subtitle = document.querySelector(
    "#s-status .hdr-sub"
  );

  const timer = document.getElementById("status-timer");
  const detail = document.getElementById("status-order-detail");
  const countdown = document.querySelector(".cdn");

  function rupiah(number) {
    return "Rp " + Number(number).toLocaleString("id-ID");
  }

  function makeRow(label, value, total = false) {
    const row = document.createElement("div");
    row.className = total ? "pt" : "pr";

    const left = document.createElement("span");
    left.className = "pl";
    left.textContent = label;

    const right = document.createElement("span");
    right.className = "pv";
    right.textContent = value;

    row.append(left, right);
    return row;
  }

  /* MENAMPILKAN DETAIL PESANAN */

  if (order && order.id) {
    if (title) {
      title.textContent = "Pesanan #" + order.id;
    }

    if (subtitle) {
      subtitle.textContent = "Stan KantinKita";
    }

    // Perbarui kode pengambilan
    const code = document.querySelectorAll(
      ".cdn .cdnn"
    );

    if (code.length > 1) {
      code[1].textContent = order.id;
    }

    const pickup = document.querySelector(".cdnl");

    if (pickup) {
      pickup.textContent =
        "Slot " + (order.jam || "12.15") +
        " · Gedung B";
    }

    if (detail && Array.isArray(order.items)) {
      detail.replaceChildren();

      const heading = document.createElement("h2");
      heading.className = "stit";
      heading.textContent = "Detail Pesanan";

      detail.appendChild(heading);

      order.items.forEach(item => {
        detail.appendChild(
          makeRow(
            item.name + " ×" + item.qty,
            rupiah(item.price * item.qty)
          )
        );
      });

      if (order.discount > 0) {
        detail.appendChild(
          makeRow(
            "Diskon",
            "- " + rupiah(order.discount)
          )
        );
      }

      detail.appendChild(
        makeRow("Total", rupiah(order.total), true)
      );

      detail.appendChild(
        makeRow(
          "Pembayaran",
          order.method || "Simulasi"
        )
      );
    }
  }

  /* STATUS DAN HITUNG MUNDUR */

  function refreshOrder() {
    if (!order) return;

    try {
      const latest = JSON.parse(
        localStorage.getItem(ORDER_KEY) || "null"
      );

      if (latest && latest.id === order.id) {
        order = latest;
      }
    } catch {
      // Gunakan data yang sudah dibaca
    }

    const status = order.status || "baru";

    if (status === "siap" || status === "selesai") {
      if (timer) {
        timer.textContent = status === "selesai"
          ? "Selesai"
          : "Siap!";
      }
      return;
    }

    if (status === "ditolak") {
      if (timer) timer.textContent = "Dibatalkan";
      return;
    }

    const createdAt = Number(order.createdAt) || Date.now();
    const remaining = Math.max(
      0,
      createdAt + 8 * 60 * 1000 - Date.now()
    );

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (timer) {
      timer.textContent =
        minutes + ":" + String(seconds).padStart(2, "0");
    }

    if (remaining === 0 && countdown) {
      const note = countdown.querySelector("p");

      if (note) {
        note.textContent =
          "Estimasi selesai. Konfirmasi kesiapan pada penjual.";
      }
    }
  }

  refreshOrder();
  setInterval(refreshOrder, 1000);

  /* PILIH RATING BINTANG */

  const stars = document.querySelectorAll(
    '[data-action="rating-star"]'
  );

  function showStars() {
    stars.forEach(star => {
      const value = Number(star.dataset.rating);

      star.textContent = value <= selectedRating
        ? "★"
        : "☆";
    });

    const input = document.getElementById("star-val");

    if (input) input.value = String(selectedRating);
  }

  stars.forEach(star => {
    star.addEventListener("click", function () {
      selectedRating = Number(star.dataset.rating);
      showStars();
    });
  });

  /* KIRIM RATING */

  const submit = document.querySelector(
    '[data-action="rating-submit"]'
  );

  if (submit) {
    submit.addEventListener("click", function () {
      if (selectedRating < 1) {
        Toast.show("Pilih bintang dahulu.", "error");
        return;
      }

      const review = document.getElementById("ulasan");

      const rating = {
        orderId: order ? order.id : "DEMO",
        stars: selectedRating,
        review: review ? review.value.trim() : "",
        createdAt: Date.now()
      };

      try {
        localStorage.setItem(
          "kantinkita_order_rating_v1",
          JSON.stringify(rating)
        );
      } catch (error) {
        console.error("Rating gagal disimpan:", error);
        Toast.show("Rating gagal disimpan.", "error");
        return;
      }

      Modal.close("ratingM");
      Toast.show("Terima kasih atas rating kamu!");

      selectedRating = 0;
      showStars();

      if (review) review.value = "";
    });
  }
});