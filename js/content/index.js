// Mondi, zone e regole di sblocco. I testi dei livelli stanno nei file delle zone.
import { S } from '../state.js';
import { IC } from '../icons.js';
import F01 from './f01.js';
import F02 from './f02.js';
import M01 from './m01.js';
import M02 from './m02.js';
import M03 from './m03.js';

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

export const ZONES = { F01, F02, M01, M02, M03 };

export const WORLDS = [
  {
    id: 'laboratorio', n: 1, name: 'Il Laboratorio', field: 'Metodo e misure', place: 'Il laboratorio di partenza',
    color: 'var(--mint)', mascot: 'ampolla',
    zones: ['F01', 'F02'], soon: ['F03 Grafici e vettori'], requires: [],
    intro: {
      e: 'Ciao! Sono Ampolla. Qui impariamo il trucco segreto degli scienziati: <b>prima indovini, poi controlli</b>. Pronto?',
      s: 'Sono Ampolla, benvenuto nel Laboratorio. Prima di correre, lanciare e far cadere le cose, serve il metodo: ipotesi, esperimento, misura.',
      c: 'Sono Ampolla, benvenuto nel Laboratorio. Qui c’è il metodo che separa i fatti dalle opinioni: prevedere, provare, misurare.',
    },
  },
  {
    id: 'pista', n: 2, name: 'La Pista', field: 'Il moto', place: 'Il circuito delle gare',
    color: 'var(--orange)', mascot: 'tic',
    zones: ['M01', 'M02', 'M03'], soon: [], requires: ['laboratorio'],
    intro: {
      e: 'Tre, due, uno… via! Sono Tic, il cronometro della Pista. Qui le cose corrono, cadono e volano: io conto metri e secondi. Vediamo chi arriva prima?',
      s: 'Sono Tic, il cronometro della Pista. Qui si studia il moto: velocità, accelerazione e traiettorie. Ogni gara diventa un grafico.',
      c: 'Sono Tic, il cronometro della Pista. Qui c’è il moto, da Galileo ai giorni nostri: perché le cose cadono come cadono e i proiettili disegnano parabole.',
    },
  },
  // Dal più semplice al più difficile: ogni mondo è un campo della fisica e si apre solo dopo aver finito quello prima.
  { id: 'officina', n: 3, name: 'L’Officina', field: 'Forze ed energia', place: 'Carrelli, rampe e montagne russe', color: 'var(--coral)', mascot: 'mela',
    soon: ['M04 Le forze e Newton', 'M05 Attrito e piani inclinati', 'M06 Lavoro ed energia', 'M07 Quantità di moto e urti', 'M08 Leve e rotazioni'], requires: ['pista'] },
  { id: 'oceano', n: 4, name: 'L’Oceano', field: 'I fluidi', place: 'Porto e fondali', color: 'var(--sky)', mascot: 'goccia',
    soon: ['FL01 La pressione', 'FL02 Galleggiare: Archimede', 'FL03 Fluidi in movimento e volo'], requires: ['officina'] },
  { id: 'vulcano', n: 5, name: 'Il Vulcano', field: 'Il calore', place: 'Dal ghiacciaio alla lava', color: 'var(--coral)', mascot: 'termo',
    soon: ['T01 Temperatura e calore', 'T02 Stati della materia', 'T03 I gas', 'T04 Motori ed entropia'], requires: ['oceano'] },
  { id: 'valle', n: 6, name: 'La Valle delle Onde', field: 'Onde e suono', place: 'Altalene, corde e strumenti', color: 'var(--mint)', mascot: 'boing',
    soon: ['O01 Molle e oscillazioni', 'O02 Le onde', 'O03 Il suono', 'O04 Risonanza ed effetto Doppler'], requires: ['vulcano'] },
  { id: 'prisma', n: 7, name: 'Il Prisma', field: 'La luce', place: 'Specchi, lenti e colori', color: 'var(--pink)', mascot: 'iride',
    soon: ['OT01 Raggi e riflessione', 'OT02 Rifrazione e lenti', 'OT03 Colori e spettro', 'OT04 La luce è un’onda'], requires: ['valle'] },
  { id: 'cielo', n: 8, name: 'Il Cielo', field: 'Gravità e spazio', place: 'Osservatorio e sistema solare', color: '#a9b8ff', mascot: 'saturnino',
    soon: ['A01 La gravitazione universale', 'A02 Orbite e leggi di Keplero', 'A03 Il sistema solare', 'A04 Stelle e universo'], requires: ['prisma'] },
  { id: 'centrale', n: 9, name: 'La Centrale', field: 'Elettricità e magnetismo', place: 'Cariche, circuiti e magneti', color: 'var(--sun)', mascot: 'lampo',
    soon: ['E01 Cariche e campi', 'E02 Corrente e circuiti', 'E03 I magneti', 'E04 Induzione e generatori'], requires: ['cielo'] },
  { id: 'abisso', n: 10, name: 'L’Abisso Quantico', field: 'Il mondo dei quanti', place: 'Dentro l’atomo', color: 'var(--sky)', mascot: 'elettra',
    soon: ['Q01 Dentro l’atomo', 'Q02 Fotoni e livelli di energia', 'Q03 Onde di materia', 'Q04 Nuclei e radioattività'], requires: ['centrale'] },
  { id: 'frontiera', n: 11, name: 'La Frontiera', field: 'La relatività', place: 'Vicino alla velocità della luce', color: 'var(--sun)', mascot: 'attimo', buddy: 'lux',
    soon: ['R01 La luce ha un limite', 'R02 Tempo e spazio elastici', 'R03 E = mc²', 'R04 Buchi neri'], requires: ['abisso'] },
  { id: 'casa', n: 12, name: 'Pianeta Casa', field: 'Energia e pianeta', place: 'L’energia di una città', color: 'var(--green)', mascot: 'carica',
    soon: ['X01 Da dove viene l’energia', 'X02 Clima ed effetto serra', 'X03 La città sostenibile'], requires: ['frontiera'] },
];

export const GRADES = [
  { name: 'Apprendista', world: null, desc: 'Si parte da qui.' },
  { name: 'Sperimentatore', world: 'laboratorio', desc: 'Sai prevedere, provare e misurare: il metodo di ogni scienziato.' },
  { name: 'Galileo', world: 'pista', desc: 'Galileo Galilei (1564-1642) capì che, senza aria, tutto cade allo stesso modo e che il moto si può misurare.' },
  { name: 'Newton', world: 'officina', desc: 'In arrivo.' },
  { name: 'Archimede', world: 'oceano', desc: 'In arrivo.' },
  { name: 'Kelvin', world: 'vulcano', desc: 'In arrivo.' },
  { name: 'Hooke', world: 'valle', desc: 'In arrivo.' },
  { name: 'Huygens', world: 'prisma', desc: 'In arrivo.' },
  { name: 'Keplero', world: 'cielo', desc: 'In arrivo.' },
  { name: 'Faraday', world: 'centrale', desc: 'In arrivo.' },
  { name: 'Bohr', world: 'abisso', desc: 'In arrivo.' },
  { name: 'Einstein', world: 'frontiera', desc: 'In arrivo.' },
  { name: 'Curie', world: 'casa', desc: 'Il traguardo finale.' },
];

// ---------- aiuti per cercare ----------
const LEVEL_ZONE = {};
for (const z of Object.values(ZONES)) for (const l of z.levels) LEVEL_ZONE[l.id] = z;

export const worldById = (id) => WORLDS.find((w) => w.id === id);
export const zoneOf = (levelId) => LEVEL_ZONE[levelId];
export const worldOf = (zoneId) => WORLDS.find((w) => (w.zones || []).includes(zoneId));
export const levelById = (id) => LEVEL_ZONE[id]?.levels.find((l) => l.id === id);

export const zoneDone = (z) => ZONES[z].levels.every((l) => S.done[l.id]);
export const worldReady = (w) => !!(w.zones && w.zones.length);
export const worldDone = (w) => worldReady(w) && w.zones.every(zoneDone);
export const worldOpen = (w) => w.requires.every((r) => worldDone(worldById(r)));

export function zoneOpen(zid) {
  const w = worldOf(zid);
  if (!worldOpen(w)) return false;
  const i = w.zones.indexOf(zid);
  return i === 0 || zoneDone(w.zones[i - 1]);
}

export function levelOpen(id) {
  const z = zoneOf(id);
  if (!zoneOpen(z.id)) return false;
  const i = z.levels.findIndex((l) => l.id === id);
  return i === 0 || !!S.done[z.levels[i - 1].id];
}

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
