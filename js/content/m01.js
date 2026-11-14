// M01 · Il moto: posizione e velocità. Simulazione: la gara con il grafico spazio-tempo.
import { T, pick } from '../util.js';
import { t as tr } from '../i18n.js';

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
          text: T('Due macchinine fanno la stessa gara di 100 metri e partono insieme. Una va a 10 metri al secondo, l’altra a 5: ogni secondo, la prima fa il doppio della strada. Chi arriva prima al traguardo?', 'La velocità dice quanti metri fai ogni secondo. Una macchinina va a 10 m/s, cioè 10 metri ogni secondo, e la pista è lunga 100 m. Quanto tempo le serve per arrivare in fondo?', 'Usain Bolt, l’uomo più veloce del mondo, corre i 100 metri a una velocità media di circa 10 m/s. Ricordando che il tempo è lo spazio diviso la velocità, quanto ci mette?'),
          options: [T('Quella a 5', '5 s', 'Circa 5 secondi'), T('Arrivano insieme', '20 s', 'Circa 20 secondi'), T('Quella a 10', '10 s', 'Circa 10 secondi')],
          answer: 2,
          explain: T('Esatto: più è veloce, prima arriva.', 'tempo = spazio / velocità = 100 / 10 = 10 s.', '100 m ÷ 10 m/s = 10 s. Il suo record è 9,58 s.'),
        },
        {
          // km/h e m/s: si spiega qui, così il Ripasso può chiederlo.
          kind: 'q',
          text: T(
            'Le auto vere usano i <b>km/h</b>, chilometri all’ora. Un trucco: per passare ai metri al secondo si divide per <b>3,6</b>. Così 36 km/h fanno 10 m/s. Quanto fa <b>18 km/h</b>?',
            'In un’ora ci sono 3600 s e in un km 1000 m, quindi 1 m/s = 3,6 km/h: da km/h a m/s si <b>divide per 3,6</b>. Quanto fa <b>18 km/h</b> in m/s?',
            'Il tachimetro segna km/h, la fisica usa m/s. Un’ora ha 3600 s e un km 1000 m: 1 m/s = 3,6 km/h. Una bici a <b>18 km/h</b> va a…'),
          options: [T('5 m/s', '5 m/s', '5 m/s'), T('18 m/s', '18 m/s', '18 m/s'), T('65 m/s', '64,8 m/s', 'circa 65 m/s')],
          answer: 0,
          wrong: T('Dividi per 3,6, non moltiplicare.', 'Da km/h a m/s si divide per 3,6.'),
          explain: T('Giusto: 18 ÷ 3,6 = 5. La bici fa 5 metri ogni secondo.', '18 / 3,6 = 5 m/s. Al contrario, da m/s a km/h si moltiplica per 3,6.', '18 ÷ 3,6 = 5 m/s: cinque metri ogni secondo.'),
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
          kind: 'q', text: T('Sotto la pista, ogni macchinina disegna la sua linea: più va avanti, più la linea sale. La macchinina veloce in un secondo fa più strada, quindi la sua linea sale più in fretta. Com’è la sua linea, rispetto a quella della lenta?', 'Nel grafico spazio-tempo il tempo è in orizzontale e la posizione in verticale: in ogni secondo la linea sale di tanti metri quanti ne fa la macchina. Allora la macchina più veloce ha la retta…'),
          options: [T('più in piedi (ripida)', 'più ripida'), T('più sdraiata', 'meno ripida'), T('dritta in orizzontale', 'orizzontale')], answer: 0,
          explain: T('Giusto: va più su in meno tempo, quindi la linea è più ripida.', 'Esatto: la <b>pendenza</b> del grafico spazio-tempo è la velocità. Una linea orizzontale vuol dire fermo.'),
        },
        {
          kind: 'q', only: ['s', 'c'], text: 'Immagina che a un certo punto la linea di una macchina diventi orizzontale: il tempo passa, ma la posizione resta sempre la stessa. Che cosa sta facendo la macchina?',
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
          text: T('La blu va a 4 m/s, l’arancione a 8 m/s, il doppio. Partono insieme. Nello stesso tempo, la blu fa sempre la metà della strada dell’arancione. Quando l’arancione arriva al traguardo, a 100 m, dove si trova la blu?', 'Blu a 4 m/s, arancione a 8 m/s, stessa partenza. L’arancione arriva ai 100 m dopo un certo tempo: in quello stesso tempo, quanta strada ha fatto la blu? A che posizione si trova?'),
          options: [T('All’inizio, a 25 m', 'a 25 m'), T('A metà, a 50 m', 'a 50 m'), T('Quasi alla fine, a 75 m', 'a 75 m')], answer: 1,
          predict: [{ v1: 4, v2: 8 }],
          explain: T('A metà! Va a metà velocità, quindi nello stesso tempo fa metà strada.', 'L’arancione arriva in 100/8 = 12,5 s. In 12,5 s la blu fa 4 × 12,5 = 50 m. Metà velocità, metà strada.'),
        },
        {
          // velocità relativa: chi insegue recupera ogni secondo la differenza delle velocità
          kind: 'q',
          text: T(
            'Ora un inseguimento! La blu va a <b>10 m/s</b>, l’arancione a <b>6 m/s</b>, ma parte con <b>20 metri di vantaggio</b>. Ogni secondo la blu recupera 4 metri, perché va 4 m/s più forte. Dopo quanti secondi la raggiunge?',
            'Inseguimento: la blu parte da 0 m a 10 m/s, l’arancione da 20 m a 6 m/s. La distanza fra le due cala di 4 m ogni secondo, cioè la differenza fra le velocità. Dopo quanto tempo la blu la raggiunge?',
            'Blu a 10 m/s da 0 m, arancione a 6 m/s da 20 m. Nel grafico spazio-tempo il sorpasso è il punto in cui le due rette si incrociano. A che istante avviene?'),
          options: [T('Dopo 2 secondi', 'Dopo 2 s', 'Dopo 2 s'), T('Dopo 5 secondi', 'Dopo 5 s', 'Dopo 5 s'), T('Dopo 10 secondi', 'Dopo 10 s', 'Dopo 10 s')], answer: 1,
          predict: [{ v1: 10, v2: 6, x2: 20 }],
          explain: T(
            'Dopo 5 secondi: ogni secondo la blu recupera 4 metri (10 meno 6), e 20 metri si recuperano in 5 secondi. Sul grafico è dove le linee si incrociano.',
            'Dopo 5 s. Vista dall’arancione, la blu si avvicina a 10 − 6 = 4 m/s: è la <b>velocità relativa</b>. 20 m / 4 m/s = 5 s. Sul grafico, le rette si incrociano lì.',
            'Dopo 5 s: la <b>velocità relativa</b> è 10 − 6 = 4 m/s, e 20 m / 4 m/s = 5 s, a 50 m dalla partenza. Le rette x(t) si incrociano proprio lì.'),
        },
      ],
      hints: [T('Una va il doppio dell’altra. Nell’inseguimento: quanti metri recupera la blu ogni secondo?', 'Calcola prima il tempo dell’arancione. Nell’inseguimento usa la differenza delle velocità.')],
      solution: T('A metà, 50 m.'),
    },
    {
      id: 'm01-4', kind: 'costruisci', title: 'Il trenino del parco',
      sim: 'race', params: { v1: 5, cars: 1, D: 60, names: ['trenino'] }, controls: ['v1'], labels: { v1: 'Velocità del trenino' },
      intro: T('Il parco ha un <b>trenino</b> lungo un binario di 60 metri. Il custode vuole che il viaggio duri un tempo preciso.', 'Nuovo pezzo del parco: un trenino su un binario di <b>60 m</b>. Scegli la velocità per un viaggio della durata richiesta.'),
      piece: { id: 'trenino', name: 'Il trenino', desc: 'Percorre i suoi 60 metri nel tempo che hai calcolato.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la velocità e lancia il trenino.', 'Imposta la velocità e lancia. La seconda prova avrà un tempo diverso.'),
          gen: (lens, r) => { const t = pick(r === 0 ? [6, 10, 12] : [8, 15, 20]); return { t, text: tr('Il viaggio di 60 m deve durare <b>{t} secondi</b>.', { t }) }; },
          solve: (tg) => ({ v1: 60 / tg.t }),
          check: (res, tg, lens) => {
            const t = res.times[0];
            const tol = lens === 'e' ? 0.6 : 0.3;
            if (t != null && Math.abs(t - tg.t) <= tol) return { ok: true, msg: tr('Arrivato in {t:1} s. Puntualissimo!', { t }) };
            return { ok: false, msg: t == null ? tr('Il trenino non è arrivato: è troppo lento.') : t > tg.t ? tr('Ci ha messo {t:1} s: troppo lento.', { t }) : tr('Ci ha messo {t:1} s: troppo veloce.', { t }) };
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
        { kind: 'q', text: T('Diciamo spesso che una cosa va «veloce» o «piano». Ma la velocità, in fisica, è un numero preciso: per esempio 5 metri al secondo. Che cosa dice quel numero?', 'La velocità si scrive in metri al secondo (m/s) e si calcola come spazio diviso tempo. Che cosa misura, in parole?'), options: [T('Quanto sei pesante', 'La massa'), T('Quanta strada fai in un secondo', 'Lo spazio fatto in un secondo'), T('Quanto sei lontano da casa', 'La distanza da casa')], answer: 1, explain: T('Esatto!', 'Esatto: v = Δs / Δt.') },
        { kind: 'q', text: T('Ricordi il disegno sotto la pista? La linea di ogni macchinina sale quando va avanti. Ora una macchinina sta ferma: il tempo passa, ma lei non si muove. Com’è la sua linea?', 'Nel grafico spazio-tempo la linea sale quando la posizione cambia. Un oggetto fermo resta sempre alla stessa posizione mentre il tempo scorre. Come lo disegni?'), options: [T('ripida', 'una retta ripida'), T('orizzontale', 'una retta orizzontale'), T('in discesa', 'una retta in discesa')], answer: 1, explain: T('Giusto: il tempo passa, lei resta lì.', 'Giusto: la posizione non cambia.') },
        // Valori nuovi a ogni partita: si ripassa la regola, non la risposta.
        { kind: 'num', only: ['s', 'c'], rounds: 1, text: 'Da km/h a m/s.', gen: () => { const k = pick([18, 36, 54, 72, 90, 108]); return { text: tr('Il tachimetro di un’auto segna <b>{k} km/h</b>. In fisica si usano i metri al secondo, e per passare da km/h a m/s si divide per 3,6. A quanti m/s va l’auto?', { k }), ans: k / 3.6, tol: 0.01, unit: 'm/s', explain: tr('Giusto: {k} ÷ 3,6 = {v} m/s.', { k, v: Math.round(k / 3.6) }) }; } },
        { kind: 'q', text: T('Due amici corrono su percorsi diversi e vuoi sapere chi è il più veloce. Non basta guardare chi arriva prima, perché le strade non sono uguali. Che cosa devi misurare?', 'Due oggetti si muovono su percorsi diversi, per tempi diversi. Per confrontare le loro velocità, quali grandezze devi misurare per ciascuno?'), options: [T('Spazio e tempo', 'Spazio e tempo'), T('Solo la strada', 'Solo la massa'), T('Solo il tempo', 'Solo la forma')], answer: 0, explain: T('Proprio così: due misure insieme.', 'Esatto: la velocità è un rapporto tra due misure.') },
      ],
      hints: [T('Ripensa alla gara e al suo grafico.')],
    },
    {
      id: 'm01-6', kind: 'boss', title: 'Il mito del più veloce',
      sim: 'race', params: { v1: 8, v2: 5, x1: 0, x2: 50, cars: 2, D: 100 }, controls: [],
      intro: T(
        'Sono Vetrino. Al bar del parco dicono: <i>“Chi va più veloce arriva sempre primo!”</i>. Sempre sempre?',
        'Sono Vetrino. Un tifoso giura: <i>“Vince sempre la macchina più veloce”</i>. Sempre?',
        'Sono Vetrino. <i>“Il più veloce arriva sempre prima”</i>: sembra logica pura. Ma è tutta la storia?'),
      steps: [
        {
          kind: 'q', text: T('La blu è più veloce: va a 8 m/s, l’arancione solo a 5 m/s. Però l’arancione parte <b>a metà pista</b>, a 50 m, e ha meno strada da fare. Partono insieme. Chi arriva prima al traguardo dei 100 m?', 'Blu a 8 m/s, parte da 0 m; arancione a 5 m/s, ma parte da <b>50 m</b>. Calcola per ciascuna il tempo come strada da fare divisa per la velocità. Chi arriva prima ai 100 m?'),
          options: [T('La blu, è più veloce', 'La blu'), T('L’arancione', 'L’arancione'), T('Arrivano insieme', 'Arrivano insieme')], answer: 1,
          predict: [{ v1: 8, v2: 5, x1: 0, x2: 50 }],
          explain: T('Vince l’arancione! Aveva meno strada da fare.', 'Arancione: 50 / 5 = 10 s. Blu: 100 / 8 = 12,5 s. Vince l’arancione.'),
        },
        {
          kind: 'q', text: T('Il tifoso diceva che vince sempre la macchina più veloce. Ma l’arancione, più lenta, ha vinto perché partiva a metà pista. Allora, chi arriva prima dipende…', 'Il mito diceva che vince sempre il più veloce. Ma il tempo per arrivare è la strada da fare divisa per la velocità. Allora il tempo di arrivo dipende da…'),
          options: [T('solo dalla velocità', 'solo dalla velocità'), T('dalla velocità e dalla strada da fare', 'da velocità e distanza'), T('da quanto è grande la macchina', 'dalla massa e dal motore')], answer: 1,
          explain: T('Mito smontato! Conta anche da dove parti.', 'Mito smontato: t = distanza / velocità. Conta anche la distanza.'),
        },
      ],
      hints: [T('Vetrino chiede: quanta strada deve fare ognuna?'), T('Vetrino chiede: quanto tempo ci mette ognuna a fare la sua strada?')],
      solution: T('L’arancione arriva prima (10 s contro 12,5 s): conta anche la distanza.'),
    },
  ],
};
