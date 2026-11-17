// I film delle lezioni (Officina), con un giocatore che arriva dalla Pista e non li ha mai visti.
// 1) La prima volta il film sta in cima alla lezione, parte da solo e la domanda aspetta «Comincia»;
//    dopo, nel fumetto della mascotte resta il bottone «Rivedi il film», anche quando si torna nel livello.
// 2) Ogni film dura circa un minuto, disegna dall'inizio alla fine, e la mano dell'omino arriva sempre a quello che tocca.
//    All'Esploratore niente lettere: lo stesso film, ma senza la formula sullo schermo.
// Uso: node tests/films.mjs [indirizzo]
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
const LESSONS = await p.evaluate(async () => {
  const m = await import('./js/content/index.js');
  const lessons = Object.values(m.ZONES).flatMap((z) => z.levels.filter((l) => l.film).map((l) => ({ id: l.id, film: l.film })));
  // finiti il Laboratorio e la Pista: l'Officina è aperta, le sue lezioni no
  const done = Object.fromEntries(Object.values(m.ZONES).flatMap((z) => z.levels.filter((l) => !l.id.startsWith('d')).map((l) => [l.id, 3])));
  localStorage.setItem('phisiarc-lingua', 'it');
  localStorage.setItem('phisiarc-v1', JSON.stringify({ v: 3, lens: 'e', done, joule: 0, park: [], seen: { laboratorio: true, pista: true, officina: true }, introSeen: true, tools: { potenze: 2, formula: 2, quadrato: 2, radice: 2, pitagora: 2, pi: 2, seno: 2 }, settings: { sound: false, voice: false, voiceChosen: true, intro: false, introChosen: true } }));
  return lessons;
});
if (LESSONS.length < 3) fail(`attese almeno 3 lezioni con il film, trovate ${LESSONS.length}`);

// 1) la prima lezione dell'Officina, per la prima volta
await p.goto(BASE + '/#/livello/' + LESSONS[0].id); await p.reload();
await p.waitForSelector('.filmcard canvas.ta-cv', { timeout: 5000 }).catch(() => fail('la lezione non comincia con il film'));
if (!(await p.$eval('.quest', (e) => e.hidden))) fail('la domanda dovrebbe aspettare il film');
await p.$eval('.filmcard canvas.ta-cv', (c) => c.scrollIntoView({ block: 'center' }));
await p.waitForFunction(() => document.querySelector('.filmcard canvas.ta-cv').__film.playing, null, { timeout: 3000 }).catch(() => fail('il film della lezione non parte da solo'));
await p.click('.filmcard .row .btn.primary');
if (await p.$eval('.quest', (e) => e.hidden)) fail('dopo «Comincia» la domanda non compare');
if (!(await p.$eval('.filmcard', (e) => e.hidden))) fail('dopo «Comincia» il film dovrebbe richiudersi');
if (await p.$('.filmcard canvas')) fail('il film richiuso dovrebbe fermarsi e sparire');
if (await p.$eval('.bubble .film-chip', (e) => e.hidden)) fail('nel fumetto manca il bottone «Rivedi il film»');
const films = await p.evaluate(() => JSON.parse(localStorage.getItem('phisiarc-v1')).films || {});
if (!films[LESSONS[0].film]) fail('il film visto non risulta salvato');
// la seconda volta: niente attesa, solo il bottone; il bottone riapre il film e lo si richiude
await p.goto(BASE + '/#/livello/' + LESSONS[0].id); await p.reload(); await p.waitForSelector('.lvl-head');
if (!(await p.$eval('.filmcard', (e) => e.hidden))) fail('la seconda volta il film non deve ripartire da solo');
if (await p.$eval('.quest', (e) => e.hidden)) fail('la seconda volta la domanda non deve aspettare');
await p.click('.bubble .film-chip');
await p.waitForSelector('.filmcard canvas.ta-cv', { timeout: 3000 }).catch(() => fail('«Rivedi il film» non apre il film'));
await p.click('.filmcard .row .btn.primary');
if (!(await p.$eval('.filmcard', (e) => e.hidden))) fail('«Chiudi il film» non lo chiude');

// 2) ogni film delle lezioni, in due lenti
const lit = () => p.$eval('.filmcard canvas.ta-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] + d[i + 1] + d[i + 2] > 300) n++; return n; });
for (const lens of ['e', 's']) {
  // tutte le lezioni aperte (e già giocate): il film si apre dal bottone nel fumetto
  await p.evaluate(({ l, ids }) => { const o = JSON.parse(localStorage.getItem('phisiarc-v1')); o.lens = l; for (const id of ids) o.done[id] = 1; localStorage.setItem('phisiarc-v1', JSON.stringify(o)); }, { l: lens, ids: LESSONS.map((x) => x.id) });
  for (const { id, film } of LESSONS) {
    await p.goto(BASE + '/#/livello/' + id); await p.reload(); await p.waitForSelector('.lvl-head');
    await p.click('.bubble .film-chip').catch(() => fail(`${id}: manca il bottone del film`));
    await p.waitForSelector('.filmcard canvas.ta-cv', { timeout: 5000 }).catch(() => fail(`${id}: manca il film`));
    const dur = await p.$eval('.filmcard canvas.ta-cv', (c) => c.__film.dur);
    if (!(dur >= 40 && dur <= 70)) fail(`il film «${film}» dura ${dur.toFixed(1)} s: dovrebbe durare circa un minuto`);
    const run = await p.$eval('.filmcard canvas.ta-cv', (c) => { const st = c.__film; st.stop(); st.reset(); let over = 0, at = 0; for (let k = 0; k < st.dur * 60 + 20; k++) { st.advance(1 / 60); if (st.state.over > over) { over = st.state.over; at = st.t; } } st.render(); return { over, at }; });
    if (run.over > 0.08) fail(`nel film «${film}» a ${run.at.toFixed(1)} s la mano non arriva all'oggetto (mancano ${(run.over * 100).toFixed(0)} cm)`);
    for (const k of [0.3, 0.65, 1]) { await p.$eval('.filmcard canvas.ta-cv', (c, q) => c.__film.seek(c.__film.dur * q), k); if (!((await lit()) > 150)) fail(`il film «${film}» è vuoto a ${Math.round(k * 100)}% [${lens}]`); }
    await p.click('.filmcard .row .btn.primary');
  }
}
await b.close();
if (errs.length) fail('errori nella pagina');
console.log(`ok  film delle lezioni: ${LESSONS.map((l) => l.film).join(', ')}; la prima volta la domanda aspetta, poi resta il bottone per rivederlo`);
