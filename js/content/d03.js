// D03 · Lavoro, energia e potenza. Simulazione: le montagne russe (coaster.js): una collina da superare, una valle fra
// due rampe, la salita con la catena e il motore. La barra in alto mostra l'energia del vagoncino che cambia forma.
// La zona comincia costruendo (le montagne russe del parco, prima della teoria) e finisce con un esperimento al buio
// di Vetrino: la partenza è nella nebbia, e l'altezza si trova con l'energia.
import { T } from '../util.js';

const H0 = (max) => ({ label: 'Altezza della partenza', min: 4, max, step: 1, unit: 'm' });

export default {
  id: 'D03',
  title: 'Lavoro, energia e potenza',
  levels: [
    {
      id: 'd03-1', kind: 'costruisci', title: 'Le montagne russe',
      sim: 'coaster', params: { track: 'collina', h0: 8, h1: 10, bars: false }, controls: ['h0'], labels: { h0: H0(30) },
      intro: T(
        'Ciao, sono Mela! Costruiamo le <b>montagne russe</b>. Il vagoncino parte dall’alto e deve superare la collina. Da che altezza lo fai partire?',
        'Si comincia costruendo: le <b>montagne russe</b> del parco. Il vagoncino parte fermo dalla piattaforma, scende, deve superare una collina alta 10 m e arrivare alla stazione. Niente motore: scegli solo l’altezza della partenza.',
        'Si comincia dal cantiere: le montagne russe del parco. Nessun motore spinge il vagoncino: tutto quello che ha, glielo dà l’altezza da cui parte. Quanto in alto deve cominciare la corsa?'),
      piece: { id: 'montagne', name: 'Le montagne russe', desc: 'Il vagoncino parte dall’alto e scavalca la collina alla velocità giusta, senza motore.' },
      steps: [
        {
          kind: 'free',
          text: T('Fai partire il vagoncino da altezze diverse: una volta <b>non</b> deve farcela, una volta <b>sì</b>.', 'Prova una partenza da cui il vagoncino non supera la collina e una da cui la supera.'),
          need: [
            { when: '!r.passed[0]', try: { h0: 8 }, msg: T('Prova anche una partenza più bassa: il vagoncino ce la fa sempre?', 'Manca una prova in cui il vagoncino non supera la collina: abbassa la partenza.') },
            { when: 'r.passed[0]', try: { h0: 14 }, msg: T('Ora alza la partenza finché il vagoncino passa!', 'Manca una prova in cui il vagoncino supera la collina: alza la partenza.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Il vagoncino supera la collina solo se parte…', 'La collina è alta 10 m. Il vagoncino la supera solo se parte…', 'Una collina di 10 metri sulla strada del vagoncino. Quando riesce a superarla?'),
          options: [T('più in alto della collina', 'da più in alto di 10 metri', 'quando parte più in alto della cima'), T('più in basso, per prendere la rincorsa', 'da più in basso, con più rincorsa', 'quando prende abbastanza rincorsa in basso'), T('da qualunque altezza', 'da ogni altezza', 'sempre: scendendo accelera')],
          answer: 0,
          explain: T(
            'Giusto! Il vagoncino non ha motore: per risalire la collina deve partire più in alto di lei.',
            'Esatto: senza motore il vagoncino non può salire più in alto di dove è partito. Per superare la collina deve partire più in alto della cima.',
            'Esatto: tutta la corsa la «paga» l’altezza di partenza. Più in alto di dove è partito, il vagoncino non può arrivare.'),
        },
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’altezza della partenza e lancia.', 'Regola l’altezza della partenza: il vagoncino deve passare in cima alla collina alla velocità richiesta.'),
          vals: { e: { v: [[10], [14]] }, s: { v: [[10, 14], [12, 16]] } },
          ask: T('Il vagoncino deve passare in cima alla collina a <b>{v} m/s</b>.', 'In cima alla collina il vagoncino deve passare a <b>{v} m/s</b>.', 'Il vagoncino deve scavalcare la collina a <b>{v} m/s</b>: non di più, non di meno.'),
          measure: 'vtop[0]', goal: 'v', tol: { e: 0.5, s: 0.3 },
          ok: T('{got:1} m/s: corsa perfetta!'),
          high: T('{got:1} m/s: troppo veloce! Parti più in basso.', '{got:1} m/s: troppo. Abbassa la partenza.'),
          low: T('{got:1} m/s: troppo piano. Parti più in alto!', '{got:1} m/s: troppo poco. Alza la partenza.'),
          // in cima alla collina: m·g·(h0 − 10) = ½·m·v²
          solve: { h0: 'Math.round(10 + (v * v) / (2 * 9.81))' },
        },
      ],
      hints: [
        T('Più in alto parti, più veloce passi sulla collina.', 'Prova: con la partenza a 15 m passa a circa 10 m/s.', 'Più in alto parte, più veloce scavalca.'),
        T('Per 10 m/s parti da 15 metri; per 14 m/s da 20.', 'In cima conta il dislivello fra la partenza e la cima: 5 m danno circa 10 m/s, 10 m circa 14 m/s.', 'Cinque metri sopra la cima danno circa 10 m/s; dieci metri circa 14.'),
      ],
      solution: T('10 m/s: partenza a 15 m. 14 m/s: partenza a 20 m.', 'Partenza a 10 m + v²/(2g): 15 m per 10 m/s, 20 m per 14 m/s.', 'Circa 15 metri per 10 m/s, 20 per 14 m/s.'),
    },
    {
      id: 'd03-2', kind: 'lezione', title: 'Fin dove risale?',
      sim: 'coaster', params: { track: 'valle', h0: 12, side: 'ripida', bars: false }, controls: ['h0', 'side'], labels: { h0: H0(24) },
      intro: T(
        'Una valle fra due rampe. Lascio il vagoncino fermo sulla rampa di sinistra: scende… e dall’altra parte, fin dove risale?',
        'Galileo immaginò due rampe affacciate: una palla scende dalla prima e risale sulla seconda. Fin dove? Lascia il vagoncino a un’altezza e guarda la linea tratteggiata.',
        'Un’altalena, un pendolo, uno skater in un half-pipe: scendono e risalgono. Galileo si chiese fin dove. Prova con il vagoncino: la linea tratteggiata è l’altezza di partenza.'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Prova due altezze diverse. Fin dove risale il vagoncino?', 'Fai almeno due lanci cambiando l’altezza di partenza o la rampa di destra.') },
        {
          kind: 'q', review: false,
          text: T('Senza attrito, dall’altra parte il vagoncino risale…', 'Senza attrito, sulla rampa di destra il vagoncino risale fino a…', 'Senza attriti, dove si ferma il vagoncino sulla rampa di destra?'),
          options: [T('fino alla stessa altezza', 'esattamente l’altezza di partenza', 'alla sua altezza di partenza'), T('un po’ più in basso', 'un po’ meno, ha consumato', 'un po’ più in basso'), T('più in alto, per la rincorsa', 'più in alto: ha preso velocità', 'più in alto, grazie alla velocità')],
          answer: 0,
          explain: T(
            'Giusto: risale fino alla linea tratteggiata, alla stessa altezza da cui è partito!',
            'Esatto: senza attrito risale esattamente alla quota di partenza. Qualcosa, durante la corsa, si conserva.',
            'Esatto: alla stessa altezza. È come se il vagoncino «ricordasse» da dove è partito.'),
        },
        {
          kind: 'q', predict: [{ side: 'dolce', h0: 12 }],
          text: T('Ora la rampa di destra è più dolce e più lunga. Fin dove risale?', 'Rampa di destra più dolce: per salire deve fare molta più strada. Fin dove risale?', 'E se la rampa di destra fosse molto più dolce, e quindi più lunga?'),
          options: [T('stessa altezza, più strada', 'alla stessa altezza, dopo più strada', 'alla stessa altezza'), T('meno in alto: è più lunga', 'meno in alto: la strada è più lunga', 'meno in alto, stanco della strada'), T('più in alto: è più facile salire', 'più in alto: la salita è più facile, no?', 'più in alto')],
          answer: 0,
          explain: T(
            'Alla stessa altezza! Non conta la strada: conta da quanto in alto parti.',
            'Alla stessa altezza, anche se la strada è più lunga. Galileo ne concluse: se la rampa fosse orizzontale, la palla andrebbe avanti per sempre. È l’inerzia!',
            'Alla stessa altezza. Galileo spinse il ragionamento all’estremo: con una «rampa» orizzontale, la palla non si fermerebbe mai. È l’idea dell’inerzia.'),
          solution: T('Alla stessa altezza.'),
        },
        {
          kind: 'q',
          text: T('Che cosa si porta dietro il vagoncino, senza perderla mai?', 'In alto il vagoncino è fermo; in fondo è velocissimo; poi torna fermo alla stessa altezza. Che cosa resta uguale per tutto il tempo?', 'Fermo in alto, veloce in fondo, di nuovo fermo in alto. Che cosa non cambia mai, in tutto questo?'),
          options: [T('la sua energia', 'la sua energia', 'la sua energia'), T('la sua velocità', 'la velocità', 'la velocità'), T('la sua altezza', 'l’altezza dal suolo', 'il tempo di discesa')],
          answer: 0,
          explain: T(
            'Giusto: è l’<b>energia</b>. In alto è nascosta nell’altezza; in fondo è diventata velocità. Ma è sempre la stessa!',
            'Esatto: l’<b>energia</b>. In alto è energia di posizione, in fondo energia di movimento: cambia forma, ma senza attrito il totale resta lo stesso.',
            'Esatto: l’<b>energia</b>. Cambia aspetto, da altezza a velocità e ritorno, ma non sparisce. Nella prossima lezione la vedi colorata.'),
        },
      ],
      hints: [T('Guarda la linea tratteggiata: dove si ferma il vagoncino dall’altra parte?', 'Confronta l’altezza di partenza con quella raggiunta a destra.', 'Segui il vagoncino fino al punto più alto, a destra.')],
      solution: T(
        'Risale alla stessa altezza, qualunque sia la rampa: l’energia si conserva.',
        'Senza attrito risale alla quota di partenza, con qualunque pendenza: l’energia si conserva.',
        'Sempre alla stessa altezza: l’energia cambia forma, ma non si perde.'),
    },
    {
      id: 'd03-3', kind: 'lezione', title: T('L’energia cambia colore', 'Energia di posizione e di movimento', 'Energia di posizione e di movimento'),
      sim: 'coaster', params: { track: 'valle', h0: 16, side: 'ripida', bars: true }, controls: ['h0'], labels: { h0: H0(24) },
      intro: T(
        'Guarda la barra in alto: è l’<b>energia</b> del vagoncino. Azzurra quando è in alto, arancione quando corre. E resta sempre lunga uguale!',
        'Due forme di energia: di <b>posizione</b>, U = m·g·h, che dipende dall’altezza; di <b>movimento</b> (cinetica), K = ½·m·v², che dipende dalla velocità. Senza attrito la loro somma resta costante. L’energia si misura in <b>joule</b> (J).',
        'L’energia ha due facce: quella dell’altezza (di posizione) e quella della velocità (di movimento, o cinetica). La barra in alto le mostra: cambia il colore, non la lunghezza. Si misura in joule, come i punti di questo gioco! [[U = m · g · h; K = ½ · m · v²]]'),
      steps: [
        { kind: 'free', runs: 1, text: T('Lancia e guarda la barra in alto mentre il vagoncino scende e risale.', 'Lancia e segui la barra dell’energia: azzurro la posizione, arancione il movimento.') },
        {
          kind: 'q', review: false,
          text: T('In fondo alla valle il vagoncino corre velocissimo. La barra è…', 'In fondo alla valle (h = 0) l’energia del vagoncino è…', 'Nel punto più basso della valle, com’è fatta la barra dell’energia?'),
          options: [T('tutta arancione', 'tutta di movimento', 'tutta di movimento'), T('tutta azzurra', 'tutta di posizione', 'tutta d’altezza'), T('mezza vuota, più corta', 'metà e metà', 'quasi vuota: è finita')],
          answer: 0,
          explain: T(
            'Giusto: in fondo l’altezza è zero, e tutta l’energia è diventata velocità.',
            'Esatto: con h = 0, U = 0 e tutta l’energia è cinetica: ½·m·v² = m·g·h₀.',
            'Esatto: in fondo tutta l’energia è di movimento. È lì che il vagoncino va più forte.'),
        },
        {
          kind: 'q',
          text: T('Parti dal doppio dell’altezza. In fondo, il vagoncino va…', 'Raddoppi l’altezza di partenza. La velocità in fondo…', 'Lasci il vagoncino da un’altezza doppia. Quanto più veloce arriva in fondo?'),
          options: [T('più veloce, ma non il doppio', 'cresce di √2, circa 1,4 volte', 'circa 1,4 volte'), T('esattamente il doppio più veloce', 'raddoppia, come l’altezza', 'esattamente il doppio'), T('veloce uguale', 'quadruplica: l’energia è al quadrato', 'quattro volte')],
          answer: 0,
          explain: T(
            'Giusto: più veloce, ma non il doppio. Per andare il doppio più veloce devi partire 4 volte più in alto!',
            'Esatto: m·g·h = ½·m·v² dà v = √(2·g·h). Altezza doppia, velocità √2 volte, circa 1,4. Per raddoppiare la velocità serve un’altezza quadrupla.',
            'Esatto: la velocità cresce più piano dell’altezza: per andare al doppio serve partire quattro volte più in alto. [[v = √(2 · g · h)]]'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo sulla valle.'),
          vals: { e: { n: [2, 3] }, s: { h: [5, 10, 20] } },
          calc: { e: 'n * n', s: 'Math.sqrt(2 * 9.8 * h)' }, unit: T('', 'm/s'), tol: { e: 0, s: 0.1 },
          ask: T(
            'Partendo da 5 m, il vagoncino arriva in fondo a 10 m/s. Per arrivare <b>{n} volte</b> più veloce, quante volte più in alto deve partire?',
            'Senza attrito, a che velocità arriva in fondo un vagoncino partito fermo da <b>{h} m</b>? (g ≈ 9,8 m/s²)',
            'Un vagoncino parte fermo da <b>{h} metri</b>. Senza attriti, a che velocità passa nel punto più basso? [[v = √(2 · g · h), g ≈ 9,8 m/s²]]'),
          explain: T(
            'Giusto: {n} volte più veloce vuol dire {n} per {n}, cioè {ans} volte più in alto.',
            'Esatto: m·g·h = ½·m·v², quindi v = √(2·g·h) = √(2 × 9,8 × {h}) ≈ {ans} m/s. La massa si semplifica!',
            'Esatto: circa {ans} m/s, qualunque sia il peso del vagoncino. [[m · g · h = ½ · m · v²  →  v = √(2 · g · h) ≈ {ans} m/s]]'),
        },
        {
          kind: 'q',
          text: T('L’energia si misura in joule. Dove li hai già visti?', 'Un vagoncino di 400 kg è fermo a 20 m di altezza. Quanta energia di posizione ha, circa?', 'Sollevare una mela di un metro costa circa un joule. Quanti joule servono a una persona di 60 kg per salire una scala alta 3 metri?'),
          options: [T('nei punti del gioco', 'circa 78 000 J (78 kJ)', 'quasi 1800 joule'), T('sul tachimetro dell’auto', 'circa 8000 J, cioè 400 × 20', 'appena 180 joule'), T('sulla bilancia', 'circa 400 J', '60 joule')],
          answer: 0,
          explain: T(
            'Giusto: in PhysiArc ogni stella vale 10 joule. Sono proprio l’unità dell’energia!',
            'Esatto: U = m·g·h = 400 × 9,8 × 20 ≈ 78 400 J, cioè circa 78 kJ.',
            'Esatto: 60 × 9,8 × 3 ≈ 1800 joule. Una mela sollevata di un metro: un joule; una persona su per una scala: quasi duemila. [[U = m · g · h]]'),
        },
      ],
      hints: [T('Guarda la barra: quando è tutta azzurra, quando tutta arancione?', 'U = m·g·h in alto, K = ½·m·v² in fondo: senza attrito sono uguali.', 'In alto tutta altezza, in fondo tutta velocità: la somma non cambia.')],
      solution: T(
        'L’energia passa dall’altezza alla velocità e ritorno, senza perdersi.',
        'Senza attrito U + K resta costante: m·g·h = ½·m·v² dà v = √(2·g·h).',
        'L’energia cambia forma, di posizione e di movimento, ma il totale resta lo stesso. [[m · g · h = ½ · m · v²]]'),
    },
    {
      id: 'd03-4', kind: 'prevedi', title: 'Dove finisce l’energia?',
      sim: 'coaster', params: { track: 'valle', h0: 16, side: 'ripida', fr: 0, bars: true }, controls: [],
      intro: T(
        'Sulle montagne russe vere il vagoncino alla fine si ferma. Perché? Proviamo con le ruote un po’ dure: c’è l’<b>attrito</b>.',
        'Finora niente attrito, e l’energia si conservava. Ma un’altalena lasciata a sé alla fine si ferma. Dove va a finire l’energia? Prima prevedi, poi guarda la barra.',
        'Le altalene si fermano, le palle smettono di rimbalzare, le montagne russe vere hanno bisogno di un motore. Se l’energia non si perde, dove va?'),
      steps: [
        {
          kind: 'q', predict: [{ fr: 0.1, h0: 16, oscilla: false }],
          text: T('Ora c’è attrito. Dall’altra parte il vagoncino risale…', 'Ora le ruote hanno attrito. Partendo da 16 m, sulla rampa di destra il vagoncino risale…', 'Stesse rampe, ma con attrito. Partendo da 16 metri, fin dove risale?'),
          options: [T('un po’ meno in alto', 'meno in alto di 16 m', 'un po’ meno in alto'), T('alla stessa altezza', 'esattamente fino a 16 m', 'alla stessa altezza di prima'), T('più in alto', 'più su di 16 m', 'più in alto')],
          answer: 0,
          explain: T(
            'Un po’ meno in alto! Guarda la barra: è comparso un pezzo rosso. È il <b>calore</b>.',
            'Risale meno: una parte dell’energia è diventata calore (il pezzo rosso della barra), per colpa dell’attrito.',
            'Meno in alto: guarda il pezzo rosso della barra. Una parte dell’energia è diventata calore.'),
          solution: T('Un po’ meno in alto.'),
        },
        {
          kind: 'q', predict: [{ fr: 0.1, h0: 16, oscilla: true }],
          text: T('Se lo lasci andare avanti e indietro, alla fine il vagoncino…', 'Con l’attrito, lasciando il vagoncino andare avanti e indietro, alla fine…', 'Lasci il vagoncino libero di andare avanti e indietro. Come finisce?'),
          options: [T('si ferma in fondo alla valle'), T('continua per sempre', 'oscilla per sempre, sempre uguale', 'va avanti all’infinito'), T('si ferma in cima a una rampa', 'si ferma in alto, a sinistra', 'si ferma a metà di una rampa')],
          answer: 0,
          explain: T(
            'Si ferma in fondo! Guarda la barra: è diventata tutta rossa. Tutta l’energia è diventata calore.',
            'Si ferma in fondo: a ogni passaggio l’attrito trasforma un po’ di energia in calore, finché non ne resta più per muoversi.',
            'Si ferma in fondo. L’energia non è sparita: è diventata calore, nelle ruote e nell’aria, un po’ a ogni passaggio.'),
          solution: T('Si ferma in fondo alla valle.'),
        },
        {
          kind: 'q',
          text: T('L’energia che manca alla fine, dov’è andata?', 'Il vagoncino è fermo e la barra è tutta rossa. L’energia iniziale…', 'Alla fine il vagoncino è fermo in fondo. L’energia che aveva in cima…'),
          options: [T('è diventata calore', 'è diventata calore, non è sparita', 'si è trasformata in calore'), T('è sparita nel nulla', 'è sparita per colpa dell’attrito', 'è stata distrutta dall’attrito'), T('è rimasta in cima', 'è rimasta nel vagoncino, in qualche modo', 'è finita nel nulla')],
          answer: 0,
          explain: T(
            'Giusto: l’energia non sparisce mai, cambia solo forma. Strofinati le mani: diventano calde!',
            'Esatto: è il principio di conservazione dell’energia. L’attrito non distrugge l’energia: la trasforma in calore, che però non si può più usare per muovere il vagoncino.',
            'Esatto: l’energia non si crea e non si distrugge, si trasforma. Il calore dell’attrito scalda appena le ruote e l’aria: c’è, ma non si recupera.'),
        },
      ],
      hints: [T('Guarda il pezzo rosso della barra.', 'Confronta la quota raggiunta con la linea tratteggiata.', 'Segui il colore rosso nella barra dell’energia.')],
      solution: T(
        'Con l’attrito il vagoncino risale meno e alla fine si ferma: l’energia diventa calore.',
        'L’attrito trasforma energia in calore: il vagoncino risale meno e alla fine si ferma in fondo.',
        'L’energia non sparisce: con l’attrito diventa calore, e il vagoncino alla fine si ferma.'),
    },
    {
      id: 'd03-5', kind: 'lezione', title: 'La salita: lavoro e potenza',
      sim: 'coaster', params: { track: 'salita', h0: 20, P: 10, lift: 'ripida', m: 400, bars: true }, controls: ['P', 'lift'],
      intro: T(
        'Le montagne russe vere hanno una <b>salita con la catena</b>: un motore tira su il vagoncino. Fa un <b>lavoro</b>, e gli dà l’energia per tutta la corsa.',
        'Per portare il vagoncino in cima il motore fa un <b>lavoro</b>: forza per spostamento, L = F·s. Lungo la salita tira con F = m·g·sin θ (la P∥ della rampa!) per la strada s = h / sin θ: in tutto L = m·g·h, qualunque sia la pendenza. Quanto in fretta lo fa è la <b>potenza</b>: lavoro diviso tempo, in watt (1 W = 1 J/s).',
        'In cima alla prima salita la catena ha già «caricato» il vagoncino: il motore ha fatto un <b>lavoro</b>, che diventa energia di posizione. Più il motore è potente, più in fretta lo fa: la <b>potenza</b> si misura in watt, come le lampadine. [[lavoro = forza × spostamento; potenza = lavoro / tempo]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un motore <b>debole</b> e uno <b>potente</b>. Chi porta su il vagoncino prima?', 'Fai una salita con un motore debole (fino a 6 kW) e una con uno potente (da 14 kW in su). Confronta i tempi e il lavoro.'),
          need: [
            { when: 'P <= 6', try: { P: 5 }, msg: T('Prova anche un motore debole, di pochi kW.', 'Manca una salita con un motore debole, fino a 6 kW.') },
            { when: 'P >= 14', try: { P: 15 }, msg: T('Ora prova un motore potente.', 'Manca una salita con un motore potente, da 14 kW in su.') },
          ],
        },
        {
          kind: 'q', review: false,
          text: T('Con il motore più potente, la salita…', 'Con un motore di potenza doppia, il tempo della salita…', 'Un motore due volte più potente: che cosa cambia nella salita?'),
          options: [T('dura meno tempo', 'si dimezza', 'ci mette metà del tempo'), T('dura di più', 'raddoppia', 'ci mette il doppio del tempo'), T('dura proprio uguale', 'resta uguale', 'sale più in alto')],
          answer: 0,
          explain: T(
            'Giusto: il motore potente fa la stessa fatica, ma in meno tempo.',
            'Esatto: il lavoro è lo stesso (m·g·h), e potenza = lavoro / tempo: potenza doppia, tempo dimezzato.',
            'Esatto: stesso lavoro, metà tempo. La potenza dice quanto in fretta si fa un lavoro.'),
        },
        {
          kind: 'q', predict: [{ lift: 'dolce', P: 10 }],
          text: T('Stesso motore, ma la salita è più dolce e più lunga. Il lavoro del motore…', 'Stesso motore da 10 kW, salita più dolce (20° invece di 40°). Il lavoro per portare su il vagoncino…', 'Stessa altezza, stesso motore, ma salita più dolce e più lunga. La fatica del motore…'),
          options: [T('è proprio lo stesso', 'è lo stesso: L = m·g·h', 'è la stessa'), T('è di più: la strada è lunga', 'è maggiore', 'è maggiore, per la strada più lunga'), T('è meno', 'è minore: la forza è più piccola', 'è minore')],
          answer: 0,
          explain: T(
            'Lo stesso lavoro! Sulla salita dolce il motore tira meno forte, ma per più strada.',
            'Lo stesso: forza più piccola (m·g·sin θ) per una strada più lunga (h / sin θ). Il prodotto è sempre m·g·h. E con lo stesso motore ci mette lo stesso tempo!',
            'La stessa: meno forza, ma per più strada. Come le scale e la rampa per arrivare allo stesso piano: la fatica totale è uguale.'),
          solution: T('Il lavoro è lo stesso.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Un calcolo sulla salita.'),
          vals: { e: { t: [8, 12] }, s: { h: [10, 20, 25] } },
          calc: { e: 't / 2', s: '400 * 9.8 * h / 1000' }, unit: T('s', 'kJ'), tol: { e: 0, s: 0.2 },
          ask: T(
            'Un motore porta su il vagoncino in <b>{t} secondi</b>. Un motore due volte più potente, in quanti secondi?',
            'Quanto lavoro serve per portare in cima, a <b>{h} m</b>, un vagoncino di <b>400 kg</b>? Rispondi in kJ (g ≈ 9,8 m/s²).',
            'Un vagoncino carico pesa 400 kg. Quanti kJ di lavoro servono per portarlo a <b>{h} metri</b> di altezza? [[g ≈ 9,8 m/s²]]'),
          explain: T(
            'Giusto: il doppio della potenza, metà del tempo: {ans} secondi.',
            'Esatto: L = m·g·h = 400 × 9,8 × {h} J = {ans} kJ.',
            'Esatto: circa {ans} kJ, cioè {ans} mila joule. [[lavoro = m · g · h = 400 × 9,8 × {h} J]]'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Quanto ci mette?'),
          vals: { P: [5, 10, 20] }, calc: '78.4 / P', unit: 's', tol: 0.05,
          ask: T(null, 'Il lavoro per la salita è di 78,4 kJ. Quanto tempo ci mette un motore da <b>{P} kW</b>?', 'Servono 78,4 kJ per la salita. Un motore da <b>{P} kW</b> fa {P} kJ di lavoro al secondo: quanti secondi ci mette?'),
          explain: T(null, 'Esatto: tempo = lavoro / potenza = 78,4 kJ / {P} kW ≈ {ans} s.', 'Esatto: circa {ans} secondi. [[tempo = lavoro / potenza = 78,4 / {P}]]'),
        },
        {
          kind: 'q',
          text: T('Una lampadina da 10 watt e una da 100 watt. Quale usa più energia in un’ora?', 'Un phon da 2000 W resta acceso per 60 s. Quanta energia consuma?', 'Un cavallo-vapore vale circa 735 watt. Un’auto da 100 cavalli, a tutta potenza, quanti kW sviluppa?'),
          options: [T('quella da 100 watt', '120 000 J (120 kJ)', 'circa 74 kW'), T('quella da 10 watt', '2000 J, la sua potenza', 'esattamente 100 kW'), T('tutte e due uguali, accese', '33 J', '735 kW')],
          answer: 0,
          explain: T(
            'Giusto: i watt dicono quanta energia si usa ogni secondo. Quella da 100 watt ne usa dieci volte di più.',
            'Esatto: lavoro = potenza × tempo = 2000 W × 60 s = 120 000 J. Il kilowattora della bolletta è proprio un’energia: 1 kWh = 3 600 000 J.',
            'Esatto: 100 × 735 W ≈ 73 500 W, circa 74 kW. Il cavallo-vapore nacque per paragonare le macchine a vapore ai cavalli.'),
        },
      ],
      hints: [T('Guarda il tempo nel riquadro: chi arriva prima in cima?', 'Lavoro L = m·g·h; potenza = lavoro / tempo.', 'Lo stesso lavoro, fatto più in fretta, vuol dire più potenza.')],
      solution: T(
        'Il motore potente porta su il vagoncino prima; il lavoro dipende solo dall’altezza.',
        'L = m·g·h, qualunque sia la pendenza; tempo = L / potenza: potenza doppia, tempo dimezzato.',
        'Il lavoro dipende dal peso e dall’altezza; la potenza da quanto in fretta lo si fa. [[lavoro = m · g · h; potenza = lavoro / tempo]]'),
    },
    {
      id: 'd03-6', kind: 'ripasso', title: 'Ripasso dell’energia',
      intro: T('Ripassiamo: altezza, velocità, calore, motori!', 'Ripasso: energia di posizione e di movimento, conservazione, lavoro e potenza.', 'Ripasso: l’energia nelle cose di tutti i giorni.'),
      steps: [
        {
          kind: 'q',
          text: T('Una palla rimbalza sempre un po’ più bassa. Perché?', 'Una palla lasciata cadere rimbalza sempre meno in alto. Che cosa succede alla sua energia?', 'Una palla da basket rimbalza sempre un po’ più giù, fino a fermarsi. Dov’è finita la sua energia?'),
          options: [T('un po’ di energia diventa calore', 'a ogni urto un po’ diventa calore', 'è diventata calore e suono'), T('la Terra la tira sempre di meno, piano piano', 'la gravità diminuisce a ogni rimbalzo', 'è sparita a poco a poco'), T('si stanca', 'resta nella palla', 'è passata nel pavimento come spinta')],
          answer: 0,
          explain: T(
            'Giusto: a ogni rimbalzo un pochino di energia diventa calore e rumore.',
            'Esatto: negli urti parte dell’energia diventa calore e suono; ne resta meno per risalire.',
            'Esatto: calore e suono, un po’ a ogni rimbalzo. Il totale non cambia, ma l’energia «utile» sì.'),
        },
        {
          kind: 'q',
          text: T('Sali al secondo piano per le scale, oppure per una rampa lunga e dolce. La fatica in tutto…', 'Porti 10 kg al secondo piano, 6 m più in alto: per le scale o in ascensore. Il lavoro contro la gravità…', 'Due escursionisti arrivano in vetta: uno per il sentiero ripido, uno per quello lungo e dolce. Chi ha fatto più lavoro contro la gravità?'),
          options: [T('è uguale per tutte e due', 'è lo stesso, circa 590 J', 'nessuno, se pesano uguale'), T('è più grande sulla rampa', 'è maggiore per le scale', 'quello del sentiero ripido'), T('è più grande sulle scale', 'è minore in ascensore, che è veloce', 'quello del sentiero lungo')],
          answer: 0,
          explain: T(
            'Giusto: conta quanto sali, non da dove. La rampa è più comoda, ma più lunga.',
            'Esatto: contro la gravità conta solo il dislivello: L = m·g·h = 10 × 9,8 × 6 ≈ 590 J, per le scale o in ascensore.',
            'Esatto: conta il dislivello, non il sentiero. Quello ripido è più faticoso a ogni passo, ma più corto. [[lavoro = m · g · h]]'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.'),
          vals: { e: { h: [3, 5, 8] }, s: { v: [10, 14, 20] } },
          calc: { e: 'h', s: 'v * v / (2 * 9.8)' }, unit: 'm', tol: { e: 0, s: 0.1 },
          ask: T(
            'Una palla rotola giù da una rampa liscia alta <b>{h} m</b> e risale su un’altra rampa liscia. Fino a che altezza risale?',
            'Un vagoncino passa nel punto più basso a <b>{v} m/s</b>. Senza attrito, fino a che altezza può risalire? (g ≈ 9,8 m/s²)',
            'Un ciclista arriva in fondo a una discesa a <b>{v} m/s</b> e smette di pedalare. Senza attriti, quanti metri di salita riesce a fare? [[h = v² / (2 · g), g ≈ 9,8 m/s²]]'),
          explain: T(
            'Giusto: senza attrito risale proprio fin lì, a {ans} m.',
            'Esatto: ½·m·v² = m·g·h, quindi h = v² / (2·g) = {ans} m.',
            'Esatto: circa {ans} metri. [[h = v² / (2 · g) = {ans} m]]'),
        },
        {
          kind: 'q',
          text: T('In una diga l’acqua cade dall’alto e fa girare le turbine. Che energia usa?', 'In una centrale idroelettrica, che trasformazioni di energia avvengono?', 'Le dighe di montagna «immagazzinano» energia. In che forma?'),
          options: [T('quella dell’acqua in alto', 'posizione → movimento → elettrica', 'come acqua tenuta in alto'), T('quella del sole sulla diga', 'calore → posizione → movimento', 'come calore dell’acqua'), T('quella del vento', 'elettrica → calore → movimento → posizione', 'come elettricità nelle pareti')],
          answer: 0,
          explain: T(
            'Giusto: l’acqua in alto ha energia di posizione. Cadendo diventa velocità, e la turbina la trasforma in elettricità.',
            'Esatto: energia di posizione dell’acqua, poi di movimento nella caduta, poi elettrica nelle turbine.',
            'Esatto: acqua tenuta in alto è energia di posizione pronta all’uso. Alcune centrali di notte pompano l’acqua in su, per farla ricadere quando serve.'),
        },
        {
          kind: 'q',
          text: T('Due ascensori portano lo stesso peso allo stesso piano. Il più potente…', 'Due motori fanno lo stesso lavoro: il primo in 10 s, il secondo in 5 s. Il secondo ha…', 'Due gru sollevano lo stesso container alla stessa altezza; una ci mette metà del tempo. Che cosa ha in più?'),
          options: [T('arriva prima al piano', 'potenza doppia', 'il doppio della potenza'), T('porta il peso più in alto', 'lavoro doppio', 'fa più lavoro'), T('fa meno fatica', 'potenza dimezzata', 'dà più energia al container')],
          answer: 0,
          explain: T(
            'Giusto: stessa fatica, meno tempo. Si dice che è più potente.',
            'Esatto: stesso lavoro in metà tempo: potenza doppia (potenza = lavoro / tempo).',
            'Esatto: stesso lavoro, metà tempo: il doppio della potenza.'),
        },
      ],
      hints: [T('Ripensa al vagoncino: altezza, velocità, attrito, motore.')],
    },
    {
      id: 'd03-7', kind: 'boss', title: 'La partenza nella nebbia', win: T('Esperimento riuscito!'),
      sim: 'coaster', params: { track: 'valle', h0: 15, side: 'ripida', hide: true, bars: false }, controls: [],
      intro: T(
        'Sono Vetrino. Ho nascosto la partenza nella nebbia! Da che altezza parte il vagoncino? Non puoi guardare: puoi solo misurare. Esperimento al buio!',
        'Sono Vetrino. Stavolta niente mito: un esperimento al buio. La partenza è nella nebbia, e non sai da che altezza parte il vagoncino. Hai il tachimetro e la rampa di destra: bastano per scoprirlo?',
        'Sono Vetrino. La partenza delle mie montagne russe è avvolta nella nebbia. Nessun metro, nessuna occhiata: solo la velocità in fondo e la risalita a destra. Basta l’energia per trovare l’altezza?'),
      steps: [
        { kind: 'free', runs: 1, text: T('Lancia il vagoncino e guarda: quanto va veloce in fondo? Fin dove risale?', 'Lancia e leggi nel riquadro la velocità in fondo e l’altezza a cui risale.') },
        {
          kind: 'q', review: false,
          text: T('Dall’altra parte risale fino a 15 m. Da che altezza è partito?', 'Senza attrito, il vagoncino risale a destra fino a 15 m. Da che altezza è partito, nella nebbia?', 'A destra il vagoncino risale fino a 15 metri, poi torna indietro. Da quanto in alto è partito?'),
          options: [T('da 15 metri esatti', 'da 15 m: l’energia si conserva', 'da 15 metri, esattamente'), T('da più di 15 metri', 'da più di 15 m', 'da più in alto'), T('da meno di 15 metri', 'da meno di 15 m: la velocità aiuta', 'da più in basso, con lo slancio')],
          answer: 0,
          explain: T(
            'Giusto! Senza attrito risale proprio all’altezza da cui è partito: 15 m.',
            'Esatto: senza attrito l’energia in cima a sinistra è uguale a quella in cima a destra: la partenza è a 15 m.',
            'Esatto: 15 metri. La risalita «racconta» da dove è partito.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Vetrino sposta la partenza: ora il vagoncino risale fino a 9 m. Da che altezza parte?'),
          options: [T('da 9 metri'), T('da 18 metri'), T('da 5 metri')],
          answer: 0,
          explain: T('Giusto: senza attrito, partenza e risalita sono sempre alla stessa altezza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Dalla velocità all’altezza.'),
          vals: { v: [14, 17, 20] }, calc: 'v * v / (2 * 9.8)', unit: 'm', tol: 0.1,
          ask: T(null,
            'Un altro vagoncino, partito dalla nebbia, passa nel punto più basso a <b>{v} m/s</b>. Da che altezza è partito? (g ≈ 9,8 m/s²)',
            'Un vagoncino uscito dalla nebbia passa in fondo a <b>{v} m/s</b>. Da quanti metri è partito? [[h = v² / (2 · g), g ≈ 9,8 m/s²]]'),
          explain: T(null, 'Esatto: m·g·h = ½·m·v², quindi h = v² / (2·g) = {ans} m.', 'Esatto: circa {ans} metri. [[h = v² / (2 · g) = {ans} m]]'),
        },
        {
          kind: 'q',
          text: T('Come hai trovato l’altezza senza guardarla?', 'Che cosa ti ha permesso di «misurare» l’altezza nascosta?', 'Che cosa ha tradito l’altezza nascosta da Vetrino?'),
          options: [T('guardando fin dove risale', 'la conservazione dell’energia', 'l’energia, che si conserva'), T('contando i secondi', 'il tempo della discesa, cronometrato', 'il rumore del vagoncino in discesa'), T('guardando il colore della nebbia', 'la massa del vagoncino', 'l’ombra nella nebbia')],
          answer: 0,
          explain: T(
            'Giusto! L’energia non si perde: la risalita ti dice da dove è partito. Vetrino toglie la nebbia: 15 metri!',
            'Esatto: l’energia si conserva. Dalla velocità in fondo (½·m·v² = m·g·h) o dalla risalita a destra si ricava l’altezza di partenza. Vetrino toglie la nebbia: 15 m!',
            'Esatto: l’energia si conserva, e il vagoncino «porta con sé» la sua altezza di partenza. Vetrino toglie la nebbia: 15 metri.'),
        },
      ],
      hints: [T('Guarda fin dove risale il vagoncino, a destra.', 'Senza attrito, l’altezza di partenza è quella raggiunta a destra; oppure h = v²/(2g).', 'L’energia si conserva: guarda la risalita, o la velocità in fondo.')],
      solution: T(
        'La partenza era a 15 m: il vagoncino risale proprio fin lì.',
        'h = 15 m: lo dice la risalita a destra, e anche la velocità in fondo, h = v²/(2g).',
        'Quindici metri: l’energia si conserva, e la risalita lo racconta.'),
    },
  ],
};
