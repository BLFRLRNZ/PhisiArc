// Le animazioni della cassetta degli attrezzi: un omino di gesso che «fa» la matematica.
// Corre, tira, spinge e lancia: le idee si vedono muovere prima di diventare una formula.
// Ogni scena è una funzione del tempo (secondi) che restituisce il disegno SVG di quel momento.
import { h } from './util.js';
import { t as tr, LOCALE } from './i18n.js';

const W = 320, H = 190;
const n = (x, d = 2) => Number(x).toLocaleString(LOCALE, { maximumFractionDigits: d });
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const R = Math.PI / 180;

// ---------- andature ----------
const E = {
  lin: (k) => k,
  io: (k) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2),
  out: (k) => 1 - (1 - k) ** 3,
  in: (k) => k * k * k,
  back: (k) => { const c = 1.9; return 1 + (c + 1) * (k - 1) ** 3 + c * (k - 1) ** 2; }, // supera e torna: lo scatto dei cartoni
  bounce: (k) => { const a = 7.5625, b = 2.75; if (k < 1 / b) return a * k * k; if (k < 2 / b) return a * (k -= 1.5 / b) * k + 0.75; if (k < 2.5 / b) return a * (k -= 2.25 / b) * k + 0.9375; return a * (k -= 2.625 / b) * k + 0.984375; },
};
// avanzamento 0..1 fra due istanti, con un'andatura
const prog = (t, a, b, e = E.io) => e(clamp((t - a) / (b - a)));
// valore lungo una serie di chiavi [[t, v, andatura], ...]
function keys(t, ks) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    const [t1, v1, e] = ks[i], [t0, v0] = ks[i - 1];
    if (t <= t1) {
      const k = (e || E.io)(clamp((t - t0) / (t1 - t0)));
      if (typeof v0 === 'number') return lerp(v0, v1, k);
      const o = {}; for (const key of Object.keys(v1)) o[key] = lerp(v0[key] ?? v1[key], v1[key], k); return o;
    }
  }
  return ks[ks.length - 1][1];
}

// ---------- l'omino ----------
// angoli in gradi: 0 = giù, positivo = in avanti (verso destra se guarda a destra)
const POSE = {
  stand: { lean: 0, a1: 12, a2: 8, b1: -12, b2: -8, l1: 8, k1: 0, l2: -8, k2: 0 },
  point: { lean: -4, a1: 95, a2: 0, b1: -20, b2: -10, l1: 10, k1: 0, l2: -10, k2: 0 },
  cheer: { lean: -6, a1: 140, a2: 15, b1: -140, b2: -15, l1: 18, k1: 0, l2: -18, k2: 0 },
  push: { lean: 28, a1: 80, a2: 10, b1: 70, b2: 20, l1: 35, k1: -40, l2: -30, k2: -10 },
  pull: { lean: -26, a1: 70, a2: 0, b1: 60, b2: 0, l1: 30, k1: -10, l2: -25, k2: -30 },
  crouch: { lean: 18, a1: 40, a2: 60, b1: -30, b2: 40, l1: 70, k1: -110, l2: 40, k2: -100 },
  jump: { lean: -8, a1: 135, a2: 25, b1: -135, b2: -25, l1: 30, k1: -60, l2: -20, k2: -40 },
  carry: { lean: 2, a1: 172, a2: 0, b1: 172, b2: 0, l1: 8, k1: 0, l2: -8, k2: 0 },
  kick: { lean: -18, a1: -40, a2: -20, b1: 60, b2: 20, l1: 80, k1: 0, l2: -10, k2: 0 },
  hang: { lean: 0, a1: 178, a2: 0, b1: 170, b2: 0, l1: 14, k1: -12, l2: -6, k2: -8 },
  skid: { lean: -30, a1: 60, a2: 40, b1: -60, b2: 20, l1: 50, k1: 0, l2: 20, k2: -40 },
};
// la corsa: braccia e gambe che si alternano, con il busto in avanti
const run = (ph, sp = 1) => {
  const s = Math.sin(ph), c = Math.cos(ph);
  return { lean: 20 * sp, a1: 70 * s * sp, a2: 80, b1: -70 * s * sp, b2: 80, l1: 50 * s * sp, k1: -55 * Math.max(0, -c) * sp - 10, l2: -45 * s * sp, k2: -55 * Math.max(0, c) * sp - 10 };
};
const mix = (p, q, k) => { const o = {}; for (const key of Object.keys(p)) o[key] = lerp(p[key], q[key] ?? p[key], k); return o; };

// x, y: punto dei piedi a terra; dir 1 guarda a destra, -1 a sinistra; s scala
function fig(x, y, p, { dir = 1, s = 1, cls = 'fig', bob = 0 } = {}) {
  const T = 26 * s, UA = 14 * s, FA = 13 * s, TH = 16 * s, SH = 16 * s, HR = 7.5 * s;
  const at = (ox, oy, a, L) => [ox + dir * Math.sin(a * R) * L, oy + Math.cos(a * R) * L];
  // altezza dei fianchi: le gambe piegate abbassano il corpo
  const legH = (l, k) => Math.cos(l * R) * TH + Math.cos((l + k) * R) * SH;
  const hipY = y - Math.max(legH(p.l1, p.k1), legH(p.l2, p.k2)) - bob;
  const hip = [x, hipY];
  const neck = [x + dir * Math.sin(p.lean * R) * T, hipY - Math.cos(p.lean * R) * T];
  const head = [neck[0] + dir * Math.sin(p.lean * R) * (HR + 2), neck[1] - Math.cos(p.lean * R) * (HR + 2)];
  const sh = [lerp(hip[0], neck[0], 0.9), lerp(hip[1], neck[1], 0.9)];
  const limb = (o, a, b, L1, L2) => { const m = at(o[0], o[1], a, L1); const e = at(m[0], m[1], a + b, L2); return `M${o[0].toFixed(1)} ${o[1].toFixed(1)}L${m[0].toFixed(1)} ${m[1].toFixed(1)}L${e[0].toFixed(1)} ${e[1].toFixed(1)}`; };
  const d = `M${hip[0].toFixed(1)} ${hip[1].toFixed(1)}L${neck[0].toFixed(1)} ${neck[1].toFixed(1)}`
    + limb(sh, p.b1, p.b2, UA, FA) + limb(hip, p.l2, p.k2, TH, SH) + limb(sh, p.a1, p.a2, UA, FA) + limb(hip, p.l1, p.k1, TH, SH);
  return `<g class="${cls}"><path d="${d}"/><circle cx="${head[0].toFixed(1)}" cy="${head[1].toFixed(1)}" r="${HR}"/></g>`;
}
// la mano davanti, per attaccarci gli oggetti
function hand(x, y, p, { dir = 1, s = 1 } = {}) {
  const T = 26 * s, UA = 14 * s, FA = 13 * s, TH = 16 * s, SH = 16 * s;
  const legH = (l, k) => Math.cos(l * R) * TH + Math.cos((l + k) * R) * SH;
  const hipY = y - Math.max(legH(p.l1, p.k1), legH(p.l2, p.k2));
  const nx = x + dir * Math.sin(p.lean * R) * T * 0.9, ny = hipY - Math.cos(p.lean * R) * T * 0.9;
  const mx = nx + dir * Math.sin(p.a1 * R) * UA, my = ny + Math.cos(p.a1 * R) * UA;
  return [mx + dir * Math.sin((p.a1 + p.a2) * R) * FA, my + Math.cos((p.a1 + p.a2) * R) * FA];
}

// ---------- effetti ----------
const txt = (x, y, s, cls = '', size = 16, extra = '') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="ta-t ${cls}" font-size="${size}" text-anchor="middle" ${extra}>${s}</text>`;
// una scritta che «salta fuori» con lo scatto
const pop = (t, t0, x, y, s, cls, size = 18) => {
  if (t < t0) return '';
  const k = E.back(clamp((t - t0) / 0.35));
  return `<g transform="translate(${x} ${y}) scale(${k.toFixed(3)})">${txt(0, 0, s, cls, size)}</g>`;
};
// righe di velocità dietro a chi corre
const speedLines = (x, y, dir, a) => (a <= 0.02 ? '' : [0, 1, 2].map((i) => `<line x1="${x - dir * (14 + i * 3)}" y1="${y - 28 - i * 9}" x2="${x - dir * (34 + i * 8) * a}" y2="${y - 28 - i * 9}" class="ta-speed" opacity="${a.toFixed(2)}"/>`).join(''));
// sbuffi di polvere
const dust = (t, t0, x, y) => {
  const k = (t - t0) / 0.6;
  if (k < 0 || k > 1) return '';
  return [-1, 0, 1].map((i) => `<circle cx="${(x + i * 9 * k * 1.6).toFixed(1)}" cy="${(y - 3 - Math.abs(i) * 4 * k).toFixed(1)}" r="${(2 + 5 * k).toFixed(1)}" class="ta-dust" opacity="${(0.7 * (1 - k)).toFixed(2)}"/>`).join('');
};
// un lampo a raggiera quando qualcosa scatta al suo posto
const burst = (t, t0, x, y, r = 22) => {
  const k = (t - t0) / 0.4;
  if (k < 0 || k > 1) return '';
  return Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, r1 = r * (0.5 + k), r2 = r * (0.8 + k * 1.2); return `<line x1="${(x + Math.cos(a) * r1).toFixed(1)}" y1="${(y + Math.sin(a) * r1).toFixed(1)}" x2="${(x + Math.cos(a) * r2).toFixed(1)}" y2="${(y + Math.sin(a) * r2).toFixed(1)}" class="ta-burst" opacity="${(1 - k).toFixed(2)}"/>`; }).join('');
};
const ground = (y = 172) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="ta-ground"/>`;
// un'ombra sotto i piedi che si stringe quando si salta
const shadow = (x, y, up = 0) => `<ellipse cx="${x.toFixed(1)}" cy="${y + 1}" rx="${(12 - up * 0.12).toFixed(1)}" ry="2.5" class="ta-shadow"/>`;

// ---------- le scene ----------
const G = 172;
export const SCENES = {
  // v = d / t: l'omino corre, il cronometro conta, le lettere volano a formare la formula
  formula: {
    dur: 7.2,
    draw(t) {
      const G = 150, x0 = 34, x1 = 250, tr0 = 0.9, tr1 = 3.6;
      const k = prog(t, tr0, tr1, E.lin);
      let x = lerp(x0, x1, k), p, bob = 0;
      if (t < 0.5) p = POSE.stand;
      else if (t < tr0) p = mix(POSE.stand, POSE.crouch, prog(t, 0.5, tr0, E.out)); // carica prima di partire
      else if (t < tr1) { const ph = (t - tr0) * 15; p = run(ph); bob = Math.abs(Math.sin(ph)) * 4; }
      else if (t < 4.2) { p = mix(POSE.skid, POSE.stand, prog(t, 3.9, 4.2)); x = x1 + 14 * prog(t, tr1, 3.9, E.out); }
      else { x = x1 + 14; p = mix(POSE.stand, POSE.point, prog(t, 5.6, 6.0, E.back)); }
      const sec = clamp((t - tr0) / (tr1 - tr0)) * 8;
      let s = ground(G) + `<line x1="${x0}" y1="${G - 30}" x2="${x0}" y2="${G}" class="ta-flag"/><path d="M${x0} ${G - 30}h14l-4 5 4 5h-14" class="ta-flagc"/>`
        + `<line x1="${x1}" y1="${G - 34}" x2="${x1}" y2="${G}" class="ta-flag"/><path d="M${x1} ${G - 34}h-16v10h16" class="ta-check"/>`;
      // la freccia della distanza cresce dietro all'omino
      const dx = Math.min(x, x1) - x0;
      if (t > tr0 && t < 4.6) s += `<line x1="${x0}" y1="${G + 10}" x2="${x0 + dx}" y2="${G + 10}" class="ta-d c2"/>` + txt(x0 + dx / 2, G + 28, 'd', 'c2', 16);
      // il cronometro
      const cx = 280, cy = 34;
      s += `<circle cx="${cx}" cy="${cy}" r="18" class="ta-watch"/><line x1="${cx}" y1="${cy}" x2="${(cx + Math.sin(sec * 0.785) * 13).toFixed(1)}" y2="${(cy - Math.cos(sec * 0.785) * 13).toFixed(1)}" class="ta-hand"/><rect x="${cx - 3}" y="${cy - 24}" width="6" height="5" class="ta-watchtop"/>`;
      if (t < 4.6) s += txt(cx - 34, cy + 5, `${n(sec, 1)} s`, 'c3 mono', 13);
      // le lettere volano dal disegno alla formula
      const fy = 62, fk = prog(t, 4.3, 5.1, E.back), fk2 = prog(t, 4.5, 5.3, E.back);
      if (t > 4.3) {
        s += txt(lerp(x0 + (x1 - x0) / 2, 170, fk), lerp(G + 28, fy, fk), 'd', 'c2', lerp(16, 30, fk));
        s += txt(lerp(cx - 34, 214, fk2), lerp(cy + 5, fy, fk2), 't', 'c3', lerp(13, 30, fk2));
      }
      if (t > 5.1) s += pop(t, 5.1, 192, fy, '/', '', 30);
      if (t > 5.4) s += pop(t, 5.4, 128, fy, 'v =', 'c1', 30) + burst(t, 5.45, 120, fy - 10);
      if (t > 6.1) s += pop(t, 6.1, 136, fy + 32, tr('216 m in 8 s: 27 metri ogni secondo'), 'muted', 13);
      s += speedLines(x, G, 1, t < tr0 ? 0 : t < tr1 ? 1 : 1 - prog(t, tr1, tr1 + 0.3));
      s += dust(t, tr0, x0, G) + dust(t, tr1, x1 + 10, G) + shadow(x, G) + fig(x, G, p, { bob });
      return s;
    },
  },

  // x²: l'omino porta un bastone, ne fa un quadrato, i quadretti saltano fuori; poi lo tira e diventa 4 volte tanto
  quadrato: {
    dur: 8.5,
    draw(t) {
      const c = 13, ox = 150, oy = G;
      const side = keys(t, [[0, 3], [5.0, 3], [5.9, 6, E.back]]);
      const L = side * c;
      let s = ground(G);
      // l'omino entra con il bastone sopra la testa
      let fx = keys(t, [[0, -20], [1.4, 104, E.out], [5.0, 104], [5.3, ox + 3 * c + 16], [5.9, ox + 6 * c + 16, E.back]]), p;
      if (t < 1.4) { const ph = t * 13; p = mix(run(ph, 0.6), POSE.carry, 0.6); }
      else if (t < 1.8) p = mix(POSE.carry, POSE.jump, prog(t, 1.4, 1.7, E.out));
      else if (t < 4.8) p = mix(POSE.jump, POSE.cheer, prog(t, 1.8, 2.3));
      else p = mix(POSE.stand, POSE.pull, prog(t, 4.8, 5.1, E.out));
      const fdir = t > 4.9 ? -1 : 1;
      if (t > 6.2) p = mix(POSE.pull, POSE.point, prog(t, 6.2, 6.5, E.back));
      const jumpUp = t > 1.4 && t < 2.1 ? Math.sin(prog(t, 1.4, 2.1, E.lin) * Math.PI) * 26 : 0;
      // il bastone: prima in mano, poi vola a fare il lato di base
      const hk = prog(t, 1.6, 2.1, E.back);
      if (t < 2.1) {
        const [hx, hy] = hand(fx, G - jumpUp, p);
        const bx = lerp(hx - L / 2, ox, hk), by = lerp(hy - 2, oy, hk);
        s += `<line x1="${bx}" y1="${by}" x2="${bx + L}" y2="${by}" class="ta-stick c1"/>` + txt(bx + L / 2, by - 6, 'x', 'c1', 14);
      }
      // i quattro lati si chiudono girando
      if (t >= 2.1) {
        const a = prog(t, 2.1, 2.8, E.back);
        const pts = [[ox, oy], [ox + L, oy], [ox + L, oy - L * a], [ox + L - L * a, oy - L], [ox, oy - L * a]];
        s += `<polyline points="${pts.map((q) => q.join(',')).join(' ')}" class="ta-sq c1"/>`;
      }
      // i quadretti saltano fuori, uno dopo l'altro
      const cells = Math.round(side) ** 2, nside = Math.round(side);
      let count = 0;
      if (t > 2.8) {
        const t0 = t < 5 ? 2.8 : 6.0, gap = t < 5 ? 0.16 : 0.035;
        let nw = 0;
        for (let i = 0; i < cells; i++) {
          const ci = i % nside, cj = Math.floor(i / nside), old = t >= 5 && ci < 3 && cj < 3;
          const ti = old ? 0 : t0 + (t < 5 ? i : nw++) * gap;
          if (t < ti) continue;
          count++;
          const k = E.back(clamp((t - ti) / 0.25));
          const cxx = ox + ci * c + c / 2, cyy = oy - cj * c - c / 2, w = (c - 2.5) * k;
          s += `<rect x="${(cxx - w / 2).toFixed(1)}" y="${(cyy - w / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${w.toFixed(1)}" rx="2" class="ta-cell ${ci >= 3 || cj >= 3 ? 'c2f' : 'c1f'}"/>`;
        }
      }
      if (t > 2.8) s += txt(ox + L / 2, oy - L - 12, `${Math.round(side)}² = ${count}`, 'c1 mono', 18);
      if (t > 5.0 && t < 5.9) s += burst(t, 5.0, ox + L, oy - L, 16);
      if (t > 7.6) s += pop(t, 7.6, 100, 40, tr('lato × 2 → area × 4'), 'c2', 16) + burst(t, 7.65, 100, 34, 26);
      // nella fase del tiro l'omino tiene l'angolo in alto a sinistra
      s += shadow(fx, G, jumpUp) + fig(fx, G - jumpUp, p, { dir: fdir });
      return s;
    },
  },

  // √: un quadrato di 49 quadretti; l'omino gli dà un calcio, si schiaccia nel suo lato, e lui lo solleva: 7!
  radice: {
    dur: 7.4,
    draw(t) {
      const c = 13, side = 7, ox = 170, oy = G, L = side * c;
      let s = ground(G);
      const squash = prog(t, 2.6, 3.6, E.bounce); // 0 quadrato pieno, 1 tutto schiacciato nel lato
      // prima l'area, grande
      if (t < 3.7) {
        const hgt = L * (1 - squash), wob = t > 2.2 && t < 2.6 ? Math.sin((t - 2.2) * 60) * 2 : 0;
        for (let i = 0; i < 49; i++) {
          const ci = i % side, cj = Math.floor(i / side);
          const cy = oy - (cj + 0.5) * (hgt / side), ch = Math.max(1, hgt / side - 2);
          s += `<rect x="${ox + ci * c + 1 + wob}" y="${(cy - ch / 2).toFixed(1)}" width="${c - 2.5}" height="${ch.toFixed(1)}" rx="2" class="ta-cell c1f"/>`;
        }
        if (t < 2.6) s += pop(t, 0.2, ox + L / 2, oy - L - 10, tr('area 49'), 'c1', 16);
      }
      // l'omino corre, carica il calcio e colpisce
      let fx = keys(t, [[0, 30], [1.6, 132, E.out], [3.8, 132], [4.6, ox + L / 2 - 4, E.io]]), p;
      if (t < 1.6) p = run(t * 14, 0.8);
      else if (t < 2.2) p = mix(POSE.stand, mix(POSE.kick, POSE.crouch, 0.5), prog(t, 1.6, 2.1, E.out)); // carica
      else if (t < 2.6) p = mix(POSE.crouch, POSE.kick, prog(t, 2.2, 2.32, E.out));
      else if (t < 3.8) p = mix(POSE.kick, POSE.stand, prog(t, 2.8, 3.2));
      else if (t < 4.6) p = run((t - 3.8) * 12, 0.6);
      else if (t < 5.2) p = mix(POSE.crouch, POSE.carry, prog(t, 4.6, 5.1, E.out));
      else p = mix(POSE.carry, POSE.cheer, prog(t, 5.4, 5.8, E.back)) ;
      s += burst(t, 2.25, ox - 4, oy - 20, 18);
      // il lato che resta: prima per terra, poi alzato sopra la testa
      if (t >= 3.6) {
        const lift = prog(t, 4.7, 5.2, E.back), [hx, hy] = hand(fx, G, p);
        const y = lerp(oy - 2, hy - 3, lift), x = lerp(ox, hx - L / 2, lift);
        s += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + L).toFixed(1)}" y2="${y.toFixed(1)}" class="ta-stick c2"/>`;
        s += burst(t, 3.62, ox + L / 2, oy - 4, 30);
        if (t < 4.7) s += pop(t, 3.8, ox + L / 2, oy - 14, tr('lato 7'), 'c2', 16);
      }
      if (t > 5.9) s += pop(t, 5.9, 160, 34, '√49 = 7', 'c1 mono', 26) + burst(t, 5.95, 160, 26, 30);
      s += shadow(fx, G) + fig(fx, G, p, { dir: 1 });
      return s;
    },
  },

  // Pitagora: dal triangolo 3-4-5 escono i quadrati dei lati corti; l'omino ne lancia i quadretti in quello del lato lungo
  pitagora: {
    dur: 9,
    draw(t) {
      const k = 11, A = [86, 118], B = [86 + 4 * k, 118], C = [86, 118 - 3 * k]; // cateto orizzontale 4, verticale 3
      let s = '';
      // quadrato sul cateto verticale (3): a sinistra; su quello orizzontale (4): sotto
      const cellsA = [], cellsB = [], cellsC = [];
      for (let i = 0; i < 9; i++) cellsA.push([C[0] - 3 * k + (i % 3) * k, C[1] + Math.floor(i / 3) * k]);
      for (let i = 0; i < 16; i++) cellsB.push([A[0] + (i % 4) * k, A[1] + Math.floor(i / 4) * k * 0.0 + 0]); // poi sotto, scalati
      // il quadrato sull'ipotenusa, girato: base da C a B, verso l'esterno
      const ux = (B[0] - C[0]) / 5, uy = (B[1] - C[1]) / 5, vx = uy, vy = -ux; // passo lungo il lato, e verso fuori
      for (let i = 0; i < 25; i++) { const a = i % 5, b = Math.floor(i / 5); cellsC.push([C[0] + ux * (a + 0.5) + vx * (b + 0.5), C[1] + uy * (a + 0.5) + vy * (b + 0.5)]); }
      const ang = Math.atan2(uy, ux) / R;
      // i quadrati dei cateti saltano fuori
      const ga = prog(t, 0.6, 1.1, E.back), gb = prog(t, 1.0, 1.5, E.back);
      const flyA = (i) => prog(t, 3.0 + i * 0.09, 3.6 + i * 0.09, E.io), flyB = (i) => prog(t, 4.2 + i * 0.07, 4.8 + i * 0.07, E.io);
      const cellR = (x, y, kk, cls, rot = 0) => `<rect x="${(-(k - 2) / 2 * kk).toFixed(1)}" y="${(-(k - 2) / 2 * kk).toFixed(1)}" width="${((k - 2) * kk).toFixed(1)}" height="${((k - 2) * kk).toFixed(1)}" rx="1.5" class="ta-cell ${cls}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})"/>`;
      // contorno del quadrato grande, che si disegna quando arrivano i quadretti
      const cOut = prog(t, 2.4, 2.9);
      if (cOut > 0) {
        const P = [C, B, [B[0] + vx * 5 * cOut, B[1] + vy * 5 * cOut], [C[0] + vx * 5 * cOut, C[1] + vy * 5 * cOut]];
        s += `<polygon points="${P.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" class="ta-sq c1" fill="none"/>`;
      }
      let ci = 0;
      for (let i = 0; i < 9; i++) {
        const [x, y] = cellsA[i], f = flyA(i), [tx, ty] = cellsC[ci++];
        const arc = Math.sin(f * Math.PI) * 40;
        s += cellR(lerp(x + k / 2, tx, f), lerp(y + k / 2, ty, f) - arc, ga, 'c3f', ang * f + f * 360);
      }
      for (let i = 0; i < 16; i++) {
        const x = A[0] + (i % 4) * k + k / 2, y = A[1] + Math.floor(i / 4) * k + k / 2, f = flyB(i), [tx, ty] = cellsC[ci++];
        const arc = Math.sin(f * Math.PI) * 50;
        s += cellR(lerp(x, tx, f), lerp(y, ty, f) - arc, gb, 'c2f', ang * f - f * 360);
      }
      void cellsB;
      s += `<polygon points="${A} ${B} ${C}" class="ta-tri"/><path d="M${A[0] + 8} ${A[1]}v-8h-8" class="ta-rt"/>`;
      s += txt(C[0] - 3 * k / 2 - 1, C[1] - 6, '3', 'c3', 13) + txt(A[0] - 9, A[1] + 2 * k + 5, '4', 'c2', 13);
      // l'omino: lancia prima dal quadrato verde poi da quello arancione
      let fx = keys(t, [[0, 300], [2.0, 222, E.out], [3.9, 222], [4.1, 214]]), p;
      if (t < 2.0) p = run(t * 13, 0.8);
      else if (t < 3.0) p = mix(POSE.stand, POSE.crouch, prog(t, 2.3, 2.9, E.out));
      else if (t < 3.9) p = mix(POSE.crouch, POSE.jump, prog(t, 3.0, 3.2, E.back));
      else if (t < 4.2) p = mix(POSE.jump, POSE.crouch, prog(t, 3.9, 4.15));
      else if (t < 6) p = mix(POSE.crouch, POSE.jump, prog(t, 4.2, 4.4, E.back));
      else p = mix(POSE.jump, POSE.cheer, prog(t, 6.0, 6.4, E.back));
      const up = t > 3.0 && t < 3.6 ? Math.sin(prog(t, 3.0, 3.6, E.lin) * Math.PI) * 18 : t > 4.2 && t < 4.9 ? Math.sin(prog(t, 4.2, 4.9, E.lin) * Math.PI) * 18 : 0;
      s += ground(G) + shadow(fx, G, up) + fig(fx, G - up, p, { dir: -1 });
      // i conti
      const xm = 240, ym = 26;
      if (t > 1.5) s += pop(t, 1.5, xm, ym, '3² + 4²', 'mono', 17);
      if (t > 5.7) s += pop(t, 5.7, xm, ym + 24, '9 + 16 = 25', 'c1 mono', 17) + burst(t, 5.7, cellsC[12][0], cellsC[12][1], 30);
      if (t > 6.8) s += pop(t, 6.8, xm, ym + 48, tr('lato lungo = √25 = 5'), 'c1', 13);
      return s;
    },
  },

  // π: l'omino spinge una ruota con un segno di vernice; il giro lascia una striscia; poi ci posa sopra tre diametri e un pezzetto
  pi: {
    dur: 9,
    draw(t) {
      const r = 22, d = 2 * r, x0 = 40, C = Math.PI * d;
      const roll = prog(t, 1.0, 3.6, E.io); // un giro intero
      const wx = x0 + roll * C, wy = G - r, rot = roll * 360;
      let s = ground(G);
      // la striscia di vernice lasciata dal bordo
      if (roll > 0) s += `<line x1="${x0}" y1="${G}" x2="${wx.toFixed(1)}" y2="${G}" class="ta-paint"/>`;
      // la ruota, con il diametro segnato e la goccia di vernice sul bordo
      const showWheel = t < 6.4 ? 1 : 1 - prog(t, 6.4, 6.8);
      if (showWheel > 0) {
        s += `<g transform="translate(${wx.toFixed(1)} ${wy}) rotate(${rot.toFixed(1)})" opacity="${showWheel.toFixed(2)}"><circle r="${r}" class="ta-wheel"/><line x1="${-r}" y1="0" x2="${r}" y2="0" class="ta-dia"/><circle cx="0" cy="${r}" r="3.5" class="ta-paintdot"/></g>`;
        if (t < 1.0) s += pop(t, 0.2, wx + r + 34, wy + 4, tr('diametro'), 'c2', 13);
      }
      // l'omino spinge da dietro, a gambe larghe
      let fx = wx - r - 16, p;
      if (t < 0.9) { fx = keys(t, [[0, -20], [0.9, x0 - r - 16, E.out]]); p = run(t * 13, 0.7); }
      else if (t < 3.6) { const ph = (t - 1) * 9; p = mix(POSE.push, run(ph, 0.5), 0.35); }
      else if (t < 4.1) p = mix(POSE.push, POSE.stand, prog(t, 3.6, 4.0));
      else p = mix(POSE.stand, POSE.point, prog(t, 7.4, 7.7, E.back));
      if (t > 3.6) fx = keys(t, [[3.6, x0 + C - r - 16], [4.1, x0 + C - r - 10]]);
      if (t > 4.1) fx = keys(t, [[4.1, x0 + C - r - 10], [4.6, x0 + C + r + 34, E.io]]);
      if (t > 1 && t < 3.6) s += speedLines(fx, G, 1, 0.5);
      // tre diametri cadono uno dopo l'altro sulla striscia, girandosi
      for (let i = 0; i < 3; i++) {
        const t0 = 4.7 + i * 0.55, f = prog(t, t0, t0 + 0.45, E.bounce);
        if (t < t0) continue;
        const x = x0 + i * d, y = lerp(40, G - 4, f), a = lerp(-90, 0, prog(t, t0, t0 + 0.35, E.out));
        s += `<g transform="translate(${(x + d / 2).toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})"><line x1="${-d / 2 + 1}" y1="0" x2="${d / 2 - 1}" y2="0" class="ta-stick c2"/></g>`;
        if (f >= 1) s += txt(x + d / 2, G - 12, String(i + 1), 'c2', 13);
      }
      // il pezzetto che avanza
      if (t > 6.5) {
        const k = prog(t, 6.5, 6.9, E.back);
        s += `<rect x="${x0 + 3 * d}" y="${G - 9}" width="${(0.1416 * d * k).toFixed(1)}" height="10" class="ta-bit"/>` + pop(t, 6.6, x0 + 3 * d + 14, G - 22, '0,14…', 'c3', 13);
      }
      if (t > 7.6) s += pop(t, 7.6, 160, 44, tr('giro = π × diametro'), 'c1', 18) + pop(t, 8.0, 160, 72, 'π = 3,14159…', 'c1 mono', 15) + burst(t, 7.65, 160, 38, 28);
      s += shadow(fx, G) + fig(fx, G, p);
      return s;
    },
  },

  // seno e coseno: una freccia inclinata, un sole che fa l'ombra per terra e una lampada che la fa sul muro; l'omino gira la freccia
  seno: {
    dur: 9.5,
    draw(t) {
      const ox = 112, oy = 158, L = 104;
      const deg = Math.min(90, keys(t, [[0, 0], [1.6, 0], [3.0, 60, E.back], [4.2, 60], [5.2, 90, E.back], [6.2, 90], [7.3, 30, E.back]]));
      const a = deg * R, X = ox + L * Math.cos(a), Y = oy - L * Math.sin(a);
      let s = `<line x1="${ox - 30}" y1="${oy}" x2="${W}" y2="${oy}" class="ta-ground"/><line x1="${ox - 26}" y1="${oy}" x2="${ox - 26}" y2="10" class="ta-wall"/>`;
      // il sole in alto e i raggi verticali; la lampada a destra e i raggi orizzontali
      const sun = prog(t, 0.2, 0.7, E.back), lamp = prog(t, 0.6, 1.1, E.back);
      s += `<g transform="translate(${X.toFixed(1)} 18) scale(${sun.toFixed(2)})"><circle r="8" class="ta-sun"/>${Array.from({ length: 8 }, (_, i) => { const q = (i / 8) * Math.PI * 2; return `<line x1="${(Math.cos(q) * 11).toFixed(1)}" y1="${(Math.sin(q) * 11).toFixed(1)}" x2="${(Math.cos(q) * 15).toFixed(1)}" y2="${(Math.sin(q) * 15).toFixed(1)}" class="ta-sunray"/>`; }).join('')}</g>`;
      s += `<g transform="translate(300 ${Y.toFixed(1)}) scale(${lamp.toFixed(2)})"><path d="M0 -7 L-12 -11 L-12 11 L0 7Z" class="ta-lamp"/></g>`;
      if (sun > 0.9) s += `<line x1="${X.toFixed(1)}" y1="30" x2="${X.toFixed(1)}" y2="${oy}" class="ta-ray"/>`;
      if (lamp > 0.9) s += `<line x1="288" y1="${Y.toFixed(1)}" x2="${ox - 26}" y2="${Y.toFixed(1)}" class="ta-ray"/>`;
      // le due ombre
      s += `<line x1="${ox}" y1="${oy + 5}" x2="${X.toFixed(1)}" y2="${oy + 5}" class="ta-shx"/>`;
      s += `<line x1="${ox - 26}" y1="${oy}" x2="${ox - 26}" y2="${Y.toFixed(1)}" class="ta-shy"/>`;
      // la freccia e l'arco dell'angolo
      const head = `<path d="M${X.toFixed(1)} ${Y.toFixed(1)} l${(-10 * Math.cos(a - 0.45)).toFixed(1)} ${(10 * Math.sin(a - 0.45)).toFixed(1)} M${X.toFixed(1)} ${Y.toFixed(1)} l${(-10 * Math.cos(a + 0.45)).toFixed(1)} ${(10 * Math.sin(a + 0.45)).toFixed(1)}" class="ta-arrow"/>`;
      s += `<line x1="${ox}" y1="${oy}" x2="${X.toFixed(1)}" y2="${Y.toFixed(1)}" class="ta-arrow"/>` + head;
      if (deg > 3) s += `<path d="M${ox + 24} ${oy} A24 24 0 0 0 ${(ox + 24 * Math.cos(a)).toFixed(1)} ${(oy - 24 * Math.sin(a)).toFixed(1)}" class="ta-ang"/>` + txt(ox + 34, oy - 8, `${Math.round(deg)}°`, 'mono', 11);
      // i valori
      s += txt(ox + (X - ox) / 2, oy + 20, `cos = ${n(Math.abs(Math.cos(a)) < 0.005 ? 0 : Math.cos(a))}`, 'c2 mono', 12) + `<text x="${ox - 32}" y="${((oy + Y) / 2).toFixed(1)}" class="ta-t c3 mono" font-size="12" text-anchor="end">sin = ${n(Math.sin(a))}</text>`;
      // l'omino: arriva di corsa, spinge la punta e, quando la freccia si alza, ci resta appeso
      let p, fx, fy, dir = -1;
      const hk = clamp((G - (Y + 82)) / 24); // 0 in piedi a terra, 1 appeso alla punta
      if (t < 1.6) { fx = keys(t, [[0, 340], [1.6, X + 24, E.out]]); fy = G; p = t < 1.4 ? run(t * 13, 0.8) : POSE.push; }
      else {
        fx = lerp(X + 24, X + 2, hk); fy = Math.min(G, Y + 82);
        const swing = { ...POSE.hang, lean: Math.sin(t * 6) * 10 * hk, l1: POSE.hang.l1 + Math.sin(t * 6 + 1) * 14 * hk };
        p = mix(POSE.push, swing, hk);
      }
      if (t > 7.3) p = mix(p, POSE.cheer, prog(t, 7.4, 7.8, E.back));
      s += (fy >= G - 0.5 ? shadow(fx, G) : '') + fig(fx, fy, p, { dir, s: 0.9 });
      if (t > 7.9) s += pop(t, 7.9, 236, 40, tr('a 30°: sin = 0,5'), 'c3', 15) + burst(t, 7.95, 236, 34, 24);
      return s;
    },
  },
};

// ---------- il riproduttore ----------
const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export function toolAnim(id) {
  const sc = SCENES[id];
  if (!sc) return null;
  const stage = h('div', { class: 'ta-stage' });
  const replay = h('button', { class: 'btn icon sm ta-replay', title: tr('Guarda di nuovo'), 'aria-label': tr('Guarda di nuovo'), hidden: true }, '↺');
  const wrap = h('div', { class: 'ta-wrap' }, stage, replay);
  let raf = 0, t0 = 0;
  const frame = (t) => { stage.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="ta-svg" aria-hidden="true">${sc.draw(t)}</svg>`; };
  const tick = (now) => {
    if (!wrap.isConnected && t0) { raf = 0; return; }
    if (!t0) t0 = now;
    const t = (now - t0) / 1000;
    frame(Math.min(t, sc.dur));
    if (t < sc.dur) raf = requestAnimationFrame(tick); else { raf = 0; replay.hidden = false; }
  };
  const play = () => { cancelAnimationFrame(raf); replay.hidden = true; t0 = 0; if (calm()) { frame(sc.dur); replay.hidden = false; return; } raf = requestAnimationFrame(tick); };
  replay.onclick = play;
  frame(0);
  play();
  return wrap;
}
