// FL01 · La pressione. Simulazioni: la pressione (press.js: le impronte nella sabbia e il sollevatore idraulico) e i
// fluidi fermi (hydro.js: il sub nel mare, la bottiglia bucata, il tubo di Torricelli, la diga).
// La zona si apre con un mistero (l'elefante o i tacchi a spillo: chi affonda di più?), passa per la pressione
// dell'acqua e dell'aria, costruisce il sollevatore delle barche e finisce con il mito di Vetrino sulla diga.
// L'Esploratore misura la pressione in «kg su ogni quadretto» (un quadretto di 1 cm per lato), gli altri in pascal.
import { T } from '../util.js';

export default {
  id: 'FL01',
  title: 'La pressione',
  levels: [
    {
      id: 'fl01-1', kind: 'prevedi', title: 'Elefante o tacchi a spillo?',
      sim: 'press', params: { mode: 'impronte', a: 'elefante', b: 'tacchi' }, controls: [],
      intro: T(
        'Ciao, sono Goccia! Sulla sabbia bagnata del porto passeggiano un elefante e una signora con i tacchi a spillo. Chi lascia il buco più profondo? Prima indovina, poi guarda!',
        'Sono Goccia. Sulla sabbia bagnata del porto confrontiamo due impronte alla volta: chi affonda di più? Prima prevedi, poi guarda. Attenzione: non conta solo il peso.',
        'Sono Goccia. Un elefante pesa quanto settanta persone, eppure c’è chi rovina un pavimento di legno più di lui. Prevedi chi lascia le impronte più profonde nella sabbia bagnata.'),
      steps: [
        {
          kind: 'q', predict: [{ a: 'elefante', b: 'tacchi' }],
          text: T('Chi affonda di più nella sabbia: l’elefante o la signora con i tacchi a spillo?', 'Elefante: 4000 kg su quattro piedi. Signora: 60 kg su un tacco a spillo, a ogni passo. Chi affonda di più?', 'Chi scava il buco più profondo: le quattro zampe dell’elefante o il tacco a spillo della signora?'),
          options: [T('la signora con i tacchi', 'la signora sui tacchi', 'il tacco a spillo'), T('l’elefante, che è enorme', 'l’elefante: pesa di più', 'le zampe dell’elefante'), T('affondano uguale', 'affondano uguale', 'tutti e due allo stesso modo')],
          answer: 0,
          explain: T('La signora! Tutto il suo peso sta su un tacco piccolissimo, e il tacco si pianta nella sabbia.', 'La signora: 60 kg su 1 cm² sono 60 kg su ogni cm², mentre l’elefante ne mette 1 su ogni cm² (4000 kg su 4000 cm²).', 'Il tacco: sessanta chili su un centimetro quadrato schiacciano sessanta volte più delle zampe dell’elefante, che spartiscono il peso su una superficie enorme.'),
          solution: T('Affonda di più il tacco a spillo.'),
        },
        {
          kind: 'q', predict: [{ a: 'scarpe', b: 'pinne' }],
          text: T('Ora la stessa persona, prima con le scarpe e poi con le pinne. Quando affonda di più?', 'Stessa persona, 60 kg: con le scarpe (400 cm² in tutto) o con le pinne (2400 cm²). Quando affonda di più?', 'Una persona cammina sulla sabbia bagnata prima con le scarpe, poi con le pinne ai piedi. In quale caso affonda di più?'),
          options: [T('con le scarpe'), T('con le pinne', 'con le pinne: sono più pesanti', 'con le pinne, che pesano di più'), T('uguale: è la stessa persona', 'uguale: pesa sempre 60 kg', 'uguale, perché il peso è lo stesso')],
          answer: 0,
          explain: T('Con le scarpe! Le pinne spargono il peso su un pezzo di sabbia molto più grande.', 'Con le scarpe: lo stesso peso su una superficie 6 volte più piccola schiaccia 6 volte di più.', 'Con le scarpe: le pinne distribuiscono lo stesso peso su una superficie sei volte più grande, e ogni centimetro di sabbia ne regge sei volte meno.'),
          solution: T('Si affonda di più con le scarpe.'),
        },
        {
          kind: 'q', predict: [{ a: 'bimbo', b: 'scarpe' }],
          text: T('Un bimbo di 30 kg e un adulto di 60 kg, con scarpe grandi il doppio. Chi affonda di più?', 'Un bimbo di 30 kg su 200 cm² di scarpe e un adulto di 60 kg su 400 cm². Chi affonda di più?', 'Un bambino pesa metà di suo padre, ma ha anche scarpe grandi la metà. Chi lascia l’impronta più profonda?'),
          options: [T('affondano uguale', 'uguale', 'nessuno: affondano uguale'), T('l’adulto: pesa di più', 'l’adulto', 'il padre, che pesa il doppio'), T('il bimbo: ha i piedi piccoli', 'il bimbo', 'il bambino')],
          answer: 0,
          explain: T('Uguale! Il doppio del peso su scarpe grandi il doppio: ogni pezzetto di sabbia regge lo stesso.', 'Uguale: 30 kg su 200 cm² e 60 kg su 400 cm² fanno tutti e due 0,15 kg su ogni cm².', 'Uguale: metà peso su metà superficie dà la stessa spinta su ogni centimetro quadrato.'),
          solution: T('Affondano uguale.'),
        },
        {
          kind: 'q',
          text: T('Allora, che cosa conta per affondare?', 'Che cosa decide quanto si affonda?', 'Che cosa decide, alla fine, quanto è profondo il buco?'),
          options: [T('il peso e quanto è grande l’appoggio', 'il peso diviso la superficie d’appoggio', 'il peso su ogni centimetro quadrato'), T('solo il peso: chi pesa di più affonda', 'solo il peso', 'solo il peso totale, nient’altro'), T('solo quanto sei alto', 'solo la superficie', 'solo quanto sono grandi i piedi')],
          answer: 0,
          explain: T('Giusto: conta il peso, ma anche su quanta sabbia lo appoggi. La spinta su ogni pezzetto si chiama pressione.', 'Esatto: conta il peso diviso la superficie su cui si appoggia. Si chiama pressione.', 'Esatto: conta la forza per ogni unità di superficie, cioè la pressione. Per la sabbia, l’elefante è leggero e il tacco pesantissimo.'),
        },
      ],
      hints: [T('Guarda su quanta sabbia si appoggia ognuno.', 'Dividi il peso per la superficie d’appoggio.', 'Conta quanti chili finiscono su ogni centimetro quadrato.')],
    },
    {
      id: 'fl01-2', kind: 'lezione', title: 'Forza diviso superficie',
      sim: 'press', params: { mode: 'impronte', a: 'scarpe', b: 'pinne' }, controls: ['a', 'b'],
      intro: T(
        'La spinta su ogni pezzetto si chiama <b>pressione</b>. Immagina un quadretto di 1 cm, come sul quaderno: quanti kg ci spingono sopra? Più è piccolo l’appoggio, più la pressione è grande.',
        'La <b>pressione</b> è la forza diviso la superficie su cui si distribuisce: P = F/A. Si misura in pascal: 1 Pa è 1 N su 1 m², una spinta piccolissima, per questo si usano i kPa (1000 Pa).',
        'Un coltello affilato taglia, uno spuntato schiaccia: la forza è la stessa, cambia la superficie su cui si concentra. La pressione è proprio questo, la forza per unità di superficie, e si misura in pascal. [[P = F / A]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Prova coppie diverse e guarda chi affonda di più.', 'Confronta almeno due coppie diverse: guarda il peso, la superficie e la pressione.'),
        },
        {
          kind: 'q',
          text: T('Perché un coltello affilato taglia meglio?', 'Perché un coltello affilato taglia meglio di uno spuntato, a parità di forza?', 'Perché le racchette da neve ti tengono su sulla neve fresca?'),
          options: [T('la lama è sottilissima', 'la superficie di taglio è piccola', 'spargono il peso su tanta superficie'), T('la lama pesa di più del manico', 'la lama affilata è più pesante', 'pesano meno degli scarponi'), T('la lama è più lunga', 'la lama è più lunga', 'scaldano la neve e la rendono dura')],
          answer: 0,
          explain: T('Giusto: la stessa spinta su una lama sottile fa una pressione enorme.', 'Esatto: P = F/A, e se A è piccolissima, P è grandissima.', 'Esatto: lo stesso peso su una superficie molto più grande fa una pressione molto più piccola, e la neve regge.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Il fachiro si sdraia su un letto di mille chiodi. Perché non si fa male?'),
          options: [T('il peso si divide su tanti chiodi'), T('i chiodi sono finti, di gomma'), T('il fachiro non pesa niente')],
          answer: 0,
          explain: T('Giusto: ogni chiodo regge solo un pezzettino del peso. Su un chiodo solo, invece, ahi!'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La pressione delle scarpe.'),
          vals: { m: [[50, 60, 70], [80, 90]], A: [[200, 250], [300, 400]] }, calc: 'm * 9.81 / (A * 1e-4) / 1000', unit: 'kPa', tol: 0.3,
          ask: T(null,
            'Una persona di <b>{m} kg</b> sta in piedi su due scarpe che toccano terra in tutto per <b>{A} cm²</b>. Che pressione fa sul pavimento, in kPa? (1 cm² = 0,0001 m²)',
            'Una persona di <b>{m} kg</b> si appoggia su <b>{A} centimetri quadrati</b> di suole. Quanti kPa fa sul pavimento? [[P = m · g / A, con 1 cm² = 10⁻⁴ m²]]'),
          explain: T(null, 'Esatto: P = F/A = {m} × 9,81 N / ({A} × 0,0001 m²) ≈ {ans:1} kPa.', 'Esatto: circa {ans:1} kPa. [[P = {m} × 9,81 / ({A} × 10⁻⁴) Pa]]'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Perché in alcuni musei sono vietati i tacchi a spillo?', 'Con lo stesso peso sopra, quante volte più pressione fa un tacco a spillo di un centimetro quadrato, rispetto a una scarpa che tocca terra per duecento?'),
          options: [T(null, 'segnano il pavimento', '200 volte'), T(null, 'fanno troppo rumore', '20 volte'), T(null, 'sono pericolosi per chi li porta', 'la stessa')],
          answer: 0,
          explain: T(null, 'Esatto: tanto peso su un tacco minuscolo fa una pressione che lascia il segno.', 'Esatto: superficie 200 volte più piccola, pressione 200 volte più grande.'),
        },
      ],
      hints: [T('Più l’appoggio è piccolo, più la pressione è grande.', 'P = F/A: F in newton, A in m².', 'Dividi la forza per la superficie, in metri quadrati.')],
      solution: T(
        'Pressione = peso diviso superficie: piccola superficie, grande pressione.',
        'P = F/A; 60 kg su 400 cm²: 589 N / 0,04 m² ≈ 14,7 kPa.',
        'La pressione è la forza divisa per la superficie: con 60 kg su 400 centimetri quadrati viene circa 14,7 kPa.'),
    },
    {
      id: 'fl01-3', kind: 'lezione', title: 'Giù nel mare',
      sim: 'hydro', params: { mode: 'mare', h: 10 }, controls: ['h'],
      intro: T(
        'Andiamo sott’acqua con il sub! L’acqua sopra di lui pesa e lo spinge da tutte le parti. Più scende, più acqua ha sopra la testa.',
        'Sott’acqua la pressione cresce con la profondità, perché si somma il peso di tutta l’acqua sopra: P = ρ·g·h, dove ρ (rho) è la <b>densità</b> del liquido, cioè la massa di 1 m³. Per l’acqua ρ = 1000 kg/m³: ogni 10 m, circa 98 kPa in più.',
        'L’acqua è pesante: un metro cubo pesa una tonnellata. Scendendo porti sulle spalle una colonna d’acqua sempre più alta, e la pressione cresce con la profondità, uguale in tutte le direzioni. Il conto lo fece Simon Stevino nel 1586. [[P = ρ · g · h, dove ρ è la densità]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Fai scendere il sub a due profondità diverse.', 'Fai scendere il sub ad almeno due profondità diverse e confronta la pressione.'),
        },
        {
          kind: 'q',
          text: T('Più il sub va giù, l’acqua lo spinge…', 'Come cambia la pressione dell’acqua se la profondità raddoppia?', 'Da che parte spinge l’acqua sul sub?'),
          options: [T('di più', 'raddoppia', 'da ogni parte, uguale'), T('di meno', 'resta uguale', 'solo dall’alto in basso'), T('uguale', 'diventa quattro volte', 'solo dal basso in alto')],
          answer: 0,
          explain: T('Giusto: più acqua sopra, più spinta.', 'Esatto: P = ρ·g·h è proporzionale a h.', 'Esatto: in un liquido fermo la pressione, a una certa profondità, spinge uguale in ogni direzione.'),
        },
        {
          kind: 'q',
          text: T('A 10 metri sott’acqua, quanti kg spingono su ogni quadretto del sub?', 'Quanto vale la pressione dell’acqua a 10 m di profondità?', 'A che profondità l’acqua spinge su ogni centimetro quadrato quanto l’elefante sulla sabbia, cioè con 1 kg?'),
          options: [T('circa 1 kg', 'circa 98 kPa', 'circa 10 m'), T('circa 10 kg', 'circa 10 kPa', 'circa 1 m'), T('circa 100 kg', 'circa 980 kPa', 'circa 100 m')],
          answer: 0,
          explain: T('Giusto: 1 kg su ogni quadretto, come l’elefante sulla sabbia!', 'Esatto: 1000 × 9,81 × 10 = 98 100 Pa.', 'Esatto: dieci metri d’acqua schiacciano come un elefante sulle sue quattro zampe.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La pressione in fondo.'),
          vals: { h: [[5, 12, 18], [25, 32, 38]] }, calc: '1000 * 9.81 * h / 1000', unit: 'kPa', tol: 1,
          ask: T(null,
            'Il sub scende a <b>{h} m</b>. Quanta pressione fa l’acqua, in kPa? (ρ = 1000 kg/m³)',
            'A <b>{h} m</b> sotto la superficie, quanti kPa di pressione fa l’acqua? [[P = ρ · g · h, con ρ = 1000 kg/m³]]'),
          explain: T(null, 'Esatto: P = ρ·g·h = 1000 × 9,81 × {h} ≈ {ans:1} kPa.', 'Esatto: circa {ans:1} kPa. [[P = 1000 × 9,81 × {h} Pa]]'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché in fondo al mare le orecchie fanno un po’ male?'),
          options: [T('l’acqua spinge forte sulle orecchie'), T('l’acqua fredda fa venire il raffreddore'), T('c’è poca luce')],
          answer: 0,
          explain: T('Giusto: laggiù l’acqua spinge tanto, e le orecchie lo sentono. I sub imparano a compensare.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Un sottomarino è a 300 m di profondità. Quanto vale la pressione dell’acqua?', 'Nella Fossa delle Marianne, a 11 000 m, quanti kg spinge l’acqua su ogni centimetro quadrato?'),
          options: [T(null, 'quasi 3000 kPa', 'circa 1100 kg'), T(null, 'circa 300 kPa', 'circa 110 kg'), T(null, 'circa 30 000 kPa', 'circa 11 kg')],
          answer: 0,
          explain: T(null, 'Esatto: P cresce come h, e 300 m sono 30 volte 10 m: 30 × 98 kPa ≈ 2900 kPa.', 'Esatto: un chilo ogni 10 m, cioè 1100 kg: il peso di un’auto su ogni centimetro quadrato.'),
        },
      ],
      hints: [T('Guarda le frecce: più il sub è giù, più sono lunghe.', 'P = ρ·g·h, con ρ = 1000 kg/m³.', 'Ogni 10 m d’acqua, circa 1 kg su ogni centimetro quadrato.')],
      solution: T(
        'Più giù si va, più l’acqua spinge: a 10 m circa 1 kg su ogni quadretto.',
        'P = ρ·g·h: a 10 m circa 98 kPa, a 30 m circa 294 kPa.',
        'La pressione cresce con la profondità: circa 98 kPa ogni 10 metri.'),
    },
    {
      id: 'fl01-4', kind: 'prevedi', title: 'La bottiglia bucata',
      sim: 'hydro', params: { mode: 'bottiglia', hb: 36 }, controls: [],
      intro: T(
        'Una bottiglia piena d’acqua con tre buchi, uno sopra l’altro. Il rubinetto la tiene sempre piena. Che cosa succede quando togliamo i tappi? Prima indovina!',
        'Una bottiglia con tre fori a altezze diverse, appoggiata su una cassa; un rubinetto tiene costante il livello. Prevedi come escono gli spruzzi, poi guarda.',
        'Tre fori in una bottiglia, a altezze diverse, e un rubinetto che la tiene sempre piena: un esperimento da cucina. Prevedi come escono gli spruzzi.'),
      steps: [
        {
          kind: 'q', predict: [{ hb: 36, wide: false }],
          text: T('Da quale buco l’acqua esce più forte e arriva più lontano?', 'Da quale foro esce lo spruzzo più veloce?', 'Quale spruzzo sarà il più forte?'),
          options: [T('da quello più in basso', 'dal più basso', 'quello del foro più basso'), T('da quello più in alto', 'dal più alto', 'quello del foro più alto'), T('escono tutti uguali', 'sono tutti uguali', 'nessuno: escono uguali')],
          answer: 0,
          explain: T('Giusto: il buco più in basso ha più acqua sopra, che spinge più forte.', 'Esatto: il foro più basso è il più profondo, e lì la pressione è più alta.', 'Esatto: il foro più profondo ha sopra la colonna d’acqua più alta, e la pressione maggiore.'),
          solution: T('Lo spruzzo più forte esce dal buco più in basso.'),
        },
        {
          kind: 'q', predict: [{ hb: 36, wide: true }],
          text: T('Ora una bottiglia larga il doppio, con l’acqua alta uguale. Gli spruzzi…', 'Bottiglia larga il doppio, acqua alla stessa altezza. Gli spruzzi…', 'Stessa altezza d’acqua, ma in una bottiglia larga il doppio: che cosa cambia negli spruzzi?'),
          options: [T('sono uguali', 'restano uguali', 'niente: sono identici'), T('sono più forti', 'diventano più forti', 'spruzzano più lontano'), T('sono più deboli', 'diventano più deboli', 'spruzzano meno lontano')],
          answer: 0,
          explain: T('Uguali! C’è più acqua, ma sopra ogni buco l’acqua è alta uguale.', 'Esatto: la pressione dipende dalla profondità, non da quanta acqua c’è.', 'Esatto: conta solo quanto è profondo il foro, non quanta acqua c’è intorno.'),
          solution: T('Gli spruzzi restano uguali.'),
        },
        {
          kind: 'q', predict: [{ hb: 20, wide: false }],
          text: T('Ora c’è meno acqua: arriva poco sopra il buco di mezzo. Che cosa cambia?', 'Si abbassa il livello: l’acqua arriva poco sopra il foro di mezzo. Che cosa succede?', 'E con il livello abbassato fin poco sopra il foro centrale?'),
          options: [T('quello in alto smette, gli altri calano', 'il foro alto si ferma, gli altri calano', 'l’alto si ferma, gli altri calano'), T('non cambia niente: la bottiglia è la stessa', 'non cambia niente: i fori sono sempre gli stessi', 'tutto come prima: i fori non cambiano'), T('spruzzano tutti più forte di prima', 'spruzzano tutti più forte', 'gli spruzzi si allungano')],
          answer: 0,
          explain: T('Giusto: sopra i buchi c’è meno acqua, e spinge meno. Il buco in alto è fuori dall’acqua!', 'Esatto: meno profondità sopra ogni foro, meno pressione; il foro alto ormai sta sopra il livello.', 'Esatto: ogni foro ha meno acqua sopra; quello alto è all’asciutto.'),
          solution: T('Il buco in alto smette e gli altri spruzzano meno.'),
        },
        {
          kind: 'q',
          text: T('Allora l’acqua spinge forte quando…', 'La pressione in un liquido fermo dipende…', 'Che cosa decide la forza di uno spruzzo?'),
          options: [T('è profonda', 'dalla profondità', 'la profondità del foro'), T('ce n’è tanta', 'dalla quantità di liquido', 'la quantità d’acqua'), T('la bottiglia è grande', 'dalla forma del recipiente', 'la forma della bottiglia')],
          answer: 0,
          explain: T('Giusto: conta quanto è giù il buco, non quanta acqua c’è.', 'Esatto: P = ρ·g·h, e basta: forma e quantità non contano.', 'Esatto: la profondità, e solo lei. È il paradosso idrostatico: per questo conta l’altezza dei serbatoi dell’acqua, non la loro grandezza.'),
        },
      ],
      hints: [T('Guarda quanta acqua c’è sopra ogni buco.', 'La pressione cresce con la profondità sotto il pelo dell’acqua.', 'Conta la profondità di ogni foro sotto il livello dell’acqua.')],
    },
    {
      id: 'fl01-5', kind: 'costruisci', title: 'Il sollevatore delle barche',
      sim: 'press', params: { mode: 'pascal', m1: 20, A1: 10, A2: 100, m2: 1000 }, controls: ['A2'],
      intro: T(
        'Nuovo gioco per il parco: il sollevatore delle barche! Spingi su un pistone piccolo: l’olio porta la spinta a un pistone grande, che diventa tante volte più forte quante volte è più grande.',
        'Nuovo pezzo del parco: un sollevatore idraulico. In un liquido chiuso la pressione che aggiungi arriva uguale in ogni punto (<b>principio di Pascal</b>): la stessa P = F/A, sul pistone grande, diventa una forza più grande, F₂ = F₁·A₂/A₁.',
        'Nuovo pezzo del parco: un torchio idraulico, come quelli che alzano le auto dal meccanico. Blaise Pascal capì che la pressione aggiunta a un liquido chiuso si trasmette intatta ovunque: su un pistone cento volte più grande, la forza è cento volte più grande. [[F₂ = F₁ · A₂ / A₁]]'),
      piece: { id: 'sollevatore', name: 'Il sollevatore delle barche', desc: 'Con una spinta da bambino alza una barca: la pressione dell’olio fa il resto.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto fare grande il pistone grande, poi spingi.', 'Regola il pistone grande, poi spingi: la barca si alza?'),
          vals: {
            e: { m1: [[20], [10]], m2: [[1000], [600]] },
            s: { m1: [[20, 25], [15, 30]], m2: [[800, 1000, 1200], [600, 900, 1500]] },
          },
          set: { m1: 'm1', m2: 'm2' },
          ask: T(
            'Spingi con <b>{m1} kg</b>, la barca pesa <b>{m2} kg</b>. Il pistone piccolo è di 10 quadretti: quanti ne servono a quello grande, come minimo?',
            'Spingi con la forza di <b>{m1} kg</b> su un pistone di 10 cm². Qual è il pistone grande più piccolo che alza una barca di <b>{m2} kg</b>?',
            'Spinta di <b>{m1} kg</b> sul pistone da 10 centimetri quadrati, barca da <b>{m2} kg</b>: quanto deve essere grande, come minimo, il pistone grande? [[A₂ = A₁ · m₂ / m₁]]'),
          measure: 'A2', goal: '10 * m2 / m1', tol: 5,
          ok: T('La barca sale!'),
          high: T('Funziona, ma il pistone è più grande del necessario: rimpiccioliscilo.', 'Sale, ma il pistone è più grande del minimo: riducilo.'),
          low: T('Troppo piccolo: la barca non si muove. Ingrandiscilo!', 'Troppo piccolo: la forza non basta. Ingrandiscilo.'),
          solve: { A2: '10 * m2 / m1' },
        },
      ],
      hints: [
        T('La barca pesa tante volte la tua spinta: il pistone grande deve essere tante volte il piccolo.', 'A₂ / A₁ = m₂ / m₁.', 'Il rapporto fra i pistoni deve essere almeno quello fra i pesi.'),
      ],
      solution: T(
        'Spinta 20 kg, barca 1000 kg: 50 volte di più. Il pistone grande deve essere 50 volte il piccolo: 500 quadretti.',
        'A₂ = A₁·m₂/m₁ = 10 × 1000/20 = 500 cm².',
        'Il pistone grande deve stare al piccolo come la barca sta alla spinta: con 20 kg e 1000 kg, 500 centimetri quadrati.'),
    },
    {
      id: 'fl01-6', kind: 'lezione', title: 'Un oceano d’aria',
      sim: 'hydro', params: { mode: 'barometro', liq: 'mercurio', alt: 0 }, controls: ['liq', 'alt'],
      intro: T(
        'Anche l’aria pesa! Viviamo in fondo a un oceano d’aria alto tanti chilometri. Riempiamo un tubo e lo rovesciamo in una vasca: l’aria che spinge sulla vasca regge la colonna nel tubo.',
        'Anche l’aria ha un peso: viviamo sul fondo di un oceano d’aria. Nel 1643 Evangelista Torricelli capovolse un tubo pieno di mercurio in una vasca: la colonna si fermò a 76 cm, sostenuta dalla <b>pressione atmosferica</b>, circa 101 kPa (1 atmosfera, 1 atm).',
        'Nel 1643 Evangelista Torricelli riempì di mercurio un tubo di un metro e lo capovolse in una vasca. La colonna scese fino a 76 cm e si fermò, lasciando in cima il primo vuoto della storia: la teneva su il peso dell’aria che preme sulla vasca. Con l’acqua ci vorrebbe un tubo di dieci metri.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova con il mercurio e con l’acqua, poi porta il tubo in montagna.', 'Fai l’esperimento con il mercurio e con l’acqua, e poi in alta montagna.'),
          need: [
            { when: "liq == 'acqua'", try: { liq: 'acqua' }, msg: T('Ora prova con l’acqua al posto del mercurio.') },
            { when: 'alt >= 4000', try: { alt: 4800 }, msg: T('Ora sali in montagna, sopra i 4000 m.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con l’acqua al posto del mercurio, la colonna è…', 'Quanto è alta la colonna d’acqua che l’aria regge al livello del mare?', 'Perché Torricelli usò il mercurio e non l’acqua?'),
          options: [T('altissima: più di 10 metri', 'circa 10 m', 'con l’acqua serviva un tubo di dieci metri'), T('uguale a quella di mercurio', '76 cm', 'il mercurio si vede meglio nel vetro'), T('bassissima', 'circa 100 m', 'l’acqua evapora in fretta')],
          answer: 0,
          explain: T('Giusto: l’acqua è molto più leggera del mercurio, e la colonna è alta come una casa!', 'Esatto: h = P/(ρ·g) = 101 300/(1000 × 9,81) ≈ 10,3 m.', 'Esatto: il mercurio è 13,6 volte più denso dell’acqua, e la sua colonna è 13,6 volte più bassa. Un barometro ad acqua sarebbe alto come una casa di tre piani.'),
        },
        {
          kind: 'q',
          text: T('In cima a una montagna, la colonna è…', 'Come cambia la colonna di mercurio in alta montagna?', 'Con un barometro si può misurare l’altitudine. Perché?'),
          options: [T('più bassa', 'si abbassa', 'salendo, resta meno aria sopra'), T('più alta', 'si alza', 'in montagna fa più freddo'), T('uguale', 'resta di 76 cm', 'in alto il mercurio pesa un po’ meno')],
          answer: 0,
          explain: T('Giusto: lassù c’è meno aria sopra, e spinge meno.', 'Esatto: in alto c’è meno aria sopra di noi e la pressione cala: a 4800 m è circa la metà.', 'Esatto: salendo la pressione cala, perché resta meno aria sopra: in cima all’Everest è un terzo di quella del mare.'),
        },
        {
          kind: 'q',
          text: T('Bevi con la cannuccia: chi spinge su la bibita?', 'Quando bevi con la cannuccia, che cosa spinge la bibita su per la cannuccia?', 'Perché l’aria non ci schiaccia, se preme su di noi con quasi 10 tonnellate per metro quadrato?'),
          options: [T('l’aria che preme sulla bibita', 'la pressione dell’aria sulla bibita', 'spinge anche da dentro, uguale'), T('la bocca, che la tira su con forza', 'la bocca che la tira', 'siamo troppo robusti per sentirla'), T('la bibita sale da sola', 'la bibita, che è più leggera dell’aria', 'non pesa abbastanza')],
          answer: 0,
          explain: T('Giusto: tu togli l’aria dalla cannuccia, e l’aria di fuori spinge giù sulla bibita e la fa salire.', 'Esatto: aspirando abbassi la pressione nella cannuccia, e la pressione atmosferica spinge su la bibita.', 'Esatto: la pressione atmosferica spinge in tutte le direzioni, e da dentro il corpo spinge con la stessa forza. Si sente solo quando l’equilibrio salta, come nelle orecchie in aereo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Le colonne di Torricelli.'),
          vals: { rho: [[13600], [1000, 920, 1260]] }, calc: '101300 / (rho * 9.81)', unit: 'm', tol: 0.03,
          ask: T(null,
            'Un liquido ha densità <b>{rho} kg/m³</b>. In un tubo di Torricelli, al livello del mare, quanto è alta la sua colonna, in metri? (pressione dell’aria: 101 300 Pa)',
            'Che colonna, in metri, regge l’aria al livello del mare con un liquido di densità <b>{rho} kg/m³</b>? [[h = P / (ρ · g), con P = 101 300 Pa]]'),
          explain: T(null, 'Esatto: h = P/(ρ·g) = 101 300 / ({rho} × 9,81) ≈ {ans} m.', 'Esatto: circa {ans} m. [[h = 101 300 / ({rho} × 9,81)]]'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Quanto vale la pressione atmosferica al livello del mare?', 'Un sub a 10 m di profondità: quanta pressione sente in tutto, aria compresa?'),
          options: [T(null, 'circa 101 kPa', 'circa 2 atmosfere'), T(null, 'circa 10 kPa', 'circa 1 atmosfera'), T(null, 'circa 1 kPa', 'circa 10 atmosfere')],
          answer: 0,
          explain: T(null, 'Esatto: circa 101 300 Pa, cioè 1 atm: quanto fanno 10 m d’acqua.', 'Esatto: un’atmosfera d’aria più una d’acqua; ogni 10 m se ne aggiunge un’altra.'),
        },
      ],
      hints: [T('Lassù c’è meno aria sopra, e spinge meno.', 'h = P/(ρ·g): un liquido più denso fa una colonna più bassa.', 'L’aria regge una colonna che pesa quanto la colonna d’aria sopra la vasca.')],
      solution: T(
        'L’aria regge 76 cm di mercurio, o più di 10 metri d’acqua; in montagna meno.',
        'Al mare P ≈ 101 kPa: 76 cm di mercurio o 10,3 m d’acqua; in quota la pressione cala.',
        'Al livello del mare l’aria regge 76 cm di mercurio o dieci metri d’acqua; salendo, sempre meno.'),
    },
    {
      id: 'fl01-7', kind: 'ripasso', title: 'Ripasso della pressione',
      intro: T('Ripassiamo: impronte, sub e aria che spinge!', 'Ripasso: P = F/A, la pressione dei liquidi, il principio di Pascal, la pressione atmosferica.', 'Ripasso: la pressione, dalla sabbia al fondo del mare, fino in cima alle montagne.'),
      steps: [
        {
          kind: 'order',
          text: T('Metti in ordine, da chi schiaccia meno la sabbia a chi schiaccia di più.', 'Ordina dalla pressione più bassa alla più alta.', 'Dalla pressione più piccola alla più grande:'),
          items: [
            { t: T('adulto con le pinne'), v: 0.025 }, { t: T('adulto con le scarpe'), v: 0.15 },
            { t: T('elefante'), v: 1 }, { t: T('tacco a spillo'), v: 60 },
          ],
          explain: T('Perfetto: il tacco a spillo schiaccia più di tutti, perfino dell’elefante!', 'Perfetto: circa 2,5, 15, 98 e 5900 kPa.', 'Perfetto: dalle pinne al tacco la pressione cresce più di duemila volte.'),
        },
        {
          kind: 'q',
          text: T('Perché gli sci non affondano nella neve fresca?', 'Perché chi va con gli sci non affonda nella neve fresca?', 'Perché i trattori hanno ruote enormi per i campi fangosi?'),
          options: [T('il peso va su tanta neve', 'il peso si distribuisce su più neve', 'più superficie, meno pressione'), T('sono leggeri come una piuma', 'gli sci sono di legno, che è leggero', 'le ruote grandi vanno più veloci'), T('sono scivolosi e corrono via', 'gli sci scaldano la neve', 'le ruote grandi pesano meno')],
          answer: 0,
          explain: T('Giusto: lo stesso peso su tanta neve fa poca pressione.', 'Esatto: superficie grande, pressione piccola.', 'Esatto: stessa forza su più superficie, meno pressione: il trattore non sprofonda.'),
        },
        {
          kind: 'q',
          text: T('Dove l’acqua di un lago spinge di più su un sub?', 'In quale punto di un lago la pressione dell’acqua è maggiore?', 'Due sub nella stessa piscina, uno a 2 m e l’altro a 4 m: che cosa sente il secondo?'),
          options: [T('in fondo al lago', 'nel punto più profondo', 'il doppio della pressione dell’acqua'), T('in superficie, vicino al sole', 'in superficie', 'la stessa pressione, nella stessa piscina'), T('a metà strada', 'dove c’è più acqua intorno', 'il quadruplo della pressione')],
          answer: 0,
          explain: T('Giusto: più giù, più acqua sopra, più spinta.', 'Esatto: P = ρ·g·h cresce con la profondità.', 'Esatto: la pressione dell’acqua è proporzionale alla profondità.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La pressione del mare.'),
          vals: { h: [20, 30, 40, 50] }, calc: '1000 * 9.81 * h / 1000', unit: 'kPa', tol: 1,
          ask: T(null,
            'Quanta pressione fa l’acqua a <b>{h} m</b> di profondità, in kPa? (ρ = 1000 kg/m³)',
            'Quanti kPa fa l’acqua a <b>{h} m</b> di profondità? [[P = ρ · g · h]]'),
          explain: T(null, 'Esatto: 1000 × 9,81 × {h} ≈ {ans:0} kPa.', 'Esatto: circa {ans:0} kPa.'),
        },
        {
          kind: 'q',
          text: T('Nel sollevatore, il pistone grande è 100 volte il piccolo. La spinta diventa…', 'In un sollevatore il pistone grande ha un’area 100 volte quella del piccolo. La forza sul pistone grande è…', 'Perché nell’auto basta il piede per frenare una tonnellata?'),
          options: [T('100 volte più grande', '100 volte la forza sul piccolo', 'l’olio dei freni moltiplica la forza'), T('uguale', 'uguale alla forza sul piccolo', 'il piede di un adulto è fortissimo'), T('100 volte più piccola', '100 volte più piccola', 'i freni sono magnetici')],
          answer: 0,
          explain: T('Giusto: la stessa pressione su un pistone 100 volte più grande fa una spinta 100 volte più grande.', 'Esatto: F₂ = F₁·A₂/A₁ = 100·F₁.', 'Esatto: i freni sono un sollevatore idraulico: la pressione del pedale arriva identica ai pistoni delle ruote, più grandi.'),
        },
        {
          kind: 'q',
          text: T('In alta montagna l’aria spinge…', 'Che cosa misura un barometro?', 'Che cosa regge la colonna di mercurio nel tubo di Torricelli?'),
          options: [T('meno che al mare', 'la pressione atmosferica', 'la pressione dell’aria sulla vasca'), T('più forte che al mare', 'la temperatura dell’aria esterna', 'il vuoto in cima al tubo, che la tira'), T('uguale', 'l’altezza della marea', 'il vetro del tubo')],
          answer: 0,
          explain: T('Giusto: lassù c’è meno aria sopra.', 'Esatto: la pressione dell’aria, per esempio con l’altezza di una colonna di mercurio.', 'Esatto: il vuoto non tira niente; è l’aria di fuori che spinge.'),
        },
      ],
    },
    {
      id: 'fl01-8', kind: 'boss', title: 'Il mito della diga',
      sim: 'hydro', params: { mode: 'diga', hd: 50, lake: 'piccolo' }, controls: ['hd', 'lake'],
      intro: T(
        'Sono Vetrino. Un signore dice: <i>“Questa diga regge un lago lunghissimo, quindi deve essere fortissima. Davanti a un laghetto basta una diga sottile!”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“la spinta dell’acqua su una diga dipende da quanta acqua c’è dietro: un lago lungo dieci chilometri spinge molto più di un laghetto”</i>. Mettiamolo alla prova.',
        'Sono Vetrino. Sembra ovvio che un lago immenso spinga sulla sua diga più di uno stagno: dietro c’è un mare d’acqua. Lo pensano in tanti. Mettiamolo alla prova.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la stessa profondità con il laghetto e con il lago lunghissimo.', 'Confronta il laghetto e il lago lunghissimo, alla stessa profondità.'),
          need: [
            { when: "lake == 'grande'", try: { lake: 'grande' }, msg: T('Ora prova con il lago lunghissimo.') },
            { when: "lake == 'piccolo'", try: { lake: 'piccolo' }, msg: T('Ora prova con il laghetto.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con il lago lunghissimo, l’acqua spinge sulla diga…', 'A parità di profondità, come cambia la pressione sul fondo della diga se il lago è più lungo?', 'Che cosa cambia sulla diga, passando da 100 m a 10 km di lago?'),
          options: [T('uguale', 'non cambia', 'niente: la spinta è identica'), T('100 volte di più', 'cresce 100 volte', 'la spinta cresce cento volte'), T('un po’ di più', 'cresce un poco', 'la spinta raddoppia')],
          answer: 0,
          explain: T('Giusto: le frecce sono uguali! Conta solo quanto è profonda l’acqua.', 'Esatto: P = ρ·g·h dipende solo da h.', 'Esatto: niente. La pressione in ogni punto dipende solo dalla profondità.'),
        },
        {
          kind: 'q',
          text: T('Dove la diga deve essere più robusta?', 'Perché le dighe sono più spesse in basso?', 'Perché le dighe sono larghe alla base e strette in cima?'),
          options: [T('in basso', 'perché in basso la pressione è più alta', 'la pressione cresce con la profondità'), T('in alto', 'perché in alto l’acqua va più veloce', 'per resistere alle onde in cima'), T('dappertutto uguale', 'per bellezza', 'per poterci camminare sopra')],
          answer: 0,
          explain: T('Giusto: in fondo l’acqua spinge di più, come hai visto con le frecce.', 'Esatto: la pressione cresce con la profondità, e in fondo è massima.', 'Esatto: la spinta cresce scendendo, e il muro si ingrossa con lei.'),
        },
        {
          kind: 'q',
          text: T('Il lago diventa profondo il doppio. In fondo l’acqua spinge…', 'Se la profondità del lago raddoppia, la pressione sul fondo della diga…', 'E se raddoppia la profondità del lago, che cosa succede alla forza totale sulla diga?'),
          options: [T('il doppio', 'raddoppia', 'diventa quattro volte'), T('uguale', 'resta uguale', 'raddoppia'), T('la metà', 'si dimezza', 'resta uguale a prima, identica')],
          answer: 0,
          explain: T('Giusto: profondità doppia, spinta doppia in fondo.', 'Esatto: P è proporzionale a h.', 'Esatto: raddoppiano la pressione e anche l’altezza della parete bagnata, e la forza diventa quattro volte. [[F = ½ · ρ · g · h², per ogni metro di diga]]'),
        },
        {
          kind: 'q',
          text: T('Il mito dice: «un lago lungo spinge di più sulla diga». È vero?', 'Il mito: «la spinta sulla diga dipende da quanta acqua c’è dietro». Che cosa concludi?', '«Un lago immenso spinge sulla diga più di uno stagno»: dopo la prova, che cosa ne pensi?'),
          options: [T('no: conta solo la profondità', 'falso: conta solo la profondità', 'falso: conta solo la profondità'), T('sì: più acqua, più spinta', 'vero: più acqua spinge di più', 'vero: è una questione di massa'), T('sì, ma solo per i laghi lunghissimi', 'vero solo oltre i 10 km', 'vero solo per i laghi salati')],
          answer: 0,
          explain: T('Mito smontato! Un laghetto e un lago enorme, profondi uguale, spingono uguale sulla diga.', 'Mito smontato: la pressione, e quindi la spinta, dipende solo dalla profondità.', 'Mito smontato: la diga sente solo l’acqua che la tocca, e quella dipende dalla profondità. Il resto del lago spinge su sé stesso.'),
        },
      ],
      hints: [T('Guarda le frecce: cambiano con la lunghezza del lago?', 'P = ρ·g·h: nella formula c’è la lunghezza del lago?', 'Confronta le spinte cambiando una cosa alla volta.')],
      solution: T(
        'Le frecce cambiano con la profondità, non con la lunghezza del lago: il mito è falso.',
        'P = ρ·g·h non dipende dalla quantità d’acqua: il mito è falso.',
        'Conta solo la profondità: un laghetto e un lago lunghissimo profondi uguale spingono uguale sulla diga.'),
    },
  ],
};
