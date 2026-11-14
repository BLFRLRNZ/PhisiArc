// M05 · Il moto circolare. Simulazione: la giostra vista dall'alto.
import { T, pick, num } from '../util.js';

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
          text: T('In che direzione punta la freccia arancione?', 'Come è diretta la velocità del seggiolino?', 'Che direzione ha il vettore velocità?'),
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
          text: T('La giostra gira sempre uguale. La freccia arancione cambia?', 'Il seggiolino va sempre alla stessa velocità (in intensità). Il vettore velocità è costante?', 'Con |v| costante, il vettore velocità è costante?'),
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
          text: T('Dove punta la freccia verde?', 'Dove punta l’accelerazione?'),
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
              return { text: `Un giro della giostra è lungo <b>${c} metri</b> e dura <b>${t} secondi</b>. Quanti metri fa il seggiolino ogni secondo?`, ans: c / t, tol: 0.01, unit: 'm/s', explain: `Giusto: ${c} diviso ${t} fa ${num(c / t, 1)}.` };
            }
            const r = pick([3, 4, 5, 6]), t = pick([4, 5, 6, 8]), v = (2 * Math.PI * r) / t;
            return { text: `Raggio <b>${r} m</b>, un giro in <b>${t} s</b>. Qual è la velocità del seggiolino?`, ans: Math.round(v * 100) / 100, tol: 0.06, unit: 'm/s', explain: `Esatto: v = 2πr / T = 2π × ${r} / ${t} ≈ ${num(v, 2)} m/s.` };
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
          text: T('Dove va il seggiolino?', 'Che traiettoria segue appena si stacca?'),
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
          text: T('Su una giostra che gira sempre uguale, il seggiolino accelera?', 'Moto circolare uniforme: c’è accelerazione?'),
          options: [T('Sì, perché cambia direzione', 'Sì, perché la velocità cambia direzione'), T('No, va sempre uguale', 'No, |v| è costante'), T('Solo quando parte', 'Solo all’avvio')],
          answer: 0, explain: T('Giusto: cambiare direzione è già accelerare.', 'Giusto: accelerazione centripeta, a = v²/r.'),
        },
        {
          kind: 'q',
          text: T('Due frecce a squadra, 3 e 4. Quanto è lunga la freccia somma?', 'Due velocità perpendicolari: 3 m/s e 4 m/s. La velocità totale è…'),
          options: [T('5'), T('7'), T('1')], answer: 0, keepOrder: true,
          explain: T('Giusto: è il triangolo 3-4-5, come per la barca sul fiume.', 'Giusto: √(9 + 16) = 5 m/s.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.', 'Un calcolo veloce.'),
          gen: (lens) => {
            const a = pick([2, 3]), t = pick([5, 6]);
            return lens === 'e'
              ? { text: `Un kart parte fermo e ogni secondo va <b>${a} m/s</b> più forte. Quanto va veloce dopo <b>${t} secondi</b>?`, ans: a * t, tol: 0, unit: 'm/s', explain: `Giusto: ${t} × ${a} = ${a * t} m/s.` }
              : { text: `Un kart parte da fermo con a = <b>${a} m/s²</b>. Che velocità ha dopo <b>${t} s</b>?`, ans: a * t, tol: 0.01, unit: 'm/s', explain: `Esatto: v = a·t = ${a * t} m/s.` };
          },
        },
        {
          kind: 'q',
          text: T('Una palla lanciata in orizzontale e una lasciata cadere dalla stessa altezza…', 'Lancio orizzontale e caduta libera dalla stessa altezza: chi tocca terra prima?'),
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
          text: T('Se il mito fosse vero, dove andrebbe il seggiolino staccato?', 'Che cosa prevede il mito, se il seggiolino si sgancia?'),
          options: [T('Dritto verso fuori, lungo il braccio', 'Via in direzione radiale, lungo il braccio'), T('Dritto lungo la freccia arancione', 'Lungo la tangente')],
          answer: 0, keepOrder: true,
          explain: T('Esatto, questo dice il mito. Ora metti <b>Lascia la presa: sì</b> e guarda cosa succede davvero.', 'Esatto. Ora attiva <b>Lascia la presa</b> e lancia.'),
        },
        { kind: 'free', runs: 1, text: T('Metti <b>Lascia la presa: sì</b> e lancia.', 'Attiva Lascia la presa e lancia.') },
        {
          kind: 'q',
          text: T('Dove è andato il seggiolino?', 'Che traiettoria ha seguito?'),
          options: [T('Dritto lungo la freccia arancione, di lato', 'Lungo la tangente'), T('Dritto verso fuori, lungo il braccio', 'In direzione radiale')],
          answer: 0, keepOrder: true,
          wrong: T('Guarda la linea rosa tratteggiata: segue il braccio o la freccia arancione?', 'Confronta la linea rosa con la direzione del braccio nel momento del distacco.'),
          explain: T('Giusto: è andato dritto lungo la freccia arancione, non verso fuori.', 'Giusto: lungo la tangente, non lungo il braccio.'),
        },
        {
          kind: 'q',
          text: T('Allora perché sulla giostra ti senti spinto verso fuori?', 'Allora che cosa “sentiamo” sulla giostra?', 'Come si spiega la sensazione di essere spinti fuori?'),
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
