// Gioca tutti i livelli, in tutte e tre le lenti, in Chrome (Playwright), facendo ogni volta la mossa giusta.
// Fallisce se un livello non arriva alla fine o se la pagina dà errori.
// Uso: avvia un server statico sulla cartella del gioco (es. python3 -m http.server 8765) e poi
//      node tests/play-all.mjs [indirizzo] [lenti] [livelli]
//      es. node tests/play-all.mjs http://localhost:8765 s m04-1,m04-2
import { createRequire } from 'node:module';

// playwright dal progetto (npm install) o, se manca, da quello installato nel sistema (NODE_PATH)
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(import.meta.url)('playwright'); }
const { chromium } = pw;

const BASE = process.argv[2] || 'http://localhost:8765';
const LENSES = (process.argv[3] || 'e,s,c').split(',');
const ONLY = process.argv[4] ? process.argv[4].split(',') : null;
const LEVEL_TIMEOUT = 120_000;

const launchOpts = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
const browser = await chromium.launch(launchOpts);
const failures = [];
const t0 = Date.now();

for (const lens of LENSES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => { window.__phisiarcTest = {}; });
  await page.goto(BASE + '/');
  const ids = await page.evaluate(async () => {
    const m = await import('./js/content/index.js');
    return Object.values(m.ZONES).flatMap((z) => z.levels.map((l) => l.id));
  });
  // tutti i livelli aperti, niente suoni, voce, animazione d'apertura
  await page.evaluate(({ ids, lens }) => {
    const done = Object.fromEntries(ids.map((i) => [i, 1]));
    localStorage.setItem('phisiarc-v1', JSON.stringify({ lens, done, joule: 0, park: [], seen: Object.fromEntries(['laboratorio', 'pista', 'officina', 'cielo'].map((w) => [w, true])), introSeen: true, settings: { sound: false, voice: false, voiceChosen: true, intro: false } }));
  }, { ids, lens });
  for (const id of ids) {
    if (ONLY && !ONLY.includes(id)) continue;
    const before = errors.length, start = Date.now();
    await page.goto(`${BASE}/#/livello/${id}`);
    await page.reload();
    await page.waitForSelector('.lvl-head', { timeout: 10_000 }).catch(() => {});
    await page.evaluate(() => window.__phisiarcTest.fast && window.__phisiarcTest.fast(4));
    let ok = false;
    while (Date.now() - start < LEVEL_TIMEOUT) {
      if (await page.$('.modal')) { ok = true; break; }
      const next = await page.$('button:has-text("Avanti"):enabled');
      if (next) { await next.click(); await page.waitForTimeout(150); continue; }
      const busy = await page.evaluate(() => window.__phisiarcTest.busy && window.__phisiarcTest.busy());
      if (!busy) await page.evaluate(() => window.__phisiarcTest.solve && window.__phisiarcTest.solve());
      await page.waitForTimeout(busy ? 250 : 400);
    }
    const errs = errors.slice(before);
    const secs = ((Date.now() - start) / 1000).toFixed(1);
    if (!ok || errs.length) failures.push(`${id} [${lens}]: ${ok ? '' : 'non arriva alla fine. '}${errs.join(' | ')}`);
    console.log(`${ok && !errs.length ? 'ok ' : 'NO '} ${id} [${lens}] ${secs} s`);
  }
  await page.close();
}
await browser.close();
console.log(`\nTempo totale: ${Math.round((Date.now() - t0) / 1000)} s`);
if (failures.length) { console.log(`\n${failures.length} problemi:\n- ` + failures.join('\n- ')); process.exit(1); }
console.log('Tutti i livelli arrivano alla fine, senza errori.');
