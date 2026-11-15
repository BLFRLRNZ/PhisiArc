# Scrivere una zona di PhysiArc

Una zona è un file in `js/content/` (per esempio `m04.js`), di solito con sei livelli (da 4 a 9). Chi scrive i contenuti lavora con **testi, numeri e formule brevi**:
non serve scrivere funzioni. Le funzioni restano possibili per i casi speciali, ma non sono la strada normale.

## I testi nelle tre lenti

Ogni testo si scrive con `T(esploratore, studente, curioso)`. Se un testo manca, si usa quello prima:
`T('Uguale per tutti')` vale per tutte e tre le lenti; `T('Per i piccoli', 'Per gli altri')` vale per Studente e Curioso.
Un passo riservato a Studente e Curioso (`only: ['s', 'c']`) si scrive `T(null, 'Studente', 'Curioso')`. Anche il titolo di un livello può essere un `T(...)`.

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

Le formule non si nascondono: si insegnano. Gli strumenti di matematica che usano (leggere una formula, il quadrato, la
radice, Pitagora, π, seno e coseno) sono in `js/tools.js`, ognuno con una scheda da giocare: un’animazione con l’omino
di gesso (`js/toolanim.js`), una spiegazione, un disegno con i cursori e una domanda.

- La scheda si apre da sola, prima di cominciare, nel primo livello che usa lo strumento (lenti Studente e Curioso).
  Non serve segnarlo a mano: `toolsIn()` cerca nei testi del livello i segni dello strumento (√, π, ², sin…).
- Chi lo sa già preme «Li so già». Tutte le schede restano nella pagina `#/attrezzi`, raggiungibile dalla mappa.
- Un nuovo strumento: si aggiunge a `TOOLS` (titolo, test, spiegazione, disegno, domanda) e a `SCENES` per l’animazione,
  con le frasi inglesi in `js/i18n/en-tools.js`. `tests/tools.mjs` controlla che le schede compaiano e si superino.
