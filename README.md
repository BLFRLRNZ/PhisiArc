# PhysiArc

La fisica a livelli, per tutti: bambini, studenti e adulti curiosi. Ogni **mondo** è un'area della fisica, ogni mondo ha le sue **zone** (gli argomenti) e ogni zona è fatta di **livelli** da superare dentro una simulazione vera: prima prevedi, poi provi, poi scopri.

Si gioca nel browser, si installa come app e funziona anche offline.

## Cosa c'è in questa prima versione

- **Sette mondi giocabili** su dodici: **Il Laboratorio** (Il metodo scientifico, Grandezze e misure, Grafici e proporzionalità), **La Pista** (Posizione e velocità, L'accelerazione, La caduta libera, Vettori e proiettili, Il moto circolare), **L'Officina** (Le forze e Newton, Attrito e piani inclinati, Lavoro, energia e potenza, Quantità di moto e urti, Rotazioni ed equilibrio), **Il Cielo** (La gravitazione universale, Orbite e leggi di Keplero, Il sistema solare), **L'Oceano** (La pressione, Galleggiare: Archimede, Fluidi in movimento e volo), **Il Vulcano** (Temperatura, calore e come si propaga, Stati della materia, I gas, Motori ed entropia) e **La Valle delle Onde** (Molle e oscillazioni, Le onde, Il suono, Risonanza ed effetto Doppler): 27 zone e 194 livelli. Gli altri mondi sono già sulla mappa, con gli argomenti che arriveranno. Sulla pagina le zone sono numerate in ordine (M01…M05); nei file hanno un nome interno che non cambia mai (l'accelerazione è `m04.js`), perché a quel nome sono legati i salvataggi.
- **Un percorso solo**: i dodici mondi sono in fila dal più semplice al più difficile, uno per campo della fisica, e ognuno si apre quando finisci il precedente. Quello che hai già aperto resta aperto anche quando arrivano zone nuove. Chi conosce già un mondo può saltarlo con la **prova d'ingresso**. Il piano completo è in [docs/percorso.md](docs/percorso.md).
- **Il ritmo delle zone**: nei primi due mondi ogni zona ha due **Lezioni**, un **Prevedi** (scegli cosa succederà, poi guardi l'esperimento), un **Costruisci**, un **Ripasso** e il **Boss**; le zone più ricche hanno qualche livello in più (L'accelerazione 7, Vettori e proiettili 9). Dall'Officina il ritmo cambia da zona a zona: alcune si aprono con un mistero da prevedere, altre con un esperimento da fare prima della spiegazione (nel Cielo, il satellite del parco da mettere in orbita; nell'Oceano, la chiatta del porto da caricare prima di sapere perché galleggia).
- **Tre lenti per età** sullo stesso percorso, scelte all'inizio e cambiabili quando vuoi:
  - **Esploratore** (6-11 anni): niente formule, domande entro 20 parole, conti con soli numeri interi, e una voce, accesa da sola, che legge domande e risposte.
  - **Studente** (12-19 anni): formule, unità, grafici e calcoli.
  - **Curioso** (adulti): le idee della fisica raccontate con esempi di tutti i giorni (l'altalena, il navigatore, la bilancia del bagno). Le formule ci sono, ma chiuse in un riquadro «Per chi vuole la formula», e i calcoli si possono saltare.
- **Trentadue simulazioni**, disegnate a linee in stile lavagna animata: nella Valle delle Onde le molle (i pesi appesi, la penna che scrive su un nastro, il cavallino a molla, l'ombra di una ruota, la molla e il pendolo sulla Luna), le onde (la corda e lo stagno con la paperella, la molla spinta, gli impulsi che rimbalzano e si incontrano, le onde stazionarie, l'eco nella nebbia), il suono (l'aria fra altoparlante e orecchio al rallentatore, la sveglia sotto la campana di vetro, il lampo e il tuono, il tubo lungo un chilometro, il flauto di Pan con l'accordatore, l'esplosione nello spazio), la risonanza (l'altalena spinta, il tappeto elastico, il bicchiere di cristallo con la sua curva) e l'effetto Doppler (la sirena che passa, l'aereo più veloce del suono, le ambulanze nella nebbia); nel Vulcano il calore (le particelle che si agitano di più quando scaldi, con il termometro in gradi e in kelvin, l'acqua calda e fredda da mescolare, i materiali che si scaldano più o meno in fretta sullo stesso fuoco), i viaggi del calore (le barre che conducono, le lattine al sole, la mano sul metallo e sul legno), gli stati della materia (le particelle nei tre stati, il ghiaccio sul fuoco con i suoi gradini, la limonata con il ghiaccio, la pentola in montagna e a pressione, il termometro bagnato), i gas (la scatola di particelle, la siringa chiusa, il palloncino nel freezer, la mongolfiera, la bombola al sole, la bottiglia sotto il telo) e i motori (il pistone che solleva un peso, il motore fra la caldaia e il lato freddo, il frigorifero, le particelle che si sparpagliano); nell'Oceano la pressione (le impronte sulla sabbia, dall'elefante ai tacchi a spillo, e il sollevatore idraulico), i fluidi fermi (il sub che scende nel mare, la bottiglia bucata, il barometro sulla montagna e la diga), il galleggiamento (la chiatta, il dinamometro con il vaso di Archimede, la vasca con il sottomarino) e i fluidi in movimento (i fogli su cui si soffia, il tubo di Venturi, l'ala nella galleria del vento, il decollo dell'idrovolante); nel Cielo il cannone di Newton (dalla mela che cade all'orbita, fino alla fuga), la bilancia sui pianeti e l'ascensore verso le stelle, le orbite (cerchi, ellissi, gli spicchi di area uguale, i satelliti intorno alla Terra) e il sistema solare (i pianeti con i loro anni veri, la cometa di Halley, e il sentiero dei pianeti in scala, a piedi o con la luce); nell'Officina i carrelli (forze, blocchi della massa, pavimenti che frenano o no, e due carrelli che si staccano con una molla), la rampa con l'attrito (ghiaccio, legno, gomma, con le parti del peso), le montagne russe con la barra dell'energia, gli urti fra carrelli (paraurti a molla o con il velcro, la quantità di moto e il grafico della forza), l'altalena a bilico e la leva, la pedana che si inclina con il baricentro; e poi il pendolo, lo zoom delle grandezze (dal protone all'universo osservabile, 30 tappe), il laboratorio dei grafici (rubinetto, viaggio e frenata, anche con l'errore di misura), la gara con i grafici posizione–tempo e velocità–tempo, la caduta libera (con o senza aria, sulla Terra o sulla Luna), la barca sul fiume, il cannone (con o senza aria) e la giostra vista dall'alto.
- **Verifiche a prova di memoria**: nei Costruisci e nei Ripassi i calcoli tornano con valori nuovi, e le opzioni delle domande si mescolano a ogni partita: passa chi ha capito la regola, non chi ricorda la posizione.
- **Esperimenti che contano**: nelle prove libere un lancio conta solo se fa quello che la consegna chiede (valori diversi da quelli già provati, la corrente accesa, l'aria spenta…); se non conta, il gioco dice che cosa manca.
- **Prepara l'esperimento**: in alcuni passi scegli tu, variabile per variabile, cosa cambiare e cosa tenere uguale.
- **Velocità 1×, 2×, 4×** accanto al tasto Lancia, per non aspettare le gare lente.
- **Il suono si sente davvero**: nella Valle delle Onde, al lancio, si ascolta la nota scelta con il cursore, la sveglia che si spegne senz'aria, il tuono, i due colpi nel tubo di ferro, la canna del flauto accanto alla nota da imitare, il bicchiere che si rompe e la sirena che scende quando l'ambulanza passa (se i suoni sono accesi nelle impostazioni).
- **Il tuo parco divertimenti**: ogni livello Costruisci aggiunge un gioco (l'altalena, i cartelli, la fontana, il trenino, il treno a razzo, la torre a caduta libera, il tiro al bersaglio, la giostra a catene, il carrello della miniera, lo scivolo, le montagne russe, gli autoscontri, l'altalena a bilico, l'ascensore per le stelle, il satellite del parco, il sentiero dei pianeti, il sollevatore delle barche, la chiatta del porto, l'idrovolante, le terme del vulcano, il chiosco delle granite, la mongolfiera, il battello a vapore, il cavallino a molla, la corda delle onde, il flauto di Pan, il tappeto elastico).
- **I boss di Vetrino e Bilancia**: ogni zona finisce con un mito da smontare con un esperimento. Vetrino, il microscopio investigatore, risponde con domande, non con soluzioni. Dall'Officina ci sono anche gli **esperimenti al buio**: la legge si usa senza vedere il meccanismo (la massa nascosta sotto un telo si trova misurando l'accelerazione, l'altezza di partenza nella nebbia dalla velocità in fondo, la scatola coperta di Bilancia con l'altalena a bilico, il pianeta nella nebbia, pesato cronometrando il suo satellite, la corona del re Gerone, d'oro puro o no, pesata in aria e in acqua, e la bottiglia nascosta sotto il telo, misurata con una siringa e un manometro).
- **Aiuti a gradini**: prima della soluzione c'è sempre almeno un passaggio: i suggerimenti scritti per quel passo oppure, nelle domande a scelta, una risposta sbagliata in meno; dove non c'è niente da suggerire, un avviso che non costa stelle. Nella prova d'ingresso il primo tocco su Aiuto avvisa soltanto, e la prova resta valida. **Stelle**: si parte da ★★★ senza aiuti, ★★ se usi un suggerimento, ★ se guardi la soluzione; una sola regola sugli errori: **sbagliare una risposta costa una stella, sperimentare no** (le previsioni sbagliate e i lanci di prova con i cursori sono gratis); un livello superato vale sempre almeno ★. Gli aiuti seguono il passo in cui sei, e ogni passo ha la sua soluzione.
- **La cassetta degli attrezzi** (Studente e Curioso): ogni scheda ha una spiegazione, un disegno da muovere e una domanda; quelle di matematica e dell'Officina anche un piccolo film di un minuto (l'omino costruisce l'idea con le mani, senza una parola). Sono due scaffali. **Matematica**: le potenze di 10, leggere una formula, il quadrato, la radice, Pitagora, π, seno e coseno; una scheda si apre da sola solo nel primo livello in cui l'attrezzo serve per rispondere, mai più di una alla volta, e se compare soltanto in una spiegazione o in un aiuto sotto il testo c'è un bottone per aprirla. **Fisica**, un ripiano per mondo: nell'Officina la forza e l'inerzia, F = m·a, azione e reazione; nel Cielo la gravitazione e le leggi di Keplero; nell'Oceano la pressione, la densità, Archimede e Bernoulli; nel Vulcano la temperatura e i kelvin, il calore, come si propaga, il calore latente, i passaggi di stato, la legge di Boyle, le leggi dei gas, il primo principio, il rendimento e l'entropia; nella Valle la legge di Hooke, periodo e frequenza, l'onda, le onde stazionarie, la velocità del suono, che cosa sente l'orecchio, la risonanza e l'effetto Doppler. Non interrompono mai: si aprono con il bottone sotto i testi che ne parlano.
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
js/tools.js           la cassetta degli attrezzi: le schede di matematica (si aprono quando servono) e di fisica (si offrono)
js/tools-mondi.js     gli attrezzi di fisica dal Cielo in poi, un ripiano per mondo; toolui.js i cursori e i disegni
js/toon.js, toonkit.js  il motore e la regia dei piccoli film; js/films/ i film; toolfilm.js il loro elenco
js/toolanim.js        il riproduttore dei film
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
node tests/tools.mjs URL         # la cassetta degli attrezzi si apre e si supera; ogni film dura un minuto e disegna tutto
node tests/play-all.mjs URL      # un Chrome gioca tutti i livelli nelle tre lenti (serve playwright)
node tests/play-all.mjs URL s g03-1,g03-2   # solo alcuni livelli, in una lente
git diff --name-only main | node tools/da-provare.mjs   # quali livelli toccano i file cambiati
```

Girano anche su GitHub (`.github/workflows/test.yml`): a ogni modifica i controlli veloci guardano tutto, mentre il Chrome gioca
solo i livelli toccati (la zona nuova, i livelli della simulazione cambiata; tutti, se cambia il motore), in italiano e in inglese,
con le lenti in parallelo; la cassetta degli attrezzi si prova solo se cambia. Tutto si prova anche ogni lunedì notte,
o a mano con «Run workflow».

## La voce neurale

La voce che legge può essere quella del dispositivo o una voce neurale [Piper](https://github.com/rhasspy/piper) che gira
dentro il browser (`js/neural.js`, impostazioni in `js/voicepanel.js`). Al primo uso si scaricano, e poi restano nella
cache: il modello della voce da Hugging Face (`rhasspy/piper-voices`, circa 60 MB), onnxruntime-web ed espeak-ng
compilato in WebAssembly da jsDelivr. Il caricatore di espeak in `js/vendor/` viene da `@mintplex-labs/piper-tts-web`
(MIT); espeak-ng è GPL-3 e ogni voce ha la sua licenza, indicata nella scheda del modello su Hugging Face.
Tono, velocità, alti, bassi ed espressività si regolano nelle impostazioni.
