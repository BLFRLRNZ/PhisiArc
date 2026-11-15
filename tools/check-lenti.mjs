// Controllo delle lenti: ogni lente mantiene quello che promette a chi la sceglie.
//   Esploratore (6-11 anni): domande a scelta entro 20 parole; nei calcoli e nei bersagli solo numeri interi.
//   Curioso (adulti): «le formule solo se le vuoi», cioè nessun simbolo di formula fuori dai riquadri [[…]];
//                     e una voce propria: nessuna domanda con lo stesso testo di quella dello Studente.
//   Cassetta degli attrezzi (Studente e Curioso): nessun livello apre più di due schede di matematica di fila.
// (Che l'Esploratore non veda formule lo controlla già check-prereq.mjs, con l'idea «simboli delle formule».)
// Uso: node tools/check-lenti.mjs        esce con errore se trova problemi
//      node tools/check-lenti.mjs -v     elenca anche le misure domanda per domanda
globalThis.localStorage = { getItem: (k) => (k === 'phisiarc-lingua' ? 'it' : null), setItem() {}, removeItem() {} };
globalThis.window = globalThis.window || {};
globalThis.document = globalThis.document || { createElement: () => ({}) };
const { ZONES, WORLDS } = await import('../js/content/index.js');
const { TOOLS, TOOL_IDS, toolsIn } = await import('../js/tools.js');

export const MAX_PAROLE_E = 20;
const verbose = process.argv.includes('-v');
const problems = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);

// il testo di una lente così com'è scritto (con i riquadri [[…]] ancora da aprire)
const raw = (o, lens) => (o == null ? '' : typeof o === 'string' ? o : o[lens] ?? o.s ?? o.e ?? '');
// senza i riquadri delle formule (scritti [[…]] nei testi, già diventati <details> in quelli costruiti dai generatori) e senza i segni dell'HTML
const strip = (s) => String(s ?? '').replace(/\[\[[\s\S]*?\]\]/g, ' ').replace(/<details class="fbox">[\s\S]*?<\/details>/g, ' ').replace(/<[^>]+>/g, '').trim();
const words = (s) => strip(s).split(/\s+/).filter(Boolean).length;
const levels = WORLDS.flatMap((w) => (w.zones || []).flatMap((z) => ZONES[z].levels));
const stepsOf = (l, lens) => l.steps.map((st, i) => ({ st, i })).filter(({ st }) => !st.only || st.only.includes(lens));

// ---------- Esploratore ----------
let nE = 0, totE = 0;
for (const l of levels) for (const { st, i } of stepsOf(l, 'e')) {
  if (st.kind === 'q') {
    const n = words(raw(st.text, 'e')); nE++; totE += n;
    if (n > MAX_PAROLE_E) bad(`${l.id} passo ${i + 1} [e]`, `la domanda ha ${n} parole (al massimo ${MAX_PAROLE_E}): «${strip(raw(st.text, 'e')).slice(0, 70)}…»`);
  }
  if ((st.kind === 'num' || st.kind === 'tune') && typeof st.gen === 'function') {
    const hits = new Set();
    for (let r = 0; r < 30; r++) {
      let g; try { g = st.gen('e', r % (st.rounds || 2)); } catch { continue; }
      for (const x of (strip(g.text) + ' ' + strip(g.explain || '')).match(/\d+[,.]\d+/g) || []) hits.add(x);
      if (g.ans != null && !Number.isInteger(g.ans)) hits.add(`risposta ${g.ans}`);
    }
    if (hits.size) bad(`${l.id} passo ${i + 1} [e]`, `numeri con la virgola (${[...hits].slice(0, 5).join(', ')}): all’Esploratore solo numeri interi`);
  }
}

// ---------- Curioso ----------
// simboli di formula: radici, π, ½, proporzionale, lettere al quadrato o con il pedice, sin/cos, «lettera = …»
const SIMBOLI = /[√π½∝]|[a-zA-Zθ][²ₓᵧ]|v₀|(sin|cos) ?[(θ0-9²]/;
const haFormule = (s) => { const t = strip(s).replace(/m\/s²/g, 'm/s2').replace(/\bk?m²/g, 'm2'); return SIMBOLI.test(t) || TOOLS.formula.test(t); };
let nC = 0, totC = 0, boxes = 0;
for (const l of levels) {
  const chk = (dove, v) => { const t = raw(v, 'c'); if (!t) return; boxes += (t.match(/\[\[|<details class="fbox">/g) || []).length; if (haFormule(t)) bad(`${l.id} ${dove} [c]`, `formula fuori dal riquadro [[…]]: «${strip(t).slice(0, 80)}…»`); };
  chk('introduzione', l.intro); (l.hints || []).forEach((h, k) => chk(`aiuto ${k + 1}`, h)); chk('soluzione', l.solution);
  for (const { st, i } of stepsOf(l, 'c')) {
    const p = `passo ${i + 1}`;
    chk(p, st.text); (st.options || []).forEach((o) => chk(`${p}, risposte`, o)); chk(`${p}, spiegazione`, st.explain); chk(`${p}, riprova`, st.wrong);
    (st.hints || []).forEach((h) => chk(`${p}, aiuti`, h)); chk(`${p}, soluzione`, st.solution);
    if (typeof st.gen === 'function') { try { const g = st.gen('c', 0); chk(`${p}, calcolo`, g.text); chk(`${p}, svolgimento`, g.explain); } catch { /* lo segnala check-content */ } }
    if (st.kind === 'q') {
      nC++; totC += words(raw(st.text, 'c'));
      if ((!st.only || st.only.includes('s')) && raw(st.text, 'c') === raw(st.text, 's')) bad(`${l.id} ${p} [c]`, `stessa domanda dello Studente: al Curioso serve un testo suo («${strip(raw(st.text, 'c')).slice(0, 60)}…»)`);
    }
  }
}

// ---------- cassetta degli attrezzi: dove si apre ogni scheda, giocando i livelli in ordine ----------
const schede = {};
for (const lens of ['s', 'c']) {
  const seen = new Set(); schede[lens] = [];
  for (const l of levels) {
    const all = new Set();
    const add = (id) => { for (const d of TOOLS[id].needs || []) if (!seen.has(d)) add(d); all.add(id); };
    toolsIn(l, lens).filter((id) => !seen.has(id)).forEach(add);
    const q = TOOL_IDS.filter((id) => all.has(id));
    q.forEach((id) => seen.add(id));
    if (q.length) schede[lens].push(`${l.id}: ${q.join(', ')}`);
    if (q.length > 2) bad(`${l.id} [${lens}]`, `aprirebbe ${q.length} schede di matematica di fila (${q.join(', ')}): al massimo due`);
  }
}

// ---------- quanto si legge, e quanto la risposta giusta si riconosce dalla lunghezza ----------
const misure = (lens) => {
  let n = 0, tot = 0, lunga = 0, corta = 0;
  for (const l of levels) for (const { st } of stepsOf(l, lens)) {
    if (st.kind !== 'q') continue;
    const L = st.options.map((o) => strip(raw(o, lens)).length), a = L[st.answer], solo = L.filter((x) => x === a).length === 1;
    n++; tot += words(raw(st.text, lens));
    if (solo && a === Math.max(...L)) lunga++; else if (solo && a === Math.min(...L)) corta++;
  }
  return `${n} domande, ${(tot / n).toFixed(1)} parole in media; la risposta giusta è la più lunga nel ${Math.round((100 * lunga) / n)}% dei casi, la più corta nel ${Math.round((100 * corta) / n)}%`;
};
console.log(`Esploratore: ${misure('e')}.`);
console.log(`Studente:    ${misure('s')}.`);
console.log(`Curioso:     ${misure('c')}; ${boxes} riquadri «Per chi vuole la formula».`);
console.log(`Schede di matematica che si aprono da sole: Studente ${schede.s.length}, Curioso ${schede.c.length} (le altre si offrono con un bottone).`);
if (verbose) { console.log('  Studente → ' + schede.s.join(' · ')); console.log('  Curioso  → ' + schede.c.join(' · ')); }
if (verbose) for (const l of levels) for (const { st, i } of stepsOf(l, 'e')) if (st.kind === 'q') console.log(`  ${l.id} passo ${i + 1} [e]: ${words(raw(st.text, 'e'))} parole`);

if (problems.length) {
  console.log(`\n${problems.length} problem${problems.length === 1 ? 'a' : 'i'}:`);
  for (const p of problems) console.log('- ' + p);
  process.exit(1);
}
console.log('\nLe lenti mantengono le promesse.');
