// Gli attrezzi del regista. Un film lungo si scrive come una fila di battute: ogni battuta ha un inizio e una fine,
// e chi scrive la scena non conta i secondi a mano. Qui ci sono la fila delle battute (film), i gesti che tornano
// in ogni film (prendere, portare, lanciare, indicare, esultare) e qualche aiuto per disegnare.
//
//   export default film((tl) => {
//     tl.start(0, 1, { x: 1, zm: 1.2 });                 // dove comincia l'omino, da che parte guarda, la telecamera
//     const A = tl.span(2);                               // una battuta di due secondi: A.a, A.b, A.has(t), A.u(t), A.at(0.5)
//     const B = tl.walk(4);                               // cammina fino a x = 4: la battuta dura quanto serve
//     tl.pose(tl.span(1.2), grab(0, [4.4, 0.1]));         // un gesto vale per la sua battuta
//     tl.on(B.b, (S) => S.snd.tick());                    // una cosa che succede in un istante
//     return { init, step, pose, back, front, ground };   // quello che la scena ha di suo (tutto facoltativo)
//   });
//
// I film delle lezioni li vedono anche gli Esploratori: prima di disegnare lettere o formule si chiede formulas().
import { COL, EASE, KN, KS, clamp, lerp, RIG } from './toon.js';

export const rad = (d) => (d * Math.PI) / 180;
export const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
export const mixP = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
// due bersagli per una mano o un piede, mescolati
export const mixT = (a, b, u) => (u <= 0.001 ? a : u >= 0.999 ? b : { a, b, u });
// lo scatto di una cosa appena arrivata al suo posto: si gonfia e torna, come una molla
export const boing = (tau, amp = 0.32, f = 20, d = 9) => (tau < 0 ? 0 : amp * Math.exp(-d * tau) * Math.cos(f * tau));
// da 0 a 1 con un piccolo rimbalzo, a partire da t0
export const pop = (t, t0, d = 0.24) => (t < t0 ? 0 : EASE.back(clamp((t - t0) / d)));
// da 1 a 0 fra t0 e t0 + d
export const fade = (t, t0, d = 0.3) => 1 - clamp((t - t0) / d);
// un volo ad arco da p0 a p1 (u da 0 a 1), alto h a metà strada
export const arc = (p0, p1, u, h = 0.5) => { const e = EASE.io(clamp(u)); return [lerp(p0[0], p1[0], e), lerp(p0[1], p1[1], e) + h * Math.sin(Math.PI * clamp(u))]; };
export const bez = (p0, c, p1, u) => [(1 - u) * (1 - u) * p0[0] + 2 * u * (1 - u) * c[0] + u * u * p1[0], (1 - u) * (1 - u) * p0[1] + 2 * u * (1 - u) * c[1] + u * u * p1[1]];
// un colore con la sua trasparenza
export const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };
// i numeri con la virgola o con il punto, secondo la lingua del gioco
let locale = 'it-IT';
export const setLocale = (l) => { locale = l; };
export const num = (x, d = 2) => Number(x).toLocaleString(locale, { maximumFractionDigits: d, useGrouping: false });
export const comma = () => (0.5).toLocaleString(locale).charAt(1);
// la lente di chi guarda: i film delle lezioni li vedono tutti, ma lettere e formule sullo schermo no per l'Esploratore
let lensNow = 's';
export const setLens = (l) => { lensNow = l || 's'; };
export const lens = () => lensNow;
export const formulas = () => lensNow !== 'e';

// ---------- la fila delle battute ----------
export function film(build) {
  let now = 0, x = 0, chips = 0;
  const ev = [], xs = [], faces = [], cams = [], poses = [], flags = { ant: [], brake: [], heavy: [] };
  const mk = (a, b) => { const s = { a, b, d: b - a }; s.has = (t) => t >= s.a && t < s.b; s.u = (t, e = 'lin') => EASE[e](clamp((t - s.a) / s.d)); s.at = (k) => s.a + k * s.d; return s; };
  const span = (d) => { const s = mk(now, now + d); now += d; return s; };
  const tl = {
    span,
    // un pezzo di una battuta (fra due sue frazioni), o un intervallo fra due istanti: non sposta il tempo
    part: (s, k0, k1) => mk(s.at(k0), s.at(k1)),
    between: mk,
    get now() { return now; },
    get x() { return x; },
    start(x0, face = 1, cam = null) { x = x0; xs.push([0, x0]); faces.push([0, face]); if (cam) cams.push([0, cam]); },
    // l'omino va a x1 durante la battuta s (o fra due sue frazioni); si gira da solo nel verso del moto
    move(s, x1, ease = 'io', from = 0, to = 1) { xs.push([s.at(from), x], [s.at(to), x1, ease]); if (x1 !== x) faces.push([s.at(from), x1 > x ? 1 : -1]); x = x1; return s; },
    // una battuta lunga quanto serve per arrivare a x1 a quella velocità (metri al secondo)
    walk(x1, speed = 1.4, ease = 'io') { return tl.move(span(Math.max(0.35, Math.abs(x1 - x) / speed)), x1, ease); },
    face(t, dir) { faces.push([t, dir]); },
    cam(t, c) { cams.push([t, c]); },
    on(t, fn) { ev.push([t, fn]); },
    flag(name, s) { flags[name].push([s.a, s.b]); return s; },
    pose(s, fn) { poses.push([s, fn]); return s; },
    // un salto lungo quanto la battuta; prima conviene una battuta corta con flag('ant', …) per la rincorsa
    jump(s, x1, o = {}) {
      ev.push([s.a, (S) => S.jump({ to: x1, T: s.d, h: o.h ?? 0.6, y1: o.y1 ?? S.hero.y, flip: o.flip, long: o.long })]);
      xs.push([s.a, x], [s.b, x1, 'lin']); if (x1 !== x && !o.keepFace) faces.push([s.a, x1 > x ? 1 : -1]); x = x1; return s;
    },
    // Una lettera o un numero che nasce in un punto del mondo, vola e si ferma al suo posto.
    //   str: il testo, o una funzione (S, t) per i numeri che cambiano;  col;  up: cifre dritte (le lettere sono in corsivo)
    //   born: quando compare;  at: (S, t) → dove sta prima di partire;  size: altezza nel mondo, in metri
    //   go: quando parte;  fly: quanto dura il volo;  h: altezza dell'arco;  spin: gira su se stessa mentre vola
    //   slot: { u, v, frac } un posto dello schermo (frac: altezza, in frazione dello schermo), oppure { x, y, size } un posto del mondo
    chip(o) {
      const c = { fly: 0.5, h: 0.5, ...o, id: chips++ };
      if (c.go !== undefined) { c.dock = c.go + c.fly; ev.push([c.go, (S, t) => { (S.v.chip || (S.v.chip = {}))[c.id] = c.at(S, t); }]); }
      c.end = (D) => (c.slot.u !== undefined ? D.screen(c.slot.u, c.slot.v) : [c.slot.x, c.slot.y]);
      c.endSize = (D) => (c.slot.u !== undefined ? c.slot.frac * D.unit : c.slot.size ?? c.size);
      c.draw = (S, D, t, q = {}) => {
        if (t < c.born) return;
        const str = typeof c.str === 'function' ? c.str(S, t) : c.str, st = { style: c.up ? '600' : 'italic 600', alpha: q.alpha ?? 1 };
        if (c.go === undefined || t < c.go) { const p = c.at(S, t); D.glyph(str, p[0], p[1], c.size * pop(t, c.born) * (1 + (q.bump || 0)), c.col, st); return; }
        const p1 = c.end(D), s1 = c.endSize(D);
        if (t < c.dock) {
          const u = (t - c.go) / c.fly, p0 = (S.v.chip && S.v.chip[c.id]) || p1, p = arc(p0, p1, u, c.h);
          D.glyph(str, p[0], p[1], lerp(c.size, s1, EASE.io(u)), c.col, { ...st, rot: c.spin ? 2 * Math.PI * EASE.io(u) * (p1[0] < p0[0] ? 1 : -1) : 0 });
          return;
        }
        D.glyph(str, p1[0], p1[1], s1 * (1 + boing(t - c.dock) + (q.bump || 0)), c.col, st);
      };
      return c;
    },
  };
  const def = build(tl) || {};
  const byT = (p, q) => p[0] - q[0];
  ev.sort(byT); faces.sort(byT); cams.sort(byT);
  const last = (list, t) => { let r = null; for (const e of list) { if (e[0] <= t) r = e[1]; else break; } return r; };
  const inAny = (list, t) => list.some(([a, b]) => t >= a && t < b);
  const aim = (S, c) => {
    if (c.follow !== undefined) S.cam.x = S.hero.x + c.follow; else if (c.x !== undefined) S.cam.x = c.x;
    S.cam.y = c.followY !== undefined ? S.hero.y + c.followY : c.y ?? 0; S.cam.zm = c.zm ?? 1; S.cam.k = c.k ?? 3; S.cam.kz = c.kz ?? 2.4;
  };
  return {
    dur: now, ground: def.ground,
    init(S) {
      const h = S.hero; h.x = xs.length ? xs[0][1] : 0; h.face = faces.length ? faces[0][1] : 1;
      S.v = (def.init && def.init(S)) || {}; S.v.ei = 0;
      if (cams.length && cams[0][0] <= 0) aim(S, cams[0][1]);
      h.ant = inAny(flags.ant, 0) ? 1 : 0;
    },
    step(S, t, dt) {
      const h = S.hero, v = S.v;
      if (!h.jump) h.x = KN(t, xs);
      const f = last(faces, t); if (f) h.face = f;
      h.ant = inAny(flags.ant, t) ? 1 : 0; h.brake = inAny(flags.brake, t); h.heavy = inAny(flags.heavy, t) ? 0.9 : 0;
      const c = last(cams, t); if (c) aim(S, c);
      while (v.ei < ev.length && ev[v.ei][0] <= t) ev[v.ei++][1](S, t);
      if (def.step) def.step(S, t, dt);
    },
    pose(S, P, auto, t) {
      let direct = false;
      for (const [s, fn] of poses) if (t >= s.a && t < s.b) direct = fn(S, P, auto, t, s) || direct;
      if (def.pose) direct = def.pose(S, P, auto, t) || direct;
      return direct;
    },
    back: def.back, front: def.front,
  };
}

// ---------- i gesti: ognuno è la posa di una battuta, (S, P, auto, t, s) ----------
// questa mano segue il bersaglio senza molle
const now = (P, i) => { P.handNow = P.handNow === false || P.handNow === i ? i : true; };
const val = (p, S, t) => (typeof p === 'function' ? p(S, t) : p);

// La mano i va a un punto del mondo: ci arriva a `go`, ci resta fino a `hold`, poi torna (frazioni della battuta; keep: non torna).
// Se il punto è basso l'omino si piega sulle gambe. pt può essere una funzione (S, t).
export const grab = (i, pt, o = {}) => (S, P, auto, t, s) => {
  const u = s.u(t), go = o.go ?? 0.4, hold = o.hold ?? 0.75, p = val(pt, S, t);
  const k = u < go ? EASE.out(u / go) : u < hold || o.keep ? 1 : 1 - EASE.io((u - hold) / (1 - hold));
  const tgt = ['W', p[0], p[1]];
  P.h[i] = k >= 0.999 ? tgt : mixT(o.from ?? auto[i], tgt, k); now(P, i);
  P.look = o.look ?? [0.7, p[1] < 0.9 ? -0.8 : 0.5];
  if (o.py !== undefined || p[1] < 0.72) { P.py = lerp(RIG.STAND, o.py ?? 0.38, k); P.lean = (o.lean ?? 50) * k; P.head = -0.4 * P.lean; return true; }
  if (o.lean) { P.lean = o.lean * k; P.leanNow = true; }
  return false;
};
// tiene la mano i ferma davanti a sé (porta qualcosa): l è il punto rispetto al petto; in: frazione per arrivarci
export const carry = (i, l = [0.58, 0.14], o = {}) => (S, P, auto, t, s) => {
  const k = o.in ? EASE.out(clamp(s.u(t) / o.in)) : 1, tgt = ['L', l[0], l[1]];
  P.h[i] = k >= 0.999 ? tgt : mixT(o.from ?? auto[i], tgt, k); now(P, i); if (o.look) P.look = o.look; if (o.expr) P.expr = o.expr;
  return false;
};
// lancia quello che ha in mano: carica dal basso e scatta; l'oggetto parte a s.at(rel)
export const toss = (i, o = {}) => (S, P, auto, t, s) => {
  const r = s.at(o.rel ?? 0.5), end = Math.max(r + 0.25, s.b - 0.001);
  P.h[i] = KS(t, [[s.a, o.from ?? ['L', 0.58, 0.14]], [r - 0.1, ['L', 0.14, -0.3]], [r + 0.02, o.to ?? ['L', 0.62, 0.52], 'out3'], [end, auto[i]]]);
  P.py = KN(t, [[s.a, RIG.STAND], [r - 0.1, RIG.STAND - 0.1], [r + 0.02, RIG.STAND + 0.04, 'out3'], [end, RIG.STAND]]);
  P.lean = KN(t, [[s.a, 0], [r - 0.1, 8], [r + 0.02, -6, 'out3'], [end, 0]]); P.leanNow = true; now(P, i); P.look = o.look ?? [0.85, 0.6];
  return false;
};
// indica un punto del mondo: il braccio si tende verso di lui (keep: resta teso fino alla fine della battuta)
export const point = (i, pt, o = {}) => (S, P, auto, t, s) => {
  const u = s.u(t), k = Math.min(EASE.out(clamp(u / (o.in ?? 0.25))), o.keep ? 1 : EASE.out(clamp((1 - u) / (o.out ?? 0.2))));
  const p = val(pt, S, t), c = S.J ? S.J.chest : [S.hero.x, 1.3], dx = p[0] - c[0], dy = p[1] - c[1], d = Math.hypot(dx, dy) || 1, L = Math.min(d, o.len ?? 0.66);
  P.h[i] = mixT(auto[i], ['L', (S.hero.face * dx / d) * L, (dy / d) * L], k); now(P, i);
  P.look = [0.9, clamp(dy / d, -0.9, 0.9)]; if (o.expr) P.expr = o.expr;
  return false;
};
// guarda da una parte, con una faccia
export const look = (lx, ly, expr) => (S, P) => { P.look = [lx, ly]; if (expr) P.expr = expr; return false; };
// esulta: braccia in alto e due saltelli
export const cheer = (o = {}) => (S, P, auto, t, s) => {
  const u = s.u(t), k = Math.min(1, 1.8 * Math.sin(Math.PI * clamp(u)));
  P.h[0] = mixT(auto[0], ['L', 0.3, 0.7], k); P.h[1] = mixT(auto[1], ['L', -0.22, 0.68], k); P.handNow = true;
  P.hop = (o.hop ?? 0.16) * Math.abs(Math.sin(Math.PI * (o.n ?? 2) * u)); P.expr = '^'; P.look = [0.4, 0.4];
  return false;
};
// pensa: una mano al mento, la testa piegata
export const think = (o = {}) => (S, P, auto, t, s) => {
  const u = s.u(t), k = Math.min(EASE.out(clamp(u / 0.2)), EASE.out(clamp((1 - u) / 0.2)));
  P.h[0] = mixT(auto[0], ['L', 0.17, 0.33], k); now(P, 0); P.head = 7 * k; P.look = o.look ?? [0.6, 0.7]; P.expr = o.expr ?? 'o';
  return false;
};
// stupore: un sobbalzo all'indietro
export const startle = () => (S, P, auto, t, s) => {
  const u = s.u(t), k = Math.sin(Math.PI * clamp(u * 1.4));
  P.lean = -9 * k; P.leanNow = true; P.h[0] = mixT(auto[0], ['L', 0.3, 0.3], k); P.h[1] = mixT(auto[1], ['L', -0.36, 0.2], k); P.handNow = true; P.expr = u < 0.7 ? 'O' : 'o';
  return false;
};
// fa di sì con la testa
export const nod = (n = 2) => (S, P, auto, t, s) => { P.head = 9 * Math.max(0, Math.sin(Math.PI * 2 * n * s.u(t))); P.expr = '^'; return false; };
// spinge o tira con due mani un punto del mondo (pt può muoversi): il corpo si inclina di lean gradi
export const push = (pt, o = {}) => (S, P, auto, t, s) => {
  const u = s.u(t), k = Math.min(EASE.out(clamp(u / (o.in ?? 0.15))), o.keep ? 1 : EASE.out(clamp((1 - u) / (o.out ?? 0.15)))), p = val(pt, S, t);
  P.h[0] = mixT(auto[0], ['W', p[0], p[1] + 0.07], k); P.h[1] = mixT(auto[1], ['W', p[0], p[1] - 0.09], k); P.handNow = true;
  P.lean = (o.lean ?? 14) * k; P.leanNow = true; P.look = o.look ?? [0.9, -0.1]; if (o.expr) P.expr = o.expr;
  return false;
};

// ---------- le cose che restano ferme sullo schermo mentre il mondo scorre (u, v: frazioni dello schermo) ----------
export const hud = {
  glyph: (D, u, v, frac, str, col, o = {}) => { const p = D.screen(u, v); D.glyph(str, p[0], p[1], frac * D.unit * (o.k ?? 1), col, o); },
  // la linea di una frazione, larga 2·half
  bar: (D, u, v, half, k = 1, col = COL.ink) => D.seg(D.screen(u - half * k, v), D.screen(u + half * k, v), 0.013 * D.unit, col),
  // un uguale
  eq: (D, u, v, k = 1, col = COL.ink) => { for (const s of [-1, 1]) D.seg(D.screen(u - 0.02 * k, v + s * 0.017), D.screen(u + 0.02 * k, v + s * 0.017), 0.012 * D.unit, col); },
};

// ---------- aiuti per disegnare ----------
// un quadrilatero pieno e bordato: pts sono i quattro angoli
export const quad = (D, pts, col, o = {}) => D.path(pts, o.w ?? 0.035, o.line === false ? null : col, { close: true, fill: o.fill === false ? null : rgba(col, o.a ?? 0.22) });
// una piastrella quadrata con l'angolo in basso a sinistra in (x, y)
export const tile = (D, x, y, s, col, o = {}) => { const g = o.gap ?? 0.035, k = o.k ?? 1, c = [x + s / 2, y + s / 2], h = (s / 2 - g) * k; quad(D, [[c[0] - h, c[1] - h], [c[0] + h, c[1] - h], [c[0] + h, c[1] + h], [c[0] - h, c[1] + h]], col, o); };
// una misura: una riga con due tacche in fondo
export const measure = (D, a, b, col, o = {}) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = (-dy / L) * (o.tick ?? 0.1), ny = (dx / L) * (o.tick ?? 0.1), w = o.w ?? 0.04;
  D.seg(a, b, w, col); D.seg([a[0] - nx, a[1] - ny], [a[0] + nx, a[1] + ny], w, col); D.seg([b[0] - nx, b[1] - ny], [b[0] + nx, b[1] + ny], w, col);
};
// una riga tratteggiata
export const dashed = (D, a, b, col, o = {}) => D.path([a, b], o.w ?? 0.03, col, { dash: o.dash ?? [0.1, 0.1] });
