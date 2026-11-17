// Seno e coseno
// Una freccia lunga 1, con il piede contro un muro. Una luce dall'alto ne fa l'ombra per terra, una luce di fianco
// ne fa l'ombra sul muro. L'omino la alza per la punta: a 30° l'ombra sul muro arriva giusto a metà, a 45° le due
// ombre sono uguali. Poi una spinta: a 90° la freccia è tutta in piedi e per terra non c'è più ombra.
// L'ombra per terra si chiama coseno, quella sul muro seno. Per una freccia lunga v le ombre sono v·cos θ e v·sin θ.
import { COL, EASE, RIG, clamp, lerp, prog } from '../toon.js';
import { film, mixT, boing, pop, dashed, look, hud, num } from '../toonkit.js';

const L = 2.4;                                     // la freccia lunga 1, in metri del mondo
const OFF = 0.4;                                   // quanto l'omino sta più in là della punta, mentre la tiene
const CV = COL.sky, CX = COL.mint, CY = COL.coral; // la freccia, l'ombra per terra, l'ombra sul muro
const rad = (d) => (d * Math.PI) / 180;

export default film((tl) => {
  const ROWS = [0.085, 0.2, 0.315], FS = 0.115, UL = 0.688, UT = 0.745, UE = 0.812, UV = 0.905;

  tl.start(5.2, -1, { x: 1.9, zm: 1 });
  const ENTER = tl.walk(L + OFF, 1.5);
  const LAMP1 = tl.span(2.4);                      // la luce dall'alto: l'ombra per terra
  const X30 = L * Math.cos(rad(30)) + OFF, X45 = L * Math.cos(rad(45)) + OFF, X37 = L * Math.cos(rad(37)) + OFF;
  const AREL = 45 + 45 * EASE.out((0.34 - 0.3) / 0.6), XREL = L * Math.cos(rad(AREL)) + OFF;     // dove si trova quando lascia la punta
  const LIFT30 = tl.move(tl.span(3.2), X30, 'io', 0.3, 0.9);          // alza la punta fino a 30°
  const LAMP2 = tl.span(2.2);                      // la luce di fianco: l'ombra sul muro
  const NAME = tl.span(5.4);                       // i nomi delle due ombre, e quanto valgono
  const LIFT45 = tl.move(tl.span(2.4), X45, 'io', 0.15, 0.9);
  const SEE45 = tl.span(2.8);
  const PUSH = tl.move(tl.span(2.2), XREL, 'lin', 0.3, 0.34);         // una spinta: la freccia va su fino a 90°
  const BACK = tl.walk(3.05, 1.2);                 // due passi indietro
  tl.face(BACK.a, -1);
  const SEE90 = tl.span(2.2);
  const FALL = tl.span(3.0);                       // ricade: 0°
  const SEE0 = tl.span(1.8);
  const WV = tl.walk(L + OFF, 1.3);
  const VGRAB = tl.move(tl.span(3.0), X37, 'io', 0.4, 0.95);          // la riprende: 37°
  const STRETCH = tl.move(tl.span(3.0), 1.3 * (X37 - OFF) + OFF, 'io', 0.25, 0.85);   // la tira: più lunga, le ombre crescono insieme
  tl.face(STRETCH.at(0.25), -1);
  const VNAME = tl.span(5.0);                      // v, v·cos θ, v·sin θ
  const CHEER = tl.span(2.2);
  const END = tl.span(5.0);

  // l'angolo (in gradi) e la lunghezza della freccia, istante per istante
  const ang = (t) => 30 * prog(t, LIFT30.at(0.3), LIFT30.at(0.9)) + 15 * prog(t, LIFT45.at(0.15), LIFT45.at(0.9)) + 45 * prog(t, PUSH.at(0.3), PUSH.at(0.9), 'out')
    - 90 * prog(t, FALL.at(0.25), FALL.at(0.8), 'in') + 5 * Math.sin(Math.PI * prog(t, FALL.at(0.8), FALL.b, 'lin')) + 37 * prog(t, VGRAB.at(0.4), VGRAB.at(0.95));
  const len = (t) => L * (1 + 0.3 * prog(t, STRETCH.at(0.25), STRETCH.at(0.85)));
  const tip = (t) => { const a = rad(ang(t)), l = len(t); return [l * Math.cos(a), l * Math.sin(a)]; };
  const G1 = LIFT30.at(0.26), REL = PUSH.at(0.34), G2 = VGRAB.at(0.34);       // prende la punta, la lascia, la riprende
  const holding = (t) => (t >= G1 && t < REL) || t >= G2;
  const ON1 = LAMP1.at(0.3), ON2 = LAMP2.at(0.3);
  const N = [0, 1, 2, 3].map((i) => NAME.at(0.08 + 0.2 * i));                   // θ; l'ombra per terra: cos θ; l'ombra sul muro: sin θ; i numeri
  const VN = [0, 1, 2].map((i) => VNAME.at(0.1 + 0.2 * i));

  // ----- quello che succede -----
  const lamp = (S) => { S.snd.tick(1500, 0.06); S.snd.tone(660, 990, 0.18, 0.07, 'triangle'); };
  tl.on(ON1, lamp); tl.on(ON2, lamp);
  tl.on(G1, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.snd.tone(160, 420, 1.8, 0.05, 'triangle', 0.1); });
  tl.on(LIFT30.at(0.9), (S) => { S.snd.chime([784, 1047], 0.08, 0.08); });
  N.forEach((c, i) => tl.on(c, (S) => S.snd.tone([523, 659, 784, 1047][i], [523, 659, 784, 1047][i], 0.3, 0.08, 'triangle')));
  tl.on(LIFT45.at(0.15), (S) => S.snd.tone(300, 500, 1.6, 0.05, 'triangle'));
  tl.on(LIFT45.at(0.9), (S) => S.snd.chime([659, 659], 0.08, 0.12));
  tl.on(PUSH.at(0.3), (S) => { S.snd.noise(0.3, 0.08, 500, 2600); S.snd.tone(300, 900, 0.4, 0.06); });
  tl.on(PUSH.at(0.9), (S) => { S.snd.tone(150, 70, 0.14, 0.14); S.snd.noise(0.08, 0.07, 800, 200); S.kick({ shake: 0.05 }); S.burst([0, L], 7, 4, 0.35, CV); });
  tl.on(PUSH.at(0.95), (S) => S.snd.tone(440, 330, 0.25, 0.07, 'triangle'));
  tl.on(FALL.at(0.25), (S) => S.snd.tone(700, 200, 1.5, 0.05, 'triangle'));
  tl.on(FALL.at(0.8), (S) => { S.snd.boom(0.14); S.dust(L * 0.7, 0, 9, 6); S.ripple(L * 0.7, 0, 0.1); S.kick({ shake: 0.1 }); });
  tl.on(G2, (S) => { S.snd.tone(520, 780, 0.12, 0.08, 'triangle'); S.snd.tone(160, 460, 1.6, 0.05, 'triangle', 0.1); });
  tl.on(STRETCH.at(0.25), (S) => S.snd.tone(110, 240, 1.7, 0.05, 'sawtooth'));
  tl.on(STRETCH.at(0.85), (S) => S.snd.tick(900, 0.07));
  VN.forEach((c, i) => tl.on(c, (S) => S.snd.tone([659, 784, 1047][i], [659, 784, 1047][i], 0.3, 0.08, 'triangle')));
  tl.on(CHEER.a, (S) => S.snd.chime([523, 659, 784, 1047], 0.09, 0.09));

  // ----- i gesti -----
  tl.pose(LAMP1, look(0.6, 0.9));
  // tiene la punta della freccia: se è bassa si piega sulle gambe
  const hold = (S, P, auto, t, k) => {
    const p = tip(t), low = clamp((0.8 - p[1]) / 0.7) * k;
    P.py = lerp(RIG.STAND, 0.33, low); P.lean = 55 * low; P.head = -0.4 * P.lean;
    P.h[0] = k >= 0.999 ? ['W', p[0], p[1]] : mixT(auto[0], ['W', p[0], p[1]], k);
    P.look = [0.9, p[1] < 0.6 ? -0.7 : 0.1];
    return true;
  };
  tl.pose(LIFT30, (S, P, auto, t) => hold(S, P, auto, t, prog(t, LIFT30.a, G1 - 0.02, 'out')));
  tl.pose(tl.between(LIFT30.b, PUSH.a), (S, P, auto, t) => { hold(S, P, auto, t, 1); if (LAMP2.has(t)) P.look = [1, 0.4]; if (NAME.has(t)) P.look = [0.3, 0.9]; if (SEE45.has(t)) { P.look = [1, SEE45.u(t) < 0.5 ? -0.5 : 0.3]; P.expr = 'O'; } return true; });
  tl.pose(PUSH, (S, P, auto, t) => {               // carica e spinge in su
    if (t < REL) { hold(S, P, auto, t, 1); P.lean = -8 * prog(t, PUSH.a, PUSH.at(0.28)) + 20 * prog(t, PUSH.at(0.28), REL); return true; }
    P.h[0] = mixT(['L', 0.44, 0.56], auto[0], prog(t, REL + 0.2, PUSH.b)); P.handNow = 0; P.lean = 12 * (1 - prog(t, REL, PUSH.b)); P.leanNow = true; P.look = [0.7, 0.9];
    return false;
  });
  tl.pose(BACK, look(0.8, 0.9, 'O')); tl.pose(SEE90, look(0.8, 0.9, 'O'));
  tl.pose(FALL, (S, P, auto, t) => { const p = tip(t); P.look = [1, clamp((p[1] - 1.3) / 1.2, -0.8, 0.9)]; P.expr = FALL.u(t) > 0.78 ? '>' : 'o'; return false; });
  tl.pose(SEE0, look(1, -0.6));
  tl.pose(VGRAB, (S, P, auto, t) => hold(S, P, auto, t, prog(t, VGRAB.a, G2 - 0.02, 'out')));
  tl.pose(tl.between(VGRAB.b, CHEER.a), (S, P, auto, t) => { hold(S, P, auto, t, 1); if (STRETCH.has(t)) { P.lean = -10 * Math.sin(Math.PI * prog(t, STRETCH.at(0.2), STRETCH.at(0.9), 'lin')); P.expr = '>'; } if (VNAME.has(t)) P.look = [0.3, 0.9]; return true; });
  tl.pose(CHEER, (S, P, auto, t) => { hold(S, P, auto, t, 1); P.h[1] = mixT(auto[1], ['L', -0.2, 0.68], Math.min(1, 1.8 * Math.sin(Math.PI * CHEER.u(t)))); P.handNow = true; P.hop = 0.14 * Math.abs(Math.sin(Math.PI * 3 * CHEER.u(t))); P.expr = '^'; return true; });
  tl.pose(END, (S, P, auto, t) => { hold(S, P, auto, t, 1); P.look = t < END.at(0.45) ? [0.3, 0.9] : [0.15, 0.1]; P.expr = '^'; return true; });

  // un nome scritto bene: «cos» dritto e θ in corsivo, con davanti (se serve) v ·
  const name = (D, fn, x, y, s, col, o = {}) => {
    const a = o.alpha ?? 1, w = s * 0.5;
    if (o.v) { D.glyph('v', x - w * 2.95, y, s, CV, { alpha: a }); D.glyph('·', x - w * 2.2, y, s, col, { style: '600', alpha: a }); }
    D.glyph(fn, x - w * 0.42, y, s, col, { style: '600', alpha: a }); D.glyph('θ', x + w * 1.7, y, s, col, { alpha: a });
  };
  const sun = (D, x, y, on, k) => { const c = on ? COL.sun : COL.dim; D.circle(x, y, 0.15 * k, c, { w: 0.04, fill: on ? 'rgba(255, 209, 102, .35)' : null }); for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; D.seg([x + 0.24 * Math.cos(a), y + 0.24 * Math.sin(a)], [x + (on ? 0.36 : 0.3) * k * Math.cos(a), y + (on ? 0.36 : 0.3) * k * Math.sin(a)], 0.03, c); } };

  return {
    ground: { ticks: false },
    step(S, t) { if (holding(t)) S.hero.x = tip(t)[0] + OFF; },       // finché tiene la punta, le sta accanto
    back(S, D, t) {
      const p = tip(t), a = rad(ang(t)), on1 = t >= ON1, on2 = t >= ON2;
      // il muro, con le tacche a metà e a 1; le stesse tacche per terra
      D.seg([0, 0], [0, 3.3], 0.045, COL.ink);
      for (const f of [0.5, 1]) { D.seg([-0.09, L * f], [0.09, L * f], 0.03, COL.soft); D.seg([L * f, -0.09], [L * f, 0.09], 0.03, COL.soft); D.wtext(num(f), -0.3, L * f, 0.2, COL.dim, { style: '600' }); D.wtext(num(f), L * f, -0.27, 0.2, COL.dim, { style: '600' }); }
      // le due luci, e i loro raggi
      sun(D, 1.2, 3.72, on1, 1 + boing(t - ON1, 0.5)); sun(D, 6.1, 1.2, on2, 1 + boing(t - ON2, 0.5));
      if (on1) D.alpha(0.1, () => { for (const x of [0.4, 1, 1.6, 2.2, 2.8]) D.seg([x, 3.4], [x, 0], 0.02, COL.sun); });
      if (on2) D.alpha(0.1, () => { for (const y of [0.4, 1, 1.6, 2.2, 2.8]) D.seg([5.8, y], [0, y], 0.02, COL.sun); });
      // le ombre: per terra e sul muro, e le righe che scendono dalla punta
      if (on1) { const k = pop(t, ON1, 0.3); if (p[0] > 0.03) D.seg([0, 0.035], [p[0] * k, 0.035], 0.11, CX); if (p[1] > 0.08) dashed(D, p, [p[0], 0.06], CX, { w: 0.025 }); }
      if (on2) { const k = pop(t, ON2, 0.3); if (p[1] > 0.03) D.seg([-0.035, 0], [-0.035, p[1] * k], 0.11, CY); if (p[0] > 0.08) dashed(D, p, [0.06, p[1]], CY, { w: 0.025 }); }
      // l'angolo
      if (t >= N[0] && a > 0.05) { const pts = []; for (let i = 0; i <= 12; i++) pts.push([0.62 * Math.cos((a * i) / 12), 0.62 * Math.sin((a * i) / 12)]); D.path(pts, 0.03, CV); D.glyph('θ', 0.92 * Math.cos(a / 2), 0.92 * Math.sin(a / 2), 0.3 * pop(t, N[0]), CV); }
      // la freccia, e quanto è lunga
      D.arrow([0, 0], p, 0.075, CV, 0.28);
      const side = clamp((a - 1) / 0.3), m = [p[0] * 0.55 + lerp(-0.24 * Math.sin(a), 0.28, side), p[1] * 0.55 + lerp(0.24 * Math.cos(a), 0, side)], isV = t >= VN[0];   // il numero sta sopra la freccia; quando è quasi in piedi, a destra
      D.glyph(isV ? 'v' : '1', m[0], m[1], isV ? 0.42 * (1 + boing(t - VN[0], 0.5)) : 0.32, CV, { style: isV ? 'italic 600' : '600' });
      // i nomi delle ombre, accanto alle ombre
      if (t >= N[1] && p[0] > 0.5) name(D, 'cos', p[0] / 2 + 0.1, -0.66, 0.36 * pop(t, N[1]) * (1 + boing(t - VN[1], 0.4)), CX, { v: t >= VN[1] });
      if (t >= N[2] && p[1] > 0.4) name(D, 'sin', -0.98, p[1] / 2 + 0.12, 0.36 * pop(t, N[2]) * (1 + boing(t - VN[2], 0.4)), CY, { v: t >= VN[2] });
    },
    front(S, D, t) {
      // sullo schermo: l'angolo, e quanto valgono le due ombre di una freccia lunga 1 (dipendono solo dall'angolo)
      const d = ang(t), a = rad(d), hit = 1 + boing(t - LIFT30.at(0.9), 0.25) + boing(t - LIFT45.at(0.9), 0.25) + boing(t - PUSH.at(0.9), 0.3) + boing(t - FALL.at(0.8), 0.3);
      const row = (i, t0, draw, val, col) => {
        if (t < t0) return;
        draw(pop(t, t0)); hud.eq(D, UE, ROWS[i], pop(t, t0 + 0.1));
        if (t >= N[3] || i === 0) hud.glyph(D, UV, ROWS[i], FS, val, col, { style: '600', k: pop(t, i === 0 ? t0 + 0.15 : N[3]) * hit });
      };
      row(0, N[0], (k) => hud.glyph(D, UT, ROWS[0], FS, 'θ', CV, { k }), Math.round(d) + '°', CV);
      row(1, N[1], (k) => { const p = D.screen(UL + 0.012, ROWS[1]); name(D, 'cos', p[0], p[1], FS * D.unit * k, CX); }, num(Math.cos(a), 2), CX);
      row(2, N[2], (k) => { const p = D.screen(UL + 0.012, ROWS[2]); name(D, 'sin', p[0], p[1], FS * D.unit * k, CY); }, num(Math.sin(a), 2), CY);
    },
  };
});
