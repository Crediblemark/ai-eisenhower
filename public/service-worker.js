const CACHE_NAME = 'ai-eisenhower-matrix-v3';
const OFFLINE_PAGE = '/offline.html';

// Core assets that should be cached on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// External resources that can be cached
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/inter/'
];

// Helper function to cache resources
const cacheResources = async (cache, resources) => {
  try {
    await cache.addAll(resources);
    console.log('[ServiceWorker] Cached resources:', resources);
  } catch (error) {
    console.error('[ServiceWorker] Cache addAll error:', error);
  }
};

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install event');
  
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching core application shell assets');
        return cacheResources(cache, CORE_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate event');
  
  // Remove previous cached data if cache name changes
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For navigation requests, respond with the offline page if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the response is good, cache it and return it
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to get it from the cache
        return caches.match(event.request);
      })
  );
});
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

  // For other assets  // For all other requests, use network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the response is good, clone it and store it in the cache
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request).then((response) => {
          return response || new Response('Offline', {
            status: 503,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'SYNC_DATA') {
    // Handle data sync when coming back online
    console.log('Syncing data...');
    // Add your data sync logic here
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const title = 'AI Eisenhower Matrix';
  const options = {
    body: event.data?.text() || 'You have new updates!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Handle the notification click
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
        // For example: return new Response("Network error occurred", { status: 503, statusText: "Service Unavailable" });
      })
  );
});