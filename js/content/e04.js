// E04 · Induzione e generatori. Simulazione: l'induzione (induction.js), in sei modi: la calamita e la bobina con il
// galvanometro, il tubo di rame che frena la calamita, il generatore con lo schermo della tensione alternata, il
// trasformatore, la pista delle macchinine del parco e, per Bilancia, i tubi e i cilindretti misteriosi.
// La zona rovescia la scoperta di Ørsted: se la corrente fa una calamita, una calamita che si muove fa la corrente
// (Faraday, 1831). Poi la legge di Lenz e il freno magnetico, il generatore e la corrente alternata delle centrali, il
// trasformatore che alza e abbassa la tensione; nel parco arriva la pista delle macchinine; il boss è un esperimento al
// buio di Bilancia: due tubi grigi e due cilindretti uguali, da riconoscere con un cronometro.
import { T } from '../util.js';

export default {
  id: 'E04',
  title: 'Induzione e generatori',
  levels: [
    {
      id: 'e04-1', kind: 'prevedi', title: 'La calamita e la bobina',
      sim: 'induzione', params: { mode: 'bobina', moto: 'dentro', vel: 'veloce', spire: 200 }, controls: [],
      intro: T(
        'Una bobina di filo è collegata a un misuratore di corrente, ma non c’è nessuna pila. Avviciniamo una calamita: succederà qualcosa? Prima indovina, poi guarda!',
        'Una bobina di filo è collegata a un <b>galvanometro</b>, un amperometro molto sensibile con lo zero al centro: l’ago va a destra o a sinistra secondo il verso della corrente. Nel circuito non c’è nessuna pila. Prevedi che cosa fa l’ago quando muovi una calamita.',
        'Nel 1831 Michael Faraday cercava il contrario dell’esperimento di Ørsted: se la corrente fa una calamita, una calamita può fare una corrente? Una bobina, un galvanometro e nessuna pila. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { moto: 'dentro' }, predict: [{ moto: 'dentro' }],
          text: T('Spingi la calamita dentro la bobina: l’ago…', 'La calamita entra nella bobina: l’ago del galvanometro…', 'La calamita entra nella bobina, e non c’è nessuna pila:'),
          options: [T('si muove', 'si sposta: passa corrente', 'l’ago si sposta: c’è corrente'), T('resta fermo: non c’è la pila', 'resta sullo zero: senza pila niente corrente', 'l’ago resta sullo zero'), T('gira in tondo', 'gira all’impazzata', 'l’ago si blocca in fondo alla scala')],
          answer: 0,
          explain: T('Sorpresa: la calamita che si muove fa la corrente!', 'Esatto: passa corrente, anche senza pila.', 'Esatto: è l’induzione elettromagnetica.'),
          solution: T('Si muove.', 'Si sposta: passa corrente.'),
        },
        {
          kind: 'q', set: { moto: 'ferma' }, predict: [{ moto: 'ferma' }],
          text: T('Ora la calamita resta ferma dentro la bobina: l’ago…', 'La calamita resta ferma dentro la bobina: l’ago…', 'La calamita è dentro la bobina, ferma:'),
          options: [T('torna a zero', 'torna sullo zero', 'l’ago torna sullo zero'), T('resta spostato', 'resta spostato: la calamita è dentro', 'l’ago resta spostato finché la calamita è dentro'), T('va dall’altra parte', 'va dall’altra parte', 'l’ago va dall’altra parte')],
          answer: 0,
          explain: T('Giusto: se sta ferma, niente corrente.', 'Esatto: conta il movimento, non la calamita.', 'Esatto: serve un campo che cambia, non un campo e basta.'),
          solution: T('Torna a zero.', 'Torna sullo zero.'),
        },
        {
          kind: 'q', set: { moto: 'fuori' }, predict: [{ moto: 'fuori' }],
          text: T('Ora tiri fuori la calamita: l’ago…', 'La calamita esce dalla bobina: l’ago…', 'La calamita esce dalla bobina:'),
          options: [T('va dall’altra parte', 'si sposta dall’altra parte', 'l’ago si sposta dall’altra parte'), T('va dalla stessa parte', 'si sposta dalla stessa parte', 'l’ago si sposta dalla stessa parte'), T('resta fermo', 'resta sullo zero', 'l’ago resta sullo zero')],
          answer: 0,
          explain: T('Giusto: la corrente va al contrario.', 'Esatto: la corrente cambia verso.', 'Esatto: il campo ora diminuisce, e la corrente si inverte.'),
          solution: T('Va dall’altra parte.', 'Si sposta dall’altra parte.'),
        },
        {
          kind: 'q',
          text: T('Allora la corrente nasce quando la calamita…', 'Quando passa corrente nella bobina?', 'Che cosa fa nascere la corrente nella bobina?'),
          options: [T('si muove', 'quando la calamita si muove', 'un campo magnetico che cambia'), T('è vicina, anche ferma', 'quando la calamita è dentro, anche ferma', 'un campo magnetico forte, anche fermo'), T('è rossa', 'sempre, anche senza calamita', 'il rame della bobina, da solo')],
          answer: 0,
          explain: T('Giusto: serve il movimento!', 'Esatto: solo se la calamita si muove.', 'Esatto: un campo che cambia. Faraday la chiamò induzione.'),
        },
      ],
      hints: [T('Guarda l’ago mentre la calamita si muove e quando si ferma.', 'Conta il movimento della calamita, non la calamita.', 'Serve un campo magnetico che cambia.')],
    },
    {
      id: 'e04-2', kind: 'lezione', title: 'Più veloce, più corrente',
      sim: 'induzione', params: { mode: 'bobina', moto: 'dentro', vel: 'piano', spire: 100 }, controls: ['vel', 'spire'],
      intro: T(
        'La calamita che si muove fa la corrente. Ma quanta? Prova a spingerla piano e veloce, con pochi o tanti giri di filo, e guarda fin dove arriva l’ago.',
        'È la <b>legge di Faraday</b>: la <b>tensione indotta</b> è tanto più grande quanto più in fretta cambia il campo magnetico dentro la bobina, e quante più <b>spire</b> ha la bobina. Spingi la calamita piano o veloce, con 100, 200, 300 o 400 spire.',
        'Faraday scoprì che la tensione indotta dipende da quanto in fretta cambia il <b>flusso magnetico</b>, cioè il campo moltiplicato per l’area della spira, che si misura in weber (Wb). Ogni spira dà la sua parte, e le parti si sommano. [[V = N · ΔΦ / Δt]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la calamita piano e veloce.', 'Prova la calamita spinta piano e spinta veloce.'),
          need: [
            { when: "vel == 'piano'", try: { vel: 'piano' }, msg: T('Prova piano.', 'Manca la prova piano.') },
            { when: "vel == 'veloce'", try: { vel: 'veloce' }, msg: T('Ora veloce.', 'Manca la prova veloce.') },
          ],
        },
        {
          kind: 'q',
          text: T('Spinta veloce, l’ago…', 'Spingendo la calamita più veloce, la tensione…', 'Perché spingendo più veloce la tensione cresce?'),
          options: [T('si sposta di più', 'cresce', 'il campo cambia in meno tempo'), T('si sposta di meno', 'cala', 'la calamita diventa più forte quando corre'), T('non si muove per niente', 'non cambia per niente', 'l’aria fa attrito sulla bobina')],
          answer: 0,
          explain: T('Giusto: più veloce, più corrente.', 'Esatto: più veloce, più tensione e più corrente.', 'Esatto: lo stesso cambiamento in metà tempo, il doppio della tensione.'),
        },
        {
          kind: 'free',
          text: T('Ora prova pochi e tanti giri di filo, con la calamita veloce.', 'Ora prova 100 spire e 400 spire, con la calamita veloce.'),
          need: [
            { when: "spire == 100 && vel == 'veloce'", try: { spire: 100, vel: 'veloce' }, msg: T('Prova pochi giri, veloce.', 'Manca la prova con 100 spire, veloce.') },
            { when: "spire == 400 && vel == 'veloce'", try: { spire: 400, vel: 'veloce' }, msg: T('Ora tanti giri, veloce.', 'Manca la prova con 400 spire, veloce.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con più giri di filo, la corrente…', 'Con più spire, la tensione indotta…', 'Perché con più spire la tensione cresce?'),
          options: [T('è più forte', 'cresce: ogni spira dà la sua parte', 'le tensioni delle spire si sommano'), T('è più debole', 'cala: il filo è più lungo', 'il filo è più lungo e scalda di più'), T('è proprio uguale a prima', 'resta uguale', 'le spire attirano di più la calamita')],
          answer: 0,
          explain: T('Giusto: più giri, più corrente.', 'Esatto: la tensione è proporzionale alle spire.', 'Esatto: N spire, N volte la tensione di una spira.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La tensione indotta.'),
          vals: { N: [200, 300, 400] }, calc: 'N / 500', unit: 'V', tol: 0.01,
          ask: T(null,
            'Con 100 spire e la calamita spinta dentro in 1 secondo, la tensione indotta è 0,1 V. Quanto vale con <b>{N} spire</b> e la calamita spinta in mezzo secondo?',
            '100 spire, in 1 s: 0,1 V. Con <b>{N} spire</b>, in 0,5 s? [[V = N · ΔΦ / Δt]]'),
          explain: T(null, 'Esatto: {N} spire sono {N}/100 volte di più, e in metà tempo la tensione raddoppia: {ans:1} V.', 'Esatto: {ans:1} V.'),
        },
        {
          kind: 'q',
          text: T('La luce della bici va con una dinamo. Più pedali veloce…', 'Perché la luce di una dinamo da bici è più forte quando vai veloce?', 'Con una vecchia dinamo, perché la luce si spegne quando ti fermi al semaforo?'),
          options: [T('più la luce è forte', 'la calamita gira più in fretta', 'la calamita non si muove più'), T('più la luce è debole', 'la pila della dinamo si carica di più', 'la pila della dinamo si scarica'), T('la luce non cambia mai', 'il filo della dinamo si scalda di più', 'la lampadina si raffredda troppo')],
          answer: 0,
          explain: T('Giusto: più veloce, più corrente!', 'Esatto: il campo cambia più in fretta, e la tensione cresce.', 'Esatto: senza movimento il campo non cambia.'),
        },
      ],
      hints: [T('Più veloce e più giri di filo: più corrente.', 'La tensione indotta cresce con la velocità e con le spire.', 'Più spire, e meno tempo per lo stesso cambiamento: più tensione.')],
      solution: T(
        'Più veloce e più giri di filo: più corrente.',
        'Tensione indotta proporzionale alle spire e alla rapidità con cui cambia il campo.',
        'La tensione indotta cresce con le spire e con la rapidità del cambiamento.'),
    },
    {
      id: 'e04-3', kind: 'lezione', title: 'Il freno magnetico',
      sim: 'induzione', params: { mode: 'tubo', tubo: 'plastica', ogg: 'calamita' }, controls: ['tubo', 'ogg'],
      intro: T(
        'Un tubo di plastica e un tubo di rame, lunghi un metro. Ci lasciamo cadere una calamita e un cilindretto di ferro, uguali e dello stesso peso. Quale arriva prima in fondo? Prova!',
        'La corrente indotta non nasce a caso: il suo campo magnetico si oppone sempre al cambiamento che l’ha prodotta. È la <b>legge di Lenz</b>. Una calamita che cade in un tubo di rame fa nascere correnti nel rame, e queste la frenano. Prova il tubo di plastica e quello di rame, con la calamita e con un cilindretto di ferro dello stesso peso.',
        'Nel 1834 Heinrich Lenz capì il verso della corrente indotta: si oppone sempre al cambiamento che la produce. Se così non fosse, la calamita accelererebbe da sola, creando energia dal nulla. Le stesse correnti, dette correnti parassite, frenano senza toccare i treni veloci e le torri a caduta libera.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la calamita nel tubo di plastica e in quello di rame.', 'Lascia cadere la calamita nel tubo di plastica e in quello di rame.'),
          need: [
            { when: "tubo == 'plastica' && ogg == 'calamita'", try: { tubo: 'plastica', ogg: 'calamita' }, msg: T('Prova il tubo di plastica.', 'Manca la calamita nel tubo di plastica.') },
            { when: "tubo == 'rame' && ogg == 'calamita'", try: { tubo: 'rame', ogg: 'calamita' }, msg: T('Ora il tubo di rame.', 'Manca la calamita nel tubo di rame.') },
          ],
        },
        {
          kind: 'q',
          text: T('Nel tubo di rame, la calamita…', 'Nel tubo di rame, la calamita cade…', 'Perché nel tubo di rame la calamita scende così piano?'),
          options: [T('scende piano piano', 'molto più piano', 'le correnti indotte nel rame la frenano'), T('cade veloce come prima', 'veloce come nella plastica', 'il rame attira la calamita verso le pareti'), T('si attacca al tubo', 'e si attacca al rame', 'nel tubo c’è più aria che la frena')],
          answer: 0,
          explain: T('Giusto: qualcosa la frena!', 'Esatto: quasi 10 volte più lenta.', 'Esatto: il rame non è magnetico, ma la calamita che cade vi fa nascere correnti, e il loro campo la frena.'),
        },
        {
          kind: 'free',
          text: T('Ora prova il cilindretto di ferro nel tubo di rame.', 'Ora lascia cadere il cilindretto di ferro nel tubo di rame.'),
          need: [
            { when: "tubo == 'rame' && ogg == 'ferro'", try: { tubo: 'rame', ogg: 'ferro' }, msg: T('Prova il ferro nel tubo di rame.', 'Manca il ferro nel tubo di rame.') },
          ],
        },
        {
          kind: 'q',
          text: T('Il ferro nel tubo di rame…', 'Il cilindretto di ferro, nel tubo di rame…', 'Perché il ferro cade veloce anche nel rame?'),
          options: [T('cade veloce', 'cade veloce come nella plastica', 'non induce correnti nel rame'), T('scende piano piano', 'scende piano come la calamita', 'il rame lo respinge'), T('si ferma a metà tubo', 'si blocca a metà', 'il ferro è più pesante della calamita')],
          answer: 0,
          explain: T('Giusto: il freno funziona solo con la calamita.', 'Esatto: senza calamita niente campo che cambia, e niente freno.', 'Esatto: il freno nasce dal campo che cambia, e il ferro da solo non ne ha.'),
        },
        {
          kind: 'q',
          text: T('Che cosa frena la calamita?', 'Che cosa dice la legge di Lenz?', 'Se la corrente indotta aiutasse la caduta, invece di frenarla, che cosa succederebbe?'),
          options: [T('la corrente che lei stessa fa nascere', 'la corrente indotta si oppone al cambiamento che la produce', 'energia dal nulla: accelererebbe da sola'), T('l’aria nel tubo', 'la corrente indotta aiuta sempre il movimento', 'niente di diverso: cadrebbe come nella plastica'), T('la colla nel tubo', 'la corrente indotta va sempre verso il basso', 'la calamita si fermerebbe di colpo, a metà del tubo')],
          answer: 0,
          explain: T('Giusto: un freno magnetico, senza toccare!', 'Esatto: per questo la calamita viene frenata.', 'Esatto: la legge di Lenz è la conservazione dell’energia.'),
        },
        {
          kind: 'q',
          text: T('Nelle torri a caduta libera, delle calamite servono a…', 'A che cosa servono i freni magnetici delle montagne russe?', 'Che cosa non sanno fare i freni magnetici, a differenza di quelli ad attrito?'),
          options: [T('frenare senza toccare', 'a frenare senza toccare e senza consumarsi', 'tenere fermo un carrello già fermo'), T('andare più veloci', 'a far andare il carrello più veloce', 'frenare un carrello velocissimo'), T('accendere le luci', 'a tenere attaccato il carrello', 'frenare senza consumarsi')],
          answer: 0,
          explain: T('Giusto: la calamita e il metallo non si toccano.', 'Esatto: niente attrito, niente usura.', 'Esatto: frenano solo finché c’è movimento; da fermi serve un freno normale.'),
        },
      ],
      hints: [T('Guarda come cade la calamita nel rame.', 'La corrente indotta si oppone al cambiamento: frena la calamita.', 'Lenz: il verso della corrente indotta si oppone a ciò che la produce.')],
      solution: T(
        'Nel rame la calamita scende piano: la corrente che fa nascere la frena.',
        'Legge di Lenz: la corrente indotta si oppone al cambiamento; nel rame la calamita cade piano, il ferro no.',
        'La corrente indotta frena il moto che la produce: è la legge di Lenz.'),
    },
    {
      id: 'e04-4', kind: 'lezione', title: 'Il generatore',
      sim: 'induzione', params: { mode: 'generatore', f: 1 }, controls: ['f'],
      intro: T(
        'Una bobina che gira fra i poli di una calamita fa la corrente, e accende una lampadina! È un generatore, come quelli delle centrali elettriche. La corrente va avanti e indietro: si chiama corrente alternata. Prova a girare piano e veloce.',
        'In un <b>generatore</b> una bobina gira in un campo magnetico: il campo dentro la bobina cambia di continuo, e nasce una tensione indotta. A ogni mezzo giro la corrente cambia verso: è la <b>corrente alternata</b>, diversa dalla corrente continua delle pile. Più giri al secondo, più tensione e più cambi di verso. In Europa la corrente di casa fa 50 cicli al secondo: 50 hertz.',
        'La maggior parte dell’elettricità del mondo nasce così: una turbina mossa dall’acqua, dal vapore o dal vento fa girare un generatore. La tensione segue una sinusoide: sale, scende, si inverte, 50 volte al secondo in Europa. [[V = Vmax · sin(2π f t)]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova a girare piano e veloce.', 'Prova 1 giro al secondo e 5 giri al secondo.'),
          need: [
            { when: 'f == 1', try: { f: 1 }, msg: T('Prova piano.', 'Manca la prova a 1 giro al secondo.') },
            { when: 'f == 5', try: { f: 5 }, msg: T('Ora veloce.', 'Manca la prova a 5 giri al secondo.') },
          ],
        },
        {
          kind: 'q',
          text: T('Girando più veloce, la lampadina…', 'Girando più veloce, la tensione…', 'Girando più veloce, che cosa cambia nella curva della tensione?'),
          options: [T('fa più luce', 'cresce', 'è più alta e con le onde più fitte'), T('fa meno luce di prima', 'cala, e la luce si affievolisce', 'è più bassa e con le onde più larghe'), T('si spegne del tutto', 'resta uguale, a ogni velocità', 'niente: dipende solo dalla calamita')],
          answer: 0,
          explain: T('Giusto: più veloce, più luce!', 'Esatto: il campo nella bobina cambia più in fretta.', 'Esatto: più tensione e più cicli al secondo.'),
        },
        {
          kind: 'q',
          text: T('La linea sullo schermo va su e giù. Vuol dire che la corrente…', 'Perché la corrente del generatore si chiama alternata?', 'Perché la corrente cambia verso a ogni mezzo giro?'),
          options: [T('cambia verso di continuo', 'cambia verso a ogni mezzo giro', 'i due lati si scambiano di posto'), T('si spegne e si accende', 'si accende e si spegne', 'la calamita cambia polo a ogni giro'), T('va sempre nello stesso verso', 'va avanti e indietro una volta sola', 'il filo si attorciglia e si srotola')],
          answer: 0,
          explain: T('Giusto: avanti e indietro, avanti e indietro.', 'Esatto: avanti e indietro, tante volte al secondo.', 'Esatto: il lato che saliva ora scende, e la corrente si inverte.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'I giri del generatore.'),
          vals: { m: [1, 2, 5] }, calc: '50 * 60 * m', unit: '', tol: 1,
          ask: T(null,
            'Il generatore di una centrale a vapore gira a 50 giri al secondo, come la corrente di casa. Quanti giri fa in <b>{m} minuti</b>?',
            'Un generatore a 50 giri al secondo: quanti giri in <b>{m} minuti</b>?'),
          explain: T(null, 'Esatto: 50 giri al secondo × 60 secondi × {m} = {ans:0} giri.', 'Esatto: {ans:0} giri.'),
        },
        {
          kind: 'q',
          text: T('Una centrale idroelettrica, una pala eolica, una centrale a gas: che cosa fanno tutte?', 'Che cosa hanno in comune una centrale idroelettrica, una eolica e una a gas?', 'Che cosa cambia fra una centrale idroelettrica, una eolica e una a gas?'),
          options: [T('fanno girare un generatore', 'un generatore che gira', 'che cosa fa girare la turbina'), T('bruciano tutte quante il carbone', 'bruciano tutte del gas o del carbone', 'il tipo di corrente: continua o alternata'), T('usano tutte delle pile giganti', 'usano tutte delle pile enormi', 'il generatore: ognuna ne usa uno diverso')],
          answer: 0,
          explain: T('Giusto: acqua, vento o vapore, ma sempre un generatore!', 'Esatto: cambia solo che cosa fa girare la turbina.', 'Esatto: acqua, vento o vapore; il generatore funziona allo stesso modo.'),
        },
      ],
      hints: [T('Più veloce giri, più luce.', 'Più giri al secondo: più tensione e più cambi di verso.', 'La bobina che gira vede un campo che cambia di continuo.')],
      solution: T(
        'Più veloce gira la bobina, più luce fa la lampadina.',
        'Il generatore fa corrente alternata: più giri al secondo, più tensione.',
        'Un generatore fa una tensione alternata che cresce con la velocità di rotazione.'),
    },
    {
      id: 'e04-5', kind: 'lezione', title: 'Il trasformatore',
      sim: 'induzione', params: { mode: 'trasformatore', n2: 500, corr: 'alternata' }, controls: ['n2'],
      intro: T(
        'La presa di casa dà 230 volt, ma il caricabatterie del telefono ne vuole pochi. Ci pensa il trasformatore: due bobine sullo stesso anello di ferro. La prima ha 1000 giri di filo: cambia i giri della seconda e guarda i volt.',
        'Un <b>trasformatore</b> ha due bobine avvolte sullo stesso nucleo di ferro. La corrente alternata nella prima fa un campo magnetico che cambia di continuo, e il campo che cambia induce una tensione nella seconda. Le tensioni stanno come i numeri di spire: <b>V₂ / V₁ = N₂ / N₁</b>. Con la corrente continua non funziona: il campo non cambia.',
        'Il trasformatore fu la carta vincente della corrente alternata contro la continua, alla fine dell’Ottocento: permette di alzare la tensione per portare l’energia lontano con pochi sprechi, e di riabbassarla prima delle case. Le linee dell’alta tensione arrivano a 380 000 volt. [[V₂ = V₁ · N₂ / N₁]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova pochi giri e tanti giri nella seconda bobina.', 'Prova la seconda bobina con 100 spire e con 2000 spire.'),
          need: [
            { when: 'n2 == 100', try: { n2: 100 }, msg: T('Prova pochi giri.', 'Manca la prova con 100 spire.') },
            { when: 'n2 == 2000', try: { n2: 2000 }, msg: T('Ora tanti giri.', 'Manca la prova con 2000 spire.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con meno giri nella seconda bobina, i volt…', 'Con meno spire nella seconda bobina che nella prima, la tensione…', 'Con 100 spire nella seconda bobina e 1000 nella prima, la tensione…'),
          options: [T('scendono', 'si abbassa', 'diventa 10 volte più piccola'), T('salgono', 'si alza', 'diventa 10 volte più grande'), T('restano 230', 'resta 230 V', 'resta la stessa della presa')],
          answer: 0,
          explain: T('Giusto: meno giri, meno volt.', 'Esatto: è un trasformatore che abbassa la tensione.', 'Esatto: un decimo delle spire, un decimo della tensione: 23 V.'),
        },
        {
          kind: 'free', controls: ['corr', 'n2'],
          text: T('Ora attacca una pila al posto della presa.', 'Ora collega la prima bobina a una pila, con la corrente continua.'),
          need: [
            { when: "corr == 'continua'", try: { corr: 'continua' }, msg: T('Prova con la pila.', 'Manca la prova con la corrente continua.') },
          ],
        },
        {
          kind: 'q', controls: [],
          text: T('Con la pila, la seconda bobina…', 'Con la corrente continua, la seconda bobina…', 'Perché il trasformatore non funziona con la corrente continua?'),
          options: [T('non dà niente', 'non dà nessuna tensione', 'il campo nel ferro non cambia'), T('dà più volt', 'dà una tensione più alta', 'la pila ha troppa poca tensione'), T('si scalda e prende fuoco', 'dà la stessa tensione della pila', 'il ferro blocca la corrente continua')],
          answer: 0,
          explain: T('Giusto: serve la corrente che va avanti e indietro.', 'Esatto: senza un campo che cambia, niente tensione indotta.', 'Esatto: l’induzione vuole un campo che cambia.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La tensione della seconda bobina.'),
          vals: { N: [50, 100, 200] }, calc: '230 * N / 1000', unit: 'V', tol: 0.1,
          ask: T(null,
            'Un trasformatore collegato alla presa da 230 V ha 1000 spire nella prima bobina e <b>{N} spire</b> nella seconda. Quanto vale la tensione della seconda?',
            '230 V, N₁ = 1000, N₂ = <b>{N}</b>: V₂? [[V₂ = V₁ · N₂ / N₁]]'),
          explain: T(null, 'Esatto: V₂ = 230 V × {N} / 1000 = {ans:1} V.', 'Esatto: {ans:1} V.'),
        },
        {
          kind: 'q', controls: [],
          text: T('Perché i fili dell’alta tensione portano tanti volt?', 'Perché l’energia viaggia sulle linee ad alta tensione?', 'Perché alzare la tensione riduce gli sprechi nelle linee?'),
          options: [T('così si spreca meno energia per strada', 'con più tensione serve meno corrente, e i fili scaldano meno', 'a parità di potenza la corrente cala, e il calore nei fili con lei'), T('così fanno più luce', 'perché la tensione alta viaggia più veloce', 'perché la tensione alta non si disperde nell’aria'), T('per spaventare gli uccelli', 'perché i fili sono più sottili', 'perché i tralicci sono più alti')],
          answer: 0,
          explain: T('Giusto: e vicino alle case un trasformatore la riabbassa.', 'Esatto: P = V·I: più volt, meno ampere, meno calore.', 'Esatto: le perdite crescono con il quadrato della corrente.'),
        },
      ],
      hints: [T('Meno giri, meno volt; più giri, più volt.', 'V₂ / V₁ = N₂ / N₁, e solo con la corrente alternata.', 'Le tensioni stanno come le spire, se il campo cambia.')],
      solution: T(
        'Meno giri nella seconda bobina, meno volt; con la pila, niente.',
        'V₂ = V₁ · N₂ / N₁ con la corrente alternata; zero con la continua.',
        'Le tensioni stanno come le spire, ma solo con un campo che cambia.'),
    },
    {
      id: 'e04-6', kind: 'costruisci', title: 'La pista delle macchinine',
      sim: 'induzione', params: { mode: 'pista', g2: 50, serve: 12 }, controls: ['g2'],
      intro: T(
        'Nel parco arriva la pista delle macchinine elettriche! Vanno con pochi volt, e la presa ne dà 230: serve un trasformatore. La prima bobina ha 1150 giri, cioè 5 giri per ogni volt. Quanti giri metti nella seconda? Troppi, e le macchinine volano fuori pista; pochi, e vanno a passo di lumaca.',
        'Costruisci la pista delle macchinine: il trasformatore abbassa i 230 V della presa alla tensione delle macchinine. La prima bobina ha 1150 spire. Scegli le spire della seconda: V₂ = 230 V × N₂ / 1150.',
        'La pista delle macchinine: un trasformatore che abbassa la tensione della presa, come quello dei trenini elettrici. [[N₂ = N₁ · V₂ / V₁]]'),
      piece: { id: 'macchinine', name: 'La pista delle macchinine', desc: 'Un trasformatore abbassa i 230 volt della presa ai pochi volt delle macchinine.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli i giri della seconda bobina, poi accendi.', 'Scegli le spire della seconda bobina, poi accendi.'),
          vals: { e: { volt: [[12], [6]] }, s: { volt: [[6, 9], [12, 18]] } },
          ask: T(
            'Le macchinine vogliono <b>{volt} volt</b>. La prima bobina ha 5 giri per ogni volt: quanti giri metti nella seconda?',
            'Le macchinine vogliono <b>{volt} V</b>. Con 1150 spire nella prima bobina e 230 V dalla presa, quante spire servono nella seconda?',
            'Macchinine da <b>{volt} V</b>; N₁ = 1150, V₁ = 230 V. N₂? [[N₂ = N₁ · V₂ / V₁]]'),
          measure: 'g2', goal: '5 * volt', tol: 2, set: { serve: 'volt' },
          ok: T('Perfetto! Le macchinine sfrecciano e tengono la curva!', 'Esatto: la tensione giusta.'),
          high: T('Troppi giri: troppi volt, e le macchinine volano fuori pista! Togline un po’.', 'Troppe spire: tensione troppo alta.'),
          low: T('Pochi giri: pochi volt, e le macchinine vanno a passo di lumaca. Aggiungine.', 'Troppo poche spire: tensione troppo bassa.'),
          solve: { g2: '5 * volt' },
        },
        {
          kind: 'q',
          text: T('Per macchinine che vogliono il doppio dei volt, servono…', 'Se le macchinine volessero il doppio della tensione, le spire della seconda bobina…', 'Perché i trenini elettrici hanno un trasformatore?'),
          options: [T('il doppio dei giri', 'raddoppierebbero', 'per abbassare i 230 V della presa a pochi volt'), T('la metà dei giri di prima', 'si dimezzerebbero', 'per alzare la tensione e correre più veloci'), T('gli stessi giri di prima', 'resterebbero uguali', 'per trasformare la corrente in luce')],
          answer: 0,
          explain: T('Giusto: il doppio dei giri, il doppio dei volt.', 'Esatto: la tensione è proporzionale alle spire.', 'Esatto: pochi volt, sicuri da toccare.'),
        },
      ],
      hints: [T('5 giri per ogni volt: moltiplica per 5.', 'N₂ = 1150 × V₂ / 230 = 5 × V₂.', 'Le spire stanno come le tensioni: 5 spire per ogni volt.')],
      solution: T('12 volt: 60 giri; 6 volt: 30 giri.', 'N₂ = 5 × V₂: 30, 45, 60 o 90 spire.', 'Spire proporzionali alla tensione chiesta: 5 per ogni volt.'),
    },
    {
      id: 'e04-7', kind: 'ripasso', title: 'Ripasso dell’induzione',
      intro: T('Ripassiamo: calamite che fanno corrente, generatori e trasformatori!', 'Ripasso: induzione, legge di Lenz, generatori e trasformatori.', 'Ripasso: l’induzione elettromagnetica.'),
      steps: [
        {
          kind: 'q',
          text: T('Una calamita ferma dentro una bobina fa corrente?', 'Quando una calamita fa corrente in una bobina?', 'Che cosa serve, in fondo, per indurre una tensione?'),
          options: [T('no: deve muoversi', 'quando si muove', 'un campo magnetico che cambia'), T('sì, sempre', 'sempre, se è dentro la bobina', 'un campo magnetico fortissimo'), T('solo se è rossa', 'solo se la bobina ha una pila', 'una pila nel circuito')],
          answer: 0,
          explain: T('Giusto: serve il movimento.', 'Esatto: serve un campo che cambia.', 'Esatto: è la legge di Faraday.'),
        },
        {
          kind: 'q',
          text: T('Nel tubo di rame, la calamita cade…', 'Che cosa frena una calamita che cade in un tubo di rame?', 'Che cosa dice la legge di Lenz?'),
          options: [T('piano piano', 'le correnti indotte nel rame', 'la corrente indotta si oppone al cambiamento'), T('velocissima', 'l’aria dentro il tubo', 'la corrente indotta aiuta sempre il movimento della calamita'), T('per niente: si ferma', 'il rame, che attira la calamita', 'la corrente indotta è sempre nulla')],
          answer: 0,
          explain: T('Giusto: frenata dalle sue correnti.', 'Esatto: le correnti indotte la frenano.', 'Esatto: per questo frena, e non spinge.'),
        },
        {
          kind: 'q',
          text: T('Un generatore fa una corrente…', 'Che corrente fa un generatore con la bobina che gira?', 'Quante volte al secondo cambia verso la corrente a 50 Hz?'),
          options: [T('che va avanti e indietro', 'alternata', '100'), T('che va sempre dritta', 'continua', '50'), T('solo di notte', 'nessuna', '25')],
          answer: 0,
          explain: T('Giusto: è la corrente alternata.', 'Esatto: cambia verso a ogni mezzo giro.', 'Esatto: due volte per ogni ciclo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Ancora il trasformatore.'),
          vals: { N: [500, 2000, 4000] }, calc: '12 * N / 100', unit: 'V', tol: 0.5,
          ask: T(null,
            'Un trasformatore ha 100 spire nella prima bobina, collegata a 12 V alternati, e <b>{N} spire</b> nella seconda. Quanto vale la tensione della seconda?',
            'V₁ = 12 V, N₁ = 100, N₂ = <b>{N}</b>: V₂? [[V₂ = V₁ · N₂ / N₁]]'),
          explain: T(null, 'Esatto: V₂ = 12 V × {N} / 100 = {ans:0} V.', 'Esatto: {ans:0} V.'),
        },
        {
          kind: 'q',
          text: T('Un trasformatore funziona con la pila?', 'Perché un trasformatore vuole la corrente alternata?', 'Perché la rete elettrica usa la corrente alternata?'),
          options: [T('no: serve la corrente alternata', 'perché solo un campo che cambia induce tensione', 'per alzare e abbassare la tensione con i trasformatori'), T('sì, benissimo', 'perché la continua lo farebbe scoppiare', 'perché è più sicura da toccare'), T('solo se la pila è nuova', 'perché la pila è troppo piccola', 'perché viaggia più veloce nei fili')],
          answer: 0,
          explain: T('Giusto: con la pila non succede niente.', 'Esatto: con la continua il campo non cambia.', 'Esatto: solo l’alternata passa per i trasformatori.'),
        },
        {
          kind: 'q',
          text: T('Le centrali elettriche fanno la corrente con…', 'Che cosa c’è dentro quasi ogni centrale elettrica?', 'Che cosa fa girare il generatore di una centrale idroelettrica?'),
          options: [T('generatori che girano', 'un generatore mosso da una turbina', 'l’acqua che cade sulla turbina'), T('pile enormi, grandi come case', 'una pila gigante', 'il vento che soffia nei tubi'), T('fulmini in bottiglia', 'un grande trasformatore che produce energia', 'il vapore del carbone che brucia')],
          answer: 0,
          explain: T('Giusto: acqua, vento o vapore fanno girare i generatori.', 'Esatto: la turbina gira, il generatore fa la corrente.', 'Esatto: l’energia dell’acqua diventa energia elettrica.'),
        },
      ],
    },
    {
      id: 'e04-8', kind: 'boss', who: 'bilancia', title: 'I tubi misteriosi', win: T('Esperimento riuscito!'),
      sim: 'induzione', params: { mode: 'tubi', quale: 'A', rame: 'B' }, controls: ['quale'],
      intro: T(
        'Sono Bilancia. Esperimento al buio: due tubi uguali, verniciati di grigio. Uno è di rame, l’altro di plastica. Non si possono graffiare né aprire: hai solo una calamita e un cronometro.',
        'Sono Bilancia. Esperimento al buio: due tubi identici, verniciati, lunghi 1 m. Uno è di rame, l’altro di plastica. Hai una calamita e un cronometro. Poi, nel tubo di rame, due cilindretti uguali: solo uno è una calamita.',
        'Sono Bilancia. Esperimento al buio: riconoscere i materiali dagli effetti, senza guardarli dentro. Due tubi verniciati, uno di rame e uno di plastica; poi due cilindretti identici, di cui uno solo è una calamita. Bastano un cronometro e la legge di Lenz.'),
      steps: [
        {
          kind: 'q',
          text: T('Come scopri quale tubo è di rame?', 'Come scopri quale tubo è di rame, senza graffiarlo?', 'Quale esperimento decide?'),
          options: [T('lascio cadere la calamita e cronometro', 'si cronometra la calamita che cade', 'il tempo di caduta della calamita in ogni tubo'), T('li guardo bene da vicino', 'si guardano i tubi da vicino, con una lente', 'il colore della vernice, guardato con una lente'), T('li misuro con il metro', 'si misura quanto sono lunghi', 'la lunghezza dei due tubi')],
          answer: 0,
          explain: T('Giusto: nel rame la calamita è frenata.', 'Esatto: nel rame la calamita scende piano.', 'Esatto: il freno magnetico c’è solo nel metallo.'),
        },
        {
          kind: 'free',
          text: T('Lascia cadere la calamita nel tubo A e nel tubo B.', 'Lascia cadere la calamita nel tubo A e poi nel tubo B.'),
          need: [
            { when: "quale == 'A'", try: { quale: 'A' }, msg: T('Prova il tubo A.', 'Manca il tubo A.') },
            { when: "quale == 'B'", try: { quale: 'B' }, msg: T('Ora il tubo B.', 'Manca il tubo B.') },
          ],
        },
        {
          kind: 'q',
          text: T('Nel tubo B la calamita scende piano piano. Il tubo di rame è…', 'Nel tubo A la calamita cade in mezzo secondo, nel B ci mette 4 secondi. Il rame è…', 'A: 0,45 s; B: 4 s. Che cosa concludi?'),
          options: [T('il B', 'il tubo B', 'B è di rame: le correnti indotte frenano la calamita'), T('l’A', 'il tubo A', 'A è di rame: il rame lascia passare la calamita'), T('tutti e due', 'nessuno dei due', 'sono di plastica tutti e due')],
          answer: 0,
          explain: T('Giusto: il rame frena la calamita!', 'Esatto: il tubo B è di rame.', 'Esatto: nella plastica la caduta è libera, come nel tubo A.'),
        },
        {
          kind: 'free', set: { mode: 'cilindri', cil: 'X', cal: 'Y' }, controls: ['cil'],
          text: T('Ora due cilindretti uguali, X e Y, nel tubo di rame. Prova tutti e due.', 'Ora, nel tubo di rame, lascia cadere il cilindretto X e il cilindretto Y.'),
          need: [
            { when: "cil == 'X'", try: { cil: 'X' }, msg: T('Prova X.', 'Manca il cilindretto X.') },
            { when: "cil == 'Y'", try: { cil: 'Y' }, msg: T('Ora Y.', 'Manca il cilindretto Y.') },
          ],
        },
        {
          kind: 'q', controls: [],
          text: T('Y scende piano piano, X cade veloce. La calamita è…', 'X cade in mezzo secondo, Y ci mette 4 secondi. La calamita è…', 'X: 0,45 s; Y: 4 s, nel rame. Che cosa concludi?'),
          options: [T('Y', 'il cilindretto Y', 'Y è la calamita: solo lei fa nascere correnti nel rame'), T('X', 'il cilindretto X', 'X è la calamita: le calamite cadono più veloci'), T('tutti e due', 'tutti e due', 'nessuno dei due è una calamita')],
          answer: 0,
          explain: T('Giusto: solo la calamita viene frenata!', 'Esatto: Y è la calamita.', 'Esatto: X è di ferro, e nel rame cade libero.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La velocità della calamita nel rame.'),
          vals: { t: [4, 5, 8] }, calc: '1 / t', unit: 'm/s', tol: 0.01,
          ask: T(null,
            'Nel tubo di rame, lungo 1 m, la calamita scende quasi a velocità costante e ci mette <b>{t} s</b>. Quanto vale la sua velocità?',
            'Tubo di 1 m, percorso in <b>{t} s</b> a velocità costante: v? [[v = d / t]]'),
          explain: T(null, 'Esatto: v = 1 m / {t} s = {ans:2} m/s.', 'Esatto: {ans:2} m/s.'),
        },
        {
          kind: 'q',
          text: T('Così, senza guardare dentro, hai scoperto…', 'Che cosa ti ha permesso di riconoscere il rame e la calamita?', 'Quale legge hai usato, senza guardare dentro?'),
          options: [T('il rame e la calamita', 'il freno delle correnti indotte', 'la legge di Lenz: la corrente indotta frena la sua causa'), T('il colore dei tubi', 'il peso dei tubi', 'la legge di gravità: il rame attira la calamita'), T('niente di niente', 'il rumore della caduta', 'la legge di Coulomb: le cariche si attirano')],
          answer: 0,
          explain: T('Bravo! Un esperimento al buio, risolto con il cronometro.', 'Esatto: dagli effetti, senza guardare.', 'Esatto: dagli effetti si risale alle cause.'),
        },
      ],
      hints: [T('Nel rame la calamita scende piano.', 'Il freno magnetico c’è solo con il rame e la calamita insieme.', 'Serve un conduttore e una calamita che si muove.')],
      solution: T(
        'Il tubo B è di rame e il cilindretto Y è la calamita.',
        'B è di rame e Y è la calamita: solo insieme frenano.',
        'Rame B, calamita Y: il freno magnetico vuole tutti e due.'),
    },
  ],
};
