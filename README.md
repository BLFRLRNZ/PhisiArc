# PhisiArc

La fisica a livelli, per tutti: bambini, studenti e adulti curiosi. Ogni **mondo** è un'area della fisica, ogni mondo ha le sue **zone** (gli argomenti) e ogni zona è fatta di **livelli** da superare dentro una simulazione vera: prima prevedi, poi provi, poi scopri.

Si gioca nel browser, si installa come app e funziona anche offline.

## Cosa c'è in questa prima versione

- **Due mondi giocabili** su dodici: **Il Laboratorio** (F01 Il metodo scientifico, F02 Grandezze e misure) e **La Pista** (M01 Posizione e velocità, M02 Accelerazione e caduta libera, M03 Proiettili). Gli altri dieci mondi sono già sulla mappa, con gli argomenti che arriveranno.
- **Lo stesso ritmo in ogni zona**: due **Lezioni**, un **Prevedi** (scegli cosa succederà, poi guardi l'esperimento), un **Costruisci**, un **Ripasso** e il **Boss**.
- **Tre lenti per età** sullo stesso percorso, scelte all'inizio e cambiabili quando vuoi:
  - **Esploratore** (6-11 anni): niente formule, poche parole, una voce che legge (🔊).
  - **Studente** (12-19 anni): formule, unità, grafici e calcoli.
  - **Curioso** (adulti): le idee della fisica e dove si incontrano ogni giorno.
- **Cinque simulazioni**: il pendolo, lo zoom delle grandezze (dall'atomo alla Via Lattea), la gara con il grafico spazio-tempo, la caduta libera (con o senza aria, sulla Terra o sulla Luna) e il cannone.
- **Verifiche a prova di memoria**: nei livelli Costruisci il compito torna con valori nuovi, così passa chi ha capito la regola e non chi ha indovinato il numero.
- **Il tuo parco divertimenti**: ogni livello Costruisci aggiunge un gioco (l'altalena, i cartelli, il trenino, la torre a caduta libera, il tiro al bersaglio).
- **I boss di Dubbia**: ogni zona finisce con un mito da smontare con un esperimento. Dubbia risponde con domande, non con soluzioni.
- **Aiuti a gradini**: due suggerimenti, poi la soluzione. **Stelle**: ★★★ senza aiuti e senza errori, ★★ con i suggerimenti, ★ con la soluzione.
- **Joule e gradi**: ogni stella vale 10 joule; ogni mondo finito dà il nome di uno scienziato (Sperimentatore, Galileo, … fino a Curie).
- **Salvataggio** sul dispositivo, con un codice da copiare per portare i progressi altrove. Tema chiaro e scuro, suoni disattivabili.

## Come usarla

Non serve nessuna installazione né compilazione: sono file statici.

- **In locale**: dalla cartella del progetto avvia un piccolo server, per esempio `python3 -m http.server`, e apri `http://localhost:8000`. (Aprire `index.html` con doppio clic non basta, perché il browser blocca i moduli JavaScript da file.)
- **Online gratis**: su GitHub vai in **Settings → Pages**, scegli il branch `main` e la cartella `/ (root)`.

## Come è fatta

```
index.html            la pagina
css/style.css         grafica, tema chiaro e scuro
js/app.js             schermate: benvenuto, mondi, zone, parco, gradi, impostazioni
js/level.js           il motore dei livelli (domande, previsioni, regolazioni, stelle)
js/sims/              le simulazioni, una per file, su canvas
js/content/index.js   i 12 mondi, i gradi e le regole di sblocco
js/content/f01.js …   i testi e i livelli di ogni zona, nelle tre lenti
sw.js, manifest       app installabile e offline
```

Per aggiungere una zona basta un nuovo file in `js/content/` (stessa forma degli altri) e una riga in `js/content/index.js`.
