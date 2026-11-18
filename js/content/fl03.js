// FL03 · Fluidi in movimento e volo. Simulazione: i fluidi in movimento (flow.js), in quattro modi: i fogli e la
// striscia di carta su cui si soffia, il tubo che si stringe (con i tubicini di Venturi), l'ala nella galleria del
// vento, il decollo dell'idrovolante del porto.
// La zona parte da un mistero (i fogli che si avvicinano quando ci soffi in mezzo), passa per la portata, Bernoulli e
// la portanza, costruisce l'idrovolante e finisce con il mito di Vetrino: «senza ala curva non si vola».
import { T } from '../util.js';

export default {
  id: 'FL03',
  title: 'Fluidi in movimento e volo',
  levels: [
    {
      id: 'fl03-1', kind: 'prevedi', title: 'I fogli che si attirano',
      sim: 'flow', params: { mode: 'fogli', kind: 'due', blow: 8 }, controls: [],
      intro: T(
        'Ultimo mistero dell’Oceano! Prendi due fogli di carta e tienili appesi, uno vicino all’altro. Se soffi forte nello spazio in mezzo, che cosa fanno? Prima indovina, poi guarda.',
        'Finora acqua e aria stavano ferme. Ora si muovono: che cosa succede alla loro pressione? Si comincia con un esperimento da fare anche a casa: due fogli appesi e un soffio in mezzo. Prevedi, poi guarda.',
        'Un esperimento che quasi tutti sbagliano: due fogli appesi vicini e un soffio forte nello spazio fra loro. L’intuito dice una cosa, la fisica un’altra. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ kind: 'due', blow: 8 }],
          text: T('Soffi forte fra due fogli appesi vicini. Che cosa fanno?', 'Due fogli appesi a pochi centimetri. Soffi forte nello spazio fra loro: che cosa succede?', 'Un soffio forte fra due fogli appesi vicini: che cosa fanno i fogli?'),
          options: [T('si avvicinano', 'si avvicinano fin quasi a toccarsi', 'si avvicinano'), T('si allontanano', 'si allontanano, spinti dal soffio', 'si allontanano, spinti dal getto'), T('restano fermi', 'restano fermi: l’aria passa dritta', 'restano fermi e paralleli')],
          answer: 0,
          explain: T('Si avvicinano! Strano, vero? L’aria che corre in mezzo spinge meno dell’aria ferma di fuori.', 'Esatto: si avvicinano. Dove l’aria corre, la sua pressione cala, e l’aria ferma di fuori spinge di più.', 'Esatto, contro ogni intuito: l’aria che corre fra i fogli ha una pressione più bassa di quella ferma, che li spinge l’uno verso l’altro.'),
          solution: T('I fogli si avvicinano.'),
        },
        {
          kind: 'q', predict: [{ kind: 'striscia', blow: 8 }],
          text: T('Una striscia di carta pende dalle labbra. Se soffi sopra, la striscia…', 'Una striscia di carta pende dalle labbra. Soffi sopra, non sotto: che cosa fa?', 'Soffiando sopra una striscia di carta che pende dalle labbra, la striscia…'),
          options: [T('si alza', 'si alza fin quasi in orizzontale', 'sale, quasi in orizzontale'), T('si abbassa', 'si piega ancora di più verso il basso', 'scende e si piega ancora di più'), T('resta giù, ferma', 'resta come prima', 'vibra forte, ma resta appesa giù')],
          answer: 0,
          explain: T('Si alza! Sopra l’aria corre e spinge meno, sotto l’aria ferma la spinge su.', 'Esatto: sopra la striscia l’aria corre e la pressione cala; sotto, l’aria ferma spinge di più.', 'Esatto: sale. La spinge la differenza di pressione fra sotto, aria ferma, e sopra, aria in corsa.'),
          solution: T('La striscia si alza.'),
        },
        {
          kind: 'q',
          text: T('Alla stazione passa un treno velocissimo. Perché bisogna stare dietro la linea gialla?', 'Perché in stazione, quando passa un treno veloce, bisogna stare dietro la linea gialla?', 'Due navi navigano affiancate, vicine e veloci. Che rischio corrono?'),
          options: [T('l’aria che corre ti spinge verso il treno', 'l’aria che corre spinge meno: vieni spinto verso il treno', 'di attirarsi e urtarsi'), T('il treno ti soffia lontano', 'lo spostamento d’aria ti butta all’indietro', 'di allontanarsi di colpo'), T('per non sentire il rumore', 'il rumore può stordirti e farti cadere', 'di rallentare per la scia')],
          answer: 0,
          explain: T('Giusto: fra te e il treno l’aria corre e spinge meno, e l’aria ferma dietro di te ti spinge verso il treno.', 'Esatto: come fra i due fogli. L’aria ferma dietro di te spinge più di quella che corre davanti.', 'Esatto: fra gli scafi l’acqua corre più veloce e la pressione cala, e le navi si attirano. Nel 1911 l’Olympic, gemello del Titanic, urtò così un incrociatore.'),
        },
        {
          kind: 'q',
          text: T('Allora, dove l’aria corre…', 'Che cosa dicono gli esperimenti sull’aria in movimento?', 'Che cosa hanno in comune i fogli, la striscia e le navi?'),
          options: [T('spinge meno', 'dove corre, la pressione è più bassa', 'il fluido veloce ha pressione più bassa'), T('spinge di più', 'dove corre, la sua pressione è più alta', 'il fluido veloce trascina le cose con sé'), T('spinge uguale', 'la pressione non dipende dal movimento', 'il fluido veloce diventa più denso')],
          answer: 0,
          explain: T('Giusto: dove l’aria corre, spinge meno. Lo vedrai anche con l’acqua!', 'Esatto: in un fluido che scorre, più velocità vuol dire meno pressione. Nei prossimi livelli scoprirai perché.', 'Esatto: vale per l’aria e per l’acqua. Fra due livelli scoprirai che è una storia di energia.'),
        },
      ],
      hints: [T('Dove l’aria corre, spinge meno.', 'Confronta la pressione dell’aria ferma e di quella che corre.', 'L’aria ferma spinge più di quella che corre.')],
    },
    {
      id: 'fl03-2', kind: 'lezione', title: 'Il pollice sulla canna',
      sim: 'flow', params: { mode: 'tubo', v1: 1, ratio: 2 }, controls: ['ratio', 'v1'],
      intro: T(
        'Quando metti il pollice sulla canna dell’acqua, il getto va più lontano. Perché? L’acqua che entra nel tubo deve uscire tutta: dove il tubo si stringe, per passare deve correre più veloce!',
        'In un tubo pieno, l’acqua che entra in un secondo deve uscire nello stesso secondo: i litri al secondo, la <b>portata</b>, sono uguali in ogni punto. Così, dove il tubo si stringe, l’acqua corre più veloce: A₁·v₁ = A₂·v₂, l’<b>equazione di continuità</b>.',
        'Un fiume rallenta dove si allarga e corre dove si stringe fra le rocce. È un conto di volumi: l’acqua non si comprime, e quella che entra in un secondo deve uscire nello stesso secondo. Metà sezione, velocità doppia. [[A₁ · v₁ = A₂ · v₂]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Prova a stringere il tubo di più e di meno.', 'Cambia quanto si stringe il tubo e guarda la velocità nella strozzatura.'),
        },
        {
          kind: 'q',
          text: T('Il tubo si stringe a metà. Lì l’acqua corre…', 'Nella strozzatura la sezione è un terzo di quella larga. La velocità…', 'Perché nella strozzatura l’acqua accelera?'),
          options: [T('due volte più veloce', 'triplica', 'la stessa portata deve passare in meno spazio'), T('due volte più piano', 'diventa un terzo', 'il tubo stretto la comprime e la spinge come una molla'), T('alla stessa velocità', 'resta uguale', 'l’attrito con le pareti la trascina sempre più forte')],
          answer: 0,
          explain: T('Giusto: metà spazio, e l’acqua corre due volte più veloce per passare tutta.', 'Esatto: A·v resta uguale, quindi sezione un terzo vuol dire velocità tripla.', 'Esatto: ogni secondo passa lo stesso volume, e in una sezione più piccola quel volume deve correre di più.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La velocità nella strozzatura.'),
          vals: { v: [[0.5, 1, 1.5], [2, 2.5]] }, calc: 'v * 4', unit: 'm/s', tol: 0.1,
          ask: T(null,
            'Nel tubo largo, di 16 cm² di sezione, l’acqua va a <b>{v} m/s</b>. La strozzatura ha 4 cm²: a che velocità corre lì?',
            'Un tubo passa da 2 cm a 1 cm di diametro. Nel tratto largo l’acqua va a <b>{v} m/s</b>: e in quello stretto? [[A₁ · v₁ = A₂ · v₂, e la sezione va con il quadrato del diametro]]'),
          explain: T(null, 'Esatto: sezione 4 volte più piccola, velocità 4 volte più grande: {ans:1} m/s.', 'Esatto: diametro metà, sezione un quarto, velocità quattro volte: {ans:1} m/s.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché con il pollice sulla canna il getto va più lontano?'),
          options: [T('l’acqua esce più veloce'), T('l’acqua diventa più pesante'), T('il pollice la scalda e la spinge')],
          answer: 0,
          explain: T('Giusto: il buco è più piccolo, l’acqua esce più veloce e arriva più lontano.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Un fiume largo 30 m scorre a 1 m/s. Entra in una gola larga 10 m, profonda uguale. Lì scorre a…', 'Il sangue esce dal cuore nell’aorta e poi si divide in miliardi di capillari. Tutti insieme, i capillari hanno una sezione circa mille volte quella dell’aorta. Che cosa fa la velocità del sangue?'),
          options: [T(null, '3 m/s', 'crolla: nei capillari va lentissimo'), T(null, '1 m/s', 'cresce: i capillari sono strettissimi'), T(null, '0,3 m/s', 'resta uguale: lo spinge sempre il cuore')],
          answer: 0,
          explain: T(null, 'Esatto: sezione un terzo, velocità tripla.', 'Esatto: conta la sezione totale. Nei capillari il sangue va a meno di un millimetro al secondo, e ha il tempo di scambiare ossigeno con le cellule.'),
        },
      ],
      hints: [T('Stessa acqua in meno spazio: deve correre.', 'A₁·v₁ = A₂·v₂: sezione metà, velocità doppia.', 'La portata è la stessa in ogni punto del tubo.')],
      solution: T(
        'Dove il tubo si stringe a metà, l’acqua corre due volte più veloce.',
        'v₂ = v₁·A₁/A₂: con la sezione un terzo, la velocità triplica.',
        'Portata costante: velocità e sezione sono inversamente proporzionali.'),
    },
    {
      id: 'fl03-3', kind: 'lezione', title: 'Dove corre, spinge meno',
      sim: 'flow', params: { mode: 'tubo', v1: 1, ratio: 2, piezo: true }, controls: ['ratio', 'v1'],
      intro: T(
        'Sul tubo mettiamo due cannucce dritte: l’acqua ci sale, e più sale, più spinge l’acqua lì sotto. Guarda: dove l’acqua corre veloce, nella cannuccia sale meno. Come per i fogli: dove si corre, si spinge meno!',
        'È il <b>principio di Bernoulli</b>: in un fluido che scorre, dove la velocità cresce la pressione cala. Lo mostrano i tubicini del <b>tubo di Venturi</b>: l’acqua ci sale tanto più quanto è alta la pressione sotto. Nella strozzatura l’acqua corre, e il tubicino scende.',
        'Daniel Bernoulli, nel 1738, lo spiegò con l’energia: l’acqua che accelera nella strozzatura guadagna energia di movimento, e la paga con la pressione. Per ogni metro cubo, pressione più energia di movimento restano costanti lungo il tubo. [[P + ½ · ρ · v² = costante]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Prova strozzature diverse e guarda le due cannucce.', 'Cambia la strozzatura e confronta i due tubicini.'),
        },
        {
          kind: 'q',
          text: T('Dove l’acqua corre veloce, nella cannuccia l’acqua sale…', 'Nella strozzatura il tubicino è più basso. Perché?', 'Da dove viene l’energia che fa accelerare l’acqua nella strozzatura?'),
          options: [T('meno', 'lì la pressione è più bassa', 'dalla pressione, che cala'), T('di più', 'l’acqua veloce pesa di meno', 'dalla gravità, che la tira giù'), T('uguale', 'il tubicino lì è più stretto', 'dalle pareti del tubo, che la spingono')],
          answer: 0,
          explain: T('Giusto: lì l’acqua corre e spinge meno, e nella cannuccia sale meno.', 'Esatto: il tubicino misura la pressione, e dove l’acqua corre la pressione cala.', 'Esatto: in un tubo orizzontale l’unica cosa che può spingerla avanti è la differenza di pressione. Più energia di movimento, meno pressione.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Quanto cala la pressione.'),
          vals: { v: [[2, 3], [4, 5]] }, calc: '500 * (v * v - 1)', unit: 'Pa', tol: 20,
          ask: T(null,
            'Nel tubo largo l’acqua va a 1 m/s, nella strozzatura a <b>{v} m/s</b>. Di quanti pascal cala la pressione? (ΔP = ½·ρ·(v₂² − v₁²), con ρ = 1000 kg/m³)',
            'L’acqua accelera da 1 m/s a <b>{v} m/s</b>. Di quanto cala la pressione, in pascal? [[ΔP = ½ · ρ · (v₂² − v₁²)]]'),
          explain: T(null, 'Esatto: ½ × 1000 × ({v}² − 1²) = {ans:0} Pa.', 'Esatto: {ans:0} Pa. Ogni 98 Pa il tubicino scende di un centimetro.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Nello spruzzino del profumo, l’aria corre veloce sopra la cannuccia. Il profumo…'),
          options: [T('sale e viene spruzzato fuori'), T('scende in fondo al flacone'), T('resta fermo')],
          answer: 0,
          explain: T('Giusto: sopra la cannuccia l’aria corre e spinge meno, e il profumo viene spinto su!'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Se la strozzatura è molto stretta, il tubicino si svuota e risucchia aria. Perché?', 'Durante un uragano, a volte il tetto di una casa si stacca verso l’alto, anche se il vento non entra in casa. Perché?'),
          options: [T(null, 'lì la pressione scende sotto quella dell’aria', 'l’aria che corre sopra ha pressione più bassa'), T(null, 'l’acqua veloce evapora nel tubicino', 'il vento entra sotto le tegole e lo solleva come una vela'), T(null, 'il tubicino è troppo corto per l’acqua', 'la pioggia lo appesantisce e lo spezza')],
          answer: 0,
          explain: T(null, 'Esatto: così funzionano le pompe a getto d’acqua dei laboratori, che aspirano senza parti in movimento.', 'Esatto: l’aria ferma dentro casa spinge più di quella che corre sopra il tetto, e lo solleva.'),
        },
      ],
      hints: [T('Dove l’acqua corre, la cannuccia scende.', 'Velocità più alta, pressione più bassa.', 'Pressione ed energia di movimento si scambiano.')],
      solution: T(
        'Nella strozzatura l’acqua corre e spinge meno: la cannuccia scende.',
        'Principio di Bernoulli: dove v cresce, P cala.',
        'Lungo il tubo pressione ed energia di movimento si scambiano: dove l’acqua corre, la pressione cala.'),
    },
    {
      id: 'fl03-4', kind: 'lezione', title: 'L’ala nella galleria del vento',
      sim: 'flow', params: { mode: 'ala', shape: 'curva', alpha: 5, kmh: 150 }, controls: ['alpha', 'kmh'],
      intro: T(
        'Questa è una galleria del vento: un tunnel dove soffia un vento fortissimo. L’ala, un po’ inclinata, piega l’aria verso il basso, e l’aria la spinge verso l’alto: è la <b>portanza</b>. Prova a cambiare il vento e l’angolo!',
        'Un’ala inclinata di qualche grado, l’<b>angolo d’attacco</b>, devia l’aria verso il basso: sopra l’aria corre di più e la pressione cala, sotto cresce. Ne nasce una forza verso l’alto, la <b>portanza</b>: L = ½·ρ·v²·S·C. Cresce con il quadrato della velocità e con l’angolo, fino allo <b>stallo</b>.',
        'Un’ala è una macchina che spinge l’aria verso il basso: ogni secondo ne devia tonnellate, e per la terza legge l’aria la spinge in su. Bernoulli e Newton raccontano la stessa fisica: sopra l’ala la pressione cala, e dietro l’aria scende. [[L = ½ · ρ · v² · S · C]]'),
      steps: [
        {
          kind: 'free',
          text: T('Cambia il vento e l’angolo dell’ala.', 'Prova venti e angoli diversi, anche oltre i 15°.'),
          need: [
            { when: 'kmh >= 250', try: { kmh: 300 }, msg: T('Ora prova con il vento fortissimo.', 'Manca una prova con il vento ad almeno 250 km/h.') },
            { when: 'alpha >= 16', try: { alpha: 18 }, msg: T('Ora inclina tanto l’ala: più di 15 gradi.', 'Manca una prova con l’ala inclinata oltre i 15°.') },
          ],
        },
        {
          kind: 'q',
          text: T('Il vento va due volte più veloce. L’ala regge…', 'Se la velocità del vento raddoppia, la portanza…', 'Un aereo atterra a 250 km/h e vola a 900 km/h. Con la stessa ala e lo stesso angolo, quante volte più portanza avrebbe in volo?'),
          options: [T('quattro volte di più', 'quadruplica', 'circa 13 volte'), T('due volte di più', 'raddoppia', 'circa 3,6 volte'), T('uguale', 'resta uguale', 'la stessa')],
          answer: 0,
          explain: T('Giusto: vento doppio, e l’ala regge quattro volte di più! Prova con 150 e con 300 km/h.', 'Esatto: L cresce con v², e 2² = 4.', 'Esatto: 3,6 volte più veloce, e la portanza cresce con il quadrato: circa 13 volte. Per questo in volo l’ala sta quasi piatta, e per atterrare piano si allunga con i flap.'),
        },
        {
          kind: 'q',
          text: T('Inclini tantissimo l’ala, a 20 gradi. Che cosa succede?', 'Oltre un certo angolo la portanza crolla. Come si chiama?', 'Perché in stallo la portanza crolla, anche se l’ala è più inclinata?'),
          options: [T('l’aria si stacca e regge meno', 'stallo', 'l’aria si stacca dal dorso in vortici'), T('regge sempre di più', 'decollo', 'sotto l’ala l’aria si comprime e diventa più densa'), T('l’ala si spezza in due', 'virata', 'il vento cambia direzione e la spinge giù')],
          answer: 0,
          explain: T('Giusto: l’aria non riesce più a girare sopra l’ala, si stacca in vortici, e l’ala regge meno. Si chiama stallo.', 'Esatto: oltre i 14° circa, sul dorso l’aria si stacca e la portanza crolla.', 'Esatto: l’aria non riesce più a seguire la curva del dorso, e la depressione sopra l’ala sparisce.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La portanza.'),
          vals: { v: [[30, 40], [50, 60]] }, calc: '0.6 * v * v * 20', unit: 'N', tol: 100,
          ask: T(null,
            'Un’ala di 20 m², con C = 1, nel vento a <b>{v} m/s</b>. Quanta portanza dà? (L = ½·ρ·v²·S·C, con ρ = 1,2 kg/m³)',
            'Che portanza dà un’ala di 20 metri quadrati, con coefficiente 1, nel vento a <b>{v} m/s</b>? [[L = ½ · ρ · v² · S · C, con ρ = 1,2 kg/m³]]'),
          explain: T(null, 'Esatto: ½ × 1,2 × {v}² × 20 × 1 = {ans:0} N.', 'Esatto: {ans:0} N.'),
        },
        {
          kind: 'q',
          text: T('Perché gli aerei decollano contro il vento?', 'Perché gli aerei, quando possono, decollano controvento?', 'Perché le portaerei, per far decollare gli aerei, corrono controvento?'),
          options: [T('l’aria arriva più forte sull’ala', 'l’aria sull’ala va più veloce della pista', 'l’ala ha già vento prima di muoversi'), T('il vento li spinge in avanti', 'il vento spinge l’aereo in avanti', 'il vento spinge l’aereo dalla coda'), T('per non avere il sole negli occhi', 'per avere meno rumore in cabina', 'per non sporcare il ponte con il fumo dei motori')],
          answer: 0,
          explain: T('Giusto: conta il vento sull’ala. Con il vento contro, l’ala regge prima e la corsa è più corta.', 'Esatto: la portanza dipende dalla velocità dell’aria rispetto all’ala, non rispetto alla pista.', 'Esatto: conta la velocità dell’aria rispetto all’ala. Una portaerei a 55 km/h, contro un vento di 30 km/h, regala 85 km/h di vento all’ala prima ancora che l’aereo si muova.'),
        },
      ],
      hints: [T('Più vento e più angolo, più portanza: ma non troppo angolo!', 'L cresce con v² e con l’angolo, fino allo stallo.', 'Velocità doppia, portanza quadrupla.')],
      solution: T(
        'Vento due volte più forte: l’ala regge quattro volte di più. Troppo inclinata, stalla.',
        'L ∝ v²; oltre l’angolo di stallo C crolla.',
        'La portanza cresce con il quadrato della velocità e con l’angolo, fino allo stallo.'),
    },
    {
      id: 'fl03-5', kind: 'costruisci', title: 'L’idrovolante del porto',
      sim: 'flow', params: { mode: 'decollo', m: 300, S: 4, mark: 150 }, controls: ['S'],
      intro: T(
        'Al porto arriva un idrovolante: un aereo che decolla dall’acqua! Deve staccarsi prima della boa gialla, a metà della corsa. Tu scegli quanto è grande l’ala: più è grande, prima si stacca, ma un’ala troppo grande pesa e frena in volo.',
        'Costruisci l’ala dell’idrovolante del porto. Corre sull’acqua accelerando, e in 300 m arriva a 130 km/h; deve staccarsi entro la boa, a 150 m. Si stacca quando la portanza pareggia il peso. Un’ala più grande del necessario pesa e frena: scegli la più piccola che basta.',
        'L’idrovolante del porto deve staccarsi dall’acqua entro la boa, a metà della corsa. Ogni metro quadrato d’ala in più aiuta a decollare, ma in volo pesa e frena: il progettista cerca l’ala più piccola che basta. [[si stacca quando ½ · ρ · v² · S · C = m · g]]'),
      piece: { id: 'idrovolante', name: 'L’idrovolante del porto', desc: 'Un idrovolante che si stacca dall’acqua: l’ala lo regge quando la portanza pareggia il peso.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto è grande l’ala, poi lancia l’idrovolante.', 'Regola la superficie dell’ala, poi lancia: si stacca prima della boa?'),
          vals: { e: { m: [[300], [500]] }, s: { m: [[350, 450], [550, 650]] } },
          set: { m: 'm' },
          ask: T(
            'L’idrovolante pesa <b>{m} kg</b>. Quanto deve essere grande l’ala, come minimo, per staccarsi prima della boa?',
            'Idrovolante da <b>{m} kg</b>: qual è l’ala più piccola che lo fa staccare prima della boa, a 150 m?',
            'Con <b>{m} kg</b> a bordo, qual è l’ala più piccola che stacca l’idrovolante dall’acqua entro la boa?'),
          measure: 'S', goal: 'm / 50', tol: 0.2,
          ok: T('Si stacca proprio alla boa!', 'Si stacca alla boa, con l’ala più piccola possibile!'),
          high: T('Decolla, ma l’ala è più grande del necessario: rimpiccioliscila.', 'Si stacca prima della boa, ma l’ala è più grande del minimo: riducila.'),
          low: T('Troppo piccola: non si stacca in tempo. Ingrandiscila!', 'Troppo piccola: si stacca dopo la boa, o non si stacca. Ingrandiscila.'),
          solve: { S: 'm / 50' },
        },
        {
          kind: 'q',
          text: T('Se l’idrovolante pesa il doppio, l’ala deve essere…', 'Con il doppio del carico, per staccarsi alla stessa boa, l’ala deve…', 'Perché gli aerei di linea più pesanti hanno bisogno di piste più lunghe?'),
          options: [T('grande il doppio', 'raddoppiare', 'serve più velocità per reggere il peso'), T('grande uguale', 'restare uguale', 'frenano peggio degli aerei leggeri, all’atterraggio'), T('grande il quadruplo', 'quadruplicare', 'hanno motori meno potenti')],
          answer: 0,
          explain: T('Giusto: peso doppio, ala doppia. Alla boa ogni metro quadrato d’ala regge 50 kg.', 'Esatto: alla stessa velocità la portanza è proporzionale alla superficie, e deve pareggiare un peso doppio.', 'Esatto: più peso vuol dire una velocità di decollo più alta, e per arrivarci accelerando serve più strada.'),
        },
      ],
      hints: [T('Alla boa ogni metro quadrato d’ala regge 50 kg.', 'Alla boa va a 92 km/h: lì ogni m² d’ala regge 50 kg.', 'Alla boa, ogni metro quadrato d’ala regge circa 50 kg.')],
      solution: T('300 kg: 6 metri quadrati. 500 kg: 10 metri quadrati.', 'S = m / 50: per 450 kg, 9 m².', 'Un metro quadrato d’ala ogni 50 kg.'),
    },
    {
      id: 'fl03-6', kind: 'ripasso', title: 'Ripasso dei fluidi in movimento',
      intro: T('Ripassiamo: l’aria e l’acqua che corrono, e le ali!', 'Ripasso: portata, Bernoulli e portanza.', 'Ripasso: dalla canna dell’acqua alle ali degli aerei.'),
      steps: [
        {
          kind: 'q',
          text: T('Soffi fra due palloncini appesi vicini. Che cosa fanno?', 'Due palloncini appesi vicini: soffi forte nello spazio in mezzo. Perché si avvicinano?', 'Perché le auto da corsa montano alettoni a forma di ala capovolta?'),
          options: [T('si avvicinano', 'in mezzo l’aria corre e la pressione cala', 'per restare schiacciate a terra'), T('si allontanano', 'il soffio li attira come una calamita', 'per volare sopra i dossi della pista'), T('restano fermi', 'il soffio li scalda e li gonfia', 'per raffreddare il motore')],
          answer: 0,
          explain: T('Giusto: come i fogli, si avvicinano!', 'Esatto: come i fogli. L’aria ferma intorno spinge più di quella che corre.', 'Esatto: l’ala capovolta spinge verso il basso, e le gomme fanno più presa in curva.'),
        },
        {
          kind: 'q',
          text: T('Un tubo si stringe a metà. L’acqua lì corre…', 'Portata costante: se la sezione diventa un quarto, la velocità…', 'Il getto d’acqua di un rubinetto, cadendo, si assottiglia. Perché?'),
          options: [T('due volte più veloce', 'quadruplica', 'accelera cadendo, e la stessa portata passa in meno sezione'), T('due volte più piano', 'raddoppia', 'l’aria lo schiaccia ai lati'), T('alla stessa velocità', 'si riduce a un quarto', 'una parte dell’acqua evapora')],
          answer: 0,
          explain: T('Giusto: metà spazio, il doppio della velocità.', 'Esatto: A·v costante: sezione un quarto, velocità quadrupla.', 'Esatto: la gravità accelera l’acqua, e con la stessa portata la sezione deve stringersi.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La continuità.'),
          vals: { v: [0.5, 1, 1.5, 2] }, calc: 'v * 4', unit: 'm/s', tol: 0.1,
          ask: T(null,
            'In un tubo da 8 cm² l’acqua va a <b>{v} m/s</b>; poi passa in un tratto da 2 cm². A che velocità?',
            'L’acqua entra a <b>{v} m/s</b> in un tubo che si stringe a un quarto della sezione. A che velocità esce? [[A₁ · v₁ = A₂ · v₂]]'),
          explain: T(null, 'Esatto: sezione un quarto, velocità quattro volte: {ans:1} m/s.', 'Esatto: {ans:1} m/s.'),
        },
        {
          kind: 'q',
          text: T('Dove l’aria o l’acqua corre veloce, spinge…', 'Principio di Bernoulli: dove la velocità del fluido cresce, la pressione…', 'Il principio di Bernoulli, alla fine, è la conservazione di che cosa?'),
          options: [T('meno', 'cala', 'dell’energia'), T('di più', 'cresce', 'della massa'), T('uguale', 'resta uguale', 'della quantità di moto')],
          answer: 0,
          explain: T('Giusto: più corre, meno spinge.', 'Esatto: P + ½·ρ·v² resta costante.', 'Esatto: pressione ed energia di movimento, per ogni metro cubo, si scambiano senza perdersi. [[P + ½ · ρ · v² = costante]]'),
        },
        {
          kind: 'q',
          text: T('Per reggere più peso, l’aereo deve…', 'Un aereo deve reggere più peso alla stessa velocità. Che cosa può fare?', 'Perché d’estate, in un aeroporto di montagna, gli aerei hanno bisogno di piste più lunghe?'),
          options: [T('correre di più, o avere ali più grandi', 'ali più grandi, o più inclinate', 'l’aria è meno densa: per la stessa portanza serve più velocità'), T('fare il pieno di carburante', 'motori più rumorosi', 'c’è meno gravità e l’aereo scivola'), T('accendere le luci di bordo', 'volare più vicino alle nuvole', 'il caldo fa rendere di più i motori')],
          answer: 0,
          explain: T('Giusto: più vento sull’ala, o più ala, e regge di più.', 'Esatto: L = ½·ρ·v²·S·C: a parità di v, devono crescere S o C.', 'Esatto: in quota e con il caldo l’aria è meno densa, e nella portanza conta anche la densità dell’aria. [[L = ½ · ρ · v² · S · C]]'),
        },
      ],
    },
    {
      id: 'fl03-7', kind: 'boss', title: 'Il mito dell’ala curva',
      sim: 'flow', params: { mode: 'ala', shape: 'piatta', alpha: 0, kmh: 150 }, controls: ['shape', 'alpha'],
      intro: T(
        'Sono Vetrino. Un signore al porto dice: <i>“Gli aerei volano solo perché l’ala è curva sopra. Un’ala piatta, o capovolta, non regge niente!”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito, che trovi anche in tanti libri: <i>“l’ala regge perché è curva sopra: l’aria di sopra fa più strada, deve arrivare in fondo insieme a quella di sotto, e così corre di più. Un’ala piatta o capovolta non regge niente”</i>. Mettiamolo alla prova.',
        'Sono Vetrino. La spiegazione più diffusa del volo: l’aria sopra l’ala curva fa più strada, e per arrivare in fondo insieme a quella di sotto deve correre di più. Quindi, senza dorso curvo, niente portanza. Eppure gli aerei acrobatici volano a testa in giù. Mettiamolo alla prova.'),
      steps: [
        {
          kind: 'q',
          text: T('Per controllare il mito, che cosa cambi fra una prova e l’altra?', 'Per mettere alla prova il mito, che cosa cambi, e che cosa tieni uguale?', 'Come si progetta una prova onesta del mito?'),
          options: [T('solo la forma dell’ala', 'solo la forma, a vento e angolo fissi', 'si cambia solo la forma, poi si ripete a un altro angolo'), T('la forma, il vento e l’angolo insieme', 'forma, vento e angolo, tutti insieme', 'si prova solo l’ala curva, quella del mito'), T('niente: basta una prova', 'solo il vento, lasciando la stessa ala', 'si cambia tutto insieme, per fare prima')],
          answer: 0,
          explain: T('Giusto: una cosa alla volta, così sai che cosa conta.', 'Esatto: se cambi una cosa sola, sai a chi dare il merito.', 'Esatto: una cosa alla volta, e poi la stessa prova in altre condizioni.'),
        },
        {
          kind: 'free',
          text: T('Prova l’ala piatta e quella capovolta: prima dritte, poi inclinate.', 'Prova l’ala piatta e quella capovolta, a 0° e poi inclinate di qualche grado.'),
          need: [
            { when: "shape == 'piatta' && alpha >= 6", try: { shape: 'piatta', alpha: 8 }, msg: T('Prova l’ala piatta, inclinata di 8 gradi.', 'Manca una prova con l’ala piatta inclinata di almeno 6°.') },
            { when: "shape == 'rovescia' && alpha >= 8", try: { shape: 'rovescia', alpha: 10 }, msg: T('Ora l’ala capovolta, inclinata di 10 gradi.', 'Manca una prova con l’ala capovolta inclinata di almeno 8°.') },
          ],
        },
        {
          kind: 'q',
          text: T('L’ala piatta, inclinata di 8 gradi nel vento: regge qualcosa?', 'Che cosa fa l’ala piatta inclinata di 8°, nel vento a 150 km/h?', 'Perché un’ala piatta inclinata regge?'),
          options: [T('sì, regge', 'regge, un po’ meno di quella curva', 'devia l’aria verso il basso, e l’aria la spinge su'), T('no, niente', 'niente: senza curva non c’è portanza', 'l’aria sopra fa più strada di quella sotto'), T('la spinge giù', 'spinge l’ala verso il basso', 'la vibrazione del vento la tiene su')],
          answer: 0,
          explain: T('Giusto: regge circa 85 kg! Anche un aeroplanino di carta ha le ali piatte.', 'Esatto: circa 830 N, due terzi dell’ala curva allo stesso angolo.', 'Esatto: inclinata, l’ala piega l’aria verso il basso; sopra la pressione cala e sotto cresce.'),
        },
        {
          kind: 'q',
          text: T('Gli aerei acrobatici volano a testa in giù. Come fanno?', 'L’ala capovolta, a 0°, spinge in giù. Come vola a testa in giù un aereo acrobatico?', 'Per la portanza, che cosa conta di più: la forma o l’angolo?'),
          options: [T('alzano il muso, e l’ala regge', 'alza il muso, e l’ala capovolta regge', 'l’angolo: la curva aiuta, ma non è indispensabile'), T('spengono il motore', 'va più piano, così l’ala capovolta non spinge giù', 'la forma: senza curva non si vola'), T('non possono: cadono sempre', 'non può farlo a lungo: dopo pochi secondi cade', 'nessuna delle due: conta solo il motore')],
          answer: 0,
          explain: T('Giusto: con il muso alzato, l’ala capovolta piega l’aria in giù e regge l’aereo.', 'Esatto: oltre i 4° l’ala capovolta dà portanza, e a 10° regge già bene.', 'Esatto: l’angolo decide se l’aria viene piegata in giù; la curva aiuta, e permette angoli più piccoli.'),
        },
        {
          kind: 'q', review: false,
          text: T('Il mito dice: «senza ala curva non si vola». È vero?', 'Il mito: «un’ala piatta o capovolta non regge niente». Che cosa concludi?', '«L’aria sopra deve arrivare in fondo insieme a quella sotto, e senza dorso curvo niente portanza»: dopo la prova, che cosa ne pensi?'),
          options: [T('no: anche l’ala piatta regge, se è inclinata', 'falso: inclinate, reggono tutte', 'falso: conta come l’ala devia l’aria, non i tempi uguali'), T('sì: serve la curva', 'vero: senza curva l’aria non corre', 'vero: è la spiegazione dei libri'), T('sì, ma solo con tanto vento', 'vero solo per le ali piccole', 'vero solo a bassa velocità')],
          answer: 0,
          explain: T('Mito smontato! Anche un aeroplanino di carta, con le ali piatte, vola: basta inclinarle.', 'Mito smontato: l’ala piatta e quella capovolta reggono, se inclinate. La curva aiuta, ma non è indispensabile.', 'Mito smontato: sopra l’ala l’aria corre davvero di più, ma arriva in fondo prima di quella sotto, non insieme. E ogni ala che devia l’aria verso il basso regge.'),
        },
      ],
      hints: [T('Prova l’ala piatta inclinata.', 'Cambia la forma, poi l’angolo: una cosa alla volta.', 'Confronta le forme allo stesso angolo, poi cambia l’angolo.')],
      solution: T(
        'Anche l’ala piatta e quella capovolta reggono, se inclinate: il mito è falso.',
        'Inclinata, ogni ala devia l’aria in giù e regge: il mito è falso.',
        'Conta l’angolo più della curva: il mito è falso.'),
    },
  ],
};
