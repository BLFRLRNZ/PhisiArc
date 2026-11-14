// Zoom delle grandezze: dall'atomo alla Via Lattea, una potenza di 10 alla volta.
import { Sim } from './base.js';

export const OBJECTS = [
  { name: 'atomo', size: 1e-10, icon: '⚛️' },
  { name: 'virus', size: 1e-7, icon: '🦠' },
  { name: 'globulo rosso', size: 8e-6, icon: '🔴' },
  { name: 'granello di sabbia', size: 1e-3, icon: '🟤' },
  { name: 'formica', size: 4e-3, icon: '🐜' },
  { name: 'mela', size: 8e-2, icon: '🍎' },
  { name: 'persona', size: 1.7, icon: '🧍' },
  { name: 'balena', size: 25, icon: '🐋' },
  { name: 'Torre Eiffel', size: 330, icon: '🗼' },
  { name: 'Everest', size: 8.8e3, icon: '🏔️' },
  { name: 'Italia (lunghezza)', size: 1.2e6, icon: '🗺️' },
  { name: 'Terra', size: 1.27e7, icon: '🌍' },
  { name: 'Sole', size: 1.39e9, icon: '☀️' },
  { name: 'Sistema solare', size: 9e12, icon: '🪐' },
  { name: 'Via Lattea', size: 1e21, icon: '🌌' },
];

const words = (e) => {
  const r = Math.round(e);
  const map = {
    '-10': 'un decimo di miliardesimo di metro', '-9': 'un nanometro', '-6': 'un micrometro',
    '-3': 'un millimetro', '-2': 'un centimetro', 0: 'un metro', 3: 'un chilometro',
    6: 'mille chilometri', 9: 'un milione di chilometri',
  };
  return map[r] || '';
};

export const sup = (n) => String(n).replace(/-/g, '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);

export class Scale extends Sim {
  static staticSim = true;
  static controls = {
    exp: { label: 'Zoom (potenza di 10)', min: -10, max: 21, step: 0.1, unit: '' },
  };

  defaults() { return { exp: 0 }; }

  // Zoom animato verso un valore (usato dagli esperimenti guidati).
  animateTo(p) {
    return new Promise((res) => {
      const from = this.params.exp, to = p.exp ?? from;
      const t0 = performance.now(), dur = 1400;
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        this.params.exp = from + (to - from) * e;
        this.draw();
        if (this.onTick) this.onTick(this.params);
        if (k < 1) requestAnimationFrame(tick);
        else res({ exp: to });
      };
      requestAnimationFrame(tick);
    });
  }

  draw() {
    const g = this.ctx, W = this.W, H = this.H, e = this.params.exp;
    this.clear();
    const base = H * 0.26; // un oggetto grande quanto la scala attuale
    const spread = W * 0.28;
    const groundY = H - 34;
    for (const o of OBJECTS) {
      const le = Math.log10(o.size);
      const px = base * Math.pow(10, le - e);
      if (px < 6 || px > H * 3) continue;
      const x = W / 2 + (le - e) * spread;
      if (x < -px || x > W + px) continue;
      const fs = Math.min(px, H * 2.5);
      g.font = `${fs}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'bottom';
      g.fillText(o.icon, x, groundY);
      g.textBaseline = 'alphabetic';
      if (fs > 14 && fs < H * 0.9) {
        this.text(o.name, x, groundY + 16, { size: 12, align: 'center', color: this.c('muted') });
      }
    }
    // barra di scala
    const r = Math.round(e * 10) / 10;
    const bx0 = W - 14 - base, bx1 = W - 14;
    this.line([[bx0, 18], [bx0, 30]], { color: this.c('sky'), width: 2 });
    this.line([[bx1, 18], [bx1, 30]], { color: this.c('sky'), width: 2 });
    this.arrow(bx0 + base / 2, 24, bx1, 24, { color: this.c('sky'), width: 2, head: 6 });
    this.arrow(bx0 + base / 2, 24, bx0, 24, { color: this.c('sky'), width: 2, head: 6 });
    this.text(`questa barra = 10${sup(Math.round(r))} m`, W - 14, 44, { size: 12, align: 'right', weight: 600 });
    this.text(`10${sup(Math.round(r))} m`, 14, 30, { size: 22, weight: 700, color: this.c('accent2') });
    const w = words(r);
    if (w && Math.abs(r - Math.round(r)) < 0.15) this.text(w, 14, 50, { size: 13, color: this.c('muted') });
  }
}
