// Molle e oscillazioni (O01). Cinque modi:
//   - 'hooke': una molla appesa con w grammi di pesi (da 50 g l'uno). Si allunga di x = m·g / k: il doppio del peso, il
//     doppio dell'allungamento (legge di Hooke). Il righello misura l'allungamento, il grafico forza–allungamento è una retta.
//   - 'oscilla': un peso di m kg su una molla di durezza k, tirato giù di A cm e lasciato andare. Oscilla con il periodo
//     T = 2π·√(m/k), uguale per ogni A; una penna attaccata al peso scrive il suo grafico su un foglio che scorre.
//   - 'energia': un blocco da 1 kg su una molla orizzontale (k = 40 N/m, T ≈ 1 s), tirato di A cm. L'energia passa avanti
//     e indietro fra elastica (½·k·x²) e cinetica (½·m·v²); con l'attrito una parte diventa calore e l'oscillazione si spegne.
//   - 'cavallino': il cavallino a molla del parco, con il bambino sopra: m kg in tutto su una molla di durezza k. Deve fare
//     un dondolio al secondo; una lucina lampeggia a ogni secondo per confrontare.
//   - 'ombra': una pallina che gira su una ruota, illuminata di lato: la sua ombra sul muro va su e giù insieme al peso
//     di m kg su una molla con k = 20 N/m. Il moto armonico è l'ombra di un moto circolare uniforme.
//   - 'luna': un pendolo da 1 m e una molla con 1 kg (k = 10 N/m), sulla Terra o sulla Luna. Il pendolo dipende da g e
//     sulla Luna rallenta; la molla no: si allunga di meno, ma oscilla con lo stesso ritmo.
// Risultato: hooke { w, k, F, x }; oscilla { m, k, A, T, f }; energia { A, E0, Eend, heat }; cavallino { k, m, T };
//            ombra { m, T }; luna { luna, Tp, Tm }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

const G = 9.81, G_MOON = 1.62, TWO_PI = 2 * Math.PI;
export const period = (m, k) => TWO_PI * Math.sqrt(m / k);
export const stretch = (grams, k) => ((grams / 1000) * G) / k; // metri
export const pendulumT = (L, g) => TWO_PI * Math.sqrt(L / g);
const M_E = 1, K_E = 40, GAMMA = 0.4;
// un numero con al massimo d decimali, senza zeri inutili in fondo
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const R = Math.round;

export class Spring extends Sim {
  static tall = true;
  static controls = {
    m: { label: 'Massa', min: 0.1, max: 2, step: 0.1, unit: 'kg' },
    k: { label: 'Durezza della molla', min: 5, max: 80, step: 5, unit: 'N/m' },
    A: { label: 'Quanto la tiri', min: 2, max: 10, step: 1, unit: 'cm' },
    w: { label: 'Pesi appesi', min: 0, max: 300, step: 50, unit: 'g' },
    attrito: { label: 'Attrito', type: 'toggle' },
    luna: { label: 'Sulla Luna', type: 'toggle' },
  };

  defaults() { return { mode: 'oscilla', m: 0.5, k: 20, A: 6, w: 100, attrito: false, luna: false, lens: 's' }; }

  init() {
    this.u = 0;
    this.trace = [];   // [t, spostamento] per il foglio
    this.marks = [];   // istanti in cui finisce ogni oscillazione
    this.lastS = -1;
  }

  // quanto dura la prova, in secondi di simulazione
  get dur() {
    const p = this.params;
    if (p.mode === 'oscilla') return 3 * period(p.m, p.k);
    if (p.mode === 'energia') return 3 * period(M_E, K_E);
    if (p.mode === 'cavallino') return 4;
    if (p.mode === 'luna') return 6;
    if (p.mode === 'ombra') return 2 * period(p.m, 20);
    return 2.6;
  }

  // lo spostamento dall'equilibrio (in unità di A) al tempo t, per un oscillatore di periodo T, smorzato se serve
  osc(t, T, damp = 0) { return Math.exp(-damp * t) * Math.cos((TWO_PI * t) / T); }

  step() {
    const p = this.params;
    this.u = clamp01(this.t / this.dur);
    if (p.mode === 'oscilla' && this.t - this.lastS >= 0.012) {
      this.lastS = this.t;
      const T = period(p.m, p.k);
      this.trace.push([this.t, this.osc(this.t, T)]);
      const n = Math.floor(this.t / T);
      if (n > this.marks.length) this.marks.push(n * T);
    }
    if (this.t >= this.dur) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'hooke') { const x = stretch(p.w, p.k) * 100; return this.finish({ w: p.w, k: p.k, F: (p.w / 1000) * G, x }); }
    if (p.mode === 'energia') {
      const E0 = 0.5 * K_E * (p.A / 100) ** 2, Eend = p.attrito ? E0 * Math.exp(-2 * GAMMA * this.dur) : E0;
      return this.finish({ A: p.A, E0, Eend, heat: E0 - Eend });
    }
    if (p.mode === 'cavallino') return this.finish({ k: p.k, m: p.m, T: period(p.m, p.k) });
    if (p.mode === 'luna') return this.finish({ luna: !!p.luna, Tp: pendulumT(1, p.luna ? G_MOON : G), Tm: period(1, 10) });
    if (p.mode === 'ombra') return this.finish({ m: p.m, T: period(p.m, 20) });
    const T = period(p.m, p.k);
    this.finish({ m: p.m, k: p.k, A: p.A, T, f: 1 / T });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'hooke') this.drawHooke();
    else if (m === 'energia') this.drawEnergy();
    else if (m === 'cavallino') this.drawRider();
    else if (m === 'luna') this.drawMoon();
    else if (m === 'ombra') this.drawShadow();
    else this.drawOsc();
  }

  get live() { return this.running || !!this.result; }

  // una molla a zigzag fra (x, y0) e (x, y1), larga w; orizzontale se h è vero (allora va da x0 a x1 alla quota y)
  coil(x, y0, y1, w = 11, n = 12, col) {
    const L = y1 - y0 - 12, pts = [[x, y0], [x, y0 + 6]];
    for (let i = 0; i < n; i++) pts.push([x + (i % 2 ? -w : w), y0 + 6 + (L * (i + 0.5)) / n]);
    pts.push([x, y1 - 6], [x, y1]);
    this.line(pts, { color: col || this.c('chalk'), width: 2 });
  }

  coilH(x0, x1, y, h = 10, n = 12, col) {
    const L = x1 - x0 - 12, pts = [[x0, y], [x0 + 6, y]];
    for (let i = 0; i < n; i++) pts.push([x0 + 6 + (L * (i + 0.5)) / n, y + (i % 2 ? -h : h)]);
    pts.push([x1 - 6, y], [x1, y]);
    this.line(pts, { color: col || this.c('chalk'), width: 2 });
  }

  // un blocco (centro x, y; lato s) con una scritta
  block(x, y, s, label, col = 'sky') {
    const g = this.ctx;
    g.save(); g.fillStyle = this.c(col); g.globalAlpha = 0.25; g.fillRect(x - s / 2, y - s / 2, s, s); g.restore();
    this.line([[x - s / 2, y - s / 2], [x + s / 2, y - s / 2], [x + s / 2, y + s / 2], [x - s / 2, y + s / 2], [x - s / 2, y - s / 2]], { color: this.c(col), width: 2.2 });
    if (label) this.text(label, x, y + 4, { size: 11, align: 'center', weight: 700, color: this.c('chalk'), mono: true });
  }

  // ---------- la legge di Hooke ----------
  drawHooke() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const top = H * 0.14, cx = W * 0.3, L0 = H * 0.2, s = (H * 0.42) / 0.3; // pixel per metro: 30 cm di righello
    const xEq = stretch(p.w, p.k), om = p.w > 0 ? Math.sqrt(p.k / (p.w / 1000)) : 1;
    const t = this.live ? (this.result ? 99 : this.t) : 0;
    const x = this.live ? xEq * (1 - Math.exp(-2.2 * t) * Math.cos(om * t)) : 0;
    this.ground(top, { x0: cx - 50, x1: cx + 50, up: true });
    const yEnd = top + L0 + x * s;
    this.coil(cx, top, yEnd, 11, 14);
    // il gancio e i pesi da 50 g, uno sopra l'altro
    this.line([[cx, yEnd], [cx, yEnd + 10]], { color: this.c('chalk'), width: 2 });
    const n = R(p.w / 50);
    for (let i = 0; i < n; i++) { const y = yEnd + 12 + i * 9; g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.35; g.fillRect(cx - 16, y, 32, 7); g.restore(); this.line([[cx - 16, y], [cx + 16, y], [cx + 16, y + 7], [cx - 16, y + 7], [cx - 16, y]], { color: this.c('sun'), width: 1.4 }); }
    // il righello: lo zero è la fine della molla scarica
    const rx = cx + 42, y0 = top + L0;
    this.line([[rx, y0 - 6], [rx, y0 + 0.3 * s]], { color: this.c('muted'), width: 1.6 });
    for (let c = 0; c <= 30; c++) { const y = y0 + (c / 100) * s; this.line([[rx, y], [rx + (c % 5 ? 5 : 10), y]], { color: this.c('muted'), width: 1.1 }); if (c % 10 === 0) this.text(`${c} cm`, rx + 13, y + 4, { size: 9.5, color: this.c('muted'), mono: true }); }
    this.line([[cx + 14, yEnd], [rx - 2, yEnd]], { color: this.c('coral'), width: 1.6, dash: [3, 3] });
    // il grafico forza–allungamento: la retta di questa molla e il punto di adesso
    const gx0 = W * 0.68, gx1 = W - 14, gy0 = H * 0.2, gy1 = H * 0.62;
    const X = (cm) => gx0 + (cm / 30) * (gx1 - gx0), Y = (F) => gy1 - (F / 3) * (gy1 - gy0);
    this.line([[gx0, gy0 - 6], [gx0, gy1], [gx1, gy1]], { color: this.c('muted'), width: 1.4 });
    this.text(E ? i18n('peso') : 'F (N)', gx0 + 4, gy0 - 10, { size: 10, color: this.c('muted'), mono: !E });
    this.text(E ? i18n('allungamento (cm)') : 'x (cm)', gx1, gy1 + 30, { size: 10, align: 'right', color: this.c('muted'), mono: !E });
    for (const F of [1, 2, 3]) { this.line([[gx0 - 4, Y(F)], [gx0, Y(F)]], { color: this.c('muted'), width: 1.1 }); if (!E) this.text(String(F), gx0 - 7, Y(F) + 4, { size: 9.5, align: 'right', color: this.c('muted'), mono: true }); }
    for (const c of [10, 20, 30]) { this.line([[X(c), gy1], [X(c), gy1 + 4]], { color: this.c('muted'), width: 1.1 }); this.text(String(c), X(c), gy1 + 15, { size: 9.5, align: 'center', color: this.c('muted'), mono: true }); }
    if (this.result) {
      const cMax = Math.min(30, (3 / p.k) * 100);
      this.line([[X(0), Y(0)], [X(cMax), Y((cMax / 100) * p.k)]], { color: this.c('coral'), width: 1.6, dash: [5, 4], alpha: 0.8 });
    }
    if (this.live && p.w > 0) this.ball(X(x * 100), Y((p.w / 1000) * G * clamp01(x / (xEq || 1))), 4.5, { color: this.c('coral'), fill: 1, width: 1.5, shine: false });
    const rows = [[E ? i18n('Pesi appesi: {m} grammi', { m: p.w }) : i18n('m = {m} g, F = {F} N, k = {k} N/m', { m: p.w, F: nice((p.w / 1000) * G, 2), k: p.k }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('la molla si allunga di {x} centimetri', { x: nice(this.result.x, 1) }) : i18n('x = {x} cm: la forza è proporzionale all’allungamento', { x: nice(this.result.x, 1) }), this.c('coral'), 700]);
    }
    this.box(rows);
  }

  // ---------- il peso che oscilla ----------
  drawOsc() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const T = period(p.m, p.k), top = H * 0.12, cx = W * 0.22, yEq = H * 0.42, s = H * 0.011; // pixel per centimetro
    const d = this.live ? (this.result ? this.osc(this.dur, T) : this.osc(this.t, T)) : 1;
    const y = yEq + d * p.A * s, side = 30 + 14 * Math.cbrt(p.m);
    this.ground(top, { x0: cx - 46, x1: cx + 46, up: true });
    this.coil(cx, top, y - side / 2, 12, 14);
    this.block(cx, y, side, `${nice(p.m, 1)} kg`);
    this.line([[cx - side / 2 - 12, yEq], [cx + side / 2 + 12, yEq]], { color: this.c('edge'), width: 1.2, dash: [4, 5] });
    // il foglio che scorre verso destra: la penna è attaccata al peso
    const px = cx + side / 2 + 26, x1 = W - 12, fy0 = yEq - 12 * s - 6, fy1 = yEq + 12 * s + 6, vp = (x1 - px) / (2.2 * T);
    g.save(); g.strokeStyle = this.c('edge'); g.lineWidth = 1.5; g.beginPath(); g.roundRect(px, fy0, x1 - px, fy1 - fy0, 10); g.stroke();
    g.beginPath(); g.roundRect(px, fy0, x1 - px, fy1 - fy0, 10); g.clip();
    this.line([[px, yEq], [x1, yEq]], { color: this.c('edge'), width: 1, dash: [4, 6] });
    const xAt = (t) => px + (this.t - t) * vp;
    this.marks.forEach((tm, i) => { const xx = xAt(tm); if (xx > x1) return; this.line([[xx, fy0], [xx, fy1]], { color: this.c('sun'), width: 1.2, dash: [2, 5], alpha: 0.6 }); this.text(String(i + 1), xx + 3, fy0 + 12, { size: 10, color: this.c('sun'), mono: true }); });
    const pts = this.trace.map(([t, v]) => [xAt(t), yEq + v * p.A * s]).filter(([xx]) => xx <= x1 + 4);
    if (this.live) pts.push([px, y]);
    if (pts.length > 1) this.line(pts, { color: this.c('sky'), width: 2.2 });
    g.restore();
    this.line([[cx + side / 2, y], [px, y]], { color: this.c('sky'), width: 1.2, dash: [2, 4], alpha: 0.6 });
    this.ball(px, y, 4, { color: this.c('sky'), fill: 1, width: 1, shine: false });
    const n = this.marks.length;
    const rows = [[E ? i18n('Peso da {m} kg, tirato giù di {A} cm', { m: nice(p.m, 1), A: p.A }) : i18n('m = {m} kg, k = {k} N/m, A = {A} cm', { m: nice(p.m, 1), k: p.k, A: p.A }), this.c('chalk'), 700]];
    if (this.live) rows.push([i18n('tempo: {t} s, oscillazioni: {n}', { t: fmt(this.result ? this.dur : this.t, 1), n }), this.c('muted'), 600]);
    if (this.result) rows.push([E ? i18n('un’oscillazione dura {T} secondi', { T: nice(T, 1) }) : i18n('T = {T} s, f = {f} Hz', { T: nice(T, 2), f: nice(1 / T, 2) }), this.c('sun'), 700]);
    this.box(rows);
  }

  // ---------- l'energia che va e viene ----------
  drawEnergy() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const T = period(M_E, K_E), damp = p.attrito ? GAMMA : 0, t = this.live ? (this.result ? this.dur : this.t) : 0;
    const d = this.live ? this.osc(t, T, damp) : 1, xm = (p.A / 100) * d;
    const v = this.live ? -(p.A / 100) * Math.exp(-damp * t) * ((TWO_PI / T) * Math.sin((TWO_PI * t) / T) + damp * Math.cos((TWO_PI * t) / T)) : 0;
    const Eel = 0.5 * K_E * xm * xm, Ek = 0.5 * M_E * v * v, E0 = 0.5 * K_E * (p.A / 100) ** 2, heat = Math.max(0, E0 - Eel - Ek);
    // la guida, il muro e la molla con il blocco; tratteggiato, l'equilibrio
    const wx = 22, yT = H * 0.4, xEq = W * 0.55, s = W * 0.028, side = 40, bx = xEq + xm * 100 * s;
    this.ground(yT + side / 2, { x0: 12, x1: W - 12 });
    this.line([[wx, yT - side], [wx, yT + side / 2]], { color: this.c('chalk'), width: 4 });
    this.coilH(wx, bx - side / 2, yT, 11, 14);
    this.block(bx, yT, side, '1 kg');
    this.line([[xEq, yT - side / 2 - 14], [xEq, yT + side / 2]], { color: this.c('edge'), width: 1.2, dash: [4, 5] });
    if (p.attrito && this.running) for (let i = 0; i < 3; i++) this.line([[bx - 12 + i * 12, yT + side / 2 + 4], [bx - 14 + i * 12, yT + side / 2 + 10]], { color: this.c('coral'), width: 1.6, alpha: 0.7 });
    // le barre dell'energia: elastica, cinetica e calore, che insieme fanno sempre lo stesso
    const by = H - 40, bh = H * 0.32, bw = Math.min(46, W * 0.13), gap = bw + 22, b0 = W / 2 - gap - bw / 2;
    const bar = (x, val, col, name) => {
      const hh = E0 > 0 ? (val / E0) * bh : 0;
      g.save(); g.fillStyle = this.c(col); g.globalAlpha = 0.35; g.fillRect(x, by - hh, bw, hh); g.restore();
      this.line([[x, by], [x, by - hh], [x + bw, by - hh], [x + bw, by]], { color: this.c(col), width: 2 });
      this.text(name, x + bw / 2, by + 16, { size: 10.5, align: 'center', weight: 700, color: this.c(col) });
      if (!E) this.text(`${R(val * 1000)} mJ`, x + bw / 2, by - hh - 6, { size: 10, align: 'center', color: this.c(col), mono: true });
    };
    this.line([[b0 - 10, by], [b0 + 2 * gap + bw + 10, by]], { color: this.c('muted'), width: 1.4 });
    bar(b0, Eel, 'mint', i18n('elastica'));
    bar(b0 + gap, Ek, 'orange', i18n('movimento'));
    bar(b0 + 2 * gap, heat, 'coral', i18n('calore'));
    const rows = [[E ? i18n('Molla tirata di {A} cm', { A: p.A }) : i18n('1 kg, k = 40 N/m, tirata di {A} cm: E = {E} mJ', { A: p.A, E: R(E0 * 1000) }), this.c('chalk'), 700]];
    if (this.result) rows.push(p.attrito ? [E ? i18n('con l’attrito l’oscillazione si spegne: l’energia diventa calore') : i18n('dopo 3 oscillazioni: {h} mJ sono diventati calore', { h: R(this.result.heat * 1000) }), this.c('coral'), 700] : [E ? i18n('senza attrito l’energia va e viene, sempre la stessa') : i18n('senza attrito l’energia totale resta {E} mJ', { E: R(E0 * 1000) }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- il cavallino a molla ----------
  drawRider() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const T = period(p.m, p.k), t = this.live ? (this.result ? this.dur : this.t) : 0, d = this.live ? -Math.sin((TWO_PI * t) / T) : 0;
    const gy = H - 50, cx = W * 0.42, amp = 16, ySeat = gy - H * 0.36 + d * amp;
    this.ground(gy, { color: this.c('green') });
    // la base, la molla grossa e il cavallino con il bambino sopra
    this.line([[cx - 30, gy], [cx + 30, gy]], { color: this.c('muted'), width: 6 });
    this.coil(cx, ySeat + 26, gy - 3, 18, 10, this.c('sun'));
    const hx = cx, hy = ySeat + 10, or = this.c('orange');
    g.save(); g.beginPath(); g.ellipse(hx, hy + 4, 34, 13, 0, 0, 7); g.fillStyle = or; g.globalAlpha = 0.22; g.fill(); g.globalAlpha = 1; g.strokeStyle = or; g.lineWidth = 2.6; g.stroke(); g.restore();
    this.line([[hx + 24, hy - 4], [hx + 34, hy - 28], [hx + 44, hy - 30], [hx + 54, hy - 22], [hx + 50, hy - 16], [hx + 40, hy - 18], [hx + 34, hy + 2]], { color: or, width: 2.6 });
    this.line([[hx + 36, hy - 30], [hx + 38, hy - 38], [hx + 42, hy - 31]], { color: or, width: 2 });
    this.line([[hx + 30, hy - 24], [hx + 24, hy - 14], [hx + 26, hy - 26], [hx + 20, hy - 12]], { color: this.c('sun'), width: 2 });
    this.line([[hx - 33, hy], [hx - 44, hy + 6], [hx - 46, hy + 16]], { color: this.c('sun'), width: 2.4 });
    for (const lx of [-22, -12, 14, 24]) this.line([[hx + lx, hy + 14], [hx + lx + (lx < 0 ? -3 : 3), hy + 26]], { color: or, width: 2.4 });
    this.ball(hx + 46, hy - 24, 1.8, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    // il bambino: testa, busto, braccia alle maniglie
    const kx = hx - 4, ky = hy - 4;
    this.line([[kx, ky], [kx + 2, ky - 26]], { color: this.c('chalk'), width: 2.6 });
    this.ball(kx + 3, ky - 34, 7, { color: this.c('chalk'), fill: 0.2, width: 2.2, shine: false });
    this.line([[kx + 1, ky - 20], [kx + 24, ky - 18]], { color: this.c('chalk'), width: 2.2 });
    this.line([[kx, ky], [kx + 12, ky + 12]], { color: this.c('chalk'), width: 2.2 });
    // la lucina che lampeggia a ogni secondo, e il segno del dondolio più basso
    const lx = W - 42, ly = H * 0.28, blink = this.live && t % 1 < 0.15;
    this.ball(lx, ly, 12, { color: this.c('sun'), fill: blink ? 0.9 : 0.12, width: 2, shine: false });
    this.text(E ? i18n('ogni secondo') : '1 s', lx, ly + 28, { size: 10.5, align: 'center', color: this.c('sun'), weight: 700 });
    const low = this.live && Math.abs(((t / T) % 1) - 0.25) < 0.06;
    if (low) this.ripple(cx, gy - 6, 0.1, { color: this.c('mint'), r0: 10, r1: 40, dur: 0.4 });
    const rows = [[E ? i18n('Cavallino e bambino: {m} kg; molla da {k} N/m', { m: p.m, k: p.k }) : i18n('m = {m} kg, k = {k} N/m', { m: p.m, k: p.k }), this.c('chalk'), 700],
      [E ? i18n('deve fare un dondolio al secondo') : i18n('deve fare un’oscillazione al secondo: T = 1 s'), this.c('sun'), 600]];
    if (this.result) rows.push([E ? i18n('un dondolio dura {T} s', { T: nice(T, 2) }) : i18n('T = {T} s', { T: nice(T, 2) }), Math.abs(T - 1) < 0.03 ? this.c('mint') : this.c('coral'), 700]);
    this.box(rows);
  }

  // ---------- l'ombra di un giro ----------
  drawShadow() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const T = period(p.m, 20), t = this.live ? (this.result ? this.dur : this.t) : 0, ph = (TWO_PI * t) / T;
    const cx = W * 0.27, cy = H * 0.52, r = Math.min(W * 0.17, H * 0.16), sx = W * 0.54, mx = W * 0.8;
    // la lampada a sinistra, la ruota con la pallina, il muro con l'ombra
    this.ball(14, cy, 7, { color: this.c('sun'), fill: 0.9, width: 1.5, shine: false });
    for (let i = -2; i <= 2; i++) this.line([[24, cy + i * r * 0.55], [sx - 6, cy + i * r * 0.55]], { color: this.c('sun'), width: 1, alpha: 0.15 });
    this.ball(cx, cy, r, { color: this.c('muted'), fill: 0.05, width: 1.6, shine: false });
    this.line([[cx, cy], [cx + r * Math.sin(ph), cy + r * Math.cos(ph)]], { color: this.c('muted'), width: 1.4 });
    this.ball(cx, cy, 3, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    const by = cy + r * Math.cos(ph);
    this.ball(cx + r * Math.sin(ph), by, 9, { color: this.c('sky') });
    this.line([[cx + r * Math.sin(ph) + 10, by], [sx, by]], { color: this.c('sun'), width: 1.4, dash: [3, 4], alpha: 0.7 });
    this.line([[sx, cy - r - 30], [sx, cy + r + 30]], { color: this.c('chalk'), width: 3 });
    g.save(); g.fillStyle = this.c('ink'); g.globalAlpha = 0.85; g.beginPath(); g.ellipse(sx + 6, by, 4, 9, 0, 0, 7); g.fill(); g.restore();
    this.ball(sx + 6, by, 6, { color: this.c('muted'), fill: 0.6, width: 1.5, shine: false });
    // la molla a destra, con lo stesso ritmo e la stessa ampiezza
    const top = cy - r - 60, side = 30 + 14 * Math.cbrt(p.m);
    this.ground(top, { x0: mx - 40, x1: mx + 40, up: true });
    this.coil(mx, top, by - side / 2, 11, 12);
    this.block(mx, by, side, `${nice(p.m, 1)} kg`);
    this.line([[sx + 14, by], [mx - side / 2 - 4], [mx - side / 2 - 4, by]].filter((q) => q.length === 2), { color: this.c('sky'), width: 1.2, dash: [2, 5], alpha: 0.6 });
    this.text(E ? i18n('il giro') : i18n('moto circolare'), cx, cy + r + 26, { size: 11, align: 'center', weight: 700, color: this.c('sky') });
    this.text(E ? i18n('l’ombra') : i18n('ombra'), sx, cy + r + 48, { size: 11, align: 'center', weight: 700, color: this.c('muted') });
    this.text(E ? i18n('la molla') : i18n('moto armonico'), mx, cy + r + 26, { size: 11, align: 'center', weight: 700, color: this.c('sky') });
    const rows = [[E ? i18n('Peso da {m} kg sulla molla', { m: nice(p.m, 1) }) : i18n('m = {m} kg, k = 20 N/m: T = {T} s', { m: nice(p.m, 1), T: nice(T, 2) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('un giro della ruota, un’oscillazione della molla') : i18n('un giro, un’oscillazione: stesso periodo'), this.c('sun'), 700]);
    this.box(rows);
  }

  // ---------- pendolo e molla, sulla Terra e sulla Luna ----------
  drawMoon() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const gv = p.luna ? G_MOON : G, Tp = pendulumT(1, gv), Tm = period(1, 10), t = this.live ? (this.result ? this.dur : this.t) : 0;
    const top = H * 0.16, gy = H - 40;
    g.save(); g.fillStyle = this.c(p.luna ? 'muted' : 'sky'); g.globalAlpha = 0.1; g.fillRect(0, gy, W, H - gy); g.restore();
    this.ground(gy, { color: this.c(p.luna ? 'muted' : 'green') });
    this.text(p.luna ? i18n('sulla Luna') : i18n('sulla Terra'), W - 14, gy + 26, { size: 12, align: 'right', weight: 700, color: this.c(p.luna ? 'chalk' : 'sky') });
    // il pendolo da 1 m, a sinistra
    const px = W * 0.27, Lp = H * 0.42, a0 = 0.32, th = this.live ? a0 * Math.cos((TWO_PI * t) / Tp) : a0;
    this.ground(top, { x0: px - 50, x1: px + 50, up: true });
    const bx = px + Lp * Math.sin(th), byy = top + Lp * Math.cos(th);
    this.line([[px, top], [bx, byy]], { color: this.c('chalk'), width: 2 });
    this.ball(bx, byy, 13, { color: this.c('sky') });
    this.text(i18n('pendolo da 1 m'), px, gy - 12, { size: 11, align: 'center', weight: 700, color: this.c('sky') });
    // la molla con 1 kg, a destra: sulla Luna si allunga meno, ma il ritmo è lo stesso
    const mx = W * 0.72, sag = (p.luna ? G_MOON : G) * 7, yEq = top + H * 0.2 + sag, amp = 26, d = this.live ? Math.cos((TWO_PI * t) / Tm) : 1;
    this.ground(top, { x0: mx - 46, x1: mx + 46, up: true });
    const y = yEq + d * amp;
    this.coil(mx, top, y - 17, 12, 14);
    this.block(mx, y, 34, '1 kg', 'orange');
    this.text(i18n('molla con 1 kg'), mx, gy - 12, { size: 11, align: 'center', weight: 700, color: this.c('orange') });
    const np = Math.floor(t / Tp), nm = Math.floor(t / Tm);
    if (this.live) { this.text(i18n('oscillazioni: {n}', { n: np }), px, gy - 30, { size: 11, align: 'center', color: this.c('muted') }); this.text(i18n('oscillazioni: {n}', { n: nm }), mx, gy - 30, { size: 11, align: 'center', color: this.c('muted') }); }
    const rows = [[E ? (p.luna ? i18n('Sulla Luna, dove si pesa sei volte meno') : i18n('Sulla Terra')) : i18n('g = {g} m/s², tempo: {t} s', { g: nice(gv, 2), t: fmt(t, 1) }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('pendolo: un’oscillazione ogni {T} secondi', { T: nice(Tp, 1) }) : i18n('pendolo: T = {T} s', { T: nice(Tp, 2) }), this.c('sky'), 700]);
      rows.push([E ? i18n('molla: un’oscillazione ogni {T} secondi', { T: nice(Tm, 1) }) : i18n('molla: T = {T} s', { T: nice(Tm, 2) }), this.c('orange'), 700]);
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
