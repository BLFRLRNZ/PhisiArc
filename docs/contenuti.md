# Scrivere una zona di PhysiArc

Una zona è un file in `js/content/` (per esempio `m04.js`), di solito con sei livelli (da 4 a 9). Chi scrive i contenuti lavora con **testi, numeri e formule brevi**:
non serve scrivere funzioni. Le funzioni restano possibili per i casi speciali, ma non sono la strada normale.

## I testi nelle tre lenti

Ogni testo si scrive con `T(esploratore, studente, curioso)`. Se un testo manca, si usa quello prima:
`T('Uguale per tutti')` vale per tutte e tre le lenti; `T('Per i piccoli', 'Per gli altri')` vale per Studente e Curioso.
Un passo riservato a Studente e Curioso (`only: ['s', 'c']`) si scrive `T(null, 'Studente', 'Curioso')`. Anche il titolo di un livello può essere un `T(...)`.

Ogni lente ha la sua voce, e `node tools/check-lenti.mjs` controlla che la mantenga:

- **Esploratore** (6-11 anni). Le domande a scelta stanno entro **20 parole**: quello che serve per capirle va nell'introduzione del
  livello o nella spiegazione del passo prima. Niente formule né simboli. Nei calcoli e nei bersagli solo **numeri interi**
  (valori per lente: `vals: { e: {...}, s: {...} }`). La risposta giusta non deve riconoscersi dalla lunghezza, e non deve essere
  sempre dello stesso tipo («insieme», «uguale»): ogni tanto la domanda si gira, e la risposta giusta è la differenza.
- **Studente** (12-19 anni). Formule, unità, grafici e calcoli.
- **Curioso** (adulti). Ogni domanda ha un **testo suo**, che parte da qualcosa di tutti i giorni (l'altalena, il cartello «2 km»,
  la bilancia del bagno, il rinvio del portiere). Le formule si scrivono fra doppie parentesi quadre, `[[v = d / t]]`: sulla pagina
  diventano un riquadro chiuso, **«Per chi vuole la formula»**, che non viene letto dalla voce e non fa aprire schede di matematica.
  Fuori dal riquadro la stessa idea va detta a parole. I passi di calcolo hanno il tasto **«Salta il calcolo»** (mostra la risposta,
  non costa stelle), e per questa lente i calcoli non entrano nella prova d'ingresso né nel ripasso del giorno.

## I passi

| Tipo | Che cosa fa | Cosa si scrive |
|------|-------------|----------------|
| `free` | Esperimenti liberi | `text`, `runs` (quanti lanci servono); `distinct: true` se ogni lancio deve avere valori diversi; `need` se serve un lancio per ogni condizione (vedi sotto) |
| `run` | Una sequenza di esperimenti da guardare | `text`, `seq` (i parametri di ogni lancio), `explain` |
| `q` | Domanda a scelta | `text`, `options` (da 2 a 4), `answer` (da 0), `explain`, `wrong`; con `predict` diventa una previsione |
| `vars` | Quale variabile cambiare | `vars` (`{ k, t }`), `change`, `explain` |
| `order` | Mettere in ordine | `items` (`{ t, v }`), `explain` |
| `num` | Domanda di calcolo | vedi sotto |
| `tune` | Regolare i controlli per centrare un obiettivo | vedi sotto |

### Prove libere che controllano che cosa hai provato (`free`)

```js
{
  kind: 'free', runs: 2, text: T('Fai una traversata senza corrente, poi una con la corrente.'),
  need: [
    { when: 'vc == 0', try: { vc: 0 }, msg: T('Fai anche una traversata con la corrente a zero.') },
    { when: 'vc > 0', try: { vc: 2 }, msg: T('Ora accendi la corrente e rilancia.') },
  ],
}
```

`when` è una formula breve sui valori dei controlli della simulazione; `try` sono valori che la soddisfano (li usa il test automatico);
`msg` è quello che il gioco dice quando un lancio non serve a niente. Con `distinct: true`, invece, basta che ogni lancio abbia valori
diversi da quelli già contati.

### Domanda di calcolo (`num`)

```js
{
  kind: 'num', rounds: 2, text: T('Calcola la velocità.'),
  vals: { a: [2, 3, 4], t: [3, 4, 5] },     // valori scelti a caso
  derive: { v: 'a * t' },                   // facoltativo: altri valori calcolati
  calc: 'a * t',                            // la risposta giusta
  unit: 'm/s', tol: { e: 0, s: 0.01 },      // unità e tolleranza (anche per lente)
  ask: T('Ogni secondo va <b>{a} m/s</b> più veloce. Dopo <b>{t} secondi</b>?', 'Accelerazione <b>{a} m/s²</b>: velocità dopo <b>{t} s</b>?'),
  explain: T('Giusto: {t} volte {a} fa {ans} m/s.', 'Esatto: v = a·t = {ans} m/s.'),
}
```

Nei testi `{a}` diventa il valore scelto (con la virgola), `{ans}` la risposta; `{a:1}` mostra al massimo un decimale.
Valori e formule possono cambiare per lente: `vals: { e: {...}, s: {...} }`, `derive: { e: {...}, s: {} }`, `calc: { e: 'c / t', s: '2 * Math.PI * r / T' }`.
Un `gen` scritto a mano riceve `(lente, prova, simulazione)`: così una domanda può usare le misure appena fatte (vedi `mediaTue` in `f03.js`).
Lo svolgimento (`explain`) è anche quello che legge chi, con la lente Curioso, preme «Salta il calcolo».

### Prova da regolare (`tune`)

```js
{
  kind: 'tune', rounds: 2, text: T('Scegli l’accelerazione e lancia il treno.'),
  vals: { v: [[10, 15, 20], [12, 18]] },    // un elenco per ogni prova
  ask: T('Il treno deve arrivare a <b>{v} m/s</b>.'),
  measure: 'vEnd[0]', goal: 'v',            // che cosa si misura nel risultato della simulazione, e quanto deve valere
  tol: { e: 1, s: 0.6 },
  ok: T('{got:1} m/s: lancio perfetto!'),
  high: T('{got:1} m/s: troppo veloce.'), low: T('{got:1} m/s: troppo lento.'),
  solve: { a1: 'v * v / 100' },             // i controlli che risolvono la prova (li usa il test automatico)
  set: { m1: 'm' },                          // (facoltativo) parametri della simulazione per ogni prova, dai valori scelti
}
```

`{got}` è il valore misurato. `measure` è il nome di un campo del risultato della simulazione (per la gara `times[0]`, `vEnd[0]`;
per il laboratorio `y`; per la giostra `v`; vedi il `finish(...)` di ogni simulazione in `js/sims/`).

## Gli aiuti

Prima della soluzione c'è sempre un passaggio. Per ogni passo il motore usa, in ordine: i suggerimenti del passo (`hints`);
per una domanda a scelta in un livello con più domande, il suo «riprova» (`wrong`) e poi un suggerimento automatico che toglie
una risposta sbagliata (se le risposte sono almeno tre); altrimenti i suggerimenti del livello (`hints` del livello).
La soluzione è quella del passo (`solution`), poi quella che il motore ricava da solo (la risposta giusta, il risultato, l'ordine),
poi quella del livello. Una previsione ha bisogno della sua `solution`: quella del livello parla del compito principale.

## Sul telefono

Sotto gli 820 px la pagina è in colonna. Nei passi con una risposta da dare (`q`, `num`, `vars`, `order`) le risposte stanno subito sotto
la domanda e la simulazione viene dopo; negli altri (`free`, `run`, `tune`) la simulazione sta sotto la consegna. Conviene che una domanda
si capisca anche senza scorrere fino alla simulazione.

## Prima di caricare

1. `node tools/check-content.mjs`: risposte valide, testi in tutte le lenti, aiuti e soluzioni, generatori che funzionano, file offline.
   `node tools/check-lenti.mjs`: le promesse delle lenti (Esploratore entro 20 parole e con numeri interi; Curioso con testi suoi e
   formule nei riquadri). Stampa anche quante parole ha in media una domanda e quanto spesso la risposta giusta è la più lunga.
2. `node tools/check-prereq.mjs`: nessuna idea usata prima di essere spiegata. Legge i testi, lente per lente: se introduci un'idea nuova,
   aggiungila a `IDEE` in `js/content/prereq.js` con le sue parole e il livello che la spiega.
3. `node tests/play-all.mjs http://localhost:8765` con il gioco servito in locale: un Chrome gioca tutti i livelli nelle tre lenti.
   Gli stessi controlli girano su GitHub a ogni push.

## I salvataggi

Se rinomini un livello o una zona già pubblicati, aggiungi la coppia `'vecchio-id': 'nuovo-id'` a `RENAMED` in `js/state.js`:
le stelle e gli sblocchi dei giocatori seguono il nome nuovo. Se cambi la forma dei dati salvati, alza `VERSION` e aggiungi il passo in `MIGRATIONS`.

Il ripasso del giorno (`js/review.js`) ricorda le domande per livello e posizione del passo (`m03-3#1`): se riordini i passi di un livello già pubblicato
non si rompe niente, ma qualche domanda tornerà prima o dopo del previsto. Entrano nel ripasso le domande `q` senza esperimento e le `num`. Una domanda che chiede di guardare la simulazione («guarda le due linee…») si tiene fuori con `review: false`.

## L’inglese

I testi si scrivono sempre in italiano. La versione inglese sta in `js/i18n/`: un dizionario per zona (`en-m03.js`…) che ha come chiave
la frase italiana esatta. Se cambi una frase italiana, la sua traduzione non vale più e quella frase resta in italiano finché non la traduci.

1. `node tools/i18n-strings.mjs` elenca le frasi senza traduzione, zona per zona (`--json file.json` le scrive in un file).
2. Aggiungi le coppie `'frase italiana': 'English sentence'` nel file della zona, con gli stessi segnaposto (`{a}`, `{got:1}`) e gli stessi `<b>`.
3. `node tools/i18n-strings.mjs --check` deve dire 0 frasi senza traduzione (gira anche su GitHub).

Nelle frasi scritte dentro una funzione (per esempio i messaggi di un `check`) si usa `t('frase con {x}', { x })` da `js/i18n.js`:
così la frase finisce nell’elenco e i numeri si scrivono all’inglese (3.5 invece di 3,5).
Per provare: `?lang=en` in fondo all’indirizzo, oppure Impostazioni → Lingua. `LINGUA=en node tests/play-all.mjs …` gioca tutto in inglese.

## La cassetta degli attrezzi

Le formule non si nascondono: si insegnano. Gli strumenti di matematica che usano (le potenze di 10, leggere una formula,
il quadrato, la radice, Pitagora, π, seno e coseno) sono in `js/tools.js`, ognuno con una scheda da giocare: un’animazione
con l’omino (`js/toolanim.js`), una spiegazione, un disegno con i cursori e una domanda. Valgono per le lenti
Studente e Curioso. Dall’Officina la cassetta ha un secondo scaffale, **Fisica**, con le idee che reggono le leggi
(la forza e l’inerzia, F = m·a, azione e reazione): stesse schede, con il film, ma segnate `offer: true` e `area: 'fisica'`.

- **In cima a ogni scheda c’è un piccolo film** di circa un minuto (`js/films/<attrezzo>.js`, raccolti in `js/toolfilm.js`):
  una tela nera, l’omino del percorso arcade, i suoni e nessuna scritta. Ogni segno della formula nasce da una cosa che
  l’omino tocca: la striscia della corsa diventa d, il cronometro t; gli zeri saltano fuori dai gradini; le piastrelle
  riempiono il quadrato. Le lettere e i numeri che restano fermi sullo schermo mentre il mondo scorre sono la «frase»
  dell’attrezzo, scritta con le lettere e con i numeri (v = d / t = 6 / 3 = 2).
  - Il motore è `js/toon.js`: il corpo con i piedi che restano piantati, la telecamera, gli urti, i suoni, il carattere
    delle formule (STIX Two Text, in `fonts/`).
  - La regia è `js/toonkit.js`: un film è una fila di battute (`tl.span`, `tl.walk`, `tl.jump`), con i gesti che tornano
    sempre (`grab`, `carry`, `toss`, `point`, `push`, `cheer`…), le cose che succedono in un istante (`tl.on`) e le lettere
    che volano al loro posto (`tl.chip`). L’inizio del file spiega come si scrive.
  - Il riproduttore è `js/toolanim.js`: il film parte quando si vede, aspetta se esce dallo schermo, si ferma e riparte
    con un tocco, e alla fine lascia l’ultimo fotogramma con il bottone per rivederlo. Chi ha chiesto «meno movimento»
    al dispositivo vede subito l’ultimo fotogramma e fa partire il film con il bottone.
  - I numeri con la virgola seguono la lingua (`num`, `comma` in `toonkit.js`): nei film non ci sono parole da tradurre.
- **Gli attrezzi di fisica non interrompono mai**: dove un testo ne parla (l’introduzione, una spiegazione, un aiuto) sotto c’è
  il bottone «Attrezzo · …». La lezione resta un esperimento; il film è lì per chi vuole rivedere l’idea con calma.
  Gli oggetti che tornano nei loro film (il carrello, i pavimenti, il paraurti, le frecce delle forze, la molla, i blocchi)
  sono in `js/films/props.js`.
- **Quando serve per rispondere, la scheda di matematica si apre da sola**, prima di cominciare, nel primo livello che usa lo strumento.
  Non serve segnarlo a mano: `toolsIn()` cerca i segni dello strumento (10³, √, π, ², sin…) in quello che si legge prima di
  rispondere (introduzione, consegne, domande, risposte) e nello svolgimento dei calcoli.
- **Quando lo strumento compare solo in una spiegazione, in un aiuto, in una soluzione o in un riquadro `[[…]]`**, la scheda
  non interrompe: sotto quel testo c’è un bottone «Attrezzo · …» che la apre. Così una formula mostrata «per completezza»
  non costringe a tre schede di fila.
- Uno strumento può chiederne altri prima (`needs`): la radice porta con sé il quadrato, Pitagora tutti e due.
  Conviene che un livello non apra più di una scheda: `node tools/check-lenti.mjs -v` dice dove si apre ognuna,
  e segnala un livello che ne aprirebbe più di due.
- Chi lo sa già preme «Li so già». Tutte le schede restano nella pagina `#/attrezzi`, raggiungibile dalla mappa.
- Un nuovo strumento: si aggiunge a `TOOLS` (titolo, test, spiegazione, disegno, domanda), con il suo film in
  `js/films/` (e il file in `SHELL` di `sw.js`) e le frasi inglesi in `js/i18n/en-tools.js`. `tests/tools.mjs` controlla
  che la scheda si apra quando serve, che il bottone la offra quando non serve, che la cassetta le contenga tutte, e che
  ogni film duri circa un minuto, parta da solo, disegni dall’inizio alla fine e che la mano dell’omino arrivi sempre
  agli oggetti che deve toccare.
