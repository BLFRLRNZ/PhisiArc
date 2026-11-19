// Gli attrezzi di fisica dei mondi dopo l'Officina: uno scaffale per mondo (world), con le leggi che le zone usano.
// Come quelli dell'Officina (tools.js) non interrompono mai: si offrono con un bottone sotto i testi che ne parlano,
// solo nelle lenti con le formule. Ogni scheda ha la spiegazione, un disegno da muovere e una domanda; il piccolo film
// arriverà con l'ampliamento della cassetta (toolfilm.js: chi non ha ancora un film mostra la scheda senza).
import { h } from './util.js';
import { t as tr, LOCALE } from './i18n.js';
import { n, svg, slider } from './toolui.js';

const G = 9.81;
// una freccia verso il basso o verso l'alto: l'asta e la punta
const arrowV = (x, y0, y1, cls = 'frc') => `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" class="${cls}"/><path d="M${x - 5} ${y1 + (y1 > y0 ? -6 : 6)}L${x} ${y1}L${x + 5} ${y1 + (y1 > y0 ? -6 : 6)}" class="${cls}" fill="none"/>`;
const arrowH = (x0, x1, y, cls = 'arrow') => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" class="${cls}"/><path d="M${x1 + (x1 > x0 ? -6 : 6)} ${y - 5}L${x1} ${y}L${x1 + (x1 > x0 ? -6 : 6)} ${y + 5}" class="${cls}" fill="none"/>`;

export const MONDI = {
  // ---------- il Cielo ----------
  gravita: {
    area: 'fisica', offer: true, world: 'cielo',
    title: () => tr('La gravitazione universale'),
    sub: () => tr('Ogni massa attira ogni altra massa'),
    test: (s) => /gravitazione universale|universal gravitation|G ?· ?[mM]/i.test(s),
    body: () => tr('Due corpi qualsiasi si attirano: la Terra e la Luna, il Sole e i pianeti, perfino due mele, ma pochissimo. La forza cresce con le <b>masse</b> e cala con il <b>quadrato della distanza</b>: <b>F = G·m₁·m₂ / r²</b>. Distanza doppia, forza quattro volte più piccola. Muovi la distanza e la seconda massa.'),
    widget() {
      let r = 2, m = 2;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        const F = m / (r * r), y = 34, x1 = 22, x2 = x1 + r * 38, R2 = 5 + 2.5 * m;
        let g = `<circle cx="${x1}" cy="${y}" r="13" class="sqc"/><circle cx="${x2}" cy="${y}" r="${R2}" class="sqa"/>`;
        g += `<line x1="${x1}" y1="${y + 22}" x2="${x2}" y2="${y + 22}" class="mk"/><text x="${(x1 + x2) / 2}" y="${y + 36}" class="lb" text-anchor="middle">r = ${n(r)}</text>`;
        g += `<text x="8" y="${y + 60}" class="lb">${tr('forza')}</text><rect x="8" y="${y + 66}" width="${Math.max(2, F * 40)}" height="12" rx="2" class="sqb"/>`;
        show.innerHTML = svg(200, 120, g)
          + `<div class="tool-f">F ∝ <span class="c2">m₂</span> / <span class="c1">r</span>² = ${n(m)} / ${n(r * r)} = <span class="c3">${n(F)}</span></div>`
          + `<p class="small muted">${tr('La forza, in confronto a quella con massa 1 e distanza 1: {F} volte.', { F: n(F) })}</p>`;
      };
      const a = slider(tr('distanza r'), 1, 4, 0.5, r, (x) => { r = x; draw(); });
      const b = slider(tr('seconda massa m₂'), 1, 4, 1, m, (x) => { m = x; draw(); });
      a.set(); b.set();
      return h('div', {}, show, a.el, b.el);
    },
    tip: () => tr('La stessa legge fa cadere la mela e tiene la Luna in orbita: Newton lo capì guardando tutte e due.'),
    check: () => ({
      q: tr('La distanza fra due pianeti raddoppia. La forza di gravità fra loro…'),
      options: [tr('diventa un quarto'), tr('si dimezza'), tr('resta uguale')],
      ok: tr('Giusto: r² diventa 4 volte più grande, e la forza 4 volte più piccola.'),
    }),
  },

  keplero: {
    area: 'fisica', offer: true, world: 'cielo',
    title: () => tr('Le leggi di Keplero'),
    sub: () => tr('Come girano i pianeti intorno al Sole'),
    test: (s) => /legg[ei] di Keplero|Kepler[’']s (laws?|third law)|third law of Kepler|T² ?\/ ?a³|T² ?∝ ?a³|T² è proporzionale/i.test(s),
    body: () => tr('Keplero trovò tre regole. I pianeti girano su <b>ellissi</b>, con il Sole in un fuoco. Vicino al Sole vanno <b>più veloci</b>, lontano più piano. E più un pianeta è lontano, più è lungo il suo anno: <b>T² ∝ a³</b>, il quadrato dell’anno va come il cubo della distanza. Scegli un pianeta.'),
    widget() {
      const PL = [[tr('Mercurio'), 0.39], [tr('Venere'), 0.72], [tr('Terra'), 1], [tr('Marte'), 1.52], [tr('Giove'), 5.2], [tr('Saturno'), 9.54], [tr('Urano'), 19.2], [tr('Nettuno'), 30.1]];
      const show = h('div', { class: 'tool-show' });
      const draw = (i) => {
        // le orbite non sono in scala: il raggio cresce con la radice della distanza, così ci stanno tutte
        const [, a] = PL[i], T = a ** 1.5, k = 76 / Math.sqrt(30.1), R = 8 + k * Math.sqrt(a), RE = 8 + k, c = 96, th = -0.7;
        let g = `<circle cx="${c}" cy="${c}" r="${RE}" class="shy" fill="none"/><circle cx="${c}" cy="${c}" r="${R}" class="circ"/><circle cx="${c}" cy="${c}" r="6" class="blk"/>`;
        g += `<circle cx="${c + R * Math.cos(th)}" cy="${c + R * Math.sin(th)}" r="4.5" class="tipdot"/>`;
        show.innerHTML = svg(192, 192, g)
          + `<div class="tool-f"><span class="c1">a</span> = ${n(a)} ${tr('UA')} → <span class="c2">T</span> = √(${n(a)}³) = <span class="c2">${n(T, T < 10 ? 2 : 0)}</span> ${tr('anni')}</div>`
          + `<p class="small muted">${tr('Il cerchio tratteggiato è l’orbita della Terra: 1 UA, 1 anno. Le orbite non sono in scala.')}</p>`;
      };
      const a = slider(tr('pianeta'), 0, PL.length - 1, 1, 4, draw, (i) => PL[i][0]);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('La stessa regola vale per tutto ciò che gira intorno alla stessa cosa: un satellite basso fa il giro della Terra in un’ora e mezza, la Luna in un mese.'),
    check: () => ({
      q: tr('Un pianeta è 4 volte più lontano dal Sole della Terra. Il suo anno dura…'),
      options: [tr('8 anni'), tr('4 anni'), tr('16 anni')],
      ok: tr('Giusto: a³ = 4³ = 64, e T = √64 = 8 anni.'),
    }),
  },

  // ---------- l'Oceano ----------
  pressione: {
    area: 'fisica', offer: true, world: 'oceano',
    title: () => tr('La pressione: P = F / A'),
    sub: () => tr('Una forza spalmata su una superficie'),
    test: (s) => /P ?= ?F ?\/ ?A|(?<!\p{L})pression[ei](?!\p{L})(?! della luce)|(?<!\p{L})pressure(?!\p{L})(?! of light)/iu.test(s),
    body: () => tr('La <b>pressione</b> dice quanta forza preme su ogni pezzetto di superficie: <b>P = F / A</b>. Stessa forza su una superficie piccola, pressione grande: per questo i tacchi a spillo affondano nella sabbia e le racchette da neve no. Si misura in <b>pascal</b>: 1 Pa è 1 newton su 1 m². Muovi la forza e la superficie.'),
    widget() {
      let F = 600, A = 100;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        const P = (F / A) * 10000, kPa = P / 1000, y = 84, w = 10 + Math.sqrt(A) * 7, d = Math.min(30, 3 + 6 * Math.log10(Math.max(1, kPa))), x = 100 - w / 2;
        let g = `<rect x="4" y="${y}" width="192" height="26" class="sand"/><line x1="4" y1="${y}" x2="196" y2="${y}" class="ground"/>`;
        g += `<rect x="${x}" y="${y - 34 + d}" width="${w}" height="34" rx="2" class="blk"/>` + arrowV(100, 6, y - 40 + d);
        show.innerHTML = svg(200, 114, g)
          + `<div class="tool-f"><span class="c4">P</span> = <span class="c2">F</span> / <span class="c1">A</span> = ${n(F)} N / ${n(A)} cm² = <span class="c4">${kPa >= 10 ? n(kPa, 0) : n(kPa, 1)}</span> kPa</div>`
          + `<p class="small muted">${tr('Più la pressione è alta, più il blocco affonda nella sabbia.')}</p>`;
      };
      const a = slider(tr('forza F (N)'), 100, 1000, 100, F, (x) => { F = x; draw(); });
      const b = slider(tr('superficie A (cm²)'), 1, 400, 1, A, (x) => { A = x; draw(); });
      a.set(); b.set();
      return h('div', {}, show, a.el, b.el);
    },
    tip: () => tr('Le racchette da neve allargano il piede: la forza resta la stessa, la superficie cresce, la pressione cala e non sprofondi.'),
    check: () => ({
      q: tr('Stesso peso, superficie 10 volte più piccola. La pressione…'),
      options: [tr('diventa 10 volte più grande'), tr('diventa 10 volte più piccola'), tr('resta uguale')],
      ok: tr('Giusto: P = F / A, e dividere per un numero 10 volte più piccolo dà un risultato 10 volte più grande.'),
    }),
  },

  densita: {
    area: 'fisica', offer: true, world: 'oceano',
    title: () => tr('La densità: ρ = m / V'),
    sub: () => tr('Quanta massa in ogni litro'),
    test: (s) => /(?<!\p{L})densit[àay]|ρ ?= ?m ?\/ ?V/iu.test(s),
    body: () => tr('La <b>densità</b> dice quanta massa c’è in ogni pezzetto di volume: <b>ρ = m / V</b>. Un litro d’acqua ha 1 kg di massa, un litro di ferro quasi 8, un litro di sughero un quarto di kg. Chi ha densità minore dell’acqua galleggia, chi l’ha maggiore affonda. Scegli il materiale.'),
    widget() {
      const MAT = [[tr('sughero'), 240], [tr('legno'), 600], [tr('ghiaccio'), 920], [tr('acqua'), 1000], [tr('sasso'), 2600], [tr('ferro'), 7900], [tr('oro'), 19300]];
      const show = h('div', { class: 'tool-show' });
      const draw = (i) => {
        const [name, rho] = MAT[i], f = rho / 1000, yw = 44, yb = 118, s = 32;
        // il cubo da un litro nella vasca: galleggia con la parte f sott'acqua, resta sospeso, o va sul fondo
        const top = f < 1 ? yw - s * (1 - f) : f === 1 ? (yw + yb) / 2 - s / 2 : yb - s;
        const g = `<rect x="40" y="${yw}" width="120" height="${yb - yw}" class="wat"/><line x1="40" y1="${yw}" x2="160" y2="${yw}" class="circ"/>`
          + `<path d="M40 24V${yb}H160V24" class="edge"/><rect x="${100 - s / 2}" y="${top}" width="${s}" height="${s}" rx="2" class="blk"/>`;
        const st = f < 1 ? tr('galleggia: è meno densa dell’acqua') : f === 1 ? tr('resta sospesa: ha la stessa densità dell’acqua') : tr('affonda: è più densa dell’acqua');
        show.innerHTML = svg(200, 124, g)
          + `<div class="tool-f">${tr('1 litro di {x}', { x: name })}: <span class="c4">${n(rho / 1000, 2)} kg</span> → ρ = <span class="c4">${n(rho, 0)}</span> kg/m³</div>`
          + `<p class="small muted">${st}</p>`;
      };
      const a = slider(tr('materiale'), 0, MAT.length - 1, 1, 1, draw, (i) => MAT[i][0]);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Una nave d’acciaio galleggia perché, con tutta l’aria che c’è dentro, la sua densità media è minore di quella dell’acqua.'),
    check: () => ({
      q: tr('Un litro d’olio ha una massa di 0,9 kg. Messo nell’acqua, l’olio…'),
      options: [tr('galleggia'), tr('affonda'), tr('resta a metà, sospeso')],
      ok: tr('Giusto: 0,9 kg al litro è meno di 1 kg al litro, la densità dell’acqua. Per questo l’olio sta a galla.'),
    }),
  },

  archimede: {
    area: 'fisica', offer: true, world: 'oceano',
    title: () => tr('La spinta di Archimede'),
    sub: () => tr('L’acqua spinge su chi ci entra'),
    test: (s) => /(principio|spinta) di Archimede|Archimedes[’'] principle|buoyan|ρ ?· ?V ?· ?g/i.test(s),
    body: () => tr('Un corpo nell’acqua riceve una <b>spinta verso l’alto</b> uguale al <b>peso dell’acqua che sposta</b>: <b>F = ρ·V·g</b>. Se la spinta vince il peso, il corpo sale e galleggia; se perde, affonda, ma pesa di meno. Cala nell’acqua un sasso da 1 litro.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (pc) => {
        const W = 2.6 * G, Fa = (G * pc) / 100, R = W - Fa, s = 30, yw0 = 74;
        const yw = yw0 - 5 * (pc / 100), top = yw - s * (1 - pc / 100), x = 100 - s / 2;
        // il dinamometro: la molla si accorcia quando la spinta regge una parte del peso
        let g = `<line x1="70" y1="6" x2="130" y2="6" class="ground"/><rect x="88" y="8" width="24" height="16" rx="3" class="edge"/>`;
        g += `<path d="M100 24${Array.from({ length: 6 }, (_, k) => `L${k % 2 ? 94 : 106} ${24 + ((top - 30) * (k + 1)) / 7}`).join('')}L100 ${top - 6}V${top}" class="edge"/>`;
        g += `<rect x="40" y="${yw}" width="120" height="${120 - yw}" class="wat"/><line x1="40" y1="${yw}" x2="160" y2="${yw}" class="circ"/><path d="M40 46V120H160V46" class="edge"/>`;
        g += `<rect x="${x}" y="${top}" width="${s}" height="${s}" rx="3" class="blk"/>`;
        if (pc > 0) g += arrowV(100 + s / 2 + 12, top + s, top + s - Math.max(8, Fa * 2.6), 'frc');
        show.innerHTML = svg(200, 124, g)
          + `<div class="tool-f">${n(W, 1)} N − <span class="c3">${n(Fa, 1)} N</span> = <span class="c1">${n(R, 1)} N</span></div>`
          + `<p class="small muted">${tr('Il peso del sasso, meno la spinta dell’acqua: è quello che segna il dinamometro.')}</p>`;
      };
      const a = slider(tr('quanto è sott’acqua (%)'), 0, 100, 10, 50, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('In piscina sollevi un amico con un dito: l’acqua regge quasi tutto il suo peso. Fuori dall’acqua, pesa di nuovo tutto.'),
    check: () => ({
      q: tr('Un sasso da 1 litro è tutto sott’acqua. Quanto vale la spinta?'),
      options: [tr('circa 10 N, il peso di 1 litro d’acqua'), tr('quanto il peso del sasso'), tr('zero, perché il sasso affonda')],
      ok: tr('Giusto: il sasso sposta 1 litro d’acqua, cioè 1 kg, che pesa circa 9,8 N. Affonda lo stesso, perché pesa di più.'),
    }),
  },

  bernoulli: {
    area: 'fisica', offer: true, world: 'oceano',
    title: () => tr('Dove il fluido corre, spinge meno'),
    sub: () => tr('Il principio di Bernoulli'),
    test: (s) => /Bernoulli|Venturi/i.test(s),
    body: () => tr('In un fluido che scorre, dove la <b>velocità</b> cresce la <b>pressione</b> cala, e dove rallenta cresce: <b>P + ½·ρ·v² = costante</b>. Per questo due fogli si avvicinano se ci soffi in mezzo, e l’ala di un aereo regge. Stringi il tubo e guarda i tubicini: l’acqua ci sale tanto più quanto la pressione è alta.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (r) => {
        const v2 = r, h2 = 50 - ((r * r - 1) / (2 * G)) * 100, yc = 96, hw = 30, hn = hw / r, k = 1.2;
        const half = (x) => (x < 80 || x > 140 ? hw / 2 : x > 95 && x < 125 ? hn / 2 : hw / 2 + (hn / 2 - hw / 2) * (x < 110 ? (x - 80) / 15 : (140 - x) / 15));
        const xs = Array.from({ length: 37 }, (_, i) => 10 + i * 5);
        const top = xs.map((x) => `${x},${yc - half(x)}`).join(' '), bot = xs.map((x) => `${x},${yc + half(x)}`).reverse().join(' ');
        let g = `<polygon points="${top} ${bot}" class="wat"/><polyline points="${top}" class="edge"/><polyline points="${xs.map((x) => `${x},${yc + half(x)}`).join(' ')}" class="edge"/>`;
        for (const [x, hh] of [[45, 50], [110, h2]]) {
          const yb = yc - half(x), yt = yc - Math.max(0, hh) * k;
          g += `<rect x="${x - 3}" y="${Math.min(yb, yt)}" width="6" height="${Math.max(0, yb - yt)}" class="cell"/><path d="M${x - 4} ${yb}V12M${x + 4} ${yb}V12" class="edge"/>`;
        }
        g += arrowH(30, 30 + 14, yc + 30) + arrowH(103, 103 + 14 * v2, yc + 30);
        const dp = 500 * (v2 * v2 - 1);
        show.innerHTML = svg(200, 140, g)
          + `<div class="tool-f">v = <span class="c2">${n(v2, 1)} m/s</span> · ΔP = <span class="c1">−${n(dp, 0)} Pa</span></div>`
          + `<p class="small muted">${h2 > 0 ? tr('Nel tratto stretto l’acqua corre {r} volte più veloce, e il tubicino scende.', { r: n(r, 1) }) : tr('Qui la pressione scende sotto quella dell’aria: il tubicino si svuota e risucchia aria.')}</p>`;
      };
      const a = slider(tr('quante volte si stringe'), 1, 3.5, 0.5, 2, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Lo spruzzino del profumo, i tetti che si staccano col vento forte, le navi che si attirano se passano vicine: dove si corre, si spinge meno.'),
    check: () => ({
      q: tr('Un fiume entra in una gola stretta e corre più veloce. Lì la pressione dell’acqua…'),
      options: [tr('è più bassa'), tr('è più alta'), tr('è uguale')],
      ok: tr('Giusto: l’acqua accelera perché davanti la pressione è più bassa. Più velocità, meno pressione.'),
    }),
  },

  // ---------- il Vulcano ----------
  temperatura: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Temperatura e kelvin'),
    sub: () => tr('Quanto si agitano le particelle'),
    test: (s) => /zero assoluto|absolute zero|kelvin|\d ?K\b|T ?= ?t ?\+ ?273/i.test(s),
    body: () => tr('La <b>temperatura</b> dice quanto si agitano le particelle: più è alta, più corrono. A <b>−273 °C</b> sono ferme: è lo <b>zero assoluto</b>, e da lì parte la scala <b>Kelvin</b>, <b>T = t + 273</b>. Un grado Celsius e un kelvin sono lo stesso salto: cambia solo lo zero. Muovi la temperatura.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (t) => {
        const K = t + 273, sp = Math.sqrt(Math.max(0, K) / 300), Y = (c) => 108 - ((c + 273) / 573) * 96;
        // a sinistra le particelle, con una scia lunga quanto corrono; a destra il termometro con le due scale
        let g = '';
        [[30, 30], [72, 22], [50, 60], [96, 52], [24, 88], [66, 96], [104, 90]].forEach(([x, y], i) => {
          const a = i * 2.4, L = 16 * sp;
          g += `<line x1="${x}" y1="${y}" x2="${(x - Math.cos(a) * L).toFixed(1)}" y2="${(y - Math.sin(a) * L).toFixed(1)}" class="mk"/><circle cx="${x}" cy="${y}" r="5" class="${t < 0 ? 'sqc' : t < 150 ? 'cell' : 'sqa'}"/>`;
        });
        g += `<rect x="146" y="10" width="10" height="100" rx="5" class="edge"/><line x1="151" y1="108" x2="151" y2="${Y(t).toFixed(1)}" class="frc"/>`;
        for (const c of [-273, 0, 100, 300]) g += `<text x="140" y="${Y(c) + 4}" class="lb" text-anchor="end">${c}</text><text x="162" y="${Y(c) + 4}" class="lb">${c + 273}</text>`;
        show.innerHTML = svg(200, 118, g) + `<div class="tool-f">t = <span class="c2">${n(t, 0)} °C</span> → T = <span class="c1">${n(K, 0)} K</span></div>`
          + `<p class="small muted">${K <= 0 ? tr('Zero assoluto: le particelle sono ferme.') : tr('Le scie sono lunghe quanto corrono le particelle.')}</p>`;
      };
      const a = slider(tr('temperatura (°C)'), -273, 300, 1, 20, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('In fisica si usano i kelvin perché il loro zero è vero: a 0 K non c’è più agitazione. Per questo 200 K è davvero il doppio di 100 K, mentre 20 °C non è il doppio di 10 °C.'),
    check: () => ({
      q: tr('Quanti kelvin sono 27 °C?'),
      options: ['300 K', '27 K', '246 K'],
      ok: tr('Giusto: 27 + 273 = 300 K.'),
    }),
  },

  calore: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Il calore: Q = m·c·ΔT'),
    sub: () => tr('Energia che passa dal caldo al freddo'),
    test: (s) => /calore specifico|specific heat|Q ?= ?m ?· ?c/i.test(s),
    body: () => tr('Il <b>calore</b> è energia che passa da un corpo caldo a uno freddo. Per scaldare un corpo ne serve <b>Q = m·c·ΔT</b>: più massa e più gradi, più calore. Il <b>calore specifico</b> c dice quanto una sostanza è lenta a scaldarsi: per 1 kg d’acqua e 1 °C servono 4186 J, per il ferro 450. Scegli la sostanza e i gradi.'),
    widget() {
      const ST = [[tr('acqua'), 4186], [tr('olio'), 2000], [tr('sabbia'), 830], [tr('ferro'), 450]];
      let i = 0, dT = 20;
      const show = h('div', { class: 'tool-show' });
      const draw = () => {
        const [name, c] = ST[i], Q = c * dT, w = Math.max(2, (Q / (4186 * 50)) * 170);
        const g = `<text x="8" y="16" class="lb">Q</text><rect x="8" y="22" width="${w.toFixed(1)}" height="16" rx="3" class="sqa"/>`
          + `<text x="8" y="58" class="lb">${tr('1 kg di {x}, {d} °C in più', { x: name, d: dT })}</text>`;
        show.innerHTML = svg(190, 66, g) + `<div class="tool-f">Q = 1 kg × <span class="c4">${n(c, 0)}</span> × <span class="c1">${dT}</span> = <span class="c2">${n(Q / 1000, 1)} kJ</span></div>`;
      };
      const a = slider(tr('sostanza'), 0, ST.length - 1, 1, 0, (x) => { i = x; draw(); }, (x) => ST[x][0]);
      const b = slider(tr('gradi in più ΔT'), 1, 50, 1, dT, (x) => { dT = x; draw(); });
      a.set(); b.set();
      return h('div', {}, show, a.el, b.el);
    },
    tip: () => tr('D’estate il mare resta fresco e la sabbia scotta: stesso sole, ma l’acqua ha il calore specifico più alto di quasi tutte le sostanze.'),
    check: () => ({
      q: tr('Stesso fuoco, stessa massa: chi si scalda di più, l’acqua o il ferro?'),
      options: [tr('il ferro: ha il calore specifico più piccolo'), tr('l’acqua'), tr('tutti e due uguale')],
      ok: tr('Giusto: ΔT = Q / (m·c), e il calore specifico del ferro è quasi 10 volte più piccolo di quello dell’acqua.'),
    }),
  },

  propagazione: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('I tre viaggi del calore'),
    sub: () => tr('Conduzione, convezione, irraggiamento'),
    test: (s) => /conduzion|convezion|irraggia|conduction|convection|thermal radiation/i.test(s),
    body: () => tr('Il calore viaggia in tre modi. Per <b>conduzione</b>, di particella in particella, nei solidi: i metalli conducono, legno e lana isolano. Per <b>convezione</b>, nei liquidi e nei gas: il caldo sale, il freddo scende, e la materia gira. Per <b>irraggiamento</b>, con la luce e gli infrarossi, anche nel vuoto. Scegli il viaggio.'),
    widget() {
      const M = [[tr('conduzione'), tr('Un cucchiaino nel tè: il calore risale il metallo fino alle dita.')], [tr('convezione'), tr('Una pentola sul fuoco: l’acqua calda sale dal fondo, quella fredda scende ai lati.')], [tr('irraggiamento'), tr('Il Sole: il calore arriva con la luce, attraverso il vuoto.')]];
      const show = h('div', { class: 'tool-show' });
      const draw = (i) => {
        let g;
        if (i === 0) g = `<path d="M14 30h40v40H14z" class="edge"/><rect x="14" y="44" width="40" height="26" class="wat"/><rect x="34" y="46" width="140" height="10" rx="3" class="cell"/><rect x="34" y="46" width="70" height="10" rx="3" class="sqa"/>` + arrowH(108, 168, 34, 'frc');
        else if (i === 1) g = `<path d="M50 20V86H140V20" class="edge"/><rect x="51" y="30" width="88" height="55" class="wat"/><ellipse cx="74" cy="57" rx="14" ry="20" class="circ"/><ellipse cx="116" cy="57" rx="14" ry="20" class="circ"/>` + arrowV(95, 80, 38, 'frc') + `<path d="M80 96q5-6 10 0t10 0" class="frc"/>`;
        else g = `<circle cx="30" cy="48" r="16" class="blk"/>` + [0, 1, 2].map((k) => arrowH(52, 146, 34 + k * 14, 'mk')).join('') + `<circle cx="164" cy="48" r="10" class="sqc"/>`;
        show.innerHTML = svg(190, 100, g) + `<p class="small">${M[i][1]}</p>`;
      };
      const a = slider(tr('viaggio'), 0, 2, 1, 0, draw, (i) => M[i][0]);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Un thermos li ferma tutti e tre: il vuoto fra le pareti blocca conduzione e convezione, l’argento rimanda indietro l’irraggiamento.'),
    check: () => ({
      q: tr('Come arriva sulla Terra il calore del Sole?'),
      options: [tr('per irraggiamento'), tr('per conduzione'), tr('per convezione')],
      ok: tr('Giusto: fra il Sole e la Terra c’è il vuoto, e solo l’irraggiamento lo attraversa.'),
    }),
  },

  latente: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Il calore latente: Q = m·L'),
    sub: () => tr('Il calore che cambia lo stato'),
    test: (s) => /calore latente|latent heat|Q ?= ?m ?· ?L/i.test(s),
    body: () => tr('Per cambiare stato serve calore, anche se la temperatura resta ferma: è il <b>calore latente</b>, <b>Q = m·L</b>. Per fondere 1 kg di ghiaccio servono <b>334 kJ</b>; per farne evaporare 1 kg d’acqua <b>2260 kJ</b>, più di cinque volte quello che serve a scaldarla da 0 a 100 °C. Dai calore a 1 kg di ghiaccio.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const STEP = [[0, -20], [42, 0], [376, 0], [795, 100], [3055, 100]];
      const draw = (Q) => {
        // il grafico temperatura–calore di 1 kg di ghiaccio partito da −20 °C, con i due gradini
        const X = (q) => 14 + (q / 3100) * 172, Y = (t) => 92 - ((t + 30) / 140) * 84;
        let T = 100, state = tr('bolle: resta a 100 °C');
        if (Q < 42) { T = -20 + (Q / 42) * 20; state = tr('ghiaccio'); }
        else if (Q < 376) { T = 0; state = tr('si scioglie: resta a 0 °C'); }
        else if (Q < 795) { T = ((Q - 376) / 419) * 100; state = tr('acqua'); }
        let g = `<line x1="14" y1="${Y(0)}" x2="186" y2="${Y(0)}" class="ground"/><line x1="14" y1="${Y(100)}" x2="186" y2="${Y(100)}" class="ground"/>`;
        g += `<polyline points="${STEP.map(([q, t]) => `${X(q).toFixed(1)},${Y(t).toFixed(1)}`).join(' ')}" class="edge"/>`;
        g += `<circle cx="${X(Q).toFixed(1)}" cy="${Y(T).toFixed(1)}" r="5" class="tipdot"/><text x="8" y="${Y(0) + 4}" class="lb" text-anchor="end">0</text>`;
        show.innerHTML = svg(196, 100, g) + `<div class="tool-f">Q = <span class="c2">${n(Q, 0)} kJ</span> → <span class="c1">${n(Math.round(T), 0)} °C</span></div><p class="small muted">${state}</p>`;
      };
      const a = slider(tr('calore dato (kJ)'), 0, 3000, 20, 200, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo il ghiaccio rinfresca tanto, il vapore scotta più dell’acqua bollente e il sudore, evaporando, ci tiene freschi.'),
    check: () => ({
      q: tr('Il ghiaccio si sta sciogliendo sul fuoco. Che cosa fa la temperatura?'),
      options: [tr('resta a 0 °C finché c’è ghiaccio'), tr('sale piano piano'), tr('scende sotto zero')],
      ok: tr('Giusto: il calore va tutto a sciogliere il ghiaccio, e il termometro aspetta.'),
    }),
  },

  stati: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Solido, liquido, gas'),
    sub: () => tr('I passaggi di stato'),
    test: (s) => /passaggi? di stato|stati della materia|states of matter|changes? of state|condensa|sublima|condensation|sublimat/i.test(s),
    body: () => tr('La materia ha tre <b>stati</b>. Nel <b>solido</b> le particelle vibrano al loro posto; nel <b>liquido</b> restano vicine ma scivolano; nel <b>gas</b> volano libere. Scaldando si passa da solido a liquido (<b>fusione</b>) e da liquido a gas (<b>evaporazione</b>); raffreddando si torna indietro (<b>solidificazione</b>, <b>condensazione</b>). Scegli un passaggio.'),
    widget() {
      const PS = [[tr('fusione'), 0, 1, tr('Il ghiaccio si scioglie al sole.')], [tr('solidificazione'), 1, 0, tr('L’acqua nel freezer diventa ghiaccio.')], [tr('evaporazione'), 1, 2, tr('La pozzanghera si asciuga.')], [tr('condensazione'), 2, 1, tr('Gli occhiali si appannano entrando in casa.')], [tr('sublimazione'), 0, 2, tr('Il ghiaccio secco fuma senza sciogliersi.')], [tr('brinamento'), 2, 0, tr('Il vapore diventa brina sui vetri gelati.')]];
      const POS = [[40, 84], [160, 84], [100, 20]], NAME = [tr('solido'), tr('liquido'), tr('gas')];
      const show = h('div', { class: 'tool-show' });
      const draw = (i) => {
        const [, a, b, ex] = PS[i];
        let g = POS.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="16" class="${['sqc', 'cell', 'sqa'][k]}"/><text x="${x}" y="${y + 32}" class="lb" text-anchor="middle">${NAME[k]}</text>`).join('');
        const [x0, y0] = POS[a], [x1, y1] = POS[b], d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d, uy = (y1 - y0) / d;
        const ax = x0 + ux * 20, ay = y0 + uy * 20, bx = x1 - ux * 22, by = y1 - uy * 22;
        g += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" class="frc"/><path d="M${(bx - ux * 7 - uy * 5).toFixed(1)} ${(by - uy * 7 + ux * 5).toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}L${(bx - ux * 7 + uy * 5).toFixed(1)} ${(by - uy * 7 - ux * 5).toFixed(1)}" class="frc"/>`;
        show.innerHTML = svg(200, 124, g) + `<p class="small">${ex}</p>`;
      };
      const a = slider(tr('passaggio'), 0, PS.length - 1, 1, 0, draw, (i) => PS[i][0]);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Andando verso il gas si prende calore (il ghiaccio che fonde rinfresca); tornando indietro lo si restituisce (il vapore che si condensa scalda).'),
    check: () => ({
      q: tr('Come si chiama il passaggio da gas a liquido?'),
      options: [tr('condensazione'), tr('evaporazione'), tr('sublimazione')],
      ok: tr('Giusto: il vapore che torna goccioline, come sullo specchio del bagno.'),
    }),
  },
  boyle: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('La legge di Boyle: P·V costante'),
    sub: () => tr('Schiacciare un gas senza scaldarlo'),
    test: (s) => /Boyle/i.test(s),
    body: () => tr('Se schiacci un gas senza scaldarlo, le sue particelle hanno meno spazio e sbattono più spesso sulle pareti: la pressione sale. Metà volume, doppia pressione: <b>P·V resta costante</b> (Robert Boyle, 1662). Schiaccia 100 mL d’aria a 1 bar.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      // posti fissi delle particelle, dentro il gas: si stringono con lui
      const DOTS = Array.from({ length: 18 }, (_, i) => [(0.5 + i * 0.7548777) % 1, (0.5 + i * 0.5698403) % 1]);
      const draw = (V) => {
        const P = 100 / V, x0 = 40, x1 = 186, xp = x0 + (V / 100) * (x1 - x0), a = Math.PI * 0.75 + Math.PI * 1.5 * Math.min(1, P / 5);
        let g = `<circle cx="16" cy="50" r="12" class="tri"/><line x1="16" y1="50" x2="${(16 + Math.cos(a) * 9).toFixed(1)}" y2="${(50 + Math.sin(a) * 9).toFixed(1)}" class="frc"/><line x1="28" y1="50" x2="${x0}" y2="50" class="ground"/>`;
        g += `<rect x="${x0}" y="34" width="${(xp - x0).toFixed(1)}" height="32" class="cell"/>`;
        g += DOTS.map(([u, v]) => `<circle cx="${(x0 + 4 + u * (xp - x0 - 8)).toFixed(1)}" cy="${(38 + v * 24).toFixed(1)}" r="2.6" class="tipdot"/>`).join('');
        g += `<path d="M${x1 + 6} 34H${x0}V66H${x1 + 6}" class="edge"/><line x1="${xp.toFixed(1)}" y1="35" x2="${xp.toFixed(1)}" y2="65" class="side"/><line x1="${xp.toFixed(1)}" y1="50" x2="${Math.min(198, xp + 60).toFixed(1)}" y2="50" class="side"/>`;
        g += `<text x="${x0}" y="84" class="lb">0</text><text x="${x1}" y="84" class="lb" text-anchor="end">100 mL</text>`;
        show.innerHTML = svg(200, 92, g) + `<div class="tool-f">P·V = <span class="c2">${n(P, 2)} bar</span> × <span class="c1">${n(V, 0)} mL</span> = 100</div>`;
      };
      const a = slider(tr('volume (mL)'), 20, 100, 5, 50, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo le bolle si gonfiano salendo verso la superficie, e chi va sott’acqua con le bombole risale sempre respirando, mai trattenendo il fiato.'),
    check: () => ({
      q: tr('Schiacci l’aria di una siringa chiusa a un terzo del volume, senza scaldarla. La pressione…'),
      options: [tr('triplica'), tr('diventa un terzo'), tr('resta uguale')],
      ok: tr('Giusto: un terzo del volume, il triplo della pressione.'),
    }),
  },
  gas: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Le leggi dei gas: P·V = n·R·T'),
    sub: () => tr('Pressione, volume e temperatura in kelvin'),
    test: (s) => /Charles|Gay-Lussac|gas perfett|ideal gas/i.test(s),
    body: () => tr('Pressione, volume e temperatura di un gas sono legati, con la temperatura <b>in kelvin</b>. A pressione fissa il volume cresce come T (<b>Charles</b>); a volume fisso cresce la pressione (<b>Gay-Lussac</b>); a T fissa resta costante P·V (<b>Boyle</b>). Tutto insieme: <b>P·V = n·R·T</b>. Scalda o raffredda un palloncino da 3 L.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const X = (t) => 22 + ((t + 300) / 400) * 170, Y = (v) => 96 - (v / 4) * 84, Vof = (t) => (3 * (t + 273.15)) / 293.15;
      const draw = (t) => {
        const V = Vof(t), r = 13 * Math.cbrt(V / 3);
        let g = `<line x1="22" y1="96" x2="194" y2="96" class="ground"/><line x1="22" y1="96" x2="22" y2="8" class="ground"/>`;
        g += `<line x1="${X(-273.15).toFixed(1)}" y1="${Y(0)}" x2="${X(-100).toFixed(1)}" y2="${Y(Vof(-100)).toFixed(1)}" class="shy"/><line x1="${X(-100).toFixed(1)}" y1="${Y(Vof(-100)).toFixed(1)}" x2="${X(100).toFixed(1)}" y2="${Y(Vof(100)).toFixed(1)}" class="edge"/>`;
        g += `<circle cx="${X(t).toFixed(1)}" cy="${Y(V).toFixed(1)}" r="4.5" class="tipdot"/><circle cx="62" cy="34" r="${r.toFixed(1)}" class="sqa"/><path d="M62 ${(34 + r).toFixed(1)}l-3 5h6z" class="sqa"/>`;
        g += `<text x="${X(-273.15).toFixed(1)}" y="108" class="lb" text-anchor="middle">−273 °C</text><text x="${X(0).toFixed(1)}" y="108" class="lb" text-anchor="middle">0 °C</text><text x="26" y="16" class="lb">V</text>`;
        show.innerHTML = svg(200, 112, g) + `<div class="tool-f">t = <span class="c1">${n(t, 0)} °C</span> = ${n(t + 273, 0)} K → V = <span class="c2">${n(V, 2)} L</span></div><p class="small muted">${tr('A pressione costante, il volume è proporzionale alla temperatura in kelvin: la retta arriva a zero a −273 °C.')}</p>`;
      };
      const a = slider(tr('temperatura (°C)'), -100, 100, 10, 20, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i palloncini si sgonfiano al freddo, le gomme si gonfiano dopo un lungo viaggio e le bombole non vanno lasciate al sole.'),
    check: () => ({
      q: tr('Un gas chiuso in una bombola passa da 300 K a 600 K. La pressione…'),
      options: [tr('raddoppia'), tr('si dimezza'), tr('resta uguale')],
      ok: tr('Giusto: a volume fisso la pressione va come la temperatura in kelvin.'),
    }),
  },
  primo: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Il primo principio: Q = ΔU + L'),
    sub: () => tr('Il calore si divide fra il gas e il lavoro'),
    test: (s) => /primo principio della termodinamica|first law of thermodynamics|energia interna|internal energy/i.test(s),
    body: () => tr('Il calore <b>Q</b> dato a un gas non sparisce: una parte diventa <b>lavoro L</b>, perché il gas si dilata e spinge; il resto alza la sua <b>energia interna ΔU</b>, cioè lo scalda. <b>Q = ΔU + L</b>: l’energia si conserva. Dai calore all’aria sotto un pistone.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (Q) => {
        // l'aria a pressione costante: 2/7 del calore diventano lavoro, 5/7 energia interna
        const L = (Q * 2) / 7, U = Q - L, hp = 30 + L * 0.9, B = (x, v, cls) => `<rect x="${x}" y="${(96 - v * 0.55).toFixed(1)}" width="20" height="${(v * 0.55).toFixed(1)}" class="${cls}"/>`;
        let g = `<path d="M14 18V96H66V18" class="edge"/><rect x="16" y="${(96 - hp).toFixed(1)}" width="48" height="${hp.toFixed(1)}" class="cell"/><line x1="16" y1="${(96 - hp).toFixed(1)}" x2="64" y2="${(96 - hp).toFixed(1)}" class="side"/>`;
        g += `<rect x="28" y="${(96 - hp - 14).toFixed(1)}" width="24" height="12" class="blk"/><line x1="100" y1="96" x2="196" y2="96" class="ground"/>`;
        g += B(108, Q, 'sqa') + B(140, U, 'sqc') + B(172, L, 'sqb');
        g += `<text x="118" y="108" class="lb" text-anchor="middle">Q</text><text x="150" y="108" class="lb" text-anchor="middle">ΔU</text><text x="182" y="108" class="lb" text-anchor="middle">${tr('lavoro')}</text>`;
        show.innerHTML = svg(200, 112, g) + `<div class="tool-f">${n(Q, 0)} J = <span class="c1">${n(U, 0)} J</span> + <span class="c2">${n(L, 0)} J</span></div>`;
      };
      const a = slider(tr('calore dato (J)'), 0, 140, 10, 70, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Vale anche al contrario: se un gas si espande senza ricevere calore, il lavoro viene dalla sua energia interna e il gas si raffredda. Per questo la bomboletta spray si raffredda mentre la usi.'),
    check: () => ({
      q: tr('Un gas riceve 100 J di calore e fa 30 J di lavoro. La sua energia interna…'),
      options: [tr('cresce di 70 J'), tr('cresce di 130 J'), tr('resta uguale')],
      ok: tr('Giusto: 100 J = 70 J di energia interna + 30 J di lavoro.'),
    }),
  },
  carnot: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('Il rendimento: η = 1 − T fredda / T calda'),
    sub: () => tr('Quanto calore può diventare lavoro'),
    test: (s) => /Carnot|rendiment|efficiency of an engine|maximum efficiency/i.test(s),
    body: () => tr('Un motore termico prende calore dalla caldaia, ne trasforma una parte in lavoro e cede il resto al lato freddo. Il massimo possibile, senza nessuna perdita, è il <b>rendimento di Carnot</b>: <b>η = 1 − T fredda / T calda</b>, con le temperature in kelvin. Scegli la caldaia, con il lato freddo a 20 °C.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (tc) => {
        const K = tc + 273.15, eta = Math.max(0, 1 - 293.15 / K), L = 100 * eta, w = (J) => (1 + J * 0.12).toFixed(1);
        let g = `<rect x="20" y="6" width="110" height="20" class="sqa"/><rect x="20" y="88" width="110" height="20" class="sqc"/><circle cx="75" cy="57" r="13" class="tri"/>`;
        g += `<line x1="75" y1="26" x2="75" y2="44" class="shx" style="stroke-width:${w(100)}"/>`;
        if (100 - L > 0.5) g += `<line x1="75" y1="70" x2="75" y2="88" class="unroll" style="stroke-width:${w(100 - L)}"/>`;
        if (L > 0.5) g += `<line x1="88" y1="57" x2="150" y2="57" class="shy" style="stroke-dasharray:none;stroke-width:${w(L)}"/>`;
        g += `<text x="75" y="20" class="lb" text-anchor="middle">${n(tc, 0)} °C</text><text x="75" y="102" class="lb" text-anchor="middle">20 °C</text><text x="156" y="61" class="lb">${n(L, 0)} J</text>`;
        show.innerHTML = svg(200, 112, g) + `<div class="tool-f">η = 1 − 293 / ${n(K, 0)} = <span class="c2">${n(L, 0)}%</span></div>`;
      };
      const a = slider(tr('caldaia (°C)'), 20, 800, 10, 200, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo le centrali usano vapore caldissimo e nessun motore arriva al 100%: servirebbe un lato freddo allo zero assoluto.'),
    check: () => ({
      q: tr('Un motore ideale lavora fra 400 K e 300 K. Il suo rendimento massimo è…'),
      options: [tr('25%'), tr('75%'), tr('100%')],
      ok: tr('Giusto: 1 − 300 / 400 = 0,25.'),
    }),
  },
  entropia: {
    area: 'fisica', offer: true, world: 'vulcano',
    title: () => tr('L’entropia: il disordine che cresce'),
    sub: () => tr('Il secondo principio della termodinamica'),
    test: (s) => /entropi|secondo principio della termodinamica|second law of thermodynamics/i.test(s),
    body: () => tr('Il calore passa da solo dal caldo al freddo, mai al contrario: è il <b>secondo principio</b>. Dietro c’è l’<b>entropia</b>, che conta in quanti modi si possono disporre le particelle: da sole, le cose vanno verso gli stati con più modi, cioè più disordinati. Prendi un gas di N particelle.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const DOTS = Array.from({ length: 20 }, (_, i) => [(0.5 + i * 0.7548777) % 1, (0.5 + i * 0.5698403) % 1]);
      const draw = (N) => {
        const box = (x0, all) => DOTS.slice(0, N).map(([u, v]) => `<circle cx="${(x0 + 4 + u * (all ? 36 : 80)).toFixed(1)}" cy="${(16 + v * 64).toFixed(1)}" r="2.6" class="tipdot"/>`).join('');
        let g = `<rect x="4" y="12" width="88" height="72" class="edge"/><line x1="48" y1="12" x2="48" y2="84" class="shy"/><rect x="108" y="12" width="88" height="72" class="edge"/><line x1="152" y1="12" x2="152" y2="84" class="shy"/>`;
        g += box(6, true) + box(110, false);
        g += `<text x="48" y="100" class="lb" text-anchor="middle">${tr('tutte a sinistra')}</text><text x="152" y="100" class="lb" text-anchor="middle">${tr('sparpagliate')}</text>`;
        show.innerHTML = svg(200, 106, g) + `<div class="tool-f">N = ${N}: ${tr('una volta su')} <span class="c2">${n(2 ** N, 0)}</span></div>`;
      };
      const a = slider(tr('particelle'), 2, 20, 1, 6, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo il profumo si sparge, il ghiaccio si scioglie nella bibita e un uovo rotto non torna intero: l’entropia di un sistema isolato non diminuisce mai.'),
    check: () => ({
      q: tr('Con 10 particelle, quante volte su 1024 sono tutte nella metà sinistra?'),
      options: [tr('una volta'), tr('512 volte'), tr('10 volte')],
      ok: tr('Giusto: un solo modo su 2 elevato a 10, cioè 1024.'),
    }),
  },
  // ---------- la Valle delle Onde ----------
  hooke: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('La legge di Hooke: F = k·x'),
    sub: () => tr('La forza di una molla'),
    test: (s) => /Hooke|costante elastica|spring constant/i.test(s),
    body: () => tr('Una molla tirata, o schiacciata, risponde con una forza proporzionale a quanto è deformata: <b>F = k·x</b>. La <b>costante elastica</b> k dice quanto è dura la molla, in N/m: il doppio della forza, il doppio dell’allungamento. Appendi dei pesi a una molla da 20 N/m.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (w) => {
        const F = (w / 1000) * 9.81, x = (F / 20) * 100, y1 = 34 + x * 2.6, zig = Array.from({ length: 10 }, (_, i) => `${i % 2 ? 62 : 78},${(12 + ((y1 - 14) * (i + 0.5)) / 10).toFixed(1)}`).join(' ');
        let g = `<line x1="40" y1="8" x2="100" y2="8" class="ground"/><polyline points="70,8 70,12 ${zig} 70,${(y1 - 2).toFixed(1)} 70,${y1.toFixed(1)}" class="edge"/>`;
        for (let i = 0; i < w / 50; i++) g += `<rect x="58" y="${(y1 + 2 + i * 7).toFixed(1)}" width="24" height="6" class="blk"/>`;
        g += `<line x1="112" y1="34" x2="112" y2="${34 + 30 * 2.6}" class="ground"/>`;
        for (const c of [0, 10, 20, 30]) g += `<line x1="112" y1="${34 + c * 2.6}" x2="120" y2="${34 + c * 2.6}" class="ground"/><text x="124" y="${38 + c * 2.6}" class="lb">${c} cm</text>`;
        g += `<line x1="80" y1="${y1.toFixed(1)}" x2="110" y2="${y1.toFixed(1)}" class="frc"/>`;
        show.innerHTML = svg(200, 120, g) + `<div class="tool-f">F = <span class="c1">${n(F, 2)} N</span> → x = <span class="c2">${n(x, 1)} cm</span></div>`;
      };
      const a = slider(tr('pesi appesi (g)'), 0, 300, 50, 100, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo una bilancia a molla, il dinamometro, si può tarare in newton: l’allungamento cresce in proporzione al peso.'),
    check: () => ({
      q: tr('Una molla si allunga di 3 cm con 2 N. Con 6 N si allunga di…'),
      options: [tr('9 cm'), tr('3 cm'), tr('6 cm')],
      ok: tr('Giusto: il triplo della forza, il triplo dell’allungamento.'),
    }),
  },
  oscillatore: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('Periodo e frequenza: T = 2π·√(m/k)'),
    sub: () => tr('Il ritmo di una massa su una molla'),
    test: (s) => /frequenz|hertz|frequency|T ?= ?2π ?· ?√ ?\(m/i.test(s),
    body: () => tr('Il <b>periodo</b> T è il tempo di un’oscillazione completa, la <b>frequenza</b> f = 1/T il numero di oscillazioni in un secondo, in <b>hertz</b>. Per una massa su una molla <b>T = 2π·√(m/k)</b>, e non dipende da quanto la tiri. Cambia la massa su una molla da 20 N/m.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (m) => {
        const T = 2 * Math.PI * Math.sqrt(m / 20), X = (t) => 14 + (t / 3) * 180, pts = Array.from({ length: 121 }, (_, i) => { const t = (i / 120) * 3; return `${X(t).toFixed(1)},${(50 - 32 * Math.cos((2 * Math.PI * t) / T)).toFixed(1)}`; }).join(' ');
        let g = `<line x1="14" y1="50" x2="194" y2="50" class="ground"/><polyline points="${pts}" class="edge"/>`;
        if (T <= 3) g += `<line x1="${X(0)}" y1="12" x2="${X(0)}" y2="94" class="shy"/><line x1="${X(T).toFixed(1)}" y1="12" x2="${X(T).toFixed(1)}" y2="94" class="shy"/><line x1="${X(0)}" y1="90" x2="${X(T).toFixed(1)}" y2="90" class="mk"/><text x="${((X(0) + X(T)) / 2).toFixed(1)}" y="104" class="lb" text-anchor="middle">T</text>`;
        g += `<text x="194" y="64" class="lb" text-anchor="end">3 s</text>`;
        show.innerHTML = svg(200, 108, g) + `<div class="tool-f">T = <span class="c1">${n(T, 2)} s</span>, f = <span class="c2">${n(1 / T, 2)} Hz</span></div>`;
      };
      const a = slider(tr('massa (kg)'), 0.1, 2, 0.1, 0.5, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo un’auto carica oscilla più lentamente sulle sue molle, e gli orologi a bilanciere tengono il tempo con una piccola molla.'),
    check: () => ({
      q: tr('Una massa su una molla fa 4 oscillazioni al secondo. Quanto vale il periodo?'),
      options: [tr('0,25 s'), tr('4 s'), tr('0,4 s')],
      ok: tr('Giusto: T = 1/f = 1/4 di secondo.'),
    }),
  },
  onda: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('L’onda: v = λ·f'),
    sub: () => tr('Velocità, lunghezza d’onda e frequenza'),
    test: (s) => /lunghezza d.onda|wavelength|v ?= ?λ ?· ?f/i.test(s),
    body: () => tr('Un’<b>onda</b> trasporta energia, non materia: ogni punto del mezzo oscilla sul posto, e a correre è la forma. La <b>lunghezza d’onda</b> λ è la distanza fra due creste; in un periodo l’onda avanza proprio di λ, quindi <b>v = λ·f</b>. La velocità la decide il mezzo, la frequenza la sorgente. Cambia la frequenza su una corda dove l’onda corre a 3 m/s.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (f) => {
        const lam = 3 / f, X = (m) => 14 + m * 30, pts = Array.from({ length: 181 }, (_, i) => { const m = (i / 180) * 6; return `${X(m).toFixed(1)},${(48 - 26 * Math.sin((2 * Math.PI * m) / lam)).toFixed(1)}`; }).join(' ');
        let g = `<line x1="14" y1="48" x2="194" y2="48" class="ground"/><polyline points="${pts}" class="edge"/>`;
        g += `<line x1="${X(0)}" y1="88" x2="${X(lam).toFixed(1)}" y2="88" class="mk"/><line x1="${X(0)}" y1="82" x2="${X(0)}" y2="94" class="mk"/><line x1="${X(lam).toFixed(1)}" y1="82" x2="${X(lam).toFixed(1)}" y2="94" class="mk"/>`;
        g += `<text x="${X(lam / 2).toFixed(1)}" y="104" class="lb" text-anchor="middle">λ</text><text x="194" y="104" class="lb" text-anchor="end">6 m</text>`;
        show.innerHTML = svg(200, 108, g) + `<div class="tool-f">λ = v / f = <span class="c1">${n(lam, 2)} m</span></div>`;
      };
      const a = slider(tr('frequenza (Hz)'), 0.5, 3, 0.25, 1, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo le onde di uno tsunami, velocissime e con un periodo di molti minuti, sono lunghe centinaia di chilometri.'),
    check: () => ({
      q: tr('Un’onda corre a 6 m/s con frequenza 2 Hz. Quanto è lunga?'),
      options: [tr('3 m'), tr('12 m'), tr('4 m')],
      ok: tr('Giusto: λ = v / f = 6 / 2 = 3 m.'),
    }),
  },
  stazionarie: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('Le onde stazionarie: f = n·v/(2L)'),
    sub: () => tr('Le note di una corda fissa ai capi'),
    test: (s) => /\bstazionari|ventri\b|standing wave|antinode/i.test(s),
    body: () => tr('Su una corda fissa ai due capi, l’onda che va e quella riflessa si sommano. Solo per certe frequenze nasce un’<b>onda stazionaria</b>: <b>nodi</b> sempre fermi e <b>ventri</b> che oscillano. La corda deve contenere un numero intero di mezze onde: λ = 2L/n, e <b>f = n·v/(2L)</b>. Scegli quanti ventri, su una corda di 6 m dove l’onda corre a 4 m/s.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (k) => {
        const X = (m) => 16 + m * 28, line = (sg) => Array.from({ length: 169 }, (_, i) => { const m = (i / 168) * 6; return `${X(m).toFixed(1)},${(46 - sg * 28 * Math.sin((k * Math.PI * m) / 6)).toFixed(1)}`; }).join(' ');
        let g = `<line x1="${X(0)}" y1="10" x2="${X(0)}" y2="82" class="ground"/><line x1="${X(6)}" y1="10" x2="${X(6)}" y2="82" class="ground"/>`;
        g += `<polyline points="${line(-1)}" class="edge" opacity=".4"/><polyline points="${line(1)}" class="edge"/>`;
        for (let i = 0; i <= k; i++) g += `<circle cx="${X((6 * i) / k).toFixed(1)}" cy="46" r="3" class="c2"/>`;
        g += `<text x="${X(3).toFixed(1)}" y="100" class="lb" text-anchor="middle">${k === 1 ? tr('1 ventre, 2 nodi') : tr('{n} ventri, {m} nodi', { n: k, m: k + 1 })}</text>`;
        show.innerHTML = svg(200, 106, g) + `<div class="tool-f">λ = <span class="c1">${n(12 / k, 2)} m</span>, f = <span class="c2">${n(k / 3, 2)} Hz</span></div>`;
      };
      const a = slider(tr('ventri'), 1, 6, 1, 3, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo una chitarra suona note precise: premendo un tasto accorci la corda, e la nota sale.'),
    check: () => ({
      q: tr('Una corda ha la frequenza più bassa a 100 Hz. Con 3 ventri vibra a…'),
      options: [tr('300 Hz'), tr('150 Hz'), tr('33 Hz')],
      ok: tr('Giusto: tre volte la frequenza più bassa.'),
    }),
  },
  suono: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('La velocità del suono: d = v·t'),
    sub: () => tr('Il lampo, il tuono e l’eco'),
    test: (s) => /velocità del suono|343 ?m\/s|speed of sound/i.test(s),
    body: () => tr('Il <b>suono</b> è un’onda di pressione: ha bisogno di un mezzo, e nel vuoto non passa. Nell’aria corre a <b>343 m/s</b>, circa un chilometro ogni 3 secondi; nell’acqua a 1480 m/s, nel ferro a 5000 m/s. Fra il lampo e il tuono, <b>d = v·t</b>. Conta i secondi dopo un lampo.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (t) => {
        const d = 0.343 * t, X = (km) => 24 + km * 40;
        let g = `<line x1="10" y1="84" x2="196" y2="84" class="ground"/>`;
        for (let k = 0; k <= 4; k++) g += `<line x1="${X(k)}" y1="84" x2="${X(k)}" y2="90" class="ground"/><text x="${X(k)}" y="102" class="lb" text-anchor="middle">${k} km</text>`;
        g += `<circle cx="${X(0)}" cy="58" r="5" class="tipdot"/><line x1="${X(0)}" y1="63" x2="${X(0)}" y2="76" class="arrow"/>`;
        g += `<polyline points="${X(d).toFixed(1)},14 ${(X(d) - 6).toFixed(1)},40 ${(X(d) + 4).toFixed(1)},42 ${(X(d) - 2).toFixed(1)},84" class="frc"/>`;
        // il fronte del tuono, centrato sul fulmine, che arriva all'omino
        for (const dr of [0, 7, 14]) { const r = X(d) - X(0) - dr; if (r > 4) g += `<path d="M${(X(d) - r).toFixed(1)} 84 A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${X(d).toFixed(1)} ${(84 - r).toFixed(1)}" fill="none" class="shy" opacity="${(1 - dr / 20).toFixed(2)}"/>`; }
        show.innerHTML = svg(200, 106, g) + `<div class="tool-f">d = 343 m/s × <span class="c2">${t} s</span> = <span class="c1">${n(d, 2)} km</span></div>`;
      };
      const a = slider(tr('secondi fra il lampo e il tuono'), 1, 12, 1, 6, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i temporali si contano: 3 secondi di ritardo, un chilometro di distanza.'),
    check: () => ({
      q: tr('Fra il lampo e il tuono passano 9 secondi. Il temporale è a circa…'),
      options: [tr('3 km'), tr('9 km'), tr('300 m')],
      ok: tr('Giusto: 343 m/s per 9 s fa circa 3 km.'),
    }),
  },
  udito: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('Acuto e grave: da 20 a 20 000 Hz'),
    sub: () => tr('Chi sente che cosa'),
    test: (s) => /ultrasuon|infrasuon|ultrasound|infrasound/i.test(s),
    body: () => tr('L’<b>altezza</b> di un suono è la sua frequenza: più vibrazioni al secondo, suono più acuto. Il volume, invece, è l’ampiezza. Noi sentiamo da circa <b>20 Hz</b> a <b>20 000 Hz</b>: sotto ci sono gli <b>infrasuoni</b>, sopra gli <b>ultrasuoni</b>. Sposta la frequenza e guarda chi la sente.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const F = (k) => 10 ** (1 + k / 25), X = (f) => 62 + ((Math.log10(f) - 1) / 4) * 124;
      const who = [['elefante', 16, 12000], ['persona', 20, 20000], ['cane', 67, 45000], ['pipistrello', 2000, 100000]];
      const fmtF = (k) => `${Math.round(F(k)).toLocaleString(LOCALE)} Hz`;
      const draw = (k) => {
        const f = F(k);
        let g = '';
        who.forEach(([nm, a, b], i) => {
          const y = 14 + i * 20, on = f >= a && f <= b;
          g += `<text x="58" y="${y + 4}" class="lb" text-anchor="end">${tr(nm)}</text><line x1="${X(a).toFixed(1)}" y1="${y}" x2="${X(b).toFixed(1)}" y2="${y}" class="${on ? 'shx' : 'ground'}"/>`;
        });
        for (const [v, l] of [[10, '10'], [100, '100'], [1000, '1k'], [10000, '10k'], [100000, '100k']]) g += `<line x1="${X(v).toFixed(1)}" y1="86" x2="${X(v).toFixed(1)}" y2="90" class="ground"/><text x="${X(v).toFixed(1)}" y="101" class="lb" text-anchor="middle">${l}</text>`;
        g += `<line x1="${X(f).toFixed(1)}" y1="4" x2="${X(f).toFixed(1)}" y2="88" class="arrow" stroke-width="2"/>`;
        const kind = f < 20 ? tr('un infrasuono') : f > 20000 ? tr('un ultrasuono') : tr('un suono udibile');
        show.innerHTML = svg(200, 106, g) + `<div class="tool-f"><span class="c2">${fmtF(k)}</span>: <span class="c1">${kind}</span></div>`;
      };
      const a = slider(tr('frequenza'), 0, 100, 1, 45, draw, fmtF);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i pipistrelli cacciano al buio: mandano ultrasuoni e ascoltano l’eco degli insetti.'),
    check: () => ({
      q: tr('Un suono a 50 000 Hz è…'),
      options: [tr('un ultrasuono'), tr('un infrasuono'), tr('un suono udibile')],
      ok: tr('Giusto: sopra i 20 000 Hz noi non lo sentiamo.'),
    }),
  },
  risonanza: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('La risonanza'),
    sub: () => tr('Spinte a tempo, oscillazioni enormi'),
    test: (s) => /risonanz|resonan/i.test(s),
    body: () => tr('Ogni oscillatore ha una sua <b>frequenza naturale</b>. Se una forza periodica lo spinge proprio con quella frequenza, ogni spinta arriva in fase e l’ampiezza cresce: è la <b>risonanza</b>. Fuori risonanza le spinte a volte aiutano e a volte frenano. Cambia la frequenza della forza e guarda la curva.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const Q = 8, A = (r) => 1 / Math.sqrt((1 - r * r) ** 2 + (r / Q) ** 2), X = (r) => 14 + ((r - 0.4) / 1.2) * 180, Y = (a) => 88 - (a / Q) * 74;
      const draw = (r) => {
        const pts = Array.from({ length: 121 }, (_, i) => { const x = 0.4 + (i / 120) * 1.2; return `${X(x).toFixed(1)},${Y(A(x)).toFixed(1)}`; }).join(' ');
        let g = `<line x1="14" y1="88" x2="194" y2="88" class="ground"/><line x1="${X(1)}" y1="10" x2="${X(1)}" y2="88" class="shy"/><polyline points="${pts}" class="edge"/>`;
        g += `<line x1="${X(r).toFixed(1)}" y1="${Y(A(r)).toFixed(1)}" x2="${X(r).toFixed(1)}" y2="88" class="mk"/><circle cx="${X(r).toFixed(1)}" cy="${Y(A(r)).toFixed(1)}" r="4" class="tipdot"/>`;
        g += `<text x="${X(1)}" y="102" class="lb" text-anchor="middle">${tr('naturale')}</text>`;
        show.innerHTML = svg(200, 106, g) + `<div class="tool-f">${tr('ampiezza')} × <span class="c1">${n(A(r), 1)}</span></div>`;
      };
      const a = slider(tr('frequenza della forza, rispetto a quella naturale'), 0.5, 1.5, 0.02, 0.8, draw, (v) => `${n(v, 2)} ×`);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i soldati rompono il passo sui ponti, e i grattacieli hanno grandi smorzatori in cima.'),
    check: () => ({
      q: tr('Un’altalena fa un’oscillazione ogni 2 s. Per farla salire di più, la spingi…'),
      options: [tr('ogni 2 s'), tr('ogni secondo'), tr('ogni 3 s')],
      ok: tr('Giusto: con il suo ritmo, ogni spinta aiuta.'),
    }),
  },
  doppler: {
    area: 'fisica', offer: true, world: 'valle',
    title: () => tr('L’effetto Doppler'),
    sub: () => tr('La sirena che cambia nota'),
    test: (s) => /doppler/i.test(s),
    body: () => tr('Se la sorgente si muove, le onde davanti a lei si stringono e quelle dietro si allargano. Chi sta davanti sente una frequenza più alta, <b>f′ = f·v/(v − vₛ)</b>; chi sta dietro una più bassa, <b>f′ = f·v/(v + vₛ)</b>. Cambia la velocità della sirena, che suona a 700 Hz.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (vs) => {
        let g = `<line x1="6" y1="86" x2="194" y2="86" class="ground"/>`;
        for (let k = 1; k <= 6; k++) { const r = 13 * k, cx = 112 - (vs / 343) * r * 3; g += `<circle cx="${cx.toFixed(1)}" cy="50" r="${r}" fill="none" class="edge" opacity="${(1 - k / 8).toFixed(2)}"/>`; }
        g += `<rect x="104" y="44" width="16" height="12" class="blk"/>`;
        if (vs > 0) g += `<line x1="122" y1="50" x2="140" y2="50" class="arrow"/>`;
        show.innerHTML = svg(200, 100, g) + `<div class="tool-f">${tr('davanti')} <span class="c2">${Math.round((700 * 343) / (343 - vs))} Hz</span> · ${tr('dietro')} <span class="c1">${Math.round((700 * 343) / (343 + vs))} Hz</span></div>`;
      };
      const a = slider(tr('velocità della sirena (m/s)'), 0, 80, 5, 30, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i radar della polizia misurano la velocità delle auto, e gli astronomi quella delle stelle e delle galassie.'),
    check: () => ({
      q: tr('Un’ambulanza si allontana. La sua sirena sembra…'),
      options: [tr('più grave'), tr('più acuta'), tr('uguale')],
      ok: tr('Giusto: dietro la sorgente le onde si allargano.'),
    }),
  },
  // ---------- il Prisma ----------
  ombra: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('Ombre e triangoli simili: S = h·D/d'),
    sub: () => tr('La luce va dritta'),
    test: (s) => /penombr|propagazione rettilinea|camera oscura|triangoli simili|rectilinear|pinhole|penumbra/i.test(s),
    body: () => tr('La luce si propaga in <b>linea retta</b>: un oggetto opaco ferma i raggi e dietro lascia l’<b>ombra</b>. Con una sorgente piccola, l’ombra sul muro è alta <b>S = h·D/d</b>: h è l’oggetto, d la sua distanza dalla lampada, D quella del muro. Con una sorgente larga, intorno c’è la penombra. Sposta l’oggetto.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (d) => {
        const X = (m) => 12 + m * 45, yc = 52, S = (0.4 * 4) / d, sp = Math.min(48, (S * 45) / 2);
        let g = `<line x1="${X(4)}" y1="4" x2="${X(4)}" y2="100" class="ground"/><circle cx="${X(0)}" cy="${yc}" r="4" class="tipdot"/>`;
        g += `<polyline points="${X(0)},${yc} ${X(d)},${yc - 9} ${X(4)},${(yc - sp).toFixed(1)}" class="edge"/><polyline points="${X(0)},${yc} ${X(d)},${yc + 9} ${X(4)},${(yc + sp).toFixed(1)}" class="edge"/>`;
        g += `<line x1="${X(d)}" y1="${yc - 9}" x2="${X(d)}" y2="${yc + 9}" class="shx"/><line x1="${X(4) - 3}" y1="${(yc - sp).toFixed(1)}" x2="${X(4) - 3}" y2="${(yc + sp).toFixed(1)}" class="side"/>`;
        show.innerHTML = svg(200, 104, g) + `<div class="tool-f">S = 0,4 × 4 / ${n(d, 1)} = <span class="c1">${n(S, 2)} m</span></div>`;
      };
      const a = slider(tr('distanza dalla lampada (m)'), 0.5, 3.5, 0.5, 1, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo, con un bastone e la sua ombra, Talete misurò l’altezza della grande piramide.'),
    check: () => ({
      q: tr('Un oggetto alto 30 cm è a 1 m da una lampada; il muro è a 3 m. L’ombra è alta…'),
      options: [tr('90 cm'), tr('30 cm'), tr('10 cm')],
      ok: tr('Giusto: 30 cm × 3 / 1 = 90 cm.'),
    }),
  },
  riflessione: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('La riflessione: i = r'),
    sub: () => tr('Come rimbalza la luce su uno specchio'),
    test: (s) => /incidenza|angolo di riflessione|angle of (incidence|reflection)|specchio piano|plane mirror/i.test(s),
    body: () => tr('Un raggio che colpisce uno specchio si riflette: l’<b>angolo di incidenza</b> e l’<b>angolo di riflessione</b>, misurati dalla <b>normale</b>, sono uguali, e i due raggi stanno da parti opposte. In uno specchio piano l’immagine sta dietro lo specchio, alla stessa distanza dell’oggetto. Cambia l’angolo del raggio.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (i) => {
        const a = (i * Math.PI) / 180, R = 72, x0 = 100, y0 = 88, sx = x0 - R * Math.sin(a), sy = y0 - R * Math.cos(a), ox = x0 + R * Math.sin(a);
        let g = `<line x1="14" y1="${y0}" x2="186" y2="${y0}" class="unroll"/><line x1="${x0}" y1="8" x2="${x0}" y2="${y0}" class="shy"/>`;
        g += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${x0}" y2="${y0}" class="frc"/><line x1="${x0}" y1="${y0}" x2="${ox.toFixed(1)}" y2="${sy.toFixed(1)}" class="frc"/>`;
        show.innerHTML = svg(200, 96, g) + `<div class="tool-f">i = <span class="c2">${i}°</span> → r = <span class="c1">${i}°</span></div>`;
      };
      const a = slider(tr('angolo di incidenza (°)'), 0, 80, 5, 40, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i catarifrangenti delle biciclette, fatti di tanti specchietti ad angolo, rimandano la luce dei fari proprio verso l’auto.'),
    check: () => ({
      q: tr('Un raggio arriva su uno specchio con un angolo di incidenza di 25°. L’angolo di riflessione è…'),
      options: [tr('25°'), tr('65°'), tr('50°')],
      ok: tr('Giusto: uguale all’angolo di incidenza.'),
    }),
  },
  rifrazione: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('La rifrazione: sin i = n · sin r'),
    sub: () => tr('Come si piega la luce entrando nell’acqua'),
    test: (s) => /rifrazion|rifratt|snell|refract/i.test(s),
    body: () => tr('Quando la luce passa dall’aria a un materiale trasparente cambia velocità, e il raggio si piega: è la <b>rifrazione</b>. Entrando nell’acqua o nel vetro il raggio si avvicina alla normale: <b>sin i = n · sin r</b>, dove n è l’<b>indice di rifrazione</b>: 1,33 per l’acqua, 1,5 per il vetro. Uscendo succede il contrario, e oltre l’angolo limite la luce non esce più. Cambia l’angolo.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (i) => {
        const a = (i * Math.PI) / 180, r = Math.asin(Math.sin(a) / 1.33), R = 50, x0 = 100, y0 = 54;
        const sx = x0 - R * Math.sin(a), sy = y0 - R * Math.cos(a), ex = x0 + R * Math.sin(r), ey = y0 + R * Math.cos(r);
        let g = `<rect x="10" y="${y0}" width="180" height="52" class="wat"/><line x1="10" y1="${y0}" x2="190" y2="${y0}" class="edge"/><line x1="${x0}" y1="2" x2="${x0}" y2="106" class="shy"/>`;
        g += `<polyline points="${sx.toFixed(1)},${sy.toFixed(1)} ${x0},${y0} ${ex.toFixed(1)},${ey.toFixed(1)}" class="frc"/>`;
        show.innerHTML = svg(200, 108, g) + `<div class="tool-f">i = <span class="c2">${i}°</span> → r = <span class="c1">${n((r * 180) / Math.PI, 1)}°</span></div>`;
      };
      const a = slider(tr('angolo di incidenza (°)'), 0, 80, 5, 40, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo una piscina sembra meno profonda di quanto è: la luce del fondo si piega uscendo, e lo vediamo più in alto.'),
    check: () => ({
      q: tr('Un raggio passa dall’aria all’acqua. Rispetto alla normale, il raggio rifratto…'),
      options: [tr('si avvicina'), tr('si allontana'), tr('resta uguale')],
      ok: tr('Giusto: nell’acqua la luce è più lenta, e il raggio si avvicina alla normale.'),
    }),
  },
  lente: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('Le lenti: 1/p + 1/q = 1/f'),
    sub: () => tr('Dove si forma l’immagine'),
    test: (s) => /lente convergente|lenti convergenti|distanza focale|immagin[ei] real|1\/p \+ 1\/q|converging lens|focal length|real image|lens equation/i.test(s),
    body: () => tr('Una <b>lente convergente</b> fa incontrare i raggi paralleli nel <b>fuoco</b>, a distanza f. Un oggetto oltre il fuoco, a distanza p, dà un’<b>immagine reale</b> e capovolta a distanza q: <b>1/p + 1/q = 1/f</b>. L’immagine è q/p volte più grande dell’oggetto. Con l’oggetto dentro il fuoco la lente fa da lente d’ingrandimento. Sposta l’oggetto.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (p) => {
        const f = 10, q = (p * f) / (p - f), k = 1.5, x0 = 100, y0 = 52, ho = 16, hi = ho * (q / p), xo = x0 - p * k, xi = x0 + q * k;
        let g = `<line x1="4" y1="${y0}" x2="196" y2="${y0}" class="ground"/><ellipse cx="${x0}" cy="${y0}" rx="5" ry="40" class="area"/>`;
        g += `<line x1="${xo}" y1="${y0}" x2="${xo}" y2="${y0 - ho}" class="side"/><line x1="${xi.toFixed(1)}" y1="${y0}" x2="${xi.toFixed(1)}" y2="${(y0 + hi).toFixed(1)}" class="unroll"/>`;
        g += `<polyline points="${xo},${y0 - ho} ${x0},${y0 - ho} ${xi.toFixed(1)},${(y0 + hi).toFixed(1)}" class="frc"/><line x1="${xo}" y1="${y0 - ho}" x2="${xi.toFixed(1)}" y2="${(y0 + hi).toFixed(1)}" class="frc"/>`;
        g += `<circle cx="${x0 - f * k}" cy="${y0}" r="2.5" class="tipdot"/><circle cx="${x0 + f * k}" cy="${y0}" r="2.5" class="tipdot"/>`;
        show.innerHTML = svg(200, 104, g) + `<div class="tool-f">1/${p} + 1/q = 1/10 → q = <span class="c1">${n(q, 1)} cm</span></div>`;
      };
      const a = slider(tr('distanza dell’oggetto, p (cm)'), 15, 60, 5, 20, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo la macchina fotografica, per mettere a fuoco, sposta l’obiettivo: gli oggetti vicini fanno immagini più lontane.'),
    check: () => ({
      q: tr('Un oggetto è a 20 cm da una lente con f = 10 cm. L’immagine si forma a…'),
      options: [tr('20 cm'), tr('10 cm'), tr('30 cm')],
      ok: tr('Giusto: 1/q = 1/10 − 1/20 = 1/20.'),
    }),
  },
  dispersione: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('La dispersione: ogni colore ha il suo n'),
    sub: () => tr('Perché il prisma apre la luce nei colori'),
    test: (s) => /dispersion|spettr|spectrum/i.test(s),
    body: () => tr('La luce bianca è una miscela di colori. Nel vetro ogni colore ha un <b>indice di rifrazione</b> un po’ diverso: il violetto va più piano e si piega di più, il rosso di meno. Così un prisma separa la luce bianca nello <b>spettro</b>: rosso, arancione, giallo, verde, blu, indaco, violetto. Scegli un colore: il disegno esagera la differenza.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const COL = [['rosso', '#ff4b4b', 1.513], ['arancione', '#ff9b3d', 1.514], ['giallo', '#ffe14d', 1.517], ['verde', '#4fe36b', 1.519], ['blu', '#3d8bff', 1.523], ['indaco', '#6b5bff', 1.526], ['violetto', '#b05bff', 1.532]];
      const draw = (k) => {
        const [name, col, nn] = COL[k], dev = 2 * Math.asin(nn * 0.5) * (180 / Math.PI) - 60;
        // deviazione minima di un prisma di 60°, disegnata cinque volte più grande attorno a quella del giallo
        const shown = ((39 + (dev - 39) * 5) * Math.PI) / 180, y0 = 50, a0 = (18 * Math.PI) / 180, out = a0 - shown;
        let g = `<polygon points="88,82 112,40 136,82" class="tri"/><line x1="14" y1="${(y0 + 28).toFixed(1)}" x2="100" y2="${y0}" class="arrow"/>`;
        g += `<line x1="124" y1="${y0}" x2="${(124 + 70 * Math.cos(out)).toFixed(1)}" y2="${(y0 - 70 * Math.sin(out)).toFixed(1)}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
        show.innerHTML = svg(200, 104, g) + `<div class="tool-f">${tr(name)}: n = <span class="c1">${n(nn, 3)}</span>, ${tr('deviazione')} <span class="c2">${n(dev, 1)}°</span></div>`;
      };
      const a = slider(tr('colore (dal rosso al violetto)'), 0, 6, 1, 0, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo i diamanti, che separano molto i colori, mandano lampi di tutti i colori dell’arcobaleno.'),
    check: () => ({
      q: tr('In un prisma di vetro, quale colore si piega di più?'),
      options: [tr('il violetto'), tr('il rosso'), tr('il verde')],
      ok: tr('Giusto: ha l’indice di rifrazione più grande.'),
    }),
  },
  colori: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('I colori della luce: rosso, verde e blu'),
    sub: () => tr('Come si mescolano le luci'),
    test: (s) => /colori primari|sintesi additiva|primary colours|additive/i.test(s),
    body: () => tr('I <b>colori primari</b> della luce sono rosso, verde e blu. Sommandoli si ottengono gli altri: rosso + verde = giallo, rosso + blu = magenta, verde + blu = ciano, tutti e tre = bianco. È la <b>sintesi additiva</b>. Le pitture invece tolgono colori alla luce: è la sintesi sottrattiva. Accendi le luci.'),
    widget() {
      const show = h('div', { class: 'tool-show' }), on = { r: true, g: true, b: false };
      const NAME = { 100: 'rosso', '010': 'verde', '001': 'blu', 110: 'giallo', 101: 'magenta', '011': 'ciano', 111: 'bianco', '000': 'nero' };
      const draw = () => {
        let g = '<rect x="0" y="0" width="200" height="104" fill="#000"/>';
        [['r', '#ff0000', 80, 42], ['g', '#00ff00', 120, 42], ['b', '#0000ff', 100, 72]].forEach(([k, c, x, y]) => { if (on[k]) g += `<circle cx="${x}" cy="${y}" r="30" fill="${c}" style="mix-blend-mode:screen"/>`; });
        show.innerHTML = svg(200, 104, `<g style="isolation:isolate">${g}</g>`) + `<div class="tool-f">${tr('al centro: {c}', { c: tr(NAME[['r', 'g', 'b'].map((k) => (on[k] ? 1 : 0)).join('')]) })}</div>`;
      };
      const bts = h('div', { class: 'chips' }, ['r', 'g', 'b'].map((k) => {
        const b = h('button', { class: 'chip' + (on[k] ? ' on' : ''), onclick: () => { on[k] = !on[k]; b.classList.toggle('on', on[k]); draw(); } }, tr({ r: 'Luce rossa', g: 'Luce verde', b: 'Luce blu' }[k]));
        return b;
      }));
      draw();
      return h('div', {}, show, bts);
    },
    tip: () => tr('Per questo lo schermo del telefono, visto con una lente, è fatto di puntini rossi, verdi e blu.'),
    check: () => ({
      q: tr('Luce rossa più luce blu dà…'),
      options: [tr('il magenta'), tr('il viola scuro'), tr('il nero')],
      ok: tr('Giusto: rosso + blu = magenta.'),
    }),
  },
  young: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('Le due fenditure: Δy = λ·L/d'),
    sub: () => tr('L’interferenza della luce'),
    test: (s) => /\byoung\b|due fenditure|double.slit|two slits/i.test(s),
    body: () => tr('Da due fenditure vicine partono due onde di luce che si sommano: dove arrivano in fase si rinforzano, dove arrivano in opposizione si cancellano. Sullo schermo compaiono strisce chiare e scure, distanti <b>Δy = λ·L/d</b>: λ è la lunghezza d’onda, L la distanza dello schermo, d quella fra le fenditure. Qui d = 0,3 mm e L = 2 m. Cambia il colore della luce.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const COL = { 400: '#b05bff', 450: '#3d8bff', 500: '#3dd6c4', 550: '#7be34f', 600: '#ff9b3d', 650: '#ff4b4b', 700: '#d93030' };
      const draw = (lam) => {
        // lo schermo visto di fronte, 10 px per millimetro: una striscia chiara ogni Δy
        const dy = (lam * 1e-9 * 2) / 0.3e-3 * 1e3;
        let g = '<rect x="10" y="20" width="180" height="64" fill="#000"/>';
        for (let x = 10; x < 190; x += 2) {
          const k = Math.cos((Math.PI * (x + 1 - 100)) / (dy * 10)) ** 2 * Math.exp(-(((x - 100) / 70) ** 2));
          g += `<rect x="${x}" y="20" width="2" height="64" fill="${COL[lam]}" opacity="${k.toFixed(2)}"/>`;
        }
        g += '<rect x="10" y="20" width="180" height="64" class="edge"/>';
        show.innerHTML = svg(200, 104, g) + `<div class="tool-f">Δy = ${lam} nm × 2 m / 0,3 mm = <span class="c1">${n(dy, 2)} mm</span></div>`;
      };
      const a = slider(tr('lunghezza d’onda (nm)'), 400, 700, 50, 650, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo Young, con due fenditure e un righello, misurò per primo la lunghezza d’onda della luce: meno di un millesimo di millimetro.'),
    check: () => ({
      q: tr('Se avvicini le due fenditure, le strisce sullo schermo…'),
      options: [tr('si allargano'), tr('si stringono'), tr('restano uguali')],
      ok: tr('Giusto: Δy = λ·L/d, con d al denominatore.'),
    }),
  },
  malus: {
    area: 'fisica', offer: true, world: 'prisma',
    title: () => tr('La polarizzazione: I = I₀·cos² θ'),
    sub: () => tr('Due filtri polarizzatori'),
    test: (s) => /polarizz|polari[sz]|malus/i.test(s),
    body: () => tr('La luce è un’onda <b>trasversale</b>: oscilla di traverso rispetto alla direzione in cui viaggia. Un filtro <b>polarizzatore</b> lascia passare solo le oscillazioni in una direzione. Dopo due filtri girati di un angolo θ passa la frazione <b>I = I₀·cos² θ</b> della luce (legge di Malus): tutta a 0°, metà a 45°, niente a 90°. Gira il secondo filtro.'),
    widget() {
      const show = h('div', { class: 'tool-show' });
      const draw = (th) => {
        const I = Math.cos((th * Math.PI) / 180) ** 2, ca = Math.cos((th * Math.PI) / 180), sa = Math.sin((th * Math.PI) / 180);
        const filt = (x, c, s) => {
          let f = `<circle cx="${x}" cy="44" r="28" class="area"/>`;
          for (let k = -21; k <= 21; k += 7) {
            const h2 = Math.sqrt(28 * 28 - k * k) - 2;
            f += `<line x1="${(x + k * c - h2 * s).toFixed(1)}" y1="${(44 + k * s + h2 * c).toFixed(1)}" x2="${(x + k * c + h2 * s).toFixed(1)}" y2="${(44 + k * s - h2 * c).toFixed(1)}" class="edge"/>`;
          }
          return f;
        };
        let g = filt(64, 1, 0) + filt(136, ca, sa);
        g += `<rect x="20" y="86" width="160" height="10" class="ground" fill="none"/><rect x="20" y="86" width="${(160 * I).toFixed(1)}" height="10" class="blk"/>`;
        show.innerHTML = svg(200, 104, g) + `<div class="tool-f">I = I₀ · cos² ${th}° = <span class="c1">${n(100 * I, 0)} %</span></div>`;
      };
      const a = slider(tr('angolo fra i due filtri (°)'), 0, 90, 5, 45, draw);
      a.set();
      return h('div', {}, show, a.el);
    },
    tip: () => tr('Per questo gli occhiali da sole polarizzati tolgono i riflessi dell’acqua: la luce riflessa oscilla soprattutto in orizzontale, e il filtro degli occhiali è verticale.'),
    check: () => ({
      q: tr('Due filtri polarizzatori sono girati di 90° l’uno rispetto all’altro. Passa…'),
      options: [tr('niente'), tr('metà della luce'), tr('tutta la luce')],
      ok: tr('Giusto: cos² 90° = 0.'),
    }),
  },
};
