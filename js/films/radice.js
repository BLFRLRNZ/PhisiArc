// La radice quadrata: √
// È il quadrato al contrario. L'omino rovescia dalla tracolla nove piastrelle: un mucchio, e in alto il loro numero.
// Poi le mette in ordine: la prima la porta lui, le altre la seguono, e viene un quadrato. Quanto è lungo il lato? 3.
// Intorno al 9 lui disegna il segno della radice: √9 = 3, perché 3 · 3 = 9.
// Con altre sette piastrelle il quadrato cresce: sono 16, il lato è 4. √16 = 4, perché 4 · 4 = 16.
import { COL, KN, KS, RIG, clamp, lerp, prog } from '../toon.js';
import { film, add, mixT, boing, pop, fade, arc, quad, measure, look, point, cheer, think, carry, hud } from '../toonkit.js';

const TU = 0.6, X0 = 3.0;                          // il lato di una piastrella; l'angolo in basso a sinistra del quadrato
const CA = COL.sky, CS = COL.orange;               // il colore dell'area, il colore del lato
// il mucchio: per ogni piastrella il centro e di quanto è storta (in gradi)
const HEAP = [[1.8, 1.42, 9], [1.2, 0.3, -7], [1.76, 0.3, 5], [2.3, 0.31, -4], [2.72, 0.32, 11], [1.46, 0.86, 8], [2.05, 0.87, -10], [2.52, 0.88, 6], [2.3, 1.42, -8]];
const CELLS = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2], [3, 0], [3, 1], [3, 2], [3, 3], [2, 3], [1, 3], [0, 3]];
const cellC = (n) => [X0 + (CELLS[n][0] + 0.5) * TU, (CELLS[n][1] + 0.5) * TU];

export default film((tl) => {
  const UN = 0.14, HV = 0.18, UE = 0.265, UR = 0.34, FS = 0.2, R2 = 0.37, F2 = 0.12;   // i posti sullo schermo: √9 = 3 e sotto 3 · 3 = 9

  tl.start(0.2, 1, { x: 3.2, zm: 1 });
  const LOOK = tl.span(1.0);
  const POUR = tl.span(3.4);                       // rovescia la tracolla: nove piastrelle
  const THINK = tl.span(2.2);
  const W1 = tl.walk(1.3, 1.2);
  const PICK = tl.span(1.2);                       // prende la piastrella in cima
  const W2 = tl.walk(2.5, 1.2);
  const PUT = tl.span(1.4);                        // e la posa nell'angolo
  const W3 = tl.walk(2.3, 1.1);
  tl.face(W3.a, 1);
  const WAVE = tl.span(4.4);                       // le altre otto vanno al loro posto da sole
  const SIDE = tl.span(3.6);                       // il lato: uno, due, tre
  const RAD = tl.span(3.2);                        // il segno della radice intorno al 9
  const EQ = tl.span(2.8);                         // = 3
  const WHY = tl.span(3.6);                        // perché 3 · 3 = 9
  const POUR2 = tl.span(4.6);                      // altre sette piastrelle: il quadrato cresce
  const SIDE2 = tl.span(2.8);
  const EQ2 = tl.span(2.6);
  const WHY2 = tl.span(3.4);
  const CHEER = tl.span(2.2);
  const END = tl.span(5.0);
  tl.cam(POUR2.a, { x: 3.4, zm: 0.95, k: 1.4, kz: 1.2 });

  // ----- quando si muove ogni piastrella -----
  const OUT = (n) => (n < 9 ? POUR.at(0.3) + n * 0.2 : POUR2.at(0.22) + (n - 9) * 0.34);     // esce dalla tracolla
  const FLY1 = 0.7, FLY2 = 0.9;
  const TAKE = PICK.at(0.45), DROP = PUT.at(0.5);
  const GO = (n) => (n === 0 ? TAKE : n < 9 ? WAVE.at(0.08) + (n - 1) * 0.42 : OUT(n));     // parte verso il suo posto nel quadrato
  const AT = (n) => (n === 0 ? DROP : n < 9 ? GO(n) + 0.6 : OUT(n) + FLY2);                  // ci arriva
  const DONE9 = AT(8), DONE16 = AT(15);
  const count = (t) => { let c = 0; for (let n = 0; n < 16; n++) if (t >= (n < 9 ? OUT(n) + FLY1 : AT(n))) c++; return c; };
  const TICK = [0, 1, 2].map((i) => SIDE.at(0.14 + 0.16 * i)), S3 = SIDE.at(0.66);            // il conto del lato
  const TICK4 = SIDE2.at(0.2), S4 = SIDE2.at(0.5);
  const RDRAW = RAD.at(0.3), REND = RAD.at(0.62);
  const E1 = EQ.at(0.1);
  const root = tl.chip({ str: '3', col: CS, up: true, size: 0.6, born: S3, at: () => [X0 + 1.5 * TU, -0.62], go: EQ.at(0.25), fly: 0.7, h: 0.6, slot: { u: UR, v: HV, frac: FS } });
  const root4 = tl.chip({ str: '4', col: CS, up: true, size: 0.6, born: S4, at: () => [X0 + 2 * TU, -0.62], go: EQ2.at(0.2), fly: 0.7, h: 0.6, slot: { u: UR, v: HV, frac: FS } });
  const Y1 = [0, 1, 2, 3, 4].map((i) => WHY.at(0.12 + 0.13 * i)), Y2 = [0, 1, 2, 3, 4].map((i) => WHY2.at(0.12 + 0.13 * i));

  // ----- quello che succede -----
  for (let n = 0; n < 16; n++) {
    tl.on(OUT(n), (S) => S.snd.noise(0.12, 0.04, 600, 2000));
    tl.on(n < 9 ? OUT(n) + FLY1 : AT(n), (S) => { S.snd.tone(520 + 45 * n, 700 + 45 * n, 0.09, 0.07, 'triangle'); if (n < 9) S.dust(HEAP[n][0], 0, 2, 2); });
    if (n > 0 && n < 9) { tl.on(GO(n), (S) => S.snd.noise(0.14, 0.04, 700, 2400)); tl.on(AT(n), (S) => S.snd.tick(800 + 60 * n, 0.06)); }
  }
  tl.on(THINK.at(0.25), (S) => S.snd.tone(440, 330, 0.25, 0.06, 'triangle'));
  tl.on(TAKE, (S) => S.snd.tone(520, 780, 0.12, 0.08, 'triangle'));
  tl.on(DROP, (S) => { S.snd.tone(150, 70, 0.14, 0.12); S.snd.noise(0.08, 0.07, 800, 200); });
  tl.on(DONE9 + 0.1, (S) => { S.snd.chime([659, 784, 1047], 0.09, 0.08); S.wave([X0 + 1.5 * TU, 1.5 * TU], 3, 0.5, CA, 0.1); S.kick({ shake: 0.04 }); });
  TICK.forEach((c, i) => tl.on(c, (S) => S.snd.tone(523 + 100 * i, 523 + 100 * i, 0.2, 0.08, 'triangle')));
  tl.on(S3, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.burst([X0 + 1.5 * TU, -0.62], 8, 5, 0.4, CS, { kind: 'plus' }); });
  tl.on(RDRAW, (S) => { S.snd.noise(0.5, 0.08, 900, 4200); S.snd.tone(300, 900, 0.5, 0.05); });
  tl.on(REND, (S) => { S.snd.tone(880, 1320, 0.14, 0.08, 'triangle'); S.kick({ shake: 0.03 }); });
  tl.on(E1, (S) => S.snd.tick(900, 0.05));
  tl.on(root.go, (S) => S.snd.noise(0.2, 0.05, 500, 2200));
  tl.on(root.dock, (S) => { S.snd.chime([784, 1047], 0.09, 0.08); });
  Y1.forEach((c, i) => tl.on(c, (S) => S.snd.tone(523 + 60 * i, 523 + 60 * i, 0.2, 0.07, 'triangle')));
  tl.on(DONE16 + 0.1, (S) => { S.snd.chime([659, 784, 1047], 0.09, 0.08); S.wave([X0 + 2 * TU, 2 * TU], 3.6, 0.5, CA, 0.1); S.kick({ shake: 0.04 }); });
  tl.on(TICK4, (S) => S.snd.tone(823, 823, 0.2, 0.08, 'triangle'));
  tl.on(S4, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.burst([X0 + 2 * TU, -0.62], 8, 5, 0.4, CS, { kind: 'plus' }); });
  tl.on(root4.go, (S) => S.snd.noise(0.2, 0.05, 500, 2200));
  tl.on(root4.dock, (S) => S.snd.chime([784, 1047], 0.09, 0.08));
  Y2.forEach((c, i) => tl.on(c, (S) => S.snd.tone(523 + 60 * i, 523 + 60 * i, 0.2, 0.07, 'triangle')));
  tl.on(CHEER.a, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  const bagPose = (sp) => (S, P, auto, t) => {     // apre la tracolla e la rovescia in avanti
    const k = Math.min(prog(t, sp.a, sp.at(0.2), 'out'), 1 - prog(t, sp.at(0.85), sp.b));
    P.h[0] = mixT(auto[0], ['P', -0.1, 0.22], k); P.h[1] = mixT(auto[1], ['P', -0.3, 0.2], k); P.handNow = true;
    P.lean = 14 * k; P.leanNow = true; P.look = [0.9, t < sp.at(0.25) ? -0.6 : 0.2];
    return false;
  };
  tl.pose(LOOK, look(1, 0));
  tl.pose(POUR, bagPose(POUR));
  tl.pose(THINK, think({ look: [1, -0.2] }));
  tl.pose(PICK, (S, P, auto, t) => { const g = ['W', HEAP[0][0], HEAP[0][1]]; P.h[0] = t < TAKE ? mixT(auto[0], g, prog(t, PICK.a, TAKE - 0.03, 'out')) : mixT(g, ['L', 0.5, 0.05], prog(t, TAKE, PICK.b)); P.handNow = 0; P.look = [0.9, 0.2]; return false; });
  tl.pose(W2, carry(0, [0.5, 0.05], { look: [1, -0.2] }));
  tl.pose(PUT, (S, P, auto, t) => {                // si china e la posa nell'angolo
    const a = PUT.a, b = PUT.b, c = cellC(0);
    P.py = KN(t, [[a, RIG.STAND], [DROP - 0.05, 0.4, 'out'], [DROP + 0.1, 0.4], [b, RIG.STAND, 'io']]);
    P.lean = KN(t, [[a, 0], [DROP - 0.05, 48, 'out'], [DROP + 0.1, 48], [b, 0, 'io']]); P.head = -0.4 * P.lean;
    P.h[0] = KS(t, [[a, ['L', 0.5, 0.05]], [DROP - 0.05, ['W', c[0], c[1]], 'out'], [DROP + 0.1, ['W', c[0], c[1]]], [b, auto[0]]]);
    P.look = [0.7, -0.7];
    return true;
  });
  tl.pose(tl.part(WAVE, 0.02, 0.9), point(0, (S, t) => { const n = clamp(1 + Math.floor((t - GO(1)) / 0.42), 1, 8); return cellC(n); }, { len: 0.6 }));
  tl.pose(SIDE, look(1, -0.5));
  tl.pose(tl.part(RAD, 0.1, 0.8), point(0, (S, t) => [S.cam.x - 3, 3.7], { len: 0.66 }));
  tl.pose(EQ, look(0.1, 0.9, '^'));
  tl.pose(WHY, look(0.1, 0.9));
  tl.pose(POUR2, bagPose(tl.part(POUR2, 0.08, 0.7)));
  tl.pose(SIDE2, look(1, -0.4)); tl.pose(EQ2, look(0.1, 0.9, '^')); tl.pose(WHY2, look(0.1, 0.9));
  tl.pose(CHEER, cheer({ n: 3 }));
  tl.pose(END, (S, P, auto, t) => {
    const k = prog(t, END.at(0.1), END.at(0.22), 'out');
    P.h[0] = mixT(auto[0], ['L', 0.42, 0.52], k); P.h[1] = mixT(auto[1], ['P', -0.13, 0.04], k); P.handNow = true;
    P.look = t < END.at(0.5) ? [0.5, 0.9] : [0.15, 0.1]; P.expr = '^';
    return false;
  });

  // una piastrella con il centro in c, storta di r gradi, grande k
  const sq = (D, c, r, k = 1, o = {}) => {
    const h = (TU / 2 - 0.035) * k, a = (r * Math.PI) / 180, ca = Math.cos(a) * h, sa = Math.sin(a) * h;
    quad(D, [[c[0] - ca + sa, c[1] - sa - ca], [c[0] + ca + sa, c[1] + sa - ca], [c[0] + ca - sa, c[1] + sa + ca], [c[0] - ca - sa, c[1] - sa + ca]], CA, { a: 0.3, ...o });
  };
  const bag = (S) => add(S.J.pelvis, [-0.1 * S.hero.face, 0.2]);

  return {
    ground: { ticks: false },
    back(S, D, t) {
      // il contorno del quadrato, quando è completo
      for (const [done, n] of [[DONE9, 3], [DONE16, 4]]) if (t >= done && (n === 4 || t < DONE16)) D.path([[X0, 0], [X0 + n * TU, 0], [X0 + n * TU, n * TU], [X0, n * TU]], 0.045, COL.ink, { close: true });
      // il lato: una misura sotto la base, con il conto delle piastrelle
      if (t >= TICK[0]) {
        const k = t < TICK4 ? TICK.filter((c) => t >= c).length : 3 + prog(t, TICK4, TICK4 + 0.3);
        measure(D, [X0, -0.2], [X0 + k * TU, -0.2], CS, { w: 0.045 });
        for (let i = 1; i < k; i++) D.seg([X0 + i * TU, -0.12], [X0 + i * TU, -0.28], 0.03, CS);
      }
      if (t >= S3 && t < root.go) root.draw(S, D, t);
      if (t >= root.go && t < S4) D.glyph('3', X0 + 1.5 * TU, -0.62, 0.5, CS, { style: '600', alpha: 0.9 * fade(t, TICK4, 0.3) });
      if (t >= S4 && t < root4.go) root4.draw(S, D, t);
      if (t >= root4.go) D.glyph('4', X0 + 2 * TU, -0.62, 0.5, CS, { style: '600', alpha: 0.9 });
    },
    front(S, D, t) {
      // le piastrelle: escono dalla tracolla, cadono nel mucchio, vanno al loro posto
      for (let n = 0; n < 16; n++) {
        if (t < OUT(n)) continue;
        const c1 = cellC(n), bump = boing(t - (n < 9 ? DONE9 : DONE16) - 0.1, 0.12, 16, 8) + (t >= WHY.a ? boing(t - (n < 9 ? Y1 : Y2)[Math.min(4, CELLS[n][1])], 0.1, 16, 8) : 0);
        if (n >= 9) { const u = (t - OUT(n)) / FLY2; if (u < 1) { const p = arc(bag(S), c1, u, 2.6); sq(D, p, 300 * (1 - u), 0.5 + 0.5 * u); } else sq(D, c1, 0, 1 + boing(t - AT(n), 0.2) + bump); continue; }
        const hp = [HEAP[n][0], HEAP[n][1]], r = HEAP[n][2], u = (t - OUT(n)) / FLY1;
        if (u < 1) { const p = arc(bag(S), hp, u, 1.1); sq(D, p, r + 220 * (1 - u), 0.4 + 0.6 * u); continue; }
        if (t < GO(n)) { sq(D, hp, r, 1 + boing(t - OUT(n) - FLY1, 0.15)); continue; }
        if (n === 0) { if (t < DROP) sq(D, S.J.h[0], r * (1 - prog(t, TAKE, TAKE + 0.4)), 1); else sq(D, c1, 0, 1 + boing(t - DROP, 0.15) + bump); continue; }
        const w = (t - GO(n)) / 0.6;
        if (w < 1) sq(D, arc(hp, c1, w, 1.0), r * (1 - w), 1); else sq(D, c1, 0, 1 + boing(t - AT(n), 0.2) + bump);
      }
      // il punto di domanda
      if (THINK.has(t)) D.glyph('?', S.J.head[0], S.J.head[1] + 0.55, 0.5 * pop(t, THINK.at(0.25)) * fade(t, THINK.at(0.85), 0.15), COL.sun, { style: '600' });
      // sullo schermo: il numero delle piastrelle, poi il segno della radice, poi il lato
      const c = count(t); if (c < 1) return;
      const last = Math.max(...Array.from({ length: 16 }, (_, n) => (n < 9 ? OUT(n) + FLY1 : AT(n))).filter((x) => t >= x));
      hud.glyph(D, UN, HV, FS, String(c), CA, { style: '600', k: 1 + boing(t - last, 0.25) + boing(t - REND, 0.3) + boing(t - Y1[4], 0.3) + boing(t - Y2[4], 0.3) });
      if (t >= RDRAW) {                            // √: una spunta e una riga sopra il numero
        const w = c > 9 ? 0.022 : 0, pts = [[UN - 0.062 - w, HV + 0.015], [UN - 0.05 - w, HV - 0.005], [UN - 0.035 - w, HV + 0.1], [UN - 0.02 - w, HV - 0.125], [UN + 0.05 + w, HV - 0.125]];
        const k = prog(t, RDRAW, REND, 'io') * (pts.length - 1), out = [];
        for (let i = 0; i < pts.length; i++) { if (i <= k) out.push(D.screen(pts[i][0], pts[i][1])); else { const f = k - (i - 1); if (f > 0) { const a = pts[i - 1], b = pts[i]; out.push(D.screen(lerp(a[0], b[0], f), lerp(a[1], b[1], f))); } break; } }
        D.path(out, 0.014 * D.unit * (1 + boing(t - REND, 0.4)), COL.ink);
      }
      if (t >= E1) hud.eq(D, UE, HV, pop(t, E1));
      const a3 = t < POUR2.a ? 1 : fade(t, POUR2.a, 0.4);
      if (t >= root.go && a3 > 0) root.draw(S, D, t, { alpha: a3, bump: boing(t - Y1[0], 0.3) + boing(t - Y1[2], 0.3) });
      if (t >= root4.go) root4.draw(S, D, t, { bump: boing(t - Y2[0], 0.3) + boing(t - Y2[2], 0.3) });
      // sotto, il perché: lato per lato fa l'area
      for (const [Y, n, a] of [[Y1, 3, a3], [Y2, 4, 1]]) {
        if (t < Y[0] || a <= 0) continue;
        const it = [[UN, String(n), CS], [UN + 0.045, '·', COL.ink], [UN + 0.09, String(n), CS], [UN + 0.15, '=', COL.ink], [UN + 0.215, String(n * n), CA]];
        it.forEach(([u, s, col], i) => { if (t >= Y[i]) hud.glyph(D, u, R2, F2, s, col, { style: '600', k: pop(t, Y[i]), alpha: a }); });
      }
    },
  };
});
