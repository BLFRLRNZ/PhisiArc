// L'effetto Doppler (O04). Tre modi:
//   - 'sirena': un'ambulanza con la sirena a 700 Hz passa davanti a chi ascolta, a velocità vs. I fronti d'onda partono
//     dall'ambulanza: davanti si stringono, dietro si allargano. Chi ascolta sente f0·v/(v − vs) mentre arriva e
//     f0·v/(v + vs) mentre se ne va; sotto, la nota sentita nel tempo. Al lancio si sente la sirena che passa.
//   - 'aereo': un aereo a metà della velocità del suono, alla velocità del suono, o a Mach 1,5. Sopra la velocità del
//     suono i fronti formano un cono, e a terra arriva il bang supersonico dopo che l'aereo è passato.
//   - 'nebbia': due ambulanze nascoste dalla nebbia (A: sirena 798 Hz a 17,15 m/s; B: 990 Hz a 34,3 m/s). Si sente solo la
//     nota: dalle frequenze prima e dopo il passaggio si ricava la velocità, vs = v·(f1 − f2)/(f1 + f2).
// Risultato: sirena { vs, f1, f2 }; aereo { mach, M, bang, t }; nebbia { amb, f1, f2, vs }
import { t as i18n } from '../i18n.js';
import { note, boom } from '../audio.js';
import { Sim, fmt } from './base.js';

const V = 343, F0 = 700, TE = 0.12, DUR = 4, T_PASS = 2;
const MACH = { lento: 0.5, suono: 1, veloce: 1.5 };
const AMB = { a: { f0: 798, vs: 17.15 }, b: { f0: 990, vs: 34.3 } };
export const fApproach = (f0, vs) => (f0 * V) / (V - vs);
export const fRecede = (f0, vs) => (f0 * V) / (V + vs);
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };

export class Doppler extends Sim {
  static tall = true;
  static controls = {
    vs: { label: 'Velocità dell’ambulanza', min: 0, max: 60, step: 10, unit: 'm/s' },
    mach: { label: 'Velocità dell’aereo', type: 'select', options: [['lento', 'metà del suono'], ['suono', 'come il suono'], ['veloce', 'più del suono']] },
    amb: { label: 'Quale ambulanza', type: 'select', options: [['a', 'ambulanza A'], ['b', 'ambulanza B']] },
  };

  defaults() { return { mode: 'sirena', vs: 30, mach: 'lento', amb: 'a', lens: 's' }; }

  init() {
    if (this.snd) this.snd.stop();
    this.snd = null;
    this.ev = {};
    if (this.params.mode === 'aereo') this.tArr = this.arrival();
  }

  get live() { return this.running || !!this.result; }
  get tt() { return this.live ? (this.result ? DUR : this.t) : 0; }

  // la sorgente: frequenza, velocità (m/s) e distanza dalla strada (m) di chi ascolta
  get src() { const p = this.params; return p.mode === 'nebbia' ? { f0: AMB[p.amb].f0, vs: AMB[p.amb].vs, d: 5 } : { f0: F0, vs: p.vs, d: 8 }; }
  // la nota sentita al tempo t: la sorgente passa davanti a chi ascolta a T_PASS secondi
  heard(t) {
    const { f0, vs, d } = this.src;
    if (!vs) return f0;
    const dx = -vs * (t - T_PASS), cos = dx / Math.hypot(dx, d);
    return f0 / (1 - (vs / V) * cos);
  }

  // l'aereo: quando arriva a terra il primo suono (per Mach ≥ 1, il bang)
  get planeGeom() {
    const W = this.W, H = this.H, M = MACH[this.params.mach], vpx = 100, u = M * vpx, xL = W * 0.62, yp = H * 0.22, yg = H * 0.74;
    return { M, vpx, u, xL, yp, yg, xp: (t) => xL + (t - 1.8) * u };
  }
  arrival() {
    const { vpx, xL, yp, yg, xp } = this.planeGeom;
    let best = 99;
    for (let te = 0; te <= DUR; te += 0.005) best = Math.min(best, te + Math.hypot(xL - xp(te), yg - yp) / vpx);
    return best;
  }

  step() {
    const p = this.params, t = this.t, once = (k) => (this.ev[k] ? false : (this.ev[k] = true));
    if ((p.mode === 'sirena' || p.mode === 'nebbia') && once('sirena')) {
      // la sirena che passa: la nota scende e il volume cresce fino al passaggio, poi cala
      const path = [], vols = [], { vs } = this.src;
      for (let k = 0; k <= 40; k++) { const tk = (k / 40) * (DUR - 0.2); path.push([tk, this.heard(tk)]); vols.push([tk, 0.11 * (0.2 + 0.8 * Math.exp(-((((tk - T_PASS) * Math.max(vs, 8)) / 40) ** 2)))]); }
      this.snd = note(this.heard(0), { dur: DUR - 0.1, path, vols });
    }
    if (p.mode === 'aereo') {
      const M = MACH[p.mach];
      if (M < 1 && once('rombo')) {
        const g = this.planeGeom, path = [], vols = [];
        for (let k = 0; k <= 40; k++) { const tk = (k / 40) * (DUR - 0.2), dx = g.xL - g.xp(tk), cos = dx / Math.hypot(dx, g.yg - g.yp); path.push([tk, 150 / (1 - M * cos)]); vols.push([tk, 0.09 * (0.25 + 0.75 * Math.exp(-((dx / 120) ** 2)))]); }
        this.snd = note(150 / (1 - M), { type: 'triangle', dur: DUR - 0.1, path, vols });
      } else if (M >= 1 && t >= this.tArr && once('bang')) boom({ vol: 0.55, dur: 1.4, cut: 420 });
    }
    if (t >= DUR) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'aereo') { const M = MACH[p.mach]; return this.finish({ mach: p.mach, M, bang: M >= 1, t: this.tArr }); }
    const { f0, vs } = this.src;
    const r = { vs, f1: fApproach(f0, vs), f2: fRecede(f0, vs) };
    if (p.mode === 'nebbia') r.amb = p.amb;
    this.finish(r);
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'aereo') this.drawPlane();
    else this.drawRoad(m === 'nebbia');
  }

  person(x, gy, col = 'chalk') {
    this.ball(x, gy - 40, 6, { color: this.c(col), fill: 0.2, width: 2, shine: false });
    this.line([[x, gy - 34], [x, gy - 16]], { color: this.c(col), width: 2.4 });
    this.line([[x - 8, gy - 28], [x, gy - 24], [x + 8, gy - 28]], { color: this.c(col), width: 2.2 });
    this.line([[x - 6, gy], [x, gy - 16], [x + 6, gy]], { color: this.c(col), width: 2.4 });
  }

  hears(x, y, a = 1) {
    const g = this.ctx;
    g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2; g.globalAlpha = a;
    for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(x, y, 5 + i * 5, -0.6, 0.6); g.stroke(); }
    g.restore();
  }

  // i fronti d'onda: un cerchio ogni TE secondi, centrato dove era la sorgente quando l'ha mandato
  fronts(cx, cy, vpx, maxR, col = 'sun') {
    const g = this.ctx, t = this.tt;
    g.save(); g.strokeStyle = this.c(col); g.lineWidth = 1.6;
    for (let k = 0; k * TE <= t; k++) {
      const te = k * TE, r = vpx * (t - te);
      if (r > maxR || r < 0.5) continue;
      g.globalAlpha = 0.75 * (1 - r / maxR);
      g.beginPath(); g.arc(cx(te), cy, r, 0, 2 * Math.PI); g.stroke();
    }
    g.restore();
  }

  // il grafico della nota sentita nel tempo
  pitchGraph(y0, y1, E, fog) {
    const p = this.params, W = this.W, { f0, vs } = this.src, x0 = 30, x1 = W - 16;
    const lo = fRecede(f0, 60) * 0.96, hi = fApproach(f0, 60) * 1.05, Y = (f) => y1 - ((f - lo) / (hi - lo)) * (y1 - y0), X = (t) => x0 + ((x1 - x0) * t) / DUR;
    this.line([[x0, y1], [x1, y1]], { color: this.c('edge'), width: 1.2 });
    this.line([[x0, y0], [x0, y1]], { color: this.c('edge'), width: 1.2 });
    if (!fog) {
      this.line([[x0, Y(f0)], [x1, Y(f0)]], { color: this.c('muted'), width: 1, dash: [3, 4] });
      this.text(E ? i18n('la nota della sirena') : `${f0} Hz`, x1, Y(f0) - 4, { size: 10, align: 'right', color: this.c('muted') });
    }
    this.text(E ? i18n('quanto è acuta la nota che senti') : i18n('frequenza sentita'), x0 + 6, y0 - 8, { size: 10.5, color: this.c('muted') });
    this.text(i18n('tempo →'), x1, y1 + 14, { size: 10, align: 'right', color: this.c('muted') });
    if (!this.live) return;
    const pts = [];
    for (let k = 0; k <= 160; k++) { const t = (k / 160) * this.tt; pts.push([X(t), Y(this.heard(t))]); }
    this.line(pts, { color: this.c('sky'), width: 2.2 });
    if (this.result && vs > 0) {
      const f1 = fApproach(f0, vs), f2 = fRecede(f0, vs);
      this.text(E ? i18n('più acuta') : `${Math.round(f1)} Hz`, X(0.5), Y(f1) - 6, { size: 11, weight: 700, color: this.c('sun') });
      this.text(E ? i18n('più grave') : `${Math.round(f2)} Hz`, X(3.1), Y(f2) + 15, { size: 11, weight: 700, color: this.c('sky') });
      if (fog) this.arrow(X(T_PASS) + 10, Y(f1), X(T_PASS) + 10, Y(f2), { color: this.c('coral'), width: 2, head: 6 });
    }
  }

  // ---------- l'ambulanza sulla strada (o nella nebbia) ----------
  drawRoad(fog) {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', { f0, vs } = this.src;
    const yr = H * 0.3, xL = W * 0.5, yL = yr + 62, u = vs > 0 ? (W * 0.6) / DUR : 0, vpx = vs > 0 ? (u * V) / vs : 150;
    const xa = (t) => (vs > 0 ? xL + (t - T_PASS) * u : xL - W * 0.26), t = this.tt;
    // la strada
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.25; g.fillRect(0, yr - 16, W, 32); g.restore();
    this.line([[0, yr], [W, yr]], { color: this.c('chalk'), width: 1.4, dash: [10, 10], alpha: 0.5 });
    if (!fog) {
      if (this.live) this.fronts(xa, yr, vpx, W * 1.1);
      // l'ambulanza: bianca, con la croce e la luce blu
      const x = xa(t);
      g.save(); g.fillStyle = '#f4f6fb'; g.fillRect(x - 22, yr - 13, 44, 22); g.fillStyle = this.c('coral');
      g.fillRect(x - 3, yr - 10, 6, 16); g.fillRect(x - 8, yr - 5, 16, 6);
      g.fillStyle = this.c('sky'); g.globalAlpha = this.running && Math.sin(this.clock * 18) > 0 ? 1 : 0.4; g.fillRect(x - 5, yr - 19, 10, 6); g.restore();
      this.ball(x - 12, yr + 11, 4, { color: this.c('ink'), fill: 1, width: 1, shine: false });
      this.ball(x + 12, yr + 11, 4, { color: this.c('ink'), fill: 1, width: 1, shine: false });
    } else {
      // la nebbia copre la strada: si sente, ma non si vede
      g.save(); g.fillStyle = 'rgba(160,170,190,0.9)'; g.fillRect(0, yr - 44, W, 88); g.restore();
      this.text('?', W * 0.3, yr + 12, { size: 34, align: 'center', weight: 700, color: this.c('sim-bg') });
      this.text('?', W * 0.72, yr + 12, { size: 34, align: 'center', weight: 700, color: this.c('sim-bg') });
    }
    this.person(xL, yL + 30);
    const ft = this.heard(t);
    if (this.running && (vs > 0 || !fog)) {
      this.hears(xL + 8, yL - 10, 0.8);
      const lab = E ? (ft > f0 + 1 ? i18n('più acuta') : ft < f0 - 1 ? i18n('più grave') : i18n('uguale')) : `${Math.round(ft)} Hz`;
      this.text(lab, xL + 30, yL - 4, { size: 12, weight: 700, color: this.c(ft > f0 + 1 ? 'sun' : ft < f0 - 1 ? 'sky' : 'chalk') });
    }
    this.pitchGraph(yL + 58, H - 28, E, fog);
    const rows = [];
    if (fog) rows.push([E ? i18n('Ambulanza {a}: la senti, ma non la vedi', { a: p.amb.toUpperCase() }) : i18n('ambulanza {a}, nascosta nella nebbia', { a: p.amb.toUpperCase() }), this.c('chalk'), 700]);
    else rows.push([E ? (vs ? i18n('Ambulanza a {v} metri al secondo', { v: vs }) : i18n('Ambulanza ferma')) : i18n('sirena {f} Hz; vₛ = {v} m/s', { f: f0, v: vs }), this.c('chalk'), 700]);
    if (this.result) {
      if (!vs) rows.push([E ? i18n('ferma: la nota resta uguale') : i18n('sorgente ferma: {f} Hz per tutti', { f: f0 }), this.c('mint'), 700]);
      else if (E) rows.push([fog ? (p.amb === 'b' ? i18n('la nota fa un salto grande') : i18n('la nota fa un salto piccolo')) : i18n('mentre arriva: più acuta; mentre se ne va: più grave'), this.c('mint'), 700]);
      else rows.push([i18n('arriva: {a} Hz; se ne va: {b} Hz', { a: Math.round(fApproach(f0, vs)), b: Math.round(fRecede(f0, vs)) }), this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- l'aereo e il bang supersonico ----------
  drawPlane() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const { M, vpx, xL, yp, yg, xp } = this.planeGeom, t = this.tt, x = xp(t);
    this.ground(yg, { x0: 0, x1: W });
    if (this.live) this.fronts(xp, yp, vpx, W * 1.2, 'sky');
    // il cono di Mach (o il muro del suono)
    if (this.live && M > 1) {
      const mu = Math.asin(1 / M), Lc = W * 1.4;
      this.line([[x, yp], [x - Lc * Math.cos(mu), yp - Lc * Math.sin(mu)]], { color: this.c('sun'), width: 2.4 });
      this.line([[x, yp], [x - Lc * Math.cos(mu), yp + Lc * Math.sin(mu)]], { color: this.c('sun'), width: 2.4 });
    } else if (this.live && M === 1) this.line([[x + 2, yp - 60], [x + 2, yp + 60]], { color: this.c('sun'), width: 2.4 });
    // l'aereo: fusoliera, ala, coda
    g.save(); g.fillStyle = this.c('chalk');
    g.beginPath(); g.moveTo(x + 18, yp); g.lineTo(x - 18, yp - 4); g.lineTo(x - 18, yp + 4); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x + 2, yp); g.lineTo(x - 8, yp + 12); g.lineTo(x - 12, yp + 12); g.lineTo(x - 6, yp); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x - 14, yp); g.lineTo(x - 20, yp - 10); g.lineTo(x - 22, yp - 10); g.lineTo(x - 19, yp); g.closePath(); g.fill(); g.restore();
    // chi ascolta, a terra
    this.person(xL, yg);
    const heard = this.live && t >= this.tArr;
    if (M >= 1 && heard) {
      this.hears(xL + 8, yg - 40, Math.max(0.3, 1 - (t - this.tArr) / 1.5));
      this.text('BANG!', xL + 18, yg - 52, { size: 15, weight: 700, color: this.c('coral') });
    } else if (M < 1 && heard) this.hears(xL + 8, yg - 40, 0.7);
    const lab = { lento: E ? i18n('L’aereo va a metà della velocità del suono') : i18n('Mach 0,5: vₛ = 171,5 m/s'), suono: E ? i18n('L’aereo va veloce come il suono') : i18n('Mach 1: vₛ = 343 m/s'), veloce: E ? i18n('L’aereo va più veloce del suono') : i18n('Mach 1,5: vₛ = 514,5 m/s') }[p.mach];
    const rows = [[lab, this.c('chalk'), 700]];
    if (this.result) {
      const res = {
        lento: E ? i18n('lo senti arrivare: il suono gli corre davanti') : i18n('il suono precede l’aereo'),
        suono: E ? i18n('le onde si ammucchiano sul muso: il muro del suono') : i18n('i fronti si accumulano sul muso: il muro del suono'),
        veloce: E ? i18n('BANG! Lo senti solo dopo che è passato') : i18n('cono di Mach: il bang arriva dopo il passaggio'),
      }[p.mach];
      rows.push([res, this.c(M > 1 ? 'coral' : 'mint'), 700]);
    }
    this.box(rows);
  }

  box(rows) {
    if (!rows.length) return;
    const g = this.ctx;
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }
}
