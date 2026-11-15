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
      intro: T('Finora le macchinine andavano sempre alla stessa velocità. Questa invece parte <b>ferma</b> e poi va <b>sempre più veloce</b>. Guarda i segnetti che lascia ogni secondo sulla corsia.', 'Quando la velocità cambia si parla di <b>accelerazione</b>. L’auto blu parte da ferma e accelera: guarda i segni lasciati ogni secondo sulla corsia e sul grafico.', 'Al semaforo verde un’auto parte da ferma e prende velocità in modo regolare: è un moto <b>uniformemente accelerato</b>. Guarda i segni che lascia ogni secondo, sulla pista e sul grafico.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai partire la macchinina.', 'Lancia e osserva i segni dei secondi.') },
        {
          kind: 'q', review: false,
          text: T('Guarda i segnetti che la macchinina lascia ogni secondo. Come sono?', 'Sulla corsia c’è un segno per ogni secondo: la distanza fra due segni è la strada fatta in quel secondo. Guarda dal primo all’ultimo. La distanza fra un segno e il successivo…', 'I segni sulla corsia sono a un secondo l’uno dall’altro, quindi la distanza fra due segni è lo spazio percorso in quel secondo. Gli spazi percorsi in secondi successivi…'),
          options: [T('sempre più lontani', 'aumenta', 'crescono (1, 3, 5, 7… volte il primo)'), T('tutti alla stessa distanza', 'resta uguale', 'restano uguali'), T('sempre più vicini', 'diminuisce', 'diminuiscono')],
          answer: 0,
          explain: T(
            'Giusto! Ogni secondo fa più strada del secondo prima, perché va sempre più veloce. Si dice che <b>accelera</b>.',
            'Giusto: ogni secondo percorre più metri del precedente, perché la velocità cresce. È un moto <b>accelerato</b>.',
            'Giusto: gli spazi crescono come i numeri dispari (1, 3, 5, 7…). Galileo lo scoprì facendo rotolare palline su un piano inclinato.'),
          wrong: T('Guarda di nuovo i segnetti dietro la macchinina: sono uguali come nella gara di prima?', 'Confronta questi segni con quelli della gara a velocità costante.'),
        },
        {
          kind: 'q', review: false,
          text: T('Ora guarda la linea sul grafico, sotto la pista. Che forma ha?', 'Nel grafico posizione–tempo la pendenza della linea dice quanto si va veloci: più è ripida, più la velocità è alta. Questa macchinina va sempre più forte. Che forma ha il grafico?', 'Sul grafico posizione–tempo, più la linea è ripida più l’auto va veloce. Qui la velocità cresce sempre: che forma ha la linea?'),
          options: [T('Una curva che sale', 'Una curva sempre più ripida', 'Una curva che sale sempre più ripida'), T('Una linea dritta che sale', 'Una retta'), T('Una linea piatta', 'Una retta orizzontale', 'Una curva che si appiattisce')],
          answer: 0,
          explain: T('Esatto: più è ripida, più va veloce. Ricordi la frenata del laboratorio? Anche lì c’era una curva così.', 'Esatto: la pendenza del grafico posizione–tempo è la velocità. Se la curva diventa più ripida, la velocità cresce.', 'Esatto: è una parabola. In ogni punto la sua pendenza è la velocità di quell’istante. [[x = ½·a·t²]]'),
        },
      ],
      hints: [T('Guarda bene i segnetti colorati lasciati sulla corsia.', 'Confronta lo spazio fatto nel primo secondo con quello fatto nel quinto.')],
      solution: T('Più va avanti, più i segni si allontanano: va sempre più veloce.', 'Gli spazi in secondi successivi crescono: il moto è accelerato.'),
    },
    {
      id: 'm04-2', kind: 'lezione', title: 'Il grafico velocità–tempo',
      sim: 'race', params: { v1: 0, a1: 2, cars: 1, D: 100, graph: 'vt', names: ['blu'] }, controls: ['a1'], labels: { a1: A1 },
      intro: T('Cambiamo grafico: ora in verticale c’è la <b>velocità</b>. Così vedi quanto va forte la macchinina in ogni momento.', 'Nel grafico <b>velocità–tempo</b> si legge subito come cambia la velocità. L’<b>accelerazione</b> dice di quanto cresce la velocità ogni secondo: si misura in m/s² (metri al secondo, ogni secondo).', 'Cambiamo grafico: ora in verticale c’è la <b>velocità</b>, come sul tachimetro. Quanto in fretta sale la linea dice l’<b>accelerazione</b>: i metri al secondo guadagnati ogni secondo (m/s²). [[a = Δv/Δt]]'),
      steps: [
        { kind: 'free', runs: 2, distinct: true, text: T('Fai almeno <b>due corse</b> con accelerazioni diverse.', 'Fai almeno due corse con accelerazioni diverse e confronta le linee.') },
        {
          kind: 'q',
          text: T('Ogni secondo la macchinina guadagna la stessa velocità. Sul grafico della velocità, che linea disegna?', 'Accelerazione costante vuol dire che la velocità aumenta della stessa quantità ogni secondo, per esempio 2 m/s in più ogni secondo. Allora il grafico velocità–tempo è…', 'L’auto guadagna la stessa velocità ogni secondo, come dice un «da 0 a 100 in 10 secondi». Sul grafico velocità–tempo la linea è…'),
          options: [T('Una linea dritta che sale', 'una retta che sale'), T('Una curva sempre più ripida', 'una parabola', 'una curva sempre più ripida'), T('Una linea piatta', 'una retta orizzontale', 'una linea orizzontale')],
          answer: 0,
          explain: T('Giusto: la velocità cresce sempre della stessa quantità ogni secondo. Con più accelerazione la linea è più ripida.', 'Giusto: v = a·t è una retta. Più grande è a, più ripida è la retta: la pendenza è l’accelerazione.', 'Giusto: aumenti uguali in tempi uguali danno una retta, e la sua pendenza è l’accelerazione. Il triangolino bianco misura proprio l’aumento in 1 secondo. [[v = v₀ + a·t]]'),
        },
        {
          kind: 'num', rounds: 2, text: T('Calcola la velocità.'),
          vals: { a: [2, 3, 4], t: [3, 4, 5] }, calc: 'a * t', unit: 'm/s', tol: { e: 0, s: 0.01 },
          ask: T('Una macchinina parte da ferma. Ogni secondo va <b>{a} m/s</b> più veloce di prima. Quanto va veloce dopo <b>{t} secondi</b>?', 'Un’auto parte da ferma con accelerazione <b>{a} m/s²</b>: vuol dire che la sua velocità cresce di {a} m/s ogni secondo. Che velocità ha dopo <b>{t} s</b>?'),
          explain: T('Giusto: {t} volte {a} fa {ans} m/s.', 'Esatto: v = a·t = {a} × {t} = {ans} m/s.', 'Esatto: {a} m/s in più ogni secondo, per {t} secondi, fanno {ans} m/s. [[v = a·t]]'),
        },
      ],
      hints: [T('Ogni secondo la velocità aumenta sempre dello stesso numero.', 'v = a · t, se parte da ferma.', 'Ogni secondo la velocità cresce della stessa quantità: moltiplica per i secondi.')],
      solution: T('Una linea dritta che sale: ogni secondo la velocità cresce dello stesso numero.', 'Retta che sale, v = a·t.', 'Una retta che sale: la velocità cresce della stessa quantità ogni secondo. [[v = a·t]]'),
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
        { kind: 'free', runs: 2, distinct: true, text: T('Fai <b>due corse</b> con accelerazioni diverse e guarda la macchia crescere.', 'Fai due corse con accelerazioni diverse: l’area colorata cresce insieme alla strada percorsa.') },
        {
          kind: 'q', only: ['e'], predict: [{ a1: 2, D: 4 }, { a1: 2, D: 16 }],
          text: T('La macchinina fa <b>4 metri</b> in 2 secondi. In 4 secondi, il doppio del tempo, quanti metri fa?', 'Con questa accelerazione la macchinina fa <b>4 metri</b> in 2 secondi. Se corre per 4 secondi, il doppio del tempo, quanti metri fa?'),
          options: [T('8 metri: il doppio', '8 metri, il doppio'), T('16 metri: quattro volte', '16 metri, quattro volte'), T('4 metri: uguale a prima', '4 metri, uguale')],
          answer: 1,
          explain: 'Quattro volte! Nel doppio del tempo va anche più veloce: così la strada non raddoppia, diventa <b>quattro volte</b> più lunga.',
        },
        {
          kind: 'q', review: false, only: ['e'], set: { D: 100 },
          text: T('Guarda la macchia colorata sotto la linea. Quando cresce più in fretta?', 'Guarda la macchia colorata sotto la linea: più è grande, più strada ha fatto la macchinina. Quando cresce più in fretta?'),
          options: ['Alla fine, quando va veloce', T('All’inizio, appena la macchinina parte', 'All’inizio, appena parte'), 'Sempre allo stesso modo'],
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
          vals: { a: [2, 3, 4], t: [2, 3, 4] }, derive: { v: 'a * t', vm: 'a * t / 2' }, calc: '0.5 * a * t * t', unit: 'm', tol: 0.01,
          ask: T(null, 'Un’auto parte da ferma con accelerazione <b>{a} m/s²</b>. Quanta strada fa in <b>{t} s</b>?', 'Un’auto parte da ferma e guadagna <b>{a} m/s</b> ogni secondo: dopo <b>{t} s</b> va a {v} m/s. Quanta strada ha fatto?'),
          explain: T(null, 'Esatto: s = ½·a·t² = ½ × {a} × {t}² = {ans} m.', 'Esatto: in media è andata a {vm} m/s, la metà di {v}; in {t} secondi fa {ans} m. [[s = ½·a·t²]]'),
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
      intro: T('Sfida! Una partenza veloce contro una macchina che non smette mai di <b>accelerare</b>.', 'Velocità costante contro accelerazione costante: una gara classica. Prevedi chi vince.', 'La blu viaggia costante a 10 m/s. L’arancione parte da ferma, ma guadagna 2,5 m/s ogni secondo. Chi vince? E conta quanto è lunga la pista?'),
      steps: [
        {
          kind: 'q', predict: [{ D: 100 }],
          text: T('La blu va sempre a 10 m/s. L’arancione parte ferma, ma va sempre più forte. Sui 100 metri, chi vince?', 'La blu va sempre a 10 m/s; l’arancione parte da ferma con 2,5 m/s² e quindi all’inizio è indietro, ma la sua velocità continua a crescere. Su una pista di 100 m, chi arriva prima?', 'Come un ciclista già lanciato che affianca una moto ferma al semaforo: la moto parte dopo, ma continua ad accelerare. Sui 100 metri, chi arriva prima?'),
          options: [T('La blu, che è già veloce', 'La blu'), T('L’arancione, che accelera', 'L’arancione'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 1,
          explain: T('L’arancione! All’inizio resta indietro, ma va sempre più forte e alla fine supera la blu.', 'L’arancione: da s = ½·a·t², 100 = ½ · 2,5 · t² dà t ≈ 8,9 s, contro i 10 s della blu. All’inizio è dietro, ma la sua velocità cresce e la sorpassa.', 'L’arancione: ci mette circa 8,9 secondi, contro i 10 della blu. Sul grafico le due linee si incrociano dove avviene il sorpasso. [[½·2,5·t² = 100 → t ≈ 8,9 s]]'),
        },
        {
          kind: 'q', predict: [{ D: 50 }],
          text: T('Stesse macchine, ma la pista è lunga solo <b>50 metri</b>. Chi vince adesso?', 'Pista corta: 50 m invece di 100. La blu va sempre a 10 m/s; l’arancione deve ancora prendere velocità. Il sorpasso arriva prima o dopo il traguardo? Chi vince ora?', 'Stessa sfida, ma il traguardo è a 50 metri invece che a 100. La moto fa in tempo a riprendere il ciclista? Chi vince ora?'),
          options: [T('Sempre l’arancione', 'L’arancione'), T('La blu, che parte veloce', 'La blu'), T('Arrivano insieme', 'Arrivano insieme')],
          answer: 1,
          explain: T('La blu! Sulla pista corta l’arancione non fa in tempo a raggiungerla.', 'La blu: 5 s contro 6,3 s (50 = ½ · 2,5 · t²). L’arancione non fa in tempo a recuperare.', 'La blu: 5 secondi contro circa 6,3. Il sorpasso arriverebbe dopo 8 secondi, a 80 metri: oltre il traguardo. [[½·2,5·t² = 50 → t = √40 ≈ 6,3 s]]'),
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
          // all'Esploratore le due velocità che vengono con un'accelerazione intera (1 e 4)
          vals: { e: { v: [[10], [20]] }, s: { v: [[10, 15, 20], [12, 18]] } },
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
        T('Per 20 m/s serve accelerazione 4.', 'a = v² / (2·s) = v² / 100.', 'Per una velocità doppia serve un’accelerazione quattro volte più grande: da 10 a 20 m/s si passa da 1 a 4. [[a = v² / (2·s) = v² / 100]]'),
      ],
      solution: T('Per 10 m/s serve accelerazione 1; per 20 m/s serve 4.', 'a = v²/100: 10 m/s → 1; 12 → 1,44 (1,5); 15 → 2,25; 18 → 3,24 (3,25); 20 → 4 m/s².', '10 m/s → 1; 12 → 1,5; 15 → 2,25; 18 → 3,25; 20 → 4 m/s². [[a = v²/100]]'),
    },
    {
      id: 'm04-5', kind: 'ripasso', title: 'Ripasso dell’accelerazione',
      intro: T('Ripassiamo velocità e accelerazione!', 'Ripasso: velocità, accelerazione e grafici.'),
      steps: [
        {
          kind: 'q',
          text: T('Un’auto va sempre a 10 m/s. Sul grafico della velocità, com’è la sua linea?', 'Nel grafico velocità–tempo l’altezza della linea è la velocità. Se la velocità non cambia mai, il grafico velocità–tempo è…', 'In autostrada inserisci il regolatore di velocità a 130 km/h e non lo tocchi più. Sul grafico velocità–tempo, la linea è…'),
          options: [T('piatta', 'una retta orizzontale', 'orizzontale'), T('dritta che sale', 'una retta che sale'), T('una curva', 'una parabola', 'una curva')],
          answer: 0, explain: T('Giusto: la velocità non cambia, quindi la linea resta alla stessa altezza.', 'Giusto: accelerazione zero, pendenza zero.', 'Giusto: la velocità non cambia, quindi l’accelerazione è zero e la linea resta alla stessa altezza.'),
        },
        {
          kind: 'q',
          text: T('In fisica accelerare vuol dire cambiare velocità. Un’auto che frena sta accelerando?', 'In fisica l’accelerazione misura quanto cambia la velocità ogni secondo, in qualunque verso. Un’auto frena e passa da 20 a 0 m/s. Ha un’accelerazione?', 'Quando freni, la cintura ti trattiene: il corpo sente che la velocità sta cambiando. Per la fisica, un’auto che frena sta accelerando?'),
          options: [T('Sì: cambia velocità', 'Sì, negativa: la velocità diminuisce', 'Sì: è un’accelerazione negativa'), T('No, perché rallenta', 'No, accelerare vuol dire solo aumentare la velocità', 'No: accelerare è solo andare più forte'), T('Solo se va veloce', 'Solo se supera i 10 m/s', 'Solo nelle frenate brusche')],
          answer: 0,
          explain: T('Giusto: in fisica anche rallentare è un’accelerazione, ma verso dietro.', 'Giusto: ogni variazione di velocità è un’accelerazione. Frenando è negativa.', 'Giusto: ogni variazione di velocità è un’accelerazione. In frenata è negativa: punta all’indietro.'),
        },
        {
          kind: 'num', rounds: 1, text: T('Un calcolo veloce.'),
          vals: { a: [2, 3, 5], t: [4, 6] }, derive: { v: 'a * t' }, calc: 'a', unit: T('m/s', 'm/s²'), tol: { e: 0, s: 0.01 },
          ask: T('Un monopattino parte da fermo e arriva a <b>{v} m/s</b> in <b>{t} secondi</b>. Di quanto aumenta la velocità ogni secondo?', 'Un monopattino passa da 0 a <b>{v} m/s</b> in <b>{t} s</b>, accelerando in modo costante. L’accelerazione è la variazione di velocità divisa per il tempo impiegato. Qual è la sua accelerazione?'),
          explain: T('Giusto: {v} diviso {t} fa {ans}.', 'Esatto: a = Δv/Δt = {v} / {t} = {ans} m/s².', 'Esatto: {v} m/s guadagnati in {t} secondi fanno {ans} m/s ogni secondo. [[a = Δv/Δt]]'),
        },
        {
          kind: 'q',
          text: T('Sul grafico della velocità, la linea di un’auto è più ripida dell’altra. Quell’auto…', 'La pendenza di una retta dice quanto sale per ogni passo in orizzontale. Nel grafico velocità–tempo, quanto sale la velocità per ogni secondo. Quindi la pendenza della retta è…', 'Due auto sul grafico velocità–tempo: la linea della sportiva sale molto più ripida di quella dell’utilitaria. Che cosa ha in più la sportiva?'),
          options: [T('accelera di più', 'l’accelerazione', 'Accelerazione'), T('è più lontana', 'la posizione', 'Strada percorsa'), T('va più piano', 'il tempo', 'Tempo di viaggio')],
          answer: 0, explain: T('Esatto: la velocità cresce più in fretta.', 'Esatto: a = Δv/Δt, la pendenza della retta v–t.', 'Esatto: la pendenza dice quanta velocità si guadagna ogni secondo, cioè l’accelerazione. [[a = Δv/Δt]]'),
        },
      ],
      hints: [T('Ripensa ai due grafici: posizione–tempo e velocità–tempo.')],
    },
    {
      id: 'm04-6', kind: 'boss', title: 'Il mito del veloce che accelera',
      sim: 'race', params: { v1: 15, a1: 0, v2: 2, a2: 3, cars: 2, D: 100, graph: 'vt', names: ['blu', 'arancione'] }, controls: ['graph'],
      intro: T('Sono Vetrino. Ho sentito dire: <i>“Chi va più veloce ha anche più accelerazione. Velocità e accelerazione sono la stessa cosa!”</i>. Guarda queste due auto e dimmi tu.', 'Sono Vetrino. Un mito diffuso: <i>“Se un’auto è più veloce, ha anche un’accelerazione maggiore”</i>. Blu: 15 m/s costanti. Arancione: parte a 2 m/s con 3 m/s². Mettiamolo alla prova.', 'Sono Vetrino. Il mito: <i>“velocità e accelerazione sono la stessa cosa”</i>. La blu viaggia costante a 15 m/s; l’arancione parte piano, a 2 m/s, ma guadagna 3 m/s ogni secondo. Smontiamolo.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Fai partire la gara e guarda le due linee.', 'Lancia e confronta le due linee nel grafico velocità–tempo.') },
        {
          kind: 'q', review: false,
          text: T('Alla partenza la blu va a 15 m/s, l’arancione a 2 m/s. Chi va più veloce?', 'Nel grafico velocità–tempo leggi la velocità come l’altezza della linea. Guarda le due linee proprio all’inizio, a tempo zero. Chi ha la velocità maggiore?', 'Fotografa l’istante della partenza: un treno già lanciato (la blu) e uno scooter appena partito (l’arancione). Chi va più veloce in quel momento?'),
          options: [T('La blu'), T('L’arancione'), T('Vanno uguali')],
          answer: 0,
          explain: T('Giusto: la blu parte a 15, l’arancione solo a 2.', 'Giusto: 15 m/s contro 2 m/s.'),
        },
        {
          kind: 'q', review: false,
          text: T('Guarda le due linee: una è piatta, l’altra sale. Chi <b>cambia</b> velocità, cioè accelera di più?', 'L’accelerazione è quanto cambia la velocità ogni secondo, e nel grafico velocità–tempo è la pendenza della linea. Confronta le due linee. Chi ha l’accelerazione maggiore?', 'Ora guarda come <b>cambiano</b>: la linea blu resta piatta, quella arancione sale. Chi sta accelerando di più?'),
          options: [T('La blu'), T('L’arancione'), T('Hanno la stessa')],
          answer: 1,
          explain: T('Giusto: la blu non cambia mai velocità, quindi la sua accelerazione è zero! L’arancione invece va sempre più forte.', 'Giusto: la blu ha a = 0 (retta orizzontale), l’arancione 3 m/s² (retta che sale).', 'Giusto: la blu non cambia velocità (accelerazione zero), l’arancione guadagna 3 m/s ogni secondo.'),
          wrong: T('Guarda le due linee: quale sale e quale resta piatta?', 'Nel grafico v–t l’accelerazione è la pendenza. Quale retta è inclinata?', 'Sul grafico velocità–tempo l’accelerazione è la pendenza. Quale linea è inclinata?'),
        },
        {
          kind: 'q',
          text: T('La blu era più veloce, ma l’arancione accelerava di più. Il mito è vero?', 'Hai visto un’auto veloce con accelerazione zero e un’auto lenta con accelerazione grande. Che cosa concludi sul mito, secondo cui velocità e accelerazione vanno sempre insieme?', 'Un aereo in crociera va a 900 km/h con il caffè fermo nella tazza; un’auto che parte al semaforo ti schiaccia sul sedile a 20 km/h. Velocità e accelerazione sono la stessa cosa?'),
          options: [
            T('No: sono due cose diverse', 'Falso: la velocità è quanto vai veloce, l’accelerazione quanto in fretta cambia la velocità', 'No: una dice quanto vai forte, l’altra quanto stai cambiando'),
            T('Sì: chi è più veloce accelera di più', 'Vero: sono la stessa grandezza', 'Sì: chi è veloce sta anche accelerando'),
          ],
          answer: 0,
          explain: T('Mito sfatato! Un’auto può andare velocissima senza accelerare, e una lenta può accelerare tanto.', 'Mito sfatato: la blu è più veloce all’inizio ma ha accelerazione zero; l’arancione è lenta ma accelera. Sono grandezze diverse.', 'Mito sfatato: sul grafico velocità–tempo la velocità è l’altezza della linea, l’accelerazione è la sua pendenza. Due cose diverse: il corpo sente solo la seconda.'),
        },
      ],
      hints: [T('Guarda le due linee nel grafico velocità–tempo: una è piatta, l’altra sale.', 'Altezza della linea = velocità, pendenza = accelerazione.')],
      solution: T('Il mito è falso: la velocità e l’accelerazione sono due cose diverse.', 'Falso: v è l’altezza della retta v–t, a la sua pendenza.', 'Falso: la velocità è l’altezza della linea, l’accelerazione la sua pendenza.'),
    },
  ],
};
