// Pi greco: π
// Una ruota e un bastone lungo quanto il suo diametro. L'omino vernicia il bordo della ruota e la fa rotolare per un giro:
// la vernice resta per terra, ed è il bordo srotolato. Poi misura la riga con il bastone, ribaltandolo: ce ne stanno 3,
// e avanza un pezzetto. Tre virgola quattordici: è π. Una ruota piccola fa lo stesso, con il suo diametro: sempre 3 e un pezzetto.
// Il giro è π volte il diametro: C = π · d.
import { COL, KN, KS, RIG, lerp, prog } from '../toon.js';
import { film, add, mixT, boing, pop, fade, look, point, push, cheer, hud, comma } from '../toonkit.js';

const R = 0.75, DD = 2 * R, TURN = 2 * Math.PI * R;       // la ruota: raggio, diametro, quanta strada fa in un giro
const SY = 0.14;                                          // a che altezza sta il bastone posato per terra
const CC = COL.sky, CD = COL.orange, CP = COL.sun;
const r2 = 0.3, X2 = 5.2, TURN2 = 2 * Math.PI * r2;       // la ruota piccola

export default film((tl) => {
  const R1 = 0.17, R2 = 0.385, FS = 0.2, F2 = 0.17, UP = 0.085, UE = 0.152, U3 = 0.215, UX = 0.375;

  tl.start(-2.3, 1, { x: 2.2, zm: 1 });
  const ENTER = tl.walk(-1.15, 1.4);
  const BAG = tl.span(1.1);                               // il bastone esce dalla tracolla
  const MEASD = tl.span(3.2);                             // lo appoggia sulla ruota, da parte a parte: è il diametro
  const BAGIN = tl.span(0.9);
  const PAINT = tl.span(2.4);                             // tocca il bordo: la vernice gira tutto intorno
  const ROLL = tl.move(tl.span(6.2), TURN - 1.2, 'io', 0.12, 0.92);   // un giro intero
  const STOP = tl.span(1.5);
  const WALKB = tl.walk(-0.45, 1.9);
  tl.face(WALKB.b, 1);
  const BAG2 = tl.span(1.0);
  const PLACE = tl.span(1.5);                             // il bastone sulla riga: uno
  const LIFT1 = tl.move(tl.span(1.2), 0.5, 'io', 0.25, 0.92), FALL1 = tl.span(0.45), REST1 = tl.span(0.5);    // lo ribalta: due
  const W2 = tl.walk(DD - 0.45, 1.5);
  const LIFT2 = tl.move(tl.span(1.2), DD + 0.5, 'io', 0.25, 0.92), FALL2 = tl.span(0.45), REST2 = tl.span(0.7);   // tre
  const WBIT = tl.walk(3.95, 1.5);
  const BIT = tl.span(3.6);                               // e avanza un pezzetto
  const PI = tl.span(3.4);                                // tre virgola quattordici: π
  const ANY = tl.span(6.6);                               // una ruota piccola: anche lei 3 e un pezzetto
  const FORM = tl.span(5.2);                              // C = π · d
  tl.face(tl.now, -1);
  const CHEER = tl.span(2.2);
  const END = tl.span(5.0);
  tl.cam(ROLL.a, { x: 2.5, zm: 1, k: 1.2 });
  tl.cam(WBIT.a, { x: 4.2, zm: 1.45, k: 1.5, kz: 1.3 });
  tl.cam(PI.a, { x: 2.6, zm: 1, k: 1.6, kz: 1.4 });
  tl.cam(ANY.a, { x: 3.3, zm: 0.87, k: 1.4, kz: 1.2 });

  const SPOP = BAG.at(0.5), FIT = MEASD.at(0.42), DLAB = MEASD.at(0.52), SOUT = MEASD.at(0.8);
  const TOUCH = PAINT.at(0.3), WET = TOUCH + 0.9;
  const theta = (t) => 2 * Math.PI * prog(t, ROLL.at(0.12), ROLL.at(0.92), 'io');
  // finito il giro, una spinta e la ruota se ne va: la riga resta libera per misurarla
  const AWAY = STOP.at(0.5), away = (t) => 9 * prog(t, AWAY, AWAY + 1.7, 'in');
  const SPOP2 = BAG2.at(0.5), DROP = PLACE.at(0.5);
  // il bastone ribaltato: l'angolo della punta libera intorno al perno, da π (per terra a sinistra) a 0 (per terra a destra)
  const flip = (t, L, F) => (t < L.at(0.25) ? Math.PI : t < L.at(0.92) ? lerp(Math.PI, 0.62 * Math.PI, prog(t, L.at(0.25), L.at(0.92), 'io')) : lerp(0.62 * Math.PI, 0, prog(t, F.a, F.b, 'in')));
  const stickAt = (t) => {      // dove sta il bastone posato: [punta sinistra o libera, perno]
    if (t < FALL1.b) { const a = flip(t, LIFT1, FALL1), p = [DD, SY]; return t < LIFT1.at(0.25) ? [[0, SY], p] : [add(p, [DD * Math.cos(a), DD * Math.sin(a)]), p]; }
    if (t < LIFT2.at(0.25)) return [[DD, SY], [2 * DD, SY]];
    if (t < FALL2.b) { const a = flip(t, LIFT2, FALL2), p = [2 * DD, SY]; return [add(p, [DD * Math.cos(a), DD * Math.sin(a)]), p]; }
    return [[2 * DD, SY], [3 * DD, SY]];
  };
  const C1 = DROP, C2 = FALL1.b, C3 = FALL2.b;            // quando si conta uno, due, tre
  const BLINK = BIT.at(0.1), DEC = BIT.at(0.55), PIP = PI.at(0.3);
  const DROP2 = ANY.at(0.06), ROLL2 = [ANY.at(0.2), ANY.at(0.62)], M2 = [0, 1, 2].map((i) => ANY.at(0.68 + 0.06 * i)), BIT2 = ANY.at(0.88);
  const th2 = (t) => 2 * Math.PI * prog(t, ROLL2[0], ROLL2[1], 'io');
  const F = [0, 1, 2, 3, 4].map((i) => FORM.at(0.1 + 0.13 * i));

  // ----- quello che succede -----
  const out = (S) => { S.snd.tone(700, 320, 0.1, 0.09, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); };
  const clack = (S) => { S.snd.tone(150, 70, 0.14, 0.12); S.snd.noise(0.08, 0.07, 800, 200); };
  tl.on(SPOP, out); tl.on(SPOP2, out);
  tl.on(FIT, (S) => { S.snd.tick(1000, 0.07); S.snd.tick(1300, 0.06); S.burst([-R, R], 5, 3, 0.3, CD); S.burst([R, R], 5, 3, 0.3, CD); });
  tl.on(DLAB, (S) => S.snd.tone(520, 780, 0.12, 0.08, 'triangle'));
  tl.on(BAGIN.at(0.5), (S) => S.snd.tone(520, 260, 0.14, 0.06, 'sine'));
  tl.on(TOUCH, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.snd.noise(0.9, 0.05, 700, 2600); });
  tl.on(WET, (S) => { S.snd.tick(1200, 0.06); S.burst([0, 0.05], 6, 4, 0.35, CC, { up: 1 }); });
  tl.on(ROLL.at(0.12), (S) => S.snd.tone(90, 130, 4.6, 0.05, 'sawtooth'));
  for (let i = 1; i <= 7; i++) tl.on(ROLL.at(0.12 + 0.1 * i), (S) => S.snd.noise(0.1, 0.03, 300, 700));
  tl.on(ROLL.at(0.92), (S) => { clack(S); S.snd.chime([784, 1047], 0.08, 0.08); S.burst([TURN, 0.05], 7, 4, 0.35, CC, { up: 1 }); S.kick({ shake: 0.03 }); });
  [[C1, 523], [C2, 659], [C3, 784]].forEach(([c, f]) => tl.on(c, (S) => { clack(S); S.snd.tone(f, f, 0.3, 0.1, 'triangle'); S.dust(c === C1 ? DD / 2 : c === C2 ? 1.5 * DD : 2.5 * DD, 0, 5, 3); S.kick({ shake: 0.03 }); }));
  for (const L of [LIFT1, LIFT2]) tl.on(L.at(0.25), (S) => S.snd.tone(200, 520, 0.8, 0.05, 'triangle'));
  tl.on(AWAY, (S) => { S.snd.noise(0.2, 0.06, 500, 2200); S.snd.tone(130, 60, 1.6, 0.05, 'sawtooth'); });
  tl.on(BLINK, (S) => S.snd.tone(440, 330, 0.25, 0.07, 'triangle'));
  tl.on(DEC, (S) => { S.snd.chime([988, 1175], 0.08, 0.07); });
  tl.on(PIP, (S) => { S.kick({ shake: 0.1, punch: 0.03, flash: 0.18, chroma: 6, stop: 0.05 }); S.snd.boom(0.15); S.snd.tone(180, 760, 0.5, 0.1, 'triangle'); });
  tl.on(DROP2, (S) => S.snd.noise(0.2, 0.05, 2200, 500));
  tl.on(DROP2 + 0.35, (S) => { clack(S); S.dust(X2, 0, 4, 3); });
  tl.on(ROLL2[0], (S) => S.snd.tone(140, 200, 2.4, 0.04, 'sawtooth'));
  M2.forEach((c, i) => tl.on(c, (S) => S.snd.tone(523 + 130 * i, 523 + 130 * i, 0.2, 0.08, 'triangle')));
  tl.on(BIT2, (S) => S.snd.chime([988, 1175], 0.08, 0.07));
  F.forEach((c, i) => tl.on(c, (S) => S.snd.tone([523, 587, 659, 698, 784][i], [523, 587, 659, 698, 784][i], 0.3, 0.08, 'triangle')));
  tl.on(CHEER.a, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  const bagOut = (sp, born) => (S, P, auto, t) => {
    P.h[0] = KS(t, [[sp.a, auto[0]], [sp.at(0.3), ['P', -0.12, 0.17], 'io'], [born, ['P', -0.1, 0.2]], [sp.at(0.9), ['L', 0.36, -0.1], 'out'], [sp.b, ['L', 0.36, -0.1]]]);
    P.handNow = 0; P.look = t < born + 0.1 ? [0.2, -0.8] : [0.9, 0.2]; P.lean = 10 * prog(t, sp.a, sp.at(0.3)) * (1 - prog(t, born, sp.at(0.8))); P.leanNow = true;
    return false;
  };
  tl.pose(BAG, bagOut(BAG, SPOP));
  tl.pose(MEASD, (S, P, auto, t) => {     // la mano porta la punta del bastone sul bordo della ruota, all'altezza del centro
    const g = ['W', -R, R], k = Math.min(prog(t, MEASD.a, MEASD.at(0.3), 'out'), 1 - prog(t, SOUT, MEASD.b));
    P.h[0] = k >= 0.999 ? g : mixT(['L', 0.36, -0.1], g, k); P.handNow = 0; P.look = [1, -0.2]; P.expr = t > FIT && t < FIT + 0.4 ? 'O' : 'o';
    return false;
  });
  tl.pose(BAGIN, (S, P, auto, t) => { P.h[0] = KS(t, [[BAGIN.a, ['L', 0.36, -0.1]], [BAGIN.at(0.5), ['P', -0.1, 0.2], 'io'], [BAGIN.b, auto[0]]]); P.handNow = 0; P.look = [0.2, -0.7]; return false; });
  tl.pose(PAINT, (S, P, auto, t) => { const g = ['W', -R, R], k = Math.min(prog(t, PAINT.a, TOUCH, 'out'), 1 - prog(t, PAINT.at(0.8), PAINT.b)); P.h[0] = k >= 0.999 ? g : mixT(auto[0], g, k); P.handNow = 0; P.look = [1, 0.1]; return false; });
  const cx = (t) => R * theta(t);         // il centro della ruota
  tl.pose(ROLL, push((S, t) => [cx(t) + R * Math.cos(2.62), R + R * Math.sin(2.62)], { in: 0.1, out: 0.08, lean: 13, look: [1, 0] }));
  tl.pose(STOP, (S, P, auto, t) => {     // guarda il giro finito, poi dà una spinta alla ruota
    const k = Math.sin(Math.PI * prog(t, STOP.at(0.3), STOP.at(0.75), 'lin'));
    P.h[0] = mixT(auto[0], ['L', 0.62, 0.05], k); P.handNow = 0; P.lean = 12 * k; P.leanNow = true; P.look = [1, t < STOP.at(0.3) ? -0.5 : 0];
    return false;
  });
  tl.pose(BAG2, bagOut(BAG2, SPOP2));
  tl.pose(PLACE, (S, P, auto, t) => {     // si china e posa il bastone sulla riga, con la punta sull'inizio
    const a = PLACE.a, b = PLACE.b;
    P.py = KN(t, [[a, RIG.STAND], [DROP - 0.05, 0.4, 'out'], [DROP + 0.1, 0.4], [b, 0.4]]);
    P.lean = KN(t, [[a, 0], [DROP - 0.05, 50, 'out'], [b, 50]]); P.head = -0.4 * P.lean;
    P.h[0] = KS(t, [[a, ['L', 0.36, -0.1]], [DROP - 0.05, ['W', 0, SY], 'out'], [b, ['W', 0, SY]]]);
    P.look = [0.6, -0.8];
    return true;
  });
  // ribalta il bastone: prende la punta libera, la porta in alto camminando, la lascia cadere dall'altra parte
  const lift = (L, x0, first) => (S, P, auto, t) => {
    const u = L.u(t), p = stickAt(t)[0], g = ['W', p[0], p[1]];
    const down = first ? 1 : prog(t, L.a, L.at(0.22), 'out'), up = prog(t, L.at(0.25), L.at(0.8), 'io'), k = down * (1 - up);
    P.py = lerp(RIG.STAND, 0.4, k); P.lean = 50 * k + 6 * up * (1 - prog(t, L.at(0.9), L.b)); P.head = -0.4 * P.lean;
    P.h[0] = u < 0.92 ? (first || u > 0.22 ? g : mixT(auto[0], ['W', x0, SY], down)) : mixT(g, auto[0], prog(t, L.at(0.92), L.b));
    P.look = [0.8, u < 0.3 ? -0.8 : 0.4]; P.expr = u > 0.3 && u < 0.9 ? '>' : 'o';
    return true;
  };
  tl.pose(LIFT1, lift(LIFT1, 0, true)); tl.pose(LIFT2, lift(LIFT2, DD, false));
  tl.pose(FALL1, look(1, -0.5)); tl.pose(REST1, look(1, -0.5)); tl.pose(FALL2, look(1, -0.5)); tl.pose(REST2, look(1, -0.5, '^'));
  tl.pose(BIT, (S, P, auto, t) => {       // si china a guardare il pezzetto che avanza
    const k = Math.min(prog(t, BIT.a, BIT.at(0.15), 'out'), 1 - prog(t, BIT.at(0.85), BIT.b));
    P.py = lerp(RIG.STAND, 0.5, k); P.lean = 34 * k; P.head = -6 * k; P.look = [0.9, -0.6]; P.expr = t > DEC ? '^' : 'o';
    P.h[0] = mixT(auto[0], ['W', 3 * DD + 0.1, 0.42], k * prog(t, BLINK, BLINK + 0.3)); P.handNow = 0;
    return true;
  });
  tl.pose(PI, look(0.2, 0.95, '^'));
  tl.pose(tl.part(ANY, 0.1, 0.95), point(0, (S, t) => [X2 + r2 * th2(t), 0.4], { len: 0.62 }));
  tl.pose(FORM, look(0.2, 0.95, '^'));
  tl.pose(CHEER, cheer({ n: 3 }));
  tl.pose(END, (S, P, auto, t) => {
    const k = prog(t, END.at(0.1), END.at(0.22), 'out');
    P.h[0] = mixT(auto[0], ['L', 0.3, 0.62], k); P.h[1] = mixT(auto[1], ['P', -0.13, 0.04], k); P.handNow = true;
    P.look = t < END.at(0.5) ? [0.4, 0.95] : [0.15, 0.1]; P.expr = '^';
    return false;
  });

  // un arco di cerchio come linea spezzata, da a0 ad a1 (radianti, in senso antiorario)
  const arcPts = (c, r, a0, a1) => { const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * 8)), p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); } return p; };
  const wheel = (D, c, r, th, wet, k = 1) => {
    D.circle(c[0], c[1], r, COL.ink, { w: 0.05 * k });
    for (let i = 0; i < 4; i++) { const a = -th + (i * Math.PI) / 2; D.seg(c, [c[0] + r * 0.94 * Math.cos(a), c[1] + r * 0.94 * Math.sin(a)], 0.025 * k, COL.dim); }
    D.circle(c[0], c[1], 0.07 * k, null, { fill: COL.ink });
    // la vernice che resta sul bordo: dal punto che tocca terra, in senso antiorario
    if (wet > 0.001) D.path(arcPts(c, r, -Math.PI / 2, -Math.PI / 2 + wet), 0.085 * k, CC);
    if (wet < 0) D.path(arcPts(c, r, Math.PI + wet, Math.PI - wet), 0.085 * k, CC);     // mentre si spande dalla mano
  };

  return {
    ground: { ticks: false },
    back(S, D, t) {
      const th = theta(t);
      // la riga di vernice per terra: il bordo srotolato
      if (t >= ROLL.at(0.12)) { D.seg([0, 0.02], [Math.max(0.02, R * th), 0.02], 0.085, CC); D.seg([0, 0], [0, 0.3], 0.04, CC); if (t >= ROLL.at(0.92)) D.seg([TURN, 0], [TURN, 0.3 * pop(t, ROLL.at(0.92), 0.2)], 0.04, CC); }
      // la ruota
      const wet = t < TOUCH ? 0 : t < WET ? -Math.PI * prog(t, TOUCH, WET, 'io') : 2 * Math.PI - th;
      const aw = away(t), wx = R * th + aw, tw = th + aw / R;
      wheel(D, [wx, R], R, tw, wet);
      if (t >= WET) { const a = -Math.PI / 2 - tw; D.circle(wx + R * Math.cos(a), R + R * Math.sin(a), 0.085 * (1 + boing(t - WET, 0.5)), null, { fill: '#fff' }); }
      // la ruota piccola, con la sua riga e i suoi tre diametri
      if (t >= DROP2) {
        const q = th2(t), y = r2 + 2.2 * (1 - prog(t, DROP2, DROP2 + 0.35, 'in')) + 0.12 * Math.abs(Math.sin(prog(t, DROP2 + 0.35, DROP2 + 0.75, 'lin') * Math.PI)) * (t < DROP2 + 0.75 ? 1 : 0);
        if (q > 0) D.seg([X2, 0.02], [X2 + r2 * q, 0.02], 0.07, CC);
        wheel(D, [X2 + r2 * q, y], r2, q, 2 * Math.PI - q, 0.7);
        M2.forEach((c, i) => { if (t >= c) { const k = pop(t, c, 0.2); D.seg([X2 + i * 2 * r2, SY], [X2 + (i + k) * 2 * r2, SY], 0.06, CD); D.seg([X2 + (i + 1) * 2 * r2, SY - 0.07], [X2 + (i + 1) * 2 * r2, SY + 0.07], 0.03, CD); } });
        if (t >= BIT2) D.seg([X2 + 6 * r2, SY], [X2 + TURN2, SY], 0.09 * (1 + boing(t - BIT2, 0.6)), CP);
      }
    },
    front(S, D, t) {
      const h = S.J.h[0], f = S.hero.face;
      // il bastone: in mano (con la punta in avanti), appoggiato sulla ruota, per terra, ribaltato
      const inHand = (k, ang) => D.seg(h, [h[0] + f * DD * k * Math.cos(ang), h[1] + DD * k * Math.sin(ang)], 0.075, CD);
      if (t >= SPOP && t < BAGIN.at(0.55)) inHand(t < BAGIN.a ? pop(t, SPOP, 0.3) : 1 - prog(t, BAGIN.at(0.2), BAGIN.at(0.55)), 1.15 * (1 - prog(t, MEASD.at(0.2), FIT, 'io')) + 1.15 * prog(t, SOUT, MEASD.b));
      if (t >= DLAB && t < BAGIN.at(0.5)) D.glyph('d', 0, R + 0.34, 0.46 * pop(t, DLAB) * fade(t, SOUT, 0.3), CD);
      if (t >= SPOP2 && t < DROP) inHand(pop(t, SPOP2, 0.3), 0.5 * (1 - prog(t, PLACE.a, DROP - 0.05)));
      if (t >= DROP) {
        const s = stickAt(t);
        // dove il bastone è già stato resta il segno
        if (t >= LIFT1.at(0.25)) D.alpha(0.55, () => { D.seg([0, SY], [DD, SY], 0.06, CD); });
        if (t >= LIFT2.at(0.25)) D.alpha(0.55, () => { D.seg([DD, SY], [2 * DD, SY], 0.06, CD); });
        D.seg(s[0], s[1], 0.075, CD);
        for (let i = 0; i <= 3; i++) if (t >= [C1, C1, C2, C3][i]) D.seg([i * DD, SY - 0.09], [i * DD, SY + 0.09], 0.035, CD);
        [C1, C2, C3].forEach((c, i) => { if (t >= c) D.glyph(String(i + 1), (i + 0.5) * DD, 0.52, 0.4 * pop(t, c) * (1 + boing(t - c, 0.3)), CD, { style: '600' }); });
      }
      // il pezzetto che avanza
      if (t >= BLINK) { const b = t < DEC ? 0.55 + 0.45 * Math.sin((t - BLINK) * 14) : 1; D.alpha(b, () => D.seg([3 * DD, SY], [TURN, SY], 0.1 * (1 + boing(t - DEC, 0.5)), CP)); }
      // sullo schermo: quanti diametri, poi il nome del numero
      const n = t >= C3 ? 3 : t >= C2 ? 2 : t >= C1 ? 1 : 0;
      if (n) hud.glyph(D, U3, R1, FS, String(n), CD, { style: '600', k: 1 + boing(t - [C1, C2, C3][n - 1], 0.4) + boing(t - PIP, 0.25) });
      if (t >= DEC) hud.glyph(D, UX, R1, FS, comma() + '14…', CP, { style: '600', k: pop(t, DEC) * (1 + boing(t - BIT2, 0.25)) });
      if (t >= PIP) { hud.glyph(D, UP, R1, FS, 'π', CP, { k: pop(t, PIP) * (1 + boing(t - PIP, 0.5)) }); hud.eq(D, UE, R1, pop(t, PIP + 0.1)); }
      // il giro è π volte il diametro
      const it = [[UP, 'C', CC, true], [UE, '=', COL.ink, false], [U3, 'π', CP, true], [0.262, '·', COL.ink, false], [0.305, 'd', CD, true]];
      it.forEach(([u, s, col, ital], i) => { if (t >= F[i]) { if (s === '=') hud.eq(D, u, R2, pop(t, F[i])); else hud.glyph(D, u, R2, F2, s, col, { style: ital ? 'italic 600' : '600', k: pop(t, F[i]) }); } });
      if (t >= F[0]) D.glyph('C', TURN / 2, -0.34, 0.42 * pop(t, F[0]), CC);
      if (t >= F[4]) D.glyph('d', 2.5 * DD, -0.34, 0.42 * pop(t, F[4]), CD);
    },
  };
});
