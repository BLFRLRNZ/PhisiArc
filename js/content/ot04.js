// OT04 · La luce è un'onda. Simulazione: la luce come onda (lightwave.js), in sei modi: le due fenditure di Young
// (anche con una fenditura sola), la lamina di una bolla di sapone, il CD e il DVD, i filtri polarizzatori, la finestra
// magica, la fenditura sempre più stretta.
// La zona fa sommare due onde di luce fino al buio, colora le bolle e i CD con l'interferenza, polarizza la luce,
// costruisce la finestra magica del parco e finisce con Vetrino che smonta il mito con cui il Prisma era cominciato:
// la luce va dritta solo finché gli ostacoli sono grandi.
import { T } from '../util.js';

export default {
  id: 'OT04',
  title: 'La luce è un’onda',
  levels: [
    {
      id: 'ot04-1', kind: 'lezione', title: 'Le due fenditure',
      sim: 'luce', params: { mode: 'young', col: 'rossa', d: 0.3, fen: 'due' }, controls: ['col', 'd'],
      intro: T(
        'Ricordi le onde della Valle? Quando due onde si incontrano, si sommano. Thomas Young fece passare la luce da due fenditure, due fessure sottilissime e vicine vicine: sullo schermo comparvero strisce chiare e scure, come fanno le onde! Prova i colori e la distanza fra le fenditure.',
        'Nel 1801 Thomas Young fece passare la luce da due fenditure vicinissime. Da ognuna parte un’onda, e le due onde si sovrappongono: dove arrivano in fase si rinforzano, dove arrivano in opposizione si cancellano. Sullo schermo compaiono strisce chiare e scure, distanti Δy = λ·L/d. La luce visibile ha lunghezze d’onda di poche centinaia di <b>nanometri</b>: 650 nm il rosso, 450 nm il blu.',
        'Newton pensava che la luce fosse fatta di corpuscoli. Young, nel 1801, mostrò che due fasci di luce possono sommarsi e dare buio, come fanno solo le onde. Dalla distanza fra le strisce misurò la lunghezza d’onda della luce: meno di un millesimo di millimetro, circa 650 nanometri per il rosso e 450 per il blu. [[Δy = λ · L / d]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la luce rossa e la luce blu.', 'Prova la luce rossa e la luce blu, con la stessa distanza fra le fenditure.'),
          need: [
            { when: "col == 'rossa'", try: { col: 'rossa' }, msg: T('Prova la luce rossa.', 'Manca la luce rossa.') },
            { when: "col == 'blu'", try: { col: 'blu' }, msg: T('Ora la luce blu.', 'Manca la luce blu.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con quale luce le strisce sono più larghe?', 'Con la stessa distanza fra le fenditure, le strisce sono più distanti con…', 'Perché le strisce della luce rossa sono più distanti di quelle della blu?'),
          options: [T('con la rossa', 'la luce rossa', 'perché il rosso ha una lunghezza d’onda più lunga'), T('con la blu, il colore del cielo', 'la luce blu, che è più forte', 'perché il blu ha più energia e spinge di più'), T('uguali, sempre uguali', 'è uguale per tutti i colori', 'perché il rosso è più luminoso e arriva più lontano')],
          answer: 0,
          explain: T('Giusto: il rosso fa le strisce più larghe.', 'Esatto: Δy cresce con λ, e il rosso ha λ più grande.', 'Esatto: la distanza fra le strisce cresce con la lunghezza d’onda: 650 nm contro 450.'),
        },
        {
          kind: 'free',
          text: T('Ora prova le fenditure vicine e lontane.', 'Prova d = 0,2 mm e d = 0,6 mm.', 'Prova le fenditure a 0,2 mm e a 0,6 mm.'),
          need: [
            { when: 'd <= 0.2', try: { d: 0.2 }, msg: T('Prova le fenditure vicinissime.', 'Manca d = 0,2 mm.', 'Manca la prova a 0,2 mm.') },
            { when: 'd >= 0.6', try: { d: 0.6 }, msg: T('Ora più lontane.', 'Manca d = 0,6 mm.', 'Manca la prova a 0,6 mm.') },
          ],
        },
        {
          kind: 'q',
          text: T('Fenditure più vicine fanno strisce…', 'Avvicinando le fenditure, le strisce…', 'Perché fenditure più vicine allargano le strisce?'),
          options: [T('più larghe', 'si allargano', 'perché la differenza di cammino cresce più lentamente'), T('più strette', 'si stringono', 'perché la luce passa più in fretta da fenditure vicine'), T('uguali', 'restano uguali', 'perché lo schermo è lontano e le strisce si allargano per strada')],
          answer: 0,
          explain: T('Giusto: più vicine, più larghe.', 'Esatto: Δy = λ·L/d, con d al denominatore.', 'Esatto: per passare da una striscia chiara alla successiva bisogna spostarsi di più.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La distanza fra le strisce.'),
          vals: { lam: [450, 530, 650] }, calc: 'lam * 1e-9 * 2 / 0.25e-3 * 1e3', unit: 'mm', tol: 0.05,
          ask: T(null,
            'Luce di <b>{lam} nm</b>, fenditure distanti 0,25 mm, schermo a 2 m. Ogni quanti millimetri c’è una striscia chiara?',
            'Lunghezza d’onda <b>{lam} nm</b>, fenditure a 0,25 mm, schermo a 2 m: distanza fra le strisce? [[Δy = λ · L / d]]'),
          explain: T(null, 'Esatto: Δy = {lam} nm × 2 m / 0,25 mm = {ans:2} mm.', 'Esatto: {ans:2} mm.'),
        },
      ],
      hints: [T('Rosso: strisce larghe. Fenditure vicine: strisce larghe.', 'Δy = λ·L/d.', 'La distanza fra le strisce cresce con la lunghezza d’onda e cala con la distanza fra le fenditure.')],
      solution: T(
        'Strisce più larghe con la luce rossa e con le fenditure più vicine.',
        'Δy = λ·L/d: cresce con λ, cala con d.',
        'Strisce di interferenza, tanto più distanti quanto più lunga è l’onda.'),
    },
    {
      id: 'ot04-2', kind: 'prevedi', title: 'Luce più luce fa buio?',
      sim: 'luce', params: { mode: 'young', col: 'verde', d: 0.3, fen: 'una' }, controls: [],
      intro: T(
        'Una lampada fa luce, due lampade fanno più luce. Sempre? Con la luce che passa da due fenditure succede una cosa strana. Prima con una fenditura sola, poi con due. Prima indovina, poi guarda!',
        'Con una fenditura sola, sullo schermo c’è una macchia di luce. Apriamo la seconda: arriva più luce, ma dove andrà? Pensa alle onde nell’acqua: due creste che si incontrano si sommano, una cresta e una gola si annullano. Prevedi, poi guarda.',
        'Il punto debole della teoria dei corpuscoli: aprire una seconda fenditura, cioè aggiungere luce, rende bui certi punti dello schermo. Due onde in opposizione si cancellano; due flussi di palline no. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { fen: 'una' }, predict: [{ fen: 'una' }],
          text: T('Con una fenditura sola, sullo schermo vedi…', 'Con una sola fenditura, sullo schermo…', 'Con una sola fenditura, che cosa si vede sullo schermo?'),
          options: [T('una macchia di luce', 'una macchia di luce, senza strisce', 'una macchia sola'), T('strisce chiare e scure', 'tante strisce chiare e scure', 'le stesse strisce, più fitte'), T('niente', 'niente: con una fenditura non passa luce', 'un punto solo, piccolissimo')],
          answer: 0,
          explain: T('Giusto: una macchia sola.', 'Esatto: senza una seconda onda non c’è niente con cui sommarsi.', 'Esatto: serve una seconda onda per fare interferenza.'),
          solution: T('Una macchia di luce.', 'Una macchia di luce, senza strisce.'),
        },
        {
          kind: 'q', predict: [{ fen: 'due' }],
          text: T('Apri la seconda fenditura. In certi punti lo schermo diventa…', 'Con due fenditure, in certi punti dello schermo arriva…', 'Con due fenditure aperte, che cosa succede in certi punti dello schermo?'),
          options: [T('buio!', 'meno luce di prima: buio', 'diventano bui: le due onde si cancellano'), T('più chiaro dappertutto', 'il doppio della luce dappertutto', 'arriva il doppio della luce in ogni punto'), T('colorato', 'luce di un altro colore', 'cambia il colore della luce')],
          answer: 0,
          explain: T('Giusto: luce più luce può fare buio!', 'Esatto: nelle strisce scure le due onde si cancellano.', 'Esatto: dove le onde arrivano in opposizione, si annullano.'),
          solution: T('Buio, nelle strisce scure.', 'Meno luce: buio, nelle strisce scure.'),
        },
        {
          kind: 'q',
          text: T('Perché luce più luce può fare buio?', 'Che cosa succede nelle strisce scure?', 'Perché le strisce scure dimostrano che la luce è un’onda?'),
          options: [T('le onde si cancellano', 'una cresta incontra una gola, e si annullano', 'perché solo le onde possono sommarsi e dare zero'), T('la luce si stanca', 'la luce si ferma per strada', 'perché le palline di luce rimbalzano l’una contro l’altra'), T('qualcuno spegne la lampada', 'la luce va a caso nelle strisce chiare', 'perché lo schermo assorbe la luce')],
          answer: 0,
          explain: T('Giusto: come le onde nell’acqua.', 'Esatto: è l’interferenza distruttiva.', 'Esatto: due flussi di palline si sommerebbero sempre.'),
        },
        {
          kind: 'q',
          text: T('E la luce che manca nelle strisce scure, dove va?', 'L’energia sparisce, nelle strisce scure?', 'L’interferenza distrugge energia?'),
          options: [T('nelle strisce chiare', 'no: va nelle strisce chiare, più luminose', 'no: la ridistribuisce, più luce nelle strisce chiare'), T('sparisce per sempre', 'sì: si distrugge', 'sì: l’energia si annulla'), T('torna indietro nella lampada', 'torna indietro nella lampada', 'la assorbono le fenditure')],
          answer: 0,
          explain: T('Giusto: le strisce chiare sono più luminose.', 'Esatto: nelle strisce chiare arriva il quadruplo della luce di una fenditura.', 'Esatto: l’energia si sposta, non si perde.'),
        },
      ],
      hints: [T('Pensa alle onde nell’acqua che si incontrano.', 'Due onde in opposizione si cancellano.', 'Interferenza: le onde si sommano, anche con segno opposto.')],
    },
    {
      id: 'ot04-3', kind: 'lezione', title: 'I colori delle bolle',
      sim: 'luce', params: { mode: 'bolla', sp: 300 }, controls: ['sp'],
      intro: T(
        'Una bolla di sapone ha tutti i colori, ma non è un prisma! La sua pellicola è sottilissima: la luce rimbalza sopra e sotto, e le due onde si sommano. Un nanometro è un milionesimo di millimetro. Cambia lo spessore e guarda i colori.',
        'La pellicola di una bolla è spessa poche centinaia di nanometri. La luce si riflette due volte, sulla faccia di sopra e su quella di sotto, e le due onde riflesse si sommano. Per ogni spessore alcuni colori si rinforzano e altri si cancellano: è l’<b>interferenza</b> su una lamina sottile. Le stesse sfumature si vedono nell’olio sull’acqua.',
        'I colori delle bolle cambiano con lo spessore della pellicola: l’acqua scende verso il basso, la pellicola in alto si assottiglia e, poco prima di scoppiare, diventa nera, perché è troppo sottile per rinforzare qualunque colore. Newton studiò questi colori senza riuscire a spiegarli; Young li spiegò con le onde.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una bolla spessa e una sottilissima.', 'Prova la bolla più sottile, 20 nm, e una di 400 nm o più.'),
          need: [
            { when: 'sp <= 20', try: { sp: 20 }, msg: T('Prova la bolla più sottile che c’è.', 'Manca la prova a 20 nm.') },
            { when: 'sp >= 400', try: { sp: 400 }, msg: T('Ora una bolla più spessa.', 'Manca una prova a 400 nm o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando la bolla è sottilissima, diventa…', 'Con una pellicola sottilissima, la bolla…', 'Perché poco prima di scoppiare una bolla diventa nera?'),
          options: [T('nera', 'sembra nera', 'è troppo sottile'), T('bianca', 'diventa bianca', 'si riempie d’aria'), T('rossa', 'diventa tutta rossa', 'si asciuga e si scolora')],
          answer: 0,
          explain: T('Giusto: nera, poco prima di scoppiare.', 'Esatto: le due riflessioni si cancellano per tutti i colori.', 'Esatto: è troppo sottile per rinforzare qualunque colore: le due onde riflesse arrivano in opposizione.'),
        },
        {
          kind: 'q',
          text: T('I colori della bolla vengono…', 'Da dove vengono i colori della bolla?', 'Perché i colori di una macchia d’olio cambiano da punto a punto?'),
          options: [T('dalla luce che rimbalza due volte', 'dalle due riflessioni che si sommano', 'perché lo spessore dell’olio cambia da punto a punto'), T('dal sapone colorato', 'dal colore del sapone', 'perché l’olio è colorato'), T('da un prisma dentro la bolla', 'da un prisma nascosto', 'perché l’acqua sotto è sporca')],
          answer: 0,
          explain: T('Giusto: due riflessioni, e le onde si sommano.', 'Esatto: è interferenza, non dispersione.', 'Esatto: spessori diversi, colori diversi.'),
        },
        {
          kind: 'q',
          text: T('Cambiando lo spessore, il colore…', 'Se lo spessore cambia, il colore riflesso…', 'Perché le bolle hanno strisce colorate orizzontali?'),
          options: [T('cambia', 'cambia', 'perché l’acqua scende e la pellicola è più spessa in basso'), T('resta uguale', 'resta lo stesso', 'perché il vento le dipinge'), T('sparisce sempre', 'diventa sempre bianco', 'perché la luce viene dall’alto e colora prima la parte di sopra')],
          answer: 0,
          explain: T('Giusto: ogni spessore ha il suo colore.', 'Esatto: ogni spessore rinforza colori diversi.', 'Esatto: lo spessore cresce dall’alto in basso, e i colori formano strisce.'),
        },
      ],
      hints: [T('La luce rimbalza sopra e sotto la pellicola.', 'Le due onde riflesse si sommano o si cancellano.', 'Il colore dipende dallo spessore, confrontato con la lunghezza d’onda.')],
      solution: T(
        'Il colore della bolla cambia con lo spessore; sottilissima, diventa nera.',
        'Interferenza fra le due riflessioni: il colore dipende dallo spessore.',
        'Lamina sottile: colori di interferenza, e nera quando è sottilissima.'),
    },
    {
      id: 'ot04-4', kind: 'lezione', title: 'L’arcobaleno del CD',
      sim: 'luce', params: { mode: 'reticolo', disco: 'cd' }, controls: ['disco'],
      intro: T(
        'Guarda un CD alla luce: brilla di tutti i colori! Le sue righe sono vicinissime, quasi quanto le onde della luce: ogni riga fa da fenditura, e le onde si rinforzano in una direzione diversa per ogni colore. E un DVD, con le righe ancora più vicine?',
        'Un CD ha righe distanti 1,6 micrometri: è un <b>reticolo</b>, cioè tantissime fenditure in fila. Ogni colore si rinforza in una direzione diversa, quella per cui d·sin θ = λ: il rosso, che ha λ più grande, va più di lato. Un DVD, con righe ogni 0,74 µm, apre i colori ancora di più.',
        'Tante fenditure in fila formano un reticolo: le onde si rinforzano solo in poche direzioni, diverse per ogni colore. I reticoli separano i colori meglio dei prismi, e gli astronomi li usano per leggere la luce delle stelle e capire di che cosa sono fatte. Le righe di un CD sono un reticolo per caso. [[d · sin θ = λ]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il CD e il DVD.'),
          need: [
            { when: "disco == 'cd'", try: { disco: 'cd' }, msg: T('Prova il CD.', 'Manca il CD.') },
            { when: "disco == 'dvd'", try: { disco: 'dvd' }, msg: T('Ora il DVD.', 'Manca il DVD.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quale colore va più di lato?', 'Nel ventaglio del CD, quale colore si allontana di più dal centro?', 'Perché in un reticolo il rosso devia più del violetto, al contrario del prisma?'),
          options: [T('il rosso', 'il rosso', 'perché ha la lunghezza d’onda più lunga'), T('il violetto', 'il violetto', 'perché nel reticolo il rosso è più lento'), T('il verde', 'il verde', 'perché il violetto si consuma')],
          answer: 0,
          explain: T('Giusto: il rosso va più lontano.', 'Esatto: sin θ = λ/d, e il rosso ha λ più grande.', 'Esatto: nel prisma conta la velocità nel vetro; nel reticolo conta la lunghezza d’onda.'),
        },
        {
          kind: 'q',
          text: T('Con il DVD, che ha righe più vicine, i colori…', 'Un DVD ha righe più vicine di un CD. I colori…', 'Perché il DVD apre i colori più del CD?'),
          options: [T('si aprono di più', 'si aprono ancora di più', 'righe più fitte, angoli più grandi'), T('si chiudono verso il centro', 'si avvicinano al centro', 'dentro ci sono più dati e più musica'), T('spariscono tutti quanti', 'diventano bianchi', 'è più lucido e riflette di più')],
          answer: 0,
          explain: T('Giusto: righe più vicine, colori più aperti.', 'Esatto: sin θ = λ/d: d più piccolo, angolo più grande.', 'Esatto: come per le due fenditure: più sono vicine, più si apre la figura.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’angolo del colore.'),
          vals: { lam: [400, 500, 600] }, calc: 'lam / 1600', unit: '', tol: 0.01,
          ask: T(null,
            'Le righe di un CD sono distanti 1600 nm. Per la luce di <b>{lam} nm</b>, quanto vale sin θ? (d·sin θ = λ)',
            'Righe a 1600 nm, luce di <b>{lam} nm</b>: quanto vale il seno dell’angolo? [[d · sin θ = λ]]'),
          explain: T(null, 'Esatto: sin θ = {lam} / 1600 = {ans:3}.', 'Esatto: {ans:3}.'),
        },
      ],
      hints: [T('Ogni riga del CD fa da fenditura.', 'd·sin θ = λ: il rosso va più di lato.', 'Righe più fitte, angoli più grandi.')],
      solution: T(
        'Il CD apre la luce bianca nei colori; il DVD ancora di più.',
        'd·sin θ = λ: rosso più di lato, DVD più aperto del CD.',
        'Un reticolo separa i colori secondo la lunghezza d’onda.'),
    },
    {
      id: 'ot04-5', kind: 'lezione', title: 'Gli occhiali polarizzati',
      sim: 'luce', params: { mode: 'polar', theta: 0 }, controls: ['theta'],
      intro: T(
        'La luce è un’onda che oscilla di traverso, come una corda scossa su e giù. Un filtro polarizzatore lascia passare solo le oscillazioni in una direzione. Metti due filtri uno dopo l’altro e gira il secondo: che cosa succede alla luce?',
        'La luce è un’onda <b>trasversale</b>: oscilla perpendicolarmente alla direzione in cui viaggia. Un filtro <b>polarizzatore</b> lascia passare solo le oscillazioni lungo una direzione. Dopo due filtri girati di un angolo θ passa la frazione cos² θ della luce (legge di Malus): tutta a 0°, metà a 45°, niente a 90°.',
        'Il suono non si può polarizzare, la luce sì: è la prova che la luce oscilla di traverso. Gli occhiali da sole polarizzati sfruttano un dettaglio: la luce riflessa dall’acqua e dall’asfalto oscilla soprattutto in orizzontale, e un filtro verticale la spegne. Così i riflessi spariscono. [[I = I₀ · cos² θ]]'),
      steps: [
        {
          kind: 'free',
          text: T('Gira il secondo filtro: prova 0, 45 e 90 gradi.', 'Prova il secondo filtro a 0°, a 45° e a 90°.'),
          need: [
            { when: 'theta <= 3', try: { theta: 0 }, msg: T('Prova i filtri allineati, a 0 gradi.', 'Manca la prova a 0°.') },
            { when: 'theta >= 42 && theta <= 48', try: { theta: 45 }, msg: T('Ora a 45 gradi.', 'Manca la prova a 45°.') },
            { when: 'theta >= 87', try: { theta: 90 }, msg: T('Ora di traverso, a 90 gradi.', 'Manca la prova a 90°.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con il secondo filtro di traverso, a 90 gradi, la luce…', 'A 90°, dopo il secondo filtro passa…', 'Perché due filtri incrociati spengono la luce?'),
          options: [T('si spegne', 'niente', 'il secondo blocca l’unica oscillazione rimasta'), T('passa tutta', 'tutta la luce', 'i filtri sono troppo scuri'), T('cambia colore', 'metà della luce', 'la luce si stanca a forza di passare dai filtri')],
          answer: 0,
          explain: T('Giusto: due filtri incrociati fanno buio!', 'Esatto: cos² 90° = 0.', 'Esatto: il primo lascia solo oscillazioni verticali, e il secondo le blocca tutte: è la prova che la luce oscilla di traverso.'),
        },
        {
          kind: 'q',
          text: T('A 45 gradi passa…', 'A 45° passa…', 'Perché a 45° passa proprio metà della luce?'),
          options: [T('metà della luce', 'metà della luce', 'l’oscillazione si divide in due parti uguali'), T('tutta quanta, come prima', 'tutta', '45 è proprio la metà di 90, e la luce si dimezza'), T('niente', 'un quarto della luce, o meno', 'il filtro è a metà strada')],
          answer: 0,
          explain: T('Giusto: metà.', 'Esatto: cos² 45° = 0,5.', 'Esatto: una parte lungo il secondo filtro, una di traverso; passa la prima, che porta metà della luce.'),
        },
        {
          kind: 'q',
          text: T('Gli occhiali da sole polarizzati servono a…', 'Perché gli occhiali polarizzati tolgono i riflessi dell’acqua?', 'Perché il suono non si può polarizzare?'),
          options: [T('togliere i riflessi', 'il filtro blocca la luce riflessa', 'è un’onda longitudinale'), T('vedere al buio', 'perché sono molto più scuri degli altri occhiali', 'è troppo lento per i filtri'), T('ingrandire', 'perché l’acqua del mare è già polarizzata', 'l’aria lo assorbe prima')],
          answer: 0,
          explain: T('Giusto: niente più riflessi che abbagliano.', 'Esatto: la luce riflessa oscilla in orizzontale, e il filtro verticale degli occhiali la blocca.', 'Esatto: oscilla nella direzione in cui viaggia; solo le onde trasversali, come la luce, si possono polarizzare.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La legge di Malus.'),
          vals: { th: [30, 60] }, calc: '100 * Math.cos(th * Math.PI / 180) ** 2', unit: '%', tol: 0.5,
          ask: T(null,
            'Il secondo filtro è girato di <b>{th}°</b> rispetto al primo. Che percentuale della luce passa? (cos² θ)',
            'Filtri girati di <b>{th}°</b>: che percentuale di luce passa? [[I = I₀ · cos² θ]]'),
          explain: T(null, 'Esatto: cos² {th}° = {ans:0} %.', 'Esatto: il {ans:0} %.'),
        },
      ],
      hints: [T('Due filtri incrociati fanno buio.', 'Passa cos² θ: tutta a 0°, metà a 45°, niente a 90°.', 'La luce oscilla di traverso; il filtro ne lascia passare una direzione sola.')],
      solution: T(
        'Girando il secondo filtro la luce cala, e a 90 gradi si spegne.',
        'Legge di Malus: passa cos² θ della luce.',
        'La luce è un’onda trasversale: due filtri incrociati la bloccano.'),
    },
    {
      id: 'ot04-6', kind: 'costruisci', title: 'La finestra magica',
      sim: 'luce', params: { mode: 'finestra', theta: 0, frac: 50 }, controls: ['theta'],
      intro: T(
        'Nel parco arriva la finestra magica: due filtri polarizzatori, e per regolare la luce basta girarne uno. Niente interruttori, niente tende! Gira il filtro per far passare proprio la luce che serve.',
        'Costruisci la finestra magica del parco: due filtri polarizzatori, il secondo girevole. Per far passare una certa frazione della luce serve un angolo con cos² θ uguale a quella frazione: metà della luce a 45°, un quarto a 60°, tre quarti a 30°.',
        'La finestra magica del parco: due filtri polarizzatori, uno girevole. Lo stesso principio regola la luce in certi finestrini d’aereo e negli schermi a cristalli liquidi: ogni pixel è una piccola finestra fra due filtri. [[cos² θ = I / I₀]]'),
      piece: { id: 'finestra', name: 'La finestra magica', desc: 'Due filtri e un giro di manopola: la luce si regola senza interruttori.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Gira il filtro, poi lancia.', 'Gira il secondo filtro, poi lancia: deve passare la luce chiesta.'),
          vals: { e: { frac: [[50], [25]] }, s: { frac: [[75, 50], [25]] } },
          set: { frac: 'frac' },
          ask: T(
            'Fai passare il <b>{frac}%</b> della luce. Di quanto giri il filtro?',
            'Deve passare il <b>{frac}%</b> della luce. Di che angolo giri il secondo filtro?',
            'Luce da far passare: <b>{frac}%</b>. Angolo del secondo filtro? [[cos² θ = I / I₀]]'),
          measure: 'theta', goal: 'Math.acos(Math.sqrt(frac / 100)) * 180 / Math.PI', tol: 2,
          ok: T('Perfetto! Nella stanza c’è la luce giusta!', 'Esatto: passa la luce chiesta.'),
          high: T('Troppo buio: hai girato troppo. Torna un po’ indietro.', 'Angolo troppo grande: passa troppo poca luce.'),
          low: T('Troppa luce: gira ancora un po’.', 'Angolo troppo piccolo: passa troppa luce.'),
          solve: { theta: 'Math.round(Math.acos(Math.sqrt(frac / 100)) * 180 / Math.PI)' },
        },
        {
          kind: 'q',
          text: T('Per spegnere del tutto la luce, giri il filtro di…', 'Per far passare tutta la luce, i filtri devono essere…', 'Perché uno schermo a cristalli liquidi, visto con occhiali polarizzati e la testa inclinata, può diventare nero?'),
          options: [T('90 gradi', 'allineati, a 0°', 'perché la sua luce esce già polarizzata, e gli occhiali girati la bloccano'), T('45 gradi', 'incrociati, a 90°', 'perché lo schermo si spegne quando lo inclini'), T('180 gradi', 'a 45°', 'perché gli occhiali sono troppo scuri')],
          answer: 0,
          explain: T('Giusto: di traverso, a 90 gradi.', 'Esatto: cos² 0° = 1: passa tutta.', 'Esatto: lo schermo stesso è fatto di filtri polarizzatori.'),
        },
      ],
      hints: [T('Metà della luce a 45 gradi; un quarto a 60.', 'cos² θ = frazione: 50% a 45°, 25% a 60°, 75% a 30°.', 'L’angolo giusto è quello il cui coseno, al quadrato, vale la frazione chiesta.')],
      solution: T('Metà della luce: 45 gradi. Un quarto: 60 gradi.', 'cos² 45° = 0,5; cos² 60° = 0,25; cos² 30° = 0,75.', 'L’angolo per cui il quadrato del coseno vale la frazione chiesta.'),
    },
    {
      id: 'ot04-7', kind: 'ripasso', title: 'Ripasso della luce come onda',
      intro: T('Ripassiamo: strisce, bolle, CD e filtri!', 'Ripasso: interferenza, lamine sottili, reticoli e polarizzazione.', 'Ripasso: perché la luce è un’onda.'),
      steps: [
        {
          kind: 'q',
          text: T('Due fenditure fanno sullo schermo…', 'Chi dimostrò l’interferenza della luce con due fenditure?', 'Che cosa dimostrò l’esperimento di Young?'),
          options: [T('strisce chiare e scure', 'Thomas Young, nel 1801', 'che la luce è un’onda'), T('una macchia sola', 'Isaac Newton, nel 1666', 'che la luce è fatta di palline'), T('un arcobaleno', 'Galileo, nel 1610', 'che la luce va sempre dritta')],
          answer: 0,
          explain: T('Giusto: è l’interferenza.', 'Esatto: con la luce del Sole e due fenditure vicinissime.', 'Esatto: solo le onde, sommandosi, possono fare buio.'),
        },
        {
          kind: 'q',
          text: T('Una bolla sottilissima, prima di scoppiare, diventa…', 'Da che cosa dipende il colore di una bolla di sapone?', 'Perché i colori di una bolla non vengono dalla dispersione?'),
          options: [T('nera', 'dallo spessore della pellicola', 'perché nascono dall’interferenza fra due riflessioni'), T('rossa', 'dal tipo di sapone', 'perché la bolla è un prisma rotondo'), T('bianca', 'dalla temperatura dell’acqua', 'perché il sapone è colorato')],
          answer: 0,
          explain: T('Giusto: nera.', 'Esatto: ogni spessore rinforza colori diversi.', 'Esatto: una lamina sottile, non un prisma.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Le strisce di Young.'),
          vals: { d: [0.2, 0.4, 0.5] }, calc: '650e-9 * 2 / (d * 1e-3) * 1e3', unit: 'mm', tol: 0.05,
          ask: T(null,
            'Luce rossa di 650 nm, fenditure distanti <b>{d} mm</b>, schermo a 2 m. Quanto distano le strisce chiare?',
            'Rosso, 650 nm; fenditure a <b>{d} mm</b>; schermo a 2 m: distanza fra le strisce? [[Δy = λ · L / d]]'),
          explain: T(null, 'Esatto: Δy = 650 nm × 2 m / {d} mm = {ans:2} mm.', 'Esatto: {ans:2} mm.'),
        },
        {
          kind: 'q',
          text: T('Due filtri polarizzatori incrociati…', 'Con i filtri girati di 60°, passa…', 'Che cosa dimostra la polarizzazione?'),
          options: [T('fanno buio', 'un quarto della luce', 'che la luce è un’onda trasversale'), T('fanno più luce', 'metà della luce', 'che la luce è un’onda longitudinale'), T('cambiano colore', 'tre quarti della luce', 'che la luce è fatta di palline')],
          answer: 0,
          explain: T('Giusto: niente luce.', 'Esatto: cos² 60° = 0,25.', 'Esatto: solo le onde trasversali si polarizzano.'),
        },
        {
          kind: 'q',
          text: T('Un CD alla luce brilla di…', 'Il DVD apre i colori più del CD perché…', 'In un reticolo, quale colore devia di più?'),
          options: [T('tutti i colori', 'le sue righe sono più vicine', 'il rosso, che ha la lunghezza d’onda più lunga'), T('solo argento, come uno specchio', 'perché è più lucido e specchiato', 'il violetto, come nel prisma'), T('solo blu', 'perché è più grande e più pesante', 'tutti allo stesso modo, come in uno specchio piano')],
          answer: 0,
          explain: T('Giusto: è un piccolo reticolo.', 'Esatto: righe più fitte, angoli più grandi.', 'Esatto: al contrario del prisma.'),
        },
      ],
    },
    {
      id: 'ot04-8', kind: 'boss', title: 'Il mito della luce sempre dritta',
      sim: 'luce', params: { mode: 'fessura', larg: '2' }, controls: ['larg'],
      intro: T(
        'Sono Vetrino. Nel primo livello del Prisma la luce andava dritta e faceva ombre nette. Allora si dice: <i>“La luce va sempre dritta, e non gira mai dietro gli ostacoli”</i>. Sarà vero anche con un buco piccolissimo? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“la luce va sempre in linea retta, qualunque sia l’ostacolo”</i>. Un laser rosso passa da una fenditura larga 2 mm, poi 0,5 mm, poi 0,1 mm. Se la luce andasse sempre dritta, la macchia sullo schermo sarebbe sempre larga quanto la fenditura.',
        'Sono Vetrino. Il mito della luce sempre dritta: <i>“i raggi di luce non girano mai attorno agli ostacoli”</i>. Il suono gira gli angoli, perché la sua lunghezza d’onda è di metri; quella della luce è meno di un millesimo di millimetro. Ma con aperture abbastanza piccole… Mettiamolo alla prova.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa cambi?', 'Come si mette alla prova il mito?', 'Qual è il confronto onesto?'),
          options: [T('solo la larghezza della fenditura', 'stesso laser e stesso schermo, fenditure sempre più strette', 'stesso laser, stessa distanza: cambiare solo la fenditura'), T('il laser e la fenditura insieme', 'si cambiano il laser e lo schermo', 'cambiare tutto insieme, per vedere più casi'), T('niente: si guarda il laser', 'si guarda il laser da vicino', 'si chiede a chi ha inventato il mito')],
          answer: 0,
          explain: T('Giusto: una cosa alla volta.', 'Esatto: così conta solo la fenditura.', 'Esatto: una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova la fenditura larga, stretta e strettissima.', 'Prova la fenditura di 2 mm, di 0,5 mm e di 0,1 mm.'),
          need: [
            { when: "larg == '2'", try: { larg: '2' }, msg: T('Prova la fenditura larga.', 'Manca la fenditura di 2 mm.') },
            { when: "larg == '0.5'", try: { larg: '0.5' }, msg: T('Ora quella stretta.', 'Manca la fenditura di 0,5 mm.') },
            { when: "larg == '0.1'", try: { larg: '0.1' }, msg: T('E ora quella strettissima.', 'Manca la fenditura di 0,1 mm.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la fenditura strettissima, la luce sullo schermo…', 'Con la fenditura di 0,1 mm, la macchia sullo schermo è…', 'Che cosa succede alla luce dietro una fenditura di 0,1 mm?'),
          options: [T('si allarga tantissimo', 'larga 26 mm', 'si allarga a ventaglio'), T('resta strettissima, come la fenditura', 'larga 0,1 mm, come la fenditura', 'passa dritta e stretta, come un filo'), T('sparisce, non arriva niente', 'non c’è: non passa luce', 'si spegne del tutto, al buio')],
          answer: 0,
          explain: T('Giusto: più stretta la fenditura, più larga la luce!', 'Esatto: 2λL/a = 26 mm, molto più della fenditura.', 'Esatto: si allarga a ventaglio e fa strisce: la luce gira oltre i bordi. È la diffrazione.'),
        },
        {
          kind: 'q',
          text: T('Allora, quando la luce gira dietro gli ostacoli?', 'Quando la luce smette di andare dritta?', 'Perché il suono gira gli angoli più facilmente della luce?'),
          options: [T('quando il buco è piccolissimo', 'quando l’apertura è piccola, vicina alla lunghezza d’onda', 'perché ha una lunghezza d’onda milioni di volte più lunga'), T('mai', 'quando la luce è debole', 'perché il suono è più veloce'), T('sempre, come il suono', 'quando la luce è rossa', 'perché l’aria spinge il suono dietro gli angoli, come il vento')],
          answer: 0,
          explain: T('Giusto: solo con aperture piccolissime.', 'Esatto: la diffrazione conta quando l’apertura è paragonabile a λ.', 'Esatto: per il suono ogni porta è piccola; per la luce serve un decimo di millimetro.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La macchia sullo schermo.'),
          vals: { a: [0.1, 0.2, 0.4] }, calc: '2 * 650e-9 * 2 / (a * 1e-3) * 1e3', unit: 'mm', tol: 0.1,
          ask: T(null,
            'Un laser rosso (650 nm) passa da una fenditura larga <b>{a} mm</b>; lo schermo è a 2 m. Quanto è larga la macchia centrale? (larghezza = 2·λ·L/a)',
            'Laser di 650 nm, fenditura di <b>{a} mm</b>, schermo a 2 m: quanto è larga la macchia centrale? [[w = 2 · λ · L / a]]'),
          explain: T(null, 'Esatto: 2 × 650 nm × 2 m / {a} mm = {ans:1} mm.', 'Esatto: {ans:1} mm.'),
        },
        {
          kind: 'q',
          text: T('Allora il mito…', 'Che cosa concludi sul mito della luce sempre dritta?', 'Il mito della luce sempre dritta: il verdetto?'),
          options: [T('è falso: con un buco piccolissimo la luce si allarga', 'falso: con aperture piccole la luce si allarga', 'falso: la luce è un’onda, e dietro aperture piccole si allarga'), T('è vero: la luce va sempre dritta', 'vero: la macchia resta sempre larga come la fenditura', 'vero: la luce non gira mai attorno agli ostacoli'), T('è vero solo per la luce rossa', 'vero a metà: solo con il laser verde', 'vero, ma solo nel vuoto')],
          answer: 0,
          explain: T('Mito smontato! La luce va dritta finché i buchi sono grandi; con un buco piccolissimo si allarga, come un’onda.', 'Mito smontato: con fenditure piccole la luce si allarga: è la diffrazione.', 'Mito smontato: i raggi sono un’approssimazione; quando le aperture si avvicinano alla lunghezza d’onda, la luce mostra di essere un’onda.'),
        },
      ],
      hints: [T('Prova la fenditura più stretta che c’è.', 'Più stretta la fenditura, più larga la macchia.', 'La diffrazione conta quando l’apertura è vicina alla lunghezza d’onda.')],
      solution: T(
        'Con il buco piccolissimo la luce si allarga: non va sempre dritta.',
        'Falso: con 0,1 mm la macchia è larga 26 mm.',
        'Il mito è falso: la luce si diffrange, come ogni onda.'),
    },
  ],
};
