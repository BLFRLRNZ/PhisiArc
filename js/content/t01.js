// T01 · Temperatura, calore e come si propaga. Simulazioni: le particelle, il caldo che incontra il freddo e le due
// pentole sullo stesso fuoco (heat.js); le barre con la cera, le lattine al sole e le panchine da toccare (conduct.js).
// La zona va dalla temperatura (l'agitazione delle particelle, lo zero assoluto, i kelvin) al calore (l'equilibrio, il
// calore specifico), costruisce le terme del vulcano, passa per i tre viaggi del calore (conduzione, convezione,
// irraggiamento) e finisce con il mito di Vetrino: «il metallo è più freddo del legno».
import { T } from '../util.js';

export default {
  id: 'T01',
  title: 'Temperatura, calore e come si propaga',
  levels: [
    {
      id: 't01-1', kind: 'lezione', title: 'Che cos’è la temperatura',
      sim: 'heat', params: { mode: 'particelle', t: 20 }, controls: ['t'],
      intro: T(
        'Ciao, sono Termo! Tutto è fatto di pezzettini piccolissimi, le particelle, che si agitano sempre. Più una cosa è calda, più le sue particelle corrono. Prova a scaldare e a raffreddare la scatola!',
        'La <b>temperatura</b> misura quanto si agitano le particelle di un corpo: più è alta, più corrono. Raffreddando rallentano, fino a fermarsi a −273 °C, lo <b>zero assoluto</b>: più freddo di così non si può. Da lì parte la scala <b>Kelvin</b>: T = t + 273.',
        'Un bicchiere d’acqua sembra immobile, ma le sue molecole corrono a centinaia di metri al secondo e si urtano miliardi di volte. La temperatura è la misura di quell’agitazione. Togliendone sempre di più si arriva a un limite, lo zero assoluto, a −273 °C. [[T (kelvin) = t (°C) + 273]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una temperatura bassissima e una altissima.', 'Prova temperature molto basse e molto alte.'),
          need: [
            { when: 't <= -200', try: { t: -250 }, msg: T('Ora raffredda tantissimo: sotto i 200 gradi sotto zero.', 'Manca una prova sotto i −200 °C.') },
            { when: 't >= 300', try: { t: 400 }, msg: T('Ora scalda tantissimo: sopra i 300 gradi.', 'Manca una prova sopra i 300 °C.') },
          ],
        },
        {
          kind: 'q',
          text: T('Che cosa succede alle particelle quando una cosa si scalda?', 'Che cosa misura, in fondo, la temperatura?', 'Perché non esiste una temperatura più bassa di −273 °C?'),
          options: [T('corrono più veloci', 'quanto si agitano le particelle', 'lì le particelle sono già ferme: meno di così non si può'), T('diventano più grandi', 'quanta materia c’è in un corpo', 'a quella temperatura ogni cosa diventa un gas'), T('si fermano', 'quanto è grande un corpo', 'i termometri non arrivano più in basso')],
          answer: 0,
          explain: T('Giusto: più caldo, particelle più veloci. Più freddo, più lente.', 'Esatto: la temperatura è la misura dell’agitazione delle particelle.', 'Esatto: allo zero assoluto l’agitazione è finita, e non si può togliere quello che non c’è più.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Dai gradi Celsius ai kelvin.'),
          vals: { t: [[20, 37, 100], [-73, -196]] }, calc: 't + 273', unit: 'K', tol: 1,
          ask: T(null, 'Quanti kelvin sono <b>{t} °C</b>?', 'Quanto vale <b>{t} °C</b> nella scala Kelvin? [[T = t + 273]]'),
          explain: T(null, 'Esatto: {t} + 273 = {ans:0} K.', 'Esatto: {ans:0} K. Un grado Celsius e un kelvin sono lo stesso salto: cambia solo lo zero.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('A 30 gradi sotto zero, le particelle…'),
          options: [T('si muovono ancora, ma piano'), T('sono ferme del tutto'), T('corrono più veloci')],
          answer: 0,
          explain: T('Giusto: si fermano del tutto solo a 273 gradi sotto zero, lo zero assoluto.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'A 20 °C, quanto corrono le molecole dell’aria?', 'Se la temperatura in kelvin raddoppia, la velocità delle molecole…'),
          options: [T(null, 'circa 500 m/s, più di un aereo di linea', 'cresce di circa 1,4 volte'), T(null, 'circa 5 m/s, come chi corre', 'raddoppia anche lei'), T(null, 'sono quasi ferme', 'diventa quattro volte più grande')],
          answer: 0,
          explain: T(null, 'Esatto: circa 500 m/s. Non le sentiamo perché sono piccolissime e vanno in tutte le direzioni.', 'Esatto: la velocità va con la radice della temperatura assoluta: temperatura doppia, velocità 1,4 volte. [[v ∝ √T]]'),
        },
      ],
      hints: [T('Più caldo, particelle più veloci.', 'T = t + 273; a 0 K le particelle sono ferme.', 'La temperatura misura l’agitazione delle particelle.')],
      solution: T(
        'Più una cosa è calda, più le sue particelle corrono.',
        'La temperatura misura l’agitazione: T (K) = t (°C) + 273.',
        'Temperatura vuol dire agitazione; allo zero assoluto, −273 °C, si ferma tutto.'),
    },
    {
      id: 't01-2', kind: 'prevedi', title: 'Caldo più freddo',
      sim: 'heat', params: { mode: 'mescola', m1: 1, T1: 80, m2: 1, T2: 20 }, controls: [],
      intro: T(
        'Mistero in cucina! Mescoli un litro d’acqua calda e un litro d’acqua fredda. Quanto sarà calda l’acqua alla fine? Prima indovina, poi guarda.',
        'Quando un corpo caldo tocca un corpo freddo, il calore passa dal caldo al freddo finché le temperature diventano uguali: è l’<b>equilibrio termico</b>. Ma a che temperatura si fermano? Prevedi, poi guarda.',
        'Il caffè si raffredda, il ghiacciolo si scioglie, la pentola si scalda: il calore va sempre dal caldo al freddo, finché tutto arriva alla stessa temperatura. Quale? Dipende da quanto c’è di ciascuno, e di che cosa è fatto. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ what: 'acqua', m1: 1, T1: 80, m2: 1, T2: 20 }],
          text: T('Un litro a 80 gradi e un litro a 20 gradi. Alla fine l’acqua è a…', 'Un litro d’acqua a 80 °C e un litro a 20 °C. Alla fine?', 'Un litro d’acqua a 80 °C più un litro a 20 °C: dove si fermano?'),
          options: [T('50 gradi', '50 °C', '50 °C'), T('100 gradi', '100 °C', '100 °C'), T('60 gradi', '60 °C', '60 °C')],
          answer: 0,
          explain: T('Giusto: a metà strada, 50 gradi. Il caldo perde quello che il freddo guadagna.', 'Esatto: 50 °C, a metà. Il calore perso dall’acqua calda è quello guadagnato dalla fredda.', 'Esatto: con quantità uguali la temperatura finale sta a metà. Le temperature non si sommano: si fa la media.'),
          solution: T('50 gradi.', '50 °C.'),
        },
        {
          kind: 'q', predict: [{ what: 'acqua', m1: 1, T1: 80, m2: 2, T2: 20 }],
          text: T('Ora un litro a 80 gradi e due litri a 20 gradi. Alla fine…', 'Un litro a 80 °C e due litri a 20 °C. Alla fine?', 'E con un litro a 80 °C e due litri a 20 °C?'),
          options: [T('40 gradi', '40 °C', '40 °C'), T('50 gradi', '50 °C', '50 °C'), T('60 gradi', '60 °C', '60 °C')],
          answer: 0,
          explain: T('Giusto: 40 gradi. C’è più acqua fredda, e la fine è più vicina al freddo.', 'Esatto: 40 °C. È la media pesata: (1 × 80 + 2 × 20) / 3 = 40.', 'Esatto: 40 °C, più vicino ai 20 °C, perché l’acqua fredda è il doppio.'),
          solution: T('40 gradi.', '40 °C.'),
        },
        {
          kind: 'q', predict: [{ what: 'ferro', m1: 1, T1: 100, m2: 1, T2: 20 }],
          text: T('Una palla di ferro da 1 kg a 100 gradi finisce in un litro d’acqua a 20 gradi. Alla fine…', 'Un chilo di ferro a 100 °C in un litro d’acqua a 20 °C. Alla fine?', 'Un chilo di ferro a 100 °C in un chilo d’acqua a 20 °C: dove si fermano?'),
          options: [T('circa 28 gradi', 'circa 28 °C', 'verso i 28 °C'), T('60 gradi, a metà', '60 °C, a metà strada', 'a 60 °C, a metà strada'), T('100 gradi', 'circa 92 °C', 'verso i 92 °C')],
          answer: 0,
          explain: T('Giusto: l’acqua si scalda poco! Per scaldare l’acqua serve tantissimo calore, molto più che per il ferro.', 'Esatto: circa 28 °C. A pari massa, l’acqua ha bisogno di quasi 10 volte più calore del ferro per scaldarsi di un grado.', 'Esatto: circa 28 °C. L’acqua è una spugna di calore: per scaldarsi di un grado ne vuole quasi dieci volte più del ferro.'),
          solution: T('Circa 28 gradi.', 'Circa 28 °C.'),
        },
        {
          kind: 'q',
          text: T('Allora, il calore passa…', 'In che direzione passa il calore, da solo?', 'Perché una bibita fresca, lasciata sul tavolo, si scalda?'),
          options: [T('dal caldo al freddo', 'dal corpo più caldo al più freddo', 'riceve calore dall’aria della stanza'), T('dal freddo al caldo', 'dal corpo più freddo al più caldo', 'il freddo esce dalla bibita'), T('da tutte e due le parti, uguale', 'dal corpo più grande al più piccolo', 'il vetro della bottiglia produce calore')],
          answer: 0,
          explain: T('Giusto: sempre dal caldo al freddo, finché le temperature sono uguali.', 'Esatto: da solo, il calore va sempre dal più caldo al più freddo.', 'Esatto: non esce il freddo, entra il calore. Il freddo non è una cosa che viaggia: è poca agitazione.'),
        },
      ],
      hints: [T('Il caldo e il freddo si incontrano a metà strada, se sono quantità uguali.', 'Calore ceduto = calore ricevuto.', 'Il caldo cede quello che il freddo riceve: conta quanto c’è di ciascuno.')],
    },
    {
      id: 't01-3', kind: 'lezione', title: 'Il calore specifico',
      sim: 'heat', params: { mode: 'scaldare', a: 'acqua', b: 'sabbia' }, controls: ['a', 'b'],
      intro: T(
        'Due pentole sullo stesso fuoco, per lo stesso tempo: una con l’acqua, una con la sabbia. Il fuoco dà a tutte e due la stessa energia, il <b>calore</b>. Chi si scalda di più?',
        'Il <b>calore</b> è energia che passa da un corpo caldo a uno freddo. Per scaldare di 1 °C un chilo d’acqua servono 4186 J: è il <b>calore specifico</b> dell’acqua, c. In generale Q = m·c·ΔT: più c è grande, più calore serve. Nei liquidi, intanto, il caldo sale e il freddo scende: è la <b>convezione</b>.',
        'Calore e temperatura non sono la stessa cosa: il calore è energia in viaggio, la temperatura è l’agitazione delle particelle. Ogni sostanza risponde al calore a modo suo: l’acqua si scalda lentissima, la sabbia in fretta. Nella pentola d’acqua si vede anche la convezione: il caldo sale dal fondo, il freddo scende. [[Q = m · c · ΔT]]'),
      steps: [
        {
          kind: 'free', runs: 2, distinct: true,
          text: T('Prova coppie di pentole diverse.', 'Confronta sostanze diverse sullo stesso fuoco.'),
        },
        {
          kind: 'q',
          text: T('Stesso fuoco, stesso tempo. Chi si scalda di meno?', 'Quale sostanza ha il calore specifico più grande?', 'Perché d’estate, a mezzogiorno, la sabbia scotta e il mare no?'),
          options: [T('l’acqua', 'l’acqua', 'l’acqua ha bisogno di più calore'), T('la sabbia', 'la sabbia', 'sul mare arriva meno luce, che le onde riflettono'), T('il ferro', 'il ferro', 'la sabbia è un po’ più vicina al sole del mare')],
          answer: 0,
          explain: T('Giusto: l’acqua è lentissima a scaldarsi. Le serve tanto calore per ogni grado.', 'Esatto: c = 4186 J/(kg·°C), quasi cinque volte la sabbia e nove volte il ferro.', 'Esatto: stessa luce, ma l’acqua ha il calore specifico più alto, e sale di pochi gradi.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Quanto calore serve.'),
          vals: { m: [[1, 2], [0.5, 3]] }, calc: 'm * 4186 * 50 / 1000', unit: 'kJ', tol: 2,
          ask: T(null,
            'Quanta energia serve per scaldare <b>{m} kg</b> d’acqua da 20 °C a 70 °C? (Q = m·c·ΔT, c = 4186 J/(kg·°C))',
            'Quanti kilojoule servono per portare <b>{m} kg</b> d’acqua da 20 a 70 °C? [[Q = m · c · ΔT, c = 4186 J/(kg·°C)]]'),
          explain: T(null, 'Esatto: {m} × 4186 × 50 J = {ans:1} kJ.', 'Esatto: {ans:1} kJ.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché d’estate il mare è fresco e la sabbia scotta?'),
          options: [T('l’acqua si scalda lentamente'), T('il sole non arriva sul mare'), T('la sabbia è più vicina al sole')],
          answer: 0,
          explain: T('Giusto: stesso sole, ma l’acqua è lentissima a scaldarsi.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Nella pentola d’acqua il caldo sale dal fondo e il freddo scende ai lati. Come si chiama?', 'Perché i termosifoni si mettono in basso, sotto la finestra?'),
          options: [T(null, 'convezione', 'l’aria calda sale e gira'), T(null, 'evaporazione', 'così scaldano prima il pavimento'), T(null, 'ebollizione', 'in alto si rovinerebbero col calore')],
          answer: 0,
          explain: T(null, 'Esatto: nei liquidi e nei gas il calore viaggia con la materia stessa, che si muove.', 'Esatto: è la convezione. L’aria calda sale, quella fredda scende, e la stanza si scalda tutta.'),
        },
      ],
      hints: [T('Lo stesso fuoco scalda di più chi ha bisogno di meno calore.', 'ΔT = Q / (m·c): c grande, ΔT piccolo.', 'Più calore specifico vuol dire più calore per ogni grado.')],
      solution: T(
        'L’acqua si scalda lentamente: le serve tanto calore.',
        'Q = m·c·ΔT: l’acqua ha c = 4186 J/(kg·°C), il più grande.',
        'L’acqua è la più lenta a scaldarsi: ha il calore specifico più alto.'),
    },
    {
      id: 't01-4', kind: 'costruisci', title: 'Le terme del vulcano',
      sim: 'heat', params: { mode: 'mescola', what: 'acqua', m1: 2, T1: 80, m2: 1, T2: 10 }, controls: ['m2'],
      intro: T(
        'Nel parco arrivano le terme! Dal vulcano esce acqua a 80 gradi, dal ruscello acqua a 10 gradi. Per un bagno perfetto ci vogliono 38 gradi: quanta acqua fredda devi aggiungere?',
        'Costruisci le terme del parco. L’acqua del vulcano esce a 80 °C, quella del ruscello a 10 °C, e il bagno deve arrivare a 38 °C. Il calore ceduto dall’acqua calda è quello ricevuto dalla fredda: m₁·(80 − 38) = m₂·(38 − 10).',
        'Le terme del parco mescolano due acque: quella del vulcano, a 80 °C, e quella del ruscello, a 10 °C. Il bagnino vuole 38 °C. Il calore che l’acqua calda perde scendendo di 42 gradi è quello che la fredda guadagna salendo di 28. [[m₁ · (80 − 38) = m₂ · (38 − 10)]]'),
      piece: { id: 'terme', name: 'Le terme del vulcano', desc: 'Una vasca d’acqua calda: l’acqua del vulcano e quella del ruscello, mescolate a 38 °C.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanta acqua fredda versare, poi mescola.', 'Regola l’acqua fredda, poi mescola: arrivi a 38 °C?'),
          vals: { e: { h: [[2], [4]] }, s: { h: [[1, 3], [5]] } },
          set: { m1: 'h', T1: '80', T2: '10' },
          ask: T(
            'Hai <b>{h} litri</b> d’acqua del vulcano. Quanti litri d’acqua fredda servono per arrivare a 38 gradi?',
            '<b>{h} L</b> d’acqua a 80 °C: quanti litri a 10 °C servono per arrivare a 38 °C?',
            'Con <b>{h} litri</b> dal vulcano, quanta acqua del ruscello serve per un bagno a 38 °C?'),
          measure: 'm2', goal: 'h * 1.5', tol: 0.2,
          ok: T('Bagno perfetto: 38 gradi!', 'Esatto: 38 °C!'),
          high: T('Troppa acqua fredda: il bagno è freddo. Togline un po’.', 'Troppa acqua fredda: sotto i 38 °C. Riducila.'),
          low: T('Troppo poca acqua fredda: il bagno scotta! Aggiungine.', 'Troppo poca acqua fredda: sopra i 38 °C. Aumentala.'),
          solve: { m2: 'h * 1.5' },
        },
        {
          kind: 'q',
          text: T('Se l’acqua del vulcano raddoppia, l’acqua fredda deve…', 'Con il doppio dell’acqua calda, per restare a 38 °C l’acqua fredda deve…', 'Perché nel conto delle terme non serve il calore specifico?'),
          options: [T('raddoppiare anche lei', 'raddoppiare', 'sono tutte e due acqua: lo stesso c sparisce dal conto'), T('restare uguale: basta quella di prima', 'restare uguale', 'il calore specifico dell’acqua vale 1'), T('diventare la metà di prima', 'quadruplicare', 'l’acqua calda non ha calore specifico')],
          answer: 0,
          explain: T('Giusto: il doppio di caldo vuole il doppio di freddo.', 'Esatto: m₂ = 1,5·m₁, e se m₁ raddoppia raddoppia anche m₂.', 'Esatto: c compare da tutte e due le parti dell’uguale, e si semplifica.'),
        },
      ],
      hints: [T('Per ogni litro caldo servono un litro e mezzo di acqua fredda.', 'm₂ = m₁ · 42 / 28 = 1,5 · m₁.', 'L’acqua calda scende di 42 gradi, la fredda sale di 28: 42 / 28 = 1,5.')],
      solution: T('Per 2 litri caldi, 3 litri freddi; per 4, 6.', 'm₂ = 1,5 · m₁: per 3 L, 4,5 L.', 'Un litro e mezzo di acqua fredda per ogni litro di acqua calda.'),
    },
    {
      id: 't01-5', kind: 'lezione', title: 'Conduttori e isolanti',
      sim: 'conduct', params: { mode: 'barre' }, controls: [],
      intro: T(
        'Quattro barre hanno un capo nell’acqua bollente: rame, ferro, vetro e legno. Sotto ci sono palline di cera, che cadono quando lì arriva il caldo. In quale barra il caldo corre di più?',
        'Il calore passa da una particella all’altra per urti, senza che la materia si sposti: è la <b>conduzione</b>. I metalli sono buoni <b>conduttori</b>; il vetro, il legno, la lana e l’aria sono <b>isolanti</b>. La cera si scioglie a 50 °C e mostra fin dove è arrivato il calore.',
        'Nei metalli ci sono elettroni liberi che portano l’energia di corsa da un capo all’altro: per questo il cucchiaino d’acciaio nel tè scotta subito, quello di legno mai. La <b>conduzione</b> è il calore che passa di urto in urto, senza spostare la materia.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Lancia e guarda le palline di cera.', 'Lancia e conta le palline che cadono.') },
        {
          kind: 'q',
          text: T('In quale barra il caldo è arrivato più lontano?', 'Quale barra conduce meglio il calore?', 'Perché le pentole hanno il manico di legno o di plastica?'),
          options: [T('nel rame', 'il rame', 'sono isolanti'), T('nel legno', 'il ferro', 'sono più leggeri del metallo'), T('nel vetro', 'il legno', 'il metallo col caldo si romperebbe')],
          answer: 0,
          explain: T('Giusto: nel rame sono cadute tutte le palline! Il rame porta il caldo velocissimo.', 'Esatto: il rame conduce più di quattro volte meglio del ferro, e migliaia di volte meglio del legno.', 'Esatto: il legno e la plastica sono isolanti, e il manico resta tiepido.'),
        },
        {
          kind: 'q',
          text: T('Perché d’inverno ci mettiamo il maglione di lana?', 'Un maglione di lana non produce calore: allora perché ci tiene caldi?', 'Perché una finestra con due vetri isola meglio di un vetro spesso il doppio?'),
          options: [T('tiene vicino a noi il caldo del corpo', 'è isolante: trattiene il calore del corpo', 'fra i due vetri c’è aria, un ottimo isolante'), T('produce calore da solo', 'la lana produce un po’ di calore', 'due vetri riflettono il doppio della luce'), T('fa entrare il freddo', 'blocca il freddo che vuole entrare', 'il vetro doppio è più duro e più spesso di uno solo')],
          answer: 0,
          explain: T('Giusto: la lana non scalda, ma tiene il caldo del corpo vicino a noi.', 'Esatto: il calore viene dal corpo; la lana, e l’aria chiusa fra i suoi fili, lo fanno scappare piano.', 'Esatto: l’aria ferma conduce pochissimo. Per questo isolano la lana, le piume, il polistirolo.'),
        },
        {
          kind: 'q',
          text: T('Per fare una pentola che scalda in fretta, scegli…', 'Nel ferro sono cadute due palline, nel rame tutte. Che cosa vuol dire?', 'Il polistirolo è fatto per il 98% di aria. Perché isola così bene?'),
          options: [T('il rame', 'il rame conduce il calore molto meglio del ferro', 'l’aria ferma, chiusa nelle bollicine, conduce pochissimo'), T('il legno', 'il ferro era più freddo all’inizio', 'la plastica respinge il calore'), T('il vetro', 'la cera sul rame si scioglie prima', 'il polistirolo è molto denso')],
          answer: 0,
          explain: T('Giusto: le pentole migliori hanno il fondo di rame.', 'Esatto: stessa acqua, stessa cera, stesso tempo: cambia solo quanto conduce la barra.', 'Esatto: l’aria è un pessimo conduttore, purché resti ferma e non giri per convezione.'),
        },
      ],
      hints: [T('Guarda dove cadono più palline.', 'Metalli conduttori, legno e vetro isolanti.', 'Conduce bene chi fa cadere più cera.')],
      solution: T(
        'Il caldo corre di più nel rame, quasi niente nel legno.',
        'Il rame è il miglior conduttore; vetro e legno sono isolanti.',
        'I metalli conducono il calore, il legno e il vetro lo frenano.'),
    },
    {
      id: 't01-6', kind: 'lezione', title: 'Il calore che viaggia nel vuoto',
      sim: 'conduct', params: { mode: 'sole' }, controls: [],
      intro: T(
        'Il Sole è lontanissimo, e fra noi e lui c’è il vuoto: niente aria, niente di niente. Eppure il suo caldo arriva! Viaggia con la luce. Guarda tre lattine al sole: una nera, una bianca e una lucida.',
        'Il calore viaggia in tre modi: per <b>conduzione</b> nei solidi, per <b>convezione</b> nei liquidi e nei gas, e per <b>irraggiamento</b>, con la luce e i raggi infrarossi. L’irraggiamento è l’unico che passa anche nel vuoto: così il Sole scalda la Terra. Le superfici scure assorbono la luce, quelle chiare e lucide la riflettono.',
        'Fra il Sole e la Terra ci sono 150 milioni di chilometri di vuoto: niente conduzione, niente convezione. Il calore arriva per <b>irraggiamento</b>, onde di luce e di infrarossi che viaggiano anche nel nulla. Ogni corpo caldo irraggia: anche tu, e le telecamere termiche lo vedono.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Lancia: dieci minuti al sole.', 'Lancia e guarda le tre temperature.') },
        {
          kind: 'q',
          text: T('Quale lattina si scalda di più al sole?', 'Perché la lattina nera si scalda di più?', 'Perché d’estate conviene vestirsi di bianco?'),
          options: [T('la nera', 'assorbe quasi tutta la luce', 'il bianco riflette la luce'), T('la bianca', 'il nero produce calore da solo', 'il bianco lascia passare più aria'), T('la lucida', 'è fatta di un metallo diverso', 'il nero produce calore da solo')],
          answer: 0,
          explain: T('Giusto: la nera si tiene quasi tutta la luce, e la luce del sole la scalda.', 'Esatto: la luce assorbita diventa calore; quella riflessa se ne va.', 'Esatto: un vestito bianco rimanda indietro gran parte della luce del sole.'),
        },
        {
          kind: 'q',
          text: T('Come arriva fino a noi il caldo del Sole?', 'Quale dei tre viaggi del calore funziona anche nel vuoto?', 'Un thermos ha due pareti di vetro, il vuoto in mezzo e l’interno argentato. Che cosa blocca l’argento?'),
          options: [T('con la luce, anche nel vuoto', 'l’irraggiamento', 'l’irraggiamento: rimanda indietro gli infrarossi'), T('con l’aria, che lo porta', 'la conduzione, attraverso l’aria', 'la conduzione: l’argento non conduce il calore del tè'), T('non arriva: è caldo solo il Sole', 'la convezione, con il vento', 'la convezione: ferma l’aria')],
          answer: 0,
          explain: T('Giusto: il caldo del Sole viaggia con la sua luce, anche dove non c’è niente.', 'Esatto: conduzione e convezione hanno bisogno di materia; l’irraggiamento no.', 'Esatto: il vuoto ferma conduzione e convezione, l’argento l’irraggiamento. Il tè resta caldo per ore.'),
        },
        {
          kind: 'q',
          text: T('Perché sotto l’ombrellone si sta più freschi?', 'Di giorno la brezza soffia dal mare verso la spiaggia. Perché?', 'Di notte, con il cielo sereno, fa più freddo che con le nuvole. Perché?'),
          options: [T('l’ombrellone ferma la luce del sole', 'la sabbia scalda l’aria, che sale; dal mare arriva aria fresca', 'la Terra irraggia calore verso lo spazio, e le nuvole lo rimandano giù'), T('sotto c’è più vento', 'le onde spingono l’aria verso la spiaggia', 'le nuvole producono calore'), T('l’ombrellone produce freddo', 'di giorno la Luna attira l’aria', 'di notte il vento è più freddo')],
          answer: 0,
          explain: T('Giusto: niente luce diretta, niente calore per irraggiamento.', 'Esatto: è convezione. La sabbia si scalda più del mare, l’aria sopra sale, e al suo posto arriva quella del mare.', 'Esatto: senza nuvole, il calore irraggiato dal suolo se ne va nello spazio.'),
        },
      ],
      hints: [T('La nera tiene la luce, le chiare la rimandano indietro.', 'Scuro assorbe, chiaro e lucido riflettono.', 'Conta quanta luce la superficie assorbe.')],
      solution: T(
        'La nera si scalda di più: prende quasi tutta la luce.',
        'Irraggiamento: la nera assorbe, la bianca e la lucida riflettono.',
        'Il calore del Sole arriva per irraggiamento, e lo assorbono le superfici scure.'),
    },
    {
      id: 't01-7', kind: 'ripasso', title: 'Ripasso di temperatura e calore',
      intro: T('Ripassiamo: caldo, freddo e come viaggia il calore!', 'Ripasso: temperatura, calore specifico e i tre viaggi del calore.', 'Ripasso: dalle particelle che si agitano al Sole che ci scalda.'),
      steps: [
        {
          kind: 'q',
          text: T('Tieni in mano un cubetto di ghiaccio. Il calore va…', 'Tieni un cubetto di ghiaccio in mano. Il calore passa…', 'Che cosa vuol dire, in fisica, che una cosa è fredda?'),
          options: [T('dalla mano al ghiaccio', 'dalla mano al ghiaccio', 'le sue particelle si agitano poco'), T('dal ghiaccio alla mano', 'dal ghiaccio alla mano', 'contiene una sostanza, il freddo'), T('da nessuna parte', 'non passa: si scambiano il freddo', 'non ha più nessuna energia dentro di sé')],
          answer: 0,
          explain: T('Giusto: la mano perde calore, e il ghiaccio lo prende.', 'Esatto: dal caldo al freddo, sempre. Il freddo non viaggia.', 'Esatto: freddo vuol dire poca agitazione, non una sostanza.'),
        },
        {
          kind: 'q',
          text: T('Mescoli un litro d’acqua a 60 gradi e uno a 20 gradi. Alla fine…', 'Mescoli 1 L a 60 °C e 3 L a 20 °C. Temperatura finale?', 'Perché una piscina resta fresca anche dopo una giornata di sole?'),
          options: [T('40 gradi', '30 °C', 'l’acqua si scalda piano'), T('80 gradi', '40 °C', 'l’acqua riflette tutta la luce del sole'), T('20 gradi', '45 °C', 'il cloro tiene l’acqua sempre fresca')],
          answer: 0,
          explain: T('Giusto: quantità uguali, a metà strada.', 'Esatto: (60 + 3 × 20) / 4 = 30 °C.', 'Esatto: per scaldare tutta quell’acqua serve tantissimo calore.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'I kelvin.'),
          vals: { t: [-40, 0, 25, 1000] }, calc: 't + 273', unit: 'K', tol: 1,
          ask: T(null, 'Quanti kelvin sono <b>{t} °C</b>?', 'Quanto vale <b>{t} °C</b> in kelvin? [[T = t + 273]]'),
          explain: T(null, 'Esatto: {t} + 273 = {ans:0} K.', 'Esatto: {ans:0} K.'),
        },
        {
          kind: 'q',
          text: T('Quale cucchiaino scotta prima nel tè caldo?', 'Perché il manico di legno della pentola non scotta?', 'Vicino al camino acceso, che cosa ti scalda di più la faccia?'),
          options: [T('quello di metallo', 'il legno è un isolante', 'l’irraggiamento delle fiamme'), T('quello di legno', 'il legno si raffredda da solo', 'la conduzione del pavimento sotto i piedi'), T('quello di plastica', 'il legno riflette il calore', 'il fumo caldo che sale dalla canna')],
          answer: 0,
          explain: T('Giusto: il metallo porta il caldo in fretta fino alle dita.', 'Esatto: nel legno il calore avanza piano piano.', 'Esatto: l’aria calda sale nella canna fumaria; a scaldarti è la luce, anche quella infrarossa, delle fiamme.'),
        },
        {
          kind: 'q',
          text: T('Al sole, d’estate, quale maglietta tiene più freschi?', 'Il Sole che scalda la Terra e una stufa a infrarossi: come scaldano tutti e due?', 'Perché un cappotto scuro, al sole d’inverno, scalda di più di uno chiaro?'),
          options: [T('quella bianca', 'per irraggiamento', 'assorbe più luce, che diventa calore'), T('quella nera', 'per conduzione, toccando l’aria', 'trattiene meglio l’aria calda del corpo'), T('quella blu scuro', 'per convezione, con l’aria calda', 'il colore scuro è più spesso e pesante')],
          answer: 0,
          explain: T('Giusto: il bianco rimanda indietro la luce del sole.', 'Esatto: con la luce e gli infrarossi, anche senza toccare.', 'Esatto: la luce assorbita si trasforma in calore.'),
        },
      ],
    },
    {
      id: 't01-8', kind: 'boss', title: 'Il mito del metallo freddo',
      sim: 'conduct', params: { mode: 'tocco', amb: 10 }, controls: ['amb'],
      intro: T(
        'Sono Vetrino. D’inverno, al parco, Teo tocca la panchina di metallo e quella di legno: <i>“Il metallo è più freddo del legno!”</i>. Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“il metallo è più freddo del legno”</i>. D’inverno, al tatto, sembra proprio vero. Ma il termometro che cosa dice? E d’estate, al sole?',
        'Sono Vetrino. Il mito è vecchio quanto le panchine: <i>“il metallo è più freddo del legno”</i>. Il tatto non mente, ma che cosa misura davvero? Mettiamolo alla prova con il termometro e con la mano.'),
      steps: [
        {
          kind: 'q',
          text: T('Le due panchine sono fuori da tutta la notte. Che temperatura hanno?', 'Due panchine, una di metallo e una di legno, sono all’aperto da ore. Che cosa segna il termometro?', 'Due oggetti stanno nella stessa stanza da ore. Che temperatura hanno?'),
          options: [T('la stessa: quella dell’aria', 'la stessa temperatura, quella dell’aria', 'la stessa: sono in equilibrio con l’aria'), T('il metallo è più freddo', 'meno sulla panchina di metallo', 'dipende da che cosa sono fatti, e da quanto pesano'), T('il legno è più freddo', 'meno sulla panchina di legno', 'più bassa quello più pesante')],
          answer: 0,
          explain: T('Giusto: tutte e due hanno la temperatura dell’aria. Guarda il termometro!', 'Esatto: dopo ore, tutte e due sono in equilibrio con l’aria.', 'Esatto: il calore passa finché le temperature non sono uguali.'),
        },
        {
          kind: 'free',
          text: T('Prova le panchine d’inverno e d’estate.', 'Prova una temperatura fredda e una calda, sopra quella della mano.'),
          need: [
            { when: 'amb <= 10', try: { amb: 0 }, msg: T('Prova d’inverno: 10 gradi o meno.', 'Manca una prova a 10 °C o meno.') },
            { when: 'amb >= 40', try: { amb: 45 }, msg: T('Ora d’estate, al sole: 40 gradi o più.', 'Manca una prova a 40 °C o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('D’estate, al sole, quale panchina scotta di più?', 'A 45 °C, al sole, quale panchina sembra più calda al tatto?', 'Allora, che cosa sente davvero la mano?'),
          options: [T('il metallo', 'quella di metallo', 'quanto in fretta il calore entra o esce dalla pelle'), T('il legno, che è più scuro', 'quella di legno', 'la temperatura dell’oggetto'), T('scottano tutte e due uguale', 'nessuna: segnano tutte e due 45 °C', 'quanto pesa l’oggetto')],
          answer: 0,
          explain: T('Giusto: d’estate il metallo scotta e il legno no, anche se hanno la stessa temperatura.', 'Esatto: il metallo dà il suo calore alla mano molto più in fretta del legno.', 'Esatto: la pelle sente il calore che passa, e il metallo lo scambia in fretta.'),
        },
        {
          kind: 'q',
          text: T('Perché d’inverno il metallo sembra freddo?', 'Perché d’inverno il metallo sembra più freddo?', 'Perché il pavimento di piastrelle sembra più freddo del tappeto, nella stessa stanza?'),
          options: [T('porta via in fretta il caldo della mano', 'conduce bene: porta via in fretta il calore della mano', 'la piastrella conduce meglio e porta via più calore ai piedi'), T('è più freddo del legno', 'ha davvero una temperatura più bassa', 'la piastrella è davvero più fredda'), T('il metallo produce freddo', 'il metallo assorbe il freddo dell’aria', 'il tappeto produce calore')],
          answer: 0,
          explain: T('Giusto: il metallo è un buon conduttore, e il caldo della mano scappa in fretta.', 'Esatto: è la conduzione. Il legno, isolante, si scalda subito dove lo tocchi e smette di rubare calore.', 'Esatto: stessa temperatura, ma la piastrella porta via il calore molto più in fretta.'),
        },
        {
          kind: 'q', review: false,
          text: T('Il mito dice: «il metallo è più freddo del legno». È vero?', 'Il mito: «il metallo è più freddo del legno». Che cosa concludi?', '«Il metallo è più freddo del legno»: dopo la prova, che cosa ne pensi?'),
          options: [T('no: hanno la stessa temperatura, ma il metallo scambia il caldo più in fretta', 'falso: stessa temperatura, ma il metallo conduce meglio', 'falso: la mano non sente la temperatura, sente il calore che passa'), T('sì: il metallo è sempre più freddo', 'vero: il termometro segna meno', 'vero: il metallo è sempre più freddo'), T('sì, ma solo d’inverno', 'vero solo d’inverno', 'vero, ma solo per i metalli lucidi')],
          answer: 0,
          explain: T('Mito smontato! Le panchine hanno la stessa temperatura: il metallo porta via il caldo della mano più in fretta, e d’estate te lo dà più in fretta.', 'Mito smontato: il termometro segna lo stesso. Il metallo, buon conduttore, scambia calore con la mano molto più in fretta del legno: d’inverno sembra più freddo, d’estate più caldo.', 'Mito smontato: la pelle misura il flusso di calore, non la temperatura. Il metallo lo scambia in fretta, il legno piano: per questo inganna in tutte e due le stagioni.'),
        },
      ],
      hints: [T('Guarda il termometro sulle due panchine.', 'Confronta il termometro con quello che sente la mano.', 'Il termometro misura la temperatura; la mano no.')],
      solution: T(
        'Le panchine hanno la stessa temperatura: il metallo porta via il caldo più in fretta.',
        'Stessa temperatura; il metallo conduce meglio e inganna il tatto.',
        'Stessa temperatura: il tatto sente il calore che passa, non la temperatura.'),
    },
  ],
};
