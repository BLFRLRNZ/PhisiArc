// OT01 · Raggi e riflessione. Simulazione: raggi e specchi (rays.js), in sette modi: l'ombra di un pupazzo davanti a
// una lampada, la camera oscura, il laser sullo specchio, l'immagine dietro lo specchio, la superficie liscia o ruvida,
// il labirinto di specchi, la bambina davanti a uno specchio appeso.
// La zona parte dalla luce che va dritta e fa le ombre, capovolge la candela nella camera oscura, trova la legge della
// riflessione, mette l'immagine dietro lo specchio, distingue lo specchio dalla carta, costruisce il labirinto di specchi
// del parco e finisce con Vetrino che mette alla prova il mito di chi si allontana per vedersi tutto intero.
import { T } from '../util.js';

export default {
  id: 'OT01',
  title: 'Raggi e riflessione',
  levels: [
    {
      id: 'ot01-1', kind: 'lezione', title: 'La luce va dritta',
      sim: 'rays', params: { mode: 'ombra', d: 1 }, controls: ['d', 'larga'], labels: { d: 'Distanza dalla lampada' },
      intro: T(
        'Accendi una lampada al buio e metti la mano davanti: sul muro compare la sua ombra. Perché? La luce va sempre dritta, e dove la mano la ferma resta il buio. Avvicina o allontana il pupazzo dalla lampada: che cosa fa l’ombra?',
        'La luce si propaga in linea retta: per questo la disegniamo con i <b>raggi</b>. Un oggetto opaco ferma i raggi e dietro lascia l’<b>ombra</b>. Con una lampada piccola l’ombra ha i bordi netti; con una lampada larga, intorno all’ombra c’è la <b>penombra</b>, dove arriva solo una parte della luce.',
        'Che la luce vada dritta lo vediamo ogni giorno: nelle ombre nette, nei raggi di sole fra le nuvole, nel laser. Ibn al-Haytham, intorno all’anno 1000, lo studiò al buio, con candele e fori. E da un’ombra si ricava una misura: bastano i triangoli simili. [[S = h · D / d]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il pupazzo vicino alla lampada e lontano.', 'Prova il pupazzo a 1 m o meno dalla lampada, e a 3 m o più.'),
          need: [
            { when: 'd <= 1', try: { d: 1 }, msg: T('Prova il pupazzo vicino alla lampada.', 'Manca una prova a 1 m o meno.') },
            { when: 'd >= 3', try: { d: 3 }, msg: T('Ora il pupazzo lontano dalla lampada.', 'Manca una prova a 3 m o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando il pupazzo è vicino alla lampada, l’ombra sul muro è…', 'Avvicinando il pupazzo alla lampada, l’ombra…', 'Perché l’ombra cresce quando l’oggetto si avvicina alla lampada?'),
          options: [T('più grande', 'si ingrandisce', 'i raggi si aprono di più'), T('più piccola', 'si rimpicciolisce', 'perché la luce si stanca prima di arrivare al muro'), T('uguale', 'resta uguale', 'perché l’ombra copia sempre la grandezza dell’oggetto')],
          answer: 0,
          explain: T('Giusto: vicino alla lampada copre più luce.', 'Esatto: i raggi che sfiorano il pupazzo si allargano fino al muro.', 'Esatto: i raggi che lo sfiorano si aprono di più prima del muro: triangoli simili, con il vertice nella lampada.'),
        },
        {
          kind: 'q',
          text: T('Perché dietro il pupazzo c’è il buio?', 'Che cosa ci dicono le ombre sulla luce?', 'Che cosa ci dice il bordo netto di un’ombra?'),
          options: [T('la luce va dritta e lui la ferma', 'che la luce va in linea retta', 'che la luce si propaga in linea retta'), T('il pupazzo fa il buio da solo, con la sua ombra', 'che la luce è più lenta dietro gli oggetti', 'che la luce gira intorno agli oggetti'), T('la lampada si spegne dietro di lui', 'che il muro assorbe la luce', 'che la luce si ferma a metà strada')],
          answer: 0,
          explain: T('Giusto: la luce non gira dietro il pupazzo.', 'Esatto: è la propagazione rettilinea.', 'Esatto: se la luce girasse intorno agli oggetti, le ombre non avrebbero bordi.'),
        },
        {
          kind: 'free',
          text: T('Ora accendi la lampada larga.', 'Ora prova la lampada larga: guarda il bordo dell’ombra.'),
          need: [{ when: 'larga', try: { larga: true }, msg: T('Accendi la lampada larga.', 'Manca una prova con la lampada larga.') }],
        },
        {
          kind: 'q',
          text: T('Con la lampada larga, intorno all’ombra c’è…', 'Che cos’è la penombra?', 'Perché durante un’eclissi di Sole c’è chi vede il Sole sparire tutto, e chi solo in parte?'),
          options: [T('una striscia meno scura', 'dove arriva solo un po’ di luce', 'ombra e penombra della Luna'), T('una striscia più scura', 'il bordo dove la luce è più forte di tutte', 'perché la Luna è trasparente ai bordi'), T('niente di diverso', 'un’ombra colorata, di solito blu', 'perché alcuni guardano con gli occhiali da sole')],
          answer: 0,
          explain: T('Giusto: la penombra, un po’ illuminata.', 'Esatto: lì una parte della lampada si vede, e una no.', 'Esatto: il Sole è una sorgente larga; nell’ombra della Luna l’eclissi è totale, nella penombra parziale.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'L’ombra sul muro.'),
          vals: { d: [[1, 2], [0.5]] }, calc: '0.4 * 4 / d', unit: 'm', tol: 0.02,
          ask: T(null,
            'Un pupazzo alto 40 cm è a <b>{d} m</b> da una lampada piccola; il muro è a 4 m. Quanto è alta l’ombra?',
            'Pupazzo di 40 cm, lampada a <b>{d} m</b>, muro a 4 m: altezza dell’ombra? [[S = h · D / d]]'),
          explain: T(null, 'Esatto: S = h·D/d = 0,4 × 4 / {d} = {ans:2} m.', 'Esatto: {ans:2} m.'),
        },
      ],
      hints: [T('Più vicino alla lampada, più grande l’ombra.', 'Triangoli simili: S = h·D/d.', 'L’ombra sta all’oggetto come la distanza del muro sta a quella dell’oggetto.')],
      solution: T(
        'La luce va dritta: vicino alla lampada il pupazzo fa un’ombra più grande.',
        'S = h·D/d: a 1 m, 0,4 × 4 / 1 = 1,6 m.',
        'La luce va in linea retta: l’ombra cresce come il rapporto fra le distanze del muro e dell’oggetto.'),
    },
    {
      id: 'ot01-2', kind: 'prevedi', title: 'La camera oscura',
      sim: 'rays', params: { mode: 'camera', foro: 'piccolo' }, controls: [],
      intro: T(
        'Una scatola tutta buia, con un forellino davanti. Fuori c’è una candela accesa. Dentro, sul fondo, compare la sua immagine! Ma com’è fatta? Prima indovina, poi guarda.',
        'La <b>camera oscura</b>: una scatola buia con un piccolo foro. I raggi di ogni punto della candela entrano dal foro e vanno dritti sul fondo. È il principio della macchina fotografica e del nostro occhio. Prevedi, poi guarda.',
        'La camera oscura era nota già ad Aristotele, e la studiò a fondo Ibn al-Haytham: un foro nella parete di una stanza buia, e sulla parete opposta compare il paesaggio di fuori. I pittori la usavano per disegnare dal vero. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ foro: 'piccolo' }],
          text: T('Com’è l’immagine della candela sul fondo?', 'Com’è l’immagine sul fondo della scatola?', 'Com’è l’immagine della camera oscura?'),
          options: [T('a testa in giù', 'capovolta', 'capovolta: i raggi si incrociano nel foro'), T('dritta', 'dritta, come la candela', 'dritta, ma più piccola'), T('non c’è nessuna immagine', 'una macchia di luce senza forma', 'una macchia: un foro non basta')],
          answer: 0,
          explain: T('Giusto: la fiamma finisce in basso!', 'Esatto: il raggio dalla cima della fiamma scende, quello dalla base sale.', 'Esatto: i raggi dall’alto vanno in basso, e viceversa.'),
          solution: T('A testa in giù.', 'Capovolta.'),
        },
        {
          kind: 'q', predict: [{ foro: 'grande' }],
          text: T('E con un foro più grande?', 'Con un foro più grande, l’immagine…', 'Allargando il foro, che cosa guadagni e che cosa perdi?'),
          options: [T('più luminosa, ma sfocata', 'diventa più luminosa, ma sfocata', 'guadagni luce, perdi nitidezza'), T('più nitida', 'diventa più nitida e più grande', 'guadagni nitidezza, perdi luce'), T('sparisce', 'sparisce del tutto', 'perdi tutte e due')],
          answer: 0,
          explain: T('Giusto: entra più luce, ma ogni punto fa una macchia.', 'Esatto: ogni punto della candela fa una macchiolina, e le macchioline si sovrappongono.', 'Esatto: per avere tutte e due, nella macchina fotografica e nell’occhio c’è una lente.'),
          solution: T('Più luminosa, ma sfocata.', 'Più luminosa, ma sfocata.'),
        },
        {
          kind: 'q',
          text: T('Perché l’immagine è a testa in giù?', 'Perché l’immagine è capovolta?', 'Dove si capovolgono le immagini, nel nostro occhio?'),
          options: [T('la luce va dritta e si incrocia nel foro', 'i raggi vanno dritti e si incrociano nel foro', 'sulla retina'), T('la scatola gira la candela mentre la guarda', 'perché il fondo della scatola è uno specchio', 'nell’aria, prima di entrare nell’occhio'), T('per magia: la scatola è una scatola magica', 'perché la luce cade verso il basso', 'non si capovolgono mai')],
          answer: 0,
          explain: T('Giusto: dall’alto in basso, dal basso in alto.', 'Esatto: la luce va in linea retta.', 'Esatto: sulla retina, come nella camera oscura, e il cervello le raddrizza: l’occhio è una camera oscura con una lente.'),
        },
        {
          kind: 'q',
          text: T('In che cosa somiglia al tuo occhio?', 'Che cosa hanno in comune la camera oscura e l’occhio?', 'Perché nella macchina fotografica c’è una lente, e non solo un foro?'),
          options: [T('anche l’occhio ha un forellino', 'un foro, la pupilla, e un fondo dove si forma l’immagine', 'per avere un’immagine luminosa e anche nitida'), T('niente', 'niente: l’occhio vede direttamente le cose', 'per avere l’immagine dritta'), T('l’occhio è una scatola di cartone', 'tutte e due hanno uno specchio', 'per fare le foto a colori')],
          answer: 0,
          explain: T('Giusto: la pupilla, nera, è il foro.', 'Esatto: la pupilla fa da foro, la retina da fondo.', 'Esatto: la lente raccoglie tanta luce e la rimette a fuoco.'),
        },
      ],
      hints: [T('La luce va dritta: dall’alto arriva in basso.', 'I raggi si incrociano nel foro; foro grande, immagine sfocata.', 'Foro piccolo: nitida ma buia; foro grande: luminosa ma sfocata.')],
    },
    {
      id: 'ot01-3', kind: 'lezione', title: 'Lo specchio',
      sim: 'rays', params: { mode: 'specchio', i: 40 }, controls: ['i'],
      intro: T(
        'Lancia una palla contro il muro, inclinata: rimbalza dall’altra parte, con la stessa inclinazione. La luce su uno specchio fa proprio così! Cambia l’angolo del raggio, e guarda come rimbalza.',
        'Quando un raggio colpisce uno specchio, si <b>riflette</b>. Gli angoli si misurano rispetto alla <b>normale</b>, la retta perpendicolare allo specchio: l’<b>angolo di incidenza</b> i e l’<b>angolo di riflessione</b> r sono sempre uguali, e i due raggi stanno da parti opposte della normale.',
        'La legge della riflessione era già nell’Ottica di Euclide, tre secoli prima di Cristo: angolo di incidenza uguale angolo di riflessione, misurati dalla normale. Erone di Alessandria notò che è la strada più breve dalla sorgente all’occhio passando per lo specchio. [[r = i]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un raggio quasi dritto e uno molto inclinato.', 'Prova un angolo di 20° o meno, e uno di 60° o più.'),
          need: [
            { when: 'i <= 20', try: { i: 20 }, msg: T('Prova un raggio quasi dritto.', 'Manca una prova a 20° o meno.') },
            { when: 'i >= 60', try: { i: 60 }, msg: T('Ora un raggio molto inclinato.', 'Manca una prova a 60° o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Il raggio arriva inclinato di 30 gradi. Riparte inclinato di…', 'Se l’angolo di incidenza è 35°, l’angolo di riflessione è…', 'Il raggio incidente forma 25° con lo specchio. Quanto vale l’angolo di riflessione?'),
          options: [T('30 gradi', '35°', '65°'), T('60 gradi', '55°', '25°'), T('90 gradi', '70°', '50°')],
          answer: 0,
          explain: T('Giusto: uguale, dall’altra parte.', 'Esatto: r = i.', 'Esatto: gli angoli si misurano dalla normale: 90° − 25° = 65°.'),
        },
        {
          kind: 'q',
          text: T('Se il raggio arriva dritto sullo specchio…', 'Un raggio perpendicolare allo specchio, con i = 0°, dove va?', 'Perché in un caleidoscopio vedi tante copie dello stesso disegno?'),
          options: [T('torna indietro dritto', 'torna indietro sulla stessa strada', 'riflessioni di riflessioni'), T('va di lato', 'scivola lungo lo specchio, di lato', 'perché dentro ci sono tanti disegni uguali'), T('sparisce nello specchio', 'resta dentro lo specchio, intrappolato', 'perché gli specchi sono curvi')],
          answer: 0,
          explain: T('Giusto: come una palla lanciata dritta contro il muro.', 'Esatto: i = 0°, r = 0°.', 'Esatto: ogni specchio riflette anche le immagini degli altri.'),
        },
        {
          kind: 'q',
          text: T('Che cosa fa la luce su uno specchio?', 'Dove stanno il raggio incidente e quello riflesso?', 'Che cosa scoprì Erone sulla strada della luce riflessa?'),
          options: [T('rimbalza come una palla', 'da parti opposte della normale', 'che è la più breve'), T('si ferma', 'dalla stessa parte della normale', 'che è la più lunga possibile'), T('passa dall’altra parte', 'tutti e due sulla normale', 'che forma sempre un angolo retto')],
          answer: 0,
          explain: T('Giusto: rimbalza con lo stesso angolo.', 'Esatto: simmetrici rispetto alla normale.', 'Esatto: la strada più breve fra sorgente, specchio e occhio; il principio fu ripreso poi da Fermat.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Lo specchio che ruota.'),
          vals: { a: [5, 10, 15] }, calc: '2 * a', unit: '°', tol: 0.5,
          ask: T(null,
            'Il raggio arriva sempre uguale; lo specchio ruota di <b>{a}°</b>. Di quanti gradi ruota il raggio riflesso?',
            'Lo specchio ruota di <b>{a}°</b>: di quanto ruota il raggio riflesso? [[Δr = 2 · Δa]]'),
          explain: T(null, 'Esatto: la normale ruota di {a}°, l’incidenza cambia di {a}° e la riflessione anche: in tutto {ans:0}°.', 'Esatto: {ans:0}°, il doppio.'),
        },
      ],
      hints: [T('Come una palla sul muro: stessa inclinazione, dall’altra parte.', 'Angolo di incidenza uguale angolo di riflessione, misurati dalla normale.', 'Gli angoli si misurano dalla normale, non dallo specchio.')],
      solution: T(
        'Il raggio rimbalza con la stessa inclinazione con cui è arrivato.',
        'r = i, da parti opposte della normale.',
        'Angolo di riflessione uguale angolo di incidenza.'),
    },
    {
      id: 'ot01-4', kind: 'lezione', title: 'Dentro lo specchio',
      sim: 'rays', params: { mode: 'immagine', d: 1 }, controls: ['d'], labels: { d: { label: 'Distanza dallo specchio', max: 2.5 } },
      intro: T(
        'Guardati allo specchio: sembra che dietro ci sia un’altra stanza, con un altro te! Quella è l’immagine. Allontana il cartello dallo specchio e guarda dove finisce la sua immagine. E la scritta?',
        'In uno specchio piano l’immagine sta dietro lo specchio, alla stessa distanza dell’oggetto, ed è grande uguale. È un’<b>immagine virtuale</b>: i raggi non passano davvero dietro lo specchio, ma arrivano all’occhio come se partissero da lì. La scritta appare rovesciata.',
        'L’immagine di uno specchio piano è virtuale: i raggi riflessi, prolungati all’indietro, si incontrano dietro lo specchio, alla stessa distanza dell’oggetto. Lo specchio non scambia destra e sinistra: scambia davanti e dietro. Per questo una scritta si legge al contrario.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il cartello vicino allo specchio e lontano.', 'Prova il cartello a 0,5 m e a 2 m o più dallo specchio.'),
          need: [
            { when: 'd <= 0.5', try: { d: 0.5 }, msg: T('Prova il cartello vicino allo specchio.', 'Manca una prova a 0,5 m.') },
            { when: 'd >= 2', try: { d: 2 }, msg: T('Ora il cartello lontano dallo specchio.', 'Manca una prova a 2 m o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Se il cartello è a 2 metri dallo specchio, la sua immagine è…', 'Un oggetto è a 1,5 m da uno specchio piano. L’immagine è…', 'Dove si incontrano i raggi che formano l’immagine di uno specchio piano?'),
          options: [T('2 metri dietro lo specchio', '1,5 m dietro lo specchio', 'i prolungamenti, dietro'), T('dentro il vetro', 'sulla superficie dello specchio', 'sulla superficie dello specchio'), T('4 metri dietro lo specchio', '3 m dietro lo specchio', 'nell’occhio di chi guarda')],
          answer: 0,
          explain: T('Giusto: tanto davanti, tanto dietro.', 'Esatto: alla stessa distanza, dall’altra parte.', 'Esatto: i raggi veri non si incontrano; si incontrano i loro prolungamenti, dietro lo specchio. Per questo l’immagine è virtuale.'),
        },
        {
          kind: 'q',
          text: T('Che cosa succede alla scritta CIAO nello specchio?', 'Perché la scritta AMBULANZA, sul cofano, è scritta al contrario?', 'Lo specchio scambia destra e sinistra?'),
          options: [T('si legge al contrario', 'per leggerla negli specchietti', 'no: scambia davanti e dietro'), T('resta uguale', 'per un errore del tipografo, mai corretto', 'sì, sempre, in ogni direzione'), T('va a testa in giù', 'perché così si legge meglio da vicino, a piedi', 'sì, ma solo per le scritte')],
          answer: 0,
          explain: T('Giusto: allo specchio le scritte si leggono al contrario.', 'Esatto: nello specchietto di chi sta davanti torna dritta.', 'Esatto: la tua mano destra resta a destra; è il naso che va verso lo specchio, e l’immagine guarda verso di te.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Tu e la tua immagine.'),
          vals: { d: [0.5, 1.5, 2] }, calc: '2 * d', unit: 'm', tol: 0.01,
          ask: T(null,
            'Sei a <b>{d} m</b> da uno specchio. Quanto dista da te la tua immagine?',
            'Distanza dallo specchio <b>{d} m</b>: distanza fra te e la tua immagine? [[distanza = 2 · d]]'),
          explain: T(null, 'Esatto: {d} m fino allo specchio e {d} m dietro: {ans:1} m.', 'Esatto: {ans:1} m.'),
        },
        {
          kind: 'q',
          text: T('Se fai un passo verso lo specchio, la tua immagine…', 'Ti avvicini di 1 m allo specchio: di quanto si avvicina a te l’immagine?', 'Perché nei negozi piccoli mettono grandi specchi sulle pareti?'),
          options: [T('fa un passo verso di te', '2 m', 'sembra che dietro ci sia un’altra stanza, grande uguale'), T('resta ferma dietro lo specchio', '1 m', 'per far sembrare la merce più piccola'), T('va indietro, lontano da te', '0,5 m', 'per far vedere meno clienti')],
          answer: 0,
          explain: T('Giusto: vi avvicinate tutti e due.', 'Esatto: tu 1 m, lei 1 m: in tutto 2 m.', 'Esatto: la stanza virtuale raddoppia lo spazio.'),
        },
      ],
      hints: [T('Tanto sei davanti, tanto è dietro.', 'Immagine virtuale alla stessa distanza, dietro lo specchio.', 'I raggi riflessi, prolungati, si incontrano dietro lo specchio.')],
      solution: T(
        'L’immagine è dietro lo specchio, lontana quanto il cartello, e la scritta è rovesciata.',
        'Immagine virtuale a distanza d dietro lo specchio.',
        'Immagine virtuale, simmetrica dell’oggetto rispetto allo specchio.'),
    },
    {
      id: 'ot01-5', kind: 'lezione', title: 'Liscio e ruvido',
      sim: 'rays', params: { mode: 'superficie', sup: 'liscia' }, controls: ['sup'],
      intro: T(
        'Perché ti vedi in uno specchio e non in un foglio di carta bianca? Anche la carta rimanda la luce! Ma è ruvida: rimanda i raggi in tutte le direzioni. Prova la superficie liscia e quella ruvida.',
        'Su una superficie liscia i raggi paralleli restano paralleli: è la <b>riflessione speculare</b>, che forma le immagini. Su una superficie ruvida ogni pezzetto è inclinato in modo diverso, e la luce torna in tutte le direzioni: è la <b>riflessione diffusa</b>. Grazie a lei vediamo gli oggetti che non fanno luce.',
        'Liscio e ruvido dipendono dalla scala: una superficie fa da specchio se le sue irregolarità sono più piccole della lunghezza d’onda della luce, meno di un millesimo di millimetro. La carta, al microscopio, è un groviglio di fibre: rimanda la luce dappertutto, e per questo la vediamo da ogni parte.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova tutte e due le superfici.', 'Prova la superficie liscia e quella ruvida.'),
          need: [
            { when: "sup == 'liscia'", try: { sup: 'liscia' }, msg: T('Prova la superficie liscia.', 'Manca la prova con la superficie liscia.') },
            { when: "sup == 'ruvida'", try: { sup: 'ruvida' }, msg: T('Ora quella ruvida.', 'Manca la prova con la superficie ruvida.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la superficie liscia, l’occhio B…', 'Con lo specchio, chi vede la luce riflessa?', 'Perché uno specchio, guardato di lato, sembra buio?'),
          options: [T('non vede niente', 'solo A', 'la luce riflessa va tutta in una sola direzione'), T('vede tanta luce', 'tutti e due gli occhi', 'perché lo specchio assorbe la luce di lato'), T('vede solo ombra', 'nessuno dei due', 'perché il vetro è nero')],
          answer: 0,
          explain: T('Giusto: tutti i raggi vanno verso A.', 'Esatto: solo l’occhio nella direzione giusta: riflessione speculare.', 'Esatto: se non sei su quella direzione, non ti arriva niente.'),
        },
        {
          kind: 'q',
          text: T('Con la superficie ruvida, la luce rimbalza…', 'Che cos’è la riflessione diffusa?', 'Senza la riflessione diffusa, che cosa vedremmo?'),
          options: [T('dappertutto', 'la luce che torna indietro in tutte le direzioni', 'solo le sorgenti di luce e i loro riflessi'), T('solo verso l’alto', 'la luce che passa attraverso la superficie', 'tutto uguale a ora, senza nessuna differenza'), T('non rimbalza', 'la luce che si spegne', 'tutto più luminoso')],
          answer: 0,
          explain: T('Giusto: in tutte le direzioni.', 'Esatto: ogni pezzetto la manda in una direzione diversa.', 'Esatto: un mondo di specchi e di buio.'),
        },
        {
          kind: 'q',
          text: T('Perché vedi un foglio di carta da ogni parte?', 'Perché un foglio di carta non funziona da specchio?', 'Un pavimento bagnato riflette le luci della strada; asciutto no. Perché?'),
          options: [T('rimanda la luce dappertutto', 'perché è ruvido: diffonde la luce', 'l’acqua riempie le rugosità e lo rende liscio'), T('perché è bianco come la neve', 'perché è troppo sottile', 'perché l’acqua fa luce'), T('perché è grande e tutto piatto', 'perché è bianco', 'perché di notte è più buio')],
          answer: 0,
          explain: T('Giusto: è ruvido, e la luce va dappertutto.', 'Esatto: diffonde la luce, non forma immagini.', 'Esatto: superficie liscia, riflessione speculare.'),
        },
      ],
      hints: [T('Liscio: i raggi vanno tutti insieme. Ruvido: dappertutto.', 'Speculare sulle superfici lisce, diffusa su quelle ruvide.', 'Conta quanto sono grandi le irregolarità rispetto alla lunghezza d’onda.')],
      solution: T(
        'Lo specchio rimanda la luce tutta insieme; la carta ruvida in tutte le direzioni.',
        'Liscia: riflessione speculare; ruvida: riflessione diffusa.',
        'La riflessione diffusa ci fa vedere gli oggetti; quella speculare forma le immagini.'),
    },
    {
      id: 'ot01-6', kind: 'costruisci', title: 'Il labirinto di specchi',
      sim: 'rays', params: { mode: 'labirinto', a: 20 }, controls: ['a'],
      intro: T(
        'Nel parco arriva il labirinto di specchi! In ogni stanza c’è una stella da accendere con un raggio di luce. Il raggio arriva sempre dritto: tu puoi solo girare lo specchio. Gira, prova, e accendi la stella!',
        'Costruisci il labirinto di specchi del parco. Il laser arriva orizzontale; lo specchio è inclinato di un angolo a. Se lo specchio ruota di un angolo, il raggio riflesso ruota del doppio: il raggio riflesso parte a 2a. Inclina lo specchio per colpire ogni stella.',
        'Il labirinto di specchi del parco: un laser orizzontale e uno specchio girevole. Quando lo specchio ruota, la normale ruota uguale e il raggio riflesso ruota del doppio. Lo stesso trucco muove i raggi negli scanner laser. [[φ = 2 · a]]'),
      piece: { id: 'labirinto', name: 'Il labirinto di specchi', desc: 'Gira gli specchi al punto giusto, e il raggio accende le stelle.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Gira lo specchio, poi lancia il raggio.', 'Inclina lo specchio, poi lancia: il raggio deve colpire la stella.'),
          vals: { e: { phi: [[90], [120]] }, s: { phi: [[60, 90, 100], [120, 140, 150]] } },
          set: { meta: 'phi' },
          ask: T(
            'La stella è a <b>{phi} gradi</b> dal raggio che arriva. Come giri lo specchio?',
            'La stella è a <b>{phi}°</b> dalla direzione del laser. Che inclinazione deve avere lo specchio?',
            'Stella a <b>{phi}°</b> dal laser: inclinazione dello specchio? [[a = φ / 2]]'),
          measure: 'a', goal: 'phi / 2', tol: 1.5,
          ok: T('Bersaglio! La stella si accende!', 'Esatto: la stella si accende.'),
          high: T('Troppo inclinato: il raggio passa oltre la stella. Raddrizzalo un po’.', 'Specchio troppo inclinato: il raggio va oltre la stella.'),
          low: T('Poco inclinato: il raggio passa prima della stella. Giralo di più.', 'Specchio poco inclinato: il raggio non arriva alla stella.'),
          solve: { a: 'Math.round(phi / 2)' },
        },
        {
          kind: 'q',
          text: T('Se giri lo specchio di poco, il raggio riflesso gira…', 'Lo specchio ruota di 10°: di quanto ruota il raggio riflesso?', 'Perché il raggio riflesso ruota del doppio dello specchio?'),
          options: [T('il doppio', '20°', 'cambiano incidenza e riflessione'), T('uguale', '10°', 'perché la luce va più veloce dello specchio'), T('la metà', '5°', 'perché il raggio è più lungo dello specchio')],
          answer: 0,
          explain: T('Giusto: il doppio!', 'Esatto: il doppio dell’angolo dello specchio.', 'Esatto: incidenza e riflessione cambiano insieme, e il raggio ruota del doppio.'),
        },
      ],
      hints: [T('Lo specchio va girato della metà dell’angolo della stella.', 'Il raggio riflesso parte a 2a: a = φ/2.', 'Ruotando lo specchio di un angolo, il riflesso ruota del doppio.')],
      solution: T('Per la stella a 90 gradi, specchio a 45; per quella a 120, a 60.', 'a = φ/2: per 90°, 45°; per 120°, 60°.', 'L’inclinazione è metà dell’angolo da raggiungere.'),
    },
    {
      id: 'ot01-7', kind: 'ripasso', title: 'Ripasso di raggi e specchi',
      intro: T('Ripassiamo: ombre, specchi e stelle!', 'Ripasso: propagazione rettilinea, ombre, camera oscura, riflessione e immagini.', 'Ripasso: la luce che va dritta e quella che rimbalza.'),
      steps: [
        {
          kind: 'q',
          text: T('Dietro un oggetto illuminato c’è…', 'Che cosa dimostrano le ombre?', 'Perché la camera oscura dà un’immagine capovolta?'),
          options: [T('la sua ombra', 'che la luce va in linea retta', 'i raggi si incrociano nel foro'), T('la sua luce', 'che la luce si piega intorno agli oggetti', 'perché il fondo è uno specchio'), T('un altro oggetto', 'che la luce è più lenta nell’ombra', 'perché la luce cade verso il basso')],
          answer: 0,
          explain: T('Giusto: l’oggetto ferma la luce.', 'Esatto: propagazione rettilinea.', 'Esatto: i raggi vanno dritti e si incrociano.'),
        },
        {
          kind: 'q',
          text: T('Un raggio arriva sullo specchio inclinato di 50 gradi. Riparte inclinato di…', 'Angolo di incidenza 50°: l’angolo di riflessione è…', 'Un raggio forma 30° con lo specchio. Che angolo forma il raggio riflesso con la normale?'),
          options: [T('50 gradi', '50°', '60°'), T('40 gradi', '40°', '30°'), T('100 gradi', '100°', '120°')],
          answer: 0,
          explain: T('Giusto: uguale.', 'Esatto: r = i.', 'Esatto: 90° − 30° = 60°, sia per l’incidenza sia per la riflessione.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’ombra sul muro.'),
          vals: { d: [1, 2, 4] }, calc: '0.5 * 6 / d', unit: 'm', tol: 0.02,
          ask: T(null,
            'Un oggetto alto 50 cm è a <b>{d} m</b> da una lampada piccola; il muro è a 6 m. Quanto è alta l’ombra?',
            'Oggetto di 50 cm, lampada a <b>{d} m</b>, muro a 6 m: altezza dell’ombra? [[S = h · D / d]]'),
          explain: T(null, 'Esatto: S = 0,5 × 6 / {d} = {ans:2} m.', 'Esatto: {ans:2} m.'),
        },
        {
          kind: 'q',
          text: T('Ti metti a 3 metri dallo specchio. La tua immagine è…', 'Una persona è a 3 m da uno specchio piano: quanto dista dalla sua immagine?', 'Che tipo di immagine dà uno specchio piano?'),
          options: [T('3 metri dietro lo specchio', '6 m', 'virtuale, dritta, grande uguale'), T('dentro il vetro', '3 m', 'reale, capovolta, più piccola'), T('6 metri dietro lo specchio', '1,5 m', 'reale, dritta, più grande')],
          answer: 0,
          explain: T('Giusto: tanto davanti, tanto dietro.', 'Esatto: 3 m + 3 m.', 'Esatto: virtuale, perché i raggi non ci passano davvero.'),
        },
        {
          kind: 'q',
          text: T('Perché non ti vedi in un foglio di carta?', 'La carta bianca riflette la luce?', 'Che cosa permette di vedere un oggetto che non emette luce?'),
          options: [T('è ruvido: la luce va dappertutto', 'sì, ma la diffonde in tutte le direzioni', 'la riflessione diffusa'), T('perché la carta è bianca', 'no, la assorbe tutta', 'la riflessione speculare'), T('perché è troppo leggera', 'sì, come uno specchio', 'la luce che emette da solo')],
          answer: 0,
          explain: T('Giusto: niente immagine, ma la vedi da ogni parte.', 'Esatto: la diffonde.', 'Esatto: rimanda in tutte le direzioni la luce che riceve.'),
        },
      ],
    },
    {
      id: 'ot01-8', kind: 'boss', title: 'Il mito dello specchio da lontano',
      sim: 'rays', params: { mode: 'intero', d: 1, hm: '50' }, controls: ['d', 'hm'], labels: { d: { label: 'Distanza dallo specchio', max: 3 } },
      intro: T(
        'Sono Vetrino. Si dice: <i>“Se nello specchio non ti vedi tutto, allontanati, e ti vedrai dalla testa ai piedi”</i>. Sarà vero? Prova con specchi di altezze diverse, vicino e lontano. Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“in uno specchio piccolo, se ti allontani abbastanza, ti vedi tutto intero”</i>. Una bambina alta 1,40 m, con gli occhi a 1,30 m, davanti a uno specchio appeso alla parete. Prova distanze diverse e specchi di altezze diverse.',
        'Sono Vetrino. Il mito dello specchio da lontano: <i>“allontanandosi, nello specchio si vede una parte più grande del corpo”</i>. Sembra ovvio: da lontano tutto sembra più piccolo. Ma anche l’immagine si allontana. Mettiamolo alla prova con la legge della riflessione.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa cambi fra una prova e l’altra?', 'Come si mette alla prova il mito?', 'Qual è il confronto onesto?'),
          options: [T('solo la distanza', 'stesso specchio, a distanze diverse', 'stesso specchio, cambiando solo la distanza'), T('lo specchio e la distanza insieme', 'specchio e distanza insieme, per fare prima', 'cambiare tutto insieme, per vedere più casi'), T('niente: basta guardare', 'si chiede a chi si specchia', 'si misura l’altezza della bambina')],
          answer: 0,
          explain: T('Giusto: una cosa alla volta.', 'Esatto: così si vede l’effetto della sola distanza.', 'Esatto: una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova lo specchio di 50 centimetri vicino e lontano; poi quello di 70.', 'Prova lo specchio da 50 cm a 1 m o meno e a 2,5 m o più; poi quello da 70 cm.'),
          need: [
            { when: "hm == '50' && d <= 1", try: { hm: '50', d: 1 }, msg: T('Prova lo specchio di 50 centimetri, vicino.', 'Manca lo specchio da 50 cm a 1 m o meno.') },
            { when: "hm == '50' && d >= 2.5", try: { hm: '50', d: 2.5 }, msg: T('Ora lo stesso specchio, lontano.', 'Manca lo specchio da 50 cm a 2,5 m o più.') },
            { when: "hm == '70'", try: { hm: '70' }, msg: T('Ora lo specchio di 70 centimetri.', 'Manca lo specchio da 70 cm.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con lo specchio piccolo, allontanandoti…', 'Con lo specchio da 50 cm, allontanandosi, la bambina vede…', 'Perché la distanza non cambia quanto ci si vede?'),
          options: [T('ti vedi sempre allo stesso modo', 'sempre la stessa parte del corpo', 'anche l’immagine si allontana: i triangoli restano simili'), T('ti vedi tutta, dalla testa ai piedi', 'tutto il corpo', 'perché da lontano lo specchio sembra più grande'), T('ti vedi di meno, sempre di meno', 'una parte sempre più piccola', 'perché la luce si stanca')],
          answer: 0,
          explain: T('Giusto: da 40 centimetri in su, vicino o lontano.', 'Esatto: dai 40 cm fino alla testa, a ogni distanza.', 'Esatto: lo specchio sta sempre a metà strada fra te e la tua immagine.'),
        },
        {
          kind: 'q',
          text: T('Quanto deve essere alto lo specchio per vederti tutta?', 'Per vedersi tutta, a una bambina alta 1,40 m basta uno specchio alto…', 'Perché basta uno specchio alto metà di te?'),
          options: [T('metà di te', '70 cm, la metà', 'lo specchio sta a metà strada fra te e la tua immagine'), T('quanto te', '1,40 m, quanto lei', 'perché la luce si piega al centro dello specchio'), T('il doppio di te', '2,80 m, il doppio', 'perché gli occhi stanno a metà del corpo, più o meno, in tutti')],
          answer: 0,
          explain: T('Giusto: basta metà della tua altezza.', 'Esatto: 70 cm, appeso alla giusta altezza.', 'Esatto: i raggi verso i bordi tagliano a metà la tua altezza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Lo specchio giusto.'),
          vals: { H: [1.2, 1.6, 1.8] }, calc: 'H / 2', unit: 'm', tol: 0.01,
          ask: T(null,
            'Una persona è alta <b>{H} m</b>. Quanto deve essere alto lo specchio per vedersi tutta?',
            'Altezza <b>{H} m</b>: altezza minima dello specchio? [[h = H / 2]]'),
          explain: T(null, 'Esatto: metà dell’altezza, {ans:2} m, a qualunque distanza.', 'Esatto: {ans:2} m.'),
        },
        {
          kind: 'q',
          text: T('Allora il mito…', 'Che cosa concludi sul mito dello specchio da lontano?', 'Il mito dello specchio da lontano: il verdetto?'),
          options: [T('è falso: la distanza non cambia niente', 'falso: conta l’altezza dello specchio', 'falso: quanto ti vedi non dipende dalla distanza'), T('è vero: lontano ti vedi tutta', 'vero: allontanandosi si vede una parte più grande', 'vero: lontano l’immagine è più piccola'), T('è vero solo per gli specchi grandi', 'vero a metà: dipende dalla luce della stanza', 'vero, ma solo per le persone alte')],
          answer: 0,
          explain: T('Mito smontato! Vicino o lontano ti vedi uguale: per vederti tutta serve uno specchio alto metà di te.', 'Mito smontato: la distanza non conta; basta uno specchio alto metà della persona.', 'Mito smontato: l’immagine si allontana con te, e lo specchio taglia sempre a metà.'),
        },
      ],
      hints: [T('Prova lo stesso specchio vicino e lontano: cambia qualcosa?', 'I raggi verso i bordi dello specchio tornano sul corpo: la distanza non conta.', 'Lo specchio sta a metà fra te e l’immagine: vedi il doppio della sua altezza.')],
      solution: T(
        'La distanza non cambia quanto ti vedi: serve uno specchio alto metà di te.',
        'Falso: con 50 cm la bambina si vede dai 40 cm in su a ogni distanza; con 70 cm tutta.',
        'Il mito è falso: in uno specchio piano si vede il doppio della sua altezza, a qualunque distanza.'),
    },
  ],
};
