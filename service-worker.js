const CACHE_NAME = 'sabores-minas-v7';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './foods.js',
  './app.js',
  './manifest.webmanifest',
  './assets/logo-sesi.png',
  './assets/bg-minas-igrejas-comidas.png',
  './assets/card-back-minas.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon.png',
  './assets/pao_de_queijo.png',
  './assets/feijao_tropeiro.png',
  './assets/frango_com_quiabo.png',
  './assets/tutu_de_feijao.png',
  './assets/torresmo.png',
  './assets/broa_de_fuba.png',
  './assets/doce_de_leite.png',
  './assets/romeu_e_julieta.png',
  './assets/pamonha.png',
  './assets/goiabada.png',
  './assets/canjiquinha.png',
  './assets/queijo_minas.png',
  './assets/biscoito_de_polvilho.png',
  './assets/angu.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
