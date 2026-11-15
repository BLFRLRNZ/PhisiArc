// PhysiArc: schermate, navigazione e impostazioni.
import { h, tx, asDialog } from './util.js';
import { t as tr, LANG, LANGS, setLang } from './i18n.js';
import { S, save, exportCode, importCode, resetAll, voiceOn, PLAYERS, switchPlayer, addPlayer, renamePlayer, removePlayer, playerName, shownName } from './state.js';
import { CAST, CAST_LIST, charSVG, hop } from './cast.js';
import { IC } from './icons.js';
import { pieceSVG } from './pieces.js';
import { playIntro } from './intro.js';
import { voicePanel } from './voicepanel.js';
import { runLevel } from './level.js';
import { toolboxPage, toolsOn, toolCount, TOOL_IDS } from './tools.js';
import { enrollDone, dueKeys, nextDueIn, reviewLevel, REVIEW_MAX } from './review.js';
import {
  WORLDS, ZONES, KIND, LENSES, GRADES, ALL_PIECES,
  worldById, worldOpen, worldDone, worldReady, zoneOpen, zoneDone, levelOpen, levelById, gradeNow, examFor, EXAM_MAX_ERRORS,
} from './content/index.js';

const app = document.getElementById('app');
document.documentElement.lang = LANG;

// La pagina si può ingrandire (pizzico, Ctrl + rotella, Ctrl +/−): chi vede poco ne ha bisogno.
// Resta escluso solo lo zoom da doppio tocco (touch-action nel CSS), che scatterebbe toccando in fretta i bottoni.
let cleanup = null;

const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };

const logo = () => h('a', { class: 'logo', href: '#/', 'aria-label': tr('PhysiArc, torna ai mondi') },
  h('span', { class: 'logo-mark', html: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 27 Q16 -7 28 27"/><path d="M2 27h28"/><circle cx="16" cy="10" r="2.6"/></svg>' }),
  h('span', {}, 'Physi', h('span', { class: 'arc' }, 'Arc')));
const hopOnTap = (el) => { el.addEventListener('click', (e) => { const svg = e.currentTarget.querySelector('svg.m'); if (svg) hop(svg); }); return el; };

function topbar() {
  const g = gradeNow();
  return h('header', { class: 'top' },
    logo(),
    h('nav', { class: 'top-right' },
      PLAYERS.list.length > 1 ? h('a', { class: 'pill', href: '#/impostazioni', title: tr('Cambia giocatore') }, h('span', { class: 'pill-t' }, playerName())) : null,
      h('a', { class: 'pill', href: '#/gradi', title: tr('Il tuo grado') }, h('span', { html: IC.grade }), h('span', { class: 'pill-t' }, g.name)),
      h('span', { class: 'pill num', title: tr('Joule guadagnati') }, h('span', { class: 'sun', html: IC.bolt }), `${S.joule} J`),
      h('a', { class: 'pill icon', href: '#/parco', title: tr('Il tuo parco'), 'aria-label': tr('Il tuo parco'), html: IC.park }),
      h('a', { class: 'pill icon', href: '#/impostazioni', title: tr('Impostazioni'), 'aria-label': tr('Impostazioni'), html: IC.gear })));
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
      h('h1', { class: 'big-logo' }, 'Physi', h('span', { class: 'arc' }, 'Arc')),
      h('p', { class: 'tag' }, tr('La fisica a livelli.') + ' ', h('b', {}, tr('Prevedi. Prova. Scopri.')))),
    langChips(),
    h('h2', {}, tr('Come vuoi giocare?')),
    h('p', { class: 'muted' }, tr('Il percorso è lo stesso per tutti; cambia come si spiega. Puoi cambiare quando vuoi dalle impostazioni.')),
    h('div', { class: 'lens-grid' }, cards),
    // un giocatore nuovo creato per sbaglio: si torna agli altri senza dover prima scegliere la lente
    PLAYERS.list.length > 1 ? h('div', { class: 'chips who-else' }, h('span', { class: 'small muted' }, tr('Non sei {p}?', { p: playerName() })),
      PLAYERS.list.filter((p) => p.id !== PLAYERS.active).map((p) => h('button', { class: 'chip', onclick: () => { switchPlayer(p.id); render(); } }, shownName(p.name)))) : null);
}

// scelta della lingua (la pagina si ricarica nella lingua nuova)
const langChips = () => h('div', { class: 'chips lang-chips' }, Object.entries(LANGS).map(([k, name]) =>
  h('button', { class: 'chip' + (LANG === k ? ' on' : ''), 'aria-pressed': String(LANG === k), lang: k, onclick: () => { if (LANG !== k) setLang(k); } }, name)));

// ---------- mappa dei mondi ----------
function home() {
  // Il percorso è una sola strada: ogni mondo è un campo della fisica e si apre quando finisci quello prima.
  const here = WORLDS.find((w) => worldReady(w) && worldOpen(w) && !worldDone(w));
  const list = WORLDS.map((w, i) => {
    const ready = worldReady(w), open = ready && worldOpen(w), done = worldDone(w), cur = w === here;
    let total = 0, got = 0;
    if (ready) for (const z of w.zones) for (const l of ZONES[z].levels) { total++; if (S.done[l.id]) got++; }
    const prev = w.requires.map((r) => worldById(r).name).join(tr(' e '));
    const status = done ? (got < total ? tr('Superato con la prova · {got} di {total} livelli', { got, total }) : tr('Completato')) : open ? tr('{got} di {total} livelli', { got, total }) : !ready ? tr('In costruzione · {n} zone in arrivo', { n: w.soon.length }) : tr('Si apre quando finisci {prev}', { prev });
    const diff = w.diff ?? Math.ceil((w.n / WORLDS.length) * 5); // difficoltà decisa sul contenuto, non sul numero
    const body = h('div', { class: 'wbody', title: ready ? '' : w.soon.join(' · ') },
      h('div', { class: 'wnum' }, `${tr('Mondo')} ${String(w.n).padStart(2, '0')} · ${w.field}`),
      h('h3', {}, w.name),
      ready ? h('div', { class: 'muted small' }, w.place) : null,
      h('div', { class: 'wdiff', title: tr('Difficoltà {d} su 5', { d: diff }) }, h('span', { class: 'muted' }, tr('Difficoltà')), h('span', { class: 'wdots' }, ...[1, 2, 3, 4, 5].map((k) => h('i', { class: k <= diff ? 'on' : '' })))),
      ready ? h('div', { class: 'bar' }, h('span', { style: `width:${total ? (100 * got) / total : 0}%` })) : null,
      h('div', { class: 'small wstatus' }, status),
      null);
    const who = [w.mascot, w.buddy].filter(Boolean).map((id) => charSVG(id)).join('');
    const icon = h('div', { class: 'wicon' + (w.buddy ? ' two' : ''), html: who });
    if (!open) icon.append(h('span', { class: 'wlock', html: IC.lock }));
    const cls = 'world' + (open ? ' open' : ' locked') + (done ? ' done' : '') + (ready ? '' : ' soon-w') + (cur ? ' here' : '');
    const card = open ? h('a', { class: cls, style: `--c:${w.color}`, href: `#/mondo/${w.id}` }, icon, body) : hopOnTap(h('div', { class: cls, style: `--c:${w.color}` }, icon, body));
    const node = h('div', { class: 'pnode' }, done ? h('span', { html: IC.check }) : String(w.n));
    const step = h('div', { class: 'pstep' + (done ? ' done' : '') + (cur ? ' here' : '') + (open ? '' : ' locked') + (i === WORLDS.length - 1 ? ' last' : ''), style: `--c:${w.color}` },
      node, cur ? h('div', { class: 'phere' }, tr('Sei qui')) : null, card);
    return step;
  });
  const doneN = WORLDS.filter(worldDone).length;
  const page = h('div', { class: 'page' }, topbar(),
    h('div', { class: 'page-in' },
      h('h1', {}, tr('Il percorso')),
      h('p', { class: 'muted' }, tr('Stai giocando come {lens}. Dodici mondi in fila, dal più semplice al più difficile: ognuno è un campo della fisica e si apre quando finisci quello prima. Mondi completati: {n} di {tot}.', { lens: LENSES[S.lens].name, n: doneN, tot: WORLDS.length })),
      reviewCard(),
      toolboxCard(),
      h('div', { class: 'worlds path' }, list)));
  if (here && here.n > 2) requestAnimationFrame(() => page.querySelector('.pstep.here')?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  return page;
}

// il ripasso del giorno: compare quando qualche domanda dei livelli già fatti è pronta per tornare
function reviewCard() {
  enrollDone();
  const due = dueKeys().length;
  if (!due) {
    const n = nextDueIn();
    return n == null ? null : h('p', { class: 'muted small' }, n <= 1 ? tr('Prossimo ripasso: domani.') : tr('Prossimo ripasso: fra {n} giorni.', { n }));
  }
  const k = Math.min(due, REVIEW_MAX);
  return h('section', { class: 'zone review-card' },
    h('h3', {}, tr('Ripasso del giorno')),
    h('p', { class: 'muted small' }, k === 1 ? tr('1 domanda dai livelli che hai già finito. Ripassare dopo qualche giorno aiuta a ricordare a lungo.') : tr('{k} domande dai livelli che hai già finito. Ripassare dopo qualche giorno aiuta a ricordare a lungo.', { k })),
    h('a', { class: 'btn primary', href: '#/ripasso' }, tr('Ripassa')));
}

// la cassetta degli attrezzi di matematica (solo nelle lenti con le formule)
function toolboxCard() {
  if (!toolsOn(S.lens)) return null;
  return h('a', { class: 'zone toolbox-link', href: '#/attrezzi' },
    h('div', {}, h('h3', {}, tr('La cassetta degli attrezzi')),
      h('p', { class: 'muted small' }, tr('Radice, Pitagora, π, seno e coseno: gli strumenti di matematica delle formule, da guardare e provare. Ne hai trovati {n} di {tot}.', { n: toolCount(), tot: TOOL_IDS.length }))),
    h('span', { class: 'btn' }, tr('Apri')));
}
function toolbox() {
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in narrow' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), tr('I mondi')),
    h('h1', {}, tr('La cassetta degli attrezzi')),
    h('p', { class: 'muted' }, tr('Le formule della fisica usano pochi attrezzi di matematica. Ognuno si apre da solo la prima volta che un livello ne ha bisogno, e qui puoi riguardarlo quando vuoi.')),
    toolboxPage()));
}

// ---------- un mondo: zone e livelli ----------
function world(id) {
  const w = worldById(id);
  if (!w || !worldReady(w) || !worldOpen(w)) return home();
  const zones = w.zones.map((zid, zi) => {
    const z = ZONES[zid], open = zoneOpen(zid);
    const lv = z.levels.map((l) => {
      const ok = levelOpen(l.id), st = S.done[l.id] || 0;
      const inner = [h('span', { class: 'lk k-' + l.kind, title: KIND[l.kind].name, html: KIND[l.kind].ic }), h('span', { class: 'ln' }, tx(l.title, S.lens)),
        h('span', { class: 'lst' }, st ? h('span', {}, '★'.repeat(st), h('span', { class: 'off' }, '★'.repeat(3 - st))) : ok ? tr('nuovo') : h('span', { html: IC.lock }))];
      return ok ? h('a', { class: 'lvl-item' + (st ? ' done' : ' next'), href: `#/livello/${l.id}` }, inner) : h('div', { class: 'lvl-item locked' }, inner);
    });
    // Il codice mostrato (M01, M02…) è la posizione della zona nel mondo. Gli id interni (M04 per l'accelerazione) non cambiano mai:
    // a loro sono legati i salvataggi.
    return h('section', { class: 'zone' + (open ? '' : ' locked') },
      h('div', { class: 'zone-head' }, h('span', { class: 'zid' }, zid.replace(/\d+$/, '') + String(zi + 1).padStart(2, '0')), h('h2', {}, z.title), zoneDone(zid) ? h('span', { class: 'ok', html: IC.check }) : null),
      h('div', { class: 'lvl-list' }, lv));
  });
  const soon = w.soon && w.soon.length ? h('section', { class: 'zone locked' }, h('div', { class: 'zone-head' }, h('h2', {}, tr('In arrivo'))), h('p', { class: 'muted small' }, w.soon.join(' · '))) : null;
  const page = h('div', { class: 'page', style: `--c:${w.color}` }, topbar(),
    h('div', { class: 'page-in' },
      h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), tr('I mondi')),
      h('div', { class: 'world-head' }, hopOnTap(h('div', { class: 'wh-who', html: charSVG(w.mascot) })),
        h('div', {}, h('div', { class: 'wnum' }, `${tr('Mondo')} ${String(w.n).padStart(2, '0')} · ${w.place}`), h('h1', {}, w.name))),
      zones, soon,
      // chi conosce già questo mondo può saltarlo con la prova d'ingresso
      !worldDone(w) && examFor(w).steps.length >= 4 ? h('section', { class: 'zone exam' },
        h('div', { class: 'zone-head' }, h('h2', {}, tr('Lo conosci già?'))),
        h('p', { class: 'muted small' }, tr('Fai la prova d’ingresso: {n} domande dai ripassi. Con al massimo {e} errori, senza aiuti, si apre il mondo dopo.', { n: examFor(w).steps.filter((st) => !st.only || st.only.includes(S.lens)).length, e: EXAM_MAX_ERRORS })),
        h('a', { class: 'btn', href: `#/esame/${w.id}` }, tr('Fai la prova d’ingresso'))) : null));
  if (!S.seen[w.id]) {
    const modal = h('div', { class: 'modal' }, h('div', { class: 'card pop scene', style: `--c:${w.color}` },
      hopOnTap(h('div', { class: 'scene-who', html: charSVG(w.mascot) })),
      h('h2', {}, w.name),
      h('p', { html: tx(w.intro, S.lens) }),
      h('button', { class: 'btn primary', onclick: () => { S.seen[w.id] = true; save(); modal.remove(); } }, tr('Cominciamo!'))));
    page.append(asDialog(modal));
  }
  return page;
}

// ---------- il parco ----------
function park() {
  const items = ALL_PIECES.map((p) => {
    const has = S.park.includes(p.id);
    return h('div', { class: 'piece-card' + (has ? '' : ' locked') },
      has ? h('div', { class: 'pi big', html: pieceSVG(p.id) }) : h('div', { class: 'pi big' }, '?'), h('h3', {}, has ? p.name : tr('Da costruire')), h('p', { class: 'small muted' }, has ? p.desc : tr('Lo costruisci in un livello Costruisci.')));
  });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), tr('I mondi')),
    h('h1', {}, tr('Il tuo parco divertimenti')),
    h('p', { class: 'muted' }, tr('Ogni livello Costruisci aggiunge un gioco che funziona con la fisica che hai imparato. Ne hai costruiti {n} di {tot}.', { n: S.park.length, tot: ALL_PIECES.length })),
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
      h('div', {}, h('b', {}, g.name), h('div', { class: 'small muted' }, w ? tr('Finisci {w}', { w: w.name }) : tr('All’inizio')), got && g.desc ? h('div', { class: 'small' }, g.desc) : null));
  });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), tr('I mondi')),
    h('h1', {}, tr('I gradi')), h('p', { class: 'muted' }, tr('Ogni mondo finito ti dà il nome di uno scienziato.')), h('div', { class: 'grades' }, rows)));
}

// ---------- giocatori: ognuno con i suoi progressi, sullo stesso dispositivo ----------
function players() {
  const name = h('input', { class: 'numin', type: 'text', maxlength: 20, placeholder: tr('Nome'), 'aria-label': tr('Nome del giocatore') });
  const chips = PLAYERS.list.map((p) => h('button', { class: 'chip' + (p.id === PLAYERS.active ? ' on' : ''), 'aria-pressed': String(p.id === PLAYERS.active), onclick: () => { switchPlayer(p.id); render(true); } }, shownName(p.name)));
  const del = PLAYERS.list.length > 1 ? h('button', { class: 'btn ghost', onclick: (e) => {
    if (e.currentTarget.dataset.sure) { removePlayer(PLAYERS.active); render(true); return; }
    e.currentTarget.dataset.sure = '1'; e.currentTarget.textContent = tr('Sicuro? Si cancellano i progressi di {p}', { p: playerName() });
  } }, tr('Togli {p}', { p: playerName() })) : null;
  return h('div', {},
    h('div', { class: 'chips' }, chips),
    h('div', { class: 'row left' }, name,
      h('button', { class: 'btn', onclick: () => { addPlayer(name.value); go('#/'); } }, tr('Nuovo giocatore')),
      h('button', { class: 'btn', onclick: () => { if (name.value.trim()) { renamePlayer(PLAYERS.active, name.value); render(true); } } }, tr('Rinomina')),
      del),
    h('p', { class: 'small muted' }, tr('Ogni giocatore ha le sue stelle, il suo parco e la sua lente.')));
}

// ---------- impostazioni ----------
function settings() {
  const st = S.settings;
  // Gli interruttori cambiano sul posto: niente ricarica della pagina, si resta dove si era.
  const sw = (label, isOn, flip) => {
    const b = h('button', { class: 'chip', onclick: () => { flip(); save(); paint(); } });
    const paint = () => { const on = isOn(); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); b.textContent = `${label}: ${on ? tr('sì') : tr('no')}`; };
    paint(); b.paint = paint;
    return b;
  };
  const tog = (key, label) => sw(label, () => st[key] !== false, () => { st[key] = st[key] === false; st[key + 'Chosen'] = true; });
  const voiceBtn = sw(tr('Leggi ad alta voce domande e risposte'), voiceOn, () => { st.voice = !voiceOn(); st.voiceChosen = true; });
  // la lente cambia solo i bottoni della lente (e la voce, che per l'Esploratore è accesa da sola)
  const lensBtns = Object.entries(LENSES).map(([k, l]) => h('button', { class: 'chip' + (S.lens === k ? ' on' : ''), 'aria-pressed': String(S.lens === k), 'data-lens': k, onclick: (e) => {
    S.lens = k; save();
    for (const b of e.currentTarget.parentNode.children) { const on = b.dataset.lens === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }
    voiceBtn.paint();
  } }, l.name));
  const code = h('textarea', { class: 'code', rows: 3, placeholder: tr('Incolla qui un codice di salvataggio') });
  const msg = h('div', { class: 'small muted' });
  return h('div', { class: 'page' }, topbar(), h('div', { class: 'page-in narrow' },
    h('a', { class: 'btn ghost', href: '#/' }, h('span', { html: IC.back }), tr('I mondi')),
    h('h1', {}, tr('Impostazioni')),
    h('h3', {}, tr('Chi gioca')), players(),
    h('h3', {}, tr('Come giochi')), h('div', { class: 'chips' }, lensBtns),
    h('p', { class: 'small muted' }, tr('Cambiare lente non cancella stelle né progressi.')),
    h('h3', {}, 'Lingua · Language'), langChips(),
    h('h3', {}, tr('Suoni e voce')), h('div', { class: 'chips' }, tog('sound', tr('Suoni')), voiceBtn),
    h('p', { class: 'small muted' }, tr('Per l’Esploratore la voce è accesa da sola, finché non la spegni.')),
    voicePanel(),
    h('h3', {}, tr('Animazione d’apertura')),
    h('div', { class: 'chips' }, tog('intro', tr('Mostrala all’avvio')),
      h('button', { class: 'chip', onclick: () => playIntro() }, h('span', { html: IC.film }), tr('Guardala ora'))),
    h('h3', {}, tr('Salvataggio')),
    h('p', { class: 'small muted' }, tr('I progressi restano su questo dispositivo. Copia il codice per portarli su un altro: il ripristino unisce i progressi, non li sovrascrive.')),
    h('div', { class: 'row left' },
      h('button', { class: 'btn', onclick: () => { code.value = exportCode(); code.select(); msg.textContent = tr('Codice pronto: copialo e conservalo.');
        navigator.clipboard?.writeText(code.value).then(() => { msg.textContent = tr('Codice copiato: incollalo dove vuoi conservarlo.'); }, () => {}); } }, tr('Crea codice')),
      h('button', { class: 'btn', onclick: () => {
        try {
          const known = { levels: new Set(Object.values(ZONES).flatMap((z) => z.levels.map((l) => l.id))), pieces: new Set(ALL_PIECES.map((p) => p.id)), worlds: new Set(WORLDS.map((w) => w.id)), zones: new Set(Object.keys(ZONES)) };
          const r = importCode(code.value, known);
          msg.textContent = r.pieces ? tr('Progressi ripristinati: {l} livelli e {p} pezzi del parco.', { l: r.levels, p: r.pieces }) : tr('Progressi ripristinati: {l} livelli.', { l: r.levels });
        } catch (err) { msg.textContent = tr(err.message) || tr('Il codice non è valido.'); }
      } }, tr('Ripristina'))),
    code, msg,
    h('h3', {}, tr('Ricomincia da capo')),
    h('button', { class: 'btn danger', onclick: (e) => {
      if (e.currentTarget.dataset.sure) { resetAll(); go('#/'); return; }
      e.currentTarget.dataset.sure = '1'; e.currentTarget.textContent = tr('Sicuro? Premi di nuovo per cancellare tutto');
    } }, tr('Cancella tutti i progressi')),
    h('p', { class: 'small muted foot' }, tr('PhysiArc · versione di prova'))));
}

// ---------- router ----------
// stay = true: si ridisegna la pagina restando allo stesso punto (es. cambiare giocatore nelle impostazioni)
function render(stay) {
  if (cleanup) { cleanup(); cleanup = null; }
  const y = window.scrollY;
  if (stay !== true) window.scrollTo(0, 0);
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
    case 'esame': {
      const w = worldById(parts[1]);
      if (!w || !worldReady(w) || !worldOpen(w) || worldDone(w)) { app.replaceChildren(home()); break; }
      const root = h('div', { class: 'level-page' });
      app.replaceChildren(root);
      cleanup = runLevel(root, examFor(w), go);
      break;
    }
    case 'ripasso': {
      const l = reviewLevel();
      if (!l) { app.replaceChildren(home()); break; }
      const root = h('div', { class: 'level-page' });
      app.replaceChildren(root);
      cleanup = runLevel(root, l, go);
      break;
    }
    case 'parco': app.replaceChildren(park()); break;
    case 'gradi': app.replaceChildren(grades()); break;
    case 'attrezzi': app.replaceChildren(toolbox()); break;
    case 'impostazioni': app.replaceChildren(settings()); break;
    default: app.replaceChildren(home());
  }
  if (stay === true) window.scrollTo(0, y);
}

window.addEventListener('hashchange', render);
render();
const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
if ((S.settings.intro || !S.introSeen) && !calm) { S.introSeen = true; save(); playIntro(); }

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
