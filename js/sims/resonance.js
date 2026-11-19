// La risonanza (O04). Tre modi:
//   - 'altalena': un'altalena lunga 1 m (un'oscillazione ogni 2 secondi) spinta in avanti ogni Tp secondi. Se le spinte
//     arrivano con il suo ritmo (o ogni due oscillazioni), ognuna aggiunge energia e l'altalena sale sempre di più;
//     fuori tempo, a volte aiutano e a volte frenano. Sotto, l'angolo nel tempo.
//   - 'tappeto': un bambino di massa m su un tappeto elastico (k = 4000 N/m), che si dà una spinta ogni Tp secondi.
//     Il periodo naturale è T = 2π·√(m/k): con quel ritmo i salti crescono.
//   - 'bicchiere': un bicchiere di cristallo che suona a 880 Hz; un altoparlante gli manda una nota di frequenza f, con
//     volume vol. Vibra tanto solo vicino alla sua nota: con la nota giusta e abbastanza volume si rompe. Il grafico sotto
//     ricorda tutte le prove fatte nel livello: è la curva di risonanza.
// Risultato: altalena { Tp, A (gradi) }; tappeto { m, Tp, T0, A (cm) }; bicchiere { f, vol, livello, rotto }
import { t as i18n } from '../i18n.js';
import { note, boom } from '../audio.js';
import { Sim, fmt, clamp01 } from './base.js';

const G = 9.81, L_SW = 1, W0_SW = Math.sqrt(G / L_SW), T0_SW = (2 * Math.PI) / W0_SW, GAM_SW = 0.1, KICK_SW = 0.25, DUR_SW = 10.5;
const K_TR = 4000, GAM_TR = 0.6, KICK_TR = 0.2, DUR_TR = 6;
const F0_GL = 880, Q_GL = 60, BREAK = 3.5, TAU_GL = 0.6, DUR_GL = 3;
export const periodTr = (m) => 2 * Math.PI * Math.sqrt(m / K_TR);
// quanto vibra il bicchiere (1 alla sua nota), per una forza di frequenza f
export const glassResp = (f) => { const r = f / F0_GL; return 1 / Q_GL / Math.sqrt((1 - r * r) ** 2 + (r / Q_GL) ** 2); };
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };

export class Resonance extends Sim {
  static tall = true;
  static controls = {
    Tp: { label: 'Una spinta ogni', min: 0.5, max: 4, step: 0.5, unit: 's' },
    f: { label: 'Frequenza della nota', labelE: 'Vibrazioni al secondo', min: 600, max: 1200, step: 10, unit: 'Hz', unitE: '' },
    vol: { label: 'Volume', min: 1, max: 5, step: 1, unit: '' },
  };

  defaults() { return { mode: 'altalena', Tp: 2, m: 36, f: 700, vol: 3, lens: 's' }; }

  init() {
    if (this.snd) this.snd.stop();
    this.snd = null;
    this.x = 0; this.v = 0; this.nk = 0; this.amax = 0; this.kickAt = -9;
    this.trace = [];
    this.lev = 0; this.broke = -1;
    this.hist = this.hist || [];
  }

  get dur() { const m = this.params.mode; return m === 'tappeto' ? DUR_TR : m === 'bicchiere' ? DUR_GL : DUR_SW; }
  get live() { return this.running || !!this.result; }

  step(dt) {
    const p = this.params, t = this.t;
    if (p.mode === 'bicchiere') {
      if (!this.snd && t > 0) this.snd = note(p.f, { vol: 0.02 * p.vol, dur: 2.6 }) || { stop() {} };
      const ss = p.vol * glassResp(p.f);
      this.lev = this.broke >= 0 ? 0 : ss * (1 - Math.exp(-t / TAU_GL));
      if (this.broke < 0 && this.lev >= BREAK) { this.broke = t; if (this.snd) this.snd.stop(); boom({ white: true, cut: 7000, dur: 0.6, vol: 0.25 }); }
    } else {
      // un oscillatore smorzato, con una spinta in avanti ogni Tp secondi (la prima dopo 0,3 s)
      const sw = p.mode === 'altalena', w0 = sw ? W0_SW : Math.sqrt(K_TR / p.m), gam = sw ? GAM_SW : GAM_TR;
      if (t >= 0.3 + this.nk * p.Tp && t < this.dur - 0.4) { this.v += sw ? KICK_SW : KICK_TR; this.nk++; this.kickAt = t; }
      const acc = sw ? -w0 * w0 * Math.sin(this.x) - gam * this.v : -w0 * w0 * this.x - gam * this.v;
      this.v += acc * dt; this.x += this.v * dt;
      this.amax = Math.max(this.amax, Math.abs(this.x));
      if (!this.trace.length || t - this.trace[this.trace.length - 1][0] >= 0.03) this.trace.push([t, this.x]);
    }
    if (t >= this.dur) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'bicchiere') {
      const liv = Math.min(BREAK, p.vol * glassResp(p.f));
      this.hist = this.hist.filter((h) => h[0] !== p.f || h[2] !== p.vol);
      this.hist.push([p.f, liv, p.vol]);
      return this.finish({ f: p.f, vol: p.vol, livello: liv, rotto: this.broke >= 0 });
    }
    if (p.mode === 'tappeto') return this.finish({ m: p.m, Tp: p.Tp, T0: periodTr(p.m), A: this.amax * 100 });
    this.finish({ Tp: p.Tp, A: (this.amax * 180) / Math.PI });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'bicchiere') this.drawGlass();
    else if (m === 'tappeto') this.drawTrampoline();
    else this.drawSwing();
  }

  // il grafico dello spostamento nel tempo: si vede se le oscillazioni crescono
  graph(y0, y1, scale, tmax, label) {
    const W = this.W, x0 = 30, x1 = W - 16, ym = (y0 + y1) / 2;
    this.line([[x0, ym], [x1, ym]], { color: this.c('edge'), width: 1.2 });
    this.line([[x0, y0], [x0, y1]], { color: this.c('edge'), width: 1.2 });
    this.text(label, x0 + 6, y0 + 2, { size: 10.5, color: this.c('muted') });
    this.text(i18n('tempo →'), x1, y1 + 14, { size: 10, align: 'right', color: this.c('muted') });
    if (this.trace.length > 1) this.line(this.trace.map(([t, x]) => [x0 + ((x1 - x0) * t) / tmax, ym - Math.max(-1, Math.min(1, x * scale)) * ((y1 - y0) / 2)]), { color: this.c('sky'), width: 2 });
  }

  // un omino che spinge, rivolto a destra
  pusher(x, gy, push) {
    const c = this.c('chalk');
    this.ball(x, gy - 46, 6, { color: c, fill: 0.2, width: 2, shine: false });
    this.line([[x, gy - 40], [x + 2, gy - 18]], { color: c, width: 2.4 });
    this.line([[x - 6, gy], [x + 2, gy - 18], [x + 9, gy]], { color: c, width: 2.4 });
    this.line([[x + 1, gy - 34], [x + (push ? 22 : 12), gy - 34 + (push ? -2 : 6)]], { color: c, width: 2.2 });
  }

  // ---------- l'altalena ----------
  drawSwing() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.55, top = 54, Lp = Math.min(H * 0.36, 150), gy = top + Lp + 40;
    const th = this.live ? this.x : 0, sx = cx + Math.sin(th) * Lp, sy = top + Math.cos(th) * Lp;
    // il telaio, le corde, il seggiolino con il bambino
    this.line([[cx - 70, gy], [cx - 46, top - 8], [cx + 46, top - 8], [cx + 70, gy]], { color: this.c('muted'), width: 4 });
    this.line([[cx, top - 8], [sx, sy]], { color: this.c('chalk'), width: 2 });
    this.line([[sx - 16 * Math.cos(th), sy + 16 * Math.sin(th)], [sx + 16 * Math.cos(th), sy - 16 * Math.sin(th)]], { color: this.c('orange'), width: 6 });
    this.ball(sx, sy - 30, 7, { color: this.c('sun'), fill: 0.6, width: 2, shine: false });
    this.line([[sx, sy - 23], [sx, sy - 4]], { color: this.c('sun'), width: 3 });
    this.ground(gy, { x0: 10, x1: W - 10 });
    // chi spinge: sta dietro, a sinistra; la mano si allunga a ogni spinta
    const push = this.running && this.t - this.kickAt < 0.25;
    this.pusher(cx - 40, gy, push);
    if (push) this.text(i18n('spinta!'), cx - 56, gy - 62, { size: 11, weight: 700, color: this.c('mint') });
    this.graph(gy + 30, this.H - 26, 1 / 0.6, DUR_SW, E ? i18n('quanto sale l’altalena') : i18n('angolo dell’altalena'));
    const rows = [[E ? i18n('Una spinta ogni {t} secondi', { t: nice(p.Tp, 1) }) : i18n('spinta ogni {t} s; periodo naturale {T} s', { t: nice(p.Tp, 1), T: nice(T0_SW, 1) }), this.c('chalk'), 700]];
    if (E) rows.push([i18n('l’altalena va e torna in 2 secondi'), this.c('muted'), 500]);
    if (this.result) {
      // in tempo: una spinta a ogni oscillazione (risonanza), o una ogni due (cresce, ma più piano)
      const A = Math.round(this.result.A), n = Math.round(p.Tp / T0_SW), inPhase = n >= 1 && Math.abs(p.Tp / T0_SW - n) < 0.05;
      if (inPhase && n === 1) rows.push([E ? i18n('in risonanza: sempre più in alto, fino a {a} gradi!', { a: A }) : i18n('risonanza: ampiezza {a}°', { a: A }), this.c('mint'), 700]);
      else if (inPhase) rows.push([E ? i18n('una spinta ogni due dondolii: sale, ma più piano ({a} gradi)', { a: A }) : i18n('in fase ogni {n} oscillazioni: ampiezza {a}°', { n, a: A }), this.c('sun'), 700]);
      else rows.push([E ? i18n('le spinte arrivano fuori tempo: sale solo di {a} gradi', { a: A }) : i18n('fuori risonanza: ampiezza {a}°', { a: A }), this.c('coral'), 700]);
    }
    this.box(rows);
  }

  // ---------- il tappeto elastico ----------
  drawTrampoline() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.5, mat = H * 0.4, s = 600, y = this.live ? this.x : 0, T0 = periodTr(p.m);
    // il telaio e il telo: si abbassa quando il bambino lo schiaccia
    const dip = Math.max(0, -y * s);
    this.line([[cx - 90, mat + 50], [cx - 80, mat]], { color: this.c('muted'), width: 4 });
    this.line([[cx + 90, mat + 50], [cx + 80, mat]], { color: this.c('muted'), width: 4 });
    this.ground(mat + 50, { x0: 10, x1: W - 10 });
    const g = this.ctx;
    g.save(); g.strokeStyle = this.c('sky'); g.lineWidth = 4; g.beginPath(); g.moveTo(cx - 80, mat); g.quadraticCurveTo(cx, mat + 2 * dip, cx + 80, mat); g.stroke(); g.restore();
    // il bambino: i piedi sul telo, o in aria quando sale
    const fy = mat + dip - Math.max(0, y * s);
    this.ball(cx, fy - 48, 8, { color: this.c('sun'), fill: 0.6, width: 2, shine: false });
    this.line([[cx, fy - 40], [cx, fy - 16]], { color: this.c('sun'), width: 3 });
    this.line([[cx - 8, fy], [cx, fy - 16], [cx + 8, fy]], { color: this.c('sun'), width: 3 });
    this.line([[cx - 12, fy - 36], [cx, fy - 30], [cx + 12, fy - 36]], { color: this.c('sun'), width: 2.6 });
    if (this.running && this.t - this.kickAt < 0.15) this.text(i18n('spinta!'), cx + 26, fy - 30, { size: 11, weight: 700, color: this.c('mint') });
    this.graph(mat + 76, H - 26, 1 / 0.13, DUR_TR, E ? i18n('quanto salta il bambino') : i18n('spostamento del bambino'));
    // il periodo naturale si scopre solo provando: lo si dice dopo, nel risultato
    const rows = [[E ? i18n('Un bambino di {m} kg', { m: p.m }) : i18n('m = {m} kg, k = 4000 N/m', { m: p.m }), this.c('chalk'), 700],
      [E ? i18n('un salto ogni {t} secondi', { t: nice(p.Tp, 2) }) : i18n('una spinta ogni {t} s', { t: nice(p.Tp, 2) }), this.c('muted'), 500]];
    if (this.result) {
      const ok = Math.abs(p.Tp - T0) <= 0.03, A = Math.round(this.result.A);
      rows.push([ok ? (E ? i18n('in risonanza: salti sempre più alti!') : i18n('risonanza: ampiezza {a} cm', { a: A })) : (E ? i18n('le spinte arrivano fuori tempo') : i18n('fuori risonanza: ampiezza {a} cm', { a: A })), this.c(ok ? 'mint' : 'coral'), 700]);
    }
    this.box(rows);
  }

  // ---------- il bicchiere di cristallo ----------
  drawGlass() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.62, top = 70, bh = 76, bw = 34, gone = this.broke >= 0, lv = this.live ? this.lev : 0;
    // l'altoparlante e le onde della nota
    const sx = 40, sy = top + 50;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.5; g.fillRect(sx - 26, sy - 18, 16, 36); g.restore();
    this.line([[sx - 10, sy - 10], [sx + 4, sy - 28], [sx + 4, sy + 28], [sx - 10, sy + 10]], { color: this.c('chalk'), width: 2.2 });
    if (this.running) {
      g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2;
      for (let k = 0; k < 4; k++) { const a = (this.t * 1.4 + k / 4) % 1; g.globalAlpha = (1 - a) * 0.25 * p.vol; g.beginPath(); g.arc(sx + 6, sy, 14 + a * (cx - sx - 40), -0.5, 0.5); g.stroke(); }
      g.restore();
    }
    if (!gone) {
      // la coppa vibra: il bordo si allarga e si stringe, tanto più quanto vibra
      const wob = Math.min(10, lv * 2.4) * Math.sin(this.clock * 70);
      g.save(); g.strokeStyle = this.c('sky'); g.lineWidth = 2.6; g.fillStyle = this.c('sky'); g.globalAlpha = 0.9;
      g.beginPath(); g.moveTo(cx - bw - wob, top); g.quadraticCurveTo(cx - bw - wob * 0.6, top + bh, cx, top + bh); g.quadraticCurveTo(cx + bw + wob * 0.6, top + bh, cx + bw + wob, top); g.stroke();
      g.globalAlpha = 0.08; g.fill(); g.restore();
      this.line([[cx, top + bh], [cx, top + bh + 50]], { color: this.c('sky'), width: 3 });
      this.line([[cx - 26, top + bh + 52], [cx + 26, top + bh + 52]], { color: this.c('sky'), width: 4 });
    } else {
      // i cocci
      const a = Math.min(1.5, this.t - this.broke);
      this.burst(cx, top + bh * 0.5, a, { color: this.c('sky'), n: 16, r: 70, dur: 1.5 });
      this.line([[cx, top + bh + 18], [cx, top + bh + 50]], { color: this.c('sky'), width: 3 });
      this.line([[cx - 26, top + bh + 52], [cx + 26, top + bh + 52]], { color: this.c('sky'), width: 4 });
    }
    // quanto vibra adesso, rispetto a quanto serve per romperlo
    const mx = W - 22, my0 = top - 6, mh = bh + 58;
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 1.5; g.strokeRect(mx - 6, my0, 12, mh);
    const fr = clamp01((gone ? BREAK : lv) / BREAK);
    g.fillStyle = this.c(fr >= 1 ? 'coral' : 'mint'); g.fillRect(mx - 5, my0 + mh * (1 - fr), 10, mh * fr); g.restore();
    this.line([[mx - 10, my0], [mx + 10, my0]], { color: this.c('coral'), width: 2 });
    // la curva di risonanza: tutte le prove del livello
    const gy0 = top + bh + 84, gy1 = H - 34, gx0 = 34, gx1 = W - 16, X = (f) => gx0 + ((f - 600) / 600) * (gx1 - gx0), Y = (l) => gy1 - (Math.min(BREAK, l) / BREAK) * (gy1 - gy0);
    if (gy1 - gy0 > 40) {
      this.line([[gx0, gy1], [gx1, gy1]], { color: this.c('edge'), width: 1.2 });
      this.line([[gx0, gy0], [gx0, gy1]], { color: this.c('edge'), width: 1.2 });
      this.line([[gx0, gy0], [gx1, gy0]], { color: this.c('coral'), width: 1, dash: [3, 4], alpha: 0.6 });
      this.text(E ? i18n('quanto vibra il bicchiere') : i18n('vibrazione del bicchiere'), gx0 + 6, gy0 + 12, { size: 10.5, color: this.c('muted') });
      for (const f of [600, 900, 1200]) this.text(String(f), X(f), gy1 + 14, { size: 9.5, align: 'center', color: this.c('muted'), mono: true });
      this.text(E ? i18n('vibrazioni al secondo →') : i18n('frequenza, Hz →'), gx1, gy1 + 26, { size: 10, align: 'right', color: this.c('muted') });
      const pts = this.hist.slice().sort((a, b) => a[0] - b[0]);
      for (const [f, l, v] of pts) this.ball(X(f), Y(l), 3.6, { color: this.c(l >= BREAK ? 'coral' : 'sun'), fill: 1, width: 1, shine: false, alpha: v === p.vol ? 1 : 0.45 });
      const same = pts.filter((h) => h[2] === p.vol);
      if (same.length > 1) this.line(same.map(([f, l]) => [X(f), Y(l)]), { color: this.c('sun'), width: 1.4, alpha: 0.6 });
    }
    const rows = [[E ? i18n('Vibrazioni al secondo: {f}; volume {a}', { f: p.f, a: p.vol }) : i18n('nota: {f} Hz, volume {a}; il bicchiere suona a 880 Hz', { f: p.f, a: p.vol }), this.c('chalk'), 700]];
    if (this.result) {
      const pc = Math.round((Math.min(BREAK, this.result.livello) / BREAK) * 100);
      rows.push(this.result.rotto ? [E ? i18n('il bicchiere si è rotto!') : i18n('risonanza: il bicchiere si rompe'), this.c('coral'), 700] : [E ? (pc >= 50 ? i18n('vibra tanto, ma resiste') : i18n('vibra appena')) : i18n('vibrazione: {p}% di quella che lo rompe', { p: pc }), this.c('mint'), 700]);
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
