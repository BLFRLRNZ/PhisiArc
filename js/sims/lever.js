// La leva e l'altalena a bilico (D05). Un'asse leggera appoggiata sul fulcro, con un carico per parte: bambini,
// un adulto, blocchi, un masso, o la scatola coperta di Bilancia. Finché ci sono i fermi l'asse sta dritta;
// con ▶ Lancia i fermi si tolgono e l'asse gira verso il lato dove peso × distanza dal fulcro è più grande
// (il momento della forza, M = F·b). Se i due prodotti sono uguali, l'asse resta in equilibrio.
// Due modi di mettere i carichi:
//   - normale: il fulcro è a metà dell'asse, i carichi alle distanze d1 (a sinistra) e d2 (a destra);
//   - ends: i carichi stanno ai due capi dell'asse lunga L e si sposta il fulcro (f = distanza dal capo sinistro).
// Risultato: { balanced, dir ('sinistra' | 'destra' | null: il lato che scende), net (kg·m, destra − sinistra),
//              K: [m1·d1, m2·d2] (kg·m), M: [momenti in N·m], lift (cm: di quanto sale il carico di sinistra) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const G = 9.8;
const RAD = Math.PI / 180;
const CAP = 30 * RAD;   // l'asse non gira mai più di così (c'è un fermo sotto il fulcro)
const HOLD = 0.3;       // i fermi scendono in questo tempo, poi l'asse è libera
// un numero con i decimali che servono (al massimo due): 40, 37,5, 18,75
const nice = (x) => fmt(x, Math.abs(x - Math.round(x)) < 1e-9 ? 0 : Math.abs(x * 10 - Math.round(x * 10)) < 1e-9 ? 1 : 2);

export class Lever extends Sim {
  static controls = {
    m1: { label: 'Peso a sinistra', min: 1, max: 80, step: 1, unit: 'kg' },
    d1: { label: 'Distanza dal fulcro, a sinistra', min: 0.25, max: 3, step: 0.25, unit: 'm' },
    m2: { label: 'Peso a destra', min: 1, max: 80, step: 1, unit: 'kg' },
    d2: { label: 'Distanza dal fulcro, a destra', min: 0.25, max: 3, step: 0.25, unit: 'm' },
    f: { label: 'Distanza del fulcro dal masso', min: 0.25, max: 3, step: 0.25, unit: 'm' },
  };

  // w1, w2: che cosa c'è sopra ('bimbo', 'adulto', 'blocchi', 'masso', 'scatola'); hide1: la scatola è coperta;
  // panel: il riquadro con peso × distanza; arms: le quote delle distanze; weights: le frecce dei pesi; flabel: «fulcro»;
  // say: le frasi dell'esito quando scende il lato sinistro o il destro (se no «scende Bea»)
  defaults() {
    return { m1: 20, d1: 2, m2: 40, d2: 1, f: 1, L: 6, ends: false, w1: 'bimbo', w2: 'bimbo', hide1: false,
      names: ['Bea', 'Leo'], say: null, panel: true, arms: true, weights: false, flabel: false, Hf: 0.7, lens: 's', tmax: 8 };
  }

  init() {
    const p = this.params;
    this.ext = p.ends ? 0.3 : 0.2;                 // l'asse sporge un po' oltre i carichi
    this.xf = p.ends ? p.f : p.L / 2;              // il fulcro, dal capo sinistro
    this.D = p.ends ? [p.f, p.L - p.f] : [p.d1, p.d2];
    this.K = [p.m1 * this.D[0], p.m2 * this.D[1]];
    const half = p.ends ? null : p.L / 2;
    // fin dove può girare: finché un capo dell'asse tocca terra
    const rL = (p.ends ? this.xf : half) + this.ext, rR = (p.ends ? p.L - this.xf : half) + this.ext;
    this.R = [rL, rR];
    this.maxL = Math.min(CAP, Math.asin(Math.min(1, p.Hf / rL)));
    this.maxR = Math.min(CAP, Math.asin(Math.min(1, p.Hf / rR)));
    this.phi = 0; this.w = 0; this.landed = -1; this.hitAt = null;
  }

  get net() { return this.K[1] - this.K[0]; }
  get balanced() { return Math.abs(this.net) < 1e-6; }

  step(dt) {
    const p = this.params;
    if (this.t > p.tmax) return this.end();
    if (this.t < HOLD) return;
    if (this.balanced) { if (this.t > HOLD + 1.3) this.end(); return; }
    const I = p.m1 * this.D[0] ** 2 + p.m2 * this.D[1] ** 2 + 6;
    this.w += ((G * Math.cos(this.phi) * this.net) / I - 0.6 * this.w) * dt;
    this.phi += this.w * dt;
    const hit = (side) => {
      if (this.landed < 0) { this.landed = this.t; this.hitAt = this.clock; this.side = side; }
      this.w = Math.abs(this.w) > 0.35 ? -0.2 * this.w : 0;
    };
    if (this.phi >= this.maxR) { this.phi = this.maxR; hit(1); }
    if (this.phi <= -this.maxL) { this.phi = -this.maxL; hit(-1); }
    if (this.landed >= 0 && this.t - this.landed > 0.9) this.end();
  }

  end() {
    if (!this.running) return;
    const bal = this.balanced, dir = bal ? null : this.net > 0 ? 'destra' : 'sinistra';
    const lift = dir === 'destra' ? Math.round(this.D[0] * Math.sin(Math.abs(this.phi)) * 100) : 0;
    this.finish({ balanced: bal, dir, net: Math.round(this.net * 100) / 100, K: [...this.K], M: this.K.map((x) => Math.round(x * G)), lift });
  }

  // ---------- disegno ----------
  draw() {
    const p = this.params, W = this.W, H = this.H, g = this.ctx;
    this.clear();
    const top = p.panel ? 60 : 30;
    const yG = H - 18;
    const k = Math.min((W - 30) / (p.L + 2 * this.ext), (yG - top - 22) / (p.Hf + 1.45));
    const span = (p.L + 2 * this.ext) * k, x0 = (W - span) / 2 + this.ext * k; // x0: dove sta il carico di sinistra in ends, o il capo «utile»
    const px = (p.ends ? x0 : W / 2) + (p.ends ? this.xf * k : 0), py = yG - p.Hf * k;
    this.k = k;
    const c = Math.cos(this.phi), s = Math.sin(this.phi), T = Math.max(5, 0.12 * k);
    const B = (u, v) => [px + u * k * c + v * k * s, py + u * k * s - v * k * c]; // dall'asse (metri: u lungo, v in su) allo schermo

    this.ground(yG, { x0: 8, x1: W - 8 });
    // i fermi sotto i capi: ci sono finché non si lancia, poi scendono e spariscono
    const fa = this.running || this.result ? 1 - clamp01(this.t / HOLD) : 1;
    if (fa > 0) for (const u of [-this.R[0] + 0.25, this.R[1] - 0.25]) {
      const [fx, fy] = B(u, 0), hh = yG - fy;
      g.save(); g.globalAlpha = fa; g.fillStyle = this.c('muted'); g.globalAlpha = fa * 0.35;
      g.fillRect(fx - 5, fy + (1 - fa) * hh, 10, hh * fa); g.globalAlpha = fa;
      g.strokeStyle = this.c('muted'); g.lineWidth = 1.4; g.strokeRect(fx - 5, fy + (1 - fa) * hh, 10, hh * fa); g.restore();
    }
    // il fulcro: un triangolo dal terreno al perno
    const fw = Math.max(9, 0.3 * k);
    g.save(); g.beginPath(); g.moveTo(px, py); g.lineTo(px - fw, yG); g.lineTo(px + fw, yG); g.closePath();
    g.fillStyle = this.c('muted'); g.globalAlpha = 0.22; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.lineJoin = 'round'; g.stroke(); g.restore();
    if (p.flabel) {
      const lab = i18n('fulcro');
      g.font = '500 10.5px Lexend, system-ui, sans-serif';
      const lw = g.measureText(lab).width + 8;
      g.save(); g.fillStyle = this.c('sim-bg'); g.fillRect(px - lw / 2, yG + 3, lw, 13); g.restore();
      this.text(lab, px, yG + 13, { size: 10.5, align: 'center', color: this.c('muted') });
    }

    // l'asse e i carichi, nel sistema dell'asse
    g.save(); g.translate(px, py); g.rotate(this.phi);
    const uL = -this.R[0] * k, uR = this.R[1] * k;
    g.fillStyle = this.c('sun'); g.globalAlpha = 0.3; g.fillRect(uL, -T, uR - uL, T);
    g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(uL, -T, uR - uL, T);
    // tacche ogni mezzo metro, contate dal fulcro (più lunghe a ogni metro)
    g.strokeStyle = this.c('chalk'); g.lineWidth = 1.2;
    for (let u = 0.5; u < Math.max(this.R[0], this.R[1]) - 0.05; u += 0.5) for (const sg of [-1, 1]) {
      if (u > this.R[sg < 0 ? 0 : 1] - 0.05) continue;
      const major = Math.abs(u - Math.round(u)) < 1e-6, x = sg * u * k;
      g.globalAlpha = major ? 0.8 : 0.45; g.beginPath(); g.moveTo(x, -T); g.lineTo(x, -T + (major ? T : T * 0.5)); g.stroke();
    }
    g.globalAlpha = 1;
    // il perno
    g.fillStyle = this.c('chalk'); g.beginPath(); g.arc(0, 0, 2.6, 0, 7); g.fill();
    const tops = [0, 1].map((i) => this.drawLoad(i, (i ? 1 : -1) * this.D[i] * k, -T, i ? -1 : 1));
    // le quote delle distanze, sotto l'asse
    if (p.arms) for (const i of [0, 1]) {
      const sg = i ? 1 : -1, x1 = sg * this.D[i] * k, y = 9, col = this.c(i ? 'car2' : 'car1');
      if (Math.abs(x1) < 8) continue;
      this.line([[sg * 3, y], [x1, y]], { color: col, width: 1.5, alpha: 0.85 });
      for (const [x, d] of [[sg * 3, sg], [x1, -sg]]) this.line([[x + d * 5, y - 3], [x, y], [x + d * 5, y + 3]], { color: col, width: 1.5, alpha: 0.85 });
      this.line([[x1, y - 6], [x1, y + 4]], { color: col, width: 1.2, alpha: 0.6 });
    }
    g.restore();
    // le scritte, diritte: i nomi sopra i carichi e le distanze sotto l'asse
    for (const i of [0, 1]) {
      const sg = i ? 1 : -1, u = sg * this.D[i], col = this.c(i ? 'car2' : 'car1');
      const [nx, ny] = B(u, (T + tops[i] + 6) / k);
      const hid = i === 0 && p.hide1;
      this.text(i18n(p.names[i]), nx, ny - 13, { size: 11.5, align: 'center', weight: 700, color: col });
      this.text(hid ? '? kg' : `${p['m' + (i + 1)]} kg`, nx, ny, { size: 11, align: 'center', color: this.c('chalk'), mono: true });
      if (p.arms && this.D[i] * k >= 8) {
        const [ax, ay] = B(u / 2, -(9 + 10) / k);
        this.text(`${nice(this.D[i])} m`, ax, ay + 4, { size: 10.5, align: 'center', color: col, mono: true });
      }
      if (p.weights && !hid) {
        const [wx, wy] = B(u, (T + tops[i] * 0.45) / k), len = Math.min(46, 8 + p['m' + (i + 1)] * 0.55);
        this.arrow(wx, wy, wx, wy + len, { color: this.c('sun'), width: 2.6, head: 7 });
      }
    }
    // la botta a terra, e il masso che si alza
    if (this.hitAt != null && this.clock - this.hitAt < 0.8) {
      const side = this.side, [hx] = B(side * (this.R[side > 0 ? 1 : 0] - 0.1), 0);
      this.burst(hx, yG - 2, this.clock - this.hitAt, { color: this.c('muted'), n: 8, r: 22, dur: 0.6 });
    }
    if (this.result && this.result.lift > 0 && p.ends) {
      const [lx, ly] = B(-this.D[0], (T + tops[0] + 22) / k);
      const lab = i18n('si alza di {n} cm', { n: this.result.lift });
      g.font = '700 11px Lexend, system-ui, sans-serif';
      const hw = g.measureText(lab).width / 2 + 6;
      this.text(lab, Math.max(hw, Math.min(W - hw, lx)), ly - 14, { size: 11, align: 'center', weight: 700, color: this.c('mint') });
    }
    if (p.panel) this.panel();
    this.outcome();
  }

  // un carico sull'asse, nel sistema dell'asse: x è il punto dove pesa, y il piano dell'asse, face dove guarda.
  // Restituisce quanto è alto (in pixel), per mettere il nome sopra.
  drawLoad(i, x, y, face) {
    const p = this.params, k = this.k, what = p['w' + (i + 1)], m = p['m' + (i + 1)], col = this.c(i ? 'car2' : 'car1');
    if (what === 'bimbo' || what === 'adulto') {
      const s = (k / 50) * (what === 'adulto' ? 1.32 : 1);
      // le braccia in alto per chi sta in alto quando l'asse si ferma
      const up = this.landed >= 0 && (i === 0 ? this.phi > 0.05 : this.phi < -0.05);
      this.kid(x, y, face, s, col, up);
      return 38 * s;
    }
    if (what === 'blocchi') {
      const g = this.ctx, BS = Math.max(8, 0.24 * k), n = Math.max(1, Math.round(m)), rows = Math.ceil(n / 3);
      for (let j = 0; j < n; j++) {
        const row = Math.floor(j / 3), cl = j % 3, kk = Math.min(3, n - row * 3);
        const bx = x - (kk * (BS + 1.5)) / 2 + cl * (BS + 1.5), by = y - (row + 1) * (BS + 1.5);
        g.save(); g.strokeStyle = this.c('sun'); g.fillStyle = 'rgba(255, 209, 102, .28)'; g.lineWidth = 1.5;
        g.beginPath(); g.roundRect(bx, by, BS, BS, 1.5); g.fill(); g.stroke(); g.restore();
      }
      return rows * (BS + 1.5);
    }
    if (what === 'masso') {
      const g = this.ctx, r = k * 0.42 * Math.cbrt(m / 100), cy = y - r * 0.92;
      const pts = [[-1, 0.15], [-0.85, -0.55], [-0.35, -0.95], [0.3, -0.92], [0.8, -0.6], [1, 0.05], [0.85, 0.75], [-0.75, 0.8]];
      g.save(); g.beginPath(); pts.forEach(([a, b], j) => (j ? g.lineTo : g.moveTo).call(g, x + a * r, cy + b * r)); g.closePath();
      g.fillStyle = this.c('muted'); g.globalAlpha = 0.4; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.lineJoin = 'round'; g.stroke();
      g.globalAlpha = 0.45; g.lineWidth = 1.3; g.beginPath(); g.moveTo(x - r * 0.3, cy - r * 0.5); g.lineTo(x - r * 0.05, cy - r * 0.1); g.lineTo(x + r * 0.3, cy); g.stroke(); g.restore();
      return r * 1.85;
    }
    // la scatola, coperta dal telo di Bilancia oppure scoperta
    const g = this.ctx, sz = Math.max(16, 0.55 * k), bx = x - sz / 2, by = y - sz;
    g.save(); g.strokeStyle = this.c('orange'); g.fillStyle = 'rgba(255, 155, 84, .18)'; g.lineWidth = 2;
    g.beginPath(); g.roundRect(bx, by, sz, sz, 2); g.fill(); g.stroke();
    g.globalAlpha = 0.5; g.lineWidth = 1.2; g.beginPath(); g.moveTo(bx, by + sz * 0.3); g.lineTo(bx + sz, by + sz * 0.3); g.stroke(); g.restore();
    if (i === 0 && p.hide1) {
      const b = this.c('boss'), e = 4;
      g.save(); g.beginPath();
      g.moveTo(bx - e, y); g.lineTo(bx - e + 1, by + 3); g.quadraticCurveTo(x, by - sz * 0.35, bx + sz + e - 1, by + 3); g.lineTo(bx + sz + e, y);
      g.lineTo(bx + sz * 0.75, y - 3); g.lineTo(x, y + 1); g.lineTo(bx + sz * 0.25, y - 3); g.closePath();
      g.fillStyle = b; g.globalAlpha = 0.35; g.fill(); g.globalAlpha = 1; g.strokeStyle = b; g.lineWidth = 2; g.lineJoin = 'round'; g.stroke(); g.restore();
      this.text('?', x, by + sz * 0.62, { size: Math.round(sz * 0.6), align: 'center', weight: 700, color: this.c('chalk') });
      return sz + sz * 0.18;
    }
    return sz;
  }

  // un bambino seduto sull'asse che si tiene alla maniglia; face: 1 guarda a destra, -1 a sinistra
  kid(x, y, face, s, col, up) {
    const f = face, hip = [x, y - 2 * s], sh = [x - 2 * f * s, y - 21 * s];
    const handle = x + 12 * f * s;
    this.line([[handle, y], [handle, y - 13 * s], [handle - 2.5 * f * s, y - 13 * s]], { color: this.c('muted'), width: 2.2 });
    this.line([hip, sh], { color: col, width: 2.6 });
    this.line([hip, [x + 9 * f * s, y - 3 * s], [x + 11 * f * s, y + 9 * s]], { color: col, width: 2.4 });
    if (up) {
      this.line([[sh[0], sh[1] + 2 * s], [x + 5 * f * s, y - 36 * s]], { color: col, width: 2.2 });
      this.line([[sh[0], sh[1] + 2 * s], [x - 8 * f * s, y - 35 * s]], { color: col, width: 2.2 });
    } else this.line([[sh[0], sh[1] + 2 * s], [x + 5 * f * s, y - 15 * s], [handle - 1.5 * f * s, y - 12.5 * s]], { color: col, width: 2.2 });
    this.ball(x - 3 * f * s, y - 29 * s, 6 * s, { color: col, fill: 0.25, width: 2.2, shine: false });
  }

  // il riquadro in alto: peso × distanza per i due lati (Studente e Curioso: forza in newton × braccio = momento)
  panel() {
    const g = this.ctx, p = this.params, E = p.lens === 'e';
    const title = E ? i18n('peso × distanza') : p.lens === 'c' ? i18n('peso × distanza dal fulcro') : i18n('momento = forza × braccio');
    const rows = [0, 1].map((i) => {
      const m = p['m' + (i + 1)], d = this.D[i], hid = i === 0 && p.hide1;
      const name = i18n(p.names[i]);
      if (E) return `${name}: ${hid ? '?' : m} kg × ${nice(d)} m = ${hid ? '?' : nice(m * d)}`;
      return `${name}: ${hid ? '?' : nice(Math.round(m * G * 10) / 10)} N × ${nice(d)} m = ${hid ? '?' : nice(Math.round(m * G * d))} N·m`;
    });
    g.font = '600 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(g.measureText(title).width * 0.9, ...rows.map((r) => g.measureText(r).width)) + 14, x = 8, y = 6;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(x - 2, y, bw, 50); g.restore();
    this.text(title, x + 4, y + 12, { size: 10.5, color: this.c('muted') });
    rows.forEach((r, i) => this.text(r, x + 4, y + 28 + i * 16, { size: 11.5, weight: 600, color: this.c(i ? 'car2' : 'car1') }));
    // il confronto, a esperimento finito
    if (this.result) {
      const r = this.result, sign = r.balanced ? '=' : r.dir === 'destra' ? '<' : '>';
      this.text(sign, x + bw + 6, y + 37, { size: 18, weight: 700, align: 'center', color: r.balanced ? this.c('mint') : this.c('chalk') });
    }
  }

  // in alto a destra: com'è andata
  outcome() {
    if (!this.result) return;
    const r = this.result, p = this.params;
    const side = r.dir === 'destra' ? 1 : 0;
    const txt = r.balanced ? i18n('in equilibrio!') : p.say ? i18n(p.say[side]) : i18n('scende {n}', { n: i18n(p.names[side]) });
    const col = r.balanced ? this.c('mint') : this.c(r.dir === 'destra' ? 'car2' : 'car1');
    const g = this.ctx;
    g.font = '700 12.5px Lexend, system-ui, sans-serif';
    const w = g.measureText(txt).width + 14, y = p.panel ? 68 : 8;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(this.W - 8 - w, y, w, 22); g.restore();
    this.text(txt, this.W - 15, y + 15, { size: 12.5, weight: 700, align: 'right', color: col });
  }
}
