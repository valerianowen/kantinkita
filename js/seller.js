
"use strict";

/* ==========================================
   KANTINKITA - SELLER.JS
   Pengelolaan Pesanan Penjual
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const ORDER_KEY = "kantinkita_orders_v1";
  const LAST_KEY = "kantinkita_last_order_v1";

  const newPanel = document.getElementById("o-baru");
  const processPanel = document.getElementById("o-proses");
  const readyPanel = document.getElementById("o-siap");

  const tabs = document.querySelectorAll(
    '[data-action="seller-tab"]'
  );

  /* TAB PESANAN */

  function switchTab(panelId) {
    const panels = [
      newPanel,
      processPanel,
      readyPanel
    ];

    panels.forEach(panel => {
      if (panel) {
        panel.classList.toggle(
          "hid",
          panel.id !== panelId
        );
      }
    });

    tabs.forEach(tab => {
      tab.classList.toggle(
        "on",
        tab.dataset.panel === panelId
      );
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      switchTab(tab.dataset.panel);
    });
  });

  switchTab("o-baru");

  /* STATUS STAN */

  const statusButtons = document.querySelectorAll(
    '[data-action="stan-status"]'
  );

  statusButtons.forEach(button => {
    button.addEventListener("click", function () {
      statusButtons.forEach(item => {
        item.classList.remove(
          "s-op",
          "s-bz",
          "s-cl"
        );
      });

      button.classList.add(button.dataset.st);

      localStorage.setItem(
        "kantinkita_stan_status",
        button.dataset.label
      );

      Toast.show(
        "Status stan: " + button.dataset.label
      );
    });
  });

  /* ESTIMASI WAKTU MASAK */

  const waitDisplay = document.getElementById("wv");

  document.querySelectorAll(
    '[data-action="time-adjust"]'
  ).forEach(button => {
    button.addEventListener("click", function () {
      if (!waitDisplay) return;

      const current = Number(waitDisplay.textContent) || 10;
      const delta = Number(button.dataset.delta) || 0;

      const next = Math.max(
        5,
        Math.min(60, current + delta)
      );

      waitDisplay.textContent = String(next);

      localStorage.setItem(
        "kantinkita_wait_minutes",
        String(next)
      );
    });
  });

  /* TERIMA PESANAN BARU */

  function updateStoredOrder(id, status) {
    let orders = [];

    try {
      orders = JSON.parse(
        localStorage.getItem(ORDER_KEY) || "[]"
      );

      if (!Array.isArray(orders)) orders = [];

      const found = orders.find(item => item.id === id);

      if (found) {
        found.status = status;

        localStorage.setItem(
          ORDER_KEY,
          JSON.stringify(orders)
        );
      }

      const latest = JSON.parse(
        localStorage.getItem(LAST_KEY) || "null"
      );

      if (latest && latest.id === id) {
        latest.status = status;

        localStorage.setItem(
          LAST_KEY,
          JSON.stringify(latest)
        );
      }
    } catch (error) {
      console.error("Gagal memperbarui pesanan:", error);
    }
  }

  function addReadyButton(card, id) {
    if (card.querySelector('[data-action="order-ready"]')) {
      return;
    }

    let footer = card.querySelector(".ocf");

    if (!footer) {
      footer = document.createElement("div");
      footer.className = "ocf";
      card.appendChild(footer);
    }

    footer.replaceChildren();

    const button = document.createElement("button");
    button.className = "btn bp2 bsm bfull";
    button.dataset.action = "order-ready";
    button.dataset.orderId = id;
    button.textContent = "✓ Tandai Siap";

    footer.appendChild(button);
  }

  function getCardId(card) {
    const heading = card.querySelector(".oct");
    const text = heading ? heading.textContent : "";

    const match = text.match(/#(A-\d+)/);
    return match ? match[1] : "";
  }

  /* MEMUAT PESANAN DARI CHECKOUT */

  function loadSavedOrders() {
    let orders = [];

    try {
      orders = JSON.parse(
        localStorage.getItem(ORDER_KEY) || "[]"
      );
    } catch {
      return;
    }

    if (!Array.isArray(orders)) return;

    orders.forEach(order => {
      if (!order || !order.id) return;
      if (order.status === "ditolak" ||
          order.status === "selesai") return;

      const target =
        order.status === "siap"
          ? readyPanel
          : order.status === "diproses"
            ? processPanel
            : newPanel;

      if (!target) return;

      const card = document.createElement("article");
      card.className = "oc";
      card.dataset.savedOrder = order.id;

      const header = document.createElement("div");
      header.className = "och";

      const heading = document.createElement("h3");
      heading.className = "oct";
      heading.textContent =
        "#" + order.id + " · " +
        (order.name || "Mahasiswa");

      const slot = document.createElement("span");
      slot.className = "bdg by";
      slot.textContent = order.jam || "12.15";

      header.append(heading, slot);

      const body = document.createElement("div");
      body.className = "ocb";

      const description = document.createElement("p");
      description.textContent = (
        order.items || []
      ).map(item =>
        item.name + " ×" + item.qty
      ).join(", ");

      const price = document.createElement("strong");
      price.textContent = "Rp " +
        Number(order.total || 0).toLocaleString("id-ID");

      body.append(description, price);

      if (order.catatan) {
        const note = document.createElement("p");
        note.textContent = "Catatan: " + order.catatan;
        body.appendChild(note);
      }

      card.append(header, body);

      if (order.status === "baru") {
        const footer = document.createElement("div");
        footer.className = "ocf";

        ["order-reject", "order-accept"].forEach(action => {
          const button = document.createElement("button");

          button.className = action === "order-accept"
            ? "btn bp2 bsm"
            : "btn bo bsm";

          button.dataset.action = action;
          button.dataset.orderId = order.id;
          button.textContent = action === "order-accept"
            ? "✓ Terima"
            : "Tolak";

          footer.appendChild(button);
        });

        card.appendChild(footer);
      }

      if (order.status === "diproses") {
        addReadyButton(card, order.id);
      }

      target.appendChild(card);
    });
  }

  loadSavedOrders();

  /* AKSI PESANAN */

  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;

    if (
      !["order-accept", "order-reject", "order-ready"]
        .includes(action)
    ) {
      return;
    }

    const id = button.dataset.orderId;
    const card = button.closest(".oc");

    if (!card || !id) return;

    if (action === "order-reject") {
      updateStoredOrder(id, "ditolak");
      card.remove();
      Toast.show("Pesanan " + id + " ditolak.");
    }

    if (action === "order-accept") {
      updateStoredOrder(id, "diproses");

      addReadyButton(card, id);

      if (processPanel) {
        processPanel.appendChild(card);
      }

      switchTab("o-proses");

      Toast.show("Pesanan " + id + " diterima.");
    }

    if (action === "order-ready") {
      updateStoredOrder(id, "siap");

      const footer = card.querySelector(".ocf");

      if (footer) {
        footer.replaceChildren();
      }

      if (readyPanel) {
        readyPanel.appendChild(card);
      }

      switchTab("o-siap");

      Toast.show("Pesanan " + id + " siap diambil!");
    }
  });

  /* PESANAN YANG SUDAH ADA DI TAB PROSES */

  if (processPanel) {
    processPanel.querySelectorAll(".oc").forEach(card => {
      const id = getCardId(card);
      if (id) addReadyButton(card, id);
    });
  }

  /* KONFIRMASI PENGAMBILAN */

  const confirmButton = document.querySelector(
    '[data-action="scan-confirm"]'
  );

  if (confirmButton) {
    confirmButton.addEventListener("click", function () {
      const input = document.getElementById("scan-in");

      const id = input
        ? input.value.trim().toUpperCase()
        : "";

      if (!/^A-\d+$/.test(id)) {
        Toast.show(
          "Masukkan nomor pesanan, contoh A-27.",
          "error"
        );
        return;
      }

      const matchingCard = Array.from(
        document.querySelectorAll(".oc")
      ).find(card => getCardId(card) === id);

      if (!matchingCard ||
          matchingCard.parentElement !== readyPanel) {
        Toast.show(
          "Pesanan belum ditemukan di tab Siap.",
          "error"
        );
        return;
      }

      updateStoredOrder(id, "selesai");
      matchingCard.remove();

      Modal.close("scanM");
      Toast.show("Pesanan " + id + " sudah diambil.");

      if (input) input.value = "";
    });
  }

  /* TOGGLE PESANAN BARU */

  const orderToggle = document.getElementById(
    "orders-toggle"
  );

  if (orderToggle) {
    orderToggle.addEventListener("change", function () {
      localStorage.setItem(
        "kantinkita_accept_orders",
        String(orderToggle.checked)
      );

      Toast.show(
        orderToggle.checked
          ? "Penerimaan pesanan diaktifkan."
          : "Penerimaan pesanan dinonaktifkan."
      );
    });
  }
});