// M02 · La caduta libera (dopo M04, l'accelerazione). Simulazione: la caduta (piuma, martello, aria, Luna).
import { T, pick } from '../util.js';
import { t as tr } from '../i18n.js';

export default {
  id: 'M02',
  title: 'La caduta libera',
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
          text: T('La piuma è arrivata a terra molto dopo il martello. Che cosa l’ha rallentata?', 'Stessa altezza, stessa partenza, ma la piuma impiega molto più tempo del martello. La gravità tira entrambi verso il basso. C’è però qualcos’altro che agisce sulla piuma mentre cade. Perché ci mette tanto di più?', 'La piuma è leggera e molto larga per il suo peso. Mentre cade, che cosa la rallenta davvero?'),
          options: [
            T('È troppo leggera per la gravità', 'Perché la gravità non agisce sulle cose leggere', 'La gravità sulla piuma è quasi zero'),
            T('Le cose leggere cadono sempre piano', 'Perché la piuma cade sempre a velocità costante', 'Gli oggetti leggeri hanno una gravità tutta loro'),
            T('L’aria la frena', 'Perché la resistenza dell’aria la frena molto', 'La resistenza dell’aria, enorme rispetto al suo peso'),
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
        {
          kind: 'free', runs: 2, text: T('Lancia con l’aria, poi metti <b>Aria: no</b> e lancia ancora.', 'Fai una prova con l’aria e una senza (Aria: no). Confronta i tempi.'),
          need: [
            { when: 'air', try: { air: true }, msg: T('Fai anche una prova con l’aria accesa.') },
            { when: '!air', try: { air: false }, msg: T('Ora metti <b>Aria: no</b> e lancia ancora.', 'Ora spegni l’aria (Aria: no) e rilancia.') },
          ],
        },
        {
          kind: 'q',
          text: T('Senza aria, piuma e martello cadono dalla stessa altezza. Chi arriva prima?', 'Senza aria non c’è niente che freni la caduta: sugli oggetti agisce solo la gravità. Piuma e martello partono insieme dalla stessa altezza. Come cadono?', 'Nel tubo a vuoto non resta aria che freni la piuma. Dalla stessa altezza, piuma e martello…'),
          options: [
            T('Il martello arriva prima', 'Il martello arriva prima'),
            T('Arrivano insieme', 'Arrivano insieme'),
            T('La piuma arriva prima', 'La piuma arriva prima'),
          ],
          answer: 1,
          explain: T('Proprio così: senza aria arrivano <b>insieme</b>!', 'Esatto: nel vuoto tutti i corpi cadono con la stessa accelerazione, <b>g = 9,81 m/s²</b> sulla Terra, qualunque sia la loro massa.', 'Esatto: nel vuoto cadono insieme. La gravità fa guadagnare a tutti la stessa velocità, quasi 10 m/s in più ogni secondo: è l’accelerazione di gravità, che si indica con g. [[g = 9,81 m/s²]]'),
        },
        {
          kind: 'q', only: ['e'],
          set: { objs: ['boccia'], h: 20, air: false, planet: 'terra' },
          text: T('Lasci cadere una palla da molto in alto. Mentre scende, la palla va…', 'Ora una palla cade da molto in alto. All’inizio è ferma nella mano, poi la lasci andare. Mentre scende, la palla va…'),
          options: ['sempre più piano', 'sempre uguale', 'sempre più veloce'],
          answer: 2,
          predict: [{ objs: ['boccia'], h: 20, air: false, planet: 'terra' }],
          explain: 'Giusto: la palla cade <b>sempre più veloce</b>. Più cade, più corre!',
        },
        {
          kind: 'q', only: ['s', 'c'],
          set: { objs: ['boccia'], h: 20, air: false, planet: 'terra' },
          text: T(null, 'Nel vuoto la velocità di un oggetto che cade cresce di 9,81 m/s ogni secondo: è un moto <b>uniformemente accelerato</b>, con a = g. La legge s = ½·a·t² diventa h = ½·g·t². Una boccia cade da <b>20 m</b>: quanto tempo impiega ad arrivare a terra?', 'Un vaso cade da un balcone al sesto piano, a <b>20 metri</b> da terra. Ogni secondo guadagna quasi 10 m/s. Quanto dura la caduta?'),
          options: ['circa 1,0 s', 'circa 2,0 s', 'circa 4,1 s'],
          answer: 1,
          predict: [{ objs: ['boccia'], h: 20, air: false, planet: 'terra' }],
          explain: T(null, 't = √(2h/g) = √(40 / 9,81) ≈ 2,0 s. Non 4 s: lo spazio cresce con il <b>quadrato</b> del tempo, quindi in 2 s si fanno già quasi 20 m.', 'Circa 2 secondi. All’arrivo va già a circa 20 m/s, cioè 71 km/h: per questo cadere dall’alto è così pericoloso. [[h = ½·g·t², quindi t = √(2h/g) ≈ 2,0 s]]'),
        },
      ],
      hints: [T('Hai premuto il pulsante Aria per spegnerla?', 'Nel vuoto resta solo la gravità. Dipende dalla massa?'), T('Guarda i due tempi scritti sotto gli oggetti.', 'Ricava t da h = ½·g·t²: t = √(2h/g).', 'In 2 secondi di caduta la velocità arriva a quasi 20 m/s: in media 10 m/s, per 2 secondi. [[h = ½·g·t², quindi t = √(2h/g)]]')],
      solution: T('Senza aria arrivano insieme; e la palla va sempre più veloce.', 'Senza aria arrivano insieme; da 20 m servono circa 2,0 s, perché t = √(2·20/9,81).', 'Senza aria arrivano insieme; da 20 m la caduta dura circa 2 secondi. [[t = √(2·20/9,81) ≈ 2,0 s]]'),
    },
    {
      id: 'm02-3', kind: 'prevedi', title: 'Sulla Luna',
      sim: 'fall', params: { h: 1.6, air: false, planet: 'luna', objs: ['piuma', 'martello'] }, controls: [],
      intro: T(
        'Andiamo sulla <b>Luna</b>! Lassù un astronauta ha fatto davvero un esperimento famoso.',
        'Sulla <b>Luna</b>, nel 1971, un astronauta ha fatto davvero un esperimento famoso. Prima prevedi, poi guardalo.',
        'Sulla <b>Luna</b> non c’è aria e la gravità è circa un sesto di quella terrestre. Ecco un esperimento che qualcuno ha fatto davvero.'),
      steps: [
        {
          kind: 'q',
          text: T('Sulla Luna non c’è aria. Un astronauta lascia cadere insieme una piuma e un martello. Chi arriva prima?', 'Sulla Luna non c’è atmosfera e g vale 1,62 m/s², circa un sesto di quella terrestre. Un astronauta lascia cadere piuma e martello da 1,6 m, nello stesso istante. Chi tocca il suolo per primo?', '1971, missione Apollo 15: sulla Luna, dove non c’è aria, un astronauta lascia cadere insieme un martello e una piuma di falco. Chi tocca per primo la polvere lunare?'),
          options: [
            T('Arrivano insieme', 'Arrivano insieme'),
            T('Prima il martello, che è pesante', 'Prima il martello, più pesante'),
            T('Prima la piuma, che è leggera', 'Prima la piuma, più leggera'),
          ],
          answer: 0,
          predict: [{ planet: 'luna', h: 1.6, air: false, objs: ['piuma', 'martello'] }],
          explain: T('Insieme! Nel 1971 l’astronauta <b>David Scott</b> (missione Apollo 15) lo fece davvero sulla Luna, davanti alle telecamere.', 'Arrivano insieme, in circa 1,4 s (t = √(2·1,6/1,62)). Lo fece davvero <b>David Scott</b> durante la missione <b>Apollo 15</b>, nel 1971: “Galileo aveva ragione”.', 'Arrivano insieme. <b>David Scott</b>, comandante di <b>Apollo 15</b>, lo mostrò in diretta TV. Cadono più lenti che sulla Terra, perché la gravità lunare è circa un sesto della nostra. [[Sulla Luna g vale 1,62 m/s².]]'),
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
      piece: { id: 'torre', name: 'La torre a caduta libera', desc: 'La cabina precipita per il tempo esatto che hai calcolato, poi frena alla base.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’altezza della torre e lascia cadere la cabina.', 'Regola l’altezza e lancia. La seconda prova chiederà un tempo diverso.'),
          gen: (lens, r) => {
            // all'Esploratore solo tempi interi: 2 secondi (torre di circa 20 m), poi 3 (circa 44 m)
            const t = lens === 'e' ? (r === 0 ? 2 : 3) : pick(r === 0 ? [1.5, 2, 2.5] : [1.8, 2.2, 2.8, 3]);
            return { t, text: tr('La caduta deve durare <b>{t:1} secondi</b>.', { t }) };
          },
          solve: (tg) => ({ h: 0.5 * 9.81 * tg.t * tg.t }),
          check: (res, tg, lens) => {
            const t = res.times[0];
            const tol = lens === 'e' ? 0.3 : 0.15;
            if (t != null && Math.abs(t - tg.t) <= tol) return { ok: true, msg: tr('Caduta di {t} s. Che brivido, proprio giusto!', { t }) };
            return {
              ok: false,
              msg: t > tg.t
                ? tr('Ci ha messo {t} s: troppo.', { t }) + ' ' + (lens === 'e' ? tr('Abbassa la torre.') : tr('L’altezza va diminuita: di quanto?'))
                : tr('Ci ha messo {t} s: troppo poco.', { t }) + ' ' + (lens === 'e' ? tr('Alza la torre.') : tr('L’altezza va aumentata: di quanto?')),
            };
          },
        },
      ],
      hints: [
        T('Se la caduta è troppo corta, la torre deve essere più alta o più bassa?', 'Il tempo di caduta cresce con l’altezza, ma non in proporzione: raddoppiando l’altezza il tempo raddoppia?'),
        T('Per 2 secondi serve una torre di circa 20 metri.', 'Usa h = ½·g·t² con g = 9,81 m/s².', 'Per un tempo doppio serve una torre quattro volte più alta: per 2 secondi, circa 20 metri. [[h = ½·g·t², con g = 9,81 m/s²]]'),
      ],
      solution: T('Circa 20 metri per 2 secondi, circa 44 metri per 3 secondi.', 'h = ½·g·T². T = 2 s → 19,6 m; T = 1,5 s → 11,0 m; T = 2,5 s → 30,7 m; T = 3 s → 44,1 m.', '1,5 s → 11,0 m; 2 s → 19,6 m; 2,5 s → 30,7 m; 3 s → 44,1 m. [[h = ½·g·t²]]'),
    },
    {
      id: 'm02-5', kind: 'ripasso', title: 'Ripasso della caduta',
      intro: T('Ripassiamo cadute, velocità e metodo scientifico!', 'Ripasso: caduta libera, velocità e metodo scientifico.'),
      steps: [
        {
          kind: 'q', text: T('In una stanza, con l’aria, lasci cadere insieme una piuma e un martello. Chi arriva prima?', 'Nel vuoto agisce solo la gravità. La boccia ha una massa grande, la pallina una massa piccola, e partono insieme dalla stessa altezza. Che cosa si può dire delle loro accelerazioni?', 'In una camera a vuoto fanno cadere insieme una palla da bowling e una pallina da ping pong. Come va a finire?'),
          options: [T('la piuma', 'la boccia ha accelerazione maggiore', 'Prima la palla da bowling'), T('arrivano insieme', 'la pallina ha accelerazione maggiore', 'Prima la pallina da ping pong'), T('il martello', 'hanno la stessa accelerazione g', 'Insieme: guadagnano velocità allo stesso ritmo')],
          answer: 2, explain: T('Esatto: l’aria frena la piuma. Senza aria arriverebbero insieme.', 'Esatto: nel vuoto l’accelerazione è g per tutti i corpi.', 'Esatto: nel vuoto l’accelerazione è la stessa per tutti i corpi, qualunque sia la massa.'),
        },
        {
          kind: 'q', text: T('Una palla cade da una torre. In quale punto va più veloce?', 'In caduta libera, senza aria, l’accelerazione è sempre g = 9,81 m/s². Che cosa vuol dire per la velocità dell’oggetto che cade?', 'Un tuffatore si lascia cadere dalla piattaforma. Trascurando l’aria, che cosa fa la sua velocità durante la caduta?'),
          options: [T('In fondo, vicino a terra', 'aumenta di 9,81 m/s ogni secondo', 'Cresce di circa 10 m/s ogni secondo'), T('A metà', 'resta costante', 'Resta costante'), T('In cima, appena parte', 'diminuisce di 9,81 m/s ogni secondo', 'Cresce all’inizio, poi cala')],
          answer: 0, explain: T('Giusto: più cade, più corre.', 'Giusto: a = g = 9,81 m/s² vuol dire +9,81 m/s ogni secondo.', 'Giusto: la gravità aggiunge quasi 10 m/s ogni secondo. Dalla piattaforma dei 10 metri si entra in acqua a circa 50 km/h. [[a = g = 9,81 m/s²]]'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.', 'Un calcolo sulla caduta.'),
          vals: { e: { t: [5, 10], v: [3, 4, 6] }, s: { h: [5, 20, 45] } }, derive: { e: { d: 'v * t' }, s: {} },
          calc: { e: 'v', s: 'Math.sqrt(2 * h / 9.81)' }, round: 2, unit: T('metri', 's'), tol: { e: 0, s: 0.03 },
          ask: T('Un trenino fa <b>{d} metri</b> in <b>{t} secondi</b>, sempre alla stessa velocità. Quanti metri fa ogni secondo?', 'Una palla cade, senza aria, da <b>{h} m</b>. Da h = ½·g·t² si ricava il tempo di caduta: t = √(2h/g), con g = 9,81 m/s². Quanto dura la caduta?', 'Una palla cade, senza aria, da <b>{h} m</b>. Quanto dura la caduta? [[Da h = ½·g·t² si ricava t = √(2h/g), con g = 9,81 m/s².]]'),
          explain: T('Esatto: {d} diviso {t} fa {v}.', 'Esatto: t = √(2 × {h} / 9,81) ≈ {ans} s.', 'Esatto: circa {ans} s. [[t = √(2 × {h} / 9,81)]]'),
        },
        {
          kind: 'q', text: T('Vuoi scoprire se le cose pesanti cadono più in fretta. Che cosa fai cadere?', 'Vuoi capire se la massa influisce sulla caduta. Per un esperimento corretto deve cambiare solo la massa, mentre forma, dimensioni e altezza restano uguali, così l’aria agisce allo stesso modo. Che esperimento fai?', 'Vuoi vedere con i tuoi occhi se il peso conta nella caduta. Dalla stessa altezza, che cosa lasci cadere insieme?'),
          options: [T('Una piuma larga e un sasso piccolo', 'Confronti una piuma e un sasso', 'Un foglio di carta e un libro'), T('Due sassi uguali, pesanti uguale', 'Due oggetti di massa uguale', 'Due libri identici'), T('Due palle uguali, una più pesante', 'Stessa forma e altezza, massa diversa', 'Due bottiglie uguali: una piena, una vuota')],
          answer: 2, explain: T('Giusto: cambi solo il peso, tutto il resto uguale.', 'Giusto: si cambia una sola variabile, la massa. Piuma e sasso differiscono anche per forma, e l’aria li tratta in modo diverso.', 'Giusto: stessa forma, cambia solo la massa. Foglio e libro hanno anche forme diverse, e l’aria li tratta in modo diverso.'),
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
          kind: 'q', text: T('Vuoi controllare Aristotele senza farti imbrogliare dall’aria. Che cosa fai cadere insieme?', 'Il mito dice: con il doppio del peso, metà del tempo di caduta. Per metterlo alla prova serve cambiare la massa, tenendo uguali forma e altezza perché l’aria agisca allo stesso modo. Quale esperimento mette alla prova il mito?', 'Si racconta che Galileo lo abbia fatto dalla Torre di Pisa. Per mettere alla prova Aristotele, che cosa conviene far cadere insieme?'),
          options: [
            T('Una piuma e una boccia di ferro', 'Una piuma e una boccia di ferro, dalla stessa altezza'),
            T('Una pallina e una boccia, tonde', 'Pallina da ping pong e boccia di ferro, stessa altezza'),
            T('Una boccia sola, tante volte', 'Una sola boccia, da altezze diverse'),
          ],
          answer: 1,
          explain: T('Giusto: stessa forma, cambia solo il peso. La boccia pesa centinaia di volte più della pallina!', 'Giusto: stessa forma, cambia solo la massa. La boccia ha una massa centinaia di volte maggiore.'),
          wrong: T('Mmh, piuma e boccia hanno anche forme diversissime. Come capisci se è colpa del peso o dell’aria?', 'Così cambi più di una variabile, o non cambi la massa. Cosa causerebbe la differenza?'),
        },
        {
          kind: 'q',
          text: T('La boccia pesa moltissimo più della pallina. Cadono insieme dalla torre: che cosa succede?', 'Pallina e boccia, tutte e due tonde, cadono da 2 m con l’aria. La boccia ha una massa molte volte più grande. Secondo il mito dovrebbe cadere in una frazione del tempo. Che cosa prevedi?', 'La boccia pesa centinaia di volte più della pallina. Se Aristotele avesse ragione, toccherebbe terra quasi subito. Da 2 metri, con l’aria, che cosa ti aspetti?'),
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
          kind: 'q', text: T('Aristotele diceva: «le cose pesanti cadono molto più in fretta». Aveva ragione?', 'Le due palle sono arrivate quasi insieme, anche se una ha una massa molto più grande. Che cosa concludi sul mito di Aristotele?', 'Duemila anni di «il pesante cade prima», e due palle che arrivano quasi insieme. Che cosa resta del mito?'),
          options: [
            T('Sì, il pesante cade molto prima', 'Il mito è vero: massa doppia, tempo dimezzato', 'Regge: peso doppio, tempo dimezzato'),
            T('No: il peso non conta', 'Il mito è falso: nel vuoto tutti cadono con la stessa g', 'Cade: a parte l’aria, il peso non conta'),
            T('Dipende da quanto è alto il palazzo', 'Vale solo da altezze molto grandi', 'Regge solo da molto in alto'),
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
