// I magneti (E03). Nove modi:
//   - 'oggetti': una calamita a ferro di cavallo scende su una graffetta, una lattina di alluminio, una moneta da 1 centesimo
//     (dentro è d'acciaio) o una da 20 centesimi (una lega di rame): solo il ferro e l'acciaio saltano su.
//   - 'poli': due calamite a sbarra; il nord della prima davanti al sud della seconda (si attirano) o al nord (si respingono).
//   - 'linee': la limatura di ferro, le linee del campo e qualche bussola intorno a una calamita, o a due calamite.
//   - 'terra': la Terra è una grande calamita; una bussola alla latitudine lat segue le sue linee: all'equatore l'ago è
//     orizzontale, più a nord punta sempre più in giù (tan I = 2 tan λ), al polo è verticale.
//   - 'oersted': un filo con la corrente, visto dall'alto, e otto bussole intorno: accesa la corrente, le bussole girano in
//     cerchio intorno al filo; con la corrente al contrario, girano al contrario.
//   - 'bobina': un'elettrocalamita, un chiodo con N spire di filo e una corrente I: solleva N·I/10 graffette.
//   - 'motore': il motore elettrico visto di fianco: una bobina fra il nord e il sud di una calamita; sui due lati la
//     corrente va in versi opposti, le forze sono opposte e la bobina gira, più veloce con più corrente.
//   - 'ruota': la ruota panoramica del parco, mossa da un motore che fa 1 giro al minuto ogni 4 volt.
//   - 'spezza': una calamita spezzata in 2 o in 4 pezzi: ogni pezzo ha il suo nord e il suo sud.
// Risultato: oggetti { ogg, attira }; poli { faccia, forza }; linee { conf }; terra { lat, incl }; oersted { acceso, verso };
//            bobina { spire, I, graffette }; motore { I, verso, gira, giri }; ruota { V, giri }; spezza { pezzi }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

const RAD = Math.PI / 180, DEG = 180 / Math.PI;
export const MAGNETICI = { graffetta: true, lattina: false, cent: true, venti: false };
// l'inclinazione dell'ago alla latitudine magnetica lat, in gradi: tan I = 2 tan λ
export const inclinazione = (lat) => (lat >= 90 ? 90 : Math.atan(2 * Math.tan(lat * RAD)) * DEG);
export const graffette = (spire, I) => Math.min(15, Math.round((spire * I) / 10));
export const giriRuota = (V) => V / 4;
const DUR = { oggetti: 1.6, poli: 1.4, linee: 1.6, terra: 1.2, oersted: 1.4, bobina: 1.6, motore: 2.4, ruota: 2.4, spezza: 1.8 };
const nice = (x, d = 2) => { let k = d; while (k > 0 && Math.abs(Math.round(x * 10 ** k) - Math.round(x * 10 ** (k - 1)) * 10) < 1e-9) k--; return fmt(x, k); };
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

export class Magnets extends Sim {
  static tall = true;
  static controls = {
    ogg: { label: 'L’oggetto', type: 'select', options: [['graffetta', 'graffetta'], ['lattina', 'lattina'], ['cent', 'moneta da 1 centesimo'], ['venti', 'moneta da 20 centesimi']] },
    faccia: { label: 'Davanti al nord della prima', type: 'select', options: [['S', 'il sud della seconda'], ['N', 'il nord della seconda']] },
    conf: { label: 'Le calamite', type: 'select', options: [['una', 'una sola'], ['attira', 'nord davanti a sud'], ['respinge', 'nord davanti a nord']] },
    lat: { label: 'Latitudine della bussola', labelE: 'Quanto è a nord la bussola', min: 0, max: 90, step: 5, unit: '°' },
    acceso: { label: 'Corrente accesa', type: 'toggle' },
    verso: { label: 'Verso della corrente', type: 'select', options: [['su', 'verso di te'], ['giu', 'lontano da te']] },
    spire: { label: 'Spire di filo', labelE: 'Giri di filo', min: 10, max: 50, step: 10, unit: '' },
    I: { label: 'Corrente', min: 0, max: 3, step: 1, unit: 'A', unitE: 'ampere' },
    giro: { label: 'Verso della corrente', type: 'select', options: [['avanti', 'avanti'], ['indietro', 'al contrario']] },
    V: { label: 'Tensione del motore', labelE: 'Volt del motore', min: 0, max: 24, step: 1, unit: 'V', unitE: 'volt' },
    pezzi: { label: 'La calamita', type: 'select', options: [[1, 'intera'], [2, 'in 2 pezzi'], [4, 'in 4 pezzi']] },
  };

  defaults() {
    return { mode: 'oggetti', ogg: 'graffetta', faccia: 'S', conf: 'una', lat: 45, acceso: true, verso: 'su', spire: 20, I: 2, giro: 'avanti', V: 8, obiettivo: 3, pezzi: 1, lens: 's' };
  }

  get dur() { return DUR[this.params.mode] || 1.4; }
  get live() { return this.running || !!this.result; }
  get u() { return this.live ? clamp01((this.result ? this.dur : this.t) / (this.dur * 0.8)) : 0; }

  step() { if (this.t >= this.dur) this.end(); }

  end() {
    if (!this.running) return;
    const p = this.params;
    switch (p.mode) {
      case 'poli': return this.finish({ faccia: p.faccia, forza: p.faccia === 'S' ? 'attrazione' : 'repulsione' });
      case 'linee': return this.finish({ conf: p.conf });
      case 'terra': return this.finish({ lat: p.lat, incl: Math.round(inclinazione(p.lat)) });
      case 'oersted': return this.finish({ acceso: p.acceso, verso: p.verso });
      case 'bobina': return this.finish({ spire: p.spire, I: p.I, graffette: graffette(p.spire, p.I) });
      case 'motore': return this.finish({ I: p.I, verso: p.giro, gira: p.I > 0, giri: p.I * 60 });
      case 'ruota': return this.finish({ V: p.V, giri: giriRuota(p.V) });
      case 'spezza': return this.finish({ pezzi: Number(p.pezzi) });
      default: return this.finish({ ogg: p.ogg, attira: !!MAGNETICI[p.ogg] });
    }
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'poli') this.drawPoles();
    else if (m === 'linee') this.drawLines();
    else if (m === 'terra') this.drawEarth();
    else if (m === 'oersted') this.drawOersted();
    else if (m === 'bobina') this.drawCoil();
    else if (m === 'motore') this.drawMotor();
    else if (m === 'ruota') this.drawWheel();
    else if (m === 'spezza') this.drawBroken();
    else this.drawObjects();
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
  // una calamita a sbarra da x0 a x1: la metà nord rossa, la sud azzurra (nord a destra, o a sinistra se flip)
  bar(x0, x1, y, { h = 26, flip = false, labels = true, alpha = 1 } = {}) {
    const g = this.ctx, xm = (x0 + x1) / 2, left = flip ? 'N' : 'S', right = flip ? 'S' : 'N';
    const col = (s) => (s === 'N' ? this.c('coral') : this.c('sky'));
    g.save(); g.globalAlpha = alpha;
    [[x0, xm, left], [xm, x1, right]].forEach(([a, b, s]) => {
      g.fillStyle = col(s); g.globalAlpha = alpha * 0.32; g.fillRect(a, y - h / 2, b - a, h);
      g.globalAlpha = alpha; g.strokeStyle = col(s); g.lineWidth = 2.2; g.strokeRect(a, y - h / 2, b - a, h);
    });
    g.restore();
    if (labels && x1 - x0 > 28) {
      this.text(left, (x0 + xm) / 2, y + 5, { size: 13, align: 'center', weight: 700, color: col(left) });
      this.text(right, (xm + x1) / 2, y + 5, { size: 13, align: 'center', weight: 700, color: col(right) });
    }
  }

  // un ago di bussola: la punta rossa è il suo nord, e va nel verso del campo (dx, dy)
  needle(x, y, dx, dy, { r = 14, ring = true } = {}) {
    const g = this.ctx, m = Math.hypot(dx, dy) || 1, ux = dx / m, uy = dy / m, L = r * 0.8;
    if (ring) { g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = this.c('sim-bg'); g.fill(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.5; g.stroke(); g.restore(); }
    g.save(); g.lineCap = 'round';
    g.strokeStyle = this.c('coral'); g.lineWidth = 3.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + ux * L, y + uy * L); g.stroke();
    g.strokeStyle = this.c('sky'); g.beginPath(); g.moveTo(x, y); g.lineTo(x - ux * L, y - uy * L); g.stroke();
    g.fillStyle = this.c('chalk'); g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2); g.fill();
    g.restore();
  }

  // una scritta con lo sfondo scuro, per leggerla sopra le linee
  tag(str, x, y, { size = 11, align = 'left', weight = 500, color } = {}) {
    const g = this.ctx, t = i18n(String(str));
    g.font = `${weight} ${size}px Lexend, system-ui, sans-serif`;
    const w = g.measureText(t).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    g.save(); g.globalAlpha = 0.85; g.fillStyle = this.c('sim-bg'); g.fillRect(x0 - 3, y - size, w + 6, size + 5); g.restore();
    this.text(t, x, y, { size, align, weight, color });
  }

  // la calamita a ferro di cavallo, con le punte in basso
  horseshoe(x, y) {
    const g = this.ctx, w = 30, th = 12;
    g.save(); g.lineWidth = th; g.strokeStyle = this.c('coral'); g.globalAlpha = 0.85; g.lineCap = 'butt';
    g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w, y - 30); g.arc(x, y - 30, w, Math.PI, 0); g.lineTo(x + w, y); g.stroke();
    g.globalAlpha = 1; g.strokeStyle = this.c('chalk'); g.beginPath(); g.moveTo(x - w, y); g.lineTo(x - w, y - 12); g.moveTo(x + w, y); g.lineTo(x + w, y - 12); g.stroke();
    g.restore();
    this.text('N', x - w, y + 15, { size: 11, align: 'center', weight: 700, color: this.c('coral') });
    this.text('S', x + w, y + 15, { size: 11, align: 'center', weight: 700, color: this.c('sky') });
    this.line([[x, y - 30 - w - 6], [x, 0]], { color: this.c('muted'), width: 1.5 });
  }

  // ---------- che cosa attira la calamita ----------
  object(id, x, y) {
    const g = this.ctx;
    if (id === 'graffetta') {
      this.line([[x + 14, y + 4], [x - 14, y + 4], [x - 17, y + 1], [x - 17, y - 3], [x - 14, y - 6], [x + 12, y - 6], [x + 15, y - 3], [x + 12, y], [x - 10, y], [x - 12, y - 2]], { color: this.c('chalk'), width: 2 });
    } else if (id === 'lattina') {
      g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.25; g.fillRect(x - 15, y - 48, 30, 48); g.globalAlpha = 1;
      g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(x - 15, y - 48, 30, 48);
      g.fillStyle = this.c('pink'); g.globalAlpha = 0.6; g.fillRect(x - 15, y - 34, 30, 14); g.restore();
    } else {
      const big = id === 'venti', r = big ? 14 : 11;
      this.ball(x, y - r, r, { color: big ? this.c('sun') : this.c('orange'), fill: 0.35, shine: false });
      this.text(big ? '20' : '1', x, y - r + 4.5, { size: big ? 11 : 11, align: 'center', weight: 700, color: big ? this.c('sun') : this.c('orange') });
    }
  }

  drawObjects() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u, yes = !!MAGNETICI[p.ogg];
    const ty = H * 0.78, ox = W * 0.5;
    this.line([[W * 0.14, ty], [W * 0.86, ty]], { color: this.c('chalk'), width: 3 });
    this.line([[W * 0.2, ty], [W * 0.2, H * 0.9]], { color: this.c('chalk'), width: 2.5 });
    this.line([[W * 0.8, ty], [W * 0.8, H * 0.9]], { color: this.c('chalk'), width: 2.5 });
    // la calamita scende; se l'oggetto è di ferro, l'oggetto salta su e resta attaccato
    const my = H * 0.22 + (ty - 110 - H * 0.22) * easeOut(clamp01(u / 0.5));
    const jump = yes ? easeOut(clamp01((u - 0.5) / 0.25)) : 0;
    const oy = ty + (my + 14 + (p.ogg === 'lattina' ? 48 : p.ogg === 'graffetta' ? 6 : 26) - ty) * jump;
    this.horseshoe(ox, my);
    this.object(p.ogg, ox, oy);
    const T = {
      graffetta: [i18n('Una graffetta'), i18n('è d’acciaio: la calamita la attira!'), i18n('acciaio, cioè ferro: si attacca')],
      lattina: [i18n('Una lattina di alluminio'), i18n('la calamita non la attira'), i18n('l’alluminio non è magnetico')],
      cent: [i18n('Una moneta da 1 centesimo'), i18n('la attira: dentro è d’acciaio!'), i18n('ramata fuori, d’acciaio dentro: si attacca')],
      venti: [i18n('Una moneta da 20 centesimi'), i18n('la calamita non la attira'), i18n('una lega di rame, senza ferro: niente')],
    }[p.ogg] || [''];
    const rows = [[T[0], this.c('chalk'), 700]];
    if (this.result) rows.push([E ? T[1] : T[2], yes ? this.c('mint') : this.c('coral'), 500]);
    this.box(rows);
  }

  // ---------- nord e sud ----------
  drawPoles() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e', k = easeOut(this.u), att = p.faccia === 'S';
    const y = H * 0.52, ty = y + 15, L = W * 0.3;
    this.line([[W * 0.04, ty], [W * 0.96, ty]], { color: this.c('chalk'), width: 2.5 });
    const x1 = W * 0.12, x2 = W * 0.54 + (this.live ? (att ? -(W * 0.12) : W * 0.1) * k : 0);
    this.bar(x1, x1 + L, y);
    this.bar(x2, x2 + L, y, { flip: !att });
    if (this.result) {
      const d = att ? 1 : -1;
      this.arrow(x1 + L * 0.5, y - 30, x1 + L * 0.5 + d * 30, y - 30, { color: this.c('orange'), width: 2.5 });
      this.arrow(x2 + L * 0.5, y - 30, x2 + L * 0.5 - d * 30, y - 30, { color: this.c('orange'), width: 2.5 });
    }
    const rows = [[att ? i18n('Nord davanti a sud') : i18n('Nord davanti a nord'), this.c('chalk'), 700]];
    if (this.result) rows.push([att ? (E ? i18n('poli diversi: si attirano!') : i18n('poli opposti: si attirano')) : (E ? i18n('poli uguali: si respingono!') : i18n('poli uguali: si respingono')), this.c('mint'), 500]);
    this.box(rows);
  }

  // ---------- la limatura e le linee del campo ----------
  // ogni calamita è una carica magnetica + al nord e − al sud, vicino alle punte
  poles() {
    const p = this.params, W = this.W, H = this.H, y = H * 0.55, out = [];
    const add = (x0, x1, flip) => { out.push({ x: flip ? x0 + 7 : x1 - 7, y, q: 1, bar: [x0, x1, flip] }); out.push({ x: flip ? x1 - 7 : x0 + 7, y, q: -1 }); };
    if (p.conf === 'una') add(W * 0.32, W * 0.68, false);
    else { add(W * 0.06, W * 0.36, false); add(W * 0.64, W * 0.94, p.conf === 'respinge'); }
    return out;
  }

  bfield(ps, x, y) {
    let bx = 0, by = 0;
    for (const c of ps) { const dx = x - c.x, dy = y - c.y, r2 = dx * dx + dy * dy || 1, r3 = r2 * Math.sqrt(r2); bx += (c.q * dx) / r3; by += (c.q * dy) / r3; }
    return [bx, by];
  }

  traceFrom(ps, s, n, top, bot) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.15;
      let x = s.x + 10 * Math.cos(a), y = s.y + 10 * Math.sin(a);
      const pts = [[x, y]];
      for (let k = 0; k < 500; k++) {
        const [ax, ay] = this.bfield(ps, x, y), m = Math.hypot(ax, ay) || 1;
        const [bx, by] = this.bfield(ps, x + (1.5 * ax) / m, y + (1.5 * ay) / m), m2 = Math.hypot(bx, by) || 1;
        x += (3 * bx) / m2; y += (3 * by) / m2; pts.push([x, y]);
        if (x < -6 || x > this.W + 6 || y < top || y > bot) break;
        if (ps.some((c) => c !== s && c.q < 0 && Math.hypot(x - c.x, y - c.y) < 8)) break;
      }
      out.push(pts);
    }
    return out;
  }

  drawLines() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', u = this.u;
    const ps = this.poles(), top = H * 0.14, bot = H * 0.96;
    const key = `${p.conf}|${W}|${H}`;
    if (this._lk !== key) { this._lk = key; this._lines = ps.filter((c) => c.q > 0).flatMap((s) => this.traceFrom(ps, s, 14, top, bot)); }
    // la limatura: tanti trattini allineati con il campo, più fitti dove il campo è forte
    if (this.live) {
      g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 1.2; g.lineCap = 'round';
      let i = 0;
      for (let y = top + 6; y < bot; y += 12) for (let x = 6; x < W; x += 12) {
        i++;
        const jx = x + (rnd(i) - 0.5) * 8, jy = y + (rnd(i + 999) - 0.5) * 8;
        if (ps.some((c) => c.bar && jx > c.bar[0] - 4 && jx < c.bar[1] + 4 && Math.abs(jy - c.y) < 17)) continue;
        const [bx, by] = this.bfield(ps, jx, jy), m = Math.hypot(bx, by);
        const a = clamp01((Math.log10(m * 1e4) + 0.3) / 2) * clamp01(u * 1.5);
        if (a < 0.08) continue;
        g.globalAlpha = 0.65 * a; g.beginPath(); g.moveTo(jx - (3.5 * bx) / m, jy - (3.5 * by) / m); g.lineTo(jx + (3.5 * bx) / m, jy + (3.5 * by) / m); g.stroke();
      }
      g.restore();
      for (const pts of this._lines) this.line(pts, { color: this.c('sun'), width: 1.5, alpha: 0.7, upto: clamp01((u - 0.3) / 0.7) });
    }
    ps.filter((c) => c.bar).forEach((c) => this.bar(c.bar[0], c.bar[1], c.y, { flip: c.bar[2] }));
    // qualche bussola: la punta rossa segue il campo
    const cps = p.conf === 'una' ? [[0.2, 0.32], [0.5, 0.3], [0.8, 0.32], [0.5, 0.8]] : [[0.5, 0.3], [0.5, 0.55], [0.5, 0.8], [0.2, 0.32]];
    cps.forEach(([fx, fy]) => { const x = W * fx, y = H * fy, [bx, by] = this.bfield(ps, x, y); this.needle(x, y, this.live ? bx : 0, this.live ? by : -1, { r: 13 }); });
    const T = {
      una: [i18n('Una calamita'), i18n('le linee escono dal nord ed entrano nel sud')],
      attira: [i18n('Nord davanti a sud'), E ? i18n('le linee vanno da una all’altra') : i18n('le linee passano da una calamita all’altra: si attirano')],
      respinge: [i18n('Nord davanti a nord'), E ? i18n('le linee si scansano') : i18n('le linee si scansano, fra le calamite: si respingono')],
    }[p.conf] || [''];
    const rows = [[T[0], this.c('chalk'), 700]];
    if (this.result) rows.push([T[1], this.c('mint'), 500]);
    this.box(rows);
  }

  // ---------- la Terra e la bussola ----------
  drawEarth() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.4, cy = H * 0.54, R = W * 0.22;
    // le linee del campo: un dipolo al centro, con il polo sud magnetico vicino al Nord geografico (r = L·sin²θ)
    for (const L of [1.35, 1.8, 2.5, 3.6]) for (const s of [-1, 1]) {
      const pts = [];
      for (let th = 0.05; th < Math.PI - 0.05; th += 0.03) { const r = L * R * Math.sin(th) ** 2; if (r < R * 0.999) continue; pts.push([cx + s * r * Math.sin(th), cy - r * Math.cos(th)]); }
      // si spezza la curva dove rientra nella Terra: si tengono i punti fuori
      if (pts.length > 2) this.line(pts, { color: this.c('sun'), width: 1.4, alpha: 0.55 });
      const mid = [cx + s * L * R, cy];
      this.line([[mid[0] - 4, mid[1] + 6], [mid[0], mid[1]], [mid[0] + 4, mid[1] + 6]], { color: this.c('sun'), width: 1.6, alpha: 0.8 });
    }
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fillStyle = this.c('sky'); g.globalAlpha = 0.22; g.fill(); g.globalAlpha = 1; g.strokeStyle = this.c('sky'); g.lineWidth = 2.5; g.stroke(); g.restore();
    this.line([[cx - R, cy], [cx + R, cy]], { color: this.c('sky'), width: 1, dash: [4, 4], alpha: 0.7 });
    this.line([[cx, cy - R - 16], [cx, cy + R + 16]], { color: this.c('muted'), width: 1.4, dash: [3, 4] });
    // Nord e Sud a sinistra dell'asse: a destra c'è la bussola, che vicino al polo li coprirebbe
    this.text(i18n('Nord'), cx - 20, cy - R - 8, { size: 12, align: 'right', weight: 700, color: this.c('chalk') });
    this.text(i18n('Sud'), cx - 20, cy + R + 20, { size: 12, align: 'right', weight: 700, color: this.c('chalk') });
    if (!E) {
      this.tag(i18n('polo sud magnetico'), cx, cy - R + 40, { size: 10, align: 'center', color: this.c('sky') });
      this.tag(i18n('polo nord magnetico'), cx, cy + R - 32, { size: 10, align: 'center', color: this.c('coral') });
    }
    // la bussola sulla superficie, alla latitudine lat: verso nord lungo la superficie, e in giù di I
    const la = p.lat * RAD, I = inclinazione(p.lat) * RAD, px = cx + (R + 18) * Math.cos(la), py = cy - (R + 18) * Math.sin(la);
    const tn = [-Math.sin(la), -Math.cos(la)], dn = [-Math.cos(la), Math.sin(la)];
    const k = this.live ? easeOut(this.u) : 0, ang = I * k;
    const dx = tn[0] * Math.cos(ang) + dn[0] * Math.sin(ang), dy = tn[1] * Math.cos(ang) + dn[1] * Math.sin(ang);
    this.ball(cx + R * Math.cos(la), cy - R * Math.sin(la), 3, { color: this.c('chalk'), fill: 1, shine: false });
    this.needle(px, py, dx, dy, { r: 15 });
    const where = p.lat === 0 ? i18n('La bussola all’equatore') : p.lat >= 90 ? i18n('La bussola al polo') : i18n('La bussola a {l} gradi verso nord', { l: p.lat });
    const rows = [[E ? where : i18n('Bussola alla latitudine di {l}°', { l: p.lat }), this.c('chalk'), 700]];
    if (this.result) {
      const inc = Math.round(inclinazione(p.lat));
      if (E) rows.push([p.lat <= 5 ? i18n('l’ago è dritto e indica il nord') : p.lat >= 85 ? i18n('vicino al polo, l’ago punta in giù!') : i18n('l’ago indica il nord, un po’ in giù'), this.c('mint'), 500]);
      else rows.push([i18n('l’ago segue le linee: inclinazione {i}°', { i: inc }), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- la corrente fa girare le bussole ----------
  drawOersted() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.5, cy = H * 0.55, r = W * 0.3, on = p.acceso, k = this.live && on ? easeOut(this.u) : 0, s = p.verso === 'su' ? 1 : -1;
    // i cerchi del campo intorno al filo
    if (on && this.live) for (const rr of [r * 0.55, r, r * 1.4]) {
      g.save(); g.strokeStyle = this.c('sun'); g.globalAlpha = 0.35 * k; g.lineWidth = 1.4; g.setLineDash([5, 6]); g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke(); g.restore();
    }
    // il filo visto dall'alto: un cerchio con il punto (la corrente esce, verso di te) o la croce (entra)
    this.ball(cx, cy, 11, { color: on ? this.c('orange') : this.c('muted'), fill: 0.3, shine: false });
    g.save(); g.strokeStyle = on ? this.c('orange') : this.c('muted'); g.fillStyle = g.strokeStyle; g.lineWidth = 2;
    if (s > 0) { g.beginPath(); g.arc(cx, cy, 3, 0, Math.PI * 2); g.fill(); }
    else { g.beginPath(); g.moveTo(cx - 5, cy - 5); g.lineTo(cx + 5, cy + 5); g.moveTo(cx + 5, cy - 5); g.lineTo(cx - 5, cy + 5); g.stroke(); }
    g.restore();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      const tx = s * Math.sin(a), ty = -s * Math.cos(a);
      this.needle(x, y, tx * k, -1 * (1 - k) + ty * k, { r: 14 });
    }
    this.text(i18n('nord'), W * 0.92, H * 0.2, { size: 11, align: 'center', color: this.c('muted') });
    this.arrow(W * 0.92, H * 0.29, W * 0.92, H * 0.22, { color: this.c('muted'), width: 1.8, head: 6 });
    const rows = [[on ? (s > 0 ? i18n('Corrente accesa, verso di te') : i18n('Corrente accesa, lontano da te')) : i18n('Corrente spenta'), this.c('chalk'), 700]];
    if (this.result) {
      if (!on) rows.push([i18n('le bussole indicano tutte il nord'), this.c('mint'), 500]);
      else rows.push([E ? i18n('le bussole girano in cerchio intorno al filo!') : i18n('il campo magnetico gira intorno al filo'), this.c('mint'), 500],
        [s > 0 ? (E ? i18n('in senso antiorario') : i18n('in senso antiorario, visto da sopra')) : (E ? i18n('in senso orario') : i18n('in senso orario, visto da sopra')), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- l'elettrocalamita ----------
  drawCoil() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const nx = W * 0.55, ny0 = H * 0.2, ny1 = H * 0.5, ty = H * 0.84, n = this.live ? graffette(p.spire, p.I) : 0, k = this.live ? easeOut(this.u) : 0;
    // il chiodo di ferro, con le spire di rame intorno
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.6; g.fillRect(nx - 5, ny0, 10, ny1 - ny0); g.globalAlpha = 1;
    g.beginPath(); g.moveTo(nx - 5, ny1); g.lineTo(nx, ny1 + 12); g.lineTo(nx + 5, ny1); g.closePath(); g.fill(); g.fillRect(nx - 10, ny0 - 4, 20, 5); g.restore();
    const turns = Math.round(p.spire / 5), step = (ny1 - ny0 - 16) / turns;
    for (let i = 0; i < turns; i++) {
      const y = ny0 + 8 + i * step;
      this.line([[nx - 11, y], [nx + 11, y + step * 0.5]], { color: this.c('orange'), width: 2 });
    }
    // i fili fino alla pila
    const px = W * 0.18, py = H * 0.35;
    this.line([[nx - 11, ny0 + 8], [px, ny0 + 8], [px, py - 26]], { color: this.c('chalk'), width: 2 });
    this.line([[nx + 11, ny1 - 8], [nx + 30, ny1 - 8], [nx + 30, H * 0.6], [px, H * 0.6], [px, py + 26]], { color: this.c('chalk'), width: 2 });
    g.save(); g.fillStyle = this.c('sim-bg'); g.fillRect(px - 12, py - 26, 24, 52); g.strokeStyle = this.c('sun'); g.lineWidth = 2.2; g.strokeRect(px - 12, py - 26, 24, 52); g.restore();
    this.text(`${p.I} A`, px + 18, py + 4, { size: 12, color: this.c('sun'), mono: true });
    // le graffette: un mucchio sul tavolo, e quelle sollevate appese al chiodo
    this.line([[W * 0.1, ty], [W * 0.9, ty]], { color: this.c('chalk'), width: 2.5 });
    const clip = (x, y, a, col) => { g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = col; g.lineWidth = 1.8; g.beginPath(); g.roundRect(-4, -9, 8, 18, 4); g.stroke(); g.beginPath(); g.roundRect(-2, -6, 4, 12, 2); g.stroke(); g.restore(); };
    for (let i = n; i < 15; i++) clip(nx - 40 + rnd(i) * 80, ty - 6 - (i % 3) * 2, (rnd(i + 7) - 0.5) * 2.4, this.c('chalk'));
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3), col = (i % 3) - 1, x = nx + col * 9 * Math.min(1, row * 0.5 + 0.3), y = ny1 + 22 + row * 19;
      const x0 = nx - 40 + rnd(i) * 80, y0 = ty - 6;
      clip(x0 + (x - x0) * k, y0 + (y - y0) * k, col * 0.25 * k, this.c('chalk'));
    }
    const rows = [[E ? i18n('{s} giri di filo, {i} ampere', { s: p.spire, i: p.I }) : i18n('N = {s} spire, I = {i} A', { s: p.spire, i: p.I }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([n === 1 ? i18n('solleva 1 graffetta') : i18n('solleva {n} graffette', { n }), this.c('mint'), 500]);
      if (!E) rows.push([i18n('più spire e più corrente, calamita più forte'), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- il motore elettrico ----------
  drawMotor() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.5, cy = H * 0.5, rc = W * 0.17, s = p.giro === 'indietro' ? -1 : 1;
    // le due espansioni della calamita, nord a sinistra e sud a destra, e il campo in mezzo
    g.save(); g.lineWidth = 2.4;
    [[-1, 'coral', 'N'], [1, 'sky', 'S']].forEach(([d, c]) => {
      g.strokeStyle = this.c(c); g.fillStyle = this.c(c); g.globalAlpha = 0.28;
      g.beginPath(); g.moveTo(cx + d * W * 0.44, cy - H * 0.18); g.lineTo(cx + d * W * 0.3, cy - H * 0.18); g.arc(cx, cy, W * 0.3, d < 0 ? Math.PI + 0.62 : -0.62, d < 0 ? Math.PI - 0.62 : 0.62, d < 0);
      g.lineTo(cx + d * W * 0.44, cy + H * 0.18); g.closePath(); g.fill(); g.globalAlpha = 1; g.stroke();
    });
    g.restore();
    this.text('N', cx - W * 0.4, cy + 5, { size: 16, align: 'center', weight: 700, color: this.c('coral') });
    this.text('S', cx + W * 0.4, cy + 5, { size: 16, align: 'center', weight: 700, color: this.c('sky') });
    for (const dy of [-0.12, -0.04, 0.04, 0.12]) this.line([[cx - W * 0.27, cy + H * dy], [cx + W * 0.27, cy + H * dy]], { color: this.c('sun'), width: 1, alpha: 0.35 });
    this.arrow(cx + W * 0.16, cy - H * 0.16, cx + W * 0.25, cy - H * 0.16, { color: this.c('sun'), width: 1.4, head: 6, alpha: 0.6 });
    // la bobina vista di fianco: i due lati, che girano intorno all'asse
    const w = this.live ? 2.2 * p.I * s : 0, th = (this._th || 0) + (this.running || this.result ? w * this.fdt : 0);
    this._th = th;
    const a = [cx + rc * Math.cos(th), cy - rc * Math.sin(th)], b = [cx - rc * Math.cos(th), cy + rc * Math.sin(th)];
    this.line([a, b], { color: this.c('orange'), width: 3 });
    this.ball(cx, cy, 4, { color: this.c('chalk'), fill: 1, shine: false });
    // il collettore scambia la corrente a ogni mezzo giro: il lato a destra ha sempre la corrente che esce (⊙)
    const right = a[0] >= b[0] ? a : b, left = right === a ? b : a, on = p.I > 0 && this.live;
    [[right, s > 0], [left, s < 0]].forEach(([q, out]) => {
      this.ball(q[0], q[1], 9, { color: on ? this.c('orange') : this.c('muted'), fill: 0.35, shine: false });
      g.save(); g.strokeStyle = on ? this.c('chalk') : this.c('muted'); g.fillStyle = g.strokeStyle; g.lineWidth = 1.8;
      if (out) { g.beginPath(); g.arc(q[0], q[1], 2.5, 0, Math.PI * 2); g.fill(); }
      else { g.beginPath(); g.moveTo(q[0] - 4, q[1] - 4); g.lineTo(q[0] + 4, q[1] + 4); g.moveTo(q[0] + 4, q[1] - 4); g.lineTo(q[0] - 4, q[1] + 4); g.stroke(); }
      g.restore();
      // la forza: verso l'alto se la corrente esce, verso il basso se entra
      if (on) this.arrow(q[0], q[1], q[0], q[1] + (out ? -1 : 1) * (14 + 10 * p.I), { color: this.c('mint'), width: 2.5 });
    });
    const rows = [[E ? i18n('Motore con {i} ampere', { i: p.I }) : i18n('I = {i} A', { i: p.I }), this.c('chalk'), 700]];
    if (this.result) {
      if (p.I === 0) rows.push([i18n('senza corrente la bobina sta ferma'), this.c('coral'), 500]);
      else rows.push([E ? i18n('una spinta in su e una in giù') : i18n('forze opposte sui due lati'), this.c('mint'), 500],
        [s > 0 ? i18n('la bobina gira in senso antiorario') : i18n('corrente al contrario: la bobina gira in senso orario'), this.c('mint'), 500]);
    }
    this.box(rows);
  }

  // ---------- la ruota panoramica ----------
  drawWheel() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const cx = W * 0.5, cy = H * 0.44, R = W * 0.3, gy = H * 0.88, rpm = giriRuota(p.V);
    const w = this.live ? (rpm * 2 * Math.PI) / 60 * 8 : 0, th = (this._th || 0) + (this.running || this.result ? w * this.fdt : 0);
    this._th = th;
    this.ground(gy);
    this.line([[cx - R * 0.8, gy], [cx, cy], [cx + R * 0.8, gy]], { color: this.c('chalk'), width: 3 });
    g.save(); g.strokeStyle = this.c('pink'); g.lineWidth = 2.5; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke(); g.restore();
    for (let i = 0; i < 8; i++) {
      const a = th + (i / 8) * Math.PI * 2, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      this.line([[cx, cy], [x, y]], { color: this.c('pink'), width: 1.3, alpha: 0.7 });
      // le cabine restano dritte
      g.save(); g.strokeStyle = this.c('sun'); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 6); g.stroke();
      g.fillStyle = this.c('sun'); g.globalAlpha = 0.3; g.fillRect(x - 9, y + 6, 18, 12); g.globalAlpha = 1; g.strokeRect(x - 9, y + 6, 18, 12); g.restore();
    }
    this.ball(cx, cy, 6, { color: this.c('chalk'), fill: 0.6, shine: false });
    // il motore alla base
    g.save(); g.fillStyle = this.c('sim-bg'); g.fillRect(cx - 26, gy - 30, 52, 24); g.strokeStyle = this.c('orange'); g.lineWidth = 2; g.strokeRect(cx - 26, gy - 30, 52, 24); g.restore();
    this.text(`${p.V} V`, cx, gy - 13, { size: 12, align: 'center', color: this.c('orange'), mono: true });
    const rows = [[E ? i18n('Motore a {v} volt', { v: p.V }) : i18n('V = {v} V', { v: p.V }), this.c('chalk'), 700]];
    if (this.result) rows.push([E ? i18n('la ruota fa {g} giri al minuto', { g: nice(rpm, 2) }) : i18n('velocità: V / 4 = {g} giri al minuto', { g: nice(rpm, 2) }), this.c('mint'), 500]);
    this.box(rows);
  }

  // ---------- la calamita spezzata ----------
  drawBroken() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e', n = Number(p.pezzi) || 1;
    const y = H * 0.5, x0 = W * 0.12, x1 = W * 0.88, k = this.live ? easeOut(clamp01((this.u - 0.15) / 0.6)) : 0, gap = 26 * k;
    const len = (x1 - x0 - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const a = x0 + i * (len + gap);
      // i poli nuovi compaiono dove la calamita si è rotta
      this.bar(a, a + len, y, { labels: n === 1 || k > 0.6, h: 30 });
      if (k > 0.6 && n > 1) {
        // un piccolo ventaglio di linee a ogni punta: anche i pezzi hanno il loro campo
        for (const d of [-1, 1]) {
          const ex = d < 0 ? a - 4 : a + len + 4;
          for (const t of [-0.6, 0, 0.6]) this.line([[ex, y + t * 8], [ex + d * 12 * Math.cos(t), y + t * 8 + 12 * Math.sin(t)]], { color: this.c('sun'), width: 1.2, alpha: 0.6 * (k - 0.6) / 0.4 });
        }
      }
    }
    if (this.live && n > 1 && k < 0.3) for (let i = 1; i < n; i++) { const cxk = x0 + i * ((x1 - x0) / n); this.line([[cxk - 3, y - 18], [cxk + 3, y - 5], [cxk - 3, y + 6], [cxk + 2, y + 18]], { color: this.c('chalk'), width: 1.6 }); }
    const rows = [[n === 1 ? i18n('La calamita intera') : i18n('La calamita spezzata in {p} pezzi', { p: n }), this.c('chalk'), 700]];
    if (this.result) {
      if (n === 1) rows.push([i18n('un nord e un sud'), this.c('mint'), 500]);
      else rows.push([E ? i18n('ogni pezzo ha un nord e un sud!') : i18n('{p} pezzi: {p} nord e {p} sud', { p: n }), this.c('mint'), 500]);
    }
    this.box(rows);
  }
}
