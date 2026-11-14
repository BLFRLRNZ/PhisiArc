// PhisiArc: schermate, navigazione e impostazioni.
import { h, tx } from './util.js';
import { S, save, exportCode, importCode, resetAll } from './state.js';
import { CAST, CAST_LIST, charSVG, hop } from './cast.js';
import { IC } from './icons.js';
import { playIntro } from './intro.js';
import { runLevel } from './level.js';
import {
  WORLDS, ZONES, KIND, LENSES, GRADES, ALL_PIECES,
  worldById, worldOpen, worldDone, worldReady, zoneOpen, zoneDone, levelOpen, levelById, gradeNow,
} from './content/index.js';

const app = document.getElementById('app');
let cleanup = null;

const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

const logo = () => h('a', { class: 'logo', href: '#/', 'aria-label': 'PhisiArc, torna ai mondi' },
  h('span', { class: 'logo-mark', html: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 27 Q16 -7 28 27"/><path d="M2 27h28"/><circle cx="16" cy="10" r="2.6"/></svg>' }),
  h('span', {}, 'Phisi', h('span', { class: 'arc' }, 'Arc')));
const hopOnTap = (el) => { el.addEventListener('click', (e) => { const svg = e.currentTarget.querySelector('svg.m'); if (svg) hop(svg); }); return el; };

function topbar() {
  const g = gradeNow();
  return h('header', { class: 'top' },
    logo(),
    h('nav', { class: 'top-right' },
      h('a', { class: 'pill', href: '#/gradi', title: 'Il tuo grado' }, h('span', { html: IC.grade }), h('span', { class: 'pill-t' }, g.name)),
      h('span', { class: 'pill num', title: 'Joule guadagnati' }, h('span', { class: 'sun', html: IC.bolt }), `${S.joule} J`),
      h('a', { class: 'pill icon', href: '#/parco', title: 'Il tuo parco', 'aria-label': 'Il tuo parco', html: IC.park }),
      h('a', { class: 'pill icon', href: '#/impostazioni', title: 'Impostazioni', 'aria-label': 'Impostazioni', html: IC.gear })));
}

// ---------- benvenuto: scelta della lente ----------
function welcome() {
  const cards = Object.entries(LENSES).map(([k, l]) => hopOnTap(h('button', {
    class: 'lens-card' + (S.lens === k ? ' on' : ''), style: `--c:${CAST[l.char].c}`,
    onclick: () => { S.lens = k; save(); setTimeout(() => go('#/'), 380); },
  }, h('div', { class: 'lens-who', html: charSVG(l.char) }), h('h3', {}, l.name), h('div', { class: 'age' }, l.age), h('p', {}, l.desc))));
  const strip = CAST_LIST.filter((c) => !c.boss).map((c) => hopOnTap(h('span', { class: 'strip-c', title: c.name, html: charSVG(c.id) })));
  return h('div', { class: 'welcome' },
    h('div', { class: 'hero' },
      h('div', { class: 'strip' }, strip),
      h('h1', { class: 'big-logo' }, 'Phisi', h('span', { class: 'arc' }, 'Arc')),
      h('p', { class: 'tag' }, 'La fisica a livelli. ', h('b', {}, 'Prevedi. Prova. Scopri.'))),
    h('h2', {}, 'Come vuoi giocare?'),
    h('p', { class: 'muted' }, 'Il percorso è lo stesso per tutti; cambia come si spiega. Puoi cambiare quando vuoi dalle impostazioni.'),
    h('div', { class: 'lens-grid' }, cards));
}

// ---------- mappa dei mondi ----------
function home() {
  const list = WORLDS.map((w) => {
    const ready = worldReady(w), open = ready && worldOpen(w), done = worldDone(w);
    let total = 0, got = 0;
    if (ready) for (const z of w.zones) for (const l of ZONES[z].levels) { total++; if (S.done[l.id]) got++; }
    const status = !ready ? 'In arrivo' : !open ? `Si apre dopo ${w.requires.map((r) => worldById(r).name).join(' e ')}` : done ? 'Completato' : `${got} di ${total} livelli`;
    const body = h('div', { class: 'wbody' },
      h('div', { class: 'wnum' }, `Mondo ${String(w.n).padStart(2, '0')}`),
      h('h3', {}, w.name),
      h('div', { class: 'muted small' }, w.place),
      ready ? h('div', { class: 'bar' }, h('span', { style: `width:${total ? (100 * got) / total : 0}%` })) : null,
      h('div', { class: 'small wstatus' }, status),
      !ready ? h('div', { class: 'small muted soon' }, w.soon.join(' · ')) : null);
    const who = [w.mascot, w.buddy].filter(Boolean).map((id) => charSVG(id)).join('');
    const icon = h('div', { class: 'wicon' + (w.buddy ? ' two' : ''), html: who });
    if (!open) icon.append(h('span', { class: 'wlock', html: IC.lock }));
    const cls = 'world' + (open ? ' open' : ' locked') + (done ? ' done' : '') + (ready ? '' : ' soon-w');
    return open ? h('a', { class: cls, style: `--c:${w.color}`, href: `#/mondo/${w.id}` }, icon, body) : hopOnTap(h('div', { class: cls, style: `--c:${w.color}` }, icon, body));
  });
  return h('div', { class: 'page' }, topbar(),
    h('div', { class: 'page-in' },
      h('h1', {}, 'I mondi'),
      h('p', { class: 'muted' }, `Stai giocando come ${LENSES[S.lens].name}. Ogni mondo è un’area della fisica: ci sono 12 mondi, i primi due sono già aperti.`),
      h('div', { class: 'worlds' }, list)));
}

// ---------- un mondo: zone e livelli ----------
function world(id) {
  const w = worldById(id);
  if (!w || !worldReady(w) || !worldOpen(w)) return home();
  const zones = w.zones.map((zid) => {
    const z = ZONES[zid], open = zoneOpen(zid);
    const lv = z.levels.map((l) => {
      const ok = levelOpen(l.id), st = S.done[l.id] || 0;
      const inner = [h('span', { class: 'lk k-' + l.kind, title: KIND[l.kind].name, html: KIND[l.kind].ic }), h('span', { class: 'ln' }, l.title),
        h('span', { class: 'lst' }, st ? h('span', {}, '★'.repeat(st), h('span', { class: 'off' }, '★'.repeat(3 - st))) : ok ? 'nuovo' : h('span', { html: IC.lock }))];
      return ok ? h('a', { class: 'lvl-item' + (st ? ' done' : ' next'), href: `#/livello/${l.id}` }, inner) : h('div', { class: 'lvl-item locked' }, inner);
    });
    return h('section', { class: 'zone' + (open ? '' : ' locked') },
      h('div', { class: 'zone-head' }, h('span', { class: 'zid' }, z.id), h('h2', {}, z.title), zoneDone(zid) ? h('span', { class: 'ok', html: IC.check }) : null),
      h('div', { class: 'lvl-list' }, lv));
  });
  const soon = w.soon && w.soon.length ? h('section', { class: 'zone locked' }, h('div', { class: 'zone-head' }, h('h2', {}, 'In arrivo')), h('p', { class: 'muted small' }, w.soon.join(' · '))) : null;
  const page = h('div', { class: 'page', style: `--c:${w.color}` }, topbar(),
    h('div', { class: 'page-in' },
      h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), 'I mondi'),
      h('div', { class: 'world-head' }, hopOnTap(h('div', { class: 'wh-who', html: charSVG(w.mascot) })),
        h('div', {}, h('div', { class: 'wnum' }, `Mondo ${String(w.n).padStart(2, '0')} · ${w.place}`), h('h1', {}, w.name))),
      zones, soon));
  if (!S.seen[w.id]) {
    const modal = h('div', { class: 'modal' }, h('div', { class: 'card pop scene', style: `--c:${w.color}` },
      hopOnTap(h('div', { class: 'scene-who', html: charSVG(w.mascot) })),
      h('h2', {}, w.name),
      h('p', { html: tx(w.intro, S.lens) }),
      h('button', { class: 'btn primary', onclick: () => { S.seen[w.id] = true; save(); modal.remove(); } }, 'Cominciamo!')));
    page.append(modal);
  }
  return page;
}

// ---------- il parco ----------
function park() {
  const items = ALL_PIECES.map((p) => {
    const has = S.park.includes(p.id);
    return h('div', { class: 'piece-card' + (has ? '' : ' locked') },
      h('div', { class: 'pi big' }, has ? p.icon : '?'), h('h3', {}, has ? p.name : 'Da costruire'), h('p', { class: 'small muted' }, has ? p.desc : 'Lo costruisci in un livello Costruisci.'));
  });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), 'I mondi'),
    h('h1', {}, 'Il tuo parco divertimenti'),
    h('p', { class: 'muted' }, `Ogni livello Costruisci aggiunge un gioco che funziona con la fisica che hai imparato. Ne hai costruiti ${S.park.length} di ${ALL_PIECES.length}.`),
    h('div', { class: 'pieces' }, items)));
}

// ---------- gradi ----------
function grades() {
  const cur = gradeNow();
  const rows = GRADES.map((g) => {
    const got = !g.world || worldDone(worldById(g.world));
    const w = g.world ? worldById(g.world) : null;
    return h('div', { class: 'grade' + (got ? ' got' : '') + (g === cur ? ' cur' : '') },
      h('span', { class: 'gi', html: got ? IC.grade : '·' }),
      h('div', {}, h('b', {}, g.name), h('div', { class: 'small muted' }, w ? `Finisci ${w.name}` : 'All’inizio'), got && g.desc ? h('div', { class: 'small' }, g.desc) : null));
  });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), 'I mondi'),
    h('h1', {}, 'I gradi'), h('p', { class: 'muted' }, 'Ogni mondo finito ti dà il nome di uno scienziato.'), h('div', { class: 'grades' }, rows)));
}

// ---------- impostazioni ----------
function settings() {
  const st = S.settings;
  const lensBtns = Object.entries(LENSES).map(([k, l]) => h('button', { class: 'chip' + (S.lens === k ? ' on' : ''), onclick: () => { S.lens = k; save(); render(); } }, l.name));
  const tog = (key, label) => h('button', { class: 'chip' + (st[key] !== false ? ' on' : ''), onclick: () => { st[key] = st[key] === false; save(); render(); } }, `${label}: ${st[key] !== false ? 'sì' : 'no'}`);
  const code = h('textarea', { class: 'code', rows: 3, placeholder: 'Incolla qui un codice di salvataggio' });
  const msg = h('div', { class: 'small muted' });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in narrow' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), 'I mondi'),
    h('h1', {}, 'Impostazioni'),
    h('h3', {}, 'Come giochi'), h('div', { class: 'chips' }, lensBtns),
    h('p', { class: 'small muted' }, 'Cambiare lente non cancella stelle né progressi.'),
    h('h3', {}, 'Suoni e voce'), h('div', { class: 'chips' }, tog('sound', 'Suoni'), tog('voice', 'Leggi ad alta voce ogni domanda')),
    h('h3', {}, 'Animazione d’apertura'),
    h('div', { class: 'chips' }, tog('intro', 'Mostrala all’avvio'),
      h('button', { class: 'chip', onclick: () => playIntro() }, h('span', { html: IC.film }), 'Guardala ora')),
    h('h3', {}, 'Salvataggio'),
    h('p', { class: 'small muted' }, 'I progressi restano su questo dispositivo. Copia il codice per portarli su un altro: il ripristino unisce i progressi, non li sovrascrive.'),
    h('div', { class: 'row' },
      h('button', { class: 'btn', onclick: () => { code.value = exportCode(); code.select(); msg.textContent = 'Codice pronto: copialo e conservalo.'; } }, 'Crea codice'),
      h('button', { class: 'btn', onclick: () => { try { importCode(code.value); msg.textContent = 'Progressi ripristinati.'; } catch { msg.textContent = 'Il codice non è valido.'; } } }, 'Ripristina')),
    code, msg,
    h('h3', {}, 'Ricomincia da capo'),
    h('button', { class: 'btn danger', onclick: (e) => {
      if (e.currentTarget.dataset.sure) { resetAll(); go('#/'); return; }
      e.currentTarget.dataset.sure = '1'; e.currentTarget.textContent = 'Sicuro? Premi di nuovo per cancellare tutto';
    } }, 'Cancella tutti i progressi'),
    h('p', { class: 'small muted foot' }, 'PhisiArc · versione di prova')));
}

// ---------- router ----------
function render() {
  if (cleanup) { cleanup(); cleanup = null; }
  window.scrollTo(0, 0);
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  if (!S.lens && parts[0] !== 'benvenuto') { app.replaceChildren(welcome()); return; }
  switch (parts[0]) {
    case 'benvenuto': app.replaceChildren(welcome()); break;
    case 'mondo': app.replaceChildren(world(parts[1])); break;
    case 'livello': {
      const l = levelById(parts[1]);
      if (!l || !levelOpen(l.id)) { app.replaceChildren(home()); break; }
      const root = h('div', { class: 'level-page' });
      app.replaceChildren(root);
      cleanup = runLevel(root, l, go);
      break;
    }
    case 'parco': app.replaceChildren(park()); break;
    case 'gradi': app.replaceChildren(grades()); break;
    case 'impostazioni': app.replaceChildren(settings()); break;
    default: app.replaceChildren(home());
  }
}

window.addEventListener('hashchange', render);
render();
const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
if (S.settings.intro !== false && !calm) playIntro();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
