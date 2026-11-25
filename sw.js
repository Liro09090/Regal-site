// Cache simplu: site-ul se deschide rapid și merge și fără semnal.
// La fiecare modificare a site-ului, crește numărul versiunii.
const CACHE = 'regal-v2';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/logo.webp', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/favicon.png', 'icons/apple-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // întâi internetul (ca să apară mereu ultima versiune), cache-ul doar dacă nu e semnal
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
