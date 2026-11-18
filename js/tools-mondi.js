// Gli attrezzi di fisica dei mondi dopo l'Officina: uno scaffale per mondo (world), con le leggi che le zone usano.
// Come quelli dell'Officina (tools.js) non interrompono mai: si offrono con un bottone sotto i testi che ne parlano,
// solo nelle lenti con le formule. Ogni scheda ha la spiegazione, un disegno da muovere e una domanda; il piccolo film
// arriverà con l'ampliamento della cassetta (toolfilm.js: chi non ha ancora un film mostra la scheda senza).
import { h } from './util.js';
import { t as tr } from './i18n.js';
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
};
