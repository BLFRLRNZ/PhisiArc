// I film delle lezioni: un piccolo film all'inizio di ogni lezione che porta un'idea nuova (dall'Officina in poi).
// Sono gli stessi film della cassetta degli attrezzi (toon.js, toonkit.js), ma parlano di fisica e li vedono tutte e tre
// le lenti: all'Esploratore il film non mostra lettere né formule (toonkit: formulas()).
// La prima volta il film sta in cima alla lezione e la domanda aspetta il tasto «Comincia»; dopo resta un bottone,
// nel fumetto della mascotte, per rivederlo quando si vuole.
import { h } from './util.js';
import { t as tr, LOCALE } from './i18n.js';
import { S, save } from './state.js';
import { IC } from './icons.js';
import { filmPlayer } from './toolanim.js';
import { setLocale, setLens } from './toonkit.js';
import forza from './films/forza.js';
import newton from './films/newton.js';
import reazione from './films/reazione.js';

setLocale(LOCALE);
export const LESSON_FILMS = { forza, newton, reazione };

// first: è la prima volta (la domanda aspetta); onGo: è stato premuto «Comincia»
export function lessonFilm(id, lens, { first = false, onGo } = {}) {
  const film = LESSON_FILMS[id];
  if (!film) return null;
  setLens(lens);
  const card = h('section', { class: 'filmcard', hidden: !first, 'aria-label': tr('Il film della lezione') });
  const chip = h('button', { class: 'chip film-chip', hidden: first }, h('span', { html: IC.play }), tr('Rivedi il film'));
  let player = null;
  const mount = () => { if (!player) { player = filmPlayer(film); card.prepend(player); } };
  const close = () => { if (player) { player.stop(); player.remove(); player = null; } card.hidden = true; chip.hidden = false; };
  const go = h('button', { class: 'btn primary' }, first ? tr('Comincia') : tr('Chiudi il film'));
  go.onclick = () => {
    S.films = S.films || {};
    if (!S.films[id]) { S.films[id] = 1; save(); }
    close();
    if (first) { first = false; go.textContent = tr('Chiudi il film'); if (onGo) onGo(); }
  };
  card.append(h('div', { class: 'row' }, go));
  chip.onclick = () => { setLens(lens); chip.hidden = true; card.hidden = false; mount(); card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
  if (first) mount();
  return { card, chip, stop: () => { if (player) player.stop(); } };
}
