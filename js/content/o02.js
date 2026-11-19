// O02 · Le onde. Simulazione: le onde (wave.js), in cinque modi: la corda scossa da una mano (o lo stagno con la
// paperella), la molla spinta avanti e indietro, gli impulsi che rimbalzano e si incontrano, le onde stazionarie fra due
// pali, l'eco di un impulso nella nebbia.
// La zona parte dall'onda che porta energia e non materia, prevede che cosa cambia scuotendo più in fretta o tendendo la
// corda, arriva a v = λ·f, passa alle onde longitudinali, alla riflessione e alla sovrapposizione, costruisce la corda
// delle onde stazionarie del parco e finisce con Bilancia che nasconde la fine della corda nella nebbia.
import { T } from '../util.js';

export default {
  id: 'O02',
  title: 'Le onde',
  levels: [
    {
      id: 'o02-1', kind: 'lezione', title: 'Energia, non acqua',
      sim: 'wave', params: { mode: 'corda', acqua: true, f: 1, tens: 'media' }, controls: ['f'],
      intro: T(
        'Butta un sasso in uno stagno: nascono le onde, che corrono verso la riva. Ma l’acqua non corre via: una paperella sull’acqua va su e giù, e resta dov’è. Le onde portano energia, non acqua. Prova a fare onde più fitte o più larghe.',
        'Un’<b>onda</b> è una perturbazione che si propaga: trasporta energia, non materia. Ogni punto dell’acqua oscilla su e giù intorno alla sua posizione; a correre è la forma. Quando i punti oscillano perpendicolari alla direzione in cui l’onda avanza, l’onda è <b>trasversale</b>. La distanza fra due creste vicine è la <b>lunghezza d’onda</b>.',
        'Un’onda è un’oscillazione che si passa di mano in mano: ogni pezzetto di mezzo tira il vicino, e la forma corre via mentre la materia resta, in media, dove era. Con l’energia l’onda porta informazione: il suono, la luce, i terremoti. Qui l’onda è trasversale: i punti si muovono perpendicolari alla corsa.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova poche scosse al secondo e tante.', 'Prova una frequenza di 0,75 Hz o meno, e una di 2 Hz o più.'),
          need: [
            { when: 'f <= 0.75', try: { f: 0.75 }, msg: T('Prova poche scosse al secondo.', 'Manca una prova a 0,75 Hz o meno.') },
            { when: 'f >= 2', try: { f: 2 }, msg: T('Ora tante scosse al secondo.', 'Manca una prova a 2 Hz o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('La paperella, quando arriva l’onda…', 'Che cosa trasporta un’onda?', 'Perché un’onda del mare può viaggiare per migliaia di chilometri, mentre l’acqua resta quasi ferma?'),
          options: [T('va su e giù e resta lì', 'energia, non materia', 'viaggia l’energia, non l’acqua'), T('viene portata fino alla riva', 'acqua, verso la riva', 'le correnti la trascinano per tutto il viaggio'), T('va sott’acqua', 'solo materia', 'il vento la spinge per tutto il tempo')],
          answer: 0,
          explain: T('Giusto: l’onda passa sotto la paperella, ma non se la porta via.', 'Esatto: l’acqua oscilla e resta, l’energia viaggia.', 'Esatto: ogni goccia oscilla e passa la spinta alla vicina; a viaggiare è la forma dell’onda.'),
        },
        {
          kind: 'q',
          text: T('La distanza fra due creste vicine si chiama…', 'Che cos’è la lunghezza d’onda?', 'In un’onda trasversale, i punti del mezzo si muovono…'),
          options: [T('lunghezza d’onda', 'da cresta a cresta', 'perpendicolari all’onda'), T('altezza dell’onda', 'l’altezza di una cresta', 'nella stessa direzione dell’onda'), T('velocità dell’onda', 'il tempo fra due creste', 'in cerchi sempre più larghi')],
          answer: 0,
          explain: T('Giusto: da cresta a cresta.', 'Esatto: è la lunghezza di un’onda intera, da una cresta alla successiva.', 'Esatto: su e giù, mentre l’onda va avanti.'),
        },
        {
          kind: 'q',
          text: T('Con più scosse al secondo, le creste sono…', 'Se fai più onde al secondo, la lunghezza d’onda…', 'Le onde di un sasso nello stagno si allontanano in cerchi sempre più larghi. Perché diventano più basse?'),
          options: [T('più vicine', 'si accorcia', 'l’energia si allarga su un cerchio più lungo'), T('più lontane', 'si allunga', 'perché l’acqua le frena tutte, un po’ alla volta'), T('uguali', 'resta uguale', 'perché la paperella le assorbe')],
          answer: 0,
          explain: T('Giusto: più fitte.', 'Esatto: l’onda corre sempre uguale, quindi le creste si avvicinano.', 'Esatto: l’energia resta, ma si allarga su un cerchio più lungo.'),
        },
      ],
      hints: [T('La paperella va su e giù: l’onda passa, l’acqua resta.', 'Le onde trasportano energia, non materia.', 'A correre è la forma dell’onda, non il mezzo.')],
      solution: T(
        'L’onda porta energia: la paperella va su e giù e resta dov’è.',
        'Onda trasversale: l’acqua oscilla su e giù, l’energia avanza; da cresta a cresta c’è la lunghezza d’onda.',
        'Un’onda trasporta energia e informazione, non materia.'),
    },
    {
      id: 'o02-2', kind: 'prevedi', title: 'Più in fretta, più fitte',
      sim: 'wave', params: { mode: 'corda', f: 1, tens: 'media' }, controls: [],
      intro: T(
        'Scuoti una corda legata a un palo: nasce un’onda che corre fino in fondo. Se scuoti più in fretta, che cosa cambia? E se la corda è più tirata? Prima indovina, poi guarda.',
        'Una corda di 6 m tesa fra la mano e un palo. La mano la scuote una volta al secondo, e l’onda corre a 3 m/s. Che cosa succede se la scuoti più in fretta, o se tendi di più la corda? Prevedi, poi guarda.',
        'Su una corda tesa un’onda corre con una velocità fissata dalla corda stessa: la sua tensione e la sua massa. La mano decide solo il ritmo. Che cosa cambia, allora, se la mano accelera? E se tendiamo la corda? Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ f: 2 }],
          text: T('Ora la mano scuote due volte al secondo. Le creste sono…', 'La frequenza raddoppia, da 1 a 2 Hz. La lunghezza d’onda…', 'Frequenza doppia sulla stessa corda: la lunghezza d’onda…'),
          options: [T('più vicine', 'si dimezza', 'si dimezza'), T('più lontane', 'raddoppia', 'raddoppia'), T('uguali a prima', 'resta uguale', 'resta uguale: la corda è la stessa')],
          answer: 0,
          explain: T('Giusto: più scosse, creste più fitte.', 'Esatto: da 3 m a 1,5 m.', 'Esatto: stessa velocità, doppio delle creste nello stesso tempo.'),
          solution: T('Più vicine.', 'Si dimezza.'),
        },
        {
          kind: 'q', predict: [{ f: 2 }],
          text: T('E l’onda corre più in fretta di prima?', 'Con la mano più veloce, la velocità dell’onda…', 'Con frequenza doppia, la velocità dell’onda sulla corda…'),
          options: [T('corre uguale', 'resta 3 m/s', 'resta la stessa: la decide la corda'), T('sì, corre il doppio', 'raddoppia', 'raddoppia, come la frequenza'), T('va più piano di prima', 'si dimezza', 'si dimezza, come la lunghezza d’onda')],
          answer: 0,
          explain: T('Giusto: arriva al palo nello stesso tempo.', 'Esatto: la mano non decide la velocità.', 'Esatto: cambia solo quanto sono fitte le creste.'),
          solution: T('No, corre uguale.', 'Resta 3 m/s.'),
        },
        {
          kind: 'q', predict: [{ f: 1, tens: 'alta' }],
          text: T('Ora tendi di più la corda. L’onda corre…', 'Tensione più alta, stessa frequenza. L’onda…', 'Corda più tesa, stessa frequenza: che cosa cambia?'),
          options: [T('più veloce', 'corre più veloce', 'velocità e lunghezza d’onda'), T('più piano', 'corre uguale', 'cambia solo la frequenza della mano'), T('uguale', 'corre più piano, perché la corda frena', 'non cambia niente, la mano è la stessa')],
          answer: 0,
          explain: T('Giusto: la corda tirata trasmette la spinta più in fretta.', 'Esatto: 4,5 m/s, e le creste si allontanano: la lunghezza d’onda diventa 4,5 m.', 'Esatto: crescono insieme; la frequenza resta quella della mano.'),
          solution: T('Più veloce.', 'Più veloce, con creste più lontane.'),
        },
        {
          kind: 'q',
          text: T('Allora, chi decide quanto corre l’onda?', 'Da che cosa dipende la velocità di un’onda su una corda?', 'Che cosa decide la frequenza di un’onda, e che cosa la sua velocità?'),
          options: [T('la corda, tirata o no', 'dalla corda e dalla sua tensione', 'la sorgente decide la frequenza, il mezzo la velocità'), T('la mano, che decide il ritmo', 'dalla frequenza della mano', 'il mezzo decide tutte e due'), T('il palo', 'da quanto in alto si scuote', 'la sorgente decide tutte e due')],
          answer: 0,
          explain: T('Giusto: la mano decide il ritmo, la corda la velocità.', 'Esatto: dalla corda, non dalla mano.', 'Esatto: e la lunghezza d’onda si adatta a tutte e due.'),
        },
      ],
      hints: [T('Più scosse, creste più fitte; corda più tirata, onda più veloce.', 'La velocità dipende dalla corda, la frequenza dalla mano.', 'La lunghezza d’onda si adatta: velocità diviso frequenza.')],
    },
    {
      id: 'o02-3', kind: 'lezione', title: 'Quanto corre un’onda',
      sim: 'wave', params: { mode: 'corda', f: 1.5, tens: 'media' }, controls: ['f', 'tens'],
      intro: T(
        'Ogni volta che la mano fa un’oscillazione, l’onda avanza di una lunghezza d’onda, da una cresta alla successiva. Più scosse al secondo, creste più vicine; corda più tirata, onda più veloce e creste più lontane.',
        'In un periodo l’onda avanza di una lunghezza d’onda. Quindi <b>v = λ·f</b>: velocità uguale lunghezza d’onda per frequenza. La velocità dipende dal mezzo, qui dalla tensione della corda; la frequenza dalla sorgente; la lunghezza d’onda si adatta, λ = v/f.',
        'La relazione fondamentale delle onde: in un periodo la cresta avanza di una lunghezza d’onda. Vale per le corde, il suono, la luce e le onde del mare. [[v = λ · f]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la corda poco tirata e molto tirata.', 'Prova la tensione bassa e quella alta.'),
          need: [
            { when: "tens == 'bassa'", try: { tens: 'bassa' }, msg: T('Prova la corda poco tirata.', 'Manca una prova con la tensione bassa.') },
            { when: "tens == 'alta'", try: { tens: 'alta' }, msg: T('Ora la corda molto tirata.', 'Manca una prova con la tensione alta.') },
          ],
        },
        {
          kind: 'q',
          text: T('Le onde del mare arrivano ogni 5 secondi, a 10 metri l’una dall’altra. Quanti metri fanno in un secondo?', 'Un’onda ha λ = 2 m e f = 1,5 Hz. Quanto vale la sua velocità?', 'Le onde del mare arrivano ogni 8 s e distano 60 m l’una dall’altra. A che velocità corrono?'),
          options: [T('2 metri', '3 m/s', '7,5 m/s'), T('50 metri', '0,75 m/s', '480 m/s'), T('15 metri', '1,33 m/s', '0,13 m/s')],
          answer: 0,
          explain: T('Giusto: 10 metri in 5 secondi, 2 metri ogni secondo.', 'Esatto: v = λ·f = 2 × 1,5 = 3 m/s.', 'Esatto: una lunghezza d’onda in un periodo, 60 / 8 = 7,5 m/s.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La lunghezza d’onda.'),
          vals: { v: [[3], [4.5]], f: [[1.5, 2], [1.5, 3]] }, calc: 'v / f', unit: 'm', tol: 0.02,
          ask: T(null,
            'Un’onda corre a <b>{v} m/s</b> su una corda scossa con <b>{f} Hz</b>. Quanto vale la lunghezza d’onda?',
            'Velocità <b>{v} m/s</b>, frequenza <b>{f} Hz</b>: lunghezza d’onda, in metri? [[λ = v / f]]'),
          explain: T(null, 'Esatto: λ = v / f = {ans:2} m.', 'Esatto: {ans:2} m.'),
        },
        {
          kind: 'q',
          text: T('Se raddoppi le scosse al secondo, la distanza fra le creste…', 'Un’onda d’acqua ha f = 0,5 Hz e corre a 2 m/s. Quanto è lunga?', 'Uno tsunami in mare aperto corre a 200 m/s, e le sue onde arrivano ogni 15 minuti. Quanto è lunga l’onda?'),
          options: [T('si dimezza', '4 m', '180 km'), T('raddoppia', '1 m', '3 km'), T('resta uguale', '0,25 m', '13 m')],
          answer: 0,
          explain: T('Giusto: il doppio delle creste nello stesso spazio.', 'Esatto: λ = v / f = 2 / 0,5 = 4 m.', 'Esatto: 200 m/s × 900 s = 180 km. Per questo in mare aperto quasi non si vede.'),
        },
      ],
      hints: [T('In un’oscillazione l’onda avanza di una lunghezza d’onda.', 'v = λ·f, quindi λ = v/f.', 'In un periodo la cresta percorre una lunghezza d’onda.')],
      solution: T(
        'Più scosse al secondo, creste più vicine; corda più tirata, creste più lontane.',
        'λ = v / f: con 3 m/s e 1,5 Hz, 2 m.',
        'Velocità uguale lunghezza d’onda per frequenza, per ogni tipo di onda.'),
    },
    {
      id: 'o02-4', kind: 'lezione', title: 'Onde che spingono',
      sim: 'wave', params: { mode: 'molla', f: 1 }, controls: ['f'], labels: { f: { labelE: 'Spinte al secondo' } },
      intro: T(
        'Non tutte le onde vanno su e giù! Prendi una molla lunga e spingila avanti e indietro: le spire si stringono e si allargano, e la stretta corre lungo la molla. La spira rossa va avanti e indietro, e resta lì.',
        'Nelle onde <b>longitudinali</b> i punti del mezzo oscillano nella stessa direzione in cui l’onda avanza: si formano zone di <b>compressione</b>, con le spire fitte, e di <b>rarefazione</b>, con le spire rade. La lunghezza d’onda è la distanza fra due compressioni.',
        'Nelle onde longitudinali il mezzo si muove avanti e indietro lungo la direzione di propagazione: la perturbazione è una fila di compressioni e rarefazioni. In un gas le onde sono solo così, perché un gas non resiste al taglio: le sue particelle non si tirano di lato.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova spinte lente e spinte veloci.', 'Prova una frequenza di 0,75 Hz o meno, e una di 2 Hz o più.'),
          need: [
            { when: 'f <= 0.75', try: { f: 0.75 }, msg: T('Prova spinte lente.', 'Manca una prova a 0,75 Hz o meno.') },
            { when: 'f >= 2', try: { f: 2 }, msg: T('Ora spinte veloci.', 'Manca una prova a 2 Hz o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('La spira rossa…', 'In un’onda longitudinale i punti del mezzo oscillano…', 'Perché nell’aria non ci sono onde trasversali?'),
          options: [T('va avanti e indietro e resta lì', 'nella direzione in cui avanza l’onda', 'un gas non resiste al taglio'), T('corre fino in fondo con l’onda', 'perpendicolari all’onda', 'perché l’aria è troppo leggera'), T('va su e giù, come la paperella sull’acqua', 'in cerchio', 'perché l’aria è trasparente e invisibile')],
          answer: 0,
          explain: T('Giusto: si muove, ma non viaggia.', 'Esatto: avanti e indietro, lungo la molla.', 'Esatto: le particelle di un gas non si tirano di lato; niente taglio, niente onde trasversali.'),
        },
        {
          kind: 'q',
          text: T('Dove le spire sono più fitte, la molla è…', 'Che cos’è una compressione?', 'In un’onda longitudinale, che cosa misura la lunghezza d’onda?'),
          options: [T('schiacciata', 'una zona dove le spire sono più fitte', 'la distanza fra due compressioni vicine'), T('tirata', 'il punto più alto dell’onda', 'la lunghezza della molla'), T('ferma', 'l’estremo della molla', 'la distanza fra una compressione e una rarefazione')],
          answer: 0,
          explain: T('Giusto: lì le spire si stringono.', 'Esatto: il contrario è la rarefazione.', 'Esatto: da compressione a compressione, come da cresta a cresta.'),
        },
        {
          kind: 'q',
          text: T('In una fila di persone, se spingi il primo, la spinta…', 'Che differenza c’è fra l’onda sulla corda e quella sulla molla spinta?', 'Nei terremoti le onde S, trasversali, non attraversano il nucleo esterno della Terra. Perché?'),
          options: [T('arriva fino in fondo', 'trasversale contro longitudinale', 'il nucleo esterno è liquido'), T('resta al primo, che cade da solo', 'la corda porta materia, la molla no', 'perché è troppo caldo per qualunque onda'), T('torna subito indietro, verso di te', 'nessuna: sono due onde uguali, solo più lente', 'perché è troppo lontano')],
          answer: 0,
          explain: T('Giusto: passa da una persona all’altra, come fra le spire.', 'Esatto: sulla corda i punti vanno su e giù, sulla molla avanti e indietro.', 'Esatto: un liquido non resiste al taglio; così si è scoperto che il nucleo esterno è liquido.'),
        },
      ],
      hints: [T('La spira va avanti e indietro; la stretta corre.', 'Longitudinale: oscillazione lungo la direzione dell’onda.', 'Compressioni e rarefazioni, una lunghezza d’onda fra due compressioni.')],
      solution: T(
        'Nella molla spinta le spire vanno avanti e indietro, e la stretta corre lungo la molla.',
        'Onda longitudinale: compressioni e rarefazioni che avanzano.',
        'Longitudinale: il mezzo oscilla lungo la direzione di propagazione.'),
    },
    {
      id: 'o02-5', kind: 'lezione', title: 'Rimbalzi e incontri',
      sim: 'wave', params: { mode: 'impulsi', caso: 'muro' }, controls: ['caso'],
      intro: T(
        'Manda un’onda contro un palo: torna indietro, ma a testa in giù! E se due onde si incontrano? Si sommano per un attimo, poi ognuna prosegue per la sua strada, come se niente fosse. Prova tutti e tre i casi.',
        'Arrivando a un estremo fisso un impulso si riflette e torna capovolto. Quando due impulsi si incontrano si sommano punto per punto: è il <b>principio di sovrapposizione</b>. Due creste fanno una cresta doppia, <b>interferenza costruttiva</b>; una cresta e una valle si annullano, <b>interferenza distruttiva</b>. Poi proseguono intatti.',
        'Le onde, a differenza delle palline, si attraversano: nel punto d’incontro gli spostamenti si sommano, poi ognuna prosegue come prima. Da questa semplice somma nascono i colori delle bolle di sapone e le cuffie che cancellano il rumore.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova tutti e tre i casi.', 'Prova tutti e tre i casi: il palo, due impulsi in su, uno su e uno giù.'),
          need: [
            { when: "caso == 'muro'", try: { caso: 'muro' }, msg: T('Prova l’onda contro il palo.', 'Manca la prova contro il palo.') },
            { when: "caso == 'stesso'", try: { caso: 'stesso' }, msg: T('Ora due onde in su.', 'Manca la prova con due impulsi in su.') },
            { when: "caso == 'opposti'", try: { caso: 'opposti' }, msg: T('Ora un’onda su e una giù.', 'Manca la prova con uno su e uno giù.') },
          ],
        },
        {
          kind: 'q',
          text: T('Contro il palo, l’onda torna indietro…', 'Un impulso verso l’alto arriva a un estremo fisso. Torna…', 'Perché l’impulso torna capovolto dall’estremo fisso?'),
          options: [T('a testa in giù', 'capovolto', 'il palo tira la corda in giù, con una forza uguale e contraria'), T('uguale', 'uguale, verso l’alto', 'perché la corda si attorciglia contro il palo'), T('non torna', 'non torna: il palo lo assorbe', 'perché perde metà dell’energia')],
          answer: 0,
          explain: T('Giusto: il palo la rimanda giù.', 'Esatto: riflesso e capovolto.', 'Esatto: azione e reazione, anche per le onde.'),
        },
        {
          kind: 'q',
          text: T('Due onde verso l’alto si incontrano. Per un attimo la corda…', 'Una cresta e una valle uguali si incontrano. Nel punto d’incontro, per un istante…', 'Come funzionano le cuffie che cancellano il rumore?'),
          options: [T('sale il doppio', 'la corda è piatta: si annullano', 'mandano un’onda capovolta'), T('resta piatta', 'c’è una cresta doppia', 'chiudono meglio le orecchie'), T('si spezza', 'si respingono e tornano indietro', 'abbassano il volume di tutto')],
          answer: 0,
          explain: T('Giusto: le due onde si sommano.', 'Esatto: interferenza distruttiva.', 'Esatto: l’onda capovolta, sommata al rumore, lo annulla: interferenza distruttiva fatta apposta.'),
        },
        {
          kind: 'q',
          text: T('Dopo l’incontro, le due onde…', 'Dopo essersi sovrapposti, i due impulsi…', 'Dove va l’energia nell’istante in cui due impulsi si annullano?'),
          options: [T('vanno avanti', 'proseguono intatti', 'è nel movimento della corda'), T('spariscono tutte e due', 'si fondono in uno solo', 'sparisce per un istante e poi torna'), T('diventano una sola onda', 'tornano indietro', 'diventa calore')],
          answer: 0,
          explain: T('Giusto: si attraversano e proseguono come prima.', 'Esatto: ognuno continua per la sua strada.', 'Esatto: la corda è piatta, ma in quell’istante si muove veloce.'),
        },
      ],
      hints: [T('Contro il palo l’onda si capovolge; due onde si sommano.', 'Sovrapposizione: gli spostamenti si sommano, poi gli impulsi proseguono intatti.', 'Le onde si attraversano: la somma vale solo dove si incontrano.')],
      solution: T(
        'Dal palo l’onda torna capovolta; due onde si sommano e poi proseguono.',
        'Riflessione capovolta; interferenza costruttiva e distruttiva; poi gli impulsi proseguono intatti.',
        'Sovrapposizione: nel punto d’incontro gli spostamenti si sommano.'),
    },
    {
      id: 'o02-6', kind: 'costruisci', title: 'La corda delle onde',
      sim: 'wave', params: { mode: 'stazionaria', f: 0.5 }, controls: ['f'], labels: { f: { min: 0.2, max: 2, step: 0.01 } },
      intro: T(
        'Nel parco arriva la corda delle onde: lunga 6 metri, legata fra due pali. Scuotila con il ritmo giusto e succede una magia: l’onda si ferma! Nascono pance che vanno su e giù e punti che restano immobili. Trova il ritmo per il numero di pance che vuoi.',
        'Costruisci la corda delle onde del parco: 6 m fra due pali, con onde che corrono a 4 m/s. Le onde che vanno e quelle che tornano dai pali si sommano: solo per certe frequenze nasce un’<b>onda stazionaria</b>, con <b>nodi</b> fermi e <b>ventri</b> che oscillano. Con n ventri, λ = 2L/n e f = n·v/(2L).',
        'Le onde stazionarie nascono dalla sovrapposizione di due onde uguali che corrono in versi opposti: quella che va e quella riflessa dai pali. Ci stanno solo se la corda contiene un numero intero di mezze lunghezze d’onda: è lo stesso principio delle corde di una chitarra. [[f = n · v / (2L)]]'),
      piece: { id: 'onde', name: 'La corda delle onde', desc: 'Scossa con il ritmo giusto, la corda fa un’onda ferma: ventri che ballano e nodi immobili.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quante scosse al secondo, poi lancia.', 'Regola la frequenza, poi lancia: cerca l’onda stazionaria.'),
          vals: { e: { n: [[2], [3]] }, s: { n: [[2, 4], [3, 5]] } },
          ask: T(
            'Vuoi un’onda ferma con <b>{n} pance</b>. Quante scosse al secondo servono?',
            'Vuoi un’onda stazionaria con <b>{n} ventri</b>. Che frequenza serve?',
            'Onda stazionaria con <b>{n} ventri</b> su 6 m, con onde che corrono a 4 m/s: quale frequenza?'),
          measure: 'f', goal: 'n / 3', tol: 0.03,
          ok: T('Perfetto: l’onda si è fermata!', 'Esatto: onda stazionaria.'),
          high: T('Troppo in fretta: non sono le pance che volevi. Rallenta.', 'Frequenza troppo alta per {n} ventri: abbassala.'),
          low: T('Troppo piano: non sono le pance che volevi. Scuoti più in fretta!', 'Frequenza troppo bassa per {n} ventri: alzala.'),
          solve: { f: 'Math.round(n / 3 * 100) / 100' },
        },
        {
          kind: 'q',
          text: T('Nei punti fermi della corda, i nodi…', 'Con 3 ventri sulla corda di 6 m, quanto è lunga l’onda?', 'Perché una corda di chitarra suona solo certe note?'),
          options: [T('la corda non si muove mai', '4 m', 'ci stanno solo onde con un numero intero di mezze lunghezze d’onda'), T('la corda va su e giù più di tutti', '2 m', 'perché il legno della chitarra sceglie le note'), T('la corda corre veloce', '6 m', 'perché la corda vibra a tutte le frequenze insieme')],
          answer: 0,
          explain: T('Giusto: i nodi stanno sempre fermi.', 'Esatto: ogni ventre è mezza onda, quindi λ = 2 × 6 / 3 = 4 m.', 'Esatto: la fondamentale e i suoi multipli interi.'),
        },
      ],
      hints: [T('Con 3 pance serve una scossa al secondo; con 2 pance, un po’ meno.', 'f = n·v / (2L) = n / 3 Hz.', 'La frequenza più bassa è v / 2L, un terzo di hertz; le altre sono suoi multipli interi.')],
      solution: T('Due pance con due scosse ogni tre secondi, tre pance con una scossa al secondo.', 'f = n / 3 Hz: 0,67 Hz per 2 ventri, 1 Hz per 3.', 'Le frequenze buone sono i multipli interi di un terzo di hertz.'),
    },
    {
      id: 'o02-7', kind: 'ripasso', title: 'Ripasso delle onde',
      intro: T('Ripassiamo: stagni, corde e molle!', 'Ripasso: onde trasversali e longitudinali, v = λ·f, interferenza e onde stazionarie.', 'Ripasso: dalle onde che portano energia alle onde che stanno ferme.'),
      steps: [
        {
          kind: 'q',
          text: T('Un’onda passa sotto una barchetta. La barchetta…', 'Che cosa viaggia con un’onda?', 'In un’onda, che cosa si propaga davvero?'),
          options: [T('va su e giù e resta lì', 'l’energia', 'l’energia'), T('viene portata lontano', 'l’acqua', 'il mezzo, a pezzetti'), T('affonda subito', 'la riva', 'niente: è un’illusione')],
          answer: 0,
          explain: T('Giusto: l’onda passa, la barchetta resta.', 'Esatto: la materia resta, l’energia va.', 'Esatto: il mezzo oscilla sul posto.'),
        },
        {
          kind: 'q',
          text: T('Su una molla spinta avanti e indietro, le spire…', 'Quale di queste è un’onda longitudinale?', 'Che cosa distingue un’onda longitudinale da una trasversale?'),
          options: [T('avanti e indietro', 'una molla spinta e tirata lungo il suo asse', 'la direzione in cui oscilla il mezzo'), T('vanno su e giù, come la corda', 'una corda scossa su e giù', 'la velocità'), T('stanno ferme al loro posto', 'le onde dello stagno', 'la frequenza')],
          answer: 0,
          explain: T('Giusto: come le persone in fila.', 'Esatto: compressioni e rarefazioni.', 'Esatto: lungo la propagazione o perpendicolare.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La velocità dell’onda.'),
          vals: { l: [0.5, 1.5, 2], f: [2, 4] }, calc: 'l * f', unit: 'm/s', tol: 0.02,
          ask: T(null,
            'Un’onda ha lunghezza d’onda <b>{l} m</b> e frequenza <b>{f} Hz</b>. A che velocità corre?',
            'Lunghezza d’onda <b>{l} m</b>, frequenza <b>{f} Hz</b>: velocità? [[v = λ · f]]'),
          explain: T(null, 'Esatto: v = λ·f = {ans:2} m/s.', 'Esatto: {ans:2} m/s.'),
        },
        {
          kind: 'q',
          text: T('Due onde verso l’alto si incontrano…', 'Due onde uguali, una cresta e una valle, si incontrano. Per un istante…', 'Dove si formano i nodi di un’onda stazionaria?'),
          options: [T('e per un attimo si sommano', 'si annullano', 'dove le due onde si annullano sempre'), T('e rimbalzano indietro', 'si sommano in una cresta doppia', 'dove la corda è più tesa del resto'), T('e si spezzano tutte e due in tanti pezzi', 'si fermano per sempre', 'solo in mezzo alla corda, mai ai capi')],
          answer: 0,
          explain: T('Giusto: poi proseguono come prima.', 'Esatto: interferenza distruttiva.', 'Esatto: interferenza distruttiva continua.'),
        },
        {
          kind: 'q',
          text: T('Contro un palo, l’onda della corda torna…', 'Su una corda di 6 m fissa ai capi, con 2 ventri, la lunghezza d’onda è…', 'Una corda ha la frequenza più bassa a 110 Hz. Quale altra frequenza può fare un’onda stazionaria?'),
          options: [T('a testa in giù', '6 m', '330 Hz'), T('uguale', '3 m', '165 Hz'), T('non torna', '12 m', '275 Hz')],
          answer: 0,
          explain: T('Giusto: capovolta.', 'Esatto: λ = 2L / n = 6 m.', 'Esatto: tre volte la fondamentale.'),
        },
      ],
    },
    {
      id: 'o02-8', kind: 'boss', who: 'bilancia', title: 'La corda nella nebbia', win: T('Esperimento riuscito!'),
      sim: 'wave', params: { mode: 'eco', eco: 'bassa' }, controls: ['eco'],
      intro: T(
        'Sono Bilancia. Una corda sparisce nella nebbia: in fondo è legata a un palo, ma non si vede quanto lontano. Puoi solo mandare un’onda e aspettare che torni indietro. Con il cronometro, scopri quanto è lunga la corda. Esperimento al buio!',
        'Sono Bilancia. Esperimento al buio: la corda entra nella nebbia ed è legata a un palo che non si vede. Sai a che velocità corre un impulso sulla corda, a seconda della tensione. Manda un impulso, cronometra l’eco e ricava la lunghezza.',
        'Sono Bilancia. È il principio del sonar, del radar e dell’ecografia: si misura una distanza che non si vede con il tempo che un’onda impiega ad andare e tornare. Qui la corda sparisce nella nebbia. [[L = v · t / 2]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la corda poco tirata e molto tirata.', 'Prova tutte e due le tensioni, e cronometra l’eco.'),
          need: [
            { when: "eco == 'bassa'", try: { eco: 'bassa' }, msg: T('Prova la corda poco tirata.', 'Manca una prova con la tensione bassa.') },
            { when: "eco == 'alta'", try: { eco: 'alta' }, msg: T('Ora la corda molto tirata.', 'Manca una prova con la tensione alta.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la corda più tirata, l’eco torna…', 'Con la tensione alta l’impulso corre il doppio. L’eco torna…', 'Perché con la corda più tesa l’eco torna prima, se la corda è la stessa?'),
          options: [T('prima', 'in metà tempo', 'l’impulso corre più veloce'), T('dopo', 'nello stesso tempo', 'perché tendendola la corda si accorcia di molto'), T('uguale', 'nel doppio del tempo', 'perché il palo nella nebbia si avvicina')],
          answer: 0,
          explain: T('Giusto: l’onda corre più veloce.', 'Esatto: 3 s invece di 6 s.', 'Esatto: stessa strada, velocità doppia, metà tempo.'),
        },
        {
          kind: 'q',
          text: T('Mentre il cronometro corre, l’onda fa…', 'Il tempo dell’eco comprende…', 'Perché nella formula si divide per 2?'),
          options: [T('andata e ritorno', 'l’andata fino al palo e il ritorno', 'perché l’onda percorre la corda due volte, andata e ritorno'), T('solo l’andata', 'solo l’andata', 'perché la corda è piegata a metà'), T('tre giri', 'solo il ritorno', 'perché al ritorno la velocità si dimezza')],
          answer: 0,
          explain: T('Giusto: va fino al palo e torna.', 'Esatto: due volte la lunghezza della corda.', 'Esatto: la strada percorsa è il doppio della lunghezza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La lunghezza nascosta.'),
          vals: { v: [3, 6] }, derive: { t: '18 / v' }, calc: 'v * t / 2', unit: 'm', tol: 0.1,
          ask: T(null,
            'L’impulso corre a <b>{v} m/s</b> e l’eco torna dopo <b>{t} s</b>. Quanto è lunga la corda?',
            'Velocità <b>{v} m/s</b>, eco dopo <b>{t} s</b>: lunghezza della corda, in metri? [[L = v · t / 2]]'),
          explain: T(null, 'Esatto: L = v·t / 2 = {v} × {t} / 2 = {ans:0} m.', 'Esatto: {ans:0} m.'),
        },
        {
          kind: 'q',
          text: T('Allora la corda è lunga…', 'Il verdetto: quanto è lunga la corda?', 'Il verdetto: la lunghezza della corda?'),
          options: [T('9 metri', '9 m', '9 m, misurati soltanto con un cronometro'), T('18 metri', '18 m', '18 m, quanto ha corso l’impulso'), T('3 metri', '4,5 m', '4,5 m, quanto se ne vede')],
          answer: 0,
          explain: T('Esperimento riuscito! In 6 secondi l’onda corre 18 metri, andata e ritorno: la corda è lunga 9 metri.', 'Esperimento riuscito: L = 3 × 6 / 2 = 9 m.', 'Esperimento riuscito: 9 m. Come i pipistrelli e i sonar, hai misurato con l’eco.'),
        },
      ],
      hints: [T('L’onda va fino al palo e torna: la strada è il doppio della corda.', 'L = v·t / 2.', 'Distanza uguale velocità per tempo, diviso due per l’andata e ritorno.')],
      solution: T(
        'La corda è lunga 9 metri: l’onda corre 18 metri fra andata e ritorno.',
        'L = v·t / 2 = 3 × 6 / 2 = 9 m.',
        'Con l’eco: 9 m, uguali con tutte e due le tensioni.'),
    },
  ],
};
