'use strict';

/* ==============================================
   ROUTER / NAVIGASI
============================================== */

function go(id) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('on');
  });

  const tujuan = document.getElementById('s-' + id);

  if (!tujuan) {
    console.error('Halaman tidak ditemukan:', id);
    return;
  }

  tujuan.classList.add('on');
  Drawer.close();

  const page = tujuan.querySelector('.page');
  if (page) page.scrollTop = 0;

  if (id === 'cari') searchMenus();
  if (id === 'keranjang') renderCart();
  if (id === 'menu') updateMenuCartSummary();
  if (id === 'bayar') initPayPage();
  if (id === 'status') startStatusTimer();
  if (id === 'dasbor') renderOrders();

  if (id === 'login') {
    const btn = document.getElementById('loginBtn');
    btn.disabled = false;
    btn.textContent = 'Masuk';
  }
}

/* ==============================================
   TOAST
============================================== */

const Toast = {
  show(message) {
    const container = document.getElementById('tc');
    const toast = document.createElement('div');

    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

/* ==============================================
   DRAWER / HAMBURGER
============================================== */

const Drawer = {
  open() {
    document.getElementById('drw').classList.add('on');
    document.getElementById('ov').classList.add('on');
    document.body.style.overflow = 'hidden';

    document.querySelectorAll('.ham').forEach(btn => {
      btn.setAttribute('aria-expanded', 'true');
    });
  },

  close() {
    document.getElementById('drw').classList.remove('on');
    document.getElementById('ov').classList.remove('on');
    document.body.style.overflow = '';

    document.querySelectorAll('.ham').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
  }
};

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    Drawer.close();
    document.querySelectorAll('.mb.on').forEach(modal => {
      Modal.close(modal.id);
    });
  }
});

/* ==============================================
   PENCARIAN MENU - SUDAH DIPERBAIKI
============================================== */

function searchMenus() {
  const input = document.getElementById('search-input');

  if (!input) return;

  const keyword = input.value
    .trim()
    .toLocaleLowerCase('id-ID');

  const activeTab = document.querySelector(
    '#search-tabs .ctb.on'
  );

  const category = activeTab
    ? activeTab.dataset.cat2
    : 'semua';

  const items = document.querySelectorAll(
    '#search-menu-list .mi[data-cat2]'
  );

  let total = 0;

  items.forEach(item => {
    const nama = item.querySelector('.mn')
      .textContent
      .toLocaleLowerCase('id-ID');

    const detail = item.querySelector('.md')
      .textContent
      .toLocaleLowerCase('id-ID');

    const kategori = item.dataset.cat2.split(' ');

    const cocokKeyword =
      nama.includes(keyword) ||
      detail.includes(keyword);

    const cocokKategori =
      category === 'semua' ||
      kategori.includes(category);

    const tampil = cocokKeyword && cocokKategori;

    item.classList.toggle('hid', !tampil);

    if (tampil) total++;
  });

  document.getElementById('search-count').textContent =
    total + ' menu ditemukan';

  const noResult = document.getElementById('no-res2');

  noResult.classList.toggle('hid', total > 0);

  if (total === 0) {
    noResult.textContent = keyword
      ? 'Tidak ditemukan menu untuk "' + input.value.trim() + '".'
      : 'Tidak ada menu untuk filter ini.';
  }
}

function filterSearch(button) {
  document.querySelectorAll('#search-tabs .ctb')
    .forEach(tab => {
      tab.classList.remove('on');
      tab.setAttribute('aria-selected', 'false');
    });

  button.classList.add('on');
  button.setAttribute('aria-selected', 'true');

  searchMenus();
}

/* ==============================================
   FILTER BERANDA
============================================== */

function filterMenu(button) {
  const category = button.dataset.cat;

  document.querySelectorAll('#home-tabs .ctb')
    .forEach(tab => tab.classList.remove('on'));

  button.classList.add('on');

  let total = 0;

  document.querySelectorAll(
    '#s-beranda .mi[data-cat]'
  ).forEach(item => {
    const categories = item.dataset.cat.split(' ');
    const cocok =
      category === 'semua' ||
      categories.includes(category);

    item.classList.toggle('hid', !cocok);

    if (cocok) total++;
  });

  document.getElementById('no-res')
    .classList.toggle('hid', total > 0);
}

/* ==============================================
   FILTER MENU STAN
============================================== */

function filterMenu3(button) {
  const category = button.dataset.cat3;

  document.querySelectorAll('#stan-tabs .ctb')
    .forEach(tab => tab.classList.remove('on'));

  button.classList.add('on');

  document.querySelectorAll(
    '#stan-menu-list .mi[data-cat3]'
  ).forEach(item => {
    const categories = item.dataset.cat3.split(' ');

    const cocok =
      category === 'semua' ||
      categories.includes(category);

    item.classList.toggle('hid', !cocok);
  });
}

/* ==============================================
   KERANJANG DENGAN LOCALSTORAGE
============================================== */

const Cart = {
  items: [],

  init() {
    try {
      const data = JSON.parse(
        localStorage.getItem('kk-cart') || '[]'
      );

      this.items = Array.isArray(data) ? data : [];
    } catch (error) {
      this.items = [];
    }

    this.refreshBadges();
  },

  add(id, name, price, emoji) {
    const existing = this.items.find(item => item.id === id);

    if (existing) {
      existing.qty++;
    } else {
      this.items.push({
        id,
        name,
        price: Number(price),
        emoji,
        qty: 1
      });
    }

    this.save();
    this.refreshBadges();
    updateMenuCartSummary();

    Toast.show(name + ' ditambahkan ke keranjang');
  },

  updateQty(id, delta) {
    const item = this.items.find(item => item.id === id);

    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
      this.items = this.items.filter(item => item.id !== id);
    }

    this.save();
    this.refreshBadges();
    renderCart();
  },

  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.save();
    this.refreshBadges();
    renderCart();
  },

  clear() {
    this.items = [];
    this.save();
    this.refreshBadges();
  },

  getCount() {
    return this.items.reduce(
      (total, item) => total + item.qty,
      0
    );
  },

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
  },

  fmt(number) {
    return 'Rp ' + Number(number).toLocaleString('id-ID');
  },

  save() {
    try {
      localStorage.setItem(
        'kk-cart',
        JSON.stringify(this.items)
      );
    } catch (error) {
      console.warn('Keranjang tidak dapat disimpan.');
    }
  },

  refreshBadges() {
    const count = this.getCount();

    document.querySelectorAll('.cb').forEach(badge => {
      badge.textContent = count;
      badge.classList.toggle('on', count > 0);
    });
  }
};

function renderCart() {
  const empty = document.getElementById('cart-empty');
  const content = document.getElementById('cart-content');
  const container = document.getElementById('cart-items');

  if (Cart.items.length === 0) {
    empty.classList.remove('hid');
    content.classList.add('hid');
    return;
  }

  empty.classList.add('hid');
  content.classList.remove('hid');

  container.innerHTML = '';

  Cart.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-row';

    const icon = document.createElement('span');
    icon.style.fontSize = '25px';
    icon.textContent = item.emoji;

    const info = document.createElement('div');
    info.style.flex = '1';

    const name = document.createElement('strong');
    name.style.fontSize = '13px';
    name.textContent = item.name;

    const price = document.createElement('p');
    price.style.fontSize = '12px';
    price.style.color = 'var(--n500)';
    price.textContent = Cart.fmt(item.price);

    info.append(name, price);

    const minus = document.createElement('button');
    minus.className = 'qb';
    minus.textContent = '−';
    minus.addEventListener('click', () => {
      Cart.updateQty(item.id, -1);
    });

    const quantity = document.createElement('strong');
    quantity.textContent = item.qty;

    const plus = document.createElement('button');
    plus.className = 'qb plus';
    plus.textContent = '+';
    plus.addEventListener('click', () => {
      Cart.updateQty(item.id, 1);
    });

    row.append(icon, info, minus, quantity, plus);
    container.appendChild(row);
  });

  document.getElementById('cart-sub').textContent =
    Cart.fmt(Cart.getTotal());

  document.getElementById('cart-tot').textContent =
    Cart.fmt(Cart.getTotal());
}

function updateMenuCartSummary() {
  const element = document.getElementById('menu-cart-sum');

  if (Cart.getCount() === 0) {
    element.textContent = 'Tambahkan menu dulu...';
  } else {
    element.textContent =
      Cart.getCount() + ' item · ' +
      Cart.fmt(Cart.getTotal());
  }
}

function checkout() {
  if (Cart.getCount() === 0) {
    Toast.show('Keranjang masih kosong.');
    return;
  }

  go('bayar');
}

/* ==============================================
   LOGIN VALIDATION
============================================== */

document.getElementById('loginForm')
  .addEventListener('submit', function(event) {
    event.preventDefault();

    const nim = document.getElementById('nim');
    const pw = document.getElementById('pw');

    const validNim = nim.value.trim() !== '';
    const validPw = pw.value.length >= 6;

    document.getElementById('e-nim')
      .classList.toggle('on', !validNim);

    document.getElementById('e-pw')
      .classList.toggle('on', !validPw);

    if (!validNim || !validPw) return;

    const btn = document.getElementById('loginBtn');

    btn.disabled = true;
    btn.textContent = 'Masuk...';

    setTimeout(() => {
      go('beranda');
    }, 600);
  });

function togglePw() {
  const pw = document.getElementById('pw');

  pw.type = pw.type === 'password'
    ? 'text'
    : 'password';
}

/* ==============================================
   PEMBAYARAN
============================================== */

function initPayPage() {
  const detail = document.getElementById('pay-detail');

  detail.innerHTML = '';

  Cart.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'pr';

    const name = document.createElement('span');
    name.textContent = item.name + ' × ' + item.qty;

    const price = document.createElement('strong');
    price.textContent = Cart.fmt(item.price * item.qty);

    row.append(name, price);
    detail.appendChild(row);
  });

  document.getElementById('pay-total').textContent =
    Cart.fmt(Cart.getTotal());

  document.getElementById('pay-tot2').textContent =
    Cart.fmt(Cart.getTotal());
}

function doPay() {
  if (Cart.getCount() === 0) {
    Toast.show('Tidak ada pesanan untuk dibayar.');
    return;
  }

  const btn = document.getElementById('pay-btn');

  btn.disabled = true;
  btn.textContent = 'Memproses...';

  setTimeout(() => {
    Cart.clear();

    btn.disabled = false;
    btn.textContent = 'Bayar Sekarang';

    go('status');
    Toast.show('Pembayaran berhasil diproses!');
  }, 800);
}

/* ==============================================
   STATUS PESANAN
============================================== */

let statusInterval = null;
let statusSeconds = 480;

function startStatusTimer() {
  const element = document.getElementById('status-timer');

  if (statusInterval) {
    clearInterval(statusInterval);
  }

  function update() {
    const minutes = Math.floor(statusSeconds / 60);
    const seconds = statusSeconds % 60;

    element.textContent =
      minutes + ':' + String(seconds).padStart(2, '0');

    if (statusSeconds > 0) {
      statusSeconds--;
    }
  }

  update();

  statusInterval = setInterval(update, 1000);
}

/* ==============================================
   MODAL DAN RATING
============================================== */

const Modal = {
  open(id) {
    document.getElementById(id).classList.add('on');
    document.body.style.overflow = 'hidden';
  },

  close(id) {
    document.getElementById(id).classList.remove('on');
    document.body.style.overflow = '';
  }
};

let starVal = 0;

function setStar(value) {
  starVal = value;

  document.querySelectorAll('#rating-stars .star')
    .forEach((star, index) => {
      const active = index < value;
      star.textContent = active ? '★' : '☆';
      star.style.color = active ? 'var(--y)' : 'var(--n300)';
    });
}

function submitRating() {
  if (starVal === 0) {
    Toast.show('Pilih rating terlebih dahulu.');
    return;
  }

  Modal.close('ratingM');
  Toast.show('Terima kasih! Rating berhasil dikirim.');

  setStar(0);
  document.getElementById('rating-comment').value = '';
}

/* ==============================================
   DASBOR PENJUAL
============================================== */

let waktuVal = 10;

function adjTime(delta) {
  waktuVal = Math.max(1, Math.min(60, waktuVal + delta));

  document.getElementById('wv').textContent = waktuVal;
}

function toggleStan(input) {
  const label = document.getElementById('stan-status');

  label.textContent = input.checked ? 'Buka' : 'Tutup';
  label.className = input.checked
    ? 'bdg green'
    : 'bdg red';

  Toast.show(
    input.checked
      ? 'Stan sekarang buka.'
      : 'Stan sekarang tutup.'
  );
}

let activeOrderTab = 'baru';

let sellerOrders = [
  {
    id: 'A-27',
    name: 'Febri Ramadhan',
    menu: 'Nasi Goreng Spesial × 1, Es Teh Manis × 1',
    total: 20000,
    status: 'baru'
  },
  {
    id: 'A-28',
    name: 'Putri',
    menu: 'Ayam Geprek × 1',
    total: 17000,
    status: 'baru'
  }
];

function switchOTab(button, status) {
  activeOrderTab = status;

  document.querySelectorAll('#order-tabs .ctb')
    .forEach(tab => tab.classList.remove('on'));

  button.classList.add('on');

  renderOrders();
}

function renderOrders() {
  const container = document.getElementById('seller-orders');

  container.innerHTML = '';

  const filtered = sellerOrders.filter(
    order => order.status === activeOrderTab
  );

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'no-result';
    empty.textContent = 'Tidak ada pesanan pada kategori ini.';
    container.appendChild(empty);
  }

  filtered.forEach(order => {
    const card = document.createElement('div');
    card.className = 'oc';

    const title = document.createElement('h3');
    title.textContent = 'Pesanan #' + order.id;

    const customer = document.createElement('p');
    customer.textContent = 'Pelanggan: ' + order.name;

    const menu = document.createElement('p');
    menu.textContent = order.menu;

    const price = document.createElement('strong');
    price.style.display = 'block';
    price.style.marginBottom = '12px';
    price.textContent = Cart.fmt(order.total);

    card.append(title, customer, menu, price);

    if (order.status === 'baru') {
      const accept = document.createElement('button');
      accept.className = 'btn bp2 bsm';
      accept.textContent = 'Terima';
      accept.addEventListener('click', () => {
        updateOrder(order.id, 'proses');
      });

      const reject = document.createElement('button');
      reject.className = 'btn bo bsm';
      reject.style.marginLeft = '8px';
      reject.textContent = 'Tolak';
      reject.addEventListener('click', () => {
        rejectOrder(order.id);
      });

      card.append(accept, reject);
    }

    if (order.status === 'proses') {
      const ready = document.createElement('button');
      ready.className = 'btn bp2 bsm';
      ready.textContent = 'Tandai Siap';
      ready.addEventListener('click', () => {
        updateOrder(order.id, 'siap');
      });
      card.appendChild(ready);
    }

    if (order.status === 'siap') {
      const badge = document.createElement('span');
      badge.className = 'bdg green';
      badge.textContent = 'Siap diambil';
      card.appendChild(badge);
    }

    container.appendChild(card);
  });

  document.getElementById('seller-new-count').textContent =
    sellerOrders.filter(order => order.status === 'baru').length;

  document.getElementById('seller-process-count').textContent =
    sellerOrders.filter(order => order.status === 'proses').length;

  document.getElementById('seller-ready-count').textContent =
    sellerOrders.filter(order => order.status === 'siap').length;
}

function updateOrder(id, newStatus) {
  const order = sellerOrders.find(order => order.id === id);

  if (!order) return;

  order.status = newStatus;
  renderOrders();

  Toast.show('Status pesanan #' + id + ' diperbarui.');
}

function rejectOrder(id) {
  const confirmed = confirm(
    'Yakin ingin menolak pesanan #' + id + '?'
  );

  if (!confirmed) return;

  sellerOrders = sellerOrders.filter(
    order => order.id !== id
  );

  renderOrders();
  Toast.show('Pesanan #' + id + ' ditolak.');
}

function confirmScan() {
  const input = document.getElementById('scan-in');
  const value = input.value.trim();

  if (!value) {
    Toast.show('Masukkan nomor pesanan.');
    return;
  }

  Modal.close('scanM');
  Toast.show('Pengambilan pesanan ' + value + ' dikonfirmasi.');
  input.value = '';
}

/* ==============================================
   LAPORAN PENJUALAN
============================================== */

const periods = {
  hari: {
    rev: 'Rp 1,2 jt',
    revt: '+12%',
    ord: '78',
    ordt: '+8 pesanan',
    tot: 'Rp 1.200.000'
  },

  minggu: {
    rev: 'Rp 7,4 jt',
    revt: '+5%',
    ord: '412',
    ordt: '+22 pesanan',
    tot: 'Rp 7.400.000'
  },

  bulan: {
    rev: 'Rp 28 jt',
    revt: '+18%',
    ord: '1.680',
    ordt: '+120 pesanan',
    tot: 'Rp 28.000.000'
  }
};

function setPeriod(button, key) {
  document.querySelectorAll('#report-tabs .ctb')
    .forEach(tab => tab.classList.remove('on'));

  button.classList.add('on');

  const data = periods[key];

  document.getElementById('rev').textContent = data.rev;
  document.getElementById('revt').textContent = data.revt;
  document.getElementById('ord').textContent = data.ord;
  document.getElementById('ordt').textContent = data.ordt;
  document.getElementById('tot-rep').textContent = data.tot;

  Toast.show('Laporan ' + key + ' diperbarui.');
}

/* ==============================================
   INISIALISASI APLIKASI
============================================== */

Cart.init();
searchMenus();
renderOrders();

