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
  autoscontri: svg(
    P('M2 60h60', 'muted', null, 1.4) + P('M2 6h60M8 6l3 3M20 6l3 3M32 6l3 3M44 6l3 3M56 6l3 3', 'muted', null, 1.2) +
    `<g class="pz-bump1">${P('M17 42V6', 'chalk', null, 1.2)}${P('M8 56h17a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3z', 'sky', 'sky')}` +
    `${P('M28 47h3v5h-3', 'chalk', null, 1.4)}${P(C(13, 39, 2.6), 'pink', 'pink', 1.4)}</g>` +
    `<g class="pz-bump2">${P('M47 42V6', 'chalk', null, 1.2)}${P('M39 56h17a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H39a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3z', 'orange', 'orange')}` +
    `${P('M36 47h-3v5h3', 'chalk', null, 1.4)}${P(C(51, 39, 2.6), 'sky', 'sky', 1.4)}</g>` +
    `<g class="pz-spark">${P('M32 41v-5M28 43l-3-3M36 43l3-3', 'sun', null, 1.6)}</g>`),
  bilico: svg(
    P('M4 60h56', 'green', null, 1.6) + P('M7 59l3 1M14 59l3 1M44 59l3 1M52 59l3 1', 'green', null, 1.2) +
    P('M32 41L25 58h14z', 'orange', 'orange') +
    `<g class="pz-rock">${P('M4 39h56', 'sun', null, 3.2)}${P('M16 38v-7M40 38v-7', 'muted', null, 1.4)}` +
    `${P(C(9, 25, 3), 'sky', 'sky')}${P('M9.5 28.5v8.5M9.5 37l5 1M10 31l5.5 1', 'sky', null, 1.6)}` +
    `${P(C(46, 22.5, 3.8), 'pink', 'pink')}${P('M45.5 27v10M45.5 37l-5 1M45 30.5l-4.5 1.5', 'pink', null, 1.9)}</g>`),
  ascensore: svg(
    P('M4 60h56', 'green', null, 1.6) + P('M8 9h1M53 14h1M14 25h1M50 33h1M10 43h1', 'chalk', null, 1.6) +
    P('M26 59V4M38 59V4M26 12h12M26 24h12M26 36h12M26 48h12', 'muted', null, 1.4) + P('M20 60l6-5M44 60l-6-5', 'muted', null, 1.4) +
    `<g class="pz-lift">${P('M28 41h8v8h-8z', 'sun', 'sun', 1.8)}${P(C(32, 44.2, 1.5), 'sky', 'sky', 1.2)}</g>`),
  satellite: svg(
    P('M6 10h1M56 8h1M10 52h1M54 50h1M30 4h1', 'chalk', null, 1.6) +
    P(C(32, 34, 10), 'sky', 'sky', 2) + P('M25 30q4-3 8-1M34 39q3 1 5-2', 'mint', null, 1.4) + P(C(32, 34, 22), 'muted', null, 1) +
    `<g class="pz-orbit">${P('M43.6 18.4h8M42.6 15.4v6M52.6 15.4v6', 'sun', null, 1.6)}${P(C(47.6, 18.4, 2.2), 'sun', 'sun', 1.4)}</g>`),
  sentiero: svg(
    P('M8 10h1M56 8h1M30 6h1M44 18h1M20 22h1', 'chalk', null, 1.6) + P('M2 53h60', 'muted', null, 1.4) +
    P(C(11, 42, 9), 'sun', 'sun', 1.6) +
    P('M24 53V41M31 53V41M41 53V41M57 53V41', 'chalk', null, 1.2) +
    P('M24 41l6 2.4-6 2.4z', 'sky', 'sky', 1.2) + P('M31 41l6 2.4-6 2.4z', 'coral', 'coral', 1.2) +
    P('M41 41l6 2.4-6 2.4z', 'orange', 'orange', 1.2) + P('M57 41l5 2.4-5 2.4z', 'mint', 'mint', 1.2) +
    `<g class="pz-walk">${P('M18 49.5h4', 'sun', null, 1.2)}${P(C(23.5, 49.5, 1.5), 'sun', 'sun', 1.2)}</g>`),
  sollevatore: svg(
    P('M4 60h56', 'green', null, 1.6) +
    P('M11 56h45V45M17 52h13V45', 'sun', 'sun', 0.6) + P('M11 34v22h45V40M17 34v18h13V40', 'muted', null, 1.6) +
    `<g class="pz-pump">${P('M12 38h4M14 38V27M10 27h8', 'orange', null, 1.8)}</g>` +
    `<g class="pz-raise">${P('M31 44h24', 'chalk', null, 2.2)}${P('M33 41h20l-3 3h-14z', 'sky', 'sky', 1.6)}${P('M40 37h5v4h-5z', 'sky', null, 1.4)}</g>`),
  chiatta: svg(
    P('M2 46h60', 'sky', null, 1.6) + P('M8 49h6M30 51h8M50 49h6', 'sky', null, 1.2) +
    `<g class="pz-bob">${P('M10 37h44l-4 9H14z', 'orange', 'orange', 1.8)}${P('M14 42h36', 'chalk', null, 1)}${P(C(32, 42, 2.2), 'chalk', null, 1)}` +
    `${P('M16 29h8v8h-8zM26 29h8v8h-8zM36 29h8v8h-8zM21 21h8v8h-8z', 'sun', 'sun', 1.3)}</g>`),
  granite: svg(
    P('M18 24h28l-4 32H22z', 'chalk', null, 1.8) + P('M20 34h24l-3 22H23z', 'sun', 'sun', 1) + P('M38 24l8-16', 'coral', null, 2) +
    `<g class="pz-twinkle">${P('M24 26l3 3M30 22l3 3M36 26l3 3M27 18l3 3', 'sky', null, 2)}</g>`),
  mongolfiera: svg(
    P('M4 60h56', 'green', null, 1.6) + P('M10 58q2-5 6-4M50 58q3-6 7-3', 'green', null, 1.2) +
    `<g class="pz-hover">${P('M32 5c-11 0-18 8-18 17 0 8 6 13 11 19h14c5-6 11-11 11-19 0-9-7-17-18-17z', 'sun', 'orange', 1.8)}${P('M32 5v36M25 7q-4 17 1 34M39 7q4 17-1 34', 'sun', null, 1)}` +
    `${P('M26 41l1 6M38 41l-1 6', 'chalk', null, 1.2)}${P('M26 47h12v7H26z', 'orange', 'orange', 1.5)}<g class="pz-twinkle">${P('M32 46v-4', 'coral', null, 2.2)}</g></g>`),
  terme: svg(
    P('M8 36h48v16q0 4-4 4H12q-4 0-4-4z', 'sky', 'sky', 1.8) + P('M8 42h48', 'coral', null, 1.4) +
    `<g class="pz-steam">${P('M20 30q-3-5 0-9t0-9M32 30q-3-5 0-9t0-9M44 30q-3-5 0-9t0-9', 'chalk', null, 1.6)}</g>` +
    P('M56 36q3-10 8-12', 'coral', null, 2) + P('M60 26q2 2 0 4', 'coral', null, 1.4)),
  idrovolante: svg(
    P('M2 50h60', 'sky', null, 1.6) + P('M8 54h6M30 56h8M50 54h6', 'sky', null, 1.2) +
    `<g class="pz-fly">${P('M12 33q5-6 17-6h14q9 0 12 4-2 4-12 4H15q-3 0-3-2z', 'sun', 'sun', 1.8)}${P('M14 32l-4-11h6l6 7', 'sun', null, 1.6)}` +
    `${P('M24 26h18', 'chalk', null, 2.6)}${P('M24 35l-2 7M40 35l2 7M16 43h32q4 0 6-3', 'chalk', null, 1.6)}${P('M58 27v10', 'chalk', null, 1.4)}</g>`),
  grado: svg(
    P('M4 24l28-13 28 13-28 13z', 'chalk', 'sky') + P('M14 29v13c9 7 27 7 36 0V29', 'chalk', 'sky') + P('M32 24l20 4v16', 'sun', null, 1.6) +
    `<g class="pz-tassel">${P('M52 44l-3 9h6z', 'sun', 'sun')}</g>`),
};

export const pieceSVG = (id) => PIECE_SVG[id] || PIECE_SVG.grado;
