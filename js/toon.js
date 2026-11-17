// Il motore dei piccoli film della cassetta degli attrezzi.
// È lo stesso omino del percorso arcade: i piedi restano piantati dove toccano terra, le mani vanno davvero sugli
// oggetti, la sciarpa segue il collo, la telecamera lo segue e trema sugli urti. Tutto è disegnato su una tela nera,
// a linee bianche nette: niente didascalie, le formule sono oggetti che l'omino tocca, tira e sposta.
//
// Una scena è un oggetto con:
//   dur                    quanto dura, in secondi
//   init(S)                prepara le sue variabili (S.v) e la posizione di partenza (S.hero, S.cam)
//   step(S, t, dt)         a ogni passo: dove sta l'omino, dove guarda la telecamera, che cosa succede (S.at per gli eventi)
//   pose(S, P, auto, t)    i gesti: cambia la posa P (mani, piedi, busto, sguardo); true se la posa è «esatta», senza molle
//   back(S, D, t)          disegna il mondo dietro l'omino;  front(S, D, t)  quello che gli sta davanti
// Le misure sono in metri: l'omino è alto circa 1,8. Il terreno è l'asse x, a y = 0.

export const COL = { ink: '#f4f4f6', dim: '#8d8d9b', soft: '#b4b4be', rule: '#2b2c38', sky: '#7cc8ff', orange: '#ff9b54', mint: '#4fe3b5', sun: '#ffd166', coral: '#ff6b6b', violet: '#b9a4ff', scarf: '#ff46be', bag: '#e0884a', back: '#9696a0' };
export const MATH = '"STIX Two Text", Georgia, "Times New Roman", serif';
// i caratteri delle formule arrivano con il gioco (fonts/): si chiedono prima del primo fotogramma
export const fontsReady = () => (typeof document !== 'undefined' && document.fonts && document.fonts.load
  ? Promise.all(['italic 600 20px "STIX Two Text"', '600 20px "STIX Two Text"'].map((f) => document.fonts.load(f))).catch(() => {}) : Promise.resolve());

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, u) => a + (b - a) * u;
const frac = (x) => x - Math.floor(x), sm = (u) => u * u * (3 - 2 * u), rad = (d) => (d * Math.PI) / 180;
export const EASE = { lin: (u) => u, io: sm, in: (u) => u * u, out: (u) => 1 - (1 - u) * (1 - u), out3: (u) => 1 - (1 - u) ** 3, back: (u) => 1 + 2.7 * (u - 1) ** 3 + 1.7 * (u - 1) ** 2 };
// avanzamento 0..1 fra due istanti
export const prog = (t, a, b, e = 'io') => EASE[e](clamp((t - a) / (b - a)));
// chiavi di numeri: [[istante, valore, andatura], ...]
export function KN(t, ks) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], EASE[ks[i][2] || 'io']((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
  return ks[ks.length - 1][1];
}
// chiavi di bersagli per mani e piedi: la miscela si risolve dopo, nello spazio del corpo
export function KS(t, ks) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return { a: ks[i - 1][1], b: ks[i][1], u: EASE[ks[i][2] || 'io']((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])) };
  return ks[ks.length - 1][1];
}
const hsh = (i, k = 1) => { const v = Math.sin(i * 12.9898 * k + 4.1) * 43758.5453; return v - Math.floor(v); };

// ---------- suoni: sintetizzati, come nel percorso arcade ----------
// synth() dà le due primitive (una nota che scivola, un soffio filtrato) su un contesto audio; soundSet() ci costruisce
// sopra i suoni con un nome. Tenerle separate permette di registrare un film: basta passare primitive che annotano.
let noiseBuf = null, noiseRate = 0;
export function synth(getCtx, enabled = () => true, always = false) {       // always: per registrare su un contesto fuori linea
  let actx = null, nth = 0;
  const live = () => {
    if (!enabled()) return false;
    try { actx = getCtx(); } catch { actx = null; }
    if (!actx) return false;
    if (always) return true;
    if (actx.state === 'suspended') actx.resume().catch(() => {});
    return actx.state === 'running';
  };
  const tone = (f0, f1, dur, vol = 0.12, type = 'sine', delay = 0) => {
    if (!live()) return;
    const t0 = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    o.connect(g); g.connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  };
  const noise = (dur, vol, f0, f1, delay = 0) => {
    if (!live()) return;
    if (!noiseBuf || noiseRate !== actx.sampleRate) {
      noiseRate = actx.sampleRate; noiseBuf = actx.createBuffer(1, Math.floor(noiseRate * 0.7), noiseRate);
      const d = noiseBuf.getChannelData(0); let z = 22222;                       // sempre lo stesso soffio: un film suona uguale a ogni visione
      for (let i = 0; i < d.length; i++) { z = (z * 16807) % 2147483647; d[i] = (z / 2147483647) * 2 - 1; }
    }
    const t0 = actx.currentTime + delay, src = actx.createBufferSource(), flt = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = noiseBuf; flt.type = 'bandpass'; flt.Q.value = 1.1; flt.frequency.setValueAtTime(f0, t0); flt.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    src.connect(flt); flt.connect(g); g.connect(actx.destination); src.start(t0, (nth++ * 0.0371) % 0.1); src.stop(t0 + dur + 0.02);
  };
  return { tone, noise };
}
export function soundSet({ tone, noise }) {
  return {
    tone, noise,
    chime: (notes, vol = 0.09, gap = 0.09) => notes.forEach((f, i) => tone(f, f, 0.34, vol, 'triangle', i * gap)),
    boom: (vol = 0.16) => { tone(95, 36, 0.5, vol, 'sine'); tone(190, 60, 0.16, vol * 0.5, 'triangle'); noise(0.28, vol * 0.7, 500, 90); },
    pop: (f = 520, vol = 0.1) => tone(f, f * 1.9, 0.12, vol, 'triangle'),
    tick: (f = 1200, vol = 0.05) => tone(f, f, 0.04, vol, 'square'),
    whoosh: (vol = 0.07, dur = 0.3, f0 = 500, f1 = 2600) => noise(dur, vol, f0, f1),
    thud: (vol = 0.1) => { tone(150, 62, 0.14, vol, 'sine'); noise(0.09, vol * 0.7, 900, 220); },
  };
}
export const makeSound = (enabled, getCtx) => soundSet(synth(getCtx, enabled));
const MUTE = soundSet({ tone() {}, noise() {} });

// ---------- il corpo: le stesse misure dell'omino del percorso arcade ----------
const K = 0.393;                     // gli effetti sono nati in un mondo 2,55 volte più grande: i loro numeri passano da qui
const R = { UL: 0.385, LL: 0.385, TORSO: 0.59, NECK: 0.079, HEAD: 0.22, UA: 0.362, LA: 0.362, STAND: 0.731, LW: 0.079 };
export const RIG = R;
export const REACH = R.UA + R.LA;    // fin dove arriva una mano, dal petto
const newBody = () => ({ py: R.STAND, pyV: 0, lean: 0, rot: 0, fs: 1, ph: 0, act: 0, moving: false, heavy: 0, skid: 0, skidOn: false, dustT: 0, ant: 0, acc: 0, gsPrev: 0, xPrev: null, baseY: 0, stepEv: 0, stepT: -9,
  feet: [{ st: false, wx: 0, rx0: 0.1, lx: 0.1, ly: -0.7, w: 1 }, { st: false, wx: 0, rx0: -0.1, lx: -0.1, ly: -0.7, w: 1 }],
  hands: [{ x: 0.05, y: -0.7, vx: 0, vy: 0 }, { x: -0.05, y: -0.7, vx: 0, vy: 0 }], look: [1, 0], expr: 'o', neck: [], hist: [], J: null });
// due ossa e un bersaglio: dove va il gomito (o il ginocchio)
function ik2(a, t, l1, l2, pref) {
  const dx = t[0] - a[0], dy = t[1] - a[1], d0 = Math.max(1e-6, Math.hypot(dx, dy)), dd = clamp(d0, Math.abs(l1 - l2) + 1e-4, l1 + l2 - 1e-4);
  const base = Math.atan2(dy, dx), ang = Math.acos(clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1));
  let best = null, bs = -1e9;
  for (const sg of [1, -1]) { const j = [a[0] + l1 * Math.cos(base + sg * ang), a[1] + l1 * Math.sin(base + sg * ang)], sc = pref(j); if (sc > bs) { bs = sc; best = j; } }
  return [best, [a[0] + (dx / d0) * dd, a[1] + (dy / d0) * dd]];
}
// come le gambe coprono il terreno a questa velocità: dal passo alla corsa
function gaitParams(spd) {
  const runW = clamp((spd - 1.3) / 0.9, 0, 1);
  const Lrun = 1.3 + 0.13 * spd + Math.max(0, spd - 5.2) * 0.12;
  const Lg = 0.786 + (Lrun - 0.786) * runW, D = 0.6 + (Math.min(0.32, 0.72 / Lrun) - 0.6) * runW;
  return { Lg, D, runW, half: (D * Lg) / 2 };
}

// ---------- il palco ----------
export function makeStage(cv, scene, opts = {}) {
  const ctx = cv.getContext('2d');
  const reduce = !!opts.reduce;
  const sound = opts.sound || MUTE;
  let W = 320, H = 180, DPR = 1, Z0 = 30, Z = 30, GY = 140;
  const cam = { x: 0, y: 0, zm: 1 };
  const STEP = 1 / 60;
  let clock = 0, hitstop = 0, quiet = false, warm = false, raf = 0, last = 0, accT = 0, playing = false, paused = false;
  const bursts = [], waves = [], ripples = [], shakes = [], punches = [], flashes = [], chromas = [];
  let A = newBody();
  const hero = {};
  // i suoni tacciono mentre si salta a un istante (seek) e nel fermo immagine
  const snd = new Proxy({}, { get: (_, k) => (...a) => { if (!quiet && !warm) sound[k](...a); } });
  const S = { hero, cam: { x: 0, y: 0, zm: 1, k: 3.2, kz: 2.4 }, v: {}, T: 0, J: null, snd, COL, fired: new Set(), over: 0 };

  const sx = (x) => W / 2 + (x - cam.x) * Z, sy = (y) => GY - (y - cam.y) * Z;

  // ---------- effetti: scoppi, onde d'urto, polvere, increspature dell'asse, colpi di telecamera ----------
  const burst = (pos, n = 10, sp = 7, life = 0.6, col = COL.ink, o = {}) => bursts.push({ t0: clock + (o.delay || 0), pos, n: reduce ? Math.min(n, 5) : n, sp: sp * K, life, col, grav: (o.grav || 0) * K, kind: o.kind || 'line', up: o.up || 0, size: o.size || 1 });
  const wave = (pos, r = 4, life = 0.5, col = COL.ink, w = 0.14, delay = 0) => waves.push({ t0: clock + delay, pos, r: r * K, life, col, w: w * K });
  const dust = (x, y, n = 9, sp = 5) => burst([x, y + 0.04], n, sp, 0.7, COL.soft, { grav: 9, kind: 'puff', up: 1 });
  const ripple = (x, y, amp) => { if (!reduce) ripples.push({ t0: clock, x, y, amp: amp * K }); };
  const kick = (o) => {
    if (reduce) return;
    if (o.shake) shakes.push({ t0: clock, a: o.shake * K });
    if (o.punch) punches.push({ t0: clock, a: o.punch });
    if (o.flash) flashes.push({ t0: clock, a: o.flash });
    if (o.chroma) chromas.push({ t0: clock, a: o.chroma });
    if (o.stop) hitstop = Math.max(hitstop, o.stop);
  };
  const axisY = (x, yP) => {          // la linea del terreno si increspa via da un urto
    let y = 0;
    for (const r of ripples) { if (Math.abs(r.y - yP) > 0.01) continue; const dt = clock - r.t0; if (dt <= 0 || dt >= 1.8) continue; const dx = Math.abs(x - r.x); if (dx < 11.8 * dt) y += r.amp * Math.exp(-2.4 * dt) * Math.sin(15 * dt - 3.05 * dx) * Math.exp(-dx / 3.9); }
    return y;
  };
  const prune = (a, life) => { for (let i = a.length - 1; i >= 0; i--) if (clock - a[i].t0 > (a[i].life || life)) a.splice(i, 1); };
  Object.assign(S, { burst, wave, dust, ripple, kick });
  // un evento della scena: succede una volta sola, la prima volta che si passa da quell'istante
  S.at = (t0, key, fn) => { if (S.T >= t0 && !S.fired.has(key)) { S.fired.add(key); fn(); } };
  // un salto: l'omino lascia il terreno e ci torna T secondi dopo, in `to`
  S.jump = ({ to = hero.x, T = 0.55, h = 0.7, y1 = hero.y, flip = false, long = false }) => { hero.jump = { t0: S.T, T, x0: hero.x, x1: to, y0: hero.y, y1, h, flip, long }; hero.onG = false; snd.tone(240, 560, 0.16, 0.06, 'sine'); snd.noise(0.2, 0.05, 500, 2200); dust(hero.x, hero.y, 5, 4); };
  function land(v) {
    hero.landT = S.T; hero.landV = v; hero.big = v > 6.5;
    dust(hero.x, hero.y, Math.round(5 + v), 3 + v * 0.35); ripple(hero.x, hero.y, 0.04 + 0.014 * v);
    if (hero.big) { wave([hero.x, hero.y + 0.05], 4, 0.5); kick({ shake: 0.1, punch: 0.035 }); snd.boom(0.14); }
    else { kick({ shake: 0.02 + 0.006 * v }); snd.tone(170, 55, 0.18, clamp(0.08 + v * 0.03, 0.08, 0.3)); snd.noise(0.09, 0.07, 900, 200); }
  }
  S.land = land;

  function reset() {
    clock = 0; hitstop = 0; accT = 0; S.T = 0; S.fired.clear(); S.v = {};
    for (const a of [bursts, waves, ripples, shakes, punches, flashes, chromas]) a.length = 0;
    A = newBody();
    Object.assign(hero, { x: 0, y: 0, face: 1, gs: 0, onG: true, jump: null, landT: -9, landV: 0, big: false, brake: false, ant: 0, heavy: 0, bag: true, hide: false });
    Object.assign(S.cam, { x: 0, y: 0, zm: 1, k: 3.2, kz: 2.4 });
    if (scene.init) scene.init(S);
    Object.assign(cam, { x: S.cam.x, y: S.cam.y, zm: S.cam.zm });
    A.xPrev = hero.x; A.fs = hero.face;
    warm = true; for (let i = 0; i < 45; i++) animate(STEP); warm = false;   // il corpo si assesta nella posa di partenza, prima che il tempo cominci
    A.hist.length = 0; A.neck.length = 0; A.acc = 0; A.gsPrev = 0;
  }

  // ---------- il corpo si muove: passo, corsa, frenata, salto, atterraggio, e i gesti chiesti dalla scena ----------
  function animate(dt) {
    const k = (r) => 1 - Math.exp(-dt * r), T = S.T, face = hero.face, sin = Math.sin, cos = Math.cos, onG = hero.onG;
    if (dt > 0) hero.gs = onG && A.xPrev !== null ? (hero.x - A.xPrev) / dt : 0;
    A.xPrev = hero.x;
    const spd = onG ? Math.abs(hero.gs) : 0, md = hero.gs < -0.01 ? -1 : hero.gs > 0.01 ? 1 : face;
    if (dt > 0) A.acc += ((onG ? (hero.gs - A.gsPrev) / dt : 0) - A.acc) * k(12);
    A.gsPrev = hero.gs;
    A.act += (clamp(spd, 0, 1) - A.act) * k(18);
    A.heavy += ((hero.heavy || 0) - A.heavy) * k(5);
    A.fs += (face - A.fs) * k(26);
    if (onG) A.baseY = hero.y;
    // la scivolata: frena forte, basso e largo, con la polvere
    const skT = onG && hero.brake && spd > 1.0 ? clamp((spd - 0.8) / 1.8, 0, 1) : 0;
    if (skT > 0.5 && !A.skidOn) { A.skidOn = true; snd.noise(0.42, 0.08, 2600, 600); }
    if (skT === 0) A.skidOn = false;
    A.skid += (skT - A.skid) * k(skT > A.skid ? 30 : 9);
    if (A.skid > 0.35 && spd > 0.8) { A.dustT += dt; if (A.dustT > 0.07) { A.dustT = 0; dust(hero.x + md * 0.38, hero.y, 3, 3.5); } }
    // le gambe: ogni piede resta piantato dove atterra, finché non si alza
    const gp = gaitParams(spd), half = gp.half, rw = gp.runW * A.act;
    if (onG && spd > 0.25 && !A.moving) { A.moving = true; A.ph = gp.D / 2; A.feet[0].st = true; A.feet[0].wx = hero.x; A.feet[1].st = false; A.feet[1].rx0 = -md * 0.1; }
    if (!onG || spd <= 0.25) A.moving = false;
    if (A.moving) A.ph += (spd * dt) / gp.Lg;
    const fr = [];
    for (let i = 0; i < 2; i++) {
      const ft = A.feet[i], f = frac(A.ph + 0.5 * i);
      let rel = 0, fy = 0;
      if (A.moving) {
        if (f < gp.D) {
          if (!ft.st) { ft.st = true; ft.wx = hero.x + md * (half - f * gp.Lg); A.stepEv = i + 1; }
          rel = clamp(ft.wx - hero.x, -half - 0.2, half + 0.2); ft.wx = hero.x + rel;
        } else {
          if (ft.st) { ft.st = false; ft.rx0 = ft.wx - hero.x; }
          const u = (f - gp.D) / (1 - gp.D);
          rel = lerp(ft.rx0, md * half, sm(u));
          fy = lerp(0.141 * sin(Math.PI * u), 0.334 * Math.pow(sin(Math.PI * u), 0.8) + 0.138 * sin(Math.PI * Math.min(1, u * 2.4)), gp.runW);
        }
      }
      fr.push([lerp((i ? -0.1 : 0.1) * face, rel, A.act), fy * A.act]);
    }
    const cyc = cos(4 * Math.PI * (A.ph - gp.D / 2)), bob = onG ? A.act * lerp(0.0197 * cyc, -0.059 * cyc - 0.051, gp.runW) : 0;
    A.ant += ((hero.ant || 0) - A.ant) * k((hero.ant || 0) > A.ant ? 30 : 12);
    // la posa di base
    const breath = 0.008 * sin(clock * 2.4);
    const autoHand = (i) => {
      const sg = i ? 1 : -1, a = lerp(rad(26) * A.act * sg * cos(2 * Math.PI * A.ph) + rad(5 * sg), rad(52) * sg * cos(2 * Math.PI * A.ph + 0.3), rw), b = a + rad(14 + 72 * rw);
      return ['L', R.UA * sin(a) + R.LA * sin(b), -R.UA * cos(a) - R.LA * cos(b) + breath];
    };
    const auto = [autoHand(0), autoHand(1)];
    const P = { py: R.STAND, lean: 0, rot: 0, head: 0, curl: 0, hop: 0, h: [auto[0], auto[1]], f: [null, null], look: [1, 0], expr: 'o', rotNow: false, leanNow: false, handNow: false };
    let sq = 0, direct = false;
    const mixS = (a, b, u) => (u <= 0.001 ? a : u >= 0.999 ? b : { a, b, u });
    if (!onG) {
      const J = hero.jump, ph = J ? (T - J.t0) / J.T : -1;
      P.py = R.STAND + 0.02; direct = true;
      if (ph >= 0 && ph <= 1.04) {
        const tuck = J.flip ? sm(clamp((ph - 0.14) / 0.14, 0, 1)) * sm(clamp((0.86 - ph) / 0.14, 0, 1)) : 0;
        P.f = [mixS(KS(ph, [[0, ['L', 0.04, -0.74]], [0.1, ['L', 0.118, -0.57], 'out'], [0.84, ['L', 0.118, -0.57]], [1, ['L', 0.16, -0.69], 'in']]), ['L', 0.295, -0.37], tuck),
               mixS(KS(ph, [[0, ['L', -0.2, -0.7]], [0.1, ['L', -0.059, -0.63], 'out'], [0.84, ['L', -0.059, -0.63]], [1, ['L', -0.08, -0.73], 'in']]), ['L', 0.216, -0.59], tuck)];
        if (J.long || J.flip) {      // le braccia vanno indietro, su sopra la testa, poi fuori per l'atterraggio
          P.h = [KS(ph, [[0, ['L', -0.39, -0.16]], [0.13, ['L', 0.2, 0.63], 'out'], [0.3, ['L', -0.06, 0.28]], [0.62, ['L', -0.06, 0.28]], [0.86, ['L', 0.35, 0.2]], [1, ['L', 0.31, -0.08]]]),
                 KS(ph, [[0, ['L', -0.43, -0.12]], [0.13, ['L', 0.12, 0.67], 'out'], [0.3, ['L', 0.1, 0.31]], [0.62, ['L', 0.1, 0.31]], [0.86, ['L', -0.35, 0.24]], [1, ['L', -0.31, -0.04]]])];
          P.lean = KN(ph, [[0, 22], [0.15, -7, 'out'], [0.8, -7], [1, 14]]);
        } else {
          P.h = [KS(ph, [[0, ['L', -0.39, -0.16]], [0.25, ['L', 0.36, 0.22], 'out'], [0.75, ['L', 0.38, 0.1]], [1, ['L', 0.3, -0.1]]]),
                 KS(ph, [[0, ['L', -0.43, -0.12]], [0.25, ['L', -0.2, 0.2], 'out'], [0.75, ['L', -0.34, 0.14]], [1, ['L', -0.3, -0.06]]])];
          P.lean = KN(ph, [[0, 20], [0.2, 4, 'out'], [0.8, 0], [1, 12]]);
        }
        if (J.flip && !reduce) { P.rot = -360 * sm(clamp((ph - 0.16) / 0.66, 0, 1)); P.rotNow = true; }
        P.look = ph < 0.35 ? [0.3, 0.9] : ph > 0.65 ? [0.6, -0.8] : [1, 0]; P.expr = J.flip ? (ph < 0.25 ? 'O' : ph < 0.78 ? '-' : 'o') : 'o';
      } else {                       // niente sotto i piedi: una caduta semplice
        P.h = [['L', 0.42, 0.18], ['L', -0.42, 0.2]]; P.f = [['L', 0.15, -0.62], ['L', -0.13, -0.66]]; P.look = [0.3, -1]; P.expr = 'O';
      }
    } else {
      P.py = R.STAND - 0.19 * A.heavy - 0.24 * A.ant;
      P.lean = 15 * rw * clamp(spd / 2.36, 0, 1) * (md === face ? 1 : -0.4) + clamp(A.acc * face * 0.3, -10, 14) + 17 * A.heavy + 16 * A.ant;
      if (A.ant > 0.01) P.h = [mixS(auto[0], ['L', -0.39, -0.16], A.ant), mixS(auto[1], ['L', -0.43, -0.12], A.ant)];
      const q = T - hero.landT;      // l'atterraggio: giù, poi di nuovo su con uno scatto
      if (q < 0.95 && hero.big && spd < 1) {
        P.py = KN(q, [[0, 0.41], [0.1, 0.31, 'out'], [0.42, 0.34], [0.95, R.STAND, 'back']]); P.lean = KN(q, [[0, 22], [0.12, 38, 'out'], [0.42, 36], [0.9, 0]]); P.curl = 0.06 * (1 - q / 0.95);
        P.h = [KS(q, [[0, ['G', 0.37, 0.0]], [0.45, ['G', 0.37, 0.0]], [0.9, auto[0]]]), KS(q, [[0, ['L', -0.45, 0.14]], [0.45, ['L', -0.45, 0.14]], [0.9, auto[1]]])];
        P.expr = q < 0.3 ? '-' : 'o'; direct = true;
      } else if (q >= 0 && q < 0.42) {
        const d = clamp(0.05 + 0.045 * hero.landV, 0.1, 0.3);
        sq = q < 0.1 ? d * EASE.out(q / 0.1) : d * (1 - EASE.back((q - 0.1) / 0.32)); P.lean += 14 * Math.max(0, 1 - q / 0.3);
      }
      if (A.skid > 0.02) {           // basso e largo, piegato contro il moto, braccia fuori
        const w = A.skid, back = md !== face;
        P.py = lerp(P.py, 0.53, w); P.lean = lerp(P.lean, back ? 25 : -26, w);
        P.f = [mixS(null, ['G', back ? 0.31 : 0.5, 0], w), mixS(null, ['G', back ? -0.46 : -0.26, 0], w)];
        P.h = [mixS(P.h[0], ['L', 0.36, 0.08], w), mixS(P.h[1], ['L', -0.4, 0.16], w)]; if (w > 0.5) P.expr = '>';
      }
    }
    if (scene.pose && scene.pose(S, P, auto, T)) direct = true;
    // molle e smorzamenti dove niente è scritto a mano
    if (direct) { A.py = P.py; A.pyV = 0; A.lean = P.lean; }
    else { A.pyV += (250 * (P.py - A.py) - 22 * A.pyV) * dt; A.py = clamp(A.py + A.pyV * dt, 0.1, 0.86); A.lean = P.leanNow ? P.lean : A.lean + (P.lean - A.lean) * k(12); }
    if (P.rotNow) A.rot = P.rot; else A.rot += (P.rot - A.rot) * k(11);
    const gy0 = onG ? hero.y : A.baseY, px = hero.x, py = hero.y + A.py + bob - sq + P.hop + (onG ? axisY(hero.x, hero.y) : 0), lean = rad(A.lean), rot = rad(A.rot), cr = cos(rot), sr = sin(rot);
    const toL = (p) => { const dx = (p[0] - px) * face, dy = p[1] - py; return [dx * cr + dy * sr, -dx * sr + dy * cr]; };
    const toW = (l) => [px + A.fs * (l[0] * cr - l[1] * sr), py + l[0] * sr + l[1] * cr];
    const chest = [R.TORSO * sin(lean), R.TORSO * cos(lean)], tilt = lean * (direct ? 1 : 0.6) + rad(P.head);
    const neck = [chest[0] + R.NECK * sin(tilt), chest[1] + R.NECK * cos(tilt)], head = [neck[0] + R.HEAD * sin(tilt), neck[1] + R.HEAD * cos(tilt)];
    // un bersaglio: 'L' rispetto al corpo, 'P' rispetto al bacino, 'G' sul terreno davanti a lui, 'W' un punto del mondo
    const res = (sp, hand, i) => {
      if (sp === null) return hand ? res(auto[i], true, i) : toL([hero.x + fr[i][0], gy0 + P.hop + fr[i][1]]);
      if (sp.a !== undefined) { const p = res(sp.a, hand, i), q = res(sp.b, hand, i); return [lerp(p[0], q[0], sp.u), lerp(p[1], q[1], sp.u)]; }
      const kd = sp[0];
      if (kd === 'L') return hand ? [chest[0] + sp[1], chest[1] + sp[2]] : [sp[1], sp[2]];
      if (kd === 'P') return [sp[1], sp[2]];
      if (kd === 'G') return toL([px + face * sp[1], gy0 + sp[2]]);
      return toL([sp[1], sp[2]]);
    };
    const feetL = [], handsL = [];
    for (let i = 0; i < 2; i++) {
      const ft = A.feet[i], tg = res(P.f[i], false, i);
      if (P.f[i] === null) { ft.w += (1 - ft.w) * k(30); feetL.push([lerp(ft.lx, tg[0], ft.w), lerp(ft.ly, tg[1], ft.w)]); if (ft.w > 0.97) { ft.lx = tg[0]; ft.ly = tg[1]; } }
      else { ft.w = 0; ft.st = false; ft.lx += (tg[0] - ft.lx) * k(direct ? 60 : 26); ft.ly += (tg[1] - ft.ly) * k(direct ? 60 : 26); feetL.push([ft.lx, ft.ly]); }
      let ht = res(P.h[i], true, i); ht = [ht[0] - chest[0], ht[1] - chest[1]];
      if (i === 0) S.over = 0;
      if (Array.isArray(P.h[i]) && P.h[i][0] === 'W') S.over = Math.max(S.over, Math.hypot(ht[0], ht[1]) - REACH);   // un oggetto da toccare che la mano non raggiunge
      const hd = A.hands[i];
      if (direct || P.handNow === true || P.handNow === i) { hd.vx = ((ht[0] - hd.x) / Math.max(dt, 1e-3)) * 0.3; hd.vy = ((ht[1] - hd.y) / Math.max(dt, 1e-3)) * 0.3; hd.x += (ht[0] - hd.x) * k(45); hd.y += (ht[1] - hd.y) * k(45); }
      else { hd.vx += (210 * (ht[0] - hd.x) - 19 * hd.vx) * dt; hd.vy += (210 * (ht[1] - hd.y) - 19 * hd.vy) * dt; hd.x += hd.vx * dt; hd.y += hd.vy * dt; }
      handsL.push([chest[0] + hd.x, chest[1] + hd.y]);
    }
    const knees = [], elbows = [], F = [], Hn = [];
    for (let i = 0; i < 2; i++) {
      const a = ik2([0, 0], feetL[i], R.UL, R.LL, (j) => j[0]); knees.push(a[0]); F.push(a[1]);
      const b = ik2(chest, handsL[i], R.UA, R.LA, (j) => -0.6 * j[0] - j[1]); elbows.push(b[0]); Hn.push(b[1]);
    }
    A.look[0] += (P.look[0] - A.look[0]) * k(9); A.look[1] += (P.look[1] - A.look[1]) * k(9); A.expr = P.expr;
    const eyes = [-0.008, 0.102].map((ex) => toW([head[0] + 0.047 + 0.051 * A.look[0] + ex, head[1] + 0.024 + 0.051 * A.look[1]]));
    const mid = [chest[0] / 2 + P.curl * cos(lean), chest[1] / 2 - P.curl * sin(lean)];
    A.J = { pelvis: [px, py], chest: toW(chest), neck: toW(neck), head: toW(head), mid: toW(mid), eyes, k: knees.map(toW), f: F.map(toW), e: elbows.map(toW), h: Hn.map(toW) };
    S.J = A.J;
    A.neck.push([clock, A.J.neck[0], A.J.neck[1]]); while (A.neck.length > 2 && clock - A.neck[1][0] > 0.3) A.neck.shift();
    A.hist.push([A.J.h[0], A.J.h[1], A.J.f[0], A.J.f[1]]); if (A.hist.length > 5) A.hist.shift();
    if (A.stepEv) {                  // un piede ha appena toccato terra
      const i = A.stepEv - 1; A.stepEv = 0;
      if (onG && A.skid < 0.3 && clock - A.stepT > 0.12) { A.stepT = clock; snd.noise(0.04, 0.02 + 0.006 * Math.min(spd, 8), 1500, 500); if (spd > 5) dust(A.feet[i].wx, hero.y, 2, 2.5); }   // nella scivolata i piedi strisciano: niente passi
    }
  }
  const neckAt = (tt) => {
    const N = A.neck; if (!N.length) return A.J.neck;
    if (tt <= N[0][0]) return [N[0][1], N[0][2]];
    for (let i = N.length - 1; i > 0; i--) if (tt >= N[i - 1][0]) { const u = clamp((tt - N[i - 1][0]) / Math.max(1e-4, N[i][0] - N[i - 1][0]), 0, 1); return [lerp(N[i - 1][1], N[i][1], u), lerp(N[i - 1][2], N[i][2], u)]; }
    return [N[0][1], N[0][2]];
  };

  // ---------- disegno ----------
  const seg = (a, b, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, w * Z); ctx.beginPath(); ctx.moveTo(sx(a[0]), sy(a[1])); ctx.lineTo(sx(b[0]), sy(b[1])); ctx.stroke(); };
  const limb = (a, j, b, col) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, c = [j[0] + 0.55 * (j[0] - mx), j[1] + 0.55 * (j[1] - my)];
    ctx.strokeStyle = col; ctx.lineWidth = R.LW * Z; ctx.beginPath(); ctx.moveTo(sx(a[0]), sy(a[1])); ctx.quadraticCurveTo(sx(c[0]), sy(c[1]), sx(b[0]), sy(b[1])); ctx.stroke();
  };
  // un testo «da manuale di matematica»: size è l'altezza in metri
  const wtext = (str, x, y, size, col, o = {}) => {
    ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
    ctx.font = `${o.style ?? 'italic 600'} ${Math.max(7, size * Z).toFixed(1)}px ${o.font || MATH}`; ctx.fillStyle = col; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(str, sx(x), sy(y)); ctx.restore();
  };
  // una lettera o un numero come oggetto: si può ruotare, schiacciare, far svanire
  const glyph = (str, x, y, size, col, o = {}) => {
    ctx.save(); ctx.translate(sx(x), sy(y)); ctx.rotate(-(o.rot || 0)); ctx.scale(o.kx ?? 1, o.ky ?? 1); ctx.globalAlpha *= o.alpha ?? 1;
    ctx.font = `${o.style ?? 'italic 600'} ${(size * Z).toFixed(1)}px ${o.font || MATH}`; ctx.fillStyle = col; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, 0, 0); ctx.restore();
  };
  const arrow = (a, b, w, col, head = 0.16) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], Ln = Math.hypot(dx, dy); if (Ln < 0.02) return;
    const ux = dx / Ln, uy = dy / Ln, hd = Math.min(head, Ln * 0.7);
    seg(a, [b[0] - ux * hd * 0.8, b[1] - uy * hd * 0.8], w, col);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(sx(b[0]), sy(b[1]));
    ctx.lineTo(sx(b[0] - ux * hd - uy * hd * 0.5), sy(b[1] - uy * hd + ux * hd * 0.5)); ctx.lineTo(sx(b[0] - ux * hd + uy * hd * 0.5), sy(b[1] - uy * hd - ux * hd * 0.5)); ctx.fill();
  };
  const circle = (x, y, r, col, o = {}) => {
    ctx.beginPath(); ctx.arc(sx(x), sy(y), Math.max(0.5, r * Z), 0, 7);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (col) { ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, (o.w ?? 0.045) * Z); ctx.stroke(); }
  };
  const path = (pts, w, col, o = {}) => {
    if (pts.length < 2) return;
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(sx(p[0]), sy(p[1])) : ctx.moveTo(sx(p[0]), sy(p[1])))); if (o.close) ctx.closePath();
    if (o.dash) ctx.setLineDash(o.dash.map((d) => d * Z));
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
    if (col) { ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, w * Z); ctx.stroke(); }
    ctx.setLineDash([]);
  };
  // un anello che pulsa: «toccami»
  const ring = (x, y, r0, col) => { const ph = (clock % 1.6) / 1.6; ctx.save(); ctx.globalAlpha *= 0.6 * (1 - ph); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sx(x), sy(y), (r0 + 0.6 * ph) * Z, 0, 7); ctx.stroke(); ctx.restore(); };
  const alpha = (a, fn) => { ctx.save(); ctx.globalAlpha *= clamp(a, 0, 1); fn(); ctx.restore(); };
  // screen(u, v): il punto del mondo che ora sta a quella frazione dello schermo; unit: quanti metri è alto lo schermo
  const screen = (u, v) => [cam.x + ((u - 0.5) * W) / Z, cam.y + (GY - v * H) / Z];
  const D = { ctx, seg, limb, wtext, glyph, arrow, circle, path, ring, alpha, sx, sy, screen, get unit() { return H / Z; }, get Z() { return Z; }, get clock() { return clock; }, get W() { return W; }, get H() { return H; } };

  function drawBack(x0, x1, yTop, yBot) {
    // il piano cartesiano: una griglia appena visibile e una polvere di piccoli segni
    ctx.lineWidth = 1;
    for (let x = Math.floor(x0 / 5) * 5; x < x1; x += 5) { ctx.strokeStyle = x % 10 === 0 ? '#22242f' : '#15161d'; ctx.beginPath(); ctx.moveTo(sx(x), 0); ctx.lineTo(sx(x), H); ctx.stroke(); }
    for (let y = Math.floor(yBot / 5) * 5; y < yTop; y += 5) { ctx.strokeStyle = y % 10 === 0 ? '#22242f' : '#15161d'; ctx.beginPath(); ctx.moveTo(0, sy(y)); ctx.lineTo(W, sy(y)); ctx.stroke(); }
    const cs = 2.75, Ln = 0.055; ctx.strokeStyle = '#3e4254'; ctx.lineWidth = Math.max(1, 0.016 * Z); ctx.beginPath();
    for (let ci = Math.floor(x0 / cs); ci <= Math.floor(x1 / cs); ci++) for (let cj = Math.floor(yBot / cs); cj <= Math.floor(yTop / cs); cj++) {
      const hh = hsh(ci * 31 + cj * 57, 1.3); if (hh >= 0.55) continue;
      const px = sx((ci + hsh(ci + cj * 13, 2.1)) * cs), py = sy((cj + hsh(ci * 7 + cj, 3.3)) * cs);
      ctx.moveTo(px - Ln * Z, py); ctx.lineTo(px + Ln * Z, py); if (hh < 0.3) { ctx.moveTo(px, py - Ln * Z); ctx.lineTo(px, py + Ln * Z); }
    }
    ctx.stroke();
  }
  function drawGround(x0, x1) {
    const g = scene.ground || {}, ga = g.from ?? -1e9, gb = g.to ?? 1e9, xa = Math.max(x0, ga), xb = Math.min(x1, gb);
    if (g.hide || xb <= xa) return;
    if (g.body !== false) {
      const gr = ctx.createLinearGradient(0, sy(0), 0, sy(-4.5)); gr.addColorStop(0, '#14151e'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gr; ctx.fillRect(sx(xa), sy(0), (xb - xa) * Z, 4.5 * Z);
    }
    ctx.strokeStyle = COL.ink; ctx.lineWidth = Math.max(1.5, 0.045 * Z); ctx.beginPath();
    if (!ripples.length) { ctx.moveTo(sx(xa), sy(0)); ctx.lineTo(sx(xb), sy(0)); }
    else { const n = Math.max(2, Math.ceil((xb - xa) / 0.12)); for (let i = 0; i <= n; i++) { const x = xa + ((xb - xa) * i) / n, Y = sy(axisY(x, 0)); i ? ctx.lineTo(sx(x), Y) : ctx.moveTo(sx(x), Y); } }
    ctx.stroke();
    if (g.ticks === false) return;
    for (let x = Math.ceil(xa); x <= xb; x++) {
      const big = x % 5 === 0, ay = ripples.length ? axisY(x, 0) : 0;
      seg([x, ay - (big ? 0.14 : 0.07)], [x, ay], big ? 0.03 : 0.018, big ? COL.ink : COL.dim);
      if (big && g.numbers) wtext(String(x), x, ay - 0.42, 0.27, COL.dim, { style: '600' });
    }
  }
  function drawHero() {
    const J = A.J; if (!J || hero.hide) return;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const fastU = hero.onG ? Math.abs(hero.gs) : 0;       // l'aria gli scorre accanto quando va forte
    if (fastU > 5.2 && !reduce) {
      const al = clamp((fastU - 5.2) / 2.6, 0, 1), dr = hero.gs >= 0 ? 1 : -1;
      for (let i = 0; i < 8; i++) { const ph = frac(hsh(i, 5) + clock * (1.4 + hsh(i, 7))), yy = hero.y + 0.2 + 2.0 * hsh(i, 2), xx = hero.x + dr * (2.2 - ph * 7.5); ctx.globalAlpha = 0.55 * al * Math.sin(Math.PI * ph); seg([xx, yy], [xx - dr * (0.5 + 1.1 * al), yy], 0.022, COL.soft); }
      ctx.globalAlpha = 1;
    }
    // le scie dietro mani e piedi veloci
    const Hh = A.hist;
    if (Hh.length >= 4 && !reduce) for (let kx = 0; kx < 4; kx++) {
      const pts = []; for (let i = Hh.length - 1; i >= 0; i--) pts.push(Hh[i][kx]);
      let Ln = 0; for (let i = 0; i < pts.length - 1; i++) Ln += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      const per = (Ln / (pts.length - 1)) * 60;
      if (per > 7.5 && per < 60) for (let i = 0; i < pts.length - 1; i++) { ctx.globalAlpha = 0.5 * (1 - i / (pts.length - 1)) * clamp((per - 7.5) / 6, 0, 1); seg(pts[i], pts[i + 1], R.LW * (1 - i / pts.length), COL.ink); }
      ctx.globalAlpha = 1;
    }
    // la sciarpa: un nastro che passa dove il collo è appena stato
    const sp = [], f = A.fs;
    for (let i = 0; i < 9; i++) {
      const nk = neckAt(clock - i * 0.03), fl = (0.0236 * Math.sin(clock * 9 - i * 0.9) * i) / 4; let q = [nk[0] - f * 0.0334 * i, nk[1] - 0.0047 * i * i + fl];
      if (sp.length) { const p = sp[sp.length - 1], dx = q[0] - p[0], dy = q[1] - p[1], dd = Math.hypot(dx, dy); if (dd > 0.165) q = [p[0] + (dx / dd) * 0.165, p[1] + (dy / dd) * 0.165]; }
      sp.push(q);
    }
    for (let i = 0; i < 8; i++) { ctx.globalAlpha = 1 - 0.07 * i; seg(sp[i], sp[i + 1], R.LW * (1 - i / 11), COL.scarf); }
    ctx.globalAlpha = 1;
    limb(J.chest, J.e[1], J.h[1], COL.back); limb(J.pelvis, J.k[1], J.f[1], COL.back);
    limb(J.pelvis, J.mid, J.chest, COL.ink); seg(J.chest, J.neck, R.LW, COL.ink);
    if (hero.bag) {                  // la tracolla: dentro ci finiscono gli attrezzi
      const bx = J.pelvis[0] - 0.13 * A.fs, by = J.pelvis[1] + 0.08, w = 0.26 * Z, hh = 0.2 * Z, X = sx(bx) - w / 2, Y = sy(by);
      seg([J.chest[0] + 0.03 * A.fs, J.chest[1] - 0.03], [bx + 0.03 * A.fs, by], 0.026, COL.bag);
      ctx.fillStyle = '#000'; ctx.strokeStyle = COL.bag; ctx.lineWidth = Math.max(1.2, 0.03 * Z);
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(X, Y, w, hh, 0.05 * Z); else ctx.rect(X, Y, w, hh); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X, Y + hh * 0.42); ctx.lineTo(X + w, Y + hh * 0.42); ctx.stroke();
    }
    limb(J.pelvis, J.k[0], J.f[0], COL.ink); limb(J.chest, J.e[0], J.h[0], COL.ink);
    ctx.fillStyle = '#000'; ctx.strokeStyle = COL.ink; ctx.lineWidth = R.LW * Z; ctx.beginPath(); ctx.arc(sx(J.head[0]), sy(J.head[1]), R.HEAD * Z, 0, 7); ctx.fill(); ctx.stroke();
    const ex = A.expr, blink = (clock + 0.37) % 3.4 < 0.09; ctx.fillStyle = COL.ink; ctx.strokeStyle = COL.ink;
    J.eyes.forEach((e, i) => {
      const X = sx(e[0]), Y = sy(e[1]), u = Z;
      if (ex === '-' || (blink && ex === 'o')) { ctx.lineWidth = Math.max(1.2, 0.024 * u); ctx.beginPath(); ctx.moveTo(X - 0.031 * u, Y); ctx.lineTo(X + 0.031 * u, Y); ctx.stroke(); }
      else if (ex === '>') { const sg = (A.fs >= 0 ? 1 : -1) * (i === 0 ? 1 : -1); ctx.lineWidth = Math.max(1.2, 0.027 * u); ctx.beginPath(); ctx.moveTo(X - 0.035 * sg * u, Y - 0.0275 * u); ctx.lineTo(X + 0.0275 * sg * u, Y + 0.012 * u); ctx.stroke(); }
      else if (ex === 'x') { ctx.lineWidth = Math.max(1.2, 0.022 * u); ctx.beginPath(); ctx.moveTo(X - 0.028 * u, Y - 0.028 * u); ctx.lineTo(X + 0.028 * u, Y + 0.028 * u); ctx.moveTo(X + 0.028 * u, Y - 0.028 * u); ctx.lineTo(X - 0.028 * u, Y + 0.028 * u); ctx.stroke(); }
      else if (ex === '^') { ctx.lineWidth = Math.max(1.2, 0.024 * u); ctx.beginPath(); ctx.moveTo(X - 0.03 * u, Y + 0.012 * u); ctx.lineTo(X, Y - 0.024 * u); ctx.lineTo(X + 0.03 * u, Y + 0.012 * u); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(X, Y, Math.max(0.9, (ex === 'O' ? 0.043 : 0.03) * u), 0, 7); ctx.fill(); }
    });
  }
  function drawFx() {
    ctx.lineCap = 'round';
    for (const w of waves) {
      const dt = clock - w.t0; if (dt < 0 || dt >= w.life) continue;
      const u = dt / w.life; ctx.globalAlpha = Math.pow(1 - u, 1.5); ctx.strokeStyle = w.col; ctx.lineWidth = Math.max(1, w.w * (1 - u) * Z);
      ctx.beginPath(); ctx.arc(sx(w.pos[0]), sy(w.pos[1]), w.r * (1 - Math.pow(1 - u, 3)) * Z, 0, 7); ctx.stroke();
    }
    for (const b of bursts) {
      const dt = clock - b.t0; if (dt < 0 || dt >= b.life) continue;
      const u = dt / b.life, sz = b.size; ctx.globalAlpha = Math.pow(1 - u, 1.3); ctx.strokeStyle = b.col;
      for (let i = 0; i < b.n; i++) {
        let a = 2 * Math.PI * hsh(i + b.t0 * 7.3); if (b.up) a = Math.PI * (0.08 + 0.84 * hsh(i + b.t0 * 3.1));
        const sp = b.sp * (0.35 + 0.65 * hsh(i * 3 + b.t0)), dist = sp * b.life * (1 - Math.pow(1 - u, 2.2)) * 0.55, ca = Math.cos(a), sa = Math.sin(a);
        const p = [b.pos[0] + ca * dist, b.pos[1] + sa * dist - 0.5 * b.grav * dt * dt];
        if (b.grav && p[1] < b.pos[1] - 0.03) continue;
        ctx.beginPath();
        if (b.kind === 'line') { const Ln = (0.5 * sz * (1 - u) + 0.08) * K; ctx.lineWidth = Math.max(1, 0.09 * K * sz * Z); ctx.moveTo(sx(p[0]), sy(p[1])); ctx.lineTo(sx(p[0] - ca * Ln), sy(p[1] - sa * Ln)); }
        else if (b.kind === 'plus') { const Ln = 0.17 * K * sz * (1 - 0.5 * u) * Z; ctx.lineWidth = Math.max(1, 0.06 * K * sz * Z); ctx.moveTo(sx(p[0]) - Ln, sy(p[1])); ctx.lineTo(sx(p[0]) + Ln, sy(p[1])); ctx.moveTo(sx(p[0]), sy(p[1]) - Ln); ctx.lineTo(sx(p[0]), sy(p[1]) + Ln); }
        else { ctx.lineWidth = Math.max(1, 0.05 * K * sz * Z); ctx.arc(sx(p[0]), sy(p[1]), (0.1 + 0.3 * u) * K * sz * Z, 0, 7); }
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  // l'ultima passata, come nel film: un alone di luce, i bordi colorati e un lampo bianco sui colpi forti
  const gcv = document.createElement('canvas'), gctx = gcv.getContext('2d'), ccv = document.createElement('canvas'), cctx = ccv.getContext('2d');
  const canBlur = typeof gctx.filter === 'string';
  function post() {
    const w = cv.width, h = cv.height, gw = Math.max(2, w >> 2), gh = Math.max(2, h >> 2);
    if (gcv.width !== gw || gcv.height !== gh) { gcv.width = gw; gcv.height = gh; }
    gctx.globalCompositeOperation = 'copy'; if (canBlur) gctx.filter = 'blur(' + Math.max(0.6, 0.0316 * Z * DPR).toFixed(1) + 'px)'; gctx.drawImage(cv, 0, 0, gw, gh);   // l'alone è largo come le linee: uguale a ogni grandezza
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.62; ctx.imageSmoothingEnabled = true; ctx.drawImage(gcv, 0, 0, w, h);
    let ch = 0, fl = 0;
    for (const c of chromas) ch += c.a * Math.max(0, 1 - (clock - c.t0) / 0.16);
    for (const f of flashes) fl += f.a * Math.max(0, 1 - (clock - f.t0) / 0.11);
    ch *= w / 1920;
    if (ch > 0.5) {
      if (ccv.width !== w || ccv.height !== h) { ccv.width = w; ccv.height = h; }
      for (const [col, dx] of [['#ff0000', -ch], ['#00e0ff', ch]]) {
        cctx.globalCompositeOperation = 'copy'; cctx.drawImage(cv, 0, 0); cctx.globalCompositeOperation = 'multiply'; cctx.fillStyle = col; cctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 0.85; ctx.drawImage(ccv, dx, 0);
      }
    }
    if (fl > 0.01) { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.min(0.8, fl); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
    ctx.restore();
  }

  function resize() {
    const w = cv.clientWidth || 320, h = cv.clientHeight || 180, d = Math.min(window.devicePixelRatio || 1, 2);
    if (w === W && h === H && d === DPR && cv.width === Math.round(w * d)) return;
    W = w; H = h; DPR = d; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    Z0 = Math.min(W / 9.4, H / 5.3); GY = Math.round(H * 0.8);
  }
  function render() {
    resize();
    let z = Z0 * cam.zm, kx = 0, ky = 0;
    for (const p of punches) z *= 1 + p.a * Math.exp(-(clock - p.t0) * 9);
    for (const q of shakes) { const d = clock - q.t0, a = q.a * Math.exp(-d * 7); kx += a * Math.sin(d * 61 + q.t0); ky += a * Math.cos(d * 53 + q.t0 * 2); }
    Z = z; const cx0 = cam.x, cy0 = cam.y; cam.x += kx; cam.y += ky;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.setLineDash([]);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const x0 = cam.x - W / 2 / Z - 1, x1 = cam.x + W / 2 / Z + 1, yTop = cam.y + GY / Z + 1, yBot = cam.y - (H - GY) / Z - 1;
    drawBack(x0, x1, yTop, yBot); drawGround(x0, x1);
    if (scene.back) scene.back(S, D, S.T);
    drawHero();
    if (scene.front) scene.front(S, D, S.T);
    drawFx(); post();
    if (opts.progress && S.T > 0 && S.T < scene.dur) {   // un filo in basso: quanto film è passato
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255, 255, 255, .13)'; ctx.fillRect(0, H - 2.5, W, 2.5); ctx.fillStyle = 'rgba(255, 255, 255, .5)'; ctx.fillRect(0, H - 2.5, (W * S.T) / scene.dur, 2.5);
    }
    cam.x = cx0; cam.y = cy0;
  }

  // ---------- il tempo ----------
  function stepSim(dt) {
    clock += dt;
    let dl = dt; if (hitstop > 0) { hitstop -= dt; dl = 0; }     // qualche fotogramma fermo sui colpi forti
    if (dl > 0) {
      S.T += dl;
      const J = hero.jump;
      if (J) {
        const u = (S.T - J.t0) / J.T;
        if (u >= 1) { hero.x = J.x1; hero.y = J.y1; hero.onG = true; hero.jump = null; A.xPrev = hero.x; land(Math.max(1.5, (4 * J.h + (J.y0 - J.y1)) / J.T)); }
        else { hero.x = lerp(J.x0, J.x1, u); hero.y = lerp(J.y0, J.y1, u) + 4 * J.h * u * (1 - u); }
      }
      if (scene.step) scene.step(S, S.T, dl);
    }
    animate(dl);
    const ke = (r) => 1 - Math.exp(-dt * r);
    cam.x += (S.cam.x - cam.x) * ke(S.cam.k); cam.y += (S.cam.y - cam.y) * ke(S.cam.k); cam.zm += (S.cam.zm - cam.zm) * ke(S.cam.kz);
    prune(bursts, 2); prune(waves, 2); prune(ripples, 1.9); prune(shakes, 0.7); prune(punches, 0.5); prune(flashes, 0.12); prune(chromas, 0.17);
  }
  // va a un istante preciso rifacendo tutto dall'inizio, in silenzio (per il fermo immagine e per le prove)
  function seek(t) {
    quiet = true; reset();
    let n = 0; while (S.T < t - 1e-6 && n++ < 60 * 120) stepSim(STEP);
    quiet = false; render();
  }
  const changed = () => { if (opts.onChange) opts.onChange(); };   // chi mostra il film vuole sapere quando parte, si ferma, finisce
  function frame(now) {
    if (!playing) return;
    if (!cv.isConnected) { playing = false; return; }           // la scheda è stata chiusa
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    accT += dt; let n = 0;
    while (accT >= STEP && n < 4) { stepSim(STEP); accT -= STEP; n++; }
    if (n === 4) accT = 0;
    render();
    if (S.T >= scene.dur) { playing = false; if (opts.onEnd) opts.onEnd(); changed(); return; }
    raf = requestAnimationFrame(frame);
  }
  // from: da che istante partire (per le prove; di solito dall'inizio)
  function play(from = 0) {
    cancelAnimationFrame(raf);
    if (from > 0) seek(from); else { reset(); stepSim(0); render(); }
    playing = true; paused = false; accT = 0; last = performance.now(); raf = requestAnimationFrame(frame); changed();
  }
  function stop() { playing = false; paused = false; cancelAnimationFrame(raf); changed(); }
  // la pausa ferma il film dov'è; resume lo fa ripartire da lì
  function pause() { if (!playing) return; playing = false; paused = true; cancelAnimationFrame(raf); changed(); }
  function resume() { if (!paused) return; paused = false; playing = true; accT = 0; last = performance.now(); raf = requestAnimationFrame(frame); changed(); }
  return { play, stop, pause, resume, seek, render, reset, advance: stepSim, state: S, get t() { return S.T; }, get clock() { return clock; }, get playing() { return playing; }, get paused() { return paused; }, dur: scene.dur };
}
