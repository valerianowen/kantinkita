
"use strict";

/* KANTINKITA - HALAMAN KERANJANG */

(function () {
  const KEY = "kantinkita_checkout_prefs";

  function getPrefs() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(KEY) || "{}"
      );

      return {
        jam: saved.jam === "12.45" ? "12.45" : "12.15",
        catatan: String(saved.catatan || "")
      };
    } catch {
      return { jam: "12.15", catatan: "" };
    }
  }

  function savePrefs() {
    const checked = document.querySelector(
      'input[name="jam"]:checked'
    );

    const catatan = document.getElementById("catatan");

    const prefs = {
      jam: checked ? checked.value : "12.15",
      catatan: catatan ? catatan.value : ""
    };

    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error("Gagal menyimpan pilihan:", error);
    }

    updateSummary();
  }

  function updateSummary() {
    if (!window.KantinCart) return;

    const prefs = getPrefs();
    const subtotal = KantinCart.getTotal();

    const diskon = prefs.jam === "12.45"
      ? Math.floor(subtotal * 0.10)
      : 0;

    const total = subtotal - diskon;

    const sub = document.getElementById("cart-sub");
    const totalElement = document.getElementById("cart-tot");

    if (sub) {
      sub.textContent = KantinCart.rupiah(subtotal);
    }

    if (totalElement) {
      totalElement.textContent = KantinCart.rupiah(total);
    }

    // Baris diskon pada HTML keranjang
    const priceRows = document.querySelectorAll(
      "#cart-content .pr"
    );

    priceRows.forEach(row => {
      if (row.textContent.toLowerCase().includes("diskon")) {
        const value = row.querySelector(".pv");

        if (value) {
          value.textContent = diskon > 0
            ? "- " + KantinCart.rupiah(diskon)
            : "Rp 0";
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const prefs = getPrefs();

    const catatan = document.getElementById("catatan");

    if (catatan) {
      catatan.value = prefs.catatan;
      catatan.addEventListener("input", savePrefs);
    }

    const selected = document.querySelector(
      'input[name="jam"][value="' + prefs.jam + '"]'
    );

    if (selected) selected.checked = true;

    document.querySelectorAll(
      'input[name="jam"]:not(:disabled)'
    ).forEach(input => {
      input.addEventListener("change", savePrefs);
    });

    updateSummary();
  });

  window.addEventListener(
    "kantinkita:cart-updated",
    updateSummary
  );
})();