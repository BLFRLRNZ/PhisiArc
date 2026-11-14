// M02 · Accelerazione e caduta libera. Simulazione: la caduta (piuma, martello, aria, Luna).
import { T, pick, num } from '../util.js';

export default {
  id: 'M02',
  title: 'Accelerazione e caduta libera',
  levels: [
    {
      id: 'm02-1', kind: 'lezione', title: 'La piuma e il martello',
      sim: 'fall', params: { h: 2, air: true, planet: 'terra', objs: ['piuma', 'martello'] }, controls: ['h'],
      intro: T(
        'Lasciamo cadere insieme una <b>piuma</b> e un <b>martello</b>. Premi ▶ Lancia e guarda chi tocca terra per primo.',
        'Una piuma e un martello partono fermi dalla stessa altezza, nello stesso istante. Il cronometro misura il <b>tempo di caduta</b> di ciascuno.',
        'Piuma e martello lasciati cadere insieme: l’esperimento più famoso sulla caduta. Lancia e osserva i tempi.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai cadere piuma e martello. Puoi anche cambiare l’altezza.', 'Fai almeno una prova e confronta i due tempi di caduta.') },
        {
          kind: 'q',
          text: T('La piuma arriva molto dopo. Perché?', 'Perché la piuma impiega molto più tempo del martello?', 'Che cosa rallenta davvero la piuma?'),
          options: [
            T('Perché la Terra non la vuole', 'Perché la gravità non agisce sulle cose leggere', 'La gravità sulla piuma è quasi zero'),
            T('Perché è gialla', 'Perché la piuma cade sempre a velocità costante', 'Gli oggetti leggeri hanno una gravità tutta loro'),
            T('Perché l’aria la frena', 'Perché la resistenza dell’aria la frena molto', 'La resistenza dell’aria, enorme rispetto al suo peso'),
          ],
          answer: 2,
          explain: T(
            'Esatto: l’aria spinge contro la piuma e la frena. Il martello quasi non se ne accorge.',
            'Esatto: la piuma ha tanta superficie e pochissimo peso, quindi la <b>resistenza dell’aria</b> la frena moltissimo. Sul martello l’effetto è minimo.',
            'Esatto: la gravità tira anche la piuma, ma l’aria la frena quasi subito. È lo stesso motivo per cui un paracadute funziona.'),
          wrong: T('Mmh, pensa a cosa c’è intorno alla piuma mentre cade.', 'La gravità agisce su tutti i corpi. Che cosa c’è di diverso per la piuma?'),
        },
      ],
      hints: [T('Cosa senti sulla faccia quando corri in bicicletta?', 'Che cosa c’è tra la piuma e il terreno?'), T('Un foglio appallottolato cade più in fretta di un foglio aperto: cosa cambia?')],
      solution: T('L’aria la frena.', 'La resistenza dell’aria, grande rispetto al peso della piuma.'),
    },
    {
      id: 'm02-2', kind: 'lezione', title: 'Togliamo l’aria',
      sim: 'fall', params: { h: 2, air: true, planet: 'terra', objs: ['piuma', 'martello'] }, controls: ['air', 'planet'],
      intro: T(
        'E se togliessimo <b>l’aria</b>? Gli scienziati lo fanno con un grande tubo da cui succhiano via tutta l’aria.',
        'Nel <b>tubo a vuoto</b> non c’è aria. Spegni l’aria e confronta di nuovo piuma e martello.',
        'Nei laboratori si usa un <b>tubo a vuoto</b>: tolta l’aria, resta solo la gravità. Prova tu.'),
      steps: [
        { kind: 'free', runs: 2, text: T('Lancia con l’aria, poi metti <b>Aria: no</b> e lancia ancora.', 'Fai una prova con l’aria e una senza (Aria: no). Confronta i tempi.') },
        {
          kind: 'q',
          text: T('Senza aria, cosa succede?', 'Senza aria, come cadono piuma e martello?'),
          options: [
            T('Il martello arriva prima', 'Il martello arriva prima'),
            T('Arrivano insieme', 'Arrivano insieme: stesso tempo di caduta'),
            T('La piuma arriva prima', 'La piuma arriva prima'),
          ],
          answer: 1,
          explain: T(
            'Proprio così: senza aria arrivano <b>insieme</b>!',
            'Esatto: nel vuoto tutti i corpi cadono con la stessa accelerazione, <b>g = 9,81 m/s²</b> sulla Terra, qualunque sia la loro massa.',
            'Esatto: nel vuoto cadono insieme. La gravità dà a tutti la stessa accelerazione, g = 9,81 m/s².'),
        },
        {
          kind: 'q', only: ['e'],
          set: { objs: ['boccia'], h: 20, air: false, planet: 'terra' },
          text: 'Ora una palla cade da molto in alto. Mentre scende, la palla va…',
          options: ['sempre più piano', 'sempre uguale', 'sempre più veloce'],
          answer: 2,
          predict: [{ objs: ['boccia'], h: 20, air: false, planet: 'terra' }],
          explain: 'Giusto: la palla cade <b>sempre più veloce</b>. Più cade, più corre!',
        },
        {
          kind: 'q', only: ['s', 'c'],
          set: { objs: ['boccia'], h: 20, air: false, planet: 'terra' },
          text: T(null, 'Nel vuoto la velocità cresce di 9,81 m/s ogni secondo: è un moto <b>uniformemente accelerato</b>, con h = ½·g·t². Quanto impiega una boccia a cadere da <b>20 m</b>?', 'Cadendo, ogni secondo si guadagnano 9,81 m/s di velocità, e h = ½·g·t². Da <b>20 m</b> (un palazzo di 6-7 piani), quanto dura la caduta?'),
          options: ['circa 1,0 s', 'circa 2,0 s', 'circa 4,1 s'],
          answer: 1,
          predict: [{ objs: ['boccia'], h: 20, air: false, planet: 'terra' }],
          explain: T(null, 't = √(2h/g) = √(40 / 9,81) ≈ 2,0 s. Non 4 s: lo spazio cresce con il <b>quadrato</b> del tempo, quindi in 2 s si fanno già quasi 20 m.', 't = √(2h/g) ≈ 2,0 s. All’arrivo va già a circa 20 m/s, cioè 71 km/h: per questo cadere dall’alto è così pericoloso.'),
        },
      ],
      hints: [T('Hai premuto il pulsante Aria per spegnerla?', 'Nel vuoto resta solo la gravità. Dipende dalla massa?'), T('Guarda i due tempi scritti sotto gli oggetti.', 'Ricava t da h = ½·g·t²: t = √(2h/g).')],
      solution: T('Senza aria arrivano insieme; e la palla va sempre più veloce.', 'Senza aria arrivano insieme; da 20 m servono circa 2,0 s, perché t = √(2·20/9,81).'),
    },
    {
      id: 'm02-3', kind: 'prevedi', title: 'Sulla Luna',
      sim: 'fall', params: { h: 1.6, air: false, planet: 'luna', objs: ['piuma', 'martello'] }, controls: [],
      intro: T(
        'Andiamo sulla <b>Luna</b>! Lì non c’è aria. Un astronauta lascia cadere una piuma e un martello.',
        'Sulla <b>Luna</b> non c’è atmosfera e g vale solo 1,62 m/s². Un astronauta lascia cadere piuma e martello da circa 1,6 m.',
        'Sulla <b>Luna</b> non c’è aria e la gravità è circa un sesto di quella terrestre. Ecco un esperimento che qualcuno ha fatto davvero.'),
      steps: [
        {
          kind: 'q',
          text: T('Sulla Luna, chi tocca il suolo per primo?', 'Sulla Luna, da 1,6 m: chi tocca il suolo per primo?'),
          options: [
            T('Arrivano insieme', 'Arrivano insieme'),
            T('Il martello', 'Il martello'),
            T('La piuma', 'La piuma'),
          ],
          answer: 0,
          predict: [{ planet: 'luna', h: 1.6, air: false, objs: ['piuma', 'martello'] }],
          explain: T(
            'Insieme! Nel 1971 l’astronauta <b>David Scott</b> (missione Apollo 15) lo fece davvero sulla Luna, davanti alle telecamere.',
            'Arrivano insieme, in circa 1,4 s (t = √(2·1,6/1,62)). Lo fece davvero <b>David Scott</b> durante la missione <b>Apollo 15</b>, nel 1971: “Galileo aveva ragione”.',
            'Arrivano insieme. Nel 1971 <b>David Scott</b>, comandante di <b>Apollo 15</b>, lo mostrò in diretta TV dalla Luna. Più lenti che sulla Terra, perché g è solo 1,62 m/s².'),
        },
      ],
      hints: [T('Sulla Luna c’è aria che frena la piuma?', 'Che cosa rallentava la piuma sulla Terra? C’è anche sulla Luna?')],
      solution: T('Arrivano insieme: senza aria cadono uguali.', 'Insieme: senza aria l’accelerazione è g per entrambi (1,62 m/s² sulla Luna).'),
    },
    {
      id: 'm02-4', kind: 'costruisci', title: 'La torre a caduta libera',
      sim: 'fall', params: { h: 10, air: false, planet: 'terra', objs: ['carrello'] }, controls: ['h'], labels: { h: 'Altezza della torre' },
      intro: T(
        'Nuovo gioco per il parco: la <b>torre a caduta libera</b>! La cabina sale e poi si lascia cadere. Il custode vuole che la caduta duri un tempo preciso.',
        'Nuovo pezzo del parco: la <b>torre a caduta libera</b>. Scegli da che altezza far cadere la cabina perché la caduta duri il tempo richiesto (i freni sono alla base, l’aria qui la trascuriamo).',
        'Nuovo pezzo del parco: la <b>torre a caduta libera</b>, come quelle dei grandi parchi. Trova l’altezza giusta per la durata richiesta.'),
      piece: { id: 'torre', icon: '🗼', name: 'La torre a caduta libera', desc: 'La cabina precipita per il tempo esatto che hai calcolato, poi frena alla base.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’altezza della torre e lascia cadere la cabina.', 'Regola l’altezza e lancia. La seconda prova chiederà un tempo diverso.'),
          gen: (lens, r) => {
            const t = pick(r === 0 ? [1.5, 2, 2.5] : [1.8, 2.2, 2.8, 3]);
            return { t, text: `La caduta deve durare <b>${num(t, 1)} secondi</b>.` };
          },
          check: (res, tg, lens) => {
            const t = res.times[0];
            const tol = lens === 'e' ? 0.3 : 0.15;
            if (t != null && Math.abs(t - tg.t) <= tol) return { ok: true, msg: `Caduta di ${num(t, 2)} s. Che brivido, proprio giusto!` };
            return {
              ok: false,
              msg: t > tg.t
                ? `Ci ha messo ${num(t, 2)} s: troppo. ${lens === 'e' ? 'Abbassa la torre.' : 'L’altezza va diminuita: di quanto?'}`
                : `Ci ha messo ${num(t, 2)} s: troppo poco. ${lens === 'e' ? 'Alza la torre.' : 'L’altezza va aumentata: di quanto?'}`,
            };
          },
        },
      ],
      hints: [
        T('Se la caduta è troppo corta, la torre deve essere più alta o più bassa?', 'Il tempo di caduta cresce con l’altezza, ma non in proporzione: raddoppiando l’altezza il tempo raddoppia?'),
        T('Per 2 secondi serve una torre di circa 20 metri.', 'Usa h = ½·g·t² con g = 9,81 m/s².'),
      ],
      solution: T(
        'Circa 11 m per 1,5 secondi, 20 m per 2 secondi, 31 m per 2,5 secondi, 44 m per 3 secondi.',
        'h = ½·g·T². T = 2 s → 19,6 m; T = 1,5 s → 11,0 m; T = 2,5 s → 30,7 m; T = 3 s → 44,1 m.'),
    },
    {
      id: 'm02-5', kind: 'ripasso', title: 'Ripasso della caduta',
      intro: T('Ripassiamo cadute, velocità e metodo scientifico!', 'Ripasso: caduta libera, velocità e metodo scientifico.'),
      steps: [
        {
          kind: 'q', text: T('Senza aria, una boccia pesante e una pallina leggera cadono…', 'Nel vuoto, la boccia (massa grande) e la pallina (massa piccola)…'),
          options: [T('la boccia prima', 'la boccia ha accelerazione maggiore'), T('la pallina prima', 'la pallina ha accelerazione maggiore'), T('insieme', 'hanno la stessa accelerazione g')],
          answer: 2, explain: T('Esatto: senza aria cadono insieme.', 'Esatto: nel vuoto l’accelerazione è g per tutti i corpi.'),
        },
        {
          kind: 'q', text: T('Una palla che cade va…', 'In caduta libera, la velocità…'),
          options: [T('sempre più veloce', 'aumenta di 9,81 m/s ogni secondo'), T('sempre uguale', 'resta costante'), T('sempre più piano', 'diminuisce di 9,81 m/s ogni secondo')],
          answer: 0, explain: T('Giusto: più cade, più corre.', 'Giusto: a = g = 9,81 m/s² vuol dire +9,81 m/s ogni secondo.'),
        },
        {
          kind: 'q', text: T('Un trenino fa 60 metri in 10 secondi. Quanti metri fa ogni secondo?', 'Un trenino percorre 60 m in 10 s. Qual è la sua velocità?'),
          options: [T('600', '600 m/s'), T('6', '6 m/s'), T('50', '50 m/s')],
          answer: 1, explain: T('Esatto: 60 diviso 10 fa 6.', 'Esatto: v = 60 m / 10 s = 6 m/s.'),
        },
        {
          kind: 'q', text: T('Vuoi sapere se il peso cambia la caduta. Cosa fai?', 'Per capire se la massa influisce sulla caduta, che esperimento fai?'),
          options: [T('Faccio cadere una piuma e un sasso', 'Confronti una piuma e un sasso'), T('Chiedo a un amico', 'Cerchi l’opinione di un esperto'), T('Due palle uguali di forma, una leggera e una pesante', 'Due oggetti di uguale forma e massa diversa, dalla stessa altezza')],
          answer: 2, explain: T('Giusto: cambi solo il peso, tutto il resto uguale.', 'Giusto: si cambia una sola variabile, la massa. Piuma e sasso differiscono anche per forma, e l’aria li tratta in modo diverso.'),
        },
      ],
      hints: [T('Ripensa al tubo senza aria e al livello “Una cosa alla volta”.')],
    },
    {
      id: 'm02-6', kind: 'boss', title: 'Il mito di Aristotele',
      sim: 'fall', params: { h: 2, air: true, planet: 'terra', objs: ['pallina', 'boccia'] }, controls: ['h', 'air'],
      intro: T(
        'Sono Vetrino. Tanto tempo fa un sapiente greco, <b>Aristotele</b>, diceva: <i>“Le cose pesanti cadono più in fretta”</i>. Lo credettero tutti per duemila anni. Ma qualcuno ha controllato?',
        'Sono Vetrino. <b>Aristotele</b> sosteneva: <i>“Gli oggetti pesanti cadono più in fretta: con il doppio del peso, metà del tempo”</i>. Per secoli nessuno lo mise alla prova. Tu sì?',
        'Sono Vetrino. Per <b>Aristotele</b> <i>“un corpo che pesa il doppio cade in metà tempo”</i>. Un’idea durata quasi duemila anni. Ma cosa dice l’esperimento?'),
      steps: [
        {
          kind: 'q', text: T('Quale esperimento ci serve per controllare?', 'Quale esperimento mette alla prova il mito?'),
          options: [
            T('Una piuma e una boccia di ferro', 'Una piuma e una boccia di ferro, dalla stessa altezza'),
            T('Una pallina leggera e una boccia pesante, tutte e due rotonde', 'Una pallina da ping pong e una boccia di ferro: stessa forma, massa molto diversa, stessa altezza'),
            T('Una boccia sola, lanciata tante volte', 'Una sola boccia, da altezze diverse'),
          ],
          answer: 1,
          explain: T('Giusto: stessa forma, cambia solo il peso. La boccia pesa centinaia di volte più della pallina!', 'Giusto: stessa forma, cambia solo la massa. La boccia ha una massa centinaia di volte maggiore.'),
          wrong: T('Mmh, piuma e boccia hanno anche forme diversissime. Come capisci se è colpa del peso o dell’aria?', 'Così cambi più di una variabile, o non cambi la massa. Cosa causerebbe la differenza?'),
        },
        {
          kind: 'q',
          text: T('Se Aristotele avesse ragione, la boccia arriverebbe prestissimo. Cosa succederà secondo te?', 'Pallina e boccia da 2 m, con l’aria. Che cosa prevedi?'),
          options: [
            T('La boccia arriva molto prima', 'La boccia arriva in una frazione del tempo della pallina'),
            T('La pallina arriva prima', 'La pallina arriva prima'),
            T('Arrivano quasi insieme', 'Arrivano quasi insieme'),
          ],
          answer: 2,
          predict: [{ objs: ['pallina', 'boccia'], h: 2, air: true, planet: 'terra' }],
          explain: T(
            'Quasi insieme! La boccia pesa tantissimo di più, ma non arriva certo in metà tempo.',
            'Circa 0,66 s contro 0,64 s: la piccola differenza è tutta colpa dell’aria. Con massa centinaia di volte maggiore, Aristotele prevedeva un tempo centinaia di volte più breve!',
            'Circa 0,66 s contro 0,64 s. Secondo Aristotele la boccia avrebbe dovuto essere centinaia di volte più rapida. Galileo ci ragionò sopra già nel Seicento.'),
        },
        {
          kind: 'q', text: T('Allora, Aristotele aveva ragione?', 'Conclusione?'),
          options: [
            T('Sì, il pesante cade molto prima', 'Il mito è vero: massa doppia, tempo dimezzato'),
            T('No: senza l’aria, pesante e leggero cadono insieme', 'Il mito è falso: nel vuoto tutti i corpi cadono con la stessa accelerazione g'),
            T('Non si può sapere', 'Non si può concludere nulla'),
          ],
          answer: 1,
          explain: T('Mito smontato! Anche le idee di un grande sapiente vanno controllate.', 'Mito smontato: a parte l’aria, il tempo di caduta non dipende dalla massa. Anche l’autorità di Aristotele cede davanti all’esperimento.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi peso e forma insieme, a chi dai la colpa?'), T('Vetrino chiede: i due tempi che hai visto sono uno la metà dell’altro?')],
      solution: T('Pallina e boccia, stessa forma: arrivano quasi insieme, quindi il mito è falso.', 'Pallina e boccia (stessa forma, massa diversa): circa 0,66 s e 0,64 s. Il tempo non dipende dalla massa: il mito è falso.'),
    },
  ],
};
