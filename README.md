# MONOKALA — QR Ordering & Queue

Sistem pemesanan dan antrean digital berbasis QR code untuk cafe MONOKALA.
Dibangun dengan React 19, Vite 7, TypeScript, dan Tailwind CSS 4.

## Fitur

- **Guest App** — pelanggan scan QR meja → langsung ke menu, pesan, bayar, dan pantau antrean
- **Kitchen Display** — dapur menerima pesanan real-time (Masuk → Diracik → Siap → Selesai)
- **Manajemen Menu** — tambah/ubah item, harga, foto, kategori, tambahan (addons), dan penanda habis
- **QR Meja** — generator + printer QR code otomatis untuk semua meja
- **Pengaturan** — service charge, pajak PB1, metode pembayaran, jumlah meja, password staf
- **Password Gate** — akses staf dilindungi password (dapat diganti dari dashboard)

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

## Build Production

```bash
npm run build
```

Output ada di `dist/`.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Import repo di [vercel.com/new](https://vercel.com/new).
3. Vercel akan otomatis mendeteksi Vite, gunakan pengaturan default.
4. Klik **Deploy**.
5. Generate ulang QR meja dari dashboard staf menggunakan domain produksi.

## Struktur URL Meja

Tiap meja punya URL unik berbasis query param:

```
https://your-domain.com/?table=01
https://your-domain.com/?table=02
```

QR code untuk semua meja bisa dicetak dari dashboard staf → tab **QR Meja**.

## Password Staf Default

Password awal: `monokala2024`  
Ganti dari dashboard → **Pengaturan** → **Ubah Password Staf**.
