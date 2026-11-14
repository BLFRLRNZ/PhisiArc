# Scrivere una zona di PhisiArc

Una zona è un file in `js/content/` (per esempio `m04.js`) con sei livelli. Chi scrive i contenuti lavora con **testi, numeri e formule brevi**:
non serve scrivere funzioni. Le funzioni restano possibili per i casi speciali, ma non sono la strada normale.

## I testi nelle tre lenti

Ogni testo si scrive con `T(esploratore, studente, curioso)`. Se un testo manca, si usa quello prima:
`T('Uguale per tutti')` vale per tutte e tre le lenti; `T('Per i piccoli', 'Per gli altri')` vale per Studente e Curioso.

## I passi

| Tipo | Che cosa fa | Cosa si scrive |
|------|-------------|----------------|
| `free` | Esperimenti liberi | `text`, `runs` (quanti lanci servono) |
| `run` | Una sequenza di esperimenti da guardare | `text`, `seq` (i parametri di ogni lancio), `explain` |
| `q` | Domanda a scelta | `text`, `options` (da 2 a 4), `answer` (da 0), `explain`, `wrong`; con `predict` diventa una previsione |
| `vars` | Quale variabile cambiare | `vars` (`{ k, t }`), `change`, `explain` |
| `order` | Mettere in ordine | `items` (`{ t, v }`), `explain` |
| `num` | Domanda di calcolo | vedi sotto |
| `tune` | Regolare i controlli per centrare un obiettivo | vedi sotto |

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
Valori e formule possono cambiare per lente: `vals: { e: {...}, s: {...} }`, `calc: { e: 'c / t', s: '2 * Math.PI * r / T' }`.

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

## Prima di caricare

1. `node tools/check-content.mjs`: risposte valide, testi in tutte le lenti, aiuti e soluzioni, generatori che funzionano, file offline.
2. `node tools/check-prereq.mjs`: nessuna idea usata prima di essere spiegata (aggiorna `js/content/prereq.js`).
3. `node tests/play-all.mjs http://localhost:8765` con il gioco servito in locale: un Chrome gioca tutti i livelli nelle tre lenti.
   Gli stessi controlli girano su GitHub a ogni push.

## I salvataggi

Se rinomini un livello o una zona già pubblicati, aggiungi la coppia `'vecchio-id': 'nuovo-id'` a `RENAMED` in `js/state.js`:
le stelle e gli sblocchi dei giocatori seguono il nome nuovo. Se cambi la forma dei dati salvati, alza `VERSION` e aggiungi il passo in `MIGRATIONS`.

Il ripasso del giorno (`js/review.js`) ricorda le domande per livello e posizione del passo (`m03-3#1`): se riordini i passi di un livello già pubblicato
non si rompe niente, ma qualche domanda tornerà prima o dopo del previsto. Entrano nel ripasso le domande `q` senza esperimento e le `num`.
