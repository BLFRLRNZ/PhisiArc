// Mondi, zone e regole di sblocco. I testi dei livelli stanno nei file delle zone.
import { S } from '../state.js';
import F01 from './f01.js';
import F02 from './f02.js';
import M01 from './m01.js';
import M02 from './m02.js';
import M03 from './m03.js';

export const KIND = {
  lezione: { icon: '📘', name: 'Lezione' },
  prevedi: { icon: '🔮', name: 'Prevedi' },
  costruisci: { icon: '🔧', name: 'Costruisci' },
  ripasso: { icon: '🔁', name: 'Ripasso' },
  boss: { icon: '👾', name: 'Boss' },
};

export const LENSES = {
  e: { name: 'Esploratore', age: '6-11 anni', icon: '🧭', desc: 'Si gioca e si guarda: niente formule, poche parole e una voce che legge.' },
  s: { name: 'Studente', age: '12-19 anni', icon: '📐', desc: 'Formule, unità di misura, grafici e calcoli verificati con valori sempre nuovi.' },
  c: { name: 'Curioso', age: 'adulti', icon: '☕', desc: 'Le idee della fisica e dove le incontri ogni giorno, con le formule solo se le vuoi.' },
};

export const ZONES = { F01, F02, M01, M02, M03 };

export const WORLDS = [
  {
    id: 'laboratorio', n: 1, name: 'Il Laboratorio', place: 'Il laboratorio di partenza',
    color: '#3fb6a8', mascot: { name: 'Ampolla', color: '#3fb6a8', acc: 'flask' },
    zones: ['F01', 'F02'], soon: ['F03 Grafici e vettori'], requires: [],
    intro: {
      e: 'Ciao! Sono Ampolla. Qui impariamo il trucco segreto degli scienziati: <b>prima indovini, poi controlli</b>. Pronto?',
      s: 'Benvenuto nel Laboratorio. Prima di correre, lanciare e far cadere le cose, serve il metodo: ipotesi, esperimento, misura.',
      c: 'Benvenuto nel Laboratorio. Qui c’è il metodo che separa i fatti dalle opinioni: prevedere, provare, misurare.',
    },
  },
  {
    id: 'pista', n: 2, name: 'La Pista', place: 'Il circuito delle gare',
    color: '#ff8a3d', mascot: { name: 'Rimbalzo', color: '#ff8a3d', acc: 'ball' },
    zones: ['M01', 'M02', 'M03'], soon: [], requires: ['laboratorio'],
    intro: {
      e: 'Eccomi, sono Rimbalzo! Sulla Pista le cose corrono, cadono e volano. Vediamo chi arriva prima?',
      s: 'Sulla Pista si studia il moto: velocità, accelerazione e traiettorie. Ogni gara diventa un grafico.',
      c: 'Sulla Pista c’è il moto, da Galileo ai giorni nostri: perché le cose cadono come cadono e i proiettili disegnano parabole.',
    },
  },
  { id: 'officina', n: 3, name: 'L’Officina', place: 'Carrelli, rampe e montagne russe', color: '#8a7cff', soon: ['M04 Forze e Newton', 'M05 Attrito', 'M06 Lavoro ed energia', 'M07 Urti', 'M08 Leve'], requires: ['pista'] },
  { id: 'oceano', n: 4, name: 'L’Oceano', place: 'Porto e fondali', color: '#3d8bff', soon: ['FL01 Pressione', 'FL02 Archimede', 'FL03 Fluidi e volo'], requires: ['officina'] },
  { id: 'valle', n: 5, name: 'La Valle delle Onde', place: 'Altalene, corde e strumenti', color: '#2bb673', soon: ['M10 Pendolo e molla', 'O01 Onde', 'O02 Suono', 'O03 Doppler'], requires: ['officina'] },
  { id: 'vulcano', n: 6, name: 'Il Vulcano', place: 'Dal ghiacciaio alla lava', color: '#ef5350', soon: ['T01 Temperatura e calore', 'T02 Stati della materia', 'T03-T06'], requires: ['laboratorio'] },
  { id: 'centrale', n: 7, name: 'La Centrale', place: 'Elettricità e magneti', color: '#f4b400', soon: ['E01 Cariche', 'E03 Circuiti', 'E04 Magnetismo', 'E02, E05, E06'], requires: ['officina'] },
  { id: 'prisma', n: 8, name: 'Il Prisma', place: 'Specchi, lenti e colori', color: '#e05fd0', soon: ['OT01 Luce e riflessione', 'OT03 Colori', 'OT02, OT04'], requires: ['laboratorio'] },
  { id: 'cielo', n: 9, name: 'Il Cielo', place: 'Osservatorio e sistema solare', color: '#5c6bc0', soon: ['M09 Gravitazione e orbite', 'A01 Sistema solare', 'A02 Cosmologia'], requires: ['officina', 'prisma'] },
  { id: 'abisso', n: 10, name: 'L’Abisso Quantico', place: 'Dentro l’atomo', color: '#00acc1', soon: ['Q02 Atomo e livelli', 'Q01, Q03-Q07'], requires: ['centrale'] },
  { id: 'frontiera', n: 11, name: 'La Frontiera', place: 'Vicino alla velocità della luce', color: '#7e57c2', soon: ['R01 Relatività ristretta', 'R02 Buchi neri'], requires: ['cielo', 'centrale'] },
  { id: 'casa', n: 12, name: 'Pianeta Casa', place: 'L’energia di una città', color: '#43a047', soon: ['X01 Energia, clima e ambiente'], requires: ['officina', 'vulcano', 'centrale'] },
];

export const GRADES = [
  { name: 'Apprendista', world: null, desc: 'Si parte da qui.' },
  { name: 'Sperimentatore', world: 'laboratorio', desc: 'Sai prevedere, provare e misurare: il metodo di ogni scienziato.' },
  { name: 'Galileo', world: 'pista', desc: 'Galileo Galilei (1564-1642) capì che, senza aria, tutto cade allo stesso modo e che il moto si può misurare.' },
  { name: 'Newton', world: 'officina', desc: 'In arrivo.' },
  { name: 'Archimede', world: 'oceano', desc: 'In arrivo.' },
  { name: 'Hooke', world: 'valle', desc: 'In arrivo.' },
  { name: 'Kelvin', world: 'vulcano', desc: 'In arrivo.' },
  { name: 'Faraday', world: 'centrale', desc: 'In arrivo.' },
  { name: 'Huygens', world: 'prisma', desc: 'In arrivo.' },
  { name: 'Keplero', world: 'cielo', desc: 'In arrivo.' },
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
