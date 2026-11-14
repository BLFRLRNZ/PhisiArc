// Gara a velocità costante con il grafico spazio-tempo che si disegna in diretta.
import { Sim, fmt } from './base.js';

export class Race extends Sim {
  static controls = {
    v1: { label: 'Velocità auto blu', min: 1, max: 20, step: 0.5, unit: 'm/s' },
    v2: { label: 'Velocità auto arancione', min: 1, max: 20, step: 0.5, unit: 'm/s' },
  };

  defaults() {
    return { v1: 5, v2: 10, x1: 0, x2: 0, D: 100, cars: 2, tmax: 40, names: ['blu', 'arancione'] };
  }

  cars() {
    const p = this.params;
    const all = [
      { v: p.v1, x0: p.x1, col: this.c('car1') },
      { v: p.v2, x0: p.x2, col: this.c('car2') },
    ];
    return all.slice(0, p.cars);
  }

  init() {
    this.state = this.cars().map((c) => ({ ...c, x: c.x0, tEnd: null, pts: [[0, c.x0]] }));
    this.lastPt = 0;
  }

  step(dt) {
    const p = this.params;
    for (const s of this.state) {
      if (s.tEnd != null) continue;
      s.x += s.v * dt;
      if (s.x >= p.D) { s.x = p.D; s.tEnd = this.t; s.pts.push([this.t, p.D]); }
    }
    if (this.t - this.lastPt > 0.05) {
      this.lastPt = this.t;
      for (const s of this.state) if (s.tEnd == null) s.pts.push([this.t, s.x]);
    }
    if (this.state.every((s) => s.tEnd != null) || this.t > p.tmax) {
      this.finish({ times: this.state.map((s) => s.tEnd), x: this.state.map((s) => s.x) });
    }
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const st = this.state;
    // pista (in alto)
    const trackH = Math.min(110, H * 0.36);
    const L = 30, R = W - 30;
    const sx = (x) => L + ((R - L) * x) / p.D;
    const lane = (trackH - 20) / st.length;
    g.strokeStyle = this.c('edge'); g.lineWidth = 1.5;
    g.setLineDash([10, 8]);
    for (let i = 1; i < st.length; i++) { const y = 10 + 10 + lane * i - 2; g.beginPath(); g.moveTo(L - 10, y); g.lineTo(R + 10, y); g.stroke(); }
    g.setLineDash([]);
    this.ground(trackH - 2, { x0: L - 10, x1: R + 10 });
    g.lineWidth = 1.5;
    g.strokeStyle = this.c('ink');
    g.setLineDash([6, 4]);
    g.beginPath(); g.moveTo(R, 10); g.lineTo(R, trackH); g.stroke();
    g.setLineDash([]);
    this.text('🏁', R + 2, 26, { size: 14 });
    this.text(`${p.D} m`, R, trackH + 14, { size: 11, align: 'center', color: this.c('muted') });
    this.text('0', L, trackH + 14, { size: 11, align: 'center', color: this.c('muted') });
    st.forEach((s, i) => {
      const y = 16 + lane * i + lane / 2;
      const x = sx(s.x);
      g.fillStyle = s.col;
      g.beginPath();
      g.roundRect(x - 26, y - 9, 26, 14, 4);
      g.fill();
      g.fillStyle = this.c('ink');
      g.beginPath(); g.arc(x - 20, y + 6, 3.5, 0, 7); g.arc(x - 6, y + 6, 3.5, 0, 7); g.fill();
      this.text(`${fmt(s.v, 1)} m/s`, x - 30, y + 2, { size: 11, align: 'right', color: this.c('muted') });
    });
    // grafico spazio-tempo (in basso)
    const gx = 46, gy = trackH + 30, gw = W - gx - 20, gh = H - gy - 30;
    const tEst = Math.max(...st.map((s) => (p.D - s.x0) / s.v));
    const tG = Math.max(5, Math.ceil(Math.min(p.tmax, tEst) / 5) * 5);
    g.strokeStyle = this.c('line');
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx, gy + gh); g.lineTo(gx + gw, gy + gh); g.stroke();
    for (let t = 0; t <= tG; t += tG / 5) {
      const x = gx + (gw * t) / tG;
      this.text(fmt(t, 0), x, gy + gh + 14, { size: 10, align: 'center', color: this.c('muted') });
    }
    for (let d = 0; d <= p.D; d += p.D / 4) {
      const y = gy + gh - (gh * d) / p.D;
      this.text(fmt(d, 0), gx - 6, y + 3, { size: 10, align: 'right', color: this.c('muted') });
    }
    this.text('tempo (s)', gx + gw, gy + gh - 6, { size: 11, align: 'right', color: this.c('muted') });
    this.text('posizione (m)', gx + 4, gy + 10, { size: 11, color: this.c('muted') });
    g.lineWidth = 3;
    for (const s of st) {
      g.strokeStyle = s.col;
      g.beginPath();
      s.pts.forEach(([t, x], i) => {
        const X = gx + (gw * Math.min(t, tG)) / tG, Y = gy + gh - (gh * x) / p.D;
        i ? g.lineTo(X, Y) : g.moveTo(X, Y);
      });
      if (this.running) g.lineTo(gx + (gw * Math.min(this.t, tG)) / tG, gy + gh - (gh * s.x) / p.D);
      g.stroke();
    }
    g.lineWidth = 1;
    this.text(`Tempo: ${fmt(this.t, 1)} s`, W - 20, gy + 10, { size: 13, align: 'right', weight: 600 });
    if (this.result) {
      const parts = st.map((s, i) => s.tEnd != null ? `${p.names[i]}: ${fmt(s.tEnd, 1)} s` : `${p.names[i]}: non arriva`);
      this.text(parts.join('   '), W - 20, gy + 28, { size: 13, align: 'right', weight: 700, color: this.c('accent2') });
    }
  }
}
