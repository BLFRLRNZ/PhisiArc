// O01 · Molle e oscillazioni. Simulazione: le molle (spring.js), in sei modi: la molla con i pesi e il righello, il peso
// che oscilla e scrive il suo grafico, il blocco sulla molla con le barre dell'energia, il cavallino a molla del parco,
// l'ombra di una pallina che gira, il pendolo e la molla sulla Terra e sulla Luna.
// La zona parte dalla legge di Hooke, prevede da che cosa dipende il ritmo di una molla, arriva a periodo e frequenza,
// costruisce il cavallino a molla, segue l'energia che va e viene, scopre che un'oscillazione è l'ombra di un giro e
// finisce con il mito della Luna lenta.
import { T } from '../util.js';

export default {
  id: 'O01',
  title: 'Molle e oscillazioni',
  levels: [
    {
      id: 'o01-1', kind: 'lezione', title: 'La legge di Hooke',
      sim: 'spring', params: { mode: 'hooke', w: 100, k: 20 }, controls: ['w', 'k'], labels: { k: { min: 10, max: 60, step: 5 } },
      intro: T(
        'Appendi un peso a una molla: si allunga. Appendine due uguali: si allunga il doppio! Tre pesi, il triplo. Le molle sono oneste: tanto le tiri, tanto si allungano. Prova con pesi diversi, e con molle più dure o più morbide.',
        'Una molla tirata risponde con una forza proporzionale all’allungamento: <b>F = k·x</b>, la <b>legge di Hooke</b> (1678). La <b>costante elastica</b> k dice quanto è dura la molla, in newton per metro: una molla con k = 20 N/m si allunga di 1 cm per ogni 0,2 N.',
        'Robert Hooke, 1678: <i>ut tensio, sic vis</i>, cioè come l’allungamento, così la forza. Finché non la si deforma troppo, ogni molla risponde in proporzione a quanto la si tira: è il principio dei dinamometri e delle bilance a molla. [[F = k · x]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova pochi pesi e tanti pesi.', 'Prova pesi diversi: 100 g o meno, e 250 g o più.'),
          need: [
            { when: 'w > 0 && w <= 100', try: { w: 100 }, msg: T('Prova con pochi pesi: 100 grammi o meno.', 'Manca una prova con 100 g o meno.') },
            { when: 'w >= 250', try: { w: 250 }, msg: T('Ora tanti pesi: 250 grammi o più.', 'Manca una prova con 250 g o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con il doppio dei pesi, la molla si allunga…', 'Una molla si allunga di 4 cm con 100 g. Con 300 g si allunga di…', 'Che cosa dice la retta del grafico forza–allungamento?'),
          options: [T('il doppio', '12 cm', 'che forza e allungamento sono proporzionali'), T('uguale', '4 cm', 'che la molla si stanca a ogni peso'), T('la metà', '7 cm', 'che la forza cresce più in fretta dell’allungamento')],
          answer: 0,
          explain: T('Giusto: il doppio del peso, il doppio dell’allungamento.', 'Esatto: il triplo del peso, il triplo dell’allungamento.', 'Esatto: una retta che parte da zero vuol dire proporzionalità.'),
        },
        {
          kind: 'q',
          text: T('Una molla più dura, con lo stesso peso, si allunga…', 'Che cosa misura la costante elastica k?', 'Come funziona un dinamometro, la bilancia a molla?'),
          options: [T('di meno', 'quanto è dura la molla', 'è una molla con una scala in newton'), T('di più', 'quanto è lunga la molla', 'confronta il peso con un contrappeso'), T('uguale', 'quanto pesa la molla', 'conta le spire della molla, una per ogni newton')],
          answer: 0,
          explain: T('Giusto: la molla dura cede poco.', 'Esatto: è la forza per ogni metro di allungamento; con k grande serve tanta forza.', 'Esatto: l’allungamento è proporzionale alla forza, e il righello è tarato in newton.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'L’allungamento.'),
          vals: { m: [[100, 200], [150, 250]], k: [[20], [40]] }, derive: { F: 'm / 1000 * 9.81' }, calc: 'm / 1000 * 9.81 / k * 100', unit: 'cm', tol: 0.2,
          ask: T(null,
            'Appendi <b>{m} g</b> a una molla con k = <b>{k} N/m</b>. Di quanti centimetri si allunga? (g = 9,81 m/s²)',
            'Una massa di <b>{m} g</b> appesa a una molla da <b>{k} N/m</b>: allungamento, in centimetri? [[x = m · g / k]]'),
          explain: T(null, 'Esatto: F = {F} N, e x = F / k = {ans:1} cm.', 'Esatto: {ans:1} cm.'),
        },
        {
          kind: 'q',
          text: T('Se tiri troppo forte una molla…', 'Che cosa succede se si tira una molla oltre il suo limite di elasticità?', 'Perché la legge di Hooke vale solo per allungamenti non troppo grandi?'),
          options: [T('resta storta', 'si deforma per sempre', 'oltre un limite il materiale cede'), T('diventa più dura', 'diventa più dura e si allunga meno', 'perché le molle lunghe si stancano prima'), T('diventa più corta', 'la sua forza diventa zero', 'perché la gravità cambia con l’altezza')],
          answer: 0,
          explain: T('Giusto: una molla tirata troppo resta storta.', 'Esatto: fino al limite torna indietro, oltre resta deformata.', 'Esatto: fino al limite le spire si piegano e tornano; oltre, il metallo cede.'),
        },
      ],
      hints: [T('Il doppio del peso, il doppio dell’allungamento.', 'F = k·x: con x in metri e k in N/m.', 'Forza e allungamento sono proporzionali: il loro rapporto è sempre k.')],
      solution: T(
        'La molla si allunga in proporzione al peso: il doppio del peso, il doppio dell’allungamento.',
        'x = F / k: con 200 g e k = 20 N/m, circa 9,8 cm.',
        'Legge di Hooke: forza proporzionale all’allungamento, finché la molla non si sforma.'),
    },
    {
      id: 'o01-2', kind: 'prevedi', title: 'Il peso che balla',
      sim: 'spring', params: { mode: 'oscilla', m: 0.5, k: 20, A: 6 }, controls: [],
      intro: T(
        'Tira giù un peso appeso a una molla e lascialo andare: su e giù, su e giù! Quanto dura un’oscillazione? Cambia se il peso è più grande, se la molla è più dura, se lo tiri di più? Prima indovina, poi guarda.',
        'Un peso appeso a una molla, tirato giù e lasciato andare, oscilla su e giù sempre con lo stesso ritmo: il <b>periodo</b> T è il tempo di un’oscillazione completa. Da che cosa dipende? Prevedi, poi guarda.',
        'Una massa su una molla è l’oscillatore più semplice che esista: niente attriti, e una forza che la riporta sempre verso il centro, tanto più forte quanto più è lontana. Il periodo dipende dalla massa, dalla molla, da quanto la si tira? Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ m: 2 }],
          text: T('Ora un peso quattro volte più grande. Le oscillazioni…', 'La massa passa da 0,5 a 2 kg, quattro volte tanto. Il periodo…', 'Massa quadruplicata, stessa molla: il periodo…'),
          options: [T('diventano più lente', 'raddoppia', 'raddoppia'), T('diventano più veloci', 'diventa quattro volte più lungo', 'quadruplica'), T('restano proprio uguali', 'resta uguale', 'si dimezza')],
          answer: 0,
          explain: T('Giusto: un peso più grande è più pigro da muovere, e oscilla più piano.', 'Esatto: 4 volte la massa, 2 volte il periodo. Conta la radice della massa.', 'Esatto: il periodo va come la radice della massa.'),
          solution: T('Più lente.', 'Raddoppia.'),
        },
        {
          kind: 'q', predict: [{ m: 0.5, k: 80 }],
          text: T('Stesso peso, molla quattro volte più dura. Le oscillazioni…', 'Stessa massa, molla con k quattro volte più grande. Il periodo…', 'Molla quattro volte più dura, stessa massa: il periodo…'),
          options: [T('diventano più veloci', 'si dimezza', 'si dimezza'), T('diventano più lente', 'raddoppia', 'quadruplica'), T('restano uguali', 'resta uguale', 'resta uguale: la massa è quella')],
          answer: 0,
          explain: T('Giusto: la molla dura spinge forte e riporta subito indietro il peso.', 'Esatto: k quattro volte più grande, periodo dimezzato.', 'Esatto: il periodo va come uno diviso la radice della durezza.'),
          solution: T('Più veloci.', 'Si dimezza.'),
        },
        {
          kind: 'q', predict: [{ m: 0.5, k: 20, A: 10 }],
          text: T('Stesso peso e stessa molla, ma lo tiri giù di più. Le oscillazioni…', 'Stessa massa e stessa molla, tirata di 10 cm invece di 6. Il periodo…', 'Ampiezza da 6 a 10 cm, stessa massa e stessa molla: il periodo…'),
          options: [T('durano uguale', 'resta uguale', 'resta uguale'), T('diventano più lente', 'cresce', 'cresce, perché la strada è più lunga'), T('diventano più veloci', 'cala', 'cala, perché la forza è più grande')],
          answer: 0,
          explain: T('Giusto: va più lontano, ma anche più veloce, e ci mette lo stesso tempo.', 'Esatto: il periodo non dipende dall’ampiezza.', 'Esatto: strada più lunga e forza più grande si compensano esattamente.'),
          solution: T('Durano uguale.', 'Resta uguale.'),
        },
        {
          kind: 'q',
          text: T('Allora, quanto dura un’oscillazione dipende…', 'Da che cosa dipende il periodo di una massa su una molla?', 'Che cosa hanno in comune la molla e il pendolo del Laboratorio?'),
          options: [T('dal peso e dalla molla', 'da m e da k', 'il ritmo non dipende da quanto li tiri'), T('solo da quanto la tiri', 'solo da quanto la tiri', 'il ritmo dipende dalla massa appesa'), T('da niente', 'solo dalla massa', 'il ritmo dipende solo dalla lunghezza')],
          answer: 0,
          explain: T('Giusto: peso e molla decidono il ritmo; quanto la tiri no.', 'Esatto: dipende dalla massa e dalla durezza della molla, non da quanto la tiri.', 'Esatto: per oscillazioni piccole, tutti e due tengono il tempo come un orologio.'),
        },
      ],
      hints: [T('Peso più grande, oscillazioni più lente; molla più dura, più veloci.', 'Il periodo dipende da m e da k, non dall’ampiezza.', 'Il periodo va come la radice della massa divisa per la durezza.')],
    },
    {
      id: 'o01-3', kind: 'lezione', title: 'Il ritmo della molla',
      sim: 'spring', params: { mode: 'oscilla', m: 0.5, k: 20, A: 6 }, controls: ['m', 'k', 'A'],
      intro: T(
        'Un peso su una molla fa sempre oscillazioni uguali, come un orologio. Puoi contare quanto dura un’oscillazione, oppure quante oscillazioni fa in un secondo. Più il peso è grande, più va piano; più la molla è dura, più va veloce.',
        'Il <b>periodo</b> T è il tempo di un’oscillazione completa; la <b>frequenza</b> f = 1/T è il numero di oscillazioni in un secondo, e si misura in <b>hertz</b> (Hz). Per una massa su una molla <b>T = 2π·√(m/k)</b>. Una molla che fa 2 oscillazioni al secondo ha f = 2 Hz e T = 0,5 s.',
        'Periodo e frequenza sono due modi di dire la stessa cosa: quanto dura un’oscillazione, o quante ne stanno in un secondo. Per la massa sulla molla il periodo cresce con la radice della massa e cala con la radice della durezza. [[T = 2π · √(m / k), f = 1 / T]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un peso leggero e uno pesante.', 'Prova una massa di 0,3 kg o meno, e una di 1,5 kg o più.'),
          need: [
            { when: 'm <= 0.3', try: { m: 0.3 }, msg: T('Prova un peso leggero.', 'Manca una prova con 0,3 kg o meno.') },
            { when: 'm >= 1.5', try: { m: 1.5 }, msg: T('Ora un peso pesante.', 'Manca una prova con 1,5 kg o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Una molla fa 2 oscillazioni ogni secondo. Quanto dura un’oscillazione?', 'Un’oscillazione dura 0,25 s. Qual è la frequenza?', 'Il cuore batte 72 volte al minuto. Qual è la frequenza, in hertz?'),
          options: [T('mezzo secondo', '4 Hz', '1,2 Hz'), T('2 secondi', '0,25 Hz', '72 Hz'), T('un secondo', '25 Hz', '0,83 Hz')],
          answer: 0,
          explain: T('Giusto: due oscillazioni in un secondo, mezzo secondo ciascuna.', 'Esatto: f = 1/T = 1/0,25 = 4 Hz.', 'Esatto: 72 battiti in 60 secondi, 1,2 al secondo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il periodo della molla.'),
          vals: { m: [[0.5, 2], [1]], k: [[20], [40, 10]] }, calc: '2 * Math.PI * Math.sqrt(m / k)', unit: 's', tol: 0.02,
          ask: T(null,
            'Una massa di <b>{m} kg</b> su una molla con k = <b>{k} N/m</b>. Quanto dura un’oscillazione?',
            'Massa <b>{m} kg</b>, molla da <b>{k} N/m</b>: quanti secondi dura un’oscillazione? [[T = 2π · √(m / k)]]'),
          explain: T(null, 'Esatto: T = 2π·√({m}/{k}) = {ans:2} s.', 'Esatto: {ans:2} s.'),
        },
        {
          kind: 'q',
          text: T('Per far oscillare più in fretta un peso, metti…', 'Come si raddoppia la frequenza di una massa su una molla?', 'Perché un’auto carica di persone oscilla più lentamente sulle sue molle?'),
          options: [T('una molla più dura', 'con una molla quattro volte più dura', 'più massa sulle stesse molle: periodo più lungo'), T('un peso più grande', 'raddoppiando la massa appesa', 'le molle cariche si scaldano e si ammorbidiscono'), T('una molla più morbida', 'tirandola il doppio prima di lasciarla', 'il peso delle persone frena il motore')],
          answer: 0,
          explain: T('Giusto: la molla dura riporta indietro il peso più in fretta.', 'Esatto: k quattro volte più grande, periodo dimezzato, frequenza doppia.', 'Esatto: più massa, stessa durezza: il periodo cresce come la radice della massa.'),
        },
      ],
      hints: [T('Peso grande, oscillazioni lente; molla dura, oscillazioni veloci.', 'T = 2π·√(m/k) e f = 1/T.', 'Raddoppiare la frequenza vuol dire dimezzare il periodo: massa diviso durezza quattro volte più piccola.')],
      solution: T(
        'Un’oscillazione dura poco con un peso leggero e una molla dura.',
        'Con 0,5 kg e k = 20 N/m: T ≈ 0,99 s, f ≈ 1 Hz.',
        'Il periodo cresce come la radice della massa e cala come la radice della durezza.'),
    },
    {
      id: 'o01-4', kind: 'costruisci', title: 'Il cavallino a molla',
      sim: 'spring', params: { mode: 'cavallino', m: 30, k: 500 }, controls: ['k'], labels: { k: { min: 200, max: 3000, step: 10 } },
      intro: T(
        'Nel parco arriva il cavallino a molla! Ci sali sopra e dondoli su e giù. Ma deve dondolare con il ritmo giusto: un dondolio al secondo, come il tic-tac di un orologio. Scegli quanto dura deve essere la molla.',
        'Costruisci il cavallino a molla del parco: deve fare un’oscillazione al secondo, cioè T = 1 s, con il bambino sopra. Dalla formula del periodo ricavi la costante elastica che serve: più massa, più dura deve essere la molla.',
        'Il cavallino a molla del parco: una massa, bambino più cavallino, su una molla grossa. Per avere un periodo di un secondo, la durezza della molla deve crescere in proporzione alla massa. [[k = 4π² · m / T²]]'),
      piece: { id: 'cavallino', name: 'Il cavallino a molla', desc: 'Una molla dura quanto basta: con il bambino sopra fa un dondolio al secondo.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto è dura la molla, poi lancia.', 'Regola la costante elastica, poi lancia: deve fare un’oscillazione al secondo.'),
          vals: { e: { m: [[30], [40]] }, s: { m: [[25, 35], [45, 50]] } },
          set: { m: 'm' },
          ask: T(
            'Cavallino e bambino insieme pesano <b>{m} kg</b>. Quanto dura deve essere la molla?',
            'Massa totale <b>{m} kg</b>: che costante elastica serve per avere T = 1 s?',
            'Massa <b>{m} kg</b>, un’oscillazione al secondo: quale costante elastica?'),
          measure: 'k', goal: '4 * Math.PI ** 2 * m', tol: 40,
          ok: T('Perfetto: un dondolio al secondo!', 'Esatto: T = 1 s.'),
          high: T('Troppo dura: dondola troppo in fretta. Ammorbidiscila.', 'Troppo dura: il periodo è sotto 1 s. Abbassa k.'),
          low: T('Troppo morbida: dondola troppo piano. Indurisci la molla!', 'Troppo morbida: il periodo supera 1 s. Alza k.'),
          solve: { k: 'Math.round(4 * Math.PI ** 2 * m / 10) * 10' },
        },
        {
          kind: 'q',
          text: T('Se sale un bambino più pesante, il cavallino dondola…', 'Se sale un bambino più pesante, il periodo…', 'Con il doppio della massa, per restare a un secondo, la costante elastica deve…'),
          options: [T('più piano', 'si allunga: servirebbe una molla più dura', 'raddoppiare'), T('più in fretta', 'si accorcia, perché la molla si schiaccia', 'quadruplicare'), T('uguale', 'resta uguale: la molla è la stessa', 'restare uguale')],
          answer: 0,
          explain: T('Giusto: più peso, dondolio più lento.', 'Esatto: più massa sulla stessa molla, periodo più lungo.', 'Esatto: con il periodo fisso, k è proporzionale alla massa.'),
        },
      ],
      hints: [T('Per 30 kg circa 1180, per 40 kg circa 1580.', 'k = 4π²·m / T², con T = 1 s: circa 39,5 per ogni kg.', 'Con il periodo fisso, la durezza è proporzionale alla massa: circa 39,5 N/m per kg.')],
      solution: T('Circa 1180 per 30 kg, circa 1580 per 40 kg.', 'k = 4π²·m: per 35 kg circa 1380 N/m.', 'Per 45 kg servono circa 1780 N/m.'),
    },
    {
      id: 'o01-5', kind: 'lezione', title: 'L’energia che va e viene',
      sim: 'spring', params: { mode: 'energia', A: 8, attrito: false }, controls: ['A', 'attrito'],
      intro: T(
        'Quando tiri la molla, le dai energia. Lasciandola andare, quell’energia diventa movimento, poi torna nella molla, poi di nuovo movimento… Va e viene! Senza attrito durerebbe per sempre; con l’attrito, piano piano diventa calore.',
        'Una molla tirata immagazzina <b>energia elastica</b>, E = ½·k·x². Lasciata andare, l’energia passa al blocco come energia cinetica, poi torna nella molla, avanti e indietro: la somma resta costante. Con l’attrito, una parte diventa calore e l’oscillazione si spegne.',
        'Nell’oscillatore l’energia rimbalza fra due forme: tutta elastica agli estremi, tutta cinetica al centro, dove il blocco è più veloce. Senza attriti la somma è costante; con l’attrito l’ampiezza cala a ogni oscillazione, mentre il periodo quasi non cambia. [[E = ½ · k · x²]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova senza attrito e con l’attrito.', 'Prova senza attrito e con l’attrito, e guarda le barre dell’energia.'),
          need: [
            { when: '!attrito', try: { attrito: false }, msg: T('Prova senza attrito.', 'Manca una prova senza attrito.') },
            { when: 'attrito', try: { attrito: true }, msg: T('Ora accendi l’attrito.', 'Manca una prova con l’attrito.') },
          ],
        },
        {
          kind: 'q',
          text: T('Dove va più veloce il blocco?', 'Quando il blocco passa dal centro, la sua energia è…', 'Raddoppi l’ampiezza dell’oscillazione. L’energia…'),
          options: [T('nel mezzo', 'tutta cinetica: la molla lì non è tirata', 'quadruplica'), T('agli estremi', 'tutta elastica', 'raddoppia'), T('va sempre veloce uguale', 'zero, perché il blocco è proprio a metà della sua strada', 'resta uguale')],
          answer: 0,
          explain: T('Giusto: nel mezzo tutta l’energia è movimento.', 'Esatto: al centro la molla è a riposo, e il blocco ha la velocità massima.', 'Esatto: l’energia va come il quadrato dell’ampiezza.'),
        },
        {
          kind: 'q',
          text: T('Con l’attrito, l’energia del movimento…', 'Con l’attrito, che cosa succede all’oscillazione?', 'Perché gli ammortizzatori dell’auto sono pieni d’olio?'),
          options: [T('diventa calore', 'l’ampiezza cala', 'trasforma in calore le oscillazioni'), T('sparisce nel nulla', 'il periodo si allunga di tanto', 'per lubrificare le molle'), T('torna tutta nella molla', 'il blocco si ferma subito', 'per fare peso sulle ruote e tenere l’auto più bassa')],
          answer: 0,
          explain: T('Giusto: l’attrito scalda, e l’oscillazione si spegne piano piano.', 'Esatto: l’energia diventa calore, e le oscillazioni si fanno sempre più piccole, con quasi lo stesso ritmo.', 'Esatto: così l’auto non continua a saltellare dopo ogni buca.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'L’energia elastica.'),
          vals: { A: [[5, 10], [8]] }, derive: { Am: 'A / 100' }, calc: '0.5 * 40 * (A / 100) ** 2 * 1000', unit: 'mJ', tol: 1,
          ask: T(null,
            'Una molla con k = 40 N/m è tirata di <b>{A} cm</b>. Quanta energia elastica contiene, in millijoule?',
            'Molla da 40 N/m tirata di <b>{A} cm</b>: energia elastica, in millijoule? [[E = ½ · k · x²]]'),
          explain: T(null, 'Esatto: ½ × 40 × {Am}² J = {ans:0} mJ.', 'Esatto: {ans:0} mJ.'),
        },
      ],
      hints: [T('L’energia va e viene fra la molla e il movimento.', 'E = ½·k·x²: al centro è tutta cinetica.', 'Senza attriti l’energia totale è costante; con l’attrito diventa calore.')],
      solution: T(
        'L’energia passa dalla molla al movimento e torna indietro; con l’attrito diventa calore.',
        'E = ½·k·A²: con 8 cm e k = 40 N/m, 128 mJ.',
        'Energia elastica agli estremi, cinetica al centro; l’attrito la trasforma in calore.'),
    },
    {
      id: 'o01-6', kind: 'lezione', title: 'L’ombra di un giro',
      sim: 'spring', params: { mode: 'ombra', m: 0.5 }, controls: ['m'],
      intro: T(
        'Guarda una pallina che gira su una ruota, illuminata di lato: la sua ombra sul muro va su e giù, su e giù… proprio come il peso appeso alla molla! Un’oscillazione è un giro visto di profilo.',
        'Un’oscillazione come quella della molla si chiama <b>moto armonico</b>: è l’ombra di un moto circolare uniforme. Mentre la pallina fa un giro completo, l’ombra fa un’oscillazione completa: stesso periodo, e l’ampiezza è il raggio del giro.',
        'Il moto armonico è la proiezione di un moto circolare uniforme: per questo nella formula del periodo compare due volte pi greco, l’angolo di un giro intero, e la posizione segue un coseno. [[x = A · cos(2π · t / T)]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un peso leggero e uno pesante.', 'Prova una massa di 0,3 kg o meno, e una di 1,5 kg o più.'),
          need: [
            { when: 'm <= 0.3', try: { m: 0.3 }, msg: T('Prova un peso leggero.', 'Manca una prova con 0,3 kg o meno.') },
            { when: 'm >= 1.5', try: { m: 1.5 }, msg: T('Ora un peso pesante.', 'Manca una prova con 1,5 kg o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('L’ombra della pallina e il peso sulla molla…', 'Mentre la pallina fa un giro, il peso sulla molla fa…', 'Perché nella formula del periodo della molla compare due volte pi greco?'),
          options: [T('vanno su e giù insieme', 'un’oscillazione completa', 'un’oscillazione corrisponde a un giro intero, cioè due pi greco radianti'), T('vanno in direzioni diverse', 'mezza oscillazione', 'perché la molla è avvolta a spirale'), T('l’ombra va più veloce', 'due oscillazioni', 'è un numero scelto per comodità')],
          answer: 0,
          explain: T('Giusto: si muovono insieme, sempre.', 'Esatto: un giro, un’oscillazione.', 'Esatto: il moto armonico è un moto circolare visto di profilo.'),
        },
        {
          kind: 'q',
          text: T('Dove va più piano l’ombra?', 'Dove è più veloce il peso che oscilla?', 'Dove è più grande l’accelerazione del peso che oscilla?'),
          options: [T('in alto e in basso', 'al centro, come l’ombra della pallina', 'agli estremi, dove la molla è più tirata'), T('nel mezzo, dove passa il centro della ruota', 'agli estremi', 'al centro, dove va più veloce'), T('va sempre veloce uguale, come la pallina', 'è sempre veloce uguale', 'è uguale dappertutto')],
          answer: 0,
          explain: T('Giusto: in cima e in fondo l’ombra si ferma un attimo, e torna indietro.', 'Esatto: al centro passa più in fretta, agli estremi si ferma.', 'Esatto: la forza della molla è più grande dove l’allungamento è massimo.'),
        },
      ],
      hints: [T('Un giro della ruota, un’oscillazione della molla.', 'Il moto armonico è l’ombra di un moto circolare uniforme.', 'La posizione segue il coseno di un angolo che cresce di un giro intero a ogni periodo.')],
      solution: T(
        'L’ombra di una pallina che gira fa su e giù come il peso sulla molla.',
        'Un giro completo, un’oscillazione completa: stesso periodo.',
        'Moto armonico: proiezione di un moto circolare uniforme, un giro intero a ogni periodo.'),
    },
    {
      id: 'o01-7', kind: 'ripasso', title: 'Ripasso di molle e oscillazioni',
      intro: T('Ripassiamo: molle, pesi e oscillazioni!', 'Ripasso: legge di Hooke, periodo, frequenza ed energia.', 'Ripasso: dalla molla che si allunga al moto armonico.'),
      steps: [
        {
          kind: 'q',
          text: T('Con tre pesi uguali, la molla si allunga…', 'Una molla con k = 50 N/m si allunga di 10 cm. Che forza la tira?', 'Una molla si allunga di 2 cm con 1 N. Con 3 N si allunga di…'),
          options: [T('il triplo che con uno', '5 N', '6 cm'), T('come con uno', '500 N', '3 cm'), T('la metà che con uno', '0,5 N', '1,5 cm')],
          answer: 0,
          explain: T('Giusto: il triplo del peso, il triplo dell’allungamento.', 'Esatto: F = 50 × 0,1 = 5 N.', 'Esatto: proporzionalità, 3 volte la forza, 3 volte l’allungamento.'),
        },
        {
          kind: 'q',
          text: T('Per far dondolare più piano un peso sulla molla…', 'Una molla oscilla con f = 5 Hz. Quanto dura un’oscillazione?', 'Con una massa nove volte più grande, il periodo diventa…'),
          options: [T('metti un peso più grande', '0,2 s', 'tre volte più lungo'), T('metti un peso più piccolo', '5 s', 'nove volte più lungo'), T('lo tiri di più', '0,5 s', 'tre volte più breve')],
          answer: 0,
          explain: T('Giusto: più peso, più lento.', 'Esatto: T = 1/f = 0,2 s.', 'Esatto: la radice di 9 è 3.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La frequenza.'),
          vals: { m: [0.2, 0.5, 0.8], k: [20, 80] }, calc: '1 / (2 * Math.PI * Math.sqrt(m / k))', unit: 'Hz', tol: 0.05,
          ask: T(null,
            'Una massa di <b>{m} kg</b> oscilla su una molla con k = <b>{k} N/m</b>. Qual è la frequenza?',
            'Massa <b>{m} kg</b>, molla da <b>{k} N/m</b>: frequenza, in hertz? [[f = 1 / (2π · √(m / k))]]'),
          explain: T(null, 'Esatto: T = 2π·√({m}/{k}), e f = 1/T = {ans:2} Hz.', 'Esatto: {ans:2} Hz.'),
        },
        {
          kind: 'q',
          text: T('Quando il peso è in cima, fermo per un attimo, l’energia è…', 'Agli estremi dell’oscillazione, l’energia è…', 'Con l’attrito, che cosa resta quasi uguale a ogni oscillazione?'),
          options: [T('tutta nella molla', 'tutta elastica', 'il periodo'), T('tutta nel movimento', 'tutta cinetica', 'l’ampiezza'), T('sparita', 'zero', 'l’energia')],
          answer: 0,
          explain: T('Giusto: è fermo, quindi l’energia è tutta nella molla tirata.', 'Esatto: velocità zero, molla più tirata.', 'Esatto: l’ampiezza cala, ma il ritmo resta quasi quello.'),
        },
        {
          kind: 'q',
          text: T('L’ombra di una pallina che gira in tondo…', 'Che cos’è il moto armonico?', 'Un’oscillazione armonica e un giro uniforme con lo stesso periodo: che cosa li lega?'),
          options: [T('va su e giù come un peso sulla molla', 'l’ombra di un moto circolare uniforme', 'l’oscillazione è la proiezione del giro'), T('resta ferma sul muro', 'un moto sempre più veloce', 'il giro è più lento della metà'), T('gira anche lei in tondo', 'un moto che si ferma da solo', 'niente: sono moti diversi')],
          answer: 0,
          explain: T('Giusto: su e giù, con lo stesso ritmo del giro.', 'Esatto: un giro visto di profilo.', 'Esatto: stesso periodo, e l’ampiezza è il raggio.'),
        },
      ],
    },
    {
      id: 'o01-8', kind: 'boss', title: 'Il mito della Luna lenta',
      sim: 'spring', params: { mode: 'luna', luna: false }, controls: ['luna'],
      intro: T(
        'Sono Vetrino. Un astronauta dice: <i>“Sulla Luna si pesa poco e tutto va al rallentatore. Anche le molle e i pendoli oscillano più piano!”</i>. Sarà vero per tutti e due? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“sulla Luna la gravità è sei volte più debole, quindi ogni oscillazione è più lenta: il pendolo e la molla rallentano allo stesso modo”</i>. Il pendolo del Laboratorio dipendeva da g. E la molla?',
        'Sono Vetrino. Il mito della Luna lenta: <i>“con un sesto della gravità, tutti gli oscillatori rallentano”</i>. Sembra logico: è la gravità a far scendere il peso. Confrontiamo il pendolo e la molla, sulla Terra e sulla Luna.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa cambi fra una prova e l’altra?', 'Come si mette alla prova il mito, con il pendolo e la molla?', 'Qual è il confronto onesto?'),
          options: [T('solo dove siamo: Terra o Luna', 'stessi oscillatori, sulla Terra e sulla Luna', 'stessi pendolo e molla, cambiando solo la gravità'), T('il peso e il filo insieme', 'si cambiano i pesi e i fili a ogni prova, per vedere di più', 'pendoli e molle diversi sulla Luna'), T('niente: si crede all’astronauta', 'si guarda solo il pendolo, che è il più facile da misurare', 'si guarda la sola molla, che basta')],
          answer: 0,
          explain: T('Giusto: una cosa alla volta.', 'Esatto: così si vede soltanto l’effetto della gravità.', 'Esatto: una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova sulla Terra e sulla Luna.', 'Prova sulla Terra e sulla Luna: guarda quanto dura un’oscillazione.'),
          need: [
            { when: '!luna', try: { luna: false }, msg: T('Prova sulla Terra.', 'Manca una prova sulla Terra.') },
            { when: 'luna', try: { luna: true }, msg: T('Ora sulla Luna.', 'Manca una prova sulla Luna.') },
          ],
        },
        {
          kind: 'q',
          text: T('Sulla Luna, il pendolo…', 'Sulla Luna il periodo del pendolo da 1 m diventa…', 'Perché sulla Luna il pendolo rallenta?'),
          options: [T('va più piano', 'circa 4,9 s, invece di 2 s', 'lì la gravità è più debole'), T('va più veloce', 'circa 2 s, come sulla Terra', 'l’aria della Luna, più densa, lo frena'), T('va uguale', 'circa 1 s', 'il filo sulla Luna si allunga per il freddo')],
          answer: 0,
          explain: T('Giusto: sulla Luna il pendolo è lentissimo.', 'Esatto: il periodo del pendolo dipende da g.', 'Esatto: a riportare giù il pendolo è la gravità, che fa da molla.'),
        },
        {
          kind: 'q',
          text: T('E la molla, sulla Luna?', 'Sulla Luna il periodo della molla con 1 kg diventa…', 'Perché sulla Luna la molla non rallenta?'),
          options: [T('va uguale', 'circa 2 s, come sulla Terra', 'a riportarla indietro è la molla, che resta la stessa'), T('va più piano', 'circa 4,9 s', 'perché la massa sulla Luna è più piccola'), T('va più veloce', 'circa 1 s', 'perché lì l’attrito è più grande')],
          answer: 0,
          explain: T('Giusto: la molla tiene lo stesso ritmo, anche se si allunga di meno.', 'Esatto: il periodo della molla dipende da m e k, non da g.', 'Esatto: la gravità cambia solo dove si ferma il peso, non il ritmo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il pendolo sulla Luna.'),
          vals: { L: [1, 2] }, calc: '2 * Math.PI * Math.sqrt(L / 1.62)', unit: 's', tol: 0.05,
          ask: T(null,
            'Sulla Luna g = 1,62 m/s². Quanto dura un’oscillazione di un pendolo lungo <b>{L} m</b>?',
            'Pendolo di <b>{L} m</b> sulla Luna, dove l’accelerazione di gravità vale 1,62 m/s²: periodo, in secondi? [[T = 2π · √(L / g)]]'),
          explain: T(null, 'Esatto: T = 2π·√({L}/1,62) = {ans:2} s.', 'Esatto: {ans:2} s.'),
        },
        {
          kind: 'q',
          text: T('Allora l’astronauta ha ragione?', 'Che cosa concludi sul mito della Luna lenta?', 'Il mito della Luna lenta: il verdetto?'),
          options: [T('solo per il pendolo: la molla va uguale', 'vale per il pendolo, non per la molla', 'mezzo vero: rallenta chi oscilla grazie alla gravità'), T('sì, sulla Luna rallenta tutto quello che si muove', 'vero per tutti e due', 'vero: la gravità rallenta ogni oscillazione'), T('no, accelera tutto', 'falso per tutti e due', 'falso: sulla Luna il pendolo accelera')],
          answer: 0,
          explain: T('Mito smontato! Sulla Luna il pendolo rallenta, ma la molla tiene il suo ritmo.', 'Mito smontato: il periodo del pendolo dipende da g, quello della molla no.', 'Mito smontato a metà: la gravità conta solo per gli oscillatori che usano la gravità come forza di richiamo.'),
        },
      ],
      hints: [T('Guarda chi cambia ritmo e chi no.', 'Il pendolo dipende da g, la molla da m e k.', 'Chi oscilla grazie alla gravità rallenta; la molla no.')],
      solution: T(
        'Sulla Luna il pendolo va più piano, la molla va uguale.',
        'Pendolo: da 2 s a 4,9 s; molla: sempre circa 2 s.',
        'Il periodo del pendolo dipende da g, quello della molla no: il mito è vero solo a metà.'),
    },
  ],
};
