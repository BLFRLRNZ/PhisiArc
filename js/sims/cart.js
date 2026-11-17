// I carrelli dell'Officina: forze, masse e pavimenti. Uno o due carrelli (uno per corsia) su un binario visto di lato.
// Una forza li spinge (la freccia rossa) per un secondo o per sempre; il pavimento può frenarli (tappeto, ghiaccio)
// o lasciarli andare (binario liscio). Sui carrelli ci sono i blocchi della massa, 1 kg l'uno.
// Sotto, il grafico velocità–tempo: la sua pendenza è l'accelerazione, a = F / m.
// Nel modo «coppia» due carrelli fermi si spingono a vicenda con una molla: le due forze sono uguali e opposte
// (azione e reazione) e il carrello più leggero scappa più veloce.
// Con hide: true i blocchi del carrello blu stanno sotto un telo: la massa si scopre solo misurando (il boss al buio).
import { t as i18n } from '../i18n.js';
import { Sim, fmt, easeOut, easeInOut, clamp01 } from './base.js';

const G = 9.81;
// quanto frena ogni pavimento (coefficiente d'attrito: la frenata vale mu · g, qualunque sia la massa)
export const FLOORS = { liscio: 0, ghiaccio: 0.04, tappeto: 0.15 };
export const SPRING = { J: 6, T: 0.25 }; // la molla del modo coppia: spinta totale 6 N·s, data in un quarto di secondo (24 N)
const PXN = 6.5; // lunghezza delle frecce delle forze: pixel per newton

export class Cart extends Sim {
  static controls = {
    F1: { label: 'Forza sul carrello blu', min: 0, max: 12, step: 1, unit: 'N' },
    F2: { label: 'Forza sul carrello arancione', min: 0, max: 12, step: 1, unit: 'N' },
    m1: { label: 'Massa del carrello blu', min: 1, max: 6, step: 1, unit: 'kg' },
    m2: { label: 'Massa del carrello arancione', min: 1, max: 6, step: 1, unit: 'kg' },
    floor: { label: 'Pavimento', type: 'select', options: [['liscio', 'Binario liscio'], ['ghiaccio', 'Ghiaccio'], ['tappeto', 'Tappeto']] },
    tP: { label: 'La spinta dura', type: 'select', options: [[1, '1 secondo'], [0, 'sempre']] },
  };

  defaults() {
    return { mode: 'spinta', cars: 1, F1: 4, F2: 4, m1: 2, m2: 2, tP: 0, floor: 'liscio', D: 20, tmax: 30, graph: true, hide: false, names: ['blu', 'arancione'] };
  }

  get pair() { return this.params.mode === 'coppia'; }

  init() {
    const p = this.params, n = this.pair ? 2 : p.cars, mu = this.pair ? 0 : FLOORS[p.floor] ?? 0;
    this.state = [0, 1].slice(0, n).map((i) => {
      const m = i ? p.m2 : p.m1, F = this.pair ? SPRING.J / SPRING.T : i ? p.F2 : p.F1, fr = mu * m * G;
      return {
        m, F, fr, col: this.c(i ? 'car2' : 'car1'), dir: this.pair && i === 0 ? -1 : 1,
        x: 0, v: 0, a: 0, aP: this.pair ? F / m : Math.max(0, F - fr) / m, vP: null, tEnd: null, stopAt: null, done: false,
        pts: [[0, 0]], vpts: [[0, 0]], secs: [], land: -1, endPush: -1,
      };
    });
    this.nextSec = 1;
    this.lastPt = 0;
  }

  pushing(s, t) { const p = this.params; return this.pair ? t < SPRING.T : s.F > 0 && (!p.tP || t < p.tP); }

  step(dt) {
    const p = this.params, t = this.t;
    for (const s of this.state) {
      if (s.done) continue;
      const on = this.pushing(s, t - dt);
      // fermo, il carrello parte solo se la spinta vince la frenata del pavimento; in moto, il pavimento frena sempre
      let F = on ? s.F : 0;
      if (s.v > 1e-9) F -= s.fr; else F = Math.max(0, F - s.fr);
      s.a = F / s.m;
      const v0 = s.v;
      s.v = Math.max(0, s.v + s.a * dt);
      s.x += ((v0 + s.v) / 2) * dt;
      if (!on && s.endPush < 0 && t > 0.02) { s.endPush = this.clock; s.vP = v0; }
      if (s.x >= p.D) {
        s.x = p.D; s.done = true; s.tEnd = t; s.land = this.clock; s.pts.push([t, s.x]); s.vpts.push([t, s.v]);
        if (s.vP == null) s.vP = s.v;
      } else if (!on && s.v <= 1e-9 && t > 0.05) {
        s.done = true; s.stopAt = s.x; s.land = this.clock; s.pts.push([t, s.x]); s.vpts.push([t, 0]);
      }
    }
    if (t >= this.nextSec) { // un segno ogni secondo, sulla corsia: a velocità costante sono equidistanti
      for (const s of this.state) if (!s.done) s.secs.push([this.nextSec, s.x, s.v]);
      this.nextSec += 1;
    }
    if (t - this.lastPt > 0.05) {
      this.lastPt = t;
      for (const s of this.state) if (!s.done) { s.pts.push([t, s.x]); s.vpts.push([t, s.v]); }
    }
    if (this.state.every((s) => s.done) || t > p.tmax) {
      const st = this.state, r2 = (x) => Math.round(x * 100) / 100;
      this.finish({
        times: st.map((s) => s.tEnd), vEnd: st.map((s) => r2(s.v)), vP: st.map((s) => r2(s.vP ?? s.v)),
        a: st.map((s) => r2(s.aP)), x: st.map((s) => r2(s.x)), stop: st.map((s) => (s.stopAt == null ? null : r2(s.stopAt))),
      });
    }
  }

  // ---------- disegno ----------
  // il pavimento sotto una corsia: binario liscio (con i forellini dell'aria), ghiaccio (lucido), tappeto (a pelo)
  floorBand(x0, x1, y) {
    const g = this.ctx, f = this.pair ? 'liscio' : this.params.floor;
    g.save();
    if (f === 'tappeto') {
      g.fillStyle = 'rgba(255, 107, 107, .16)'; g.fillRect(x0, y, x1 - x0, 7);
      g.strokeStyle = 'rgba(255, 107, 107, .55)'; g.lineWidth = 1.2; g.beginPath();
      for (let x = x0 + 2; x < x1; x += 4) { g.moveTo(x, y + 7); g.lineTo(x + ((x * 7) % 3) - 1, y + 1.5); }
      g.stroke();
    } else if (f === 'ghiaccio') {
      g.fillStyle = 'rgba(124, 200, 255, .2)'; g.fillRect(x0, y, x1 - x0, 6);
      g.strokeStyle = 'rgba(238, 244, 255, .55)'; g.lineWidth = 1.2; g.beginPath();
      for (let x = x0 + 14; x < x1 - 10; x += 37) { g.moveTo(x, y + 4.5); g.lineTo(x + 9, y + 1.5); g.moveTo(x + 6, y + 5); g.lineTo(x + 10, y + 3.5); }
      g.stroke();
    } else {
      g.strokeStyle = this.c('muted'); g.lineWidth = 1;
      g.beginPath(); g.moveTo(x0, y + 5); g.lineTo(x1, y + 5); g.stroke();
      g.fillStyle = this.c('muted');
      for (let x = x0 + 6; x < x1; x += 12) { g.beginPath(); g.arc(x, y + 2.4, 0.9, 0, 7); g.fill(); }
    }
    g.restore();
    this.line([[x0, y], [x1, y]], { color: this.c('ink'), width: 2.2 });
  }

  // il carrello fra xa e xb (in pixel, in qualunque ordine): cassone, due ruote che girano, i blocchi della massa
  // (o il telo che li nasconde). y è la linea del binario.
  drawCart(xa, xb, y, s) {
    const g = this.ctx, x0 = Math.min(xa, xb), w = Math.abs(xb - xa), h = 11, rot = (s.dir * s.x) / 0.18;
    g.save();
    g.strokeStyle = s.col; g.lineWidth = 2.2; g.lineJoin = 'round'; g.lineCap = 'round';
    g.fillStyle = s.col; g.globalAlpha = 0.18; g.beginPath(); g.roundRect(x0, y - h - 5, w, h, 3); g.fill();
    g.globalAlpha = 1; g.beginPath(); g.roundRect(x0, y - h - 5, w, h, 3); g.stroke();
    for (const wx of [x0 + 8, x0 + w - 8]) {
      g.fillStyle = this.c('sim-bg'); g.beginPath(); g.arc(wx, y - 4, 4, 0, 7); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(wx + Math.cos(rot) * 3.4, y - 4 + Math.sin(rot) * 3.4); g.lineTo(wx - Math.cos(rot) * 3.4, y - 4 - Math.sin(rot) * 3.4); g.stroke();
    }
    g.restore();
    const top = y - h - 5;
    if (this.params.hide && s === this.state[0]) {
      // il telo di Vetrino: sotto ci sono i blocchi, ma non si vedono
      g.save(); g.strokeStyle = this.c('boss'); g.fillStyle = 'rgba(185, 164, 255, .2)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x0 + 1, top); g.quadraticCurveTo(x0 + 2, top - 20, x0 + w / 2, top - 21); g.quadraticCurveTo(x0 + w - 2, top - 20, x0 + w - 1, top); g.closePath(); g.fill(); g.stroke();
      g.restore();
      this.text('?', x0 + w / 2, top - 6, { size: 13, align: 'center', weight: 700, color: this.c('boss') });
      return top - 21;
    }
    // i blocchi: file da tre, uno sopra l'altro
    const n = Math.round(s.m), bs = 8.5, rows = Math.ceil(n / 3);
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3), col = i % 3, k = Math.min(3, n - row * 3);
      const bx = x0 + w / 2 - (k * (bs + 1.5)) / 2 + col * (bs + 1.5), by = top - (row + 1) * (bs + 1.5);
      g.save(); g.strokeStyle = this.c('sun'); g.fillStyle = 'rgba(255, 209, 102, .28)'; g.lineWidth = 1.5;
      g.beginPath(); g.roundRect(bx, by, bs, bs, 1.5); g.fill(); g.stroke(); g.restore();
    }
    return top - rows * (bs + 1.5);
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, st = this.state, t = this.t;
    this.clear();
    const graph = p.graph !== false;
    const trackH = graph ? Math.min(150, H * 0.46) : H - 24;
    const L = 22, R = W - 22, CW = 36;
    // i metri del binario: nel modo spinta la posizione è il centro del carrello, nel modo coppia la coda (al centro c'è la molla)
    const span = this.pair ? [-p.D, p.D] : [0, p.D], M = this.pair ? 12 + CW : CW / 2 + 2;
    const sx = (x) => L + M + ((R - L - 2 * M) * (x - span[0])) / (span[1] - span[0]);
    const goal = (d) => sx(d * p.D) + d * (this.pair ? 12 + CW : CW / 2); // dove arriva il muso alla fine del binario
    const lanes = this.pair ? 1 : st.length, laneH = (trackH - 22) / lanes;
    const laneY = (i) => (this.pair ? 0 : i) * laneH + laneH + 6; // la linea del binario della corsia i
    // binari
    for (let i = 0; i < lanes; i++) this.floorBand(L - 8, R + 8, laneY(i));
    // traguardi (tratteggio) e numeri dei metri
    g.save(); g.strokeStyle = this.c('ink'); g.lineWidth = 1.5; g.setLineDash([6, 4]);
    for (const d of this.pair ? [-1, 1] : [1]) { g.beginPath(); g.moveTo(goal(d), 8); g.lineTo(goal(d), trackH - 6); g.stroke(); }
    g.restore();
    const lab = (x, s) => this.text(s, x, trackH + 8, { size: 11, align: 'center', color: this.c('muted') });
    if (this.pair) { lab(goal(-1), `${p.D} m`); lab(sx(0), '0'); lab(goal(1), `${p.D} m`); } else { lab(sx(0) - CW / 2, '0'); lab(goal(1), `${p.D} m`); }
    // i carrelli. Nel modo spinta la posizione è il muso; nel modo coppia è la coda, quella che tocca la molla al centro.
    st.forEach((s, i) => {
      const y = laneY(i), dir = s.dir, P = sx(dir * s.x);
      const rear = this.pair ? P + dir * 12 : P - CW / 2, front = rear + dir * CW, mid = y - 10;
      // segni dei secondi, dove stava il centro del carrello
      s.secs.forEach(([, xs]) => { const m = sx(dir * xs) + (this.pair ? dir * (12 + CW / 2) : 0); this.line([[m, y + 10], [m, y + 15]], { color: s.col, width: 2, alpha: 0.65 }); });
      // linee di velocità dietro il carrello
      if (this.running && !s.done && s.v > 0.4) {
        const k = Math.min(1, s.v / 12);
        for (let j = 0; j < 3; j++) {
          const len = 8 + 22 * k, off = (this.clock * 90 + j * 13) % 18, bx = rear - dir * (6 + off);
          this.line([[bx, y - 20 + j * 5], [bx - dir * len, y - 20 + j * 5]], { color: s.col, width: 1.5, alpha: 0.45 });
        }
      }
      const top = this.drawCart(rear, front, y, s);
      // la forza: la freccia rossa che spinge da dietro, finché la spinta dura
      const on = this.running ? this.pushing(s, t) : !this.result;
      const fadeP = s.endPush >= 0 ? 1 - clamp01((this.clock - s.endPush) / 0.35) : 1;
      if (!this.pair && s.F > 0 && (on || fadeP > 0) && !s.done) {
        const len = Math.max(8, s.F * PXN), a = on ? (this.running ? 1 : 0.6) : fadeP;
        this.arrow(front + 3, mid, front + 3 + len, mid, { color: this.c('coral'), width: 3.2, head: 9, alpha: a });
        g.globalAlpha = a; this.text(`${fmt(s.F, 0)} N`, front + 3 + len / 2, mid - 7, { size: 10, align: 'center', color: this.c('coral'), mono: true }); g.globalAlpha = 1;
      }
      // nel modo coppia: sopra ogni carrello la forza della molla, uguale per tutti e due e verso fuori
      if (this.pair && (on || (this.result && this.age < 0.6))) {
        const len = s.F * PXN * 0.55, a = this.running ? 1 : this.result ? 1 - clamp01(this.age / 0.6) : 0.55, yA = top - 10;
        this.arrow(rear, yA, rear + dir * len, yA, { color: this.c('coral'), width: 3.2, head: 9, alpha: a });
        this.text(`${fmt(s.F, 0)} N`, rear + dir * len * 0.5, yA - 7, { size: 10, align: 'center', color: this.c('coral'), mono: true });
      }
      // la frenata del pavimento: una freccia più piccola in basso, all'indietro, finché il carrello si muove
      if (s.fr > 0 && s.v > 0.05 && !s.done) this.arrow(rear - dir * 2, y - 4, rear - dir * (2 + Math.max(7, s.fr * PXN)), y - 4, { color: this.c('coral'), width: 2.2, head: 6, alpha: 0.75 });
      if (s.land >= 0 && s.tEnd != null) this.burst(goal(dir), y - 10, this.clock - s.land, { color: s.col, n: 8, r: 22 });
      if (s.land >= 0 && s.stopAt != null) this.ripple((rear + front) / 2, y - 8, this.clock - s.land, { color: s.col, r1: 22 });
      // la velocità accanto al muso (o dietro, se davanti non c'è posto)
      if (s.done) {
        const room = dir > 0 ? R - front > 60 : front - L > 60, tx = room ? front + dir * 6 : rear - dir * 6;
        this.text(`${fmt(s.v, 1)} m/s`, tx, mid + 4, { size: 10, align: (dir > 0) === room ? 'left' : 'right', color: s.col });
      }
    });
    // la molla compressa fra le due code, prima e durante la spinta
    if (this.pair) {
      const u = this.running ? clamp01(t / SPRING.T) : this.result ? 1 : 0, y = laneY(0) - 10;
      const xa = sx(-st[0].x) - 12, xb = sx(st[1].x) + 12, n = 8, pts = [];
      for (let i = 0; i <= n; i++) pts.push([lerpN(xa, xb, i / n), y + (i && i < n ? (i % 2 ? -5 : 5) : 0)]);
      if (u < 1) this.line(pts, { color: this.c('ink'), width: 1.8, alpha: 1 - u * u });
    }
    if (!graph) return this.legend();
    // ---------- grafico velocità–tempo ----------
    const gx = 46, gy = trackH + 26, gw = W - gx - 20, gh = H - gy - 28;
    const tEst = Math.max(2, ...st.map((s) => (s.tEnd ?? (s.stopAt != null ? s.pts[s.pts.length - 1][0] : this.estimate(s)))));
    const tG = Math.max(4, Math.ceil(Math.min(p.tmax, tEst) / 2) * 2);
    const vTop = Math.max(4, Math.ceil(Math.max(...st.map((s) => this.vmax(s))) / 2) * 2);
    g.strokeStyle = this.c('line'); g.lineWidth = 1;
    g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx, gy + gh); g.lineTo(gx + gw, gy + gh); g.stroke();
    const ts = tG <= 8 ? 1 : tG <= 16 ? 2 : 5;
    for (let k = 0; k <= tG + 1e-9; k += ts) this.text(fmt(k, 0), gx + (gw * k) / tG, gy + gh + 13, { size: 10, align: 'center', color: this.c('muted') });
    const vs = vTop <= 8 ? 2 : vTop <= 20 ? 4 : 10;
    for (let v = 0; v <= vTop + 1e-9; v += vs) this.text(fmt(v, 0), gx - 6, gy + gh - (gh * v) / vTop + 3, { size: 10, align: 'right', color: this.c('muted') });
    this.text('tempo (s)', gx + gw, gy + gh - 6, { size: 11, align: 'right', color: this.c('muted') });
    this.text('velocità (m/s)', gx + 4, gy + 10, { size: 11, color: this.c('muted') });
    const GX = (T) => gx + (gw * Math.min(T, tG)) / tG, GY = (v) => gy + gh - (gh * Math.min(v, vTop)) / vTop;
    for (const s of st) {
      const pts = s.vpts.map(([T, v]) => [GX(T), GY(v)]);
      if (this.running && !s.done) pts.push([GX(t), GY(s.v)]);
      this.line(pts, { color: s.col, width: 3 });
      s.secs.forEach(([T, , v]) => this.ball(GX(T), GY(v), 2.6, { color: s.col, fill: 1, shine: false }));
      if (this.running && !s.done) { const [hx, hy] = pts[pts.length - 1]; this.ball(hx, hy, 5, { color: s.col, fill: 0.35, shine: false }); }
      // a esperimento finito: il triangolo della pendenza durante la spinta, cioè l'accelerazione
      const tPush = this.pair ? SPRING.T : p.tP || (s.tEnd ?? 0);
      if (this.result && s.aP > 0 && tPush >= 1 && !this.pair) {
        const u = easeInOut((this.age - 0.2) / 0.8);
        if (u > 0) {
          const t1 = Math.max(0, Math.min(tPush - 1, Math.floor(tPush / 2) - 0.5)), A = [GX(t1), GY(s.aP * t1)], B = [GX(t1 + 1), GY(s.aP * t1)], C = [GX(t1 + 1), GY(s.aP * (t1 + 1))];
          this.line([A, B, C], { color: this.c('chalk'), width: 1.6, upto: u, alpha: 0.8 });
          g.globalAlpha = easeOut((this.age - 0.9) / 0.4);
          this.text('1 s', (A[0] + B[0]) / 2, A[1] + 13, { size: 10, align: 'center', color: this.c('muted'), mono: true });
          this.text(`+${fmt(s.aP, s.aP % 1 ? 1 : 0)} m/s`, C[0] + 5, (B[1] + C[1]) / 2 + 4, { size: 10, color: s.col, mono: true });
          g.globalAlpha = 1;
        }
      }
    }
    this.legend(gy + gh);
  }

  // tempo e risultati in basso a destra, ognuno del colore del suo carrello, su un fondo che li stacca dal disegno
  legend(bottom = this.H - 8) {
    const g = this.ctx, p = this.params, st = this.state, W = this.W;
    const rows = [[i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), this.c('ink')]];
    if (this.result) st.forEach((s, i) => rows.push([`${i18n(p.names[i])}: ` + (s.stopAt != null ? i18n('si ferma a {d} m', { d: fmt(s.stopAt, 1) }) : s.tEnd != null ? `${fmt(s.tEnd, 1)} s` : i18n('non arriva')), s.col]));
    g.font = '700 13px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([r]) => g.measureText(r).width)) + 14, by = bottom - 20 - rows.length * 17;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(W - 20 - bw + 7, by, bw, rows.length * 17 + 4); g.restore();
    rows.forEach(([r, col], i) => this.text(r, W - 20, by + 14 + i * 17, { size: 13, align: 'right', weight: i ? 700 : 600, color: col }));
  }

  // quanto durerà, più o meno, e la velocità più alta: servono a scegliere la scala del grafico prima della fine
  estimate(s) {
    const p = this.params, D = p.D;
    if (this.pair) return SPRING.T + D / Math.max(0.3, SPRING.J / s.m);
    if (s.aP <= 0) return 4;
    const tp = p.tP || 1e9, xP = 0.5 * s.aP * tp * tp;
    if (xP >= D) return Math.sqrt((2 * D) / s.aP);
    const vP = s.aP * tp, dec = (FLOORS[p.floor] ?? 0) * G;
    if (dec <= 0) return tp + (D - xP) / vP;
    const stopD = (vP * vP) / (2 * dec);
    return stopD + xP <= D ? tp + vP / dec : tp + (vP - Math.sqrt(Math.max(0, vP * vP - 2 * dec * (D - xP)))) / dec;
  }
  vmax(s) {
    const p = this.params;
    if (this.pair) return SPRING.J / s.m;
    if (s.aP <= 0) return 1;
    const tp = p.tP || 1e9;
    return Math.min(s.aP * tp, Math.sqrt(2 * s.aP * p.D));
  }
}

const lerpN = (a, b, u) => a + (b - a) * u;
