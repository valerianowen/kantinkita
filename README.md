# KantinKita – Prototipe

## Anggota Kelompok
| Nama                  |
|-----------------------|
| Owen Valerian         | 
| Nandana Febry Pradana |
| Afni Fitri Nur Hidayah| 
| Elsa Melania Putri    | 
| Firda Dwi Agustina    |

> Modul 7 

[![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Custom%20Properties-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JS-Vanilla%20ES6-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Deskripsi Proyek

**KantinKita** adalah prototipe web interaktif aplikasi pemesanan makanan kantin kampus yang dikembangkan dari desain Figma Modul 5. Prototipe ini mewujudkan alur pengguna end-to-end untuk dua user: **Mahasiswa** (Febri & Putri) dan **Penjual** (Ibu Kantin).

### Fitur Utama
- Login dengan validasi
- Beranda dengan filter kategori menu dinamis
- Halaman cari & filter dengan tab interaktif
- Detail menu stan dengan add-to-cart
- Keranjang dengan qty controls & perhitungan harga otomatis
- Pembayaran dengan pemilihan metode interaktif
- Status pesanan live dengan countdown timer & modal rating
- Dasbor penjual dengan manajemen pesanan real-time
- Laporan penjualan dengan grafik per periode

### Elemen Interaktif Wajib (≥ 2)
1. **Hamburger Menu / Nav Drawer** — tombol hamburger membuka drawer navigasi dari kiri dengan overlay, mendukung keyboard ESC dan klik overlay untuk menutup
2. **Category Filter Tabs** — chip filter pada beranda, menu stan, dan laporan memfilter konten secara dinamis tanpa reload halaman
3. **Cart State Management** — keranjang persisten via localStorage, cart badge terupdate di semua halaman, qty stepper memperbarui total harga secara langsung
4. **Payment Method Selection** — radio UI interaktif untuk pemilihan metode bayar
5. **Rating Modal Sheet** — bottom sheet modal dengan bintang rating interaktif
6. **Seller Order Management** — tombol terima/tolak pesanan, tab filter status pesanan, toggle status stan

---

## Teknologi yang Digunakan

| Teknologi    | Versi             | Kegunaan                              |
|--------------|-------------------|---------------------------------------|
| HTML5        | Standar           | Struktur semantik                     |
| CSS3         | Custom Properties | Design system (8pt grid, token warna) |
| JavaScript   | ES6 Vanilla       | Interaktivitas stateful               |
| Google Fonts | Inter             | Tipografi                             |
| localStorage | Browser API       | Persistensi keranjang                 |

### Alur Demo 
1. Autentikasi Awal
  - Buka halaman index.html.
  - Masukkan kombinasi NIM dan password apa saja (bebas), lalu klik tombol Masuk.  
2. Eksplorasi Beranda & KatalogDi halaman utama, gunakan filter kategori (seperti Nasi, Ayam, dan lainnya) untuk menguji     - fitur penyaringan menu secara dinamis.
  - Ketuk ikon menu hamburger (☰) di pojok layar untuk membuka bilah navigasi samping (nav drawer).
3. Pengelolaan Keranjang Belanja
  - Pilih menu yang diinginkan, lalu klik tombol "+ Tambah" untuk memasukkannya ke dalam pesanan.
  - Perhatikan perubahan angka pada lencana (badge) di ikon keranjang pada menu navigasi.
4. Konfirmasi Pesanan
  - Pindah ke halaman keranjang.html.
  - Sesuaikan jumlah pesanan (quantity) dan tentukan jadwal waktu pengambilan makanan.
5. Proses Pembayaran
  - Lanjutkan ke halaman pembayaran.html.
  - Pilih metode pembayaran yang diinginkan, lalu klik tombol Bayar untuk menyelesaikan transaksi.
6. Pemantauan & Penilaian
  - Buka halaman status.html untuk memantau waktu tunggu melalui countdown timer.
  - Berikan ulasan dan rating pada pesanan melalui jendela pop-up (modal) yang tersedia.
7.Manajemen Stan (Sisi Penjual)
  - Buka halaman dasbor-stan.html untuk melihat dasbor pengelola.
  - Uji fitur interaktif seperti menerima atau menolak pesanan masuk serta memperbarui status operasional stan.

---
#### Prompt 1 — CSS Design System
```
Buatkan CSS design system untuk aplikasi mobile KantinKita.
Token warna: primary yellow #FFC107, secondary red #E53935.
Gunakan 8-point grid (4,8,12,16,20,24,32...px).
Buat: header, nav drawer, bottom nav, category tabs, card, badge, 
button, form input, toast notification, modal sheet, toggle, qty stepper.
Tidak ada framework, pure CSS custom properties.
Mobile-first, max-width 480px, centered on desktop.
```
**Evaluasi:** Output baik, tapi awalnya menggunakan class name panjang (`.navigation-drawer`). Direfaktor menjadi pendek dan konsisten (`.drawer`).

#### Prompt 2 — Hamburger Menu JS
```
Buat hamburger menu yang membuka nav drawer dari kiri.
Fitur: toggle open/close, overlay click to close, ESC key close,
aria-expanded attribute update, body scroll lock saat open.
Vanilla JS, ES6, no jQuery.
```
**Evaluasi:** Berfungsi baik. Ditambahkan `aria-controls` dan `role` attribute untuk aksesibilitas.

#### Prompt 3 — Category Filter dengan Data Attribute
```
Buat filter tab sistem menggunakan data-cat attribute pada item.
Click tab → update active class → show/hide items dengan class toggle.
Tidak menggunakan jQuery. Juga handle section header (data-cat-section).
Tambahkan 'no result' message.
```
**Evaluasi:** Awalnya menggunakan `display:none` langsung di JS, diubah ke toggle class `.hidden` untuk konsistensi.

#### Prompt 4 — Cart State dengan localStorage
```
Buat cart state management dengan localStorage.
Fitur: add(id,name,price,emoji), updateQty(id,delta), remove(id),
getCount(), getTotal(), formatRp(n), save(), renderCartPage().
Cart badge di semua halaman terupdate otomatis.
Render tabel keranjang dinamis dengan qty stepper inline.
```
**Evaluasi:** Ada bug pada `renderCartPage()` — tbody innerHTML tidak dikosongkan dahulu. Fixed dengan menambahkan `tbody.innerHTML = ''` di awal.

#### Prompt 5 — Rating Modal Sheet
```
Buat bottom sheet modal untuk form rating pesanan.
5 bintang interaktif (toggle filled/outline saat diklik).
Textarea untuk ulasan. Submit button dengan validasi.
Animasi slide-up dari bawah. Overlay click untuk tutup.
```
**Evaluasi:** Berfungsi baik. Ditambahkan `aria-modal` dan `role="dialog"` untuk aksesibilitas.

### Perbaikan Manual yang Dilakukan
1. Memperbaiki `submitRating()` — harus tutup modal dulu sebelum show toast
2. Menambahkan `aria-label` dan `aria-expanded` pada hamburger button
3. Memperbaiki z-index hierarchy (drawer > overlay > modal > toast)
4. Menambahkan `pointer-events:none` pada menu item yang habis stok
5. Memperbaiki cart badge tidak terupdate di pembayaran.html
6. Menambahkan `role="status"` pada live pill dan countdown untuk screen reader
7. Memastikan semua link navigasi antar halaman berfungsi
8. Menambahkan `tabindex="0"` pada pay-item agar bisa diakses via keyboard
