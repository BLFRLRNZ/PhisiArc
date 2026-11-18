/* PhysiArc: funziona offline dopo la prima visita.
   Ogni file si chiede alla rete, così le novità arrivano subito. Ma se la rete è lenta (oltre 2,5 secondi)
   o assente, si usa subito la copia salvata, e intanto la risposta della rete, quando arriva, aggiorna la copia. */
const CACHE = 'phisiarc-v46';
const WAIT = 2500;
const SHELL = [
  './', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './css/style.css',
  './fonts/fonts.css', './fonts/lexend-latin.woff2', './fonts/lexend-latin-ext.woff2',
  './fonts/plexmono-400-latin.woff2', './fonts/plexmono-400-latin-ext.woff2', './fonts/plexmono-500-latin.woff2', './fonts/plexmono-500-latin-ext.woff2', './fonts/stixtwotext-600-italic.woff', './fonts/stixtwotext-600.woff',
  './js/app.js', './js/util.js', './js/state.js', './js/audio.js', './js/cast.js', './js/icons.js', './js/intro.js', './js/fx.js', './js/pieces.js', './js/level.js', './js/review.js', './js/tools.js', './js/toolanim.js', './js/toon.js', './js/toonkit.js', './js/toolfilm.js',
  './js/films/potenze.js', './js/films/formula.js', './js/films/quadrato.js', './js/films/radice.js', './js/films/pitagora.js', './js/films/pi.js', './js/films/seno.js', './js/films/props.js', './js/films/forza.js', './js/films/newton.js', './js/films/reazione.js', './js/neural.js', './js/voicepanel.js', './js/vendor/piper-phonemize.js', './js/i18n.js',
  './js/sims/index.js', './js/sims/base.js', './js/sims/pendulum.js', './js/sims/scale.js', './js/sims/race.js', './js/sims/fall.js', './js/sims/cannon.js', './js/sims/lab.js', './js/sims/river.js', './js/sims/circle.js', './js/sims/cart.js', './js/sims/ramp.js', './js/sims/coaster.js', './js/sims/collide.js', './js/sims/lever.js', './js/sims/tilt.js', './js/sims/orbit.js', './js/sims/weigh.js', './js/sims/kepler.js', './js/sims/solar.js',
  './js/sims/art/scale-shapes.js', './js/sims/art/fall-objects.js', './js/sims/art/car.js',
  './js/i18n/en.js', './js/i18n/en-ui.js', './js/i18n/en-meta.js', './js/i18n/en-extra.js', './js/i18n/en-f01.js', './js/i18n/en-f02.js', './js/i18n/en-f03.js', './js/i18n/en-m01.js', './js/i18n/en-m02.js', './js/i18n/en-m03.js', './js/i18n/en-m04.js', './js/i18n/en-m05.js', './js/i18n/en-d01.js', './js/i18n/en-d02.js', './js/i18n/en-d03.js', './js/i18n/en-d04.js', './js/i18n/en-d05.js', './js/i18n/en-g01.js', './js/i18n/en-g02.js', './js/i18n/en-g03.js', './js/i18n/en-tools.js',
  './js/content/index.js', './js/content/declarative.js', './js/content/f01.js', './js/content/f02.js', './js/content/f03.js', './js/content/m01.js', './js/content/m02.js', './js/content/m03.js', './js/content/m04.js', './js/content/m05.js', './js/content/d01.js', './js/content/d02.js', './js/content/d03.js', './js/content/d04.js', './js/content/d05.js', './js/content/g01.js', './js/content/g02.js', './js/content/g03.js',
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

// Si buttano le copie delle versioni vecchie del gioco, ma MAI le voci neurali scaricate (decine di MB):
// prima ogni aggiornamento del gioco le cancellava, e bisognava riscaricarle.
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== 'phisiarc-voci').map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  // la rete, che se risponde bene aggiorna anche la copia salvata
  const net = fetch(e.request, { cache: 'no-cache' }).then((res) => {
    if (res.ok) { const copy = res.clone(); return caches.open(CACHE).then((c) => c.put(e.request, copy)).then(() => res); }
    return res;
  });
  e.waitUntil(net.catch(() => {}));
  const saved = caches.match(e.request);
  const slow = new Promise((ok) => setTimeout(ok, WAIT));
  e.respondWith((async () => {
    // vince la rete se arriva in tempo; altrimenti la copia salvata (se c'è), altrimenti si aspetta la rete
    const first = await Promise.race([net.then((r) => ({ r })).catch(() => ({ fail: true })), slow.then(() => ({ slow: true }))]);
    if (first.r && first.r.ok) return first.r;
    const copy = await saved;
    if (copy) return copy;
    try { return await net; } catch { return (await caches.match('./index.html')) || Response.error(); }
  })());
});
