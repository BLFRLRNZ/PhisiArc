// I piccoli film della cassetta degli attrezzi: uno per attrezzo, con lo stesso nome dell'attrezzo in tools.js.
// In ogni film l'omino costruisce l'attrezzo con le sue mani; non ci sono scritte: ogni segno nasce da una cosa
// che si vede e che lui tocca. Il motore (corpo, telecamera, urti, suoni) è toon.js, la regia a battute toonkit.js.
import { LOCALE } from './i18n.js';
import { setLocale } from './toonkit.js';
import potenze from './films/potenze.js';
import formula from './films/formula.js';
import quadrato from './films/quadrato.js';
import radice from './films/radice.js';
import pitagora from './films/pitagora.js';
import pi from './films/pi.js';
import seno from './films/seno.js';

setLocale(LOCALE);   // i numeri con la virgola in italiano, con il punto in inglese
export const FILMS = { potenze, formula, quadrato, radice, pitagora, pi, seno };
