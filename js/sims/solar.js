// Il sistema solare (G03). Due modi:
//   - 'orbite': il Sole e gli otto pianeti visti dall'alto, sulle loro orbite (quasi cerchi); le distanze non sono
//     in scala (il raggio cresce come la radice della distanza vera, perché ci stiano tutti). ▶ Lancia fa girare i
//     pianeti con i loro anni veri finché il pianeta scelto (pl) fa un giro: il contatore dice quanti anni terrestri
//     sono passati. Con comet c'è anche la cometa di Halley, sulla sua ellisse lunghissima.
//   - 'scala': il modellino del sentiero dei pianeti. La Terra sta a 100 m dal Sole, e tutto è nella stessa scala:
//     il Sole è un pallone di 93 cm, la Terra un pisello di 8,5 mm, Nettuno sta a 3 km. ▶ Lancia: l'omino (o la luce,
//     con light) va dal Sole al pianeta scelto (target); con flag, va fino alla bandierina piantata a flag metri.
//     Con secret (per le previsioni) prima della prova non si vede niente che sveli la risposta, e i pianeti compaiono
//     man mano che l'omino ci passa accanto; con walk: false la prova mostra solo le grandezze, senza camminare.
// Risultato orbite: { T (anni terrestri del pianeta scelto), pl }
// Risultato scala: { target, d (m: dove sta il pianeta nel modellino), flag, err (m: bandierina − pianeta), light (s) }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeInOut } from './base.js';

const AU = 149.6e6;      // km
const LIGHT = 499;       // secondi: la luce dal Sole alla Terra
const MODEL = 100;       // m: la distanza Terra–Sole nel modellino
export const PLANETS = {
  mercurio: { a: 0.387, T: 0.241, D: 4879, col: 'muted', name: 'Mercurio' },
  venere: { a: 0.723, T: 0.615, D: 12104, col: 'sun', name: 'Venere' },
  terra: { a: 1, T: 1, D: 12742, col: 'sky', name: 'Terra' },
  marte: { a: 1.524, T: 1.881, D: 6779, col: 'coral', name: 'Marte' },
  giove: { a: 5.203, T: 11.86, D: 139820, col: 'orange', name: 'Giove' },
  saturno: { a: 9.537, T: 29.45, D: 116460, col: 'sun', name: 'Saturno', ring: true },
  urano: { a: 19.19, T: 84.02, D: 50724, col: 'mint', name: 'Urano' },
  nettuno: { a: 30.07, T: 164.8, D: 49244, col: 'sky', name: 'Nettuno' },
};
const SUN_D = 1392700; // km
const HALLEY = { a: 17.8, e: 0.967, T: 75.3 };
const KEYS = Object.keys(PLANETS);
const SEL = KEYS.map((k) => [k, PLANETS[k].name]);
const STARS = Array.from({ length: 50 }, (_, i) => [((i * 7919) % 1000) / 1000, ((i * 104729) % 997) / 997, (i % 3) + 1]);
// nel modellino: metri della distanza dal Sole e dei diametri
export const modelDist = (k) => PLANETS[k].a * MODEL;
const modelSize = (km) => (km / AU) * MODEL; // m

export class Solar extends Sim {
  static controls = {
    pl: { label: 'Pianeta', type: 'select', options: SEL },
    target: { label: 'Dove arrivare', type: 'select', options: SEL },
    flag: { label: 'Dove pianti la bandierina', min: 10, max: 3500, step: 10, unit: 'm' },
  };

  defaults() { return { mode: 'orbite', pl: 'terra', comet: false, target: 'terra', flag: null, light: false, secret: false, walk: true, lens: 's' }; }

  init() {
    this.years = 0; this.u = 0; this.arrived = -1;
    // gli angoli di partenza dei pianeti: sparsi, ma sempre gli stessi
    this.ph = Object.fromEntries(KEYS.map((k, i) => [k, (i * 2.399) % (Math.PI * 2)]));
  }

  // la meta del viaggio nel modellino (m)
  get goal() { const p = this.params; return p.flag != null ? p.flag : modelDist(p.target); }

  step(dt) {
    const p = this.params;
    if (p.mode === 'orbite') {
      const T = PLANETS[p.pl].T;
      this.years += (dt * T) / 6; // un giro del pianeta scelto in circa 6 secondi
      if (this.years >= T) { this.years = T; this.end(); }
      return;
    }
    // scala: 3 secondi per il viaggio, poi un attimo per guardare (senza viaggio: solo le grandezze, per un attimo)
    if (p.walk === false) { if (this.t > 1.8) this.end(); return; }
    if (this.u < 1) { this.u = Math.min(1, this.u + dt / 3); if (this.u >= 1) this.arrived = this.t; }
    else if (this.t - this.arrived > 0.9) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'orbite') return this.finish({ T: Math.round(PLANETS[p.pl].T * 100) / 100, pl: p.pl });
    const d = modelDist(p.target);
    this.finish({ target: p.target, d: Math.round(d), flag: p.flag, err: p.flag != null ? Math.round(p.flag - d) : null, light: Math.round(PLANETS[p.target].a * LIGHT) });
  }

  // ---------- disegno ----------
  draw() {
    const g = this.ctx, W = this.W, H = this.H, p = this.params;
    this.clear();
    g.save(); g.fillStyle = this.c('chalk');
    for (const [a, b, z] of STARS) { g.globalAlpha = 0.15 + 0.1 * z; g.fillRect(a * W, b * H, z * 0.6, z * 0.6); }
    g.restore();
    if (p.mode === 'orbite') this.drawOrbits(); else this.drawScale();
  }

  // il Sole, con un alone
  sun(x, y, r) {
    const g = this.ctx, grd = g.createRadialGradient(x, y, r * 0.3, x, y, r * 2.4);
    grd.addColorStop(0, 'rgba(255, 209, 102, .45)'); grd.addColorStop(1, 'rgba(255, 209, 102, 0)');
    g.save(); g.fillStyle = grd; g.beginPath(); g.arc(x, y, r * 2.4, 0, 7); g.fill(); g.restore();
    this.ball(x, y, r, { color: this.c('sun'), fill: 0.55, width: 2 });
  }

  drawOrbits() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, top0 = 40;
    const cx = W / 2, cy = top0 + (H - top0) / 2, R = Math.min(W - 20, H - top0 - 10) / 2;
    const rad = (a) => R * Math.sqrt(a / PLANETS.nettuno.a); // distanze non in scala: la radice
    this.sun(cx, cy, 7);
    // la fascia degli asteroidi, fra Marte e Giove
    g.save(); g.fillStyle = this.c('muted');
    for (let i = 0; i < 70; i++) { const a = i * 2.39996, d = rad(2.2 + ((i * 37) % 13) / 10); g.globalAlpha = 0.45; g.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1.2, 1.2); }
    g.restore();
    const labels = [];
    for (const k of KEYS) {
      const pl = PLANETS[k], r = rad(pl.a), sel = k === p.pl;
      g.save(); g.strokeStyle = this.c(sel ? pl.col : 'muted'); g.globalAlpha = sel ? 0.7 : 0.28; g.lineWidth = sel ? 1.6 : 1; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); g.restore();
      const ang = this.ph[k] - (this.years / pl.T) * Math.PI * 2; // in senso antiorario, visti dal nord
      const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r, s = pl.D > 100000 ? 5.5 : pl.D > 40000 ? 4.2 : 3;
      // un pianeta che fa più di due giri al secondo diventa un anello sfumato
      if (this.running && PLANETS[p.pl].T / 6 / pl.T > 2) {
        g.save(); g.strokeStyle = this.c(pl.col); g.globalAlpha = 0.45; g.lineWidth = s * 1.4; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); g.restore();
        continue;
      }
      if (pl.ring) { g.save(); g.strokeStyle = this.c(pl.col); g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, s * 2, s * 0.7, -0.3, 0, 7); g.stroke(); g.restore(); }
      this.ball(x, y, s, { color: this.c(pl.col), fill: sel ? 0.9 : 0.5, width: sel ? 2 : 1.4, shine: false });
      if (sel || pl.a > 1.6) labels.push({ t: i18n(pl.name), x: x + s + 3, y: y - s - 1, sel, col: pl.col });
    }
    // i nomi: prima quello del pianeta scelto, poi gli altri solo se non si accavallano
    labels.sort((a, b) => b.sel - a.sel);
    const taken = [];
    for (const L of labels) {
      g.font = `${L.sel ? 700 : 500} ${L.sel ? 11 : 9.5}px Lexend, system-ui, sans-serif`;
      const box = [L.x - 2, L.y - 11, L.x + g.measureText(L.t).width + 2, L.y + 3];
      if (!L.sel && taken.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
      taken.push(box);
      this.text(L.t, L.x, L.y, { size: L.sel ? 11 : 9.5, weight: L.sel ? 700 : 500, color: this.c(L.sel ? L.col : 'muted') });
    }
    // la cometa di Halley: un'ellisse lunghissima, veloce vicino al Sole e lentissima lontano
    if (p.comet) {
      const { a, e, T } = HALLEY, pts = [];
      for (let i = 0; i <= 120; i++) { const E = (i / 120) * Math.PI * 2, x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E), r = Math.hypot(x, y), q = Math.atan2(y, x) + 2.2; pts.push([cx + Math.cos(q) * rad(r), cy + Math.sin(q) * rad(r)]); }
      this.line(pts, { color: this.c('pink'), width: 1.2, dash: [3, 4], alpha: 0.55 });
      // dove si trova adesso: dall'anomalia media all'anomalia eccentrica (equazione di Keplero)
      const M = ((this.years / T) * Math.PI * 2 + 3.4) % (Math.PI * 2);
      let E = M; for (let i = 0; i < 12; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E), r = Math.hypot(x, y), q = Math.atan2(y, x) + 2.2;
      const X = cx + Math.cos(q) * rad(r), Y = cy + Math.sin(q) * rad(r);
      this.line([[X, Y], [X + (X - cx) * 0.12, Y + (Y - cy) * 0.12]], { color: this.c('pink'), width: 2, alpha: 0.7 });
      this.ball(X, Y, 2.8, { color: this.c('pink'), fill: 1, width: 1, shine: false });
      this.text('Halley', X + 6, Y + 12, { size: 9.5, color: this.c('pink') });
    }
    // il riquadro: gli anni che passano e i giri della Terra
    const sel = PLANETS[p.pl], rows = [[i18n('Anni terrestri: {y}', { y: fmt(this.years, this.years < 10 ? 2 : 1) }), this.c('chalk'), 700]];
    rows.push([i18n('{p}: un giro in {y} anni', { p: i18n(sel.name), y: fmt(sel.T, sel.T < 10 ? 2 : 1) }), this.c(sel.col), 600]);
    if (this.result) rows[1][2] = 700; else if (!this.running) rows.pop();
    this.box(rows);
    this.text(i18n('distanze non in scala'), W - 8, H - 8, { size: 9.5, align: 'right', color: this.c('muted') });
  }

  // il sentiero del modellino, in scala: la Terra a 100 m dal Sole
  drawScale() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    const live = this.running || !!this.result, walk = p.walk !== false;
    // per le previsioni (secret): prima della prova il sentiero è vuoto; senza viaggio resta vuoto anche dopo
    const bare = p.secret && (!live || !walk);
    const goal = this.goal, real = modelDist(p.target);
    // la vista: dal Sole fino un po' oltre la meta (e il pianeta vero), e si allarga mentre si cammina
    const span = Math.max(goal, p.flag != null && this.result ? real : 0, 30) * 1.15;
    const x0 = 22, x1 = W - 16, k = (x1 - x0) / span, yG = H - 48;
    const X = (m) => x0 + m * k;
    const u = this.result ? 1 : walk ? easeInOut(this.u) : 0, at = goal * u;
    // sopra il sentiero, a destra: le grandezze vere del Sole e del pianeta, nella stessa scala del sentiero
    const showPlanet = !(p.secret && !live) && !(p.flag != null && !this.result);
    this.sizes(p.target, yG, showPlanet ? (walk || this.result ? 1 : clamp01(this.t / 0.8)) : 0);
    // il sentiero, con le tacche
    this.line([[x0 - 10, yG], [x1 + 6, yG]], { color: this.c('muted'), width: 2 });
    if (!bare) {
      const step = span < 150 ? 25 : span < 400 ? 50 : span < 900 ? 100 : span < 1800 ? 250 : span < 3600 ? 500 : 1000;
      for (let m = 0; m <= span; m += step) {
        this.line([[X(m), yG], [X(m), yG + 5]], { color: this.c('muted'), width: 1.2 });
        this.text(m >= 1000 ? `${fmt(m / 1000, m % 1000 ? 1 : 0)} km` : `${m} m`, X(m), yG + 17, { size: 9.5, align: 'center', color: this.c('muted'), mono: true });
      }
    }
    // il Sole all'inizio del sentiero (93 cm: un puntino, a questa scala), e le bandierine dei pianeti
    this.sun(X(0), yG - 8, Math.max(3, modelSize(SUN_D) * k * 0.5 + 3));
    for (const kk of bare ? [] : KEYS) {
      const d = modelDist(kk);
      if (d > span) continue;
      // il pianeta da trovare con la bandierina si vede solo alla fine; con secret, i pianeti compaiono al passaggio
      if (kk === p.target && p.flag != null && !this.result) continue;
      if (p.secret && !this.result && d > at + 0.5) continue;
      const col = this.c(PLANETS[kk].col);
      this.line([[X(d), yG], [X(d), yG - 22]], { color: col, width: 1.4, alpha: 0.8 });
      this.ball(X(d), yG - 25, 2.5, { color: col, fill: 1, width: 1, shine: false });
      if (kk === p.target || d > span * 0.12) this.text(i18n(PLANETS[kk].name), X(d), yG - 32, { size: 9.5, align: 'center', color: col, weight: kk === p.target ? 700 : 500 });
    }
    // la bandierina piantata da te
    if (p.flag != null) {
      const fx = X(p.flag), col = this.c('pink');
      this.line([[fx, yG], [fx, yG - 30]], { color: col, width: 2 });
      g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(fx, yG - 30); g.lineTo(fx + 12, yG - 26); g.lineTo(fx, yG - 22); g.closePath(); g.fill(); g.restore();
    }
    // chi viaggia: l'omino che cammina, o un lampo di luce
    const wx = X(at);
    if (live && walk) {
      if (p.light) {
        this.line([[X(0), yG - 8], [wx, yG - 8]], { color: this.c('sun'), width: 2.4, alpha: 0.5 });
        this.ball(wx, yG - 8, 3.5, { color: this.c('sun'), fill: 1, width: 1, shine: false });
      } else this.walker(wx, yG, u < 1 && this.running);
    }
    // il riquadro
    const rows = [];
    const lab = i18n(PLANETS[p.target].name), col = this.c(PLANETS[p.target].col);
    if (p.secret && !live) { /* prima della previsione: niente */ }
    else if (!walk) rows.push([i18n('{p}: {s} di diametro, nel modellino', { p: lab, s: this.size(PLANETS[p.target].D) }), col, 700]);
    else if (p.flag != null && !this.result) rows.push([i18n('la tua bandierina: a {d} dal Sole', { d: this.meters(p.flag) }), this.c('pink'), 700]);
    else if (p.secret && !this.result) rows.push([i18n('verso {p}…', { p: lab }), col, 700]);
    else rows.push([i18n('{p}: {d} dal Sole, nel modellino', { p: lab, d: this.meters(real) }), col, 700]);
    if (live && walk) rows.push([i18n('percorsi: {d}', { d: this.meters(at) }), this.c('chalk'), 600]);
    if (p.light && live && walk) rows.push([i18n('la luce vera ci mette {t}', { t: this.lightText(PLANETS[p.target].a * LIGHT * u) }), this.c('sun'), 600]);
    if (this.result && p.flag != null) {
      const e = this.result.err;
      const ok = Math.abs(e) <= Math.max(10, real * 0.06);
      rows.push([ok ? i18n('bandierina al posto giusto!') : e < 0 ? i18n('troppo vicina: mancano {d}', { d: this.meters(-e) }) : i18n('troppo lontana: {d} di troppo', { d: this.meters(e) }), this.c(ok ? 'mint' : 'coral'), 700]);
    }
    this.box(rows);
  }

  // le grandezze, in un riquadro sopra il sentiero: il Sole (un pallone) e il pianeta (un pisello, una biglia...)
  // nella stessa scala. show: quanto si vede il pianeta (0 = ancora nascosto)
  sizes(k, yG, show) {
    const g = this.ctx, W = this.W, pl = PLANETS[k];
    const sunR = 22, pr = Math.max(0.8, (pl.D / SUN_D) * sunR);
    const sx = W - 46, y = Math.max(64 + sunR, yG - 84), px = sx - sunR - 34;
    // la cornice, con il suo titolo
    g.save(); g.beginPath(); g.roundRect(px - 26, y - sunR - 20, W - 8 - (px - 26), sunR * 2 + 42, 8);
    g.fillStyle = this.c('sim-bg'); g.globalAlpha = 0.9; g.fill();
    g.strokeStyle = this.c('muted'); g.globalAlpha = 0.35; g.lineWidth = 1; g.stroke(); g.restore();
    this.text(i18n('grandezze in scala'), px - 18, y - sunR - 8, { size: 9, color: this.c('muted') });
    this.sun(sx, y + 2, sunR);
    this.text(i18n('Sole: {d}', { d: this.size(SUN_D) }), sx, y + sunR + 15, { size: 9.5, align: 'center', color: this.c('sun') });
    if (show <= 0) { this.text('?', px, y + sunR - 2, { size: 13, align: 'center', weight: 700, color: this.c('muted') }); return; }
    g.save(); g.globalAlpha = show;
    this.ball(px, y + 2 + sunR - pr, pr, { color: this.c(pl.col), fill: 0.9, width: 1, shine: false });
    if (pl.ring) { g.strokeStyle = this.c(pl.col); g.lineWidth = 1; g.beginPath(); g.ellipse(px, y + 2 + sunR - pr, pr * 2, pr * 0.6, -0.3, 0, 7); g.stroke(); }
    this.text(this.size(pl.D), px, y + sunR + 15, { size: 9.5, align: 'center', color: this.c(pl.col) });
    g.restore();
  }

  // la misura di un diametro nel modellino: «93 cm», «8,5 mm»
  size(km) {
    const m = modelSize(km);
    if (m >= 0.1) return `${fmt(m * 100, 0)} cm`;
    if (m >= 0.01) return `${fmt(m * 100, 1)} cm`;
    return `${fmt(m * 1000, 1)} mm`;
  }

  meters(m) { return m >= 1000 ? `${fmt(m / 1000, 2)} km` : `${fmt(Math.round(m), 0)} m`; }

  lightText(sec) {
    const s = Math.round(sec);
    if (s < 60) return i18n('{s} s', { s });
    const m = Math.floor(s / 60), r = s % 60;
    if (m < 60) return r ? i18n('{m} min {s} s', { m, s: r }) : i18n('{m} min', { m });
    const h = Math.floor(m / 60), mm = m % 60;
    return mm ? i18n('{h} h {m} min', { h, m: mm }) : i18n('{h} h', { h });
  }

  // un omino che cammina (le gambe si muovono finché va)
  walker(x, y, moving) {
    const col = this.c('chalk'), sw = moving ? Math.sin(this.clock * 12) * 4 : 0;
    this.line([[x - 3 - sw, y], [x, y - 10], [x + 3 + sw, y]], { color: col, width: 2 });
    this.line([[x, y - 10], [x, y - 20]], { color: col, width: 2.2 });
    this.line([[x - 5 + sw * 0.6, y - 13], [x, y - 18], [x + 5 - sw * 0.6, y - 13]], { color: col, width: 1.8 });
    this.ball(x, y - 24, 3.6, { color: col, fill: 0.3, width: 1.8, shine: false });
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
