// I progressi restano sul dispositivo (localStorage), come in Arcode.
// Più giocatori sullo stesso dispositivo: ognuno ha il suo salvataggio. Il primo usa la chiave storica.

const KEY = 'phisiarc-v1';
const PKEY = 'phisiarc-giocatori';
const keyOf = (id) => (id === 'p1' ? KEY : `${KEY}:${id}`);

function loadPlayers() {
  try {
    const o = JSON.parse(localStorage.getItem(PKEY));
    if (o && Array.isArray(o.list) && o.list.length && o.list.some((p) => p.id === o.active)) return o;
  } catch { /* niente */ }
  return { active: 'p1', list: [{ id: 'p1', name: 'Giocatore 1' }] };
}
export const PLAYERS = loadPlayers();
const savePlayers = () => { try { localStorage.setItem(PKEY, JSON.stringify(PLAYERS)); } catch { /* modalità privata */ } };

const fresh = () => ({
  v: VERSION,          // versione del salvataggio (vedi più sotto)
  lens: null,          // 'e' Esploratore, 's' Studente, 'c' Curioso
  name: '',
  done: {},            // id livello -> stelle migliori (1-3)
  joule: 0,
  park: [],            // pezzi del parco costruiti
  seen: {},            // scene d'apertura già viste
  aperti: {},          // mondi e zone già sbloccati: restano aperti anche se si aggiungono zone
  skip: {},            // mondi superati con la prova d'ingresso
  introSeen: false,    // l'animazione d'apertura parte da sola solo la prima volta
  settings: { sound: true, voice: null, intro: false }, // voice null = automatica: accesa per l'Esploratore
});

// ---------- versioni del salvataggio ----------
// Ogni salvataggio porta il numero di versione (v). Quando cambia la forma dei dati, o si rinomina una zona
// o un livello, si alza VERSION e si aggiunge qui il passo che porta i vecchi salvataggi alla forma nuova.
export const VERSION = 2;
// Livelli o zone rinominati: 'vecchio-id': 'nuovo-id'. Le stelle e gli sblocchi seguono il nuovo nome.
export const RENAMED = {};
const MIGRATIONS = {
  // 1 → 2: animazione d'apertura solo a richiesta per chi aveva già giocato; voce automatica se nessuno l'ha scelta.
  1: (o) => {
    if (o.introSeen === undefined) { o.introSeen = true; o.settings = { ...(o.settings || {}), intro: false }; }
    if (o.settings && !o.settings.voiceChosen) o.settings.voice = null;
    return o;
  },
};
const rename = (obj, pre = '') => Object.fromEntries(Object.entries(obj || {}).map(([k, v]) => {
  const id = k.slice(pre.length);
  return [k.startsWith(pre) && RENAMED[id] ? pre + RENAMED[id] : k, v];
}));
// porta un salvataggio (anche quello di un codice di ripristino) all'ultima versione
export function migrate(o) {
  let v = Number(o.v) || 1;
  while (v < VERSION) { if (MIGRATIONS[v]) o = MIGRATIONS[v](o); v++; }
  o.v = VERSION;
  if (Object.keys(RENAMED).length) {
    o.done = rename(o.done);
    o.aperti = rename(rename(o.aperti, 'z:'), 'w:');
  }
  return o;
}

function load(key = keyOf(PLAYERS.active)) {
  try {
    let o = JSON.parse(localStorage.getItem(key));
    if (!o) return fresh();
    o = migrate(o);
    const f = fresh();
    return { ...f, ...o, settings: { ...f.settings, ...(o.settings || {}) }, aperti: o.aperti || {}, skip: o.skip || {} };
  } catch {
    return fresh();
  }
}

export const S = load();

export function save() {
  try { localStorage.setItem(keyOf(PLAYERS.active), JSON.stringify(S)); } catch { /* modalità privata */ }
}

const replaceS = (n) => { for (const k of Object.keys(S)) delete S[k]; Object.assign(S, n); };
const cleanName = (n) => String(n || '').replace(/[<>]/g, '').trim().slice(0, 20);

export function switchPlayer(id) {
  if (id === PLAYERS.active || !PLAYERS.list.some((p) => p.id === id)) return;
  save();
  PLAYERS.active = id; savePlayers();
  replaceS(load());
}

export function addPlayer(name) {
  const id = 'p' + Date.now().toString(36);
  PLAYERS.list.push({ id, name: cleanName(name) || `Giocatore ${PLAYERS.list.length + 1}` });
  savePlayers();
  switchPlayer(id);
}

export function renamePlayer(id, name) {
  const p = PLAYERS.list.find((x) => x.id === id), n = cleanName(name);
  if (p && n) { p.name = n; savePlayers(); }
}

export function removePlayer(id) {
  if (PLAYERS.list.length < 2) return;
  try { localStorage.removeItem(keyOf(id)); } catch { /* niente */ }
  PLAYERS.list = PLAYERS.list.filter((p) => p.id !== id);
  if (PLAYERS.active === id) { PLAYERS.active = PLAYERS.list[0].id; replaceS(load()); }
  savePlayers();
}

export const playerName = () => (PLAYERS.list.find((p) => p.id === PLAYERS.active) || {}).name || '';

export function recomputeJoule() {
  S.joule = Object.values(S.done).reduce((a, b) => a + b * 10, 0);
}

export function exportCode() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(S))));
}

// Il ripristino unisce i progressi invece di sovrascriverli. Il codice si controlla prima di usarlo:
// si tengono solo livelli, pezzi, mondi e zone che esistono davvero, con valori sensati.
// known = { levels, pieces, worlds, zones } (insiemi di id), dato dall'app.
export function importCode(code, known) {
  const txt = typeof code === 'string' ? code.trim() : '';
  if (!txt) throw new Error('Incolla prima un codice.');
  if (txt.length > 60000 || !/^[A-Za-z0-9+/=\s]+$/.test(txt)) throw new Error('Questo non sembra un codice di PhisiArc.');
  let o;
  try { o = JSON.parse(decodeURIComponent(escape(atob(txt.replace(/\s+/g, ''))))); } catch { throw new Error('Il codice è incompleto o rovinato: copialo di nuovo per intero.'); }
  if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('Questo non sembra un codice di PhisiArc.');
  o = migrate(o);
  const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  const has = (set, k) => !set || set.has(k);
  const done = {};
  for (const [k, v] of Object.entries(obj(o.done))) {
    const n = Math.round(Number(v));
    if (has(known && known.levels, k) && n >= 1 && n <= 3) done[k] = n;
  }
  const park = Array.isArray(o.park) ? o.park.filter((p) => typeof p === 'string' && has(known && known.pieces, p)) : [];
  const flags = (x, ok) => Object.fromEntries(Object.entries(obj(x)).filter(([k, v]) => v && ok(k)).map(([k]) => [k, 1]));
  const isWorld = (k) => has(known && known.worlds, k);
  const seen = flags(o.seen, isWorld), skip = flags(o.skip, isWorld);
  const aperti = flags(o.aperti, (k) => (k.startsWith('w:') ? isWorld(k.slice(2)) : k.startsWith('z:') ? has(known && known.zones, k.slice(2)) : false));
  if (!Object.keys(done).length && !park.length && !Object.keys(skip).length) throw new Error('Nel codice non ci sono progressi da ripristinare.');
  for (const [k, v] of Object.entries(done)) S.done[k] = Math.max(S.done[k] || 0, v);
  S.park = [...new Set([...S.park, ...park])];
  Object.assign(S.seen, seen);
  Object.assign(S.aperti, aperti);
  S.skip = { ...(S.skip || {}), ...skip };
  if (!S.lens && ['e', 's', 'c'].includes(o.lens)) S.lens = o.lens;
  recomputeJoule();
  save();
  return { levels: Object.keys(done).length, pieces: park.length };
}

export function resetAll() {
  const f = fresh();
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, f);
  save();
}

// La voce legge domande e risposte: accesa da sola per l'Esploratore (chi ancora legge piano), a scelta per gli altri.
export const voiceOn = () => S.settings.voice ?? S.lens === 'e';
