// Azione e reazione (Officina, terza lezione).
// L'omino sta in piedi su uno skate, sul binario liscio. 1) Spinge piano il muro: il muro non si muove, e lui va indietro.
// Sul muro c'è la sua spinta, sul suo petto quella del muro: due frecce uguali e opposte. Per tornare al muro spinge
// la terra con un piede (anche lì due frecce: il piede spinge la terra indietro, la terra spinge lui avanti), poi spinge
// il muro forte: le frecce sono più lunghe, sempre uguali, e lui va indietro più veloce. Le due frecce salgono in alto,
// schiena contro schiena: è la regola. 2) Spinge un carrello leggero: le frecce sono ancora uguali, ma il carrello scappa
// veloce e lui torna indietro piano; le frecce dei secondi del carrello sono tre volte quelle dell'omino (lui pesa tre volte tanto).
// 3) Il razzo: lancia quattro palle contro il muro, una dopo l'altra, e a ogni lancio va un po' più veloce dall'altra parte.
// Per lo Studente e il Curioso, sotto le due frecce: F₁₂ = −F₂₁ (1 è l'omino, 2 quello che lui spinge). All'Esploratore niente lettere.
import { COL, KS, clamp, lerp, prog } from '../toon.js';
import { film, mixT, boing, pop, fade, look, push, toss, cheer, startle, nod, hud, formulas, rgba, arc } from '../toonkit.js';
import { CART, cart, floor, ball, force } from './props.js';

const BY0 = 0.2;                           // lo skate: l'omino ci sta in piedi sopra, a questa altezza
const WX = -6;                             // la faccia del muro
const CF = COL.coral, CV = COL.sky, CD = COL.orange, CW = COL.violet;
const MY = -0.3, GF = 9.8, BR = 0.13;
const L = CART.L;

// il moto dello skate: tratti a velocità costante o ad accelerazione costante, uno dopo l'altro (x, v all'inizio di ogni tratto)
function path(x0, segs) {
  const out = []; let x = x0, v = 0;
  for (const s of segs) { out.push({ ...s, x, v }); x += v * s.d + 0.5 * (s.a || 0) * s.d * s.d; v += (s.a || 0) * s.d; }
  const at = (t) => { let p = out[0]; for (const s of out) if (t >= s.t0) p = s; const u = clamp(t - p.t0, 0, p.d); return { x: p.x + p.v * u + 0.5 * (p.a || 0) * u * u, v: p.v + (p.a || 0) * u }; };
  return { at, end: () => x };
}

export default film((tl) => {
  // ----- le battute -----
  tl.start(-5.55, -1, { x: -4.3, zm: 1.25 });
  const LOOK = tl.span(1.6);
  const PREP = tl.span(0.7);                                    // le mani sul muro
  const PW1 = tl.span(0.45);                                    // spinge piano: va indietro
  const GLIDE1 = tl.span(2.2);
  const BRAKE1 = tl.span(1.0);
  const SURP = tl.span(1.0);                                    // ma io ho spinto il muro!
  const K1 = tl.span(0.35), KG1 = tl.span(0.9), K2 = tl.span(0.35), KG2 = tl.span(1.6), KB = tl.span(0.8);   // torna al muro spingendo la terra con il piede
  const PREP2 = tl.span(0.5);
  const PW2 = tl.span(0.3);                                     // ora spinge forte
  const GLIDE2 = tl.span(2.0);
  const BRAKE2 = tl.span(1.2);
  const EQUAL = tl.span(3.6);                                   // le due frecce salgono: uguali, schiena contro schiena
  tl.face(EQUAL.at(0.8), 1);
  const CART_IN = tl.span(0.8);                                 // il carrello è lì davanti
  const PREP3 = tl.span(0.6);
  const PC = tl.span(0.18);                                     // spinge il carrello: lui scappa veloce, l'omino torna indietro piano
  const GLIDE3 = tl.span(2.6);
  const BRAKE3 = tl.span(1.0);
  const COMP = tl.span(4.2);                                    // le frecce dei secondi: 3 a 1
  tl.face(COMP.at(0.85), -1);
  const THROWS = [0, 1, 2, 3].map(() => ({ bag: tl.span(0.9), toss: tl.span(1.0) }));   // quattro palle contro il muro
  const ROLL = tl.span(2.4);
  const BRAKE4 = tl.span(1.2);
  const END = tl.span(6.4);

  // ----- lo skate (e l'omino sopra) -----
  const V1 = (2 * 0.3) / PW1.d, V2 = (2 * 0.3) / PW2.d;        // dal muro: 0,3 m di spinta, piano (1,3 m/s) e forte (2 m/s)
  const VK = 0.7;                                               // ogni colpo di piede: 0,7 m/s verso il muro
  const VH = 0.8, VC = 2.4;                                     // dal carrello: l'omino (3 volte più pesante) a 0,8 m/s, il carrello a 2,4 m/s
  const DV = 0.5;                                               // ogni palla lanciata: mezzo metro al secondo in più
  const REL = THROWS.map((th) => th.toss.at(0.42));             // quando parte ogni palla
  const segs = [
    { t0: 0, d: PW1.a }, { t0: PW1.a, d: PW1.d, a: V1 / PW1.d }, { t0: GLIDE1.a, d: GLIDE1.d }, { t0: BRAKE1.a, d: BRAKE1.d, a: -V1 / BRAKE1.d },
    { t0: SURP.a, d: SURP.d }, { t0: K1.a, d: K1.d, a: -VK / K1.d }, { t0: KG1.a, d: KG1.d }, { t0: K2.a, d: K2.d, a: -VK / K2.d }, { t0: KG2.a, d: KG2.d },
    { t0: KB.a, d: KB.d, a: (2 * VK) / KB.d }, { t0: PREP2.a, d: PREP2.d }, { t0: PW2.a, d: PW2.d, a: V2 / PW2.d }, { t0: GLIDE2.a, d: GLIDE2.d },
    { t0: BRAKE2.a, d: BRAKE2.d, a: -V2 / BRAKE2.d }, { t0: EQUAL.a, d: PC.a - EQUAL.a }, { t0: PC.a, d: PC.d, a: -VH / PC.d }, { t0: GLIDE3.a, d: GLIDE3.d },
    { t0: BRAKE3.a, d: BRAKE3.d, a: VH / BRAKE3.d },
  ];
  let last = BRAKE3.b;
  REL.forEach((r) => { segs.push({ t0: last, d: r - last }, { t0: r, d: 0.15, a: DV / 0.15 }); last = r + 0.15; });
  segs.push({ t0: last, d: BRAKE4.a - last }, { t0: BRAKE4.a, d: BRAKE4.d, a: (-REL.length * DV) / BRAKE4.d }, { t0: BRAKE4.b, d: 99 });
  const SK = path(-5.55, segs);
  const sk = (t) => SK.at(t).x;
  // il carrello leggero, fermo davanti all'omino quando lui si ferma dopo la spinta forte
  const CX0 = sk(PREP3.a) + 0.26 + 0.12;
  const cartX = (t) => (t < PC.a ? CX0 : t < PC.b ? CX0 + 0.5 * (VC / PC.d) * (t - PC.a) ** 2 : CX0 + 0.5 * VC * PC.d + VC * (t - PC.b));
  const handsCart = (t) => [cartX(t) - 0.12, CART.HY];
  const wallHand = [WX + 0.02, 1.5];

  tl.cam(0, { x: -4.3, zm: 1.25 });
  tl.cam(GLIDE1.a, { x: -3.4, zm: 1.05, k: 2 });
  tl.cam(K1.a, { x: -3.6, zm: 1.0, k: 1.6 });
  tl.cam(GLIDE2.a, { x: -2.6, zm: 0.92, k: 1.8 });
  tl.cam(EQUAL.a, { x: -1.6, zm: 0.95, k: 1.6 });
  tl.cam(CART_IN.a, { x: 0.4, zm: 1.05, k: 1.8 });
  tl.cam(GLIDE3.a, { x: 1.4, zm: 0.72, k: 1.6, kz: 1.4 });
  tl.cam(COMP.a, { x: 1.4, zm: 0.7, k: 1.4 });
  tl.cam(THROWS[0].bag.a, { x: -3.8, zm: 0.95, k: 1.6, kz: 1.4 });
  tl.cam(END.a, { x: 0, zm: 0.86, k: 1.4 });

  // ----- le palle: un volo vero (gravità, rimbalzo sul muro e per terra), calcolato una volta sola -----
  const balls = REL.map((r) => {
    const pts = []; let x = sk(r) - 0.45, y = BY0 + 1.3, vx = -4.2, vy = 1.4, t = 0;
    const dt = 1 / 240;
    for (let i = 0; i < 240 * 7; i++) {
      vy -= GF * dt; x += vx * dt; y += vy * dt; t += dt;
      if (x < WX + BR) { x = WX + BR; vx = -vx * 0.45; }
      if (y < BR) { y = BR; vy = Math.abs(vy) > 0.6 ? -vy * 0.45 : 0; vx *= 0.92; }
      if (y <= BR + 1e-4 && vy === 0) vx *= 1 - 1.4 * dt;
      if (i % 4 === 3) pts.push([x, y]);
    }
    return { r, pts, at: (tt) => pts[Math.min(pts.length - 1, Math.max(0, Math.round((tt - r) * 60) - 1))] };
  });
  const wallHits = balls.map((b) => { const i = b.pts.findIndex((p) => p[0] <= WX + BR + 0.001); return i < 0 ? null : b.r + (i + 1) / 60; });

  // ----- quando ci sono le frecce: la spinta e la sua risposta -----
  const kOn = (s, k0 = 0.1, k1 = 0.15) => (t) => Math.min(pop(t, s.a, k0), fade(t, s.b, k1));
  const kW1 = kOn(PW1), kW2 = kOn(PW2), kC = kOn(PC, 0.06), kK1 = kOn(K1, 0.08), kK2 = kOn(K2, 0.08);
  const kT = (i, t) => Math.min(pop(t, REL[i] - 0.04, 0.08), fade(t, REL[i] + 0.3, 0.25));
  // le frecce dei secondi, sotto il terreno: carrello e omino, dopo la spinta
  const secs = [];
  for (let k = 1; k <= 3; k++) secs.push({ k, t: PC.b + k, xc: cartX(PC.b + k) + L / 2, xc0: cartX(PC.b + k - 1) + L / 2, xh: sk(PC.b + k), xh0: sk(PC.b + k - 1) });

  // ----- la regola: due frecce uguali, schiena contro schiena (e, per chi le vuole, le lettere) -----
  const RV = 0.12, RL = 0.1, FV = 0.24, HU = { a: 0.405, e: 0.5, b: 0.605 }, FS = 0.11;
  const UP = EQUAL.at(0.18), DOCK = EQUAL.at(0.55), LET = EQUAL.at(0.7);

  // ----- suoni ed effetti -----
  const thud = (S, v = 0.12) => { S.snd.tone(160, 60, 0.16, v); S.snd.noise(0.08, 0.06, 900, 200); };
  const ping = (S, f = 520) => S.snd.tone(f, f * 1.5, 0.12, 0.08, 'triangle');
  const roll = (S, d, v = 0.04) => S.snd.tone(110, 90, d, v, 'sawtooth');
  const scrape = (S, d) => S.snd.noise(d, 0.05, 2500, 600);
  tl.on(PREP.at(0.6), (S) => S.snd.tick(800, 0.06));
  tl.on(PW1.a, (S) => { thud(S, 0.11); S.snd.noise(0.25, 0.05, 500, 2200); S.burst(wallHand, 6, 3, 0.3, CF); S.kick({ shake: 0.03 }); });
  tl.on(PW1.b, (S) => roll(S, GLIDE1.d));
  tl.on(BRAKE1.a, (S) => scrape(S, BRAKE1.d));
  tl.on(SURP.a + 0.1, (S) => S.snd.tone(660, 1320, 0.18, 0.08, 'triangle'));
  for (const k of [K1, K2]) tl.on(k.a + 0.05, (S) => { S.snd.noise(0.15, 0.06, 1500, 400); S.dust(sk(k.a) + 0.35, 0, 5, 3); });
  tl.on(KG2.a, (S) => roll(S, KG2.d, 0.03));
  tl.on(KB.a, (S) => scrape(S, KB.d));
  tl.on(PREP2.at(0.6), (S) => S.snd.tick(800, 0.06));
  tl.on(PW2.a, (S) => { thud(S, 0.16); S.snd.boom(0.08); S.snd.noise(0.25, 0.06, 500, 2200); S.burst(wallHand, 10, 5, 0.4, CF); S.kick({ shake: 0.07, punch: 0.02 }); });
  tl.on(PW2.b, (S) => roll(S, GLIDE2.d, 0.05));
  tl.on(BRAKE2.a, (S) => scrape(S, BRAKE2.d));
  tl.on(UP, (S) => S.snd.tone(300, 600, 0.3, 0.06, 'triangle'));
  tl.on(DOCK, (S) => { S.snd.tone(440, 660, 0.12, 0.08, 'triangle'); S.snd.tone(660, 990, 0.12, 0.07, 'triangle', 0.1); S.kick({ shake: 0.03 }); });
  tl.on(LET, (S) => { if (formulas()) ping(S, 784); });
  tl.on(LET + 0.3, (S) => { if (formulas()) ping(S, 880); });
  tl.on(CART_IN.a + 0.15, (S) => ping(S, 523));
  tl.on(PC.a, (S) => { thud(S, 0.13); S.snd.noise(0.2, 0.05, 500, 2200); S.burst(handsCart(PC.a), 8, 4, 0.35, CF); S.kick({ shake: 0.04 }); });
  tl.on(PC.b, (S) => { S.snd.tone(90, 120, 3.5, 0.04, 'sawtooth'); roll(S, GLIDE3.d, 0.03); });
  tl.on(BRAKE3.a, (S) => scrape(S, BRAKE3.d));
  for (const m of secs) tl.on(m.t, (S) => { S.snd.tick(1200 + 100 * m.k, 0.06); S.burst([m.xc, 0.1], 5, 3, 0.35, CV, { up: 1 }); S.burst([m.xh, 0.1], 4, 2, 0.3, CV, { up: 1 }); });
  for (let i = 0; i < 3; i++) tl.on(COMP.at(0.32 + 0.12 * i), (S) => S.snd.tick(900 + 150 * i, 0.06));
  tl.on(COMP.at(0.72), (S) => { S.snd.tone(392, 392, 0.3, 0.08, 'triangle'); S.snd.tone(1175, 1175, 0.3, 0.07, 'triangle', 0.25); });
  THROWS.forEach((th, i) => {
    tl.on(th.bag.at(0.55), (S) => { S.snd.tone(700, 320, 0.1, 0.09, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); });
    tl.on(REL[i], (S) => { S.snd.noise(0.22, 0.06, 500, 2400); S.snd.tone(200, 260 + 60 * i, 0.4, 0.05, 'sawtooth'); S.kick({ shake: 0.03 + 0.01 * i }); });
    if (wallHits[i]) tl.on(wallHits[i], (S) => { thud(S, 0.1); S.burst([WX, balls[i].at(wallHits[i])[1]], 6, 3, 0.3, CD); });
  });
  tl.on(ROLL.a + 0.2, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));
  tl.on(BRAKE4.a, (S) => scrape(S, BRAKE4.d));
  tl.on(END.at(0.3), (S) => { S.kick({ shake: 0.1, punch: 0.03, flash: 0.18, chroma: 5, stop: 0.04 }); S.snd.boom(0.12); S.snd.chime([523, 659, 784, 1047], 0.09, 0.09); });

  // ----- i gesti -----
  const braking = (s) => (S, P, auto, t) => {   // frena con un piede per terra: anche quella è una forza
    const k = Math.min(prog(t, s.a, s.at(0.2), 'out'), 1 - prog(t, s.at(0.85), s.b)), f = S.hero.face;
    P.f[1] = mixT(P.f[1] ?? ['L', -0.1, -0.73], ['W', S.hero.x - f * 0.32, 0.02], k); P.lean = -6 * k; P.leanNow = true; P.expr = '>';
    return false;
  };
  // un colpo di piede: il piede dietro va a terra e spinge indietro
  const kickPose = (s) => (S, P, auto, t) => {
    const u = s.u(t), f = S.hero.face, k = Math.sin(Math.PI * u);
    P.f[1] = mixT(P.f[1] ?? ['L', -0.1, -0.73], ['W', S.hero.x - f * lerp(0.1, 0.5, u), 0.02], k); P.py = lerp(0.731, 0.66, k); P.lean = 8 * k; P.leanNow = true; P.expr = '>';
    return false;
  };
  tl.pose(LOOK, (S, P, auto, t) => { P.look = [1, t < LOOK.at(0.5) ? 0.1 : -0.2]; return false; });
  tl.pose(tl.between(PREP.a, PW1.b + 0.02), push(() => wallHand, { in: 0.35, out: 0.04, lean: 8, look: [1, 0.05] }));
  tl.pose(GLIDE1, (S, P, auto) => { P.look = [1, -0.1]; P.expr = 'O'; P.h[0] = mixT(auto[0], ['L', 0.3, 0.2], 0.6); P.h[1] = mixT(auto[1], ['L', -0.35, 0.25], 0.6); P.handNow = true; return false; });
  tl.pose(BRAKE1, braking(BRAKE1));
  tl.pose(SURP, startle());
  tl.pose(K1, kickPose(K1)); tl.pose(K2, kickPose(K2));
  tl.pose(KB, braking(KB));
  tl.pose(tl.between(PREP2.a, PW2.b + 0.02), push(() => wallHand, { in: 0.4, out: 0.04, lean: 14, look: [1, 0.05], expr: '>' }));
  tl.pose(GLIDE2, (S, P, auto) => { P.look = [1, 0.1]; P.expr = 'O'; P.h[0] = mixT(auto[0], ['L', 0.36, 0.42], 0.7); P.h[1] = mixT(auto[1], ['L', -0.36, 0.44], 0.7); P.handNow = true; return false; });
  tl.pose(BRAKE2, braking(BRAKE2));
  tl.pose(EQUAL, (S, P, auto, t) => { P.look = [EQUAL.u(t) < 0.8 ? -0.3 : 1, 0.85]; P.expr = EQUAL.u(t) > 0.55 ? '^' : 'o'; return false; });
  tl.pose(CART_IN, look(1, -0.4, 'o'));
  tl.pose(tl.between(PREP3.a, PC.at(0.55)), push((S, t) => handsCart(t), { in: 0.4, out: 0.1, lean: 12, look: [1, -0.2], expr: '>' }));
  tl.pose(GLIDE3, (S, P, auto, t) => { P.look = [1, 0]; P.expr = 'O'; return false; });
  tl.pose(BRAKE3, braking(BRAKE3));
  tl.pose(COMP, (S, P, auto, t) => { P.look = COMP.u(t) < 0.85 ? [1, -0.6] : [1, 0]; P.expr = 'o'; return false; });
  THROWS.forEach((th) => {
    tl.pose(th.bag, (S, P, auto, t) => {     // una palla dalla tracolla
      const born = th.bag.at(0.55);
      P.h[0] = KS(t, [[th.bag.a, auto[0]], [th.bag.at(0.35), ['P', -0.12, 0.17], 'io'], [born, ['P', -0.1, 0.2]], [th.bag.b, ['L', 0.5, 0.2], 'out']]);
      P.handNow = 0; P.look = t < born ? [0.2, -0.8] : [1, 0.1]; return false;
    });
    tl.pose(th.toss, toss(0, { rel: 0.42, from: ['L', 0.5, 0.2], to: ['L', 0.66, 0.42], look: [1, 0.1] }));
  });
  tl.pose(ROLL, cheer({ n: 3, hop: 0.08 }));
  tl.pose(BRAKE4, braking(BRAKE4));
  tl.pose(END, (S, P, auto, t) => { P.look = t < END.at(0.5) ? [-0.3, 0.9] : [0.2, 0.1]; P.expr = '^'; return false; });
  tl.pose(tl.part(END, 0.6, 0.9), nod(2));

  // ----- il disegno -----
  const fv = () => formulas();
  const label = (D, x, y, n, k) => { if (k > 0.01) D.glyph(n, x, y, 0.32 * k, COL.soft, { style: '600' }); };
  const holdingBall = (i, t) => t >= THROWS[i].bag.at(0.55) && t < REL[i];
  const pulseAt = [PW1.a, K1.a, K2.a, PW2.a, PC.a, ...REL];
  return {
    ground: { numbers: false },
    init(S) { S.hero.y = BY0; return {}; },
    step(S, t) {
      const p = SK.at(t);
      S.hero.x = p.x; S.hero.y = BY0; S.hero.ride = p.v;
      if (t >= GLIDE3.a && t < COMP.b) S.cam.x = (cartX(Math.min(t, COMP.a)) + L / 2 + p.x) / 2;
      if (t >= THROWS[0].bag.a && t < END.a) S.cam.x = p.x - 0.4;
      if (t >= END.a) S.cam.x = p.x - 1.0;
    },
    back(S, D, t) {
      floor(D, 'binario', WX, 40);
      // il muro
      D.path([[WX, 0], [WX, 2.6], [WX - 0.6, 2.6], [WX - 0.6, 0]], 0.05, CW, { close: true, fill: rgba(CW, 0.22) });
      for (let y = 0.15; y < 2.5; y += 0.3) D.seg([WX - 0.55, y], [WX - 0.05, y + 0.22], 0.022, rgba(CW, 0.6));
      // le frecce dei secondi dopo la spinta del carrello: il carrello va 3 volte più lontano dell'omino
      const al = 1 - prog(t, COMP.b, COMP.b + 0.8);
      if (al > 0 && t >= PC.b) for (const m of secs) {
        if (t < m.t - 1) continue;
        const g = clamp(t - (m.t - 1));
        D.alpha(al, () => {
          D.arrow([m.xc0, MY], [lerp(m.xc0, m.xc, g), MY], 0.06, CV, Math.min(0.22, (m.xc - m.xc0) * g * 0.5));
          if (m.xh0 - m.xh > 0.05) D.arrow([m.xh0, MY - 0.32], [lerp(m.xh0, m.xh, g), MY - 0.32], 0.06, CV, Math.min(0.22, (m.xh0 - m.xh) * g * 0.5));
          if (t >= m.t) { D.seg([m.xc, 0], [m.xc, 0.3 * pop(t, m.t, 0.14)], 0.05, CV); D.seg([m.xh, 0], [m.xh, 0.22 * pop(t, m.t, 0.14)], 0.04, CV); }
        });
      }
      // nel confronto: la freccia corta dell'omino, tre volte una dopo l'altra, sopra quella lunga del carrello
      if (t >= COMP.at(0.25) && al > 0) {
        const m = secs[1], len = m.xh0 - m.xh;
        for (let i = 0; i < 3; i++) { const k = pop(t, COMP.at(0.3 + 0.12 * i)); if (k > 0) D.alpha(0.85 * al, () => D.arrow([m.xc0 + len * i, MY + 0.3], [m.xc0 + len * i + len * k, MY + 0.3], 0.05, CV, 0.18)); }
      }
    },
    front(S, D, t) {
      const x = sk(t);
      // lo skate sotto i piedi
      D.path([[x - 0.42, 0.12], [x + 0.42, 0.12], [x + 0.47, 0.18], [x - 0.47, 0.18]], 0.04, CD, { close: true, fill: rgba(CD, 0.25) });
      for (const wx of [x - 0.28, x + 0.28]) { D.circle(wx, 0.065, 0.065, CD, { w: 0.03, fill: '#000' }); D.seg([wx, 0.065], [wx + 0.05 * Math.cos(-x / 0.065), 0.065 + 0.05 * Math.sin(-x / 0.065)], 0.02, CD); }
      // il carrello leggero
      if (t >= GLIDE2.a) D.alpha(pop(t, GLIDE2.a, 0.5), () => cart(D, cartX(t), CV, { dist: cartX(t) }));
      // le palle: in mano, in volo, per terra
      balls.forEach((b, i) => {
        if (holdingBall(i, t)) { const h = S.J.h[0]; ball(D, h[0], h[1] + 0.12, BR, CD); }
        else if (t >= REL[i]) { const p = b.at(t); ball(D, p[0], p[1], BR, CD, -p[0] / BR); }
      });
      // le coppie di frecce: sulla cosa spinta, e sull'omino (uguali e opposte)
      const chest = [x, BY0 + 1.15];
      for (const [k, len] of [[kW1(t), 0.8], [kW2(t), 1.3]]) if (k > 0) { force(D, [WX + 0.05, 1.5], [WX - len, 1.5], k, CF, 0.09); force(D, [chest[0] - 0.05, chest[1]], [chest[0] + len, chest[1]], k, CF, 0.09); }
      for (const [k, s] of [[kK1(t), K1], [kK2(t), K2]]) if (k > 0) { const fx = sk(s.a) + 0.42; force(D, [fx, 0.05], [fx + 0.6, 0.05], k, CF, 0.07); force(D, [chest[0] + 0.05, chest[1] - 0.3], [chest[0] - 0.6, chest[1] - 0.3], k, CF, 0.07); }
      const kc = kC(t); if (kc > 0) { const c = cartX(t) + L / 2; force(D, [c, 1.25], [c + 0.9, 1.25], kc, CF, 0.09); force(D, [chest[0] + 0.05, chest[1]], [chest[0] - 0.9, chest[1]], kc, CF, 0.09); }
      REL.forEach((r, i) => { const k = kT(i, t); if (k > 0) { const p = balls[i].at(t); force(D, [p[0] - 0.1, p[1]], [p[0] - 1.0, p[1]], k, CF, 0.085); force(D, [chest[0] + 0.18, chest[1] - 0.1], [chest[0] + 1.08, chest[1] - 0.1], k, CF, 0.085); } });
      // la regola: le due frecce della spinta forte salgono in alto, schiena contro schiena
      if (t >= UP) {
        const u = prog(t, UP, DOCK, 'io'), pulse = pulseAt.reduce((s, r) => s + (t > DOCK ? boing(t - r, 0.25) : 0), 0) + boing(t - DOCK, 0.3);
        const c = D.screen(0.5, RV), len = lerp(1.3, RL * D.unit, u) * (1 + 0.35 * pulse), gap = 0.02 * D.unit;
        const a0 = [lerp(WX + 0.05, c[0] - gap, u), lerp(1.5, c[1], u)], b0 = [lerp(x - 0.05, c[0] + gap, u), lerp(BY0 + 1.15, c[1], u)];
        force(D, a0, [a0[0] - len, a0[1]], pop(t, UP - 0.25, 0.25), CF, lerp(0.09, 0.012 * D.unit, u));
        force(D, b0, [b0[0] + len, b0[1]], pop(t, UP - 0.25, 0.25), CF, lerp(0.09, 0.012 * D.unit, u));
      }
      if (fv()) {
        // le etichette: 1 è l'omino, 2 è quello che spinge (il muro, poi il carrello)
        const kl = Math.min(pop(t, PW2.a, 0.3), fade(t, COMP.b, 0.4));
        label(D, x, BY0 + 2.2, '1', kl);
        const two = t < CART_IN.a ? [WX - 0.3, 2.95] : [cartX(t) + L / 2, 1.85];
        label(D, two[0], two[1], '2', kl);
        if (t >= LET) {
          const pulse = pulseAt.reduce((s, r) => s + boing(t - r, 0.25), 0);
          hud.glyph(D, HU.a, FV, FS, 'F₁₂', CF, { k: pop(t, LET) * (1 + 0.3 * pulse) });
          hud.eq(D, HU.e, FV, pop(t, LET + 0.15));
          hud.glyph(D, HU.b, FV, FS, '−F₂₁', CF, { k: pop(t, LET + 0.3) * (1 + 0.3 * pulse) });
        }
      }
    },
  };
});
