// Gli stati della materia (T02). Cinque modi:
//   - 'stati': le particelle dell'acqua a una temperatura t: sotto 0 °C vibrano al loro posto (ghiaccio), fra 0 e 100 °C
//     scivolano una sull'altra (acqua), sopra 100 °C volano libere (vapore).
//   - 'curva': 1 kg di ghiaccio a −20 °C su un fuoco di P kW per min minuti. Il calore scalda il ghiaccio, poi lo
//     scioglie (334 kJ, a 0 °C), scalda l'acqua (419 kJ), poi la fa bollire (2260 kJ, a 100 °C): nei passaggi di stato la
//     temperatura resta ferma. Il grafico temperatura–tempo ha i suoi due gradini.
//   - 'bibita': d litri di limonata a 30 °C con g grammi di ghiaccio a 0 °C. Il ghiaccio, sciogliendosi, si prende 334 J
//     per grammo: se non basta tutto, la bibita resta a 0 °C con il ghiaccio che avanza.
//   - 'pentola': l'acqua bolle a una temperatura che dipende dalla pressione: in montagna l'aria preme meno e bolle prima
//     (sull'Everest a 72 °C); nella pentola a pressione (un bar in più) bolle a 120 °C.
//   - 'sudore': due termometri nell'aria a 30 °C, uno con una pezza bagnata: l'acqua che evapora porta via calore, tanto
//     più quanto l'aria è secca e c'è vento.
// Risultato: stati { t, state }; curva { P, min, T, state, ice, water, steam }; bibita { d, g, T, left };
//            pentola { alt, cooker, P, Tb }; sudore { hum, wind, wet }
import { t as i18n } from '../i18n.js';
import { Sim, fmt, clamp01, easeOut } from './base.js';

const C_ICE = 2100, C_W = 4186, C_ST = 2000, LF = 334000, LV = 2260000, T_DRINK = 30;
const one = (x) => fmt(x, Math.abs(x - Math.round(x)) < 0.05 ? 0 : 1);
// dove si trova 1 kg d'acqua partito da ghiaccio a −20 °C, dopo aver ricevuto E joule
export function heatUp(E) {
  const e1 = C_ICE * 20, e2 = e1 + LF, e3 = e2 + C_W * 100, e4 = e3 + LV;
  if (E < e1) return { T: -20 + E / C_ICE, state: 'ghiaccio', ice: 1, water: 0, steam: 0 };
  if (E < e2) { const f = (E - e1) / LF; return { T: 0, state: 'fonde', ice: 1 - f, water: f, steam: 0 }; }
  if (E < e3) return { T: (E - e2) / C_W, state: 'acqua', ice: 0, water: 1, steam: 0 };
  if (E < e4) { const f = (E - e3) / LV; return { T: 100, state: 'bolle', ice: 0, water: 1 - f, steam: f }; }
  return { T: Math.min(150, 100 + (E - e4) / C_ST), state: 'vapore', ice: 0, water: 0, steam: 1 };
}
// la bibita: temperatura finale e ghiaccio che avanza (grammi)
export function drink(d, g) {
  const m = g / 1000, Qd = d * C_W * T_DRINK, Qi = m * LF;
  if (Qi >= Qd) return { T: 0, left: (m - Qd / LF) * 1000 };
  return { T: (Qd - Qi) / ((d + m) * C_W), left: 0 };
}
export const boilT = (alt, cooker) => { const P = 1.013 * Math.exp(-alt / 8400) + (cooker ? 1 : 0); return { P, Tb: 1 / (1 / 373.15 - (8.314 / 40700) * Math.log(P / 1.013)) - 273.15 }; };
export const wetBulb = (hum, wind) => T_DRINK - (1 - hum / 100) * 14 * (wind ? 1 : 0.6);
// i nomi scritti per intero, così il dizionario inglese li trova
const STATE = { ghiaccio: () => i18n('ghiaccio'), fonde: () => i18n('si scioglie: resta a 0 °C'), acqua: () => i18n('acqua'), bolle: () => i18n('bolle: resta a 100 °C'), vapore: () => i18n('tutta vapore: la pentola è vuota') };
const SOLID = { ghiaccio: () => i18n('solido (ghiaccio)'), acqua: () => i18n('liquido (acqua)'), vapore: () => i18n('gas (vapore)') };
const SHORT = { ghiaccio: () => i18n('ghiaccio'), acqua: () => i18n('acqua'), vapore: () => i18n('vapore') };

export class Phase extends Sim {
  static tall = true;
  static controls = {
    t: { label: 'Temperatura', min: -50, max: 150, step: 5, unit: '°C' },
    P: { label: 'Fuoco', min: 1, max: 3, step: 0.5, unit: 'kW' },
    min: { label: 'Minuti sul fuoco', min: 1, max: 40, step: 1, unit: 'min' },
    g: { label: 'Ghiaccio', min: 0, max: 600, step: 10, unit: 'g' },
    alt: { label: 'Altitudine', min: 0, max: 8800, step: 100, unit: 'm' },
    cooker: { label: 'Pentola a pressione', type: 'toggle' },
    hum: { label: 'Umidità dell’aria', min: 10, max: 100, step: 10, unit: '%' },
    wind: { label: 'Vento', type: 'toggle' },
  };

  defaults() { return { mode: 'stati', t: 20, P: 2, min: 10, d: 1, g: 100, alt: 0, cooker: false, hum: 40, wind: false, lens: 's' }; }

  init() {
    this.u = 0;
    this.parts = Array.from({ length: 25 }, (_, i) => ({ hx: (i % 5) / 4, hy: Math.floor(i / 5) / 4, x: (0.5 + i * 0.7548777) % 1, y: (0.5 + i * 0.5698403) % 1, a: i * 2.39996, ph: i * 1.7 }));
  }

  step() {
    this.u = clamp01(this.t / 2.6);
    if (this.t > 3) this.end();
  }

  end() {
    if (!this.running) return;
    const p = this.params;
    if (p.mode === 'curva') { const s = heatUp(p.P * 1000 * p.min * 60); return this.finish({ P: p.P, min: p.min, ...s }); }
    if (p.mode === 'bibita') { const r = drink(p.d, p.g); return this.finish({ d: p.d, g: p.g, ...r }); }
    if (p.mode === 'pentola') { const b = boilT(p.alt, p.cooker); return this.finish({ alt: p.alt, cooker: !!p.cooker, ...b }); }
    if (p.mode === 'sudore') return this.finish({ hum: p.hum, wind: !!p.wind, wet: wetBulb(p.hum, p.wind) });
    this.finish({ t: p.t, state: p.t < 0 ? 'ghiaccio' : p.t < 100 ? 'acqua' : 'vapore' });
  }

  draw() {
    this.clear();
    const m = this.params.mode;
    if (m === 'curva') this.drawCurve();
    else if (m === 'bibita') this.drawDrink();
    else if (m === 'pentola') this.drawPot();
    else if (m === 'sudore') this.drawSweat();
    else this.drawStates();
  }

  thermo(x, y0, y1, T, lo, hi, label = true) {
    const f = clamp01((T - lo) / (hi - lo)), yl = y1 - f * (y1 - y0);
    this.line([[x - 4, y1], [x - 4, y0], [x + 4, y0], [x + 4, y1]], { color: this.c('chalk'), width: 1.5 });
    this.ball(x, y1 + 6, 7, { color: this.c('coral'), fill: 0.85, width: 1.5, shine: false });
    this.line([[x, y1 + 2], [x, yl]], { color: this.c('coral'), width: 4 });
    if (label) this.text(`${fmt(Math.round(T), 0)} °C`, x + 10, yl + 4, { size: 11, color: this.c('coral'), weight: 700 });
  }

  // le particelle in una scatola (x0, y0, x1, y1), nello stato s ('ghiaccio', 'acqua', 'vapore') a T kelvin; mix: metà e metà
  particles(x0, y0, x1, y1, s, K, live, frac = 1) {
    const g = this.ctx, sp = Math.sqrt(K / 300), W = x1 - x0, H = y1 - y0, n = this.parts.length;
    g.save(); g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.strokeRect(x0, y0, W, H); g.restore();
    this.parts.forEach((q, i) => {
      // nei passaggi di stato una parte delle particelle è già nello stato dopo
      const st = i < Math.round(n * frac) ? s : s === 'acqua' ? 'ghiaccio' : 'acqua';
      let x, y, col;
      if (st === 'ghiaccio') {
        const A = 0.018 * sp, w = live ? this.clock * 18 + q.ph : q.ph;
        x = 0.22 + q.hx * 0.56 + A * Math.sin(w); y = 0.5 + q.hy * 0.44 + A * Math.cos(w * 1.3); col = 'sky';
      } else {
        const top = st === 'acqua' ? 0.52 : 0, v = (st === 'acqua' ? 0.16 : 0.5) * sp;
        if (live && !this.calm) {
          q.x += Math.cos(q.a) * v * this.fdt; q.y += Math.sin(q.a) * v * this.fdt;
          if (q.x < 0) { q.x = -q.x; q.a = Math.PI - q.a; } if (q.x > 1) { q.x = 2 - q.x; q.a = Math.PI - q.a; }
          if (q.y < 0) { q.y = -q.y; q.a = -q.a; } if (q.y > 1) { q.y = 2 - q.y; q.a = -q.a; }
        }
        x = q.x; y = top + q.y * (1 - top) * (st === 'acqua' ? 0.94 : 1); col = st === 'acqua' ? 'mint' : 'orange';
      }
      this.ball(x0 + 8 + x * (W - 16), y0 + 8 + y * (H - 16), 5, { color: this.c(col), fill: 0.5, width: 1.5, shine: false });
    });
  }

  // ---------- i tre stati ----------
  drawStates() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, s = p.t < 0 ? 'ghiaccio' : p.t < 100 ? 'acqua' : 'vapore';
    const half = p.t === 0 || p.t === 100 ? 0.5 : 1;
    this.particles(16, 66, W * 0.66, H - 30, s, p.t + 273.15, live, half);
    this.thermo(W * 0.84, 66, H - 36, p.t, -50, 150);
    const rows = [[E ? i18n('{t} gradi: {s}', { t: fmt(p.t, 0), s: SHORT[s]() }) : i18n('t = {t} °C: {s}', { t: fmt(p.t, 0), s: SOLID[s]() }), this.c('chalk'), 700]];
    if (live) rows.push([half < 1 ? (p.t === 0 ? i18n('a 0 °C il ghiaccio si scioglie') : i18n('a 100 °C l’acqua bolle')) : s === 'ghiaccio' ? i18n('le particelle vibrano al loro posto') : s === 'acqua' ? i18n('le particelle scivolano una sull’altra') : i18n('le particelle volano libere'), this.c(s === 'ghiaccio' ? 'sky' : s === 'acqua' ? 'mint' : 'orange'), 700]);
    this.box(rows);
  }

  // ---------- il ghiaccio sul fuoco ----------
  drawCurve() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u, tm = live ? p.min * u : 0, st = heatUp(p.P * 1000 * tm * 60);
    const cx = W * 0.5, yPot = H * 0.4, pw = Math.min(110, W * 0.34), top = yPot - 58, gx0 = 44, gx1 = W - 14, gy0 = H * 0.53, gy1 = H - 30, TMIN = -30, TMAX = 130, TOT = 40;
    // il fuoco (grande quanto P), la pentola e quello che c'è dentro
    if (live && u < 1) for (let j = 0; j < 4; j++) { const fl = 4 + 4 * p.P + 3 * Math.sin(this.clock * 14 + j * 2); this.line([[cx - 21 + j * 14, yPot + 18], [cx - 21 + j * 14, yPot + 18 - fl]], { color: this.c('orange'), width: 4, alpha: 0.85 }); }
    this.line([[cx - 34, yPot + 20], [cx + 34, yPot + 20]], { color: this.c('muted'), width: 3 });
    this.line([[cx - pw / 2, top], [cx - pw / 2, yPot], [cx + pw / 2, yPot], [cx + pw / 2, top]], { color: this.c('chalk'), width: 2.4 });
    const lvl = (yPot - top - 8) * 0.8 * (st.water + st.ice * 0.9);
    if (st.water > 0) { g.save(); g.fillStyle = this.c(st.T > 60 ? 'orange' : 'sky'); g.globalAlpha = 0.25; g.fillRect(cx - pw / 2 + 2, yPot - lvl, pw - 4, lvl - 1); g.restore(); }
    if (st.ice > 0) for (let k = 0; k < 6; k++) { const s = 14 * Math.sqrt(st.ice) + 3; this.line([[cx - pw / 2 + 10 + k * (pw - 20) / 6, yPot - 4 - (k % 2) * 12], [cx - pw / 2 + 10 + k * (pw - 20) / 6 + s, yPot - 4 - (k % 2) * 12], [cx - pw / 2 + 10 + k * (pw - 20) / 6 + s, yPot - 4 - (k % 2) * 12 - s], [cx - pw / 2 + 10 + k * (pw - 20) / 6, yPot - 4 - (k % 2) * 12 - s], [cx - pw / 2 + 10 + k * (pw - 20) / 6, yPot - 4 - (k % 2) * 12]], { color: this.c('sky'), width: 2 }); }
    if (st.state === 'bolle' && live) for (let k = 0; k < 6; k++) { const ph = (this.clock * 1.5 + k / 6) % 1; this.ball(cx - pw / 2 + 12 + ((k * 37) % (pw - 24)), yPot - 4 - ph * lvl * 0.9, 2 + ph * 2, { color: this.c('chalk'), fill: 0.1, width: 1.2, shine: false }); }
    if ((st.state === 'bolle' || st.state === 'vapore') && live) for (let k = 0; k < 3; k++) { const ph = (this.clock * 0.7 + k / 3) % 1; this.line([[cx - 20 + k * 20, top - 4 - ph * 30], [cx - 16 + k * 20, top - 14 - ph * 30]], { color: this.c('chalk'), width: 2, alpha: 0.7 * (1 - ph) }); }
    this.text(`${fmt(Math.round(st.T), 0)} °C`, cx + pw / 2 + 10, yPot - 20, { size: 13, color: this.c('coral'), weight: 700 });
    // il grafico: temperatura e tempo, con i due gradini
    const X = (m) => gx0 + (m / TOT) * (gx1 - gx0), Y = (T) => gy1 - ((T - TMIN) / (TMAX - TMIN)) * (gy1 - gy0);
    this.line([[gx0, gy0], [gx0, gy1], [gx1, gy1]], { color: this.c('muted'), width: 1.5 });
    for (const T of [0, 100]) { this.line([[gx0, Y(T)], [gx1, Y(T)]], { color: this.c('muted'), width: 1, dash: [3, 4], alpha: 0.6 }); this.text(`${T}`, gx0 - 5, Y(T) + 4, { size: 10, align: 'right', color: this.c('muted'), mono: true }); }
    this.text('°C', gx0 - 5, gy0 - 4, { size: 10, align: 'right', color: this.c('muted') });
    this.text(i18n('{m} minuti', { m: TOT }), gx1, gy1 + 14, { size: 10, align: 'right', color: this.c('muted') });
    if (live) { const pts = []; for (let i = 0; i <= 80; i++) { const m = (i / 80) * tm; pts.push([X(m), Y(heatUp(p.P * 1000 * m * 60).T)]); } this.line(pts, { color: this.c('coral'), width: 2.5 }); }
    const rows = [[E ? i18n('Un chilo di ghiaccio sul fuoco') : i18n('1 kg di ghiaccio a −20 °C, fuoco da {P} kW', { P: one(p.P) }), this.c('chalk'), 700]];
    if (live) {
      rows.push([i18n('dopo {m} minuti: {s}', { m: fmt(Math.round(tm), 0), s: STATE[st.state]() }), this.c(st.state === 'fonde' || st.state === 'bolle' ? 'mint' : 'sky'), 700]);
      if (!E) rows.push([i18n('calore dato: {Q} kJ', { Q: fmt(Math.round(p.P * tm * 60), 0) }), this.c('orange'), 600]);
    }
    this.box(rows);
  }

  // ---------- il ghiaccio nella limonata ----------
  drawDrink() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u, r = drink(p.d, p.g), k = live ? easeOut(u) : 0;
    const T = T_DRINK + (r.T - T_DRINK) * k, left = p.g + (r.left - p.g) * k;
    const cx = W * 0.42, yb = H - 40, gw = Math.min(150, W * 0.42), gh = Math.min(H * 0.5, 110 + p.d * 60), top = yb - gh;
    // il bicchiere, la limonata, i cubetti che si sciolgono
    this.line([[cx - gw / 2, top], [cx - gw / 2 + 10, yb], [cx + gw / 2 - 10, yb], [cx + gw / 2, top]], { color: this.c('chalk'), width: 2.4 });
    const lvl = gh * 0.82, yl = yb - lvl;
    g.save(); g.fillStyle = this.c('sun'); g.globalAlpha = 0.22; g.beginPath(); g.moveTo(cx - gw / 2 + 10 * (1 - lvl / gh) + 1, yl); g.lineTo(cx - gw / 2 + 11, yb - 1); g.lineTo(cx + gw / 2 - 11, yb - 1); g.lineTo(cx + gw / 2 - 10 * (1 - lvl / gh) - 1, yl); g.closePath(); g.fill(); g.restore();
    const n = Math.ceil(p.g / 25);
    for (let i = 0; i < n; i++) {
      const f = p.g ? left / p.g : 0, s = 16 * Math.cbrt(Math.max(0, f)), x = cx - gw / 2 + 18 + (i % 4) * ((gw - 40) / 3), y = yl + 6 + Math.floor(i / 4) * 22;
      if (s > 1) this.line([[x, y], [x + s, y], [x + s, y + s], [x, y + s], [x, y]], { color: this.c('sky'), width: 2 });
    }
    this.thermo(cx + gw / 2 + 26, top + 10, yb - 14, T, -5, 35);
    const rows = [[E ? i18n('{d} litri di limonata e {g} grammi di ghiaccio', { d: one(p.d), g: fmt(p.g, 0) }) : i18n('{d} L di limonata a 30 °C, {g} g di ghiaccio a 0 °C', { d: one(p.d), g: fmt(p.g, 0) }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([r.left > 0.5 ? i18n('avanza del ghiaccio: la limonata è a 0 °C') : i18n('il ghiaccio si scioglie tutto: la limonata è a {T} °C', { T: one(r.T) }), this.c('mint'), 700]);
      if (!E) rows.push([i18n('sciogliere un grammo di ghiaccio costa 334 J'), this.c('orange'), 600]);
    }
    this.box(rows);
  }

  // ---------- bollire in montagna ----------
  drawPot() {
    const g = this.ctx, p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, b = boilT(p.alt, p.cooker), yb = H - 30, peak = 8849;
    // la montagna, con la casetta all'altitudine scelta
    const mx0 = W * 0.44, mx1 = W - 8, myTop = 90, Y = (a) => yb - (a / peak) * (yb - myTop), apex = W * 0.76;
    g.save(); g.fillStyle = this.c('muted'); g.globalAlpha = 0.18; g.beginPath(); g.moveTo(mx0, yb); g.lineTo(apex, myTop); g.lineTo(mx1, yb); g.closePath(); g.fill(); g.restore();
    this.line([[mx0, yb], [apex, myTop], [mx1, yb]], { color: this.c('muted'), width: 2 });
    this.line([[apex - 18, myTop + 26], [apex, myTop], [apex + 16, myTop + 22]], { color: this.c('chalk'), width: 3 });
    const hx = mx0 + ((apex - mx0) * p.alt) / peak, hy = Y(p.alt);
    this.line([[hx - 9, hy], [hx - 9, hy - 10], [hx, hy - 18], [hx + 9, hy - 10], [hx + 9, hy], [hx - 9, hy]], { color: this.c('sun'), width: 2 });
    this.text(`${fmt(p.alt, 0)} m`, hx - 12, hy + 4, { size: 10, align: 'right', color: this.c('sun'), mono: true });
    // la pentola, ingrandita, con le bolle e il termometro
    const cx = W * 0.22, py = H * 0.62, pw = Math.min(96, W * 0.3), ptop = py - 52;
    this.line([[cx - pw / 2, ptop], [cx - pw / 2, py], [cx + pw / 2, py], [cx + pw / 2, ptop]], { color: this.c('chalk'), width: 2.4 });
    g.save(); g.fillStyle = this.c('sky'); g.globalAlpha = 0.22; g.fillRect(cx - pw / 2 + 2, ptop + 12, pw - 4, py - ptop - 13); g.restore();
    if (p.cooker) { this.line([[cx - pw / 2 - 4, ptop], [cx + pw / 2 + 4, ptop]], { color: this.c('chalk'), width: 4 }); this.line([[cx, ptop], [cx, ptop - 10]], { color: this.c('coral'), width: 4 }); }
    if (live) for (let k = 0; k < 6; k++) { const ph = (this.clock * 1.5 + k / 6) % 1; this.ball(cx - pw / 2 + 12 + ((k * 31) % (pw - 24)), py - 4 - ph * (py - ptop - 18), 2 + ph * 2, { color: this.c('chalk'), fill: 0.1, width: 1.2, shine: false }); }
    if (live) this.text(`${fmt(Math.round(b.Tb), 0)} °C`, cx, py + 22, { size: 14, align: 'center', color: this.c('coral'), weight: 700 });
    const rows = [[E ? (p.cooker ? i18n('Pentola a pressione, a {h} metri', { h: fmt(p.alt, 0) }) : i18n('Pentola aperta, a {h} metri', { h: fmt(p.alt, 0) })) : i18n('{h} m: l’aria preme {P} bar', { h: fmt(p.alt, 0), P: fmt(1.013 * Math.exp(-p.alt / 8400), 2) }), this.c('chalk'), 700]];
    if (!E && p.cooker) rows.push([i18n('con la pentola a pressione: {P} bar', { P: fmt(b.P, 2) }), this.c('chalk'), 600]);
    if (this.result) rows.push([i18n('l’acqua bolle a {T} °C', { T: fmt(Math.round(b.Tb), 0) }), this.c(b.Tb < 95 ? 'sky' : b.Tb > 105 ? 'coral' : 'mint'), 700]);
    this.box(rows);
  }

  // ---------- il fresco del sudore ----------
  drawSweat() {
    const p = this.params, W = this.W, H = this.H, E = p.lens === 'e';
    const live = this.running || !!this.result, u = this.result ? 1 : this.u, k = live ? easeOut(u) : 0, Tw = T_DRINK + (wetBulb(p.hum, p.wind) - T_DRINK) * k;
    const y0 = H * 0.24, y1 = H - 60, xa = W * 0.32, xb = W * 0.66;
    this.thermo(xa, y0, y1, T_DRINK, 0, 40);
    this.thermo(xb, y0, y1, Tw, 0, 40);
    // la pezza bagnata sul bulbo, e l'acqua che evapora (di più se l'aria è secca e c'è vento)
    this.ctx.save(); this.ctx.fillStyle = this.c('sky'); this.ctx.globalAlpha = 0.35; this.ctx.beginPath(); this.ctx.ellipse(xb, y1 + 4, 13, 16, 0, 0, 7); this.ctx.fill(); this.ctx.restore();
    const ev = (1 - p.hum / 100) * (p.wind ? 1 : 0.6);
    if (live) for (let i = 0; i < Math.round(1 + ev * 7); i++) { const ph = (this.clock * (0.6 + ev) + i / 7) % 1, dx = p.wind ? ph * 50 : Math.sin(ph * 6 + i) * 6; this.line([[xb - 8 + (i % 3) * 8 + dx, y1 - 10 - ph * 50], [xb - 6 + (i % 3) * 8 + dx, y1 - 18 - ph * 50]], { color: this.c('chalk'), width: 1.8, alpha: 0.7 * (1 - ph) }); }
    if (p.wind && live) for (let i = 0; i < 4; i++) { const ph = (this.clock * 0.9 + i / 4) % 1; this.line([[10 + ph * (W - 20), y0 + 40 + i * 30], [30 + ph * (W - 20), y0 + 40 + i * 30]], { color: this.c('muted'), width: 1.6, alpha: 0.6 }); }
    this.text(i18n('asciutto'), xa, y1 + 30, { size: 11, align: 'center', color: this.c('muted'), weight: 700 });
    this.text(i18n('bagnato'), xb, y1 + 30, { size: 11, align: 'center', color: this.c('sky'), weight: 700 });
    const rows = [[E ? i18n('Aria a 30 gradi, umidità {h}%', { h: p.hum }) : i18n('Aria a 30 °C, umidità {h}%', { h: p.hum }), this.c('chalk'), 700]];
    if (this.result) {
      rows.push([E ? i18n('il termometro bagnato scende a {T} gradi', { T: fmt(Math.round(this.result.wet), 0) }) : i18n('il termometro bagnato scende a {T} °C', { T: one(this.result.wet) }), this.c('mint'), 700]);
      rows.push([i18n('l’acqua che evapora porta via calore'), this.c('sky'), 600]);
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
