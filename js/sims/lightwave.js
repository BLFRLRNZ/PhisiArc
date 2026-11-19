// La luce è un'onda (OT04). Sei modi:
//   - 'young': la luce di un laser passa da due fenditure vicine (distanza d) e arriva su uno schermo a 2 m. Dalle due
//     fenditure partono due onde che si sommano: strisce chiare e scure, una ogni Δy = λ·L/d. Con una fenditura sola
//     (fen = 'una') le strisce spariscono.
//   - 'bolla': una lamina d'acqua e sapone, spessa sp nanometri. La luce riflessa sopra e sotto si somma: alcuni colori
//     si rinforzano, altri si cancellano, I = sin²(2π·n·sp/λ). Sottilissima, la bolla diventa nera.
//   - 'reticolo': la luce bianca su un CD o un DVD: le righe vicinissime aprono i colori a ventaglio, d·sin θ = λ.
//   - 'polar': due filtri polarizzatori. Dopo il primo la luce oscilla in una sola direzione; il secondo, girato di θ,
//     ne lascia passare cos² θ.
//   - 'finestra': la finestra magica del parco, con due filtri: si gira il secondo per far passare la luce chiesta.
//   - 'fessura': un laser rosso e una fenditura larga, stretta o strettissima. Più è stretta, più la luce si allarga
//     dietro: la diffrazione. La luce va dritta solo finché gli ostacoli sono molto più grandi della sua lunghezza d'onda.
// Risultato: young { col, d, fen, dy }; bolla { sp, colore }; reticolo { disco, rosso, viola };
//            polar { theta, luce }; finestra { theta, luce, preso }; fessura { larg, w }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';
import { SPETTRO } from './colors.js';

const RAD = Math.PI / 180, DEG = 180 / Math.PI, L_SCR = 2;
export const LAMBDA = { rossa: 650, verde: 530, blu: 450 };
const HEX = { rossa: [255, 75, 75], verde: [79, 227, 107], blu: [61, 139, 255] };
// la distanza fra due strisce chiare, in millimetri: Δy = λ·L/d (λ in nm, d in mm, L = 2 m)
export const fringe = (lam, d) => (lam * 1e-9 * L_SCR) / (d * 1e-3) * 1e3;
// quanto riflette una lamina d'acqua e sapone (n = 1,33) spessa t nanometri, per la lunghezza d'onda lam
export const film = (t, lam) => Math.sin((2 * Math.PI * 1.33 * t) / lam) ** 2;
const NAME = { 100: 'rosso', '010': 'verde', '001': 'blu', 110: 'giallo', 101: 'magenta', '011': 'ciano', 111: 'bianco' };
export const filmColor = (t) => {
  const c = [film(t, 650), film(t, 530), film(t, 450)], mx = Math.max(...c);
  if (mx < 0.25) return 'nero';
  if (Math.min(...c) > 0.7) return 'bianco';
  return NAME[c.map((x) => (x >= 0.6 * mx ? 1 : 0)).join('')] || 'bianco';
};
export const DISCO = { cd: 1.6, dvd: 0.74 }; // micrometri fra una riga e l'altra
export const malus = (th) => 100 * Math.cos(th * RAD) ** 2;
export const WIDTH = { 2: 2, 0.5: 2 * 650e-9 * L_SCR / 0.5e-3 * 1e3, 0.1: 2 * 650e-9 * L_SCR / 0.1e-3 * 1e3 };
// i sette colori del Prisma, con le loro lunghezze d'onda in nanometri
const RAINBOW = SPETTRO.map((s, i) => [[700, 620, 580, 530, 470, 440, 400][i], s.c]);
const DUR = { young: 1.6, bolla: 1.2, reticolo: 1.4, polar: 1.2, finestra: 1.2, fessura: 1.6 };
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };

export class LightWave extends Sim {
  static tall = true;
  static controls = {
    col: { label: 'La luce', type: 'select', options: [['rossa', 'rossa'], ['verde', 'verde'], ['blu', 'blu']] },
    d: { label: 'Distanza fra le fenditure', min: 0.2, max: 0.6, step: 0.1, unit: 'mm' },
    sp: { label: 'Spessore della bolla', min: 20, max: 600, step: 20, unit: 'nm' },
    disco: { label: 'Il disco', type: 'select', options: [['cd', 'CD'], ['dvd', 'DVD']] },
    theta: { label: 'Angolo del secondo filtro', min: 0, max: 90, step: 1, unit: '°' },
    larg: { label: 'La fenditura', type: 'select', options: [['2', 'larga'], ['0.5', 'stretta'], ['0.1', 'strettissima']] },
  };

  defaults() { return { mode: 'young', col: 'rossa', d: 0.3, fen: 'due', sp: 300, disco: 'cd', theta: 0, frac: 50, larg: '2', lens: 's' }; }

  get dur() { return DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params;
    switch (p.mode) {
      case 'bolla': return this.finish({ sp: p.sp, colore: filmColor(p.sp) });
      case 'reticolo': { const d = DISCO[p.disco] || 1.6; return this.finish({ disco: p.disco, rosso: Math.round(Math.asin(0.7 / d) * DEG), viola: Math.round(Math.asin(0.4 / d) * DEG) }); }
      case 'polar': return this.finish({ theta: p.theta, luce: Math.round(malus(p.theta)) });
      case 'finestra': { const goal = Math.acos(Math.sqrt(p.frac / 100)) * DEG; return this.finish({ theta: p.theta, luce: Math.round(malus(p.theta)), preso: Math.abs(p.theta - goal) <= 2 }); }
      case 'fessura': return this.finish({ larg: Number(p.larg), w: Math.round((WIDTH[p.larg] ?? 2) * 10) / 10 });
      default: return this.finish({ col: p.col, d: p.d, fen: p.fen, dy: Math.round(fringe(LAMBDA[p.col] || 650, p.d) * 100) / 100 });
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'bolla') this.drawFilm();
    else if (m === 'reticolo') this.drawGrating();
    else if (m === 'polar' || m === 'finestra') this.drawPolar(m === 'finestra');
    else if (m === 'fessura') this.drawSlit();
    else this.drawYoung();
  }

  box(rows) {
    if (!rows.length) return;
    const g = this.ctx;
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }

  // lo schermo visto di fronte: una striscia verticale, riga per riga con l'intensità I(y) tra 0 e 1
  screen(x, y0, y1, w, rgb, I) {
    const g = this.ctx;
    for (let y = Math.floor(y0); y < y1; y++) {
      const k = clamp01(I(y + 0.5));
      g.fillStyle = `rgb(${Math.round(rgb[0] * k)},${Math.round(rgb[1] * k)},${Math.round(rgb[2] * k)})`;
      g.fillRect(x, y, w, 1);
    }
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.5; g.strokeRect(x, y0, w, y1 - y0); g.restore();
  }

  laser(x, y, rgb) {
    const g = this.ctx;
    g.save(); g.fillStyle = this.c('edge'); g.fillRect(x - 14, y - 7, 22, 14); g.fillStyle = `rgb(${rgb.join(',')})`; g.globalAlpha = this.live ? 1 : 0.4; g.fillRect(x + 8, y - 3, 4, 6); g.restore();
  }

  // ---------- le due fenditure di Young ----------
  drawYoung() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, one = p.fen === 'una';
    const yc = H * 0.5, xb = W * 0.26, xs = W * 0.64, Ls = xs - xb, rgb = HEX[p.col] || HEX.rossa, lam = LAMBDA[p.col] || 650;
    const wl = (lam / 650) * 15, dd = 24 + (80 * (p.d - 0.2)) / 0.4, slits = one ? [yc - dd / 2] : [yc - dd / 2, yc + dd / 2];
    const col = `rgb(${rgb.join(',')})`, top = H * 0.16, bot = H * 0.86;
    this.laser(16, yc, rgb);
    // l'onda piana che arriva, e la parete con le fenditure
    if (this.live) {
      g.save(); g.strokeStyle = col; g.globalAlpha = 0.55; g.lineWidth = 1.4;
      for (let x = 30; x < xb; x += wl) { g.beginPath(); g.moveTo(x, yc - dd / 2 - 26); g.lineTo(x, yc + dd / 2 + 26); g.stroke(); }
      g.restore();
    }
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 5; g.beginPath();
    let y = top; [...slits].forEach((s) => { g.moveTo(xb, y); g.lineTo(xb, s - 3); y = s + 3; });
    g.moveTo(xb, y); g.lineTo(xb, bot); g.stroke(); g.restore();
    // le onde circolari che partono da ogni fenditura, fino allo schermo
    if (this.live) {
      g.save(); g.beginPath(); g.rect(xb + 2, top, Ls - 2, bot - top); g.clip();
      g.strokeStyle = col; g.globalAlpha = 0.45; g.lineWidth = 1.3;
      slits.forEach((s) => { for (let r = wl; r < Ls * 1.3 * u; r += wl) { g.beginPath(); g.arc(xb, s, r, -Math.PI / 2, Math.PI / 2); g.stroke(); } });
      g.restore();
    }
    this.line([[xs, top], [xs, bot]], { color: this.c('chalk'), width: 3 });
    // lo schermo visto di fronte: strisce chiare e scure (o una macchia sola)
    // sullo schermo vero gli angoli sono piccolissimi: le strisce sono equidistanti, una ogni Δy (qui 10 px per millimetro)
    const fy = fringe(lam, p.d) * 10;
    const I = (yy) => {
      const dy = yy - yc, env = Math.exp(-(dy * dy) / (2 * (H * 0.24) ** 2));
      return one ? env : env * Math.cos((Math.PI * dy) / fy) ** 2;
    };
    const sx = W * 0.72, sw = W - 14 - sx;
    if (this.live && u >= 1) this.screen(sx, top, bot, sw, rgb, I);
    else { g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.5; g.strokeRect(sx, top, sw, bot - top); g.restore(); }
    this.text(i18n('sullo schermo'), sx + sw / 2, bot + 16, { size: 10.5, align: 'center', color: this.c('muted') });
    const dy = fringe(lam, p.d), name = i18n(p.col);
    const rows = [[E ? (one ? i18n('Una fenditura sola, luce {c}', { c: name }) : i18n('Due fenditure, luce {c}', { c: name }))
      : one ? i18n('una fenditura, λ = {l} nm', { l: lam }) : i18n('λ = {l} nm, d = {d} mm, schermo a 2 m', { l: lam, d: nice(p.d, 1) }), this.c('chalk'), 700]];
    if (this.result) rows.push([one ? (E ? i18n('una macchia di luce, senza strisce') : i18n('nessuna interferenza: niente strisce'))
      : E ? i18n('strisce chiare e scure, una ogni {y} millimetri', { y: Math.max(1, Math.round(dy)) }) : i18n('Δy = λ·L/d = {y} mm', { y: nice(dy, 2) }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- i colori delle bolle ----------
  drawFilm() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const R = Math.min(W * 0.27, H * 0.24), cx = W * 0.32, cy = H * 0.46, t0 = p.sp;
    const rgbAt = (t) => [film(t, 650), film(t, 530), film(t, 450)];
    const show = this.live ? clamp01(u) : 0.15;
    // la lamina nell'anello: in alto è più sottile, in basso più spessa (l'acqua scende)
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 2 * Math.PI); g.clip();
    for (let y = cy - R; y < cy + R; y++) {
      const t = Math.max(0, t0 * (1 + (0.8 * (y - cy)) / R)), c = rgbAt(t);
      g.fillStyle = `rgba(${Math.round(255 * c[0])},${Math.round(255 * c[1])},${Math.round(255 * c[2])},${show})`;
      g.fillRect(cx - R, y, 2 * R, 1);
    }
    g.restore();
    this.ball(cx, cy, R, { color: this.c('chalk'), fill: 0, width: 3, shine: false });
    this.line([[cx, cy + R], [cx, cy + R + 50]], { color: this.c('chalk'), width: 4 });
    // la riga a metà: lì lo spessore è sp
    this.line([[cx - R - 8, cy], [cx - R + 6, cy]], { color: this.c('sun'), width: 2 });
    // a destra, la lamina vista di taglio: due riflessioni, sopra e sotto
    const x0 = W * 0.66, x1 = W - 14, th = Math.max(4, Math.min(70, t0 / 7)), ytop = H * 0.3;
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.25; g.fillRect(x0, ytop, x1 - x0, th); g.restore();
    this.line([[x0, ytop], [x1, ytop]], { color: this.c('sky'), width: 1.5 }); this.line([[x0, ytop + th], [x1, ytop + th]], { color: this.c('sky'), width: 1.5 });
    const xa = x0 + 14, xh = xa + 26;
    this.line([[xa - 8, ytop - 40], [xh, ytop]], { color: this.c('chalk'), width: 2, upto: this.live ? 1 : 0.6 });
    if (this.live) {
      this.line([[xh, ytop], [xh + 30, ytop - 34]], { color: this.c('chalk'), width: 1.6, upto: u });
      this.line([[xh, ytop], [xh + 10, ytop + th], [xh + 20, ytop], [xh + 50, ytop - 34]], { color: this.c('chalk'), width: 1.6, alpha: 0.7, upto: u });
    }
    // quanto si rinforza ogni colore
    const c = rgbAt(t0), by = ytop + th + 90, bw = (x1 - x0 - 20) / 3;
    [['#ff4b4b', c[0]], ['#4fe36b', c[1]], ['#3d8bff', c[2]]].forEach(([k, v], i) => {
      const bx = x0 + 5 + i * (bw + 5), hh = 60 * v * show;
      g.save(); g.fillStyle = k; g.fillRect(bx, by - hh, bw, hh); g.strokeStyle = this.c('edge'); g.strokeRect(bx, by - 60, bw, 60); g.restore();
    });
    this.text(i18n('luce riflessa'), (x0 + x1) / 2, by + 15, { size: 10.5, align: 'center', color: this.c('muted') });
    const name = filmColor(t0);
    const rows = [[E ? i18n('Bolla spessa {s} nanometri', { s: t0 }) : i18n('lamina di acqua e sapone, spessa {s} nm', { s: t0 }), this.c('chalk'), 700]];
    if (this.result) rows.push([name === 'nero' ? (E ? i18n('è così sottile che diventa nera!') : i18n('quasi nessun colore riflesso: nera')) : name === 'bianco' ? (E ? i18n('riflette quasi tutti i colori') : i18n('quasi tutti i colori riflessi: chiara'))
      : E ? i18n('riflette soprattutto il {c}', { c: i18n(name) }) : i18n('colore riflesso: {c}', { c: i18n(name) }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'arcobaleno del CD ----------
  drawGrating() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, d = DISCO[p.disco] || 1.6;
    const yc = H * 0.52, xg = W * 0.3, R = Math.min(W - xg - 14, H * 0.4);
    this.laser(16, yc, [240, 240, 240]);
    if (this.live) this.line([[24, yc], [xg, yc]], { color: this.c('chalk'), width: 3, upto: clamp01(u * 2) });
    // il disco, visto di taglio, con le sue righe fittissime
    this.line([[xg, yc - H * 0.2], [xg, yc + H * 0.2]], { color: this.c('muted'), width: 4 });
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1; g.globalAlpha = 0.7;
    for (let y = yc - H * 0.2; y < yc + H * 0.2; y += p.disco === 'dvd' ? 3 : 5) { g.beginPath(); g.moveTo(xg - 3, y); g.lineTo(xg + 3, y); g.stroke(); }
    g.restore();
    const u2 = clamp01(u * 2 - 1);
    if (u2 > 0) {
      this.line([[xg, yc], [xg + R, yc]], { color: this.c('chalk'), width: 2.2, upto: u2, alpha: 0.8 });
      RAINBOW.forEach(([lam, c]) => {
        const s = lam / 1000 / d; if (s >= 1) return;
        const a = Math.asin(s);
        [-1, 1].forEach((k) => this.line([[xg, yc], [xg + R * Math.cos(a), yc + k * R * Math.sin(a)]], { color: c, width: 2, upto: u2 }));
      });
    }
    const ar = Math.round(Math.asin(0.7 / d) * DEG), av = Math.round(Math.asin(0.4 / d) * DEG);
    const rows = [[E ? (p.disco === 'dvd' ? i18n('Un DVD: righe ancora più vicine') : i18n('Un CD: righe vicinissime')) : p.disco === 'dvd' ? i18n('DVD: righe ogni 0,74 µm') : i18n('CD: righe ogni 1,6 µm'), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? (p.disco === 'dvd' ? i18n('i colori si aprono ancora di più!') : i18n('la luce bianca si apre nei colori')) : i18n('rosso a {r}°, violetto a {v}°: d·sin θ = λ', { r: ar, v: av }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- i filtri polarizzatori ----------
  drawPolar(windowMode) {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const yc = H * 0.44, x1 = W * 0.3, x2 = W * 0.58, xe = W - 20, rf = Math.min(46, H * 0.1), th = p.theta * RAD;
    const I = malus(p.theta) / 100, lit = this.live ? clamp01(u) : 0;
    this.ball(20, yc, 10, { color: this.c('sun'), fill: this.live ? 0.9 : 0.3, width: 2, shine: false });
    // il fascio: prima dei filtri pieno, dopo il primo a metà, dopo il secondo come cos² θ
    g.save(); g.fillStyle = this.c('sun');
    g.globalAlpha = 0.35 * lit; g.fillRect(30, yc - 8, x1 - 30, 16);
    g.globalAlpha = 0.22 * lit; g.fillRect(x1, yc - 8, x2 - x1, 16);
    g.globalAlpha = 0.22 * lit * I; g.fillRect(x2, yc - 8, xe - x2, 16);
    g.restore();
    // le oscillazioni: in tutte le direzioni, poi solo in su e in giù, poi lungo il secondo filtro e più piccole
    if (this.live) {
      const amp = 16 * lit;
      for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 4; this.line([[55 - amp * Math.sin(a), yc - amp * Math.cos(a)], [55 + amp * Math.sin(a), yc + amp * Math.cos(a)]], { color: this.c('sun'), width: 1.8 }); }
      const wave = (xa, xb, A, ph) => { const pts = []; for (let x = xa; x <= xb; x += 3) pts.push([x, yc - A * Math.sin((x - xa) / 7 + ph)]); this.line(pts, { color: this.c('sun'), width: 1.8 }); };
      wave(x1 + rf * 0.4, x2 - rf * 0.4, amp, this.clock * 4);
      if (I > 0.01) wave(x2 + rf * 0.4, xe - 6, amp * Math.cos(th), this.clock * 4);
    }
    // i filtri, visti di fronte, con le loro righe
    const filt = (x, a, label) => {
      g.save(); g.beginPath(); g.arc(x, yc, rf, 0, 2 * Math.PI); g.fillStyle = this.c('muted'); g.globalAlpha = 0.18; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.stroke();
      g.clip(); g.strokeStyle = this.c('chalk'); g.globalAlpha = 0.55; g.lineWidth = 1.2;
      for (let k = -rf; k <= rf; k += 7) { const ca = Math.cos(a), sa = Math.sin(a); g.beginPath(); g.moveTo(x + k * ca - rf * sa, yc + k * sa + rf * ca); g.lineTo(x + k * ca + rf * sa, yc + k * sa - rf * ca); g.stroke(); }
      g.restore();
      this.text(label, x, yc + rf + 16, { size: 10.5, align: 'center', color: this.c('muted') });
    };
    filt(x1, 0, i18n('primo filtro'));
    filt(x2, th, i18n('secondo filtro'));
    // dove arriva la luce: un occhio, o la finestra della stanza
    if (windowMode) {
      const wx = xe - 46, wy = H * 0.62, ww = 52, wh = 64;
      g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.05 + 0.85 * I * lit; g.fillRect(wx, wy, ww, wh); g.restore();
      g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 3; g.strokeRect(wx, wy, ww, wh); g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke(); g.restore();
      this.text(i18n('la stanza'), wx + ww / 2, wy + wh + 16, { size: 10.5, align: 'center', color: this.c('muted') });
    }
    // il misuratore di luce, in basso
    const mx = 24, my = H - 46, mw = W - 48;
    g.save(); g.strokeStyle = this.c('edge'); g.lineWidth = 2; g.strokeRect(mx, my, mw, 14); g.fillStyle = this.c('sun'); g.fillRect(mx, my, mw * I * lit, 14); g.restore();
    if (windowMode) { const gx = mx + (mw * p.frac) / 100; this.line([[gx, my - 6], [gx, my + 20]], { color: this.c('mint'), width: 2.5 }); }
    this.text(i18n('luce dopo il secondo filtro'), mx, my - 8, { size: 10.5, color: this.c('muted') });
    const pc = Math.round(malus(p.theta));
    const rows = [];
    if (windowMode) rows.push([E ? i18n('Obiettivo: far passare il {f}% della luce', { f: p.frac }) : i18n('obiettivo: il {f}% della luce', { f: p.frac }), this.c('mint'), 700]);
    rows.push([E ? i18n('Il secondo filtro è girato di {t} gradi', { t: p.theta }) : i18n('filtri a {t}° l’uno dall’altro', { t: p.theta }), this.c('chalk'), windowMode ? 500 : 700]);
    if (this.result) rows.push([E ? i18n('passa il {p}% della luce', { p: pc }) : i18n('I = I₀ · cos² {t}° = {p}%', { t: p.theta, p: nice(malus(p.theta), 1) }), this.c('sun'), 700]);
    this.box(rows);
  }

  // ---------- la luce dietro una fenditura stretta ----------
  drawSlit() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const a = Number(p.larg) || 2, yc = H * 0.5, xb = W * 0.28, xs = W * 0.64, rgb = HEX.rossa, col = `rgb(${rgb.join(',')})`;
    // una scala sola, 6 px per millimetro, per la fenditura, il fascio e lo schermo (le fenditure sottili restano visibili)
    const k = 6, half = Math.max(1, (a / 2) * k), wmm = WIDTH[p.larg] ?? 2;
    const spread = Math.max(half, (wmm / 2) * k), top = H * 0.16, bot = H * 0.86;
    this.laser(16, yc, rgb);
    // lo stesso laser ogni volta: un fascio largo poco meno di 3 mm, che la fenditura taglia
    if (this.live) { g.save(); g.fillStyle = col; g.globalAlpha = 0.75; g.fillRect(26, yc - 8, (xb - 26) * clamp01(u * 2), 16); g.restore(); }
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 5; g.beginPath(); g.moveTo(xb, top); g.lineTo(xb, yc - half); g.moveTo(xb, yc + half); g.lineTo(xb, bot); g.stroke(); g.restore();
    // dietro la fenditura: dritto se è larga, a ventaglio se è stretta
    const u2 = clamp01(u * 2 - 1);
    if (u2 > 0) {
      g.save(); g.fillStyle = col; g.globalAlpha = 0.35 * u2; g.beginPath(); g.moveTo(xb, yc - half); g.lineTo(xb + (xs - xb) * u2, yc - half - (spread - half) * u2); g.lineTo(xb + (xs - xb) * u2, yc + half + (spread - half) * u2); g.lineTo(xb, yc + half); g.closePath(); g.fill(); g.restore();
    }
    this.line([[xs, top], [xs, bot]], { color: this.c('chalk'), width: 3 });
    // lo schermo visto di fronte
    const sinc = (x) => (Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x);
    // larga: una macchia larga quanto la fenditura; stretta: la figura di diffrazione (in ampiezza, perché le strisce
    // laterali, deboli, si vedano)
    const I = (y) => {
      const mm = (y - yc) / k;
      if (p.larg === '2') return clamp01(1 - Math.max(0, Math.abs(mm) - a / 2) / 0.3);
      return Math.abs(sinc((Math.PI * a * 1e-3 * mm * 1e-3) / (650e-9 * L_SCR)));
    };
    const sx = W * 0.72, sw = W - 14 - sx;
    if (this.live && u >= 1) this.screen(sx, top, bot, sw, rgb, I);
    else { g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.5; g.strokeRect(sx, top, sw, bot - top); g.restore(); }
    this.text(i18n('sullo schermo'), sx + sw / 2, bot + 16, { size: 10.5, align: 'center', color: this.c('muted') });
    const lab = { 2: i18n('larga'), 0.5: i18n('stretta'), 0.1: i18n('strettissima') }[p.larg];
    const rows = [[E ? i18n('Fenditura {s}', { s: lab }) : i18n('fenditura di {a} mm, laser rosso, schermo a 2 m', { a: nice(a, 1) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? ({ 2: i18n('la luce passa dritta, stretta come la fenditura'), 0.5: i18n('la luce comincia ad allargarsi'), 0.1: i18n('la luce si allarga tantissimo, e fa strisce!') }[p.larg])
      : i18n('macchia centrale larga {w} mm', { w: nice(wmm, 1) }), this.c('mint'), 700]);
    this.box(rows);
  }
}
