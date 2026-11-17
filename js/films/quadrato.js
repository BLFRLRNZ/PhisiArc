// Il quadrato: x²
// L'omino arriva con un bastone lungo x e lo posa per terra. Ne tira su un altro uguale, in piedi: adesso c'è un lato
// per terra e un lato dritto. Il quadrato si chiude e si riempie di piastrelle: x per x, cioè x al quadrato.
// Sullo schermo la frase si scrive due volte, con le lettere e con i numeri sotto: x² = x · x, 4 = 2 · 2.
// Poi lui tira il lato: da 2 a 3 le piastrelle diventano 9, da 2 a 4 diventano 16: quattro blocchi uguali al primo.
import { COL, KN, KS, RIG, clamp, lerp, prog } from '../toon.js';
import { film, mixT, boing, pop, tile, look, point, push, cheer, hud } from '../toonkit.js';

const TU = 0.6, X0 = 1.5;                         // il lato di una piastrella; l'angolo in basso a sinistra del quadrato
const CX = COL.orange, CA = COL.sky;              // il colore del lato, il colore dell'area
const BLOCK = [COL.sky, COL.mint, COL.sun, COL.coral];

export default film((tl) => {
  // le due righe sullo schermo:  x² = x · x   e sotto   4 = 2 · 2
  const R1 = 0.125, R2 = 0.315, UA = 0.1, UE = 0.185, UB = 0.26, UD = 0.318, UC = 0.376, FL = 0.17, FN = 0.155;

  tl.start(-1.7, 1, { x: 2.3, zm: 1 });
  const ENTER = tl.walk(0.95, 1.3);
  const LOOK1 = tl.span(0.7);
  const PLACE = tl.span(1.7);                     // posa il bastone per terra
  const XLAB = tl.span(1.4);
  const RAISE = tl.span(2.6);                     // ne tira su un altro, in piedi
  const STEPB = tl.walk(0.3, 1.1);                // un passo indietro, per guardare
  tl.face(STEPB.a, 1);
  const XLAB2 = tl.span(1.0);
  const CLOSE = tl.span(3.6);                     // il quadrato si chiude e si riempie: quattro piastrelle
  const FORM = tl.span(6.0);                      // le due x vanno sullo schermo: x · x = x²
  const READ = tl.span(3.4);
  const WALKR = tl.walk(3.08, 1.5);                // gira dall'altra parte del quadrato
  tl.face(WALKR.b, -1);
  const PULL1 = tl.move(tl.span(2.2), 3.68, 'io', 0.25, 0.85);   // tira il lato: da 2 a 3
  tl.face(PULL1.at(0.25), -1);
  const FILL1 = tl.span(1.7);
  const SEE1 = tl.span(2.4);
  const PULL2 = tl.move(tl.span(2.2), 4.28, 'io', 0.25, 0.85);   // da 3 a 4
  tl.face(PULL2.at(0.25), -1);
  const FILL2 = tl.span(2.0);
  const SEE2 = tl.span(2.6);
  const BLOCKS = tl.span(6.6);                    // quattro blocchi uguali al primo quadrato
  const CHEER = tl.span(2.2);
  const END = tl.span(5.4);
  tl.cam(WALKR.a, { x: 2.7, zm: 0.96, k: 1.6, kz: 1.4 });
  tl.cam(PULL2.a, { x: 2.9, zm: 0.9, k: 1.6, kz: 1.4 });

  const DROP = PLACE.at(0.5);                     // il bastone lascia la mano
  const G2 = RAISE.at(0.24), UP2 = RAISE.at(0.8); // prende il secondo bastone, lo ha tirato su tutto
  const LINES = CLOSE.at(0.1), T2 = CLOSE.at(0.36);
  // il lato del quadrato, in piastrelle
  const side = (t) => 2 + prog(t, PULL1.at(0.25), PULL1.at(0.85)) + prog(t, PULL2.at(0.25), PULL2.at(0.85));
  const T3 = FILL1.at(0.08), T4 = FILL2.at(0.08);
  // le piastrelle: quando compare ognuna
  const cells = [];
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j], n) => cells.push({ i, j, t0: T2 + n * 0.2, f: 660 + 110 * n }));
  [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]].forEach(([i, j], n) => cells.push({ i, j, t0: T3 + n * 0.13, f: 700 + 80 * n }));
  [[3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3]].forEach(([i, j], n) => cells.push({ i, j, t0: T4 + n * 0.11, f: 700 + 70 * n }));
  const N3 = T3 + 5 * 0.13 + 0.15, N4 = T4 + 7 * 0.11 + 0.15;      // quando i numeri cambiano
  const nSide = (t) => (t < N3 ? 2 : t < N4 ? 3 : 4);
  const chg = (t) => boing(t - N3, 0.45) + boing(t - N4, 0.45);
  const CNT = [0, 1, 2, 3].map((i) => BLOCKS.at(0.3 + 0.1 * i));   // il conto dei quattro blocchi
  const gap = (t) => 0.2 * Math.sin(Math.PI * prog(t, BLOCKS.at(0.14), BLOCKS.at(0.86), 'lin')) ** 0.6;

  // ----- lettere e numeri che volano sullo schermo -----
  const xb = tl.chip({ str: 'x', col: CX, size: 0.42, born: FORM.at(0.04), at: () => [X0 + TU, -0.34], go: FORM.at(0.05), fly: 0.7, h: 0.6, slot: { u: UC, v: R1, frac: FL } });
  const xl = tl.chip({ str: 'x', col: CX, size: 0.42, born: FORM.at(0.13), at: () => [X0 - 0.32, TU], go: FORM.at(0.14), fly: 0.7, h: 0.4, slot: { u: UB, v: R1, frac: FL } });
  const nA = tl.chip({ str: (S, t) => String(nSide(t) ** 2), col: CA, up: true, size: 0.7, born: CLOSE.at(0.72), at: () => [X0 + TU, TU], go: FORM.at(0.82), fly: 0.7, h: 0.5, slot: { u: UA, v: R2, frac: FN } });
  const DOT = FORM.at(0.3), SQ = FORM.at(0.42), EQ1 = FORM.at(0.5), NB = FORM.at(0.62), NC = FORM.at(0.68), EQ2 = FORM.at(0.74);

  // ----- quello che succede -----
  tl.on(DROP, (S) => { S.snd.tone(150, 70, 0.14, 0.12); S.snd.noise(0.08, 0.07, 800, 200); S.dust(X0 + 0.6, 0, 5, 3); });
  tl.on(XLAB.at(0.2), (S) => S.snd.tone(520, 780, 0.12, 0.08, 'triangle'));
  tl.on(G2, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.snd.tone(180, 620, 0.9, 0.06, 'triangle', 0.1); });
  tl.on(UP2, (S) => { S.snd.tick(1000, 0.07); S.burst([X0, 2 * TU], 6, 4, 0.35, CX, { kind: 'plus' }); });
  tl.on(XLAB2.at(0.2), (S) => S.snd.tone(520, 780, 0.12, 0.08, 'triangle'));
  tl.on(LINES, (S) => S.snd.noise(0.5, 0.06, 900, 3200));
  for (const c of cells) tl.on(c.t0, (S) => { S.snd.tone(c.f, c.f * 1.3, 0.1, 0.07, 'triangle'); });
  tl.on(nA.born, (S) => { S.snd.chime([784, 1047], 0.08, 0.08); S.wave([X0 + TU, TU], 2, 0.4, CA, 0.08); });
  const whoosh = (S) => S.snd.noise(0.2, 0.05, 500, 2200), dock = (f) => (S) => S.snd.tone(f, f * 1.5, 0.12, 0.06, 'triangle');
  tl.on(xb.go, whoosh); tl.on(xb.dock, dock(659)); tl.on(xl.go, whoosh); tl.on(xl.dock, dock(784));
  tl.on(DOT, (S) => S.snd.tick(900, 0.05));
  tl.on(SQ, (S) => { S.snd.chime([659, 988], 0.09, 0.07); });
  tl.on(NB, (S) => S.snd.tick(1100, 0.05)); tl.on(NC, (S) => S.snd.tick(1100, 0.05));
  tl.on(nA.go, whoosh); tl.on(nA.dock, dock(1047));
  for (const p of [PULL1, PULL2]) { tl.on(p.at(0.2), (S) => S.snd.tone(520, 780, 0.12, 0.08, 'triangle')); tl.on(p.at(0.25), (S) => S.snd.tone(110, 240, 1.2, 0.05, 'sawtooth')); tl.on(p.at(0.85), (S) => S.snd.tick(800, 0.06)); }
  for (const n of [N3, N4]) tl.on(n, (S) => { S.snd.chime([784, 1047], 0.08, 0.08); S.kick({ shake: 0.03 }); });
  CNT.forEach((c, i) => tl.on(c, (S) => S.snd.tone([523, 659, 784, 1047][i], [523, 659, 784, 1047][i], 0.3, 0.09, 'triangle')));
  tl.on(BLOCKS.at(0.14), (S) => S.snd.noise(0.3, 0.05, 600, 1800));
  tl.on(BLOCKS.at(0.84), (S) => S.snd.tick(700, 0.06));
  tl.on(CHEER.a, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  tl.pose(tl.between(0, PLACE.a), (S, P) => { P.h[0] = ['L', 0.34, -0.12]; P.handNow = 0; P.look = [1, -0.1]; return false; });
  tl.pose(PLACE, (S, P, auto, t) => {             // si china e lo posa, con la punta sull'angolo
    const a = PLACE.a, b = PLACE.b;
    P.py = KN(t, [[a, RIG.STAND], [DROP - 0.05, 0.38, 'out'], [DROP + 0.1, 0.38], [b, RIG.STAND, 'io']]);
    P.lean = KN(t, [[a, 0], [DROP - 0.05, 50, 'out'], [DROP + 0.1, 50], [b, 0, 'io']]); P.head = -0.4 * P.lean;
    P.h[0] = KS(t, [[a, ['L', 0.34, -0.12]], [DROP - 0.05, ['W', X0, 0.09], 'out'], [DROP + 0.1, ['W', X0, 0.09]], [b, auto[0]]]);
    P.look = [0.6, -0.8];
    return true;
  });
  tl.pose(XLAB, look(1, -0.6));
  tl.pose(RAISE, (S, P, auto, t) => {             // prende l'angolo e tira su: dal terreno esce un altro bastone
    const a = RAISE.a, b = RAISE.b, up = prog(t, G2 + 0.06, UP2, 'io');
    P.py = KN(t, [[a, RIG.STAND], [G2 - 0.02, 0.38, 'out'], [G2 + 0.06, 0.38], [UP2, RIG.STAND + 0.03, 'io'], [b, RIG.STAND]]);
    P.lean = KN(t, [[a, 0], [G2 - 0.02, 50, 'out'], [G2 + 0.06, 50], [UP2, 3, 'io'], [b, 0]]); P.head = -0.4 * P.lean;
    P.h[0] = t < G2 ? mixT(auto[0], ['W', X0, 0.1], prog(t, a, G2 - 0.02, 'out')) : t < UP2 + 0.15 ? ['W', X0, lerp(0.1, 2 * TU, up)] : mixT(['W', X0, 2 * TU], auto[0], prog(t, UP2 + 0.15, b));
    P.look = [0.7, t < G2 + 0.1 ? -0.8 : 0.3]; P.expr = t > G2 + 0.1 && t < UP2 ? '>' : 'o';
    return true;
  });
  tl.pose(STEPB, look(1, 0)); tl.pose(XLAB2, look(1, 0));
  tl.pose(tl.part(CLOSE, 0, 0.34), point(0, [X0 + 2 * TU, 2 * TU], { in: 0.3, out: 0.3 }));
  tl.pose(tl.part(CLOSE, 0.34, 1), look(1, -0.1, 'o'));
  tl.pose(FORM, (S, P, auto, t) => { const u = FORM.u(t); P.look = u < 0.08 ? [1, -0.5] : [0.15, 0.95]; P.expr = u > 0.42 && u < 0.56 ? 'O' : 'o'; return false; });
  tl.pose(READ, look(0.15, 0.95, '^'));
  const xr = (t) => X0 + side(t) * TU;            // il lato destro del quadrato, che lui tira
  for (const p of [PULL1, PULL2]) tl.pose(p, push((S, t) => [xr(t), 0.95], { in: 0.2, out: 0.12, lean: -11, look: [0.9, -0.2], expr: '>' }));
  tl.pose(FILL1, look(0.9, 0.1)); tl.pose(FILL2, look(0.9, 0.3));
  tl.pose(SEE1, look(0.1, 0.95)); tl.pose(SEE2, look(0.1, 0.95, 'O'));
  tl.pose(tl.part(BLOCKS, 0.24, 0.72), point(0, (S, t) => { const i = clamp(Math.floor((t - CNT[0]) / (CNT[1] - CNT[0])), 0, 3); return [X0 + (1 + 2 * (i & 1)) * TU, (1 + 2 * (i >> 1)) * TU]; }, { len: 0.62 }));
  tl.pose(CHEER, cheer({ n: 3 }));
  tl.pose(END, (S, P, auto, t) => {
    const k = prog(t, END.at(0.1), END.at(0.22), 'out');
    P.h[0] = mixT(auto[0], ['L', 0.5, 0.46], k); P.h[1] = mixT(auto[1], ['P', -0.13, 0.04], k); P.handNow = true;
    P.look = t < END.at(0.5) ? [0.8, 0.8] : [0.15, 0.1]; P.expr = '^';
    return false;
  });

  return {
    ground: { ticks: false },
    back(S, D, t) {
      const s = side(t), L = s * TU, g = t >= BLOCKS.a ? gap(t) : 0, blocks = t >= BLOCKS.at(0.06);
      // le piastrelle
      for (const c of cells) {
        if (t < c.t0) continue;
        const bi = c.i >> 1, bj = c.j >> 1, b = bi + 2 * bj, cnt = blocks ? boing(t - CNT[b], 0.16, 16, 7) : 0;
        tile(D, X0 + c.i * TU + (bi - 0.5) * g, c.j * TU + (bj - 0.5) * g, TU, blocks ? BLOCK[b] : CA, { k: pop(t, c.t0, 0.2) * (1 + cnt), a: 0.3 });
      }
      // i lati: i due bastoni arancioni (per terra e in piedi), gli altri due bianchi
      if (t >= LINES && g < 0.01) { const u = prog(t, LINES, LINES + 0.55); D.seg([X0, L], [X0 + L * u, L], 0.045, COL.ink); D.seg([X0 + L, 0], [X0 + L, L * u], 0.045, COL.ink); }
      const h = S.J.h[0], f = S.hero.face;
      if (t < DROP) D.seg(h, [h[0] + 2 * TU * f, h[1]], 0.075, CX); else if (g < 0.01) D.seg([X0, 0.04], [X0 + L, 0.04], 0.075, CX);
      if (t >= G2 && g < 0.01) D.seg([X0, 0], [X0, t < UP2 + 0.15 ? clamp(h[1], 0.1, 2 * TU) : L], 0.075, CX);
      // le tacche: una per piastrella, per contare il lato
      if (t >= DROP && g < 0.01) for (let i = 0; i <= Math.round(s); i++) { D.seg([X0 + i * TU * (s / Math.round(s)), 0], [X0 + i * TU * (s / Math.round(s)), -0.1], 0.03, CX); if (t >= UP2) D.seg([X0, i * TU * (s / Math.round(s))], [X0 - 0.1, i * TU * (s / Math.round(s))], 0.03, CX); }
      // le due x: sotto il lato per terra, accanto al lato in piedi
      if (t >= XLAB.at(0.2)) D.glyph('x', X0 + L / 2, -0.36, 0.42 * pop(t, XLAB.at(0.2)), CX, { alpha: g > 0.01 ? 0.4 : 1 });
      if (t >= XLAB2.at(0.2)) D.glyph('x', X0 - 0.34, L / 2, 0.42 * pop(t, XLAB2.at(0.2)), CX, { alpha: g > 0.01 ? 0.4 : 1 });
    },
    front(S, D, t) {
      // la frase sullo schermo, con le lettere e con i numeri
      xb.draw(S, D, t); xl.draw(S, D, t);
      if (t >= DOT) { hud.glyph(D, UD, R1, FL, '·', COL.ink, { style: '600', k: pop(t, DOT) }); }
      if (t >= SQ) { hud.glyph(D, UA - 0.012, R1, FL, 'x', CX, { k: pop(t, SQ) }); hud.glyph(D, UA + 0.028, R1 - 0.06, 0.11, '2', COL.sun, { style: '600', k: pop(t, SQ + 0.12) * (1 + boing(t - SQ - 0.12, 0.6)) }); }
      if (t >= EQ1) hud.eq(D, UE, R1, pop(t, EQ1));
      const nk = 1 + chg(t), n = String(nSide(t));
      if (t >= NB) hud.glyph(D, UB, R2, FN, n, CX, { style: '600', k: pop(t, NB) * nk });
      if (t >= NC) { hud.glyph(D, UC, R2, FN, n, CX, { style: '600', k: pop(t, NC) * nk }); hud.glyph(D, UD, R2, FN, '·', COL.ink, { style: '600', k: pop(t, NC) }); }
      if (t >= EQ2) hud.eq(D, UE, R2, pop(t, EQ2));
      nA.draw(S, D, t, { bump: chg(t) });
    },
  };
});
