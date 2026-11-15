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
      intro: T('Guardiamo la <b>giostra</b> dall’alto! Il seggiolino gira sempre in tondo. La freccia arancione mostra dove sta andando in ogni momento.', 'Un oggetto che gira in cerchio con velocità di intensità costante fa un <b>moto circolare uniforme</b>. Il tempo di un giro si chiama <b>periodo</b>, come per il pendolo.', 'Una giostra che gira sempre allo stesso ritmo, vista dall’alto: i fisici lo chiamano <b>moto circolare uniforme</b>. Osserva la freccia della velocità mentre il seggiolino gira.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai girare la giostra.', 'Fai girare la giostra e osserva le due frecce.') },
        {
          kind: 'q', review: false,
          text: T('Guarda la freccia arancione mentre il seggiolino gira. Verso dove punta?', 'La freccia arancione è la velocità del seggiolino: mostra dove andrebbe in quell’istante. Confrontala con il braccio della giostra, che va dal centro al seggiolino. Come è diretta la velocità?', 'Guarda la freccia arancione, la velocità, e confrontala con il braccio della giostra. Che direzione ha?'),
          options: [
            T('Di lato, lungo il giro', 'Tangente al cerchio', 'Tangente: sfiora il cerchio, a squadra con il braccio'),
            T('Verso il centro della giostra', 'Verso il centro', 'Lungo il braccio, verso il centro'),
            T('Verso fuori', 'Verso l’esterno', 'Lungo il braccio, verso fuori'),
          ],
          answer: 0,
          explain: T('Giusto: punta “di lato”, sfiorando il cerchio. Si dice <b>tangente</b>.', 'Giusto: la velocità è sempre <b>tangente</b> al cerchio, perpendicolare al braccio.', 'Giusto: è <b>tangente</b> al cerchio, in ogni istante a squadra con il braccio. È la direzione in cui schizza il fango da una ruota di bicicletta.'),
        },
        {
          kind: 'q',
          text: T('Sulla giostra, la freccia che mostra dove vai cambia durante il giro?', 'Un vettore ha un’intensità (quanto è lungo) e una direzione (dove punta). Il seggiolino va sempre alla stessa velocità in intensità, ma intanto gira. Il vettore velocità è costante?', 'Il tachimetro di un’auto in rotonda segna sempre 30 km/h. La sua velocità, intesa come freccia, è costante?'),
          options: [
            T('Sì: cambia direzione a ogni istante', 'No: l’intensità resta uguale ma la direzione cambia', 'No: la freccia cambia direzione di continuo'),
            T('No: resta sempre uguale', 'Sì, è costante', 'Sì: 30 km/h restano 30 km/h'),
          ],
          answer: 0,
          explain: T('Giusto! È lunga sempre uguale, ma gira insieme alla giostra.', 'Giusto: cambia direzione in ogni istante. E se la velocità cambia, c’è un’<b>accelerazione</b>: è la freccia verde.', 'Giusto: una freccia che gira non è costante, anche se resta lunga uguale. Per questo in curva c’è un’accelerazione anche quando il tachimetro non si muove: la senti sul sedile.'),
        },
      ],
      hints: [T('Guarda bene la freccia arancione mentre il seggiolino gira.', 'Confronta la freccia in due momenti diversi del giro.')],
      solution: T('La freccia sfiora il cerchio e gira con la giostra.', 'La velocità è tangente e cambia direzione: il moto è accelerato.'),
    },
    {
      id: 'm05-2', kind: 'lezione', title: 'Verso il centro',
      sim: 'circle', params: { r: 6, T: 6, release: false }, controls: ['r', 'T'], labels: { T: GIRO },
      intro: T('C’è un’altra freccia, verde. È l’<b>accelerazione</b>: mostra da che parte la giostra tira il seggiolino.', 'La freccia verde è l’<b>accelerazione centripeta</b>: “centripeta” vuol dire “che va verso il centro”. Vale a = v²/r.', 'La freccia verde è l’<b>accelerazione centripeta</b>: è lei a piegare di continuo la traiettoria. È quella che senti in curva, quando l’auto «tira» verso l’interno. [[a = v²/r = 4π²r/T²]]'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Prova una giostra <b>lenta</b> e una <b>veloce</b>.', 'Prova un giro lento e uno veloce: guarda la freccia verde.') },
        {
          kind: 'q', review: false,
          text: T('Guarda la freccia verde mentre la giostra gira. Dove punta?', 'La freccia verde è l’accelerazione del seggiolino: mostra come sta cambiando la sua velocità. Visto che la velocità gira insieme alla giostra, l’accelerazione deve «piegarla» in continuazione. Dove punta?', 'Guarda la freccia verde mentre la giostra gira, piano o forte. Dove punta?'),
          options: [T('Sempre verso il centro', 'Sempre verso il centro'), T('Avanti, come la velocità', 'Nella direzione della velocità'), T('Verso fuori', 'Verso l’esterno')],
          answer: 0,
          explain: T('Giusto: verso il centro. È il braccio della giostra che tira il seggiolino e lo fa curvare.', 'Giusto: è l’accelerazione <b>centripeta</b>. Senza qualcosa che tira verso il centro (il braccio, una corda, la gravità), l’oggetto andrebbe dritto.', 'Giusto: sempre verso il centro. Qualcosa deve tirare da quella parte: le catene della giostra, o le gomme sull’asfalto in curva. [[a = v²/r]]'),
        },
        {
          kind: 'num', rounds: 2, text: T('Calcola la velocità del seggiolino.', 'Calcola la velocità.'),
          gen: (lens) => {
            if (lens === 'e') {
              const [c, t] = pick([[24, 4], [24, 6], [30, 5], [30, 6], [36, 4], [36, 6]]); // solo divisioni senza virgola
              return { text: tr('Il seggiolino fa un giro lungo <b>{c} metri</b> in <b>{t} secondi</b>. Quanti metri fa ogni secondo?', { c, t }), ans: c / t, tol: 0.01, unit: 'm/s', explain: tr('Giusto: {c} diviso {t} fa {v:1}.', { c, t, v: c / t }) };
            }
            const r = pick([3, 4, 5, 6]), t = pick([4, 5, 6, 8]), v = (2 * Math.PI * r) / t;
            if (lens === 'c') return { text: tr('Il seggiolino gira a <b>{r} m</b> dal centro e fa un giro in <b>{t} s</b>. Quanti metri percorre ogni secondo? [[In un giro percorre la circonferenza: 2π volte il raggio.]]', { r, t }), ans: Math.round(v * 100) / 100, tol: 0.06, unit: 'm/s', explain: tr('Esatto: circa {v} m/s. [[v = 2πr / T = 2π × {r} / {t}]]', { r, t, v }) };
            return { text: tr('Il seggiolino gira a <b>{r} m</b> dal centro e fa un giro in <b>{t} s</b>. In un giro percorre la circonferenza, 2π volte il raggio. Qual è la sua velocità?', { r, t }), ans: Math.round(v * 100) / 100, tol: 0.06, unit: 'm/s', explain: tr('Esatto: v = 2πr / T = 2π × {r} / {t} ≈ {v} m/s.', { r, t, v }) };
          },
        },
        {
          // a = v²/r: la formula dell'introduzione, usata in un calcolo
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Calcola l’accelerazione centripeta.', 'Quanto «tira» la giostra?'),
          vals: { v: [4, 6, 8], r: [2, 4, 8] }, calc: 'v * v / r', unit: 'm/s²', tol: 0.02,
          ask: T(null, 'Il seggiolino va a <b>{v} m/s</b> su un cerchio di raggio <b>{r} m</b>. Quanto vale l’accelerazione centripeta, a = v²/r?',
            'Un seggiolino va a <b>{v} m/s</b> su un cerchio di raggio <b>{r} m</b>. L’accelerazione verso il centro è il quadrato della velocità diviso il raggio. Quanto vale?'),
          explain: T(null, 'Esatto: a = v²/r = {v}² / {r} = {ans} m/s².', 'Esatto: {v} × {v} diviso {r} fa {ans} m/s². Per confronto, la gravità dà circa 9,8 m/s².'),
        },
      ],
      hints: [T('La freccia verde punta sempre verso lo stesso punto della giostra.', 'In un giro il seggiolino percorre la circonferenza, 2πr.', 'In un giro il seggiolino percorre tutta la circonferenza: poco più di 6 volte il raggio. [[2πr]]')],
      solution: T('Verso il centro della giostra.', 'Verso il centro; v = 2πr/T.', 'Verso il centro. La velocità è la circonferenza divisa per la durata del giro. [[v = 2πr/T]]'),
    },
    {
      id: 'm05-3', kind: 'prevedi', title: 'Lascia la presa',
      sim: 'circle', params: { r: 6, T: 5, release: true }, controls: [],
      intro: T('Un piccolo guasto sulla giostra: un seggiolino si sgancia! Indovina prima di guardare.', 'Che cosa succede quando la forza centripeta sparisce all’improvviso? Prevedi, poi guarda.', 'Un lanciatore del martello gira su se stesso e poi apre le mani. Qui si sgancia un seggiolino: visto dall’alto, dove va?'),
      steps: [
        {
          kind: 'q', predict: [{ release: true }],
          text: T('Il seggiolino si stacca quando è in cima al giro. Niente lo tiene più: dove va?', 'Il seggiolino si sgancia in cima al giro: da quell’istante nessuno lo tira più verso il centro. Ricorda dove puntava la sua velocità in quel momento. Che traiettoria segue appena si stacca?', 'Come il martello quando l’atleta apre le mani: il seggiolino si sgancia in cima al giro, e niente lo tira più verso il centro. Che strada prende?'),
          options: [
            T('Dritto, lungo la freccia arancione', 'Una retta tangente al cerchio'),
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
      intro: T('Nuovo gioco per il parco: la <b>giostra a catene</b>! I seggiolini girano a <b>6 metri</b> dal centro. Scegli quanto dura un giro perché vadano alla velocità giusta.', 'Nuovo pezzo del parco: la <b>giostra a catene</b>, raggio 6 m. Regola il periodo perché i seggiolini abbiano la velocità richiesta.', 'Nuovo pezzo del parco: la <b>giostra a catene</b>, con i seggiolini a 6 metri dal centro. Trova quanto deve durare un giro per la velocità richiesta. [[v = 2πr/T]]'),
      piece: { id: 'catene', name: 'La giostra a catene', desc: 'I seggiolini volano in tondo alla velocità che hai calcolato tu.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto dura un giro e falla partire.', 'Regola la durata del giro e lancia. La seconda prova chiederà un’altra velocità.'),
          // all'Esploratore solo velocità intere
          vals: { e: { v: [[3, 4], [5, 6]] }, s: { v: [[3, 4, 5], [6, 7.5]] } },
          ask: T('I seggiolini devono andare a <b>{v:1} m/s</b>.'),
          measure: 'v', goal: 'v', tol: { e: 0.35, s: 0.2 },
          ok: T('{got} m/s: si vola!'),
          high: T('{got} m/s: troppo veloce. Fai durare di più il giro.', '{got} m/s: troppo veloce. Il periodo va allungato.'),
          low: T('{got} m/s: troppo lento. Fai durare di meno il giro.', '{got} m/s: troppo lento. Il periodo va accorciato.'),
          solve: { T: '2 * Math.PI * 6 / v' },
        },
      ],
      hints: [
        T('Un giro più corto vuol dire più veloce.', 'v e T sono inversamente proporzionali, come nel laboratorio dei grafici.', 'Velocità e durata del giro sono inversamente proporzionali, come nel laboratorio dei grafici: giro più corto, seggiolini più veloci.'),
        T('Se va troppo piano, accorcia il giro. Se va troppo forte, allungalo.', 'T = 2πr / v = 37,7 / v.', 'Un giro è lungo circa 37,7 metri: dividi per la velocità che vuoi. [[T = 2πr / v = 37,7 / v]]'),
      ],
      solution: T('Circa 12,6 s per 3 m/s; 9,4 s per 4 m/s; 7,5 s per 5 m/s; 6,3 s per 6 m/s.', 'T = 37,7 m / v: 3 → 12,6 s; 4 → 9,4 s; 5 → 7,5 s; 6 → 6,3 s; 7,5 → 5,0 s.', '3 m/s → 12,6 s; 4 → 9,4 s; 5 → 7,5 s; 6 → 6,3 s; 7,5 → 5,0 s. [[T = 37,7 m / v]]'),
    },
    {
      id: 'm05-5', kind: 'ripasso', title: 'Gran ripasso della Pista',
      intro: T('Ripassiamo tutta la Pista: velocità, accelerazione, frecce e giri!', 'Ripasso finale della cinematica.'),
      steps: [
        {
          kind: 'q',
          text: T('Sulla giostra il seggiolino va sempre forte uguale, ma cambia direzione. Sta accelerando?', 'Nel moto circolare uniforme l’intensità della velocità è costante. Ma l’accelerazione misura ogni cambiamento del vettore velocità, anche solo di direzione. C’è accelerazione?', 'La Luna gira intorno alla Terra sempre alla stessa velocità, circa 1 km al secondo. Sta accelerando?'),
          options: [T('Sì: cambia direzione', 'Sì, perché la velocità cambia direzione', 'Sì: cambia direzione di continuo'), T('No: va sempre forte uguale', 'No, |v| è costante', 'No: la velocità è sempre la stessa'), T('Solo quando la giostra parte', 'Solo all’avvio', 'Solo quando si avvicina alla Terra')],
          answer: 0, explain: T('Giusto: cambiare direzione è già accelerare.', 'Giusto: accelerazione centripeta, a = v²/r.', 'Giusto: cambiare direzione è accelerare. È un’accelerazione centripeta, diretta verso la Terra. [[a = v²/r]]'),
        },
        {
          kind: 'q',
          text: T('Una barca punta dritta all’altra riva, ma la corrente la spinge di lato. Dove va?', 'Due velocità perpendicolari, 3 m/s e 4 m/s, agiscono insieme, come barca e corrente. La velocità totale è la diagonale, e la si trova con Pitagora. Quanto vale?', 'Un traghetto attraversa lo stretto a 4 m/s mentre la corrente lo spinge di lato a 3 m/s. Per chi guarda da riva, a che velocità si muove?'),
          options: [T('In diagonale', '5 m/s', '5 m/s: meno della somma'), T('Dritta, come punta', '7 m/s', '7 m/s: la somma'), T('Solo di lato, con l’acqua', '1 m/s', '1 m/s: la differenza')], answer: 0,
          explain: T('Giusto: le due spinte si sommano, e la barca va in diagonale.', 'Giusto: √(9 + 16) = 5 m/s.', 'Giusto: le due frecce sono a squadra, e la diagonale è più corta della loro somma. [[√(3² + 4²) = √25 = 5 m/s]]'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.', 'Un calcolo veloce.'),
          gen: (lens) => {
            const a = pick([2, 3]), t = pick([5, 6]);
            return lens === 'e'
              ? { text: tr('Un kart parte da fermo. Ogni secondo va <b>{a} m/s</b> più forte di prima. Quanto va veloce dopo <b>{t} secondi</b>?', { a, t }), ans: a * t, tol: 0, unit: 'm/s', explain: tr('Giusto: {t} × {a} = {v} m/s.', { a, t, v: a * t }) }
              : lens === 'c' ? { text: tr('Un kart parte da fermo e guadagna <b>{a} m/s</b> ogni secondo. Che velocità ha dopo <b>{t} s</b>?', { a, t }), ans: a * t, tol: 0.01, unit: 'm/s', explain: tr('Esatto: {a} m/s in più ogni secondo, per {t} secondi: {v} m/s. [[v = a·t]]', { a, t, v: a * t }) }
              : { text: tr('Un kart parte da fermo con accelerazione costante a = <b>{a} m/s²</b>, cioè guadagna {a} m/s ogni secondo. Che velocità ha dopo <b>{t} s</b>?', { a, t }), ans: a * t, tol: 0.01, unit: 'm/s', explain: tr('Esatto: v = a·t = {v} m/s.', { a, t, v: a * t }) };
          },
        },
        {
          kind: 'q',
          text: T('Una palla è lanciata in avanti, l’altra lasciata cadere dalla stessa altezza. Le due palle…', 'Lancio orizzontale e caduta libera, dalla stessa altezza e nello stesso istante. Il moto orizzontale e quello verticale sono indipendenti. Chi tocca terra prima?', 'Dal bordo del tavolo: una moneta spinta via con un colpo secco, l’altra lasciata cadere nello stesso istante. Quale tocca prima il pavimento?'),
          options: [T('toccano terra insieme', 'insieme', 'Insieme: si sente un solo «tic»'), T('prima quella lanciata', 'quella lanciata', 'Quella spinta'), T('prima quella lasciata cadere', 'quella lasciata cadere', 'Quella lasciata cadere')],
          answer: 0, explain: T('Giusto: in verticale cadono uguali.', 'Giusto: il moto verticale è indipendente da quello orizzontale.'),
        },
        {
          kind: 'q',
          text: T('Sulla giostra un seggiolino si stacca all’improvviso: niente lo tiene più. Dove va?', 'Un seggiolino in moto circolare si sgancia: da quell’istante nessuno lo tira più verso il centro. Che traiettoria segue?', 'In curva un oggetto appoggiato sul cruscotto scivola via. Visto dall’alto, da fuori dell’auto, che strada segue?'),
          options: [T('Dritto, dove stava andando', 'Una retta tangente al cerchio', 'Va dritto, lungo la tangente: è l’auto che gli gira sotto'), T('Dritto verso fuori, lontano dal centro', 'Una retta lungo il raggio, verso l’esterno', 'Schizza verso l’esterno della curva, lungo il raggio'), T('Continua a girare in tondo', 'Continua sul cerchio', 'Segue la curva insieme all’auto')],
          answer: 0, explain: T('Giusto: va dritto, lungo la freccia arancione.', 'Giusto: lungo la tangente, a velocità costante.', 'Giusto: lungo la tangente, a velocità costante. Senza qualcosa che lo tiri verso il centro, niente curva.'),
        },
        {
          kind: 'q',
          text: T('Due giostre uguali: una fa un giro in 4 secondi, l’altra in 8. Su quale vai più veloce?', 'Stesso raggio, periodi diversi: 4 s e 8 s. La velocità è la circonferenza divisa per il periodo, v = 2πr/T. Come sono le due velocità?', 'Due giostre identiche: una completa un giro in 4 secondi, l’altra in 8. Sulla prima, i seggiolini vanno…'),
          options: [T('Su quella da 4 secondi', 'Con T = 4 s è doppia', 'al doppio della velocità'), T('Su quella da 8 secondi', 'Con T = 8 s è doppia', 'a metà della velocità'), T('Vanno uguali', 'Sono uguali', 'alla stessa velocità')],
          answer: 0, explain: T('Giusto: lo stesso giro in meno tempo, quindi più veloce.', 'Giusto: v e T sono inversamente proporzionali. Metà periodo, doppia velocità.', 'Giusto: lo stesso giro in metà tempo vuol dire velocità doppia. [[v = 2πr/T]]'),
        },
      ],
      hints: [T('Ripensa alla giostra, alla barca e al cannone.')],
    },
    {
      id: 'm05-6', kind: 'boss', title: 'Il mito della forza centrifuga',
      sim: 'circle', params: { r: 6, T: 4, release: true, laps: 1.25 }, controls: ['laps'],
      intro: T(
        'Sono Vetrino. Sulla giostra ti senti spinto verso fuori. Un mio amico dice: <i>“C’è una forza che spinge fuori! Se ti stacchi, voli via dritto lontano dal centro”</i>. Sarà vero?',
        'Sono Vetrino. Un mito: <i>“Sulla giostra una forza ti spinge verso l’esterno; se il seggiolino si sgancia, schizza via lungo il braccio, lontano dal centro”</i>. Controlliamo.',
        'Sono Vetrino. Il mito: <i>“la forza centrifuga spinge il seggiolino verso l’esterno: se si sgancia, parte in direzione radiale”</i>. Verifichiamo.'),
      steps: [
        {
          kind: 'q',
          text: T('Ragiona come il mito: se una forza spingesse fuori, dove andrebbe il seggiolino staccato?', 'Il mito parla di una «forza centrifuga» che spinge il seggiolino verso l’esterno, lungo il braccio. Se il seggiolino si sgancia, che cosa prevede il mito?', 'In curva ti senti schiacciato contro la portiera, come se una forza ti spingesse fuori. Se quella forza esistesse davvero, dove andrebbe il seggiolino appena sganciato?'),
          options: [T('Verso fuori, lungo il braccio', 'Via in direzione radiale, lungo il braccio', 'Dritto verso fuori, lungo il braccio'), T('Dritto, lungo la freccia arancione', 'Lungo la tangente')],
          answer: 0,
          explain: T('Esatto, questo dice il mito. Ora mettiamolo alla prova in un punto nuovo del giro.', 'Esatto: questo prevede il mito. Mettiamolo alla prova in un punto nuovo del giro.'),
        },
        {
          // Esperimento nuovo rispetto a m05-3: lo sgancio avviene a sinistra, dove tangente (giù) e braccio (sinistra) danno previsioni diverse.
          kind: 'q', predict: [{ release: true, laps: 1.5 }],
          text: T('Ora il seggiolino si stacca quando è a <b>sinistra</b> della giostra. Dove va?', 'Ora lo sgancio avviene dopo un giro e mezzo, quando il seggiolino è a <b>sinistra</b> del centro: lì il braccio punta a sinistra. La giostra gira in senso antiorario. Dove va il seggiolino?', 'Proviamo in un punto nuovo: il seggiolino si sgancia quando è a <b>sinistra</b> del centro, dove il braccio punta a sinistra. La giostra gira in senso antiorario. Dove va?'),
          options: [T('In giù', 'Verso il basso'), T('A sinistra, lontano dal centro', 'Verso sinistra, lungo il braccio'), T('In su', 'Verso l’alto')],
          answer: 0,
          explain: T('In giù, non a sinistra come diceva il mito! Va dove puntava la freccia arancione in quel momento.', 'Verso il basso, lungo la tangente. Se il mito avesse ragione sarebbe andato a sinistra, lungo il braccio.'),
        },
        { kind: 'free', runs: 1, text: T('Ora prova tu: scegli un altro <b>punto di sgancio</b> e lancia.', 'Scegli un altro punto di sgancio e lancia: confronta la linea rosa con il braccio.'), need: [{ when: 'laps != 1.5', try: { laps: 1.75 }, msg: T('Questo punto l’hai già visto: scegline un altro.') }] },
        {
          kind: 'q', review: false,
          text: T('Guarda la linea rosa: la strada del seggiolino staccato. Che cosa segue sempre?', 'Hai sganciato il seggiolino in punti diversi. Confronta ogni volta la linea rosa con il braccio e con la freccia della velocità. Che direzione prende sempre?', 'Hai provato più punti di sgancio. La linea rosa segue ogni volta il braccio, o la freccia della velocità?'),
          options: [T('La freccia arancione', 'La tangente, cioè la direzione della velocità'), T('Il braccio, verso fuori', 'Il braccio, in direzione radiale'), T('Sempre verso l’alto', 'Sempre verso l’alto')],
          answer: 0,
          wrong: T('Guarda la linea rosa tratteggiata: segue il braccio o la freccia arancione?', 'Confronta la linea rosa con la direzione del braccio nel momento del distacco.'),
          explain: T('Giusto: in ogni punto va dritto lungo la freccia arancione, mai verso fuori.', 'Giusto: in ogni punto parte lungo la tangente, mai lungo il braccio.'),
        },
        {
          kind: 'q',
          text: T('Nessuna forza spinge fuori. Allora perché sulla giostra ti senti spinto verso l’esterno?', 'Nessuna forza ha spinto il seggiolino verso fuori: appena libero, è andato dritto. Allora che cosa «sentiamo» quando siamo sulla giostra e ci sembra di essere spinti verso l’esterno?', 'Per chi guarda da fuori, sul seggiolino agisce solo una forza verso il centro. Come si spiega allora la sensazione, per chi sta sulla giostra, di essere spinti fuori?'),
          options: [
            T('Il tuo corpo vorrebbe andare dritto', 'Il corpo tende ad andare dritto (inerzia); il sedile lo spinge verso il centro', 'Il corpo tende ad andare dritto, e la giostra lo costringe a curvare'),
            T('C’è davvero una forza che spinge fuori', 'Una forza reale verso l’esterno', 'Una vera forza che spinge verso l’esterno'),
          ],
          answer: 0,
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
