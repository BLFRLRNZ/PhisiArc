// M01 · Il moto: posizione e velocità. Simulazione: la gara con il grafico spazio-tempo.
import { T, pick, num } from '../util.js';

export default {
  id: 'M01',
  title: 'Posizione e velocità',
  levels: [
    {
      id: 'm01-1', kind: 'lezione', title: 'Veloce e lento',
      sim: 'race', params: { v1: 5, v2: 10, cars: 2, D: 100 }, controls: ['v1', 'v2'],
      intro: T(
        'Due macchinine fanno una gara di <b>100 metri</b>. Scegli quanto vanno veloci e premi ▶ Lancia.',
        'La <b>velocità</b> dice quanti metri percorri ogni secondo: v = spazio / tempo. A 5 m/s fai 5 metri ogni secondo.',
        'La velocità è spazio diviso tempo. Un passo tranquillo è 1,4 m/s, Usain Bolt arrivò a 12 m/s, un ghepardo a 30.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai partire la gara. Poi prova a cambiare le velocità.', 'Fai almeno una gara. Guarda i tempi d’arrivo.') },
        {
          kind: 'q',
          text: T('Una macchinina va a 10, l’altra a 5. Chi arriva prima?', 'A 10 m/s, quanto tempo serve per fare 100 m?', 'Bolt corre i 100 m a circa 10 m/s di media. Quanto ci mette?'),
          options: [T('Quella a 5', '5 s', 'Circa 5 secondi'), T('Arrivano insieme', '20 s', 'Circa 20 secondi'), T('Quella a 10', '10 s', 'Circa 10 secondi')],
          answer: 2,
          explain: T('Esatto: più è veloce, prima arriva.', 'tempo = spazio / velocità = 100 / 10 = 10 s.', '100 m ÷ 10 m/s = 10 s. Il suo record è 9,58 s.'),
        },
      ],
      hints: [T('Fai la gara con 5 e 10 e guarda chi tocca la bandiera prima.', 'Dividi lo spazio per la velocità.')],
      solution: T('Quella a 10.', '10 s, perché t = 100 m / 10 m/s.'),
    },
    {
      id: 'm01-2', kind: 'lezione', title: 'Il grafico della gara',
      sim: 'race', params: { v1: 4, v2: 8, cars: 2, D: 100 }, controls: ['v1', 'v2'],
      intro: T(
        'Sotto la pista c’è un <b>disegno</b> della gara: più la linea sale, più la macchinina è lontana dalla partenza.',
        'Sotto la pista c’è il <b>grafico spazio-tempo</b>: in orizzontale il tempo, in verticale la posizione. Ogni macchina disegna una linea.',
        'Il <b>grafico spazio-tempo</b> racconta una gara in un’immagine: in orizzontale il tempo, in verticale dove sei.'),
      steps: [
        { kind: 'run', text: T('Guarda la gara e la sua linea.', 'Osserva come si disegnano le due linee.'), seq: [{ v1: 4, v2: 8 }], explain: T('Due linee, una per macchinina.', 'Velocità costante = linea dritta.') },
        {
          kind: 'q', text: T('La macchinina più veloce ha la linea…', 'Nel grafico spazio-tempo, la macchina più veloce ha la retta…'),
          options: [T('più in piedi (ripida)', 'più ripida (pendenza maggiore)'), T('più sdraiata', 'meno ripida'), T('dritta in orizzontale', 'orizzontale')], answer: 0,
          explain: T('Giusto: va più su in meno tempo, quindi la linea è più ripida.', 'Esatto: la <b>pendenza</b> del grafico spazio-tempo è la velocità. Una linea orizzontale vuol dire fermo.'),
        },
        {
          kind: 'q', only: ['s', 'c'], text: 'E una linea orizzontale cosa vuol dire?',
          options: ['Va velocissimo', 'È fermo', 'Torna indietro'], answer: 1, explain: 'Il tempo passa ma la posizione non cambia: è fermo.',
        },
      ],
      hints: [T('Guarda quale linea arriva prima in alto.')],
      solution: T('Più ripida.', 'Più ripida: la pendenza è la velocità.'),
    },
    {
      id: 'm01-3', kind: 'prevedi', title: 'Dov’è la lenta?',
      sim: 'race', params: { v1: 4, v2: 8, cars: 2, D: 100 }, controls: ['v1', 'v2'],
      intro: T('La blu va a 4, l’arancione a 8: il doppio. Fai la tua previsione!', 'Blu a 4 m/s, arancione a 8 m/s. Prevedi prima di guardare.'),
      steps: [
        {
          kind: 'q',
          text: T('Quando l’arancione arriva al traguardo (100 m), dove si trova la blu?', 'Quando l’arancione taglia il traguardo (100 m), a che posizione è la blu?'),
          options: [T('All’inizio, a 25 m', 'a 25 m'), T('A metà, a 50 m', 'a 50 m'), T('Quasi alla fine, a 75 m', 'a 75 m')], answer: 1,
          predict: [{ v1: 4, v2: 8 }],
          explain: T('A metà! Va a metà velocità, quindi nello stesso tempo fa metà strada.', 'L’arancione arriva in 100/8 = 12,5 s. In 12,5 s la blu fa 4 × 12,5 = 50 m. Metà velocità, metà strada.'),
        },
      ],
      hints: [T('Una va il doppio dell’altra.', 'Calcola prima il tempo dell’arancione.')],
      solution: T('A metà, 50 m.'),
    },
    {
      id: 'm01-4', kind: 'costruisci', title: 'Il trenino del parco',
      sim: 'race', params: { v1: 5, cars: 1, D: 60, names: ['trenino'] }, controls: ['v1'], labels: { v1: 'Velocità del trenino' },
      intro: T('Il parco ha un <b>trenino</b> lungo un binario di 60 metri. Il custode vuole che il viaggio duri un tempo preciso.', 'Nuovo pezzo del parco: un trenino su un binario di <b>60 m</b>. Scegli la velocità per un viaggio della durata richiesta.'),
      piece: { id: 'trenino', icon: '🚂', name: 'Il trenino', desc: 'Percorre i suoi 60 metri nel tempo che hai calcolato.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la velocità e lancia il trenino.', 'Imposta la velocità e lancia. La seconda prova avrà un tempo diverso.'),
          gen: (lens, r) => { const t = pick(r === 0 ? [6, 10, 12] : [8, 15, 20]); return { t, text: `Il viaggio di 60 m deve durare <b>${t} secondi</b>.` }; },
          check: (res, tg, lens) => {
            const t = res.times[0];
            const tol = lens === 'e' ? 0.6 : 0.3;
            if (t != null && Math.abs(t - tg.t) <= tol) return { ok: true, msg: `Arrivato in ${num(t, 1)} s. Puntualissimo!` };
            return { ok: false, msg: t == null ? 'Il trenino non è arrivato: è troppo lento.' : t > tg.t ? `Ci ha messo ${num(t, 1)} s: troppo lento.` : `Ci ha messo ${num(t, 1)} s: troppo veloce.` };
          },
        },
      ],
      hints: [T('Se il viaggio è troppo lungo, alza la velocità.', 'Velocità = spazio / tempo.'), T('Per fare 60 metri in 10 secondi, quanti metri ogni secondo?', 'Per 60 m in 12 s: 60 / 12 = ?')],
      solution: T('Dividi 60 per i secondi: per 10 secondi serve 6, per 12 secondi serve 5.', 'v = 60 m / t. Per 12 s → 5 m/s; per 15 s → 4 m/s; per 8 s → 7,5 m/s.'),
    },
    {
      id: 'm01-5', kind: 'ripasso', title: 'Ripasso del moto',
      intro: T('Ripassiamo velocità, grafici e misure!', 'Ripasso: velocità, grafici, unità.'),
      steps: [
        { kind: 'q', text: T('Cosa dice la velocità?', 'Che cosa misura la velocità?'), options: [T('Quanto sei pesante', 'La massa'), T('Quanta strada fai in un secondo', 'Lo spazio percorso in ogni unità di tempo'), T('Quanto sei lontano da casa', 'La posizione')], answer: 1, explain: T('Esatto!', 'Esatto: v = Δs / Δt.') },
        { kind: 'q', text: T('Una macchinina è ferma. La sua linea nel disegno è…', 'Un oggetto fermo nel grafico spazio-tempo è…'), options: [T('ripida', 'una retta ripida'), T('orizzontale', 'una retta orizzontale'), T('in discesa', 'una retta in discesa')], answer: 1, explain: T('Giusto: il tempo passa, lei resta lì.', 'Giusto: la posizione non cambia.') },
        { kind: 'q', only: ['s', 'c'], text: '36 km/h quanti m/s sono?', options: ['10 m/s', '36 m/s', '3,6 m/s'], answer: 0, explain: '36 km/h = 36.000 m / 3600 s = 10 m/s. Basta dividere per 3,6.' },
        { kind: 'q', text: T('Per sapere chi è più veloce, cosa misuri?', 'Per confrontare due velocità, cosa misuri?'), options: [T('Spazio e tempo', 'Spazio e tempo'), T('Solo il colore', 'Solo la massa'), T('Solo il tempo', 'Solo la forma')], answer: 0, explain: T('Proprio così: due misure insieme.', 'Esatto: la velocità è un rapporto tra due misure.') },
      ],
      hints: [T('Ripensa alla gara e al suo grafico.')],
    },
    {
      id: 'm01-6', kind: 'boss', title: 'Il mito del più veloce',
      sim: 'race', params: { v1: 8, v2: 5, x1: 0, x2: 50, cars: 2, D: 100 }, controls: [],
      intro: T(
        'Sono Dubbia. Al bar del parco dicono: <i>“Chi va più veloce arriva sempre primo!”</i>. Sempre sempre?',
        'Sono Dubbia. Un tifoso giura: <i>“Vince sempre la macchina più veloce”</i>. Sempre?',
        'Sono Dubbia. <i>“Il più veloce arriva sempre prima”</i>: sembra logica pura. Ma è tutta la storia?'),
      steps: [
        {
          kind: 'q', text: T('La blu va a 8, l’arancione a 5. Ma l’arancione parte <b>a metà pista</b>. Chi arriva prima?', 'Blu a 8 m/s da 0 m; arancione a 5 m/s ma parte da <b>50 m</b>. Chi arriva prima ai 100 m?'),
          options: [T('La blu, è più veloce', 'La blu'), T('L’arancione', 'L’arancione'), T('Arrivano insieme', 'Arrivano insieme')], answer: 1,
          predict: [{ v1: 8, v2: 5, x1: 0, x2: 50 }],
          explain: T('Vince l’arancione! Aveva meno strada da fare.', 'Arancione: 50 / 5 = 10 s. Blu: 100 / 8 = 12,5 s. Vince l’arancione.'),
        },
        {
          kind: 'q', text: T('Allora chi arriva prima dipende…', 'Il tempo di arrivo dipende da…'),
          options: [T('solo dalla velocità', 'solo dalla velocità'), T('dalla velocità e da quanta strada c’è da fare', 'dalla velocità e dalla distanza da percorrere'), T('dal colore della macchina', 'dalla massa della macchina')], answer: 1,
          explain: T('Mito smontato! Conta anche da dove parti.', 'Mito smontato: t = distanza / velocità. Conta anche la distanza.'),
        },
      ],
      hints: [T('Dubbia chiede: quanta strada deve fare ognuna?'), T('Dubbia chiede: quanto tempo ci mette ognuna a fare la sua strada?')],
      solution: T('L’arancione arriva prima (10 s contro 12,5 s): conta anche la distanza.'),
    },
  ],
};
