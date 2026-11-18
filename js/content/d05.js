// D05 · Rotazioni ed equilibrio. Due simulazioni:
//   - la leva (lever.js): un'asse sul fulcro con un carico per parte; tolti i fermi, scende il lato dove
//     peso × distanza dal fulcro (il momento) è più grande. Con ends, i carichi stanno ai capi e si sposta il fulcro.
//   - la pedana (tilt.js): un oggetto sulla pedana che si inclina; si ribalta quando la verticale del baricentro
//     esce dalla base d'appoggio.
// La zona si apre con un esperimento (l'altalena a bilico da mettere in equilibrio, prima di ogni spiegazione)
// e finisce con l'esperimento al buio di Bilancia: la scatola coperta, da pesare con i blocchi e l'altalena.
import { T } from '../util.js';

export default {
  id: 'D05',
  title: 'Rotazioni ed equilibrio',
  levels: [
    {
      id: 'd05-1', kind: 'costruisci', title: 'L’altalena a bilico',
      sim: 'lever', params: { m1: 20, d1: 3, m2: 60, d2: 2, w1: 'bimbo', w2: 'adulto', names: ['Bea', 'Leo'], panel: false, arms: true, flabel: true }, controls: ['d2'],
      labels: { d2: { label: 'Distanza del secondo dal fulcro', min: 0.5, max: 3, step: 0.5, unit: 'm' } },
      intro: T(
        'Nuovo gioco per il parco: l’<b>altalena a bilico</b>! Un bambino per parte e, in mezzo, il <b>fulcro</b>: il punto su cui l’asse gira. Scegli dove si siede il secondo bambino: l’altalena deve restare dritta, in <b>equilibrio</b>.',
        'Nuovo pezzo del parco: l’altalena a bilico, un’asse appoggiata su un <b>fulcro</b>. Prima di ogni spiegazione, un esperimento: trova dove deve sedersi il secondo bambino perché l’asse, tolti i fermi, resti in <b>equilibrio</b>.',
        'Il primo gioco di fisica che tutti abbiamo capito senza libri: l’altalena a bilico. Chi pesa di più si siede più vicino al <b>fulcro</b>, il punto su cui l’asse gira. Ma quanto più vicino? Trovalo provando: l’asse deve restare in <b>equilibrio</b>.'),
      piece: { id: 'bilico', name: 'L’altalena a bilico', desc: 'Due bambini di peso diverso in equilibrio: il più pesante si siede più vicino al fulcro.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli dove si siede il secondo bambino, poi premi Lancia: i fermi si tolgono.', 'Regola la distanza del secondo bambino dal fulcro, poi togli i fermi: l’asse deve restare in equilibrio. Nella seconda prova cambiano i bambini.'),
          vals: {
            e: { a: [[20], [30]], d: [[3], [2]], b: [[60], [20]], n1: [['Bea'], ['Ada']], n2: [['Leo'], ['Teo']], w: [['adulto'], ['bimbo']] },
            s: { a: [[20, 30], [30, 45]], d: [[3], [2]], b: [[60], [30]], n1: [['Bea'], ['Ada']], n2: [['Leo'], ['Teo']], w: [['adulto'], ['bimbo']] },
          },
          set: { m1: 'a', d1: 'd', m2: 'b', names: '[n1, n2]', w2: 'w' },
          ask: T(
            '<b>{n1}</b> pesa {a} kg ed è a {d} m dal fulcro. <b>{n2}</b> pesa {b} kg: dove si siede?',
            '{n1}: <b>{a} kg</b>, a <b>{d} m</b> dal fulcro. {n2}: <b>{b} kg</b>. A che distanza dal fulcro deve sedersi {n2}?',
            '{n1}, <b>{a} kg</b>, siede a <b>{d} m</b> dal fulcro. Dove deve sedersi {n2}, che pesa <b>{b} kg</b>?'),
          measure: 'net', goal: '0', tol: 0.01,
          ok: T('In equilibrio! L’altalena resta dritta.'),
          high: T('Scende {n2}: avvicinalo al fulcro.', 'Scende il lato di {n2}: avvicinalo al fulcro.'),
          low: T('Scende {n1}: allontana {n2} dal fulcro.', 'Scende il lato di {n1}: sposta {n2} più lontano dal fulcro.'),
          solve: { d2: 'a * d / b' },
        },
      ],
      hints: [
        T('Chi pesa di più si siede più vicino al fulcro.', 'Se scende il lato del secondo bambino, avvicinalo al fulcro; se scende l’altro, allontanalo.', 'Il più pesante va verso il fulcro, il più leggero verso il capo dell’asse.'),
        T('Chi pesa il triplo si siede a un terzo della distanza.', 'Moltiplica peso e distanza dal fulcro per tutti e due i bambini: che cosa noti?', 'Il triplo del peso vuole un terzo della distanza.'),
      ],
      solution: T(
        '20 kg a 3 m e 60 kg a 1 m: 20 × 3 fa 60, come 60 × 1. Poi 30 kg a 2 m e 20 kg a 3 m: 60 e 60.',
        'L’asse è in equilibrio quando peso × distanza è uguale dalle due parti: d₂ = m₁·d₁/m₂.',
        'Peso per distanza, uguale dalle due parti: il triplo del peso vuole un terzo della distanza. [[d₂ = m₁ · d₁ / m₂]]'),
    },
    {
      id: 'd05-2', kind: 'lezione', title: 'Il segreto dell’altalena',
      sim: 'lever', params: { m1: 20, d1: 3, m2: 60, d2: 1.5, w1: 'bimbo', w2: 'adulto', names: ['Bea', 'Leo'], panel: true, arms: true, weights: true, flabel: true },
      controls: ['m1', 'd1', 'm2', 'd2'],
      labels: {
        m1: { label: 'Peso di Bea', min: 10, max: 40, step: 5, unit: 'kg' },
        d1: { label: 'Distanza di Bea dal fulcro', min: 0.5, max: 3, step: 0.5, unit: 'm' },
        m2: { label: 'Peso di Leo', min: 20, max: 80, step: 5, unit: 'kg' },
        d2: { label: 'Distanza di Leo dal fulcro', min: 0.5, max: 3, step: 0.5, unit: 'm' },
      },
      intro: T(
        'Ecco il segreto dell’altalena: conta <b>peso × distanza</b> dal fulcro. Il lato con il numero più grande scende. Se i due numeri sono uguali, l’altalena sta in equilibrio. Il riquadro in alto fa il conto per te.',
        'Una forza fa <b>girare</b> un corpo intorno al fulcro tanto più quanto è grande e quanto è lontana dal fulcro. Si misura con il <b>momento della forza</b>: M = F·b, la forza per il <b>braccio</b> (la distanza dal fulcro), in N·m. Qui la forza è il peso, F = m·g. L’asse è in equilibrio quando i momenti dei due lati sono uguali.',
        'Perché la maniglia sta dalla parte opposta ai cardini? Perché un bullone duro si svita impugnando la chiave in fondo? Per far girare qualcosa conta la forza, ma anche quanto lontano dal perno la usi: forza per distanza, il <b>momento della forza</b>. [[M = F · b]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Fai due prove: cambia i pesi o le distanze, e guarda i numeri nel riquadro in alto.', 'Fai almeno due prove cambiando pesi e distanze: confronta i due momenti nel riquadro e guarda da che parte gira l’asse.'),
        },
        {
          kind: 'q',
          text: T('Bea, 20 kg, a 3 m. Leo, 60 kg, a 1 m. Che cosa succede?', 'Bea (20 kg) è a 3 m dal fulcro, Leo (60 kg) a 1 m. Che cosa si può dire dei due momenti?', 'Una bambina di 20 kg a 3 m dal fulcro, un ragazzo di 60 kg a 1 m. Chi fa scendere il suo lato?'),
          options: [T('stanno in equilibrio', 'sono uguali: 588 N·m tutti e due', 'nessuno dei due: sono in equilibrio'), T('scende il lato di Leo', 'quello di Leo è il triplo', 'il ragazzo, che pesa il triplo'), T('scende il lato di Bea', 'quello di Bea è il triplo', 'la bambina, che è più lontana')],
          answer: 0,
          explain: T(
            'Giusto! 20 × 3 fa 60, e 60 × 1 fa 60: numeri uguali, altalena in equilibrio.',
            'Esatto: 196 N × 3 m = 588 N·m, e 588 N × 1 m = 588 N·m. Momenti uguali: equilibrio.',
            'Esatto: nessuno. Il ragazzo pesa il triplo, ma la bambina sta tre volte più lontana: i due effetti si pareggiano.'),
        },
        {
          kind: 'q',
          text: T('Leo resta uguale, ma si sposta più lontano dal fulcro. Il suo lato…', 'Lasci uguale una forza e ne raddoppi il braccio. Il momento…', 'Devi aprire una porta pesante. Dove conviene spingere?'),
          options: [T('scende', 'raddoppia', 'lontano dai cardini'), T('sale', 'resta uguale', 'vicino ai cardini'), T('non si muove', 'si dimezza', 'nel mezzo della porta')],
          answer: 0,
          explain: T(
            'Giusto: più lontano dal fulcro, più il peso fa girare l’altalena dalla sua parte.',
            'Esatto: M = F·b. Con il braccio doppio, il momento è doppio.',
            'Esatto: lontano dai cardini lo stesso sforzo fa girare la porta molto di più. Per questo la maniglia sta lì.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Tre blocchi da 1 kg, a 2 m dal fulcro. Quanto fa peso × distanza?'),
          options: [T('6'), T('5'), T('9')],
          answer: 0,
          explain: T('Giusto: 3 kg per 2 m fa 6.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Calcola il momento di una forza.'),
          vals: { F: [100, 150, 200], b: [0.5, 1.5, 2] }, calc: 'F * b', unit: 'N·m', tol: 0.5,
          ask: T(null,
            'Una forza di <b>{F} N</b> spinge a <b>{b} m</b> dal fulcro, perpendicolare all’asse. Quanto vale il suo momento?',
            'Spingi una porta con <b>{F} N</b>, a <b>{b} m</b> dai cardini. Quanto vale il momento che le dai? [[M = F · b]]'),
          explain: T(null, 'Esatto: M = F·b = {F} × {b} = {ans} N·m.', 'Esatto: {ans} N·m. [[M = {F} × {b} = {ans} N·m]]'),
        },
        {
          kind: 'q',
          text: T('Un bullone duro non si svita. Dove impugni la chiave?', 'Con la chiave inglese spingi con 50 N a 0,3 m dal bullone. Se impugni a 0,6 m, che forza dà lo stesso momento?', 'Un bullone arrugginito non si svita. Che cosa ti aiuta di più?'),
          options: [T('in fondo al manico', '25 N', 'una chiave con il manico più lungo'), T('vicino al bullone', '50 N', 'una chiave più pesante, di ferro'), T('in mezzo al manico', '100 N', 'spingere a scatti, vicino al bullone')],
          answer: 0,
          explain: T(
            'Giusto: in fondo al manico la tua forza fa girare il bullone molto di più.',
            'Esatto: 50 N × 0,3 m = 15 N·m; a 0,6 m bastano 15 / 0,6 = 25 N. Braccio doppio, metà forza.',
            'Esatto: il manico lungo allunga il braccio. Con la stessa forza dai un momento più grande, e il bullone cede.'),
        },
      ],
      hints: [T('Moltiplica il peso per la distanza dal fulcro, per i due lati.', 'M = F·b: la forza (qui il peso, m·g) per il braccio.', 'Forza per distanza dal perno: chi ha il prodotto più grande fa girare.')],
      solution: T(
        'Per esempio Bea, 20 kg, a 3 m e Leo, 60 kg, a 1 m: 20 × 3 e 60 × 1 fanno tutti e due 60. Equilibrio!',
        'Equilibrio quando M₁ = M₂: per esempio 196 N × 3 m = 588 N × 1 m = 588 N·m.',
        'Per esempio 20 kg a tre metri e 60 kg a un metro: momenti uguali, asse in equilibrio.'),
    },
    {
      id: 'd05-3', kind: 'lezione', title: 'La leva di Archimede',
      sim: 'lever', params: { ends: true, L: 7, f: 3, m1: 100, m2: 20, w1: 'masso', w2: 'bimbo', names: ['Masso', 'Bea'], say: ['scende il masso', 'il masso si alza!'], Hf: 1, panel: true, arms: true, flabel: true },
      controls: ['f'],
      labels: { f: { label: 'Distanza del fulcro dal masso', min: 0.5, max: 3.5, step: 0.5, unit: 'm' } },
      intro: T(
        'Bea pesa 20 kg, il masso 100 kg! Con un’asse lunga e un fulcro, però, Bea può sollevarlo. Questa asse è una <b>leva</b>. Sposta il fulcro e prova.',
        'Una <b>leva</b> è un’asta rigida che gira intorno a un fulcro: l’altalena è una leva. Con una leva una forza piccola può sollevare un peso grande, purché abbia il braccio lungo. Bea (20 kg) è a un capo dell’asse, lunga 7 m; il masso (100 kg) è all’altro capo. Dove va il fulcro?',
        '«Datemi un punto d’appoggio e solleverò il mondo»: così si racconta di Archimede. Esagerava, ma non troppo. Con una <b>leva</b> abbastanza lunga, una bambina solleva un masso che pesa cinque volte lei. Tutto sta nel fulcro.'),
      steps: [
        {
          kind: 'free',
          text: T('Sposta il fulcro e togli i fermi. Riesci a far alzare il masso?', 'Trova una posizione del fulcro in cui Bea solleva il masso, e una in cui non ci riesce.'),
          need: [
            { when: "r.dir == 'sinistra'", try: { f: 3 }, msg: T('Prova anche con il fulcro lontano dal masso: che cosa succede?') },
            { when: "r.dir == 'destra'", try: { f: 1 }, msg: T('Il masso non si alza ancora: sposta il fulcro verso il masso.', 'Il masso non si alza: avvicina il fulcro al masso.') },
          ],
        },
        {
          kind: 'q',
          text: T('Per sollevare il masso, dove va il fulcro?', 'Perché Bea solleva il masso solo con il fulcro vicino a lui?', 'Con il fulcro vicino al masso, Bea ce la fa. Qual è il trucco?'),
          options: [T('vicino al masso', 'il braccio di Bea diventa lungo', 'Bea spinge con un braccio lunghissimo'), T('vicino a Bea', 'Bea scende più veloce e spinge di più', 'il masso perde un po’ del suo peso'), T('proprio in mezzo', 'il masso diventa più leggero', 'l’asse si piega come una molla e aiuta Bea')],
          answer: 0,
          explain: T(
            'Giusto! Con il fulcro a 1 m dal masso, Bea sta a 6 m: 20 × 6 fa 120, più di 100 × 1.',
            'Esatto: con il fulcro a 1 m, il braccio di Bea è 6 m e quello del masso 1 m. Il momento di Bea (196 N × 6 m ≈ 1180 N·m) batte quello del masso (980 N × 1 m = 980 N·m).',
            'Esatto: i pesi non cambiano, cambiano i bracci. Sei metri contro uno: la bambina vince.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Il fulcro è a 1 m dal masso. Quanto fa, per Bea, 20 × 6?'),
          options: [T('120'), T('26'), T('100')],
          answer: 0,
          explain: T('Giusto: 120, più dei 100 del masso (100 × 1). Per questo il masso si alza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Calcola la forza che serve con una leva.'),
          vals: { L: [2], a: [0.4, 0.5], P: [600, 900] }, derive: { bF: 'L - a' }, calc: 'P * a / (L - a)', unit: 'N', tol: 0.5,
          ask: T(null,
            'Una sbarra lunga <b>{L} m</b> appoggia su un fulcro a <b>{a} m</b> da un capo, dove c’è un peso di <b>{P} N</b>. Che forza serve all’altro capo per tenerlo in equilibrio?',
            'Un piede di porco lungo <b>{L} m</b>, con il fulcro a <b>{a} m</b> dalla punta, sotto una cassa che preme con <b>{P} N</b>. Quanta forza serve sul manico? [[F · (L − a) = P · a]]'),
          explain: T(null, 'Esatto: F·{bF} = {P}·{a}, quindi F = {P} × {a} / {bF} = {ans} N.', 'Esatto: circa {ans} N. [[F = {P} × {a} / {bF}]]'),
        },
        {
          kind: 'q',
          text: T('Bea scende di tanto. E il masso, di quanto sale?', 'Con il fulcro a 1 m, Bea scende di 60 cm e il masso sale di 10 cm. Che cosa vuol dire?', 'Allora la leva fa risparmiare fatica?'),
          options: [T('di poco', 'meno forza, ma per più strada', 'fa usare meno forza, per più strada'), T('di tanto anche lui', 'più forza, ma per meno strada', 'sì: con la leva l’energia si moltiplica'), T('non sale per niente', 'la leva crea energia in più', 'no: serve sempre la stessa forza')],
          answer: 0,
          explain: T(
            'Giusto: il masso sale solo un pochino. La leva aiuta, ma Bea deve fare tanta strada.',
            'Esatto: Bea scende sei volte più di quanto sale il masso. La leva riduce la forza, non il lavoro (L = F·s): niente energia gratis.',
            'Esatto: meno forza, ma per un tragitto più lungo. Il lavoro resta lo stesso: la leva non regala energia, la distribuisce meglio.'),
        },
        {
          kind: 'q',
          text: T('Quale di queste cose è una leva?', 'Le forbici sono due leve unite. Dov’è il fulcro?', 'Il remo, lo schiaccianoci e le forbici: che cosa hanno in comune?'),
          options: [T('le forbici', 'nella vite che unisce le lame', 'sono leve, con il loro fulcro'), T('la palla', 'nella punta delle due lame', 'sono attrezzi fatti di metallo'), T('il bicchiere', 'negli anelli dove infili le dita', 'girano tutti su una ruota')],
          answer: 0,
          explain: T(
            'Giusto: le forbici sono leve. Il fulcro è la vite in mezzo.',
            'Esatto: le lame girano intorno alla vite. Per tagliare il cartone lo metti vicino alla vite: braccio corto per il cartone, lungo per la tua mano.',
            'Esatto: sono tutte leve. Cambia solo dove stanno il fulcro, la forza e il peso.'),
        },
      ],
      hints: [
        T('Più il fulcro è vicino al masso, più è facile sollevarlo.', 'Peso × braccio: il braccio di Bea deve essere abbastanza lungo da battere il masso.', 'Avvicina il fulcro al masso: il braccio di Bea si allunga.'),
      ],
      solution: T(
        'Con il fulcro a 1 m dal masso: il masso fa 100 × 1 = 100, Bea fa 20 × 6 = 120. Il masso si alza!',
        'Serve 20·(7 − f) > 100·f, cioè f < 1,17 m: il fulcro a 1 m dal masso (o meno).',
        'Il fulcro a un metro dal masso basta: il braccio di Bea diventa sei volte quello del masso.'),
    },
    {
      id: 'd05-4', kind: 'prevedi', title: 'Chi si ribalta?',
      sim: 'tilt', params: { obj: 'cubo', load: 'vuoto', theta: 28, cg: false, base: false }, controls: [],
      intro: T(
        'Una pedana che si alza piano, e sopra un oggetto. Un bordino lo tiene fermo: non può scivolare, ma può <b>ribaltarsi</b>. Indovina chi cade e chi resta in piedi!',
        'Sulla pedana c’è un oggetto, fermato da un bordino perché non scivoli. La pedana si inclina fino a 28°. Che cosa si ribalta e che cosa resta in piedi? Prima prevedi, poi guarda.',
        'I camion con un carico alto si ribaltano più facilmente; un bicchiere largo non cade quasi mai. Che cosa decide se un oggetto si ribalta? Una pedana che si inclina fino a 28°, un bordino che impedisce di scivolare, e qualche previsione.'),
      steps: [
        {
          kind: 'q', predict: [{ obj: 'cubo', load: 'vuoto', theta: 28 }],
          text: T('La pedana si alza fino a 28 gradi. Il cubo cade?', 'Un cubo largo 1 m, sulla pedana che arriva a 28°. Che cosa fa?', 'Prima prova: un cubo di un metro di lato. Inclinato di 28 gradi, come se la cava?'),
          options: [T('no, resta in piedi', 'resta in piedi', 'resta in piedi, tranquillo'), T('sì, si ribalta', 'si ribalta', 'si ribalta di colpo, a metà salita'), T('dondola e poi cade', 'si ribalta a metà salita', 'dondola, poi cade')],
          answer: 0,
          explain: T('Resta in piedi! Il cubo è largo e basso.', 'Resta in piedi: largo e basso, il cubo resisterebbe fino a 45°.', 'Tranquillo: un cubo resisterebbe fino a 45 gradi.'),
          solution: T('Il cubo resta in piedi.'),
        },
        {
          kind: 'q', predict: [{ obj: 'scaffale', load: 'vuoto', theta: 28 }],
          text: T('Ora uno scaffale alto e stretto, vuoto. Cade?', 'Ora uno scaffale vuoto, alto 1,8 m e largo 0,6 m. Arriva a 28°?', 'Seconda prova: uno scaffale vuoto, alto e stretto. Sopravvive ai 28 gradi?'),
          options: [T('sì, si ribalta', 'no: si ribalta prima', 'no, cade prima'), T('no, resta in piedi', 'sì: resta in piedi', 'sì, resiste'), T('sì, ma solo a 28 gradi', 'si ribalta proprio a 28°', 'cade proprio a 28 gradi')],
          answer: 0,
          explain: T('Si ribalta! Alto e stretto, cade già a 18 gradi.', 'Si ribalta già a 18°: alto e stretto è molto meno stabile.', 'Cade già a 18 gradi: alto e stretto non perdona.'),
          solution: T('Lo scaffale si ribalta, a circa 18 gradi.'),
        },
        {
          kind: 'q', predict: [{ obj: 'scaffale', load: 'basso', theta: 28 }],
          text: T('Lo stesso scaffale, con libri pesanti in basso. Cade?', 'Lo stesso scaffale, con libri pesanti sul ripiano più basso. Arriva a 28°?', 'Terza prova: lo stesso scaffale, ma con libri pesanti sul ripiano più basso.'),
          options: [T('no, resta in piedi', 'sì: resta in piedi, anche a 28°', 'stavolta resta in piedi'), T('sì, cade ancora prima', 'no: cade prima, pesa di più', 'cade prima: pesa di più'), T('sì, cade come prima', 'no: cade a 18°, come prima', 'cade come prima, a 18 gradi')],
          answer: 0,
          explain: T('Resta in piedi! I libri pesanti in basso lo aiutano.', 'Resta in piedi: con il peso in basso resisterebbe fino a 31°. Pesa di più, ma è più stabile.', 'Stavolta resiste fino a 31 gradi: pesa di più, eppure è più stabile.'),
          solution: T('Con i libri in basso lo scaffale resta in piedi.'),
        },
        {
          kind: 'q', predict: [{ obj: 'scaffale', load: 'alto', theta: 28, cg: true, base: true }],
          text: T('E con i libri pesanti in alto?', 'E con i libri pesanti sul ripiano più alto?', 'Ultima prova: i libri pesanti sul ripiano più alto.'),
          options: [T('cade ancora prima', 'si ribalta ancora prima: a 13°', 'cade ancora prima di quello vuoto'), T('cade come quello vuoto', 'si ribalta a 18°, come vuoto', 'cade come lo scaffale vuoto'), T('resta in piedi', 'resta in piedi fino a 28°', 'resiste fino a 28 gradi')],
          answer: 0,
          explain: T('Cade ancora prima, a 13 gradi! Guarda il punto giallo: è il punto dove si concentra il peso.', 'Si ribalta già a 13°. Il simbolo giallo è il <b>baricentro</b>: con i libri in alto è più in alto anche lui.', 'Cade già a 13 gradi. Il cerchio giallo è il <b>baricentro</b>: con i libri in alto sale anche lui.'),
          solution: T('Con i libri in alto cade ancora prima.'),
        },
        {
          kind: 'q',
          text: T('Che cosa decide se un oggetto si ribalta?', 'Che cosa decide a che angolo un oggetto si ribalta?', 'Allora, da che cosa dipende se un oggetto si ribalta?'),
          options: [T('dove sta il suo peso', 'dove sta il baricentro', 'dalla posizione del baricentro'), T('quanto è liscio il fondo', 'quanto pesa in tutto', 'da quanto pesa in tutto, e basta'), T('il suo colore', 'il materiale di cui è fatto', 'dal materiale della pedana')],
          answer: 0,
          explain: T(
            'Giusto! Il punto dove si concentra il peso si chiama <b>baricentro</b>. Più è in basso, più è difficile ribaltare.',
            'Esatto: un oggetto si comporta come se tutto il peso fosse nel <b>baricentro</b>. Se la verticale del baricentro esce dalla <b>base d’appoggio</b>, si ribalta.',
            'Esatto: dal <b>baricentro</b>, il punto dove si può pensare concentrato tutto il peso. Basso e sopra una base larga: stabile.'),
        },
      ],
      hints: [T('Guarda dove stanno i libri pesanti.', 'Alto e stretto, o basso e largo?', 'Conta dove sta il peso, più di quanto pesa.')],
    },
    {
      id: 'd05-5', kind: 'lezione', title: 'Il baricentro',
      sim: 'tilt', params: { obj: 'scaffale', load: 'vuoto', theta: 15, cg: true, base: true }, controls: ['theta', 'obj', 'load'],
      intro: T(
        'Il <b>baricentro</b> è il punto dove si concentra tutto il peso. Dal baricentro scende una freccia gialla, dritta verso il basso. Finché la freccia cade sopra la <b>base</b>, la linea verde, l’oggetto sta in piedi.',
        'Il <b>baricentro</b> è il punto in cui possiamo immaginare concentrato tutto il peso di un corpo. Un corpo appoggiato sta in piedi finché la verticale del baricentro cade dentro la sua <b>base d’appoggio</b>; quando ne esce, il peso fa girare il corpo intorno allo spigolo, e si ribalta. Baricentro basso e base larga: corpo stabile.',
        'Ogni oggetto si comporta come se tutto il suo peso stesse in un punto solo, il <b>baricentro</b>. La regola per non cadere: la verticale del baricentro deve cadere dentro la base su cui l’oggetto poggia. Per questo, nella lotta, si allargano i piedi e ci si abbassa.'),
      steps: [
        {
          kind: 'free',
          text: T('Fai ribaltare lo scaffale. Poi metti il peso in basso, e poi in alto.', 'Trova un’inclinazione a cui lo scaffale si ribalta. Poi prova con il peso in basso e con il peso in alto, e guarda la freccia gialla.'),
          need: [
            { when: 'r.tipped', try: { theta: 30, obj: 'scaffale', load: 'vuoto' }, msg: T('Alza di più la pedana: fallo ribaltare.') },
            { when: "load == 'basso'", try: { load: 'basso', theta: 25 }, msg: T('Ora metti il peso in basso e riprova.') },
            { when: "load == 'alto'", try: { load: 'alto', theta: 10 }, msg: T('Ora metti il peso in alto e riprova.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando cade lo scaffale?', 'Un corpo appoggiato si ribalta quando…', 'Che cosa fa cadere lo scaffale, a un certo punto?'),
          options: [
            T('quando la freccia gialla esce dalla base', 'la verticale del baricentro esce dalla base', 'il baricentro che esce dalla base'),
            T('quando la pedana tocca il suo punto più alto', 'la pedana supera i 45 gradi, qualunque corpo sia', 'la pedana che diventa scivolosa'),
            T('quando i libri pesanti scivolano giù', 'il peso supera la forza del bordino', 'il peso che cresce mentre si inclina'),
          ],
          answer: 0,
          explain: T(
            'Giusto! Quando la freccia esce dalla linea verde, lo scaffale cade.',
            'Esatto: se la verticale del baricentro esce dalla base d’appoggio, il peso fa girare il corpo intorno allo spigolo.',
            'Esatto: appena la verticale del baricentro passa oltre lo spigolo, il peso lo fa girare. E giù.'),
        },
        {
          kind: 'q',
          text: T('Dove metti i libri pesanti, perché lo scaffale non cada?', 'Con i libri pesanti in basso, lo scaffale si ribalta…', 'Perché le auto da corsa sono così basse e larghe?'),
          options: [T('sul ripiano più basso', 'a un angolo più grande', 'non si ribaltano in curva'), T('sul ripiano più alto', 'a un angolo più piccolo', 'l’aria le schiaccia a terra'), T('sul ripiano di mezzo', 'allo stesso angolo', 'consumano meno benzina')],
          answer: 0,
          explain: T(
            'Giusto: in basso! Così anche il baricentro è in basso, e lo scaffale è più stabile.',
            'Esatto: il peso in basso abbassa il baricentro, e serve inclinare di più (31° invece di 18°) perché esca dalla base.',
            'Esatto: baricentro basso e base larga. In curva la verticale del baricentro resta ben dentro le ruote.'),
        },
        {
          kind: 'order',
          text: T('Metti in ordine: dal più facile da ribaltare al più difficile.', 'Ordina dal meno stabile al più stabile.', 'Dal più traballante al più solido: mettili in ordine.'),
          items: [
            { t: T('scaffale, libri in alto', 'scaffale con il peso in alto'), v: 13 },
            { t: T('scaffale vuoto'), v: 18 },
            { t: T('scaffale, libri in basso', 'scaffale con il peso in basso'), v: 31 },
            { t: T('cubo vuoto'), v: 45 },
          ],
          explain: T('Perfetto! Più il peso è in basso e la base è larga, più è difficile ribaltare.', 'Perfetto: 13°, 18°, 31°, 45°. Baricentro basso e base larga vogliono più inclinazione.', 'Perfetto: 13, 18, 31 e 45 gradi. Vince chi è basso e largo.'),
        },
        {
          kind: 'q',
          text: T('Su una barchetta che dondola, è meglio stare…', 'Un autobus a due piani, pieno di gente al piano di sopra, è…', 'In Gran Bretagna gli autobus a due piani devono restare in piedi anche inclinati di 28 gradi. Che cosa li aiuta?'),
          options: [T('seduti', 'meno stabile: il baricentro sale', 'motore e telaio pesanti, in basso'), T('in piedi', 'più stabile: pesa di più', 'tanti passeggeri seduti al piano di sopra'), T('su una gamba', 'stabile uguale: è lo stesso autobus', 'un tetto alto e molto leggero')],
          answer: 0,
          explain: T(
            'Giusto: seduti il baricentro è più basso, e la barca dondola meno.',
            'Esatto: la gente al piano di sopra alza il baricentro, e l’autobus si ribalta a un angolo più piccolo. Prova l’autobus sulla pedana!',
            'Esatto: il peso del motore e del telaio, in basso, tiene giù il baricentro. Provalo sulla pedana, con l’autobus.'),
        },
      ],
      hints: [
        T('Guarda la freccia gialla: dove tocca la pedana?', 'La verticale del baricentro deve cadere dentro la base d’appoggio (la linea verde).', 'Baricentro basso e base larga: più stabile.'),
      ],
      solution: T(
        'Lo scaffale vuoto cade a circa 18 gradi. Con i libri in basso resiste fino a 31; con i libri in alto cade già a 13.',
        'Si ribalta quando la verticale del baricentro esce dalla base: vuoto a 18°, con il peso in basso a 31°, con il peso in alto a 13°.',
        'Vuoto a 18 gradi, con il peso in basso a 31, con il peso in alto a 13: decide l’altezza del baricentro.'),
    },
    {
      id: 'd05-6', kind: 'ripasso', title: 'Ripasso dell’equilibrio',
      intro: T('Ripassiamo: altalene, leve e cose che non cadono!', 'Ripasso: momento della forza, leve, baricentro e stabilità.', 'Ripasso: l’equilibrio nelle cose di tutti i giorni.'),
      steps: [
        {
          kind: 'q',
          text: T('Una mamma di 60 kg e un bimbo di 20 kg sull’altalena. Chi si siede più vicino al fulcro?', 'Altalena a bilico: un adulto di 75 kg siede a 0,8 m dal fulcro. Dove si siede un bambino di 30 kg, per l’equilibrio?', 'Una nonna e il nipotino sull’altalena a bilico. Come fanno a stare in equilibrio?'),
          options: [T('la mamma', 'a 2 m dal fulcro', 'la nonna si siede più vicina al fulcro'), T('il bimbo', 'a 0,32 m dal fulcro', 'il nipote siede più vicino al fulcro'), T('stanno uguali', 'a 1,25 m dal fulcro', 'stanno alla stessa distanza')],
          answer: 0,
          explain: T(
            'Giusto: chi pesa di più sta più vicino al fulcro. La mamma pesa il triplo: sta a un terzo della distanza.',
            'Esatto: 75 × 0,8 = 60, e 60 / 30 = 2 m.',
            'Esatto: chi pesa di più si avvicina al fulcro, finché peso per distanza è uguale dalle due parti.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Una chiave corta e una lunga: quale svita meglio un bullone duro?'),
          options: [T('la lunga'), T('la corta'), T('sono uguali')],
          answer: 0,
          explain: T('Giusto: con il manico lungo la tua forza fa girare di più.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Chiavi e bulloni.'),
          vals: { M: [30, 40, 60], b: [0.2, 0.4] }, calc: 'M / b', unit: 'N', tol: 0.5,
          ask: T(null,
            'Per svitare un bullone serve un momento di <b>{M} N·m</b>. Con una chiave lunga <b>{b} m</b>, che forza ci vuole, in fondo al manico?',
            'Il bullone della ruota cede con un momento di <b>{M} N·m</b>. Con una chiave di <b>{b} m</b>, quanta forza devi fare? [[F = M / b]]'),
          explain: T(null, 'Esatto: F = M/b = {M} / {b} = {ans} N.', 'Esatto: {ans} N. [[F = {M} / {b}]]'),
        },
        {
          kind: 'q',
          text: T('Sollevi un sasso con un bastone. Dove metti il fulcro?', 'In una leva il braccio della tua forza è 4 volte quello del peso. Per sollevare 400 N servono…', 'Perché le maniglie stanno lontane dai cardini?'),
          options: [T('vicino al sasso', 'poco più di 100 N', 'così basta meno forza per aprire'), T('vicino alla mano', 'poco più di 400 N', 'così la porta pesa di meno'), T('lontano da tutti e due', 'poco più di 1600 N', 'per non sbattere la mano contro il muro')],
          answer: 0,
          explain: T(
            'Giusto: fulcro vicino al sasso, mano lontana. Come Bea con il masso!',
            'Esatto: con il braccio 4 volte più lungo basta un quarto della forza, 100 N per l’equilibrio, poco di più per sollevare.',
            'Esatto: con il braccio lungo basta meno forza. Prova ad aprire una porta spingendo vicino ai cardini: fatica!'),
        },
        {
          kind: 'q',
          text: T('Perché un bicchiere basso e largo cade meno di uno alto e stretto?', 'La Torre di Pisa pende di circa 4°, ma non cade. Perché?', 'Un lottatore di sumo allarga le gambe e si abbassa. Perché?'),
          options: [T('base larga e peso in basso', 'la verticale del baricentro è nella base', 'base larga e baricentro basso'), T('il suo vetro è molto più spesso', 'il vento la spinge sempre dall’altra parte', 'così sembra più grosso e minaccioso'), T('pesa meno di quello alto', 'è più leggera di quanto sembra', 'per riposare le ginocchia')],
          answer: 0,
          explain: T(
            'Giusto: base larga e peso in basso. È più difficile far uscire il baricentro dalla base.',
            'Esatto: finché la verticale del baricentro cade dentro la base, la torre resta in piedi. Per sicurezza, i lavori finiti nel 2001 l’hanno raddrizzata di una quarantina di centimetri.',
            'Esatto: base larga e baricentro basso. Per spingerlo fuori dal cerchio, l’avversario deve far uscire il suo baricentro dalla base dei piedi.'),
        },
      ],
    },
    {
      id: 'd05-7', kind: 'boss', who: 'bilancia', title: 'La scatola misteriosa', win: T('Esperimento riuscito!'),
      sim: 'lever', params: { m1: 6, d1: 1, m2: 1, d2: 3, w1: 'scatola', w2: 'blocchi', hide1: true, names: ['Scatola', 'Blocchi'], say: ['scende la scatola', 'scendono i blocchi'], panel: true, arms: true },
      controls: ['m2', 'd2'],
      labels: {
        m2: { label: 'Blocchi da 1 kg', min: 1, max: 6, step: 1, unit: 'kg' },
        d2: { label: 'Distanza dei blocchi dal fulcro', min: 0.5, max: 3, step: 0.5, unit: 'm' },
      },
      intro: T(
        'Sono Bilancia! Sotto il mio telo c’è una scatola. Quanto pesa? Non puoi guardare: puoi solo mettere blocchi dall’altra parte dell’altalena. Esperimento al buio!',
        'Sono Bilancia, e peso le cose anche senza bilancia. Sotto il telo c’è una scatola, a 1 m dal fulcro. Hai blocchi da 1 kg da mettere dall’altra parte, alla distanza che vuoi. Trova l’equilibrio e ricava la massa nascosta.',
        'Sono Bilancia. Prima delle bilance moderne si pesava così: un’asta, un fulcro e pesi noti, spostati finché l’asta restava orizzontale. Sotto il mio telo c’è una scatola, a un metro dal fulcro. Pesala.'),
      steps: [
        {
          kind: 'free',
          text: T('Scegli i blocchi e la distanza, poi togli i fermi. Trova l’equilibrio!', 'Cambia il numero dei blocchi e la loro distanza finché l’asse, senza fermi, resta in equilibrio.'),
          need: [{ when: 'r.balanced', try: { m2: 3, d2: 2 }, msg: T('Non è ancora in equilibrio: cambia i blocchi o la distanza, e rilancia.', 'Non ancora: guarda quale lato scende, poi cambia i blocchi o la loro distanza.') }],
        },
        {
          kind: 'q', review: false,
          text: T('La scatola è a 1 m dal fulcro. Quanto pesa?', 'La scatola è a 1 m dal fulcro. Dall’equilibrio che hai trovato, quanto vale la sua massa?', 'Dal tuo equilibrio, quanto pesa la scatola misteriosa?'),
          options: [T('6 kg'), T('3 kg'), T('2 kg')],
          answer: 0,
          explain: T(
            'Giusto! Dall’altra parte peso × distanza fa 6 (per esempio 3 blocchi a 2 m). La scatola, a 1 m, deve fare 6 anche lei: pesa 6 kg.',
            'Esatto: m·1 m = m₂·d₂ = 6 kg·m (3 kg a 2 m, oppure 2 kg a 3 m…), quindi la scatola ha massa 6 kg.',
            'Esatto: sei chili. I blocchi fanno 6, per esempio tre chili a due metri, e la scatola sta a un metro.'),
        },
        {
          kind: 'q', only: ['e'], review: false,
          text: T('Bilancia sposta la scatola a 2 m dal fulcro. Dove metti 6 blocchi?'),
          options: [T('a 2 m'), T('a 1 m'), T('a 3 m')],
          answer: 0,
          explain: T('Giusto: la scatola fa 6 × 2 = 12, e 6 blocchi a 2 m fanno 12.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Altre scatole di Bilancia.'),
          vals: { d: [0.5, 2], m: [2, 3, 4], b: [1, 2, 3] }, calc: 'm * b / d', unit: 'kg', tol: 0.05,
          ask: T(null,
            'Un’altra scatola è a <b>{d} m</b> dal fulcro. L’equilibrio arriva con <b>{m} kg</b> di blocchi a <b>{b} m</b>. Che massa ha la scatola?',
            'Bilancia mette un’altra scatola a <b>{d} m</b> dal fulcro, e l’asse sta in equilibrio con <b>{m} kg</b> a <b>{b} m</b>. Quanto pesa la scatola? [[m · {d} = {m} · {b}]]'),
          explain: T(null, 'Esatto: m·{d} = {m}·{b}, quindi m = {m} × {b} / {d} = {ans} kg.', 'Esatto: {ans} kg. [[m = {m} × {b} / {d}]]'),
        },
        {
          kind: 'q',
          text: T('Come hai pesato la scatola senza bilancia?', 'Che cosa ti ha permesso di pesare la scatola senza vederla?', 'È il principio della stadera, la bilancia dei mercati di una volta. Su che cosa si basa?'),
          options: [T('peso × distanza uguali dalle due parti', 'l’equilibrio dei momenti: m₁·d₁ = m₂·d₂', 'momenti uguali dalle due parti del fulcro'), T('sollevandola piano piano con tutte e due le mani', 'il tempo che l’asse impiega a toccare terra', 'una molla che si allunga sotto il peso appeso'), T('ascoltando il rumore della scatola', 'il rumore della scatola sul terreno', 'l’acqua spostata dalla scatola immersa')],
          answer: 0,
          explain: T(
            'Giusto! Bilancia toglie il telo: la scatola pesa proprio 6 kg.',
            'Esatto: all’equilibrio i momenti sono uguali, m·d₁ = m₂·d₂, e la massa si ricava. Bilancia toglie il telo: 6 kg!',
            'Esatto: momenti uguali, cioè peso per distanza uguale dalle due parti. Bilancia toglie il telo: sei chili, come avevi trovato.'),
        },
      ],
      hints: [T('Peso × distanza dei blocchi deve essere uguale a quello della scatola.', 'All’equilibrio m·d₁ = m₂·d₂: la scatola è a 1 m.', 'All’equilibrio, peso per distanza è uguale dalle due parti.')],
      solution: T(
        'Equilibrio, per esempio, con 3 blocchi a 2 m: 3 × 2 fa 6. La scatola, a 1 m, pesa 6 kg.',
        'm = m₂·d₂ / d₁ = 3 kg × 2 m / 1 m = 6 kg (oppure 2 kg a 3 m, 4 kg a 1,5 m, 6 kg a 1 m).',
        'Sei chili: per esempio tre chili a due metri pareggiano la scatola a un metro.'),
    },
  ],
};
