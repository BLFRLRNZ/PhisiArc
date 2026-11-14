// Impostazioni della voce: quale voce (neurale dentro il gioco o del dispositivo) e come suona
// (tono, velocità, alti, bassi, espressività), con una frase di prova.
import { h } from './util.js';
import { t as tr, LOCALE } from './i18n.js';
import { IC } from './icons.js';
import { speak, stopSpeaking, voiceList, bestVoice, setVoice, voiceLabel, voiceCfg, setVoiceCfg, VOICE_DEFAULTS } from './audio.js';
import { NEURAL_VOICES, isDownloaded, loadVoice, forget } from './neural.js';

const sample = () => speak(tr('Ciao! Sono la voce di PhysiArc. Ti leggo le domande e le risposte: tu prevedi, provi e scopri. Pronto a cominciare?'));
const fmt = (x, d = 1) => Number(x).toLocaleString(LOCALE, { maximumFractionDigits: d, signDisplay: 'exceptZero' });

export function voicePanel() {
  const box = h('div', { class: 'voice-panel' });
  const fill = () => {
    const c = voiceCfg(), neural = c.engine === 'neural';
    const engine = h('div', { class: 'chips' },
      h('button', { class: 'chip' + (neural ? ' on' : ''), 'aria-pressed': String(neural), onclick: () => { setVoiceCfg({ engine: 'neural', neural: c.neural || NEURAL_VOICES[0].id }); fill(); } }, tr('Voce neurale ✦')),
      h('button', { class: 'chip' + (!neural ? ' on' : ''), 'aria-pressed': String(!neural), onclick: () => { stopSpeaking(); setVoiceCfg({ engine: 'device' }); fill(); } }, tr('Voce del dispositivo')));
    box.replaceChildren(engine,
      h('p', { class: 'small muted' }, neural
        ? tr('La voce neurale è una voce vera, registrata da una persona e ricreata da un modello che gira dentro il gioco. Si scarica una volta sola, poi funziona anche senza rete.')
        : tr('Usa le voci già installate sul dispositivo: non scarica niente, ma spesso suonano robotiche.')),
      neural ? neuralList(c, fill) : deviceList(fill),
      sliders(c, neural, fill),
      h('div', { class: 'row voice-actions' },
        h('button', { class: 'btn primary', onclick: sample }, h('span', { html: IC.sound }), tr('Prova la voce')),
        h('button', { class: 'btn ghost', onclick: () => { setVoiceCfg({ pitch: 0, speed: 1, treble: 0, bass: 0, expr: VOICE_DEFAULTS.expr }); fill(); } }, tr('Suono di partenza'))));
  };
  fill();
  return box;
}

// le voci neurali: si scaricano una volta, con la barra di avanzamento
function neuralList(c, refill) {
  const wrap = h('div', { class: 'nv-list' });
  for (const v of NEURAL_VOICES) {
    const on = c.neural === v.id;
    const state = h('span', { class: 'small muted' }, '…');
    const bar = h('progress', { max: 1, value: 0, hidden: true });
    const act = h('button', { class: 'btn sm' }, tr('Scarica'));
    const row = h('div', { class: 'nv' + (on ? ' on' : '') },
      h('button', { class: 'nv-pick', 'aria-pressed': String(on), onclick: () => { setVoiceCfg({ neural: v.id }); refill(); } },
        h('b', {}, v.name), h('span', { class: 'small muted' }, ` · ${tr(v.who)} · ${v.mb} MB`)),
      state, bar, act);
    const download = async () => {
      act.disabled = true; bar.hidden = false; state.textContent = tr('Scarico…');
      try {
        await loadVoice(v, (got, tot) => { if (tot) { bar.value = got / tot; state.textContent = `${Math.round((got / tot) * 100)}%`; } });
        setVoiceCfg({ engine: 'neural', neural: v.id });
        refill(); sample();
      } catch {
        state.textContent = tr('Download non riuscito: controlla la connessione e riprova.');
        act.disabled = false; bar.hidden = true;
      }
    };
    isDownloaded(v).then((ok) => {
      if (ok) {
        state.textContent = tr('pronta');
        act.textContent = tr('Togli');
        act.className = 'btn ghost sm';
        act.onclick = async () => { await forget(v); refill(); };
      } else {
        state.textContent = tr('da scaricare');
        act.onclick = download;
      }
    });
    wrap.append(row);
  }
  return wrap;
}

function deviceList(refill) {
  const l = voiceList().slice(0, 6), cur = bestVoice();
  if (!l.length && 'speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', refill, { once: true });
  return l.length > 1 ? h('div', { class: 'chips' }, l.map((v) => h('button', { class: 'chip' + (cur && v.name === cur.name ? ' on' : ''), 'aria-pressed': String(!!cur && v.name === cur.name), onclick: () => { setVoice(v.name); refill(); sample(); } }, voiceLabel(v)))) : h('p', { class: 'small muted' }, tr('Su questo dispositivo c’è una sola voce per questa lingua.'));
}

// i cursori: si sentono subito quando si lascia il cursore
function sliders(c, neural, refill) {
  const mk = (key, label, min, max, step, show, onlyNeural) => {
    if (onlyNeural && !neural) return null;
    const out = h('output', {}, show(c[key]));
    const r = h('input', { type: 'range', min, max, step, value: c[key], 'aria-label': label });
    r.addEventListener('input', () => { out.textContent = show(Number(r.value)); setVoiceCfg({ [key]: Number(r.value) }); });
    r.addEventListener('change', sample);
    return h('label', { class: 'tool-sl voice-sl' }, h('span', {}, label, ' ', out), r);
  };
  void refill;
  return h('div', { class: 'voice-sliders' },
    mk('pitch', tr('Tono'), -6, 4, 0.5, (x) => (x ? tr('{n} semitoni', { n: fmt(x) }) : tr('normale'))),
    mk('speed', tr('Velocità'), 0.7, 1.3, 0.05, (x) => `${fmt(x, 2).replace(/^\+/, '')}×`),
    mk('treble', tr('Alti'), -12, 6, 1, (x) => (x ? `${fmt(x, 0)} dB` : tr('normali')), true),
    mk('bass', tr('Bassi'), -6, 9, 1, (x) => (x ? `${fmt(x, 0)} dB` : tr('normali')), true),
    mk('expr', tr('Espressività'), 0, 1, 0.1, (x) => (x < 0.35 ? tr('calma') : x > 0.65 ? tr('vivace') : tr('media')), true));
}
