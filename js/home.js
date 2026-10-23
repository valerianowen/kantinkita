document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('home-menu-container');
  let allMenu = [];

  // 1. Loading State: Skeleton Loading (UX Target 3)
  function showSkeleton() {
    container.innerHTML = `
      <div class="skeleton-card" style="padding: 12px; margin-bottom: 10px; background: #f0f0f0; border-radius: 8px; opacity: 0.6;">
        <div style="height: 16px; width: 60%; background: #ccc; margin-bottom: 8px; border-radius: 4px;"></div>
        <div style="height: 12px; width: 80%; background: #ddd; margin-bottom: 8px; border-radius: 4px;"></div>
        <div style="height: 14px; width: 40%; background: #ccc; border-radius: 4px;"></div>
      </div>
      <div class="skeleton-card" style="padding: 12px; margin-bottom: 10px; background: #f0f0f0; border-radius: 8px; opacity: 0.6;">
        <div style="height: 16px; width: 50%; background: #ccc; margin-bottom: 8px; border-radius: 4px;"></div>
        <div style="height: 12px; width: 70%; background: #ddd; margin-bottom: 8px; border-radius: 4px;"></div>
        <div style="height: 14px; width: 30%; background: #ccc; border-radius: 4px;"></div>
      </div>
    `;
  }

  showSkeleton();

  // 2. Fetch Data dari JSON
  fetch('../data-menu.json')
    .then(response => {
      if (!response.ok) throw new Error('Gagal memuat data menu');
      return response.json();
    })
    .then(data => {
      allMenu = data;
      renderHomeMenu(allMenu);
    })
    .catch(error => {
      // Error State (UX Target 3)
      console.error(error);
      container.innerHTML = `
        <div style="text-align: center; padding: 20px 0;">
          <p style="color: red; margin-bottom: 8px;">Gagal memuat data menu 😢</p>
          <button id="retry-btn" class="btn bsm bp2">Coba Lagi</button>
        </div>
      `;

      document.getElementById('retry-btn')?.addEventListener('click', () => {
        showSkeleton();
        location.reload();
      });
    });

  // 3. Fungsi Render Menu
  function renderHomeMenu(items) {
    if (items.length === 0) {
      // Empty State (UX Target 3)
      container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px 0;">Menu tidak ditemukan.</p>';
      return;
    }

    container.innerHTML = items.map(item => `
      <article class="mi" data-cat="${item.kategori} semua">
        <div class="fi fi-s ${item.bgClass}">${item.icon}</div>
        <div class="mb2">
          <h3 class="mn">${item.nama}</h3>
          <p class="md">${item.deskripsi}</p>
          <p class="mp">Rp ${item.harga.toLocaleString('id-ID')}</p>
        </div>
        <button class="badd" data-action="cart-add"
          data-item-id="${item.id}"
          data-item-name="${item.nama}"
          data-item-price="${item.harga}"
          data-item-emoji="${item.icon}">+</button>
      </article>
    `).join('');
  }

  // 4. Fitur Filter Kategori di Beranda
  const filterButtons = document.querySelectorAll('[data-action="home-filter"]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      const category = btn.getAttribute('data-cat');
      if (category === 'semua') {
        renderHomeMenu(allMenu);
      } else {
        const filtered = allMenu.filter(item => item.kategori === category);
        renderHomeMenu(filtered);
      }
    });
  });
});