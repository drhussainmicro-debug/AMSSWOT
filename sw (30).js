/* AMS Site Visit — service worker (auto-updating) */
const CACHE = 'ams-site-visit-20260708-174133';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const isNav = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (isNav) {
    // network-first: always try the latest HTML, fall back to cache when offline
    e.respondWith(
      fetch(req)
        .then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', cp)); return res; })
        .catch(() => caches.match('./index.html'))
    );
  } else {
    // cache-first for static assets
    e.respondWith(
      caches.match(req).then((c) => c || fetch(req).then((res) => {
        const cp = res.clone(); caches.open(CACHE).then((ch) => ch.put(req, cp)); return res;
      }))
    );
  }
});
