// I motori e l'entropia (T04). Quattro modi:
//   - 'pistone': un gas sotto un pistone con sopra un peso da 10 kg (e sopra ancora il vuoto). Q joule di calore, a
//     pressione costante: 2/7 diventano lavoro (il peso sale di h = L / (m·g)), 5/7 restano nel gas come energia interna.
//   - 'ciclo': un motore termico ideale fra la caldaia a tc °C e il lato freddo a tf °C. Su 100 J di calore presi dalla
//     caldaia, il lavoro è il rendimento di Carnot, η = 1 − Tf / Tc (in kelvin); il resto va al lato freddo.
//     need (facoltativo) è il rendimento che serve, claim (facoltativo) quello promesso: tutti e due segnati sulla barra.
//   - 'frigo': un frigorifero ideale con l'interno a ti °C nella cucina a 25 °C. Per togliere 100 J ai cibi servono
//     100 / COP joule di lavoro, con COP = Ti / (Tc − Ti); alla cucina arrivano i 100 J più il lavoro.
//   - 'mescola': N particelle chiuse nella metà sinistra di una scatola; tolta la parete si sparpagliano e non tornano
//     più tutte a sinistra: succede una volta su 2^N.
// Le particelle, il termometro e il riquadro dei numeri sono quelli della simulazione dei gas.
// Risultato: pistone { Q, L, U, h, T }; ciclo { tc, tf, eta, L, Qf }; frigo { ti, cop, L, Qc }; mescola { N, ways, left }
import { t as i18n } from '../i18n.js';
import { fmt, clamp01, easeOut, easeInOut } from './base.js';
import { Gas } from './gas.js';

const K0 = 273.15, M = 10, G = 9.81, T_ROOM = 25, T_GAS = 20;
export const piston = (Q) => { const L = (Q * 2) / 7; return { L, U: Q - L, h: (L / (M * G)) * 100, T: T_GAS + Q * 1.709 }; };
export const carnot = (tc, tf) => (tc <= tf ? 0 : 100 * (1 - (tf + K0) / (tc + K0)));
export const fridge = (ti) => { const cop = (ti + K0) / (T_ROOM - ti); return { cop, L: 100 / cop, Qc: 100 + 100 / cop }; };
const nice = (x, d = 1) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const R = Math.round;

export class Engine extends Gas {
  static tall = true;
  static controls = {
    Q: { label: 'Calore dato', min: 0, max: 140, step: 10, unit: 'J' },
    tc: { label: 'Caldaia', min: 50, max: 800, step: 10, unit: '°C' },
    tf: { label: 'Lato freddo', min: 0, max: 80, step: 5, unit: '°C' },
    ti: { label: 'Dentro il frigo', min: -30, max: 10, step: 5, unit: '°C' },
    N: { label: 'Particelle', min: 4, max: 40, step: 2, unit: '' },
  };

  defaults() { return { mode: 'pistone', Q: 70, tc: 200, tf: 20, ti: 5, N: 10, need: null, claim: null, lens: 's' }; }

  init() {
    super.init();
    // nella scatola da mescolare le particelle partono tutte nella metà sinistra
    this.parts.forEach((q) => { q.x *= 0.48; });
    this.spin = 0;
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'ciclo') { const eta = carnot(p.tc, p.tf); return this.finish({ tc: p.tc, tf: p.tf, eta, L: eta, Qf: 100 - eta }); }
    if (p.mode === 'frigo') return this.finish({ ti: p.ti, ...fridge(p.ti) });
    if (p.mode === 'mescola') return this.finish({ N: p.N, ways: 2 ** p.N, left: this.left(p.N) });
    this.finish({ Q: p.Q, ...piston(p.Q) });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'ciclo') this.drawCycle();
    else if (m === 'frigo') this.drawFridge();
    else if (m === 'mescola') this.drawMix();
    else this.drawPiston();
  }

  // finché c'è la parete (all'inizio della prova), chi passa la metà rimbalza indietro
  afterMove() {
    if (this.params.mode !== 'mescola' || this.u >= 0.15) return;
    for (let i = 0; i < this.params.N; i++) { const q = this.parts[i]; if (q.x > 0.49) { q.x = 0.98 - q.x; q.a = Math.PI - q.a; } }
  }

  left(N) { let k = 0; for (let i = 0; i < N; i++) if (this.parts[i].x < 0.5) k++; return k; }

  // una barra verticale dell'energia, alta quanto il valore (in joule), con il nome sotto e il valore sopra
  bar(x, yb, w, val, max, hmax, col, name) {
    const g = this.ctx, hh = (val / max) * hmax;
    g.save(); g.fillStyle = this.c(col); g.globalAlpha = 0.35; g.fillRect(x, yb - hh, w, hh); g.restore();
    this.line([[x, yb], [x, yb - hh], [x + w, yb - hh], [x + w, yb]], { color: this.c(col), width: 2 });
    this.text(`${fmt(R(val), 0)} J`, x + w / 2, yb - hh - 6, { size: 10.5, align: 'center', weight: 700, color: this.c(col), mono: true });
    this.text(name, x + w / 2, yb + 14, { size: 10.5, align: 'center', weight: 700, color: this.c(col) });
  }

  // ---------- il pistone ----------
  drawPiston() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const k = this.live ? easeInOut(this.k / 0.8) : 0, r = piston(p.Q), Qn = p.Q * k, now = piston(Qn);
    const x0 = W * 0.12, x1 = W * 0.46, yb = H * 0.84, h0 = H * 0.24, s = H * 0.6, yp = yb - h0 - (now.h / 100) * s;
    // la fiamma sotto il cilindro, mentre il calore entra
    if (this.running && this.k < 0.85) for (let j = 0; j < 5; j++) { const fl = 6 + 0.1 * p.Q + 3 * Math.sin(this.clock * 14 + j * 2); this.line([[x0 + 12 + j * ((x1 - x0 - 24) / 4), yb + 26], [x0 + 12 + j * ((x1 - x0 - 24) / 4), yb + 26 - fl]], { color: this.c('orange'), width: 4, alpha: 0.85 }); }
    this.line([[x0 - 10, yb + 8], [x1 + 10, yb + 8]], { color: this.c('muted'), width: 3 });
    // il gas, con le particelle più veloci quando è più caldo, e il cilindro
    g.save(); g.fillStyle = this.c(now.T > 120 ? 'orange' : 'sky'); g.globalAlpha = 0.1; g.fillRect(x0, yp + 5, x1 - x0, yb - yp - 5); g.restore();
    this.gasIn(24, x0 + 2, yp + 5, x1 - 2, yb - 2, { col: this.c(now.T > 120 ? 'orange' : 'sky'), v: 60 * Math.sqrt((now.T + K0) / 293), r: 3.2 });
    const top = yb - h0 - 0.45 * s;
    this.line([[x0 - 3, top], [x0 - 3, yb + 3], [x1 + 3, yb + 3], [x1 + 3, top]], { color: this.c('chalk'), width: 2.6 });
    // il pistone e il peso da 10 kg sopra
    this.line([[x0 + 1, yp], [x1 - 1, yp]], { color: this.c('orange'), width: 8 });
    const bw = (x1 - x0) * 0.56, bx = (x0 + x1) / 2;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.5; g.fillRect(bx - bw / 2, yp - 34, bw, 30); g.restore();
    this.line([[bx - bw / 2, yp - 4], [bx - bw / 2, yp - 34], [bx + bw / 2, yp - 34], [bx + bw / 2, yp - 4]], { color: this.c('chalk'), width: 2 });
    this.text('10 kg', bx, yp - 15, { size: 12, align: 'center', weight: 700, color: this.c('chalk'), mono: true });
    // quanto è salito: la quota di partenza tratteggiata
    if (now.h > 0.5) { this.line([[x1 + 8, yb - h0], [x1 + 22, yb - h0]], { color: this.c('mint'), width: 1.4, dash: [3, 3] }); this.arrow(x1 + 15, yb - h0, x1 + 15, yp, { color: this.c('mint'), width: 2, head: 6 }); this.text(`${nice(now.h, 1)} cm`, x1 + 20, (yb - h0 + yp) / 2 + 4, { size: 10.5, color: this.c('mint'), weight: 700, mono: true }); }
    // le barre dell'energia: il calore si divide fra il gas e il lavoro
    const bwd = Math.min(28, W * 0.08), gap = bwd + 10, bx0 = W - 14 - 2 * gap - bwd, hmax = H * 0.42;
    this.bar(bx0, yb, bwd, Qn, 140, hmax, 'orange', E ? i18n('calore') : 'Q');
    this.bar(bx0 + gap, yb, bwd, now.U, 140, hmax, 'coral', E ? i18n('gas') : 'ΔU');
    this.bar(bx0 + 2 * gap, yb, bwd, now.L, 140, hmax, 'mint', i18n('lavoro'));
    const rows = [[E ? i18n('Calore dato al gas: {Q} joule', { Q: p.Q }) : i18n('Q = {Q} J, a pressione costante', { Q: p.Q }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('il peso da 10 kg sale di {h} cm', { h: nice(r.h, 1) }) : i18n('L = {L} J: il peso da 10 kg sale di {h} cm', { L: nice(r.L, 1), h: nice(r.h, 1) }), this.c('mint'), 700]);
      rows.push([E ? i18n('il resto scalda il gas, fino a {T} gradi', { T: R(r.T) }) : i18n('ΔU = {U} J: il gas si scalda fino a {T} °C', { U: nice(r.U, 1), T: R(r.T) }), this.c('coral'), 600]);
    }
    this.box(rows);
  }

  // ---------- il motore termico ----------
  drawCycle() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const eta = carnot(p.tc, p.tf), k = this.live ? easeOut(this.k / 0.6) : 0;
    const bx0 = W * 0.08, bx1 = W * 0.66, cx = (bx0 + bx1) / 2, cy = H * 0.5, r = Math.min(34, W * 0.1);
    const yh0 = H * 0.15, yh1 = H * 0.27, yc0 = H * 0.73, yc1 = H * 0.85;
    // la caldaia in alto e il lato freddo in basso
    const boxAt = (y0, y1, col, label) => {
      g.save(); g.fillStyle = this.c(col); g.globalAlpha = 0.2; g.fillRect(bx0, y0, bx1 - bx0, y1 - y0); g.restore();
      this.line([[bx0, y0], [bx1, y0], [bx1, y1], [bx0, y1], [bx0, y0]], { color: this.c(col), width: 2 });
      this.text(label, cx, (y0 + y1) / 2 + 5, { size: 12, align: 'center', weight: 700, color: this.c(col) });
    };
    boxAt(yh0, yh1, 'coral', E ? i18n('caldaia, {t} gradi', { t: p.tc }) : i18n('caldaia: {t} °C', { t: p.tc }));
    boxAt(yc0, yc1, 'sky', E ? i18n('lato freddo, {t} gradi', { t: p.tf }) : i18n('lato freddo: {t} °C', { t: p.tf }));
    // le frecce dell'energia, larghe quanto i joule: 100 J entrano, eta escono come lavoro, il resto va giù
    const wd = (J) => 2 + 0.2 * J;
    if (this.live) {
      this.arrow(cx, yh1 + 2, cx, cy - r - 4, { color: this.c('orange'), width: wd(100 * k), head: 10 });
      this.text('100 J', cx + 16, (yh1 + cy - r) / 2 + 4, { size: 11, color: this.c('orange'), weight: 700, mono: true });
      if (k > 0.5) {
        const k2 = (k - 0.5) / 0.5;
        if (100 - eta > 0.5) { this.arrow(cx, cy + r + 4, cx, yc0 - 2, { color: this.c('sky'), width: wd((100 - eta) * k2), head: 10 }); this.text(`${nice(100 - eta, 0)} J`, cx + 16, (cy + r + yc0) / 2 + 4, { size: 11, color: this.c('sky'), weight: 700, mono: true }); }
        if (eta > 0.5) { this.arrow(cx + r + 4, cy, W * 0.78, cy, { color: this.c('mint'), width: wd(eta * k2), head: 10 }); this.text(`${nice(eta, 0)} J`, (cx + r + W * 0.78) / 2, cy - 12 - wd(eta) / 2, { size: 11, align: 'center', color: this.c('mint'), weight: 700, mono: true }); }
      }
    }
    // il motore: una ruota con la manovella, che gira più in fretta se il lavoro è di più
    if (this.running && !this.calm) this.spin += this.fdt * (0.5 + eta / 12);
    this.ball(cx, cy, r, { color: this.c('chalk'), fill: 0.08, width: 2.4, shine: false });
    this.line([[cx, cy], [cx + Math.cos(this.spin) * r * 0.75, cy + Math.sin(this.spin) * r * 0.75]], { color: this.c('orange'), width: 4 });
    this.ball(cx, cy, 4, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    // la ruota a pale, che gira con il lavoro
    const wx = W * 0.88, wr = Math.min(26, W * 0.07), a0 = this.spin * 0.8;
    this.ball(wx, cy, wr, { color: this.c('mint'), fill: 0.08, width: 2, shine: false });
    for (let i = 0; i < 8; i++) { const a = a0 + (i * Math.PI) / 4; this.line([[wx + Math.cos(a) * 5, cy + Math.sin(a) * 5], [wx + Math.cos(a) * (wr + 6), cy + Math.sin(a) * (wr + 6)]], { color: this.c('mint'), width: 2.6 }); }
    // la barra del rendimento, con quello che serve e quello promesso
    const y = H - 30, X = (v) => 16 + (v / 100) * (W - 32);
    g.save(); g.fillStyle = this.c('mint'); g.globalAlpha = 0.45; g.fillRect(16, y, (X(eta * (this.live ? k : 0)) - 16), 10); g.restore();
    this.line([[16, y], [W - 16, y], [W - 16, y + 10], [16, y + 10], [16, y]], { color: this.c('muted'), width: 1.4 });
    this.text('0', 16, y + 24, { size: 9.5, color: this.c('muted'), mono: true });
    this.text('100%', W - 16, y + 24, { size: 9.5, align: 'right', color: this.c('muted'), mono: true });
    if (p.need != null) { this.line([[X(p.need), y - 6], [X(p.need), y + 16]], { color: this.c('sun'), width: 2, dash: [3, 3] }); this.text(E ? i18n('servono {n}', { n: p.need }) : i18n('serve il {n}%', { n: p.need }), X(p.need), y - 9, { size: 10, align: 'center', color: this.c('sun'), weight: 700 }); }
    if (p.claim != null) { this.line([[X(p.claim), y - 6], [X(p.claim), y + 16]], { color: this.c('coral'), width: 2, dash: [3, 3] }); this.text(E ? i18n('promessa: {n}', { n: p.claim }) : i18n('promessa: {n}%', { n: p.claim }), X(p.claim), y - 9, { size: 10, align: 'center', color: this.c('coral'), weight: 700 }); }
    const rows = [[E ? i18n('Caldaia a {tc} gradi, lato freddo a {tf} gradi', { tc: p.tc, tf: p.tf }) : i18n('caldaia a {tc} °C, lato freddo a {tf} °C', { tc: p.tc, tf: p.tf }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('su 100 parti di calore, {L} diventano lavoro', { L: R(eta) }) : i18n('rendimento massimo: {eta}%', { eta: nice(eta, 1) }), this.c('mint'), 700]);
      if (p.claim != null && eta < p.claim) rows.push([E ? i18n('la promessa di {n} è impossibile!', { n: p.claim }) : i18n('la promessa del {n}% è impossibile!', { n: p.claim }), this.c('coral'), 700]);
      else if (!E) rows.push([i18n('il resto, {Q} J, va al lato freddo', { Q: nice(100 - eta, 0) }), this.c('sky'), 600]);
    }
    this.box(rows);
  }

  // ---------- il frigorifero ----------
  drawFridge() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const f = fridge(p.ti), k = this.live ? easeOut(this.k / 0.6) : 0;
    const x0 = W * 0.08, x1 = W * 0.48, y0 = H * 0.2, y1 = H * 0.86, cy = H * 0.46;
    // il frigorifero: l'interno freddo con due cibi, il motore in basso, la griglia calda dietro
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.08 + 0.18 * clamp01((10 - p.ti) / 40); g.fillRect(x0, y0, x1 - x0, (y1 - y0) * 0.78); g.restore();
    this.line([[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], { color: this.c('chalk'), width: 2.6 });
    this.line([[x0, y0 + (y1 - y0) * 0.78], [x1, y0 + (y1 - y0) * 0.78]], { color: this.c('chalk'), width: 2 });
    this.line([[x1 - 12, y0 + 20], [x1 - 12, y0 + 60]], { color: this.c('chalk'), width: 3 });
    for (const [fx, fy, fw, col] of [[0.18, 0.5, 0.22, 'coral'], [0.5, 0.56, 0.18, 'sun']]) this.line([[x0 + fx * (x1 - x0), y0 + fy * (y1 - y0)], [x0 + (fx + fw) * (x1 - x0), y0 + fy * (y1 - y0)], [x0 + (fx + fw) * (x1 - x0), y0 + fy * (y1 - y0) - 18], [x0 + fx * (x1 - x0), y0 + fy * (y1 - y0) - 18], [x0 + fx * (x1 - x0), y0 + fy * (y1 - y0)]], { color: this.c(col), width: 2 });
    this.text(E ? i18n('dentro: {t} gradi', { t: p.ti }) : i18n('dentro: {t} °C', { t: p.ti }), (x0 + x1) / 2, y0 + 22, { size: 12, align: 'center', weight: 700, color: this.c('sky') });
    const mx = (x0 + x1) / 2, my = y0 + (y1 - y0) * 0.89;
    this.ball(mx, my, 11, { color: this.c('muted'), fill: 0.3, width: 2, shine: false });
    const gx = x1 + 12, warm = this.live ? 'orange' : 'muted';
    this.line(Array.from({ length: 13 }, (_, i) => [gx + (i % 2 ? 8 : 0), y0 + 16 + i * ((y1 - y0 - 40) / 12)]), { color: this.c(warm), width: 2 });
    // la presa di corrente e il lavoro che entra nel motore
    const sx = W * 0.9, sy = y1 - 6;
    this.line([[sx - 9, sy - 12], [sx + 9, sy - 12], [sx + 9, sy + 6], [sx - 9, sy + 6], [sx - 9, sy - 12]], { color: this.c('chalk'), width: 2 });
    this.line([[sx + 2, sy - 9], [sx - 3, sy - 2], [sx + 3, sy - 2], [sx - 2, sy + 4]], { color: this.c('sun'), width: 1.8 });
    this.text(E ? i18n('cucina, 25 gradi') : i18n('cucina: 25 °C'), W * 0.78, y0 + 10, { size: 12, align: 'center', weight: 700, color: this.c('orange') });
    const wd = (J) => 2 + 0.16 * J;
    if (this.live) {
      this.arrow(x0 + (x1 - x0) * 0.42, cy, gx - 4, cy, { color: this.c('sky'), width: wd(100 * k), head: 10 });
      this.text('100 J', x0 + (x1 - x0) * 0.42, cy - 14, { size: 11, color: this.c('sky'), weight: 700, mono: true });
      this.line([[sx, sy - 12], [sx, my], [mx + 14, my]], { color: this.c('mint'), width: wd(f.L * k), alpha: 0.9 });
      this.text(`${nice(f.L, 0)} J`, (sx + mx) / 2, my - 10 - wd(f.L) / 2, { size: 11, align: 'center', color: this.c('mint'), weight: 700, mono: true });
      if (k > 0.5) { const k2 = (k - 0.5) / 0.5; this.arrow(gx + 12, H * 0.34, W * 0.94, H * 0.34, { color: this.c('orange'), width: wd(f.Qc * k2), head: 10 }); this.text(`${nice(f.Qc, 0)} J`, (gx + W * 0.94) / 2, H * 0.34 - 12 - wd(f.Qc) / 2, { size: 11, align: 'center', color: this.c('orange'), weight: 700, mono: true }); }
    }
    const rows = [[E ? i18n('Dentro il frigo {ti} gradi, in cucina 25', { ti: p.ti }) : i18n('dentro a {ti} °C, cucina a 25 °C', { ti: p.ti }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('per togliere 100 joule ai cibi servono {L} joule di corrente', { L: R(f.L) }) : i18n('frigo ideale: per 100 J tolti servono {L} J di lavoro', { L: nice(f.L, 1) }), this.c('mint'), 700]);
      rows.push([E ? i18n('in cucina arrivano {Q} joule: il frigo la scalda', { Q: R(f.Qc) }) : i18n('alla cucina arrivano {Q} J', { Q: nice(f.Qc, 1) }), this.c('orange'), 600]);
    }
    this.box(rows);
  }

  // ---------- il disordine che cresce ----------
  drawMix() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const x0 = 16, x1 = W - 16, y0 = H * 0.2, y1 = H * 0.68, xm = (x0 + x1) / 2, N = p.N;
    const lift = this.live ? clamp01((this.k - 0.05) / 0.2) : 0;
    this.gasIn(N, x0, y0, x1, y1, { col: this.c('sky'), v: 90, r: 4.5 });
    this.line([[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], { color: this.c('chalk'), width: 2.6 });
    if (lift < 1) this.line([[xm, y0 - lift * (y1 - y0)], [xm, y1 - lift * (y1 - y0)]], { color: this.c('orange'), width: 4, alpha: 1 - lift });
    // quante sono a sinistra, adesso
    const kL = this.left(N), by = H * 0.76, X = (v) => x0 + v * (x1 - x0);
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.45; g.fillRect(x0, by, X(kL / N) - x0, 12); g.restore();
    this.line([[x0, by], [x1, by], [x1, by + 12], [x0, by + 12], [x0, by]], { color: this.c('muted'), width: 1.4 });
    this.line([[xm, by - 5], [xm, by + 17]], { color: this.c('chalk'), width: 1.4, dash: [3, 3] });
    this.text(E ? i18n('a sinistra: {k} su {n}', { k: kL, n: N }) : i18n('nella metà sinistra: {k} su {n}', { k: kL, n: N }), x0, by + 30, { size: 12, weight: 700, color: this.c('sky') });
    const rows = [[E ? i18n('{n} particelle, chiuse a sinistra', { n: N }) : i18n('{n} particelle nella metà sinistra', { n: N }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('tolta la parete, si sparpagliano dappertutto') : i18n('tutte a sinistra da sole: una volta su {w}', { w: fmt(2 ** N, 0) }), this.c('sun'), 700]);
      if (E) rows.push([i18n('e non tornano più tutte da una parte'), this.c('sun'), 600]);
    }
    this.box(rows);
  }
}
