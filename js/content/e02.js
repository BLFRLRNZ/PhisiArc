// E02 · Corrente e circuiti. Simulazione: i circuiti (circuit.js), in sei modi: il circuito chiuso con l'interruttore,
// la legge di Ohm con il grafico, due lampadine in serie o in parallelo, gli elettrodomestici di casa e il contatore,
// le luci della giostra del parco, la scatola misteriosa.
// La zona fa correre la corrente in un giro chiuso (e mostra che non si consuma), misura la legge di Ohm, mette due
// lampadine in serie e in parallelo, accende la casa fino a far saltare il contatore, costruisce le luci della giostra e
// finisce con l'esperimento al buio di Bilancia: capire dei fili nascosti solo svitando una lampadina.
import { T } from '../util.js';

export default {
  id: 'E02',
  title: 'Corrente e circuiti',
  levels: [
    {
      id: 'e02-1', kind: 'lezione', title: 'Il circuito chiuso',
      sim: 'circuito', params: { mode: 'semplice', chiuso: true, pila: 4.5 }, controls: ['chiuso', 'pila'],
      intro: T(
        'Una pila, dei fili e una lampadina. La pila spinge gli elettroni nei fili, come una pompa spinge l’acqua: se il giro è chiuso corrono, e la lampadina si accende! Prova ad aprire e chiudere l’interruttore.',
        'La <b>corrente elettrica</b> è un flusso di cariche: nei fili di metallo, gli elettroni liberi. La pila li spinge lungo un giro chiuso, il <b>circuito</b>: se l’interruttore lo apre, la corrente si ferma dappertutto. La corrente si misura in <b>ampere</b> (A) con l’amperometro: 1 A vuol dire 1 coulomb al secondo. La spinta della pila si chiama <b>tensione</b> e si misura in <b>volt</b> (V).',
        'La pila è una pompa di cariche: la sua tensione, in volt, dice quanta energia dà a ogni coulomb che passa. Gli elettroni nei fili vanno piano, pochi millimetri al secondo, eppure la luce si accende subito: si mettono in moto tutti insieme, lungo tutto il giro, come l’acqua in un tubo già pieno. [[I = q / t]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova l’interruttore chiuso e aperto.', 'Prova con l’interruttore chiuso e con l’interruttore aperto.'),
          need: [
            { when: 'chiuso', try: { chiuso: true }, msg: T('Prova con l’interruttore chiuso.', 'Manca una prova con l’interruttore chiuso.') },
            { when: '!chiuso', try: { chiuso: false }, msg: T('Ora aprilo.', 'Manca una prova con l’interruttore aperto.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con l’interruttore aperto, la lampadina…', 'Con l’interruttore aperto, la corrente…', 'Perché con l’interruttore aperto non passa corrente da nessuna parte?'),
          options: [T('si spegne', 'si ferma in tutto il circuito', 'perché il giro è interrotto'), T('resta accesa', 'continua fino all’interruttore', 'perché gli elettroni si accumulano tutti sull’interruttore'), T('fa più luce', 'passa più forte', 'perché la pila si spegne quando apri il circuito')],
          answer: 0,
          explain: T('Giusto: senza giro chiuso, niente luce.', 'Esatto: senza un giro chiuso la corrente si ferma ovunque.', 'Esatto: la corrente gira solo in un circuito chiuso.'),
        },
        {
          kind: 'q',
          text: T('Gli amperometri prima e dopo la lampadina segnano…', 'L’amperometro prima della lampadina e quello dopo segnano…', 'La lampadina «consuma» la corrente?'),
          options: [T('lo stesso', 'la stessa corrente', 'no: è la stessa prima e dopo'), T('di più prima', 'di più prima della lampadina', 'sì: dopo la lampadina ne resta meno'), T('di più dopo', 'di più dopo la lampadina', 'sì: la consuma quasi tutta')],
          answer: 0,
          explain: T('Giusto: la corrente non si consuma!', 'Esatto: la corrente non si consuma: gli elettroni che entrano sono quelli che escono.', 'Esatto: la lampadina usa l’energia delle cariche, non le cariche: quante ne entrano, tante ne escono.'),
        },
        {
          kind: 'free',
          text: T('Ora prova la pila più debole e la più forte.', 'Prova la pila da 1,5 V e quella da 9 V.'),
          need: [
            { when: 'pila == 1.5 && chiuso', try: { pila: 1.5, chiuso: true }, msg: T('Prova la pila più debole, con il giro chiuso.', 'Manca la pila da 1,5 V, con l’interruttore chiuso.') },
            { when: 'pila == 9 && chiuso', try: { pila: 9, chiuso: true }, msg: T('Ora la più forte, con il giro chiuso.', 'Manca la pila da 9 V, con l’interruttore chiuso.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la pila più forte, la lampadina…', 'Con una pila da 9 V invece che da 1,5 V…', 'Se gli elettroni vanno così piano, perché la luce si accende appena chiudi l’interruttore?'),
          options: [T('fa più luce', 'passa più corrente', 'perché partono tutti insieme'), T('fa meno luce', 'passa meno corrente', 'perché la luce corre nei fili più veloce degli elettroni'), T('fa la stessa luce', 'non cambia niente', 'perché la lampadina ha già i suoi elettroni pronti')],
          answer: 0,
          explain: T('Giusto: più spinta, più luce.', 'Esatto: più tensione, più corrente, e la lampadina fa più luce.', 'Esatto: si mettono in moto tutti insieme, in tutto il giro: il filo è già pieno di elettroni, e la spinta arriva a tutti quasi subito.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Quanta corrente.'),
          vals: { q: [3, 6, 9] }, calc: 'q / 10', unit: 'A', tol: 0.02,
          ask: T(null,
            'In un filo passano <b>{q} coulomb</b> di carica in 10 secondi. Quanta corrente passa, in ampere?',
            'In 10 s passano <b>{q} C</b>: corrente? [[I = q / t]]'),
          explain: T(null, 'Esatto: I = {q} C / 10 s = {ans:1} A.', 'Esatto: {ans:1} A.'),
        },
      ],
      hints: [T('Il giro deve essere chiuso.', 'Corrente uguale prima e dopo la lampadina.', 'La corrente non si consuma: si consuma energia.')],
      solution: T(
        'Con il giro chiuso la lampadina si accende, e la corrente è la stessa prima e dopo.',
        'Circuito chiuso: la corrente è uguale in tutto il giro, e cresce con la tensione.',
        'La corrente gira in un circuito chiuso e non si consuma.'),
    },
    {
      id: 'e02-2', kind: 'lezione', title: 'La legge di Ohm',
      sim: 'circuito', params: { mode: 'ohm', V: 6, R: 20 }, controls: ['V', 'R'],
      intro: T(
        'Più la pila spinge, più corrente passa. Ma ogni cosa nel circuito frena un po’ gli elettroni: questo freno si chiama resistenza. Prova a spingere di più e a frenare di più!',
        'Nel 1827 Georg Ohm scoprì che in un filo la corrente è proporzionale alla tensione: <b>I = V/R</b>, dove R è la <b>resistenza</b>, misurata in <b>ohm</b> (Ω). Raddoppi la tensione, raddoppia la corrente; raddoppi la resistenza, la corrente si dimezza. Un filo lungo e sottile ha più resistenza di uno corto e grosso.',
        'La resistenza è l’attrito degli elettroni: nel loro cammino urtano gli atomi del metallo e lo scaldano. Così funzionano il tostapane, il phon e la vecchia lampadina a incandescenza, il cui filo arriva a 2500 °C. Nel grafico, la legge di Ohm è una retta: più ripida, meno resistenza. [[V = R · I]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una spinta piccola e una grande, con la stessa resistenza.', 'Prova una tensione di 4 V o meno e una di 10 V o più, con la stessa resistenza.'),
          need: [
            { when: 'V >= 1 && V <= 4', try: { V: 4 }, msg: T('Prova una spinta piccola.', 'Manca una prova fra 1 e 4 V.') },
            { when: 'V >= 10', try: { V: 10 }, msg: T('Ora una spinta grande.', 'Manca una prova a 10 V o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Se la pila spinge il doppio, la corrente…', 'Raddoppiando la tensione, la corrente…', 'Perché nel grafico la legge di Ohm è una retta che passa per lo zero?'),
          options: [T('raddoppia', 'raddoppia', 'perché la corrente è proporzionale alla tensione'), T('si dimezza', 'si dimezza', 'perché la corrente cresce sempre più in fretta'), T('resta uguale', 'resta uguale', 'perché la resistenza cresce con la tensione')],
          answer: 0,
          explain: T('Giusto: il doppio della spinta, il doppio della corrente.', 'Esatto: I = V/R, con V al numeratore.', 'Esatto: tensione doppia, corrente doppia.'),
        },
        {
          kind: 'free',
          text: T('Ora cambia la resistenza: prova la più piccola e la più grande.', 'Prova R = 10 Ω e R = 40 Ω, con la stessa tensione.', 'Prova la resistenza da 10 Ω e quella da 40 Ω, con la stessa tensione.'),
          need: [
            { when: 'R == 10', try: { R: 10 }, msg: T('Prova la resistenza più piccola.', 'Manca R = 10 Ω.', 'Manca la resistenza da 10 Ω.') },
            { when: 'R == 40', try: { R: 40 }, msg: T('Ora la più grande.', 'Manca R = 40 Ω.', 'Manca la resistenza da 40 Ω.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con più resistenza, la corrente…', 'Con una resistenza quattro volte più grande, la corrente…', 'Perché il filo del tostapane si scalda così tanto?'),
          options: [T('cala', 'diventa un quarto', 'per la resistenza del filo'), T('cresce', 'diventa quattro volte più grande', 'perché il filo è vicino al pane caldo'), T('non cambia', 'resta uguale', 'perché la corrente si consuma nel filo')],
          answer: 0,
          explain: T('Giusto: più freno, meno corrente.', 'Esatto: I = V/R, con R al denominatore.', 'Esatto: gli elettroni urtano gli atomi e gli cedono energia, che diventa calore.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La legge di Ohm.'),
          vals: { R: [4, 6, 24] }, calc: '12 / R', unit: 'A', tol: 0.02,
          ask: T(null,
            'Una resistenza di <b>{R} Ω</b> è collegata a una pila da 12 V. Quanta corrente passa?',
            'Resistenza di <b>{R} Ω</b>, tensione di 12 V: corrente? [[I = V / R]]'),
          explain: T(null, 'Esatto: I = 12 V / {R} Ω = {ans:1} A.', 'Esatto: {ans:1} A.'),
        },
        {
          kind: 'q',
          text: T('Che cosa fa la resistenza agli elettroni?', 'Quale filo ha più resistenza?', 'Perché i cavi che portano la corrente lontano sono grossi?'),
          options: [T('li frena', 'uno lungo e sottile', 'per avere poca resistenza'), T('li spinge', 'uno corto e grosso', 'per essere più robusti contro il vento'), T('li moltiplica', 'sono tutti uguali', 'per portare più tensione')],
          answer: 0,
          explain: T('Giusto: la resistenza frena la corrente.', 'Esatto: più lungo e più sottile, più resistenza.', 'Esatto: un filo grosso ha poca resistenza, e spreca meno energia in calore.'),
        },
      ],
      hints: [T('Più spinta, più corrente; più freno, meno corrente.', 'I = V/R: cresce con V, cala con R.', 'La corrente è proporzionale alla tensione e inversamente proporzionale alla resistenza.')],
      solution: T(
        'Più la pila spinge, più corrente passa; più resistenza, meno corrente.',
        'I = V/R: con 12 V e 6 Ω passano 2 A.',
        'La legge di Ohm: la corrente cresce con la tensione e cala con la resistenza.'),
    },
    {
      id: 'e02-3', kind: 'prevedi', title: 'Due lampadine',
      sim: 'circuito', params: { mode: 'due', coll: 'serie', svita: false }, controls: [],
      intro: T(
        'Due lampadine e una pila. Si possono mettere in fila, una dopo l’altra, oppure una accanto all’altra, ognuna con la sua strada. Fanno la stessa luce? E se ne sviti una? Prima indovina, poi guarda!',
        'Due modi di collegare due lampadine: <b>in serie</b>, una dopo l’altra sullo stesso filo, oppure <b>in parallelo</b>, ognuna sulla sua strada. Prevedi quanta luce fanno, e che cosa succede se ne sviti una.',
        'In serie la corrente ha una strada sola; in parallelo ne ha due. Questa differenza decide come sono fatte le luci di Natale e l’impianto di casa. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { coll: 'serie', svita: false }, predict: [{ coll: 'serie', svita: false }],
          text: T('Due lampadine in fila: quanta luce fanno?', 'Due lampadine in serie: ognuna fa…', 'Due lampadine in serie sulla stessa pila: quanta luce fa ognuna?'),
          options: [T('meno luce di una sola', 'meno luce di una lampadina da sola', 'meno di una sola: si dividono la tensione'), T('la stessa luce di una sola', 'la stessa luce di una lampadina da sola', 'la stessa di una sola: la pila è uguale'), T('il doppio della luce', 'il doppio della luce', 'il doppio: sono due')],
          answer: 0,
          explain: T('Giusto: si dividono la pila.', 'Esatto: in serie si dividono la tensione della pila.', 'Esatto: ognuna ha metà della tensione, e fa un quarto della luce.'),
          solution: T('Meno luce di una sola.'),
        },
        {
          kind: 'q', set: { coll: 'parallelo', svita: false }, predict: [{ coll: 'parallelo', svita: false }],
          text: T('E le due lampadine una accanto all’altra?', 'E in parallelo, ognuna fa…', 'E in parallelo, quanta luce fa ognuna?'),
          options: [T('la luce piena, come da sola', 'la luce piena, come da sola', 'la luce piena'), T('metà della luce', 'metà della luce', 'metà: la pila si divide in due'), T('niente luce', 'niente: si bloccano a vicenda', 'nessuna luce: i fili si incrociano')],
          answer: 0,
          explain: T('Giusto: ognuna ha la sua strada.', 'Esatto: ognuna ha tutta la tensione della pila.', 'Esatto: ognuna è collegata direttamente alla pila, e ha tutta la sua tensione.'),
          solution: T('La luce piena, come da sola.'),
        },
        {
          kind: 'q', set: { coll: 'serie', svita: true }, predict: [{ coll: 'serie', svita: true }],
          text: T('In fila, sviti una lampadina. L’altra…', 'In serie, sviti la seconda lampadina. La prima…', 'In serie, sviti una lampadina. Che cosa succede all’altra?'),
          options: [T('si spegne', 'si spegne', 'si spegne: il giro è interrotto'), T('resta accesa', 'resta accesa come prima', 'resta accesa: ha la sua corrente'), T('fa più luce', 'fa più luce', 'fa più luce: ha tutta la pila')],
          answer: 0,
          explain: T('Giusto: si spegne anche l’altra!', 'Esatto: in serie c’è un giro solo, e si interrompe.', 'Esatto: in serie la corrente ha una strada sola.'),
          solution: T('Si spegne.'),
        },
        {
          kind: 'q', set: { coll: 'parallelo', svita: true }, predict: [{ coll: 'parallelo', svita: true }],
          text: T('Una accanto all’altra, sviti una lampadina. L’altra…', 'In parallelo, sviti la seconda lampadina. La prima…', 'In parallelo, sviti una lampadina. Che cosa succede all’altra?'),
          options: [T('resta accesa', 'resta accesa', 'resta accesa: ha la sua strada'), T('si spegne', 'si spegne', 'si spegne: il giro è interrotto'), T('fa più luce', 'fa più luce', 'fa più luce: le arriva anche la corrente dell’altra')],
          answer: 0,
          explain: T('Giusto: ha la sua strada!', 'Esatto: in parallelo ogni lampadina ha il suo giro.', 'Esatto: la sua strada resta chiusa.'),
          solution: T('Resta accesa.'),
        },
        {
          kind: 'q',
          text: T('Allora in casa le lampadine sono…', 'In casa, le luci sono collegate…', 'Perché in casa le luci sono collegate in parallelo?'),
          options: [T('una accanto all’altra', 'in parallelo', 'perché ognuna ha tutta la tensione e si accende da sola'), T('in fila, una dopo l’altra', 'in serie', 'perché così consumano meno'), T('a caso', 'metà in serie e metà in parallelo', 'perché così i fili sono più corti')],
          answer: 0,
          explain: T('Giusto: così ognuna si accende da sola.', 'Esatto: così ognuna si accende e si spegne da sola.', 'Esatto: e se una si brucia, le altre restano accese.'),
        },
      ],
      hints: [T('In fila si dividono la pila; una accanto all’altra no.', 'In serie una strada sola, in parallelo una strada per ognuna.', 'Serie: tensione divisa; parallelo: tensione intera.')],
    },
    {
      id: 'e02-4', kind: 'lezione', title: 'In serie e in parallelo',
      sim: 'circuito', params: { mode: 'due', coll: 'serie', svita: false }, controls: ['coll', 'svita'],
      intro: T(
        'In fila la corrente fa una strada sola, e passa da tutte e due le lampadine. Una accanto all’altra si divide: un po’ di qua, un po’ di là. Guarda quanta corrente esce dalla pila!',
        'Con lampadine da 10 Ω e una pila da 6 V: <b>in serie</b> le resistenze si sommano (20 Ω) e passano 6/20 = 0,3 A; ogni lampadina ha solo 3 V. <b>In parallelo</b> ognuna ha tutti i 6 V: in ognuna passano 0,6 A, e dalla pila escono 1,2 A. Più lampadine in parallelo, più corrente chiede la pila.',
        'In serie si sommano le resistenze, in parallelo le correnti. Le luci di Natale di una volta erano in serie: una sola lampadina bruciata spegneva tutto il filo, e bisognava provarle una per una per trovarla. [[R = R₁ + R₂]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova le lampadine in fila e una accanto all’altra.', 'Prova il collegamento in serie e quello in parallelo.'),
          need: [
            { when: "coll == 'serie' && !svita", try: { coll: 'serie', svita: false }, msg: T('Prova in fila, tutte e due avvitate.', 'Manca la prova in serie, con tutte e due le lampadine.') },
            { when: "coll == 'parallelo' && !svita", try: { coll: 'parallelo', svita: false }, msg: T('Ora una accanto all’altra.', 'Manca la prova in parallelo, con tutte e due le lampadine.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando esce più corrente dalla pila?', 'In quale collegamento la pila dà più corrente?', 'Perché in parallelo la pila si scarica più in fretta?'),
          options: [T('una accanto all’altra', 'in parallelo: 1,2 A', 'perché dà più corrente'), T('in fila', 'in serie: 0,3 A', 'perché le lampadine in parallelo sono più calde'), T('è uguale', 'è uguale nei due casi', 'perché la corrente torna indietro due volte')],
          answer: 0,
          explain: T('Giusto: ogni lampadina ha la sua strada.', 'Esatto: 0,6 A per ognuna, 1,2 A in tutto.', 'Esatto: c’è una strada per ogni lampadina: più strade, più corrente, più energia al secondo.'),
        },
        {
          kind: 'q',
          text: T('In fila, ogni lampadina ha…', 'In serie, ogni lampadina ha…', 'In serie, che cosa si divide fra le lampadine?'),
          options: [T('metà della pila', 'metà della tensione della pila', 'la tensione della pila'), T('tutta la pila', 'tutta la tensione della pila', 'la corrente della pila'), T('il doppio', 'il doppio della tensione', 'la resistenza delle lampadine')],
          answer: 0,
          explain: T('Giusto: si dividono la spinta.', 'Esatto: 3 V ciascuna.', 'Esatto: la corrente è la stessa in tutte; la tensione si divide.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Due resistenze in serie.'),
          vals: { R: [2, 3, 6] }, calc: '12 / (2 * R)', unit: 'A', tol: 0.02,
          ask: T(null,
            'Due lampadine da <b>{R} Ω</b> ciascuna, in serie, su una pila da 12 V. Quanta corrente passa?',
            'Due resistenze da <b>{R} Ω</b> in serie, 12 V: corrente? [[I = V / (R₁ + R₂)]]'),
          explain: T(null, 'Esatto: in serie le resistenze si sommano, e I = 12 V / (2 × {R} Ω) = {ans:1} A.', 'Esatto: {ans:1} A.'),
        },
        {
          kind: 'q',
          text: T('Le luci di Natale di una volta: se ne bruciava una, si spegnevano tutte. Erano…', 'Una lampadina bruciata spegne tutte le luci di Natale. Sono…', 'Perché una sola lampadina bruciata spegneva tutte le vecchie luci di Natale?'),
          options: [T('in fila', 'in serie', 'perché erano in serie: un giro solo, interrotto'), T('una accanto all’altra', 'in parallelo', 'perché erano in parallelo'), T('scariche', 'senza pila', 'perché la lampadina bruciata consumava tutta la corrente')],
          answer: 0,
          explain: T('Giusto: in fila, come in serie.', 'Esatto: in serie, con un giro solo.', 'Esatto: oggi sono quasi sempre in parallelo, o in tanti gruppi.'),
        },
      ],
      hints: [T('In fila la pila si divide; una accanto all’altra, la corrente si somma.', 'Serie: R₁ + R₂; parallelo: correnti che si sommano.', 'In serie si sommano le resistenze, in parallelo le correnti.')],
      solution: T(
        'In fila meno luce e meno corrente; una accanto all’altra luce piena e più corrente.',
        'Serie: 0,3 A e luce debole; parallelo: 1,2 A e luce piena.',
        'Serie: resistenze sommate; parallelo: correnti sommate.'),
    },
    {
      id: 'e02-5', kind: 'lezione', title: 'Quando salta il contatore',
      sim: 'circuito', params: { mode: 'casa', led: true, tv: false, phon: false, forno: false, lavatrice: false }, controls: ['led', 'tv', 'phon', 'forno', 'lavatrice'],
      intro: T(
        'In casa ogni elettrodomestico chiede la sua corrente. Il contatore controlla: se tutti insieme ne chiedono troppa, salta e spegne tutto! Accendi gli elettrodomestici e guarda.',
        'La <b>potenza</b> elettrica è l’energia che un apparecchio usa ogni secondo: <b>P = V·I</b>, in watt (W). In casa la tensione è 230 V e gli apparecchi sono in parallelo: le loro correnti, e le loro potenze, si sommano. Il contatore di casa di solito regge 3 kW: forno e phon insieme lo fanno saltare. In bolletta si pagano i <b>kilowattora</b> (kWh): 1 kW acceso per un’ora.',
        'Il contatore ti protegge: più apparecchi accesi, più corrente nei fili, e i fili si scaldano. Il cortocircuito è il caso estremo: la corrente trova una strada senza resistenza, diventa enorme e può incendiare i fili. Per questo ci sono il salvavita e gli interruttori automatici. [[P = V · I]]'),
      steps: [
        {
          kind: 'free',
          text: T('Accendi il forno da solo, poi il forno e il phon insieme.', 'Prova il forno da solo, poi il forno con il phon.'),
          need: [
            { when: 'forno && !phon && !lavatrice', try: { forno: true, phon: false, lavatrice: false }, msg: T('Prova il forno senza phon e senza lavatrice.', 'Manca il forno da solo, senza phon e senza lavatrice.') },
            { when: 'forno && phon', try: { forno: true, phon: true }, msg: T('Ora accendi anche il phon.', 'Manca il forno con il phon.') },
          ],
        },
        {
          kind: 'q',
          text: T('Forno e phon insieme: che cosa succede?', 'Forno e phon insieme fanno 3500 W. Che cosa succede?', 'Perché forno e phon insieme fanno saltare il contatore?'),
          options: [T('salta il contatore', 'il contatore salta', 'perché le loro potenze si sommano e superano i 3 kW'), T('funziona tutto', 'funziona tutto, ma più piano', 'perché il phon disturba il forno'), T('si spegne solo il phon', 'si spegne solo il forno', 'perché due apparecchi non possono stare sulla stessa linea')],
          answer: 0,
          explain: T('Giusto: troppa corrente, il contatore salta.', 'Esatto: 3500 W sono più dei 3000 che il contatore regge.', 'Esatto: in parallelo le correnti si sommano: 3500 W a 230 V fanno più di 15 A.'),
        },
        {
          kind: 'q',
          text: T('Quale chiede più energia?', 'Quale apparecchio ha più potenza?', 'Perché una lampadina LED consuma così poco?'),
          options: [T('il forno', 'il forno, 2000 W', 'perché scalda pochissimo'), T('la lampadina', 'la TV, 100 W', 'perché è più piccola delle altre'), T('la TV', 'la lampadina LED, 10 W', 'perché resta accesa meno tempo')],
          answer: 0,
          explain: T('Giusto: il forno è un gran mangione.', 'Esatto: 2000 W, duecento volte la lampadina LED.', 'Esatto: trasforma quasi tutta l’energia in luce; una lampadina a incandescenza scaldava più di quanto illuminasse.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La corrente del phon.'),
          vals: { P: [1150, 1380, 2300] }, calc: 'P / 230', unit: 'A', tol: 0.05,
          ask: T(null,
            'Un phon da <b>{P} W</b> è collegato alla presa di casa, a 230 V. Quanta corrente passa?',
            'Phon da <b>{P} W</b>, a 230 V: corrente? [[I = P / V]]'),
          explain: T(null, 'Esatto: I = {P} W / 230 V = {ans:0} A.', 'Esatto: {ans:0} A.'),
        },
        {
          kind: 'q',
          text: T('Perché non bisogna attaccare troppe spine alla stessa ciabatta?', 'Perché troppe spine sulla stessa ciabatta sono pericolose?', 'Che cos’è un cortocircuito?'),
          options: [T('i fili si scaldano troppo', 'le correnti si sommano e i fili si scaldano', 'una strada senza resistenza: la corrente diventa enorme'), T('le spine si annoiano', 'la ciabatta consuma corrente', 'due fili dello stesso colore che si toccano'), T('la corrente scappa via', 'la tensione si moltiplica', 'una corrente che va al contrario')],
          answer: 0,
          explain: T('Giusto: troppa corrente scalda i fili.', 'Esatto: la ciabatta porta la somma di tutte le correnti.', 'Esatto: senza resistenza la corrente diventa enorme, e i fili si arroventano.'),
        },
      ],
      hints: [T('Le potenze si sommano: oltre 3000 watt il contatore salta.', 'P = V·I; in parallelo le potenze si sommano: oltre 3 kW il contatore salta.', 'In parallelo si sommano le correnti, e con loro le potenze.')],
      solution: T(
        'Forno e phon insieme fanno 3500 watt: il contatore salta.',
        'Forno + phon = 3500 W > 3 kW: il contatore salta.',
        'Le potenze in parallelo si sommano: oltre il limite del contatore, salta.'),
    },
    {
      id: 'e02-6', kind: 'costruisci', title: 'Le luci della giostra',
      sim: 'circuito', params: { mode: 'catena', V: 12, n: 4 }, controls: ['n'],
      intro: T(
        'Nel parco la giostra si accende di luci! Le lampadine sono in fila sullo stesso filo, e ognuna vuole 3 volt. Quante ne metti con la pila della giostra? Troppo poche si bruciano, troppe fanno poca luce.',
        'Costruisci le luci della giostra: tante lampadine in serie, ognuna da 3 V. In serie la tensione della pila si divide in parti uguali: con n lampadine, ognuna ha V/n. Trova n perché ogni lampadina abbia proprio 3 V.',
        'Le luci della giostra: lampadine in serie che si dividono la tensione. Le vecchie luci di Natale funzionavano così, con decine di lampadine piccole sulla presa di casa. [[n = V / 3 V]]'),
      piece: { id: 'luci', name: 'Le luci della giostra', desc: 'Una catena di lampadine in serie: ognuna prende la sua parte della tensione.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quante lampadine, poi accendi.', 'Scegli quante lampadine mettere in serie, poi accendi.'),
          vals: { e: { V: [[12], [24]] }, s: { V: [[12, 18], [24, 30]] } },
          set: { V: 'V' },
          ask: T(
            'La pila della giostra è da <b>{V} volt</b>. Ogni lampadina vuole 3 volt: quante ne metti in fila?',
            'Pila da <b>{V} V</b>, lampadine da 3 V in serie: quante ne servono?',
            'Pila: <b>{V} V</b>; lampadine da 3 V. Quante in serie? [[n = V / 3 V]]'),
          measure: 'n', goal: 'V / 3', tol: 0.4,
          ok: T('Perfetto! La giostra brilla di luci!', 'Esatto: 3 V per ogni lampadina.'),
          high: T('Troppe lampadine: ognuna ha meno di 3 volt e fa poca luce. Togline qualcuna.', 'Troppe: ognuna ha meno di 3 V.'),
          low: T('Troppo poche: ognuna ha più di 3 volt e si brucia! Aggiungine.', 'Troppo poche: ognuna ha più di 3 V e si brucia.'),
          solve: { n: 'V / 3' },
        },
        {
          kind: 'q',
          text: T('Se una lampadina della giostra si brucia…', 'In questa catena, se una lampadina si brucia…', 'Perché le lampadine della catena devono essere tutte uguali?'),
          options: [T('si spengono tutte', 'si spengono tutte', 'per dividere la tensione in parti uguali'), T('si spegne solo quella', 'si spegne solo quella', 'perché devono avere lo stesso colore'), T('le altre fanno più luce', 'le altre fanno più luce', 'perché in serie la corrente cambia da una all’altra')],
          answer: 0,
          explain: T('Giusto: sono in fila, con una strada sola.', 'Esatto: in serie c’è un giro solo, e si interrompe.', 'Esatto: in serie la tensione si divide in base alle resistenze: uguali, parti uguali.'),
        },
      ],
      hints: [T('Dividi i volt della pila per 3.', 'n = V / 3 V: con 12 V, 4 lampadine.', 'Ogni lampadina deve avere 3 V: dividi la tensione della pila.')],
      solution: T('Con 12 volt, 4 lampadine; con 24 volt, 8.', 'n = V / 3 V: 4, 6, 8 o 10 lampadine.', 'Tante lampadine quante ne servono per dividere la tensione in parti da 3 V.'),
    },
    {
      id: 'e02-7', kind: 'ripasso', title: 'Ripasso dei circuiti',
      intro: T('Ripassiamo: pile, lampadine, interruttori e contatori!', 'Ripasso: corrente, legge di Ohm, serie e parallelo, potenza.', 'Ripasso: la corrente e i circuiti.'),
      steps: [
        {
          kind: 'q',
          text: T('Perché una lampadina si accenda, il giro deve essere…', 'Che cos’è la corrente elettrica?', 'Che cosa misura un ampere?'),
          options: [T('chiuso', 'cariche in movimento', 'un coulomb di carica che passa ogni secondo'), T('aperto', 'la spinta che dà la pila', 'la spinta che la pila dà alle cariche'), T('lunghissimo', 'l’energia che usa la lampadina', 'quanto frena un filo')],
          answer: 0,
          explain: T('Giusto: un giro chiuso.', 'Esatto: cariche in movimento, in un giro chiuso.', 'Esatto: 1 A = 1 C al secondo.'),
        },
        {
          kind: 'q',
          text: T('Prima e dopo la lampadina, la corrente è…', 'La corrente prima e dopo la lampadina è…', 'Che cosa consuma, davvero, una lampadina?'),
          options: [T('uguale', 'uguale', 'energia, non cariche'), T('più forte prima', 'più forte prima', 'una parte della corrente'), T('più forte dopo', 'più forte dopo', 'gli elettroni che la attraversano')],
          answer: 0,
          explain: T('Giusto: la corrente non si consuma.', 'Esatto: non si consuma.', 'Esatto: le cariche passano tutte; lasciano energia.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Ancora la legge di Ohm.'),
          vals: { I: [0.5, 2, 3] }, calc: '12 / I', unit: 'Ω', tol: 0.1,
          ask: T(null,
            'Con una pila da 12 V in un filo passano <b>{I} A</b>. Quanto vale la resistenza del filo?',
            'Tensione 12 V, corrente <b>{I} A</b>: resistenza? [[R = V / I]]'),
          explain: T(null, 'Esatto: R = 12 V / {I} A = {ans:0} Ω.', 'Esatto: {ans:0} Ω.'),
        },
        {
          kind: 'q',
          text: T('Le luci di casa sono…', 'Le luci di casa sono collegate…', 'In parallelo, che cosa hanno di uguale tutte le lampadine?'),
          options: [T('una accanto all’altra', 'in parallelo', 'la tensione'), T('in fila, una dopo l’altra', 'in serie', 'la corrente, sempre'), T('tutte su una pila', 'senza fili', 'la resistenza')],
          answer: 0,
          explain: T('Giusto: ognuna con la sua strada.', 'Esatto: così si accendono una per volta.', 'Esatto: tutte hanno i 230 V della presa.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’energia in bolletta.'),
          vals: { t: [1.5, 2, 3] }, calc: '2 * t', unit: 'kWh', tol: 0.05,
          ask: T(null,
            'Un forno da 2 kW resta acceso per <b>{t} ore</b>. Quanta energia usa, in kilowattora?',
            'Forno da 2 kW acceso <b>{t} h</b>: energia in kWh? [[E = P · t]]'),
          explain: T(null, 'Esatto: 2 kW × {t} h = {ans:0} kWh.', 'Esatto: {ans:0} kWh.'),
        },
        {
          kind: 'q',
          text: T('Il contatore salta quando…', 'Il contatore salta quando…', 'Perché il contatore di casa ha un limite?'),
          options: [T('si accendono troppe cose insieme', 'la potenza totale supera il suo limite', 'per non far scaldare i fili'), T('si apre il frigorifero', 'si accende una lampadina', 'per non far consumare troppa luce'), T('piove', 'la tensione scende', 'perché la corrente si consuma')],
          answer: 0,
          explain: T('Giusto: troppa corrente tutta insieme.', 'Esatto: le potenze si sommano.', 'Esatto: più corrente, più calore nei fili.'),
        },
      ],
    },
    {
      id: 'e02-8', kind: 'boss', who: 'bilancia', title: 'La scatola misteriosa', win: T('Esperimento riuscito!'),
      sim: 'circuito', params: { mode: 'scatola', nascosto: 'parallelo', svitaA: false }, controls: ['svitaA'],
      intro: T(
        'Sono Bilancia. Esperimento al buio: due lampadine sopra una scatola chiusa, e dentro dei fili nascosti. Sono in fila o una accanto all’altra? La scatola non si apre: puoi solo svitare una lampadina e guardare.',
        'Sono Bilancia. Esperimento al buio: in una scatola chiusa due lampadine, A e B, sono collegate a una pila, ma i fili non si vedono. In serie o in parallelo? Puoi svitare la lampadina A, guardare la B e leggere l’amperometro. Le scatole sono due.',
        'Sono Bilancia. Esperimento al buio: capire un circuito senza vederlo, solo dagli effetti. È quello che fa un elettricista quando cerca un guasto dentro i muri. Due scatole chiuse, due lampadine ciascuna: come sono collegate?'),
      steps: [
        {
          kind: 'q',
          text: T('Come lo scopri, senza aprire la scatola?', 'Come puoi scoprirlo senza aprire la scatola?', 'Qual è l’esperimento che decide?'),
          options: [T('sviti A e guardi B', 'sviti la lampadina A e guardi se B resta accesa', 'svitare A: in serie B si spegne, in parallelo no'), T('scuoti la scatola', 'scuoti la scatola e ascolti', 'pesare la scatola, piena di fili'), T('guardi la pila', 'guardi il colore delle lampadine', 'misurare quanto è calda la scatola')],
          answer: 0,
          explain: T('Giusto: una prova semplice e furba.', 'Esatto: in serie, svitandone una si spegne anche l’altra.', 'Esatto: è l’esperimento che separa le due ipotesi.'),
        },
        {
          kind: 'free', set: { nascosto: 'parallelo', svitaA: false },
          text: T('Prima scatola: prova con A avvitata, poi con A svitata.', 'Prima scatola: prova con la lampadina A avvitata e poi svitata.'),
          need: [
            { when: '!svitaA', try: { svitaA: false }, msg: T('Prova con A avvitata.', 'Manca la prova con A avvitata.') },
            { when: 'svitaA', try: { svitaA: true }, msg: T('Ora svita A.', 'Manca la prova con A svitata.') },
          ],
        },
        {
          kind: 'q',
          text: T('Hai svitato A, e B è rimasta accesa. Le due lampadine sono…', 'Svitando A, la B resta accesa. Nella prima scatola sono…', 'Prima scatola: B resta accesa senza A. Che cosa concludi?'),
          options: [T('una accanto all’altra', 'in parallelo', 'in parallelo: B ha la sua strada'), T('in fila', 'in serie', 'in serie: la corrente passa da A a B'), T('non si può dire', 'non si può dire', 'non si può dire senza aprire')],
          answer: 0,
          explain: T('Giusto: B ha la sua strada.', 'Esatto: in parallelo.', 'Esatto: ognuna ha il suo giro.'),
        },
        {
          kind: 'free', set: { nascosto: 'serie', svitaA: false },
          text: T('Seconda scatola: rifai la stessa prova.', 'Seconda scatola: prova di nuovo con A avvitata e svitata.'),
          need: [
            { when: '!svitaA', try: { svitaA: false }, msg: T('Prova con A avvitata.', 'Manca la prova con A avvitata.') },
            { when: 'svitaA', try: { svitaA: true }, msg: T('Ora svita A.', 'Manca la prova con A svitata.') },
          ],
        },
        {
          kind: 'q',
          text: T('Ora, svitando A, si spegne anche B. Sono…', 'Svitando A si spegne anche B. Nella seconda scatola sono…', 'Seconda scatola: senza A si spegne anche B, e prima erano deboli. Che cosa concludi?'),
          options: [T('in fila', 'in serie', 'in serie: un giro solo'), T('una accanto all’altra', 'in parallelo', 'in parallelo, ma con una pila scarica'), T('rotte', 'bruciate', 'che B è bruciata')],
          answer: 0,
          explain: T('Giusto: in fila, con una strada sola.', 'Esatto: in serie.', 'Esatto: e anche la luce debole lo diceva: si dividevano la pila.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Dentro la seconda scatola.'),
          vals: { I: [0.3, 0.2, 0.15] }, calc: '6 / I / 2', unit: 'Ω', tol: 0.1,
          ask: T(null,
            'Una scatola come la seconda, con due lampadine uguali in serie: la pila è da 6 V e l’amperometro segna <b>{I} A</b>. Quanto vale la resistenza di ogni lampadina?',
            'Due lampadine uguali in serie, 6 V, <b>{I} A</b>: resistenza di ognuna? [[R = V / I, divisa per due]]'),
          explain: T(null, 'Esatto: in tutto R = 6 V / {I} A, e ogni lampadina ne ha metà: {ans:0} Ω.', 'Esatto: {ans:0} Ω.'),
        },
        {
          kind: 'q',
          text: T('E le prese di casa? Se si stacca il frigo, la TV resta accesa. Sono…', 'Se stacchi il frigo, la TV resta accesa. Le prese di casa sono…', 'Che cosa dice, delle prese di casa, che staccando il frigo la TV resti accesa?'),
          options: [T('una accanto all’altra', 'in parallelo', 'che sono in parallelo, come la prima scatola'), T('in fila, come la seconda', 'in serie', 'che sono in serie, come la seconda scatola'), T('magiche', 'senza fili', 'che la TV ha una pila sua')],
          answer: 0,
          explain: T('Giusto: come la prima scatola!', 'Esatto: in parallelo, come la prima scatola.', 'Esatto: e ognuna ha i 230 V della rete.'),
        },
      ],
      hints: [T('Svita A e guarda bene B.', 'In serie, svitandone una si spegne anche l’altra.', 'Serie: un giro solo; parallelo: un giro per ognuna.')],
      solution: T(
        'La prima scatola ha le lampadine una accanto all’altra, la seconda in fila.',
        'Prima scatola in parallelo, seconda in serie.',
        'Il parallelo tiene accesa B senza A; la serie no.'),
    },
  ],
};
