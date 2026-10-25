document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsContainer = document.getElementById('search-results-container');
  const searchCount = document.getElementById('search-count');

  const filterBtns = document.querySelectorAll('[data-action="search-filter"]');

  let allMenu = [];
  let activeCategory = 'semua';
  let dataReady = false;

  // 1. Fetch Data
  function loadMenu() {
    dataReady = false;
    searchCount.textContent = 'Memuat menu...';

    // Tampilkan loading saat mengambil data
    resultsContainer.innerHTML = `
      <p style="text-align: center; color: #888; padding: 20px 0;">
        Memuat data pencarian...
      </p>
    `;

    fetch('../data-menu.json', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data menu');
        }
        return res.json();
      })
      .then(data => {
        // Pastikan data menu berbentuk array
        if (!Array.isArray(data)) {
          throw new Error('Format data menu tidak valid');
        }

        allMenu = data;
        dataReady = true;
        handleSearch();
      })
      .catch(err => {
        console.error('Gagal memuat menu pencarian:', err);

        searchCount.textContent = 'Gagal memuat menu';

        // Error State (UX State Misi 3)
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 30px 10px;" role="alert">
            <p style="font-size: 28px; margin-bottom: 10px;">⚠️</p>
            <p style="color: #666; margin-bottom: 8px;">
              Gagal memuat data menu.
            </p>
            <p style="color: #888; font-size: 13px; margin-bottom: 15px;">
              Periksa koneksi atau coba lagi.
            </p>
            <button
              type="button"
              id="retry-search-btn"
              class="btn bsm bp2">
              Coba Lagi
            </button>
          </div>
        `;

        // Tampilkan notifikasi error
        if (typeof Toast !== 'undefined') {
          Toast.show('Gagal memuat menu. Coba lagi.', 'error');
        }

        // Ambil ulang data tanpa reload halaman
        document.getElementById('retry-search-btn')?.addEventListener('click', loadMenu);
      });
  }

  // 2. Fungsi Render Hasil Pencarian
  function renderResults(items) {
    searchCount.textContent = `${items.length} menu ditemukan`;

    // Empty State (UX State Misi 3)
    if (items.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 30px 10px;">
          <p style="color: #666; margin-bottom: 12px;">Yah, menu tidak ditemukan 😢</p>
          <button id="reset-search-btn" class="btn bsm bp2">Reset Pencarian</button>
        </div>
      `;

      // Mengembalikan pencarian dan kategori ke kondisi awal
      document.getElementById('reset-search-btn')?.addEventListener('click', () => {
        searchInput.value = '';
        activeCategory = 'semua';

        filterBtns.forEach(btn => {
          btn.classList.toggle('on', btn.getAttribute('data-cat2') === 'semua');
        });

        renderResults(allMenu);
        searchInput.focus();
      });
      return;
    }

    resultsContainer.innerHTML = items.map(item => `
      <article class="mi">
        <div class="fi fi-m ${item.bgClass}">${item.icon}</div>
        <div class="mb2">
          <h3 class="mn">${item.nama}</h3>
          <p class="md">${item.deskripsi || 'Stan A'} · Rp ${item.harga.toLocaleString('id-ID')}</p>
          <span class="bdg bg">Tersedia</span>
        </div>
        <button class="badd" data-action="cart-add"
          data-item-id="${item.id}"
          data-item-name="${item.nama}"
          data-item-price="${item.harga}"
          data-item-emoji="${item.icon}">+</button>
      </article>
    `).join('');
  }

  // 3. Event Listener Input Search Real-time
  function handleSearch() {
    // Tunggu sampai data berhasil dimuat
    if (!dataReady) return;

    const query = searchInput.value.toLowerCase().trim();

    // Menggabungkan pencarian kata kunci dan filter kategori
    const filtered = allMenu.filter(item => {
      const matchSearch =
        item.nama.toLowerCase().includes(query) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(query));

      const matchCategory =
        activeCategory === 'semua' ||
        item.kategori === activeCategory ||
        (activeCategory === 'murah' && item.harga <= 15000);

      return matchSearch && matchCategory;
    });

    renderResults(filtered);
  }

  searchInput.addEventListener('input', handleSearch);
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);

  // 4. Filter Kategori
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      const cat = btn.getAttribute('data-cat2');
      activeCategory = cat;

      // Terapkan kategori dan pencarian secara bersamaan
      handleSearch();
    });
  });

  // Muat daftar menu ketika halaman dibuka
  loadMenu();
});
