// Laboratorio dei grafici: un esperimento in alto, i suoi punti sul grafico in basso.
// Tre esperimenti, tre leggi: il rubinetto (proporzionalità diretta), il viaggio (inversa), la frenata (quadratica).
// Con "errore di misura" acceso, ogni misura esce un po' diversa, come con un cronometro a mano.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut, easeInOut } from './base.js';
import { drawCar } from './art/car.js';

const MODES = {
  rubinetto: { xl: 'tempo aperto (s)', yl: 'acqua (litri)', xmax: 10, f: (x) => 0.5 * x, law: 'diretta', speed: 2 },
  viaggio: { xl: 'velocità (m/s)', yl: 'tempo (s)', xmax: 20, f: (x) => 60 / x, law: 'inversa', speed: 4 },
  frenata: { xl: 'velocità (m/s)', yl: 'frenata (m)', xmax: 30, f: (x) => (x * x) / 14, law: 'quadratica', speed: 1.5 },
};
// numero casuale "a campana" (per gli errori di misura)
const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += Math.random(); return (s - 3) / 1.2; };

export class Lab extends Sim {
  static tall = true;
  static controls = {
    x: { label: 'Valore', min: 1, max: 30, step: 0.5, unit: '' },
    noise: { label: 'Errore di misura', type: 'toggle' },
  };

  defaults() { return { mode: 'rubinetto', x: 4, noise: false, fit: false, keep: true }; }

  get M() { return MODES[this.params.mode] || MODES.rubinetto; }

  set(p) {
    if (p.mode && p.mode !== this.params.mode) this.points = [];
    super.set(p);
  }

  // i punti restano da un lancio all'altro: li cancella solo il tasto Ricomincia (o un cambio di esperimento)
  clearHistory() { this.points = []; this.draw(); }

  init() {
    const M = this.M;
    this.points ??= [];
    this.speed = M.speed;
    this.y = 0; this.phase = 0; this.pos = 0; this.v = this.params.x;
    this.target = M.f(Math.max(0.5, this.params.x));
  }

  step(dt) {
    const p = this.params, M = this.M, x = Math.max(0.5, p.x);
    if (p.mode === 'rubinetto') {
      this.y = Math.min(this.target, 0.5 * this.t);
      if (this.t >= x) this.done();
    } else if (p.mode === 'viaggio') {
      this.pos = Math.min(60, x * this.t);
      if (this.pos >= 60) this.done();
    } else {
      // frenata: 1 s di corsa fino alla linea, poi frena a 7 m/s²
      if (this.t < 1) { this.pos = -x * (1 - this.t); this.v = x; } else {
        this.v = Math.max(0, x - 7 * (this.t - 1));
        this.pos = x * (this.t - 1) - 3.5 * (this.t - 1) ** 2;
        if (this.v <= 0) { this.pos = (x * x) / 14; this.done(); }
      }
    }
    void M;
  }

  done() {
    const p = this.params, M = this.M, x = Math.max(0.5, p.x);
    const truth = M.f(x);
    const meas = p.noise ? Math.max(0.05, truth * (1 + 0.07 * gauss())) : truth;
    const pt = { x, y: meas, at: this.clock };
    if (p.keep) this.points.push(pt); else this.points = [pt];
    this.finish({ x, y: meas, truth, n: this.points.length });
  }

  car(x, y, col, rot = 0) { drawCar(this, x, y, col, rot); }

  drawExperiment(W, top) {
    const p = this.params, g = this.ctx, sky = this.c('sky'), muted = this.c('muted'), chalk = this.c('chalk'), t = this.calm ? 0 : this.clock;
    if (p.mode === 'rubinetto') {
      const tx = W * 0.5, ty = 40, bw = Math.min(150, W * 0.36), bh = top - 88, bx = tx - bw / 2, by = top - 16 - bh;
      // tubo e rubinetto
      this.line([[tx - 60, 0], [tx - 60, ty], [tx - 8, ty], [tx - 8, ty + 14]], { color: muted, width: 5 });
      this.line([[tx - 18, ty + 14], [tx + 2, ty + 14]], { color: chalk, width: 3 });
      this.line([[tx - 8, ty - 4], [tx - 8, ty - 12], [tx - 18, ty - 12]], { color: chalk, width: 2 });
      // getto d'acqua che ondeggia
      if (this.running) {
        const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20, yy = ty + 16 + u * (by + bh - (this.y / 5) * bh - ty - 16); pts.push([tx - 8 + Math.sin(u * 9 - t * 18) * 1.5, yy]); }
        this.line(pts, { color: sky, width: 3, alpha: 0.85 });
      }
      // vasca con l'acqua che sale (scala: 5 litri pieni)
      const lvl = clamp01(this.y / 5) * bh;
      g.save(); g.fillStyle = sky; g.globalAlpha = 0.22; g.fillRect(bx, by + bh - lvl, bw, lvl); g.restore();
      if (lvl > 0) { const w = []; for (let i = 0; i <= 24; i++) { const u = i / 24; w.push([bx + u * bw, by + bh - lvl + Math.sin(u * 12 + t * 4) * 1.5]); } this.line(w, { color: sky, width: 2 }); }
      this.line([[bx, by], [bx, by + bh], [bx + bw, by + bh], [bx + bw, by]], { color: chalk, width: 2.4 });
      for (let l = 1; l <= 5; l++) { const yy = by + bh - (l / 5) * bh; this.line([[bx + bw, yy], [bx + bw + 6, yy]], { color: muted, width: 1.4 }); this.text(`${l} L`, bx + bw + 10, yy + 4, { size: 10, color: muted, mono: true }); }
      this.text(`${fmt(this.y, 2)} L`, bx + bw / 2, by + bh - lvl - 8, { size: 12, align: 'center', color: sky, weight: 600, mono: true });
      this.text(i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), 14, 24, { size: 14, weight: 600 });
    } else {
      const L = 40, R = W - 40, gy = top - 30;
      this.ground(gy + 12, { x0: 10, x1: W - 10 });
      if (p.mode === 'viaggio') {
        const X = (d) => L + ((R - L) * d) / 60;
        this.line([[X(0), gy - 18], [X(0), gy + 12]], { color: muted, width: 1.6, dash: [4, 4] });
        this.line([[X(60), gy - 18], [X(60), gy + 12]], { color: chalk, width: 1.6, dash: [4, 4] });
        this.text('60 m', X(60), gy + 28, { size: 11, align: 'center', color: muted, mono: true });
        this.car(X(this.pos) + 15, gy, this.c('car1'), this.pos / 0.35);
        this.text(i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), 14, 24, { size: 14, weight: 600 });
      } else {
        const span = 70, X = (d) => L + 40 + ((R - L - 40) * d) / span;
        this.line([[X(0), gy - 18], [X(0), gy + 12]], { color: this.c('coral'), width: 2 });
        this.text('freno!', X(0), gy - 24, { size: 11, align: 'center', color: this.c('coral') });
        if (this.t > 1 || this.result) {
          const d = Math.max(0, this.pos);
          this.line([[X(0), gy + 9], [X(d), gy + 9]], { color: muted, width: 3, alpha: 0.6 });
        }
        if (this.result) {
          const u = easeOut(this.age / 0.5), d = this.result.truth;
          this.arrow(X(0), gy + 26, X(0) + (X(d) - X(0)) * u, gy + 26, { color: this.c('sun'), width: 1.8, head: 7 });
          this.text(`${fmt(this.result.y, 1)} m`, X(d / 2), gy + 40, { size: 12, align: 'center', color: this.c('sun'), mono: true });
        }
        this.car(X(this.pos) + 15, gy, this.c('car2'), this.pos / 0.35);
        this.text(`${fmt(this.v, 1)} m/s`, X(this.pos), gy - 22, { size: 11, align: 'center', color: this.c('car2'), mono: true });
        this.text(i18n('Velocità di partenza: {a} m/s', { a: fmt(Math.max(0.5, p.x), 1) }), 14, 24, { size: 14, weight: 600 });
      }
    }
    if (p.noise) this.text('± errore di misura', W - 14, 24, { size: 12, align: 'right', color: this.c('pink') });
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, M = this.M;
    this.clear();
    const top = Math.round(H * 0.42);
    this.drawExperiment(W, top);

    // grafico: assi, tacche, punti misurati
    const gx = 50, gy = top + 18, gw = W - gx - 22, gh = H - gy - 34;
    const ymaxT = M.f(M.law === 'inversa' ? 2 : M.xmax);
    const y0 = Math.max(ymaxT, ...this.points.map((q) => q.y * 1.1)), m0 = 10 ** Math.floor(Math.log10(y0 / 5));
    const st0 = [1, 2, 2.5, 5, 10].map((f) => f * m0).find((v) => v >= (y0 / 5) * 0.99);
    const yTop = this.sm('ym', Math.ceil(y0 / st0 - 1e-9) * st0, 6);
    const GX = (x) => gx + (gw * x) / M.xmax, GY = (y) => gy + gh - (gh * Math.min(y, yTop)) / yTop;
    this.line([[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], { color: this.c('line'), width: 1.4 });
    for (let k = 0; k <= 5; k++) {
      const xv = (M.xmax * k) / 5;
      this.text(fmt(xv, 0), GX(xv), gy + gh + 14, { size: 10, align: 'center', color: this.c('muted'), mono: true });
    }
    // tacche "tonde" sull'asse verticale: 1, 2, 5, 10, 20…
    const raw = yTop / 5, mag = 10 ** Math.floor(Math.log10(raw)), ys = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((v) => v >= raw * 0.99);
    for (let yv = 0; yv <= yTop + 1e-9; yv += ys) this.text(fmt(yv, ys < 1 ? 1 : 0), gx - 6, GY(yv) + 3, { size: 10, align: 'right', color: this.c('muted'), mono: true });
    this.text(M.xl, gx + gw, gy + gh - 6, { size: 11, align: 'right', color: this.c('muted') });
    this.text(M.yl, gx + 6, gy + 10, { size: 11, color: this.c('muted') });

    // la legge vera, tratteggiata, che si disegna da sola quando la si vuole mostrare
    if (p.fit && this.points.length >= 2) {
      const pts = []; for (let i = 0; i <= 60; i++) { const xv = Math.max(M.law === 'inversa' ? 2 : 0, (M.xmax * i) / 60); pts.push([GX(xv), GY(M.f(xv))]); }
      this.line(pts, { color: this.c('sun'), width: 2, dash: [6, 6], alpha: 0.8, upto: this.calm ? 1 : clamp01((this.clock - (this._fitAt ??= this.clock)) / 1.2) });
    } else this._fitAt = null;

    // punti: ognuno arriva dall'esperimento con un piccolo salto; con l'errore acceso hanno la loro barra
    this.points.forEach((q, i) => {
      const u = this.calm ? 1 : easeOut((this.clock - q.at) / 0.5), x = GX(q.x), y = GY(q.y);
      if (p.noise) this.line([[x, GY(q.y * 0.93)], [x, GY(q.y * 1.07)]], { color: this.c('pink'), width: 1.4, alpha: 0.7 * u });
      this.ball(x, y - (1 - u) * 18, 4.5, { color: i === this.points.length - 1 ? this.c('sky') : this.c('chalk'), fill: 0.6, shine: false, alpha: u });
    });
    // linea guida verso il valore scelto, prima di lanciare
    if (!this.running) {
      const xv = Math.max(0.5, p.x);
      this.line([[GX(xv), gy + gh], [GX(xv), gy]], { color: this.c('sky'), width: 1, dash: [2, 5], alpha: 0.4 });
    }
    if (this.result) {
      const msg = `${M.xl.split(' (')[0]} ${fmt(this.result.x, 1)} → ${M.yl.split(' (')[0]} ${fmt(this.result.y, 2)}`;
      g.globalAlpha = easeInOut(this.age / 0.4);
      this.text(msg, W - 14, gy + 10, { size: 12, align: 'right', weight: 600, color: this.c('accent2') });
      g.globalAlpha = 1;
    }
  }
}
