// Galleggiare (FL02). Tre modi:
//   - 'barca': la chiatta del porto, lunga L metri, larga 2 m e alta 1 m, con la linea di carico a metà. Le casse da
//     500 kg scendono sul ponte e la chiatta affonda finché l'acqua spostata pesa quanto il carico (lo scafo vuoto è
//     leggerissimo e non si conta): pescaggio d = carico / (1000 · 2 · L). Oltre 1 m l'acqua entra e la chiatta va giù.
//   - 'dinamometro': un oggetto appeso a un dinamometro scende nel vaso di Archimede, pieno fino al beccuccio. L'acqua
//     che esce finisce nel bicchiere; il dinamometro segna di meno, e la differenza è proprio il peso di quell'acqua.
//     Con la corona e il lingotto (lo stesso peso, 1 kg) c'è il problema del re Gerone.
//   - 'vasca': uno o due oggetti (a, b) cadono in una vasca d'acqua, d'olio o del Mar Morto: galleggiano se sono meno
//     densi del liquido, con la parte sotto pari al rapporto delle densità, altrimenti affondano. Il sottomarino ha i
//     serbatoi pieni d'acqua per la percentuale zavorra: vuoti galleggia, a metà resta sospeso, pieni affonda.
// Risultato: barca { L, cargo, d (m), ok (linea di carico fuori), sunk };
//            dinamometro { obj, liq, m (kg), V (L), W, Wl, FA (N) }; vasca { a, b, liq, fa, fb (frazione immersa, 1 = sotto), sa, sb ('su', 'giu', 'sospeso') }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut, easeInOut } from './base.js';

const G = 9.81;
export const LIQ = {
  acqua: { name: 'Acqua', rho: 1000, col: 'sky' },
  morto: { name: 'Acqua del Mar Morto', rho: 1240, col: 'mint' },
  olio: { name: 'Olio', rho: 900, col: 'sun' },
};
// gli oggetti della vasca: densità (kg/m³), forma, misure in cm (larghezza, altezza)
export const THINGS = {
  sughero: { name: 'Sughero', rho: 240, shape: 'cubo', w: 10, h: 10, col: 'orange' },
  legno: { name: 'Legno', rho: 600, shape: 'cubo', w: 10, h: 10, col: 'sun' },
  ghiaccio: { name: 'Ghiaccio', rho: 920, shape: 'cubo', w: 10, h: 10, col: 'sky' },
  uovo: { name: 'Uovo', rho: 1030, shape: 'uovo', w: 4.5, h: 6, col: 'chalk' },
  sasso: { name: 'Sasso', rho: 2600, shape: 'cubo', w: 10, h: 10, col: 'muted' },
  ferro: { name: 'Palla di ferro', rho: 7900, shape: 'palla', w: 6.2, h: 6.2, col: 'chalk' },
  barchetta: { name: 'Barchetta di ferro', rho: 420, shape: 'barca', w: 20, h: 6, col: 'chalk' },
  sottomarino: { name: 'Sottomarino', rho: 900, shape: 'sub', w: 24, h: 8, col: 'orange' },
  nessuno: { name: 'Nessuno', rho: 0, shape: 'none', w: 0, h: 0, col: 'muted' },
};
// gli oggetti del dinamometro: massa (kg) e volume (litri)
export const WEIGHTS = {
  sasso: { name: 'Sasso', m: 3, V: 1, col: 'muted' },
  mattone: { name: 'Mattone', m: 4, V: 2, col: 'coral' },
  ferro: { name: 'Blocco di ferro', m: 8, V: 1, col: 'chalk' },
  corona: { name: 'Corona', m: 1, V: 0.065, col: 'sun' },
  lingotto: { name: 'Lingotto d’oro', m: 1, V: 0.0518, col: 'sun' },
};
const sel = (o, keys) => keys.map((k) => [k, o[k].name]);
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);
const two = (x) => fmt(x, Math.abs(x * 10 - Math.round(x * 10)) < 0.005 ? 1 : 2);

export class Float extends Sim {
  static tall = true;
  static controls = {
    L: { label: 'Lunghezza della chiatta', min: 1, max: 8, step: 0.5, unit: 'm' },
    cargo: { label: 'Carico', min: 500, max: 8000, step: 500, unit: 'kg' },
    obj: { label: 'Oggetto', type: 'select', options: sel(WEIGHTS, ['sasso', 'mattone', 'ferro']) },
    crown: { label: 'Che cosa pesi', type: 'select', options: sel(WEIGHTS, ['corona', 'lingotto']) },
    a: { label: 'Primo oggetto', type: 'select', options: sel(THINGS, ['sughero', 'legno', 'ghiaccio', 'uovo', 'sasso', 'ferro', 'barchetta']) },
    b: { label: 'Secondo oggetto', type: 'select', options: sel(THINGS, ['nessuno', 'sughero', 'legno', 'ghiaccio', 'uovo', 'sasso', 'ferro', 'barchetta']) },
    liq: { label: 'Liquido', type: 'select', options: sel(LIQ, ['acqua', 'morto', 'olio']) },
    zav: { label: 'Serbatoi pieni d’acqua', min: 0, max: 100, step: 10, unit: '%' },
  };

  defaults() { return { mode: 'vasca', L: 2, cargo: 2000, obj: 'sasso', crown: null, a: 'legno', b: 'sasso', liq: 'acqua', zav: 0, hide: false, lens: 's' }; }

  init() { this.u = 0; }

  // ---------- la fisica ----------
  rhoOf(k) { return k === 'sottomarino' ? 900 + 2 * this.params.zav : THINGS[k].rho; }
  rhoLiq() { return LIQ[this.params.liq].rho; }
  // come finisce un oggetto della vasca: 'su' (galleggia, con la frazione f sotto), 'giu' o 'sospeso'
  fate(k) {
    const r = this.rhoOf(k), rl = this.rhoLiq();
    if (Math.abs(r - rl) < 1) return { s: 'sospeso', f: 1 };
    return r < rl ? { s: 'su', f: r / rl } : { s: 'giu', f: 1 };
  }
  draft() { const p = this.params; return p.cargo / (1000 * 2 * p.L); }
  weighed() { const p = this.params; return WEIGHTS[p.mode === 'dinamometro' && p.crown ? p.crown : p.obj]; }

  step() {
    const p = this.params, t = this.t;
    if (p.mode === 'barca') { const T = this.draft() > 1 ? 3.6 : 2.6; if (t > T) this.end(); return; }
    if (p.mode === 'dinamometro') { this.u = easeInOut(clamp01(t / 2.2)); if (t > 2.7) this.end(); return; }
    if (t > 2.8) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'barca') { const d = this.draft(); return this.finish({ L: p.L, cargo: p.cargo, d, ok: d <= 0.5 + 1e-9, sunk: d > 1 }); }
    if (p.mode === 'dinamometro') {
      const o = this.weighed(), rl = this.rhoLiq(), FA = rl * (o.V / 1000) * G, W = o.m * G;
      return this.finish({ obj: p.crown || p.obj, liq: p.liq, m: o.m, V: o.V, W, Wl: W - FA, FA });
    }
    const A = this.fate(p.a), B = p.b && p.b !== 'nessuno' ? this.fate(p.b) : null;
    this.finish({ a: p.a, b: p.b, liq: p.liq, fa: A.f, fb: B ? B.f : null, sa: A.s, sb: B ? B.s : null });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'barca') this.drawBarge();
    else if (m === 'dinamometro') this.drawScale();
    else this.drawTank();
  }

  // ---------- la chiatta del porto ----------
  drawBarge() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, t = this.result ? 9 : this.t;
    const k = Math.min((W - 60) / 8, (H * 0.3) / 1.6), yS = Math.round(H * 0.52);
    const d = this.draft(), len = p.L * k, x0 = W / 2 - len / 2, x1 = W / 2 + len / 2;
    // dove sta il fondo dello scafo: casse che scendono, poi la chiatta si assesta (o va giù)
    let dy = 0.04 * k; // vuota pesca pochissimo
    if (live) {
      if (t < 1) dy = 0.04 * k;
      else if (d <= 1) { const tau = t - 1; dy = d * k + (0.04 * k - d * k) * Math.exp(-3 * tau) * Math.cos(6 * tau); }
      else { const tau = t - 1; dy = Math.min(k, d * k * easeOut(tau / 0.7)) + (tau > 0.9 ? (H - yS) * easeInOut((tau - 0.9) / 1.6) : 0); }
    }
    const yBot = yS + dy, yTop = yBot - k;
    // la chiatta: scafo, linea di carico con il cerchio di Plimsoll
    const hull = [[x0, yTop], [x1, yTop], [x1 - 0.25 * k, yBot], [x0 + 0.2 * k, yBot]];
    g.save(); g.beginPath(); hull.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
    g.fillStyle = this.c('orange'); g.globalAlpha = 0.2; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('orange'); g.lineWidth = 2.2; g.lineJoin = 'round'; g.stroke(); g.restore();
    const yLL = yBot - 0.5 * k;
    this.line([[x0 + 0.12 * k, yLL], [x1 - 0.14 * k, yLL]], { color: this.c('chalk'), width: 1.4, dash: [5, 4] });
    const cx = W / 2;
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.4; g.beginPath(); g.arc(cx, yLL, 5, 0, 7); g.stroke(); g.restore();
    // le casse da 500 kg sul ponte (o che scendono): mezzo metro per lato
    const n = Math.round(p.cargo / 500), cs = 0.5 * k, per = Math.max(1, Math.floor((len - 6) / (cs + 2)));
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / per), col = i % per, inRow = Math.min(per, n - row * per);
      const cxi = W / 2 - (inRow * (cs + 2)) / 2 + col * (cs + 2) + 1;
      let cy = yTop - cs - row * (cs + 1);
      if (live && t < 1) cy -= (1 - easeOut(clamp01(t / 0.9))) * (cy + cs + 10);
      if (!live) continue;
      g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.25; g.fillRect(cxi, cy, cs, cs); g.globalAlpha = 1;
      g.strokeStyle = this.c('sun'); g.lineWidth = 1.4; g.strokeRect(cxi, cy, cs, cs);
      g.beginPath(); g.moveTo(cxi, cy); g.lineTo(cxi + cs, cy + cs); g.stroke(); g.restore();
    }
    // l'acqua del porto, sopra lo scafo: la parte immersa si vede bagnata
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.18; g.fillRect(0, yS, W, H - yS); g.restore();
    const wave = [];
    for (let x = 0; x <= W; x += 8) wave.push([x, yS + Math.sin(x / 20 + this.clock * 1.4) * 1.5]);
    this.line(wave, { color: this.c('sky'), width: 2 });
    // la misura della lunghezza
    if (yBot < H - 14) {
      this.line([[x0, H - 18], [x1, H - 18]], { color: this.c('muted'), width: 1.2 });
      this.line([[x0, H - 22], [x0, H - 14]], { color: this.c('muted'), width: 1.2 });
      this.line([[x1, H - 22], [x1, H - 14]], { color: this.c('muted'), width: 1.2 });
      this.text(`${one(p.L)} m`, W / 2, H - 24, { size: 10.5, align: 'center', color: this.c('muted'), mono: true });
    }
    // il riquadro
    const rows = [[i18n('Carico: {c} kg ({n} casse da 500 kg)', { c: fmt(p.cargo, 0), n: n }), this.c('sun'), 700]];
    if (this.result || (live && t > 1.6)) {
      if (d > 1) rows.push([i18n('l’acqua entra: la chiatta affonda!'), this.c('coral'), 700]);
      else if (d > 0.5 + 1e-9) rows.push([i18n('galleggia, ma la linea di carico è sott’acqua'), this.c('orange'), 700]);
      else rows.push([i18n('galleggia: la linea di carico resta fuori'), this.c('mint'), 700]);
      if (!E && d <= 1) rows.push([i18n('acqua spostata: {V} m³, cioè {M} kg', { V: two(2 * p.L * d), M: fmt(p.cargo, 0) }), this.c('sky'), 600]);
      if (!E && d <= 1) rows.push([i18n('pescaggio: {d} cm', { d: fmt(Math.round(d * 100), 0) }), this.c('muted'), 500]);
    }
    this.box(rows);
  }

  // ---------- il dinamometro e il vaso di Archimede ----------
  drawScale() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const o = this.weighed(), key = p.crown || p.obj, rl = this.rhoLiq(), lc = this.c(LIQ[p.liq].col);
    const live = this.running || !!this.result, u = this.result ? 1 : live ? this.u : 0;
    const yTab = H - 40, xc = W * 0.44, bw = 92, bh = 150, bTop = yTab - bh, yWat = bTop + 18;
    // l'oggetto: grandezza disegnata (gli oggetti piccoli si ingrandiscono, per vederli)
    const small = o.V < 0.5, s = small ? 30 * Math.cbrt(o.V / 0.065) : 40 * Math.cbrt(o.V);
    const ow = key === 'mattone' ? s * 1.5 : key === 'lingotto' ? s * 1.4 : s, oh = key === 'mattone' ? s * 0.6 : key === 'lingotto' ? s * 0.6 : key === 'corona' ? s * 0.75 : s;
    // quanto scende: da sopra il vaso a tutto sott'acqua (un po' sotto il pelo)
    const yHook0 = bTop - 30 - oh, yHook1 = yWat + 10, yHook = yHook0 + (yHook1 - yHook0) * u;
    const objTop = yHook + 8, objBot = objTop + oh;
    const sub = clamp01((objBot - yWat) / oh), Vsub = o.V * sub;
    const read = (o.m - (rl / 1000) * Vsub) * G; // N
    // il supporto e il dinamometro
    const post = W * 0.1, dTop = 86;
    this.line([[post, yTab], [post, dTop], [xc, dTop]], { color: this.c('muted'), width: 3 });
    // il dinamometro: la molla si allunga con il peso; sotto, il filo che cala l'oggetto
    const dBot = dTop + 84, sx = xc, gr = o.m < 2, full = clamp01(read / (o.m * G));
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.8; g.strokeRect(sx - 9, dTop + 4, 18, 80); g.restore();
    const spr = [], n = 9, sl = 26 + 40 * full;
    for (let i = 0; i <= n; i++) spr.push([sx + (i % 2 ? 5 : -5) * (i && i < n ? 1 : 0), dTop + 8 + (sl * i) / n]);
    this.line(spr, { color: this.c('muted'), width: 1.4 });
    this.line([[sx, dTop + 8 + sl], [sx, dBot]], { color: this.c('chalk'), width: 1.6 });
    this.line([[sx - 6, dTop + 8 + sl], [sx + 6, dTop + 8 + sl]], { color: this.c('coral'), width: 2.4 });
    this.line([[sx, dBot], [sx, yHook]], { color: this.c('chalk'), width: 1.2 });
    // quanto segna, accanto al dinamometro
    const lab = E ? this.kgLabel(read / G, gr) : `${two(read)} N`;
    g.font = '700 12px "IBM Plex Mono", monospace';
    const lw = g.measureText(lab).width + 10;
    g.save(); g.fillStyle = this.c('sim-bg'); g.globalAlpha = 0.9; g.fillRect(sx + 14, dTop + 40, lw, 18); g.restore();
    this.text(lab, sx + 19, dTop + 53, { size: 12, weight: 700, color: this.c('coral'), mono: true });
    // il tavolo, il vaso di Archimede pieno fino al beccuccio, il bicchiere sotto il beccuccio
    this.ground(yTab, { x0: 0, x1: W });
    g.save(); g.fillStyle = lc; g.globalAlpha = 0.22; g.fillRect(xc - bw / 2, yWat, bw, yTab - yWat); g.restore();
    this.line([[xc - bw / 2, bTop], [xc - bw / 2, yTab], [xc + bw / 2, yTab], [xc + bw / 2, yWat], [xc + bw / 2 + 22, yWat + 12]], { color: this.c('chalk'), width: 2 });
    this.line([[xc + bw / 2, yWat - 6], [xc + bw / 2, bTop]], { color: this.c('chalk'), width: 2 });
    this.line([[xc - bw / 2, yWat], [xc + bw / 2, yWat]], { color: lc, width: 1.6 });
    const cupX = xc + bw / 2 + 30, cupW = 40, cupH = 60, cupMax = small ? 0.1 : 2.5;
    const lvl = (Vsub / cupMax) * (cupH - 6);
    g.save(); g.fillStyle = lc; g.globalAlpha = 0.3; g.fillRect(cupX - cupW / 2, yTab - lvl, cupW, lvl); g.restore();
    this.line([[cupX - cupW / 2, yTab - cupH], [cupX - cupW / 2, yTab], [cupX + cupW / 2, yTab], [cupX + cupW / 2, yTab - cupH]], { color: this.c('chalk'), width: 1.8 });
    if (live && u > 0.05 && u < 1 && sub > 0) for (let i = 0; i < 3; i++) {
      const ph = (this.clock * 2 + i / 3) % 1;
      this.ball(xc + bw / 2 + 22 + ph * 6, yWat + 12 + ph * (yTab - cupH - yWat + 20), 1.6, { color: lc, fill: 0.8, width: 1, shine: false });
    }
    // l'oggetto appeso
    this.drawWeight(key, sx, objTop, ow, oh, o.col);
    this.line([[sx, yHook], [sx, objTop]], { color: this.c('chalk'), width: 1.2 });
    // il riquadro
    const rows = [[i18n(o.name), this.c(o.col), 700], [i18n('in aria: {w}', { w: E ? this.kgLabel(o.m, gr) : `${two(o.m * G)} N` }), this.c('chalk'), 600]];
    if (this.result) {
      const FA = (rl / 1000) * o.V * G;
      rows.push([i18n('in acqua: {w}', { w: E ? this.kgLabel(o.m - (rl / 1000) * o.V, gr) : `${two(o.m * G - FA)} N` }), this.c('coral'), 700]);
      if (E) rows.push([i18n('acqua uscita: {v}, che pesa {w}', { v: this.volLabel(o.V), w: this.kgLabel((rl / 1000) * o.V, gr) }), lc, 600]);
      else rows.push([i18n('acqua spostata: {v}, peso {F} N', { v: this.volLabel(o.V), F: two(FA) }), lc, 600]);
    }
    this.box(rows);
  }

  kgLabel(kg, grams) { return grams ? `${fmt(Math.round(kg * 1000), 0)} g` : `${one(kg)} kg`; }
  volLabel(L) { return L < 0.5 ? `${fmt(Math.round(L * 1000), 0)} mL` : `${one(L)} L`; }

  // gli oggetti del dinamometro: (x, y) = centro in alto
  drawWeight(k, x, y, w, h, cn) {
    const g = this.ctx, col = this.c(cn);
    g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2; g.lineJoin = 'round';
    g.beginPath();
    if (k === 'sasso') { g.moveTo(x - w * 0.45, y + h * 0.2); g.lineTo(x - w * 0.1, y); g.lineTo(x + w * 0.4, y + h * 0.12); g.lineTo(x + w * 0.5, y + h * 0.7); g.lineTo(x + w * 0.1, y + h); g.lineTo(x - w * 0.5, y + h * 0.8); g.closePath(); }
    else if (k === 'corona') { g.moveTo(x - w / 2, y + h); g.lineTo(x - w / 2, y); g.lineTo(x - w / 4, y + h * 0.45); g.lineTo(x, y); g.lineTo(x + w / 4, y + h * 0.45); g.lineTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); g.closePath(); }
    else if (k === 'lingotto') { g.moveTo(x - w / 2, y + h); g.lineTo(x - w / 2 + 6, y); g.lineTo(x + w / 2 - 6, y); g.lineTo(x + w / 2, y + h); g.closePath(); }
    else g.rect(x - w / 2, y, w, h);
    g.globalAlpha = 0.25; g.fill(); g.globalAlpha = 1; g.stroke();
    if (k === 'mattone') { g.beginPath(); g.moveTo(x - w / 2, y + h / 2); g.lineTo(x + w / 2, y + h / 2); g.moveTo(x, y); g.lineTo(x, y + h / 2); g.stroke(); }
    g.restore();
  }

  // ---------- la vasca ----------
  drawTank() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, t = this.result ? 9 : this.t;
    const x0 = 22, x1 = W - 22, yB = H - 30, yT = Math.round(H * 0.32), yL0 = yB - (yB - yT) * 0.55;
    const k = Math.min(4.4, (x1 - x0) / 66), liq = LIQ[p.liq], lc = this.c(liq.col);
    const keys = [p.a, p.b].filter((q) => q && q !== 'nessuno');
    const xs = keys.length === 1 ? [(x0 + x1) / 2] : [x0 + (x1 - x0) * 0.3, x0 + (x1 - x0) * 0.7];
    // dove sta ogni oggetto (il fondo, in px): sopra l'acqua, poi giù, poi fermo
    const objs = keys.map((q, i) => {
      const th = THINGS[q], w = th.w * k, h = th.h * k, fate = this.fate(q);
      const start = yL0 - 10, yStop = fate.s === 'su' ? yL0 + fate.f * h : fate.s === 'giu' ? yB - 2 : (yL0 + yB) / 2 + h / 2;
      let yb = start;
      if (live) {
        if (t < 0.45) yb = start + (yL0 + h * 0.3 - start) * (t / 0.45) ** 2;
        else if (fate.s === 'giu') { const v = (yStop - (yL0 + h * 0.3)) / Math.max(0.6, 1.6 * (1 - 1000 / (this.rhoOf(q) + 200))); yb = Math.min(yStop, yL0 + h * 0.3 + v * (t - 0.45)); }
        else { const tau = t - 0.45, a0 = yL0 + h * 0.3 - yStop; yb = yStop + a0 * Math.exp(-2.6 * tau) * Math.cos(6 * tau); }
      }
      return { q, th, w, h, x: xs[i], yb, fate };
    });
    // il livello: l'acqua spostata lo alza
    let yL = yL0;
    for (let it = 0; it < 2; it++) {
      const area = objs.reduce((s, o) => s + o.w * clamp01((o.yb - yL) / o.h) * o.h * (o.th.shape === 'barca' ? 1 : o.th.shape === 'palla' || o.th.shape === 'uovo' ? 0.78 : 1), 0);
      yL = yL0 - area / (x1 - x0);
    }
    // l'acqua e la vasca
    g.save(); g.fillStyle = lc; g.globalAlpha = 0.2; g.fillRect(x0, yL, x1 - x0, yB - yL); g.restore();
    const wave = [];
    for (let x = x0; x <= x1; x += 8) wave.push([x, yL + Math.sin(x / 16 + this.clock * 1.6) * 1.2]);
    this.line(wave, { color: lc, width: 1.8 });
    this.line([[x0, yT], [x0, yB], [x1, yB], [x1, yT]], { color: this.c('chalk'), width: 2.2 });
    // gli oggetti, con le loro frecce quando sono fermi
    objs.forEach((o) => {
      this.drawThing(o.q, o.x, o.yb, o.w, o.h);
      if (this.result || (live && t > 2)) {
        const rw = this.rhoOf(o.q), rl = liq.rho, sub = o.fate.s === 'su' ? o.fate.f : 1, ratio = (sub * rl) / rw;
        const cy = Math.min(o.yb - o.h / 2, yB - 24);
        this.arrow(o.x - 6, cy, o.x - 6, cy + 22, { color: this.c('coral'), width: 2.4, head: 7 });
        this.arrow(o.x + 6, cy, o.x + 6, cy - 22 * Math.min(1.6, ratio), { color: this.c('sky'), width: 2.4, head: 7 });
      }
    });
    // sopra la vasca: chi è (e quanto pesa un litro, o la densità), e come finisce
    objs.forEach((o) => {
      const name = i18n(o.th.name), col = this.c(o.th.col);
      this.text(name, o.x, yT - 30, { size: 11.5, align: 'center', weight: 700, color: col });
      let info = '';
      if (o.q === 'sottomarino') info = i18n('serbatoi pieni al {z}%', { z: fmt(p.zav, 0) });
      else if (E) info = o.th.shape === 'cubo' ? i18n('un litro pesa {g} g', { g: fmt(o.th.rho, 0) }) : '';
      else info = i18n('{r} kg/m³', { r: fmt(this.rhoOf(o.q), 0) });
      // nelle previsioni (hide) le densità si vedono solo dopo la prova
      if (info && !(p.hide && !live)) this.text(info, o.x, yT - 16, { size: 10.5, align: 'center', color: this.c('muted') });
      if (this.result || (live && t > 2)) {
        const f = o.fate, verdict = f.s === 'su' ? i18n('galleggia: {n}% sotto', { n: fmt(Math.round(f.f * 100), 0) }) : f.s === 'giu' ? i18n('affonda') : i18n('resta sospeso');
        this.text(verdict, o.x, yT - 2, { size: 11, align: 'center', weight: 700, color: this.c(f.s === 'giu' ? 'coral' : f.s === 'su' ? 'mint' : 'sky') });
      }
    });
    const rows = [[E ? i18n(liq.name) : i18n('{l}: {r} kg/m³', { l: i18n(liq.name), r: fmt(liq.rho, 0) }), lc, 700]];
    if (E && p.liq === 'acqua') rows.push([i18n('un litro d’acqua pesa 1000 g'), this.c('muted'), 500]);
    this.box(rows);
  }

  // un oggetto della vasca, con il fondo in (x, yb)
  drawThing(q, x, yb, w, h) {
    const g = this.ctx, th = THINGS[q], col = this.c(th.col);
    g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 2; g.lineJoin = 'round';
    g.beginPath();
    if (th.shape === 'palla') g.arc(x, yb - h / 2, h / 2, 0, 7);
    else if (th.shape === 'uovo') g.ellipse(x, yb - h / 2, w / 2, h / 2, 0, 0, 7);
    else if (th.shape === 'barca') { g.moveTo(x - w / 2, yb - h); g.lineTo(x + w / 2, yb - h); g.lineTo(x + w / 2 - h * 0.6, yb); g.lineTo(x - w / 2 + h * 0.6, yb); g.closePath(); }
    else if (th.shape === 'sub') { g.roundRect(x - w / 2, yb - h, w, h, h / 2); }
    else g.rect(x - w / 2, yb - h, w, h);
    g.globalAlpha = th.shape === 'barca' ? 0.12 : 0.28; g.fill(); g.globalAlpha = 1; g.stroke();
    if (th.shape === 'sub') {
      g.beginPath(); g.roundRect(x - w * 0.12, yb - h - 7, w * 0.2, 8, 2); g.stroke();
      // i serbatoi, pieni per la zavorra
      const z = this.params.zav / 100;
      g.globalAlpha = 0.5; g.fillStyle = this.c('sky'); g.fillRect(x - w * 0.42, yb - h * 0.15 - h * 0.5 * z, w * 0.84, h * 0.5 * z);
    }
    if (th.shape === 'cubo' && q === 'legno') { g.globalAlpha = 0.5; g.beginPath(); g.moveTo(x - w / 2 + 4, yb - h * 0.35); g.quadraticCurveTo(x, yb - h * 0.45, x + w / 2 - 4, yb - h * 0.3); g.stroke(); }
    g.restore();
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
