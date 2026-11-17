// Controllo dei prerequisiti, in due passi. Uso: node tools/check-prereq.mjs  (--tutti elenca anche gli anticipi dichiarati)
// 1. Zone: segue il percorso (mondi in ordine, zone scritte e poi quelle in arrivo) e segnala ogni idea
//    che una zona dichiara di usare prima che un'altra l'abbia introdotta (PREREQ).
// 2. Livelli: legge i testi di ogni livello, lente per lente, e cerca le parole di ogni idea (IDEE).
//    Un'idea che compare prima del livello che la spiega è un errore, a meno che sia un anticipo dichiarato (ANTICIPI);
//    un'idea vietata a una lente (mai) è sempre un errore.
globalThis.localStorage = { getItem: (k) => (k === 'phisiarc-lingua' ? 'it' : null), setItem() {}, removeItem() {} };
globalThis.window = globalThis.window || {};
const { WORLDS, ZONES } = await import('../js/content/index.js');
const { PREREQ, IDEE = {}, ANTICIPI = {} } = await import('../js/content/prereq.js');
const { tx } = await import('../js/util.js');

const problems = [];
// ---------- 1. zone ----------
const order = WORLDS.flatMap((w) => [...(w.zones || []), ...(w.soon || []).map((x) => x.split(' ')[0])]);
const known = new Set();
for (const z of order) {
  const p = PREREQ[z];
  if (!p) { problems.push(`${z}: manca nella mappa dei prerequisiti`); continue; }
  for (const u of p.usa) if (!known.has(u)) problems.push(`${z} usa “${u}” prima che sia spiegato`);
  for (const i of p.introduce) known.add(i);
}
for (const z of Object.keys(PREREQ)) if (!order.includes(z)) problems.push(`${z}: è nella mappa ma non nel percorso`);

// ---------- 2. livelli ----------
const LENSES = ['e', 's', 'c'];
const SKIP = new Set(['id', 'kind', 'sim', 'film', 'mode', 'measure', 'goal', 'calc', 'derive', 'solve', 'only', 'controls', 'params', 'set', 'seq', 'predict', 'vals', 'k', 'type', 'labels', 'when', 'try']);
const isLens = (o) => o && typeof o === 'object' && !Array.isArray(o) && 'e' in o && 's' in o;
const plain = (s) => String(s).replace(/<[^>]+>/g, ' ');
function collect(o, lens, out) {
  if (o == null) return;
  if (typeof o === 'string') { out.push(plain(o)); return; }
  if (typeof o !== 'object') return;
  if (isLens(o)) { const t = tx(o, lens); if (t) out.push(plain(t)); return; }
  if (Array.isArray(o)) { for (const v of o) collect(v, lens, out); return; }
  for (const [k, v] of Object.entries(o)) if (!SKIP.has(k) && typeof v !== 'function') collect(v, lens, out);
}
function textsOf(level, lens) {
  const out = [];
  const steps = (level.steps || []).filter((s) => !s.only || s.only.includes(lens));
  collect({ title: level.title, intro: level.intro, hints: level.hints, solution: level.solution, piece: level.piece }, lens, out);
  for (const st of steps) {
    collect(st, lens, out);
    // i passi con numeri sempre nuovi: si leggono alcuni esempi di quello che scrivono
    if (typeof st.gen === 'function') for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { try { collect(st.gen(lens, r), lens, out); } catch { /* lo segnala check-content */ } }
  }
  return out;
}
const levels = WORLDS.flatMap((w) => (w.zones || []).flatMap((z) => ZONES[z].levels));
const pos = new Map(levels.map((l, i) => [l.id, i]));
const used = new Set(); // anticipi dichiarati che servono davvero
const declared = [];
for (const [name, idea] of Object.entries(IDEE)) {
  const re = new RegExp(idea.parole, 'i');
  const das = typeof idea.da === 'string' ? [idea.da] : Object.values(idea.da || {});
  for (const d of das) if (/^[fm]\d\d-/.test(d) && !pos.has(d)) problems.push(`IDEE “${name}”: il livello ${d} non esiste`);
  for (const lens of LENSES) {
    const da = typeof idea.da === 'string' ? idea.da : (idea.da || {})[lens] ?? (idea.da || {}).s;
    const at = pos.has(da) ? pos.get(da) : Infinity;
    levels.forEach((l, i) => {
      const hit = textsOf(l, lens).find((t) => re.test(t));
      if (!hit) return;
      const m = hit.match(re), cut = hit.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).trim();
      if ((idea.mai || []).includes(lens)) { problems.push(`${l.id} [${lens}]: “${name}” non è per questa lente → «…${cut}…»`); return; }
      if (i >= at) return;
      if ((ANTICIPI[l.id] || []).includes(name)) { used.add(`${l.id}|${name}`); declared.push(`${l.id} [${lens}]: “${name}” (si spiega in ${da}) → «…${cut}…»`); return; }
      problems.push(`${l.id} [${lens}]: usa “${name}” prima di ${da}, che la spiega → «…${cut}…»`);
    });
  }
}
for (const [id, names] of Object.entries(ANTICIPI)) {
  if (!pos.has(id)) problems.push(`ANTICIPI: il livello ${id} non esiste`);
  for (const n of names) {
    if (!IDEE[n]) problems.push(`ANTICIPI ${id}: l'idea “${n}” non è in IDEE`);
    else if (!used.has(`${id}|${n}`)) problems.push(`ANTICIPI ${id}: “${n}” non serve più (il livello non la nomina, o ormai è spiegata): toglila`);
  }
}

console.log(`Percorso: ${order.join(' → ')}`);
console.log(`Idee cercate nei testi: ${Object.keys(IDEE).length}, in ${levels.length} livelli e tre lenti. Anticipi dichiarati: ${used.size}.`);
if (process.argv.includes('--tutti') && declared.length) console.log('\nAnticipi dichiarati:\n- ' + declared.join('\n- '));
if (problems.length) { console.log(`\n${problems.length} problemi:\n- ` + problems.join('\n- ')); process.exit(1); }
console.log('\nNessuna idea usata prima di essere spiegata.');
