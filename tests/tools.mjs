// La cassetta degli attrezzi, con un giocatore nuovo (Studente).
// 1) Un attrezzo che serve per rispondere: all'inizio del livello compare la sua scheda, con l'animazione;
//    si risponde giusto, si va avanti e il livello riparte; la seconda volta la scheda non torna.
// 2) Un attrezzo che compare solo in una spiegazione: nessuna scheda all'inizio, ma sotto la spiegazione c'è un bottone che la apre.
// 3) Gli attrezzi di fisica non interrompono mai: in d01-2 l'introduzione parla della seconda legge, e sotto c'è il bottone.
// 4) La cassetta: due scaffali, matematica e fisica; ogni attrezzo ha il suo film.
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
if (!(await p.$('.toolcard canvas.ta-cv'))) fail('manca il film dell’attrezzo');
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

// 3) d01-2: la seconda legge è nell'introduzione, ma l'attrezzo di fisica si offre soltanto
await p.goto(BASE + '/#/livello/d01-2'); await p.reload(); await p.waitForSelector('.lvl-head');
await p.waitForTimeout(300);
if (await p.$('.toolcard')) fail('in d01-2 un attrezzo di fisica non deve aprirsi da solo');
if (await p.$eval('.quest', (e) => e.hidden)) fail('in d01-2 la domanda non deve aspettare');
if (!(await p.$('.bubble .tool-chip[data-tool="newton"]'))) fail('in d01-2 manca il bottone «Forza, massa e accelerazione»');
await p.click('.bubble .tool-chip[data-tool="newton"]');
await p.waitForSelector('.toolcard.offered canvas.ta-cv', { timeout: 3000 }).catch(() => fail('il bottone della seconda legge non apre la scheda con il film'));

await p.goto(BASE + '/#/attrezzi'); await p.waitForSelector('.tool-item');
const ids = await p.$$eval('.tool-item', (es) => es.map((e) => e.dataset.tool));
if (ids.length !== 10) fail(`la cassetta dovrebbe avere 10 attrezzi, ne ha ${ids.length}`);
const shelves = await p.$$eval('.tool-shelf', (es) => es.map((e) => e.textContent));
if (shelves.join() !== 'Matematica,Fisica') fail('gli scaffali della cassetta sono: ' + shelves);
if (ids.slice(-3).join() !== 'inerzia,newton,reazione') fail('sullo scaffale della fisica mancano inerzia, newton, reazione: ' + ids);

// 3) ogni attrezzo ha il suo piccolo film: dura circa un minuto, parte da solo, disegna dall'inizio alla fine,
//    e in nessun momento la mano dell'omino deve arrivare a un oggetto che non raggiunge
const film = (fn, arg) => p.$eval('.toolcard canvas.ta-cv', fn, arg);
// quanti punti accesi ci sono sulla tela (lo sfondo è nero)
const lit = () => film((c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] + d[i + 1] + d[i + 2] > 300) n++; return n; });
for (const id of ids) {
  await p.goto(BASE + '/#/attrezzi'); await p.waitForSelector('.tool-item');
  await p.click(`.tool-item[data-tool="${id}"]`);
  const name = await p.$eval('.toolcard h3', (e) => e.textContent);
  await p.waitForSelector('.toolcard canvas.ta-cv', { timeout: 3000 }).catch(() => fail(`«${name}» non ha il suo film`));
  await film((c) => c.scrollIntoView({ block: 'center' }));   // il film parte appena si vede
  await p.waitForFunction(() => document.querySelector('.toolcard canvas.ta-cv').__film.playing, null, { timeout: 3000 }).catch(() => fail(`il film di «${name}» non parte da solo`));
  const dur = await film((c) => c.__film.dur);
  if (!(dur >= 40 && dur <= 70)) fail(`il film di «${name}» dura ${dur.toFixed(1)} s: dovrebbe durare circa un minuto`);
  // tutto il film, un passo alla volta
  const run = await film((c) => { const st = c.__film; st.stop(); st.reset(); let over = 0, at = 0; for (let k = 0; k < st.dur * 60 + 20; k++) { st.advance(1 / 60); if (st.state.over > over) { over = st.state.over; at = st.t; } } st.render(); return { over, at }; });
  if (run.over > 0.02) fail(`nel film di «${name}» a ${run.at.toFixed(1)} s la mano non arriva all'oggetto (mancano ${(run.over * 100).toFixed(0)} cm)`);
  for (const k of [0.3, 0.65, 1]) { await film((c, q) => c.__film.seek(c.__film.dur * q), k); if (!((await lit()) > 150)) fail(`il film di «${name}» è vuoto a ${Math.round(k * 100)}%`); }
}
// i comandi, sull'ultimo film aperto: il bottone ferma e fa ripartire; a film finito lo fa ricominciare
await film((c) => { c.scrollIntoView({ block: 'center' }); c.__film.play(); });
await p.click('.ta-replay');
if (!(await film((c) => c.__film.paused && !c.__film.playing))) fail('il bottone non ferma il film');
await p.click('.ta-replay');
if (!(await film((c) => c.__film.playing))) fail('il bottone non fa ripartire il film');
await film((c) => c.__film.play(c.__film.dur - 0.3));   // salta quasi alla fine
await p.waitForFunction(() => !document.querySelector('.toolcard canvas.ta-cv').__film.playing, null, { timeout: 4000 }).catch(() => fail('il film non finisce'));
if (!(await p.$eval('.ta-replay', (e) => e.getAttribute('aria-label') === 'Guarda di nuovo'))) fail('a film finito manca il bottone «guarda di nuovo»');
await p.click('.ta-replay');
if (!(await film((c) => c.__film.playing && c.__film.t < 1))) fail('il bottone non fa ricominciare il film');
// chi ha chiesto meno movimento vede subito l'ultimo fotogramma, fermo, e può far partire il film con il bottone
await p.emulateMedia({ reducedMotion: 'reduce' });
await p.goto(BASE + '/#/attrezzi'); await p.reload(); await p.waitForSelector('.tool-item');
await p.click('.tool-item[data-tool="formula"]'); await p.waitForSelector('.toolcard canvas.ta-cv');
await film((c) => c.scrollIntoView({ block: 'center' }));
await p.waitForFunction(() => { const st = document.querySelector('.toolcard canvas.ta-cv').__film; return !st.playing && st.t >= st.dur - 0.1; }, null, { timeout: 4000 }).catch(() => fail('con «meno movimento» il film deve restare fermo sull’ultimo fotogramma'));
if (!((await lit()) > 150)) fail('con «meno movimento» la tela è vuota');
await p.click('.ta-replay');
if (!(await film((c) => c.__film.playing))) fail('con «meno movimento» il bottone non fa partire il film');
await b.close();
if (errs.length) fail('errori nella pagina');
console.log(`ok  cassetta degli attrezzi: scheda all’inizio di f02-1, bottoni sotto la spiegazione di f01-3, la fisica si offre in d01-2, ${ids.length} attrezzi, ${ids.length} film`);
