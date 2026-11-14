// M03 · Vettori, moto nel piano e proiettili. Simulazioni: la barca sul fiume (vettori), poi il cannone.
import { T, pick, num } from '../util.js';

export default {
  id: 'M03',
  title: 'Vettori e proiettili',
  levels: [
    {
      id: 'm03-v1', kind: 'lezione', title: 'Frecce che si sommano',
      sim: 'river', params: { vb: 4, vc: 0, ang: 0 }, controls: ['vb', 'vc'],
      intro: T(
        'Prima di lanciare palle, attraversiamo un <b>fiume</b> in barca! La barca punta dritta verso il pontile di fronte. Ma l’acqua scorre…',
        'Una velocità non è solo un numero: ha anche una <b>direzione</b>. Per questo si disegna con una freccia, che si chiama <b>vettore</b>. La barca punta dritta verso il pontile, ma la corrente la trascina di lato.',
        'Le velocità sono <b>vettori</b>: hanno intensità, direzione e verso, e si sommano come frecce, punta contro coda. Barca e corrente: quale sarà il moto vero?'),
      steps: [
        { kind: 'free', runs: 2, text: T('Fai una traversata <b>senza corrente</b>, poi una <b>con la corrente</b>.', 'Attraversa una volta con corrente 0 e una volta con la corrente accesa.') },
        {
          kind: 'q',
          text: T('Con la corrente, dove arriva la barca?', 'Con la corrente, in che direzione si muove davvero la barca?', 'Qual è la velocità effettiva della barca rispetto alla riva?'),
          options: [
            T('Più in là del pontile, spinta dall’acqua', 'In diagonale: lungo la freccia bianca, somma delle altre due', 'La somma vettoriale di velocità della barca e della corrente'),
            T('Dritta al pontile', 'Dritta verso il pontile, come punta la prua', 'Quella della barca: la corrente non conta'),
            T('Torna indietro', 'Lungo la corrente', 'Quella della corrente'),
          ],
          answer: 0,
          explain: T(
            'Giusto! La barca va avanti <b>e</b> la corrente la porta di lato: le due spinte si sommano. La freccia bianca mostra dove va davvero.',
            'Giusto: la velocità vera è la <b>somma dei vettori</b>. Si mette la freccia della corrente in coda a quella della barca: la freccia bianca, dalla partenza alla punta, è la somma.',
            'Giusto: v = v_barca + v_corrente, somma vettoriale. Con le due frecce perpendicolari l’intensità si trova con Pitagora.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T('Somma due frecce perpendicolari.'),
          gen: () => {
            const [b, c, v] = pick([[4, 3, 5], [3, 4, 5], [8, 6, 10], [6, 8, 10], [5, 12, 13]]);
            return { text: `La barca va a <b>${b} m/s</b> verso la riva opposta, la corrente a <b>${c} m/s</b> di lato. Quanto vale la velocità totale?`, ans: v, tol: 0.05, unit: 'm/s', explain: `Esatto: le frecce sono perpendicolari, quindi √(${b}² + ${c}²) = √${b * b + c * c} = ${v} m/s. Non ${b + c}: le frecce non sono nella stessa direzione.` };
          },
        },
      ],
      hints: [T('Guarda le tre frecce sulla barca: arancione, azzurra e bianca.', 'Metti la freccia azzurra in coda all’arancione: dove arriva la punta?'), T('Le frecce sono a squadra: serve Pitagora.', 'v = √(v_barca² + v_corrente²).')],
      solution: T('Arriva più in là del pontile: la corrente la porta di lato.', 'In diagonale: la velocità vera è la somma vettoriale. Con frecce perpendicolari, v = √(a² + b²).'),
    },
    {
      id: 'm03-v2', kind: 'prevedi', title: 'Il fiume non ruba tempo',
      sim: 'river', params: { vb: 4, vc: 0, ang: 0 }, controls: ['ang'],
      intro: T(
        'Una domanda furba: se il fiume scorre, la barca ci mette <b>di più</b> ad attraversarlo?',
        'La corrente spinge la barca di lato. Ma cambia il <b>tempo</b> della traversata? Prevedi, poi guarda.',
        'Moti perpendicolari e indipendenti: la corrente cambia il tempo di traversata? Prevedi.'),
      steps: [
        {
          kind: 'q', predict: [{ vc: 0, ang: 0 }, { vc: 3, ang: 0 }],
          text: T('Prima senza corrente, poi con una corrente forte. Quanto tempo ci mette la seconda volta?', 'Traversata senza corrente, poi con corrente 3 m/s. Il tempo della seconda traversata…'),
          options: [T('Lo stesso tempo', 'è uguale'), T('Di più', 'è maggiore'), T('Di meno', 'è minore')],
          answer: 0,
          explain: T(
            'Lo stesso: 10 secondi! La corrente la porta di lato, ma non la frena verso la riva. Sono due moti separati.',
            'Uguale, 10 s: la corrente è perpendicolare e non cambia la velocità verso l’altra riva. I due moti sono <b>indipendenti</b>, come nel volo di una palla: avanti e su-giù.',
            'Uguale: t = 40 m / 4 m/s = 10 s. Le componenti perpendicolari sono indipendenti: lo stesso principio di Galileo per i proiettili.'),
        },
        {
          kind: 'tune', rounds: 1, set: { vc: 2 },
          text: T('Ora tocca a te: gira la <b>prua controcorrente</b> e porta la barca dritta al pontile.', 'Inclina la prua controcorrente quanto basta per arrivare dritto al pontile.'),
          gen: () => ({ text: 'Arriva al pontile (al massimo 1,5 m di scarto).' }),
          solve: () => ({ ang: 30 }),
          check: (res, tg, lens) => {
            if (Math.abs(res.drift) <= 1.5) return { ok: true, msg: `Al pontile! Ci hai messo ${num(res.t, 1)} s: un po’ di più, perché parte della spinta va contro la corrente.` };
            return { ok: false, msg: res.drift > 0 ? `Sei finito ${num(res.drift, 1)} m a valle. ${lens === 'e' ? 'Gira di più la prua.' : 'Serve un angolo maggiore.'}` : `Sei finito ${num(-res.drift, 1)} m a monte. ${lens === 'e' ? 'Gira un po’ meno.' : 'Angolo troppo grande.'}` };
          },
        },
      ],
      hints: [T('La corrente spinge di lato: cambia quanto manca all’altra riva?', 'Con la prua girata, una parte della spinta della barca deve annullare la corrente.'), T('Circa 30 gradi.', 'sin θ = corrente / barca = 2/4: θ = 30°.')],
      solution: T('Stesso tempo. Per il pontile serve una prua girata di circa 30°.', 'Il tempo non cambia. Per arrivare dritto: sin θ = 2/4, θ = 30°.'),
    },
    {
      id: 'm03-1', kind: 'lezione', title: 'Il volo della palla',
      sim: 'cannon', params: { ang: 45, v: 20, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'Questo è un <b>cannone</b> che spara palline. Scegli quanto inclinarlo e quanto forte sparare, poi premi ▶ Lancia.',
        'Un <b>proiettile</b> è un oggetto lanciato che poi vola soltanto sotto l’effetto della gravità. Scegli <b>angolo</b> e <b>velocità di lancio</b> e osserva la traiettoria.',
        'Un pallone calciato, un getto d’acqua, un salto in lungo: sono tutti <b>proiettili</b>. Scegli angolo e velocità e osserva il volo.'),
      steps: [
        { kind: 'free', runs: 2, text: T('Fai almeno due lanci, cambiando qualcosa.', 'Fai almeno due lanci con valori diversi. Le traiettorie precedenti restano in grigio.') },
        {
          kind: 'q',
          text: T('Che forma disegna la palla in volo?', 'Che forma ha la traiettoria della palla?', 'Che forma ha la traiettoria (trascurando l’aria)?'),
          options: [
            T('Una linea dritta in diagonale', 'Una retta'),
            T('Un pezzo di cerchio', 'Un arco di circonferenza'),
            T('Una curva: sale e poi scende', 'Una parabola'),
          ],
          answer: 2,
          explain: T(
            'Esatto: una curva come un ponte, o come lo zampillo di una fontana.',
            'Esatto: una <b>parabola</b>, simmetrica tra salita e discesa (se trascuriamo l’aria).',
            'Esatto: una <b>parabola</b>. La vedi negli zampilli delle fontane e nei tiri a canestro.'),
          wrong: T('Guarda bene la linea che resta sullo schermo.', 'Osserva le traiettorie disegnate: sono dritte? Sono archi di cerchio regolari?'),
        },
      ],
      hints: [T('Fai un lancio e guarda la linea colorata.', 'Pensa allo zampillo di una fontana.')],
      solution: T('Una curva come un ponte.', 'Una parabola.'),
    },
    {
      id: 'm03-2', kind: 'lezione', title: 'Due moti in uno',
      sim: 'cannon', params: { ang: 45, v: 20, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'Cosa succede se spari <b>più forte</b>? Proviamo!',
        'Il volo di un proiettile è fatto di <b>due moti insieme</b>: in orizzontale la palla va a velocità costante, in verticale sale, rallenta e ricade come in caduta libera.',
        'Galileo capì che il volo di un proiettile è la somma di <b>due moti indipendenti</b>: uno orizzontale a velocità costante e uno verticale accelerato dalla gravità.'),
      steps: [
        {
          kind: 'q', only: ['e'],
          text: 'Stesso angolo, ma la seconda volta spari <b>più forte</b>. Dove arriva la palla?',
          options: ['Più vicino', 'Più lontano', 'Nello stesso punto'],
          answer: 1,
          predict: [{ ang: 45, v: 15 }, { ang: 45, v: 30 }],
          explain: 'Giusto: <b>lanci più forte, va più lontano</b>!',
        },
        { kind: 'free', runs: 1, only: ['e'], text: 'Ora prova tu: trova un lancio che arriva vicino ai 100 metri.' },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Durante il volo (senza aria), la componente <b>orizzontale</b> della velocità…', 'Mentre la palla vola, la sua velocità <b>orizzontale</b>…'),
          options: ['aumenta', 'resta costante', 'diminuisce fino a zero'],
          answer: 1,
          explain: T(null, 'Esatto: in orizzontale non agisce nessuna forza, quindi vₓ = v·cos θ resta costante. Si muove di moto rettilineo uniforme, come le macchinine della gara.', 'Esatto: in orizzontale nessuna forza la spinge o la frena, quindi va sempre alla stessa velocità.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'E la componente <b>verticale</b> della velocità?', 'E la velocità <b>verticale</b>?'),
          options: ['resta costante per tutto il volo', 'cresce sempre, dall’inizio alla fine', 'cala in salita, è zero in cima, poi cresce'],
          answer: 2,
          explain: T(null, 'Esatto: in verticale c’è l’accelerazione g = 9,81 m/s² verso il basso, come nella caduta libera. Nel punto più alto vᵧ = 0, ma vₓ no: la palla non è mai ferma.', 'Esatto: in verticale comanda la gravità, come nella caduta libera. In cima la palla per un istante non sale né scende, ma continua ad avanzare.'),
        },
        {
          kind: 'run', only: ['s', 'c'],
          text: T(null, 'Guarda: stessa velocità, angolo sempre più alto. Cambia come si dividono i due moti.'),
          seq: [{ ang: 20, v: 25 }, { ang: 45, v: 25 }, { ang: 70, v: 25 }],
          explain: T(null, 'Angolo basso: tanta vₓ ma poco tempo in volo. Angolo alto: lungo volo ma poca vₓ. La gittata dipende da entrambi.', 'Angolo basso: va veloce in avanti ma atterra presto. Angolo alto: resta in aria a lungo ma avanza piano.'),
        },
      ],
      hints: [T('Pensa a quando tiri un sasso piano e quando lo tiri forte.', 'Quali forze agiscono sulla palla in volo, se trascuriamo l’aria? In che direzione?'), T('Prova lo stesso angolo con due velocità diverse.', 'C’è solo la gravità, che tira verso il basso: cosa cambia allora in orizzontale?')],
      solution: T('Più forte lanci, più lontano arriva.', 'In orizzontale velocità costante (vₓ = v·cos θ); in verticale moto accelerato con g, come la caduta libera.'),
    },
    {
      id: 'm03-3', kind: 'prevedi', title: 'L’angolo migliore',
      sim: 'cannon', params: { ang: 45, v: 25, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'La forza del lancio resta sempre la stessa. Cambiamo solo <b>l’inclinazione</b> del cannone. Quale va più lontano?',
        'Velocità fissa: 25 m/s. Cambia solo l’<b>angolo</b>. Prima la previsione, poi l’esperimento.',
        'Stessa velocità di lancio, 25 m/s, angoli diversi. Quale angolo dà la <b>gittata</b> massima?'),
      steps: [
        {
          kind: 'q', clear: true,
          text: T('Quale angolo manda la palla più lontano?', 'A 25 m/s, quale angolo dà la gittata maggiore?'),
          options: [T('30°', '30°'), T('80°', '80°'), T('60°', '60°'), T('45°', '45°')],
          answer: 3,
          predict: [{ ang: 30, v: 25 }, { ang: 45, v: 25 }, { ang: 60, v: 25 }, { ang: 80, v: 25 }],
          explain: T(
            'A <b>45°</b>, a metà strada tra piatto e dritto in su, la palla va più lontano!',
            '<b>45°</b>: circa 64 m. La gittata è R = v²·sin(2θ)/g, massima quando sin(2θ) = 1, cioè θ = 45°.',
            '<b>45°</b>, circa 64 m: il compromesso migliore tra andare avanti e restare in aria. (Con l’aria vera, per un pallone conviene un po’ meno di 45°.)'),
        },
        {
          kind: 'q', only: ['s', 'c'], clear: true,
          text: T(null, 'Ora 30° e poi 60°, sempre a 25 m/s. Dove atterrano?', 'Ora 30° e 60°, stessa velocità. Dove atterrano?'),
          options: ['30° va più lontano', 'Atterrano nello stesso punto', '60° va più lontano'],
          answer: 1,
          predict: [{ ang: 30, v: 25 }, { ang: 60, v: 25 }],
          explain: T(null, 'Nello stesso punto, circa 55 m: sin(60°) = sin(120°). Angoli <b>complementari</b> (che sommati fanno 90°) danno la stessa gittata, ma a 60° la palla vola più in alto e più a lungo.', 'Nello stesso punto, circa 55 m: due angoli che sommati fanno 90° danno la stessa gittata. Quello alto però resta in aria più a lungo.'),
        },
      ],
      hints: [T('Troppo piatto, la palla cade subito. Troppo dritto, va su e torna giù. E a metà?', 'Ragiona sui due moti: un angolo basso dà poco tempo di volo, uno alto poca velocità orizzontale.')],
      solution: T('45°.', '45°, perché R = v²·sin(2θ)/g è massima per 2θ = 90°. 30° e 60° danno la stessa gittata.'),
    },
    {
      id: 'm03-4', kind: 'costruisci', title: 'Il tiro al bersaglio del parco',
      sim: 'cannon', params: { ang: 45, v: 20, xmax: 130, target: 50, tw: 3 }, controls: ['ang', 'v'],
      intro: T(
        'Nuovo gioco per il parco: il <b>tiro al bersaglio</b>! Colpisci la bandierina con il cannone.',
        'Nuovo pezzo del parco: il <b>tiro al bersaglio</b>. Scegli angolo e velocità per centrare la bandierina (devi atterrare entro 3 m dal centro).',
        'Nuovo pezzo del parco: il <b>tiro al bersaglio</b>. Usa quello che sai sulla gittata per fare centro.'),
      piece: { id: 'bersaglio', name: 'Il tiro al bersaglio', desc: 'Un cannone che fa centro alla distanza che vuoi, grazie alla regola della gittata.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Regola il cannone e spara.', 'Regola angolo e velocità e spara. Il secondo bersaglio sarà in un altro punto.'),
          gen: (lens, r) => {
            const d = Math.round(30 + Math.random() * 60);
            const tw = lens === 'e' ? 5 : 3;
            return { d, set: { target: d, tw }, text: `Il bersaglio è a <b>${d} metri</b>.` };
          },
          solve: (tg) => ({ ang: 45, v: Math.sqrt(tg.d * 9.81) }),
          check: (res, tg, lens) => {
            if (res.hit) return { ok: true, msg: `Atterrata a ${num(res.x, 1)} m. Centro!` };
            const d = res.x - tg.d;
            return {
              ok: false,
              msg: d < 0
                ? `Troppo corto di ${num(-d, 1)} m. ${lens === 'e' ? 'Spara più forte!' : 'Cosa puoi cambiare per allungare il tiro?'}`
                : `Troppo lungo di ${num(d, 1)} m. ${lens === 'e' ? 'Spara più piano!' : 'Cosa puoi cambiare per accorciare il tiro?'}`,
            };
          },
        },
      ],
      hints: [
        T('Metti il cannone a metà, a 45°, e cambia solo la forza.', 'Conviene fissare una delle due variabili e regolare solo l’altra. Quale angolo rende i conti più semplici?'),
        T('Se la palla cade prima della bandierina, spara più forte.', 'A 45°: R = v²/g, quindi v = √(R·g).'),
      ],
      solution: T(
        'Lascia l’angolo a 45° e cambia la forza: circa 17 per 30 m, 22 per 50 m, 26 per 70 m, 30 per 90 m.',
        'R = v²·sin(2θ)/g. A 45°: v = √(R·g). Per 50 m → v ≈ 22 m/s; per 70 m → 26 m/s; per 90 m → 29,7 m/s.'),
    },
    {
      id: 'm03-5', kind: 'ripasso', title: 'Ripasso della Pista',
      intro: T('Ripassiamo tutta la Pista: velocità, cadute e lanci!', 'Ripasso della Pista: moto, caduta libera, proiettili.'),
      steps: [
        {
          kind: 'q', text: T('Nel disegno della gara, la macchinina più veloce ha la linea…', 'Nel grafico spazio-tempo, la pendenza della retta rappresenta…'),
          options: [T('più sdraiata', 'l’accelerazione'), T('più ripida', 'la velocità'), T('orizzontale', 'la posizione di partenza')],
          answer: 1, explain: T('Esatto: più ripida.', 'Esatto: pendenza = Δs/Δt = velocità.'),
        },
        {
          kind: 'q', text: T('Sulla Luna lasci cadere una piuma e un martello. Chi arriva prima?', 'Sulla Luna (niente aria) una piuma e un martello cadono…'),
          options: [T('Arrivano insieme', 'con la stessa accelerazione, 1,62 m/s²'), T('Prima il martello, che è pesante', 'il martello con accelerazione maggiore'), T('Prima la piuma, che è leggera', 'la piuma con accelerazione maggiore')],
          answer: 0, explain: T('Insieme: lì non c’è aria che frena.', 'Esatto: senza aria l’accelerazione è g per tutti. Apollo 15, 1971.'),
        },
        {
          kind: 'q', text: T('Per mandare una palla il più lontano possibile, come inclini il cannone?', 'A parità di velocità, quale angolo dà la gittata massima (senza aria)?'),
          options: [T('Quasi piatto', '15°'), T('Quasi dritto in su', '75°'), T('A metà', '45°')],
          answer: 2, explain: T('Giusto: a metà, a 45°.', 'Giusto: R = v²·sin(2θ)/g è massima a 45°.'),
        },
        {
          kind: 'q', only: ['s', 'c'], text: 'Nel punto più alto della traiettoria, la velocità della palla è…',
          options: ['zero', 'solo orizzontale', 'solo verticale'],
          answer: 1, explain: 'Esatto: vᵧ = 0, ma vₓ resta. La palla in cima non è mai ferma.',
        },
        {
          kind: 'q', text: T('Una palla cade da una torre. Mentre scende va…', 'In caduta libera, dopo 2 s, la velocità è circa…'),
          options: [T('sempre più piano', '9,8 m/s'), T('sempre più veloce', '19,6 m/s'), T('sempre uguale', '39,2 m/s')],
          answer: 1, explain: T('Esatto: sempre più veloce.', 'Esatto: v = g·t = 9,81 × 2 ≈ 19,6 m/s.'),
        },
      ],
      hints: [T('Ripensa alla gara, alla Luna e al cannone.')],
    },
    {
      // Boss: applica "due moti in uno" a una situazione nuova (lancio da una torre), invece di rifare il 45° di m03-3.
      id: 'm03-6', kind: 'boss', title: 'Il mito della palla che vola',
      sim: 'cannon', params: { ang: 0, v: 15, xmax: 60, h0: 20, drop: true }, controls: [],
      intro: T(
        'Sono Vetrino. Un ragazzo in cima alla torre del parco dice: <i>“Se lancio la palla in avanti, resta in aria molto di più di una lasciata cadere!”</i>. Sarà vero?',
        'Sono Vetrino. Un giocatore giura: <i>“Una palla lanciata in orizzontale da una torre resta in aria più a lungo di una lasciata cadere”</i>. Sembra sensato: fa più strada. O no?',
        'Sono Vetrino. <i>“Un proiettile sparato in orizzontale cade più tardi di uno lasciato cadere”</i>: lo pensano in tanti. Io non ti dico niente: chiedi all’esperimento.'),
      steps: [
        {
          kind: 'q', text: T('Quale esperimento ci serve?', 'Quale esperimento mette alla prova il mito?'),
          options: [
            T('Dalla stessa altezza, insieme: una lanciata in avanti e una lasciata cadere', 'Stessa altezza e stesso istante: una lanciata in orizzontale, una lasciata cadere'),
            T('Una lanciata dalla torre e una lasciata cadere da terra', 'Una lanciata da 20 m e una lasciata cadere da 5 m'),
            T('Una palla sola lanciata in avanti, guardata bene', 'Un solo lancio in orizzontale, cronometrato con cura'),
          ],
          answer: 0,
          explain: T('Giusto: stessa altezza, stesso momento. Cambia solo la spinta in avanti.', 'Giusto: l’unica differenza è la velocità orizzontale.'),
          wrong: T('Mmh, così cambiano due cose insieme, oppure non confronti niente. Come capiresti chi ha ragione?', 'Così non isoli la velocità orizzontale. A cosa daresti il merito della differenza?'),
        },
        {
          kind: 'q', clear: true,
          text: T('Torre alta 20 metri. Quale palla tocca terra per prima?', 'Da 20 m: lancio orizzontale a 15 m/s e caduta libera, nello stesso istante. Che cosa prevedi?'),
          options: [T('Quella lasciata cadere', 'Prima quella lasciata cadere'), T('Quella lanciata in avanti', 'Prima quella lanciata'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 2,
          predict: [{ ang: 0, v: 15, h0: 20, drop: true }],
          explain: T(
            'Insieme! I puntini rosa e quelli bianchi scendono alla stessa altezza in ogni istante.',
            'Insieme, in circa 2,02 s: t = √(2h/g) = √(40/9,81). Il moto orizzontale e quello verticale sono indipendenti: in verticale le due palle fanno la stessa caduta libera.',
            'Insieme, in circa 2 secondi. La spinta in avanti non cambia la caduta: in verticale è la stessa per tutte e due.'),
        },
        {
          kind: 'q', clear: true,
          text: T('E se la lanci molto più forte?', 'E con 30 m/s invece di 15?'),
          options: [T('Allora resta in aria di più', 'Resta in aria il doppio'), T('Arrivano ancora insieme', 'Arrivano ancora insieme'), T('Allora cade prima', 'Cade in metà tempo')],
          answer: 1,
          predict: [{ ang: 0, v: 30, h0: 20, drop: true }],
          explain: T('Ancora insieme! Va più lontano, ma ci mette lo stesso tempo.', 'Stesso tempo, 2,02 s: raddoppia la gittata (da 30 a 61 m), non il tempo di volo.', 'Stesso tempo: va il doppio più lontano, ma la caduta è sempre quella.'),
        },
        {
          kind: 'q', text: T('Allora, il ragazzo aveva ragione?', 'Conclusione?'),
          options: [
            T('Sì: lanciata in avanti resta in aria di più', 'Il mito è vero: più veloce, più tempo in volo'),
            T('Dipende da quanto pesa la palla', 'Dipende dalla massa del proiettile'),
            T('No: cadono insieme, anche lanciando forte', 'Il mito è falso: il tempo dipende solo dall’altezza'),
          ],
          answer: 2,
          explain: T('Mito smontato! La spinta in avanti fa andare lontano, ma non rallenta la caduta.', 'Mito smontato: in orizzontale v costante, in verticale caduta libera. I due moti non si disturbano.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi altezza e spinta insieme, a chi dai il merito?'), T('Vetrino chiede: guarda i puntini a tempi uguali. Sono alla stessa altezza?', 'Vetrino chiede: la velocità orizzontale entra nella formula della caduta?')],
      solution: T('Stessa altezza, stesso istante: arrivano insieme, anche lanciando più forte. Il mito è falso.', 'Da 20 m: t = √(2h/g) ≈ 2,02 s per tutte e due, a 15 o 30 m/s. Il mito è falso.'),
    },
  ],
};
