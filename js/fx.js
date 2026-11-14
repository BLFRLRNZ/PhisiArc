// Piccole animazioni dell'interfaccia, tutte a linee: stelle che si disegnano, coriandoli geometrici
// che volano in parabola, numeri che contano, spunta che si traccia da sola.
const calm = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

const STAR = 'M12 2.6l2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5L2.6 9.5l6.5-.9z';

// Tre stelle: quelle prese si disegnano una dopo l'altra e poi si riempiono.
export function starsSVG(n) {
  return [0, 1, 2].map((i) => `<svg class="star ${i < n ? 'got' : ''}" style="--i:${i}" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="${STAR}"/></svg>`).join('');
}

// Spunta che si traccia (risposta giusta).
export const CHECK = '<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M5 12.5l4.5 4.5L19 7"/></svg>';

// Un numero che sale da 0 al valore.
export function countUp(el, to, { dur = 900, prefix = '', suffix = '' } = {}) {
  if (calm()) { el.textContent = prefix + to + suffix; return; }
  const t0 = performance.now();
  const tick = (now) => {
    const u = Math.min(1, (now - t0) / dur), e = 1 - (1 - u) ** 3;
    el.textContent = prefix + Math.round(to * e) + suffix;
    if (u < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Coriandoli geometrici: triangoli, quadrati, cerchi e trattini lanciati in parabola (gravità vera, niente vento).
export function confetti(host, { colors = ['#7cc8ff', '#ffd166', '#4fe3b5', '#ff7ad9', '#ff9b54'], n = 34, x = 0.5, y = 0.32 } = {}) {
  if (calm()) return;
  const cv = document.createElement('canvas');
  cv.className = 'confetti';
  host.append(cv);
  const r = host.getBoundingClientRect(), d = window.devicePixelRatio || 1;
  cv.width = r.width * d; cv.height = r.height * d;
  const g = cv.getContext('2d');
  g.scale(d, d);
  const W = r.width, H = r.height, G = 900;
  const parts = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.1, v = 340 + Math.random() * 300;
    return { x: W * x, y: H * y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 9,
      s: 5 + Math.random() * 6, kind: i % 4, col: colors[i % colors.length], trail: [] };
  });
  let last = performance.now(), t = 0;
  const frame = (now) => {
    const dt = Math.min(0.033, (now - last) / 1000); last = now; t += dt;
    g.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += G * dt; p.vx *= 0.995; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      p.trail.push([p.x, p.y]); if (p.trail.length > 7) p.trail.shift();
      const fade = Math.max(0, 1 - Math.max(0, t - 1.2) / 0.6);
      g.globalAlpha = 0.35 * fade; g.strokeStyle = p.col; g.lineWidth = 1.5; g.lineCap = 'round';
      g.beginPath(); p.trail.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.stroke();
      g.globalAlpha = fade; g.lineWidth = 2; g.lineJoin = 'round';
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.beginPath();
      if (p.kind === 0) { g.moveTo(0, -p.s); g.lineTo(p.s * 0.87, p.s * 0.5); g.lineTo(-p.s * 0.87, p.s * 0.5); g.closePath(); }
      else if (p.kind === 1) g.rect(-p.s * 0.7, -p.s * 0.7, p.s * 1.4, p.s * 1.4);
      else if (p.kind === 2) g.arc(0, 0, p.s * 0.75, 0, Math.PI * 2);
      else { g.moveTo(-p.s, 0); g.lineTo(p.s, 0); }
      g.stroke(); g.restore();
    }
    if (t < 1.85 && cv.isConnected) requestAnimationFrame(frame); else cv.remove();
  };
  requestAnimationFrame(frame);
}
