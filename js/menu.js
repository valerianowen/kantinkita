document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('menu-container');
  const searchInput = document.getElementById('menu-search') || document.querySelector('.fi2[type="search"]');
  let allMenu = [];

  // 1. Ambil Status Stan dari LocalStorage
  const stanStatus = localStorage.getItem("kantinkita_stan_status") || "Buka";
  const acceptOrders = localStorage.getItem("kantinkita_accept_orders") !== "false";
  const isStanTutup = stanStatus === "Tutup" || !acceptOrders;

  // 2. Loading State
  if (container) {
    container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px 0;">Memuat data menu...</p>';
  }

  // 3. Fetch Data dari JSON
  fetch('../data-menu.json')
    .then(response => {
      if (!response.ok) throw new Error('Gagal mengambil data menu');
      return response.json();
    })
    .then(data => {
      allMenu = data;
      renderMenu(allMenu);
    })
    .catch(error => {
      console.error(error);
      if (container) {
        container.innerHTML = '<p style="text-align: center; color: red; padding: 20px 0;">Gagal memuat data menu. Coba muat ulang halaman.</p>';
      }
    });

  // 4. Fungsi Render Kartu Menu dengan Banner Status Stan
  function renderMenu(items) {
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px 0;">Menu tidak ditemukan.</p>';
      return;
    }

    // Spanduk / Banner Status Operasional Stan
    let alertBanner = '';
    if (isStanTutup) {
      alertBanner = `
        <div class="al ay2" style="background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; margin-bottom: 12px; font-weight: 600;">
          🚫 Stan sedang TUTUP. Tidak menerima pesanan saat ini.
        </div>
      `;
    } else if (stanStatus === "Sibuk") {
      alertBanner = `
        <div class="al ay2" style="background: #fff3cd; color: #856404; border: 1px solid #ffeeba; margin-bottom: 12px; font-weight: 600;">
          ⚠️ Stan sedang SIBUK. Estimasi pembuatan mungkin lebih lama.
        </div>
      `;
    }

    const menuHtml = items.map(item => {
      const isHabis = item.status === 'habis';

      let buttonAction = '';

      if (isHabis) {
        buttonAction = `<span class="bdg br">Habis</span>`;
      } else if (isStanTutup) {
        // Kunci tombol jika stan tutup
        buttonAction = `<button class="badd" disabled style="opacity: 0.4; cursor: not-allowed; background: #ccc;">✕</button>`;
      } else {
        buttonAction = `<button class="badd" data-action="cart-add"
            data-item-id="${item.id}"
            data-item-name="${item.nama}"
            data-item-price="${item.harga}"
            data-item-emoji="${item.icon}">+</button>`;
      }

      return `
        <article class="mi" data-cat3="${item.kategori}">
          <div class="fi fi-m ${item.bgClass || ''}">${item.icon}</div>
          <div class="mb2">
            <h3 class="mn">${item.nama}</h3>
            <p class="md">${item.deskripsi}</p>
            <p class="mp">Rp ${Number(item.harga).toLocaleString('id-ID')}</p>
          </div>
          ${buttonAction}
        </article>
      `;
    }).join('');

    container.innerHTML = alertBanner + menuHtml;
  }

  // 5. Fitur Filter Kategori
  const filterButtons = document.querySelectorAll('[data-action="menu-filter"]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      const category = btn.getAttribute('data-cat3');
      if (category === 'semua' || !category) {
        renderMenu(allMenu);
      } else {
        const filtered = allMenu.filter(item => item.kategori === category);
        renderMenu(filtered);
      }
    });
  });

  // 6. Fitur Pencarian Real-time
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase().trim();
      const filtered = allMenu.filter(item => 
        item.nama.toLowerCase().includes(keyword) || 
        item.deskripsi.toLowerCase().includes(keyword)
      );
      renderMenu(filtered);
    });
  }
});