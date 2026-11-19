// Corrente e circuiti (E02). Sei modi:
//   - 'semplice': una pila, un interruttore e una lampadina da 10 Ω, con un amperometro prima e uno dopo la lampadina.
//     Con il giro chiuso gli elettroni corrono e la lampadina si accende; i due amperometri segnano la stessa corrente:
//     la corrente non si consuma.
//   - 'ohm': una pila a tensione variabile e una resistenza da 10, 20 o 40 Ω: I = V/R, con il grafico corrente-tensione.
//   - 'due': due lampadine da 10 Ω e una pila da 6 V, in serie o in parallelo; si può svitare la seconda lampadina.
//     In serie ognuna ha 3 V (un quarto della luce) e passano 0,3 A; in parallelo ognuna ha 6 V e dalla pila escono 1,2 A.
//   - 'casa': gli elettrodomestici di casa, in parallelo a 230 V. Le potenze si sommano; oltre 3 kW il contatore salta.
//   - 'catena': le luci della giostra del parco, n lampadine da 3 V in serie su una pila da V volt: ognuna ha V/n.
//   - 'scatola': l'esperimento al buio. Due lampadine sopra una scatola chiusa, collegate in serie o in parallelo da fili
//     nascosti; si può svitare la lampadina A e leggere l'amperometro.
// Risultato: semplice { chiuso, pila, I, accesa }; ohm { V, R, I }; due { coll, svita, I, luce1, luce2 };
//            casa { P, I, salta }; catena { n, V, Vl, stato }; scatola { nascosto, svita, B, I }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

export const RLAMP = 10;        // la resistenza di una lampadina, in ohm
export const RETE = 230;        // la tensione di casa, in volt
export const LIMITE = 3000;     // il contatore di casa, in watt
export const VLAMP = 3;         // le lampadine della giostra, in volt
export const APP = [['led', 'lampadina', 10], ['tv', 'TV', 100], ['phon', 'phon', 1500], ['forno', 'forno', 2000], ['lavatrice', 'lavatrice', 2000]];
// lo stato delle lampadine della giostra: giuste a 3 V, deboli sotto 2,5 V, bruciate sopra 3,5 V
export const catena = (V, n) => { const Vl = V / n; return Vl > 3.5 ? 'bruciate' : Vl < 2.5 ? 'deboli' : 'giuste'; };
const DUR = { semplice: 1.6, ohm: 1.4, due: 1.6, casa: 1.8, catena: 1.8, scatola: 1.6 };
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };

export class Circuit extends Sim {
  static tall = true;
  static controls = {
    chiuso: { label: 'Interruttore chiuso', type: 'toggle' },
    pila: { label: 'La pila', type: 'select', options: [[1.5, '1,5 V'], [4.5, '4,5 V'], [9, '9 V']] },
    V: { label: 'Tensione della pila', labelE: 'Spinta della pila', min: 0, max: 12, step: 1, unit: 'V', unitE: 'volt' },
    R: { label: 'Resistenza', type: 'select', options: [[10, '10 Ω'], [20, '20 Ω'], [40, '40 Ω']] },
    coll: { label: 'Collegamento', type: 'select', options: [['serie', 'in serie'], ['parallelo', 'in parallelo']] },
    svita: { label: 'Seconda lampadina svitata', type: 'toggle' },
    led: { label: 'Lampadina LED', type: 'toggle' },
    tv: { label: 'Televisore', type: 'toggle' },
    phon: { label: 'Phon', type: 'toggle' },
    forno: { label: 'Forno', type: 'toggle' },
    lavatrice: { label: 'Lavatrice', type: 'toggle' },
    n: { label: 'Lampadine in fila', min: 1, max: 12, step: 1, unit: '' },
    svitaA: { label: 'Lampadina A svitata', type: 'toggle' },
  };

  defaults() {
    return { mode: 'semplice', chiuso: true, pila: 4.5, V: 6, R: 20, coll: 'serie', svita: false, led: true, tv: false, phon: false, forno: false, lavatrice: false, n: 4, nascosto: 'parallelo', svitaA: false, lens: 's' };
  }

  get dur() { return DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  // la fisica di ogni modo, senza disegno
  phys() {
    const p = this.params;
    switch (p.mode) {
      case 'ohm': return { I: p.V / p.R };
      case 'due': {
        if (p.coll === 'serie') { const I = p.svita ? 0 : 6 / (2 * RLAMP); return { I, P1: I * I * RLAMP, P2: I * I * RLAMP }; }
        const I1 = 6 / RLAMP, I2 = p.svita ? 0 : 6 / RLAMP;
        return { I: I1 + I2, I1, I2, P1: I1 * I1 * RLAMP, P2: I2 * I2 * RLAMP };
      }
      case 'casa': { const P = APP.reduce((s, [k, , w]) => s + (p[k] ? w : 0), 0); return { P, I: P / RETE, salta: P > LIMITE }; }
      case 'catena': return { Vl: p.V / p.n, stato: catena(p.V, p.n) };
      case 'scatola': {
        if (p.nascosto === 'serie') { const I = p.svitaA ? 0 : 6 / (2 * RLAMP); return { I, B: I > 0, k: 0.5 }; }
        return { I: 6 / RLAMP + (p.svitaA ? 0 : 6 / RLAMP), B: true, k: 1 };
      }
      default: { const I = p.chiuso ? p.pila / RLAMP : 0; return { I }; }
    }
  }

  end() {
    if (!this.running) return;
    const p = this.params, s = this.phys(), r2 = (x) => Math.round(x * 1000) / 1000;
    switch (p.mode) {
      case 'ohm': return this.finish({ V: p.V, R: p.R, I: r2(s.I) });
      case 'due': return this.finish({ coll: p.coll, svita: p.svita, I: r2(s.I), luce1: s.P1 > 0, luce2: s.P2 > 0 });
      case 'casa': return this.finish({ P: s.P, I: r2(s.I), salta: s.salta });
      case 'catena': return this.finish({ n: p.n, V: p.V, Vl: r2(s.Vl), stato: s.stato });
      case 'scatola': return this.finish({ nascosto: p.nascosto, svita: p.svitaA, B: s.B, I: r2(s.I) });
      default: return this.finish({ chiuso: p.chiuso, pila: p.pila, I: r2(s.I), accesa: s.I > 0 });
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'ohm') this.drawOhm();
    else if (m === 'due') this.drawTwo();
    else if (m === 'casa') this.drawHouse();
    else if (m === 'catena') this.drawString();
    else if (m === 'scatola') this.drawBox();
    else this.drawSimple();
  }

  box(rows) {
    if (!rows.length) return;
    const g = this.ctx;
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }

  // ---------- i pezzi del disegno ----------
  wire(pts, on = true) { this.line(pts, { color: on ? this.c('chalk') : this.c('muted'), width: 2.5 }); }

  // un punto lungo una spezzata, a distanza s dall'inizio
  along(path, s) {
    for (let i = 1; i < path.length; i++) {
      const [ax, ay] = path[i - 1], [bx, by] = path[i], d = Math.hypot(bx - ax, by - ay);
      if (s <= d) return [ax + ((bx - ax) * s) / d, ay + ((by - ay) * s) / d];
      s -= d;
    }
    return path[path.length - 1];
  }

  plen(path) { let L = 0; for (let i = 1; i < path.length; i++) L += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); return L; }

  // gli elettroni: puntini azzurri che scorrono lungo il giro, tanto più veloci quanta più corrente passa
  electrons(path, I, { gap = 22, speed = 60 } = {}) {
    const g = this.ctx, L = this.plen(path), v = this.live ? I * speed : 0, off = (this.clock * v) % gap;
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = I > 0 && this.live ? 0.95 : 0.35;
    for (let s = off; s < L; s += gap) { const [x, y] = this.along(path, s); g.beginPath(); g.arc(x, y, 2.6, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }

  // una pila: un cilindro con il polo + in alto (o a destra, se è sdraiata)
  battery(x, y, label, { flat = false, len = 54 } = {}) {
    const g = this.ctx, w = 24;
    g.save(); g.translate(x, y); if (flat) g.rotate(Math.PI / 2);
    g.fillStyle = this.c('sim-bg'); g.fillRect(-w / 2, -len / 2, w, len);
    g.globalAlpha = 0.25; g.fillStyle = this.c('sun'); g.fillRect(-w / 2, -len / 2, w, len * 0.3);
    g.globalAlpha = 1; g.strokeStyle = this.c('sun'); g.lineWidth = 2.2; g.strokeRect(-w / 2, -len / 2, w, len);
    g.fillStyle = this.c('sun'); g.fillRect(-5, -len / 2 - 5, 10, 5);
    g.restore();
    const dx = flat ? 0 : 1, dy = flat ? 1 : 0;
    this.text('+', x + (flat ? len / 2 - 9 : 0), y - (flat ? -5 : len / 2 - 14), { size: 13, align: 'center', color: this.c('coral'), weight: 700 });
    this.text('−', x - (flat ? len / 2 - 9 : 0), y + (flat ? 5 : len / 2 - 6), { size: 13, align: 'center', color: this.c('sky'), weight: 700 });
    if (label) this.text(label, x + dx * 22 + dy * 0, y + dy * 30 + 4, { size: 12, align: flat ? 'center' : 'left', color: this.c('sun'), mono: true });
  }

  // una lampadina: il vetro, il filamento e un alone tanto più grande quanta più potenza (k da 0 a 1)
  bulb(x, y, k, { r = 13, out = false, burnt = false, glow = 1 } = {}) {
    const g = this.ctx, yy = out ? y - 12 : y;
    if (k > 0.01 && !out) {
      const R = r + (6 + 26 * k) * glow, gr = g.createRadialGradient(x, yy, r * 0.4, x, yy, R);
      gr.addColorStop(0, `rgba(255, 214, 102, ${0.85 * clamp01(k + 0.15)})`); gr.addColorStop(1, 'rgba(255, 214, 102, 0)');
      g.save(); g.fillStyle = gr; g.beginPath(); g.arc(x, yy, R, 0, Math.PI * 2); g.fill(); g.restore();
    }
    g.save();
    g.beginPath(); g.arc(x, yy, r, 0, Math.PI * 2);
    g.globalAlpha = 0.18 + 0.6 * clamp01(k); g.fillStyle = burnt ? this.c('muted') : this.c('sun'); g.fill();
    g.globalAlpha = 1; g.strokeStyle = burnt ? this.c('muted') : this.c('chalk'); g.lineWidth = 2; g.stroke();
    g.strokeStyle = k > 0.05 ? this.c('orange') : this.c('muted'); g.lineWidth = 1.6; g.beginPath();
    g.moveTo(x - r * 0.45, yy + r * 0.2); g.lineTo(x - r * 0.2, yy - r * 0.25); g.lineTo(x, yy + r * 0.1); g.lineTo(x + r * 0.2, yy - r * 0.25); g.lineTo(x + r * 0.45, yy + r * 0.2);
    g.stroke();
    if (burnt) { g.strokeStyle = this.c('coral'); g.lineWidth = 2; g.beginPath(); g.moveTo(x - 5, yy - 5); g.lineTo(x + 5, yy + 5); g.moveTo(x + 5, yy - 5); g.lineTo(x - 5, yy + 5); g.stroke(); }
    g.restore();
  }

  // un amperometro: un cerchio con la A e la lettura sotto
  ammeter(x, y, I, { below = true } = {}) {
    this.ball(x, y, 11, { color: this.c('mint'), fill: 0.15, shine: false });
    this.text('A', x, y + 4.5, { size: 12, align: 'center', color: this.c('mint'), weight: 700 });
    this.text(`${nice(I, 2)} A`, x, y + (below ? 27 : -18), { size: 11.5, align: 'center', color: this.c('mint'), mono: true });
  }

  // ---------- il circuito chiuso ----------
  drawSimple() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const x0 = W * 0.16, x1 = W * 0.86, y0 = H * 0.34, y1 = H * 0.76, ym = (y0 + y1) / 2;
    const { I } = this.phys(), on = p.chiuso, k = clamp01(Math.sqrt((I * I * RLAMP) / 8.1));
    // il filo: dalla pila (+ in alto) in senso orario, con un buco dove c'è l'interruttore
    const sx = W * 0.51, sw = 30;
    this.wire([[x0, ym - 27], [x0, y0], [x1, y0], [x1, y1], [sx + sw / 2, y1]]);
    this.wire([[sx - sw / 2, y1], [x0, y1], [x0, ym + 27]]);
    // l'interruttore: una leva chiusa o alzata
    const a = on ? 0 : -0.55;
    this.line([[sx - sw / 2, y1], [sx - sw / 2 + sw * Math.cos(a), y1 + sw * Math.sin(a)]], { color: on ? this.c('chalk') : this.c('coral'), width: 3 });
    [sx - sw / 2, sx + sw / 2].forEach((x) => this.ball(x, y1, 3.5, { color: this.c('chalk'), fill: 0.6, shine: false }));
    this.text(on ? i18n('interruttore chiuso') : i18n('interruttore aperto'), sx, y1 + 26, { size: 11.5, align: 'center', color: on ? this.c('muted') : this.c('coral') });
    // gli elettroni escono dal − e rientrano dal +, dall'altra parte del giro
    if (on) this.electrons([[x0, ym + 27], [x0, y1], [x1, y1], [x1, y0], [x0, y0], [x0, ym - 27]], I);
    this.battery(x0, ym, `${nice(p.pila, 1)} V`);
    this.bulb(W * 0.51, y0, this.live ? k : 0);
    this.ammeter(W * 0.32, y0, this.live ? I : 0);
    this.ammeter(W * 0.7, y0, this.live ? I : 0);
    this.text(i18n('prima'), W * 0.32, y0 - 18, { size: 11, align: 'center', color: this.c('muted') });
    this.text(i18n('dopo'), W * 0.7, y0 - 18, { size: 11, align: 'center', color: this.c('muted') });
    const rows = [[E ? i18n('Pila da {v} volt', { v: nice(p.pila, 1) }) : i18n('Pila da {v} V, lampadina da 10 Ω', { v: nice(p.pila, 1) }), this.c('chalk'), 700]];
    if (this.result) {
      if (on) rows.push([E ? i18n('il giro è chiuso: la lampadina si accende!') : i18n('I = V / R = {I} A', { I: nice(I, 2) }), this.c('mint'), 500],
        [E ? i18n('prima e dopo, la stessa corrente') : i18n('uguale prima e dopo la lampadina'), this.c('mint'), 500]);
      else rows.push([i18n('il giro è aperto: niente corrente'), this.c('coral'), 500], [i18n('la lampadina resta spenta'), this.c('coral'), 500]);
    }
    this.box(rows);
  }

  // ---------- la legge di Ohm ----------
  drawOhm() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const x0 = W * 0.16, x1 = W * 0.86, y0 = H * 0.2, y1 = H * 0.46, ym = (y0 + y1) / 2;
    const { I } = this.phys();
    // il circuito: la pila a sinistra, la resistenza in alto (con il voltmetro sopra), l'amperometro in basso
    const rx = W * 0.52, rw = 50;
    this.wire([[x0, ym - 27], [x0, y0], [rx - rw / 2, y0]]);
    this.wire([[rx + rw / 2, y0], [x1, y0], [x1, y1], [x0, y1], [x0, ym + 27]]);
    const zz = []; for (let i = 0; i <= 8; i++) zz.push([rx - rw / 2 + (rw * i) / 8, y0 + (i % 2 ? (i % 4 === 1 ? -7 : 7) : 0)]);
    this.line(zz, { color: this.c('orange'), width: 2.5 });
    this.text(`${p.R} Ω`, rx, y0 + 24, { size: 12, align: 'center', color: this.c('orange'), mono: true });
    this.electrons([[x0, ym + 27], [x0, y1], [x1, y1], [x1, y0], [x0, y0], [x0, ym - 27]], I);
    this.battery(x0, ym, `${p.V} V`);
    this.ammeter(W * 0.52, y1, this.live ? I : 0, { below: false });
    // il grafico corrente-tensione: la retta I = V/R per la resistenza scelta, e il punto misurato
    const gx0 = W * 0.17, gx1 = W * 0.9, gy0 = H * 0.9, gy1 = H * 0.58, X = (v) => gx0 + ((gx1 - gx0) * v) / 12, Y = (i) => gy0 - ((gy0 - gy1) * i) / 1.2;
    this.line([[gx0, gy1 - 6], [gx0, gy0], [gx1 + 6, gy0]], { color: this.c('muted'), width: 1.5 });
    for (let v = 0; v <= 12; v += 4) this.text(`${v}`, X(v), gy0 + 15, { size: 10.5, align: 'center', color: this.c('muted'), mono: true });
    for (const i of [0.4, 0.8, 1.2]) this.text(nice(i, 1), gx0 - 6, Y(i) + 4, { size: 10.5, align: 'right', color: this.c('muted'), mono: true });
    this.text(E ? i18n('volt') : 'V (V)', gx1, gy0 - 8, { size: 11, align: 'right', color: this.c('muted') });
    this.text(E ? i18n('ampere') : 'I (A)', gx0 + 6, gy1 - 8, { size: 11, color: this.c('muted') });
    [10, 20, 40].forEach((R) => this.line([[X(0), Y(0)], [X(12), Y(12 / R)]], { color: R === p.R ? this.c('orange') : this.c('edge'), width: R === p.R ? 2 : 1.2, dash: [5, 5], alpha: R === p.R ? 0.9 : 0.6 }));
    if (this.result) this.ball(X(p.V), Y(I), 5, { color: this.c('mint'), fill: 0.8, shine: false });
    const rows = [];
    if (E) {
      rows.push([i18n('La pila spinge con {v} volt', { v: p.V }), this.c('chalk'), 700], [i18n('la resistenza frena: {R} ohm', { R: p.R }), this.c('orange'), 500]);
      if (this.result) rows.push([i18n('passano {I} ampere', { I: nice(I, 2) }), this.c('mint'), 500]);
    } else {
      rows.push([i18n('V = {v} V, R = {R} Ω', { v: p.V, R: p.R }), this.c('chalk'), 700]);
      if (this.result) rows.push([i18n('I = V / R = {I} A', { I: nice(I, 2) }), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- due lampadine, in serie o in parallelo ----------
  drawTwo() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', s = this.phys();
    const x0 = W * 0.14, x1 = W * 0.86, y0 = H * 0.3, y1 = H * 0.8, bx = W * 0.5, kmax = (0.6 * 0.6 * RLAMP);
    const k = (P) => (this.live ? clamp01(Math.sqrt(P / kmax)) : 0);
    // la pila in basso, sdraiata, con il + a destra; l'amperometro accanto
    if (p.coll === 'serie') {
      const b1 = W * 0.36, b2 = W * 0.64;
      this.wire([[bx + 27, y1], [x1, y1], [x1, y0], [x0, y0], [x0, y1], [bx - 27, y1]]);
      this.electrons([[bx - 27, y1], [x0, y1], [x0, y0], [x1, y0], [x1, y1], [bx + 27, y1]], s.I);
      this.bulb(b1, y0, k(s.P1));
      this.bulb(b2, y0, k(s.P2), { out: p.svita });
      this.text('1', b1, y0 - 22, { size: 11.5, align: 'center', color: this.c('muted') });
      this.text('2', b2, y0 - (p.svita ? 34 : 22), { size: 11.5, align: 'center', color: this.c('muted') });
    } else {
      const ym = (y0 + y1) / 2 - H * 0.04;
      this.wire([[bx + 27, y1], [x1, y1], [x1, y0], [x0, y0], [x0, y1], [bx - 27, y1]]);
      this.wire([[x0, ym], [x1, ym]]);
      this.electrons([[bx - 27, y1], [x0, y1], [x0, y0], [x1, y0], [x1, y1], [bx + 27, y1]], s.I1);
      if (s.I2 > 0) this.electrons([[x0, ym], [x1, ym]], s.I2);
      this.bulb(bx, y0, k(s.P1));
      this.bulb(bx, ym, k(s.P2), { out: p.svita });
      this.text('1', bx, y0 - 22, { size: 11.5, align: 'center', color: this.c('muted') });
      this.text('2', bx, ym - (p.svita ? 34 : 22), { size: 11.5, align: 'center', color: this.c('muted') });
    }
    this.battery(bx, y1, '6 V', { flat: true });
    this.ammeter(W * 0.73, y1, this.live ? s.I : 0);
    if (p.svita) this.text(i18n('svitata'), p.coll === 'serie' ? W * 0.64 : bx, (p.coll === 'serie' ? y0 : (y0 + y1) / 2 - H * 0.04) + 30, { size: 11, align: 'center', color: this.c('coral') });
    const rows = [[p.coll === 'serie' ? (E ? i18n('Due lampadine in fila') : i18n('Due lampadine in serie')) : (E ? i18n('Due lampadine, ognuna con la sua strada') : i18n('Due lampadine in parallelo')), this.c('chalk'), 700]];
    if (this.result) {
      if (p.coll === 'serie') {
        if (p.svita) rows.push([i18n('svitata la 2: il giro è aperto'), this.c('coral'), 500], [i18n('si spegne anche la 1!'), this.c('coral'), 500]);
        else rows.push([E ? i18n('si dividono la pila: luce debole') : i18n('3 V ciascuna: un quarto della luce'), this.c('mint'), 500], [E ? i18n('corrente: {I} ampere', { I: nice(s.I, 2) }) : i18n('I = 6 V / 20 Ω = {I} A', { I: nice(s.I, 2) }), this.c('mint'), 500]);
      } else {
        if (p.svita) rows.push([i18n('svitata la 2: la 1 resta accesa'), this.c('mint'), 500], [E ? i18n('corrente: {I} ampere', { I: nice(s.I, 2) }) : i18n('I = {I} A, solo nella 1', { I: nice(s.I, 2) }), this.c('mint'), 500]);
        else rows.push([E ? i18n('ognuna ha tutta la pila: luce piena') : i18n('6 V ciascuna: luce piena'), this.c('mint'), 500], [E ? i18n('corrente: {I} ampere', { I: nice(s.I, 2) }) : i18n('I = 0,6 A + 0,6 A = {I} A', { I: nice(s.I, 2) }), this.c('mint'), 500]);
      }
    }
    this.box(rows);
  }

  // ---------- gli elettrodomestici di casa e il contatore ----------
  appliance(id, x, y, on, dark) {
    const g = this.ctx, col = on && !dark ? this.c('sun') : this.c('muted');
    const L = (pts, w = 2) => this.line(pts, { color: col, width: w });
    g.save();
    if (id === 'led') this.bulb(x, y, on && !dark ? 0.35 : 0, { r: 11 });
    else if (id === 'tv') { L([[x - 18, y - 13], [x + 18, y - 13], [x + 18, y + 9], [x - 18, y + 9], [x - 18, y - 13]]); L([[x - 7, y + 16], [x, y + 9], [x + 7, y + 16]]); if (on && !dark) { g.globalAlpha = 0.25; g.fillStyle = this.c('sky'); g.fillRect(x - 15, y - 10, 30, 16); } }
    else if (id === 'phon') { L([[x - 16, y - 8], [x + 8, y - 8], [x + 14, y - 4], [x + 14, y + 2], [x + 8, y + 6], [x - 16, y + 6], [x - 16, y - 8]]); L([[x - 6, y + 6], [x - 10, y + 18]], 3); if (on && !dark) [-4, 0, 4].forEach((d) => L([[x + 18, y - 1 + d], [x + 24, y - 1 + d * 1.4]], 1.5)); }
    else if (id === 'forno') { L([[x - 18, y - 15], [x + 18, y - 15], [x + 18, y + 15], [x - 18, y + 15], [x - 18, y - 15]]); L([[x - 13, y - 6], [x + 13, y - 6], [x + 13, y + 10], [x - 13, y + 10], [x - 13, y - 6]], 1.5); if (on && !dark) { g.globalAlpha = 0.35; g.fillStyle = this.c('orange'); g.fillRect(x - 12, y - 5, 24, 14); } }
    else { L([[x - 17, y - 17], [x + 17, y - 17], [x + 17, y + 17], [x - 17, y + 17], [x - 17, y - 17]]); g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.arc(x, y + 3, 9, 0, Math.PI * 2); g.stroke(); if (on && !dark) { g.beginPath(); g.arc(x, y + 3, 5, this.clock * 6, this.clock * 6 + 4); g.stroke(); } }
    g.restore();
  }

  drawHouse() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', s = this.phys();
    // gli apparecchi si accendono uno dopo l'altro; il contatore salta alla fine, se si è superato il limite
    const shown = this.live ? Math.min(APP.length, Math.floor(this.u * (APP.length + 0.6))) : 0;
    let P = 0; APP.forEach(([k, , w], i) => { if (p[k] && i < shown) P += w; });
    const dark = this.result && s.salta;
    // il contatore
    const cx = W * 0.5, cy = H * 0.27;
    g.save(); g.fillStyle = this.c('sim-bg'); g.fillRect(cx - 64, cy - 30, 128, 60); g.strokeStyle = dark ? this.c('coral') : this.c('chalk'); g.lineWidth = 2; g.strokeRect(cx - 64, cy - 30, 128, 60); g.restore();
    this.text(i18n('contatore'), cx, cy - 14, { size: 11, align: 'center', color: this.c('muted') });
    this.text(`${dark ? 0 : P} W`, cx, cy + 8, { size: 16, align: 'center', color: dark ? this.c('coral') : this.c('mint'), mono: true });
    this.text(dark ? i18n('saltato!') : i18n('massimo 3000 W'), cx, cy + 24, { size: 10.5, align: 'center', color: dark ? this.c('coral') : this.c('muted') });
    // la linea di casa e le prese
    const ly = H * 0.47, xs = APP.map((_, i) => W * (0.14 + 0.18 * i));
    this.line([[cx, cy + 30], [cx, ly], ], { color: dark ? this.c('muted') : this.c('chalk'), width: 2.5 });
    this.line([[xs[0], ly], [xs[APP.length - 1], ly]], { color: dark ? this.c('muted') : this.c('chalk'), width: 2.5 });
    APP.forEach(([k, name, w], i) => {
      const x = xs[i], y = H * 0.62, on = p[k];
      this.line([[x, ly], [x, y - 22]], { color: on && !dark ? this.c('chalk') : this.c('muted'), width: 2, dash: on ? null : [3, 4] });
      this.appliance(k, x, y, on && i < shown, dark);
      this.text({ led: i18n('lampadina'), tv: 'TV', phon: i18n('phon'), forno: i18n('forno'), lavatrice: i18n('lavatrice') }[k] || name, x, y + 34, { size: 10.5, align: 'center', color: on ? this.c('chalk') : this.c('muted') });
      this.text(`${w} W`, x, y + 48, { size: 10.5, align: 'center', color: on ? this.c('sun') : this.c('muted'), mono: true });
    });
    if (this.live && !dark) this.electrons([[cx, cy + 30], [cx, ly]], Math.min(2, P / 1000), { gap: 18, speed: 40 });
    const rows = [[E ? i18n('Accesi: {P} watt', { P: s.P }) : i18n('P = {P} W, I = P / V = {I} A', { P: s.P, I: nice(s.I, 1) }), this.c('chalk'), 700]];
    if (this.result) {
      if (s.salta) rows.push([E ? i18n('troppi! Il contatore salta') : i18n('oltre 3 kW: il contatore salta'), this.c('coral'), 500], [i18n('e la casa resta al buio'), this.c('coral'), 500]);
      else rows.push([E ? i18n('sotto i 3000 watt: tutto bene') : i18n('sotto i 3 kW del contatore: tutto bene'), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- le luci della giostra ----------
  drawString() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const n = p.n, Vl = p.V / n, stato = catena(p.V, n);
    // la giostra: il palo, il tetto a cono, il bordo a festoni
    const cx = W * 0.5, top = H * 0.17, ey = H * 0.4, xa = W * 0.12, xb = W * 0.88;
    this.line([[cx, top - 10], [cx, H * 0.84]], { color: this.c('chalk'), width: 3 });
    this.line([[xa, ey], [cx, top], [xb, ey]], { color: this.c('pink'), width: 2.6 });
    for (let i = 0; i < 8; i++) { const x = xa + ((xb - xa) * (i + 0.5)) / 8; g.save(); g.strokeStyle = this.c('pink'); g.lineWidth = 2; g.beginPath(); g.arc(x, ey, (xb - xa) / 16, 0, Math.PI); g.stroke(); g.restore(); }
    this.ground(H * 0.86);
    this.line([[W * 0.22, H * 0.86], [W * 0.22, H * 0.78], [W * 0.78, H * 0.78], [W * 0.78, H * 0.86]], { color: this.c('muted'), width: 2 });
    // la catena di lampadine lungo il bordo del tetto, in serie, fino alla pila
    const by = ey + (xb - xa) / 16 + 10, bx = W * 0.07, py = H * 0.64;
    this.line([[bx, py - 27], [bx, by], [xb, by], [xb + W * 0.06, by], [xb + W * 0.06, H * 0.72], [bx, H * 0.72], [bx, py + 27]], { color: this.c('chalk'), width: 1.8, alpha: 0.8 });
    const t = this.running ? this.t : this.result ? 99 : 0;
    // le lampadine giuste sono piene; le deboli un po'; le bruciate fanno un lampo e si spengono
    let k = clamp01((Vl / VLAMP) ** 2);
    if (stato === 'bruciate') k = t < 0.5 ? 1 : 0;
    if (!this.live) k = 0;
    for (let i = 0; i < n; i++) {
      const x = xa + ((xb - xa) * (i + 0.5)) / n;
      this.bulb(x, by, k, { r: Math.min(10, ((xb - xa) / n) * 0.35), burnt: this.live && stato === 'bruciate' && t >= 0.5, glow: 0.45 });
    }
    this.battery(bx, py, '', { len: 50 });
    this.text(`${p.V} V`, bx + 16, py + 4, { size: 12, color: this.c('sun'), mono: true });
    const rows = [[E ? i18n('{n} lampadine, pila da {v} volt', { n, v: p.V }) : i18n('n = {n}, V = {v} V', { n, v: p.V }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('ognuna ha {vl} volt', { vl: nice(Vl, 1) }) : i18n('ogni lampadina: V / n = {vl} V', { vl: nice(Vl, 2) }), this.c('chalk'), 500]);
      if (stato === 'giuste') rows.push([E ? i18n('giuste: 3 volt ciascuna!') : i18n('3 V ciascuna: luce piena'), this.c('mint'), 500]);
      else if (stato === 'deboli') rows.push([E ? i18n('troppe: fanno poca luce') : i18n('meno di 3 V: luce debole'), this.c('coral'), 500]);
      else rows.push([E ? i18n('troppo poche: si bruciano!') : i18n('più di 3 V: si bruciano'), this.c('coral'), 500]);
    }
    this.box(rows);
  }

  // ---------- la scatola misteriosa ----------
  drawBox() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', s = this.phys();
    const bx0 = W * 0.36, bx1 = W * 0.88, by0 = H * 0.42, by1 = H * 0.74, ax = W * 0.5, bxB = W * 0.74;
    // la pila fuori, collegata alla scatola con due fili; l'amperometro su un filo
    const px = W * 0.13, py = (by0 + by1) / 2;
    this.wire([[px, py - 27], [px, by0 + 20], [bx0, by0 + 20]]);
    this.wire([[px, py + 27], [px, by1 - 20], [bx0, by1 - 20]]);
    this.battery(px, py, '6 V');
    this.ammeter(W * 0.26, by1 - 20, this.live ? s.I : 0);
    // la scatola nera, con i fili nascosti
    g.save(); g.fillStyle = '#000'; g.fillRect(bx0, by0, bx1 - bx0, by1 - by0); g.strokeStyle = this.c('edge'); g.lineWidth = 2; g.strokeRect(bx0, by0, bx1 - bx0, by1 - by0); g.restore();
    this.text('?', (bx0 + bx1) / 2, (by0 + by1) / 2 + 12, { size: 34, align: 'center', color: this.c('muted'), weight: 700 });
    // le due lampadine sopra la scatola
    const lit = this.live, kA = lit && !p.svitaA && s.I > 0 ? s.k : 0, kB = lit && s.B ? s.k : 0;
    [[ax, 'A'], [bxB, 'B']].forEach(([x, name]) => {
      this.line([[x - 8, by0], [x - 8, by0 - 12], [x + 8, by0 - 12], [x + 8, by0]], { color: this.c('muted'), width: 2 });
      this.text(name, x, by0 + 18, { size: 12, align: 'center', color: this.c('chalk'), weight: 700 });
    });
    this.bulb(ax, by0 - 26, kA, { out: p.svitaA });
    this.bulb(bxB, by0 - 26, kB);
    if (p.svitaA) this.text(i18n('svitata'), ax, by0 - 62, { size: 11, align: 'center', color: this.c('coral') });
    const rows = [[p.svitaA ? i18n('La lampadina A è svitata') : i18n('Le due lampadine sono avvitate'), this.c('chalk'), 700]];
    if (this.result) {
      if (p.svitaA) rows.push([s.B ? i18n('la B resta accesa!') : i18n('si è spenta anche la B!'), s.B ? this.c('mint') : this.c('coral'), 500]);
      else rows.push([s.k < 1 ? i18n('accese tutte e due, ma deboli') : i18n('accese tutte e due, con luce piena'), this.c('mint'), 500]);
      if (!E) rows.push([i18n('amperometro: {I} A', { I: nice(s.I, 2) }), this.c('mint'), 500]);
    }
    this.box(rows);
  }
}
