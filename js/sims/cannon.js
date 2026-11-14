// Cannone: angolo e velocità di lancio, bersaglio, traiettorie precedenti in trasparenza.
import { Sim, fmt } from './base.js';

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
    const ox = 30, oy = H - 34;
    const s = Math.min((W - 50) / p.xmax, (H - 70) / (p.xmax * 0.5));
    const X = (x) => ox + x * s, Y = (y) => oy - y * s;
    this.ground(oy);
    for (let d = 0; d <= p.xmax; d += p.xmax > 100 ? 25 : 20) {
      this.text(`${d}`, X(d), oy + 16, { size: 10, align: 'center', color: this.c('muted') });
    }
    this.text('m', X(p.xmax) + 10, oy + 16, { size: 10, color: this.c('muted') });
    if (p.target != null) {
      g.fillStyle = this.c('target');
      g.fillRect(X(p.target - p.tw), oy - 4, 2 * p.tw * s, 8);
      g.strokeStyle = this.c('ink');
      g.beginPath(); g.moveTo(X(p.target), oy); g.lineTo(X(p.target), oy - 34); g.stroke();
      g.fillStyle = this.c('target');
      g.beginPath(); g.moveTo(X(p.target), oy - 34); g.lineTo(X(p.target) + 16, oy - 28); g.lineTo(X(p.target), oy - 22); g.fill();
      this.text(`${fmt(p.target, 0)} m`, X(p.target), oy - 40, { size: 12, align: 'center', weight: 600 });
    }
    const line = (pts, col, w) => {
      g.strokeStyle = col; g.lineWidth = w;
      g.beginPath();
      pts.forEach(([x, y], i) => (i ? g.lineTo(X(x), Y(y)) : g.moveTo(X(x), Y(y))));
      g.stroke();
    };
    g.globalAlpha = 0.3;
    for (const h of this.history || []) line(h, this.c('muted'), 2);
    g.globalAlpha = 1;
    line(this.path, this.c('accent'), 2.5);
    // cannone
    const a = (p.ang * Math.PI) / 180;
    g.save();
    g.translate(X(0), Y(0));
    g.rotate(-a);
    g.fillStyle = this.c('ink');
    g.fillRect(0, -5, 30, 10);
    g.restore();
    g.fillStyle = this.c('ink');
    g.beginPath(); g.arc(X(0), Y(0), 9, 0, 7); g.fill();
    // palla
    g.fillStyle = this.c('accent');
    g.beginPath(); g.arc(X(this.x), Y(this.y), 6, 0, 7); g.fill();
    this.text(`${fmt(p.ang, 0)}°  ·  ${fmt(p.v, 1)} m/s`, 14, 24, { size: 14, weight: 600 });
    if (this.result) {
      const msg = `Atterra a ${fmt(this.result.x, 1)} m` + (p.target != null ? (this.result.hit ? '  🎯 Centro!' : '') : '');
      this.text(msg, W - 14, 24, { size: 14, align: 'right', weight: 700, color: this.c('accent2') });
    }
  }
}
