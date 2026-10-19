
"use strict";

/* ==========================================
   KANTINKITA - SEARCH.JS
   Pencarian Menu + Filter Kategori
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById(
    "search-input"
  );

  const searchCount = document.getElementById(
    "search-count"
  );

  const noResult = document.getElementById(
    "no-res2"
  );

  const filterButtons = document.querySelectorAll(
    '[data-action="search-filter"]'
  );

  const menuItems = document.querySelectorAll(
    ".mi[data-cat2]"
  );

  if (!searchInput) return;

  let activeCategory = "semua";

  /* NORMALISASI TEKS */

  function normalize(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("id-ID")
      .trim();
  }

  /* MENJALANKAN PENCARIAN */

  function searchMenu() {
    const keyword = normalize(searchInput.value);

    let totalFound = 0;

    menuItems.forEach(menu => {
      const nameElement = menu.querySelector(".mn");
      const descriptionElement = menu.querySelector(".md");

      const name = normalize(
        nameElement ? nameElement.textContent : ""
      );

      const description = normalize(
        descriptionElement
          ? descriptionElement.textContent
          : ""
      );

      const categories = (
        menu.dataset.cat2 || ""
      ).split(/\s+/);

      // Cocok dengan nama atau deskripsi
      const matchKeyword =
        keyword === "" ||
        name.includes(keyword) ||
        description.includes(keyword);

      // Cocok dengan kategori yang sedang aktif
      const matchCategory =
        activeCategory === "semua" ||
        categories.includes(activeCategory);

      // Keduanya harus cocok
      const visible = matchKeyword && matchCategory;

      menu.classList.toggle("hid", !visible);

      if (visible) {
        totalFound++;
      }
    });

    /* JUMLAH HASIL */

    if (searchCount) {
      searchCount.textContent =
        totalFound + " menu ditemukan";
    }

    /* KONDISI TIDAK DITEMUKAN */

    if (noResult) {
      noResult.classList.toggle(
        "hid",
        totalFound > 0
      );

      if (totalFound === 0) {
        noResult.textContent =
          keyword
            ? 'Tidak ada menu yang cocok dengan "' +
              searchInput.value.trim() + '".'
            : "Tidak ada menu pada kategori ini.";
      }
    }
  }

  /* PENCARIAN LANGSUNG SAAT MENGETIK */

  searchInput.addEventListener("input", searchMenu);

  /* PENCARIAN DENGAN TOMBOL CARI */

  const searchButton = document.querySelector(
    '[data-action="search"]'
  );

  if (searchButton) {
    searchButton.addEventListener(
      "click",
      searchMenu
    );
  }

  /* PENCARIAN DENGAN TOMBOL ENTER */

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchMenu();
    }
  });

  /* FILTER KATEGORI */

  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.cat2 || "semua";

      filterButtons.forEach(item => {
        const active =
          item.dataset.cat2 === activeCategory;

        item.classList.toggle("on", active);
        item.setAttribute(
          "aria-selected",
          String(active)
        );
      });

      searchMenu();
    });
  });

  /* KONDISI AWAL */

  searchMenu();
});