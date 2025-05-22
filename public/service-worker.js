const CACHE_NAME = 'ai-eisenhower-matrix-v2'; // Incremented cache version

// This list will be mostly populated by Vite's PWA plugin in a more advanced setup.
// For a manual setup, you'd add paths to your JS/CSS bundles from the 'www/assets' directory.
const CORE_ASSETS_TO_CACHE = [
  '/', // Alias for index.html
  '/index.html',
  '/manifest.json', // Should be in public directory
  '/assets/icons/icon-192x192.png', // Should be in public/assets/icons
  '/assets/icons/icon-512x512.png'  // Should be in public/assets/icons
  // Placeholder for Vite's output - inspect your 'www' folder after build
  // For example:
  // '/assets/index.abcdef.js',
  // '/assets/index.123456.css',
  // '/assets/vendor.fedcba.js'
];

const EXTERNAL_ASSETS_TO_CACHE_OPAQULY = [
  // Tailwind and Google Fonts are fetched from CDNs
  // Caching them with 'no-cors' provides basic offline fallback but is opaque.
  // Better: Bundle Tailwind, or use a more sophisticated caching strategy for fonts.
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[ServiceWorker] Caching core application shell assets');
        // Cache essential local assets. If any of these fail, the SW install will fail.
        await cache.addAll(CORE_ASSETS_TO_CACHE).catch(error => {
            console.error('[ServiceWorker] Failed to cache one or more core assets during install:', error);
            throw error; // Propagate error to fail SW install if core assets fail
        });

        console.log('[ServiceWorker] Attempting to cache external assets (opaque)');
        // Attempt to cache external assets with no-cors. Do not let these fail the install.
        for (const url of EXTERNAL_ASSETS_TO_CACHE_OPAQULY) {
          try {
            // For no-cors requests, the response is opaque, meaning we can't know if it was successful (status 0).
            await cache.add(new Request(url, { mode: 'no-cors' }));
          } catch (err) {
            console.warn(`[ServiceWorker] Failed to cache external asset (no-cors): ${url}`, err);
          }
        }
      })
      .then(() => {
        console.log('[ServiceWorker] All assets cached (or attempted), install successful.');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch(error => {
        console.error('[ServiceWorker] Caching failed during install, service worker not installed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate event');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Clients claims for immediate control.');
      return self.clients.claim(); // Take control of all open pages
    })
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Strategy: Cache First, then Network for core assets and defined external assets.
  // For other requests (e.g., API calls, especially to Gemini), always go to network.
  
  const requestUrl = new URL(event.request.url);

  // Don't cache API requests or anything not explicitly part of the app shell.
  // Example: if your API is on a different domain or path
  // if (requestUrl.hostname === 'api.example.com') {
  //   event.respondWith(fetch(event.request));
  //   return;
  // }

  // For navigation requests (HTML), try network first to get the latest, then fallback to cache.
  // This helps if the app shell itself is updated.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // If fetch is successful, clone and cache it before returning
          if (networkResponse && networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails (offline), try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other assets (CSS, JS, images), use Cache First strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // console.log(`[ServiceWorker] Serving from cache: ${event.request.url}`);
          return cachedResponse;
        }

        // console.log(`[ServiceWorker] Not in cache, fetching: ${event.request.url}`);
        return fetch(event.request).then(
          networkResponse => {
            if (networkResponse && networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        );
      })
      .catch(error => {
        console.error('[ServiceWorker] Fetch error:', error);
        // You could return a generic fallback response or error page here
        // For example: return new Response("Network error occurred", { status: 503, statusText: "Service Unavailable" });
      })
  );
});