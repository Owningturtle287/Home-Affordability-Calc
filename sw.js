const CACHE_NAME = 'hac-1.0.5.1'; // <-- bump this whenever you ship changes

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/homecalc-icon-32.png',
  './icons/homecalc-icon-192.png',
  './icons/homecalc-icon-256.png', // new icon you added
  './icons/homecalc-icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );

  // Make the new SW take over immediately
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

  // Control all open clients right away
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for navigations so index.html updates
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
