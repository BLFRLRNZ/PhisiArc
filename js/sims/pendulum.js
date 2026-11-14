// Pendolo: lunghezza, massa e angolo regolabili. Conta n oscillazioni e misura il periodo.
import { Sim, fmt } from './base.js';

export class Pendulum extends Sim {
  static controls = {
    L: { label: 'Lunghezza del filo', min: 0.25, max: 2.5, step: 0.05, unit: 'm' },
    m: { label: 'Massa della pallina', min: 0.1, max: 3, step: 0.1, unit: 'kg' },
    a: { label: 'Angolo di partenza', min: 5, max: 60, step: 1, unit: '°' },
  };

  defaults() { return { L: 1, m: 0.5, a: 20, n: 5, g: 9.81 }; }

  init() {
    this.th = (this.params.a * Math.PI) / 180;
    this.w = 0;
    this.prevW = 0;
    this.count = 0;
  }

  step(dt) {
    const p = this.params;
    this.w += -(p.g / p.L) * Math.sin(this.th) * dt;
    this.th += this.w * dt;
    // Da fermo a destra: il periodo finisce quando torna a destra e inverte di nuovo.
    if (this.prevW > 0 && this.w <= 0) {
      this.count++;
      if (this.count >= p.n) this.finish({ T: this.t / p.n, total: this.t, n: p.n });
    }
    this.prevW = this.w;
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const px = W / 2, py = 28;
    const scale = (H - 70) / 2.6;
    // soffitto
    this.ground(py - 4, { x0: px - 60, x1: px + 60 });
    const len = p.L * scale;
    const bx = px + len * Math.sin(this.th);
    const by = py + len * Math.cos(this.th);
    // arco dell'angolo di partenza
    g.strokeStyle = this.c('line');
    g.setLineDash([4, 4]);
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(px, py + len + 14);
    g.stroke();
    g.setLineDash([]);
    // filo
    g.strokeStyle = this.c('ink');
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(bx, by);
    g.stroke();
    // pallina
    const r = 9 + 7 * Math.cbrt(p.m);
    g.fillStyle = this.c('accent');
    g.beginPath();
    g.arc(bx, by, r, 0, Math.PI * 2);
    g.fill();
    this.text(`${fmt(p.m, 1)} kg`, bx, by + r + 16, { size: 12, align: 'center', color: this.c('muted') });
    // letture
    this.text(`Tempo: ${fmt(this.t, 2)} s`, 14, H - 32, { size: 15, weight: 600 });
    this.text(`Oscillazioni: ${this.count} di ${p.n}`, 14, H - 12, { size: 13, color: this.c('muted') });
    this.text(`Filo: ${fmt(p.L, 2)} m`, W - 14, 26, { size: 13, align: 'right', color: this.c('muted') });
    if (this.result) {
      this.text(`Un'oscillazione: ${fmt(this.result.T, 2)} s`, W - 14, H - 14, {
        size: 16, weight: 700, align: 'right', color: this.c('accent2'),
      });
    }
  }
}
