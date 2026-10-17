
"use strict";

/* ==========================================
   KANTINKITA - HOME.JS
   Filter Kategori Menu pada Beranda
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(
    '[data-action="home-filter"]'
  );

  const menus = document.querySelectorAll(
    ".mi[data-cat]"
  );

  const noResult = document.getElementById("no-res");

  function filterMenu(category) {
    let totalVisible = 0;

    // Menentukan kategori aktif
    buttons.forEach(button => {
      const active = button.dataset.cat === category;

      button.classList.toggle("on", active);
      button.setAttribute("aria-selected", String(active));
    });

    // Menampilkan menu sesuai kategori
    menus.forEach(menu => {
      const categories = (
        menu.dataset.cat || ""
      ).split(/\s+/);

      const visible =
        category === "semua" ||
        categories.includes(category);

      menu.classList.toggle("hid", !visible);

      if (visible) {
        totalVisible++;
      }
    });

    // Menampilkan pemberitahuan jika kosong
    if (noResult) {
      noResult.classList.toggle(
        "hid",
        totalVisible > 0
      );
    }
  }

  // Tombol kategori
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      filterMenu(button.dataset.cat);
    });
  });

  // Kategori awal
  filterMenu("semua");
});