// OT03 · Colori e spettro. Simulazione: colori e spettro (colors.js), in sette modi: il prisma, l'esperimento cruciale
// di Newton, l'arcobaleno con la goccia, le tre torce colorate, il colore delle cose, la fontana arcobaleno, il
// termometro di Herschel.
// La zona apre la luce bianca nei colori, dimostra con Newton che i colori c'erano già, spiega l'arcobaleno, mescola le
// luci (sintesi additiva) e i colori delle cose (sottrattiva), costruisce la fontana arcobaleno del parco e finisce con
// Bilancia che ripete al buio l'esperimento di Herschel: oltre il rosso c'è una luce invisibile.
import { T } from '../util.js';

export default {
  id: 'OT03',
  title: 'Colori e spettro',
  levels: [
    {
      id: 'ot03-1', kind: 'lezione', title: 'Dentro la luce bianca',
      sim: 'colors', params: { mode: 'prisma', luce: 'bianca' }, controls: ['luce'],
      intro: T(
        'Guarda che cosa so fare: la luce bianca entra in un prisma di vetro, come me, ed esce con tutti i colori dell’arcobaleno! Prova la luce bianca, e poi una luce di un colore solo.',
        'Nel 1666 Isaac Newton fece passare un raggio di Sole in un prisma: sul muro comparve una striscia di colori, lo <b>spettro</b>. La luce bianca è fatta di tanti colori, e il vetro piega ciascuno in modo un po’ diverso: il violetto più del rosso. È la <b>dispersione</b>: l’indice di rifrazione cambia con il colore.',
        'Prima di Newton si pensava che il prisma «sporcasse» la luce bianca, aggiungendole i colori. Newton mostrò che i colori ci sono già: il vetro li separa, perché ogni colore ha il suo indice di rifrazione. Nel vetro comune va da circa 1,51 per il rosso a 1,53 per il violetto: poco, ma abbastanza per aprire un ventaglio. Nel disegno la differenza è esagerata.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la luce bianca e una luce colorata.', 'Prova la luce bianca e una luce di un colore solo.'),
          need: [
            { when: "luce == 'bianca'", try: { luce: 'bianca' }, msg: T('Prova la luce bianca.', 'Manca la luce bianca.') },
            { when: "luce != 'bianca'", try: { luce: 'verde' }, msg: T('Ora una luce colorata.', 'Manca una luce di un colore solo.') },
          ],
        },
        {
          kind: 'q',
          text: T('Che cosa esce dal prisma, con la luce bianca?', 'Che cosa fa il prisma alla luce bianca?', 'Che cosa dimostra lo spettro di un prisma?'),
          options: [T('tutti i colori', 'la separa nei suoi colori', 'che la luce bianca è una miscela di colori'), T('solo luce bianca', 'la colora, come una vernice', 'che il vetro aggiunge i colori alla luce'), T('niente: la spegne', 'la rende più luminosa e più bianca', 'che il vetro è colorato dentro, come una caramella')],
          answer: 0,
          explain: T('Giusto: tutti i colori dell’arcobaleno!', 'Esatto: è la dispersione.', 'Esatto: il vetro non aggiunge niente; separa quello che c’era già.'),
        },
        {
          kind: 'q',
          text: T('Quale colore si piega di più?', 'Nel prisma, quale colore si piega di più?', 'Perché il violetto si piega più del rosso?'),
          options: [T('il violetto', 'il violetto', 'nel vetro è più lento'), T('il rosso', 'il rosso', 'perché il violetto è più pesante'), T('tutti uguale', 'tutti allo stesso modo', 'perché il violetto è più luminoso')],
          answer: 0,
          explain: T('Giusto: il violetto, in fondo al ventaglio.', 'Esatto: per il violetto l’indice di rifrazione è più grande.', 'Esatto: nel vetro il violetto è un po’ più lento: indice di rifrazione più grande, rifrazione più forte.'),
        },
        {
          kind: 'q',
          text: T('Con una luce verde, che cosa esce dal prisma?', 'Una luce di un colore solo, nel prisma…', 'Perché una luce di un colore solo non si apre in un ventaglio?'),
          options: [T('solo verde', 'si piega, ma resta di quel colore', 'perché non c’è niente da separare'), T('tutti i colori', 'si apre in tutti i colori dell’arcobaleno', 'perché il prisma è troppo piccolo'), T('luce bianca', 'diventa bianca come la luce del Sole', 'perché la luce verde non si piega')],
          answer: 0,
          explain: T('Giusto: il verde resta verde.', 'Esatto: si piega, ma non si divide.', 'Esatto: dentro c’è un colore solo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Più lento nel vetro.'),
          vals: { n: [1.51, 1.52, 1.53] }, calc: '300000 / n', unit: 'km/s', tol: 1000,
          ask: T(null,
            'Nel vetro un colore ha indice di rifrazione n = <b>{n}</b>. A che velocità va, se nel vuoto la luce fa 300 000 km/s? (v = c / n)',
            'Indice di rifrazione <b>{n}</b>: velocità di quel colore nel vetro? [[v = c / n, con c = 300 000 km/s]]'),
          explain: T(null, 'Esatto: v = 300 000 / {n} ≈ {ans:0} km/s.', 'Esatto: circa {ans:0} km/s.'),
        },
      ],
      hints: [T('Il prisma separa la luce bianca nei suoi colori.', 'Dispersione: ogni colore ha il suo indice di rifrazione.', 'Il violetto ha l’indice di rifrazione più grande, il rosso il più piccolo.')],
      solution: T(
        'La luce bianca esce con tutti i colori; una luce colorata resta di un colore.',
        'Dispersione: la luce bianca si separa nello spettro, dal rosso al violetto.',
        'La luce bianca è una miscela di colori; il prisma li separa.'),
    },
    {
      id: 'ot03-2', kind: 'prevedi', title: 'L’esperimento di Newton',
      sim: 'colors', params: { mode: 'newton', secondo: 'fessura' }, controls: [],
      intro: T(
        'Isaac Newton voleva capire: il prisma crea i colori, o li separa soltanto? Fece passare un colore solo in un secondo prisma. E poi rimise insieme tutti i colori. Prima indovina, poi guarda!',
        'Newton lo chiamò <i>experimentum crucis</i>, l’esperimento cruciale. Con una fessura lasciò passare un solo colore verso un secondo prisma. Poi, con una lente, raccolse tutti i colori su un secondo prisma capovolto. Prevedi, poi guarda.',
        'Se il prisma creasse i colori, un secondo prisma dovrebbe crearne altri. Newton isolò un solo colore con una fessura e lo mandò in un secondo prisma; poi rimise insieme tutto lo spettro. Due esperimenti che decidono fra due idee: per questo li chiamò cruciali. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { secondo: 'fessura' }, predict: [{ secondo: 'fessura' }],
          text: T('Solo il verde entra nel secondo prisma. Che cosa esce?', 'Solo il verde passa nel secondo prisma. Ne esce…', 'Un solo colore attraversa un secondo prisma. Che cosa succede?'),
          options: [T('solo verde', 'solo verde, un po’ piegato', 'si piega, ma resta un colore solo'), T('tutti i colori', 'di nuovo tutti i colori', 'si apre di nuovo in uno spettro'), T('niente', 'luce bianca, come all’inizio', 'il secondo prisma lo spegne del tutto, come un muro')],
          answer: 0,
          explain: T('Giusto: il verde resta verde!', 'Esatto: un colore puro non si divide più.', 'Esatto: il prisma non crea colori: separa solo quelli che ci sono.'),
          solution: T('Solo verde.', 'Solo verde, un po’ piegato.'),
        },
        {
          kind: 'q', set: { secondo: 'capovolto' }, predict: [{ secondo: 'capovolto' }],
          text: T('Ora tutti i colori entrano in un prisma capovolto. Che cosa esce?', 'Tutti i colori, raccolti da una lente, in un prisma capovolto. Ne esce…', 'Lo spettro intero, raccolto in un prisma capovolto: che cosa esce?'),
          options: [T('luce bianca', 'luce bianca', 'luce bianca: i colori si ricompongono'), T('ancora i colori', 'uno spettro ancora più largo', 'uno spettro due volte più largo di prima'), T('niente', 'solo il rosso', 'luce nera, perché i colori si annullano')],
          answer: 0,
          explain: T('Giusto: i colori insieme fanno il bianco!', 'Esatto: il prisma capovolto rimette insieme i colori.', 'Esatto: rimescolando lo spettro torna la luce bianca.'),
          solution: T('Luce bianca.', 'Luce bianca.'),
        },
        {
          kind: 'q',
          text: T('Allora, i colori da dove vengono?', 'Che cosa dimostrano i due esperimenti?', 'Che cosa decide l’esperimento cruciale?'),
          options: [T('sono già nella luce bianca', 'che i colori c’erano già', 'che il prisma separa i colori, non li crea'), T('li fa il vetro', 'che il vetro colora la luce', 'che il vetro aggiunge i colori'), T('dal Sole, solo di giorno', 'che il verde è il colore più forte', 'che ogni prisma fa colori diversi')],
          answer: 0,
          explain: T('Giusto: il prisma li separa soltanto.', 'Esatto: la luce bianca è una miscela di colori.', 'Esatto: se il vetro creasse i colori, il verde si aprirebbe di nuovo.'),
        },
        {
          kind: 'q',
          text: T('Che cosa fanno tutti i colori insieme?', 'Perché un disco con i colori dell’arcobaleno, girando veloce, sembra bianco?', 'Perché il disco di Newton, che gira veloce, sembra bianco?'),
          options: [T('il bianco', 'l’occhio mescola i colori e vede il bianco', 'l’occhio somma i colori, e la somma di tutti è il bianco'), T('il nero, come il buio', 'perché la vernice si scolorisce', 'perché la velocità cancella i colori'), T('il marrone', 'perché gira troppo in fretta per vederlo bene', 'perché l’aria lo illumina')],
          answer: 0,
          explain: T('Giusto: tutti insieme fanno il bianco.', 'Esatto: è il disco di Newton.', 'Esatto: l’occhio non distingue i colori che si alternano così in fretta, e li somma.'),
        },
      ],
      hints: [T('Il prisma non crea i colori: li separa.', 'Un colore puro non si divide; tutti insieme fanno il bianco.', 'Separare e ricomporre: i colori erano già nella luce bianca.')],
    },
    {
      id: 'ot03-3', kind: 'lezione', title: 'L’arcobaleno',
      sim: 'colors', params: { mode: 'arcobaleno', sole: 20 }, controls: ['sole'],
      intro: T(
        'Dopo un temporale, con il Sole alle spalle e la pioggia davanti, compare l’arcobaleno. Ogni goccia d’acqua fa come me: è un piccolo prisma! Cambia l’altezza del Sole: quando si vede l’arcobaleno?',
        'Ogni goccia di pioggia piega la luce entrando, la riflette sul fondo e la piega di nuovo uscendo: i colori escono separati, il rosso a 42° e il violetto a 40° dalla direzione opposta al Sole. Per questo l’arcobaleno è un cerchio di 42° attorno al punto opposto al Sole, e si vede solo con il Sole alle spalle.',
        'Cartesio, nel 1637, seguì a uno a uno i raggi in una goccia d’acqua e trovò che la luce, dopo una riflessione interna, esce concentrata a 42° dalla direzione opposta al Sole. L’arcobaleno è quindi un cerchio, con il centro nell’ombra della tua testa: ognuno vede il suo. Più il Sole è alto, più l’arco si abbassa.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il Sole basso e il Sole alto.', 'Prova il Sole a 10° o meno, e a 45° o più.'),
          need: [
            { when: 'sole <= 10', try: { sole: 10 }, msg: T('Prova il Sole basso.', 'Manca una prova a 10° o meno.') },
            { when: 'sole >= 45', try: { sole: 45 }, msg: T('Ora il Sole alto.', 'Manca una prova a 45° o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Per vedere l’arcobaleno, il Sole deve essere…', 'Dove deve essere il Sole per vedere l’arcobaleno?', 'Perché l’arcobaleno si vede solo con il Sole alle spalle?'),
          options: [T('alle tue spalle', 'alle spalle, e non troppo alto', 'perché le gocce rimandano la luce indietro, verso il Sole'), T('davanti a te', 'davanti, fra le nuvole e la pioggia', 'perché la luce attraversa le gocce senza riflettersi'), T('dove vuole', 'in qualunque posizione nel cielo', 'perché la pioggia brilla da sola, come le lucciole d’estate')],
          answer: 0,
          explain: T('Giusto: Sole dietro, pioggia davanti.', 'Esatto: e più basso di 42°.', 'Esatto: dentro la goccia la luce si riflette sul fondo, e torna indietro.'),
        },
        {
          kind: 'q',
          text: T('Con il Sole molto alto, l’arcobaleno…', 'Con il Sole a 45°, l’arcobaleno…', 'Perché a mezzogiorno d’estate non si vede quasi mai l’arcobaleno?'),
          options: [T('non si vede', 'resta sotto l’orizzonte', 'il Sole è sopra i 42°, e l’arco resta sotto l’orizzonte'), T('è più alto', 'diventa più alto', 'perché d’estate non piove'), T('è più grande', 'diventa più colorato e più largo', 'perché la luce di mezzogiorno è troppo bianca')],
          answer: 0,
          explain: T('Giusto: è troppo in basso, sotto l’orizzonte.', 'Esatto: la cima sarebbe a 42° − 45° = −3°.', 'Esatto: da un aereo, però, lo si può vedere tutto intero: un cerchio.'),
        },
        {
          kind: 'q',
          text: T('Ogni goccia di pioggia è come…', 'Che cosa succede alla luce dentro una goccia?', 'Perché il rosso sta fuori e il violetto dentro l’arco?'),
          options: [T('un piccolo prisma', 'si piega, si riflette sul fondo e si piega di nuovo', 'il violetto esce più vicino al centro'), T('una piccola lampadina', 'si spegne', 'perché il rosso è più pesante e cade più in basso'), T('un pezzo di nuvola', 'passa dritta senza cambiare', 'perché il violetto si consuma prima, strada facendo')],
          answer: 0,
          explain: T('Giusto: e tante gocce insieme fanno l’arco.', 'Esatto: e i colori escono separati.', 'Esatto: il rosso esce a 42°, il violetto a 40°: si piega di più ed esce più vicino al centro dell’arco.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’altezza dell’arcobaleno.'),
          vals: { sol: [10, 20, 30] }, calc: '42 - sol', unit: '°', tol: 0.5,
          ask: T(null,
            'Il Sole è a <b>{sol}°</b> sopra l’orizzonte. A che altezza, in gradi, è la cima dell’arcobaleno?',
            'Sole a <b>{sol}°</b> sull’orizzonte: a che altezza è la cima dell’arco? [[cima = 42° − altezza del Sole]]'),
          explain: T(null, 'Esatto: 42° − {sol}° = {ans:0}°.', 'Esatto: {ans:0}°.'),
        },
      ],
      hints: [T('Sole alle spalle, e non troppo alto.', 'La cima dell’arco è a 42° meno l’altezza del Sole.', 'L’arcobaleno è un cerchio di 42° attorno all’ombra della tua testa.')],
      solution: T(
        'Con il Sole basso alle spalle l’arcobaleno è alto; con il Sole troppo alto non si vede.',
        'Cima a 42° − altezza del Sole: con il Sole sopra 42°, niente arcobaleno.',
        'Un cerchio di 42° attorno al punto opposto al Sole.'),
    },
    {
      id: 'ot03-4', kind: 'lezione', title: 'Mescolare la luce',
      sim: 'colors', params: { mode: 'luci', r: true, g: false, b: false }, controls: ['r', 'g', 'b'],
      intro: T(
        'Tre torce: una rossa, una verde e una blu. Puntale sul muro e accendile insieme: dove le luci si sovrappongono compaiono colori nuovi! Che cosa fanno il rosso e il verde insieme? E tutte e tre?',
        'La luce si mescola <b>sommando</b>: è la <b>sintesi additiva</b>. Bastano tre colori, i <b>colori primari</b> della luce, rosso, verde e blu, per ottenere quasi tutti gli altri: rosso e verde danno il giallo, rosso e blu il magenta, verde e blu il ciano, tutti e tre il bianco.',
        'Lo schermo che stai guardando è fatto di milioni di puntini rossi, verdi e blu: da vicino, con una lente, si vedono. L’occhio ha tre tipi di cellule per i colori, e il cervello somma i tre segnali. Per questo tre luci bastano a imitare quasi ogni colore, e la somma di tutte e tre ci sembra bianca.'),
      steps: [
        {
          kind: 'free',
          text: T('Accendi il rosso e il verde insieme, poi tutte e tre.', 'Accendi rosso e verde insieme, poi tutte e tre le torce.'),
          need: [
            { when: 'r && g && !b', try: { r: true, g: true, b: false }, msg: T('Accendi solo il rosso e il verde.', 'Manca una prova con rosso e verde, senza blu.') },
            { when: 'r && g && b', try: { r: true, g: true, b: true }, msg: T('Ora accendile tutte e tre.', 'Manca una prova con tutte e tre.') },
          ],
        },
        {
          kind: 'q',
          text: T('Rosso e verde insieme fanno…', 'Luce rossa più luce verde dà…', 'Perché rosso e verde, sommati, ci sembrano gialli?'),
          options: [T('il giallo', 'il giallo', 'eccitano insieme due tipi di cellule dell’occhio, come la luce gialla'), T('il marrone', 'il marrone', 'perché il giallo sta fra il rosso e il verde nell’arcobaleno'), T('il nero, si spengono', 'il nero', 'perché le due luci si annullano')],
          answer: 0,
          explain: T('Giusto: il giallo! Sorprendente, vero?', 'Esatto: rosso + verde = giallo.', 'Esatto: l’occhio non distingue una luce gialla pura da una miscela di rosso e verde.'),
        },
        {
          kind: 'q',
          text: T('Tutte e tre le torce insieme fanno…', 'Rosso + verde + blu dà…', 'Perché i colori primari della luce sono proprio rosso, verde e blu?'),
          options: [T('il bianco', 'il bianco', 'l’occhio ha tre tipi di cellule'), T('il nero', 'il nero', 'perché sono i colori più belli dell’arcobaleno'), T('il marrone', 'il grigio scuro', 'perché sono i colori più luminosi di tutti')],
          answer: 0,
          explain: T('Giusto: il bianco!', 'Esatto: la sintesi additiva di tutti e tre dà il bianco.', 'Esatto: l’occhio ha tre tipi di cellule per i colori, e ogni luce ne stimola soprattutto uno.'),
        },
        {
          kind: 'q',
          text: T('Le pitture rosse e verdi, mescolate, fanno il marrone. E le luci?', 'Perché mescolando le tempere non si ottiene il bianco?', 'Che differenza c’è fra mescolare luci e mescolare pitture?'),
          options: [T('fanno il giallo', 'perché le pitture tolgono colori alla luce, invece di aggiungerli', 'le luci si sommano, le pitture si sottraggono'), T('fanno anche loro il marrone', 'perché le pitture sono sporche', 'nessuna: è la stessa cosa'), T('fanno il nero', 'perché ci vuole il pennello giusto', 'le pitture si sommano, le luci si sottraggono')],
          answer: 0,
          explain: T('Giusto: luci e pitture si mescolano in modo diverso.', 'Esatto: ogni pittura assorbe una parte della luce.', 'Esatto: sintesi additiva per le luci, sottrattiva per le pitture.'),
        },
      ],
      hints: [T('Dove le luci si sovrappongono, i colori si sommano.', 'Rosso + verde = giallo; tutti e tre = bianco.', 'Sintesi additiva: l’occhio somma le luci.')],
      solution: T(
        'Rosso e verde fanno il giallo; tutte e tre le luci fanno il bianco.',
        'Sintesi additiva: rosso + verde = giallo, rosso + blu = magenta, verde + blu = ciano, tutti = bianco.',
        'Con tre luci primarie si imitano quasi tutti i colori; insieme fanno il bianco.'),
    },
    {
      id: 'ot03-5', kind: 'lezione', title: 'Il colore delle cose',
      sim: 'colors', params: { mode: 'oggetti', luce: 'bianca', cosa: 'mela' }, controls: ['luce', 'cosa'],
      intro: T(
        'Perché una mela è rossa? Perché della luce che la colpisce rimanda indietro solo il rosso, e il resto lo tiene per sé. E se la illumini con una luce blu, che di rosso non ne ha? Prova!',
        'Un oggetto che non fa luce rimanda una parte di quella che riceve e assorbe il resto. Una mela rossa rimanda il rosso, una foglia il verde, un foglio bianco rimanda tutto. Il colore che vediamo dipende anche dalla luce: sotto una luce che non contiene il suo colore, un oggetto sembra nero.',
        'Pittori e stampanti lavorano al contrario delle luci: ogni pigmento toglie dei colori alla luce bianca. È la sintesi sottrattiva. Per questo i colori nei negozi cambiano sotto luci diverse, e una camicia comprata sotto i neon può sembrare di un altro colore al sole.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la mela con la luce bianca, e poi con la luce blu.'),
          need: [
            { when: "cosa == 'mela' && luce == 'bianca'", try: { cosa: 'mela', luce: 'bianca' }, msg: T('Prova la mela con la luce bianca.', 'Manca la mela con la luce bianca.') },
            { when: "cosa == 'mela' && luce == 'blu'", try: { cosa: 'mela', luce: 'blu' }, msg: T('Ora la mela con la luce blu.', 'Manca la mela con la luce blu.') },
          ],
        },
        {
          kind: 'q',
          text: T('Sotto la luce blu, la mela sembra…', 'Una mela rossa, sotto una luce blu, sembra…', 'Perché una mela rossa, sotto una luce blu, sembra nera?'),
          options: [T('nera', 'nera', 'perché nella luce blu non c’è il rosso da rimandare'), T('rossa come sempre', 'rossa', 'perché assorbe il blu e lo diventa'), T('blu', 'blu', 'perché la luce blu la scalda e la fa diventare scura')],
          answer: 0,
          explain: T('Giusto: senza rosso, non ha niente da rimandare.', 'Esatto: assorbe il blu, e il rosso non c’è.', 'Esatto: il colore di un oggetto è la luce che rimanda.'),
        },
        {
          kind: 'free',
          text: T('Ora prova la banana con la luce rossa e con la luce verde.', 'Prova la banana con la luce rossa e con quella verde.'),
          need: [
            { when: "cosa == 'banana' && luce == 'rossa'", try: { cosa: 'banana', luce: 'rossa' }, msg: T('Prova la banana con la luce rossa.', 'Manca la banana con la luce rossa.') },
            { when: "cosa == 'banana' && luce == 'verde'", try: { cosa: 'banana', luce: 'verde' }, msg: T('Ora la banana con la luce verde.', 'Manca la banana con la luce verde.') },
          ],
        },
        {
          kind: 'q',
          text: T('La banana gialla, sotto la luce rossa, sembra…', 'Una banana gialla rimanda il rosso e il verde. Sotto una luce rossa sembra…', 'Perché una banana gialla, sotto una luce verde, sembra verde?'),
          options: [T('rossa', 'rossa', 'rimanda il verde che c’è, e il rosso che manca non può rimandarlo'), T('gialla', 'gialla', 'perché il giallo è più forte del verde'), T('nera', 'nera', 'perché la luce verde la colora come una vernice')],
          answer: 0,
          explain: T('Giusto: rimanda il rosso della luce.', 'Esatto: della luce rossa rimanda tutto: il rosso.', 'Esatto: il giallo della banana è rosso più verde.'),
        },
        {
          kind: 'q',
          text: T('Un foglio bianco, sotto la luce verde, sembra…', 'Perché un foglio bianco prende il colore della luce?', 'Perché la neve è bianca e il carbone è nero?'),
          options: [T('verde', 'perché rimanda tutti i colori', 'la neve rimanda la luce, il carbone la assorbe'), T('bianco', 'perché è trasparente come il vetro', 'la neve è fredda e il carbone è caldo, quindi più scuro'), T('nero come il carbone', 'perché è sottile e leggero come l’aria', 'il carbone è più pesante della neve, e la luce ci affonda')],
          answer: 0,
          explain: T('Giusto: rimanda la luce verde che riceve.', 'Esatto: il bianco rimanda tutto quello che arriva.', 'Esatto: la neve rimanda quasi tutta la luce, il carbone la assorbe quasi tutta: bianco vuol dire che rimanda tutto, nero che non rimanda niente.'),
        },
      ],
      hints: [T('Un oggetto rimanda il suo colore solo se c’è nella luce.', 'Il colore che vedi è la luce che l’oggetto rimanda.', 'Sintesi sottrattiva: l’oggetto toglie colori alla luce.')],
      solution: T(
        'Una mela rossa rimanda solo il rosso: sotto la luce blu sembra nera.',
        'Si vede il colore rimandato: il rosso della mela solo se la luce lo contiene.',
        'Il colore di un oggetto è la parte della luce che rimanda.'),
    },
    {
      id: 'ot03-6', kind: 'costruisci', title: 'La fontana arcobaleno',
      sim: 'colors', params: { mode: 'fontana', sole: 10, alto: 10 }, controls: ['alto'],
      intro: T(
        'Nel parco arriva la fontana arcobaleno! Con il Sole alle spalle, negli spruzzi compare un arcobaleno. Ma dove guardare? Un trucco: l’altezza del Sole più quella della cima dell’arcobaleno fa sempre 42 gradi.',
        'Costruisci la fontana arcobaleno del parco. Il Sole è alle tue spalle, alto un certo numero di gradi; gli spruzzi sono davanti. La cima dell’arcobaleno è a 42° meno l’altezza del Sole: alza lo sguardo proprio lì.',
        'La fontana arcobaleno: le gocce degli spruzzi fanno da prismi, e i colori arrivano all’occhio solo dalle gocce a 42° dal punto opposto al Sole. Lo stesso arco si vede negli spruzzi delle cascate e dei tubi per innaffiare. [[cima = 42° − altezza del Sole]]'),
      piece: { id: 'arcobaleno', name: 'La fontana arcobaleno', desc: 'Il Sole alle spalle e lo sguardo al punto giusto: negli spruzzi compare l’arcobaleno.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Alza lo sguardo, poi lancia.', 'Alza lo sguardo, poi lancia: devi vedere la cima dell’arcobaleno.'),
          vals: { e: { sole: [[10], [20]] }, s: { sole: [[5, 10, 15], [20, 25, 30]] } },
          set: { sole: 'sole' },
          ask: T(
            'Il Sole è alto <b>{sole} gradi</b>, alle tue spalle. Quanto in alto guardi?',
            'Il Sole è a <b>{sole}°</b> sopra l’orizzonte. A che altezza guardi per vedere la cima dell’arcobaleno?',
            'Sole a <b>{sole}°</b>: altezza della cima dell’arco? [[cima = 42° − altezza del Sole]]'),
          measure: 'alto', goal: '42 - sole', tol: 1.5,
          ok: T('Arcobaleno! I colori si accendono!', 'Esatto: ecco l’arcobaleno.'),
          high: T('Troppo in alto: lì ci sono solo spruzzi. Abbassa lo sguardo.', 'Troppo in alto: la cima dell’arco è più in basso.'),
          low: T('Troppo in basso: lì ci sono solo spruzzi. Alza lo sguardo.', 'Troppo in basso: la cima dell’arco è più in alto.'),
          solve: { alto: '42 - sole' },
        },
        {
          kind: 'q',
          text: T('Se il Sole sale, la cima dell’arcobaleno…', 'Se il Sole sale di 10°, la cima dell’arcobaleno…', 'Perché due persone vicine non vedono lo stesso arcobaleno?'),
          options: [T('scende', 'scende di 10°', 'ognuno vede l’arco attorno all’ombra della propria testa, in gocce diverse'), T('sale più in alto', 'sale di 10°, insieme al Sole', 'perché la pioggia cade a caso'), T('resta lì', 'resta uguale, sempre lì', 'perché ognuno vede i colori in modo diverso')],
          answer: 0,
          explain: T('Giusto: più alto il Sole, più basso l’arco.', 'Esatto: la cima è a 42° meno l’altezza del Sole.', 'Esatto: i colori arrivano a ciascuno da gocce diverse: ognuno ha il suo arcobaleno.'),
        },
      ],
      hints: [T('Altezza del Sole più cima dell’arcobaleno fa 42.', 'Cima dell’arco = 42° − altezza del Sole.', 'L’arco è a 42° dal punto opposto al Sole.')],
      solution: T('Con il Sole a 10 gradi guarda a 32; con il Sole a 20, a 22.', 'Cima = 42° − Sole: con 10°, 32°; con 20°, 22°.', 'Guarda a 42° meno l’altezza del Sole.'),
    },
    {
      id: 'ot03-7', kind: 'ripasso', title: 'Ripasso di colori e spettro',
      intro: T('Ripassiamo: prismi, arcobaleni e luci colorate!', 'Ripasso: dispersione, spettro, arcobaleno, sintesi additiva e sottrattiva.', 'Ripasso: che cos’è il colore.'),
      steps: [
        {
          kind: 'q',
          text: T('Che cosa fa un prisma alla luce bianca?', 'Che cos’è la dispersione?', 'Perché il prisma separa i colori?'),
          options: [T('la apre in tutti i colori', 'la separazione della luce nei suoi colori', 'perché ogni colore ha il suo indice di rifrazione'), T('la spegne', 'la luce che si sparpaglia nella nebbia', 'perché il vetro è colorato'), T('la fa più bianca', 'la luce che rimbalza su uno specchio', 'perché la luce si stanca nel vetro e perde i colori per strada')],
          answer: 0,
          explain: T('Giusto: tutti i colori dell’arcobaleno.', 'Esatto: il violetto si piega più del rosso.', 'Esatto: colori diversi, rifrazioni diverse.'),
        },
        {
          kind: 'q',
          text: T('Di che colore è il bordo esterno dell’arcobaleno?', 'Il Sole è a 30°: a che altezza è la cima dell’arcobaleno?', 'Dove si trova il centro del cerchio dell’arcobaleno?'),
          options: [T('rosso', '12°', 'nell’ombra della testa di chi guarda'), T('violetto', '30°', 'nel Sole, che sta proprio alle tue spalle'), T('verde', '72°', 'nella nuvola più vicina, dove piove di più')],
          answer: 0,
          explain: T('Giusto: rosso fuori, violetto dentro.', 'Esatto: 42° − 30° = 12°.', 'Esatto: nel punto opposto al Sole.'),
        },
        {
          kind: 'q',
          text: T('Rosso, verde e blu insieme fanno…', 'Luce verde più luce blu dà…', 'Che cosa succede alla luce che colpisce una foglia verde?'),
          options: [T('il bianco', 'il ciano', 'rimanda il verde e assorbe gli altri colori'), T('il nero', 'il giallo', 'assorbe il verde e rimanda gli altri'), T('il marrone', 'il magenta', 'la attraversa tutta, come se fosse fatta di vetro')],
          answer: 0,
          explain: T('Giusto: tutte le luci insieme fanno il bianco.', 'Esatto: verde + blu = ciano.', 'Esatto: per questo la vediamo verde.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’arcobaleno.'),
          vals: { sol: [5, 15, 25] }, calc: '42 - sol', unit: '°', tol: 0.5,
          ask: T(null,
            'Il Sole è a <b>{sol}°</b> sopra l’orizzonte. A che altezza è la cima dell’arcobaleno?',
            'Sole a <b>{sol}°</b>: cima dell’arco? [[cima = 42° − altezza del Sole]]'),
          explain: T(null, 'Esatto: 42° − {sol}° = {ans:0}°.', 'Esatto: {ans:0}°.'),
        },
        {
          kind: 'q',
          text: T('Una mela rossa, sotto la luce verde, sembra…', 'Un vestito blu, sotto una luce rossa, sembra…', 'Perché sotto i lampioni gialli delle strade le auto sembrano tutte grigie?'),
          options: [T('nera', 'nero', 'la loro luce ha quasi un colore solo'), T('verde', 'viola', 'perché i lampioni sono troppo deboli per i colori'), T('rossa', 'rosso', 'perché di notte le auto si sporcano di smog')],
          answer: 0,
          explain: T('Giusto: nella luce verde non c’è il rosso.', 'Esatto: nella luce rossa il blu non c’è.', 'Esatto: le lampade al sodio fanno una luce quasi tutta gialla: gli altri colori spariscono.'),
        },
      ],
    },
    {
      id: 'ot03-8', kind: 'boss', who: 'bilancia', title: 'La luce invisibile', win: T('Esperimento riuscito!'),
      sim: 'colors', params: { mode: 'herschel', pos: 'rosso' }, controls: ['pos'],
      intro: T(
        'Sono Bilancia. Nel 1800 William Herschel fece un esperimento al buio: un prisma, lo spettro sul tavolo e un termometro. Mettilo nei colori, oltre il rosso dove non si vede niente, e all’ombra. Dove scalda di più? Esperimento al buio!',
        'Sono Bilancia. Esperimento al buio, come quello di William Herschel nel 1800: un prisma apre la luce del Sole in uno spettro, e un termometro misura quanto scalda ogni colore. Oltre il rosso non si vede niente. Per un confronto onesto serve anche un termometro all’ombra.',
        'Sono Bilancia. Herschel voleva sapere quale colore scalda di più, per costruire filtri con cui osservare il Sole. Mise i termometri nei colori, e uno di controllo all’ombra; poi, per curiosità, uno oltre il rosso, dove non arrivava nessun colore. Fu la scoperta di una luce invisibile. Ripetiamo l’esperimento.'),
      steps: [
        {
          kind: 'q',
          text: T('Per un confronto giusto, un termometro va messo anche…', 'Perché serve un termometro all’ombra?', 'A che cosa serve il termometro di controllo?'),
          options: [T('all’ombra, fuori dalla luce', 'per sapere quanto sale la temperatura della stanza', 'a separare l’effetto della luce da quello della stanza'), T('nel frigorifero', 'per misurare il freddo', 'a misurare la temperatura del prisma'), T('in tasca', 'per avere un termometro di riserva', 'a niente: basta un termometro solo')],
          answer: 0,
          explain: T('Giusto: così sai quanto scalda la stanza da sola.', 'Esatto: quello che sale in più è merito della luce.', 'Esatto: senza controllo non sai che cosa ha scaldato.'),
        },
        {
          kind: 'free',
          text: T('Metti il termometro all’ombra, nel rosso e oltre il rosso.', 'Prova il termometro all’ombra, nel rosso e oltre il rosso.'),
          need: [
            { when: "pos == 'fuori'", try: { pos: 'fuori' }, msg: T('Mettilo all’ombra.', 'Manca la prova all’ombra.') },
            { when: "pos == 'rosso'", try: { pos: 'rosso' }, msg: T('Ora nel rosso.', 'Manca la prova nel rosso.') },
            { when: "pos == 'oltre'", try: { pos: 'oltre' }, msg: T('Ora oltre il rosso, dove non si vede niente.', 'Manca la prova oltre il rosso.') },
          ],
        },
        {
          kind: 'q',
          text: T('Dove il termometro sale di più?', 'Dove scalda di più la luce del prisma?', 'Che cosa trovò Herschel misurando dal blu al rosso, e oltre?'),
          options: [T('oltre il rosso, dove non si vede niente', 'oltre il rosso, dove è buio', 'che la temperatura cresce verso il rosso, e ancora di più oltre'), T('nel blu', 'nel violetto', 'che il blu scalda più di tutti'), T('all’ombra', 'all’ombra', 'che tutti i colori scaldano uguale, dal blu fino al rosso e oltre')],
          answer: 0,
          explain: T('Giusto: dove sembra buio scalda di più!', 'Esatto: più 8 gradi, contro i 6 del rosso.', 'Esatto: il massimo era oltre il rosso, al buio.'),
        },
        {
          kind: 'q',
          text: T('Allora, oltre il rosso c’è…', 'Che cosa c’è oltre il rosso?', 'Perché i nostri occhi non vedono l’infrarosso?'),
          options: [T('una luce che non vediamo', 'una luce invisibile: l’infrarosso', 'perché sono sensibili solo a una piccola parte della luce'), T('il calore del tavolo', 'il calore del tavolo', 'perché l’infrarosso è troppo debole per accendere l’occhio'), T('niente di niente', 'una corrente d’aria calda', 'perché l’infrarosso non esiste davvero: è soltanto calore')],
          answer: 0,
          explain: T('Giusto: si chiama infrarosso, «sotto il rosso».', 'Esatto: è la luce che vedono le telecamere termiche.', 'Esatto: la luce visibile è solo una piccola parte di tutta la luce.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il termometro di controllo.'),
          vals: { temp: [28, 28.5, 29] }, calc: 'temp - 20.5', unit: '°C', tol: 0.05,
          ask: T(null,
            'Il termometro oltre il rosso passa da 20 °C a <b>{temp} °C</b>; quello all’ombra, nello stesso tempo, da 20 °C a 20,5 °C. Di quanto ha scaldato la luce invisibile?',
            'Oltre il rosso: da 20 °C a <b>{temp} °C</b>. All’ombra: da 20 °C a 20,5 °C. Quanto ha scaldato la luce invisibile?'),
          explain: T(null, 'Esatto: {temp} − 20,5 = {ans:1} °C; il resto lo ha fatto la stanza.', 'Esatto: {ans:1} °C, tolto quello che fa la stanza.'),
        },
        {
          kind: 'q',
          text: T('Allora, oltre il rosso c’è luce?', 'Il verdetto dell’esperimento?', 'Il verdetto?'),
          options: [T('sì, ma non la vediamo', 'oltre il rosso c’è una luce invisibile: l’infrarosso', 'esiste luce invisibile: lo spettro continua oltre il rosso'), T('no, è tutto buio', 'oltre il rosso non c’è niente', 'lo spettro finisce dove finisce il rosso'), T('solo di giorno', 'il termometro era rotto', 'era il calore della stanza')],
          answer: 0,
          explain: T('Esperimento riuscito! Oltre il rosso c’è una luce invisibile che scalda: l’infrarosso.', 'Esperimento riuscito: l’infrarosso, scoperto da Herschel nel 1800.', 'Esperimento riuscito: l’anno dopo Ritter trovò anche l’ultravioletto, oltre il violetto.'),
        },
      ],
      hints: [T('Metti il termometro anche dove non vedi colori.', 'Confronta sempre con il termometro all’ombra.', 'Lo spettro non finisce dove finiscono i colori.')],
      solution: T(
        'Oltre il rosso il termometro sale di più: lì c’è una luce invisibile.',
        'Oltre il rosso: +8 °C, contro 0 °C all’ombra. È l’infrarosso.',
        'L’infrarosso: luce invisibile oltre il rosso, scoperta da Herschel.'),
    },
  ],
};
