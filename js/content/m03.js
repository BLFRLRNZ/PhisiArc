// M03 · Vettori, moto nel piano e proiettili. Simulazioni: la barca sul fiume (vettori), poi il cannone.
import { T, pick } from '../util.js';
import { t as tr } from '../i18n.js';

export default {
  id: 'M03',
  title: 'Vettori e proiettili',
  levels: [
    {
      id: 'm03-v1', kind: 'lezione', title: 'Frecce che si sommano',
      sim: 'river', params: { vb: 4, vc: 0, ang: 0 }, controls: ['vb', 'vc'],
      intro: T(
        'Prima di lanciare palle, attraversiamo un <b>fiume</b> in barca! La barca punta dritta verso il pontile di fronte. Ma l’acqua scorre…',
        'Una velocità non è solo un numero: ha anche una <b>direzione</b>. Per questo si disegna con una freccia, che si chiama <b>vettore</b>. La barca punta dritta verso il pontile, ma la corrente la trascina di lato.',
        'Le velocità sono <b>vettori</b>: hanno intensità, direzione e verso, e si sommano come frecce, punta contro coda. Barca e corrente: quale sarà il moto vero?'),
      steps: [
        { kind: 'free', runs: 2, text: T('Fai una traversata <b>senza corrente</b>, poi una <b>con la corrente</b>.', 'Attraversa una volta con corrente 0 e una volta con la corrente accesa.') },
        {
          kind: 'q',
          text: T('La prua della barca punta dritta verso il pontile di fronte. Ma ora l’acqua del fiume scorre e spinge la barca di lato mentre attraversa. Guarda le frecce: dove arriva la barca?', 'La barca spinge dritta verso l’altra riva (freccia arancione), la corrente la trascina di lato (freccia azzurra). Le due spinte agiscono insieme. In che direzione si muove davvero la barca?', 'Un osservatore sulla riva vede insieme due velocità: quella della barca rispetto all’acqua e quella dell’acqua rispetto alla riva. Qual è la velocità effettiva della barca rispetto alla riva?'),
          options: [
            T('Più in là del pontile, spinta dall’acqua', 'In diagonale: lungo la freccia bianca, somma delle altre due', 'La somma vettoriale di velocità della barca e della corrente'),
            T('Dritta al pontile', 'Dritta verso il pontile, come punta la prua', 'Quella della barca: la corrente non conta'),
            T('Torna indietro', 'Lungo la corrente', 'Quella della corrente'),
          ],
          answer: 0,
          explain: T(
            'Giusto! La barca va avanti <b>e</b> la corrente la porta di lato: le due spinte si sommano. La freccia bianca mostra dove va davvero.',
            'Giusto: la velocità vera è la <b>somma dei vettori</b>. Si mette la freccia della corrente in coda a quella della barca: la freccia bianca, dalla partenza alla punta, è la somma.',
            'Giusto: v = v_barca + v_corrente, somma vettoriale. Con le due frecce perpendicolari l’intensità si trova con Pitagora.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T('Somma due frecce perpendicolari.'),
          gen: () => {
            const [b, c, v] = pick([[4, 3, 5], [3, 4, 5], [8, 6, 10], [6, 8, 10], [5, 12, 13]]);
            return { text: tr('La barca va a <b>{b} m/s</b> verso la riva opposta, mentre la corrente la spinge di lato a <b>{c} m/s</b>. Le due frecce formano un angolo retto, e la velocità vera è la diagonale. Quanto vale?', { b, c }), ans: v, tol: 0.05, unit: 'm/s', explain: tr('Esatto: le frecce sono perpendicolari, quindi √({b}² + {c}²) = √{q} = {v} m/s. Non {s}: le frecce non sono nella stessa direzione.', { b, c, q: b * b + c * c, v, s: b + c }) };
          },
        },
      ],
      hints: [T('Guarda le tre frecce sulla barca: arancione, azzurra e bianca.', 'Metti la freccia azzurra in coda all’arancione: dove arriva la punta?'), T('Segui la freccia bianca: la barca va dove punta lei.', 'v = √(v_barca² + v_corrente²).')],
      solution: T('Arriva più in là del pontile: la corrente la porta di lato.', 'In diagonale: la velocità vera è la somma vettoriale. Con frecce perpendicolari, v = √(a² + b²).'),
    },
    {
      id: 'm03-v2', kind: 'prevedi', title: 'Il fiume non ruba tempo',
      sim: 'river', params: { vb: 4, vc: 0, ang: 0 }, controls: ['ang'],
      intro: T(
        'Una domanda furba: se il fiume scorre, la barca ci mette <b>di più</b> ad attraversarlo?',
        'La corrente spinge la barca di lato. Ma cambia il <b>tempo</b> della traversata? Prevedi, poi guarda.',
        'Moti perpendicolari e indipendenti: la corrente cambia il tempo di traversata? Prevedi.'),
      steps: [
        {
          kind: 'q', predict: [{ vc: 0, ang: 0 }, { vc: 3, ang: 0 }],
          text: T('Prima la barca attraversa il fiume senza corrente, poi con una corrente forte che la spinge di lato. In tutte e due le traversate la barca spinge verso l’altra riva allo stesso modo. Con la corrente, quanto tempo ci mette ad arrivare dall’altra parte?', 'Prima una traversata senza corrente, poi una con corrente di 3 m/s, perpendicolare alla direzione della barca. La velocità della barca verso l’altra riva resta la stessa. Il tempo della seconda traversata…'),
          options: [T('Lo stesso tempo', 'è uguale'), T('Di più', 'è maggiore'), T('Di meno', 'è minore')],
          answer: 0,
          explain: T(
            'Lo stesso: 10 secondi! La corrente la porta di lato, ma non la frena verso la riva. Sono due moti separati.',
            'Uguale, 10 s: la corrente è perpendicolare e non cambia la velocità verso l’altra riva. I due moti sono <b>indipendenti</b>, come nel volo di una palla: avanti e su-giù.',
            'Uguale: t = 40 m / 4 m/s = 10 s. Le componenti perpendicolari sono indipendenti: lo stesso principio di Galileo per i proiettili.'),
        },
        {
          kind: 'tune', rounds: 1, set: { vc: 2 },
          text: T('Ora tocca a te: gira la <b>prua controcorrente</b> e porta la barca dritta al pontile.', 'Inclina la prua controcorrente quanto basta per arrivare dritto al pontile.'),
          gen: () => ({ text: tr('Arriva al pontile (al massimo 1,5 m di scarto).') }),
          solve: () => ({ ang: 30 }),
          check: (res, tg, lens) => {
            if (Math.abs(res.drift) <= 1.5) return { ok: true, msg: tr('Al pontile! Ci hai messo {t:1} s: un po’ di più, perché parte della spinta va contro la corrente.', { t: res.t }) };
            return { ok: false, msg: res.drift > 0 ? tr('Sei finito {d:1} m a valle.', { d: res.drift }) + ' ' + (lens === 'e' ? tr('Gira di più la prua.') : tr('Serve un angolo maggiore.')) : tr('Sei finito {d:1} m a monte.', { d: -res.drift }) + ' ' + (lens === 'e' ? tr('Gira un po’ meno.') : tr('Angolo troppo grande.')) };
          },
        },
      ],
      hints: [T('La corrente spinge di lato: cambia quanto manca all’altra riva?', 'Con la prua girata, una parte della spinta della barca deve annullare la corrente.'), T('Circa 30 gradi.', 'sin θ = corrente / barca = 2/4: θ = 30°.')],
      solution: T('Stesso tempo. Per il pontile serve una prua girata di circa 30°.', 'Il tempo non cambia. Per arrivare dritto: sin θ = 2/4, θ = 30°.'),
    },
    {
      id: 'm03-1', kind: 'lezione', title: 'Il volo della palla',
      sim: 'cannon', params: { ang: 45, v: 20, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'Questo è un <b>cannone</b> che spara palline. Scegli quanto inclinarlo e quanto forte sparare, poi premi ▶ Lancia.',
        'Un <b>proiettile</b> è un oggetto lanciato che poi vola soltanto sotto l’effetto della gravità. Scegli <b>angolo</b> e <b>velocità di lancio</b> e osserva la traiettoria.',
        'Un pallone calciato, un getto d’acqua, un salto in lungo: sono tutti <b>proiettili</b>. Scegli angolo e velocità e osserva il volo.'),
      steps: [
        { kind: 'free', runs: 2, text: T('Fai almeno due lanci, cambiando qualcosa.', 'Fai almeno due lanci con valori diversi. Le traiettorie precedenti restano in grigio.') },
        {
          kind: 'q',
          text: T('Hai sparato qualche palla e ognuna ha lasciato una scia nel cielo: sale, arriva in cima e scende. Guarda la scia dalla partenza all’arrivo. Che forma disegna?', 'La <b>traiettoria</b> è la linea che la palla disegna nell’aria durante il volo. Guarda le scie dei tuoi lanci, anche quelle grigie dei lanci di prima. Che forma ha la traiettoria?', 'Lo zampillo di una fontana, un pallone calciato, la palla del cannone: segui la scia dalla partenza all’arrivo. Che curva disegnano tutti?'),
          options: [
            T('Una linea dritta in diagonale', 'Una retta'),
            T('Un pezzo di cerchio', 'Un arco di circonferenza'),
            T('Una curva: sale e poi scende', 'Una parabola'),
          ],
          answer: 2,
          explain: T(
            'Esatto: una curva come un ponte, o come lo zampillo di una fontana.',
            'Esatto: una <b>parabola</b>, simmetrica tra salita e discesa (se trascuriamo l’aria).',
            'Esatto: una <b>parabola</b>. La vedi negli zampilli delle fontane e nei tiri a canestro.'),
          wrong: T('Guarda bene la linea che resta sullo schermo.', 'Osserva le traiettorie disegnate: sono dritte? Sono archi di cerchio regolari?'),
        },
      ],
      hints: [T('Fai un lancio e guarda la linea colorata.', 'Pensa allo zampillo di una fontana.')],
      solution: T('Una curva come un ponte.', 'Una parabola.'),
    },
    {
      id: 'm03-2', kind: 'lezione', title: T('Più forte, più lontano', 'Due moti in uno'),
      sim: 'cannon', params: { ang: 45, v: 20, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'Cosa succede se spari <b>più forte</b>? Proviamo!',
        'Il volo di un proiettile è fatto di <b>due moti insieme</b>: in orizzontale la palla va a velocità costante, in verticale sale, rallenta e ricade come in caduta libera.',
        'Galileo capì che il volo di un proiettile è la somma di <b>due moti indipendenti</b>: uno orizzontale a velocità costante e uno verticale accelerato dalla gravità.'),
      steps: [
        {
          kind: 'q', only: ['e'],
          text: 'Il cannone resta inclinato allo stesso modo, ma la seconda volta spari la palla <b>più forte</b>, cioè più veloce. Prima di provare, prevedi: dove arriva la palla rispetto a prima?',
          options: ['Più vicino', 'Più lontano', 'Nello stesso punto'],
          answer: 1,
          predict: [{ ang: 45, v: 15 }, { ang: 45, v: 30 }],
          explain: 'Giusto: <b>lanci più forte, va più lontano</b>!',
        },
        { kind: 'free', runs: 1, only: ['e'], text: 'Ora prova tu: trova un lancio che arriva vicino ai 100 metri.' },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'La velocità della palla si può dividere in due parti, dette <b>componenti</b>: una orizzontale, in avanti, e una verticale, su e giù. Senza aria, in orizzontale nessuna forza spinge o frena la palla. Durante il volo, la componente orizzontale della velocità…', 'La velocità della palla si divide in due componenti: orizzontale e verticale. In orizzontale, senza aria, non agisce nessuna forza. Mentre la palla vola, la sua velocità orizzontale…'),
          options: ['aumenta', 'resta costante', 'diminuisce fino a zero'],
          answer: 1,
          explain: T(null, 'Esatto: in orizzontale non agisce nessuna forza, quindi vₓ = v·cos θ resta costante. Si muove di moto rettilineo uniforme, come le macchinine della gara.', 'Esatto: in orizzontale nessuna forza la spinge o la frena, quindi va sempre alla stessa velocità.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Ora guarda la parte su e giù del moto. In verticale agisce la gravità, che tira sempre verso il basso: la palla parte verso l’alto, sale e poi ricade. Come si comporta la componente <b>verticale</b> della velocità durante il volo?', 'In verticale agisce la gravità, che la frena mentre sale e la accelera mentre scende. Come cambia la velocità <b>verticale</b> durante il volo?'),
          options: ['resta costante per tutto il volo', 'cresce sempre, dall’inizio alla fine', 'cala in salita, è zero in cima, poi cresce'],
          answer: 2,
          explain: T(null, 'Esatto: in verticale c’è l’accelerazione g = 9,81 m/s² verso il basso, come nella caduta libera. Nel punto più alto vᵧ = 0, ma vₓ no: la palla non è mai ferma.', 'Esatto: in verticale comanda la gravità, come nella caduta libera. In cima la palla per un istante non sale né scende, ma continua ad avanzare.'),
        },
        {
          kind: 'run', only: ['s', 'c'],
          text: T(null, 'Guarda: stessa velocità, angolo sempre più alto. Cambia come si dividono i due moti.'),
          seq: [{ ang: 20, v: 25 }, { ang: 45, v: 25 }, { ang: 70, v: 25 }],
          explain: T(null, 'Angolo basso: tanta vₓ ma poco tempo in volo. Angolo alto: lungo volo ma poca vₓ. La <b>gittata</b>, cioè la distanza a cui la palla atterra, dipende da entrambi.', 'Angolo basso: va veloce in avanti ma atterra presto. Angolo alto: resta in aria a lungo ma avanza piano.'),
        },
      ],
      hints: [T('Pensa a quando tiri un sasso piano e quando lo tiri forte.', 'Quali forze agiscono sulla palla in volo, se trascuriamo l’aria? In che direzione?'), T('Prova lo stesso angolo con due velocità diverse.', 'C’è solo la gravità, che tira verso il basso: cosa cambia allora in orizzontale?')],
      solution: T('Più forte lanci, più lontano arriva.', 'In orizzontale velocità costante (vₓ = v·cos θ); in verticale moto accelerato con g, come la caduta libera.'),
    },
    {
      id: 'm03-3', kind: 'prevedi', title: 'L’angolo migliore',
      sim: 'cannon', params: { ang: 45, v: 25, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'Una gara di cannoni: vince chi manda la palla più lontano. Indovina prima di sparare!',
        'Velocità fissa: 25 m/s. Cambia solo l’<b>angolo</b>. Prima la previsione, poi l’esperimento.',
        'Stessa velocità di lancio, 25 m/s, angoli diversi. Quale angolo dà la <b>gittata</b> massima?'),
      steps: [
        {
          kind: 'q', clear: true,
          text: T('Ora la velocità del cannone è sempre la stessa: cambia solo quanto lo inclini. Se lo tieni quasi piatto la palla cade subito, se lo punti quasi dritto in su sale tanto ma va poco avanti. Quale angolo manda la palla più lontano?', 'La <b>gittata</b> è la distanza dal cannone al punto in cui la palla tocca terra. Con la velocità fissa a 25 m/s, l’angolo decide come la velocità si divide fra avanti e in alto. Quale angolo dà la gittata maggiore?'),
          options: [T('30°', '30°'), T('80°', '80°'), T('60°', '60°'), T('45°', '45°')],
          answer: 3,
          predict: [{ ang: 30, v: 25 }, { ang: 45, v: 25 }, { ang: 60, v: 25 }, { ang: 80, v: 25 }],
          explain: T(
            'A <b>45°</b>, a metà strada tra piatto e dritto in su, la palla va più lontano!',
            '<b>45°</b>: circa 64 m. La gittata è R = v²·sin(2θ)/g, massima quando sin(2θ) = 1, cioè θ = 45°.',
            '<b>45°</b>, circa 64 m: il compromesso migliore tra andare avanti e restare in aria. (Con l’aria vera, per un pallone conviene un po’ meno di 45°.)'),
        },
        {
          kind: 'q', only: ['s', 'c'], clear: true,
          text: T(null, 'Ora due lanci alla stessa velocità, 25 m/s: uno a 30°, più basso, e uno a 60°, più alto. Nota che 30 e 60 sommati fanno 90. Prevedi: dove atterrano le due palle?', 'Due lanci alla stessa velocità: uno teso, a 30°, e uno a campanile, a 60°. Il primo corre di più in avanti, il secondo resta in aria più a lungo. Dove atterrano?'),
          options: ['30° va più lontano', 'Atterrano nello stesso punto', '60° va più lontano'],
          answer: 1,
          predict: [{ ang: 30, v: 25 }, { ang: 60, v: 25 }],
          explain: T(null, 'Nello stesso punto, circa 55 m: sin(60°) = sin(120°). Angoli <b>complementari</b> (che sommati fanno 90°) danno la stessa gittata, ma a 60° la palla vola più in alto e più a lungo.', 'Nello stesso punto, circa 55 m: due angoli che sommati fanno 90° danno la stessa gittata. Quello alto però resta in aria più a lungo.'),
        },
      ],
      hints: [T('Troppo piatto, la palla cade subito. Troppo dritto, va su e torna giù. E a metà?', 'Ragiona sui due moti: un angolo basso dà poco tempo di volo, uno alto poca velocità orizzontale.')],
      solution: T('45°.', '45°, perché R = v²·sin(2θ)/g è massima per 2θ = 90°. 30° e 60° danno la stessa gittata.'),
    },
    {
      id: 'm03-4', kind: 'costruisci', title: 'Il tiro al bersaglio del parco',
      sim: 'cannon', params: { ang: 45, v: 20, xmax: 130, target: 50, tw: 3 }, controls: ['ang', 'v'],
      intro: T(
        'Nuovo gioco per il parco: il <b>tiro al bersaglio</b>! Colpisci la bandierina con il cannone.',
        'Nuovo pezzo del parco: il <b>tiro al bersaglio</b>. Scegli angolo e velocità per centrare la bandierina (devi atterrare entro 3 m dal centro).',
        'Nuovo pezzo del parco: il <b>tiro al bersaglio</b>. Usa quello che sai sulla gittata per fare centro.'),
      piece: { id: 'bersaglio', name: 'Il tiro al bersaglio', desc: 'Un cannone che fa centro alla distanza che scegli tu.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Regola il cannone e spara.', 'Regola angolo e velocità e spara. Il secondo bersaglio sarà in un altro punto.'),
          gen: (lens, r) => {
            const d = Math.round(30 + Math.random() * 60);
            const tw = lens === 'e' ? 5 : 3;
            return { d, set: { target: d, tw }, text: tr('Il bersaglio è a <b>{d} metri</b>.', { d }) };
          },
          solve: (tg) => ({ ang: 45, v: Math.sqrt(tg.d * 9.81) }),
          check: (res, tg, lens) => {
            if (res.hit) return { ok: true, msg: tr('Atterrata a {x:1} m. Centro!', { x: res.x }) };
            const d = res.x - tg.d;
            return {
              ok: false,
              msg: d < 0
                ? tr('Troppo corto di {d:1} m.', { d: -d }) + ' ' + (lens === 'e' ? tr('Spara più forte!') : tr('Cosa puoi cambiare per allungare il tiro?'))
                : tr('Troppo lungo di {d:1} m.', { d }) + ' ' + (lens === 'e' ? tr('Spara più piano!') : tr('Cosa puoi cambiare per accorciare il tiro?')),
            };
          },
        },
      ],
      hints: [
        T('Metti il cannone a metà, a 45°, e cambia solo quanto forte spari.', 'Conviene fissare una delle due variabili e regolare solo l’altra. Quale angolo rende i conti più semplici?'),
        T('Se la palla cade prima della bandierina, spara più forte.', 'A 45°: R = v²/g, quindi v = √(R·g).'),
      ],
      solution: T(
        'Lascia l’angolo a 45° e cambia quanto forte spari: circa 17 per 30 m, 22 per 50 m, 26 per 70 m, 30 per 90 m.',
        'R = v²·sin(2θ)/g. A 45°: v = √(R·g). Per 50 m → v ≈ 22 m/s; per 70 m → 26 m/s; per 90 m → 29,7 m/s.'),
    },
    {
      // Resistenza dell'aria: le regole "senza aria" (45°, angoli complementari) smettono di valere.
      id: 'm03-aria', kind: 'prevedi', title: 'Il mito dei 45 gradi',
      sim: 'cannon', params: { ang: 45, v: 35, xmax: 60, air: true }, controls: ['ang', 'air'],
      intro: T(
        'Finora la palla volava come se l’aria non ci fosse. Ma l’aria c’è, e <b>frena</b>! Accendiamola e vediamo che cosa cambia.',
        'Finora abbiamo trascurato l’aria. Ora la accendiamo: frena la palla, tanto più quanto più va veloce. La linea tratteggiata azzurra è il volo <b>senza aria</b>, per confronto.',
        'Tutto quello che abbiamo visto vale nel vuoto. Con l’<b>attrito dell’aria</b>, che cresce con il quadrato della velocità, le regole cambiano. Il 45° resta il migliore?'),
      steps: [
        {
          kind: 'q', clear: true,
          text: T('Lo stesso identico lancio, stesso angolo e stessa spinta, prima senza aria e poi con l’aria che frena la palla mentre vola. La linea tratteggiata mostra il volo senza aria. Che cosa succede con l’aria?', 'Lancio a 45° e 35 m/s, prima nel vuoto e poi con l’aria. L’aria frena la palla tanto più quanto più va veloce, e la frena per tutto il volo. Che cosa prevedi per la gittata?'),
          options: [T('Con l’aria va più lontano', 'Con l’aria la gittata aumenta'), T('Va lontano uguale', 'La gittata non cambia'), T('Con l’aria va meno lontano', 'Con l’aria la gittata diminuisce')],
          answer: 2,
          predict: [{ ang: 45, v: 35, air: false }, { ang: 45, v: 35, air: true }],
          explain: T(
            'Molto meno lontano: da circa 125 m a circa 38 m! L’aria frena la palla per tutto il viaggio.',
            'Da circa 125 m a circa 38 m: la nostra palla è leggera, come un pallone da spiaggia, e l’aria la frena molto. La traiettoria non è più una parabola: la discesa è più ripida della salita.'),
        },
        {
          kind: 'q', only: ['s', 'c'], clear: true,
          text: T(null, 'Senza aria, i lanci a 30° e a 60° atterravano nello stesso punto. Ma il lancio a 60° sale più in alto e resta in volo più a lungo, quindi l’aria ha più tempo per frenarlo. Con l’aria, che cosa succede?'),
          options: ['30° va più lontano', 'Atterrano ancora nello stesso punto', '60° va più lontano'],
          answer: 0,
          predict: [{ ang: 30, v: 35, air: true }, { ang: 60, v: 35, air: true }],
          explain: T(null,
            'A 30° circa 39 m, a 60° solo 31 m. Il lancio alto resta in aria più a lungo, e più tempo in volo vuol dire più tempo per essere frenato. La regola degli angoli complementari vale solo nel vuoto.',
            '30° ≈ 39 m, 60° ≈ 31 m: la simmetria sin(2θ) si rompe. Il lancio alto passa più tempo in aria e perde più velocità orizzontale.'),
        },
        {
          kind: 'tune', rounds: 1,
          text: T('Con l’aria accesa, scegli l’angolo e spara.', 'Velocità fissa, 35 m/s, aria accesa: scegli l’angolo.'),
          ask: T('Batti il record del parco: almeno <b>38,5 m</b>! A 45° non ci arrivi…', 'Record da battere: <b>38,5 m</b> (a 45° si fanno 38,2 m).'),
          measure: 'x', goal: '39', tol: 0.6,
          ok: T('{got:1} m: record battuto! Con l’aria conviene un angolo un po’ più basso di 45°.', '{got:1} m: record! Con l’aria l’angolo migliore è più basso di 45°, qui circa 37°.'),
          low: T('{got:1} m: non basta. Prova un altro angolo, più basso o più alto.', '{got:1} m: non basta. In che direzione ti conviene spostare l’angolo, rispetto a 45°?'),
          high: T('{got:1} m: così è facile, l’aria è spenta! Riaccendila e riprova.', '{got:1} m: è il volo nel vuoto. Riaccendi l’aria.'),
          solve: { ang: '37', air: 'true' },
        },
      ],
      hints: [
        T('L’aria frena di più quando la palla resta in volo a lungo. Quali lanci restano in aria di più?', 'Il lancio alto passa più tempo in volo: che effetto ha l’aria su di lui?'),
        T('Prova 35° o 40°.', 'Prova tra 35° e 40°.'),
      ],
      solution: T('Con l’aria la palla va meno lontano, e l’angolo migliore è più basso di 45°: circa 37°.', 'Con l’aria: gittata molto minore, angoli complementari non più equivalenti, angolo ottimale sotto i 45° (qui circa 37°).'),
    },
    {
      id: 'm03-5', kind: 'ripasso', title: T('Ripasso di frecce e lanci', 'Ripasso di vettori e proiettili'),
      intro: T('Ripassiamo frecce, lanci e aria!', 'Ripasso: vettori, proiettili e resistenza dell’aria.'),
      steps: [
        {
          // vettori: i due moti della barca sono indipendenti (m03-v2)
          kind: 'q', text: T('Una barca attraversa il fiume puntando dritta alla riva di fronte. Poi arriva la corrente, che la spinge di lato. Per arrivare dall’altra parte ci mette…', 'Una barca punta dritta verso la riva opposta a 4 m/s, su un fiume largo 40 m. Poi arriva una corrente di 3 m/s, perpendicolare alla barca. Il tempo di traversata…'),
          options: [T('lo stesso tempo', 'resta 10 s'), T('più tempo', 'sale a 13 s'), T('meno tempo', 'scende a 8 s')],
          answer: 0, explain: T('Giusto: la corrente la sposta di lato, ma non la frena verso la riva.', 'Giusto: i due moti sono indipendenti. La corrente cambia dove arrivi (30 m più a valle), non quando.'),
        },
        {
          // aria: gittata minore e angolo migliore più basso (m03-aria)
          kind: 'q', text: T('Spari la stessa palla due volte, nello stesso modo: una volta senza aria, una volta con l’aria. Con l’aria la palla arriva…', 'Stesso lancio, con e senza aria. L’aria frena la palla per tutto il volo. Che cosa succede alla gittata e all’angolo migliore?'),
          options: [T('meno lontano', 'Gittata minore, angolo migliore sotto i 45°'), T('più lontano', 'Gittata maggiore, angolo migliore sopra i 45°'), T('lontano uguale', 'Non cambia niente: resta 45°')],
          answer: 0, explain: T('Giusto: l’aria frena la palla per tutto il viaggio.', 'Giusto: l’aria accorcia il volo, e conviene un lancio un po’ più basso, che resta in aria meno tempo.'),
        },
        {
          kind: 'q', text: T('Hai un cannone che spara sempre alla stessa velocità e vuoi mandare la palla il più lontano possibile, senza aria. Puoi solo scegliere quanto inclinarlo. Come lo inclini?', 'Con la stessa velocità di lancio e senza aria, l’angolo decide quanta velocità va in avanti e quanta in alto. Quale angolo dà la gittata massima?'),
          options: [T('Quasi piatto', '15°'), T('Quasi dritto in su', '75°'), T('A metà', '45°')],
          answer: 2, explain: T('Giusto: a metà, a 45°.', 'Giusto: R = v²·sin(2θ)/g è massima a 45°.'),
        },
        {
          kind: 'q', only: ['s', 'c'], text: 'La palla sale, arriva in cima e poi riscende. Ricorda le due componenti della velocità: quella orizzontale resta costante, quella verticale cambia. Nel punto più alto della traiettoria, la velocità della palla è…',
          options: ['zero', 'solo orizzontale', 'solo verticale'],
          answer: 1, explain: 'Esatto: vᵧ = 0, ma vₓ resta. La palla in cima non è mai ferma.',
        },
        {
          kind: 'q', text: T('Una palla viene lasciata cadere dalla cima di una torre: parte ferma e scende fino a terra. Mentre scende, va…', 'In caduta libera la velocità cresce di circa 9,8 m/s ogni secondo. Una palla parte ferma: dopo 2 s la sua velocità è circa…'),
          options: [T('sempre più piano', '9,8 m/s'), T('sempre più veloce', '19,6 m/s'), T('sempre uguale', '39,2 m/s')],
          answer: 1, explain: T('Esatto: sempre più veloce.', 'Esatto: v = g·t = 9,81 × 2 ≈ 19,6 m/s.'),
        },
      ],
      hints: [T('Ripensa alla barca, al cannone e all’aria.')],
    },
    {
      // Boss: applica "due moti in uno" a una situazione nuova (lancio da una torre), invece di rifare il 45° di m03-3.
      id: 'm03-6', kind: 'boss', title: 'Il mito della palla che vola',
      sim: 'cannon', params: { ang: 0, v: 15, xmax: 60, h0: 20, drop: true }, controls: [],
      intro: T(
        'Sono Vetrino. Un ragazzo in cima alla torre del parco dice: <i>“Se lancio la palla in avanti, resta in aria molto di più di una lasciata cadere!”</i>. Sarà vero?',
        'Sono Vetrino. Un giocatore giura: <i>“Una palla lanciata in orizzontale da una torre resta in aria più a lungo di una lasciata cadere”</i>. Sembra sensato: fa più strada. O no?',
        'Sono Vetrino. <i>“Un proiettile sparato in orizzontale cade più tardi di uno lasciato cadere”</i>: lo pensano in tanti. Io non ti dico niente: chiedi all’esperimento.'),
      steps: [
        {
          kind: 'q', text: T('Il mito dice che una palla lanciata in avanti da una torre resta in aria più a lungo di una lasciata cadere. Per controllarlo, le due palle devono partire dalla stessa altezza nello stesso momento, e deve cambiare solo come partono. Quale esperimento ci serve?', 'Il mito: «lanciata in orizzontale, la palla resta in volo più a lungo». Per un confronto onesto, altezza e istante di partenza devono essere uguali, e cambiare solo la velocità orizzontale. Quale esperimento mette alla prova il mito?'),
          options: [
            T('Dalla stessa altezza, insieme: una lanciata in avanti e una lasciata cadere', 'Stessa altezza e stesso istante: una lanciata in orizzontale, una lasciata cadere'),
            T('Una lanciata dalla torre e una lasciata cadere da terra', 'Una lanciata da 20 m e una lasciata cadere da 5 m'),
            T('Una palla sola lanciata in avanti, guardata bene', 'Un solo lancio in orizzontale, cronometrato con cura'),
          ],
          answer: 0,
          explain: T('Giusto: stessa altezza, stesso momento. Cambia solo la spinta in avanti.', 'Giusto: l’unica differenza è la velocità orizzontale.'),
          wrong: T('Mmh, così cambiano due cose insieme, oppure non confronti niente. Come capiresti chi ha ragione?', 'Così non isoli la velocità orizzontale. A cosa daresti il merito della differenza?'),
        },
        {
          kind: 'q', clear: true,
          text: T('Dalla cima di una torre alta 20 metri, nello stesso istante, una palla viene lanciata in avanti e l’altra viene solo lasciata cadere. Quella lanciata fa molta più strada. Prima di guardare: quale tocca terra per prima?', 'Da 20 m, nello stesso istante: una palla lanciata in orizzontale a 15 m/s, l’altra lasciata cadere. Ripensa ai due moti indipendenti, avanti e su-giù. Che cosa prevedi sui tempi di arrivo?'),
          options: [T('Quella lasciata cadere', 'Prima quella lasciata cadere'), T('Quella lanciata in avanti', 'Prima quella lanciata'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 2,
          predict: [{ ang: 0, v: 15, h0: 20, drop: true }],
          explain: T(
            'Insieme! I puntini rosa e quelli bianchi scendono alla stessa altezza in ogni istante.',
            'Insieme, in circa 2,02 s: t = √(2h/g) = √(40/9,81). Il moto orizzontale e quello verticale sono indipendenti: in verticale le due palle fanno la stessa caduta libera.',
            'Insieme, in circa 2 secondi. La spinta in avanti non cambia la caduta: in verticale è la stessa per tutte e due.'),
        },
        {
          kind: 'q', clear: true,
          text: T('Ora lanci la palla in avanti molto più forte, al doppio della velocità, mentre l’altra viene ancora solo lasciata cadere. Che cosa succede ai tempi di arrivo?', 'Stessa torre, ma ora il lancio orizzontale è a 30 m/s invece di 15. La palla andrà molto più lontano. E il tempo di volo, rispetto alla palla lasciata cadere?'),
          options: [T('Allora resta in aria di più', 'Resta in aria il doppio'), T('Arrivano ancora insieme', 'Arrivano ancora insieme'), T('Allora cade prima', 'Cade in metà tempo')],
          answer: 1,
          predict: [{ ang: 0, v: 30, h0: 20, drop: true }],
          explain: T('Ancora insieme! Va più lontano, ma ci mette lo stesso tempo.', 'Stesso tempo, 2,02 s: raddoppia la gittata (da 30 a 61 m), non il tempo di volo.', 'Stesso tempo: va il doppio più lontano, ma la caduta è sempre quella.'),
        },
        {
          kind: 'q', text: T('Il ragazzo del mito diceva che la palla lanciata in avanti resta in aria più a lungo, perché fa più strada. Hai visto le due palle arrivare a terra. Aveva ragione?', 'Hai visto che, lanciando in orizzontale piano o forte, la palla tocca terra insieme a quella lasciata cadere. Che cosa concludi sul tempo di volo?'),
          options: [
            T('Sì: lanciata in avanti resta in aria di più', 'Il mito è vero: più veloce, più tempo in volo'),
            T('Dipende da quanto pesa la palla', 'Dipende dalla massa del proiettile'),
            T('No: cadono insieme, anche lanciando forte', 'Il mito è falso: il tempo dipende solo dall’altezza'),
          ],
          answer: 2,
          explain: T('Mito smontato! La spinta in avanti fa andare lontano, ma non rallenta la caduta.', 'Mito smontato: in orizzontale v costante, in verticale caduta libera. I due moti non si disturbano.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi altezza e spinta insieme, a chi dai il merito?'), T('Vetrino chiede: guarda i puntini a tempi uguali. Sono alla stessa altezza?', 'Vetrino chiede: la velocità orizzontale entra nella formula della caduta?')],
      solution: T('Stessa altezza, stesso istante: arrivano insieme, anche lanciando più forte. Il mito è falso.', 'Da 20 m: t = √(2h/g) ≈ 2,02 s per tutte e due, a 15 o 30 m/s. Il mito è falso.'),
    },
  ],
};
