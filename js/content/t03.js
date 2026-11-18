// T03 · I gas. Simulazione: i gas (gas.js), in sei modi: le particelle in una scatola chiusa, la siringa chiusa con il
// manometro, il palloncino caldo e freddo con il grafico volume–temperatura, la mongolfiera, la bombola al caldo, la
// bottiglia sotto il telo.
// La zona parte dalla pressione come colpi di particelle sulle pareti, scopre la legge di Boyle con la siringa, quella di
// Charles con il palloncino (e lo zero assoluto in fondo alla retta), costruisce la mongolfiera del parco, arriva a
// Gay-Lussac e ai gas perfetti con la bombola al sole, e finisce con Bilancia che nasconde una bottiglia sotto il telo.
import { T } from '../util.js';

export default {
  id: 'T03',
  title: 'I gas',
  levels: [
    {
      id: 't03-1', kind: 'lezione', title: 'Un gas di particelle',
      sim: 'gas', params: { mode: 'scatola', n: 1, t: 20 }, controls: ['n', 't'],
      intro: T(
        'L’aria intorno a noi è un gas: tantissime particelle piccolissime che volano in tutte le direzioni e sbattono dappertutto. Chiudile in una scatola: ogni colpo sulle pareti è una piccola spinta, e tutte insieme fanno la pressione. Prova!',
        'Un <b>gas</b> è fatto di particelle che volano libere e veloci, lontane una dall’altra. Chiuse in un contenitore, sbattono di continuo contro le pareti: la somma di tutti questi colpi è la <b>pressione</b> del gas. Con più gas, o con particelle più veloci, cioè più calde, la pressione sale.',
        'Il modello del gas: miliardi di particelle che volano in linea retta e rimbalzano sulle pareti. Ogni urto è una piccola spinta; miliardi di urti al secondo fanno una spinta costante su ogni metro quadrato di parete, la <b>pressione</b>. La temperatura in kelvin misura l’energia di movimento media delle particelle.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova più gas, e poi un gas più caldo.', 'Prova a cambiare la quantità di gas e la temperatura.'),
          need: [
            { when: 'n >= 3', try: { n: 3 }, msg: T('Prova con più gas: tre pompate.', 'Manca una prova con almeno 3 pompate.') },
            { when: 't >= 200', try: { t: 200 }, msg: T('Ora scalda il gas: 200 gradi o più.', 'Manca una prova a 200 °C o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Da dove viene la pressione di un gas?', 'Da dove viene la pressione di un gas chiuso?', 'Che cosa produce, a livello delle particelle, la pressione di un gas?'),
          options: [T('dai colpi delle particelle sulle pareti', 'dagli urti delle particelle contro le pareti', 'gli urti di miliardi di particelle sulle pareti'), T('dal peso del gas', 'dal peso del gas, che si appoggia e preme sul fondo', 'il peso delle particelle, appoggiate sul fondo del contenitore'), T('dalla scatola, che stringe', 'dalle pareti, che spingono sul gas', 'le forze che attirano le particelle una verso l’altra')],
          answer: 0,
          explain: T('Giusto: ogni particella che sbatte dà una piccola spinta, e tutte insieme fanno la pressione.', 'Esatto: urti continui, su tutte le pareti, anche sul soffitto.', 'Esatto: è una spinta media, costante solo perché gli urti sono tantissimi.'),
        },
        {
          kind: 'q',
          text: T('Se metti più gas nella scatola, la pressione…', 'Raddoppi il gas nella scatola, alla stessa temperatura. La pressione…', 'A temperatura costante raddoppi le particelle nella scatola. La pressione…'),
          options: [T('sale', 'raddoppia', 'raddoppia: il doppio degli urti'), T('scende, perché c’è meno posto', 'resta uguale', 'resta uguale: la scatola è sempre quella'), T('resta proprio uguale', 'si dimezza', 'cresce, ma solo di poco')],
          answer: 0,
          explain: T('Giusto: più particelle, più colpi sulle pareti.', 'Esatto: il doppio delle particelle dà il doppio degli urti.', 'Esatto: la pressione è proporzionale al numero di particelle.'),
        },
        {
          kind: 'q',
          text: T('Se scaldi il gas, le sue particelle…', 'Perché scaldando un gas chiuso la sua pressione sale?', 'Perché la pressione di un gas chiuso cresce con la temperatura?'),
          options: [T('vanno più veloci', 'urti più veloci e più forti', 'urti più frequenti e più forti'), T('diventano più grandi', 'le particelle diventano più grandi', 'le particelle si dilatano e occupano più posto'), T('si fermano tutte quante', 'il gas caldo diventa più pesante', 'il calore preme da solo sulle pareti, insieme al gas')],
          answer: 0,
          explain: T('Giusto: più caldo vuol dire particelle più veloci, che sbattono più forte.', 'Esatto: urti più forti e più frequenti, quindi più pressione.', 'Esatto: due effetti insieme, più urti al secondo e ciascuno più forte.'),
        },
      ],
      hints: [T('Guarda i colpi sulle pareti: più gas o più caldo, più colpi.', 'Più particelle o particelle più veloci: più urti, più pressione.', 'La pressione cresce con il numero di particelle e con la temperatura in kelvin.')],
      solution: T(
        'La pressione sono i colpi delle particelle: cresce con più gas e con più caldo.',
        'Più gas o più temperatura: più urti sulle pareti, più pressione.',
        'Pressione proporzionale al numero di particelle e alla temperatura assoluta.'),
    },
    {
      id: 't03-2', kind: 'prevedi', title: 'Schiacciare l’aria',
      sim: 'gas', params: { mode: 'siringa', V: 50 }, controls: [],
      intro: T(
        'Chiudi la punta di una siringa piena d’aria e spingi lo stantuffo. L’aria si lascia schiacciare, ma spinge sempre più forte. Quanto più forte? Prima indovina, poi guarda il manometro.',
        'Una siringa contiene 100 mL d’aria a 1 bar, con la punta chiusa da un manometro. Spingendo lo stantuffo, piano e senza scaldare, il volume diminuisce. Che cosa fa la pressione? Prevedi, poi guarda.',
        '100 mL d’aria a 1 bar in una siringa chiusa, compressi lentamente, a temperatura costante. Le particelle sono sempre le stesse, ma hanno meno spazio. Prevedi come cambia la pressione, poi verifica con il manometro.'),
      steps: [
        {
          kind: 'q', predict: [{ V: 50 }],
          text: T('Spingi fino a metà: 50 mL invece di 100. La pressione…', 'Da 100 a 50 mL: la pressione, che era 1 bar, diventa…', 'Volume dimezzato, da 100 a 50 mL: la pressione diventa…'),
          options: [T('raddoppia', '2 bar', '2 bar'), T('resta uguale', '1,5 bar', '4 bar: va col quadrato'), T('si dimezza, diventa la metà', '0,5 bar', '1,5 bar')],
          answer: 0,
          explain: T('Giusto: metà spazio, doppia pressione! Le particelle sbattono il doppio delle volte.', 'Esatto: 2 bar. Nello spazio dimezzato gli urti raddoppiano.', 'Esatto: 2 bar. Densità doppia, urti doppi.'),
          solution: T('Raddoppia.', '2 bar.'),
        },
        {
          kind: 'q', predict: [{ V: 25 }],
          text: T('E se spingi ancora, fino a 25 mL?', 'Ora fino a 25 mL, un quarto del volume iniziale. La pressione…', 'Da 100 a 25 mL: quanto vale la pressione?'),
          options: [T('diventa 4 volte tanto', '4 bar', '4 bar'), T('3 volte tanto', '3 bar', '16 bar'), T('torna come all’inizio', '2 bar, come a metà corsa', '2,5 bar')],
          answer: 0,
          explain: T('Giusto: un quarto dello spazio, 4 volte la pressione.', 'Esatto: 4 bar. Volume diviso per 4, pressione per 4.', 'Esatto: 4 bar; la pressione va come l’inverso del volume.'),
          solution: T('4 volte tanto.', '4 bar.'),
        },
        {
          kind: 'q',
          text: T('Allora pressione e volume…', 'Che legame c’è fra pressione e volume, a temperatura costante?', 'Che cosa resta costante, in queste prove?'),
          options: [T('se uno si dimezza, l’altro raddoppia', 'sono inversamente proporzionali', 'il prodotto di pressione e volume'), T('crescono insieme', 'sono direttamente proporzionali', 'la somma di pressione e volume'), T('non c’entrano niente', 'nessuno: dipende dalla siringa', 'il rapporto fra pressione e volume')],
          answer: 0,
          explain: T('Giusto: metà volume, doppia pressione; un quarto del volume, quattro volte la pressione.', 'Esatto: se il volume diventa 4 volte più piccolo, la pressione diventa 4 volte più grande.', 'Esatto: 1 × 100 = 2 × 50 = 4 × 25 = 100 bar·mL.'),
        },
      ],
      hints: [T('Metà spazio, doppia pressione.', 'Volume diviso per due, pressione per due.', 'Pressione e volume sono inversamente proporzionali.')],
    },
    {
      id: 't03-3', kind: 'lezione', title: 'La legge di Boyle',
      sim: 'gas', params: { mode: 'siringa', V: 40 }, controls: ['V'],
      intro: T(
        'Quando schiacci un gas senza scaldarlo succede sempre la stessa cosa: metà spazio, doppia pressione; un terzo dello spazio, tripla pressione. Vale anche al contrario: in fondo al mare l’acqua preme tanto e le bolle d’aria sono piccole, ma salendo si gonfiano.',
        'A temperatura costante, pressione e volume di un gas sono inversamente proporzionali: <b>P·V = costante</b>. È la <b>legge di Boyle</b> (1662). Per questo le bolle che salgono dal fondo del mare si gonfiano: l’acqua sopra di loro preme sempre meno.',
        'Robert Boyle, 1662: a temperatura costante il prodotto di pressione e volume di un gas resta lo stesso. Con le particelle si capisce subito: in metà volume la densità raddoppia, e con lei gli urti sulle pareti. [[P₁ · V₁ = P₂ · V₂]]'),
      steps: [
        {
          kind: 'free',
          text: T('Schiaccia l’aria tanto e poco.', 'Prova volumi diversi e guarda P·V.'),
          need: [
            { when: 'V <= 25', try: { V: 25 }, msg: T('Schiaccia forte: 25 mL o meno.', 'Manca una prova a 25 mL o meno.') },
            { when: 'V >= 75', try: { V: 80 }, msg: T('Ora schiaccia poco: 75 mL o più.', 'Manca una prova a 75 mL o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Una bolla d’aria sale dal fondo del mare. Salendo…', 'Perché una bolla d’aria, salendo dal fondo del mare, si gonfia?', 'Una bolla parte da 10 m di profondità, dove la pressione è 2 bar. In superficie, a 1 bar, il suo volume…'),
          options: [T('si gonfia', 'sopra di lei c’è sempre meno acqua che preme', 'raddoppia'), T('si sgonfia', 'l’acqua in superficie è più calda e la scalda', 'si dimezza'), T('resta della stessa grandezza', 'l’aria è più leggera dell’acqua', 'resta uguale: l’aria è sempre quella')],
          answer: 0,
          explain: T('Giusto: più su l’acqua preme meno, e la bolla si allarga.', 'Esatto: la pressione scende, e il volume cresce.', 'Esatto: pressione dimezzata, volume doppio.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La pressione nella siringa.'),
          vals: { V: [[50, 25, 20], [40, 80]] }, calc: '100 / V', unit: 'bar', tol: 0.05,
          ask: T(null,
            'Nella siringa ci sono 100 mL d’aria a 1 bar. La schiacci fino a <b>{V} mL</b>, senza scaldare: quanti bar segna il manometro?',
            '100 mL d’aria a 1 bar, compressi a temperatura costante fino a <b>{V} mL</b>. Che pressione raggiungono, in bar? [[P₁ · V₁ = P₂ · V₂]]'),
          explain: T(null, 'Esatto: 1 × 100 = P × {V}, quindi P = {ans:2} bar.', 'Esatto: {ans:2} bar.'),
        },
        {
          kind: 'q', only: ['e'],
          text: T('Perché l’aria si schiaccia facilmente, e l’acqua no?'),
          options: [T('fra le particelle dell’aria c’è tanto spazio'), T('l’acqua è più pesante dell’aria'), T('l’aria è più fredda')],
          answer: 0,
          explain: T('Giusto: nel gas le particelle sono lontane, nel liquido sono già vicinissime.'),
        },
        {
          kind: 'q', only: ['s', 'c'],
          text: T(null, 'Perché un sub non deve mai trattenere il fiato mentre risale?', 'Un sub a 20 m di profondità (3 bar) riempie i polmoni con 6 L d’aria. Se risale trattenendo il fiato, in superficie quell’aria occuperebbe…'),
          options: [T(null, 'l’aria nei polmoni si dilata', '18 L: tre volte tanto'), T(null, 'salendo l’aria diventa più fredda', '6 L: l’aria è sempre quella'), T(null, 'in superficie c’è meno ossigeno', '2 L: un terzo')],
          answer: 0,
          explain: T(null, 'Esatto: per questo si risale lentamente, respirando normalmente.', 'Esatto: 3 × 6 = 1 × 18. Per questo si risale espirando.'),
        },
      ],
      hints: [T('Metà spazio, doppia pressione.', 'P·V resta 100 bar·mL: P = 100 / V.', 'Pressione per volume resta uguale, a temperatura costante.')],
      solution: T(
        'Schiacciando l’aria la pressione sale: metà spazio, doppia pressione.',
        'P = 100 / V: a 25 mL, 4 bar; a 80 mL, 1,25 bar.',
        'Legge di Boyle: P·V costante, a temperatura costante.'),
    },
    {
      id: 't03-4', kind: 'lezione', title: 'Il palloncino nel freezer',
      sim: 'gas', params: { mode: 'palloncino', t: -50 }, controls: ['t'], labels: { t: { min: -100, max: 100, step: 10 } },
      intro: T(
        'Gonfia un palloncino e mettilo nel freezer: dopo un po’ è più piccolo! Al caldo, invece, si gonfia. L’aria dentro è sempre la stessa: cambia solo quanto si agitano le sue particelle. Prova!',
        'A pressione costante, un gas si dilata quando lo scaldi e si contrae quando lo raffreddi. Il volume è proporzionale alla temperatura in kelvin: <b>V/T = costante</b>, la <b>legge di Charles</b>. Un palloncino da 3 L a 20 °C, cioè 293 K, nel freezer a −30 °C diventa di circa 2,5 L.',
        'Jacques Charles, 1787: a pressione costante il volume di un gas cresce in linea retta con la temperatura. Prolungando la retta verso il freddo, il volume si annulla a −273,15 °C: lo zero assoluto, l’origine della scala Kelvin. [[V₁ / T₁ = V₂ / T₂, con T in kelvin]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il palloncino al freddo e al caldo.', 'Prova a −50 °C o meno, e a 60 °C o più.'),
          need: [
            { when: 't <= -50', try: { t: -50 }, msg: T('Prova il freddo: −50 gradi o meno.', 'Manca una prova a −50 °C o meno.') },
            { when: 't >= 60', try: { t: 60 }, msg: T('Ora il caldo: 60 gradi o più.', 'Manca una prova a 60 °C o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Nel freezer il palloncino…', 'Perché al freddo il palloncino si sgonfia, anche se non perde aria?', 'Il palloncino passa da 20 °C a −30 °C. Il suo volume…'),
          options: [T('diventa più piccolo', 'le particelle rallentano e spingono meno sulla gomma', 'cala di circa un sesto: 243 K contro 293 K'), T('diventa un po’ più grande', 'l’aria fredda esce attraverso la gomma', 'si dimezza'), T('resta uguale', 'la gomma fredda si restringe come un elastico e schiaccia l’aria', 'diventa negativo, come la temperatura in °C')],
          answer: 0,
          explain: T('Giusto: al freddo l’aria si stringe, e il palloncino si sgonfia un po’.', 'Esatto: particelle più lente urtano meno forte, e la gomma le stringe in meno spazio.', 'Esatto: 3 L × 243 / 293 fa circa 2,5 L. In gradi Celsius non funziona: servono i kelvin.'),
        },
        {
          kind: 'q',
          text: T('Prolunghi la retta del grafico verso il freddo. Dove arriva a zero?', 'Dove arriva a volume zero la retta del grafico, prolungata?', 'Che cosa dice la retta volume–temperatura, prolungata fino a volume zero?'),
          options: [T('a −273 gradi', 'a −273 °C, lo zero assoluto', 'che sotto −273,15 °C non si può scendere'), T('a 0 gradi', 'a 0 °C', 'che a 0 °C ogni gas diventa ghiaccio'), T('non arriva mai a zero', 'a −100 °C', 'che i gas spariscono sotto lo zero')],
          answer: 0,
          explain: T('Giusto: −273 gradi è lo zero assoluto, il freddo più freddo che ci sia.', 'Esatto: è il punto da cui partono i kelvin, 0 K.', 'Esatto: lì le particelle sarebbero ferme. Per questo nelle leggi dei gas la temperatura va in kelvin.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'Il volume del palloncino.'),
          vals: { t: [[50, 80], [-30, -60]] }, derive: { K: 't + 273' }, calc: '3 * (t + 273) / 293', unit: 'L', tol: 0.05,
          ask: T(null,
            'Un palloncino da 3 L a 20 °C (293 K) viene portato a <b>{t} °C</b>, alla stessa pressione. Quanti litri diventa?',
            'Palloncino: 3 L a 293 K. Lo porti a <b>{t} °C</b> a pressione costante: che volume ha, in litri? [[V₂ = V₁ · T₂ / T₁, con T in kelvin]]'),
          explain: T(null, 'Esatto: {t} °C sono {K} K, e V = 3 × {K} / 293 = {ans:2} L.', 'Esatto: {ans:2} L.'),
        },
        {
          kind: 'q',
          text: T('Perché l’aria calda va verso l’alto?', 'Perché l’aria calda sale sopra quella fredda?', 'Un metro cubo d’aria a 20 °C ha massa 1,2 kg. A 90 °C, alla stessa pressione, un metro cubo d’aria ha massa…'),
          options: [T('si allarga e diventa più leggera', 'si dilata e diventa meno densa', 'circa 0,97 kg: 1,2 × 293 / 363'), T('il calore tira verso il cielo', 'il calore spinge l’aria verso il cielo', '1,2 kg: la massa non cambia'), T('il Sole la attira verso di sé', 'le particelle calde pesano meno', 'circa 0,27 kg: 1,2 × 20 / 90')],
          answer: 0,
          explain: T('Giusto: l’aria calda si allarga, è più leggera e galleggia sopra quella fredda.', 'Esatto: meno densa, galleggia sull’aria fredda come il legno sull’acqua.', 'Esatto: stesso volume, temperatura più alta, meno particelle dentro: densità più bassa.'),
        },
      ],
      hints: [T('Al freddo il palloncino si sgonfia, al caldo si gonfia.', 'V/T resta costante, con T in kelvin.', 'Il volume va in linea retta con la temperatura, e si annulla a −273 °C.')],
      solution: T(
        'Più freddo, più piccolo; più caldo, più grande.',
        'V = 3 × T / 293, con T in kelvin: a −30 °C circa 2,5 L.',
        'Volume proporzionale alla temperatura assoluta: la retta passa per −273,15 °C.'),
    },
    {
      id: 't03-5', kind: 'costruisci', title: 'La mongolfiera',
      sim: 'gas', params: { mode: 'mongolfiera', t: 50, m: 500 }, controls: ['t'], labels: { t: { min: 20, max: 120, step: 1 } },
      intro: T(
        'Nel parco arriva una mongolfiera! Un bruciatore scalda l’aria dentro il pallone: l’aria calda è più leggera di quella fuori, e il pallone sale. Ma attento: troppo calda vola via, troppo fredda resta a terra. Falla galleggiare a mezz’aria!',
        'Costruisci la mongolfiera del parco: un pallone da 2800 m³, aperto in basso, nell’aria a 20 °C. Scaldata, l’aria dentro si dilata ed esce in parte dalla bocca: nel pallone restano meno particelle, e il pallone pesa meno dell’aria fredda che sposta. Trova la temperatura che sostiene esattamente il carico.',
        'La mongolfiera vola con Archimede e Charles insieme. Il pallone, aperto in basso, resta alla pressione dell’aria fuori; scaldando, la densità dell’aria dentro scende come l’inverso della temperatura in kelvin. La spinta netta è il peso dell’aria fredda spostata meno quello dell’aria calda dentro. [[m = ρ · V · (1 − 293 / T), con ρ = 1,2 kg/m³ e V = 2800 m³]]'),
      piece: { id: 'mongolfiera', name: 'La mongolfiera', desc: 'L’aria scaldata si dilata, diventa meno densa e tiene il pallone a mezz’aria.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli quanto scaldare l’aria nel pallone, poi lancia.', 'Regola la temperatura dell’aria nel pallone, poi lancia: deve galleggiare a mezz’aria.'),
          vals: { e: { m: [[500], [700]] }, s: { m: [[450, 550], [650, 750]] } },
          set: { m: 'm' },
          ask: T(
            'Il pallone, il cesto e le persone pesano <b>{m} kg</b>. A quanti gradi scaldi l’aria dentro?',
            'Da sollevare: <b>{m} kg</b> fra pallone, cesto e persone. A che temperatura va l’aria dentro?',
            'Carico totale <b>{m} kg</b>: quale temperatura dell’aria interna lo tiene sospeso?'),
          measure: 't', goal: '293.15 / (1 - m / 3360) - 273.15', tol: 3,
          ok: T('Perfetta: galleggia a mezz’aria!', 'Esatto: la spinta sostiene il carico.'),
          high: T('Troppo calda: la mongolfiera vola via. Scalda meno.', 'Troppo calda: la spinta supera il carico. Abbassa la temperatura.'),
          low: T('Troppo fredda: resta a terra. Scalda di più!', 'Troppo fredda: la spinta non basta. Alza la temperatura.'),
          solve: { t: 'Math.round(293.15 / (1 - m / 3360) - 273.15)' },
        },
        {
          kind: 'q',
          text: T('Perché la mongolfiera sale quando scaldi l’aria?', 'Perché l’aria calda dentro il pallone lo fa salire?', 'Perché d’inverno una mongolfiera può sollevare più carico che d’estate?'),
          options: [T('l’aria calda è più leggera di quella fuori', 'è meno densa dell’aria fuori: Archimede la spinge su', 'l’aria fuori, fredda, è più densa: cresce la differenza'), T('il fuoco la spinge su', 'il bruciatore spinge il pallone verso l’alto, come un razzo', 'd’inverno il bruciatore scalda di più'), T('il fumo la tira su verso il cielo', 'l’aria calda pesa più di quella fredda e fa da contrappeso', 'l’aria fredda spinge il pallone da sotto, come il vento')],
          answer: 0,
          explain: T('Giusto: l’aria calda è più leggera, e galleggia nell’aria fredda come una barca nell’acqua.', 'Esatto: la spinta di Archimede vale nell’aria come nell’acqua.', 'Esatto: la spinta dipende dalla differenza di densità fra fuori e dentro, e con il freddo cresce.'),
        },
      ],
      hints: [T('Più peso da sollevare, più caldo serve: fra 70 e 100 gradi.', 'Spinta = peso dell’aria fredda spostata − peso dell’aria calda dentro.', 'Spinta netta: 3360 kg × (1 − 293 / T), con T in kelvin.')],
      solution: T('Circa 71 gradi per 500 kg, circa 97 gradi per 700 kg.', 'T = 293 / (1 − m / 3360) kelvin: per 550 kg circa 80 °C.', 'Per 650 kg servono circa 363 K, cioè circa 90 °C.'),
    },
    {
      id: 't03-6', kind: 'lezione', title: 'La bombola al sole',
      sim: 'gas', params: { mode: 'bombola', t: 60 }, controls: ['t'], labels: { t: { min: -20, max: 300, step: 10 } },
      intro: T(
        'Su ogni bomboletta e su ogni bombola c’è scritto: non lasciare al sole, non avvicinare al fuoco. Perché? Il gas chiuso dentro non può allargarsi: se lo scaldi, le sue particelle sbattono più forte e la pressione sale. Prova a scaldare una bombola d’aria da sub.',
        'Se il volume non può cambiare, scaldando un gas cresce la pressione: <b>P/T = costante</b>, con T in kelvin. È la <b>legge di Gay-Lussac</b>. Una bombola da sub a 200 bar a 20 °C, lasciata in auto al sole a 60 °C, arriva a circa 227 bar.',
        'Le tre leggi dei gas sono un’unica legge, l’equazione dei <b>gas perfetti</b>, con n la quantità di gas in moli e R una costante universale. A volume fisso resta costante P/T (Gay-Lussac), a temperatura fissa P·V (Boyle), a pressione fissa V/T (Charles). [[P · V = n · R · T, con R = 8,31 J/(mol·K)]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la bombola al freddo e al caldo.', 'Prova la bombola a 0 °C o meno, e a 150 °C o più.'),
          need: [
            { when: 't <= 0', try: { t: -10 }, msg: T('Prova il freddo: zero gradi o meno.', 'Manca una prova a 0 °C o meno.') },
            { when: 't >= 150', try: { t: 200 }, msg: T('Ora il caldo: 150 gradi o più.', 'Manca una prova a 150 °C o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Scaldi la bombola chiusa. La pressione dentro…', 'Perché scaldando una bombola chiusa la pressione sale?', 'La bombola passa da 20 °C a 313 °C. La pressione…'),
          options: [T('sale', 'urti più forti e frequenti', 'raddoppia: 586 K è il doppio di 293 K'), T('scende', 'il calore entra e occupa posto nella bombola', 'diventa 15 volte tanto: 313 / 20'), T('resta uguale', 'il metallo caldo spinge sul gas', 'resta uguale: il volume è fisso')],
          answer: 0,
          explain: T('Giusto: più caldo, particelle più veloci, più colpi sulle pareti.', 'Esatto: il volume è fisso, quindi a crescere è la pressione.', 'Esatto: P/T costante in kelvin, e 586 K è il doppio di 293 K.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 2, text: T(null, 'La bombola al sole.'),
          vals: { t: [[40, 60], [80, -20]] }, derive: { K: 't + 273' }, calc: '200 * (t + 273) / 293', unit: 'bar', tol: 1,
          ask: T(null,
            'Una bombola da sub è a <b>200 bar</b> a 20 °C (293 K). Se la porti a <b>{t} °C</b>, che pressione raggiunge?',
            'Bombola: 200 bar a 293 K, volume fisso. A <b>{t} °C</b>, quanti bar? [[P₂ = P₁ · T₂ / T₁, con T in kelvin]]'),
          explain: T(null, 'Esatto: {t} °C sono {K} K, e P = 200 × {K} / 293 = {ans:0} bar.', 'Esatto: circa {ans:0} bar.'),
        },
        {
          kind: 'q',
          text: T('Perché sulle bombolette c’è scritto «non lasciare al sole»?', 'Perché le gomme dell’auto, dopo un lungo viaggio, hanno una pressione più alta?', 'Una bombola contiene il doppio del gas di un’altra uguale, alla stessa temperatura. La sua pressione…'),
          options: [T('al caldo la pressione sale troppo', 'si scaldano, e l’aria dentro preme di più', 'è il doppio: P va come n'), T('il sole scolora l’etichetta', 'durante il viaggio entra altra aria', 'è la stessa: conta solo la temperatura'), T('al sole il gas diventa velenoso', 'le gomme si riempiono di polvere', 'è la metà: il gas è più schiacciato')],
          answer: 0,
          explain: T('Giusto: il gas chiuso, scaldato, spinge sempre di più sulle pareti, e la bombola può scoppiare.', 'Esatto: il rotolamento scalda le gomme, e il loro volume resta quasi uguale.', 'Esatto: con volume e temperatura fissi, la pressione va come la quantità di gas.'),
        },
      ],
      hints: [T('Gas chiuso e scaldato: più pressione.', 'P/T resta costante, con T in kelvin.', 'Gas perfetti: a volume fisso, la pressione cresce come la temperatura in kelvin.')],
      solution: T(
        'Più caldo, più pressione: al sole una bombola può diventare pericolosa.',
        'P = 200 × T / 293: a 60 °C circa 227 bar.',
        'A volume fisso P/T è costante: 200 bar a 293 K diventano 227 bar a 333 K.'),
    },
    {
      id: 't03-7', kind: 'ripasso', title: 'Ripasso dei gas',
      intro: T('Ripassiamo: siringhe, palloncini e mongolfiere!', 'Ripasso: le leggi dei gas e la temperatura in kelvin.', 'Ripasso: dalle particelle che urtano all’equazione dei gas perfetti.'),
      steps: [
        {
          kind: 'q',
          text: T('Da dove viene la pressione dell’aria in una gomma?', 'Da che cosa dipende la pressione di un gas chiuso?', 'A pressione costante raddoppi la temperatura in kelvin di un gas. Il suo volume…'),
          options: [T('dai colpi delle particelle', 'dal numero di particelle e dalla loro velocità', 'raddoppia'), T('dal peso della gomma', 'dal colore e dall’odore del gas', 'si dimezza'), T('dal vento che entra nella gomma', 'soltanto dalla forma del contenitore', 'resta uguale')],
          answer: 0,
          explain: T('Giusto: miliardi di colpi sulle pareti.', 'Esatto: più particelle o più veloci, più pressione.', 'Esatto: è la legge di Charles.'),
        },
        {
          kind: 'q',
          text: T('Schiacci l’aria di una siringa chiusa a metà spazio. La pressione…', 'Una bolla d’aria di 2 mL a 3 bar sale fino a 1 bar. Che volume ha?', 'L’aria di una bombola da 10 L a 200 bar, portata a 1 bar alla stessa temperatura, che volume occupa?'),
          options: [T('raddoppia', '6 mL', '2000 L'), T('si dimezza', '2 mL', '200 L'), T('resta uguale', '0,7 mL', '20 L')],
          answer: 0,
          explain: T('Giusto: metà spazio, doppia pressione.', 'Esatto: 3 × 2 = 1 × 6.', 'Esatto: 200 × 10 = 1 × 2000 L.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Schiacciare l’aria.'),
          vals: { V: [60, 80, 100] }, calc: 'V / 20', unit: 'bar', tol: 0.05,
          ask: T(null,
            'Nella siringa ci sono <b>{V} mL</b> d’aria a 1 bar. La schiacci fino a 20 mL, senza scaldare: quanti bar segna il manometro?',
            '<b>{V} mL</b> d’aria a 1 bar compressi fino a 20 mL, a temperatura costante: che pressione raggiungono? [[P₂ = P₁ · V₁ / V₂]]'),
          explain: T(null, 'Esatto: 1 × {V} = P × 20, quindi P = {ans:1} bar.', 'Esatto: {ans:1} bar.'),
        },
        {
          kind: 'q',
          text: T('La mongolfiera sale perché l’aria dentro è…', 'Perché nelle leggi dei gas la temperatura va in kelvin?', 'Da 27 °C a 327 °C, a volume fisso, la pressione di un gas…'),
          options: [T('più calda e più leggera', 'il volume e la pressione sono proporzionali alla temperatura assoluta', 'raddoppia: da 300 a 600 K'), T('più fredda e più pesante', 'i kelvin sono più precisi dei gradi', 'cresce di 12 volte: 327 / 27'), T('piena di fumo', 'per abitudine degli scienziati', 'resta uguale')],
          answer: 0,
          explain: T('Giusto: più leggera dell’aria fuori, galleggia.', 'Esatto: in gradi Celsius le proporzioni non tornano.', 'Esatto: 600 K è il doppio di 300 K.'),
        },
        {
          kind: 'q',
          text: T('Un palloncino nel freezer…', 'A volume fisso, scaldando un gas, che cosa cresce?', 'Che cosa resta costante in un gas chiuso in una siringa, se lo comprimi lentamente senza scaldarlo?'),
          options: [T('si sgonfia un po’', 'la pressione', 'il prodotto P·V'), T('si gonfia', 'la massa del gas', 'il rapporto V/T'), T('scoppia per il freddo', 'il volume', 'la pressione')],
          answer: 0,
          explain: T('Giusto: al freddo l’aria si stringe.', 'Esatto: è la legge di Gay-Lussac.', 'Esatto: è la legge di Boyle.'),
        },
      ],
    },
    {
      id: 't03-8', kind: 'boss', who: 'bilancia', title: 'La bottiglia sotto il telo', win: T('Esperimento riuscito!'),
      sim: 'gas', params: { mode: 'buio', s: 100 }, controls: ['s'],
      intro: T(
        'Sono Bilancia. Sotto il telo c’è una bottiglia piena d’aria, ma non puoi guardarla. Hai una siringa piena d’aria, collegata alla bottiglia, e un manometro. Spingi l’aria dentro e scopri quanto è grande la bottiglia. Esperimento al buio!',
        'Sono Bilancia. Esperimento al buio: sotto il telo c’è una bottiglia d’aria a 1 bar, di volume sconosciuto. Puoi solo spingerci dentro l’aria di una siringa, da 50 a 200 mL a 1 bar, e leggere il manometro. Con la legge di Boyle, scopri il volume della bottiglia.',
        'Sono Bilancia. Un volume che non si vede si misura con la pressione: è il principio del picnometro a gas. Sotto il telo c’è una bottiglia d’aria a 1 bar; spingendoci dentro s mL d’aria, tutta l’aria, bottiglia più siringa, finisce nel volume V della bottiglia. [[1 · (V + s) = P · V]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una siringa piccola e una grande.', 'Spingi dentro l’aria di una siringa piccola e di una grande, e leggi il manometro.'),
          need: [
            { when: 's <= 50', try: { s: 50 }, msg: T('Prova la siringa piccola: 50 mL.', 'Manca una prova con 50 mL.') },
            { when: 's >= 200', try: { s: 200 }, msg: T('Ora la siringa grande: 200 mL.', 'Manca una prova con 200 mL.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la siringa grande, la lancetta sale…', 'Con 200 mL invece di 50, la pressione nella bottiglia sale…', 'Con 50 mL la pressione sale di 0,125 bar, con 200 mL di 0,5 bar. Che cosa vuol dire?'),
          options: [T('di più', 'di più: 4 volte l’aria, 4 volte l’aumento', 'che l’aumento è proporzionale all’aria spinta'), T('di meno', 'di meno, perché la bottiglia si allarga', 'che la bottiglia si deforma'), T('uguale, perché la bottiglia è la stessa', 'uguale: la bottiglia è sempre quella', 'che il manometro sbaglia di molto con le siringhe grandi')],
          answer: 0,
          explain: T('Giusto: più aria spingi nella bottiglia, più forte preme.', 'Esatto: 0,125 bar con 50 mL, 0,5 bar con 200 mL.', 'Esatto: l’aumento vale s / V, e dal rapporto si ricava V.'),
        },
        {
          kind: 'q',
          text: T('Se la bottiglia fosse piccolissima, con la stessa siringa la lancetta salirebbe…', 'Con la stessa siringa, una bottiglia più piccola darebbe una pressione…', 'Se la bottiglia avesse volume doppio, l’aumento di pressione con 200 mL sarebbe…'),
          options: [T('molto di più', 'più alta: la stessa aria in meno spazio', 'la metà: 0,25 bar'), T('meno', 'più bassa', 'il doppio: 1 bar'), T('uguale, come adesso', 'uguale', 'uguale: 0,5 bar')],
          answer: 0,
          explain: T('Giusto: la stessa aria in meno spazio spinge di più.', 'Esatto: meno volume, più pressione. È Boyle.', 'Esatto: l’aumento è s / V, e con V doppio è la metà.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Il volume nascosto.'),
          vals: { a: [100, 200] }, derive: { P: '1 + a / 400' }, calc: 'a / (P - 1)', unit: 'mL', tol: 10,
          ask: T(null,
            'Spingendo <b>{a} mL</b> d’aria nella bottiglia, il manometro passa da 1 a <b>{P} bar</b>. Quanti mL è grande la bottiglia?',
            'Con <b>{a} mL</b> spinti dentro, la pressione sale da 1 a <b>{P} bar</b>. Qual è il volume della bottiglia, in mL? [[1 · (V + s) = P · V]]'),
          explain: T(null, 'Esatto: V + {a} = {P} × V, quindi V = {a} / ({P} − 1) = {ans:0} mL.', 'Esatto: {ans:0} mL.'),
        },
        {
          kind: 'q',
          text: T('Allora quanto è grande la bottiglia?', 'Il verdetto: quanto è grande la bottiglia?', 'Il verdetto: il volume della bottiglia?'),
          options: [T('il doppio della siringa grande', 'circa 400 mL', '400 mL, misurati senza vederla'), T('come la siringa piccola', 'circa 50 mL', '200 mL, come la siringa grande'), T('è vuota, non c’è aria', 'circa un litro e mezzo', '1,5 L, come la pressione')],
          answer: 0,
          explain: T('Esperimento riuscito! Con 200 mL la pressione sale di mezzo bar: la bottiglia è grande il doppio della siringa, 400 mL.', 'Esperimento riuscito: V = 200 / (1,5 − 1) = 400 mL.', 'Esperimento riuscito: 400 mL. Con Boyle, un manometro diventa un metro per i volumi.'),
        },
      ],
      hints: [T('Più grande è la bottiglia, meno sale la lancetta.', 'La stessa aria in meno spazio: la pressione sale. Dall’aumento ricavi il volume.', 'Tutta l’aria finisce nella bottiglia: (V + s) · 1 = P · V.')],
      solution: T(
        'La bottiglia è grande 400 mL, il doppio della siringa grande.',
        'V = s / (P − 1) = 400 mL.',
        'Con 200 mL spinti dentro e 1,5 bar sul manometro, la bottiglia è di 400 mL.'),
    },
  ],
};
