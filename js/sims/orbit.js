// Il cannone di Newton (G01). La Terra vista da lontano, una montagna di fantasia alta 1600 km (molto sopra l'aria)
// e un cannone che spara in orizzontale. Piano, la palla cade vicino; più forte, più lontano; a circa 7 km/s gira
// intorno alla Terra e torna alla montagna: è in orbita, cade sempre ma non tocca mai terra. Da 10 km/s scappa via.
// La gravità tira sempre verso il centro della Terra (F = G·M·m/r²). Il tempo scorre 900 volte più in fretta.
// Risultato: { landed, orbit, escaped, range (km lungo la superficie), T (minuti per un giro), ecc (eccentricità con
//              il segno: + se la palla parte dal punto più vicino alla Terra, − se dal più lontano), rmin, rmax (km) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

export const GM = 398600; // km³/s²: la Terra
export const RE = 6371;   // km
const TS = 900;           // secondi della simulazione per ogni secondo dell'animazione
// le terre emerse: macchie fisse, in coordinate polari (angolo, distanza dal centro in raggi)
const LAND = [
  [[0.3, 0.92], [0.6, 0.97], [0.9, 0.9], [1.1, 0.7], [0.8, 0.55], [0.45, 0.62]],
  [[2.4, 0.95], [2.8, 0.9], [3.1, 0.75], [2.9, 0.5], [2.5, 0.6]],
  [[4.2, 0.85], [4.6, 0.97], [5.0, 0.92], [5.1, 0.7], [4.7, 0.45], [4.3, 0.6]],
];
const STARS = Array.from({ length: 46 }, (_, i) => [((i * 7919) % 1000) / 1000, ((i * 104729) % 997) / 997, (i % 3) + 1]);

export class Orbit extends Sim {
  static controls = {
    v: { label: 'Velocità del cannone', min: 1, max: 12, step: 0.1, unit: 'km/s' },
  };

  // h: altezza della montagna (km); arrow: la freccia della gravità sulla palla; trails: le traiettorie di prima
  defaults() { return { v: 4, h: 1600, arrow: true, trails: true, lens: 's', tmax: 12 * 3600 }; }

  constructor(cv, p) { super(cv, p); this.trails = []; }

  get r0() { return RE + this.params.h; }

  init() {
    const p = this.params;
    this.x = 0; this.y = this.r0; this.vx = p.v; this.vy = 0;
    this.path = [[this.x, this.y]];
    this.swept = 0; this.ang = 0; this.rmin = this.r0; this.rmax = this.r0;
    this.landedAt = null; this.flash = this.running ? this.clock : null;
    this.sim = 0; // secondi della simulazione
  }

  start() { super.start(); this.flash = this.clock; }

  acc(x, y) { const r2 = x * x + y * y, r = Math.sqrt(r2), k = -GM / (r2 * r); return [k * x, k * y]; }

  step(dt) {
    const p = this.params;
    let h = dt * TS * (this.rmax > 3 * RE ? 3 : 1);
    // passi piccoli: velocity Verlet
    const n = Math.max(1, Math.ceil(h / 2)); h /= n;
    for (let i = 0; i < n && this.running; i++) {
      const [ax, ay] = this.acc(this.x, this.y);
      this.x += this.vx * h + 0.5 * ax * h * h; this.y += this.vy * h + 0.5 * ay * h * h;
      const [bx, by] = this.acc(this.x, this.y);
      this.vx += 0.5 * (ax + bx) * h; this.vy += 0.5 * (ay + by) * h;
      this.sim += h;
      const r = Math.hypot(this.x, this.y);
      this.rmin = Math.min(this.rmin, r); this.rmax = Math.max(this.rmax, r);
      // l'angolo spazzato, in senso orario a partire dalla cima
      const a = Math.atan2(this.x, this.y);
      let d = a - this.ang; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      this.swept += d; this.ang = a;
      if (r <= RE) return this.end('landed');
      if (this.swept >= 2 * Math.PI) return this.end('orbit');
      if (r > 9 * RE && this.energy() >= 0) return this.end('escaped');
      if (this.sim > p.tmax) return this.end(this.energy() >= 0 ? 'escaped' : 'far');
    }
    const last = this.path[this.path.length - 1];
    if (Math.hypot(this.x - last[0], this.y - last[1]) > 70) this.path.push([this.x, this.y]);
  }

  energy() { return (this.vx ** 2 + this.vy ** 2) / 2 - GM / Math.hypot(this.x, this.y); }

  end(how) {
    if (!this.running) return;
    const p = this.params;
    this.path.push([this.x, this.y]);
    if (how === 'landed') { this.landedAt = this.clock; const k = RE / Math.hypot(this.x, this.y); this.x *= k; this.y *= k; }
    this.trails.push({ path: this.path, how });
    if (this.trails.length > 4) this.trails.shift();
    const ecc = (this.r0 * p.v * p.v) / GM - 1, a = 1 / (2 / this.r0 - (p.v * p.v) / GM);
    this.finish({
      landed: how === 'landed', orbit: how === 'orbit', far: how === 'far', escaped: how === 'escaped', v: p.v,
      range: how === 'landed' ? Math.round((this.swept * RE) / 10) * 10 : null,
      // il periodo dell'orbita (terza legge di Keplero), in minuti
      T: a > 0 && how !== 'landed' ? Math.round((2 * Math.PI * Math.sqrt(a ** 3 / GM)) / 60) : null,
      ecc: Math.round(ecc * 1000) / 1000, rmin: Math.round(this.rmin), rmax: Math.round(this.rmax),
    });
  }

  // ---------- disegno ----------
  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    // la vista: la Terra al centro, e abbastanza spazio per la traiettoria più lontana
    const trails = this.trails || [];
    const far = Math.min(9 * RE, Math.max(this.r0 * 1.12, this.rmax * 1.08, ...trails.filter((t) => t.how !== 'escaped').map((t) => Math.max(...t.path.map(([x, y]) => Math.hypot(x, y))) * 1.06)));
    // sopra resta una fascia per le scritte
    const top0 = 46;
    const s = this.sm('scale', (Math.min(W - 12, H - top0 - 8) / 2) / far, 8);
    const cx = W / 2, cy = top0 + (H - top0) / 2;
    const S = (x, y) => [cx + x * s, cy - y * s];
    // le stelle
    g.save(); g.fillStyle = this.c('chalk');
    for (const [a, b, z] of STARS) { g.globalAlpha = 0.18 + 0.12 * z; g.fillRect(a * W, b * H, z * 0.6, z * 0.6); }
    g.restore();
    // la Terra: mare, terre, un velo d'aria sottilissimo
    const Rp = RE * s;
    g.save();
    g.beginPath(); g.arc(cx, cy, Rp + Math.max(1.5, 100 * s), 0, 7); g.fillStyle = this.c('sky'); g.globalAlpha = 0.12; g.fill();
    g.globalAlpha = 1; g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.fillStyle = '#0f2340'; g.fill();
    g.clip();
    g.fillStyle = this.c('mint'); g.globalAlpha = 0.28;
    // le terre: curve morbide che passano a metà fra un punto e l'altro
    for (const blob of LAND) {
      const pts = blob.map(([a, d]) => [cx + Math.sin(a) * d * Rp, cy - Math.cos(a) * d * Rp]), n = pts.length;
      const mid = (i) => [(pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2];
      g.beginPath(); g.moveTo(...mid(n - 1));
      for (let i = 0; i < n; i++) g.quadraticCurveTo(pts[i][0], pts[i][1], ...mid(i));
      g.fill();
    }
    g.restore();
    g.save(); g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.stroke(); g.restore();
    // la montagna e il cannone
    const top = S(0, this.r0), base = 0.16;
    g.save(); g.beginPath(); g.moveTo(cx - Math.sin(base) * Rp, cy - Math.cos(base) * Rp); g.lineTo(top[0], top[1]); g.lineTo(cx + Math.sin(base) * Rp, cy - Math.cos(base) * Rp);
    g.closePath(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.35; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 1.8; g.lineJoin = 'round'; g.stroke();
    const cap = (p.h * 0.28) * s;
    g.beginPath(); g.moveTo(top[0] - cap * 0.55, top[1] + cap); g.lineTo(top[0], top[1]); g.lineTo(top[0] + cap * 0.55, top[1] + cap); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.7; g.fill(); g.restore();
    this.line([[top[0] - 3, top[1] - 2], [top[0] + 9, top[1] - 2]], { color: this.c('chalk'), width: 4 });
    if (this.flash != null && this.clock - this.flash < 0.5) this.burst(top[0] + 10, top[1] - 2, this.clock - this.flash, { color: this.c('sun'), n: 8, r: 14, dur: 0.45 });
    // le traiettorie di prima (sbiadite) e quella di adesso
    if (p.trails) trails.forEach((t, i) => {
      if (this.result && i === trails.length - 1) return;
      this.line(t.path.map(([x, y]) => S(x, y)), { color: this.c('muted'), width: 1.6, dash: [4, 5], alpha: 0.35 + 0.1 * i });
    });
    const now = this.result && trails.length ? trails[trails.length - 1].path : [...this.path, [this.x, this.y]];
    this.line(now.map(([x, y]) => S(x, y)), { color: this.c('sun'), width: 2.2 });
    // la palla e la gravità che la tira verso il centro
    const [bx, by] = S(this.x, this.y);
    if (p.arrow && !(this.result && this.result.landed)) {
      const r = Math.hypot(this.x, this.y), len = 24;
      this.arrow(bx, by, bx - (this.x / r) * len, by + (this.y / r) * len, { color: this.c('coral'), width: 2.4, head: 7 });
    }
    this.ball(bx, by, 4.5, { color: this.c('sun'), fill: 0.9, width: 1.5 });
    if (this.landedAt != null && this.clock - this.landedAt < 0.8) this.burst(bx, by, this.clock - this.landedAt, { color: this.c('sun'), n: 9, r: 18, dur: 0.6 });
    this.results();
  }

  results() {
    const g = this.ctx, p = this.params, r = this.result;
    const rows = [[i18n('Velocità di lancio: {v} km/s', { v: fmt(p.v, p.v % 1 ? 1 : 0) }), this.c('chalk'), 600]];
    if (this.running) rows.push([i18n('dopo {t}', { t: this.clockText(this.sim) }), this.c('muted'), 500]);
    if (r) {
      if (r.landed) rows.push([i18n('cade a {d} km dalla montagna', { d: fmt(r.range, 0) }), this.c('sun'), 700]);
      else if (r.orbit) rows.push([i18n('fa il giro della Terra in {t}', { t: this.clockText(r.T * 60) }), this.c('mint'), 700]);
      else if (r.far) rows.push([i18n('va lontanissimo: torna dopo {t}', { t: this.clockText(r.T * 60) }), this.c('mint'), 700]);
      else rows.push([i18n('scappa nello spazio'), this.c('pink'), 700]);
    }
    g.font = '600 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 16 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 20 + i * 16, { size: 11.5, weight: w, color: col }));
  }

  // «25 min», «1 h 40 min», «3 giorni»
  clockText(sec) {
    const m = Math.round(sec / 60);
    if (m >= 48 * 60) return i18n('{d} giorni', { d: Math.round(m / 1440) });
    if (m < 60) return i18n('{m} min', { m });
    const hh = Math.floor(m / 60), mm = m % 60;
    return mm ? i18n('{h} h {m} min', { h: hh, m: mm }) : i18n('{h} h', { h: hh });
  }
}
