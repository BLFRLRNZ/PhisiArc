// D04 · Quantità di moto e urti. Simulazione: gli urti (collide.js): due carrelli sul binario liscio, con un paraurti
// a molla (morbida o dura) o con il velcro. Le frecce viola sono la quantità di moto; la barra arancione l'energia
// di movimento; il grafico rosso la forza durante l'urto.
// La zona si apre con un mistero (il carrello che si ferma, come nel pendolo di Newton) e finisce con il mito di
// Vetrino «negli urti la quantità di moto si perde».
import { T } from '../util.js';

const M = (c) => ({ label: `Blocchi sul carrello ${c}`, min: 1, max: 6, step: 1, unit: 'kg' });

export default {
  id: 'D04',
  title: 'Quantità di moto e urti',
  levels: [
    {
      id: 'd04-1', kind: 'prevedi', title: 'Il carrello che si ferma',
      sim: 'collide', params: { m1: 2, m2: 2, v1: 6, bumper: 'molla', show: false }, controls: [],
      intro: T(
        'Ciao, sono Mela! Due carrelli sul binario liscio. Il blu corre e urta l’arancione, fermo. Che cosa succede? Prima indovina, poi guarda!',
        'Un urto fra due carrelli: il blu corre, l’arancione è fermo, e fra loro c’è un paraurti a molla. Prima di guardare, prevedi come ripartono.',
        'Nei pendoli di Newton sulle scrivanie, una biglia che urta ne fa partire un’altra dall’altra parte. Qui due carrelli: il blu corre, l’arancione aspetta. Che cosa succede?'),
      steps: [
        {
          kind: 'q', predict: [{ m1: 2, m2: 2, v1: 6 }],
          text: T('Stessi blocchi sui due carrelli. Dopo l’urto, che cosa fa il blu?', 'Masse uguali, 2 kg e 2 kg; il blu va a 6 m/s. Dopo l’urto, il blu…', 'Due carrelli uguali; il blu urta l’arancione fermo. Che fine fa il blu?'),
          options: [T('si ferma, e l’arancione parte', 'si ferma: l’arancione parte a 6 m/s', 'si ferma di colpo'), T('rimbalza indietro forte', 'rimbalza indietro a 6 m/s', 'rimbalza indietro'), T('va avanti attaccato all’arancione', 'prosegue a 3 m/s insieme all’arancione', 'continua più piano')],
          answer: 0,
          explain: T(
            'Si ferma! E l’arancione parte con la stessa velocità che aveva il blu. Come le biglie del pendolo!',
            'Il blu si ferma e l’arancione parte a 6 m/s: con masse uguali e una molla, i due carrelli si scambiano la velocità.',
            'Si ferma di colpo, e l’arancione parte al posto suo, alla stessa velocità. Come nel pendolo di Newton.'),
          solution: T('Il blu si ferma e l’arancione parte.'),
        },
        {
          kind: 'q', predict: [{ m1: 4, m2: 1, v1: 6 }],
          text: T('Ora il blu ha 4 blocchi, l’arancione solo 1. Dopo l’urto…', 'Blu 4 kg a 6 m/s, arancione 1 kg fermo. Dopo l’urto…', 'Un carrello pesante urta uno leggero, fermo. Che cosa succede?'),
          options: [T('vanno avanti tutti e due', 'tutti e due avanti, l’arancione più veloce', 'il pesante continua, più piano'), T('il blu si ferma', 'il blu si ferma e l’arancione parte a 6 m/s', 'il pesante si ferma di colpo'), T('il blu rimbalza indietro', 'il blu rimbalza e l’arancione schizza via', 'il pesante rimbalza indietro, piano')],
          answer: 0,
          explain: T(
            'Vanno avanti tutti e due! Il blu rallenta un po’, l’arancione leggero scappa veloce.',
            'Il blu prosegue a 3,6 m/s e l’arancione scatta a 9,6 m/s: il leggero va più veloce del blu di prima!',
            'Il pesante rallenta ma continua; il leggero schizza via, più veloce del pesante prima dell’urto.'),
          solution: T('Vanno avanti tutti e due.'),
        },
        {
          kind: 'q', predict: [{ m1: 1, m2: 4, v1: 6 }],
          text: T('E se il blu ha 1 blocco e l’arancione 4?', 'Blu 1 kg a 6 m/s, arancione 4 kg fermo. Dopo l’urto, il blu…', 'Ora è il leggero a urtare il pesante, fermo. Che cosa fa il leggero?'),
          options: [T('il blu rimbalza indietro', 'rimbalza indietro', 'rimbalza indietro'), T('il blu si ferma', 'si ferma', 'si ferma'), T('vanno avanti tutti e due', 'prosegue più piano', 'spinge avanti il pesante e lo segue')],
          answer: 0,
          explain: T(
            'Rimbalza indietro! L’arancione pesante parte, ma piano.',
            'Il blu rimbalza all’indietro a 3,6 m/s; l’arancione parte a 2,4 m/s. Come una palla contro un muro, ma il «muro» si muove un po’.',
            'Rimbalza, come una pallina contro un armadio. L’armadio, però, si muove un pochino.'),
          solution: T('Il blu rimbalza indietro.'),
        },
        {
          kind: 'q',
          text: T('Nell’urto il blu passa qualcosa all’arancione. Che cosa?', 'In tutti e tre gli urti il blu «passa» qualcosa all’arancione. Che cosa resta uguale, in tutto, prima e dopo?', 'In ogni urto qualcosa passa dal blu all’arancione, e il totale non cambia. Che cosa?'),
          options: [T('il suo movimento', 'la massa per la velocità, sommata', 'la quantità di moto'), T('il suo peso', 'la velocità sommata dei due carrelli', 'la velocità'), T('il suo colore, un po’', 'la massa', 'il peso dei blocchi')],
          answer: 0,
          explain: T(
            'Giusto: il movimento! Nella prossima lezione gli diamo un nome: quantità di moto.',
            'Esatto: la somma di massa per velocità, la <b>quantità di moto</b>. Quella che perde il blu la guadagna l’arancione.',
            'Esatto: la <b>quantità di moto</b>, massa per velocità. In un urto passa da un corpo all’altro, ma il totale resta lo stesso.'),
        },
      ],
      hints: [T('Guarda quanti blocchi ha ciascun carrello.', 'Pensa a che cosa succede alla velocità del blu e a quella dell’arancione.', 'Chi è più pesante, chi più leggero?')],
      solution: T(
        'Uguali: il blu si ferma. Blu pesante: avanti tutti e due. Blu leggero: rimbalza.',
        'Masse uguali: si scambiano la velocità; blu più pesante: avanti tutti e due; blu più leggero: rimbalza.',
        'Uguali, si scambiano il moto; il pesante continua, il leggero rimbalza.'),
    },
    {
      id: 'd04-2', kind: 'lezione', title: 'La quantità di moto',
      sim: 'collide', params: { m1: 2, m2: 2, v1: 6, bumper: 'molla', show: true }, controls: ['m1', 'm2', 'v1'], labels: { m1: M('blu'), m2: M('arancione') },
      intro: T(
        'Un carrello carico e veloce è difficile da fermare: ha tanta <b>quantità di moto</b>. Contala così: blocchi per velocità. Le frecce viola la mostrano.',
        'La <b>quantità di moto</b> di un corpo è p = m·v: massa per velocità, in kg·m/s. È un vettore, come la velocità. Negli urti la quantità di moto totale si conserva: quella che perde un carrello, la guadagna l’altro.',
        'Fermare una bici o un camion, alla stessa velocità: perché il camion è tanto più difficile? Conta massa per velocità: la quantità di moto. Le frecce viola la mostrano, prima e dopo l’urto. [[p = m · v]]'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Fai due urti cambiando i blocchi o la velocità. Guarda la freccia viola in alto.', 'Fai almeno due urti cambiando masse o velocità. Confronta la freccia in alto prima e dopo.') },
        {
          kind: 'q', review: false,
          text: T('La freccia viola in alto, dopo l’urto, è…', 'La quantità di moto totale, la freccia in alto, dopo l’urto è…', 'Guarda la freccia viola in alto: dopo l’urto, com’è?'),
          options: [T('lunga come prima', 'la stessa di prima', 'identica a prima'), T('più corta', 'più piccola: l’urto la consuma', 'più corta, consumata dall’urto'), T('più lunga, per la botta', 'più grande', 'più lunga')],
          answer: 0,
          explain: T(
            'Giusto: la quantità di moto passa da un carrello all’altro, ma in tutto resta uguale.',
            'Esatto: è la conservazione della quantità di moto: m₁·v₁ + m₂·v₂ prima = m₁·v₁′ + m₂·v₂′ dopo.',
            'Esatto: in tutto non cambia. Si sposta da un carrello all’altro, come soldi fra due tasche.'),
        },
        {
          kind: 'q',
          text: T('Un camion lento e una bici veloce. Chi è più difficile da fermare?', 'Chi ha più quantità di moto: un camion di 10 000 kg a 1 m/s o una bici con ciclista, 100 kg a 10 m/s?', 'Una petroliera che avanza piano piano ha bisogno di chilometri per fermarsi. Perché?'),
          options: [T('il camion, anche se lento', 'il camion: 10 000 contro 1000', 'ha un’enorme quantità di moto'), T('la bici, perché va veloce', 'la bici: è dieci volte più veloce', 'il motore è debole'), T('sono uguali', 'sono uguali', 'l’acqua la spinge avanti per sempre')],
          answer: 0,
          explain: T(
            'Giusto: il camion ha tantissima massa. Anche piano, ha più quantità di moto.',
            'Esatto: p = m·v: 10 000 × 1 = 10 000 kg·m/s per il camion, 100 × 10 = 1000 per la bici.',
            'Esatto: massa enorme, anche a bassa velocità, vuol dire quantità di moto enorme. E per toglierla serve una forza per molto tempo.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo con i carrelli.'),
          vals: { e: { m: [2, 3, 4], v: [3, 4, 5] }, s: { m: [2, 3, 5], v: [4, 6, 8] } },
          calc: 'm * v', unit: T('', 'kg·m/s'), tol: { e: 0, s: 0.01 },
          ask: T(
            'Quantità di moto = blocchi × velocità. Un carrello con <b>{m} blocchi</b> va a <b>{v} m/s</b>. Quanto vale?',
            'Un carrello di <b>{m} kg</b> viaggia a <b>{v} m/s</b>. Quanto vale la sua quantità di moto?',
            'Un carrello della spesa di <b>{m} kg</b> spinto a <b>{v} m/s</b>: quanta quantità di moto ha? [[p = m · v]]'),
          explain: T('Giusto: {m} per {v} fa {ans}.', 'Esatto: p = m·v = {m} × {v} = {ans} kg·m/s.', 'Esatto: {ans} kg·m/s. [[p = {m} × {v}]]'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La quantità di moto si conserva.'),
          vals: { m1: [2, 4], m2: [1, 2], v: [6] }, derive: { va: '(m1 - m2) / (m1 + m2) * v' }, calc: '(m1 * v - m1 * va) / m2', unit: 'm/s', tol: 0.05,
          ask: T(null,
            'Il blu ({m1} kg) a {v} m/s urta l’arancione ({m2} kg), fermo. Dopo l’urto il blu va a {va} m/s. A che velocità va l’arancione?',
            'Un carrello di {m1} kg a {v} m/s urta uno di {m2} kg, fermo, e rallenta a {va} m/s. Quanto va veloce l’altro, dopo? [[m₁ · v₁ = m₁ · v₁′ + m₂ · v₂′]]'),
          explain: T(null,
            'Esatto: la quantità di moto si conserva: {m1} × {v} = {m1} × {va} + {m2} × v₂′, quindi v₂′ = {ans} m/s.',
            'Esatto: {ans} m/s. Quello che il primo perde, lo prende il secondo. [[v₂′ = ({m1} × {v} − {m1} × {va}) / {m2}]]'),
        },
      ],
      hints: [T('Guarda la freccia viola in alto: cambia con l’urto?', 'p = m·v; la somma prima e dopo l’urto è la stessa.', 'Massa per velocità: quella che perde uno, la guadagna l’altro.')],
      solution: T(
        'Blocchi per velocità: in tutto resta uguale, prima e dopo l’urto.',
        'p = m·v; negli urti la quantità di moto totale si conserva.',
        'La quantità di moto passa da un carrello all’altro, ma il totale non cambia. [[p = m · v]]'),
    },
    {
      id: 'd04-3', kind: 'lezione', title: 'Urti appiccicosi',
      sim: 'collide', params: { m1: 1, m2: 1, v1: 6, bumper: 'velcro', show: true, energy: true }, controls: ['m1', 'm2', 'v1'], labels: { m1: M('blu'), m2: M('arancione') },
      intro: T(
        'Ora sul paraurti c’è il <b>velcro</b>: nell’urto i carrelli restano attaccati e vanno avanti insieme. Guarda le frecce viola e la barra arancione.',
        'Con il velcro i carrelli restano attaccati: è un <b>urto anelastico</b>. La quantità di moto si conserva anche qui: m₁·v₁ = (m₁ + m₂)·v′. Con la molla, invece, l’urto era <b>elastico</b>: si conservava anche l’energia di movimento.',
        'Due vagoni che si agganciano, un rugbista che placca un avversario e lo trascina: urti in cui i corpi restano insieme. La quantità di moto si conserva anche qui. Ma guarda la barra arancione…'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Fai due urti con il velcro, cambiando blocchi o velocità.', 'Fai almeno due urti con il velcro e guarda la barra dell’energia di movimento.') },
        {
          kind: 'q', review: false,
          text: T('Due carrelli uguali; il blu va a 6 m/s. Attaccati, a quanto vanno?', 'Masse uguali, il blu a 6 m/s, l’arancione fermo. Dopo l’urto con il velcro, insieme vanno a…', 'Due vagoni uguali; uno arriva a 6 m/s e aggancia l’altro, fermo. Insieme, quanto vanno?'),
          options: [T('a 3 m/s, la metà', '3 m/s', 'a 3 m/s'), T('a 6 m/s, come prima', '6 m/s', 'a 6 m/s'), T('fermi', '12 m/s', 'a 12 m/s')],
          answer: 0,
          explain: T(
            'Giusto: la stessa quantità di moto, ma su il doppio dei blocchi: metà velocità.',
            'Esatto: 2 × 6 = (2 + 2)·v′, quindi v′ = 3 m/s.',
            'Esatto: la stessa quantità di moto divisa su una massa doppia: metà velocità.'),
        },
        {
          kind: 'q', review: false,
          text: T('E la barra arancione dell’energia di movimento, dopo l’urto?', 'Con il velcro, l’energia di movimento dopo l’urto…', 'E la barra arancione, quella dell’energia di movimento?'),
          options: [T('si accorcia', 'cala: in parte diventa calore', 'si accorcia'), T('resta lunga uguale', 'resta la stessa: si conserva sempre', 'resta uguale'), T('si allunga', 'cresce', 'si allunga')],
          answer: 0,
          explain: T(
            'Giusto: un po’ di energia diventa calore e rumore, nell’urto. Ma la quantità di moto no: resta tutta!',
            'Esatto: da 36 J a 18 J. L’energia mancante è diventata calore, rumore e deformazione del velcro. La quantità di moto invece si conserva sempre.',
            'Esatto: metà dell’energia di movimento se n’è andata in calore, rumore e deformazione. La quantità di moto, invece, è tutta lì.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo con il velcro.'),
          vals: { e: { v: [4, 6, 8] }, s: { m1: [1, 2, 3], m2: [1, 2, 3], v: [6, 12] } },
          calc: { e: 'v / 2', s: 'm1 * v / (m1 + m2)' }, unit: 'm/s', tol: { e: 0, s: 0.05 },
          ask: T(
            'Due carrelli uguali con il velcro. Il blu arriva a <b>{v} m/s</b> e si attacca all’arancione fermo. A quanto vanno insieme?',
            'Il blu ({m1} kg) a <b>{v} m/s</b> si aggancia all’arancione ({m2} kg), fermo. A che velocità vanno insieme?',
            'Un carrello di <b>{m1} kg</b> a <b>{v} m/s</b> si aggancia a uno di <b>{m2} kg</b>, fermo. Quanto vanno veloci, insieme? [[v′ = m₁ · v / (m₁ + m₂)]]'),
          explain: T(
            'Giusto: metà di {v}, cioè {ans} m/s.',
            'Esatto: m₁·v = (m₁ + m₂)·v′, quindi v′ = {m1} × {v} / ({m1} + {m2}) ≈ {ans} m/s.',
            'Esatto: circa {ans} m/s. [[{m1} × {v} / ({m1} + {m2}) ≈ {ans} m/s]]'),
        },
        {
          kind: 'q',
          text: T('Due vagoni del treno si agganciano. Dopo, vanno…', 'In un incidente due auto restano incastrate. La quantità di moto totale, subito dopo l’urto…', 'Chi indaga sugli incidenti ricava la velocità delle auto dalle tracce dopo l’urto. Su che cosa si basa?'),
          options: [T('insieme, più piano', 'è uguale a quella di prima', 'sulla conservazione della quantità di moto'), T('ognuno per conto suo', 'è zero, perché poi si fermano', 'sulla conservazione dell’energia di movimento'), T('fermi', 'si dimezza', 'sul rumore dello schianto')],
          answer: 0,
          explain: T(
            'Giusto: attaccati, si muovono insieme, un po’ più piano.',
            'Esatto: subito dopo l’urto la quantità di moto totale è quella di prima. Si fermano solo dopo, per l’attrito con la strada.',
            'Esatto: la quantità di moto si conserva anche in un incidente, mentre l’energia di movimento no: buona parte finisce nelle lamiere accartocciate.'),
        },
      ],
      hints: [T('Con il velcro i carrelli vanno avanti insieme: guarda la freccia in alto.', 'm₁·v₁ = (m₁ + m₂)·v′.', 'Stessa quantità di moto, più massa: meno velocità.')],
      solution: T(
        'Attaccati vanno più piano; la quantità di moto resta, l’energia di movimento cala.',
        'Urto anelastico: v′ = m₁·v₁ / (m₁ + m₂); si conserva p, non l’energia cinetica.',
        'Restano insieme e rallentano: la quantità di moto si conserva, una parte dell’energia diventa calore.'),
    },
    {
      id: 'd04-4', kind: 'lezione', title: 'Paraurti morbidi e duri',
      sim: 'collide', params: { m1: 2, m2: 2, v1: 6, bumper: 'molla', k: 'dura', forza: true, show: false }, controls: ['k', 'v1'],
      labels: { v1: { label: 'Velocità del carrello blu', min: 2, max: 7, step: 1, unit: 'm/s' } },
      intro: T(
        'Un paraurti <b>morbido</b> fa durare l’urto un po’ di più: così la botta è meno forte. È il trucco degli airbag e dei caschi!',
        'Durante un urto la forza agisce per un tempo brevissimo, Δt. Il prodotto F·Δt si chiama <b>impulso</b> ed è uguale alla variazione della quantità di moto: F·Δt = Δp. Se l’urto dura di più, a parità di Δp la forza è più piccola. Il grafico sotto mostra la forza durante l’urto.',
        'Perché si piegano le ginocchia saltando giù da un muretto? Perché gli airbag salvano la vita? Allungare la durata di un urto ne riduce la forza. Il grafico sotto mostra la forza, istante per istante. [[F · Δt = Δp]]'),
      steps: [
        {
          kind: 'free',
          text: T('Fai un urto con il paraurti <b>duro</b> e uno con quello <b>morbido</b>. Guarda il grafico rosso.', 'Fai un urto con la molla dura e uno con la morbida, alla stessa velocità. Confronta i due grafici della forza.'),
          need: [
            { when: "k == 'dura'", try: { k: 'dura' }, msg: T('Prova anche il paraurti duro.', 'Manca un urto con la molla dura.') },
            { when: "k == 'morbida'", try: { k: 'morbida' }, msg: T('Ora prova il paraurti morbido.', 'Manca un urto con la molla morbida.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Con il paraurti morbido, la botta…', 'Con la molla morbida, rispetto alla dura, la forza massima…', 'Paraurti morbido contro paraurti duro. Che cosa cambia nel grafico?'),
          options: [T('è più debole', 'è più piccola', 'più bassa e più larga'), T('è più forte', 'è più grande', 'più alta e più stretta'), T('è proprio uguale', 'è uguale: cambia solo la durata', 'identica')],
          answer: 0,
          explain: T(
            'Giusto: con il paraurti morbido l’urto dura di più, e la botta è più debole.',
            'Esatto: Δp è lo stesso (l’arancione parte comunque a 6 m/s), ma con un Δt più lungo la forza F = Δp/Δt è più piccola.',
            'Esatto: la curva si abbassa e si allarga. L’area sotto la curva, l’impulso, è la stessa: la stessa spinta, distribuita su più tempo.'),
        },
        {
          kind: 'q',
          text: T('Perché le auto hanno l’airbag?', 'In un incidente l’airbag allunga il tempo in cui il passeggero si ferma. Che cosa ottiene?', 'Saltando giù da un muretto pieghi le ginocchia. Che cosa ottieni?'),
          options: [T('per una botta più morbida', 'una forza più piccola sul corpo', 'una forza più piccola sulle gambe'), T('per far andare l’auto più piano', 'una velocità finale più piccola del corpo', 'di cadere più piano'), T('per fare rumore', 'un impulso più piccolo', 'di toccare terra più tardi, e basta')],
          answer: 0,
          explain: T(
            'Giusto: l’airbag fa durare la frenata un po’ di più, e la botta fa molto meno male.',
            'Esatto: Δp è lo stesso (da v a zero), ma su un Δt più lungo: F = Δp/Δt diventa più piccola.',
            'Esatto: allunghi la frenata del tuo corpo, e la forza sulle gambe cala. Lo stesso fanno caschi, airbag e materassi del salto in alto.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Un uovo cade sul pavimento o su un cuscino. Dove si rompe?'),
          options: [T('sul pavimento'), T('sul cuscino'), T('in tutti e due i casi')],
          answer: 0,
          explain: T('Giusto: sul pavimento si ferma di colpo, e la botta è fortissima. Il cuscino allunga la frenata.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'L’uovo e il cuscino.'),
          vals: { dt: [0.01, 0.1] }, calc: '0.3 / dt', unit: 'N', tol: 0.05,
          ask: T(null,
            'Un uovo di 0,06 kg arriva a 5 m/s e si ferma in <b>{dt} s</b>. Quanto vale la forza media dell’urto? (Δp = 0,3 kg·m/s)',
            'Un uovo da 60 grammi arriva a 5 m/s e si ferma in <b>{dt} secondi</b>. Che forza media subisce? [[Δp = 0,06 × 5 = 0,3 kg·m/s; F = Δp / Δt]]'),
          explain: T(null,
            'Esatto: F = Δp/Δt = 0,3 / {dt} = {ans} N. Sul pavimento (0,01 s) si rompe; su un cuscino (0,1 s) forse no!',
            'Esatto: circa {ans} newton. Sul pavimento l’uovo si ferma in un centesimo di secondo; sul cuscino in un decimo. [[F = 0,3 / {dt} = {ans} N]]'),
        },
      ],
      hints: [T('Confronta l’altezza e la larghezza delle due curve rosse.', 'F·Δt = Δp: con Δt più lungo, F più piccola.', 'Stessa spinta totale, distribuita su più tempo.')],
      solution: T(
        'Il paraurti morbido allunga l’urto e fa la botta più debole.',
        'Con Δp fisso, F = Δp/Δt: più tempo, meno forza.',
        'Allungare un urto ne riduce la forza: è il segreto di airbag, caschi e ginocchia piegate. [[F · Δt = Δp]]'),
    },
    {
      id: 'd04-5', kind: 'costruisci', title: 'Gli autoscontri',
      sim: 'collide', params: { m1: 1, m2: 3, v1: 4, bumper: 'molla', k: 'dura', show: true }, controls: ['v1'],
      labels: { v1: { label: 'Velocità dell’autoscontro blu', min: 1, max: 12, step: 1, unit: 'm/s' } },
      intro: T(
        'Nuovo gioco per il parco: gli <b>autoscontri</b>! L’autoscontro blu urta quello arancione, fermo: scegli quanto veloce deve andare il blu.',
        'Nuovo pezzo del parco: gli autoscontri. Il blu urta l’arancione fermo con un paraurti a molla, e l’arancione deve partire alla velocità giusta. Scegli la velocità del blu.',
        'Nuovo pezzo del parco: gli autoscontri, dove gli urti sono il divertimento. Un urto ben calibrato fa partire l’arancione alla velocità giusta, né piano né troppo forte.'),
      piece: { id: 'autoscontri', name: 'Gli autoscontri', desc: 'Il blu urta l’arancione e lo fa partire alla velocità giusta: la quantità di moto passa dall’uno all’altro.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la velocità del blu e lancia.', 'Regola la velocità del blu: l’arancione deve partire alla velocità richiesta. Nella seconda prova cambiano i carichi.'),
          vals: { e: { v: [[3], [4]], a: [[1], [1]], b: [[3], [3]] }, s: { v: [[3, 4], [5, 6]], a: [[1], [2]], b: [[3], [2]] } },
          set: { m1: 'a', m2: 'b' },
          ask: T(
            'Il blu ha <b>1 blocco</b>, l’arancione <b>3</b>. Dopo l’urto l’arancione deve partire a <b>{v} m/s</b>.',
            'Blu: <b>{a} kg</b>; arancione: <b>{b} kg</b>, fermo. Dopo l’urto l’arancione deve partire a <b>{v} m/s</b>.',
            'Il blu porta <b>{a} kg</b>, l’arancione <b>{b} kg</b>. Dopo l’urto l’arancione deve andare a <b>{v} m/s</b>.'),
          measure: 'v2[0]', goal: 'v', tol: { e: 0.3, s: 0.2 },
          ok: T('{got:1} m/s: urto perfetto!'),
          high: T('{got:1} m/s: troppo forte! Il blu più piano.', '{got:1} m/s: troppo. Rallenta il blu.'),
          low: T('{got:1} m/s: troppo piano. Il blu più veloce!', '{got:1} m/s: troppo poco. Il blu deve andare più forte.'),
          // urto elastico: v₂′ = 2·m₁/(m₁ + m₂) · v₁
          solve: { v1: 'v * (a + b) / (2 * a)' },
        },
      ],
      hints: [
        T('Più forte va il blu, più forte parte l’arancione.', 'Urto elastico: v₂′ = 2·m₁/(m₁ + m₂) · v₁.', 'Il blu leggero passa all’arancione solo una parte della sua velocità.'),
        T('Il blu leggero deve andare al doppio della velocità richiesta.', 'Con 1 kg contro 3 kg, v₂′ = v₁/2; con masse uguali v₂′ = v₁.', 'Con 1 kg contro 3, serve il doppio; con masse uguali, la stessa velocità.'),
      ],
      solution: T('3 m/s: blu a 6. 4 m/s: blu a 8.', 'v₁ = v₂′·(m₁ + m₂)/(2·m₁): 1 kg contro 3 kg → il doppio; masse uguali → la stessa.', 'Con il blu leggero serve il doppio della velocità; con masse uguali, la stessa.'),
    },
    {
      id: 'd04-6', kind: 'ripasso', title: 'Ripasso degli urti',
      intro: T('Ripassiamo: urti, rimbalzi e botte morbide!', 'Ripasso: quantità di moto, urti elastici e anelastici, impulso.', 'Ripasso: la quantità di moto nelle cose di tutti i giorni.'),
      steps: [
        {
          kind: 'q',
          text: T('Un cannone spara una palla in avanti. Che cosa fa il cannone?', 'Un cannone di 1000 kg spara una palla di 10 kg a 100 m/s. Con che velocità rincula?', 'Perché un fucile «dà un calcio» nella spalla quando spara?'),
          options: [T('va un po’ indietro', '1 m/s all’indietro', 'la quantità di moto si conserva'), T('va avanti con la palla', '100 m/s', 'il calore dello sparo dilata il calcio'), T('resta fermo', 'zero: è troppo pesante', 'il proiettile lo tira')],
          answer: 0,
          explain: T(
            'Giusto: la palla va avanti, il cannone indietro. In tutto, la quantità di moto resta zero!',
            'Esatto: prima tutto è fermo, p = 0; dopo, 10 × 100 = 1000 kg·m/s in avanti e 1000 × 1 all’indietro. È anche azione e reazione!',
            'Esatto: prima dello sparo tutto è fermo; dopo, il proiettile va avanti e il fucile indietro, e le due quantità di moto si annullano.'),
        },
        {
          kind: 'q',
          text: T('A biliardo, una biglia colpisce in pieno un’altra uguale, ferma. Che cosa succede?', 'A biliardo, un colpo pieno fra due biglie uguali: la prima si ferma. Perché la seconda parte proprio con la sua velocità?', 'Il «colpo secco» del biliardo: la biglia bianca si ferma e la colorata parte. Che cosa si è passato?'),
          options: [T('la prima si ferma', 'si conservano p ed energia', 'tutta la quantità di moto'), T('rimbalzano tutte e due indietro', 'la seconda è più leggera della prima', 'solo un po’ della sua velocità'), T('vanno avanti insieme', 'il panno del tavolo la spinge', 'il colore')],
          answer: 0,
          explain: T(
            'Giusto: la prima si ferma e la seconda parte veloce come lei. Come i carrelli uguali!',
            'Esatto: con masse uguali, l’urto elastico che conserva p ed energia dà v₁′ = 0 e v₂′ = v₁.',
            'Esatto: tutta la quantità di moto della bianca passa alla colorata.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.'),
          vals: { e: { m: [3, 4], v: [2, 5] }, s: { m1: [2, 3], m2: [1, 3], v: [4, 8] } },
          calc: { e: 'm * v', s: 'm1 * v / (m1 + m2)' }, unit: T('', 'm/s'), tol: { e: 0, s: 0.05 },
          ask: T(
            'Un carrello con <b>{m} blocchi</b> va a <b>{v} m/s</b>. Quanto vale la sua quantità di moto (blocchi × velocità)?',
            'Un carrello di <b>{m1} kg</b> a <b>{v} m/s</b> si aggancia a uno di <b>{m2} kg</b>, fermo. A che velocità vanno insieme?',
            'Un vagone di <b>{m1} t</b> a <b>{v} m/s</b> si aggancia a uno di <b>{m2} t</b>, fermo. Quanto vanno veloci, insieme? [[v′ = m₁ · v / (m₁ + m₂)]]'),
          explain: T('Giusto: {m} per {v} fa {ans}.', 'Esatto: v′ = m₁·v/(m₁ + m₂) ≈ {ans} m/s.', 'Esatto: circa {ans} m/s. [[{m1} × {v} / ({m1} + {m2})]]'),
        },
        {
          kind: 'q',
          text: T('Per prendere una palla forte senza farti male, che cosa fai con le mani?', 'Il portiere, per bloccare un tiro forte, accompagna la palla tirando indietro le braccia. Perché?', 'Perché i trampolini dei tuffi e i materassi del salto con l’asta sono così morbidi?'),
          options: [T('le porto indietro', 'allunga Δt e la forza cala', 'allungano la frenata'), T('le tengo ferme e dure', 'riduce la variazione Δp della palla', 'fanno rimbalzare più in alto, sempre'), T('le spingo avanti, contro la palla', 'aumenta l’impulso', 'fanno pesare meno')],
          answer: 0,
          explain: T(
            'Giusto: portando indietro le mani, la palla si ferma più piano, e fa meno male.',
            'Esatto: Δp della palla è lo stesso, ma su un Δt più lungo: F = Δp/Δt diventa più piccola.',
            'Esatto: frenare più a lungo vuol dire frenare con meno forza. Le ossa ringraziano.'),
        },
        {
          kind: 'q',
          text: T('Due carrelli si attaccano con il velcro. Che cosa resta uguale, prima e dopo?', 'In un urto anelastico, che cosa si conserva?', 'Quando due corpi si scontrano e restano attaccati, che cosa non si perde mai?'),
          options: [T('la quantità di moto', 'solo la quantità di moto', 'la quantità di moto'), T('l’energia di movimento', 'solo l’energia cinetica, tutta', 'l’energia di movimento'), T('la velocità del blu', 'nessuna delle due', 'la velocità')],
          answer: 0,
          explain: T(
            'Giusto: la quantità di moto resta sempre. L’energia di movimento, invece, in parte diventa calore.',
            'Esatto: la quantità di moto si conserva in ogni urto; l’energia cinetica solo in quelli elastici.',
            'Esatto: la quantità di moto non si perde mai; l’energia di movimento sì, in parte, quando i corpi si deformano.'),
        },
      ],
      hints: [T('Ripensa ai carrelli: molla, velcro, paraurti morbido.')],
    },
    {
      id: 'd04-7', kind: 'boss', title: 'Il mito dell’urto che consuma',
      sim: 'collide', params: { m1: 2, m2: 2, v1: 6, bumper: 'velcro', show: true, energy: true }, controls: [],
      intro: T(
        'Sono Vetrino. Guarda: dopo l’urto i carrelli attaccati vanno più piano! Allora negli urti il movimento si consuma. Vero o no?',
        'Sono Vetrino. Il mito: <i>“negli urti la quantità di moto si perde: i carrelli agganciati vanno più piano di prima”</i>. Sembra evidente. Ma che cosa si perde davvero?',
        'Sono Vetrino. Dicono: <i>“in ogni urto qualcosa si consuma, e infatti tutto rallenta”</i>. Qualcosa si consuma davvero. Ma che cosa?'),
      steps: [
        {
          kind: 'q',
          text: T('Per controllare, che cosa guardi prima e dopo l’urto?', 'Che cosa devi misurare, prima e dopo, per mettere alla prova il mito?', 'Per smentire o confermare il mito, che cosa confronti prima e dopo l’urto?'),
          options: [T('blocchi per velocità, in tutto', 'm₁·v₁ + m₂·v₂, la somma', 'la quantità di moto totale'), T('solo la velocità del blu, prima e dopo', 'solo la velocità del blu', 'la velocità di un solo carrello'), T('quanto dura l’urto', 'la durata dell’urto', 'il rumore dell’urto')],
          answer: 0,
          explain: T(
            'Giusto: conta il totale, blocchi per velocità, di tutti e due i carrelli.',
            'Esatto: la quantità di moto totale, la somma di massa per velocità dei due carrelli.',
            'Esatto: il totale. Guardare un solo carrello inganna: la quantità di moto passa dall’uno all’altro.'),
          wrong: T('Un solo carrello ti racconta metà della storia. E l’altro?', 'Guardando un carrello solo, dove finisce quello che perde?'),
        },
        {
          kind: 'q', clear: true, predict: [{ bumper: 'velcro', m1: 2, m2: 2, v1: 6 }],
          text: T('Carrelli uguali, velcro, il blu a 6 m/s. Dopo l’urto, la freccia viola in alto…', 'Velcro, masse uguali, il blu a 6 m/s. Dopo l’urto, la quantità di moto totale…', 'Velcro, due carrelli uguali, il blu lanciato a 6 m/s. E la quantità di moto totale, dopo?'),
          options: [T('resta lunga uguale', 'resta 12 kg·m/s', 'resta la stessa'), T('diventa la metà', 'si dimezza: 6 kg·m/s', 'si dimezza'), T('sparisce', 'diventa zero', 'cresce, per la botta')],
          answer: 0,
          explain: T(
            'Resta uguale! Vanno più piano, è vero, ma sono il doppio dei blocchi.',
            'Resta 12: prima 2 × 6, dopo (2 + 2) × 3. La velocità si dimezza perché la massa raddoppia.',
            'Resta la stessa: velocità dimezzata, ma massa doppia. Il conto torna.'),
          solution: T('Resta uguale.'),
        },
        {
          kind: 'q', predict: [{ bumper: 'velcro', m1: 3, m2: 1, v1: 4 }],
          text: T('Ora il blu ha 3 blocchi e va a 4 m/s; l’arancione ha 1 blocco. Attaccati, a quanto vanno?', 'Blu 3 kg a 4 m/s, arancione 1 kg fermo, velcro. Che velocità hanno dopo l’urto?', 'Un carrello da 3 kg a 4 m/s aggancia uno da 1 kg. Insieme, quanto vanno?'),
          options: [T('3 m/s'), T('2 m/s'), T('4 m/s')],
          answer: 0,
          explain: T(
            'A 3 m/s! Blocchi per velocità: 3 × 4 = 12 prima, 4 × 3 = 12 dopo.',
            'v′ = 3 × 4 / (3 + 1) = 3 m/s: la quantità di moto è 12 prima e 12 dopo.',
            'Tre metri al secondo: 12 prima, 12 dopo. Il mito non regge.'),
          solution: T('3 m/s.'),
        },
        {
          kind: 'q',
          text: T('Allora che cosa si consuma, nell’urto con il velcro?', 'Che cosa diminuisce davvero, nell’urto con il velcro?', 'E allora che cosa si «consuma» davvero, in un urto così?'),
          options: [T('un po’ di energia', 'l’energia cinetica', 'energia di movimento'), T('la quantità di moto', 'la quantità di moto, un po’', 'quantità di moto, un pochino'), T('niente', 'la massa', 'massa')],
          answer: 0,
          explain: T(
            'Giusto: un po’ di energia diventa calore e rumore. La quantità di moto, invece, resta tutta.',
            'Esatto: l’energia cinetica passa da 36 J a 18 J; la parte mancante è diventata calore e deformazione. La quantità di moto no.',
            'Esatto: si consuma energia di movimento, che diventa calore. Il mito confondeva due cose diverse.'),
        },
        {
          kind: 'q',
          text: T('Il mito dice: «negli urti la quantità di moto si perde». È vero?', 'Il mito: «negli urti la quantità di moto si perde». Che cosa concludi?', '«Negli urti la quantità di moto si perde»: dopo l’esperimento, che cosa ne pensi?'),
          options: [T('no: resta uguale', 'falso: si conserva sempre', 'falso: è l’energia che si perde'), T('sì: vanno più piano', 'vero: la velocità cala', 'vero: tutto rallenta'), T('sì, ma poco', 'vero solo negli urti anelastici', 'vero in parte: perde un pochino')],
          answer: 0,
          explain: T(
            'Mito smontato! Vanno più piano, ma sono più pesanti: la quantità di moto resta tutta.',
            'Mito smontato: la quantità di moto si conserva in ogni urto. Si perde energia cinetica, ed è quella che il mito confondeva.',
            'Mito smontato: la quantità di moto non si perde mai. Quello che si consuma è energia, che diventa calore.'),
        },
      ],
      hints: [T('Vetrino chiede: hai contato i blocchi, oltre alla velocità?'), T('Vetrino chiede: la barra arancione e la freccia viola fanno la stessa cosa?')],
      solution: T(
        'La quantità di moto resta uguale: più blocchi, meno velocità. Si perde un po’ di energia.',
        'p si conserva in ogni urto; nell’urto anelastico si perde energia cinetica: il mito è falso.',
        'Si conserva la quantità di moto, si perde energia: il mito è falso.'),
    },
  ],
};
