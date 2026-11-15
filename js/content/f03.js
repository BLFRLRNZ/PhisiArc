// F03 · Grafici e proporzionalità, con gli errori di misura. Simulazione: il laboratorio dei grafici.
import { T, pick, num } from '../util.js';
import { t } from '../i18n.js';

const TEMPO = { label: 'Tempo aperto', min: 1, max: 10, step: 0.5, unit: 's' };
const VEL = (min, max) => ({ label: 'Velocità', min, max, step: 1, unit: 'm/s' });

// tre misure "vere" con un piccolo errore, e la loro media
const media3 = (lens) => {
  if (lens === 'e') {
    const m = pick([4, 5, 6, 7]), d = pick([1, 2]);
    return { text: t('Hai cronometrato la stessa corsa tre volte: <b>{a} s</b>, <b>{m} s</b> e <b>{b} s</b>. Le misure stanno un po’ sotto e un po’ sopra: quale numero sta <b>in mezzo</b>?', { a: m - d, m, b: m + d }), ans: m, tol: 0, unit: 's', explain: t('Giusto: {m} sta in mezzo. Gli scienziati lo chiamano <b>media</b>.', { m }) };
  }
  const base = pick([2, 2.5, 3, 3.5]), a = pick([-0.2, -0.1]), b = pick([0.1, 0.3]), c = -(a + b) + pick([0, 0.3]);
  const xs = [base + a, base + b, base + c].map((v) => Math.round(v * 10) / 10);
  const m = Math.round(((xs[0] + xs[1] + xs[2]) / 3) * 100) / 100;
  return {
    text: t('Tre misure dell’acqua uscita in {t:0} s: <b>{a:1} L</b>, <b>{b:1} L</b>, <b>{c:1} L</b>. Qual è la media?', { t: base * 2, a: xs[0], b: xs[1], c: xs[2] }),
    ans: m, tol: 0.02, unit: 'L',
    explain: t('Esatto: ({a:1} + {b:1} + {c:1}) / 3 = {m} L.', { a: xs[0], b: xs[1], c: xs[2], m }),
  };
};

// la media delle tre misure appena fatte dal giocatore; dove la simulazione non c'è (ripasso del giorno), tre misure d'esempio
const mediaTue = (lens, sim) => {
  const ys = lens !== 'e' && sim && sim.points ? sim.points.slice(-3).map((q) => q.y) : [];
  if (ys.length < 3) return media3(lens);
  const m = Math.round(((ys[0] + ys[1] + ys[2]) / 3) * 100) / 100;
  return {
    text: t('Le tue tre misure: <b>{a} L</b>, <b>{b} L</b> e <b>{c} L</b>. Qual è la media?', { a: ys[0], b: ys[1], c: ys[2] }),
    ans: m, tol: 0.02, unit: 'L',
    explain: t('Esatto: ({a} + {b} + {c}) / 3 = {m} L. La legge vera dice 3 L: la media ci va vicino.', { a: ys[0], b: ys[1], c: ys[2], m }),
  };
};

export default {
  id: 'F03',
  title: 'Grafici e proporzionalità',
  levels: [
    {
      id: 'f03-1', kind: 'lezione', title: 'Punti su un grafico',
      sim: 'lab', params: { mode: 'rubinetto', x: 2, noise: false }, controls: ['x'], labels: { x: TEMPO },
      intro: T(
        'Il custode deve riempire la vasca dei pesci. Apri il <b>rubinetto</b> per un po’ di secondi: ogni prova mette un <b>puntino</b> sul disegno qui sotto, che si chiama <b>grafico</b>.',
        'Un <b>grafico</b> mette in relazione due grandezze: qui il tempo in cui il rubinetto resta aperto (asse orizzontale) e i litri d’acqua raccolti (asse verticale). Ogni esperimento diventa un punto.',
        'Un grafico è il modo più veloce per vedere una legge della natura. Misura i litri raccolti per diversi tempi di apertura: ogni misura è un punto (tempo, litri).'),
      steps: [
        { kind: 'free', runs: 3, text: T('Fai almeno <b>tre prove</b>, con tempi diversi: 2 secondi, 4 secondi, 8 secondi…', 'Fai almeno tre prove con tempi diversi e guarda dove finiscono i punti.') },
        {
          kind: 'q', set: { fit: true },
          text: T('Ogni volta che apri il rubinetto, sul grafico compare un puntino: più a destra se lo tieni aperto più a lungo, più in alto se raccogli più litri. Guarda tutti i puntini insieme, come se li unissi con una matita. Come sono messi?', 'Ogni prova diventa un punto: in orizzontale il tempo di apertura del rubinetto, in verticale i litri raccolti. Guarda i punti tutti insieme, come se li unissi con una riga. Come sono disposti?', 'Ogni prova è un punto: tempo di apertura in orizzontale, litri raccolti in verticale. Se li unisci, che forma descrivono?'),
          options: [
            T('In fila, su una linea dritta che parte da zero', 'Su una retta che passa per l’origine', 'Una retta per l’origine'),
            T('Sparsi a caso', 'Sparsi senza un ordine', 'Nessuna forma riconoscibile'),
            T('Su una linea che scende', 'Su una curva che scende', 'Un’iperbole che scende'),
          ],
          answer: 0,
          explain: T(
            'Giusto! Doppio tempo, doppia acqua. Quando succede così si dice che le due cose sono <b>direttamente proporzionali</b>.',
            'Giusto: se il tempo raddoppia, anche i litri raddoppiano. È la <b>proporzionalità diretta</b>, e il suo grafico è sempre una retta che passa per l’origine.',
            'Giusto: litri = 0,5 L/s · tempo. Il rapporto y/x è costante: <b>proporzionalità diretta</b>, retta per l’origine con pendenza 0,5 L/s.'),
          wrong: T('Guarda bene: la linea gialla tratteggiata passa proprio sui puntini.', 'Segui la linea tratteggiata: tocca tutti i punti.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Usa quello che hai scoperto.', 'Usa la proporzionalità.'),
          gen: (lens) => {
            const tt = pick(lens === 'e' ? [4, 6, 8] : [2, 4, 6]), k = pick([2, 3]);
            return lens === 'e'
              ? { text: t('Il rubinetto butta fuori l’acqua sempre allo stesso ritmo. Tenendolo aperto <b>{t} secondi</b> raccogli <b>{l:1} litri</b>. Se lo tieni aperto <b>{t2} secondi</b>, quanti litri raccogli?', { t: tt, l: tt / 2, t2: tt * k }), ans: (tt * k) / 2, tol: 0, unit: t('litri'), explain: t('Giusto: il tempo è {k} volte tanto, quindi anche l’acqua: {l:1} litri.', { k, l: (tt * k) / 2 }) }
              : { text: t('Il rubinetto ha una portata costante, quindi litri e tempo sono direttamente proporzionali. In <b>{t} s</b> escono <b>{l:1} L</b>. Quanti litri escono in <b>{t2:1} s</b>?', { t: tt, l: tt / 2, t2: tt * k * 0.75 }), ans: (tt * k * 0.75) / 2, tol: 0.01, unit: 'L', explain: t('Esatto: il rapporto è 0,5 L/s, quindi 0,5 × {t2:1} = {l} L.', { t2: tt * k * 0.75, l: (tt * k * 0.75) / 2 }) };
          },
        },
      ],
      hints: [T('Se raddoppi il tempo, cosa succede all’acqua?', 'Quanti litri escono in 1 secondo? Moltiplica per i secondi.')],
      solution: T('Ogni secondo escono 0,5 litri: doppio tempo, doppia acqua.', 'litri = 0,5 × tempo: proporzionalità diretta.'),
    },
    {
      id: 'f03-2', kind: 'lezione', title: 'Doppio, metà',
      sim: 'lab', params: { mode: 'viaggio', x: 5, noise: false }, controls: ['x'], labels: { x: VEL(2, 20) },
      intro: T(
        'Ora una gara sul rettilineo del parco: <b>60 metri</b>. Scegli quanto va veloce la macchinina e guarda quanto tempo ci mette. La velocità si misura in <b>metri al secondo</b> (m/s): a 5 m/s fa 5 metri ogni secondo.',
        'La macchinina percorre sempre <b>60 m</b>. La velocità è in <b>metri al secondo</b> (m/s): a 5 m/s fa 5 metri ogni secondo. Cambiala e misura il tempo: sul grafico, velocità in orizzontale e tempo in verticale.',
        'Percorso fisso di 60 m, velocità a scelta in metri al secondo (m/s): quanti metri fa ogni secondo. Che legame c’è fra velocità e tempo impiegato?'),
      steps: [
        { kind: 'free', runs: 3, text: T('Fai almeno <b>tre corse</b> a velocità diverse.', 'Fai almeno tre corse a velocità diverse.') },
        {
          kind: 'q', predict: [{ x: 5 }, { x: 10 }],
          text: T('La strada è sempre la stessa, 60 metri. Prima la macchinina va piano, poi va al <b>doppio</b> della velocità. Che cosa succede al tempo che ci mette ad arrivare?', 'La distanza è sempre 60 m. Se la velocità passa da 5 a 10 m/s, cioè raddoppia, che cosa succede al tempo del viaggio?'),
          options: [T('diventa la metà', 'si dimezza'), T('diventa il doppio', 'raddoppia'), T('resta uguale', 'resta uguale')],
          answer: 0,
          explain: T('Giusto: più veloce, meno tempo. Doppia velocità, metà tempo!', 'Da 12 s a 6 s: doppia velocità, metà tempo.', 'Da 12 s a 6 s: t = 60 m / v, quindi raddoppiando v il tempo si dimezza.'),
        },
        {
          kind: 'q', set: { fit: true },
          text: T('Ogni corsa ha lasciato un puntino: a destra le corse più veloci, in alto quelle che sono durate di più. Unisci i puntini con la fantasia, da sinistra a destra. Che forma ha la linea?', 'Sul grafico la velocità è in orizzontale e il tempo del viaggio in verticale. Unisci i punti delle tue corse, dalla più lenta alla più veloce. Che forma ha il grafico?', 'Velocità in orizzontale, tempo in verticale, distanza fissa di 60 m. Che curva descrivono i punti delle tue corse?'),
          options: [
            T('Una linea dritta che sale', 'Una retta che sale', 'Una retta per l’origine'),
            T('Una curva che scende, e diventa sempre più piatta', 'Una curva che scende, sempre meno ripida', 'Un ramo di iperbole'),
            T('Una linea piatta', 'Una retta orizzontale', 'Una parabola'),
          ],
          answer: 1,
          explain: T(
            'Esatto! Quando una cosa raddoppia e l’altra si dimezza, si dice che sono <b>inversamente proporzionali</b>.',
            'Esatto: velocità × tempo fa sempre 60. È la <b>proporzionalità inversa</b>, e il suo grafico è una curva che scende (un’iperbole).',
            'Esatto: v · t = 60 m costante. <b>Proporzionalità inversa</b>: y = k/x, un ramo di iperbole che non tocca mai gli assi.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T('Sempre gli stessi 60 metri: a 4 m/s la macchinina ci mette 15 s. Ora va a 12 m/s, cioè 3 volte più veloce. Quanto tempo le serve?', 'Distanza fissa: a 4 m/s servono 15 s. Velocità e tempo sono inversamente proporzionali: se una si moltiplica per un numero, l’altro si divide per lo stesso numero. Quanto tempo serve a 12 m/s?'),
          options: [T('5 s'), T('45 s'), T('3 s')],
          answer: 0,
          explain: T('Giusto: velocità tripla, tempo diviso per 3. Controllo: 12 × 5 = 60 m.'),
          wrong: T('Se vai più veloce, il tempo deve diminuire. Di quanto?'),
        },
      ],
      hints: [T('Più veloce vuol dire più tempo o meno tempo?', 'Moltiplica velocità e tempo: cosa ottieni ogni volta?')],
      solution: T('Doppia velocità, metà tempo: proporzionalità inversa.', 'v × t = 60 m sempre: proporzionalità inversa.'),
    },
    {
      id: 'f03-3', kind: 'prevedi', title: 'La frenata',
      sim: 'lab', params: { mode: 'frenata', x: 10, noise: false }, controls: ['x'], labels: { x: VEL(4, 30) },
      intro: T(
        'La macchinina arriva alla linea rossa e frena. Quanta strada fa prima di fermarsi? Prima indovina, poi guarda!',
        'Un’auto frena sempre allo stesso modo. Lo <b>spazio di frenata</b> dipende dalla velocità: ma come?',
        'L’auto frena sempre allo stesso modo, a qualunque velocità stia andando. Come cambia lo spazio di frenata quando la velocità aumenta?'),
      steps: [
        {
          kind: 'q', predict: [{ x: 10 }, { x: 20 }],
          text: T('L’auto frena sempre allo stesso modo. Quando va a 10 m/s, da quando inizia a frenare a quando è ferma fa circa <b>7 metri</b>. Se va al <b>doppio</b>, a 20 m/s, quanti metri le servono per fermarsi?', 'Lo <b>spazio di frenata</b> è la strada che l’auto fa da quando frena a quando si ferma. Con la stessa frenata, a 10 m/s è circa 7 m. Prevedi: a 20 m/s, il doppio della velocità, quanto sarà?'),
          options: [T('Circa 14 metri, il doppio', 'Circa 14 m (il doppio)'), T('Circa 28 metri, quattro volte', 'Circa 28 m (quattro volte)'), T('Sempre 7 metri', 'Circa 7 m (uguale)')],
          answer: 1,
          explain: T(
            'Quattro volte! Doppia velocità, frenata quattro volte più lunga. Ecco perché in città bisogna andare piano.',
            'Quattro volte: 7 m diventano 28,6 m. Raddoppiando la velocità lo spazio di frenata si quadruplica.',
            'Quattro volte: d = v²/(2a). Con v doppia, v² è quadruplo. Per questo un piccolo eccesso di velocità allunga molto la frenata.'),
        },
        { kind: 'free', runs: 2, set: { fit: true }, text: T('Prova altre velocità e guarda la linea gialla.', 'Aggiungi almeno due punti e osserva la curva gialla.') },
        {
          kind: 'q',
          text: T('Ogni frenata ha lasciato un punto: in orizzontale la velocità dell’auto, in verticale i metri che le servono per fermarsi. La linea gialla unisce i punti. Che forma ha?', 'Il grafico mette la velocità in orizzontale e lo spazio di frenata in verticale. Guarda come cresce la curva gialla quando la velocità aumenta: sempre allo stesso modo, o sempre più in fretta? Che grafico è?', 'Hai visto che, raddoppiando la velocità, lo spazio di frenata non raddoppia soltanto. Che legame c’è fra lo spazio di frenata e la velocità?'),
          options: [
            T('Una curva che sale sempre più ripida', 'Una curva che sale sempre più ripida (parabola)', 'Proporzionale al quadrato della velocità'),
            T('Una linea dritta', 'Una retta per l’origine', 'Direttamente proporzionale alla velocità'),
            T('Una curva che scende', 'Una curva che scende', 'Inversamente proporzionale alla velocità'),
          ],
          answer: 0,
          explain: T(
            'Giusto: più vai forte, più la frenata si allunga, e sempre più in fretta.',
            'Giusto: è una <b>proporzionalità quadratica</b>. Il grafico è una parabola: triplicando la velocità lo spazio diventa 9 volte.',
            'Giusto: d ∝ v², proporzionalità quadratica. Il grafico d–v è un ramo di parabola.'),
          wrong: T('Guarda la distanza fra i puntini: a velocità alte la linea sale molto di più.', 'Una retta vorrebbe dire “doppio, doppio”. Che cosa hai visto a 10 e a 20 m/s?'),
        },
      ],
      hints: [T('Guarda bene i due esperimenti: quanto è lunga la frenata a 20 m/s rispetto a 10 m/s?', 'Confronta d(20) e d(10): che rapporto c’è?')],
      solution: T('Doppia velocità, frenata quattro volte più lunga.', 'Spazio di frenata ∝ v²: con v doppia, quattro volte.'),
    },
    {
      id: 'f03-4', kind: 'costruisci', title: 'La fontana del parco',
      sim: 'lab', params: { mode: 'rubinetto', x: 3, noise: false, keep: true }, controls: ['x'], labels: { x: TEMPO },
      intro: T(
        'Nuovo pezzo per il parco: la <b>fontana</b>! La vasca deve ricevere proprio la quantità d’acqua giusta, né troppa né poca. Il rubinetto dà mezzo litro ogni secondo.',
        'Nuovo pezzo del parco: la <b>fontana</b>. Il rubinetto eroga <b>0,5 L/s</b>. Scegli per quanto tempo aprirlo per avere i litri richiesti.',
        'Nuovo pezzo del parco: la <b>fontana</b>. Portata 0,5 L/s: calcola il tempo di apertura per il volume richiesto, poi verifica.'),
      piece: { id: 'fontana', name: 'La fontana', desc: 'Getti d’acqua che riempiono la vasca con la quantità esatta che hai calcolato.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli il tempo e apri il rubinetto.', 'Regola il tempo di apertura e lancia. La seconda prova chiederà un volume diverso.'),
          vals: { L: [[1.5, 2, 2.5, 3], [1.75, 3.5, 4, 4.5]] },
          ask: T('La vasca deve ricevere <b>{L} litri</b>.'),
          measure: 'y', goal: 'L', tol: 0.12,
          ok: T('{got} litri: la fontana è perfetta!'),
          high: T('{got} litri: troppa acqua, la vasca trabocca. Chiudi prima il rubinetto.', '{got} litri: troppa acqua, la vasca trabocca. Il tempo va ridotto: di quanto?'),
          low: T('{got} litri: troppo poca. Lascia aperto più a lungo.', '{got} litri: troppo poca. Il tempo va aumentato: di quanto?'),
          solve: { x: '2 * L' },
        },
      ],
      hints: [
        T('Ogni secondo esce mezzo litro. Quindi per 1 litro servono…', 'Il tempo è proporzionale ai litri: per 1 L servono 2 s.'),
        T('Il tempo è il doppio dei litri: per 3 litri, 6 secondi.', 'tempo = litri / 0,5 L/s = 2 × litri.'),
      ],
      solution: T('Il tempo è sempre il doppio dei litri: 2 litri → 4 s, 3 litri → 6 s, 4,5 litri → 9 s.', 't = V / 0,5 L/s: 1,75 L → 3,5 s; 2,5 L → 5 s; 4 L → 8 s.'),
    },
    {
      id: 'f03-5', kind: 'ripasso', title: 'Ripasso dei grafici',
      intro: T('Ripassiamo grafici, doppi e metà!', 'Ripasso: grafici, proporzionalità e misure.'),
      steps: [
        {
          kind: 'q',
          text: T('Al parco ogni biglietto costa uguale: 2 biglietti costano 6 €, 4 biglietti 12 €, e 0 biglietti non costano niente. Disegni un grafico con i biglietti in orizzontale e i soldi spesi in verticale. Che linea viene?', 'Ogni biglietto costa 3 €, quindi il costo è <b>direttamente proporzionale</b> al numero di biglietti: se uno raddoppia, raddoppia anche l’altro. Con i biglietti in orizzontale e il costo in verticale, il grafico è…'),
          options: [T('una linea dritta che parte da zero', 'una retta per l’origine'), T('una curva che scende', 'un’iperbole'), T('una curva sempre più ripida', 'una parabola')],
          answer: 0, explain: T('Giusto: doppi biglietti, doppia spesa.', 'Giusto: proporzionalità diretta, retta per l’origine.'),
        },
        {
          kind: 'q',
          text: T('Una torta si divide in parti uguali fra gli amici alla festa: più amici ci sono, più piccola è la fetta di ognuno. Se arrivano il doppio degli amici, che cosa succede alla tua fetta?', 'La torta è sempre una, divisa in parti uguali: la fetta è <b>inversamente proporzionale</b> al numero di amici, cioè quando uno cresce l’altra cala nella stessa proporzione. Se gli amici raddoppiano, la fetta…'),
          options: [T('fetta grande la metà', 'la fetta si dimezza'), T('fetta doppia', 'la fetta raddoppia'), T('fetta uguale', 'la fetta resta uguale')],
          answer: 0, explain: T('Giusto: doppi amici, metà fetta.', 'Giusto: proporzionalità inversa, il prodotto resta costante (una torta).'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T('Due grandezze sono legate così: quando una diventa il triplo, anche l’altra diventa il triplo; quando una si dimezza, si dimezza anche l’altra. Nel Laboratorio hai visto tre tipi di legame: diretto, inverso e quadratico. Quale è questo?'),
          options: [T('Diretta'), T('Inversa'), T('Quadratica')],
          answer: 0, explain: T('Giusto: rapporto costante, proporzionalità diretta. Con un legame quadratico diventerebbe 9 volte più grande.'),
        },
        {
          // Un calcolo sulle proporzioni. La media si spiega nel boss, subito dopo, e torna nel ripasso della Pista (m01-5).
          kind: 'num', rounds: 1, text: T('Un ultimo conto.', 'Un ultimo calcolo.'),
          vals: { t: [6, 12], k: [2, 3], n: [2, 3] }, derive: { m: 'n * k' },
          calc: { e: 't * k', s: 't / k' }, unit: T('bicchieri', 'min'), tol: { e: 0, s: 0.01 },
          ask: T('Per riempire un secchio servono <b>{t} bicchieri</b> d’acqua. Quanti bicchieri servono per riempire <b>{k} secchi</b> uguali?',
            'Per riempire la vasca grande, <b>{n} rubinetti</b> uguali ci mettono <b>{t} minuti</b>. Rubinetti e tempo sono inversamente proporzionali. Quanti minuti servono con <b>{m} rubinetti</b>?'),
          explain: T('Giusto: {k} volte i secchi, {k} volte i bicchieri: {ans}.', 'Esatto: i rubinetti sono {k} volte tanti, quindi il tempo si divide per {k}: {ans} minuti.'),
        },
      ],
      hints: [T('Ripensa al rubinetto, alla gara e alla frenata.')],
    },
    {
      id: 'f03-6', kind: 'boss', title: 'Il mito della misura perfetta',
      sim: 'lab', params: { mode: 'rubinetto', x: 6, noise: true, keep: true }, controls: [],
      intro: T(
        'Sono Vetrino. Un mio amico dice: <i>“Se misuri bene, esce sempre lo stesso numero. Se due misure sono diverse, una è sbagliata!”</i>. Proviamo con il rubinetto, come lo misura una persona vera.',
        'Sono Vetrino. Si sente dire: <i>“Una misura fatta bene dà sempre lo stesso risultato. Se due misure differiscono, una è sbagliata”</i>. Ora l’<b>errore di misura</b> è acceso: misuriamo come in un vero laboratorio.',
        'Sono Vetrino. Il mito: <i>“Una misura accurata è sempre identica; misure diverse significano errori grossolani”</i>. Con l’errore di misura acceso, mettiamolo alla prova.'),
      steps: [
        {
          kind: 'free', runs: 3, text: T('Apri il rubinetto per 6 secondi, <b>tre volte</b>. Guarda i numeri che escono.', 'Ripeti la stessa misura (6 s) tre volte e confronta i risultati.'),
          // le misure fatte restano scritte in fila: sul grafico i tre punti sono troppo vicini per leggerli
          onRun: (r) => t('Le tue misure finora: <b>{l}</b>.', { l: r.ys.map((y) => num(y, 2) + ' L').join(' · ') }),
        },
        {
          kind: 'q',
          text: T('Hai aperto il rubinetto tre volte, sempre per 6 secondi, ma i litri raccolti non sono proprio uguali: cambiano di poco. Che cosa vuol dire?', 'Hai ripetuto la stessa misura tre volte, nelle stesse condizioni, e hai ottenuto valori leggermente diversi. Nessuno ha sbagliato apposta. Perché succede?'),
          options: [
            T('Ogni misura ha un piccolo errore: è normale', 'Ogni misura ha un piccolo errore casuale: succede sempre', 'Ogni misura ha un’incertezza casuale ineliminabile'),
            T('Una è sbagliata: va buttata via', 'Almeno una misura è sbagliata e va scartata', 'Almeno una misura è un errore grossolano'),
            T('Il rubinetto si è rotto', 'La legge cambia ogni volta', 'La legge fisica cambia da una prova all’altra'),
          ],
          answer: 0,
          explain: T(
            'Giusto! Nessuna misura è perfetta: un cronometro premuto un attimo prima, una goccia in più… Gli scienziati lo sanno, e non si arrabbiano.',
            'Giusto: ogni strumento e ogni persona introduce un piccolo <b>errore casuale</b>. Le barrette rosa mostrano quanto può valere.',
            'Giusto: è l’<b>incertezza di misura</b>. Le barre d’errore rosa (±7%) mostrano l’intervallo in cui cade probabilmente il valore vero.'),
          wrong: T('Guarda le barrette rosa: tutte le misure sono vicine, nessuna è “fuori”.', 'Le misure sono tutte vicine e compatibili con le barre d’errore: nessuna è un errore grossolano.'),
        },
        {
          kind: 'q',
          text: T('Le tre misure sono un po’ diverse, e non sai quale sia «quella giusta». Ma c’è un modo per mettere insieme le misure e ottenere un numero di cui fidarti di più. Come fai?', 'Ogni misura ha un piccolo errore casuale, a volte in più e a volte in meno. Come puoi usare più misure insieme per ottenere un valore affidabile?'),
          options: [
            T('Faccio tante misure e prendo il numero in mezzo', 'Ripeti la misura e calcoli la media', 'Molte misure e la loro media: l’errore della media si riduce'),
            T('Tengo la misura più grande', 'Tieni il valore più grande', 'Tieni il valore massimo'),
            T('Tengo solo la prima', 'Tieni solo la prima misura', 'Una sola misura molto attenta basta'),
          ],
          answer: 0,
          explain: T('Giusto: gli errori un po’ in su e un po’ in giù si compensano. Il numero in mezzo si chiama <b>media</b>.', 'Giusto: nella media gli errori in eccesso e in difetto si compensano.', 'Giusto: con N misure l’incertezza della media scende come 1/√N.'),
        },
        { kind: 'num', rounds: 1, text: T('Trova il numero in mezzo.', 'Calcola la media delle tue misure.'), gen: (lens, r, sim) => mediaTue(lens, sim) },
        {
          kind: 'q', set: { fit: true },
          text: T('Il mito diceva: «se due misure sono diverse, vuol dire che una è sbagliata». Ripensa a quello che è successo con le tue tre misure del rubinetto. È vero?', 'Il mito diceva che una misura fatta bene dà sempre lo stesso risultato, e che se due misure differiscono una è sbagliata. Dopo le tue misure ripetute e la media, che cosa concludi?'),
          options: [
            T('No: misure un po’ diverse sono normali, e la media le mette d’accordo', 'Falso: le misure variano sempre un po’, e la media è il valore migliore', 'Falso: ogni misura ha un’incertezza, e la media la riduce'),
            T('Sì: le misure buone sono tutte uguali', 'Vero: le misure buone coincidono sempre', 'Vero: le misure accurate coincidono'),
          ],
          answer: 0, keepOrder: true,
          explain: T('Mito sfatato! La linea gialla è il valore vero: la media delle tue misure ci va vicinissima.', 'Mito sfatato: la linea gialla è la legge vera, 3 L a 6 s. La media delle misure ci cade vicino.', 'Mito sfatato: misurare è stimare un valore con la sua incertezza. La media si avvicina alla legge vera (linea gialla).'),
        },
      ],
      hints: [T('Guarda le barrette rosa intorno a ogni puntino.', 'Le misure sono compatibili fra loro?')],
      solution: T('Le misure diverse sono normali: si fa la media.', 'Ogni misura ha un errore casuale: si ripete e si fa la media.'),
    },
  ],
};
