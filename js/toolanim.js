// Il riproduttore dei piccoli film della cassetta degli attrezzi (toolfilm.js): matematica e fisica.
// L'omino «fa» la matematica e la fisica: corre, tira, spinge e lancia, e le idee si vedono muovere prima di diventare parole o formule.
// Il film parte quando si vede, aspetta se esce dallo schermo, si ferma se lo si tocca,
// e alla fine lascia l'ultimo fotogramma con il bottone per rivederlo.
import { h } from './util.js';
import { t as tr } from './i18n.js';
import { S } from './state.js';
import { audioCtx } from './audio.js';
import { makeStage, makeSound, fontsReady } from './toon.js';
import { FILMS } from './toolfilm.js';

const calm = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
// i suoni dei film rispettano l'interruttore dei suoni dell'app
const filmSound = makeSound(() => !!S.settings.sound, audioCtx);
const ICON = {
  pause: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2.5" width="3.6" height="11" rx="1" fill="currentColor"/><rect x="9.4" y="2.5" width="3.6" height="11" rx="1" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.4 13.4 8 4 13.6z" fill="currentColor"/></svg>',
  again: '↺',
};
const LABEL = { pause: 'Ferma il film', play: 'Fai partire il film', again: 'Guarda di nuovo' };

export function toolAnim(id) {
  const film = FILMS[id];
  return film ? filmPlayer(film) : null;
}

// Un film qualunque (una scena di toon.js) dentro il suo riquadro nero, con il bottone ferma/riparti/rivedi.
export function filmPlayer(film) {
  const cv = h('canvas', { class: 'ta-cv', 'aria-hidden': 'true' });
  const btn = h('button', { class: 'btn icon sm ta-replay' });
  const wrap = h('div', { class: 'ta-wrap film' }, cv, btn);
  const still = calm();
  let started = false, watched = false, auto = false;   // partito almeno una volta; visto fino in fondo; fermato da solo perché uscito dallo schermo
  // il bottone dice quello che farà: fermare, far partire, ricominciare
  const sync = () => {
    const what = stage.playing ? 'pause' : watched && !stage.paused && stage.t >= film.dur - 0.05 ? 'again' : 'play';
    btn.innerHTML = ICON[what]; btn.title = tr(LABEL[what]); btn.setAttribute('aria-label', tr(LABEL[what]));
    wrap.classList.toggle('playing', stage.playing);
  };
  const stage = makeStage(cv, film, { reduce: still, sound: filmSound, progress: true, onEnd: () => { watched = true; }, onChange: () => sync() });
  cv.__film = stage;                                  // per le prove automatiche
  // un tocco sul film o sul bottone: ferma, fa ripartire, o ricomincia da capo
  const toggle = () => { started = true; auto = false; if (stage.playing) stage.pause(); else if (stage.paused) stage.resume(); else stage.play(); };
  btn.onclick = toggle; cv.onclick = toggle;
  stage.seek(0); sync();
  fontsReady().then(() => { if (!stage.playing) stage.render(); });
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => { if (!cv.isConnected) { if (started) ro.disconnect(); return; } if (!stage.playing) stage.render(); });
    ro.observe(cv);
  }
  // chi ha chiesto meno movimento vede subito la formula finita: il film parte solo se lo chiede con il bottone
  const begin = () => { if (started) return; started = true; if (still) { stage.seek(film.dur); sync(); } else stage.play(); };
  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver((es) => {
      const r = es[es.length - 1].intersectionRatio;
      if (!cv.isConnected && started) { io.disconnect(); return; }
      if (r >= 0.3) { if (!started) begin(); else if (auto && stage.paused) { auto = false; stage.resume(); } }
      else if (r < 0.05 && stage.playing) { auto = true; stage.pause(); }      // uscito dallo schermo: aspetta
    }, { threshold: [0, 0.05, 0.3] });
    io.observe(cv);
  } else requestAnimationFrame(begin);
  wrap.stop = () => stage.stop();
  return wrap;
}
