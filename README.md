
# AI Eisenhower Matrix PWA

Aplikasi Eisenhower Matrix yang ditenagai AI untuk membantu Anda memprioritaskan tugas secara efektif. Aplikasi ini dibangun sebagai Progressive Web App (PWA) menggunakan React, TypeScript, dan Vite, dengan tujuan akhir untuk dapat dikemas menjadi aplikasi Android menggunakan Trusted Web Activity (TWA) via Bubblewrap.

## Langkah Selanjutnya untuk Menjalankan dan Mem-build Proyek

Proyek ini telah dikonfigurasi untuk menggunakan Vite sebagai alat build dan server pengembangan. Berikut adalah langkah-langkah yang perlu Anda ikuti:

### 1. Prasyarat

Pastikan Anda memiliki perangkat lunak berikut terinstal:
*   **Node.js**: Versi LTS direkomendasikan. (Sudah termasuk npm)
*   **Yarn (Opsional)**: Jika Anda lebih memilih Yarn daripada npm.
*   **Java Development Kit (JDK)**: Diperlukan nanti jika Anda ingin menggunakan Bubblewrap untuk mengemas PWA menjadi aplikasi Android. Versi 11 atau lebih baru direkomendasikan.

### 2. Atur Struktur Direktori Proyek ✅

✅ **SELESAI** - Struktur direktori telah diatur dengan benar. Berikut adalah struktur saat ini:

```
project-root/
├── public/              # Aset statis
│   └── service-worker.js
├── src/                 # Kode sumber utama aplikasi
│   ├── App.tsx
│   ├── components/
│   ├── constants.tsx
│   ├── index.tsx
│   ├── services/
│   └── types.ts
├── .env.local           # File konfigurasi lingkungan
├── index.html
├── package.json
└── vite.config.ts
```

```
project-root/
├── public/              # Aset statis, disalin ke root 'www' saat build
│   ├── assets/
│   │   └── icons/
│   │       ├── icon-192x192.png  (ANDA PERLU MEMBUAT FILE INI)
│   │       └── icon-512x512.png  (ANDA PERLU MEMBUAT FILE INI)
│   ├── manifest.json          # PINDAHKAN manifest.json KE SINI
│   └── service-worker.js      # PINDAHKAN service-worker.js KE SINI
├── src/                 # Kode sumber utama aplikasi Anda
│   ├── App.tsx              # PINDAHKAN App.tsx KE SINI
│   ├── components/          # PINDAHKAN direktori components/ KE SINI
│   ├── constants.tsx        # PINDAHKAN constants.tsx KE SINI
│   ├── index.tsx            # PINDAHKAN index.tsx KE SINI
│   ├── services/            # PINDAHKAN direktori services/ KE SINI
│   └── types.ts             # PINDAHKAN types.ts KE SINI
├── .env                 # (ANDA BUAT FILE INI PADA LANGKAH 3)
├── index.html           # Biarkan index.html di root proyek
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

*   **Buat Ikon Aplikasi**: Buat ikon aplikasi Anda dan letakkan di `public/assets/icons/`. Ukuran yang umum adalah `192x192` dan `512x512` piksel dengan format PNG. Pastikan nama filenya sesuai dengan yang didefinisikan di `public/manifest.json`.

### 3. Konfigurasi Kunci API Gemini ✅

✅ **SELESAI** - Kunci API Gemini telah dikonfigurasi di `.env.local`.

File `.gitignore` sudah termasuk `.env*` untuk mencegah pengiriman kunci API ke repositori.

### 4. Instal Dependensi Proyek ✅

✅ **SELESAI** - Dependensi proyek telah diinstal menggunakan:

```bash
npm install
```

Semua dependensi yang diperlukan sudah terpasang dan siap digunakan.

### 5. Jalankan Server Pengembangan (Development Mode) ✅

✅ **SELESAI** - Server pengembangan berhasil dijalankan dengan:

```bash
npm run dev
```

Aplikasi dapat diakses di:
- Local: http://localhost:5173/
- Network: http://[your-local-ip]:5173/

Hot-reloading berfungsi dengan baik untuk pengembangan.

### 6. Build Aplikasi untuk Produksi (PWA Assets) ⏳

**BELUM DIUJI** - Untuk membuat versi produksi:

```bash
npm run build:web
```

Ini akan membuat direktori `www/` yang berisi aset PWA siap produksi.

Ketika Anda siap untuk membuat versi produksi dari PWA Anda:
```bash
npm run build:web
```
atau
```bash
yarn build:web
```
Perintah ini akan:
1.  Menjalankan `tsc` untuk memeriksa tipe TypeScript.
2.  Menjalankan `vite build` untuk mem-bundle dan mengoptimalkan semua aset aplikasi Anda (JavaScript, CSS, gambar, dll.).
3.  Menghasilkan output ke direktori `www/` di root proyek Anda. Direktori `www/` ini berisi PWA Anda yang siap di-deploy atau dikemas.

**PENTING: Perbarui Daftar Cache Service Worker**:
Setelah menjalankan `npm run build:web` untuk pertama kalinya, periksa direktori `www/assets/`. Anda akan melihat nama file JavaScript dan CSS yang di-bundle (misalnya, `index-a1b2c3d4.js`).
Buka file `public/service-worker.js` dan **perbarui array `CORE_ASSETS_TO_CACHE`** agar menyertakan path yang benar ke file-file ini. Contoh:
```javascript
// public/service-worker.js
const CORE_ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  // CONTOH: GANTI INI DENGAN NAMA FILE AKTUAL DARI BUILD ANDA
  // '/assets/index.abcdef01.js',
  // '/assets/main.12345678.css'
];
```
Tanpa ini, service worker tidak akan meng-cache file JS/CSS utama Anda dengan benar.
Untuk pengelolaan service worker yang lebih otomatis, pertimbangkan untuk menggunakan plugin seperti `vite-plugin-pwa`.

### 7. Uji Build Produksi Secara Lokal ⏳

**BELUM DIUJI** - Setelah build produksi selesai, uji dengan:

```bash
npm run preview
```

Ini akan menjalankan server preview untuk menguji versi produksi secara lokal.

### 8. Langkah Selanjutnya: Mengemas PWA untuk Google Play Store (Bubblewrap) ⏳

**BELUM DILAKUKAN** - Untuk mengemas PWA menjadi aplikasi Android:

Setelah PWA Anda berfungsi dengan baik dan telah di-build ke direktori `www/`:

1.  **Pastikan JDK Terinstal**: Bubblewrap memerlukan Java Development Kit.
2.  **Instal Bubblewrap CLI secara Global**:
    ```bash
    npm install -g @bubblewrap/cli
    ```
3.  **Inisialisasi Proyek Bubblewrap**: Navigasi ke direktori root proyek Anda di terminal dan jalankan:
    ```bash
    bubblewrap init --manifest ./www/manifest.json
    ```
    Bubblewrap akan menanyakan beberapa detail tentang aplikasi Anda.
4.  **Build Aplikasi Android (.apk & .aab)**:
    ```bash
    bubblewrap build
    ```
    Ini akan menghasilkan file `.apk` (untuk pengujian) dan `.aab` (untuk diunggah ke Google Play Store) di direktori proyek Anda.

### Tips Tambahan:

*   **`vite-plugin-pwa`**: Untuk pengelolaan service worker dan manifest PWA yang lebih canggih dan otomatis, pertimbangkan untuk menambahkan `vite-plugin-pwa` ke proyek Vite Anda. Plugin ini dapat menghasilkan service worker secara otomatis, menyuntikkan daftar aset yang akan di-cache, dan banyak lagi.
*   **Debugging Service Worker**: Gunakan tab "Application" di Chrome DevTools untuk menginspeksi service worker, cache, dan manifest PWA Anda.

Semoga berhasil!
