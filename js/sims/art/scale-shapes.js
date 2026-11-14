// Disegni degli oggetti dello zoom delle grandezze (dal protone all'universo), a linee morbide.
// Ogni forma riceve il tempo t e restituisce tratti (S) e puntini (D) in coordinate "unità": la grandezza dell'oggetto vale 1.

export const TAU = Math.PI * 2;

// ---------- piccoli attrezzi geometrici (coordinate "unità": la grandezza dell'oggetto vale 1) ----------
const ell = (cx, cy, rx, ry, rot = 0, n = 48, a0 = 0, a1 = TAU) => {
  const p = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n, x = rx * Math.cos(a), y = ry * Math.sin(a);
    p.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return p;
};
const circ = (cx, cy, r, n = 40) => ell(cx, cy, r, r, 0, n);
// Curva morbida che passa per i punti (Catmull-Rom).
const smooth = (pts, closed = false, k = 6) => {
  const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  const out = [];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
    }
  }
  out.push(closed ? out[0] : pts[pts.length - 1]);
  return out;
};
const wave = (x0, y0, x1, y1, amp, n, ph) => {
  const p = [], L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  for (let i = 0; i <= 40; i++) { const u = i / 40, w = Math.sin(u * n * TAU + ph) * amp; p.push([x0 + (x1 - x0) * u + nx * w, y0 + (y1 - y0) * u + ny * w]); }
  return p;
};
const rnd = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const star4 = (x, y, r) => [[x, y - r], [x + r * 0.22, y - r * 0.22], [x + r, y], [x + r * 0.22, y + r * 0.22], [x, y + r], [x - r * 0.22, y + r * 0.22], [x - r, y], [x - r * 0.22, y - r * 0.22], [x, y - r]];

// Una forma = elenco di tratti { p: punti, c: colore, a: alfa, f: riempimento, w: spessore } + pallini { d: [x, y, r] } + scritte { t, x, y }.
const S = (p, c, o = {}) => ({ p, c, ...o });
const D = (x, y, r, c, o = {}) => ({ d: [x, y, r], c, ...o });

// Dati fissi calcolati una volta sola.
const NUC = [];
for (let i = 0; i < 14; i++) { const a = i * 2.39996, r = 0.34 * Math.sqrt((i + 0.5) / 14); NUC.push([r * Math.cos(a), r * Math.sin(a), i % 2 ? 'chalk' : 'coral', i]); }
const GAL = []; { const r = rnd(11); for (let i = 0; i < 160; i++) { const arm = i % 2 ? Math.PI : 0, u = r(), a = arm + u * 3.6 + (r() - 0.5) * 0.5, rr = 0.06 + 0.44 * u + (r() - 0.5) * 0.05; GAL.push([rr, a, 0.004 + r() * 0.007, r() < 0.15 ? 'sky' : r() < 0.5 ? 'pink' : 'chalk']); } }
const WEB = []; { const r = rnd(5); while (WEB.length < 46) { const x = r() - 0.5, y = r() - 0.5; if (x * x + y * y < 0.22) WEB.push([x, y, 0.006 + r() * 0.012]); } }
const WEBL = []; WEB.forEach((a, i) => { const d = WEB.map((b, j) => [Math.hypot(a[0] - b[0], a[1] - b[1]), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0]); for (const [, j] of d.slice(0, 2)) if (i < j) WEBL.push([i, j]); });
const ASTER = []; { const r = rnd(3); for (let i = 0; i < 40; i++) ASTER.push([0.2 + r() * 0.03, r() * TAU]); }
const SAND = smooth([[0.46, 0.05], [0.3, 0.38], [-0.1, 0.46], [-0.42, 0.3], [-0.5, -0.05], [-0.3, -0.38], [0.08, -0.47], [0.38, -0.3]], true, 3);

export const SHAPES = {
  protone(t) {
    const Q = [0, 1, 2].map((k) => { const a = (k * TAU) / 3 + t * 0.4; return [0.2 * Math.cos(a) + Math.sin(t * 3 + k) * 0.015, 0.2 * Math.sin(a)]; });
    const L = [S(circ(0, 0, 0.5, 60), 'sky', { f: 0.06, a: 0.7 }), S(circ(0, 0, 0.5, 60), 'coral', { a: 0.4, w: 2 })];
    for (let k = 0; k < 3; k++) { const [a, b] = [Q[k], Q[(k + 1) % 3]]; L.push(S(wave(a[0], a[1], b[0], b[1], 0.025, 4, t * 6 + k), 'sun', { a: 0.75, w: 0.7 })); }
    Q.forEach(([x, y], k) => L.push(D(x, y, 0.1, ['coral', 'mint', 'sky'][k], { f: 0.35 })));
    return L;
  },
  nucleo(t) {
    return [S(circ(0, 0, 0.5, 60), 'coral', { f: 0.04, a: 0.35 }), ...NUC.map(([x, y, c, i]) => D(x + (i ? Math.sin(t * 5 + i) * 0.01 : 0), y + (i ? Math.cos(t * 4 + i * 2) * 0.01 : 0), 0.1, c, { f: 0.28 }))];
  },
  atomo(t) {
    const L = [S(circ(0, 0, 0.5, 60), 'sky', { f: 0.05, a: 0.25 }), D(0, 0, 0.035, 'coral', { f: 0.5 })];
    for (let k = 0; k < 3; k++) {
      const rot = (k * TAU) / 6 + t * 0.12, a = t * (1.5 + k * 0.35) + k * 2;
      L.push(S(ell(0, 0, 0.48, 0.16, rot, 64), 'sky', { a: 0.55, w: 0.8 }));
      L.push(S(ell(0, 0, 0.48, 0.16, rot, 16, a - 0.9, a), 'mint', { a: 0.9 }));
      const c = Math.cos(rot), s = Math.sin(rot), x = 0.48 * Math.cos(a), y = 0.16 * Math.sin(a);
      L.push(D(x * c - y * s, x * s + y * c, 0.03, 'mint', { f: 0.6 }));
    }
    return L;
  },
  dna(t) {
    const L = [], A = [], B = [];
    for (let i = 0; i <= 90; i++) { const y = -0.5 + i / 90, ph = (y / 0.34) * TAU + t * 1.2; A.push([0.16 * Math.cos(ph), y]); B.push([0.16 * Math.cos(ph + Math.PI * 0.8), y]); }
    for (let i = 0; i < 20; i++) {
      const y = -0.475 + i * 0.05, ph = (y / 0.34) * TAU + t * 1.2, depth = Math.sin(ph + 0.4);
      L.push(S([[0.16 * Math.cos(ph), y], [0.16 * Math.cos(ph + Math.PI * 0.8), y]], i % 3 ? 'sun' : 'pink', { a: 0.45 + 0.35 * depth, w: 0.8 }));
    }
    L.push(S(A, 'sky', { w: 1.2 }), S(B, 'mint', { w: 1.2 }));
    return L;
  },
  virus(t) {
    const L = [], r = 0.3, body = [];
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + t * 0.15; body.push([r * Math.cos(a), r * Math.sin(a)]); }
    body.push(body[0]);
    L.push(S(body, 'green', { f: 0.12 }));
    for (let i = 0; i < 6; i++) L.push(S([[0, 0], body[i]], 'green', { a: 0.3, w: 0.6 }));
    const rna = []; for (let i = 0; i <= 60; i++) { const u = i / 60, a = u * TAU * 2.5 + t; rna.push([(0.05 + 0.12 * u) * Math.cos(a), (0.05 + 0.12 * u) * Math.sin(a)]); }
    L.push(S(rna, 'sun', { a: 0.75, w: 0.7 }));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + t * 0.15, w = 1 + 0.05 * Math.sin(t * 3 + i), r0 = r * 0.92;
      L.push(S([[r0 * Math.cos(a), r0 * Math.sin(a)], [0.44 * w * Math.cos(a), 0.44 * w * Math.sin(a)]], 'green', { w: 0.9 }));
      L.push(D(0.46 * w * Math.cos(a), 0.46 * w * Math.sin(a), 0.035, 'green', { f: 0.4 }));
    }
    return L;
  },
  batterio(t) {
    const rot = -0.15, cap = (rx, ry) => { const p = []; for (let i = 0; i <= 60; i++) { const a = (i / 60) * TAU, c = Math.cos(a), s = Math.sin(a); p.push([Math.sign(c) * Math.pow(Math.abs(c), 0.6) * rx, Math.sign(s) * Math.pow(Math.abs(s), 0.6) * ry]); } return p.map(([x, y]) => [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]); };
    const L = [S(cap(0.4, 0.17), 'mint', { f: 0.12 }), S(cap(0.36, 0.13), 'mint', { a: 0.4, w: 0.6 })];
    const dna = []; for (let i = 0; i <= 50; i++) { const u = i / 50; dna.push([-0.2 + 0.4 * u, Math.sin(u * 14 + t) * 0.05 + 0.02 - u * 0.06]); }
    L.push(S(dna, 'sun', { a: 0.7, w: 0.7 }));
    for (const k of [-1, 0, 1]) { const p = []; for (let i = 0; i <= 40; i++) { const u = i / 40; p.push([-0.39 - u * 0.12, 0.07 + k * 0.05 + Math.sin(u * 9 - t * 7 + k) * 0.03 * u]); } L.push(S(p, 'mint', { a: 0.75, w: 0.7 })); }
    for (let i = 0; i < 8; i++) { const x = -0.25 + i * 0.075; L.push(S([[x, -0.155 + x * 0.15], [x + 0.01, -0.2 + x * 0.15]], 'mint', { a: 0.5, w: 0.5 })); }
    return L;
  },
  globulo(t) {
    const k = 0.42 + 0.3 * Math.abs(Math.sin(t * 0.5)), rot = 0.3;
    return [S(ell(0, 0, 0.5, 0.5 * k, rot, 64), 'coral', { f: 0.22 }), S(ell(0, 0, 0.42, 0.42 * k, rot, 56), 'coral', { a: 0.35, w: 0.6 }),
      S(ell(0, 0, 0.2, 0.2 * k, rot, 40), 'coral', { a: 0.6, f: 0.18 }), S(ell(-0.12, -0.08 * k, 0.22, 0.22 * k, rot, 20, 3.4, 4.4), 'chalk', { a: 0.5, w: 0.7 })];
  },
  capello() {
    const L = [S([[-1.6, -0.5], [1.6, -0.47]], 'sun'), S([[-1.6, 0.5], [1.6, 0.53]], 'sun'), S([[-1.6, -0.5], [1.6, -0.47], [1.6, 0.53], [-1.6, 0.5]], 'sun', { f: 0.08, a: 0 })];
    for (let i = 0; i < 10; i++) { const x = -1.5 + i * 0.33; L.push(S(smooth([[x, -0.49], [x + 0.1, -0.2], [x + 0.13, 0.15], [x + 0.08, 0.51]], false, 5), 'orange', { a: 0.55, w: 0.7 })); }
    return L;
  },
  acaro(t) {
    const L = [], c = 'chalk';
    L.push(S(smooth([[0.3, 0], [0.18, -0.2], [-0.12, -0.24], [-0.36, -0.12], [-0.4, 0.08], [-0.2, 0.22], [0.12, 0.2]], true), c, { f: 0.1 }));
    L.push(S(ell(0.36, -0.02, 0.09, 0.07, 0, 24), c, { f: 0.15 }), S([[-0.05, -0.23], [-0.08, 0.21]], c, { a: 0.35, w: 0.6 }), S([[-0.22, -0.18], [-0.26, 0.17]], c, { a: 0.35, w: 0.6 }));
    for (let i = 0; i < 4; i++) {
      const x = 0.15 - i * 0.14, ph = Math.sin(t * 6 + i * 1.7) * 0.04;
      L.push(S([[x, -0.18], [x + 0.06 + ph, -0.34], [x + 0.12 + ph, -0.42]], c, { w: 0.8 }), S([[x, 0.17], [x + 0.06 - ph, 0.33], [x + 0.12 - ph, 0.42]], c, { w: 0.8 }));
    }
    return L;
  },
  granello(t) {
    const L = [S(SAND, 'sun', { f: 0.14 })];
    for (const [a, b] of [[2, 12], [8, 18], [14, 22], [5, 20]]) L.push(S([SAND[a], [0.04, -0.03], SAND[b]], 'sun', { a: 0.35, w: 0.6 }));
    L.push(S(smooth([[-0.28, -0.22], [-0.12, -0.34], [0.08, -0.36]], false, 6), 'chalk', { a: 0.4 + 0.3 * Math.sin(t * 2), w: 0.7 }));
    return L;
  },
  formica(t) {
    const L = [], c = 'orange';
    L.push(S(ell(0.36, -0.03, 0.085, 0.075, 0.2, 28), c, { f: 0.25 }), S(ell(0.17, -0.005, 0.11, 0.06, 0.1, 28), c, { f: 0.25 }), S(ell(-0.17, 0.01, 0.22, 0.135, -0.1, 40), c, { f: 0.25 }));
    L.push(S([[0.29, -0.01], [0.27, 0]], c), S([[0.06, 0], [0.04, 0.005]], c));
    for (let i = 0; i < 3; i++) {
      const x = 0.1 + i * 0.07, ph = Math.sin(t * 9 + i * 2.1) * 0.05 * (i % 2 ? -1 : 1);
      L.push(S([[x, 0.03], [x - 0.04 + ph, 0.15], [x - 0.12 + ph * 1.5, 0.3]], c, { w: 0.8 }));
      L.push(S([[x, -0.04], [x - 0.03 - ph, -0.16], [x - 0.11 - ph * 1.5, -0.27]], c, { w: 0.8 }));
    }
    const w = Math.sin(t * 3) * 0.03;
    L.push(S([[0.41, -0.09], [0.47, -0.2], [0.58, -0.22 + w]], c, { w: 0.7 }), S([[0.42, -0.06], [0.52, -0.12], [0.62, -0.08 - w]], c, { w: 0.7 }));
    L.push(D(0.39, -0.05, 0.01, 'chalk', { f: 0.9 }), S(ell(-0.2, -0.04, 0.12, 0.05, -0.1, 16, 3.3, 4.6), 'chalk', { a: 0.5, w: 0.6 }));
    return L;
  },
  moneta(t) {
    const k = 0.82 + 0.18 * Math.cos(t * 0.8), L = [];
    L.push(S(ell(0.025, 0.02, 0.5 * k, 0.5, 0, 64), 'orange', { a: 0.6 }), S(ell(0, 0, 0.5 * k, 0.5, 0, 64), 'sun', { f: 0.16 }), S(ell(0, 0, 0.38 * k, 0.38, 0, 56), 'chalk', { a: 0.5, w: 0.7 }));
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; L.push(S(star4(0.44 * k * Math.cos(a), 0.44 * Math.sin(a), 0.025), 'sun', { a: 0.8, w: 0.5 })); }
    L.push(S([[-0.06 * k, -0.1], [0.03 * k, -0.18], [0.03 * k, 0.18]], 'chalk'), S([[-0.07 * k, 0.18], [0.12 * k, 0.18]], 'chalk'));
    return L;
  },
  mela(t) {
    const p = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU - Math.PI / 2, d = Math.atan2(Math.sin(a + Math.PI / 2), Math.cos(a + Math.PI / 2));
      const r = 0.42 + 0.04 * Math.cos(2 * (a + Math.PI / 2)) - 0.11 * Math.exp(-(d * d) / 0.1) - 0.03 * Math.exp(-((Math.abs(d) - Math.PI) ** 2) / 0.1);
      p.push([r * Math.cos(a) * 1.04, 0.06 + r * Math.sin(a) * 0.95]);
    }
    const sw = Math.sin(t * 1.5) * 0.04, leaf = [[0.03, -0.38], [0.14 + sw, -0.48], [0.3 + sw, -0.44], [0.16 + sw, -0.36]];
    return [S(smooth(p, true, 4), 'coral', { f: 0.2 }), S(ell(-0.18, -0.06, 0.12, 0.2, 0.3, 20, 3.4, 4.6), 'chalk', { a: 0.55, w: 0.8 }),
      S(smooth([[0, -0.3], [0.01, -0.4], [0.05, -0.5]], false, 5), 'chalk', { w: 1.1 }), S(smooth(leaf, true, 5), 'green', { f: 0.3 }), S([[0.05, -0.39], [0.24 + sw, -0.43]], 'green', { a: 0.6, w: 0.6 })];
  },
  gatto(t) {
    const c = 'sun', L = [], tw = Math.sin(t * 1.4) * 0.08, blink = (t % 4) < 0.15 ? 0.2 : 1;
    L.push(S(smooth([[-0.05, -0.08], [-0.24, 0.05], [-0.28, 0.3], [-0.2, 0.49], [0.12, 0.5], [0.14, 0.25], [0.08, 0.02]], false), c, { f: 0.12 }));
    L.push(S(smooth([[-0.22, 0.46], [-0.4, 0.42], [-0.44 + tw, 0.2], [-0.36 + tw * 1.4, 0.04]], false), c, { w: 1.2 }));
    L.push(S([[0.06, 0.12], [0.06, 0.5]], c, { a: 0.7 }), S([[0.12, 0.2], [0.13, 0.5]], c, { a: 0.7 }));
    L.push(S(circ(0.06, -0.2, 0.16, 40), c, { f: 0.12 }), S([[-0.07, -0.29], [-0.06, -0.47], [0.04, -0.34]], c, { f: 0.12 }), S([[0.1, -0.35], [0.2, -0.46], [0.21, -0.27]], c, { f: 0.12 }));
    L.push(S(ell(0.01, -0.22, 0.025, 0.035 * blink, 0, 12), 'chalk', { f: 0.6 }), S(ell(0.12, -0.22, 0.025, 0.035 * blink, 0, 12), 'chalk', { f: 0.6 }));
    L.push(S([[0.055, -0.16], [0.075, -0.16], [0.065, -0.145], [0.055, -0.16]], 'pink', { f: 0.8 }), S(smooth([[0.035, -0.12], [0.065, -0.11], [0.095, -0.12]]), c, { w: 0.6 }));
    for (const s of [-1, 1]) for (const dy of [-0.02, 0.02]) L.push(S([[0.065 + s * 0.06, -0.14 + dy], [0.065 + s * 0.22, -0.15 + dy * 2.5]], 'chalk', { a: 0.55, w: 0.5 }));
    return L;
  },
  persona(t) {
    const c = 'sky', wv = Math.sin(t * 3) * 0.3;
    return [
      S(circ(0, -0.4, 0.085, 32), c, { f: 0.15 }), S(smooth([[-0.035, -0.385], [0, -0.36], [0.035, -0.385]]), c, { w: 0.6 }),
      D(-0.03, -0.42, 0.01, 'chalk', { f: 1 }), D(0.03, -0.42, 0.01, 'chalk', { f: 1 }),
      S(smooth([[-0.07, -0.3], [-0.1, -0.05], [-0.09, 0.06], [0.09, 0.06], [0.1, -0.05], [0.07, -0.3]], true, 4), 'orange', { f: 0.25 }),
      S([[-0.05, 0.06], [-0.08, 0.48]], c), S([[0.05, 0.06], [0.08, 0.48]], c), S([[-0.13, 0.49], [-0.06, 0.49]], c), S([[0.06, 0.49], [0.13, 0.49]], c),
      S(smooth([[-0.07, -0.27], [-0.15, -0.1], [-0.2, 0.04]]), c),
      S(smooth([[0.07, -0.27], [0.17, -0.34], [0.2 + Math.sin(wv) * 0.06, -0.48 + Math.abs(wv) * 0.05]]), c)];
  },
  auto(t) {
    const c = 'coral', L = [];
    L.push(S(smooth([[-0.5, 0.15], [-0.49, 0.0], [-0.33, -0.04], [-0.2, -0.16], [0.12, -0.16], [0.26, -0.03], [0.47, 0.0], [0.5, 0.15]], false, 5).concat([[-0.5, 0.15]]), c, { f: 0.18 }));
    L.push(S([[-0.17, -0.13], [-0.03, -0.13], [-0.03, -0.03], [-0.28, -0.03], [-0.17, -0.13]], 'sky', { f: 0.15, w: 0.7 }), S([[0.01, -0.13], [0.11, -0.13], [0.21, -0.03], [0.01, -0.03], [0.01, -0.13]], 'sky', { f: 0.15, w: 0.7 }));
    L.push(D(0.45, 0.05, 0.025, 'sun', { f: 0.7 }), S([[0.0, 0.02], [0.06, 0.02]], c, { a: 0.6, w: 0.6 }));
    for (const x of [-0.3, 0.3]) {
      L.push(D(x, 0.15, 0.09, 'chalk', { f: 0.25 }), D(x, 0.15, 0.04, 'muted', { f: 0.3 }));
      for (let k = 0; k < 3; k++) { const a = (k * TAU) / 3 + t * 0.5; L.push(S([[x, 0.15], [x + 0.065 * Math.cos(a), 0.15 + 0.065 * Math.sin(a)]], 'muted', { w: 0.5 })); }
    }
    L.push(S([[-0.6, 0.245], [0.6, 0.245]], 'muted', { a: 0.5, w: 0.6 }));
    return L;
  },
  balena(t) {
    const c = 'sky', f = Math.sin(t * 2) * 0.05;
    const body = smooth([[0.48, 0.02], [0.4, -0.12], [0.15, -0.18], [-0.12, -0.12], [-0.3, -0.02], [-0.42, 0.0 + f * 0.5], [-0.3, 0.05], [-0.05, 0.13], [0.25, 0.14], [0.44, 0.09]], true, 5);
    const L = [S(body, c, { f: 0.15 })];
    L.push(S(smooth([[-0.4, 0.0 + f * 0.5], [-0.5, -0.1 + f], [-0.47, -0.03 + f], [-0.52, 0.06 + f], [-0.4, 0.0 + f * 0.5]], true, 4), c, { f: 0.15 }));
    for (let i = 0; i < 5; i++) L.push(S(smooth([[0.38 - i * 0.04, 0.1 + i * 0.006], [0.2 - i * 0.04, 0.12 + i * 0.005], [0.02 - i * 0.03, 0.1]], false, 4), 'chalk', { a: 0.3, w: 0.5 }));
    L.push(S(smooth([[0.12, 0.1], [0.06, 0.2], [0.0, 0.18]], false, 4), c, { f: 0.15 }), D(0.36, -0.03, 0.013, 'chalk', { f: 1 }), S(smooth([[0.36, 0.05], [0.42, 0.06], [0.47, 0.05]]), c, { a: 0.6, w: 0.6 }));
    const sp = (t * 0.7) % 1;
    for (const s of [-1, -0.4, 0.4, 1]) L.push(S(smooth([[0.16, -0.18], [0.16 + s * 0.05 * sp, -0.2 - 0.16 * Math.sin(sp * Math.PI)], [0.16 + s * 0.1 * sp, -0.2 - 0.12 * sp]]), 'sky', { a: (1 - sp) * 0.8, w: 0.7 }));
    return L;
  },
  campo(t) {
    const P = (u, v) => [u * (0.82 + 0.18 * (v + 0.5)), v * 0.24], L = [];
    const quad = (u0, v0, u1, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1), P(u0, v0)];
    for (let i = 0; i < 8; i++) L.push(S(quad(-0.5 + i / 8, -0.5, -0.5 + (i + 1) / 8, 0.5), 'green', { f: i % 2 ? 0.08 : 0.16, a: 0 }));
    L.push(S(quad(-0.5, -0.5, 0.5, 0.5), 'chalk', { w: 0.8 }), S([P(0, -0.5), P(0, 0.5)], 'chalk', { w: 0.7 }));
    L.push(S(ell(0, 0, 0.087 * 0.92, 0.087 * 0.24 * 2 * 0.92, 0, 40), 'chalk', { w: 0.7 }));
    for (const s of [-1, 1]) {
      L.push(S([P(s * 0.5, -0.2), P(s * 0.34, -0.2), P(s * 0.34, 0.2), P(s * 0.5, 0.2)], 'chalk', { w: 0.7 }));
      const g0 = P(s * 0.5, -0.035), g1 = P(s * 0.5, 0.035);
      L.push(S([g0, [g0[0], g0[1] - 0.025], [g1[0], g1[1] - 0.025], g1], 'chalk', { w: 0.8 }));
    }
    L.push(D(0.04 + Math.sin(t) * 0.05, 0.02, 0.006, 'chalk', { f: 1 }));
    return L;
  },
  torre(t) {
    const c = 'orange', L = [], X = (u) => 0.03 + 0.27 * (1 - u) ** 2.4, Y = (u) => 0.5 - u * 0.9;
    for (const s of [-1, 1]) {
      const o = [], i = [];
      for (let k = 0; k <= 30; k++) { const u = k / 30; o.push([s * X(u), Y(u)]); i.push([s * Math.max(0.012, X(u) - 0.05 * (1 - u) - 0.012), Y(u)]); }
      L.push(S(o, c), S(i.slice(0, 26), c, { a: 0.6, w: 0.6 }));
      for (let k = 0; k < 14; k++) { const u0 = k / 16, u1 = (k + 1) / 16; L.push(S([[s * X(u0), Y(u0)], [s * Math.max(0.012, X(u1) - 0.05 * (1 - u1) - 0.012), Y(u1)]], c, { a: 0.4, w: 0.5 })); }
    }
    for (const u of [0.18, 0.45, 0.72]) { const x = X(u) + 0.035; L.push(S([[-x, Y(u)], [x, Y(u)], [x - 0.01, Y(u) - 0.02], [-x + 0.01, Y(u) - 0.02], [-x, Y(u)]], c, { f: 0.25 })); }
    L.push(S(ell(0, 0.5, 0.17, 0.15, 0, 30, Math.PI, TAU), c, { a: 0.8 }), S([[0, -0.4], [0, -0.5]], c));
    L.push(D(0, -0.5, 0.012, 'sun', { f: 0.5 + 0.5 * Math.sin(t * 4) }));
    return L;
  },
  everest(t) {
    const back = smooth([[-1, 0.5], [-0.75, 0.0], [-0.55, 0.12], [-0.3, -0.12], [0.3, -0.05], [0.55, -0.22], [0.8, 0.05], [1, 0.5]], false, 4);
    const m = [[-0.95, 0.5], [-0.62, 0.1], [-0.48, 0.2], [-0.2, -0.22], [-0.09, -0.13], [0, -0.5], [0.2, -0.12], [0.3, -0.22], [0.6, 0.18], [0.95, 0.5]];
    const snow = [[-0.13, -0.3], [-0.07, -0.22], [-0.03, -0.3], [0.03, -0.21], [0.09, -0.29], [0.135, -0.26], [0, -0.5], [-0.13, -0.3]];
    const d = ((t * 0.04) % 1) * 2.6 - 1.3, L = [S(back, 'muted', { a: 0.35, f: 0.05 }), S(m, 'chalk', { f: 0.07 }), S(snow, 'chalk', { f: 0.35, w: 0.7 })];
    L.push(S([[0, -0.2], [0.04, 0.2], [0.02, 0.5]], 'chalk', { a: 0.3, w: 0.5 }), S([[-0.2, -0.22], [-0.3, 0.2]], 'chalk', { a: 0.3, w: 0.5 }));
    L.push(S([[0, -0.5], [0, -0.58]], 'chalk', { w: 0.6 }), S(wave(0, -0.58, 0.06, -0.57, 0.005, 1, t * 5).concat([[0.06, -0.55], [0, -0.555]]), 'coral', { f: 0.5, w: 0.6 }));
    for (const [dx, dy, k] of [[0, -0.36, 1], [0.5, -0.1, 0.7]]) L.push(S(smooth([[d + dx - 0.18 * k, dy], [d + dx - 0.1 * k, dy - 0.05 * k], [d + dx, dy - 0.07 * k], [d + dx + 0.1 * k, dy - 0.04 * k], [d + dx + 0.18 * k, dy]], false, 5), 'muted', { a: 0.6, f: 0.08 }));
    return L;
  },
  italia() {
    const b = [[-0.25, -0.45], [-0.05, -0.5], [0.15, -0.48], [0.22, -0.42], [0.12, -0.36], [0.1, -0.3], [0.15, -0.2], [0.22, -0.1], [0.3, -0.04], [0.36, -0.03], [0.34, 0.02], [0.42, 0.08], [0.48, 0.14], [0.44, 0.17], [0.38, 0.12], [0.32, 0.1], [0.3, 0.16], [0.27, 0.26], [0.24, 0.33], [0.2, 0.32], [0.22, 0.22], [0.18, 0.14], [0.1, 0.06], [0, -0.02], [-0.08, -0.12], [-0.14, -0.22], [-0.2, -0.3], [-0.3, -0.32], [-0.32, -0.4]];
    const sic = [[0.2, 0.36], [0.235, 0.445], [0.12, 0.43], [0.03, 0.44], [0.1, 0.38]];
    const sar = [[-0.22, -0.02], [-0.16, 0.0], [-0.16, 0.14], [-0.23, 0.15], [-0.25, 0.04]];
    return [S(smooth(b, true, 3), 'green', { f: 0.14 }), S(smooth(sic, true, 3), 'green', { f: 0.14 }), S(smooth(sar, true, 3), 'green', { f: 0.14 }),
      S(smooth([[-0.3, -0.38], [-0.1, -0.44], [0.12, -0.42]], false, 4), 'chalk', { a: 0.5, w: 0.6 }), D(0.04, -0.06, 0.012, 'sun', { f: 1 }), { t: 'Roma', x: 0.04, y: -0.1, c: 'sun' }];
  },
  luna() {
    const L = [S(circ(0, 0, 0.5, 60), 'chalk', { f: 0.1 }), S(ell(0, 0, 0.18, 0.5, 0, 40, -Math.PI / 2, Math.PI / 2).concat(ell(0, 0, 0.5, 0.5, 0, 40, Math.PI / 2, -Math.PI / 2 + TAU).reverse()), 'night', { f: 0.4, a: 0 })];
    for (const [x, y, r] of [[-0.18, -0.15, 0.1], [0.12, 0.18, 0.07], [-0.05, 0.28, 0.05], [0.2, -0.2, 0.06], [-0.3, 0.12, 0.05]]) L.push(S(circ(x, y, r, 24), 'muted', { f: 0.15, w: 0.6 }));
    return L;
  },
  terra(t) {
    const L = [S(circ(0, 0, 0.56, 60), 'sky', { a: 0.15, w: 3 }), S(circ(0, 0, 0.5, 60), 'sky', { f: 0.12 })];
    L.push(S([[-0.5, 0], [0.5, 0]], 'sky', { a: 0.3, w: 0.6 }), S(ell(0, -0.25, 0.433, 0.06, 0, 40), 'sky', { a: 0.25, w: 0.6 }), S(ell(0, 0.25, 0.433, 0.06, 0, 40), 'sky', { a: 0.25, w: 0.6 }));
    for (let k = 0; k < 4; k++) {
      const ph = ((t * 0.2 + k / 4) % 1) * Math.PI, rx = 0.5 * Math.cos(ph);
      L.push(S(ell(0, 0, Math.abs(rx), 0.5, 0, 40, -Math.PI / 2, Math.PI / 2).map(([x, y]) => [rx < 0 ? -x : x, y]), 'sky', { a: 0.25, w: 0.6 }));
    }
    L.push(S(smooth([[0.02, -0.38], [0.14, -0.32], [0.1, -0.2], [0.18, -0.1], [0.16, 0.06], [0.08, 0.24], [0.02, 0.1], [-0.08, -0.06], [-0.04, -0.2], [-0.06, -0.3]], true, 4), 'green', { f: 0.25 }));
    L.push(S(smooth([[-0.3, -0.3], [-0.2, -0.36], [-0.16, -0.24], [-0.3, -0.12], [-0.38, -0.2]], true, 4), 'green', { f: 0.25 }));
    const cl = t * 0.06;
    for (const [y, x0] of [[-0.14, -0.35], [0.3, -0.2], [0.04, 0.12]]) L.push(S(smooth([[x0 + cl % 0.2, y], [x0 + 0.1 + cl % 0.2, y - 0.03], [x0 + 0.22 + cl % 0.2, y]], false, 4), 'chalk', { a: 0.45, w: 0.8 }));
    return L;
  },
  giove(t) {
    const L = [S(circ(0, 0, 0.5, 60), 'orange', { f: 0.12 })];
    for (const [y, c, a] of [[-0.3, 'sun', 0.6], [-0.15, 'orange', 0.7], [-0.02, 'sun', 0.5], [0.12, 'orange', 0.7], [0.28, 'sun', 0.6]]) {
      const hw = Math.sqrt(0.25 - y * y), p = [];
      for (let i = 0; i <= 30; i++) { const u = i / 30, x = -hw + 2 * hw * u; p.push([x, y + Math.sin(u * 12 + t + y * 10) * 0.012]); }
      L.push(S(p, c, { a, w: 0.8 }));
    }
    const sx = ((t * 0.04) % 1) * 0.6 - 0.3;
    L.push(S(ell(sx, 0.2, 0.08, 0.045, 0, 24), 'coral', { f: 0.4 * (1 - Math.abs(sx) * 2) + 0.1, a: 1 - Math.abs(sx) * 2 }));
    return L;
  },
  sole(t) {
    const L = [S(circ(0, 0, 0.62, 60), 'sun', { a: 0.12, w: 5 }), S(circ(0, 0, 0.5, 60), 'sun', { f: 0.2 })];
    const fl = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU, r = 0.36 + 0.03 * Math.sin(a * 7 + t * 2); fl.push([r * Math.cos(a), r * Math.sin(a)]); }
    L.push(S(smooth(fl, true, 3), 'orange', { a: 0.55, f: 0.12 }));
    const r = rnd(9);
    for (let i = 0; i < 14; i++) { const x = r() * 0.6 - 0.3, y = r() * 0.6 - 0.3; if (x * x + y * y < 0.08) L.push(S(circ(x, y, 0.025 + 0.01 * Math.sin(t * 2 + i), 10), 'orange', { a: 0.4, w: 0.5 })); }
    const pa = 0.7 + Math.sin(t * 0.7) * 0.15;
    L.push(S(smooth([[0.5 * Math.cos(pa - 0.12), -0.5 * Math.sin(pa - 0.12)], [0.62 * Math.cos(pa), -0.66 * Math.sin(pa)], [0.5 * Math.cos(pa + 0.12), -0.5 * Math.sin(pa + 0.12)]], false, 6), 'coral', { a: 0.85 }));
    for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU + t * 0.1, l = 0.68 + 0.05 * Math.sin(t * 3 + i * 1.7); L.push(S([[0.6 * Math.cos(a), 0.6 * Math.sin(a)], [l * Math.cos(a), l * Math.sin(a)]], 'sun', { a: 0.7 })); }
    return L;
  },
  sistema(t) {
    const L = [D(0, 0, 0.03, 'sun', { f: 0.8 }), S(circ(0, 0, 0.05, 20), 'sun', { a: 0.25, w: 2.5 })], R = [0.06, 0.09, 0.12, 0.16, 0.25, 0.32, 0.41, 0.5];
    for (const [r, a] of ASTER) { const aa = a + t * 0.05; L.push(D(r * Math.cos(aa), r * 0.42 * Math.sin(aa), 0.002, 'muted', { f: 1 })); }
    R.forEach((r, i) => {
      L.push(S(ell(0, 0, r, r * 0.42, 0, 64), 'muted', { a: 0.4, w: 0.6 }));
      const a = t * 1.2 * Math.pow(0.06 / r, 1.5) + i * 1.9, x = r * Math.cos(a), y = r * 0.42 * Math.sin(a);
      const pr = [0.007, 0.01, 0.011, 0.009, 0.022, 0.018, 0.014, 0.014][i];
      L.push(D(x, y, pr, ['chalk', 'sun', 'sky', 'coral', 'orange', 'sun', 'mint', 'sky'][i], { f: 0.5 }));
      if (i === 5) L.push(S(ell(x, y, pr * 2.2, pr * 0.7, -0.3, 24), 'sun', { a: 0.8, w: 0.6 }));
    });
    return L;
  },
  stelle(t) {
    const L = [], st = [[0, 0, 'sun', 'Sole'], [0.4, -0.1, 'chalk', 'Alfa Centauri'], [-0.26, 0.3, 'coral', 'Stella di Barnard'], [-0.38, -0.24, 'sky', 'Sirio'], [0.18, 0.36, 'coral', 'Wolf 359']];
    const r = rnd(21);
    for (let i = 0; i < 40; i++) { const x = r() - 0.5, y = r() - 0.5; L.push(D(x, y, 0.002 + r() * 0.003, 'muted', { f: 0.8, a: 0.5 + 0.5 * Math.sin(t * 2 + i) })); }
    st.forEach(([x, y, c, n], i) => { const k = 0.03 * (1 + 0.15 * Math.sin(t * 3 + i)); L.push(S(star4(x, y, k), c, { f: 0.5, w: 0.7 }), { t: n, x, y: y - 0.05, c }); });
    L.push(S([[0, 0], [0.4, -0.1]], 'muted', { a: 0.5, w: 0.5 }), { t: '4,2 anni luce', x: 0.22, y: -0.0, c: 'muted' });
    return L;
  },
  galassia(t) {
    const L = [S(ell(0, 0, 0.5, 0.31, 0, 60), 'boss', { f: 0.04, a: 0.15 }), S(ell(0, 0, 0.09, 0.06, 0, 30), 'sun', { f: 0.35, a: 0.8 }), S(ell(0, 0, 0.16, 0.1, 0, 30), 'pink', { a: 0.2, w: 2.5 })], rot = t * 0.05;
    for (const arm of [0, Math.PI]) {
      const p = []; for (let i = 0; i <= 50; i++) { const u = i / 50, a = arm + rot + u * 3.6, r = 0.06 + 0.44 * u; p.push([r * Math.cos(a), r * 0.62 * Math.sin(a)]); }
      L.push(S(p, 'boss', { a: 0.7 }));
    }
    for (const [r, a, s, c] of GAL) { const aa = a + rot; L.push(D(r * Math.cos(aa), r * 0.62 * Math.sin(aa), s, c, { f: 0.8, a: 0.85 })); }
    return L;
  },
  gruppo(t) {
    const L = [S(circ(0, 0, 0.5, 64), 'muted', { a: 0.2, f: 0.02 })];
    const gal = (cx, cy, s, tilt, col, rot = 0) => {
      L.push(S(ell(cx, cy, s * 0.2, s * 0.2 * tilt, rot, 16), col, { f: 0.4 }));
      for (const arm of [0, Math.PI]) {
        const p = []; for (let i = 0; i <= 24; i++) { const u = i / 24, a = arm + t * 0.04 + u * 3, r = s * (0.15 + 0.85 * u); const x = r * Math.cos(a), y = r * tilt * Math.sin(a); p.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); }
        L.push(S(p, col, { a: 0.8 }));
      }
    };
    gal(0.12, -0.14, 0.13, 0.4, 'sky', -0.5);
    gal(0.32, 0.2, 0.05, 0.7, 'mint', 0.4);
    for (const [x, y] of [[-0.38, -0.25], [-0.28, 0.33], [0.4, -0.3], [-0.42, 0.06], [0.05, 0.4], [0.28, -0.04], [-0.06, 0.06], [-0.16, 0.16]]) L.push(D(x, y, 0.008, 'muted', { f: 0.6 }));
    L.push({ t: 'Andromeda', x: 0.12, y: -0.23, c: 'sky' });
    return L;
  },
  universo(t) {
    const L = [S(circ(0, 0, 0.5, 72), 'boss', { a: 0.35, f: 0.03 })];
    for (const [i, j] of WEBL) L.push(S([[WEB[i][0], WEB[i][1]], [WEB[j][0], WEB[j][1]]], 'boss', { a: 0.4, w: 0.6 }));
    WEB.forEach(([x, y, r], i) => L.push(D(x, y, r * (1 + 0.15 * Math.sin(t * 2 + i)), i % 3 ? 'pink' : 'sky', { f: 0.6 })));
    return L;
  },
};
