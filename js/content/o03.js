// O03 · Il suono. Simulazione: il suono (sound.js), in sei modi: l'aria fra l'altoparlante e l'orecchio, la sveglia
// sotto la campana di vetro, il lampo e il tuono, il tubo lungo un chilometro, una canna del flauto di Pan, l'esplosione
// nello spazio o sulla Terra. Al lancio, quando serve, il suono si sente davvero.
// La zona parte dall'aria che vibra, toglie l'aria dalla campana di Boyle, misura un temporale con il tuono, separa
// l'altezza dal volume, fa correre il suono nell'acqua e nel ferro, costruisce il flauto di Pan del parco e finisce con
// Vetrino che mette alla prova il mito delle esplosioni che si sentono nello spazio.
import { T } from '../util.js';

export default {
  id: 'O03',
  title: 'Il suono',
  levels: [
    {
      id: 'o03-1', kind: 'lezione', title: 'Che cos’è il suono',
      sim: 'sound', params: { mode: 'onda', f: 300, vol: 3 }, controls: ['vol'],
      intro: T(
        'Tocca la tua gola mentre parli: vibra! Ogni suono nasce da qualcosa che vibra. L’altoparlante spinge l’aria avanti e indietro, e la spinta corre fino al tuo orecchio. L’aria non viaggia: vibra e resta lì. Guarda al rallentatore, e prova a cambiare il volume.',
        'Il <b>suono</b> è un’onda longitudinale di pressione: l’altoparlante spinge e tira l’aria, e si formano compressioni e rarefazioni che corrono fino all’orecchio. Nell’aria il suono viaggia a circa <b>343 m/s</b>, a 20 °C. Qui lo vedi al rallentatore, 200 volte più lento. Il volume cambia quanto si muove l’aria.',
        'Ogni suono comincia con una vibrazione: una corda, una membrana, le corde vocali. La vibrazione spinge le molecole d’aria vicine, che spingono le successive: un’onda longitudinale di pressione, che nell’aria corre a circa 343 m/s. Il timpano la raccoglie, e l’orecchio la trasforma in segnali per il cervello.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il volume più basso e il più alto.', 'Prova il volume 1 e il volume 5: guarda quanto si muove il pallino rosso.'),
          need: [
            { when: 'vol <= 1', try: { vol: 1 }, msg: T('Prova il volume più basso.', 'Manca una prova con il volume 1.') },
            { when: 'vol >= 5', try: { vol: 5 }, msg: T('Ora il volume più alto.', 'Manca una prova con il volume 5.') },
          ],
        },
        {
          kind: 'q',
          text: T('Il pallino rosso d’aria, quando arriva il suono…', 'Che cosa fa l’aria quando passa un suono?', 'Che cosa viaggia, davvero, dall’altoparlante all’orecchio?'),
          options: [T('va avanti e indietro e resta lì', 'vibra avanti e indietro, e resta dov’è', 'la vibrazione, in compressioni e rarefazioni'), T('vola fino all’orecchio', 'corre fino all’orecchio', 'l’aria dell’altoparlante, spinta fino al timpano'), T('sta fermo', 'resta ferma: si muove solo il suono', 'un flusso di minuscole particelle di suono')],
          answer: 0,
          explain: T('Giusto: l’aria vibra e resta, il suono viaggia.', 'Esatto: come la spira della molla, avanti e indietro.', 'Esatto: viaggia l’energia della vibrazione, non l’aria.'),
        },
        {
          kind: 'q',
          text: T('Che tipo di onda è il suono?', 'Il suono nell’aria è un’onda…', 'Perché nell’aria il suono può essere solo un’onda longitudinale?'),
          options: [T('come la molla spinta: avanti e indietro', 'longitudinale', 'un gas non resiste al taglio'), T('come la corda: su e giù', 'trasversale, come le onde sulla corda', 'perché l’aria è troppo leggera per le onde trasversali'), T('non è un’onda: è un vento', 'un flusso d’aria che parte dall’altoparlante', 'perché il suono è troppo veloce per oscillare di lato')],
          answer: 0,
          explain: T('Giusto: spinte che corrono, come nella molla.', 'Esatto: compressioni e rarefazioni, come nella molla spinta.', 'Esatto: le molecole di un gas non si tirano di lato; nei solidi, invece, il suono può essere anche trasversale.'),
        },
        {
          kind: 'q',
          text: T('Con il volume più alto, l’aria…', 'Che cosa cambia, nell’onda, quando alzi il volume?', 'Alzando il volume, che cosa cambia e che cosa no?'),
          options: [T('si muove di più', 'l’ampiezza', 'cresce l’ampiezza, la velocità no'), T('corre più veloce verso l’orecchio', 'la velocità del suono', 'crescono l’ampiezza e la velocità, insieme'), T('si muove di meno', 'la distanza fra due compressioni vicine', 'cresce la lunghezza d’onda, l’ampiezza no')],
          answer: 0,
          explain: T('Giusto: un suono forte muove di più l’aria.', 'Esatto: quanto si muove l’aria; più volume, compressioni più forti.', 'Esatto: forte o piano, il suono arriva nello stesso tempo, a 343 m/s.'),
        },
      ],
      hints: [T('L’aria vibra avanti e indietro; la spinta corre.', 'Il suono è un’onda longitudinale; il volume è l’ampiezza.', 'Onda di pressione longitudinale, a 343 m/s.')],
      solution: T(
        'Il suono è aria che vibra: la spinta corre, l’aria resta.',
        'Il suono è un’onda longitudinale di pressione: il volume cambia l’ampiezza, non la velocità.',
        'Una vibrazione che si propaga per compressioni e rarefazioni.'),
    },
    {
      id: 'o03-2', kind: 'prevedi', title: 'La sveglia sotto la campana',
      sim: 'sound', params: { mode: 'campana', aria: 'piena' }, controls: [],
      intro: T(
        'Mettiamo una sveglia che suona sotto una campana di vetro. Con una pompa possiamo togliere l’aria dalla campana. Che cosa succederà al suono? Prima indovina, poi guarda.',
        'Una sveglia che suona sotto una campana di vetro; una pompa toglie l’aria. Nel 1660 Robert Boyle fece proprio questo esperimento. Se il suono è aria che vibra, che cosa succede quando l’aria non c’è più? Prevedi, poi guarda.',
        'L’esperimento di Robert Boyle, 1660: un campanello sotto una campana di vetro, collegata alla sua pompa a vuoto. Il suono è un’onda di pressione dell’aria: che cosa resta, quando si toglie il mezzo in cui viaggia? Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', predict: [{ aria: 'vuota' }],
          text: T('Togliamo tutta l’aria. La sveglia…', 'Si toglie tutta l’aria dalla campana. Il suono della sveglia…', 'Senza aria nella campana, il suono che arriva fuori…'),
          options: [T('non si sente più niente', 'sparisce, o quasi', 'si spegne: manca il mezzo'), T('si sente uguale', 'resta uguale: passa dal vetro', 'resta uguale: il suono non ha bisogno di niente'), T('si sente più forte', 'diventa più forte: niente aria che lo frena', 'cresce: senza aria non c’è niente che lo frena')],
          answer: 0,
          explain: T('Giusto: senza aria, silenzio.', 'Esatto: senza aria il suono non arriva al vetro.', 'Esatto: il suono è un’onda del mezzo; senza mezzo non c’è onda.'),
          solution: T('Non si sente più.', 'Sparisce.'),
        },
        {
          kind: 'q', predict: [{ aria: 'vuota' }],
          text: T('E il martelletto, si vede ancora battere?', 'Senza aria, la sveglia si vede ancora suonare?', 'Perché la sveglia, nel vuoto, si vede ma non si sente?'),
          options: [T('sì, si vede', 'sì: la luce passa anche nel vuoto', 'la luce non ha bisogno di un mezzo, il suono sì'), T('no, si ferma', 'no: senza aria il martelletto si ferma', 'perché nel vuoto la luce rallenta tantissimo'), T('no, diventa tutto buio', 'no: senza aria la campana diventa buia', 'perché nel vuoto il vetro diventa opaco')],
          answer: 0,
          explain: T('Giusto: la vedi, ma non la senti.', 'Esatto: la luce attraversa il vuoto, il suono no.', 'Esatto: la luce del Sole arriva fino a noi attraverso il vuoto; i suoi boati no.'),
          solution: T('Sì, si vede.', 'Sì: la luce passa anche nel vuoto.'),
        },
        {
          kind: 'q', predict: [{ aria: 'meta' }],
          text: T('Ora rimettiamo metà dell’aria. La sveglia…', 'Con metà dell’aria, il suono…', 'Con metà dell’aria nella campana, il suono che esce…'),
          options: [T('si sente piano', 'si sente, ma più piano', 'si indebolisce'), T('si sente forte come prima', 'torna forte come prima', 'torna uguale: basta un po’ d’aria'), T('non si sente ancora', 'resta muto, finché l’aria non torna tutta', 'resta zero fino all’ultima molecola d’aria')],
          answer: 0,
          explain: T('Giusto: poca aria, poco suono.', 'Esatto: meno aria, suono più debole.', 'Esatto: meno molecole trasmettono la vibrazione; più il mezzo è rarefatto, peggio porta il suono.'),
          solution: T('Si sente piano.', 'Si sente, ma più piano.'),
        },
        {
          kind: 'q',
          text: T('Allora il suono, per viaggiare, ha bisogno…', 'Che cosa ci insegna la sveglia nella campana?', 'Che cosa dimostra l’esperimento di Boyle?'),
          options: [T('di qualcosa da far vibrare', 'il suono ha bisogno di un mezzo: aria, acqua, un solido', 'il suono è un’onda meccanica'), T('di luce', 'il suono viaggia insieme alla luce', 'il suono e la luce sono lo stesso tipo di onda'), T('di niente: è il vetro che lo ferma', 'il vetro ferma il suono, l’aria no', 'il vuoto assorbe il suono, come una spugna')],
          answer: 0,
          explain: T('Giusto: aria, acqua o un solido; senza niente da far vibrare, niente suono.', 'Esatto: il suono viaggia solo dentro la materia.', 'Esatto: senza mezzo non si propaga; un’onda meccanica è la vibrazione di un mezzo.'),
        },
      ],
      hints: [T('Il suono è aria che vibra.', 'Senza mezzo, il suono non si propaga; la luce sì.', 'Il suono è un’onda meccanica.')],
    },
    {
      id: 'o03-3', kind: 'lezione', title: 'Il lampo e il tuono',
      sim: 'sound', params: { mode: 'tuono', d: 1 }, controls: ['d'],
      intro: T(
        'Durante un temporale vedi prima il lampo, e senti dopo il tuono. Eppure nascono insieme! La luce arriva subito, il suono corre più piano. Conta i secondi fra il lampo e il tuono: ogni 3 secondi, il temporale è un chilometro più lontano.',
        'Lampo e tuono nascono nello stesso istante. La luce arriva quasi subito, a 300 000 km/s; il suono viaggia a 343 m/s, circa un chilometro ogni 3 secondi. Contando i secondi fra il lampo e il tuono si misura la distanza del temporale: d = v·t.',
        'Il fulmine scalda l’aria a decine di migliaia di gradi: l’aria si espande di colpo, e quel boato è il tuono. La luce ci raggiunge in pochi microsecondi, il suono in secondi: dal ritardo si ricava la distanza. [[d = v · t]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un temporale vicino e uno lontano.', 'Prova un temporale a 1 km o meno, e uno a 3 km o più.'),
          need: [
            { when: 'd <= 1', try: { d: 1 }, msg: T('Prova un temporale vicino.', 'Manca una prova a 1 km o meno.') },
            { when: 'd >= 3', try: { d: 3 }, msg: T('Ora un temporale lontano.', 'Manca una prova a 3 km o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Perché vedi il lampo prima di sentire il tuono?', 'Perché il lampo arriva prima del tuono?', 'Quanto tempo impiega la luce di un lampo a 3 km? E il tuono?'),
          options: [T('la luce corre molto più veloce del suono', 'la luce è quasi un milione di volte più veloce', 'la luce un centomillesimo di secondo, il tuono circa 9 secondi'), T('il tuono parte dopo il lampo', 'il tuono nasce dopo il lampo', 'tutti e due circa 9 secondi'), T('gli occhi sono più svelti', 'gli occhi sono più veloci delle orecchie', 'la luce circa 9 secondi, il tuono subito')],
          answer: 0,
          explain: T('Giusto: nascono insieme, ma la luce arriva prima.', 'Esatto: 300 000 km/s contro 343 m/s.', 'Esatto: il ritardo è quasi tutto del suono.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La distanza del temporale.'),
          vals: { t: [[3, 6], [9]] }, calc: '0.343 * t', unit: 'km', tol: 0.1,
          ask: T(null,
            'Fra il lampo e il tuono passano <b>{t} s</b>. A che distanza è il temporale, in chilometri?',
            'Ritardo <b>{t} s</b>, suono a 343 m/s: distanza, in km? [[d = v · t]]'),
          explain: T(null, 'Esatto: d = 0,343 km/s × {t} s = {ans:2} km.', 'Esatto: {ans:2} km.'),
        },
        {
          kind: 'q',
          text: T('Conti 6 secondi fra il lampo e il tuono. Il temporale è a…', 'Lampo e tuono quasi insieme: che cosa vuol dire?', 'Perché il tuono di un fulmine lontano brontola a lungo, invece di fare un colpo solo?'),
          options: [T('2 chilometri', 'il temporale è vicinissimo: meglio stare al riparo', 'il fulmine è lungo chilometri'), T('6 chilometri', 'il temporale si sta allontanando', 'perché il suono rimbalza sulla luce'), T('18 chilometri', 'il suono ha accelerato', 'perché il suono si stanca e rallenta')],
          answer: 0,
          explain: T('Giusto: 3 secondi per ogni chilometro.', 'Esatto: niente ritardo, temporale vicinissimo.', 'Esatto: il suono parte da punti a distanze diverse: arrivano prima i pezzi vicini del fulmine, poi quelli lontani, e poi gli echi.'),
        },
      ],
      hints: [T('Ogni 3 secondi, un chilometro.', 'd = 343 m/s × t: circa 1 km ogni 3 s.', 'La luce arriva subito: il ritardo misura il viaggio del suono.')],
      solution: T(
        'Conta i secondi e dividi per 3: sono i chilometri.',
        'd = v·t: con 6 s, circa 2 km.',
        'Dal ritardo fra lampo e tuono, a 343 m/s, si ricava la distanza.'),
    },
    {
      id: 'o03-4', kind: 'lezione', title: 'Acuto e grave',
      sim: 'sound', params: { mode: 'onda', f: 300, vol: 3 }, controls: ['f', 'vol'],
      intro: T(
        'Un fischietto fa un suono acuto, un tamburo un suono grave. La differenza? Il fischietto fa vibrare l’aria tantissime volte al secondo, il tamburo poche. Più vibrazioni al secondo, suono più acuto. Prova, e ascolta!',
        'L’<b>altezza</b> di un suono dipende dalla frequenza: più vibrazioni al secondo, suono più <b>acuto</b>; meno vibrazioni, suono più <b>grave</b>. Il volume, invece, dipende dall’ampiezza. Il nostro orecchio sente da circa 20 Hz a 20 000 Hz: sotto ci sono gli <b>infrasuoni</b>, sopra gli <b>ultrasuoni</b>.',
        'Altezza e intensità sono due cose diverse: l’altezza è la frequenza, l’intensità dipende dall’ampiezza della vibrazione. L’orecchio umano sente da 20 a 20 000 Hz; pipistrelli e delfini usano gli ultrasuoni per orientarsi, gli elefanti gli infrasuoni per chiamarsi a chilometri di distanza.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova un suono grave e uno acuto.', 'Prova 200 Hz o meno, e 800 Hz o più: ascolta e guarda.'),
          need: [
            { when: 'f <= 200', try: { f: 200 }, msg: T('Prova un suono grave: poche vibrazioni.', 'Manca una prova a 200 Hz o meno.') },
            { when: 'f >= 800', try: { f: 800 }, msg: T('Ora un suono acuto: tante vibrazioni.', 'Manca una prova a 800 Hz o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Più vibrazioni al secondo, il suono è…', 'Un suono più acuto ha…', 'Una nota e la stessa nota un’ottava sopra: che rapporto c’è fra le frequenze?'),
          options: [T('più acuto', 'una frequenza più alta', 'quella più acuta ha frequenza doppia'), T('più grave', 'una frequenza più bassa', 'le frequenze sono uguali, cambia il volume'), T('più forte', 'un’ampiezza più grande', 'quella più acuta ha frequenza tripla')],
          answer: 0,
          explain: T('Giusto: tante vibrazioni, suono acuto.', 'Esatto: l’altezza del suono è la frequenza; con frequenza doppia, la nota sale di un’ottava.', 'Esatto: un’ottava sopra è il doppio della frequenza: il La a 440 Hz, quello sopra a 880 Hz.'),
        },
        {
          kind: 'q',
          text: T('Il volume più alto cambia…', 'Il volume di un suono dipende…', 'Che cosa cambia nell’onda fra un sussurro e un grido, sulla stessa nota?'),
          options: [T('quanto si muove l’aria', 'dall’ampiezza della vibrazione', 'l’ampiezza della pressione, non la frequenza'), T('quanto è acuto il suono che senti', 'dalla frequenza della vibrazione', 'la frequenza, non l’ampiezza'), T('quanto corre veloce il suono', 'dalla velocità del suono', 'la velocità del suono nell’aria')],
          answer: 0,
          explain: T('Giusto: suono forte, aria che si muove di più.', 'Esatto: forte o piano è l’ampiezza.', 'Esatto: stessa nota, stessa frequenza; il grido ha più ampiezza.'),
        },
        {
          kind: 'q',
          text: T('Un fischietto per cani fa vibrare l’aria 30 000 volte al secondo. Chi lo sente?', 'Un fischietto per cani suona a 30 000 Hz. Chi lo sente?', 'Perché l’ecografia usa gli ultrasuoni, e non suoni udibili?'),
          options: [T('il cane sì, ma tu no', 'il cane, non le persone: è un ultrasuono', 'onde cortissime, sotto il millimetro, che rivelano dettagli piccoli'), T('tu, ma il cane no', 'tutti: è un suono come gli altri', 'perché gli ultrasuoni sono più forti'), T('nessuno', 'nessuno: è un infrasuono', 'perché gli ultrasuoni vanno più veloci')],
          answer: 0,
          explain: T('Giusto: il cane sente vibrazioni che tu non senti.', 'Esatto: sopra i 20 000 Hz sono ultrasuoni.', 'Esatto: per vedere un dettaglio serve un’onda più corta del dettaglio.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La lunghezza d’onda del suono.'),
          vals: { f: [343, 686, 1715] }, calc: '343 / f', unit: 'm', tol: 0.01,
          ask: T(null,
            'Un suono ha frequenza <b>{f} Hz</b>. Quanto è lunga la sua onda nell’aria?',
            'Frequenza <b>{f} Hz</b>, suono a 343 m/s: lunghezza d’onda, in metri? [[λ = v / f]]'),
          explain: T(null, 'Esatto: λ = v / f = 343 / {f} = {ans:2} m.', 'Esatto: {ans:2} m.'),
        },
      ],
      hints: [T('Tante vibrazioni, suono acuto; aria che si muove tanto, suono forte.', 'Altezza: frequenza. Volume: ampiezza. Si sente da 20 a 20 000 Hz.', 'Lunghezza d’onda uguale velocità diviso frequenza, con il suono a 343 m/s.')],
      solution: T(
        'Più vibrazioni al secondo, suono più acuto.',
        'Acuto: frequenza alta; forte: ampiezza grande.',
        'L’altezza è la frequenza, l’intensità è l’ampiezza.'),
    },
    {
      id: 'o03-5', kind: 'lezione', title: 'Nell’acqua e nel ferro',
      sim: 'sound', params: { mode: 'mezzi', mezzo: 'ferro' }, controls: ['mezzo'],
      intro: T(
        'Il suono non corre solo nell’aria! Corre anche nell’acqua e nei solidi, e lì va ancora più veloce. Colpisci un lungo tubo di ferro: chi ascolta dall’altra parte sente due colpi. Uno arriva dal ferro, uno dall’aria. Quale arriva prima?',
        'Il suono viaggia in tutti i mezzi materiali, e più veloce nei liquidi e nei solidi: circa 343 m/s nell’aria, 1480 m/s nell’acqua, 5000 m/s nel ferro. Nel 1808 Jean-Baptiste Biot colpì un tubo di ferro lungo quasi un chilometro: all’altro capo si sentivano due colpi.',
        'Più un mezzo è rigido rispetto alla sua densità, più il suono corre veloce: nell’acqua circa 1480 m/s, nel ferro circa 5000 m/s. Jean-Baptiste Biot lo misurò nel 1808 con le tubature di Parigi: due colpi, uno dal ferro e uno dall’aria.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova tutti e tre i tubi.', 'Prova il tubo di ferro, quello pieno d’acqua e niente tubo.'),
          need: [
            { when: "mezzo == 'ferro'", try: { mezzo: 'ferro' }, msg: T('Prova il tubo di ferro.', 'Manca la prova con il tubo di ferro.') },
            { when: "mezzo == 'acqua'", try: { mezzo: 'acqua' }, msg: T('Ora il tubo pieno d’acqua.', 'Manca la prova con il tubo pieno d’acqua.') },
            { when: "mezzo == 'aria'", try: { mezzo: 'aria' }, msg: T('Ora senza tubo.', 'Manca la prova senza tubo.') },
          ],
        },
        {
          kind: 'q',
          text: T('Dove corre più veloce il suono?', 'In quale mezzo il suono è più veloce?', 'Perché il suono è più veloce nel ferro che nell’aria?'),
          options: [T('nel ferro', 'nel ferro', 'il ferro è rigidissimo'), T('nell’aria', 'nell’aria, che è più leggera', 'perché il ferro è più leggero dell’aria'), T('va uguale dappertutto', 'è uguale in tutti i mezzi', 'perché nel ferro non c’è attrito')],
          answer: 0,
          explain: T('Giusto: nel ferro va quasi 15 volte più veloce che nell’aria.', 'Esatto: 5000 m/s, contro 343 m/s nell’aria.', 'Esatto: conta la rigidità; il ferro è denso, ma si passa la spinta quasi subito.'),
        },
        {
          kind: 'q',
          text: T('Perché, con l’orecchio sul binario, senti il treno prima?', 'Chi ascolta all’altro capo del tubo di ferro sente due colpi. Perché?', 'Nel tubo di Biot, il colpo dal ferro arrivava 2,5 secondi prima di quello dall’aria. Che cosa dimostra?'),
          options: [T('nel ferro il suono corre più veloce', 'uno arriva dal ferro, più veloce, l’altro dall’aria', 'che nel ferro il suono è molto più veloce che nell’aria'), T('il binario è più vicino', 'il colpo rimbalza sul fondo del tubo', 'che il ferro trattiene il suono per 2,5 secondi'), T('sul binario il treno fa più rumore', 'il martello colpisce il tubo due volte', 'che l’aria nel tubo è più calda')],
          answer: 0,
          explain: T('Giusto: il ferro porta il suono più in fretta.', 'Esatto: il primo dal ferro, dopo 0,2 s; il secondo dall’aria, dopo 2,9 s.', 'Esatto: fu una delle prime misure della velocità del suono in un solido.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il suono sott’acqua.'),
          vals: { d: [740, 1480, 2960] }, calc: 'd / 1480', unit: 's', tol: 0.02,
          ask: T(null,
            'Nell’acqua il suono corre a 1480 m/s. Quanto tempo impiega ad attraversare un lago largo <b>{d} m</b>?',
            'Lago largo <b>{d} m</b>, suono nell’acqua a 1480 m/s: tempo, in secondi? [[t = d / v]]'),
          explain: T(null, 'Esatto: t = d / v = {d} / 1480 = {ans:2} s.', 'Esatto: {ans:2} s.'),
        },
        {
          kind: 'q',
          text: T('Le balene si chiamano da lontanissimo. Il loro canto viaggia…', 'Perché le balene possono comunicare a centinaia di chilometri?', 'Un sonar manda un suono verso il fondo del mare, e l’eco torna dopo 2 s. Quanto è profondo il mare?'),
          options: [T('nell’acqua, veloce e lontano', 'nell’acqua il suono corre veloce e si indebolisce poco', '1480 m'), T('nell’aria sopra il mare', 'perché urlano più forte di tutti gli animali', '2960 m'), T('sulla sabbia del fondo', 'perché nell’acqua il suono va più piano e dura di più', '686 m')],
          answer: 0,
          explain: T('Giusto: l’acqua porta il suono lontano.', 'Esatto: l’acqua è un ottimo mezzo per il suono.', 'Esatto: andata e ritorno in 2 s, quindi un secondo per tratta: 1480 m.'),
        },
      ],
      hints: [T('Nei solidi e nell’acqua il suono corre più veloce.', 'Aria 343 m/s, acqua 1480 m/s, ferro 5000 m/s.', 'Più rigido è il mezzo, più veloce è il suono.')],
      solution: T(
        'Il suono corre più veloce nel ferro, poi nell’acqua, poi nell’aria.',
        'Nel tubo di ferro due colpi: dal ferro dopo 0,2 s, dall’aria dopo 2,9 s.',
        'La velocità del suono dipende dal mezzo: aria 343, acqua 1480, ferro 5000 m/s.'),
    },
    {
      id: 'o03-6', kind: 'costruisci', title: 'Il flauto di Pan',
      sim: 'sound', params: { mode: 'canne', L: 25 }, controls: ['L'],
      intro: T(
        'Nel parco arriva il flauto di Pan: tante canne chiuse in fondo, una per ogni nota. Soffi sopra la canna, e l’aria dentro vibra. Più la canna è corta, più il suono è acuto. Taglia ogni canna della lunghezza giusta: ascolta, e guarda l’accordatore!',
        'Costruisci il flauto di Pan del parco. In una canna chiusa in fondo l’aria forma un’onda stazionaria: in fondo un nodo, all’imboccatura un ventre. La canna è lunga un quarto di lunghezza d’onda: λ = 4L, quindi f = v / (4L), con v = 343 m/s.',
        'Il flauto di Pan è una fila di canne chiuse in fondo: soffiando sull’imboccatura, l’aria dentro forma un’onda stazionaria, con un nodo sul fondo chiuso e un ventre all’imboccatura. Nella canna sta un quarto d’onda. [[f = v / (4 · L)]]'),
      piece: { id: 'flauto', name: 'Il flauto di Pan', desc: 'Canne chiuse in fondo, dalla più lunga alla più corta: ognuna suona la sua nota.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli la lunghezza della canna, poi lancia e ascolta.', 'Regola la lunghezza, poi lancia: l’accordatore dice se la nota è giusta.'),
          vals: { e: { f: [[262], [392]] }, s: { f: [[262, 294, 330], [392, 440, 523]] } },
          set: { meta: 'f' },
          ask: T(
            'Il cartellino dice: questa canna deve vibrare <b>{f} volte al secondo</b>. Quanto la fai lunga?',
            'Questa canna deve suonare a <b>{f} Hz</b>. Quanto deve essere lunga?',
            'Nota a <b>{f} Hz</b>, canna chiusa in fondo, suono a 343 m/s: lunghezza? [[L = v / (4 · f)]]'),
          measure: 'L', goal: '34300 / (4 * f)', tol: 0.5,
          ok: T('Perfetto: la canna è intonata!', 'Esatto: nota intonata.'),
          high: T('Troppo lunga: la nota è troppo grave. Accorciala.', 'Canna troppo lunga, nota troppo grave: accorciala.'),
          low: T('Troppo corta: la nota è troppo acuta. Allungala.', 'Canna troppo corta, nota troppo acuta: allungala.'),
          solve: { L: 'Math.round(34300 / (4 * f) * 2) / 2' },
        },
        {
          kind: 'q',
          text: T('Per un suono più acuto, la canna deve essere…', 'Una canna lunga il doppio suona…', 'Perché nella canna chiusa sta un quarto d’onda?'),
          options: [T('più corta', 'un’ottava sotto: metà frequenza', 'sul fondo l’aria è ferma, all’imboccatura si muove di più'), T('più lunga', 'un’ottava sopra: frequenza doppia', 'perché il suono entra ed esce quattro volte'), T('più larga', 'uguale: conta solo la larghezza', 'perché l’aria si divide in quattro parti uguali')],
          answer: 0,
          explain: T('Giusto: canna corta, suono acuto.', 'Esatto: lunghezza doppia, frequenza dimezzata.', 'Esatto: dal nodo al ventre c’è un quarto di lunghezza d’onda.'),
        },
      ],
      hints: [T('Più corta la canna, più acuto il suono.', 'L = v / (4f) = 8575 / f centimetri.', 'Nella canna sta un quarto d’onda: per 440 Hz è lunga circa 19,5 cm.')],
      solution: T('Per 262 vibrazioni al secondo serve una canna di circa 33 cm; per 392, circa 22 cm.', 'L = 343 / (4f): 32,7 cm per 262 Hz, 21,9 cm per 392 Hz.', 'Canna più corta, nota più acuta: 32,7 cm per 262 Hz, 21,9 cm per 392 Hz, 19,5 cm per 440 Hz.'),
    },
    {
      id: 'o03-7', kind: 'ripasso', title: 'Ripasso del suono',
      intro: T('Ripassiamo: tuoni, campane e flauti!', 'Ripasso: il suono come onda di pressione, la sua velocità, altezza e volume.', 'Ripasso: dal vuoto di Boyle al flauto di Pan.'),
      steps: [
        {
          kind: 'q',
          text: T('Dove non c’è aria, una campana che suona…', 'Perché nel vuoto il suono non si propaga?', 'Che cosa hanno in comune un’onda sulla corda e il suono?'),
          options: [T('non si sente', 'non c’è un mezzo da far vibrare', 'sono vibrazioni di un mezzo che si propagano'), T('si sente più forte', 'perché il vuoto lo assorbe come una spugna', 'tutte e due viaggiano anche nel vuoto'), T('si sente uguale', 'perché nel vuoto fa troppo freddo', 'niente: una è un’onda, l’altro no')],
          answer: 0,
          explain: T('Giusto: senza aria, niente suono.', 'Esatto: il suono è un’onda meccanica.', 'Esatto: due onde meccaniche, una trasversale e una longitudinale.'),
        },
        {
          kind: 'q',
          text: T('Fra il lampo e il tuono passano 9 secondi. Il temporale è a…', 'Il suono nell’aria corre a…', 'Il suono è più veloce…'),
          options: [T('3 chilometri', 'circa 343 m/s', 'nel ferro che nell’acqua, e nell’acqua che nell’aria'), T('9 chilometri: uno ogni secondo', 'circa 3000 m/s', 'nell’aria che nell’acqua, e nell’acqua che nel ferro'), T('meno di 1 chilometro', 'circa 34 m/s', 'uguale in tutti i mezzi')],
          answer: 0,
          explain: T('Giusto: 3 secondi per ogni chilometro.', 'Esatto: circa un chilometro ogni 3 secondi.', 'Esatto: ferro 5000, acqua 1480, aria 343 m/s.'),
        },
        {
          kind: 'q',
          text: T('Un suono più acuto ha…', 'Un suono a 880 Hz, rispetto a uno a 440 Hz, è…', 'Due note con la stessa frequenza e ampiezze diverse: le senti…'),
          options: [T('più vibrazioni al secondo', 'un’ottava più acuto', 'alla stessa altezza, una più forte'), T('meno vibrazioni al secondo', 'un’ottava più grave', 'a due altezze diverse, forti uguali'), T('più volume', 'più forte, ma alla stessa altezza', 'uguali in tutto')],
          answer: 0,
          explain: T('Giusto: più vibrazioni, più acuto.', 'Esatto: frequenza doppia, un’ottava sopra.', 'Esatto: l’altezza è la frequenza, il volume l’ampiezza.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La nota di una canna.'),
          vals: { L: [17.5, 24.5, 35] }, calc: '34300 / (4 * L)', unit: 'Hz', tol: 2,
          ask: T(null,
            'Una canna chiusa in fondo è lunga <b>{L} cm</b>. Che nota suona, in hertz?',
            'Canna chiusa lunga <b>{L} cm</b>, suono a 343 m/s: frequenza? [[f = v / (4 · L)]]'),
          explain: T(null, 'Esatto: f = v / 4L = 343 / (4 × {L} cm) = {ans:0} Hz.', 'Esatto: {ans:0} Hz.'),
        },
        {
          kind: 'q',
          text: T('Per avere una nota più grave, la canna del flauto deve essere…', 'Un pipistrello sente fino a 100 000 Hz. Che suoni sono?', 'Perché il suono è più veloce nell’acqua che nell’aria, anche se l’acqua è più densa?'),
          options: [T('più lunga', 'ultrasuoni: troppo acuti per noi', 'l’acqua si comprime pochissimo'), T('più corta', 'infrasuoni: troppo gravi per noi', 'perché nell’acqua non c’è attrito'), T('più stretta', 'suoni normali, come la voce', 'perché l’acqua è trasparente e l’aria no')],
          answer: 0,
          explain: T('Giusto: canna lunga, nota grave.', 'Esatto: sopra i 20 000 Hz sono ultrasuoni.', 'Esatto: l’acqua è molto più rigida dell’aria; conta la rigidità più della densità.'),
        },
      ],
    },
    {
      id: 'o03-8', kind: 'boss', title: 'Il mito delle esplosioni nello spazio',
      sim: 'sound', params: { mode: 'spazio', dove: 'spazio', caschi: false }, controls: ['dove', 'caschi'],
      intro: T(
        'Sono Vetrino. Nei film, quando un’astronave esplode nello spazio, si sente un gran BUM! Ma nello spazio non c’è aria. Si sente davvero? E due astronauti con la radio rotta possono parlarsi? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“nello spazio le esplosioni fanno un gran boato, come nei film”</i>. Abbiamo visto la sveglia sotto la campana senz’aria. Proviamo nello spazio e sulla Terra; e proviamo anche due astronauti con la radio rotta.',
        'Sono Vetrino. Il mito dei film di fantascienza: <i>“nello spazio le esplosioni rimbombano”</i>. Lo spazio è un vuoto quasi perfetto: poche particelle per centimetro cubo. Mettiamo alla prova il mito, e un dettaglio meno noto: due astronauti con i caschi a contatto.'),
      steps: [
        {
          kind: 'q',
          text: T('Per provarlo, che cosa cambi fra una prova e l’altra?', 'Come si mette alla prova il mito?', 'Qual è il confronto onesto?'),
          options: [T('solo dove esplode', 'stessa esplosione, nello spazio e sulla Terra', 'stessa esplosione, con l’aria o senza'), T('l’esplosione: più grande nello spazio', 'esplosioni più grandi nello spazio, per sentirle meglio', 'esplosioni di grandezza diversa, per vedere più casi'), T('niente: basta guardare un film', 'si guarda un film di fantascienza', 'si chiede agli spettatori dei film')],
          answer: 0,
          explain: T('Giusto: spazio o Terra, una cosa alla volta.', 'Esatto: cambia solo l’aria intorno.', 'Esatto: stessa distanza e una variabile alla volta.'),
        },
        {
          kind: 'free',
          text: T('Prova nello spazio e sulla Terra; poi, nello spazio, i caschi a contatto.', 'Prova nello spazio e sulla Terra; poi, nello spazio, prova i caschi a contatto.'),
          need: [
            { when: "dove == 'spazio' && !caschi", try: { dove: 'spazio', caschi: false }, msg: T('Prova nello spazio.', 'Manca una prova nello spazio, senza caschi a contatto.') },
            { when: "dove == 'terra'", try: { dove: 'terra' }, msg: T('Ora sulla Terra.', 'Manca una prova sulla Terra.') },
            { when: "dove == 'spazio' && caschi", try: { dove: 'spazio', caschi: true }, msg: T('Ora nello spazio, con i caschi a contatto.', 'Manca una prova nello spazio con i caschi a contatto.') },
          ],
        },
        {
          kind: 'q',
          text: T('Nello spazio, l’esplosione…', 'Nello spazio, l’esplosione si sente?', 'Perché nello spazio l’esplosione non si sente, anche se è enorme?'),
          options: [T('si vede, ma non si sente', 'no: si vede la luce, ma il suono non arriva', 'non c’è quasi niente da far vibrare'), T('si sente fortissima', 'sì, più forte che sulla Terra', 'perché nello spazio il suono è troppo veloce per l’orecchio'), T('si sente piano', 'sì, ma più piano', 'perché il casco ferma tutti i suoni che arrivano')],
          answer: 0,
          explain: T('Giusto: silenzio, come nella campana senz’aria.', 'Esatto: la luce attraversa il vuoto, il suono no.', 'Esatto: un’onda meccanica non si propaga dove non c’è materia.'),
        },
        {
          kind: 'q',
          text: T('Con i caschi che si toccano, gli astronauti…', 'Perché, con i caschi a contatto, gli astronauti si sentono?', 'Come arriva la voce da un casco all’altro, nel vuoto?'),
          options: [T('si sentono!', 'il suono passa nel vetro dei caschi', 'aria, vetro dei caschi, aria: sempre un mezzo materiale'), T('non si sentono', 'dentro il casco c’è una radio nascosta', 'via radio, che resta sempre accesa'), T('sentono l’esplosione', 'il suono salta nel vuoto per pochi centimetri', 'attraverso il vuoto, come la luce')],
          answer: 0,
          explain: T('Giusto: la voce passa da un casco all’altro.', 'Esatto: il suono viaggia anche nei solidi.', 'Esatto: niente vuoto lungo la strada.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il boato sulla Terra.'),
          vals: { d: [686, 1029, 1372] }, calc: 'd / 343', unit: 's', tol: 0.05,
          ask: T(null,
            'Sulla Terra un’esplosione avviene a <b>{d} m</b>. Dopo quanti secondi si sente?',
            'Esplosione a <b>{d} m</b>, suono a 343 m/s: ritardo, in secondi? [[t = d / v]]'),
          explain: T(null, 'Esatto: t = d / v = {d} / 343 = {ans:0} s.', 'Esatto: {ans:0} s.'),
        },
        {
          kind: 'q',
          text: T('Allora il mito dei film…', 'Che cosa concludi sul mito delle esplosioni nello spazio?', 'Il mito delle esplosioni nello spazio: il verdetto?'),
          options: [T('è falso: nello spazio c’è silenzio', 'falso: senza aria il suono non arriva', 'falso: nel vuoto il suono non si propaga'), T('è vero: i film hanno ragione', 'vero: le esplosioni si sentono anche nel vuoto', 'vero: il suono viaggia nel vuoto come la luce'), T('è vero solo per le esplosioni grandi', 'vero solo se l’esplosione è abbastanza grande', 'vero a metà: si sente, ma più piano')],
          answer: 0,
          explain: T('Mito smontato! Nello spazio l’esplosione si vede, ma non si sente. E gli astronauti, con i caschi che si toccano, si parlano.', 'Mito smontato: nel vuoto il suono non si propaga; nei solidi sì.', 'Mito smontato: nello spazio c’è silenzio, e il suono passa solo da un solido all’altro. Il boato dei film è un effetto speciale.'),
        },
      ],
      hints: [T('Nello spazio non c’è aria da far vibrare.', 'Il suono ha bisogno di un mezzo: gas, liquido o solido.', 'Nel vuoto niente suono; da casco a casco sì, attraverso il solido.')],
      solution: T(
        'Nello spazio l’esplosione non si sente; con i caschi a contatto, la voce passa.',
        'Falso: senza un mezzo il suono non si propaga; sulla Terra il boato arriva dopo d / 343 secondi.',
        'Il mito è falso: il suono è un’onda meccanica, e nel vuoto non c’è niente che possa vibrare.'),
    },
  ],
};
