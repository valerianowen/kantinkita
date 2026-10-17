
"use strict";

/* KANTINKITA - FILTER MENU STAN */

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(
    '[data-action="menu-filter"]'
  );

  const menus = document.querySelectorAll(
    ".mi[data-cat3]"
  );

  function filterMenu(category) {
    buttons.forEach(button => {
      const active = button.dataset.cat3 === category;
      button.classList.toggle("on", active);
      button.setAttribute("aria-selected", String(active));
    });

    menus.forEach(menu => {
      const categories = (
        menu.dataset.cat3 || ""
      ).split(/\s+/);

      const visible =
        category === "semua" ||
        categories.includes(category);

      menu.classList.toggle("hid", !visible);
    });
  }

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      filterMenu(button.dataset.cat3);
    });
  });

  filterMenu("semua");
});