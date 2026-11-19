// Colori e spettro (OT03). Sette modi:
//   - 'prisma': un raggio di luce attraversa un prisma di vetro. La luce bianca si apre nei sette colori (dispersione):
//     il violetto si piega più del rosso. Un colore solo si piega, ma resta quello.
//   - 'newton': l'esperimento cruciale. Una fessura lascia passare solo il verde verso un secondo prisma: esce verde.
//     Oppure una lente raccoglie tutti i colori su un secondo prisma capovolto: torna la luce bianca.
//   - 'arcobaleno': il Sole alle spalle, alto 'sole' gradi; davanti la pioggia. L'arcobaleno è un cerchio di 42° attorno
//     al punto opposto al Sole (l'ombra della tua testa): la cima è a 42° − sole sopra l'orizzonte. In alto a destra,
//     una goccia: la luce entra, si riflette dietro ed esce con i colori separati.
//   - 'luci': tre torce, rossa, verde e blu, su un muro: dove si sovrappongono, i colori si sommano.
//   - 'oggetti': una mela, una banana, una foglia o un foglio, sotto una luce bianca, rossa, verde o blu. Un oggetto
//     rimanda solo i suoi colori: se nella luce non ci sono, sembra nero.
//   - 'fontana': la fontana del parco con il Sole alle spalle; si alza lo sguardo di 'alto' gradi. L'arcobaleno si vede
//     solo guardando a 42° − sole.
//   - 'herschel': un termometro nello spettro di un prisma, o oltre il rosso, o all'ombra per confronto. Oltre il rosso
//     non si vede niente, eppure scalda più di tutti: è l'infrarosso.
// Risultato: prisma { luce, colori }; newton { secondo, colori, bianca }; arcobaleno { sole, cima, visto };
//            luci { r, g, b, mix }; oggetti { luce, cosa, visto }; fontana { sole, alto, preso }; herschel { pos, dT }
import { t as i18n } from '../i18n.js';
import { Sim, clamp01 } from './base.js';

// i sette colori di Newton, con un indice di rifrazione esagerato perché il ventaglio si veda bene
export const SPETTRO = [
  { k: 'rosso', c: '#ff4b4b', n: 1.45 }, { k: 'arancione', c: '#ff9b3d', n: 1.48 }, { k: 'giallo', c: '#ffe14d', n: 1.51 },
  { k: 'verde', c: '#4fe36b', n: 1.54 }, { k: 'blu', c: '#3d8bff', n: 1.58 }, { k: 'indaco', c: '#6b5bff', n: 1.61 }, { k: 'violetto', c: '#b05bff', n: 1.65 },
];
const ONE = { rossa: 0, verde: 3, blu: 4 };
export const LIGHT = { bianca: [1, 1, 1], rossa: [1, 0, 0], verde: [0, 1, 0], blu: [0, 0, 1] };
export const OBJ = { mela: [1, 0, 0], banana: [1, 1, 0], foglia: [0, 1, 0], foglio: [1, 1, 1] };
const NAME = { 100: 'rosso', '010': 'verde', '001': 'blu', 110: 'giallo', 101: 'magenta', '011': 'ciano', 111: 'bianco', '000': 'nero' };
const HEX = { rosso: '#ff4b4b', verde: '#4fe36b', blu: '#3d8bff', giallo: '#ffe14d', magenta: '#ff5bf0', ciano: '#4bf0ff', bianco: '#f4f4f4', nero: '#000' };
export const colorName = (rgb) => NAME[rgb.map((x) => (x ? 1 : 0)).join('')];
export const HEAT = { blu: 2, verde: 3, rosso: 6, oltre: 8, fuori: 0 };
export const BOW = 42; // gradi: il rosso dell'arcobaleno è a 42° dal punto opposto al Sole
const DUR = { prisma: 1.4, newton: 1.8, arcobaleno: 1.4, luci: 1.2, oggetti: 1.2, fontana: 1.4, herschel: 2 };
const RAD = Math.PI / 180;

// rifrazione con i vettori: d direzione (unitaria), m normale (unitaria, dalla parte da cui arriva il raggio), r = n1/n2
const refr = (d, m, r) => { const c = -(m[0] * d[0] + m[1] * d[1]), k = 1 - r * r * (1 - c * c); if (k < 0) return null; const t = r * c - Math.sqrt(k); return [r * d[0] + t * m[0], r * d[1] + t * m[1]]; };
// dove la semiretta p + s·d incontra il segmento ab
const hit = (p, d, a, b) => {
  const ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
  if (Math.abs(den) < 1e-9) return null;
  const s = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den, t = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
  return s > 1e-6 && t >= 0 && t <= 1 ? [p[0] + s * d[0], p[1] + s * d[1]] : null;
};
// la normale di una faccia ab, rivolta verso l'esterno (lontano dal terzo vertice c)
const outN = (a, b, c) => { let m = [b[1] - a[1], a[0] - b[0]]; const l = Math.hypot(m[0], m[1]); m = [m[0] / l, m[1] / l]; return m[0] * (c[0] - a[0]) + m[1] * (c[1] - a[1]) > 0 ? [-m[0], -m[1]] : m; };
// un prisma equilatero di lato L, centrato in (x, y): con la punta in su, o in giù
const prism = (x, y, L, down = false) => { const k = down ? -1 : 1; return { A: [x, y - k * 0.577 * L], B: [x - L / 2, y + k * 0.289 * L], C: [x + L / 2, y + k * 0.289 * L] }; };
// il raggio che entra dalla faccia AB ed esce dalla AC: [ingresso, uscita, direzione d'uscita]
const through = (P, d0, pr, n) => {
  const d1 = refr(d0, outN(pr.A, pr.B, pr.C), 1 / n); if (!d1) return null;
  const P2 = hit(P, d1, pr.A, pr.C); if (!P2) return null;
  const m = outN(pr.A, pr.C, pr.B), d2 = refr(d1, [-m[0], -m[1]], n); if (!d2) return null;
  return [P, P2, d2];
};
const along = (p, d, x) => { const s = (x - p[0]) / d[0]; return [x, p[1] + s * d[1]]; };

export class Colors extends Sim {
  static tall = true;
  static controls = {
    luce: { label: 'La luce', type: 'select', options: [['bianca', 'bianca'], ['rossa', 'rossa'], ['verde', 'verde'], ['blu', 'blu']] },
    sole: { label: 'Altezza del Sole', min: 0, max: 60, step: 5, unit: '°' },
    r: { label: 'Luce rossa', type: 'toggle' },
    g: { label: 'Luce verde', type: 'toggle' },
    b: { label: 'Luce blu', type: 'toggle' },
    cosa: { label: 'L’oggetto', type: 'select', options: [['mela', 'mela'], ['banana', 'banana'], ['foglia', 'foglia'], ['foglio', 'foglio']] },
    alto: { label: 'Altezza dello sguardo', labelE: 'Dove guardi', min: 0, max: 60, step: 1, unit: '°' },
    pos: { label: 'Il termometro', type: 'select', options: [['blu', 'nel blu'], ['verde', 'nel verde'], ['rosso', 'nel rosso'], ['oltre', 'oltre il rosso'], ['fuori', 'all’ombra']] },
  };

  defaults() { return { mode: 'prisma', luce: 'bianca', secondo: 'fessura', sole: 20, r: true, g: false, b: false, cosa: 'mela', alto: 10, pos: 'rosso', lens: 's' }; }

  get dur() { return DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params;
    switch (p.mode) {
      case 'newton': return this.finish({ secondo: p.secondo, colori: p.secondo === 'fessura' ? 1 : 7, bianca: p.secondo !== 'fessura' });
      case 'arcobaleno': return this.finish({ sole: p.sole, cima: Math.max(0, BOW - p.sole), visto: p.sole < BOW });
      case 'luci': return this.finish({ r: !!p.r, g: !!p.g, b: !!p.b, mix: colorName([p.r, p.g, p.b]) });
      case 'oggetti': { const l = LIGHT[p.luce], o = OBJ[p.cosa]; return this.finish({ luce: p.luce, cosa: p.cosa, visto: colorName(l.map((x, i) => x && o[i])) }); }
      case 'fontana': return this.finish({ sole: p.sole, alto: p.alto, preso: Math.abs(p.alto - (BOW - p.sole)) <= 1.5 });
      case 'herschel': return this.finish({ pos: p.pos, dT: HEAT[p.pos] ?? 0 });
      default: return this.finish({ luce: p.luce, colori: p.luce === 'bianca' ? 7 : 1 });
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'newton') this.drawNewton();
    else if (m === 'arcobaleno') this.drawBow(false);
    else if (m === 'fontana') this.drawBow(true);
    else if (m === 'luci') this.drawLights();
    else if (m === 'oggetti') this.drawObjects();
    else if (m === 'herschel') this.drawHerschel();
    else this.drawPrism();
  }

  // ---------- pezzi da disegno ----------
  ray(pts, u, { color, width = 2.2, alpha = 1, dash } = {}) { this.line(pts, { color: color || this.c('chalk'), width, alpha, dash, upto: u }); }

  glass(pr, alpha = 1) {
    const g = this.ctx;
    g.save(); g.beginPath(); g.moveTo(...pr.A); g.lineTo(...pr.B); g.lineTo(...pr.C); g.closePath();
    g.fillStyle = this.c('sky'); g.globalAlpha = 0.14 * alpha; g.fill();
    g.globalAlpha = alpha; g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.lineJoin = 'round'; g.stroke(); g.restore();
  }

  // una lampada con una fessura, che manda un raggio nella direzione d
  lamp(p, d) {
    const g = this.ctx;
    g.save(); g.translate(p[0], p[1]); g.rotate(Math.atan2(d[1], d[0]));
    g.fillStyle = this.c('edge'); g.fillRect(-30, -11, 28, 22); g.fillStyle = this.c('sun'); g.globalAlpha = this.live ? 1 : 0.4; g.fillRect(-4, -3, 4, 6);
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

  // ---------- la luce bianca nel prisma ----------
  drawPrism() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const L = Math.min(W * 0.42, H * 0.36), pr = prism(W * 0.36, H * 0.5, L), d0 = [Math.cos(18.6 * RAD), -Math.sin(18.6 * RAD)];
    const P = [pr.B[0] + 0.55 * (pr.A[0] - pr.B[0]), pr.B[1] + 0.55 * (pr.A[1] - pr.B[1])], src = [P[0] - 72 * d0[0], P[1] - 72 * d0[1]], xs = W - 16;
    const cols = p.luce === 'bianca' ? SPETTRO : [SPETTRO[ONE[p.luce] ?? 0]];
    // lo schermo
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.08; g.fillRect(xs, 40, 10, H - 80); g.restore();
    this.line([[xs, 40], [xs, H - 40]], { color: this.c('chalk'), width: 3 });
    this.lamp(src, d0);
    const u1 = clamp01(u * 3), u2 = clamp01(u * 3 - 1), u3 = clamp01(u * 3 - 2);
    if (this.live) this.ray([src, P], u1, { color: cols.length > 1 ? this.c('chalk') : cols[0].c, width: 3.5 });
    else this.line([src, P], { color: this.c('chalk'), width: 1, dash: [3, 6], alpha: 0.5 });
    const ends = [];
    if (this.live) cols.forEach((s) => {
      const t = through(P, d0, pr, s.n); if (!t) return;
      const end = along(t[1], t[2], xs);
      if (u2 > 0) this.ray([t[0], t[1]], u2, { color: s.c, width: cols.length > 1 ? 1.4 : 2.8, alpha: 0.9 });
      if (u3 > 0) this.ray([t[1], end], u3, { color: s.c, width: cols.length > 1 ? 2.2 : 3.2 });
      ends.push([end[1], s.c]);
    });
    this.glass(pr);
    // dove arrivano: una striscia di colori sullo schermo
    if (u3 >= 1) ends.forEach(([y, c], i) => {
      const h = ends.length > 1 ? Math.abs(ends[Math.min(i + 1, ends.length - 1)][0] - ends[Math.max(i - 1, 0)][0]) / 2 + 2 : 10;
      g.save(); g.fillStyle = c; g.fillRect(xs - 2, y - h / 2, 8, h); g.restore();
    });
    const one = p.luce !== 'bianca', name = i18n(p.luce);
    const rows = [[E ? i18n('Luce {l} nel prisma', { l: name }) : one ? i18n('luce {l}, un colore solo', { l: name }) : i18n('luce bianca, prisma di vetro'), this.c('chalk'), 700]];
    if (this.result) rows.push([one ? (E ? i18n('si piega, ma resta un colore solo') : i18n('si piega, ma non si divide'))
      : E ? i18n('ne escono tutti i colori dell’arcobaleno!') : i18n('dispersione: il violetto si piega più del rosso'), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'esperimento cruciale di Newton ----------
  drawNewton() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, slit = p.secondo === 'fessura';
    const L = Math.min(W * 0.27, H * 0.24), pr = prism(W * 0.2, H * 0.42, L), d0 = [Math.cos(18.6 * RAD), -Math.sin(18.6 * RAD)];
    const P = [pr.B[0] + 0.55 * (pr.A[0] - pr.B[0]), pr.B[1] + 0.55 * (pr.A[1] - pr.B[1])], src = [P[0] - 50 * d0[0], P[1] - 50 * d0[1]], xs = W - 14;
    const xb = W * 0.52, u1 = clamp01(u * 3), u2 = clamp01(u * 3 - 1), u3 = clamp01(u * 3 - 2);
    this.line([[xs, 50], [xs, H - 40]], { color: this.c('chalk'), width: 3 });
    this.lamp(src, d0);
    if (this.live) this.ray([src, P], u1, { width: 3.5 });
    const fan = SPETTRO.map((s) => { const t = through(P, d0, pr, s.n); return { s, t, end: t && along(t[1], t[2], xb) }; }).filter((f) => f.t);
    if (this.live && u2 > 0) fan.forEach(({ s, t, end }) => { this.ray([t[0], t[1]], u2, { color: s.c, width: 1.2 }); this.ray([t[1], end], u2, { color: s.c, width: 1.8 }); });
    this.glass(pr);
    const green = fan.find((f) => f.s.k === 'verde');
    if (slit) {
      // la tavola con la fessura, all'altezza del verde
      const ys = green.end[1];
      this.line([[xb, 46], [xb, ys - 4]], { color: this.c('muted'), width: 5 }); this.line([[xb, ys + 4], [xb, H - 60]], { color: this.c('muted'), width: 5 });
      // il secondo prisma è capovolto: il verde si piega di nuovo, all'insù, ma resta verde
      const L2 = L * 0.9, cx2 = W * 0.74, P2 = along(green.end, green.t[2], cx2 - L2 / 4), pr2 = prism(cx2, P2[1] - 0.144 * L2, L2, true);
      const t2 = through(P2, green.t[2], pr2, green.s.n);
      if (this.live && u3 > 0 && t2) {
        this.ray([green.end, P2, t2[1], along(t2[1], t2[2], xs)], u3, { color: green.s.c, width: 2.8 });
        if (u3 >= 1) { const y = along(t2[1], t2[2], xs)[1]; g.save(); g.fillStyle = green.s.c; g.fillRect(xs - 2, y - 5, 8, 10); g.restore(); }
      }
      this.glass(pr2);
    } else {
      // una lente raccoglie i colori su un secondo prisma, capovolto: ne esce un raggio bianco
      const L2 = L * 0.9, cx2 = W * 0.74, cy2 = H * 0.5, pr2 = prism(cx2, cy2, L2, true);
      const P2 = [cx2 - L2 / 4, cy2 + 0.144 * L2], P3 = [cx2 + L2 / 4, cy2 + 0.144 * L2], dw = d0;
      const ym = fan.map((f) => f.end[1]), top = Math.min(...ym) - 10, bot = Math.max(...ym) + 10;
      g.save(); g.beginPath(); g.ellipse(xb, (top + bot) / 2, 5, (bot - top) / 2 + 6, 0, 0, 2 * Math.PI); g.fillStyle = this.c('sky'); g.globalAlpha = 0.25; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.stroke(); g.restore();
      if (this.live && u3 > 0) {
        fan.forEach(({ s, end }) => this.ray([end, P2, P3], u3, { color: s.c, width: 1.6 }));
        if (u3 >= 1) this.ray([P3, along(P3, dw, xs)], 1, { width: 3.5 });
      }
      this.glass(pr2);
    }
    const rows = [[slit ? (E ? i18n('Un forellino lascia passare solo il verde') : i18n('fessura sul verde, poi un secondo prisma'))
      : E ? i18n('Una lente e un secondo prisma, capovolto') : i18n('lente e secondo prisma capovolto'), this.c('chalk'), 700]];
    if (this.result) rows.push([slit ? (E ? i18n('esce solo verde: un colore non si divide più') : i18n('resta verde: un colore puro non si divide'))
      : E ? i18n('i colori si rimescolano: torna la luce bianca!') : i18n('i colori si ricompongono: luce bianca'), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'arcobaleno, e la fontana del parco ----------
  drawBow(fountain) {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const yh = H * 0.7, k = Math.min((W / 2 - 10) / (BOW + 3), (yh - 60) / 50), cx = W / 2, cy = yh + p.sole * k;
    const goal = BOW - p.sole, hitIt = Math.abs(p.alto - goal) <= 1.5;
    const show = fountain ? this.result && hitIt : this.live;
    // la pioggia (o gli spruzzi della fontana)
    g.save(); g.strokeStyle = this.c('sky'); g.globalAlpha = 0.22; g.lineWidth = 1;
    for (let i = 0; i < 90; i++) { const x = ((i * 73) % 997) / 997 * W, y = 40 + ((i * 151) % 991) / 991 * (yh - 50); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y + 7); g.stroke(); }
    g.restore();
    if (fountain) {
      // la fontana: un getto d'acqua che sale e ricade
      g.save(); g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.globalAlpha = 0.55;
      for (let j = -3; j <= 3; j++) { g.beginPath(); g.moveTo(cx + j * 4, yh - 4); g.quadraticCurveTo(cx + j * W * 0.035, yh - H * (0.42 - 0.04 * Math.abs(j)), cx + j * W * 0.075 + Math.sign(j) * 8, yh - 2); g.stroke(); }
      g.globalAlpha = 0.8; g.beginPath(); g.ellipse(cx, yh - 2, W * 0.3, 6, 0, 0, 2 * Math.PI); g.stroke();
      g.restore();
    }
    // l'arcobaleno: un cerchio di 42° attorno al punto opposto al Sole, solo la parte sopra l'orizzonte
    if (show) {
      g.save(); g.beginPath(); g.rect(0, 0, W, yh); g.clip();
      g.globalAlpha = fountain ? 0.95 : u;
      SPETTRO.forEach((s, i) => { g.strokeStyle = s.c; g.lineWidth = k * 0.9; g.beginPath(); g.arc(cx, cy, (BOW - i * 0.8) * k, Math.PI, 2 * Math.PI); g.stroke(); });
      g.restore();
    }
    // l'orizzonte, e chi guarda (di spalle), con il Sole dietro
    this.ground(yh, { x0: 8, x1: W - 8 });
    // chi guarda, di spalle: un omino stilizzato
    const hx = cx, hy = yh + Math.min(38, (H - yh) * 0.28);
    this.ball(hx, hy, 9, { color: this.c('orange'), fill: 0.6, width: 2.4, shine: false });
    this.line([[hx, hy + 9], [hx, hy + 44]], { color: this.c('orange'), width: 3 });
    this.line([[hx - 13, hy + 36], [hx, hy + 18], [hx + 13, hy + 36]], { color: this.c('orange'), width: 3 });
    this.line([[hx - 10, hy + 70], [hx, hy + 44], [hx + 10, hy + 70]], { color: this.c('orange'), width: 3 });
    // l'ombra della testa: il centro dell'arcobaleno
    if (!E && this.live && !fountain) this.line([[hx, hy], [cx, Math.min(cy, H - 8)]], { color: this.c('muted'), width: 1.2, dash: [3, 4] });
    if (fountain) {
      const ya = yh - p.alto * k;
      this.line([[hx, hy], [cx, ya]], { color: this.c('sun'), width: 1.6, dash: [5, 4], alpha: 0.9 });
      this.ball(cx, ya, 7, { color: show ? this.c('mint') : this.c('sun'), fill: 0.25, width: 2, shine: false });
    }
    this.ball(W - 24, H - 22, 9, { color: this.c('sun'), fill: 0.7, width: 2, shine: false });
    this.text(i18n('Sole alle spalle'), W - 38, H - 18, { size: 10.5, align: 'right', color: this.c('sun') });
    if (!fountain) this.drop(W - 54, 70, 30);
    const rows = [[E ? i18n('Il Sole è alle tue spalle, alto {s} gradi', { s: p.sole }) : i18n('Sole a {s}° sull’orizzonte, alle spalle', { s: p.sole }), this.c('chalk'), 700]];
    if (fountain) {
      rows.push([E ? i18n('guardi {a} gradi sopra l’orizzonte', { a: p.alto }) : i18n('sguardo a {a}° sull’orizzonte', { a: p.alto }), this.c('sun'), 500]);
      if (this.result) rows.push([hitIt ? (E ? i18n('Arcobaleno!') : i18n('arcobaleno: 42° − {s}° = {a}°', { s: p.sole, a: p.alto })) : E ? i18n('solo spruzzi: niente colori') : i18n('nessun arcobaleno in quella direzione'), hitIt ? this.c('mint') : this.c('coral'), 700]);
    } else if (this.result) {
      rows.push([goal > 0 ? (E ? i18n('l’arcobaleno arriva a {t} gradi sopra l’orizzonte', { t: goal }) : i18n('cima dell’arco a 42° − {s}° = {t}°', { s: p.sole, t: goal }))
        : E ? i18n('Sole troppo alto: l’arcobaleno è sotto l’orizzonte') : i18n('Sole sopra i 42°: l’arco è sotto l’orizzonte'), goal > 0 ? this.c('mint') : this.c('coral'), 700]);
    }
    this.box(rows);
  }

  // una goccia d'acqua: la luce bianca entra, si riflette sul fondo ed esce, con il rosso e il violetto separati
  drop(ox, oy, r) {
    const g = this.ctx;
    g.save(); g.beginPath(); g.arc(ox, oy, r, 0, 2 * Math.PI); g.fillStyle = this.c('sky'); g.globalAlpha = 0.15; g.fill(); g.globalAlpha = 0.9; g.strokeStyle = this.c('sky'); g.lineWidth = 1.6; g.stroke(); g.restore();
    const b = 0.86 * r, E1 = [ox - Math.sqrt(r * r - b * b), oy - b], d0 = [1, 0];
    this.line([[E1[0] - 34, E1[1]], E1], { color: this.c('chalk'), width: 2 });
    [['#ff4b4b', 1.331], ['#b05bff', 1.4]].forEach(([c, n]) => {
      const m1 = [(E1[0] - ox) / r, (E1[1] - oy) / r], d1 = refr(d0, m1, 1 / n);
      const s1 = -2 * ((E1[0] - ox) * d1[0] + (E1[1] - oy) * d1[1]), E2 = [E1[0] + s1 * d1[0], E1[1] + s1 * d1[1]];
      const m2 = [(E2[0] - ox) / r, (E2[1] - oy) / r], dot = d1[0] * m2[0] + d1[1] * m2[1], d2 = [d1[0] - 2 * dot * m2[0], d1[1] - 2 * dot * m2[1]];
      const s2 = -2 * ((E2[0] - ox) * d2[0] + (E2[1] - oy) * d2[1]), E3 = [E2[0] + s2 * d2[0], E2[1] + s2 * d2[1]];
      const m3 = [(E3[0] - ox) / r, (E3[1] - oy) / r], d3 = refr(d2, [-m3[0], -m3[1]], n) || d2;
      this.line([E1, E2, E3, [E3[0] + 34 * d3[0], E3[1] + 34 * d3[1]]], { color: c, width: 1.4, alpha: 0.95 });
    });
    this.text(i18n('una goccia'), ox, oy + r + 14, { size: 10, align: 'center', color: this.c('muted') });
  }

  // ---------- tre torce colorate ----------
  drawLights() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, u = this.u;
    const R = Math.min(W, H) * 0.25, cx = W / 2, cy = H * 0.42, d = R * 0.62;
    const lamps = [['r', '#ff0000', [cx - d, cy - d * 0.45], [W * 0.22, H - 34]], ['g', '#00ff00', [cx + d, cy - d * 0.45], [W * 0.78, H - 34]], ['b', '#0000ff', [cx, cy + d * 0.75], [W * 0.5, H - 26]]];
    // le macchie di luce sul muro: dove si sovrappongono, i colori si sommano
    if (this.live) {
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = u;
      lamps.forEach(([k, c, [x, y]]) => { if (!p[k]) return; g.fillStyle = c; g.beginPath(); g.arc(x, y, R, 0, 2 * Math.PI); g.fill(); });
      g.restore();
    }
    // le torce, in basso
    lamps.forEach(([k, c, [x, y], [tx, ty]]) => {
      if (this.live && p[k]) { g.save(); g.globalAlpha = 0.18 * u; g.fillStyle = c; g.beginPath(); g.moveTo(tx - 8, ty - 10); g.lineTo(x - R * 0.5, y); g.lineTo(x + R * 0.5, y); g.lineTo(tx + 8, ty - 10); g.closePath(); g.fill(); g.restore(); }
      g.save(); g.translate(tx, ty); g.rotate(Math.atan2(y - ty, x - tx) + Math.PI / 2);
      g.fillStyle = this.c('edge'); g.fillRect(-9, -2, 18, 26); g.fillStyle = c; g.globalAlpha = p[k] ? 1 : 0.25; g.fillRect(-10, -8, 20, 7); g.restore();
    });
    const on = ['r', 'g', 'b'].filter((k) => p[k]), names = { r: i18n('rossa'), g: i18n('verde'), b: i18n('blu') };
    const rows = [[on.length ? i18n('Torce accese: {k}', { k: on.map((k) => names[k]).join(' + ') }) : i18n('Nessuna torcia accesa'), this.c('chalk'), 700]];
    if (this.result) { const mix = colorName([p.r, p.g, p.b]); rows.push([mix === 'nero' ? i18n('tutto buio') : i18n('al centro: {c}', { c: i18n(mix) }), this.c('mint'), 700]); }
    this.box(rows);
  }

  // ---------- il colore delle cose ----------
  drawObjects() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const yt = H * 0.7, ox = W * 0.56, oy = yt - 44, l = LIGHT[p.luce], o = OBJ[p.cosa], seen = colorName(l.map((x, i) => x && o[i]));
    const lc = colorName(l), lamp = [W * 0.16, H * 0.2];
    this.ground(yt, { x0: 10, x1: W - 10 });
    // la lampada e il suo fascio
    if (this.live) { g.save(); g.globalAlpha = 0.16 * u; g.fillStyle = HEX[lc]; g.beginPath(); g.moveTo(lamp[0], lamp[1]); g.lineTo(ox - 80, yt); g.lineTo(ox + 80, yt); g.closePath(); g.fill(); g.restore(); }
    this.ball(lamp[0], lamp[1], 12, { color: HEX[lc], fill: this.live ? 0.8 : 0.2, width: 2, shine: false });
    // l'oggetto: al buio solo il contorno; con la luce, del colore che rimanda
    const fill = this.live ? HEX[seen] : null, stroke = this.live && seen !== 'nero' ? HEX[seen] : this.c('muted');
    g.save(); g.lineWidth = 2.5; g.strokeStyle = stroke; g.globalAlpha = this.live ? 0.3 + 0.7 * u : 1;
    if (fill) g.fillStyle = fill;
    g.beginPath();
    if (p.cosa === 'mela') { g.arc(ox, oy, 34, 0, 2 * Math.PI); }
    else if (p.cosa === 'banana') { g.moveTo(ox - 48, oy - 20); g.quadraticCurveTo(ox, oy + 50, ox + 48, oy - 20); g.quadraticCurveTo(ox, oy + 22, ox - 48, oy - 20); }
    else if (p.cosa === 'foglia') { g.moveTo(ox - 46, oy + 10); g.quadraticCurveTo(ox, oy - 52, ox + 46, oy + 10); g.quadraticCurveTo(ox, oy + 44, ox - 46, oy + 10); }
    else g.rect(ox - 34, oy - 40, 68, 84);
    if (fill) g.fill();
    g.stroke(); g.restore();
    if (p.cosa === 'mela') this.line([[ox, oy - 34], [ox + 4, oy - 46]], { color: this.c('muted'), width: 3 });
    const objName = { mela: i18n('Una mela rossa'), banana: i18n('Una banana gialla'), foglia: i18n('Una foglia verde'), foglio: i18n('Un foglio bianco') }[p.cosa];
    const rows = [[i18n('{o} sotto la luce {l}', { o: objName, l: i18n(p.luce) }), this.c('chalk'), 700]];
    if (!E) rows.push([{ mela: i18n('la mela rimanda solo il rosso'), banana: i18n('la banana rimanda il rosso e il verde'), foglia: i18n('la foglia rimanda solo il verde'), foglio: i18n('il foglio rimanda tutti i colori') }[p.cosa], this.c('muted'), 500]);
    if (this.result) rows.push([i18n('Sembra di colore {c}', { c: i18n(seen) }), seen === 'nero' ? this.c('coral') : this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'esperimento di Herschel ----------
  drawHerschel() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const yt = H * 0.66, band = 24, xr = W * 0.42, xv = W - 16, w7 = (xv - xr) / 7;
    const X = { rosso: xr + 0.5 * w7, verde: xr + 3.5 * w7, blu: xr + 4.5 * w7, oltre: W * 0.27, fuori: W * 0.09 };
    // il prisma, in alto, apre la luce del Sole in uno spettro sul tavolo: dal rosso (a sinistra) al violetto
    const pr = prism(W * 0.66, H * 0.17, 34);
    this.line([[W - 6, H * 0.08], [pr.C[0] - 4, H * 0.17]], { color: this.c('chalk'), width: 2.2 });
    SPETTRO.forEach((s, i) => this.line([[pr.B[0] + 10, pr.B[1] - 4], [xr + (i + 0.5) * w7, yt - band / 2]], { color: s.c, width: 1.2, alpha: 0.35 }));
    this.glass(pr);
    this.line([[8, yt + band / 2 + 4], [W - 8, yt + band / 2 + 4]], { color: this.c('edge'), width: 2 });
    SPETTRO.forEach((s, i) => { g.save(); g.fillStyle = s.c; g.globalAlpha = 0.85; g.fillRect(xr + i * w7, yt - band / 2, w7 + 0.5, band); g.restore(); });
    this.text(E ? i18n('qui non si vede niente') : i18n('oltre il rosso: buio'), X.oltre, yt + band / 2 + 20, { size: 10.5, align: 'center', color: this.c('muted') });
    // un angolo all'ombra, a sinistra: lì sta il termometro di controllo
    g.save(); g.fillStyle = '#000'; g.globalAlpha = 0.55; g.fillRect(X.fuori - 20, yt - band / 2 - 70, 40, band + 74); g.restore();
    this.text(i18n('all’ombra'), X.fuori, yt - band / 2 - 76, { size: 10.5, align: 'center', color: this.c('muted') });
    // il termometro, dove l'hai messo: il liquido sale di dT gradi
    const tx = X[p.pos] ?? X.rosso, by = yt, dT = HEAT[p.pos] ?? 0, rise = this.live ? dT * clamp01(u) : 0, sc = Math.min(11, (H * 0.3) / 10), top = by - 30 - 11 * sc;
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(tx - 5, top, 10, by - top - 6); g.restore();
    this.ball(tx, by, 8, { color: this.c('coral'), fill: 0.85, width: 2, shine: false });
    g.save(); g.fillStyle = this.c('coral'); g.fillRect(tx - 2.5, by - 30 - rise * sc, 5, 30 + rise * sc - 6); g.restore();
    for (let k = 0; k <= 10; k += 2) this.line([[tx + 6, by - 30 - k * sc], [tx + 11, by - 30 - k * sc]], { color: this.c('muted'), width: 1 });
    const lab = { blu: i18n('nel blu'), verde: i18n('nel verde'), rosso: i18n('nel rosso'), oltre: i18n('oltre il rosso'), fuori: i18n('all’ombra') }[p.pos];
    const rows = [[E ? i18n('Il termometro è {p}', { p: lab }) : i18n('termometro {p}', { p: lab }), this.c('chalk'), 700]];
    if (this.result) rows.push([dT > 0 ? (E ? i18n('sale di {d} gradi', { d: dT }) : i18n('ΔT = +{d} °C in 10 minuti', { d: dT })) : E ? i18n('non sale: resta com’era') : i18n('ΔT = 0 °C: è il termometro di controllo'), this.c('mint'), 700]);
    this.box(rows);
  }
}
