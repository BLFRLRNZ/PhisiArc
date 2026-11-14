// Suoni morbidi e voce che legge (accesa da sola per l'Esploratore).
import { SPEECH, LANG } from './i18n.js';
import { S, save } from './state.js';

let ctx;
function tone(freq, dur, when = 0, type = 'sine', vol = 0.12) {
  if (!S.settings.sound) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
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
  return s.replace(/[«»“”"]/g, '').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/\s+([,.;:!?])/g, '$1').replace(/ {2,}/g, ' ').trim();
}
// Una frase alla volta: le pause fra le frasi vengono naturali, e Chrome non taglia i testi lunghi.
const sentences = (s) => s.match(/[^.!?…:]+[.!?…:]*\s*/g)?.map((x) => x.trim()).filter((x) => /\w/.test(x)) || [];

let gen = 0;
export function speak(text) {
  if (!HAS) return;
  speechSynthesis.cancel();
  const my = ++gen;
  if (!voices.length) loadVoices();
  const v = bestVoice();
  // l'Esploratore ascolta un po' più piano; gli altri a un ritmo normale
  const rate = S.lens === 'e' ? 0.92 : 1.0;
  const parts = sentences(speechText(text));
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = v ? v.lang : SPEECH;
    if (v) u.voice = v;
    u.rate = rate;
    // le domande salgono appena di tono, come quando si parla
    u.pitch = /\?$/.test(p) ? 1.08 : 1.0;
    if (i === 0) u.onstart = () => { if (my !== gen) speechSynthesis.cancel(); };
    speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  gen++;
  if (HAS) speechSynthesis.cancel();
}
