# Product Requirement Document (PRD)
## KantinKita – Sistem Pemesanan Kantin Kampus

---

## 1. Ringkasan

**KantinKita** adalah aplikasi web progresif (PWA) untuk pemesanan makanan di kantin kampus. Solusi ini dirancang untuk menghilangkan antrean panjang saat jam istirahat dengan memungkinkan mahasiswa memesan lebih awal dan mengambil pesanan sesuai slot waktu yang dipilih.

**Masalah yang Diselesaikan:** Mahasiswa kehilangan 10–20 menit istirahat hanya untuk antre di kantin. Penjual kesulitan mengelola lonjakan pesanan saat jam sibuk (12.00–13.00).

**Solusi:** Platform pemesanan digital dengan penjadwalan waktu ambil, pembayaran cashless, dan dasbor penjual real-time.

---

## 2. Target Pengguna

### User A: Mahasiswa
- **Febri Ramadhan** (21 tahun) — pengguna aktif, sering kehabisan menu favorit
- **Putri Aulia** (20 tahun) — pengguna baru, butuh pengalaman mudah
- **Pain points:** Antrean panjang, menu habis, tidak tahu kapan selesai

### User B: Penjual Kantin
- **Ibu Kantin (Stan A)** — penjual nasi & ayam, tidak terlalu melek teknologi
- **Pain points:** Kewalahan pesanan di jam sibuk, susah prediksi stok

---

## 3. Fitur MVP (Minimum Viable Product)

### 3.1 Mahasiswa
| Fitur | Prioritas | Status |
|-------|-----------|--------|
| Login dengan validasi form | Tinggi | Selesai |
| Beranda dengan filter kategori | Tinggi | Selesai |
| Pencarian & filter menu | Tinggi | Selesai |
| Halaman detail menu stan | Tinggi | Selesai |
| Add to cart & keranjang | Tinggi | Selesai |
| Pilih jam ambil (slot) | Tinggi | Selesai |
| Halaman pembayaran | Tinggi | Selesai |
| Pemilihan metode bayar | Tinggi | Selesai |
| Status pesanan live | Tinggi | Selesai |
| Kode QR pengambilan | Sedang | Selesai |
| Rating & ulasan | Sedang | Selesai |
| Hamburguer menu navigasi | Tinggi | Selesai |

### 3.2 Penjual
| Fitur | Prioritas | Status |
|-------|-----------|--------|
| Dasbor pesanan masuk | Tinggi | Selesai |
| Terima / tolak pesanan | Tinggi | Selesai |
| Toggle status stan (Buka/Sibuk/Tutup) | Tinggi | Selesai |
| Pengaturan waktu estimasi | Sedang | Selesai |
| Laporan penjualan harian | Sedang | Selesai |
| Grafik pesanan per jam | Sedang | Selesai |

---

## 4. Alur Pengguna (User Flow)

### Flow Mahasiswa (Happy Path)
```
Login → Beranda → [Filter Kategori] → Menu Stan
→ [Add to Cart] → Keranjang → [Pilih Jam] 
→ Pembayaran → [Pilih Metode] → Status Pesanan
→ [QR Scan di Stan] → [Beri Rating] → Selesai
```

### Flow Penjual
```
Login Penjual → Dasbor → [Terima Pesanan] 
→ Rekap Dapur → [Tandai Siap] → Scan Tiket
→ Laporan Harian → Kelola Stok
```

---

## 5. Spesifikasi Teknis

### Design System
- **Warna Primer:** Yellow #FFC107 (60-30-10: 30%)
- **Warna Sekunder:** Red #E53935 (60-30-10: 10%)
- **Netral:** #FFFFFF, #F9FAFB, #111827 (60-30-10: 60%)
- **Tipografi:** Inter (400, 500, 600, 700, 800, 900)
- **Grid:** 8-point (4, 8, 12, 16, 20, 24, 32, 40, 48px)
- **Border Radius:** 8, 12, 16, 20, 28, 9999px

### Prinsip Desain yang Diterapkan
- **Atomic Design Methodology:** Atoms → Molecules → Organisms → Pages
- **Material Design 3:** Color roles, shape scale, elevation system
- **60-30-10 Color Rule:** Distribusi warna konsisten
- **8-Point Grid:** Semua spacing menggunakan kelipatan 8px
- **WCAG 2.1 AA:** Kontras warna minimum 4.5:1

### Interaktivitas (Wajib ≥ 2)
1. Hamburger menu → nav drawer slide-in
2. Category filter tabs → dynamic content filter
3. Cart state management → real-time badge & total
4. Payment method → radio selection UI
5. Rating modal → star interaction + bottom sheet
