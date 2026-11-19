// Il suono (O03). Sei modi:
//   - 'onda': un altoparlante spinge l'aria avanti e indietro f volte al secondo; compressioni e rarefazioni corrono fino
//     all'orecchio a 343 m/s. Si vedono 3 m d'aria al rallentatore, 200 volte più lenti: ogni pallino oscilla sul posto.
//     Sotto, la pressione che arriva all'orecchio nel tempo. Al lancio si sente la nota vera, con il volume scelto.
//   - 'campana': una sveglia sotto una campana di vetro; la pompa toglie l'aria. Il martelletto batte sempre, ma senza
//     aria il suono non esce (l'esperimento di Robert Boyle, 1660).
//   - 'tuono': il lampo si vede subito, il tuono arriva dopo d / 343 secondi. Il tempo scorre due volte più in fretta.
//   - 'mezzi': un tubo lungo 1 km, colpito a un capo. Il suono arriva per il tubo (ferro 5000 m/s, acqua 1480 m/s) e per
//     l'aria (343 m/s): all'altro capo si sentono due colpi (l'esperimento di Jean-Baptiste Biot, 1808).
//   - 'canne': una canna del flauto di Pan, chiusa in fondo, lunga L centimetri: suona f = v / (4L). Un accordatore la
//     confronta con la nota del cartellino (meta), se c'è.
//   - 'spazio': un'esplosione nello spazio, o sulla Terra a 686 m; due astronauti, con i caschi a contatto o no.
// Risultato: onda { f, vol, lambda }; campana { aria, livello }; tuono { d, t }; mezzi { mezzo, v, t, ta };
//            canne { L, f }; spazio { dove, caschi, sente, voce }
import { t as i18n } from '../i18n.js';
import { note, boom } from '../audio.js';
import { Sim, fmt, clamp01 } from './base.js';

const V = 343, TWO_PI = 2 * Math.PI, SLOW = 200, AIR_W = 3;
const ARIA = { piena: 1, meta: 0.4, vuota: 0 }, ARIA_LAB = { piena: 'tutta', meta: 'metà', vuota: 'niente' };
const MEZZO = { ferro: 5000, acqua: 1480, aria: V }, TUBO = 1000;
const FAST = 2, D_SPAZIO = 686;
export const pipeF = (L) => (V * 100) / (4 * L); // la canna chiusa in fondo è lunga un quarto d'onda; L in centimetri
export const pipeL = (f) => (V * 100) / (4 * f);
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const rnd = (i) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }; // sempre gli stessi «a caso»

export class Sound extends Sim {
  static tall = true;
  static controls = {
    f: { label: 'Frequenza', labelE: 'Vibrazioni al secondo', min: 100, max: 1000, step: 50, unit: 'Hz', unitE: '' },
    vol: { label: 'Volume', min: 1, max: 5, step: 1, unit: '' },
    aria: { label: 'Aria nella campana', type: 'select', options: [['piena', 'tutta'], ['meta', 'metà'], ['vuota', 'niente']] },
    d: { label: 'Distanza del temporale', min: 0.5, max: 3.5, step: 0.5, unit: 'km' },
    mezzo: { label: 'Il tubo', type: 'select', options: [['ferro', 'di ferro'], ['acqua', 'pieno d’acqua'], ['aria', 'niente tubo']] },
    L: { label: 'Lunghezza della canna', min: 10, max: 40, step: 0.5, unit: 'cm' },
    dove: { label: 'Dove', type: 'select', options: [['spazio', 'nello spazio'], ['terra', 'sulla Terra']] },
    caschi: { label: 'Caschi a contatto', type: 'toggle' },
  };

  defaults() { return { mode: 'onda', f: 300, vol: 3, aria: 'piena', d: 1, mezzo: 'ferro', L: 25, meta: 0, dove: 'spazio', caschi: false, lens: 's' }; }

  init() {
    if (this.snd) this.snd.stop();
    this.snd = null;
    this.ev = {};
  }

  get dur() {
    const p = this.params;
    if (p.mode === 'tuono') return 0.3 + (p.d * 1000) / V / FAST + 1;
    if (p.mode === 'mezzi') return 0.2 + TUBO / V + 0.7;
    if (p.mode === 'canne') return p.meta > 0 ? 2.4 : 1.6;
    if (p.mode === 'spazio') return 0.3 + D_SPAZIO / V + 1;
    return 3.2;
  }

  get live() { return this.running || !!this.result; }
  get tt() { return this.live ? (this.result ? this.dur : this.t) : 0; }

  // i suoni veri partono quando l'esperimento arriva al momento giusto
  step() {
    const p = this.params, t = this.t, once = (k) => (this.ev[k] ? false : (this.ev[k] = true));
    if (p.mode === 'onda' && once('nota')) this.snd = note(p.f, { vol: 0.022 * p.vol, dur: 2.9 });
    else if (p.mode === 'campana' && once('trillo')) this.snd = note(2100, { type: 'triangle', trem: 18, vol: 0.07 * ARIA[p.aria], dur: 2.8 });
    else if (p.mode === 'tuono' && t >= 0.3 + (p.d * 1000) / V / FAST && once('tuono')) boom({ vol: 0.5 / Math.sqrt(p.d), dur: 2.2 });
    else if (p.mode === 'mezzi') {
      if (p.mezzo !== 'aria' && t >= 0.2 + TUBO / MEZZO[p.mezzo] && once('tubo')) note(p.mezzo === 'ferro' ? 2600 : 900, { type: p.mezzo === 'ferro' ? 'triangle' : 'sine', vol: 0.1, dur: 0.3 });
      if (t >= 0.2 + TUBO / V && once('aria')) note(700, { type: 'square', vol: 0.04, dur: 0.09 });
    } else if (p.mode === 'canne' && once('canna')) {
      if (p.meta > 0) { note(p.meta, { vol: 0.09, dur: 0.8 }); note(pipeF(p.L), { vol: 0.09, dur: 0.9, when: 1 }); }
      else note(pipeF(p.L), { vol: 0.09, dur: 0.9 });
    } else if (p.mode === 'spazio') {
      if (p.caschi && t >= 0.9 && once('voce')) note(230, { type: 'triangle', trem: 7, vol: 0.05, dur: 0.8 });
      if (p.dove === 'terra' && t >= 0.3 + D_SPAZIO / V && once('bum')) boom({ vol: 0.4, dur: 1.8 });
    }
    if (t >= this.dur) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'onda') return this.finish({ f: p.f, vol: p.vol, lambda: V / p.f });
    if (p.mode === 'campana') return this.finish({ aria: p.aria, livello: ARIA[p.aria] });
    if (p.mode === 'tuono') return this.finish({ d: p.d, t: (p.d * 1000) / V });
    if (p.mode === 'mezzi') { const v = MEZZO[p.mezzo]; return this.finish({ mezzo: p.mezzo, v, t: TUBO / v, ta: TUBO / V }); }
    if (p.mode === 'canne') return this.finish({ L: p.L, f: pipeF(p.L) });
    this.finish({ dove: p.dove, caschi: !!p.caschi, sente: p.dove === 'terra', voce: !!p.caschi });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'campana') this.drawJar();
    else if (m === 'tuono') this.drawStorm();
    else if (m === 'mezzi') this.drawPipe();
    else if (m === 'canne') this.drawFlute();
    else if (m === 'spazio') this.drawSpace();
    else this.drawAir();
  }

  // un orecchio stilizzato, aperto verso sinistra
  ear(x, y, k = 1, col = 'chalk') {
    const g = this.ctx;
    g.save(); g.strokeStyle = this.c(col); g.lineWidth = 2.4; g.lineCap = 'round';
    g.beginPath(); g.arc(x, y - 4 * k, 14 * k, Math.PI * 1.15, Math.PI * 0.55, false); g.stroke();
    g.beginPath(); g.arc(x + 1 * k, y - 4 * k, 7 * k, Math.PI * 1.2, Math.PI * 0.5, false); g.stroke();
    g.restore();
  }

  // un omino semplice, in piedi a terra
  person(x, gy, col = 'chalk') {
    this.ball(x, gy - 40, 6, { color: this.c(col), fill: 0.2, width: 2, shine: false });
    this.line([[x, gy - 34], [x, gy - 16]], { color: this.c(col), width: 2.4 });
    this.line([[x - 8, gy - 28], [x, gy - 24], [x + 8, gy - 28]], { color: this.c(col), width: 2.2 });
    this.line([[x - 6, gy], [x, gy - 16], [x + 6, gy]], { color: this.c(col), width: 2.4 });
  }

  // tre piccoli archi: «qui si sente»
  hears(x, y, a = 1) {
    const g = this.ctx;
    g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2; g.globalAlpha = a;
    for (let i = 1; i <= 3; i++) { g.beginPath(); g.arc(x, y, 5 + i * 5, -0.6, 0.6); g.stroke(); }
    g.restore();
  }

  // ---------- l'aria fra l'altoparlante e l'orecchio ----------
  drawAir() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const lam = V / p.f, fv = p.f / SLOW, vv = V / SLOW, tau = this.live ? Math.max(0, this.tt - 0.2) : 0;
    const xa = 66, xb = W - 52, y0 = 60, y1 = Math.min(H * 0.56, y0 + 170), s = (xb - xa) / AIR_W, X = (m) => xa + m * s, ym = (y0 + y1) / 2;
    const Apx = 1.2 + 0.9 * p.vol, front = vv * tau;
    const ph = (m) => TWO_PI * (fv * tau - m / lam);
    // dietro il fronte l'onda cresce in mezza lunghezza d'onda: niente salti
    const env = (m) => clamp01((front - m) / (0.5 * lam));
    const disp = (m) => (this.live && m < front ? Apx * env(m) * Math.sin(ph(m)) : 0);
    const press = (m) => (this.live && m < front ? env(m) * Math.cos(ph(m)) : 0);
    // le compressioni, ombreggiate: dove l'aria è più fitta
    g.save(); g.fillStyle = this.c('sky');
    for (let x = xa; x < xb; x += 3) { const q = press((x - xa) / s); if (q > 0.05) { g.globalAlpha = 0.2 * q; g.fillRect(x, y0 - 6, 3, y1 - y0 + 12); } }
    g.restore();
    // i pallini d'aria: oscillano sul posto
    const cols = 46, nr = 8;
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.7;
    for (let i = 0; i < cols; i++) for (let j = 0; j < nr; j++) {
      if (i === 23 && j === 4) continue;
      const m = ((i + 0.5 + 0.6 * (rnd(i * 31 + j) - 0.5)) / cols) * AIR_W, yy = y0 + ((j + 0.5 + 0.5 * (rnd(i * 17 + j * 7 + 3) - 0.5)) / nr) * (y1 - y0);
      g.beginPath(); g.arc(X(m) + disp(m), yy, 1.9, 0, TWO_PI); g.fill();
    }
    g.restore();
    const mr = (23.5 / cols) * AIR_W, yr = y0 + (4.5 / nr) * (y1 - y0);
    this.line([[X(mr) - Apx, yr - 14], [X(mr) - Apx, yr + 14]], { color: this.c('coral'), width: 1.2, dash: [3, 3], alpha: 0.6 });
    this.line([[X(mr) + Apx, yr - 14], [X(mr) + Apx, yr + 14]], { color: this.c('coral'), width: 1.2, dash: [3, 3], alpha: 0.6 });
    this.ball(X(mr) + disp(mr), yr, 3.6, { color: this.c('coral'), fill: 1, width: 1.2, shine: false });
    // l'altoparlante: la membrana segue l'aria che spinge
    const mx = xa - 10 + disp(0) * 0.9;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.5; g.fillRect(12, ym - 26, 20, 52); g.restore();
    this.line([[32, ym - 14], [mx, ym - 44], [mx, ym + 44], [32, ym + 14], [32, ym - 14]], { color: this.c('chalk'), width: 2.4 });
    this.line([[mx, ym - 44], [mx, ym + 44]], { color: this.c('orange'), width: 4 });
    this.ear(xb + 26, ym, 1.1);
    // la pressione all'orecchio, nel tempo
    const py0 = y1 + 36, py1 = H - 34, pm = (py0 + py1) / 2, px0 = 30, px1 = W - 16, amp = ((py1 - py0) / 2) * (0.16 * p.vol);
    if (py1 - py0 > 40) {
      this.line([[px0, pm], [px1, pm]], { color: this.c('edge'), width: 1.2 });
      this.line([[px0, py0], [px0, py1]], { color: this.c('edge'), width: 1.2 });
      this.text(E ? i18n('la spinta dell’aria sull’orecchio') : i18n('pressione all’orecchio'), px0 + 6, py0 + 2, { size: 10.5, color: this.c('muted') });
      this.text(i18n('tempo →'), px1, py1 + 14, { size: 10, align: 'right', color: this.c('muted') });
      if (this.live) {
        const ta = AIR_W / vv, win = 1.6, pts = [];
        for (let k = 0; k <= 220; k++) { const tt = tau - win + (win * k) / 220, v = tt > ta ? clamp01((tt - ta) * fv * 2) * Math.cos(TWO_PI * (fv * tt - AIR_W / lam)) : 0; pts.push([px0 + ((px1 - px0) * k) / 220, pm - amp * v]); }
        this.line(pts, { color: this.c('sky'), width: 2 });
      }
    }
    const rows = [[E ? i18n('Vibrazioni al secondo: {f}; volume {a}', { f: p.f, a: p.vol }) : i18n('f = {f} Hz, v = 343 m/s: λ = {l} m', { f: p.f, l: nice(lam, 2) }), this.c('chalk'), 700],
      [E ? i18n('al rallentatore') : i18n('al rallentatore, 200 volte più lento'), this.c('muted'), 500]];
    if (this.result) rows.push([E ? i18n('l’aria vibra avanti e indietro, e resta dov’è') : i18n('compressioni e rarefazioni arrivano all’orecchio'), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- la sveglia sotto la campana di vetro ----------
  drawJar() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const lev = ARIA[p.aria], t = this.tt, cx = W * 0.5, base = H * 0.74, jr = Math.min(W * 0.24, 92), jh = Math.min(H * 0.52, 190);
    // il piatto, il tubo e la pompa
    const px = W - 34;
    this.line([[cx + jr * 0.5, base + 4], [cx + jr * 0.5, base + 20], [px, base + 20], [px, base - 4]], { color: this.c('muted'), width: 3 });
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 2.4; g.strokeRect(px - 11, base - 64, 22, 60); g.restore();
    const rod = p.aria === 'piena' ? 0 : p.aria === 'meta' ? 14 : 26;
    this.line([[px, base - 64], [px, base - 84 - rod]], { color: this.c('muted'), width: 3 });
    this.line([[px - 12, base - 84 - rod], [px + 12, base - 84 - rod]], { color: this.c('muted'), width: 4 });
    this.line([[cx - jr - 26, base], [cx + jr + 26, base]], { color: this.c('muted'), width: 6 });
    // la campana di vetro
    const top = base - jh;
    g.save(); g.beginPath(); g.moveTo(cx - jr, base); g.lineTo(cx - jr, top + jr); g.arc(cx, top + jr, jr, Math.PI, 0); g.lineTo(cx + jr, base);
    g.fillStyle = this.c('sky'); g.globalAlpha = 0.07; g.fill(); g.globalAlpha = 0.75; g.strokeStyle = this.c('sky'); g.lineWidth = 2.2; g.stroke(); g.restore();
    this.ball(cx, top - 6, 6, { color: this.c('sky'), fill: 0.3, width: 2, shine: false });
    // l'aria dentro: tanti pallini quanta aria c'è
    const nAir = Math.round(54 * lev);
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.55;
    // posti sparsi in tutta la campana, cupola compresa: si scartano quelli che cadrebbero fuori dal vetro
    for (let i = 0, k = 0; k < nAir && i < 400; i++) {
      const x0 = cx - jr + 10 + rnd(i * 3 + 1) * (2 * jr - 20), y0 = top + 10 + rnd(i * 3 + 2) * (jh - 20);
      if (y0 < top + jr && (x0 - cx) ** 2 + (y0 - top - jr) ** 2 > (jr - 10) ** 2) continue;
      k++;
      g.beginPath(); g.arc(x0 + 2 * Math.sin(this.clock * 3 + i), y0 + 2 * Math.cos(this.clock * 2.6 + i * 1.7), 1.8, 0, TWO_PI); g.fill();
    }
    g.restore();
    // le onde del suono: escono dalla sveglia, tanto più forti quanta più aria c'è
    const sx = cx, sy = base - 48;
    if (this.running && lev > 0) {
      g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2;
      for (let k = 0; k < 4; k++) { const age = (t * 1.5 + k / 4) % 1; g.globalAlpha = (1 - age) * 0.8 * lev; g.beginPath(); g.arc(sx, sy, 28 + age * (jr + 40), 0, TWO_PI); g.stroke(); }
      g.restore();
    }
    // la sveglia: il martelletto batte fra le due campanelle, con l'aria o senza
    const hit = this.running ? 9 * Math.sin(this.clock * 55) : 0;
    this.ball(sx - 14, sy - 26, 9, { color: this.c('orange'), fill: 0.6, width: 2, shine: false });
    this.ball(sx + 14, sy - 26, 9, { color: this.c('orange'), fill: 0.6, width: 2, shine: false });
    this.line([[sx, sy - 22], [sx + hit, sy - 36]], { color: this.c('chalk'), width: 2.4 });
    this.ball(sx + hit, sy - 37, 3, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    this.line([[sx - 14, sy + 18], [sx - 18, sy + 28]], { color: this.c('chalk'), width: 2.6 });
    this.line([[sx + 14, sy + 18], [sx + 18, sy + 28]], { color: this.c('chalk'), width: 2.6 });
    this.ball(sx, sy, 22, { color: this.c('sun'), fill: 0.25, width: 2.6, shine: false });
    this.line([[sx, sy], [sx, sy - 13]], { color: this.c('chalk'), width: 2 });
    this.line([[sx, sy], [sx + 9, sy + 4]], { color: this.c('chalk'), width: 2 });
    // fuori, l'orecchio e quanto suono gli arriva
    const ex = 30, ey = base - 70, bh = 110, by = base - 4;
    this.ear(ex, ey - 54, 0.9);
    const lv = this.running ? lev * (0.75 + 0.25 * Math.abs(Math.sin(this.clock * 23))) : this.result ? lev : 0;
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 1.6; g.strokeRect(ex - 7, by - bh, 14, bh);
    g.fillStyle = this.c(lev > 0.5 ? 'mint' : 'sun'); g.fillRect(ex - 6, by - bh * lv, 12, bh * lv); g.restore();
    this.text(E ? i18n('quanto senti') : i18n('suono fuori'), ex - 9, by + 16, { size: 10, color: this.c('muted') });
    const rows = [[E ? i18n('Aria nella campana: {a}', { a: i18n(ARIA_LAB[p.aria]) }) : i18n('aria nella campana: {a}', { a: i18n(ARIA_LAB[p.aria]) }), this.c('chalk'), 700]];
    if (this.result) {
      if (E) rows.push([lev === 1 ? i18n('la sveglia si sente forte') : lev > 0 ? i18n('la sveglia si sente piano') : i18n('il martelletto batte, ma non si sente niente!'), this.c(lev > 0 ? 'mint' : 'coral'), 700]);
      else rows.push([lev > 0 ? i18n('esce il {p}% del suono', { p: Math.round(lev * 100) }) : i18n('nel vuoto il suono non si propaga'), this.c(lev > 0 ? 'mint' : 'coral'), 700]);
    }
    this.box(rows);
  }

  // ---------- il lampo e il tuono ----------
  drawStorm() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const gy = H * 0.72, x0 = 44, x1 = W - 26, s = (x1 - x0) / 3.6, X = (km) => x0 + km * s;
    const tA = (p.d * 1000) / V, tau = this.tt - 0.3, real = this.live ? Math.max(0, tau * FAST) : 0, back = this.live && real >= tA;
    const cxp = X(p.d), cy = H * 0.2;
    // il lampo: un attimo di luce su tutto
    if (this.live && tau >= 0 && tau < 0.3) { g.save(); g.fillStyle = '#fff'; g.globalAlpha = 0.3 * (1 - tau / 0.3); g.fillRect(0, 0, W, H); g.restore(); }
    this.ground(gy);
    for (let k = 0; k <= 3.5; k += 0.5) {
      this.line([[X(k), gy], [X(k), gy + (k % 1 ? 4 : 7)]], { color: this.c('muted'), width: 1.2 });
      if (k % 1 === 0) this.text(`${k} km`, X(k), gy + 19, { size: 9.5, align: 'center', color: this.c('muted'), mono: true });
    }
    // la nuvola
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.55;
    for (const [dx, dy, r] of [[-26, 6, 18], [-6, -6, 24], [18, 2, 20], [34, 10, 14], [4, 12, 18]]) { g.beginPath(); g.arc(cxp + dx, cy + dy, r, 0, TWO_PI); g.fill(); }
    g.restore();
    if (this.live && tau >= 0 && tau < 0.45) this.line([[cxp, cy + 22], [cxp - 10, cy + 60], [cxp + 6, cy + 64], [cxp - 6, gy - 40], [cxp + 8, gy - 38], [cxp - 2, gy]], { color: this.c('sun'), width: 3 });
    // il suono del tuono: un fronte che si allarga a 343 m/s
    if (this.live && tau > 0 && !back) {
      const r = 0.343 * real * s;
      g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2.2;
      for (let k = 0; k < 3; k++) { const rr = r - k * 9; if (rr > 0) { g.globalAlpha = 0.7 - k * 0.2; g.beginPath(); g.arc(cxp, gy, rr, Math.PI, TWO_PI); g.stroke(); } }
      g.restore();
    }
    this.person(x0, gy);
    if (back) this.hears(x0 + 6, gy - 42, Math.max(0.3, 1 - (real - tA) / 3));
    const shown = this.live ? Math.min(real, tA) : 0;
    this.text(i18n('cronometro: {t} s', { t: fmt(shown, 1) }), x0 - 26, gy + 38, { size: 13, weight: 700, color: this.c(back ? 'sun' : 'chalk'), mono: true });
    this.text(i18n('tempo accelerato ×2'), W - 10, gy + 38, { size: 10, align: 'right', color: this.c('muted') });
    const rows = [[E ? i18n('Il temporale è a {d} km', { d: nice(p.d, 1) }) : i18n('d = {d} km: luce subito, suono a 343 m/s', { d: nice(p.d, 1) }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('il tuono arriva dopo {t} secondi', { t: nice(tA, 1) }) : i18n('t = d / v = {t} s', { t: nice(tA, 2) }), this.c('sun'), 700]);
    this.box(rows);
  }

  // ---------- il tubo lungo un chilometro ----------
  drawPipe() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const x0 = 52, x1 = W - 46, yA = H * 0.26, yM = H * 0.44, t = this.tt - 0.2, vm = MEZZO[p.mezzo];
    const tm = TUBO / vm, ta = TUBO / V, pos = (v) => x0 + (x1 - x0) * clamp01((t * v) / TUBO);
    // l'aria in alto, il tubo in basso
    this.line([[x0, yA], [x1, yA]], { color: this.c('edge'), width: 1.4, dash: [3, 6] });
    this.text(E ? i18n('nell’aria') : i18n('aria, 343 m/s'), x0, yA - 12, { size: 11, color: this.c('muted') });
    if (p.mezzo !== 'aria') {
      g.save(); g.fillStyle = this.c(p.mezzo === 'ferro' ? 'muted' : 'sky'); g.globalAlpha = p.mezzo === 'ferro' ? 0.7 : 0.45;
      g.fillRect(x0, yM - 7, x1 - x0, 14); g.restore();
      this.text(p.mezzo === 'ferro' ? (E ? i18n('nel ferro') : i18n('ferro, 5000 m/s')) : (E ? i18n('nell’acqua') : i18n('acqua, 1480 m/s')), x0, yM + 26, { size: 11, color: this.c('muted') });
    }
    // il martello: alzato prima del colpo, poi batte sul capo del tubo; l'orecchio all'altro capo
    const px = x0 - 44, py = yM - 36, hit = Math.atan2(36, 38), ang = !this.live ? hit - 0.8 : t < 0 ? hit - 0.8 * clamp01(-t / 0.2) : hit;
    g.save(); g.translate(px, py); g.rotate(ang);
    g.fillStyle = this.c('orange'); g.fillRect(0, -3, 40, 6); g.fillStyle = this.c('chalk'); g.fillRect(40, -11, 11, 22); g.restore();
    this.ear(x1 + 22, (yA + yM) / 2, 1.1);
    this.line([[x0, yM + 44], [x1, yM + 44]], { color: this.c('muted'), width: 1.2 });
    this.line([[x0, yM + 38], [x0, yM + 50]], { color: this.c('muted'), width: 1.2 });
    this.line([[x1, yM + 38], [x1, yM + 50]], { color: this.c('muted'), width: 1.2 });
    this.text('1 km', (x0 + x1) / 2, yM + 58, { size: 10.5, align: 'center', color: this.c('muted'), mono: true });
    // i due colpi che corrono
    if (this.live && t >= 0) {
      if (t * V < TUBO) this.ball(pos(V), yA, 6, { color: this.c('sun'), fill: 0.9, width: 1.5, shine: false });
      if (p.mezzo !== 'aria' && t * vm < TUBO) this.ball(pos(vm), yM, 6, { color: this.c('sun'), fill: 0.9, width: 1.5, shine: false });
      if (t >= tm && p.mezzo !== 'aria') this.ripple(x1, yM, Math.min(0.7, t - tm), { color: this.c('mint'), r0: 6, r1: 30, dur: 0.7 });
      if (t >= ta) this.ripple(x1, yA, Math.min(0.7, t - ta), { color: this.c('sun'), r0: 6, r1: 30, dur: 0.7 });
    }
    // la riga del tempo: quando arriva ogni colpo
    const ty = H * 0.7, tx0 = 30, tx1 = W - 20, T = (s) => tx0 + ((tx1 - tx0) * s) / 3.2;
    this.line([[tx0, ty], [tx1, ty]], { color: this.c('muted'), width: 1.4 });
    for (let s = 0; s <= 3; s++) { this.line([[T(s), ty], [T(s), ty + 6]], { color: this.c('muted'), width: 1.2 }); this.text(`${s} s`, T(s), ty + 18, { size: 9.5, align: 'center', color: this.c('muted'), mono: true }); }
    if (this.live) {
      const now = Math.max(0, Math.min(t, 3.2));
      this.line([[T(now), ty - 10], [T(now), ty + 2]], { color: this.c('chalk'), width: 2 });
      if (p.mezzo !== 'aria' && t >= tm) { this.ball(T(tm), ty, 5, { color: this.c('mint'), fill: 1, width: 1, shine: false }); this.text(i18n('1° colpo'), T(tm), ty - 14, { size: 10, align: 'center', weight: 700, color: this.c('mint') }); }
      if (t >= ta) { this.ball(T(ta), ty, 5, { color: this.c('sun'), fill: 1, width: 1, shine: false }); this.text(p.mezzo === 'aria' ? i18n('il colpo') : i18n('2° colpo'), T(ta), ty - 14, { size: 10, align: 'center', weight: 700, color: this.c('sun') }); }
    }
    const rows = [[E ? i18n('Un tubo lungo 1 km, colpito con un martello') : i18n('tubo lungo 1 km, colpito a un capo'), this.c('chalk'), 700]];
    if (this.result) {
      if (E) rows.push([p.mezzo === 'ferro' ? i18n('due colpi: prima dal ferro, poi dall’aria') : p.mezzo === 'acqua' ? i18n('due colpi: prima dall’acqua, poi dall’aria') : i18n('un colpo solo, dall’aria'), this.c('mint'), 700]);
      else rows.push([p.mezzo === 'ferro' ? i18n('ferro: {a} s; aria: {b} s', { a: nice(tm, 2), b: nice(ta, 2) }) : p.mezzo === 'acqua' ? i18n('acqua: {a} s; aria: {b} s', { a: nice(tm, 2), b: nice(ta, 2) }) : i18n('aria: {b} s', { b: nice(ta, 2) }), this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- una canna del flauto di Pan ----------
  drawFlute() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const fp = pipeF(p.L), top = 70, sc = (H - top - 50) / 40, len = p.L * sc, cx = W * 0.3, hw = 13, t = this.tt;
    // il righello dei centimetri
    const rx = cx - hw - 34;
    this.line([[rx, top], [rx, top + 40 * sc]], { color: this.c('muted'), width: 1.2 });
    for (let k = 0; k <= 40; k += 5) { this.line([[rx, top + k * sc], [rx + (k % 10 ? 4 : 7), top + k * sc]], { color: this.c('muted'), width: 1.2 }); if (k % 10 === 0) this.text(`${k}`, rx - 4, top + k * sc + 4, { size: 9.5, align: 'right', color: this.c('muted'), mono: true }); }
    this.text('cm', rx - 4, top - 8, { size: 9.5, align: 'right', color: this.c('muted'), mono: true });
    // l'onda dentro la canna: ferma in fondo (chiuso), più ampia all'imboccatura (aperta)
    const A = (y) => Math.sin((Math.PI / 2) * ((top + len - y) / len));
    if (this.live) {
      for (const sg of [-1, 1]) {
        const pts = [];
        for (let k = 0; k <= 40; k++) { const y = top + (len * k) / 40; pts.push([cx + sg * (hw + 5 + 12 * A(y)), y]); }
        this.line(pts, { color: this.c('muted'), width: 1.2, dash: [3, 3] });
      }
      g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.75;
      const wob = Math.sin(this.clock * 9);
      for (let k = 0; k < 12; k++) for (let j = -1; j <= 1; j++) {
        const y0 = top + (len * (k + 0.5)) / 12, y = y0 + 5 * A(y0) * wob;
        g.beginPath(); g.arc(cx + j * 6, y, 1.7, 0, TWO_PI); g.fill();
      }
      g.restore();
      if (this.running) this.arrow(cx + 56, top - 24, cx + 10, top - 4, { color: this.c('sky'), width: 2.2, head: 7 });
    }
    this.line([[cx - hw, top], [cx - hw, top + len], [cx + hw, top + len], [cx + hw, top]], { color: this.c('sun'), width: 3.2 });
    // l'accordatore: la lancetta sta nel verde quando la canna suona la nota del cartellino
    const gx = W * 0.7, gyy = H * 0.42, R = Math.min(62, W * 0.2);
    if (p.meta > 0) {
      const Lg = pipeL(p.meta), cents = 1200 * Math.log2(fp / p.meta), tolC = 1200 * Math.log2(Lg / Math.max(1, Lg - 0.5));
      const ang = (c) => -Math.PI / 2 + (Math.max(-200, Math.min(200, c)) / 200) * 1.2;
      g.save(); g.lineWidth = 6; g.lineCap = 'butt';
      g.strokeStyle = this.c('edge'); g.beginPath(); g.arc(gx, gyy, R, ang(-200), ang(200)); g.stroke();
      g.strokeStyle = this.c('mint'); g.beginPath(); g.arc(gx, gyy, R, ang(-tolC), ang(tolC)); g.stroke(); g.restore();
      this.text(i18n('troppo grave'), gx - R - 4, gyy + 16, { size: 10, align: 'center', color: this.c('muted') });
      this.text(i18n('troppo acuto'), gx + R + 4, gyy + 16, { size: 10, align: 'center', color: this.c('muted') });
      if (this.live && t >= 1) {
        const a = ang(cents), ok = Math.abs(p.L - Lg) <= 0.5;
        this.line([[gx, gyy], [gx + Math.cos(a) * (R - 8), gyy + Math.sin(a) * (R - 8)]], { color: this.c(ok ? 'mint' : 'coral'), width: 3 });
      }
      this.ball(gx, gyy, 4, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    }
    const rows = [[E ? i18n('Canna lunga {L} cm', { L: nice(p.L, 1) }) : i18n('L = {L} cm: f = v / 4L = {f} Hz', { L: nice(p.L, 1), f: Math.round(fp) }), this.c('chalk'), 700]];
    if (p.meta > 0) rows.push([E ? i18n('il cartellino dice: {m} vibrazioni al secondo', { m: p.meta }) : i18n('cartellino: {m} Hz', { m: p.meta }), this.c('sun'), 700]);
    if (this.result && p.meta > 0) {
      const Lg = pipeL(p.meta), ok = Math.abs(p.L - Lg) <= 0.5;
      rows.push([ok ? i18n('intonata!') : p.L > Lg ? i18n('troppo grave: accorcia la canna') : i18n('troppo acuta: allunga la canna'), this.c(ok ? 'mint' : 'coral'), 700]);
    } else if (this.result) rows.push([E ? i18n('la canna vibra {f} volte al secondo', { f: Math.round(fp) }) : i18n('la canna è lunga un quarto d’onda'), this.c('mint'), 700]);
    this.box(rows);
  }

  // un astronauta: casco tondo con il vetro, tuta, zaino
  astronaut(x, y, dir = 1) {
    const g = this.ctx;
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.85;
    g.fillRect(x - 10, y + 12, 20, 26); g.fillRect(dir > 0 ? x - 16 : x + 11, y + 14, 5, 18); g.restore();
    this.line([[x - 6, y + 38], [x - 7, y + 54]], { color: this.c('chalk'), width: 5 });
    this.line([[x + 6, y + 38], [x + 7, y + 54]], { color: this.c('chalk'), width: 5 });
    this.line([[x + 9 * dir, y + 18], [x + 12 * dir, y + 34]], { color: this.c('chalk'), width: 4 });
    this.ball(x, y, 13, { color: this.c('chalk'), fill: 0.25, width: 2.4, shine: false });
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.55; g.beginPath(); g.ellipse(x + 3 * dir, y, 8, 6, 0, 0, TWO_PI); g.fill(); g.restore();
  }

  // ---------- l'esplosione: nello spazio o sulla Terra ----------
  drawSpace() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const space = p.dove === 'spazio', tau = this.tt - 0.3, gy = H * 0.74, tA = D_SPAZIO / V;
    const ex = W - 64, ey = space ? H * 0.32 : gy - 36, bob = space ? 3 * Math.sin(this.clock * 1.3) : 0;
    const ax1 = 54, ax2 = p.caschi ? 81 : 108, ay = (space ? H * 0.5 : gy - 54) + bob;
    if (space) {
      g.save(); g.fillStyle = this.c('chalk');
      for (let i = 0; i < 46; i++) { g.globalAlpha = 0.25 + 0.5 * rnd(i + 5); g.beginPath(); g.arc(rnd(i) * W, rnd(i + 50) * H, 0.6 + rnd(i + 9), 0, TWO_PI); g.fill(); }
      g.restore();
    } else {
      this.ground(gy);
      this.line([[ax1, gy + 14], [ex, gy + 14]], { color: this.c('muted'), width: 1.2 });
      this.line([[ax1, gy + 8], [ax1, gy + 20]], { color: this.c('muted'), width: 1.2 });
      this.line([[ex, gy + 8], [ex, gy + 20]], { color: this.c('muted'), width: 1.2 });
      this.text('686 m', (ax1 + ex) / 2, gy + 30, { size: 10.5, align: 'center', color: this.c('muted'), mono: true });
    }
    // l'esplosione: si vede subito, in tutti e due i casi
    if (this.live && tau >= 0) {
      const a = Math.min(1.2, tau);
      this.burst(ex, ey, a, { color: this.c('orange'), n: 14, r: 56, dur: 1.2 });
      if (tau < 0.5) this.ball(ex, ey, 26 * (1 - tau * 1.6) + 4, { color: this.c('sun'), fill: 0.7, width: 2, shine: false });
    } else this.ball(ex, ey, 14, { color: this.c('muted'), fill: 0.5, width: 2, shine: false });
    // il suono: sulla Terra corre nell'aria a 343 m/s; nello spazio non parte nemmeno
    const heard = !space && this.live && tau >= tA;
    if (!space && this.live && tau > 0 && !heard) {
      const r = ((ex - ax1) * tau) / tA;
      g.save(); g.beginPath(); g.rect(0, 0, W, gy); g.clip(); g.strokeStyle = this.c('sun'); g.lineWidth = 2.2;
      for (let k = 0; k < 3; k++) { const rr = r - k * 10; if (rr > 0) { g.globalAlpha = 0.7 - k * 0.2; g.beginPath(); g.arc(ex, ey, rr, Math.PI * 0.5, Math.PI * 1.5); g.stroke(); } }
      g.restore();
    }
    if (space && this.live && tau > 0.4) this.text(E ? i18n('qui non c’è aria') : i18n('niente aria: il suono non parte'), (ax2 + ex) / 2 + 10, ey + 58, { size: 11, align: 'center', color: this.c('muted') });
    this.astronaut(ax1, ay, 1);
    this.astronaut(ax2, ay, -1);
    if (heard) this.hears(ax2 + 14, ay, Math.max(0.3, 1 - (tau - tA) / 1.5));
    // la voce: passa da un casco all'altro solo se si toccano (o se c'è aria)
    const talk = this.live && this.tt >= 0.9 && this.tt < 2.1;
    if (talk && (p.caschi || !space)) {
      g.save(); g.strokeStyle = this.c('mint'); g.lineWidth = 1.8;
      for (let i = 1; i <= 2; i++) { g.beginPath(); g.arc(ax1 + 13, ay, 4 + i * 4, -0.7, 0.7); g.stroke(); }
      g.restore();
      this.text(i18n('Mi senti?'), ax1 - 6, ay - 24, { size: 11, weight: 700, color: this.c('mint') });
    } else if (talk) this.text(i18n('Mi senti?'), ax1 - 6, ay - 24, { size: 11, weight: 700, color: this.c('muted') });
    const rows = [[space ? (E ? i18n('Nello spazio') : i18n('nello spazio: vuoto, niente aria')) : (E ? i18n('Sulla Terra, a 686 metri') : i18n('sulla Terra: esplosione a 686 m')), this.c('chalk'), 700]];
    if (p.caschi) rows.push([i18n('caschi a contatto'), this.c('muted'), 500]);
    if (this.result) {
      rows.push([space ? (E ? i18n('l’esplosione si vede, ma non si sente') : i18n('senza un mezzo il suono non si propaga')) : (E ? i18n('il BUM arriva dopo 2 secondi') : i18n('il suono arriva dopo 686 / 343 = 2 s')), this.c(space ? 'coral' : 'sun'), 700]);
      if (p.caschi && space) rows.push([E ? i18n('la voce passa da un casco all’altro!') : i18n('la voce passa attraverso i caschi, che sono solidi'), this.c('mint'), 700]);
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
