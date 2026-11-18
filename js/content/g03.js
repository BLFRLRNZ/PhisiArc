// G03 · Il sistema solare. Simulazione: il sistema solare (solar.js), in due modi:
//   - 'orbite': il Sole e gli otto pianeti visti dall'alto (distanze non in scala), con i loro anni veri e,
//     se si vuole, la cometa di Halley;
//   - 'scala': il sentiero dei pianeti in scala (la Terra a 100 m da un Sole di 93 cm), con l'omino che cammina,
//     un lampo di luce che viaggia, e la bandierina da piantare al posto giusto.
// La zona si apre con un mistero (se il Sole fosse un pallone, quanto sarebbe grande la Terra, e dove?) e finisce
// con il mito di Vetrino «il sistema solare è affollato».
import { T } from '../util.js';

export default {
  id: 'G03',
  title: 'Il sistema solare',
  levels: [
    {
      id: 'g03-1', kind: 'prevedi', title: 'Se il Sole fosse un pallone',
      sim: 'solar', params: { mode: 'scala', target: 'terra', secret: true }, controls: [],
      intro: T(
        'Ciao, sono Saturnino! Facciamo un modellino del sistema solare, tutto nella stessa scala. Il Sole è un pallone grande quasi un metro. E la Terra? Prima indovina, poi guarda!',
        'Sono Saturnino. Un modellino in scala del sistema solare: il Sole è un pallone di 93 cm, e ogni distanza e ogni grandezza è ridotta nella stessa proporzione, circa un miliardo e mezzo di volte. Prima prevedi, poi guarda.',
        'Sono Saturnino. I disegni dei libri mettono i pianeti in fila, vicini e grandi come arance. Facciamo un modellino vero, con tutto nella stessa scala: il Sole è un pallone di 93 cm. Prevedi il resto.'),
      steps: [
        {
          kind: 'q', predict: [{ target: 'terra', walk: false }],
          text: T('Il Sole è un pallone. Quanto è grande la Terra?', 'Il Sole è un pallone di 93 cm. Nella stessa scala, la Terra è grande come…', 'Se il Sole è un pallone di quasi un metro, che cosa rappresenta la Terra?'),
          options: [T('come un pisello', 'un pisello: 8,5 mm', 'un pisello'), T('come un’arancia', 'un’arancia: 8 cm', 'un’arancia'), T('come un altro pallone', 'una palla da tennis: 7 cm', 'un melone')],
          answer: 0,
          explain: T('Un pisello! Il Sole è più di cento volte più largo della Terra.', 'Un pisello di 8,5 mm: il diametro del Sole è 109 volte quello della Terra.', 'Un pisello: in larghezza il Sole sta alla Terra come un pallone a un pisello.'),
          solution: T('La Terra è un pisello di 8,5 mm.'),
        },
        {
          kind: 'q', predict: [{ target: 'terra', walk: true }],
          text: T('E quanto è lontano il pisello della Terra dal pallone?', 'E a che distanza dal pallone sta il pisello della Terra?', 'E il pisello della Terra, dove va messo?'),
          options: [T('quanto un campo da calcio', 'a 100 m: un campo da calcio', 'in fondo a un campo da calcio'), T('proprio a un passo dal pallone', 'a 1 m, quasi attaccata al pallone', 'proprio accanto al pallone'), T('lontano come una città', 'a 10 km', 'in un’altra città, lontanissimo')],
          answer: 0,
          explain: T('A 100 metri, quanto un campo da calcio! Tra il pallone e il pisello non c’è niente.', 'A 100 m: è la distanza Terra–Sole, 150 milioni di km, nella stessa scala.', 'In fondo a un campo da calcio: cento metri di niente fra il pallone e il pisello.'),
          solution: T('La Terra sta a 100 m dal pallone.'),
        },
        {
          kind: 'q', predict: [{ target: 'giove', walk: true }],
          text: T('Giove è il pianeta più grande. Nel modellino, dove sta e quanto è grande?', 'Giove, il pianeta più grande: nel modellino è…', 'E Giove, il gigante del sistema solare?'),
          options: [T('un’arancia, a mezzo chilometro', 'un’arancia di 9 cm, a 520 m', 'un’arancia, a mezzo chilometro'), T('un pallone, vicino al Sole', 'un pallone di 50 cm, a 50 m', 'un pallone, proprio accanto al Sole'), T('un pisello, a 100 metri', 'un pisello di 1 cm, a 100 m', 'un pisello, vicino alla Terra')],
          answer: 0,
          explain: T('Un’arancia, a mezzo chilometro dal pallone!', 'Un’arancia di 9 cm, a 520 m: Giove sta 5,2 volte più lontano della Terra.', 'Un’arancia, a mezzo chilometro: il più grande dei pianeti, ma piccolo accanto al Sole.'),
          solution: T('Giove è un’arancia a circa 520 m.'),
        },
        {
          kind: 'q', predict: [{ target: 'nettuno', walk: true }],
          text: T('E Nettuno, il pianeta più lontano?', 'E Nettuno, l’ultimo pianeta?', 'Ultima tappa: Nettuno.'),
          options: [T('a 3 km dal pallone', 'a 3 km', 'a tre chilometri'), T('a 300 metri dal pallone', 'a 300 m', 'a trecento metri, in fondo alla via'), T('a 30 km dal pallone', 'a 30 km', 'a trenta chilometri')],
          answer: 0,
          explain: T('A 3 chilometri! Una bella passeggiata di tre quarti d’ora.', 'A 3 km: Nettuno sta 30 volte più lontano della Terra.', 'A tre chilometri: e lungo la strada, tutti gli altri pianeti sono granelli.'),
          solution: T('Nettuno sta a 3 km dal pallone.'),
        },
        {
          kind: 'q',
          text: T('Allora il sistema solare è…', 'Che cosa ti dice il modellino sul sistema solare?', 'Che cosa scopri, con il modellino in scala?'),
          options: [T('quasi tutto vuoto', 'che è quasi tutto spazio vuoto', 'che è fatto quasi solo di vuoto'), T('pieno di pianeti vicini', 'che i pianeti sono vicini fra loro', 'che i pianeti sono uno accanto all’altro'), T('piccolo come un parco', 'che è piccolo come un parco', 'che starebbe tutto in un cortile')],
          answer: 0,
          explain: T('Giusto: tanto spazio vuoto, e qua e là un pianeta piccolissimo.', 'Esatto: pianeti piccolissimi, a distanze enormi. Il resto è vuoto.', 'Esatto: granelli sparsi su chilometri di vuoto. I poster, per forza, barano.'),
        },
      ],
      hints: [T('Il Sole è enorme e i pianeti sono lontanissimi.', 'Il diametro del Sole è 109 volte quello della Terra; la distanza Terra–Sole è 107 diametri del Sole.', 'Pensa a quanto è grande il Sole rispetto alla Terra, e a quanto è lontana.')],
    },
    {
      id: 'g03-2', kind: 'lezione', title: 'Un anno su ogni pianeta',
      sim: 'solar', params: { mode: 'orbite', pl: 'marte' }, controls: ['pl'],
      intro: T(
        'Ogni pianeta gira intorno al Sole: un giro intero è il suo <b>anno</b>. Scegli un pianeta e conta quanti anni della Terra servono per il suo giro.',
        'Il periodo di rivoluzione di un pianeta è il suo anno. Se si misurano le distanze in <b>unità astronomiche</b> (1 UA = la distanza Terra–Sole) e i tempi in anni terrestri, la terza legge di Keplero diventa semplicissima: T² = a³, per tutti i pianeti.',
        'Su Mercurio un anno dura 88 giorni, su Nettuno 165 dei nostri: scoperto nel 1846, Nettuno ha finito il suo primo giro da allora solo nel 2011. Keplero aveva trovato la regola: misurando in anni e in distanze Terra–Sole, il quadrato dell’anno è uguale al cubo della distanza. [[T² = a³]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Scegli due pianeti diversi e guarda quanto dura il loro anno.', 'Fai girare almeno due pianeti diversi e confronta i loro anni con la loro distanza dal Sole.'),
        },
        {
          kind: 'q',
          text: T('Più un pianeta è lontano dal Sole, il suo anno…', 'Mercurio, il pianeta più vicino al Sole, ha un anno di…', 'Quanti compleanni festeggeresti su Mercurio, nel tempo di un tuo anno?'),
          options: [T('dura di più', '88 giorni', 'circa 4'), T('dura di meno', '365 giorni', 'uno solo'), T('dura uguale', '12 anni', 'circa 12')],
          answer: 0,
          explain: T('Giusto: più lontano, più lungo il giro.', 'Esatto: 0,24 anni, cioè 88 giorni.', 'Esatto: 365 / 88 ≈ 4. Un compleanno ogni tre mesi!'),
        },
        {
          kind: 'q',
          text: T('Su Marte un anno dura…', 'Marte sta a 1,52 UA dal Sole. Il suo anno dura circa…', 'Se hai 12 anni sulla Terra, quanti anni hai su Marte?'),
          options: [T('quasi 2 dei nostri', '1,9 anni', 'circa 6'), T('mezzo dei nostri', '1,5 anni', 'circa 12'), T('come il nostro', '3,5 anni', 'circa 24')],
          answer: 0,
          explain: T('Giusto: quasi due anni nostri.', 'Esatto: T = a·√a = 1,52 × 1,23 ≈ 1,88 anni.', 'Esatto: un anno marziano dura 1,88 dei nostri: 12 / 1,88 ≈ 6.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Giove ci mette 12 anni. Un pianeta ancora più lontano ci metterebbe…'),
          options: [T('ancora di più'), T('meno di 12 anni'), T('proprio 12 anni')],
          answer: 0,
          explain: T('Giusto: Saturno ci mette 29 anni, Nettuno 165!'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Anni e distanze.'),
          vals: { a: [4, 9, 16] }, calc: 'a * Math.sqrt(a)', unit: T(null, 'anni'), tol: 0.05,
          ask: T(null,
            'Un pianeta sta a <b>{a} UA</b> dal Sole. Quanti anni terrestri dura il suo anno?',
            'Un pianeta immaginario dista dal Sole <b>{a} volte</b> la distanza Terra–Sole. Quanti dei nostri anni dura il suo? [[T = a · √a]]'),
          explain: T(null, 'Esatto: T² = a³, quindi T = a·√a = {a} × √{a} = {ans} anni.', 'Esatto: {ans} anni. [[T = {a} × √{a}]]'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Nettuno sta a 30 UA dal Sole. Il suo anno dura circa…', 'Nettuno fu scoperto nel 1846. Quando ha finito il suo primo giro intorno al Sole da allora?'),
          options: [T(null, '165 anni', 'nel 2011'), T(null, '30 anni', 'nel 1847'), T(null, '900 anni', 'non l’ha ancora finito')],
          answer: 0,
          explain: T(null, 'Esatto: 30 × √30 ≈ 164 anni.', 'Esatto: nel 2011, dopo 165 anni.'),
        },
      ],
      hints: [T('Guarda il contatore degli anni mentre il pianeta fa il giro.', 'T² = a³, con a in UA e T in anni.', 'Più lontano, più lento: il quadrato dell’anno è il cubo della distanza.')],
      solution: T(
        'Marte ci mette quasi 2 anni, Giove 12, Saturno 29, Nettuno 165.',
        'Mercurio 0,24 anni, Marte 1,88, Giove 11,9, Nettuno 165: T² = a³.',
        'Più lontano, più lungo: Marte quasi due anni, Giove dodici, Nettuno centosessantacinque.'),
    },
    {
      id: 'g03-3', kind: 'lezione', title: 'Distanze da capogiro',
      sim: 'solar', params: { mode: 'scala', target: 'marte', light: true }, controls: ['target'],
      intro: T(
        'Nel sistema solare le distanze sono enormi. Anche la luce, la cosa più veloce che esiste, ci mette 8 minuti per arrivare dal Sole alla Terra! Scegli un pianeta e manda un lampo di luce.',
        'La distanza Terra–Sole, 150 milioni di km = 1,5·10⁸ km, è 1 UA. La luce viaggia a c = 300 000 km/s = 3·10⁵ km/s: dal Sole alla Terra impiega 1,5·10⁸ / 3·10⁵ = 500 s, più di 8 minuti. Il Sole che vediamo è quello di 8 minuti fa.',
        'Quando guardi il Sole (con gli occhiali giusti!) lo vedi com’era più di 8 minuti fa: tanto ci mette la sua luce ad arrivare. Fino a Nettuno ci vogliono più di 4 ore. Le sonde spaziali comunicano con questi ritardi.'),
      steps: [
        {
          kind: 'free',
          text: T('Manda la luce fino alla Terra e poi fino a Nettuno.', 'Manda il lampo di luce fino alla Terra e fino a Nettuno: confronta i tempi.'),
          need: [
            { when: "target == 'terra'", try: { target: 'terra' }, msg: T('Ora scegli la Terra e manda la luce.') },
            { when: "target == 'nettuno'", try: { target: 'nettuno' }, msg: T('Ora mandala fino a Nettuno.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quanto ci mette la luce del Sole ad arrivare a Nettuno?', 'La luce impiega 8 min 19 s dal Sole alla Terra. Fino a Giove (5,2 UA)?', 'Un comando inviato da Terra a una sonda vicino a Giove arriva dopo…'),
          options: [T('più di 4 ore', 'circa 43 minuti', 'più di mezz’ora'), T('solo un secondo', 'circa 8 minuti', 'un istante'), T('un anno', 'circa 5 ore', 'un giorno intero')],
          answer: 0,
          explain: T('Giusto: più di 4 ore, anche andando velocissima.', 'Esatto: 5,2 × 8,3 min ≈ 43 min.', 'Esatto: fra 35 e 52 minuti, a seconda di dove si trovano Terra e Giove. Impossibile guidarla con il joystick!'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Se il Sole si spegnesse all’improvviso, quando ce ne accorgeremmo?'),
          options: [T('dopo 8 minuti'), T('subito, nello stesso istante'), T('dopo un anno')],
          answer: 0,
          explain: T('Giusto: per 8 minuti vedremmo ancora la sua ultima luce, in viaggio verso di noi.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La luce in viaggio.'),
          vals: { a: [[1.52], [9.54]] }, calc: 'a * 1.5e8 / 3e5 / 60', unit: 'min', tol: 0.5,
          ask: T(null,
            'Un pianeta dista <b>{a} UA</b> dal Sole. Quanti minuti impiega la luce del Sole per arrivarci? (1 UA = 1,5·10⁸ km, c = 3·10⁵ km/s)',
            'Un pianeta sta a <b>{a} volte</b> la distanza Terra–Sole. Quanti minuti viaggia la luce del Sole per raggiungerlo? [[t = a · 1,5·10⁸ km / (3·10⁵ km/s)]]'),
          explain: T(null, 'Esatto: t = d / c = {a} × 1,5·10⁸ / 3·10⁵ s ≈ {ans:1} min.', 'Esatto: circa {ans:1} minuti.'),
        },
        {
          kind: 'q',
          text: T('Quale di questi pianeti è il più lontano dal Sole?', 'Quante volte la distanza Terra–Sole entra nella distanza Sole–Nettuno?', 'Un anno luce è la strada che la luce fa in un anno. La stella più vicina sta a 4,2 anni luce: nel modellino, con la Terra a 100 m dal Sole, dove starebbe?'),
          options: [T('Nettuno', 'circa 30', 'a 27 000 km'), T('Giove', 'circa 3', 'a 30 km, nella città vicina'), T('Marte', 'circa 300', 'a 3 km, poco oltre Nettuno')],
          answer: 0,
          explain: T('Giusto: Nettuno è l’ultimo, lontanissimo.', 'Esatto: 30 UA.', 'Esatto: 4,2 anni luce sono 270 000 UA: nel modellino, 27 000 km, più di metà del giro della Terra. Il vuoto fra le stelle è ancora più grande.'),
        },
      ],
      hints: [T('Guarda quanto tempo viaggia la luce.', 't = d / c, con d in km e c = 3·10⁵ km/s.', 'Ogni distanza Terra–Sole costa alla luce poco più di 8 minuti.')],
      solution: T(
        'La luce ci mette 8 minuti fino alla Terra e più di 4 ore fino a Nettuno.',
        '1 UA: 500 s; Nettuno, 30 UA: circa 15 000 s, più di 4 ore.',
        'Otto minuti fino alla Terra, più di quattro ore fino a Nettuno.'),
    },
    {
      id: 'g03-4', kind: 'costruisci', title: 'Il sentiero dei pianeti',
      sim: 'solar', params: { mode: 'scala', target: 'marte', flag: 100 }, controls: ['flag'],
      intro: T(
        'Nuovo gioco per il parco: il sentiero dei pianeti! Il Sole è un pallone, la Terra un pisello a 100 metri. Pianta le bandierine degli altri pianeti al posto giusto.',
        'Nuovo pezzo del parco: il sentiero dei pianeti, in scala. Il Sole è un pallone di 93 cm e 1 UA vale 100 m. Pianta ogni bandierina alla distanza giusta: l’omino la raggiungerà e vedrai dov’è il pianeta.',
        'Nuovo pezzo del parco: un sentiero dei pianeti, come quelli che si trovano in molte città: un pallone per il Sole, e le bandierine dei pianeti alle distanze in scala. Qui la Terra sta a 100 m.'),
      piece: { id: 'sentiero', name: 'Il sentiero dei pianeti', desc: 'Un pallone per il Sole, un pisello per la Terra a 100 metri, e Nettuno a 3 chilometri.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli dove piantare la bandierina, poi lancia: l’omino ci va.', 'Regola dove piantare la bandierina, poi lancia: l’omino la raggiunge e il pianeta vero appare.'),
          // il pianeta si sceglie per nome (n); la sua distanza a, in UA, viene dal nome. Il Piccolo usa numeri tondi.
          vals: {
            e: { n: [['Marte'], ['Giove']], x: [['una volta e mezza'], ['5 volte']], a: [[1.5], [5]] },
            s: { n: [['Marte', 'Giove'], ['Saturno', 'Urano', 'Nettuno']] },
          },
          derive: { e: {}, s: { a: '({ Marte: 1.524, Giove: 5.203, Saturno: 9.537, Urano: 19.19, Nettuno: 30.07 })[n]' } },
          set: { target: 'n.toLowerCase()' },
          ask: T(
            'La Terra sta a 100 m. <b>{n}</b> è {x} più lontano: dove pianti la sua bandierina?',
            'Nel modellino 1 UA = 100 m. {n} dista <b>{a} UA</b> dal Sole: a quanti metri pianti la sua bandierina?',
            'La Terra è a 100 m dal pallone. {n} dista dal Sole <b>{a} volte</b> la distanza Terra–Sole: dove va la sua bandierina?'),
          measure: 'flag', goal: 'a * 100', tol: { e: 5, s: 10 },
          ok: T('Bandierina al posto giusto!'),
          high: T('Troppo lontana! Avvicinala al Sole.', 'Troppo lontana dal Sole: riducila.'),
          low: T('Troppo vicina! Allontanala.', 'Troppo vicina al Sole: allontanala.'),
          solve: { flag: 'Math.round(a * 10) * 10' },
        },
      ],
      hints: [
        T('La Terra sta a 100 m: un pianeta due volte più lontano sta a 200 m.', 'Metri = UA × 100.', 'Moltiplica per cento la distanza in unità Terra–Sole.'),
      ],
      solution: T(
        'Marte a circa 150 m, Giove a circa 500 m.',
        'd = a × 100 m: Marte 152 m, Giove 520 m, Saturno 954 m, Urano 1919 m, Nettuno 3007 m.',
        'Basta moltiplicare per cento: Marte a 152 m, Giove a 520 m, Nettuno a 3 km.'),
    },
    {
      id: 'g03-5', kind: 'lezione', title: 'Il Sole che tiene tutto',
      sim: 'solar', params: { mode: 'orbite', pl: 'terra', comet: true }, controls: ['pl'],
      intro: T(
        'Il Sole è enorme: da solo pesa più di tutti i pianeti messi insieme, 750 volte di più! Con la sua gravità tiene tutti in orbita, anche le comete che arrivano da lontanissimo.',
        'Il Sole contiene il 99,86% della massa del sistema solare. La sua gravità, F = G·M·m/r², tiene in orbita i pianeti: la Terra corre intorno al Sole a circa 30 km/s. Le comete, come quella di Halley, hanno orbite ellittiche lunghissime: vicino al Sole sfrecciano, lontano rallentano.',
        'Il Sole pesa 750 volte tutti i pianeti messi insieme. È la sua gravità a tenerci in orbita: la Terra corre intorno a lui a 30 km al secondo, più di cento volte un aereo di linea. E da lontanissimo, ogni 76 anni, torna a trovarci la cometa di Halley.'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Fai girare due pianeti diversi e guarda la cometa rosa.', 'Fai girare almeno due pianeti diversi e osserva la cometa di Halley: dove va veloce, dove lenta?'),
        },
        {
          kind: 'q',
          text: T('Chi tiene la Terra intorno al Sole?', 'Che cosa fa da forza centripeta per la Terra intorno al Sole?', 'Se il Sole sparisse all’improvviso, che cosa farebbe la Terra?'),
          options: [T('la gravità del Sole', 'la gravità del Sole', 'partirebbe dritta, per la tangente'), T('il vento del Sole', 'la gravità della Luna', 'cadrebbe verso il centro del sistema'), T('niente: va da sola', 'la pressione della luce', 'si fermerebbe di colpo')],
          answer: 0,
          explain: T('Giusto: la gravità del Sole la tira, e lei gira.', 'Esatto: G·M·m/r² = m·v²/r. Senza, la Terra andrebbe dritta.', 'Esatto: per inerzia andrebbe dritta, lungo la tangente. È la gravità del Sole a curvare la sua strada.'),
        },
        {
          kind: 'q',
          text: T('La cometa va più veloce quando…', 'La cometa di Halley ha un periodo di 76 anni. Il semiasse maggiore della sua orbita è circa…', 'La cometa di Halley è passata vicino al Sole nel 1986. Quando tornerà?'),
          options: [T('passa vicino al Sole', '18 UA', 'nel 2061'), T('è lontanissima dal Sole', '76 UA', 'nel 2026'), T('è a metà strada', '4 UA', 'non tornerà più')],
          answer: 0,
          explain: T('Giusto: vicino al Sole sfreccia, lontano quasi si ferma.', 'Esatto: a = T^(2/3) = 76^(2/3) ≈ 18 UA.', 'Esatto: nel 2061, dopo 75 anni. Segnatelo!'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('La Terra corre intorno al Sole a 30 km al secondo. Rispetto a un aereo è…'),
          options: [T('oltre 100 volte più veloce'), T('molto più lenta di un aereo'), T('più o meno veloce uguale')],
          answer: 0,
          explain: T('Giusto: un aereo fa meno di 1 km in 4 secondi. Noi, senza accorgercene, 120 km!'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La velocità dei pianeti.'),
          vals: { r: [[150], [228]], T0: [[3.15], [5.94]] }, calc: '2 * Math.PI * r * 1e6 / (T0 * 1e7)', unit: 'km/s', tol: 0.3,
          ask: T(null,
            'Un pianeta percorre un’orbita circolare di raggio <b>{r} milioni di km</b> in <b>{T0}·10⁷ s</b>. Che velocità ha, in km/s?',
            'Un pianeta gira su un cerchio di <b>{r} milioni di km</b> di raggio e ci mette <b>{T0}·10⁷ secondi</b>. Quanto va veloce? [[v = 2πr / T]]'),
          explain: T(null, 'Esatto: v = 2πr/T ≈ {ans:1} km/s.', 'Esatto: circa {ans:1} km al secondo.'),
        },
      ],
      hints: [T('La gravità del Sole tira tutti verso di lui.', 'La gravità del Sole fa da forza centripeta: v = 2πr/T.', 'Senza la gravità del Sole, ogni pianeta andrebbe dritto.')],
      solution: T(
        'È la gravità del Sole a tenere tutti i pianeti in orbita.',
        'La gravità del Sole fa da forza centripeta; la Terra corre a 2π × 1,5·10⁸ km / 3,15·10⁷ s ≈ 30 km/s.',
        'La gravità del Sole curva la strada di tutti i pianeti; la Terra corre a 30 km al secondo.'),
    },
    {
      id: 'g03-6', kind: 'ripasso', title: 'Ripasso del sistema solare',
      intro: T('Ripassiamo: pianeti, anni e distanze!', 'Ripasso: unità astronomiche, terza legge di Keplero, la luce in viaggio, la gravità del Sole.', 'Ripasso: il sistema solare, dalle sue dimensioni ai suoi anni.'),
      steps: [
        {
          kind: 'order',
          text: T('Metti in ordine i pianeti, dal più vicino al Sole al più lontano.', 'Ordina i pianeti dal più vicino al Sole al più lontano.', 'Dal più vicino al più lontano dal Sole: metti in fila i pianeti.'),
          items: [
            { t: T('Mercurio'), v: 0.39 }, { t: T('Venere'), v: 0.72 }, { t: T('Terra'), v: 1 }, { t: T('Marte'), v: 1.52 },
            { t: T('Giove'), v: 5.2 }, { t: T('Saturno'), v: 9.5 },
          ],
          explain: T('Perfetto! Poi vengono Urano e Nettuno.', 'Perfetto: 0,39, 0,72, 1, 1,52, 5,2 e 9,5 UA; poi Urano (19) e Nettuno (30).', 'Perfetto: i quattro rocciosi vicini, poi i giganti di gas, sempre più lontani.'),
        },
        {
          kind: 'q',
          text: T('Quale pianeta ha l’anno più lungo?', 'Quale pianeta ha il periodo di rivoluzione più lungo?', 'Su quale pianeta un anno dura di più?'),
          options: [T('Nettuno'), T('Mercurio'), T('la Terra', 'la Terra', 'sulla Terra')],
          answer: 0,
          explain: T('Giusto: Nettuno, il più lontano, ci mette 165 anni.', 'Esatto: Nettuno, 165 anni: il più lontano è il più lento.', 'Esatto: su Nettuno, 165 dei nostri anni.'),
        },
        {
          kind: 'q',
          text: T('Quanto ci mette la luce del Sole ad arrivare a noi?', 'Quanto tempo impiega la luce del Sole per arrivare sulla Terra?', 'Il Sole che vedi al tramonto: com’era quando la sua luce è partita?'),
          options: [T('circa 8 minuti', 'circa 8 minuti', 'com’era 8 minuti fa'), T('un istante, subito', 'circa 1 secondo', 'com’è adesso'), T('circa un’ora', 'circa 8 ore', 'com’era un anno fa')],
          answer: 0,
          explain: T('Giusto: 8 minuti.', 'Esatto: 1,5·10⁸ km / 3·10⁵ km/s = 500 s.', 'Esatto: lo vedi com’era 8 minuti fa.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Keplero in UA e anni.'),
          vals: { a: [4, 9, 16, 25] }, calc: 'a * Math.sqrt(a)', unit: T(null, 'anni'), tol: 0.05,
          ask: T(null,
            'Un asteroide gira intorno al Sole a <b>{a} UA</b>. Quanti anni dura il suo giro?',
            'Un asteroide sta a <b>{a} volte</b> la distanza Terra–Sole. Quanti anni dura il suo giro? [[T = a · √a]]'),
          explain: T(null, 'Esatto: T = a·√a = {ans} anni.', 'Esatto: {ans} anni.'),
        },
        {
          kind: 'q',
          text: T('Che cosa tiene i pianeti intorno al Sole?', 'Che frazione della massa del sistema solare sta nel Sole?', 'Perché tutti i pianeti girano intorno al Sole, e non intorno a Giove?'),
          options: [T('la gravità del Sole', 'il 99,86%', 'il Sole ha quasi tutta la massa'), T('la spinta delle comete', 'circa la metà', 'Giove è troppo lontano dagli altri'), T('niente: vanno da soli', 'circa il 10%', 'è stato deciso così all’inizio')],
          answer: 0,
          explain: T('Giusto: la gravità del Sole, enorme.', 'Esatto: quasi tutta. Giove, il più grande dei pianeti, ha un millesimo della massa del Sole.', 'Esatto: il Sole ha più del 99% della massa: è lui che comanda.'),
        },
      ],
    },
    {
      id: 'g03-7', kind: 'boss', title: 'Il mito del sistema affollato',
      sim: 'solar', params: { mode: 'scala', target: 'marte' }, controls: ['target'],
      intro: T(
        'Sono Vetrino. Nei poster i pianeti sono uno accanto all’altro, grandi come palloni. Un bambino dice: <i>“il sistema solare è affollato!”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“il sistema solare è affollato: pianeti grandi e vicini, e una fascia di asteroidi fitta come un muro”</i>, proprio come nei poster e nei film. Mettiamolo alla prova con il modellino in scala.',
        'Sono Vetrino. Poster, cartoni e film mostrano un sistema solare affollato: pianeti in fila, asteroidi fitti come grandine. Il modellino in scala racconterà un’altra storia?'),
      steps: [
        {
          kind: 'free',
          text: T('Fai il viaggio fino a Nettuno e guarda quanto spazio vuoto c’è.', 'Cammina fino a Nettuno e guarda come sono sparsi i pianeti.'),
          need: [{ when: "target == 'nettuno'", try: { target: 'nettuno' }, msg: T('Scegli Nettuno e fai tutto il viaggio.') }],
        },
        {
          kind: 'q',
          text: T('Fra il pallone del Sole e il pisello della Terra, nel modellino, c’è…', 'Nel modellino, fra il Sole (93 cm) e la Terra (8,5 mm) ci sono…', 'Fra il pallone del Sole e il pisello della Terra, che cosa c’è?'),
          options: [T('un campo da calcio vuoto', '100 m quasi vuoti, con Mercurio e Venere', 'cento metri di niente, e due piselli'), T('un pianeta ogni metro', 'una fila di pianeti, uno ogni metro', 'una folla di pianeti e asteroidi'), T('un muro di sassi che girano', 'una fascia fittissima di asteroidi e sassi', 'un muro di sassi che girano')],
          answer: 0,
          explain: T('Giusto: un campo da calcio vuoto, con due piselli in mezzo.', 'Esatto: in 100 m ci sono solo Mercurio (3 mm) e Venere (8 mm).', 'Esatto: cento metri di vuoto, con due granellini.'),
        },
        {
          kind: 'q',
          text: T('Le sonde spaziali che attraversano la fascia degli asteroidi…', 'Nella fascia degli asteroidi, fra un asteroide e l’altro ci sono in media…', 'Nei film le astronavi schivano asteroidi fittissimi. Le sonde vere che attraversano la fascia…'),
          options: [T('passano senza toccarne nessuno', 'centinaia di migliaia di km', 'passano senza vederne uno da vicino'), T('devono schivarli di continuo', 'pochi metri, come sassi in un fiume', 'devono schivarli uno dopo l’altro'), T('restano bloccate in mezzo ai sassi', 'qualche chilometro appena', 'si scontrano quasi sempre')],
          answer: 0,
          explain: T('Giusto: sono lontanissimi l’uno dall’altro. Le sonde passano senza problemi.', 'Esatto: in media centinaia di migliaia di km: le sonde la attraversano senza manovre.', 'Esatto: più di dieci sonde l’hanno attraversata senza un graffio.'),
        },
        {
          kind: 'q',
          text: T('Perché nei poster i pianeti sono vicini e grandi?', 'Perché le figure dei libri mettono i pianeti vicini e grandi?', 'Perché i poster del sistema solare non sono in scala?'),
          options: [T('per farli stare nella pagina', 'per farli stare tutti nella pagina', 'in scala, i pianeti sarebbero invisibili'), T('perché nello spazio sono così', 'perché nello spazio sono proprio così', 'perché i telescopi li vedono così'), T('perché li hanno fotografati così', 'perché sono foto prese da lontano', 'perché i pianeti si muovono e si avvicinano')],
          answer: 0,
          explain: T('Giusto: in scala, nella pagina non vedresti niente!', 'Esatto: con le distanze in scala, i pianeti sarebbero puntini invisibili.', 'Esatto: in scala, su un foglio i pianeti sarebbero puntini più piccoli della punta di una matita.'),
        },
        {
          kind: 'q',
          text: T('Il mito dice: «il sistema solare è affollato». È vero?', 'Il mito: «il sistema solare è affollato». Che cosa concludi?', '«Il sistema solare è affollato»: dopo il viaggio sul sentiero, che cosa ne pensi?'),
          options: [T('no: è quasi tutto vuoto', 'falso: è quasi tutto spazio vuoto', 'falso: granelli in chilometri di vuoto'), T('sì: i pianeti sono vicini', 'vero: i pianeti sono vicini fra loro', 'vero: lo mostrano tutti i poster e i film'), T('sì, ma solo vicino al Sole', 'vero solo nella fascia degli asteroidi', 'vero, ma solo fra Marte e Giove')],
          answer: 0,
          explain: T('Mito smontato! Il sistema solare è quasi tutto vuoto.', 'Mito smontato: pianeti piccolissimi a distanze enormi, e asteroidi lontanissimi fra loro.', 'Mito smontato: il sistema solare è vuoto quasi dappertutto. I poster, per forza, barano.'),
        },
      ],
      hints: [T('Guarda quanto spazio c’è fra una bandierina e l’altra.', 'Confronta le grandezze dei pianeti con le distanze fra loro.', 'Nel modellino, i pianeti sono granelli e le distanze chilometri.')],
      solution: T(
        'Fino a Nettuno ci sono 3 km di sentiero, quasi tutto vuoto: il mito è falso.',
        'Granelli di pochi millimetri o centimetri, sparsi su 3 km: il sistema solare è quasi tutto vuoto.',
        'Tre chilometri di sentiero con qualche granello: il sistema solare è quasi vuoto.'),
    },
  ],
};
