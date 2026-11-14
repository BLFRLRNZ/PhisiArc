// M05 · Il moto circolare. Simulazione: la giostra vista dall'alto.
import { T, pick } from '../util.js';
import { t as tr } from '../i18n.js';

const GIRO = { label: 'Durata di un giro', min: 2, max: 15, step: 0.1, unit: 's' };

export default {
  id: 'M05',
  title: 'Il moto circolare',
  levels: [
    {
      id: 'm05-1', kind: 'lezione', title: 'La giostra che gira',
      sim: 'circle', params: { r: 6, T: 6, release: false }, controls: ['r', 'T'], labels: { T: GIRO },
      intro: T(
        'Guardiamo la <b>giostra</b> dall’alto! Il seggiolino gira sempre in tondo. La freccia arancione mostra dove sta andando in ogni momento.',
        'Un oggetto che gira in cerchio con velocità di intensità costante fa un <b>moto circolare uniforme</b>. Il tempo di un giro si chiama <b>periodo</b>, come per il pendolo.',
        'Moto circolare uniforme: raggio r, periodo T. Osserva la freccia della velocità mentre il seggiolino gira.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai girare la giostra.', 'Fai girare la giostra e osserva le due frecce.') },
        {
          kind: 'q',
          text: T('Guardi la giostra dall’alto: il seggiolino gira e gira. La freccia arancione mostra in che direzione sta andando il seggiolino in ogni momento. Guardala bene mentre gira: verso dove punta?', 'La freccia arancione è la velocità del seggiolino: mostra dove andrebbe in quell’istante. Confrontala con il braccio della giostra, che va dal centro al seggiolino. Come è diretta la velocità?', 'Nel moto circolare il vettore velocità mostra la direzione del moto in ogni istante. Confrontalo con il raggio, cioè il braccio della giostra. Che direzione ha?'),
          options: [
            T('Di lato, sfiorando il cerchio', 'Tangente al cerchio', 'Tangente alla traiettoria'),
            T('Verso il centro', 'Verso il centro', 'Radiale, verso il centro'),
            T('Verso fuori', 'Verso l’esterno', 'Radiale, verso l’esterno'),
          ],
          answer: 0,
          explain: T(
            'Giusto: punta “di lato”, sfiorando il cerchio. Si dice <b>tangente</b>.',
            'Giusto: la velocità è sempre <b>tangente</b> al cerchio, perpendicolare al braccio.',
            'Giusto: tangente, perpendicolare al raggio in ogni istante.'),
        },
        {
          kind: 'q',
          text: T('La giostra gira sempre allo stesso modo, né più forte né più piano, e la freccia arancione è sempre lunga uguale. Ma guarda dove punta in due momenti diversi del giro. La freccia cambia?', 'Un vettore ha un’intensità (quanto è lungo) e una direzione (dove punta). Il seggiolino va sempre alla stessa velocità in intensità, ma intanto gira. Il vettore velocità è costante?', 'Nel moto circolare uniforme |v| è costante, ma la direzione della velocità segue il cerchio. Un vettore è costante solo se non cambiano né intensità né direzione. Allora il vettore velocità è costante?'),
          options: [
            T('Sì: cambia direzione, anche se è sempre lunga uguale', 'No: l’intensità resta uguale ma la direzione cambia', 'No: cambia la direzione, quindi il vettore cambia'),
            T('No, è sempre uguale', 'Sì, è costante', 'Sì, è costante'),
          ],
          answer: 0,
          explain: T(
            'Giusto! È lunga sempre uguale, ma gira insieme alla giostra.',
            'Giusto: cambia direzione in ogni istante. E se la velocità cambia, c’è un’<b>accelerazione</b>: è la freccia verde.',
            'Giusto: un vettore che cambia direzione non è costante, quindi c’è accelerazione anche a |v| costante.'),
        },
      ],
      hints: [T('Guarda bene la freccia arancione mentre il seggiolino gira.', 'Confronta la freccia in due momenti diversi del giro.')],
      solution: T('La freccia sfiora il cerchio e gira con la giostra.', 'La velocità è tangente e cambia direzione: il moto è accelerato.'),
    },
    {
      id: 'm05-2', kind: 'lezione', title: 'Verso il centro',
      sim: 'circle', params: { r: 6, T: 6, release: false }, controls: ['r', 'T'], labels: { T: GIRO },
      intro: T(
        'C’è un’altra freccia, verde. È l’<b>accelerazione</b>: mostra da che parte la giostra tira il seggiolino.',
        'La freccia verde è l’<b>accelerazione centripeta</b>: “centripeta” vuol dire “che va verso il centro”. Vale a = v²/r.',
        'L’accelerazione centripeta: a = v²/r = 4π²r/T². È lei a curvare continuamente la traiettoria.'),
      steps: [
        { kind: 'free', runs: 2, text: T('Prova una giostra <b>lenta</b> e una <b>veloce</b>.', 'Prova un giro lento e uno veloce: guarda la freccia verde.') },
        {
          kind: 'q',
          text: T('C’è una seconda freccia, quella verde: mostra da che parte la giostra tira il seggiolino per farlo girare in tondo. Guardala mentre la giostra gira, piano o forte. Dove punta?', 'La freccia verde è l’accelerazione del seggiolino: mostra come sta cambiando la sua velocità. Visto che la velocità gira insieme alla giostra, l’accelerazione deve «piegarla» in continuazione. Dove punta?'),
          options: [T('Sempre verso il centro', 'Sempre verso il centro'), T('Avanti, come la velocità', 'Nella direzione della velocità'), T('Verso fuori', 'Verso l’esterno')],
          answer: 0,
          explain: T(
            'Giusto: verso il centro. È il braccio della giostra che tira il seggiolino e lo fa curvare.',
            'Giusto: è l’accelerazione <b>centripeta</b>. Senza qualcosa che tira verso il centro (il braccio, una corda, la gravità), l’oggetto andrebbe dritto.',
            'Giusto: centripeta, a = v²/r. Serve una forza verso il centro che la produca.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Calcola la velocità del seggiolino.', 'Calcola la velocità.'),
          gen: (lens) => {
            if (lens === 'e') {
              const c = pick([24, 30, 36]), t = pick([4, 6]);
              return { text: tr('In un giro completo il seggiolino percorre tutto il cerchio, lungo <b>{c} metri</b>, e ci mette <b>{t} secondi</b>. Come per le macchinine, la velocità è la strada divisa per il tempo. Quanti metri fa ogni secondo?', { c, t }), ans: c / t, tol: 0.01, unit: 'm/s', explain: tr('Giusto: {c} diviso {t} fa {v:1}.', { c, t, v: c / t }) };
            }
            const r = pick([3, 4, 5, 6]), t = pick([4, 5, 6, 8]), v = (2 * Math.PI * r) / t;
            return { text: tr('Il seggiolino gira a <b>{r} m</b> dal centro e fa un giro in <b>{t} s</b>. In un giro percorre la circonferenza, 2π volte il raggio. Qual è la sua velocità?', { r, t }), ans: Math.round(v * 100) / 100, tol: 0.06, unit: 'm/s', explain: tr('Esatto: v = 2πr / T = 2π × {r} / {t} ≈ {v} m/s.', { r, t, v }) };
          },
        },
      ],
      hints: [T('La freccia verde punta sempre verso lo stesso punto della giostra.', 'In un giro il seggiolino percorre la circonferenza, 2πr.')],
      solution: T('Verso il centro della giostra.', 'Verso il centro; v = 2πr/T.'),
    },
    {
      id: 'm05-3', kind: 'prevedi', title: 'Lascia la presa',
      sim: 'circle', params: { r: 6, T: 5, release: true }, controls: [],
      intro: T(
        'Immagina che il seggiolino si sganci proprio mentre è in cima al giro. Dove andrà? Indovina prima di guardare!',
        'Il seggiolino si stacca in cima al giro: da quel momento nessuno lo tira più verso il centro. Che traiettoria segue?',
        'All’istante in cima il vincolo si rompe: nessuna forza centripeta. Che traiettoria segue il seggiolino (vista dall’alto)?'),
      steps: [
        {
          kind: 'q', predict: [{ release: true }],
          text: T('Immagina che il seggiolino si stacchi proprio quando è in cima al giro. Da quel momento niente lo tiene più legato alla giostra. Ricorda dove puntava la freccia arancione. Dove va il seggiolino?', 'Il seggiolino si sgancia in cima al giro: da quell’istante nessuno lo tira più verso il centro. Ricorda dove puntava la sua velocità in quel momento. Che traiettoria segue appena si stacca?'),
          options: [
            T('Dritto, nella direzione della freccia arancione', 'Una retta tangente al cerchio'),
            T('Dritto verso fuori, lontano dal centro', 'Una retta verso l’esterno, lungo il braccio'),
            T('Continua a girare in tondo', 'Continua sul cerchio'),
          ],
          answer: 0,
          explain: T(
            'Dritto, lungo la freccia arancione! Appena nessuno lo tira, va avanti in linea retta.',
            'Lungo la tangente: senza accelerazione centripeta la velocità non cambia più, e il moto diventa rettilineo uniforme.',
            'Lungo la tangente: senza forza, moto rettilineo uniforme (primo principio). Non c’è nessuna spinta radiale verso l’esterno.'),
        },
      ],
      hints: [T('Guarda dove punta la freccia arancione nel momento in cui si stacca.', 'Che cosa lo faceva curvare? E se manca?')],
      solution: T('Va dritto lungo la freccia arancione.', 'Lungo la tangente, in linea retta.'),
    },
    {
      id: 'm05-4', kind: 'costruisci', title: 'La giostra a catene',
      sim: 'circle', params: { r: 6, T: 8, release: false }, controls: ['T'], labels: { T: GIRO },
      intro: T(
        'Nuovo gioco per il parco: la <b>giostra a catene</b>! I seggiolini girano a <b>6 metri</b> dal centro. Scegli quanto dura un giro perché vadano alla velocità giusta.',
        'Nuovo pezzo del parco: la <b>giostra a catene</b>, raggio 6 m. Regola il periodo perché i seggiolini abbiano la velocità richiesta.',
        'Nuovo pezzo del parco: la <b>giostra a catene</b>, r = 6 m. Trova il periodo T per la velocità richiesta (v = 2πr/T).'),
      piece: { id: 'catene', name: 'La giostra a catene', desc: 'I seggiolini volano in tondo alla velocità che hai calcolato tu.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto dura un giro e falla partire.', 'Regola la durata del giro e lancia. La seconda prova chiederà un’altra velocità.'),
          vals: { v: [[3, 4, 5], [6, 7.5]] },
          ask: T('I seggiolini devono andare a <b>{v:1} m/s</b>.'),
          measure: 'v', goal: 'v', tol: { e: 0.35, s: 0.2 },
          ok: T('{got} m/s: si vola!'),
          high: T('{got} m/s: troppo veloce. Fai durare di più il giro.', '{got} m/s: troppo veloce. Il periodo va allungato.'),
          low: T('{got} m/s: troppo lento. Fai durare di meno il giro.', '{got} m/s: troppo lento. Il periodo va accorciato.'),
          solve: { T: '2 * Math.PI * 6 / v' },
        },
      ],
      hints: [
        T('Un giro più corto vuol dire più veloce.', 'v e T sono inversamente proporzionali, come nel laboratorio dei grafici.'),
        T('Un giro è lungo circa 38 metri. Dividi per la velocità.', 'T = 2πr / v = 37,7 / v.'),
      ],
      solution: T('Un giro è circa 38 m: 3 m/s → 12,6 s; 4 m/s → 9,4 s; 5 m/s → 7,5 s.', 'T = 37,7 m / v: 3 → 12,6 s; 4 → 9,4 s; 5 → 7,5 s; 6 → 6,3 s; 7,5 → 5,0 s.'),
    },
    {
      id: 'm05-5', kind: 'ripasso', title: 'Gran ripasso della Pista',
      intro: T('Ripassiamo tutta la Pista: velocità, accelerazione, frecce e giri!', 'Ripasso finale della cinematica.'),
      steps: [
        {
          kind: 'q',
          text: T('Sulla giostra il seggiolino gira sempre allo stesso ritmo, senza andare né più forte né più piano. Però intanto cambia continuamente direzione. Per la fisica, il seggiolino sta accelerando?', 'Nel moto circolare uniforme l’intensità della velocità è costante. Ma l’accelerazione misura ogni cambiamento del vettore velocità, anche solo di direzione. C’è accelerazione?'),
          options: [T('Sì, perché cambia direzione', 'Sì, perché la velocità cambia direzione'), T('No, va sempre uguale', 'No, |v| è costante'), T('Solo quando parte', 'Solo all’avvio')],
          answer: 0, explain: T('Giusto: cambiare direzione è già accelerare.', 'Giusto: accelerazione centripeta, a = v²/r.'),
        },
        {
          kind: 'q',
          text: T('Ricordi la barca sul fiume? Due frecce che formano un angolo retto si sommano mettendole punta contro coda, e la somma è la diagonale. Una freccia è lunga 3, l’altra 4. Quanto è lunga la freccia somma?', 'Due velocità perpendicolari, 3 m/s e 4 m/s, agiscono insieme, come barca e corrente. La velocità totale è la diagonale, e la si trova con Pitagora. Quanto vale?'),
          options: [T('5'), T('7'), T('1')], answer: 0, keepOrder: true,
          explain: T('Giusto: è il triangolo 3-4-5, come per la barca sul fiume.', 'Giusto: √(9 + 16) = 5 m/s.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.', 'Un calcolo veloce.'),
          gen: (lens) => {
            const a = pick([2, 3]), t = pick([5, 6]);
            return lens === 'e'
              ? { text: tr('Un kart parte da fermo e accelera sempre allo stesso modo: ogni secondo va <b>{a} m/s</b> più forte di prima. Quanto va veloce dopo <b>{t} secondi</b>?', { a, t }), ans: a * t, tol: 0, unit: 'm/s', explain: tr('Giusto: {t} × {a} = {v} m/s.', { a, t, v: a * t }) }
              : { text: tr('Un kart parte da fermo con accelerazione costante a = <b>{a} m/s²</b>, cioè guadagna {a} m/s ogni secondo. Che velocità ha dopo <b>{t} s</b>?', { a, t }), ans: a * t, tol: 0.01, unit: 'm/s', explain: tr('Esatto: v = a·t = {v} m/s.', { a, t, v: a * t }) };
          },
        },
        {
          kind: 'q',
          text: T('Dalla stessa altezza, nello stesso istante, una palla viene lanciata in avanti e un’altra viene lasciata cadere. Ripensa alla torre del Cannone. Le due palle…', 'Lancio orizzontale e caduta libera, dalla stessa altezza e nello stesso istante. Il moto orizzontale e quello verticale sono indipendenti. Chi tocca terra prima?'),
          options: [T('toccano terra insieme', 'insieme'), T('prima quella lanciata', 'quella lanciata'), T('prima quella lasciata cadere', 'quella lasciata cadere')],
          answer: 0, explain: T('Giusto: in verticale cadono uguali.', 'Giusto: il moto verticale è indipendente da quello orizzontale.'),
        },
      ],
      hints: [T('Ripensa alla giostra, alla barca e al cannone.')],
    },
    {
      id: 'm05-6', kind: 'boss', title: 'Il mito della forza centrifuga',
      sim: 'circle', params: { r: 6, T: 4, release: false }, controls: ['release'],
      intro: T(
        'Sono Vetrino. Sulla giostra ti senti spinto verso fuori. Un mio amico dice: <i>“C’è una forza che spinge fuori! Se ti stacchi, voli via dritto lontano dal centro”</i>. Sarà vero?',
        'Sono Vetrino. Un mito: <i>“Sulla giostra una forza ti spinge verso l’esterno; se il seggiolino si sgancia, schizza via lungo il braccio, lontano dal centro”</i>. Controlliamo.',
        'Sono Vetrino. Il mito: <i>“la forza centrifuga spinge il seggiolino verso l’esterno: se si sgancia, parte in direzione radiale”</i>. Verifichiamo.'),
      steps: [
        {
          kind: 'q',
          text: T('Il mito dice che sulla giostra una forza ti spinge verso l’esterno, e che se il seggiolino si stacca schizza via lontano dal centro. Prima di provare, ragiona come il mito: se fosse vero, dove andrebbe il seggiolino staccato?', 'Il mito parla di una «forza centrifuga» che spinge il seggiolino verso l’esterno, lungo il braccio. Se il seggiolino si sgancia, che cosa prevede il mito?'),
          options: [T('Dritto verso fuori, lungo il braccio', 'Via in direzione radiale, lungo il braccio'), T('Dritto lungo la freccia arancione', 'Lungo la tangente')],
          answer: 0, keepOrder: true,
          explain: T('Esatto, questo dice il mito. Ora metti <b>Lascia la presa: sì</b> e guarda cosa succede davvero.', 'Esatto. Ora attiva <b>Lascia la presa</b> e lancia.'),
        },
        { kind: 'free', runs: 1, text: T('Metti <b>Lascia la presa: sì</b> e lancia.', 'Attiva Lascia la presa e lancia.') },
        {
          kind: 'q',
          text: T('Hai visto il seggiolino staccarsi. La linea rosa tratteggiata mostra la strada che ha fatto. Confrontala con il braccio della giostra e con la freccia arancione. Dove è andato?', 'Guarda la linea rosa tratteggiata, la strada del seggiolino dopo lo sgancio, e confrontala con la direzione del braccio in quell’istante. Che traiettoria ha seguito?'),
          options: [T('Dritto lungo la freccia arancione, di lato', 'Lungo la tangente'), T('Dritto verso fuori, lungo il braccio', 'In direzione radiale')],
          answer: 0, keepOrder: true,
          wrong: T('Guarda la linea rosa tratteggiata: segue il braccio o la freccia arancione?', 'Confronta la linea rosa con la direzione del braccio nel momento del distacco.'),
          explain: T('Giusto: è andato dritto lungo la freccia arancione, non verso fuori.', 'Giusto: lungo la tangente, non lungo il braccio.'),
        },
        {
          kind: 'q',
          text: T('Il seggiolino staccato è andato dritto, non verso fuori. Eppure, quando sei sulla giostra, ti senti davvero spinto verso l’esterno. Come mai, se non c’è una forza che spinge fuori?', 'Nessuna forza ha spinto il seggiolino verso fuori: appena libero, è andato dritto. Allora che cosa «sentiamo» quando siamo sulla giostra e ci sembra di essere spinti verso l’esterno?', 'Per chi guarda da fuori, sul seggiolino agisce solo una forza verso il centro. Come si spiega allora la sensazione, per chi sta sulla giostra, di essere spinti fuori?'),
          options: [
            T('Il corpo vuole andare dritto, e la giostra lo costringe a girare', 'Il corpo tende ad andare dritto (inerzia); il sedile lo spinge verso il centro', 'Inerzia: il corpo tende al moto rettilineo, e il vincolo fornisce la forza centripeta'),
            T('C’è davvero una forza che spinge fuori', 'Una forza reale verso l’esterno', 'Una forza reale centrifuga'),
          ],
          answer: 0, keepOrder: true,
          explain: T(
            'Mito sfatato! Il tuo corpo vorrebbe andare dritto. È la giostra che ti tira verso il centro: per questo ti sembra di essere spinto fuori.',
            'Mito sfatato: nessuna forza spinge fuori. Il corpo tende ad andare dritto (<b>inerzia</b>), e il sedile lo tira verso il centro. Lo studierai bene nell’Officina, con Newton.',
            'Mito sfatato: per chi guarda da fuori c’è solo la forza centripeta. La “forza centrifuga” compare solo se descrivi il moto dal punto di vista di chi gira.'),
        },
      ],
      hints: [T('Guarda la linea rosa dopo il distacco.', 'Confronta la linea rosa con il braccio e con la freccia arancione.')],
      solution: T('Il seggiolino va dritto lungo la freccia arancione: nessuna forza lo spinge fuori.', 'Lungo la tangente: non esiste una forza reale verso l’esterno, solo l’inerzia.'),
    },
  ],
};
