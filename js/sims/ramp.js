// La rampa dell'Officina: una cassa con i blocchi della massa (1 kg l'uno), su un piano orizzontale o inclinato.
// Tre modi:
//   tiro  — piano orizzontale: una corda tira la cassa con la forza F. Finché il tiro non supera l'attrito massimo
//           (μs · N) la cassa resta ferma, e l'attrito è proprio uguale al tiro; poi parte, e l'attrito scende a μd · N.
//   rampa — piano inclinato di theta gradi: il peso P si divide in una parte lungo il piano, P∥ = P · sin θ, e una
//           contro il piano, P⊥ = P · cos θ, che il piano regge (N = P⊥). Se P∥ supera l'attrito massimo μs · N
//           la cassa scivola, con a = g · (sin θ − μd · cos θ); se no resta ferma.
//   alza  — il piano si alza piano piano da 0°: la cassa si stacca all'angolo in cui P∥ supera l'attrito massimo.
//           Quell'angolo dipende dalla superficie, non dalla massa (è il boss di Vetrino).
// Le frecce partono dal centro della cassa: il peso (giallo) e le sue due parti (tratteggiate), la spinta del piano
// (verde), l'attrito (rosso, con il tratteggio fino al massimo che il piano può trattenere) e il tiro (bianco).
// Gli esperimenti fatti restano scritti nel riquadro in basso; nel modo alza i loro angoli restano segnati sull'arco.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const G = 9.81, RAD = Math.PI / 180;
// le superfici: attrito statico μs (quanto trattiene da ferma) e dinamico μd (quanto frena mentre scivola)
export const SURF = { liscio: [0, 0], ghiaccio: [0.1, 0.05], legno: [0.5, 0.3], gomma: [0.9, 0.7] };
export const MAXT = 45; // la pendenza più grande, in gradi
export const LIFT = 6;  // nel modo alza, gradi al secondo
const CW = 42, CH = 13, BS = 10, PT = 11; // la cassa (larghezza e altezza, in pixel), i blocchi sopra, lo spessore dell'asse
const SNAME = { liscio: () => i18n('Piano liscio'), ghiaccio: () => i18n('Ghiaccio'), legno: () => i18n('Legno'), gomma: () => i18n('Gomma') };

export class Ramp extends Sim {
  static tall = true;
  static controls = {
    theta: { label: 'Pendenza', min: 0, max: 45, step: 1, unit: '°' },
    F: { label: 'Forza del tiro', min: 0, max: 60, step: 1, unit: 'N' },
    m1: { label: 'Blocchi sulla cassa', min: 1, max: 6, step: 1, unit: 'kg' },
    floor: { label: 'Superficie', type: 'select', options: [['ghiaccio', 'Ghiaccio'], ['legno', 'Legno'], ['gomma', 'Gomma']] },
  };

  // L: lunghezza della rampa (m); D: metri da percorrere nel modo tiro; arrows: le frecce delle forze;
  // parts: le due parti del peso, tratteggiate; lens: la lente di chi gioca (per le scritte)
  // rider: sulla cassa c'è un bambino invece dei blocchi (lo scivolo del parco)
  defaults() { return { mode: 'rampa', theta: 30, F: 10, m1: 2, floor: 'legno', L: 4, D: 3, arrows: true, parts: true, rider: false, lens: 's', tmax: 30 }; }

  constructor(cv, p) { super(cv, p); this.history = []; }

  init() {
    const p = this.params, [ms, md] = SURF[p.floor] || SURF.legno;
    this.ms = ms; this.md = md; this.m = p.m1;
    this.th = p.mode === 'rampa' ? p.theta : 0; // l'angolo di adesso, in gradi
    this.x = 0; this.v = 0; this.a = 0;         // metri percorsi, velocità, accelerazione
    this.moving = false; this.t0 = 0; this.slip = null; this.still = -1; this.tEnd = null; this.land = -1; this.vpts = [];
  }

  clearHistory() { this.history = []; this.draw(); }

  // le forze di adesso, in newton
  forces() {
    const p = this.params, P = this.m * G, th = this.th * RAD, flat = p.mode === 'tiro';
    const par = flat ? 0 : P * Math.sin(th), N = flat ? P : P * Math.cos(th);
    const drive = flat ? p.F : par, max = this.ms * N; // quello che tira la cassa avanti, e quanto il piano può trattenere
    const fr = this.moving ? this.md * N : Math.min(drive, max);
    return { P, par, N, drive, max, fr, F: flat ? p.F : 0 };
  }

  step(dt) {
    const p = this.params, t = this.t, len = p.mode === 'tiro' ? p.D : p.L;
    if (!this.moving) {
      if (p.mode === 'alza') this.th = Math.min(MAXT, this.th + LIFT * dt);
      const f = this.forces();
      if (f.drive > f.max + 1e-9) { this.moving = true; this.t0 = t; this.slip = this.th; }
      else if (p.mode !== 'alza' || this.th >= MAXT) {
        // resta ferma: si guardano ancora un momento le frecce in equilibrio, poi l'esperimento finisce
        if (this.still < 0) this.still = t;
        if (t - this.still > 1.2) return this.end();
      }
    }
    if (this.moving) {
      const f = this.forces();
      this.a = (f.drive - f.fr) / this.m;
      const v0 = this.v;
      this.v = Math.max(0, v0 + this.a * dt);
      this.x += ((v0 + this.v) / 2) * dt;
      if (this.x >= len) { this.x = len; this.tEnd = t - this.t0; this.land = this.clock; return this.end(); }
    }
    if (t > p.tmax) this.end();
  }

  end() {
    if (this.result) return;
    const p = this.params, r2 = (x) => Math.round(x * 100) / 100, f = this.forces();
    const res = {
      moved: [this.moving], slip: [this.slip == null ? null : Math.round(this.slip * 10) / 10],
      v: [r2(this.v)], a: [this.moving ? r2(this.a) : 0], t: [this.tEnd == null ? null : r2(this.tEnd)],
      theta: [Math.round(this.th)], fs: [r2(f.max)],
    };
    this.history = this.history || [];
    this.history.push({ mode: p.mode, floor: p.floor, m: this.m, rider: p.rider, F: p.F, th: Math.round(this.th), moved: this.moving, slip: this.slip, v: this.v, a: this.a, t: this.tEnd });
    if (this.history.length > 3) this.history.shift();
    this.finish(res);
  }

  // ---------- disegno ----------
  // la superficie fra x0 e x1, con il bordo di sopra in y (nel sistema di riferimento di adesso: orizzontale o ruotato)
  surface(x0, x1, y, kind) {
    const g = this.ctx;
    g.save();
    if (kind === 'legno') {
      g.fillStyle = 'rgba(255, 155, 84, .18)'; g.fillRect(x0, y, x1 - x0, 8);
      g.strokeStyle = 'rgba(255, 155, 84, .6)'; g.lineWidth = 1; g.beginPath();
      for (const [dy, ph] of [[2.6, 0], [5.4, 1.7]]) for (let x = x0 + 4; x < x1 - 8; x += 26) { g.moveTo(x + ph * 3, y + dy); g.quadraticCurveTo(x + 8 + ph * 3, y + dy - 1.4, x + 17 + ph * 3, y + dy); }
      g.stroke();
    } else if (kind === 'ghiaccio') {
      g.fillStyle = 'rgba(124, 200, 255, .2)'; g.fillRect(x0, y, x1 - x0, 7);
      g.strokeStyle = 'rgba(238, 244, 255, .55)'; g.lineWidth = 1.2; g.beginPath();
      for (let x = x0 + 14; x < x1 - 10; x += 37) { g.moveTo(x, y + 5); g.lineTo(x + 9, y + 2); g.moveTo(x + 6, y + 5.5); g.lineTo(x + 10, y + 4); }
      g.stroke();
    } else if (kind === 'gomma') {
      g.fillStyle = 'rgba(141, 155, 189, .22)'; g.fillRect(x0, y, x1 - x0, 7);
      g.fillStyle = 'rgba(141, 155, 189, .7)';
      for (let x = x0 + 4; x < x1 - 2; x += 7) { g.beginPath(); g.arc(x, y + 0.6, 1.3, Math.PI, 0); g.fill(); }
      g.strokeStyle = 'rgba(141, 155, 189, .4)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y + 4.5); g.lineTo(x1, y + 4.5); g.stroke();
    } else {
      g.strokeStyle = this.c('muted'); g.lineWidth = 1;
      g.beginPath(); g.moveTo(x0, y + 5); g.lineTo(x1, y + 5); g.stroke();
      g.fillStyle = this.c('muted');
      for (let x = x0 + 6; x < x1; x += 12) { g.beginPath(); g.arc(x, y + 2.4, 0.9, 0, 7); g.fill(); }
    }
    g.restore();
    this.line([[x0, y], [x1, y]], { color: this.c('ink'), width: 2.2 });
  }

  // la cassa fra x0 e x0 + CW, appoggiata sulla linea y (nel sistema di adesso), con i blocchi sopra.
  // Restituisce il centro della cassa con i blocchi, dove partono le frecce.
  drawCrate(x0, y) {
    const g = this.ctx, col = this.c('car1'), n = Math.round(this.m), rows = Math.ceil(n / 3), top = y - CH;
    g.save();
    g.strokeStyle = col; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.fillStyle = col; g.globalAlpha = 0.18; g.beginPath(); g.roundRect(x0, top, CW, CH, 2.5); g.fill();
    g.globalAlpha = 1; g.beginPath(); g.roundRect(x0, top, CW, CH, 2.5); g.stroke();
    g.lineWidth = 1.2; g.globalAlpha = 0.6; g.beginPath(); g.moveTo(x0 + 3, top + CH / 2); g.lineTo(x0 + CW - 3, top + CH / 2); g.stroke();
    g.restore();
    if (this.params.rider) {
      // un bambino seduto, con le braccia in alto
      const pk = this.c('pink'), hx = x0 + 13, hy = top - 1;
      this.line([[hx, hy], [hx - 3, hy - 13]], { color: pk, width: 2.2 });
      this.line([[hx, hy], [x0 + 24, hy - 2], [x0 + 31, hy - 1]], { color: pk, width: 2.2 });
      this.line([[hx - 2, hy - 10], [hx + 6, hy - 19]], { color: pk, width: 2 });
      this.line([[hx - 2, hy - 10], [hx - 9, hy - 18]], { color: pk, width: 2 });
      this.ball(hx - 4, hy - 18.5, 4.6, { color: pk, fill: 0.25, width: 2, shine: false });
      return [x0 + CW / 2, top - 10];
    }
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3), cl = i % 3, k = Math.min(3, n - row * 3);
      const bx = x0 + CW / 2 - (k * (BS + 1.5)) / 2 + cl * (BS + 1.5), by = top - (row + 1) * (BS + 1.5);
      g.save(); g.strokeStyle = this.c('sun'); g.fillStyle = 'rgba(255, 209, 102, .28)'; g.lineWidth = 1.5;
      g.beginPath(); g.roundRect(bx, by, BS, BS, 1.5); g.fill(); g.stroke(); g.restore();
    }
    return [x0 + CW / 2, y - (CH + rows * (BS + 1.5)) / 2];
  }

  // linee di velocità dietro la cassa (nel sistema di adesso: la cassa va verso destra)
  speedLines(xr, y) {
    if (!this.running || !this.moving || this.v < 0.3) return;
    const k = Math.min(1, this.v / 6);
    for (let j = 0; j < 3; j++) {
      const len = 6 + 18 * k, off = (this.clock * 90 + j * 13) % 16, bx = xr - 5 - off;
      this.line([[bx, y - 16 + j * 5], [bx - len, y - 16 + j * 5]], { color: this.c('car1'), width: 1.5, alpha: 0.45 });
    }
  }

  // le frecce delle forze. Il peso, la sua parte contro il piano (P⊥) e la spinta del piano partono dal centro C della cassa;
  // il «tiro alla fune» lungo il piano si vede ai due capi: l'attrito tira indietro dal punto R in cui la cassa tocca
  // il piano, dietro; la parte del peso lungo il piano (P∥) tira avanti dal punto A, davanti; il tiro parte dal muso T.
  // d: verso «avanti» (in discesa, o verso il tiro); n: verso fuori dal piano
  drawForces({ C, R, A, T }, d, n, f, k) {
    const p = this.params;
    if (!p.arrows) return;
    // a esperimento finito, se la cassa è arrivata in fondo, le frecce si spengono (lì la ferma il paraurti)
    const al = this.result && this.moving ? 1 - clamp01(this.age / 0.6) : 1;
    if (al <= 0) return;
    const [cx, cy] = C, at = (u, len) => [cx + u[0] * len * k, cy + u[1] * len * k];
    const yel = this.c('sun'), red = this.c('coral');
    if (p.mode !== 'tiro' && p.parts) {
      const [qx, qy] = at([-n[0], -n[1]], f.N);
      this.arrow(cx, cy, qx, qy, { color: yel, width: 2.2, head: 7, dash: [4, 4], alpha: 0.9 * al });
      if (f.par > 0.05) this.arrow(A[0], A[1], A[0] + d[0] * f.par * k, A[1] + d[1] * f.par * k, { color: yel, width: 2.4, head: 8, dash: [4, 4], alpha: al });
    }
    // l'attrito, all'indietro lungo il piano; e quanto il piano può trattenere al massimo: un tratteggio con una tacca,
    // finché la cassa è ferma
    const back = (len) => [R[0] - d[0] * len * k, R[1] - d[1] * len * k];
    if (!this.moving && f.max > 0) {
      const [mx, my] = back(f.max), [ex, ey] = back(f.fr);
      this.line([[ex, ey], [mx, my]], { color: red, width: 1.6, dash: [3, 4], alpha: 0.75 * al });
      this.line([[mx + n[0] * 5, my + n[1] * 5], [mx - n[0] * 5, my - n[1] * 5]], { color: red, width: 2, alpha: 0.85 * al });
    }
    if (f.fr > 0.05) { const [ex, ey] = back(f.fr); this.arrow(R[0], R[1], ex, ey, { color: red, width: 3, head: 8, alpha: al }); }
    if (f.F > 0) this.arrow(T[0], T[1], T[0] + d[0] * f.F * k, T[1] + d[1] * f.F * k, { color: this.c('chalk'), width: 3, head: 9, alpha: al });
    { const [ex, ey] = at(n, f.N); this.arrow(cx, cy, ex, ey, { color: this.c('mint'), width: 3, head: 8, alpha: al }); }
    this.arrow(cx, cy, cx, cy + f.P * k, { color: yel, width: 3, head: 8, alpha: al });
    this.ball(cx, cy, 2.6, { color: this.c('chalk'), fill: 1, width: 1, shine: false, alpha: al });
  }

  draw() {
    const p = this.params, H = this.H;
    this.clear();
    // pixel per newton (59 N: il peso di 6 kg). Sul pavimento c'è più posto per le frecce che sulla rampa.
    const f = this.forces(), k = p.mode === 'tiro' ? Math.min(2.3, (H * 0.3) / 59) : Math.min(2, (H * 0.24) / 59);
    if (p.mode === 'tiro') this.drawFlat(f, k); else this.drawRamp(f, k);
    if (p.arrows) this.legend();
    this.results();
  }

  drawRamp(f, k) {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    // B: lo spigolo di sotto dell'asse, in fondo, appoggiato al pavimento: la rampa gira intorno a lui
    const y0 = H - 96, Bx = W - 26, By = y0;
    const Lpx = Math.min(W - 72, (y0 - 70) / Math.sin(MAXT * RAD));
    const th = this.th * RAD, c = Math.cos(th), s = Math.sin(th);
    const Ax = Bx + PT * s - Lpx * c, Ay = By - PT * c - Lpx * s; // la cima della superficie
    const Wd = (u, v) => [Ax + u * c - v * s, Ay + u * s + v * c]; // dal sistema della rampa a quello del disegno
    // la cassa: parte con il retro a 8 px dalla cima e arriva con il muso al paraurti
    const u0 = 8, u1 = Lpx - 3 - CW, uR = u0 + (u1 - u0) * clamp01(this.x / p.L); // il retro della cassa
    // la rampa, nel suo sistema: superficie, asse, paraurti in fondo
    g.save(); g.translate(Ax, Ay); g.rotate(th);
    this.surface(0, Lpx, 0, p.floor);
    g.strokeStyle = this.c('muted'); g.lineWidth = 1.4; g.strokeRect(0, 0, Lpx, PT);
    this.line([[Lpx, 0], [Lpx, -15]], { color: this.c('chalk'), width: 3 });
    this.speedLines(uR, 0);
    const Cl = this.drawCrate(uR, 0);
    g.restore();
    // il terreno copre il pezzo di asse che finisce sotto il pavimento
    g.fillStyle = this.c('sim-bg'); g.fillRect(0, y0 + 1, W, H - y0);
    this.ground(y0, { x0: 8, x1: W - 8 });
    // il sostegno sotto la cima: un pistone che si allunga
    const [sx, sy] = Wd(14, PT), hS = y0 - sy;
    if (hS > 6) {
      this.line([[sx, y0], [sx, y0 - hS * 0.55]], { color: this.c('muted'), width: 6, alpha: 0.8 });
      this.line([[sx, y0 - hS * 0.55 + 2], [sx, sy]], { color: this.c('muted'), width: 2.6 });
      this.line([[sx - 9, y0], [sx + 9, y0]], { color: this.c('muted'), width: 3 });
    }
    // l'angolo, in fondo: arco, gradi e (nel modo alza) gli angoli a cui si sono staccate le casse prima
    const r = 36;
    if (this.th > 0.5) {
      g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.6; g.beginPath(); g.arc(Bx, By, r, Math.PI, Math.PI + th); g.stroke(); g.restore();
      const la = Math.PI + Math.max(th / 2, 0.12);
      this.text(`${fmt(this.th, 0)}°`, Bx + Math.cos(la) * (r + 16), By + Math.sin(la) * (r + 16) + 4, { size: 12, align: 'center', color: this.c('chalk'), mono: true });
    }
    if (p.mode === 'alza') for (const h of this.history || []) if (h.mode === 'alza' && h.slip != null) {
      const a = Math.PI + h.slip * RAD;
      this.line([[Bx + Math.cos(a) * (r - 6), By + Math.sin(a) * (r - 6)], [Bx + Math.cos(a) * (r + 6), By + Math.sin(a) * (r + 6)]], { color: this.c('sun'), width: 2.4, alpha: 0.85 });
    }
    // arrivo al paraurti
    if (this.land >= 0) { const [bx, by] = Wd(Lpx, -10); this.burst(bx, by, this.clock - this.land, { color: this.c('car1'), n: 8, r: 22 }); }
    if (this.result && !this.moving) { const [qx, qy] = Wd(uR + CW / 2, -16); this.ripple(qx, qy, this.age, { color: this.c('car1'), r1: 24 }); }
    // le forze
    this.drawForces({ C: Wd(Cl[0], Cl[1]), R: Wd(uR, -1.5), A: Wd(uR + CW, -1.5), T: Wd(uR + CW, -CH / 2) }, [c, s], [s, -c], f, k);
  }

  drawFlat(f, k) {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    const y0 = Math.round(H * 0.56), xs = Math.round(W * 0.42) - CW / 2, xf = W - 36;
    const ppm = (xf - (xs + CW)) / p.D, x0 = xs + this.x * ppm;
    this.surface(10, W - 10, y0, p.floor);
    // traguardo e metri
    g.save(); g.strokeStyle = this.c('ink'); g.lineWidth = 1.5; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(xf, y0 - 70); g.lineTo(xf, y0 + 8); g.stroke(); g.restore();
    this.text('0', xs + CW, y0 + 24, { size: 11, align: 'center', color: this.c('muted') });
    this.text(`${p.D} m`, xf, y0 + 24, { size: 11, align: 'center', color: this.c('muted') });
    this.speedLines(x0, y0);
    const C = this.drawCrate(x0, y0);
    if (this.land >= 0) this.burst(xf, y0 - 10, this.clock - this.land, { color: this.c('car1'), n: 8, r: 22 });
    if (this.result && !this.moving) this.ripple(x0 + CW / 2, y0 - 16, this.age, { color: this.c('car1'), r1: 24 });
    this.drawForces({ C, R: [x0, y0 - 1.5], A: [x0 + CW, y0 - 1.5], T: [x0 + CW, y0 - CH / 2] }, [1, 0], [0, -1], f, k);
  }

  // i colori delle frecce, in alto a sinistra
  legend() {
    const p = this.params, S = p.lens === 's', ramp = p.mode !== 'tiro';
    const rows = [[S ? i18n('P: peso') : i18n('peso'), this.c('sun')]];
    if (ramp && p.parts) rows.push([S ? i18n('P∥ e P⊥: le due parti del peso') : i18n('le due parti del peso'), this.c('sun'), true]);
    rows.push([S ? i18n('N: spinta del piano') : i18n('spinta del piano'), this.c('mint')], [S ? i18n('Fₐ: attrito') : i18n('attrito'), this.c('coral')]);
    if (!ramp) rows.push([S ? i18n('F: tiro') : i18n('tiro della corda'), this.c('chalk')]);
    rows.forEach(([txt, col, dash], i) => {
      const y = 16 + i * 15;
      this.line([[12, y - 4], [28, y - 4]], { color: col, width: 2.4, dash: dash ? [3, 3] : undefined });
      this.text(txt, 34, y, { size: 11, color: this.c('muted') });
    });
  }

  // il riquadro dei risultati, in basso a destra: il tempo, gli esperimenti fatti e i numeri dell'ultimo
  describe(h) {
    const what = [SNAME[h.floor] ? SNAME[h.floor]() : h.floor];
    if (!h.rider) what.push(h.m === 1 ? i18n('1 blocco') : i18n('{n} blocchi', { n: h.m }));
    if (h.mode === 'tiro') what.push(`${h.F} N`);
    if (h.mode === 'rampa') what.push(`${h.th}°`);
    let res;
    if (!h.moved) res = h.mode === 'alza' ? i18n('ferma anche a {a}°', { a: MAXT }) : i18n('resta ferma');
    else if (h.mode === 'alza') res = i18n('si stacca a {a}°', { a: fmt(h.slip, 0) });
    else if (h.mode === 'tiro') res = i18n('parte');
    else res = i18n('in fondo a {v} m/s', { v: fmt(h.v, 1) });
    return `${what.join(', ')}: ${res}`;
  }

  results() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, hist = this.history || [];
    const rows = [[i18n('Tempo: {a} s', { a: fmt(this.t, 1) }), this.c('ink'), 600]];
    hist.forEach((h, i) => rows.push([this.describe(h), i === hist.length - 1 && this.result ? this.c('car1') : this.c('muted'), i === hist.length - 1 && this.result ? 700 : 500]));
    const last = hist[hist.length - 1];
    if (this.result && last && last.moved && last.t != null) {
      const a = fmt(last.a, 1), t = fmt(last.t, 1);
      rows.push([p.lens === 's' ? i18n('a = {a} m/s², in {t} s', { a, t }) : p.lens === 'e' ? i18n('ogni secondo +{a} m/s, in {t} s', { a, t }) : i18n('accelerazione {a} m/s², in {t} s', { a, t }), this.c('car1'), 500]);
    }
    g.font = '600 12px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([r]) => g.measureText(r).width)) + 14, by = H - 12 - rows.length * 16;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(W - 14 - bw + 7, by, bw, rows.length * 16 + 6); g.restore();
    rows.forEach(([r, col, w], i) => this.text(r, W - 14, by + 14 + i * 16, { size: 12, align: 'right', weight: w, color: col }));
  }
}
