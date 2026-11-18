// Le montagne russe dell'Officina: un vagoncino su un binario di colline e valli, senza attrito o con un po' di attrito.
// Tre binari (track):
//   collina — la partenza in alto (h0), una lunga discesa, una collina alta h1 e la stazione con i freni.
//             Si misura la velocità in cima alla collina: il vagoncino la supera solo se parte più in alto.
//   valle   — una valle fra due rampe: il vagoncino parte fermo a un'altezza h0 sulla rampa di sinistra e risale su quella
//             di destra, ripida o dolce. Senza attrito risale alla stessa altezza: l'energia si conserva.
//             Con oscilla: true va avanti e indietro finché l'attrito lo ferma in fondo.
//   salita  — la salita con la catena: un motore di potenza P (kW) tira su il vagoncino, a velocità costante, fino a h0.
//             Il lavoro è m·g·h, qualunque sia la pendenza; il tempo è il lavoro diviso la potenza.
// La barra in alto a sinistra è l'energia del vagoncino: di posizione (azzurro), di movimento (arancione) e il calore
// (rosso) che l'attrito porta via. Con hide: true la partenza sta nella nebbia di Vetrino (il boss al buio).
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const G = 9.81, RAD = Math.PI / 180;
const LIFT = { ripida: 40, dolce: 20 }; // le pendenze della salita con la catena, in gradi

// il profilo del binario: punti chiave uniti da curve morbide (in cima e in fondo il binario è piatto)
function profile(keys) {
  const X = [], Y = [];
  for (let i = 0; i + 1 < keys.length; i++) {
    const [xa, ya, lin] = keys[i], [xb, yb] = keys[i + 1], n = Math.max(2, Math.ceil((xb - xa) / 0.08));
    for (let j = i ? 1 : 0; j <= n; j++) {
      const u = j / n, w = lin ? u : (1 - Math.cos(Math.PI * u)) / 2;
      X.push(xa + (xb - xa) * u); Y.push(ya + (yb - ya) * w);
    }
  }
  const S = [0];
  for (let i = 1; i < X.length; i++) S.push(S[i - 1] + Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]));
  return { X, Y, S, len: S[S.length - 1] };
}

export class Coaster extends Sim {
  static controls = {
    h0: { label: 'Altezza della partenza', min: 2, max: 30, step: 1, unit: 'm' },
    side: { label: 'Rampa di destra', type: 'select', options: [['ripida', 'Ripida'], ['dolce', 'Dolce']] },
    fr: { label: 'Attrito', type: 'select', options: [[0, 'Senza attrito'], [0.1, 'Con attrito']] },
    P: { label: 'Potenza del motore', min: 2, max: 20, step: 1, unit: 'kW' },
    lift: { label: 'Salita', type: 'select', options: [['ripida', 'Ripida'], ['dolce', 'Dolce']] },
  };

  // m: massa del vagoncino con i passeggeri (kg); h1: altezza della collina; HM: l'altezza più grande del binario
  defaults() { return { track: 'collina', h0: 12, h1: 10, side: 'ripida', fr: 0, oscilla: false, m: 400, P: 10, lift: 'ripida', bars: true, hide: false, lens: 's', tmax: 40 }; }

  constructor(cv, p) { super(cv, p); this.history = []; }

  // il binario: punti chiave [x, y, rettilineo?] e i punti notevoli (cima della collina, inizio della stazione…)
  build() {
    const p = this.params;
    if (p.track === 'valle') {
      const HM = 24, R = p.side === 'dolce' ? 48 : 20;
      this.HM = HM; this.Xext = 28 + 4 + 48;
      this.T = profile([[0, HM], [28, 0], [32, 0], [32 + R, HM], [32 + R + 3, HM]]);
      this.xBottom = 30;
    } else if (p.track === 'salita') {
      const th = (LIFT[p.lift] || 40) * RAD, dx = p.h0 / Math.tan(th);
      this.HM = 30; this.Xext = 4 + 30 / Math.tan(20 * RAD) + 6;
      this.T = profile([[0, 0, true], [4, 0, true], [4 + dx, p.h0, true], [4 + dx + 5, p.h0]]);
      this.sLift = [4, 4 + Math.hypot(dx, p.h0)];
    } else {
      const h1 = p.h1;
      this.HM = 30; this.Xext = 3 + 24 + 3 + 14 + 14 + 16;
      const xh = 3 + 24 + 3 + 14;
      this.T = profile([[0, p.h0], [3, p.h0], [27, 0], [30, 0], [xh, h1], [xh + 14, 0], [xh + 30, 0]]);
      this.xHill = xh; this.xStation = xh + 16;
    }
  }

  // posizione lungo il binario: x, y e pendenza, alla distanza s dalla partenza del binario
  at(s) {
    const { X, Y, S } = this.T;
    s = Math.max(0, Math.min(this.T.len, s));
    let i = this.ci || 1;
    while (i < S.length - 1 && S[i] < s) i++;
    while (i > 1 && S[i - 1] > s) i--;
    this.ci = i;
    const u = (s - S[i - 1]) / Math.max(1e-9, S[i] - S[i - 1]);
    const x = X[i - 1] + (X[i] - X[i - 1]) * u, y = Y[i - 1] + (Y[i] - Y[i - 1]) * u;
    return { x, y, phi: Math.atan2(Y[i] - Y[i - 1], X[i] - X[i - 1]) };
  }
  // la prima distanza (da sinistra) a cui il binario arriva all'altezza y scendendo
  sAtHeight(y) {
    const { Y, S } = this.T;
    for (let i = 1; i < Y.length; i++) if (Y[i] <= y && Y[i - 1] >= y) return S[i - 1] + ((S[i] - S[i - 1]) * (Y[i - 1] - y)) / Math.max(1e-9, Y[i - 1] - Y[i]);
    return 0;
  }

  init() {
    const p = this.params;
    this.build(); this.ci = 1;
    this.v = 0; this.turn = -1; this.passed = false; this.vtop = 0; this.hmax = 0; this.vmax = 0; this.tEnd = null; this.land = -1; this.stopAt = -1;
    if (p.track === 'valle') this.s = this.sAtHeight(p.h0);
    else if (p.track === 'salita') this.s = this.sLift[0];
    else { this.s = 2.6; this.v = 0.5; } // una piccola spinta, per staccarsi dalla piattaforma piatta
    const q = this.at(this.s);
    this.E0 = p.m * G * q.y + 0.5 * p.m * this.v * this.v;
    this.Q = 0; // il calore portato via dall'attrito (J)
  }

  clearHistory() { this.history = []; this.draw(); }

  // accelerazione lungo il binario: la parte del peso lungo il binario e l'attrito contro il moto
  acc(s, v) {
    const p = this.params, { phi } = this.at(s), gs = -G * Math.sin(phi), fr = p.fr * G * Math.cos(phi);
    if (Math.abs(v) < 1e-6) return Math.abs(gs) <= fr ? 0 : gs - Math.sign(gs) * fr;
    return gs - Math.sign(v) * fr;
  }

  // con oscilla la corsa è lunga: si guarda accelerata, tre passi di fisica per ogni passo di tempo
  step(dt) {
    const n = this.params.oscilla ? 3 : 1;
    for (let k = 0; k < n && this.running; k++) { if (k) this.t += dt; this.step1(dt); }
  }

  step1(dt) {
    const p = this.params, t = this.t;
    if (p.track === 'salita') {
      const th = (LIFT[p.lift] || 40) * RAD, vL = (p.P * 1000) / (p.m * G * Math.sin(th));
      this.v = vL; this.s = Math.min(this.sLift[1], this.s + vL * dt);
      if (this.s >= this.sLift[1] - 1e-9) { this.tEnd = t; this.land = this.clock; return this.end(); }
      return;
    }
    // un passo «a metà» (Runge-Kutta 2): l'energia resta quella giusta anche dopo tanti passi
    const s0 = this.s, v0 = this.v, a1 = this.acc(s0, v0);
    const sm = s0 + (v0 * dt) / 2, vm = v0 + (a1 * dt) / 2, a2 = this.acc(sm, vm);
    let v1 = v0 + a2 * dt;
    if (p.fr > 0 && Math.sign(v1) !== Math.sign(v0) && v0 !== 0 && Math.abs(a2) <= p.fr * G) v1 = 0; // l'attrito ferma, non spinge indietro
    let s1 = s0 + vm * dt;
    // nella stazione i freni fermano il vagoncino
    const q = this.at(s1);
    if (p.track === 'collina' && q.x > this.xStation && v1 > 0) { v1 = Math.max(0, v1 - 5 * dt); }
    this.Q += Math.max(0, p.fr * G * Math.cos(q.phi) * p.m * Math.abs(s1 - s0));
    this.s = s1; this.v = v1;
    this.vmax = Math.max(this.vmax, Math.abs(v1));
    if (p.track === 'collina') {
      if (!this.passed && q.x >= this.xHill) { this.passed = true; this.vtop = Math.abs(v1); }
      if (!this.passed && v0 > 0 && v1 <= 0 && this.turn < 0) { this.turn = t; this.hmax = q.y; }
      if (this.turn >= 0 && t - this.turn > 1.2) return this.end();
      if (q.x > this.xStation && v1 <= 0) { this.tEnd = t; this.land = this.clock; return this.end(); }
    } else {
      // la valle: il punto più alto della prima risalita a destra
      if (q.x > this.xBottom && v0 > 0 && v1 <= 0 && this.turn < 0) {
        this.turn = t; this.hmax = q.y;
        if (!p.oscilla) return this.end();
      }
      // avanti e indietro: quando le risalite diventano di pochi centimetri, il vagoncino è fermo in fondo
      if (p.oscilla && v0 !== 0 && Math.sign(v1) !== Math.sign(v0) && q.y < 0.25 && this.turn >= 0) { this.v = 0; this.stopAt = t; }
      if (p.oscilla && this.turn >= 0 && Math.abs(this.v) < 0.03 && Math.abs(this.acc(s1, 0)) < 1e-6) {
        this.v = 0;
        if (this.stopAt < 0) this.stopAt = t;
        if (t - this.stopAt > 0.6) return this.end();
      } else if (Math.abs(this.v) >= 0.03) this.stopAt = -1;
    }
    if (t > p.tmax) this.end();
  }

  end() {
    if (this.result) return;
    const p = this.params, r2 = (x) => Math.round(x * 100) / 100;
    const W = p.m * G * p.h0;
    const res = {
      passed: [this.passed], vtop: [r2(this.vtop)], hmax: [r2(this.hmax)], vmax: [r2(this.vmax)],
      t: [r2(this.tEnd ?? this.t)], W: [Math.round(W / 10) / 100], P: [p.P],
    };
    this.history = this.history || [];
    this.history.push({ track: p.track, h0: p.h0, side: p.side, fr: p.fr, P: p.P, lift: p.lift, hide: p.hide, oscilla: p.oscilla, passed: this.passed, vtop: this.vtop, hmax: this.hmax, vmax: this.vmax, t: this.tEnd ?? this.t, W });
    if (this.history.length > 3) this.history.shift();
    this.finish(res);
  }

  // ---------- disegno ----------
  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const yG = H - 22, top = p.bars ? 70 : 40;
    const k = Math.min((W - 36) / this.Xext, (yG - top) / this.HM), x0 = (W - this.Xext * k) / 2;
    const X = (x) => x0 + x * k, Y = (y) => yG - y * k;
    const { X: TX, Y: TY } = this.T;
    // i sostegni del binario e il terreno
    g.save(); g.strokeStyle = this.c('muted'); g.globalAlpha = 0.35; g.lineWidth = 1; g.beginPath();
    let last = -9;
    for (let i = 0; i < TX.length; i += 4) if (TX[i] - last >= 3 && TY[i] > 0.3) { last = TX[i]; g.moveTo(X(TX[i]), Y(TY[i]) + 2); g.lineTo(X(TX[i]), yG); }
    g.stroke(); g.restore();
    this.ground(yG, { x0: 6, x1: W - 6 });
    // la quota di partenza, tratteggiata: senza attrito il vagoncino risale fin lì
    if (!p.hide && p.track !== 'salita') {
      g.save(); g.strokeStyle = this.c('sun'); g.globalAlpha = 0.55; g.lineWidth = 1.2; g.setLineDash([5, 5]);
      g.beginPath(); g.moveTo(X(0), Y(p.h0)); g.lineTo(X(this.Xext), Y(p.h0)); g.stroke(); g.restore();
      this.text(`${p.h0} m`, X(this.Xext) - 2, Y(p.h0) - 5, { size: 11, align: 'right', color: this.c('sun') });
    }
    if (p.track === 'collina') {
      const xh = X(this.xHill), yh = Y(p.h1);
      this.text(`${p.h1} m`, xh + 9, yh - 3, { size: 11, color: this.c('muted') });
      // la stazione: il tratto con i freni
      g.save(); g.fillStyle = 'rgba(79, 227, 181, .14)'; g.fillRect(X(this.xStation), yG - 16, X(this.Xext) - X(this.xStation), 16); g.fillRect(X(this.xStation), yG + 3, X(this.Xext) - X(this.xStation), 16); g.restore();
      this.text(i18n('stazione'), (X(this.xStation) + X(this.Xext)) / 2, yG + 15, { size: 10, align: 'center', color: this.c('mint') });
    }
    // il binario
    this.line(TX.map((x, i) => [X(x), Y(TY[i])]), { color: this.c('chalk'), width: 3 });
    if (p.track === 'salita') this.drawLift(X, Y, k);
    // il vagoncino
    const q = this.at(this.s), cx = X(q.x), cy = Y(q.y);
    this.drawCar(cx, cy, -q.phi);
    // la nebbia di Vetrino sulla partenza
    if (p.hide) this.fog(X(0) - 8, Y(this.HM) - 14, X(17), yG - 2);
    if (this.land >= 0) this.burst(cx, cy - 8, this.clock - this.land, { color: this.c('car1'), n: 8, r: 20 });
    if (p.bars) this.bars();
    this.results();
  }

  // la salita con la catena: le maglie che scorrono e il motore in cima
  drawLift(X, Y, k) {
    const g = this.ctx, p = this.params, [sa, sb] = this.sLift, A = this.at(sa), B = this.at(sb);
    const n = Math.floor(Math.hypot(X(B.x) - X(A.x), Y(B.y) - Y(A.y)) / 9), off = this.running ? ((this.s - sa) * k) % 9 : 0;
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 2;
    const dx = (X(B.x) - X(A.x)) / Math.hypot(X(B.x) - X(A.x), Y(B.y) - Y(A.y)), dy = (Y(B.y) - Y(A.y)) / Math.hypot(X(B.x) - X(A.x), Y(B.y) - Y(A.y));
    g.beginPath();
    for (let i = 0; i < n; i++) { const d = i * 9 + off; g.moveTo(X(A.x) + dx * d - dy * 3, Y(A.y) + dy * d + dx * 3); g.lineTo(X(A.x) + dx * (d + 4) - dy * 3, Y(A.y) + dy * (d + 4) + dx * 3); }
    g.stroke(); g.restore();
    // il motore
    const mx = X(B.x) + 5 * k + 18, my = Y(B.y) + 4;
    g.save(); g.strokeStyle = this.c('sun'); g.fillStyle = 'rgba(255, 209, 102, .2)'; g.lineWidth = 2; g.beginPath(); g.roundRect(mx - 12, my - 9, 24, 18, 3); g.fill(); g.stroke(); g.restore();
    const rot = this.running ? this.clock * 6 : 0;
    g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 1.6; g.beginPath(); g.arc(mx, my, 5, 0, 7);
    for (let i = 0; i < 4; i++) { const a = rot + (i * Math.PI) / 2; g.moveTo(mx + Math.cos(a) * 2, my + Math.sin(a) * 2); g.lineTo(mx + Math.cos(a) * 5, my + Math.sin(a) * 5); }
    g.stroke(); g.restore();
    this.text(`${p.P} kW`, mx, my + 22, { size: 11, align: 'center', color: this.c('sun') });
  }

  // il vagoncino: cassa, ruote sul binario e un passeggero, inclinato come il binario
  drawCar(cx, cy, ang) {
    const g = this.ctx, col = this.c('car1');
    g.save(); g.translate(cx, cy); g.rotate(ang);
    g.strokeStyle = col; g.lineWidth = 2.2; g.lineJoin = 'round';
    g.fillStyle = col; g.globalAlpha = 0.2; g.beginPath(); g.roundRect(-11, -14, 22, 10, 3); g.fill();
    g.globalAlpha = 1; g.beginPath(); g.roundRect(-11, -14, 22, 10, 3); g.stroke();
    g.fillStyle = this.c('sim-bg');
    for (const wx of [-6, 6]) { g.beginPath(); g.arc(wx, -2.5, 2.6, 0, 7); g.fill(); g.stroke(); }
    g.restore();
    g.save(); g.translate(cx, cy); g.rotate(ang);
    const pk = this.c('pink');
    g.strokeStyle = pk; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-2, -14); g.lineTo(-2, -19); g.moveTo(-2, -18); g.lineTo(-7, -23); g.moveTo(-2, -18); g.lineTo(3, -23); g.stroke();
    g.fillStyle = 'rgba(255, 122, 217, .25)'; g.beginPath(); g.arc(-2, -22.5, 3.6, 0, 7); g.fill(); g.stroke();
    g.restore();
    // linee di velocità
    if (this.running && Math.abs(this.v) > 2) {
      const dir = Math.sign(this.v), c = Math.cos(ang), s = Math.sin(ang), len = Math.min(22, 4 + Math.abs(this.v) * 1.2);
      for (let j = 0; j < 3; j++) {
        const off = 14 + ((this.clock * 70 + j * 9) % 12), bx = cx - dir * c * off, by = cy - dir * s * off - 8 + j * 4;
        this.line([[bx, by], [bx - dir * c * len, by - dir * s * len]], { color: this.c('car1'), width: 1.4, alpha: 0.45 });
      }
    }
  }

  fog(xa, ya, xb, yb) {
    const g = this.ctx, w = xb - xa, h = yb - ya;
    g.save(); g.fillStyle = 'rgba(185, 164, 255, .9)'; g.strokeStyle = this.c('boss'); g.lineWidth = 2;
    g.beginPath(); g.roundRect(xa, ya, w, h, 14); g.fill();
    g.globalAlpha = 0.35; g.fillStyle = '#0c1222';
    for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(xa + w * (0.15 + 0.14 * i), ya + h * (0.25 + 0.1 * (i % 3)), w * 0.1, h * 0.05, 0, 0, 7); g.fill(); }
    g.restore();
    this.text('?', xa + w / 2, ya + h / 2 + 10, { size: 30, align: 'center', weight: 700, color: '#0c1222' });
  }

  // la barra dell'energia, in alto a sinistra: la stessa energia, che cambia colore
  bars() {
    const g = this.ctx, p = this.params, q = this.at(this.s), m = p.m, S = p.lens === 's';
    let U = m * G * q.y, K = 0.5 * m * this.v * this.v, Q = Math.max(0, this.E0 - U - K), tot = Math.max(1, U + K + Q);
    if (p.track === 'salita') { K = 0; Q = 0; tot = m * G * p.h0; }
    const x = 12, y = 20, bw = Math.min(118, this.W * 0.32), bh = 10;
    this.text(p.track === 'salita' ? (S ? i18n('lavoro del motore') : i18n('il lavoro del motore')) : (S ? i18n('energia') : i18n('energia del vagoncino')), x, y - 5, { size: 10.5, color: this.c('muted') });
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 1.2; g.strokeRect(x, y, bw, bh); g.restore();
    let at = x;
    for (const [val, col] of [[U, this.c('sky')], [K, this.c('orange')], [Q, this.c('coral')]]) {
      const w = (bw * val) / tot;
      if (w > 0.3) { g.save(); g.fillStyle = col; g.globalAlpha = 0.8; g.fillRect(at, y, w, bh); g.restore(); }
      at += w;
    }
    const labs = p.track === 'salita' ? [[S ? i18n('→ energia di posizione U') : i18n('→ energia di posizione'), this.c('sky')]]
      : [[S ? i18n('posizione U') : i18n('di posizione'), this.c('sky')], [S ? i18n('movimento K') : i18n('di movimento'), this.c('orange')], ...(p.fr > 0 ? [[i18n('calore'), this.c('coral')]] : [])];
    labs.forEach(([txt, col], i) => {
      g.save(); g.fillStyle = col; g.globalAlpha = 0.8; g.fillRect(x, y + bh + 6 + i * 13, 7, 7); g.restore();
      this.text(txt, x + 11, y + bh + 13 + i * 13, { size: 10.5, color: col });
    });
  }

  // una riga per ogni esperimento fatto: corta, perché il riquadro sta accanto alla barra dell'energia
  describe(h) {
    const d = h.hide ? '' : `${h.h0} m → `;
    if (h.track === 'salita') return i18n('{P} kW, salita {s} → {t} s', { P: h.P, s: h.lift === 'dolce' ? i18n('dolce') : i18n('ripida'), t: fmt(h.t, 1) });
    if (h.track === 'collina') return d + (h.passed ? i18n('in cima a {v} m/s', { v: fmt(h.vtop, 1) }) : i18n('non passa'));
    if (h.oscilla) return d + i18n('ferma dopo {t} s', { t: fmt(h.t, 0) });
    return d + i18n('risale a {h} m', { h: fmt(h.hmax, 1) }) + (h.side === 'dolce' ? ` · ${i18n('dolce')}` : '');
  }

  results() {
    const g = this.ctx, p = this.params, W = this.W, hist = this.history || [];
    const rows = [[i18n('Tempo: {a} s', { a: fmt(this.t, 1) }) + (p.oscilla ? ` (${i18n('veloce ×3')})` : ''), this.c('ink'), 600]];
    if (p.track !== 'salita') rows.push([i18n('Velocità: {v} m/s', { v: fmt(Math.abs(this.v), 1) }), this.c('ink'), 500]);
    hist.forEach((h, i) => { const lastRow = i === hist.length - 1 && this.result; rows.push([this.describe(h), lastRow ? this.c('car1') : this.c('muted'), lastRow ? 700 : 500]); });
    const lh = hist[hist.length - 1];
    if (this.result && lh && lh.track === 'salita') rows.push([p.lens === 's' ? i18n('lavoro L = {w} kJ', { w: fmt(lh.W / 1000, 1) }) : i18n('lavoro: {w} kJ', { w: fmt(lh.W / 1000, 0) }), this.c('car1'), 500]);
    if (this.result && lh && lh.hide && lh.track === 'valle') rows.push([i18n('in fondo a {v} m/s', { v: fmt(lh.vmax, 1) }), this.c('car1'), 500]);
    g.font = '600 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([r]) => g.measureText(r).width)) + 12, by = 6;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(W - 10 - bw + 6, by, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([r, col, w], i) => this.text(r, W - 10, by + 14 + i * 15, { size: 11.5, align: 'right', weight: w, color: col }));
  }
}
