// La cassetta degli attrezzi, con un giocatore nuovo (Studente).
// 1) Un attrezzo che serve per rispondere: all'inizio del livello compare la sua scheda, con l'animazione;
//    si risponde giusto, si va avanti e il livello riparte; la seconda volta la scheda non torna.
// 2) Un attrezzo che compare solo in una spiegazione: nessuna scheda all'inizio, ma sotto la spiegazione c'è un bottone che la apre.
import { createRequire } from 'node:module';
let pw;
try { pw = await import('playwright'); } catch { pw = createRequire(import.meta.url)('playwright'); }
const BASE = process.argv[2] || 'http://localhost:8765';
const b = await pw.chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
const fail = (m) => { console.log('NO ', m, errs); process.exit(1); };
await p.addInitScript(() => { window.__phisiarcTest = {}; });
await p.goto(BASE + '/');
await p.evaluate(async () => {
  const m = await import('./js/content/index.js');
  const done = Object.fromEntries(Object.values(m.ZONES).flatMap((z) => z.levels.map((l) => [l.id, 1])));
  localStorage.setItem('phisiarc-lingua', 'it');
  localStorage.setItem('phisiarc-v1', JSON.stringify({ v: 3, lens: 's', done, joule: 0, park: [], seen: { laboratorio: true }, introSeen: true, settings: { sound: false, voice: false, voiceChosen: true, intro: false, introChosen: true } }));
});

// 1) f02-1 usa le potenze di 10 nell'introduzione: la scheda si apre da sola
await p.goto(BASE + '/#/livello/f02-1'); await p.reload();
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
if (n !== 1) fail(`attesa una scheda sola in f02-1, trovate ${n}`);
if (await p.$eval('.quest', (e) => e.hidden)) fail('il livello non riparte');
let tools = await p.evaluate(() => JSON.parse(localStorage.getItem('phisiarc-v1')).tools);
if (tools.potenze !== 2 || Object.keys(tools).length !== 1) fail('dovrebbe risultare imparato solo «potenze»: ' + JSON.stringify(tools));
await p.goto(BASE + '/#/livello/f02-1'); await p.reload(); await p.waitForSelector('.lvl-head');
if (await p.$('.toolcard')) fail('la scheda torna anche la seconda volta');

// 2) f01-3: la formula del pendolo sta nella spiegazione dopo la previsione. Nessuna scheda all'inizio; dopo, i bottoni.
await p.goto(BASE + '/#/livello/f01-3'); await p.reload(); await p.waitForSelector('.lvl-head');
if (await p.$('.toolcard')) fail('in f01-3 non deve aprirsi nessuna scheda all’inizio');
await p.evaluate(() => window.__phisiarcTest.fast(4));
await p.click('.opts .opt');
await p.waitForSelector('.say .tool-chip', { timeout: 30000 }).catch(() => fail('sotto la spiegazione mancano i bottoni degli attrezzi'));
const chips = await p.$$eval('.say .tool-chip', (bs) => bs.map((x) => x.dataset.tool));
if (!chips.includes('radice')) fail('fra i bottoni manca la radice: ' + chips);
await p.click('.say .tool-chip[data-tool="radice"]');
await p.waitForSelector('.toolcard.offered', { timeout: 3000 }).catch(() => fail('il bottone non apre la scheda'));
if (await p.$('.tool-chip[data-tool="radice"]')) fail('il bottone dell’attrezzo aperto dovrebbe sparire');
// la radice porta con sé il quadrato, che questo giocatore non conosce ancora: due schede, prima il quadrato
if (!(await p.$eval('.toolcard h3', (e) => e.textContent)).includes('x²')) fail('prima della radice dovrebbe arrivare il quadrato');
for (let k = 0; k < 3 && (await p.$('.toolcard')); k++) await p.click('.toolcard .row .btn.primary');
if (await p.$('.toolcard')) fail('la scheda offerta non si chiude');
tools = await p.evaluate(() => JSON.parse(localStorage.getItem('phisiarc-v1')).tools);
if (!tools.radice || !tools.quadrato) fail('quadrato e radice aperti dal bottone non risultano visti: ' + JSON.stringify(tools));

await p.goto(BASE + '/#/attrezzi'); await p.waitForSelector('.tool-item');
if ((await p.$$('.tool-item')).length !== 7) fail('la cassetta non ha 7 attrezzi');
await b.close();
if (errs.length) fail('errori nella pagina');
console.log('ok  cassetta degli attrezzi: scheda all’inizio di f02-1, bottoni sotto la spiegazione di f01-3, 7 attrezzi');
