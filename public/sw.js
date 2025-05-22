// Nama cache untuk aplikasi
const CACHE_NAME = 'eisenhower-ai-v1';

// Daftar aset yang akan di-cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.tailwindcss.com'
];

// Event Install - Menginstal Service Worker dan meng-cache aset
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Meng-cache aset untuk offline');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Gagal meng-cache aset:', error);
      })
  );
});

// Event Activate - Membersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Event Fetch - Menangani permintaan jaringan
self.addEventListener('fetch', (event) => {
  // Abaikan permintaan non-GET dan permintaan ke Google Analytics
  if (event.request.method !== 'GET' || 
      event.request.url.includes('google-analytics.com') ||
      event.request.url.includes('googletagmanager.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Mengembalikan respons dari cache jika tersedia
        if (response) {
          return response;
        }

        // Jika tidak ada di cache, coba ambil dari jaringan
        return fetch(event.request)
          .then((networkResponse) => {
            // Periksa apakah respons valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone respons untuk disimpan di cache
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Jika offline dan halaman diminta, tampilkan halaman offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            return new Response('Tidak ada koneksi internet', {
              status: 408,
              statusText: 'Koneksi internet terputus',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Event Push - Menangani notifikasi push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Notifikasi baru dari Eisenhower AI',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Eisenhower AI', options)
  );
});

// Event Sync - Menangani sinkronisasi saat online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(
      // Tambahkan logika sinkronisasi di sini
      console.log('Melakukan sinkronisasi tugas...')
    );
  }
});
