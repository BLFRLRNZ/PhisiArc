// Disegni degli oggetti che cadono (piuma, martello, pallina, boccia, foglio, sasso, cabina della torre).
// Ogni oggetto è alto circa 30 px ed è appoggiato con la base sulla y data.
// sim: la simulazione (per colori e tratti), o: lo stato dell'oggetto (key, v, tEnd), alpha: trasparenza (per le ombre).

const arc = (cx, cy, rx, ry, a0, a1, n = 20) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(u), cy + ry * Math.sin(u)];
  });

export function drawFallObject(sim, o, x, y, alpha = 1) {
  const g = sim.ctx;
  const cy = y - 15;
  const t = sim.calm ? 0 : sim.clock;
  const moving = o.v > 0.05 && o.tEnd == null;

  // F = tratto con un velo di colore dentro (come i personaggi). Punti relativi al centro, ruotati di rot.
  const F = (pts, cn, { f = 0, a = 1, w = 2.2, rot = 0 } = {}) => {
    const c = Math.cos(rot), sn = Math.sin(rot);
    const P = pts.map(([px, py]) => [x + px * c - py * sn, cy + px * sn + py * c]);
    const col = sim.c(cn);
    if (f) {
      g.save();
      g.globalAlpha = alpha * f;
      g.fillStyle = col;
      g.beginPath();
      P.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
      g.closePath();
      g.fill();
      g.restore();
    }
    sim.line(P, { color: col, width: w, alpha: alpha * a });
  };

  switch (o.key) {
    case 'piuma': {
      // ondeggia mentre cade
      const rot = moving ? Math.sin(t * 5) * 0.4 : -0.15;
      const vane = [];
      for (let i = 0; i <= 12; i++) { const u = i / 12; vane.push([Math.sin(Math.PI * Math.min(1, u * 1.1)) * 8, 12 - u * 26]); }
      for (let i = 12; i >= 0; i--) { const u = i / 12; vane.push([-Math.sin(Math.PI * Math.min(1, u * 1.1)) * 7, 12 - u * 26 - 1]); }
      F(vane, 'chalk', { f: 0.16, w: 1.6, rot });
      F([[0, 16], [0, -14]], 'chalk', { w: 1.8, rot });
      for (let yy = -9; yy <= 8; yy += 3.4) {
        F([[0, yy], [5, yy - 3.5]], 'chalk', { a: 0.45, w: 1, rot });
        F([[0, yy + 1], [-5, yy - 2.5]], 'chalk', { a: 0.45, w: 1, rot });
      }
      F([[2, 2], [8, 0]], 'sky', { a: 0.7, w: 1.4, rot });
      break;
    }
    case 'martello':
      F([[-2, -15], [2, -15], [2.5, 4], [-2.5, 4], [-2, -15]], 'orange', { f: 0.3, w: 1.8 }); // manico
      for (const yy of [-10, -6, -2]) F([[-2, yy], [2, yy + 1.5]], 'orange', { a: 0.5, w: 1 });
      F([[-13, 4], [10, 4], [13, 7], [13, 11], [10, 14], [-13, 14], [-15, 9], [-13, 4]], 'muted', { f: 0.35, w: 2 }); // testa
      F([[-11, 7], [8, 7]], 'chalk', { a: 0.5, w: 1.2 });
      break;
    case 'pallina':
      sim.ball(x, cy + 6, 8, { color: sim.c('sun'), fill: 0.25, alpha });
      F(arc(0, 6, 8, 3, 0, Math.PI), 'orange', { a: 0.6, w: 1.2 });
      break;
    case 'boccia':
      sim.ball(x, cy + 2, 12, { color: sim.c('chalk'), fill: 0.3, alpha });
      F(arc(0, 2, 12, 4.5, 0.15, Math.PI - 0.15), 'muted', { a: 0.7, w: 1.2 });
      F(arc(0, 2, 4.5, 12, -1.3, 1.3), 'muted', { a: 0.5, w: 1.2 });
      break;
    case 'foglio': {
      // sventola mentre cade
      const fl = moving ? Math.sin(t * 5) * 4 : 0, fold = moving ? Math.cos(t * 5) * 2 : 0;
      F([[-14, -4 + fl], [0, -5 + fold], [14, -4 - fl], [14, 9 - fl], [0, 8 + fold], [-14, 9 + fl], [-14, -4 + fl]], 'chalk', { f: 0.14, w: 1.8 });
      for (let k = 0; k < 3; k++) F([[-10, k * 3 + fl * 0.6], [10 - (k === 2 ? 6 : 0), k * 3 - fl * 0.6]], 'sky', { a: 0.5, w: 1 });
      F([[8, -4.4 - fl], [14, 1 - fl]], 'chalk', { a: 0.5, w: 1 });
      break;
    }
    case 'sasso':
      F([[-14, 12], [-14, 4], [-9, -4], [-2, -7], [6, -6], [12, -1], [14, 6], [13, 12], [-14, 12]], 'muted', { f: 0.3, w: 2 });
      F([[-6, -3], [-2, 3], [5, 1]], 'chalk', { a: 0.35, w: 1.1 });
      F([[-9, 7], [-4, 5]], 'chalk', { a: 0.3, w: 1 });
      F([[-8, -2], [-3, -5]], 'chalk', { a: 0.6, w: 1.2 });
      break;
    default: // la cabina della torre a caduta libera, con tre passeggeri
      F([[-6, -20], [-6, -14]], 'muted', { w: 1.6 });
      F([[6, -20], [6, -14]], 'muted', { w: 1.6 });
      F([[-13, -14], [13, -14], [13, 14], [-13, 14], [-13, -14]], 'coral', { f: 0.18, w: 2 });
      F([[-10, -11], [10, -11], [10, 0], [-10, 0], [-10, -11]], 'sky', { f: 0.15, w: 1.2 });
      for (const sx of [-5, 0, 5]) {
        F([[sx - 1.5, -2], [sx - 1.5, -6]], 'chalk', { a: 0.8, w: 1.4 });
        F(arc(sx - 1.5, -7.5, 1.4, 1.4, 0, Math.PI * 2, 8), 'chalk', { a: 0.8, w: 1.2 });
      }
      F([[-13, 4], [13, 4]], 'coral', { a: 0.6, w: 1.2 });
      for (const sx of [-8, 0, 8]) F([[sx, 6], [sx, 12]], 'coral', { a: 0.45, w: 1 });
  }
}
