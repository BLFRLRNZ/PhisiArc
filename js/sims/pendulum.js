// Pendolo: lunghezza, massa e angolo regolabili. Conta n oscillazioni e misura il periodo.
// Sotto c'è un "foglio che scorre": la pallina ci disegna sopra la sua onda, e ogni oscillazione diventa un tratto del grafico.
import { t as i18n } from '../i18n.js';
import { Sim, fmt, easeOut } from './base.js';

export class Pendulum extends Sim {
  static tall = true; // più alto: sotto c'è il foglio dell'onda
  static controls = {
    L: { label: 'Lunghezza del filo', min: 0.25, max: 2.5, step: 0.05, unit: 'm' },
    m: { label: 'Massa della pallina', min: 0.1, max: 3, step: 0.1, unit: 'kg' },
    a: { label: 'Angolo di partenza', min: 5, max: 60, step: 1, unit: '°' },
  };

  defaults() { return { L: 1, m: 0.5, a: 20, n: 5, g: 9.81 }; }

  init() {
    this.th = (this.params.a * Math.PI) / 180;
    this.w = 0;
    this.prevW = 0;
    this.count = 0;
    this.marks = [];   // istanti in cui finisce ogni oscillazione
    this.wave = [];    // [t, spostamento in metri] per il foglio
    this.trail = [];   // [t, angolo] per la scia
    this.lastS = -1;
  }

  step(dt) {
    const p = this.params;
    this.w += -(p.g / p.L) * Math.sin(this.th) * dt;
    this.th += this.w * dt;
    if (this.t - this.lastS >= 0.012) {
      this.lastS = this.t;
      this.wave.push([this.t, p.L * Math.sin(this.th)]);
      this.trail.push([this.t, this.th]);
      if (this.trail.length > 40) this.trail.shift();
    }
    // Da fermo a destra: il periodo finisce quando torna a destra e inverte di nuovo.
    if (this.prevW > 0 && this.w <= 0) {
      this.count++;
      this.marks.push(this.t);
      if (this.count >= p.n) this.finish({ T: this.t / p.n, total: this.t, n: p.n });
    }
    this.prevW = this.w;
  }

  draw() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H;
    this.clear();
    const sky = this.c('sky'), chalk = this.c('chalk'), muted = this.c('muted'), sun = this.c('sun');
    const px = W / 2, py = 52;
    const scale = (H * 0.6 - py - 26) / 2.5;               // stessa scala per tutte le lunghezze: si possono confrontare
    const L = this.sm('L', p.L, 12);                       // la lunghezza cambia con morbidezza
    const len = L * scale;
    const pa = Math.max(H * 0.36, py + len + 44);          // il foglio sale quando il filo è corto
    const a0 = (p.a * Math.PI) / 180;
    const th = this.running || this.t > 0 ? (this._sm.th = this.th) : this.sm('th', this.th, 10);
    const bx = px + len * Math.sin(th), by = py + len * Math.cos(th);

    // soffitto, verticale e arco della corsa
    this.ground(py, { x0: px - 70, x1: px + 70, up: true });
    this.line([[px, py], [px, py + len + 22]], { color: this.c('edge'), width: 1.5, dash: [4, 6] });
    g.save();
    g.strokeStyle = muted; g.globalAlpha = 0.35; g.lineWidth = 1.5; g.setLineDash([3, 7]);
    g.beginPath(); g.arc(px, py, len, Math.PI / 2 - a0, Math.PI / 2 + a0); g.stroke();
    g.restore();

    // scia: le ultime posizioni, sempre più trasparenti
    const tr = this.trail;
    for (let i = 0; i < tr.length; i++) {
      const k = (i + 1) / tr.length, a = tr[i][1];
      g.globalAlpha = k * 0.5; g.fillStyle = sky;
      g.beginPath(); g.arc(px + len * Math.sin(a), py + len * Math.cos(a), 1.5 + 2.5 * k, 0, 7); g.fill();
    }
    g.globalAlpha = 1;

    // angolo
    if (Math.abs(th) > 0.04) {
      g.save();
      g.strokeStyle = sun; g.lineWidth = 2; g.lineCap = 'round';
      g.beginPath(); g.arc(px, py, 34, Math.PI / 2, Math.PI / 2 - th, th > 0); g.stroke();
      g.restore();
      const mid = Math.PI / 2 - th / 2;
      this.text(`${fmt(Math.abs((th * 180) / Math.PI), 0)}°`, px + 50 * Math.cos(mid), py + 50 * Math.sin(mid) + 4, { size: 11, align: 'center', color: sun, mono: true });
    }

    // filo, perno e pallina
    this.line([[px, py], [bx, by]], { color: chalk, width: 2 });
    this.ball(px, py, 4, { color: chalk, fill: 1, shine: false });
    const r = 9 + 7 * Math.cbrt(this.sm('m', p.m, 12));
    this.ball(bx, by, r, { color: sky });
    this.text(`${fmt(p.m, 1)} kg`, bx, by + r + 16, { size: 11, align: 'center', color: muted, mono: true });

    // vettore velocità, tangente al cerchio
    if (this.running) {
      const k = 0.16;
      const vx = Math.cos(th) * this.w * len * k, vy = -Math.sin(th) * this.w * len * k;
      this.arrow(bx, by, bx + vx, by + vy, { color: this.c('orange'), label: 'v' });
    }

    // ---------- il foglio che scorre ----------
    const top = pa + 12, bot = H - 12, ph = Math.max(40, bot - top);
    g.save();
    g.strokeStyle = this.c('edge'); g.lineWidth = 1.5;
    g.beginPath(); g.roundRect(12, top, W - 24, ph, 12); g.stroke();
    g.beginPath(); g.roundRect(12, top, W - 24, ph, 12); g.clip();
    this.line([[px, top], [px, bot]], { color: this.c('edge'), width: 1.5, dash: [4, 6] });
    const T0 = 2 * Math.PI * Math.sqrt(p.L / p.g) * (1 + (a0 * a0) / 16);
    const vp = ph / (1.7 * T0);                           // velocità del foglio (pixel al secondo)
    const yAt = (t) => top + (this.t - t) * vp;
    // tacche di fine oscillazione
    this.marks.forEach((tm, i) => {
      const y = yAt(tm);
      if (y > bot + 10) return;
      this.line([[16, y], [W - 16, y]], { color: sun, width: 1.2, dash: [2, 6], alpha: 0.55 });
      this.text(String(i + 1), 22, y - 5, { size: 11, color: sun, mono: true });
      this.ripple(px + p.L * Math.sin(a0) * scale, y, this.t - tm, { color: sun, r1: 26, dur: 0.6 });
    });
    // parentesi del periodo tra le ultime due tacche
    if (this.marks.length >= 2) {
      const [t1, t2] = this.marks.slice(-2), y1 = yAt(t1), y2 = yAt(t2), xb = W - 34;
      if (y1 < bot + 20) {
        this.line([[xb - 6, y2], [xb, y2], [xb, Math.min(y1, bot)], [xb - 6, Math.min(y1, bot)]], { color: sun, width: 2 });
        this.text(`T = ${fmt(t2 - t1, 2)} s`, xb - 10, (y2 + Math.min(y1, bot)) / 2 + 4, { size: 12, align: 'right', color: sun, mono: true });
      }
    }
    // l'onda
    const pts = [];
    for (const [t, x] of this.wave) { const y = yAt(t); if (y <= bot + 4) pts.push([px + x * scale, y]); }
    if (this.running || this.t > 0) pts.push([bx, top]);
    if (pts.length > 1) {
      const grad = g.createLinearGradient(0, top, 0, bot);
      grad.addColorStop(0, sky); grad.addColorStop(1, 'rgba(124,200,255,0.08)');
      g.strokeStyle = grad; g.lineWidth = 2.5; g.lineJoin = 'round'; g.lineCap = 'round';
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    } else {
      this.text('Qui la pallina disegna la sua onda', px, top + ph / 2 + 4, { size: 12, align: 'center', color: muted });
    }
    g.restore();
    // proiezione: dalla pallina alla penna sul foglio
    this.line([[bx, by + r], [bx, top]], { color: sky, width: 1.2, dash: [2, 5], alpha: 0.5 });
    this.ball(bx, top, 4.5, { color: sky, fill: 1, shine: false });

    // letture
    this.text(i18n('Tempo: {a} s', { a: fmt(this.t, 2) }), 14, 24, { size: 14, weight: 600, mono: false });
    this.text(i18n('Oscillazioni: {a} di {b}', { a: this.count, b: p.n }), 14, 42, { size: 12, color: muted });
    this.text(i18n('Filo: {a} m', { a: fmt(p.L, 2) }), W - 14, 24, { size: 12, align: 'right', color: muted });
    if (this.result) {
      const u = easeOut(this.age / 0.5);
      g.globalAlpha = u;
      this.text(i18n('Un’oscillazione: {a} s', { a: fmt(this.result.T, 2) }), W - 14, 44 + (1 - u) * 8, { size: 15, weight: 700, align: 'right', color: this.c('accent2') });
      g.globalAlpha = 1;
    }
  }
}
