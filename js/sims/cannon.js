// Cannone: angolo e velocità di lancio, bersaglio, traiettorie precedenti in trasparenza.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, easeOut, easeInOut } from './base.js';

export class Cannon extends Sim {
  static controls = {
    ang: { label: 'Angolo', min: 5, max: 85, step: 1, unit: '°' },
    v: { label: 'Velocità di lancio', min: 5, max: 35, step: 0.5, unit: 'm/s' },
    air: { label: 'Aria', type: 'toggle' },
  };

  // air: resistenza dell'aria (proporzionale al quadrato della velocità); k = quanto frena (0,03 ≈ un pallone leggero)
  defaults() { return { ang: 45, v: 20, target: null, tw: 3, xmax: 100, g: 9.81, h0: 0, drop: false, air: false, k: 0.03 }; }

  constructor(cv, p) {
    super(cv, p);
    this.speed = 1.6;
    this.history = [];
  }

  init() {
    const p = this.params, a = (p.ang * Math.PI) / 180;
    this.x = 0; this.y = p.h0 || 0;
    // palla lasciata cadere dallo stesso punto nello stesso istante (per confrontare i due moti)
    this.dy = p.h0 || 0; this.dvy = 0; this.dland = null; this.dstrobe = [];
    this.vx = p.v * Math.cos(a);
    this.vy = p.v * Math.sin(a);
    this.path = [[0, this.y]];
    this.lastPt = 0;
    this.strobe = [];
    this.nextS = 0.25;
    this.top = [0, this.y];
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
    if (p.air) { // l'aria frena in direzione opposta al moto, tanto più quanto più si va veloci
      const sp = Math.hypot(this.vx, this.vy);
      this.vx -= p.k * sp * this.vx * dt;
      this.vy -= p.k * sp * this.vy * dt;
    }
    this.vy -= p.g * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.t - this.lastPt > 0.02) { this.lastPt = this.t; this.path.push([this.x, this.y]); }
    if (p.drop && this.dland == null) {
      this.dvy -= p.g * dt; this.dy += this.dvy * dt;
      if (this.dy <= 0) { this.dy = 0; this.dland = this.t; }
    }
    if (this.t >= this.nextS) { this.nextS += 0.25; this.strobe.push([this.x, this.y]); if (p.drop) this.dstrobe.push(this.dy); } // punti a tempi uguali: in orizzontale sono equidistanti
    if (this.y > this.top[1]) this.top = [this.x, this.y];
    if (this.y < 0) {
      const k = py / (py - this.y);
      this.x = px + (this.x - px) * k;
      this.y = 0;
      this.path.push([this.x, 0]);
      const hit = p.target != null && Math.abs(this.x - p.target) <= p.tw;
      this.finish({ x: this.x, hit, t: this.t, tDrop: this.dland ?? this.t });
    }
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const sky = this.c('sky'), chalk = this.c('chalk'), muted = this.c('muted'), sun = this.c('sun'), coral = this.c('coral');
    const ox = p.h0 ? 66 : 34, oy = H - 40;
    // La scala si adatta al lancio: la palla resta sempre dentro lo schermo (gittata e altezza previste).
    const a0 = (p.ang * Math.PI) / 180, R = (p.v * p.v * Math.sin(2 * a0)) / p.g, Hm = (p.v * Math.sin(a0)) ** 2 / (2 * p.g);
    const h0 = p.h0 || 0, vy0 = p.v * Math.sin(a0), tf = (vy0 + Math.sqrt(vy0 * vy0 + 2 * p.g * h0)) / p.g, Rh = p.v * Math.cos(a0) * tf;
    const xm = this.sm('xm', Math.max(p.xmax, Rh * 1.08, (p.target ?? 0) + 2 * p.tw), 6), hm = this.sm('hm', Math.max(xm * 0.5, (Hm + h0) * 1.12), 6);
    const s = Math.min((W - 56) / xm, (H - 90) / hm);
    const X = (x) => ox + x * s, Y = (y) => oy - y * s;
    this.ground(oy, { x0: 10 });
    const span = (W - 56) / s, stepD = [10, 20, 25, 50, 100].find((d) => span / d <= 7) || 100;
    for (let d = 0; d <= span; d += stepD) {
      this.line([[X(d), oy + 2], [X(d), oy + 7]], { color: muted, width: 1.5 });
      this.text(`${d}`, X(d), oy + 20, { size: 10, align: 'center', color: muted, mono: true });
    }
    this.text('m', Math.min(W - 12, X(Math.floor(span / stepD) * stepD) + 14), oy + 20, { size: 10, color: muted });

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

    // con l'aria: la parabola che si avrebbe senza aria, per confronto
    if (p.air) {
      const vx0 = p.v * Math.cos(a0), pts = [];
      for (let i = 0; i <= 60; i++) { const tt = (tf * i) / 60; pts.push([X(vx0 * tt), Y(h0 + vy0 * tt - 0.5 * p.g * tt * tt)]); }
      this.line(pts, { color: this.c('sky'), width: 1.4, dash: [3, 6], alpha: 0.5 });
      const [lx, ly] = pts[Math.round(pts.length * 0.62)];
      this.text('senza aria', lx + 8, ly - 6, { size: 11, color: this.c('sky') });
    }

    // lanci precedenti, tratteggiati
    for (const h of this.history || []) this.line(h.map(([x, y]) => [X(x), Y(y)]), { color: muted, width: 1.6, dash: [5, 6], alpha: 0.45 });

    // torre da cui si lancia (se c'è un'altezza di partenza), con la sua quota
    if (h0 > 0) {
      const tx0 = X(0) - 14, tx1 = X(0) + 14;
      g.save(); g.globalAlpha = 0.12; g.fillStyle = muted; g.fillRect(tx0, Y(h0), tx1 - tx0, oy - Y(h0)); g.restore();
      this.line([[tx0, oy], [tx0, Y(h0)], [tx1, Y(h0)], [tx1, oy]], { color: muted, width: 2 });
      for (let yy = Y(h0) + 14; yy < oy - 6; yy += 16) this.line([[tx0, yy], [tx1, yy + 8]], { color: muted, width: 1, alpha: 0.5 });
      this.text(`${fmt(h0, 0)} m`, tx0 - 6, (Y(h0) + oy) / 2, { size: 11, align: 'right', color: muted, mono: true });
    }
    // palla lasciata cadere: scende in verticale accanto alla torre, con i suoi punti a tempi uguali
    if (p.drop) {
      const dx = X(0) + 22;
      this.dstrobe.forEach((y, i) => {
        this.ball(dx, Y(y), 3, { color: this.c('pink'), fill: 1, shine: false, alpha: 0.75 });
        const sp = this.strobe[i];
        if (sp) this.line([[dx, Y(y)], [X(sp[0]), Y(sp[1])]], { color: muted, width: 1, dash: [2, 5], alpha: 0.5 });
      });
      this.ball(dx, Y(this.dy), 6.5, { color: this.c('pink'), fill: 0.45 });
    }

    // cannone: ruota e canna a linee, l'angolo si muove con morbidezza
    const ang = this.sm('ang', p.ang, 12), a = (ang * Math.PI) / 180, vS = this.sm('v', p.v, 12);
    g.save();
    g.translate(X(0), Y(h0) - 4); g.rotate(-a);
    g.strokeStyle = chalk; g.lineWidth = 2.4; g.lineJoin = 'round';
    g.fillStyle = chalk; g.globalAlpha = 0.12; g.beginPath(); g.roundRect(-4, -6, 36, 12, 4); g.fill();
    g.globalAlpha = 1; g.beginPath(); g.roundRect(-4, -6, 36, 12, 4); g.stroke();
    g.restore();
    this.ball(X(0), Y(h0) - 4, 9, { color: chalk, fill: 0.15, shine: false });
    g.save(); g.strokeStyle = chalk; g.lineWidth = 1.6;
    for (let k = 0; k < 3; k++) { const r = (k * Math.PI) / 3; g.beginPath(); g.moveTo(X(0) + Math.cos(r) * 8, Y(h0) - 4 + Math.sin(r) * 8); g.lineTo(X(0) - Math.cos(r) * 8, Y(h0) - 4 - Math.sin(r) * 8); g.stroke(); }
    g.restore();

    // a riposo: mira (vettore della velocità di partenza) e arco dell'angolo
    if (!this.running && !this.result) {
      const L = vS * s * 0.55 + 30;
      this.arrow(X(0), Y(h0) - 4, X(0) + Math.cos(a) * L, Y(h0) - 4 - Math.sin(a) * L, { color: this.c('orange'), dash: [6, 6], label: `${fmt(vS, 1)} m/s` });
      g.save(); g.strokeStyle = sun; g.lineWidth = 2;
      g.beginPath(); g.arc(X(0), Y(h0) - 4, 48, -a, 0); g.stroke(); g.restore();
      this.text(`${fmt(ang, 0)}°`, X(0) + 54 * Math.cos(a / 2) + 6, Y(h0) - 4 - 54 * Math.sin(a / 2) + 4, { size: 12, color: sun, mono: true });
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
      if (u1 > 0 && this.top[1] > h0 + 0.5) {
        const [tx, ty] = this.top;
        this.line([[X(tx), Y(ty)], [X(tx), oy]], { color: sun, width: 1.6, dash: [3, 5], upto: u1 });
        g.globalAlpha = u1;
        // l'etichetta non deve coprire la scritta in alto né uscire dallo schermo
        const lab = `altezza max ${fmt(ty, 1)} m`, ly = Y(ty) - 10 < 46 ? Y(ty) + 18 : Y(ty) - 10, right = X(tx) + 140 > W;
        this.text(lab, right ? X(tx) - 8 : X(tx) + 8, ly, { size: 11, color: sun, align: right ? 'right' : 'left' });
        g.globalAlpha = 1;
      }
      const u2 = easeInOut((age - 0.6) / 0.6);
      if (u2 > 0) {
        this.arrow(X(0), oy + 30, X(0) + (lx - X(0)) * u2, oy + 30, { color: chalk, width: 1.6, head: 7 });
      }
    }

    this.text(`${fmt(p.ang, 0)}°  ·  ${fmt(p.v, 1)} m/s${p.air ? '  ·  ' + i18n('con l’aria') : ''}`, 14, 24, { size: 14, weight: 600 });
    if (this.result) {
      const msg = `Atterra a ${fmt(this.result.x, 1)} m` + (p.target != null && this.result.hit ? ' · Centro!' : '');
      g.globalAlpha = easeOut(this.age / 0.4);
      this.text(msg, W - 14, 24, { size: 14, align: 'right', weight: 700, color: this.result.hit ? sun : this.c('accent2') });
      if (p.drop) this.text(i18n('in volo {a} s · lasciata cadere {b} s', { a: fmt(this.result.t, 2), b: fmt(this.result.tDrop, 2) }), W - 14, 44, { size: 12, align: 'right', color: muted });
      g.globalAlpha = 1;
    }
  }
}
