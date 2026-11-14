// PhisiArc: schermate, navigazione e impostazioni.
import { h, tx } from './util.js';
import { S, save, exportCode, importCode, resetAll } from './state.js';
import { mascot, DUBBIA } from './mascot.js';
import { runLevel } from './level.js';
import {
  WORLDS, ZONES, KIND, LENSES, GRADES, ALL_PIECES,
  worldById, worldOpen, worldDone, worldReady, zoneOpen, zoneDone, levelOpen, levelById, gradeNow,
} from './content/index.js';

const app = document.getElementById('app');
let cleanup = null;

const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

function applyTheme() {
  const t = S.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

function topbar() {
  const g = gradeNow();
  return h('header', { class: 'top' },
    h('a', { class: 'logo', href: '#/' }, h('span', { class: 'logo-mark' }, '⚛'), 'PhisiArc'),
    h('div', { class: 'top-right' },
      h('a', { class: 'pill', href: '#/gradi', title: 'Il tuo grado' }, '🎓 ', g.name),
      h('span', { class: 'pill', title: 'Joule guadagnati' }, '⚡ ', String(S.joule), ' J'),
      h('a', { class: 'pill', href: '#/parco', title: 'Il tuo parco' }, '🎡'),
      h('a', { class: 'pill', href: '#/impostazioni', title: 'Impostazioni' }, '⚙️')));
}

// ---------- benvenuto: scelta della lente ----------
function welcome() {
  const cards = Object.entries(LENSES).map(([k, l]) => h('button', {
    class: 'lens-card' + (S.lens === k ? ' on' : ''),
    onclick: () => { S.lens = k; save(); go('#/'); },
  }, h('div', { class: 'lens-icon' }, l.icon), h('h3', {}, l.name), h('div', { class: 'muted small' }, l.age), h('p', {}, l.desc)));
  return h('div', { class: 'welcome' },
    h('div', { class: 'hero' },
      h('div', { class: 'hero-mascots', html: mascot('#3fb6a8', 'flask', 'happy', 72) + mascot('#ff8a3d', 'ball', 'happy', 72) + mascot(DUBBIA.color, DUBBIA.acc, 'doubt', 72) }),
      h('h1', {}, 'PhisiArc'),
      h('p', { class: 'tag' }, 'La fisica a livelli: prevedi, prova, scopri.')),
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
    const status = !ready ? 'In arrivo' : !open ? `Si apre dopo ${w.requires.map((r) => worldById(r).name).join(' e ')}` : done ? 'Completato ✓' : `${got} di ${total} livelli`;
    const body = h('div', { class: 'wbody' },
      h('div', { class: 'wnum' }, `Mondo ${w.n}`),
      h('h3', {}, w.name),
      h('div', { class: 'muted small' }, w.place),
      ready ? h('div', { class: 'bar' }, h('span', { style: { width: `${total ? (100 * got) / total : 0}%`, background: w.color } })) : null,
      h('div', { class: 'small wstatus' }, status),
      !ready ? h('div', { class: 'small muted soon' }, w.soon.join(' · ')) : null);
    const icon = h('div', { class: 'wicon', style: { background: w.color }, html: w.mascot ? mascot('#ffffff22', w.mascot.acc, 'happy', 54) : '' });
    if (!w.mascot) icon.textContent = open ? '' : '🔒';
    const cls = 'world' + (open ? ' open' : ' locked') + (done ? ' done' : '');
    return open ? h('a', { class: cls, href: `#/mondo/${w.id}` }, icon, body) : h('div', { class: cls }, icon, body);
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
      const inner = [h('span', { class: 'lk' }, KIND[l.kind].icon), h('span', { class: 'ln' }, l.title),
        h('span', { class: 'lst' }, st ? '★'.repeat(st) + '☆'.repeat(3 - st) : ok ? 'nuovo' : '🔒')];
      return ok ? h('a', { class: 'lvl-item' + (st ? ' done' : ' next'), href: `#/livello/${l.id}` }, inner) : h('div', { class: 'lvl-item locked' }, inner);
    });
    return h('section', { class: 'zone' + (open ? '' : ' locked') },
      h('div', { class: 'zone-head' }, h('span', { class: 'zid', style: { background: w.color } }, z.id), h('h2', {}, z.title), zoneDone(zid) ? h('span', { class: 'ok' }, '✓') : null),
      h('div', { class: 'lvl-list' }, lv));
  });
  const soon = w.soon && w.soon.length ? h('section', { class: 'zone locked' }, h('div', { class: 'zone-head' }, h('h2', {}, 'In arrivo')), h('p', { class: 'muted small' }, w.soon.join(' · '))) : null;
  const page = h('div', { class: 'page' }, topbar(),
    h('div', { class: 'page-in' },
      h('a', { class: 'btn ghost', href: '#/' }, '← I mondi'),
      h('div', { class: 'world-head' }, h('div', { html: mascot(w.mascot.color, w.mascot.acc, 'happy', 64) }),
        h('div', {}, h('div', { class: 'muted small' }, `Mondo ${w.n} · ${w.place}`), h('h1', {}, w.name))),
      zones, soon));
  if (!S.seen[w.id]) {
    const modal = h('div', { class: 'modal' }, h('div', { class: 'card pop scene' },
      h('div', { html: mascot(w.mascot.color, w.mascot.acc, 'happy', 96) }),
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
      h('div', { class: 'pi big' }, has ? p.icon : '❔'), h('h3', {}, has ? p.name : 'Da costruire'), h('p', { class: 'small muted' }, has ? p.desc : 'Lo costruisci in un livello 🔧 Costruisci.'));
  });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in' },
    h('a', { class: 'btn ghost', href: '#/' }, '← I mondi'),
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
      h('span', { class: 'gi' }, got ? '🎓' : '·'),
      h('div', {}, h('b', {}, g.name), h('div', { class: 'small muted' }, w ? `Finisci ${w.name}` : 'All’inizio'), got && g.desc ? h('div', { class: 'small' }, g.desc) : null));
  });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in' },
    h('a', { class: 'btn ghost', href: '#/' }, '← I mondi'),
    h('h1', {}, 'I gradi'), h('p', { class: 'muted' }, 'Ogni mondo finito ti dà il nome di uno scienziato.'), h('div', { class: 'grades' }, rows)));
}

// ---------- impostazioni ----------
function settings() {
  const st = S.settings;
  const lensBtns = Object.entries(LENSES).map(([k, l]) => h('button', { class: 'chip' + (S.lens === k ? ' on' : ''), onclick: () => { S.lens = k; save(); render(); } }, l.icon, ' ', l.name));
  const tog = (key, label) => h('button', { class: 'chip' + (st[key] ? ' on' : ''), onclick: () => { st[key] = !st[key]; save(); render(); } }, `${label}: ${st[key] ? 'sì' : 'no'}`);
  const themes = [['auto', 'Automatico'], ['light', 'Chiaro'], ['dark', 'Scuro']].map(([v, l]) => h('button', { class: 'chip' + (st.theme === v ? ' on' : ''), onclick: () => { st.theme = v; save(); applyTheme(); render(); } }, l));
  const code = h('textarea', { class: 'code', rows: 3, placeholder: 'Incolla qui un codice di salvataggio' });
  const msg = h('div', { class: 'small muted' });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in narrow' },
    h('a', { class: 'btn ghost', href: '#/' }, '← I mondi'),
    h('h1', {}, 'Impostazioni'),
    h('h3', {}, 'Come giochi'), h('div', { class: 'chips' }, lensBtns),
    h('p', { class: 'small muted' }, 'Cambiare lente non cancella stelle né progressi.'),
    h('h3', {}, 'Suoni e voce'), h('div', { class: 'chips' }, tog('sound', 'Suoni'), tog('voice', 'Leggi ad alta voce ogni domanda')),
    h('h3', {}, 'Tema'), h('div', { class: 'chips' }, themes),
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
    h('p', { class: 'small muted foot' }, 'PhisiArc · prima versione di prova')));
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

applyTheme();
window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
