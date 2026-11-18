// Temperatura e calore (T01). Tre modi:
//   - 'particelle': le particelle di un gas in una scatola, che si agitano tanto più quanto è alta la temperatura: la
//     velocità tipica va con la radice della temperatura assoluta, e a −273 °C, lo zero assoluto, sono ferme. Il
//     termometro accanto ha le due scale, Celsius e Kelvin: T = t + 273.
//   - 'mescola': un corpo caldo (acqua, o una palla di ferro: what) incontra dell'acqua fredda. Il calore passa dal caldo
//     al freddo finché le temperature sono uguali; all'equilibrio m₁·c₁·(T₁ − T) = m₂·c₂·(T − T₂).
//   - 'scaldare': due pentole sullo stesso fornello (500 W per 3 minuti: 90 000 J a testa) con 1 kg di due sostanze: si
//     scalda di più quella con il calore specifico più piccolo, ΔT = Q / (m·c). Nei liquidi si vedono i moti di convezione.
// Risultato: particelle { t, K, v }; mescola { what, m1, T1, m2, T2, T, Q }; scaldare { a, b, Ta, Tb }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

export const STUFF = { acqua: { name: 'acqua', c: 4186, liq: true }, olio: { name: 'olio', c: 2000, liq: true }, sabbia: { name: 'sabbia', c: 830 }, ferro: { name: 'ferro', c: 450 } };
const C_W = 4186, C_FE = 450, Q_POT = 500 * 180, T0 = 20;
export const mixT = (p) => { const c1 = p.what === 'ferro' ? C_FE : C_W; return (p.m1 * c1 * p.T1 + p.m2 * C_W * p.T2) / (p.m1 * c1 + p.m2 * C_W); };
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);

export class Heat extends Sim {
  static tall = true;
  static controls = {
    t: { label: 'Temperatura', min: -273, max: 600, step: 1, unit: '°C' },
    m1: { label: 'Quanta acqua calda', min: 0.5, max: 5, step: 0.5, unit: 'L' },
    T1: { label: 'Temperatura del caldo', min: 30, max: 100, step: 5, unit: '°C' },
    m2: { label: 'Quanta acqua fredda', min: 0.5, max: 10, step: 0.5, unit: 'L' },
    T2: { label: 'Temperatura del freddo', min: 0, max: 30, step: 5, unit: '°C' },
    a: { label: 'Prima pentola', type: 'select', options: Object.entries(STUFF).map(([k, s]) => [k, s.name]) },
    b: { label: 'Seconda pentola', type: 'select', options: Object.entries(STUFF).map(([k, s]) => [k, s.name]) },
  };

  defaults() { return { mode: 'particelle', t: 20, what: 'acqua', m1: 1, T1: 80, m2: 1, T2: 20, a: 'acqua', b: 'sabbia', lens: 's' }; }

  init() {
    this.u = 0;
    this.parts = Array.from({ length: 30 }, (_, i) => ({ x: (0.5 + i * 0.7548777) % 1, y: (0.5 + i * 0.5698403) % 1, a: i * 2.39996 }));
  }

  step() {
    const t = this.t;
    this.u = clamp01(t / 2.4);
    if (t > 2.9) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'mescola') { const T = mixT(p), c1 = p.what === 'ferro' ? C_FE : C_W; return this.finish({ what: p.what, m1: p.m1, T1: p.T1, m2: p.m2, T2: p.T2, T, Q: p.m1 * c1 * (p.T1 - T) }); }
    if (p.mode === 'scaldare') return this.finish({ a: p.a, b: p.b, Ta: T0 + Q_POT / STUFF[p.a].c, Tb: T0 + Q_POT / STUFF[p.b].c });
    const K = p.t + 273.15;
    this.finish({ t: p.t, K, v: 517 * Math.sqrt(Math.max(0, K) / 300) });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'mescola') this.drawMix();
    else if (m === 'scaldare') this.drawPots();
    else this.drawParticles();
  }

  // un termometro: tubo da y0 a y1, bulbo sotto; la colonna rossa arriva alla temperatura T (fra lo e hi)
  thermo(x, y0, y1, T, lo, hi, label = true, left = false) {
    const f = clamp01((T - lo) / (hi - lo)), yl = y1 - f * (y1 - y0);
    this.line([[x - 4, y1], [x - 4, y0], [x + 4, y0], [x + 4, y1]], { color: this.c('chalk'), width: 1.5 });
    this.ball(x, y1 + 6, 7, { color: this.c('coral'), fill: 0.85, width: 1.5, shine: false });
    this.line([[x, y1 + 2], [x, yl]], { color: this.c('coral'), width: 4 });
    if (label) this.text(`${fmt(Math.round(T), 0)} °C`, left ? x - 10 : x + 10, yl + 4, { size: 11, color: this.c('coral'), weight: 700, align: left ? 'right' : 'left' });
    return yl;
  }

  // ---------- le particelle e le due scale ----------
  drawParticles() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, K = Math.max(0, p.t + 273.15), sp = 0.45 * Math.sqrt(K / 300);
    const x0 = 16, x1 = W * 0.64, y0 = 66, y1 = H - 30;
    if (live && !this.calm) for (const q of this.parts) {
      q.x += Math.cos(q.a) * sp * this.fdt; q.y += Math.sin(q.a) * sp * this.fdt * ((x1 - x0) / (y1 - y0));
      if (q.x < 0) { q.x = -q.x; q.a = Math.PI - q.a; } if (q.x > 1) { q.x = 2 - q.x; q.a = Math.PI - q.a; }
      if (q.y < 0) { q.y = -q.y; q.a = -q.a; } if (q.y > 1) { q.y = 2 - q.y; q.a = -q.a; }
    }
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(x0, y0, x1 - x0, y1 - y0); g.restore();
    const col = p.t < 0 ? 'sky' : p.t < 120 ? 'chalk' : p.t < 350 ? 'orange' : 'coral';
    for (const q of this.parts) {
      const x = x0 + 7 + q.x * (x1 - x0 - 14), y = y0 + 7 + q.y * (y1 - y0 - 14);
      this.ball(x, y, 5, { color: this.c(col), fill: 0.5, width: 1.5, shine: false });
      // la scia: lunga quanto corre la particella
      if (live && sp > 0.02) this.line([[x, y], [x - Math.cos(q.a) * sp * 26, y - Math.sin(q.a) * sp * 26 * ((x1 - x0) / (y1 - y0))]], { color: this.c(col), width: 1.5, alpha: 0.45 });
    }
    // il termometro: a sinistra i gradi Celsius, a destra (Studente e Curioso) i kelvin
    const tx = W * 0.82, lo = -273, hi = 600, Y = (t) => y1 - ((t - lo) / (hi - lo)) * (y1 - y0);
    this.thermo(tx, y0, y1, p.t, lo, hi, false);
    for (const t of [-273, 0, 100, 300, 600]) {
      this.line([[tx - 8, Y(t)], [tx - 4, Y(t)]], { color: this.c('muted'), width: 1.2 });
      this.text(`${t}`, tx - 11, Y(t) + 4, { size: 10, align: 'right', color: this.c('muted'), mono: true });
      if (!E) this.text(`${t + 273}`, tx + 9, Y(t) + 4, { size: 10, color: this.c('sky'), mono: true });
    }
    this.text('°C', tx - 11, y0 - 8, { size: 10, align: 'right', color: this.c('muted') });
    if (!E) this.text('K', tx + 9, y0 - 8, { size: 10, color: this.c('sky') });
    const rows = [[E ? i18n('{t} gradi', { t: fmt(p.t, 0) }) : i18n('t = {t} °C, cioè T = {K} K', { t: fmt(p.t, 0), K: fmt(Math.round(K), 0) }), this.c('chalk'), 700]];
    if (live) {
      if (K < 0.5) rows.push([i18n('zero assoluto: le particelle sono ferme'), this.c('sky'), 700]);
      else if (E) rows.push([sp < 0.3 ? i18n('le particelle si muovono piano') : sp < 0.6 ? i18n('le particelle si agitano') : i18n('le particelle corrono velocissime'), this.c(col), 700]);
      else rows.push([i18n('le molecole dell’aria corrono a circa {v} m/s', { v: fmt(Math.round(517 * Math.sqrt(K / 300) / 10) * 10, 0) }), this.c(col), 700]);
    }
    this.box(rows);
  }

  // ---------- il caldo e il freddo che si incontrano ----------
  drawMix() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u, Te = mixT(p), iron = p.what === 'ferro';
    const k = easeOut(clamp01((u - (iron ? 0.25 : 0.12)) / 0.75)), Th = p.T1 + (Te - p.T1) * k, Tc = p.T2 + (Te - p.T2) * k;
    const x0 = 30, x1 = W - 30, yb = H - 34, vol = iron ? p.m2 : p.m1 + p.m2, yw = yb - Math.min(H * 0.55, 40 + vol * 40);
    const tint = (T) => (T > 45 ? 'coral' : T > 28 ? 'orange' : 'sky');
    // la vasca
    this.line([[x0, yw - 30], [x0, yb], [x1, yb], [x1, yw - 30]], { color: this.c('chalk'), width: 2.4 });
    if (iron) {
      g.save(); g.fillStyle = this.c(tint(Tc)); g.globalAlpha = 0.22; g.fillRect(x0, yw, x1 - x0, yb - yw); g.restore();
      // la palla di ferro: cade nell'acqua e si raffredda (dal rosso al grigio)
      const r = 10 + 6 * Math.cbrt(p.m1), fall = easeOut(clamp01(u / 0.25)), cy = (yw - 60) + fall * (yb - r - 2 - (yw - 60)), cx = (x0 + x1) / 2;
      this.ball(cx, cy, r, { color: this.c(Th > 300 ? 'coral' : Th > 60 ? 'orange' : 'muted'), fill: 0.55, width: 2, shine: false });
      if (live && u > 0.24 && u < 0.6 && p.T1 > 100) for (let i = 0; i < 4; i++) { const ph = (this.clock * 0.9 + i / 4) % 1; this.ball(cx - 18 + i * 12, yw - 6 - ph * 40, 3 + ph * 5, { color: this.c('chalk'), fill: 0.15, width: 1.2, shine: false, alpha: 1 - ph }); }
      this.thermo(x1 - 22, yw - 4, yb - 18, Tc, 0, 100, true, true);
      this.text(`${fmt(Math.round(Th), 0)} °C`, cx, cy - r - 8, { size: 11, align: 'center', color: this.c('orange'), weight: 700 });
    } else {
      // due metà, divise da una paratia che si alza: il caldo a sinistra, il freddo a destra
      const xm = x0 + (x1 - x0) * (p.m1 / (p.m1 + p.m2)), lift = easeOut(clamp01(u / 0.2)), mixd = k;
      for (const [a, b, T] of [[x0, xm, Th], [xm, x1, Tc]]) { g.save(); g.fillStyle = this.c(tint(T)); g.globalAlpha = 0.24; g.fillRect(a, yw, b - a, yb - yw); g.restore(); }
      if (mixd < 0.98) this.line([[xm, yw - 26 - lift * 50], [xm, yb - lift * (yb - yw + 50)]], { color: this.c('muted'), width: 3, alpha: 1 - mixd });
      this.thermo(x0 + 22, yw - 4, yb - 18, Th, 0, 100);
      this.thermo(x1 - 22, yw - 4, yb - 18, Tc, 0, 100, true, true);
      // il calore che passa dal caldo al freddo
      if (live && mixd > 0 && mixd < 0.95) this.arrow(xm - 24, (yw + yb) / 2, xm + 24, (yw + yb) / 2, { color: this.c('orange'), width: 3, head: 8 });
    }
    const rows = [[iron ? i18n('palla di ferro da {m} kg a {T} °C, {w} L d’acqua a {T2} °C', { m: one(p.m1), T: fmt(p.T1, 0), w: one(p.m2), T2: fmt(p.T2, 0) }) : i18n('{a} L a {T1} °C e {b} L a {T2} °C', { a: one(p.m1), T1: fmt(p.T1, 0), b: one(p.m2), T2: fmt(p.T2, 0) }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([iron ? i18n('ferro e acqua arrivano a {T} °C', { T: one(Te) }) : i18n('tutta l’acqua arriva a {T} °C', { T: one(Te) }), this.c('mint'), 700]);
      if (!E) rows.push([i18n('calore passato dal caldo al freddo: {Q} kJ', { Q: fmt(Math.round(this.result.Q / 100) / 10, 1) }), this.c('orange'), 600]);
    }
    this.box(rows);
  }

  // ---------- due pentole sullo stesso fornello ----------
  drawPots() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u;
    const yPot = H * 0.44, gy0 = H * 0.56, gy1 = H - 30, gx0 = 44, gx1 = W - 16, TMAX = 250;
    const temp = (k) => T0 + (Q_POT / STUFF[k].c) * u;
    [[p.a, W * 0.28], [p.b, W * 0.72]].forEach(([k, cx], i) => {
      const s = STUFF[k], T = temp(k), w = Math.min(96, W * 0.3), top = yPot - 54;
      // la fiamma, la pentola, il contenuto
      if (live) for (let j = 0; j < 3; j++) { const fl = 7 + 3 * Math.sin(this.clock * 14 + j * 2 + i); this.line([[cx - 16 + j * 16, yPot + 18], [cx - 16 + j * 16, yPot + 18 - fl]], { color: this.c('orange'), width: 4, alpha: 0.85 }); }
      this.line([[cx - 30, yPot + 20], [cx + 30, yPot + 20]], { color: this.c('muted'), width: 3 });
      this.line([[cx - w / 2, top], [cx - w / 2, yPot], [cx + w / 2, yPot], [cx + w / 2, top]], { color: this.c('chalk'), width: 2.4 });
      g.save(); g.fillStyle = this.c(T > 90 ? 'coral' : T > 45 ? 'orange' : s.liq ? 'sky' : 'sun'); g.globalAlpha = 0.25; g.fillRect(cx - w / 2 + 2, top + 14, w - 4, yPot - top - 15); g.restore();
      if (!s.liq) for (let j = 0; j < 14; j++) this.ball(cx - w / 2 + 8 + ((j * 37) % (w - 16)), top + 20 + ((j * 23) % (yPot - top - 26)), 1.6, { color: this.c('sun'), fill: 0.9, width: 1, shine: false });
      // i moti di convezione, nei liquidi: sale il caldo dal fondo, scende il freddo ai lati
      if (s.liq && live) for (const sgn of [-1, 1]) { const ph = this.clock * 2.4 * sgn; g.save(); g.strokeStyle = this.c('chalk'); g.globalAlpha = 0.45; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx + sgn * w * 0.22, (top + 14 + yPot) / 2, w * 0.15, (yPot - top - 18) * 0.38, 0, ph, ph + 4.8); g.stroke(); g.restore(); }
      this.text(i18n(s.name), cx, top - 6, { size: 12, align: 'center', color: this.c('chalk'), weight: 700 });
      this.text(`${fmt(Math.round(T), 0)} °C`, cx, yPot + 36, { size: 12, align: 'center', color: this.c('coral'), weight: 700 });
    });
    // il grafico temperatura–tempo: due rette, più ripida quella con il calore specifico più piccolo
    this.line([[gx0, gy0], [gx0, gy1], [gx1, gy1]], { color: this.c('muted'), width: 1.5 });
    for (const t of [0, 100, 200]) { const y = gy1 - (t / TMAX) * (gy1 - gy0); this.text(`${t}`, gx0 - 5, y + 4, { size: 10, align: 'right', color: this.c('muted'), mono: true }); }
    this.text('°C', gx0 - 5, gy0 - 6, { size: 10, align: 'right', color: this.c('muted') });
    this.text(i18n('3 minuti'), gx1, gy1 + 14, { size: 10, align: 'right', color: this.c('muted') });
    [[p.a, 'sky'], [p.b, 'orange']].forEach(([k, col]) => {
      if (!live) return;
      const pts = [];
      for (let i = 0; i <= 20; i++) { const f = (i / 20) * u, T = Math.min(TMAX, T0 + (Q_POT / STUFF[k].c) * f); pts.push([gx0 + f * (gx1 - gx0), gy1 - (T / TMAX) * (gy1 - gy0)]); }
      this.line(pts, { color: this.c(col), width: 2.5 });
      const [lx, ly] = pts[pts.length - 1];
      this.text(i18n(STUFF[k].name), Math.min(lx, gx1 - 40), ly - 7, { size: 11, color: this.c(col), weight: 700 });
    });
    const rows = [[i18n('1 kg di {a} e 1 kg di {b}, sullo stesso fuoco', { a: i18n(STUFF[p.a].name), b: i18n(STUFF[p.b].name) }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([i18n('{a}: +{x} °C · {b}: +{y} °C', { a: i18n(STUFF[p.a].name), x: fmt(Math.round(Q_POT / STUFF[p.a].c), 0), b: i18n(STUFF[p.b].name), y: fmt(Math.round(Q_POT / STUFF[p.b].c), 0) }), this.c('mint'), 700]);
      if (!E) rows.push([i18n('90 kJ a testa: ΔT = Q / (m·c)'), this.c('orange'), 600]);
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
