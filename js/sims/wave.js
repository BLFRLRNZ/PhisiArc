// Le onde (O02). Cinque modi:
//   - 'corda': una corda lunga 6 m; la mano a sinistra la scuote su e giù f volte al secondo. L'onda corre verso destra
//     con la velocità v che dipende dalla tensione (bassa 1,5 m/s, media 3, alta 4,5): λ = v / f. Il nastrino rosso a metà
//     corda va solo su e giù. Con acqua: lo stesso, ma è la superficie di uno stagno, con una paperella al posto del nastrino.
//   - 'molla': una molla lunga e morbida (6 m), spinta avanti e indietro f volte al secondo: un'onda longitudinale, con le
//     spire che si addensano e si diradano. v = 3 m/s.
//   - 'impulsi': un impulso solo o due che si incontrano su una corda lunga 6 m (v = 3 m/s). caso 'muro': l'impulso torna
//     indietro capovolto dall'estremo fisso; 'stesso': due impulsi verso l'alto si sommano; 'opposti': uno su e uno giù si
//     annullano per un istante. Poi passano oltre, come se niente fosse.
//   - 'stazionaria': una corda di 6 m fissa ai due capi (v = 4 m/s), scossa con frequenza f. Quando f è un multiplo di
//     v / 2L = 1/3 Hz nascono le onde stazionarie: n pance ferme separate da nodi. Altrimenti la corda quasi non si muove.
//   - 'eco': la corda sparisce nella nebbia, legata a un palo che non si vede (a 9 m). Si manda un impulso e si cronometra
//     l'eco: t = 2L / v, con v = 3 m/s (tensione bassa) o 6 m/s (alta).
// Risultato: corda { f, v, lambda }; molla { f, lambda }; impulsi { caso }; stazionaria { f, n, A }; eco { v, t }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

const L = 6, TWO_PI = 2 * Math.PI, V_TENS = { bassa: 1.5, media: 3, alta: 4.5 }, V_STAZ = 4, L_ECO = 9, V_ECO = { bassa: 3, alta: 6 };
export const f1 = V_STAZ / (2 * L);
// quanto si muove la corda scossa con frequenza f: grande vicino alle armoniche n·f1, piccolo altrove
export const standing = (f) => { const n = Math.max(1, Math.round(f / f1)), d = (f - n * f1) / f1; return { n, A: 1 / (1 + (d / 0.08) ** 2) }; };
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const pulse = (x) => Math.exp(-((x / 0.35) ** 2)); // un impulso largo una trentina di centimetri

export class Wave extends Sim {
  static tall = true;
  static controls = {
    f: { label: 'Frequenza della mano', labelE: 'Scosse al secondo', min: 0.5, max: 3, step: 0.25, unit: 'Hz', unitE: '' },
    tens: { label: 'Tensione della corda', type: 'select', options: [['bassa', 'bassa'], ['media', 'media'], ['alta', 'alta']] },
    caso: { label: 'Che cosa succede', type: 'select', options: [['muro', 'contro il palo'], ['stesso', 'due onde in su'], ['opposti', 'uno su e uno giù']] },
    eco: { label: 'Tensione della corda', type: 'select', options: [['bassa', 'bassa'], ['alta', 'alta']] },
  };

  defaults() { return { mode: 'corda', f: 1, tens: 'media', acqua: false, caso: 'muro', eco: 'bassa', lens: 's' }; }

  init() { this.u = 0; this.echoAt = -1; }

  get dur() {
    const p = this.params;
    if (p.mode === 'corda') return L / V_TENS[p.tens] + 2.5;
    if (p.mode === 'molla') return L / 3 + 2.5;
    if (p.mode === 'impulsi') return 4.2;
    if (p.mode === 'eco') return (2 * L_ECO) / V_ECO[p.eco] + 0.8;
    return 4;
  }

  get live() { return this.running || !!this.result; }
  get tt() { return this.live ? (this.result ? this.dur : this.t) : 0; }

  step() {
    this.u = clamp01(this.t / this.dur);
    if (this.t >= this.dur) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'corda') { const v = V_TENS[p.tens]; return this.finish({ f: p.f, v, lambda: v / p.f, tens: p.tens }); }
    if (p.mode === 'molla') return this.finish({ f: p.f, lambda: 3 / p.f });
    if (p.mode === 'impulsi') return this.finish({ caso: p.caso });
    if (p.mode === 'eco') { const v = V_ECO[p.eco]; return this.finish({ v, t: (2 * L_ECO) / v }); }
    const s = standing(p.f);
    this.finish({ f: p.f, n: s.n, A: s.A });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'molla') this.drawSlinky();
    else if (m === 'impulsi') this.drawPulses();
    else if (m === 'stazionaria') this.drawStanding();
    else if (m === 'eco') this.drawEcho();
    else this.drawRope();
  }

  // la corda come linea, da x0 a x1 pixel alla quota y, con lo spostamento disp(x in metri) in metri
  rope(x0, x1, y, len, disp, s, col = 'chalk', width = 2.4) {
    const pts = [];
    for (let i = 0; i <= 240; i++) { const xm = (i / 240) * len; pts.push([x0 + (i / 240) * (x1 - x0), y - disp(xm) * s]); }
    this.line(pts, { color: this.c(col), width });
    return pts;
  }

  // ---------- l'onda sulla corda (o sull'acqua) ----------
  drawRope() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const v = V_TENS[p.tens], lam = v / p.f, t = this.tt, A = 0.32, x0 = 34, x1 = W - 14, y = H * 0.44, s = (x1 - x0) / L;
    const disp = (x) => (this.live && x < v * t ? A * Math.sin(TWO_PI * (p.f * t - x / lam)) : 0);
    const X = (xm) => x0 + xm * s, yh = y - disp(0) * s;
    if (p.acqua) {
      // lo stagno: l'acqua sotto la superficie, la pala che fa le onde e la paperella
      g.save(); g.beginPath(); g.moveTo(x0, H - 62);
      for (let i = 0; i <= 120; i++) { const xm = (i / 120) * L; g.lineTo(X(xm), y - disp(xm) * s); }
      g.lineTo(x1, H - 62); g.closePath(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.16; g.fill(); g.restore();
      this.rope(x0, x1, y, L, disp, s, 'sky', 2.2);
      this.line([[x0 - 10, yh - 30], [x0 - 10, yh + 12]], { color: this.c('orange'), width: 5 });
      const dx = L * 0.55, dy = y - disp(dx) * s, sl = this.live ? (disp(dx + 0.05) - disp(dx - 0.05)) / 0.1 : 0, ang = Math.atan(-sl);
      g.save(); g.translate(X(dx), dy - 8); g.rotate(ang);
      g.beginPath(); g.ellipse(0, 0, 15, 8, 0, 0, 7); g.fillStyle = this.c('sun'); g.globalAlpha = 0.85; g.fill();
      g.beginPath(); g.arc(11, -9, 6, 0, 7); g.fill(); g.globalAlpha = 1;
      g.fillStyle = this.c('orange'); g.beginPath(); g.moveTo(16, -9); g.lineTo(22, -7); g.lineTo(16, -6); g.fill();
      g.fillStyle = this.c('ink'); g.beginPath(); g.arc(12, -10, 1.3, 0, 7); g.fill(); g.restore();
      this.line([[X(dx) - 26, y - A * s - 6], [X(dx) - 26, y + A * s + 6]], { color: this.c('sun'), width: 1.2, dash: [3, 4], alpha: 0.6 });
    } else {
      // la corda, la mano che la scuote, il palo in fondo e il nastrino rosso a metà
      this.rope(x0, x1, y, L, disp, s);
      this.ball(x0 - 8, yh, 9, { color: this.c('orange'), fill: 0.6, width: 2, shine: false });
      this.line([[x1, y - A * s - 30], [x1, y + A * s + 30]], { color: this.c('muted'), width: 4 });
      const rx = L / 2, ry = y - disp(rx) * s;
      this.line([[X(rx) - 18, y - A * s - 6], [X(rx) - 18, y + A * s + 6]], { color: this.c('coral'), width: 1.2, dash: [3, 4], alpha: 0.6 });
      this.ball(X(rx), ry, 5, { color: this.c('coral'), fill: 1, width: 1.4, shine: false });
    }
    // il righello in metri sotto e, a onda formata, la lunghezza d'onda fra due creste
    const ry0 = H - 46;
    this.line([[x0, ry0], [x1, ry0]], { color: this.c('muted'), width: 1.4 });
    for (let m = 0; m <= L; m++) { this.line([[X(m), ry0], [X(m), ry0 + 6]], { color: this.c('muted'), width: 1.2 }); this.text(`${m} m`, X(m), ry0 + 18, { size: 9.5, align: 'center', color: this.c('muted'), mono: true }); }
    if (this.live && v * t > lam * 1.3) {
      let xc = lam * (p.f * t - 0.25); while (xc > Math.min(v * t, L) - lam - 0.05) xc -= lam; while (xc < 0.1) xc += lam;
      if (xc + lam <= Math.min(v * t, L) + 1e-6 && xc + lam <= L) {
        const yb = y - A * s - 22;
        this.line([[X(xc), yb + 8], [X(xc), yb], [X(xc + lam), yb], [X(xc + lam), yb + 8]], { color: this.c('mint'), width: 2 });
        this.text(E ? i18n('da cresta a cresta: {l} m', { l: nice(lam, 2) }) : `λ = ${nice(lam, 2)} m`, (X(xc) + X(xc + lam)) / 2, yb - 6, { size: 11, align: 'center', weight: 700, color: this.c('mint') });
      }
    }
    const rows = [[E ? i18n('Scosse al secondo: {f}; tensione {t}', { f: nice(p.f, 2), t: i18n(p.tens) }) : i18n('f = {f} Hz, tensione {t}: v = {v} m/s', { f: nice(p.f, 2), t: i18n(p.tens), v: nice(v, 1) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? (p.acqua ? i18n('la paperella va su e giù, ma resta dov’è') : i18n('il nastrino va su e giù, ma resta dov’è')) : i18n('λ = v / f = {l} m', { l: nice(lam, 2) }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'onda longitudinale sulla molla ----------
  drawSlinky() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const v = 3, lam = v / p.f, t = this.tt, A = Math.min(0.2, 0.13 * lam), x0 = 34, x1 = W - 14, y = H * 0.42, s = (x1 - x0) / L, N = 60;
    const disp = (x) => (this.live && x < v * t ? A * Math.sin(TWO_PI * (p.f * t - x / lam)) : 0);
    const X = (xm) => x0 + xm * s;
    for (let i = 0; i <= N; i++) {
      const xm = (i / N) * L, xx = X(xm + disp(xm)), red = i === N / 2;
      this.line([[xx, y - 26], [xx, y + 26]], { color: this.c(red ? 'coral' : 'chalk'), width: red ? 3 : 1.8, alpha: red ? 1 : 0.85 });
    }
    this.line([[x0 - 2, y - 30], [x0 - 2, y + 30]], { color: this.c('orange'), width: 5 });
    if (this.live) this.arrow(x0 - 20 + disp(0) * s, y + 46, x0 + 10 + disp(0) * s, y + 46, { color: this.c('orange'), width: 2.4, head: 7 });
    // dove le spire sono più fitte e dove più rade
    if (this.live && v * t > lam * 1.2) {
      let xc = lam * (p.f * t) - lam * 0.5; while (xc > Math.min(v * t, L) - 0.2) xc -= lam; while (xc < 0.3) xc += lam;
      if (xc < L - 0.2) this.text(E ? i18n('fitte') : i18n('compressione'), X(xc + disp(xc)), y - 36, { size: 11, align: 'center', weight: 700, color: this.c('coral') });
      const xr = xc + lam / 2 < L - 0.3 ? xc + lam / 2 : xc - lam / 2;
      if (xr > 0.3) this.text(E ? i18n('rade') : i18n('rarefazione'), X(xr + disp(xr)), y + 42, { size: 11, align: 'center', weight: 700, color: this.c('sky') });
    }
    const ry0 = H - 46;
    this.line([[x0, ry0], [x1, ry0]], { color: this.c('muted'), width: 1.4 });
    for (let m = 0; m <= L; m++) { this.line([[X(m), ry0], [X(m), ry0 + 6]], { color: this.c('muted'), width: 1.2 }); this.text(`${m} m`, X(m), ry0 + 18, { size: 9.5, align: 'center', color: this.c('muted'), mono: true }); }
    const rows = [[E ? i18n('Spinte al secondo: {f}', { f: nice(p.f, 2) }) : i18n('f = {f} Hz, v = 3 m/s', { f: nice(p.f, 2) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('la spira rossa va avanti e indietro, e resta dov’è') : i18n('onda longitudinale: λ = {l} m', { l: nice(lam, 2) }), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- impulsi che rimbalzano e si incontrano ----------
  drawPulses() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const v = 3, t = this.tt, x0 = 30, x1 = W - 30, y = H * 0.45, s = (x1 - x0) / L, h = 0.5;
    const t0 = 0.3, tl = t - t0;
    let disp;
    if (p.caso === 'muro') disp = (x) => (this.live ? h * (pulse(x - v * tl) - pulse(2 * L - x - v * tl)) : 0);
    else if (p.caso === 'stesso') disp = (x) => (this.live ? h * (pulse(x - v * tl) + pulse(L - x - v * tl)) : 0);
    else disp = (x) => (this.live ? h * (pulse(x - v * tl) - pulse(L - x - v * tl)) : 0);
    const X = (xm) => x0 + xm * s;
    this.line([[x0 - 8, y - 70], [x0 - 8, y + 70]], { color: this.c('muted'), width: 4 });
    this.line([[x1 + 8, y - 70], [x1 + 8, y + 70]], { color: this.c('muted'), width: 4 });
    this.line([[x0, y], [x1, y]], { color: this.c('edge'), width: 1, dash: [4, 6] });
    // i due impulsi, ognuno con il suo colore tratteggiato, e la corda che è la loro somma
    if (this.live && p.caso !== 'muro') {
      this.rope(x0, x1, y, L, (x) => h * pulse(x - v * tl), s, 'sky', 1.4);
      this.rope(x0, x1, y, L, (x) => h * (p.caso === 'stesso' ? 1 : -1) * pulse(L - x - v * tl), s, 'orange', 1.4);
    }
    this.rope(x0, x1, y, L, disp, s, 'chalk', 2.6);
    const meet = p.caso !== 'muro' && Math.abs(tl - L / (2 * v)) < 0.12;
    if (meet) this.text(p.caso === 'stesso' ? (E ? i18n('si sommano!') : i18n('interferenza costruttiva')) : (E ? i18n('si annullano!') : i18n('interferenza distruttiva')), X(L / 2), y - 90, { size: 13, align: 'center', weight: 700, color: this.c('sun') });
    const rows = [[p.caso === 'muro' ? (E ? i18n('Un’onda verso il palo') : i18n('un impulso contro l’estremo fisso')) : p.caso === 'stesso' ? (E ? i18n('Due onde verso l’alto') : i18n('due impulsi verso l’alto, uno contro l’altro')) : (E ? i18n('Un’onda su e una giù') : i18n('un impulso su e uno giù, uno contro l’altro')), this.c('chalk'), 700]];
    if (this.result) rows.push([p.caso === 'muro' ? (E ? i18n('torna indietro capovolto') : i18n('dall’estremo fisso torna capovolto')) : (E ? i18n('si attraversano e proseguono come prima') : i18n('si sovrappongono, poi proseguono intatti')), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- le onde stazionarie ----------
  drawStanding() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const { n, A } = standing(p.f), t = this.tt, k = this.live ? easeOut(t / 1.2) : 0, amp = 0.45 * A * k + (this.live ? 0.02 : 0);
    const x0 = 30, x1 = W - 30, y = H * 0.45, s = (x1 - x0) / L, X = (xm) => x0 + xm * s;
    const disp = (x) => amp * Math.sin((n * Math.PI * x) / L) * Math.cos(TWO_PI * p.f * t);
    this.line([[x0 - 8, y - 80], [x0 - 8, y + 80]], { color: this.c('muted'), width: 4 });
    this.line([[x1 + 8, y - 80], [x1 + 8, y + 80]], { color: this.c('muted'), width: 4 });
    // l'inviluppo tratteggiato, la corda, i nodi
    if (this.live && A > 0.3) {
      this.rope(x0, x1, y, L, (x) => amp * Math.sin((n * Math.PI * x) / L), s, 'muted', 1.2);
      this.rope(x0, x1, y, L, (x) => -amp * Math.sin((n * Math.PI * x) / L), s, 'muted', 1.2);
      for (let i = 0; i <= n; i++) this.ball(X((i * L) / n), y, 4, { color: this.c('sun'), fill: 1, width: 1.2, shine: false });
    }
    this.rope(x0, x1, y, L, disp, s, 'chalk', 2.6);
    this.ball(x0 - 8, y, 7, { color: this.c('orange'), fill: 0.6, width: 2, shine: false });
    const rows = [[E ? i18n('Scosse al secondo: {f}', { f: nice(p.f, 2) }) : i18n('f = {f} Hz, corda di 6 m fissa ai capi, v = 4 m/s', { f: nice(p.f, 2) }), this.c('chalk'), 700]];
    if (this.result) rows.push(A > 0.5 ? [E ? i18n('un’onda ferma con {n} pance!', { n }) : i18n('onda stazionaria con {n} ventri: λ = {l} m', { n, l: nice((2 * L) / n, 2) }), this.c('mint'), 700] : [E ? i18n('la corda quasi non si muove: cambia ritmo') : i18n('nessuna onda stazionaria a questa frequenza'), this.c('coral'), 700]);
    this.box(rows);
  }

  // ---------- l'eco nella nebbia ----------
  drawEcho() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const v = V_ECO[p.eco], t = this.tt, tl = t - 0.3, h = 0.5, x0 = 30, y = H * 0.45, s = (W - 40) / 4.5;
    const disp = (x) => (this.live ? h * (pulse(x - v * tl) - pulse(2 * L_ECO - x - v * tl)) : 0);
    // la corda continua nella nebbia: se ne vedono 4,5 m; il palo è a 9 m, nascosto
    this.rope(x0, x0 + L_ECO * s, y, L_ECO, disp, s, 'chalk', 2.6);
    this.ball(x0 - 8, y - disp(0) * s, 8, { color: this.c('orange'), fill: 0.6, width: 2, shine: false });
    const fx = x0 + 2.2 * s;
    const grd = g.createLinearGradient(fx, 0, fx + 60, 0);
    grd.addColorStop(0, 'rgba(160,170,190,0)'); grd.addColorStop(1, 'rgba(160,170,190,0.92)');
    g.save(); g.fillStyle = grd; g.fillRect(fx, 0, 60, H); g.fillStyle = 'rgba(160,170,190,0.92)'; g.fillRect(fx + 60, 0, W - fx - 60, H); g.restore();
    this.text('?', fx + 110, y + 14, { size: 40, align: 'center', weight: 700, color: this.c('sim-bg') });
    // il cronometro: parte con l'impulso, si ferma quando l'eco torna alla mano
    const tEcho = (2 * L_ECO) / v, back = this.live && tl >= tEcho;
    if (back && this.echoAt < 0) this.echoAt = this.clock;
    if (back) this.ripple(x0, y, Math.min(0.6, this.clock - this.echoAt), { color: this.c('sun'), r0: 8, r1: 40, dur: 0.6 });
    const shown = this.live ? Math.max(0, Math.min(tl, tEcho)) : 0;
    this.text(i18n('cronometro: {t} s', { t: fmt(shown, 1) }), x0, H - 40, { size: 14, weight: 700, color: this.c(back ? 'sun' : 'chalk'), mono: true });
    const rows = [[E ? i18n('Tensione {t}: l’onda corre a {v} metri al secondo', { t: i18n(p.eco), v }) : i18n('tensione {t}: v = {v} m/s', { t: i18n(p.eco), v }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('l’eco torna dopo {t} secondi', { t: nice(tEcho, 1) }) : i18n('l’eco torna dopo {t} s, capovolto', { t: nice(tEcho, 2) }), this.c('sun'), 700]);
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
