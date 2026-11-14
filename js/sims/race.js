// Gara a velocità costante con il grafico spazio-tempo che si disegna in diretta.
import { Sim, fmt, easeOut, easeInOut } from './base.js';

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
    this.state = this.cars().map((c) => ({ ...c, x: c.x0, tEnd: null, pts: [[0, c.x0]], secs: [], land: -1 }));
    this.nextSec = 1;
    this.lastPt = 0;
  }

  step(dt) {
    const p = this.params;
    for (const s of this.state) {
      if (s.tEnd != null) continue;
      s.x += s.v * dt;
      if (s.x >= p.D) { s.x = p.D; s.tEnd = this.t; s.land = this.clock; s.pts.push([this.t, p.D]); }
    }
    if (this.t >= this.nextSec) { // un segno ogni secondo: a velocità costante sono equidistanti
      for (const s of this.state) if (s.tEnd == null) s.secs.push([this.nextSec, s.x]);
      this.nextSec += 1;
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
    { // bandiera a scacchi disegnata a linee, che sventola
      const wv = this.calm ? 0 : this.clock * 5, fx = R + 3;
      this.line([[fx, 30], [fx, 8]], { color: this.c('ink'), width: 2 });
      const P = (u, v) => [fx + u * 16, 8 + v * 10 + Math.sin(wv + u * 3) * 1.6 * u];
      this.line([P(0, 0), P(0.5, 0), P(1, 0), P(1, 1), P(0.5, 1), P(0, 1)], { color: this.c('ink'), width: 1.6 });
      for (const [a, b] of [[0, 0], [0.5, 0.5]]) { const q = [P(a, b), P(a + 0.5, b), P(a + 0.5, b + 0.5), P(a, b + 0.5)]; g.save(); g.fillStyle = this.c('ink'); g.beginPath(); q.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.fill(); g.restore(); }
    }
    this.text(`${p.D} m`, R, trackH + 14, { size: 11, align: 'center', color: this.c('muted') });
    this.text('0', L, trackH + 14, { size: 11, align: 'center', color: this.c('muted') });
    st.forEach((s, i) => {
      const y = 16 + lane * i + lane / 2;
      const x = sx(s.x);
      // segni dei secondi sulla corsia
      s.secs.forEach(([t, xs]) => {
        this.line([[sx(xs), y + 8], [sx(xs), y + 14]], { color: s.col, width: 2, alpha: 0.6 });
      });
      // linee di velocità dietro l'auto
      if (this.running && s.tEnd == null) {
        const k = Math.min(1, s.v / 20);
        for (let j = 0; j < 3; j++) {
          const len = 10 + 26 * k, off = ((this.clock * 90 + j * 13) % 18);
          this.line([[x - 34 - off - len, y - 6 + j * 5], [x - 34 - off, y - 6 + j * 5]], { color: s.col, width: 1.6, alpha: 0.5 });
        }
      }
      // l'auto a linee: carrozzeria, abitacolo e ruote che girano
      g.save();
      g.strokeStyle = s.col; g.lineWidth = 2.2; g.lineJoin = 'round'; g.lineCap = 'round';
      g.fillStyle = s.col; g.globalAlpha = 0.18;
      g.beginPath(); g.roundRect(x - 30, y - 6, 30, 11, 4); g.fill();
      g.globalAlpha = 1;
      g.beginPath(); g.roundRect(x - 30, y - 6, 30, 11, 4); g.stroke();
      g.beginPath(); g.moveTo(x - 22, y - 6); g.lineTo(x - 18, y - 12); g.lineTo(x - 9, y - 12); g.lineTo(x - 5, y - 6); g.stroke();
      const rot = (s.x / 0.35);
      for (const wx of [x - 23, x - 7]) {
        g.fillStyle = this.c('sim-bg');
        g.beginPath(); g.arc(wx, y + 6, 4.2, 0, 7); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(wx + Math.cos(rot) * 3.6, y + 6 + Math.sin(rot) * 3.6); g.lineTo(wx - Math.cos(rot) * 3.6, y + 6 - Math.sin(rot) * 3.6); g.stroke();
      }
      g.restore();
      if (s.land >= 0) this.burst(sx(p.D), y, this.clock - s.land, { color: s.col, n: 8, r: 22 });
      this.text(`${fmt(s.v, 1)} m/s`, x - 15, y - 16, { size: 10, align: 'center', color: s.col });
    });
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
    const GX = (t) => gx + (gw * Math.min(t, tG)) / tG, GY = (x) => gy + gh - (gh * x) / p.D;
    for (const s of st) {
      const pts = s.pts.map(([t, x]) => [GX(t), GY(x)]);
      if (this.running && s.tEnd == null) pts.push([GX(this.t), GY(s.x)]);
      this.line(pts, { color: s.col, width: 3 });
      s.secs.forEach(([t, x]) => this.ball(GX(t), GY(x), 2.6, { color: s.col, fill: 1, shine: false }));
      if (this.running && s.tEnd == null) {
        const [hx, hy] = pts[pts.length - 1];
        this.line([[gx, hy], [hx, hy]], { color: s.col, width: 1, dash: [2, 5], alpha: 0.5 });
        this.ball(hx, hy, 5, { color: s.col, fill: 0.35, shine: false });
      }
      // a gara finita: il triangolo della pendenza. La velocità è quanto sale la retta in un secondo.
      if (this.result && s.secs.length >= 3) {
        const u = easeInOut((this.age - 0.2) / 0.8);
        if (u > 0) {
          const t1 = Math.floor(s.secs.length / 2), [ta, xa] = [t1, s.x0 + s.v * t1], tb = ta + 2, xb = s.x0 + s.v * tb;
          const A = [GX(ta), GY(xa)], B = [GX(tb), GY(xa)], C = [GX(tb), GY(xb)];
          this.line([A, B, C], { color: this.c('chalk'), width: 1.6, upto: u, alpha: 0.8 });
          g.globalAlpha = easeOut((this.age - 0.9) / 0.4);
          this.text('2 s', (A[0] + B[0]) / 2, A[1] + 13, { size: 10, align: 'center', color: this.c('muted'), mono: true });
          this.text(`${fmt(2 * s.v, 0)} m`, C[0] + 5, (B[1] + C[1]) / 2 + 4, { size: 10, color: s.col, mono: true });
          g.globalAlpha = 1;
        }
      }
    }
    g.lineWidth = 1;
    this.text(`Tempo: ${fmt(this.t, 1)} s`, W - 20, gy + 10, { size: 13, align: 'right', weight: 600 });
    if (this.result) {
      const parts = st.map((s, i) => s.tEnd != null ? `${p.names[i]}: ${fmt(s.tEnd, 1)} s` : `${p.names[i]}: non arriva`);
      this.text(parts.join('   '), W - 20, gy + 28, { size: 13, align: 'right', weight: 700, color: this.c('accent2') });
    }
  }
}
