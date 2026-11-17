# PhysiArc

La fisica a livelli, per tutti: bambini, studenti e adulti curiosi. Ogni **mondo** è un'area della fisica, ogni mondo ha le sue **zone** (gli argomenti) e ogni zona è fatta di **livelli** da superare dentro una simulazione vera: prima prevedi, poi provi, poi scopri.

Si gioca nel browser, si installa come app e funziona anche offline.

## Cosa c'è in questa prima versione

- **Due mondi giocabili** su dodici: **Il Laboratorio** (Il metodo scientifico, Grandezze e misure, Grafici e proporzionalità) e **La Pista** (Posizione e velocità, L'accelerazione, La caduta libera, Vettori e proiettili, Il moto circolare): 8 zone e 52 livelli. Gli altri dieci mondi sono già sulla mappa, con gli argomenti che arriveranno. Sulla pagina le zone sono numerate in ordine (M01…M05); nei file hanno un nome interno che non cambia mai (l'accelerazione è `m04.js`), perché a quel nome sono legati i salvataggi.
- **Un percorso solo**: i dodici mondi sono in fila dal più semplice al più difficile, uno per campo della fisica, e ognuno si apre quando finisci il precedente. Quello che hai già aperto resta aperto anche quando arrivano zone nuove. Chi conosce già un mondo può saltarlo con la **prova d'ingresso**. Il piano completo è in [docs/percorso.md](docs/percorso.md).
- **Il ritmo delle zone**: per ora ogni zona ha due **Lezioni**, un **Prevedi** (scegli cosa succederà, poi guardi l'esperimento), un **Costruisci**, un **Ripasso** e il **Boss**; le zone più ricche hanno qualche livello in più (L'accelerazione 7, Vettori e proiettili 9). Dai prossimi mondi il ritmo cambierà da zona a zona.
- **Tre lenti per età** sullo stesso percorso, scelte all'inizio e cambiabili quando vuoi:
  - **Esploratore** (6-11 anni): niente formule, domande entro 20 parole, conti con soli numeri interi, e una voce, accesa da sola, che legge domande e risposte.
  - **Studente** (12-19 anni): formule, unità, grafici e calcoli.
  - **Curioso** (adulti): le idee della fisica raccontate con esempi di tutti i giorni (l'altalena, il navigatore, la bilancia del bagno). Le formule ci sono, ma chiuse in un riquadro «Per chi vuole la formula», e i calcoli si possono saltare.
- **Otto simulazioni**, disegnate a linee in stile lavagna animata: il pendolo, lo zoom delle grandezze (dal protone all'universo osservabile, 30 tappe), il laboratorio dei grafici (rubinetto, viaggio e frenata, anche con l'errore di misura), la gara con i grafici posizione–tempo e velocità–tempo, la caduta libera (con o senza aria, sulla Terra o sulla Luna), la barca sul fiume, il cannone (con o senza aria) e la giostra vista dall'alto.
- **Verifiche a prova di memoria**: nei Costruisci e nei Ripassi i calcoli tornano con valori nuovi, e le opzioni delle domande si mescolano a ogni partita: passa chi ha capito la regola, non chi ricorda la posizione.
- **Esperimenti che contano**: nelle prove libere un lancio conta solo se fa quello che la consegna chiede (valori diversi da quelli già provati, la corrente accesa, l'aria spenta…); se non conta, il gioco dice che cosa manca.
- **Prepara l'esperimento**: in alcuni passi scegli tu, variabile per variabile, cosa cambiare e cosa tenere uguale.
- **Velocità 1×, 2×, 4×** accanto al tasto Lancia, per non aspettare le gare lente.
- **Il tuo parco divertimenti**: ogni livello Costruisci aggiunge un gioco (l'altalena, i cartelli, la fontana, il trenino, il treno a razzo, la torre a caduta libera, il tiro al bersaglio, la giostra a catene).
- **I boss di Vetrino e Bilancia**: ogni zona finisce con un mito da smontare con un esperimento. Vetrino, il microscopio investigatore, risponde con domande, non con soluzioni.
- **Aiuti a gradini**: prima della soluzione c'è sempre almeno un passaggio: i suggerimenti scritti per quel passo oppure, nelle domande a scelta, una risposta sbagliata in meno; dove non c'è niente da suggerire, un avviso che non costa stelle. Nella prova d'ingresso il primo tocco su Aiuto avvisa soltanto, e la prova resta valida. **Stelle**: si parte da ★★★ senza aiuti, ★★ se usi un suggerimento, ★ se guardi la soluzione; una sola regola sugli errori: **sbagliare una risposta costa una stella, sperimentare no** (le previsioni sbagliate e i lanci di prova con i cursori sono gratis); un livello superato vale sempre almeno ★. Gli aiuti seguono il passo in cui sei, e ogni passo ha la sua soluzione.
- **La cassetta degli attrezzi** (Studente e Curioso): sette schede di matematica, ognuna con un piccolo film di un minuto (l'omino costruisce l'attrezzo con le mani, senza una parola), un disegno da muovere e una domanda: le potenze di 10, leggere una formula, il quadrato, la radice, Pitagora, π, seno e coseno. Una scheda si apre da sola solo nel primo livello in cui l'attrezzo serve per rispondere, mai più di una alla volta; se compare soltanto in una spiegazione o in un aiuto, sotto il testo c'è un bottone per aprirla.
- **Joule e gradi**: ogni stella vale 10 joule; ogni mondo finito dà il nome di uno scienziato (Sperimentatore, Galileo, … fino a Curie).
- **Italiano e inglese**: la lingua si sceglie all'inizio e nelle impostazioni (di base quella del browser); numeri e voce seguono la lingua. Come si traduce: [docs/contenuti.md](docs/contenuti.md).
- **Ripasso del giorno**: le domande dei livelli finiti tornano dopo qualche giorno (1, 3, 7, 14, 30), finché non le sai al primo colpo. Restano fuori quelle che chiedono di guardare la simulazione.
- **Sul telefono** domanda e risposte stanno nello stesso schermo, con la simulazione subito sotto; la pagina si può ingrandire con due dita.
- **Più giocatori** sullo stesso dispositivo, ognuno con le sue stelle, il suo parco e la sua lente.
- **Salvataggio** sul dispositivo, con un codice da copiare per portare i progressi altrove (il codice si controlla prima di usarlo). Funziona offline, con i font inclusi nel gioco. Tema scuro, suoni e voce disattivabili; l'animazione d'apertura parte a ogni avvio e si spegne dalle impostazioni.

## Come usarla

Non serve nessuna installazione né compilazione: sono file statici.

- **In locale**: dalla cartella del progetto avvia un piccolo server, per esempio `python3 -m http.server`, e apri `http://localhost:8000`. (Aprire `index.html` con doppio clic non basta, perché il browser blocca i moduli JavaScript da file.)
- **Online gratis**: su GitHub vai in **Settings → Pages**, scegli il branch `main` e la cartella `/ (root)`.

## Come è fatta

```
index.html            la pagina
css/style.css         grafica (tema scuro, stile vetro)
js/app.js             schermate: benvenuto, mondi, zone, parco, gradi, impostazioni
js/level.js           il motore dei livelli (domande, previsioni, regolazioni, stelle)
js/sims/              le simulazioni, una per file, su canvas
js/sims/art/          i disegni degli oggetti delle simulazioni (zoom, cadute, macchinine)
js/cast.js, pieces.js personaggi e pezzi del parco, disegnati a linee (SVG)
js/content/index.js   i 12 mondi, i gradi e le regole di sblocco
js/content/f01.js …   i testi e i livelli di ogni zona, nelle tre lenti
js/content/prereq.js  la mappa dei prerequisiti: le idee di ogni zona e le parole che le rivelano nei testi
tools/check-prereq.mjs  legge i testi, lente per lente: nessuna idea usata prima di essere spiegata
js/review.js          il ripasso del giorno (scatole a 1, 3, 7, 14 e 30 giorni)
js/tools.js           la cassetta degli attrezzi: le schede di matematica che si aprono quando servono
js/i18n.js, js/i18n/  l'inglese: un dizionario per zona, con la frase italiana come chiave
tools/check-content.mjs controlla i contenuti; tests/play-all.mjs gioca tutti i livelli
js/content/declarative.js  i passi scritti solo a testo (num, tune) diventano giocabili
sw.js, manifest       app installabile e offline
```

Per aggiungere una zona basta un nuovo file in `js/content/` (stessa forma degli altri), una riga in `js/content/index.js` e una in `js/content/prereq.js`. Come si scrive, solo con testi e numeri, è spiegato in [docs/contenuti.md](docs/contenuti.md).

## Controlli

```
node tools/check-content.mjs     # risposte, testi nelle tre lenti, aiuti, soluzioni, file offline
node tools/check-lenti.mjs       # le promesse delle lenti: Esploratore entro 20 parole e numeri interi, Curioso con testi suoi e formule nei riquadri
node tools/check-prereq.mjs      # nessuna idea usata prima di essere spiegata (legge i testi, lente per lente)
node tools/i18n-strings.mjs --check   # ogni frase ha la sua traduzione inglese
node tests/tools.mjs URL         # la cassetta degli attrezzi si apre e si supera
node tests/play-all.mjs URL      # un Chrome gioca tutti i livelli nelle tre lenti (serve playwright)
```

Girano anche su GitHub a ogni push (`.github/workflows/test.yml`).

## La voce neurale

La voce che legge può essere quella del dispositivo o una voce neurale [Piper](https://github.com/rhasspy/piper) che gira
dentro il browser (`js/neural.js`, impostazioni in `js/voicepanel.js`). Al primo uso si scaricano, e poi restano nella
cache: il modello della voce da Hugging Face (`rhasspy/piper-voices`, circa 60 MB), onnxruntime-web ed espeak-ng
compilato in WebAssembly da jsDelivr. Il caricatore di espeak in `js/vendor/` viene da `@mintplex-labs/piper-tts-web`
(MIT); espeak-ng è GPL-3 e ogni voce ha la sua licenza, indicata nella scheda del modello su Hugging Face.
Tono, velocità, alti, bassi ed espressività si regolano nelle impostazioni.
