// Zoom delle grandezze: dal protone all'universo osservabile, una potenza di 10 alla volta.
// Ogni oggetto è disegnato a linee morbide, con un velo di colore e un leggero bagliore.
// Vive dentro (o accanto) a un oggetto più grande: zoomando la camera scivola dall'uno all'altro,
// i piccoli nascono da un puntino e si disegnano da soli.
import { t as i18n, LOCALE } from '../i18n.js';
import { Sim, clamp01, easeInOut } from './base.js';
import { SHAPES, TAU } from './art/scale-shapes.js';

// size = metri; in = l'oggetto che lo contiene (o che gli sta accanto); off = posizione dentro quello (in sue unità).
// side = sta accanto alla strada principale: si vede, ma la camera non lo insegue.
export const OBJECTS = [
  { name: 'protone', size: 1.7e-15, shape: 'protone', in: 'nucleo', off: [0.064, 0] },
  { name: 'nucleo dell’atomo', id: 'nucleo', size: 1e-14, shape: 'nucleo', in: 'atomo', off: [0, 0] },
  { name: 'atomo', size: 1e-10, shape: 'atomo', in: 'dna', off: [0.12, 0.05] },
  { name: 'filamento di DNA', id: 'dna', size: 1e-8, shape: 'dna', in: 'virus', off: [0, 0] },
  { name: 'virus', size: 1e-7, shape: 'virus', in: 'batterio', off: [0.28, -0.24] },
  { name: 'batterio', size: 2e-6, shape: 'batterio', in: 'globulo', off: [0.45, 0.38] },
  { name: 'globulo rosso', id: 'globulo', size: 8e-6, shape: 'globulo', in: 'capello', off: [0.1, -0.56] },
  { name: 'spessore di un capello', id: 'capello', size: 8e-5, shape: 'capello', in: 'acaro', off: [0, 0.56] },
  { name: 'acaro della polvere', id: 'acaro', size: 3e-4, shape: 'acaro', in: 'granello', off: [-0.1, -0.58] },
  { name: 'granello di sabbia', id: 'granello', size: 1e-3, shape: 'granello', in: 'formica', off: [0.62, -0.02] },
  { name: 'formica', size: 4e-3, shape: 'formica', in: 'moneta', off: [0.04, -0.05] },
  { name: 'moneta da 1 euro', id: 'moneta', size: 2.3e-2, shape: 'moneta', in: 'mela', off: [0.6, 0.32] },
  { name: 'mela', size: 8e-2, shape: 'mela', in: 'gatto', off: [0.42, 0.41] },
  { name: 'gatto', size: 0.45, shape: 'gatto', in: 'persona', off: [0.34, 0.36] },
  { name: 'persona', size: 1.7, shape: 'persona', in: 'auto', off: [-0.7, 0.055] },
  { name: 'automobile', id: 'auto', size: 4.5, shape: 'auto', in: 'balena', off: [0.82, 0.1] },
  { name: 'balena', size: 25, shape: 'balena', in: 'campo', off: [0, -0.03] },
  { name: 'campo da calcio', id: 'campo', size: 105, shape: 'campo', in: 'torre', off: [0.66, 0.46] },
  { name: 'Torre Eiffel', id: 'torre', size: 330, shape: 'torre', in: 'everest', off: [-0.62, 0.48] },
  { name: 'Everest', size: 8.8e3, shape: 'everest', in: 'italia', off: [0.0, -0.45] },
  { name: 'Italia (lunghezza)', id: 'italia', size: 1.2e6, shape: 'italia', in: 'terra', off: [0.06, -0.3] },
  { name: 'Luna', size: 3.47e6, shape: 'luna', in: 'terra', off: [1.0, -0.4], side: true },
  { name: 'Terra', size: 1.27e7, shape: 'terra', in: 'sole', off: [0.85, 0.05] },
  { name: 'Giove', size: 1.4e8, shape: 'giove', in: 'sole', off: [-1.05, 0.25], side: true },
  { name: 'Sole', size: 1.39e9, shape: 'sole', in: 'sistema', off: [0, 0], lab: 0.2 },
  { name: 'Sistema solare', id: 'sistema', size: 9e12, shape: 'sistema', in: 'stelle', off: [0, 0] },
  { name: 'Le stelle vicine', id: 'stelle', size: 1e17, shape: 'stelle', in: 'galassia', off: [0.22, 0.1] },
  { name: 'Via Lattea', id: 'galassia', size: 1e21, shape: 'galassia', in: 'gruppo', off: [-0.12, 0.1] },
  { name: 'Gruppo Locale di galassie', id: 'gruppo', size: 1e23, shape: 'gruppo', in: 'universo', off: [-0.1, 0.06] },
  { name: 'Universo osservabile', id: 'universo', size: 8.8e26, shape: 'universo' },
];
OBJECTS.forEach((o, i) => { o.id = o.id || o.shape; o.i = i; });
const BY = Object.fromEntries(OBJECTS.map((o) => [o.id, o]));
const CHAIN = OBJECTS.filter((o) => !o.side);
const LE = CHAIN.map((o) => Math.log10(o.size));
// Spostamento (in metri) di ogni oggetto rispetto al suo contenitore, e la catena dei contenitori.
OBJECTS.forEach((o) => { const p = BY[o.in]; o.d = p ? [o.off[0] * p.size, o.off[1] * p.size] : [0, 0]; o.up = []; for (let q = o; q; q = BY[q.in]) o.up.push(q); });
// Posizione di a meno posizione di b, sommando solo fino all'antenato comune: niente numeri enormi.
const relPos = (a, b) => {
  const inB = new Set(b.up), lca = a.up.find((q) => inB.has(q));
  let x = 0, y = 0;
  for (const q of a.up) { if (q === lca) break; x += q.d[0]; y += q.d[1]; }
  for (const q of b.up) { if (q === lca) break; x -= q.d[0]; y -= q.d[1]; }
  return [x, y];
};

const words = (e) => {
  const r = Math.round(e);
  const map = {
    '-15': 'un femtometro', '-10': 'un decimo di miliardesimo di metro', '-9': 'un nanometro', '-6': 'un micrometro',
    '-3': 'un millimetro', '-2': 'un centimetro', 0: 'un metro', 3: 'un chilometro',
    6: 'mille chilometri', 9: 'un milione di chilometri', 16: 'circa un anno luce', 21: 'centomila anni luce', 27: 'novanta miliardi di anni luce',
  };
  return map[r] || '';
};

export const sup = (n) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);

const nice = (m) => {
  const units = [[1e-9, 'nm'], [1e-6, 'µm'], [1e-3, 'mm'], [1e-2, 'cm'], [1, 'm'], [1e3, 'km']];
  const f = (x) => x.toLocaleString(LOCALE, { maximumSignificantDigits: 2 });
  if (m >= 9.46e24) return `${f(m / 9.46e24)} ${i18n('miliardi di anni luce')}`;
  if (m >= 9.46e15) return `${f(m / 9.46e15)} ${i18n('anni luce')}`;
  if (m >= 1e9) return `${f(m / 1e3)} km`;
  if (m < 1e-12) return `${f(m / 1e-15)} ${i18n('femtometri')}`;
  if (m < 1e-9) return `${f(m / 1e-9)} nm`;
  let u = units[0];
  for (const x of units) if (m >= x[0]) u = x;
  return `${(m / u[0]).toLocaleString(LOCALE, { maximumSignificantDigits: 3 })} ${u[1]}`;
};

export class Scale extends Sim {
  static staticSim = true;
  static controls = {
    exp: { label: 'Zoom (potenza di 10)', min: -15, max: 27, step: 0.1, unit: '' },
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
        this.wake();
        if (this.onTick) this.onTick(this.params);
        if (k < 1) requestAnimationFrame(tick);
        else res({ exp: to });
      };
      requestAnimationFrame(tick);
    });
  }

  // Disegna una forma: bagliore, velo di colore, tratto; i pallini e le scritte compaiono a disegno finito.
  paint(items, x, y, s, alpha, born) {
    const g = this.ctx, width = Math.max(1.1, Math.min(2.7, s / 75)), glow = s > 70 && !this.calm;
    const tr = (pts) => pts.map(([px, py]) => [x + px * s, y + py * s]);
    for (const it of items) {
      const col = this.c(it.c), a = alpha * (it.a ?? 1);
      if (it.t) {
        if (s > 220 && born >= 1) this.text(it.t, x + it.x * s, y + it.y * s, { size: 11, align: 'center', color: col, weight: 500 });
        continue;
      }
      if (it.d) {
        const [dx, dy, r] = it.d, R = Math.max(1.2, r * s);
        g.save(); g.globalAlpha = alpha * (it.a ?? 1) * born;
        g.beginPath(); g.arc(x + dx * s, y + dy * s, R, 0, TAU);
        g.fillStyle = col; g.globalAlpha *= it.f ?? 0.4; g.fill();
        g.globalAlpha = alpha * (it.a ?? 1) * born; g.strokeStyle = col; g.lineWidth = Math.min(width, R * 0.6 + 0.6); g.stroke();
        g.restore();
        continue;
      }
      const P = tr(it.p), w = width * (it.w ?? 1);
      if (it.f && born > 0.6) {
        g.save(); g.globalAlpha = alpha * it.f * clamp01((born - 0.6) / 0.4);
        g.fillStyle = col; g.beginPath(); g.moveTo(P[0][0], P[0][1]);
        for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1]);
        g.closePath(); g.fill(); g.restore();
      }
      if (a <= 0.01) continue;
      if (glow) this.line(P, { color: col, width: w * 3.2, alpha: a * 0.1, upto: born });
      this.line(P, { color: col, width: w, alpha: a, upto: born });
    }
  }

  // "10 alla n" con l'esponente scritto piccolo e in alto: il carattere ⁰ in molti caratteri sembra un ° (gradi)
  pow10(pre, n, x, y, { size, weight, color, align = 'left' }) {
    const g = this.ctx, fnt = (sz, w) => `${w} ${sz}px Lexend, system-ui, sans-serif`;
    const es = Math.round(size * 0.62), ex = String(n).replace('-', '−');
    g.font = fnt(size, weight); const a = g.measureText(pre + '10').width, c = g.measureText(' m').width;
    g.font = fnt(es, weight); const b = g.measureText(ex).width;
    const x0 = align === 'right' ? x - (a + b + 1 + c) : x;
    this.text(pre + '10', x0, y, { size, weight, color, mono: false });
    this.text(ex, x0 + a + 1, y - size * 0.42, { size: es, weight, color, mono: false });
    this.text(' m', x0 + a + b + 1, y, { size, weight, color, mono: false });
  }

  draw() {
    const g = this.ctx, W = this.W, H = this.H, t = this.calm ? 0 : this.clock;
    const e = this.sm('e', this.params.exp, 9);
    this.clear();
    const base = Math.min(W, H) * 0.5; // pixel di un oggetto grande 10^e metri
    const cx = W / 2, cy = H * 0.54, big = Math.max(W, H);

    // Cornici delle potenze di 10: quadrati che si allargano mentre zoomi.
    for (let k = Math.floor(e) - 1; k <= Math.floor(e) + 2; k++) {
      const s = base * Math.pow(10, k - e);
      if (s < 8 || s > big * 3) continue;
      const a = 0.22 * clamp01(Math.log10(s / 8) / 0.8) * clamp01(Math.log10((big * 3) / s) / 0.6);
      this.line([[cx - s / 2, cy - s / 2], [cx + s / 2, cy - s / 2], [cx + s / 2, cy + s / 2], [cx - s / 2, cy + s / 2], [cx - s / 2, cy - s / 2]], { color: this.c('edge'), width: 1.2, alpha: a, dash: [4, 6] });
    }

    // Camera: segue l'oggetto a fuoco sulla strada principale e scivola verso il prossimo mentre zoomi.
    const fe = e - 0.15;
    let j = 0;
    while (j < CHAIN.length - 2 && LE[j + 1] <= fe) j++;
    const u = easeInOut(clamp01((fe - LE[j]) / (LE[j + 1] - LE[j])));
    const A = CHAIN[j], step = relPos(CHAIN[j + 1], A);
    const cam = [step[0] * u, step[1] * u];
    const kpx = base / Math.pow(10, e);

    const focus = Math.abs(fe - LE[j]) <= Math.abs(fe - LE[j + 1]) ? CHAIN[j] : CHAIN[j + 1];
    if (this._fid !== focus.id) { this._fid = focus.id; this._ft = this.clock; }
    let focusBox = null;
    const sideLabels = [];

    for (const o of OBJECTS) {
      const s = o.size * kpx;
      if (s < 2.5 || s > big * 4) continue;
      const r = relPos(o, A), x = cx + (r[0] - cam[0]) * kpx, y = cy + (r[1] - cam[1]) * kpx;
      const ext = o.shape === 'capello' || o.shape === 'everest' ? 1.7 : 0.75;
      if (x < -s * ext || x > W + s * ext || y < -s * ext || y > H + s * ext) continue;
      const born = this.calm ? 1 : clamp01(Math.log10(s / 2.5) / 1.0);
      const alpha = clamp01(Math.log10(s / 2.5) / 0.7) * clamp01(Math.log10((big * 2.4) / s) / 0.45);
      if (alpha <= 0.01) continue;
      const items = SHAPES[o.shape](t + o.i * 1.3);
      const main = items.find((it) => it.p && it.c !== 'night') || items[0];
      if (s < 7) { this.ball(x, y, 2.2, { color: this.c(main.c), fill: 0.6, width: 1.2, alpha, shine: false }); continue; }
      this.paint(items, x, y, s, alpha, born);
      if (o === focus) focusBox = { x, y, s, o, col: main.c };
      else if (o.side && s > base * 0.06 && s < base * 1.6) sideLabels.push([o, x, y + s * 0.5 + 16, main.c, alpha]);
    }
    for (const [o, x, y, c, a] of sideLabels) { g.globalAlpha = a; this.text(o.name, x, y, { size: 12, align: 'center', color: this.c(c) }); g.globalAlpha = 1; }

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
    this.pow10(W < 520 ? '≈ ' : `${i18n('questa barra')} ≈ `, be, W - 14, 44, { size: 12, align: 'right', weight: 600 });
    this.pow10('', Math.round(r), 14, 30, { size: 22, weight: 700, color: this.c('accent2') });
    const w = words(r);
    if (w && Math.abs(r - Math.round(r)) < 0.15) this.text(w, 14, 50, { size: W < 520 ? 11.5 : 13, color: this.c('muted') });
  }
}
