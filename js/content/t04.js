// T04 · Motori ed entropia. Simulazione: i motori (engine.js), in quattro modi: il gas sotto il pistone con il peso,
// il motore termico fra la caldaia e il lato freddo, il frigorifero, le particelle che si sparpagliano.
// La zona parte dal calore che diventa lavoro (primo principio), prevede quanto lavoro può dare un motore, scopre il
// rendimento e il limite di Carnot, costruisce il battello a vapore del laghetto, passa dal frigorifero al secondo
// principio, arriva all'entropia, e finisce con il mito del motore perfetto.
import { T } from '../util.js';

export default {
  id: 'T04',
  title: 'Motori ed entropia',
  levels: [
    {
      id: 't04-1', kind: 'lezione', title: 'Calore che diventa lavoro',
      sim: 'engine', params: { mode: 'pistone', Q: 70 }, controls: ['Q'],
      intro: T(
        'Il calore può far muovere le cose! Scalda un gas chiuso sotto un pistone: il gas si allarga e solleva un peso. È il trucco di tutti i motori. Ma non tutto il calore diventa movimento: una parte resta nel gas, che si scalda.',
        'Il calore dato a un gas può diventare <b>lavoro</b>: il gas si dilata e solleva il pistone con il peso sopra. Non tutto, però: una parte resta nel gas e ne alza la temperatura, cioè la sua <b>energia interna</b>. È il <b>primo principio della termodinamica</b>, Q = ΔU + L: l’energia non si crea e non si distrugge.',
        'Primo principio della termodinamica: il calore dato a un gas si divide fra l’aumento della sua energia interna e il lavoro che il gas fa espandendosi. Per l’aria che si espande a pressione costante, circa due settimi del calore diventano lavoro e cinque settimi scaldano il gas. [[Q = ΔU + L, con L = P · ΔV = m · g · h]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova poco calore e tanto calore.', 'Prova poco calore e tanto calore, e guarda le barre dell’energia.'),
          need: [
            { when: 'Q <= 40', try: { Q: 30 }, msg: T('Prova con poco calore: 40 joule o meno.', 'Manca una prova con 40 J o meno.') },
            { when: 'Q >= 120', try: { Q: 130 }, msg: T('Ora tanto calore: 120 joule o più.', 'Manca una prova con 120 J o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Più calore dai al gas, più il peso…', 'Dai 70 J di calore al gas. Il lavoro fatto per sollevare il peso è…', 'Dai 70 J di calore all’aria, che si espande a pressione costante. Il lavoro vale…'),
          options: [T('sale in alto', 'meno di 70 J', '20 J, i due settimi'), T('scende in basso', 'esattamente 70 J: tutto il calore', '70 J: tutto il calore'), T('resta fermo dov’è', 'più di 70 J: il gas caldo aiuta a spingere', '50 J, i cinque settimi')],
          answer: 0,
          explain: T('Giusto: più calore, più il gas si allarga e più in alto spinge il peso.', 'Esatto: circa 20 J sollevano il peso, gli altri 50 J scaldano il gas.', 'Esatto: 20 J di lavoro e 50 J di energia interna, in tutto 70 J.'),
        },
        {
          kind: 'q',
          text: T('Dove va il calore che non solleva il peso?', 'Che cos’è l’energia interna di un gas?', 'Un gas si espande in un cilindro isolato, senza ricevere calore, e solleva un peso. La sua temperatura…'),
          options: [T('scalda il gas', 'l’energia di movimento delle sue particelle', 'scende'), T('sparisce nel nulla', 'il peso del gas nel cilindro', 'resta uguale'), T('diventa peso in più', 'il calore che esce dal cilindro e scalda la stanza', 'sale, perché il gas lavora')],
          answer: 0,
          explain: T('Giusto: il resto del calore scalda il gas, che resta più caldo.', 'Esatto: più energia interna vuol dire particelle più veloci, cioè gas più caldo.', 'Esatto: il lavoro viene dalla sua energia interna. È il freddo della bomboletta spray che si svuota.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il lavoro sul peso.'),
          vals: { m: [[10], [20]], h: [[20, 30], [15]] }, derive: { hm: 'h / 100' }, calc: 'm * 9.81 * h / 100', unit: 'J', tol: 0.5,
          ask: T(null,
            'Il gas solleva un peso di <b>{m} kg</b> di <b>{h} cm</b>. Quanto lavoro ha fatto?',
            'Un peso di <b>{m} kg</b> sale di <b>{h} cm</b>: quanti joule di lavoro? [[L = m · g · h]]'),
          explain: T(null, 'Esatto: L = m·g·h = {m} × 9,81 × {hm} = {ans:1} J.', 'Esatto: {ans:1} J.'),
        },
      ],
      hints: [T('Il calore si divide: un po’ solleva il peso, un po’ scalda il gas.', 'Q = ΔU + L: l’energia del calore non si perde.', 'Per l’aria a pressione costante, il lavoro è circa due settimi del calore.')],
      solution: T(
        'Il calore solleva il peso e scalda il gas: più calore, più in alto.',
        'Q = ΔU + L: con 70 J, circa 20 J di lavoro e 50 J di energia interna.',
        'Primo principio: l’energia del calore si ritrova tutta, fra lavoro ed energia interna.'),
    },
    {
      id: 't04-2', kind: 'prevedi', title: 'Il motore e il freddo',
      sim: 'engine', params: { mode: 'ciclo', tc: 200, tf: 20 }, controls: [],
      intro: T(
        'Un motore prende calore da una caldaia e lo trasforma in movimento. Quanto calore diventa movimento? Tutto? Dipende da quanto è calda la caldaia? Prima indovina, poi guarda.',
        'Un motore termico prende calore dalla caldaia, ne trasforma una parte in lavoro e cede il resto al lato freddo, l’aria intorno. Ecco un motore perfetto, senza attriti né perdite. Quanto calore può diventare lavoro? Prevedi, poi guarda.',
        'Un motore termico ideale, senza attriti né perdite, lavora fra una caldaia e il lato freddo a 20 °C. Ci si aspetta che, tolte le perdite, tutto il calore diventi lavoro. Prevedi il rendimento, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ tc: 200 }],
          text: T('Caldaia a 200 gradi, aria a 20. Su 100 parti di calore, quante diventano lavoro?', 'Caldaia a 200 °C, aria a 20 °C: che parte del calore può diventare lavoro, al massimo?', 'Caldaia a 200 °C, lato freddo a 20 °C: il rendimento del motore perfetto è…'),
          options: [T('meno della metà', 'circa il 38%', 'circa 38%'), T('tutte e 100', 'il 100%: è perfetto', '100%: niente attriti'), T('più di 100, il motore è perfetto', 'circa il 90%', 'circa 90%')],
          answer: 0,
          explain: T('Giusto: anche il motore perfetto ne trasforma solo 38 su 100!', 'Esatto: 38%. Il resto, 62 J ogni 100, va per forza all’aria.', 'Esatto: 38%. Le perdite non c’entrano: il limite è un altro.'),
          solution: T('Meno della metà: 38 su 100.', 'Circa il 38%.'),
        },
        {
          kind: 'q', predict: [{ tc: 600 }],
          text: T('E con la caldaia a 600 gradi?', 'Ora la caldaia a 600 °C. Il calore che diventa lavoro…', 'Con la caldaia a 600 °C, il rendimento…'),
          options: [T('di più', 'sale al 66%', 'sale al 66%, ma resta sotto il 100%'), T('di meno', 'resta al 38%', 'resta uguale: il motore è lo stesso'), T('tutto quanto', 'diventa il 100%', 'arriva al 100%')],
          answer: 0,
          explain: T('Giusto: più calda la caldaia, più lavoro. Ma mai tutto.', 'Esatto: 66%. Più differenza di temperatura, più lavoro.', 'Esatto: 66%. Cresce con la temperatura della caldaia, ma non arriva al 100%.'),
          solution: T('Di più, ma non tutto.', 'Circa il 66%.'),
        },
        {
          kind: 'q', predict: [{ tc: 20 }],
          text: T('E se la caldaia fosse fredda come l’aria, a 20 gradi?', 'Caldaia a 20 °C, come l’aria. Il lavoro?', 'Caldaia e lato freddo alla stessa temperatura, 20 °C: il rendimento?'),
          options: [T('niente lavoro', 'zero', 'zero'), T('un po’ di lavoro', 'il 38%, come prima', 'il 38%: il motore è lo stesso'), T('tanto lavoro', 'il 100%', 'il 100%: niente perdite')],
          answer: 0,
          explain: T('Giusto: senza un caldo e un freddo, il motore non si muove.', 'Esatto: nessuna differenza di temperatura, nessun lavoro.', 'Esatto: senza differenza di temperatura il calore non passa, e il motore resta fermo.'),
          solution: T('Niente lavoro.', 'Zero.'),
        },
        {
          kind: 'q',
          text: T('Allora, per fare lavoro con il calore serve…', 'Che cosa serve a un motore termico per fare lavoro?', 'Da che cosa dipende il rendimento massimo di un motore termico?'),
          options: [T('un posto caldo e uno freddo', 'una differenza di temperatura fra caldaia e lato freddo', 'solo dalle temperature della caldaia e del lato freddo'), T('tanto calore, anche senza freddo', 'solo tanto calore dalla caldaia', 'dalla potenza del motore'), T('un motore grande', 'un motore senza attriti', 'dal combustibile che si brucia')],
          answer: 0,
          explain: T('Giusto: il calore va dal caldo al freddo, e lungo la strada una parte muove il motore.', 'Esatto: il calore scende dal caldo al freddo, e una parte diventa lavoro.', 'Esatto: è la grande scoperta del prossimo livello.'),
        },
      ],
      hints: [T('Più calda la caldaia, più lavoro; ma mai tutto.', 'Serve una differenza di temperatura.', 'Il rendimento dipende dalle due temperature, non dagli attriti.')],
    },
    {
      id: 't04-3', kind: 'lezione', title: 'Il rendimento',
      sim: 'engine', params: { mode: 'ciclo', tc: 300, tf: 20 }, controls: ['tc', 'tf'],
      intro: T(
        'Ogni motore funziona così: prende calore da un posto caldo, ne trasforma una parte in lavoro e butta il resto in un posto freddo. Più la caldaia è calda rispetto al lato freddo, più calore diventa lavoro. Ma mai tutto!',
        'Il <b>rendimento</b> di un motore è la parte del calore che diventa lavoro: η = L / Q. Il massimo possibile lo trovò Sadi Carnot nel 1824: <b>η = 1 − T fredda / T calda</b>, con le temperature in kelvin. Un motore d’auto arriva al 30% circa, una centrale moderna al 45%.',
        'Carnot, 1824: nessun motore che lavori fra due temperature può superare il rendimento di una macchina ideale reversibile, e quel rendimento dipende solo dalle temperature delle due sorgenti. I motori veri restano sotto il limite, per attriti e perdite. [[η = 1 − T fredda / T calda, con T in kelvin]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la caldaia poco calda e caldissima.', 'Prova la caldaia a 100 °C o meno, e a 500 °C o più.'),
          need: [
            { when: 'tc <= 100', try: { tc: 100 }, msg: T('Prova la caldaia poco calda: 100 gradi o meno.', 'Manca una prova con la caldaia a 100 °C o meno.') },
            { when: 'tc >= 500', try: { tc: 600 }, msg: T('Ora caldissima: 500 gradi o più.', 'Manca una prova con la caldaia a 500 °C o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la caldaia più calda, il motore…', 'Caldaia a 300 °C e lato freddo a 20 °C: il rendimento massimo è circa…', 'Che cosa servirebbe per un rendimento del 100%?'),
          options: [T('trasforma in lavoro più calore', '49%', 'un lato freddo allo zero assoluto, che non si raggiunge'), T('trasforma in lavoro meno calore', '93%', 'un motore senza nessun attrito'), T('si ferma', '100%', 'una caldaia grandissima, con tanto combustibile e ben isolata')],
          answer: 0,
          explain: T('Giusto: più differenza fra caldo e freddo, più lavoro.', 'Esatto: 1 − 293 / 573 ≈ 0,49.', 'Esatto: il rendimento è 100% solo se la temperatura fredda è zero kelvin.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il rendimento massimo.'),
          vals: { tc: [[200, 400], [600, 800]] }, derive: { K: 'tc + 273' }, calc: '100 * (1 - 293 / (tc + 273))', unit: '%', tol: 1,
          ask: T(null,
            'Caldaia a <b>{tc} °C</b>, lato freddo a 20 °C (293 K). Qual è il rendimento massimo, in percentuale?',
            'Sorgenti a <b>{tc} °C</b> e a 20 °C: rendimento massimo, in percentuale? [[η = 1 − T fredda / T calda]]'),
          explain: T(null, 'Esatto: {tc} °C sono {K} K, e 1 − 293 / {K} = {ans:0}%.', 'Esatto: {ans:0}%.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Un motore d’auto trasforma in movimento circa 30 parti di calore su 100. Dove va il resto?'),
          options: [T('scalda l’aria'), T('torna nel serbatoio'), T('sparisce nel nulla')],
          answer: 0,
          explain: T('Giusto: esce dallo scarico e dal radiatore. Per questo il motore è così caldo.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Perché le centrali elettriche usano vapore caldissimo, a 500 °C e più?', 'Perché le centrali scaricano tanto calore nei fiumi o nelle torri di raffreddamento?'),
          options: [T(null, 'più calda la sorgente, più alto il rendimento', 'serve una sorgente fredda: il calore non trasformato deve finire da qualche parte'), T(null, 'il vapore caldo pesa meno e sale più in fretta nei tubi', 'perché il vapore è sporco e va lavato'), T(null, 'per far bollire l’acqua più in fretta', 'per non sprecare l’acqua')],
          answer: 0,
          explain: T(null, 'Esatto: con 550 °C e 30 °C il limite supera il 60%.', 'Esatto: è il lato freddo del motore, senza il quale non si fa lavoro.'),
        },
      ],
      hints: [T('Più differenza fra caldo e freddo, più lavoro.', 'η = 1 − T fredda / T calda, con T in kelvin.', 'Il rendimento massimo dipende solo dal rapporto fra le temperature assolute.')],
      solution: T(
        'Caldaia più calda, più lavoro dallo stesso calore; ma mai tutto.',
        'η = 1 − 293 / T calda: a 300 °C circa 49%.',
        'Il limite di Carnot: 1 − T fredda / T calda, sempre sotto il 100%.'),
    },
    {
      id: 't04-4', kind: 'costruisci', title: 'Il battello a vapore',
      sim: 'engine', params: { mode: 'ciclo', tc: 100, tf: 20, need: 30 }, controls: ['tc'], labels: { tc: { min: 50, max: 400, step: 5 } },
      intro: T(
        'Sul laghetto del parco arriva un battello a vapore! La caldaia bolle, il vapore spinge il pistone e la ruota a pale gira. L’acqua del lago, a 20 gradi, raffredda il vapore. Scegli quanto scaldare la caldaia: abbastanza per far muovere il battello, ma non di più.',
        'Costruisci il battello a vapore del laghetto: la caldaia è il lato caldo, l’acqua del lago a 20 °C il lato freddo. Il motore deve arrivare al rendimento richiesto: trova la temperatura della caldaia che ci arriva giusta. Scaldare di più costa combustibile, e una caldaia troppo calda è pericolosa.',
        'Il battello a vapore del laghetto: caldaia, cilindro e condensatore raffreddato dall’acqua del lago a 293 K. Il limite di Carnot fissa, per ogni rendimento richiesto, la temperatura minima della caldaia. [[T calda = T fredda / (1 − η)]]'),
      piece: { id: 'battello', name: 'Il battello a vapore', desc: 'Il calore della caldaia diventa in parte lavoro, che gira la ruota a pale; il resto va nell’acqua del lago.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto scaldare la caldaia, poi lancia.', 'Regola la temperatura della caldaia, poi lancia: deve dare il rendimento richiesto.'),
          vals: { e: { eta: [[30], [40]] }, s: { eta: [[25, 35], [45, 50]] } },
          set: { need: 'eta' },
          ask: T(
            'Il battello ha bisogno che <b>{eta} parti su 100</b> del calore diventino lavoro. A quanti gradi scaldi la caldaia?',
            'Serve un rendimento del <b>{eta}%</b>, con il lago a 20 °C. A che temperatura va la caldaia?',
            'Rendimento richiesto <b>{eta}%</b>, lago a 293 K: quale temperatura della caldaia?'),
          measure: 'tc', goal: '293.15 / (1 - eta / 100) - 273.15', tol: 5,
          ok: T('Perfetto: il battello parte!', 'Esatto: rendimento raggiunto, senza sprechi.'),
          high: T('Troppo calda: sprechi legna e la caldaia rischia. Abbassala.', 'Troppo calda: il rendimento basta, ma sprechi combustibile. Abbassa la temperatura.'),
          low: T('Troppo fredda: il battello non ce la fa. Scaldala di più!', 'Troppo fredda: il rendimento non basta. Alza la temperatura.'),
          solve: { tc: 'Math.round((293.15 / (1 - eta / 100) - 273.15) / 5) * 5' },
        },
        {
          kind: 'q',
          text: T('Perché il battello ha bisogno anche dell’acqua fredda del lago?', 'A che cosa serve l’acqua fredda del lago, nel motore del battello?', 'Se il lago fosse a 5 °C invece che a 20 °C, per lo stesso rendimento la caldaia potrebbe essere…'),
          options: [T('senza freddo il calore non diventa lavoro', 'è il lato freddo: senza, il calore non darebbe lavoro', 'più fredda'), T('per lavare la caldaia', 'raffredda i passeggeri d’estate', 'più calda'), T('per non far affondare il battello', 'frena la ruota quando serve', 'uguale: conta solo la caldaia')],
          answer: 0,
          explain: T('Giusto: il calore deve scendere dal caldo al freddo, e intanto muove la ruota.', 'Esatto: il vapore cede al lago il calore che non diventa lavoro.', 'Esatto: conta il rapporto fra le temperature assolute, e con il lato freddo più freddo basta una caldaia meno calda.'),
        },
      ],
      hints: [T('Per 30 parti su 100 circa 150 gradi; per 40 circa 215.', 'T calda = 293 / (1 − η), in kelvin.', 'La temperatura minima della caldaia è quella fredda divisa per (1 − η), in kelvin.')],
      solution: T('Circa 146 gradi per 30 parti su 100, circa 215 per 40.', 'T = 293 / (1 − η): per il 35% circa 178 °C.', 'Per il 45%: 293 / 0,55 fa circa 533 K, cioè circa 260 °C.'),
    },
    {
      id: 't04-5', kind: 'lezione', title: 'Il frigorifero',
      sim: 'engine', params: { mode: 'frigo', ti: 5 }, controls: ['ti'],
      intro: T(
        'Il frigorifero non produce il freddo: porta fuori il caldo! Prende il calore dei cibi e lo butta in cucina, dalla griglia dietro. Ma il calore, da solo, va sempre dal caldo al freddo: per farlo andare al contrario il frigo consuma corrente.',
        'Il calore passa da solo dal corpo caldo a quello freddo, mai al contrario: è il <b>secondo principio della termodinamica</b>. Il frigorifero sposta il calore dall’interno freddo alla cucina calda, ma solo usando lavoro, quello del motore elettrico. Alla cucina arriva il calore tolto ai cibi più il lavoro.',
        'Secondo principio, come lo disse Clausius: il calore non passa spontaneamente da un corpo freddo a uno caldo. Il frigorifero è un motore al contrario: con il lavoro sposta il calore dall’interno all’esterno. Quanti joule porta fuori per ogni joule di lavoro dipende solo dalle temperature. [[COP = T dentro / (T fuori − T dentro)]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il frigo e il congelatore.', 'Prova l’interno a 5 °C o più, e a −20 °C o meno.'),
          need: [
            { when: 'ti >= 5', try: { ti: 5 }, msg: T('Prova il frigo: 5 gradi o più.', 'Manca una prova a 5 °C o più.') },
            { when: 'ti <= -20', try: { ti: -20 }, msg: T('Ora il congelatore: −20 gradi o meno.', 'Manca una prova a −20 °C o meno.') },
          ],
        },
        {
          kind: 'q',
          text: T('Dove va il calore che il frigo toglie ai cibi?', 'Perché dietro il frigorifero la griglia è calda?', 'Il frigo toglie ai cibi 100 J e consuma 25 J di lavoro. Alla cucina arrivano…'),
          options: [T('in cucina, dalla griglia dietro', 'lì esce il calore tolto ai cibi', '125 J'), T('sparisce dentro il frigo', 'il motore si è rotto e si sta surriscaldando', '75 J'), T('nel congelatore', 'per scongelare il ghiaccio', '100 J')],
          answer: 0,
          explain: T('Giusto: il frigo porta il caldo fuori, in cucina.', 'Esatto: il calore dei cibi più il lavoro del motore: la griglia scalda la cucina.', 'Esatto: 100 J tolti più 25 J di lavoro.'),
        },
        {
          kind: 'q',
          text: T('Per raffreddare di più, il congelatore consuma…', 'Che cosa costa di più: tenere l’interno a 5 °C o a −20 °C?', 'D’estate lasci il frigo aperto per rinfrescare la cucina chiusa. La cucina…'),
          options: [T('più corrente', '−20 °C', 'si scalda'), T('meno corrente', '5 °C', 'si rinfresca'), T('niente corrente', 'costano uguale', 'resta uguale')],
          answer: 0,
          explain: T('Giusto: più freddo dentro, più lavoro per portare fuori il caldo.', 'Esatto: più grande il salto di temperatura, più lavoro per ogni joule spostato.', 'Esatto: il calore gira in tondo nella cucina, e in più c’è il lavoro del motore, che la scalda.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il frigo ideale.'),
          vals: { ti: [[-18], [0, -30]] }, derive: { K: 'ti + 273' }, calc: '(ti + 273) / (25 - ti)', unit: 'J', tol: 0.2,
          ask: T(null,
            'Frigo ideale: dentro a <b>{ti} °C</b>, cucina a 25 °C (298 K). Quanti joule di calore porta fuori, al massimo, per ogni joule di lavoro?',
            'Interno a <b>{ti} °C</b>, cucina a 298 K: quanti joule tolti per ogni joule di lavoro, al massimo? [[COP = T dentro / (T fuori − T dentro)]]'),
          explain: T(null, 'Esatto: {K} / (298 − {K}) = {ans:1} J per ogni joule di lavoro.', 'Esatto: {ans:1} J per joule.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Il calore, da solo, va…'),
          options: [T('dal caldo al freddo'), T('dal freddo al caldo'), T('dove vuole')],
          answer: 0,
          explain: T('Giusto: il tè si raffredda, il gelato si scioglie. Mai il contrario, da solo.'),
        },
      ],
      hints: [T('Il frigo sposta il caldo da dentro a fuori, e per farlo consuma corrente.', 'Calore in cucina = calore tolto ai cibi + lavoro.', 'Più è freddo dentro, più lavoro serve per ogni joule portato fuori.')],
      solution: T(
        'Il frigorifero porta il caldo fuori e consuma corrente per farlo.',
        'Calore in cucina = calore tolto ai cibi + lavoro del motore.',
        'Coefficiente ideale: T dentro / (T fuori − T dentro); a −18 °C circa 6.'),
    },
    {
      id: 't04-6', kind: 'lezione', title: 'Il disordine che cresce',
      sim: 'engine', params: { mode: 'mescola', N: 10 }, controls: ['N'],
      intro: T(
        'Apri una boccetta di profumo: il profumo si sparge in tutta la stanza. Hai mai visto il profumo tornare da solo nella boccetta? Mai! Le cose si mescolano da sole, ma non si separano da sole. Prova con le particelle di un gas.',
        'Togli la parete: il gas si sparge in tutta la scatola e non torna più da una parte sola. Nessuna forza lo vieta: è solo troppo improbabile, perché ci sono molti più modi di stare sparpagliate che raccolte. La misura di questi modi è l’<b>entropia</b>: in un sistema isolato può solo crescere.',
        'Boltzmann: l’<b>entropia</b> conta in quanti modi microscopici si può realizzare uno stato. Con N particelle, quello con tutte nella metà sinistra è uno solo su 2 elevato a N. L’entropia di un sistema isolato non diminuisce: è la freccia del tempo. [[S = k · ln W]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova poche particelle e tante.', 'Prova con 6 particelle o meno, e con 30 o più.'),
          need: [
            { when: 'N <= 6', try: { N: 4 }, msg: T('Prova con poche particelle: 6 o meno.', 'Manca una prova con 6 particelle o meno.') },
            { when: 'N >= 30', try: { N: 30 }, msg: T('Ora tante particelle: 30 o più.', 'Manca una prova con 30 particelle o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Le particelle tornano tutte a sinistra, da sole?', 'Con 4 particelle, quante volte su 16 sono tutte nella metà sinistra?', 'Con 40 particelle, la probabilità di trovarle tutte a sinistra è circa…'),
          options: [T('con tante particelle, praticamente mai', '1 volta su 16', 'una su mille miliardi'), T('sì, sempre', '8 volte su 16', 'una su 80'), T('sì, dopo un minuto', 'mai, nemmeno una volta', 'una su 2')],
          answer: 0,
          explain: T('Giusto: con poche ogni tanto succede, con tante non succede mai.', 'Esatto: ogni particella ha 2 posti, e 2 × 2 × 2 × 2 = 16 modi.', 'Esatto: 2 elevato a 40 fa circa mille miliardi. Nell’aria le particelle sono miliardi di miliardi.'),
        },
        {
          kind: 'q',
          text: T('Un cubetto di ghiaccio si scioglie in una bibita calda. Può tornare ghiaccio da solo?', 'Perché un cubetto di ghiaccio in una stanza calda si scioglie, e mai il contrario?', 'Il calore passa da un corpo a 400 K a uno a 300 K. L’entropia totale…'),
          options: [T('no, mai da solo', 'il calore va dal caldo al freddo, e l’entropia totale cresce', 'cresce: il freddo ne guadagna più di quanta ne perda il caldo'), T('sì, se aspetti', 'il ghiaccio è più pesante dell’acqua', 'resta uguale'), T('sì, se lo guardi', 'l’acqua attira il calore', 'diminuisce')],
          answer: 0,
          explain: T('Giusto: da solo il caldo va sempre verso il freddo.', 'Esatto: il contrario non violerebbe l’energia, ma l’entropia sì.', 'Esatto: lo stesso calore pesa di più a temperatura più bassa: Q/300 è più di Q/400.'),
        },
        {
          kind: 'q',
          text: T('Perché un uovo rotto non torna intero da solo?', 'Perché nessun motore può trasformare tutto il calore in lavoro?', 'Perché nella realtà nessuna trasformazione è perfettamente reversibile?'),
          options: [T('si è messo in disordine', 'per il secondo principio, una parte del calore deve andare al lato freddo', 'attriti e scambi di calore fra temperature diverse creano entropia'), T('l’uovo è troppo pesante per rimettersi a posto', 'per colpa degli attriti, che si possono eliminare', 'perché l’energia, a ogni trasformazione, si consuma e sparisce un po’'), T('il guscio rotto si scioglie nell’aria', 'perché il calore pesa', 'per colpa della gravità')],
          answer: 0,
          explain: T('Giusto: rompere è facile, rimettere in ordine da solo no.', 'Esatto: anche il motore perfetto deve scaricare calore, se no l’entropia diminuirebbe.', 'Esatto: ogni processo vero crea un po’ di entropia, che non si può più distruggere.'),
        },
      ],
      hints: [T('Mescolare è facile, separare da solo è quasi impossibile.', 'Ci sono molti più modi di essere in disordine che in ordine.', 'Tutte a sinistra: una volta su 2 elevato a N.')],
      solution: T(
        'Le particelle si sparpagliano e non tornano più tutte da una parte.',
        'L’entropia di un sistema isolato cresce: il disordine aumenta da solo.',
        'Entropia: il logaritmo del numero dei modi; in un sistema isolato non diminuisce.'),
    },
    {
      id: 't04-7', kind: 'ripasso', title: 'Ripasso di motori ed entropia',
      intro: T('Ripassiamo: motori, frigoriferi e disordine!', 'Ripasso: primo principio, rendimento, secondo principio ed entropia.', 'Ripasso: dal pistone che sale alla freccia del tempo.'),
      steps: [
        {
          kind: 'q',
          text: T('Il calore può far muovere un motore?', 'Che cosa dice il primo principio della termodinamica?', 'Un gas riceve 500 J di calore e fa 200 J di lavoro. La sua energia interna…'),
          options: [T('sì, ma non tutto diventa movimento', 'l’energia si conserva', 'cresce di 300 J'), T('no, mai', 'il calore diventa tutto lavoro', 'cresce di 700 J'), T('sì, tutto diventa movimento', 'l’energia si consuma un po’ a ogni passaggio', 'cala di 200 J')],
          answer: 0,
          explain: T('Giusto: una parte del calore resta e scalda.', 'Esatto: il calore diventa energia interna più lavoro, e niente si perde.', 'Esatto: 500 − 200 = 300 J.'),
        },
        {
          kind: 'q',
          text: T('Un motore funziona meglio se la caldaia è…', 'Caldaia a 327 °C, lato freddo a 27 °C. Rendimento massimo?', 'Un motore ideale lavora fra 600 K e 300 K e riceve 1000 J. Quanto lavoro può dare, al massimo?'),
          options: [T('più calda', '50%', '500 J'), T('più fredda', '92%', '1000 J'), T('piccola', '100%', '300 J')],
          answer: 0,
          explain: T('Giusto: più differenza fra caldo e freddo, più lavoro.', 'Esatto: 1 − 300 / 600 = 0,5.', 'Esatto: rendimento 50%, quindi 500 J.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il primo principio.'),
          vals: { Q: [300, 500, 800], L: [100, 200] }, calc: 'Q - L', unit: 'J', tol: 1,
          ask: T(null,
            'Un gas riceve <b>{Q} J</b> di calore e fa <b>{L} J</b> di lavoro. Di quanto cresce la sua energia interna?',
            'Calore ricevuto <b>{Q} J</b>, lavoro fatto <b>{L} J</b>: variazione dell’energia interna? [[ΔU = Q − L]]'),
          explain: T(null, 'Esatto: ΔU = {Q} − {L} = {ans:0} J.', 'Esatto: {ans:0} J.'),
        },
        {
          kind: 'q',
          text: T('Il calore dei cibi, il frigorifero…', 'Perché il frigorifero consuma corrente?', 'Un frigorifero ideale lavora fra 260 K e 300 K. Quanti joule porta fuori per ogni joule di lavoro?'),
          options: [T('lo porta fuori, in cucina', 'serve lavoro per portare il calore dal freddo al caldo', '6,5'), T('lo distrugge', 'per accendere la luce dentro', '1,15'), T('lo trasforma in ghiaccio', 'per fare il ghiaccio', '40')],
          answer: 0,
          explain: T('Giusto: il frigo sposta il caldo, non lo distrugge.', 'Esatto: da solo il calore non va dal freddo al caldo.', 'Esatto: 260 / 40 = 6,5.'),
        },
        {
          kind: 'q',
          text: T('Le cose, da sole, tendono a…', 'Che cosa misura l’entropia?', 'In un sistema isolato, l’entropia…'),
          options: [T('mescolarsi', 'in quanti modi si possono disporre le particelle', 'non diminuisce mai'), T('mettersi in ordine', 'la temperatura del gas, misurata in kelvin dentro la scatola', 'resta sempre uguale'), T('stare ferme', 'l’energia che si consuma', 'diminuisce con il tempo')],
          answer: 0,
          explain: T('Giusto: il disordine cresce da solo.', 'Esatto: più modi, più entropia.', 'Esatto: è il secondo principio.'),
        },
      ],
    },
    {
      id: 't04-8', kind: 'boss', title: 'Il mito del motore perfetto',
      sim: 'engine', params: { mode: 'ciclo', tc: 100, tf: 20, claim: 90 }, controls: ['tc'], labels: { tc: { min: 50, max: 800, step: 10 } },
      intro: T(
        'Sono Vetrino. Un inventore presenta il suo motore: <i>“Con la caldaia a 100 gradi trasforma in lavoro 90 parti su 100 del calore! Niente sprechi!”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“il mio motore, con la caldaia a 100 °C e l’aria a 20 °C, trasforma in lavoro il 90% del calore: basta togliere gli attriti”</i>. Molti inventori l’hanno promesso. Verifichiamo con il rendimento massimo possibile.',
        'Sono Vetrino. Il mito del motore perfetto: <i>“senza attriti, un motore può trasformare in lavoro quasi tutto il calore, anche con poca differenza di temperatura”</i>. Sembra solo una questione di ingegneria. Mettiamolo alla prova con il limite di Carnot.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa cambi fra una prova e l’altra?', 'Come si mette alla prova la promessa dell’inventore?', 'Quale grandezza decide il rendimento massimo di un motore?'),
          options: [T('la temperatura della caldaia', 'si calcola il rendimento massimo con quelle temperature', 'il rapporto fra le temperature assolute delle due sorgenti'), T('il colore del motore', 'si guarda se il motore è bello e lucido', 'la potenza del motore'), T('niente, si crede all’inventore', 'si crede all’inventore, che è un esperto', 'il tipo di combustibile')],
          answer: 0,
          explain: T('Giusto: cambia la caldaia e guarda quanto lavoro esce.', 'Esatto: il limite dipende solo dalle due temperature.', 'Esatto: è il limite di Carnot.'),
        },
        {
          kind: 'free',
          text: T('Prova la caldaia a 100 gradi e poi caldissima.', 'Prova la caldaia a 100 °C e a 600 °C o più.'),
          need: [
            { when: 'tc <= 100', try: { tc: 100 }, msg: T('Prova la caldaia a 100 gradi.', 'Manca una prova con la caldaia a 100 °C.') },
            { when: 'tc >= 600', try: { tc: 700 }, msg: T('Ora caldissima: 600 gradi o più.', 'Manca una prova con la caldaia a 600 °C o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la caldaia a 100 gradi, quante parti su 100 diventano lavoro, al massimo?', 'Con la caldaia a 100 °C e l’aria a 20 °C, il rendimento massimo è…', 'A 373 K e 293 K, il rendimento ideale è…'),
          options: [T('circa 21', 'circa il 21%', '21%: lontanissimo dal 90%'), T('circa 90', 'circa il 90%', '90%: la promessa è giusta'), T('tutte e 100', 'il 100%, senza attriti', '80%: basta poco in più')],
          answer: 0,
          explain: T('Giusto: al massimo 21 su 100. Altro che 90!', 'Esatto: 1 − 293 / 373 ≈ 0,21.', 'Esatto: 21%, anche senza nessun attrito.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il rendimento massimo.'),
          vals: { tc: [100] }, calc: '100 * (1 - 293 / (tc + 273))', unit: '%', tol: 1,
          ask: T(null,
            'Caldaia a <b>{tc} °C</b>, aria a 20 °C (293 K): qual è il rendimento massimo, in percentuale?',
            'Sorgenti a <b>{tc} °C</b> e a 20 °C: rendimento massimo, in percentuale? [[η = 1 − T fredda / T calda]]'),
          explain: T(null, 'Esatto: 1 − 293 / 373 = {ans:0}%.', 'Esatto: {ans:0}%.'),
        },
        {
          kind: 'q',
          text: T('Anche con la caldaia caldissima, il motore arriva a 100 parti su 100?', 'Anche a 800 °C, il rendimento massimo arriva al 100%?', 'A quale temperatura del lato freddo il rendimento ideale arriverebbe al 100%?'),
          options: [T('no, mai', 'no, il 73%', 'allo zero assoluto, che non si raggiunge'), T('sì, a 800 gradi', 'sì, il 100%', 'a 0 °C'), T('sì, se il motore è nuovo', 'quasi: il 99%', 'a 20 °C')],
          answer: 0,
          explain: T('Giusto: più calda è meglio, ma tutto il calore non diventa mai lavoro.', 'Esatto: 1 − 293 / 1073 ≈ 0,73.', 'Esatto: servirebbe un lato freddo a 0 K.'),
        },
        {
          kind: 'q',
          text: T('Allora il motore dell’inventore…', 'Che cosa concludi sulla promessa dell’inventore?', 'Il mito del motore perfetto: il verdetto?'),
          options: [T('non può esistere: promette troppo', 'impossibile: con quelle temperature il massimo è il 21%', 'falso: il limite di Carnot non dipende dagli attriti'), T('funziona benissimo', 'vera, se si tolgono gli attriti', 'vero: è solo questione di ingegneria'), T('funziona, ma solo di notte', 'vera, ma solo per poco tempo', 'vero, con un buon isolamento termico e ottimi materiali moderni')],
          answer: 0,
          explain: T('Mito smontato! Con la caldaia a 100 gradi, al massimo 21 parti su 100 diventano lavoro. Mai 90!', 'Mito smontato: anche un motore perfetto, senza attriti, a 100 °C non supera il 21%.', 'Mito smontato: il limite viene dal secondo principio, non dagli attriti; servirebbe un lato freddo vicino allo zero assoluto.'),
        },
      ],
      hints: [T('Guarda la barra: dove arriva il lavoro, e dove la promessa.', 'Rendimento massimo: 1 − 293 / 373.', 'Il limite di Carnot vale anche senza attriti.')],
      solution: T(
        'Con la caldaia a 100 gradi, al massimo 21 parti su 100: la promessa è impossibile.',
        'η massimo = 1 − 293 / 373 ≈ 21%: il 90% è impossibile.',
        'Il limite di Carnot, 21% fra 373 K e 293 K, vale per qualunque motore: il mito è falso.'),
    },
  ],
};
