// Moto circolare: la giostra vista dall'alto. Velocità tangente, accelerazione verso il centro,
// e cosa succede quando il seggiolino "lascia la presa": vola via dritto, lungo la tangente.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, easeOut } from './base.js';

export class Circle extends Sim {
  static controls = {
    r: { label: 'Raggio', min: 2, max: 10, step: 0.5, unit: 'm' },
    T: { label: 'Durata di un giro', min: 2, max: 15, step: 0.1, unit: 's' },
    release: { label: 'Lascia la presa', type: 'toggle' },
  };

  defaults() { return { r: 6, T: 6, release: false, laps: 1.25 }; }

  init() {
    const p = this.params;
    this.speed = 1;
    this.th = 0; this.free = null; this.strobe = []; this.nextS = 0;
    this.v = (2 * Math.PI * p.r) / p.T;
    this.a = (this.v * this.v) / p.r;
  }

  pos(th, r = this.params.r) { return [r * Math.cos(th), r * Math.sin(th)]; }

  step() {
    const p = this.params, w = (2 * Math.PI) / p.T;
    if (!this.free) {
      this.th = w * this.t;
      if (this.t >= this.nextS) { this.strobe.push(this.th); this.nextS += p.T / 12; }
      // lascia la presa dopo un giro e un quarto (in cima): da lì niente più tira verso il centro
      if (p.release && this.th >= 2 * Math.PI * p.laps) {
        const th = 2 * Math.PI * p.laps, [x, y] = this.pos(th);
        this.free = { t0: this.t, x0: x, y0: y, vx: -this.v * Math.sin(th), vy: this.v * Math.cos(th), th };
        this.th = th;
      }
      if (!p.release && this.th >= 2 * Math.PI * 2) { this.th = 4 * Math.PI; this.done(); }
    } else {
      const f = this.free, dt = this.t - f.t0;
      f.x = f.x0 + f.vx * dt; f.y = f.y0 + f.vy * dt;
      if (Math.hypot(f.x, f.y) > Math.min(p.r * 2.1, 11.5)) this.done();
    }
  }

  done() { this.finish({ T: this.params.T, v: this.v, a: this.a, r: this.params.r, released: !!this.free }); }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const cx = W / 2, cy = H / 2 + 14, k = (Math.min(W, H - 40) * 0.42) / 10;
    const S = (x, y) => [cx + x * k, cy - y * k];
    // pedana della giostra e sentiero del seggiolino
    const ring = (rr, opt) => { const pts = []; for (let i = 0; i <= 72; i++) { const u = (i / 72) * Math.PI * 2; pts.push(S(rr * Math.cos(u), rr * Math.sin(u))); } this.line(pts, opt); };
    ring(10.4, { color: this.c('line'), width: 1 });
    ring(p.r, { color: this.c('muted'), width: 1.4, dash: [4, 6] });
    // tetto a spicchi che ruota (decorazione)
    const th = this.free ? this.free.th + ((this.t - this.free.t0) * 2 * Math.PI) / p.T : this.th;
    for (let i = 0; i < 8; i++) {
      const u = th + (i * Math.PI) / 4;
      this.line([S(0, 0), S(1.6 * Math.cos(u), 1.6 * Math.sin(u))], { color: i % 2 ? this.c('coral') : this.c('sun'), width: 2, alpha: 0.7 });
    }
    this.ball(...S(0, 0), 7, { color: this.c('sun'), fill: 0.4, shine: false });
    // ombre a tempi uguali (1/12 di giro)
    for (const s of this.strobe.slice(-12)) this.ball(...S(...this.pos(s)), 3, { color: this.c('sky'), fill: 0.5, shine: false, alpha: 0.45 });
    // braccio: segue la giostra anche dopo che il seggiolino si è staccato
    const [ax, ay] = this.pos(th);
    this.line([S(0, 0), S(ax, ay)], { color: this.c('chalk'), width: 2, alpha: this.free ? 0.45 : 1 });
    // seggiolino
    let sx, sy;
    if (this.free) {
      [sx, sy] = [this.free.x, this.free.y];
      this.line([S(this.free.x0, this.free.y0), S(sx, sy)], { color: this.c('pink'), width: 2, dash: [5, 5] });
    } else [sx, sy] = [ax, ay];
    const [X, Y] = S(sx, sy);
    this.ball(X, Y, 9, { color: this.c('coral'), fill: 0.35 });
    // frecce: velocità tangente (arancio), accelerazione verso il centro (menta)
    const vx = this.free ? this.free.vx : -this.v * Math.sin(this.th), vy = this.free ? this.free.vy : this.v * Math.cos(this.th);
    const kv = Math.min(10, 60 / Math.max(this.v, 1));
    this.arrow(X, Y, X + vx * kv, Y - vy * kv, { color: this.c('orange'), label: 'v' });
    if (!this.free) {
      const ka = Math.min(14, 50 / Math.max(this.a, 0.5)), ux = -sx / p.r, uy = -sy / p.r;
      this.arrow(X, Y, X + ux * this.a * ka, Y - uy * this.a * ka, { color: this.c('mint'), label: 'a', width: 2 });
    }
    // testi
    this.text(i18n('Giro: {a} s · raggio {b} m', { a: fmt(p.T, 1), b: fmt(p.r, 1) }), 14, 24, { size: 14, weight: 600 });
    this.text(`v = ${fmt(this.v, 2)} m/s`, W - 14, 24, { size: 13, align: 'right', color: this.c('orange'), weight: 600, mono: true });
    this.text(`a = ${fmt(this.a, 2)} m/s²`, W - 14, 42, { size: 13, align: 'right', color: this.c('mint'), weight: 600, mono: true });
    if (this.free) {
      g.globalAlpha = easeOut((this.t - this.free.t0) / 0.5);
      this.text('libero: va dritto!', X + 14, Y + 22, { size: 12, color: this.c('pink'), weight: 700 });
      g.globalAlpha = 1;
    }
  }
}
