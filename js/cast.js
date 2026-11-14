// Il cast di PhisiArc: quindici personaggi disegnati a linee (SVG, viewBox 120×120).
// Ogni personaggio usa var(--c) come colore del tratto; gli stili delle animazioni sono in css/style.css (.m ...).
import { translateTree } from './i18n.js';

// ---------- disegno: pezzi comuni ----------
// Occhi: bianco ovale, pupilla scura che guarda un po' in basso, un punto di luce.
const eyes = (x1, x2, y, s = 1) => [x1, x2].map((x) => `<g class="eye">
  <ellipse cx="${x}" cy="${y}" rx="${3.7 * s}" ry="${4.5 * s}" fill="var(--chalk)" stroke="none"/>
  <circle cx="${x + .7 * s}" cy="${y + 1 * s}" r="${2.3 * s}" fill="var(--night)" stroke="none"/>
  <circle cx="${x + 1.6 * s}" cy="${y - .2 * s}" r="${.85 * s}" fill="var(--chalk)" stroke="none"/></g>`).join("");
const smile = (x, y, w = 10) => `<path d="M${x - w / 2} ${y} q${w / 2} ${w * .55} ${w} 0" stroke="var(--chalk)" stroke-width="2.6"/>`;
const cheeks = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="3.4" ry="1.9" fill="var(--pink)" fill-opacity=".45" stroke="none"/><ellipse cx="${x2}" cy="${y}" rx="3.4" ry="1.9" fill="var(--pink)" fill-opacity=".45" stroke="none"/>`;
const face = (x, y, d = 18, s = 1, my = 10) => eyes(x - d / 2, x + d / 2, y, s) + cheeks(x - d / 2 - 5, x + d / 2 + 5, y + 7 * s) + smile(x, y + my * s, 9 * s);
const shadow = (x, y, rx) => `<ellipse class="shadow" cx="${x}" cy="${y}" rx="${rx}" ry="3.2" fill="var(--c)" fill-opacity=".18" stroke="none"/>`;
const shine = (d) => `<path d="${d}" stroke="var(--chalk)" stroke-opacity=".55" stroke-width="2.4"/>`;
const soft = (d) => `<path d="${d}" stroke="var(--chalk)" stroke-opacity=".38" stroke-width="2"/>`;
const ticks = (cx, cy, r1, r2, n, major) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2, R1 = i % major === 0 ? r1 - 3 : r1;
  return `M${(cx + Math.sin(a) * R1).toFixed(1)} ${(cy - Math.cos(a) * R1).toFixed(1)} L${(cx + Math.sin(a) * r2).toFixed(1)} ${(cy - Math.cos(a) * r2).toFixed(1)}`;
}).join(" ");

// ---------- il cast ----------
const LIST = [
  { id: "ampolla", name: "Ampolla", world: "Il Laboratorio", c: "var(--mint)", what: "La beuta del laboratorio. Pratica e curiosa: prima indovina, poi controlla.", say: "Facciamo una prova?",
    svg: `${shadow(60, 112, 30)}
      <path class="liquid" d="M36 74 q12 -6 24 0 t24 0 L89 91 q5 11.5 -8 11.5 H39 q-13 0 -8 -11.5 Z" fill="var(--c)" fill-opacity=".28" stroke="none"/>
      <path class="draw" pathLength="1" d="M53 17 V42 L31 90 q-5 12.5 8 12.5 H81 q13 0 8 -12.5 L67 42 V17"/>
      <path d="M48 17 H72"/><rect x="52" y="6" width="16" height="11" rx="3" stroke="var(--orange)" fill="var(--orange)" fill-opacity=".18"/>
      <path d="M36 74 q12 -6 24 0 t24 0" stroke-width="2.4"/>
      ${soft("M64 50 h4 M66 58 h5")}${shine("M45 80 q-4 7 -3 14")}
      <circle class="bub b1" cx="54" cy="66" r="2.6" stroke-width="2"/><circle class="bub b2" cx="64" cy="70" r="1.8" stroke-width="2"/><circle class="bub b3" cx="59" cy="68" r="1.4" stroke-width="1.8"/>
      ${face(60, 85, 17, 1, 9)}` },
  { id: "tic", name: "Tic", world: "La Pista", c: "var(--orange)", what: "Il cronometro delle gare. Iperattivo: conta metri, secondi e giri.", say: "Tre, due, uno… via!",
    svg: `${shadow(60, 110, 28)}
      <rect x="53" y="12" width="14" height="8" rx="2.5" fill="var(--c)" fill-opacity=".18"/><path d="M60 20 V33"/>
      <path d="M85 39 l5 -5 l5 5 l-5 5 z" fill="var(--c)" fill-opacity=".18"/>
      <circle class="draw" pathLength="1" cx="60" cy="68" r="34" fill="var(--c)" fill-opacity=".12"/>
      <circle cx="60" cy="68" r="27.5" stroke="var(--chalk)" stroke-opacity=".3" stroke-width="2"/>
      <path d="${ticks(60, 68, 25, 22, 12, 3)}" stroke="var(--chalk)" stroke-opacity=".6" stroke-width="2"/>
      <g class="spin" style="transform-origin:60px 68px"><circle cx="60" cy="40.5" r="3.4" fill="var(--c)" stroke="none"/></g>
      ${shine("M36 54 a27 27 0 0 1 10 -12")}${face(60, 64, 18, 1, 9.5)}` },
  { id: "mela", name: "Mela", world: "L’Officina", c: "var(--coral)", what: "Quella caduta in testa a Newton. Di gravità se ne intende: cade sempre.", say: "Io lo so bene: cado sempre.",
    svg: `${shadow(60, 112, 30)}<g class="sway">
      <path class="draw" pathLength="1" d="M60 36 C46 26 22 30 22 60 C22 88 42 106 56 100 C58 99 62 99 64 100 C78 106 98 88 98 60 C98 30 74 26 60 36 Z" fill="var(--c)" fill-opacity=".14"/>
      <path d="M60 36 q-1 -12 5 -22" stroke="var(--chalk)" stroke-width="3"/>
      <path d="M64 24 q13 -13 25 -4 q-11 12 -25 4Z" stroke="var(--green)" fill="var(--green)" fill-opacity=".2"/><path d="M66 23 q10 -3 19 -3" stroke="var(--green)" stroke-width="1.8"/>
      ${shine("M32 52 q4 -12 14 -14")}${face(60, 64, 19, 1, 10)}</g>` },
  { id: "goccia", name: "Goccia", world: "L’Oceano", c: "var(--sky)", what: "Una goccia d’acqua che sa nuotare. Sa sempre chi galleggia e chi va a fondo.", say: "Galleggio o affondo? Dipende!",
    svg: `${shadow(60, 112, 26)}<g class="squish">
      <path class="draw" pathLength="1" d="M60 12 C58 18 30 50 30 76 a30 30 0 0 0 60 0 C90 50 62 18 60 12 Z" fill="var(--c)" fill-opacity=".14"/>
      <path d="M36 86 q12 6 24 0 t24 0" stroke="var(--chalk)" stroke-opacity=".35" stroke-width="2"/>
      ${shine("M40 72 q0 -12 9 -24")}${shine("M38 80 v2")}${face(60, 76, 18, 1, 9.5)}</g>
      <circle cx="22" cy="104" r="2.6" stroke-width="2"/><circle cx="98" cy="102" r="2" stroke-width="2"/>` },
  { id: "boing", name: "Boing", world: "La Valle delle Onde", c: "var(--mint)", what: "Una molla con la testa tonda. Non sta mai ferma: oscilla, rimbalza, vibra.", say: "Boing, boing: tutto vibra!",
    svg: `${shadow(60, 112, 26)}<rect x="34" y="102" width="52" height="8" rx="4" stroke="var(--chalk)" fill="var(--chalk)" fill-opacity=".08"/>
      <g class="spring">${[0, 1, 2, 3, 4].map((i) => { const y = 60 + i * 8.4; return `<path d="M42 ${y + 4} a18 4.2 0 0 1 36 0" stroke="var(--chalk)" stroke-opacity=".35" stroke-width="2.4"/><path d="M42 ${y} a18 4.2 0 0 0 36 0" stroke="var(--chalk)" stroke-width="2.6"/>`; }).join("")}</g>
      <g class="spring-head"><path d="M60 14 q-3 -7 3 -9" stroke="var(--c)" stroke-width="2.6"/>
      <circle class="draw" pathLength="1" cx="60" cy="36" r="21" fill="var(--c)" fill-opacity=".14"/>${shine("M44 28 a17 17 0 0 1 8 -9")}${face(60, 35, 16, .95, 9)}</g>` },
  { id: "termo", name: "Termo", world: "Il Vulcano", c: "var(--coral)", what: "Un termometro con il bulbo rosso. Lunatico: quando sale la temperatura, sale anche lui.", say: "Sento che sta salendo…",
    svg: `${shadow(60, 112, 20)}
      <path class="draw" pathLength="1" d="M46 79 V26 a14 14 0 0 1 28 0 V79 a17 17 0 1 1 -28 0 Z" fill="var(--chalk)" fill-opacity=".05"/>
      <circle cx="60" cy="92" r="11" fill="var(--c)" fill-opacity=".55" stroke="none"/>
      <g class="mercury"><rect x="56.5" y="50" width="7" height="42" rx="3.5" fill="var(--c)" stroke="none"/></g>
      ${soft("M74 42 h-5 M74 52 h-5 M74 62 h-5 M74 72 h-5")}${shine("M50 30 v14")}
      <g class="steam">${soft("M40 12 q-3 -4 0 -8 M80 12 q3 -4 0 -8")}</g>${face(60, 28, 12, .85, 8.5)}` },
  { id: "lampo", name: "Lampo", world: "La Centrale", c: "var(--sun)", what: "Una lampadina sempre accesa. Ha un’idea al minuto e corre nei fili.", say: "Mi si è accesa una lampadina!",
    svg: `<circle class="glow" cx="60" cy="48" r="40" fill="var(--c)" fill-opacity=".09" stroke="none"/>
      <path class="draw" pathLength="1" d="M42 72 C30 60 32 24 60 22 C88 24 90 60 78 72 C74 76 72 80 72 84 H48 C48 80 46 76 42 72 Z" fill="var(--c)" fill-opacity=".14"/>
      ${soft("M54 84 V72 l3 -5 l3 5 l3 -5 l3 5 V84")}
      <path d="M48 89 H72 M49 95 H71 M51 101 H69" stroke="var(--chalk)" stroke-width="2.6"/><path d="M55 106 h10" stroke="var(--chalk)" stroke-width="3.4"/>
      <g class="rays"><path d="M60 6 V13 M27 19 l5 5 M93 19 l-5 5 M14 48 h7 M99 48 h7"/></g>
      ${shine("M44 44 q0 -12 10 -16")}${face(60, 48, 18, 1, 9.5)}` },
  { id: "iride", name: "Iride", world: "Il Prisma", c: "var(--pink)", what: "Un prisma di vetro un po’ vanitoso: dentro di lei la luce bianca diventa arcobaleno.", say: "Luce bianca? Guarda dentro di me.",
    svg: `<path d="M2 66 L36 60" stroke="var(--chalk)" stroke-width="3"/>
      <path d="M60 22 L70 18 L104 84 L96 92" stroke-opacity=".55" stroke-width="2.4"/>
      <path class="draw" pathLength="1" d="M60 22 L96 92 H24 Z" fill="var(--c)" fill-opacity=".13"/>
      <g class="beams">${[["--coral", 46], ["--orange", 54], ["--sun", 62], ["--green", 70], ["--sky", 78]].map(([c, y], i) => `<path d="M${80 + i} ${60 + i * 3} L118 ${y}" stroke="var(${c})" stroke-width="2.6"/>`).join("")}</g>
      ${shine("M54 38 L44 58")}${face(60, 70, 17, .95, 9)}` },
  { id: "saturnino", name: "Saturnino", world: "Il Cielo", c: "#a9b8ff", what: "Un piccolo pianeta con l’anello e una luna che gli gira intorno. Sognatore.", say: "Giro, giro, ma non cado mai.",
    svg: `<path d="M12 68 A48 12 0 0 1 108 68" transform="rotate(-12 60 68)" stroke="var(--sun)" stroke-opacity=".6"/>
      <circle class="draw" pathLength="1" cx="60" cy="60" r="28" fill="var(--surface)"/><circle cx="60" cy="60" r="28" fill="var(--c)" fill-opacity=".14" stroke="none"/>
      ${soft("M36 48 q24 -6 48 0 M33 72 q27 6 54 0")}
      <path d="M12 68 A48 12 0 0 0 108 68" transform="rotate(-12 60 68)" stroke="var(--sun)" stroke-width="3.4"/>
      <circle r="3.6" fill="var(--chalk)" stroke="none"><animateMotion dur="5s" repeatCount="indefinite" path="M60 18 a46 46 0 1 1 -0.1 0"/></circle>
      ${shine("M42 44 a24 24 0 0 1 10 -9")}${face(60, 56, 18, 1, 9.5)}` },
  { id: "elettra", name: "Elettra", world: "L’Abisso Quantico", c: "var(--sky)", what: "Un atomo con gli elettroni che girano. Imprevedibile: non sai dov’è finché non guardi.", say: "Sono qui… o forse là.",
    svg: `<g stroke="var(--chalk)" stroke-opacity=".45" stroke-width="2"><ellipse cx="60" cy="60" rx="48" ry="15"/><ellipse cx="60" cy="60" rx="48" ry="15" transform="rotate(60 60 60)"/><ellipse cx="60" cy="60" rx="48" ry="15" transform="rotate(-60 60 60)"/></g>
      <circle r="4" fill="var(--sun)" stroke="none"><animateMotion dur="2.4s" repeatCount="indefinite" path="M12 60 a48 15 0 1 0 96 0 a48 15 0 1 0 -96 0"/></circle>
      <g transform="rotate(60 60 60)"><circle r="4" fill="var(--sun)" stroke="none"><animateMotion dur="3.1s" repeatCount="indefinite" path="M108 60 a48 15 0 1 0 -96 0 a48 15 0 1 0 96 0"/></circle></g>
      <circle class="draw" pathLength="1" cx="60" cy="60" r="20" fill="var(--surface)"/><circle cx="60" cy="60" r="20" fill="var(--c)" fill-opacity=".16" stroke="none"/>
      ${shine("M47 52 a14 14 0 0 1 6 -6")}${face(60, 58, 13, .8, 9)}` },
  { id: "attimo", name: "Attimo", world: "La Frontiera", c: "var(--sun)", what: "Una clessidra: misura il tempo, che vicino alla velocità della luce rallenta.", say: "Il tuo tempo e il mio non sono uguali.",
    svg: `${shadow(60, 112, 30)}
      <rect x="30" y="8" width="60" height="8" rx="4" stroke="var(--chalk)" fill="var(--chalk)" fill-opacity=".08"/><rect x="30" y="102" width="60" height="8" rx="4" stroke="var(--chalk)" fill="var(--chalk)" fill-opacity=".08"/>
      ${soft("M34 16 V102 M86 16 V102")}
      <path class="draw" pathLength="1" d="M41 16 C41 40 56 52 56 59 C56 66 41 78 41 102 M79 16 C79 40 64 52 64 59 C64 66 79 78 79 102"/>
      <path d="M47 44 Q60 50 73 44 L62 55 H58 Z" fill="var(--c)" fill-opacity=".35" stroke="none"/>
      <path d="M44 101 Q60 80 76 101 Z" fill="var(--c)" fill-opacity=".35" stroke="var(--c)" stroke-width="2"/>
      <path class="sand" d="M60 58 V92" stroke-width="2.2" stroke-dasharray="2.5 4.5"/>
      ${face(60, 29, 13, .85, 8.5)}` },
  { id: "lux", name: "Lux", world: "La Frontiera", c: "var(--sun)", what: "Un fotone: un pacchetto di luce con la sua onda dietro. Il più veloce dell’universo.", say: "Nessuno mi supera. Nessuno.",
    svg: `<circle class="glow" cx="78" cy="60" r="30" fill="var(--c)" fill-opacity=".1" stroke="none"/>
      <path class="wave" d="M2 60 q6 -16 12 0 t12 0 t12 0 t12 0 t12 0" stroke="var(--chalk)" stroke-width="2.6"/>
      ${soft("M20 40 h14 M14 80 h14")}
      <circle class="draw" pathLength="1" cx="78" cy="60" r="19" fill="var(--c)" fill-opacity=".18"/>
      <g class="rays"><path d="M78 30 v-7 M102 42 l5 -4 M106 60 h7 M102 78 l5 4 M78 90 v7"/></g>
      ${shine("M66 52 a13 13 0 0 1 6 -7")}${face(78, 58, 13, .85, 8.5)}` },
  { id: "carica", name: "Carica", world: "Pianeta Casa", c: "var(--green)", what: "Una batteria che si riempie. Sa che l’energia si conserva, si trasforma e non va sprecata.", say: "Quasi carica… non sprecarmi!",
    svg: `${shadow(60, 112, 28)}<rect x="50" y="12" width="20" height="9" rx="3" fill="var(--c)" fill-opacity=".2"/>
      <rect class="draw" pathLength="1" x="33" y="21" width="54" height="84" rx="10" fill="var(--c)" fill-opacity=".08"/>
      <rect class="charge" x="40" y="62" width="40" height="36" rx="5" fill="var(--c)" fill-opacity=".38" stroke="none"/>
      <path d="M63 66 L54 81 H65 L57 95" stroke="var(--chalk)" stroke-width="2.6"/>
      ${shine("M39 32 v14")}${face(60, 41, 18, 1, 9.5)}` },
  { id: "vetrino", name: "Vetrino", world: "I boss", c: "#b9a4ff", boss: true, what: "Un microscopio investigatore: guarda i miti da vicinissimo finché non crollano. Fa domande, non dà risposte.", say: "Mmh… guardiamolo più da vicino.",
    svg: `${shadow(60, 112, 32)}
      <rect x="28" y="100" width="64" height="10" rx="5" fill="var(--c)" fill-opacity=".14"/>
      <path class="draw" pathLength="1" d="M76 100 V88 C92 80 94 52 68 42" stroke-width="5"/>
      <path d="M28 76 H84" stroke="var(--chalk)" stroke-width="3"/><rect x="42" y="72" width="16" height="4" rx="1" stroke="var(--sky)" stroke-width="1.8"/>
      <circle class="knob" cx="86" cy="74" r="6" fill="var(--c)" fill-opacity=".2"/>
      <path d="M50 57 V65 M44 66 H56" stroke-width="3.4"/>
      <rect x="43" y="6" width="13" height="16" rx="2.5" fill="var(--c)" fill-opacity=".2" transform="rotate(-18 50 20)"/>
      <circle class="draw" pathLength="1" cx="50" cy="38" r="19" fill="var(--surface)"/><circle cx="50" cy="38" r="19" fill="var(--c)" fill-opacity=".16" stroke="none"/>
      <g class="glint">${shine("M37 32 a14 14 0 0 1 6 -7")}</g>${face(50, 37, 13, .85, 8.5)}
      <path d="M54 24 l10 2" stroke="var(--chalk)" stroke-width="2.2"/>` },
  { id: "bilancia", name: "Bilancia", world: "I boss", c: "#b9a4ff", boss: true, what: "Pesa le idee: da una parte il mito, dall’altra l’esperimento. Lavora in coppia con Vetrino.", say: "Mettiamolo sulla bilancia.",
    svg: `${shadow(60, 112, 26)}<path d="M60 44 V100" stroke="var(--chalk)" stroke-width="3"/><path d="M40 104 Q60 96 80 104 Z" fill="var(--chalk)" fill-opacity=".08" stroke="var(--chalk)"/>
      <g class="tilt" style="transform-origin:60px 46px"><path d="M18 46 H102" stroke-width="3.4"/>
        <path d="M18 46 L10 74 M18 46 L26 74 M102 46 L94 74 M102 46 L110 74" stroke="var(--chalk)" stroke-opacity=".55" stroke-width="1.8"/>
        <path d="M6 74 q12 11 24 0 Z" fill="var(--c)" fill-opacity=".2"/><path d="M90 74 q12 11 24 0 Z" fill="var(--c)" fill-opacity=".2"/>
        <path d="M15 64 q0 -5 3 -5 q3 0 3 3 q0 3 -3 4 v2" stroke="var(--chalk)" stroke-width="2"/>
        <path d="M99 70 l3 3 l6 -7" stroke="var(--mint)" stroke-width="2.4"/></g>
      <circle class="draw" pathLength="1" cx="60" cy="28" r="16" fill="var(--surface)"/><circle cx="60" cy="28" r="16" fill="var(--c)" fill-opacity=".16" stroke="none"/>
      ${face(60, 26, 11, .75, 8)}` },
];


translateTree(LIST); // in inglese: nomi, descrizioni e battute
export const CAST = Object.fromEntries(LIST.map((m) => [m.id, m]));
export const CAST_LIST = LIST;
let n = 0;

// Restituisce l'SVG di un personaggio. opts: size (px, opzionale), cls (classi extra), still (niente animazioni proprie).
export function charSVG(id, opts = {}) {
  const m = CAST[id];
  if (!m) return '';
  const i = n++;
  const size = opts.size ? ` width="${opts.size}" height="${opts.size}"` : '';
  const svg = m.svg.replace(/class="eye"/g, `class="eye" style="--bd:${((i * 0.61) % 4).toFixed(2)}s"`);
  return `<svg class="m${opts.cls ? ' ' + opts.cls : ''}" viewBox="0 0 120 120"${size} style="--c:${m.c}" role="img" aria-label="${m.name}"><g class="float" style="--fd:${((i * 0.37) % 3).toFixed(2)}s"><g class="body">${svg}</g></g></svg>`;
}

// Fa saltare un personaggio quando lo si tocca.
export function hop(svgEl) {
  const body = svgEl && svgEl.querySelector('.body');
  if (!body) return;
  body.classList.remove('hop'); void body.getBBox(); body.classList.add('hop');
  body.addEventListener('animationend', (e) => { if (e.animationName === 'hop') body.classList.remove('hop'); }, { once: true });
}
