/* PhisiArc: funziona offline dopo la prima visita.
   I file dell'app si chiedono prima alla rete (così le novità arrivano subito) e, se manca, si usa la copia salvata. */
const CACHE = 'phisiarc-v2';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './css/style.css',
  './js/app.js', './js/util.js', './js/state.js', './js/audio.js', './js/cast.js', './js/icons.js', './js/intro.js', './js/level.js',
  './js/sims/index.js', './js/sims/base.js', './js/sims/pendulum.js', './js/sims/scale.js', './js/sims/race.js', './js/sims/fall.js', './js/sims/cannon.js',
  './js/content/index.js', './js/content/f01.js', './js/content/f02.js', './js/content/m01.js', './js/content/m02.js', './js/content/m03.js',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return res; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
