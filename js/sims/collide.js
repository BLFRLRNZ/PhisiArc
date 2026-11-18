// Gli urti dell'Officina: due carrelli sullo stesso binario liscio. Il blu parte con la velocità v1 e urta l'arancione,
// fermo (o con la sua velocità v2). Il paraurti del blu può essere una molla (urto elastico: i carrelli rimbalzano e
// l'energia di movimento si conserva) o un velcro (urto anelastico: restano attaccati, e una parte dell'energia
// diventa calore). La molla può essere morbida o dura: l'urto dura di più o di meno e la forza cambia, ma la spinta
// totale, l'impulso F·Δt, è la stessa.
// Sopra ogni carrello la freccia viola della sua quantità di moto, p = m·v; in alto quella del totale, che non cambia.
// I carrelli, i blocchi e il binario sono quelli di cart.js.
import { t as i18n } from '../i18n.js';
import { Cart } from './cart.js';
import { fmt, clamp01 } from './base.js';

const LC = 2;    // lunghezza di un carrello (m)
// un decimale, e niente «−0»: i numeri piccolissimi dopo l'urto sono zero
const r1 = (x) => { const r = Math.round(x * 10) / 10; return Math.abs(r) < 0.05 ? 0 : r; };
const num1 = (x) => fmt(x, x % 1 ? 1 : 0);
const S0 = 0.45; // lunghezza della molla del paraurti (m)
export const KS = { morbida: 250, dura: 4000 }; // rigidezza della molla (N/m)

export class Collide extends Cart {
  static controls = {
    m1: { label: 'Blocchi sul carrello blu', min: 1, max: 6, step: 1, unit: 'kg' },
    m2: { label: 'Blocchi sul carrello arancione', min: 1, max: 6, step: 1, unit: 'kg' },
    v1: { label: 'Velocità del carrello blu', min: 1, max: 12, step: 1, unit: 'm/s' },
    bumper: { label: 'Paraurti', type: 'select', options: [['molla', 'Molla'], ['velcro', 'Velcro']] },
    k: { label: 'Molla del paraurti', type: 'select', options: [['morbida', 'Morbida'], ['dura', 'Dura']] },
  };

  // show: le frecce della quantità di moto; energy: la barra dell'energia di movimento; forza: il grafico forza–tempo
  defaults() { return { m1: 2, m2: 2, v1: 6, v2: 0, bumper: 'molla', k: 'dura', D: 16, show: true, energy: false, forza: false, lens: 's', floor: 'liscio', tmax: 12, names: ['blu', 'arancione'] }; }

  constructor(cv, p) { super(cv, p); this.curves = []; }

  init() {
    const p = this.params;
    this.state = [
      { m: p.m1, x: 2, v: p.v1, col: this.c('car1'), dir: 1, F: 0 },
      { m: p.m2, x: 2 + LC + S0 + 3, v: p.v2, col: this.c('car2'), dir: 1, F: 0 },
    ];
    const [a, b] = this.state;
    this.p0 = a.m * a.v + b.m * b.v; this.E0 = 0.5 * a.m * a.v * a.v + 0.5 * b.m * b.v * b.v;
    this.stuck = false; this.hit = -1; this.hitClock = -1; this.contact = false; this.tc0 = -1; this.tc1 = -1; this.Fmax = 0; this.ft = []; this.comp = 0;
  }

  clearHistory() { this.curves = []; this.draw(); }

  step(dt) {
    const p = this.params, [a, b] = this.state, t = this.t;
    if (this.stuck) {
      a.x += a.v * dt; b.x = a.x + LC + 0.15; b.v = a.v;
    } else {
      const gap = b.x - LC / 2 - (a.x + LC / 2 + (p.bumper === 'velcro' ? 0.15 : S0));
      let F = 0;
      if (gap < 0) {
        if (!this.contact) { this.contact = true; this.tc0 = t; if (this.hit < 0) { this.hit = t; this.hitClock = this.clock; } }
        if (p.bumper === 'velcro') {
          // il velcro li aggancia: da qui in poi un solo carrello, con la quantità di moto dei due
          const v = (a.m * a.v + b.m * b.v) / (a.m + b.m);
          a.v = v; b.v = v; this.stuck = true; this.tc1 = t; this.contact = false;
          b.x = a.x + LC + 0.15;
        } else F = (KS[p.k] || KS.dura) * -gap; // la molla schiacciata spinge i due carrelli in versi opposti
      } else if (this.contact) { this.contact = false; this.tc1 = t; }
      this.comp = Math.max(0, -gap);
      if (!this.stuck) {
        a.v -= (F / a.m) * dt; b.v += (F / b.m) * dt;
        a.x += a.v * dt; b.x += b.v * dt;
      }
      a.F = -F; b.F = F;
      this.Fmax = Math.max(this.Fmax, F);
      if (F > 0 || (this.contact && p.bumper !== 'velcro')) this.ft.push([t, F]);
    }
    // fine: poco dopo l'urto, o quando un carrello arriva in fondo al binario
    const lo = LC / 2 + 0.05, hi = p.D - LC / 2 - 0.05;
    const out = b.x >= hi || a.x <= lo || a.x >= hi - LC;
    if (out) { a.x = Math.max(lo, Math.min(hi, a.x)); b.x = Math.max(lo, Math.min(hi, b.x)); }
    if ((this.hit >= 0 && !this.contact && (t - this.hit > 1.4 || out)) || t > p.tmax) this.end();
  }

  end() {
    if (this.result) return;
    // il grafico della forza resta: all'urto dopo si vede tratteggiato, per confrontarlo
    if (this.ft.length > 2) { this.curves = this.curves || []; this.curves.push(this.ft); if (this.curves.length > 2) this.curves.shift(); }
    const [a, b] = this.state, r2 = (x) => Math.round(x * 100) / 100;
    const p1 = a.m * a.v + b.m * b.v, E1 = 0.5 * a.m * a.v * a.v + 0.5 * b.m * b.v * b.v;
    this.finish({
      v1: [r2(a.v)], v2: [r2(b.v)], p: [r2(this.p0), r2(p1)], E: [r2(this.E0), r2(E1)],
      Fmax: [Math.round(this.Fmax)], dt: [this.tc1 >= 0 && this.tc0 >= 0 && !this.stuck ? r2(this.tc1 - this.tc0) : null],
    });
  }

  // ---------- disegno ----------
  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, [a, b] = this.state;
    this.clear();
    const L = 14, R = W - 14, yT = Math.round(H * (p.forza ? 0.55 : 0.64)), ppm = (R - L) / p.D, X = (x) => L + x * ppm;
    this.floorBand(L - 6, R + 6, yT);
    // i paraurti in fondo al binario
    for (const x of [L - 3, R + 3]) this.line([[x, yT], [x, yT - 16]], { color: this.c('muted'), width: 3 });
    // i carrelli, con la molla (o il velcro) davanti al blu
    const ar = X(a.x - LC / 2), af = X(a.x + LC / 2), br = X(b.x - LC / 2), bf = X(b.x + LC / 2);
    const topA = this.drawCart(ar, af, yT, a), topB = this.drawCart(br, bf, yT, b);
    const mid = yT - 10;
    if (p.bumper === 'velcro') {
      g.save(); g.fillStyle = 'rgba(126, 224, 122, .35)'; g.strokeStyle = this.c('green'); g.lineWidth = 1.4;
      g.beginPath(); g.roundRect(af, mid - 7, 0.15 * ppm + 1, 12, 2); g.fill(); g.stroke(); g.restore();
    } else {
      const len = Math.max(2, (S0 - this.comp) * ppm), n = 6, pts = [];
      for (let i = 0; i <= n; i++) pts.push([af + (len * i) / n, mid + (i && i < n ? (i % 2 ? -5 : 5) : 0)]);
      this.line(pts, { color: this.c('chalk'), width: 1.8 });
      this.line([[af + len, mid - 7], [af + len, mid + 7]], { color: this.c('chalk'), width: 2.4 });
    }
    // il lampo dell'urto
    if (this.hitClock >= 0) this.burst(p.bumper === 'velcro' ? af + 2 : br, mid, this.clock - this.hitClock, { color: this.c('sun'), n: 8, r: 20 });
    // le frecce viola della quantità di moto: una per carrello, e il totale in alto
    const kp = Math.min(3, (W * 0.55) / 72), vio = this.c('boss');
    if (p.show) {
      for (const [s, x0, x1, top] of [[a, ar, af, topA], [b, br, bf, topB]]) {
        const pv = r1(s.m * s.v), y = Math.min(top, yT - 30) - 14;
        // la freccia parte dal centro del carrello; vicino ai bordi si sposta quanto basta per restare nel disegno
        let cx = (x0 + x1) / 2; const ex = cx + pv * kp;
        if (ex > W - 8) cx -= ex - (W - 8); else if (ex < 8) cx += 8 - ex;
        if (Math.abs(pv) > 0.05) this.arrow(cx, y, cx + pv * kp, y, { color: vio, width: 3, head: 8 });
        this.text(num1(pv), cx + (pv >= 0 ? -4 : 4), y - 6, { size: 11, align: pv >= 0 ? 'right' : 'left', color: vio, mono: true });
      }
      const pt = r1(a.m * a.v + b.m * b.v), S = p.lens === 's';
      this.text(S ? i18n('quantità di moto totale') : i18n('quantità di moto in tutto'), 12, 15, { size: 10.5, color: this.c('muted') });
      this.arrow(14, 28, 14 + Math.max(4, pt * kp), 28, { color: vio, width: 4, head: 9 });
      this.text(num1(pt) + (S ? ' kg·m/s' : ''), 14 + Math.max(4, pt * kp) + 8, 32, { size: 11, color: vio, mono: true });
    }
    if (p.energy) {
      const E = 0.5 * a.m * a.v * a.v + 0.5 * b.m * b.v * b.v, bw = Math.min(150, W * 0.42), y = p.show ? 52 : 26;
      this.text(i18n('energia di movimento'), 12, y - 4, { size: 10.5, color: this.c('muted') });
      g.save(); g.strokeStyle = this.c('orange'); g.globalAlpha = 0.6; g.setLineDash([3, 3]); g.lineWidth = 1.2; g.strokeRect(12, y, bw, 9); g.restore();
      g.save(); g.fillStyle = this.c('orange'); g.globalAlpha = 0.8; g.fillRect(12, y, bw * clamp01(E / Math.max(1e-9, this.E0)), 9); g.restore();
    }
    if (p.forza) this.forceGraph(L, yT + 22, Math.min(W * 0.62, 260), H - yT - 44);
    this.results();
  }

  // il grafico della forza durante l'urto: alta e stretta con la molla dura, bassa e larga con quella morbida
  forceGraph(x, y, w, h) {
    const g = this.ctx, Fmax = 600, T = 0.3;
    g.strokeStyle = this.c('line'); g.lineWidth = 1;
    g.beginPath(); g.moveTo(x + 28, y); g.lineTo(x + 28, y + h); g.lineTo(x + 28 + w, y + h); g.stroke();
    this.text(i18n('forza (N)'), x + 32, y + 9, { size: 10, color: this.c('muted') });
    this.text(i18n('tempo dell’urto'), x + 28 + w, y + h + 13, { size: 10, align: 'right', color: this.c('muted') });
    this.text('0', x + 22, y + h + 3, { size: 9.5, align: 'right', color: this.c('muted') });
    this.text(String(Fmax), x + 22, y + 9, { size: 9.5, align: 'right', color: this.c('muted') });
    const plot = (pts, opts) => {
      if (pts.length < 2) return;
      const t0 = pts[0][0];
      this.line([[x + 28, y + h], ...pts.map(([t, F]) => [x + 28 + (w * clamp01((t - t0) / T)), y + h - (h * Math.min(F, Fmax)) / Fmax])], opts);
    };
    for (const c of this.curves || []) if (c !== this.ft) plot(c, { color: this.c('muted'), width: 2, dash: [4, 4] });
    plot(this.ft, { color: this.c('coral'), width: 2.6 });
  }

  results() {
    const g = this.ctx, p = this.params, W = this.W, [a, b] = this.state, S = p.lens === 's';
    const rows = [[i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), this.c('ink'), 600]];
    if (this.result) {
      const r = this.result;
      rows.push([`${i18n(p.names[0])}: ${fmt(r1(r.v1[0]), 1)} m/s`, this.c('car1'), 700], [`${i18n(p.names[1])}: ${fmt(r1(r.v2[0]), 1)} m/s`, this.c('car2'), 700]);
      if (p.energy) rows.push([i18n('energia: {a} → {b} J', { a: fmt(r.E[0], 0), b: fmt(r.E[1], 0) }), this.c('orange'), 500]);
      if (p.forza && r.dt[0] != null) rows.push([S ? i18n('forza massima {F} N, per {t} s', { F: r.Fmax[0], t: fmt(r.dt[0], 2) }) : i18n('botta più forte: {F} N', { F: r.Fmax[0] }), this.c('coral'), 500]);
    }
    g.font = '600 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([r]) => g.measureText(r).width)) + 12, by = 6;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(W - 10 - bw + 6, by, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([r, col, w], i) => this.text(r, W - 10, by + 14 + i * 15, { size: 11.5, align: 'right', weight: w, color: col }));
  }
}
