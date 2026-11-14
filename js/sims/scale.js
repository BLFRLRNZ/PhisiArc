// Zoom delle grandezze: dall'atomo alle galassie, una potenza di 10 alla volta.
// Ogni oggetto è disegnato a linee e vive "dentro" (o accanto) a quello più grande:
// zoomando la camera scivola da uno all'altro, i piccoli nascono da un puntino e si disegnano da soli.
import { Sim, clamp01, easeInOut } from './base.js';

const TAU = Math.PI * 2;
const ell = (cx, cy, rx, ry, rot = 0, n = 48, a0 = 0, a1 = TAU) => {
  const p = [], c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n, x = rx * Math.cos(a), y = ry * Math.sin(a);
    p.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return p;
};
const circ = (cx, cy, r, n = 40) => ell(cx, cy, r, r, 0, n);

// Forme in coordinate "unità": la grandezza caratteristica dell'oggetto vale 1, centro in (0,0), y verso il basso.
// Ognuna restituisce { L: [[punti, colore, alfa?]], D: [[x, y, r, colore]] }.
const SHAPES = {
  atomo(t) {
    const L = [], D = [[0, 0, 0.07, 'coral'], [0.05, -0.03, 0.05, 'sun']];
    for (let k = 0; k < 3; k++) {
      const rot = (k * TAU) / 6 + t * 0.15;
      L.push([ell(0, 0, 0.5, 0.17, rot), 'sky', 0.8]);
      const a = t * (1.6 + k * 0.3) + k * 2, c = Math.cos(rot), s = Math.sin(rot), x = 0.5 * Math.cos(a), y = 0.17 * Math.sin(a);
      D.push([x * c - y * s, x * s + y * c, 0.035, 'mint']);
    }
    return { L, D };
  },
  virus(t) {
    const L = [], D = [], r = 0.3;
    const body = [];
    for (let i = 0; i <= 48; i++) { const a = (i / 48) * TAU; const rr = r * (1 + 0.04 * Math.sin(a * 5 + t * 2)); body.push([rr * Math.cos(a), rr * Math.sin(a)]); }
    L.push([body, 'green']);
    L.push([circ(0, 0, r * 0.55, 30), 'green', 0.45]);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * TAU + t * 0.2, w = 1 + 0.06 * Math.sin(t * 3 + i);
      L.push([[[r * Math.cos(a), r * Math.sin(a)], [0.45 * w * Math.cos(a), 0.45 * w * Math.sin(a)]], 'green']);
      D.push([0.47 * w * Math.cos(a), 0.47 * w * Math.sin(a), 0.03, 'green']);
    }
    return { L, D };
  },
  globulo(t) {
    const k = 0.42 + 0.3 * Math.abs(Math.sin(t * 0.6));
    return { L: [[ell(0, 0, 0.5, 0.5 * k, 0.3), 'coral'], [ell(0, 0, 0.24, 0.24 * k, 0.3, 32), 'coral', 0.6]], D: [] };
  },
  granello() {
    const R = [0.46, 0.38, 0.5, 0.42, 0.47, 0.36, 0.44, 0.5, 0.4];
    const p = R.map((r, i) => { const a = (i / R.length) * TAU + 0.2; return [r * Math.cos(a), r * Math.sin(a)]; });
    p.push(p[0]);
    return { L: [[p, 'sun'], [[p[1], [0.05, -0.04], p[4]], 'sun', 0.5], [[[0.05, -0.04], p[7]], 'sun', 0.5]], D: [] };
  },
  formica(t) {
    const L = [], c = 'orange';
    L.push([circ(0.36, -0.02, 0.08, 24), c], [ell(0.16, 0, 0.11, 0.065, 0, 28), c], [ell(-0.17, 0.01, 0.21, 0.13, -0.08, 36), c]);
    for (let i = 0; i < 3; i++) {
      const x = 0.1 + i * 0.06, ph = Math.sin(t * 8 + i * 2.1) * 0.06 * (i % 2 ? -1 : 1);
      L.push([[[x, 0.03], [x - 0.08 + ph, 0.16], [x - 0.12 + ph, 0.28]], c, 0.85]);
      L.push([[[x, -0.03], [x - 0.06 - ph, -0.15], [x - 0.11 - ph, -0.25]], c, 0.85]);
    }
    const w = Math.sin(t * 3) * 0.03;
    L.push([[[0.42, -0.07], [0.5, -0.2 + w], [0.56, -0.18 + w]], c], [[[0.43, 0.02], [0.53, -0.06 - w], [0.6, -0.02 - w]], c]);
    return { L, D: [[0.39, -0.04, 0.012, 'chalk']] };
  },
  mela(t) {
    const p = [];
    for (let i = 0; i <= 60; i++) {
      const a = (i / 60) * TAU - Math.PI / 2;
      let r = 0.42 + 0.04 * Math.cos(2 * (a + Math.PI / 2));
      const d = Math.atan2(Math.sin(a + Math.PI / 2), Math.cos(a + Math.PI / 2));
      r -= 0.1 * Math.exp(-(d * d) / 0.12);
      p.push([r * Math.cos(a), 0.05 + r * Math.sin(a) * 0.95]);
    }
    const sw = Math.sin(t * 1.5) * 0.04;
    return { L: [[p, 'coral'], [[[0, -0.27], [0.03, -0.42], [0.06 + sw, -0.48]], 'chalk'], [ell(0.16 + sw, -0.4, 0.11, 0.045, -0.4, 24), 'green']], D: [] };
  },
  persona(t) {
    const c = 'sky', wv = Math.sin(t * 3) * 0.35;
    return {
      L: [[circ(0, -0.4, 0.09, 24), c], [[[0, -0.31], [0, 0.06]], c],
        [[[0, 0.06], [-0.1, 0.5]], c], [[[0, 0.06], [0.1, 0.5]], c],
        [[[0, -0.22], [-0.16, -0.02], [-0.22, 0.04]], c],
        [[[0, -0.22], [0.16, -0.32], [0.2 + Math.sin(wv) * 0.06, -0.48 + Math.abs(wv) * 0.05]], c]],
      D: [],
    };
  },
  balena(t) {
    const c = 'sky', top = [], bot = [];
    for (let i = 0; i <= 30; i++) { const u = i / 30, x = -0.32 + u * 0.82; top.push([x, -0.18 * Math.sin(Math.PI * (0.15 + 0.85 * u)) + 0.02]); bot.push([x, 0.11 * Math.sin(Math.PI * (0.1 + 0.9 * u)) + 0.04]); }
    const f = Math.sin(t * 2) * 0.05;
    const tail = [[-0.32, 0.02], [-0.45, -0.02 + f], [-0.5, -0.12 + f], [-0.43, 0.0 + f], [-0.5, 0.1 + f], [-0.32, 0.04]];
    const L = [[top, c], [bot, c], [tail, c], [[[0.24, 0.08], [0.32, 0.05], [0.42, 0.06]], c, 0.6]];
    const sp = (t * 0.8) % 1;
    for (const s of [-1, 0, 1]) L.push([[[0.14, -0.2], [0.14 + s * 0.08 * sp, -0.2 - 0.18 * Math.sin(sp * Math.PI)]], 'chalk', 1 - sp]);
    return { L, D: [[0.33, -0.04, 0.012, 'chalk']] };
  },
  torre(t) {
    const c = 'orange', L = [], leg = (s) => { const p = []; for (let i = 0; i <= 24; i++) { const u = i / 24; p.push([s * (0.03 + 0.27 * (1 - u) ** 2.4), 0.5 - u * 0.9]); } return p; };
    L.push([leg(1), c], [leg(-1), c], [[[0, -0.4], [0, -0.5]], c]);
    for (const u of [0.18, 0.45, 0.72]) { const y = 0.5 - u * 0.9, x = 0.03 + 0.27 * (1 - u) ** 2.4 + 0.03; L.push([[[-x, y], [x, y]], c]); }
    L.push([ell(0, 0.5, 0.17, 0.16, 0, 24, Math.PI, TAU), c, 0.7]);
    return { L, D: [[0, -0.5, 0.012 + 0.006 * Math.sin(t * 4), 'sun']] };
  },
  everest(t) {
    const c = 'chalk', m = [[-0.95, 0.5], [-0.6, 0.12], [-0.45, 0.22], [-0.18, -0.2], [-0.08, -0.12], [0, -0.5], [0.22, -0.1], [0.32, -0.2], [0.6, 0.2], [0.95, 0.5]];
    const snow = [[-0.12, -0.27], [-0.06, -0.2], [-0.02, -0.28], [0.04, -0.2], [0.1, -0.3], [0.13, -0.26]];
    const d = ((t * 0.04) % 1) * 2.4 - 1.2;
    return { L: [[m, c], [snow, 'sky'], [[[d - 0.2, -0.35], [d + 0.15, -0.35]], 'muted', 0.6], [[[d - 0.05, -0.39], [d + 0.08, -0.39]], 'muted', 0.6]], D: [] };
  },
  italia() {
    const b = [[-0.25, -0.45], [-0.05, -0.5], [0.15, -0.48], [0.22, -0.42], [0.12, -0.36], [0.1, -0.3], [0.15, -0.2], [0.22, -0.1], [0.3, -0.04], [0.36, -0.03], [0.34, 0.02], [0.42, 0.08], [0.48, 0.14], [0.44, 0.17], [0.38, 0.12], [0.32, 0.1], [0.3, 0.16], [0.27, 0.26], [0.24, 0.33], [0.2, 0.32], [0.22, 0.22], [0.18, 0.14], [0.1, 0.06], [0, -0.02], [-0.08, -0.12], [-0.14, -0.22], [-0.2, -0.3], [-0.3, -0.32], [-0.32, -0.4], [-0.25, -0.45]];
    const sic = [[0.2, 0.36], [0.23, 0.45], [0.03, 0.44], [0.2, 0.36]];
    const sar = [[-0.22, -0.02], [-0.16, 0.0], [-0.17, 0.14], [-0.23, 0.15], [-0.25, 0.04], [-0.22, -0.02]];
    return { L: [[b, 'green'], [sic, 'green'], [sar, 'green']], D: [] };
  },
  terra(t) {
    const L = [[circ(0, 0, 0.5, 60), 'sky'], [[[-0.5, 0], [0.5, 0]], 'sky', 0.5], [ell(0, -0.25, 0.433, 0.06, 0, 40), 'sky', 0.35], [ell(0, 0.25, 0.433, 0.06, 0, 40), 'sky', 0.35]];
    for (let k = 0; k < 4; k++) {
      const ph = ((t * 0.25 + k / 4) % 1) * Math.PI, rx = 0.5 * Math.cos(ph);
      L.push([ell(0, 0, Math.abs(rx), 0.5, 0, 40, -Math.PI / 2, Math.PI / 2).map(([x, y]) => [rx < 0 ? -x : x, y]), 'sky', 0.35]);
    }
    L.push([[[0.02, -0.34], [0.12, -0.3], [0.16, -0.18], [0.08, -0.08], [0.12, 0.08], [0.04, 0.2], [-0.02, 0.05], [-0.06, -0.12], [-0.04, -0.28], [0.02, -0.34]], 'green']);
    return { L, D: [] };
  },
  sole(t) {
    const L = [[circ(0, 0, 0.5, 60), 'sun']];
    const fl = [];
    for (let i = 0; i <= 60; i++) { const a = (i / 60) * TAU; const r = 0.36 + 0.025 * Math.sin(a * 7 + t * 2); fl.push([r * Math.cos(a), r * Math.sin(a)]); }
    L.push([fl, 'orange', 0.6]);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU + t * 0.15, l = 0.66 + 0.05 * Math.sin(t * 3 + i * 1.7);
      L.push([[[0.58 * Math.cos(a), 0.58 * Math.sin(a)], [l * Math.cos(a), l * Math.sin(a)]], 'sun']);
    }
    return { L, D: [] };
  },
  sistema(t) {
    const L = [], D = [[0, 0, 0.025, 'sun']], R = [0.06, 0.09, 0.12, 0.16, 0.25, 0.32, 0.41, 0.5];
    R.forEach((r, i) => {
      L.push([ell(0, 0, r, r * 0.42, 0, 56), 'muted', 0.55]);
      const a = t * 1.2 * Math.pow(0.06 / r, 1.5) + i * 1.9;
      D.push([r * Math.cos(a), r * 0.42 * Math.sin(a), i === 5 ? 0.016 : 0.011, ['chalk', 'sun', 'sky', 'coral', 'orange', 'sun', 'mint', 'sky'][i]]);
    });
    return { L, D };
  },
  galassia(t) {
    const L = [], D = [], rot = t * 0.08;
    for (const arm of [0, Math.PI]) {
      const p = [];
      for (let i = 0; i <= 50; i++) { const u = i / 50, a = arm + rot + u * 3.4, r = 0.05 + 0.45 * u; p.push([r * Math.cos(a), r * 0.62 * Math.sin(a)]); }
      L.push([p, 'boss']);
      for (let i = 4; i < 50; i += 5) { const u = i / 50, a = arm + rot + u * 3.4 + 0.18, r = 0.05 + 0.45 * u; D.push([r * Math.cos(a), r * 0.62 * Math.sin(a), 0.008, 'pink']); }
    }
    L.push([ell(0, 0, 0.07, 0.045, 0, 24), 'pink']);
    return { L, D };
  },
  gruppo(t) {
    const L = [], D = [];
    const gal = (cx, cy, s, tilt, col) => {
      for (const arm of [0, Math.PI]) {
        const p = [];
        for (let i = 0; i <= 24; i++) { const u = i / 24, a = arm + t * 0.05 + u * 3, r = s * (0.1 + 0.9 * u); p.push([cx + r * Math.cos(a), cy + r * tilt * Math.sin(a)]); }
        L.push([p, col, 0.8]);
      }
    };
    gal(0.12, -0.14, 0.12, 0.45, 'sky'); // Andromeda
    gal(0.34, 0.22, 0.05, 0.7, 'mint'); // Triangolo
    for (const [x, y] of [[-0.38, -0.3], [-0.3, 0.35], [0.42, -0.36], [-0.44, 0.06], [0.05, 0.42], [0.3, -0.05]]) D.push([x, y, 0.012, 'muted']);
    L.push([circ(0, 0, 0.5, 64), 'muted', 0.25]);
    return { L, D };
  },
};

// size = metri; off = posizione dentro l'oggetto più grande che viene dopo (in sue unità).
export const OBJECTS = [
  { name: 'atomo', size: 1e-10, shape: 'atomo', off: [0.1, 0.05] },
  { name: 'virus', size: 1e-7, shape: 'virus', off: [0.15, 0.05] },
  { name: 'globulo rosso', size: 8e-6, shape: 'globulo', off: [0.1, -0.1] },
  { name: 'granello di sabbia', size: 1e-3, shape: 'granello', off: [0.56, -0.02] },
  { name: 'formica', size: 4e-3, shape: 'formica', off: [0.12, -0.36] },
  { name: 'mela', size: 8e-2, shape: 'mela', off: [-0.22, 0.06] },
  { name: 'persona', size: 1.7, shape: 'persona', off: [0.06, -0.195] },
  { name: 'balena', size: 25, shape: 'balena', off: [0.3, 0.488] },
  { name: 'Torre Eiffel', size: 330, shape: 'torre', off: [-0.62, 0.48] },
  { name: 'Everest', size: 8.8e3, shape: 'everest', off: [0.0, -0.45] },
  { name: 'Italia (lunghezza)', size: 1.2e6, shape: 'italia', off: [0.08, -0.3] },
  { name: 'Terra', size: 1.27e7, shape: 'terra', off: [0.8, 0.05] },
  { name: 'Sole', size: 1.39e9, shape: 'sole', off: [0, 0], lab: 0.2 },
  { name: 'Sistema solare', size: 9e12, shape: 'sistema', off: [0.22, 0.1] },
  { name: 'Via Lattea', size: 1e21, shape: 'galassia', off: [-0.12, 0.1] },
  { name: 'Gruppo Locale di galassie', size: 1e23, shape: 'gruppo', off: [0, 0] },
];
const LE = OBJECTS.map((o) => Math.log10(o.size));

const words = (e) => {
  const r = Math.round(e);
  const map = {
    '-10': 'un decimo di miliardesimo di metro', '-9': 'un nanometro', '-6': 'un micrometro',
    '-3': 'un millimetro', '-2': 'un centimetro', 0: 'un metro', 3: 'un chilometro',
    6: 'mille chilometri', 9: 'un milione di chilometri', 16: 'circa un anno luce', 21: 'centomila anni luce',
  };
  return map[r] || '';
};

export const sup = (n) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);

const nice = (m) => {
  const units = [[1e-9, 'nm'], [1e-6, 'µm'], [1e-3, 'mm'], [1e-2, 'cm'], [1, 'm'], [1e3, 'km']];
  if (m >= 9.46e15) return `${(m / 9.46e15).toLocaleString('it-IT', { maximumSignificantDigits: 2 })} anni luce`;
  if (m >= 1e9) return `${(m / 1e3).toLocaleString('it-IT', { maximumSignificantDigits: 2 })} km`;
  if (m < 1e-9) return `${(m / 1e-9).toLocaleString('it-IT', { maximumSignificantDigits: 2 })} nm`;
  let u = units[0];
  for (const x of units) if (m >= x[0]) u = x;
  return `${(m / u[0]).toLocaleString('it-IT', { maximumSignificantDigits: 3 })} ${u[1]}`;
};

export class Scale extends Sim {
  static staticSim = true;
  static controls = {
    exp: { label: 'Zoom (potenza di 10)', min: -10, max: 23, step: 0.1, unit: '' },
  };

  defaults() { return { exp: 0 }; }

  // Zoom animato verso un valore (usato dagli esperimenti guidati).
  animateTo(p) {
    return new Promise((res) => {
      const from = this.params.exp, to = p.exp ?? from;
      const t0 = performance.now(), dur = 1400;
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        this.params.exp = from + (to - from) * e;
        if (this.onTick) this.onTick(this.params);
        if (k < 1) requestAnimationFrame(tick);
        else res({ exp: to });
      };
      requestAnimationFrame(tick);
    });
  }

  draw() {
    const g = this.ctx, W = this.W, H = this.H, t = this.calm ? 0 : this.clock;
    const e = this.sm('e', this.params.exp, 9);
    this.clear();
    const base = Math.min(W, H) * 0.5; // pixel di un oggetto grande 10^e metri
    const cx = W / 2, cy = H * 0.54;

    // Cornici delle potenze di 10: quadrati che si allargano mentre zoomi.
    for (let k = Math.floor(e) - 1; k <= Math.floor(e) + 2; k++) {
      const s = base * Math.pow(10, k - e);
      if (s < 8 || s > Math.max(W, H) * 3) continue;
      const a = 0.22 * clamp01(Math.log10(s / 8) / 0.8) * clamp01(Math.log10((Math.max(W, H) * 3) / s) / 0.6);
      this.line([[cx - s / 2, cy - s / 2], [cx + s / 2, cy - s / 2], [cx + s / 2, cy + s / 2], [cx - s / 2, cy + s / 2], [cx - s / 2, cy - s / 2]], { color: this.c('edge'), width: 1.2, alpha: a, dash: [4, 6] });
    }

    // Camera: segue l'oggetto a fuoco e scivola verso il prossimo mentre zoomi.
    const fe = e - 0.15;
    let j = 0;
    while (j < OBJECTS.length - 2 && LE[j + 1] <= fe) j++;
    const u = easeInOut(clamp01((fe - LE[j]) / (LE[j + 1] - LE[j])));
    const dj = OBJECTS[j].off.map((v) => v * OBJECTS[j + 1].size); // P(j+1) - P(j) = -dj
    const kpx = base / Math.pow(10, e);
    // Posizione (rispetto a P(j)) di ogni oggetto, sommando passo passo: niente numeri enormi.
    const rel = new Array(OBJECTS.length);
    rel[j] = [0, 0];
    for (let i = j - 1; i >= 0; i--) { const o = OBJECTS[i].off, S = OBJECTS[i + 1].size; rel[i] = [rel[i + 1][0] + o[0] * S, rel[i + 1][1] + o[1] * S]; }
    for (let i = j + 1; i < OBJECTS.length; i++) { const o = OBJECTS[i - 1].off, S = OBJECTS[i].size; rel[i] = [rel[i - 1][0] - o[0] * S, rel[i - 1][1] - o[1] * S]; }
    const camx = -u * dj[0], camy = -u * dj[1];

    const focus = Math.abs(fe - LE[j]) <= Math.abs(fe - LE[j + 1]) ? j : j + 1;
    if (this._fid !== focus) { this._fid = focus; this._ft = this.clock; }
    let focusBox = null;

    for (let i = 0; i < OBJECTS.length; i++) {
      const o = OBJECTS[i], s = o.size * kpx;
      if (s < 2.5 || s > Math.max(W, H) * 4) continue;
      const x = cx + (rel[i][0] - camx) * kpx, y = cy + (rel[i][1] - camy) * kpx;
      if (x < -s || x > W + s || y < -s || y > H + s) continue;
      const born = clamp01(Math.log10(s / 2.5) / 1.0);
      const alpha = clamp01(Math.log10(s / 2.5) / 0.7) * clamp01(Math.log10((Math.max(W, H) * 4) / s) / 0.55);
      if (alpha <= 0.01) continue;
      const width = Math.max(1.1, Math.min(2.6, s / 70));
      const sh = SHAPES[o.shape](t + i * 1.3);
      if (s < 7) { this.ball(x, y, 2.2, { color: this.c(sh.L[0][1]), fill: 0.6, width: 1.2, alpha, shine: false }); continue; }
      for (const [pts, col, a = 1] of sh.L) {
        this.line(pts.map(([px, py]) => [x + px * s, y + py * s]), { color: this.c(col), width, alpha: alpha * a, upto: this.calm ? 1 : born });
      }
      for (const [px, py, r, col] of sh.D) this.ball(x + px * s, y + py * s, Math.max(1.5, r * s), { color: this.c(col), fill: 0.5, width: Math.min(width, 2), alpha: alpha * born, shine: false });
      if (i === focus) focusBox = { x, y, s, o, col: sh.L[0][1] };
    }

    // Quota dell'oggetto a fuoco: una linea di misura che si disegna da sola.
    if (focusBox && focusBox.s > 30 && focusBox.s < H * 1.2) {
      const { x, y, s, o, col } = focusBox, k = this.calm ? 1 : clamp01((this.clock - this._ft) / 0.6);
      const qx = Math.min(W - 20, x + s / 2 + 18), y0 = y - s / 2, y1 = y + s / 2, c = this.c(col);
      this.line([[qx - 5, y0], [qx + 5, y0]], { color: c, width: 1.6, alpha: k });
      this.line([[qx - 5, y1], [qx + 5, y1]], { color: c, width: 1.6, alpha: k });
      this.line([[qx, y], [qx, y + (y0 - y) * k]], { color: c, width: 1.6 });
      this.line([[qx, y], [qx, y + (y1 - y) * k]], { color: c, width: 1.6 });
      const ty = Math.min(H - 24, y1 + 22 + (o.lab || 0) * s);
      g.globalAlpha = k;
      g.font = '600 14px Lexend, system-ui, sans-serif';
      const bw = Math.max(g.measureText(o.name).width, 80) + 20;
      g.save(); g.globalAlpha = k * 0.82; g.fillStyle = this.c('sim-bg'); g.beginPath();
      if (g.roundRect) g.roundRect(x - bw / 2, ty - 17, bw, 40, 10); else g.rect(x - bw / 2, ty - 17, bw, 40);
      g.fill(); g.restore();
      this.text(o.name, x, ty, { size: 14, align: 'center', weight: 600, color: c });
      this.text(nice(o.size), x, ty + 17, { size: 12, align: 'center', color: this.c('muted'), mono: true });
      g.globalAlpha = 1;
    }

    // barra di scala
    const r = Math.round(e * 10) / 10, sb = Math.min(base, W * 0.3);
    const bx0 = W - 14 - sb, bx1 = W - 14;
    this.line([[bx0, 18], [bx0, 30]], { color: this.c('sky'), width: 2 });
    this.line([[bx1, 18], [bx1, 30]], { color: this.c('sky'), width: 2 });
    this.arrow(bx0 + sb / 2, 24, bx1, 24, { color: this.c('sky'), width: 2, head: 6 });
    this.arrow(bx0 + sb / 2, 24, bx0, 24, { color: this.c('sky'), width: 2, head: 6 });
    const be = Math.round(r + Math.log10(sb / base));
    this.text(W < 520 ? `≈ 10${sup(be)} m` : `questa barra ≈ 10${sup(be)} m`, W - 14, 44, { size: 12, align: 'right', weight: 600 });
    this.text(`10${sup(Math.round(r))} m`, 14, 30, { size: 22, weight: 700, color: this.c('accent2') });
    const w = words(r);
    if (w && Math.abs(r - Math.round(r)) < 0.15) this.text(w, 14, 50, { size: W < 520 ? 11.5 : 13, color: this.c('muted') });
  }
}
