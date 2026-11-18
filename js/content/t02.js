// T02 · Stati della materia. Simulazione: gli stati della materia (phase.js), in cinque modi: le particelle dell'acqua
// nei tre stati, il ghiaccio sul fuoco con il grafico a gradini, il ghiaccio nella limonata, la pentola in montagna (e a
// pressione), i due termometri, asciutto e bagnato.
// La zona va dai tre stati ai passaggi di stato, scopre il calore latente (la temperatura che non si muove), costruisce il
// chiosco delle granite, passa per l'ebollizione in montagna e il fresco del sudore, e finisce con il mito del fuoco alto.
import { T } from '../util.js';

export default {
  id: 'T02',
  title: 'Stati della materia',
  levels: [
    {
      id: 't02-1', kind: 'lezione', title: 'Solido, liquido, gas',
      sim: 'phase', params: { mode: 'stati', t: 20 }, controls: ['t'],
      intro: T(
        'Il ghiaccio, l’acqua e il vapore sono la stessa cosa: acqua! Cambia solo quanto si agitano le sue particelle. Fredde stanno ferme al loro posto, più calde scivolano, caldissime volano via. Prova!',
        'La materia ha tre <b>stati</b>: solido, liquido e gassoso. Nel solido le particelle vibrano attorno a un posto fisso; nel liquido restano vicine ma scivolano una sull’altra; nel gas volano libere e lontane. L’acqua fonde a 0 °C e bolle a 100 °C: sono i <b>passaggi di stato</b>.',
        'Ghiaccio, acqua e vapore sono la stessa molecola in tre <b>stati della materia</b>. Cambia l’equilibrio fra due cose: i legami che tengono unite le molecole e l’agitazione che le vuole separare. Col freddo vincono i legami, col caldo l’agitazione.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il ghiaccio, l’acqua e il vapore.', 'Prova una temperatura sotto lo zero e una sopra i 100 °C.'),
          need: [
            { when: 't < 0', try: { t: -20 }, msg: T('Prova sotto zero: il ghiaccio.', 'Manca una prova sotto 0 °C.') },
            { when: 't > 100', try: { t: 120 }, msg: T('Ora sopra i 100 gradi: il vapore.', 'Manca una prova sopra 100 °C.') },
          ],
        },
        {
          kind: 'q',
          text: T('Nel ghiaccio, le particelle…', 'In quale stato le particelle volano libere, lontane una dall’altra?', 'Perché un liquido prende la forma del bicchiere, e un solido no?'),
          options: [T('vibrano al loro posto', 'gassoso', 'le sue molecole scivolano'), T('volano libere in tutte le direzioni', 'liquido', 'il liquido è più pesante del solido'), T('scivolano una sull’altra', 'solido', 'il bicchiere schiaccia il liquido')],
          answer: 0,
          explain: T('Giusto: nel ghiaccio ogni particella ha il suo posto, e lì trema.', 'Esatto: nel gas le particelle sono lontane e volano dappertutto.', 'Esatto: i legami del liquido tengono le molecole vicine, ma non al loro posto.'),
        },
        {
          kind: 'q',
          text: T('Il ghiaccio diventa acqua a…', 'Come si chiama il passaggio da solido a liquido?', 'Le goccioline sul bicchiere di una bibita fredda da dove vengono?'),
          options: [T('0 gradi', 'fusione', 'dal vapore dell’aria, che si condensa sul vetro freddo'), T('100 gradi', 'ebollizione', 'dalla bibita, che passa attraverso il vetro'), T('20 gradi', 'condensazione', 'dal ghiaccio, che trasuda')],
          answer: 0,
          explain: T('Giusto: a 0 gradi il ghiaccio si scioglie, a 100 l’acqua bolle.', 'Esatto: fusione. Al contrario, da liquido a solido, è la solidificazione.', 'Esatto: nell’aria c’è sempre vapore invisibile, e sul vetro freddo torna liquido.'),
        },
        {
          kind: 'q',
          text: T('Le nuvole sono fatte di…', 'Che cosa succede al vapore quando si raffredda sotto i 100 °C?', 'Il ghiaccio secco, anidride carbonica a −78 °C, fuma senza sciogliersi. Che cosa fa?'),
          options: [T('goccioline d’acqua', 'si condensa in goccioline', 'sublima: da solido a gas'), T('vapore invisibile', 'diventa subito ghiaccio', 'si scioglie in un liquido invisibile'), T('fumo', 'resta vapore, solo più lento', 'brucia piano piano, senza fiamma')],
          answer: 0,
          explain: T('Giusto: il vapore sale, si raffredda e torna in goccioline. Le nuvole sono goccioline!', 'Esatto: è la condensazione, il contrario dell’evaporazione.', 'Esatto: è la sublimazione. Il fumo bianco sono goccioline d’acqua dell’aria, condensate dal freddo.'),
        },
      ],
      hints: [T('Più caldo, particelle più libere.', 'Solido: vibrano; liquido: scivolano; gas: volano.', 'Legami contro agitazione: vince il più forte.')],
      solution: T(
        'Ghiaccio, acqua e vapore: particelle ferme, particelle che scivolano, particelle che volano.',
        'Solido sotto 0 °C, liquido fino a 100 °C, gas sopra.',
        'Lo stato dipende da chi vince fra legami e agitazione.'),
    },
    {
      id: 't02-2', kind: 'prevedi', title: 'Il ghiaccio sul fuoco',
      sim: 'phase', params: { mode: 'curva', P: 2, min: 3 }, controls: [],
      intro: T(
        'Metti un chilo di ghiaccio in una pentola sul fuoco e guarda il termometro. Sale sempre? O si ferma? Prima indovina, poi guarda.',
        'Un chilo di ghiaccio a −20 °C, in pentola, su un fuoco che dà 2000 joule al secondo. Il calore entra sempre, senza sosta. Che cosa fa la temperatura? Prevedi, poi guarda.',
        'Un chilo di ghiaccio sul fuoco, che gli dà calore a ritmo costante. Ci si aspetta una temperatura che sale sempre. Prevedi, poi guarda il grafico.'),
      steps: [
        {
          kind: 'q', predict: [{ min: 3 }],
          text: T('Il ghiaccio arriva a 0 gradi e comincia a sciogliersi. Mentre si scioglie, il termometro…', 'Mentre il ghiaccio si scioglie, a fuoco acceso, la temperatura…', 'Ghiaccio che fonde, fuoco acceso: che cosa fa la temperatura?'),
          options: [T('resta fermo a 0 gradi', 'resta ferma a 0 °C', 'resta a 0 °C'), T('sale sempre, un grado alla volta', 'sale piano piano, ma sale', 'sale, ma più lentamente'), T('scende, perché il ghiaccio è freddo', 'scende sotto zero per un po’', 'sale come prima')],
          answer: 0,
          explain: T('Giusto: resta a 0 gradi finché c’è ghiaccio! Il calore serve a sciogliere.', 'Esatto: il calore non alza la temperatura, serve a staccare le particelle del ghiaccio.', 'Esatto: tutto il calore va a rompere i legami del ghiaccio, e la temperatura non si muove.'),
          solution: T('Resta a 0 gradi.', 'Resta a 0 °C.'),
        },
        {
          kind: 'q', predict: [{ min: 15 }],
          text: T('Ora l’acqua bolle. Se lasci il fuoco acceso, il termometro…', 'L’acqua bolle a fuoco acceso. La temperatura…', 'L’acqua bolle e il fuoco resta acceso: dove va il calore?'),
          options: [T('resta a 100 gradi', 'resta a 100 °C', 'a trasformare l’acqua in vapore'), T('sale a 200 gradi', 'continua a salire', 'a scaldare l’acqua sopra i 100 °C'), T('scende', 'scende un poco', 'si perde tutto nell’aria')],
          answer: 0,
          explain: T('Giusto: mentre bolle resta a 100 gradi. Il calore trasforma l’acqua in vapore.', 'Esatto: secondo gradino, a 100 °C. Il calore fa evaporare l’acqua.', 'Esatto: finché c’è acqua da far evaporare, la temperatura resta a 100 °C.'),
          solution: T('Resta a 100 gradi.', 'Resta a 100 °C.'),
        },
        {
          kind: 'q', predict: [{ min: 40 }],
          text: T('Che cosa dura di più: scaldare l’acqua da 0 a 100 gradi, o farla bollire via tutta?', 'Che cosa richiede più calore: scaldare 1 kg d’acqua da 0 a 100 °C, o farlo evaporare tutto?', 'Per far evaporare tutta l’acqua serve più calore che per scaldarla da 0 a 100 °C?'),
          options: [T('farla bollire via tutta', 'farlo evaporare tutto, più di 5 volte tanto', 'sì, cinque volte tanto'), T('scaldarla da 0 a 100', 'scaldarlo da 0 a 100 °C', 'no, molto meno: l’acqua è già calda'), T('durano uguale, più o meno', 'la stessa quantità', 'no, è lo stesso calore di prima')],
          answer: 0,
          explain: T('Giusto: per farla bollire via tutta ci vuole più di 5 volte il tempo!', 'Esatto: 2260 kJ contro 419 kJ, più di cinque volte.', 'Esatto: 2260 kJ per farla evaporare, 419 per scaldarla. Staccare le molecole costa caro.'),
          solution: T('Farla bollire via tutta.', 'Farlo evaporare tutto.'),
        },
        {
          kind: 'q',
          text: T('Allora, mentre cambia stato, la temperatura…', 'Che cosa fa il calore durante un passaggio di stato?', 'Perché il grafico ha due gradini piatti?'),
          options: [T('resta ferma', 'cambia lo stato, non la temperatura', 'a 0 e a 100 °C il calore serve a cambiare stato'), T('sale di più', 'alza la temperatura più in fretta', 'il fuoco si abbassa due volte'), T('va su e giù', 'niente: si perde tutto nell’aria intorno', 'il termometro si inceppa due volte, a 0 e a 100 °C')],
          answer: 0,
          explain: T('Giusto: mentre si scioglie o bolle, la temperatura sta ferma.', 'Esatto: durante il passaggio di stato il calore cambia lo stato, e la temperatura aspetta.', 'Esatto: nei gradini il calore va nei legami fra le molecole, non nella loro agitazione.'),
        },
      ],
      hints: [T('Guarda il grafico: ha due gradini.', 'Nei passaggi di stato la temperatura resta ferma.', 'Nei gradini il calore cambia lo stato, non la temperatura.')],
    },
    {
      id: 't02-3', kind: 'lezione', title: 'Il calore latente',
      sim: 'phase', params: { mode: 'curva', P: 2, min: 5 }, controls: ['min'],
      intro: T(
        'Per sciogliere il ghiaccio e per far bollire l’acqua serve tanto calore, anche se il termometro resta fermo. È un calore nascosto: si chiama <b>calore latente</b>. Prova a spegnere il fuoco dopo minuti diversi.',
        'Il calore che serve per cambiare stato si chiama <b>calore latente</b>: per fondere 1 kg di ghiaccio servono 334 kJ, per far evaporare 1 kg d’acqua 2260 kJ. In generale Q = m·L. Durante il cambiamento la temperatura resta ferma.',
        'Latente vuol dire nascosto: è il calore che entra senza far salire il termometro, perché va a staccare le molecole una dall’altra. Per far evaporare l’acqua ne serve tantissimo, più di cinque volte quello che basta a portarla da 0 a 100 °C. [[Q = m · L]]'),
      steps: [
        {
          kind: 'free', runs: 3, distinct: true,
          text: T('Spegni il fuoco dopo minuti diversi.', 'Prova tempi diversi e guarda in che stato è l’acqua.'),
        },
        {
          kind: 'q',
          text: T('Dopo 2 minuti di fuoco, nella pentola c’è…', 'Dopo 2 minuti a 2 kW, nella pentola c’è…', 'Perché il ghiaccio tiene fresca una bibita così a lungo?'),
          options: [T('ghiaccio e acqua, a 0 gradi', 'ghiaccio che fonde, a 0 °C', 'fondendo assorbe calore'), T('solo acqua calda, a 50 gradi', 'tutta acqua liquida, già a 50 °C', 'è più freddo di quanto sembri'), T('solo vapore che esce dalla pentola', 'ancora solo ghiaccio, a −20 °C', 'il ghiaccio respinge il calore')],
          answer: 0,
          explain: T('Giusto: il ghiaccio si sta sciogliendo, e tutto resta a 0 gradi.', 'Esatto: 240 kJ bastano a scaldare il ghiaccio fino a 0 °C, non a scioglierlo tutto.', 'Esatto: finché c’è ghiaccio, la bibita resta vicina a 0 °C.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il calore per fondere.'),
          vals: { m: [[2, 3], [0.5, 5]] }, calc: 'm * 334', unit: 'kJ', tol: 2,
          ask: T(null, 'Quanta energia serve per fondere <b>{m} kg</b> di ghiaccio a 0 °C? (Q = m·L, L = 334 kJ/kg)', 'Quanti kilojoule servono per sciogliere <b>{m} kg</b> di ghiaccio a 0 °C? [[Q = m · L, L di fusione = 334 kJ/kg]]'),
          explain: T(null, 'Esatto: {m} × 334 = {ans:0} kJ.', 'Esatto: {ans:0} kJ, e il termometro non si è mosso.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché un cubetto di ghiaccio rinfresca tanto la bibita?'),
          options: [T('sciogliendosi si prende tanto calore'), T('è fatto di un’acqua speciale'), T('spinge via il caldo con il freddo')],
          answer: 0,
          explain: T('Giusto: per sciogliersi il ghiaccio vuole tanto calore, e lo prende dalla bibita.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Perché una scottatura col vapore a 100 °C è peggio di una con l’acqua a 100 °C?', 'D’inverno i contadini spruzzano acqua sulle piante per difenderle dal gelo. Perché funziona?'),
          options: [T(null, 'il vapore, condensandosi sulla pelle, le cede anche il calore latente', 'l’acqua, gelando, cede calore latente alle piante'), T(null, 'il vapore è più caldo dell’acqua', 'il ghiaccio è un ottimo conduttore'), T(null, 'il vapore entra più in profondità', 'l’acqua scioglie la brina')],
          answer: 0,
          explain: T(null, 'Esatto: ogni grammo di vapore che torna liquido sulla pelle le dà 2260 J in più.', 'Esatto: finché l’acqua gela, resta a 0 °C e cede calore: le piante non scendono sotto zero.'),
        },
      ],
      hints: [T('Nei gradini il calore scioglie o fa bollire.', 'Q = m·L: L = 334 kJ/kg per fondere, 2260 per evaporare.', 'Calore latente: entra, ma il termometro non si muove.')],
      solution: T(
        'Il calore serve a sciogliere e a far bollire, anche se il termometro sta fermo.',
        'Q = m·L: 334 kJ per fondere 1 kg di ghiaccio.',
        'Il calore latente cambia lo stato senza cambiare la temperatura.'),
    },
    {
      id: 't02-4', kind: 'costruisci', title: 'Il chiosco delle granite',
      sim: 'phase', params: { mode: 'bibita', d: 1, g: 100 }, controls: ['g'],
      intro: T(
        'Nel parco apre il chiosco delle granite! La limonata esce a 30 gradi, ma va servita a 10. Quanto ghiaccio ci metti? Ogni grammo di ghiaccio, sciogliendosi, si porta via un bel po’ di calore.',
        'Costruisci il chiosco delle granite: la limonata è a 30 °C e va servita a 10 °C, con ghiaccio a 0 °C. Il ghiaccio prende calore due volte: per fondere (334 J ogni grammo) e poi, ormai acqua, per scaldarsi da 0 a 10 °C. Il calore glielo dà la limonata.',
        'Il chiosco delle granite raffredda la limonata da 30 a 10 °C con il ghiaccio. Il grosso del lavoro lo fa il calore latente: un grammo di ghiaccio che fonde assorbe quanto un grammo d’acqua che si scalda di 80 gradi. [[m₁ · (334 + 4,2 · 10) = m₂ · 4,2 · 20]]'),
      piece: { id: 'granite', name: 'Il chiosco delle granite', desc: 'Limonata con il ghiaccio: sciogliendosi, il ghiaccio si prende il calore e la porta a 10 °C.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto ghiaccio mettere, poi lancia.', 'Regola i grammi di ghiaccio, poi lancia: arrivi a 10 °C?'),
          vals: { e: { d: [[1], [2]] }, s: { d: [[0.5, 1.5], [2]] } },
          set: { d: 'd' },
          ask: T(
            'Hai <b>{d} litri</b> di limonata a 30 gradi. Quanti grammi di ghiaccio servono per portarla a 10 gradi?',
            '<b>{d} L</b> di limonata a 30 °C: quanti grammi di ghiaccio a 0 °C servono per arrivare a 10 °C?',
            'Per <b>{d} litri</b> di limonata, quanto ghiaccio serve per scendere da 30 a 10 °C?'),
          measure: 'g', goal: '222.75 * d', tol: 10,
          ok: T('Limonata perfetta: 10 gradi!', 'Esatto: 10 °C!'),
          high: T('Troppo ghiaccio: la limonata è gelata. Mettine meno.', 'Troppo ghiaccio: sotto i 10 °C. Riducilo.'),
          low: T('Troppo poco ghiaccio: la limonata è ancora tiepida. Mettine di più!', 'Troppo poco ghiaccio: sopra i 10 °C. Aumentalo.'),
          solve: { g: '220 * d' },
        },
        {
          kind: 'q',
          text: T('Perché il ghiaccio rinfresca più dell’acqua fredda a 0 gradi?', '100 g di ghiaccio a 0 °C o 100 g d’acqua a 0 °C: chi raffredda di più la bibita?', 'Un grammo di ghiaccio che fonde assorbe 334 J. Di quanto scalderebbero un grammo d’acqua?'),
          options: [T('sciogliendosi si prende altro calore', 'il ghiaccio, molte volte di più', 'di circa 80 °C'), T('è più freddo dell’acqua a 0 gradi', 'l’acqua', 'di circa 1 °C'), T('galleggia e resta sopra', 'uguale: sono tutti e due a 0 °C', 'di circa 8 °C')],
          answer: 0,
          explain: T('Giusto: il ghiaccio prima si scioglie, e per farlo si prende tanto calore.', 'Esatto: il ghiaccio assorbe 334 J per grammo solo per fondere, l’acqua a 0 °C no.', 'Esatto: 334 / 4,186 ≈ 80 gradi. Per questo il ghiaccio è così efficace.'),
        },
      ],
      hints: [T('Ogni litro di limonata vuole circa 220 grammi di ghiaccio.', 'Ogni litro cede 84 kJ; ogni grammo di ghiaccio ne prende 376 J.', 'Il ghiaccio prende 376 J per grammo: 334 per fondere, 42 per scaldarsi a 10 °C.')],
      solution: T('Circa 220 grammi di ghiaccio per ogni litro di limonata.', 'Circa 223 g per litro: per 1,5 L, 330 g.', 'Circa 220 grammi di ghiaccio per ogni litro.'),
    },
    {
      id: 't02-5', kind: 'lezione', title: 'Bollire in montagna',
      sim: 'phase', params: { mode: 'pentola', alt: 0, cooker: false }, controls: ['alt', 'cooker'],
      intro: T(
        'In alta montagna l’acqua bolle prima: a 70 o 80 gradi invece di 100! E la pasta non cuoce bene. Porta la pentola su e giù per la montagna, e prova la pentola a pressione.',
        'L’acqua bolle quando le sue molecole riescono a vincere la pressione dell’aria sopra di lei. In montagna l’aria preme meno e l’acqua bolle prima: sull’Everest a circa 72 °C. Nella <b>pentola a pressione</b> il vapore resta chiuso, la pressione sale e l’acqua bolle a 120 °C: si cuoce più in fretta.',
        'Il <b>punto di ebollizione</b> non è una costante dell’acqua: dipende dalla pressione. In quota l’aria preme meno, l’acqua bolle sotto i 100 °C e la pasta resta cruda; la pentola a pressione fa il contrario, chiude il vapore e porta l’ebollizione a 120 °C.'),
      steps: [
        {
          kind: 'free',
          text: T('Porta la pentola in montagna, poi prova la pentola a pressione.', 'Prova quote diverse, con e senza pentola a pressione.'),
          need: [
            { when: 'alt >= 4000', try: { alt: 5000 }, msg: T('Sali in alto: almeno 4000 metri.', 'Manca una prova sopra i 4000 m.') },
            { when: 'cooker', try: { cooker: true }, msg: T('Ora prova la pentola a pressione.', 'Manca una prova con la pentola a pressione.') },
          ],
        },
        {
          kind: 'q',
          text: T('In cima all’Everest, l’acqua bolle a…', 'Perché in montagna l’acqua bolle prima?', 'Perché in alta montagna la pasta resta cruda, anche se l’acqua bolle?'),
          options: [T('circa 72 gradi', 'l’aria preme meno sull’acqua', 'l’acqua bolle sotto i 100 °C'), T('100 gradi, come sempre', 'in montagna fa più freddo', 'manca l’ossigeno per cuocere bene'), T('circa 150 gradi', 'l’acqua di montagna è più pura', 'la pasta di montagna è più dura')],
          answer: 0,
          explain: T('Giusto: sull’Everest bolle a circa 72 gradi. Troppo poco per la pasta!', 'Esatto: meno pressione, e le molecole scappano prima.', 'Esatto: a 85 °C la pasta cuoce molto più lentamente che a 100 °C.'),
        },
        {
          kind: 'q',
          text: T('Nella pentola a pressione l’acqua bolle a…', 'Perché la pentola a pressione cuoce più in fretta?', 'Che cosa fa la valvola della pentola a pressione?'),
          options: [T('circa 120 gradi', 'la pressione alta fa bollire l’acqua a 120 °C', 'tiene la pressione intorno a 2 bar, non di più'), T('50 gradi', 'il vapore cuoce più dell’acqua', 'fa entrare l’aria fresca'), T('100 gradi', 'il coperchio tiene la luce dentro', 'fischia per avvisare che la pasta è pronta da scolare')],
          answer: 0,
          explain: T('Giusto: circa 120 gradi, e la pasta cuoce prima.', 'Esatto: venti gradi in più fanno cuocere molto più in fretta.', 'Esatto: lascia uscire il vapore quando la pressione arriva al punto giusto.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'A 3000 m l’aria preme circa 0,7 bar. L’acqua bolle…', 'Una siringa piena d’acqua tiepida, chiusa: tirando lo stantuffo, l’acqua bolle. Perché?'),
          options: [T(null, 'sotto i 100 °C, verso i 90', 'la pressione cala, e con lei il punto di ebollizione'), T(null, 'sopra i 100 °C, perché fa più freddo', 'tirare lo stantuffo la scalda'), T(null, 'esattamente a 100 °C, come al mare', 'dall’ago entra aria calda')],
          answer: 0,
          explain: T(null, 'Esatto: a 3000 m l’acqua bolle intorno ai 90 °C.', 'Esatto: abbassando la pressione l’acqua bolle anche a temperatura ambiente.'),
        },
      ],
      hints: [T('Più in alto, meno pressione: bolle prima.', 'Pressione bassa, ebollizione sotto i 100 °C; alta, sopra.', 'Il punto di ebollizione sale e scende con la pressione.')],
      solution: T(
        'In montagna l’acqua bolle sotto i 100 gradi; nella pentola a pressione sopra.',
        'Sull’Everest bolle a 72 °C; in pentola a pressione a 120 °C.',
        'L’acqua bolle prima dove la pressione è più bassa.'),
    },
    {
      id: 't02-6', kind: 'lezione', title: 'Il fresco del sudore',
      sim: 'phase', params: { mode: 'sudore', hum: 40, wind: false }, controls: ['hum', 'wind'],
      intro: T(
        'Perché sudiamo quando fa caldo? Il sudore, asciugandosi, si porta via il caldo della pelle. Guarda due termometri: uno asciutto e uno con una pezza bagnata. Prova con l’aria secca, con l’aria umida e con il vento.',
        'Per evaporare l’acqua ha bisogno di calore latente, e lo prende da quello che tocca: la pelle, il bulbo del termometro. Per questo l’<b>evaporazione</b> raffredda. Più l’aria è secca e c’è vento, più l’acqua evapora in fretta e più fresco fa.',
        'Il sudore è il condizionatore del corpo: ogni grammo che evapora porta via dalla pelle circa 2400 joule. Funziona benissimo nell’aria secca e quasi per niente in quella umida, dove l’acqua fatica a evaporare: per questo l’afa è peggio del caldo secco.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova l’aria secca, l’aria umida e il vento.', 'Prova umidità diverse, con e senza vento.'),
          need: [
            { when: 'hum <= 30', try: { hum: 20 }, msg: T('Prova l’aria secca: 30% o meno.', 'Manca una prova con l’umidità al 30% o meno.') },
            { when: 'hum >= 90', try: { hum: 100 }, msg: T('Ora l’aria umidissima: 90% o più.', 'Manca una prova con l’umidità al 90% o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Quando il termometro bagnato scende di più?', 'Perché il termometro bagnato segna meno di quello asciutto?', 'Perché d’estate l’afa, con l’aria umida, è più faticosa del caldo secco?'),
          options: [T('con l’aria secca e il vento', 'l’acqua che evapora gli porta via calore', 'il sudore non evapora'), T('con l’aria umida, piena di vapore', 'l’acqua è più fredda dell’aria', 'l’aria umida è sempre più calda'), T('quando non c’è nemmeno un filo di vento', 'la pezza fa ombra al termometro', 'l’umidità pesa sulla pelle')],
          answer: 0,
          explain: T('Giusto: aria secca e vento fanno evaporare l’acqua in fretta.', 'Esatto: per evaporare l’acqua prende calore dal bulbo.', 'Esatto: quando il sudore non riesce a evaporare, resta sulla pelle e non porta via niente.'),
        },
        {
          kind: 'q',
          text: T('Esci dalla piscina e c’è vento. Senti…', 'Perché d’estate i cani ansimano con la lingua fuori?', 'Le borracce di tela bagnata tengono fresca l’acqua nel deserto. Perché?'),
          options: [T('freddo', 'l’acqua sulla lingua evapora e li rinfresca', 'l’acqua che evapora dalla tela porta via calore'), T('caldo', 'cercano aria più fresca da respirare', 'la tela riflette quasi tutta la luce del sole del deserto'), T('niente di diverso', 'così si riposano dalla corsa', 'la tela bagnata è un ottimo isolante')],
          answer: 0,
          explain: T('Giusto: l’acqua sulla pelle evapora e si porta via il tuo caldo.', 'Esatto: i cani sudano pochissimo, e usano la lingua.', 'Esatto: la tela si bagna, l’acqua evapora e raffredda quella dentro.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Con l’aria al 100% di umidità, il termometro bagnato…', 'Perché soffiando sul brodo bollente si raffredda prima?'),
          options: [T(null, 'segna 30 °C anche lui', 'il soffio porta via il vapore e fa evaporare di più'), T(null, 'scende di 14 gradi, come con il vento', 'il fiato è più freddo del brodo'), T(null, 'sale sopra i 30 °C, perché l’acqua è calda', 'il soffio spinge il calore in fondo')],
          answer: 0,
          explain: T(null, 'Esatto: l’aria è piena di vapore, e l’acqua non riesce più a evaporare.', 'Esatto: è il vento sul termometro bagnato, in piccolo.'),
        },
      ],
      hints: [T('L’acqua che evapora si porta via il caldo.', 'Evaporare costa calore latente: lo prende da quello che tocca.', 'Più evaporazione, più fresco: aria secca e vento aiutano.')],
      solution: T(
        'Il bagnato si raffredda: l’acqua evaporando porta via il caldo.',
        'L’evaporazione assorbe calore latente, e raffredda.',
        'Il sudore rinfresca evaporando; nell’aria umida evapora poco.'),
    },
    {
      id: 't02-7', kind: 'ripasso', title: 'Ripasso degli stati della materia',
      intro: T('Ripassiamo: ghiaccio, acqua e vapore!', 'Ripasso: stati, passaggi di stato e calore latente.', 'Ripasso: dai gradini del grafico al fresco del sudore.'),
      steps: [
        {
          kind: 'q',
          text: T('Che cosa succede al burro in padella?', 'Come si chiama il passaggio da gas a liquido?', 'Perché d’inverno gli occhiali si appannano entrando in casa?'),
          options: [T('si scioglie: diventa liquido', 'condensazione', 'il vapore si condensa'), T('diventa subito vapore', 'solidificazione', 'le lenti si scaldano e sudano'), T('diventa più duro, come una crosta', 'vaporizzazione', 'la luce della casa le rende opache')],
          answer: 0,
          explain: T('Giusto: il caldo lo fa fondere.', 'Esatto: il contrario dell’evaporazione.', 'Esatto: il vetro freddo raffredda il vapore, che torna goccioline.'),
        },
        {
          kind: 'q',
          text: T('L’acqua bolle sul fuoco. Il termometro segna…', 'Mentre il ghiaccio fonde, a fuoco acceso, la temperatura…', 'Perché sul grafico del riscaldamento compaiono tratti piatti?'),
          options: [T('100 gradi', 'resta a 0 °C', 'il calore cambia lo stato, non la temperatura'), T('150 gradi', 'sale piano piano', 'il fuoco ogni tanto si spegne'), T('0 gradi', 'scende sotto zero', 'il termometro è lento a rispondere')],
          answer: 0,
          explain: T('Giusto: finché bolle, 100 gradi.', 'Esatto: finché c’è ghiaccio, 0 °C.', 'Esatto: nei tratti piatti lavora il calore latente.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il calore per evaporare.'),
          vals: { m: [0.5, 1, 2] }, calc: 'm * 2260', unit: 'kJ', tol: 5,
          ask: T(null, 'Quanta energia serve per far evaporare <b>{m} kg</b> d’acqua a 100 °C? (L = 2260 kJ/kg)', 'Quanti kilojoule servono per far evaporare <b>{m} kg</b> d’acqua già a 100 °C? [[Q = m · L, L = 2260 kJ/kg]]'),
          explain: T(null, 'Esatto: {m} × 2260 = {ans:0} kJ.', 'Esatto: {ans:0} kJ.'),
        },
        {
          kind: 'q',
          text: T('In alta montagna, l’acqua bolle…', 'La pentola a pressione fa bollire l’acqua…', 'Che cosa decide a quale temperatura bolle l’acqua?'),
          options: [T('prima dei 100 gradi', 'sopra i 100 °C', 'la pressione sopra di lei'), T('dopo i 100 gradi', 'sotto i 100 °C', 'quanto è forte il fuoco'), T('a 100 gradi, come sempre', 'a 100 °C, ma più in fretta', 'quanta acqua c’è nella pentola')],
          answer: 0,
          explain: T('Giusto: lassù l’aria preme meno.', 'Esatto: a circa 120 °C.', 'Esatto: meno pressione, ebollizione più bassa; più pressione, più alta.'),
        },
        {
          kind: 'q',
          text: T('Perché il sudore ci rinfresca?', 'Perché esci dalla doccia e senti freddo, anche in una stanza calda?', 'Perché un cubetto di ghiaccio rinfresca molto più della stessa acqua a 0 °C?'),
          options: [T('evaporando porta via il caldo', 'l’acqua sulla pelle evapora e porta via calore', 'fondendo assorbe il calore latente'), T('è freddo quando esce', 'l’acqua della doccia era fredda', 'il ghiaccio è più denso dell’acqua'), T('chiude i pori della pelle', 'la pelle bagnata conduce il freddo', 'il ghiaccio si scioglie lentamente')],
          answer: 0,
          explain: T('Giusto: per evaporare il sudore si prende il caldo della pelle.', 'Esatto: è il termometro bagnato, ma sei tu.', 'Esatto: 334 J per grammo solo per fondere.'),
        },
      ],
    },
    {
      id: 't02-8', kind: 'boss', title: 'Il mito del fuoco alto',
      sim: 'phase', params: { mode: 'curva', P: 1, min: 15 }, controls: ['P'],
      intro: T(
        'Sono Vetrino. Il cuoco del rifugio dice: <i>“Se alzo il fuoco al massimo, l’acqua bolle più calda e la pasta cuoce prima!”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito, molto diffuso in cucina: <i>“con il fuoco al massimo l’acqua che bolle è più calda, e la pasta cuoce prima”</i>. Il fuoco alto dà più calore, questo è vero. Ma dove va a finire?',
        'Sono Vetrino. In cucina si sente spesso: <i>“alza il fuoco, così l’acqua bolle più forte e la pasta cuoce prima”</i>. Più calore entra, più deve salire la temperatura: sembra logico. Mettiamolo alla prova con il termometro.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa cambi fra una prova e l’altra?', 'Per mettere alla prova il mito, che cosa cambi, e che cosa tieni uguale?', 'Come si prova onestamente il mito?'),
          options: [T('solo il fuoco', 'cambio il fuoco, tengo uguali acqua e tempo', 'stessa acqua e stesso tempo, cambiando solo il fuoco'), T('il fuoco e l’acqua insieme', 'cambio fuoco e quantità d’acqua insieme', 'si guarda soltanto il fuoco più alto, che è quello del mito'), T('niente: basta una prova', 'cambio solo il tempo', 'si cambia tutto, per fare prima')],
          answer: 0,
          explain: T('Giusto: una cosa alla volta.', 'Esatto: se cambi solo il fuoco, sai che cosa fa il fuoco.', 'Esatto: una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova il fuoco al minimo e al massimo, per 15 minuti.', 'Prova il fuoco al minimo e al massimo: guarda il termometro e il grafico.'),
          need: [
            { when: 'P <= 1', try: { P: 1 }, msg: T('Prova il fuoco al minimo.', 'Manca una prova con il fuoco a 1 kW.') },
            { when: 'P >= 3', try: { P: 3 }, msg: T('Ora il fuoco al massimo.', 'Manca una prova con il fuoco a 3 kW.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con il fuoco al massimo, l’acqua che bolle è…', 'Che temperatura ha l’acqua che bolle, con il fuoco alto e con quello basso?', 'Allora dove va il calore in più del fuoco alto?'),
          options: [T('sempre a 100 gradi', '100 °C in tutti e due i casi', 'a far evaporare più acqua, più in fretta'), T('più calda di 100 gradi', 'più alta con il fuoco alto, verso i 110 °C', 'a scaldare l’acqua sopra i 100 °C'), T('più fredda', 'più alta con il fuoco basso, che scalda piano', 'a cuocere la pasta più in fretta')],
          answer: 0,
          explain: T('Giusto: 100 gradi, con il fuoco basso e con quello alto.', 'Esatto: lo stesso gradino a 100 °C. Con il fuoco alto finisce solo l’acqua più in fretta.', 'Esatto: diventa calore latente, e l’acqua se ne va in vapore.'),
        },
        {
          kind: 'q',
          text: T('Il fuoco alto serve a…', 'Allora, quando conviene il fuoco alto?', 'Una volta che l’acqua bolle, che cosa fa davvero risparmiare?'),
          options: [T('far bollire prima l’acqua', 'per arrivare prima all’ebollizione', 'abbassare il fuoco: tanto resta a 100 °C'), T('cuocere la pasta più in fretta', 'per cuocere la pasta più in fretta', 'tenere il fuoco al massimo, così non smette di bollire'), T('scaldare l’acqua sopra i 100 gradi', 'sempre: scalda di più', 'togliere il coperchio')],
          answer: 0,
          explain: T('Giusto: con il fuoco alto si arriva prima a 100 gradi. Poi non serve più.', 'Esatto: dopo, per cuocere, basta tenere l’acqua che bolle.', 'Esatto: a ebollizione basta un fuoco che la tenga a 100 °C. Il coperchio, poi, aiuta ancora.'),
        },
        {
          kind: 'q', review: false,
          text: T('Il mito dice: «fuoco alto, acqua più calda». È vero?', 'Che cosa concludi sul mito del fuoco alto?', 'Il mito del fuoco alto: che cosa ne pensi, dopo la prova?'),
          options: [T('no: bolle sempre a 100 gradi', 'falso: bolle a 100 °C con qualsiasi fuoco', 'falso: il calore in più fa evaporare l’acqua, non la scalda'), T('sì, è più calda', 'vero: il fuoco alto scalda di più', 'vero: più calore, più temperatura'), T('sì, ma solo un po’', 'vero solo per la pasta', 'vero, ma solo in montagna')],
          answer: 0,
          explain: T('Mito smontato! L’acqua bolle sempre a 100 gradi: il fuoco alto la fa solo evaporare più in fretta.', 'Mito smontato: durante l’ebollizione la temperatura resta a 100 °C. Il calore in più diventa vapore, e la pasta cuoce nello stesso tempo.', 'Mito smontato: nel passaggio di stato il calore diventa tutto calore latente. Il fuoco alto, a ebollizione, spreca gas e fa evaporare l’acqua.'),
        },
      ],
      hints: [T('Guarda il termometro con i due fuochi.', 'Confronta la temperatura di ebollizione con 1 e con 3 kW.', 'A ebollizione il calore cambia lo stato, non la temperatura.')],
      solution: T(
        'L’acqua bolle a 100 gradi con qualsiasi fuoco.',
        'Con 1 o 3 kW bolle a 100 °C: il mito è falso.',
        'A ebollizione il calore diventa vapore: il mito è falso.'),
    },
  ],
};
