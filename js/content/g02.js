// G02 · Orbite e leggi di Keplero. Simulazione: le orbite (kepler.js), in due modi:
//   - 'ellisse': un satellite parte dalla cima, a una certa altezza e velocità; cerchio, ellisse, schianto o fuga;
//     con areas gli spicchi di area uguale spazzati in tempi uguali (seconda legge di Keplero);
//   - 'satelliti': la Stazione spaziale, un GPS, un satellite della TV (e il tuo) intorno alla Terra che gira.
// La zona si apre con un esperimento (il satellite del parco da mettere in orbita rotonda, prima di ogni
// spiegazione) e finisce con l'esperimento al buio di Bilancia: il pianeta nascosto, pesato con il suo satellite.
import { T } from '../util.js';

export default {
  id: 'G02',
  title: 'Orbite e leggi di Keplero',
  levels: [
    {
      id: 'g02-1', kind: 'costruisci', title: 'Il satellite del parco',
      sim: 'kepler', params: { mode: 'ellisse', v: 7, h: 400 }, controls: ['v'],
      intro: T(
        'Nuovo gioco per il parco: un satellite tutto nostro! Va lanciato alla velocità giusta: troppo piano cade, troppo forte la sua strada si allunga. Deve girare in tondo.',
        'Nuovo pezzo del parco: un satellite. Prima di ogni spiegazione, un esperimento: a ogni altezza c’è una sola velocità per cui l’orbita è un cerchio. Trovala. Nella seconda prova il satellite parte molto più in alto: servirà la stessa velocità?',
        'Nuovo pezzo del parco: un satellite tutto nostro. I satelliti veri vengono «parcheggiati» in orbite rotonde, con una velocità precisa. Trovala, prima vicino alla Terra e poi molto più in alto.'),
      piece: { id: 'satellite', name: 'Il satellite del parco', desc: 'Gira in tondo alla velocità giusta: più è in alto, più va piano.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la velocità del satellite e lancia.', 'Regola la velocità: l’orbita deve essere un cerchio. Nella seconda prova il satellite parte più in alto.'),
          vals: { e: { h: [[400], [5000]] }, s: { h: [[400, 1000, 2000], [10000, 20000, 35800]] } },
          set: { h: 'h' },
          ask: T(
            'Il satellite parte a <b>{h} km</b> di altezza. Trova la velocità per un’orbita rotonda.',
            'Altezza di partenza: <b>{h} km</b>. Trova la velocità per un’orbita circolare.',
            'Il satellite parte a <b>{h} km</b> dal suolo. Con che velocità gira in tondo?'),
          measure: 'ecc', goal: '0', tol: 0.02,
          ok: T('Orbita rotonda! Il satellite gira in tondo.'),
          high: T('Troppo veloce: l’orbita si allunga. Più piano!', 'Troppo veloce: l’orbita diventa un ovale allungato. Rallenta.'),
          low: T('Troppo piano: si avvicina alla Terra. Più veloce!', 'Troppo piano: l’orbita si schiaccia verso la Terra. Accelera.'),
          solve: { v: 'Math.round(Math.sqrt(398600 / (6371 + h)) * 10) / 10' },
        },
      ],
      hints: [
        T('Se la strada si allunga, più piano; se si avvicina alla Terra, più forte.', 'Se l’orbita si allunga, rallenta; se si schiaccia verso la Terra, accelera.', 'Troppo veloce, l’orbita si allunga; troppo lento, si schiaccia.'),
        T('Più in alto serve meno velocità.', 'Più in alto, più piano: lassù la gravità è più debole.', 'Più in alto, più piano: lassù la Terra tira di meno.'),
      ],
      solution: T(
        'A 400 km circa 8 km al secondo; a 5000 km circa 6.',
        'A 400 km circa 7,7 km/s; a 20 000 km circa 3,9 km/s: più in alto, più piano.',
        'Vicino alla Terra quasi 8 km al secondo, a 20 000 km meno di 4: più in alto, più piano.'),
    },
    {
      id: 'g02-2', kind: 'lezione', title: 'Più in alto, più piano',
      sim: 'kepler', params: { mode: 'satelliti', h: 10000, sats: ['iss', 'gps', 'tv'], mine: true }, controls: ['h'],
      labels: { h: { label: 'Altezza del tuo satellite', min: 400, max: 40000, step: 100, unit: 'km' } },
      intro: T(
        'Ecco tre satelliti veri: la Stazione spaziale, un satellite GPS e uno della TV. Più sono in alto, più vanno piano e più tempo ci mettono a fare un giro. Aggiungi il tuo e guarda un giorno intero.',
        'In un’orbita circolare la gravità fa da forza centripeta: G·M·m/r² = m·v²/r, quindi v = √(G·M/r). Più grande è r, più piccola è v, e più lungo è il periodo T = 2πr/v. La Stazione spaziale (400 km) fa un giro in 92 minuti; i satelliti GPS (20 200 km) in 12 ore; quelli della TV (35 786 km) in un giorno.',
        'Più un satellite è alto, più va piano: lassù la gravità è più debole, e basta meno velocità per non cadere. E siccome la strada è anche più lunga, il giro dura molto di più: 92 minuti per la Stazione spaziale, un giorno per i satelliti della TV, quasi un mese per la Luna. [[v = √(G · M / r)]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Prova il tuo satellite a due altezze diverse, e guarda un giorno intero.', 'Fai almeno due prove con il tuo satellite ad altezze diverse: confronta i suoi giri con quelli degli altri.'),
        },
        {
          kind: 'q',
          text: T('Chi fa più giri della Terra in un giorno?', 'In 24 ore, quanti giri fa la Stazione spaziale (92 minuti a giro)?', 'La Stazione spaziale vede sorgere il Sole 16 volte al giorno. Perché?'),
          options: [T('la Stazione spaziale', 'più di 15', 'fa un giro della Terra ogni 92 minuti'), T('il satellite GPS', 'circa 2', 'lassù la Terra gira molto più in fretta'), T('il satellite della TV', 'uno solo', 'il Sole si muove intorno a lei')],
          answer: 0,
          explain: T('Giusto: la Stazione è la più bassa e la più veloce: più di 15 giri al giorno!', 'Esatto: 24 × 60 / 92 ≈ 15,6 giri.', 'Esatto: ogni 92 minuti fa il giro del mondo, e passa dalla notte al giorno.'),
        },
        {
          kind: 'q',
          text: T('Il satellite della TV, il più alto dei tre, fa un giro in…', 'Il satellite GPS, a 20 200 km, rispetto alla Stazione spaziale…', 'Più in alto un satellite…'),
          options: [T('un giorno', 'va più piano e ci mette di più', 'più va piano, e più a lungo dura il giro'), T('un’ora', 'va più veloce e ci mette di meno', 'più va veloce, per non cadere'), T('un anno intero', 'va più piano ma ci mette di meno', 'più dura il giro, ma va più veloce')],
          answer: 0,
          explain: T('Giusto: un giorno intero, come la Terra che gira su se stessa.', 'Esatto: v = √(G·M/r) è più piccola, e la strada è più lunga: 12 ore contro 92 minuti.', 'Esatto: va più piano e fa più strada: il giro dura molto di più.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Più in alto, il satellite va…'),
          options: [T('più piano'), T('più veloce'), T('uguale')],
          answer: 0,
          explain: T('Giusto: lassù la Terra tira meno, e basta meno velocità per non cadere.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La velocità in orbita.'),
          vals: { h: [400, 1000, 2000, 20200] }, calc: 'Math.sqrt(398600 / (6371 + h))', unit: 'km/s', tol: 0.05,
          ask: T(null,
            'Che velocità serve per un’orbita circolare a <b>{h} km</b> di altezza? (G·M = 398 600 km³/s², R = 6371 km)',
            'A che velocità vola un satellite in orbita rotonda a <b>{h} km</b> dal suolo? [[v = √(G · M / r), G · M = 398 600 km³/s², r = 6371 km + h]]'),
          explain: T(null, 'Esatto: v = √(G·M/r) = √(398 600 / (6371 + {h})) ≈ {ans:1} km/s.', 'Esatto: circa {ans:1} km al secondo. [[v = √(398 600 / (6371 + {h}))]]'),
        },
        {
          kind: 'q',
          text: T('La Luna, lontanissima, fa un giro della Terra in…', 'La Luna, a 384 000 km, fa un giro della Terra in…', 'E la Luna, il satellite più lontano di tutti, quanto ci mette?'),
          options: [T('quasi un mese', 'circa 27 giorni', 'quasi un mese'), T('un giorno e una notte', 'circa 24 ore', 'un giorno, come la TV'), T('un’ora', 'circa un anno', 'un anno intero')],
          answer: 0,
          explain: T('Giusto: quasi un mese. Per questo la Luna cambia forma ogni sera, piano piano.', 'Esatto: 27,3 giorni, con una velocità di circa 1 km/s.', 'Esatto: ventisette giorni. È da lei che viene la parola «mese».'),
        },
      ],
      hints: [T('Guarda chi fa più giri mentre passa il giorno.', 'v = √(G·M/r): r più grande, v più piccola, giro più lungo.', 'Più in alto: meno gravità, meno velocità, giro più lungo.')],
      solution: T(
        'La Stazione, la più bassa, fa più di 15 giri; il GPS 2; la TV uno solo.',
        'ISS 92 min, GPS 12 h, TV 24 h: più in alto, più lenti.',
        'Più in alto, più lenti: la Stazione in 92 minuti, il GPS in mezza giornata, la TV in un giorno.'),
    },
    {
      id: 'g02-3', kind: 'prevedi', title: 'L’orbita allungata',
      sim: 'kepler', params: { mode: 'ellisse', v: 9.2, h: 400, areas: false }, controls: [],
      intro: T(
        'Questa volta il satellite parte più veloce del giro tondo. Che strada farà? Prima indovina, poi guarda!',
        'A 400 km la velocità per il giro tondo è 7,7 km/s. Che cosa succede se il satellite parte più veloce, o più piano? Prima prevedi, poi guarda.',
        'Nessuna orbita vera è un cerchio perfetto. Che cosa succede quando un satellite parte un po’ troppo veloce, o un po’ troppo piano? Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ v: 9.2, h: 400, areas: false }],
          text: T('Il satellite parte più veloce. Che forma ha la sua strada?', 'Il satellite parte a 9,2 km/s invece di 7,7. Che forma ha l’orbita?', 'Partenza a 9,2 km al secondo, un po’ troppo veloce. Che strada fa il satellite?'),
          options: [T('un ovale allungato', 'un ovale, con la Terra vicino a un capo', 'un ovale lungo, con la Terra verso un capo'), T('un cerchio più grande', 'un cerchio più grande, centrato sulla Terra', 'un cerchio più grande, centrato sulla Terra'), T('una linea dritta', 'una spirale che si allontana', 'una spirale che si allarga a ogni giro')],
          answer: 0,
          explain: T('Un ovale allungato! Si chiama <b>ellisse</b>. Il satellite si allontana, poi torna.', 'Un’<b>ellisse</b>: il satellite sale fino a quasi 11 000 km, poi ricade verso la Terra e torna al punto di partenza.', 'Un’<b>ellisse</b>: si allontana fino a undicimila chilometri, poi torna giù, e così per sempre.'),
          solution: T('L’orbita diventa un’ellisse.'),
        },
        {
          kind: 'q', predict: [{ v: 9.2, h: 400, areas: true }],
          text: T('Ogni spicchio colorato dura lo stesso tempo. Dove il satellite va più veloce?', 'Ogni spicchio colorato è percorso nello stesso tempo. Dove va più veloce il satellite?', 'Ogni spicchio colorato dura lo stesso tempo. Dove corre di più il satellite?'),
          options: [T('quando è vicino alla Terra', 'vicino alla Terra', 'quando passa vicino alla Terra'), T('lontano dalla Terra', 'lontano dalla Terra', 'quando è lontano, in cima all’ovale'), T('sempre uguale', 'va sempre alla stessa velocità', 'sempre alla stessa velocità')],
          answer: 0,
          explain: T('Vicino alla Terra! Lì gli spicchi sono corti e larghi: in poco tempo fa tanta strada.', 'Vicino alla Terra: lì va a 9,2 km/s, lontano solo a 3,6 km/s. Gli spicchi hanno tutti la stessa area.', 'Quando passa vicino alla Terra corre, lontano rallenta: gli spicchi, lunghi o larghi, hanno tutti la stessa area.'),
          solution: T('Il satellite va più veloce vicino alla Terra.'),
        },
        {
          kind: 'q', predict: [{ v: 7, h: 1200, areas: false }],
          text: T('E se parte un po’ più piano del giro tondo?', 'A 1200 km il giro tondo vuole 7,3 km/s. E se il satellite parte a 7 km/s?', 'Ultima prova: un satellite un po’ troppo lento. Che cosa fa?'),
          options: [T('si avvicina alla Terra, poi torna', 'scende dall’altra parte, poi risale', 'scende dall’altra parte, poi torna su'), T('si allontana tanto dall’altra parte', 'sale molto più in alto dall’altra parte', 'sale molto più in alto dall’altra parte'), T('gira in tondo, più piano', 'gira in tondo, solo più piano', 'gira in tondo, solo più lento')],
          answer: 0,
          explain: T('Si avvicina alla Terra dall’altra parte, poi torna su: un’ellisse anche questa.', 'Scende fino a circa 200 km dall’altra parte, poi risale: un’ellisse, con la partenza nel punto più lontano.', 'Scende dall’altra parte quasi a sfiorare l’aria, poi torna su: un’altra ellisse.'),
          solution: T('Si avvicina alla Terra dall’altra parte, poi torna: un’ellisse.'),
        },
        {
          kind: 'q',
          text: T('Allora che forma hanno le strade dei satelliti?', 'Che forma hanno, in generale, le orbite?', 'Che cosa ci dicono questi tre lanci sulle orbite?'),
          options: [T('ovali: il cerchio è un caso speciale', 'ellissi: il cerchio è un caso speciale', 'sono ellissi, e il cerchio è un caso speciale'), T('sempre cerchi, belli rotondi', 'sempre cerchi perfetti, centrati sulla Terra', 'sono sempre cerchi perfetti intorno alla Terra'), T('spirali che si stringono giro dopo giro', 'spirali che si stringono', 'sono spirali che si stringono')],
          answer: 0,
          explain: T('Giusto: ovali, cioè ellissi. Il cerchio è un ovale perfettamente rotondo.', 'Esatto: ellissi, con il centro della Terra in un fuoco. Il cerchio è l’ellisse con i due fuochi coincidenti.', 'Esatto: ellissi. Il cerchio è l’ellisse più rotonda possibile, quasi impossibile da ottenere per davvero.'),
        },
      ],
      hints: [T('Più veloce di così si allontana; più piano si avvicina.', 'Un’orbita è un cerchio solo con la velocità giusta; altrimenti è un’ellisse.', 'Quasi mai la velocità è esattamente quella giusta.')],
    },
    {
      id: 'g02-4', kind: 'lezione', title: 'Le leggi di Keplero',
      sim: 'kepler', params: { mode: 'ellisse', v: 9, h: 400, areas: true }, controls: ['v'],
      labels: { v: { label: 'Velocità del satellite', min: 6, max: 10, step: 0.1, unit: 'km/s' } },
      intro: T(
        'Giovanni Keplero, 400 anni fa, scoprì tre regole dei pianeti: le orbite sono ovali (<b>ellissi</b>); vicino al centro si corre di più; e più l’orbita è grande, più dura il giro. Valgono anche per i satelliti!',
        'Le tre <b>leggi di Keplero</b> (1609-1619): 1) ogni pianeta percorre un’ellisse, con il Sole in uno dei due fuochi; 2) il segmento che lo collega al Sole spazza aree uguali in tempi uguali; 3) il quadrato del periodo è proporzionale al cubo del semiasse maggiore: T²/a³ è lo stesso per tutti i corpi che girano intorno allo stesso centro. Valgono anche per i satelliti intorno alla Terra.',
        'Keplero passò anni sui numeri di Marte prima di arrendersi all’evidenza: le orbite non sono cerchi, ma <b>ellissi</b>. Poi trovò le altre due regole: il pianeta corre di più quando è vicino al Sole, e più l’orbita è grande più il giro è lento, con una regola precisa fra tempo e grandezza. Sono le <b>leggi di Keplero</b>. [[T² / a³ = costante]]'),
      steps: [
        {
          kind: 'free',
          text: T('Fai un’orbita rotonda e una allungata, e guarda gli spicchi colorati.', 'Lancia un’orbita circolare e un’ellisse allungata: confronta gli spicchi e la durata del giro.'),
          need: [
            { when: 'r.circ', try: { v: 7.7 }, msg: T('Ora fai un’orbita rotonda: circa 7,7 km/s.') },
            { when: 'r.orbit && r.ecc > 0.2', try: { v: 9.2 }, msg: T('Ora fai un’orbita bella allungata: più veloce.') },
          ],
        },
        {
          kind: 'q',
          text: T('Su un’orbita più grande, un giro dura…', 'Un satellite su un’orbita con il semiasse 4 volte più grande ha un periodo…', 'Marte è 1,5 volte più lontano dal Sole della Terra. Il suo anno dura…'),
          options: [T('di più', '8 volte più lungo', 'quasi il doppio del nostro: 1,88 anni'), T('di meno', '4 volte più lungo', 'una volta e mezza il nostro'), T('uguale', '16 volte più lungo', 'esattamente come il nostro')],
          answer: 0,
          explain: T('Giusto: più grande l’orbita, più lungo il giro.', 'Esatto: T² è proporzionale ad a³; con a × 4, a³ × 64 e T × √64 = 8.', 'Esatto: 1,88 anni terrestri. Una volta e mezza più lontano, quasi il doppio del tempo.'),
        },
        {
          kind: 'q',
          text: T('Nell’ovale, dov’è la Terra?', 'Nell’ellisse dell’orbita, dove si trova il centro della Terra?', 'Il Sole sta al centro dell’orbita della Terra?'),
          options: [T('spostata verso un capo', 'in uno dei due fuochi', 'no: sta in un fuoco, un po’ di lato'), T('proprio in mezzo all’ovale', 'al centro dell’ellisse', 'sì, proprio nel centro esatto dell’orbita'), T('fuori dall’ovale', 'sulla linea dell’orbita', 'no: sta fuori dall’orbita')],
          answer: 0,
          explain: T('Giusto: la Terra non sta in mezzo, ma spostata verso il punto dove il satellite passa più vicino.', 'Esatto: in un fuoco. Per questo il satellite passa a volte vicino, a volte lontano.', 'Esatto: in un fuoco. L’orbita della Terra però è quasi rotonda: a gennaio siamo solo il 3% più vicini al Sole che a luglio.'),
        },
        {
          kind: 'q',
          text: T('Quando la Terra è più vicina al Sole, corre…', 'Per la seconda legge, quando la Terra è più vicina al Sole…', 'A gennaio la Terra corre intorno al Sole più veloce che a luglio. Perché?'),
          options: [T('più veloce', 'va più veloce', 'a gennaio è più vicina al Sole'), T('più piano', 'va più piano', 'a gennaio da noi è inverno, fa freddo'), T('alla stessa velocità', 'va alla stessa velocità', 'a luglio il Sole la frena')],
          answer: 0,
          explain: T('Giusto: più vicina, più veloce. Come il satellite negli spicchi corti.', 'Esatto: aree uguali in tempi uguali: vicino al Sole il segmento è corto, e per spazzare la stessa area la Terra deve correre di più.', 'Esatto: a gennaio siamo un po’ più vicini al Sole, e corriamo un po’ di più. L’inverno, però, non c’entra con la distanza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La terza legge di Keplero.'),
          vals: { T0: [1, 2, 3], k: [4, 9] }, calc: 'T0 * k * Math.sqrt(k)', unit: 'h', tol: 0.05,
          ask: T(null,
            'Un satellite fa un giro in <b>{T0} h</b>. Un altro gira intorno allo stesso pianeta su un’orbita <b>{k} volte</b> più grande. In quante ore fa un giro?',
            'Un satellite fa il giro in <b>{T0} ore</b>. Un altro, intorno allo stesso pianeta, ha l’orbita <b>{k} volte</b> più grande. Quanto dura il suo giro? [[T₂ = T₁ · k · √k]]'),
          explain: T(null, 'Esatto: T² ∝ a³, quindi T cresce di {k} × √{k}: {ans} h.', 'Esatto: {ans} ore. [[T₂ = {T0} × {k} × √{k} = {ans} h]]'),
        },
      ],
      hints: [T('Guarda la forma degli spicchi: corti e larghi, o lunghi e stretti.', 'Prima legge: ellisse; seconda: aree uguali in tempi uguali; terza: T² ∝ a³.', 'Ellissi, più veloci vicino al centro, giro più lungo se l’orbita è più grande.')],
      solution: T(
        'Rotonda a circa 7,7 km/s, allungata sopra 9: gli spicchi hanno sempre la stessa area.',
        'Circolare a 7,7 km/s; a 9,2 km/s un’ellisse fino a 11 000 km, con periodo più lungo e spicchi di area uguale.',
        'A 7,7 km al secondo un cerchio, a 9,2 un’ellisse: più grande l’orbita, più lungo il giro, e spicchi sempre di area uguale.'),
    },
    {
      id: 'g02-5', kind: 'lezione', title: 'Il satellite che sta fermo',
      sim: 'kepler', params: { mode: 'satelliti', h: 20000, sats: ['iss', 'tv'], mine: true }, controls: ['h'],
      labels: { h: { label: 'Altezza del tuo satellite', min: 400, max: 40000, step: 100, unit: 'km' } },
      intro: T(
        'Le parabole della TV sui tetti guardano sempre lo stesso punto del cielo. Come fa il satellite a stare fermo lassù? Non sta fermo: gira insieme alla Terra! Trova l’altezza giusta per il tuo.',
        'Un satellite <b>geostazionario</b> gira sopra l’equatore con lo stesso periodo della rotazione terrestre, 23 h 56 min: visto da terra sembra fermo. Per la terza legge di Keplero esiste una sola altezza che va bene: circa 35 800 km. Trovala con il tuo satellite.',
        'La parabola sul tetto non si muove mai, eppure riceve un satellite che corre a 3 km al secondo. Il trucco: il satellite fa un giro in un giorno, come la Terra sotto di lui. Si chiama <b>geostazionario</b>, e c’è un’unica altezza in cui funziona.'),
      steps: [
        {
          kind: 'free',
          text: T('Trova l’altezza in cui il tuo satellite resta sempre sopra l’antenna rossa.', 'Trova l’altezza in cui il tuo satellite resta sempre sopra l’antenna: il suo giro deve durare un giorno.'),
          need: [{ when: 'r.fixed', try: { h: 35800 }, msg: T('Non resta sopra l’antenna. Se il suo giro dura meno di un giorno, portalo più in alto.') }],
        },
        {
          kind: 'q',
          text: T('Perché la parabola sul tetto non si muove mai?', 'Un satellite geostazionario ha un periodo di…', 'Perché i satelliti della TV stanno tutti a circa 36 000 km?'),
          options: [T('il satellite gira con la Terra', 'circa 24 ore', 'solo lì un giro dura un giorno'), T('il satellite è appeso a un filo', 'circa 92 minuti', 'lì la gravità della Terra finisce'), T('la Terra è ferma', 'circa 12 ore', 'lì sono sopra le nuvole')],
          answer: 0,
          explain: T('Giusto: il satellite fa un giro in un giorno, proprio come la Terra. Così sta sempre sopra la stessa casa.', 'Esatto: lo stesso periodo della Terra che gira, 23 h 56 min.', 'Esatto: per la terza legge di Keplero, un giro di un giorno vuole proprio quell’altezza.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Un satellite più basso di quello della TV resta sopra l’antenna?'),
          options: [T('no: gira più in fretta'), T('sì, resta sempre lì sopra'), T('no: gira più piano')],
          answer: 0,
          explain: T('Giusto: più basso gira più in fretta della Terra, e la supera.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Periodi e distanze.'),
          vals: { r: [[10500], [168000]] }, calc: '24 * Math.pow(r / 42000, 1.5)', unit: 'h', tol: 0.05,
          ask: T(null,
            'Un satellite geostazionario sta a 42 000 km dal centro della Terra e fa un giro in 24 h. In quante ore fa un giro un satellite a <b>{r} km</b> dal centro?',
            'Il satellite della TV, a 42 000 km dal centro della Terra, fa un giro in 24 ore. E uno a <b>{r} km</b> dal centro? [[T = 24 h · (r / 42 000 km)^(3/2)]]'),
          explain: T(null, 'Esatto: T² ∝ r³, quindi T = 24 h · (r / 42 000)^(3/2) = {ans} h.', 'Esatto: {ans} ore. [[T = 24 × ({r} / 42 000)^(3/2) = {ans} h]]'),
        },
        {
          kind: 'q',
          text: T('Il segnale della TV va fino al satellite e torna. Ci mette…', 'Un segnale radio va a 300 000 km/s. Quanto tempo per andare e tornare da un satellite a 36 000 km?', 'Nelle telefonate via satellite si sente un piccolo ritardo. Perché?'),
          options: [T('meno di un secondo', 'circa un quarto di secondo', 'il segnale fa 72 000 km, andata e ritorno'), T('più di un’ora', 'circa un secondo', 'i satelliti sono un po’ lenti a rispondere ai messaggi'), T('circa un giorno intero', 'circa un millesimo di secondo', 'l’aria rallenta le onde radio')],
          answer: 0,
          explain: T('Giusto: meno di un secondo, anche se il satellite è lontanissimo.', 'Esatto: 72 000 km / 300 000 km/s = 0,24 s.', 'Esatto: settantaduemila chilometri, anche alla velocità della luce, fanno un quarto di secondo.'),
        },
      ],
      hints: [T('Il tuo satellite deve fare un giro in un giorno: prova più in alto o più in basso.', 'Il periodo deve essere 23 h 56 min: circa 35 800 km di altezza.', 'Un giro al giorno: circa trentaseimila chilometri di altezza.')],
      solution: T(
        'A circa 35800 km il tuo satellite resta sempre sopra l’antenna.',
        'A circa 35 800 km il periodo è 23 h 56 min: il satellite è geostazionario.',
        'A circa trentaseimila chilometri il satellite gira insieme alla Terra.'),
    },
    {
      id: 'g02-6', kind: 'ripasso', title: 'Ripasso delle orbite',
      intro: T('Ripassiamo: satelliti, ovali e giri lunghi!', 'Ripasso: orbite circolari ed ellittiche, leggi di Keplero, satelliti geostazionari.', 'Ripasso: le orbite intorno a noi, dalla Stazione spaziale alla Luna.'),
      steps: [
        {
          kind: 'q',
          text: T('Due satelliti: uno basso e uno alto. Chi va più veloce?', 'Due satelliti in orbita circolare, a 400 km e a 20 000 km. Quale è più veloce?', 'Fra la Stazione spaziale e un satellite GPS, chi corre di più?'),
          options: [T('quello basso', 'quello a 400 km', 'la Stazione, più bassa'), T('quello alto', 'quello a 20 000 km', 'il GPS, che sta più in alto'), T('vanno uguali', 'hanno la stessa velocità', 'corrono uguale')],
          answer: 0,
          explain: T('Giusto: più in basso, più veloce.', 'Esatto: v = √(G·M/r): 7,7 km/s contro 3,9 km/s.', 'Esatto: la Stazione corre a quasi 8 km al secondo, il GPS a meno di 4.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Velocità in orbita.'),
          vals: { h: [600, 1500, 3000] }, calc: 'Math.sqrt(398600 / (6371 + h))', unit: 'km/s', tol: 0.05,
          ask: T(null,
            'Che velocità ha un satellite in orbita circolare a <b>{h} km</b> di altezza? (G·M = 398 600 km³/s², R = 6371 km)',
            'Un satellite gira in tondo a <b>{h} km</b> dal suolo. Quanto va veloce? [[v = √(G · M / r), G · M = 398 600 km³/s²]]'),
          explain: T(null, 'Esatto: v = √(398 600 / (6371 + {h})) ≈ {ans:1} km/s.', 'Esatto: circa {ans:1} km/s.'),
        },
        {
          kind: 'q',
          text: T('Dove corre di più un satellite su un’orbita ovale?', 'Su un’orbita ellittica, il satellite è più veloce…', 'Una cometa passa vicino al Sole ogni 76 anni. Quando corre di più?'),
          options: [T('vicino alla Terra', 'nel punto più vicino alla Terra', 'quando passa vicinissima al Sole'), T('lontano dalla Terra', 'nel punto più lontano dalla Terra', 'quando è lontanissima'), T('sempre uguale', 'sempre alla stessa velocità', 'sempre alla stessa velocità')],
          answer: 0,
          explain: T('Giusto: vicino corre, lontano rallenta.', 'Esatto: aree uguali in tempi uguali: vicino al centro la velocità è massima.', 'Esatto: è la cometa di Halley. Vicino al Sole sfreccia, lontano quasi si ferma.'),
        },
        {
          kind: 'q',
          text: T('Il satellite della TV fa un giro in…', 'Un satellite geostazionario ha un periodo di…', 'Perché le parabole della TV puntano sempre nello stesso punto?'),
          options: [T('un giorno', 'un giorno: 23 h 56 min', 'il satellite gira insieme alla Terra'), T('un’ora', 'un’ora e mezza, come la Stazione', 'il satellite è fermo, immobile nello spazio'), T('un mese intero', 'un mese', 'la parabola segue il satellite')],
          answer: 0,
          explain: T('Giusto: un giorno, come la Terra.', 'Esatto: lo stesso periodo della rotazione terrestre.', 'Esatto: fa un giro al giorno, insieme alla Terra: da qui sembra fermo.'),
        },
        {
          kind: 'q',
          text: T('Un pianeta lontano dal Sole fa un giro…', 'Giove sta a 5,2 volte la distanza Terra-Sole. Il suo anno dura circa…', 'Perché i pianeti lontani hanno anni lunghissimi?'),
          options: [T('lentamente, in tantissimi anni', '12 anni terrestri', 'vanno più piano e fanno più strada'), T('in fretta, in pochi giorni', '5 anni terrestri', 'il Sole li tira di più e li rallenta'), T('come la Terra, in un anno', '27 anni terrestri', 'girano su orbite a spirale')],
          answer: 0,
          explain: T('Giusto: più lontano, più lento. Giove ci mette 12 anni!', 'Esatto: T = 5,2^(3/2) ≈ 11,9 anni.', 'Esatto: lassù il Sole tira poco, la velocità è bassa e la strada lunghissima: Nettuno ci mette 165 anni.'),
        },
      ],
    },
    {
      id: 'g02-7', kind: 'boss', who: 'bilancia', title: 'Il pianeta nella nebbia', win: T('Esperimento riuscito!'),
      sim: 'kepler', params: { mode: 'ellisse', v: 12.63, h: 3629, M: 4, hide: true, areas: false }, controls: [],
      intro: T(
        'Sono Bilancia! Sotto il mio telo c’è un pianeta. È più pesante o più leggero della Terra? Non puoi guardarlo: puoi solo cronometrare il suo satellite. Esperimento al buio!',
        'Sono Bilancia, e oggi peso un pianeta. Sotto il mio telo ce n’è uno grande come la Terra, ma di che massa? Un satellite gli gira intorno in un cerchio, a 10 000 km dal centro. Cronometralo.',
        'Sono Bilancia. Gli astronomi pesano pianeti che nessuno toccherà mai, solo guardando le loro lune. Proviamo anche noi: sotto il telo c’è un pianeta, e un satellite gli gira intorno a 10 000 km dal centro.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Lancia il satellite e guarda quanto dura un giro.', 'Lancia e leggi il tempo di un giro nel riquadro.') },
        {
          kind: 'q', review: false,
          text: T('Intorno alla Terra, alla stessa distanza, un giro dura 166 minuti. Qui 83. Il pianeta è…', 'Alla stessa distanza, intorno alla Terra un giro dura 166 min; qui 83 min. La massa del pianeta nascosto, rispetto alla Terra, è…', 'Qui il giro dura 83 minuti; intorno alla Terra, alla stessa distanza, 166. Che cosa ti dice del pianeta nascosto?'),
          options: [T('più pesante della Terra', '4 volte più grande', 'ha quattro volte la massa della Terra'), T('più leggero della Terra', '2 volte più grande', 'ha il doppio della massa della Terra'), T('uguale alla Terra', 'la metà', 'è come la Terra, ma molto più freddo e buio')],
          answer: 0,
          explain: T('Giusto: il satellite gira più in fretta, quindi il pianeta lo tira più forte. È più pesante!', 'Esatto: T² = 4π²r³/(G·M), quindi a parità di r il periodo è inversamente proporzionale a √M. Periodo dimezzato: massa quadrupla.', 'Esatto: più massa, più gravità, giro più veloce. Metà del tempo vuol dire quattro volte la massa.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Altri pianeti nella nebbia.'),
          vals: { T0: [60, 40, 30] }, calc: '(120 / T0) ** 2', unit: '', tol: 0.05,
          ask: T(null,
            'Intorno alla Terra, a una certa distanza, un satellite fa un giro in 120 min. Intorno a un pianeta misterioso, alla stessa distanza, in <b>{T0} min</b>. Quante volte la massa della Terra ha quel pianeta?',
            'Alla stessa distanza dal centro, un satellite gira intorno alla Terra in 120 minuti e intorno a un pianeta misterioso in <b>{T0}</b>. Quante masse terrestri ha il pianeta? [[M / M_Terra = (120 / {T0})²]]'),
          explain: T(null, 'Esatto: M è proporzionale a 1/T²: (120 / {T0})² = {ans} masse terrestri.', 'Esatto: {ans} volte la massa della Terra. [[(120 / {T0})² = {ans}]]'),
        },
        {
          kind: 'q',
          text: T('Come hai pesato il pianeta senza vederlo?', 'Che cosa ti ha permesso di pesare il pianeta nascosto?', 'Così si pesano pianeti e stelle che nessuno toccherà mai. Su che cosa ci si basa?'),
          options: [T('dal tempo di un giro del satellite', 'il periodo del satellite (terza legge di Keplero)', 'sul tempo di un giro delle loro lune'), T('dal colore e dalla forma del telo', 'il colore della nebbia intorno al pianeta nascosto', 'sulla luce che mandano nel telescopio'), T('dal rumore che fa il satellite girando', 'il peso del satellite, misurato con una bilancia', 'su quanto sembrano grandi nel cielo')],
          answer: 0,
          explain: T(
            'Giusto! Bilancia toglie il telo: è un pianeta con quattro volte la massa della Terra.',
            'Esatto: periodo e raggio dell’orbita danno la massa, M = 4π²r³/(G·T²); la massa del satellite non conta. Bilancia toglie il telo: 4 masse terrestri!',
            'Esatto: il tempo di un giro e la distanza bastano a pesare il pianeta. Bilancia toglie il telo: quattro volte la Terra.'),
        },
      ],
      hints: [T('Più forte tira il pianeta, più in fretta gira il satellite.', 'A parità di r, T è inversamente proporzionale a √M.', 'Metà del tempo: quattro volte la massa.')],
      solution: T(
        'Il giro dura la metà: il pianeta ha quattro volte la massa della Terra.',
        'T dimezzato, quindi M quadruplicata: 4 masse terrestri.',
        'Il satellite gira in metà tempo: il pianeta ha quattro volte la massa della Terra.'),
    },
  ],
};
