// OT02 · Rifrazione e lenti. Simulazione: rifrazione e lenti (lens.js), in sette modi: il laser che entra nell'acqua,
// la moneta nella tazza e la matita nel bicchiere, il laser sott'acqua che resta intrappolato, le lenti convergenti e
// divergenti, l'immagine di una candela, la lanterna magica, la lente coperta a metà.
// La zona parte dalla luce che si piega entrando nell'acqua, fa comparire la moneta, intrappola la luce con la
// riflessione totale, accende il fuoco di una lente, forma le immagini (e la lente d'ingrandimento), costruisce la
// lanterna magica del parco e finisce con Vetrino che mette alla prova il mito della mezza lente.
import { T } from '../util.js';

export default {
  id: 'OT02',
  title: 'Rifrazione e lenti',
  levels: [
    {
      id: 'ot02-1', kind: 'lezione', title: 'La luce si piega',
      sim: 'lens', params: { mode: 'rifrazione', i: 40, mat: 'acqua' }, controls: ['i', 'mat'],
      intro: T(
        'Punta un laser sull’acqua di un acquario: appena entra nell’acqua, il raggio cambia strada e si piega! Prova raggi dritti e inclinati, e poi il vetro al posto dell’acqua.',
        'Quando la luce passa dall’aria all’acqua cambia velocità, e il raggio si piega: è la <b>rifrazione</b>. Entrando in un materiale in cui la luce è più lenta, il raggio si avvicina alla normale. Ogni materiale ha il suo <b>indice di rifrazione</b> n: 1 per l’aria, 1,33 per l’acqua, 1,5 per il vetro. La regola è sin i = n · sin r.',
        'Nell’acqua la luce va più piano che nell’aria: circa 225 000 km al secondo invece di 300 000. Per questo, se entra di sbieco, il raggio cambia direzione, come una fila di soldati che entra nel fango e rallenta prima da una parte. È la rifrazione; la sua legge la trovarono Snell e Cartesio, nel Seicento. [[n₁ · sin i = n₂ · sin r]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un raggio dritto e uno molto inclinato.', 'Prova un raggio a 0° e uno a 60° o più.'),
          need: [
            { when: 'i == 0', try: { i: 0 }, msg: T('Prova un raggio dritto, a 0 gradi.', 'Manca una prova a 0°.') },
            { when: 'i >= 60', try: { i: 60 }, msg: T('Ora un raggio molto inclinato.', 'Manca una prova a 60° o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando il raggio inclinato entra nell’acqua…', 'Entrando nell’acqua, il raggio inclinato…', 'Perché il raggio si piega entrando nell’acqua?'),
          options: [T('si piega', 'si avvicina alla normale', 'perché nell’acqua la luce rallenta'), T('va dritto', 'si allontana dalla normale', 'perché l’acqua attira la luce verso il basso'), T('si ferma', 'torna tutto indietro', 'perché la luce si stanca nell’acqua')],
          answer: 0,
          explain: T('Giusto: cambia strada appena entra.', 'Esatto: nell’acqua il raggio è più vicino alla normale: r è minore di i.', 'Esatto: il fronte della luce rallenta prima da una parte, e gira, come le ruote di un carrello che finiscono sulla sabbia una prima dell’altra.'),
        },
        {
          kind: 'q',
          text: T('E se il raggio arriva dritto, a 0 gradi?', 'Un raggio perpendicolare alla superficie, con i = 0°…', 'La luce rallenta anche se entra dritta: perché allora non si piega?'),
          options: [T('va dritto e non si piega', 'passa senza piegarsi', 'tutto il fronte rallenta insieme, e nessuna parte gira'), T('si piega più di tutti', 'si piega di 90°', 'perché se entra dritta non rallenta'), T('rimbalza tutto', 'si ferma sulla superficie', 'perché la superficie la respinge')],
          answer: 0,
          explain: T('Giusto: dritto entra, dritto prosegue.', 'Esatto: r = 0°.', 'Esatto: nessuna parte del fronte resta indietro rispetto alle altre.'),
        },
        {
          kind: 'free',
          text: T('Ora metti il vetro al posto dell’acqua.', 'Ora prova il vetro, con lo stesso angolo.'),
          need: [{ when: "mat == 'vetro'", try: { mat: 'vetro' }, msg: T('Metti il vetro.', 'Manca una prova con il vetro.') }],
        },
        {
          kind: 'q',
          text: T('Il vetro piega il raggio…', 'Con lo stesso angolo, nel vetro il raggio si piega…', 'Perché il vetro piega la luce più dell’acqua?'),
          options: [T('più dell’acqua', 'più che nell’acqua', 'perché nel vetro la luce va ancora più piano'), T('meno dell’acqua', 'meno che nell’acqua', 'perché il vetro è più trasparente e più pulito dell’acqua'), T('uguale all’acqua', 'esattamente come nell’acqua', 'perché il vetro è più duro')],
          answer: 0,
          explain: T('Giusto: il vetro la piega di più.', 'Esatto: il vetro ha un indice di rifrazione più grande, 1,5.', 'Esatto: nel vetro va a 200 000 km al secondo: rallenta di più, e si piega di più.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La legge della rifrazione.'),
          vals: { si: [0.5, 0.6, 0.8] }, calc: 'si / 1.33', unit: '', tol: 0.01,
          ask: T(null,
            'Un raggio entra nell’acqua (n = 1,33) con un angolo di incidenza che ha sin i = <b>{si}</b>. Quanto vale sin r?',
            'Un raggio entra nell’acqua con seno dell’angolo di incidenza <b>{si}</b>: seno dell’angolo di rifrazione? [[sin r = sin i / n, con n = 1,33]]'),
          explain: T(null, 'Esatto: sin r = sin i / n = {si} / 1,33 = {ans:2}.', 'Esatto: {ans:2}, più piccolo: il raggio si avvicina alla normale.'),
        },
      ],
      hints: [T('Entrando nell’acqua, il raggio inclinato si piega.', 'Entrando nell’acqua il raggio si avvicina alla normale: sin i = n · sin r.', 'La luce rallenta, e il raggio gira verso la normale.')],
      solution: T(
        'Il raggio si piega quando entra nell’acqua, e nel vetro ancora di più. Se arriva dritto, non si piega.',
        'Il raggio si avvicina alla normale: a 40° nell’acqua, r ≈ 29°.',
        'Rifrazione: la luce rallenta e il raggio si avvicina alla normale.'),
    },
    {
      id: 'ot02-2', kind: 'prevedi', title: 'La moneta che appare',
      sim: 'lens', params: { mode: 'tazza', cosa: 'moneta', acqua: false }, controls: [],
      intro: T(
        'Una moneta sul fondo di una tazza vuota. Ti abbassi finché il bordo te la nasconde. Ora, senza che tu ti muova, qualcuno versa l’acqua nella tazza. Che cosa vedrai? Prima indovina, poi guarda.',
        'Un classico esperimento da cucina: una moneta in una tazza, con l’occhio appena sotto la linea del bordo, così che la moneta non si vede. Poi si versa l’acqua. Pensa alla rifrazione: che cosa fa il raggio che esce dall’acqua? Prevedi, poi guarda.',
        'Il trucco della moneta che appare lo descrivevano già Euclide e Tolomeo. Una tazza, una moneta nascosta dal bordo, un po’ d’acqua. E poi una matita in un bicchiere. Due effetti della stessa rifrazione, così comuni che non ci facciamo più caso. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { cosa: 'moneta', acqua: false }, predict: [{ acqua: true }],
          text: T('Versi l’acqua nella tazza. La moneta…', 'Con l’acqua nella tazza, la moneta…', 'Che cosa succede alla moneta quando si versa l’acqua?'),
          options: [T('compare', 'compare: ora si vede', 'compare: il raggio si piega uscendo'), T('resta nascosta', 'resta nascosta dal bordo', 'resta nascosta: l’acqua è trasparente'), T('sparisce anche il fondo', 'sparisce: l’acqua la copre', 'si vede solo il suo riflesso sulla superficie')],
          answer: 0,
          explain: T('Giusto: con l’acqua la moneta compare!', 'Esatto: il raggio che esce dall’acqua si piega verso il basso e arriva all’occhio.', 'Esatto: uscendo nell’aria il raggio si allontana dalla normale, e passa sopra il bordo.'),
          solution: T('Compare.', 'Compare: ora si vede.'),
        },
        {
          kind: 'q', set: { cosa: 'matita', acqua: false }, predict: [{ acqua: true }],
          text: T('Una matita dritta nel bicchiere. Con l’acqua, come la vedi?', 'Una matita dritta in un bicchiere. Con l’acqua, la vedi…', 'Una matita in un bicchiere d’acqua: che cosa vedi?'),
          options: [T('spezzata', 'spezzata sulla superficie', 'spezzata: la parte sott’acqua sembra più in alto'), T('dritta', 'dritta come prima, senza cambiare', 'dritta: l’acqua non cambia niente'), T('più lunga', 'più lunga e più sottile di prima', 'storta, ma solo sopra l’acqua')],
          answer: 0,
          explain: T('Giusto: sembra spezzata!', 'Esatto: la parte sott’acqua sembra più in alto.', 'Esatto: ogni punto sott’acqua lo vediamo più in alto di dov’è.'),
          solution: T('Spezzata.', 'Spezzata sulla superficie.'),
        },
        {
          kind: 'q',
          text: T('Perché la moneta compare?', 'Perché, con l’acqua, la moneta si vede?', 'Perché un fiume visto dalla riva sembra meno profondo di quanto è?'),
          options: [T('la luce si piega uscendo dall’acqua', 'il raggio si piega uscendo, e arriva all’occhio', 'la luce del fondo si piega uscendo, e lo vediamo più in alto'), T('l’acqua alza la moneta', 'perché l’acqua solleva la moneta', 'perché l’acqua del fiume è torbida, e nasconde quanto è profondo'), T('l’acqua fa luce', 'perché l’acqua illumina il fondo', 'perché i fiumi hanno il fondo chiaro')],
          answer: 0,
          explain: T('Giusto: la luce cambia strada, e arriva ai tuoi occhi.', 'Esatto: la moneta resta lì; è la luce che cambia strada.', 'Esatto: per questo è pericoloso tuffarsi dove l’acqua sembra bassa.'),
        },
        {
          kind: 'q',
          text: T('La moneta si è spostata davvero?', 'Dove vediamo la moneta, con l’acqua?', 'Perché chi pesca con la lancia mira più in basso di dove vede il pesce?'),
          options: [T('no, è sempre lì', 'più in alto di dov’è davvero', 'perché il pesce è più in basso di come appare'), T('sì, l’acqua la sposta', 'più in basso di dov’è', 'perché il pesce scappa sempre verso il fondo'), T('sì, è salita a galla', 'esattamente dov’è', 'perché sott’acqua la lancia tende a salire verso l’alto')],
          answer: 0,
          explain: T('Giusto: è la luce che cambia strada, non la moneta.', 'Esatto: la vediamo sul prolungamento del raggio, più in alto.', 'Esatto: la luce del pesce si piega uscendo, e lo vediamo più in alto di dov’è.'),
        },
      ],
      hints: [T('Uscendo dall’acqua la luce si piega.', 'Il raggio che parte dal fondo si piega uscendo dall’acqua.', 'Uscendo, il raggio si allontana dalla normale: vediamo le cose più in alto.')],
    },
    {
      id: 'ot02-3', kind: 'lezione', title: 'La luce intrappolata',
      sim: 'lens', params: { mode: 'totale', i: 30, mat: 'acqua' }, controls: ['i', 'mat'],
      intro: T(
        'Ora il laser è sott’acqua e punta verso l’aria. Se è poco inclinato, la luce esce. Ma se lo inclini tanto… la luce non esce più e resta intrappolata! Prova a inclinarlo sempre di più.',
        'Quando la luce passa dall’acqua all’aria il raggio si allontana dalla normale. Più inclini il laser, più il raggio uscente si piega, fino a sfiorare la superficie. Oltre l’<b>angolo limite</b>, circa 49° per l’acqua e 42° per il vetro, la luce non esce più: è la <b>riflessione totale</b>.',
        'Uscendo da un materiale in cui è più lenta, la luce si allontana dalla normale. All’angolo limite il raggio uscente sfiora la superficie; oltre, la luce resta tutta dentro: riflessione totale, senza perdite, meglio di qualunque specchio. Le fibre ottiche di internet portano così la luce per migliaia di chilometri. [[sin c = 1 / n]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il laser poco inclinato e molto inclinato.', 'Prova un angolo di 30° o meno, e uno di 50° o più.'),
          need: [
            { when: 'i <= 30', try: { i: 30 }, msg: T('Prova il laser poco inclinato.', 'Manca una prova a 30° o meno.') },
            { when: 'i >= 50', try: { i: 50 }, msg: T('Ora il laser molto inclinato.', 'Manca una prova a 50° o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con il laser molto inclinato, la luce…', 'Nell’acqua, oltre i 49°, il raggio che arriva alla superficie…', 'Che cos’è l’angolo limite?'),
          options: [T('non esce più', 'resta tutto nell’acqua', 'l’angolo oltre il quale la luce non esce più'), T('esce più forte', 'esce, piegandosi ancora di più', 'l’angolo oltre il quale la luce si spegne'), T('si spegne', 'si ferma sulla superficie', 'l’angolo più piccolo per entrare in acqua')],
          answer: 0,
          explain: T('Giusto: rimbalza tutta dentro l’acqua!', 'Esatto: è la riflessione totale; la superficie fa da specchio perfetto.', 'Esatto: oltre l’angolo limite il raggio dovrebbe uscire a più di 90°: non può, e la luce torna tutta indietro.'),
        },
        {
          kind: 'q',
          text: T('Sott’acqua, guardando in su ma di lato, la superficie sembra…', 'Perché, sott’acqua, la superficie guardata di sbieco sembra uno specchio?', 'Perché un diamante brilla così tanto?'),
          options: [T('uno specchio', 'oltre l’angolo limite la luce si riflette tutta', 'ha un angolo limite piccolissimo'), T('nera come il buio', 'perché sott’acqua la luce si spegne', 'perché il diamante fa un po’ di luce da solo'), T('trasparente come sempre', 'perché l’acqua è sporca in superficie', 'perché è molto più duro del vetro')],
          answer: 0,
          explain: T('Giusto: come uno specchio d’argento.', 'Esatto: riflessione totale.', 'Esatto: il diamante ha un indice di rifrazione altissimo, 2,4: l’angolo limite è appena 24°, e i suoi tagli intrappolano la luce.'),
        },
        {
          kind: 'free',
          text: T('Ora prova il vetro.', 'Ora prova il vetro: dove comincia la riflessione totale?'),
          need: [{ when: "mat == 'vetro'", try: { mat: 'vetro', i: 45 }, msg: T('Metti il vetro.', 'Manca una prova con il vetro.') }],
        },
        {
          kind: 'q',
          text: T('Nel vetro, la luce resta intrappolata…', 'L’angolo limite del vetro, rispetto a quello dell’acqua, è…', 'Perché le fibre ottiche sono fatte di vetro?'),
          options: [T('prima che nell’acqua', 'più piccolo: 42° invece di 49°', 'la luce ci resta intrappolata anche dove la fibra si piega'), T('dopo, più tardi', 'più grande, perché il vetro è duro', 'perché il vetro costa poco'), T('mai', 'uguale: è sempre 49°', 'perché il vetro conduce bene l’elettricità, come il rame dei cavi')],
          answer: 0,
          explain: T('Giusto: il vetro la intrappola prima.', 'Esatto: più grande è n, più piccolo è l’angolo limite.', 'Esatto: rimbalzando sulle pareti, la luce segue la fibra anche nelle curve.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’angolo limite.'),
          vals: { n: [1.33, 1.5, 2.4] }, calc: '1 / n', unit: '', tol: 0.01,
          ask: T(null,
            'Un materiale ha indice di rifrazione n = <b>{n}</b>. Quanto vale il seno del suo angolo limite?',
            'Indice di rifrazione <b>{n}</b>: quanto vale il seno dell’angolo limite? [[sin c = 1 / n]]'),
          explain: T(null, 'Esatto: sin c = 1/n = 1 / {n} = {ans:2}.', 'Esatto: {ans:2}.'),
        },
      ],
      hints: [T('Più inclini il laser, più facile che la luce resti dentro.', 'Oltre l’angolo limite c’è la riflessione totale: sin c = 1/n.', 'Uscendo, il raggio si allontana dalla normale: oltre l’angolo limite non può più uscire.')],
      solution: T(
        'Molto inclinata, la luce non esce più e rimbalza dentro l’acqua.',
        'Oltre 49° nell’acqua e 42° nel vetro: riflessione totale.',
        'Riflessione totale oltre l’angolo limite.'),
    },
    {
      id: 'ot02-4', kind: 'lezione', title: 'Il fuoco della lente',
      sim: 'lens', params: { mode: 'lente', forma: 'convergente', f: 20 }, controls: ['forma', 'f'],
      intro: T(
        'Con una lente d’ingrandimento puoi raccogliere la luce del Sole in un puntino piccolissimo e caldissimo: il fuoco! Questa lente si chiama convergente ed è più spessa al centro. Ce n’è anche una più sottile al centro: che cosa fa?',
        'Una lente è un pezzo di vetro con le facce curve: ogni raggio la attraversa con due rifrazioni. La <b>lente convergente</b>, più spessa al centro, fa incontrare i raggi paralleli in un punto, il <b>fuoco</b>; la sua distanza dalla lente è la <b>distanza focale</b> f. La <b>lente divergente</b>, più sottile al centro, li allarga.',
        'Una lente piega i raggi con due rifrazioni, una per faccia. Più è bombata, più li piega, e più corta è la distanza focale. Gli occhiali da presbite sono lenti convergenti, quelli da miope divergenti. Gli ottici misurano le lenti in diottrie: l’inverso della distanza focale in metri. [[D = 1 / f]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la lente convergente e quella divergente.', 'Prova le due lenti.'),
          need: [
            { when: "forma == 'convergente'", try: { forma: 'convergente' }, msg: T('Prova la lente convergente.', 'Manca la lente convergente.') },
            { when: "forma == 'divergente'", try: { forma: 'divergente' }, msg: T('Ora quella divergente.', 'Manca la lente divergente.') },
          ],
        },
        {
          kind: 'q',
          text: T('La lente convergente fa incontrare i raggi…', 'Dove si incontrano i raggi paralleli dopo una lente convergente?', 'Perché con una lente d’ingrandimento si può accendere un fuoco?'),
          options: [T('in un punto: il fuoco', 'nel fuoco, a distanza f', 'tutta la luce che la attraversa finisce in un puntino'), T('in tanti punti', 'sulla lente stessa', 'perché il vetro si scalda al Sole'), T('mai', 'non si incontrano mai', 'perché la lente fa più luce del Sole')],
          answer: 0,
          explain: T('Giusto: tutti nello stesso punto!', 'Esatto: nel fuoco, alla distanza focale.', 'Esatto: la luce di tutta la lente si concentra in un puntino, che scalda moltissimo.'),
        },
        {
          kind: 'q',
          text: T('La lente divergente, invece, i raggi…', 'Dopo una lente divergente, i raggi paralleli…', 'Dove sta il fuoco di una lente divergente?'),
          options: [T('li allarga', 'si allargano', 'davanti alla lente'), T('li stringe', 'si incontrano dietro la lente', 'dietro la lente, come per l’altra'), T('li ferma', 'tornano indietro', 'non ha nessun fuoco')],
          answer: 0,
          explain: T('Giusto: li apre a ventaglio.', 'Esatto: sembrano venire dal fuoco, davanti alla lente.', 'Esatto: è un fuoco virtuale: lì si incontrano i prolungamenti all’indietro dei raggi.'),
        },
        {
          kind: 'free',
          text: T('Con la lente convergente, prova il fuoco vicino e lontano.', 'Con la lente convergente, prova f = 10 cm e f = 30 cm.', 'Con la lente convergente, prova una distanza focale di 10 cm e una di 30 cm.'),
          need: [
            { when: "forma == 'convergente' && f == 10", try: { forma: 'convergente', f: 10 }, msg: T('Prova il fuoco a 10 centimetri.', 'Manca la convergente con f = 10 cm.', 'Manca la convergente con distanza focale 10 cm.') },
            { when: "forma == 'convergente' && f == 30", try: { forma: 'convergente', f: 30 }, msg: T('Ora il fuoco a 30 centimetri.', 'Manca la convergente con f = 30 cm.', 'Manca la convergente con distanza focale 30 cm.') },
          ],
        },
        {
          kind: 'q',
          text: T('La lente con il fuoco vicino è…', 'Una lente con f = 10 cm, rispetto a una con f = 30 cm, è…', 'Perché una lente più bombata ha una distanza focale più corta?'),
          options: [T('più spessa al centro', 'più bombata', 'perché le facce più curve piegano di più i raggi'), T('più sottile al centro', 'più piatta, quasi come un vetro', 'perché il vetro è più pesante'), T('uguale', 'uguale: cambia solo il vetro', 'perché la luce ci mette di più ad attraversarla')],
          answer: 0,
          explain: T('Giusto: più è spessa al centro, più piega.', 'Esatto: più bombata piega di più i raggi, e il fuoco è più vicino.', 'Esatto: i raggi arrivano più inclinati sulle facce, e si piegano di più.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Le diottrie.'),
          vals: { f: [0.25, 0.5, 2] }, calc: '1 / f', unit: 'D', tol: 0.05,
          ask: T(null,
            'Una lente ha una distanza focale di <b>{f} m</b>. Quante diottrie ha? (diottrie = 1 / f, con f in metri)',
            'Distanza focale <b>{f} m</b>: quante diottrie? [[D = 1 / f]]'),
          explain: T(null, 'Esatto: 1 / {f} = {ans:1} diottrie.', 'Esatto: {ans:1} diottrie.'),
        },
      ],
      hints: [T('La convergente raccoglie i raggi, la divergente li allarga.', 'Convergente: i raggi paralleli passano per il fuoco, a distanza f.', 'Più la lente è bombata, più piega i raggi.')],
      solution: T(
        'La convergente fa incontrare i raggi nel fuoco; la divergente li allarga.',
        'Convergente: fuoco reale a distanza f; divergente: fuoco virtuale, davanti.',
        'Le convergenti raccolgono i raggi, le divergenti li aprono.'),
    },
    {
      id: 'ot02-5', kind: 'lezione', title: 'L’immagine della lente',
      sim: 'lens', params: { mode: 'immagine', p: 20 }, controls: ['p'],
      intro: T(
        'Una candela davanti a una lente convergente. Dietro la lente, su uno schermo, compare la candela… a testa in giù! Avvicina la candela alla lente: che cosa succede? E se la avvicini tantissimo?',
        'Una lente convergente forma l’immagine di un oggetto. Se l’oggetto è oltre il fuoco, l’immagine è <b>reale</b> e capovolta: si può raccogliere su uno schermo. Dove si forma lo dice l’<b>equazione delle lenti</b>, 1/p + 1/q = 1/f: p è la distanza dell’oggetto, q quella dell’immagine. Se l’oggetto è dentro il fuoco, la lente diventa una lente d’ingrandimento.',
        'Tutti i raggi che partono da un punto della candela, dopo la lente, si ritrovano in un punto: così nascono le immagini delle macchine fotografiche, dei proiettori e dell’occhio. Con la candela vicinissima, dentro il fuoco, la lente diventa una lente d’ingrandimento. [[1/p + 1/q = 1/f]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la candela lontana, vicina e vicinissima alla lente.', 'Prova p = 30 cm, p = 15 cm e p = 5 cm.', 'Prova la candela a 30 cm, a 15 cm e a 5 cm dalla lente.'),
          need: [
            { when: 'p >= 30', try: { p: 30 }, msg: T('Prova la candela lontana, a 30 centimetri.', 'Manca p = 30 cm.', 'Manca la candela a 30 cm.') },
            { when: 'p == 15', try: { p: 15 }, msg: T('Ora più vicina, a 15 centimetri.', 'Manca p = 15 cm.', 'Manca la candela a 15 cm.') },
            { when: 'p <= 5', try: { p: 5 }, msg: T('E ora vicinissima, a 5 centimetri.', 'Manca p = 5 cm.', 'Manca la candela a 5 cm.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la candela lontana, sullo schermo la vedi…', 'Con l’oggetto oltre il fuoco, l’immagine è…', 'Perché l’immagine di una lente convergente è capovolta?'),
          options: [T('a testa in giù', 'reale e capovolta', 'i raggi si incrociano nella lente'), T('dritta, come la candela', 'virtuale e dritta', 'perché la lente è rotonda come una palla'), T('non la vedi', 'sempre più grande dell’oggetto', 'perché lo schermo è girato al contrario')],
          answer: 0,
          explain: T('Giusto: come nella camera oscura!', 'Esatto: reale, perché i raggi ci arrivano davvero, e capovolta.', 'Esatto: come nella camera oscura, ma con tanta luce e a fuoco.'),
        },
        {
          kind: 'q',
          text: T('Avvicinando la candela alla lente, l’immagine…', 'Avvicinando l’oggetto al fuoco, l’immagine reale…', 'Perché un proiettore, con la diapositiva vicino al fuoco, fa immagini enormi?'),
          options: [T('si allontana e diventa più grande', 'si allontana e si ingrandisce', 'perché l’immagine va lontano, e più va lontano più è grande'), T('si avvicina e diventa più piccola', 'si avvicina e si rimpicciolisce', 'perché la sua lampada è molto potente'), T('resta uguale', 'resta uguale', 'perché lo schermo è grande')],
          answer: 0,
          explain: T('Giusto: più vicina la candela, più lontana e grande l’immagine.', 'Esatto: l’ingrandimento è q/p.', 'Esatto: più la diapositiva è vicina al fuoco, più l’immagine va lontano e si ingrandisce.'),
        },
        {
          kind: 'q',
          text: T('Con la candela vicinissima, dentro la lente la vedi…', 'Con l’oggetto dentro il fuoco, l’immagine è…', 'Come funziona una lente d’ingrandimento?'),
          options: [T('dritta e più grande', 'virtuale, dritta e ingrandita', 'mostra un’immagine virtuale più grande'), T('a testa in giù', 'reale e capovolta', 'raccoglie la luce in un punto, come al Sole'), T('più piccola', 'reale e più piccola', 'rimpicciolisce le cose per farle stare nell’occhio')],
          answer: 0,
          explain: T('Giusto: è una lente d’ingrandimento!', 'Esatto: q è negativa: l’immagine sta dalla stessa parte dell’oggetto.', 'Esatto: con l’oggetto dentro il fuoco i raggi escono divergenti, e l’occhio li vede venire da un’immagine dritta e più grande.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Dove si forma l’immagine.'),
          vals: { p: [15, 20, 30] }, calc: 'p * 10 / (p - 10)', unit: 'cm', tol: 0.2,
          ask: T(null,
            'Una candela è a <b>{p} cm</b> da una lente con f = 10 cm. A che distanza dalla lente si forma l’immagine?',
            'Candela a <b>{p} cm</b> da una lente con distanza focale 10 cm: dove si forma l’immagine? [[1/p + 1/q = 1/f]]'),
          explain: T(null, 'Esatto: 1/q = 1/10 − 1/{p}, quindi q = {ans:1} cm.', 'Esatto: {ans:1} cm.'),
        },
        {
          kind: 'q',
          text: T('Nel tuo occhio, per vedere, c’è…', 'Che immagine forma il cristallino sulla retina?', 'Perché, per mettere a fuoco, la macchina fotografica sposta l’obiettivo?'),
          options: [T('una lente', 'reale e capovolta', 'per portare l’immagine sul sensore'), T('uno specchio', 'virtuale e dritta', 'per cambiare un po’ i colori della foto'), T('una lampadina', 'nessuna immagine', 'per far entrare meno luce nella macchina')],
          answer: 0,
          explain: T('Giusto: si chiama cristallino.', 'Esatto: reale e capovolta, come nella camera oscura; il cervello la raddrizza.', 'Esatto: oggetti a distanze diverse fanno immagini a distanze diverse, e l’obiettivo si sposta per portarle sul sensore.'),
        },
      ],
      hints: [T('Più vicina è la candela, più lontana e grande è l’immagine.', '1/p + 1/q = 1/f: con f = 10 cm e p = 20 cm, q = 20 cm.', 'Oltre il fuoco: immagine reale; dentro il fuoco: virtuale.')],
      solution: T(
        'Lontana: a testa in giù e piccola. Vicina: a testa in giù e grande. Vicinissima: dritta e grande, dentro la lente.',
        '1/p + 1/q = 1/f: reale e capovolta oltre il fuoco, virtuale e dritta dentro.',
        'Immagine reale oltre il fuoco, virtuale dentro: la lente d’ingrandimento.'),
    },
    {
      id: 'ot02-6', kind: 'costruisci', title: 'La lanterna magica',
      sim: 'lens', params: { mode: 'lanterna', p: 15, L: 20 }, controls: ['L'],
      intro: T(
        'Nel parco arriva la lanterna magica: una lampada, una figura dipinta e una lente, e sul muro compare la figura in grande! Ma è nitida solo se lo schermo è alla distanza giusta. Sposta lo schermo e prova.',
        'Costruisci la lanterna magica del parco: la figura è a distanza p da una lente con f = 10 cm. L’immagine è nitida solo se lo schermo è proprio a distanza q, con 1/p + 1/q = 1/f. Sposta lo schermo per ogni figura.',
        'La lanterna magica, nel Seicento, fu il primo proiettore: una candela, uno specchio, una figura dipinta su vetro e una lente. Le figure si dipingevano capovolte, perché sul muro l’immagine si capovolge. Per metterla a fuoco basta spostare lo schermo. [[1/q = 1/f − 1/p]]'),
      piece: { id: 'lanterna', name: 'La lanterna magica', desc: 'Lo schermo al punto giusto, e la figura appare grande e nitida sul muro.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Sposta lo schermo, poi lancia la luce.', 'Sposta lo schermo, poi lancia: l’immagine deve essere nitida.'),
          vals: { e: { p: [[15], [20]] }, s: { p: [[12, 14, 15], [20, 30, 35]] } },
          set: { p: 'p' },
          ask: T(
            'La figura è a <b>{p} centimetri</b> dalla lente. Dove metti lo schermo?',
            'La figura è a <b>{p} cm</b> da una lente con f = 10 cm. A che distanza va lo schermo?',
            'Figura a <b>{p} cm</b>, distanza focale 10 cm: a che distanza va lo schermo? [[1/q = 1/f − 1/p]]'),
          measure: 'L', goal: 'p * 10 / (p - 10)', tol: 1,
          ok: T('Nitida! La figura appare sul muro!', 'Esatto: l’immagine è nitida.'),
          high: T('Sfocata: lo schermo è troppo lontano. Avvicinalo.', 'Schermo troppo lontano: l’immagine nitida si forma prima.'),
          low: T('Sfocata: lo schermo è troppo vicino. Allontanalo.', 'Schermo troppo vicino: l’immagine nitida si forma più in là.'),
          solve: { L: 'Math.round(p * 10 / (p - 10))' },
        },
        {
          kind: 'q',
          text: T('Sul muro, la figura è…', 'Perché le figure della lanterna magica si dipingevano capovolte?', 'Perché la figura proiettata è tanto più grande quanto più lontano è lo schermo?'),
          options: [T('a testa in giù', 'perché la lente capovolge l’immagine', 'ingrandisce come il rapporto fra le due distanze'), T('dritta come la figura', 'per farle sembrare più antiche', 'perché la luce, lungo la strada, si allarga e si consuma'), T('girata destra e sinistra', 'perché la lampada stava sotto', 'perché il muro è più grande della figura')],
          answer: 0,
          explain: T('Giusto: a testa in giù, come nella camera oscura.', 'Esatto: dipinte capovolte, sul muro tornavano dritte.', 'Esatto: come nei triangoli simili della camera oscura, più lontana è l’immagine, più è grande.'),
        },
      ],
      hints: [T('Più la figura è vicina alla lente, più lontano va lo schermo.', 'q = p·f/(p − f): con p = 15 cm, q = 30 cm.', 'Più la figura si avvicina al fuoco, più lontano va lo schermo.')],
      solution: T('Figura a 15 centimetri: schermo a 30. Figura a 20: schermo a 20.', 'q = p·f/(p − f): con 15 cm, 30 cm; con 20 cm, 20 cm; con 30 cm, 15 cm.', 'Lo schermo va dove si incontrano i raggi: lì l’immagine è nitida.'),
    },
    {
      id: 'ot02-7', kind: 'ripasso', title: 'Ripasso di rifrazione e lenti',
      intro: T('Ripassiamo: luce che si piega, monete che appaiono, lenti!', 'Ripasso: rifrazione, riflessione totale, lenti convergenti e divergenti, immagini.', 'Ripasso: la luce che cambia strada.'),
      steps: [
        {
          kind: 'q',
          text: T('Entrando nell’acqua, un raggio inclinato…', 'Passando dall’aria al vetro, il raggio rifratto…', 'Che cosa succede alla luce che passa dall’aria all’acqua?'),
          options: [T('si piega', 'si avvicina alla normale', 'rallenta, e il raggio si avvicina alla normale'), T('va ancora più dritto', 'si allontana dalla normale', 'accelera, e il raggio si allontana dalla normale'), T('si ferma', 'resta parallelo alla superficie', 'non cambia né velocità né direzione')],
          answer: 0,
          explain: T('Giusto: cambia strada.', 'Esatto: indice più grande, raggio più vicino alla normale.', 'Esatto: rallenta, e il raggio gira.'),
        },
        {
          kind: 'q',
          text: T('Perché la matita nell’acqua sembra spezzata?', 'Dove vediamo un sasso sul fondo di un ruscello?', 'Perché una piscina sembra meno profonda di quanto è?'),
          options: [T('la luce si piega uscendo dall’acqua', 'più in alto di dov’è', 'la luce del fondo si piega uscendo, e lo vediamo più in alto'), T('l’acqua la rompe davvero', 'più in basso di dov’è', 'perché l’acqua schiaccia verso l’alto le piastrelle del fondo'), T('per un riflesso', 'esattamente dov’è', 'perché il cloro dell’acqua è trasparente e fa sembrare tutto vicino')],
          answer: 0,
          explain: T('Giusto: è la luce che si piega, non la matita.', 'Esatto: più in alto, per la rifrazione.', 'Esatto: la profondità che vediamo è minore di quella vera.'),
        },
        {
          kind: 'q',
          text: T('Con il laser sott’acqua molto inclinato, la luce…', 'Che cosa serve per la riflessione totale?', 'Come viaggia la luce in una fibra ottica?'),
          options: [T('non esce più', 'un angolo maggiore dell’angolo limite', 'rimbalzando sulle pareti, per riflessione totale'), T('esce più forte', 'un angolo piccolo, vicino alla normale', 'in linea retta, anche nelle curve'), T('diventa colorata', 'uno specchio sulla superficie', 'grazie alla corrente elettrica nel vetro')],
          answer: 0,
          explain: T('Giusto: resta intrappolata.', 'Esatto: dal materiale in cui la luce è più lenta, oltre l’angolo limite.', 'Esatto: rimbalza sulle pareti senza perdere luce.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'L’immagine della lente.'),
          vals: { p: [12, 15, 30] }, calc: 'p * 10 / (p - 10)', unit: 'cm', tol: 0.2,
          ask: T(null,
            'Un oggetto è a <b>{p} cm</b> da una lente con f = 10 cm. A che distanza si forma l’immagine?',
            'Oggetto a <b>{p} cm</b>, distanza focale 10 cm: distanza dell’immagine? [[1/p + 1/q = 1/f]]'),
          explain: T(null, 'Esatto: q = p·f/(p − f) = {ans:1} cm.', 'Esatto: {ans:1} cm.'),
        },
        {
          kind: 'q',
          text: T('Per accendere un fuoco con il Sole serve una lente…', 'Quale lente fa incontrare in un punto i raggi paralleli?', 'Che cosa fa una lente d’ingrandimento?'),
          options: [T('convergente', 'la convergente', 'mostra un’immagine virtuale più grande'), T('divergente', 'la divergente', 'raccoglie la luce dell’oggetto e la rende più forte'), T('qualsiasi, anche piatta', 'una lastra di vetro piatta', 'rimpicciolisce l’occhio di chi ci guarda dentro')],
          answer: 0,
          explain: T('Giusto: la convergente raccoglie la luce.', 'Esatto: i raggi passano per il fuoco.', 'Esatto: con l’oggetto dentro il fuoco: virtuale, dritta e ingrandita.'),
        },
      ],
    },
    {
      id: 'ot02-8', kind: 'boss', title: 'Il mito della mezza lente',
      sim: 'lens', params: { mode: 'mezza', copri: 'niente' }, controls: ['copri'],
      intro: T(
        'Sono Vetrino. Si dice: <i>“Se copri metà della lente, sullo schermo resta solo metà della candela!”</i>. Sembra logico, no? Metà lente, metà disegno. Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“una lente coperta per metà forma solo metà dell’immagine”</i>. Una candela a 20 cm da una lente con f = 10 cm, lo schermo a 20 cm: l’immagine è nitida. Ora copri metà lente con un cartoncino, sopra o sotto. Che cosa resta sullo schermo?',
        'Sono Vetrino. Il mito della mezza lente: <i>“ogni metà della lente forma la sua metà dell’immagine”</i>. Viene da pensare la lente come un mosaico, ogni pezzo con il suo pezzetto di figura. Ma da ogni punto della candela la luce arriva su tutta la lente. Mettiamolo alla prova.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa confronti?', 'Come si mette alla prova il mito?', 'Qual è il confronto onesto?'),
          options: [T('la lente scoperta e coperta', 'stessa lente, scoperta e coperta a metà', 'la stessa lente, prima scoperta e poi coperta'), T('due lenti diverse, una grande e una piccola', 'una lente grande e una piccola', 'lenti diverse, così si vedono molti più casi insieme'), T('niente: basta pensarci un po’', 'si chiede a un ottico', 'si contano le candele che servono')],
          answer: 0,
          explain: T('Giusto: si cambia solo il cartoncino.', 'Esatto: così si vede l’effetto del solo cartoncino.', 'Esatto: una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova la lente scoperta, poi coperta sopra e coperta sotto.', 'Prova la lente scoperta, e coperta a metà sopra e sotto.'),
          need: [
            { when: "copri == 'niente'", try: { copri: 'niente' }, msg: T('Prova la lente scoperta.', 'Manca la lente scoperta.') },
            { when: "copri == 'sopra'", try: { copri: 'sopra' }, msg: T('Ora coprila sopra.', 'Manca la lente coperta sopra.') },
            { when: "copri == 'sotto'", try: { copri: 'sotto' }, msg: T('Ora coprila sotto.', 'Manca la lente coperta sotto.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con metà lente coperta, sullo schermo la candela…', 'Coprendo metà lente, sullo schermo…', 'Che cosa cambia coprendo metà lente?'),
          options: [T('c’è tutta, ma più scura', 'c’è tutta la candela, più scura', 'solo la luminosità: l’immagine resta intera'), T('c’è solo per metà', 'resta metà candela', 'sparisce la metà corrispondente dell’immagine'), T('sparisce del tutto, non c’è più', 'non c’è più niente', 'l’immagine si sposta di lato')],
          answer: 0,
          explain: T('Giusto: tutta, solo più scura!', 'Esatto: intera, con metà della luce.', 'Esatto: arriva metà della luce, ma da ogni punto della candela.'),
        },
        {
          kind: 'q',
          text: T('Perché la candela resta intera?', 'Perché ogni metà della lente forma l’immagine intera?', 'Che cosa vuol dire che la luce di ogni punto della candela arriva su tutta la lente?'),
          options: [T('ogni pezzo di lente la vede tutta', 'da ogni punto della candela arrivano raggi su tutta la lente', 'che ogni pezzo di lente, da solo, forma l’immagine intera'), T('la lente si aggiusta da sola, senza aiuto', 'perché il cartoncino è un po’ trasparente e lascia passare la luce', 'che la lente funziona soltanto se è intera, senza nessun pezzo coperto'), T('per una magia segreta della lente', 'perché lo schermo si ricorda l’immagine di prima, anche al buio', 'che la candela fa luce solo verso il centro della lente, non ai bordi')],
          answer: 0,
          explain: T('Giusto: ogni pezzo di lente porta luce da tutta la candela.', 'Esatto: i raggi che passano si incontrano comunque nello stesso punto.', 'Esatto: per questo anche un obiettivo con un granello di polvere fa foto intere.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Quanta luce arriva.'),
          vals: { cop: [25, 50, 75] }, calc: '100 - cop', unit: '%', tol: 0.5,
          ask: T(null,
            'Un cartoncino copre il <b>{cop} %</b> della lente. Che percentuale della luce arriva sullo schermo?',
            'Lente coperta al <b>{cop} %</b>: quanta luce arriva sullo schermo, in percentuale?'),
          explain: T(null, 'Esatto: passa la luce della parte scoperta, il {ans:0} %. L’immagine resta intera.', 'Esatto: il {ans:0} %, con l’immagine intera.'),
        },
        {
          kind: 'q',
          text: T('Allora il mito…', 'Che cosa concludi sul mito della mezza lente?', 'Il mito della mezza lente: il verdetto?'),
          options: [T('è falso: la candela resta intera', 'falso: l’immagine resta intera, solo più scura', 'falso: cambia solo la quantità di luce'), T('è vero: resta metà candela', 'vero: metà lente, quindi metà immagine, sempre', 'vero: ogni metà forma la sua metà'), T('è vero solo coprendo la metà di sopra', 'vero a metà: dipende da quale metà copri', 'vero, ma solo per le lenti grandi')],
          answer: 0,
          explain: T('Mito smontato! Con metà lente la candela si vede tutta, solo più scura.', 'Mito smontato: l’immagine resta intera, con metà della luce.', 'Mito smontato: ogni pezzo di lente forma l’immagine intera; coprirne una parte toglie solo luce.'),
        },
      ],
      hints: [T('Guarda bene lo schermo: manca un pezzo di candela?', 'Da ogni punto della candela i raggi arrivano su tutta la lente.', 'I raggi che restano si incontrano ancora nello stesso punto.')],
      solution: T(
        'Con metà lente la candela si vede tutta, ma più scura.',
        'Falso: l’immagine resta intera, con metà della luce.',
        'Il mito è falso: coprire una parte della lente toglie luce, non pezzi di immagine.'),
    },
  ],
};
