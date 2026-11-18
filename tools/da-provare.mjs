// Quali livelli far giocare al test automatico, a partire dai file cambiati: si prova quello che si aggiunge, non tutto.
// - una zona (js/content/g03.js, js/i18n/en-g03.js): i livelli di quella zona;
// - una simulazione (js/sims/solar.js): i livelli che la usano;
// - i pezzi del parco: i livelli che costruiscono un pezzo;
// - i dati dei mondi, l'elenco delle simulazioni, l'inglese dei menu, la cassetta degli attrezzi, lo stile, i film,
//   il service worker, i test stessi:
//   il primo livello di ogni zona, per vedere che tutto si carica e si gioca (la cassetta ha anche il suo test);
// - il motore (il resto di js/, index.html): tutti i livelli, perché un cambiamento lì può rompere qualunque livello;
// - documenti, strumenti di controllo, immagini: nessun livello (bastano i controlli veloci, che guardano sempre tutto).
// Uso: node tools/da-provare.mjs file1 file2 ...   (oppure i nomi dei file uno per riga, in ingresso)
// Scrive «tutto», oppure i livelli separati da virgole, oppure niente; la spiegazione va sullo standard error.
// Con --cassetta scrive «si» se va provata la cassetta degli attrezzi (tests/tools.mjs): se cambiano la cassetta, i suoi
// film, il motore o i test.
import { readFileSync } from 'node:fs';

globalThis.localStorage = { getItem: (k) => (k === 'phisiarc-lingua' ? 'it' : null), setItem() {}, removeItem() {} };
globalThis.window = globalThis.window || {};
const { ZONES } = await import('../js/content/index.js');

const CASSETTA = process.argv.includes('--cassetta');
let files = process.argv.slice(2).filter((a) => a !== '--cassetta');
if (!files.length && !process.stdin.isTTY) files = readFileSync(0, 'utf8').split('\n');
files = files.map((f) => f.trim()).filter(Boolean);

const zones = Object.values(ZONES);
const levels = zones.flatMap((z) => z.levels);
const ofZone = (id) => (ZONES[id] ? ZONES[id].levels.map((l) => l.id) : []);
const firsts = () => zones.map((z) => z.levels[0].id);

// lo stesso «primo livello di ogni zona» per tutti i file di questo tipo
const SMOKE = [
  /^js\/content\/index\.js$/, /^js\/sims\/index\.js$/, /^js\/i18n\/en(-meta|-ui|-extra|-tools)?\.js$/,
  /^css\//, /^fonts\//, /^js\/films\//, /^js\/(intro|toon|toonkit|toolfilm|toolanim|tools|review|audio|neural|voicepanel|icons|cast)\.js$/,
  /^sw\.js$/, /^manifest\.webmanifest$/, /^\.github\//, /^tests\//, /^package\.json$/,
];
// niente da giocare
const NOTHING = [/\.md$/, /^docs\//, /^tools\//, /\.(png|jpg|svg|ico)$/, /^\.gitignore$/, /^_(film|sim)\.html$/, /^js\/content\/prereq\.js$/];

// la cassetta degli attrezzi e i suoi film
const TOOLBOX = [/^js\/(tools|toolfilm|toolanim|toon|toonkit)\.js$/, /^js\/films\//, /^js\/i18n\/en-tools\.js$/, /^tests\//, /^\.github\//];

const out = new Set();
let all = false;
const why = [];
for (const f of files) {
  let m;
  if ((m = f.match(/^js\/content\/([a-z]+\d\d)\.js$/)) || (m = f.match(/^js\/i18n\/en-([a-z]+\d\d)\.js$/))) {
    const ids = ofZone(m[1].toUpperCase());
    if (!ids.length) { all = true; why.push(`${f}: zona sconosciuta, tutto`); continue; }
    ids.forEach((i) => out.add(i)); why.push(`${f}: la zona ${m[1].toUpperCase()}`);
  } else if ((m = f.match(/^js\/sims\/(\w+)\.js$/)) && m[1] !== 'base' && m[1] !== 'index') {
    const ids = levels.filter((l) => l.sim === m[1]).map((l) => l.id);
    ids.forEach((i) => out.add(i)); why.push(`${f}: ${ids.length} livelli con questa simulazione`);
  } else if (f === 'js/pieces.js') {
    const ids = levels.filter((l) => l.piece).map((l) => l.id);
    ids.forEach((i) => out.add(i)); why.push(`${f}: i livelli che costruiscono un pezzo del parco`);
  } else if (SMOKE.some((r) => r.test(f))) {
    firsts().forEach((i) => out.add(i)); why.push(`${f}: il primo livello di ogni zona`);
  } else if (NOTHING.some((r) => r.test(f))) {
    why.push(`${f}: nessun livello`);
  } else {
    all = true; why.push(`${f}: motore, tutto`);
  }
}
if (CASSETTA) {
  const yes = all || files.some((f) => TOOLBOX.some((r) => r.test(f)));
  console.error(yes ? 'cassetta degli attrezzi: da provare' : 'cassetta degli attrezzi: non cambia');
  console.log(yes ? 'si' : '');
} else {
  console.error(why.join('\n') || 'nessun file cambiato');
  console.log(all ? 'tutto' : [...out].join(','));
}
