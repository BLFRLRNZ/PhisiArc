// M04 · L'accelerazione. Simulazione: la gara, con le auto che accelerano e il grafico velocità–tempo.
import { T, pick, num } from '../util.js';

const A1 = { label: 'Accelerazione', min: 0.25, max: 5, step: 0.25, unit: 'm/s²' };

export default {
  id: 'M04',
  title: 'L’accelerazione',
  levels: [
    {
      id: 'm04-1', kind: 'lezione', title: 'Sempre più veloce',
      sim: 'race', params: { v1: 0, a1: 2, cars: 1, D: 100, graph: 'xt', names: ['blu'] }, controls: ['a1'], labels: { a1: A1 },
      intro: T(
        'Finora le macchinine andavano sempre alla stessa velocità. Questa invece parte <b>ferma</b> e poi va <b>sempre più veloce</b>. Guarda i segnetti che lascia ogni secondo sulla corsia.',
        'Quando la velocità cambia si parla di <b>accelerazione</b>. L’auto blu parte da ferma e accelera: guarda i segni lasciati ogni secondo sulla corsia e sul grafico.',
        'Un moto con velocità che cresce in modo regolare si dice <b>uniformemente accelerato</b>. Osserva i segni a intervalli di 1 s, sulla pista e sul grafico posizione–tempo.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai partire la macchinina.', 'Lancia e osserva i segni dei secondi.') },
        {
          kind: 'q',
          text: T('I segnetti dei secondi sulla corsia sono…', 'La distanza fra un segno e il successivo…', 'Gli spazi percorsi in secondi successivi…'),
          options: [T('sempre più lontani fra loro', 'aumenta', 'crescono (1, 3, 5, 7… volte il primo)'), T('tutti alla stessa distanza', 'resta uguale', 'restano uguali'), T('sempre più vicini', 'diminuisce', 'diminuiscono')],
          answer: 0,
          explain: T(
            'Giusto! Ogni secondo fa più strada del secondo prima, perché va sempre più veloce. Si dice che <b>accelera</b>.',
            'Giusto: ogni secondo percorre più metri del precedente, perché la velocità cresce. È un moto <b>accelerato</b>.',
            'Giusto: gli spazi crescono come i numeri dispari (1, 3, 5, 7…). Galileo lo scoprì facendo rotolare palline su un piano inclinato.'),
          wrong: T('Guarda di nuovo i segnetti dietro la macchinina: sono uguali come nella gara di prima?', 'Confronta questi segni con quelli della gara a velocità costante.'),
        },
        {
          kind: 'q',
          text: T('E la linea sul grafico?', 'Che forma ha il grafico posizione–tempo?', 'Che forma ha x(t)?'),
          options: [T('Una curva che sale sempre più ripida', 'Una curva sempre più ripida', 'Una parabola'), T('Una linea dritta', 'Una retta', 'Una retta'), T('Una linea piatta', 'Una retta orizzontale', 'Un’iperbole')],
          answer: 0,
          explain: T(
            'Esatto: più è ripida, più va veloce. Ricordi la frenata del laboratorio? Anche lì c’era una curva così.',
            'Esatto: la pendenza del grafico posizione–tempo è la velocità. Se la curva diventa più ripida, la velocità cresce.',
            'Esatto: x = ½·a·t², una parabola. La pendenza in ogni punto è la velocità in quell’istante.'),
        },
      ],
      hints: [T('Guarda bene i segnetti colorati lasciati sulla corsia.', 'Confronta lo spazio fatto nel primo secondo con quello fatto nel quinto.')],
      solution: T('Più va avanti, più i segni si allontanano: va sempre più veloce.', 'Gli spazi in secondi successivi crescono: il moto è accelerato.'),
    },
    {
      id: 'm04-2', kind: 'lezione', title: 'Il grafico velocità–tempo',
      sim: 'race', params: { v1: 0, a1: 2, cars: 1, D: 100, graph: 'vt', names: ['blu'] }, controls: ['a1'], labels: { a1: A1 },
      intro: T(
        'Cambiamo grafico: ora in verticale c’è la <b>velocità</b>. Così vedi quanto va forte la macchinina in ogni momento.',
        'Nel grafico <b>velocità–tempo</b> si legge subito come cambia la velocità. L’<b>accelerazione</b> dice di quanto cresce la velocità ogni secondo: si misura in m/s² (metri al secondo, ogni secondo).',
        'Il grafico v–t: la pendenza è l’accelerazione, a = Δv/Δt, in m/s². L’area sotto la linea è lo spazio percorso.'),
      steps: [
        { kind: 'free', runs: 2, text: T('Fai almeno <b>due corse</b> con accelerazioni diverse.', 'Fai almeno due corse con accelerazioni diverse e confronta le linee.') },
        {
          kind: 'q',
          text: T('Che forma ha la linea della velocità?', 'Con accelerazione costante, il grafico velocità–tempo è…', 'Con a costante, v(t) è…'),
          options: [T('Una linea dritta che sale', 'una retta che sale', 'una retta con pendenza a'), T('Una curva sempre più ripida', 'una parabola', 'una parabola'), T('Una linea piatta', 'una retta orizzontale', 'costante')],
          answer: 0,
          explain: T(
            'Giusto: la velocità cresce sempre della stessa quantità ogni secondo. Con più accelerazione la linea è più ripida.',
            'Giusto: v = a·t è una retta. Più grande è a, più ripida è la retta: la pendenza è l’accelerazione.',
            'Giusto: v = v₀ + a·t, una retta con pendenza a. Il triangolino bianco misura proprio l’aumento in 1 s.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Calcola la velocità.', 'Calcola la velocità.'),
          gen: (lens) => {
            const a = pick([2, 3, 4]), t = pick([3, 4, 5]);
            return lens === 'e'
              ? { text: `Una macchinina parte ferma e ogni secondo va <b>${a} m/s</b> più veloce. Quanto va veloce dopo <b>${t} secondi</b>?`, ans: a * t, tol: 0, unit: 'm/s', explain: `Giusto: ${t} volte ${a} fa ${a * t} m/s.` }
              : { text: `Parte da ferma con accelerazione <b>${a} m/s²</b>. Che velocità ha dopo <b>${t} s</b>?`, ans: a * t, tol: 0.01, unit: 'm/s', explain: `Esatto: v = a·t = ${a} × ${t} = ${a * t} m/s.` };
          },
        },
      ],
      hints: [T('Ogni secondo la velocità aumenta sempre dello stesso numero.', 'v = a · t, se parte da ferma.')],
      solution: T('Una linea dritta che sale: ogni secondo la velocità cresce dello stesso numero.', 'Retta che sale, v = a·t.'),
    },
    {
      id: 'm04-3', kind: 'prevedi', title: 'La lepre e la tartaruga',
      sim: 'race', params: { v1: 10, a1: 0, v2: 0, a2: 2.5, cars: 2, D: 100, graph: 'xt', names: ['blu', 'arancione'] }, controls: [],
      intro: T(
        'Sfida! L’auto <b>blu</b> parte subito a 10 m/s e non cambia mai. L’auto <b>arancione</b> parte ferma, ma accelera sempre. Chi vince?',
        'L’auto blu va a velocità costante, 10 m/s. L’arancione parte da ferma con accelerazione 2,5 m/s². Prevedi chi vince.',
        'Blu: moto uniforme a 10 m/s. Arancione: parte da ferma con a = 2,5 m/s². Chi vince, e conta la lunghezza della pista?'),
      steps: [
        {
          kind: 'q', predict: [{ D: 100 }],
          text: T('Gara di 100 metri. Chi arriva prima?', 'Sui 100 m, chi arriva prima?'),
          options: [T('La blu, che parte veloce', 'La blu'), T('L’arancione, che accelera', 'L’arancione'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 1,
          explain: T(
            'L’arancione! All’inizio resta indietro, ma va sempre più forte e alla fine supera la blu.',
            'L’arancione: 8,9 s contro 10 s. All’inizio è dietro, ma la sua velocità cresce e la sorpassa.',
            'L’arancione: ½·2,5·t² = 100 → t ≈ 8,9 s, contro 10 s. Le curve sul grafico si incrociano dove avviene il sorpasso.'),
        },
        {
          kind: 'q', predict: [{ D: 50 }],
          text: T('E se la pista è lunga solo <b>50 metri</b>?', 'Pista corta: 50 m. Chi vince ora?'),
          options: [T('Sempre l’arancione', 'L’arancione'), T('La blu', 'La blu'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 1,
          explain: T(
            'La blu! Sulla pista corta l’arancione non fa in tempo a raggiungerla.',
            'La blu: 5 s contro 6,3 s. L’arancione non fa in tempo a recuperare.',
            'La blu: 5 s contro √40 ≈ 6,3 s. Il sorpasso avverrebbe a t = 8 s, a 80 m: oltre il traguardo.'),
        },
      ],
      hints: [T('Chi va più veloce all’inizio? E alla fine?', 'All’inizio la blu è avanti. L’arancione la raggiunge prima o dopo il traguardo?')],
      solution: T('Sui 100 m vince l’arancione, sui 50 m la blu.', 'Il sorpasso avviene a 80 m: sui 100 m vince l’arancione, sui 50 m la blu.'),
    },
    {
      id: 'm04-4', kind: 'costruisci', title: 'Il treno a razzo',
      sim: 'race', params: { v1: 0, a1: 1, cars: 1, D: 50, graph: 'vt', names: ['treno'] }, controls: ['a1'], labels: { a1: A1 },
      intro: T(
        'Nuovo gioco per il parco: un <b>treno a razzo</b> che parte fermo e schizza via! Alla fine del rettilineo di <b>50 metri</b> deve avere proprio la velocità giusta.',
        'Nuovo pezzo del parco: il <b>treno a razzo</b>, una montagna russa lanciata. Parte da fermo su un rettilineo di 50 m: scegli l’accelerazione per arrivare in fondo alla velocità richiesta.',
        'Nuovo pezzo del parco: il <b>treno a razzo</b>. Rettilineo di 50 m, partenza da fermo: trova a per la velocità finale richiesta (v² = 2·a·d).'),
      piece: { id: 'razzo', name: 'Il treno a razzo', desc: 'Parte da fermo e in un attimo è lanciato, con l’accelerazione che hai scelto tu.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’accelerazione e lancia il treno.', 'Regola l’accelerazione e lancia. La seconda prova chiederà un’altra velocità.'),
          gen: (lens, r) => {
            const v = pick(r === 0 ? [10, 15, 20] : [12, 18]);
            return { v, text: `In fondo al rettilineo il treno deve andare a <b>${v} m/s</b>.` };
          },
          check: (res, tg, lens) => {
            const v = res.vEnd[0], tol = lens === 'e' ? 1 : 0.6;
            if (Math.abs(v - tg.v) <= tol) return { ok: true, msg: `${num(v, 1)} m/s: lancio perfetto!` };
            return {
              ok: false,
              msg: v > tg.v
                ? `${num(v, 1)} m/s: troppo veloce. ${lens === 'e' ? 'Abbassa l’accelerazione.' : 'L’accelerazione va ridotta: di quanto?'}`
                : `${num(v, 1)} m/s: troppo lento. ${lens === 'e' ? 'Alza l’accelerazione.' : 'L’accelerazione va aumentata: di quanto?'}`,
            };
          },
        },
      ],
      hints: [
        T('Con accelerazione 1 arriva a 10 m/s. Per andare più forte serve più accelerazione.', 'Raddoppiare l’accelerazione non raddoppia la velocità finale: prova e guarda.'),
        T('Per 20 m/s serve accelerazione 4. Per 15, circa 2,25.', 'a = v² / (2·d) = v² / 100.'),
      ],
      solution: T('10 m/s → 1; 15 m/s → 2,25; 20 m/s → 4.', 'a = v²/100: 10 m/s → 1; 12 → 1,44 (1,5); 15 → 2,25; 18 → 3,24 (3,25); 20 → 4 m/s².'),
    },
    {
      id: 'm04-5', kind: 'ripasso', title: 'Ripasso dell’accelerazione',
      intro: T('Ripassiamo velocità e accelerazione!', 'Ripasso: velocità, accelerazione e grafici.'),
      steps: [
        {
          kind: 'q',
          text: T('Un’auto va sempre a 10 m/s. La sua linea nel grafico velocità–tempo è…', 'Moto a velocità costante: il grafico velocità–tempo è…'),
          options: [T('piatta', 'una retta orizzontale'), T('dritta che sale', 'una retta che sale'), T('una curva', 'una parabola')],
          answer: 0, explain: T('Giusto: la velocità non cambia, quindi la linea resta alla stessa altezza.', 'Giusto: accelerazione zero, pendenza zero.'),
        },
        {
          kind: 'q',
          text: T('Un’auto frena. Sta accelerando?', 'Un’auto frena da 20 a 0 m/s. Ha un’accelerazione?'),
          options: [T('Sì, ma all’indietro: rallenta', 'Sì, negativa: la velocità diminuisce'), T('No, perché rallenta', 'No, accelerare vuol dire solo aumentare la velocità'), T('Solo se va veloce', 'Solo se supera i 10 m/s')],
          answer: 0,
          explain: T('Giusto: in fisica anche rallentare è un’accelerazione, ma verso dietro.', 'Giusto: ogni variazione di velocità è un’accelerazione. Frenando è negativa.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.', 'Un calcolo veloce.'),
          gen: (lens) => {
            const a = pick([2, 3, 5]), t = pick([4, 6]), v = a * t;
            return lens === 'e'
              ? { text: `Un monopattino passa da fermo a <b>${v} m/s</b> in <b>${t} secondi</b>. Di quanto aumenta la velocità ogni secondo?`, ans: a, tol: 0, unit: 'm/s', explain: `Giusto: ${v} diviso ${t} fa ${a}.` }
              : { text: `Un monopattino passa da 0 a <b>${v} m/s</b> in <b>${t} s</b>. Qual è la sua accelerazione?`, ans: a, tol: 0.01, unit: 'm/s²', explain: `Esatto: a = Δv/Δt = ${v} / ${t} = ${a} m/s².` };
          },
        },
        {
          kind: 'q',
          text: T('Nel grafico velocità–tempo, una linea più ripida vuol dire…', 'Nel grafico velocità–tempo, la pendenza della retta è…'),
          options: [T('accelera di più', 'l’accelerazione'), T('è più lontana', 'la posizione'), T('va più piano', 'il tempo')],
          answer: 0, explain: T('Esatto: la velocità cresce più in fretta.', 'Esatto: a = Δv/Δt, la pendenza della retta v–t.'),
        },
      ],
      hints: [T('Ripensa ai due grafici: posizione–tempo e velocità–tempo.')],
    },
    {
      id: 'm04-6', kind: 'boss', title: 'Il mito del più veloce',
      sim: 'race', params: { v1: 15, a1: 0, v2: 2, a2: 3, cars: 2, D: 100, graph: 'vt', names: ['blu', 'arancione'] }, controls: ['graph'],
      intro: T(
        'Sono Vetrino. Ho sentito dire: <i>“Chi va più veloce ha anche più accelerazione. Velocità e accelerazione sono la stessa cosa!”</i>. Guarda queste due auto e dimmi tu.',
        'Sono Vetrino. Un mito diffuso: <i>“Se un’auto è più veloce, ha anche un’accelerazione maggiore”</i>. Blu: 15 m/s costanti. Arancione: parte a 2 m/s con 3 m/s². Mettiamolo alla prova.',
        'Sono Vetrino. Il mito: <i>“velocità e accelerazione sono la stessa cosa”</i>. Blu: v = 15 m/s, a = 0. Arancione: v₀ = 2 m/s, a = 3 m/s². Smontiamolo.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai partire la gara e guarda le due linee.', 'Lancia e confronta le due linee nel grafico velocità–tempo.') },
        {
          kind: 'q',
          text: T('All’inizio, chi va più veloce?', 'All’istante della partenza, chi ha la velocità maggiore?'),
          options: [T('La blu'), T('L’arancione'), T('Vanno uguali')],
          answer: 0, keepOrder: true,
          explain: T('Giusto: la blu parte a 15, l’arancione solo a 2.', 'Giusto: 15 m/s contro 2 m/s.'),
        },
        {
          kind: 'q',
          text: T('E chi ha più accelerazione, cioè chi cambia velocità?', 'Chi ha l’accelerazione maggiore?'),
          options: [T('La blu'), T('L’arancione'), T('Hanno la stessa')],
          answer: 1, keepOrder: true,
          explain: T('Giusto: la blu non cambia mai velocità, quindi la sua accelerazione è zero! L’arancione invece va sempre più forte.', 'Giusto: la blu ha a = 0 (retta orizzontale), l’arancione 3 m/s² (retta che sale).'),
          wrong: T('Guarda le due linee: quale sale e quale resta piatta?', 'Nel grafico v–t l’accelerazione è la pendenza. Quale retta è inclinata?'),
        },
        {
          kind: 'q',
          text: T('Allora il mito è vero?', 'Conclusione sul mito?'),
          options: [
            T('No: la velocità dice quanto vai forte, l’accelerazione quanto cambi', 'Falso: la velocità è quanto vai veloce, l’accelerazione quanto in fretta cambia la velocità', 'Falso: v è l’altezza della retta v–t, a è la sua pendenza'),
            T('Sì: chi è più veloce accelera di più', 'Vero: sono la stessa grandezza', 'Vero: v e a coincidono'),
          ],
          answer: 0, keepOrder: true,
          explain: T(
            'Mito sfatato! Un’auto può andare velocissima senza accelerare, e una lenta può accelerare tanto.',
            'Mito sfatato: la blu è più veloce all’inizio ma ha accelerazione zero; l’arancione è lenta ma accelera. Sono grandezze diverse.',
            'Mito sfatato: nel grafico v–t la velocità è l’altezza, l’accelerazione è la pendenza. Due cose diverse.'),
        },
      ],
      hints: [T('Guarda le due linee nel grafico velocità–tempo: una è piatta, l’altra sale.', 'Altezza della linea = velocità, pendenza = accelerazione.')],
      solution: T('Il mito è falso: la velocità e l’accelerazione sono due cose diverse.', 'Falso: v è l’altezza della retta v–t, a la sua pendenza.'),
    },
  ],
};
