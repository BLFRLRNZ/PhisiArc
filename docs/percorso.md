# Il percorso di PhysiArc

Dodici mondi in fila. Ogni mondo è **un campo della fisica**, e si apre quando hai finito quello prima
(tutti i livelli di tutte le zone con almeno una stella) oppure quando superi la sua **prova d'ingresso**.
L'ordine segue quello della fisica a scuola: prima il moto, poi le forze che lo spiegano, poi i campi e la fisica moderna.
Ogni mondo usa solo idee già viste nei mondi precedenti, e un controllo automatico lo verifica (vedi sotto).

| # | Mondo | Campo | Zone | Difficoltà |
|---|-------|-------|------|------------|
| 1 | Il Laboratorio | Metodo e misure | F01 Il metodo · F02 Grandezze e misure · F03 Grafici e proporzionalità | ● |
| 2 | La Pista | Cinematica | M01 Posizione e velocità (con la velocità relativa) · M04 L'accelerazione · M02 La caduta libera · M03 Vettori e proiettili · M05 Il moto circolare | ●● |
| 3 | L'Officina | Dinamica | D01 Forze e Newton · D02 Attrito e piani inclinati · D03 Lavoro, energia **e potenza** · D04 Quantità di moto e urti · D05 Rotazioni ed equilibrio | ●● |
| 4 | Il Cielo | Gravitazione | G01 Gravitazione universale · G02 Orbite e Keplero · G03 Il sistema solare | ●●● |
| 5 | L'Oceano | I fluidi | FL01 Pressione · FL02 Archimede · FL03 Fluidi in movimento e volo | ●● |
| 6 | Il Vulcano | Termodinamica | T01 Temperatura, calore **e come si propaga** · T02 Stati della materia · T03 I gas · T04 Motori ed entropia | ●●● |
| 7 | La Valle delle Onde | Onde e suono | O01 Molle e oscillazioni · O02 Le onde · O03 Il suono · O04 Risonanza e Doppler | ●●● |
| 8 | Il Prisma | Ottica | OT01 Riflessione · OT02 Rifrazione e lenti · OT03 Colori e spettro · OT04 La luce è un'onda | ●●● |
| 9 | La Centrale | Elettromagnetismo | E01 Cariche e campi · E02 Circuiti · E03 Magneti · E04 Induzione · **E05 Onde elettromagnetiche** | ●●●● |
| 10 | La Frontiera | Relatività | R01–R04, fino ai buchi neri | ●●●●● |
| 11 | L'Abisso Quantico | Quanti e nuclei | Q01–Q04, fino a fissione e fusione | ●●●●● |
| 12 | Pianeta Casa | **Mondo di sintesi** | X01 Da dove viene l'energia (ripasso-ponte) · X02 Clima ed effetto serra · X03 La città sostenibile | ●●●● |

Pianeta Casa non introduce un campo nuovo: è il mondo di **sintesi**, dove si usa tutto quello che si è imparato
(energia, calore, onde, elettricità, nuclei) per capire clima ed energia. Per questo si apre per ultimo e parte da un ripasso-ponte.

## La mappa dei prerequisiti

`js/content/prereq.js` ha due parti, e `node tools/check-prereq.mjs` le controlla tutte e due.

- `PREREQ` dice, per ogni zona (anche quelle ancora da scrivere), quali idee **usa** e quali **introduce**.
  Il controllo percorre i mondi nell'ordine del gioco e segnala ogni idea usata prima di essere introdotta.
- `IDEE` elenca le parole che rivelano un'idea nei testi («m/s» per i metri al secondo, «media», «forza»…) e il livello che la spiega.
  Il controllo legge i testi di ogni livello, lente per lente: se un'idea compare prima del suo livello, o in una lente che non deve
  incontrarla (l'Esploratore non vede formule), lo segnala. Un anticipo voluto si dichiara in `ANTICIPI`, con il motivo in un commento.

Va lanciato ogni volta che si aggiunge o si sposta una zona, o si cambia un testo: deve rispondere "Nessuna idea usata prima di essere spiegata".
Con `--tutti` elenca anche gli anticipi dichiarati.

## I codici delle zone

Nella tabella qui sopra le zone hanno il loro nome interno (M04 è l'accelerazione, anche se è la seconda zona della Pista): è il nome dei file
e degli id dei livelli (`m04-1`), a cui sono legati i salvataggi, e per questo non cambia mai. Sulla pagina del mondo il giocatore vede invece
un codice in ordine (M01, M02… M05), calcolato dalla posizione della zona.

## La prova d'ingresso

Chi conosce già un mondo può saltarlo: in fondo alla pagina del mondo c'è **Fai la prova d'ingresso**.
La prova mette in fila le domande dei ripassi di tutte le zone del mondo. Con al massimo 2 errori e senza aiuti
il mondo conta come superato (`S.skip`) e si apre quello dopo; i livelli restano lì da giocare.
Il tasto Aiuto resta acceso, ma a ogni passo il primo tocco avvisa soltanto: usare un aiuto deve essere una scelta.

## Un mondo in costruzione

Un mondo si può aprire prima di essere finito: le zone pronte vanno in `zones`, quelle ancora da scrivere restano in `soon`
e il mondo porta `building: true`. Finché è in costruzione non conta come finito (niente grado, niente prova d'ingresso,
il mondo dopo non si apre), e alla fine dell'ultima zona pronta il gioco dice che le altre arrivano presto.
L'Officina, il Cielo, l'Oceano e il Vulcano sono stati costruiti così, una zona alla volta; oggi sono completi, e il prossimo mondo da costruire è la Valle delle Onde.

## Graduale dentro ogni mondo

- Le zone di un mondo vanno dalla più intuitiva alla più formale (es. Pista: velocità → accelerazione → caduta → vettori e proiettili → moto circolare).
- Ogni zona si apre quando è finita la precedente; ogni livello quando è finito il precedente.
- La difficoltà sulla mappa (1–5 pallini) è decisa sul contenuto del mondo, non sul suo numero.

## Il ritmo delle zone

Nei primi due mondi le zone seguono lo schema che insegna come si gioca: **lezione → lezione → prevedi → costruisci → ripasso → boss**.
Dal terzo mondo il ritmo cambia, perché lo schema fisso stanca:

- alcune zone **partono da un esperimento** (costruisci prima della lezione: prima provi, poi capisci perché funziona);
- alcune **partono da un mistero** (un prevedi in apertura, la spiegazione dopo);
- le zone brevi possono avere 4 livelli invece di 6, quelle ricche 7 o più (Vettori e proiettili ne ha 9);
- il boss alterna **il mito da smontare**, **la sfida a tempo** e **l'esperimento al buio** (si deduce la legge senza vedere il meccanismo).

## Regole contro la ripetizione

1. **Un argomento vive in un solo mondo.** Il pendolo è del Laboratorio; la Valle parte dalle molle, non dal pendolo.
   I proiettili sono della Pista; l'Officina parla di forze, non di nuovo di traiettorie.
2. **Ogni zona porta qualcosa di nuovo da toccare**: una simulazione nuova o un modo nuovo di usarla
   (il laboratorio dei grafici, la barca sul fiume, la giostra, i carrelli e le rampe, le vasche, i circuiti…).
3. **Ogni mondo ha la sua mascotte**, e i boss sono di Vetrino, il cacciatore di miti; qualche esperimento al buio lo presenta Bilancia.
4. **I ripassi richiamano un'idea di un mondo precedente** solo come ponte (es. il moto circolare richiama la proporzionalità inversa del Laboratorio),
   mai rifacendo lo stesso esercizio.
