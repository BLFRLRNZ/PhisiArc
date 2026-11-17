// Elenca le frasi da tradurre: tutte quelle dei dati (zone, mondi, personaggi, pezzi del parco)
// e quelle scritte nel codice con t('...').
//   node tools/i18n-strings.mjs            → frasi senza traduzione inglese, per file
//   node tools/i18n-strings.mjs --all      → tutte le frasi
//   node tools/i18n-strings.mjs --json F   → le frasi mancanti in un file JSON { gruppo: [frasi] }
//   node tools/i18n-strings.mjs --check    → errore se manca qualche traduzione (lo usano i controlli)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

globalThis.localStorage ??= { getItem: (k) => (k === 'phisiarc-lingua' ? 'it' : null), setItem: () => {}, removeItem: () => {} };
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const EN = (await import(join(root, 'js/i18n/en.js'))).default;
const C = await import(join(root, 'js/content/index.js'));
const { CAST } = await import(join(root, 'js/cast.js'));

const SKIP = new Set(['id', 'kind', 'sim', 'film', 'mode', 'measure', 'goal', 'calc', 'derive', 'solve', 'only', 'controls', 'char', 'mascot', 'buddy', 'color', 'c', 'ic', 'svg', 'in', 'shape', 'requires', 'zones', 'params', 'set', 'seq', 'predict', 'vals', 'k', 'type', 'when', 'try']);
const isLens = (o) => o && typeof o === 'object' && !Array.isArray(o) && 'e' in o && 's' in o;
const wordy = (s) => /[A-Za-zÀ-ÿ]{2,}/.test(s.replace(/<[^>]+>/g, '')) && !/^(m\/s|km\/h|m\/s²|rad\/s|cm|mm|km|kg|Hz)$/.test(s);
function walk(o, out, seen = new Set()) {
  if (!o || typeof o !== 'object' || seen.has(o)) return;
  seen.add(o);
  const lens = isLens(o);
  for (const k of Object.keys(o)) {
    if (!lens && SKIP.has(k)) continue;
    const v = o[k];
    if (typeof v === 'string') { if (v.length > 1 && wordy(v)) out.add(v); } else if (v && typeof v === 'object' && typeof v !== 'function') walk(v, out, seen);
  }
}

const groups = {};
for (const [id, z] of Object.entries(C.ZONES)) { const s = new Set(); walk(z, s); groups[id] = s; }
const meta = new Set();
walk({ WORLDS: C.WORLDS, GRADES: C.GRADES, LENSES: C.LENSES, KIND: C.KIND, CAST }, meta);
for (const w of C.WORLDS) meta.delete(w.id);
groups.meta = meta;
// frasi nel codice: t('...') e t("...")
const code = new Set();
const files = ['js', 'js/sims', 'js/content'].flatMap((d) => readdirSync(join(root, d)).filter((f) => f.endsWith('.js') && f !== 'i18n.js').map((f) => join(root, d, f)));
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/\b(?:t|tr|i18n)\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g)) code.add(m[2].replace(/\\(['"`\\])/g, '$1'));
}
// testi fissi delle simulazioni: etichette, nomi degli oggetti, scritte sul disegno
const sims = new Set();
const simFiles = ['js/sims', 'js/sims/art'].flatMap((d) => readdirSync(join(root, d)).filter((f) => f.endsWith('.js')).map((f) => join(root, d, f)));
for (const f of simFiles) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?:text\(|label: |name: |xl: |yl: |\bt: |options: \[\[[^\]]*?, |\], \[[^\]]*?, |-?\d+'?: )'([^'\n]+)'/g)) if (/[a-zà-ù]{3,}/i.test(m[1]) && !/^(sim-bg|accent2|chalk|muted|orange|sun|coral|sky|mint|pink|ink|car2)$/.test(m[1])) sims.add(m[1]);
}
for (const m of readFileSync(join(root, 'js/state.js'), 'utf8').matchAll(/new Error\(t\('([^']+)'\)/g)) code.add(m[1]);
groups.code = code;
groups.sims = sims;

const all = process.argv.includes('--all');
const jsonAt = process.argv.indexOf('--json');
const res = {};
let miss = 0, tot = 0;
const done = new Set();
for (const [g, set] of Object.entries(groups)) {
  const list = [...set].filter((s) => !done.has(s) && (all || EN[s] == null));
  [...set].forEach((s) => { tot += done.has(s) ? 0 : 1; done.add(s); });
  miss += list.length;
  if (list.length) res[g] = list;
}
if (jsonAt > 0) writeFileSync(process.argv[jsonAt + 1], JSON.stringify(res, null, 1));
else for (const [g, l] of Object.entries(res)) console.log(`\n## ${g} (${l.length})\n` + l.map((s) => '- ' + s).join('\n'));
console.log(`\n${tot} frasi, ${miss} senza traduzione inglese.`);
if (process.argv.includes('--check') && miss) process.exit(1);
