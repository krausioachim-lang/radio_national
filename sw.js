const CACHE_NAME = 'radio-nt-v6'; // Am crescut versiunea la v6
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  // Adaugă aici toate logo-urile noi pentru a fi disponibile offline
  './img/logo_radiomplus.webp',
  './img/logo_jurnal_fm.png',
  './img/viva.png',
  './img/terrafm.png',
  './img/europafm.png',
  './img/kissfm.png',
  './img/magicfm.png',
  './img/digifm.png',
  './img/digi24fm.png',
  './img/profm.png',
  './img/rockfm.png',
  './img/dancefm.png',
  './img/subasio.png',
  './img/subasiopiu.png',
  './img/countryny.png',
  './img/country100_5.png',
  './img/icon-512.png'
];

// Instalare și caching active
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Curățarea cache-ului vechi (v2)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Strategia de fetch: Network First pentru stream-uri, Cache First pentru imagini/UI
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Nu punem în cache fluxurile audio (stream-urile)
  if (event.request.destination === 'audio' || url.port === '7880' || url.port === '7009' || url.port === '8008') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
