// Mondi, zone e regole di sblocco. I testi dei livelli stanno nei file delle zone.
import { S, save } from '../state.js';
import { IC } from '../icons.js';
import { T } from '../util.js';
import { compileZone } from './declarative.js';
import { t as tr, translateTree } from '../i18n.js';
import F01 from './f01.js';
import F02 from './f02.js';
import F03 from './f03.js';
import M01 from './m01.js';
import M02 from './m02.js';
import M03 from './m03.js';
import M04 from './m04.js';
import M05 from './m05.js';
import D01 from './d01.js';
import D02 from './d02.js';
import D03 from './d03.js';
import D04 from './d04.js';
import D05 from './d05.js';
import G01 from './g01.js';
import G02 from './g02.js';
import G03 from './g03.js';
import FL01 from './fl01.js';
import FL02 from './fl02.js';
import FL03 from './fl03.js';
import T01 from './t01.js';
import T02 from './t02.js';
import T03 from './t03.js';
import T04 from './t04.js';
import O01 from './o01.js';
import O02 from './o02.js';
import O03 from './o03.js';
import O04 from './o04.js';
import OT01 from './ot01.js';
import OT02 from './ot02.js';
import OT03 from './ot03.js';

export const KIND = {
  lezione: { ic: IC.lezione, name: 'Lezione' },
  prevedi: { ic: IC.prevedi, name: 'Prevedi' },
  costruisci: { ic: IC.costruisci, name: 'Costruisci' },
  ripasso: { ic: IC.ripasso, name: 'Ripasso' },
  boss: { ic: IC.boss, name: 'Boss' },
};

export const LENSES = {
  e: { name: 'Esploratore', age: '6-11 anni', char: 'boing', desc: 'Si gioca e si guarda: niente formule, poche parole e una voce che legge.' },
  s: { name: 'Studente', age: '12-19 anni', char: 'tic', desc: 'Formule, unità di misura, grafici e calcoli verificati con valori sempre nuovi.' },
  c: { name: 'Curioso', age: 'adulti', char: 'lampo', desc: 'Le idee della fisica e dove le incontri ogni giorno, con le formule solo se le vuoi.' },
};

export const ZONES = { F01, F02, F03, M01, M02, M03, M04, M05, D01, D02, D03, D04, D05, G01, G02, G03, FL01, FL02, FL03, T01, T02, T03, T04, O01, O02, O03, O04, OT01, OT02, OT03 };
// in inglese le frasi si traducono prima di compilare; poi i passi scritti solo a testo diventano giocabili
for (const z of Object.values(ZONES)) compileZone(translateTree(z));

export const WORLDS = [
  {
    id: 'laboratorio', n: 1, diff: 1, name: 'Il Laboratorio', field: 'Metodo e misure', place: 'Il laboratorio di partenza',
    color: 'var(--mint)', mascot: 'ampolla',
    zones: ['F01', 'F02', 'F03'], soon: [], requires: [],
    intro: {
      e: 'Ciao! Sono Ampolla. Qui impariamo il trucco segreto degli scienziati: <b>prima indovini, poi controlli</b>. Pronto?',
      s: 'Sono Ampolla, benvenuto nel Laboratorio. Prima di correre, lanciare e far cadere le cose, serve il metodo: ipotesi, esperimento, misura.',
      c: 'Sono Ampolla, benvenuto nel Laboratorio. Qui c’è il metodo che separa i fatti dalle opinioni: prevedere, provare, misurare.',
    },
  },
  {
    id: 'pista', n: 2, diff: 2, name: 'La Pista', field: 'Cinematica: il moto', place: 'Il circuito delle gare',
    color: 'var(--orange)', mascot: 'tic',
    zones: ['M01', 'M04', 'M02', 'M03', 'M05'], soon: [], requires: ['laboratorio'],
    intro: {
      e: 'Tre, due, uno… via! Sono Tic, il cronometro della Pista. Qui le cose corrono, cadono e volano: io conto metri e secondi. Vediamo chi arriva prima?',
      s: 'Sono Tic, il cronometro della Pista. Qui si studia il moto: velocità, accelerazione e traiettorie. Ogni gara diventa un grafico.',
      c: 'Sono Tic, il cronometro della Pista. Qui c’è il moto, da Galileo ai giorni nostri: perché le cose cadono come cadono e i proiettili disegnano parabole.',
    },
  },
  // Dal più semplice al più difficile: ogni mondo è un campo della fisica e si apre solo dopo aver finito quello prima.
  // Il Cielo viene subito dopo l'Officina (la gravitazione continua Newton e usa il moto circolare della Pista);
  // la Frontiera viene prima dell'Abisso (l'energia dei nuclei si spiega con E = mc²).
  {
    id: 'officina', n: 3, diff: 2, name: 'L’Officina', field: 'Dinamica: forze ed energia', place: 'Carrelli, rampe e montagne russe', color: 'var(--coral)', mascot: 'mela',
    zones: ['D01', 'D02', 'D03', 'D04', 'D05'],
    soon: [], requires: ['pista'],
    intro: {
      e: 'Ciao, sono Mela! Nell’Officina si spinge, si tira e si lancia. Scopriremo che cosa fa partire le cose, e che cosa le ferma.',
      s: 'Sono Mela, benvenuto nell’Officina. Nella Pista hai imparato a descrivere il moto; qui scopri le sue cause: le forze, le leggi di Newton e l’energia.',
      c: 'Sono Mela, quella caduta in testa a Newton. Nella Pista hai visto come si muovono le cose; qui si scopre perché.',
    },
  },
  {
    id: 'cielo', n: 4, diff: 3, name: 'Il Cielo', field: 'Gravitazione', place: 'Osservatorio e sistema solare', color: '#a9b8ff', mascot: 'saturnino',
    zones: ['G01', 'G02', 'G03'],
    soon: [], requires: ['officina'],
    intro: {
      e: 'Ciao, sono Saturnino! Giro, giro, ma non cado mai. Nel Cielo scopriremo perché la Luna non cade, e quanto peseresti sugli altri pianeti.',
      s: 'Sono Saturnino, benvenuto nel Cielo. Nell’Officina hai visto che le forze cambiano il moto; qui scopri la forza che tiene insieme il sistema solare: la gravità, dalla mela alla Luna.',
      c: 'Sono Saturnino: giro, giro, ma non cado mai. Newton capì che la forza che fa cadere una mela è la stessa che tiene la Luna intorno alla Terra. Da qui comincia il Cielo.',
    },
  },
  {
    id: 'oceano', n: 5, diff: 2, name: 'L’Oceano', field: 'I fluidi', place: 'Porto e fondali', color: 'var(--sky)', mascot: 'goccia',
    zones: ['FL01', 'FL02', 'FL03'],
    soon: [], requires: ['cielo'],
    intro: {
      e: 'Ciao, sono Goccia! Nell’Oceano scopriremo perché l’acqua spinge, chi galleggia e chi va a fondo, e come fanno a volare gli aerei.',
      s: 'Sono Goccia, benvenuto nell’Oceano. Nel Cielo hai visto la forza di gravità; qui scopri che cosa fanno le forze dentro i liquidi e i gas: la pressione, il galleggiamento, il volo.',
      c: 'Sono Goccia. Acqua e aria sembrano non opporsi a niente, eppure reggono navi da centomila tonnellate e aerei da quattrocento. Il segreto è la pressione, e da lì comincia l’Oceano.',
    },
  },
  {
    id: 'vulcano', n: 6, diff: 3, name: 'Il Vulcano', field: 'Termodinamica', place: 'Dal ghiacciaio alla lava', color: 'var(--coral)', mascot: 'termo',
    zones: ['T01', 'T02', 'T03', 'T04'],
    soon: [], requires: ['oceano'],
    intro: {
      e: 'Ciao, sono Termo! Nel Vulcano scopriremo che cos’è il caldo, perché il ghiaccio si scioglie, come si gonfia una mongolfiera e come funziona un motore.',
      s: 'Sono Termo, benvenuto nel Vulcano. Nell’Oceano hai visto la pressione dei fluidi; qui scopri la temperatura e il calore, i passaggi di stato, i gas e i motori: la termodinamica.',
      c: 'Sono Termo. Dal ghiacciaio alla lava, tutto quello che si scalda, si scioglie, bolle o si gonfia segue poche leggi: le stesse che fanno girare i motori, e che nessuno è mai riuscito a imbrogliare. È la termodinamica.',
    },
  },
  {
    id: 'valle', n: 7, diff: 3, name: 'La Valle delle Onde', field: 'Oscillazioni, onde e suono', place: 'Altalene, corde e strumenti', color: 'var(--mint)', mascot: 'boing',
    zones: ['O01', 'O02', 'O03', 'O04'],
    soon: [], requires: ['vulcano'],
    intro: {
      e: 'Boing, boing! Sono Boing, e non sto mai fermo. Nella Valle delle Onde scopriremo come oscillano le molle e le altalene, come viaggiano le onde e da dove viene il suono.',
      s: 'Sono Boing, benvenuto nella Valle delle Onde. Nel Vulcano hai visto il calore e i motori; qui scopri le oscillazioni, le onde e il suono: tutto quello che va avanti e indietro e porta energia senza portare materia.',
      c: 'Sono Boing. Una molla, una corda di chitarra, il mare, la voce: sembrano cose diverse, ma oscillano tutte allo stesso modo. Capire un’oscillazione vuol dire capire le onde, e le onde sono ovunque.',
    },
  },
  {
    id: 'prisma', n: 8, diff: 3, name: 'Il Prisma', field: 'Ottica', place: 'Specchi, lenti e colori', color: 'var(--pink)', mascot: 'iride',
    // In costruzione (building): le zone si aggiungono una alla volta. Finché il mondo non è completo non conta come finito
    // (niente grado di Huygens, niente prova d'ingresso), ma le zone pronte si giocano già.
    zones: ['OT01', 'OT02', 'OT03'], building: true,
    soon: ['OT04 La luce è un’onda'], requires: ['valle'],
    intro: {
      e: 'Ciao, sono Iride, un prisma di vetro! Nel Prisma scopriremo come viaggia la luce, come rimbalza sugli specchi, come si piega nell’acqua e perché la luce bianca è fatta di tutti i colori.',
      s: 'Sono Iride, benvenuto nel Prisma. Nella Valle delle Onde hai visto le onde e il suono; qui scopri la luce: i raggi, gli specchi, le lenti, i colori e, alla fine, la luce come onda. È l’ottica.',
      c: 'Sono Iride. Un riflesso in una vetrina, una lente, un arcobaleno: la luce segue poche regole semplici. E quando le regole non bastano più, si scopre che anche la luce è un’onda. Benvenuto nell’ottica.',
    },
  },
  { id: 'centrale', n: 9, diff: 4, name: 'La Centrale', field: 'Elettromagnetismo', place: 'Cariche, circuiti e magneti', color: 'var(--sun)', mascot: 'lampo',
    soon: ['E01 Cariche e campi', 'E02 Corrente e circuiti', 'E03 I magneti', 'E04 Induzione e generatori', 'E05 Onde elettromagnetiche'], requires: ['prisma'] },
  { id: 'frontiera', n: 10, diff: 5, name: 'La Frontiera', field: 'Relatività', place: 'Vicino alla velocità della luce', color: 'var(--sun)', mascot: 'attimo', buddy: 'lux',
    soon: ['R01 La luce ha un limite', 'R02 Tempo e spazio elastici', 'R03 E = mc²', 'R04 Buchi neri e universo'], requires: ['centrale'] },
  { id: 'abisso', n: 11, diff: 5, name: 'L’Abisso Quantico', field: 'Quanti e nuclei', place: 'Dentro l’atomo', color: 'var(--sky)', mascot: 'elettra',
    soon: ['Q01 Dentro l’atomo', 'Q02 Fotoni e livelli di energia', 'Q03 Onde di materia', 'Q04 Nuclei, fissione e fusione'], requires: ['frontiera'] },
  { id: 'casa', n: 12, diff: 4, name: 'Pianeta Casa', field: 'Sintesi: energia e clima', place: 'L’energia di una città', color: 'var(--green)', mascot: 'carica',
    soon: ['X01 Da dove viene l’energia (ripasso-ponte)', 'X02 Clima ed effetto serra', 'X03 La città sostenibile'], requires: ['abisso'] },
];

export const GRADES = [
  { name: 'Apprendista', world: null, desc: 'Si parte da qui.' },
  { name: 'Sperimentatore', world: 'laboratorio', desc: 'Sai prevedere, provare e misurare: il metodo di ogni scienziato.' },
  { name: 'Galileo', world: 'pista', desc: 'Galileo Galilei (1564-1642) capì che, senza aria, tutto cade allo stesso modo e che il moto si può misurare.' },
  { name: 'Newton', world: 'officina', desc: 'Isaac Newton (1642-1727) scrisse le leggi del moto: una forza non serve a mantenere il moto, ma a cambiarlo.' },
  { name: 'Keplero', world: 'cielo', desc: 'Giovanni Keplero (1571-1630) scoprì le leggi dei pianeti: girano intorno al Sole su ellissi, e più sono lontani più vanno piano.' },
  { name: 'Archimede', world: 'oceano', desc: 'Archimede di Siracusa (circa 287-212 a.C.) scoprì la spinta dei liquidi: chi entra nell’acqua riceve una spinta verso l’alto pari al peso dell’acqua che sposta.' },
  { name: 'Kelvin', world: 'vulcano', desc: 'Lord Kelvin, William Thomson (1824-1907), capì che il freddo ha un fondo: lo zero assoluto, −273 °C, da cui parte la scala delle temperature che porta il suo nome.' },
  { name: 'Hooke', world: 'valle', desc: 'Robert Hooke (1635-1703) scoprì che una molla risponde con una forza proporzionale a quanto la tiri: da lì partono le oscillazioni, le onde e il suono.' },
  { name: 'Huygens', world: 'prisma', desc: 'In arrivo.' },
  { name: 'Faraday', world: 'centrale', desc: 'In arrivo.' },
  { name: 'Einstein', world: 'frontiera', desc: 'In arrivo.' },
  { name: 'Bohr', world: 'abisso', desc: 'In arrivo.' },
  { name: 'Curie', world: 'casa', desc: 'Il traguardo finale.' },
];

translateTree({ KIND, LENSES, WORLDS, GRADES });

// ---------- aiuti per cercare ----------
const LEVEL_ZONE = {};
for (const z of Object.values(ZONES)) for (const l of z.levels) LEVEL_ZONE[l.id] = z;

export const worldById = (id) => WORLDS.find((w) => w.id === id);
export const zoneOf = (levelId) => LEVEL_ZONE[levelId];
export const worldOf = (zoneId) => WORLDS.find((w) => (w.zones || []).includes(zoneId));
export const levelById = (id) => LEVEL_ZONE[id]?.levels.find((l) => l.id === id);

export const zoneDone = (z) => ZONES[z].levels.every((l) => S.done[l.id]);
export const worldReady = (w) => !!(w.zones && w.zones.length);
export const worldDone = (w) => worldReady(w) && !w.building && (!!(S.skip && S.skip[w.id]) || w.zones.every(zoneDone));

// Prova d'ingresso: chi conosce già un mondo può superarlo rispondendo alle domande dei suoi ripassi.
export const EXAM_MAX_ERRORS = 2;
export const examFor = (w) => ({
  id: 'esame-' + w.id, exam: w.id, kind: 'ripasso', title: tr('Prova d’ingresso'),
  zoneRef: ZONES[w.zones[0]],
  intro: T(
    tr('Conosci già {w}? Rispondi a queste domande: con al massimo {n} errori, e senza aiuti, il mondo dopo si apre subito. I livelli restano lì, da giocare quando vuoi.', { w: w.name, n: EXAM_MAX_ERRORS }),
    tr('Prova d’ingresso: le domande dei ripassi di {w}. Con al massimo {n} errori, e senza aiuti, il mondo successivo si apre. I livelli restano giocabili.', { w: w.name, n: EXAM_MAX_ERRORS })),
  steps: w.zones.flatMap((z) => ZONES[z].levels.filter((l) => l.kind === 'ripasso')
    // i calcoli valgono per Esploratore e Studente: al Curioso («le formule solo se le vuoi») la prova chiede solo le idee
    .flatMap((l) => l.steps.filter((st) => (st.kind === 'q' && !st.predict) || st.kind === 'num')
      .map((st) => (st.kind === 'num' ? { ...st, rounds: 1, only: (st.only || ['e', 's', 'c']).filter((x) => x !== 'c') } : st)))),
  hints: [], // l'avviso «se usi un aiuto la prova non vale» lo dà il tasto Aiuto, al primo tocco di ogni passo (level.js)
});
// Quello che si è aperto resta aperto: se più avanti si aggiunge una zona (per esempio F03),
// chi aveva già sbloccato un mondo, una zona o un livello non se lo ritrova chiuso.
function remember(key, open) {
  S.aperti = S.aperti || {};
  if (S.aperti[key]) return true;
  if (open) { S.aperti[key] = 1; save(); }
  return open;
}
export const worldOpen = (w) => remember('w:' + w.id, w.requires.every((r) => worldDone(worldById(r))));

export function zoneOpen(zid) {
  const w = worldOf(zid);
  if (!worldOpen(w)) return false;
  const i = w.zones.indexOf(zid);
  return remember('z:' + zid, i === 0 || zoneDone(w.zones[i - 1]) || ZONES[zid].levels.some((l) => S.done[l.id]));
}

export function levelOpen(id) {
  const z = zoneOf(id);
  if (!zoneOpen(z.id)) return false;
  const i = z.levels.findIndex((l) => l.id === id);
  return i === 0 || !!S.done[id] || !!S.done[z.levels[i - 1].id];
}

// Il mondo che viene dopo questo nel percorso.
export const nextWorld = (w) => WORLDS[WORLDS.indexOf(w) + 1] || null;

export function nextLevel(id) {
  const z = zoneOf(id);
  const i = z.levels.findIndex((l) => l.id === id);
  if (i < z.levels.length - 1) return z.levels[i + 1].id;
  const w = worldOf(z.id);
  const zi = w.zones.indexOf(z.id);
  if (zi < w.zones.length - 1) return ZONES[w.zones[zi + 1]].levels[0].id;
  return null;
}

export function gradeNow() {
  let g = GRADES[0];
  for (const gr of GRADES) if (gr.world && worldDone(worldById(gr.world))) g = gr;
  return g;
}

export const ALL_PIECES = Object.values(ZONES).flatMap((z) => z.levels.filter((l) => l.piece).map((l) => l.piece));
