// M04 · L'accelerazione. Simulazione: la gara, con le auto che accelerano e il grafico velocità–tempo.
import { T } from '../util.js';

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
          text: T('Mentre la macchinina corre, ogni secondo lascia un segnetto sulla corsia. Nella gara di prima, a velocità costante, i segnetti erano tutti alla stessa distanza. Guarda bene questi: come sono?', 'Sulla corsia c’è un segno per ogni secondo: la distanza fra due segni è la strada fatta in quel secondo. Guarda dal primo all’ultimo. La distanza fra un segno e il successivo…', 'I segni sulla corsia sono a un secondo l’uno dall’altro, quindi la distanza fra due segni è lo spazio percorso in quel secondo. Gli spazi percorsi in secondi successivi…'),
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
          text: T('Ora guarda la linea sul grafico sotto la pista: sale più in fretta quando la macchinina fa più strada ogni secondo. Che forma ha?', 'Nel grafico posizione–tempo la pendenza della linea dice quanto si va veloci: più è ripida, più la velocità è alta. Questa macchinina va sempre più forte. Che forma ha il grafico?', 'La pendenza di x(t) è la velocità, e qui la velocità cresce in modo costante. Che forma ha x(t)?'),
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
          text: T('Ora il grafico mostra la velocità della macchinina a ogni istante. La macchinina accelera sempre allo stesso modo: ogni secondo guadagna la stessa velocità. Che forma ha la linea?', 'Accelerazione costante vuol dire che la velocità aumenta della stessa quantità ogni secondo, per esempio 2 m/s in più ogni secondo. Allora il grafico velocità–tempo è…', 'Con a costante la velocità cresce di a ogni secondo: v = v₀ + a·t. Il grafico v(t) è…'),
          options: [T('Una linea dritta che sale', 'una retta che sale', 'una retta con pendenza a'), T('Una curva sempre più ripida', 'una parabola', 'una parabola'), T('Una linea piatta', 'una retta orizzontale', 'costante')],
          answer: 0,
          explain: T(
            'Giusto: la velocità cresce sempre della stessa quantità ogni secondo. Con più accelerazione la linea è più ripida.',
            'Giusto: v = a·t è una retta. Più grande è a, più ripida è la retta: la pendenza è l’accelerazione.',
            'Giusto: v = v₀ + a·t, una retta con pendenza a. Il triangolino bianco misura proprio l’aumento in 1 s.'),
        },
        {
          kind: 'num', rounds: 2, text: T('Calcola la velocità.'),
          vals: { a: [2, 3, 4], t: [3, 4, 5] }, calc: 'a * t', unit: 'm/s', tol: { e: 0, s: 0.01 },
          ask: T('Una macchinina parte da ferma. Ogni secondo che passa va <b>{a} m/s</b> più veloce di prima: dopo 1 secondo va a {a}, dopo 2 secondi al doppio, e così via. Quanto va veloce dopo <b>{t} secondi</b>?', 'Un’auto parte da ferma con accelerazione <b>{a} m/s²</b>: vuol dire che la sua velocità cresce di {a} m/s ogni secondo. Che velocità ha dopo <b>{t} s</b>?'),
          explain: T('Giusto: {t} volte {a} fa {ans} m/s.', 'Esatto: v = a·t = {a} × {t} = {ans} m/s.'),
        },
      ],
      hints: [T('Ogni secondo la velocità aumenta sempre dello stesso numero.', 'v = a · t, se parte da ferma.')],
      solution: T('Una linea dritta che sale: ogni secondo la velocità cresce dello stesso numero.', 'Retta che sale, v = a·t.'),
    },
    {
      // Dal grafico velocità–tempo alla strada: l'area sotto la linea. Qui lo Studente trova s = ½·a·t² e v² = 2·a·s,
      // che servono al treno a razzo (m04-4) e alla caduta libera (M02).
      id: 'm04-area', kind: 'lezione', title: 'Dal grafico alla strada',
      sim: 'race', params: { v1: 0, a1: 2, cars: 1, D: 100, graph: 'vt', area: true, names: ['blu'] }, controls: ['a1'], labels: { a1: A1 },
      intro: T(
        'Sotto la linea della velocità ora c’è una <b>macchia colorata</b>. Più strada fa la macchinina, più la macchia cresce. Guardala!',
        'Nel grafico velocità–tempo è nascosta anche la <b>strada percorsa</b>: è l’<b>area</b> sotto la linea. Con accelerazione costante quell’area è un triangolo.',
        'Il grafico velocità–tempo racconta anche quanta strada hai fatto: è l’<b>area</b> sotto la linea. È il conto che fa un contachilometri, istante per istante.'),
      steps: [
        { kind: 'free', runs: 2, text: T('Fai <b>due corse</b> con accelerazioni diverse e guarda la macchia crescere.', 'Fai due corse con accelerazioni diverse: l’area colorata cresce insieme alla strada percorsa.') },
        {
          kind: 'q', only: ['e'], predict: [{ a1: 2, D: 4 }, { a1: 2, D: 16 }],
          text: 'Con questa accelerazione la macchinina fa <b>4 metri</b> in 2 secondi. Se corre per 4 secondi, il doppio del tempo, quanti metri fa?',
          options: ['8 metri, il doppio', '16 metri, quattro volte', '4 metri, uguale'],
          answer: 1,
          explain: 'Quattro volte! Nel doppio del tempo va anche più veloce: così la strada non raddoppia, diventa <b>quattro volte</b> più lunga.',
        },
        {
          kind: 'q', only: ['e'], set: { D: 100 },
          text: 'Guarda la macchia colorata sotto la linea: più è grande, più strada ha fatto la macchinina. Quando cresce più in fretta?',
          options: ['Alla fine, quando va veloce', 'All’inizio, appena parte', 'Sempre allo stesso modo'],
          answer: 0,
          explain: 'Giusto: più va veloce, più strada fa in ogni secondo, e più in fretta cresce la macchia.',
          wrong: 'Fai una corsa e guarda la macchia: all’inizio è una punta sottile.',
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null,
            'Un’auto parte da ferma con a = 2 m/s². Dopo 4 s va a 8 m/s. L’area sotto la linea è un triangolo: base 4 s, altezza 8 m/s. Quanta strada ha fatto?',
            'Un’auto parte da ferma e in 4 secondi arriva a 8 m/s, crescendo in modo regolare: in media, quindi, è andata a 4 m/s. Quanta strada ha fatto in quei 4 secondi?'),
          options: ['16 m', '32 m', '8 m'],
          answer: 0,
          explain: T(null,
            'Esatto: area del triangolo = ½ · base · altezza = ½ · t · (a·t). In formula: <b>s = ½·a·t²</b>.',
            'Esatto: 4 m/s di media per 4 secondi fanno 16 m. È la metà di quanto avrebbe fatto andando sempre a 8 m/s.'),
          wrong: T(null, 'L’area di un triangolo è metà di base per altezza.', 'Non è andata sempre a 8 m/s: all’inizio era ferma. Usa la velocità media.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Calcola la strada percorsa.'),
          vals: { a: [2, 3, 4], t: [2, 3, 4] }, calc: '0.5 * a * t * t', unit: 'm', tol: 0.01,
          ask: T(null, 'Un’auto parte da ferma con accelerazione <b>{a} m/s²</b>. Quanta strada fa in <b>{t} s</b>?'),
          explain: T(null, 'Esatto: s = ½·a·t² = ½ × {a} × {t}² = {ans} m.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null,
            'Unendo v = a·t e s = ½·a·t² si ottiene un legame diretto fra velocità e strada: <b>v² = 2·a·s</b>. Un treno parte da fermo con a = 1 m/s². Che velocità ha dopo 50 m?',
            'Più strada hai per accelerare, più veloce arrivi, ma non in proporzione: per raddoppiare la velocità finale serve una strada <b>quattro volte</b> più lunga. Un treno arriva a 10 m/s in 50 m. Quanta strada gli serve per arrivare a 20 m/s?'),
          options: [T(null, '10 m/s', '200 m'), T(null, '50 m/s', '100 m'), T(null, '100 m/s', '75 m')],
          answer: 0,
          explain: T(null,
            'Esatto: v² = 2 × 1 × 50 = 100, quindi v = 10 m/s. Ti servirà fra poco, per il treno a razzo.',
            'Esatto: 200 m. Velocità doppia, strada quadrupla: è la regola della frenata del Laboratorio, vista al contrario.'),
          wrong: T(null, 'v² = 2·a·s = 2 × 1 × 50. Poi serve la radice quadrata.', 'Ricorda la frenata del Laboratorio: velocità doppia, spazio quadruplo.'),
        },
      ],
      hints: [
        T('Guarda quanti metri ha fatto dopo 2 secondi, e quanti dopo 4.', 'Area di un triangolo: ½ · base · altezza. La base è il tempo, l’altezza è la velocità finale, a·t.', 'Se parte da ferma, la velocità media è la metà di quella finale.'),
        T('Nel doppio del tempo la macchinina va anche più veloce.', 's = ½·a·t², e poi v² = 2·a·s.', 'Strada = velocità media × tempo.'),
      ],
      solution: T('Nel doppio del tempo fa quattro volte la strada.', 's = ½·a·t² (l’area del triangolo sotto la retta v–t) e v² = 2·a·s.', 'Strada = velocità media × tempo; per una velocità doppia serve una strada quadrupla.'),
    },
    {
      id: 'm04-3', kind: 'prevedi', title: 'La lepre e la tartaruga',
      sim: 'race', params: { v1: 10, a1: 0, v2: 0, a2: 2.5, cars: 2, D: 100, graph: 'xt', names: ['blu', 'arancione'] }, controls: [],
      intro: T(
        'Sfida! Una partenza veloce contro una macchina che non smette mai di <b>accelerare</b>.',
        'Velocità costante contro accelerazione costante: una gara classica. Prevedi chi vince.',
        'Blu: moto uniforme a 10 m/s. Arancione: parte da ferma con a = 2,5 m/s². Chi vince, e conta la lunghezza della pista?'),
      steps: [
        {
          kind: 'q', predict: [{ D: 100 }],
          text: T('La blu parte subito veloce, a 10 m/s, ma non cambia mai velocità. L’arancione parte da ferma, quindi all’inizio resta indietro, però va sempre più forte. La gara è lunga 100 metri. Chi arriva prima?', 'La blu va sempre a 10 m/s; l’arancione parte da ferma con 2,5 m/s² e quindi all’inizio è indietro, ma la sua velocità continua a crescere. Su una pista di 100 m, chi arriva prima?'),
          options: [T('La blu, che parte veloce', 'La blu'), T('L’arancione, che accelera', 'L’arancione'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 1,
          explain: T(
            'L’arancione! All’inizio resta indietro, ma va sempre più forte e alla fine supera la blu.',
            'L’arancione: da s = ½·a·t², 100 = ½ · 2,5 · t² dà t ≈ 8,9 s, contro i 10 s della blu. All’inizio è dietro, ma la sua velocità cresce e la sorpassa.',
            'L’arancione: ½·2,5·t² = 100 → t ≈ 8,9 s, contro 10 s. Le curve sul grafico si incrociano dove avviene il sorpasso.'),
        },
        {
          kind: 'q', predict: [{ D: 50 }],
          text: T('Stesse due macchine, ma ora la pista è lunga solo <b>50 metri</b>, la metà. L’arancione ha meno tempo per prendere velocità. Chi arriva prima adesso?', 'Pista corta: 50 m invece di 100. La blu va sempre a 10 m/s; l’arancione deve ancora prendere velocità. Il sorpasso arriva prima o dopo il traguardo? Chi vince ora?'),
          options: [T('Sempre l’arancione', 'L’arancione'), T('La blu', 'La blu'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 1,
          explain: T(
            'La blu! Sulla pista corta l’arancione non fa in tempo a raggiungerla.',
            'La blu: 5 s contro 6,3 s (50 = ½ · 2,5 · t²). L’arancione non fa in tempo a recuperare.',
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
        'Nuovo pezzo del parco: il <b>treno a razzo</b>, una montagna russa lanciata. Parte da fermo su un rettilineo di 50 m: scegli l’accelerazione per arrivare in fondo alla velocità richiesta. Ti serve v² = 2·a·s.',
        'Nuovo pezzo del parco: il <b>treno a razzo</b>. Rettilineo di 50 m, partenza da fermo: trova l’accelerazione per la velocità finale richiesta. Ricorda: sulla stessa strada, per una velocità doppia serve un’accelerazione quattro volte più grande.'),
      piece: { id: 'razzo', name: 'Il treno a razzo', desc: 'Parte da fermo e in un attimo è lanciato, con l’accelerazione che hai scelto tu.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli l’accelerazione e lancia il treno.', 'Regola l’accelerazione e lancia. La seconda prova chiederà un’altra velocità.'),
          vals: { v: [[10, 15, 20], [12, 18]] },
          ask: T('In fondo al rettilineo il treno deve andare a <b>{v} m/s</b>.'),
          measure: 'vEnd[0]', goal: 'v', tol: { e: 1, s: 0.6 },
          ok: T('{got:1} m/s: lancio perfetto!'),
          high: T('{got:1} m/s: troppo veloce. Abbassa l’accelerazione.', '{got:1} m/s: troppo veloce. L’accelerazione va ridotta: di quanto?'),
          low: T('{got:1} m/s: troppo lento. Alza l’accelerazione.', '{got:1} m/s: troppo lento. L’accelerazione va aumentata: di quanto?'),
          solve: { a1: 'v * v / 100' },
        },
      ],
      hints: [
        T('Con accelerazione 1 arriva a 10 m/s. Per andare più forte serve più accelerazione.', 'Raddoppiare l’accelerazione non raddoppia la velocità finale: prova e guarda.'),
        T('Per 20 m/s serve accelerazione 4. Per 15, circa 2,25.', 'a = v² / (2·s) = v² / 100.'),
      ],
      solution: T('10 m/s → 1; 15 m/s → 2,25; 20 m/s → 4.', 'a = v²/100: 10 m/s → 1; 12 → 1,44 (1,5); 15 → 2,25; 18 → 3,24 (3,25); 20 → 4 m/s².'),
    },
    {
      id: 'm04-5', kind: 'ripasso', title: 'Ripasso dell’accelerazione',
      intro: T('Ripassiamo velocità e accelerazione!', 'Ripasso: velocità, accelerazione e grafici.'),
      steps: [
        {
          kind: 'q',
          text: T('Nel grafico velocità–tempo la linea mostra quanto va veloce l’auto in ogni istante. Un’auto va sempre a 10 m/s, senza mai accelerare né frenare. Com’è la sua linea?', 'Nel grafico velocità–tempo l’altezza della linea è la velocità. Se la velocità non cambia mai, il grafico velocità–tempo è…'),
          options: [T('piatta', 'una retta orizzontale'), T('dritta che sale', 'una retta che sale'), T('una curva', 'una parabola')],
          answer: 0, explain: T('Giusto: la velocità non cambia, quindi la linea resta alla stessa altezza.', 'Giusto: accelerazione zero, pendenza zero.'),
        },
        {
          kind: 'q',
          text: T('Nella vita di tutti i giorni «accelerare» vuol dire andare più forte. In fisica, invece, l’accelerazione è ogni cambiamento di velocità. Un’auto frena e rallenta: per la fisica, sta accelerando?', 'In fisica l’accelerazione misura quanto cambia la velocità ogni secondo, in qualunque verso. Un’auto frena e passa da 20 a 0 m/s. Ha un’accelerazione?'),
          options: [T('Sì, ma all’indietro: rallenta', 'Sì, negativa: la velocità diminuisce'), T('No, perché rallenta', 'No, accelerare vuol dire solo aumentare la velocità'), T('Solo se va veloce', 'Solo se supera i 10 m/s')],
          answer: 0,
          explain: T('Giusto: in fisica anche rallentare è un’accelerazione, ma verso dietro.', 'Giusto: ogni variazione di velocità è un’accelerazione. Frenando è negativa.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.'),
          vals: { a: [2, 3, 5], t: [4, 6] }, derive: { v: 'a * t' }, calc: 'a', unit: T('m/s', 'm/s²'), tol: { e: 0, s: 0.01 },
          ask: T('Un monopattino parte da fermo e, sempre allo stesso ritmo, arriva a <b>{v} m/s</b> in <b>{t} secondi</b>. Quella velocità l’ha guadagnata un pezzetto alla volta, uguale ogni secondo. Di quanto aumenta la velocità ogni secondo?', 'Un monopattino passa da 0 a <b>{v} m/s</b> in <b>{t} s</b>, accelerando in modo costante. L’accelerazione è la variazione di velocità divisa per il tempo impiegato. Qual è la sua accelerazione?'),
          explain: T('Giusto: {v} diviso {t} fa {ans}.', 'Esatto: a = Δv/Δt = {v} / {t} = {ans} m/s².'),
        },
        {
          kind: 'q',
          text: T('Nel grafico velocità–tempo due auto disegnano due linee che salgono, ma una sale più ripida dell’altra: in ogni secondo guadagna più velocità. Una linea più ripida vuol dire…', 'La pendenza di una retta dice quanto sale per ogni passo in orizzontale. Nel grafico velocità–tempo, quanto sale la velocità per ogni secondo. Quindi la pendenza della retta è…'),
          options: [T('accelera di più', 'l’accelerazione'), T('è più lontana', 'la posizione'), T('va più piano', 'il tempo')],
          answer: 0, explain: T('Esatto: la velocità cresce più in fretta.', 'Esatto: a = Δv/Δt, la pendenza della retta v–t.'),
        },
      ],
      hints: [T('Ripensa ai due grafici: posizione–tempo e velocità–tempo.')],
    },
    {
      id: 'm04-6', kind: 'boss', title: 'Il mito del veloce che accelera',
      sim: 'race', params: { v1: 15, a1: 0, v2: 2, a2: 3, cars: 2, D: 100, graph: 'vt', names: ['blu', 'arancione'] }, controls: ['graph'],
      intro: T(
        'Sono Vetrino. Ho sentito dire: <i>“Chi va più veloce ha anche più accelerazione. Velocità e accelerazione sono la stessa cosa!”</i>. Guarda queste due auto e dimmi tu.',
        'Sono Vetrino. Un mito diffuso: <i>“Se un’auto è più veloce, ha anche un’accelerazione maggiore”</i>. Blu: 15 m/s costanti. Arancione: parte a 2 m/s con 3 m/s². Mettiamolo alla prova.',
        'Sono Vetrino. Il mito: <i>“velocità e accelerazione sono la stessa cosa”</i>. Blu: v = 15 m/s, a = 0. Arancione: v₀ = 2 m/s, a = 3 m/s². Smontiamolo.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai partire la gara e guarda le due linee.', 'Lancia e confronta le due linee nel grafico velocità–tempo.') },
        {
          kind: 'q',
          text: T('Guarda le due macchine nel momento in cui parte la gara. La blu va già a 15 m/s, l’arancione solo a 2 m/s. In quell’istante, chi va più veloce?', 'Nel grafico velocità–tempo leggi la velocità come l’altezza della linea. Guarda le due linee proprio all’inizio, a tempo zero. Chi ha la velocità maggiore?'),
          options: [T('La blu'), T('L’arancione'), T('Vanno uguali')],
          answer: 0, keepOrder: true,
          explain: T('Giusto: la blu parte a 15, l’arancione solo a 2.', 'Giusto: 15 m/s contro 2 m/s.'),
        },
        {
          kind: 'q',
          text: T('Ora la domanda è diversa: non chi va più forte, ma chi <b>cambia</b> velocità, cioè chi accelera. Guarda le due linee: una resta sempre alla stessa altezza, l’altra sale. Chi ha più accelerazione?', 'L’accelerazione è quanto cambia la velocità ogni secondo, e nel grafico velocità–tempo è la pendenza della linea. Confronta le due linee. Chi ha l’accelerazione maggiore?'),
          options: [T('La blu'), T('L’arancione'), T('Hanno la stessa')],
          answer: 1, keepOrder: true,
          explain: T('Giusto: la blu non cambia mai velocità, quindi la sua accelerazione è zero! L’arancione invece va sempre più forte.', 'Giusto: la blu ha a = 0 (retta orizzontale), l’arancione 3 m/s² (retta che sale).'),
          wrong: T('Guarda le due linee: quale sale e quale resta piatta?', 'Nel grafico v–t l’accelerazione è la pendenza. Quale retta è inclinata?'),
        },
        {
          kind: 'q',
          text: T('Il mito diceva che chi va più veloce ha anche più accelerazione, come se fossero la stessa cosa. Ma la blu era più veloce e l’arancione accelerava di più. Allora il mito è vero?', 'Hai visto un’auto veloce con accelerazione zero e un’auto lenta con accelerazione grande. Che cosa concludi sul mito, secondo cui velocità e accelerazione vanno sempre insieme?'),
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
