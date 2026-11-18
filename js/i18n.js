// Lingua del gioco: italiano (la lingua in cui si scrive) o inglese.
// I testi si scrivono sempre in italiano. Per l'inglese c'è un dizionario (js/i18n/en.js) che ha come chiave
// la frase italiana esatta: se una frase non è tradotta resta in italiano (tools/check-content.mjs le elenca).
// - i dati (livelli, mondi, personaggi...) si traducono tutti insieme all'avvio con translateTree;
// - le frasi scritte nel codice passano da t('frase', { valori }).
const LKEY = 'phisiarc-lingua';
export const LANGS = { it: 'Italiano', en: 'English' };

function pickLang() {
  try {
    const q = typeof location !== 'undefined' && new URLSearchParams(location.search).get('lang');
    if (q && LANGS[q]) return q;
    const saved = typeof localStorage !== 'undefined' && localStorage.getItem(LKEY);
    if (saved && LANGS[saved]) return saved;
    // chi giocava già prima che ci fosse l'inglese resta in italiano
    if (typeof localStorage !== 'undefined' && (localStorage.getItem('phisiarc-v1') || localStorage.getItem('phisiarc-giocatori'))) return 'it';
    const nav = typeof navigator !== 'undefined' && navigator.language;
    if (nav) return nav.toLowerCase().startsWith('it') ? 'it' : 'en';
  } catch { /* niente localStorage */ }
  return 'it';
}

export const LANG = pickLang();
export const LOCALE = LANG === 'en' ? 'en-GB' : 'it-IT';
export const SPEECH = LANG === 'en' ? 'en-GB' : 'it-IT';

// cambia lingua e ricarica (i dati si traducono una volta sola, all'avvio)
export function setLang(l) {
  try { localStorage.setItem(LKEY, l); } catch { /* modalità privata */ }
  if (typeof location !== 'undefined') location.reload();
}

export const EN = LANG === 'en' ? (await import('./i18n/en.js')).default : {};

const fmt = (x, d) => Number(x).toLocaleString(LOCALE, { maximumFractionDigits: d, minimumFractionDigits: 0 });
// {nome} diventa il valore (i numeri con al massimo 2 decimali; {nome:1} al massimo 1)
export const fill = (s, vars) => String(s ?? '').replace(/\{(\w+)(?::(\d))?\}/g, (m, k, d) => (vars && k in vars ? (typeof vars[k] === 'number' ? fmt(vars[k], d != null ? +d : 2) : vars[k]) : m));

// traduce una frase scritta nel codice; i valori si inseriscono dopo la traduzione
export const t = (s, vars) => {
  const r = LANG === 'en' && typeof s === 'string' ? EN[s] ?? s : s;
  return vars ? fill(r, vars) : r;
};

// campi che non sono testi da mostrare: non si traducono mai
const SKIP = new Set(['id', 'kind', 'sim', 'mode', 'measure', 'goal', 'calc', 'derive', 'solve', 'only', 'controls', 'char', 'mascot', 'buddy', 'color', 'c', 'ic', 'svg', 'in', 'shape', 'requires', 'zones', 'params', 'set', 'seq', 'predict', 'vals', 'k', 'type', 'when', 'try', 'who']);
// la lente 'c' (Curioso) è un campo di testo dentro T(...): si salta 'c' solo quando è un colore
const isLensObj = (o) => o && typeof o === 'object' && !Array.isArray(o) && 'e' in o && 's' in o;

// traduce in inglese, sul posto, tutte le frasi di un albero di dati (livelli, mondi, personaggi...)
export function translateTree(o, seen = new Set()) {
  if (LANG !== 'en' || !o || typeof o !== 'object' || seen.has(o)) return o;
  seen.add(o);
  const lens = isLensObj(o);
  for (const k of Object.keys(o)) {
    if (!lens && SKIP.has(k)) continue;
    const v = o[k];
    // le scelte di un selettore sono coppie [valore, etichetta]: il valore è un nome interno (ghiaccio, legno…)
    // e non si traduce mai, anche se la stessa parola ha una traduzione altrove
    if (k === 'options' && Array.isArray(v) && v.length && v.every((x) => Array.isArray(x))) {
      for (const x of v) if (typeof x[1] === 'string' && x[1].length > 1 && EN[x[1]] != null) x[1] = EN[x[1]];
      continue;
    }
    if (typeof v === 'string') { if (v.length > 1 && EN[v] != null) o[k] = EN[v]; } else if (v && typeof v === 'object') translateTree(v, seen);
  }
  return o;
}
