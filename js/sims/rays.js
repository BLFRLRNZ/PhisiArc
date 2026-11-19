// Raggi e specchi (OT01). Sette modi:
//   - 'ombra': una lampada, un pupazzo di cartone alto 40 cm a distanza d dalla lampada e un muro a 4 m. La luce va dritta:
//     l'ombra è alta S = h·D/d. Con la lampada larga intorno all'ombra compare la penombra.
//   - 'camera': la camera oscura. Una candela davanti a una scatola con un foro: sul fondo, la sua immagine capovolta.
//     Con il foro grande l'immagine è più luminosa, ma sfocata.
//   - 'specchio': un laser colpisce uno specchio piano con angolo di incidenza i; il raggio riflesso riparte con lo
//     stesso angolo, dall'altra parte della normale.
//   - 'immagine': un cartello a distanza d da uno specchio verticale. L'immagine sta dietro lo specchio, alla stessa
//     distanza, con la scritta rovesciata; i raggi che arrivano all'occhio sembrano partire da lì.
//   - 'superficie': luce parallela su una superficie liscia (riflessione speculare) o ruvida (riflessione diffusa).
//   - 'labirinto': un laser orizzontale e uno specchio inclinato di a gradi: il raggio riflesso parte a 2a gradi.
//     Se c'è una meta (in gradi), lì c'è la stella da colpire.
//   - 'intero': una bambina alta 1,40 m (occhi a 1,30 m) davanti a uno specchio con il bordo alto a 1,35 m. Quanto si vede
//     non dipende dalla distanza, ma dall'altezza dello specchio: ne basta metà della propria altezza.
// Risultato: ombra { d, S, P, larga }; camera { foro, nitida }; specchio { i, r }; immagine { d, di };
//            superficie { sup }; labirinto { a, phi, preso }; intero { d, hm, basso, alto, tutta }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const H_OBJ = 0.4, D_WALL = 4, E_LAMP = 0.15, KID = 1.4, EYE = 1.3, TOP_M = 1.35, RAD = Math.PI / 180;
const DUR = { ombra: 1.2, camera: 1.2, specchio: 1.4, immagine: 1.2, superficie: 1.6, labirinto: 1.4, intero: 1.4 };
// l'ombra al muro: scura (ombra) e chiara (penombra), in metri; con la lampada piccola sono uguali
export const shadow = (d, larga) => { const e = larga ? E_LAMP : 0; return { S: 2 * (e + (H_OBJ / 2 - e) * (D_WALL / d)), P: 2 * (-e + (H_OBJ / 2 + e) * (D_WALL / d)) }; };
// quanto del corpo si vede in uno specchio alto hm metri, con il bordo alto a 1,35 m
export const seen = (hm) => ({ alto: Math.min(KID, 2 * TOP_M - EYE), basso: Math.max(0, Math.round((2 * (TOP_M - hm) - EYE) * 1000) / 1000) });
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
// «1 metro», «1,5 metri»: per l'Esploratore le distanze si scrivono per esteso, con il singolare quando il numero è 1
const metri = (x, d = 1) => { const s = nice(x, d); return s === '1' ? i18n('1 metro') : i18n('{d} metri', { d: s }); };
const rnd = (i) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };

export class Rays extends Sim {
  static tall = true;
  static controls = {
    d: { label: 'Distanza', min: 0.5, max: 3.5, step: 0.5, unit: 'm' },
    larga: { label: 'Lampada larga', type: 'toggle' },
    foro: { label: 'Il foro', type: 'select', options: [['piccolo', 'piccolo'], ['grande', 'grande']] },
    i: { label: 'Angolo del raggio', min: 10, max: 80, step: 5, unit: '°' },
    sup: { label: 'La superficie', type: 'select', options: [['liscia', 'liscia'], ['ruvida', 'ruvida']] },
    a: { label: 'Inclinazione dello specchio', min: 10, max: 80, step: 1, unit: '°' },
    hm: { label: 'Altezza dello specchio', type: 'select', options: [['50', '50 cm'], ['70', '70 cm'], ['100', '1 m']] },
  };

  defaults() { return { mode: 'ombra', d: 1, larga: false, foro: 'piccolo', i: 40, sup: 'liscia', a: 30, meta: 0, hm: '50', lens: 's' }; }

  get dur() { return DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params;
    switch (p.mode) {
      case 'camera': return this.finish({ foro: p.foro, nitida: p.foro === 'piccolo' });
      case 'specchio': return this.finish({ i: p.i, r: p.i });
      case 'immagine': return this.finish({ d: p.d, di: p.d });
      case 'superficie': return this.finish({ sup: p.sup });
      case 'labirinto': return this.finish({ a: p.a, phi: 2 * p.a, preso: p.meta > 0 && Math.abs(2 * p.a - p.meta) <= 1.5 });
      case 'intero': { const hm = Number(p.hm) / 100, v = seen(hm); return this.finish({ d: p.d, hm: Number(p.hm), basso: v.basso, alto: v.alto, tutta: v.basso <= 0 && v.alto >= KID }); }
      default: { const s = shadow(p.d, p.larga); return this.finish({ d: p.d, S: s.S, P: s.P, larga: !!p.larga }); }
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'camera') this.drawCamera();
    else if (m === 'specchio') this.drawMirror();
    else if (m === 'immagine') this.drawImage();
    else if (m === 'superficie') this.drawSurface();
    else if (m === 'labirinto') this.drawMaze();
    else if (m === 'intero') this.drawWhole();
    else this.drawShadow();
  }

  // un raggio di luce che si disegna da solo: frazione u della spezzata
  ray(pts, u, { color, width = 2.4, alpha = 1, dash } = {}) { this.line(pts, { color: color || this.c('sun'), width, alpha, dash, upto: u }); }

  // ---------- l'ombra ----------
  drawShadow() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const x0 = 46, xw = W - 30, s = (xw - x0) / D_WALL, yc = H * 0.42, Y = (m) => yc + m * s, X = (m) => x0 + m * s;
    const sh = shadow(p.d, p.larga), e = p.larga ? E_LAMP : 0, xo = X(p.d), u = this.u, lit = this.live && u >= 1;
    // il muro, chiaro dove arriva la luce e scuro nell'ombra
    g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = lit ? 0.45 : 0.06; g.fillRect(xw, 24, 14, H - 110); g.restore();
    if (lit) {
      g.save(); g.fillStyle = '#000';
      const band = (h, al) => { const y0 = Math.max(24, Y(-h / 2)), y1 = Math.min(H - 86, Y(h / 2)); g.globalAlpha = al; g.fillRect(xw, y0, 14, y1 - y0); };
      band(sh.P, 0.5); band(sh.S, 0.92); g.restore();
    }
    this.line([[xw, 24], [xw, H - 86]], { color: this.c('chalk'), width: 3 });
    // i raggi che sfiorano il pupazzo: dritti fino al muro
    if (this.live) {
      const edges = e ? [[-e, -H_OBJ / 2], [e, H_OBJ / 2], [e, -H_OBJ / 2], [-e, H_OBJ / 2]] : [[0, -H_OBJ / 2], [0, H_OBJ / 2]];
      edges.forEach(([ly, oy], k) => {
        const yw = ly + (oy - ly) * (D_WALL / p.d), outer = e && k >= 2;
        this.ray([[x0, Y(ly)], [xo, Y(oy)], [xw, Y(yw)]], u, { alpha: outer ? 0.5 : 0.95, width: outer ? 1.6 : 2.2, dash: outer ? [4, 4] : null });
      });
    }
    // la lampada: piccola o larga
    if (e) { g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = this.live ? 0.9 : 0.35; g.fillRect(x0 - 6, Y(-e), 12, 2 * e * s); g.restore(); }
    else this.ball(x0, yc, 8, { color: this.c('sun'), fill: this.live ? 0.9 : 0.3, width: 2, shine: false });
    this.line([[x0, Y(e) + 10], [x0, H - 86]], { color: this.c('muted'), width: 2 });
    // il pupazzo di cartone: testa e corpo
    const top = Y(-H_OBJ / 2), bot = Y(H_OBJ / 2), hh = bot - top;
    g.save(); g.fillStyle = this.c('orange'); g.globalAlpha = 0.85;
    g.beginPath(); g.arc(xo, top + hh * 0.16, hh * 0.16, 0, 2 * Math.PI); g.fill();
    g.fillRect(xo - hh * 0.14, top + hh * 0.32, hh * 0.28, hh * 0.68); g.restore();
    this.line([[xo, bot], [xo, H - 86]], { color: this.c('muted'), width: 2 });
    // il righello delle distanze
    const ry = H - 64;
    this.line([[x0, ry], [xw, ry]], { color: this.c('muted'), width: 1.2 });
    for (let m = 0; m <= D_WALL; m++) { this.line([[X(m), ry], [X(m), ry + 6]], { color: this.c('muted'), width: 1.2 }); this.text(`${m} m`, X(m), ry + 18, { size: 9.5, align: 'center', color: this.c('muted'), mono: true }); }
    this.line([[xo, ry - 8], [xo, ry + 2]], { color: this.c('orange'), width: 2 });
    const rows = [[E ? i18n('Il pupazzo è a {dm} dalla lampada', { dm: metri(p.d) }) : i18n('h = 40 cm, d = {d} m, muro a D = 4 m', { d: nice(p.d, 1) }), this.c('chalk'), 700]];
    if (this.result) {
      if (!p.larga) rows.push([E ? i18n('l’ombra è alta {Sm}', { Sm: metri(sh.S, 2) }) : i18n('ombra: S = h·D/d = {S} m', { S: nice(sh.S, 2) }), this.c('mint'), 700]);
      else rows.push([E ? i18n('ombra scura alta {Sm}, e intorno la penombra', { Sm: metri(sh.S, 2) }) : i18n('ombra {S} m, penombra fino a {P} m', { S: nice(sh.S, 2), P: nice(sh.P, 2) }), this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- la camera oscura ----------
  drawCamera() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const yc = H * 0.42, xh = W * 0.56, xb = W - 26, xc = 52, ct = yc - 64, cb = yc + 44, big = p.foro === 'grande', hole = big ? 14 : 3, u = this.u;
    // la candela
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.85; g.fillRect(xc - 8, ct + 26, 16, cb - ct - 26); g.restore();
    const fl = this.live ? 1 + 0.08 * Math.sin(this.clock * 13) : 1;
    g.save(); g.fillStyle = this.c('sun'); g.beginPath(); g.ellipse(xc, ct + 12, 7, 13 * fl, 0, 0, 2 * Math.PI); g.fill(); g.restore();
    this.line([[xc - 30, cb], [xc + 30, cb]], { color: this.c('muted'), width: 3 });
    // la scatola, buia dentro, con il foro davanti
    g.save(); g.fillStyle = '#000'; g.globalAlpha = 0.6; g.fillRect(xh, yc - 90, xb - xh, 180); g.restore();
    this.line([[xh, yc - 90], [xb, yc - 90], [xb, yc + 90], [xh, yc + 90]], { color: this.c('muted'), width: 3 });
    this.line([[xh, yc - 90], [xh, yc - hole / 2]], { color: this.c('muted'), width: 3 });
    this.line([[xh, yc + hole / 2], [xh, yc + 90]], { color: this.c('muted'), width: 3 });
    // i raggi dalla cima della fiamma e dalla base, che si incrociano nel foro
    const k = (xb - xh) / (xh - xc), yTop = yc + (yc - ct) * k, yBot = yc - (cb - yc) * k;
    if (this.live) {
      for (const dy of big ? [-hole / 2, 0, hole / 2] : [0]) {
        this.ray([[xc, ct], [xh, yc + dy], [xb, yTop + dy * (1 + k)]], u, { alpha: big ? 0.6 : 0.95, width: 1.8 });
        this.ray([[xc, cb], [xh, yc + dy], [xb, yBot + dy * (1 + k)]], u, { alpha: big ? 0.6 : 0.95, width: 1.8, color: this.c('chalk') });
      }
    }
    // l'immagine sul fondo: capovolta; sfocata con il foro grande
    if (this.live && u >= 1) {
      const copies = big ? [-hole * 0.9, -hole * 0.45, 0, hole * 0.45, hole * 0.9] : [0];
      for (const dy of copies) {
        g.save(); g.globalAlpha = big ? 0.32 : 0.95;
        g.fillStyle = this.c('chalk'); g.fillRect(xb - 7, yBot + dy, 5, (yTop - 26 * k - yBot));
        g.fillStyle = this.c('sun'); g.beginPath(); g.ellipse(xb - 4.5, yTop - 12 * k + dy, 4, 12 * k, 0, 0, 2 * Math.PI); g.fill(); g.restore();
      }
    }
    const rows = [[E ? (big ? i18n('Foro grande') : i18n('Foro piccolo')) : i18n('camera oscura, foro {f}', { f: i18n(big ? 'grande' : 'piccolo') }), this.c('chalk'), 700]];
    if (this.result) rows.push([big ? (E ? i18n('più luminosa, ma sfocata') : i18n('immagine capovolta, più luminosa ma sfocata')) : (E ? i18n('l’immagine è a testa in giù, e nitida') : i18n('immagine capovolta e nitida')), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- la legge della riflessione ----------
  drawMirror() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const ym = H * 0.62, x0 = W / 2, R = Math.min(160, H * 0.5), a = p.i * RAD, u = this.u;
    const src = [x0 - R * Math.sin(a), ym - R * Math.cos(a)], out = [x0 + R * Math.sin(a), ym - R * Math.cos(a)];
    // lo specchio, con il tratteggio dietro
    this.line([[30, ym], [W - 30, ym]], { color: this.c('sky'), width: 4 });
    g.save(); g.strokeStyle = this.c('edge'); g.lineWidth = 1.4;
    for (let x = 36; x < W - 30; x += 12) { g.beginPath(); g.moveTo(x, ym + 3); g.lineTo(x - 7, ym + 11); g.stroke(); }
    g.restore();
    // la normale
    this.line([[x0, ym - R - 10], [x0, ym]], { color: this.c('muted'), width: 1.4, dash: [5, 5] });
    this.text(E ? i18n('dritto in su') : i18n('normale'), x0 + 6, ym - R - 4, { size: 10.5, color: this.c('muted') });
    // il laser e i due raggi
    g.save(); g.translate(src[0], src[1]); g.rotate(Math.atan2(ym - src[1], x0 - src[0])); g.fillStyle = this.c('chalk'); g.fillRect(-22, -6, 24, 12); g.restore();
    if (this.live) {
      this.ray([src, [x0, ym]], clamp01(u * 2), { color: this.c('coral'), width: 2.6 });
      if (u > 0.5) this.ray([[x0, ym], out], clamp01(u * 2 - 1), { color: this.c('coral'), width: 2.6 });
    } else this.line([src, [x0, ym]], { color: this.c('coral'), width: 1, dash: [3, 6], alpha: 0.5 });
    // gli angoli, misurati dalla normale
    const arc = (from, to, col) => { g.save(); g.strokeStyle = this.c(col); g.lineWidth = 2; g.beginPath(); g.arc(x0, ym, 46, from, to); g.stroke(); g.restore(); };
    arc(-Math.PI / 2 - a, -Math.PI / 2, 'sun');
    this.text(E ? `${p.i}°` : `i = ${p.i}°`, x0 - 58 * Math.sin(a / 2) - 4, ym - 58 * Math.cos(a / 2), { size: 11.5, align: 'right', weight: 700, color: this.c('sun') });
    if (this.live && u > 0.5) {
      arc(-Math.PI / 2, -Math.PI / 2 + a, 'mint');
      this.text(E ? `${p.i}°` : `r = ${p.i}°`, x0 + 58 * Math.sin(a / 2) + 4, ym - 58 * Math.cos(a / 2), { size: 11.5, weight: 700, color: this.c('mint') });
    }
    const rows = [[E ? i18n('Il raggio arriva inclinato di {i} gradi', { i: p.i }) : i18n('angolo di incidenza i = {i}°', { i: p.i }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('e riparte inclinato di {i} gradi, dall’altra parte', { i: p.i }) : i18n('angolo di riflessione r = {i}°: r = i', { i: p.i }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'immagine nello specchio ----------
  drawImage() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const xm = W * 0.56, yf = H * 0.66, s = (xm - 46) / 2.6, xo = xm - p.d * s, xi = xm + p.d * s, u = this.u;
    const cy = yf - 70, cw = 46, chh = 28, eye = [26, yf - 120];
    // lo specchio verticale e il pavimento
    this.ground(yf, { x0: 10, x1: W - 10 });
    this.line([[xm, 40], [xm, yf]], { color: this.c('sky'), width: 4 });
    g.save(); g.strokeStyle = this.c('edge'); g.lineWidth = 1.4;
    for (let y = 46; y < yf; y += 12) { g.beginPath(); g.moveTo(xm + 3, y); g.lineTo(xm + 10, y - 7); g.stroke(); }
    g.restore();
    // il cartello, e la sua immagine dietro lo specchio, rovesciata
    const card = (x, mirror, alpha) => {
      g.save(); g.globalAlpha = alpha;
      this.line([[x, cy + chh / 2], [x, yf]], { color: this.c('muted'), width: 2.4, alpha });
      g.fillStyle = this.c('sun'); g.globalAlpha = alpha * 0.25; g.fillRect(x - cw / 2, cy - chh / 2, cw, chh);
      g.globalAlpha = alpha; g.strokeStyle = this.c('sun'); g.lineWidth = 2; g.strokeRect(x - cw / 2, cy - chh / 2, cw, chh);
      g.translate(x, cy + 5); if (mirror) g.scale(-1, 1);
      this.text(i18n('CIAO'), 0, 0, { size: 12, align: 'center', weight: 700, color: this.c('chalk') });
      g.restore();
    };
    card(xo, false, 1);
    if (this.live) card(xi, true, 0.45 + 0.4 * u);
    // l'occhio che guarda, e i raggi: dal cartello allo specchio all'occhio; dietro lo specchio, il prolungamento
    this.ball(eye[0], eye[1], 6, { color: this.c('chalk'), fill: 0.4, width: 2, shine: false });
    this.ball(eye[0] + 2, eye[1], 2.2, { color: this.c('ink'), fill: 1, width: 1, shine: false });
    if (this.live) {
      for (const oy of [cy - chh / 2, cy + chh / 2]) {
        const tP = (xm - xi) / (eye[0] - xi), P = [xm, oy + (eye[1] - oy) * tP];
        this.ray([[xo, oy], P, eye], u, { width: 2 });
        if (u >= 1) this.line([P, [xi, oy]], { color: this.c('sun'), width: 1.4, dash: [4, 4], alpha: 0.6 });
      }
    }
    // le distanze, uguali davanti e dietro
    const ry = yf + 30;
    this.line([[xo, ry], [xm, ry]], { color: this.c('orange'), width: 2 });
    this.text(`${nice(p.d, 1)} m`, (xo + xm) / 2, ry - 6, { size: 10.5, align: 'center', color: this.c('orange') });
    if (this.live) { this.line([[xm, ry], [xi, ry]], { color: this.c('mint'), width: 2, dash: [5, 4] }); this.text(`${nice(p.d, 1)} m`, (xm + xi) / 2, ry - 6, { size: 10.5, align: 'center', color: this.c('mint') }); }
    const rows = [[E ? i18n('Il cartello è a {dm} dallo specchio', { dm: metri(p.d) }) : i18n('oggetto a d = {d} m dallo specchio', { d: nice(p.d, 1) }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('l’immagine è {dm} dietro lo specchio', { dm: metri(p.d) }) : i18n('immagine virtuale a {d} m dietro lo specchio', { d: nice(p.d, 1) }), this.c('mint'), 700]);
      rows.push([E ? i18n('e la scritta è rovesciata') : i18n('davanti e dietro si scambiano: la scritta è rovesciata'), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- liscia o ruvida ----------
  drawSurface() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const ys = H * 0.62, rough = p.sup === 'ruvida', u = this.u, n = 5, L = Math.min(150, H * 0.42);
    // la superficie: una riga dritta o una spezzata di piccole facce storte
    const xs = Array.from({ length: n }, (_, k) => W * 0.36 + ((W * 0.28) * k) / (n - 1));
    if (!rough) this.line([[24, ys], [W - 24, ys]], { color: this.c('sky'), width: 4 });
    else {
      const pts = [];
      for (let x = 24; x <= W - 24; x += 9) pts.push([x, ys + (rnd(x) - 0.5) * 10]);
      this.line(pts, { color: this.c('muted'), width: 3 });
    }
    // i raggi paralleli che arrivano a 45 gradi, e quelli che ripartono
    xs.forEach((x, k) => {
      const tilt = rough ? (rnd(k * 7 + 3) - 0.5) * 1.6 : 0, a = Math.PI / 4;
      const out = [x + L * Math.sin(a + 2 * tilt), ys - L * Math.cos(a + 2 * tilt)];
      this.ray([[x - L * Math.sin(a), ys - L * Math.cos(a)], [x, ys], out], u, { width: 1.8, alpha: 0.9 });
    });
    // due occhi: uno nella direzione dello specchio, uno di lato
    const eyes = [[W * 0.5 + L * 0.95, ys - L * 0.95], [W * 0.5, ys - L]];
    eyes.forEach(([x, y], k) => {
      this.ball(x, y, 7, { color: this.c('chalk'), fill: 0.4, width: 2, shine: false });
      this.text(k ? 'B' : 'A', x + 12, y + 4, { size: 11, weight: 700, color: this.c('chalk') });
    });
    const rows = [[E ? (rough ? i18n('Superficie ruvida') : i18n('Superficie liscia')) : (rough ? i18n('superficie ruvida: riflessione diffusa') : i18n('superficie liscia: riflessione speculare')), this.c('chalk'), 700]];
    if (this.result) rows.push([rough ? (E ? i18n('i raggi rimbalzano dappertutto: la vedi da ogni parte') : i18n('la luce torna in tutte le direzioni: la vedono A e B')) : (E ? i18n('i raggi rimbalzano tutti insieme: è uno specchio') : i18n('i raggi restano paralleli: solo A vede la luce')), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- il labirinto di specchi ----------
  drawMaze() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const yc = H * 0.66, mx = W * 0.42, a = p.a * RAD, phi = 2 * p.a, ph = phi * RAD, u = this.u, R = Math.min(W * 0.5, H * 0.56) - 14;
    // le pareti del labirinto, per gioco
    g.save(); g.strokeStyle = this.c('edge'); g.lineWidth = 3; g.globalAlpha = 0.6;
    g.strokeRect(10, 10, W - 20, H - 70); g.restore();
    // la stella da colpire
    const hit = p.meta > 0 && Math.abs(phi - p.meta) <= 1.5, tx = mx + R * Math.cos(p.meta * RAD), ty = yc - R * Math.sin(p.meta * RAD);
    if (p.meta > 0) {
      g.save(); g.translate(tx, ty); g.fillStyle = this.c(hit && this.live && u >= 1 ? 'sun' : 'muted'); g.beginPath();
      for (let k = 0; k < 10; k++) { const r = k % 2 ? 6 : 14, an = -Math.PI / 2 + (k * Math.PI) / 5; g.lineTo(r * Math.cos(an), r * Math.sin(an)); }
      g.closePath(); g.fill(); g.restore();
      if (hit && this.result) this.burst(tx, ty, Math.min(0.6, this.age), { color: this.c('sun'), r: 30 });
    }
    // il laser, lo specchio girevole, il raggio
    g.save(); g.fillStyle = this.c('chalk'); g.fillRect(14, yc - 6, 26, 12); g.restore();
    const hx = Math.cos(a) * 36, hy = Math.sin(a) * 36;
    this.line([[mx - hx, yc + hy], [mx + hx, yc - hy]], { color: this.c('sky'), width: 5 });
    this.ball(mx, yc, 4, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    if (this.live) {
      this.ray([[40, yc], [mx, yc]], clamp01(u * 2), { color: this.c('coral'), width: 2.6 });
      const far = Math.max(W, H) * 1.2, end = hit ? [tx, ty] : [mx + far * Math.cos(ph), yc - far * Math.sin(ph)];
      if (u > 0.5) this.ray([[mx, yc], end], clamp01(u * 2 - 1), { color: this.c('coral'), width: 2.6 });
    } else this.line([[40, yc], [mx, yc]], { color: this.c('coral'), width: 1, dash: [3, 6], alpha: 0.5 });
    // l'angolo dello specchio
    g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2; g.beginPath(); g.arc(mx, yc, 30, -a, 0); g.stroke(); g.restore();
    this.line([[mx, yc], [mx + 44, yc]], { color: this.c('muted'), width: 1.2, dash: [4, 4] });
    this.text(E ? `${p.a}°` : `a = ${p.a}°`, mx + 40, yc + 16, { size: 11, weight: 700, color: this.c('sun') });
    const rows = [[E ? i18n('Specchio inclinato di {a} gradi', { a: p.a }) : i18n('specchio a {a}°: il raggio riflesso parte a {phi}°', { a: p.a, phi }), this.c('chalk'), 700]];
    if (p.meta > 0) rows.push([E ? i18n('la stella è a {m} gradi', { m: p.meta }) : i18n('stella a {m}°', { m: p.meta }), this.c('sun'), 500]);
    if (this.result && p.meta > 0) rows.push([hit ? (E ? i18n('Bersaglio! La stella si accende!') : i18n('bersaglio: 2 × {a}° = {phi}°', { a: p.a, phi })) : (E ? i18n('mancata: gira ancora lo specchio') : i18n('il raggio va a {phi}°, la stella è a {m}°', { phi, m: p.meta })), this.c(hit ? 'mint' : 'coral'), 700]);
    this.box(rows);
  }

  // ---------- tutta intera nello specchio ----------
  drawWhole() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const hm = Number(p.hm) / 100, v = seen(hm), yf = H * 0.74, sv = (yf - 70) / 1.6, xm = W - 70, sh = (xm - 50) / 3.2, xk = xm - p.d * sh, xi = xm + p.d * sh;
    const Y = (m) => yf - m * sv, u = this.u;
    this.ground(yf, { x0: 10, x1: W - 10 });
    // la parete con lo specchio
    this.line([[xm + 4, 30], [xm + 4, yf]], { color: this.c('muted'), width: 2 });
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.85; g.fillRect(xm - 2, Y(TOP_M), 6, hm * sv); g.restore();
    // la bambina, e la sua immagine dietro lo specchio
    const kid = (x, alpha) => {
      const c = this.c('orange');
      this.ball(x, Y(KID - 0.1), 0.1 * sv, { color: c, fill: 0.3, width: 2, shine: false, alpha });
      this.line([[x, Y(1.2)], [x, Y(0.7)]], { color: c, width: 3, alpha });
      this.line([[x - 0.18 * sv, Y(1.05)], [x, Y(1.12)], [x + 0.18 * sv, Y(1.05)]], { color: c, width: 2.6, alpha });
      this.line([[x - 0.12 * sv, Y(0)], [x, Y(0.7)], [x + 0.12 * sv, Y(0)]], { color: c, width: 3, alpha });
    };
    kid(xk, 1);
    if (this.live) kid(xi, 0.4);
    this.ball(xk + 3, Y(EYE), 2.4, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    // i due raggi limite: dall'occhio ai bordi dello specchio e indietro sul corpo
    if (this.live) {
      for (const [ym, yb] of [[TOP_M, 2 * TOP_M - EYE], [TOP_M - hm, 2 * (TOP_M - hm) - EYE]]) {
        const yb2 = Math.max(0, yb), xb = yb >= 0 ? xk : xk + (xm - xk) * (yb2 - yb) / (ym - yb);
        this.ray([[xk + 3, Y(EYE)], [xm, Y(ym)], [xb, Y(yb2)]], u, { width: 1.8 });
        if (u >= 1) this.line([[xm, Y(ym)], [xi, Y(EYE)]], { color: this.c('sun'), width: 1.2, dash: [4, 4], alpha: 0.5 });
      }
      if (u >= 1) {
        g.save(); g.fillStyle = this.c('mint'); g.globalAlpha = 0.55; g.fillRect(xk - 0.2 * sv - 10, Y(v.alto), 6, (v.alto - v.basso) * sv); g.restore();
      }
    }
    const tutta = v.basso <= 0;
    const rows = [[E ? i18n('Specchio di {h} centimetri, a {dm} da te', { h: p.hm, dm: metri(p.d) }) : i18n('specchio alto {h} cm; bambina alta 1,40 m, a {d} m', { h: p.hm, d: nice(p.d, 1) }), this.c('chalk'), 700]];
    if (this.result) rows.push([tutta ? (E ? i18n('ti vedi tutta, dalla testa ai piedi!') : i18n('si vede tutta: dai piedi alla testa')) : (E ? i18n('non ti vedi i piedi') : i18n('si vede solo da {a} m a 1,40 m', { a: nice(v.basso, 2) })), this.c(tutta ? 'mint' : 'coral'), 700]);
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
