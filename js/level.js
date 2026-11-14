// Il motore di un livello: testo, simulazione, passi (domande, prove, regolazioni) e stelle.
import { h, tx, shuffle, plain, wait, T } from './util.js';
import { S, save } from './state.js';
import { SIMS } from './sims/index.js';
import { sfx, speak, stopSpeaking } from './audio.js';
import { CAST, charSVG, hop } from './cast.js';
import { IC } from './icons.js';
import { pieceSVG } from './pieces.js';
import { starsSVG, confetti, countUp, CHECK } from './fx.js';
import { KIND, worldOf, zoneOf, nextLevel, gradeNow, worldDone, nextWorld, worldReady, worldOpen } from './content/index.js';

export function runLevel(root, level, nav) {
  const lens = S.lens || 's';
  const zone = zoneOf(level.id);
  const world = worldOf(zone.id);
  const steps = level.steps.filter((s) => !s.only || s.only.includes(lens));
  const SimClass = level.sim ? SIMS[level.sim] : null;

  let si = 0, errors = 0, hints = 0, solution = false;
  let sim = null, pending = null, onResult = null, busy = false;

  // ---------- struttura della pagina ----------
  const back = h('button', { class: 'btn ghost', onclick: () => leave() }, h('span', { html: IC.back }), h('span', { class: 'back-t' }, zone.title));
  const hintBtn = h('button', { class: 'btn ghost hint-btn', onclick: () => showHint() }, h('span', { html: IC.hint }), 'Aiuto');
  const dots = h('div', { class: 'dots' });
  const head = h('header', { class: 'lvl-head' }, back, h('div', { class: 'lvl-title' },
    h('span', { class: 'kind k-' + level.kind }, h('span', { html: KIND[level.kind].ic }), ' ', KIND[level.kind].name), h('strong', {}, level.title)), dots, hintBtn);

  const boss = level.kind === 'boss';
  const who = CAST[boss ? 'vetrino' : world.mascot];
  const introText = tx(level.intro, lens);
  const speakBtn = h('button', { class: 'btn icon', title: 'Ascolta', 'aria-label': 'Ascolta', onclick: () => speak(plain(introText + ' ' + quest.innerHTML)), html: IC.sound });
  const intro = h('div', { class: 'intro', style: `--c:${who.c}` },
    h('div', { class: 'who', html: charSVG(who.id), onclick: (e) => hop(e.currentTarget.firstChild) }),
    h('div', { class: 'bubble' }, h('div', { class: 'who-name' }, who.name, speakBtn), h('div', { html: introText })));
  const quest = h('div', { class: 'quest' });
  const area = h('div', { class: 'area' });
  const hintBox = h('div', { class: 'hintbox', hidden: true });
  const textPane = h('section', { class: 'pane text' }, intro, hintBox, quest, area);

  const canvas = h('canvas', { class: 'sim' });
  const ctrls = h('div', { class: 'ctrls' });
  const launch = h('button', { class: 'btn primary', onclick: () => fire() }, h('span', { html: IC.play }), 'Lancia');
  const resetB = h('button', { class: 'btn', title: 'Ricomincia', 'aria-label': 'Ricomincia', onclick: () => { sim.stop(); sim.clearHistory?.(); sim.reset(); }, html: IC.reset });
  // Velocità della simulazione: 1×, 2×, 4× (le gare lente non fanno più aspettare).
  const MULS = [1, 2, 4];
  const speedB = h('button', { class: 'btn speed', title: 'Velocità della simulazione', 'aria-label': 'Velocità della simulazione: 1 volta' }, '1×');
  speedB.onclick = () => {
    const k = (MULS.indexOf(sim.mul || 1) + 1) % MULS.length;
    sim.mul = MULS[k]; speedB.textContent = `${MULS[k]}×`; speedB.setAttribute('aria-label', `Velocità della simulazione: ${MULS[k]} volte`);
    speedB.classList.toggle('on', MULS[k] > 1);
  };
  // La simulazione, il tasto Lancia e i cursori stanno insieme in un'unica scheda: si lancia senza scorrere la pagina.
  const canvasWrap = h('div', { class: 'canvas-wrap' + (SimClass && SimClass.tall ? ' tall' : '') }, canvas);
  const simPane = SimClass ? h('section', { class: 'pane simpane' }, h('div', { class: 'simcard' },
    canvasWrap, SimClass.staticSim ? null : h('div', { class: 'launch' }, launch, resetB, speedB), ctrls)) : null;
  // Se la simulazione non si vede tutta (telefono), la si porta in vista prima di partire.
  const showSim = () => {
    // La barra Lancia è appiccicata in fondo alla scheda: conta come spazio occupato sotto la simulazione.
    const r = canvasWrap.getBoundingClientRect(), top = 70, bar = simPane?.querySelector('.launch')?.offsetHeight || 0;
    if (r.top < top || r.bottom + bar > window.innerHeight) window.scrollBy({ top: Math.min(r.top - top, r.bottom + bar - window.innerHeight + 8), behavior: 'smooth' });
  };

  root.style.setProperty('--c', world.color);
  root.replaceChildren(head, h('main', { class: 'lvl' + (SimClass ? '' : ' nosim') }, textPane, simPane));

  if (SimClass) {
    sim = new SimClass(canvas, { ...(level.params || {}) });
    sim.onDone = (r) => {
      if (pending) { const p = pending; pending = null; p(r); }
      else if (onResult) onResult(r);
    };
  }

  // ---------- controlli della simulazione ----------
  let ctrlEls = [];
  function renderControls(keys, locked) {
    ctrls.replaceChildren();
    ctrlEls = [];
    if (!SimClass) return;
    for (const k of keys) {
      // labels può cambiare solo il nome del controllo (stringa) o anche min, max, passo e unità (oggetto).
      const ov = (level.labels || {})[k];
      const def = { ...SimClass.controls[k], ...(typeof ov === 'string' ? { label: ov } : ov || {}) };
      let el, update;
      if (def.type === 'toggle') {
        const b = h('button', { class: 'chip', onclick: () => { sim.set({ [k]: !sim.params[k] }); update(); } });
        update = () => { b.textContent = `${def.label}: ${sim.params[k] ? 'sì' : 'no'}`; b.classList.toggle('on', !!sim.params[k]); };
        el = h('div', { class: 'ctrl' }, b);
        b.disabled = locked;
      } else if (def.type === 'select') {
        const bs = def.options.map(([v, lab]) => h('button', { class: 'chip', onclick: () => { sim.set({ [k]: v }); update(); } }, lab));
        update = () => bs.forEach((b, i) => b.classList.toggle('on', sim.params[k] === def.options[i][0]));
        el = h('div', { class: 'ctrl' }, h('span', { class: 'lab' }, def.label), h('div', { class: 'chips' }, bs));
        bs.forEach((b) => (b.disabled = locked));
      } else {
        const val = h('output');
        const r = h('input', { type: 'range', min: def.min, max: def.max, step: def.step, disabled: locked });
        r.addEventListener('input', () => { sim.set({ [k]: Number(r.value) }); update(); });
        update = () => {
          r.value = sim.params[k];
          val.textContent = `${Number(sim.params[k]).toLocaleString('it-IT', { maximumFractionDigits: 2 })} ${def.unit}`;
        };
        const minus = h('button', { class: 'btn icon sm', disabled: locked, onclick: () => nudge(-1) }, '−');
        const plus = h('button', { class: 'btn icon sm', disabled: locked, onclick: () => nudge(1) }, '+');
        const nudge = (d) => {
          const v = Math.min(def.max, Math.max(def.min, Math.round((sim.params[k] + d * def.step) * 1000) / 1000));
          sim.set({ [k]: v }); update();
        };
        el = h('div', { class: 'ctrl' }, h('label', { class: 'lab' }, def.label, ' ', val), h('div', { class: 'range' }, minus, r, plus));
      }
      update();
      ctrlEls.push(update);
      ctrls.append(el);
    }
    if (sim && sim.onTick !== undefined) sim.onTick = () => ctrlEls.forEach((u) => u());
  }
  if (sim && SimClass.staticSim) sim.onTick = () => ctrlEls.forEach((u) => u());

  function setLaunch(on) {
    if (!SimClass || SimClass.staticSim) return;
    launch.hidden = !on;
    resetB.hidden = !on;
  }

  function fire() {
    if (busy || !sim) return;
    showSim();
    sim.start();
  }

  async function runSeq(seq) {
    busy = true;
    setLaunch(false);
    showSim();
    for (const p of seq) {
      sim.stop();
      if (SimClass.staticSim) {
        await sim.animateTo(p);
      } else {
        sim.set(p);
        ctrlEls.forEach((u) => u());
        await new Promise((res) => { pending = res; sim.start(); });
      }
      ctrlEls.forEach((u) => u());
      await wait(700);
    }
    busy = false;
  }

  // ---------- passi ----------
  function drawDots() {
    dots.replaceChildren(...steps.map((_, i) => h('span', { class: i < si ? 'd done' : i === si ? 'd now' : 'd' })));
  }

  function nextBtn(label = 'Avanti →') {
    const b = h('button', { class: 'btn primary', onclick: () => { si++; si < steps.length ? renderStep() : complete(); } }, label);
    return b;
  }

  function say(html, cls = '') { return h('div', { class: 'say ' + cls, html }); }

  // Risposta giusta: bordo verde, spunta che si traccia e un'onda che parte dal bottone.
  function markRight(b) {
    b.classList.add('right');
    if (!b.querySelector('.tick')) b.insertAdjacentHTML('beforeend', CHECK);
  }

  function renderStep() {
    const st = steps[si];
    resetHints();
    autoSol = null;
    quest.classList.remove('enter'); void quest.offsetWidth; quest.classList.add('enter');
    drawDots();
    onResult = null;
    area.replaceChildren();
    quest.innerHTML = tx(st.text, lens);
    if (sim) {
      sim.stop();
      if (st.set) sim.set(st.set);
      if (sim.clearHistory && st.clear) sim.clearHistory();
    }
    const locked = !!st.lock || (st.kind === 'q' && st.predict) || st.kind === 'run';
    const keys = st.controls ?? level.controls ?? [];
    renderControls(locked ? keys : keys, locked);
    setLaunch(!locked);
    ({ q: stepQ, free: stepFree, run: stepRun, tune: stepTune, num: stepNum, order: stepOrder, vars: stepVars })[st.kind](st);
    if (S.settings.voice) speak(plain(quest.innerHTML));
  }

  function stepQ(st) {
    // Le opzioni si mescolano a ogni partita: chi rigioca deve ricordare l'idea, non la posizione.
    const opts = st.keepOrder ? st.options.map((o, i) => ({ o, i })) : shuffle(st.options.map((o, i) => ({ o, i })));
    if (!st.predict) autoSol = () => `La risposta giusta è: <b>${tx(st.options[st.answer], lens)}</b>.`;
    const box = h('div', { class: 'opts' });
    const after = h('div');
    const btns = [];
    opts.forEach(({ o, i }) => { btns[i] = h('button', { class: 'opt', onclick: () => choose(i) }, h('span', { html: tx(o, lens) })); });
    box.append(...opts.map(({ i }) => btns[i]));
    area.append(box, after);
    async function choose(i) {
      if (busy) return;
      if (st.predict) {
        btns.forEach((b) => (b.disabled = true));
        btns[i].classList.add('picked');
        after.replaceChildren(say('Previsione fatta. Ora guardiamo l’esperimento…', 'muted'));
        await runSeq(st.predict);
        markRight(btns[st.answer]);
        // Una previsione sbagliata non costa stelle: sbagliare la previsione fa parte del gioco.
        if (i !== st.answer) { btns[i].classList.add('wrong'); sfx.no(); } else sfx.ok();
        const head = i === st.answer ? '<b>Previsione giusta!</b> ' : '<b>La previsione era diversa, ed è normale: gli scienziati imparano proprio così.</b> ';
        after.replaceChildren(say(head + tx(st.explain, lens), i === st.answer ? 'good' : 'warn'), nextBtn());
        setLaunch(true);
        return;
      }
      if (i === st.answer) {
        sfx.ok();
        btns.forEach((b) => (b.disabled = true));
        markRight(btns[i]);
        after.replaceChildren(say(tx(st.explain, lens), 'good'), nextBtn());
      } else {
        sfx.no();
        errors++;
        btns[i].classList.add('wrong');
        btns[i].disabled = true;
        after.replaceChildren(say(st.wrong ? tx(st.wrong, lens) : 'Non è questa. Riprova!', 'warn'));
      }
    }
  }

  function stepFree(st) {
    const need = st.runs || 0;
    let n = 0;
    const info = h('div', { class: 'muted small' });
    const nb = nextBtn();
    const upd = () => {
      nb.disabled = n < need;
      info.textContent = need ? `Esperimenti fatti: ${Math.min(n, need)} di ${need}` : '';
    };
    onResult = (r) => { n++; upd(); if (st.onRun) { const m = st.onRun(r, lens); if (m) area.querySelector('.fb').innerHTML = m; } };
    area.append(info, h('div', { class: 'fb say muted' }), nb);
    if (!st.onRun) area.querySelector('.fb').remove();
    upd();
  }

  async function stepRun(st) {
    const go = h('button', { class: 'btn primary' }, h('span', { html: IC.play }), 'Guarda l’esperimento');
    area.append(go);
    go.onclick = async () => {
      go.remove();
      await runSeq(st.seq);
      area.append(say(tx(st.explain, lens), 'good'), nextBtn());
      setLaunch(true);
    };
  }

  function stepTune(st) {
    const rounds = st.rounds || 2;
    let r = 0, target;
    const tbox = h('div', { class: 'target' });
    const fb = h('div', { class: 'say muted' });
    area.append(tbox, fb);
    const newTarget = () => {
      target = st.gen(lens, r);
      if (target.set && sim) sim.set(target.set);
      tbox.innerHTML = `<span class="round">Prova ${r + 1} di ${rounds}</span> ${target.text}`;
      fb.className = 'say muted';
      fb.innerHTML = r === 0 ? 'Regola i cursori e premi ▶ Lancia.' : 'Nuovi valori: la regola che hai trovato funziona ancora?';
    };
    onResult = (res) => {
      const out = st.check(res, target, lens);
      if (out.ok) {
        sfx.ok();
        r++;
        fb.className = 'say good';
        fb.innerHTML = out.msg || 'Perfetto!';
        if (r >= rounds) {
          onResult = null;
          area.append(nextBtn());
        } else setTimeout(newTarget, 1400);
      } else {
        sfx.no();
        fb.className = 'say warn';
        fb.innerHTML = out.msg;
      }
    };
    newTarget();
  }

  function stepNum(st) {
    const rounds = st.rounds || 2;
    let r = 0, cur;
    const qn = h('div', { class: 'target' });
    const inp = h('input', { type: 'text', inputmode: 'decimal', class: 'numin', placeholder: 'La tua risposta' });
    const unit = h('span', { class: 'unit' });
    const ok = h('button', { class: 'btn primary', onclick: () => check() }, 'Controlla');
    const fb = h('div', { class: 'say muted', hidden: true });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    area.append(qn, h('div', { class: 'numrow' }, inp, unit, ok), fb);
    const next = () => {
      cur = st.gen(lens, r);
      autoSol = () => (cur.explain ? String(cur.explain).replace(/^(Giusto|Esatto|Perfetto)[:!.]?\s*/i, '') : `Il risultato è ${String(cur.ans).replace('.', ',')} ${cur.unit || ''}.`);
      qn.innerHTML = `<span class="round">Domanda ${r + 1} di ${rounds}</span> ${cur.text}`;
      unit.textContent = cur.unit || '';
      inp.value = '';
      fb.hidden = true;
      if (cur.set && sim) sim.animateTo ? sim.animateTo(cur.set) : sim.set(cur.set);
    };
    function check() {
      const v = Number(inp.value.replace(',', '.').trim());
      if (inp.value.trim() === '' || Number.isNaN(v)) { fb.hidden = false; fb.className = 'say warn'; fb.textContent = 'Scrivi un numero.'; return; }
      const tol = cur.tol ?? Math.abs(cur.ans) * 0.02;
      fb.hidden = false;
      if (Math.abs(v - cur.ans) <= tol) {
        sfx.ok();
        r++;
        fb.className = 'say good';
        fb.innerHTML = cur.explain || 'Giusto!';
        if (r >= rounds) { ok.disabled = true; inp.disabled = true; area.append(nextBtn()); }
        else setTimeout(next, 1400);
      } else {
        sfx.no();
        errors++;
        fb.className = 'say warn';
        fb.innerHTML = cur.wrong || 'Non torna. Ricontrolla il calcolo.';
      }
    }
    next();
  }

  // Prepara l'esperimento: per ogni variabile scegli "Cambia" o "Uguale". Giusto quando cambia solo quella da studiare.
  function stepVars(st) {
    const pick = {};
    const rows = st.vars.map((v) => {
      const bs = ['Uguale', 'Cambia'].map((lab) => h('button', { class: 'chip', onclick: () => { pick[v.k] = lab; bs.forEach((b) => b.classList.toggle('on', b.textContent === lab)); ok.disabled = st.vars.some((x) => !pick[x.k]); } }, lab));
      return h('div', { class: 'varrow' }, h('span', { html: tx(v.t, lens) }), h('span', { class: 'chips' }, ...bs));
    });
    const fb = h('div', { class: 'say muted', hidden: true });
    const ok = h('button', { class: 'btn primary', disabled: true, onclick: () => check() }, 'Controlla');
    autoSol = () => 'Cambia solo ' + tx(st.vars.find((v) => v.k === st.change).t, lens) + '; tutto il resto resta uguale.';
    function check() {
      const good = st.vars.every((v) => (pick[v.k] === 'Cambia') === (v.k === st.change));
      fb.hidden = false;
      if (good) {
        sfx.ok();
        rows.forEach((r) => r.querySelectorAll('button').forEach((b) => (b.disabled = true)));
        ok.remove();
        fb.className = 'say good';
        fb.innerHTML = tx(st.explain, lens);
        area.append(nextBtn());
      } else {
        sfx.no();
        errors++;
        fb.className = 'say warn';
        const many = st.vars.filter((v) => pick[v.k] === 'Cambia').length;
        fb.innerHTML = many === 0 ? 'Se non cambi niente, l’esperimento non può dirti niente!' : st.wrong ? tx(st.wrong, lens) : 'Se cambi due cose insieme, poi non sai quale ha fatto la differenza.';
      }
    }
    area.append(h('div', { class: 'vars' }, ...rows), ok, fb);
  }

  function stepOrder(st) {
    let items = shuffle(st.items);
    while (items.every((it, i) => i === 0 || items[i - 1].v <= it.v)) items = shuffle(st.items);
    autoSol = () => 'L’ordine giusto è: ' + st.items.slice().sort((a, b) => a.v - b.v).map((it) => tx(it.t, lens)).join(' → ') + '.';
    const list = h('ol', { class: 'order' });
    const fb = h('div', { class: 'say muted', hidden: true });
    const ok = h('button', { class: 'btn primary', onclick: () => check() }, 'Controlla l’ordine');
    const draw = () => {
      list.replaceChildren(...items.map((it, i) => h('li', {},
        h('span', { html: tx(it.t, lens) }),
        h('span', { class: 'mv' },
          h('button', { class: 'btn icon sm', disabled: i === 0, onclick: () => move(i, -1) }, '▲'),
          h('button', { class: 'btn icon sm', disabled: i === items.length - 1, onclick: () => move(i, 1) }, '▼')))));
    };
    const move = (i, d) => { [items[i], items[i + d]] = [items[i + d], items[i]]; draw(); };
    function check() {
      const good = items.every((it, i) => i === 0 || items[i - 1].v <= it.v);
      fb.hidden = false;
      if (good) {
        sfx.ok();
        list.querySelectorAll('button').forEach((b) => (b.disabled = true));
        ok.remove();
        fb.className = 'say good';
        fb.innerHTML = tx(st.explain, lens);
        area.append(nextBtn());
      } else {
        sfx.no();
        errors++;
        fb.className = 'say warn';
        fb.textContent = 'Non ancora: qualcosa è fuori posto. Confronta due vicini alla volta.';
      }
    }
    draw();
    area.append(list, ok, fb);
  }

  // ---------- aiuti a gradini ----------
  // Gli aiuti seguono il passo in cui sei: se il passo ha i suoi suggerimenti si usano quelli, altrimenti quelli del livello.
  // Le stelle massime scendono una volta sola: ★★ dal primo suggerimento, ★ dalla prima soluzione vista.
  let stepHints = 0, stepSol = false;
  // I suggerimenti del livello valgono per il compito principale; le domande a scelta di un livello con più domande
  // usano i propri (o il loro "riprova" come unico indizio), così l'aiuto parla sempre del passo che hai davanti.
  const nQ = steps.filter((x) => x.kind === 'q' && !x.predict).length;
  const hintsHere = () => {
    const st = steps[si];
    if (st.hints) return st.hints;
    if (st.kind === 'q' && !st.predict && nQ > 1) return st.wrong ? [st.wrong] : [];
    if (st.kind === 'vars') return [st.wrong || T('Una cosa alla volta: cambia solo quello che vuoi studiare.')];
    return level.hints || [];
  };
  // Soluzione: quella del passo, poi quella ricavata dal passo stesso (domanda, calcolo, ordine), poi quella del livello.
  let autoSol = null;
  const solHere = () => steps[si].solution || (autoSol && autoSol()) || level.solution;
  function resetHints() { stepHints = 0; stepSol = false; hintBox.hidden = true; hintBox.replaceChildren(); }
  function showHint() {
    const hs = hintsHere(), sol = solHere();
    hintBox.hidden = false;
    if (stepHints < hs.length) { stepHints++; hints++; } else if (!stepSol && sol) { stepSol = true; solution = true; }
    const parts = hs.slice(0, stepHints).map((x, i) => `<p><b>Suggerimento ${i + 1}.</b> ${tx(x, lens)}</p>`);
    if (stepSol) parts.push(`<p><b>Soluzione.</b> ${tx(sol, lens)}</p>`);
    let more = '';
    if (stepHints < hs.length) more = '<p class="muted small">Premi di nuovo Aiuto per un altro suggerimento (le stelle massime scendono a ★★).</p>';
    else if (!stepSol && sol) more = '<p class="muted small">Premi ancora Aiuto per vedere la soluzione (stella massima ★).</p>';
    hintBox.innerHTML = parts.join('') + more;
    if (!hs.length && !sol) hintBox.innerHTML = '<p>Rileggi la domanda con calma e prova l’esperimento: la risposta si vede.</p>';
  }

  // ---------- fine livello ----------
  function complete() {
    stopSpeaking();
    const cap = solution ? 1 : hints ? 2 : 3;
    const stars = Math.max(1, cap - errors);
    const prev = S.done[level.id] || 0;
    const before = gradeNow();
    let gained = 0;
    if (stars > prev) { gained = (stars - prev) * 10; S.done[level.id] = stars; S.joule += gained; }
    let newPiece = null;
    if (level.piece && !S.park.includes(level.piece.id)) { S.park.push(level.piece.id); newPiece = level.piece; }
    save();
    const after = gradeNow();
    sfx.win();
    const nx = nextLevel(level.id);
    // Ultimo livello del mondo: festa del mondo completato e strada verso il mondo dopo.
    const wDone = !nx && worldDone(world), nw = wDone ? nextWorld(world) : null;
    const nwOpen = nw && worldReady(nw) && worldOpen(nw);
    const joule = h('span', { class: 'num' }, '+0 joule');
    const modal = h('div', { class: 'modal' }, h('div', { class: 'card pop' },
      h('div', { class: 'cele', html: charSVG(who.id, { cls: 'party' }) }),
      h('div', { class: 'stars big', html: starsSVG(stars), 'aria-label': `${stars} stelle su 3` }),
      h('h2', {}, wDone ? `${world.name}: completato!` : boss ? 'Mito smontato!' : 'Livello superato!'),
      wDone ? h('p', {}, nw ? (nwOpen ? `Si apre ${nw.name}: ${nw.field.toLowerCase()}.` : `Il prossimo mondo è ${nw.name} (${nw.field.toLowerCase()}): è in costruzione, arriva presto.`) : 'Hai finito tutto il percorso!') : null,
      gained ? h('p', { class: 'gain' }, h('span', { class: 'sun', html: IC.bolt }), joule) : h('p', {}, 'Nessun joule in più: avevi già fatto così bene.'),
      errors || hints || solution ? h('p', { class: 'muted small' }, stars < 3 ? 'Rigiocalo senza aiuti e senza errori per avere ★★★.' : '') : null,
      newPiece ? h('div', { class: 'piece' }, h('span', { class: 'pi', html: pieceSVG(newPiece.id) }), h('div', {}, h('b', {}, 'Nuovo pezzo per il tuo parco: ', newPiece.name), h('div', { class: 'small' }, newPiece.desc))) : null,
      after.name !== before.name ? h('div', { class: 'piece' }, h('span', { class: 'pi', html: pieceSVG('grado') }), h('div', {}, h('b', {}, 'Nuovo grado: ', after.name), h('div', { class: 'small' }, after.desc))) : null,
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: () => nav('#/livello/' + level.id) }, h('span', { html: IC.reset }), 'Rigioca'),
        h('button', { class: 'btn', onclick: () => leave() }, 'Mappa'),
        nx ? h('button', { class: 'btn primary', onclick: () => nav('#/livello/' + nx) }, 'Prossimo →') : null,
        nwOpen ? h('button', { class: 'btn primary', onclick: () => nav('#/mondo/' + nw.id) }, `${nw.name} →`) : null)));
    root.append(modal);
    const card = modal.firstChild;
    if (gained) setTimeout(() => countUp(joule, gained, { prefix: '+', suffix: ' joule' }), 500);
    else joule.textContent = '';
    setTimeout(() => confetti(card, { colors: [getComputedStyle(root).getPropertyValue('--c').trim() || '#7cc8ff', '#7cc8ff', '#ffd166', '#eef4ff'] }), 250);
  }

  function leave() {
    stopSpeaking();
    nav('#/mondo/' + world.id);
  }

  renderStep();

  return () => { stopSpeaking(); if (sim) sim.destroy(); };
}
