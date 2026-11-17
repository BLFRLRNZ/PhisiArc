// Le potenze di 10
// Una scala. A terra il numero è 1. Ogni gradino in su è una moltiplicazione per 10: dal gradino salta fuori uno zero
// che va a mettersi in coda al numero, e l'esponente sale di uno. Tre gradini: 1000 = 10³.
// Ogni gradino in giù è una divisione per 10: lo zero va davanti, con la virgola, e l'esponente scende sotto zero.
// Tre gradini sotto terra: 0,001 = 10⁻³. Alla fine l'omino risale tutta la scala di corsa: è la stessa scala, da un millesimo a mille.
import { COL, EASE, KS, clamp, lerp, prog } from '../toon.js';
import { film, add, mixT, boing, pop, fade, arc, toss, look, cheer, point, hud, comma } from '../toonkit.js';

const SW = 1.25, SH = 0.42;                       // un gradino: largo, alto
const UP = COL.sun, DN = COL.coral;               // i colori del salire e dello scendere
const stepX = (k) => k * SW, stepY = (k) => k * SH;
const VAL = (k) => (k >= 0 ? '1' + '0'.repeat(k) : '0' + comma() + '0'.repeat(-k - 1) + '1');
const NOTE = [262, 294, 330, 392, 440, 523, 587];  // una nota per gradino, dal più basso al più alto

export default film((tl) => {
  const U1 = 0.33, HV = 0.2, DG = 0.06, FS = 0.2;  // il posto dell'1 sullo schermo, l'altezza della riga, il passo fra le cifre, la grandezza
  const hops = [];                                 // tutti i salti: { a, b, from, to }
  let lev = 0;
  const hop = (to, ant, jump, rest) => {
    tl.flag('ant', tl.span(ant));
    const j = tl.jump(tl.span(jump), stepX(to), { h: to > lev ? 0.5 : 0.3, y1: stepY(to) });
    const h = { a: j.a, b: j.b, from: lev, to }; hops.push(h); lev = to;
    return { ...h, rest: tl.span(rest) };
  };

  tl.start(0, 1, { follow: 0.5, followY: 0, zm: 1.05, k: 2.4 });
  const INTRO = tl.span(1.2);
  const BAG = tl.span(1.7);                        // tira fuori l'1 dalla tracolla
  const TOSS = tl.span(1.3);                       // e lo lancia in alto: è il numero di partenza
  const U = [hop(1, 0.25, 0.5, 2.5), hop(2, 0.25, 0.5, 2.5), hop(3, 0.25, 0.5, 1.6)];
  tl.face(tl.now, -1);
  const SHOW3 = tl.span(6);                        // tre gradini, tre zeri, esponente 3
  const DOWN = [hop(2, 0.2, 0.42, 0.7), hop(1, 0.2, 0.42, 0.7), hop(0, 0.2, 0.42, 0.6)];
  const ZERO = tl.span(2.4);                       // di nuovo a terra: 1, cioè 10 alla zero
  const N = [hop(-1, 0.25, 0.45, 2.6), hop(-2, 0.25, 0.45, 2.6), hop(-3, 0.25, 0.45, 1.6)];
  tl.face(tl.now, 1);
  const SHOWM = tl.span(6);                        // tre gradini in giù, tre zeri davanti, esponente −3
  const RUNUP = [-2, -1, 0, 1, 2, 3].map((k) => hop(k, 0.12, 0.36, 0.14));
  tl.face(tl.now, -1);
  const WIDE = tl.span(2.6);
  const END = tl.span(4.6);
  tl.cam(RUNUP[0].a, { follow: 0.8, followY: 0, zm: 0.98, k: 3.4 });
  tl.cam(WIDE.a, { x: -0.35, y: -0.9, zm: 0.84, k: 1.6, kz: 1.4 });

  const BORN = BAG.at(0.45);
  const one = tl.chip({ str: '1', col: COL.ink, up: true, size: 0.7, born: BORN, at: (S) => add(S.J.h[0], [0, 0.27]), go: TOSS.at(0.4), fly: 0.6, h: 0.5, slot: { u: U1, v: HV, frac: FS } });
  const level = (t) => { let k = 0; for (const h of hops) if (t >= h.b) k = h.to; return k; };
  // uno zero del numero: quando è arrivato (dal suo gradino) o se n'è andato; il numero cambia sempre all'atterraggio, insieme all'esponente
  const zero = (k, t) => { let st = null; for (const h of hops) { if (h.to === k && Math.abs(h.from) < Math.abs(k) && t >= h.b) st = { on: true, t0: h.b }; if (h.from === k && Math.abs(h.to) < Math.abs(k) && t >= h.b) st = { on: false, t0: h.b }; } return st; };
  // quanti zeri ci sono dopo la virgola, con il passaggio morbido
  const after = (t) => { let n = 0; for (const k of [-2, -3]) { const z = zero(k, t); if (z) n += z.on ? prog(t, z.t0, z.t0 + 0.3) : 1 - prog(t, z.t0, z.t0 + 0.3); } return n; };

  // ----- quello che succede a ogni atterraggio -----
  for (const h of hops) {
    const up = h.to > h.from, away = Math.abs(h.to) > Math.abs(h.from), fast = RUNUP.some((r) => r.b === h.b);
    tl.on(h.b, (S) => {
      S.snd.tone(NOTE[h.to + 3], NOTE[h.to + 3], fast ? 0.18 : 0.34, 0.1, 'triangle');
      S.burst([stepX(h.to), stepY(h.to) + 0.1], 6, 4, 0.35, up ? UP : DN, { up: 1 });
      if (away && !fast) S.snd.noise(0.2, 0.04, 500, 2200, 0.05);
    });
    if (away) tl.on(h.b + 0.5, (S) => S.snd.tick(up ? 1320 : 880, 0.06));
  }
  tl.on(BORN, (S) => { S.snd.tone(700, 320, 0.1, 0.09, 'square'); S.snd.tone(260, 520, 0.14, 0.07, 'sine', 0.08); });
  tl.on(one.go, (S) => S.snd.noise(0.2, 0.05, 500, 2200));
  tl.on(one.dock, (S) => S.snd.tone(880, 1320, 0.12, 0.06, 'triangle'));
  // il conto: uno, due, tre
  const CNT3 = [0, 1, 2].map((i) => SHOW3.at(0.2 + 0.13 * i)), CNTM = [0, 1, 2].map((i) => SHOWM.at(0.2 + 0.13 * i));
  CNT3.forEach((c, i) => tl.on(c, (S) => S.snd.tone(NOTE[4 + i], NOTE[4 + i], 0.3, 0.09, 'triangle')));
  CNTM.forEach((c, i) => tl.on(c, (S) => S.snd.tone(NOTE[2 - i], NOTE[2 - i], 0.3, 0.09, 'triangle')));
  tl.on(SHOW3.at(0.66), (S) => { S.snd.chime([784, 1047], 0.09, 0.09); });
  tl.on(SHOWM.at(0.66), (S) => { S.snd.chime([392, 330], 0.09, 0.09); });
  tl.on(WIDE.at(0.5), (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  tl.pose(INTRO, look(1, 0.3));
  tl.pose(BAG, (S, P, auto, t) => {
    P.h[0] = KS(t, [[BAG.a, auto[0]], [BAG.at(0.28), ['P', -0.12, 0.17], 'io'], [BORN, ['P', -0.1, 0.2]], [BAG.at(0.78), ['L', 0.58, 0.14], 'out'], [BAG.b, ['L', 0.58, 0.14]]]);
    P.handNow = 0; P.look = t < BORN + 0.1 ? [0.2, -0.8] : [0.9, 0.35]; P.lean = 10 * prog(t, BAG.a, BAG.at(0.28)) * (1 - prog(t, BORN, BAG.at(0.7))); P.leanNow = true;
    return false;
  });
  tl.pose(TOSS, toss(0, { rel: 0.4, look: [0.2, 0.95] }));
  // dopo ogni gradino guarda il numero in alto, poi il gradino che viene
  for (const h of [...U, ...N]) tl.pose(h.rest, (S, P, auto, t) => { P.look = h.rest.u(t) < 0.6 ? [0.25, 0.95] : [1, h.to > 0 ? 0.3 : -0.4]; return false; });
  tl.pose(ZERO, look(0.25, 0.95));
  // indica i tre gradini, uno alla volta
  tl.pose(tl.part(SHOW3, 0.12, 0.62), point(0, (S, t) => { const i = clamp(Math.floor((t - CNT3[0]) / (CNT3[1] - CNT3[0])), 0, 2); return [stepX(i + 0.5), stepY(i + 1) + 0.3]; }, { len: 0.6 }));
  tl.pose(tl.part(SHOW3, 0.62, 1), look(0.2, 0.95, '^'));
  tl.pose(tl.part(SHOWM, 0.12, 0.62), point(0, (S, t) => { const i = clamp(Math.floor((t - CNTM[0]) / (CNTM[1] - CNTM[0])), 0, 2); return [stepX(-i - 0.5), stepY(-i) + 0.5]; }, { len: 0.6 }));
  tl.pose(tl.part(SHOWM, 0.62, 1), look(0.2, 0.95, 'O'));
  tl.pose(tl.part(WIDE, 0.3, 1), cheer({ n: 3 }));
  tl.pose(END, (S, P, auto, t) => {
    const k = prog(t, END.at(0.1), END.at(0.22), 'out');
    P.h[0] = mixT(auto[0], ['L', 0.46, 0.5], k); P.h[1] = mixT(auto[1], ['P', -0.13, 0.04], k); P.handNow = true;
    P.look = t < END.at(0.5) ? [0.8, 0.8] : [0.15, 0.1]; P.expr = '^';
    return false;
  });

  // ----- il disegno -----
  const stairs = [[stepX(-3.5) - 9, stepY(-3)]];
  for (let k = -3; k <= 3; k++) { stairs.push([stepX(k + 0.5), stepY(k)]); if (k < 3) stairs.push([stepX(k + 0.5), stepY(k + 1)]); }
  stairs[stairs.length - 1] = [stepX(3.5) + 9, stepY(3)];
  const seen = (k, t) => { if (k === 0) return 0; for (const h of hops) if (h.to === k) return h.b; return 1e9; };   // quando un gradino è stato toccato la prima volta
  const visits = (k) => hops.filter((h) => h.to === k).map((h) => h.b);
  const bumps = (list, t, amp = 0.3) => list.reduce((s, c) => s + boing(t - c, amp, 18, 8), 0);

  return {
    ground: { hide: true },
    back(S, D, t) {
      D.path(stairs, 0.045, COL.ink);
      D.seg([stepX(-0.5), 0], [stepX(0.5), 0], 0.07, COL.ink);                        // il gradino di terra, più marcato
      for (let k = -3; k <= 3; k++) {
        const t0 = seen(k, t); if (t < t0) continue;
        // sotto ogni gradino toccato resta scritto quanto vale
        D.wtext(VAL(k), stepX(k), stepY(k) - 0.24, 0.25 * pop(t, t0), k === 0 ? COL.ink : COL.soft, { style: '600' });
        if (k === 0) continue;
        // e sotto l'alzata, il passo che si fa: per 10 a salire, diviso 10 a scendere
        const up = k > 0, x = stepX(k + (up ? -0.5 : 0.5)), y = stepY(up ? k - 1 : k) - 0.62, vs = visits(k);
        const cnt = up ? bumps(CNT3.slice(k - 1, k), t, 0.5) : bumps(CNTM.slice(-k - 1, -k), t, 0.5);
        const fresh = Math.max(...vs.map((c) => (t >= c ? fade(t, c + 1.2, 0.6) : 0)), cnt > 0.02 ? 1 : 0, t >= WIDE.a ? 1 : 0);
        D.glyph(up ? '×10' : '÷10', x, y, 0.27 * pop(t, t0) * (1 + bumps(vs, t, 0.25) + cnt), up ? UP : DN, { style: '600', alpha: lerp(0.5, 1, fresh) });
      }
    },
    front(S, D, t) {
      const k = level(t);
      one.draw(S, D, t, { bump: bumps(hops.map((h) => h.b), t, 0.12) });
      if (t < one.dock) return;
      // gli zeri a destra dell'1: uno per ogni gradino salito
      for (let i = 1; i <= 3; i++) {
        const z = zero(i, t); if (!z) continue;
        const slot = D.screen(U1 + DG * i, HV), src = [stepX(i), stepY(i) + 0.3], sz = FS * D.unit, u = (t - z.t0) / (z.on ? 0.5 : 0.4);
        if (z.on) { const p = u < 1 ? arc(src, slot, u, 0.6) : slot; D.glyph('0', p[0], p[1], (u < 1 ? lerp(0.4, sz, EASE.io(u)) : sz * (1 + boing(t - z.t0 - 0.5))) * (1 + bumps(CNT3.slice(i - 1, i), t, 0.4)), UP, { style: '600' }); }
        else if (u < 1) { const p = arc(slot, src, u, 0.4); D.glyph('0', p[0], p[1], lerp(sz, 0.3, u), UP, { style: '600', alpha: 1 - u * u }); }
      }
      // gli zeri a sinistra: il primo sta davanti alla virgola, gli altri dopo
      const n = after(t), z1 = zero(-1, t);
      if (z1) {
        const u = (t - z1.t0) / (z1.on ? 0.5 : 0.4), a = z1.on ? 1 : 1 - clamp(u), sz = FS * D.unit;
        const lead = D.screen(U1 - DG * n - 0.076, HV), src = [stepX(-1), stepY(-1) + 0.3];
        const p = z1.on && u < 1 ? arc(src, lead, u, 0.6) : !z1.on && u < 1 ? arc(lead, src, u, 0.4) : lead;
        if (z1.on || u < 1) {
          D.glyph('0', p[0], p[1], (z1.on && u < 1 ? lerp(0.4, sz, EASE.io(u)) : sz * (1 + boing(t - z1.t0 - 0.5))) * (1 + bumps(CNTM.slice(0, 1), t, 0.4)), DN, { style: '600', alpha: a });
          const c = D.screen(U1 - DG * n - 0.038, HV); D.glyph(comma(), c[0], c[1], sz * pop(t, z1.t0 + 0.3), COL.ink, { style: '600', alpha: a });
        }
      }
      for (let j = 2; j <= 3; j++) {
        const z = zero(-j, t); if (!z) continue;
        const slot = D.screen(U1 - DG * (j - 1), HV), src = [stepX(-j), stepY(-j) + 0.3], sz = FS * D.unit, u = (t - z.t0) / (z.on ? 0.5 : 0.4);
        if (z.on) { const p = u < 1 ? arc(src, slot, u, 0.6) : slot; D.glyph('0', p[0], p[1], (u < 1 ? lerp(0.4, sz, EASE.io(u)) : sz * (1 + boing(t - z.t0 - 0.5))) * (1 + bumps(CNTM.slice(j - 1, j), t, 0.4)), DN, { style: '600' }); }
        else if (u < 1) { const p = arc(slot, src, u, 0.4); D.glyph('0', p[0], p[1], lerp(sz, 0.3, u), DN, { style: '600', alpha: 1 - u * u }); }
      }
      // a destra: lo stesso numero scritto corto, 10 con l'esponente
      const E0 = one.dock + 0.5; if (t < E0) return;
      hud.eq(D, 0.59, HV, pop(t, E0));
      hud.glyph(D, 0.685, HV, FS, '10', COL.ink, { style: '600', k: pop(t, E0 + 0.1) });
      const last = Math.max(E0 + 0.2, ...hops.filter((h) => t >= h.b).map((h) => h.b)), big = bumps([SHOW3.at(0.66), SHOWM.at(0.66)], t, 0.6);
      hud.glyph(D, 0.765 + (k < 0 ? 0.012 : 0), HV - 0.085, 0.125, k < 0 ? '−' + -k : String(k), k > 0 ? UP : k < 0 ? DN : COL.ink, { style: '600', k: pop(t, last, 0.2) * (1 + big) });
    },
  };
});
