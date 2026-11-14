// Ripasso a distanza di giorni (metodo delle scatole di Leitner).
// Le domande dei livelli finiti tornano dopo 1 giorno; ogni risposta giusta al primo colpo le sposta
// nella scatola dopo, che torna più tardi (3, 7, 14, 30 giorni). Un errore le rimette nella prima scatola.
// Nel salvataggio: S.rev = { 'm03-3#0': { b: scatola 1-5, d: giorno in cui torna } }.
import { T } from './util.js';
import { S, save } from './state.js';
import { ZONES, levelById } from './content/index.js';

export const INTERVALS = [1, 3, 7, 14, 30]; // giorni di attesa per le scatole 1..5
export const REVIEW_MAX = 6;               // domande per ogni ripasso
export const REVIEW_ID = 'ripasso-giorno';

// il giorno di oggi (ora locale), contato in giorni interi
export const today = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 864e5);

// le domande che si possono ripassare fuori dal livello: a scelta senza esperimento, e di calcolo
const reviewable = (st) => (st.kind === 'q' && !st.predict) || st.kind === 'num';
const lensOk = (st) => !st.only || st.only.includes(S.lens || 's');
const parse = (key) => { const i = key.lastIndexOf('#'); return [key.slice(0, i), +key.slice(i + 1)]; };

function stepOf(key) {
  const [id, i] = parse(key);
  const l = levelById(id);
  return l && l.steps[i] && reviewable(l.steps[i]) ? { level: l, st: l.steps[i] } : null;
}

// mette in ripasso le domande di un livello (first = giorno della prima volta)
export function enroll(levelId, first = today() + INTERVALS[0]) {
  const l = levelById(levelId);
  if (!l) return;
  S.rev = S.rev || {};
  l.steps.forEach((st, i) => {
    const key = `${levelId}#${i}`;
    if (reviewable(st) && !S.rev[key]) S.rev[key] = { b: 1, d: first };
  });
}

// i livelli già finiti (salvataggi di prima, o ripristinati con un codice) entrano nel ripasso un po' alla volta
export function enrollDone() {
  S.rev = S.rev || {};
  const known = new Set(Object.keys(S.rev).map((k) => parse(k)[0]));
  const ids = Object.values(ZONES).flatMap((z) => z.levels.map((l) => l.id)).filter((id) => S.done[id] && !known.has(id));
  if (!ids.length) return;
  ids.forEach((id, n) => enroll(id, today() + (n % 7)));
  save();
}

// le domande da ripassare oggi, prima le più in ritardo e quelle nelle scatole basse
export function dueKeys() {
  const t = today();
  return Object.entries(S.rev || {})
    .filter(([k, r]) => r.d <= t && (() => { const s = stepOf(k); return s && lensOk(s.st); })())
    .sort((a, b) => a[1].d - b[1].d || a[1].b - b[1].b)
    .map(([k]) => k);
}

// fra quanti giorni torna la prossima domanda (null se non ce ne sono)
export function nextDueIn() {
  const ds = Object.entries(S.rev || {}).filter(([k]) => { const s = stepOf(k); return s && lensOk(s.st); }).map(([, r]) => r.d);
  return ds.length ? Math.max(0, Math.min(...ds) - today()) : null;
}

// risposta giusta al primo colpo: scatola dopo; altrimenti di nuovo nella prima
export function grade(key, ok) {
  const r = S.rev && S.rev[key];
  if (!r) return;
  r.b = ok ? Math.min(r.b + 1, INTERVALS.length) : 1;
  r.d = today() + INTERVALS[r.b - 1];
  save();
}

// il "livello" del ripasso di oggi, giocato dal motore come gli altri
export function reviewLevel() {
  const keys = dueKeys().slice(0, REVIEW_MAX);
  if (!keys.length) return null;
  const first = stepOf(keys[0]).level;
  const zoneRef = Object.values(ZONES).find((z) => z.levels.includes(first));
  return {
    id: REVIEW_ID, review: true, kind: 'ripasso', title: 'Ripasso del giorno', zoneRef,
    intro: T(
      'Ti ricordi? Ecco qualche domanda dei livelli che hai già finito. Quelle che sai tornano più avanti, le altre tornano presto.',
      'Ripasso del giorno: domande dei livelli già fatti. Se rispondi giusto al primo colpo, la domanda torna fra più giorni; se sbagli, torna domani.'),
    steps: keys.map((k) => { const { st } = stepOf(k); return { ...st, rk: k, ...(st.kind === 'num' ? { rounds: 1 } : {}) }; }),
    hints: [T('Se non ricordi, usa pure l’aiuto: la domanda tornerà domani.')],
  };
}
