document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsContainer = document.getElementById('search-results-container');
  const searchCount = document.getElementById('search-count');
  
  let allMenu = [];

  // 1. Fetch Data
  fetch('../data-menu.json')
    .then(res => res.json())
    .then(data => {
      allMenu = data;
      renderResults(allMenu);
    })
    .catch(err => {
      console.error(err);
      resultsContainer.innerHTML = '<p style="text-align: center; color: red;">Gagal memuat menu pencarian.</p>';
    });

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
      
      document.getElementById('reset-search-btn')?.addEventListener('click', () => {
        searchInput.value = '';
        renderResults(allMenu);
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
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allMenu.filter(item => 
      item.nama.toLowerCase().includes(query) || 
      (item.deskripsi && item.deskripsi.toLowerCase().includes(query))
    );
    renderResults(filtered);
  }

  searchInput.addEventListener('input', handleSearch);
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);

  // 4. Filter Kategori
  const filterBtns = document.querySelectorAll('[data-action="search-filter"]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      const cat = btn.getAttribute('data-cat2');
      if (cat === 'semua') {
        renderResults(allMenu);
      } else {
        const filtered = allMenu.filter(item => item.kategori === cat || (cat === 'murah' && item.harga <= 15000));
        renderResults(filtered);
      }
    });
  });
});