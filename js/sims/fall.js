// Caduta libera: oggetti diversi, con o senza aria, sulla Terra o sulla Luna.
import { Sim, fmt, easeOut } from './base.js';

export const OBJ = {
  piuma: { icon: '🪶', name: 'piuma', vt: 0.6 },
  martello: { icon: '🔨', name: 'martello', vt: 45 },
  pallina: { icon: '🏓', name: 'pallina da ping pong', vt: 9 },
  boccia: { icon: '⚫', name: 'boccia di ferro', vt: 70 },
  foglio: { icon: '📄', name: 'foglio aperto', vt: 1.2 },
  sasso: { icon: '🪨', name: 'sasso', vt: 40 },
  carrello: { icon: '🛗', name: 'cabina della torre', vt: 200 },
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
    const emoji = (icon, x, y, alpha = 1) => {
      g.save(); g.globalAlpha = alpha;
      g.font = '30px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'bottom';
      g.fillText(icon, x, y);
      g.restore();
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
        emoji(s.icon, x, Y, 0.22);
        this.line([[x + 22, Y - 15], [x + 32, Y - 15]], { color: this.c('sky'), width: 2, alpha: 0.7 });
        if (j > 0) {
          const Yp = sy(gh[j - 1]);
          this.line([[x + 27, Yp - 15], [x + 27, Y - 15]], { color: this.c('sky'), width: 1, alpha: 0.35, dash: [2, 3] });
        }
      });
      emoji(s.icon, x, sy(s.y));
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
