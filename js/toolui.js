// I pezzi comuni delle schede della cassetta degli attrezzi (tools.js e tools-mondi.js): i numeri scritti nella lingua
// giusta, il riquadro del disegno e il cursore con il suo valore accanto.
import { h } from './util.js';
import { LOCALE } from './i18n.js';

export const n = (x, d = 2) => Number(x).toLocaleString(LOCALE, { maximumFractionDigits: d });
export const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" class="tool-svg" aria-hidden="true">${inner}</svg>`;

// un cursore con il valore accanto (show: come scrivere il valore, se non è un numero semplice)
export function slider(label, min, max, step, val, onIn, show) {
  const out = h('output');
  const r = h('input', { type: 'range', min, max, step, value: val, 'aria-label': label });
  const set = () => { out.textContent = show ? show(Number(r.value)) : n(r.value); onIn(Number(r.value)); };
  r.addEventListener('input', set);
  return { el: h('label', { class: 'tool-sl' }, h('span', {}, label, ' ', out), r), set, r };
}
