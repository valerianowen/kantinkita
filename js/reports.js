
"use strict";

/* ==========================================
   KANTINKITA - REPORTS.JS
   Laporan Penjualan dan Ekspor CSV
========================================== */

document.addEventListener("DOMContentLoaded", function () {
  const ORDER_KEY = "kantinkita_orders_v1";

  const periodButtons = document.querySelectorAll(
    '[data-action="report-period"]'
  );

  let selectedPeriod = "hari";
  let filteredOrders = [];

  function rupiah(value) {
    return "Rp " + Number(value).toLocaleString("id-ID");
  }

  function getOrders() {
    try {
      const orders = JSON.parse(
        localStorage.getItem(ORDER_KEY) || "[]"
      );

      return Array.isArray(orders)
        ? orders
        : [];
    } catch {
      return [];
    }
  }

  function isInPeriod(timestamp, period) {
    const date = new Date(Number(timestamp));
    const today = new Date();

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    if (period === "hari") {
      return date.toDateString() === today.toDateString();
    }

    if (period === "minggu") {
      const start = new Date(today);

      const day = (today.getDay() + 6) % 7;

      start.setDate(today.getDate() - day);
      start.setHours(0, 0, 0, 0);

      return date >= start && date <= today;
    }

    if (period === "bulan") {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    return true;
  }

  function findSection(heading) {
    const headings = document.querySelectorAll(
      ".sec h2"
    );

    const match = Array.from(headings).find(item =>
      item.textContent.trim() === heading
    );

    return match ? match.closest(".sec") : null;
  }

  function createRow(label, value, isTotal = false) {
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

  function updateMenuRanking(orders) {
    const section = findSection("Menu Terlaris");
    if (!section) return;

    const ranking = new Map();

    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const current = ranking.get(item.name) || 0;
        ranking.set(
          item.name,
          current + Number(item.qty || 0)
        );
      });
    });

    const sorted = Array.from(ranking.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    section.querySelectorAll(".pr").forEach(row => {
      row.remove();
    });

    if (sorted.length === 0) {
      section.appendChild(
        createRow("Belum ada penjualan", "0")
      );
      return;
    }

    sorted.forEach(([name, quantity], index) => {
      section.appendChild(
        createRow(
          (index + 1) + ". " + name,
          quantity + " terjual"
        )
      );
    });
  }

  function updatePaymentSummary(orders, total) {
    const section = findSection("Rekap Pembayaran");
    if (!section) return;

    const payments = new Map();

    orders.forEach(order => {
      const method = order.method || "Lainnya";
      const amount = Number(order.total || 0);

      payments.set(
        method,
        (payments.get(method) || 0) + amount
      );
    });

    section.querySelectorAll(".pr, .pt").forEach(row => {
      row.remove();
    });

    if (payments.size === 0) {
      section.appendChild(
        createRow("Belum ada pembayaran", rupiah(0))
      );
    } else {
      payments.forEach((amount, method) => {
        const percent = total > 0
          ? Math.round((amount / total) * 100)
          : 0;

        section.appendChild(
          createRow(
            method,
            percent + "% · " + rupiah(amount)
          )
        );
      });
    }

    section.appendChild(
      createRow("Total Pendapatan", rupiah(total), true)
    );
  }

  function updateChart(orders) {
    const hours = [10, 11, 12, 13, 14, 15];
    const counts = hours.map(() => 0);

    orders.forEach(order => {
      const hour = new Date(
        Number(order.createdAt)
      ).getHours();

      const index = hours.indexOf(hour);

      if (index !== -1) {
        counts[index]++;
      }
    });

    const max = Math.max(1, ...counts);

    document.querySelectorAll(".bc .bar").forEach(
      (bar, index) => {
        const count = counts[index] || 0;

        bar.style.height = count === 0
          ? "3%"
          : Math.max(10, (count / max) * 100) + "%";

        bar.title =
          hours[index] + ".00: " +
          count + " pesanan";
      }
    );
  }

  function updateReport() {
    filteredOrders = getOrders().filter(order =>
      order &&
      order.status !== "ditolak" &&
      isInPeriod(order.createdAt, selectedPeriod)
    );

    const total = filteredOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    const count = filteredOrders.length;

    const revenue = document.getElementById("rev");
    const orderCount = document.getElementById("ord");
    const totalReport = document.getElementById("tot-rep");

    if (revenue) revenue.textContent = rupiah(total);
    if (orderCount) orderCount.textContent = String(count);
    if (totalReport) totalReport.textContent = rupiah(total);

    // Persentase perubahan hanya tersedia jika ada
    // pembanding periode sebelumnya.
    const revenueTrend = document.getElementById("revt");
    const orderTrend = document.getElementById("ordt");

    if (revenueTrend) revenueTrend.textContent = "Data simulasi";
    if (orderTrend) orderTrend.textContent = "Data simulasi";

    updateMenuRanking(filteredOrders);
    updatePaymentSummary(filteredOrders, total);
    updateChart(filteredOrders);
  }

  /* FILTER PERIODE */

  periodButtons.forEach(button => {
    button.addEventListener("click", function () {
      selectedPeriod = button.dataset.period || "hari";

      periodButtons.forEach(item => {
        const active =
          item.dataset.period === selectedPeriod;

        item.classList.toggle("on", active);
      });

      updateReport();
    });
  });

  /* EXPORT CSV */

  const exportButton = document.querySelector(
    '[data-action="export-report"]'
  );

  if (exportButton) {
    exportButton.addEventListener("click", function () {
      const rows = [
        [
          "Nomor Pesanan",
          "Tanggal",
          "Metode Pembayaran",
          "Status",
          "Total"
        ]
      ];

      filteredOrders.forEach(order => {
        rows.push([
          order.id,
          new Date(order.createdAt).toLocaleString("id-ID"),
          order.method,
          order.status,
          order.total
        ]);
      });

      function csvCell(value) {
        const text = String(value ?? "");

        return '"' +
          text.replace(/"/g, '""') +
          '"';
      }

      const csv = rows
        .map(row => row.map(csvCell).join(","))
        .join("\r\n");

      const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
      );

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download =
        "kantinkita-laporan-" +
        selectedPeriod + ".csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      Toast.show("Laporan CSV berhasil dibuat.");
    });
  }

  updateReport();
});