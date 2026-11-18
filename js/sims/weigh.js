// La bilancia dei pianeti (G01). Tre modi:
//   - 'pianeti': un astronauta sale su una bilancia sulla Terra, sulla Luna, su Marte, su Giove o su Saturno. La massa
//     resta la stessa, il peso cambia: P = m·g, con g = G·M/R². La bilancia, tarata sulla Terra, segna P / 9,81 in «kg».
//   - 'quota': la cabina di un ascensore altissimo sale fino a h km sopra la Terra; la gravità cala come 1/r²:
//     g = 9,81·(R/(R + h))². Con fall: true, in cima si taglia il cavo: la cabina cade e la bilancia segna zero.
//   - 'coppia': due palle di piombo si attirano con forze uguali e opposte, F = G·m₁·m₂/d².
// Risultato: pianeti e quota { kg (quello che segna la bilancia), P (N), g (m/s²), h }, con fall anche { fallKg: 0 };
//            coppia { F (N), rel (la forza rispetto a 1 t e 1 t a 1 m), m1, m2, d }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut, easeInOut } from './base.js';

export const G0 = 9.81;
export const GC = 6.67e-11;
const RE = 6371;
export const PLANETS = {
  terra: { g: 9.81, name: 'Terra', col: 'sky', ground: 'mint' },
  luna: { g: 1.62, name: 'Luna', col: 'muted', ground: 'muted' },
  marte: { g: 3.71, name: 'Marte', col: 'coral', ground: 'coral' },
  giove: { g: 24.8, name: 'Giove', col: 'orange', ground: 'orange' },
  saturno: { g: 10.4, name: 'Saturno', col: 'sun', ground: 'sun' },
};
// l'altezza sulla scala della torre: le prime centinaia di km si vedono bene, e ci stanno anche 20 000 km
const HMAX = 20000;
const yOf = (h) => Math.log(1 + h / 400) / Math.log(1 + HMAX / 400);
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);
// fino a due decimali, senza zeri inutili: 10,4 e 9,81
const two = (x) => fmt(x, Math.abs(x * 10 - Math.round(x * 10)) < 0.005 ? 1 : 2);

export class Weigh extends Sim {
  static controls = {
    planet: { label: 'Pianeta', type: 'select', options: [['terra', 'Terra'], ['luna', 'Luna'], ['marte', 'Marte'], ['giove', 'Giove'], ['saturno', 'Saturno']] },
    m: { label: 'Massa dell’astronauta', min: 20, max: 100, step: 5, unit: 'kg' },
    h: { label: 'Altezza della cabina', min: 0, max: 20000, step: 100, unit: 'km' },
    m1: { label: 'Prima palla', min: 1, max: 4, step: 1, unit: 't' },
    m2: { label: 'Seconda palla', min: 1, max: 4, step: 1, unit: 't' },
    d: { label: 'Distanza fra i centri', min: 1, max: 4, step: 0.5, unit: 'm' },
  };

  defaults() { return { mode: 'pianeti', planet: 'terra', m: 60, h: 400, fall: false, m1: 1, m2: 1, d: 2, lens: 's' }; }

  init() { this.phase = 'fermo'; this.read = this.params.mode === 'quota' ? this.params.m : 0; this.alt = 0; this.cut = null; this.fy = 0; }

  // g nel posto dove si pesa
  gHere(h = this.params.h) {
    const p = this.params;
    return p.mode === 'quota' ? G0 * (RE / (RE + h)) ** 2 : PLANETS[p.planet].g;
  }

  target() { return (this.params.m * this.gHere()) / G0; }

  step() {
    const p = this.params, t = this.t;
    if (p.mode === 'coppia') { if (t > 1.1) this.end(); return; }
    if (p.mode === 'pianeti') {
      // il salto sulla bilancia (0,6 s), poi la lancetta oscilla e si ferma
      if (t < 0.6) { this.phase = 'salto'; this.read = 0; return; }
      this.phase = 'sopra';
      const u = t - 0.6, k = this.target();
      this.read = Math.max(0, k * (1 - Math.exp(-4 * u) * Math.cos(9 * u)));
      if (u > 1.6) { this.read = k; this.end(); }
      return;
    }
    // quota: la cabina sale fino a h, poi (se fall) si taglia il cavo
    const up = 2.6;
    if (t < up) {
      this.phase = 'sale';
      this.alt = p.h * easeInOut(t / up);
      this.read = (p.m * this.gHere(this.alt)) / G0;
      return;
    }
    this.alt = p.h; this.read = this.target();
    if (!p.fall) { if (t > up + 0.7) this.end(); return; }
    if (t < up + 0.8) { this.phase = 'cima'; return; }
    if (this.cut == null) this.cut = this.clock;
    this.phase = 'cade'; this.read = 0;
    const u = t - up - 0.8;
    this.fy = Math.min(1, (0.5 * u * u) / 1.2);
    if (u > 1.6) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'coppia') {
      const F = (GC * p.m1 * 1000 * p.m2 * 1000) / p.d ** 2;
      return this.finish({ F, rel: (p.m1 * p.m2) / p.d ** 2, m1: p.m1, m2: p.m2, d: p.d });
    }
    const g = this.gHere(), kg = Math.round(((p.m * g) / G0) * 10) / 10;
    this.finish({ kg, P: Math.round(p.m * g), g: Math.round(g * 100) / 100, h: p.mode === 'quota' ? p.h : 0, fallKg: p.fall ? 0 : null });
  }

  // ---------- disegno ----------
  draw() {
    const p = this.params;
    this.clear();
    if (p.mode === 'coppia') return this.drawPair();
    const W = this.W, H = this.H, split = W * 0.6;
    if (p.mode === 'pianeti') this.drawPlanet(split + (W - split) / 2, H * 0.52, Math.min((W - split) * 0.36, H * 0.26));
    else this.drawTower(split, W, H);
    this.drawScene(split, H);
    this.results();
  }

  // a sinistra: l'astronauta e la bilancia (sul suolo del pianeta, o dentro la cabina)
  drawScene(split, H) {
    const g = this.ctx, p = this.params, yG = H - 34, cab = p.mode === 'quota';
    const fall = this.phase === 'cade';
    if (cab) {
      // la cabina: pareti, finestrino con le stelle, e il cavo
      const x0 = 14, x1 = split - 16, y0 = 50;
      g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 2; g.strokeRect(x0, y0, x1 - x0, yG - y0 + 6);
      g.fillStyle = this.c('sky'); g.globalAlpha = 0.05; g.fillRect(x0, y0, x1 - x0, yG - y0 + 6); g.restore();
      const wx = x0 + 12, wy = y0 + 12;
      g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 1.4; g.beginPath(); g.roundRect(wx, wy, 34, 26, 5); g.stroke();
      g.fillStyle = this.c('chalk'); for (const [a, b] of [[8, 6], [22, 14], [14, 20], [28, 8]]) { g.globalAlpha = 0.5; g.fillRect(wx + a, wy + b, 1.5, 1.5); } g.restore();
      if (!fall) this.line([[(x0 + x1) / 2, y0], [(x0 + x1) / 2, 6]], { color: this.c('muted'), width: 1.6 });
      else if (this.cut != null && this.clock - this.cut < 0.6) this.burst((x0 + x1) / 2, y0 - 6, this.clock - this.cut, { color: this.c('sun'), n: 7, r: 14, dur: 0.5 });
    } else {
      const pl = PLANETS[p.planet];
      g.save(); g.fillStyle = this.c(pl.ground); g.globalAlpha = 0.16; g.fillRect(0, yG, split - 4, H - yG); g.restore();
      this.line([[6, yG], [split - 10, yG]], { color: this.c(pl.ground), width: 2 });
    }
    // la bilancia: la pedana, e una colonna con il quadrante
    const sx = split * 0.42, sw = 54, colX = sx + sw / 2 + 26;
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.12; g.beginPath(); g.roundRect(sx - sw / 2, yG - 9, sw, 9, 3); g.fill();
    g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 1.8; g.stroke(); g.restore();
    this.line([[sx + sw / 2 - 4, yG - 4], [colX, yG - 4], [colX, yG - 56]], { color: this.c('muted'), width: 2.2 });
    this.dial(colX, yG - 76, 21);
    // l'astronauta: accanto alla bilancia, poi con un salto ci sale sopra; nella cabina che cade galleggia
    let ax = sx, ay = yG - 9;
    if (p.mode === 'pianeti' && this.phase === 'fermo') ax = sx - sw / 2 - 22, ay = yG;
    if (this.phase === 'salto') { const u = clamp01(this.t / 0.6); ax = sx - sw / 2 - 22 + (sw / 2 + 22) * u; ay = yG - 9 * u - Math.sin(u * Math.PI) * 26; }
    if (fall) ay -= 6 + 3 * Math.sin(this.clock * 3);
    this.astronaut(ax, ay, fall);
  }

  // il quadrante della bilancia, in kg come quella del bagno (fino a 160)
  dial(x, y, r) {
    const g = this.ctx, max = 160, a0 = Math.PI * 0.75, a1 = Math.PI * 2.25;
    g.save(); g.fillStyle = this.c('sim-bg'); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.stroke();
    g.lineWidth = 1.2; g.globalAlpha = 0.7;
    for (let v = 0; v <= max; v += 20) { const a = a0 + (a1 - a0) * (v / max); g.beginPath(); g.moveTo(x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2)); g.lineTo(x + Math.cos(a) * (r - (v % 40 ? 5 : 7)), y + Math.sin(a) * (r - (v % 40 ? 5 : 7))); g.stroke(); }
    g.restore();
    const a = a0 + (a1 - a0) * clamp01(this.read / max);
    this.line([[x, y], [x + Math.cos(a) * (r - 5), y + Math.sin(a) * (r - 5)]], { color: this.c('coral'), width: 2.2 });
    this.ball(x, y, 2.2, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    const lens = this.params.lens, val = lens === 'e' ? fmt(Math.round(this.read), 0) : one(this.read);
    const lab = `${val} kg`;
    g.font = '700 12px "IBM Plex Mono", monospace';
    const lw = g.measureText(lab).width + 8;
    g.save(); g.fillStyle = this.c('sim-bg'); g.fillRect(x - lw / 2, y + r + 3, lw, 15); g.restore();
    this.text(lab, x, y + r + 14, { size: 12, align: 'center', weight: 700, color: this.c('chalk'), mono: true });
  }

  // l'astronauta in piedi (piedi in x, y), con il casco e lo zaino; float: braccia in alto
  astronaut(x, y, float) {
    const col = this.c('chalk'), s = 1;
    const hip = [x, y - 22 * s], sh = [x, y - 42 * s];
    this.line([[x - 6, y], hip, [x + 6, y]], { color: col, width: 2.6 });
    this.line([hip, sh], { color: col, width: 3 });
    const g = this.ctx;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.5; g.fillRect(x - 10, y - 41, 6, 15); g.restore();
    if (float) this.line([[x - 12, y - 58], sh, [x + 12, y - 58]], { color: col, width: 2.4 });
    else this.line([[x - 9, y - 26], sh, [x + 9, y - 26]], { color: col, width: 2.4 });
    this.ball(x, y - 51, 8, { color: this.c('sky'), fill: 0.25, width: 2.2 });
    this.line([[x + 1, y - 54], [x + 6, y - 50]], { color: this.c('chalk'), width: 1.4, alpha: 0.7 });
  }

  // a destra: il pianeta dove si pesa
  drawPlanet(x, y, r) {
    const g = this.ctx, p = this.params, pl = PLANETS[p.planet], col = this.c(pl.col);
    if (p.planet === 'saturno') r *= 0.6; // con gli anelli intorno
    if (p.planet === 'saturno') { g.save(); g.strokeStyle = col; g.lineWidth = 2; g.globalAlpha = 0.8; g.beginPath(); g.ellipse(x, y, r * 1.75, r * 0.42, -0.25, Math.PI * 1.05, Math.PI * 1.95, true); g.stroke(); g.restore(); }
    this.ball(x, y, r, { color: col, fill: 0.22, width: 2.2 });
    g.save(); g.beginPath(); g.arc(x, y, r - 1, 0, 7); g.clip(); g.strokeStyle = col; g.lineWidth = 1.4; g.globalAlpha = 0.55;
    if (p.planet === 'giove' || p.planet === 'saturno') for (const k of [-0.45, -0.1, 0.25, 0.55]) { g.beginPath(); g.moveTo(x - r, y + k * r); g.quadraticCurveTo(x, y + k * r + 4, x + r, y + k * r); g.stroke(); }
    if (p.planet === 'giove') { g.globalAlpha = 0.8; g.beginPath(); g.ellipse(x + r * 0.3, y + r * 0.38, r * 0.2, r * 0.11, 0, 0, 7); g.stroke(); }
    if (p.planet === 'luna') for (const [a, b, c] of [[-0.3, -0.3, 0.18], [0.35, 0.1, 0.24], [-0.15, 0.45, 0.13]]) { g.beginPath(); g.arc(x + a * r, y + b * r, c * r, 0, 7); g.stroke(); }
    if (p.planet === 'marte') { g.fillStyle = this.c('chalk'); g.globalAlpha = 0.6; g.beginPath(); g.ellipse(x, y - r * 0.92, r * 0.35, r * 0.14, 0, 0, 7); g.fill(); }
    if (p.planet === 'terra') { g.fillStyle = this.c('mint'); g.globalAlpha = 0.35; for (const [a, b, c] of [[-0.35, -0.2, 0.32], [0.3, 0.3, 0.28]]) { g.beginPath(); g.ellipse(x + a * r, y + b * r, c * r, c * r * 0.7, 0.4, 0, 7); g.fill(); } }
    g.restore();
    if (p.planet === 'saturno') { g.save(); g.strokeStyle = col; g.lineWidth = 2; g.globalAlpha = 0.9; g.beginPath(); g.ellipse(x, y, r * 1.75, r * 0.42, -0.25, Math.PI * 0.05, Math.PI * 0.95); g.stroke(); g.restore(); }
    this.text(i18n(pl.name), x, y + r + 22, { size: 12.5, align: 'center', weight: 700, color: col });
  }

  // a destra: la torre, con l'altezza su una scala che fa vedere bene i primi chilometri
  drawTower(split, W, H) {
    const g = this.ctx, p = this.params, x = split + (W - split) * 0.42, yb = H - 24, yt = 46, hh = yb - yt;
    // la Terra, sotto
    g.save(); g.beginPath(); g.arc(x, yb + 260, 266, Math.PI * 1.25, Math.PI * 1.75); g.strokeStyle = this.c('sky'); g.lineWidth = 2.2; g.stroke(); g.restore();
    this.line([[x, yb - 2], [x, yt]], { color: this.c('muted'), width: 2.4 });
    for (const [h, lab] of [[0, '0'], [400, '400 km'], [2000, '2000 km'], [6400, '6400 km'], [20000, '20 000 km']]) {
      const y = yb - 2 - hh * yOf(h);
      this.line([[x - 5, y], [x + 5, y]], { color: this.c('muted'), width: 1.4 });
      if (h) this.text(lab, x + 9, y + 3.5, { size: 9.5, color: this.c('muted'), mono: true });
    }
    // la cabina: sale, e se si taglia il cavo cade
    const alt = this.phase === 'fermo' ? 0 : this.alt;
    let y = yb - 2 - hh * yOf(alt);
    if (this.phase === 'cade') y += (yb - 2 - y) * this.fy;
    g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.3; g.fillRect(x - 7, y - 10, 14, 10); g.globalAlpha = 1; g.strokeStyle = this.c('sun'); g.lineWidth = 1.8; g.strokeRect(x - 7, y - 10, 14, 10); g.restore();
  }

  // due palle di piombo che si attirano: frecce uguali e opposte, lunghe come la forza
  drawPair() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, yc = H * 0.56;
    const unit = Math.min((W - 90) / 4.6, 64), xc = W / 2;
    const xa = xc - (p.d * unit) / 2, xb = xc + (p.d * unit) / 2;
    const ra = 12 + 9 * Math.cbrt(p.m1), rb = 12 + 9 * Math.cbrt(p.m2);
    const grow = this.result ? 1 : this.running ? easeOut(clamp01(this.t / 0.9)) : 0;
    const rel = (p.m1 * p.m2) / p.d ** 2, len = Math.min(unit * p.d * 0.5 - 4, 30 * Math.sqrt(rel) * 1.6) * grow;
    // la distanza fra i centri
    this.line([[xa, yc + 44], [xb, yc + 44]], { color: this.c('muted'), width: 1.4 });
    for (const x of [xa, xb]) this.line([[x, yc + 38], [x, yc + 50]], { color: this.c('muted'), width: 1.4 });
    this.text(`${one(p.d)} m`, xc, yc + 62, { size: 11, align: 'center', color: this.c('muted'), mono: true });
    this.ball(xa, yc, ra, { color: this.c('sky'), fill: 0.3, width: 2.2 });
    this.ball(xb, yc, rb, { color: this.c('orange'), fill: 0.3, width: 2.2 });
    this.text(`${p.m1} t`, xa, yc - ra - 8, { size: 11.5, align: 'center', weight: 700, color: this.c('sky'), mono: true });
    this.text(`${p.m2} t`, xb, yc - rb - 8, { size: 11.5, align: 'center', weight: 700, color: this.c('orange'), mono: true });
    if (len > 2) {
      this.arrow(xa + ra * 0.2, yc, xa + ra * 0.2 + len, yc, { color: this.c('coral'), width: 3, head: 8 });
      this.arrow(xb - rb * 0.2, yc, xb - rb * 0.2 - len, yc, { color: this.c('coral'), width: 3, head: 8 });
    }
    // il riquadro: la forza, per tutti e due
    const rows = [];
    if (this.result || this.running) {
      if (p.lens === 'e') rows.push([i18n('forza: {n} volte quella di 1 t e 1 t a 1 m', { n: one(rel) }), this.c('coral')]);
      else rows.push([i18n('F = {F} N, uguale per tutte e due', { F: this.sci(this.result ? this.result.F : (GC * p.m1 * 1e3 * p.m2 * 1e3) / p.d ** 2) }), this.c('coral')]);
    }
    rows.unshift([i18n('Due palle di piombo'), this.c('chalk')]);
    rows.forEach(([t, col], i) => this.text(t, 12, 20 + i * 16, { size: 11.5, weight: i ? 700 : 600, color: col }));
  }

  // 0,000067 → «6,7·10⁻⁵»
  sci(x) {
    const e = Math.floor(Math.log10(x)), m = x / 10 ** e;
    const sup = String(e).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);
    return `${fmt(m, 1)}·10${sup}`;
  }

  results() {
    const g = this.ctx, p = this.params, rows = [];
    const E = p.lens === 'e', val = E ? fmt(Math.round(this.read), 0) : one(this.read);
    if (p.mode === 'pianeti') rows.push([i18n('Su: {p}', { p: i18n(PLANETS[p.planet].name) }), this.c(PLANETS[p.planet].col), 700]);
    else rows.push([i18n('Altezza: {h} km', { h: fmt(Math.round(this.phase === 'fermo' ? 0 : this.alt), 0) }), this.c('sun'), 700]);
    rows.push([i18n('la bilancia segna {k} kg', { k: val }), this.c('chalk'), 600]);
    if (!E && (this.result || this.running || p.mode === 'pianeti')) {
      const gg = this.phase === 'cade' ? 0 : p.mode === 'quota' ? this.gHere(this.phase === 'fermo' ? 0 : this.alt) : this.gHere();
      if (this.phase === 'cade') rows.push([i18n('la cabina cade: la bilancia cade con te'), this.c('pink'), 600]);
      else rows.push([i18n('g = {g} m/s², peso {P} N', { g: two(gg), P: fmt(Math.round(p.m * gg), 0) }), this.c('muted'), 500]);
    } else if (E && this.phase === 'cade') rows.push([i18n('la cabina cade: la bilancia cade con te'), this.c('pink'), 600]);
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }
}
