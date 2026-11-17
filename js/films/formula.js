// Leggere una formula: v = d / t
// L'omino corre due volte per tre secondi. La prima volta fa 6 metri: la striscia che resta per terra è la distanza,
// il cronometro è il tempo, e ogni secondo lascia per terra una freccia lunga quanto la strada fatta in quel secondo.
// Le tre frecce sono uguali: una di loro è la velocità. Con le mani l'omino trasforma le tre cose in lettere e monta
// la formula, con i numeri accanto: v = d / t = 6 / 3 = 2. Poi corre più forte: 12 metri negli stessi tre secondi.
// I numeri della formula cambiano da soli, e le frecce sono lunghe il doppio.
import { COL, EASE, KN, KS, RIG, clamp, lerp, prog } from '../toon.js';
import { film, add, mixP, mixT, boing, pop, fade, bez, carry, toss, point, look, cheer, nod, startle, hud, measure } from '../toonkit.js';

const C = { v: COL.sky, d: COL.orange, t: COL.mint };
const TY = 0.09, TW = 0.085;          // la striscia: a che altezza sta, quanto è spessa
const AY = 0.36;                      // le frecce dei secondi, appena sopra la striscia
const WR = 0.3;                       // il raggio del cronometro

function watch(D, x, y, sec, k = 1, lit = -1) {
  if (k <= 0.02) return;
  const { ctx } = D, r = WR * k, q = Math.PI / 2;                           // un giro intero vale 4 secondi: ogni spicchio è un secondo
  for (let i = 0; i < 4; i++) {
    const f = clamp(sec - i); if (f <= 0) break;
    ctx.beginPath(); ctx.moveTo(D.sx(x), D.sy(y)); ctx.arc(D.sx(x), D.sy(y), r * 0.82 * D.Z, -q + i * q, -q + (i + f) * q); ctx.closePath();
    ctx.fillStyle = i === lit ? 'rgba(160, 255, 220, .95)' : 'rgba(79, 227, 181, .36)'; ctx.fill();
  }
  D.circle(x, y, r, COL.ink, { w: 0.05 * k });
  D.seg([x, y + r], [x, y + r + 0.1 * k], 0.06 * k, COL.ink); D.seg([x - 0.08 * k, y + r + 0.11 * k], [x + 0.08 * k, y + r + 0.11 * k], 0.05 * k, COL.ink);
  for (let i = 0; i < 4; i++) { const b = i * q; D.seg([x + Math.sin(b) * r * 0.76, y + Math.cos(b) * r * 0.76], [x + Math.sin(b) * r * 0.94, y + Math.cos(b) * r * 0.94], 0.028 * k, COL.soft); }
  const a = sec * q; D.seg([x, y], [x + Math.sin(a) * r * 0.74, y + Math.cos(a) * r * 0.74], 0.05 * k, C.t);
  D.circle(x, y, 0.04 * k, null, { fill: C.t });
}

export default film((tl) => {
  const D1 = 6, D2 = 12, TT = 3, V1 = D1 / TT, V2 = D2 / TT;
  // i posti della formula sullo schermo:  v = d/t = 6/3 = 2
  const HV = 0.25, HT = 0.125, HB = 0.375, FL = 0.18, FN = 0.16;
  const U = { v: 0.115, e1: 0.19, f1: 0.265, e2: 0.345, f2: 0.425, e3: 0.51, r: 0.585 };

  tl.start(0, 1, { x: 0.9, zm: 1.3 });
  const LOOK = tl.span(1.2);
  const BAG = tl.span(1.8);                                       // tira fuori il cronometro dalla tracolla
  const READY = tl.flag('ant', tl.span(0.8));
  const RUN1 = tl.move(tl.span(TT), D1, 'lin');                   // 6 metri in 3 secondi
  const STOP1 = tl.move(tl.span(0.5), D1 + 0.43, 'out');
  const REST1 = tl.span(1.8);
  tl.face(REST1.at(0.3), -1);
  const DSEE = tl.span(2.6);                                      // guarda la striscia: quanto è lunga? 6
  const DGRAB = tl.span(1.6);                                     // la prende per la punta: si arrotola e diventa d
  const DHOLD = tl.span(0.9);
  const DTOSS = tl.span(1.0);
  const TSEE = tl.span(2.6);                                      // il cronometro: tre spicchi, 3
  const TANT = tl.flag('ant', tl.span(0.25));
  const TJUMP = tl.jump(tl.span(0.56), 6.1, { h: 0.66 });         // salta e lo prende: diventa t
  const THOLD = tl.span(0.9);
  const TTOSS = tl.span(1.0);
  const CHOP = tl.span(1.3);                                      // un taglio nell'aria: la linea di frazione
  const VSEE = tl.span(4.2);                                      // le tre frecce si alzano, si mettono una sull'altra: sono uguali
  const VGRAB = tl.span(1.3);                                     // ne prende una: diventa v
  const VHOLD = tl.span(0.8);
  const VTOSS = tl.span(1.0);
  const READ = tl.span(4.2);                                      // la formula intera, letta pezzo per pezzo
  const IDEA = tl.span(1.2);                                      // e se corro più forte?
  const BACK = tl.walk(0, 4.4);
  tl.face(BACK.b, 1);
  const READY2 = tl.span(1.0);
  tl.flag('ant', tl.part(READY2, 0.4, 1));
  const RUN2 = tl.move(tl.span(TT), D2, 'lin');                   // 12 metri in 3 secondi
  const STOP2 = tl.flag('brake', tl.move(tl.span(0.55), D2 + 0.95, 'out'));
  const WIDE = tl.span(1.6);
  tl.face(WIDE.at(0.4), -1);
  const VSEE2 = tl.span(4.8);                                     // le frecce nuove: lunghe il doppio di quelle di prima
  const RESULT = tl.span(3.0);                                    // 12 / 3 = 4
  const END = tl.span(5.0);

  tl.cam(RUN1.a, { follow: 1.2, zm: 1, k: 3.4 });
  tl.cam(STOP1.b, { x: 3.6, zm: 1.02, k: 2 });
  tl.cam(BACK.a, { follow: -1, zm: 1.02, k: 3 });
  tl.cam(BACK.b, { x: 1.1, zm: 1.12, k: 2.4 });
  tl.cam(RUN2.a, { follow: 1.6, zm: 0.92, k: 3.6 });
  tl.cam(WIDE.a, { x: 6.6, zm: 0.69, k: 1.6, kz: 1.6 });
  tl.cam(END.a, { follow: -1.9, zm: 1.08, k: 1.6, kz: 1.4 });

  // ----- gli istanti dentro le battute -----
  const WPOP = BAG.at(0.45);                                      // il cronometro esce dalla tracolla
  const GRAB = DGRAB.a + 0.42, REEL0 = GRAB + 0.04, REEL1 = GRAB + 0.56, SNAP = GRAB + 0.62;
  const CATCH = TJUMP.at(0.5), TBORN = CATCH + 0.06;
  const SLICE = CHOP.at(0.35), BARS = CHOP.at(0.6);
  const VTAKE = VGRAB.at(0.34), VBORN = VGRAB.at(0.8);
  const PARK = [5.75, 2.75];                                      // dove il cronometro si ferma dopo la prima corsa
  const M1 = 3.7, M2 = 8.4, MY = 1.25;                            // dove si raccolgono le frecce (la coda), e a che altezza

  // ----- le lettere e i numeri -----
  const hand = (S, k = 1) => add(S.J.h[0], [0, 0.27 * k]);
  const cD = tl.chip({ str: 'd', col: C.d, size: 0.72, born: SNAP, at: (S) => hand(S), go: DTOSS.at(0.4), fly: 0.6, h: 0.7, spin: true, slot: { u: U.f1, v: HT, frac: FL } });
  const cT = tl.chip({ str: 't', col: C.t, size: 0.72, born: TBORN, at: (S) => hand(S), go: TTOSS.at(0.4), fly: 0.6, h: 0.5, spin: true, slot: { u: U.f1, v: HB, frac: FL } });
  const cV = tl.chip({ str: 'v', col: C.v, size: 0.72, born: VBORN, at: (S) => hand(S), go: VTOSS.at(0.4), fly: 0.6, h: 0.6, spin: true, slot: { u: U.v, v: HV + 0.01, frac: FL } });
  // i numeri nascono accanto alle cose misurate, poi vanno nella formula; nella seconda corsa contano da soli
  const cN6 = tl.chip({ str: (S, t) => (t < READY2.a ? '6' : String(Math.floor(clamp(S.hero.x, 0, D2) + 1e-6))), col: C.d, up: true, size: 0.6,
    born: DSEE.at(0.6), at: () => [3, 1.72], go: DTOSS.at(0.8), fly: 0.6, h: 0.3, slot: { u: U.f2, v: HT, frac: FN } });
  const cN3 = tl.chip({ str: (S, t) => (t < READY2.a ? '3' : String(Math.floor(clamp(t - RUN2.a, 0, TT) + 1e-6))), col: C.t, up: true, size: 0.5,
    born: TSEE.at(0.62), at: () => [PARK[0] + 0.66, PARK[1]], go: TTOSS.at(0.8), fly: 0.6, h: 0.3, slot: { u: U.f2, v: HB, frac: FN } });
  const cN2 = tl.chip({ str: '2', col: C.v, up: true, size: 0.5, born: VSEE.at(0.86), at: () => [M1 + 1, MY + 0.42], go: VTOSS.at(0.8), fly: 0.6, h: 0.3, slot: { u: U.r, v: HV, frac: FN } });
  const cN4 = tl.chip({ str: '4', col: C.v, up: true, size: 0.72, born: VSEE2.at(0.86), at: () => [M2 + 2, MY + 1.05], go: RESULT.at(0.12), fly: 0.7, h: 0.5, slot: { u: U.r, v: HV, frac: FN } });
  const E2 = BARS + 0.2, E1 = cV.dock, E3a = cN2.dock, E3b = cN4.dock;

  // ----- le cose che succedono -----
  const tickMark = (run, k, x) => (S, t) => {
    S.v.marks.push({ x, k, t0: t, run }); S.snd.tick(1320, 0.06); S.burst([x, 0.1], 5, 3, 0.35, C.t, { up: 1 });
    if (run === 1) S.wave([S.v.w[0], S.v.w[1]], 1.3, 0.3, C.t, 0.07);
  };
  tl.on(WPOP, (S) => { S.snd.tone(700, 320, 0.1, 0.09, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); });
  tl.on(RUN1.a, (S) => { S.v.w = add(S.J.h[0], [0, WR + 0.02]); S.snd.tick(1760, 0.07); S.snd.tone(240, 560, 0.16, 0.06); S.snd.noise(0.2, 0.06, 500, 2200); S.dust(0, 0, 8, 5); });
  for (let k = 1; k <= TT; k++) tl.on(RUN1.a + k - 0.001, tickMark(1, k, V1 * k));
  tl.on(RUN1.b, (S) => S.snd.chime([784, 1047], 0.08, 0.08));
  // la striscia: un conto veloce dei metri, poi il numero
  for (let i = 0; i < D1; i++) tl.on(DSEE.at(0.14) + i * 0.13, (S) => S.snd.tick(700 + 90 * i, 0.045));
  tl.on(cN6.born, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.burst([3, 1.72], 8, 5, 0.4, C.d, { kind: 'plus' }); });
  tl.on(GRAB, (S) => S.snd.tone(520, 780, 0.12, 0.08, 'triangle'));
  tl.on(REEL0, (S) => { S.snd.noise(0.5, 0.05, 700, 3600); S.snd.tone(180, 760, 0.5, 0.09, 'triangle'); });
  tl.on(SNAP, (S) => { S.burst(hand(S), 8, 5, 0.4, C.d, { kind: 'plus' }); S.snd.tone(700, 320, 0.1, 0.1, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); });
  const whoosh = (S) => S.snd.noise(0.2, 0.05, 500, 2200);
  const land = (col, f) => (S) => S.snd.tone(f, f * 1.5, 0.12, 0.06, 'triangle');
  tl.on(cD.go, whoosh); tl.on(cD.dock, land(C.d, 880)); tl.on(cN6.dock, land(C.d, 660));
  for (let i = 0; i < TT; i++) tl.on(TSEE.at(0.15 + 0.18 * i), (S) => S.snd.tick(1100 + 160 * i, 0.06));
  tl.on(cN3.born, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.burst([PARK[0] + 0.66, PARK[1]], 8, 5, 0.4, C.t, { kind: 'plus' }); });
  tl.on(CATCH, (S) => { S.snd.tone(500, 1000, 0.2, 0.1, 'triangle'); S.burst(add(S.J.h[0], [0, WR]), 8, 5, 0.4, C.t, { kind: 'plus' }); });
  tl.on(cT.go, whoosh); tl.on(cT.dock, land(C.t, 784)); tl.on(cN3.dock, land(C.t, 587));
  tl.on(SLICE, (S) => { S.v.sl = [...S.J.h[0]]; S.snd.noise(0.12, 0.1, 1800, 5500); });
  tl.on(BARS, (S) => S.snd.tone(440, 660, 0.09, 0.07, 'triangle'));
  tl.on(E2, (S) => S.snd.tick(900, 0.05));
  // le tre frecce: su, in fila, una sola
  tl.on(VSEE.at(0.02), (S) => S.snd.tone(300, 600, 0.3, 0.06, 'triangle'));
  tl.on(VSEE.at(0.34), (S) => S.snd.noise(0.3, 0.05, 600, 1800));
  tl.on(VSEE.at(0.68), (S) => { S.snd.tick(900, 0.06); S.snd.tick(1100, 0.06); });
  tl.on(VSEE.at(0.8), (S) => { S.snd.tone(440, 660, 0.12, 0.08, 'triangle'); S.wave([M1 + 1, MY], 2.2, 0.4, C.v, 0.08); });
  tl.on(cN2.born, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.burst([M1 + 1, MY + 0.42], 8, 5, 0.4, C.v, { kind: 'plus' }); });
  tl.on(VTAKE, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.snd.tone(180, 760, 0.42, 0.07, 'triangle', 0.05); });
  tl.on(VBORN, (S) => { S.burst(hand(S), 8, 5, 0.4, C.v, { kind: 'plus' }); S.snd.tone(700, 320, 0.1, 0.1, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); });
  tl.on(cV.go, whoosh);
  tl.on(cV.dock, (S) => { S.snd.tone(988, 1480, 0.12, 0.06, 'triangle'); S.kick({ shake: 0.04 }); });
  tl.on(cN2.dock, land(C.v, 523));
  // la formula letta pezzo per pezzo: una nota per ogni pezzo
  const NOTES = [523, 587, 659, 698, 784, 880, 988, 1047, 1175];
  NOTES.forEach((f, i) => tl.on(READ.at(0.12) + i * 0.26, (S) => S.snd.tone(f, f, 0.3, 0.08, 'triangle')));
  tl.on(IDEA.at(0.25), (S) => { S.snd.tone(660, 1320, 0.18, 0.09, 'triangle'); });
  tl.on(RUN2.a, (S) => { S.snd.tick(1760, 0.07); S.snd.tone(240, 560, 0.16, 0.06); S.snd.noise(0.2, 0.07, 500, 2200); S.dust(0, 0, 9, 6); });
  for (let k = 1; k <= TT; k++) tl.on(RUN2.a + k - 0.001, tickMark(2, k, V2 * k));
  tl.on(RUN2.b, (S) => S.snd.chime([784, 1047], 0.08, 0.08));
  tl.on(VSEE2.at(0.02), (S) => S.snd.tone(300, 600, 0.3, 0.06, 'triangle'));
  tl.on(VSEE2.at(0.3), (S) => S.snd.noise(0.3, 0.05, 600, 1800));
  tl.on(VSEE2.at(0.5), (S) => { S.snd.tone(440, 660, 0.12, 0.08, 'triangle'); S.wave([M2 + 2, MY], 3, 0.4, C.v, 0.08); });
  tl.on(VSEE2.at(0.62), (S) => S.snd.tick(880, 0.07));
  tl.on(VSEE2.at(0.74), (S) => S.snd.tick(1175, 0.07));
  tl.on(cN4.born, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.burst([M2 + 2, MY + 1.05], 9, 6, 0.4, C.v, { kind: 'plus' }); });
  tl.on(cN4.go, whoosh);
  tl.on(cN4.dock, (S) => { S.kick({ shake: 0.12, punch: 0.03, flash: 0.2, chroma: 6, stop: 0.05 }); S.snd.boom(0.16); S.snd.tone(180, 760, 0.5, 0.1, 'triangle'); });
  tl.on(cN4.dock + 0.16, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  tl.pose(LOOK, look(1, 0.05));
  tl.pose(BAG, (S, P, auto, t) => {     // la mano va alla tracolla, fruga, torna su con il cronometro
    P.h[0] = KS(t, [[BAG.a, auto[0]], [BAG.at(0.28), ['P', -0.12, 0.17], 'io'], [WPOP, ['P', -0.1, 0.2]], [BAG.at(0.78), ['L', 0.66, 0.02], 'out'], [BAG.b, ['L', 0.66, 0.02]]]);
    P.handNow = 0; P.look = t < WPOP + 0.1 ? [0.2, -0.8] : [0.9, 0.15]; P.lean = 10 * prog(t, BAG.a, BAG.at(0.28)) * (1 - prog(t, WPOP, BAG.at(0.7))); P.leanNow = true;
    return false;
  });
  tl.pose(READY, carry(0, [0.68, 0], { look: [0.9, 0.15] }));
  tl.pose(tl.between(RUN1.a, RUN1.a + 0.32), (S, P, auto, t) => { P.h[0] = KS(t, [[RUN1.a, ['L', 0.68, 0]], [RUN1.a + 0.08, ['L', 0.42, 0.6], 'out'], [RUN1.a + 0.32, auto[0]]]); P.handNow = 0; P.look = [1, 0.4]; return false; });
  tl.pose(REST1, (S, P, auto, t) => { P.look = t < REST1.at(0.3) ? [1, 0.2] : [1, -0.3]; return false; });
  tl.pose(DSEE, point(0, [3.6, 0.2], { in: 0.2, out: 0.25 }));
  tl.pose(DGRAB, (S, P, auto, t) => {   // si china, prende la punta della striscia e la tira su: lei si arrotola nella mano
    const a = DGRAB.a;
    P.py = KN(t, [[a, RIG.STAND], [GRAB - 0.02, 0.38, 'out'], [GRAB + 0.06, 0.38], [GRAB + 0.5, RIG.STAND + 0.02, 'out3'], [DGRAB.b, RIG.STAND]]);
    P.lean = KN(t, [[a, 0], [GRAB - 0.02, 50, 'out'], [GRAB + 0.06, 50], [GRAB + 0.5, -7, 'out3'], [DGRAB.b, 0]]); P.head = -0.4 * P.lean;
    P.h[0] = KS(t, [[a, auto[0]], [GRAB - 0.02, ['W', D1, TY + 0.02], 'out'], [GRAB + 0.06, ['W', D1, TY + 0.02]], [GRAB + 0.5, ['L', 0.4, 0.04], 'out3'], [DGRAB.b, ['L', 0.58, 0.14]]]);
    P.h[1] = mixT(auto[1], ['L', -0.3, -0.25], prog(t, a, GRAB) * (1 - prog(t, GRAB + 0.2, GRAB + 0.6)));
    P.look = t < GRAB + 0.1 ? [0.5, -0.9] : [0.9, 0.35]; P.expr = t >= SNAP && t < SNAP + 0.17 ? 'O' : 'o';
    return true;
  });
  tl.pose(DHOLD, carry(0, [0.58, 0.14], { look: [0.9, 0.35] }));
  tl.pose(DTOSS, toss(0, { rel: 0.4, look: [0.3, 0.9] }));
  tl.pose(TSEE, look(0.5, 0.9));
  tl.pose(tl.between(TANT.a, THOLD.b), (S, P, auto, t) => {   // salta: la mano va al cronometro e lo prende al culmine
    P.look = [0.4, 0.95];
    const g = ['W', PARK[0], PARK[1] - WR - 0.02];
    if (!S.hero.onG) P.h[0] = t < CATCH ? mixT(P.h[0], g, prog(t, TJUMP.a + 0.08, CATCH - 0.02, 'out')) : mixT(g, ['L', 0.58, 0.16], prog(t, CATCH, CATCH + 0.22));
    else if (t >= TJUMP.b) { P.h[0] = ['L', 0.58, 0.14]; P.handNow = 0; P.look = [0.9, 0.35]; }
    return false;
  });
  tl.pose(TTOSS, toss(0, { rel: 0.4, look: [0.3, 0.9] }));
  tl.pose(CHOP, (S, P, auto, t) => {    // un taglio netto nell'aria
    P.h[0] = KS(t, [[CHOP.a, auto[0]], [SLICE - 0.07, ['L', 0.12, 0.5], 'out'], [SLICE + 0.04, ['L', 0.68, 0.4], 'out3'], [SLICE + 0.25, ['L', 0.62, 0.36]], [CHOP.b, auto[0]]]);
    P.lean = KN(t, [[CHOP.a, 0], [SLICE - 0.07, -5], [SLICE + 0.04, 9, 'out3'], [CHOP.b, 0]]); P.leanNow = true; P.handNow = 0; P.look = [0.4, 0.85];
    return false;
  });
  tl.pose(VSEE, (S, P, auto, t) => { const u = VSEE.u(t); P.look = u < 0.3 ? [1, -0.5] : [1, 0]; P.expr = u > 0.66 && u < 0.86 ? 'O' : 'o'; return false; });
  tl.pose(VGRAB, (S, P, auto, t) => {   // prende la freccia per la punta: lei si accorcia nella sua mano
    const g = ['W', M1 + V1 - 0.3, MY], k = prog(t, VGRAB.a, VTAKE, 'out');
    P.h[0] = t < VBORN ? mixT(auto[0], g, k) : mixT(g, ['L', 0.58, 0.14], prog(t, VBORN, VGRAB.b)); P.handNow = 0; P.look = [0.9, 0.1];
    return false;
  });
  tl.pose(VHOLD, carry(0, [0.58, 0.14], { look: [0.9, 0.35] }));
  tl.pose(VTOSS, toss(0, { rel: 0.4, look: [0.1, 0.95] }));
  tl.pose(READ, look(0.1, 0.95));
  tl.pose(tl.part(READ, 0.72, 1), nod(2));
  tl.pose(IDEA, startle());
  tl.pose(READY2, look(1, 0.05));
  tl.pose(WIDE, (S, P, auto, t) => { P.look = [1, -0.2]; return false; });
  tl.pose(VSEE2, (S, P, auto, t) => { const u = VSEE2.u(t); P.look = [1, u < 0.3 ? -0.4 : 0.2]; P.expr = u > 0.52 && u < 0.8 ? 'O' : 'o'; return false; });
  tl.pose(tl.part(RESULT, 0.36, 1), cheer({ n: 3 }));
  tl.pose(END, (S, P, auto, t) => {     // indica la formula, poi guarda chi guarda
    const k = prog(t, END.at(0.12), END.at(0.24), 'out');
    P.h[0] = mixT(auto[0], ['L', 0.46, 0.5], k); P.h[1] = mixT(auto[1], ['P', -0.13, 0.04], k); P.handNow = true;
    P.look = t < END.at(0.5) ? [0.8, 0.8] : [0.15, 0.1]; P.expr = '^'; P.head = -5 * k;
    return false;
  });

  // ----- il disegno -----
  // le frecce dei secondi di una corsa: ferme per terra, oppure mentre si alzano e si raccolgono (u da 0 a 1)
  const arrows = (D, v, n, u, X0, alpha = 1) => {
    for (let k = 0; k < n; k++) {
      const yk = 0.8 + 0.32 * k;
      const x = lerp(v * k, X0, prog(u, 0.3, 0.62)), y = lerp(lerp(AY, yk, prog(u, 0, 0.28, 'out')), MY, prog(u, 0.66, 0.8));
      D.alpha(alpha, () => D.arrow([x, y], [x + v, y], 0.06, C.v, 0.22));
    }
  };
  const bump = (i, t) => boing(t - (READ.at(0.12) + i * 0.26), 0.22, 18, 8) + boing(t - (cN4.dock + 0.16 + i * 0.05), 0.16, 18, 8);

  return {
    ground: { numbers: true },
    init: () => ({ marks: [], w: [0.5, 1.6], sl: null }),
    step(S, t, dt) {
      const v = S.v, ke = (r) => 1 - Math.exp(-dt * r);
      if (t >= RUN1.a && t < CATCH) {           // il cronometro lo segue dall'alto come un palloncino, poi si ferma
        const tx = t < RUN1.b ? S.hero.x - 0.7 : PARK[0], ty = (t < RUN1.b ? 2.8 : PARK[1]) + (t < TSEE.a ? 0.04 * Math.sin(t * 3.1) : 0);
        v.w[0] += (tx - v.w[0]) * ke(t < RUN1.b ? 7 : 4); v.w[1] += (ty - v.w[1]) * ke(9);
      }
      if (t >= REEL0 && t < REEL1) { v.puff = (v.puff || 0) + dt; if (v.puff > 0.05) { v.puff = 0; const u = (t - REEL0) / (REEL1 - REEL0); S.dust(D1 * u * u * u, 0, 2, 2.5); } }
    },
    back(S, D, t) {
      const v = S.v;
      // la striscia della distanza
      if (t >= RUN1.a && t < GRAB) {
        D.seg([0, TY], [clamp(S.hero.x, 0.02, D1), TY], TW, C.d);
        if (DSEE.has(t)) { const u = prog(t, DSEE.at(0.1), DSEE.at(0.48), 'lin'); if (u > 0 && u < 1) D.alpha(0.9, () => D.seg([Math.max(0, D1 * u - 0.5), TY], [D1 * u, TY], TW * 1.5, '#fff')); }
      } else if (t >= GRAB && t < SNAP) {
        const h = S.J.h[0], u = clamp((t - REEL0) / (REEL1 - REEL0)), a = D1 * u * u * u, gx = h[0] - 0.12;
        const low = t > REEL1 ? lerp(TY, h[1], prog(t, REEL1, SNAP, 'lin')) : TY, pts = [];
        if (a < gx) pts.push([a, TY], [gx, TY]);
        for (let i = 0; i <= 8; i++) pts.push(bez([gx, low], [h[0], low], h, i / 8));
        D.path(pts, TW, C.d);
      }
      if (t >= DSEE.at(0.1) && t < cN6.go + 0.2) { const u = prog(t, DSEE.at(0.1), DSEE.at(0.5)), a = fade(t, cN6.go, 0.2); if (u > 0.02) D.alpha(a, () => measure(D, [0, 1.3], [D1 * u, 1.3], C.d, { w: 0.03 })); }
      if (t >= RUN2.a) D.seg([0, TY], [clamp(S.hero.x, 0.02, D2), TY], TW, C.d);
      // i segni dei secondi, con il loro numero
      for (const m of v.marks) {
        const a = m.run === 1 ? fade(t, BACK.a, 0.6) : 1; if (a <= 0) continue;
        D.alpha(a, () => { D.seg([m.x, 0], [m.x, 0.5 * pop(t, m.t0, 0.14)], 0.055, C.t); D.glyph(String(m.k), m.x, 0.82, 0.34 * pop(t, m.t0 + 0.05), C.t, { style: '600' }); });
      }
      // le frecce: quanta strada in ogni secondo
      if (t >= RUN1.a && t < VBORN) {
        if (t < VSEE.a) { for (let k = 0; k < TT; k++) { const x1 = clamp(V1 * (t - RUN1.a), V1 * k, V1 * (k + 1)); if (x1 - V1 * k > 0.12) D.arrow([V1 * k, AY], [x1, AY], 0.06, C.v, Math.min(0.22, (x1 - V1 * k) * 0.6)); } }
        else if (t < VSEE.at(0.8)) arrows(D, V1, TT, VSEE.u(t), M1);
        else { const x0 = lerp(M1, M1 + V1 - 0.62, prog(t, VTAKE + 0.05, VBORN - 0.03)), k = 1 + boing(t - VSEE.at(0.8), 0.25); D.arrow([x0, MY], [M1 + V1 * (t < VTAKE ? k : 1), MY], 0.065 * k, C.v, 0.24); }
      }
      if (t >= RUN2.a) {
        if (t < VSEE2.a) { for (let k = 0; k < TT; k++) { const x1 = clamp(V2 * (t - RUN2.a), V2 * k, V2 * (k + 1)); if (x1 - V2 * k > 0.12) D.arrow([V2 * k, AY], [x1, AY], 0.06, C.v, Math.min(0.22, (x1 - V2 * k) * 0.6)); } }
        else if (t < VSEE2.at(0.5)) arrows(D, V2, TT, VSEE2.u(t) / 0.5 * 0.8, M2);
        else {
          const k = 1 + boing(t - VSEE2.at(0.5), 0.2), y = MY - 0.45 * prog(t, END.a, END.at(0.2)); D.arrow([M2, y], [M2 + V2 * k, y], 0.07 * k, C.v, 0.26);
          // la freccia di prima, due volte: ci sta esattamente
          const ga = fade(t, END.at(0.05), 0.8);
          for (let i = 0; i < 2; i++) { const q = pop(t, VSEE2.at(0.62 + 0.12 * i)); if (q > 0 && ga > 0) D.alpha(0.75 * ga, () => D.arrow([M2 + V1 * i, MY + 0.5], [M2 + V1 * i + V1 * q, MY + 0.5], 0.05, C.v, 0.2)); }
        }
      }
    },
    front(S, D, t) {
      const v = S.v, h = S.J.h[0];
      // il cronometro: in mano, in aria, di nuovo in mano mentre diventa una t
      if (t >= WPOP && t < RUN1.a) watch(D, h[0], h[1] + (WR + 0.02) * pop(t, WPOP), 0, pop(t, WPOP));
      else if (t >= RUN1.a && t < CATCH) { const lit = TSEE.has(t) ? Math.floor((TSEE.u(t) - 0.15) / 0.18) : -1; watch(D, v.w[0], v.w[1], clamp(t - RUN1.a, 0, TT), 1, lit >= 0 && lit < TT && (TSEE.u(t) - 0.15) % 0.18 < 0.12 ? lit : -1); }
      else if (t >= CATCH && t < THOLD.b) { const k = 1 - prog(t, CATCH + 0.04, CATCH + 0.26); watch(D, h[0], h[1] + (WR + 0.02) * k, TT, k); }
      for (const m of v.marks) { const a = 1 - (t - m.t0) / 0.14; if (m.run === 1 && a > 0) D.alpha(a, () => D.seg([v.w[0], v.w[1] - WR], [m.x, 0.5], 0.02, C.t)); }
      // l'idea
      if (IDEA.has(t)) D.glyph('!', S.J.head[0], S.J.head[1] + 0.55, 0.5 * pop(t, IDEA.at(0.25)) * fade(t, IDEA.at(0.8), 0.2), COL.sun, { style: '600' });
      // il taglio che vola a fare le due linee di frazione
      if (t >= SLICE && t < BARS && v.sl) for (const u0 of [U.f1, U.f2]) { const k = EASE.out((t - SLICE) / (BARS - SLICE)), e = D.screen(u0, HV), p = mixP(v.sl, e, k), hl = lerp(0.1, 0.036 * D.unit * 1.78, k); D.seg([p[0] - hl, p[1]], [p[0] + hl, p[1]], 0.013 * D.unit, COL.ink); }
      // la formula sullo schermo
      const dim = t >= IDEA.b && t < READY2.a ? 0.35 : 1;
      if (t >= BARS) { hud.bar(D, U.f1, HV, 0.036, 1 + boing(t - BARS, 0.4) + bump(3, t) * 0.5); D.alpha(dim, () => hud.bar(D, U.f2, HV, 0.036, 1 + boing(t - BARS, 0.4))); }
      if (t >= E2) hud.eq(D, U.e2, HV, pop(t, E2) + bump(4, t));
      if (t >= E1) hud.eq(D, U.e1, HV, pop(t, E1) + bump(1, t));
      if ((t >= E3a && t < READY2.a) || t >= E3b) D.alpha(dim, () => hud.eq(D, U.e3, HV, pop(t, t < READY2.a ? E3a : E3b) + bump(7, t)));
      cD.draw(S, D, t, { bump: bump(2, t) }); cT.draw(S, D, t, { bump: bump(3, t) }); cV.draw(S, D, t, { bump: bump(0, t) });
      cN6.draw(S, D, t, { bump: bump(5, t), alpha: dim }); cN3.draw(S, D, t, { bump: bump(6, t), alpha: dim });
      if (t < READY2.a) cN2.draw(S, D, t, { bump: bump(8, t), alpha: dim });
      cN4.draw(S, D, t, { bump: bump(8, t) });
    },
  };
});
