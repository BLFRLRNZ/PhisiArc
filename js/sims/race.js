// Gara fra due auto, a velocità costante o in accelerazione, con il grafico che si disegna in diretta:
// posizione–tempo oppure velocità–tempo.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, easeOut, easeInOut } from './base.js';
import { drawCar } from './art/car.js';

export class Race extends Sim {
  static controls = {
    v1: { label: 'Velocità auto blu', min: 1, max: 20, step: 0.5, unit: 'm/s' },
    v2: { label: 'Velocità auto arancione', min: 1, max: 20, step: 0.5, unit: 'm/s' },
    a1: { label: 'Accelerazione auto blu', min: 0, max: 5, step: 0.25, unit: 'm/s²' },
    a2: { label: 'Accelerazione auto arancione', min: 0, max: 5, step: 0.25, unit: 'm/s²' },
    graph: { label: 'Grafico', type: 'select', options: [['xt', 'Posizione–tempo'], ['vt', 'Velocità–tempo']] },
  };

  defaults() {
    return { v1: 5, v2: 10, a1: 0, a2: 0, x1: 0, x2: 0, D: 100, cars: 2, tmax: 40, graph: 'xt', area: false, names: ['blu', 'arancione'] };
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
      drawCar(this, x, y, s.col, s.x / 0.35);
      if (s.land >= 0) this.burst(sx(p.D), y, this.clock - s.land, { color: s.col, n: 8, r: 22 });
      // la velocità accanto all'auto, alla sua altezza: sopra finiva sull'auto dell'altra corsia
      if (!this.running || s.tEnd != null) {
        const left = x - L > 70;
        this.text(`${fmt(s.v, 1)} m/s`, left ? x - 36 : x + 8, y + 2, { size: 10, align: left ? 'right' : 'left', color: s.col });
      }
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
      // con "area" accesa (grafico velocità–tempo) la zona sotto la linea si colora: la sua area è la strada fatta
      if (VT && p.area && s === st[0] && pts.length > 1) {
        const hx = pts[pts.length - 1][0];
        g.save(); g.globalAlpha = 0.2; g.fillStyle = s.col; g.beginPath();
        g.moveTo(pts[0][0], GY(0)); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(hx, GY(0)); g.closePath(); g.fill(); g.restore();
        if (hx - gx > 110) this.text(i18n('area = strada: {a} m', { a: fmt(s.x - s.x0, 1) }), gx + (hx - gx) * 0.42, GY(0) - 9, { size: 12, align: 'center', weight: 600, color: s.col });
      }
      this.line(pts, { color: s.col, width: 3 });
      s.secs.forEach(([t, x, v]) => this.ball(GX(t), GY(VT ? v : x), 2.6, { color: s.col, fill: 1, shine: false }));
      if (this.running && s.tEnd == null) {
        const [hx, hy] = pts[pts.length - 1];
        this.line([[gx, hy], [hx, hy]], { color: s.col, width: 1, dash: [2, 5], alpha: 0.5 });
        this.ball(hx, hy, 5, { color: s.col, fill: 0.35, shine: false });
      }
      // a gara finita: il triangolo della pendenza. Nel grafico posizione–tempo è la velocità (se costante),
      // nel grafico velocità–tempo è l'accelerazione: quanto cresce la velocità in un secondo.
      if (this.result && s.secs.length >= 3 && (VT ? s.a : !s.a)) { // una linea piatta nel grafico velocità–tempo non ha pendenza da mostrare
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
    // Tempo e arrivi stanno in basso a destra, sopra la scritta dell'asse: le linee del grafico finiscono in alto a destra,
    // e lì i numeri le coprivano. Un tempo per riga, ognuno del colore della sua auto, su un fondo che lo stacca dal disegno.
    const rows = [[i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), this.c('ink')]];
    if (this.result) st.forEach((s, i) => rows.push([s.tEnd != null ? `${i18n(p.names[i])}: ${fmt(s.tEnd, 1)} s` : `${i18n(p.names[i])}: ${i18n('non arriva')}`, s.col]));
    g.font = '700 13px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([r]) => g.measureText(r).width)) + 14, by = gy + gh - 20 - rows.length * 17;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(W - 20 - bw + 7, by, bw, rows.length * 17 + 4); g.restore();
    rows.forEach(([r, col], i) => this.text(r, W - 20, by + 14 + i * 17, { size: 13, align: 'right', weight: i ? 700 : 600, color: col }));
  }
}
