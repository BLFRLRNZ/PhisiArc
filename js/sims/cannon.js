// Cannone: angolo e velocità di lancio, bersaglio, traiettorie precedenti in trasparenza.
import { Sim, fmt, easeOut, easeInOut } from './base.js';

export class Cannon extends Sim {
  static controls = {
    ang: { label: 'Angolo', min: 5, max: 85, step: 1, unit: '°' },
    v: { label: 'Velocità di lancio', min: 5, max: 35, step: 0.5, unit: 'm/s' },
  };

  defaults() { return { ang: 45, v: 20, target: null, tw: 3, xmax: 100, g: 9.81 }; }

  constructor(cv, p) {
    super(cv, p);
    this.speed = 1.6;
    this.history = [];
  }

  init() {
    const p = this.params, a = (p.ang * Math.PI) / 180;
    this.x = 0; this.y = 0;
    this.vx = p.v * Math.cos(a);
    this.vy = p.v * Math.sin(a);
    this.path = [[0, 0]];
    this.lastPt = 0;
    this.strobe = [];
    this.nextS = 0.25;
    this.top = [0, 0];
  }

  start() {
    if (this.path && this.path.length > 2) {
      this.history.push(this.path);
      if (this.history.length > 4) this.history.shift();
    }
    super.start();
  }

  clearHistory() { this.history = []; this.draw(); }

  step(dt) {
    const p = this.params;
    const px = this.x, py = this.y;
    this.vy -= p.g * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.t - this.lastPt > 0.02) { this.lastPt = this.t; this.path.push([this.x, this.y]); }
    if (this.t >= this.nextS) { this.nextS += 0.25; this.strobe.push([this.x, this.y]); } // punti a tempi uguali: in orizzontale sono equidistanti
    if (this.y > this.top[1]) this.top = [this.x, this.y];
    if (this.y < 0) {
      const k = py / (py - this.y);
      this.x = px + (this.x - px) * k;
      this.y = 0;
      this.path.push([this.x, 0]);
      const hit = p.target != null && Math.abs(this.x - p.target) <= p.tw;
      this.finish({ x: this.x, hit, t: this.t });
    }
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const sky = this.c('sky'), chalk = this.c('chalk'), muted = this.c('muted'), sun = this.c('sun'), coral = this.c('coral');
    const ox = 34, oy = H - 40;
    const s = Math.min((W - 56) / p.xmax, (H - 80) / (p.xmax * 0.5));
    const X = (x) => ox + x * s, Y = (y) => oy - y * s;
    this.ground(oy, { x0: 10 });
    for (let d = 0; d <= p.xmax; d += p.xmax > 100 ? 25 : 20) {
      this.line([[X(d), oy + 2], [X(d), oy + 7]], { color: muted, width: 1.5 });
      this.text(`${d}`, X(d), oy + 20, { size: 10, align: 'center', color: muted, mono: true });
    }
    this.text('m', X(p.xmax) + 10, oy + 20, { size: 10, color: muted });

    // bersaglio: zona sul terreno e bandierina a linee
    if (p.target != null) {
      this.line([[X(p.target - p.tw), oy], [X(p.target + p.tw), oy]], { color: coral, width: 6 });
      const fx = X(p.target);
      this.line([[fx, oy], [fx, oy - 38]], { color: chalk, width: 2 });
      g.save(); g.strokeStyle = coral; g.fillStyle = coral; g.lineWidth = 2; g.lineJoin = 'round';
      const wav = Math.sin(this.clock * 4) * 2;
      g.beginPath(); g.moveTo(fx, oy - 38); g.lineTo(fx + 18, oy - 32 + wav); g.lineTo(fx, oy - 25); g.closePath();
      g.globalAlpha = 0.25; g.fill(); g.globalAlpha = 1; g.stroke(); g.restore();
      this.text(`${fmt(p.target, 0)} m`, fx, oy - 46, { size: 12, align: 'center', weight: 600, mono: true });
    }

    // lanci precedenti, tratteggiati
    for (const h of this.history || []) this.line(h.map(([x, y]) => [X(x), Y(y)]), { color: muted, width: 1.6, dash: [5, 6], alpha: 0.45 });

    // cannone: ruota e canna a linee, l'angolo si muove con morbidezza
    const ang = this.sm('ang', p.ang, 12), a = (ang * Math.PI) / 180, vS = this.sm('v', p.v, 12);
    g.save();
    g.translate(X(0), Y(0) - 4); g.rotate(-a);
    g.strokeStyle = chalk; g.lineWidth = 2.4; g.lineJoin = 'round';
    g.fillStyle = chalk; g.globalAlpha = 0.12; g.beginPath(); g.roundRect(-4, -6, 36, 12, 4); g.fill();
    g.globalAlpha = 1; g.beginPath(); g.roundRect(-4, -6, 36, 12, 4); g.stroke();
    g.restore();
    this.ball(X(0), Y(0) - 4, 9, { color: chalk, fill: 0.15, shine: false });
    g.save(); g.strokeStyle = chalk; g.lineWidth = 1.6;
    for (let k = 0; k < 3; k++) { const r = (k * Math.PI) / 3; g.beginPath(); g.moveTo(X(0) + Math.cos(r) * 8, Y(0) - 4 + Math.sin(r) * 8); g.lineTo(X(0) - Math.cos(r) * 8, Y(0) - 4 - Math.sin(r) * 8); g.stroke(); }
    g.restore();

    // a riposo: mira (vettore della velocità di partenza) e arco dell'angolo
    if (!this.running && !this.result) {
      const L = vS * s * 0.55 + 30;
      this.arrow(X(0), Y(0) - 4, X(0) + Math.cos(a) * L, Y(0) - 4 - Math.sin(a) * L, { color: this.c('orange'), dash: [6, 6], label: `${fmt(vS, 1)} m/s` });
      g.save(); g.strokeStyle = sun; g.lineWidth = 2;
      g.beginPath(); g.arc(X(0), Y(0) - 4, 48, -a, 0); g.stroke(); g.restore();
      this.text(`${fmt(ang, 0)}°`, X(0) + 54 * Math.cos(a / 2) + 6, Y(0) - 4 - 54 * Math.sin(a / 2) + 4, { size: 12, color: sun, mono: true });
    }

    // traiettoria e punti a tempi uguali
    this.line(this.path.map(([x, y]) => [X(x), Y(y)]), { color: sky, width: 2.6 });
    this.strobe.forEach(([x, y]) => this.ball(X(x), Y(y), 3, { color: chalk, fill: 1, shine: false, alpha: 0.75 }));
    this.ball(X(this.x), Y(this.y), 6.5, { color: sky, fill: 0.45 });

    // vettori durante il volo: velocità e le sue due parti
    if (this.running) {
      const k = s * 0.5, bx = X(this.x), by = Y(this.y);
      this.arrow(bx, by, bx + this.vx * k, by, { color: sky, width: 1.8, dash: [4, 4], label: 'vx', head: 7 });
      this.arrow(bx, by, bx, by - this.vy * k, { color: this.c('mint'), width: 1.8, dash: [4, 4], label: 'vy', head: 7 });
      this.arrow(bx, by, bx + this.vx * k, by - this.vy * k, { color: this.c('orange'), label: 'v' });
    }

    // a volo finito: altezza massima, gittata, impatto
    if (this.result) {
      const age = this.age, lx = X(this.result.x);
      this.ripple(lx, oy, age, { color: chalk, r1: 30 });
      this.burst(lx, oy - 2, age, { color: muted, n: 8, r: 24, dur: 0.5 });
      if (this.result.hit) {
        this.burst(lx, oy - 10, age - 0.05, { color: sun, n: 14, r: 60, dur: 0.9 });
        this.ripple(lx, oy - 10, age - 0.1, { color: sun, r1: 70, dur: 1 });
      }
      const u1 = easeInOut((age - 0.25) / 0.6);
      if (u1 > 0 && this.top[1] > 0.5) {
        const [tx, ty] = this.top;
        this.line([[X(tx), Y(ty)], [X(tx), oy]], { color: sun, width: 1.6, dash: [3, 5], upto: u1 });
        g.globalAlpha = u1;
        this.text(`altezza max ${fmt(ty, 1)} m`, X(tx) + 8, Y(ty) - 10, { size: 11, color: sun });
        g.globalAlpha = 1;
      }
      const u2 = easeInOut((age - 0.6) / 0.6);
      if (u2 > 0) {
        this.arrow(X(0), oy + 30, X(0) + (lx - X(0)) * u2, oy + 30, { color: chalk, width: 1.6, head: 7 });
      }
    }

    this.text(`${fmt(p.ang, 0)}°  ·  ${fmt(p.v, 1)} m/s`, 14, 24, { size: 14, weight: 600 });
    if (this.result) {
      const msg = `Atterra a ${fmt(this.result.x, 1)} m` + (p.target != null && this.result.hit ? ' · Centro!' : '');
      g.globalAlpha = easeOut(this.age / 0.4);
      this.text(msg, W - 14, 24, { size: 14, align: 'right', weight: 700, color: this.result.hit ? sun : this.c('accent2') });
      g.globalAlpha = 1;
    }
  }
}
