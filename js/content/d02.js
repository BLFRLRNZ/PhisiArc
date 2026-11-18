// D02 · Attrito e piani inclinati. Simulazione: la rampa (ramp.js), con una cassa e i blocchi della massa,
// su ghiaccio, legno o gomma: tirata su un pavimento (tiro), lasciata su un piano inclinato (rampa) o su un piano
// che si alza piano piano (alza).
// La zona comincia con un mistero (una cassa che non scivola) e finisce con il mito di Vetrino «le casse pesanti
// scivolano prima», smontato con il piano che si alza.
import { T } from '../util.js';

const M1 = { label: 'Blocchi sulla cassa', min: 1, max: 6, step: 1, unit: 'kg' };

export default {
  id: 'D02',
  title: 'Attrito e piani inclinati',
  levels: [
    {
      id: 'd02-1', kind: 'prevedi', title: 'Il mistero della cassa ferma',
      sim: 'ramp', params: { mode: 'rampa', theta: 20, floor: 'ghiaccio', m1: 3, arrows: false }, controls: [],
      intro: T(
        'Ciao, sono Mela! Metto una cassa in cima a una rampa e la lascio andare. Scivolerà giù? Prima indovina, poi guarda!',
        'Una cassa ferma in cima a un piano inclinato. Il peso la tira sempre verso il basso: eppure non sempre scivola. Prima prevedi, poi guarda l’esperimento.',
        'Una cassa in cima a uno scivolo, lasciata andare. Il peso la tira giù, sempre: eppure a volte resta lì, immobile. Che cosa la trattiene? Prima prova a indovinare.'),
      steps: [
        {
          kind: 'q', predict: [{ floor: 'ghiaccio', theta: 20 }],
          text: T('La rampa è di <b>ghiaccio</b>, poco ripida. Che cosa fa la cassa?', 'Piano inclinato di 20°, ricoperto di ghiaccio. La cassa, lasciata ferma in cima…', 'Uno scivolo di ghiaccio, inclinato di 20 gradi. Lasci andare la cassa: che cosa fa?'),
          options: [T('scivola fino in fondo'), T('resta ferma'), T('scivola un po’ e si ferma', 'scivola un po’ e si ferma a metà', 'parte, ma si ferma a metà')],
          answer: 0,
          explain: T('Scivola! Sul ghiaccio quasi niente la trattiene.', 'Scivola: il peso la tira giù lungo il piano, e il ghiaccio la trattiene pochissimo.', 'Scivola fino in fondo: sul ghiaccio quasi niente la trattiene.'),
          solution: T('Scivola fino in fondo.'),
        },
        {
          kind: 'q', predict: [{ floor: 'legno', theta: 20 }],
          text: T('Stessa rampa, ma di <b>legno</b>. Che cosa fa la cassa?', 'Stesso angolo, 20°, ma ora il piano è di legno. La cassa…', 'Stesso scivolo, stessi 20 gradi, ma di legno. E adesso?'),
          options: [T('resta ferma dov’è', 'resta ferma, immobile', 'resta ferma, immobile'), T('scivola più piano', 'scivola, ma più piano', 'scivola, ma più adagio'), T('scivola come prima', 'scivola come sul ghiaccio', 'scivola come prima')],
          answer: 0,
          explain: T(
            'Resta ferma! Eppure la Terra la tira giù anche qui. Qualcosa la tiene: si chiama <b>attrito</b>.',
            'Resta ferma, anche se il peso la tira giù lungo il piano come prima. Qualcosa la trattiene: è la forza di <b>attrito</b>, che il legno fa molto più del ghiaccio.',
            'Resta ferma. Il peso tira come prima: qualcosa, allora, la tiene. È l’<b>attrito</b>, la forza che nasce dove due superfici si toccano.'),
          solution: T('Resta ferma.'),
        },
        {
          kind: 'q', predict: [{ floor: 'legno', theta: 35 }],
          text: T('Ora la rampa di legno è <b>più ripida</b>. Che cosa fa la cassa?', 'Alziamo il piano di legno fino a 35°. La cassa…', 'Alziamo lo scivolo di legno fino a 35 gradi. Che cosa succede?'),
          options: [T('scivola giù', 'scivola fino in fondo al piano', 'scivola fino in fondo'), T('resta ferma', 'resta ferma: il legno tiene', 'resta ferma: il legno tiene sempre'), T('si ribalta', 'resta lì finché non la spingi', 'si ribalta e rotola')],
          answer: 0,
          explain: T(
            'Scivola! L’attrito tiene, ma solo fino a un certo punto.',
            'Scivola: più il piano è ripido, più il peso tira lungo il piano. L’attrito ha un massimo: quando il peso lo supera, la cassa parte.',
            'Scivola: l’attrito trattiene, ma solo fino a un certo punto. Oltre, cede. Nelle prossime lezioni scopri quanto.'),
          solution: T('Scivola fino in fondo.'),
        },
      ],
      hints: [T('Guarda di che cosa è fatta la rampa, e quanto è ripida.', 'Pensa a che cosa trattiene la cassa, e a quanto il peso tira lungo il piano.', 'Ghiaccio o legno, rampa bassa o ripida: che cosa cambia?')],
      solution: T(
        'Sul ghiaccio scivola; sul legno poco ripido resta ferma; sul legno ripido scivola.',
        'Ghiaccio a 20°: scivola. Legno a 20°: resta ferma. Legno a 35°: scivola.',
        'Sul ghiaccio scivola; sul legno a 20 gradi resta ferma; a 35 gradi scivola anche sul legno.'),
    },
    {
      id: 'd02-2', kind: 'lezione', title: 'La forza che frena',
      sim: 'ramp', params: { mode: 'tiro', F: 6, m1: 2, floor: 'legno', D: 3 }, controls: ['F', 'm1', 'floor'], labels: { m1: M1 },
      intro: T(
        'Tira la cassa con la corda. Se tiri piano, non si muove: il pavimento la trattiene. Quella freccia rossa è l’<b>attrito</b>.',
        'L’<b>attrito</b> è la forza con cui una superficie si oppone allo strisciare di un’altra. Da ferma, la cassa resiste fino a un valore massimo (<b>attrito statico</b>); quando striscia, l’attrito è un po’ più piccolo (<b>attrito dinamico</b>). Tira la cassa e guarda la freccia rossa.',
        'Spingere un armadio: all’inizio non si muove, poi d’un tratto parte. L’attrito fa proprio questo: trattiene quanto serve, finché può. Tira la cassa con la corda e guarda la freccia rossa.'),
      steps: [
        {
          kind: 'free',
          text: T('Tira <b>piano</b> una volta e <b>forte</b> un’altra: fai partire la cassa!', 'Fai un lancio in cui la cassa resta ferma e uno in cui parte. Guarda la freccia rossa dell’attrito e il suo tratteggio.'),
          need: [
            { when: '!r.moved[0]', try: { F: 6, m1: 2, floor: 'legno' }, msg: T('Ora prova un tiro piccolo, che non la smuove.', 'Manca un lancio in cui la cassa resta ferma: prova un tiro più piccolo.') },
            { when: 'r.moved[0]', try: { F: 20, m1: 2, floor: 'legno' }, msg: T('Tira più forte, finché la cassa parte!', 'Manca un lancio in cui la cassa parte: aumenta il tiro.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Tiri piano e la cassa resta ferma. Com’è la freccia rossa dell’attrito?', 'Con un tiro piccolo la cassa resta ferma. In quel momento la forza di attrito è…', 'Tiri piano e la cassa non si muove. Quanto trattiene, l’attrito?'),
          options: [T('lunga come il tuo tiro', 'uguale al tiro, all’indietro', 'esattamente quanto tiri tu'), T('più lunga del tuo tiro', 'sempre al suo valore massimo', 'sempre il massimo che riesce'), T('non c’è', 'zero, perché la cassa è ferma', 'niente: è tutto fermo')],
          answer: 0,
          explain: T(
            'Giusto: l’attrito tira indietro quanto tiri tu, finché ce la fa. Il tratteggio dice fin dove arriva.',
            'Esatto: l’attrito statico si adatta al tiro, fino a un valore massimo (la tacca in fondo al tratteggio). Superato quello, la cassa parte.',
            'Esatto: da ferma, l’attrito trattiene quanto serve, né più né meno, fino a un massimo. Oltre, la cassa parte.'),
          wrong: T('Fai un lancio con un tiro piccolo e confronta la freccia rossa con quella bianca.'),
        },
        {
          kind: 'q',
          text: T('Con il <b>doppio</b> dei blocchi, per far partire la cassa serve…', 'Raddoppi i blocchi sulla cassa. La forza minima per smuoverla…', 'Un armadio pieno di libri pesa il doppio di quello vuoto. Per smuoverlo serve…'),
          options: [T('il doppio della forza', 'diventa doppia', 'il doppio della forza'), T('la stessa forza di prima', 'resta la stessa', 'la stessa forza: conta il pavimento'), T('metà della forza', 'si dimezza', 'meno forza')],
          answer: 0,
          explain: T(
            'Giusto: più la cassa è pesante, più preme sul pavimento, e più l’attrito la tiene.',
            'Esatto: l’attrito massimo è proporzionale alla forza con cui la cassa preme sul piano. Sul pavimento è il suo peso, e il pavimento risponde con una spinta uguale verso l’alto, N. Attrito massimo = μ·N.',
            'Esatto: più un oggetto preme sul pavimento, più l’attrito lo trattiene. Peso doppio, attrito doppio. [[Fₐ,max = μ · N, con N la spinta del pavimento: qui uguale al peso]]'),
          wrong: T('Prova: fai partire la cassa con 1 blocco, poi con 2. Che tiro serve?'),
        },
        {
          kind: 'q',
          text: T('Su quale superficie basta il tiro più piccolo per far partire la cassa?', 'Su quale superficie serve la forza più piccola per smuovere la cassa?', 'Devi trascinare un baule pesante. Su quale pavimento fai meno fatica a smuoverlo?'),
          options: [T('sul ghiaccio'), T('sul legno grezzo', 'sul legno grezzo', 'sul parquet di legno'), T('sulla gomma')],
          answer: 0,
          explain: T(
            'Giusto: il ghiaccio trattiene pochissimo. La gomma, invece, tiene tantissimo.',
            'Esatto: ogni coppia di superfici ha il suo <b>coefficiente d’attrito</b> μ: piccolo per il ghiaccio, grande per la gomma. Attrito massimo = μ·N.',
            'Esatto: ogni coppia di superfici trattiene a modo suo. Il numero che lo misura si chiama coefficiente d’attrito: piccolo sul ghiaccio, grande sulla gomma.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo con la cassa.'),
          vals: { e: { n: [2, 3, 4] }, s: { mu: [0.3, 0.5], m: [2, 4, 5] } },
          calc: { e: '5 * n', s: 'mu * m * 9.8' }, unit: T('', 'N'), tol: { e: 0, s: 0.05 },
          ask: T(
            'Con <b>1 blocco</b>, la cassa parte se tiri con forza <b>5</b>. Con <b>{n} blocchi</b>, che forza serve?',
            'Fra la cassa e il pavimento il coefficiente d’attrito statico è <b>μ = {mu}</b>. Che forza serve, almeno, per smuovere una cassa di <b>{m} kg</b>? (g ≈ 9,8 m/s²)',
            'Un baule di <b>{m} kg</b> sul pavimento; il coefficiente d’attrito vale <b>{mu}</b>. Con quanti newton, almeno, devi tirarlo per smuoverlo? [[g ≈ 9,8 m/s²]]'),
          explain: T(
            'Giusto: {n} blocchi, {n} volte la forza: {ans}.',
            'Esatto: l’attrito massimo è μ·N = μ·m·g = {mu} × {m} × 9,8 = {ans} N. Bisogna tirare almeno così.',
            'Esatto: il pavimento lo trattiene al massimo con {ans} newton, il coefficiente per il peso. [[Fₐ = μ · m · g = {mu} × {m} × 9,8 = {ans} N]]'),
        },
        {
          kind: 'q', review: false,
          text: T('Appena la cassa parte, la freccia rossa dell’attrito…', 'Quando la cassa comincia a strisciare, l’attrito…', 'L’armadio finalmente parte. Per tenerlo in moto, rispetto a prima, serve…'),
          options: [T('si accorcia un po’', 'cala un po’: è attrito dinamico', 'un po’ meno forza'), T('diventa più lunga', 'aumenta, perché la cassa si muove', 'più forza di prima'), T('sparisce del tutto', 'sparisce del tutto', 'nessuna forza')],
          answer: 0,
          explain: T(
            'Giusto: smuovere è più faticoso che tenere in moto.',
            'Esatto: l’attrito dinamico di solito è più piccolo di quello statico massimo (sul legno μ passa da 0,5 a 0,3). Per questo partire costa più fatica che continuare.',
            'Esatto: smuovere costa più fatica che tenere in moto. L’attrito di chi striscia è più piccolo di quello che trattiene da fermo.'),
          wrong: T('Guarda la freccia rossa prima e dopo la partenza.'),
        },
      ],
      hints: [T('Guarda la freccia rossa e il suo tratteggio: fin dove può arrivare?', 'La tacca rossa è l’attrito massimo: il tiro deve superarla.', 'Il tiro deve superare il massimo che il pavimento riesce a trattenere.')],
      solution: T(
        'Il tiro deve vincere l’attrito, che cresce con i blocchi e cambia con la superficie.',
        'La cassa parte se F > μ·N; con più massa o con μ più grande serve più forza.',
        'Si parte quando il tiro supera l’attrito massimo, che cresce con il peso e con la «presa» del pavimento.'),
    },
    {
      id: 'd02-3', kind: 'lezione', title: 'Giù per la rampa',
      sim: 'ramp', params: { mode: 'rampa', theta: 15, floor: 'legno', m1: 3 }, controls: ['theta', 'floor'],
      intro: T(
        'Sulla rampa il peso fa due cose: tira la cassa <b>giù lungo la rampa</b> e la preme <b>contro la rampa</b>. Le vedi tratteggiate in giallo.',
        'Su un piano inclinato il peso P si divide in due parti: <b>P∥</b>, lungo il piano, che tira la cassa in giù, e <b>P⊥</b>, che la preme contro il piano. Con l’angolo θ: P∥ = P·sin θ e P⊥ = P·cos θ. Il piano regge P⊥: la sua spinta è N = P⊥.',
        'Su una salita il peso fa due cose: tira giù lungo la strada e preme contro l’asfalto. Più la strada è ripida, più tira e meno preme. Le due parti del peso sono tratteggiate in giallo. [[P∥ = P · sin θ, P⊥ = P · cos θ]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una rampa <b>bassa</b> e una <b>ripida</b>: quando scivola la cassa?', 'Fai un lancio in cui la cassa resta ferma e uno in cui scivola. Confronta la freccia gialla davanti (P∥) con quella rossa dietro (l’attrito).', 'Fai un lancio in cui la cassa resta ferma e uno in cui scivola. Confronta la freccia gialla davanti con quella rossa dietro.'),
          need: [
            { when: '!r.moved[0]', try: { theta: 15, floor: 'legno' }, msg: T('Prova anche una rampa bassa, dove la cassa resta ferma.', 'Manca un lancio in cui la cassa resta ferma: abbassa la rampa.') },
            { when: 'r.moved[0]', try: { theta: 35, floor: 'legno' }, msg: T('Ora alza la rampa finché la cassa scivola.', 'Manca un lancio in cui la cassa scivola: alza la rampa.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Più alzi la rampa, la freccia gialla che tira giù lungo la rampa…', 'Aumenti l’angolo del piano. La componente P∥, quella lungo il piano…', 'Alzi lo scivolo. La parte del peso che tira giù lungo lo scivolo…'),
          options: [T('si fa più lunga', 'cresce con l’angolo', 'cresce'), T('si fa più corta', 'diminuisce', 'cala'), T('resta uguale', 'non cambia: il peso è lo stesso', 'non cambia: il peso è sempre quello')],
          answer: 0,
          explain: T(
            'Giusto: più la rampa è ripida, più il peso tira giù lungo la rampa.',
            'Esatto: P∥ = P·sin θ cresce con l’angolo: zero sul piano orizzontale, tutto il peso su una parete verticale.',
            'Esatto: più è ripido, più il peso tira lungo lo scivolo. In piano, niente; su una parete verticale, tutto il peso.'),
        },
        {
          kind: 'q', review: false,
          text: T('E la freccia gialla che preme contro la rampa, quando la alzi?', 'E la componente P⊥, che preme sul piano, quando l’angolo cresce?', 'E la parte del peso che preme contro lo scivolo, quando lo alzi?'),
          options: [T('si accorcia', 'cala, e con lei l’attrito massimo', 'cala, e l’attrito con lei'), T('si allunga', 'cresce, come P∥, e l’attrito con lei', 'cresce, e l’attrito con lei'), T('resta uguale', 'non cambia: dipende solo dal peso', 'resta uguale')],
          answer: 0,
          explain: T(
            'Giusto: la cassa preme meno sulla rampa, e l’attrito la tiene meno. Per questo, se la rampa è troppo ripida, scivola!',
            'Esatto: P⊥ = P·cos θ cala, quindi calano anche N e l’attrito massimo μ·N. Alzando il piano P∥ cresce e l’attrito massimo cala: prima o poi la cassa parte.',
            'Esatto: preme meno, quindi l’attrito trattiene meno. Alzando lo scivolo il peso tira di più e l’attrito tiene di meno: prima o poi la cassa parte.'),
        },
        {
          kind: 'q',
          text: T('Una rampa piatta, senza pendenza. La cassa scivola da sola?', 'Quando parte la cassa, su un piano inclinato?', 'Una cassa su una rampa: quand’è che si mette a scivolare?'),
          options: [T('no, resta ferma', 'quando P∥ supera l’attrito μ·N', 'quando il peso in discesa vince l’attrito'), T('sì, piano piano', 'quando P supera la spinta N del piano', 'quando la cassa diventa abbastanza pesante'), T('sì, se è molto pesante', 'quando l’angolo supera i 45°', 'oltre i 45 gradi, sempre')],
          answer: 0,
          explain: T(
            'Giusto: in piano il peso tira solo verso il basso, contro il pavimento. Niente la tira avanti.',
            'Esatto: la cassa parte quando P∥ > μ·N, cioè quando la parte del peso lungo il piano vince l’attrito massimo.',
            'Esatto: è un tiro alla fune lungo la rampa. Davanti tira il peso, dietro trattiene l’attrito: vince il più forte.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Quanto tira il piano inclinato?'),
          vals: { m: [2, 4, 5, 10] }, calc: 'm * 9.8 * 0.5', unit: 'N', tol: 0.05,
          ask: T(null,
            'Una cassa di <b>{m} kg</b> su un piano inclinato di <b>30°</b> (sin 30° = 0,5). Quanto vale P∥, la parte del peso lungo il piano? (g ≈ 9,8 m/s²)',
            'Una valigia di <b>{m} kg</b> su una rampa inclinata di 30 gradi. Con quanti newton il suo peso la tira giù lungo la rampa? [[sin 30° = 0,5; g ≈ 9,8 m/s²]]'),
          explain: T(null, 'Esatto: P∥ = m·g·sin θ = {m} × 9,8 × 0,5 = {ans} N, metà del peso.', 'Esatto: metà del suo peso, {ans} newton. [[P∥ = m · g · sin θ = {m} × 9,8 × 0,5 = {ans} N]]'),
        },
        {
          kind: 'q',
          text: T('Su quale rampa la cassa scivola anche se la rampa è bassa?', 'Su quale superficie la cassa scivola già con una pendenza piccola?', 'Con quale superficie basta uno scivolo appena inclinato per far partire la cassa?'),
          options: [T('sul ghiaccio'), T('sul legno, più ruvido'), T('sulla gomma')],
          answer: 0,
          explain: T(
            'Giusto: il ghiaccio la tiene pochissimo, e basta un po’ di pendenza.',
            'Esatto: con μ piccolo basta un P∥ piccolo, cioè un angolo piccolo: sul ghiaccio circa 6°, sul legno 27°, sulla gomma 42°.',
            'Esatto: sul ghiaccio bastano pochi gradi; sul legno ne servono 27, sulla gomma più di 40.'),
        },
      ],
      hints: [T('Guarda le due frecce lungo la rampa: la gialla davanti, la rossa dietro.', 'Confronta P∥ con l’attrito massimo, la tacca rossa.', 'Davanti tira il peso, dietro trattiene l’attrito: chi vince?')],
      solution: T(
        'Più la rampa è ripida, più il peso tira giù: quando vince l’attrito, la cassa scivola.',
        'P∥ = P·sin θ cresce, P⊥ = P·cos θ cala: la cassa parte quando P∥ > μ·N.',
        'Alzando la rampa il peso tira di più e l’attrito tiene di meno: a un certo angolo la cassa parte.'),
    },
    {
      id: 'd02-4', kind: 'lezione', title: T('La rampa liscia', 'Il piano di Galileo'),
      sim: 'ramp', params: { mode: 'rampa', theta: 10, floor: 'liscio', m1: 2 }, controls: ['theta', 'floor'],
      labels: { floor: { options: [['liscio', 'Piano liscio'], ['ghiaccio', 'Ghiaccio'], ['legno', 'Legno']] } },
      intro: T(
        'Questa rampa è <b>liscissima</b>: niente attrito! La cassa scende come una palla che cade, ma più piano.',
        'Galileo voleva studiare la caduta, ma era troppo veloce per i suoi orologi. Allora la «rallentò» con un piano inclinato. Senza attrito sul piano agisce solo P∥ = m·g·sin θ, quindi <b>a = g·sin θ</b>.',
        'Galileo non aveva cronometri: la caduta era troppo veloce per misurarla. Ebbe un’idea: far rotolare le palle giù per un piano poco inclinato. Stesso moto, ma al rallentatore.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la rampa liscia <b>bassa</b> e poi <b>ripida</b>. Quando va più veloce?', 'Sul piano liscio, fai un lancio con una pendenza piccola (fino a 15°) e uno con una grande (da 30° in su). Leggi l’accelerazione nel riquadro.', 'Sul piano liscio, fai un lancio con una pendenza piccola (fino a 15 gradi) e uno con una grande (da 30 in su). Guarda nel riquadro quanto in fretta prende velocità.'),
          need: [
            { when: "floor == 'liscio' && theta > 0 && theta <= 15", try: { floor: 'liscio', theta: 10 }, msg: T('Prova la rampa liscia, bassa: al massimo 15 gradi.', 'Manca un lancio sul piano liscio con una pendenza fino a 15°.') },
            { when: "floor == 'liscio' && theta >= 30", try: { floor: 'liscio', theta: 30 }, msg: T('Ora la rampa liscia ripida: almeno 30 gradi.', 'Manca un lancio sul piano liscio con una pendenza di almeno 30°.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Sulla rampa liscia, più è ripida…', 'Sul piano liscio, come cambia l’accelerazione con l’angolo?', 'Senza attrito, che cosa cambia rendendo la discesa più ripida?'),
          options: [T('più in fretta va veloce', 'cresce, come sin θ', 'prende velocità più in fretta'), T('più va piano', 'cala con l’angolo', 'la cassa scende più piano'), T('non cambia proprio niente', 'resta sempre uguale a g', 'niente: senza attrito è tutto uguale')],
          answer: 0,
          explain: T(
            'Giusto: più la rampa è ripida, più il peso la tira giù, e più in fretta prende velocità.',
            'Esatto: senza attrito a = g·sin θ: a 10° circa 1,7 m/s², a 30° circa 4,9 m/s².',
            'Esatto: più è ripida, più in fretta guadagna velocità. A 30 gradi, circa metà della caduta libera. [[a = g · sin θ]]'),
        },
        {
          kind: 'q',
          text: T('Se la rampa fosse dritta in piedi, come un muro, la cassa…', 'Senza attrito a = g·sin θ. Quanto vale a se il piano diventa verticale, a 90°?', 'E se la discesa diventasse verticale, come una parete?'),
          options: [T('cadrebbe giù come un sasso', 'g: è la caduta libera', 'cadrebbe in caduta libera'), T('resterebbe attaccata al muro', 'zero: il piano è verticale', 'scenderebbe a velocità costante'), T('scenderebbe piano piano', 'il doppio di g', 'resterebbe ferma')],
          answer: 0,
          explain: T(
            'Giusto: cadrebbe come nella Pista! La rampa è una caduta rallentata.',
            'Esatto: sin 90° = 1, quindi a = g. Il piano inclinato è una caduta libera rallentata, che diventa vera caduta quando il piano è verticale.',
            'Esatto: la caduta libera è il caso estremo della discesa. Una rampa è una caduta «diluita».'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo sulla rampa liscia.'),
          vals: { e: { t: [2, 3, 4] }, s: { th: [15, 30, 45] } },
          derive: { e: {}, s: { sn: 'th == 30 ? 0.5 : th == 45 ? 0.71 : 0.26' } },
          calc: { e: '5 * t', s: '9.8 * sn' }, unit: T('m/s', 'm/s²', 'm/s²'), tol: { e: 0, s: 0.05 },
          ask: T(
            'Sulla rampa liscia la cassa va ogni secondo <b>5 m/s</b> più veloce. Partita da ferma, quanto veloce va dopo <b>{t} secondi</b>?',
            'Piano liscio inclinato di <b>{th}°</b>, senza attrito. Quanto vale l’accelerazione della cassa? (sin {th}° ≈ {sn}, g ≈ 9,8 m/s²)',
            'Una slitta su una discesa ghiacciata, quasi senza attrito, inclinata di <b>{th} gradi</b>. Quanti m/s guadagna ogni secondo? [[sin {th}° ≈ {sn}; g ≈ 9,8 m/s²]]'),
          explain: T(
            'Giusto: {t} volte 5 fa {ans} m/s.',
            'Esatto: a = g·sin θ = 9,8 × {sn} ≈ {ans} m/s².',
            'Esatto: circa {ans} m/s ogni secondo. [[a = g · sin θ = 9,8 × {sn} ≈ {ans} m/s²]]'),
        },
        {
          kind: 'q',
          text: T('Galileo voleva studiare la caduta, ma era troppo veloce. Come la rallentò?', 'Perché Galileo studiava la caduta facendo rotolare palle su piani poco inclinati?', 'Galileo misurava i tempi con una clessidra ad acqua. Perché usava piani inclinati e non cadute vere?'),
          options: [T('con una rampa poco ripida', 'il moto è lo stesso, ma più lento', 'rallentata, la caduta si misurava'), T('con un paracadute', 'sul piano la gravità è più debole', 'voleva evitare la resistenza dell’aria'), T('con una palla più leggera', 'le palle cadute si rompevano', 'le palle in caduta si rompevano')],
          answer: 0,
          explain: T(
            'Giusto: sulla rampa la palla va giù come quando cade, ma più piano. Così si può misurare!',
            'Esatto: a = g·sin θ è più piccola di g, ma il moto resta uniformemente accelerato. Galileo poté misurarlo, e scoprì che lo spazio percorso cresce con il quadrato del tempo.',
            'Esatto: sul piano la caduta è la stessa, solo più lenta. Con piani sempre più ripidi Galileo capì come cadono le cose.'),
        },
        {
          kind: 'q', predict: [{ floor: 'legno', theta: 35 }],
          text: T('Stessa rampa ripida, ma di <b>legno</b>. Rispetto alla rampa liscia, la cassa…', 'Ora il piano a 35° è di legno, con l’attrito. Rispetto al piano liscio, la cassa…', 'Stessa discesa a 35 gradi, ma di legno. Rispetto alla discesa liscia, che cosa cambia?'),
          options: [T('scende, ma più piano', 'scende, ma accelera meno', 'scende, ma più adagio'), T('scende più in fretta', 'scende e accelera di più', 'scende più in fretta'), T('scende uguale', 'accelera uguale: l’angolo è lo stesso', 'nessuna differenza: conta l’angolo')],
          answer: 0,
          explain: T(
            'Giusto: l’attrito la frena un po’, anche mentre scende.',
            'Esatto: con l’attrito dinamico a = g·(sin θ − μd·cos θ): sul legno a 35° circa 3,2 m/s², invece di 5,6.',
            'Esatto: l’attrito frena anche in discesa. Sul legno a 35 gradi la cassa guadagna circa 3 m/s ogni secondo, invece di quasi 6. [[a = g · (sin θ − μ · cos θ)]]'),
          solution: T('Scende, ma più piano.'),
        },
      ],
      hints: [T('Guarda il riquadro: di quanto cresce la velocità ogni secondo?', 'Senza attrito, a = g·sin θ.', 'Più ripida è la discesa, più in fretta si prende velocità.')],
      solution: T(
        'Sulla rampa liscia, più è ripida più in fretta va veloce; sul legno va più piano.',
        'Senza attrito a = g·sin θ; con l’attrito a = g·(sin θ − μd·cos θ).',
        'Senza attrito la discesa è una caduta rallentata; l’attrito la rallenta ancora. [[a = g · sin θ]]'),
    },
    {
      id: 'd02-5', kind: 'costruisci', title: 'Lo scivolo',
      sim: 'ramp', params: { mode: 'rampa', theta: 20, floor: 'legno', m1: 2, L: 4, rider: true, arrows: false }, controls: ['theta'],
      labels: { theta: { label: 'Pendenza dello scivolo', min: 0, max: 45, step: 1, unit: '°' } },
      intro: T(
        'Nuovo gioco per il parco: lo <b>scivolo</b>! Se è troppo piatto i bambini non scendono; se è troppo ripido arrivano troppo veloci. Trova la pendenza giusta.',
        'Nuovo pezzo del parco: uno scivolo di legno lungo 4 m. In fondo i bambini devono arrivare alla velocità giusta: né fermi a metà, né troppo veloci. Regola la pendenza.',
        'Nuovo pezzo del parco: lo scivolo. Chi lo progetta cerca un compromesso: abbastanza ripido da far partire, non tanto da far volare. Regola la pendenza.'),
      piece: { id: 'scivolo', name: 'Lo scivolo', desc: 'Né troppo piatto né troppo ripido: i bambini partono da soli e arrivano in fondo alla velocità giusta.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la pendenza e lancia.', 'Regola la pendenza e lancia: la seconda prova chiede un’altra velocità.'),
          vals: { e: { v: [[4], [5]] }, s: { v: [[4, 5], [5, 6]] } },
          ask: T('In fondo il bambino deve arrivare a <b>{v} m/s</b>.', 'In fondo allo scivolo il bambino deve arrivare a <b>{v} m/s</b>.', 'Il bambino deve arrivare in fondo allo scivolo a <b>{v} m/s</b>.'),
          measure: 'v[0]', goal: 'v', tol: { e: 0.3, s: 0.2 },
          ok: T('{got:1} m/s: scivolo perfetto!'),
          high: T('{got:1} m/s: troppo veloce! Meno ripido.', '{got:1} m/s: troppo. Abbassa lo scivolo.'),
          low: T('{got:1} m/s: troppo piano. Più ripido!', '{got:1} m/s: troppo poco. Alza lo scivolo.'),
          // l'angolo che dà la velocità v in fondo: g · (sin θ − 0,3 · cos θ) · 2 · 4 = v²
          solve: { theta: 'Math.round((Math.atan(0.3) + Math.asin((v * v) / (2 * 9.81 * 4) / Math.sqrt(1.09))) * 180 / Math.PI)' },
        },
      ],
      hints: [
        T('Più è ripido, più si arriva veloci. Prova a cambiare di pochi gradi.', 'Sotto i 27° il bambino non parte nemmeno: l’attrito lo tiene.', 'Sotto una certa pendenza non si parte; sopra, ogni grado in più è più velocità.'),
        T('Per 4 m/s servono circa 28 gradi; per 5 m/s circa 35.', 'v² = 2·a·L, con a = g·(sin θ − 0,3·cos θ): 4 m/s ≈ 28°, 5 m/s ≈ 35°, 6 m/s ≈ 43°.', 'Circa 28 gradi per 4 m/s, 35 per 5, 43 per 6.'),
      ],
      solution: T('4 m/s: circa 28 gradi. 5 m/s: circa 35 gradi.', '4 m/s ≈ 28°, 5 m/s ≈ 35°, 6 m/s ≈ 43°.', 'Circa 28 gradi per 4 m/s, 35 per 5, 43 per 6.'),
    },
    {
      id: 'd02-6', kind: 'ripasso', title: 'Ripasso dell’attrito',
      intro: T('Ripassiamo: tirare, scivolare, frenare!', 'Ripasso: attrito statico e dinamico, piano inclinato, piano di Galileo.', 'Ripasso: l’attrito e le rampe, nelle cose di tutti i giorni.'),
      steps: [
        {
          kind: 'q',
          text: T('D’inverno si sparge la sabbia sulle strade ghiacciate. Perché?', 'Perché d’inverno si sparge sabbia sulle strade ghiacciate?', 'Le catene da neve, la sabbia sul ghiaccio, le suole a carrarmato: che cosa hanno in comune?'),
          options: [T('per far tenere le ruote', 'aumenta l’attrito delle gomme', 'aumentano l’attrito'), T('per sciogliere il ghiaccio', 'scioglie il ghiaccio più in fretta', 'riscaldano il ghiaccio'), T('per colorare la strada', 'rende la strada più liscia', 'tolgono peso')],
          answer: 0,
          explain: T(
            'Giusto: sul ghiaccio le ruote scivolano. La sabbia le fa tenere.',
            'Esatto: la sabbia aumenta il coefficiente d’attrito: le ruote fanno presa e l’auto può partire e frenare.',
            'Esatto: tutte aumentano la presa, cioè l’attrito. Senza attrito non si potrebbe né partire né frenare.'),
        },
        {
          // ponte con le leggi di Newton: a velocità costante le forze si pareggiano
          kind: 'q',
          text: T('Spingi una cassa e lei va sempre alla stessa velocità. La tua spinta è…', 'Trascini una cassa sul pavimento a velocità costante. Il tuo tiro, rispetto all’attrito dinamico, è…', 'Spingi il carrello della spesa a passo costante. La tua spinta, rispetto all’attrito che lo frena, è…'),
          options: [T('uguale all’attrito', 'uguale: le forze si bilanciano', 'uguale, né più né meno'), T('più forte', 'più grande: se no si ferma', 'più forte'), T('più debole dell’attrito', 'più piccolo: la cassa è già in moto', 'più debole, tanto va da solo')],
          answer: 0,
          explain: T(
            'Giusto: le due spinte si pareggiano, e la cassa va avanti sempre uguale. È l’inerzia!',
            'Esatto: velocità costante vuol dire forza totale zero (prima legge di Newton): il tiro pareggia l’attrito dinamico.',
            'Esatto: a passo costante la forza totale è zero. Basta pareggiare l’attrito: è l’inerzia di Newton.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.'),
          vals: { e: { F: [10, 12, 15], A: [4, 6] }, s: { F: [12, 16, 20], A: [4, 8], m: [2, 4] } },
          calc: { e: 'F - A', s: '(F - A) / m' }, unit: T('', 'm/s²'), tol: { e: 0, s: 0.01 },
          ask: T(
            'Tiri la cassa con forza <b>{F}</b>; l’attrito la frena con forza <b>{A}</b>. Quanta forza resta per farla correre?',
            'Tiri una cassa di <b>{m} kg</b> con <b>{F} N</b>; l’attrito dinamico vale <b>{A} N</b>. Quanto vale l’accelerazione?',
            'Un baule di <b>{m} kg</b>, tirato con <b>{F} newton</b>; l’attrito ne toglie <b>{A}</b>. Quanti m/s guadagna ogni secondo?'),
          explain: T(
            'Giusto: {F} meno {A} fa {ans}. È quella forza che la fa correre.',
            'Esatto: la forza totale è F − Fₐ = {F} − {A} N, e a = (F − Fₐ)/m = {ans} m/s².',
            'Esatto: restano {F} meno {A} newton, divisi per {m} kg: {ans} m/s ogni secondo. [[a = (F − Fₐ) / m]]'),
        },
        {
          // ponte con la Pista: le componenti di un vettore
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Le due parti del peso sul piano inclinato, P∥ = P·sin θ e P⊥ = P·cos θ, assomigliano…', 'Il peso sulla rampa si divide in due parti, come…'),
          options: [T(null, 'alle ombre di una freccia', 'le ombre di una freccia'), T(null, 'alle due metà del peso', 'due metà del peso'), T(null, 'a due forze nuove, oltre al peso', 'due forze in più, oltre al peso')],
          answer: 0,
          explain: T(null,
            'Esatto: sono le componenti di un vettore, come nella Pista. P∥ e P⊥ non sono forze nuove: sono il peso, scritto in due direzioni comode.',
            'Esatto: come le ombre di una freccia, sul pavimento e sul muro. Non sono forze nuove: è sempre il peso, visto in due direzioni.'),
        },
        {
          kind: 'q',
          text: T('Sullo scivolo d’acqua del parco si va velocissimi. Perché?', 'Perché sugli scivoli d’acqua si arriva in fondo così veloci?', 'Scivoli d’acqua: perché in fondo si arriva così veloci?'),
          options: [T('l’acqua toglie l’attrito', 'l’attrito diventa quasi zero', 'l’acqua toglie l’attrito'), T('l’acqua ti spinge sempre giù', 'l’acqua spinge in avanti', 'la corrente dell’acqua spinge'), T('bagnati si pesa di più', 'bagnati si ha più massa e più peso', 'bagnati si pesa di più')],
          answer: 0,
          explain: T(
            'Giusto: senza attrito si scende come sulla rampa liscia!',
            'Esatto: senza attrito il piano diventa quello di Galileo: a ≈ g·sin θ, il massimo per quella pendenza.',
            'Esatto: l’acqua fa da lubrificante. Senza attrito, la discesa è quella di Galileo: una caduta rallentata.'),
        },
      ],
      hints: [T('Ripensa alla cassa: il tiro, la rampa, le superfici.')],
    },
    {
      id: 'd02-7', kind: 'boss', title: 'Il mito della cassa pesante',
      sim: 'ramp', params: { mode: 'alza', floor: 'legno', m1: 1 }, controls: ['m1'], labels: { m1: M1 },
      intro: T(
        'Sono Vetrino. Tutti dicono: <i>“Sulla rampa le casse pesanti scivolano prima!”</i> Del resto la Terra le tira di più, no? Controlliamo.',
        'Sono Vetrino. Un mito da magazzino: <i>“Su un piano inclinato le casse pesanti partono prima e scendono più in fretta”</i>. Il peso più grande tira di più: sarà vero?',
        'Sono Vetrino. Lo dicono anche i traslocatori: <i>“le casse pesanti scivolano prima”</i>. Sembra ovvio, il peso tira di più. Ma l’ovvio va messo alla prova.'),
      steps: [
        {
          kind: 'q',
          text: T('Come controlli il mito senza imbrogliare?', 'Per mettere alla prova il mito, che cosa cambi fra un esperimento e l’altro?', 'Vuoi un confronto onesto fra cassa leggera e cassa pesante. Che cosa tieni uguale?'),
          options: [T('stessa rampa di legno, cambio solo i blocchi', 'solo la massa, il resto uguale', 'tutto, tranne il carico'), T('cassa pesante sul ghiaccio, leggera sul legno', 'la massa e la superficie insieme', 'niente, si vede'), T('faccio una prova sola', 'niente: basta un esperimento', 'la superficie, ma non la rampa')],
          answer: 0,
          explain: T('Giusto: se cambi solo i blocchi, sai che cosa conta.', 'Esatto: si cambia una variabile alla volta, la massa. Il resto resta uguale.', 'Esatto: una variabile alla volta. Solo così, se qualcosa cambia, sai a chi dare la colpa.'),
          wrong: T('Se cambi due cose insieme, poi a chi dai la colpa?', 'Così cambi più di una variabile, o nessuna. Che cosa causerebbe la differenza?'),
        },
        {
          kind: 'q', clear: true, predict: [{ m1: 1 }, { m1: 5 }],
          text: T('Alzo piano la rampa: prima con 1 blocco, poi con 5. Quale si stacca prima?', 'La rampa si alza piano piano: prima con 1 blocco sulla cassa, poi con 5. Quale si stacca a un angolo più piccolo?', 'Alziamo piano lo scivolo, una volta con una cassa leggera (1 kg) e una con una pesante (5 kg). Quale parte per prima?'),
          options: [T('si staccano allo stesso angolo', 'si staccano allo stesso angolo', 'partono allo stesso angolo'), T('quella con 5 blocchi, che pesa di più', 'quella con 5 blocchi: pesa di più', 'la pesante, che è tirata di più'), T('quella con 1 blocco', 'quella con 1 blocco', 'la leggera')],
          answer: 0,
          explain: T(
            'Allo stesso angolo! Guarda l’arco: le due tacche sono una sopra l’altra. La Terra tira di più la cassa pesante, ma anche l’attrito la tiene di più.',
            'Stesso angolo, circa 27°: con la massa crescono insieme P∥ e l’attrito massimo μ·N, nella stessa proporzione. L’angolo di distacco dipende solo dalla superficie.',
            'Stesso angolo, circa 27 gradi. La cassa pesante è tirata di più, ma preme anche di più sul legno: l’attrito cresce nella stessa proporzione.'),
          solution: T('Si staccano allo stesso angolo.'),
        },
        {
          kind: 'q', clear: true, predict: [{ mode: 'rampa', theta: 35, m1: 1 }, { mode: 'rampa', theta: 35, m1: 5 }],
          text: T('Ora la rampa resta ferma a 35 gradi. Quale cassa arriva in fondo prima?', 'Ora il piano resta fermo a 35°. Le due casse, da 1 e da 5 blocchi, scivolano una dopo l’altra. Quale impiega meno tempo?', 'Scivolo fisso a 35 gradi: prima la cassa leggera, poi la pesante. Quale arriva in fondo più in fretta?'),
          options: [T('ci mettono lo stesso tempo', 'nessuna: stesso tempo', 'nessuna: stesso tempo'), T('quella con 5 blocchi, la pesante', 'quella da 5 blocchi, più pesante', 'la pesante, che spinge di più'), T('quella con 1 blocco', 'quella da 1 blocco', 'la leggera')],
          answer: 0,
          explain: T(
            'Lo stesso tempo! Guarda il riquadro: anche la velocità in fondo è la stessa.',
            'Stesso tempo: a = g·(sin θ − μd·cos θ) ≈ 3,2 m/s² per tutte e due. La massa non compare.',
            'Stesso tempo, stessa velocità in fondo. La massa, semplicemente, non conta. [[a = g · (sin θ − μ · cos θ)]]'),
          solution: T('Ci mettono lo stesso tempo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il calcolo di Vetrino.'),
          vals: { m: [1, 5, 20] }, calc: '9.8 * (0.5 - 0.3 * 0.87)', unit: 'm/s²', tol: 0.05,
          ask: T(null,
            'Piano di legno a 30° (sin 30° = 0,5; cos 30° ≈ 0,87), attrito dinamico μd = 0,3. Che accelerazione ha una cassa di <b>{m} kg</b>? (g ≈ 9,8 m/s²)',
            'Una cassa di <b>{m} kg</b> scivola su uno scivolo di legno inclinato di 30 gradi. Quanti m/s guadagna ogni secondo? [[sin 30° = 0,5; cos 30° ≈ 0,87; μ = 0,3; g ≈ 9,8 m/s²]]'),
          explain: T(null,
            'Esatto: a = g·(sin θ − μd·cos θ) = 9,8 × (0,5 − 0,3 × 0,87) ≈ {ans} m/s². I {m} kg non entrano nel calcolo!',
            'Esatto: circa {ans} m/s ogni secondo, qualunque sia il carico. [[a = g · (sin θ − μ · cos θ) ≈ {ans} m/s²: la massa si semplifica]]'),
        },
        {
          kind: 'q',
          text: T('Il mito dice: «le casse pesanti scivolano prima». È vero?', 'Il mito: «sul piano inclinato le casse pesanti partono prima e scendono più in fretta». Che cosa concludi?', '«Le casse pesanti scivolano prima»: dopo l’esperimento, che cosa ne pensi?'),
          options: [T('no: pesanti o leggere, è uguale', 'falso: la massa non conta', 'falso: peso e attrito si pareggiano'), T('sì: la Terra le tira molto di più', 'vero: P∥ è più grande', 'vero: il peso tira di più, è ovvio'), T('sì, ma solo sul legno', 'vero, ma solo con l’attrito', 'vero, ma solo per casse enormi')],
          answer: 0,
          explain: T(
            'Mito smontato! La Terra tira di più la cassa pesante, ma l’attrito la tiene di più: pari e patta.',
            'Mito smontato: P∥ e attrito sono tutti e due proporzionali alla massa, che si semplifica. Contano solo la superficie (μ) e l’angolo.',
            'Mito smontato: peso e attrito crescono insieme, e si pareggiano. Contano la superficie e la pendenza, non il carico.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi due cose insieme, a chi dai la colpa?'), T('Vetrino chiede: la cassa pesante è tirata di più… ma è anche trattenuta di più?')],
      solution: T(
        'Pesanti o leggere, le casse si staccano allo stesso angolo e scendono insieme: il mito è falso.',
        'Angolo di distacco (circa 27° sul legno) e accelerazione non dipendono dalla massa: il mito è falso.',
        'Peso e attrito crescono insieme con il carico: il mito è falso.'),
    },
  ],
};
