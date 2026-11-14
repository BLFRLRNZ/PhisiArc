// La cassetta degli attrezzi: gli strumenti di matematica che servono alle formule (radice, Pitagora, π, seno…).
// Nessuna formula è nascosta: la prima volta che un livello ne usa uno, prima di cominciare compare la sua scheda.
// Ogni scheda spiega lo strumento con un disegno da muovere e una domanda; poi resta nella cassetta per ripassarlo.
// Le schede si aprono solo nelle lenti con le formule (Studente e Curioso).
import { h, tx } from './util.js';
import { S, save } from './state.js';
import { t as tr, LOCALE } from './i18n.js';
import { sfx } from './audio.js';
import { toolAnim } from './toolanim.js';

const n = (x, d = 2) => Number(x).toLocaleString(LOCALE, { maximumFractionDigits: d });
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" class="tool-svg" aria-hidden="true">${inner}</svg>`;

// un cursore con il valore accanto
function slider(label, min, max, step, val, onIn) {
  const out = h('output');
  const r = h('input', { type: 'range', min, max, step, value: val, 'aria-label': label });
  const set = () => { out.textContent = n(r.value); onIn(Number(r.value)); };
  r.addEventListener('input', set);
  return { el: h('label', { class: 'tool-sl' }, h('span', {}, label, ' ', out), r), set, r };
}

// ---------- gli strumenti, nell'ordine in cui si imparano ----------
export const TOOLS = {
  formula: {
    title: () => tr('Leggere una formula'),
    sub: () => tr('Una frase della fisica scritta in breve'),
    // una lettera, un uguale: «v = …», «T = …»
    test: (s) => /(^|[^A-Za-z/])[A-Za-zθ][ₓᵧ₀]?\s?=\s?[^=\s]/.test(s),
    body: () => tr('Una formula è una <b>frase scritta in breve</b>. Ogni lettera è una grandezza che si può misurare. <b>v = d / t</b> si legge: «la velocità è la distanza divisa per il tempo». Muovi i cursori e leggi la frase.'),
    widget() {
      let d = 40, t = 8;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        const v = d / t;
        show.innerHTML = `<div class="tool-f"><span class="c1">v</span> = <span class="c2">d</span> / <span class="c3">t</span> = <span class="c2">${n(d)}</span> / <span class="c3">${n(t)}</span> = <span class="c1">${n(v)}</span></div>`
          + `<p>${tr('In <b>{t} s</b> percorri <b>{d} m</b>: cioè <b>{v} metri ogni secondo</b>.', { t: n(t), d: n(d), v: n(v) })}</p>`;
      };
      const a = slider(tr('distanza d (m)'), 0, 100, 5, d, (x) => { d = x; draw(); });
      const b = slider(tr('tempo t (s)'), 1, 20, 1, t, (x) => { t = x; draw(); });
      a.set(); b.set();
      return h('div', {}, show, a.el, b.el);
    },
    tip: () => tr('Prova: se raddoppi la distanza, che cosa fa v? E se raddoppi il tempo?'),
    check: () => ({
      q: tr('In v = d / t il tempo raddoppia e la distanza resta uguale. La velocità…'),
      options: [tr('si dimezza'), tr('raddoppia'), tr('resta uguale')],
      ok: tr('Giusto: dividi per un numero doppio, ottieni la metà. Leggere la formula ti dice come cambiano le cose senza fare conti.'),
    }),
  },

  quadrato: {
    title: () => tr('Il quadrato: x²'),
    sub: () => tr('Un numero per se stesso'),
    // ² ma non nelle unità di misura (m/s², m²): lì è solo un modo di scrivere l'unità
    test: (s) => /(?<![/ ]s|\bm|\bkm|\bcm)²/.test(s),
    body: () => tr('<b>x²</b> si legge «x al quadrato» e vuol dire <b>x per x</b>. Il nome viene da un disegno: è l’area di un quadrato con il lato lungo x. Muovi il lato e conta i quadretti.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (x) => {
        const c = 16, s = x * c;
        let g = '';
        for (let i = 0; i < x; i++) for (let j = 0; j < x; j++) g += `<rect x="${10 + i * c}" y="${10 + j * c}" width="${c - 2}" height="${c - 2}" rx="2" class="cell"/>`;
        show.innerHTML = svg(184, 184, g + `<rect x="9" y="9" width="${s}" height="${s}" class="edge"/>`)
          + `<div class="tool-f">${x}² = ${x} × ${x} = <span class="c1">${x * x}</span></div>`;
      };
      const a = slider(tr('lato x'), 1, 10, 1, 3, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Guarda bene: con il lato doppio, i quadretti diventano 4 volte tanti. Per questo in fisica le cose «al quadrato» crescono in fretta.'),
    check: () => ({
      q: tr('Il lato di un quadrato passa da 3 a 6. L’area…'),
      options: [tr('diventa 4 volte più grande'), tr('raddoppia'), tr('cresce di 3')],
      ok: tr('Giusto: 3² = 9 e 6² = 36, quattro volte tanto. Lato doppio, area quadrupla.'),
    }),
  },

  radice: {
    title: () => tr('La radice quadrata: √'),
    sub: () => tr('Il quadrato fatto al contrario'),
    test: (s) => /√/.test(s),
    body: () => tr('La radice <b>√</b> fa la domanda al contrario del quadrato: «<b>quanto è lungo il lato</b> di un quadrato con quest’area?». √49 = 7, perché 7 × 7 = 49. Scegli un’area e guarda il lato.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (A) => {
        const r = Math.sqrt(A), s = r * 16, exact = Number.isInteger(r);
        show.innerHTML = svg(184, 184, `<rect x="10" y="10" width="${s}" height="${s}" class="area"/><line x1="10" y1="${16 + s}" x2="${10 + s}" y2="${16 + s}" class="side"/>`)
          + `<div class="tool-f">√${A} = <span class="c1">${n(r)}</span>${exact ? ` <span class="tool-ok">${tr('esatta!')}</span>` : ''}</div>`
          + `<p class="small muted">${exact ? tr('{r} × {r} = {A}', { r, A }) : tr('Non è un numero intero: va bene, la fisica usa spesso i numeri con la virgola.')}</p>`;
      };
      const a = slider(tr('area'), 1, 100, 1, 49, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Cerca le aree con la radice esatta: 4, 9, 16, 25… Sono i quadrati dei numeri interi.'),
    check: () => ({
      q: tr('Quanto fa √64?'),
      options: ['8', '32', '16'],
      ok: tr('Giusto: 8 × 8 = 64. La radice chiede «quale numero, moltiplicato per se stesso, dà 64?».'),
    }),
  },

  pitagora: {
    title: () => tr('Il teorema di Pitagora'),
    sub: () => tr('Quanto è lunga la diagonale'),
    test: (s) => /Pitagora|Pythagor|√\s?\([^)]*²\s?\+/.test(s), // anche quando la formula c'è ma il nome no
    body: () => tr('In un triangolo con un <b>angolo retto</b>, i quadrati costruiti sui due lati corti, messi insieme, hanno la stessa area del quadrato sul lato lungo: <b>c² = a² + b²</b>. Quindi il lato lungo è <b>c = √(a² + b²)</b>.'),
    widget() {
      let a = 3, b = 4;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        const c = Math.hypot(a, b);
        // angolo retto nell'origine, a in orizzontale, b in verticale; i tre quadrati verso l'esterno
        const A = [0, 0], B = [a, 0], C = [0, -b];
        const sqA = [A, B, [a, a], [0, a]], sqB = [A, C, [-b, -b], [-b, 0]];
        const ux = (B[0] - C[0]), uy = (B[1] - C[1]), sqC = [C, B, [B[0] + uy, B[1] - ux], [C[0] + uy, C[1] - ux]];
        const all = [...sqA, ...sqB, ...sqC], xs = all.map((q) => q[0]), ys = all.map((q) => q[1]);
        const minx = Math.min(...xs), miny = Math.min(...ys), w = Math.max(...xs) - minx, hh = Math.max(...ys) - miny;
        const k = 170 / Math.max(w, hh), P = (q) => `${((q[0] - minx) * k + 8).toFixed(1)},${((q[1] - miny) * k + 8).toFixed(1)}`;
        const poly = (pts, cls) => `<polygon points="${pts.map(P).join(' ')}" class="${cls}"/>`;
        show.innerHTML = svg(w * k + 16, hh * k + 16, poly(sqA, 'sqa') + poly(sqB, 'sqb') + poly(sqC, 'sqc') + poly([A, B, C], 'tri'))
          + `<div class="tool-f"><span class="c1">c</span> = √(<span class="c2">${n(a)}²</span> + <span class="c3">${n(b)}²</span>) = √${n(a * a + b * b)} = <span class="c1">${n(c)}</span></div>`
          + `<p class="small muted">${tr('Il quadrato azzurro ha la stessa area degli altri due messi insieme: {x} + {y} = {z}. E il lato lungo non è {s}: è sempre più corto della somma degli altri due.', { x: a * a, y: b * b, z: a * a + b * b, s: n(a + b) })}</p>`;
      };
      const sa = slider(tr('lato a'), 1, 10, 1, a, (x) => { a = x; draw(); });
      const sb = slider(tr('lato b'), 1, 10, 1, b, (x) => { b = x; draw(); });
      sa.set(); sb.set();
      return h('div', {}, show, sa.el, sb.el);
    },
    tip: () => tr('In fisica serve per sommare due frecce a squadra: una barca a 3 m/s e una corrente a 4 m/s fanno 5 m/s, non 7.'),
    check: () => ({
      q: tr('Due frecce a squadra, lunghe 6 e 8. Quanto è lunga la freccia somma?'),
      options: ['10', '14', '48'],
      ok: tr('Giusto: √(36 + 64) = √100 = 10.'),
    }),
  },

  pi: {
    title: () => tr('Pi greco: π'),
    sub: () => tr('Quante volte il diametro sta nel giro'),
    test: (s) => /π/.test(s),
    body: () => tr('Prendi un cerchio qualsiasi, piccolo o enorme: misura il <b>giro</b> e dividilo per il <b>diametro</b>. Viene sempre <b>3,14159…</b>, un numero che non finisce mai. Si chiama <b>π</b> (pi greco). Così il giro è <b>C = π·d = 2π·r</b>.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (r) => {
        const k = 9, d = 2 * r * k, C = Math.PI * d, cx = 14 + r * k, y = 26 + d + 22;
        let marks = '';
        for (let i = 1; i <= 3; i++) marks += `<line x1="${14 + i * d}" y1="${y - 6}" x2="${14 + i * d}" y2="${y + 6}" class="mk"/>`;
        show.innerHTML = svg(Math.max(184, 30 + C), y + 20, `<circle cx="${cx}" cy="${20 + r * k}" r="${r * k}" class="circ"/><line x1="14" y1="${20 + r * k}" x2="${14 + d}" y2="${20 + r * k}" class="dia"/>`
          + `<line x1="14" y1="${y}" x2="${14 + C}" y2="${y}" class="unroll"/>${marks}<text x="${14 + C}" y="${y + 18}" class="lb" text-anchor="end">${tr('il giro, srotolato')}</text>`)
          + `<div class="tool-f">${tr('giro')} ÷ ${tr('diametro')} = ${n(Math.PI * 2 * r, 1)} ÷ ${2 * r} = <span class="c1">${n(Math.PI, 4)}…</span></div>`;
      };
      const a = slider(tr('raggio r'), 1, 6, 1, 3, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Le tacche sulla linea srotolata sono lunghe un diametro: ce ne stanno 3 e un pezzetto. Quel pezzetto è lo 0,14 di π.'),
    check: () => ({
      q: tr('Una ruota ha il diametro di 1 metro. Di quanto avanza la bici in un giro di ruota?'),
      options: [tr('circa 3,14 m'), tr('1 m'), tr('2 m')],
      ok: tr('Giusto: in un giro la ruota srotola tutto il suo bordo, π volte il diametro.'),
    }),
  },

  seno: {
    title: () => tr('Seno e coseno'),
    sub: () => tr('Le due ombre di una freccia inclinata'),
    test: (s) => /(?<!\p{L})(sin|cos|sen|seno|coseno|sine|cosine)(?!\p{L})/u.test(s), // parole intere: «così» non conta
    body: () => tr('Una freccia inclinata fa due <b>ombre</b>: una per terra e una sul muro. Se la freccia è lunga 1, l’ombra per terra si chiama <b>coseno</b> dell’angolo (cos θ), quella sul muro <b>seno</b> (sin θ, a scuola anche sen θ). Per una freccia lunga v: <b>vₓ = v·cos θ</b> e <b>v_y = v·sin θ</b>.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (deg) => {
        const L = 130, a = (deg * Math.PI) / 180, x0 = 30, y0 = 150, cx = Math.cos(a), sy = Math.sin(a);
        const X = x0 + L * cx, Y = y0 - L * sy;
        show.innerHTML = svg(184, 170, `<line x1="${x0}" y1="${y0}" x2="${x0 + L}" y2="${y0}" class="ground"/>`
          + `<line x1="${x0}" y1="${y0 + 4}" x2="${X}" y2="${y0 + 4}" class="shx"/><line x1="${X}" y1="${y0}" x2="${X}" y2="${Y}" class="shy"/>`
          + `<line x1="${x0}" y1="${y0}" x2="${X}" y2="${Y}" class="arrow"/><circle cx="${X}" cy="${Y}" r="4" class="tipdot"/>`
          + `<path d="M${x0 + 26} ${y0} A26 26 0 0 0 ${x0 + 26 * cx} ${y0 - 26 * sy}" class="ang"/><text x="${x0 + 32}" y="${y0 - 8}" class="lb">θ</text>`)
          + `<div class="tool-f"><span class="c2">cos ${deg}° = ${n(cx)}</span> · <span class="c3">sin ${deg}° = ${n(sy)}</span></div>`;
      };
      const a = slider(tr('angolo θ (°)'), 0, 90, 5, 30, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Prova 0°, 45° e 90°. A 0° la freccia è tutta per terra (cos = 1), a 90° tutta in piedi (sin = 1). A 30° il seno vale esattamente 0,5.'),
    check: () => ({
      q: tr('Una freccia è dritta in piedi, a 90°. Quanto è lunga la sua ombra per terra?'),
      options: [tr('zero: cos 90° = 0'), tr('quanto la freccia'), tr('metà della freccia')],
      ok: tr('Giusto: una freccia verticale non ha ombra per terra. Per questo un sasso lanciato dritto in su non va avanti.'),
    }),
  },
};
export const TOOL_IDS = Object.keys(TOOLS);

// ---------- quali strumenti usa un livello ----------
const texts = (o, lens, out, seen = new Set()) => {
  if (!o || seen.has(o)) return out;
  if (typeof o === 'string') { out.push(o); return out; }
  if (typeof o !== 'object') return out;
  seen.add(o);
  if ('e' in o && 's' in o && !Array.isArray(o)) { out.push(tx(o, lens)); return out; }
  for (const [k, v] of Object.entries(o)) if (!['id', 'sim', 'kind', 'controls', 'params', 'only', 'zoneRef'].includes(k)) texts(v, lens, out, seen);
  return out;
};
export function toolsIn(level, lens) {
  const steps = (level.steps || []).filter((s) => !s.only || s.only.includes(lens));
  const all = texts({ intro: level.intro, steps, hints: level.hints, solution: level.solution }, lens, []);
  // i passi con i numeri inventati: si guarda anche un esempio di quello che scrivono
  for (const s of steps) if (typeof s.gen === 'function') { try { texts(s.gen(lens), lens, all); } catch { /* niente */ } }
  const txt = all.join('\n');
  return TOOL_IDS.filter((id) => TOOLS[id].test(txt));
}
export const toolsOn = (lens) => lens === 's' || lens === 'c';
export const toolState = (id) => (S.tools || {})[id] || 0; // 0 mai visto, 1 visto, 2 domanda giusta
const mark = (id, v) => { S.tools = S.tools || {}; if ((S.tools[id] || 0) < v) { S.tools[id] = v; save(); } };
// gli strumenti nuovi per questo livello (vuoto per l'Esploratore)
export const newTools = (level, lens) => (toolsOn(lens) ? toolsIn(level, lens).filter((id) => !toolState(id)) : []);

// ---------- la scheda di uno strumento ----------
// queue: gli strumenti da mostrare uno dopo l'altro; onEnd: quando l'ultimo è chiuso
export function toolCard(queue, onEnd, { inLevel = false } = {}) {
  const box = h('section', { class: 'toolcard', 'aria-live': 'polite' });
  let i = 0;
  const show = () => {
    const id = queue[i], T = TOOLS[id], ck = T.check();
    mark(id, 1);
    const fb = h('p', { class: 'tool-fb', hidden: true });
    const order = ck.options.map((o, k) => [o, k]).sort(() => Math.random() - 0.5);
    const opts = order.map(([o, k]) => h('button', { class: 'opt', onclick: (e) => {
      const b = e.currentTarget;
      if (k === 0) {
        b.classList.add('right'); opts.forEach((x) => (x.disabled = true));
        fb.hidden = false; fb.className = 'tool-fb good'; fb.innerHTML = ck.ok; mark(id, 2); sfx.ok?.();
      } else { b.classList.add('wrong'); b.disabled = true; fb.hidden = false; fb.className = 'tool-fb'; fb.textContent = tr('Non ancora: muovi il disegno qui sopra e riprova.'); sfx.no?.(); }
    } }, o));
    const last = i === queue.length - 1;
    const nextLabel = !last ? tr('Avanti: {t}', { t: TOOLS[queue[i + 1]].title() }) : inLevel ? tr('Al livello') : tr('Chiudi');
    const go = () => { if (last) { box.remove(); onEnd && onEnd(); } else { i++; show(); box.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }); } };
    box.replaceChildren(
      h('div', { class: 'tool-tag' }, inLevel ? (queue.length > 1 ? tr('Nuovo attrezzo · {i} di {n}', { i: i + 1, n: queue.length }) : tr('Nuovo attrezzo')) : tr('Attrezzo')),
      h('h3', {}, T.title()),
      toolAnim(id),
      h('p', { html: T.body() }),
      T.widget(),
      h('p', { class: 'small tool-tip', html: T.tip() }),
      h('div', { class: 'tool-check' }, h('p', {}, h('b', {}, ck.q)), h('div', { class: 'opts' }, opts), fb),
      h('div', { class: 'row' },
        inLevel ? h('button', { class: 'btn ghost', onclick: () => { for (let k = i; k < queue.length; k++) mark(queue[k], 1); box.remove(); onEnd && onEnd(); } }, tr('Li so già')) : null,
        h('button', { class: 'btn primary', onclick: go }, nextLabel)));
  };
  show();
  return box;
}

// ---------- la pagina della cassetta ----------
export function toolboxPage() {
  const holder = h('div', { class: 'tool-holder' });
  const list = h('div', { class: 'tool-list' }, TOOL_IDS.map((id) => {
    const st = toolState(id);
    return h('button', { class: 'lvl-item tool-item' + (st ? ' seen' : ''), onclick: () => { holder.replaceChildren(toolCard([id], () => render())); holder.scrollIntoView({ behavior: 'smooth' }); } },
      h('b', {}, TOOLS[id].title()), h('span', { class: 'small muted' }, st === 2 ? '✓ ' + TOOLS[id].sub() : st ? TOOLS[id].sub() : tr('Non l’hai ancora incontrato · ') + TOOLS[id].sub()));
  }));
  const wrap = h('div', {}, list, holder);
  const render = () => wrap.replaceWith(toolboxPage());
  return wrap;
}
export const toolCount = () => TOOL_IDS.filter((id) => toolState(id)).length;
