# Product Requirement Document (PRD)
## KantinKita – Sistem Pemesanan Kantin Kampus

---

## 1. Ringkasan

**KantinKita** adalah aplikasi web pemesanan makanan berbasis data dinamis untuk kantin kampus. Solusi ini dirancang untuk menghilangkan antrean panjang saat jam istirahat dengan memungkinkan mahasiswa memesan lebih awal dan mengambil pesanan sesuai slot waktu yang dipilih.

**Masalah yang Diselesaikan:** Mahasiswa kehilangan 10–20 menit waktu istirahat hanya untuk antre di kantin. Penjual kesulitan mengelola lonjakan pesanan saat jam sibuk (12.00–13.00).

**Solusi:** Platform pemesanan digital dengan penjadwalan waktu ambil, pembayaran cashless/COD, dan dasbor penjual real-time.

---

## 2. Target Pengguna

### User A: Mahasiswa
- **Febri Ramadhan** (21 tahun) — pengguna aktif, sering kehabisan menu favorit
- **Putri Aulia** (20 tahun) — pengguna baru, butuh pengalaman pemesanan yang cepat & mudah
- **Pain points:** Antrean panjang, menu favorit sering habis, tidak tahu kapan pesanan selesai dibuat

### User B: Penjual Kantin
- **Ibu Kantin (Stan A)** — penjual nasi & ayam, tidak terlalu melek teknologi
- **Pain points:** Kewalahan melayani pesanan di jam sibuk, susah memprediksi stok harian

---

## 3. Spesifikasi Teknis & Tech Stack

### Arsitektur Sistem
- **Frontend Layer:** HTML5, CSS3, JavaScript (Modular ES6 Architecture)
- **Data & State Management:** Async Data Fetching (`data-menu.json`), `localStorage` (Persistensi Keranjang & Sesi Login)
- **Deployment Platform:** Vercel / Netlify / Cloudflare Pages

### Design System
- **Warna Primer:** Yellow `#FFC107` (30%)
- **Warna Sekunder:** Red `#E53935` (10%)
- **Netral:** `#FFFFFF`, `#F9FAFB`, `#111827` (60%)
- **Tipografi:** Inter (400, 500, 600, 700, 800, 900)
- **Grid System:** 8-point Grid (4, 8, 12, 16, 20, 24, 32, 40, 48px)
- **Standards:** WCAG 2.1 AA (Kontras warna minimum 4.5:1)

---

## 4. Fitur MVP & Modul 8 Target

### 4.1 Mahasiswa (Client App)
| Fitur | Prioritas | Sumber Data / Logic | Status |
|-------|-----------|----------------------|--------|
| Hamburger Nav Drawer | Tinggi | DOM Manipulation (`common.js`) | Selesai |
| Beranda & Filter Kategori | Tinggi | `data-menu.json` + Dynamic DOM Rendering | Selesai |
| Pencarian Menu Live | Tinggi | Real-time Search Logic (`search.js`) | Selesai |
| Add to Cart & Badge State | Tinggi | `localStorage` Sync (`cart.js`) | Selesai |
| Form Checkout & Validasi | Tinggi | Form Input Sanitization (`payment.js`) | Selesai |
| UX States (Skeleton & Toast)| Tinggi | UI Feedback Components | Selesai |

### 4.2 Penjual (Vendor Dashboard)
| Fitur | Prioritas | Sumber Data / Logic | Status |
|-------|-----------|----------------------|--------|
| Dasbor Pesanan Masuk | Tinggi | Local State / JSON | Selesai |
| Toggle Status Stan | Tinggi | DOM State Toggle (`seller.js`) | Selesai |
| Laporan Penjualan Harian | Sedang | Chart / Summary Table (`reports.js`)| Selesai |

---

## 5. Alur Pengguna (User Flow)

### Flow Mahasiswa (Happy Path)
```text
Login → Beranda → [Filter/Cari Menu] → Menu Stan
→ [Add to Cart] → Keranjang → [Pilih Jam Ambil] 
→ Form Pembayaran (Validasi Input) → [Pilih Metode Bayar] 
→ Pop-up Toast Sukses → Status Pesanan (Kode QR)

Flow Penjual

Login Penjual → Dasbor → [Terima Pesanan] 
→ Rekap Dapur → [Tandai Siap] → Scan Tiket/QR
→ Laporan Harian → Kelola Stok

### 6. Penanganan State & User Experience (UX)
Loading State: Menampilkan animasi Loading Skeleton saat data menu dari data-menu.json sedang dimuat.

Empty State: Menampilkan pesan/tampilan "Menu tidak ditemukan" beserta tombol Reset jika kata kunci pencarian kosong.

Error State: Menangkap potensi error koneksi/fetch menggunakan try...catch dan memberikan instruksi perbaikan yang ramah pengguna.

Toast Notification: Pop-up feedback halus menggunakan notifikasi Toast (bukan alert() kaku browser) saat item masuk ke keranjang atau form berhasil dikirim.