// Gli oggetti dei film dell'Officina: il carrello, i pavimenti, il paraurti, la palla, le frecce delle forze.
// Tutto in metri, con il terreno a y = 0, come nel resto dei film (toon.js).
import { COL, lerp } from '../toon.js';
import { rgba, quad } from '../toonkit.js';

// il carrello: lungo L, cassone da Y0 a Y0 + H, ruote di raggio R
export const CART = { L: 1.1, H: 0.3, Y0: 0.2, R: 0.13, HX: -0.12, HY: 0.95 };   // HX, HY: la maniglia, rispetto alla coda

// il carrello con la coda in x. dist: la strada fatta (fa girare le ruote); cup: la coppetta della palla, sul davanti
export function cart(D, x, col = COL.sky, o = {}) {
  const { L, H, Y0, R } = CART, y1 = Y0 + H, xa = x, xb = x + L;
  quad(D, [[xa, Y0], [xb, Y0], [xb, y1], [xa, y1]], col, { w: 0.045, a: 0.2 });
  // il manico dietro, alto come una mano: si spinge e si tira da lì (CART.HAND)
  if (o.handle !== false) { D.path([[xa + 0.04, y1], [xa - 0.12, CART.HY]], 0.04, col); D.circle(xa - 0.12, CART.HY, 0.045, col, { w: 0.03, fill: '#000' }); }
  if (o.cup) D.path([[xb - 0.42, y1], [xb - 0.4, y1 + 0.09], [xb - 0.12, y1 + 0.09], [xb - 0.08, y1 + 0.14]], 0.035, col);
  const a = -(o.dist ?? x) / R;
  for (const wx of [xa + 0.24, xb - 0.24]) {
    D.circle(wx, R, R, col, { w: 0.04, fill: '#000' });
    D.seg([wx + Math.cos(a) * R * 0.78, R + Math.sin(a) * R * 0.78], [wx - Math.cos(a) * R * 0.78, R - Math.sin(a) * R * 0.78], 0.03, col);
    D.circle(wx, R, 0.025, null, { fill: col });
  }
}

// i pavimenti: tappeto (a pelo), ghiaccio (lucido, con i riflessi), binario liscio (una riga che brilla)
export const FLOOR_COL = { tappeto: COL.coral, ghiaccio: COL.sky, binario: COL.violet };
export function floor(D, kind, x0, x1, o = {}) {
  const a = o.alpha ?? 1;
  if (x1 <= x0 || a <= 0) return;
  D.alpha(a, () => {
    if (kind === 'tappeto') {
      quad(D, [[x0, 0], [x1, 0], [x1, 0.07], [x0, 0.07]], COL.coral, { w: 0.02, a: 0.2, line: false });
      for (let x = Math.ceil(x0 / 0.09) * 0.09; x < x1; x += 0.09) D.seg([x, 0.01], [x + 0.025 * Math.sin(x * 37), 0.075], 0.014, rgba(COL.coral, 0.75));
    } else if (kind === 'ghiaccio') {
      quad(D, [[x0, 0], [x1, 0], [x1, 0.09], [x0, 0.09]], COL.sky, { w: 0.02, a: 0.42, line: false });
      D.seg([x0, 0.09], [x1, 0.09], 0.022, rgba('#e8f6ff', 0.9));
      for (let x = Math.ceil(x0 / 1.3) * 1.3 + 0.4; x < x1 - 0.2; x += 1.3) { D.seg([x, 0.025], [x + 0.26, 0.07], 0.016, rgba('#ffffff', 0.8)); D.seg([x + 0.34, 0.03], [x + 0.44, 0.06], 0.013, rgba('#ffffff', 0.6)); }
    } else {
      D.seg([x0, 0.035], [x1, 0.035], 0.05, rgba(COL.violet, 0.9));
      D.seg([x0, 0.035], [x1, 0.035], 0.016, rgba('#ffffff', 0.85));
    }
  });
}

// il paraurti alla fine del binario: un blocco con la faccia di gomma a sinistra (x)
export const BUMP_H = 0.78;
export function bumper(D, x, o = {}) {
  const k = 1 + (o.bump || 0), H = BUMP_H;
  quad(D, [[x + 0.06, 0], [x + 0.46, 0], [x + 0.46, H], [x + 0.06, H]], COL.violet, { w: 0.05, a: 0.28 });
  for (let y = 0.08; y < H - 0.1; y += 0.16) D.seg([x + 0.1, y], [x + 0.42, y + 0.1], 0.022, rgba(COL.violet, 0.75));
  // la faccia di gomma, che si schiaccia un attimo quando il carrello sbatte
  quad(D, [[x - 0.06 * k, 0.16], [x + 0.06, 0.16], [x + 0.06, 0.5], [x - 0.06 * k, 0.5]], COL.ink, { w: 0.04, a: 0.45 });
}

// una palla
export const ball = (D, x, y, r = 0.13, col = COL.orange, spin = 0) => {
  D.circle(x, y, r, col, { w: 0.04, fill: rgba(col, 0.3) });
  D.seg([x + Math.cos(spin) * r * 0.6, y + Math.sin(spin) * r * 0.6], [x - Math.cos(spin) * r * 0.6, y - Math.sin(spin) * r * 0.6], 0.025, col);
};

// la freccia di una forza: spessa, rossa, con la punta che si gonfia quando nasce (k da 0 a 1)
export function force(D, a, b, k = 1, col = COL.coral, w = 0.08) {
  if (k <= 0.01) return;
  const e = [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], L = Math.hypot(e[0] - a[0], e[1] - a[1]);
  if (L < 0.03) return;
  D.arrow(a, e, w, col, Math.min(0.3, L * 0.5));
}

// una molla fra due punti, a zig zag: n spire, larga w
export function spring(D, a, b, col = COL.ink, o = {}) {
  const n = o.n ?? 7, w = o.w ?? 0.12, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, pts = [a];
  for (let i = 1; i < 2 * n; i++) { const u = i / (2 * n), s = i % 2 ? 1 : -1; pts.push([a[0] + dx * u + nx * w * s, a[1] + dy * u + ny * w * s]); }
  pts.push(b);
  D.path(pts, o.lw ?? 0.03, col);
}

// un blocco da 1 kg (un quadrato pieno, del colore del sole), con l'angolo in basso a sinistra in (x, y)
export const block = (D, x, y, s = 0.26, col = COL.sun, k = 1) => quad(D, [[x, y], [x + s * k, y], [x + s * k, y + s * k], [x, y + s * k]], col, { w: 0.035, a: 0.3 });

