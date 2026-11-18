// I fluidi in movimento (FL03). Quattro modi:
//   - 'fogli': si soffia fra due fogli appesi (kind 'due'), o sopra una striscia di carta che pende dalle labbra
//     (kind 'striscia'). Dove l'aria corre la pressione cala: l'aria ferma di fuori spinge i fogli uno verso l'altro,
//     e la striscia verso l'alto. blow va da 0 a 10: l'aria corre a 1,5·blow m/s.
//   - 'tubo': l'acqua scorre in un tubo che si stringe ratio volte. La portata è la stessa dappertutto (A·v costante):
//     nella strozzatura l'acqua corre ratio volte più veloce. Con piezo, due tubicini verticali misurano la pressione:
//     l'acqua ci sale di 50 cm nel tratto largo e meno nella strozzatura (Bernoulli, P + ½·ρ·v² costante: il tubo di
//     Venturi). Se lì la pressione scende sotto quella dell'aria, il tubicino si svuota e risucchia aria.
//   - 'ala': un'ala in galleria del vento, con il suo angolo e la sua forma (curva, piatta o capovolta). La portanza
//     cresce con il quadrato della velocità e con l'angolo, finché l'ala stalla: L = ½·ρ·v²·S·C, con S = 1 m².
//   - 'decollo': un idrovolante di m kg, con un'ala di S m², corre sull'acqua del porto: in 300 m arriva a 36 m/s
//     (130 km/h). Si stacca quando la portanza, 0,75·v²·S newton (ρ = 1,2 e C = 1,25), pareggia il peso.
//     mark (m) mette una boa lungo la corsa.
// Risultato: fogli { blow, kind }; tubo { v1, ratio, v2, h1, h2 (cm) }; ala { alpha, kmh, shape, C, L, D (N), kg };
//            decollo { m, S, up, d (m), vto (km/h) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

const G = 9.81, RHO_AIR = 1.2, RUNWAY = 300, VMAX2 = 1310, H1 = 50; // VMAX2: v² a fine corsa; H1: cm d'acqua nel tubicino largo
const TR = 2.6; // secondi (della simulazione) per fare i 300 m di corsa
export const SHAPES = { curva: { name: 'Ala curva' }, piatta: { name: 'Ala piatta' }, rovescia: { name: 'Ala capovolta' } };
// il coefficiente di portanza secondo l'angolo (gradi): sale con l'angolo, poi l'ala stalla
export function coefL(shape, a) {
  if (shape === 'piatta') return a <= 10 ? 0.1 * a : Math.max(0, 1 - 0.1 * (a - 10));
  if (shape === 'rovescia') return a <= 18 ? -0.4 + 0.1 * a : Math.max(0, 1.4 - 0.12 * (a - 18));
  return a <= 14 ? 0.4 + 0.1 * a : Math.max(0, 1.8 - 0.12 * (a - 14));
}
const stallAt = (shape) => (shape === 'piatta' ? 10 : shape === 'rovescia' ? 18 : 14);
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);
const two = (x) => fmt(x, Math.abs(x * 10 - Math.round(x * 10)) < 0.005 ? 1 : 2);

export class Flow extends Sim {
  static tall = true;
  static controls = {
    blow: { label: 'Quanto soffi', min: 0, max: 10, step: 1, unit: '' },
    v1: { label: 'Velocità nel tubo largo', min: 0.5, max: 2, step: 0.25, unit: 'm/s' },
    ratio: { label: 'Quante volte si stringe', min: 1, max: 4, step: 0.5, unit: '×' },
    alpha: { label: 'Angolo dell’ala', min: -10, max: 24, step: 1, unit: '°' },
    kmh: { label: 'Vento', min: 0, max: 300, step: 10, unit: 'km/h' },
    shape: { label: 'Forma dell’ala', type: 'select', options: Object.entries(SHAPES).map(([k, s]) => [k, s.name]) },
    S: { label: 'Superficie dell’ala', min: 2, max: 20, step: 0.5, unit: 'm²' },
  };

  defaults() { return { mode: 'fogli', kind: 'due', blow: 6, v1: 1, ratio: 2, piezo: false, alpha: 5, kmh: 150, shape: 'curva', m: 600, S: 6, mark: 0, lens: 's' }; }

  init() {
    this.u = 0;
    // le particelle d'aria (o d'acqua): posizione lungo il flusso (0..1) e di traverso (0..1)
    this.parts = Array.from({ length: 60 }, (_, i) => ({ s: (0.5 + i * 0.7548777) % 1, f: ((0.5 + i * 0.5698403) % 1) * 0.92 + 0.04 }));
  }

  // ---------- la fisica ----------
  v2() { return this.params.v1 * this.params.ratio; }
  heads() { // altezza dell'acqua nei tubicini (cm sopra l'asse del tubo): 50 cm nel tratto largo, meno nella strozzatura
    const p = this.params;
    return [H1, H1 - ((this.v2() ** 2 - p.v1 ** 2) / (2 * G)) * 100];
  }
  wing() { const p = this.params, v = p.kmh / 3.6, C = coefL(p.shape, p.alpha), CD = 0.03 + 0.0012 * p.alpha * p.alpha; return { v, C, L: 0.5 * RHO_AIR * v * v * C, D: 0.5 * RHO_AIR * v * v * CD }; }
  takeoff() { const p = this.params, v2 = (p.m * G) / (0.75 * p.S); return { v2, up: v2 <= VMAX2, d: Math.min(RUNWAY, (v2 / VMAX2) * RUNWAY) }; }
  tEnd() { return TR * 1.15; }

  step() {
    const p = this.params, t = this.t;
    if (p.mode === 'decollo') { this.u = clamp01(t / this.tEnd()); if (t > this.tEnd() + 0.4) this.end(); return; }
    this.u = clamp01(t / 1.2);
    if (t > 2.6) this.end();
  }

  speedAt(q) {
    const p = this.params;
    if (p.mode === 'tubo') {
      const x = q.s, r = p.ratio;
      const k = x > 0.42 && x < 0.62 ? r : x > 0.36 && x <= 0.42 ? 1 + (r - 1) * ((x - 0.36) / 0.06) : x >= 0.62 && x < 0.68 ? r - (r - 1) * ((x - 0.62) / 0.06) : 1;
      return 0.1 * p.v1 * k;
    }
    return 0.08 + 0.002 * p.kmh;
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'tubo') { const [h1, h2] = this.heads(); return this.finish({ v1: p.v1, ratio: p.ratio, v2: this.v2(), h1, h2 }); }
    if (p.mode === 'ala') { const w = this.wing(); return this.finish({ alpha: p.alpha, kmh: p.kmh, shape: p.shape, C: w.C, L: w.L, D: w.D, kg: w.L / G }); }
    if (p.mode === 'decollo') { const k = this.takeoff(); return this.finish({ m: p.m, S: p.S, up: k.up, d: k.d, vto: Math.sqrt(k.v2) * 3.6 }); }
    this.finish({ blow: p.blow, kind: p.kind });
  }

  draw() {
    this.clear();
    const m = this.params.mode, live = this.running || !!this.result;
    // l'aria e l'acqua scorrono durante la prova e anche dopo, finché il disegno resta acceso
    if (live && !this.calm && (m === 'tubo' || m === 'ala')) for (const q of this.parts) q.s = (q.s + this.fdt * this.speedAt(q)) % 1;
    if (m === 'tubo') this.drawPipe();
    else if (m === 'ala') this.drawWing();
    else if (m === 'decollo') this.drawTakeoff();
    else this.drawSheets();
  }

  // ---------- i fogli ----------
  drawSheets() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const pull = live ? easeOut(u) * Math.min(1, (p.blow / 10) ** 2 * 1.3) : 0;
    const flut = live && p.blow > 0 ? Math.sin(this.clock * 13) * (p.blow / 10) : 0;
    const v = p.blow * 1.5, dp = Math.round(0.5 * RHO_AIR * v * v);
    if (p.kind === 'striscia') return this.drawStrip(live, pull, flut, v, dp);
    // due fogli appesi a una bacchetta, visti di taglio, con lo spazio in mezzo; chi soffia sta sopra
    const cx = W / 2, top = Math.max(124, H * 0.3), bot = H - 24, gap = Math.min(46, W * 0.13);
    this.face(cx, top - 26, live && p.blow > 0, true);
    this.line([[cx - 80, top], [cx + 80, top]], { color: this.c('muted'), width: 3 });
    for (const sgn of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 20; i++) { const s = i / 20; pts.push([cx + sgn * (gap / 2 - pull * (gap / 2 - 3) * s * s) + sgn * flut * 1.4 * s, top + s * (bot - top)]); }
      g.save(); g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      for (let i = 20; i >= 0; i--) g.lineTo(pts[i][0] + sgn * 4, pts[i][1]);
      g.fillStyle = this.c('chalk'); g.globalAlpha = 0.16; g.fill(); g.restore();
      this.line(pts, { color: this.c('chalk'), width: 2.4 });
    }
    if (live && p.blow > 0) this.airStream(cx, top - 10, cx, bot, true);
    // le spinte dell'aria ferma, da fuori: dentro, l'aria che corre spinge di meno
    if (this.result && p.blow > 0) for (const sgn of [-1, 1]) for (const f of [0.4, 0.62, 0.84]) {
      const y = top + f * (bot - top), xs = cx + sgn * (gap / 2 - pull * (gap / 2 - 3) * f * f + 4);
      this.arrow(xs + sgn * 34, y, xs + sgn * 6, y, { color: this.c('mint'), width: 2.4, head: 7 });
    }
    const rows = [[i18n('Soffio: {b} su 10', { b: p.blow }), this.c('chalk'), 700]];
    if (this.result) {
      if (p.blow === 0) rows.push([i18n('senza soffio i fogli restano fermi'), this.c('muted'), 600]);
      else {
        rows.push([i18n('i fogli si avvicinano!'), this.c('mint'), 700]);
        rows.push([E ? i18n('l’aria che corre spinge meno di quella ferma') : i18n('l’aria corre a {v} m/s: la pressione cala di {dp} Pa', { v: one(v), dp }), this.c('sky'), 600]);
      }
    }
    this.box(rows);
  }

  // una striscia di carta che pende dalle labbra: soffiandoci sopra si alza
  drawStrip(live, pull, flut, v, dp) {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const fx = W * 0.22, fy = H * 0.4, len = Math.min(W * 0.6, 240);
    this.face(fx, fy, live && p.blow > 0, false);
    // la striscia: la pendenza cresce lungo la carta (a riposo pende, col soffio si raddrizza)
    const bend = (1 - pull) * 1.15 + pull * 0.1, pts = [[fx + 4, fy + 5]];
    for (let i = 1; i <= 24; i++) {
      const s = i / 24, th = bend * s + flut * 0.05 * Math.sin(s * 6 + this.clock * 9) * s, [x, y] = pts[i - 1];
      pts.push([x + Math.cos(th) * (len / 24), y + Math.sin(th) * (len / 24)]);
    }
    this.line(pts, { color: this.c('chalk'), width: 3 });
    if (live && p.blow > 0) this.airStream(fx + 8, fy - 2, fx + 8 + len, fy - 2 + len * Math.sin(bend * 0.5) * 0.4);
    // da sotto, l'aria ferma spinge la striscia verso l'alto
    if (this.result && p.blow > 0) for (const i of [12, 19]) { const [x, y] = pts[i]; this.arrow(x, y + 34, x, y + 6, { color: this.c('mint'), width: 2.4, head: 7 }); }
    const rows = [[i18n('Una striscia di carta sotto le labbra'), this.c('chalk'), 700]];
    if (this.result) {
      if (p.blow === 0) rows.push([i18n('senza soffio la striscia pende giù'), this.c('muted'), 600]);
      else {
        rows.push([i18n('soffiando sopra, la striscia si alza!'), this.c('mint'), 700]);
        rows.push([E ? i18n('sopra l’aria corre e spinge meno di quella sotto') : i18n('sopra l’aria corre a {v} m/s: la pressione cala di {dp} Pa', { v: one(v), dp }), this.c('sky'), 600]);
      }
    }
    this.box(rows);
  }

  // una faccina che soffia; (x, y) = la bocca. down = vista di fronte, soffia in giù; altrimenti di profilo, verso destra
  face(x, y, blowing, down) {
    const col = this.c('chalk'), g = this.ctx;
    const hx = down ? x : x - 13, hy = down ? y - 13 : y - 3;
    this.ball(hx, hy, 14, { color: col, fill: 0.15, width: 2, shine: false });
    g.save(); g.fillStyle = col;
    if (down) { for (const ex of [-5, 5]) { g.beginPath(); g.arc(x + ex, y - 17, 1.7, 0, 7); g.fill(); } }
    else { g.beginPath(); g.arc(x - 6, y - 9, 1.7, 0, 7); g.fill(); }
    g.restore();
    if (blowing) this.ball(down ? x : x + 1, down ? y - 4 : y, 3, { color: col, fill: 0.5, width: 1.4, shine: false });
    else this.line(down ? [[x - 3, y - 5], [x + 3, y - 5]] : [[x - 1, y - 1], [x + 1, y + 2]], { color: col, width: 1.6 });
  }

  // un ruscello d'aria: trattini che corrono da (x0, y0) a (x1, y1)
  airStream(x0, y0, x1, y1, vertical = false) {
    const p = this.params, n = 9;
    for (let i = 0; i < n; i++) {
      const ph = (this.clock * (0.8 + 0.12 * p.blow) + i / n) % 1;
      const x = x0 + (x1 - x0) * ph, y = y0 + (y1 - y0) * ph, d = vertical ? [0, 9] : [9, 0];
      const off = vertical ? [((i % 3) - 1) * 4, 0] : [0, ((i % 3) - 1) * 3];
      this.line([[x + off[0], y + off[1]], [x + off[0] + d[0], y + off[1] + d[1]]], { color: this.c('sky'), width: 1.8, alpha: 0.85 * (1 - Math.abs(ph - 0.5)) });
    }
  }

  // ---------- il tubo che si stringe ----------
  drawPipe() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const hw = p.piezo ? Math.min(70, W * 0.18) : Math.min(100, W * 0.26), hn = hw / p.ratio, yc = p.piezo ? H - hw / 2 - 62 : H * 0.5;
    const X = (s) => 10 + s * (W - 20), half = (s) => {
      if (s < 0.36 || s > 0.68) return hw / 2;
      if (s >= 0.42 && s <= 0.62) return hn / 2;
      const k = s < 0.42 ? (s - 0.36) / 0.06 : 1 - (s - 0.62) / 0.06;
      return hw / 2 + (hn / 2 - hw / 2) * (0.5 - 0.5 * Math.cos(k * Math.PI));
    };
    // l'acqua e le pareti
    const top = [], bot = [];
    for (let i = 0; i <= 64; i++) { const s = i / 64; top.push([X(s), yc - half(s)]); bot.push([X(s), yc + half(s)]); }
    g.save(); g.beginPath(); top.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); for (let i = bot.length - 1; i >= 0; i--) g.lineTo(bot[i][0], bot[i][1]);
    g.closePath(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.2; g.fill(); g.restore();
    // i tubicini della pressione (Venturi): prima del flusso l'acqua sta alla stessa altezza in tutti e due
    const tubes = [];
    if (p.piezo) {
      const [h1, h2] = this.heads(), h0 = H1 + ((p.v1 * p.v1) / (2 * G)) * 100, yTop = 66, kp = (yc - yTop - 6) / 62;
      for (const [s, h, half0] of [[0.2, h1, hw / 2], [0.52, h2, hn / 2]]) {
        const x = X(s), yb = yc - half0, hh = h0 + (h - h0) * (live ? easeOut(u) : 0), yw = Math.min(yb, yc - hh * kp);
        g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.35; g.fillRect(x - 4, yw, 8, yb - yw + 1); g.restore();
        g.save(); g.fillStyle = this.c('sim-bg'); g.fillRect(x - 4, yb - 2, 8, 4); g.restore(); // il tubicino si apre nel tubo
        this.line([[x - 5, yb], [x - 5, yTop]], { color: this.c('chalk'), width: 1.6 });
        this.line([[x + 5, yb], [x + 5, yTop]], { color: this.c('chalk'), width: 1.6 });
        tubes.push({ x, yb, yw, h, hh, yTop, kp });
      }
    }
    this.line(top, { color: this.c('chalk'), width: 2.2 });
    this.line(bot, { color: this.c('chalk'), width: 2.2 });
    for (const t of tubes) this.line([[t.x - 4, t.yb], [t.x + 4, t.yb]], { color: this.c('sky'), width: 2.4, alpha: 0.5 });
    // le particelle d'acqua
    for (const q of this.parts) {
      const x = X(q.s), y = yc + (q.f - 0.5) * 2 * half(q.s) * 0.88;
      this.ball(x, y, 1.8, { color: this.c('sky'), fill: 0.9, width: 1, shine: false, alpha: live ? 1 : 0.4 });
    }
    // le altezze nei tubicini; se la pressione scende sotto quella dell'aria, il tubicino risucchia aria
    if (tubes.length && live) {
      const [a, b] = tubes, done = u >= 1;
      if (done && b.h > 0) {
        this.line([[a.x + 6, a.yw], [b.x + 14, a.yw]], { color: this.c('muted'), width: 1.2, dash: [4, 4] });
        if (!E) this.text(`Δh = ${fmt(Math.round(a.h - b.h), 0)} cm`, b.x + 10, (a.yw + b.yw) / 2 + 4, { size: 10.5, color: this.c('muted'), mono: true });
      }
      for (const t of tubes) {
        if (t.hh * t.kp > 2 && t.yw < t.yb - 1) this.text(`${fmt(Math.round(t.hh), 0)} cm`, t.x - 9, t.yw + 4, { size: 10.5, align: 'right', color: this.c('sky'), weight: 700 });
        if (done && t.h <= 0) {
          for (let i = 0; i < 4; i++) { const ph = (this.clock * 0.8 + i / 4) % 1; this.ball(t.x, t.yTop + ph * (t.yb - t.yTop), 2.2, { color: this.c('chalk'), fill: 0.2, width: 1.2, shine: false, alpha: 1 - ph * 0.6 }); }
          this.text(i18n('risucchia aria!'), t.x, t.yTop - 6, { size: 11, align: 'center', color: this.c('coral'), weight: 700 });
        }
      }
    }
    // le frecce della velocità, sotto il tubo
    const v1 = p.v1, v2 = this.v2(), ya = yc + hw / 2 + 16, k = 22;
    for (const [s, v] of [[0.16, v1], [0.52, v2]]) {
      const L = Math.min(84, k * v);
      this.arrow(X(s) - L / 2, ya, X(s) + L / 2, ya, { color: this.c('orange'), width: 2.4, head: 7 });
      this.text(`${two(v)} m/s`, X(s), ya + 17, { size: 10.5, align: 'center', color: this.c('orange'), mono: true });
    }
    // il riquadro
    const rows = [];
    if (E) rows.push([p.ratio === 1 ? i18n('il tubo non si stringe: l’acqua va sempre uguale') : i18n('nella strozzatura l’acqua corre {n} volte più veloce', { n: one(p.ratio) }), this.c('orange'), 700]);
    else rows.push([i18n('A₁·v₁ = A₂·v₂: nella strozzatura v₂ = {v} m/s', { v: two(v2) }), this.c('orange'), 700]);
    if (p.piezo && this.result) rows.push([E ? i18n('dove l’acqua corre, spinge meno: la cannuccia scende') : i18n('dove l’acqua corre, la pressione cala di {dp} Pa', { dp: fmt(Math.round(500 * (v2 * v2 - v1 * v1)), 0) }), this.c('sky'), 700]);
    this.box(rows);
  }

  // ---------- l'ala nella galleria del vento ----------
  drawWing() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const w = this.wing(), on = live ? easeOut(u) : 0, stall = p.alpha > stallAt(p.shape);
    const yT = 66, yB = H - 12, cx = W * 0.46, cy = (yT + yB) / 2 + 14, ch = Math.min(W * 0.42, 210), a = (p.alpha * Math.PI) / 180;
    const xl = cx - (ch / 2) * Math.cos(a), xr = cx + (ch / 2) * Math.cos(a), tanA = Math.tan(a);
    // le pareti della galleria
    this.line([[0, yT], [W, yT]], { color: this.c('muted'), width: 2 });
    this.line([[0, yB], [W, yB]], { color: this.c('muted'), width: 2 });
    // l'aria: davanti all'ala sale un poco, dietro scende (o sale, se l'ala spinge in giù); gira intorno all'ala
    const defl = on * w.C, wy = (x) => cy + (x - cx) * tanA;
    const t1 = ch * 0.11, t2 = ch * 0.05;
    const yAt = (x, y0, body = true) => {
      const dy = y0 - cy, near = Math.exp(-(dy * dy) / (ch * 0.6) ** 2), z = (x - cx) / (0.45 * ch), e = (x - xl + 10) / (0.35 * ch);
      let y = y0 + near * defl * (34 * (0.5 + 0.5 * Math.tanh(z)) - 12 * Math.exp(-e * e));
      if (body && x >= xl - 4 && x <= xr + 4) { // non attraversa l'ala
        const yw = wy(x);
        if (y > yw - t1 - 3 && y < yw + t2 + 3) y = y0 < cy ? yw - t1 - 3 : yw + t2 + 3;
      }
      if (stall && live && x > cx && y0 < cy + ch * 0.12 && y0 > cy - ch * 0.4) y += Math.sin(this.clock * 9 + y0 * 0.7) * 6 * on;
      return y;
    };
    for (let i = 0; i < 11; i++) { // le linee di corrente, appena accennate (non quelle che passerebbero dentro l'ala)
      const y0 = yT + 8 + ((i + 0.5) / 11) * (yB - yT - 16), yc0 = yAt(cx, y0, false);
      if (yc0 > wy(cx) - t1 - 8 && yc0 < wy(cx) + t2 + 8) continue;
      const pts = [];
      for (let x = -4; x <= W + 8; x += 6) pts.push([x, yAt(x, y0, false)]);
      this.line(pts, { color: this.c('sky'), width: 1, alpha: live ? 0.22 : 0.1 });
    }
    const len = live ? 5 + p.kmh / 25 : 4;
    for (const q of this.parts) {
      const x = q.s * (W + 40) - 20, y0 = yT + 8 + q.f * (yB - yT - 16);
      this.line([[x - len, yAt(x - len, y0)], [x, yAt(x, y0)]], { color: this.c('sky'), width: 1.6, alpha: live ? 0.8 : 0.3 });
    }
    // l'ala, ruotata del suo angolo (il bordo d'attacco a sinistra, contro il vento)
    const prof = this.profile(p.shape, ch);
    g.save(); g.translate(cx, cy); g.rotate(a);
    g.beginPath(); prof.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
    g.lineJoin = 'round'; g.fillStyle = this.c('chalk'); g.globalAlpha = 0.22; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2.2; g.stroke();
    g.restore();
    // in stallo, dietro l'ala l'aria si stacca in vortici
    if (stall && live) {
      g.save(); g.strokeStyle = this.c('coral'); g.lineWidth = 1.8; g.globalAlpha = 0.85;
      for (let i = 0; i < 3; i++) { const r = 7 + i * 1.5, x = xr + 12 + i * 28, y = wy(xr) - ch * 0.1 + i * 5, s = this.clock * 5 + i * 2; g.beginPath(); g.arc(x, y, r, s, s + 4.6); g.stroke(); }
      g.restore();
      this.text(i18n('stallo!'), xr - 6, wy(xr) - ch * 0.22, { size: 12, weight: 700, color: this.c('coral'), align: 'center' });
    }
    // le frecce: portanza in su (o in giù), resistenza all'indietro, sulla stessa scala
    if (on > 0) {
      const sc = (cy - yT - 26) / 4200, Lp = Math.max(-(yB - cy - 16), Math.min(cy - yT - 18, w.L * sc)) * on, Dp = Math.min(W - cx - 10, w.D * sc) * on;
      if (Math.abs(Lp) > 2) this.arrow(cx, cy - 4, cx, cy - 4 - Lp, { color: this.c(Lp > 0 ? 'mint' : 'coral'), width: 3, head: 9 });
      if (Dp > 7) this.arrow(cx + 6, cy, cx + 6 + Dp, cy, { color: this.c('orange'), width: 2.4, head: 7 });
    }
    // il riquadro
    const name = i18n(SHAPES[p.shape].name);
    const rows = [[E ? i18n('{s}, angolo {a} gradi', { s: name, a: p.alpha }) : i18n('{s}, angolo {a}°', { s: name, a: p.alpha }), this.c('chalk'), 700]];
    rows.push([E ? i18n('vento: {k} km/h', { k: p.kmh }) : i18n('vento: {k} km/h = {v} m/s', { k: p.kmh, v: one(p.kmh / 3.6) }), this.c('sky'), 600]);
    if (this.result) {
      const kg = Math.round(w.L / G);
      if (E) rows.push([kg >= 1 ? i18n('l’aria spinge su l’ala: regge {kg} kg', { kg: fmt(kg, 0) }) : kg <= -1 ? i18n('l’aria spinge giù l’ala!') : i18n('l’ala non regge niente'), this.c(kg >= 1 ? 'mint' : kg <= -1 ? 'coral' : 'muted'), 700]);
      else rows.push([i18n('portanza L = {L} N, resistenza {D} N', { L: fmt(Math.round(w.L), 0), D: fmt(Math.round(w.D), 0) }), this.c(w.L >= 0 ? 'mint' : 'coral'), 700]);
    }
    this.box(rows);
  }

  // il profilo dell'ala, centrato, con il bordo d'attacco a sinistra: curva sopra (un profilo NACA 6412), piatta, o capovolta
  profile(shape, c) {
    if (shape === 'piatta') return [[-c / 2, -0.018 * c], [c / 2, -0.012 * c], [c / 2, 0.012 * c], [-c / 2, 0.018 * c]];
    const m = 0.06, pp = 0.4, t = 0.12, flip = shape === 'rovescia' ? -1 : 1, up = [], lo = [];
    for (let i = 0; i <= 30; i++) {
      const x = (1 - Math.cos((i / 30) * Math.PI)) / 2;
      const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1015 * x ** 4);
      const yc = x < pp ? (m / (pp * pp)) * (2 * pp * x - x * x) : (m / (1 - pp) ** 2) * (1 - 2 * pp + 2 * pp * x - x * x);
      up.push([(x - 0.5) * c, -flip * (yc + yt) * c]);
      lo.push([(x - 0.5) * c, -flip * (yc - yt) * c]);
    }
    return [...up, ...lo.reverse()];
  }

  // ---------- il decollo dell'idrovolante ----------
  drawTakeoff() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, to = this.takeoff();
    const x0 = 42, x1 = x0 + 0.68 * (W - x0 - 16), k = (x1 - x0) / RUNWAY, yW = H - 64;
    const tt = this.result ? this.tEnd() : live ? Math.min(this.t, this.tEnd()) : 0;
    // dove sta: corre con accelerazione costante; se la portanza basta si stacca e sale
    const run = RUNWAY * (tt / TR) ** 2;
    let d = run, alt = 0;
    if (to.up) alt = Math.max(0, d - to.d) * 0.8;
    else d = Math.min(d, RUNWAY - 30 / k);
    const stopped = !to.up && run >= RUNWAY - 30 / k, v2now = stopped ? 0 : (VMAX2 * d) / RUNWAY;
    // l'acqua del porto, le boe e le distanze
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.12; g.fillRect(0, yW, W, H - yW); g.restore();
    const wave = []; for (let x = 0; x <= W + 6; x += 6) wave.push([x, yW + Math.sin(x * 0.09 + this.clock * 1.5) * 1.2]);
    this.line(wave, { color: this.c('sky'), width: 1.8 });
    const buoy = (x, col, label) => {
      this.ball(x, yW - 1, 4.5, { color: this.c(col), fill: 0.6, width: 1.6, shine: false });
      this.line([[x, yW - 6], [x, yW - 22], [x + 9, yW - 19], [x, yW - 16]], { color: this.c(col), width: 1.5 });
      this.text(label, x, yW + 30, { size: 10, align: 'center', color: this.c('muted'), mono: true });
    };
    this.text('0', x0, yW + 30, { size: 10, align: 'center', color: this.c('muted'), mono: true });
    if (p.mark > 0) buoy(x0 + p.mark * k, 'sun', `${fmt(p.mark, 0)} m`);
    buoy(x1, 'coral', `${RUNWAY} m`);
    // gli spruzzi sull'acqua, e l'onda dove si stacca
    const px = x0 + d * k, py = yW + 1 - alt * k;
    if (live && !this.result && alt === 0 && !stopped && d > 4) for (let i = 0; i < 4; i++) {
      const ph = (this.clock * 3 + i / 4) % 1;
      this.ball(px - 24 - ph * 18, yW - 3 - Math.sin(ph * Math.PI) * 7, 1.5, { color: this.c('sky'), fill: 0.8, width: 1, shine: false, alpha: 1 - ph });
    }
    if (to.up && live) { const t0 = TR * Math.sqrt(to.d / RUNWAY); if (tt > t0 && tt - t0 < 0.9) this.ripple(x0 + to.d * k, yW, tt - t0, { color: this.c('sky'), r0: 4, r1: 28, dur: 0.9 }); }
    // l'idrovolante, e le frecce: il peso in giù, la portanza in su (quando è lunga come il peso, si stacca)
    this.seaplane(px, py, alt > 0 ? -Math.min(0.2, alt * 0.01) : 0);
    const f = (0.75 * v2now * p.S) / (p.m * G), wl = 24;
    this.arrow(px + 3, py - 11, px + 3, py - 11 + wl, { color: this.c('coral'), width: 2.4, head: 7 });
    if (wl * f > 8) this.arrow(px + 3, py - 26, px + 3, py - 26 - wl * Math.min(1.25, f), { color: this.c('mint'), width: 2.6, head: 7 });
    // il riquadro
    const rows = [[E ? i18n('Idrovolante da {m} kg, ala di {S} metri quadrati', { m: fmt(p.m, 0), S: one(p.S) }) : i18n('Idrovolante da {m} kg, ala di {S} m²', { m: fmt(p.m, 0), S: one(p.S) }), this.c('chalk'), 700]];
    if (this.result) {
      if (to.up) rows.push([i18n('si stacca dall’acqua dopo {d} m!', { d: fmt(Math.round(to.d), 0) }), this.c('mint'), 700]);
      else rows.push([i18n('non si stacca: l’ala non lo regge'), this.c('coral'), 700]);
      if (!E) rows.push([to.up ? i18n('si stacca a {v} km/h: lì la portanza pareggia il peso', { v: fmt(Math.round(Math.sqrt(to.v2) * 3.6), 0) }) : i18n('servirebbero {v} km/h, ma arriva a 130', { v: fmt(Math.round(Math.sqrt(to.v2) * 3.6), 0) }), this.c('sky'), 600]);
    } else if (this.running) rows.push([i18n('velocità: {v} km/h', { v: fmt(Math.round(Math.sqrt(stopped ? 0 : Math.min(v2now, VMAX2 * 1.4)) * 3.6), 0) }), this.c('sky'), 600]);
    else rows.push([i18n('in 300 m arriva a 130 km/h'), this.c('muted'), 500]);
    this.box(rows);
  }

  // l'idrovolante di profilo: (x, y) = sotto il galleggiante, al centro
  seaplane(x, y, tilt) {
    const g = this.ctx, col = this.c('sun'), ch = this.c('chalk');
    g.save(); g.translate(x, y); g.rotate(tilt); g.lineJoin = 'round'; g.lineCap = 'round';
    g.strokeStyle = ch; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-22, -1); g.lineTo(18, -1); g.quadraticCurveTo(26, -1, 29, -5); g.stroke(); // il galleggiante
    g.beginPath(); g.moveTo(-10, -2); g.lineTo(-7, -11); g.moveTo(10, -2); g.lineTo(8, -11); g.stroke(); // i montanti
    g.strokeStyle = col; g.fillStyle = col;
    g.beginPath(); g.moveTo(-30, -17); g.quadraticCurveTo(-10, -25, 20, -20); g.quadraticCurveTo(30, -16, 22, -11); g.lineTo(-24, -12); g.closePath();
    g.globalAlpha = 0.25; g.fill(); g.globalAlpha = 1; g.stroke();
    g.beginPath(); g.moveTo(-27, -16); g.lineTo(-35, -31); g.lineTo(-24, -31); g.lineTo(-17, -19); g.stroke(); // la coda
    g.lineWidth = 3.6; g.beginPath(); g.moveTo(-6, -24); g.lineTo(15, -24); g.stroke(); // l'ala, in alto
    g.strokeStyle = ch; g.lineWidth = 1.6; g.beginPath(); g.moveTo(30, -23); g.lineTo(30, -9); g.stroke(); // l'elica
    g.restore();
  }

  box(rows) {
    if (!rows.length) return;
    const g = this.ctx;
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }
}
