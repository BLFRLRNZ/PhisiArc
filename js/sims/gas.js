// I gas (T03). Sei modi:
//   - 'scatola': n pompate di gas in una scatola chiusa, alla temperatura t. La pressione sono i colpi delle particelle
//     sulle pareti: cresce con la quantità di gas e con la temperatura in kelvin. Una pompata a 0 °C fa 1 bar, quindi
//     P = n · T / 273 bar.
//   - 'siringa': una siringa chiusa con 100 mL d'aria a 1 bar; lo stantuffo la schiaccia fino a V mL. A temperatura
//     costante P · V resta 100 bar·mL (legge di Boyle).
//   - 'palloncino': un palloncino da 3 L a 20 °C portato a t °C, a pressione costante: il volume cresce con la
//     temperatura in kelvin (legge di Charles). Il grafico volume–temperatura, prolungato, arriva a zero a −273 °C.
//   - 'mongolfiera': un pallone da 2800 m³ con l'aria scaldata a t °C, nell'aria a 20 °C, deve sollevare m kg in tutto.
//     L'aria calda è meno densa di quella fuori: può sollevare 3360 · (1 − 293/T) kg (T in kelvin). Se t è entro 3 °C da
//     quella giusta galleggia a mezz'aria, se è più calda vola via, se è più fredda resta a terra.
//   - 'bombola': una bombola d'aria a 200 bar a 20 °C portata a t °C: a volume costante la pressione cresce con la
//     temperatura in kelvin (legge di Gay-Lussac). Oltre i 300 bar è pericolosa.
//   - 'buio': sotto il telo c'è una bottiglia d'aria a 1 bar, grande 400 mL (non si vede). Una siringa con s mL d'aria a
//     1 bar ci spinge dentro tutta la sua aria: il manometro segna 1 + s/400 bar.
// Risultato: scatola { n, t, P }; siringa { V, P }; palloncino { t, V }; mongolfiera { t, m, L, state };
//            bombola { t, P }; buio { s, P }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut, easeInOut } from './base.js';

const K0 = 273.15, T_AIR = 20, AIR = 1.2 * 2800, V_HID = 400, P_TANK = 200, P_RED = 300, TOL = 3;
export const boxP = (n, t) => (n * (t + K0)) / K0;
export const boyleP = (V) => 100 / V;
export const charlesV = (t) => (3 * (t + K0)) / (T_AIR + K0);
export const tankP = (t) => (P_TANK * (t + K0)) / (T_AIR + K0);
export const liftKg = (t) => AIR * (1 - (T_AIR + K0) / (t + K0));
export const hoverT = (m) => (T_AIR + K0) / (1 - m / AIR) - K0;
export const hiddenP = (s) => 1 + s / V_HID;
export const balloonState = (t, m) => { const d = t - hoverT(m); return Math.abs(d) <= TOL ? 'galleggia' : d > 0 ? 'sale' : 'terra'; };
// un numero con al massimo d decimali, senza zeri inutili in fondo
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const R = Math.round;

export class Gas extends Sim {
  static tall = true;
  static controls = {
    n: { label: 'Pompate di gas', min: 1, max: 4, step: 1, unit: '' },
    t: { label: 'Temperatura', min: -100, max: 300, step: 10, unit: '°C' },
    V: { label: 'Volume della siringa', min: 20, max: 100, step: 5, unit: 'mL' },
    s: { label: 'Aria nella siringa', min: 50, max: 200, step: 50, unit: 'mL' },
  };

  defaults() { return { mode: 'scatola', n: 1, t: 20, V: 50, m: 600, s: 100, lens: 's' }; }

  init() {
    this.u = 0;
    this.hits = [];
    this.parts = Array.from({ length: 60 }, (_, i) => ({ x: (0.5 + i * 0.7548777) % 1, y: (0.5 + i * 0.5698403) % 1, a: i * 2.39996 + 0.3 }));
  }

  step() {
    this.u = clamp01(this.t / 2.6);
    if (this.t > 3) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'siringa') return this.finish({ V: p.V, P: boyleP(p.V) });
    if (p.mode === 'palloncino') return this.finish({ t: p.t, V: charlesV(p.t) });
    if (p.mode === 'mongolfiera') return this.finish({ t: p.t, m: p.m, L: liftKg(p.t), state: balloonState(p.t, p.m) });
    if (p.mode === 'bombola') return this.finish({ t: p.t, P: tankP(p.t) });
    if (p.mode === 'buio') return this.finish({ s: p.s, P: hiddenP(p.s) });
    this.finish({ n: p.n, t: p.t, P: boxP(p.n, p.t) });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'siringa') this.drawSyringe();
    else if (m === 'palloncino') this.drawBalloon();
    else if (m === 'mongolfiera') this.drawHotAir();
    else if (m === 'bombola') this.drawTank();
    else if (m === 'buio') this.drawHidden();
    else this.drawBox();
  }

  get live() { return this.running || !!this.result; }
  get k() { return this.result ? 1 : this.u; }

  // ---------- le particelle del gas ----------
  // muove le prime N particelle in una regione di w × h pixel, a v pixel al secondo; ogni colpo su una parete è segnato
  move(N, w, h, v) {
    if (this.calm) return;
    const dt = Math.min(this.fdt, 0.05);
    for (let i = 0; i < N; i++) {
      const q = this.parts[i];
      q.x += (Math.cos(q.a) * v * dt) / w; q.y += (Math.sin(q.a) * v * dt) / h;
      if (q.x < 0) { q.x = -q.x; q.a = Math.PI - q.a; this.hit(0, q.y); }
      if (q.x > 1) { q.x = 2 - q.x; q.a = Math.PI - q.a; this.hit(1, q.y); }
      if (q.y < 0) { q.y = -q.y; q.a = -q.a; this.hit(2, q.x); }
      if (q.y > 1) { q.y = 2 - q.y; q.a = -q.a; this.hit(3, q.x); }
      q.x = clamp01(q.x); q.y = clamp01(q.y);
    }
  }

  hit(side, pos) { this.hits.push({ side, pos, at: this.clock }); if (this.hits.length > 80) this.hits.shift(); }

  // il gas nella regione (x0, y0)–(x1, y1): N particelle a v pixel al secondo, e i colpi sulle pareti che fanno la pressione
  gasIn(N, x0, y0, x1, y1, { col, v, r = 4, walls = true }) {
    const pad = r + 1, w = Math.max(2, x1 - x0 - 2 * pad), h = Math.max(2, y1 - y0 - 2 * pad);
    if (this.live) this.move(N, w, h, v);
    for (let i = 0; i < N; i++) { const q = this.parts[i]; this.ball(x0 + pad + q.x * w, y0 + pad + q.y * h, r, { color: col, fill: 0.5, width: 1.4, shine: false }); }
    if (!walls) return;
    for (const k of this.hits) {
      const age = this.clock - k.at;
      if (age > 0.3) continue;
      const x = k.side === 0 ? x0 : k.side === 1 ? x1 : x0 + pad + k.pos * w, y = k.side === 2 ? y0 : k.side === 3 ? y1 : y0 + pad + k.pos * h;
      this.ripple(x, y, age, { color: this.c('sun'), r0: 2, r1: 9, dur: 0.3 });
    }
  }

  // ---------- gli strumenti ----------
  // il manometro: un quadrante con la lancetta, fondo scala max, la zona rossa da red in su
  gauge(x, y, r, val, max, { red = null, d = 2 } = {}) {
    const g = this.ctx, a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, A = (v) => a0 + (a1 - a0) * clamp01(v / max);
    g.save(); g.fillStyle = this.c('sim-bg'); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.stroke();
    if (red != null) { g.strokeStyle = this.c('coral'); g.globalAlpha = 0.6; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r - 6, A(red), a1); g.stroke(); }
    g.strokeStyle = this.c('chalk'); g.lineWidth = 1.2; g.globalAlpha = 0.7;
    for (let i = 0; i <= 10; i++) { const a = a0 + ((a1 - a0) * i) / 10, r2 = r - (i % 5 ? 5 : 9); g.beginPath(); g.moveTo(x + Math.cos(a) * (r - 2), y + Math.sin(a) * (r - 2)); g.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2); g.stroke(); }
    g.restore();
    const a = A(val);
    this.line([[x, y], [x + Math.cos(a) * (r - 7), y + Math.sin(a) * (r - 7)]], { color: this.c('coral'), width: 2.4 });
    this.ball(x, y, 2.6, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    const lab = `${nice(val, d)} bar`;
    g.font = '700 12px "IBM Plex Mono", monospace';
    const lw = g.measureText(lab).width + 10;
    g.save(); g.fillStyle = this.c('sim-bg'); g.globalAlpha = 0.9; g.fillRect(x - lw / 2, y + r + 4, lw, 16); g.restore();
    this.text(lab, x, y + r + 16, { size: 12, align: 'center', weight: 700, color: this.c('chalk'), mono: true });
  }

  thermo(x, y0, y1, T, lo, hi) {
    const f = clamp01((T - lo) / (hi - lo)), yl = y1 - f * (y1 - y0);
    this.line([[x - 4, y1], [x - 4, y0], [x + 4, y0], [x + 4, y1]], { color: this.c('chalk'), width: 1.5 });
    this.ball(x, y1 + 6, 7, { color: this.c('coral'), fill: 0.85, width: 1.5, shine: false });
    this.line([[x, y1 + 2], [x, yl]], { color: this.c('coral'), width: 4 });
    this.text(`${fmt(R(T), 0)} °C`, x - 9, yl + 4, { size: 11, align: 'right', color: this.c('coral'), weight: 700 });
  }

  // una siringa verticale con la punta in basso: aria fra lo stantuffo (V mL) e la punta; full = mL a fondo scala
  syringe(cx, yt, L, bw, V, full, N, mark) {
    const yh = yt - (V / full) * L, yo = yt - L, col = this.c('chalk');
    this.ctx.save(); this.ctx.fillStyle = this.c('sky'); this.ctx.globalAlpha = 0.1; this.ctx.fillRect(cx - bw + 2, yh + 3, 2 * bw - 4, Math.max(0, yt - yh - 3)); this.ctx.restore();
    if (N > 0) this.gasIn(N, cx - bw + 2, yh + 3, cx + bw - 2, yt - 1, { col: this.c('sky'), v: 60, r: 3.2, walls: false });
    this.line([[cx - bw, yo - 8], [cx - bw, yt], [cx - 5, yt], [cx - 5, yt + 12], [cx + 5, yt + 12], [cx + 5, yt], [cx + bw, yt], [cx + bw, yo - 8]], { color: col, width: 2.4 });
    for (let i = 0; i <= 10; i++) { const y = yt - (i / 10) * L; this.line([[cx + bw - (i % 5 ? 6 : 12), y], [cx + bw, y]], { color: this.c('muted'), width: 1.2 }); }
    this.text('0', cx + bw + 5, yt + 4, { size: 9.5, color: this.c('muted'), mono: true });
    this.text(`${full} mL`, cx + bw + 5, yo + 4, { size: 9.5, color: this.c('muted'), mono: true });
    if (mark != null) { const y = yt - (mark / full) * L; this.line([[cx - bw - 6, y], [cx + bw + 6, y]], { color: this.c('sun'), width: 1.4, dash: [4, 4], alpha: 0.8 }); }
    // lo stantuffo: la testa, l'asta e l'appoggio per il pollice
    this.line([[cx - bw + 2, yh], [cx + bw - 2, yh]], { color: this.c('orange'), width: 6 });
    this.line([[cx, yh - 3], [cx, yh - L - 6]], { color: this.c('orange'), width: 4 });
    this.line([[cx - bw * 0.8, yh - L - 6], [cx + bw * 0.8, yh - L - 6]], { color: this.c('orange'), width: 5 });
    if (this.running && this.u < 1) this.arrow(cx, yh - L - 40, cx, yh - L - 14, { color: this.c('coral'), width: 3 });
  }

  // ---------- la scatola di gas ----------
  drawBox() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const x0 = 16, y0 = H * 0.17, x1 = W * 0.64, y1 = H - 30, gx = (x1 + W) / 2, r = Math.min(30, (W - x1) / 2 - 10);
    const N = 12 * p.n, K = p.t + K0, col = this.c(p.t <= 0 ? 'sky' : p.t < 150 ? 'mint' : 'orange');
    this.gasIn(N, x0, y0, x1, y1, { col, v: 80 * Math.sqrt(K / 293) });
    this.line([[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], { color: this.c('chalk'), width: 3 });
    // il manometro, attaccato alla scatola con un tubicino, e il termometro
    const gy = y0 + r + 8;
    this.line([[x1, gy + r + 30], [gx, gy + r + 30], [gx, gy + r]], { color: this.c('muted'), width: 3 });
    const P = boxP(p.n, p.t);
    this.gauge(gx, gy, r, this.live ? P * easeOut(this.k / 0.6) : 0, 10, { d: 2 });
    this.thermo(gx + 8, gy + r + 64, y1 - 14, p.t, -100, 300);
    const rows = [[E ? (p.n === 1 ? i18n('Una pompata di gas, a {t} gradi', { t: p.t }) : i18n('{n} pompate di gas, a {t} gradi', { n: p.n, t: p.t }))
      : (p.n === 1 ? i18n('una pompata di gas a {t} °C, cioè {K} K', { t: p.t, K: R(K) }) : i18n('{n} pompate di gas a {t} °C, cioè {K} K', { n: p.n, t: p.t, K: R(K) })), this.c('chalk'), 700]];
    if (this.result) {
      if (!E) rows.push([i18n('pressione: {P} bar', { P: nice(P, 2) }), this.c('sun'), 700]);
      rows.push([i18n('ogni colpo sulle pareti è una piccola spinta'), this.c('sun'), 600]);
    }
    this.box(rows);
  }

  // ---------- la siringa chiusa ----------
  drawSyringe() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const V = this.live ? 100 + (p.V - 100) * easeInOut(this.k / 0.75) : 100, P = boyleP(V);
    const cx = W * 0.4, yt = H * 0.8, L = H * 0.3, bw = Math.min(32, W * 0.09), gx = cx + bw + 72, gy = yt - 24, r = 28;
    this.line([[cx, yt + 12], [cx, yt + 22], [gx, yt + 22], [gx, gy + r]], { color: this.c('muted'), width: 3 });
    this.syringe(cx, yt, L, bw, V, 100, 24, this.live ? null : p.V);
    this.gauge(gx, gy, r, P, 6, { d: 2 });
    const rows = [[E ? i18n('Siringa chiusa con {V} mL d’aria', { V: R(V) }) : i18n('V = {V} mL, P = {P} bar', { V: R(V), P: nice(P, 2) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('l’aria schiacciata spinge di più') : i18n('P · V = 100 bar·mL, come all’inizio'), this.c('sun'), 700]);
    this.box(rows);
  }

  // ---------- il palloncino caldo e freddo ----------
  drawBalloon() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const tc = this.live ? T_AIR + (p.t - T_AIR) * easeInOut(this.k / 0.7) : T_AIR, V = charlesV(tc);
    // la camera, azzurra se fredda e arancione se calda, con il termometro
    const cx0 = 16, cy0 = H * 0.15, cx1 = W - 16, cy1 = H * 0.56;
    g.save(); g.fillStyle = this.c(tc < T_AIR ? 'sky' : 'orange'); g.globalAlpha = Math.min(0.22, Math.abs(tc - T_AIR) / 500); g.fillRect(cx0, cy0, cx1 - cx0, cy1 - cy0); g.restore();
    this.line([[cx0, cy0], [cx1, cy0], [cx1, cy1], [cx0, cy1], [cx0, cy0]], { color: this.c('muted'), width: 1.6 });
    this.thermo(cx1 - 28, cy0 + 16, cy1 - 20, tc, -100, 100);
    // il palloncino, legato a un peso: il raggio va con la radice cubica del volume; tratteggiato, quello a 20 °C
    const bx = W * 0.4, R0 = Math.min(54, (cy1 - cy0) * 0.27), by = cy0 + 14 + R0 * 1.12, rr = R0 * Math.cbrt(V / 3);
    g.save(); g.setLineDash([4, 4]); g.strokeStyle = this.c('muted'); g.lineWidth = 1.2; g.beginPath(); g.ellipse(bx, by, R0 * 0.88, R0, 0, 0, 7); g.stroke(); g.restore();
    g.save(); g.fillStyle = this.c('coral'); g.globalAlpha = 0.3; g.beginPath(); g.ellipse(bx, by, rr * 0.88, rr, 0, 0, 7); g.fill(); g.restore();
    g.save(); g.strokeStyle = this.c('coral'); g.lineWidth = 2.4; g.beginPath(); g.ellipse(bx, by, rr * 0.88, rr, 0, 0, 7); g.stroke();
    g.globalAlpha = 0.6; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.beginPath(); g.ellipse(bx, by, rr * 0.6, rr * 0.7, 0, Math.PI * 1.1, Math.PI * 1.35); g.stroke(); g.restore();
    this.line([[bx, by + rr], [bx - 4, by + rr + 6], [bx + 4, by + rr + 6], [bx, by + rr]], { color: this.c('coral'), width: 2 });
    this.line([[bx, by + rr + 6], [bx + 4, (by + rr + cy1) / 2], [bx, cy1 - 12]], { color: this.c('chalk'), width: 1.2 });
    this.line([[bx - 9, cy1 - 12], [bx + 9, cy1 - 12], [bx + 9, cy1 - 2], [bx - 9, cy1 - 2], [bx - 9, cy1 - 12]], { color: this.c('muted'), width: 2 });
    // il grafico volume–temperatura: la retta misurata e, dopo la prova, il suo prolungamento fino a zero
    const gx0 = 42, gx1 = W - 16, gy0 = H * 0.64, gy1 = H - 30;
    const X = (t) => gx0 + ((t + 300) / 400) * (gx1 - gx0), Y = (v) => gy1 - (v / 4) * (gy1 - gy0);
    this.line([[gx0, gy0 - 8], [gx0, gy1], [gx1, gy1]], { color: this.c('muted'), width: 1.4 });
    for (const v of [1, 2, 3, 4]) { this.line([[gx0 - 4, Y(v)], [gx0, Y(v)]], { color: this.c('muted'), width: 1.2 }); this.text(String(v), gx0 - 7, Y(v) + 4, { size: 9.5, align: 'right', color: this.c('muted'), mono: true }); }
    this.text('L', gx0 + 6, gy0 - 6, { size: 10, color: this.c('muted'), mono: true });
    for (const t of [-200, -100, 0, 100]) { this.line([[X(t), gy1], [X(t), gy1 + 4]], { color: this.c('muted'), width: 1.2 }); this.text(fmt(t, 0), X(t), gy1 + 15, { size: 9.5, align: 'center', color: this.c('muted'), mono: true }); }
    this.text('°C', gx1, gy1 - 6, { size: 10, align: 'right', color: this.c('muted'), mono: true });
    this.line([[X(-100), Y(charlesV(-100))], [X(100), Y(charlesV(100))]], { color: this.c('coral'), width: 2.4 });
    if (this.result) {
      this.line([[X(-100), Y(charlesV(-100))], [X(-K0), Y(0)]], { color: this.c('coral'), width: 1.6, dash: [5, 5], alpha: 0.8 });
      this.ball(X(-K0), Y(0), 4, { color: this.c('sun'), fill: 1, width: 1.4, shine: false });
      this.text(i18n('−273 °C: zero assoluto'), X(-K0) + 2, Y(0) - 10, { size: 10.5, color: this.c('sun'), weight: 700 });
    }
    if (this.live) this.ball(X(tc), Y(V), 4.5, { color: this.c('coral'), fill: 1, width: 1.5, shine: false });
    const rows = [[E ? i18n('Palloncino a {t} gradi', { t: R(tc) }) : i18n('t = {t} °C, cioè {K} K: V = {V} L', { t: R(tc), K: R(tc + K0), V: nice(V, 2) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? (p.t < T_AIR ? i18n('al freddo il palloncino si sgonfia') : p.t > T_AIR ? i18n('al caldo il palloncino si gonfia') : i18n('a 20 gradi resta com’è'))
      : i18n('il volume è proporzionale alla temperatura in kelvin'), this.c('sun'), 700]);
    this.box(rows);
  }

  // ---------- la mongolfiera ----------
  drawHotAir() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const k = this.k, heat = this.live ? easeInOut(k / 0.4) : 0, tc = T_AIR + (p.t - T_AIR) * heat;
    const st = balloonState(p.t, p.m), lift = this.live ? clamp01((k - 0.4) / 0.6) : 0;
    const gyd = H - 34;
    this.ground(gyd, { color: this.c('green') });
    let off = 0;
    if (st === 'galleggia') off = H * 0.26 * easeOut(lift) + (this.result && !this.calm ? 3 * Math.sin(this.clock * 1.6) : 0);
    else if (st === 'sale') off = H * 1.05 * lift * lift;
    else off = 2 * Math.sin(lift * Math.PI * 3) * (1 - lift);
    // il pallone: la cupola, le spicchi e la bocca; il colore dice quanto è calda l'aria dentro
    const Rb = Math.min(66, W * 0.19), bx = W * 0.44, ey = gyd - off - Rb * 1.35 - 48, my = ey + Rb * 1.35, mw = Rb * 0.3;
    const shape = () => { g.beginPath(); g.arc(bx, ey, Rb, Math.PI * 0.86, Math.PI * 2.14); g.quadraticCurveTo(bx + Rb * 0.92, ey + Rb * 0.9, bx + mw, my); g.lineTo(bx - mw, my); g.quadraticCurveTo(bx - Rb * 0.92, ey + Rb * 0.9, bx - Rb * Math.cos(Math.PI * 0.14), ey + Rb * Math.sin(Math.PI * 0.14)); g.closePath(); };
    g.save(); shape(); g.fillStyle = this.c(tc > 40 ? 'orange' : 'sky'); g.globalAlpha = 0.12 + 0.3 * clamp01((tc - T_AIR) / 100); g.fill(); g.restore();
    g.save(); shape(); g.strokeStyle = this.c('sun'); g.lineWidth = 2.4; g.stroke(); g.restore();
    for (const f of [-0.5, 0, 0.5]) { g.save(); g.strokeStyle = this.c('sun'); g.globalAlpha = 0.6; g.lineWidth = 1.3; g.beginPath(); g.moveTo(bx + f * Rb * 0.2, ey - Rb + 1); g.quadraticCurveTo(bx + f * Rb * 1.6, ey + Rb * 0.2, bx + f * mw * 1.6, my); g.stroke(); g.restore(); }
    // le corde, il bruciatore che soffia la fiamma dentro la bocca e il cesto con le persone
    const yb = my + 26, bw2 = 15;
    this.line([[bx - mw, my], [bx - bw2, yb]], { color: this.c('chalk'), width: 1.2 });
    this.line([[bx + mw, my], [bx + bw2, yb]], { color: this.c('chalk'), width: 1.2 });
    if (this.live && (k < 0.45 || st === 'galleggia' || st === 'sale')) {
      const fl = (k < 0.45 ? 16 : 9) + 3 * Math.sin(this.clock * 20);
      this.line([[bx, my + 14], [bx, my + 14 - fl]], { color: this.c('orange'), width: 5, alpha: 0.9 });
      this.line([[bx, my + 14], [bx, my + 14 - fl * 0.55]], { color: this.c('sun'), width: 2.4 });
    }
    this.line([[bx - 6, my + 16], [bx + 6, my + 16]], { color: this.c('muted'), width: 3 });
    const heads = Math.max(1, Math.min(4, R((p.m - 300) / 150)));
    for (let i = 0; i < heads; i++) this.ball(heads === 1 ? bx : bx - 9 + (18 * i) / (heads - 1), yb - 5, 3.6, { color: this.c('chalk'), fill: 0.6, width: 1.3, shine: false });
    this.line([[bx - bw2, yb], [bx + bw2, yb], [bx + bw2 - 2, yb + 20], [bx - bw2 + 2, yb + 20], [bx - bw2, yb]], { color: this.c('orange'), width: 2.4 });
    this.thermo(W - 28, H * 0.22, H * 0.58, tc, 0, 150);
    const rows = [[E ? i18n('Aria nel pallone a {t} gradi', { t: R(tc) }) : i18n('aria dentro a {t} °C, fuori a 20 °C', { t: R(tc) }), this.c('chalk'), 700],
      [i18n('da sollevare: {m} kg', { m: p.m }), this.c('chalk'), 600]];
    if (this.result) {
      if (!E) rows.push([i18n('l’aria calda può sollevare {L} kg', { L: fmt(Math.max(0, R(liftKg(p.t))), 0) }), this.c('sun'), 700]);
      rows.push(st === 'galleggia' ? [i18n('galleggia a mezz’aria!'), this.c('mint'), 700] : st === 'sale' ? [i18n('troppo calda: sale e vola via'), this.c('coral'), 700] : [i18n('troppo fredda: resta a terra'), this.c('sky'), 700]);
    }
    this.box(rows);
  }

  // ---------- la bombola al caldo ----------
  drawTank() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const tc = this.live ? T_AIR + (p.t - T_AIR) * easeInOut(this.k / 0.75) : T_AIR, P = tankP(tc);
    const cx = W * 0.34, w = Math.min(84, W * 0.24), y0 = H * 0.34, y1 = H - 66;
    // il fornello sotto, con le fiamme se scaldi; la brina sui fianchi se raffreddi
    this.line([[cx - w * 0.7, y1 + 8], [cx + w * 0.7, y1 + 8]], { color: this.c('muted'), width: 3 });
    if (this.live && tc > 40) for (let j = 0; j < 5; j++) { const fl = 4 + 22 * clamp01((tc - 40) / 260) + 3 * Math.sin(this.clock * 14 + j * 2); this.line([[cx - w * 0.5 + j * w * 0.25, y1 + 30], [cx - w * 0.5 + j * w * 0.25, y1 + 30 - fl]], { color: this.c('orange'), width: 4, alpha: 0.85 }); }
    // la bombola: il corpo con la cupola, il collo, la valvola e il tubo del manometro
    const body = () => { g.beginPath(); g.moveTo(cx - w / 2, y1); g.lineTo(cx - w / 2, y0 + w / 2); g.arc(cx, y0 + w / 2, w / 2, Math.PI, Math.PI * 2); g.lineTo(cx + w / 2, y1); g.closePath(); };
    g.save(); body(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.08; g.fill(); g.restore();
    this.gasIn(40, cx - w / 2 + 3, y0 + w * 0.3, cx + w / 2 - 3, y1 - 3, { col: this.c(tc <= 0 ? 'sky' : tc < 150 ? 'mint' : 'orange'), v: 70 * Math.sqrt((tc + K0) / 293), r: 3.2 });
    g.save(); body(); g.strokeStyle = this.c('chalk'); g.lineWidth = 2.6; g.stroke(); g.restore();
    if (this.live && tc < 0) for (let j = 0; j < 8; j++) { const y = y0 + w * 0.6 + j * ((y1 - y0 - w * 0.6) / 8); this.line([[cx - w / 2 - 4, y], [cx - w / 2 + 3, y + 4]], { color: this.c('sky'), width: 1.4, alpha: 0.8 }); this.line([[cx + w / 2 + 4, y], [cx + w / 2 - 3, y + 4]], { color: this.c('sky'), width: 1.4, alpha: 0.8 }); }
    const gx = cx + w / 2 + 52, gy = y0 - 46, r = 30;
    this.line([[cx - 7, y0], [cx - 7, y0 - 14], [cx + 7, y0 - 14], [cx + 7, y0]], { color: this.c('chalk'), width: 2.2 });
    this.line([[cx, y0 - 14], [cx, gy], [gx - r, gy]], { color: this.c('muted'), width: 3 });
    this.gauge(gx, gy, r, P, 400, { red: P_RED, d: 0 });
    this.thermo(W - 30, y0 + 20, y1 - 6, tc, -20, 300);
    const rows = [[E ? i18n('Bombola d’aria chiusa, a {t} gradi', { t: R(tc) }) : i18n('t = {t} °C, cioè {K} K: P = {P} bar', { t: R(tc), K: R(tc + K0), P: R(P) }), this.c('chalk'), 700]];
    if (this.result) {
      if (P > P_RED) rows.push([i18n('oltre 300 bar: pericolo, può scoppiare!'), this.c('coral'), 700]);
      else rows.push([E ? (p.t > T_AIR ? i18n('più caldo, più pressione') : p.t < T_AIR ? i18n('più freddo, meno pressione') : i18n('a 20 gradi resta a 200 bar')) : i18n('la pressione è proporzionale alla temperatura in kelvin'), this.c('sun'), 700]);
    }
    this.box(rows);
  }

  // ---------- la bottiglia sotto il telo ----------
  drawHidden() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const k = this.live ? easeInOut(this.k / 0.75) : 0, Vs = p.s * (1 - k), P = (V_HID + p.s) / (V_HID + Vs);
    // la siringa a sinistra, con il tubo che va sotto il telo
    const cx = W * 0.2, yt = H * 0.72, L = H * 0.32, bw = Math.min(26, W * 0.075);
    const base = H * 0.86, xl = W * 0.44, xr = W - 14, top = H * 0.46, mx = (xl + xr) / 2;
    this.line([[cx, yt + 12], [cx, base - 10], [mx - 20, base - 10]], { color: this.c('muted'), width: 3 });
    this.syringe(cx, yt, L, bw, Vs, 200, R((6 + p.s / 10) * (1 - k)), null);
    // il tavolo e il telo, con le pieghe e il punto di domanda; il manometro esce dal telo
    this.line([[xl - 10, base], [xr + 6, base]], { color: this.c('muted'), width: 2 });
    const gx = mx, gy = top - 56, r = 30;
    this.line([[gx, top + 6], [gx, gy + r]], { color: this.c('muted'), width: 3 });
    const cloth = () => { g.beginPath(); g.moveTo(xl, base); g.bezierCurveTo(xl + 8, top + 40, mx - 50, top, mx, top); g.bezierCurveTo(mx + 50, top, xr - 8, top + 40, xr, base); g.closePath(); };
    g.save(); cloth(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.35; g.fill(); g.restore();
    g.save(); cloth(); g.strokeStyle = this.c('chalk'); g.lineWidth = 2.2; g.stroke(); g.restore();
    for (const f of [-0.45, 0.1, 0.5]) this.line([[mx + f * (xr - xl) * 0.5, top + 26], [mx + f * (xr - xl) * 0.62, base - 4]], { color: this.c('chalk'), width: 1.2, alpha: 0.5 });
    this.text('?', mx, (top + base) / 2 + 16, { size: 42, align: 'center', weight: 700, color: this.c('chalk') });
    this.gauge(gx, gy, r, P, 2, { d: 3 });
    const rows = [[E ? i18n('Siringa con {s} mL d’aria', { s: p.s }) : i18n('siringa: {s} mL d’aria a 1 bar', { s: p.s }), this.c('chalk'), 700],
      [E ? i18n('sotto il telo c’è una bottiglia d’aria') : i18n('sotto il telo: una bottiglia d’aria a 1 bar'), this.c('chalk'), 600]];
    if (this.result) rows.push([i18n('il manometro segna {P} bar', { P: nice(P, 3) }), this.c('sun'), 700]);
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
