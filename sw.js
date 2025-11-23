const CACHE_NAME = 'home-affordability-1.0.5'; // bump version when you change assets
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
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
