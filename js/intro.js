// Animazione d'apertura (circa 15 s), in cinque atti. Ogni fotogramma è una funzione del tempo t,
// così "Salta" o un tocco portano subito alla scena finale.
//  1. Il punto: un punto di gesso, un cerchio, un raggio che gira; la sua ombra disegna un'onda (seno).
//     Il cerchio diventa Tic, l'onda diventa la coda di Lux, che scappa via.
//  2. La luce: Lux torna come raggio dritto, entra in Iride ed esce arcobaleno; ogni colore vola
//     in parabola e dove atterra nasce un personaggio.
//  3. La gravità: Mela salta su Boing (con ombre a tempi uguali e vettore velocità) e rimbalza;
//     in cielo le orbite si disegnano e diventano Elettra e Saturnino; arrivano Ampolla e Attimo.
//  4. In fila: tutti saltano sulla linea del terreno, che si piega e diventa la parabola dell'"Arc".
//  5. Arrivano i boss, Vetrino dubita, il titolo si scrive da solo.
import { t as tr } from './i18n.js';
import { charSVG } from './cast.js';

const NS = 'http://www.w3.org/2000/svg';
const cl = (u) => Math.max(0, Math.min(1, u));
const seg = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, u) => a + (b - a) * u;
const eOut = (u) => 1 - (1 - cl(u)) ** 3;
const eInOut = (u) => { u = cl(u); return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2; };
const eBack = (u) => { u = cl(u); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2; };

// Ordine dei mondi: è anche l'ordine sulla parabola finale.
const ORDER = ['ampolla', 'tic', 'mela', 'goccia', 'boing', 'termo', 'lampo', 'iride', 'saturnino', 'elettra', 'attimo', 'lux', 'carica'];

const T = {
  circle: [0.35, 0.95], spin: 0.95, ticFade: [2.7, 3.2], luxBorn: 2.55, luxGo: [3.05, 3.6], ticDown: [3.35, 3.9],
  iride: 3.75, beam: [4.15, 4.6], fan: 4.6, fanDur: 0.85, fanGap: 0.09, fanFade: [6.6, 7.2], luxOut: [5.9, 6.35],
  boing: 6.05, melaJump: [6.5, 7.3], melaBounce: [7.3, 7.95], nucleus: 6.4, orbits: [6.5, 7.2], elettra: [7.15, 7.5],
  saturn: [6.85, 7.35], ring: [7.2, 7.6], saturnino: [7.5, 7.85], ampolla: 7.85, attimo: 8.05, flip: [8.3, 8.8],
  regroup: 8.9, gap: 0.075, hop: 0.62, bend: [10.35, 11.6], boss: [11.35, 11.9], bubble: [12.0, 13.25],
  title: [13.0, 14.15], tag: [13.95, 14.55], end: 15.0,
};

export function playIntro({ onDone } = {}) {
  const vw = Math.max(320, window.innerWidth), vh = Math.max(320, window.innerHeight);
  const W = 1000, H = Math.round(Math.min(2400, Math.max(560, (W * vh) / vw)));
  const portrait = H > 900;
  const G = Math.round(H * 0.8);
  const S = portrait ? 112 : 90, sc = S / 120;
  const fs = portrait ? 1.8 : 1;

  // ---------- contenitore ----------
  const ov = document.createElement('div');
  ov.className = 'intro-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', tr('Animazione di apertura di PhisiArc'));
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('class', 'intro-svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<defs><pattern id="ig" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.3" fill="var(--edge)"/></pattern>
    <radialGradient id="ivig" cx="50%" cy="45%" r="75%"><stop offset="55%" stop-color="#0a0f1c" stop-opacity="0"/><stop offset="100%" stop-color="#05080f" stop-opacity=".85"/></radialGradient></defs>`;
  const skip = Object.assign(document.createElement('button'), { className: 'btn ghost intro-skip', type: 'button', textContent: tr('Salta ›') });
  const enter = Object.assign(document.createElement('button'), { className: 'btn primary intro-enter', type: 'button', textContent: tr('Entra nel gioco') });
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
  const stroke = (c, w = 2.5, extra = {}) => ({ fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra });
  const pts = (arr) => arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  // la "telecamera": all'inizio è vicinissima al punto, poi si allarga
  const grid = el('rect', { x: -W, y: -H, width: 3 * W, height: 3 * H, fill: 'url(#ig)', opacity: 0.5 });
  const world = el('g');
  el('rect', { width: W, height: H, fill: 'url(#ivig)', 'pointer-events': 'none' });
  const E = (tag, attrs) => el(tag, attrs, world);

  // ---------- posti finali: la parabola dell'Arc ----------
  const apexY = Math.max(S * 1.15 + 20, H * (portrait ? 0.32 : 0.22)), A = G - apexY;
  const ax0 = 60, ax1 = 940;
  const archY = (x, m) => { const u = (x - ax0) / (ax1 - ax0); return G - 4 * A * m * u * (1 - u); };
  const samples = [{ x: ax0, L: 0 }];
  for (let i = 1; i <= 400; i++) {
    const x = ax0 + ((ax1 - ax0) * i) / 400, p = samples[i - 1];
    samples.push({ x, L: p.L + Math.hypot(x - p.x, archY(x, 1) - archY(p.x, 1)) });
  }
  const Ltot = samples[400].L;
  const spotX = ORDER.map((_, i) => samples.find((p) => p.L >= (Ltot * (i + 0.5)) / ORDER.length).x);
  const Sa = Math.min(portrait ? 175 : S, (Ltot / ORDER.length) * 1.02), sa = Sa / 120;
  let minGap = 1e9;
  for (let i = 1; i < spotX.length; i++) minGap = Math.min(minGap, spotX[i] - spotX[i - 1]);
  const sl = Math.min(sc, (minGap * 1.35) / 120);               // grandezza sulla linea piatta
  const Sb = portrait ? 160 : S, sb = Sb / 120;

  // ---------- atto 1: il punto, il cerchio, l'onda ----------
  const O = { x: portrait ? 330 : 300, y: G - (portrait ? 330 : 200) }, R = portrait ? 78 : 60;
  const omega = (2 * Math.PI) / 1.15, vw0 = portrait ? 240 : 270, xp = O.x + R + 46;
  const ground = E('path', stroke('var(--chalk)', 2.5, { d: `M${W / 2} ${G} H${W + 40} M${W / 2} ${G} H-40`, pathLength: 1, 'stroke-dasharray': 1 }));
  const hatch = E('path', stroke('var(--edge)', 2, { d: Array.from({ length: 28 }, (_, i) => `M${10 + i * 37} ${G + 8} l-12 12`).join(' ') }));
  const axis = E('path', stroke('var(--edge)', 1.6, { d: `M${O.x - R - 24} ${O.y} H${W + 20}`, 'stroke-dasharray': '4 7' }));
  const circle = E('circle', stroke('var(--chalk)', 2.6, { cx: O.x, cy: O.y, r: R, pathLength: 1, 'stroke-dasharray': 1 }));
  const ticks = E('path', stroke('var(--chalk)', 2, { d: Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${O.x + Math.sin(a) * R * 0.78} ${O.y - Math.cos(a) * R * 0.78} L${O.x + Math.sin(a) * R * 0.66} ${O.y - Math.cos(a) * R * 0.66}`; }).join(' ') }));
  const angArc = E('path', stroke('var(--sun)', 2));
  const radius = E('line', stroke('var(--chalk)', 2.2));
  const proj = E('line', stroke('var(--sky)', 1.6, { 'stroke-dasharray': '3 6' }));
  const wave = E('polyline', stroke('var(--sky)', 3));
  const dotO = E('circle', { r: 4.5, fill: 'var(--chalk)', cx: O.x, cy: O.y });
  const dotP = E('circle', { r: 6, fill: 'var(--sky)' });
  const sinLab = E('text', { class: 'intro-mono', 'font-size': 20 * fs, fill: 'var(--sky)' }); sinLab.textContent = 'y = sin(ωt)';

  // ---------- atto 2: la luce ----------
  const XI = portrait ? 560 : 600;
  const ip = (x, y) => [XI + (x - 60) * sc, G + (y - 112) * sc];
  const B0 = [-60, H * (portrait ? 0.16 : 0.08)], B1 = ip(2, 66);
  const beam = E('line', stroke('var(--chalk)', 3, { x1: B0[0], y1: B0[1] }));
  const fanCols = ['--coral', '--orange', '--sun', '--green', '--sky'];
  const fanWho = ['mela', 'termo', 'lampo', 'carica', 'goccia'];
  const fanX = portrait ? [690, 750, 815, 880, 945] : [700, 760, 820, 880, 940];
  const fan = fanCols.map((c, i) => {
    const [x0, y0] = ip(118, 46 + i * 8), h = (portrait ? 170 : 110) + i * (portrait ? 34 : 22);
    const path = (u) => [lerp(x0, fanX[i], u), lerp(y0, G, u) - 4 * h * u * (1 - u)];
    return { c, path, line: E('polyline', stroke(`var(${c})`, 2.6)), head: E('circle', { r: 5, fill: `var(${c})` }), ring: E('ellipse', stroke(`var(${c})`, 2, { cx: fanX[i], cy: G })) };
  });

  // ---------- atto 3: gravità e orbite ----------
  const XB = portrait ? 150 : 165, headY = G - 0.81 * S, XM = XB + (portrait ? 92 : 78);
  const jump = { x0: fanX[0], x1: XB, y0: G, y1: headY, h: portrait ? 330 : 230 };
  const jumpAt = (u) => [lerp(jump.x0, jump.x1, u), lerp(jump.y0, jump.y1, u) - 4 * jump.h * u * (1 - u)];
  const melaTrail = E('polyline', stroke('var(--sky)', 2.2, { 'stroke-dasharray': '6 8' }));
  const strobe = Array.from({ length: 10 }, () => E('circle', { r: 3.4, fill: 'var(--chalk)' }));
  const vec = E('path', stroke('var(--orange)', 3));
  const vLab = E('text', { class: 'intro-mono', 'font-size': 20 * fs, fill: 'var(--orange)' }); vLab.textContent = 'v';
  const EL = portrait ? { x: 640, y: G - 900 } : { x: 840, y: H * 0.2 };
  const SAT = portrait ? { x: 240, y: G - 980 } : { x: 430, y: H * 0.17 };
  const nucleus = E('circle', { r: 7, fill: 'var(--sky)', cx: EL.x, cy: EL.y });
  const orbits = [0, 60, -60].map((r) => E('ellipse', stroke('var(--chalk)', 2, { cx: EL.x, cy: EL.y, rx: 48 * sc, ry: 15 * sc, transform: `rotate(${r} ${EL.x} ${EL.y})`, pathLength: 1, 'stroke-dasharray': 1 })));
  const satBody = E('circle', stroke('#a9b8ff', 2.6, { cx: SAT.x, cy: SAT.y, r: 28 * sc, pathLength: 1, 'stroke-dasharray': 1 }));
  const satRing = E('ellipse', stroke('var(--sun)', 3, { cx: SAT.x, cy: SAT.y + 8 * sc, rx: 48 * sc, ry: 12 * sc, transform: `rotate(-12 ${SAT.x} ${SAT.y + 8 * sc})`, pathLength: 1, 'stroke-dasharray': 1 }));

  // ---------- atto 4: la parabola ----------
  const arch = E('path', stroke('var(--sky)', 3));
  const archTicks = E('path', stroke('var(--sky)', 2, { 'stroke-opacity': .55 }));

  // ---------- personaggi ----------
  const layer = el('g', {}, world);
  const actors = {};
  [...ORDER, 'vetrino', 'bilancia'].forEach((id) => {
    const g = el('g', {}, layer);
    g.innerHTML = charSVG(id);
    set(g.firstElementChild, { x: -60, y: -112, width: 120, height: 120, overflow: 'visible' });
    g.style.display = 'none';
    actors[id] = { g, shown: false };
  });
  function place(id, p) {
    const a = actors[id];
    if (!p) { if (a.shown) { a.shown = false; a.g.style.display = 'none'; } return; }
    if (!a.shown) { a.shown = true; a.g.style.display = ''; }
    const k = p.s, cy = p.cy ?? 0.45 * 120 * k;
    a.g.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(p.rot || 0).toFixed(1)} 0 ${(-cy).toFixed(1)}) scale(${(k * (p.sx || 1)).toFixed(4)} ${(k * (p.sy || 1)).toFixed(4)})`);
    a.g.style.opacity = p.o == null ? '' : cl(p.o).toFixed(3);
  }
  const pop = (t, t0, s) => (t < t0 ? 0 : s * (0.5 + 0.5 * eBack(seg(t, t0, t0 + 0.42))));

  // ---------- fumetto, titolo, motto ----------
  const bubble = el('g', {}, world);
  const bw = 270 * fs, bh = 86 * fs, bx = Math.max(16, (portrait ? 230 : 250) - 60 * fs), by = G - Sb - bh - 14;
  el('path', { d: `M${bx + 18} ${by} H${bx + bw - 18} q18 0 18 18 V${by + bh - 18} q0 18 -18 18 H${bx + 70} l-26 22 l4 -22 H${bx + 18} q-18 0 -18 -18 V${by + 18} q0 -18 18 -18 Z`, fill: 'var(--surface)', stroke: '#b9a4ff', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, bubble);
  const b1 = el('text', { x: bx + 22, y: by + 36 * fs, class: 'intro-mono', 'font-size': 21 * fs, fill: 'var(--chalk)' }, bubble); b1.textContent = 'Ne siete sicuri?';
  const b2 = el('text', { x: bx + 22, y: by + 68 * fs, class: 'intro-mono', 'font-size': 21 * fs, fill: '#b9a4ff' }, bubble); b2.textContent = 'Controlliamo!';
  const speed = [0, 1].map(() => el('path', stroke('var(--chalk)', 2.4, { 'stroke-opacity': .5 }), world));
  const titleY = G - (portrait ? 0.3 : 0.35) * A, tsize = portrait ? 118 : 100;
  const title = el('text', { x: 500, y: titleY, 'text-anchor': 'middle', class: 'intro-title', 'font-size': tsize, 'stroke-width': 2.2, 'stroke-dasharray': 700, 'stroke-linejoin': 'round' }, world);
  title.innerHTML = `<tspan fill="var(--chalk)" stroke="var(--chalk)">Phisi</tspan><tspan fill="var(--sky)" stroke="var(--sky)">Arc</tspan>`;
  const tag = el('text', { x: 500, y: titleY + 56 * fs, 'text-anchor': 'middle', class: 'intro-tag', 'font-size': 28 * fs, fill: 'var(--muted)' }, world);
  tag.innerHTML = `Prevedi. Prova. <tspan fill="var(--sky)">Scopri.</tspan>`;

  // ---------- dove sta ogni personaggio prima di mettersi in fila ----------
  const sky = (p, s) => ({ x: p.x, y: p.y + 52 * s, s, cy: 52 * s });
  const fanLand = (i) => T.fan + i * T.fanGap + T.fanDur;
  function home(id, t) {
    switch (id) {
      case 'tic': {
        if (t < T.ticFade[0]) return null;
        const s0 = R / 34, o = seg(t, ...T.ticFade);
        if (t < T.ticDown[0]) return { x: O.x, y: O.y + 44 * s0, s: s0, o, cy: 44 * s0 };
        const u = seg(t, ...T.ticDown), s = lerp(s0, sc, eInOut(u));
        return { x: O.x, y: lerp(O.y + 44 * s0, G, u * u), s, cy: 44 * s }; // cade: accelera
      }
      case 'lux': {
        if (t < T.luxBorn) return null;
        if (t < T.luxGo[1]) { // in testa all'onda, poi scappa via a destra
          const head = waveHead(t);
          return { x: head[0] + 22 * sc, y: head[1] + 52 * sc, s: pop(t, T.luxBorn, sc), cy: 52 * sc };
        }
        if (t < T.beam[0]) return null;
        if (t < T.beam[1]) { // torna come raggio dritto, dall'alto a sinistra fino a Iride
          const u = seg(t, ...T.beam), x = lerp(B0[0], B1[0], u), y = lerp(B0[1], B1[1], u);
          const ang = (Math.atan2(B1[1] - B0[1], B1[0] - B0[0]) * 180) / Math.PI;
          return { x: x - 18 * sc, y: y + 52 * sc, s: sc * (u > 0.85 ? lerp(1, 0.2, seg(u, 0.85, 1)) : 1), rot: ang, cy: 52 * sc };
        }
        if (t < T.luxOut[0]) return null;
        const u = seg(t, ...T.luxOut);
        return { x: lerp(XI, XI - (portrait ? 95 : 85), u), y: G - (portrait ? 150 : 110) * 4 * u * (1 - u), s: pop(t, T.luxOut[0], sc) };
      }
      case 'iride': return t < T.iride ? null : { x: XI, y: G, s: pop(t, T.iride, sc) };
      case 'mela': {
        const t0 = fanLand(0) - 0.05;
        if (t < t0) return null;
        if (t < T.melaJump[0]) return { x: fanX[0], y: G, s: pop(t, t0, sc) };
        if (t < T.melaJump[1]) { const u = seg(t, ...T.melaJump), [x, y] = jumpAt(u); return { x, y, s: sc, rot: -200 * u }; }
        const u = seg(t, ...T.melaBounce); // rimbalzo sulla molla, poi giù a terra accanto
        return { x: lerp(XB, XM, u), y: lerp(headY, G, u) - 150 * 4 * u * (1 - u), s: sc };
      }
      case 'termo': case 'lampo': case 'carica': case 'goccia': {
        const i = fanWho.indexOf(id), t0 = fanLand(i) - 0.05;
        return t < t0 ? null : { x: fanX[i], y: G, s: pop(t, t0, sc) };
      }
      case 'boing': {
        if (t < T.boing) return null;
        const r = { x: XB, y: G, s: pop(t, T.boing, sc) };
        if (t >= T.melaJump[1]) { const tau = t - T.melaJump[1]; r.sy = 1 - 0.36 * Math.exp(-4.2 * tau) * Math.cos(15 * tau); r.sx = 1 / Math.sqrt(r.sy); }
        return r;
      }
      case 'elettra': return t < T.elettra[0] ? null : { ...sky(EL, sc), o: seg(t, ...T.elettra) };
      case 'saturnino': return t < T.saturnino[0] ? null : { ...sky(SAT, sc), o: seg(t, ...T.saturnino) };
      case 'ampolla': return t < T.ampolla ? null : { x: portrait ? 55 : 70, y: G, s: pop(t, T.ampolla, sc) };
      case 'attimo': {
        if (t < T.attimo) return null;
        return { x: portrait ? 430 : 420, y: G, s: pop(t, T.attimo, sc), rot: 360 * eInOut(seg(t, ...T.flip)), cy: 53 * sc }; // una capriola: il tempo si gira
      }
    }
    return null;
  }

  // l'onda: il punto che gira lascia la sua ombra su un foglio che scorre a destra
  const tSpinEnd = T.luxGo[0];
  function waveAt(t) {
    const arr = [], tt = Math.min(t, tSpinEnd), go = t > T.luxGo[0] ? (t - T.luxGo[0]) ** 2 * 2600 : 0;
    for (let i = 0; i <= 90; i++) {
      const tau = lerp(T.spin, tt, i / 90);
      arr.push([xp + (tt - tau) * vw0 + go, O.y - R * Math.sin(omega * (tau - T.spin))]);
    }
    return arr;
  }
  const waveHead = (t) => { const w = waveAt(t); return w[0][0] > w[90][0] ? w[0] : w[90]; };

  // ---------- telecamera: tappe [tempo, zoom, centro x, centro y] ----------
  // Sul telefono segue l'azione (luce, arcobaleno, salto di Mela, cielo) e poi si allarga sulla parabola.
  const CAM = portrait ? [
    [0.2, 2.6, O.x, O.y], [3.0, 1.75, O.x + 60, O.y], [4.1, 1.6, 560, G - 430], [5.3, 1.6, 720, G - 330],
    [6.4, 1.5, 420, G - 560], [7.6, 1.5, 380, G - 560], [8.6, 1.45, 330, G - 380], [10.2, 1, W / 2, H / 2],
  ] : [[0.2, 2.3, O.x, O.y], [3.4, 1, W / 2, H / 2]];
  function cam(t) {
    if (t <= CAM[0][0]) return CAM[0].slice(1);
    for (let i = 1; i < CAM.length; i++) {
      if (t <= CAM[i][0]) {
        const a = CAM[i - 1], b = CAM[i], u = eInOut((t - a[0]) / (b[0] - a[0]));
        return [lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)];
      }
    }
    return CAM[CAM.length - 1].slice(1);
  }

  // ---------- fotogramma ----------
  let started = performance.now(), raf = 0, finished = false, closing = false;
  function frame(t) {
    // telecamera: parte vicinissima al punto e si allarga
    const [k, cx, cy] = cam(t);
    world.setAttribute('transform', `translate(${W / 2} ${H / 2}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
    grid.setAttribute('transform', world.getAttribute('transform'));

    // atto 1
    set(ground, { 'stroke-dashoffset': 1 - eOut(seg(t, 0.15, 1.4)) });
    op(hatch, seg(t, 0.9, 1.6));
    op(dotO, seg(t, 0, 0.25) * (1 - seg(t, ...T.ticFade)));
    set(circle, { 'stroke-dashoffset': 1 - eInOut(seg(t, ...T.circle)) });
    op(circle, 1 - seg(t, ...T.ticFade));
    op(axis, seg(t, 0.8, 1.2) * (1 - seg(t, 3.2, 3.8)));
    op(ticks, seg(t, 2.25, 2.6) * (1 - seg(t, ...T.ticFade)));
    const spinning = t >= T.spin && t < T.ticFade[1];
    const phi = omega * (Math.min(t, tSpinEnd) - T.spin);
    const P = [O.x + R * Math.cos(phi), O.y - R * Math.sin(phi)];
    if (spinning) {
      set(radius, { x1: O.x, y1: O.y, x2: P[0], y2: P[1] });
      set(dotP, { cx: P[0], cy: P[1] });
      set(proj, { x1: P[0], y1: P[1], x2: xp, y2: P[1] });
      const a = phi % (2 * Math.PI), r0 = 20;
      set(angArc, { d: `M${O.x + r0} ${O.y} A${r0} ${r0} 0 ${a > Math.PI ? 1 : 0} 0 ${O.x + r0 * Math.cos(a)} ${O.y - r0 * Math.sin(a)}` });
    }
    const fadeSpin = (t < T.spin ? 0 : 1) * (1 - seg(t, ...T.ticFade));
    [radius, dotP, angArc].forEach((e) => op(e, fadeSpin));
    op(proj, (t < T.spin ? 0 : 1) * (1 - seg(t, T.luxGo[0], T.luxGo[0] + 0.2)));
    if (t >= T.spin) set(wave, { points: pts(waveAt(t)) });
    op(wave, t < T.spin ? 0 : 1 - seg(t, T.luxGo[1] - 0.15, T.luxGo[1]));
    set(sinLab, { x: O.x - R, y: O.y - R - 22 });
    op(sinLab, seg(t, 1.6, 2.0) * (1 - seg(t, 2.9, 3.2)));

    // atto 2: raggio di luce, arcobaleno, parabole colorate
    if (t >= T.beam[0]) {
      const u = seg(t, ...T.beam);
      set(beam, { x2: lerp(B0[0], B1[0], u), y2: lerp(B0[1], B1[1], u) });
    }
    op(beam, t < T.beam[0] ? 0 : 0.9 * (1 - seg(t, ...T.fanFade)));
    fan.forEach((F, i) => {
      const t0 = T.fan + i * T.fanGap, u = seg(t, t0, t0 + T.fanDur);
      const arr = []; const n = Math.max(2, Math.round(40 * u));
      for (let j = 0; j <= n; j++) arr.push(F.path((u * j) / n));
      set(F.line, { points: pts(arr) });
      op(F.line, t < t0 ? 0 : 1 - seg(t, ...T.fanFade));
      const hd = F.path(u);
      set(F.head, { cx: hd[0], cy: hd[1] });
      op(F.head, t >= t0 && u < 1 ? 1 : 0);
      const ru = seg(t, t0 + T.fanDur, t0 + T.fanDur + 0.6);
      set(F.ring, { rx: 6 + 40 * eOut(ru), ry: 2 + 8 * eOut(ru) });
      op(F.ring, ru > 0 && ru < 1 ? 1 - ru : 0);
    });

    // atto 3: salto di Mela, orbite in cielo
    const ju = seg(t, ...T.melaJump);
    if (t >= T.melaJump[0]) {
      const arr = []; for (let j = 0; j <= 40; j++) { const [x, y] = jumpAt((ju * j) / 40); arr.push([x, y - 0.45 * S]); }
      set(melaTrail, { points: pts(arr) });
    }
    op(melaTrail, t < T.melaJump[0] ? 0 : 1 - seg(t, 8.4, 8.9));
    strobe.forEach((d, i) => {
      const u = (i + 1) / 11, [x, y] = jumpAt(u);
      set(d, { cx: x, cy: y - 0.45 * S });
      op(d, t < T.melaJump[0] || ju < u ? 0 : 0.8 * (1 - seg(t, 8.4, 8.9)));
    });
    if (t >= T.melaJump[0] && t < T.melaJump[1]) {
      const [x, y] = jumpAt(ju), [x2, y2] = jumpAt(Math.min(1, ju + 0.02));
      const vx = (x2 - x) / 0.02, vy = (y2 - y) / 0.02, kk = 0.17;
      const cx0 = x, cy0 = y - 0.45 * S, ex = cx0 + vx * kk, ey = cy0 + vy * kk, a = Math.atan2(ey - cy0, ex - cx0);
      set(vec, { d: `M${cx0} ${cy0} L${ex} ${ey} M${ex - 10 * Math.cos(a - 0.45)} ${ey - 10 * Math.sin(a - 0.45)} L${ex} ${ey} L${ex - 10 * Math.cos(a + 0.45)} ${ey - 10 * Math.sin(a + 0.45)}` });
      set(vLab, { x: ex + 8, y: ey - 6 });
      op(vec, 1); op(vLab, 1);
    } else { op(vec, 0); op(vLab, 0); }
    op(nucleus, seg(t, T.nucleus, T.nucleus + 0.2) * (1 - seg(t, ...T.elettra)));
    orbits.forEach((o, i) => { set(o, { 'stroke-dashoffset': 1 - eInOut(seg(t, T.orbits[0] + i * 0.12, T.orbits[1])) }); op(o, t < T.orbits[0] ? 0 : 1 - seg(t, ...T.elettra)); });
    set(satBody, { 'stroke-dashoffset': 1 - eInOut(seg(t, ...T.saturn)) });
    set(satRing, { 'stroke-dashoffset': 1 - eInOut(seg(t, ...T.ring)) });
    op(satBody, t < T.saturn[0] ? 0 : 1 - seg(t, ...T.saturnino));
    op(satRing, t < T.ring[0] ? 0 : 1 - seg(t, ...T.saturnino));

    // atto 4: tutti sulla linea, poi la linea si piega nella parabola
    const m = eInOut(seg(t, ...T.bend));
    const ax = [], an = 60;
    for (let i = 0; i <= an; i++) { const x = lerp(ax0, ax1, i / an); ax.push([x, archY(x, m)]); }
    set(arch, { d: 'M' + ax.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') });
    op(arch, seg(t, T.bend[0] - 0.4, T.bend[0]));
    set(archTicks, { d: spotX.map((x) => `M${x} ${archY(x, m) + 6} v8`).join(' ') });
    op(archTicks, seg(t, T.bend[1] - 0.3, T.bend[1] + 0.2));
    ORDER.forEach((id, i) => {
      const tj = T.regroup + i * T.gap;
      if (t < tj) { place(id, home(id, t)); return; }
      const from = home(id, tj) || { x: 500, y: G, s: sc };
      const u = seg(t, tj, tj + T.hop), x1 = spotX[i];
      const s = t < T.bend[0] ? lerp(from.s, sl, eInOut(u)) : lerp(sl, sa, m);
      const hh = 70 + Math.abs(x1 - from.x) * 0.14;
      if (u < 1) {
        place(id, { x: lerp(from.x, x1, u), y: lerp(from.y, G, u) - hh * 4 * u * (1 - u), s, rot: (from.rot || 0) * (1 - u) });
      } else {
        const land = t - tj - T.hop, sy = 1 - 0.14 * Math.exp(-9 * land) * Math.cos(22 * land);
        place(id, { x: x1, y: archY(x1, m), s, sy });
      }
    });

    // atto 5: boss, fumetto, titolo
    const bossTo = { vetrino: portrait ? 230 : 250, bilancia: portrait ? 770 : 750 }, bossFrom = { vetrino: -160, bilancia: W + 160 };
    ['vetrino', 'bilancia'].forEach((id, i) => {
      const t0 = T.boss[0] + i * 0.14, u = eOut(seg(t, t0, T.boss[1] + i * 0.14));
      if (t < t0) { place(id, null); op(speed[i], 0); return; }
      const x = lerp(bossFrom[id], bossTo[id], u), dir = i ? 1 : -1, y0 = G - 0.5 * Sb;
      place(id, { x, y: G, s: sb });
      set(speed[i], { d: `M${x + dir * 0.55 * Sb} ${y0 - 20} h${dir * 60} M${x + dir * 0.6 * Sb} ${y0} h${dir * 90} M${x + dir * 0.55 * Sb} ${y0 + 20} h${dir * 50}` });
      op(speed[i], (1 - u) * 0.9);
    });
    op(bubble, seg(t, T.bubble[0], T.bubble[0] + 0.2) * (1 - seg(t, T.bubble[1] - 0.25, T.bubble[1])));
    { const u = eBack(seg(t, T.bubble[0], T.bubble[0] + 0.3)), px = bx + 60, py = by + bh + 20;
      set(bubble, { transform: `translate(${px} ${py}) scale(${(0.6 + 0.4 * u).toFixed(3)}) translate(${-px} ${-py})` }); }
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
    frame(Math.min(t, T.end));
    if (t < T.end) raf = requestAnimationFrame(loop);
    else finished = true;
  }
  // per provarla: ?introT=7.5 ferma l'animazione a quel secondo
  const seek = Number(new URLSearchParams(location.search).get('introT'));
  if (seek > 0) frame(Math.min(seek, T.end));
  else { raf = requestAnimationFrame(loop); frame(0); }

  // ---------- uscita ----------
  const toEnd = () => { started = performance.now() - T.end * 1000; if (finished) frame(T.end); };
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
