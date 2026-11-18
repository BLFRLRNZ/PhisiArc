// FL02 · Galleggiare: Archimede. Simulazione: il galleggiamento (float.js), in tre modi: la chiatta del porto da
// caricare, il dinamometro con il vaso di Archimede (e la corona del re), la vasca dove gli oggetti galleggiano o
// affondano (con il sottomarino e i suoi serbatoi).
// La zona parte da un esperimento (costruire la chiatta, prima di sapere perché galleggia), passa per il principio di
// Archimede e le densità, e finisce con l'esperimento al buio di Bilancia: la corona del re Gerone.
import { T } from '../util.js';

export default {
  id: 'FL02',
  title: 'Galleggiare: Archimede',
  levels: [
    {
      id: 'fl02-1', kind: 'costruisci', title: 'La chiatta del porto',
      sim: 'float', params: { mode: 'barca', L: 1, cargo: 2000 }, controls: ['L'],
      intro: T(
        'Ciao, sono Goccia! Al porto serve una chiatta, una barca piatta per portare le casse. Ogni cassa pesa 500 kg. Più la carichi, più affonda: la linea bianca, la linea di carico, non deve andare sott’acqua. Prova!',
        'Sono Goccia. Al porto serve una chiatta, larga 2 m e alta 1 m, con la linea di carico a metà. Scegli quanto farla lunga perché porti il suo carico senza che la linea vada sott’acqua. Prima prova, poi capirai il perché.',
        'Sono Goccia. Una chiatta d’acciaio galleggia con tonnellate di casse sopra. Prima di capire perché, costruiamone una: larga 2 m, alta 1 m, con la linea di carico a metà dello scafo. Quanto deve essere lunga?'),
      piece: { id: 'chiatta', name: 'La chiatta del porto', desc: 'Una chiatta carica di casse: galleggia perché sposta tanta acqua quanto pesa.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto è lunga la chiatta, poi carica le casse.', 'Regola la lunghezza della chiatta, poi carica: la linea di carico resta fuori dall’acqua?'),
          vals: { e: { c: [[2000], [3500]] }, s: { c: [[1500, 2500, 3000], [4000, 5500, 6000]] } },
          set: { cargo: 'c' },
          ask: T(
            'Il carico è di <b>{c} kg</b>. Quanto deve essere lunga la chiatta, come minimo, perché la linea di carico resti fuori?',
            'Carico: <b>{c} kg</b>. Qual è la chiatta più corta che lo porta con la linea di carico fuori dall’acqua?',
            'Con <b>{c} kg</b> di casse, quanto deve essere lunga, come minimo, la chiatta?'),
          measure: 'L', goal: 'c / 1000', tol: 0.2,
          ok: T('La chiatta galleggia, e la linea di carico è fuori!'),
          high: T('Funziona, ma la chiatta è più lunga del necessario: accorciala.', 'Galleggia, ma è più lunga del minimo: accorciala.'),
          low: T('Troppo corta: affonda troppo. Allungala!', 'Troppo corta: la linea di carico va sott’acqua. Allungala.'),
          solve: { L: 'c / 1000' },
        },
        {
          kind: 'q',
          text: T('Ogni metro di chiatta, fino alla linea di carico, quanti kg porta?', 'Quanta acqua sposta ogni metro di chiatta, fino alla linea di carico?', 'Perché ogni metro di chiatta porta proprio una tonnellata?'),
          options: [T('1000 kg', '1 m³, cioè 1000 kg', 'sposta 1 m³ d’acqua: una tonnellata'), T('100 kg', '2 m³, cioè 2000 kg', 'l’acciaio regge una tonnellata per metro'), T('500 kg', '0,5 m³, cioè 500 kg', 'è una regola dei porti, decisa per legge')],
          answer: 0,
          explain: T('Giusto: ogni metro porta 1000 kg. La chiatta affonda finché l’acqua che sposta pesa quanto il carico!', 'Esatto: 1 m × 2 m × 0,5 m = 1 m³ d’acqua, che pesa 1000 kg: la chiatta galleggia quando sposta tanta acqua quanto pesa.', 'Esatto: fino alla linea, ogni metro di scafo occupa un metro cubo d’acqua, che pesa una tonnellata. Una barca affonda finché l’acqua spostata pesa quanto lei.'),
        },
      ],
      hints: [T('Ogni metro di chiatta porta 1000 kg, se la linea di carico resta fuori.', 'Lunghezza = carico diviso 1000 kg al metro.', 'Ogni metro di scafo, fino alla linea, sposta una tonnellata d’acqua.')],
      solution: T('2000 kg: 2 metri. 3500 kg: 3 metri e mezzo.', 'L = carico / (1000 kg/m): per 2500 kg, 2,5 m.', 'Un metro per ogni tonnellata di carico.'),
    },
    {
      id: 'fl02-2', kind: 'lezione', title: 'La spinta dell’acqua',
      sim: 'float', params: { mode: 'dinamometro', obj: 'sasso', liq: 'acqua' }, controls: ['obj'],
      intro: T(
        'Pesiamo un sasso appeso a una molla, il dinamometro. Poi lo caliamo in un vaso pieno fino all’orlo: l’acqua che esce finisce nel bicchiere. Guarda quanto pesa il sasso sott’acqua!',
        'Un corpo immerso in un liquido riceve una spinta verso l’alto pari al peso del liquido che sposta: è il <b>principio di Archimede</b>. Si vede con il dinamometro: sott’acqua il sasso “pesa” meno, e la differenza è il peso dell’acqua uscita dal vaso. F = ρ·V·g.',
        'Archimede di Siracusa, nel III secolo a.C., capì che chi entra in un liquido riceve una spinta verso l’alto pari al peso del liquido che deve spostare. Il vaso pieno fino al beccuccio lo fa vedere: l’acqua che trabocca pesa proprio quanto il sasso perde. [[F = ρ · V · g]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Pesa due oggetti diversi, in aria e nell’acqua.', 'Prova almeno due oggetti: confronta il peso perso con l’acqua uscita.'),
        },
        {
          kind: 'q',
          text: T('Sott’acqua il sasso sembra…', 'Sott’acqua il dinamometro segna di meno. Perché?', 'Di quanto si alleggerisce un sasso sott’acqua?'),
          options: [T('più leggero di prima', 'l’acqua lo spinge verso l’alto, sempre', 'proprio del peso dell’acqua che sposta'), T('più pesante', 'il sasso perde un po’ di massa', 'della metà del suo peso, sempre'), T('uguale a prima', 'l’acqua fredda contrae la molla', 'di niente: pesa uguale')],
          answer: 0,
          explain: T('Giusto: l’acqua lo spinge su, e la molla tira di meno.', 'Esatto: l’acqua spinge verso l’alto con una forza pari al peso dell’acqua spostata.', 'Esatto: perde proprio il peso dell’acqua che trabocca, come vedi nel bicchiere.'),
        },
        {
          kind: 'q',
          text: T('Il mattone sposta 2 litri d’acqua. Quanto perde, sott’acqua?', 'Un oggetto sposta 2 L d’acqua. Che spinta riceve?', 'Un oggetto di 2 litri: quanta spinta riceve nell’acqua, e quanta nell’olio?'),
          options: [T('2 kg', 'circa 19,6 N', '19,6 N nell’acqua, meno nell’olio'), T('4 kg', 'circa 9,8 N', 'la stessa: il volume è uguale'), T('niente', 'dipende dal materiale', 'di più nell’olio, che è più viscoso')],
          answer: 0,
          explain: T('Giusto: 2 litri d’acqua pesano 2 kg, e il mattone perde proprio 2 kg.', 'Esatto: F = ρ·V·g = 1000 × 0,002 × 9,81 ≈ 19,6 N, qualunque sia il materiale.', 'Esatto: la spinta è il peso del liquido spostato, e l’olio, meno denso dell’acqua, spinge meno.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La spinta di Archimede.'),
          vals: { V: [[0.5, 1.5, 2], [3, 4.5, 6]] }, calc: 'V * 9.81', unit: 'N', tol: 0.2,
          ask: T(null,
            'Un oggetto di <b>{V} litri</b> è tutto sott’acqua. Quanto vale la spinta di Archimede, in newton? (1 L = 0,001 m³, ρ = 1000 kg/m³)',
            'Che spinta riceve, in newton, un oggetto di <b>{V} litri</b> tutto sott’acqua? [[F = ρ · V · g, con 1 L = 10⁻³ m³]]'),
          explain: T(null, 'Esatto: F = ρ·V·g = 1000 × {V}·10⁻³ × 9,81 ≈ {ans:1} N.', 'Esatto: circa {ans:1} N, il peso di {V} litri d’acqua.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché in piscina riesci a sollevare un amico facilmente?'),
          options: [T('l’acqua lo spinge verso l’alto'), T('in acqua diventa più piccolo'), T('l’acqua scalda i muscoli')],
          answer: 0,
          explain: T('Giusto: l’acqua spinge su il tuo amico e ti aiuta.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Un blocco di ferro da 8 kg e 1 L, sott’acqua: quanto segna il dinamometro?', 'Il vaso di Archimede è pieno fino al beccuccio. Perché è importante?'),
          options: [T(null, 'circa 68,7 N', 'così trabocca proprio l’acqua spostata'), T(null, 'circa 78,5 N', 'così il sasso non si bagna troppo in fretta'), T(null, 'zero: galleggia', 'così l’acqua diventa più densa')],
          answer: 0,
          explain: T(null, 'Esatto: 78,5 N di peso meno 9,8 N di spinta, circa 68,7 N.', 'Esatto: ogni goccia spostata trabocca nel bicchiere, e lì la puoi pesare.'),
        },
      ],
      hints: [T('Confronta il peso perso con l’acqua uscita.', 'F = ρ·V·g: conta il volume, non il materiale.', 'La spinta è il peso del liquido spostato.')],
      solution: T(
        'Sott’acqua il sasso perde 1 kg, il peso del litro d’acqua che sposta.',
        'Spinta = peso del liquido spostato: per 1 L d’acqua, 9,81 N.',
        'Ogni oggetto immerso perde il peso del liquido che sposta.'),
    },
    {
      id: 'fl02-3', kind: 'prevedi', title: 'La nave d’acciaio',
      sim: 'float', params: { mode: 'vasca', a: 'ferro', b: 'barchetta', liq: 'acqua', hide: true }, controls: [],
      intro: T(
        'Mistero al porto! Una nave di ferro galleggia, ma un chiodo di ferro va a fondo. Come mai? Prima indovina, poi guarda.',
        'Ora sai che l’acqua spinge su chi ci entra. Ma chi galleggia, e chi va a fondo? Prevedi, poi guarda.',
        'Le navi sono d’acciaio, e l’acciaio è quasi otto volte più denso dell’acqua. Eppure galleggiano. Prevedi come vanno questi esperimenti.'),
      steps: [
        {
          kind: 'q', predict: [{ a: 'ferro', b: 'barchetta', liq: 'acqua' }],
          text: T('Una palla di ferro e una barchetta di ferro pesano uguale. Chi galleggia?', 'Una palla e una barchetta, tutte e due di ferro e da 1 kg. Che cosa fanno nell’acqua?', 'Un chilo di ferro a forma di palla e un chilo di ferro a forma di barchetta: chi galleggia?'),
          options: [T('la barchetta', 'solo la barchetta', 'solo la barchetta'), T('nessuna: il ferro affonda', 'affondano tutte e due: sono di ferro', 'nessuna delle due'), T('tutte e due', 'galleggiano tutte e due', 'tutte e due quante')],
          answer: 0,
          explain: T('La barchetta! È larga e vuota dentro: sposta tanta acqua, e l’acqua la spinge su.', 'Esatto: la barchetta, con la sua forma, sposta acqua che pesa più di 1 kg prima di finire sotto.', 'Esatto: conta l’acqua spostata. Il ferro a forma di scafo occupa un volume molto più grande della palla, e la spinta basta prima che l’acqua entri.'),
          solution: T('Galleggia la barchetta.'),
        },
        {
          kind: 'q', predict: [{ a: 'uovo', b: 'nessuno', liq: 'acqua' }],
          text: T('Un uovo nell’acqua del rubinetto: galleggia o va a fondo?', 'Un uovo fresco nell’acqua del rubinetto: che cosa fa?', 'Che cosa fa un uovo fresco in un bicchiere d’acqua del rubinetto?'),
          options: [T('va giù, a fondo', 'affonda', 'affonda, piano piano'), T('galleggia', 'galleggia', 'galleggia tutto fuori'), T('resta a metà', 'resta a mezz’acqua', 'resta a mezz’acqua')],
          answer: 0,
          explain: T('Va a fondo, ma piano: pesa solo un pochino più dell’acqua grande come lui.', 'Affonda: la sua densità, circa 1030 kg/m³, è appena più grande di quella dell’acqua.', 'Affonda, lentamente: è solo un po’ più denso dell’acqua, e la spinta quasi lo regge.'),
          solution: T('L’uovo affonda.'),
        },
        {
          kind: 'q', predict: [{ a: 'uovo', b: 'nessuno', liq: 'morto' }],
          text: T('E nell’acqua salatissima del Mar Morto?', 'E nell’acqua del Mar Morto, salatissima (1240 kg/m³)?', 'E nell’acqua del Mar Morto, così salata che ci si legge il giornale sdraiati?'),
          options: [T('galleggia'), T('va a fondo', 'affonda', 'affonda più in fretta'), T('si rompe', 'resta a mezz’acqua', 'resta a mezz’acqua')],
          answer: 0,
          explain: T('Galleggia! L’acqua salata è più pesante, e spinge di più.', 'Esatto: ora il liquido è più denso dell’uovo, e la spinta vince.', 'Esatto: il sale rende l’acqua più densa, la spinta cresce e l’uovo sale.'),
          solution: T('Nel Mar Morto l’uovo galleggia.'),
        },
        {
          kind: 'q', predict: [{ a: 'ghiaccio', b: 'legno', liq: 'olio' }],
          text: T('Ghiaccio e legno, nell’olio. Chi galleggia?', 'Un cubetto di ghiaccio e uno di legno nell’olio (900 kg/m³): chi galleggia?', 'Ghiaccio e legno galleggiano tutti e due nell’acqua. E nell’olio?'),
          options: [T('il legno', 'solo il legno', 'il legno sì, il ghiaccio no'), T('tutti e due', 'tutti e due', 'tutti e due, come nell’acqua'), T('solo il ghiaccio', 'solo il ghiaccio', 'il ghiaccio sì, il legno no')],
          answer: 0,
          explain: T('Solo il legno! Il ghiaccio è più pesante dell’olio grande come lui, e va giù.', 'Esatto: il ghiaccio (920 kg/m³) è più denso dell’olio (900), il legno (600) no.', 'Esatto: il ghiaccio, appena meno denso dell’acqua, è appena più denso dell’olio, e affonda.'),
          solution: T('Nell’olio galleggia solo il legno.'),
        },
        {
          kind: 'q',
          text: T('Allora, chi galleggia?', 'Che cosa decide se un oggetto galleggia?', 'Che cosa decide, alla fine, chi galleggia?'),
          options: [T('chi pesa meno dell’acqua che sposta', 'la densità', 'le densità'), T('chi è leggero', 'essere leggero, qualunque forma abbia', 'il peso dell’oggetto'), T('chi è grande e largo come una nave vera', 'essere grande', 'il materiale di cui è fatto l’oggetto')],
          answer: 0,
          explain: T('Giusto: se pesi meno dell’acqua che sposteresti tutto intero, galleggi!', 'Esatto: galleggia chi ha densità più piccola del liquido.', 'Esatto: conta il confronto fra le densità, quella media dell’oggetto (vuoti compresi) e quella del liquido.'),
        },
      ],
      hints: [T('Pensa a quanto pesa l’acqua grande come l’oggetto.', 'Confronta la densità dell’oggetto con quella del liquido.', 'Confronta le densità: oggetto, vuoti compresi, contro liquido.')],
    },
    {
      id: 'fl02-4', kind: 'lezione', title: 'Galleggia o affonda?',
      sim: 'float', params: { mode: 'vasca', a: 'legno', b: 'ghiaccio', liq: 'acqua' }, controls: ['a', 'b', 'liq'],
      intro: T(
        'Un cubetto grande come un litro: se pesa meno di 1000 g, cioè meno di un litro d’acqua, galleggia. Il legno pesa 600 g: galleggia, con 6 parti su 10 sott’acqua. Quanto pesa un pezzo grande uguale si chiama <b>densità</b>.',
        'Galleggia chi è meno denso del liquido. E quanto affonda? Fino a spostare liquido pari al suo peso: la parte immersa è ρ dell’oggetto diviso ρ del liquido. Un legno da 600 kg/m³ nell’acqua sta per il 60% sotto.',
        'Un iceberg mostra solo la punta: il ghiaccio è appena meno denso dell’acqua di mare, e galleggia con quasi nove decimi sotto. La regola è semplice: la parte immersa sta all’intero come la densità dell’oggetto sta a quella del liquido. [[frazione immersa = ρ oggetto / ρ liquido]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Prova oggetti e liquidi diversi.', 'Prova almeno due combinazioni di oggetti e liquidi.'),
        },
        {
          kind: 'q',
          text: T('Il ghiaccio pesa 920 g al litro. Quanto sta sott’acqua?', 'Un cubetto di ghiaccio (920 kg/m³) nell’acqua: quanta parte resta sotto?', 'Che frazione di un iceberg (920 kg/m³) sta sotto l’acqua di mare (1030 kg/m³)?'),
          options: [T('quasi tutto: 9 su 10', 'il 92%', 'circa l’89%'), T('metà: 5 parti su 10', 'il 50%', 'circa il 50%'), T('poco: solo 1 parte su 10', 'l’8%', 'circa l’11%')],
          answer: 0,
          explain: T('Giusto: 920 su 1000, più di 9 parti su 10. Si vede solo la punta!', 'Esatto: 920/1000 = 0,92.', 'Esatto: 920/1030 ≈ 0,89. Fuori resta solo un decimo.'),
        },
        {
          kind: 'q',
          text: T('Il sughero pesa 240 g al litro. Nell’acqua…', 'Un tappo di sughero (240 kg/m³) nell’acqua sta…', 'Perché un salvagente di sughero ti tiene a galla, anche se tu sei appena meno denso dell’acqua?'),
          options: [T('sta quasi tutto fuori', 'quasi tutto fuori: 24% sotto', 'aggiunge tanto volume e poca massa'), T('va a fondo come un sasso', 'tutto sotto, come un sasso', 'il sughero non si bagna'), T('sta a metà, come il legno', 'metà sotto: 50% immerso', 'scalda l’acqua intorno a te')],
          answer: 0,
          explain: T('Giusto: è leggerissimo per la sua grandezza, e sta quasi tutto fuori.', 'Esatto: 240/1000, il 24% sotto.', 'Esatto: con il salvagente la tua densità media scende ancora, e resti più fuori.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Quanto affonda.'),
          vals: { rho: [[300, 450, 700], [800, 850]] }, calc: 'rho / 1000 * 100', unit: '%', tol: 1,
          ask: T(null,
            'Un blocco di densità <b>{rho} kg/m³</b> galleggia nell’acqua. Che percentuale del suo volume sta sotto?',
            'Che percentuale di un blocco da <b>{rho} kg/m³</b> sta sott’acqua? [[frazione = ρ / ρ acqua]]'),
          explain: T(null, 'Esatto: {rho}/1000 = {ans:0}%.', 'Esatto: il {ans:0}%.'),
        },
        {
          kind: 'q',
          text: T('Nell’olio, che pesa 900 g al litro, il legno sta…', 'Lo stesso legno passa dall’acqua all’olio (900 kg/m³). Come galleggia?', 'Una nave passa dal mare a un fiume: sale o scende?'),
          options: [T('più giù di prima', 'più immerso: 67% sotto', 'scende: l’acqua dolce è meno densa'), T('più su che nell’acqua', 'meno immerso: 50% sotto', 'sale: l’acqua dolce è più leggera'), T('uguale, come nell’acqua', 'uguale: 60% sotto', 'resta uguale: è la stessa nave')],
          answer: 0,
          explain: T('Giusto: l’olio è più leggero dell’acqua e spinge meno, così il legno scende un po’.', 'Esatto: 600/900 ≈ 0,67.', 'Esatto: nell’acqua dolce, meno densa, la nave deve spostarne di più. Per questo sugli scafi ci sono linee di carico diverse per il mare e per il fiume.'),
        },
      ],
      hints: [T('Confronta il peso di un litro dell’oggetto con 1000 g.', 'Parte immersa = ρ oggetto / ρ liquido.', 'La parte sotto sta all’intero come le densità.')],
      solution: T(
        'Galleggia chi pesa meno di 1000 g al litro; il legno sta per 6 parti su 10 sotto.',
        'Galleggia se ρ < ρ del liquido; parte immersa = ρ/ρ liquido: il legno nell’acqua, 60%.',
        'Con densità più piccola del liquido si galleggia, e la parte immersa è il rapporto delle densità.'),
    },
    {
      id: 'fl02-5', kind: 'lezione', title: 'Il sottomarino',
      sim: 'float', params: { mode: 'vasca', a: 'sottomarino', b: 'nessuno', liq: 'acqua', zav: 0 }, controls: ['zav'],
      intro: T(
        'Il sottomarino ha dei serbatoi: se li riempie d’acqua diventa più pesante e scende; se li svuota, risale. Prova a farlo restare a metà!',
        'Un sottomarino cambia la sua densità media riempiendo o svuotando i serbatoi di zavorra: vuoti è meno denso dell’acqua e galleggia, pieni è più denso e affonda. A metà strada, se la densità è proprio quella dell’acqua, resta sospeso.',
        'Un sottomarino non ha motori per scendere: gioca con la densità. Imbarca acqua nei serbatoi di zavorra per affondare, la caccia via con l’aria compressa per risalire. I pesci fanno lo stesso con la vescica natatoria.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova con i serbatoi pieni e a metà.', 'Fai affondare il sottomarino, poi trova la zavorra che lo tiene sospeso.'),
          need: [
            { when: 'zav >= 80', try: { zav: 100 }, msg: T('Ora riempi i serbatoi.') },
            { when: 'zav == 50', try: { zav: 50 }, msg: T('Ora prova a metà: serbatoi pieni al 50%.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con i serbatoi pieni d’acqua, il sottomarino…', 'Che cosa fa il sottomarino quando riempie i serbatoi?', 'Che cosa cambia quando il sottomarino riempie i serbatoi?'),
          options: [T('va giù, verso il fondo', 'diventa più denso e va giù a fondo', 'la massa cresce, il volume no'), T('va su', 'diventa meno denso e sale', 'il volume cresce, la massa no'), T('resta uguale', 'non cambia niente: pesa uguale', 'cambia la forma dello scafo, che si stringe')],
          answer: 0,
          explain: T('Giusto: più acqua dentro, più pesante, e va giù.', 'Esatto: stessa grandezza e più massa: la densità media cresce.', 'Esatto: lo scafo è lo stesso, ma dentro c’è più massa: la densità media supera quella dell’acqua.'),
        },
        {
          kind: 'q',
          text: T('Per restare sospeso a metà, il sottomarino deve…', 'Quando il sottomarino resta sospeso a mezz’acqua?', 'Che cosa ha di speciale la zavorra che tiene il sottomarino sospeso?'),
          options: [T('pesare come l’acqua che sposta', 'quando ha la densità dell’acqua', 'peso e spinta si pareggiano'), T('spegnere i motori e stare fermo', 'quando i motori sono spenti', 'il sottomarino diventa vuoto'), T('svuotare tutti i serbatoi d’acqua', 'quando i serbatoi sono vuoti del tutto', 'l’acqua intorno è più calda')],
          answer: 0,
          explain: T('Giusto: allora l’acqua lo spinge su quanto lui pesa, e resta lì.', 'Esatto: con densità uguale, spinta e peso si bilanciano.', 'Esatto: con la densità media uguale a quella dell’acqua, spinta e peso si annullano a qualunque profondità.'),
        },
        {
          kind: 'q',
          text: T('Anche l’aria spinge su le cose! Perché sale un palloncino d’elio?', 'Il principio di Archimede vale anche nell’aria. Perché sale una mongolfiera?', 'Perché sale una mongolfiera, con il suo tessuto, il cesto e le persone?'),
          options: [T('l’elio è più leggero dell’aria', 'l’aria calda dentro è meno densa', 'pesa meno dell’aria fredda che sposta'), T('il filo lo tira su verso il cielo', 'il vento caldo la spinge su dal basso', 'le fiamme la spingono come un razzo'), T('si gonfia sempre di più', 'il fuoco la rende leggera come una piuma', 'il tessuto è più leggero dell’aria')],
          answer: 0,
          explain: T('Giusto: l’aria spinge su il palloncino più di quanto lui pesi.', 'Esatto: l’aria calda dentro pesa meno dell’aria fredda che sposta, e la spinta vince.', 'Esatto: la mongolfiera intera, aria calda compresa, pesa meno dell’aria fredda che sposta.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Un sottomarino passa dal mare (1030 kg/m³) a un fiume (1000 kg/m³), con la stessa zavorra. Che cosa succede?', 'Un pesce sale verso la superficie. Che cosa fa la sua vescica natatoria?'),
          options: [T(null, 'scende: l’acqua dolce spinge meno', 'si gonfia di gas'), T(null, 'sale verso la superficie del fiume', 'si svuota'), T(null, 'niente: la zavorra è la stessa', 'si riempie d’acqua')],
          answer: 0,
          explain: T(null, 'Esatto: la stessa massa in un liquido meno denso riceve meno spinta.', 'Esatto: più gas, più volume con la stessa massa, densità più bassa.'),
        },
      ],
      hints: [T('Più acqua nei serbatoi, più pesante.', 'Densità media = massa totale / volume.', 'La zavorra cambia la massa, non il volume.')],
      solution: T(
        'Serbatoi vuoti: galleggia. Pieni: affonda. A metà resta sospeso.',
        'Con la densità media uguale a 1000 kg/m³ il sottomarino resta sospeso.',
        'Si scende imbarcando acqua, si sale cacciandola via: la densità media decide tutto.'),
    },
    {
      id: 'fl02-6', kind: 'ripasso', title: 'Ripasso del galleggiamento',
      intro: T('Ripassiamo: chi galleggia, chi affonda, e perché!', 'Ripasso: il principio di Archimede, le densità, il galleggiamento.', 'Ripasso: la spinta di Archimede, dalle chiatte ai sottomarini.'),
      steps: [
        {
          kind: 'order',
          text: T('Ordina da chi pesa meno a chi pesa di più, a parità di grandezza.', 'Ordina per densità crescente.', 'Dal meno denso al più denso:'),
          items: [
            { t: T('sughero'), v: 240 }, { t: T('legno'), v: 600 }, { t: T('ghiaccio'), v: 920 },
            { t: T('acqua'), v: 1000 }, { t: T('ferro'), v: 7900 },
          ],
          explain: T('Perfetto: chi viene prima dell’acqua galleggia, chi viene dopo affonda!', 'Perfetto: 240, 600, 920, 1000 e 7900 kg/m³; prima dell’acqua si galleggia.', 'Perfetto: l’acqua divide chi galleggia da chi affonda.'),
        },
        {
          kind: 'q',
          text: T('Sott’acqua un oggetto perde il peso…', 'Il principio di Archimede dice che la spinta è uguale…', 'Da che cosa dipende la spinta su un oggetto tutto immerso?'),
          options: [T('dell’acqua che sposta, tutta', 'al peso del liquido spostato', 'dal volume e dal liquido'), T('della sua metà', 'al peso dell’oggetto, sempre e comunque', 'dal materiale dell’oggetto'), T('di niente: pesa uguale', 'alla massa dell’oggetto', 'dalla profondità')],
          answer: 0,
          explain: T('Giusto: perde il peso dell’acqua che sposta.', 'Esatto: F = ρ del liquido · V · g.', 'Esatto: solo dal volume immerso e dalla densità del liquido, non dalla profondità né dal materiale.'),
        },
        {
          kind: 'q',
          text: T('Perché una nave di ferro galleggia?', 'Perché una nave d’acciaio galleggia?', 'Perché una nave d’acciaio da centomila tonnellate non affonda?'),
          options: [T('è vuota dentro: sposta tanta acqua', 'è meno densa dell’acqua, in media', 'sposta tanta acqua quanto pesa'), T('il ferro delle navi galleggia', 'l’acciaio delle navi è speciale e leggero', 'il mare è profondo e la sostiene'), T('il motore la tiene su', 'i motori la sostengono', 'le onde e le correnti la tengono su')],
          answer: 0,
          explain: T('Giusto: tutta quell’aria dentro la rende leggera per la sua grandezza.', 'Esatto: acciaio più aria dentro fanno una densità media più piccola di quella dell’acqua.', 'Esatto: lo scafo affonda finché il peso dell’acqua spostata eguaglia quello della nave.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La spinta.'),
          vals: { V: [2, 3, 5, 8] }, calc: 'V * 9.81', unit: 'N', tol: 0.2,
          ask: T(null,
            'Che spinta riceve un oggetto di <b>{V} L</b> tutto sott’acqua, in newton?',
            'Spinta, in newton, su <b>{V} litri</b> tutti immersi nell’acqua? [[F = ρ · V · g]]'),
          explain: T(null, 'Esatto: 1000 × {V}·10⁻³ × 9,81 ≈ {ans:1} N.', 'Esatto: circa {ans:1} N.'),
        },
        {
          kind: 'q',
          text: T('Un uovo va a fondo nell’acqua del rubinetto. Come lo fai galleggiare?', 'Come si fa galleggiare un uovo che affonda nell’acqua?', 'Perché nel Mar Morto si galleggia senza sforzo?'),
          options: [T('metti tanto sale nell’acqua', 'tanto sale nell’acqua', 'l’acqua è più densa del corpo'), T('lo fai bollire per tre minuti', 'si scalda l’uovo in acqua bollente', 'l’acqua del Mar Morto è calda'), T('lo dipingi', 'si usa un uovo più grande', 'ci sono onde che tengono a galla')],
          answer: 0,
          explain: T('Giusto: l’acqua salata è più pesante e spinge di più.', 'Esatto: il sale aumenta la densità dell’acqua.', 'Esatto: 1240 kg/m³, molto più del corpo umano: si galleggia con un buon pezzo del corpo fuori.'),
        },
        {
          kind: 'q',
          text: T('Quanto sta sott’acqua un iceberg?', 'Che parte di un cubetto di ghiaccio sta sott’acqua?', 'Che cosa succede al livello dell’acqua in un bicchiere quando il ghiaccio che galleggia si scioglie?'),
          options: [T('quasi tutto, fuori la punta', 'circa il 90%', 'non cambia'), T('circa la metà', 'circa il 50%', 'sale di poco'), T('poco', 'circa il 10%', 'scende')],
          answer: 0,
          explain: T('Giusto: fuori resta solo la punta.', 'Esatto: 920/1000, circa il 92%.', 'Esatto: il ghiaccio sposta già proprio l’acqua in cui si trasformerà. Il mare sale per il ghiaccio che si scioglie sulla terraferma.'),
        },
      ],
    },
    {
      id: 'fl02-7', kind: 'boss', who: 'bilancia', title: 'La corona del re', win: T('Esperimento riuscito!'),
      sim: 'float', params: { mode: 'dinamometro', crown: 'corona', liq: 'acqua' }, controls: ['crown'],
      intro: T(
        'Sono Bilancia. Il re ha una corona d’oro, ma teme che l’orafo l’abbia imbrogliato, mescolando argento che costa meno. La corona pesa 1 kg, come un lingotto d’oro puro. Scopri la verità senza rovinarla!',
        'Sono Bilancia. Esperimento al buio: il re Gerone sospetta che nella sua corona ci sia argento, meno denso dell’oro. Non si può fondere né graffiare. Hai solo il dinamometro e il vaso di Archimede: confronta la corona con un lingotto d’oro puro dello stesso peso.',
        'Sono Bilancia. Siracusa, III secolo a.C.: il re Gerone chiede ad Archimede se la sua corona è d’oro puro, senza rovinarla. La leggenda dice che la soluzione gli venne nella vasca da bagno. Pesa corona e lingotto in aria e in acqua, e giudica tu.'),
      steps: [
        {
          kind: 'free',
          text: T('Pesa la corona e il lingotto, in aria e in acqua.', 'Pesa in aria e in acqua sia la corona sia il lingotto.'),
          need: [
            { when: "crown == 'corona'", try: { crown: 'corona' }, msg: T('Pesa la corona, in aria e in acqua.') },
            { when: "crown == 'lingotto'", try: { crown: 'lingotto' }, msg: T('Ora pesa il lingotto d’oro puro.') },
          ],
        },
        {
          kind: 'q',
          text: T('Chi perde più peso sott’acqua?', 'Sott’acqua, chi “perde” più peso?', 'Chi riceve la spinta più grande, sott’acqua?'),
          options: [T('la corona', 'la corona', 'la corona: 0,64 N contro 0,51 N'), T('il lingotto'), T('perdono uguale', 'uguale', 'uguale: in aria pesano uguale')],
          answer: 0,
          explain: T('Giusto: la corona perde 65 g, il lingotto solo 52 g.', 'Esatto: la corona riceve una spinta più grande.', 'Esatto: spinta più grande, quindi volume più grande.'),
        },
        {
          kind: 'q',
          text: T('Allora chi è più grande dentro, cioè sposta più acqua?', 'Che cosa ti dice la spinta più grande sulla corona?', 'Con la stessa massa e un volume più grande, la corona ha densità…'),
          options: [T('la corona', 'che ha un volume più grande', 'più piccola dell’oro'), T('il lingotto', 'che è più pesante del lingotto', 'più grande dell’oro'), T('sono uguali', 'che è più calda', 'uguale all’oro')],
          answer: 0,
          explain: T('Giusto: a parità di peso, la corona è più grande. Se fosse d’oro puro, sarebbe piccola come il lingotto!', 'Esatto: spinta più grande vuol dire più acqua spostata, cioè più volume.', 'Esatto: stessa massa in più volume, densità più piccola.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La densità della corona.'),
          vals: { Fa: [0.64] }, calc: '9.81 / Fa', unit: 'g/cm³', tol: 0.4,
          ask: T(null,
            'La corona pesa 9,81 N in aria (1 kg) e 9,17 N in acqua: la spinta è <b>{Fa} N</b>. Qual è la sua densità, in g/cm³? (l’acqua ha 1 g/cm³, cioè 1000 kg/m³)',
            'La spinta sulla corona da 1 kg vale <b>{Fa} N</b>. Quanti g/cm³ è la sua densità? [[V = F / (ρ acqua · g), poi ρ = m / V]]'),
          explain: T(null, 'Esatto: V = F/(ρ·g) ≈ 65 cm³, e ρ = m/V ≈ {ans:1} g/cm³; l’oro puro ha 19,3 g/cm³.', 'Esatto: circa {ans:1} g/cm³, contro i 19,3 dell’oro.'),
        },
        {
          kind: 'q',
          text: T('Allora la corona è d’oro puro?', 'Il verdetto: la corona è d’oro puro?', 'Il verdetto di Archimede?'),
          options: [T('no: dentro c’è un metallo più leggero', 'no: è meno densa dell’oro, c’è argento', 'falsa: la densità sta fra argento e oro'), T('sì: pesa 1 kg come il lingotto', 'sì: pesa come il lingotto', 'pura: pesa quanto il lingotto d’oro'), T('non si può sapere senza romperla', 'non si può dire senza fonderla', 'per saperlo bisogna fonderla tutta')],
          answer: 0,
          explain: T('Esperimento riuscito! A parità di peso è più grande del lingotto: l’orafo ci ha messo dell’argento.', 'Esperimento riuscito: circa 15,4 g/cm³, meno dei 19,3 dell’oro: dentro c’è argento (10,5 g/cm³).', 'Esperimento riuscito: la densità sta fra quella dell’argento e quella dell’oro. Circa il 30% d’argento, e un orafo nei guai.'),
        },
      ],
      hints: [T('Guarda chi perde più peso sott’acqua.', 'Spinta più grande vuol dire volume più grande, a parità di massa.', 'Dalla spinta ricavi il volume, e dal volume la densità.')],
      solution: T(
        'La corona perde più peso del lingotto: è più grande, quindi non è d’oro puro.',
        'V = F/(ρ·g) ≈ 65 cm³, ρ ≈ 15,4 g/cm³, meno di 19,3: c’è argento.',
        'Più spinta a parità di massa vuol dire più volume e meno densità: la corona non è d’oro puro.'),
    },
  ],
};
