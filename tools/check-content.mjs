// Controllo dei contenuti: per ogni livello e per ogni lente verifica che risposte, testi, aiuti e soluzioni ci siano
// e abbiano senso, che i generatori di numeri diano risultati validi, che simulazioni e controlli esistano,
// che ogni pezzo del parco abbia il suo disegno e che l'app offline contenga tutti i file.
// Uso: node tools/check-content.mjs   (esce con errore se trova problemi)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.window = globalThis.window || {};
const root = new URL('..', import.meta.url).pathname;
const { ZONES, WORLDS, KIND } = await import('../js/content/index.js');
const { SIMS } = await import('../js/sims/index.js');
const { PIECE_SVG } = await import('../js/pieces.js');
const { PREREQ } = await import('../js/content/prereq.js');
const { tx } = await import('../js/util.js');

const LENSES = ['e', 's', 'c'];
const STEP_KINDS = ['q', 'free', 'run', 'tune', 'num', 'order', 'vars'];
const problems = [];
const warn = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);
const text = (v, lens) => { try { const t = tx(v, lens); return typeof t === 'string' ? t.trim() : ''; } catch { return ''; } };

const ids = new Set();
let nLevels = 0, nSteps = 0;
for (const w of WORLDS) for (const zid of w.zones || []) if (!ZONES[zid]) bad(w.id, `la zona ${zid} non esiste`);
for (const [zid, z] of Object.entries(ZONES)) {
  if (!PREREQ[zid]) bad(zid, 'manca nella mappa dei prerequisiti');
  if (!WORLDS.some((w) => (w.zones || []).includes(zid))) bad(zid, 'non è in nessun mondo');
  for (const l of z.levels) {
    nLevels++;
    const at = `${l.id}`;
    if (ids.has(l.id)) bad(at, 'id ripetuto'); ids.add(l.id);
    if (!KIND[l.kind]) bad(at, `tipo di livello sconosciuto “${l.kind}”`);
    if (!l.title) bad(at, 'manca il titolo');
    const Sim = l.sim ? SIMS[l.sim] : null;
    if (l.sim && !Sim) bad(at, `la simulazione “${l.sim}” non esiste`);
    const ctrlKeys = Sim ? Object.keys(Sim.controls) : [];
    for (const k of l.controls || []) if (!ctrlKeys.includes(k)) bad(at, `il controllo “${k}” non esiste in ${l.sim}`);
    for (const k of Object.keys(l.labels || {})) if (!ctrlKeys.includes(k)) bad(at, `labels: il controllo “${k}” non esiste`);
    if (Sim && l.params) {
      const def = Sim.prototype.defaults.call({});
      for (const k of Object.keys(l.params)) if (!(k in def)) warn.push(`${at}: il parametro “${k}” non è tra quelli predefiniti di ${l.sim}`);
    }
    if (l.piece && !PIECE_SVG[l.piece.id]) bad(at, `il pezzo “${l.piece.id}” non ha un disegno in pieces.js`);
    if (l.kind === 'costruisci' && !l.piece) bad(at, 'un Costruisci deve dare un pezzo del parco');
    for (const lens of LENSES) {
      const where = `${at} [${lens}]`;
      if (!text(l.intro, lens)) bad(where, 'manca l’introduzione');
      const steps = l.steps.filter((s) => !s.only || s.only.includes(lens));
      if (!steps.length) bad(where, 'nessun passo per questa lente');
      const hasHints = (l.hints || []).some((hh) => text(hh, lens)) || steps.some((s) => s.hints || s.wrong || s.kind === 'q' || s.kind === 'vars');
      if (!hasHints && l.kind !== 'ripasso') bad(where, 'nessun aiuto');
      const needsSol = steps.some((s) => s.kind === 'tune' || s.kind === 'free') && l.kind !== 'ripasso';
      if (needsSol && !text(l.solution, lens) && !steps.some((s) => s.solution)) bad(where, 'manca la soluzione');
      steps.forEach((st, i) => {
        nSteps++;
        const sw = `${where} passo ${i + 1}`;
        if (!STEP_KINDS.includes(st.kind)) return bad(sw, `tipo di passo sconosciuto “${st.kind}”`);
        if (st.kind !== 'num' && st.kind !== 'tune' && !text(st.text, lens)) bad(sw, 'manca il testo');
        if ((st.kind === 'free' || st.kind === 'run' || st.kind === 'tune' || st.predict) && !Sim) bad(sw, 'serve una simulazione');
        if (st.kind === 'q') {
          const n = (st.options || []).length;
          if (n < 2 || n > 4) bad(sw, `servono da 2 a 4 risposte, ce ne sono ${n}`);
          if (!Number.isInteger(st.answer) || st.answer < 0 || st.answer >= n) bad(sw, `risposta giusta fuori dall’elenco (${st.answer})`);
          (st.options || []).forEach((o, j) => { if (!text(o, lens)) bad(sw, `la risposta ${j + 1} è vuota`); });
          const os = (st.options || []).map((o) => text(o, lens));
          if (new Set(os).size !== os.length) bad(sw, 'due risposte uguali');
          if (!text(st.explain, lens)) bad(sw, 'manca la spiegazione');
          if (st.predict && (!Array.isArray(st.predict) || !st.predict.length)) bad(sw, 'predict deve essere un elenco di esperimenti');
        }
        if (st.kind === 'num' || st.kind === 'tune') {
          if (typeof st.gen !== 'function') bad(sw, 'manca il generatore gen');
          else for (let r = 0; r < 3; r++) for (let k = 0; k < 15; k++) {
            let g;
            try { g = st.gen(lens, r); } catch (e) { bad(sw, `gen va in errore: ${e.message}`); break; }
            if (!g || !text(g.text, lens)) { bad(sw, 'gen non dà il testo della domanda'); break; }
            if (st.kind === 'num') {
              if (!Number.isFinite(g.ans)) { bad(sw, `gen dà una risposta non numerica (${g.ans})`); break; }
              if (g.tol != null && !(g.tol >= 0)) { bad(sw, 'tolleranza non valida'); break; }
              if (!g.explain) warn.push(`${sw}: la domanda generata non ha spiegazione`);
            }
          }
          if (st.kind === 'tune' && typeof st.check !== 'function') bad(sw, 'manca la funzione check');
          if (st.kind === 'tune' && typeof st.solve !== 'function') bad(sw, 'manca solve (i valori che risolvono la prova, per il test automatico)');
        }
        if (st.kind === 'vars') {
          if (!Array.isArray(st.vars) || st.vars.length < 2) bad(sw, 'servono almeno due variabili');
          else if (!st.vars.some((v) => v.k === st.change)) bad(sw, `la variabile da cambiare “${st.change}” non è nell’elenco`);
        }
        if (st.kind === 'order' && (!Array.isArray(st.items) || st.items.length < 3)) bad(sw, 'servono almeno tre elementi da ordinare');
        if (st.kind === 'run' && !(Array.isArray(st.seq) && st.seq.length)) bad(sw, 'manca la sequenza di esperimenti');
      });
    }
  }
}

// l'app offline deve contenere tutti i file del gioco
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const f of [...walk(join(root, 'js')), ...walk(join(root, 'fonts'))]) {
  const rel = './' + relative(root, f);
  if (rel.endsWith('prereq.js')) continue; // serve solo agli strumenti
  if (!sw.includes(`'${rel}'`)) bad('sw.js', `manca ${rel} nell’elenco dei file offline`);
}

console.log(`${Object.keys(ZONES).length} zone, ${nLevels} livelli, ${nSteps} passi controllati nelle tre lenti.`);
if (warn.length) console.log(`\nAvvisi (${warn.length}):\n- ` + [...new Set(warn)].slice(0, 30).join('\n- '));
if (problems.length) { console.log(`\n${problems.length} problemi:\n- ` + [...new Set(problems)].join('\n- ')); process.exit(1); }
console.log('\nContenuti in ordine.');
