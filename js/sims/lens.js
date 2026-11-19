// Rifrazione e lenti (OT02). Sette modi:
//   - 'rifrazione': un laser nell'aria colpisce l'acqua (o il vetro) con angolo di incidenza i. Il raggio entra e si
//     piega verso la normale: sin i = n·sin r, con n = 1,33 per l'acqua e 1,5 per il vetro.
//   - 'tazza': una moneta sul fondo di una tazza, nascosta dal bordo. Con l'acqua il raggio che esce si piega e passa
//     sopra il bordo: la moneta compare. Con la matita: sott'acqua la si vede più in alto, e sembra spezzata.
//   - 'totale': un laser sott'acqua (o dentro il vetro) punta verso l'aria. Oltre l'angolo limite (sin c = 1/n) la luce
//     non esce più: riflessione totale.
//   - 'lente': raggi paralleli su una lente convergente (si incontrano nel fuoco, a distanza f) o divergente (si
//     allargano, come se venissero da un fuoco davanti alla lente).
//   - 'immagine': una candela a distanza p da una lente con f = 10 cm. Se p > f l'immagine è reale e capovolta, a distanza
//     q con 1/p + 1/q = 1/f; se p < f la lente fa da lente d'ingrandimento: immagine virtuale, dritta e più grande.
//   - 'lanterna': la lanterna magica. La figura è a p dalla lente (f = 10 cm), lo schermo a L: nitida solo se L = q.
//   - 'mezza': una candela a 20 cm da una lente con f = 10 cm, lo schermo a 20 cm. Un cartoncino copre metà lente:
//     l'immagine resta intera, solo più scura, perché ogni pezzo di lente porta la luce di tutta la candela.
// Risultato: rifrazione { i, r, mat, n }; tazza { cosa, acqua, visto }; totale { i, r, totale, mat, c };
//            lente { forma, f }; immagine { p, q, m, reale }; lanterna { p, L, q, nitida }; mezza { copri, intera, luce }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01 } from './base.js';

const RAD = Math.PI / 180, DEG = 180 / Math.PI, F = 10;
export const N = { acqua: 1.33, vetro: 1.5 };
const DUR = { rifrazione: 1.4, tazza: 2.2, totale: 1.4, lente: 1.6, immagine: 1.8, lanterna: 1.4, mezza: 1.6 };
// l'angolo (in gradi) del raggio che passa da un mezzo con indice n1 a uno con indice n2; null se non passa
export const refract = (i, n1, n2) => { const s = (n1 / n2) * Math.sin(i * RAD); return s > 1 ? null : Math.asin(s) * DEG; };
// l'angolo limite, oltre il quale la luce non esce più
export const limit = (n) => Math.asin(1 / n) * DEG;
// dove si forma l'immagine di una lente: 1/p + 1/q = 1/f (q < 0: immagine virtuale; p = f: nessuna immagine)
export const imageAt = (p, f = F) => (Math.abs(p - f) < 1e-9 ? Infinity : (p * f) / (p - f));
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
// il secondo tratto del raggio è disegnato tutto: si può scrivere il suo angolo
const u2ok = (u) => u >= 0.999;
const SHARP = 1; // cm: lo schermo della lanterna a meno di 1 cm dal punto giusto dà un'immagine nitida

export class Lens extends Sim {
  static tall = true;
  static controls = {
    i: { label: 'Angolo del raggio', min: 0, max: 80, step: 5, unit: '°' },
    mat: { label: 'Il materiale', type: 'select', options: [['acqua', 'acqua'], ['vetro', 'vetro']] },
    forma: { label: 'La lente', type: 'select', options: [['convergente', 'convergente'], ['divergente', 'divergente']] },
    f: { label: 'Distanza focale', labelE: 'Distanza del fuoco', min: 10, max: 30, step: 5, unit: 'cm' },
    p: { label: 'Distanza della candela', min: 5, max: 30, step: 5, unit: 'cm' },
    L: { label: 'Distanza dello schermo', min: 10, max: 60, step: 1, unit: 'cm' },
    copri: { label: 'La lente', type: 'select', options: [['niente', 'scoperta'], ['sopra', 'coperta sopra'], ['sotto', 'coperta sotto']] },
  };

  defaults() { return { mode: 'rifrazione', i: 40, mat: 'acqua', cosa: 'moneta', acqua: false, forma: 'convergente', f: 20, p: 20, L: 30, copri: 'niente', lens: 's' }; }

  get dur() { return DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params;
    switch (p.mode) {
      case 'tazza': return this.finish({ cosa: p.cosa, acqua: !!p.acqua, visto: !!p.acqua });
      case 'totale': {
        const n = N[p.mat] || N.acqua, r = refract(p.i, n, 1);
        return this.finish({ i: p.i, r: r == null ? null : round(r), totale: r == null, mat: p.mat, c: round(limit(n)) });
      }
      case 'lente': return this.finish({ forma: p.forma, f: p.f });
      case 'immagine': {
        const q = imageAt(p.p), ok = Number.isFinite(q);
        return this.finish({ p: p.p, q: ok ? round(q) : null, m: ok ? round(Math.abs(q / p.p), 2) : null, reale: ok && q > 0 });
      }
      case 'lanterna': { const q = imageAt(p.p); return this.finish({ p: p.p, L: p.L, q, nitida: Math.abs(p.L - q) <= SHARP }); }
      case 'mezza': return this.finish({ copri: p.copri, intera: true, luce: p.copri === 'niente' ? 100 : 50 });
      default: { const n = N[p.mat] || N.acqua; return this.finish({ i: p.i, r: round(refract(p.i, 1, n)), mat: p.mat, n }); }
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'tazza') this.drawCup();
    else if (m === 'totale') this.drawTotal();
    else if (m === 'lente') this.drawLens();
    else if (m === 'immagine') this.drawImage();
    else if (m === 'lanterna') this.drawLantern();
    else if (m === 'mezza') this.drawHalf();
    else this.drawRefraction();
  }

  // ---------- pezzi da disegno ----------
  ray(pts, u, { color, width = 2.4, alpha = 1, dash } = {}) { this.line(pts, { color: color || this.c('sun'), width, alpha, dash, upto: u }); }

  laser(src, to) {
    const g = this.ctx;
    g.save(); g.translate(src[0], src[1]); g.rotate(Math.atan2(to[1] - src[1], to[0] - src[0]));
    g.fillStyle = this.c('chalk'); g.fillRect(-22, -6, 24, 12); g.restore();
  }

  arcAt(x, y, r, from, to, col) {
    const g = this.ctx;
    g.save(); g.strokeStyle = this.c(col); g.lineWidth = 2; g.beginPath(); g.arc(x, y, r, from, to); g.stroke(); g.restore();
  }

  // l'acqua (o il vetro) sotto la riga y, l'aria sopra
  medium(y, glass) {
    const g = this.ctx;
    g.save(); g.fillStyle = glass ? this.c('chalk') : this.c('sky'); g.globalAlpha = glass ? 0.1 : 0.18; g.fillRect(0, y, this.W, this.H - y); g.restore();
    this.line([[0, y], [this.W, y]], { color: glass ? this.c('chalk') : this.c('sky'), width: 2 });
    this.text(i18n('aria'), this.W - 12, y - 10, { size: 11, align: 'right', color: this.c('muted') });
    this.text(glass ? i18n('vetro') : i18n('acqua'), this.W - 12, y + 20, { size: 11, align: 'right', color: glass ? this.c('chalk') : this.c('sky') });
  }

  // un occhio che guarda nella direzione ang
  eye(x, y, ang) {
    const g = this.ctx;
    g.save(); g.translate(x, y); g.rotate(ang);
    g.strokeStyle = this.c('chalk'); g.lineWidth = 2;
    g.beginPath(); g.moveTo(-13, 0); g.quadraticCurveTo(0, -12, 13, 0); g.quadraticCurveTo(0, 12, -13, 0); g.stroke();
    g.fillStyle = this.c('sky'); g.beginPath(); g.arc(3, 0, 5, 0, 2 * Math.PI); g.fill();
    g.fillStyle = '#000'; g.beginPath(); g.arc(4, 0, 2.4, 0, 2 * Math.PI); g.fill();
    g.restore();
  }

  // una candela con la base in (x, y0), alta h; capovolta (flip) cresce verso il basso; tratteggiata se è un'immagine virtuale
  candle(x, y0, h, { flip = false, alpha = 1, dash = false } = {}) {
    const g = this.ctx, k = flip ? 1 : -1, bw = Math.max(5, h * 0.24), bh = h * 0.64, top = y0 + k * bh;
    const fy = top + k * (h - bh) * 0.5, fr = (h - bh) * 0.5;
    g.save(); g.globalAlpha = alpha;
    if (dash) {
      g.setLineDash([3, 3]); g.lineWidth = 1.6;
      g.strokeStyle = this.c('chalk'); g.strokeRect(x - bw / 2, Math.min(y0, top), bw, bh);
      g.strokeStyle = this.c('sun'); g.beginPath(); g.ellipse(x, fy, Math.max(3, bw * 0.45), fr, 0, 0, 2 * Math.PI); g.stroke();
    } else {
      g.fillStyle = this.c('chalk'); g.globalAlpha = alpha * 0.85; g.fillRect(x - bw / 2, Math.min(y0, top), bw, bh);
      g.fillStyle = this.c('sun'); g.globalAlpha = alpha; g.beginPath(); g.ellipse(x, fy, Math.max(3, bw * 0.45), fr, 0, 0, 2 * Math.PI); g.fill();
    }
    g.restore();
  }

  // la figura della lanterna magica: una casetta con il tetto, alta h, centrata in (x, y)
  house(x, y, h, { flip = false, alpha = 1, blur = 0 } = {}) {
    const g = this.ctx, w = h * 0.62, body = h * 0.52;
    g.save(); g.globalAlpha = alpha;
    if (blur > 0.3) g.filter = `blur(${blur.toFixed(1)}px)`;
    g.translate(x, y); if (flip) g.scale(1, -1);
    g.fillStyle = this.c('orange'); g.fillRect(-w / 2, h / 2 - body, w, body);
    g.fillStyle = this.c('coral'); g.beginPath(); g.moveTo(-w / 2 - h * 0.08, h / 2 - body); g.lineTo(0, -h / 2); g.lineTo(w / 2 + h * 0.08, h / 2 - body); g.closePath(); g.fill();
    g.fillStyle = this.c('sky'); g.fillRect(-w * 0.14, h / 2 - body * 0.55, w * 0.28, body * 0.55);
    g.restore();
  }

  // una lente vista di lato: convergente (più spessa al centro) o divergente (più sottile al centro)
  lensShape(x, y, hl, conv, f = 20, alpha = 1) {
    const g = this.ctx, t = 6 + 160 / f;
    g.save(); g.globalAlpha = alpha; g.beginPath();
    if (conv) {
      g.moveTo(x - 1.5, y - hl); g.quadraticCurveTo(x - t + 1.5, y, x - 1.5, y + hl);
      g.lineTo(x + 1.5, y + hl); g.quadraticCurveTo(x + t - 1.5, y, x + 1.5, y - hl); g.closePath();
    } else {
      const te = t + 2;
      g.moveTo(x - te / 2, y - hl); g.quadraticCurveTo(x - 3 + te / 2, y, x - te / 2, y + hl);
      g.lineTo(x + te / 2, y + hl); g.quadraticCurveTo(x + 3 - te / 2, y, x + te / 2, y - hl); g.closePath();
    }
    g.fillStyle = this.c('sky'); g.globalAlpha = alpha * 0.25; g.fill();
    g.globalAlpha = alpha; g.strokeStyle = this.c('sky'); g.lineWidth = 2; g.stroke();
    g.restore();
  }

  // lo schermo visto di fronte, in basso a sinistra: quello che vedresti guardandolo
  screenView(draw) {
    const g = this.ctx, k = Math.min(this.W * 0.34, this.H * 0.26), x = 12, y = this.H - k - 12;
    g.save(); g.fillStyle = '#1b2236'; g.fillRect(x, y, k, k); g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(x, y, k, k); g.restore();
    this.text(i18n('sullo schermo'), x, y - 6, { size: 10.5, color: this.c('muted') });
    g.save(); g.beginPath(); g.rect(x + 1, y + 1, k - 2, k - 2); g.clip(); draw(x + k / 2, y + k / 2, k); g.restore();
  }

  // il riquadro delle scritte, in alto a sinistra
  box(rows) {
    if (!rows.length) return;
    const g = this.ctx;
    g.font = '700 11.5px Lexend, system-ui, sans-serif';
    const bw = Math.max(...rows.map(([t]) => g.measureText(t).width)) + 12;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(6, 6, bw, rows.length * 15 + 6); g.restore();
    rows.forEach(([t, col, w], i) => this.text(t, 12, 19 + i * 15, { size: 11.5, weight: w, color: col }));
  }

  // ---------- la luce che entra nell'acqua ----------
  drawRefraction() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', glass = p.mat === 'vetro', n = N[p.mat] || N.acqua;
    const yI = H * 0.52, x0 = W / 2, R = Math.min(W * 0.44, H * 0.38), u = this.u, a = p.i * RAD, r = refract(p.i, 1, n), b = r * RAD;
    this.medium(yI, glass);
    this.line([[x0, yI - R - 8], [x0, yI + R + 8]], { color: this.c('muted'), width: 1.3, dash: [5, 5] });
    this.text(E ? i18n('dritto in su') : i18n('normale'), x0 + 6, yI - R - 2, { size: 10.5, color: this.c('muted') });
    const src = [x0 - R * Math.sin(a), yI - R * Math.cos(a)];
    this.laser(src, [x0, yI]);
    if (this.live) {
      const u2 = clamp01(u * 2 - 1);
      this.ray([src, [x0, yI]], clamp01(u * 2), { color: this.c('coral'), width: 2.6 });
      if (u2 > 0) {
        // dritto, senza piegarsi, andrebbe qui: il tratteggio
        if (p.i > 0) this.line([[x0, yI], [x0 + R * Math.sin(a), yI + R * Math.cos(a)]], { color: this.c('muted'), width: 1.4, dash: [4, 5], upto: u2 });
        this.ray([[x0, yI], [x0 + R * Math.sin(a), yI - R * Math.cos(a)]], u2, { color: this.c('coral'), width: 1.4, alpha: 0.3 });
        this.ray([[x0, yI], [x0 + R * Math.sin(b), yI + R * Math.cos(b)]], u2, { color: this.c('coral'), width: 2.6 });
      }
    } else this.line([src, [x0, yI]], { color: this.c('coral'), width: 1, dash: [3, 6], alpha: 0.5 });
    this.arcAt(x0, yI, 44, -Math.PI / 2 - a, -Math.PI / 2, 'sun');
    const la = a + 14 * RAD, lb = b + 14 * RAD;
    this.text(E ? `${p.i}°` : `i = ${p.i}°`, x0 - 60 * Math.sin(la) - 2, yI - 60 * Math.cos(la), { size: 11.5, align: 'right', weight: 700, color: this.c('sun') });
    if (this.live && u2ok(u) && p.i > 0) {
      this.arcAt(x0, yI, 44, Math.PI / 2 - b, Math.PI / 2, 'mint');
      this.text(E ? `${Math.round(r)}°` : `r = ${nice(r, 1)}°`, x0 + 60 * Math.sin(lb) + 2, yI + 60 * Math.cos(lb) + 8, { size: 11.5, weight: 700, color: this.c('mint') });
    }
    const rows = [[E ? i18n('Il raggio arriva inclinato di {i} gradi', { i: p.i })
      : glass ? i18n('aria → vetro (n = 1,5): i = {i}°', { i: p.i }) : i18n('aria → acqua (n = 1,33): i = {i}°', { i: p.i }), this.c('chalk'), 700]];
    if (this.result) {
      const t = p.i === 0 ? (E ? i18n('entra dritto e non si piega') : i18n('r = 0°: perpendicolare, non si piega'))
        : E ? (glass ? i18n('nel vetro si piega: ora è inclinato di {r} gradi', { r: Math.round(r) }) : i18n('nell’acqua si piega: ora è inclinato di {r} gradi', { r: Math.round(r) }))
          : i18n('r = {r}°: si avvicina alla normale', { r: nice(r, 1) });
      rows.push([t, this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- la moneta nella tazza, la matita nel bicchiere ----------
  // il punto della superficie (alta yw) da cui passa il raggio che va da Q, sott'acqua, all'occhio in (ex, ey)
  surfacePoint(qx, qy, ex, ey, yw, n) {
    let lo = ex, hi = qx;
    for (let k = 0; k < 40; k++) {
      const xp = (lo + hi) / 2, sa = Math.sin(Math.atan2(xp - ex, yw - ey)), sw = Math.sin(Math.atan2(qx - xp, qy - yw));
      if (sa - n * sw < 0) lo = xp; else hi = xp;
    }
    const xp = (lo + hi) / 2;
    // dove l'occhio vede il punto: sul prolungamento del raggio nell'aria, sulla verticale di Q
    return { xp, ya: yw + ((qx - xp) * (yw - ey)) / (xp - ex) };
  }

  drawCup() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, n = N.acqua;
    const cx0 = W * 0.42, cx1 = W * 0.82, yr = H * 0.45, yb = H * 0.76, yw = yr + 0.035 * H, ex = W * 0.1, ey = H * 0.22;
    const pen = p.cosa === 'matita', wet = !!p.acqua && this.live, fill = wet ? clamp01(u / 0.55) : 0, yl = yb - (yb - yw) * fill;
    const look = wet ? clamp01((u - 0.6) / 0.4) : 0;
    this.ground(yb + 3, { x0: 12, x1: W - 12 });
    if (fill > 0) {
      g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.22; g.fillRect(cx0, yl, cx1 - cx0, yb - yl); g.restore();
      this.line([[cx0, yl], [cx1, yl]], { color: this.c('sky'), width: 1.6 });
    }
    const ta = Math.atan2(cx0 - ex, yr - 4 - ey);
    if (!pen) {
      // la moneta sta proprio dove arriva il raggio che, con l'acqua, passa appena sopra il bordo
      const yc = yb - 5, tw = Math.asin(Math.sin(ta) / n), xp = cx0 + (yw - yr + 4) * Math.tan(ta), xc = xp + (yc - yw) * Math.tan(tw);
      g.save(); g.fillStyle = this.c('sun'); g.beginPath(); g.ellipse(xc, yc, 11, 4, 0, 0, 2 * Math.PI); g.fill(); g.restore();
      if (look > 0) {
        const ya = yw + (xc - xp) / Math.tan(ta);
        this.ray([[xc, yc - 2], [xp, yw], [ex, ey]], look, { width: 2.2 });
        if (look >= 1) {
          this.line([[xp, yw], [xc, ya]], { color: this.c('sun'), width: 1.3, dash: [3, 4], alpha: 0.7 });
          g.save(); g.globalAlpha = 0.45; g.fillStyle = this.c('sun'); g.beginPath(); g.ellipse(xc, ya, 11, 4, 0, 0, 2 * Math.PI); g.fill(); g.restore();
        }
      } else if (!wet) {
        // la linea dello sguardo sfiora il bordo e finisce sulla parete: il fondo non si vede
        const dx = cx0 - ex, dy = yr - ey, yhit = ey + ((cx1 - ex) * dy) / dx;
        const end = yhit <= yb ? [cx1, yhit] : [ex + ((yb - ey) * dx) / dy, yb];
        this.line([[ex, ey], [cx0, yr], end], { color: this.c('muted'), width: 1.4, dash: [4, 5] });
      }
    } else {
      // la matita, appoggiata al bordo; sott'acqua si vede più in alto
      const T = [cx1 + 0.05 * W, yr - 0.13 * H], B = [cx0 + 0.28 * (cx1 - cx0), yb - 4];
      const at = (y) => T[0] + ((B[0] - T[0]) * (y - T[1])) / (B[1] - T[1]);
      if (fill <= 0) this.line([T, B], { color: this.c('orange'), width: 7 });
      else {
        const xs = at(yl), seen = [[xs, yl]];
        for (let k = 1; k <= 12; k++) {
          const y = yl + ((B[1] - yl) * k) / 12, x = at(y), s = this.surfacePoint(x, y, ex, ey, yl, n);
          seen.push([x, s.ya]);
        }
        this.line([T, [xs, yl]], { color: this.c('orange'), width: 7 });
        if (look >= 1) this.line([[xs, yl], B], { color: this.c('orange'), width: 2, dash: [4, 5], alpha: 0.6 });
        this.line(seen, { color: this.c('orange'), width: 7 });
      }
    }
    this.line([[cx0, yr], [cx0, yb], [cx1, yb], [cx1, yr]], { color: this.c('chalk'), width: 4 });
    this.eye(ex, ey, ta < Math.PI / 2 ? Math.PI / 2 - ta : 0.5);
    const rows = [];
    if (!wet) rows.push([pen ? (E ? i18n('Una matita dritta nel bicchiere') : i18n('una matita dritta, nel bicchiere vuoto'))
      : E ? i18n('La tazza è vuota: la moneta è nascosta dal bordo') : i18n('tazza vuota: il bordo nasconde la moneta'), this.c('chalk'), 700]);
    else {
      rows.push([pen ? (E ? i18n('Versi l’acqua nel bicchiere') : i18n('bicchiere pieno d’acqua (n = 1,33)'))
        : E ? i18n('Versi l’acqua nella tazza') : i18n('tazza piena d’acqua (n = 1,33)'), this.c('chalk'), 700]);
      if (this.result) rows.push([pen ? (E ? i18n('e la matita sembra spezzata!') : i18n('sott’acqua la vedi più in alto: sembra spezzata'))
        : E ? i18n('e la moneta compare!') : i18n('il raggio si piega uscendo, e passa sopra il bordo'), this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- la luce intrappolata ----------
  drawTotal() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', glass = p.mat === 'vetro', n = N[p.mat] || N.acqua;
    const yI = H * 0.4, x0 = W / 2, R = Math.min(W * 0.44, (H - yI) * 0.8), u = this.u, a = p.i * RAD;
    const r = refract(p.i, n, 1), c = limit(n), tot = r == null;
    this.medium(yI, glass);
    // la normale comincia sotto il riquadro delle scritte, così la sua etichetta resta leggibile
    const top = yI - Math.min(R * 0.85, yI - 76);
    this.line([[x0, top], [x0, yI + R + 8]], { color: this.c('muted'), width: 1.3, dash: [5, 5] });
    this.text(E ? i18n('dritto in su') : i18n('normale'), x0 + 6, top + 4, { size: 10.5, color: this.c('muted') });
    if (!E) {
      // l'angolo limite: oltre questa riga la luce resta dentro
      const cc = c * RAD;
      this.line([[x0, yI], [x0 - R * Math.sin(cc), yI + R * Math.cos(cc)]], { color: this.c('pink'), width: 1.3, dash: [2, 4], alpha: 0.8 });
    }
    const src = [x0 - R * Math.sin(a), yI + R * Math.cos(a)];
    this.laser(src, [x0, yI]);
    if (this.live) {
      const u2 = clamp01(u * 2 - 1);
      this.ray([src, [x0, yI]], clamp01(u * 2), { color: this.c('coral'), width: 2.6 });
      if (u2 > 0) {
        this.ray([[x0, yI], [x0 + R * Math.sin(a), yI + R * Math.cos(a)]], u2, { color: this.c('coral'), width: tot ? 2.6 : 1.4, alpha: tot ? 1 : 0.3 });
        if (!tot) {
          const b = r * RAD, Lr = Math.min(R, (yI - 30) / Math.max(0.2, Math.cos(b)));
          this.ray([[x0, yI], [x0 + Lr * Math.sin(b), yI - Lr * Math.cos(b)]], u2, { color: this.c('coral'), width: 2.6 });
        }
      }
    } else this.line([src, [x0, yI]], { color: this.c('coral'), width: 1, dash: [3, 6], alpha: 0.5 });
    this.arcAt(x0, yI, 44, Math.PI / 2, Math.PI / 2 + a, 'sun');
    const la = a + 14 * RAD;
    this.text(E ? `${p.i}°` : `i = ${p.i}°`, x0 - 60 * Math.sin(la) - 2, yI + 60 * Math.cos(la) + 8, { size: 11.5, align: 'right', weight: 700, color: this.c('sun') });
    if (this.live && u2ok(u) && !tot && p.i > 0) {
      const b = r * RAD, lb = b + 14 * RAD;
      this.arcAt(x0, yI, 44, -Math.PI / 2, -Math.PI / 2 + b, 'mint');
      this.text(E ? `${Math.round(r)}°` : `r = ${nice(r, 1)}°`, x0 + 60 * Math.sin(lb) + 2, yI - 60 * Math.cos(lb), { size: 11.5, weight: 700, color: this.c('mint') });
    }
    const cl = Math.round(c);
    const rows = [[E ? (glass ? i18n('Il laser nel vetro è inclinato di {i} gradi', { i: p.i }) : i18n('Il laser sott’acqua è inclinato di {i} gradi', { i: p.i }))
      : glass ? i18n('vetro → aria: i = {i}°', { i: p.i }) : i18n('acqua → aria: i = {i}°', { i: p.i }), this.c('chalk'), 700]];
    // la riga rosa sul disegno è l'angolo limite
    if (!E) rows.push([i18n('angolo limite: {c}°', { c: cl }), this.c('pink'), 500]);
    if (this.result) {
      const t = tot ? (E ? (glass ? i18n('la luce non esce più: rimbalza tutta nel vetro!') : i18n('la luce non esce più: rimbalza tutta nell’acqua!')) : i18n('i > {c}°: riflessione totale', { c: cl }))
        : p.i === 0 ? (E ? i18n('la luce esce dritta') : i18n('r = 0°: esce dritta'))
          : E ? i18n('la luce esce, e si piega') : i18n('r = {r}°: si allontana dalla normale', { r: nice(r, 1) });
      rows.push([t, this.c('mint'), 700]);
    }
    this.box(rows);
  }

  // ---------- convergente e divergente ----------
  drawLens() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, conv = p.forma !== 'divergente';
    const yc = H * 0.54, s = (W * 0.64 - 26) / 32, xl = conv ? W * 0.36 : W * 0.62, xf = conv ? xl + p.f * s : xl - p.f * s, xe = W - 8;
    const hs = [-2, -1, 0, 1, 2].map((k) => yc + k * H * 0.07);
    this.line([[8, yc], [W - 8, yc]], { color: this.c('edge'), width: 1.2, dash: [6, 6] });
    // il Sole, lontano a sinistra: i suoi raggi arrivano paralleli
    this.ball(20, yc - H * 0.2, 9, { color: this.c('sun'), fill: 0.6, width: 2, shine: false });
    this.lensShape(xl, yc, H * 0.18, conv, p.f);
    if (this.live) {
      const u1 = clamp01(u * 2), u2 = clamp01(u * 2 - 1);
      hs.forEach((y) => {
        this.ray([[8, y], [xl, y]], u1, { width: 2 });
        if (u2 <= 0) return;
        const dx = conv ? xf - xl : xl - xf, dy = conv ? yc - y : y - yc, k = (xe - xl) / dx;
        this.ray([[xl, y], [xl + dx * k, y + dy * k]], u2, { width: 2 });
        if (!conv && y !== yc) this.line([[xl, y], [xf, yc]], { color: this.c('sun'), width: 1.2, dash: [3, 5], alpha: 0.6, upto: u2 });
      });
      if (conv && u >= 1) this.ball(xf, yc, 9, { color: this.c('sun'), fill: 0.55, width: 1, shine: false });
    }
    this.ball(xf, yc, 3.5, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
    this.text(E ? i18n('il fuoco') : 'F', xf, yc + 20, { size: 11, align: 'center', weight: 700, color: this.c('chalk') });
    // la distanza focale, sotto l'asse
    const ym = yc + H * 0.2;
    this.line([[xl, ym], [xf, ym]], { color: this.c('mint'), width: 1.4 });
    this.line([[xl, ym - 5], [xl, ym + 5]], { color: this.c('mint'), width: 1.4 });
    this.line([[xf, ym - 5], [xf, ym + 5]], { color: this.c('mint'), width: 1.4 });
    this.text(E ? `${p.f} cm` : `f = ${p.f} cm`, (xl + xf) / 2, ym - 7, { size: 11, align: 'center', weight: 700, color: this.c('mint') });
    const rows = [[conv ? (E ? i18n('Lente convergente: più spessa al centro') : i18n('lente convergente, f = {f} cm', { f: p.f }))
      : E ? i18n('Lente divergente: più sottile al centro') : i18n('lente divergente, f = −{f} cm', { f: p.f }), this.c('chalk'), 700]];
    if (this.result) rows.push([conv ? (E ? i18n('i raggi si incontrano nel fuoco, a {f} centimetri', { f: p.f }) : i18n('i raggi paralleli passano per il fuoco F'))
      : E ? i18n('i raggi si allargano, come se venissero dal fuoco') : i18n('i raggi sembrano venire dal fuoco virtuale F'), this.c('mint'), 700]);
    this.box(rows);
  }

  // ---------- l'immagine di una candela ----------
  drawImage() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const s = (W - 36) / 60, xl = 18 + 30 * s, yc = H * 0.5, hp = Math.min(H * 0.11, 9 * s), xo = xl - p.p * s, yt = yc - hp, xe = W - 6;
    const q = imageAt(p.p), fin = Number.isFinite(q), real = fin && q > 0, m = fin ? q / p.p : 0;
    const xI = fin ? xl + q * s : 0, yI = yc + m * hp;
    this.line([[6, yc], [W - 6, yc]], { color: this.c('edge'), width: 1.2, dash: [6, 6] });
    this.lensShape(xl, yc, Math.max(H * 0.2, 2.2 * hp), true, F);
    [xl - F * s, xl + F * s].forEach((x) => {
      this.ball(x, yc, 3.5, { color: this.c('chalk'), fill: 1, width: 1, shine: false });
      this.text('F', x, yc + 18, { size: 11, align: 'center', weight: 700, color: this.c('muted') });
    });
    this.candle(xo, yc, hp);
    if (this.live) {
      const u1 = clamp01(u * 2), u2 = clamp01(u * 2 - 1);
      // tre raggi dalla punta della fiamma: parallelo all'asse, per il centro, per il fuoco davanti
      const at = [[xl, yt], [xl, yc]], dir = [[F * s, hp], [xl - xo, hp]];
      if (Math.abs(p.p - F) > 1e-9) { const xF = xl - F * s, y3 = yt + ((xl - xo) * (yc - yt)) / (xF - xo); at.push([xl, y3]); dir.push([1, 0]); }
      at.forEach(([x, y], k) => {
        this.ray([[xo, yt], [x, y]], u1, { width: 1.8 });
        if (u2 <= 0) return;
        const [dx, dy] = dir[k], t = (xe - x) / dx;
        this.ray([[x, y], [x + dx * t, y + dy * t]], u2, { width: 1.8 });
        if (fin && !real) this.line([[x, y], [xI, yI]], { color: this.c('sun'), width: 1.1, dash: [3, 5], alpha: 0.65, upto: u2 });
      });
    }
    if (this.result && fin) {
      if (real) this.line([[xI, yc - 14], [xI, yI + (yI > yc ? 14 : -14)]], { color: this.c('chalk'), width: 3, alpha: 0.7 });
      this.candle(xI, yc, hp * Math.abs(m), { flip: real, alpha: 0.9, dash: !real });
    }
    const rows = [[E ? i18n('La candela è a {p} centimetri dalla lente', { p: p.p }) : i18n('p = {p} cm, f = 10 cm', { p: p.p }), this.c('chalk'), 700]];
    if (this.result) {
      if (!fin) rows.push([E ? i18n('i raggi escono paralleli: nessuna immagine') : i18n('p = f: i raggi escono paralleli, nessuna immagine'), this.c('coral'), 700]);
      else if (real) {
        rows.push([E ? i18n('l’immagine è capovolta, a {q} centimetri dalla lente', { q: Math.round(q) }) : i18n('q = {q} cm: immagine reale, capovolta', { q: nice(q, 1) }), this.c('mint'), 700]);
        if (!E) rows.push([i18n('ingrandimento {m}', { m: nice(m, 2) }), this.c('mint'), 500]);
      } else {
        rows.push([E ? i18n('dentro la lente la vedi dritta e più grande!') : i18n('q = {q} cm: immagine virtuale, dritta', { q: nice(q, 1) }), this.c('mint'), 700]);
        if (!E) rows.push([i18n('ingrandimento {m}', { m: nice(-m, 2) }), this.c('mint'), 500]);
      }
    }
    this.box(rows);
  }

  // ---------- la lanterna magica ----------
  drawLantern() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const s = (W - 40) / 97, xl = 20 + 36 * s, yc = H * 0.5, xs = xl - p.p * s, xS = xl + p.L * s, q = imageAt(p.p);
    const hp = Math.min(34, H * 0.08), ap = H * 0.09, sharp = Math.abs(p.L - q) <= SHARP;
    this.line([[6, yc], [W - 6, yc]], { color: this.c('edge'), width: 1.2, dash: [6, 6] });
    // la scatola della lanterna, con la lampada e la figura
    g.save(); g.strokeStyle = this.c('muted'); g.lineWidth = 2; g.strokeRect(xs - 40, yc - hp, 32, hp * 2); g.restore();
    this.ball(xs - 24, yc, 7, { color: this.c('sun'), fill: this.live ? 0.9 : 0.4, width: 2, shine: false });
    this.house(xs, yc, hp);
    this.lensShape(xl, yc, ap + 6, true, F);
    // lo schermo
    g.save(); g.fillStyle = this.c('chalk'); g.globalAlpha = 0.12; g.fillRect(xS, yc - H * 0.36, 10, H * 0.72); g.restore();
    this.line([[xS, yc - H * 0.36], [xS, yc + H * 0.36]], { color: this.c('chalk'), width: 3 });
    if (this.live) {
      // dalla punta del tetto, attraverso i bordi della lente: i raggi si incontrano a distanza q, poi vanno allo schermo
      const tip = [xs, yc - hp / 2], xq = xl + q * s, yq = yc + (hp / 2) * (q / p.p);
      [-ap, ap].forEach((dy) => {
        const lp = [xl, yc + dy], t = (xS - xl) / (xq - xl);
        this.ray([tip, lp, [xS, yc + dy + (yq - yc - dy) * t]], u, { width: 1.6, alpha: 0.85 });
      });
    }
    const blur = sharp ? 0 : Math.min(10, (50 * Math.abs(p.L - q)) / q);
    this.screenView((cx, cy, k) => { if (this.live && u >= 1) this.house(cx, cy, Math.max(10, Math.min(k * 1.3, k * 0.2 * (p.L / p.p))), { flip: true, alpha: sharp ? 1 : 0.8, blur: blur * 1.4 }); });
    const rows = [
      [E ? i18n('La figura è a {p} centimetri dalla lente', { p: p.p }) : i18n('diapositiva a p = {p} cm, f = 10 cm', { p: p.p }), this.c('chalk'), 700],
      [E ? i18n('lo schermo è a {L} centimetri dalla lente', { L: p.L }) : i18n('schermo a {L} cm', { L: p.L }), this.c('chalk'), 500],
    ];
    if (this.result) rows.push([sharp ? (E ? i18n('Nitida!') : i18n('nitida: q = {q} cm', { q: nice(q, 1) }))
      : p.L < q ? (E ? i18n('sfocata: lo schermo è troppo vicino') : i18n('sfocata: schermo troppo vicino')) : E ? i18n('sfocata: lo schermo è troppo lontano') : i18n('sfocata: schermo troppo lontano'),
    sharp ? this.c('mint') : this.c('coral'), 700]);
    this.box(rows);
  }

  // ---------- la mezza lente ----------
  drawHalf() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const s = (W - 40) / 44, xl = W / 2, yc = H * 0.52, xo = xl - 20 * s, xS = xl + 20 * s, hp = 6 * s, ap = Math.min(H * 0.17, 74);
    const cover = p.copri === 'sopra' ? -1 : p.copri === 'sotto' ? 1 : 0;
    this.line([[6, yc], [W - 6, yc]], { color: this.c('edge'), width: 1.2, dash: [6, 6] });
    this.lensShape(xl, yc, ap + 4, true, F);
    this.line([[xS, yc - H * 0.3], [xS, yc + H * 0.3]], { color: this.c('chalk'), width: 3 });
    this.candle(xo, yc, hp);
    if (this.live) {
      const u1 = clamp01(u * 2), u2 = clamp01(u * 2 - 1);
      // da ogni punto della candela partono raggi verso tutta la lente: quelli che passano si ritrovano nello stesso punto
      [[yc - hp, yc + hp, 'sun', 1], [yc, yc, 'orange', 0.6]].forEach(([y0, y1, col, al]) => {
        [-1, -0.6, -0.2, 0.2, 0.6, 1].forEach((k) => {
          const yl = yc + k * ap, blocked = cover !== 0 && Math.sign(k) === cover;
          this.ray([[xo, y0], [blocked ? xl - 9 : xl, yl]], u1, { color: this.c(col), width: 1.5, alpha: al });
          if (!blocked && u2 > 0) this.ray([[xl, yl], [xS, y1]], u2, { color: this.c(col), width: 1.5, alpha: al });
        });
      });
    }
    if (cover) {
      g.save(); g.fillStyle = '#000'; g.fillRect(xl - 14, cover < 0 ? yc - ap - 8 : yc, 8, ap + 8);
      g.strokeStyle = this.c('muted'); g.lineWidth = 1.5; g.strokeRect(xl - 14, cover < 0 ? yc - ap - 8 : yc, 8, ap + 8); g.restore();
    }
    if (this.result) this.candle(xS, yc, hp, { flip: true, alpha: cover ? 0.4 : 1 });
    this.screenView((cx, cy, k) => { if (this.result) this.candle(cx, cy - k * 0.3, k * 0.6, { flip: true, alpha: cover ? 0.4 : 1 }); });
    const rows = [];
    if (!E) rows.push([i18n('candela a 20 cm, f = 10 cm, schermo a 20 cm'), this.c('chalk'), 500]);
    rows.push([!cover ? (E ? i18n('Lente scoperta') : i18n('lente scoperta'))
      : cover < 0 ? (E ? i18n('Un cartoncino copre la metà di sopra') : i18n('coperta la metà di sopra')) : E ? i18n('Un cartoncino copre la metà di sotto') : i18n('coperta la metà di sotto'), this.c('chalk'), 700]);
    if (this.result) rows.push([E ? (cover ? i18n('la candela si vede tutta, ma più scura') : i18n('la candela si vede tutta, luminosa'))
      : i18n('immagine intera, luce {b} %', { b: cover ? 50 : 100 }), this.c('mint'), 700]);
    this.box(rows);
  }
}
