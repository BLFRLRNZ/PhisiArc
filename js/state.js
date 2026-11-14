// I progressi restano sul dispositivo (localStorage), come in Arcode.

const KEY = 'phisiarc-v1';

const fresh = () => ({
  lens: null,          // 'e' Esploratore, 's' Studente, 'c' Curioso
  name: '',
  done: {},            // id livello -> stelle migliori (1-3)
  joule: 0,
  park: [],            // pezzi del parco costruiti
  seen: {},            // scene d'apertura già viste
  aperti: {},          // mondi e zone già sbloccati: restano aperti anche se si aggiungono zone
  introSeen: false,    // l'animazione d'apertura parte da sola solo la prima volta
  settings: { sound: true, voice: false, intro: false },
});

function load() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY));
    if (!o) return fresh();
    const f = fresh();
    const st = { ...f, ...o, settings: { ...f.settings, ...(o.settings || {}) }, aperti: o.aperti || {} };
    // Chi giocava prima di questa versione ha già visto l'animazione: d'ora in poi parte solo se la si chiede.
    if (o.introSeen === undefined) { st.introSeen = true; st.settings.intro = false; }
    return st;
  } catch {
    return fresh();
  }
}

export const S = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* modalità privata */ }
}

export function recomputeJoule() {
  S.joule = Object.values(S.done).reduce((a, b) => a + b * 10, 0);
}

export function exportCode() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(S))));
}

// Il ripristino unisce i progressi invece di sovrascriverli.
export function importCode(code) {
  const o = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  for (const [k, v] of Object.entries(o.done || {})) S.done[k] = Math.max(S.done[k] || 0, v);
  S.park = [...new Set([...S.park, ...(o.park || [])])];
  Object.assign(S.seen, o.seen || {});
  Object.assign(S.aperti, o.aperti || {});
  if (!S.lens && o.lens) S.lens = o.lens;
  recomputeJoule();
  save();
}

export function resetAll() {
  const f = fresh();
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, f);
  save();
}
