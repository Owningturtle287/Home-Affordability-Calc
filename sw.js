const CACHE_NAME = 'home-affordability-1.0.5'; // bump this *every time* you deploy
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/homecalc-icon-32.png',
  './icons/homecalc-icon-192.png',
  './icons/homecalc-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );

  // Immediately activate the new service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );

  // Take control of all open clients right away
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for navigation (HTML) so new versions show up
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for everything else (icons, manifest, etc.)
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
