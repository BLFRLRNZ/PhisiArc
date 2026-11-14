// La voce neurale: Piper (rhasspy/piper) gira dentro il browser, senza server.
// - espeak-ng (in WebAssembly) trasforma il testo in fonemi;
// - onnxruntime-web fa girare il modello della voce, che restituisce l'audio;
// - il Web Audio lo suona passando per i controlli: tono, velocità, alti, bassi.
// Il modello (decine di MB) si scarica una volta sola, quando lo si sceglie, e resta nella cache del browser.
import { LANG } from './i18n.js';

const ORT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/';
const PHON = 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/';
const HF = 'https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/';
// Solo per i test: window.__phisiarcVoce = { base: '...', voices: [...] } fa usare file locali.
const TEST = typeof window !== 'undefined' && window.__phisiarcVoce;
const at = (base, f) => (TEST ? TEST.base : base) + f;

// le voci, per lingua: mb = quanto pesa il download
const ALL = {
  it: [
    { id: 'it_IT-paola-medium', name: 'Paola', who: 'donna', mb: 63, path: 'it/it_IT/paola/medium/' },
    { id: 'it_IT-riccardo-x_low', name: 'Riccardo', who: 'uomo', mb: 28, path: 'it/it_IT/riccardo/x_low/' },
  ],
  en: [
    { id: 'en_GB-alba-medium', name: 'Alba', who: 'woman', mb: 63, path: 'en/en_GB/alba/medium/' },
    { id: 'en_GB-jenny_dioco-medium', name: 'Jenny', who: 'woman', mb: 63, path: 'en/en_GB/jenny_dioco/medium/' },
    { id: 'en_GB-northern_english_male-medium', name: 'Liam', who: 'man', mb: 63, path: 'en/en_GB/northern_english_male/medium/' },
    { id: 'en_GB-alan-medium', name: 'Alan', who: 'man', mb: 63, path: 'en/en_GB/alan/medium/' },
  ],
};
export const NEURAL_VOICES = TEST?.voices || ALL[LANG] || ALL.it;
const modelUrl = (v) => (TEST ? TEST.base + v.id + '.onnx' : HF + v.path + v.id + '.onnx');

// ---------- la cache dei file grandi ----------
const CACHE = 'phisiarc-voci';
async function cachedFetch(url, onProgress) {
  let cache = null;
  try { cache = await caches.open(CACHE); const hit = await cache.match(url); if (hit) return await hit.arrayBuffer(); } catch { /* niente cache */ }
  const res = await fetch(url);
  if (!res.ok) throw new Error('download ' + res.status);
  const total = +(res.headers.get('Content-Length') || 0);
  const reader = res.body?.getReader();
  let buf;
  if (reader) {
    const parts = []; let got = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; parts.push(value); got += value.length; onProgress?.(got, total); }
    buf = new Uint8Array(got); let o = 0; for (const p of parts) { buf.set(p, o); o += p.length; }
    buf = buf.buffer;
  } else buf = await res.arrayBuffer();
  try { await cache?.put(url, new Response(buf.slice(0), { headers: { 'Content-Type': 'application/octet-stream' } })); } catch { /* spazio pieno: pazienza */ }
  return buf;
}
export async function isDownloaded(v) {
  if (loaded?.id === v.id) return true;
  try { const c = await caches.open(CACHE); return !!(await c.match(modelUrl(v))); } catch { return false; }
}
// Chiede al browser di non buttare i file salvati quando cerca spazio (le voci pesano decine di MB).
export function keepStorage() {
  try { navigator.storage?.persist?.().catch(() => {}); } catch { /* non c'è */ }
}
// Se una voce si sta scaricando: chi apre di nuovo le impostazioni può seguirne l'avanzamento.
// Restituisce null, oppure { p (la promessa), watch(fn) } dove fn(got, tot) riceve l'avanzamento.
export function downloading(v) {
  if (loading?.id !== v.id) return null;
  const l = loading;
  return { p: l.p, watch: (fn) => { l.fns.add(fn); if (l.last) fn(...l.last); } };
}
export async function forget(v) {
  try { const c = await caches.open(CACHE); await c.delete(modelUrl(v)); await c.delete(modelUrl(v) + '.json'); } catch { /* niente */ }
  if (loaded?.id === v.id) loaded = null;
}

// ---------- i motori ----------
let ortP = null;
function loadOrt() {
  if (window.ort) return Promise.resolve(window.ort);
  return (ortP ||= new Promise((ok, ko) => {
    const s = document.createElement('script');
    s.src = at(ORT, 'ort.wasm.min.js');
    s.onload = () => { window.ort.env.wasm.wasmPaths = TEST ? TEST.base : ORT; window.ort.env.wasm.numThreads = 1; ok(window.ort); };
    s.onerror = () => { ortP = null; ko(new Error('onnxruntime')); };
    document.head.append(s);
  }));
}
let phonP = null;
const loadPhon = () => (phonP ||= Promise.all([
  import('./vendor/piper-phonemize.js'),
  cachedFetch(at(PHON, 'piper_phonemize.wasm')),
  cachedFetch(at(PHON, 'piper_phonemize.data')),
]).catch((e) => { phonP = null; throw e; }));

async function phonemize(text, espeakVoice) {
  const [{ createPiperPhonemize }, wasm, data] = await loadPhon();
  return new Promise((ok, ko) => {
    createPiperPhonemize({
      wasmBinary: wasm,
      getPreloadedPackage: () => data,
      print: (out) => { try { ok(JSON.parse(out).phoneme_ids); } catch (e) { ko(e); } },
      printErr: () => {},
      locateFile: (f) => at(PHON, f),
    }).then((m) => m.callMain(['-l', espeakVoice, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data'])).catch(ko);
  });
}

// la voce caricata: { id, cfg, session }
let loaded = null, loading = null;
export async function loadVoice(v, onProgress) {
  if (loaded?.id === v.id) return loaded;
  if (loading?.id === v.id) { if (onProgress) loading.fns.add(onProgress); return loading.p; }
  const fns = new Set(onProgress ? [onProgress] : []);
  const entry = { id: v.id, fns, last: null };
  const progress = (got, tot) => { entry.last = [got, tot]; for (const f of fns) f(got, tot); };
  keepStorage();
  const p = (async () => {
    const [ort, cfgBuf, model] = await Promise.all([
      loadOrt(),
      cachedFetch(modelUrl(v) + '.json'),
      cachedFetch(modelUrl(v), progress),
      loadPhon(),
    ]);
    const cfg = JSON.parse(new TextDecoder().decode(cfgBuf));
    const session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
    loaded = { id: v.id, cfg, session, ort };
    return loaded;
  })();
  entry.p = p;
  loading = entry;
  try { return await p; } finally { if (loading?.p === p) loading = null; }
}
export const voiceReady = (v) => loaded?.id === v.id;

// testo → campioni audio. opts: speed (1 normale), pitch (semitoni), expr (espressività 0..1)
export async function synth(v, text, opts = {}) {
  const { cfg, session, ort } = await loadVoice(v);
  const ids = await phonemize(text, cfg.espeak.voice);
  const inf = cfg.inference || {};
  // Il tono si abbassa rallentando il suono (vedi play): qui si genera più veloce, così la durata resta quella scelta.
  const rate = 2 ** ((opts.pitch || 0) / 12);
  const length = (inf.length_scale ?? 1) / (opts.speed || 1) * rate;
  const expr = opts.expr ?? 0.5;
  const feeds = {
    input: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
    scales: new ort.Tensor('float32', Float32Array.from([(inf.noise_scale ?? 0.667) * (0.6 + 0.8 * expr), length, (inf.noise_w ?? 0.8) * (0.6 + 0.8 * expr)]), [3]),
  };
  if (cfg.speaker_id_map && Object.keys(cfg.speaker_id_map).length) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]), [1]);
  const out = await session.run(feeds);
  return { pcm: out.output.data, sampleRate: cfg.audio.sample_rate, rate };
}

// ---------- suonare, con i filtri ----------
let ac = null;
const audio = () => (ac ||= new (window.AudioContext || window.webkitAudioContext)());
// opts: treble e bass in dB; restituisce una promessa che finisce quando il suono è finito, e una funzione per fermarlo
export function play({ pcm, sampleRate, rate }, opts = {}) {
  const ctx = audio();
  if (ctx.state === 'suspended') ctx.resume();
  const buf = ctx.createBuffer(1, pcm.length, sampleRate);
  buf.copyToChannel(pcm instanceof Float32Array ? pcm : Float32Array.from(pcm), 0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate || 1;
  const low = ctx.createBiquadFilter(); low.type = 'lowshelf'; low.frequency.value = 220; low.gain.value = opts.bass || 0;
  const high = ctx.createBiquadFilter(); high.type = 'highshelf'; high.frequency.value = 3200; high.gain.value = opts.treble || 0;
  // un compressore leggero tiene il volume uniforme anche alzando i bassi
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
  const vol = ctx.createGain(); vol.gain.value = 0.95;
  src.connect(low).connect(high).connect(comp).connect(vol).connect(ctx.destination);
  let stop;
  const done = new Promise((ok) => { src.onended = ok; stop = () => { try { src.stop(); } catch { /* già finito */ } ok(); }; });
  src.start();
  return { done, stop };
}
