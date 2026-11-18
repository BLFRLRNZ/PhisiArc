// Disegni a linee dei pezzi del parco (al posto delle emoji): si disegnano da soli, si colorano e poi si muovono.
const svg = (body) => `<svg class="pz" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
// P = tratto che si disegna da solo; col = colore; fill = velo di colore che compare dopo.
const P = (d, col, fill, w) => `<path pathLength="1" d="${d}"${col ? ` stroke="var(--${col})"` : ''}${fill ? ` class="fl" fill="var(--${fill})"` : ''}${w ? ` stroke-width="${w}"` : ''}/>`;
const C = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

export const PIECE_SVG = {
  altalena: svg(
    P('M4 60h56', 'green', null, 1.6) + P('M7 59l3 1M14 59l3 1M44 59l3 1M52 59l3 1', 'green', null, 1.2) +
    P('M10 58L18 8M26 58L18 8M38 58L46 8M54 58L46 8', 'sun') + P('M14 34h8M42 34h8', 'sun', null, 1.6) + P('M15 8h34', 'orange', null, 3) +
    `<g class="pz-swing">${P('M27 9v28M37 9v28', 'muted', null, 1.4)}${P('M24 37h16l-1 3H25z', 'orange', 'orange')}` +
    `${P(C(32, 25, 3.2), 'sky', 'sky')}${P('M32 28.5v6M28 31l4 2 4-2M32 34.5l-3 2.5M32 34.5l3 2.5', 'sky', null, 1.6)}</g>`),
  cartelli: svg(
    P('M4 60h56', 'muted', null, 1.4) + P('M22 60V6', 'chalk') +
    P('M8 10h26l5 5-5 5H8z', 'orange', 'orange') + P('M12 15h16', 'chalk', null, 1.2) +
    P('M36 26H12l-5 5 5 5h24z', 'sky', 'sky') + P('M16 31h14', 'chalk', null, 1.2) +
    `<g class="pz-meter">${P('M50 58V16M46 16h8M46 58h8', 'mint')}${P('M47 26h3M47 37h6M47 48h3', 'mint', null, 1.4)}</g>` +
    P(C(42, 41, 2.6), 'pink', 'pink') + P('M42 44v7M42 51l-2 7M42 51l2 7M39 47h6', 'pink', null, 1.6)),
  trenino: svg(
    P('M2 56h60', 'muted', null, 1.4) + P('M6 59v-3M14 59v-3M22 59v-3M30 59v-3M38 59v-3M46 59v-3M54 59v-3', 'muted', null, 1.2) +
    `<g class="pz-train">` +
    P('M4 46V30h10v-8h10v24z', 'coral', 'coral') + P('M16 25h6v8h-6z', 'sky', 'sky', 1.4) + P('M7 26v-6h4v6', 'chalk', null, 1.6) + P('M4 46l-2 4h4', 'coral', null, 1.6) +
    P('M28 34h14v12H28zM46 34h14v12H46z', 'sky', 'sky') + P('M31 37h3v4h-3zM36 37h3v4h-3zM49 37h3v4h-3zM54 37h3v4h-3z', 'chalk', null, 1.2) + P('M24 44h4M42 44h4', 'chalk', null, 1.6) +
    `<g class="pz-wheel">${P(C(10, 50, 4) + 'M10 46v8M6 50h8', 'chalk', null, 1.6)}</g><g class="pz-wheel">${P(C(20, 50, 4) + 'M20 46v8M16 50h8', 'chalk', null, 1.6)}</g>` +
    `<g class="pz-wheel">${P(C(33, 50, 3) + 'M33 47v6', 'chalk', null, 1.4)}</g><g class="pz-wheel">${P(C(55, 50, 3) + 'M55 47v6', 'chalk', null, 1.4)}</g></g>` +
    `<g class="pz-smoke">${P(C(10, 14, 3) + C(15, 7, 4), 'muted', 'muted', 1.6)}</g>`),
  torre: svg(
    P('M4 60h56', 'muted', null, 1.4) + P('M26 60V8M38 60V8', 'chalk') + P('M26 14l12 8M38 22l-12 8M26 30l12 8M38 38l-12 8M26 46l12 8', 'chalk', null, 1) +
    P('M22 8h20l-3-4H25z', 'sun', 'sun') + P('M18 60h28', 'chalk') + P('M32 4V1', 'coral', null, 1.6) +
    `<g class="pz-drop">${P('M19 10h26v10H19z', 'coral', 'coral')}${P('M23 13v4M28 13v4M33 13v4M38 13v4', 'chalk', null, 1.2)}${P('M14 8v6M50 8v6', 'sky', null, 1.2)}</g>`),
  bersaglio: svg(
    P('M2 60h60', 'muted', null, 1.4) + P(C(52, 34, 10), 'chalk', 'coral') + P(C(52, 34, 6), 'chalk', 'chalk') + P(C(52, 34, 2.5), 'coral', 'coral') + P('M52 44v16M46 60h12', 'chalk') +
    P('M4 56l9-8 3 3-9 8z', 'orange', 'orange') + P(C(8, 57, 3), 'chalk', null, 1.6) +
    `<path class="pz-arc" pathLength="1" d="M14 49Q26 4 50 33" stroke="var(--orange)" stroke-width="1.6" stroke-dasharray=".035 .035"/>` +
    `<circle r="2.8" fill="var(--orange)" stroke="none"><animateMotion dur="2.4s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.65;1" calcMode="linear" path="M14 49Q26 4 50 33"/></circle>`),
  fontana: svg(
    P('M4 60h56', 'muted', null, 1.4) + P('M10 50h44l-4 10H14z', 'chalk', 'sky') + P('M29 50V30h6v20', 'chalk') + P('M18 30h28l-4 6H22z', 'chalk', 'sky') +
    P('M32 30v-8', 'sky', null, 1.6) +
    `<path class="pz-flow" pathLength="1" d="M32 22Q24 8 16 30M32 22Q40 8 48 30M20 36Q14 40 13 50M44 36Q50 40 51 50" stroke="var(--sky)" stroke-width="1.8"/>` +
    `<g class="pz-meter">${P('M58 54V30M56 30h4M56 42h3', 'mint', null, 1.4)}</g>` + P('M14 54q4 2 8 0t8 0 8 0 8 0 8 0', 'sky', null, 1.2)),
  razzo: svg(
    P('M2 58h60', 'muted', null, 1.4) + P('M4 50h34q14 0 20-14l4-10', 'chalk') + P('M4 54h34q16 0 24-17', 'chalk', null, 1.2) +
    P('M10 50v8M20 50v8M30 50v8M44 48l2 9', 'muted', null, 1.2) +
    `<g class="pz-launch">${P('M8 38h22l5 6v6H8z', 'coral', 'coral')}${P('M12 41h5v4h-5zM21 41h5v4h-5z', 'sky', 'sky', 1.2)}` +
    `${P('M35 44l5 2-5 2', 'sun', 'sun', 1.4)}${P(C(13, 50, 2.6) + C(29, 50, 2.6), 'chalk', null, 1.4)}` +
    `${P('M2 40h4M0 44h5M2 48h4', 'sun', null, 1.4)}</g>`),
  catene: svg(
    P('M4 60h56', 'muted', null, 1.4) + P('M32 60V14', 'chalk') + P('M24 60l8-6 8 6', 'chalk', null, 1.6) +
    P('M14 16q18-12 36 0z', 'coral', 'coral') + P('M32 4v6', 'sun', null, 1.6) + P(C(32, 3, 1.6), 'sun', 'sun', 1.2) +
    `<g class="pz-spin2">` +
    P('M16 16l-8 22M48 16l8 22M26 17l-4 26M38 17l4 26', 'muted', null, 1) +
    P('M5 38h6v4H5zM53 38h6v4h-6zM19 43h6v4h-6zM39 43h6v4h-6z', 'sky', 'sky', 1.4) + `</g>`),
  miniera: svg(
    P('M2 58h60', 'muted', null, 1.4) + P('M6 61v-3M14 61v-3M22 61v-3M30 61v-3M38 61v-3M46 61v-3M54 61v-3', 'muted', null, 1.2) +
    P('M44 58V36a10 10 0 0 1 20 0v22', 'chalk', null, 1.8) + P('M48 58V38a6 6 0 0 1 12 0v20', 'muted', null, 1.2) +
    P('M2 47h6M3 51h5', 'coral', null, 1.6) + P('M8 42v12', 'coral', null, 2) +
    `<g class="pz-launch">${P('M10 40h22l-3 12H13z', 'sky', 'sky')}${P('M14 40l3-6 4 3 4-5 4 8', 'sun', 'sun', 1.4)}` +
    `${P(C(15, 55, 2.8) + C(27, 55, 2.8), 'chalk', null, 1.4)}${P('M33 45h6l-2-3M39 45l-2 3', 'coral', null, 1.4)}</g>`),
  scivolo: svg(
    P('M2 60h60', 'muted', null, 1.4) +
    P('M8 60V18M17 60V18', 'chalk', null, 1.8) + P('M8 27h9M8 36h9M8 45h9M8 54h9', 'chalk', null, 1.2) +
    P('M6 18h17', 'sun', null, 2.4) + P('M7 18v-7M22 18v-7M7 12h15', 'sun', null, 1.4) +
    P('M23 18L47 50q5 6 13 6', 'sky', null, 2.8) + P('M23 23L45 52q4 5 15 6', 'sky', null, 1.2) + P('M45 52v8M58 58v2', 'muted', null, 1.4) +
    `<g class="pz-slide">${P(C(26, 14, 2.6), 'pink', 'pink')}${P('M26 17l3 7M29 24l6 6M27 19l-4-4M27 19l4-4', 'pink', null, 1.6)}</g>`),
  montagne: svg(
    P('M2 60h60', 'muted', null, 1.4) + P('M6 14v46M12 20v40M34 33v27M40 33v27M56 54v6', 'muted', null, 1) +
    P('M3 12h5C14 12 16 52 22 52S31 30 37 30S45 52 51 52H62', 'chalk', null, 2.4) + P('M3 16h5C14 16 16 56 22 56', 'sky', null, 1) +
    `<g><rect x="-4.5" y="-7.5" width="9" height="5.5" rx="1.6" fill="var(--sky)" fill-opacity=".3" stroke="var(--sky)" stroke-width="1.4"/>` +
    `<circle cx="-.5" cy="-10" r="1.9" fill="none" stroke="var(--pink)" stroke-width="1.3"/>` +
    `<animateMotion dur="3.4s" repeatCount="indefinite" rotate="auto" keyPoints="0;.08;.42;.62;1" keyTimes="0;.22;.45;.68;1" calcMode="linear" path="M3 12h5C14 12 16 52 22 52S31 30 37 30S45 52 51 52H62"/></g>`),
  grado: svg(
    P('M4 24l28-13 28 13-28 13z', 'chalk', 'sky') + P('M14 29v13c9 7 27 7 36 0V29', 'chalk', 'sky') + P('M32 24l20 4v16', 'sun', null, 1.6) +
    `<g class="pz-tassel">${P('M52 44l-3 9h6z', 'sun', 'sun')}</g>`),
};

export const pieceSVG = (id) => PIECE_SVG[id] || PIECE_SVG.grado;
