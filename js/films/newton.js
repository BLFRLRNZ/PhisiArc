// Più forza, più massa: F = m · a (Officina, seconda lezione).
// Tre binari lisci, uno dopo l'altro, ognuno con il suo carrello e il suo paraurti in fondo. L'omino spinge ogni carrello
// per tre secondi con lo «spingi-molla»: un bastone con una molla in punta. La molla schiacciata dice quanto spinge.
// Ogni secondo resta per terra un segno, e sotto il terreno una freccia lunga quanto la strada fatta in quel secondo.
// Le frecce crescono sempre dello stesso pezzo: quel pezzo (verde) è l'accelerazione. Le frecce poi salgono a scala,
// e il pezzo verde vola nella tabella in alto: forza, blocchi, accelerazione.
//   1) un blocco, spinta normale: pezzo lungo;  2) due blocchi, stessa spinta: pezzo lungo la metà;
//   3) due blocchi, spinta doppia (la molla schiacciata il doppio): il pezzo torna lungo.
// Per lo Studente e il Curioso la tabella diventa una formula, con i numeri che cambiano: a = F / m = 2 / 1 = 2,
// poi 2 / 2 = 1, poi 4 / 2 = 2; alla fine la formula si gira nella forma di Newton, F = m · a. All'Esploratore niente lettere.
import { COL, KS, clamp, lerp, prog } from '../toon.js';
import { film, mixT, boing, pop, fade, look, point, push, carry, cheer, nod, startle, hud, formulas, rgba } from '../toonkit.js';
import { CART, cart, floor, bumper, force, spring, block } from './props.js';

const L = CART.L, TPU = 3;                      // il carrello; quanto dura ogni spinta
const POLE = 0.3, SREST = 0.45;                 // lo spingi-molla: il bastone e la molla a riposo
const CF = COL.coral, CA = COL.mint, CV = COL.sky, CM = COL.sun;
const MY = -0.3;                                // sotto il terreno: le frecce dei secondi
// i tre esperimenti: dove sta la coda del carrello all'inizio, quanti blocchi, quanto spinge (newton), quanto accelera
// (ogni binario comincia 2,7 m dopo il paraurti del binario prima: lì l'omino atterra dopo il salto)
const CASES = [];
for (const c of [{ m: 1, F: 2, a: 2 }, { m: 2, F: 2, a: 1 }, { m: 2, F: 4, a: 2 }]) {
  const prev = CASES[CASES.length - 1], x0 = prev ? prev.rb + 2.7 : 0.5;
  const sl = SREST - 0.075 * c.F;               // la molla schiacciata: 0,3 m con 2 N, 0,15 m con 4 N
  const x1 = x0 + 0.5 * c.a * TPU * TPU, v = c.a * TPU, rb = x1 + L + 0.9 + 0.3 * c.a;
  CASES.push({ ...c, x0, sl, x1, v, rb, hx: (x) => x - 0.42 - sl - 0.45, coast: (rb - L - x1) / v });
}

export default film((tl) => {
  const [A, B, C] = CASES;
  // ----- le battute -----
  tl.start(A.hx(A.x0) - 1.2, 1, { x: A.x0 + 1.2, zm: 1.15 });
  const LOOK = tl.span(1.6);
  const BAG = tl.span(1.5);                                       // tira fuori lo spingi-molla
  const IN = tl.walk(A.hx(A.x0), 1.2);
  const runs = [];
  for (const c of CASES) {
    const r = { c };
    if (c !== A) {
      const prev = CASES[CASES.indexOf(c) - 1];
      r.walk = tl.walk(prev.rb - 0.95, 2.0);
      r.jump = tl.jump(tl.span(0.62), prev.rb + 1.2, { h: 0.8 }); // salta il paraurti e atterra dietro al carrello nuovo
      r.inn = tl.walk(c.hx(c.x0), 1.0);
    }
    r.ready = tl.span(c === C ? 2.2 : c === B ? 1.6 : 1.1);       // con due blocchi: li guarda; per la spinta doppia: si prepara
    r.push = tl.move(tl.span(TPU), c.hx(c.x1), 'in');
    r.brake = tl.flag('brake', tl.move(tl.span(0.55), c.hx(c.x1) + 1.6 * (c.v / 6), 'out'));
    r.hit = r.push.b + c.coast;
    r.stair = tl.span(Math.max(0, r.hit - tl.now) + (c === A ? 3.4 : 4.4));   // con B e C anche il confronto con il pezzo di A
    runs.push(r);
  }
  const COMPARE = tl.span(4.4);                                   // la tabella, riga per riga
  const END = tl.span(6.5);
  const [RA, RB, RC] = runs;

  tl.cam(IN.a, { x: A.x0 + 1.4, zm: 1.05, k: 2 });
  for (const r of runs) {
    tl.cam(r.push.a, { follow: 2.2, zm: 0.9, k: 3 });
    tl.cam(r.stair.a, { x: r.c.x0 + 3.6, zm: 0.82, k: 1.6, kz: 1.4 });
  }
  tl.cam(COMPARE.a, { x: C.rb - 3.2, zm: 0.86, k: 1.4 });

  // ----- i carrelli -----
  const cartX = (r, t) => {
    const c = r.c, p = r.push;
    if (t < p.a) return c.x0;
    if (t < p.b) return c.x0 + 0.5 * c.a * (t - p.a) ** 2;
    if (t < r.hit) return c.x1 + c.v * (t - p.b);
    return c.rb - L - 0.05 * Math.sin(Math.PI * clamp((t - r.hit) / 0.25));
  };
  const spr = (r, t) => (t >= r.ready.at(0.5) && t < r.push.b ? lerp(SREST, r.c.sl, prog(t, r.ready.at(0.5), r.ready.at(0.5) + 0.25, 'out')) : SREST);
  const grip = (r, t) => [cartX(r, t) - 0.12 - spr(r, t) - POLE, CART.HY];
  const holding = (t) => t >= BAG.at(0.55);
  // i segni dei secondi e le frecce sotto il terreno
  const marks = [];
  for (const r of runs) for (let k = 1; k <= TPU; k++) marks.push({ r, k, t: r.push.a + k, x: r.c.x0 + 0.5 * r.c.a * k * k + L / 2, x0: r.c.x0 + 0.5 * r.c.a * (k - 1) ** 2 + L / 2 });

  // ----- la tabella (per tutti) e la formula (solo Studente e Curioso) -----
  // posti sullo schermo; ICON: lunghezza per newton o per m/s². All'Esploratore (niente formula a destra) la tabella più grande
  const TB = () => (formulas() ? { v: [0.11, 0.21, 0.31], uf: 0.05, um: 0.2, ua: 0.27, k: 1 } : { v: [0.12, 0.25, 0.38], uf: 0.05, um: 0.25, ua: 0.35, k: 1.45 });
  const ICON = 0.032;
  const rowIn = runs.map((r) => r.stair.at(0.72));                // quando la riga si riempie
  const U = { a: 0.5, e1: 0.565, f1: 0.635, e2: 0.705, f2: 0.775, e3: 0.845, r: 0.91 }, HV = 0.2, HT = 0.135, HB = 0.265, FL = 0.12, FN = 0.105;
  const cF = tl.chip({ str: 'F', col: CF, size: 0.55, born: RA.push.at(0.25), at: (S, t) => [grip(RA, t)[0] + POLE + 0.1, CART.HY + 0.55], go: RA.push.b + 0.2, fly: 0.6, h: 0.5, spin: true, slot: { u: U.f1, v: HT, frac: FL } });
  const cM = tl.chip({ str: 'm', col: CM, size: 0.55, born: RA.stair.at(0.12), at: () => [A.rb - L / 2, 1.25], go: RA.stair.at(0.3), fly: 0.6, h: 0.5, spin: true, slot: { u: U.f1, v: HB, frac: FL } });
  const cA = tl.chip({ str: 'a', col: CA, size: 0.55, born: RA.stair.at(0.6), at: () => [A.x0 + 0.3 + A.a, MY - 0.33 + 0.4], go: RA.stair.at(0.78), fly: 0.6, h: 0.6, spin: true, slot: { u: U.a, v: HV, frac: FL } });
  const BARS = RA.stair.at(0.48);
  const nIdx = (t) => (t >= rowIn[2] ? 2 : t >= rowIn[1] ? 1 : 0);
  const numsOn = rowIn[0] + 0.15;
  const SWAP = END.at(0.22), SWAPD = 1.1;                          // a = F/m diventa F = m · a

  // ----- quello che succede -----
  const thud = (S, v = 0.12) => { S.snd.tone(160, 60, 0.16, v); S.snd.noise(0.08, 0.06, 900, 200); };
  const ping = (S, f = 520) => S.snd.tone(f, f * 1.5, 0.12, 0.08, 'triangle');
  tl.on(BAG.at(0.55), (S) => { S.snd.tone(700, 320, 0.1, 0.09, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); });
  for (const r of runs) {
    const c = r.c;
    tl.on(r.ready.at(0.5), (S) => { S.snd.tone(300, 180, 0.2, 0.07, 'triangle'); S.snd.noise(0.15, 0.04, 1500, 500); });
    if (c === B) tl.on(r.ready.at(0.15), (S) => { ping(S, 440); S.burst([c.x0 + L / 2, 1.0], 8, 4, 0.4, CM, { kind: 'plus' }); });
    if (c === C) tl.on(r.ready.at(0.62), (S) => { S.snd.tone(200, 400, 0.3, 0.08, 'sawtooth'); S.kick({ shake: 0.03 }); });
    tl.on(r.push.a, (S) => { S.snd.noise(0.22, 0.05, 500, 2200); S.snd.tone(90, 90 + 40 * c.a, TPU, 0.04, 'sawtooth'); });
    tl.on(r.hit, (S) => { S.kick({ shake: 0.08 + 0.02 * c.v, punch: 0.03, flash: 0.12, chroma: 4 }); S.snd.boom(0.1 + 0.015 * c.v); thud(S, 0.15); S.burst([c.rb, 0.35], 10, 5, 0.45, CF); });
    tl.on(r.stair.at(0.08), (S) => S.snd.tone(300, 600, 0.3, 0.06, 'triangle'));
    tl.on(r.stair.at(0.4), (S) => S.snd.noise(0.4, 0.05, 600, 1800));
    tl.on(r.stair.at(0.56), (S) => S.snd.tick(1100, 0.06));
    tl.on(r.stair.at(0.6), (S) => { ping(S, 660); S.burst([c.x0 + 0.3 + c.a, MY - 0.33], 6, 3, 0.35, CA, { kind: 'plus' }); });
    tl.on(rowIn[runs.indexOf(r)], (S) => { S.snd.tone(988, 1480, 0.12, 0.06, 'triangle'); S.kick({ shake: 0.03 }); });
    if (c !== A) tl.on(r.stair.at(0.68), (S) => { const f = c === B ? 392 : 523; S.snd.tone(f, f, 0.3, 0.08, 'triangle'); S.snd.tone(f * 1.5, f * 1.5, 0.3, 0.06, 'triangle', 0.18); });
  }
  for (const m of marks) tl.on(m.t, (S) => { S.snd.tick(1100 + 140 * m.k, 0.06); S.burst([m.x, 0.1], 5, 3, 0.35, CV, { up: 1 }); });
  for (let i = 0; i < 3; i++) tl.on(COMPARE.at(0.1 + 0.28 * i), (S) => S.snd.tone([523, 392, 523][i], [523, 392, 523][i], 0.35, 0.08, 'triangle'));
  tl.on(cF.dock, (S) => { if (formulas()) ping(S, 880); });
  tl.on(cM.dock, (S) => { if (formulas()) ping(S, 784); });
  tl.on(cA.dock, (S) => { if (formulas()) { S.snd.tone(988, 1480, 0.12, 0.06, 'triangle'); S.kick({ shake: 0.04 }); } });
  tl.on(SWAP, (S) => { if (formulas()) S.snd.noise(0.5, 0.05, 700, 3600); });
  tl.on(SWAP + SWAPD, (S) => { if (formulas()) { S.kick({ shake: 0.1, punch: 0.03, flash: 0.18, chroma: 5, stop: 0.04 }); S.snd.boom(0.12); S.snd.chime([523, 659, 784, 1047], 0.09, 0.09); } });

  // ----- i gesti -----
  tl.pose(LOOK, look(1, -0.4));
  tl.pose(BAG, (S, P, auto, t) => {      // la mano va alla tracolla e torna su con lo spingi-molla
    const born = BAG.at(0.55);
    P.h[0] = KS(t, [[BAG.a, auto[0]], [BAG.at(0.3), ['P', -0.12, 0.17], 'io'], [born, ['P', -0.1, 0.2]], [BAG.at(0.85), ['L', 0.45, -0.05], 'out'], [BAG.b, ['L', 0.45, -0.05]]]);
    P.handNow = 0; P.look = t < born + 0.1 ? [0.2, -0.8] : [0.9, -0.2]; P.lean = 10 * prog(t, BAG.a, BAG.at(0.3)) * (1 - prog(t, born, BAG.at(0.8))); P.leanNow = true;
    return false;
  });
  const hold = carry(0, [0.45, -0.05]);
  for (const r of runs) {
    if (r.walk) { tl.pose(r.walk, hold); tl.pose(r.jump, hold); tl.pose(r.inn, hold); }
    tl.pose(tl.between(r.ready.a, r.push.b + 0.02), push((S, t) => grip(r, t), { in: 0.12, out: 0.01, lean: r.c === C ? 20 : 14, look: [1, -0.1], expr: r.c === C ? '>' : 'o' }));
    tl.pose(r.brake, (S, P, auto, t) => { hold(S, P, auto, t, r.brake); P.look = [1, -0.2]; return false; });
    tl.pose(r.stair, (S, P, auto, t) => { hold(S, P, auto, t, r.stair); P.look = [r.stair.u(t) < 0.25 ? 1 : -1, r.stair.u(t) < 0.25 ? -0.2 : -0.6]; P.expr = r.stair.u(t) > 0.6 ? '^' : 'o'; return false; });
  }
  tl.pose(IN, hold);
  tl.pose(tl.part(RB.ready, 0, 0.55), (S, P) => { P.look = [1, -0.5]; P.expr = 'O'; return false; });   // due blocchi!
  tl.pose(tl.part(RB.stair, 0.62, 0.9), (S, P, auto, t, s) => { const k = Math.min(prog(t, s.a, s.at(0.2), 'out'), 1 - prog(t, s.at(0.8), s.b)); P.h[1] = mixT(auto[1], ['L', 0.15, 0.36], k); P.handNow = P.handNow === 0 ? true : 1; P.head = 7 * k; P.look = [-0.6, -0.7]; P.expr = 'o'; return false; });
  tl.pose(tl.part(RC.ready, 0, 0.45), (S, P, auto, t) => { P.lean = -6 * Math.sin(Math.PI * RC.ready.u(t) / 0.45); P.leanNow = true; P.expr = '>'; return false; });
  tl.pose(COMPARE, (S, P, auto, t) => { hold(S, P, auto, t, COMPARE); P.look = [-0.3, 0.9]; P.expr = 'o'; return false; });
  tl.pose(tl.part(COMPARE, 0.12, 0.92), point(1, (S, t) => { const i = Math.min(2, Math.floor(COMPARE.u(t) / 0.28 + 0.6)), tb = TB(); return D0 ? D0.screen(tb.ua + 0.06, tb.v[i]) : [0, 3]; }, { len: 0.62 }));
  tl.pose(END, (S, P, auto, t) => { hold(S, P, auto, t, END); P.look = t < END.at(0.6) ? [-0.2, 0.9] : [0.2, 0.1]; P.expr = '^'; return false; });
  tl.pose(tl.part(END, 0.62, 0.92), nod(2));
  let D0 = null;

  // ----- il disegno -----
  const fv = () => formulas();
  const hudBlocks = (D, u, v, n, k = 1, z = 1) => { const s = 0.034 * D.unit * k * z; for (let i = 0; i < n; i++) { const p = D.screen(u + i * 0.026 * z, v); block(D, p[0] - s / 2, p[1] - s / 2, s, CM); } };
  const hudArrow = (D, u, v, len, col, k = 1) => { if (k <= 0.01) return; const a = D.screen(u, v), b = [a[0] + len * D.unit * k, a[1]]; D.arrow(a, b, 0.012 * D.unit, col, 0.025 * D.unit); };
  return {
    ground: { numbers: false },
    init: () => ({}),
    back(S, D, t) {
      D0 = D;
      for (const r of runs) { floor(D, 'binario', r.c.x0 - 0.8, r.c.rb); bumper(D, r.c.rb, { bump: t >= r.hit ? boing(t - r.hit, 0.5, 30, 10) : 0 }); }
      // i segni dei secondi e, sotto il terreno, la strada fatta in ogni secondo; poi la scala
      for (const m of marks) {
        const r = m.r, c = r.c;
        if (t < m.t - 1) continue;
        const al = 1 - prog(t, r.stair.b + 0.2, r.stair.b + 1.2);
        if (al <= 0) continue;
        if (t >= m.t) D.alpha(al * (1 - prog(t, r.stair.a, r.stair.at(0.2))), () => { D.seg([m.x, 0], [m.x, 0.32 * pop(t, m.t, 0.14)], 0.05, CV); D.glyph(String(m.k), m.x, 0.6, 0.3 * pop(t, m.t + 0.05), CV, { style: '600' }); });
        const len = m.x - m.x0, grow = clamp(t - (m.t - 1)), su = r.stair.has(t) ? r.stair.u(t) : t >= r.stair.b ? 1 : 0;
        const sx0 = c.x0 + 0.3, ux = prog(su, 0.15, 0.45), uy = prog(su, 0.05, 0.3, 'out');
        const xA = lerp(m.x0, sx0, ux), y = lerp(MY, MY - 0.33 * (m.k - 1), uy);
        D.alpha(al, () => {
          // la parte che cresce da un secondo all'altro (uguale ogni volta): in verde
          const prev = m.k > 1 ? 0.5 * c.a * (2 * (m.k - 1) - 1) : 0, gk = prog(su, 0.5, 0.62);
          if (m.k > 1 && gk > 0) {
            D.arrow([xA, y], [xA + len, y], 0.06, CV, 0.22); D.seg([xA + prev, y], [xA + prev + (len - prev) * gk, y], 0.11, CA);
            // con B e C: il pezzo verde di A, tratteggiato, appoggiato sopra per confronto (B: la metà; C: uguale)
            if (c !== A && m.k === 2) { const q = prog(su, 0.66, 0.8, 'out'); if (q > 0) D.alpha(q * (1 - prog(su, 0.95, 1)), () => D.path([[xA + prev, y + 0.2], [xA + prev + A.a, y + 0.2]], 0.06, CA, { dash: [0.12, 0.08] })); }
          }
          else D.arrow([xA, y], [xA + len * grow, y], 0.06, CV, Math.min(0.22, len * grow * 0.5));
        });
      }
    },
    front(S, D, t) {
      // i carrelli, con i loro blocchi; la freccia della spinta sopra il carrello che si sta spingendo
      for (const r of runs) {
        const c = r.c, x = cartX(r, t);
        cart(D, x, CV, { dist: x });
        for (let i = 0; i < c.m; i++) block(D, x + L / 2 - (c.m * 0.3) / 2 + i * 0.3 + 0.02, CART.Y0 + CART.H + 0.01, 0.26, CM, 1 + (c === B ? boing(t - r.ready.at(0.15), 0.3) : 0));
        const k = Math.min(pop(t, r.ready.at(0.5), 0.25), fade(t, r.push.b, 0.2));
        if (k > 0) force(D, [x + L / 2 - 0.5, 1.35], [x + L / 2 - 0.5 + 0.38 * c.F, 1.35], k, CF, 0.09);
      }
      // lo spingi-molla nelle mani: il bastone e la molla (schiacciata quando spinge)
      if (holding(t)) {
        const h = S.J.h[0], f = S.hero.face, pushing = runs.find((r) => t >= r.ready.at(0.5) && t < r.push.b);
        const out = t < BAG.b ? prog(t, BAG.at(0.55), BAG.b, 'out') : 1;
        const p0 = [h[0], h[1]], p1 = [h[0] + f * POLE * out, h[1]], sl = pushing ? spr(pushing, t) : SREST;
        D.seg(p0, p1, 0.05, COL.ink);
        spring(D, p1, [p1[0] + f * sl * out, p1[1]], COL.ink, { n: 5, w: 0.07, lw: 0.028 });
        D.seg([p1[0] + f * sl * out, p1[1] - 0.08], [p1[0] + f * sl * out, p1[1] + 0.08], 0.04, COL.ink);
      }
      // la tabella: per ogni esperimento la spinta, i blocchi e l'accelerazione (il pezzo verde)
      const tb = TB();
      runs.forEach((r, i) => {
        const v = tb.v[i], c = r.c, t0 = rowIn[i];
        if (t < t0 - 0.45) return;
        const kF = pop(t, t0 - 0.45), kM = pop(t, t0 - 0.25), kA = pop(t, t0), hi = COMPARE.has(t) && Math.floor(COMPARE.u(t) / 0.28 + 0.6) === i ? 0.25 : 0;
        hudArrow(D, tb.uf, v, ICON * c.F * tb.k, CF, kF * (1 + hi));
        if (kM > 0) hudBlocks(D, tb.um, v, c.m, kM * (1 + hi), tb.k);
        hudArrow(D, tb.ua, v, ICON * 2 * c.a * tb.k, CA, kA * (1 + hi + boing(t - t0, 0.25)));
      });
      // la formula, con i numeri dell'esperimento appena fatto
      if (fv()) {
        const sw = prog(t, SWAP, SWAP + SWAPD, 'io'), dimN = 1 - prog(t, SWAP - 0.4, SWAP);
        // a = F/m  →  F = m · a : le lettere vanno ai posti nuovi
        const slotF = sw > 0 ? [lerp(U.f1, U.a, sw), lerp(HT, HV, sw)] : null, slotM = sw > 0 ? [lerp(U.f1, U.f1 - 0.005, sw), lerp(HB, HV, sw)] : null, slotA = sw > 0 ? [lerp(U.a, U.e2 + 0.005, sw), HV] : null;
        if (sw > 0) {
          hud.glyph(D, slotF[0], slotF[1], FL, 'F', CF); hud.glyph(D, slotM[0], slotM[1], FL, 'm', CM); hud.glyph(D, slotA[0], slotA[1], FL, 'a', CA);
          const dk = pop(t, SWAP + SWAPD * 0.7); if (dk > 0) { const p = D.screen((U.f1 + U.e2) / 2 + 0.0, HV); D.circle(p[0], p[1] - 0.004 * D.unit, 0.009 * D.unit * dk, null, { fill: COL.ink }); }
        } else { cF.draw(S, D, t); cM.draw(S, D, t); cA.draw(S, D, t); }
        if (t >= BARS && sw < 1) D.alpha(1 - sw, () => hud.bar(D, U.f1, HV, 0.026, 1 + boing(t - BARS, 0.4)));
        if (t >= cA.dock - 0.2) hud.eq(D, U.e1, HV, pop(t, cA.dock - 0.2));
        if (t >= numsOn && dimN > 0) {
          const i = nIdx(t), c = runs[i].c, bump = boing(t - rowIn[i], 0.3);
          D.alpha(dimN, () => {
            hud.eq(D, U.e2, HV, pop(t, numsOn)); hud.bar(D, U.f2, HV, 0.022, pop(t, numsOn)); hud.eq(D, U.e3, HV, pop(t, numsOn + 0.15));
            hud.glyph(D, U.f2, HT, FN, String(c.F), CF, { style: '600', k: pop(t, numsOn) * (1 + bump) });
            hud.glyph(D, U.f2, HB, FN, String(c.m), CM, { style: '600', k: pop(t, numsOn) * (1 + bump) });
            hud.glyph(D, U.r, HV, FN, String(c.a), CA, { style: '600', k: pop(t, numsOn + 0.15) * (1 + bump) });
          });
        }
      }
    },
  };
});
