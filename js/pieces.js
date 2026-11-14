// Disegni a linee dei pezzi del parco (al posto delle emoji): si disegnano da soli e poi si muovono un poco.
const svg = (body, cls = '') => `<svg class="pz ${cls}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const P = (d, extra = '') => `<path pathLength="1" d="${d}" ${extra}/>`;

export const PIECE_SVG = {
  altalena: svg(
    P('M8 58L18 8M30 58L18 8M34 58L46 8M58 58L46 8M18 8h28') +
    `<g class="pz-swing">${P('M26 9v30M38 9v30')}${P('M23 39h18', 'stroke="var(--orange)"')}</g>`),
  cartelli: svg(
    P('M20 60V8') + P('M8 12h26l5 5-5 5H8z', 'stroke="var(--orange)"') + P('M8 28h24l5 5-5 5H8z', 'stroke="var(--sky)"') +
    `<g class="pz-meter">${P('M46 58V18M42 18h8M42 58h8M43 28h6M43 38h6M43 48h6', 'stroke="var(--mint)"')}</g>`),
  trenino: svg(
    `<g class="pz-train">${P('M6 44V26h14v-8h8v26z')}${P('M30 32h12v12H30zM46 32h12v12H46z', 'stroke="var(--sky)"')}` +
    `<g class="pz-wheel">${P('M10 48a4 4 0 1 0 8 0a4 4 0 1 0-8 0M14 44v8')}</g><g class="pz-wheel">${P('M20 48a4 4 0 1 0 8 0a4 4 0 1 0-8 0M24 44v8')}</g>` +
    `${P('M36 48a3 3 0 1 0 0 .1M52 48a3 3 0 1 0 0 .1')}${P('M42 38h4')}</g>` +
    `<g class="pz-smoke">${P('M10 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0M14 10a4 4 0 1 0 8 0a4 4 0 1 0-8 0', 'stroke="var(--muted)"')}</g>` + P('M4 58h56', 'stroke="var(--muted)"')),
  torre: svg(
    P('M28 60V6M36 60V6M28 14l8 8M36 22l-8 8M28 30l8 8M36 38l-8 8M24 6h16M18 60h28') +
    `<g class="pz-drop">${P('M20 10h24v8H20z', 'stroke="var(--coral)"')}</g>`),
  bersaglio: svg(
    P('M61 38a9 9 0 1 0-18 0a9 9 0 1 0 18 0M57 38a5 5 0 1 0-10 0a5 5 0 1 0 10 0') + P('M54 38a2 2 0 1 0-4 0a2 2 0 1 0 4 0', 'stroke="var(--coral)"') + P('M52 47v13M46 60h12') +
    `<path class="pz-arc" pathLength="1" d="M4 56Q20 2 52 38" stroke="var(--orange)" stroke-dasharray=".04 .04"/>` +
    `<circle class="pz-ball" r="3" fill="var(--orange)" stroke="none"><animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.7;1" calcMode="linear" path="M4 56Q20 2 52 38"/></circle>`),
  grado: svg(P('M4 24l28-14 28 14-28 14z') + P('M14 30v14c9 6 27 6 36 0V30') + P('M60 24v18', 'stroke="var(--sun)"') + `<g class="pz-tassel">${P('M60 42l-3 8h6z', 'stroke="var(--sun)"')}</g>`),
};

export const pieceSVG = (id) => PIECE_SVG[id] || PIECE_SVG.grado;
