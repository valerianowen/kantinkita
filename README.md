# KantinKita – Prototipe Web Fungsional (Modul 7 & Modul 8)

## Anggota Kelompok
| Nama                  |
|-----------------------|
| Owen Valerian         | 
| Nandana Febry Pradana |
| Afni Fitri Nur Hidayah| 
| Elsa Melania Putri    | 
| Firda Dwi Agustina    |

> Modul 7 (UI/UX Prototipe Statis) & Modul 8 (Data Dinamis & Logika Aplikasi)

[![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Custom%20Properties-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JS-Vanilla%20ES6-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/Deploy-Live%20Web-brightgreen)](#-link-live-demo)

---

## 🌐 Link Live Demo
- **URL Production:** [https://kantinkita.vercel.app](https://kantinkita.vercel.app) *(Ganti dengan link hasil deploy Vercel/Netlify milik kelompokmu)*
- **Repository GitHub:** [https://github.com/valerianowen/kantinkita](https://github.com/valerianowen/kantinkita) *(Pastikan repo di-set Public)*

---

## Deskripsi Proyek

**KantinKita** adalah aplikasi web pemesanan makanan kantin kampus yang dikembangkan secara bertahap dari desain Figma. Aplikasi ini menyediakan alur pengguna *end-to-end* untuk dua tipe pengguna: **Mahasiswa** (pemesan) dan **Penjual** (pemilik stan).

- **Modul 7:** Pembangunan antarmuka UI/UX, tata letak responsif, *design system*, dan elemen interaktif dasar (prototipe statis).
- **Modul 8:** Peningkatan ke **aplikasi web interaktif fungsional** dengan mengintegrasikan data dinamis (`data-menu.json`), validasi formulir input, manajemen *state* keranjang persisten, serta penerapan *UX States* (Skeleton Loading, Empty State, Error State, & Toast Notification).

---

## Fitur Utama

### 1. Fitur Mahasiswa (Client App)
- **Login & Akses Sesi:** Validasi form login dan pengelolaan status login via `localStorage`.
- **Beranda & Filter Kategori:** Menampilkan daftar menu dari `data-menu.json` dengan tab filter kategori dinamis.
- **Pencarian Live:** Pencarian kata kunci menu makanan secara *real-time* di `cari.html`.
- **Manajemen Keranjang (Cart State):** *Add to cart*, penyesuaian kuantitas (*qty stepper*), perhitungan total harga otomatis, dan *cart badge* ter-update di seluruh halaman.
- **Pemesanan & Pembayaran:** Pemilihan slot waktu ambil pesanan, alur pembayaran dengan validasi sanitasi input (`.trim()`), serta notifikasi toast sukses.
- **Status Pesanan & Rating:** Indikator status pesanan *live* (dengan *countdown timer*) dan *bottom sheet modal* untuk pemberian ulasan/rating bintang.

### 2. Fitur Penjual (Vendor Dashboard)
- **Dasbor Pesanan Masuk:** Manajemen penerimaan/penolakan pesanan secara *real-time*.
- **Kelola Status Stan:** *Toggle* status keaktifan stan (Buka / Sibuk / Tutup).
- **Laporan Penjualan:** Ringkasan laporan harian dan grafik pesanan per jam di `laporan.html`.

### 3. Penerapan UX States (Modul 8 Target)
- **Loading State:** Animasi *Skeleton Loading* saat membaca data menu dari `data-menu.json`.
- **Empty State:** Tampilan pesan ramah pengguna dan tombol *reset* jika kata kunci pencarian menu tidak ditemukan.
- **Error State:** Penanganan potensi kegagalan pengambilan data menggunakan blok `try...catch`.
- **Toast Notification:** Pop-up notifikasi halus (menggantikan `alert()` kaku browser) saat menambahkan item ke keranjang dan setelah submit form pembayaran.

---

## Elemen Interaktif Wajib

1. **Hamburger Menu / Nav Drawer:** Tombol hamburger membuka *drawer* navigasi dari kiri dengan *overlay*, mendukung tombol `ESC` dan klik luar untuk menutup.
2. **Category Filter Tabs:** *Chip* filter pada beranda dan menu stan untuk menyaring konten secara dinamis tanpa *reload* halaman.
3. **Cart State Management:** Keranjang persisten via `localStorage`, *cart badge* diperbarui di semua halaman.
4. **Payment Method Selection:** Pemilihan metode bayar (*radio UI*) interaktif.
5. **Rating Modal Sheet:** *Bottom sheet modal* dengan bintang rating interaktif dan validasi ulasan.
6. **Seller Order Management:** Tombol terima/tolak pesanan dan *toggle* status stan.

---

## Teknologi & Sumber Data

| Teknologi / Services | Versi / Tipe      | Kegunaan                                              |
|----------------------|-------------------|-------------------------------------------------------|
| **HTML5**            | Standar Semantik  | Struktur halaman web                                  |
| **CSS3**             | Custom Properties | Design system (8pt grid, token warna, responsif)      |
| **JavaScript**       | ES6 Vanilla       | Logika interaktif & manipulasi DOM                    |
| **Sumber Data**      | `data-menu.json`  | Penyimpanan data menu dinamis                         |
| **Browser Storage**  | `localStorage`    | Persistensi data keranjang dan sesi login             |
| **Google Fonts**     | Inter             | Tipografi standar                                     |
| **Deployment**       | Vercel / Netlify  | Hosting publik aplikasi web                           |

---

## Alur Pengujian Aplikasi (Panduan Demo)

1. Buka link **Live Web**.
2. **Login:** Buka `index.html` → masukkan NIM & password → klik **Masuk**.
3. **Beranda:** Amati animasi *Loading Skeleton* sebelum data dimuat dari `data-menu.json`. Coba klik *chip* kategori (Nasi, Ayam, Minuman) untuk menyaring menu.
4. **Navigasi Drawer:** Klik tombol hamburger (☰) untuk membuka *nav drawer*.
5. **Pencarian (`cari.html`):** Ketik nama makanan. Coba ketik kata acak untuk melihat tampilan *Empty State*.
6. **Keranjang (`keranjang.html`):** Tambahkan item ke keranjang, klik tombol `+` / `-` pada *qty stepper*, dan pastikan total harga ter-update secara otomatis.
7. **Pembayaran (`pembayaran.html`):** Pilih metode pembayaran. Coba kosongkan input untuk melihat pesan validasi error. Setelah diisi benar, klik **Bayar** dan amati *Toast Notification* sukses.
8. **Status Pesanan (`status.html`):** Amati *countdown timer* dan uji coba pengisian ulasan bintang pada *Rating Modal Sheet*.
9. **Dasbor Penjual (`dasbor-stan.html`):** Uji coba tombol terima/tolak pesanan dan *toggle* status stan.

---

## Log Prompt AI & Perbaikan Manual

### Prompt AI yang Digunakan
- **Prompt 1 (CSS Design System - Modul 7):**
  > *"Buatkan CSS design system untuk aplikasi mobile KantinKita. Token warna: primary yellow #FFC107, secondary red #E53935. Gunakan 8-point grid. Mobile-first, max-width 480px."*
- **Prompt 2 (Hamburger Menu JS - Modul 7):**
  > *"Buat hamburger menu yang membuka nav drawer dari kiri. Fitur: toggle open/close, overlay click to close, ESC key close, body scroll lock."*
- **Prompt 3 (Category Filter & Cart - Modul 7):**
  > *"Buat cart state management dengan localStorage. Fitur: add, updateQty, remove, getCount, getTotal, renderCartPage."*
- **Prompt 4 (Penerapan Data Dinamis JSON - Modul 8):**
  > *"Buatkan fungsi async fetch untuk mengambil data-menu.json dan merender elemen card secara dinamis menggunakan .map()."*
- **Prompt 5 (Validasi Form & Toast UX - Modul 8):**
  > *"Buatkan fungsi validasi pada form pembayaran di payment.js untuk mencegah input kosong dan tampilkan notifikasi toast."*

### Perbaikan Manual yang Dilakukan
1. **Refactoring CSS Class:** Mengubah nama class panjang (misal `.navigation-drawer`) menjadi lebih ringkas (`.drawer`).
2. **Cart Render Bug Fix:** Memperbaiki bug pada `renderCartPage()` dengan mengosongkan `tbody.innerHTML = ''` terlebih dahulu sebelum melakukan re-render.
3. **Input Sanitization:** Menambahkan `.trim()` pada validasi input formulir pembayaran agar tidak lolos saat hanya diisi spasi.
4. **Z-Index & UX Fix:** Menyesuaikan tingkatan *z-index* agar *Toast Notification* berada di atas *Modal Sheet* dan *Nav Drawer*, serta memastikan modal rating tertutup secara otomatis saat toast berhasil ditampilkan.
5. **Aksesibilitas (A11y):** Menambahkan `aria-expanded`, `aria-label`, `role="status"`, dan `tabindex="0"` pada elemen navigasi dan tombol interaktif.