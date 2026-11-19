// E01 · Cariche e campi. Simulazione: le cariche elettriche (charges.js), in sette modi: le cose appese dopo lo
// strofinio, il palloncino strofinato sulla lana, l'elettroscopio, la legge di Coulomb, le linee del campo elettrico,
// la pallina volante del parco, il fulmine sull'auto.
// La zona si apre con un mistero (che cosa fa lo strofinio?), lo spiega con gli elettroni che passano, separa conduttori
// e isolanti, misura la forza fra due cariche (come la gravità, cala con il quadrato della distanza), disegna il campo,
// costruisce la pallina volante e finisce con Vetrino e il mito delle gomme dell'auto sotto il temporale.
import { T } from '../util.js';

export default {
  id: 'E01',
  title: 'Cariche e campi',
  levels: [
    {
      id: 'e01-1', kind: 'prevedi', title: 'Il palloncino strofinato',
      sim: 'cariche', params: { mode: 'pendoli', coppia: 'palloncini' }, controls: [],
      intro: T(
        'Strofina un palloncino su un maglione di lana: succede qualcosa di invisibile! Avviciniamolo a un altro palloncino, alla lana e a dei pezzetti di carta. Prima indovina, poi guarda!',
        'Strofina un palloncino sulla lana, poi avvicinalo ad altre cose: a un secondo palloncino strofinato come lui, al pezzo di lana, a dei pezzetti di carta. Lo strofinio gli ha dato qualcosa che spinge e che tira. Prevedi, poi guarda.',
        'Già i Greci sapevano che l’ambra strofinata attira le pagliuzze; in greco l’ambra si chiama élektron. Rifacciamo l’esperimento con un palloncino: dopo lo strofinio spinge certe cose e ne tira altre. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { coppia: 'palloncini' }, predict: [{ coppia: 'palloncini' }],
          text: T('Due palloncini strofinati sulla lana, appesi vicini. Che cosa fanno?', 'Due palloncini strofinati tutti e due sulla lana, appesi vicini: che cosa fanno?', 'Due palloncini strofinati allo stesso modo, appesi vicini: che cosa succede?'),
          options: [T('si allontanano', 'si respingono', 'si respingono'), T('si avvicinano fino a toccarsi', 'si attirano fino a toccarsi', 'si attirano fino a toccarsi'), T('niente', 'restano fermi', 'niente: restano fermi')],
          answer: 0,
          explain: T('Giusto: si spingono via!', 'Esatto: si respingono.', 'Esatto: due oggetti caricati allo stesso modo si respingono.'),
          solution: T('Si allontanano.', 'Si respingono.'),
        },
        {
          kind: 'q', set: { coppia: 'lana' }, predict: [{ coppia: 'lana' }],
          text: T('E il palloncino con la lana su cui l’hai strofinato?', 'Ora il palloncino e il pezzo di lana su cui l’hai strofinato:', 'Il palloncino e la lana con cui è stato strofinato:'),
          options: [T('si avvicinano', 'si attirano', 'si attirano: hanno cariche opposte'), T('si allontanano, come prima', 'si respingono, come i due palloncini', 'si respingono: hanno preso la stessa carica'), T('niente', 'restano fermi', 'niente: la lana non si carica')],
          answer: 0,
          explain: T('Giusto: si tirano!', 'Esatto: si attirano. Lo strofinio ha caricato tutti e due, ma in modo opposto.', 'Esatto: lo strofinio carica tutti e due gli oggetti, con cariche opposte.'),
          solution: T('Si avvicinano.', 'Si attirano.'),
        },
        {
          kind: 'q', set: { coppia: 'carta' }, predict: [{ coppia: 'carta' }],
          text: T('E dei pezzetti di carta, che non hai strofinato?', 'E dei pezzetti di carta, che nessuno ha strofinato?', 'E dei pezzetti di carta, che non sono stati strofinati?'),
          options: [T('saltano sul palloncino', 'saltano sul palloncino', 'saltano sul palloncino'), T('scappano via dal palloncino', 'vengono spinti via', 'vengono respinti'), T('niente', 'restano fermi: non sono carichi', 'niente: senza carica non c’è forza')],
          answer: 0,
          explain: T('Giusto: anche la carta viene tirata!', 'Esatto: il palloncino attira anche la carta, che non è carica.', 'Esatto: un oggetto carico attira anche gli oggetti neutri.'),
          solution: T('Saltano sul palloncino.', 'Saltano sul palloncino.'),
        },
        {
          kind: 'q',
          text: T('Allora che cosa ha dato lo strofinio al palloncino?', 'Che cosa ha dato lo strofinio al palloncino?', 'Che cosa ha lasciato lo strofinio sul palloncino, che prima non c’era?'),
          options: [T('una carica elettrica', 'una carica elettrica', 'una carica elettrica'), T('della colla invisibile', 'della colla invisibile, che attacca', 'un po’ di colla, che attacca e basta'), T('del calore', 'del calore, per l’attrito', 'solo calore, per l’attrito')],
          answer: 0,
          explain: T('Giusto: si chiama carica elettrica.', 'Esatto: la carica elettrica. È di due tipi: cariche uguali si respingono, cariche opposte si attirano.', 'Esatto: la carica elettrica, positiva o negativa: uguali si respingono, opposte si attirano. E un oggetto carico attira anche quelli neutri.'),
        },
      ],
      hints: [T('Due cose strofinate allo stesso modo si spingono via.', 'Cariche uguali si respingono, cariche opposte si attirano.', 'Due tipi di carica: uguali si respingono, opposte si attirano.')],
    },
    {
      id: 'e01-2', kind: 'lezione', title: 'Gli elettroni che passano',
      sim: 'cariche', params: { mode: 'strofina', giri: 5 }, controls: ['giri'],
      intro: T(
        'Tutto è fatto di atomi, e negli atomi ci sono cariche positive (+) e negative (−), in pari. Le negative si chiamano elettroni e sono leggerissime: strofinando, alcune passano dalla lana al palloncino. Strofina e guarda!',
        'In ogni atomo ci sono protoni positivi, nel nucleo, ed elettroni negativi, intorno. Di solito sono in pari, e l’oggetto è <b>neutro</b>. Strofinando, alcuni elettroni passano dalla lana al palloncino: il palloncino ne ha in più ed è negativo, la lana ne ha in meno ed è positiva. La carica si misura in <b>coulomb</b> (C); un palloncino strofinato ne ha pochi miliardesimi, qualche nanocoulomb (nC).',
        'Ogni atomo ha un nucleo positivo ed elettroni negativi intorno. Lo strofinio non crea cariche: sposta elettroni da un oggetto all’altro. È una legge senza eccezioni, la conservazione della carica: quella che uno guadagna, l’altro la perde. Un elettrone porta 1,6 × 10⁻¹⁹ coulomb: ne servono più di 6 miliardi di miliardi per fare un coulomb.'),
      steps: [
        {
          kind: 'free',
          text: T('Strofina poco, poi tanto.', 'Prova 2 passate o meno, poi 8 o più.'),
          need: [
            { when: 'giri <= 2', try: { giri: 2 }, msg: T('Prova a strofinare poco.', 'Manca una prova con 2 passate o meno.') },
            { when: 'giri >= 8', try: { giri: 8 }, msg: T('Ora strofina tanto.', 'Manca una prova con 8 passate o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Che cosa passa dalla lana al palloncino?', 'Che cosa passa dalla lana al palloncino?', 'Che cosa si sposta, quando strofini?'),
          options: [T('gli elettroni, negativi', 'elettroni, negativi', 'gli elettroni, leggeri e mobili'), T('le cariche positive', 'protoni, positivi', 'i nuclei, con i protoni'), T('la lana', 'atomi interi di lana', 'il calore dell’attrito')],
          answer: 0,
          explain: T('Giusto: passano gli elettroni.', 'Esatto: si spostano solo gli elettroni; i protoni restano nei nuclei.', 'Esatto: gli elettroni, che stanno fuori dal nucleo e si staccano facilmente.'),
        },
        {
          kind: 'q',
          text: T('Dopo lo strofinio, la lana è…', 'Perché la lana diventa positiva?', 'Perché la lana diventa positiva, se nessuno le ha dato cariche positive?'),
          options: [T('positiva (+)', 'perché ha perso elettroni', 'perché ha perso elettroni negativi'), T('negativa (−)', 'perché ha preso protoni dal palloncino', 'perché il palloncino le ha dato i suoi protoni'), T('senza carica, come prima', 'perché si è scaldata strofinando', 'perché si è scaldata')],
          answer: 0,
          explain: T('Giusto: ha perso elettroni.', 'Esatto: elettroni in meno, quindi più protoni che elettroni.', 'Esatto: i suoi protoni restano in più; positivo vuol dire con meno elettroni che protoni.'),
        },
        {
          kind: 'q',
          text: T('Palloncino e lana insieme: quanta carica hanno in tutto?', 'Sommando la carica del palloncino e quella della lana, ottieni…', 'Perché la carica totale di palloncino e lana resta zero?'),
          options: [T('zero, come prima', 'zero, come prima di strofinare', 'perché la carica si sposta, non si crea'), T('di più, lo strofinio ne crea', 'di più: lo strofinio crea carica', 'perché le cariche positive si consumano strofinando'), T('di meno, un po’ si perde', 'di meno: un po’ si perde', 'perché il palloncino ne cede un po’ all’aria')],
          answer: 0,
          explain: T('Giusto: le cariche si spostano, non si creano.', 'Esatto: è la conservazione della carica.', 'Esatto: è la conservazione della carica: non si crea e non si distrugge. È una delle leggi più solide della fisica.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La carica del palloncino.'),
          vals: { n: [25, 50, 100] }, calc: 'n * 0.16', unit: 'nC', tol: 0.05,
          ask: T(null,
            'Il palloncino ha preso <b>{n} miliardi</b> di elettroni, e ogni miliardo di elettroni porta 0,16 nC. Che carica ha il palloncino, in nanocoulomb (senza il segno)?',
            'Elettroni passati: <b>{n} miliardi</b>, 0,16 nC ogni miliardo. Carica del palloncino in nC, senza il segno? [[q = n · e]]'),
          explain: T(null, 'Esatto: {n} × 0,16 = {ans:0} nC, negativa.', 'Esatto: {ans:0} nC, negativa.'),
        },
      ],
      hints: [T('Passano gli elettroni: il palloncino diventa −, la lana +.', 'Il palloncino prende elettroni, la lana li perde: in tutto zero.', 'La carica si sposta, non si crea.')],
      solution: T(
        'Gli elettroni passano dalla lana al palloncino: il palloncino è −, la lana +.',
        'Elettroni dalla lana al palloncino: palloncino −, lana +, totale zero.',
        'Lo strofinio sposta elettroni: la carica totale resta zero.'),
    },
    {
      id: 'e01-3', kind: 'lezione', title: 'Conduttori e isolanti',
      sim: 'cariche', params: { mode: 'elettroscopio', barra: 'rame' }, controls: ['barra'],
      intro: T(
        'In certi materiali le cariche corrono, in altri restano ferme. Questo è un elettroscopio: quando gli arrivano cariche, le sue due foglioline si aprono. Collegalo a una sfera carica con barre diverse!',
        'Nei metalli alcuni elettroni sono liberi di correre da un atomo all’altro: i metalli sono <b>conduttori</b>. Nella plastica, nel vetro, nella gomma gli elettroni restano legati ai loro atomi: sono <b>isolanti</b>. L’<b>elettroscopio</b> rivela le cariche: quando ne arrivano, le sue due foglioline si caricano allo stesso modo e si aprono.',
        'Nei metalli una parte degli elettroni è libera e corre; nella plastica e nel vetro no. È per questo che i fili elettrici sono di rame ricoperto di plastica. L’elettroscopio, con le sue due foglioline d’oro, è stato per secoli lo strumento per vedere le cariche.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la barra di rame e quella di plastica.'),
          need: [
            { when: "barra == 'rame'", try: { barra: 'rame' }, msg: T('Prova il rame.', 'Manca la barra di rame.') },
            { when: "barra == 'plastica'", try: { barra: 'plastica' }, msg: T('Ora la plastica.', 'Manca la barra di plastica.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con quale barra le foglioline si aprono?', 'Con quale barra le foglioline si aprono?', 'Perché solo con il rame le foglioline si aprono?'),
          options: [T('con il rame', 'con il rame, un conduttore', 'perché nel rame ci sono elettroni liberi di correre'), T('con la plastica', 'con la plastica, un isolante', 'perché il rame è più pesante della plastica'), T('con tutte e due', 'con tutte e due', 'perché la plastica respinge le cariche')],
          answer: 0,
          explain: T('Giusto: nel rame le cariche corrono.', 'Esatto: il rame è un conduttore.', 'Esatto: nei metalli gli elettroni liberi corrono; nella plastica restano legati agli atomi.'),
        },
        {
          kind: 'q',
          text: T('Perché le due foglioline si aprono?', 'Perché le foglioline si aprono quando arrivano le cariche?', 'Perché le foglioline si aprono?'),
          options: [T('hanno cariche uguali, e si spingono', 'hanno cariche uguali', 'prendono cariche dello stesso segno e si respingono'), T('si scaldano', 'si scaldano e si dilatano', 'le cariche le scaldano e le piegano'), T('c’è vento nel vaso', 'l’aria del vaso le spinge', 'il vetro carico le attira verso di sé')],
          answer: 0,
          explain: T('Giusto: cariche uguali si respingono.', 'Esatto: cariche uguali si respingono, come i due palloncini.', 'Esatto: come i due palloncini del primo livello.'),
        },
        {
          kind: 'q',
          text: T('Perché i fili della corrente sono di rame, coperti di plastica?', 'Perché i fili elettrici sono di rame ricoperto di plastica?', 'Perché nei fili elettrici il rame sta dentro e la plastica fuori?'),
          options: [T('il rame porta le cariche, la plastica protegge', 'il rame conduce, la plastica isola e protegge', 'il rame conduce, la plastica isola'), T('la plastica le porta, il rame protegge', 'la plastica conduce meglio del rame', 'il rame isola, e la plastica conduce le cariche'), T('per farli colorati e belli', 'per farli più leggeri', 'per farli flessibili')],
          answer: 0,
          explain: T('Giusto: il rame conduce, la plastica isola.', 'Esatto: dentro corrono le cariche, fuori nessuno prende la scossa.', 'Esatto: un conduttore dentro un isolante.'),
        },
        {
          kind: 'q',
          text: T('D’inverno tocchi una maniglia e prendi la scossa. Il tuo corpo è…', 'Cammini sulla moquette, tocchi la maniglia e prendi la scossa. Che cosa è successo?', 'Perché d’inverno, toccando una maniglia, si prende la scossa?'),
          options: [T('un conduttore', 'ti eri caricato camminando, e la carica è saltata', 'il corpo si carica camminando'), T('un isolante', 'la maniglia di metallo era carica e ti ha dato la scossa', 'la maniglia accumula cariche con il freddo'), T('una calamita', 'hai preso un po’ della corrente elettrica della casa', 'il freddo produce elettricità nel metallo')],
          answer: 0,
          explain: T('Giusto: anche il tuo corpo conduce.', 'Esatto: le scarpe strofinano la moquette, tu ti carichi e la carica salta sul metallo.', 'Esatto: le scarpe strofinano il pavimento, e la carica salta sul metallo. D’inverno l’aria è secca e non la porta via, così resta su di te finché tocchi un conduttore.'),
        },
      ],
      hints: [T('Il rame fa correre le cariche, la plastica no.', 'Metalli conduttori; plastica e vetro isolanti.', 'Nei conduttori ci sono elettroni liberi.')],
      solution: T(
        'Con il rame le foglioline si aprono: il rame è un conduttore.',
        'Rame conduttore: le cariche arrivano e le foglioline si respingono.',
        'Solo i conduttori portano le cariche fino alle foglioline.'),
    },
    {
      id: 'e01-4', kind: 'lezione', title: 'La legge di Coulomb',
      sim: 'cariche', params: { mode: 'coulomb', dist: 8, q2: 1, segno: 'uguali' }, controls: ['dist', 'q2', 'segno'],
      intro: T(
        'Due palline cariche si spingono o si tirano. Più sono vicine, più la forza è forte; più sono cariche, più è forte. Avvicina e allontana le palline, e guarda le frecce!',
        'Nel 1785 Charles de Coulomb misurò la forza fra due cariche con una bilancia sottilissima. La forza cresce con le cariche e cala con il <b>quadrato della distanza</b>, proprio come la gravità: F = k·q₁·q₂/r², con k = 9 × 10⁹ N·m²/C². Distanza doppia, forza quattro volte più piccola.',
        'Coulomb trovò per le cariche la stessa forma della gravitazione di Newton: la forza cala con il quadrato della distanza. Ma è enormemente più forte: fra due elettroni la forza elettrica supera quella di gravità di 10⁴² volte. Se non ce ne accorgiamo è perché la materia è quasi sempre neutra. [[F = k · q₁ · q₂ / r²]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova le palline vicine, a 4 centimetri, e lontane, a 8.', 'Prova r = 4 cm e r = 8 cm, con le stesse cariche.', 'Prova le palline a 4 cm e a 8 cm.'),
          need: [
            { when: 'dist == 4', try: { dist: 4 }, msg: T('Avvicinale a 4 centimetri.', 'Manca r = 4 cm.', 'Manca la prova a 4 cm.') },
            { when: 'dist == 8', try: { dist: 8 }, msg: T('Ora allontanale a 8 centimetri.', 'Manca r = 8 cm.', 'Manca la prova a 8 cm.') },
          ],
        },
        {
          kind: 'q',
          text: T('Al doppio della distanza, la forza diventa…', 'Raddoppiando la distanza, la forza…', 'Perché a distanza doppia la forza diventa un quarto?'),
          options: [T('quattro volte più piccola', 'diventa un quarto', 'perché cala con il quadrato della distanza'), T('la metà', 'si dimezza, diventa la metà', 'perché cala con la distanza, e la distanza è doppia'), T('uguale', 'resta uguale a prima', 'perché le cariche non cambiano')],
          answer: 0,
          explain: T('Giusto: un quarto! Come per la gravità.', 'Esatto: r² diventa 4 volte più grande.', 'Esatto: 2² = 4. È la stessa forma della gravitazione universale.'),
        },
        {
          kind: 'q',
          text: T('Le forze sulle due palline sono…', 'Che cosa noti nelle frecce delle due palline?', 'Perché le forze sulle due palline sono uguali anche se le cariche sono diverse?'),
          options: [T('uguali e opposte', 'sono uguali e opposte', 'per la terza legge di Newton: azione e reazione'), T('più forte sulla pallina più carica', 'è più forte sulla pallina più carica', 'perché la carica più grande spinge di più'), T('una sola freccia', 'c’è forza solo sulla pallina meno carica', 'perché la forza va dalla più carica alla meno carica')],
          answer: 0,
          explain: T('Giusto: uguali e opposte.', 'Esatto: come vuole la terza legge di Newton.', 'Esatto: azione e reazione, come in ogni forza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La forza fra due cariche.'),
          vals: { q: [1, 2, 3] }, calc: '9e9 * (q * 1e-6) ** 2 / 0.1 ** 2', unit: 'N', tol: 0.05,
          ask: T(null,
            'Due cariche di <b>{q} µC</b> ciascuna, a 10 cm l’una dall’altra. Quanto vale la forza? (k = 9 × 10⁹ N·m²/C²)',
            'Due cariche di <b>{q} µC</b>, a 10 cm: forza? [[F = k · q₁ · q₂ / r², con k = 9 × 10⁹ N·m²/C²]]'),
          explain: T(null, 'Esatto: F = 9 × 10⁹ × ({q} × 10⁻⁶)² / 0,1² = {ans:1} N.', 'Esatto: {ans:1} N.'),
        },
        {
          kind: 'q',
          text: T('Con cariche opposte, le palline…', 'Con cariche opposte, che cosa cambia?', 'La forza elettrica è enormemente più forte della gravità. Perché non ci fa volare via?'),
          options: [T('si tirano', 'cambia il verso: si attirano', 'perché la materia è quasi sempre neutra'), T('si spingono di più', 'si respingono ancora più forte', 'perché a grande distanza è più debole della gravità'), T('non fanno niente', 'la forza sparisce del tutto', 'perché la gravità della Terra la tiene ferma')],
          answer: 0,
          explain: T('Giusto: cariche opposte si attirano.', 'Esatto: stessa forza, ma verso l’altra pallina.', 'Esatto: ha quasi sempre tante cariche + quante −, che si compensano.'),
        },
      ],
      hints: [T('Più vicine, più forte: al doppio della distanza, un quarto.', 'F = k·q₁·q₂/r²: distanza doppia, forza un quarto.', 'Come la gravità: la forza cala con il quadrato della distanza.')],
      solution: T(
        'Più le palline sono vicine e cariche, più forte è la forza.',
        'F = k·q₁·q₂/r²: cala con il quadrato della distanza.',
        'La legge di Coulomb: come la gravitazione, ma fra le cariche.'),
    },
    {
      id: 'e01-5', kind: 'lezione', title: 'Il campo elettrico',
      sim: 'cariche', params: { mode: 'campo', conf: 'piu' }, controls: ['conf'],
      intro: T(
        'Una carica cambia lo spazio intorno a sé: lì ogni altra carica sente una spinta. Questo spazio si chiama campo elettrico, e si disegna con linee e frecce. Prova cariche diverse!',
        'Intorno a una carica c’è un <b>campo elettrico</b>: in ogni punto una carica di prova q sente una forza F = q·E. Il campo si disegna con le <b>linee di campo</b>: escono dalle cariche positive, entrano nelle negative, e dove sono fitte il campo è forte. Si misura in newton al coulomb (N/C).',
        'Fu Michael Faraday a immaginare le linee di campo: per lui lo spazio intorno a una carica non è vuoto, ma teso come una rete di fili. Oggi sappiamo che il campo è reale: porta energia, e quando oscilla diventa luce, come vedrai alla fine della Centrale. [[F = q · E]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una carica + e una carica −.', 'Prova una carica positiva e una negativa.'),
          need: [
            { when: "conf == 'piu'", try: { conf: 'piu' }, msg: T('Prova la carica +.', 'Manca la carica positiva.') },
            { when: "conf == 'meno'", try: { conf: 'meno' }, msg: T('Ora la carica −.', 'Manca la carica negativa.') },
          ],
        },
        {
          kind: 'q',
          text: T('Intorno alla carica +, le frecce delle linee…', 'Intorno a una carica positiva, le linee di campo…', 'Perché le linee escono dalla carica positiva?'),
          options: [T('vanno verso l’esterno', 'escono dalla carica', 'perché seguono la spinta su una carica +'), T('vanno verso la carica', 'entrano nella carica', 'perché indicano dove andrebbe un elettrone libero'), T('girano in tondo', 'girano intorno alla carica', 'perché il campo gira sempre intorno alla carica')],
          answer: 0,
          explain: T('Giusto: escono dal +.', 'Esatto: escono dal +, in tutte le direzioni, ed entrano nel −.', 'Esatto: per convenzione il campo indica la forza su una carica di prova positiva.'),
        },
        {
          kind: 'free',
          text: T('Ora prova una + con una −, e due +.', 'Prova la coppia + e −, e due cariche positive.'),
          need: [
            { when: "conf == 'dipolo'", try: { conf: 'dipolo' }, msg: T('Prova il + con il −.', 'Manca la coppia + e −.') },
            { when: "conf == 'due'", try: { conf: 'due' }, msg: T('Ora due +.', 'Manca la coppia di cariche positive.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con una carica + e una −, le linee…', 'Con una carica + e una −, le linee di campo…', 'Fra due cariche positive uguali, a metà strada, il campo…'),
          options: [T('vanno dal + al −', 'partono dal + e arrivano al −', 'è zero: le due spinte si annullano'), T('vanno dal − al +', 'partono dal − e arrivano al +', 'è il doppio: le spinte si sommano'), T('non si toccano mai', 'restano ognuna intorno alla sua carica', 'è più forte che vicino alle cariche')],
          answer: 0,
          explain: T('Giusto: dal + al −.', 'Esatto: escono dal + ed entrano nel −.', 'Esatto: lì le due forze sono uguali e opposte.'),
        },
        {
          kind: 'q',
          text: T('Dove la spinta è più forte?', 'Dove il campo è più forte?', 'Come si vede, dal disegno, dove il campo è più forte?'),
          options: [T('vicino alle cariche', 'vicino alle cariche, dove le linee sono fitte', 'dove le linee sono più fitte'), T('lontano dalle cariche', 'lontano, dove le linee sono rade', 'dove le linee sono più lunghe e dritte'), T('dappertutto uguale', 'è uguale in ogni punto', 'dove le linee si incurvano')],
          answer: 0,
          explain: T('Giusto: vicino alle cariche.', 'Esatto: linee fitte, campo forte.', 'Esatto: la densità delle linee dice quanto è forte il campo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Quanto è forte il campo.'),
          vals: { q: [2, 3, 6] }, calc: '0.06 / (q * 1e-6)', unit: 'N/C',
          ask: T(null,
            'Una carica di prova di <b>{q} µC</b> sente una forza di 0,06 N. Quanto vale il campo elettrico in quel punto, in N/C?',
            'Carica di prova di <b>{q} µC</b>, forza di 0,06 N: campo? [[E = F / q]]'),
          explain: T(null, 'Esatto: E = 0,06 N / {q} µC = {ans:0} N/C.', 'Esatto: {ans:0} N/C.'),
        },
      ],
      hints: [T('Le linee escono dal + ed entrano nel −.', 'Linee dal + al −; dove sono fitte, il campo è forte.', 'Il campo è la forza su ogni coulomb; linee fitte, campo forte.')],
      solution: T(
        'Le linee escono dal + ed entrano nel −; sono fitte dove la spinta è forte.',
        'Linee dal + al −; F = q·E.',
        'Il campo elettrico: linee dal + al −, fitte dove è forte.'),
    },
    {
      id: 'e01-6', kind: 'costruisci', title: 'La pallina volante',
      sim: 'cariche', params: { mode: 'pallina', h: 20, q: 0.4 }, controls: ['h'],
      intro: T(
        'Nel parco arriva la pallina volante: in un tubo di vetro, una pallina carica sta sopra un’altra carica e galleggia nell’aria! Trova l’altezza giusta: troppo in alto scende, troppo in basso viene spinta su.',
        'Costruisci la pallina volante del parco: in un tubo di vetro una pallina carica, q, sta sopra una carica ferma, Q, dello stesso segno. La pallina galleggia dove la spinta elettrica è uguale al suo peso: k·Q·q/h² = P. Più la pallina è carica, più in alto galleggia: con 4 volte la carica, al doppio dell’altezza.',
        'La pallina volante del parco: una spinta elettrica che regge un peso. Dove la spinta e il peso si equilibrano la pallina sta ferma, e se la sposti di poco ci torna: in su la spinta cala e vince il peso, in giù la spinta cresce. [[k · Q · q / h² = P]]'),
      piece: { id: 'volante', name: 'La pallina volante', desc: 'Una pallina carica galleggia in un tubo di vetro, sospesa sopra un’altra carica.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’altezza, poi lascia andare la pallina.', 'Scegli l’altezza, poi lascia andare: la pallina deve galleggiare ferma.'),
          vals: { e: { q: [[0.4], [0.9]] }, s: { q: [[0.1, 0.4], [0.9, 1.6]] } },
          set: { q: 'q' },
          ask: T(
            'Trova l’altezza a cui la pallina galleggia ferma. Più cariche ha, più in alto galleggia!',
            'La pallina ha una carica q = <b>{q} µC</b>; in basso c’è Q = 0,1 µC, e la pallina pesa 0,009 N. A che altezza galleggia?',
            'Carica della pallina: <b>{q} µC</b>; in basso 0,1 µC; peso 0,009 N. A che altezza galleggia? [[h = √(k · Q · q / P)]]'),
          measure: 'h', goal: '100 * Math.sqrt(9e9 * 0.1e-6 * q * 1e-6 / 0.009)', tol: 1,
          ok: T('Perfetto! La pallina galleggia ferma nel tubo!', 'Esatto: la spinta e il peso si equilibrano.'),
          high: T('Troppo in alto: lassù la spinta è debole e la pallina scende. Abbassala.', 'Troppo in alto: la spinta è minore del peso.'),
          low: T('Troppo in basso: la spinta è forte e la pallina sale. Alzala.', 'Troppo in basso: la spinta è maggiore del peso.'),
          solve: { h: 'Math.round(100 * Math.sqrt(9e9 * 0.1e-6 * q * 1e-6 / 0.009))' },
        },
        {
          kind: 'q',
          text: T('Con più cariche, la pallina galleggia…', 'Con la carica q quadruplicata, la pallina galleggia…', 'Perché con 4 volte la carica la pallina galleggia al doppio dell’altezza, e non a 4 volte?'),
          options: [T('più in alto', 'al doppio dell’altezza', 'perché la spinta cala con il quadrato dell’altezza'), T('più in basso', 'a metà altezza', 'perché la spinta cresce con l’altezza della pallina'), T('alla stessa altezza', 'alla stessa altezza', 'perché il peso della pallina resta sempre lo stesso')],
          answer: 0,
          explain: T('Giusto: più carica, più in alto.', 'Esatto: q × 4 e h² × 4, cioè h × 2.', 'Esatto: con 4 volte la carica, a distanza doppia la spinta diventa un quarto e torna uguale al peso.'),
        },
      ],
      hints: [T('Se la pallina sale, alzala; se scende, abbassala.', 'Galleggia dove k·Q·q/h² = P: con q = 0,4 µC, a 20 cm.', 'Con 0,1 µC galleggia a 10 cm; con 4 volte la carica, al doppio dell’altezza.')],
      solution: T(
        'Con poche cariche galleggia in basso, con tante più in alto.',
        'h = √(k·Q·q/P): 10 cm con 0,1 µC, 20 con 0,4, 30 con 0,9, 40 con 1,6.',
        'L’altezza in cui la spinta di Coulomb è uguale al peso.'),
    },
    {
      id: 'e01-7', kind: 'ripasso', title: 'Ripasso delle cariche',
      intro: T('Ripassiamo: palloncini, elettroni, conduttori e campi!', 'Ripasso: cariche, conduttori, legge di Coulomb e campo elettrico.', 'Ripasso: le cariche e i loro campi.'),
      steps: [
        {
          kind: 'q',
          text: T('Due palloncini strofinati allo stesso modo…', 'Due cariche negative, vicine…', 'Due cariche, una positiva e una negativa…'),
          options: [T('si respingono', 'si respingono', 'si attirano'), T('si attirano', 'si attirano', 'si respingono'), T('restano fermi', 'si annullano a vicenda', 'non si fanno niente')],
          answer: 0,
          explain: T('Giusto: cariche uguali si respingono.', 'Esatto: cariche uguali si respingono.', 'Esatto: cariche opposte si attirano.'),
        },
        {
          kind: 'q',
          text: T('Quando strofini il palloncino sulla lana, passano…', 'Un oggetto è positivo quando…', 'Che cosa dice la conservazione della carica?'),
          options: [T('gli elettroni', 'ha meno elettroni che protoni', 'che la carica si sposta, ma non si crea'), T('i protoni', 'ha preso protoni da un altro oggetto', 'che ogni oggetto resta sempre neutro, anche strofinato'), T('pezzetti di lana', 'ha più elettroni che protoni', 'che la carica si consuma')],
          answer: 0,
          explain: T('Giusto: gli elettroni, negativi.', 'Esatto: ha perso elettroni.', 'Esatto: quella che un oggetto guadagna, un altro la perde.'),
        },
        {
          kind: 'q',
          text: T('Quale di questi fa correre le cariche?', 'Quale di questi materiali è un conduttore?', 'Perché i metalli sono buoni conduttori?'),
          options: [T('il rame', 'l’alluminio', 'perché hanno elettroni liberi di correre'), T('la plastica', 'il vetro', 'perché sono pesanti e duri'), T('la gomma', 'la gomma', 'perché sono freddi al tatto')],
          answer: 0,
          explain: T('Giusto: i metalli conducono.', 'Esatto: è un metallo.', 'Esatto: elettroni liberi, che non restano legati a un atomo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Distanza doppia.'),
          vals: { F: [8, 12, 20] }, calc: 'F / 4', unit: 'N', tol: 0.05,
          ask: T(null,
            'Due cariche si respingono con una forza di <b>{F} N</b>. Se la loro distanza raddoppia, quanto vale la forza?',
            'Forza fra due cariche: <b>{F} N</b>. Distanza raddoppiata: forza? [[F ∝ 1 / r²]]'),
          explain: T(null, 'Esatto: a distanza doppia la forza è un quarto: {F} / 4 = {ans:0} N.', 'Esatto: {ans:0} N.'),
        },
        {
          kind: 'q',
          text: T('Le linee del campo elettrico…', 'Le linee di campo vanno…', 'Che cosa misura il campo elettrico in un punto?'),
          options: [T('escono dal + ed entrano nel −', 'dalle cariche + alle cariche −', 'la forza su ogni coulomb di carica che metti lì'), T('escono dal − ed entrano nel +', 'dalle cariche − alle cariche +', 'quante cariche ci sono in quel punto'), T('girano in tondo', 'in cerchio intorno alle cariche', 'la velocità delle cariche che passano')],
          answer: 0,
          explain: T('Giusto: dal + al −.', 'Esatto: dal + al −.', 'Esatto: la forza diviso la carica, in newton al coulomb.'),
        },
        {
          kind: 'q',
          text: T('Più due cariche sono lontane, più la forza è…', 'La legge di Coulomb ha la stessa forma di quale legge?', 'Che cosa hanno in comune la legge di Coulomb e la gravitazione universale?'),
          options: [T('debole', 'la gravitazione universale di Newton', 'la forza cala con il quadrato della distanza'), T('forte', 'la legge di Archimede', 'tutte e due possono anche respingere'), T('uguale', 'la legge di Hooke delle molle', 'tutte e due dipendono solo dalla massa')],
          answer: 0,
          explain: T('Giusto: più lontane, più debole.', 'Esatto: tutte e due calano con il quadrato della distanza.', 'Esatto: ma la gravità attira soltanto, mentre le cariche possono anche respingere.'),
        },
      ],
    },
    {
      id: 'e01-8', kind: 'boss', title: 'Il mito delle gomme',
      sim: 'cariche', params: { mode: 'auto', veicolo: 'auto' }, controls: ['veicolo'],
      intro: T(
        'Sono Vetrino. Durante un temporale, in macchina sei al sicuro dai fulmini. Ma perché? Si dice: <i>“Merito delle gomme, che isolano l’auto dalla terra”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“in auto i fulmini non ti fanno niente perché le gomme isolano dalla terra”</i>. Che in auto si sia al sicuro è vero; ma il merito è delle gomme? Tre auto sotto il temporale: una normale, una senza gomme, una di plastica.',
        'Sono Vetrino. Il mito delle gomme: <i>“in auto si è protetti dai fulmini perché gli pneumatici isolano dal suolo”</i>. Un fulmine ha appena attraversato chilometri d’aria, che è un ottimo isolante. Possono fermarlo pochi centimetri di gomma? Mettiamolo alla prova.'),
      steps: [
        {
          kind: 'q',
          text: T('Per capire se il merito è delle gomme, che cosa cambi?', 'Come si mette alla prova il mito?', 'Qual è il confronto onesto?'),
          options: [T('solo le gomme: con e senza', 'la stessa auto con e senza gomme, e poi un’auto di plastica', 'una cosa alla volta: gomme, poi carrozzeria'), T('l’auto e il temporale insieme', 'auto diverse, sotto temporali diversi', 'cambiare tutto insieme, per vedere più casi possibili'), T('niente: si guarda il cielo', 'si aspetta un temporale e si guarda', 'si chiede a un meccanico che cosa ne pensa')],
          answer: 0,
          explain: T('Giusto: una cosa alla volta.', 'Esatto: così si vede che cosa conta davvero.', 'Esatto: una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova le tre auto sotto il fulmine.', 'Prova l’auto con le gomme, quella senza gomme e quella di plastica.'),
          need: [
            { when: "veicolo == 'auto'", try: { veicolo: 'auto' }, msg: T('Prova l’auto con le gomme.', 'Manca l’auto con le gomme.') },
            { when: "veicolo == 'cerchi'", try: { veicolo: 'cerchi' }, msg: T('Ora quella senza gomme.', 'Manca l’auto senza gomme.') },
            { when: "veicolo == 'plastica'", try: { veicolo: 'plastica' }, msg: T('E ora quella di plastica.', 'Manca l’auto di plastica.') },
          ],
        },
        {
          kind: 'q',
          text: T('L’auto senza gomme, colpita dal fulmine…', 'Senza gomme, chi è dentro l’auto di metallo…', 'Che cosa mostra l’auto senza gomme?'),
          options: [T('protegge lo stesso', 'è al sicuro lo stesso', 'che le gomme non c’entrano: si è protetti lo stesso'), T('non protegge più', 'prende la scossa', 'che senza gomme il fulmine entra'), T('non viene colpita', 'non viene colpito', 'che senza gomme il fulmine non arriva')],
          answer: 0,
          explain: T('Giusto: al sicuro anche senza gomme!', 'Esatto: le gomme non c’entrano.', 'Esatto: la protezione non viene dalle gomme.'),
        },
        {
          kind: 'q',
          text: T('E l’auto di plastica, con le gomme?', 'E chi è dentro l’auto di plastica, con le gomme?', 'Che cosa mostra l’auto di plastica?'),
          options: [T('non protegge', 'è in pericolo', 'che le gomme da sole non proteggono affatto'), T('protegge di più', 'è più al sicuro di tutti', 'che la plastica isola meglio del metallo'), T('protegge uguale', 'è al sicuro come gli altri', 'che conta solo la forma dell’auto')],
          answer: 0,
          explain: T('Giusto: la plastica non protegge.', 'Esatto: il fulmine passa dentro.', 'Esatto: con le gomme ma senza metallo, si è in pericolo.'),
        },
        {
          kind: 'q',
          text: T('Allora che cosa ti protegge, in auto?', 'Che cosa protegge davvero chi è in auto?', 'Perché dentro una scatola di metallo il campo elettrico è zero?'),
          options: [T('il metallo intorno a te', 'la carrozzeria di metallo, dove le cariche corrono fuori', 'le cariche libere del metallo vanno tutte fuori'), T('le gomme', 'le gomme, che isolano', 'perché il metallo assorbe le cariche e le consuma'), T('i finestrini', 'i finestrini chiusi', 'perché l’aria dentro è isolante')],
          answer: 0,
          explain: T('Giusto: il metallo fa correre il fulmine fuori, fino a terra.', 'Esatto: è una gabbia di Faraday: il fulmine corre fuori, sul metallo, fino a terra.', 'Esatto: si sistemano fuori e annullano il campo dentro: è la gabbia di Faraday. Per questo anche gli aerei, colpiti spesso dai fulmini, proteggono i passeggeri.'),
        },
        {
          kind: 'q',
          text: T('Allora il mito delle gomme…', 'Che cosa concludi sul mito delle gomme?', 'Il mito delle gomme: il verdetto?'),
          options: [T('è falso: ti protegge il metallo, non le gomme', 'falso: protegge il metallo, non le gomme', 'falso: è la gabbia di Faraday'), T('è vero: sono le gomme', 'vero: senza gomme si prende la scossa del fulmine', 'vero: gli pneumatici isolano dal suolo'), T('è vero solo con la pioggia', 'vero a metà: protegge solo con le gomme nuove', 'vero, ma solo per le auto di plastica')],
          answer: 0,
          explain: T('Mito smontato! In auto sei al sicuro, ma grazie al metallo intorno a te: le gomme non c’entrano.', 'Mito smontato: protegge la carrozzeria di metallo, una gabbia di Faraday. Le gomme non fermano un fulmine.', 'Mito smontato: il fulmine corre sulla carrozzeria e scavalca le gomme, e dentro il campo è zero. In una cabriolet di tela o in moto non si è protetti.'),
        },
      ],
      hints: [T('Guarda bene l’auto senza gomme.', 'Confronta l’auto senza gomme e quella di plastica.', 'Che cosa hanno in comune le due auto che proteggono?')],
      solution: T(
        'Protegge il metallo dell’auto, non le gomme.',
        'Falso: protegge la carrozzeria di metallo, una gabbia di Faraday.',
        'Il mito è falso: è la gabbia di Faraday.'),
    },
  ],
};
