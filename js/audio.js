// Suoni morbidi e voce che legge (per l'Esploratore).
import { SPEECH } from './i18n.js';
import { S } from './state.js';

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

export function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = SPEECH;
  u.rate = 0.95;
  const it = speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith(SPEECH.slice(0, 2)));
  if (it) u.voice = it;
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
