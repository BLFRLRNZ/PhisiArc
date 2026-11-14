// La cassetta degli attrezzi: un giocatore nuovo (Studente) apre il primo livello con le formule.
// Deve comparire la scheda dell'attrezzo, con l'animazione; si risponde giusto, si va avanti e il livello riparte.
import { createRequire } from 'node:module';
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(import.meta.url)('playwright'); }
const BASE = process.argv[2] || 'http://localhost:8765';
const b = await pw.chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
const fail = (m) => { console.log('NO ', m, errs); process.exit(1); };
await p.goto(BASE + '/');
await p.evaluate(async () => {
  const m = await import('./js/content/index.js');
  const done = Object.fromEntries(Object.values(m.ZONES).flatMap((z) => z.levels.map((l) => [l.id, 1])));
  localStorage.setItem('phisiarc-lingua', 'it');
  localStorage.setItem('phisiarc-v1', JSON.stringify({ v: 3, lens: 's', done, joule: 0, park: [], seen: { laboratorio: true }, introSeen: true, settings: { sound: false, voice: false, voiceChosen: true, intro: false, introChosen: true } }));
});
await p.goto(BASE + '/#/livello/f01-3'); await p.reload();
await p.waitForSelector('.toolcard', { timeout: 5000 }).catch(() => fail('la scheda non compare'));
if (!(await p.$('.toolcard .ta-svg path'))) fail('manca l’animazione');
if (!(await p.$eval('.quest', (e) => e.hidden))) fail('la domanda del livello dovrebbe aspettare la scheda');
let n = 0;
while (await p.$('.toolcard')) {
  // la risposta giusta si trova provando: le sbagliate si disattivano
  for (const o of await p.$$('.toolcard .opt:enabled')) { await o.click(); if (await p.$('.toolcard .tool-fb.good')) break; }
  if (!(await p.$('.toolcard .tool-fb.good'))) fail('nessuna risposta giusta');
  await p.click('.toolcard .row .btn.primary'); n++;
  if (n > 6) fail('le schede non finiscono');
}
if (await p.$eval('.quest', (e) => e.hidden)) fail('il livello non riparte');
const tools = await p.evaluate(() => JSON.parse(localStorage.getItem('phisiarc-v1')).tools);
if (Object.values(tools).some((v) => v !== 2)) fail('gli attrezzi non risultano imparati: ' + JSON.stringify(tools));
await p.goto(BASE + '/#/livello/f01-3'); await p.reload(); await p.waitForSelector('.lvl-head');
if (await p.$('.toolcard')) fail('la scheda torna anche la seconda volta');
await p.goto(BASE + '/#/attrezzi'); await p.waitForSelector('.tool-item');
if ((await p.$$('.tool-item')).length !== 6) fail('la cassetta non ha 6 attrezzi');
await b.close();
if (errs.length) fail('errori nella pagina');
console.log(`ok  cassetta degli attrezzi: ${n} schede, poi il livello riparte`);
