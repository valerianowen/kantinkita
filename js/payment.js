
document.addEventListener('DOMContentLoaded', () => {
  const payTotal = document.getElementById('pay-total');
  const payTot2 = document.getElementById('pay-tot2');
  const payDetail = document.getElementById('pay-detail');
  const payBtn = document.getElementById('pay-btn');

  // Ambil input form pemesan (Misi 2 Validasi)
  const nameInput = document.getElementById('buyer-name');
  const phoneInput = document.getElementById('buyer-phone');
  const nameError = document.getElementById('e-buyer-name');
  const phoneError = document.getElementById('e-buyer-phone');

  // Tampilkan atau hilangkan pesan error pada input
  function setFieldError(input, errorElement, message) {
    if (!input || !errorElement) return;

    const hasError = Boolean(message);

    input.classList.toggle('err', hasError);
    input.setAttribute('aria-invalid', String(hasError));

    errorElement.classList.toggle('on', hasError);

    if (hasError) {
      errorElement.textContent = message;
    }
  }

  // Validasi format nomor telepon Indonesia
  function validPhone(phone) {
    return /^(?:08|\+628|628)\d{8,11}$/.test(phone);
  }

  // Hapus pesan error ketika nama sudah valid
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length >= 2) {
        setFieldError(nameInput, nameError, '');
      }
    });
  }

  // Hapus pesan error ketika nomor telepon sudah valid
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (validPhone(phoneInput.value.trim())) {
        setFieldError(phoneInput, phoneError, '');
      }
    });
  }

  // Variable untuk menyimpan metode pembayaran yang dipilih (default: QRIS)
  let selectedMethod = 'QRIS';

  // 1. Ambil data keranjang dari KantinCart atau Storage
  let cartItems = window.KantinCart ? window.KantinCart.getItems() : [];

  if (cartItems.length === 0) {
    try {
      cartItems = JSON.parse(localStorage.getItem('kantinkita_cart_v1') || '[]');
    } catch (e) {
      cartItems = [];
    }
  }

  // 2. Ambil preferensi checkout (jam & catatan dari cart-page.js)
  let prefs = { jam: "12.15", catatan: "" };
  try {
    prefs = JSON.parse(localStorage.getItem("kantinkita_checkout_prefs") || "{}");
  } catch (e) {
    console.error("Gagal membaca preferensi checkout:", e);
  }

  const rupiah = (num) => "Rp " + Number(num || 0).toLocaleString("id-ID");

  // Hitung subtotal & diskon jam 12.45 (10%)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const diskon = prefs.jam === "12.45" ? Math.floor(subtotal * 0.10) : 0;
  const totalHarga = Math.max(0, subtotal - diskon);

  // 3. Render Detail Pesanan
  if (cartItems.length > 0 && payDetail) {
    payDetail.innerHTML = cartItems.map(item => `
      <div class="pr">
        <span class="pl">${item.name} ×${item.qty}</span>
        <span class="pv">${rupiah(item.price * item.qty)}</span>
      </div>
    `).join('');

    if (diskon > 0) {
      payDetail.innerHTML += `
        <div class="pr" style="color: #28a745;">
          <span class="pl">Diskon Jam (12.45)</span>
          <span class="pv">- ${rupiah(diskon)}</span>
        </div>
      `;
    }
  } else if (payDetail) {
    payDetail.innerHTML = '<p style="font-size: 13px; color: #888;">Keranjang belanjaan kamu kosong. Tambahkan menu dulu dari beranda.</p>';
  }

  // Tampilkan Nominal Total Bayar
  if (payTotal) payTotal.textContent = rupiah(totalHarga);
  if (payTot2) payTot2.textContent = rupiah(totalHarga);

  // 4. PENANGANAN PILIHAN METODE PEMBAYARAN (QRIS, e-Wallet, Tunai)
  const payOptions = document.querySelectorAll('[data-action="pay-select"]');

  payOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Hapus kelas 'on' dari semua pilihan
      payOptions.forEach(opt => {
        opt.classList.remove('on');
        opt.setAttribute('aria-checked', 'false');
      });

      // Aktifkan pilihan yang diklik
      option.classList.add('on');
      option.setAttribute('aria-checked', 'true');

      // Ambil nama metode pembayaran dari elemen yang diklik
      const methodName = option.querySelector('.pn')?.textContent.trim();

      if (methodName) {
        selectedMethod = methodName;
      }
    });
  });

  // 5. Proses Klik Tombol Bayar Sekarang
  if (payBtn) {
    payBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (cartItems.length === 0) {
        if (typeof Toast !== 'undefined') {
          Toast.show('Keranjang masih kosong!', 'error');
        } else {
          alert('Keranjang masih kosong! Silakan pilih menu terlebih dahulu.');
        }
        return;
      }

      // Pastikan form data pembeli tersedia
      if (!nameInput || !phoneInput) {
        if (typeof Toast !== 'undefined') {
          Toast.show('Form data pembeli tidak ditemukan.', 'error');
        }
        return;
      }

      // Ambil dan bersihkan data pembeli
      const buyerName = nameInput.value.trim();
      const buyerPhone = phoneInput.value.trim();
      const notesInput = document.getElementById('buyer-notes');

      // Validasi nama dan nomor telepon pembeli
      let isValid = true;
      let firstInvalid = null;

      if (buyerName.length < 2) {
        setFieldError(
          nameInput,
          nameError,
          buyerName.length === 0
            ? 'Nama pembeli tidak boleh kosong.'
            : 'Nama pembeli minimal 2 karakter.'
        );
        isValid = false;
        firstInvalid = nameInput;
      } else {
        setFieldError(nameInput, nameError, '');
      }

      if (!validPhone(buyerPhone)) {
        setFieldError(
          phoneInput,
          phoneError,
          buyerPhone.length === 0
            ? 'Nomor telepon tidak boleh kosong.'
            : 'Gunakan nomor HP valid, misalnya 081234567890.'
        );
        isValid = false;

        if (!firstInvalid) {
          firstInvalid = phoneInput;
        }
      } else {
        setFieldError(phoneInput, phoneError, '');
      }

      // Hentikan pembayaran jika input tidak valid
      if (!isValid) {
        firstInvalid?.focus();

        if (typeof Toast !== 'undefined') {
          Toast.show('Periksa kembali data pembeli.', 'error');
        }
        return;
      }

      // Objek pesanan lengkap
      const orderData = {
        id: 'A-' + Math.floor(10 + Math.random() * 90),
        name: buyerName,
        phone: buyerPhone,
        items: cartItems,
        subtotal: subtotal,
        discount: diskon,
        total: totalHarga,
        totalPrice: totalHarga,
        jam: prefs.jam || "12.15",
        catatan: notesInput ? notesInput.value.trim() : (prefs.catatan || ""),
        method: selectedMethod, // Metode pembayaran dinamis (QRIS / Saldo e-Wallet / Tunai)
        createdAt: Date.now(),
        status: 'baru'
      };

      // Simpan transaksi ke localStorage
      try {
        localStorage.setItem(
          'kantinkita_last_order_v1',
          JSON.stringify(orderData)
        );
      } catch (error) {
        console.error('Gagal menyimpan pesanan:', error);

        if (typeof Toast !== 'undefined') {
          Toast.show('Pesanan gagal disimpan. Coba lagi.', 'error');
        }
        return;
      }

      // Kosongkan keranjang belanja
      if (window.KantinCart && typeof window.KantinCart.clearCart === 'function') {
        window.KantinCart.clearCart();
      } else {
        localStorage.removeItem('kantinkita_cart_v1');
      }

      // Animasi Loading & Pindah Halaman
      payBtn.disabled = true;
      payBtn.textContent = 'Memproses Pesanan...';

      setTimeout(() => {
        if (typeof Toast !== 'undefined') {
          Toast.show('Pembayaran Berhasil! 🎉');
        }
        window.location.href = 'status.html';
      }, 1000);
    });
  }
});
