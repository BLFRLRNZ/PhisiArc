// Orbite e leggi di Keplero (G02). Due modi:
//   - 'ellisse': un satellite parte in orizzontale dalla cima, a h km di altezza, con velocità v. Più veloce del
//     necessario per un cerchio, l'orbita si allunga in un'ellisse; più lento, si schiaccia verso il pianeta (o lo
//     colpisce). Con areas: true, ogni dodicesimo di giro si colora lo spicchio spazzato: spicchi di area uguale
//     (seconda legge di Keplero), lunghi e stretti lontano, corti e larghi vicino. Il pianeta può essere coperto
//     dal telo di Bilancia (hide) e avere una massa diversa da quella della Terra (M, in masse terrestri).
//   - 'satelliti': la Stazione spaziale, un satellite GPS e uno per la TV girano in cerchio intorno alla Terra che
//     ruota; più sono in alto, più vanno piano e più ci mettono a fare un giro. Con h si aggiunge il tuo satellite.
// Risultato ellisse: { landed, escaped, circ, ecc (con il segno: + se parte dal punto più vicino), T (minuti),
//                      hp, ha (altezza nel punto più vicino e più lontano, km), vmax, vmin (km/s) }
// Risultato satelliti: { T (ore, del tuo satellite), laps, fixed (resta sopra l'antenna) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const GM0 = 398600; // km³/s², la Terra
const RE = 6371;     // km
const DAY = 86164;   // secondi: un giro della Terra su se stessa
export const SATS = {
  iss: { h: 400, name: 'Stazione', col: 'sky', ph: 3.6 },
  gps: { h: 20200, name: 'GPS', col: 'mint', ph: 1.9 },
  tv: { h: 35786, name: 'TV', col: 'sun', ph: 0 },
};
const LAND = [
  [[0.3, 0.92], [0.6, 0.97], [0.9, 0.9], [1.1, 0.7], [0.8, 0.55], [0.45, 0.62]],
  [[2.4, 0.95], [2.8, 0.9], [3.1, 0.75], [2.9, 0.5], [2.5, 0.6]],
  [[4.2, 0.85], [4.6, 0.97], [5.0, 0.92], [5.1, 0.7], [4.7, 0.45], [4.3, 0.6]],
];
const STARS = Array.from({ length: 46 }, (_, i) => [((i * 7919) % 1000) / 1000, ((i * 104729) % 997) / 997, (i % 3) + 1]);
const period = (r, gm = GM0) => 2 * Math.PI * Math.sqrt(r ** 3 / gm); // secondi, orbita circolare di raggio r

export class Kepler extends Sim {
  static controls = {
    v: { label: 'Velocità del satellite', min: 1, max: 12, step: 0.1, unit: 'km/s' },
    h: { label: 'Altezza del satellite', min: 200, max: 40000, step: 100, unit: 'km' },
  };

  // sats: i satelliti del modo 'satelliti'; mine: c'è anche il tuo (all'altezza h); areas: gli spicchi; hide: telo
  defaults() { return { mode: 'ellisse', v: 7.7, h: 400, M: 1, areas: false, hide: false, sats: ['iss', 'gps', 'tv'], mine: true, lens: 's' }; }

  get gm() { return GM0 * (this.params.M || 1); }
  get r0() { return RE + this.params.h; }

  init() {
    const p = this.params;
    this.sim = 0;
    if (p.mode === 'satelliti') return;
    this.x = 0; this.y = this.r0; this.vx = p.v; this.vy = 0;
    this.path = [[this.x, this.y]]; this.swept = 0; this.ang = 0;
    this.rmin = this.r0; this.rmax = this.r0; this.vmax = p.v; this.vmin = p.v;
    // l'orbita che verrà: semiasse maggiore, eccentricità e periodo (per lo zoom e per il passo del tempo)
    const a = 1 / (2 / this.r0 - (p.v * p.v) / this.gm);
    this.a = a;
    this.ecc = (this.r0 * p.v * p.v) / this.gm - 1;
    this.Tx = a > 0 ? 2 * Math.PI * Math.sqrt(a ** 3 / this.gm) : null;
    this.farR = a > 0 ? Math.max(this.r0, 2 * a - this.r0) : this.r0 * 3;
    this.ts = (this.Tx || period(this.r0, this.gm)) / 6; // un giro in circa 6 secondi
    this.marks = [[this.x, this.y]]; this.nextMark = this.Tx ? this.Tx / 12 : Infinity;
    this.hit = null;
  }

  acc(x, y) { const r2 = x * x + y * y, r = Math.sqrt(r2), k = -this.gm / (r2 * r); return [k * x, k * y]; }

  step(dt) {
    const p = this.params;
    if (p.mode === 'satelliti') {
      this.sim += dt * 7200; // due ore al secondo
      if (this.sim >= DAY) { this.sim = DAY; this.end(); }
      return;
    }
    let h = dt * this.ts;
    const n = Math.max(1, Math.ceil(h / 4)); h /= n;
    for (let i = 0; i < n && this.running; i++) {
      const [ax, ay] = this.acc(this.x, this.y);
      this.x += this.vx * h + 0.5 * ax * h * h; this.y += this.vy * h + 0.5 * ay * h * h;
      const [bx, by] = this.acc(this.x, this.y);
      this.vx += 0.5 * (ax + bx) * h; this.vy += 0.5 * (ay + by) * h;
      this.sim += h;
      const r = Math.hypot(this.x, this.y), v = Math.hypot(this.vx, this.vy);
      this.rmin = Math.min(this.rmin, r); this.rmax = Math.max(this.rmax, r);
      this.vmax = Math.max(this.vmax, v); this.vmin = Math.min(this.vmin, v);
      const a = Math.atan2(this.x, this.y);
      let d = a - this.ang; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      this.swept += d; this.ang = a;
      if (this.sim >= this.nextMark) { this.marks.push([this.x, this.y]); this.nextMark += this.Tx / 12; }
      if (r <= RE) return this.end('landed');
      if (this.swept >= 2 * Math.PI) { this.marks[12] = [0, this.r0]; return this.end('orbit'); }
      if (r > 12 * RE && !this.Tx) return this.end('escaped');
    }
    const last = this.path[this.path.length - 1];
    if (Math.hypot(this.x - last[0], this.y - last[1]) > 60) this.path.push([this.x, this.y]);
  }

  end(how) {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'satelliti') {
      const T = period(this.r0) / 3600;
      return this.finish({ T: Math.round(T * 10) / 10, laps: Math.round((DAY / 3600 / T) * 10) / 10, fixed: Math.abs(T * 3600 - DAY) < 1800 });
    }
    this.path.push([this.x, this.y]);
    if (how === 'landed') { const k = RE / Math.hypot(this.x, this.y); this.x *= k; this.y *= k; this.hit = this.clock; }
    this.finish({
      landed: how === 'landed', escaped: how === 'escaped', orbit: how === 'orbit',
      circ: how === 'orbit' && Math.abs(this.ecc) < 0.02, ecc: Math.round(this.ecc * 1000) / 1000,
      T: this.Tx && how !== 'escaped' ? Math.round(this.Tx / 60) : null,
      hp: Math.round(this.rmin - RE), ha: Math.round(this.rmax - RE),
      vmax: Math.round(this.vmax * 10) / 10, vmin: Math.round(this.vmin * 10) / 10,
    });
  }

  // ---------- disegno ----------
  draw() {
    const p = this.params, W = this.W, H = this.H;
    this.clear();
    const g = this.ctx;
    g.save(); g.fillStyle = this.c('chalk');
    for (const [a, b, z] of STARS) { g.globalAlpha = 0.18 + 0.12 * z; g.fillRect(a * W, b * H, z * 0.6, z * 0.6); }
    g.restore();
    if (p.mode === 'satelliti') return this.drawSats();
    const top0 = 46;
    const far = Math.min(14 * RE, this.farR * 1.08);
    // l'ellisse ha il pianeta in un fuoco: si centra il disegno fra il punto più vicino e il più lontano
    const s = (Math.min(W - 12, H - top0 - 8) / 2) / Math.max(far, (this.r0 + this.farR) / 2 * 1.08);
    const cx = W / 2, cy = top0 + (H - top0) / 2 - ((this.farR - this.r0) / 2) * s * (this.a > 0 ? 1 : 0);
    const S = (x, y) => [cx + x * s, cy - y * s];
    this.planet(cx, cy, RE * s, p.hide);
    // gli spicchi: aree uguali in tempi uguali
    if (p.areas && this.marks.length > 1) this.marks.forEach((m, i) => {
      if (i === 0) return;
      const a0 = this.marks[i - 1];
      g.save(); g.beginPath(); g.moveTo(cx, cy); g.lineTo(...S(...a0)); g.lineTo(...S(...m)); g.closePath();
      g.fillStyle = this.c(i % 2 ? 'sky' : 'orange'); g.globalAlpha = 0.18; g.fill(); g.restore();
    });
    // la strada fatta, poi il satellite
    const now = [...this.path, [this.x, this.y]];
    this.line(now.map(([x, y]) => S(x, y)), { color: this.c('sun'), width: 2.2 });
    const [bx, by] = S(this.x, this.y);
    if (!(this.result && this.result.landed)) {
      const v = Math.hypot(this.vx, this.vy), k = 5;
      this.arrow(bx, by, bx + this.vx * k, by - this.vy * k, { color: this.c('chalk'), width: 2, head: 6 });
      const r = Math.hypot(this.x, this.y);
      this.arrow(bx, by, bx - (this.x / r) * 20, by + (this.y / r) * 20, { color: this.c('coral'), width: 2.2, head: 6 });
      void v;
    }
    this.sat(bx, by, this.c('sun'));
    if (this.hit != null && this.clock - this.hit < 0.8) this.burst(bx, by, this.clock - this.hit, { color: this.c('sun'), n: 9, r: 18, dur: 0.6 });
    this.panel();
  }

  // il pianeta, o il telo di Bilancia che lo copre
  planet(cx, cy, Rp, hide) {
    const g = this.ctx;
    if (hide) {
      const b = this.c('boss');
      g.save(); g.beginPath();
      for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2, rr = Rp * (1.08 + 0.07 * Math.sin(i * 2.7)); i ? g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : g.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      g.closePath(); g.fillStyle = b; g.globalAlpha = 0.3; g.fill(); g.globalAlpha = 1; g.strokeStyle = b; g.lineWidth = 2; g.stroke(); g.restore();
      this.text('?', cx, cy + Rp * 0.3, { size: Math.max(14, Rp * 0.9), align: 'center', weight: 700, color: this.c('chalk') });
      return;
    }
    g.save(); g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.fillStyle = '#0f2340'; g.fill(); g.clip();
    g.fillStyle = this.c('mint'); g.globalAlpha = 0.28;
    const rot = this.params.mode === 'satelliti' ? (this.sim / DAY) * Math.PI * 2 : 0;
    for (const blob of LAND) {
      const pts = blob.map(([a, d]) => [cx + Math.sin(a - rot) * d * Rp, cy - Math.cos(a - rot) * d * Rp]), n = pts.length;
      const mid = (i) => [(pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2];
      g.beginPath(); g.moveTo(...mid(n - 1)); for (let i = 0; i < n; i++) g.quadraticCurveTo(pts[i][0], pts[i][1], ...mid(i)); g.fill();
    }
    g.restore();
    g.save(); g.beginPath(); g.arc(cx, cy, Rp, 0, 7); g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.stroke(); g.restore();
  }

  // un satellite: un corpo e due pannelli
  sat(x, y, col) {
    this.line([[x - 7, y], [x + 7, y]], { color: col, width: 1.6 });
    const g = this.ctx;
    g.save(); g.fillStyle = col; g.globalAlpha = 0.5; g.fillRect(x - 9, y - 2.5, 4, 5); g.fillRect(x + 5, y - 2.5, 4, 5); g.restore();
    this.ball(x, y, 3.2, { color: col, fill: 0.9, width: 1.2, shine: false });
  }

  panel() {
    const g = this.ctx, p = this.params, r = this.result, E = p.lens === 'e';
    const v = Math.hypot(this.vx, this.vy), d = Math.hypot(this.x, this.y) - RE;
    const rows = [[i18n('Velocità: {v} km/s', { v: fmt(v, 1) }), this.c('chalk'), 600], [i18n('Altezza: {h} km', { h: fmt(Math.max(0, Math.round(d / 10) * 10), 0) }), this.c('muted'), 500]];
    if (r) {
      if (r.landed) rows.push([i18n('si schianta sul pianeta'), this.c('coral'), 700]);
      else if (r.escaped) rows.push([i18n('scappa nello spazio'), this.c('pink'), 700]);
      else {
        rows.push([i18n('un giro in {t}', { t: this.clockText(r.T * 60) }), this.c('mint'), 700]);
        rows.push([r.circ ? i18n('orbita rotonda') : E ? i18n('orbita allungata') : i18n('ellisse: da {a} a {b} km di altezza', { a: fmt(r.hp, 0), b: fmt(r.ha, 0) }), this.c(r.circ ? 'mint' : 'sun'), 600]);
      }
    }
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }

  // tre satelliti veri (e il tuo) intorno alla Terra che gira, con un'antenna a terra
  drawSats() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, top0 = 58;
    const rMax = RE + Math.max(SATS.tv.h, p.mine ? p.h : 0);
    const s = (Math.min(W - 16, H - top0 - 10) / 2) / (rMax * 1.04), cx = W / 2, cy = top0 + (H - top0) / 2;
    const list = p.sats.map((k) => ({ ...SATS[k], key: k }));
    if (p.mine) list.push({ h: p.h, name: 'il tuo', col: 'pink', key: 'mine', ph: 0 });
    for (const o of list) { g.save(); g.strokeStyle = this.c(o.col); g.globalAlpha = 0.35; g.lineWidth = 1.2; g.setLineDash([3, 4]); g.beginPath(); g.arc(cx, cy, (RE + o.h) * s, 0, 7); g.stroke(); g.restore(); }
    this.planet(cx, cy, RE * s, false);
    // l'antenna: gira con la Terra (in senso antiorario, visto dal polo nord)
    const rot = (this.sim / DAY) * Math.PI * 2, ax = cx + Math.sin(-rot) * RE * s, ay = cy - Math.cos(-rot) * RE * s;
    this.ball(ax, ay, 3, { color: this.c('coral'), fill: 1, width: 1, shine: false });
    this.line([[ax, ay], [cx + Math.sin(-rot) * (RE * s + 9), cy - Math.cos(-rot) * (RE * s + 9)]], { color: this.c('coral'), width: 1.6 });
    for (const o of list) {
      const T = period(RE + o.h), a = -(this.sim / T) * Math.PI * 2 - o.ph, r = (RE + o.h) * s;
      const x = cx + Math.sin(a) * r, y = cy - Math.cos(a) * r;
      this.sat(x, y, this.c(o.col));
      // il nome del tuo sotto, gli altri sopra: così non si coprono quando sono sulla stessa orbita
      this.text(i18n(o.name), x + 10, o.key === 'mine' ? y + 14 : y - 6, { size: 10, color: this.c(o.col), weight: 600 });
    }
    // il riquadro: il tempo che passa, e il giro del tuo satellite
    const hrs = this.sim / 3600, rows = [[i18n('Sono passate {h} ore', { h: fmt(Math.floor(hrs), 0) }), this.c('chalk'), 600]];
    if (p.mine) rows.push([i18n('il tuo: un giro in {t}', { t: this.clockText(period(this.r0)) }), this.c('pink'), 600]);
    if (this.result && p.mine) rows.push([this.result.fixed ? i18n('resta sempre sopra l’antenna!') : i18n('non resta sopra l’antenna'), this.c(this.result.fixed ? 'mint' : 'muted'), 700]);
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }

  clockText(sec) {
    const m = Math.round(sec / 60);
    if (m >= 48 * 60) return i18n('{d} giorni', { d: Math.round(m / 1440) });
    if (m < 60) return i18n('{m} min', { m });
    const hh = Math.floor(m / 60), mm = m % 60;
    return mm ? i18n('{h} h {m} min', { h: hh, m: mm }) : i18n('{h} h', { h: hh });
  }
}
