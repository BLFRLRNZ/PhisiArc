// Gara fra due auto, a velocità costante o in accelerazione, con il grafico che si disegna in diretta:
// posizione–tempo oppure velocità–tempo.
import { Sim, fmt, easeOut, easeInOut } from './base.js';

export class Race extends Sim {
  static controls = {
    v1: { label: 'Velocità auto blu', min: 1, max: 20, step: 0.5, unit: 'm/s' },
    v2: { label: 'Velocità auto arancione', min: 1, max: 20, step: 0.5, unit: 'm/s' },
    a1: { label: 'Accelerazione auto blu', min: 0, max: 5, step: 0.25, unit: 'm/s²' },
    a2: { label: 'Accelerazione auto arancione', min: 0, max: 5, step: 0.25, unit: 'm/s²' },
    graph: { label: 'Grafico', type: 'select', options: [['xt', 'Posizione–tempo'], ['vt', 'Velocità–tempo']] },
  };

  defaults() {
    return { v1: 5, v2: 10, a1: 0, a2: 0, x1: 0, x2: 0, D: 100, cars: 2, tmax: 40, graph: 'xt', names: ['blu', 'arancione'] };
  }

  cars() {
    const p = this.params;
    const all = [
      { v: p.v1, a: p.a1 || 0, x0: p.x1, col: this.c('car1') },
      { v: p.v2, a: p.a2 || 0, x0: p.x2, col: this.c('car2') },
    ];
    return all.slice(0, p.cars);
  }

  init() {
    this.state = this.cars().map((c) => ({ ...c, v0: c.v, x: c.x0, tEnd: null, pts: [[0, c.x0]], vpts: [[0, c.v]], secs: [], land: -1 }));
    this.nextSec = 1;
    this.lastPt = 0;
  }

  step(dt) {
    const p = this.params;
    for (const s of this.state) {
      if (s.tEnd != null) continue;
      // velocità e posizione esatte del moto uniformemente accelerato (niente errori di passo)
      const t = this.t;
      s.v = s.v0 + s.a * t;
      s.x = s.x0 + s.v0 * t + 0.5 * s.a * t * t;
      if (s.x >= p.D) {
        const tE = s.a ? (-s.v0 + Math.sqrt(s.v0 * s.v0 + 2 * s.a * (p.D - s.x0))) / s.a : (p.D - s.x0) / s.v0;
        s.x = p.D; s.v = s.v0 + s.a * tE; s.tEnd = tE; s.land = this.clock; s.pts.push([tE, p.D]); s.vpts.push([tE, s.v]);
      }
    }
    if (this.t >= this.nextSec) { // un segno ogni secondo: a velocità costante sono equidistanti
      for (const s of this.state) if (s.tEnd == null) { const T = this.nextSec; s.secs.push([T, s.x0 + s.v0 * T + 0.5 * s.a * T * T, s.v0 + s.a * T]); }
      this.nextSec += 1;
    }
    if (this.t - this.lastPt > 0.05) {
      this.lastPt = this.t;
      for (const s of this.state) if (s.tEnd == null) { s.pts.push([this.t, s.x]); s.vpts.push([this.t, s.v]); }
    }
    if (this.state.every((s) => s.tEnd != null) || this.t > p.tmax) {
      this.finish({ times: this.state.map((s) => s.tEnd), x: this.state.map((s) => s.x), vEnd: this.state.map((s) => s.v) });
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
    const gx = 46, gy = trackH + 30, gw = W - gx - 20, gh = H - gy - 30, VT = p.graph === 'vt';
    const tOf = (s) => (s.a ? (-s.v0 + Math.sqrt(s.v0 * s.v0 + 2 * s.a * (p.D - s.x0))) / s.a : (p.D - s.x0) / Math.max(1e-6, s.v0));
    const tEst = Math.max(...st.map(tOf));
    const tG = Math.max(5, Math.ceil(Math.min(p.tmax, tEst) / 5) * 5);
    // asse verticale: posizione fino al traguardo, oppure velocità fino alla più alta raggiunta (in multipli di 5)
    const vTop = Math.max(5, Math.ceil(Math.max(...st.map((s) => s.v0 + s.a * Math.min(tOf(s), p.tmax))) / 5) * 5);
    const yTop = VT ? vTop : p.D;
    g.strokeStyle = this.c('line');
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx, gy + gh); g.lineTo(gx + gw, gy + gh); g.stroke();
    for (let t = 0; t <= tG; t += tG / 5) {
      const x = gx + (gw * t) / tG;
      this.text(fmt(t, 0), x, gy + gh + 14, { size: 10, align: 'center', color: this.c('muted') });
    }
    const yStep = VT ? (vTop <= 20 ? 5 : 10) : [5, 10, 20, 25, 50, 100].find((v) => v >= p.D / 6) || p.D / 4;
    for (let d = 0; d <= yTop + 1e-9; d += yStep) {
      const y = gy + gh - (gh * d) / yTop;
      this.text(fmt(d, 0), gx - 6, y + 3, { size: 10, align: 'right', color: this.c('muted') });
    }
    this.text('tempo (s)', gx + gw, gy + gh - 6, { size: 11, align: 'right', color: this.c('muted') });
    this.text(VT ? 'velocità (m/s)' : 'posizione (m)', gx + 4, gy + 10, { size: 11, color: this.c('muted') });
    const GX = (t) => gx + (gw * Math.min(t, tG)) / tG, GY = (x) => gy + gh - (gh * Math.min(x, yTop)) / yTop;
    for (const s of st) {
      const pts = (VT ? s.vpts : s.pts).map(([t, x]) => [GX(t), GY(x)]);
      if (this.running && s.tEnd == null) pts.push([GX(this.t), GY(VT ? s.v : s.x)]);
      this.line(pts, { color: s.col, width: 3 });
      s.secs.forEach(([t, x, v]) => this.ball(GX(t), GY(VT ? v : x), 2.6, { color: s.col, fill: 1, shine: false }));
      if (this.running && s.tEnd == null) {
        const [hx, hy] = pts[pts.length - 1];
        this.line([[gx, hy], [hx, hy]], { color: s.col, width: 1, dash: [2, 5], alpha: 0.5 });
        this.ball(hx, hy, 5, { color: s.col, fill: 0.35, shine: false });
      }
      // a gara finita: il triangolo della pendenza. Nel grafico posizione–tempo è la velocità (se costante),
      // nel grafico velocità–tempo è l'accelerazione: quanto cresce la velocità in un secondo.
      if (this.result && s.secs.length >= 3 && (VT || !s.a)) {
        const u = easeInOut((this.age - 0.2) / 0.8);
        if (u > 0) {
          const f = VT ? (T) => s.v0 + s.a * T : (T) => s.x0 + s.v0 * T;
          const dt = VT ? 1 : 2, t1 = Math.floor(s.secs.length / 2), ya = f(t1), yb = f(t1 + dt);
          const A = [GX(t1), GY(ya)], B = [GX(t1 + dt), GY(ya)], C = [GX(t1 + dt), GY(yb)];
          this.line([A, B, C], { color: this.c('chalk'), width: 1.6, upto: u, alpha: 0.8 });
          g.globalAlpha = easeOut((this.age - 0.9) / 0.4);
          this.text(`${dt} s`, (A[0] + B[0]) / 2, A[1] + 13, { size: 10, align: 'center', color: this.c('muted'), mono: true });
          this.text(VT ? `+${String(+s.a.toFixed(2)).replace('.', ',')} m/s` : `${fmt(2 * s.v0, 0)} m`, C[0] + 5, (B[1] + C[1]) / 2 + 4, { size: 10, color: s.col, mono: true });
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
