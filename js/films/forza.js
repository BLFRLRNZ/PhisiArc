// La forza e l'inerzia (Officina, prima lezione).
// Un carrello con una palla nella coppetta. L'omino lo spinge: la freccia rossa è la forza, e punta dove spinge;
// lo tira indietro: la freccia si gira. Poi tre spinte uguali su tre pavimenti. Sul tappeto il carrello si ferma presto
// (le piccole frecce sotto le ruote sono il pavimento che frena), sul ghiaccio va quattro volte più lontano,
// sul binario liscio non si ferma più: nessuno lo spinge e nessuno lo frena, e la sua velocità resta la stessa
// (le frecce dei secondi sono tutte uguali). L'omino gli corre accanto senza toccarlo, poi lo supera, salta il paraurti
// e si gira: il carrello sbatte e si ferma, ma la palla, che il paraurti non tocca, continua e gli vola fra le mani.
// Per lo Studente e il Curioso le cose diventano lettere: F = 0 ⇒ Δv = 0. All'Esploratore niente lettere.
import { COL, KN, KS, RIG, clamp, lerp, prog } from '../toon.js';
import { film, mixT, boing, pop, fade, look, point, push, cheer, startle, nod, hud, formulas } from '../toonkit.js';
import { CART, cart, floor, bumper, ball, force } from './props.js';

const V = 2.5, TP = 0.8, DP = (V * TP) / 2;   // dopo ogni spinta il carrello va a 2,5 m/s; la spinta dura 0,8 s e lo porta avanti di 1 m
const G1 = 2, G2 = 8;                          // la strada che fa da solo: sul tappeto, sul ghiaccio
const L = CART.L, X0 = -1.2, HX = 0.7;        // il carrello e la sua coda all'inizio; l'omino spinge stando HX dietro la coda
const C1 = X0 + DP + G1, C2 = C1 + DP + G2;    // dove si ferma la coda: dopo il tappeto, dopo il ghiaccio
const ICE0 = 2.6, RAIL0 = 11.6;                // dove comincia il ghiaccio, dove comincia il binario
const BY = 0.66, BR = 0.13;                    // la palla nella coppetta
const SLOW = 3;                                // il volo della palla, al rallentatore
const GF = 9.8;
const CF = COL.coral, CV = COL.sky, CD = COL.orange;
const MY = -0.32;                              // sotto il terreno: le misure e le frecce dei secondi
const FY = 1.3;                                // a che altezza volano le frecce delle mani

export default film((tl) => {
  // ----- le battute -----
  tl.start(X0 - HX - 0.9, 1, { x: X0 + 0.4, zm: 1.25 });
  const LOOK = tl.span(2.0);
  const IN = tl.walk(X0 - HX, 1.1);
  const TAP = tl.move(tl.span(1.0), X0 - HX + 0.4, 'io');        // una spinta piccola: la freccia punta avanti
  const HOLD0 = tl.span(0.45);
  const PULL = tl.move(tl.span(1.2), X0 - HX, 'io');             // lo tira indietro: la freccia si gira
  tl.face(PULL.a, 1);
  const SET = tl.span(0.95);
  const P1 = tl.move(tl.span(TP), X0 + DP - HX, 'in');           // prima spinta, sul tappeto
  const STOP1 = tl.flag('brake', tl.move(tl.span(0.5), X0 + DP - HX + 0.6, 'out'));
  const GL1 = tl.between(P1.b, P1.b + (2 * G1) / V);
  const WATCH1 = tl.span(GL1.b - tl.now + 0.2);
  const KNEEL = tl.span(2.1);                                    // si china e tocca il tappeto: è lui che frena
  const POINT1 = tl.span(1.9);                                   // indica la strada fatta sul tappeto: 2
  const IN2 = tl.walk(C1 - HX, 1.3);
  const SET2 = tl.span(0.45);
  const P2 = tl.move(tl.span(TP), C1 + DP - HX, 'in');           // seconda spinta, uguale, verso il ghiaccio
  const STOP2 = tl.flag('brake', tl.move(tl.span(0.5), C1 + DP - HX + 0.6, 'out'));
  const GL2 = tl.between(P2.b, P2.b + (2 * G2) / V);
  const WAIT2 = tl.span(0.6);
  const FOLLOW = tl.move(tl.span(GL2.b - tl.now + 0.2), C2 - HX - 0.5, 'in');   // gli va dietro…
  const SLIP = tl.flag('brake', tl.move(tl.span(0.55), C2 - HX, 'out'));       // …e scivola sul ghiaccio
  const COMPARE = tl.span(3.8);                                  // da lontano: 2 sul tappeto, 8 sul ghiaccio
  const SET3 = tl.span(0.4);
  const P3 = tl.move(tl.span(TP), C2 + DP - HX, 'in');           // terza spinta, sul binario liscio
  const RUN = 5.0, SPOTD = 0.5, JUMPD = 0.62, READYD = 0.6, LAND = 0.95, OVER = 1.8, SPEED = 4.6;
  // la corsa finale: l'omino passa davanti al carrello, salta il paraurti e si gira. Il paraurti sta dove il muso arriva in quel momento.
  const sprint = (L / 2 - LAND + V * (JUMPD + READYD)) / (SPEED - V);
  const BX = C2 + DP + L + V * (RUN + SPOTD + sprint + JUMPD + READYD);
  const JOG = tl.move(tl.span(RUN), C2 + DP + V * RUN + L / 2, 'lin');   // gli corre accanto, senza toccarlo
  const SPOT = tl.move(tl.span(SPOTD), tl.x + V * SPOTD, 'lin');          // il paraurti!
  const SPRINT = tl.move(tl.span(sprint), BX - LAND, 'lin');
  const JUMP = tl.jump(tl.span(JUMPD), BX + OVER, { h: 0.85 });
  const READY = tl.span(READYD);
  tl.face(READY.a + 0.12, -1);
  const HIT = READY.b;
  const BT = (BX + 1.2 - (BX - 0.26)) / V;                       // quanto vola la palla (tempo vero, prima del rallentatore)
  const FLY = tl.span(BT * SLOW);
  const CATCH = FLY.b;
  const HOLDB = tl.span(1.6);
  const STACK = tl.span(4.0);                                    // le frecce dei secondi salgono e si mettono in fila: tutte uguali
  const END = tl.span(6.0);

  tl.cam(IN.b, { x: X0 + 0.5, zm: 1.1, k: 2 });
  tl.cam(P1.a, { x: 0.4, zm: 1.0, k: 2 });
  tl.cam(P1.b, { x: 0.9, zm: 1.55, k: 3, kz: 2.6 });            // da vicino: le frecce del tappeto che frena
  tl.cam(KNEEL.a + 0.4, { x: 0.6, zm: 1.15, k: 2, kz: 2 });
  tl.cam(COMPARE.a, { x: 5.4, zm: 0.6, k: 2.2, kz: 1.8 });
  tl.cam(SET3.a, { x: C2 + 1.6, zm: 0.95, k: 2.4, kz: 2 });
  tl.cam(HIT, { x: BX + 0.5, zm: 1.2, k: 3, kz: 3 });
  tl.cam(STACK.a, { x: BX - 3.4, zm: 0.82, k: 1.6, kz: 1.4 });
  tl.cam(END.a, { x: BX - 2.6, zm: 0.86, k: 1.4, kz: 1.4 });

  // ----- il carrello: dove sta la sua coda, istante per istante -----
  const XK = [[0, X0], [TAP.a, X0], [TAP.b, X0 + 0.4, 'io'], [PULL.a, X0 + 0.4], [PULL.b, X0, 'io'], [P1.a, X0], [P1.b, X0 + DP, 'in'], [GL1.b, C1, 'out'],
    [P2.a, C1], [P2.b, C1 + DP, 'in'], [GL2.b, C2, 'out'], [P3.a, C2], [P3.b, C2 + DP, 'in'], [HIT, BX - L, 'lin'], [HIT + 0.07, BX - L - 0.05, 'out'], [HIT + 0.35, BX - L, 'io']];
  const cx = (t) => KN(t, XK);
  const vel = (t) => (cx(t + 0.01) - cx(t - 0.01)) / 0.02;
  const acc = (t) => (cx(t + 0.03) - 2 * cx(t) + cx(t - 0.03)) / 0.0009;
  // la palla: nella coppetta (un po' indietro quando il carrello accelera, un po' avanti quando frena), poi in volo, poi in mano
  const BX0 = BX - 0.26, BXC = BX + 1.2, BVY = (0.98 - BY + 0.5 * GF * BT * BT) / BT;
  const ballAt = (S, t) => {
    if (t < HIT) return [cx(t) + L - 0.26 - clamp(0.012 * acc(t), -0.045, 0.045), BY];
    if (t < CATCH) { const u = (t - HIT) / SLOW; return [BX0 + V * u, BY + BVY * u - 0.5 * GF * u * u]; }
    const h = S.J.h[0], k = S.J.h[1]; return [(h[0] + k[0]) / 2, (h[1] + k[1]) / 2 + 0.06];
  };
  const handle = (t) => [cx(t) + CART.HX, CART.HY];          // la maniglia: lì si spinge e si tira
  const back = handle;

  // ----- le spinte: quando la freccia c'è e quanto è lunga -----
  const pushK = (t) => Math.max(...[P1, P2, P3].map((s) => Math.min(pop(t, s.a, 0.18), fade(t, s.b, 0.2))));
  const tapK = (t) => Math.min(pop(t, TAP.a + 0.05, 0.2), fade(t, TAP.at(0.5), 0.25));
  const pullK = (t) => Math.min(pop(t, PULL.a + 0.05, 0.2), fade(t, PULL.at(0.5), 0.25));
  // il pavimento che frena: le piccole frecce sotto le ruote, finché il carrello rallenta da solo
  const brakeK = (t) => (t >= GL1.a + 0.05 && t < GL1.b ? 1 - prog(t, GL1.b - 0.15, GL1.b, 'lin') : t >= GL2.a + 0.05 && t < GL2.b ? 1 - prog(t, GL2.b - 0.3, GL2.b, 'lin') : 0);
  const brakeL = (t) => (t < GL2.a ? 0.5 : 0.13);
  const secs = [];
  for (let k = 1; P3.b + k < HIT; k++) secs.push({ k, t: P3.b + k, x: C2 + DP + V * k + L / 2 });

  // ----- le lettere (solo Studente e Curioso) -----
  const U = { F: 0.29, e1: 0.345, z1: 0.395, imp: 0.475, dv: 0.565, e2: 0.635, z2: 0.685 }, HV = 0.14, FS = 0.13;
  const cF = tl.chip({ str: 'F', col: CF, size: 0.6, born: P1.at(0.3), at: (S, t) => [cx(t) + L / 2 + 0.1, FY + 0.45], go: P1.b + 0.1, fly: 0.6, h: 0.5, spin: true, slot: { u: U.F, v: HV, frac: FS } });
  const ZERO = JOG.at(0.42);
  const c0 = tl.chip({ str: '0', col: CF, up: true, size: 0.55, born: ZERO, at: (S, t) => [cx(t) + L / 2, 1.05], go: ZERO + 0.9, fly: 0.6, h: 0.4, slot: { u: U.z1, v: HV, frac: FS } });
  const VB = STACK.at(0.82);
  const cV = tl.chip({ str: 'Δv', col: CV, size: 0.55, born: VB, at: () => [BX - 3.4, 2.75], go: END.a + 0.2, fly: 0.6, h: 0.5, spin: true, slot: { u: U.dv, v: HV, frac: FS } });
  const E1 = c0.dock - 0.25, IMP = END.at(0.03), E2 = cV.dock + 0.1, Z2 = cV.dock + 0.3;

  // ----- quello che succede (suoni ed effetti) -----
  const thud = (S, v = 0.12) => { S.snd.tone(160, 60, 0.16, v); S.snd.noise(0.08, 0.06, 900, 200); };
  const whoosh = (S) => S.snd.noise(0.22, 0.05, 500, 2200);
  const roll = (S, d, v = 0.05) => S.snd.tone(70, 55, d, v, 'sawtooth');
  const ping = (S, f = 520) => S.snd.tone(f, f * 1.5, 0.12, 0.08, 'triangle');
  tl.on(LOOK.at(0.25), (S) => S.snd.tone(440, 660, 0.14, 0.06, 'triangle'));
  tl.on(TAP.a + 0.08, (S) => { thud(S, 0.09); roll(S, 0.8, 0.03); S.burst([X0 + L / 2 + 0.7, 0.36], 5, 3, 0.3, CF); });
  tl.on(PULL.a + 0.1, (S) => { S.snd.tick(900, 0.06); S.snd.noise(0.5, 0.03, 300, 900); S.burst([X0 + 0.3 - 0.5, 0.36], 5, 3, 0.3, CF); });
  for (const [P, GL, ice] of [[P1, GL1, false], [P2, GL2, true]]) {
    tl.on(P.a, (S) => { thud(S); whoosh(S); S.snd.tone(110, 220, P.d, 0.05, 'triangle'); });
    tl.on(P.b, (S) => { roll(S, GL.d, ice ? 0.04 : 0.06); if (ice) { S.snd.noise(GL.d, 0.03, 3000, 7000); } else S.snd.noise(GL.d * 0.9, 0.04, 300, 120); });
    tl.on(GL.b, (S) => { S.snd.tick(ice ? 1500 : 500, 0.06); S.burst([cx(GL.b) + L / 2, 0.25], 6, 3, 0.35, ice ? CV : CF, { kind: 'puff' }); });
  }
  for (let i = 0; i < 6; i++) tl.on(GL2.a + 0.6 + i * 0.9, (S, t) => { S.snd.tick(2600 + 200 * (i % 3), 0.035); S.burst([cx(t) + 0.3, 0.06], 3, 1.5, 0.3, '#ffffff', { up: 1 }); });
  for (let i = 0; i < 5; i++) tl.on(KNEEL.at(0.34) + i * 0.16, (S) => { S.snd.noise(0.12, 0.05, 400 + 120 * i, 180); S.burst([TOUCH[0], 0.08], 3, 1.5, 0.25, CF, { up: 1 }); });
  tl.on(GL1.b + 0.15, (S) => { ping(S, 523); S.burst([X0 + DP + L / 2 + G1 / 2, MY - 0.3], 6, 3, 0.35, CD, { kind: 'plus' }); });
  tl.on(SLIP.a, (S) => { S.snd.noise(0.5, 0.06, 3000, 7000); S.snd.tone(600, 300, 0.4, 0.04, 'triangle'); });
  tl.on(COMPARE.at(0.3), (S) => { ping(S, 784); S.burst([C1 + DP + L / 2 + G2 / 2, MY - 0.3], 8, 4, 0.4, CD, { kind: 'plus' }); S.kick({ shake: 0.03 }); });
  tl.on(P3.a, (S) => { thud(S); whoosh(S); S.snd.tone(110, 220, P3.d, 0.05, 'triangle'); });
  tl.on(P3.b, (S) => S.snd.tone(196, 196, HIT - P3.b, 0.03, 'sine'));
  for (const m of secs) tl.on(m.t, (S) => { S.snd.tick(1320, 0.06); S.burst([m.x, 0.1], 5, 3, 0.35, CV, { up: 1 }); });
  tl.on(ZERO, (S) => { if (formulas()) ping(S, 659); });
  tl.on(SPOT.a, (S) => S.snd.tone(660, 1320, 0.18, 0.08, 'triangle'));
  tl.on(SPRINT.a, (S) => { whoosh(S); S.dust(S.hero.x, 0, 6, 4); });
  tl.on(HIT, (S) => {
    S.kick({ shake: 0.16, punch: 0.045, flash: 0.28, chroma: 8, stop: 0.09 }); S.snd.boom(0.2); thud(S, 0.2);
    S.burst([BX, 0.35], 12, 6, 0.5, CF); S.wave([BX, 0.35], 2.2, 0.4, CF, 0.08); S.ripple(BX, 0, 0.06);
  });
  tl.on(HIT + 0.05, (S) => S.snd.tone(300, 900, FLY.d, 0.05, 'triangle'));
  tl.on(CATCH, (S) => { S.snd.tone(520, 1040, 0.16, 0.1, 'triangle'); S.snd.chime([784, 1047], 0.08, 0.08); S.burst(ballAt(S, CATCH + 0.01), 9, 5, 0.4, CD, { kind: 'plus' }); S.kick({ shake: 0.04 }); });
  tl.on(HOLDB.at(0.3), (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));
  tl.on(STACK.at(0.05), (S) => S.snd.tone(300, 600, 0.3, 0.06, 'triangle'));
  tl.on(STACK.at(0.35), (S) => S.snd.noise(0.4, 0.05, 600, 1800));
  for (let i = 0; i < 4; i++) tl.on(STACK.at(0.55 + 0.06 * i), (S) => S.snd.tick(900 + 120 * i, 0.06));
  tl.on(STACK.at(0.75), (S) => { S.snd.tone(440, 660, 0.12, 0.08, 'triangle'); S.wave([BX - 3.4, 2.25], 2.4, 0.4, CV, 0.08); });
  tl.on(cF.go, whoosh); tl.on(cF.dock, (S) => { if (formulas()) ping(S, 880); });
  tl.on(c0.dock, (S) => { if (formulas()) ping(S, 660); });
  tl.on(cV.dock, (S) => { if (formulas()) { S.snd.tone(988, 1480, 0.12, 0.06, 'triangle'); S.kick({ shake: 0.04 }); } });
  tl.on(Z2 + 0.1, (S) => { if (formulas()) { S.kick({ shake: 0.1, punch: 0.03, flash: 0.18, chroma: 5, stop: 0.04 }); S.snd.boom(0.12); S.snd.chime([523, 659, 784, 1047], 0.09, 0.09); } });

  // ----- i gesti -----
  tl.pose(LOOK, (S, P, auto, t) => { P.look = t < LOOK.at(0.55) ? [1, -0.45] : [1, -0.1]; P.expr = t > LOOK.at(0.55) ? '^' : 'o'; return false; });
  tl.pose(TAP, push((S, t) => back(t), { in: 0.25, out: 0.3, lean: 12, look: [1, -0.2] }));
  tl.pose(HOLD0, look(1, -0.3));
  tl.pose(PULL, push((S, t) => handle(t), { in: 0.2, out: 0.2, lean: 7, look: [1, -0.3] }));
  tl.pose(SET, look(1, -0.2));
  for (const [P, ST] of [[P1, STOP1], [P2, STOP2]]) {
    tl.pose(tl.between(P.a - 0.25, P.b + 0.02), push((S, t) => back(t), { in: 0.2, out: 0.03, lean: 16, look: [1, -0.15], expr: '>' }));
    tl.pose(ST, (S, P_, auto, t) => { P_.look = [1, -0.2]; P_.lean = -6 * Math.sin(Math.PI * ST.u(t)); P_.leanNow = true; return false; });
  }
  tl.pose(WATCH1, (S, P, auto, t) => { P.look = [1, -0.3]; P.expr = t > GL1.b ? 'O' : 'o'; return false; });
  const TOUCH = [X0 + DP - HX + 0.6 + 0.55, 0.06];          // davanti ai suoi piedi, dove si è fermato
  tl.pose(KNEEL, (S, P, auto, t) => {      // si china, sfrega la mano sul tappeto, si rialza
    const k = Math.min(prog(t, KNEEL.a, KNEEL.at(0.3), 'out'), 1 - prog(t, KNEEL.at(0.82), KNEEL.b));
    const rub = 0.08 * Math.sin((t - KNEEL.a) * 18) * prog(t, KNEEL.at(0.3), KNEEL.at(0.4));
    P.py = lerp(RIG.STAND, 0.4, k); P.lean = 48 * k; P.head = -0.4 * P.lean;
    P.h[0] = mixT(auto[0], ['W', TOUCH[0] + rub, TOUCH[1] + 0.03], k); P.handNow = 0;
    P.look = [0.6, -0.85]; P.expr = t > KNEEL.at(0.4) && t < KNEEL.at(0.8) ? '>' : 'o';
    return true;
  });
  tl.pose(POINT1, point(0, [X0 + DP + L / 2 + G1 / 2, MY], { in: 0.2, out: 0.25 }));
  tl.pose(WAIT2, (S, P) => { P.look = [1, -0.1]; P.expr = 'O'; return false; });
  tl.pose(SLIP, (S, P, auto, t) => {      // sul ghiaccio le scarpe scivolano: braccia larghe
    const k = Math.sin(Math.PI * SLIP.u(t));
    P.h[0] = mixT(auto[0], ['L', 0.42, 0.42], k); P.h[1] = mixT(auto[1], ['L', -0.4, 0.38], k); P.handNow = true; P.expr = 'O';
    return false;
  });
  tl.pose(tl.part(COMPARE, 0, 0.9), (S, P, auto, t) => { P.look = [t < COMPARE.at(0.4) ? -1 : 1, -0.4]; P.expr = 'O'; return false; });
  tl.pose(tl.between(P3.a - 0.25, P3.b + 0.02), push((S, t) => back(t), { in: 0.2, out: 0.03, lean: 16, look: [1, -0.15], expr: '>' }));
  // gli corre accanto con le mani in alto: «guarda, non lo tocco!»
  tl.pose(JOG, (S, P, auto, t) => {
    const k = Math.min(prog(t, JOG.at(0.18), JOG.at(0.32), 'out'), 1 - prog(t, JOG.at(0.9), JOG.b));
    P.h[0] = mixT(auto[0], ['L', 0.22, 0.72], k); P.h[1] = mixT(auto[1], ['L', -0.16, 0.7], k); P.handNow = true;
    P.look = t < JOG.at(0.55) ? [0.2, -0.9] : [0.9, 0.1]; P.expr = '^';
    return false;
  });
  tl.pose(SPOT, startle());
  tl.pose(SPRINT, look(1, -0.1, '>'));
  tl.pose(READY, (S, P, auto, t) => {      // si gira e tende le mani: aspetta la palla
    const k = prog(t, READY.a + 0.1, READY.b, 'out');
    P.h[0] = mixT(auto[0], ['W', BXC + 0.02, 1.02], k); P.h[1] = mixT(auto[1], ['W', BXC + 0.06, 0.9], k); P.handNow = true;
    P.lean = 8 * k; P.leanNow = true; P.look = [1, -0.35]; P.expr = 'O';
    return false;
  });
  tl.pose(FLY, (S, P, auto, t) => {
    const b = ballAt(S, t);
    P.h[0] = ['W', BXC + 0.02, 1.02]; P.h[1] = ['W', BXC + 0.06, 0.9]; P.handNow = true; P.lean = 8; P.leanNow = true;
    P.look = [1, clamp((b[1] - 1.5) / 1.2, -0.9, 0.9)]; P.expr = 'O';
    return false;
  });
  tl.pose(HOLDB, (S, P, auto, t) => {      // la palla presa: la alza
    const k = prog(t, HOLDB.a, HOLDB.at(0.5), 'out');
    P.h[0] = mixT(['W', BXC + 0.02, 1.02], ['L', 0.3, 0.62], k); P.h[1] = mixT(['W', BXC + 0.06, 0.9], ['L', 0.24, 0.5], k); P.handNow = true;
    P.hop = 0.12 * Math.abs(Math.sin(Math.PI * 2 * HOLDB.u(t))); P.expr = '^'; P.look = [0.6, 0.4];
    return false;
  });
  const holdBall = (S, P) => { P.h[0] = ['L', 0.36, 0.2]; P.h[1] = ['L', 0.32, 0.06]; P.handNow = true; };
  tl.pose(STACK, (S, P, auto, t) => { holdBall(S, P); P.look = [1, STACK.u(t) < 0.3 ? -0.3 : 0.45]; P.expr = STACK.u(t) > 0.7 ? '^' : 'o'; return false; });
  tl.pose(END, (S, P, auto, t) => { holdBall(S, P); P.look = t < END.at(0.45) ? [1, 0.75] : [0.2, 0.1]; P.expr = '^'; return false; });
  tl.pose(tl.part(END, 0.55, 0.9), nod(2));

  // ----- il disegno -----
  const fv = () => formulas();
  return {
    ground: { numbers: false },
    init: () => ({}),
    step(S, t) {
      // la telecamera segue il carrello quando va da solo
      if (t >= GL1.a && t < KNEEL.a + 0.4) S.cam.x = cx(t) + L / 2 + 0.2;
      if (t >= GL2.a && t < COMPARE.a) S.cam.x = cx(t) + L / 2 + 0.8;
      if (t >= P3.b && t < READY.a) S.cam.x = cx(t) + L / 2 + 1.4 + 1.8 * prog(t, SPOT.a, SPRINT.b);
      if (t >= READY.a && t < HIT) S.cam.x = BX + 0.2;
      S.hero.bag = true;
    },
    back(S, D, t) {
      // i pavimenti: tappeto, ghiaccio, binario
      floor(D, 'tappeto', X0 - 12, ICE0);
      floor(D, 'ghiaccio', ICE0, RAIL0);
      floor(D, 'binario', RAIL0, BX + 14);
      // le misure: la strada che il carrello fa da solo, sul tappeto e sul ghiaccio (cresce mentre va)
      for (const [s0, g, GL, n] of [[X0 + DP, G1, GL1, '2'], [C1 + DP, G2, GL2, '8']]) {
        if (t < GL.a) continue;
        const a0 = s0 + L / 2, a1 = Math.min(cx(t), s0 + g) + L / 2, al = 1 - prog(t, P3.b + 1.5, P3.b + 2.5);
        if (al <= 0) continue;
        D.alpha(al, () => {
          D.seg([a0, MY], [a1, MY], 0.07, CD);
          D.seg([a0, MY - 0.1], [a0, MY + 0.1], 0.04, CD);
          if (t >= GL.b) D.seg([a1, MY - 0.1], [a1, MY + 0.1], 0.04, CD);
          const born = n === '2' ? GL1.b + 0.15 : COMPARE.at(0.3);
          if (t >= born) D.glyph(n, (a0 + a1) / 2, MY - 0.42, (n === '2' ? 0.42 : 0.62) * pop(t, born), CD, { style: '600' });
        });
      }
      // i segni dei secondi sul binario, e sotto il terreno una freccia per ogni secondo: tutte lunghe uguali
      const stackU = STACK.has(t) ? STACK.u(t) : t >= STACK.b ? 1 : 0;
      secs.forEach((m, i) => {
        if (t < m.t) return;
        const al = 1 - prog(t, END.b - 0.6, END.b);
        D.alpha(al * (1 - prog(t, STACK.a, STACK.at(0.2))), () => { D.seg([m.x, 0], [m.x, 0.32 * pop(t, m.t, 0.14)], 0.05, CV); D.glyph(String(m.k), m.x, 0.6, 0.3 * pop(t, m.t + 0.05), CV, { style: '600' }); });
        const x0 = m.x - V, sx0 = BX - 3.4 - V / 2, sy0 = 1.75 + 0.32 * i;
        const ux = prog(stackU, 0.25, 0.6), uy = prog(stackU, 0, 0.3, 'out'), uz = prog(stackU, 0.68, 0.8);
        const xA = lerp(x0, sx0, ux), y = lerp(lerp(MY, sy0, uy), 2.25, fv() ? uz : 0);   // per chi vuole le lettere diventano una freccia sola: Δv = 0
        const grow = clamp((t - (m.t - 1)) / 1);
        D.alpha(al, () => D.arrow([xA, y], [xA + V * grow, y], 0.06, CV, 0.22));
      });
      // il binario mentre il carrello corre: la sua strada, live (fino al paraurti)
      bumper(D, BX, { bump: t >= HIT ? boing(t - HIT, 0.5, 30, 10) : 0 });
    },
    front(S, D, t) {
      const x = cx(t), mid = [x + L / 2, CART.Y0 + CART.H / 2];
      cart(D, x, CV, { cup: true });
      // il volo della palla lascia una scia di puntini: è andata avanti dritta, come andava
      if (t >= HIT && t < STACK.at(0.3)) {
        const a = 1 - prog(t, STACK.a, STACK.at(0.3)), tt = Math.min(t, CATCH), n = Math.floor((tt - HIT) / 0.09);
        D.alpha(0.7 * a, () => { for (let i = 1; i <= n; i++) { const p = ballAt(S, HIT + i * 0.09); D.circle(p[0], p[1], 0.025, null, { fill: CD }); } });
      }
      { const b = ballAt(S, t); ball(D, b[0], b[1], BR, CD, -b[0] / BR); }
      if (LOOK.has(t)) D.glyph('?', S.J.head[0] + 0.15, S.J.head[1] + 0.5, 0.45 * pop(t, LOOK.at(0.25)) * fade(t, LOOK.at(0.85), 0.2), COL.sun, { style: '600' });
      // le forze: la spinta (in avanti), il tiro (indietro), il pavimento che frena, il paraurti
      const kp = pushK(t), kl = pullK(t), kb = brakeK(t);
      // le forze delle mani volano sopra il carrello, dove non coprono niente: avanti quando spinge, indietro quando tira
      if (kp > 0) force(D, [mid[0] - 0.55, FY], [mid[0] + 0.75, FY], kp, CF, 0.09);
      const kt = tapK(t); if (kt > 0) force(D, [mid[0] - 0.3, FY], [mid[0] + 0.3, FY], kt, CF, 0.07);
      if (kl > 0) force(D, [mid[0] + 0.5, FY], [mid[0] - 0.6, FY], kl, CF, 0.09);
      if (kb > 0) for (const wx of [x + 0.24, x + L - 0.24]) force(D, [wx, 0.08], [wx - brakeL(t), 0.08], kb, CF, 0.05);
      // la mano sul tappeto: il pelo frena anche lei (due frecce piccole, all'indietro)
      if (KNEEL.has(t)) { const k = Math.min(pop(t, KNEEL.at(0.36), 0.2), fade(t, KNEEL.at(0.78), 0.2)); for (const dx of [0.25, 0.65]) force(D, [TOUCH[0] + dx, 0.12], [TOUCH[0] + dx - 0.35, 0.12], k, CF, 0.045); }
      if (t >= HIT && t < HIT + 1.2) { const k = Math.min(pop(t, HIT, 0.1), fade(t, HIT + 0.55, 0.5)); force(D, [BX - 0.02, mid[1]], [BX - 1.45, mid[1]], k, CF, 0.1); }
      // sul binario: nessuna freccia. Per chi vuole le lettere, uno zero dove dovrebbe esserci la forza
      if (fv()) {
        cF.draw(S, D, t); c0.draw(S, D, t); cV.draw(S, D, t);
        if (t >= E1) hud.eq(D, U.e1, HV, pop(t, E1));
        if (t >= IMP) { const k = pop(t, IMP); const a = D.screen(U.imp - 0.03 * k, HV), b = D.screen(U.imp + 0.035 * k, HV); D.arrow(a, b, 0.012 * D.unit, COL.ink, 0.03 * D.unit); }
        if (t >= E2) hud.eq(D, U.e2, HV, pop(t, E2));
        if (t >= Z2) hud.glyph(D, U.z2, HV, FS, '0', CV, { style: '600', k: 1 + boing(t - Z2, 0.3) });
      }
    },
  };
});
