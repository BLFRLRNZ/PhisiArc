// Caduta libera: oggetti diversi, con o senza aria, sulla Terra o sulla Luna.
import { Sim, fmt, easeOut } from './base.js';

export const OBJ = {
  piuma: { col: 'chalk', name: 'piuma', vt: 0.6 },
  martello: { col: 'orange', name: 'martello', vt: 45 },
  pallina: { col: 'sun', name: 'pallina da ping pong', vt: 9 },
  boccia: { col: 'muted', name: 'boccia di ferro', vt: 70 },
  foglio: { col: 'chalk', name: 'foglio aperto', vt: 1.2 },
  sasso: { col: 'muted', name: 'sasso', vt: 40 },
  carrello: { col: 'coral', name: 'cabina della torre', vt: 200 },
};

export const G = { terra: 9.81, luna: 1.62 };

export class Fall extends Sim {
  static controls = {
    h: { label: 'Altezza di partenza', min: 1, max: 60, step: 0.5, unit: 'm' },
    air: { label: 'Aria', type: 'toggle' },
    planet: { label: 'Dove', type: 'select', options: [['terra', 'Terra'], ['luna', 'Luna']] },
  };

  defaults() { return { h: 2, air: true, planet: 'terra', objs: ['piuma', 'martello'] }; }

  init() {
    this.state = this.params.objs.map((k) => ({ ...OBJ[k], key: k, y: 0, v: 0, tEnd: null, ghosts: [], land: -1 }));
    // foto stroboscopica: una "ombra" a intervalli di tempo uguali
    this.dtS = Math.sqrt((2 * this.params.h) / G[this.params.planet]) / 7;
    this.nextS = this.dtS;
  }

  step(dt) {
    const p = this.params;
    const g = G[p.planet];
    const air = p.air && p.planet === 'terra';
    for (const s of this.state) {
      if (s.tEnd != null) continue;
      const a = air ? g * (1 - (s.v * s.v) / (s.vt * s.vt)) : g;
      s.v += a * dt;
      s.y += s.v * dt;
      if (s.y >= p.h) { s.y = p.h; s.tEnd = this.t; s.land = this.clock; }
    }
    if (this.t >= this.nextS) {
      this.nextS += this.dtS;
      for (const s of this.state) if (s.tEnd == null) s.ghosts.push(s.y);
    }
    if (this.state.every((s) => s.tEnd != null)) this.finish({ times: this.state.map((s) => s.tEnd) });
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const top = 50, ground = H - 40;
    const sy = (y) => top + ((ground - top) * y) / p.h;
    const luna = p.planet === 'luna';
    this.ground(ground, { color: luna ? this.c('moon') : this.c('ink') });
    // righello
    g.strokeStyle = this.c('line');
    g.beginPath(); g.moveTo(40, top); g.lineTo(40, ground); g.stroke();
    for (let i = 0; i <= 4; i++) {
      const y = top + ((ground - top) * i) / 4;
      g.beginPath(); g.moveTo(34, y); g.lineTo(46, y); g.stroke();
      this.text(`${fmt(p.h * (1 - i / 4), 1)} m`, 50, i === 4 ? y - 6 : y + 4, { size: 10, color: this.c('muted') });
    }
    const n = this.state.length;
    // Gli oggetti disegnati a linee, alti circa 30 px, appoggiati sulla y data (la base).
    const draw = (o, x, y, alpha = 1) => {
      const cy = y - 15, t = this.calm ? 0 : this.clock, moving = o.v > 0.05 && o.tEnd == null;
      // F = tratto con un velo di colore dentro (come i personaggi).
      const F = (pts, cn, { f = 0, a = 1, w = 2.2, rot = 0 } = {}) => {
        const c = Math.cos(rot), sn = Math.sin(rot), P = pts.map(([px, py]) => [x + px * c - py * sn, cy + px * sn + py * c]), col = this.c(cn);
        if (f) { g.save(); g.globalAlpha = alpha * f; g.fillStyle = col; g.beginPath(); P.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.closePath(); g.fill(); g.restore(); }
        this.line(P, { color: col, width: w, alpha: alpha * a });
      };
      const arc = (cx, cyy, rx, ry, a0, a1, n = 20) => Array.from({ length: n + 1 }, (_, i) => { const u = a0 + ((a1 - a0) * i) / n; return [cx + rx * Math.cos(u), cyy + ry * Math.sin(u)]; });
      if (o.key === 'piuma') {
        const rot = moving ? Math.sin(t * 5) * 0.4 : -0.15, vane = [];
        for (let i = 0; i <= 12; i++) { const u = i / 12, yy = 12 - u * 26, wd = Math.sin(Math.PI * Math.min(1, u * 1.1)) * 8; vane.push([wd, yy]); }
        for (let i = 12; i >= 0; i--) { const u = i / 12, yy = 12 - u * 26, wd = Math.sin(Math.PI * Math.min(1, u * 1.1)) * 7; vane.push([-wd, yy - 1]); }
        F(vane, 'chalk', { f: 0.16, w: 1.6, rot });
        F([[0, 16], [0, -14]], 'chalk', { w: 1.8, rot });
        for (let yy = -9; yy <= 8; yy += 3.4) { F([[0, yy], [5, yy - 3.5]], 'chalk', { a: 0.45, w: 1, rot }); F([[0, yy + 1], [-5, yy - 2.5]], 'chalk', { a: 0.45, w: 1, rot }); }
        F([[2, 2], [8, 0]], 'sky', { a: 0.7, w: 1.4, rot });
      } else if (o.key === 'martello') {
        F([[-2, -15], [2, -15], [2.5, 4], [-2.5, 4], [-2, -15]], 'orange', { f: 0.3, w: 1.8 });
        for (const yy of [-10, -6, -2]) F([[-2, yy], [2, yy + 1.5]], 'orange', { a: 0.5, w: 1 });
        F([[-13, 4], [10, 4], [13, 7], [13, 11], [10, 14], [-13, 14], [-15, 9], [-13, 4]], 'muted', { f: 0.35, w: 2 });
        F([[-11, 7], [8, 7]], 'chalk', { a: 0.5, w: 1.2 });
      } else if (o.key === 'pallina') {
        this.ball(x, cy + 6, 8, { color: this.c('sun'), fill: 0.25, alpha });
        F(arc(0, 6, 8, 3, 0, Math.PI), 'orange', { a: 0.6, w: 1.2 });
      } else if (o.key === 'boccia') {
        this.ball(x, cy + 2, 12, { color: this.c('chalk'), fill: 0.3, alpha });
        F(arc(0, 2, 12, 4.5, 0.15, Math.PI - 0.15), 'muted', { a: 0.7, w: 1.2 });
        F(arc(0, 2, 4.5, 12, -1.3, 1.3), 'muted', { a: 0.5, w: 1.2 });
      } else if (o.key === 'foglio') {
        const fl = moving ? Math.sin(t * 5) * 4 : 0, fold = moving ? Math.cos(t * 5) * 2 : 0;
        F([[-14, -4 + fl], [0, -5 + fold], [14, -4 - fl], [14, 9 - fl], [0, 8 + fold], [-14, 9 + fl], [-14, -4 + fl]], 'chalk', { f: 0.14, w: 1.8 });
        for (let k = 0; k < 3; k++) F([[-10, 0 + k * 3 + fl * 0.6], [10 - (k === 2 ? 6 : 0), 0 + k * 3 - fl * 0.6]], 'sky', { a: 0.5, w: 1 });
        F([[8, -4.4 - fl], [14, 1 - fl]], 'chalk', { a: 0.5, w: 1 });
      } else if (o.key === 'sasso') {
        F([[-14, 12], [-14, 4], [-9, -4], [-2, -7], [6, -6], [12, -1], [14, 6], [13, 12], [-14, 12]], 'muted', { f: 0.3, w: 2 });
        F([[-6, -3], [-2, 3], [5, 1]], 'chalk', { a: 0.35, w: 1.1 }); F([[-9, 7], [-4, 5]], 'chalk', { a: 0.3, w: 1 });
        F([[-8, -2], [-3, -5]], 'chalk', { a: 0.6, w: 1.2 });
      } else {
        F([[-6, -20], [-6, -14]], 'muted', { w: 1.6 }); F([[6, -20], [6, -14]], 'muted', { w: 1.6 });
        F([[-13, -14], [13, -14], [13, 14], [-13, 14], [-13, -14]], 'coral', { f: 0.18, w: 2 });
        F([[-10, -11], [10, -11], [10, 0], [-10, 0], [-10, -11]], 'sky', { f: 0.15, w: 1.2 });
        for (const sx of [-5, 0, 5]) { F([[sx - 1.5, -2], [sx - 1.5, -6]], 'chalk', { a: 0.8, w: 1.4 }); F(arc(sx - 1.5, -7.5, 1.4, 1.4, 0, Math.PI * 2, 8), 'chalk', { a: 0.8, w: 1.2 }); }
        F([[-13, 4], [13, 4]], 'coral', { a: 0.6, w: 1.2 });
        for (const sx of [-8, 0, 8]) F([[sx, 6], [sx, 12]], 'coral', { a: 0.45, w: 1 });
      }
    };
    const vmax = Math.sqrt(2 * G[p.planet] * p.h), kv = ((ground - top) * 0.2) / vmax;
    this.state.forEach((s, i) => {
      const x = W * (0.35 + (0.45 * (i + 0.5)) / n);
      // ombre a tempi uguali: la distanza fra una e l'altra cresce, perché accelera
      // al massimo una decina di ombre: se cade piano se ne tiene una ogni tanto (sempre a tempi uguali)
      const stride = Math.ceil(s.ghosts.length / 10) || 1;
      const gh = s.ghosts.filter((_, j) => (j + 1) % stride === 0);
      gh.forEach((y, j) => {
        const Y = sy(y);
        draw(s, x, Y, 0.22);
        this.line([[x + 22, Y - 15], [x + 32, Y - 15]], { color: this.c('sky'), width: 2, alpha: 0.7 });
        if (j > 0) {
          const Yp = sy(gh[j - 1]);
          this.line([[x + 27, Yp - 15], [x + 27, Y - 15]], { color: this.c('sky'), width: 1, alpha: 0.35, dash: [2, 3] });
        }
      });
      draw(s, x, sy(s.y));
      if (this.running && s.tEnd == null && s.v > 0.05) {
        this.arrow(x - 24, sy(s.y) - 15, x - 24, sy(s.y) - 15 + s.v * kv, { color: this.c('orange'), label: 'v' });
      }
      if (s.land >= 0) {
        const age = this.clock - s.land;
        this.ripple(x, ground, age, { color: this.c('chalk'), r1: 30 });
        this.burst(x, ground - 2, age, { color: this.c('muted'), n: 7, r: 26, dur: 0.5 });
      }
      this.text(s.name, x, ground + 18, { size: 12, align: 'center', color: this.c('ink') });
      if (s.tEnd != null) {
        const u = easeOut((this.clock - s.land) / 0.4);
        g.globalAlpha = u;
        this.text(`${fmt(s.tEnd, 2)} s`, x, ground + 34, { size: 13, align: 'center', weight: 700, color: this.c('accent2'), mono: true });
        g.globalAlpha = 1;
      }
    });
    const where = luna ? 'Luna (niente aria)' : p.air ? 'Terra, con aria' : 'Terra, senza aria (tubo a vuoto)';
    this.text(where, W - 14, 24, { size: 13, align: 'right', weight: 600 });
    this.text(`Tempo: ${fmt(this.t, 2)} s`, 14, 24, { size: 14, weight: 600 });
  }
}
