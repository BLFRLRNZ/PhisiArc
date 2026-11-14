// Il motore di un livello: testo, simulazione, passi (domande, prove, regolazioni) e stelle.
import { h, tx, shuffle, plain, wait } from './util.js';
import { S, save } from './state.js';
import { SIMS } from './sims/index.js';
import { sfx, speak, stopSpeaking } from './audio.js';
import { CAST, charSVG, hop } from './cast.js';
import { IC } from './icons.js';
import { KIND, worldOf, zoneOf, nextLevel, gradeNow } from './content/index.js';

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
  const resetB = h('button', { class: 'btn', title: 'Ricomincia', 'aria-label': 'Ricomincia', onclick: () => { sim.stop(); sim.reset(); }, html: IC.reset });
  const simPane = SimClass ? h('section', { class: 'pane simpane' }, h('div', { class: 'canvas-wrap' }, canvas), ctrls,
    SimClass.staticSim ? null : h('div', { class: 'launch' }, launch, resetB)) : null;

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
      const def = { ...SimClass.controls[k], ...((level.labels || {})[k] ? { label: level.labels[k] } : {}) };
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
    sim.start();
  }

  async function runSeq(seq) {
    busy = true;
    setLaunch(false);
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

  function renderStep() {
    const st = steps[si];
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
    ({ q: stepQ, free: stepFree, run: stepRun, tune: stepTune, num: stepNum, order: stepOrder })[st.kind](st);
    if (S.settings.voice) speak(plain(quest.innerHTML));
  }

  function stepQ(st) {
    const opts = st.options.map((o, i) => ({ o, i }));
    const box = h('div', { class: 'opts' });
    const after = h('div');
    const btns = opts.map(({ o, i }) => h('button', { class: 'opt', onclick: () => choose(i) }, h('span', { html: tx(o, lens) })));
    box.append(...btns);
    area.append(box, after);
    async function choose(i) {
      if (busy) return;
      if (st.predict) {
        btns.forEach((b) => (b.disabled = true));
        btns[i].classList.add('picked');
        after.replaceChildren(say('Previsione fatta. Ora guardiamo l’esperimento…', 'muted'));
        await runSeq(st.predict);
        btns[st.answer].classList.add('right');
        if (i !== st.answer) { btns[i].classList.add('wrong'); errors++; sfx.no(); } else sfx.ok();
        const head = i === st.answer ? '<b>Previsione giusta!</b> ' : '<b>La previsione era diversa, ed è normale: gli scienziati imparano proprio così.</b> ';
        after.replaceChildren(say(head + tx(st.explain, lens), i === st.answer ? 'good' : 'warn'), nextBtn());
        setLaunch(true);
        return;
      }
      if (i === st.answer) {
        sfx.ok();
        btns.forEach((b) => (b.disabled = true));
        btns[i].classList.add('right');
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

  function stepOrder(st) {
    let items = shuffle(st.items);
    while (items.every((it, i) => i === 0 || items[i - 1].v <= it.v)) items = shuffle(st.items);
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
  function showHint() {
    const hs = level.hints || [];
    hintBox.hidden = false;
    if (hints < hs.length) {
      hints++;
    } else if (!solution && level.solution) {
      solution = true;
    }
    const parts = hs.slice(0, hints).map((x, i) => `<p><b>Suggerimento ${i + 1}.</b> ${tx(x, lens)}</p>`);
    if (solution) parts.push(`<p><b>Soluzione.</b> ${tx(level.solution, lens)}</p>`);
    let more = '';
    if (hints < hs.length) more = '<p class="muted small">Premi di nuovo Aiuto per un altro suggerimento (le stelle massime scendono a ★★).</p>';
    else if (!solution && level.solution) more = '<p class="muted small">Premi ancora Aiuto per vedere la soluzione (stella massima ★).</p>';
    hintBox.innerHTML = parts.join('') + more;
    if (!hs.length && !level.solution) hintBox.innerHTML = '<p>Rileggi la domanda con calma e prova l’esperimento: la risposta si vede.</p>';
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
    const modal = h('div', { class: 'modal' }, h('div', { class: 'card pop' },
      h('div', { class: 'cele', html: charSVG(who.id, { cls: 'party' }) }),
      h('div', { class: 'stars big' }, '★'.repeat(stars), h('span', { class: 'off' }, '★'.repeat(3 - stars))),
      h('h2', {}, boss ? 'Mito smontato!' : 'Livello superato!'),
      h('p', {}, gained ? `+${gained} joule` : 'Nessun joule in più: avevi già fatto così bene.'),
      errors || hints || solution ? h('p', { class: 'muted small' }, stars < 3 ? 'Rigiocalo senza aiuti e senza errori per avere ★★★.' : '') : null,
      newPiece ? h('div', { class: 'piece' }, h('span', { class: 'pi' }, newPiece.icon), h('div', {}, h('b', {}, 'Nuovo pezzo per il tuo parco: ', newPiece.name), h('div', { class: 'small' }, newPiece.desc))) : null,
      after.name !== before.name ? h('div', { class: 'piece' }, h('span', { class: 'pi' }, '🎓'), h('div', {}, h('b', {}, 'Nuovo grado: ', after.name), h('div', { class: 'small' }, after.desc))) : null,
      h('div', { class: 'row' },
        h('button', { class: 'btn', onclick: () => nav('#/livello/' + level.id) }, h('span', { html: IC.reset }), 'Rigioca'),
        h('button', { class: 'btn', onclick: () => leave() }, 'Mappa'),
        nx ? h('button', { class: 'btn primary', onclick: () => nav('#/livello/' + nx) }, 'Prossimo →') : null)));
    root.append(modal);
  }

  function leave() {
    stopSpeaking();
    nav('#/mondo/' + world.id);
  }

  renderStep();

  return () => { stopSpeaking(); if (sim) sim.destroy(); };
}
