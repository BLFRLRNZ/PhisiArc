// F03 · Grafici e proporzionalità, con gli errori di misura. Simulazione: il laboratorio dei grafici.
import { T, pick, num } from '../util.js';
import { t } from '../i18n.js';

const TEMPO = { label: 'Tempo aperto', min: 1, max: 10, step: 0.5, unit: 's' };
const VEL = (min, max) => ({ label: 'Velocità', min, max, step: 1, unit: 'm/s' });

// tre misure "vere" con un piccolo errore, e la loro media
const media3 = (lens) => {
  if (lens === 'e') {
    const m = pick([4, 5, 6, 7]), d = pick([1, 2]);
    return { text: t('Tre misure della stessa corsa: <b>{a} s</b>, <b>{m} s</b> e <b>{b} s</b>. Quale numero sta <b>in mezzo</b>?', { a: m - d, m, b: m + d }), ans: m, tol: 0, unit: 's', explain: t('Giusto: {m} sta in mezzo. Gli scienziati lo chiamano <b>media</b>.', { m }) };
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
        { kind: 'free', runs: 3, distinct: true, text: T('Fai almeno <b>tre prove</b>, con tempi diversi: 2 secondi, 4 secondi, 8 secondi…', 'Fai almeno tre prove con tempi diversi e guarda dove finiscono i punti.') },
        {
          kind: 'q', review: false, set: { fit: true },
          text: T('Guarda i puntini sul grafico. Come sono messi?', 'Ogni prova diventa un punto: in orizzontale il tempo di apertura del rubinetto, in verticale i litri raccolti. Guarda i punti tutti insieme, come se li unissi con una riga. Come sono disposti?', 'Ogni prova è un punto: tempo di apertura in orizzontale, litri raccolti in verticale. Se li unisci, che forma descrivono?'),
          options: [
            T('In fila, su una linea dritta', 'Su una retta che passa per l’origine', 'Una retta per l’origine'),
            T('Sparsi qua e là, senza un ordine', 'Sparsi senza un ordine', 'Nessuna forma riconoscibile'),
            T('Su una linea che scende', 'Su una curva che scende', 'Un’iperbole che scende'),
          ],
          answer: 0,
          explain: T('Giusto! Doppio tempo, doppia acqua. Quando succede così si dice che le due cose sono <b>direttamente proporzionali</b>.', 'Giusto: se il tempo raddoppia, anche i litri raddoppiano. È la <b>proporzionalità diretta</b>, e il suo grafico è sempre una retta che passa per l’origine.', 'Giusto: ogni secondo esce mezzo litro, quindi tempo doppio, acqua doppia. È una <b>proporzionalità diretta</b>: sul grafico, una retta che parte da zero. [[litri = 0,5 L/s · tempo: il rapporto fra litri e tempo è costante, ed è la pendenza della retta.]]'),
          wrong: T('Guarda bene: la linea gialla tratteggiata passa proprio sui puntini.', 'Segui la linea tratteggiata: tocca tutti i punti.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Usa quello che hai scoperto.', 'Usa la proporzionalità.'),
          gen: (lens) => {
            const tt = pick(lens === 'e' ? [4, 6, 8] : [2, 4, 6]), k = pick([2, 3]);
            return lens === 'e'
              ? { text: t('In <b>{t} secondi</b> il rubinetto dà <b>{l:1} litri</b>. Se lo tieni aperto <b>{t2} secondi</b>, quanti litri dà?', { t: tt, l: tt / 2, t2: tt * k }), ans: (tt * k) / 2, tol: 0, unit: t('litri'), explain: t('Giusto: il tempo è {k} volte tanto, quindi anche l’acqua: {l:1} litri.', { k, l: (tt * k) / 2 }) }
              : { text: t('Il rubinetto ha una portata costante, quindi litri e tempo sono direttamente proporzionali. In <b>{t} s</b> escono <b>{l:1} L</b>. Quanti litri escono in <b>{t2:1} s</b>?', { t: tt, l: tt / 2, t2: tt * k * 0.75 }), ans: (tt * k * 0.75) / 2, tol: 0.01, unit: 'L', explain: t('Esatto: il rapporto è 0,5 L/s, quindi 0,5 × {t2:1} = {l} L.', { t2: tt * k * 0.75, l: (tt * k * 0.75) / 2 }) };
          },
        },
      ],
      hints: [T('Se raddoppi il tempo, cosa succede all’acqua?', 'Quanti litri escono in 1 secondo? Moltiplica per i secondi.')],
      solution: T('Ogni 2 secondi esce 1 litro: doppio tempo, doppia acqua.', 'litri = 0,5 × tempo: proporzionalità diretta.', 'Mezzo litro ogni secondo: doppio tempo, doppia acqua. [[litri = 0,5 × tempo]]'),
    },
    {
      id: 'f03-2', kind: 'lezione', title: 'Doppio, metà',
      sim: 'lab', params: { mode: 'viaggio', x: 5, noise: false }, controls: ['x'], labels: { x: VEL(2, 20) },
      intro: T(
        'Ora una gara sul rettilineo del parco: <b>60 metri</b>. Scegli quanto va veloce la macchinina e guarda quanto tempo ci mette. La velocità si misura in <b>metri al secondo</b> (m/s): a 5 m/s fa 5 metri ogni secondo.',
        'La macchinina percorre sempre <b>60 m</b>. La velocità è in <b>metri al secondo</b> (m/s): a 5 m/s fa 5 metri ogni secondo. Cambiala e misura il tempo: sul grafico, velocità in orizzontale e tempo in verticale.',
        'Percorso fisso di 60 m, velocità a scelta in metri al secondo (m/s): quanti metri fa ogni secondo. Che legame c’è fra velocità e tempo impiegato?'),
      steps: [
        { kind: 'free', runs: 3, distinct: true, text: T('Fai almeno <b>tre corse</b> a velocità diverse. Ogni corsa lascia un puntino: più a destra se è veloce, più in alto se dura tanto.', 'Fai almeno tre corse a velocità diverse.') },
        {
          kind: 'q', predict: [{ x: 5 }, { x: 10 }],
          text: T('La macchinina rifà la stessa strada al <b>doppio</b> della velocità. Il tempo che ci mette…', 'La distanza è sempre 60 m. Se la velocità passa da 5 a 10 m/s, cioè raddoppia, che cosa succede al tempo del viaggio?', 'Stesso tragitto, velocità doppia: come fare la solita strada in bici invece che a piedi di buon passo. Il tempo del viaggio…'),
          options: [T('diventa la metà', 'si dimezza'), T('diventa il doppio', 'raddoppia'), T('resta uguale', 'resta uguale')],
          answer: 0,
          explain: T('Giusto: più veloce, meno tempo. Doppia velocità, metà tempo!', 'Da 12 s a 6 s: doppia velocità, metà tempo.', 'Da 12 secondi a 6: a velocità doppia, lo stesso tragitto dura la metà. [[t = 60 m / v]]'),
        },
        {
          kind: 'q', review: false, set: { fit: true },
          text: T('Unisci i puntini delle corse, da sinistra a destra. Che linea viene?', 'Sul grafico la velocità è in orizzontale e il tempo del viaggio in verticale. Unisci i punti delle tue corse, dalla più lenta alla più veloce. Che forma ha il grafico?', 'Guarda i punti delle tue corse: più veloci a destra, più lunghe in alto. Che andamento hanno?'),
          options: [
            T('Una linea dritta che sale', 'Una retta che sale'),
            T('Una curva che scende', 'Una curva che scende, sempre meno ripida', 'Una curva che scende, sempre più piatta'),
            T('Una linea piatta', 'Una retta orizzontale', 'Una retta che scende'),
          ],
          answer: 1,
          explain: T('Esatto! Quando una cosa raddoppia e l’altra si dimezza, si dice che sono <b>inversamente proporzionali</b>.', 'Esatto: velocità × tempo fa sempre 60. È la <b>proporzionalità inversa</b>, e il suo grafico è una curva che scende (un’iperbole).', 'Esatto: quando la velocità raddoppia, il tempo si dimezza. È una <b>proporzionalità inversa</b>; la sua curva si chiama iperbole, e scende senza mai toccare gli assi. [[v · t = 60 m, cioè t = 60 / v]]'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T('Sempre gli stessi 60 metri: a 4 m/s la macchinina ci mette 15 s. Ora va a 12 m/s, cioè 3 volte più veloce. Quanto tempo le serve?', 'Distanza fissa: a 4 m/s servono 15 s. Velocità e tempo sono inversamente proporzionali: se una si moltiplica per un numero, l’altro si divide per lo stesso numero. Quanto tempo serve a 12 m/s?', 'A piedi ci metti 15 minuti per arrivare al lavoro. In bici vai tre volte più veloce. Quanto ci metti?'),
          options: [T('5 s', null, '5 minuti'), T('45 s', null, '45 minuti'), T('3 s', null, '3 minuti')],
          answer: 0,
          explain: T('Giusto: velocità tripla, tempo diviso per 3. Controllo: 12 × 5 = 60 m.', null, 'Giusto: velocità tripla, tempo diviso per 3.'),
          wrong: T('Se vai più veloce, il tempo deve diminuire. Di quanto?'),
        },
      ],
      hints: [T('Più veloce vuol dire più tempo o meno tempo?', 'Moltiplica velocità e tempo: cosa ottieni ogni volta?')],
      solution: T('Doppia velocità, metà tempo: proporzionalità inversa.', 'v × t = 60 m sempre: proporzionalità inversa.', 'Velocità per tempo dà sempre 60 metri: se una raddoppia, l’altro si dimezza. [[v · t = 60 m]]'),
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
          text: T('A 10 m/s l’auto si ferma in <b>7 metri</b>. Al <b>doppio</b> della velocità, quanti metri le servono?', 'Lo <b>spazio di frenata</b> è la strada che l’auto fa da quando frena a quando si ferma. Con la stessa frenata, a 10 m/s è circa 7 m. Prevedi: a 20 m/s, il doppio della velocità, quanto sarà?', 'In città un’auto va a 10 m/s e si ferma in circa 7 metri. In tangenziale va al doppio, 20 m/s. Con la stessa frenata, quanti metri le servono?'),
          options: [T('14 metri: il doppio', 'Circa 14 m (il doppio)'), T('28 metri: quattro volte', 'Circa 28 m (quattro volte)'), T('7 metri: uguale a prima', 'Circa 7 m (uguale)')],
          answer: 1,
          explain: T('Quattro volte! Doppia velocità, frenata quattro volte più lunga. Ecco perché in città bisogna andare piano.', 'Quattro volte: 7 m diventano 28,6 m. Raddoppiando la velocità lo spazio di frenata si quadruplica.', 'Quattro volte. Lo spazio di frenata cresce con il quadrato della velocità: per questo un piccolo eccesso di velocità allunga molto la frenata. [[d = v²/(2a), dove a dice quanto frena l’auto: con v doppia, v² è quadruplo.]]'),
        },
        { kind: 'free', runs: 2, distinct: true, set: { fit: true }, text: T('Prova altre velocità e guarda la linea gialla.', 'Aggiungi almeno due punti e osserva la curva gialla.') },
        {
          kind: 'q', review: false,
          text: T('La linea gialla unisce i punti delle frenate. Che forma ha?', 'Il grafico mette la velocità in orizzontale e lo spazio di frenata in verticale. Guarda come cresce la curva gialla quando la velocità aumenta: sempre allo stesso modo, o sempre più in fretta? Che grafico è?', 'Hai visto che, raddoppiando la velocità, lo spazio di frenata non raddoppia soltanto. Che legame c’è fra lo spazio di frenata e la velocità?'),
          options: [
            T('Una curva sempre più ripida', 'Una curva che sale sempre più ripida (parabola)', 'Proporzionale al quadrato della velocità'),
            T('Una linea dritta, come per il rubinetto', 'Una retta per l’origine', 'Direttamente proporzionale alla velocità'),
            T('Una curva che scende', 'Una curva che scende', 'Inversamente proporzionale alla velocità'),
          ],
          answer: 0,
          explain: T('Giusto: più vai forte, più la frenata si allunga, e sempre più in fretta.', 'Giusto: è una <b>proporzionalità quadratica</b>. Il grafico è una parabola: triplicando la velocità lo spazio diventa 9 volte.', 'Giusto: velocità doppia, frenata quadrupla; velocità tripla, nove volte. È una proporzionalità quadratica: sul grafico, una curva che sale sempre più ripida (un ramo di parabola). [[d ∝ v²]]'),
          wrong: T('Guarda la distanza fra i puntini: a velocità alte la linea sale molto di più.', 'Una retta vorrebbe dire “doppio, doppio”. Che cosa hai visto a 10 e a 20 m/s?'),
        },
      ],
      hints: [T('Guarda bene i due esperimenti: quanto è lunga la frenata a 20 m/s rispetto a 10 m/s?', 'Confronta d(20) e d(10): che rapporto c’è?')],
      solution: T('Doppia velocità, frenata quattro volte più lunga.', 'Spazio di frenata ∝ v²: con v doppia, quattro volte.', 'Lo spazio di frenata cresce con il quadrato della velocità: a velocità doppia, quattro volte tanto. [[d ∝ v²]]'),
    },
    {
      id: 'f03-4', kind: 'costruisci', title: 'La fontana del parco',
      sim: 'lab', params: { mode: 'rubinetto', x: 3, noise: false, keep: true }, controls: ['x'], labels: { x: TEMPO },
      intro: T('Nuovo pezzo per il parco: la <b>fontana</b>! La vasca deve ricevere proprio l’acqua giusta, né troppa né poca. Il rubinetto dà <b>1 litro ogni 2 secondi</b>.', 'Nuovo pezzo del parco: la <b>fontana</b>. Il rubinetto eroga <b>0,5 L/s</b>. Scegli per quanto tempo aprirlo per avere i litri richiesti.', 'Nuovo pezzo del parco: la <b>fontana</b>. Dal rubinetto esce mezzo litro al secondo: trova per quanto tempo aprirlo.'),
      piece: { id: 'fontana', name: 'La fontana', desc: 'Getti d’acqua che riempiono la vasca con la quantità esatta che hai calcolato.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli il tempo e apri il rubinetto.', 'Regola il tempo di apertura e lancia. La seconda prova chiederà un volume diverso.'),
          // all'Esploratore solo litri interi
          vals: { e: { L: [[2, 3], [4]] }, s: { L: [[1.5, 2, 2.5, 3], [1.75, 3.5, 4, 4.5]] } },
          ask: T('La vasca deve ricevere <b>{L} litri</b>.'),
          measure: 'y', goal: 'L', tol: 0.12,
          ok: T('{got} litri: la fontana è perfetta!'),
          high: T('{got} litri: troppa acqua, la vasca trabocca. Chiudi prima il rubinetto.', '{got} litri: troppa acqua, la vasca trabocca. Il tempo va ridotto: di quanto?'),
          low: T('{got} litri: troppo poca. Lascia aperto più a lungo.', '{got} litri: troppo poca. Il tempo va aumentato: di quanto?'),
          solve: { x: '2 * L' },
        },
      ],
      hints: [
        T('Ogni 2 secondi esce 1 litro. Quindi per 2 litri servono…', 'Il tempo è proporzionale ai litri: per 1 L servono 2 s.'),
        T('Il tempo è il doppio dei litri: per 3 litri, 6 secondi.', 'tempo = litri / 0,5 L/s = 2 × litri.', 'I secondi sono sempre il doppio dei litri.'),
      ],
      solution: T('Il tempo è sempre il doppio dei litri: 2 litri → 4 s, 3 litri → 6 s, 4 litri → 8 s.', 't = V / 0,5 L/s: 1,75 L → 3,5 s; 2,5 L → 5 s; 4 L → 8 s.', 'I secondi sono il doppio dei litri: 1,75 L → 3,5 s; 2,5 L → 5 s; 4 L → 8 s. [[t = V / 0,5 L/s]]'),
    },
    {
      id: 'f03-5', kind: 'ripasso', title: 'Ripasso dei grafici',
      intro: T('Ripassiamo grafici, doppi e metà!', 'Ripasso: grafici, proporzionalità e misure.'),
      steps: [
        {
          kind: 'q',
          text: T('2 biglietti costano 6 €, 4 biglietti 12 €. Sul grafico, che linea viene?', 'Ogni biglietto costa 3 €, quindi il costo è <b>direttamente proporzionale</b> al numero di biglietti: se uno raddoppia, raddoppia anche l’altro. Con i biglietti in orizzontale e il costo in verticale, il grafico è…', 'Al distributore la benzina ha un prezzo fisso al litro. Sul grafico «litri messi – euro spesi», che linea viene?'),
          options: [T('una linea dritta', 'una retta per l’origine', 'Una retta che parte da zero'), T('una curva che scende', 'un’iperbole', 'Una curva che scende'), T('una curva sempre più ripida', 'una parabola', 'Una curva sempre più ripida')],
          answer: 0, explain: T('Giusto: doppi biglietti, doppia spesa.', 'Giusto: proporzionalità diretta, retta per l’origine.', 'Giusto: litri doppi, spesa doppia. È la proporzionalità diretta.'),
        },
        {
          kind: 'q',
          text: T('Dividi una torta in parti uguali fra gli amici. Se gli amici raddoppiano, la tua fetta…', 'La torta è sempre una, divisa in parti uguali: la fetta è <b>inversamente proporzionale</b> al numero di amici, cioè quando uno cresce l’altra cala nella stessa proporzione. Se gli amici raddoppiano, la fetta…', 'Dividete il conto del ristorante in parti uguali. Se i commensali raddoppiano, a parità di conto, la quota di ognuno…'),
          options: [T('diventa la metà', 'la fetta si dimezza', 'si dimezza'), T('diventa il doppio', 'la fetta raddoppia', 'raddoppia'), T('resta uguale', 'la fetta resta uguale', 'resta uguale')],
          answer: 0, explain: T('Giusto: doppi amici, metà fetta.', 'Giusto: proporzionalità inversa, il prodotto resta costante (una torta).', 'Giusto: proporzionalità inversa. Quota per commensali dà sempre lo stesso conto.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T('Due grandezze sono legate così: quando una diventa il triplo, anche l’altra diventa il triplo; quando una si dimezza, si dimezza anche l’altra. Nel Laboratorio hai visto tre tipi di legame: diretto, inverso e quadratico. Quale è questo?', null, 'Una ricetta per 4 persone chiede 300 g di farina; per 12 persone ne servono 900 g. Che legame c’è fra persone e farina?'),
          options: [T('Diretta', null, 'Diretto: triplo l’uno, triplo l’altra'), T('Inversa', null, 'Inverso: più persone, meno farina'), T('Quadratica', null, 'Quadratico: triplo l’uno, nove volte l’altra')],
          answer: 0, explain: T('Giusto: rapporto costante, proporzionalità diretta. Con un legame quadratico diventerebbe 9 volte più grande.', null, 'Giusto: il rapporto resta costante, 75 g a persona. Con un legame quadratico, per il triplo delle persone servirebbe nove volte la farina.'),
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
          text: T('Tre prove uguali, ma i litri cambiano di poco. Che cosa vuol dire?', 'Hai ripetuto la stessa misura tre volte, nelle stesse condizioni, e hai ottenuto valori leggermente diversi. Nessuno ha sbagliato apposta. Perché succede?', 'Sali tre volte di fila sulla bilancia del bagno: 71,8 kg, 72,1 kg, 71,9 kg. Con il rubinetto è successo lo stesso. Perché?'),
          options: [
            T('È normale: succede sempre', 'Ogni misura ha un piccolo errore casuale: succede sempre', 'Ogni misura ha un piccolo errore casuale'),
            T('Una misura è sbagliata: va buttata', 'Almeno una misura è sbagliata e va scartata', 'Almeno una misura è sbagliata di grosso'),
            T('Il rubinetto si è rotto', 'La legge cambia ogni volta', 'Il peso e l’acqua cambiano davvero ogni volta'),
          ],
          answer: 0,
          explain: T('Giusto! Nessuna misura è perfetta: un cronometro premuto un attimo prima, una goccia in più… Gli scienziati lo sanno, e non si arrabbiano.', 'Giusto: ogni strumento e ogni persona introduce un piccolo <b>errore casuale</b>. Le barrette rosa mostrano quanto può valere.', 'Giusto: è l’<b>incertezza di misura</b>, e non si può eliminare del tutto. Le barrette rosa (±7%) mostrano l’intervallo in cui cade probabilmente il valore vero.'),
          wrong: T('Guarda le barrette rosa: tutte le misure sono vicine, nessuna è “fuori”.', 'Le misure sono tutte vicine e compatibili con le barre d’errore: nessuna è un errore grossolano.'),
        },
        {
          kind: 'q',
          text: T('Tre misure un po’ diverse. Di quale numero ti fidi di più?', 'Ogni misura ha un piccolo errore casuale, a volte in più e a volte in meno. Come puoi usare più misure insieme per ottenere un valore affidabile?', 'I sondaggi intervistano mille persone, non dieci. Con le misure è lo stesso: come si ottiene un valore di cui fidarsi?'),
          options: [
            T('Di quello in mezzo', 'Ripeti la misura e calcoli la media', 'Tante misure, e se ne fa la media'),
            T('Del più grande', 'Tieni il valore più grande', 'Si tiene il valore più alto'),
            T('Del primo che è uscito', 'Tieni solo la prima misura', 'Ne basta una, fatta con molta attenzione'),
          ],
          answer: 0,
          explain: T('Giusto: gli errori un po’ in su e un po’ in giù si compensano. Il numero in mezzo si chiama <b>media</b>.', 'Giusto: nella media gli errori in eccesso e in difetto si compensano.', 'Giusto: gli errori in più e in meno si compensano, e la media di tante misure è più affidabile di ognuna. [[Con N misure l’incertezza della media scende come 1/√N: per dimezzarla servono quattro volte le misure.]]'),
        },
        { kind: 'num', rounds: 1, text: T('Trova il numero in mezzo.', 'Calcola la media delle tue misure.'), gen: (lens, r, sim) => mediaTue(lens, sim) },
        {
          kind: 'q', set: { fit: true },
          text: T('Il mito diceva: «se due misure sono diverse, una è sbagliata». È vero?', 'Il mito diceva che una misura fatta bene dà sempre lo stesso risultato, e che se due misure differiscono una è sbagliata. Dopo le tue misure ripetute e la media, che cosa concludi?', '«Se due misure sono diverse, una è sbagliata». Dopo il rubinetto e la bilancia del bagno, che cosa ne pensi?'),
          options: [
            T('No: un po’ diverse è normale', 'Falso: le misure variano sempre un po’, e la media è il valore migliore', 'Falso: un po’ di differenza c’è sempre, e la media la riduce'),
            T('Sì: le misure buone sono tutte uguali', 'Vero: le misure buone coincidono sempre', 'Vero: le misure fatte bene coincidono'),
          ],
          answer: 0,
          explain: T('Mito sfatato! La linea gialla è il valore vero: la media delle tue misure ci va vicinissima.', 'Mito sfatato: la linea gialla è la legge vera, 3 L a 6 s. La media delle misure ci cade vicino.', 'Mito sfatato: misurare è stimare un valore con la sua incertezza. La media si avvicina alla legge vera (linea gialla).'),
        },
      ],
      hints: [T('Guarda le barrette rosa intorno a ogni puntino.', 'Le misure sono compatibili fra loro?')],
      solution: T('Le misure diverse sono normali: si fa la media.', 'Ogni misura ha un errore casuale: si ripete e si fa la media.'),
    },
  ],
};
