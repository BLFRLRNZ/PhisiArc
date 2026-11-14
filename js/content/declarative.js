// Passi "a testo": domande di calcolo (num) e prove da regolare (tune) scritte solo con testi, valori e formule brevi,
// senza funzioni. Chi scrive i contenuti cambia le frasi e i numeri; il motore costruisce da solo gen, check e solve.
//
// Domanda di calcolo:
//   { kind: 'num', rounds: 2,
//     vals: { a: [2, 3, 4], t: [3, 4, 5] },        // valori tra cui scegliere a caso (anche per lente: { e: {...}, s: {...} })
//     derive: { v: 'a * t' },                       // (facoltativo) altri valori calcolati da quelli scelti
//     calc: 'a * t',                                // la risposta (anche per lente: { e: '...', s: '...' })
//     text: T('Calcola la velocità.'),              // la consegna, come negli altri passi
//     ask: T('Ogni secondo va {a} m/s più veloce. Dopo {t} secondi?', 'Accelerazione {a} m/s². Velocità dopo {t} s?'),
//     explain: T('Giusto: {t} volte {a} fa {ans}.', 'Esatto: v = a·t = {ans} m/s.'),
//     unit: 'm/s', tol: { e: 0, s: 0.01 } }        // tolleranza: numero, o per lente
//
// Prova da regolare:
//   { kind: 'tune', rounds: 2,
//     vals: { v: [[10, 15, 20], [12, 18]] },        // un elenco per ogni prova (o uno solo per tutte)
//     text: T('Scegli l’accelerazione e lancia.'),  // la consegna
//     ask: T('Il treno deve andare a <b>{v} m/s</b>.'),
//     measure: 'vEnd[0]', goal: 'v',                // cosa si misura nel risultato, e quanto deve valere
//     tol: { e: 1, s: 0.6 },
//     ok: T('{got} m/s: perfetto!'), high: T('{got} m/s: troppo.'), low: T('{got} m/s: troppo poco.'),
//     solve: { a1: 'v * v / 100' } }                // i valori dei controlli che risolvono (servono al test automatico)
//
// Nei testi, {nome} si sostituisce con il valore (con la virgola, fino a 2 decimali; {nome:1} fino a 1),
// {ans} con la risposta e {got} con la misura.
import { tx, pick, num } from '../util.js';

const LENS_KEYS = ['e', 's', 'c'];
const byLens = (v, lens) => (v && typeof v === 'object' && !Array.isArray(v) && LENS_KEYS.some((k) => k in v) ? v[lens] ?? v.s ?? v.e : v);
const formula = (src, names) => new Function(...names, `return (${src});`);

// sostituisce {nome} con il numero formattato all'italiana (fino a 2 decimali)
// ({nome:1} = al massimo un decimale)
export const fill = (s, vars) => String(s ?? '').replace(/\{(\w+)(?::(\d))?\}/g, (m, k, d) => (k in vars ? (typeof vars[k] === 'number' ? num(vars[k], d != null ? +d : 2) : vars[k]) : m));

// sceglie i valori a caso, poi calcola quelli derivati (derive: { v: 'a * t' }), nell'ordine in cui sono scritti
function choose(st, lens, r) {
  const v = Object.fromEntries(Object.entries(byLens(st.vals, lens) || {}).map(([k, list]) => {
    const l = Array.isArray(list[0]) ? list[Math.min(r, list.length - 1)] : list;
    return [k, Array.isArray(l) ? pick(l) : l];
  }));
  for (const [k, src] of Object.entries(st.derive || {})) { const names = Object.keys(v); v[k] = formula(src, names)(...names.map((n) => v[n])); }
  return v;
}

function compileNum(st) {
  return {
    ...st,
    gen: (lens, r) => {
      const v = choose(st, lens, r), names = Object.keys(v);
      const raw = formula(byLens(st.calc, lens), names)(...names.map((k) => v[k]));
      const ans = st.round != null ? Math.round(raw * 10 ** st.round) / 10 ** st.round : raw;
      const all = { ...v, ans };
      const tol = byLens(st.tol, lens);
      return { text: fill(tx(st.ask, lens), all), ans, tol: tol ?? Math.abs(ans) * 0.02, unit: tx(st.unit, lens) || '', explain: st.explain ? fill(tx(st.explain, lens), all) : '' };
    },
  };
}

function compileTune(st) {
  const measure = new Function('r', `return r.${st.measure};`);
  return {
    ...st,
    gen: (lens, r) => {
      const v = choose(st, lens, r), names = Object.keys(v);
      const goal = formula(st.goal, names)(...names.map((k) => v[k]));
      return { ...v, goal, vars: v, text: fill(tx(st.ask, lens), v) };
    },
    check: (res, tg, lens) => {
      const got = measure(res), tol = byLens(st.tol, lens) ?? 0;
      const all = { ...tg.vars, got: got ?? NaN };
      if (got != null && Math.abs(got - tg.goal) <= tol) return { ok: true, msg: fill(tx(st.ok, lens), all) };
      return { ok: false, msg: fill(tx(got == null || got < tg.goal ? st.low : st.high, lens), all) };
    },
    solve: (tg) => {
      const names = Object.keys(tg.vars);
      return Object.fromEntries(Object.entries(st.solve || {}).map(([k, src]) => [k, formula(src, names)(...names.map((n) => tg.vars[n]))]));
    },
  };
}

// trasforma i passi "a testo" di una zona nei passi che il motore sa giocare
export function compileZone(z) {
  for (const l of z.levels) {
    l.steps = l.steps.map((st) => {
      if (st.kind === 'num' && st.calc && !st.gen) return compileNum(st);
      if (st.kind === 'tune' && st.measure && !st.gen) return compileTune(st);
      return st;
    });
  }
  return z;
}
