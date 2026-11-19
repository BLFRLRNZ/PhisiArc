// Suoni morbidi e voce che legge (accesa da sola per l'Esploratore).
import { SPEECH, LANG } from './i18n.js';
import { S, save } from './state.js';
import { NEURAL_VOICES, synth, play } from './neural.js';

let ctx;
// il contesto audio è uno solo per tutta l'app: lo usano anche i piccoli film della cassetta degli attrezzi (toolanim.js)
export const audioCtx = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());
// su telefoni e tablet l'audio parte solo dopo un tocco: al primo tocco lo si sveglia, così i film non restano muti
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('pointerdown', () => {
    if (!S.settings.sound) return;
    try { const c = audioCtx(); if (c.state === 'suspended') c.resume().catch(() => {}); } catch { /* niente audio */ }
  }, { passive: true, capture: true });
}
function tone(freq, dur, when = 0, type = 'sine', vol = 0.12) {
  if (!S.settings.sound) return;
  try {
    audioCtx();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = ctx.currentTime + when;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  } catch { /* niente audio */ }
}

// ---------- i suoni delle simulazioni (la Valle delle Onde) ----------
// Una nota che si sente davvero: la frequenza scelta col cursore, il volume, la durata. trem fa pulsare il volume
// (la sveglia che trilla, una voce dentro un casco). Restituisce un comando per spegnerla prima.
export function note(freq, { vol = 0.1, dur = 1.2, when = 0, type = 'sine', trem = 0, path = null, vols = null } = {}) {
  if (!S.settings.sound || !(vol > 0)) return null;
  try {
    const c = audioCtx();
    if (c.state === 'suspended') c.resume().catch(() => {});
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + when, v = Math.min(0.3, vol);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    // path: la frequenza che cambia nel tempo, [[secondi, hertz], ...] (la sirena che passa)
    if (path) for (const [dt, f] of path) o.frequency.linearRampToValueAtTime(f, t + dt);
    g.gain.setValueAtTime(0.0001, t);
    if (vols) {
      // vols: il volume che cambia nel tempo, [[secondi, volume], ...] (più forte quando è vicina)
      for (const [dt, w] of vols) g.gain.linearRampToValueAtTime(Math.max(0.0001, Math.min(0.3, w)), t + dt);
    } else {
      g.gain.exponentialRampToValueAtTime(v, t + 0.04);
      g.gain.setValueAtTime(v, t + Math.max(0.05, dur - 0.12));
    }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    if (trem) {
      // il tremolo: un oscillatore lento fa salire e scendere il volume fra zero e il massimo
      const lfo = c.createOscillator(), depth = c.createGain(), am = c.createGain();
      lfo.frequency.value = trem; depth.gain.value = 0.5; am.gain.value = 0.5;
      lfo.connect(depth).connect(am.gain);
      o.connect(am).connect(g);
      lfo.start(t); lfo.stop(t + dur + 0.05);
    } else o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
    return { stop: () => { try { g.gain.cancelScheduledValues(c.currentTime); g.gain.setTargetAtTime(0.0001, c.currentTime, 0.03); o.stop(c.currentTime + 0.2); } catch { /* già finita */ } } };
  } catch { return null; }
}

// Un boato: rumore che si spegne piano, filtrato verso i bassi (il tuono, un'esplosione).
export function boom({ vol = 0.3, dur = 1.6, when = 0, cut = 260, white = false } = {}) {
  if (!S.settings.sound || !(vol > 0)) return;
  try {
    const c = audioCtx();
    if (c.state === 'suspended') c.resume().catch(() => {});
    const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    let b = 0;
    // rumore «marrone», cupo (il tuono); oppure bianco, che frigge (un vetro che si rompe)
    for (let i = 0; i < n; i++) { const r = Math.random() * 2 - 1; b = (b + 0.02 * r) / 1.02; d[i] = white ? r * 0.5 : b * 3.5; }
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + when;
    src.buffer = buf;
    f.type = 'lowpass';
    f.frequency.value = cut;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.min(0.6, vol), t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t);
    src.stop(t + dur + 0.05);
  } catch { /* niente audio */ }
}

export const sfx = {
  ok: () => { tone(660, 0.15); tone(880, 0.2, 0.1); },
  no: () => tone(220, 0.22, 0, 'triangle', 0.1),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, i * 0.11)),
  tick: () => tone(1200, 0.04, 0, 'square', 0.03),
};

// ---------- la voce ----------
// Il browser ha spesso molte voci: quelle «naturali» (neurali, online, avanzate) suonano molto meglio di quelle
// di base. Si sceglie la migliore della lingua giusta; chi vuole può sceglierne un'altra dalle impostazioni.
const HAS = typeof window !== 'undefined' && 'speechSynthesis' in window;
let voices = [];
const loadVoices = () => { if (HAS) voices = speechSynthesis.getVoices(); };
if (HAS) { loadVoices(); speechSynthesis.addEventListener?.('voiceschanged', loadVoices); }

const GOOD = /natural|neural|online|enhanced|premium|siri|google|wavenet|studio/i;
const BAD = /compact|espeak|eloquence|novelty|whisper|bells|organ|zarvox|trinoids|bad news|jester|superstar|bubbles|albert|grandma|grandpa|rocko|shelley|flo|reed|sandy|eddy/i;
// nomi di voci di buona qualità che si trovano spesso sui dispositivi
const FAVS = LANG === 'en' ? /serena|daniel|kate|libby|sonia|ryan|martha|arthur|stephanie/i : /alice|federica|emma|paola|elsa|isabella|diego|giuseppe|luca|federico|ludovica/i;
const score = (v) => {
  let s = 0;
  if (v.lang === SPEECH) s += 4; else if (v.lang && v.lang.slice(0, 2) === SPEECH.slice(0, 2)) s += 2; else return -99;
  if (GOOD.test(v.name)) s += 6;
  if (FAVS.test(v.name)) s += 2;
  if (BAD.test(v.name)) s -= 8;
  if (v.localService === false) s += 1; // le voci in rete di solito sono quelle neurali
  return s;
};
// le voci della lingua, dalla migliore
export const voiceList = () => voices.filter((v) => score(v) > -99).sort((a, b) => score(b) - score(a));
export function bestVoice() {
  const list = voiceList();
  return list.find((v) => v.name === S.settings.voiceName) || list[0] || null;
}
export const isNatural = (v) => GOOD.test(v.name) && !BAD.test(v.name);
// il nome da mostrare: senza marca, lingua e parentesi
export const voiceLabel = (v) => v.name.replace(/^(Microsoft|Google|Apple)\s+/, '').replace(/\s*\(.*\)\s*/g, ' ').replace(/\s+-\s+.*$/, '').replace(/\s+(Online|Natural)\b.*$/i, '').trim() + (isNatural(v) ? ' ✦' : '');
export const setVoice = (name) => { S.settings.voiceName = name; save(); };

// Simboli e unità si leggono a parole: «m/s» non è «emme barra esse».
const WORDS = LANG === 'en' ? [
  [/m\/s²/g, ' metres per second squared'], [/m\/s/g, ' metres per second'], [/km\/h/g, ' kilometres per hour'], [/rad\/s/g, ' radians per second'],
  [/(\d)\s?km\b/g, '$1 kilometres'], [/(\d)\s?cm\b/g, '$1 centimetres'], [/(\d)\s?mm\b/g, '$1 millimetres'], [/(\d)\s?kg\b/g, '$1 kilograms'], [/(\d)\s?m\b/g, '$1 metres'], [/(\d)\s?s\b/g, '$1 seconds'], [/(\d)\s?g\b/g, '$1 grams'], [/(\d)\s?Hz\b/g, '$1 hertz'], [/(\d)\s?J\b/g, '$1 joules'], [/(\d)\s?N\b/g, '$1 newtons'],
  [/(?<!\p{L})sin(?!\p{L})/gu, 'sine of '], [/(?<!\p{L})cos(?!\p{L})/gu, 'cosine of '],
  [/²/g, ' squared'], [/³/g, ' cubed'], [/√/g, ' the square root of '], [/π/g, ' pi '], [/θ/g, ' theta '], [/Δ/g, ' change in '], [/≈/g, ' about '],
  [/\s?[×·]\s?/g, ' times '], [/\s÷\s|\s\/\s|(?<=[\w)])\/(?=[\w(])/g, ' divided by '], [/\s=\s/g, ' equals '], [/→/g, ', '], [/°/g, ' degrees'], [/[★☆]/g, ''], [/vₓ/g, 'v x'], [/v_y/g, 'v y'], [/v₀/g, 'v nought'],
] : [
  [/m\/s²/g, ' metri al secondo quadrato'], [/m\/s/g, ' metri al secondo'], [/km\/h/g, ' chilometri orari'], [/rad\/s/g, ' radianti al secondo'],
  [/(\d)\s?km\b/g, '$1 chilometri'], [/(\d)\s?cm\b/g, '$1 centimetri'], [/(\d)\s?mm\b/g, '$1 millimetri'], [/(\d)\s?kg\b/g, '$1 chili'], [/(\d)\s?m\b/g, '$1 metri'], [/(\d)\s?s\b/g, '$1 secondi'], [/(\d)\s?g\b/g, '$1 grammi'], [/(\d)\s?Hz\b/g, '$1 hertz'], [/(\d)\s?J\b/g, '$1 joule'], [/(\d)\s?N\b/g, '$1 newton'],
  [/(?<!\p{L})(sin|sen)(?!\p{L})/gu, 'seno di '], [/(?<!\p{L})cos(?!\p{L})/gu, 'coseno di '],
  [/²/g, ' al quadrato'], [/³/g, ' al cubo'], [/√/g, ' radice di '], [/π/g, ' pi greco '], [/θ/g, ' teta '], [/Δ/g, ' variazione di '], [/≈/g, ' circa '],
  [/\s?[×·]\s?/g, ' per '], [/\s÷\s|\s\/\s|(?<=[\w)])\/(?=[\w(])/g, ' diviso '], [/\s=\s/g, ' uguale '], [/→/g, ', '], [/°/g, ' gradi'], [/[★☆]/g, ''], [/vₓ/g, 'v x'], [/v_y/g, 'v y'], [/v₀/g, 'v zero'],
];
export function speechText(text) {
  let s = String(text || '').replace(/\s+/g, ' ');
  for (const [re, w] of WORDS) s = s.replace(re, w);
  return s.replace(/[«»“”"]/g, '').replace(/([!?…])\.+/g, '$1').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/\s+([,.;:!?])/g, '$1').replace(/ {2,}/g, ' ').trim();
}
// Il testo si legge a pezzi, come farebbe una persona: una frase alla volta, e le frasi lunghe spezzate alle virgole.
// Fra un pezzo e l'altro c'è una pausa vera, lunga quanto la punteggiatura chiede: la voce del browser da sola
// tende a leggere tutto d'un fiato.
const PAUSE = { '¶': 750, '.': 480, '!': 480, '?': 560, '…': 560, ':': 340, ';': 300, ',': 170 };
export function chunks(s) {
  const out = [];
  for (const para of s.split('¶')) {
    const sents = para.match(/[^.!?…]+(?:[.!?…]+|$)/g) || [];
    for (let sent of sents) {
      sent = sent.trim();
      if (!/[\p{L}\d]/u.test(sent)) continue;
      // le frasi lunghe si spezzano a «:» e «;», e alle virgole solo se il pezzo resta abbastanza lungo
      const raw = sent.length > 70 ? sent.split(/(?<=[:;,])\s+/u) : [sent];
      // niente pezzetti corti: si riuniscono con il successivo (o con il precedente, se sono in fondo)
      const parts = [];
      for (const r of raw) { if (parts.length && (parts[parts.length - 1].length < 28 || r.length < 18)) parts[parts.length - 1] += ' ' + r; else parts.push(r); }
      for (const p of parts) if (/[\p{L}\d]/u.test(p)) out.push({ text: p.trim(), pause: PAUSE[p.trim().slice(-1)] ?? 300 });
    }
    if (out.length) out[out.length - 1].pause = Math.max(out[out.length - 1].pause, PAUSE['¶']);
  }
  return out;
}

// ---------- le impostazioni della voce ----------
// engine: 'neural' (Piper, dentro il gioco) o 'device' (le voci del dispositivo).
// pitch in semitoni, speed (1 = normale), treble e bass in dB (solo voce neurale), expr = espressività 0..1.
export const VOICE_DEFAULTS = { engine: 'device', neural: null, pitch: 0, speed: 1, treble: 0, bass: 0, expr: 0.5 };
export const voiceCfg = () => ({ ...VOICE_DEFAULTS, ...(S.settings.voce || {}) });
export const setVoiceCfg = (patch) => { S.settings.voce = { ...voiceCfg(), ...patch }; save(); };
const neuralVoice = () => { const c = voiceCfg(); return c.engine === 'neural' ? NEURAL_VOICES.find((v) => v.id === c.neural) || null : null; };

let gen = 0, timer = 0, playing = null;
export function speak(text) {
  stopSpeaking();
  const list = chunks(speechText(text));
  if (!list.length) return;
  const nv = neuralVoice();
  if (nv) speakNeural(nv, list, gen); else speakDevice(list, gen);
}

// La voce neurale: mentre suona un pezzo si prepara già il successivo, così fra i due resta solo la pausa voluta.
async function speakNeural(nv, list, my) {
  const c = voiceCfg();
  const base = S.lens === 'e' ? 0.9 : 0.97;
  const opts = { speed: base * c.speed, pitch: c.pitch, expr: c.expr };
  const make = (i) => (i < list.length ? synth(nv, list[i].text, { ...opts, pitch: opts.pitch + (/\?$/.test(list[i].text) ? 0.3 : 0) }) : null);
  try {
    let next = make(0);
    for (let i = 0; i < list.length; i++) {
      const cur = await next;
      if (my !== gen) return;
      next = make(i + 1);
      playing = play(cur, { treble: c.treble, bass: c.bass });
      await playing.done;
      playing = null;
      if (my !== gen) return;
      await new Promise((ok) => { timer = setTimeout(ok, list[i].pause); });
      if (my !== gen) return;
    }
  } catch (e) {
    // se la voce neurale non parte (rete, memoria…), legge la voce del dispositivo
    console.warn('voce neurale non disponibile:', e);
    if (my === gen) speakDevice(list, my);
  }
}

function speakDevice(list, my) {
  if (!HAS) return;
  if (!voices.length) loadVoices();
  const v = bestVoice(), c = voiceCfg();
  // un po' più piano del normale: si capisce meglio e suona meno meccanico; l'Esploratore ancora più calmo
  const rate = (S.lens === 'e' ? 0.88 : 0.95) * c.speed;
  const pitch = Math.min(2, Math.max(0, 1 + c.pitch / 12));
  const say = (i) => {
    if (my !== gen || i >= list.length) return;
    const { text: t, pause } = list[i];
    const u = new SpeechSynthesisUtterance(t);
    u.lang = v ? v.lang : SPEECH;
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = /\?$/.test(t) ? pitch * 1.04 : pitch; // le domande salgono appena
    let done = false;
    const next = () => { if (done) return; done = true; clearTimeout(timer); timer = setTimeout(() => say(i + 1), pause); };
    u.onend = next;
    u.onerror = next;
    // alcuni browser a volte non avvisano quando hanno finito: si va avanti lo stesso dopo un tempo ragionevole
    clearTimeout(timer);
    timer = setTimeout(() => { if (!speechSynthesis.speaking) next(); else timer = setTimeout(function wait() { if (!speechSynthesis.speaking) next(); else timer = setTimeout(wait, 250); }, 250); }, 600 + t.length * 75 / rate);
    speechSynthesis.speak(u);
  };
  // dopo cancel() Chrome a volte perde la prima frase: si aspetta un attimo
  timer = setTimeout(() => say(0), 60);
}

export function stopSpeaking() {
  gen++;
  clearTimeout(timer);
  if (playing) { playing.stop(); playing = null; }
  if (HAS) speechSynthesis.cancel();
}
