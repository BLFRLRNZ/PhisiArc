// O04 · Risonanza ed effetto Doppler. Simulazioni: la risonanza (resonance.js: l'altalena spinta, il tappeto elastico,
// il bicchiere di cristallo) e l'effetto Doppler (doppler.js: la sirena che passa, l'aereo e il bang supersonico, le
// ambulanze nella nebbia). Al lancio il suono si sente davvero: la nota che fa vibrare il bicchiere, la sirena che scende.
// La zona parte dalle spinte a tempo sull'altalena, prevede quale nota rompe il bicchiere, ne disegna la curva di
// risonanza, passa alla sirena che cambia nota e all'aereo più veloce del suono, costruisce il tappeto elastico del parco
// e finisce con Bilancia che nasconde due ambulanze nella nebbia.
import { T } from '../util.js';

export default {
  id: 'O04',
  title: 'Risonanza ed effetto Doppler',
  levels: [
    {
      id: 'o04-1', kind: 'lezione', title: 'La spinta giusta',
      sim: 'resonance', params: { mode: 'altalena', Tp: 3 }, controls: ['Tp'],
      intro: T(
        'Su un’altalena, una spintarella al momento giusto basta per andare sempre più in alto. Il segreto? Spingere con il ritmo dell’altalena, che va e torna in 2 secondi. Prova a spingere più spesso o più di rado: quando sale di più?',
        'Ogni oscillatore ha una sua <b>frequenza naturale</b>: un’altalena lunga 1 m fa un’oscillazione ogni 2 secondi. Se la spingi con lo stesso ritmo, ogni spinta arriva nel momento giusto e aggiunge energia: l’ampiezza cresce. È la <b>risonanza</b>. Con un ritmo diverso, le spinte a volte aiutano e a volte frenano.',
        'La risonanza: quando una forza periodica ha la frequenza naturale dell’oscillatore, ogni spinta arriva in fase e l’energia si accumula. Succede alle altalene, ai ponti, ai bicchieri, alle molecole. Un’altalena lunga 1 m ha un periodo naturale di circa 2 s.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una spinta ogni 2 secondi, e una ogni 3.', 'Prova una spinta ogni 2 s e una ogni 3 s: confronta le ampiezze.'),
          need: [
            { when: 'Tp == 2', try: { Tp: 2 }, msg: T('Prova una spinta ogni 2 secondi.', 'Manca una prova con una spinta ogni 2 s.') },
            { when: 'Tp == 3', try: { Tp: 3 }, msg: T('Ora una spinta ogni 3 secondi.', 'Manca una prova con una spinta ogni 3 s.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando sale di più l’altalena?', 'Perché, spingendo ogni 2 secondi, l’altalena sale sempre di più?', 'Che cos’è la risonanza?'),
          options: [T('con il suo ritmo', 'ogni spinta arriva al momento giusto', 'una forza periodica alla frequenza naturale'), T('spingendo più spesso che si può', 'perché le spinte diventano sempre più forti', 'una forza molto grande, data una volta sola'), T('spingendo più di rado, ogni 3 secondi', 'perché l’altalena si stanca di meno, fra una spinta e l’altra', 'un’oscillazione che si spegne da sola')],
          answer: 0,
          explain: T('Giusto: con il suo ritmo, ogni spinta aiuta.', 'Esatto: le spinte sono in fase con l’altalena e aggiungono energia.', 'Esatto: ogni spinta arriva in fase, e l’energia si accumula.'),
        },
        {
          kind: 'q',
          text: T('Spingendo ogni 3 secondi, l’altalena…', 'Con una spinta ogni 3 s, che cosa succede?', 'Perché, fuori risonanza, l’ampiezza resta piccola?'),
          options: [T('sale poco: a volte aiuti, a volte freni', 'a volte la spinta aiuta, a volte frena', 'in media le spinte si annullano'), T('sale più in alto di prima', 'sale più in alto, perché ha più tempo', 'perché le spinte sono troppo deboli per lei'), T('si ferma subito', 'si ferma del tutto dopo la prima spinta', 'perché l’attrito cresce a ogni spinta')],
          answer: 0,
          explain: T('Giusto: le spinte arrivano fuori tempo.', 'Esatto: metà delle spinte frenano.', 'Esatto: arrivano in fasi diverse, e il loro lavoro in media è quasi zero.'),
        },
        {
          kind: 'q',
          text: T('E se spingi ogni 4 secondi, una volta ogni due dondolii?', 'Con una spinta ogni 4 s, una ogni due oscillazioni, l’altalena…', 'Perché anche spingendo ogni 4 s l’altalena cresce, ma più piano?'),
          options: [T('sale, ma più piano', 'cresce, ma più piano: spinte in tempo, ma la metà', 'le spinte sono in fase, ma una volta su due'), T('non sale per niente', 'resta quasi ferma: 4 non è 2', 'perché 4 s è proprio il suo periodo naturale, il doppio di 2'), T('sale più in fretta', 'cresce più in fretta: le spinte sono più distanziate', 'perché l’altalena, intanto, si allunga')],
          answer: 0,
          explain: T('Giusto: in tempo, ma la metà delle volte.', 'Esatto: sempre in fase, ma con metà delle spinte.', 'Esatto: il periodo delle spinte è un multiplo di quello naturale.'),
        },
        {
          kind: 'q',
          text: T('Perché i soldati, sui ponti, non marciano tutti a tempo?', 'Perché i soldati rompono il passo quando attraversano un ponte?', 'Nel 1831 un ponte sospeso vicino a Manchester crollò mentre lo attraversavano dei soldati al passo. Che cosa si impara?'),
          options: [T('per non far ballare il ponte', 'per non mandarlo in risonanza', 'mai forzare una struttura alla sua frequenza naturale'), T('perché sono stanchi', 'per fare meno rumore', 'che i ponti sospesi non reggono il peso di tante persone'), T('per arrivare prima dall’altra parte', 'per non scivolare sul ponte bagnato', 'che sui ponti i soldati devono correre')],
          answer: 0,
          explain: T('Giusto: passi a tempo sono come spinte a tempo.', 'Esatto: tanti passi a tempo possono far oscillare il ponte sempre di più.', 'Esatto: da allora i soldati rompono il passo sui ponti.'),
        },
      ],
      hints: [T('Spingi con il ritmo dell’altalena: ogni 2 secondi.', 'Risonanza: spinte alla frequenza naturale.', 'In fase con l’oscillatore, l’energia si accumula.')],
      solution: T(
        'Una spinta ogni 2 secondi, con il ritmo dell’altalena, la fa salire sempre di più.',
        'Spinte con il periodo naturale di 2 s: risonanza.',
        'La risonanza: forza periodica alla frequenza naturale.'),
    },
    {
      id: 'o04-2', kind: 'prevedi', title: 'Il bicchiere che si rompe',
      sim: 'resonance', params: { mode: 'bicchiere', f: 700, vol: 3 }, controls: [],
      intro: T(
        'Si dice che una cantante possa rompere un bicchiere con la voce. Serve gridare fortissimo? Oppure basta la nota giusta? Se lo colpisci, il bicchiere suona una nota tutta sua. Prima indovina, poi guarda.',
        'Un bicchiere di cristallo ha una frequenza naturale: colpito, suona a 880 Hz. Un altoparlante gli manda una nota. Che cosa conta di più per romperlo: il volume, o la frequenza giusta? Prevedi, poi guarda.',
        'Un bicchiere di cristallo è un oscillatore con pochissimo smorzamento: colpito, vibra a lungo a 880 Hz. Un altoparlante lo forza con una nota. Il volume conta, ma conta di più la frequenza. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ f: 700, vol: 5 }],
          text: T('Una nota fortissima, ma diversa da quella del bicchiere. Il bicchiere…', 'Volume al massimo, ma frequenza 700 Hz. Il bicchiere…', 'Volume massimo a 700 Hz, lontano dalla risonanza. Il bicchiere…'),
          options: [T('vibra appena', 'vibra poco e resta intero', 'vibra poco: fuori risonanza risponde debolmente'), T('si rompe subito', 'si rompe: il volume è al massimo', 'si rompe: conta solo il volume'), T('si rompe dopo un po’', 'si scalda e si rompe dopo qualche secondo', 'si rompe, ma solo dopo molti secondi di vibrazione')],
          answer: 0,
          explain: T('Giusto: la nota sbagliata non lo scuote, e resta intero.', 'Esatto: fuori risonanza, anche il volume massimo fa poco.', 'Esatto: lontano dalla frequenza naturale, la forza è quasi sempre fuori fase.'),
          solution: T('Vibra appena e resta intero.', 'Vibra poco e resta intero.'),
        },
        {
          kind: 'q', predict: [{ f: 880, vol: 4 }],
          text: T('Ora una nota meno forte, ma uguale a quella del bicchiere…', 'Volume 4, ma alla sua frequenza, 880 Hz…', 'Volume 4, esattamente a 880 Hz…'),
          options: [T('vibra sempre di più e si rompe', 'vibra sempre di più, e si rompe', 'l’ampiezza cresce fino a romperlo'), T('resta fermo', 'resta intero: il volume non basta', 'resta intero: serve il volume massimo'), T('vibra come prima', 'vibra come con 700 Hz', 'vibra come prima: la frequenza non conta')],
          answer: 0,
          explain: T('Giusto: la nota giusta lo fa vibrare tantissimo.', 'Esatto: in risonanza ogni oscillazione aggiunge energia.', 'Esatto: in risonanza l’ampiezza cresce di decine di volte.'),
          solution: T('Vibra sempre di più e si rompe.', 'Si rompe.'),
        },
        {
          kind: 'q', predict: [{ f: 880, vol: 1 }],
          text: T('La nota giusta, ma piano piano. Il bicchiere…', 'Frequenza giusta, 880 Hz, ma volume 1…', 'Alla risonanza, ma con volume 1…'),
          options: [T('vibra, ma resta intero', 'vibra, ma non si rompe', 'vibra, ma sotto la soglia di rottura'), T('si rompe lo stesso, in un attimo', 'si rompe: basta la frequenza giusta', 'si rompe: in risonanza l’ampiezza è infinita'), T('non vibra per niente', 'non vibra: il volume è troppo basso', 'resta immobile: serve il volume massimo')],
          answer: 0,
          explain: T('Giusto: serve la nota giusta, e anche un po’ di forza.', 'Esatto: la risonanza moltiplica la forza, ma la forza serve.', 'Esatto: lo smorzamento tiene l’ampiezza finita.'),
          solution: T('Vibra, ma resta intero.', 'Vibra, ma non si rompe.'),
        },
        {
          kind: 'q',
          text: T('Allora, per rompere il bicchiere conta soprattutto…', 'Che cosa conta di più per rompere il bicchiere?', 'Che cosa mostra il bicchiere?'),
          options: [T('la nota giusta', 'la frequenza giusta, poi il volume', 'in risonanza una forza piccola fa effetti grandi'), T('solo il volume, più forte possibile', 'solo il volume: più forte è, meglio è', 'conta solo l’intensità della forza, non la sua frequenza'), T('la fortuna di chi canta', 'la grandezza del bicchiere', 'che il cristallo si rompe a caso')],
          answer: 0,
          explain: T('Giusto: la nota del bicchiere, con un po’ di volume.', 'Esatto: la frequenza giusta moltiplica l’effetto del volume.', 'Esatto: è la risonanza.'),
        },
      ],
      hints: [T('Il bicchiere ha la sua nota: va colpita quella.', 'In risonanza, anche una forza piccola fa vibrare molto.', 'La risposta è grande solo vicino alla frequenza naturale.')],
    },
    {
      id: 'o04-3', kind: 'lezione', title: 'La curva della risonanza',
      sim: 'resonance', params: { mode: 'bicchiere', f: 700, vol: 3 }, controls: ['f', 'vol'],
      intro: T(
        'Ora cerca tu la nota del bicchiere! Prova note diverse, sempre con lo stesso volume, e guarda quanto vibra: il disegno sotto ricorda ogni prova. Dove i puntini fanno una punta, hai trovato la nota giusta.',
        'Prova frequenze diverse, con lo stesso volume, e guarda quanto vibra il bicchiere: il grafico raccoglie le prove. È la <b>curva di risonanza</b>: bassa lontano dalla frequenza naturale, con un picco stretto proprio lì.',
        'La curva di risonanza: l’ampiezza di un oscillatore forzato in funzione della frequenza. Meno smorzamento, picco più alto e più stretto: per questo il cristallo, che vibra a lungo, è così selettivo. Un dito appoggiato sul bordo smorza la vibrazione e abbassa il picco.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova note diverse: più gravi, più acute, e quella giusta.', 'Prova sotto 860 Hz, sopra 900 Hz e proprio a 880 Hz.'),
          need: [
            { when: 'f < 860', try: { f: 800 }, msg: T('Prova una nota più grave.', 'Manca una prova sotto 860 Hz.') },
            { when: 'f > 900', try: { f: 960 }, msg: T('Ora una nota più acuta.', 'Manca una prova sopra 900 Hz.') },
            { when: 'f == 880', try: { f: 880 }, msg: T('Ora cerca la nota giusta.', 'Manca una prova a 880 Hz.') },
          ],
        },
        {
          kind: 'q',
          text: T('Dove vibra di più il bicchiere?', 'A che frequenza vibra di più il bicchiere?', 'Che forma ha la curva di risonanza del bicchiere?'),
          options: [T('alla sua nota, e lì soltanto', 'a 880 Hz', 'un picco stretto'), T('con le note più acute', 'alle frequenze più alte possibili', 'una salita continua verso le frequenze alte'), T('con tutte le note uguale', 'uguale a tutte le frequenze', 'una linea piatta: risponde uguale a tutto')],
          answer: 0,
          explain: T('Giusto: un po’ più su o un po’ più giù, e vibra appena.', 'Esatto: alla sua frequenza naturale, 880 Hz, e poco intorno.', 'Esatto: un picco alto e stretto alla frequenza naturale, perché il cristallo è poco smorzato.'),
        },
        {
          kind: 'q',
          text: T('Se appoggi un dito sul bordo del bicchiere…', 'Se appoggi un dito sul bordo, la risonanza…', 'Che cosa fa lo smorzamento alla curva di risonanza?'),
          options: [T('vibra meno: il dito lo frena', 'si indebolisce: il dito smorza la vibrazione', 'abbassa e allarga il picco'), T('vibra di più', 'si rafforza: il dito spinge il vetro', 'alza e stringe il picco'), T('cambia nota', 'sparisce del tutto, a ogni nota e a ogni volume', 'sposta il picco senza abbassarlo')],
          answer: 0,
          explain: T('Giusto: il dito gli toglie energia.', 'Esatto: più smorzamento, picco più basso.', 'Esatto: picco più basso e più largo.'),
        },
        {
          kind: 'q',
          text: T('Nel 2000 un ponte di Londra ballava sotto i passi della gente. Perché?', 'Perché il Millennium Bridge di Londra, nel 2000, oscillava sotto i pedoni?', 'Come si è curato il Millennium Bridge, che oscillava sotto i pedoni?'),
          options: [T('i passi avevano il ritmo del ponte', 'i passi lo spingevano alla sua frequenza naturale', 'con degli smorzatori'), T('c’era troppo vento sul fiume, quel giorno', 'per il vento forte sul Tamigi', 'chiudendolo per sempre'), T('era fatto di gomma, invece che di acciaio', 'perché era troppo pesante', 'rendendolo più pesante')],
          answer: 0,
          explain: T('Giusto: tanti passi a tempo, come spinte all’altalena.', 'Esatto: e la gente, sentendolo ondeggiare, si metteva al passo con lui.', 'Esatto: decine di smorzatori, che assorbono l’energia delle oscillazioni: il ponte non balla più.'),
        },
      ],
      hints: [T('Cerca dove il bicchiere vibra di più: la sua nota.', 'Il picco della curva è alla frequenza naturale, 880 Hz.', 'Il picco è alto e stretto perché lo smorzamento è piccolo.')],
      solution: T(
        'Il bicchiere vibra tanto solo con la sua nota.',
        'La curva ha un picco stretto a 880 Hz.',
        'Curva di risonanza: picco alla frequenza naturale; più smorzamento, picco più basso e più largo.'),
    },
    {
      id: 'o04-4', kind: 'lezione', title: 'La sirena che passa',
      sim: 'doppler', params: { mode: 'sirena', vs: 30 }, controls: ['vs'],
      intro: T(
        'Hai mai sentito un’ambulanza che passa? Mentre arriva, la sirena è più acuta; quando se ne va, diventa più grave: niii… nooo! Eppure la sirena suona sempre uguale. È l’effetto Doppler. Ascolta, e guarda le onde.',
        'L’<b>effetto Doppler</b>: se la sorgente si muove, le onde davanti a lei si stringono e quelle dietro si allargano. Chi sta davanti sente una frequenza più alta, chi sta dietro una più bassa. Qui la sirena suona a 700 Hz, e l’ambulanza può andare a velocità diverse.',
        'Christian Doppler, 1842: la frequenza percepita dipende dal moto della sorgente. Se la sorgente si avvicina, ogni cresta parte un po’ più vicina a chi ascolta, e le creste arrivano più fitte. [[f′ = f · v / (v − vₛ)]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova l’ambulanza ferma e veloce.', 'Prova l’ambulanza ferma e a 50 m/s o più.'),
          need: [
            { when: 'vs == 0', try: { vs: 0 }, msg: T('Prova l’ambulanza ferma.', 'Manca una prova con l’ambulanza ferma.') },
            { when: 'vs >= 50', try: { vs: 60 }, msg: T('Ora l’ambulanza veloce.', 'Manca una prova a 50 m/s o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Mentre l’ambulanza arriva, la sirena sembra…', 'Chi sta davanti all’ambulanza che arriva sente…', 'Perché davanti alla sorgente le creste arrivano più fitte?'),
          options: [T('più acuta', 'una frequenza più alta di 700 Hz', 'ogni cresta parte più vicina di quella prima'), T('più grave', 'una frequenza più bassa di 700 Hz', 'perché il suono, davanti, corre più veloce'), T('uguale', 'esattamente 700 Hz', 'perché la sirena, mentre corre, cambia nota da sola')],
          answer: 0,
          explain: T('Giusto: niii… più acuta mentre arriva.', 'Esatto: le onde davanti si stringono.', 'Esatto: la sorgente insegue le sue creste.'),
        },
        {
          kind: 'q',
          text: T('Quando l’ambulanza se ne va, la sirena…', 'Dopo che l’ambulanza è passata, la frequenza sentita…', 'Il suono, dietro la sorgente, corre più piano?'),
          options: [T('diventa più grave', 'scende sotto i 700 Hz', 'no: corre a 343 m/s, ma le creste sono più distanti'), T('diventa più acuta', 'sale sopra i 700 Hz, e resta lì', 'sì: dietro la sorgente il suono corre più piano, a fatica'), T('resta uguale', 'resta 700 Hz, come la sirena', 'sì: dietro si ferma quasi del tutto')],
          answer: 0,
          explain: T('Giusto: nooo… più grave mentre se ne va.', 'Esatto: le onde dietro si allargano.', 'Esatto: cambia la lunghezza d’onda, non la velocità del suono.'),
        },
        {
          kind: 'q',
          text: T('E se l’ambulanza è ferma?', 'Con l’ambulanza ferma, chi sente che cosa?', 'L’effetto Doppler cambia la nota della sirena, o quella sentita?'),
          options: [T('la nota resta uguale per tutti', 'tutti sentono 700 Hz', 'solo quella sentita'), T('è più acuta per chi è vicino', 'chi è vicino sente più acuto', 'quella della sirena, che si sforza di più'), T('non si sente', 'nessuno la sente', 'tutte e due allo stesso modo')],
          answer: 0,
          explain: T('Giusto: ferma, nessun cambio di nota.', 'Esatto: niente moto, niente Doppler.', 'Esatto: la sirena suona sempre a 700 Hz; cambia quello che arriva.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La sirena che arriva.'),
          vals: { u: [[10, 20], [30]] }, calc: '700 * 343 / (343 - u)', unit: 'Hz', tol: 1.5,
          ask: T(null,
            'La sirena suona a 700 Hz e l’ambulanza arriva a <b>{u} m/s</b>. Che frequenza sente chi sta davanti?',
            'Sirena 700 Hz, sorgente che si avvicina a <b>{u} m/s</b>, suono a 343 m/s: frequenza sentita? [[f′ = f · v / (v − vₛ)]]'),
          explain: T(null, 'Esatto: f′ = 700 × 343 / (343 − {u}) = {ans:0} Hz.', 'Esatto: {ans:0} Hz.'),
        },
      ],
      hints: [T('Mentre arriva, più acuta; mentre se ne va, più grave.', 'Davanti le onde si stringono: frequenza più alta.', 'Davanti: f per v diviso (v meno vₛ); dietro: f per v diviso (v più vₛ).')],
      solution: T(
        'Mentre l’ambulanza arriva la sirena è più acuta, mentre se ne va è più grave.',
        'Davanti: frequenza più alta; dietro: più bassa. Con 30 m/s, 767 Hz e 644 Hz.',
        'Effetto Doppler: cambia la frequenza sentita, non quella della sorgente.'),
    },
    {
      id: 'o04-5', kind: 'lezione', title: 'Più veloce del suono',
      sim: 'doppler', params: { mode: 'aereo', mach: 'lento' }, controls: ['mach'],
      intro: T(
        'Gli aerei più veloci corrono più del suono! Allora le onde che mandano non riescono a scappare davanti: si ammucchiano in un cono. Quando il cono passa sopra di te, senti un BANG fortissimo: il bang supersonico.',
        'Se la sorgente va veloce come il suono, i fronti d’onda si ammucchiano davanti a lei: è il «muro del suono». Più veloce ancora, i fronti formano un <b>cono</b>, e lungo il cono la pressione cambia di colpo: a terra arriva il <b>bang supersonico</b>. La velocità divisa per quella del suono è il <b>numero di Mach</b>.',
        'A velocità supersonica la sorgente supera i propri fronti d’onda: si forma il cono di Mach, con un’onda d’urto sulla superficie. Più è veloce, più il cono è stretto. Anche lo schiocco di una frusta è un piccolo bang supersonico: la punta supera i 343 m/s.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova tutte e tre le velocità.', 'Prova Mach 0,5, Mach 1 e Mach 1,5.'),
          need: [
            { when: "mach == 'lento'", try: { mach: 'lento' }, msg: T('Prova l’aereo più lento del suono.', 'Manca la prova a Mach 0,5.') },
            { when: "mach == 'suono'", try: { mach: 'suono' }, msg: T('Ora veloce come il suono.', 'Manca la prova a Mach 1.') },
            { when: "mach == 'veloce'", try: { mach: 'veloce' }, msg: T('Ora più veloce del suono.', 'Manca la prova a Mach 1,5.') },
          ],
        },
        {
          kind: 'q',
          text: T('Un aereo più veloce del suono passa sopra di te. Lo senti…', 'Un aereo supersonico passa sopra di te. Quando lo senti?', 'Perché a terra il bang arriva dopo il passaggio dell’aereo?'),
          options: [T('dopo che è passato, con un BANG', 'dopo che è passato: arriva il bang', 'il cono di Mach resta dietro all’aereo'), T('prima che arrivi', 'prima che arrivi, come gli aerei lenti', 'perché il suono rimbalza sulle nuvole e torna giù'), T('mai: non fa rumore', 'mai: va troppo veloce per fare rumore', 'perché il pilota spegne i motori sopra le case')],
          answer: 0,
          explain: T('Giusto: prima lo vedi passare, poi BANG!', 'Esatto: il suono gli sta dietro, nel cono.', 'Esatto: il cono è attaccato all’aereo, si trascina dietro, e tocca terra dopo il passaggio.'),
        },
        {
          kind: 'q',
          text: T('Quando l’aereo va veloce come il suono, le onde…', 'A Mach 1, che cosa fanno i fronti d’onda?', 'Perché a Mach 1 si parla di «muro del suono»?'),
          options: [T('si ammucchiano davanti all’aereo', 'si accumulano sul muso dell’aereo', 'i fronti si sommano sul muso in un’onda di pressione fortissima'), T('scappano lontano davanti, come sempre', 'corrono davanti all’aereo, come sempre', 'perché davanti all’aereo c’è un muro d’aria fredda'), T('spariscono nel cielo, senza far rumore', 'spariscono: l’aereo non fa rumore', 'perché il suono, a quella velocità, si ferma contro l’aereo e non va più avanti')],
          answer: 0,
          explain: T('Giusto: non riescono a scappare davanti.', 'Esatto: tutte le creste arrivano insieme: il muro del suono.', 'Esatto: per gli aerei di un tempo era davvero un muro da sfondare.'),
        },
        {
          kind: 'q',
          text: T('Perché una frusta schiocca?', 'Mach 2 vuol dire…', 'Che cosa schiocca in una frusta?'),
          options: [T('la punta va più veloce del suono', 'il doppio della velocità del suono', 'la punta, che supera il suono: un piccolo bang supersonico'), T('la frusta si rompe un pochino, ogni volta', 'due volte più rumoroso', 'il manico che si piega di colpo'), T('la frusta sbatte per terra', 'due volte più in alto', 'l’aria che entra dentro la frusta')],
          answer: 0,
          explain: T('Giusto: un piccolo BANG, come quello degli aerei.', 'Esatto: Mach 2 è 686 m/s.', 'Esatto: forse il primo oggetto costruito dall’uomo a superare la velocità del suono.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il numero di Mach.'),
          vals: { M: [1.5, 2, 2.5] }, calc: '343 * M', unit: 'm/s', tol: 1,
          ask: T(null,
            'Un aereo vola a <b>Mach {M}</b>. A che velocità va, in m/s?',
            'Mach <b>{M}</b>, suono a 343 m/s: velocità dell’aereo? [[vₛ = M · v]]'),
          explain: T(null, 'Esatto: {M} × 343 m/s = {ans:1} m/s.', 'Esatto: {ans:1} m/s.'),
        },
      ],
      hints: [T('Più veloce del suono: prima passa, poi BANG.', 'Mach 1 è la velocità del suono; oltre, il cono e il bang.', 'Sopra Mach 1 la sorgente supera i propri fronti: cono di Mach.')],
      solution: T(
        'Più veloce del suono, l’aereo lascia dietro un cono: il BANG arriva dopo il passaggio.',
        'A Mach 1 i fronti si ammucchiano; oltre, formano un cono: il bang supersonico.',
        'Il cono di Mach si forma quando la sorgente supera la velocità del suono.'),
    },
    {
      id: 'o04-6', kind: 'costruisci', title: 'Il tappeto elastico',
      sim: 'resonance', params: { mode: 'tappeto', Tp: 0.5, m: 36 }, controls: ['Tp'], labels: { Tp: { label: 'Una spinta ogni', labelE: 'Un salto ogni', min: 0.3, max: 1.2, step: 0.01 } },
      intro: T(
        'Nel parco arriva il tappeto elastico! Chi salta con il ritmo giusto va sempre più in alto, con pochissima fatica. Ma il ritmo giusto cambia con chi salta: un bambino più pesante dondola più piano sul telo. Trova il ritmo per ogni bambino.',
        'Costruisci il tappeto elastico del parco. Il telo è come una molla con k = 4000 N/m: un bambino di massa m ci oscilla sopra con periodo naturale T = 2π·√(m/k). Spingendo con quel ritmo, i salti crescono: è la risonanza. Trova il ritmo giusto per ogni bambino.',
        'Il tappeto elastico è un oscillatore massa-molla: il telo fa da molla, con una costante elastica di 4000 N/m, e chi salta da massa. Spinte periodiche al periodo naturale lo mandano in risonanza. [[T = 2π · √(m / k)]]'),
      piece: { id: 'tappeto', name: 'Il tappeto elastico', desc: 'Salti con il suo ritmo, e ogni spinta ti porta più in alto.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli ogni quanto saltare, poi lancia.', 'Regola il ritmo delle spinte, poi lancia: cerca la risonanza.'),
          vals: { e: { m: [[25], [64]] }, s: { m: [[25, 36], [49, 64]] } },
          set: { m: 'm' },
          ask: T(
            'Sul tappeto salta un bambino di <b>{m} kg</b>. Ogni quanto deve darsi la spinta?',
            'Bambino di <b>{m} kg</b> sul telo con k = 4000 N/m: ogni quanti secondi deve spingere?',
            'Massa <b>{m} kg</b>, costante elastica 4000 N/m: periodo naturale? [[T = 2π · √(m / k)]]'),
          measure: 'Tp', goal: '2 * Math.PI * Math.sqrt(m / 4000)', tol: 0.03,
          ok: T('Perfetto: salti sempre più alti!', 'Esatto: risonanza.'),
          high: T('Troppo piano: le spinte arrivano in ritardo. Spingi più spesso.', 'Spinte troppo rade: accorcia l’intervallo.'),
          low: T('Troppo in fretta: le spinte arrivano in anticipo. Aspetta di più.', 'Spinte troppo fitte: allunga l’intervallo.'),
          solve: { Tp: 'Math.round(2 * Math.PI * Math.sqrt(m / 4000) * 100) / 100' },
        },
        {
          kind: 'q',
          text: T('Un bambino più pesante deve saltare…', 'Con una massa quattro volte più grande, il periodo naturale…', 'Perché il periodo naturale dipende dalla massa, e non dalla forza delle spinte?'),
          options: [T('più piano', 'raddoppia', 'lo fissano solo la massa e la rigidità del telo'), T('più in fretta', 'si dimezza', 'perché spinte più forti accelerano il ritmo'), T('uguale', 'resta uguale', 'perché la forza delle spinte si somma al peso')],
          answer: 0,
          explain: T('Giusto: più peso, ritmo più lento.', 'Esatto: il periodo cresce con la radice della massa: quattro volte la massa, il doppio del periodo.', 'Esatto: come per la molla del cavallino, conta solo il rapporto fra massa e rigidità.'),
        },
      ],
      hints: [T('Più il bambino è pesante, più lento è il ritmo.', 'T = 2π·√(m/4000): per 36 kg circa 0,6 s.', 'Il periodo naturale cresce con la radice della massa.')],
      solution: T('Per 25 kg una spinta ogni mezzo secondo; per 64 kg ogni 0,8 secondi.', 'T = 2π·√(m/k): 0,50 s per 25 kg, 0,60 s per 36 kg, 0,70 s per 49 kg, 0,79 s per 64 kg.', 'Il periodo naturale va da 0,5 s a 0,8 s, come la radice della massa.'),
    },
    {
      id: 'o04-7', kind: 'ripasso', title: 'Ripasso: risonanza e Doppler',
      intro: T('Ripassiamo: altalene, bicchieri e sirene!', 'Ripasso: risonanza, curva di risonanza, effetto Doppler e bang supersonico.', 'Ripasso: quando le spinte vanno a tempo, e quando la sorgente si muove.'),
      steps: [
        {
          kind: 'q',
          text: T('Per far salire tanto un’altalena, spingi…', 'Che cos’è la risonanza?', 'Perché una cantante può rompere un bicchiere, ma solo con una certa nota?'),
          options: [T('con il suo ritmo', 'una forza periodica alla frequenza naturale', 'solo alla frequenza naturale le spinte arrivano in fase'), T('più forte che puoi, quando capita', 'una forza molto grande, data di colpo', 'perché le note acute sono sempre più forti'), T('sempre più spesso', 'un suono che rimbalza', 'perché il cristallo assorbe solo quella nota')],
          answer: 0,
          explain: T('Giusto: spinte a tempo.', 'Esatto: e l’ampiezza cresce a ogni spinta.', 'Esatto: è la risonanza del bicchiere.'),
        },
        {
          kind: 'q',
          text: T('Il bicchiere vibra di più…', 'Con più smorzamento, il picco di risonanza…', 'Che cosa fecero gli ingegneri al Millennium Bridge?'),
          options: [T('con la sua nota', 'si abbassa e si allarga', 'aggiunsero smorzatori'), T('con la nota più acuta che c’è', 'si alza e si stringe', 'lo resero molto più leggero'), T('con il volume più alto, qualunque nota', 'resta uguale', 'chiesero ai pedoni di attraversarlo correndo')],
          answer: 0,
          explain: T('Giusto: la sua nota naturale.', 'Esatto: lo smorzamento toglie energia.', 'Esatto: gli smorzatori tolgono energia alle oscillazioni.'),
        },
        {
          kind: 'q',
          text: T('Un’ambulanza se ne va: la sirena sembra…', 'Una sorgente si avvicina: la frequenza sentita…', 'L’effetto Doppler cambia…'),
          options: [T('più grave', 'è più alta di quella emessa', 'la frequenza sentita, non quella emessa'), T('più acuta', 'è più bassa di quella emessa', 'la frequenza emessa dalla sorgente'), T('uguale', 'è uguale', 'la velocità del suono')],
          answer: 0,
          explain: T('Giusto: se ne va, più grave.', 'Esatto: davanti le onde si stringono.', 'Esatto: la sirena suona sempre uguale.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La sirena che se ne va.'),
          vals: { u: [10, 20, 30] }, calc: '700 * 343 / (343 + u)', unit: 'Hz', tol: 1.5,
          ask: T(null,
            'Un’ambulanza con la sirena a 700 Hz si allontana a <b>{u} m/s</b>. Che frequenza senti?',
            'Sirena 700 Hz, sorgente che si allontana a <b>{u} m/s</b>: frequenza sentita? [[f′ = f · v / (v + vₛ)]]'),
          explain: T(null, 'Esatto: f′ = 700 × 343 / (343 + {u}) = {ans:0} Hz.', 'Esatto: {ans:0} Hz.'),
        },
        {
          kind: 'q',
          text: T('Un aereo più veloce del suono: il BANG arriva…', 'Un aereo vola a Mach 1,5: quanto va veloce?', 'Perché il cono di Mach è più stretto a velocità più alte?'),
          options: [T('dopo che è passato', 'circa 515 m/s', 'la sorgente lascia indietro i fronti più in fretta'), T('prima che arrivi sopra di te', 'circa 343 m/s', 'perché il suono va più veloce'), T('mai', 'circa 1,5 m/s', 'perché l’aria si raffredda')],
          answer: 0,
          explain: T('Giusto: prima lo vedi, poi lo senti.', 'Esatto: 1,5 × 343 ≈ 515 m/s.', 'Esatto: il seno dell’angolo del cono è 1 diviso il numero di Mach.'),
        },
      ],
    },
    {
      id: 'o04-8', kind: 'boss', who: 'bilancia', title: 'L’ambulanza nella nebbia', win: T('Esperimento riuscito!'),
      sim: 'doppler', params: { mode: 'nebbia', amb: 'a' }, controls: ['amb'],
      intro: T(
        'Sono Bilancia. Nella nebbia passano due ambulanze, A e B. Non le vedi: le senti soltanto. Sai già che la sirena cambia nota quando l’ambulanza passa. Ascoltale tutte e due: quale va più veloce? Esperimento al buio!',
        'Sono Bilancia. Esperimento al buio: due ambulanze passano nella nebbia, con sirene diverse che non conosci. Hai solo un microfono che misura la frequenza: f₁ mentre arriva, f₂ mentre se ne va. Dalle due si ricava la velocità: vₛ = v·(f₁ − f₂)/(f₁ + f₂).',
        'Sono Bilancia. È il principio dei radar della polizia e dei radar meteo: dal cambio di frequenza si misura la velocità di qualcosa che non si vede. Qui due ambulanze passano nella nebbia; la frequenza della sirena non serve. [[vₛ = v · (f₁ − f₂) / (f₁ + f₂)]]'),
      steps: [
        {
          kind: 'free',
          text: T('Ascolta tutte e due le ambulanze.', 'Ascolta tutte e due le ambulanze, e leggi f₁ e f₂.'),
          need: [
            { when: "amb == 'a'", try: { amb: 'a' }, msg: T('Ascolta l’ambulanza A.', 'Manca l’ambulanza A.') },
            { when: "amb == 'b'", try: { amb: 'b' }, msg: T('Ora l’ambulanza B.', 'Manca l’ambulanza B.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quale ambulanza va più veloce?', 'Quale ambulanza va più veloce?', 'Quale ambulanza va più veloce, e da che cosa lo capisci?'),
          options: [T('la B: la sua nota fa il salto più grande', 'la B: il salto fra prima e dopo è più grande', 'la B: f₁ e f₂ sono più distanti, in proporzione'), T('la A: la sua nota è più grave', 'la A: ha la sirena più grave', 'la A: la sua sirena è più grave'), T('vanno uguali', 'vanno uguali: le sirene si assomigliano', 'vanno uguali: conta solo la sirena')],
          answer: 0,
          explain: T('Giusto: più veloce, salto più grande.', 'Esatto: più velocità, più differenza fra prima e dopo.', 'Esatto: conta il salto relativo, non la nota della sirena.'),
        },
        {
          kind: 'q',
          text: T('Per saperlo, serve conoscere la nota vera della sirena?', 'Perché non serve conoscere la frequenza della sirena?', 'Perché il metodo funziona anche senza conoscere la frequenza emessa?'),
          options: [T('no: basta il salto fra prima e dopo', 'perché conta quanto cambia, in proporzione', 'nel rapporto fra f₁ e f₂ la frequenza emessa si semplifica'), T('sì, sempre: senza la nota vera non si può', 'perché le sirene sono tutte uguali', 'perché il microfono la conosce già'), T('sì, se no non si sente proprio niente', 'perché si legge sull’ambulanza', 'perché la nebbia cambia la frequenza emessa')],
          answer: 0,
          explain: T('Giusto: conta quanto cambia la nota.', 'Esatto: conta solo il rapporto fra le due frequenze.', 'Esatto: il rapporto dipende solo da v e dalla velocità dell’ambulanza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La velocità nella nebbia.'),
          vals: { k: [1, 2] }, derive: { f1: 'k == 1 ? 840 : 1100', f2: 'k == 1 ? 760 : 900' }, calc: '343 * (f1 - f2) / (f1 + f2)', unit: 'm/s', tol: 0.3,
          ask: T(null,
            'Mentre arriva senti <b>{f1} Hz</b>, mentre se ne va <b>{f2} Hz</b>. A che velocità va l’ambulanza?',
            'Mentre arriva <b>{f1} Hz</b>, mentre se ne va <b>{f2} Hz</b>; suono a 343 m/s: velocità? [[vₛ = v · (f₁ − f₂) / (f₁ + f₂)]]'),
          explain: T(null, 'Esatto: vₛ = 343 × ({f1} − {f2}) / ({f1} + {f2}) = {ans:2} m/s.', 'Esatto: {ans:2} m/s.'),
        },
        {
          kind: 'q',
          text: T('Allora, la B rispetto alla A va…', 'Il verdetto: a che velocità vanno?', 'Il verdetto?'),
          options: [T('circa al doppio della velocità', 'A a 17 m/s, B a 34 m/s, circa 123 km/h', 'A a 17,15 m/s e B a 34,3 m/s, misurate con l’orecchio'), T('più piano', 'A a 34 m/s, B a 17 m/s', 'A e B a 343 m/s, come il suono'), T('alla stessa velocità', 'tutte e due a 343 m/s', 'impossibile dirlo senza vederle')],
          answer: 0,
          explain: T('Esperimento riuscito! La B va al doppio della A: la sua nota fa un salto doppio.', 'Esperimento riuscito: A a 17,15 m/s, B a 34,3 m/s.', 'Esperimento riuscito: come un radar, ma con le orecchie.'),
        },
      ],
      hints: [T('Ascolta quanto cambia la nota: più cambia, più va veloce.', 'vₛ = v·(f₁ − f₂)/(f₁ + f₂).', 'Il rapporto fra f₁ e f₂ dipende solo dalla velocità.')],
      solution: T(
        'La B va al doppio della A: la sua nota cambia il doppio.',
        'A: 343 × 80 / 1600 = 17,15 m/s; B: 343 × 200 / 2000 = 34,3 m/s.',
        'Dal salto di frequenza: A 17,15 m/s, B 34,3 m/s, circa 62 e 123 km/h.'),
    },
  ],
};
