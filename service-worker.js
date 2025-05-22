const CACHE_NAME = 'ai-eisenhower-matrix-v1';
// Perlu disesuaikan dengan output aktual dari proses build Anda (misalnya, nama file JS/CSS yang di-bundle).
// Untuk saat ini, ini mencakup aset inti yang diketahui.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Jika Anda mem-bundle index.tsx menjadi file JS (misalnya, app.js), ganti '/index.tsx' di bawah ini.
  // Untuk saat ini, kita akan mencoba meng-cache '/index.tsx' seperti yang disajikan.
  '/index.tsx', 
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  // Tambahkan path ke file CSS yang di-bundle jika ada.
  // Tambahkan path ke file JS yang di-bundle lainnya jika ada.
  'https://cdn.tailwindcss.com', // Berhati-hati saat meng-cache resource pihak ketiga
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' // Dan font
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Menggunakan addAll bisa gagal jika salah satu resource gagal di-fetch.
        // Pertimbangkan untuk meng-cache resource penting secara individual jika diperlukan.
        return cache.addAll(urlsToCache.map(url => new Request(url, { mode: 'no-cors' })))
          .catch(error => {
            console.error('Gagal menambahkan beberapa URL ke cache saat instalasi:', error);
            // Mungkin tidak semua URL berhasil di-cache, terutama CDN pihak ketiga tanpa CORS yang tepat
            // untuk mode 'no-cors' (opaque responses), atau jika sumber daya tidak tersedia.
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Hanya menangani permintaan GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Untuk resource yang dikontrol oleh CDN (misalnya, esm.sh, tailwindcss, googleapis)
  // seringkali lebih baik membiarkan browser menanganinya (network-first atau cache-first dengan revalidasi)
  // karena mereka memiliki header caching sendiri.
  // Meng-cache-nya secara agresif di service worker bisa menyebabkan resource menjadi usang.
  // Namun, untuk PWA dasar, kita akan coba cache-first untuk semua yang ada di urlsToCache.

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Penting: Clone request. Request adalah stream dan hanya bisa dikonsumsi sekali.
        // Kita perlu satu untuk fetch dan satu untuk dimasukkan ke cache.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(networkResponse => {
            // Periksa apakah kita menerima respons yang valid
            if (!networkResponse || networkResponse.status !== 200 && networkResponse.status !== 0 /* opaque response */) {
              return networkResponse;
            }

            // Penting: Clone response. Response adalah stream dan hanya bisa dikonsumsi sekali.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed; returning offline page or error for:', event.request.url, error);
          // Anda bisa mengembalikan halaman offline kustom di sini jika diinginkan
          // return caches.match('/offline.html');
        });
      })
  );
});
