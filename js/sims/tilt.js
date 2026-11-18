// Il baricentro e la pedana che si inclina (D05). Sulla pedana c'è un oggetto (un cubo, uno scaffale, un autobus
// a due piani visto da dietro), fermato da un bordino perché non scivoli. Con ▶ Lancia la pedana si alza piano fino
// all'inclinazione scelta. Finché la verticale che scende dal baricentro cade dentro la base d'appoggio, l'oggetto
// resta in piedi; appena ne esce, si ribalta intorno allo spigolo di sotto.
// Risultato: { tipped, at (gradi a cui ha cominciato a cadere, o null), theta }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const RAD = Math.PI / 180, G = 9.8;
const RATE = 12; // gradi al secondo: quanto in fretta si alza la pedana
// larghezza, altezza e altezza del baricentro (vuoto, peso in basso, peso in alto), in metri
export const OBJS = {
  cubo: { w: 1, h: 1, hc: { vuoto: 0.5, basso: 0.3, alto: 0.7 }, name: 'Cubo' },
  scaffale: { w: 0.6, h: 1.8, hc: { vuoto: 0.9, basso: 0.5, alto: 1.3 }, name: 'Scaffale' },
  bus: { w: 2.5, h: 4.4, hc: { vuoto: 1.4, basso: 1.2, alto: 2 }, name: 'Autobus' },
};
// l'angolo a cui si ribalta: la verticale del baricentro passa sullo spigolo
export const critical = (obj, load) => { const o = OBJS[obj]; return Math.atan(o.w / 2 / o.hc[load]) / RAD; };

export class Tilt extends Sim {
  static controls = {
    theta: { label: 'Inclinazione della pedana', min: 0, max: 45, step: 1, unit: '°' },
    obj: { label: 'Oggetto', type: 'select', options: [['cubo', 'Cubo'], ['scaffale', 'Scaffale'], ['bus', 'Autobus']] },
    load: { label: 'Il peso', type: 'select', options: [['vuoto', 'Vuoto'], ['basso', 'In basso'], ['alto', 'In alto']] },
  };

  // cg: il baricentro e la sua verticale; base: la base d'appoggio colorata
  defaults() { return { theta: 30, obj: 'scaffale', load: 'vuoto', cg: true, base: true, lens: 's', tmax: 12 }; }

  constructor(cv, p) { super(cv, p); this.history = []; }

  init() {
    this.th = 0; this.psi = 0; this.om = 0; this.tipping = false; this.at = null; this.flat = -1; this.lay = -1; this.layAt = null;
  }

  // quanto sta a valle il baricentro rispetto allo spigolo di sotto (metri); positivo: si ribalta
  dx(tot) {
    const p = this.params, o = OBJS[p.obj];
    return -(o.w / 2) * Math.cos(tot) + o.hc[p.load] * Math.sin(tot);
  }

  step(dt) {
    const p = this.params, o = OBJS[p.obj];
    if (this.t > p.tmax) return this.end();
    if (this.th < p.theta) this.th = Math.min(p.theta, this.th + RATE * dt);
    else if (this.flat < 0) this.flat = this.t;
    const tot = this.th * RAD + this.psi, d = this.dx(tot);
    if (!this.tipping && d > 0) { this.tipping = true; this.at = Math.round(this.th); this.om = 0.05; }
    if (this.tipping && this.lay < 0) {
      this.om += ((G * d) / ((o.w ** 2 + o.h ** 2) / 3)) * dt;
      this.psi += this.om * dt;
      if (this.psi >= Math.PI / 2) { this.psi = Math.PI / 2; this.om = 0; this.lay = this.t; this.layAt = this.clock; }
    }
    if (this.lay >= 0 && this.t - this.lay > 0.7) this.end();
    if (!this.tipping && this.flat >= 0 && this.t - this.flat > 1) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    this.history.push({ obj: p.obj, load: p.load, theta: p.theta, tipped: this.tipping, at: this.at });
    if (this.history.length > 3) this.history.shift();
    this.finish({ tipped: this.tipping, at: this.at, theta: p.theta });
  }

  // ---------- disegno ----------
  draw() {
    const p = this.params, W = this.W, H = this.H, g = this.ctx, o = OBJS[p.obj];
    this.clear();
    const yG = H - 16, Hx = W - 30, Hy = yG - 14;
    const Lp = W - 76, th = this.th * RAD, ct = Math.cos(th), st = Math.sin(th);
    const k = p.obj === 'bus' ? Math.min(22, (H - 100) / 4.4) : Math.min(62, (H - 100) / 1.8);
    const uc = Lp * 0.45;                                           // lo spigolo di sotto, dalla cerniera
    const P = (x, y) => [Hx + x * ct - y * st, Hy + x * st + y * ct]; // dalla pedana (x verso la cerniera, y in giù) allo schermo
    this.ground(yG, { x0: 8, x1: W - 8 });
    // il pistone che alza la pedana
    const [jx, jy] = P(-Lp * 0.82, 8), hJ = yG - jy;
    if (hJ > 2) {
      this.line([[jx, yG], [jx, yG - hJ * 0.55]], { color: this.c('muted'), width: 7, alpha: 0.8 });
      this.line([[jx, yG - hJ * 0.55 + 2], [jx, jy]], { color: this.c('muted'), width: 2.6 });
    }
    this.line([[jx - 10, yG], [jx + 10, yG]], { color: this.c('muted'), width: 3 });
    // la pedana e la cerniera
    g.save(); g.translate(Hx, Hy); g.rotate(th);
    g.fillStyle = this.c('muted'); g.globalAlpha = 0.2; g.fillRect(-Lp, 0, Lp, 8);
    g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(-Lp, 0, Lp, 8);
    // il bordino che non lo fa scivolare
    this.line([[-uc + 1.5, 0], [-uc + 1.5, -7]], { color: this.c('chalk'), width: 3 });
    g.restore();
    this.line([[Hx - 7, yG], [Hx, Hy + 4], [Hx + 7, yG]], { color: this.c('muted'), width: 2.4 });
    this.ball(Hx, Hy + 4, 4, { color: this.c('chalk'), fill: 0.4, width: 2, shine: false });
    // l'angolo della pedana
    if (this.th > 0.5) {
      const r = 34;
      g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.5; g.beginPath(); g.arc(Hx, Hy + 4, r, Math.PI, Math.PI + th); g.stroke(); g.restore();
      const la = Math.PI + Math.max(th / 2, 0.1);
      this.text(`${fmt(this.th, 0)}°`, Hx + Math.cos(la) * (r + 15), Hy + 4 + Math.sin(la) * (r + 15) + 4, { size: 12, align: 'center', color: this.c('chalk'), mono: true });
    }
    // l'oggetto, che gira intorno allo spigolo C (sistema dell'oggetto: x verso valle, y in giù; occupa x da -w a 0)
    const [Cx, Cy] = P(-uc, 0), tot = th + this.psi;
    const wk = o.w * k, hk = o.h * k, hc = o.hc[p.load] * k;
    g.save(); g.translate(Cx, Cy); g.rotate(tot);
    if (p.obj === 'cubo') this.crate(wk, hk);
    else if (p.obj === 'scaffale') this.shelf(wk, hk);
    else this.bus(wk, hk);
    g.restore();
    const ca = Math.cos(tot), sa = Math.sin(tot);
    const O = (x, y) => [Cx + x * ca - y * sa, Cy + x * sa + y * ca];
    const [gx, gy] = O(-wk / 2, -hc);
    // la base d'appoggio (finché l'oggetto poggia tutto sulla pedana) e la verticale del baricentro
    const tf = (gx - Hx) / ct, [fx, fy] = [gx, Hy + tf * st]; // dove la verticale incontra la pedana
    const inside = this.dx(tot) <= 0;
    if (p.base && this.psi < 0.01) {
      const col = inside ? this.c('mint') : this.c('coral');
      g.save(); g.translate(Hx, Hy); g.rotate(th);
      this.line([[-uc - wk, -1.5], [-uc, -1.5]], { color: col, width: 4, alpha: 0.9 });
      g.restore();
    }
    if (p.cg) {
      const yel = this.c('sun');
      if (fy > gy + 4) {
        this.arrow(gx, gy, gx, Math.min(fy, gy + 26), { color: yel, width: 2.6, head: 7 });
        if (fy > gy + 28) this.line([[gx, gy + 28], [fx, fy]], { color: yel, width: 1.6, dash: [4, 4], alpha: 0.9 });
        if (this.psi < 0.01) this.ball(fx, fy - 1.5, 3, { color: inside ? this.c('mint') : this.c('coral'), fill: 1, width: 1, shine: false });
      }
      this.cgMark(gx, gy);
      // la scritta a destra del simbolo, o a sinistra se a destra non c'è posto
      const lab = i18n('baricentro');
      g.font = '500 10.5px Lexend, system-ui, sans-serif';
      const right = gx + 10 + g.measureText(lab).width < W - 4;
      this.text(lab, right ? gx + 10 : gx - 10, gy - 7, { size: 10.5, color: yel, align: right ? 'left' : 'right' });
    }
    if (this.layAt != null && this.clock - this.layAt < 0.8) {
      const [bx, by] = O(hk * 0.8, 0);
      this.burst(bx, by, this.clock - this.layAt, { color: this.c('muted'), n: 8, r: 24, dur: 0.6 });
    }
    this.results();
  }

  // il simbolo del baricentro: un cerchio con due spicchi pieni
  cgMark(x, y) {
    const g = this.ctx, r = 6.5, col = this.c('sun');
    g.save(); g.fillStyle = this.c('sim-bg'); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.fillStyle = col;
    for (const a of [-Math.PI / 2, Math.PI / 2]) { g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, a, a + Math.PI / 2); g.closePath(); g.fill(); }
    g.strokeStyle = col; g.lineWidth = 1.8; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.restore();
  }

  crate(w, h) {
    const g = this.ctx, col = this.c('orange'), p = this.params;
    g.save(); g.strokeStyle = col; g.fillStyle = 'rgba(255, 155, 84, .14)'; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.beginPath(); g.rect(-w, -h, w, h); g.fill(); g.stroke();
    g.globalAlpha = 0.45; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-w, -h); g.lineTo(0, 0); g.moveTo(0, -h); g.lineTo(-w, 0); g.stroke(); g.restore();
    if (p.load !== 'vuoto') this.weight(-w / 2, p.load === 'basso' ? -h * 0.14 : -h * 0.86, w * 0.5);
  }

  // un peso scuro (la zavorra) centrato in (x, y)
  weight(x, y, w) {
    const g = this.ctx, hh = Math.max(7, w * 0.42);
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.22; g.beginPath(); g.roundRect(x - w / 2, y - hh / 2, w, hh, 2); g.fill();
    g.globalAlpha = 0.9; g.strokeStyle = this.c('chalk'); g.lineWidth = 1.6; g.stroke(); g.restore();
    this.text('kg', x, y + 3.5, { size: 9, align: 'center', color: this.c('chalk'), weight: 700 });
  }

  shelf(w, h) {
    const g = this.ctx, col = this.c('sky'), p = this.params;
    g.save(); g.strokeStyle = col; g.fillStyle = 'rgba(124, 200, 255, .1)'; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.beginPath(); g.rect(-w, -h, w, h); g.fill(); g.stroke();
    g.lineWidth = 1.6; g.globalAlpha = 0.8;
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(-w, -h * i / 4); g.lineTo(0, -h * i / 4); g.stroke(); }
    g.restore();
    // i libri pesanti, sul ripiano più basso o su quello più alto
    if (p.load !== 'vuoto') {
      const y0 = p.load === 'basso' ? 0 : -h * 3 / 4, cols = ['pink', 'sun', 'mint', 'coral'];
      const bw = (w - 6) / 4;
      for (let i = 0; i < 4; i++) {
        const bh = h / 4 - 4 - (i % 2) * 2;
        g.save(); g.fillStyle = this.c(cols[i]); g.globalAlpha = 0.55; g.fillRect(-w + 3 + i * bw, y0 - bh, bw - 1.5, bh);
        g.globalAlpha = 1; g.strokeStyle = this.c(cols[i]); g.lineWidth = 1.2; g.strokeRect(-w + 3 + i * bw, y0 - bh, bw - 1.5, bh); g.restore();
      }
    }
  }

  // l'autobus a due piani, visto da dietro: finestrini sopra e sotto, le ruote agli spigoli
  bus(w, h) {
    const g = this.ctx, col = this.c('coral'), p = this.params, wh = h * 0.1;
    g.save(); g.strokeStyle = col; g.fillStyle = 'rgba(255, 107, 107, .14)'; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.beginPath(); g.roundRect(-w, -h, w, h - wh * 0.6, [8, 8, 2, 2]); g.fill(); g.stroke();
    // i finestrini: due grandi al piano di sopra, uno al piano di sotto
    g.lineWidth = 1.6; g.strokeStyle = this.c('chalk'); g.globalAlpha = 0.8;
    const win = (x, y, ww, hh) => { g.beginPath(); g.roundRect(x, y, ww, hh, 3); g.stroke(); };
    win(-w + 5, -h * 0.9, w / 2 - 7, h * 0.22); win(-w / 2 + 2, -h * 0.9, w / 2 - 7, h * 0.22);
    win(-w + 5, -h * 0.5, w - 10, h * 0.2);
    g.globalAlpha = 0.5; g.beginPath(); g.moveTo(-w, -h * 0.58); g.lineTo(0, -h * 0.58); g.stroke();
    g.restore();
    // i passeggeri: teste nei finestrini del piano scelto
    if (p.load !== 'vuoto') {
      const y = p.load === 'alto' ? -h * 0.76 : -h * 0.37;
      for (let i = 0; i < 4; i++) this.ball(-w + w * (0.17 + i * 0.22), y, Math.max(3, w * 0.065), { color: this.c('pink'), fill: 0.35, width: 1.8, shine: false });
    }
    for (const x of [-w + w * 0.16, -w * 0.16]) this.ball(x, -wh * 0.55, wh * 0.6, { color: this.c('chalk'), fill: 0.12, width: 2.2, shine: false });
  }

  // in alto a sinistra: inclinazione ed esito; a destra le ultime prove
  results() {
    const g = this.ctx, p = this.params;
    const rows = [[i18n('Inclinazione: {a}°', { a: fmt(this.th, 0) }), this.c('chalk'), 600]];
    if (this.result) rows.push(this.result.tipped ? [i18n('si ribalta a {a}°', { a: this.result.at }), this.c('coral'), 700] : [i18n('resta in piedi'), this.c('mint'), 700]);
    else if (this.tipping) rows.push([i18n('si ribalta a {a}°', { a: this.at }), this.c('coral'), 700]);
    g.font = '600 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([r]) => g.measureText(r).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 16 + 6); g.restore();
    rows.forEach(([r, col, w], i) => this.text(r, 12, 20 + i * 16, { size: 11.5, weight: w, color: col }));
    // le prove di prima, per confrontare
    const old = (this.history || []).slice(0, this.result ? -1 : undefined).slice(-2);
    old.forEach((h, i) => {
      const what = `${i18n(OBJS[h.obj].name)}${h.load === 'vuoto' ? '' : ', ' + i18n(h.load === 'basso' ? 'peso in basso' : 'peso in alto')}`;
      const txt = `${what}, ${h.theta}°: ${h.tipped ? i18n('cade') : i18n('non cade')}`;
      this.text(txt, this.W - 10, 18 + i * 14, { size: 10, align: 'right', color: h.tipped ? this.c('coral') : this.c('muted') });
    });
  }
}
