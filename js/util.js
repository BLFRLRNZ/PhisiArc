// Piccoli aiuti condivisi.
import { LOCALE, t as tr } from './i18n.js';

export const $ = (sel, root = document) => root.querySelector(sel);

// Crea un elemento: h('div', {class: 'x', onclick: fn}, figli...)
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) {
    if (k == null || k === false) continue;
    el.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return el;
}

// Un testo nelle tre lenti: Esploratore (e), Studente (s), Curioso (c).
// Se manca una lente si usa quella prima.
export const T = (e, s, c) => ({ e, s: s ?? e, c: c ?? s ?? e });

// Dentro un testo, [[…]] racchiude una formula facoltativa: sulla pagina diventa un riquadro chiuso, «Per chi vuole la formula»,
// che si apre con un tocco. Lo usa la lente Curioso, che promette «le formule solo se le vuoi».
const FBOX = /\[\[([\s\S]+?)\]\]/g;
export const rich = (s) => (typeof s === 'string' && s.includes('[[')
  ? s.replace(FBOX, (m, x) => `<details class="fbox"><summary>${tr('Per chi vuole la formula')}</summary><div>${x.trim()}</div></details>`) : s);
// lo stesso testo senza i riquadri (per decidere quali attrezzi servono davvero, e per la lettura ad alta voce)
export const noBox = (s) => String(s ?? '').replace(/<details class="fbox">[\s\S]*?<\/details>/g, ' ').replace(FBOX, ' ');

export const tx = (o, lens) => {
  if (o == null) return '';
  if (typeof o === 'string') return rich(o);
  return rich(o[lens] ?? o.s ?? o.e ?? '');
};

export const pick = (a) => a[Math.floor(Math.random() * a.length)];

export function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export const num = (x, d = 1) =>
  Number(x).toLocaleString(LOCALE, { maximumFractionDigits: d, minimumFractionDigits: 0 });

// il testo senza i segni dell'HTML (per la voce): i riquadri facoltativi delle formule non si leggono
export const plain = (html) => {
  const d = document.createElement('div');
  d.innerHTML = noBox(html);
  d.querySelectorAll('.tool-offer').forEach((x) => x.remove()); // i bottoni «Attrezzo …» non fanno parte del testo
  return d.textContent || '';
};

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Rende una finestra sopra la pagina accessibile: ruolo di dialogo, titolo letto dal lettore di schermo,
// fuoco sul pulsante principale e Tab che resta dentro la finestra finché è aperta.
export function asDialog(modal, onEsc) {
  const card = modal.firstElementChild || modal;
  const title = card.querySelector('h2, h1');
  if (title && !title.id) title.id = 'dlg-' + Math.random().toString(36).slice(2, 8);
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  if (title) modal.setAttribute('aria-labelledby', title.id);
  const prev = document.activeElement;
  const focusables = () => [...modal.querySelectorAll('button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])')].filter((e) => !e.disabled);
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && onEsc) { e.preventDefault(); onEsc(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  setTimeout(() => { const f = modal.querySelector('.btn.primary') || focusables()[0]; if (f) f.focus({ preventScroll: true }); }, 60);
  // quando la finestra si chiude, il fuoco torna dov'era
  new MutationObserver((_, ob) => { if (!modal.isConnected) { ob.disconnect(); if (prev && prev.isConnected) prev.focus({ preventScroll: true }); } }).observe(document.body, { childList: true, subtree: true });
  return modal;
}
