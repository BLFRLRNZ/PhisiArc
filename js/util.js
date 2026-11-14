// Piccoli aiuti condivisi.

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

export const tx = (o, lens) => {
  if (o == null) return '';
  if (typeof o === 'string') return o;
  return o[lens] ?? o.s ?? o.e ?? '';
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
  Number(x).toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: 0 });

export const plain = (html) => {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
};

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));
