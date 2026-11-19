// Cariche e campi (E01). Sette modi:
//   - 'pendoli': due cose appese a un filo, dopo lo strofinio. Due palloncini (tutti e due negativi) si respingono; il
//     palloncino e la lana (negativo e positivo) si attirano; i pezzetti di carta, che non sono carichi, saltano lo stesso
//     sul palloncino: le loro cariche si spostano un po', le positive verso il palloncino.
//   - 'strofina': il palloncino strofinato sulla lana. A ogni passata 25 miliardi di elettroni passano dalla lana al
//     palloncino (4 nC): il palloncino diventa negativo, la lana positiva, e in tutto la carica resta zero.
//   - 'elettroscopio': una sfera carica tocca l'elettroscopio con una barra di rame, di plastica o di vetro. Solo nel rame,
//     un conduttore, gli elettroni corrono: le due foglioline si caricano allo stesso modo e si aprono.
//   - 'coulomb': due palline cariche (q₁ = 1 µC, q₂ da 1 a 3 µC) a r centimetri: F = k·q₁·q₂/r², uguale e opposta sulle due.
//   - 'campo': le linee del campo elettrico intorno a una carica positiva, a una negativa, a una positiva e una negativa,
//     a due positive. Una piccola carica di prova sente la forza lungo la linea che passa da lei.
//   - 'pallina': la pallina volante del parco. In un tubo di vetro una pallina carica (q) sta sopra un'altra carica
//     (Q = 0,1 µC) e galleggia all'altezza in cui la spinta elettrica è uguale al peso (P = 0,009 N): h = √(k·Q·q/P).
//   - 'auto': il fulmine colpisce un'auto con le gomme, un'auto senza gomme o un'auto di plastica. Se la carrozzeria è di
//     metallo le cariche corrono fuori e dentro il campo resta zero (la gabbia di Faraday): le gomme non c'entrano.
// Risultato: pendoli { coppia, forza }; strofina { giri, n, q }; elettroscopio { barra, aperte };
//            coulomb { dist, q2, segno, F }; campo { conf }; pallina { h, q, heq, galleggia }; auto { veicolo, sicuro }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

const RAD = Math.PI / 180, K = 9e9;
// la forza fra q₁ = 1 µC e q₂ (in µC) a r centimetri, in newton
export const coulomb = (q2, r) => (K * 1e-6 * q2 * 1e-6) / (r / 100) ** 2;
// la pallina volante: Q in basso e il peso P della pallina; l'altezza a cui galleggia, in centimetri (q in µC)
export const QBASSO = 0.1, PESO = 0.009;
export const floatAt = (q) => 100 * Math.sqrt((K * QBASSO * 1e-6 * q * 1e-6) / PESO);
export const spinta = (q, h) => (K * QBASSO * 1e-6 * q * 1e-6) / (h / 100) ** 2;
// a ogni passata sulla lana passano 25 miliardi di elettroni: 25·10⁹ × 1,6·10⁻¹⁹ C = 4 nC
export const PER_GIRO = 25;
const DUR = { pendoli: 1.6, elettroscopio: 1.8, coulomb: 1.2, campo: 1.6, pallina: 1.3, auto: 2.4 };
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const CONF = { piu: [[0.5, 1]], meno: [[0.5, -1]], dipolo: [[0.32, 1], [0.68, -1]], due: [[0.32, 1], [0.68, 1]] };

export class Charges extends Sim {
  static tall = true;
  static controls = {
    coppia: { label: 'Che cosa avvicini', type: 'select', options: [['palloncini', 'due palloncini'], ['lana', 'palloncino e lana'], ['carta', 'palloncino e carta']] },
    giri: { label: 'Passate sulla lana', min: 0, max: 10, step: 1, unit: '' },
    barra: { label: 'La barra', type: 'select', options: [['rame', 'rame'], ['plastica', 'plastica'], ['vetro', 'vetro']] },
    dist: { label: 'Distanza', min: 4, max: 12, step: 1, unit: 'cm' },
    q2: { label: 'Carica della seconda pallina', labelE: 'Cariche sulla seconda pallina', min: 1, max: 3, step: 1, unit: 'µC', unitE: '' },
    segno: { label: 'Le cariche', type: 'select', options: [['uguali', 'uguali'], ['opposte', 'opposte']] },
    conf: { label: 'Le cariche', type: 'select', options: [['piu', 'una +'], ['meno', 'una −'], ['dipolo', '+ e −'], ['due', 'due +']] },
    h: { label: 'Altezza della pallina', min: 4, max: 44, step: 1, unit: 'cm' },
    veicolo: { label: 'Il veicolo', type: 'select', options: [['auto', 'auto con le gomme'], ['cerchi', 'auto senza gomme'], ['plastica', 'auto di plastica']] },
  };

  defaults() { return { mode: 'pendoli', coppia: 'palloncini', giri: 5, barra: 'rame', dist: 8, q2: 1, segno: 'uguali', conf: 'piu', h: 20, q: 0.4, veicolo: 'auto', lens: 's' }; }

  get dur() { return this.params.mode === 'strofina' ? 0.9 + 0.3 * this.params.giri : DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params;
    switch (p.mode) {
      case 'strofina': return this.finish({ giri: p.giri, n: p.giri * PER_GIRO, q: p.giri * 4 });
      case 'elettroscopio': return this.finish({ barra: p.barra, aperte: p.barra === 'rame' });
      case 'coulomb': return this.finish({ dist: p.dist, q2: p.q2, segno: p.segno, F: Math.round(coulomb(p.q2, p.dist) * 100) / 100 });
      case 'campo': return this.finish({ conf: p.conf });
      case 'pallina': { const heq = floatAt(p.q); return this.finish({ h: p.h, q: p.q, heq: Math.round(heq * 10) / 10, galleggia: Math.abs(p.h - heq) <= 1 }); }
      case 'auto': return this.finish({ veicolo: p.veicolo, sicuro: p.veicolo !== 'plastica' });
      default: return this.finish({ coppia: p.coppia, forza: p.coppia === 'palloncini' ? 'repulsione' : 'attrazione' });
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'strofina') this.drawRub();
    else if (m === 'elettroscopio') this.drawScope();
    else if (m === 'coulomb') this.drawCoulomb();
    else if (m === 'campo') this.drawField();
    else if (m === 'pallina') this.drawFloat();
    else if (m === 'auto') this.drawCar();
    else this.drawPendula();
  }

  box(rows) {
    if (!rows.length) return;
    const g = this.ctx;
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }

  // ---------- i pezzi del disegno ----------
  // una carica: un cerchietto con + (rosso) o − (azzurro)
  sym(x, y, s, { r = 6, alpha = 1 } = {}) {
    const g = this.ctx, col = s > 0 ? this.c('coral') : this.c('sky');
    g.save();
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.globalAlpha = alpha * 0.22; g.fillStyle = col; g.fill();
    g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = 1.6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x - r * 0.55, y); g.lineTo(x + r * 0.55, y);
    if (s > 0) { g.moveTo(x, y - r * 0.55); g.lineTo(x, y + r * 0.55); }
    g.stroke();
    g.restore();
  }

  // un'etichetta con un velo di sfondo, che si legge anche sopra le linee
  tag(str, x, y, { size = 11, align = 'left', weight = 500, color } = {}) {
    const g = this.ctx, t = i18n(String(str));
    g.font = `${weight} ${size}px Lexend, system-ui, sans-serif`;
    const w = g.measureText(t).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    g.save(); g.globalAlpha = 0.8; g.fillStyle = this.c('sim-bg'); g.fillRect(x0 - 3, y - size, w + 6, size + 5); g.restore();
    this.text(t, x, y, { size, align, weight, color });
  }

  // un palloncino: il nodo in basso (o in alto, se è appeso al filo)
  balloon(x, y, rx, ry, { hang = false } = {}) {
    const g = this.ctx, col = this.c('pink');
    g.save(); g.translate(x, y);
    g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    g.globalAlpha = 0.18; g.fillStyle = col; g.fill();
    g.globalAlpha = 1; g.strokeStyle = col; g.lineWidth = 2.5; g.stroke();
    const k = hang ? -1 : 1;
    g.beginPath(); g.moveTo(-4, k * (ry + 5)); g.lineTo(0, k * ry); g.lineTo(4, k * (ry + 5)); g.closePath(); g.stroke();
    g.globalAlpha = 0.5; g.strokeStyle = this.c('chalk'); g.lineWidth = 2;
    g.beginPath(); g.arc(0, 0, Math.min(rx, ry) * 0.62, Math.PI * 1.1, Math.PI * 1.4); g.stroke();
    g.restore();
  }

  // un pezzo di lana: un rettangolo arancione con la maglia a V
  wool(x, y, w, h) {
    const g = this.ctx, col = this.c('orange');
    g.save(); g.translate(x, y);
    g.globalAlpha = 0.16; g.fillStyle = col; g.fillRect(-w / 2, -h / 2, w, h);
    g.globalAlpha = 1; g.strokeStyle = col; g.lineWidth = 2.2; g.strokeRect(-w / 2, -h / 2, w, h);
    g.globalAlpha = 0.45; g.lineWidth = 1.2; g.beginPath();
    for (let yy = -h / 2 + 8; yy < h / 2 - 2; yy += 9) for (let xx = -w / 2 + 7; xx < w / 2 - 4; xx += 9) { g.moveTo(xx - 3, yy - 3); g.lineTo(xx, yy); g.lineTo(xx + 3, yy - 3); }
    g.stroke();
    g.restore();
  }

  // un piedistallo isolante: un'asta con la base
  stand(x, y0, y1) {
    this.line([[x, y0], [x, y1]], { color: this.c('muted'), width: 4 });
    this.line([[x - 18, y1], [x + 18, y1]], { color: this.c('muted'), width: 4 });
  }

  // ---------- palloncini, lana e carta appesi ----------
  drawPendula() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, k = easeOut(u);
    const top = H * 0.16, L = H * 0.36, rx = W * 0.075, ry = W * 0.095;
    this.line([[W * 0.16, top], [W * 0.84, top]], { color: this.c('muted'), width: 4 });
    const rows = [];
    if (p.coppia === 'carta') {
      // un palloncino solo, appeso sopra il tavolo con i pezzetti di carta
      const px = W * 0.5, by = top + L * 0.55 + ry, ty = H * 0.8;
      this.line([[px, top], [px, by - ry - 5]], { color: this.c('chalk'), width: 1.5 });
      this.balloon(px, by, rx, ry, { hang: true });
      [[-0.45, 0.35], [0, 0.55], [0.45, 0.35], [-0.25, 0.75], [0.25, 0.75]].forEach(([a, b]) => this.sym(px + a * rx, by + b * ry * 0.9, -1, { r: 5 }));
      this.line([[W * 0.14, ty], [W * 0.86, ty]], { color: this.c('chalk'), width: 3 });
      this.line([[W * 0.2, ty], [W * 0.2, H * 0.9]], { color: this.c('chalk'), width: 2.5 });
      this.line([[W * 0.8, ty], [W * 0.8, H * 0.9]], { color: this.c('chalk'), width: 2.5 });
      for (let i = 0; i < 7; i++) {
        const x0 = W * (0.24 + (0.52 * i) / 6), y0 = ty - 4, tx = px + (i - 3) * rx * 0.3, tyb = by + ry + 4 - Math.abs(i - 3) * 3;
        const kk = this.live && Math.abs(i - 3) < 3 ? easeOut(clamp01((u - 0.12 - Math.abs(i - 3) * 0.07) / 0.35)) : 0;
        const x = x0 + (tx - x0) * kk, y = y0 + (tyb - y0) * kk;
        g.save(); g.translate(x, y); g.rotate((i - 3) * 0.25 * (1 - kk));
        g.fillStyle = this.c('chalk'); g.globalAlpha = 0.85; g.fillRect(-5, -3, 10, 6);
        // nella carta le cariche si spostano un po': le positive verso il palloncino
        if (this.live) { g.globalAlpha = 1; g.fillStyle = this.c('coral'); g.fillRect(-4, -3, 8, 2); g.fillStyle = this.c('sky'); g.fillRect(-4, 1, 8, 2); }
        g.restore();
      }
      this.text(i18n('pezzetti di carta'), W * 0.5, H * 0.95, { size: 11.5, align: 'center', color: this.c('muted') });
      rows.push([i18n('Il palloncino e i pezzetti di carta'), this.c('chalk'), 700]);
      if (this.result) {
        if (E) rows.push([i18n('la carta non è carica, ma salta su!'), this.c('mint'), 500]);
        else rows.push([i18n('nella carta le cariche si spostano un po’:'), this.c('mint'), 500], [i18n('le + vicino al palloncino: si attirano'), this.c('mint'), 500]);
      }
    } else {
      const lana = p.coppia === 'lana', p1 = W * 0.4, p2 = W * 0.6;
      // repulsione: si allontanano di 20°; attrazione: si avvicinano fino a toccarsi
      const th = (lana ? -5.5 : 20) * RAD * (this.live ? k : 0), a1 = -th, a2 = th;
      const e1 = [p1 + L * Math.sin(a1), top + L * Math.cos(a1)], e2 = [p2 + L * Math.sin(a2), top + L * Math.cos(a2)];
      const c1 = [e1[0] + (ry + 5) * Math.sin(a1), e1[1] + (ry + 5) * Math.cos(a1)];
      const c2 = lana ? [e2[0] + W * 0.06 * Math.sin(a2), e2[1] + W * 0.06 * Math.cos(a2)] : [e2[0] + (ry + 5) * Math.sin(a2), e2[1] + (ry + 5) * Math.cos(a2)];
      this.line([[p1, top], e1], { color: this.c('chalk'), width: 1.5 });
      this.line([[p2, top], e2], { color: this.c('chalk'), width: 1.5 });
      this.balloon(c1[0], c1[1], rx, ry, { hang: true });
      const SP = [[-0.42, -0.25], [0.42, -0.25], [0, 0.05], [-0.38, 0.4], [0.38, 0.4]];
      SP.forEach(([a, b]) => this.sym(c1[0] + a * rx, c1[1] + b * ry, -1, { r: 5 }));
      if (lana) {
        this.wool(c2[0], c2[1], W * 0.13, W * 0.12);
        SP.forEach(([a, b]) => this.sym(c2[0] + a * W * 0.13 * 0.75, c2[1] + b * W * 0.1, 1, { r: 5 }));
      } else {
        this.balloon(c2[0], c2[1], rx, ry, { hang: true });
        SP.forEach(([a, b]) => this.sym(c2[0] + a * rx, c2[1] + b * ry, -1, { r: 5 }));
      }
      const ly = Math.max(c1[1], c2[1]) + ry + 22, mid = (c1[0] + c2[0]) / 2, close = c2[0] - c1[0] < 110;
      this.text(i18n('palloncino'), close ? mid - 8 : c1[0], ly, { size: 11.5, align: close ? 'right' : 'center', color: this.c('muted') });
      this.text(lana ? i18n('lana') : i18n('palloncino'), close ? mid + 8 : c2[0], ly, { size: 11.5, align: close ? 'left' : 'center', color: this.c('muted') });
      // le forze: in fuori se si respingono; se si attirano, dai lati esterni verso l'altro
      if (this.result) {
        const yA = Math.min(c1[1], c2[1]) - ry - 16;
        if (lana) {
          this.arrow(c1[0] - 34, yA, c1[0] - 6, yA, { color: this.c('orange'), width: 2.5 });
          this.arrow(c2[0] + 34, yA, c2[0] + 6, yA, { color: this.c('orange'), width: 2.5 });
        } else {
          this.arrow(c1[0], yA, c1[0] - 30, yA, { color: this.c('orange'), width: 2.5 });
          this.arrow(c2[0], yA, c2[0] + 30, yA, { color: this.c('orange'), width: 2.5 });
        }
      }
      rows.push([lana ? i18n('Il palloncino e la lana') : i18n('Due palloncini strofinati'), this.c('chalk'), 700]);
      if (this.result) {
        if (lana) rows.push([E ? i18n('uno − e uno +: si attirano!') : i18n('cariche opposte: si attirano'), this.c('mint'), 500]);
        else rows.push([E ? i18n('tutti e due −: si respingono!') : i18n('cariche uguali: si respingono'), this.c('mint'), 500]);
      }
    }
    this.box(rows);
  }

  // ---------- il palloncino strofinato sulla lana ----------
  drawRub() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', n = p.giri;
    const time = this.running ? this.t : this.result ? this.dur : 0, T = 0.3 * n;
    const wx = W * 0.34, wy = H * 0.68, ww = W * 0.5, wh = H * 0.22, rx = W * 0.125, ry = W * 0.155;
    const moved = this.live ? Math.min(n, Math.floor(time / 0.3 + 0.001)) : 0;
    this.wool(wx, wy, ww, wh);
    this.text(i18n('lana'), wx, wy + wh / 2 + 18, { size: 11.5, align: 'center', color: this.c('muted') });
    // le cariche della lana: dieci coppie + e −; ogni passata porta via un − (cioè 25 miliardi di elettroni)
    for (let i = 0; i < 10; i++) {
      const x = wx - ww * 0.36 + (i % 5) * ww * 0.18, y = wy - wh * 0.18 + Math.floor(i / 5) * wh * 0.38;
      this.sym(x - 7, y, 1, { r: 6 });
      if (i >= moved) this.sym(x + 7, y, -1, { r: 6 });
    }
    // il palloncino: avanti e indietro sulla lana, poi si sposta a destra
    let bx = W * 0.74, by = H * 0.34;
    if (this.live && time < T) { bx = wx + ww * 0.25 * Math.sin((2 * Math.PI * time) / 0.3); by = wy - wh / 2 - ry + 6; }
    else if (this.live && time < T + 0.4 && n > 0) { const kk = easeOut((time - T) / 0.4); bx = wx + (W * 0.74 - wx) * kk; by = wy - wh / 2 - ry + 6 + (H * 0.34 - (wy - wh / 2 - ry + 6)) * kk; }
    this.balloon(bx, by, rx, ry);
    const BP = [[-0.42, -0.5], [0.42, -0.5], [-0.5, 0.42], [0.5, 0.42]];
    BP.forEach(([a, b]) => { this.sym(bx + a * rx - 6, by + b * ry, 1, { r: 5.5 }); this.sym(bx + a * rx + 6, by + b * ry, -1, { r: 5.5 }); });
    for (let i = 0; i < moved; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.4;
      this.sym(bx + Math.cos(a) * rx * 0.42, by + Math.sin(a) * ry * 0.3, -1, { r: 5.5 });
    }
    if (!this.result) this.text(i18n('palloncino'), bx, by - ry - 12, { size: 11.5, align: 'center', color: this.c('muted') });
    const rows = [];
    if (!this.result) rows.push([E ? i18n('Strofina il palloncino sulla lana') : i18n('Palloncino e lana: + e − in pari'), this.c('chalk'), 700]);
    else if (n === 0) rows.push([i18n('Non l’hai strofinato'), this.c('chalk'), 700], [i18n('niente si sposta: tutti e due neutri'), this.c('mint'), 500]);
    else {
      rows.push([i18n('Strofinato {g} volte', { g: n }), this.c('chalk'), 700]);
      if (E) rows.push([i18n('il palloncino ha preso elettroni: è −'), this.c('sky'), 500], [i18n('la lana li ha persi: è +'), this.c('coral'), 500]);
      else rows.push([i18n('passano {n} miliardi di elettroni', { n: n * PER_GIRO }), this.c('chalk'), 500],
        [i18n('palloncino −{q} nC, lana +{q} nC', { q: n * 4 }), this.c('sky'), 500], [i18n('in tutto la carica resta zero'), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- l'elettroscopio ----------
  drawScope() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, k = easeOut(u);
    const conduce = p.barra === 'rame', gy = H * 0.86;
    const sx = W * 0.17, sy = H * 0.4, R = W * 0.075, kx = W * 0.66, kr = W * 0.035, hy = H * 0.64, leaf = H * 0.13;
    this.ground(gy);
    this.stand(sx, sy + R, gy);
    // la barra fra la sfera e la pallina dell'elettroscopio
    const col = { rame: this.c('orange'), plastica: this.c('pink'), vetro: this.c('sky') }[p.barra] || this.c('orange');
    this.line([[sx + R, sy], [kx - kr, sy]], { color: col, width: 7, alpha: p.barra === 'vetro' ? 0.55 : 0.9 });
    this.text(i18n('barra di {m}', { m: i18n(p.barra) }), (sx + kx) / 2, sy - 14, { size: 11.5, align: 'center', color: col });
    this.ball(sx, sy, R, { color: this.c('chalk'), fill: 0.12 });
    // l'elettroscopio: il vaso di vetro, l'asta e le foglioline
    g.save(); g.strokeStyle = this.c('sky'); g.globalAlpha = 0.6; g.lineWidth = 2;
    g.beginPath(); g.roundRect(W * 0.53, H * 0.5, W * 0.26, gy - H * 0.5, 10); g.stroke(); g.restore();
    this.line([[kx, sy + kr], [kx, hy]], { color: this.c('chalk'), width: 3 });
    this.ball(kx, sy, kr, { color: this.c('chalk'), fill: 0.12, shine: false });
    const phi = (3 + (conduce && this.live ? 30 * k : 0)) * RAD;
    [-1, 1].forEach((s) => this.line([[kx, hy], [kx + s * leaf * Math.sin(phi), hy + leaf * Math.cos(phi)]], { color: this.c('sun'), width: 3 }));
    this.text(i18n('elettroscopio'), kx, gy + 18, { size: 11.5, align: 'center', color: this.c('muted') });
    this.text(i18n('sfera carica'), sx, gy + 18, { size: 11.5, align: 'center', color: this.c('muted') });
    // gli elettroni: otto sulla sfera; nel rame metà corrono fino all'elettroscopio
    const gone = conduce && this.live ? Math.round(4 * k) : 0;
    for (let i = 0; i < 8 - gone; i++) { const a = (i / 8) * Math.PI * 2 + 0.3; this.sym(sx + Math.cos(a) * R * 0.62, sy + Math.sin(a) * R * 0.62, -1, { r: 5 }); }
    if (conduce && this.live) {
      if (u < 0.95) for (let j = 0; j < 3; j++) { const f = (this.clock * 0.9 + j / 3) % 1; this.sym(sx + R + (kx - kr - sx - R) * f, sy, -1, { r: 4.5 }); }
      if (gone >= 1) this.sym(kx, sy, -1, { r: 4.5 });
      if (gone >= 2) this.sym(kx, (sy + hy) / 2, -1, { r: 4.5 });
      if (gone >= 3) [-1, 1].forEach((s) => this.sym(kx + s * leaf * 0.7 * Math.sin(phi), hy + leaf * 0.7 * Math.cos(phi), -1, { r: 4.5 }));
    }
    const rows = [[E ? i18n('Barra di {m}', { m: i18n(p.barra) }) : conduce ? i18n('Barra di rame: un conduttore') : i18n('Barra di {m}: un isolante', { m: i18n(p.barra) }), this.c('chalk'), 700]];
    if (this.result) {
      if (conduce) rows.push(E ? [i18n('le cariche corrono nel rame:'), this.c('mint'), 500] : [i18n('gli elettroni corrono fino alle foglioline'), this.c('mint'), 500],
        E ? [i18n('le foglioline si aprono!'), this.c('mint'), 500] : [i18n('cariche uguali: le foglioline si respingono'), this.c('mint'), 500]);
      else rows.push(E ? [i18n('qui le cariche non corrono:'), this.c('coral'), 500] : [i18n('gli elettroni restano fermi dove sono'), this.c('coral'), 500],
        [i18n('le foglioline restano chiuse'), this.c('coral'), 500]);
    }
    this.box(rows);
  }

  // ---------- la legge di Coulomb ----------
  drawCoulomb() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', gy = H * 0.8;
    const kx = W * 0.055, xc = W / 2, y = H * 0.46, x1 = xc - (p.dist * kx) / 2, x2 = xc + (p.dist * kx) / 2, R = 15;
    const F = coulomb(p.q2, p.dist), opp = p.segno === 'opposte';
    this.ground(gy);
    this.stand(x1, y + R, gy); this.stand(x2, y + R, gy);
    this.ball(x1, y, R, { color: this.c('coral') }); this.sym(x1, y, 1, { r: 7 });
    this.ball(x2, y, R, { color: opp ? this.c('sky') : this.c('coral') }); this.sym(x2, y, opp ? -1 : 1, { r: 7 });
    // le cariche: per l'Esploratore tanti segni quante sono le cariche
    if (E) for (let i = 1; i < p.q2; i++) this.sym(x2 + (i === 1 ? -1 : 1) * 12, y - R - 9, opp ? -1 : 1, { r: 5 });
    else {
      this.text('q₁ = 1 µC', x1, y - R - 12, { size: 11.5, align: 'center', color: this.c('coral'), mono: true });
      this.text(`q₂ = ${opp ? '−' : ''}${p.q2} µC`, x2, y - R - 12, { size: 11.5, align: 'center', color: opp ? this.c('sky') : this.c('coral'), mono: true });
    }
    // il righello della distanza
    const ry = y + R + 26;
    this.line([[x1, ry], [x2, ry]], { color: this.c('muted'), width: 1.5 });
    this.line([[x1, ry - 5], [x1, ry + 5]], { color: this.c('muted'), width: 1.5 });
    this.line([[x2, ry - 5], [x2, ry + 5]], { color: this.c('muted'), width: 1.5 });
    this.text(E ? i18n('{r} cm', { r: p.dist }) : `r = ${p.dist} cm`, xc, ry + 17, { size: 11.5, align: 'center', color: this.c('muted'), mono: true });
    // le due forze, uguali e opposte (5 px per newton), a due altezze diverse perché non si sovrappongano
    if (this.live) {
      const L = Math.min(W * 0.3, 5 * F) * easeOut(this.u), d = opp ? 1 : -1, ya = y - R - 34, yb = y - R - 52;
      this.arrow(x1, ya, x1 + d * L, ya, { color: this.c('orange'), width: 3 });
      this.arrow(x2, yb, x2 - d * L, yb, { color: this.c('orange'), width: 3 });
      if (this.result) {
        this.text('F', x1 + d * L + (d > 0 ? 6 : -14), ya + 4, { size: 12, color: this.c('orange'), mono: true });
        this.text('F', x2 - d * L + (d > 0 ? -14 : 6), yb + 4, { size: 12, color: this.c('orange'), mono: true });
      }
    }
    const rows = [];
    if (E) {
      rows.push([i18n('Palline a {r} centimetri', { r: p.dist }), this.c('chalk'), 700]);
      if (this.result) rows.push([opp ? i18n('si attirano con una forza di {F} newton', { F: nice(F, 1) }) : i18n('si respingono con una forza di {F} newton', { F: nice(F, 1) }), this.c('mint'), 500]);
    } else {
      rows.push([i18n('q₁ = 1 µC, q₂ = {q} µC, r = {r} cm', { q: p.q2, r: p.dist }), this.c('chalk'), 700]);
      if (this.result) rows.push([i18n('F = k·q₁·q₂ / r² = {F} N', { F: nice(F, 2) }), this.c('mint'), 500],
        [opp ? i18n('cariche opposte: si attirano') : i18n('cariche uguali: si respingono'), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- le linee del campo elettrico ----------
  charges() {
    return (CONF[this.params.conf] || CONF.piu).map(([fx, q]) => ({ x: this.W * fx, y: this.H * 0.5, q }));
  }

  efield(ch, x, y) {
    let ex = 0, ey = 0;
    for (const c of ch) { const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy || 1, r3 = r2 * Math.sqrt(r2); ex += (c.q * dx) / r3; ey += (c.q * dy) / r3; }
    return [ex, ey];
  }

  // le linee partono dalle cariche positive (o, se non ce ne sono, dalle negative, percorse all'indietro)
  lines() {
    const key = `${this.params.conf}|${this.W}|${this.H}`;
    if (this._lk === key) return this._lines;
    const ch = this.charges(), top = this.H * 0.12, bot = this.H * 0.94, out = [];
    const src = ch.some((c) => c.q > 0) ? ch.filter((c) => c.q > 0) : ch;
    for (const s of src) {
      const dir = s.q > 0 ? 1 : -1;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + 0.2;
        let x = s.x + 14 * Math.cos(a), y = s.y + 14 * Math.sin(a);
        const pts = [[x, y]];
        for (let k = 0; k < 600; k++) {
          const [ax, ay] = this.efield(ch, x, y), m = Math.hypot(ax, ay) || 1;
          const [bx, by] = this.efield(ch, x + (dir * 1.5 * ax) / m, y + (dir * 1.5 * ay) / m), m2 = Math.hypot(bx, by) || 1;
          x += (dir * 3 * bx) / m2; y += (dir * 3 * by) / m2;
          pts.push([x, y]);
          if (x < -6 || x > this.W + 6 || y < top || y > bot) break;
          if (ch.some((c) => c !== s && Math.hypot(x - c.x, y - c.y) < 12)) break;
        }
        out.push({ pts, dir });
      }
    }
    this._lk = key; this._lines = out;
    return out;
  }

  drawField() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const ch = this.charges();
    if (this.live) {
      for (const { pts, dir } of this.lines()) {
        this.line(pts, { color: this.c('sun'), width: 1.6, alpha: 0.75, upto: u });
        // le punte di freccia, nel verso del campo
        let s = 0;
        const shown = Math.floor(pts.length * u);
        for (let i = 1; i < shown; i++) {
          s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          if (s > 48 && (s - 48) % 80 < 3) {
            const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], a = Math.atan2((y1 - y0) * dir, (x1 - x0) * dir);
            g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath();
            g.moveTo(x1 - 7 * Math.cos(a - 0.5), y1 - 7 * Math.sin(a - 0.5)); g.lineTo(x1, y1); g.lineTo(x1 - 7 * Math.cos(a + 0.5), y1 - 7 * Math.sin(a + 0.5));
            g.stroke(); g.restore();
            s += 3;
          }
        }
      }
    }
    ch.forEach((c) => { this.ball(c.x, c.y, 13, { color: c.q > 0 ? this.c('coral') : this.c('sky'), shine: false }); this.sym(c.x, c.y, c.q, { r: 7 }); });
    // la carica di prova: la forza che sente va lungo la linea del campo
    const px = W * 0.8, py = H * 0.27, [ex, ey] = this.efield(ch, px, py), m = Math.hypot(ex, ey);
    this.sym(px, py, 1, { r: 5 });
    this.tag(E ? i18n('pallina di prova') : i18n('carica di prova'), px, py - 12, { size: 11, align: 'center', color: this.c('muted') });
    if (this.result && m > 0) {
      const L = Math.max(10, Math.min(60, (36 * m) / (1 / (W * 0.33) ** 2)));
      this.arrow(px, py, px + (L * ex) / m, py + (L * ey) / m, { color: this.c('orange'), width: 2.5 });
    }
    const T = {
      piu: [i18n('Una carica positiva'), E ? i18n('le linee escono dal +, da tutte le parti') : i18n('le linee del campo escono dalla carica +')],
      meno: [i18n('Una carica negativa'), E ? i18n('le linee entrano nel −, da tutte le parti') : i18n('le linee del campo entrano nella carica −')],
      dipolo: [i18n('Una carica + e una −'), E ? i18n('le linee vanno dal + al −') : i18n('le linee partono dal + e finiscono nel −')],
      due: [i18n('Due cariche positive'), E ? i18n('le linee si scansano: in mezzo, niente campo') : i18n('le linee si respingono: in mezzo il campo è zero')],
    }[p.conf] || [];
    const rows = [[T[0], this.c('chalk'), 700]];
    if (this.result) {
      rows.push([T[1], this.c('mint'), 500]);
      if (!E) rows.push([i18n('sulla carica di prova: F = q·E, lungo la linea'), this.c('orange'), 500]);
    }
    this.box(rows);
  }

  // ---------- la pallina volante ----------
  drawFloat() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const xb = W * 0.52, yb = H * 0.86, top = H * 0.12, s = (yb - top - 18) / 46;
    const heq = floatAt(p.q), ok = Math.abs(p.h - heq) <= 1, dir = ok ? 0 : p.h < heq ? 1 : -1;
    // il tubo di vetro e il righello
    g.save(); g.strokeStyle = this.c('sky'); g.globalAlpha = 0.55; g.lineWidth = 2;
    g.beginPath(); g.moveTo(xb - 20, top); g.lineTo(xb - 20, yb + 16); g.lineTo(xb + 20, yb + 16); g.lineTo(xb + 20, top); g.stroke(); g.restore();
    const xr = xb - 44;
    this.line([[xr, yb], [xr, yb - 45 * s]], { color: this.c('muted'), width: 1.5 });
    for (let c = 0; c <= 45; c += 5) {
      this.line([[xr - (c % 10 ? 4 : 7), yb - c * s], [xr, yb - c * s]], { color: this.c('muted'), width: 1.5 });
      if (c && c % 10 === 0) this.text(`${c}`, xr - 10, yb - c * s + 4, { size: 11, align: 'right', color: this.c('muted'), mono: true });
    }
    this.text('cm', xr - 10, yb - 45 * s - 8, { size: 11, align: 'right', color: this.c('muted'), mono: true });
    // la carica ferma in basso
    this.ball(xb, yb, 13, { color: this.c('coral'), shine: false }); this.sym(xb, yb, 1, { r: 7 });
    if (!E) this.text('Q', xb + 22, yb + 5, { size: 12, color: this.c('coral'), mono: true });
    // la pallina: si lascia andare all'altezza h; se è quella giusta galleggia, se no sale o scende
    const k = this.running ? clamp01(this.t / this.dur) : this.result ? 1 : 0;
    const off = ok ? (this.live ? 0.3 * Math.sin(this.clock * 4) : 0) : dir * 3 * k * k;
    const y = yb - (p.h + off) * s;
    this.ball(xb, y, 11, { color: this.c('coral') });
    if (E) { const n = Math.round(p.q * 10); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2; this.sym(xb + Math.cos(a) * 19, y + Math.sin(a) * 19, 1, { r: 4 }); } }
    else { this.sym(xb, y, 1, { r: 6 }); this.text('q', xb + 22, y + 5, { size: 12, color: this.c('coral'), mono: true }); }
    // le due forze sulla pallina: il peso in giù, la spinta elettrica in su
    if (this.live) {
      const P = 30, Fe = Math.min(95, P * (heq / p.h) ** 2), xa = xb + 44;
      this.arrow(xa, y, xa, y + P, { color: this.c('sun'), width: 3 });
      this.arrow(xa + 16, y, xa + 16, y - Fe, { color: this.c('orange'), width: 3 });
      this.text(E ? i18n('peso') : 'P', xa - 4, y + P + 16, { size: 11.5, color: this.c('sun') });
      this.text(E ? i18n('spinta') : 'F', xa + 12, y - Fe - 8, { size: 11.5, color: this.c('orange') });
    }
    if (this.result) this.text(ok ? i18n('galleggia!') : dir > 0 ? i18n('sale!') : i18n('scende!'), xb - 50, y + 5, { size: 13, align: 'right', weight: 700, color: ok ? this.c('mint') : this.c('coral') });
    const rows = [];
    if (E) rows.push([i18n('La pallina è a {h} centimetri', { h: p.h }), this.c('chalk'), 700]);
    else rows.push([i18n('Q = 0,1 µC, q = {q} µC, P = 0,009 N', { q: nice(p.q, 2) }), this.c('chalk'), 700], [i18n('h = {h} cm', { h: p.h }), this.c('chalk'), 500]);
    if (this.result) {
      if (!E) rows.push([i18n('spinta F = k·Q·q / h² = {F} N', { F: nice(spinta(p.q, p.h), 4) }), this.c('orange'), 500]);
      rows.push([ok ? i18n('spinta uguale al peso: galleggia!') : dir > 0 ? i18n('spinta più forte del peso: sale') : i18n('spinta più debole del peso: scende'), ok ? this.c('mint') : this.c('coral'), 500]);
    }
    this.box(rows);
  }

  // ---------- il fulmine sull'auto ----------
  drawCar() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const metal = p.veicolo !== 'plastica', rims = p.veicolo === 'cerchi', gy = H * 0.82;
    const rw = W * 0.062, rr = rims ? rw * 0.7 : rw, wy = gy - rr, x0 = W * 0.15, x1 = W * 0.85;
    const yb = wy, yl = yb - H * 0.085, yt = yl - H * 0.085;
    const body = [[x0, yb], [x0, yl + 8], [x0 + 10, yl], [W * 0.33, yl], [W * 0.4, yt], [W * 0.63, yt], [W * 0.71, yl], [x1 - 8, yl], [x1, yl + 8], [x1, yb], [x0, yb]];
    this.ground(gy);
    // la nuvola carica
    const cy = H * 0.23;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.35;
    [[0.5, 0], [0.62, -0.03], [0.74, 0], [0.58, 0.03], [0.69, 0.03]].forEach(([fx, dy]) => { g.beginPath(); g.arc(W * fx, cy + dy * H, W * 0.085, 0, Math.PI * 2); g.fill(); });
    g.restore();
    [0.52, 0.61, 0.7, 0.79].forEach((fx) => this.sym(W * fx, cy + H * 0.02, -1, { r: 5 }));
    // la carrozzeria: di metallo (grigia) o di plastica (rosa, tratteggiata)
    const strike = this.live ? clamp01(u / 0.3) : 0, after = this.live ? clamp01((u - 0.3) / 0.7) : 0;
    g.save(); g.beginPath(); body.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.globalAlpha = 0.16; g.fillStyle = metal ? this.c('chalk') : this.c('pink'); g.fill(); g.restore();
    this.line(body, { color: metal ? this.c('chalk') : this.c('pink'), width: 2.6, dash: metal ? null : [7, 5] });
    // i finestrini
    this.line([[W * 0.35, yl - 3], [W * 0.41, yt + 5], [W * 0.505, yt + 5], [W * 0.505, yl - 3], [W * 0.35, yl - 3]], { color: this.c('sky'), width: 1.6, alpha: 0.7 });
    this.line([[W * 0.525, yl - 3], [W * 0.525, yt + 5], [W * 0.62, yt + 5], [W * 0.685, yl - 3], [W * 0.525, yl - 3]], { color: this.c('sky'), width: 1.6, alpha: 0.7 });
    // le ruote: gomme nere o cerchi di metallo
    [W * 0.3, W * 0.7].forEach((x) => {
      if (rims) this.ball(x, wy, rr, { color: this.c('chalk'), fill: 0.1, shine: false });
      else { g.save(); g.beginPath(); g.arc(x, wy, rw, 0, Math.PI * 2); g.fillStyle = '#000'; g.fill(); g.strokeStyle = this.c('edge'); g.lineWidth = 2; g.stroke(); g.restore(); this.ball(x, wy, rw * 0.45, { color: this.c('muted'), fill: 0.2, shine: false }); }
    });
    // chi è dentro
    const danger = !metal && after > 0.15, hx = W * 0.47, hy = yt + H * 0.035;
    const pc = danger ? this.c('coral') : this.c('chalk');
    g.save(); g.strokeStyle = pc; g.lineWidth = 2.2; g.beginPath(); g.arc(hx, hy, 6.5, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(hx, hy + 6.5); g.lineTo(hx, yl - 2); g.stroke(); g.restore();
    // il fulmine: dalla nuvola al tetto; poi, se c'è il metallo, corre fuori sulla carrozzeria fino a terra
    if (this.live) {
      const zz = [[W * 0.6, cy + H * 0.05], [W * 0.54, cy + H * 0.1], [W * 0.59, cy + H * 0.14], [W * 0.52, yt]];
      this.line(zz, { color: this.c('sun'), width: 3.5, upto: strike, alpha: 1 - 0.6 * after });
      if (after > 0) {
        if (metal) {
          this.line(body, { color: this.c('sun'), width: 3.5, alpha: 0.35 + 0.4 * Math.abs(Math.sin(this.clock * 9)) * (1 - after * 0.5) });
          // le cariche corrono sulla carrozzeria, dal tetto verso il basso, da tutte e due le parti
          const left = body.slice(0, 6).reverse(), right = body.slice(5, 10);
          [left, right].forEach((path) => {
            let tot = 0; const seg = [];
            for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); seg.push(d); tot += d; }
            for (let j = 0; j < 3; j++) {
              let s = ((this.clock * 0.8 + j / 3) % 1) * tot, i = 0;
              while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
              const f = Math.min(1, s / seg[i]), [ax, ay] = path[i], [bx, by] = path[i + 1];
              this.sym(ax + (bx - ax) * f, ay + (by - ay) * f, -1, { r: 4 });
            }
          });
          // e a terra: una scintilla scavalca la gomma, oppure passa dal cerchio di metallo
          const sx = W * 0.17;
          this.line([[sx, yb], [sx - 6, yb + (gy - yb) * 0.4], [sx + 4, yb + (gy - yb) * 0.7], [sx - 2, gy]], { color: this.c('sun'), width: 2.5, alpha: 0.5 + 0.5 * Math.abs(Math.sin(this.clock * 13)) });
          this.tag(i18n('dentro: campo zero'), hx, yt - 10, { size: 11, align: 'center', color: this.c('mint') });
        } else {
          this.line([[W * 0.52, yt], [W * 0.49, hy - 6], [hx + 3, hy + 10], [W * 0.5, yl + 4], [W * 0.46, yb], [W * 0.48, gy]], { color: this.c('sun'), width: 3.5, upto: clamp01(after * 2) });
          this.tag(i18n('pericolo!'), hx - 30, yt - 10, { size: 12, align: 'center', weight: 700, color: this.c('coral') });
        }
      }
    }
    const T = {
      auto: [i18n('Auto di metallo, con le gomme')],
      cerchi: [i18n('Auto di metallo, senza gomme')],
      plastica: [i18n('Auto di plastica, con le gomme')],
    }[p.veicolo] || [''];
    const rows = [[T[0], this.c('chalk'), 700]];
    if (this.result) {
      if (metal) rows.push([E ? i18n('il fulmine corre fuori, sul metallo:') : i18n('le cariche corrono fuori, sulla carrozzeria'), this.c('mint'), 500],
        [E ? i18n('dentro sei al sicuro!') : i18n('dentro il campo è zero: al sicuro'), this.c('mint'), 500]);
      else rows.push([E ? i18n('la plastica non porta il fulmine fuori:') : i18n('la plastica non conduce: il fulmine passa dentro'), this.c('coral'), 500],
        [i18n('pericolo!'), this.c('coral'), 700]);
    }
    this.box(rows);
  }
}
