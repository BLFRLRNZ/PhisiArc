// M03 · Moto nel piano e proiettili. Simulazione: il cannone con angolo, velocità e bersaglio.
import { T, pick, num } from '../util.js';

export default {
  id: 'M03',
  title: 'Moto nel piano e proiettili',
  levels: [
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
            T('Una linea dritta', 'Una retta'),
            T('Un cerchio', 'Un arco di circonferenza'),
            T('Una curva come un ponte: sale e poi scende', 'Una parabola'),
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
          options: ['resta costante', 'cresce sempre', 'diminuisce in salita, si annulla in cima, poi cresce verso il basso'],
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
      piece: { id: 'bersaglio', icon: '🎯', name: 'Il tiro al bersaglio', desc: 'Un cannone che fa centro alla distanza che vuoi, grazie alla regola della gittata.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Regola il cannone e spara.', 'Regola angolo e velocità e spara. Il secondo bersaglio sarà in un altro punto.'),
          gen: (lens, r) => {
            const d = Math.round(30 + Math.random() * 60);
            const tw = lens === 'e' ? 5 : 3;
            return { d, set: { target: d, tw }, text: `Il bersaglio è a <b>${d} metri</b>.` };
          },
          check: (res, tg, lens) => {
            if (res.hit) return { ok: true, msg: `Atterrata a ${num(res.x, 1)} m. Centro! 🎯` };
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
          options: [T('Arrivano insieme', 'con la stessa accelerazione, 1,62 m/s²'), T('Il martello', 'il martello con accelerazione maggiore'), T('La piuma', 'la piuma con accelerazione maggiore')],
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
      id: 'm03-6', kind: 'boss', title: 'Il mito del tiro alto',
      sim: 'cannon', params: { ang: 45, v: 25, xmax: 100 }, controls: ['ang', 'v'],
      intro: T(
        'Sono Vetrino. Un ragazzo al parco dice: <i>“Per tirare lontanissimo devi tirare il più in alto possibile!”</i>. Sarà vero?',
        'Sono Vetrino. Un giocatore giura: <i>“Per tirare più lontano bisogna tirare il più in alto possibile”</i>. Sembra sensato: più sta in aria, più va lontano. O no?',
        'Sono Vetrino. <i>“Per tirare più lontano bisogna tirare il più in alto possibile”</i>: lo dicono in tanti. Io non ti dico niente: chiedi all’esperimento.'),
      steps: [
        {
          kind: 'q', text: T('Quale esperimento ci serve?', 'Quale esperimento mette alla prova il mito?'),
          options: [
            T('Un tiro alto e piano contro un tiro a metà e forte', 'Un tiro a 80° e 15 m/s contro uno a 45° e 30 m/s'),
            T('Un tiro solo, molto alto', 'Un solo tiro a 80°'),
            T('Stessa forza, un tiro molto alto e uno a metà', 'Stessa velocità (25 m/s), un tiro a 80° e uno a 45°'),
          ],
          answer: 2,
          explain: T('Giusto: stessa forza, cambia solo l’angolo.', 'Giusto: cambia solo l’angolo, la velocità resta uguale.'),
          wrong: T('Mmh, così cambiano due cose insieme, oppure non confronti niente. Come capiresti chi ha ragione?', 'Così non isoli l’angolo. A cosa daresti il merito della differenza?'),
        },
        {
          kind: 'q', clear: true,
          text: T('Stessa forza: tiro a 80° e tiro a 45°. Quale va più lontano?', 'v = 25 m/s: 80° oppure 45°. Che cosa prevedi?'),
          options: [T('Quello a 80°', 'Quello a 80°'), T('Quello a 45°', 'Quello a 45°'), T('Arrivano nello stesso punto', 'Stessa gittata')],
          answer: 1,
          predict: [{ ang: 80, v: 25 }, { ang: 45, v: 25 }],
          explain: T(
            'Il tiro a 45° va quasi tre volte più lontano! Quello alto sale tanto ma avanza poco.',
            '80° → circa 22 m; 45° → circa 64 m. A 80° la palla resta in aria più a lungo, ma vₓ = v·cos 80° è solo 4,3 m/s.',
            '80°: circa 22 m. 45°: circa 64 m. Il tiro alto resta in aria di più, ma quasi non avanza.'),
        },
        {
          kind: 'q', text: T('Allora, il ragazzo aveva ragione?', 'Conclusione?'),
          options: [
            T('Sì, più alto è sempre meglio', 'Il mito è vero: più alto, più lontano'),
            T('Non si può sapere', 'Non si può concludere nulla'),
            T('No: troppo in alto la palla va su e torna giù. Meglio a metà', 'Il mito è falso: la gittata è massima a 45°, non a 90°'),
          ],
          answer: 2,
          explain: T('Mito smontato! Il tiro migliore è a metà strada, a 45°.', 'Mito smontato: R = v²·sin(2θ)/g. A 90° la gittata è zero; il massimo è a 45°.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi angolo e forza insieme, a chi dai il merito?'), T('Vetrino chiede: che succede se spari dritto in su, a 90°?', 'Vetrino chiede: quanto avanza in orizzontale una palla sparata quasi in verticale?')],
      solution: T('Stessa forza, 80° contro 45°: vince 45° (64 m contro 22 m). Il mito è falso.', 'A 25 m/s: 80° → 22 m, 45° → 64 m. La gittata è massima a 45°: il mito è falso.'),
    },
  ],
};
