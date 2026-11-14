// Animazione d'apertura: tutto il cast entra in scena con una reazione a catena di fisica,
// poi salta su una grande parabola (l'“Arc” di PhisiArc). Ogni fotogramma è una funzione del tempo t,
// così "Salta" porta subito alla scena finale.
import { charSVG } from './cast.js';

const NS = 'http://www.w3.org/2000/svg';
const cl = (u) => Math.max(0, Math.min(1, u));
const seg = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, u) => a + (b - a) * u;
const eOut = (u) => 1 - (1 - u) ** 3;
const eInOut = (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2);
const eBack = (u) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2; };

// Ordine dei mondi: è anche l'ordine sulla parabola finale.
const ORDER = ['ampolla', 'tic', 'mela', 'goccia', 'boing', 'termo', 'lampo', 'iride', 'saturnino', 'elettra', 'attimo', 'lux', 'carica'];
const SKY = new Set(['saturnino', 'elettra', 'lux']);

// Tempi (secondi)
const T = {
  ground: [0, 0.7], count: 1.2, via: 2.1, fall: [2.1, 2.7], fly: [2.7, 4.3], lux: [2.9, 3.45], ray: [3.2, 3.45], fan: [3.45, 3.8],
  wire: [3.0, 3.35], lit: 3.7, splash: 4.3, out: [4.6, 4.95], fade: [4.9, 5.4], arch: [5.0, 5.8], jump: 5.5, gap: 0.08, jumpDur: 0.62,
  boss: [7.0, 7.55], bubble: [7.6, 8.9], title: [8.7, 9.7], tag: [9.5, 10.1], end: 10.2,
};

export function playIntro({ onDone } = {}) {
  const vw = Math.max(320, window.innerWidth), vh = Math.max(320, window.innerHeight);
  const W = 1000, H = Math.round(Math.min(2400, Math.max(560, (W * vh) / vw)));
  const portrait = H > 900;
  const G = Math.round(H * 0.8);
  const S = portrait ? 112 : 92, sc = S / 120;
  const fs = portrait ? 1.8 : 1; // testi più grandi sul telefono

  // ---------- contenitore ----------
  const ov = document.createElement('div');
  ov.className = 'intro-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Animazione di apertura di PhisiArc');
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('class', 'intro-svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<defs><pattern id="ig" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.3" fill="var(--edge)"/></pattern>
    <marker id="ia" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 L8 5 L1 9" fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <rect width="${W}" height="${H}" fill="url(#ig)" opacity=".55"/>`;
  const skip = Object.assign(document.createElement('button'), { className: 'btn ghost intro-skip', type: 'button', textContent: 'Salta ›' });
  const enter = Object.assign(document.createElement('button'), { className: 'btn primary intro-enter', type: 'button', textContent: 'Entra nel gioco' });
  ov.append(svg, skip, enter);
  document.body.append(ov);
  document.body.classList.add('intro-open');

  const el = (tag, attrs = {}, parent = svg) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    parent.append(e);
    return e;
  };
  const set = (e, attrs) => { for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); };
  const op = (e, o) => { e.style.opacity = o <= 0.001 ? 0 : o.toFixed(3); };

  // ---------- scena fissa ----------
  const gLine = el('path', { d: `M0 ${G} H${W}`, stroke: 'var(--chalk)', 'stroke-width': 2.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, fill: 'none' });
  const hatch = el('path', { d: Array.from({ length: 26 }, (_, i) => `M${20 + i * 38} ${G + 8} l-12 12`).join(' '), stroke: 'var(--edge)', 'stroke-width': 2, 'stroke-linecap': 'round' });
  const xs = { ampolla: 70, tic: 155, attimo: 240, boing: 345, carica: 450, lampo: 535, termo: 615, goccia: 715, iride: 845 };
  if (portrait) for (const k in xs) xs[k] = Math.round(48 + (xs[k] - 70) * 1.08);
  const pool = el('g');
  el('ellipse', { cx: xs.goccia, cy: G, rx: 62, ry: 10, fill: 'var(--sky)', 'fill-opacity': .14, stroke: 'var(--sky)', 'stroke-width': 2.5 }, pool);
  el('path', { d: `M${xs.goccia - 40} ${G} q10 -4 20 0 t20 0 t20 0 t20 0`, stroke: 'var(--sky)', 'stroke-opacity': .6, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, pool);

  // arco finale (parabola esatta: Bézier quadratica)
  const apexY = Math.max(S * 1.15 + 20, H * (portrait ? 0.32 : 0.22)), A = G - apexY;
  const ax0 = 60, ax1 = 940;
  const arch = el('path', { d: `M${ax0} ${G} Q500 ${G - 2 * A} ${ax1} ${G}`, stroke: 'var(--sky)', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1 });
  const archTicks = el('g', { stroke: 'var(--sky)', 'stroke-opacity': .5, 'stroke-width': 2, 'stroke-linecap': 'round' });
  // posti sulla parabola a uguale distanza lungo la curva
  const bez = (u) => ({ x: (1 - u) ** 2 * ax0 + 2 * u * (1 - u) * 500 + u * u * ax1, y: (1 - u) ** 2 * G + 2 * u * (1 - u) * (G - 2 * A) + u * u * G });
  const samples = [{ u: 0, L: 0, ...bez(0) }];
  for (let i = 1; i <= 400; i++) { const p = bez(i / 400), q = samples[i - 1]; samples.push({ u: i / 400, L: q.L + Math.hypot(p.x - q.x, p.y - q.y), ...p }); }
  const Ltot = samples[400].L;
  const spots = ORDER.map((_, i) => { const L = (Ltot * (i + 0.5)) / ORDER.length; const s = samples.find((p) => p.L >= L); return { x: s.x, y: s.y }; });
  const Sa = Math.min(portrait ? 175 : S, (Ltot / ORDER.length) * 1.02), sa = Sa / 120;
  const Sb = portrait ? 160 : S, sb = Sb / 120;
  spots.forEach((p) => el('path', { d: `M${p.x} ${p.y + 6} v8`, }, archTicks));

  // effetti
  const fx = el('g');
  const trail = el('polyline', { fill: 'none', stroke: 'var(--sky)', 'stroke-width': 2.5, 'stroke-dasharray': '7 9', 'stroke-linecap': 'round' }, fx);
  const fallGhosts = Array.from({ length: 9 }, () => el('circle', { r: S * 0.27, fill: 'none', stroke: 'var(--coral)', 'stroke-width': 2, 'stroke-dasharray': '5 6' }, fx));
  const flyDots = Array.from({ length: 15 }, () => el('circle', { r: 4, fill: 'var(--chalk)' }, fx));
  const gLab = el('text', { class: 'intro-mono', fill: 'var(--coral)', 'font-size': 20 * fs }, fx); gLab.textContent = 'g ↓';
  const vec = el('line', { stroke: 'var(--orange)', 'stroke-width': 3, 'stroke-linecap': 'round', 'marker-end': 'url(#ia)' }, fx);
  const vLab = el('text', { class: 'intro-mono', fill: 'var(--orange)', 'font-size': 20 * fs }, fx); vLab.textContent = 'v';
  const luxLine = el('line', { stroke: 'var(--sun)', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-opacity': .45 }, fx);
  const wire = el('path', { fill: 'none', stroke: 'var(--chalk)', 'stroke-width': 2.4, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1 }, fx);
  const sparks = Array.from({ length: 3 }, () => el('circle', { r: 4.5, fill: 'var(--sun)' }, fx));
  const glow = el('circle', { fill: 'var(--sun)', 'fill-opacity': .13 }, fx);
  const ray = el('path', { fill: 'none', stroke: 'var(--chalk)', 'stroke-width': 3, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1 }, fx);
  const fanCols = ['--coral', '--orange', '--sun', '--green', '--sky'];
  const fan = fanCols.map((c) => el('path', { fill: 'none', stroke: `var(${c})`, 'stroke-width': 2.6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1 }, fx));
  const drops = Array.from({ length: 8 }, (_, i) => ({ e: el('circle', { r: 4, fill: 'none', stroke: 'var(--sky)', 'stroke-width': 2 }, fx), a: (-155 + (i * 130) / 7) * Math.PI / 180, v: 300 + (i % 3) * 70 }));
  const ripples = [0, 0.16].map((d) => ({ d, e: el('ellipse', { cx: xs.goccia, cy: G, fill: 'none', stroke: 'var(--sky)', 'stroke-width': 2 }, fx) }));
  const speed = ['vetrino', 'bilancia'].map(() => el('path', { fill: 'none', stroke: 'var(--chalk)', 'stroke-opacity': .5, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, fx));
  const count = el('text', { class: 'intro-mono', 'text-anchor': 'middle', 'font-size': 38 * fs, 'font-weight': 500 }, fx);

  // personaggi
  const layer = el('g');
  const actors = {};
  const mk = (id) => {
    const g = el('g', {}, layer);
    g.innerHTML = charSVG(id);
    const s = g.firstElementChild;
    set(s, { x: -60, y: -112, width: 120, height: 120, overflow: 'visible' });
    g.style.display = 'none';
    return (actors[id] = { id, g, shown: false });
  };
  [...ORDER, 'vetrino', 'bilancia'].forEach(mk);

  // fumetto e titolo
  const bubble = el('g');
  const bw = 270 * fs, bh = 86 * fs, bx = Math.max(16, (portrait ? 230 : 250) - 60 * fs), by = G - Sb - bh - 14;
  el('path', { d: `M${bx + 18} ${by} H${bx + bw - 18} q18 0 18 18 V${by + bh - 18} q0 18 -18 18 H${bx + 70} l-26 22 l4 -22 H${bx + 18} q-18 0 -18 -18 V${by + 18} q0 -18 18 -18 Z`, fill: 'var(--surface)', stroke: '#b9a4ff', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, bubble);
  const b1 = el('text', { x: bx + 22, y: by + 36 * fs, class: 'intro-mono', 'font-size': 21 * fs, fill: 'var(--chalk)' }, bubble); b1.textContent = 'Ne siete sicuri?';
  const b2 = el('text', { x: bx + 22, y: by + 68 * fs, class: 'intro-mono', 'font-size': 21 * fs, fill: '#b9a4ff' }, bubble); b2.textContent = 'Controlliamo!';
  const titleY = G - (portrait ? 0.3 : 0.35) * A, tsize = portrait ? 118 : 100;
  const title = el('text', { x: 500, y: titleY, 'text-anchor': 'middle', class: 'intro-title', 'font-size': tsize, 'stroke-width': 2.2, 'stroke-dasharray': 700, 'stroke-linejoin': 'round' });
  title.innerHTML = `<tspan fill="var(--chalk)" stroke="var(--chalk)">Phisi</tspan><tspan fill="var(--sky)" stroke="var(--sky)">Arc</tspan>`;
  const tag = el('text', { x: 500, y: titleY + 56 * fs, 'text-anchor': 'middle', class: 'intro-tag', 'font-size': 28 * fs, fill: 'var(--muted)' });
  tag.innerHTML = `Prevedi. Prova. <tspan fill="var(--sky)">Scopri.</tspan>`;

  // ---------- fisica della reazione a catena ----------
  const headY = G - 0.81 * S;            // punto in cui Mela tocca la testa di Boing
  const fallTop = -70, tf = T.fall[1] - T.fall[0];
  const g1 = (2 * (headY - fallTop)) / (tf * tf);
  const fly = { x0: xs.boing, y0: headY, x1: xs.goccia, y1: G + 4, T: T.fly[1] - T.fly[0] };
  const hap = Math.min(fly.y0 - S * 0.9, fly.y0 * 0.55); // quota del vertice sopra il lancio
  {
    const dy = fly.y1 - fly.y0, Tt = fly.T, r = Math.sqrt(2 * hap);
    const s = (r * Tt + Math.sqrt(2 * hap * Tt * Tt + 2 * Tt * Tt * dy)) / (Tt * Tt);
    fly.g = s * s; fly.vy = -r * s; fly.vx = (fly.x1 - fly.x0) / Tt;
  }
  const flyAt = (tau) => ({ x: fly.x0 + fly.vx * tau, y: fly.y0 + fly.vy * tau + 0.5 * fly.g * tau * tau });
  const lyY = H * (portrait ? 0.34 : 0.3);
  const sky = { saturnino: { x: 860, y: H * (portrait ? 0.2 : 0.24) }, elettra: { x: 150, y: H * (portrait ? 0.24 : 0.27) } };
  const meX = portrait ? xs.goccia - 85 : 640; // dove Mela si siede dopo il tuffo

  // raggio di luce verso Iride e ventaglio di colori in uscita (coordinate prese dal disegno di Iride)
  const ip = (x, y) => [xs.iride + (x - 60) * sc, G + (y - 112) * sc];
  const [rx1, ry1] = ip(2, 66);
  set(ray, { d: `M${xs.iride - 150} ${lyY} L${rx1} ${ry1}` });
  [46, 54, 62, 70, 78].forEach((y, i) => {
    const [x0, y0] = ip(118, y), [xa, ya] = ip(80 + i, 60 + i * 3);
    const k = (W + 20 - x0) / (x0 - xa);
    set(fan[i], { d: `M${x0} ${y0} L${W + 20} ${y0 + (y0 - ya) * k * 1.3}` });
  });
  // filo da Carica a Lampo
  const [wx0, wy0] = [xs.carica + 27 * sc, G - 60 * sc], [wx1, wy1] = [xs.lampo - 10 * sc, G - 10 * sc];
  set(wire, { d: `M${wx0} ${wy0} C${wx0 + 40} ${wy0}, ${wx0 + 20} ${G - 3}, ${(wx0 + wx1) / 2} ${G - 3} S${wx1 - 12} ${wy1}, ${wx1} ${wy1}` });

  // posizione "a casa" di ogni personaggio prima del salto sulla parabola
  const appear = { ampolla: 0.5, tic: 0.65, attimo: 0.8, boing: 1.0, carica: 1.2, lampo: 1.35, iride: 1.5, saturnino: 2.8, elettra: 3.05, termo: 3.85, goccia: 4.45, mela: T.fall[0], lux: T.lux[0] };
  function home(id, t) {
    const pop = (t0) => (t < t0 ? 0 : 0.55 + 0.45 * eBack(seg(t, t0, t0 + 0.38)));
    if (id === 'mela') {
      if (t < T.fall[0]) return null;
      if (t < T.fall[1]) { const tau = t - T.fall[0]; return { x: xs.boing, y: fallTop + 0.5 * g1 * tau * tau, k: 1 }; }
      if (t < T.fly[1]) { const p = flyAt(t - T.fly[0]); return { ...p, k: 1, rot: (360 * (t - T.fly[0])) / fly.T }; }
      if (t < T.out[0]) return null; // sott'acqua
      const u = seg(t, T.out[0], T.out[1]);
      return { x: lerp(xs.goccia, meX, u), y: G + 6 - 90 * 4 * u * (1 - u) - 6 * u, k: 1 };
    }
    if (id === 'lux') {
      if (t < T.lux[0]) return null;
      if (t < T.lux[1]) return { x: lerp(-140, W + 140, seg(t, ...T.lux)), y: lyY + 0.45 * S, k: 1 };
      return { x: W + 140, y: lyY + 0.45 * S, k: 1, off: true };
    }
    if (id === 'goccia') {
      const k = pop(appear.goccia); if (!k) return null;
      const u = seg(t, appear.goccia, appear.goccia + 0.45);
      return { x: xs.goccia, y: G - 70 * 4 * u * (1 - u), k };
    }
    if (SKY.has(id)) { const k = pop(appear[id]); if (!k) return null; return { ...sky[id], k }; }
    const k = pop(appear[id]); if (!k) return null;
    const r = { x: xs[id], y: G, k };
    if (id === 'boing' && t >= T.fall[1]) { // la molla si schiaccia e oscilla smorzata
      const tau = t - T.fall[1];
      r.sy = 1 - 0.38 * Math.exp(-4.5 * tau) * Math.cos(15 * tau);
      r.sx = 1 / Math.sqrt(r.sy);
    }
    return r;
  }

  function place(a, p, s) {
    if (!p) { if (a.shown) { a.shown = false; a.g.style.display = 'none'; } return; }
    if (!a.shown) { a.shown = true; a.g.style.display = ''; }
    const k = s * (p.k ?? 1);
    a.g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(p.rot || 0).toFixed(1)} 0 ${-0.45 * S}) scale(${(k * (p.sx || 1)).toFixed(4)} ${(k * (p.sy || 1)).toFixed(4)})`);
  }

  // ---------- fotogramma ----------
  let started = performance.now(), raf = 0, finished = false, closing = false;
  function frame(t) {
    // terreno e piscina
    set(gLine, { 'stroke-dashoffset': 1 - eOut(seg(t, ...T.ground)) });
    op(hatch, seg(t, 0.3, 0.9) * (1 - seg(t, ...T.fade) * 0.4));
    op(pool, seg(t, 0.35, 0.8) * (1 - seg(t, 5.2, 5.8)));

    // conto alla rovescia di Tic
    const ci = t < T.count ? -1 : Math.min(3, Math.floor((t - T.count) / 0.3));
    const labels = ['3', '2', '1', 'via!'];
    if (ci >= 0 && t < T.via + 0.55) {
      const t0 = T.count + ci * 0.3, u = seg(t, t0, t0 + 0.3);
      count.textContent = labels[ci];
      set(count, { x: xs.tic, y: G - S - 18, fill: ci === 3 ? 'var(--orange)' : 'var(--chalk)', transform: `translate(${xs.tic} ${G - S - 30}) scale(${0.7 + 0.3 * eBack(cl(u * 2))}) translate(${-xs.tic} ${-(G - S - 30)})` });
      op(count, ci === 3 ? 1 - seg(t, T.via + 0.3, T.via + 0.55) : 1 - seg(t, t0 + 0.22, t0 + 0.3));
    } else op(count, 0);

    // caduta: ombre stroboscopiche a intervalli di tempo uguali (si allargano: accelera)
    fallGhosts.forEach((c, i) => {
      const tau = (i + 1) * 0.06, tt = T.fall[0] + tau;
      if (tau >= tf) { op(c, 0); return; }
      set(c, { cx: xs.boing, cy: fallTop + 0.5 * g1 * tau * tau - 0.45 * S });
      op(c, t < tt ? 0 : 0.55 * (1 - seg(t, 3.0, 3.6)));
    });
    op(gLab, t > T.fall[1] + 0.25 ? 0 : seg(t, T.fall[0] + 0.1, T.fall[0] + 0.2) * (1 - seg(t, T.fall[1], T.fall[1] + 0.25)));
    set(gLab, { x: xs.boing + S * 0.38, y: Math.max(40, fallTop + 0.5 * g1 * cl((t - T.fall[0]) / tf) ** 2 * tf * tf - 0.4 * S) });

    // volo: scia, punti a tempi uguali (stessa distanza in orizzontale) e vettore velocità
    const tau = cl((t - T.fly[0]) / fly.T) * fly.T;
    if (t >= T.fly[0]) {
      const pts = [];
      for (let i = 0; i <= 40; i++) { const p = flyAt((tau * i) / 40); pts.push(`${p.x.toFixed(1)},${(p.y - 0.45 * S).toFixed(1)}`); }
      set(trail, { points: pts.join(' ') });
    }
    op(trail, t < T.fly[0] ? 0 : 1 - seg(t, ...T.fade));
    flyDots.forEach((d, i) => {
      const td = (i + 1) * (fly.T / 16), p = flyAt(td);
      set(d, { cx: p.x, cy: p.y - 0.45 * S });
      op(d, t < T.fly[0] + td ? 0 : 0.8 * (1 - seg(t, ...T.fade)));
    });
    if (t >= T.fly[0] && t < T.fly[1]) {
      const p = flyAt(tau), vx = fly.vx, vy = fly.vy + fly.g * tau, kk = 0.16;
      const cx = p.x, cy = p.y - 0.45 * S;
      set(vec, { x1: cx, y1: cy, x2: cx + vx * kk, y2: cy + vy * kk });
      set(vLab, { x: cx + vx * kk + 8, y: cy + vy * kk - 8 });
      op(vec, 1 - seg(t, T.fly[1] - 0.12, T.fly[1])); op(vLab, 1 - seg(t, T.fly[1] - 0.12, T.fly[1]));
    } else { op(vec, 0); op(vLab, 0); }

    // Lux attraversa il cielo: la luce va dritta
    const lx = lerp(-140, W + 140, seg(t, ...T.lux));
    set(luxLine, { x1: -10, y1: lyY, x2: lx - 0.3 * S, y2: lyY });
    op(luxLine, t < T.lux[0] ? 0 : 1 - seg(t, T.lux[1], T.lux[1] + 0.5));
    set(ray, { 'stroke-dashoffset': 1 - seg(t, ...T.ray) });
    op(ray, t < T.ray[0] ? 0 : 0.9 * (1 - seg(t, ...T.fade)));
    fan.forEach((f, i) => { set(f, { 'stroke-dashoffset': 1 - eOut(seg(t, T.fan[0] + i * 0.03, T.fan[1])) }); op(f, t < T.fan[0] ? 0 : 1 - seg(t, ...T.fade)); });

    // circuito: il filo si disegna, la corrente scorre, Lampo si accende
    set(wire, { 'stroke-dashoffset': 1 - seg(t, ...T.wire) });
    op(wire, t < T.wire[0] ? 0 : 1 - seg(t, ...T.fade));
    const L = wire.getTotalLength();
    sparks.forEach((s, i) => {
      const u = ((t - T.wire[1]) / 0.5 + i / 3) % 1;
      if (t < T.wire[1] + (i * 0.5) / 3) { op(s, 0); return; }
      const p = wire.getPointAtLength(u * L);
      set(s, { cx: p.x, cy: p.y });
      op(s, 1 - seg(t, ...T.fade));
    });
    const lit = eOut(seg(t, T.lit, T.lit + 0.4)) * (1 - seg(t, ...T.fade));
    set(glow, { cx: xs.lampo, cy: G - 64 * sc, r: S * (0.2 + 0.75 * lit) });
    op(glow, lit);

    // tuffo di Mela: schizzi a parabola e cerchi nell'acqua
    drops.forEach((d) => {
      const tt = t - T.splash;
      if (tt < 0) { op(d.e, 0); return; }
      const x = xs.goccia + Math.cos(d.a) * d.v * tt, y = G - 4 + Math.sin(d.a) * d.v * tt + 0.5 * 1500 * tt * tt;
      set(d.e, { cx: x, cy: y });
      op(d.e, y > G + 2 ? 0 : 1);
    });
    ripples.forEach((r) => {
      const u = seg(t, T.splash + r.d, T.splash + r.d + 0.8);
      set(r.e, { rx: 10 + 100 * eOut(u), ry: 2 + 16 * eOut(u) });
      op(r.e, u <= 0 || u >= 1 ? 0 : 1 - u);
    });

    // la parabola finale si disegna
    set(arch, { 'stroke-dashoffset': 1 - eInOut(seg(t, ...T.arch)) });
    op(archTicks, seg(t, T.arch[1] - 0.2, T.arch[1] + 0.3));

    // personaggi: prima a casa, poi un salto sulla parabola
    ORDER.forEach((id, i) => {
      const a = actors[id], tj = T.jump + i * T.gap, spot = spots[i];
      if (t < tj) { place(a, home(id, t), sc); return; }
      const from = home(id, tj) || { x: id === 'lux' ? W + 140 : 500, y: id === 'lux' ? lyY : G, k: 1 };
      const u = seg(t, tj, tj + T.jumpDur);
      const s = lerp(sc, sa, eInOut(u));
      if (SKY.has(id)) { // nello spazio niente parabola: si va dritti
        const e = eInOut(u);
        place(a, { x: lerp(from.x, spot.x, e), y: lerp(from.y, spot.y, e), k: 1 }, s);
      } else { // a terra: salto balistico (x uniforme, y parabolica)
        const hh = 70 + Math.abs(spot.x - from.x) * 0.12;
        place(a, { x: lerp(from.x, spot.x, u), y: lerp(from.y, spot.y, u) - hh * 4 * u * (1 - u), k: 1, sy: u < 1 ? 1 : 1 - 0.12 * Math.exp(-8 * (t - tj - T.jumpDur)) * Math.cos(20 * (t - tj - T.jumpDur)) }, s);
      }
    });

    // arrivano i boss
    const bossFrom = { vetrino: -160, bilancia: W + 160 }, bossTo = { vetrino: portrait ? 230 : 250, bilancia: portrait ? 770 : 750 };
    ['vetrino', 'bilancia'].forEach((id, i) => {
      const u = eOut(seg(t, T.boss[0] + i * 0.12, T.boss[1] + i * 0.12));
      if (t < T.boss[0] + i * 0.12) { place(actors[id], null); op(speed[i], 0); return; }
      const x = lerp(bossFrom[id], bossTo[id], u);
      place(actors[id], { x, y: G, k: 1 }, sb);
      const dir = i ? 1 : -1, y0 = G - 0.5 * S;
      set(speed[i], { d: `M${x + dir * 0.55 * S} ${y0 - 20} h${dir * 60} M${x + dir * 0.6 * S} ${y0} h${dir * 90} M${x + dir * 0.55 * S} ${y0 + 20} h${dir * 50}` });
      op(speed[i], (1 - u) * 0.9);
    });
    op(bubble, seg(t, T.bubble[0], T.bubble[0] + 0.2) * (1 - seg(t, T.bubble[1] - 0.25, T.bubble[1])));
    {
      const u = eBack(seg(t, T.bubble[0], T.bubble[0] + 0.3));
      const cx = bx + 60, cy = by + bh + 20;
      set(bubble, { transform: `translate(${cx} ${cy}) scale(${0.6 + 0.4 * u}) translate(${-cx} ${-cy})` });
    }

    // titolo che si scrive e motto
    set(title, { 'stroke-dashoffset': 700 * (1 - eInOut(seg(t, T.title[0], T.title[1] - 0.25))) });
    title.style.fillOpacity = seg(t, T.title[1] - 0.45, T.title[1]).toFixed(3);
    op(title, t < T.title[0] ? 0 : 1);
    op(tag, seg(t, ...T.tag));
    set(tag, { transform: `translate(0 ${(12 * (1 - eOut(seg(t, ...T.tag)))).toFixed(1)})` });
    enter.classList.toggle('show', t >= T.tag[0]);
    skip.classList.toggle('hide', t >= T.end);
  }

  function loop(now) {
    const t = (now - started) / 1000;
    frame(Math.min(t, T.end + 0.6));
    if (t < T.end + 0.6) raf = requestAnimationFrame(loop);
    else finished = true;
  }
  raf = requestAnimationFrame(loop);
  frame(0);

  // ---------- uscita ----------
  const toEnd = () => { started = performance.now() - (T.end + 0.6) * 1000; if (finished) frame(T.end + 0.6); };
  function close() {
    if (closing) return;
    closing = true;
    cancelAnimationFrame(raf);
    ov.classList.add('out');
    document.body.classList.remove('intro-open');
    window.removeEventListener('keydown', onKey);
    setTimeout(() => { ov.remove(); onDone && onDone(); }, 450);
  }
  const elapsed = () => (performance.now() - started) / 1000;
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elapsed() < T.end ? toEnd() : close(); }
  };
  window.addEventListener('keydown', onKey);
  skip.addEventListener('click', (e) => { e.stopPropagation(); close(); });
  enter.addEventListener('click', (e) => { e.stopPropagation(); close(); });
  ov.addEventListener('click', () => (elapsed() < T.end ? toEnd() : close()));
  enter.focus({ preventScroll: true });
  return { close };
}
