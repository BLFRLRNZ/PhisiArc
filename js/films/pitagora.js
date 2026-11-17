// Il teorema di Pitagora
// Due bastoni a squadra: uno lungo 4 per terra, uno lungo 3 in piedi. Quanto è lungo il lato storto che li unisce?
// Non 7: i due bastoni messi in fila sono troppo lunghi. La risposta sta nei quadrati: quello sul 4 ha 16 piastrelle,
// quello sul 3 ne ha 9. Le 25 piastrelle volano sul lato storto e riempiono giusto giusto un quadrato: 16 + 9 = 25.
// Il suo lato è 5. Con le lettere: a² + b² = c².
import { COL, EASE, KS, lerp, prog } from '../toon.js';
import { film, add, mixP, mixT, boing, pop, fade, arc, quad, dashed, look, point, cheer, think, toss, hud } from '../toonkit.js';

const TU = 0.5;                                    // il lato di una piastrella
const A = [0, 0], B = [2, 0], C = [2, 1.5];        // il triangolo: 4 piastrelle di base, 3 di altezza
const E1 = [0.4, 0.3], E2 = [-0.3, 0.4];           // una piastrella lungo il lato storto, e una verso l'esterno
const CA = COL.orange, CB = COL.mint, CC = COL.sky;
// le piastrelle dei tre quadrati: i quattro angoli di ognuna
const sqA = (n) => { const i = n % 4, j = n >> 2, x = i * TU, y = -(j + 1) * TU; return [[x, y], [x + TU, y], [x + TU, y + TU], [x, y + TU]]; };
const sqB = (n) => { const i = n % 3, j = Math.floor(n / 3), x = 2 + i * TU, y = j * TU; return [[x, y], [x + TU, y], [x + TU, y + TU], [x, y + TU]]; };
const sqC = (n) => { const i = n % 5, j = Math.floor(n / 5), p = [i * E1[0] + j * E2[0], i * E1[1] + j * E2[1]]; return [p, add(p, E1), add(add(p, E1), E2), add(p, E2)]; };
const shrink = (q, g = 0.03, k = 1) => { const c = [(q[0][0] + q[2][0]) / 2, (q[0][1] + q[2][1]) / 2]; return q.map((p) => { const d = Math.hypot(p[0] - c[0], p[1] - c[1]) || 1, f = k * (1 - (g * 1.414) / d); return [c[0] + (p[0] - c[0]) * f, c[1] + (p[1] - c[1]) * f]; }); };

export default film((tl) => {
  // sullo schermo, a destra in alto:  a² + b² = c²  e sotto  16 + 9 = 25
  const R1 = 0.095, R2 = 0.245, UA = 0.625, UP = 0.705, UB = 0.775, UE = 0.848, UC = 0.925, FL = 0.15, FN = 0.14;

  tl.start(6.4, -1, { x: 1.55, y: -1.02, zm: 0.86 });
  const ENTER = tl.walk(4.6, 1.5);
  const BAG1 = tl.span(1.1), TOSS1 = tl.span(1.5);  // il bastone lungo 4: per terra
  const BAG2 = tl.span(1.1), TOSS2 = tl.span(1.5);  // il bastone lungo 3: in piedi, a squadra
  const ASK = tl.span(3.4);                         // e il lato storto?
  const SEVEN = tl.span(5.6);                       // 4 + 3 = 7? Troppo lungo
  const SQA = tl.span(4.4);                         // il quadrato sul 4: 16
  const SQB = tl.span(3.8);                         // il quadrato sul 3: 9
  const POUR = tl.span(7.6);                        // le 25 piastrelle riempiono il quadrato sul lato storto
  const ROOT = tl.span(4.8);                        // il suo lato: 5
  const FORM = tl.span(5.4);                        // a² + b² = c²
  const CHEER = tl.span(2.2);
  const END = tl.span(5.2);

  const POP1 = BAG1.at(0.5), REL1 = TOSS1.at(0.4), LAND1 = REL1 + 0.6;
  const POP2 = BAG2.at(0.5), REL2 = TOSS2.at(0.4), LAND2 = REL2 + 0.55;
  const DASH = ASK.at(0.1), QM = ASK.at(0.45);
  const TA = (n) => SQA.at(0.2) + n * 0.075, TB = (n) => SQB.at(0.2) + n * 0.11;
  const NA = TA(16) + 0.1, NB = TB(9) + 0.1;
  const GOF = (n) => POUR.at(0.16) + n * 0.15, FLY = 0.85, FULL = GOF(24) + FLY;
  const CNT = [0, 1, 2, 3, 4].map((i) => ROOT.at(0.14 + 0.1 * i)), FIVE = ROOT.at(0.72);
  const LT = [0, 1, 2, 3, 4].map((i) => FORM.at(0.12 + 0.14 * i));
  const n16 = tl.chip({ str: '16', col: CA, up: true, size: 0.75, born: NA, at: () => [1, -1], go: SQB.at(0.02), fly: 0.8, h: 1.2, slot: { u: UA, v: R2, frac: FN } });
  const n9 = tl.chip({ str: '9', col: CB, up: true, size: 0.7, born: NB, at: () => [2.75, 0.75], go: POUR.at(0.02), fly: 0.8, h: 1, slot: { u: UB, v: R2, frac: FN } });
  const n25 = tl.chip({ str: '25', col: CC, up: true, size: 0.85, born: FULL + 0.15, at: () => [0.25, 1.75], go: ROOT.at(0.02), fly: 0.8, h: 0.8, slot: { u: UC, v: R2, frac: FN } });
  const PLUS = n9.dock, EQ = FULL + 0.15;

  // ----- quello che succede -----
  const out = (S) => { S.snd.tone(700, 320, 0.1, 0.09, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); };
  tl.on(POP1, out); tl.on(POP2, out);
  tl.on(REL1, (S) => S.snd.noise(0.34, 0.08, 400, 2600)); tl.on(REL2, (S) => S.snd.noise(0.34, 0.08, 400, 2600));
  tl.on(LAND1, (S) => { S.snd.tone(150, 70, 0.14, 0.14); S.snd.noise(0.1, 0.08, 800, 200); S.dust(1, 0, 8, 5); S.kick({ shake: 0.04 }); });
  tl.on(LAND2, (S) => { S.snd.tone(140, 50, 0.16, 0.16); S.snd.noise(0.1, 0.08, 700, 150); S.snd.tone(520, 400, 0.22, 0.05, 'triangle', 0.03); S.dust(2, 0, 6, 4); S.kick({ shake: 0.05 }); });
  tl.on(DASH, (S) => S.snd.noise(0.5, 0.05, 900, 3000));
  tl.on(QM, (S) => S.snd.tone(440, 330, 0.25, 0.07, 'triangle'));
  tl.on(SEVEN.at(0.05), (S) => S.snd.tone(300, 600, 0.3, 0.06, 'triangle'));
  tl.on(SEVEN.at(0.3), (S) => S.snd.tick(900, 0.06));
  tl.on(SEVEN.at(0.34), (S) => S.snd.noise(0.5, 0.05, 600, 1800));
  tl.on(SEVEN.at(0.6), (S) => { S.snd.tone(140, 110, 0.4, 0.1, 'sawtooth'); S.snd.tone(105, 82, 0.4, 0.08, 'sawtooth', 0.05); S.kick({ shake: 0.05 }); });
  for (let n = 0; n < 16; n++) tl.on(TA(n), (S) => S.snd.tone(500 + 30 * n, 650 + 30 * n, 0.07, 0.05, 'triangle'));
  for (let n = 0; n < 9; n++) tl.on(TB(n), (S) => S.snd.tone(600 + 40 * n, 780 + 40 * n, 0.07, 0.05, 'triangle'));
  const num = (S) => S.snd.chime([784, 1047], 0.08, 0.08), whoosh = (S) => S.snd.noise(0.2, 0.05, 500, 2200), dock = (f) => (S) => S.snd.tone(f, f * 1.5, 0.12, 0.06, 'triangle');
  tl.on(NA, num); tl.on(NB, num);
  tl.on(n16.go, whoosh); tl.on(n16.dock, dock(659)); tl.on(n9.go, whoosh); tl.on(n9.dock, dock(784));
  tl.on(POUR.at(0.06), (S) => S.snd.noise(0.5, 0.05, 900, 3000));
  for (let n = 0; n < 25; n++) { tl.on(GOF(n), (S) => S.snd.noise(0.1, 0.03, 700, 2200)); tl.on(GOF(n) + FLY, (S) => S.snd.tone(440 + 28 * n, 520 + 28 * n, 0.08, 0.06, 'triangle')); }
  tl.on(FULL + 0.05, (S) => { S.kick({ shake: 0.12, punch: 0.03, flash: 0.2, chroma: 6, stop: 0.05 }); S.snd.boom(0.16); S.snd.tone(180, 760, 0.5, 0.1, 'triangle'); S.wave([0.25, 1.75], 4.5, 0.6, CC, 0.12); });
  tl.on(n25.go, whoosh); tl.on(n25.dock, dock(1047));
  CNT.forEach((c, i) => tl.on(c, (S) => S.snd.tone(523 + 80 * i, 523 + 80 * i, 0.2, 0.08, 'triangle')));
  tl.on(FIVE, (S) => { S.snd.chime([784, 1047, 1319], 0.09, 0.08); S.burst([0.82, 0.99], 9, 6, 0.4, CC, { kind: 'plus' }); });
  LT.forEach((c, i) => tl.on(c, (S) => S.snd.tone([659, 698, 784, 880, 1047][i], [659, 698, 784, 880, 1047][i], 0.3, 0.08, 'triangle')));
  tl.on(CHEER.a, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  const bag = (sp, born) => (S, P, auto, t) => {
    P.h[0] = KS(t, [[sp.a, auto[0]], [sp.at(0.3), ['P', -0.12, 0.17], 'io'], [born, ['P', -0.1, 0.2]], [sp.at(0.85), ['L', 0.5, 0.2], 'out'], [sp.b, ['L', 0.5, 0.2]]]);
    P.handNow = 0; P.look = t < born + 0.1 ? [0.2, -0.8] : [0.9, 0.2]; P.lean = 10 * prog(t, sp.a, sp.at(0.3)) * (1 - prog(t, born, sp.at(0.8))); P.leanNow = true;
    return false;
  };
  tl.pose(BAG1, bag(BAG1, POP1)); tl.pose(TOSS1, toss(0, { rel: 0.4, from: ['L', 0.5, 0.2], look: [1, -0.2] }));
  tl.pose(BAG2, bag(BAG2, POP2)); tl.pose(TOSS2, toss(0, { rel: 0.4, from: ['L', 0.5, 0.2], look: [1, 0] }));
  tl.pose(tl.part(ASK, 0.3, 1), think({ look: [1, 0.1] }));
  tl.pose(SEVEN, (S, P, auto, t) => { const u = SEVEN.u(t); P.look = [1, 0.2]; if (u > 0.6 && u < 0.92) { P.head = 9 * Math.sin((u - 0.6) * 60); P.expr = '-'; } return false; });
  tl.pose(tl.part(SQA, 0.04, 0.8), point(0, [1, -1], { len: 0.62 }));
  tl.pose(tl.part(SQB, 0.04, 0.8), point(0, [2.75, 0.75], { len: 0.62 }));
  tl.pose(tl.part(POUR, 0.1, 0.9), point(0, (S, t) => mixP([1.8, -0.4], [0.6, 2.2], prog(t, POUR.at(0.15), POUR.at(0.8))), { len: 0.64 }));
  tl.pose(tl.part(POUR, 0.9, 1), look(1, 0.5, 'O'));
  tl.pose(ROOT, look(1, 0.4));
  tl.pose(FORM, look(0.2, 0.95, '^'));
  tl.pose(CHEER, cheer({ n: 3 }));
  tl.pose(END, (S, P, auto, t) => {
    const k = prog(t, END.at(0.1), END.at(0.22), 'out');
    P.h[0] = mixT(auto[0], ['L', 0.3, 0.62], k); P.h[1] = mixT(auto[1], ['P', -0.13, 0.04], k); P.handNow = true;
    P.look = t < END.at(0.5) ? [0.4, 0.95] : [0.15, 0.1]; P.expr = '^';
    return false;
  });

  // un bastone: in mano, in volo (gira), al suo posto
  const stick = (S, t, born, rel, landT, p1, q1, spin) => {
    if (t < born) return null;
    const L = Math.hypot(q1[0] - p1[0], q1[1] - p1[1]), a1 = Math.atan2(q1[1] - p1[1], q1[0] - p1[0]), c1 = [(p1[0] + q1[0]) / 2, (p1[1] + q1[1]) / 2];
    let c, a, k = 1;
    if (t < rel) { const h = S.J.h[0]; c = h; a = 2.5; k = pop(t, born, 0.3); }
    else if (t < landT) { const u = (t - rel) / (landT - rel), c0 = (S.v.rel && S.v.rel[born]) || [4.2, 1.8]; c = arc(c0, c1, u, 1.3); a = lerp(2.5, a1 + spin, EASE.io(u)); }
    else { c = c1; a = a1 + spin + (spin ? 0 : 0.12 * Math.exp(-6 * (t - landT)) * Math.sin(26 * (t - landT))); }
    const dx = (Math.cos(a) * L * k) / 2, dy = (Math.sin(a) * L * k) / 2;
    return [[c[0] - dx, c[1] - dy], [c[0] + dx, c[1] + dy]];
  };
  tl.on(REL1, (S) => { (S.v.rel || (S.v.rel = {}))[POP1] = [...S.J.h[0]]; });
  tl.on(REL2, (S) => { (S.v.rel || (S.v.rel = {}))[POP2] = [...S.J.h[0]]; });
  const ticks = (D, p, q, n, col) => { const dx = (q[0] - p[0]) / n, dy = (q[1] - p[1]) / n, L = Math.hypot(dx, dy), nx = (-dy / L) * 0.07, ny = (dx / L) * 0.07; for (let i = 1; i < n; i++) D.seg([p[0] + dx * i - nx, p[1] + dy * i - ny], [p[0] + dx * i + nx, p[1] + dy * i + ny], 0.028, col); };

  return {
    ground: { ticks: false, body: false },
    back(S, D, t) {
      // i quadrati vuoti restano come contorno
      if (t >= SQA.at(0.1)) D.alpha(0.7, () => D.path([[0, 0], [2, 0], [2, -2], [0, -2]], 0.03, CA, { close: true }));
      if (t >= SQB.at(0.1)) D.alpha(0.7, () => D.path([B, [3.5, 0], [3.5, 1.5], C], 0.03, CB, { close: true }));
      if (t >= POUR.at(0.06)) { const k = prog(t, POUR.at(0.06), POUR.at(0.14)), q = [A, C, add(C, [-1.5, 2]), add(A, [-1.5, 2])]; D.alpha(0.8 * k, () => D.path(q, 0.03, CC, { close: true, dash: t < FULL ? [0.12, 0.1] : null })); }
      // le piastrelle: nate nei due quadrati piccoli, volano in quello grande
      for (let n = 0; n < 25; n++) {
        const fromA = n < 16, src = fromA ? sqA(n) : sqB(n - 16), dst = sqC(n), col = fromA ? CA : CB, t0 = fromA ? TA(n) : TB(n - 16);
        if (t < t0) continue;
        const w = (t - GOF(n)) / FLY;
        if (w <= 0) quad(D, shrink(src, 0.03, pop(t, t0, 0.2)), col, { a: 0.3 });
        else if (w < 1) { const e = EASE.io(w), lift = 0.9 * Math.sin(Math.PI * w); quad(D, shrink(src.map((p, i) => [lerp(p[0], dst[i][0], e), lerp(p[1], dst[i][1], e) + lift])), col, { a: 0.3 }); }
        else quad(D, shrink(dst, 0.03, 1 + boing(t - GOF(n) - FLY, 0.2) + boing(t - FULL - 0.05, 0.12, 16, 8)), col, { a: 0.34 });
      }
    },
    front(S, D, t) {
      // i due bastoni, con le tacche per contare
      const sa = stick(S, t, POP1, REL1, LAND1, A, B, 2 * Math.PI), sb = stick(S, t, POP2, REL2, LAND2, B, C, 0);
      if (sa) { D.seg(sa[0], sa[1], 0.08, CA); if (t >= LAND1) ticks(D, A, B, 4, COL.ink); }
      if (sb) { D.seg(sb[0], sb[1], 0.08, CB); if (t >= LAND2) { ticks(D, B, C, 3, COL.ink); D.path([[1.8, 0], [1.8, 0.2], [2, 0.2]], 0.03, COL.ink); } }
      if (t >= LAND1 + 0.2) D.glyph('4', 1, -0.26, 0.34 * pop(t, LAND1 + 0.2), CA, { style: '600' });
      if (t >= LAND2 + 0.2) D.glyph('3', 2.28, 0.75, 0.34 * pop(t, LAND2 + 0.2), CB, { style: '600' });
      // il lato storto: prima una domanda, poi 5
      if (t >= DASH) {
        const k = prog(t, DASH, DASH + 0.6);
        if (t < FIVE) dashed(D, A, mixP(A, C, k), COL.ink, { w: 0.04, dash: [0.12, 0.1] }); else { D.seg(A, C, 0.08 * (1 + boing(t - FIVE, 0.4)), CC); ticks(D, A, C, 5, COL.ink); }
        if (t >= ROOT.a && t < FIVE) for (let i = 0; i < 5; i++) if (t >= CNT[i]) D.seg(mixP(A, C, i / 5), mixP(A, C, (i + 1) / 5), 0.08, CC);
        if (t >= QM) D.glyph(t < FIVE ? '?' : '5', 0.82, 0.99, 0.4 * (t < FIVE ? pop(t, QM) : pop(t, FIVE) * (1 + boing(t - FIVE, 0.4))), t < FIVE ? COL.sun : CC, { style: '600' });
      }
      // 4 + 3 = 7? I due bastoni in fila, girati sul lato storto: avanza un pezzo
      if (SEVEN.has(t)) {
        const u = SEVEN.u(t), a = fade(t, SEVEN.at(0.86), SEVEN.d * 0.12), up = 0.3 * prog(u, 0, 0.14), ang = Math.atan2(1.5, 2) * prog(u, 0.34, 0.56);
        const dir = [Math.cos(ang), Math.sin(ang)], o = [0, up * (1 - prog(u, 0.34, 0.56))], j = prog(u, 0.12, 0.3);
        D.alpha(0.6 * a, () => {
          D.seg(add(o, [0, 0]), add(o, [dir[0] * 2, dir[1] * 2]), 0.07, CA);
          const p = mixP(add(B, [0, up]), add(o, [dir[0] * 2, dir[1] * 2]), j), q = mixP(add(C, [0, up]), add(o, [dir[0] * 3.5, dir[1] * 3.5]), j);
          D.seg(p, q, 0.07, CB);
        });
        if (u > 0.6) { const e = [2.8, 2.1], bl = 0.5 + 0.5 * Math.sin(u * 90); D.alpha(a * bl, () => D.seg(C, e, 0.1, COL.coral)); D.alpha(a, () => { D.seg([e[0] - 0.2, e[1] + 0.5], [e[0] + 0.2, e[1] + 0.1], 0.06, COL.coral); D.seg([e[0] - 0.2, e[1] + 0.1], [e[0] + 0.2, e[1] + 0.5], 0.06, COL.coral); }); }
      }
      // i numeri e la frase sullo schermo
      n16.draw(S, D, t, { bump: boing(t - LT[0], 0.3) }); n9.draw(S, D, t, { bump: boing(t - LT[2], 0.3) }); n25.draw(S, D, t, { bump: boing(t - LT[4], 0.3) });
      if (t >= PLUS) hud.glyph(D, UP, R2, FN, '+', COL.ink, { style: '600', k: pop(t, PLUS) });
      if (t >= EQ) hud.eq(D, UE, R2, pop(t, EQ));
      const sq = (u, ch, col, t0) => { if (t < t0) return; hud.glyph(D, u - 0.01, R1, FL, ch, col, { k: pop(t, t0) }); hud.glyph(D, u + 0.026, R1 - 0.055, 0.095, '2', COL.sun, { style: '600', k: pop(t, t0 + 0.1) }); };
      sq(UA, 'a', CA, LT[0]); if (t >= LT[1]) hud.glyph(D, UP, R1, FL, '+', COL.ink, { style: '600', k: pop(t, LT[1]) });
      sq(UB, 'b', CB, LT[2]); if (t >= LT[3]) hud.eq(D, UE, R1, pop(t, LT[3]));
      sq(UC, 'c', CC, LT[4]);
      // le lettere dei lati, accanto ai numeri
      if (t >= LT[0]) D.glyph('a', 1.42, -0.26, 0.36 * pop(t, LT[0]), CA);
      if (t >= LT[2]) D.glyph('b', 2.28, 1.12, 0.36 * pop(t, LT[2]), CB);
      if (t >= LT[4]) D.glyph('c', 0.52, 0.76, 0.36 * pop(t, LT[4]), CC);
    },
  };
});
