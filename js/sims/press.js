// La pressione (FL01). Due modi:
//   - 'impronte': due personaggi sulla sabbia bagnata del porto (a sinistra a, a destra b) appoggiano il loro peso;
//     chi schiaccia di più lascia l'impronta più profonda. Conta il peso diviso la superficie d'appoggio: P = F/A.
//     L'elefante (4000 kg su quattro piedi da 1000 cm²) schiaccia meno di una signora con i tacchi a spillo
//     (60 kg su un tacco di 1 cm², nel momento del passo).
//   - 'pascal': il sollevatore idraulico del porto. Una persona spinge il pistone piccolo (A1) con la forza di m1 kg;
//     la pressione si trasmette in tutto l'olio e sul pistone grande (A2) diventa una forza A2/A1 volte più grande:
//     se basta per la barca (m2 kg), la barca sale, una pompata dopo l'altra.
// Risultato: impronte { a, b, kgA, kgB (kg su ogni cm²), PA, PB (Pa) };
//            pascal { up (la barca sale?), m1, m2, A1, A2, need (A2 minimo, cm²), ratio (A2/A1) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut, easeInOut } from './base.js';

const G = 9.81;
// chi appoggia il suo peso: massa (kg) e superficie d'appoggio (cm²)
export const WHO = {
  elefante: { name: 'Elefante', m: 4000, A: 4000, col: 'muted' },
  tacchi: { name: 'Tacchi a spillo', m: 60, A: 1, col: 'pink' },
  scarpe: { name: 'Scarpe', m: 60, A: 400, col: 'sky' },
  pinne: { name: 'Pinne', m: 60, A: 2400, col: 'mint' },
  bimbo: { name: 'Bimbo', m: 30, A: 200, col: 'sun' },
};
const SEL = Object.entries(WHO).map(([k, w]) => [k, w.name]);
// quanto affonda (in px, fino a DMAX) per una pressione di k kg su ogni cm²: a passi lenti, perché va da 0,02 a 60
const DMAX = 34;
const sinkOf = (k) => DMAX * Math.min(1, Math.log10(1 + k / 0.01) / Math.log10(1 + 60 / 0.01));
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);

export class Press extends Sim {
  static controls = {
    a: { label: 'A sinistra', type: 'select', options: SEL },
    b: { label: 'A destra', type: 'select', options: SEL },
    A2: { label: 'Pistone grande', min: 20, max: 1500, step: 10, unit: 'cm²' },
    m1: { label: 'Spinta', min: 5, max: 60, step: 5, unit: 'kg' },
  };

  defaults() { return { mode: 'impronte', a: 'elefante', b: 'tacchi', m1: 20, A1: 10, A2: 100, m2: 1000, lens: 's' }; }

  init() { this.u = 0; }

  // kg su ogni cm², e pascal
  kg(k) { const w = WHO[k]; return w.m / w.A; }
  pa(k) { const w = WHO[k]; return (w.m * G) / (w.A * 1e-4); }

  canLift() { const p = this.params; return p.m1 / p.A1 >= (p.m2 / p.A2) * 0.999; }

  step() {
    const p = this.params;
    if (p.mode === 'impronte') {
      this.u = easeOut(clamp01(this.t / 1.3));
      if (this.t > 1.7) this.end();
      return;
    }
    // pascal: sei pompate in 2,6 s (se la spinta basta), poi un attimo per guardare
    this.u = clamp01(this.t / 2.6);
    if (this.t > 3.1) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'impronte') return this.finish({ a: p.a, b: p.b, kgA: this.kg(p.a), kgB: this.kg(p.b), PA: this.pa(p.a), PB: this.pa(p.b) });
    this.finish({ up: this.canLift(), m1: p.m1, m2: p.m2, A1: p.A1, A2: p.A2, need: (p.A1 * p.m2) / p.m1, ratio: p.A2 / p.A1 });
  }

  draw() {
    this.clear();
    if (this.params.mode === 'pascal') this.drawPascal();
    else this.drawPrints();
  }

  // ---------- le impronte nella sabbia ----------
  drawPrints() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, yG = Math.round(H * 0.56);
    const live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const sides = [[p.a, W * 0.27], [p.b, W * 0.73]];
    // dove tocca terra ogni personaggio: [x0, x1] e profondità
    const dents = [];
    for (const [k, x] of sides) {
      const d = sinkOf(this.kg(k)) * u;
      for (const [a, b] of this.feet(k, x)) dents.push([a, b, d]);
    }
    dents.sort((m, n) => m[0] - n[0]);
    // la sabbia: la superficie scende dentro le impronte
    const pts = [[0, yG]];
    for (const [a, b, d] of dents) {
      const s = Math.min(3, (b - a) / 3);
      pts.push([a - s, yG], [a, yG + d], [b, yG + d], [b + s, yG]);
    }
    pts.push([W, yG]);
    g.save(); g.beginPath(); g.moveTo(0, H); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(W, H); g.closePath();
    g.fillStyle = this.c('sun'); g.globalAlpha = 0.12; g.fill(); g.restore();
    g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.3;
    for (let i = 0; i < 70; i++) { const x = (i * 97.3) % W, y = yG + 26 + ((i * 53.7) % (H - yG - 30)); g.fillRect(x, y, 1.5, 1.5); }
    g.restore();
    this.line(pts, { color: this.c('sun'), width: 2 });
    // i personaggi, che affondano con le loro impronte
    for (const [k, x] of sides) {
      const d = sinkOf(this.kg(k)) * u;
      if (k === 'elefante') this.elephant(x, yG + d);
      else this.person(x, yG, k, d);
    }
    // sotto a ognuno: chi è, quanto pesa e su quanta superficie, e (dopo la prova) quanto schiaccia
    const E = p.lens === 'e';
    for (const [k, x] of sides) {
      const w = WHO[k], col = this.c(w.col);
      this.text(i18n(w.name), x, yG + 44, { size: 12, align: 'center', weight: 700, color: col });
      this.text(E ? `${fmt(w.m, 0)} kg` : i18n('{m} kg su {A} cm²', { m: fmt(w.m, 0), A: fmt(w.A, 0) }), x, yG + 60, { size: 11, align: 'center', color: this.c('chalk') });
      if (live) {
        const kk = this.kg(k), a = this.result ? 1 : clamp01((this.t - 0.6) / 0.5);
        const lab = E ? (kk >= 1 ? i18n('{n} kg su ogni quadretto', { n: one(kk) }) : i18n('{n} g su ogni quadretto', { n: fmt(Math.round(kk * 1000), 0) }))
          : i18n('P = {P} kPa', { P: fmt(this.pa(k) / 1000, this.pa(k) < 10000 ? 1 : 0) });
        g.save(); g.globalAlpha = a; this.text(lab, x, yG + 77, { size: 11.5, align: 'center', weight: 700, color: col }); g.restore();
      }
    }
  }

  // i tratti di terra toccati: [x0, x1] per ogni piede (o tacco, o pinna)
  feet(k, x) {
    if (k === 'elefante') return [-30, -15, 13, 27].map((o) => [x + o - 5, x + o + 5]);
    if (k === 'tacchi') return [[x - 9, x - 7]];
    if (k === 'pinne') return [[x - 18, x + 2], [x + 4, x + 24]];
    const s = k === 'bimbo' ? 0.7 : 1;
    return [[x - 6 * s - 5 * s, x - 6 * s + 5 * s], [x + 6 * s - 5 * s, x + 6 * s + 5 * s]];
  }

  // l'elefante a linee, con i piedi in (x, y)
  elephant(x, y) {
    const g = this.ctx, col = this.c('muted');
    g.save(); g.strokeStyle = col; g.lineWidth = 2.2; g.lineJoin = 'round'; g.lineCap = 'round';
    const fillStroke = () => { g.globalAlpha = 0.16; g.fillStyle = col; g.fill(); g.globalAlpha = 1; g.stroke(); };
    for (const o of [-30, -15, 13, 27]) { g.beginPath(); g.roundRect(x + o - 5, y - 34, 10, 34, 3); fillStroke(); }
    g.beginPath(); g.ellipse(x, y - 50, 42, 23, 0, 0, 7); fillStroke();
    g.beginPath(); g.arc(x + 40, y - 60, 16, 0, 7); fillStroke();
    g.beginPath(); g.ellipse(x + 30, y - 58, 9, 14, -0.2, 0, 7); fillStroke();
    g.beginPath(); g.moveTo(x + 52, y - 52); g.quadraticCurveTo(x + 62, y - 36, x + 58, y - 18); g.stroke();
    g.beginPath(); g.moveTo(x - 41, y - 54); g.lineTo(x - 47, y - 38); g.stroke();
    g.fillStyle = col; g.beginPath(); g.arc(x + 46, y - 64, 1.8, 0, 7); g.fill();
    g.restore();
  }

  // una persona a linee: piedi sulla sabbia in (x, y); d = quanto affonda
  person(x, y, k, d) {
    const g = this.ctx, col = this.c('chalk'), s = k === 'bimbo' ? 0.7 : 1, wc = this.c(WHO[k].col);
    // con i tacchi affonda solo il tacco: la persona resta quasi su
    const yb = k === 'tacchi' ? y + Math.min(3, d) : y + d;
    const hip = [x, yb - 24 * s], sh = [x, yb - 44 * s];
    const fl = [x - 6 * s, yb - 3 * s], fr = [x + 6 * s, yb - 3 * s];
    this.line([fl, hip, fr], { color: col, width: 2.4 });
    this.line([hip, sh], { color: col, width: 2.6 });
    this.line([[x - 9 * s, yb - 28 * s], sh, [x + 9 * s, yb - 28 * s]], { color: col, width: 2.2 });
    this.ball(x, yb - 52 * s, 7 * s, { color: col, fill: 0.2, width: 2, shine: false });
    if (k === 'tacchi') {
      // la gonna, e le scarpe con il tacco a spillo che si pianta nella sabbia
      g.save(); g.beginPath(); g.moveTo(x, yb - 34); g.lineTo(x - 9, yb - 18); g.lineTo(x + 9, yb - 18); g.closePath();
      g.fillStyle = wc; g.globalAlpha = 0.3; g.fill(); g.globalAlpha = 1; g.strokeStyle = wc; g.lineWidth = 2; g.stroke(); g.restore();
      for (const fx of [x - 6, x + 6]) this.line([[fx - 2, yb - 4], [fx + 5, yb - 1]], { color: wc, width: 2.6 });
      this.line([[x - 8, yb - 4], [x - 8, y + d]], { color: wc, width: 1.6 });
      return;
    }
    if (k === 'pinne') {
      for (const fx of [x - 18, x + 4]) {
        g.save(); g.beginPath(); g.moveTo(fx, yb - 1); g.lineTo(fx + 20, yb - 3); g.lineTo(fx + 20, yb + 1); g.lineTo(fx, yb + 1); g.closePath();
        g.fillStyle = wc; g.globalAlpha = 0.35; g.fill(); g.globalAlpha = 1; g.strokeStyle = wc; g.lineWidth = 1.8; g.stroke(); g.restore();
      }
      return;
    }
    for (const fx of [x - 6 * s, x + 6 * s]) { g.save(); g.fillStyle = wc; g.beginPath(); g.ellipse(fx + 1, yb - 1.5, 5 * s, 2.4, 0, 0, 7); g.fill(); g.restore(); }
  }

  // ---------- il sollevatore idraulico ----------
  drawPascal() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const lift = this.canLift(), live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const yB = H - 26, xs = W * 0.2, ws = 16;
    const wb = Math.min(W * 0.4, Math.max(26, ws * Math.sqrt(p.A2 / p.A1) * 0.9)), xb = Math.min(W - wb / 2 - 14, W * 0.62);
    const topS = H * 0.4, topB = H * 0.55;
    // quanto si è scesi e saliti: sei pompate, la barca sale piano (il disegno ingrandisce la salita)
    const pumps = 6, ph = (u * pumps) % 1, stroke = live && u < 1 ? (ph < 0.5 ? ph * 2 : 2 - ph * 2) : 0;
    const rise = live && lift ? 26 * easeInOut(u) : 0;
    const yS = topS + 40 + stroke * (lift ? 34 : 6), yP = topB + 30 - rise;
    // il tubo a U con l'olio
    const oil = this.c('sun');
    g.save(); g.fillStyle = oil; g.globalAlpha = 0.22; g.beginPath();
    g.moveTo(xs - ws / 2, yS); g.lineTo(xs - ws / 2, yB); g.lineTo(xb + wb / 2, yB); g.lineTo(xb + wb / 2, yP); g.lineTo(xb - wb / 2, yP);
    g.lineTo(xb - wb / 2, yB - 18); g.lineTo(xs + ws / 2, yB - 18); g.lineTo(xs + ws / 2, yS); g.closePath(); g.fill(); g.restore();
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(xs - ws / 2, topS); g.lineTo(xs - ws / 2, yB); g.lineTo(xb + wb / 2, yB); g.lineTo(xb + wb / 2, topB); g.stroke();
    g.beginPath(); g.moveTo(xs + ws / 2, topS); g.lineTo(xs + ws / 2, yB - 18); g.lineTo(xb - wb / 2, yB - 18); g.lineTo(xb - wb / 2, topB); g.stroke();
    g.restore();
    // i due pistoni
    this.line([[xs - ws / 2 + 1, yS], [xs + ws / 2 - 1, yS]], { color: this.c('chalk'), width: 4 });
    this.line([[xb - wb / 2 + 1, yP], [xb + wb / 2 - 1, yP]], { color: this.c('chalk'), width: 4 });
    // la persona che spinge l'asta del pistone piccolo
    const hy = yS - 34;
    this.line([[xs, yS], [xs, hy]], { color: this.c('muted'), width: 2.4 });
    this.line([[xs - 9, hy], [xs + 9, hy]], { color: this.c('muted'), width: 3 });
    // sta su un gradino, con le mani sulla maniglia
    const px = xs - 28, py = topS + 50, col = this.c('chalk');
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 1.6; g.strokeRect(px - 14, py, 24, yB - py); g.restore();
    this.line([[px - 6, py], [px, py - 22], [px + 6, py]], { color: col, width: 2.4 });
    this.line([[px, py - 22], [px + 3, py - 42]], { color: col, width: 2.6 });
    this.line([[px + 3, py - 39], [xs - 6, hy + 1]], { color: col, width: 2.2 });
    this.ball(px + 4, py - 50, 7, { color: col, fill: 0.2, width: 2, shine: false });
    this.text(i18n('spinta: {m} kg', { m: fmt(p.m1, 0) }), xs + 6, hy - 10, { size: 11, align: 'left', weight: 700, color: this.c('orange') });
    // la barca sul pistone grande
    this.boat(xb, yP, Math.min(wb + 30, 110));
    this.text(`${fmt(p.m2, 0)} kg`, xb, yP - 34, { size: 11.5, align: 'center', weight: 700, color: this.c('sky') });
    // le aree dei pistoni, sotto
    this.text(`${fmt(p.A1, 0)} cm²`, xs, H - 8, { size: 10, align: 'center', color: this.c('muted') });
    this.text(`${fmt(p.A2, 0)} cm²`, xb, H - 8, { size: 10, align: 'center', color: this.c('muted') });
    // il riquadro
    const rows = [], r = p.A2 / p.A1;
    if (E) rows.push([i18n('il pistone grande è {n} volte il piccolo', { n: one(r) }), this.c('chalk'), 600]);
    else rows.push([i18n('P = F₁/A₁ = {P} kPa, uguale dappertutto', { P: fmt((p.m1 * G) / (p.A1 * 1e-4) / 1000, 0) }), this.c('chalk'), 600]);
    if (live) {
      if (E) rows.push([i18n('la spinta diventa {n} kg', { n: fmt(Math.round(p.m1 * r), 0) }), this.c('orange'), 700]);
      else rows.push([i18n('F₂ = P·A₂ = {F} N', { F: fmt(Math.round(p.m1 * G * r), 0) }), this.c('orange'), 700]);
      if (this.result) rows.push(lift ? [i18n('la barca sale!'), this.c('mint'), 700] : [i18n('non basta: la barca non si muove'), this.c('coral'), 700]);
      if (this.result && lift && !E) rows.push([i18n('per 1 cm di salita, {n} cm di pompa', { n: one(r) }), this.c('muted'), 500]);
    }
    this.box(rows);
  }

  // una barchetta a linee appoggiata su (x, y), larga w
  boat(x, y, w) {
    const g = this.ctx, col = this.c('sky');
    g.save(); g.strokeStyle = col; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x - w / 2, y - 16); g.lineTo(x + w / 2, y - 16); g.lineTo(x + w / 2 - 12, y - 2); g.lineTo(x - w / 2 + 8, y - 2); g.closePath();
    g.globalAlpha = 0.2; g.fillStyle = col; g.fill(); g.globalAlpha = 1; g.stroke();
    g.beginPath(); g.roundRect(x - 12, y - 28, 22, 12, 2); g.stroke();
    g.restore();
    // i sostegni sul pistone
    this.line([[x - w / 4, y - 2], [x - w / 4, y]], { color: col, width: 2 });
    this.line([[x + w / 4, y - 2], [x + w / 4, y]], { color: col, width: 2 });
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
