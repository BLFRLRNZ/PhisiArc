// I fluidi fermi (FL01). Quattro modi, tutti con l'acqua che spinge di più dove è più profonda:
//   - 'mare': un sub scende fino a h metri; la pressione dell'acqua cresce con la profondità, P = ρ·g·h
//     (ogni 10 m d'acqua, circa 1 kg su ogni cm²) e spinge da tutte le parti. Con air: true conta anche l'aria sopra.
//   - 'bottiglia': una bottiglia piena fino a h cm (un rubinetto tiene il livello) con tre buchi; più il buco è in basso,
//     più forte esce lo spruzzo (v = √(2·g·d)). La bottiglia sta su una cassa alta: lo spruzzo più forte arriva più
//     lontano. Larga o stretta, gli spruzzi sono gli stessi: conta solo la profondità.
//   - 'barometro': il tubo di Torricelli, pieno di mercurio (o d'acqua) e rovesciato in una vasca: l'aria spinge sulla
//     vasca e regge una colonna alta P/(ρ·g), 76 cm di mercurio o più di 10 m d'acqua; in montagna l'aria sopra è meno.
//   - 'diga': una diga regge un lago profondo h metri e lungo 100 m, 1 km o 10 km. La spinta sulla diga dipende solo dalla
//     profondità, non da quanto è lungo il lago.
// Risultato: mare { h, P (Pa, solo l'acqua), Pt (con l'aria), kg (kg su ogni cm²) };
//            bottiglia { h (cm), wide, reach [alto, mezzo, basso] (cm), v [m/s] };
//            barometro { liq, alt, col (m), P (Pa) }; diga { h, lake, L (km), P (Pa), F (N su ogni metro di diga) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut, easeInOut } from './base.js';

const G = 9.81, P0 = 101325, RHO = { acqua: 1000, mercurio: 13600 };
// la pressione dell'aria a una certa quota (atmosfera a temperatura costante: dimezza ogni 5,8 km circa)
export const pAir = (alt) => P0 * Math.exp(-alt / 8400);
export const LAKES = { piccolo: { L: 0.1, name: 'Laghetto: 100 m' }, medio: { L: 1, name: 'Lago: 1 km' }, grande: { L: 10, name: 'Lago lunghissimo: 10 km' } };
const HOLES = [0.26, 0.16, 0.06]; // altezza dei buchi dal fondo della bottiglia (m): alto, in mezzo, in basso
const BOTTLE = 0.42, STAND = 1.0;
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);

export class Hydro extends Sim {
  static tall = true;
  static controls = {
    h: { label: 'Profondità', min: 0, max: 40, step: 1, unit: 'm' },
    hb: { label: 'Acqua nella bottiglia', min: 10, max: 40, step: 2, unit: 'cm' },
    wide: { label: 'Bottiglia larga', type: 'toggle' },
    liq: { label: 'Liquido nel tubo', type: 'select', options: [['mercurio', 'Mercurio'], ['acqua', 'Acqua']] },
    alt: { label: 'Altitudine', min: 0, max: 8800, step: 200, unit: 'm' },
    hd: { label: 'Profondità del lago', min: 10, max: 100, step: 10, unit: 'm' },
    lake: { label: 'Lunghezza del lago', type: 'select', options: Object.entries(LAKES).map(([k, l]) => [k, l.name]) },
  };

  defaults() { return { mode: 'mare', h: 10, air: false, hb: 36, wide: false, liq: 'mercurio', alt: 0, hd: 50, lake: 'medio', lens: 's' }; }

  init() { this.u = 0; }

  step() {
    const p = this.params, t = this.t;
    if (p.mode === 'mare') { const T = 0.8 + (p.h / 40) * 2; this.u = easeInOut(clamp01(t / T)); if (t > T + 0.6) this.end(); return; }
    if (p.mode === 'bottiglia') { this.u = clamp01(t / 0.9); if (t > 2.2) this.end(); return; }
    this.u = clamp01(t / 1.8);
    if (t > 2.3) this.end();
  }

  // ---------- la fisica di ogni modo ----------
  pWater(h) { return RHO.acqua * G * h; }
  jets() {
    const p = this.params, h = p.hb / 100;
    return HOLES.map((y) => {
      const d = h - y;
      if (d <= 0.004) return null;
      const v = Math.sqrt(2 * G * d), tf = Math.sqrt((2 * (STAND + y)) / G);
      return { y, d, v, x: v * tf, tf };
    });
  }
  column() { const p = this.params; return pAir(p.alt) / (RHO[p.liq] * G); }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'mare') return this.finish({ h: p.h, P: this.pWater(p.h), Pt: this.pWater(p.h) + P0, kg: this.pWater(p.h) / (G * 1e4) });
    if (p.mode === 'bottiglia') {
      const J = this.jets();
      return this.finish({ h: p.hb, wide: !!p.wide, reach: J.map((j) => (j ? Math.round(j.x * 100) : 0)), v: J.map((j) => (j ? j.v : 0)) });
    }
    if (p.mode === 'barometro') return this.finish({ liq: p.liq, alt: p.alt, col: this.column(), P: pAir(p.alt) });
    const P = this.pWater(p.hd);
    this.finish({ h: p.hd, lake: p.lake, L: LAKES[p.lake].L, P, F: 0.5 * RHO.acqua * G * p.hd * p.hd });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'bottiglia') this.drawBottle();
    else if (m === 'barometro') this.drawBarometer();
    else if (m === 'diga') this.drawDam();
    else this.drawSea();
  }

  // ---------- il mare, con il sub ----------
  drawSea() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const y0 = 72, yF = H - 26, yOf = (d) => y0 + ((yF - y0 - 12) * d) / 40;
    const live = this.running || !!this.result, dep = this.result ? p.h : live ? p.h * this.u : 0;
    // l'acqua, più scura in fondo
    const gr = g.createLinearGradient(0, y0, 0, yF);
    gr.addColorStop(0, 'rgba(124,200,255,0.20)'); gr.addColorStop(1, 'rgba(124,200,255,0.04)');
    g.save(); g.fillStyle = gr; g.fillRect(0, y0, W, yF - y0); g.restore();
    const wave = [];
    for (let x = 0; x <= W; x += 8) wave.push([x, y0 + Math.sin(x / 18 + this.clock * 1.5) * 1.6]);
    this.line(wave, { color: this.c('sky'), width: 2 });
    // il fondo di sabbia, con le alghe
    g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.12; g.fillRect(0, yF, W, H - yF); g.restore();
    this.line([[0, yF], [W, yF]], { color: this.c('sun'), width: 2 });
    for (const ax of [W * 0.12, W * 0.7, W * 0.78]) {
      const sw = Math.sin(this.clock * 1.2 + ax) * 3;
      this.line([[ax, yF], [ax + sw, yF - 14], [ax - sw, yF - 28]], { color: this.c('mint'), width: 2, alpha: 0.7 });
    }
    // la scala delle profondità, a destra
    for (let d = 0; d <= 40; d += 10) {
      const y = yOf(d);
      this.line([[W - 12, y], [W - 4, y]], { color: this.c('muted'), width: 1.4 });
      this.text(`${d} m`, W - 15, y + 3.5, { size: 9.5, align: 'right', color: this.c('muted'), mono: true });
    }
    // dove arrivare (prima della prova)
    if (!live) {
      this.line([[W * 0.2, yOf(p.h)], [W - 40, yOf(p.h)]], { color: this.c('muted'), width: 1.2, dash: [4, 5] });
    }
    // le frecce della pressione: da tutte le parti, lunghe come la spinta
    const xD = W * 0.44, yD = yOf(dep) + (dep < 0.3 ? 6 : 0), P = this.pWater(dep), k = P / this.pWater(40);
    if (dep > 0.3) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8, R = 30, len = 4 + 18 * k;
      this.arrow(xD + Math.cos(a) * (R + len), yD + Math.sin(a) * (R + len), xD + Math.cos(a) * R, yD + Math.sin(a) * R, { color: this.c('sky'), width: 2, head: 6 });
    }
    this.diver(xD, yD, this.running);
    // il riquadro
    const rows = [[i18n('Profondità: {h} m', { h: fmt(Math.round(dep), 0) }), this.c('chalk'), 700]];
    if (E) rows.push([i18n('l’acqua spinge {k} kg su ogni quadretto', { k: one(P / (G * 1e4)) }), this.c('sky'), 700]);
    else {
      rows.push([i18n('P = ρ·g·h = {P} kPa', { P: fmt(P / 1000, 0) }), this.c('sky'), 700]);
      if (p.air) rows.push([i18n('con l’aria sopra: {P} kPa', { P: fmt((P + P0) / 1000, 0) }), this.c('muted'), 600]);
    }
    this.box(rows);
  }

  // il sub: (x, y) = il petto; con le pinne e le bolle
  diver(x, y, moving) {
    const g = this.ctx, col = this.c('chalk'), k = moving ? Math.sin(this.clock * 8) * 3 : Math.sin(this.clock * 2) * 1;
    g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.35; g.beginPath(); g.roundRect(x - 9, y - 13, 6, 18, 2); g.fill();
    g.globalAlpha = 1; g.strokeStyle = this.c('sun'); g.lineWidth = 1.6; g.stroke(); g.restore();
    this.line([[x, y - 12], [x, y + 9]], { color: col, width: 2.6 });
    this.line([[x - 1, y - 7], [x + 10, y - 1 + k * 0.4]], { color: col, width: 2.2 });
    this.line([[x - 1, y - 7], [x - 8, y + 2 - k * 0.4]], { color: col, width: 2.2 });
    const fl = [x - 4 + k * 0.3, y + 25], fr = [x + 4 - k * 0.3, y + 25];
    this.line([fl, [x, y + 9], fr], { color: col, width: 2.4 });
    for (const [fx, fy] of [fl, fr]) this.line([[fx, fy], [fx - 5, fy + 8], [fx + 4, fy + 7], [fx, fy]], { color: this.c('mint'), width: 1.8 });
    this.ball(x, y - 19, 6, { color: col, fill: 0.2, width: 2, shine: false });
    g.save(); g.strokeStyle = this.c('sky'); g.lineWidth = 1.6; g.strokeRect(x + 1, y - 23, 6, 5); g.restore();
    // le bolle che salgono
    for (let i = 0; i < 3; i++) {
      const ph = (this.clock * 0.6 + i / 3) % 1;
      this.ball(x + 6 + Math.sin(ph * 9 + i) * 2, y - 26 - ph * 40, 1.6 + ph * 1.2, { color: this.c('sky'), fill: 0.1, width: 1.2, alpha: 1 - ph, shine: false });
    }
  }

  // ---------- la bottiglia bucata ----------
  drawBottle() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    const live = this.running || !!this.result;
    const yFl = H - 34, k = Math.min((yFl - 60) / (STAND + BOTTLE), (W - 96) / 1.25);
    const bw = (p.wide ? 0.22 : 0.11) * k, xL = 30, xR = xL + bw, yBot = yFl - STAND * k, yTop = yBot - BOTTLE * k;
    const yW = yBot - (p.hb / 100) * k;
    // il pavimento e la cassa
    this.ground(yFl);
    g.save(); g.strokeStyle = this.c('orange'); g.globalAlpha = 0.7; g.lineWidth = 1.8;
    const cx0 = xL - 8, cx1 = xR + 8; g.strokeRect(cx0, yBot, cx1 - cx0, yFl - yBot);
    g.beginPath(); g.moveTo(cx0, yBot); g.lineTo(cx1, yFl); g.moveTo(cx1, yBot); g.lineTo(cx0, yFl); g.stroke(); g.restore();
    // la bottiglia, con l'acqua
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.25; g.fillRect(xL, yW, bw, yBot - yW); g.restore();
    this.line([[xL + bw * 0.3, yTop - 14], [xL + bw * 0.3, yTop], [xL, yTop + 8], [xL, yBot], [xR, yBot], [xR, yTop + 8], [xL + bw * 0.7, yTop], [xL + bw * 0.7, yTop - 14]], { color: this.c('chalk'), width: 2 });
    this.line([[xL, yW], [xR, yW]], { color: this.c('sky'), width: 2 });
    // il rubinetto che tiene il livello
    const fx = xL + bw / 2;
    this.line([[fx - 18, yTop - 30], [fx, yTop - 30], [fx, yTop - 22]], { color: this.c('muted'), width: 3 });
    const dph = (this.clock * 1.8) % 1;
    this.ball(fx, yTop - 20 + dph * (yW - yTop + 18), 1.8, { color: this.c('sky'), fill: 0.6, width: 1, shine: false, alpha: 1 - dph * 0.4 });
    // i buchi e gli spruzzi
    const J = this.jets(), grow = this.result ? 1 : live ? easeOut(this.u) : 0;
    J.forEach((j, i) => {
      const yh = yBot - HOLES[i] * k;
      this.ball(xR, yh, 2.4, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
      if (!j || grow <= 0) return;
      const pts = [], T = j.tf * grow;
      for (let n = 0; n <= 24; n++) { const t = (T * n) / 24; pts.push([xR + j.v * t * k, yh + 0.5 * G * t * t * k]); }
      this.line(pts, { color: this.c('sky'), width: 2.2, alpha: 0.85 });
      // le gocce che scorrono lungo lo spruzzo
      if (grow >= 1) for (let q = 0; q < 3; q++) {
        const ph = ((this.clock * 1.4 + q / 3 + i * 0.17) % 1) * j.tf;
        this.ball(xR + j.v * ph * k, yh + 0.5 * G * ph * ph * k, 1.6, { color: this.c('sky'), fill: 0.8, width: 1, shine: false });
      }
      if (grow >= 1) {
        const xl = xR + j.x * k;
        this.ripple(xl, yFl, ((this.clock + i * 0.3) % 1.2), { color: this.c('sky'), r0: 2, r1: 9, dur: 0.8 });
        this.text(`${fmt(Math.round(j.x * 100), 0)} cm`, xl, yFl + 16 + (i % 2) * 11, { size: 9.5, align: 'center', color: this.c('sky'), mono: true });
      }
    });
    // il riquadro
    const rows = [[p.wide ? i18n('Acqua nella bottiglia larga: {h} cm', { h: fmt(p.hb, 0) }) : i18n('Acqua nella bottiglia: {h} cm', { h: fmt(p.hb, 0) }), this.c('chalk'), 700]];
    if (this.result) {
      const R = this.result.reach.filter((x) => x > 0);
      rows.push([i18n('gli spruzzi arrivano a {r} cm, dall’alto in basso', { r: R.map((x) => fmt(x, 0)).join(', ') }), this.c('sky'), 600]);
    }
    this.box(rows);
  }

  // ---------- il barometro di Torricelli, e la montagna ----------
  drawBarometer() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : live ? this.u : 0;
    const hg = p.liq === 'mercurio', tubeL = hg ? 1 : 12; // la lunghezza del tubo (m)
    const ySurf = H - 64, yT = 70, k = (ySurf - yT) / tubeL, xT = W * 0.2, tw = 12;
    const col = this.c(hg ? 'chalk' : 'sky');
    // la colonna: da tubo pieno a P/(ρ·g), con un piccolo rimbalzo
    const hc = this.column(), wob = u < 1 ? Math.sin(u * 14) * (1 - u) * 0.06 * tubeL : 0;
    const cur = live ? tubeL + (hc - tubeL) * easeOut(u) + wob : tubeL;
    const yC = ySurf - Math.min(tubeL, cur) * k;
    // la vasca
    g.save(); g.fillStyle = col; g.globalAlpha = 0.25; g.fillRect(xT - 42, ySurf, 84, 26); g.restore();
    this.line([[xT - 44, ySurf - 8], [xT - 44, ySurf + 28], [xT + 44, ySurf + 28], [xT + 44, ySurf - 8]], { color: this.c('chalk'), width: 2 });
    this.line([[xT - 44, ySurf], [xT + 44, ySurf]], { color: col, width: 1.6 });
    // il tubo, con la colonna e il vuoto sopra
    g.save(); g.fillStyle = col; g.globalAlpha = 0.35; g.fillRect(xT - tw / 2, yC, tw, ySurf + 18 - yC); g.restore();
    this.line([[xT - tw / 2, ySurf + 18], [xT - tw / 2, yT], [xT + tw / 2, yT], [xT + tw / 2, ySurf + 18]], { color: this.c('chalk'), width: 2 });
    this.line([[xT - tw / 2, yC], [xT + tw / 2, yC]], { color: col, width: 2 });
    if (live && yC - yT > 18) this.text(i18n('vuoto'), xT + tw / 2 + 4, yT + 14, { size: 10, color: this.c('muted') });
    // la scala del tubo (cm per il mercurio, metri per l'acqua)
    const step = hg ? 0.2 : 2;
    for (let m = step; m <= tubeL + 1e-9; m += step) {
      const y = ySurf - m * k;
      this.line([[xT - tw / 2 - 6, y], [xT - tw / 2, y]], { color: this.c('muted'), width: 1.2 });
      this.text(hg ? `${Math.round(m * 100)} cm` : `${Math.round(m)} m`, xT - tw / 2 - 9, y + 3.5, { size: 9, align: 'right', color: this.c('muted'), mono: true });
    }
    // con l'acqua il tubo è alto come una casa di tre piani
    if (!hg) {
      const hx = xT + 26, hw = 30, hy = ySurf - 10 * k;
      g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 1.4; g.globalAlpha = 0.8; g.strokeRect(hx, hy, hw, ySurf - hy);
      for (let f = 1; f < 3; f++) { g.beginPath(); g.moveTo(hx, ySurf - (f * (ySurf - hy)) / 3); g.lineTo(hx + hw, ySurf - (f * (ySurf - hy)) / 3); g.stroke(); }
      g.beginPath(); g.moveTo(hx - 3, hy); g.lineTo(hx + hw / 2, hy - 12); g.lineTo(hx + hw + 3, hy); g.stroke(); g.restore();
    }
    // l'aria che spinge sulla vasca
    const ka = pAir(p.alt) / P0;
    for (const ax of [xT - 30, xT + 30]) this.arrow(ax, ySurf - 12 - 22 * ka, ax, ySurf - 3, { color: this.c('mint'), width: 2, head: 6 });
    // la montagna, a destra, con chi porta il barometro
    const mx0 = W * 0.5, mx1 = W - 8, peakX = W * 0.8, yBase = H - 30, yPeak = 64;
    const hOf = (a) => yBase - ((yBase - yPeak) * a) / 8849;
    g.save(); g.beginPath(); g.moveTo(mx0, yBase); g.lineTo(peakX, yPeak); g.lineTo(mx1, yBase); g.closePath();
    g.fillStyle = this.c('muted'); g.globalAlpha = 0.12; g.fill(); g.restore();
    this.line([[mx0, yBase], [peakX, yPeak], [mx1, yBase]], { color: this.c('muted'), width: 2 });
    this.line([[peakX - 9, yPeak + 7], [peakX - 4, yPeak + 4], [peakX + 2, yPeak + 8], [peakX + 7, yPeak + 5]], { color: this.c('chalk'), width: 1.6, alpha: 0.8 });
    this.text('8849 m', peakX, yPeak - 8, { size: 9.5, align: 'center', color: this.c('muted'), mono: true });
    const ym = hOf(p.alt), xm = mx0 + ((peakX - mx0) * p.alt) / 8849;
    this.ball(xm, ym - 3, 3.5, { color: this.c('orange'), fill: 0.8, width: 1.4, shine: false });
    this.text(`${fmt(p.alt, 0)} m`, xm - 7, ym - 10, { size: 10, align: 'right', weight: 700, color: this.c('orange'), mono: true });
    // il riquadro
    const rows = [[i18n('Altitudine: {a} m', { a: fmt(p.alt, 0) }), this.c('orange'), 700]];
    if (live) {
      const lab = hg ? i18n('colonna di mercurio: {h} cm', { h: fmt(Math.round(cur * 100), 0) }) : i18n('colonna d’acqua: {h} m', { h: fmt(cur, 1) });
      rows.push([lab, col, 700]);
    }
    if (this.result) {
      if (E) rows.push([i18n('l’aria spinge {k} kg su ogni quadretto', { k: fmt(pAir(p.alt) / (G * 1e4), 1) }), this.c('mint'), 700]);
      else rows.push([i18n('P = ρ·g·h = {P} kPa', { P: fmt(pAir(p.alt) / 1000, 0) }), this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- la diga ----------
  drawDam() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : live ? easeInOut(this.u) : 0;
    const yB = H - 30, k = (yB - 120) / 110, xD = W * 0.6;
    const hw = p.hd * u, yW = yB - hw * k;
    // la diga: spessa in basso, sottile in cima
    g.save(); g.beginPath(); g.moveTo(xD, yB); g.lineTo(xD, yB - 110 * k); g.lineTo(xD + 16, yB - 110 * k); g.lineTo(xD + 62, yB); g.closePath();
    g.fillStyle = this.c('muted'); g.globalAlpha = 0.2; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.stroke(); g.restore();
    this.ground(yB, { x0: 0, x1: W });
    // l'acqua, che continua a sinistra per tutta la lunghezza del lago
    if (hw > 0) {
      g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.22; g.fillRect(0, yW, xD, yB - yW); g.restore();
      const wave = [];
      for (let x = 0; x <= xD; x += 8) wave.push([x, yW + Math.sin(x / 16 + this.clock * 1.4) * 1.3]);
      this.line(wave, { color: this.c('sky'), width: 2 });
    }
    // le frecce sulla diga: più lunghe in basso, e nient'altro conta
    for (let d = 10; d <= hw + 1e-6; d += 10) {
      const y = yW + d * k, len = 6 + 0.55 * d;
      this.arrow(xD - 4 - len, y, xD - 3, y, { color: this.c('sky'), width: 2, head: 6 });
    }
    // la scala delle profondità
    for (let d = 20; d <= 100; d += 20) {
      const y = yB - d * k;
      this.line([[xD + 62 + 8, y], [xD + 62 + 14, y]], { color: this.c('muted'), width: 1.2 });
      this.text(`${d} m`, xD + 62 + 17, y + 3.5, { size: 9, color: this.c('muted'), mono: true });
    }
    // il lago visto dall'alto: lungo come dice il controllo
    const L = LAKES[p.lake].L, lw = 26 + (W - 90) * (Math.log10(L) + 1) / 2, mx = xD - lw, my = 92;
    this.text(i18n('visto dall’alto'), 12, my - 8, { size: 9.5, color: this.c('muted') });
    g.save(); g.beginPath(); g.roundRect(Math.max(10, mx), my, Math.min(lw, xD - 10), 16, 8); g.fillStyle = this.c('sky'); g.globalAlpha = 0.25; g.fill();
    g.globalAlpha = 0.8; g.strokeStyle = this.c('sky'); g.lineWidth = 1.4; g.stroke(); g.restore();
    this.line([[xD, my - 3], [xD, my + 19]], { color: this.c('chalk'), width: 3 });
    // il riquadro
    const P = this.pWater(hw), rows = [[i18n('Profondità: {h} m', { h: fmt(Math.round(hw), 0) }), this.c('chalk'), 700], [i18n(LAKES[p.lake].name), this.c('sky'), 600]];
    if (this.result) {
      if (E) {
        rows.push([i18n('sul fondo: {k} kg su ogni quadretto', { k: fmt(P / (G * 1e4), 0) }), this.c('sky'), 700]);
        rows.push([i18n('su ogni metro di diga, come {n} elefanti', { n: fmt(Math.round((0.5 * RHO.acqua * G * hw * hw) / (4000 * G)), 0) }), this.c('orange'), 700]);
      } else {
        rows.push([i18n('sul fondo: P = ρ·g·h = {P} kPa', { P: fmt(P / 1000, 0) }), this.c('sky'), 700]);
        rows.push([i18n('forza su ogni metro di diga: {F} MN', { F: fmt((0.5 * RHO.acqua * G * hw * hw) / 1e6, 1) }), this.c('orange'), 700]);
      }
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
