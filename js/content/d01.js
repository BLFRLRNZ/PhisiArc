// D01 · Le forze e Newton. Simulazione: i carrelli (cart.js), su tre pavimenti, con i blocchi della massa e le frecce delle forze.
// Le tre idee della zona (l'inerzia, F = m · a, azione e reazione) hanno anche la loro scheda nella cassetta degli attrezzi, con il film.
// Il boss è un esperimento al buio: la massa nascosta sotto il telo si trova misurando l'accelerazione.
import { T } from '../util.js';

const FLOOR = { label: 'Pavimento' };
const F1 = { label: 'Forza sul carrello blu', min: 1, max: 12, step: 1, unit: 'N' };
const M1 = { label: 'Blocchi sul carrello blu', min: 1, max: 6, step: 1, unit: 'kg' };

export default {
  id: 'D01',
  title: 'Le forze e Newton',
  levels: [
    {
      id: 'd01-1', kind: 'lezione', title: 'Spingere e lasciare andare',
      sim: 'cart', params: { cars: 1, F1: 8, m1: 2, tP: 1, floor: 'tappeto', D: 24 }, controls: ['floor'], labels: { floor: FLOOR },
      intro: T(
        'Ciao, sono Mela! Nell’Officina si spinge e si tira. Una spinta o un tiro è una <b>forza</b>: la disegniamo con una freccia. Prova a spingere il carrello!',
        'Benvenuto nell’Officina: qui si scopre <b>perché</b> le cose si muovono come si muovono. Una spinta o un tiro è una <b>forza</b>: ha una direzione e un’intensità, e si disegna con una freccia. Guarda che cosa fa il carrello quando la spinta finisce.',
        'Sono Mela, quella caduta in testa a Newton. Qui si scopre perché le cose si muovono. Ogni spinta o tiro è una <b>forza</b>, una freccia con una direzione e una grandezza. Per duemila anni si è creduto che, senza una spinta, tutto si fermi. È vero? Provalo.'),
      steps: [
        {
          kind: 'free', runs: 3,
          text: T('Dai una spinta al carrello sul <b>tappeto</b>, sul <b>ghiaccio</b> e sul <b>binario liscio</b>.', 'Lancia il carrello sui tre pavimenti: la spinta dura un secondo, poi il carrello va da solo. Guarda le frecce e il grafico velocità–tempo.'),
          need: [
            { when: "floor == 'tappeto'", try: { floor: 'tappeto' }, msg: T('Prova anche sul tappeto.') },
            { when: "floor == 'ghiaccio'", try: { floor: 'ghiaccio' }, msg: T('Ora scegli il ghiaccio e rilancia.') },
            { when: "floor == 'liscio'", try: { floor: 'liscio' }, msg: T('Manca il binario liscio: sceglilo e rilancia.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Sul binario liscio, quando nessuno lo spinge più, il carrello…', 'Sul binario liscio niente frena il carrello. Finita la spinta, guarda la linea nel grafico velocità–tempo. La velocità…', 'Sul binario liscio niente frena il carrello: niente tappeto, niente ghiaccio. Finita la spinta, il carrello…'),
          options: [T('va avanti sempre uguale', 'resta la stessa: la linea è piatta', 'continua alla stessa velocità, per sempre'), T('rallenta piano piano e si ferma', 'scende piano fino a zero', 'rallenta piano piano, come se si stancasse'), T('va sempre più forte', 'continua a salire', 'accelera ancora un po’')],
          answer: 0,
          explain: T(
            'Giusto! Se niente lo spinge e niente lo frena, il carrello va avanti sempre uguale. Si chiama <b>inerzia</b>.',
            'Esatto: se le forze sul carrello si annullano, la sua velocità non cambia. È il <b>principio di inerzia</b>, la prima legge di Newton.',
            'Esatto: senza forze la velocità non cambia, né in grandezza né in direzione. È l’<b>inerzia</b>: Galileo la intuì, Newton ne fece la sua prima legge.'),
          wrong: T('Guarda le frecce rosse sotto le ruote: sul binario liscio ci sono?', 'Guarda la linea del binario liscio nel grafico, dopo il primo secondo.', 'Rilancia sul binario liscio e guarda la linea della velocità dopo la spinta.'),
        },
        {
          kind: 'q',
          text: T('Sul tappeto il carrello si ferma presto. Che cosa lo ferma?', 'Sul tappeto, con la stessa spinta, il carrello si ferma dopo pochi metri. Che cosa lo ferma?', 'Una boccia rotola sulla moquette e si ferma presto; sulla pista lucida arriva in fondo. Che cosa la ferma, sulla moquette?'),
          options: [T('il tappeto, che lo frena', 'il pavimento, con una forza all’indietro', 'la moquette, che la frena'), T('la spinta, che si consuma', 'la forza della spinta, che si esaurisce', 'la forza del lancio, che si consuma'), T('niente: si stanca', 'il suo peso, che lo rallenta', 'il suo peso, che la stanca')],
          answer: 0,
          explain: T(
            'Giusto: il tappeto frena le ruote. Anche frenare è una forza: la sua freccia punta indietro.',
            'Esatto: il pavimento spinge all’indietro sulle ruote. È una forza anche questa, e si chiama attrito: lo studierai nella prossima zona. Senza, il carrello non si fermerebbe.',
            'Esatto: è la moquette a spingere all’indietro (si chiama attrito). Il lancio non «si consuma»: è il pavimento che toglie velocità, un po’ alla volta.'),
        },
        {
          kind: 'q',
          text: T('Il carrello va verso destra. Per fermarlo, da che parte devi spingere?', 'Una forza si disegna con una freccia: dove punta, lì spinge. Un carrello va verso destra. Che forza serve per fermarlo?', 'In bicicletta, in discesa, tiri i freni per rallentare. Da che parte punta la forza che i freni fanno sulla bici?'),
          options: [T('verso sinistra, contro di lui', 'una freccia verso sinistra', 'all’indietro, contro il moto'), T('verso destra, nella stessa direzione', 'una freccia verso destra', 'in avanti, nel verso del moto'), T('verso l’alto', 'nessuna: si ferma da solo', 'verso il basso, contro la strada')],
          answer: 0,
          explain: T(
            'Giusto: per fermarlo spingi contro di lui, e la freccia della forza punta indietro.',
            'Esatto: per ridurre la velocità serve una forza opposta al moto. Una forza ha sempre una direzione e un verso: è un vettore, come la velocità.',
            'Esatto: una forza contraria al moto toglie velocità. Una forza nel verso del moto, invece, ne aggiunge.'),
        },
      ],
      hints: [T('Guarda le frecce rosse sotto le ruote: ci sono sul binario liscio?', 'Confronta il grafico velocità–tempo dei tre pavimenti dopo il primo secondo.', 'Sui tre pavimenti la spinta è la stessa: che cosa cambia, dopo?')],
      solution: T('Sul binario liscio il carrello non si ferma: niente lo frena. Sul tappeto si ferma perché il tappeto lo frena.', 'Senza forze la velocità resta costante (inerzia); il tappeto frena con una forza all’indietro.', 'Senza forze la velocità non cambia: è l’inerzia. A fermare il carrello è il pavimento, con una forza all’indietro.'),
    },
    {
      id: 'd01-2', kind: 'lezione', title: 'Più forza, più massa',
      sim: 'cart', params: { cars: 2, F1: 4, m1: 1, F2: 4, m2: 2, tP: 0, floor: 'liscio', D: 16 }, controls: ['F1', 'm1'], labels: { F1, m1: M1 },
      intro: T(
        'Più blocchi ci sono sul carrello, più è <b>difficile farlo partire</b>. Più forte spingi, più parte in fretta. Il carrello arancione resta sempre uguale: cambia quello blu e prova a batterlo!',
        'La <b>seconda legge di Newton</b>: l’accelerazione cresce con la forza e cala con la massa. In formula F = m·a. La forza si misura in <b>newton</b> (N): 1 N dà a una massa di 1 kg un’accelerazione di 1 m/s².',
        'Un carrello della spesa vuoto parte con un niente; pieno, con la stessa spinta, prende velocità molto più piano. Newton lo scrisse in una riga: più forza, più accelerazione; più massa, meno accelerazione. [[F = m·a, con la forza in newton: 1 N = 1 kg·m/s²]]'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Fai almeno <b>due gare</b> cambiando la forza o i blocchi del carrello blu.', 'Fai almeno due lanci cambiando la forza o la massa del carrello blu, e confronta le pendenze nel grafico velocità–tempo.') },
        {
          kind: 'q',
          text: T('Stessa spinta, ma un carrello ha il doppio dei blocchi. Quello carico parte…', 'Due carrelli ricevono la stessa forza; il secondo ha il doppio della massa. La sua accelerazione è…', 'Stessa spinta a due carrelli della spesa: uno vuoto, l’altro carico il doppio. Il carico prende velocità…'),
          options: [T('più piano', 'la metà', 'con metà dell’accelerazione'), T('più in fretta', 'il doppio', 'con il doppio dell’accelerazione'), T('uguale', 'la stessa', 'con la stessa accelerazione')],
          answer: 0,
          explain: T(
            'Giusto: più blocchi, più fatica a partire. Con il doppio dei blocchi prende velocità la metà in fretta.',
            'Esatto: a = F/m. Massa doppia, accelerazione dimezzata.',
            'Esatto: la massa misura quanto un corpo «resiste» a cambiare velocità. Massa doppia, accelerazione dimezzata. [[a = F / m]]'),
          wrong: T('Fai una gara con 1 blocco e una con 2: chi parte più in fretta?', 'Guarda le pendenze nel grafico con massa 1 kg e 2 kg.'),
        },
        {
          kind: 'q',
          text: T('Ora lo stesso carrello, ma spinto due volte più forte. Prende velocità…', 'Stessa massa, forza doppia. L’accelerazione…', 'Lo stesso carrello, ma ora a spingerlo siete in due, ognuno forte come prima. Prende velocità…'),
          options: [T('due volte più in fretta', 'raddoppia', 'due volte più in fretta'), T('più piano, perché è più faticoso', 'si dimezza', 'come prima: la massa è la stessa'), T('uguale', 'non cambia', 'più piano: vi intralciate')],
          answer: 0,
          explain: T(
            'Giusto: spinta doppia, partenza due volte più veloce!',
            'Esatto: con la massa fissa, l’accelerazione è proporzionale alla forza: F = m·a.',
            'Esatto: con la stessa massa, forza doppia vuol dire accelerazione doppia.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo con i carrelli.'),
          vals: { e: { a: [6, 12], n: [2, 3] }, s: { F: [4, 6, 8, 12], m: [2, 4] } },
          calc: { e: 'a / n', s: 'F / m' }, unit: T('m/s', 'm/s²'), tol: { e: 0, s: 0.01 },
          ask: T(
            'Con <b>1 blocco</b> il carrello va ogni secondo <b>{a} m/s</b> più veloce. Con <b>{n} blocchi</b> e la stessa spinta, di quanto ogni secondo?',
            'Una forza di <b>{F} N</b> spinge un carrello di <b>{m} kg</b> sul binario liscio. Quanto vale la sua accelerazione?',
            'Un carrello della spesa di <b>{m} kg</b>, spinto con <b>{F} newton</b>, senza attriti. Quanti metri al secondo guadagna ogni secondo?'),
          explain: T('Giusto: {n} volte i blocchi, {n} volte più piano: {a} diviso {n} fa {ans}.', 'Esatto: a = F/m = {F} / {m} = {ans} m/s².', 'Esatto: {F} newton divisi per {m} kg fanno {ans} m/s ogni secondo. [[a = F / m = {F} / {m} = {ans} m/s²]]'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Che forza serve?'),
          vals: { m: [2, 3, 5], a: [2, 3] }, calc: 'm * a', unit: 'N', tol: 0.01,
          ask: T(null, 'Che forza serve per dare a un carrello di <b>{m} kg</b> un’accelerazione di <b>{a} m/s²</b>?', 'Per far guadagnare a un carrello di <b>{m} kg</b> {a} m/s ogni secondo, quanti newton servono?'),
          explain: T(null, 'Esatto: F = m·a = {m} × {a} = {ans} N.', 'Esatto: {m} kg per {a} m/s ogni secondo fanno {ans} newton. [[F = m·a]]'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null,
            'Anche il peso è una forza: quella con cui la Terra tira un corpo. Per una massa m vale P = m·g, con g ≈ 9,8 m/s². Quanto pesa una mela da 0,1 kg?',
            'Il peso di un oggetto è la forza con cui la Terra lo tira verso il basso. Una mela da un etto: quanto pesa, in newton?'),
          options: [T(null, 'circa 1 N', 'circa 1 newton'), T(null, 'circa 0,1 N', 'circa un decimo di newton'), T(null, 'circa 10 N', 'circa 10 newton')],
          answer: 0,
          explain: T(null, 'Esatto: P = m·g ≈ 0,1 × 9,8 ≈ 1 N. Un newton è più o meno il peso di una mela, come me!', 'Esatto: circa un newton, più o meno il peso di una mela, come me! [[P = m·g ≈ 0,1 × 9,8 ≈ 1 N]]'),
          wrong: T(null, 'Moltiplica la massa per g: 0,1 × 9,8.', 'La Terra tira ogni kg con quasi 10 newton. E un etto?'),
        },
      ],
      hints: [T('Guarda le linee nel grafico: più è ripida, più il carrello prende velocità in fretta.', 'a = F / m: la forza sopra, la massa sotto.', 'Più forza, più accelerazione; più massa, meno accelerazione.')],
      solution: T('Più spinta, più in fretta; più blocchi, più piano.', 'a = F/m, cioè F = m·a.', 'L’accelerazione è la forza divisa per la massa. [[a = F / m]]'),
    },
    {
      id: 'd01-3', kind: 'prevedi', title: 'La sfida dei carrelli',
      sim: 'cart', params: { cars: 2, F1: 6, m1: 2, F2: 6, m2: 3, tP: 0, floor: 'liscio', D: 16 }, controls: [],
      intro: T('Sfida! Due carrelli, con spinte e blocchi diversi. Prima indovini, poi guardi.', 'Previsioni con la seconda legge: prima ragiona con a = F/m, poi controlla con l’esperimento.', 'Due carrelli in gara sul binario liscio. Prima di guardare, prova a indovinare chi arriva prima.'),
      steps: [
        {
          kind: 'q', predict: [{ F1: 6, m1: 2, F2: 6, m2: 3 }],
          text: T('Stessa spinta. Il blu ha 2 blocchi, l’arancione 3. Chi arriva prima?', 'Stessa forza, 6 N; il blu ha 2 kg, l’arancione 3 kg. Chi arriva prima al traguardo?', 'Due carrelli della spesa spinti allo stesso modo: uno porta 2 kg, l’altro 3. Chi arriva prima in fondo alla corsia?'),
          options: [T('il blu', 'il blu', 'quello da 2 kg'), T('l’arancione', 'l’arancione', 'quello da 3 kg'), T('insieme', 'arrivano insieme', 'arrivano insieme')],
          answer: 0,
          explain: T('Il blu! Con meno blocchi, la stessa spinta lo fa partire più in fretta.', 'Il blu: a = 6/2 = 3 m/s² contro 6/3 = 2 m/s².', 'Quello più leggero: con la stessa spinta accelera di più. [[a = 6/2 = 3 m/s² contro 6/3 = 2 m/s²]]'),
          solution: T('Arriva prima il blu, che ha meno blocchi.', 'Il blu: 3 m/s² contro 2 m/s².', 'Il carrello da 2 kg.'),
        },
        {
          kind: 'q', predict: [{ F1: 4, m1: 2, F2: 8, m2: 4 }],
          text: T('Il blu: 2 blocchi, spinta normale. L’arancione: 4 blocchi, spinta doppia. Chi vince?', 'Blu: 4 N su 2 kg. Arancione: 8 N su 4 kg. Chi arriva prima?', 'Un furgone pesa il doppio di un’auto, ma il suo motore spinge il doppio. Chi scatta meglio al semaforo?'),
          options: [T('arrivano insieme', 'arrivano insieme', 'scattano uguali'), T('il blu', 'il blu', 'l’auto'), T('l’arancione', 'l’arancione', 'il furgone')],
          answer: 0,
          explain: T('Insieme! Il doppio dei blocchi, ma anche il doppio della spinta: si pareggia.', 'Insieme: a = 4/2 = 8/4 = 2 m/s². Conta il rapporto fra forza e massa.', 'Scattano uguali: conta la forza divisa per la massa, non la forza da sola. [[4/2 = 8/4 = 2 m/s²]]'),
          solution: T('Arrivano insieme: doppi blocchi, ma anche doppia spinta.', 'Insieme: F/m è uguale, 2 m/s².', 'Scattano uguali: stessa forza per kg.'),
        },
      ],
      hints: [T('Più blocchi frenano la partenza, più spinta la aiuta.', 'Calcola a = F/m per tutti e due.', 'Conta quanta spinta tocca a ogni kg.')],
      solution: T('Con la stessa spinta vince il più leggero; con spinta doppia e blocchi doppi si arriva insieme.', 'Vince chi ha F/m più grande; con F/m uguali si arriva insieme.', 'Conta la forza per ogni kg: con lo stesso rapporto si arriva insieme.'),
    },
    {
      id: 'd01-4', kind: 'lezione', title: 'Spingi e ti spinge',
      sim: 'cart', params: { mode: 'coppia', m1: 1, m2: 3, D: 12 }, controls: ['m1', 'm2'], labels: { m1: M1, m2: { label: 'Blocchi sul carrello arancione', min: 1, max: 6, step: 1, unit: 'kg' } },
      intro: T(
        'Quando spingi qualcosa, anche lui spinge te! Fra i due carrelli c’è una molla schiacciata: lanciala e guarda le due frecce.',
        'La <b>terza legge di Newton</b>, o principio di <b>azione e reazione</b>: se un corpo spinge un altro, l’altro spinge il primo con una forza uguale e opposta. Fra i due carrelli c’è una molla schiacciata.',
        'Sui pattini, se spingi il muro vai indietro. Come fa un muro, che sta fermo, a spingerti? È la terza legge di Newton: a ogni spinta risponde una spinta uguale e contraria. Qui due carrelli si staccano con una molla.'),
      steps: [
        {
          kind: 'free', runs: 2,
          text: T('Lancia la molla una volta con <b>blocchi uguali</b> e una volta con <b>blocchi diversi</b>.', 'Fai un lancio con le due masse uguali e uno con le masse diverse.'),
          need: [
            { when: 'm1 == m2', try: { m1: 2, m2: 2 }, msg: T('Prova anche con lo stesso numero di blocchi sui due carrelli.', 'Fai anche un lancio con le due masse uguali.') },
            { when: 'm1 != m2', try: { m1: 1, m2: 3 }, msg: T('Ora metti più blocchi su un carrello e rilancia.', 'Ora rendi diverse le due masse e rilancia.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Mentre la molla spinge, guarda le due frecce rosse. Come sono?', 'Mentre la molla spinge, guarda le due forze, le frecce rosse, quando le masse sono diverse. Sono…', 'La molla spinge via i due carrelli, uno leggero e uno pesante. Le due spinte, quella sul leggero e quella sul pesante, sono…'),
          options: [T('uguali, ma girate', 'uguali e opposte', 'uguali, in versi opposti'), T('più lunga sul leggero', 'più grande sul carrello leggero', 'più forte sul leggero, che scappa'), T('più lunga sul pesante', 'più grande sul carrello pesante', 'più forte sul pesante, che resiste')],
          answer: 0,
          explain: T(
            'Giusto: due frecce uguali, una per parte. Quando spingi, vieni spinto allo stesso modo.',
            'Esatto: azione e reazione sono sempre uguali e opposte, anche quando le masse sono diverse.',
            'Esatto: le due spinte sono identiche. A cambiare è come ognuno risponde alla spinta.'),
        },
        {
          kind: 'q', predict: [{ m1: 1, m2: 3 }],
          text: T('Il blu ha 1 blocco, l’arancione 3. La molla li stacca: chi va più veloce?', 'Blu 1 kg, arancione 3 kg. Le forze sono uguali: chi parte più veloce?', 'Sul ghiaccio un bambino e un adulto si spingono via a vicenda. Chi scivola via più veloce?'),
          options: [T('il blu, il leggero', 'il blu, tre volte più veloce', 'il bambino, il più leggero'), T('l’arancione, il pesante', 'l’arancione, che è più pesante', 'l’adulto, il più forte'), T('vanno uguali', 'vanno alla stessa velocità', 'tutti e due uguali')],
          answer: 0,
          explain: T('Il blu! Stessa spinta, ma meno blocchi: va tre volte più veloce.', 'Il blu: stessa forza su una massa tre volte più piccola, quindi accelerazione tre volte più grande (a = F/m). Parte a 6 m/s, l’arancione a 2.', 'Il bambino: la spinta è la stessa per tutti e due, ma su una massa più piccola fa più effetto.'),
          solution: T('Il blu, che ha meno blocchi, va tre volte più veloce.', 'Il blu: 6 m/s contro 2 m/s.', 'Il più leggero.'),
        },
        {
          kind: 'q',
          text: T('Sullo skate lanci in avanti una palla pesante. Che cosa succede a te?', 'Un razzo spinge i gas di scarico verso il basso. Perché sale?', 'Nello spazio non c’è aria su cui appoggiarsi. Come fa un razzo ad accelerare?'),
          options: [T('vai un po’ indietro', 'i gas spingono il razzo verso l’alto', 'spinge via i gas, e i gas spingono lui'), T('vai avanti, con la palla', 'l’aria sotto lo sostiene', 'si appoggia al vuoto'), T('resti fermo', 'il razzo è più leggero dell’aria', 'non può: nello spazio si va solo per inerzia')],
          answer: 0,
          explain: T(
            'Giusto: tu spingi la palla avanti, la palla spinge te indietro. Come i due carrelli con la molla!',
            'Esatto: il razzo spinge i gas verso il basso (azione) e i gas spingono il razzo verso l’alto (reazione). Funziona anche nel vuoto.',
            'Esatto: il razzo spinge i gas indietro e i gas spingono il razzo avanti. Non serve l’aria: è la terza legge.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Quanto veloce?'),
          vals: { e: { v: [6, 12], n: [2, 3] }, s: { m1: [1, 2], m2: [3, 4, 6] }, c: { m1: [40, 50], m2: [80, 100], v1: [2, 3] } },
          derive: { e: {}, s: { v1: '12 / m1', r: 'm2 / m1' }, c: { r: 'm2 / m1' } },
          calc: { e: 'v / n', s: '12 / m2', c: 'm1 * v1 / m2' }, unit: 'm/s', tol: { e: 0, s: 0.01, c: 0.01 },
          ask: T(
            'La molla stacca due carrelli. Il blu, con <b>1 blocco</b>, parte a <b>{v} m/s</b>. L’arancione ha <b>{n} blocchi</b>: a quanto parte?',
            'La molla stacca due carrelli: il blu ha <b>{m1} kg</b> e parte a <b>{v1} m/s</b>; l’arancione ha <b>{m2} kg</b>. A che velocità parte l’arancione?',
            'Un ragazzo di <b>{m1} kg</b> e un adulto di <b>{m2} kg</b>, sui pattini, si spingono via. Il ragazzo scivola a <b>{v1} m/s</b>. E l’adulto?'),
          explain: T('Giusto: {n} volte i blocchi, {n} volte più piano: {ans} m/s.', 'Esatto: stessa forza per lo stesso tempo, ma una massa {r} volte più grande: {v1} / {r} = {ans} m/s.', 'Esatto: l’adulto ha {r} volte la massa del ragazzo, quindi va {r} volte più piano: {ans} m/s. [[v₂ = v₁ · m₁ / m₂]]'),
        },
      ],
      hints: [T('Guarda le due frecce rosse mentre la molla spinge.', 'Azione e reazione: forze uguali e opposte. Poi a = F/m per ognuno.', 'Le due spinte sono uguali: chi ha meno massa accelera di più.')],
      solution: T('Le frecce sono uguali e girate; il carrello leggero va più veloce.', 'Forze uguali e opposte; velocità inversamente proporzionali alle masse.', 'Le due spinte sono uguali e opposte; il più leggero scappa più veloce.'),
    },
    {
      id: 'd01-5', kind: 'costruisci', title: 'Il carrello della miniera',
      sim: 'cart', params: { cars: 1, F1: 2, m1: 2, tP: 2, floor: 'liscio', D: 20 }, controls: ['F1'], labels: { F1: { label: 'Forza del lanciatore', min: 1, max: 12, step: 1, unit: 'N' } },
      intro: T(
        'Nuovo gioco per il parco: il <b>carrello della miniera</b>! Un lanciatore lo spinge per <b>2 secondi</b>: scegli la forza giusta per il carico che porta.',
        'Nuovo pezzo del parco: il carrello della miniera. Il lanciatore spinge per 2 s; alla fine della spinta il carrello deve avere la velocità richiesta. Ti servono a = v/t e poi F = m·a.',
        'Nuovo pezzo del parco: un trenino da miniera lanciato da una spinta di 2 secondi. Più è carico, più spinta serve per la stessa partenza.'),
      piece: { id: 'miniera', name: 'Il carrello della miniera', desc: 'Parte con la spinta giusta per il carico che porta e corre nel tunnel alla velocità che hai scelto.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la forza del lanciatore e lancia.', 'Regola la forza e lancia: la seconda prova avrà un altro carico.'),
          vals: { e: { m: [[2], [3]], v: [[4], [4]] }, s: { m: [[2, 3], [4, 5]], v: [[4, 6], [2, 4]] } },
          set: { m1: 'm' },
          ask: T('Il carrello porta <b>{m} blocchi</b>. Alla fine della spinta deve andare a <b>{v} m/s</b>.', 'Carico: <b>{m} kg</b>. Dopo i 2 s di spinta il carrello deve andare a <b>{v} m/s</b>.', 'Oggi il trenino porta <b>{m} kg</b>. Dopo i 2 secondi di spinta deve viaggiare a <b>{v} m/s</b>.'),
          measure: 'vP[0]', goal: 'v', tol: { e: 0.3, s: 0.2 },
          ok: T('{got:1} m/s: partenza perfetta!'),
          high: T('{got:1} m/s: troppo veloce! Meno forza.', '{got:1} m/s: troppo. Riduci la forza: di quanto?'),
          low: T('{got:1} m/s: troppo piano. Più forza!', '{got:1} m/s: troppo poco. Aumenta la forza: di quanto?'),
          solve: { F1: 'm * v / 2' },
        },
      ],
      hints: [
        T('Più blocchi porta, più forza serve.', 'In 2 s deve arrivare a v: l’accelerazione è v/2.', 'Prima trova quanta velocità deve guadagnare ogni secondo.'),
        T('Con 2 blocchi serve la forza 4; con 3 blocchi la forza 6.', 'F = m·a = m·v/2.', 'Poi moltiplica per il carico: è la forza. [[F = m·v/2]]'),
      ],
      solution: T('2 blocchi: forza 4. 3 blocchi: forza 6.', 'F = m·v/2: per esempio 3 kg e 4 m/s → 6 N.', 'La forza è il carico per la velocità guadagnata ogni secondo (v diviso 2). [[F = m·v/2]]'),
    },
    {
      id: 'd01-6', kind: 'ripasso', title: 'Ripasso delle forze',
      intro: T('Ripassiamo le forze: spingere, frenare, rispondere!', 'Ripasso: inerzia, F = m·a, azione e reazione.', 'Ripasso: le tre leggi di Newton, nelle cose di tutti i giorni.'),
      steps: [
        {
          kind: 'q',
          text: T('Un disco da hockey scivola sul ghiaccio liscissimo. Che cosa serve perché continui?', 'Un’astronave nello spazio, lontano da tutto, spegne i motori. Che cosa succede alla sua velocità?', 'Una sonda viaggia da decenni verso i confini del sistema solare, a motori spenti. Come fa?'),
          options: [T('niente: va avanti da solo', 'resta la stessa', 'niente la frena, quindi continua'), T('qualcuno che lo spinga sempre', 'diminuisce fino a fermarsi', 'il Sole la spinge'), T('il vento', 'aumenta', 'ha un motore nascosto')],
          answer: 0,
          explain: T('Giusto: se niente lo frena, va avanti da solo. È l’inerzia!', 'Esatto: senza forze la velocità non cambia (prima legge).', 'Esatto: nello spazio quasi niente la frena, e per inerzia continua.'),
        },
        {
          kind: 'q',
          text: T('Spingi con la stessa forza un monopattino e un’auto. Chi parte più in fretta?', 'Su un carrello di 2 kg agisce una forza di 6 N. Se la massa diventa 6 kg, con la stessa forza, l’accelerazione…', 'A fine spesa il carrello pesa il triplo che all’inizio. Con la stessa spinta, quanto in fretta prende velocità?'),
          options: [T('il monopattino', 'passa da 3 a 1 m/s²', 'un terzo di prima'), T('l’auto, più grande', 'passa da 3 a 9 m/s²', 'il triplo di prima'), T('uguali', 'resta 3 m/s²', 'come prima')],
          answer: 0,
          explain: T('Giusto: il monopattino ha molta meno massa, e parte subito.', 'Esatto: a = F/m = 6/6 = 1 m/s².', 'Esatto: massa tripla, accelerazione un terzo. [[a = F / m]]'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.'),
          vals: { e: { a: [2, 3, 4] }, s: { F: [10, 12, 20], a: [2, 4] } },
          calc: { e: '2 * a', s: 'F / a' }, unit: T('m/s', 'kg'), tol: { e: 0, s: 0.01 },
          ask: T('Con <b>2 blocchi</b> il carrello va ogni secondo <b>{a} m/s</b> più veloce. Con <b>1 blocco</b> e la stessa spinta?', 'Una forza di <b>{F} N</b> dà a un carrello un’accelerazione di <b>{a} m/s²</b>. Qual è la sua massa?', 'Spingendo con <b>{F} newton</b>, un carrello guadagna <b>{a} m/s</b> ogni secondo. Quanti kg porta?'),
          explain: T('Giusto: metà blocchi, il doppio più veloce: {ans} m/s.', 'Esatto: m = F/a = {F} / {a} = {ans} kg.', 'Esatto: {F} diviso {a} fa {ans} kg. [[m = F / a]]'),
        },
        {
          kind: 'q',
          text: T('Dalla barchetta salti verso il molo. Che cosa fa la barchetta?', 'Una zanzara colpisce il parabrezza di un’auto. Chi riceve la forza più grande nell’urto?', 'Una zanzara si spiaccica sul parabrezza. Chi ha ricevuto la spinta più forte, la zanzara o l’auto?'),
          options: [T('si allontana un po’', 'sono uguali', 'la stessa spinta: è la zanzara a non reggerla'), T('viene avanti insieme a te', 'la zanzara', 'la zanzara, ovviamente'), T('resta ferma', 'l’auto', 'l’auto, che è più grande')],
          answer: 0,
          explain: T('Giusto: tu spingi la barchetta indietro, lei spinge te avanti.', 'Esatto: azione e reazione sono uguali. Ma la zanzara ha una massa piccolissima, e la stessa forza le dà un’accelerazione enorme.', 'Esatto: le due spinte sono uguali. Solo che per la zanzara è tantissimo, per l’auto quasi niente.'),
        },
        {
          // ponte con la Pista: perché tutto cade insieme
          kind: 'q',
          text: T('Una palla pesante e una leggera cadono insieme. Eppure la Terra tira di più quella pesante. Perché?', 'Nella Pista hai visto che senza aria tutto cade con la stessa g. Con Newton: il peso è P = m·g. Perché un corpo con massa doppia non cade più in fretta?', 'Galileo mostrò che una palla di cannone e una di moschetto cadono insieme. Newton spiegò perché: la Terra tira di più la più pesante, eppure…'),
          options: [T('è anche più difficile da muovere', 'forza doppia, ma anche massa doppia: a = P/m = g', 'la più pesante è anche più difficile da mettere in moto'), T('l’aria sotto di lei la frena di più', 'perché il peso non dipende dalla massa', 'l’aria frena di più la pesante'), T('la Terra si stanca', 'perché la Terra tira tutti allo stesso modo', 'la Terra tira tutte e due allo stesso modo')],
          answer: 0,
          explain: T('Giusto! Tirata più forte, ma anche più carica: le due cose si pareggiano, e cadono insieme.', 'Esatto: P = m·g e a = P/m = g, qualunque sia la massa.', 'Esatto: forza doppia su massa doppia dà la stessa accelerazione. [[a = P/m = m·g/m = g]]'),
        },
      ],
      hints: [T('Ripensa ai carrelli: il binario liscio, i blocchi, la molla.')],
    },
    {
      id: 'd01-7', kind: 'boss', title: 'Il carrello misterioso', win: T('Esperimento riuscito!'),
      sim: 'cart', params: { cars: 1, F1: 3, m1: 3, hide: true, tP: 0, floor: 'liscio', D: 20 }, controls: ['F1'], labels: { F1: { label: 'Forza', min: 1, max: 12, step: 1, unit: 'N' } },
      intro: T(
        'Sono Vetrino. Ho nascosto dei blocchi sotto il telo. Non puoi guardare: puoi solo spingere e osservare. Esperimento al buio!',
        'Sono Vetrino. Sotto il telo c’è una massa che non conosci. Niente bilancia: hai solo la forza, che scegli tu, e il grafico velocità–tempo. Esperimento al buio: trova la massa.',
        'Sono Vetrino. Stavolta niente mito: un esperimento al buio. Sotto il telo c’è un carico misterioso. Hai una spinta che scegli tu e il grafico della velocità: bastano per pesarlo, senza bilancia?'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Fai due lanci con forze diverse. Guarda quanto in fretta sale la linea.', 'Fai almeno due lanci con forze diverse e leggi l’accelerazione: il triangolino sul grafico.') },
        {
          kind: 'q', review: false,
          text: T('Con forza 3 va ogni secondo 1 m/s più veloce. Con forza 6?', 'Con 3 N il carrello misterioso accelera di 1 m/s². Con 6 N l’accelerazione è…', 'Con una spinta di 3 newton il carrello guadagna 1 m/s ogni secondo. Con 6 newton, quanto guadagna?'),
          options: [T('2 m/s ogni secondo', '2 m/s²', '2 m/s ogni secondo'), T('1 m/s, come prima', '1 m/s²', '1 m/s, come prima'), T('6 m/s ogni secondo', '6 m/s²', '6 m/s ogni secondo')],
          answer: 0,
          explain: T('Giusto: spinta doppia, velocità guadagnata doppia.', 'Esatto: con la stessa massa, forza doppia dà accelerazione doppia.', 'Esatto: il doppio della spinta, il doppio della velocità guadagnata.'),
        },
        {
          kind: 'tune', rounds: 2,
          text: T('Regola la forza e lancia.', 'Regola la forza: il carrello deve avere l’accelerazione richiesta.'),
          vals: { e: { a: [[1], [2]] }, s: { a: [[1, 2], [3, 4]] } },
          ask: T('Il carrello misterioso deve andare ogni secondo <b>{a} m/s</b> più veloce.', 'Il carrello misterioso deve accelerare di <b>{a} m/s²</b>.', 'Il carrello misterioso deve guadagnare <b>{a} m/s</b> ogni secondo.'),
          measure: 'a[0]', goal: 'a', tol: 0.05,
          ok: T('Proprio {got:1} m/s in più ogni secondo!', '{got:1} m/s²: esatto!', 'Proprio {got:1} m/s in più ogni secondo!'),
          high: T('Troppo in fretta: meno forza.', '{got:1} m/s²: troppo. Meno forza.', 'Troppo in fretta: {got:1} m/s ogni secondo. Meno spinta.'),
          low: T('Troppo piano: più forza.', '{got:1} m/s²: troppo poco. Più forza.', 'Troppo piano: {got:1} m/s ogni secondo. Più spinta.'),
          solve: { F1: '3 * a' },
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Quanto c’è sotto il telo?'),
          vals: { F: [6, 9, 12] }, derive: { a: 'F / 3' }, calc: 'F / a', unit: 'kg', tol: 0.01,
          ask: T(null, 'Con <b>{F} N</b> il carrello misterioso accelera di <b>{a} m/s²</b>. Qual è la massa nascosta sotto il telo?', 'Spingendo con <b>{F} newton</b>, il carrello misterioso guadagna <b>{a} m/s</b> ogni secondo. Quanti kg nasconde il telo?'),
          explain: T(null, 'Esatto: m = F/a = {F} / {a} = {ans} kg. Vetrino alza il telo: tre blocchi da 1 kg!', 'Esatto: {F} diviso {a} fa {ans} kg. Vetrino alza il telo: tre blocchi da un chilo! [[m = F / a]]'),
        },
        {
          kind: 'q',
          text: T('Vetrino alza il telo: ci sono 3 blocchi. Come potevi capirlo senza guardare?', 'Hai trovato la massa senza bilancia. Che cosa hai usato?', 'Hai pesato il carico senza bilancia. Che cosa misura, allora, la massa?'),
          options: [T('da quanto in fretta parte con la spinta', 'la seconda legge: m = F/a', 'quanto un corpo resiste a cambiare velocità'), T('dal rumore delle ruote sul binario', 'il volume del telo', 'quanto spazio occupa'), T('dal colore del telo', 'solo il tempo di arrivo', 'quanto è alto il mucchio')],
          answer: 0,
          explain: T(
            'Giusto! Più blocchi ci sono, più piano parte con la stessa spinta. Con forza 3 andava 1 m/s più veloce ogni secondo: 3 blocchi.',
            'Esatto: misuri F e a, e la massa è m = F/a. Così si «pesano» anche le cose che non si possono mettere su una bilancia, come i pianeti.',
            'Esatto: la massa è la «pigrizia» di un corpo, quanto resiste ai cambi di velocità. Per questo la si può misurare spingendo.'),
        },
      ],
      hints: [T('Più forza, più in fretta. Prova la forza 3, poi 6.', 'Leggi l’accelerazione sul triangolino del grafico, poi m = F/a.', 'Guarda quanta velocità guadagna ogni secondo, e dividi la forza per quel numero.')],
      solution: T('Sotto il telo ci sono 3 blocchi: con forza 3 va 1 m/s più veloce ogni secondo, con forza 6 il doppio.', 'm = F/a = 3 kg.', 'Il carico è di 3 kg: la forza divisa per la velocità guadagnata ogni secondo. [[m = F / a = 3 kg]]'),
    },
  ],
};
