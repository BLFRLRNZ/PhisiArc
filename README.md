# PhisiArc

La fisica a livelli, per tutti: bambini, studenti e adulti curiosi. Ogni **mondo** è un'area della fisica, ogni mondo ha le sue **zone** (gli argomenti) e ogni zona è fatta di **livelli** da superare dentro una simulazione vera: prima prevedi, poi provi, poi scopri.

Si gioca nel browser, si installa come app e funziona anche offline.

## Cosa c'è in questa prima versione

- **Due mondi giocabili** su dodici: **Il Laboratorio** (F01 Il metodo scientifico, F02 Grandezze e misure, F03 Grafici e proporzionalità) e **La Pista** (M01 Posizione e velocità, M04 L'accelerazione, M02 La caduta libera, M03 Vettori e proiettili, M05 Il moto circolare). Gli altri dieci mondi sono già sulla mappa, con gli argomenti che arriveranno.
- **Un percorso solo**: i dodici mondi sono in fila dal più semplice al più difficile, uno per campo della fisica, e ognuno si apre quando finisci il precedente. Quello che hai già aperto resta aperto anche quando arrivano zone nuove. Chi conosce già un mondo può saltarlo con la **prova d'ingresso**. Il piano completo è in [docs/percorso.md](docs/percorso.md).
- **Il ritmo delle zone**: per ora ogni zona ha due **Lezioni**, un **Prevedi** (scegli cosa succederà, poi guardi l'esperimento), un **Costruisci**, un **Ripasso** e il **Boss**; dai prossimi mondi il ritmo cambierà da zona a zona.
- **Tre lenti per età** sullo stesso percorso, scelte all'inizio e cambiabili quando vuoi:
  - **Esploratore** (6-11 anni): niente formule, poche parole, e una voce, accesa da sola, che legge domande e risposte.
  - **Studente** (12-19 anni): formule, unità, grafici e calcoli.
  - **Curioso** (adulti): le idee della fisica e dove si incontrano ogni giorno.
- **Cinque simulazioni**, disegnate a linee in stile lavagna animata: il pendolo, lo zoom delle grandezze (dal protone all'universo osservabile, 30 tappe), la gara con il grafico spazio-tempo, la caduta libera (con o senza aria, sulla Terra o sulla Luna) e il cannone.
- **Verifiche a prova di memoria**: nei Costruisci e nei Ripassi i calcoli tornano con valori nuovi, e le opzioni delle domande si mescolano a ogni partita: passa chi ha capito la regola, non chi ricorda la posizione.
- **Prepara l'esperimento**: in alcuni passi scegli tu, variabile per variabile, cosa cambiare e cosa tenere uguale.
- **Velocità 1×, 2×, 4×** accanto al tasto Lancia, per non aspettare le gare lente.
- **Il tuo parco divertimenti**: ogni livello Costruisci aggiunge un gioco (l'altalena, i cartelli, il trenino, la torre a caduta libera, il tiro al bersaglio).
- **I boss di Vetrino e Bilancia**: ogni zona finisce con un mito da smontare con un esperimento. Vetrino, il microscopio investigatore, risponde con domande, non con soluzioni.
- **Aiuti a gradini**: uno o due suggerimenti (dipende dal livello), poi la soluzione. **Stelle**: si parte da ★★★ senza aiuti, ★★ se usi un suggerimento, ★ se guardi la soluzione; una sola regola sugli errori: **sbagliare una risposta costa una stella, sperimentare no** (le previsioni sbagliate e i lanci di prova con i cursori sono gratis); un livello superato vale sempre almeno ★. Gli aiuti seguono il passo in cui sei, e ogni passo ha la sua soluzione.
- **Joule e gradi**: ogni stella vale 10 joule; ogni mondo finito dà il nome di uno scienziato (Sperimentatore, Galileo, … fino a Curie).
- **Italiano e inglese**: la lingua si sceglie all'inizio e nelle impostazioni (di base quella del browser); numeri e voce seguono la lingua. Come si traduce: [docs/contenuti.md](docs/contenuti.md).
- **Ripasso del giorno**: le domande dei livelli finiti tornano dopo qualche giorno (1, 3, 7, 14, 30), finché non le sai al primo colpo.
- **Più giocatori** sullo stesso dispositivo, ognuno con le sue stelle, il suo parco e la sua lente.
- **Salvataggio** sul dispositivo, con un codice da copiare per portare i progressi altrove (il codice si controlla prima di usarlo). Funziona offline, con i font inclusi nel gioco. Tema scuro, suoni e voce disattivabili; l'animazione d'apertura parte da sola solo al primo avvio (si può rivedere dalle impostazioni).

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
js/content/prereq.js  la mappa dei prerequisiti: che idee usa e introduce ogni zona
tools/check-prereq.mjs  controlla che nessuna idea sia usata prima di essere spiegata
tools/check-content.mjs controlla i contenuti; tests/play-all.mjs gioca tutti i livelli
js/content/declarative.js  i passi scritti solo a testo (num, tune) diventano giocabili
sw.js, manifest       app installabile e offline
```

Per aggiungere una zona basta un nuovo file in `js/content/` (stessa forma degli altri), una riga in `js/content/index.js` e una in `js/content/prereq.js`. Come si scrive, solo con testi e numeri, è spiegato in [docs/contenuti.md](docs/contenuti.md).

## Controlli

```
node tools/check-content.mjs     # risposte, testi nelle tre lenti, aiuti, soluzioni, file offline
node tools/check-prereq.mjs      # nessuna idea usata prima di essere spiegata
node tests/play-all.mjs URL      # un Chrome gioca tutti i livelli nelle tre lenti (serve playwright)
```

Girano anche su GitHub a ogni push (`.github/workflows/test.yml`).
