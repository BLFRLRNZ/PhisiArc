// G01 · La gravitazione universale. Due simulazioni:
//   - il cannone di Newton (orbit.js): una montagna di fantasia alta 1600 km e un cannone che spara in orizzontale;
//     piano la palla cade, a 7 km/s gira intorno alla Terra, oltre 10 km/s scappa.
//   - la bilancia dei pianeti (weigh.js): l'astronauta sulla bilancia su pianeti diversi, l'ascensore che sale nello
//     spazio (e la cabina che cade), due palle di piombo che si attirano.
// La zona si apre con un mistero (la mela e la Luna: cadono per la stessa forza?) e finisce con il mito di Vetrino
// «nello spazio non c'è gravità».
import { T } from '../util.js';

export default {
  id: 'G01',
  title: 'La gravitazione universale',
  levels: [
    {
      id: 'g01-1', kind: 'prevedi', title: 'La mela e la Luna',
      sim: 'orbit', params: { v: 3 }, controls: [],
      intro: T(
        'Ciao, sono Saturnino! Una montagna altissima, più alta dell’aria, e in cima un cannone. Che cosa succede se spara sempre più forte? Prima indovina, poi guarda!',
        'Sono Saturnino. Un esperimento immaginato da Isaac Newton: un cannone, in cima a una montagna così alta da stare sopra l’aria, spara palle in orizzontale, sempre più veloci. Dove cadono? Prima prevedi, poi guarda.',
        'Sono Saturnino: giro, giro, ma non cado mai. O forse cado sempre? Newton se lo chiese guardando la Luna, e immaginò un cannone in cima a una montagna altissima, sopra l’aria. Prevedi che cosa succede.'),
      steps: [
        {
          kind: 'q', predict: [{ v: 3 }],
          text: T('Il cannone spara piano. Dove cade la palla?', 'La palla parte a 3 km/s. Dove cade?', 'Primo colpo: tre chilometri al secondo, già dieci volte un proiettile. Dove finisce la palla?'),
          options: [T('vicino alla montagna', 'a circa 2000 km dalla montagna', 'un paio di migliaia di km più in là'), T('dall’altra parte della Terra', 'dall’altra parte della Terra, agli antipodi', 'agli antipodi, dall’altra parte del mondo'), T('non cade più', 'non cade: resta lassù', 'da nessuna parte: resta su')],
          answer: 0,
          explain: T('Cade non lontano, a circa 2000 km. Per la Terra è vicino!', 'Cade a circa 2000 km: la gravità la tira giù e la curva finisce sul suolo.', 'Cade a circa duemila chilometri: tanti per noi, pochi per la Terra.'),
          solution: T('La palla cade a circa 2000 km dalla montagna.'),
        },
        {
          kind: 'q', predict: [{ v: 6 }],
          text: T('Ora il cannone spara più forte. La palla…', 'Ora la palla parte a 6 km/s. Dove cade?', 'Secondo colpo, a sei chilometri al secondo. E adesso?'),
          options: [T('cade più lontano', 'cade molto più lontano', 'cade molto più lontano'), T('cade più vicino', 'nello stesso punto di prima', 'cade nello stesso punto'), T('cade proprio sotto il cannone', 'torna verso la montagna', 'torna indietro verso il cannone')],
          answer: 0,
          explain: T('Cade molto più lontano: quasi un quinto del giro della Terra!', 'Cade a circa 7700 km: più corre, più la Terra si incurva sotto di lei e più a lungo vola.', 'Molto più lontano, a quasi ottomila chilometri: mentre la palla cade, la Terra sotto di lei si incurva.'),
          solution: T('La palla cade molto più lontano, a circa 7700 km.'),
        },
        {
          kind: 'q', predict: [{ v: 7 }],
          text: T('E se spara ancora più forte, a 7 km al secondo?', 'E a 7 km/s?', 'Terzo colpo, a sette chilometri al secondo. Che succede?'),
          options: [T('gira intorno alla Terra', 'va in orbita intorno alla Terra', 'fa il giro del mondo e torna'), T('cade dall’altra parte della Terra', 'cade dall’altra parte della Terra', 'cade dall’altra parte del pianeta'), T('scappa nello spazio', 'scappa via nello spazio', 'vola via per sempre')],
          answer: 0,
          explain: T('Non cade più! Gira intorno alla Terra e torna alla montagna: è in <b>orbita</b>.', 'Non tocca più terra: fa il giro completo e torna alla montagna. È in <b>orbita</b>: cade sempre, ma la Terra sotto di lei si incurva alla stessa velocità.', 'Fa il giro del mondo e torna al cannone: è in <b>orbita</b>. Cade sempre, ma non arriva mai a terra.'),
          solution: T('A 7 km/s la palla gira intorno alla Terra: è in orbita.'),
        },
        {
          kind: 'q', predict: [{ v: 10.5 }],
          text: T('E a più di 10 km al secondo?', 'E a 10,5 km/s?', 'Ultimo colpo, a più di dieci chilometri al secondo.'),
          options: [T('scappa nello spazio', 'scappa nello spazio e non torna più', 'se ne va per sempre, lontano dalla Terra'), T('gira intorno alla Terra, più in fretta', 'gira intorno alla Terra, più veloce', 'fa il giro più in fretta'), T('cade lontanissimo', 'cade dall’altra parte della Terra', 'cade dall’altra parte del mondo')],
          answer: 0,
          explain: T('Scappa nello spazio, e non torna più!', 'Scappa: è più veloce della velocità di fuga (circa 10 km/s da quella montagna). La gravità la rallenta, ma non riesce più a riportarla indietro.', 'Se ne va: abbastanza veloce, la gravità la rallenta ma non riesce più a riprenderla.'),
          solution: T('Oltre 10 km/s la palla scappa nello spazio.'),
        },
        {
          kind: 'q',
          text: T('E la Luna? Perché non cade sulla Terra?', 'Che cosa hanno in comune la Luna e la palla a 7 km/s?', 'Newton capì che la mela e la Luna obbediscono alla stessa forza. In che senso la Luna «cade»?'),
          options: [
            T('cade sempre, ma corre di lato', 'cadono sempre verso la Terra, ma la mancano', 'cade verso la Terra, ma corre di lato e la manca'),
            T('lassù la gravità non arriva più', 'tutte e due sono fuori dalla gravità terrestre', 'non cade: lassù, così lontano, la gravità non arriva'),
            T('è troppo leggera per cadere', 'tutte e due hanno un motore', 'cade piano, e un giorno arriverà'),
          ],
          answer: 0,
          explain: T(
            'Giusto! Come la palla a 7 km al secondo: cade, cade, ma intanto corre di lato e manca la Terra. È la stessa forza che fa cadere la mela: la <b>gravità</b>.',
            'Esatto: tutte e due cadono verso la Terra e intanto si muovono di lato abbastanza in fretta da mancarla. La forza che fa cadere la mela tiene in orbita la Luna.',
            'Esatto: la Luna cade di continuo verso la Terra, ma corre di lato abbastanza da mancarla sempre. La forza è quella della mela: la gravità.'),
        },
      ],
      hints: [T('Più forte spara il cannone, più lontano cade la palla. Fino a…', 'Mentre la palla cade, la superficie della Terra si incurva sotto di lei.', 'Pensa alla Terra rotonda: più la palla corre, più il suolo «scappa» sotto di lei.')],
    },
    {
      id: 'g01-2', kind: 'lezione', title: 'Il cannone di Newton',
      sim: 'orbit', params: { v: 4 }, controls: ['v'],
      labels: { v: { label: 'Velocità del cannone', min: 1, max: 12, step: 0.5, unit: 'km/s' } },
      intro: T(
        'Ora il cannone è tuo! Fai cadere la palla, falla girare intorno alla Terra e falla scappare nello spazio. La freccia rossa è la <b>gravità</b>: guarda dove punta.',
        'Ora il cannone è tuo. Guarda la freccia rossa: è la forza di gravità sulla palla, e punta sempre verso il centro della Terra. Se la palla è abbastanza veloce, mentre cade la Terra si incurva sotto di lei: cade per sempre senza toccare terra. È un’<b>orbita</b>.',
        'Il segreto dell’orbita, secondo Newton. Vicino al suolo, in un secondo una palla cade di circa 5 metri; e in 8 km la superficie della Terra si abbassa proprio di circa 5 metri. Una palla che corre a 8 km al secondo cade, ma il suolo le scappa sotto. Dalla cima della montagna, più lontano dal centro, basta un po’ meno.'),
      steps: [
        {
          kind: 'free',
          text: T('Fai tre lanci: uno che cade, uno che gira intorno alla Terra, uno che scappa.', 'Trova tre velocità: una per cui la palla cade, una per cui va in orbita, una per cui scappa.'),
          need: [
            { when: 'r.landed', try: { v: 5 }, msg: T('Fai cadere la palla sulla Terra: più piano.') },
            { when: 'r.orbit', try: { v: 7 }, msg: T('Ora trova una velocità per farla girare intorno alla Terra.') },
            { when: 'r.escaped', try: { v: 11 }, msg: T('Ora falla scappare nello spazio: più veloce!') },
          ],
        },
        {
          kind: 'q',
          text: T('Dove punta la freccia rossa, la gravità?', 'Durante tutto il volo, la forza di gravità sulla palla è diretta…', 'Mentre la palla gira, che cosa fa la gravità?'),
          options: [T('sempre verso il centro della Terra', 'sempre verso il centro della Terra', 'la tira sempre verso il centro della Terra'), T('sempre verso il basso dello schermo', 'verso il basso dello schermo', 'la spinge avanti, come un motore'), T('nella direzione in cui va la palla', 'nello stesso verso della velocità', 'si spegne, perché la palla è in orbita')],
          answer: 0,
          explain: T('Giusto: la Terra tira tutto verso il suo centro, da qualunque parte.', 'Esatto: la forza di gravità punta sempre verso il centro della Terra. In orbita è lei che curva la traiettoria.', 'Esatto: tira sempre verso il centro. È lei che piega la strada della palla in un cerchio.'),
        },
        {
          kind: 'q',
          text: T('La palla che gira intorno alla Terra sta cadendo?', 'Una palla in orbita…', 'Perché la palla in orbita non tocca mai terra?'),
          options: [T('sì, cade sempre', 'cade sempre verso la Terra, ma la manca', 'mentre cade, il suolo si incurva sotto di lei'), T('no, galleggia nel vuoto', 'si muove senza forze, per inerzia', 'lassù la gravità è troppo debole per tirarla giù'), T('no, sale piano', 'resta ferma rispetto alla Terra che gira', 'l’aria la sostiene come un aereo')],
          answer: 0,
          explain: T('Giusto: cade sempre! Ma corre così veloce che la Terra rotonda si incurva sotto di lei.', 'Esatto: è in caduta continua. La gravità la tira verso il centro, ma la sua velocità di lato le fa mancare la Terra.', 'Esatto: la palla cade, ma il suolo si incurva via alla stessa velocità. Ed è sopra l’aria: niente la frena.'),
        },
        {
          kind: 'q',
          text: T('Dalla montagna, con che velocità la palla scappa nello spazio?', 'Dalla montagna, sopra che velocità la palla scappa e non torna più?', 'Dalla cima della montagna, quanto deve correre la palla per andarsene per sempre?'),
          options: [T('più di 10 km al secondo', 'circa 10 km/s', 'più di dieci chilometri al secondo'), T('più di 3 km al secondo', 'circa 7 km/s', 'più di sette chilometri al secondo'), T('più di 6 km al secondo', 'circa 3 km/s', 'più di tre chilometri al secondo')],
          answer: 0,
          explain: T('Giusto: sopra 10 km al secondo scappa via.', 'Esatto: circa 10 km/s, la velocità di fuga da quell’altezza. A 7 km/s va in orbita, sotto cade.', 'Esatto: dieci chilometri al secondo. A sette gira intorno alla Terra, sotto cade.'),
        },
      ],
      hints: [T('Piano cade, a 7 gira intorno, oltre 10 scappa.', 'Sotto i 7 km/s cade; fra 7 e 10 km/s è in orbita; oltre 10 km/s scappa.', 'Sotto i sette chilometri al secondo cade, fra sette e dieci gira, oltre dieci scappa.')],
      solution: T(
        'A 4 km al secondo cade, a 7 gira intorno alla Terra, a 11 scappa.',
        'Per esempio 4 km/s: cade; 7 km/s: orbita; 11 km/s: scappa.',
        'Quattro chilometri al secondo: cade; sette: gira intorno alla Terra; undici: se ne va.'),
    },
    {
      id: 'g01-3', kind: 'lezione', title: 'Tutto attira tutto',
      sim: 'weigh', params: { mode: 'coppia', m1: 1, m2: 1, d: 2 }, controls: ['m1', 'm2', 'd'],
      intro: T(
        'Newton capì una cosa enorme: <b>tutte le cose si attirano</b>, anche due palle di piombo! Più hanno massa, più si attirano; più sono lontane, meno. È la <b>gravitazione universale</b>.',
        'La <b>legge di gravitazione universale</b> (Newton, 1687): due corpi si attirano con una forza proporzionale al prodotto delle masse e inversamente proporzionale al quadrato della distanza: F = G·m₁·m₂/r², con G = 6,67·10⁻¹¹ N·m²/kg². Le due forze sono uguali e opposte, come azione e reazione.',
        'Tutto attira tutto: la Terra la mela, la mela la Terra, tu il tuo vicino di banco. Perché non ce ne accorgiamo? Perché la forza è piccolissima, finché uno dei due non è grande come un pianeta. È la <b>gravitazione universale</b>. [[F = G · m₁ · m₂ / r²]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Cambia le palle e la distanza, poi lancia. Guarda le frecce rosse.', 'Fai almeno due prove cambiando le masse e la distanza: guarda le frecce e il valore della forza.'),
        },
        {
          kind: 'q',
          text: T('Raddoppi la massa di una palla. La forza…', 'Raddoppi la massa di una delle due palle. La forza fra loro…', 'Se una delle due palle avesse il doppio della massa, quanto si attirerebbero?'),
          options: [T('raddoppia', 'raddoppia', 'il doppio'), T('diventa 4 volte', 'quadruplica', 'il quadruplo'), T('resta uguale', 'resta uguale', 'come prima')],
          answer: 0,
          explain: T('Giusto: il doppio della massa, il doppio della forza.', 'Esatto: F è proporzionale al prodotto m₁·m₂: raddoppia una massa e raddoppia F.', 'Esatto: il doppio. La forza segue il prodotto delle masse.'),
        },
        {
          kind: 'q',
          text: T('Allontani le palle al doppio della distanza. La forza…', 'Raddoppi la distanza fra i centri. La forza…', 'E se le due palle fossero lontane il doppio?'),
          options: [T('diventa 4 volte più piccola', 'diventa un quarto', 'si attirerebbero un quarto'), T('diventa la metà di quella di prima', 'si dimezza, come la distanza', 'si attirerebbero la metà'), T('resta uguale', 'raddoppia', 'si attirerebbero il doppio')],
          answer: 0,
          explain: T('Giusto: al doppio della distanza, la forza è 4 volte più piccola.', 'Esatto: F è inversamente proporzionale a r²: con r doppio, F diventa 1/4.', 'Esatto: un quarto. Conta il quadrato della distanza.'),
        },
        {
          kind: 'q',
          text: T('La palla grande tira quella piccola. E la piccola, tira la grande?', 'Una palla da 4 t e una da 1 t. Quale delle due tira l’altra più forte?', 'La mela cade verso la Terra. Anche la Terra è tirata verso la mela?'),
          options: [T('sì, con la stessa forza', 'nessuna: le due forze sono uguali', 'sì, con la stessa forza, ma si sposta pochissimo'), T('no, la piccola non tira nessuno', 'quella da 4 t, quattro volte di più', 'no: la Terra è troppo grande per sentire una mela'), T('sì, ma più piano', 'quella da 1 t, perché è leggera', 'sì, e le due si incontrano a metà strada')],
          answer: 0,
          explain: T('Giusto: le due frecce sono lunghe uguali. Si tirano a vicenda, con la stessa forza.', 'Esatto: azione e reazione. La forza è la stessa per tutte e due; la palla leggera si sposta di più perché ha meno massa.', 'Esatto: la mela tira la Terra con la stessa forza. Ma la Terra ha una massa enorme, e si sposta di una quantità impossibile da misurare.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché due persone vicine non si sentono attirare?'),
          options: [T('la forza è piccolissima'), T('le persone non si attirano'), T('l’aria blocca la forza')],
          answer: 0,
          explain: T('Giusto: si attirano, ma pochissimo. Per sentirlo davvero serve una massa grande come un pianeta.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il quadrato della distanza.'),
          vals: { F: [36, 72, 144], k: [2, 3] }, calc: 'F / (k * k)', unit: 'N', tol: 0.05,
          ask: T(null,
            'Due corpi si attirano con una forza di <b>{F} N</b>. Quanto diventa la forza se la distanza diventa <b>{k} volte</b> più grande?',
            'Due asteroidi si attirano con <b>{F} N</b>. Se la loro distanza diventa <b>{k} volte</b> più grande, con che forza si attirano? [[F′ = F / k²]]'),
          explain: T(null, 'Esatto: F è inversamente proporzionale a r², quindi si divide per {k}² = {k} × {k}: {ans} N.', 'Esatto: {ans} N. [[F′ = {F} / ({k} × {k}) = {ans} N]]'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Due persone di 70 kg a 1 m si attirano con circa 3·10⁻⁷ N. Perché non lo sentiamo?', 'Il tuo vicino di banco ti attira davvero. Perché non te ne accorgi?'),
          options: [T(null, 'è minuscola rispetto al peso', 'è minuscola: ci vuole una massa da pianeta'), T(null, 'le persone non hanno gravità', 'la gravità vale solo per i pianeti e le stelle'), T(null, 'l’aria fra loro la scherma', 'il banco in mezzo fa da schermo')],
          answer: 0,
          explain: T(null, 'Esatto: 3·10⁻⁷ N contro circa 700 N di peso: più di un miliardo di volte più piccola.', 'Esatto: ti attira, ma con una forza un miliardo di volte più piccola del tuo peso. Per sentirla serve qualcosa grande come la Terra.'),
        },
      ],
      hints: [T('Più massa, più forza; più distanza, molto meno forza.', 'F = G·m₁·m₂/r²: doppia massa, doppia forza; doppia distanza, un quarto.', 'Conta il prodotto delle masse, diviso il quadrato della distanza.')],
      solution: T(
        'Masse più grandi: frecce più lunghe. Palle più lontane: frecce molto più corte.',
        'F = G·m₁·m₂/r²: proporzionale alle masse, inversamente proporzionale al quadrato della distanza.',
        'La forza cresce con le masse e cala con il quadrato della distanza. [[F = G · m₁ · m₂ / r²]]'),
    },
    {
      id: 'g01-4', kind: 'lezione', title: 'La bilancia dei pianeti',
      sim: 'weigh', params: { mode: 'pianeti', planet: 'terra', m: 60 }, controls: ['planet', 'm'],
      intro: T(
        'Sali sulla bilancia su pianeti diversi! Tu sei sempre tu: la tua <b>massa</b> non cambia. Ma ogni pianeta ti tira con una forza diversa, e la bilancia segna un numero diverso: è il tuo <b>peso</b>.',
        'La <b>massa</b> (kg) misura quanta materia c’è: è la stessa ovunque. Il <b>peso</b> è la forza con cui un pianeta ti attira: P = m·g, e g dipende dal pianeta: g = G·M/R². Sulla Luna g = 1,62 m/s², su Marte 3,71, su Giove 24,8. La bilancia del bagno, tarata sulla Terra, segna P / 9,81.',
        'Un chilo di zucchero è un chilo anche sulla Luna: la massa non cambia. Cambia quanto pesa, cioè quanto la Luna lo tira giù. La bilancia del bagno, che misura proprio il peso, lassù segnerebbe circa un sesto. [[P = m · g, g = G · M / R²]]'),
      steps: [
        {
          kind: 'free',
          text: T('Pesa l’astronauta sulla Luna e su Giove.', 'Pesa l’astronauta almeno sulla Luna e su Giove, e confronta con la Terra.'),
          need: [
            { when: "planet == 'luna'", try: { planet: 'luna' }, msg: T('Ora scegli la Luna e pesalo.') },
            { when: "planet == 'giove'", try: { planet: 'giove' }, msg: T('Ora prova su Giove.') },
          ],
        },
        {
          kind: 'q',
          text: T('Sulla Luna la bilancia segna molto meno. La tua massa…', 'Sulla Luna la bilancia segna circa un sesto. Che cosa è cambiato?', 'Un astronauta di 60 kg sulla Luna: che cosa cambia davvero?'),
          options: [T('è la stessa di sempre', 'il peso, non la massa', 'il peso: la Luna lo tira giù molto meno'), T('è diventata più piccola', 'la massa, non il peso', 'la massa: lassù è fatto di meno roba'), T('non c’è più', 'tutti e due', 'niente: è la bilancia che sbaglia')],
          answer: 0,
          explain: T('Giusto: tu sei sempre tu. È la Luna che ti tira meno forte.', 'Esatto: la massa resta 60 kg; il peso P = m·g cala perché sulla Luna g è più piccola.', 'Esatto: la massa resta quella; il peso cala perché la Luna tira meno della Terra.'),
        },
        {
          kind: 'q',
          text: T('Su quale pianeta la bilancia segna di più?', 'Perché su Giove il peso è circa 2,5 volte quello sulla Terra?', 'Saturno ha una massa 95 volte quella della Terra, eppure lì peseresti quasi come qui. Perché?'),
          options: [T('su Giove', 'ha una massa enorme: g = G·M/R² è grande', 'è enorme: sei lontanissimo dal suo centro'), T('su Marte', 'gira su se stesso più in fretta della Terra', 'è fatto quasi tutto di gas leggerissimo'), T('sulla Luna', 'ha un’aria più pesante', 'gira troppo in fretta per riuscire a tirarti')],
          answer: 0,
          explain: T('Giusto: Giove ha una massa enorme e ti tira fortissimo.', 'Esatto: la massa di Giove è 318 volte quella della Terra; anche se il raggio è 11 volte più grande, g = G·M/R² viene circa 2,5 volte quella terrestre.', 'Esatto: la massa conta, ma conta anche la distanza dal centro. Saturno è così grande che sulla sua superficie sei molto lontano dal centro, e le due cose quasi si pareggiano.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Sulla Luna, quanto segna la bilancia di un astronauta di 60 kg?'),
          options: [T('circa 10 kg'), T('circa 30 kg'), T('ancora 60 kg')],
          answer: 0,
          explain: T('Giusto: circa 10 kg, sei volte di meno.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il peso sulla Luna.'),
          vals: { m: [50, 60, 70, 80] }, calc: 'm * 1.62', unit: 'N', tol: 1,
          ask: T(null,
            'Un astronauta di <b>{m} kg</b> sulla Luna (g = 1,62 m/s²). Quanto pesa, in newton?',
            'Un astronauta di <b>{m} kg</b> sbarca sulla Luna. Con che forza la Luna lo tira giù? [[P = m · g, g = 1,62 m/s²]]'),
          explain: T(null, 'Esatto: P = m·g = {m} × 1,62 ≈ {ans} N (sulla Terra sarebbero sei volte tanto).', 'Esatto: circa {ans} newton. [[P = {m} × 1,62 ≈ {ans} N]]'),
        },
        {
          kind: 'q',
          text: T('Dove salteresti più in alto?', 'Su quale di questi pianeti un salto in alto arriverebbe più su?', 'In quale posto un saltatore in alto stabilirebbe il record più facile?'),
          options: [T('sulla Luna', 'sulla Luna', 'sulla Luna'), T('su Giove', 'su Giove', 'su Giove'), T('su Saturno', 'sulla Terra', 'sulla Terra')],
          answer: 0,
          explain: T('Giusto: sulla Luna ti tira giù pochissimo, e voli in alto!', 'Esatto: con la stessa spinta, dove g è più piccola si sale di più. Sulla Luna, circa sei volte più in alto.', 'Esatto: sulla Luna, dove la gravità è un sesto, lo stesso salto va sei volte più in alto.'),
        },
      ],
      hints: [T('Guarda quanto segna la bilancia su ogni pianeta.', 'P = m·g: la massa resta, g cambia da pianeta a pianeta.', 'La massa non cambia mai; il peso dipende da quanto ti tira il pianeta.')],
      solution: T(
        'Sulla Luna circa 10 kg, sulla Terra 60, su Giove circa 150: la massa è sempre 60 kg.',
        'P = m·g: con m = 60 kg, sulla Luna 97 N, sulla Terra 589 N, su Giove 1488 N.',
        'Sempre la stessa massa, pesi diversi: un sesto sulla Luna, due volte e mezza su Giove.'),
    },
    {
      id: 'g01-5', kind: 'costruisci', title: 'L’ascensore per le stelle',
      sim: 'weigh', params: { mode: 'quota', h: 0, m: 60 }, controls: ['h'],
      labels: { h: { label: 'Altezza della cabina', min: 0, max: 20000, step: 100, unit: 'km' } },
      intro: T(
        'Nuovo gioco per il parco: un ascensore altissimo, che sale fino nello spazio! Più sali, più la Terra è lontana e meno ti tira. Porta la cabina all’altezza giusta.',
        'Nuovo pezzo del parco: l’ascensore per le stelle. Salendo ci si allontana dal centro della Terra, e la gravità cala come 1/r²: g = 9,81·(R/(R + h))², con R = 6371 km. Porta la cabina dove la bilancia segna il valore richiesto.',
        'Nuovo pezzo del parco: un ascensore che sale nello spazio (gli ingegneri lo sognano davvero). Più ti allontani dal centro della Terra, meno pesi: a una distanza doppia dal centro, un quarto.'),
      piece: { id: 'ascensore', name: 'L’ascensore per le stelle', desc: 'Più sale, più la Terra è lontana: a una distanza doppia dal centro, la bilancia segna un quarto.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’altezza della cabina, poi lancia: la cabina sale.', 'Regola l’altezza della cabina: la bilancia deve segnare il valore richiesto. L’astronauta ha massa 60 kg.'),
          vals: { e: { k: [[30], [15]] }, s: { k: [[30, 45], [15, 20]] } },
          ask: T(
            'A terra la bilancia segna 60 kg. Porta la cabina dove segna <b>{k} kg</b>.',
            'Massa dell’astronauta: 60 kg. Porta la cabina all’altezza in cui la bilancia segna <b>{k} kg</b>.',
            'A terra l’astronauta pesa 60 kg sulla bilancia. A che altezza ne segna <b>{k}</b>?'),
          measure: 'kg', goal: 'k', tol: 0.5,
          ok: T('{got:1} kg: altezza giusta!'),
          high: T('{got:1} kg: troppo! Sali ancora.', '{got:1} kg: troppo. Porta la cabina più in alto.'),
          low: T('{got:1} kg: troppo poco. Scendi un po’.', '{got:1} kg: troppo poco. Porta la cabina più in basso.'),
          solve: { h: 'Math.round(6371 * (Math.sqrt(60 / k) - 1) / 100) * 100' },
        },
      ],
      hints: [
        T('Più sali, meno segna la bilancia.', 'Il peso cala come 1/r², dove r è la distanza dal centro della Terra, non dal suolo.', 'Conta la distanza dal centro della Terra, non dal suolo.'),
        T('Per un quarto del peso, devi stare lontano dal centro il doppio: a 6400 km di altezza.', 'Per la metà del peso, r = R·√2; per un quarto, r = 2R, cioè h ≈ 6400 km.', 'Un quarto del peso vuol dire il doppio della distanza dal centro: circa 6400 km di altezza.'),
      ],
      solution: T(
        '30 kg: circa 2600 km di altezza. 15 kg: circa 6400 km.',
        'k = 60·(R/r)², quindi r = R·√(60/k): metà a circa 2600 km, un quarto a 6400 km.',
        'La metà del peso a circa 2600 km, un quarto a circa 6400 km. [[r = R · √(60 / k)]]'),
    },
    {
      id: 'g01-6', kind: 'ripasso', title: 'Ripasso della gravitazione',
      intro: T('Ripassiamo: cannoni, pianeti e bilance!', 'Ripasso: gravitazione universale, massa e peso, orbite.', 'Ripasso: la gravità nelle cose di tutti i giorni, e in cielo.'),
      steps: [
        {
          kind: 'q',
          text: T('Perché la mela cade e la Luna gira intorno alla Terra?', 'La mela cade e la Luna gira intorno alla Terra. Quale forza agisce?', 'La mela di Newton e la Luna: che cosa le accomuna?'),
          options: [T('per la stessa forza, la gravità', 'la stessa: la gravità della Terra', 'la stessa forza, la gravità'), T('per due forze diverse, una per ciascuna', 'due forze diverse: peso e forza centrifuga', 'niente: sono cose diverse'), T('la Luna non sente la Terra', 'sulla Luna nessuna forza', 'solo la mela sente la Terra')],
          answer: 0,
          explain: T('Giusto: è la stessa forza. La Luna va così veloce di lato che, cadendo, manca la Terra.', 'Esatto: la gravità della Terra. La mela cade dritta; la Luna, che corre di lato, cade intorno.', 'Esatto: la stessa gravità. Fu l’idea geniale di Newton.'),
        },
        {
          kind: 'q',
          text: T('Su Marte la bilancia segna meno. Che cosa resta uguale?', 'Un sasso da 2 kg sulla Luna. Quale di questi valori non cambia?', 'Porti un sacco di patate da 5 kg su Marte. Che cosa resta uguale?'),
          options: [T('la massa', 'la massa: 2 kg', 'la quantità di patate: la massa'), T('il peso', 'il peso: 19,6 N', 'quanto pesano quando le tieni in mano'), T('niente', 'la forza che lo tira giù', 'quanto segna la bilancia')],
          answer: 0,
          explain: T('Giusto: la massa resta, il peso cambia.', 'Esatto: la massa è 2 kg ovunque; il peso, m·g, sulla Luna è circa 3,2 N.', 'Esatto: le patate sono sempre 5 kg; è Marte che le tira giù meno.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Gravità e distanza.'),
          vals: { F: [80, 160, 240] }, calc: 'F / 4', unit: 'N', tol: 0.05,
          ask: T(null,
            'Una navicella pesa <b>{F} N</b> sulla Terra. Quanto pesa a una distanza dal centro della Terra doppia (cioè a 6371 km di altezza)?',
            'Una sonda che pesa <b>{F} N</b> sulla Terra si allontana fino al doppio della distanza dal centro. Quanto pesa lassù? [[P′ = P / 2²]]'),
          explain: T(null, 'Esatto: distanza doppia, forza divisa per 4: {ans} N.', 'Esatto: {ans} N, un quarto. [[{F} / 4 = {ans} N]]'),
        },
        {
          kind: 'q',
          text: T('Che succede se il cannone spara a 7 km al secondo?', 'Dalla montagna di Newton, una palla a 7 km/s…', 'Dalla montagna di Newton, a sette chilometri al secondo, la palla…'),
          options: [T('gira intorno alla Terra', 'va in orbita e torna alla montagna', 'gira intorno al mondo e torna'), T('cade vicino alla montagna', 'cade a 2000 km dalla montagna', 'cade poco lontano dalla montagna'), T('si ferma lassù', 'scappa via e non torna più indietro', 'scappa via per sempre')],
          answer: 0,
          explain: T('Giusto: va in orbita! Cade sempre, ma non tocca mai terra.', 'Esatto: in orbita. Cade sempre, ma la Terra sotto di lei si incurva.', 'Esatto: fa il giro del mondo, cadendo senza toccare terra.'),
        },
        {
          kind: 'q',
          text: T('La Terra tira la Luna. La Luna tira la Terra?', 'La Terra attira la Luna. La Luna attira la Terra?', 'La Luna attira il mare: che cosa succede, due volte al giorno?'),
          options: [T('sì, con la stessa forza', 'sì, con una forza uguale e opposta', 'le maree: il mare si alza e si abbassa'), T('no, perché è troppo piccola', 'no: la Terra è molto più grande di lei', 'niente: la Luna è troppo lontana da noi'), T('solo di notte', 'solo quando c’è la Luna piena', 'le onde diventano più alte')],
          answer: 0,
          explain: T('Giusto: si tirano a vicenda, con la stessa forza.', 'Esatto: azione e reazione, con la stessa intensità: F = G·M·m/r² per tutte e due.', 'Esatto: le maree. La Luna attira di più il mare dalla parte vicina, e la Terra si ritrova con due «gobbe» d’acqua.'),
        },
      ],
    },
    {
      id: 'g01-7', kind: 'boss', title: 'Il mito dello spazio senza gravità',
      sim: 'weigh', params: { mode: 'quota', h: 0, m: 60, fall: false }, controls: ['h'],
      labels: { h: { label: 'Altezza della cabina', min: 0, max: 20000, step: 100, unit: 'km' } },
      intro: T(
        'Sono Vetrino. Nei video gli astronauti galleggiano, e tutti dicono: <i>“lassù non c’è gravità”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“sulla Stazione spaziale, a 400 km di altezza, non c’è gravità: per questo gli astronauti galleggiano”</i>. Lo mettiamo alla prova con l’ascensore e la bilancia.',
        'Sono Vetrino. Gli astronauti della Stazione spaziale galleggiano, e si sente dire che lassù «non c’è gravità». Però 400 km sono pochi, rispetto ai 6371 km del raggio della Terra…'),
      steps: [
        {
          kind: 'free',
          text: T('Porta la cabina a 400 km, l’altezza della Stazione spaziale, e guarda la bilancia.', 'Porta la cabina a 400 km, l’altezza della Stazione spaziale, e leggi la bilancia.'),
          need: [{ when: 'h == 400', try: { h: 400 }, msg: T('Porta la cabina proprio a 400 km.') }],
        },
        {
          kind: 'q', review: false,
          text: T('A 400 km la bilancia segna 53 kg invece di 60. La gravità lassù…', 'A 400 km la bilancia segna circa 53 kg su 60. Lassù la gravità è…', 'Lassù la bilancia segna 53 kg su 60. Che cosa ne pensi?'),
          options: [T('c’è ancora, quasi tutta', 'quasi il 90% di quella a terra', 'la gravità c’è, quasi tutta'), T('non c’è più, è sparita', 'zero', 'la bilancia è rotta'), T('è il doppio di quella a terra', 'circa la metà di quella a terra', 'la gravità c’è, ma è la metà')],
          answer: 0,
          explain: T('Giusto: c’è ancora quasi tutta! 400 km sono pochi, la Terra è grandissima.', 'Esatto: g = 9,81·(6371/6771)² ≈ 8,7 m/s², circa il 90%.', 'Esatto: quasi nove decimi. Vista da 400 km, la Terra è ancora lì sotto, enorme.'),
        },
        {
          kind: 'q', predict: [{ h: 400, fall: true }],
          text: T('Ora tagliamo il cavo: la cabina cade. Che cosa segna la bilancia?', 'Ora si taglia il cavo e la cabina cade. Che cosa segna la bilancia, durante la caduta?', 'Si taglia il cavo: cabina, bilancia e astronauta cadono insieme. Che cosa segna la bilancia?'),
          options: [T('zero', 'zero', 'zero'), T('53 kg', '53 kg, come prima', 'ancora 53 kg'), T('ancora di più', 'più di 60 kg', 'più di prima, per la paura')],
          answer: 0,
          explain: T('Zero! Tu e la bilancia cadete insieme: la bilancia non ti sente più, e galleggi.', 'Zero: astronauta e bilancia cadono con la stessa accelerazione, e lui non preme più su di lei. È l’assenza di peso, ma la gravità c’è ancora.', 'Zero: si cade tutti insieme, e nessuno preme su niente. Si galleggia, con la gravità ancora quasi tutta.'),
        },
        {
          kind: 'q',
          text: T('Allora perché gli astronauti galleggiano?', 'Perché, allora, sulla Stazione spaziale si galleggia?', 'E sulla Stazione spaziale, perché si galleggia?'),
          options: [T('cadono insieme alla Stazione', 'cadono insieme alla Stazione, intorno alla Terra', 'perché lei e loro cadono insieme, sempre'), T('lassù non c’è gravità', 'a 400 km di altezza la gravità diventa zero', 'perché lassù l’aria è troppo sottile per pesare'), T('hanno delle scarpe e delle tute speciali', 'la Stazione ha un motore che li spinge in su sempre', 'perché la Stazione è leggerissima')],
          answer: 0,
          explain: T('Giusto! La Stazione è in orbita come la palla del cannone: cade sempre, e loro cadono con lei.', 'Esatto: la Stazione è in orbita, cioè in caduta continua intorno alla Terra, come la palla del cannone di Newton. Tutto dentro cade insieme: niente pesa sulle bilance.', 'Esatto: la Stazione cade in continuazione intorno alla Terra, come la palla di Newton, e loro cadono con lei.'),
        },
        {
          kind: 'q',
          text: T('Il mito dice: «nello spazio non c’è gravità». È vero?', 'Il mito: «sulla Stazione spaziale non c’è gravità». Che cosa concludi?', '«Lassù non c’è gravità»: dopo l’esperimento, che cosa ne pensi?'),
          options: [T('no: c’è, quasi tutta', 'falso: c’è quasi il 90% della gravità', 'falso: la gravità c’è, si galleggia perché si cade'), T('sì: lassù si galleggia', 'vero: gli astronauti galleggiano nei video', 'vero: lo dimostrano tutti i video degli astronauti'), T('sì, ma solo di notte', 'vero solo lontano dalla Luna', 'vero solo fuori dall’atmosfera')],
          answer: 0,
          explain: T('Mito smontato! La gravità c’è: gli astronauti galleggiano perché cadono insieme alla Stazione.', 'Mito smontato: a 400 km g ≈ 8,7 m/s². Si galleggia perché si è in caduta libera, insieme alla Stazione.', 'Mito smontato: la gravità c’è quasi tutta. Senza, la Stazione non girerebbe intorno alla Terra: andrebbe dritta nello spazio.'),
        },
      ],
      hints: [T('Guarda quanto segna la bilancia a 400 km.', 'Calcola g a 400 km: 9,81·(R/(R + h))².', 'Senza gravità, che cosa terrebbe la Stazione in orbita?')],
      solution: T(
        'A 400 km la bilancia segna 53 kg: la gravità c’è. Si galleggia perché si cade insieme.',
        'g(400 km) ≈ 8,7 m/s²: la gravità c’è. Gli astronauti sono in caduta libera con la Stazione.',
        'La gravità c’è quasi tutta; si galleggia perché si cade insieme alla Stazione.'),
    },
  ],
};
