// Come viaggia il calore (T01). Tre modi:
//   - 'barre': quattro barre (rame, ferro, vetro, legno) con un capo nell'acqua bollente e le palline di cera attaccate
//     sotto. Il calore avanza per conduzione, T = T₀ + (Tₕ − T₀)·erfc(x / 2√(α·t)), e una pallina cade quando lì la
//     barra supera i 50 °C. Dieci minuti in tre secondi: nel rame cadono tutte, nel ferro due, nel vetro e nel legno nessuna.
//   - 'sole': tre lattine d'acqua (nera, bianca, lucida) sotto il sole per dieci minuti. Il calore arriva per
//     irraggiamento: la nera ne assorbe quasi tutto, la bianca poco, la lucida quasi niente (lo rimanda indietro).
//   - 'tocco': una panchina di metallo e una di legno, alla stessa temperatura (amb). La mano (34 °C) sente la temperatura
//     del contatto, Tc = (eₘ·Tₘ + eₚ·Tₚ) / (eₘ + eₚ): il metallo porta via (o dà) calore molto più in fretta del legno,
//     e sembra più freddo d'inverno e più caldo d'estate, anche se il termometro segna lo stesso.
// Risultato: barre { rame, ferro, vetro, legno } (palline cadute); sole { nera, bianca, lucida } (°C); tocco { amb, metal, wood }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

export const RODS = [['rame', 1.11e-4, 'orange'], ['ferro', 2.3e-5, 'muted'], ['vetro', 3.4e-7, 'sky'], ['legno', 1.5e-7, 'sun']];
const BEADS = [0.045, 0.09, 0.135, 0.18, 0.225, 0.27], TH = 90, TA = 20, MELT = 50, SECS = 600;
const CANS = [['nera', 0.95], ['bianca', 0.25], ['lucida', 0.08]];
const E_SKIN = 1800, E_METAL = 15000, E_WOOD = 400, T_SKIN = 34;
// erfc, abbastanza precisa per un disegno (Abramowitz e Stegun 7.1.26)
const erfc = (z) => { const t = 1 / (1 + 0.3275911 * z), y = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))); return y * Math.exp(-z * z); };
export const rodT = (alpha, x, s) => (s <= 0 ? TA : TA + (TH - TA) * erfc(x / (2 * Math.sqrt(alpha * s))));
export const contact = (amb) => ({ metal: (E_SKIN * T_SKIN + E_METAL * amb) / (E_SKIN + E_METAL), wood: (E_SKIN * T_SKIN + E_WOOD * amb) / (E_SKIN + E_WOOD) });
const feel = (T) => (T < 24 ? 'freddo!' : T < 31 ? 'fresco' : T < 37 ? 'tiepido' : T < 44 ? 'caldo' : 'scotta!');
const feelCol = (T) => (T < 24 ? 'sky' : T < 31 ? 'mint' : T < 37 ? 'chalk' : T < 44 ? 'orange' : 'coral');

export class Conduct extends Sim {
  static tall = true;
  static controls = {
    amb: { label: 'Temperatura delle panchine', min: -10, max: 50, step: 5, unit: '°C' },
  };

  defaults() { return { mode: 'barre', amb: 10, lens: 's' }; }

  init() { this.u = 0; }

  step() {
    this.u = clamp01(this.t / 3);
    if (this.t > 3.4) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'sole') return this.finish(Object.fromEntries(CANS.map(([k, a]) => [k, TA + 30 * a])));
    if (p.mode === 'tocco') { const c = contact(p.amb); return this.finish({ amb: p.amb, metal: c.metal, wood: c.wood }); }
    this.finish(Object.fromEntries(RODS.map(([k, al]) => [k, BEADS.filter((x) => rodT(al, x, SECS) >= MELT).length])));
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'sole') this.drawSun();
    else if (m === 'tocco') this.drawTouch();
    else this.drawRods();
  }

  // ---------- le barre e le palline di cera ----------
  drawRods() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u, s = u * SECS;
    const bx = 18, bw = 56, by0 = H * 0.22, by1 = H - 70, rx0 = bx + bw - 14, rx1 = W - 50, L = 0.3, X = (x) => rx0 + 14 + (x / L) * (rx1 - rx0 - 14), floor = H - 30;
    // l'acqua bollente, con il vapore
    this.line([[bx, by0], [bx, by1], [bx + bw, by1], [bx + bw, by0]], { color: this.c('chalk'), width: 2.4 });
    g.save(); g.fillStyle = this.c('coral'); g.globalAlpha = 0.25; g.fillRect(bx + 2, by0 + 18, bw - 4, by1 - by0 - 20); g.restore();
    for (let i = 0; i < 3; i++) { const ph = (this.clock * 0.6 + i / 3) % 1; this.line([[bx + 14 + i * 14, by0 + 8 - ph * 26], [bx + 18 + i * 14, by0 - 4 - ph * 26]], { color: this.c('chalk'), width: 1.6, alpha: 0.6 * (1 - ph) }); }
    this.text('90 °C', bx + bw / 2, by1 + 16, { size: 11, align: 'center', color: this.c('coral'), weight: 700 });
    this.ground(floor, { x0: rx0, x1: W - 6 });
    RODS.forEach(([name, al, col], i) => {
      const y = by0 + 34 + i * ((by1 - by0 - 40) / 3.4);
      // la barra, colorata dal caldo (rosso) al freddo
      for (let k = 0; k < 24; k++) {
        const xa = (k / 24) * L, T = live ? rodT(al, xa + L / 48, s) : TA, hot = clamp01((T - TA) / (TH - TA)), xs = X(xa) - (k === 0 ? 30 : 0);
        g.save(); g.fillStyle = hot > 0.5 ? this.c('coral') : hot > 0.15 ? this.c('orange') : this.c(col); g.globalAlpha = 0.55 + 0.45 * hot; g.fillRect(xs, y - 3, X(xa + L / 24) - xs + 0.5, 6); g.restore();
      }
      this.text(i18n(name), rx1 + 6, y + 4, { size: 11, color: this.c(col), weight: 700 });
      // le palline di cera: cadono quando lì si arriva a 50 °C
      for (const xb of BEADS) {
        const tm = (() => { if (!live) return Infinity; let lo = 0, hi = SECS * 4; if (rodT(al, xb, hi) < MELT) return Infinity; for (let it = 0; it < 30; it++) { const mid = (lo + hi) / 2; if (rodT(al, xb, mid) >= MELT) hi = mid; else lo = mid; } return hi; })();
        const fall = tm <= s ? easeOut(clamp01((s - tm) / 60)) : 0, yb = y + 7 + fall * (floor - 5 - y - 7);
        this.ball(X(xb), yb, 4, { color: this.c('sun'), fill: 0.85, width: 1.2, shine: false });
      }
    });
    const rows = E ? [[i18n('Quattro barre nell’acqua bollente'), this.c('chalk'), 700], [i18n('sotto, le palline di cera'), this.c('sun'), 600]]
      : [[i18n('Quattro barre con un capo a 90 °C'), this.c('chalk'), 700], [i18n('la cera si scioglie a 50 °C'), this.c('sun'), 600]];
    if (live) rows.push([i18n('dopo {m} minuti', { m: fmt(Math.round(s / 60), 0) }), this.c('muted'), 600]);
    if (this.result) {
      const r = this.result;
      rows.push([i18n('cadute: rame {a}, ferro {b}, vetro {c}, legno {d}', { a: r.rame, b: r.ferro, c: r.vetro, d: r.legno }), this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- il sole e le tre lattine ----------
  drawSun() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const sx = W / 2, sy = 92, yb = H - 40, ch = Math.min(110, H * 0.28), cw = Math.min(64, W * 0.18);
    // il sole
    this.ball(sx, sy, 20, { color: this.c('sun'), fill: 0.7, width: 2, shine: false });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + this.clock * 0.2; this.line([[sx + Math.cos(a) * 26, sy + Math.sin(a) * 26], [sx + Math.cos(a) * 34, sy + Math.sin(a) * 34]], { color: this.c('sun'), width: 2 }); }
    this.ground(yb, {});
    CANS.forEach(([k, a], i) => {
      const cx = W * (0.2 + i * 0.3), top = yb - ch, T = TA + 30 * a * (live ? u : 0), g = this.ctx;
      const col = k === 'nera' ? 'muted' : k === 'bianca' ? 'chalk' : 'sky';
      // i raggi arrivano sulla lattina; la bianca e la lucida ne rimandano indietro una parte, la nera li tiene
      if (live) for (let j = -1; j <= 1; j++) {
        const x1 = cx + j * (cw / 3.2), dx = x1 - sx, dy = top - (sy + 28), ph = (this.clock * 0.8 + (j + 1) / 3) % 1;
        this.line([[sx + dx * 0.12, sy + 28 + dy * 0.12], [x1, top]], { color: this.c('sun'), width: 1.5, alpha: 0.45 });
        this.ball(sx + dx * (0.12 + 0.88 * ph), sy + 28 + dy * (0.12 + 0.88 * ph), 2.2, { color: this.c('sun'), fill: 0.9, width: 1, shine: false });
        if (1 - a > 0.3) this.line([[x1, top], [x1 + (j || 0.6) * 22, top - 34]], { color: this.c('sun'), width: 1.5, alpha: 0.8 * (1 - a) });
      }
      g.save(); g.fillStyle = k === 'nera' ? '#05070d' : this.c(col); g.globalAlpha = k === 'nera' ? 1 : k === 'bianca' ? 0.85 : 0.35; g.fillRect(cx - cw / 2, top, cw, ch); g.restore();
      if (k === 'lucida') this.line([[cx - cw / 2 + 8, top + 8], [cx - cw / 2 + 8, yb - 8]], { color: this.c('chalk'), width: 3, alpha: 0.7 });
      this.line([[cx - cw / 2, top], [cx - cw / 2, yb], [cx + cw / 2, yb], [cx + cw / 2, top], [cx - cw / 2, top]], { color: this.c(col), width: 2.4 });
      this.text(i18n(k), cx, yb + 16, { size: 11, align: 'center', color: this.c(col), weight: 700 });
      this.text(`${fmt(Math.round(T), 0)} °C`, cx, top + ch / 2 + 5, { size: 13, align: 'center', color: this.c('coral'), weight: 700 });
    });
    const rows = [[E ? i18n('Tre lattine d’acqua al sole, per dieci minuti') : i18n('Tre lattine d’acqua a 20 °C, al sole per dieci minuti'), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('la nera si scalda di più: prende quasi tutta la luce') : i18n('la nera assorbe quasi tutta la luce, la lucida la riflette'), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- la mano sulle due panchine ----------
  drawTouch() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u, c = contact(p.amb), k = live ? easeOut(clamp01(u / 0.5)) : 0;
    const yb = H * 0.62;
    [['metal', W * 0.27, c.metal], ['wood', W * 0.73, c.wood]].forEach(([kind, cx, Tc]) => {
      const bw = Math.min(120, W * 0.36), metal = kind === 'metal', col = metal ? 'sky' : 'sun';
      // la panchina
      this.line([[cx - bw / 2, yb], [cx + bw / 2, yb]], { color: this.c(col), width: 7 });
      this.line([[cx - bw / 2 + 8, yb + 4], [cx - bw / 2 + 8, yb + 46]], { color: this.c(col), width: 4 });
      this.line([[cx + bw / 2 - 8, yb + 4], [cx + bw / 2 - 8, yb + 46]], { color: this.c(col), width: 4 });
      this.text(metal ? i18n('metallo') : i18n('legno'), cx, yb + 64, { size: 12, align: 'center', color: this.c(col), weight: 700 });
      // il termometro sulla panchina: segna la stessa temperatura per tutte e due
      this.text(i18n('termometro: {T} °C', { T: fmt(p.amb, 0) }), cx, yb + 82, { size: 11, align: 'center', color: this.c('muted') });
      // la mano scende e tocca
      const hy = yb - 8 - (1 - k) * 60;
      this.ctx.save(); this.ctx.fillStyle = this.c('chalk'); this.ctx.globalAlpha = 0.18; this.ctx.beginPath(); this.ctx.ellipse(cx, hy - 14, 20, 12, 0, 0, 7); this.ctx.fill(); this.ctx.restore();
      this.ctx.save(); this.ctx.strokeStyle = this.c('chalk'); this.ctx.lineWidth = 2; this.ctx.beginPath(); this.ctx.ellipse(cx, hy - 14, 20, 12, 0, 0, 7); this.ctx.stroke(); this.ctx.restore();
      this.line([[cx - 4, hy - 26], [cx - 10, hy - 70]], { color: this.c('chalk'), width: 2 });
      this.line([[cx + 10, hy - 24], [cx + 6, hy - 70]], { color: this.c('chalk'), width: 2 });
      if (k >= 1) {
        // il calore al contatto: dalla mano alla panchina se la panchina è più fredda, al contrario se è più calda
        const d = T_SKIN - Tc, Lw = Math.min(46, Math.abs(d) * 3.2);
        if (Lw > 3) for (const dx of [-10, 10]) this.arrow(cx + dx, d > 0 ? hy - 22 : hy + 18, cx + dx, d > 0 ? hy - 22 + Lw : hy + 18 - Lw, { color: this.c('orange'), width: 2.4, head: 7 });
        this.text(i18n(feel(Tc)), cx, hy - 82, { size: 14, align: 'center', color: this.c(feelCol(Tc)), weight: 700 });
        if (!E) this.text(i18n('al tocco: {T} °C', { T: fmt(Math.round(Tc), 0) }), cx, hy - 100, { size: 11, align: 'center', color: this.c(feelCol(Tc)) });
      }
    });
    const rows = [[E ? i18n('Due panchine al sole o all’ombra, a {T} gradi', { T: fmt(p.amb, 0) }) : i18n('Due panchine a {T} °C, la mano a 34 °C', { T: fmt(p.amb, 0) }), this.c('chalk'), 700]];
    if (this.result && Math.abs(p.amb - T_SKIN) > 2) rows.push([p.amb < T_SKIN ? i18n('il metallo sembra più freddo, ma non lo è') : i18n('il metallo sembra più caldo, ma non lo è'), this.c('mint'), 700]);
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
