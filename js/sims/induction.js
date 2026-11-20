// L'induzione (E04). Sei modi:
//   - 'bobina': una calamita entra in una bobina collegata a un galvanometro, resta ferma dentro o ne esce: l'ago si sposta
//     solo mentre la calamita si muove, da una parte se entra e dall'altra se esce. La tensione indotta cresce con le spire
//     e con la velocità (legge di Faraday, V = N·ΔΦ/Δt, con ΔΦ = 0,001 Wb e Δt = 1 s piano, 0,5 s veloce).
//   - 'tubo': una calamita o un cilindretto di ferro dello stesso peso cadono in un tubo lungo 1 m, di plastica o di rame:
//     solo la calamita nel rame è frenata dalle correnti indotte (legge di Lenz), e ci mette 4 s invece di 0,45 s.
//   - 'tubi' e 'cilindri': l'esperimento al buio di Bilancia. Prima due tubi grigi, A e B, uno solo di rame (rame = 'A'
//     o 'B'), in cui cade una calamita; poi, nel tubo di rame, due cilindretti uguali, X e Y, uno solo calamita (cal).
//   - 'generatore': una bobina gira f volte al secondo fra il nord e il sud di una calamita e accende una lampadina; lo
//     schermo mostra la tensione alternata, una sinusoide con il picco di 3 V per ogni giro al secondo.
//   - 'trasformatore': due bobine sullo stesso anello di ferro, 1000 spire la prima e n2 la seconda; con la presa
//     (corrente alternata, 230 V) la seconda dà 230 × n2 / 1000 V, con una pila (corrente continua) niente.
//   - 'pista': la pista delle macchinine del parco. Un trasformatore con 1150 spire nella prima bobina abbassa i 230 V
//     della presa a g2 / 5 V; le macchinine vogliono serve volt: con troppi volano fuori pista, con pochi vanno piano.
// Risultato: bobina { moto, vel, spire, V }; tubo { tubo, ogg, t, frenata }; tubi { quale, t }; cilindri { cil, t };
//            generatore { f, Vmax, cambi }; trasformatore { n2, corr, V2 }; pista { g2, V2 }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const G = 9.81;
export const DPHI = 0.001;                         // weber: il flusso che cambia quando la calamita entra o esce
export const TEMPI = { piano: 1, veloce: 0.5 };    // secondi per entrare o uscire
export const indotta = (spire, vel) => (spire * DPHI) / TEMPI[vel];
export const T_LIBERA = Math.sqrt(2 / G);          // 0,45 s per cadere di 1 m
export const V_FRENATA = 0.25;                      // m/s: la velocità limite della calamita nel tubo di rame
export const tCaduta = (frenata) => (frenata ? 1 / V_FRENATA : T_LIBERA);
export const VPICCO = 3;                            // volt di picco per ogni giro al secondo
export const tensione2 = (n2, corr) => (corr === 'continua' ? 0 : (230 * n2) / 1000);
export const vPista = (g2) => (230 * g2) / 1150;
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };

export class Induction extends Sim {
  static tall = true;
  static controls = {
    vel: { label: 'La calamita si muove', type: 'select', options: [['piano', 'piano'], ['veloce', 'veloce']] },
    spire: { label: 'Spire della bobina', labelE: 'Giri di filo', min: 100, max: 400, step: 100, unit: '' },
    tubo: { label: 'Il tubo è', type: 'select', options: [['plastica', 'di plastica'], ['rame', 'di rame']] },
    ogg: { label: 'Che cosa cade', type: 'select', options: [['calamita', 'la calamita'], ['ferro', 'il cilindretto di ferro']] },
    quale: { label: 'La calamita cade nel tubo', type: 'select', options: [['A', 'A'], ['B', 'B']] },
    cil: { label: 'Nel tubo di rame cade', type: 'select', options: [['X', 'il cilindretto X'], ['Y', 'il cilindretto Y']] },
    f: { label: 'Giri al secondo', min: 1, max: 5, step: 1, unit: '' },
    n2: { label: 'Spire della seconda bobina', labelE: 'Giri della seconda bobina', min: 100, max: 2000, step: 100, unit: '' },
    corr: { label: 'La prima bobina è collegata a', type: 'select', options: [['alternata', 'la presa: corrente alternata'], ['continua', 'una pila: corrente continua']] },
    g2: { label: 'Spire della seconda bobina', labelE: 'Giri della seconda bobina', min: 10, max: 150, step: 5, unit: '' },
  };

  defaults() {
    return { mode: 'bobina', moto: 'dentro', vel: 'veloce', spire: 200, tubo: 'plastica', ogg: 'calamita', quale: 'A', rame: 'B', cil: 'X', cal: 'Y',
      f: 1, n2: 100, corr: 'alternata', g2: 50, serve: 12, lens: 's' };
  }

  // la calamita è frenata? solo una calamita, in un tubo di rame
  frenata() {
    const p = this.params;
    if (p.mode === 'tubi') return p.quale === p.rame;
    if (p.mode === 'cilindri') return p.cil === p.cal;
    return p.tubo === 'rame' && p.ogg === 'calamita';
  }

  get dur() {
    const p = this.params;
    switch (p.mode) {
      case 'bobina': return p.moto === 'ferma' ? 1.4 : 0.3 + TEMPI[p.vel] + 0.7;
      case 'tubo': case 'tubi': case 'cilindri': return tCaduta(this.frenata()) + 0.5;
      case 'generatore': return 2;
      case 'pista': return 3;
      default: return 1.6;
    }
  }
  get live() { return this.running || !!this.result; }
  // il tempo fisico da disegnare: durante l'esperimento quello che scorre, alla fine quello finale
  get tt() { return this.result ? this.dur : this.running ? this.t : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params, fr = this.frenata(), t = Math.round(tCaduta(fr) * 100) / 100;
    switch (p.mode) {
      case 'tubo': return this.finish({ tubo: p.tubo, ogg: p.ogg, t, frenata: fr });
      case 'tubi': return this.finish({ quale: p.quale, t });
      case 'cilindri': return this.finish({ cil: p.cil, t });
      case 'generatore': return this.finish({ f: p.f, Vmax: VPICCO * p.f, cambi: 2 * p.f });
      case 'trasformatore': return this.finish({ n2: p.n2, corr: p.corr, V2: tensione2(p.n2, p.corr) });
      case 'pista': return this.finish({ g2: p.g2, V2: vPista(p.g2) });
      default: {
        const V = p.moto === 'ferma' ? 0 : indotta(p.spire, p.vel) * (p.moto === 'fuori' ? -1 : 1);
        return this.finish({ moto: p.moto, vel: p.vel, spire: p.spire, V: Math.round(V * 100) / 100 });
      }
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'tubo' || m === 'tubi' || m === 'cilindri') this.drawTube();
    else if (m === 'generatore') this.drawGenerator();
    else if (m === 'trasformatore') this.drawTransformer();
    else if (m === 'pista') this.drawTrack();
    else this.drawInduction();
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
  // una calamita a sbarra orizzontale da x0 a x1, con il nord a sinistra
  bar(x0, x1, y, h = 22) {
    const g = this.ctx, xm = (x0 + x1) / 2;
    [[x0, xm, 'N', 'coral'], [xm, x1, 'S', 'sky']].forEach(([a, b, s, c]) => {
      g.save(); g.fillStyle = this.c(c); g.globalAlpha = 0.32; g.fillRect(a, y - h / 2, b - a, h);
      g.globalAlpha = 1; g.strokeStyle = this.c(c); g.lineWidth = 2.2; g.strokeRect(a, y - h / 2, b - a, h); g.restore();
      this.text(s, (a + b) / 2, y + 5, { size: 12.5, align: 'center', weight: 700, color: this.c(c) });
    });
  }

  // un cilindretto verticale che cade: la calamita (nord in basso) o un pezzo di ferro grigio, con un'etichetta
  slug(x, y, kind, label) {
    const g = this.ctx, w = 18, h = 30;
    if (kind === 'calamita') {
      [[y, 'S', 'sky'], [y + h / 2, 'N', 'coral']].forEach(([yy, s, c]) => {
        g.save(); g.fillStyle = this.c(c); g.globalAlpha = 0.35; g.fillRect(x - w / 2, yy, w, h / 2);
        g.globalAlpha = 1; g.strokeStyle = this.c(c); g.lineWidth = 2; g.strokeRect(x - w / 2, yy, w, h / 2); g.restore();
        this.text(s, x, yy + 11.5, { size: 10, align: 'center', weight: 700, color: this.c(c) });
      });
    } else {
      g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.45; g.fillRect(x - w / 2, y, w, h);
      g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(x - w / 2, y, w, h); g.restore();
      if (label) this.text(label, x, y + h / 2 + 5, { size: 12, align: 'center', weight: 700, color: this.c('chalk') });
    }
  }

  // il galvanometro: lo zero al centro, l'ago a destra o a sinistra (v da -1 a 1); ghost = il punto più lontano raggiunto
  meter(x, y, v, ghost, label) {
    const g = this.ctx, r = 40, A = 0.95;
    g.save(); g.fillStyle = this.c('sim-bg'); g.strokeStyle = this.c('chalk'); g.lineWidth = 2;
    g.beginPath(); g.roundRect(x - 56, y - 50, 112, 66, 10); g.fill(); g.stroke();
    g.strokeStyle = this.c('muted'); g.lineWidth = 1.4; g.beginPath(); g.arc(x, y + 6, r, -Math.PI / 2 - A, -Math.PI / 2 + A); g.stroke();
    for (let k = -10; k <= 10; k++) {
      const a = -Math.PI / 2 + (k / 10) * A, r0 = k % 5 === 0 ? r - 8 : r - 4;
      g.beginPath(); g.moveTo(x + r0 * Math.cos(a), y + 6 + r0 * Math.sin(a)); g.lineTo(x + r * Math.cos(a), y + 6 + r * Math.sin(a)); g.stroke();
    }
    g.restore();
    this.text('0', x, y - 40, { size: 9.5, align: 'center', color: this.c('muted') });
    const needle = (u, col, alpha, dash) => {
      const a = -Math.PI / 2 + Math.max(-1, Math.min(1, u)) * A;
      this.line([[x, y + 6], [x + (r - 2) * Math.cos(a), y + 6 + (r - 2) * Math.sin(a)]], { color: col, width: 2.2, alpha, dash });
    };
    if (ghost && Math.abs(ghost) > 0.02) needle(ghost, this.c('sun'), 0.6, [3, 3]);
    needle(v, this.c('coral'), 1);
    this.ball(x, y + 6, 3.5, { color: this.c('chalk'), fill: 1, shine: false });
    this.text(label, x, y + 30, { size: 10.5, align: 'center', color: this.c('muted') });
  }

  // frecce che corrono lungo un filo (la corrente): s = verso, k = intensità da 0 a 1
  flow(pts, s, k) {
    if (k < 0.04) return;
    const g = this.ctx, segs = [];
    let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); tot += d; }
    const at = (u) => {
      let d = ((u % tot) + tot) % tot;
      for (let i = 0; i < segs.length; i++) {
        if (d <= segs[i]) { const q = d / segs[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q, Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0])]; }
        d -= segs[i];
      }
      return [...pts[pts.length - 1], 0];
    };
    const off = (this.clock * 60 * s) % 34;
    for (let u = off; u < tot; u += 34) {
      const [x, y, a0] = at(u), a = s > 0 ? a0 : a0 + Math.PI;
      g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = this.c('sun'); g.globalAlpha = Math.min(1, k * 1.5); g.lineWidth = 2;
      g.beginPath(); g.moveTo(-4, -4); g.lineTo(1, 0); g.lineTo(-4, 4); g.stroke(); g.restore();
    }
  }

  // ---------- la calamita e la bobina ----------
  drawInduction() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.4, cy = H * 0.4, L = W * 0.17, r = 30, nl = 4 + p.spire / 50;
    const xIn = cx, xOut = W * 0.8, Tm = TEMPI[p.vel], Vp = indotta(p.spire, p.vel), sg = p.moto === 'fuori' ? -1 : 1;
    // dove sta la calamita: si muove con velocità che sale e scende (e l'ago segue la velocità)
    let s = p.moto === 'fuori' ? 0 : 1, v = 0, peak = 0;
    if (p.moto !== 'ferma') {
      const u = this.live ? clamp01((this.tt - 0.3) / Tm) : 0, sp = (1 - Math.cos(Math.PI * u)) / 2;
      s = p.moto === 'dentro' ? sp : 1 - sp;
      if (this.running && u > 0 && u < 1) v = sg * Vp * Math.sin(Math.PI * u);
      // il punto più lontano raggiunto dall'ago: resta segnato, tratteggiato, per leggerlo con calma
      peak = sg * Vp * (u >= 0.5 ? 1 : Math.sin(Math.PI * u));
    }
    const mx = xOut + (xIn - xOut) * s;
    // le spire: prima le metà dietro, poi la calamita, poi le metà davanti
    const loops = [];
    for (let i = 0; i < nl; i++) loops.push(cx - L + (2 * L * (i + 0.5)) / nl);
    g.save(); g.strokeStyle = this.c('orange'); g.lineWidth = 2; g.globalAlpha = 0.45;
    loops.forEach((x) => { g.beginPath(); g.ellipse(x, cy, 6, r, 0, -Math.PI / 2, Math.PI / 2); g.stroke(); });
    g.restore();
    this.bar(mx - 42, mx + 42, cy);
    g.save(); g.strokeStyle = this.c('orange'); g.lineWidth = 2.4;
    loops.forEach((x) => { g.beginPath(); g.ellipse(x, cy, 6, r, 0, Math.PI / 2, (3 * Math.PI) / 2); g.stroke(); });
    g.restore();
    if (this.running && Math.abs(v) > 0.01) this.arrow(mx, cy - 24, mx + (p.moto === 'dentro' ? -1 : 1) * 30, cy - 24, { color: this.c('sky'), width: 2, head: 6 });
    // i fili fino al galvanometro, e la corrente che ci corre dentro
    const gx = cx, gy = H * 0.76;
    const wl = [[loops[0], cy + r], [loops[0], gy - 10], [gx - 56, gy - 10]], wr = [[gx + 56, gy - 10], [loops[nl - 1], gy - 10], [loops[nl - 1], cy + r]];
    this.line(wl, { color: this.c('chalk'), width: 2 });
    this.line(wr, { color: this.c('chalk'), width: 2 });
    this.flow(wl, v >= 0 ? 1 : -1, Math.abs(v) / 0.8);
    this.flow(wr, v >= 0 ? 1 : -1, Math.abs(v) / 0.8);
    this.meter(gx, gy, v, this.live ? peak : 0, E ? i18n('misura la corrente') : i18n('galvanometro'));
    // i testi
    const head = { dentro: i18n('La calamita entra nella bobina'), ferma: i18n('La calamita è ferma nella bobina'), fuori: i18n('La calamita esce dalla bobina') }[p.moto];
    const rows = [[head, this.c('chalk'), 700]];
    if (p.moto === 'ferma') rows.push([E ? i18n('{n} giri di filo', { n: p.spire }) : i18n('N = {n} spire', { n: p.spire }), this.c('sky'), 500]);
    else if (E) rows.push([p.vel === 'veloce' ? i18n('veloce, con {n} giri di filo', { n: p.spire }) : i18n('piano, con {n} giri di filo', { n: p.spire }), this.c('sky'), 500]);
    else rows.push([i18n('N = {n} spire, in {t} s', { n: p.spire, t: fmt(Tm, 1) }), this.c('sky'), 500]);
    if (this.result) {
      const k = Math.round(Vp * 10);
      if (p.moto === 'ferma') rows.push([E ? i18n('l’ago resta sullo zero: niente corrente') : i18n('niente movimento: tensione zero'), this.c('coral'), 500]);
      else if (p.moto === 'dentro') rows.push([E ? (k === 1 ? i18n('l’ago si sposta di 1 tacca: passa corrente!') : i18n('l’ago si sposta di {k} tacche: passa corrente!', { k })) : i18n('tensione indotta: {v} V', { v: fmt(Vp, 1) }), this.c('mint'), 500]);
      else rows.push([E ? (k === 1 ? i18n('l’ago va di 1 tacca dall’altra parte!') : i18n('l’ago va di {k} tacche dall’altra parte!', { k })) : i18n('tensione indotta: {v} V, al contrario', { v: fmt(Vp, 1) }), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- il tubo di rame e il freno magnetico ----------
  drawTube() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', m = p.mode;
    const y0 = H * 0.17, y1 = H * 0.88, hs = 30, fr = this.frenata(), tf = tCaduta(fr);
    const tubes = m === 'tubi' ? [['A', W * 0.3], ['B', W * 0.56]] : [[null, W * 0.42]];
    const drop = m === 'tubi' ? tubes.find(([k]) => k === p.quale)[1] : tubes[0][1];
    // il righello di un metro
    const rx = W * 0.1;
    this.line([[rx, y0], [rx, y1]], { color: this.c('muted'), width: 1.4 });
    for (let i = 0; i <= 10; i++) { const y = y0 + ((y1 - y0) * i) / 10; this.line([[rx, y], [rx + (i % 5 === 0 ? 9 : 5), y]], { color: this.c('muted'), width: 1.2 }); }
    this.text('0', rx - 4, y0 + 4, { size: 9.5, align: 'right', color: this.c('muted') });
    this.text('1 m', rx - 4, y1 + 4, { size: 9.5, align: 'right', color: this.c('muted') });
    // i tubi: plastica trasparente, rame arancione, oppure tutti grigi nell'esperimento al buio
    tubes.forEach(([k, x]) => {
      const copper = m === 'cilindri' || (m === 'tubo' && p.tubo === 'rame'), dark = m === 'tubi';
      const col = dark ? this.c('muted') : copper ? this.c('orange') : this.c('sky');
      g.save(); g.fillStyle = col; g.globalAlpha = dark ? 0.35 : copper ? 0.3 : 0.1; g.fillRect(x - 17, y0, 34, y1 - y0);
      g.globalAlpha = 1; g.strokeStyle = col; g.lineWidth = 2.4; g.strokeRect(x - 17, y0, 34, y1 - y0); g.restore();
      if (k) this.text(k, x, y1 + 20, { size: 15, align: 'center', weight: 700, color: this.c('chalk') });
    });
    if (m === 'cilindri') this.text(i18n('il tubo di rame'), tubes[0][1], y1 + 20, { size: 11, align: 'center', color: this.c('orange') });
    this.line([[W * 0.16, y1 + 3], [W * 0.7, y1 + 3]], { color: this.c('chalk'), width: 2.5 });
    // che cosa cade, e dove si trova: caduta libera, oppure quasi subito a velocità costante
    const t = Math.min(this.tt, tf);
    const frac = this.live ? (fr ? t / tf : Math.min(1, (0.5 * G * t * t) / 1)) : 0;
    const yo = y0 - hs - 6 + (y1 - y0 + 6) * frac;
    const kind = m === 'tubo' ? p.ogg : 'calamita';
    if (m === 'cilindri') {
      // i due cilindretti, uguali e grigi: quello scelto cade, l'altro aspetta sul tavolino
      const other = p.cil === 'X' ? 'Y' : 'X', tx = W * 0.78, ty = H * 0.5;
      this.line([[tx - 26, ty + 31], [tx + 26, ty + 31]], { color: this.c('chalk'), width: 2.5 });
      this.slug(tx, ty, 'ferro', other);
      this.slug(drop, Math.min(yo, y1 - hs), 'ferro', p.cil);
    } else this.slug(drop, Math.min(yo, y1 - hs), kind === 'ferro' ? 'ferro' : 'calamita');
    // le correnti indotte nel rame, sopra e sotto la calamita, in versi opposti; e la forza che la frena
    const copperShown = m === 'tubo' && p.tubo === 'rame';
    if (fr && copperShown && this.running && frac < 1) {
      const yb = Math.min(yo, y1 - hs);
      [[yb - 10, 1], [yb + hs + 10, -1]].forEach(([y, d]) => {
        g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2; g.globalAlpha = 0.85; g.beginPath(); g.ellipse(drop, y, 23, 5, 0, 0, Math.PI * 2); g.stroke(); g.restore();
        this.arrow(drop - 4 * d, y + 5, drop + 4 * d, y + 5, { color: this.c('sun'), width: 2, head: 5 });
      });
      this.arrow(drop + 34, yb + hs, drop + 34, yb - 4, { color: this.c('coral'), width: 2.4, head: 7 });
    }
    // il cronometro
    const cxw = W * 0.82, cyw = H * 0.24, tsh = this.live ? t : 0;
    this.ball(cxw, cyw, 24, { color: this.c('chalk'), fill: 0.08, shine: false });
    const ah = -Math.PI / 2 + 2 * Math.PI * (tsh % 1);
    this.line([[cxw, cyw], [cxw + 18 * Math.cos(ah), cyw + 18 * Math.sin(ah)]], { color: this.c('coral'), width: 2.2 });
    this.line([[cxw - 5, cyw - 30], [cxw + 5, cyw - 30]], { color: this.c('chalk'), width: 3 });
    this.text(`${fmt(tsh, 2)} s`, cxw, cyw + 44, { size: 13, align: 'center', weight: 700, color: this.c('chalk'), mono: true });
    // i testi
    let head;
    if (m === 'tubo') head = p.ogg === 'calamita' ? (p.tubo === 'rame' ? i18n('La calamita nel tubo di rame') : i18n('La calamita nel tubo di plastica')) : (p.tubo === 'rame' ? i18n('Il ferro nel tubo di rame') : i18n('Il ferro nel tubo di plastica'));
    else if (m === 'tubi') head = i18n('La calamita nel tubo {q}', { q: p.quale });
    else head = i18n('Il cilindretto {c} nel tubo di rame', { c: p.cil });
    const rows = [[head, this.c('chalk'), 700]];
    if (this.result) {
      const ts = fmt(tf, 2);
      if (m !== 'tubo') rows.push([E ? i18n('ci mette {t} secondi', { t: ts }) : i18n('tempo di caduta: {t} s', { t: ts }), this.c('mint'), 500]);
      else if (fr) rows.push([E ? i18n('ci mette {t} secondi: qualcosa la frena!', { t: ts }) : i18n('{t} s: frenata dalle correnti indotte', { t: ts }), this.c('mint'), 500]);
      else rows.push([E ? i18n('ci mette {t} secondi: cade libera', { t: ts }) : i18n('{t} s: caduta libera', { t: ts }), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- il generatore ----------
  drawGenerator() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.4, cy = H * 0.33, a = W * 0.14, Vm = VPICCO * p.f, t = this.tt, w = 2 * Math.PI * p.f;
    // le espansioni della calamita, nord a sinistra e sud a destra
    const R = W * 0.22, ex = W * 0.3;
    g.save(); g.lineWidth = 2.4;
    [[-1, 'coral'], [1, 'sky']].forEach(([d, c]) => {
      g.strokeStyle = this.c(c); g.fillStyle = this.c(c); g.globalAlpha = 0.28;
      g.beginPath(); g.moveTo(cx + d * (ex + 30), cy - H * 0.13); g.lineTo(cx + d * ex, cy - H * 0.13);
      g.arc(cx, cy, R, d < 0 ? Math.PI + 0.66 : -0.66, d < 0 ? Math.PI - 0.66 : 0.66, d < 0);
      g.lineTo(cx + d * (ex + 30), cy + H * 0.13); g.closePath(); g.fill(); g.globalAlpha = 1; g.stroke();
    });
    g.restore();
    this.text('N', cx - ex - 14, cy + 5, { size: 15, align: 'center', weight: 700, color: this.c('coral') });
    this.text('S', cx + ex + 14, cy + 5, { size: 15, align: 'center', weight: 700, color: this.c('sky') });
    for (const dy of [-0.08, 0, 0.08]) this.line([[cx - R * 0.9, cy + H * dy], [cx + R * 0.9, cy + H * dy]], { color: this.c('sun'), width: 1, alpha: 0.3 });
    // la bobina vista di fianco: parte verticale, e gira; dove i lati tagliano le linee del campo nasce la corrente
    const th = Math.PI / 2 + w * t, A = [cx + a * Math.cos(th), cy - a * Math.sin(th)], B = [cx - a * Math.cos(th), cy + a * Math.sin(th)];
    const V = this.live ? Vm * Math.sin(w * t) : 0, on = this.live && Math.abs(Math.cos(th)) > 0.18;
    this.line([A, B], { color: this.c('orange'), width: 3 });
    this.ball(cx, cy, 4, { color: this.c('chalk'), fill: 1, shine: false });
    [[A, Math.cos(th) > 0], [B, Math.cos(th) < 0]].forEach(([q, out]) => {
      this.ball(q[0], q[1], 8, { color: on ? this.c('orange') : this.c('muted'), fill: 0.35, shine: false });
      if (!on) return;
      g.save(); g.strokeStyle = this.c('chalk'); g.fillStyle = this.c('chalk'); g.lineWidth = 1.8;
      if (out) { g.beginPath(); g.arc(q[0], q[1], 2.5, 0, Math.PI * 2); g.fill(); }
      else { g.beginPath(); g.moveTo(q[0] - 4, q[1] - 4); g.lineTo(q[0] + 4, q[1] + 4); g.moveTo(q[0] + 4, q[1] - 4); g.lineTo(q[0] - 4, q[1] + 4); g.stroke(); }
      g.restore();
    });
    // i fili fino alla lampadina, che si accende di più quando la tensione è più alta
    const bx = W * 0.88, by = cy - H * 0.04, glow = this.result ? (0.75 * Vm) / 15 : Math.abs(V) / 15;
    this.line([[cx, cy], [cx, cy + H * 0.17], [bx - 5, cy + H * 0.17], [bx - 5, by + 14]], { color: this.c('chalk'), width: 1.8, alpha: 0.8 });
    this.line([[cx + 3, cy + H * 0.17 - 6], [bx + 5, cy + H * 0.17 - 6], [bx + 5, by + 14]], { color: this.c('chalk'), width: 1.8, alpha: 0.8 });
    if (glow > 0.01) { g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.5 * glow; g.beginPath(); g.arc(bx, by, 14 + 22 * glow, 0, Math.PI * 2); g.fill(); g.restore(); }
    this.ball(bx, by, 12, { color: glow > 0.05 ? this.c('sun') : this.c('chalk'), fill: 0.15 + 0.6 * glow, shine: false });
    // lo schermo: la tensione nel primo secondo, che va su e giù
    const sx0 = W * 0.06, sx1 = W * 0.94, sy0 = H * 0.6, sy1 = H * 0.9, sym = (sy0 + sy1) / 2, hs = (sy1 - sy0) / 2 - 8;
    g.save(); g.fillStyle = this.c('sim-bg'); g.strokeStyle = this.c('muted'); g.lineWidth = 1.5; g.beginPath(); g.roundRect(sx0, sy0, sx1 - sx0, sy1 - sy0, 8); g.fill(); g.stroke(); g.restore();
    this.line([[sx0 + 8, sym], [sx1 - 8, sym]], { color: this.c('muted'), width: 1, alpha: 0.7 });
    for (let i = 1; i < 10; i++) { const x = sx0 + 8 + ((sx1 - sx0 - 16) * i) / 10; this.line([[x, sy0 + 6], [x, sy1 - 6]], { color: this.c('muted'), width: 0.6, alpha: 0.35 }); }
    this.text(i18n('tensione'), sx0 + 10, sy0 + 15, { size: 10, color: this.c('muted') });
    this.text('1 s', sx1 - 10, sy1 - 8, { size: 10, align: 'right', color: this.c('muted') });
    if (this.live) {
      const tm = Math.min(t, 1), pts = [];
      for (let i = 0; i <= 240 * tm; i++) { const ti = i / 240; pts.push([sx0 + 8 + (sx1 - sx0 - 16) * ti, sym - (hs * Vm * Math.sin(w * ti)) / 15]); }
      if (pts.length > 1) this.line(pts, { color: this.c('mint'), width: 2 });
    }
    const rows = [[E ? (p.f === 1 ? i18n('1 giro al secondo') : i18n('{f} giri al secondo', { f: p.f })) : i18n('f = {f} giri al secondo', { f: p.f }), this.c('chalk'), 700]];
    if (this.result) {
      if (E) rows.push([p.f <= 2 ? i18n('la lampadina fa poca luce') : p.f >= 4 ? i18n('la lampadina fa tanta luce!') : i18n('la lampadina fa luce'), this.c('mint'), 500]);
      else rows.push([i18n('tensione massima: {v} V', { v: Vm }), this.c('mint'), 500]);
      rows.push([i18n('la corrente cambia verso {c} volte al secondo', { c: 2 * p.f }), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // l'anello di ferro con due bobine: la prima a sinistra con n1 spire, la seconda a destra con n2 (disegnate fino a 20 giri)
  core(cx, cy, s, n1, n2, { flux = 0, on = true } = {}) {
    const g = this.ctx, th = s * 0.16, x0 = cx - s / 2, y0 = cy - s / 2;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.4; g.beginPath(); g.rect(x0, y0, s, s); g.rect(x0 + th, y0 + th, s - 2 * th, s - 2 * th); g.fill('evenodd');
    g.globalAlpha = 0.9; g.strokeStyle = this.c('muted'); g.lineWidth = 1.5; g.strokeRect(x0, y0, s, s); g.strokeRect(x0 + th, y0 + th, s - 2 * th, s - 2 * th); g.restore();
    const turns = (xl, n) => {
      const k = Math.max(1, Math.min(20, n)), top = y0 + th + 4, h = s - 2 * th - 8, st = h / k;
      for (let i = 0; i < k; i++) this.line([[xl - th / 2 - 4, top + i * st], [xl + th / 2 + 4, top + i * st + st * 0.6]], { color: this.c('orange'), width: 2 });
    };
    turns(x0 + th / 2, n1); turns(x0 + s - th / 2, n2);
    // il campo nel ferro: frecce che girano nell'anello, e che vanno avanti e indietro se la corrente è alternata
    if (on && Math.abs(flux) > 0.05) {
      const d = flux > 0 ? 1 : -1, al = Math.min(1, Math.abs(flux));
      const mid = th / 2;
      [[cx, y0 + mid, d, 0], [x0 + s - mid, cy, 0, d], [cx, y0 + s - mid, -d, 0], [x0 + mid, cy, 0, -d]].forEach(([x, y, dx, dy]) => {
        this.arrow(x - dx * 12, y - dy * 12, x + dx * 12, y + dy * 12, { color: this.c('sun'), width: 2, head: 6, alpha: al });
      });
    }
  }

  // ---------- il trasformatore ----------
  drawTransformer() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', ac = p.corr !== 'continua';
    const cx = W * 0.5, cy = H * 0.45, s = W * 0.44, V2 = tensione2(p.n2, p.corr);
    const flux = this.live ? (ac ? Math.sin(2 * Math.PI * 0.8 * this.clock) : 0.6) : 0;
    this.core(cx, cy, s, 10, p.n2 / 100, { flux });
    // la presa o la pila, a sinistra; il voltmetro, a destra
    const lx = W * 0.1, x0 = cx - s / 2, x1 = cx + s / 2;
    this.line([[x0 - 4, cy - s * 0.3], [lx + 32, cy - s * 0.3], [lx + 32, cy - 10], [lx + 22, cy - 10]], { color: this.c('chalk'), width: 1.8 });
    this.line([[x0 - 4, cy + s * 0.3], [lx + 32, cy + s * 0.3], [lx + 32, cy + 10], [lx + 22, cy + 10]], { color: this.c('chalk'), width: 1.8 });
    g.save(); g.fillStyle = this.c('sim-bg'); g.strokeStyle = ac ? this.c('sky') : this.c('sun'); g.lineWidth = 2; g.beginPath(); g.roundRect(lx - 22, cy - 20, 44, 40, 6); g.fill(); g.stroke(); g.restore();
    this.text(ac ? '230 V' : '9 V', lx, cy + 2, { size: 11, align: 'center', weight: 700, color: ac ? this.c('sky') : this.c('sun'), mono: true });
    this.text(ac ? '~' : '+ −', lx, cy + 15, { size: 11, align: 'center', color: ac ? this.c('sky') : this.c('sun') });
    this.text(ac ? i18n('presa') : i18n('pila'), lx, cy + 36, { size: 10.5, align: 'center', color: this.c('muted') });
    const vx = W * 0.9;
    this.line([[x1 + 4, cy - s * 0.3], [vx - 36, cy - s * 0.3], [vx - 36, cy - 10], [vx - 26, cy - 10]], { color: this.c('chalk'), width: 1.8 });
    this.line([[x1 + 4, cy + s * 0.3], [vx - 36, cy + s * 0.3], [vx - 36, cy + 10], [vx - 26, cy + 10]], { color: this.c('chalk'), width: 1.8 });
    g.save(); g.fillStyle = this.c('sim-bg'); g.strokeStyle = this.c('mint'); g.lineWidth = 2; g.beginPath(); g.roundRect(vx - 26, cy - 20, 52, 40, 6); g.fill(); g.stroke(); g.restore();
    this.text(this.live ? `${nice(V2, 1)} V` : '— V', vx, cy + 5, { size: 11.5, align: 'center', weight: 700, color: this.c('mint'), mono: true });
    this.text(i18n('voltmetro'), vx, cy + 36, { size: 10.5, align: 'center', color: this.c('muted') });
    // le spire scritte sotto
    this.text(E ? i18n('{n} giri', { n: 1000 }) : 'N₁ = 1000', x0 + s * 0.08, cy + s / 2 + 20, { size: 11, align: 'center', color: this.c('orange') });
    this.text(E ? i18n('{n} giri', { n: p.n2 }) : `N₂ = ${p.n2}`, x1 - s * 0.08, cy + s / 2 + 20, { size: 11, align: 'center', color: this.c('orange') });
    const rows = [[E ? i18n('Prima bobina: 1000 giri; seconda: {n} giri', { n: p.n2 }) : i18n('N₁ = 1000, N₂ = {n}', { n: p.n2 }), this.c('chalk'), 700]];
    if (this.result) {
      if (!ac) rows.push([E ? i18n('con la pila, la seconda bobina non dà niente!') : i18n('corrente continua: il campo non cambia, V₂ = 0'), this.c('coral'), 500]);
      else if (E) rows.push([i18n('la seconda bobina dà {v} volt', { v: nice(V2, 1) }), this.c('mint'), 500], [V2 < 230 ? i18n('meno dei 230 volt della presa') : V2 > 230 ? i18n('più dei 230 volt della presa') : i18n('come la presa'), this.c('mint'), 500]);
      else rows.push([i18n('V₂ = 230 V × {n} / 1000 = {v} V', { n: p.n2, v: nice(V2, 1) }), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- la pista delle macchinine ----------
  // il punto della pista a distanza d dalla partenza, sulla corsia off: [x, y, direzione]
  trackAt(d, off, cx, cy, Ls, Rt) {
    const P = 2 * Ls + 2 * Math.PI * Rt, s = ((d % P) + P) % P, R = Rt + off;
    if (s < Ls) return [cx - Ls / 2 + s, cy + R, 0];
    if (s < Ls + Math.PI * Rt) { const a = (s - Ls) / Rt; return [cx + Ls / 2 + R * Math.sin(a), cy + R * Math.cos(a), -a]; }
    if (s < 2 * Ls + Math.PI * Rt) return [cx + Ls / 2 - (s - Ls - Math.PI * Rt), cy - R, Math.PI];
    const a = (s - 2 * Ls - Math.PI * Rt) / Rt;
    return [cx - Ls / 2 - R * Math.sin(a), cy - R * Math.cos(a), Math.PI - a];
  }

  car(x, y, a, col) {
    const g = this.ctx;
    g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = this.c(col); g.globalAlpha = 0.85; g.beginPath(); g.roundRect(-8, -4.5, 16, 9, 3); g.fill();
    g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.lineWidth = 1.2; g.stroke(); g.restore();
  }

  drawTrack() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const V2 = vPista(p.g2), need = Number(p.serve) || 12, state = V2 > need + 0.5 ? 'high' : V2 < need - 0.5 ? 'low' : 'ok';
    // il trasformatore, in alto: la presa a sinistra, la pista sotto
    const cx = W * 0.5, cy = H * 0.3, s = W * 0.3, x0 = cx - s / 2, x1 = cx + s / 2;
    this.core(cx, cy, s, 12, p.g2 / 8, { flux: this.live ? Math.sin(2 * Math.PI * 0.8 * this.clock) : 0 });
    const lx = W * 0.12;
    this.line([[x0 - 4, cy - s * 0.3], [lx + 30, cy - s * 0.3], [lx + 30, cy - 9], [lx + 22, cy - 9]], { color: this.c('chalk'), width: 1.8 });
    this.line([[x0 - 4, cy + s * 0.3], [lx + 30, cy + s * 0.3], [lx + 30, cy + 9], [lx + 22, cy + 9]], { color: this.c('chalk'), width: 1.8 });
    g.save(); g.fillStyle = this.c('sim-bg'); g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.beginPath(); g.roundRect(lx - 22, cy - 18, 44, 36, 6); g.fill(); g.stroke(); g.restore();
    this.text('230 V', lx, cy + 4, { size: 11, align: 'center', weight: 700, color: this.c('sky'), mono: true });
    this.text(E ? i18n('{n} giri', { n: 1150 }) : 'N₁ = 1150', x0 + s * 0.1, cy + s / 2 + 16, { size: 10.5, align: 'center', color: this.c('orange') });
    this.text(E ? i18n('{n} giri', { n: p.g2 }) : `N₂ = ${p.g2}`, x1 - s * 0.1, cy + s / 2 + 16, { size: 10.5, align: 'center', color: this.c('orange') });
    // la pista: due corsie, e i fili che portano la tensione
    const tcx = W * 0.47, tcy = H * 0.72, Ls = W * 0.36, Rt = H * 0.12;
    this.line([[x1 + 4, cy - s * 0.3], [W * 0.92, cy - s * 0.3], [W * 0.92, tcy - Rt - 26], [tcx + Ls / 2, tcy - Rt - 26], [tcx + Ls / 2, tcy - Rt - 14]], { color: this.c('chalk'), width: 1.6, alpha: 0.8 });
    g.save(); g.fillStyle = this.c('sim-bg'); g.strokeStyle = this.c('mint'); g.lineWidth = 2; g.beginPath(); g.roundRect(W * 0.92 - 26, cy + 4, 52, 30, 6); g.fill(); g.stroke(); g.restore();
    this.text(`${nice(V2, 1)} V`, W * 0.92, cy + 23, { size: 11, align: 'center', weight: 700, color: this.c('mint'), mono: true });
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 26; g.globalAlpha = 0.35; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(tcx - Ls / 2, tcy + Rt); g.lineTo(tcx + Ls / 2, tcy + Rt); g.arc(tcx + Ls / 2, tcy, Rt, Math.PI / 2, -Math.PI / 2, true);
    g.lineTo(tcx - Ls / 2, tcy - Rt); g.arc(tcx - Ls / 2, tcy, Rt, -Math.PI / 2, Math.PI / 2, true); g.closePath(); g.stroke(); g.restore();
    for (const off of [-6, 6]) {
      g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1; g.globalAlpha = 0.5; g.setLineDash([4, 5]);
      g.beginPath(); g.moveTo(tcx - Ls / 2, tcy + Rt + off); g.lineTo(tcx + Ls / 2, tcy + Rt + off); g.arc(tcx + Ls / 2, tcy, Rt + off, Math.PI / 2, -Math.PI / 2, true);
      g.lineTo(tcx - Ls / 2, tcy - Rt - off); g.arc(tcx - Ls / 2, tcy, Rt + off, -Math.PI / 2, Math.PI / 2, true); g.closePath(); g.stroke(); g.restore();
    }
    // le macchinine: giuste, fanno un giro in 2,2 s; più tensione, più veloci; troppa, e alla prima curva volano via
    const P = 2 * Ls + 2 * Math.PI * Rt, v = (P / 2.2) * (V2 / need), d0 = Ls * 0.15, t = this.tt;
    [[-6, 'coral', 0], [6, 'sky', -14]].forEach(([off, col, lag]) => {
      const d = d0 + lag + v * t;
      if (state === 'high' && d > Ls) {
        // fuori pista: dritta per la tangente, girando su se stessa, fino a fermarsi
        const [ex, ey] = this.trackAt(Ls, off, tcx, tcy, Ls, Rt), over = Math.min(46, (d - Ls) * 0.6);
        this.car(ex + over, ey + over * 0.35 * (off < 0 ? 0.6 : 1.2), over * 0.12, col);
        if (over >= 46) this.text('!', ex + over + 12, ey - 6, { size: 14, weight: 700, color: this.c('coral') });
      } else {
        const [x, y, a] = this.trackAt(d, off, tcx, tcy, Ls, Rt);
        this.car(x, y, a, col);
      }
    });
    const rows = [[E ? i18n('{g} giri: {v} volt', { g: p.g2, v: nice(V2, 1) }) : i18n('N₂ = {g}: V₂ = 230 V × {g} / 1150 = {v} V', { g: p.g2, v: nice(V2, 1) }), this.c('chalk'), 700],
      [E ? i18n('le macchinine vogliono {s} volt', { s: need }) : i18n('le macchinine vogliono {s} V', { s: need }), this.c('sky'), 500]];
    if (this.result) {
      if (state === 'ok') rows.push([E ? i18n('giusto: sfrecciano e tengono la curva!') : i18n('tensione giusta: tengono la curva'), this.c('mint'), 500]);
      else if (state === 'high') rows.push([E ? i18n('troppi volt: volano fuori pista!') : i18n('tensione troppo alta: fuori pista'), this.c('coral'), 500]);
      else rows.push([E ? i18n('pochi volt: vanno piano piano') : i18n('tensione troppo bassa: vanno piano'), this.c('coral'), 500]);
    }
    this.box(rows);
  }
}
