// La cassetta degli attrezzi: gli strumenti di matematica che servono alle formule (potenze di 10, radice, Pitagora, π, seno…)
// e, dall'Officina, le idee della fisica (l'inerzia, F = m·a, azione e reazione).
// Nessuna formula è nascosta: la prima volta che un livello ha bisogno di un attrezzo di matematica PER RISPONDERE, prima di
// cominciare compare la sua scheda. Quando invece l'attrezzo compare solo in una spiegazione, in un aiuto o in un riquadro
// facoltativo, la scheda non interrompe: sotto il testo c'è un bottone per aprirla (level.js, offerTools).
// Gli attrezzi di fisica (offer: true) non interrompono mai: si offrono con il bottone dove un testo ne parla.
// Ogni scheda ha il suo piccolo film, un disegno da muovere e una domanda; poi resta nella cassetta per ripassarla.
// Le schede si aprono solo nelle lenti con le formule (Studente e Curioso).
import { h, tx, noBox } from './util.js';
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
// needs: gli attrezzi che vanno conosciuti prima (la radice è il quadrato al contrario: prima il quadrato).
const SUP = (k) => String(k).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
export const TOOLS = {
  potenze: {
    title: () => tr('Le potenze di 10'),
    sub: () => tr('Contare i passi da 10'),
    test: (s) => /10[⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(s),
    body: () => tr('Per i numeri enormi e per quelli piccolissimi si contano i <b>passi da 10</b>. <b>10³</b> vuol dire 10 × 10 × 10 = 1000: tre passi in su. Con il meno si scende: <b>10⁻³</b> è 1 diviso per 10 tre volte, cioè 0,001. Il numero piccolo in alto si chiama <b>esponente</b>: muovilo.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (k) => {
        // la riga degli esponenti da −6 a 9: un salto per ogni passo da 10, a partire da 1
        const X = (e) => 14 + (e + 6) * 18, y = 46, d = Math.sign(k);
        let g = `<line x1="${X(-6)}" y1="${y}" x2="${X(9)}" y2="${y}" class="ground"/>`;
        for (let e = -6; e <= 9; e++) g += `<line x1="${X(e)}" y1="${y - (e % 3 === 0 ? 6 : 3)}" x2="${X(e)}" y2="${y + (e % 3 === 0 ? 6 : 3)}" class="${e === 0 ? 'dia' : 'ground'}"/>`;
        for (let e = 0; e !== k; e += d) g += `<path d="M${X(e)} ${y - 6}Q${(X(e) + X(e + d)) / 2} ${y - 28} ${X(e + d)} ${y - 6}" class="hop${d < 0 ? ' down' : ''}"/>`;
        g += `<circle cx="${X(k)}" cy="${y}" r="5" class="tipdot"/><text x="${X(0)}" y="${y + 22}" class="lb" text-anchor="middle">1</text>`;
        show.innerHTML = `<svg viewBox="0 0 298 76" class="tool-svg wide" aria-hidden="true">${g}</svg>`
          + `<div class="tool-f">10${SUP(k)} = <span class="c1">${(10 ** k).toLocaleString(LOCALE, { maximumFractionDigits: 9 })}</span></div>`
          + `<p class="small muted">${k === 0 ? tr('Nessun passo: 10⁰ vale 1.') : k > 0 ? tr('Passi in su: {k}. Si parte da 1 e a ogni passo si moltiplica per 10.', { k }) : tr('Passi in giù: {k}. Si parte da 1 e a ogni passo si divide per 10.', { k: -k })}</p>`;
      };
      const a = slider(tr('esponente'), -6, 9, 1, 3, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Guarda gli zeri: 10⁶ ha sei zeri (un milione), 10⁻² ha due cifre dopo la virgola (un centesimo). Per moltiplicare due potenze si sommano gli esponenti: 10² × 10³ = 10⁵.'),
    check: () => ({
      q: tr('Quanto vale 10⁻²?'),
      options: [n(0.01), '−100', n(0.2)],
      ok: tr('Giusto: due passi in giù da 1. Dividi per 10 due volte: 1 → 0,1 → 0,01.'),
    }),
  },

  formula: {
    title: () => tr('Leggere una formula'),
    sub: () => tr('Una frase della fisica scritta in breve'),
    // una lettera, un uguale: «v = …», «T = …». Non le uguaglianze fra unità di misura: «1000 m = 1 km», «10³ m = 1000 m»
    test: (s) => /(^|[^A-Za-z/\d⁰¹²³⁴⁵⁶⁷⁸⁹])(?<![\d⁰¹²³⁴⁵⁶⁷⁸⁹] )[A-Za-zθ][ₓᵧ₀]?\s?=\s?[^=\s]/.test(s),
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
    // ² ma non nelle unità di misura (m/s², m²), dove è solo un modo di scrivere l'unità, né nelle potenze di 10 (10², 10⁻²)
    test: (s) => /(?<![/ ]s|\bm|\bkm|\bcm|10|[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹])²(?![⁰¹²³⁴⁵⁶⁷⁸⁹])/.test(s),
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
    needs: ['quadrato'],
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
    needs: ['quadrato', 'radice'],
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

  // ---------- gli attrezzi di fisica: le idee dell'Officina ----------
  inerzia: {
    area: 'fisica', offer: true,
    title: () => tr('La forza e l’inerzia'),
    sub: () => tr('Senza forze, la velocità non cambia'),
    test: (s) => /(?<!\p{L})(inerzia|inertia)(?!\p{L})/iu.test(s),
    body: () => tr('Una <b>forza</b> è una spinta o un tiro: ha una direzione e un’intensità, e si disegna con una freccia. Le forze <b>cambiano la velocità</b>: la fanno crescere, calare o girare. Senza forze la velocità non cambia: un corpo fermo resta fermo, uno che si muove continua dritto e alla stessa velocità. È l’<b>inerzia</b>, la prima legge di Newton. Scegli il pavimento: quanto frena?'),
    widget() {
      const FL = [[tr('binario liscio'), 0], [tr('ghiaccio'), 0.02], [tr('legno'), 0.08], [tr('tappeto'), 0.25]];
      const show = h('div', { class: 'tool-show' });
      let a;
      const draw = (i) => {
        // un carrello parte a 2 m/s: dove si ferma? d = v² / (2·μ·g)
        const [name, mu] = FL[i], d = mu ? 4 / (2 * mu * 9.81) : Infinity, X = (m) => 22 + m * 13, y = 60, end = Math.min(X(12), X(d));
        let g = `<line x1="${X(0) - 8}" y1="${y}" x2="${X(12) + 4}" y2="${y}" class="ground"/>`;
        g += `<line x1="${X(0)}" y1="${y + 12}" x2="${end}" y2="${y + 12}" class="unroll"/>`;
        if (mu) g += `<line x1="${end}" y1="${y + 5}" x2="${end}" y2="${y + 19}" class="mk"/><text x="${end}" y="${y + 32}" class="lb" text-anchor="middle">${n(d, 1)} m</text>`;
        else g += `<path d="M${X(12) - 4} ${y + 6}l8 6l-8 6" class="hop"/><text x="${X(12)}" y="${y + 32}" class="lb" text-anchor="end">${tr('non si ferma')}</text>`;
        g += `<rect x="${X(0) - 12}" y="${y - 14}" width="24" height="10" rx="2" class="edge"/><circle cx="${X(0) - 6}" cy="${y - 3}" r="3" class="edge"/><circle cx="${X(0) + 6}" cy="${y - 3}" r="3" class="edge"/>`;
        // la frenata del pavimento: una freccia all'indietro, lunga quanto frena
        if (mu) g += `<line x1="${X(0) + 14}" y1="${y - 24}" x2="${X(0) + 14 - 6 - mu * 120}" y2="${y - 24}" class="frc"/><path d="M${X(0) + 14 - 6 - mu * 120 + 5} ${y - 28}l-5 4l5 4" class="frc"/>`;
        show.innerHTML = svg(190, 100, g) + `<p class="small">${mu ? tr('<b>{p}</b>: il pavimento frena con una forza all’indietro. Partito a 2 m/s, il carrello si ferma dopo {d} m.', { p: name, d: n(d, 1) }) : tr('<b>{p}</b>: niente lo spinge e niente lo frena, e la velocità resta 2 m/s per sempre.', { p: name })}</p>`;
        if (a) a.el.querySelector('output').textContent = name;
      };
      a = slider(tr('pavimento'), 0, 3, 1, 3, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Un disco da hockey, una sonda nello spazio, un passeggero quando l’autobus frena: tutti continuano come stavano andando, finché una forza non li cambia. Per questo esistono le cinture.'),
    check: () => ({
      q: tr('Un disco scivola su un ghiaccio perfettamente liscio, e niente lo tocca. Che cosa fa?'),
      options: [tr('continua dritto, alla stessa velocità'), tr('rallenta fino a fermarsi'), tr('accelera piano piano')],
      ok: tr('Giusto: senza forze la velocità non cambia, né in grandezza né in direzione.'),
    }),
  },

  newton: {
    area: 'fisica', offer: true,
    title: () => tr('Forza, massa e accelerazione'),
    sub: () => tr('La seconda legge di Newton: F = m · a'),
    test: (s) => /m ?· ?a\b|F ?\/ ?m\b|seconda legge|second law/i.test(s),
    body: () => tr('La <b>seconda legge di Newton</b>: <b>F = m · a</b>. Più forza, più accelerazione; più massa, meno accelerazione. La forza si misura in <b>newton</b> (N): 1 N dà a 1 kg un’accelerazione di 1 m/s². Muovi la forza e la massa: le barre sono la velocità dopo 1, 2 e 3 secondi.'),
    widget() {
      let F = 6, m = 2;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        const a = F / m, k = Math.min(10, 130 / (3 * a));
        let g = '';
        for (let s = 1; s <= 3; s++) {
          const y = 14 + (s - 1) * 22, w = a * s * k, w0 = a * (s - 1) * k;
          g += `<text x="4" y="${y + 9}" class="lb">${s} s</text><rect x="30" y="${y}" width="${w0}" height="12" rx="2" class="cell"/><rect x="${30 + w0}" y="${y}" width="${w - w0}" height="12" rx="2" class="sqb"/>`;
        }
        show.innerHTML = svg(190, 82, g)
          + `<div class="tool-f"><span class="c3">a</span> = <span class="c2">F</span> / <span class="c4">m</span> = <span class="c2">${n(F)}</span> / <span class="c4">${n(m)}</span> = <span class="c3">${n(a)}</span> m/s²</div>`
          + `<p class="small muted">${tr('Ogni secondo la velocità cresce dello stesso pezzo verde: {a} m/s.', { a: n(a) })}</p>`;
      };
      const a = slider(tr('forza F (N)'), 1, 12, 1, F, (x) => { F = x; draw(); });
      const b = slider(tr('massa m (kg)'), 1, 6, 1, m, (x) => { m = x; draw(); });
      a.set(); b.set();
      return h('div', {}, show, a.el, b.el);
    },
    tip: () => tr('Con la stessa forza, massa doppia vuol dire accelerazione dimezzata. Per accelerare uguale una massa doppia serve una forza doppia.'),
    check: () => ({
      q: tr('Una forza di 6 N spinge un carrello di 3 kg, senza attriti. Quanto vale la sua accelerazione?'),
      options: [tr('2 m/s²'), tr('18 m/s²'), tr('0,5 m/s²')],
      ok: tr('Giusto: a = F / m = 6 / 3 = 2 m/s². Ogni secondo va 2 m/s più veloce.'),
    }),
  },

  reazione: {
    area: 'fisica', offer: true,
    title: () => tr('Azione e reazione'),
    sub: () => tr('La terza legge di Newton'),
    test: (s) => /azione e reazione|terza legge|action and reaction|third law/i.test(s),
    body: () => tr('Se un corpo spinge un altro, l’altro spinge il primo con una forza <b>uguale e opposta</b>: <b>F₁₂ = −F₂₁</b>. Le due forze agiscono su corpi diversi, e ognuno risponde secondo la sua massa: il più leggero prende più velocità. Cambia le masse dei due carrelli che si spingono via.'),
    widget() {
      let m1 = 1, m2 = 3;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        // la molla dà a tutti e due la stessa spinta: velocità 6 / m
        const v1 = 6 / m1, v2 = 6 / m2, c = 95, y = 44, k = 10;
        const cart = (x0, w) => `<rect x="${x0}" y="${y - 14}" width="${w}" height="10" rx="2" class="edge"/><circle cx="${x0 + 6}" cy="${y - 2}" r="3" class="edge"/><circle cx="${x0 + w - 6}" cy="${y - 2}" r="3" class="edge"/>`;
        let g = `<line x1="6" y1="${y + 2}" x2="184" y2="${y + 2}" class="ground"/>` + cart(c - 34, 30) + cart(c + 4, 30);
        for (let i = 0; i < Math.min(m1, 6); i++) g += `<rect x="${c - 32 + (i % 3) * 9}" y="${y - 22 - Math.floor(i / 3) * 8}" width="7" height="7" class="blk"/>`;
        for (let i = 0; i < Math.min(m2, 6); i++) g += `<rect x="${c + 6 + (i % 3) * 9}" y="${y - 22 - Math.floor(i / 3) * 8}" width="7" height="7" class="blk"/>`;
        // le due forze: uguali e opposte, sempre
        g += `<line x1="${c - 2}" y1="10" x2="${c - 30}" y2="10" class="frc"/><path d="M${c - 25} 6l-5 4l5 4" class="frc"/><line x1="${c + 2}" y1="10" x2="${c + 30}" y2="10" class="frc"/><path d="M${c + 25} 6l5 4l-5 4" class="frc"/>`;
        // le velocità: diverse
        const xl = c - 4 - v1 * k, xr = c + 4 + v2 * k;
        g += `<line x1="${c - 4}" y1="${y + 14}" x2="${xl}" y2="${y + 14}" class="arrow"/><path d="M${xl + 5} ${y + 10}l-5 4l5 4" class="arrow" fill="none"/>`;
        g += `<line x1="${c + 4}" y1="${y + 14}" x2="${xr}" y2="${y + 14}" class="arrow"/><path d="M${xr - 5} ${y + 10}l5 4l-5 4" class="arrow" fill="none"/>`;
        show.innerHTML = svg(190, 70, g)
          + `<p class="small">${tr('Le due forze sono uguali (le frecce rosse). Le velocità no: {v1} m/s il carrello da {m1} kg, {v2} m/s quello da {m2} kg.', { v1: n(v1, 1), v2: n(v2, 1), m1, m2 })}</p>`;
      };
      const a = slider(tr('massa a sinistra (kg)'), 1, 6, 1, m1, (x) => { m1 = x; draw(); });
      const b = slider(tr('massa a destra (kg)'), 1, 6, 1, m2, (x) => { m2 = x; draw(); });
      a.set(); b.set();
      return h('div', {}, show, a.el, b.el);
    },
    tip: () => tr('Camminare, nuotare, remare, volare in razzo: si spinge qualcosa all’indietro, e quella cosa spinge noi in avanti.'),
    check: () => ({
      q: tr('Stai sui pattini e spingi un muro. Che cosa succede?'),
      options: [tr('vai indietro: il muro spinge te'), tr('niente: il muro è fermo'), tr('il muro si sposta un po’')],
      ok: tr('Giusto: il muro ti spinge con una forza uguale e opposta alla tua. Lui non si muove, tu sì.'),
    }),
  },
};
export const TOOL_IDS = Object.keys(TOOLS);

// ---------- quali strumenti servono in un livello ----------
// Conta quello che si legge PRIMA di rispondere: introduzione, consegne, domande e risposte da scegliere; e, nei passi di
// calcolo, anche lo svolgimento, cioè la formula che serve per fare il conto. Le spiegazioni che arrivano dopo una risposta,
// gli aiuti, le soluzioni e i riquadri facoltativi «Per chi vuole la formula» non aprono schede: lì l'attrezzo si offre
// con un bottone (toolsToOffer).
export function toolsIn(level, lens) {
  const out = [tx(level.intro, lens)];
  for (const st of level.steps || []) {
    if (st.only && !st.only.includes(lens)) continue;
    out.push(tx(st.text, lens));
    for (const o of st.options || []) out.push(tx(o, lens));
    for (const v of st.vars || []) out.push(tx(v.t, lens));
    for (const it of st.items || []) out.push(tx(it.t, lens));
    for (const c of st.need || []) out.push(tx(c.msg, lens));
    // i passi con i numeri inventati: si guarda un esempio della domanda e del suo svolgimento
    if (typeof st.gen === 'function') { try { const g = st.gen(lens, 0); out.push(g.text, g.explain); } catch { /* niente */ } }
  }
  const txt = noBox(out.filter(Boolean).join('\n'));
  // gli attrezzi di fisica non servono per rispondere: si offrono, non si aprono da soli
  return TOOL_IDS.filter((id) => !TOOLS[id].offer && TOOLS[id].test(txt));
}
export const toolsOn = (lens) => lens === 's' || lens === 'c';
export const toolState = (id) => (S.tools || {})[id] || 0; // 0 mai visto, 1 visto, 2 domanda giusta
const mark = (id, v) => { S.tools = S.tools || {}; if ((S.tools[id] || 0) < v) { S.tools[id] = v; save(); } };
// un attrezzo porta con sé quelli che servono per capirlo, se non sono ancora stati visti (prima il quadrato, poi la radice)
const withNeeds = (ids) => {
  const all = new Set();
  const add = (id) => { for (const d of TOOLS[id].needs || []) if (!toolState(d)) add(d); all.add(id); };
  ids.forEach(add);
  return TOOL_IDS.filter((id) => all.has(id));
};
// gli strumenti nuovi per questo livello (vuoto per l'Esploratore)
export const newTools = (level, lens) => (toolsOn(lens) ? withNeeds(toolsIn(level, lens).filter((id) => !toolState(id))) : []);
// la coda per aprire un attrezzo su richiesta: prima quelli che servono per capirlo, se mancano
export const toolQueue = (id) => withNeeds([id]);
// gli strumenti mai visti che compaiono in un testo: quelli da offrire con un bottone sotto una spiegazione o un aiuto
export const toolsToOffer = (text, lens) => (toolsOn(lens) ? TOOL_IDS.filter((id) => !toolState(id) && TOOLS[id].test(String(text ?? ''))) : []);

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
  const item = (id) => {
    const st = toolState(id);
    return h('button', { class: 'lvl-item tool-item' + (st ? ' seen' : ''), 'data-tool': id, onclick: () => { holder.replaceChildren(toolCard([id], () => render())); holder.scrollIntoView({ behavior: 'smooth' }); } },
      h('b', {}, TOOLS[id].title()), h('span', { class: 'small muted' }, st === 2 ? '✓ ' + TOOLS[id].sub() : st ? TOOLS[id].sub() : tr('Non l’hai ancora incontrato · ') + TOOLS[id].sub()));
  };
  // due scaffali: la matematica delle formule e le idee della fisica
  const shelf = (title, ids) => (ids.length ? [h('h3', { class: 'tool-shelf' }, title), h('div', { class: 'tool-list' }, ids.map(item))] : []);
  const wrap = h('div', {},
    ...shelf(tr('Matematica'), TOOL_IDS.filter((id) => TOOLS[id].area !== 'fisica')),
    ...shelf(tr('Fisica'), TOOL_IDS.filter((id) => TOOLS[id].area === 'fisica')),
    holder);
  const render = () => wrap.replaceWith(toolboxPage());
  return wrap;
}
export const toolCount = () => TOOL_IDS.filter((id) => toolState(id)).length;
