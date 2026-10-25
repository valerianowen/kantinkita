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

<<<<<<< HEAD
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

### Elemen Interaktif Wajib 
1. **Bilah Navigasi Samping (Hamburger Menu / Nav Drawer)**
-Tombol hamburger untuk menampilkan panel navigasi dari sisi kiri yang dilengkapi efek overlay.
-Dapat ditutup dengan menekan tombol**ESC**pada papan ketik (keyboard) atau mengetuk area overlay.
2. **Tab Penyaring Kategori (Category Filter Tabs)**
-Chip filter interaktif pada halaman Beranda, Menu Stan, dan Laporan.
-Berfungsi menyaring dan menampilkan konten secara dinamis tanpa perlu memuat ulang halaman (no page reload).
3. **Pengelolaan Status Keranjang (Cart State Management)**
-Data keranjang tersimpan secara permanen menggunakan localStorage.
-Lencana jumlah pesanan (cart badge) tersinkronisasi otomatis di setiap halaman.
-Fitur pemilih jumlah (qty stepper) yang langsung mengalkulasi ulang total harga secara real-time.
4. **Pemilihan Metode Pembayaran (Payment Method Selection)**
-Antarmuka pilihan berbentuk tombol radio (radio UI) yang interaktif untuk memilih skema pembayaran.
5. **Jendela Ulasan & Rating (Rating Modal Sheet)**
- Panel modal bergaya bottom sheet yang dilengkapi bintang penilaian interaktif untuk memberi ulasan.
6. **Manajemen Pesanan Penjual (Seller Order Management)**
-Fitur bagi pengelola stan untuk menerima atau menolak pesanan masuk.
-Dilengkapi tab filter status pesanan serta sakelar (toggle) untuk mengubah status operasional stan (buka/tutup).
=======
- **Modul 7:** Pembangunan antarmuka UI/UX, tata letak responsif, *design system*, dan elemen interaktif dasar (prototipe statis).
- **Modul 8:** Peningkatan ke **aplikasi web interaktif fungsional** dengan mengintegrasikan data dinamis (`data-menu.json`), validasi formulir input, manajemen *state* keranjang persisten, serta penerapan *UX States* (Skeleton Loading, Empty State, Error State, & Toast Notification).
>>>>>>> feature/perbaikan-fitur

---

## Fitur Utama

### 1. Fitur Mahasiswa (Client App)
- **Login & Akses Sesi:** Validasi form login dan pengelolaan status login via `localStorage`.
- **Beranda & Filter Kategori:** Menampilkan daftar menu dari `data-menu.json` dengan tab filter kategori dinamis.
- **Pencarian Live:** Pencarian kata kunci menu makanan secara *real-time* di `cari.html`.
- **Manajemen Keranjang (Cart State):** *Add to cart*, penyesuaian kuantitas (*qty stepper*), perhitungan total harga otomatis, dan *cart badge* ter-update di seluruh halaman.
- **Pemesanan & Pembayaran:** Pemilihan slot waktu ambil pesanan, alur pembayaran dengan validasi sanitasi input (`.trim()`), serta notifikasi toast sukses.
- **Status Pesanan & Rating:** Indikator status pesanan *live* (dengan *countdown timer*) dan *bottom sheet modal* untuk pemberian ulasan/rating bintang.

<<<<<<< HEAD
### Alur Demo Apk
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
=======
### 2. Fitur Penjual (Vendor Dashboard)
- **Dasbor Pesanan Masuk:** Manajemen penerimaan/penolakan pesanan secara *real-time*.
- **Kelola Status Stan:** *Toggle* status keaktifan stan (Buka / Sibuk / Tutup).
- **Laporan Penjualan:** Ringkasan laporan harian dan grafik pesanan per jam di `laporan.html`.

### 3. Penerapan UX States (Modul 8 Target)
- **Loading State:** Animasi *Skeleton Loading* saat membaca data menu dari `data-menu.json`.
- **Empty State:** Tampilan pesan ramah pengguna dan tombol *reset* jika kata kunci pencarian menu tidak ditemukan.
- **Error State:** Penanganan potensi kegagalan pengambilan data menggunakan blok `try...catch`.
- **Toast Notification:** Pop-up notifikasi halus (menggantikan `alert()` kaku browser) saat menambahkan item ke keranjang dan setelah submit form pembayaran.
>>>>>>> feature/perbaikan-fitur

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
<<<<<<< HEAD
1. Memperbaiki `submitRating()` — harus tutup modal dulu sebelum show toast
2. Menambahkan `aria-label` dan `aria-expanded` pada hamburger button
3. Memperbaiki z-index hierarchy (drawer > overlay > modal > toast)
4. Menambahkan `pointer-events:none` pada menu item yang habis stok
5. Memperbaiki cart badge tidak terupdate di pembayaran.html
6. Menambahkan `role="status"` pada live pill dan countdown untuk screen reader
7. Memastikan semua link navigasi antar halaman berfungsi
8. Menambahkan `tabindex="0"` pada pay-item agar bisa diakses via keyboard
=======
1. **Refactoring CSS Class:** Mengubah nama class panjang (misal `.navigation-drawer`) menjadi lebih ringkas (`.drawer`).
2. **Cart Render Bug Fix:** Memperbaiki bug pada `renderCartPage()` dengan mengosongkan `tbody.innerHTML = ''` terlebih dahulu sebelum melakukan re-render.
3. **Input Sanitization:** Menambahkan `.trim()` pada validasi input formulir pembayaran agar tidak lolos saat hanya diisi spasi.
4. **Z-Index & UX Fix:** Menyesuaikan tingkatan *z-index* agar *Toast Notification* berada di atas *Modal Sheet* dan *Nav Drawer*, serta memastikan modal rating tertutup secara otomatis saat toast berhasil ditampilkan.
5. **Aksesibilitas (A11y):** Menambahkan `aria-expanded`, `aria-label`, `role="status"`, dan `tabindex="0"` pada elemen navigasi dan tombol interaktif.
>>>>>>> feature/perbaikan-fitur
