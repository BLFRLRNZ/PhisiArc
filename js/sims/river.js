// La barca e il fiume: due velocità che si sommano come frecce (vettori).
// La barca spinge in una direzione, la corrente la trascina di lato: il moto vero è la somma delle due frecce.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, easeOut, easeInOut } from './base.js';

export class River extends Sim {
  static controls = {
    vb: { label: 'Velocità della barca', min: 1, max: 8, step: 0.5, unit: 'm/s' },
    vc: { label: 'Corrente del fiume', min: 0, max: 5, step: 0.5, unit: 'm/s' },
    ang: { label: 'Prua controcorrente', min: 0, max: 70, step: 1, unit: '°' },
  };

  defaults() { return { vb: 4, vc: 2, ang: 0, Wd: 40 }; }

  init() {
    const p = this.params, a = (p.ang * Math.PI) / 180;
    this.speed = 2;
    this.vx = p.vc - p.vb * Math.sin(a); // la corrente scorre verso destra, la prua punta a sinistra di "ang"
    this.vy = p.vb * Math.cos(a);
    this.x = 0; this.y = 0;
    this.trail = [[0, 0]];
    this.lastPt = 0;
  }

  step() {
    const p = this.params;
    this.x = this.vx * this.t;
    this.y = this.vy * this.t;
    if (this.t - this.lastPt > 0.1) { this.lastPt = this.t; this.trail.push([this.x, this.y]); }
    if (this.y >= p.Wd) {
      const tE = p.Wd / this.vy;
      this.x = this.vx * tE; this.y = p.Wd; this.trail.push([this.x, this.y]);
      this.finish({ t: tE, drift: this.x, v: Math.hypot(this.vx, this.vy) });
    }
  }

  // la barchetta a linee, ruotata lungo la prua
  boat(x, y, rot, alpha = 1) {
    const c = Math.cos(rot), s = Math.sin(rot), P = (pts) => pts.map(([u, v]) => [x + u * c - v * s, y + u * s + v * c]);
    const col = this.c('coral'), g = this.ctx;
    const hull = P([[0, -16], [7, -6], [7, 12], [-7, 12], [-7, -6], [0, -16]]);
    g.save(); g.globalAlpha = 0.2 * alpha; g.fillStyle = col; g.beginPath(); hull.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.fill(); g.restore();
    this.line(hull, { color: col, width: 2.2, alpha });
    this.line(P([[-7, 4], [7, 4]]), { color: col, width: 1.4, alpha: 0.7 * alpha });
    this.line(P([[0, -6], [0, 2]]), { color: this.c('chalk'), width: 1.6, alpha });
    this.ball(...P([[0, -8]])[0], 2.6, { color: this.c('sky'), fill: 0.5, shine: false, alpha });
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const t = this.calm ? 0 : this.clock;
    // fiume: sponda di partenza in basso, arrivo in alto. Scala: tutta la larghezza (40 m) e ±60 m di lato.
    const top = 58, bot = H - 52, k = Math.min((bot - top) / p.Wd, (W - 40) / 120);
    const ox = W / 2, X = (x) => ox + x * k, Y = (y) => bot - y * k;
    const yTop = Y(p.Wd), yBot = Y(0);
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.08; g.fillRect(0, yTop, W, yBot - yTop); g.restore();
    this.line([[0, yTop], [W, yTop]], { color: this.c('green'), width: 2.4 });
    this.line([[0, yBot], [W, yBot]], { color: this.c('green'), width: 2.4 });
    // erba stilizzata sulle sponde
    for (let xx = 10; xx < W; xx += 26) {
      this.line([[xx, yTop - 2], [xx + 3, yTop - 8], [xx + 6, yTop - 2]], { color: this.c('green'), width: 1.2, alpha: 0.6 });
      this.line([[xx + 13, yBot + 2], [xx + 16, yBot + 8], [xx + 19, yBot + 2]], { color: this.c('green'), width: 1.2, alpha: 0.6 });
    }
    // onde che scorrono con la corrente
    if (p.vc > 0) {
      for (let r = 0; r < 4; r++) {
        const yy = yTop + ((r + 0.5) * (yBot - yTop)) / 4;
        for (let j = -1; j < W / 90 + 1; j++) {
          const x0 = ((j * 90 + r * 37 + t * p.vc * k) % (W + 90)) - 45;
          this.line([[x0, yy], [x0 + 8, yy - 3], [x0 + 16, yy], [x0 + 24, yy - 3]], { color: this.c('sky'), width: 1.4, alpha: 0.35 });
        }
      }
    }
    // pontile d'arrivo, proprio di fronte alla partenza
    this.line([[X(0) - 12, yTop], [X(0) - 12, yTop - 14], [X(0) + 12, yTop - 14], [X(0) + 12, yTop]], { color: this.c('sun'), width: 2 });
    // le due scritte stanno dal lato opposto a quello dove la corrente porta la barca: così la barca e la scia non le coprono
    const lato = p.vc - p.vb * Math.sin((p.ang * Math.PI) / 180) > 0.05 ? -1 : 1, al = lato < 0 ? 'right' : 'left';
    this.text('pontile', X(0) + lato * 18, yTop - 4, { size: 11, color: this.c('sun'), align: al });
    this.line([[X(0), yBot], [X(0), yTop]], { color: this.c('line'), width: 1, dash: [3, 6] });
    this.text(`${p.Wd} m`, X(0) + lato * 6, (yTop + yBot) / 2, { size: 11, color: this.c('muted'), mono: true, align: al });

    // scia
    if (this.trail.length > 1) this.line(this.trail.map(([x, y]) => [X(x), Y(y)]), { color: this.c('chalk'), width: 1.6, dash: [4, 5], alpha: 0.6 });
    const bx = X(this.x), by = Y(this.y), a = (p.ang * Math.PI) / 180;
    this.boat(bx, by, -a);

    // le tre frecce sulla barca, finché naviga
    const bxv = -p.vb * Math.sin(a), byv = p.vb * Math.cos(a);
    if (!this.result) {
      const kv = Math.min(12, 70 / Math.max(p.vb + p.vc, 1));
      this.arrow(bx, by, bx + bxv * kv, by - byv * kv, { color: this.c('orange'), width: 2.2 });
      if (p.vc > 0) {
        this.arrow(bx + bxv * kv, by - byv * kv, bx + bxv * kv + p.vc * kv, by - byv * kv, { color: this.c('sky'), width: 2, dash: [5, 4] });
        this.arrow(bx, by, bx + this.vx * kv, by - this.vy * kv, { color: this.c('chalk'), width: 2.4 });
      }
    }
    // lo schema della somma, grande e fermo sopra la riva: punta contro coda
    {
      const avail = yTop - 78, kd = Math.max(6, Math.min(22, avail / Math.max(p.vb, 1), 150 / Math.max(p.vb + p.vc, 1)));
      const ox2 = 34 + Math.max(0, p.vb * Math.sin(a)) * kd, oy2 = yTop - 14;
      const A = [ox2 + bxv * kd, oy2 - byv * kd], B = [A[0] + p.vc * kd, A[1]];
      this.arrow(ox2, oy2, A[0], A[1], { color: this.c('orange'), width: 2.4, label: 'barca' });
      if (p.vc > 0) {
        this.arrow(A[0], A[1], B[0], B[1], { color: this.c('sky'), width: 2.2, dash: [5, 4], label: 'corrente' });
        this.arrow(ox2, oy2, B[0], B[1], { color: this.c('chalk'), width: 2.8 });
        this.text(i18n('totale {a} m/s', { a: fmt(Math.hypot(this.vx, this.vy), 1) }), (ox2 + B[0]) / 2 + 10, (oy2 + B[1]) / 2 + 12, { size: 11, color: this.c('chalk'), weight: 600 });
      }
    }

    // In alto a sinistra il tempo; a traversata finita, al suo posto, il risultato (una riga in più finiva sulle frecce).
    if (!this.result) this.text(i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), 14, 24, { size: 14, weight: 600 });
    // I valori di barca e corrente si ripetono in alto a destra solo se c'è spazio: sul telefono li mostrano già i cursori.
    if (W >= 520) this.text(i18n('barca {a} m/s · corrente {b} m/s', { a: fmt(p.vb, 1), b: fmt(p.vc, 1) }) + (p.ang ? i18n(' · prua {a}°', { a: p.ang }) : ''), W - 14, 24, { size: 12, align: 'right', color: this.c('muted') });
    if (this.result) {
      const d = this.result.drift, u = easeOut(this.age / 0.5);
      if (Math.abs(d) > 0.3) {
        const xe = Math.max(12, Math.min(W - 12, X(d)));
        this.arrow(X(0), yTop - 30, X(0) + (xe - X(0)) * u, yTop - 30, { color: this.c('pink'), width: 1.8, head: 7 });
        this.text(d > 0 ? i18n('{a} m a valle', { a: fmt(d, 1) }) : i18n('{a} m a monte', { a: fmt(-d, 1) }), Math.max(70, Math.min(W - 70, (X(0) + xe) / 2)), yTop - 36, { size: 12, align: 'center', color: this.c('pink'), weight: 600 });
      } else this.text('dritta al pontile!', X(0), yTop - 30, { size: 12, align: 'center', color: this.c('mint'), weight: 700 });
      g.globalAlpha = easeInOut(this.age / 0.4);
      this.text(i18n('attraversato in {a} s', { a: fmt(this.result.t, 1) }), 14, 24, { size: 14, weight: 700, color: this.c('accent2') });
      g.globalAlpha = 1;
    }
  }
}
