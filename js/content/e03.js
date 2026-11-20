// E03 · I magneti. Simulazione: i magneti (magnets.js), in nove modi: che cosa attira la calamita, i poli nord e sud,
// la limatura e le linee del campo, la Terra e la bussola, la corrente che fa girare le bussole (Ørsted),
// l'elettrocalamita, il motore elettrico, la ruota panoramica del parco, la calamita spezzata.
// La zona si apre con un mistero (quali cose attira una calamita?), mette in fila poli e linee del campo fino alla bussola
// e alla Terra, scopre con Ørsted che la corrente fa una calamita, fa girare un motore, costruisce la ruota panoramica e
// finisce con Vetrino e il mito della calamita spezzata, che separerebbe il nord dal sud.
import { T } from '../util.js';

export default {
  id: 'E03',
  title: 'I magneti',
  levels: [
    {
      id: 'e03-1', kind: 'prevedi', title: 'Che cosa attira la calamita?',
      sim: 'magneti', params: { mode: 'oggetti', ogg: 'graffetta' }, controls: [],
      intro: T(
        'Una calamita attira le cose di ferro. Ma quali cose sono di ferro? Proviamo con una graffetta, una lattina, una moneta da 1 centesimo e una da 20 centesimi. Prima indovina, poi guarda!',
        'Le calamite attirano il ferro e pochi altri metalli, come il nichel e il cobalto; non attirano l’alluminio, il rame, la plastica, il legno. Prevedi che cosa succede con una graffetta, una lattina di alluminio, una moneta da 1 centesimo e una da 20 centesimi.',
        'Fra tutti i metalli, solo pochi sono attratti dalle calamite: il ferro, il nichel, il cobalto e le loro leghe, come l’acciaio. E le monete del portafoglio nascondono una sorpresa. Prevedi, poi guarda.'),
      steps: [
        {
          kind: 'q', set: { ogg: 'graffetta' }, predict: [{ ogg: 'graffetta' }],
          text: T('Una graffetta: la calamita la attira?', 'Una graffetta d’acciaio: la calamita…', 'Una graffetta d’acciaio sotto la calamita:'),
          options: [T('sì, salta su', 'la attira', 'salta sulla calamita'), T('no, resta lì', 'non le fa niente', 'resta ferma sul tavolo'), T('scappa via', 'la spinge via', 'viene spinta via')],
          answer: 0,
          explain: T('Giusto: è d’acciaio, cioè di ferro.', 'Esatto: l’acciaio è quasi tutto ferro.', 'Esatto: l’acciaio è una lega di ferro.'),
          solution: T('Sì, salta su.', 'La attira.'),
        },
        {
          kind: 'q', set: { ogg: 'lattina' }, predict: [{ ogg: 'lattina' }],
          text: T('Una lattina di alluminio, di metallo lucido:', 'Una lattina di alluminio: la calamita…', 'Una lattina di alluminio, che è un metallo:'),
          options: [T('resta lì', 'non le fa niente', 'resta ferma'), T('salta su', 'la attira', 'salta su: è un metallo'), T('scappa via', 'la spinge via', 'viene spinta via')],
          answer: 0,
          explain: T('Giusto: l’alluminio non si attacca!', 'Esatto: l’alluminio è un metallo, ma non è magnetico.', 'Esatto: l’alluminio non è magnetico. Essere un metallo non basta.'),
          solution: T('Resta lì.', 'Non le fa niente.'),
        },
        {
          kind: 'q', set: { ogg: 'cent' }, predict: [{ ogg: 'cent' }],
          text: T('Una moneta da 1 centesimo, color rame:', 'Una moneta da 1 centesimo, color rame: la calamita…', 'Una moneta da 1 centesimo, color rame, sotto la calamita:'),
          options: [T('salta su', 'la attira', 'la moneta salta su'), T('resta lì: è di rame', 'non le fa niente: è di rame', 'resta ferma: il rame non è magnetico'), T('scappa via', 'la spinge via', 'viene spinta via')],
          answer: 0,
          explain: T('Sorpresa: dentro è d’acciaio!', 'Esatto, e sorpresa: è d’acciaio, ricoperto da un velo di rame.', 'Esatto: le monete da 1, 2 e 5 centesimi sono d’acciaio ramato.'),
          solution: T('Salta su.', 'La attira.'),
        },
        {
          kind: 'q', set: { ogg: 'venti' }, predict: [{ ogg: 'venti' }],
          text: T('Una moneta da 20 centesimi, color oro:', 'Una moneta da 20 centesimi, color oro: la calamita…', 'Una moneta da 20 centesimi, color oro, sotto la calamita:'),
          options: [T('resta lì', 'non le fa niente', 'resta ferma'), T('salta su', 'la attira', 'la moneta salta su'), T('scappa via', 'la spinge via', 'viene spinta via')],
          answer: 0,
          explain: T('Giusto: non c’è ferro dentro.', 'Esatto: è una lega di rame, senza ferro.', 'Esatto: è «oro nordico», una lega di rame, alluminio, zinco e stagno.'),
          solution: T('Resta lì.', 'Non le fa niente.'),
        },
        {
          kind: 'q',
          text: T('Allora la calamita attira…', 'Che cosa attira una calamita?', 'Che cosa hanno in comune le cose che la calamita attira?'),
          options: [T('le cose di ferro', 'il ferro e l’acciaio', 'il ferro'), T('tutti i metalli', 'tutti i metalli, nessuno escluso', 'sono tutte metalliche e lucide'), T('le cose lucide', 'le cose leggere e piccole', 'sono tutte piccole e leggere')],
          answer: 0,
          explain: T('Giusto: il ferro, non tutti i metalli.', 'Esatto: il ferro, l’acciaio e pochi altri metalli, non tutti.', 'Esatto: dentro hanno tutte del ferro, o dell’acciaio.'),
        },
      ],
      hints: [T('Pensa a che cosa c’è dentro, non al colore.', 'Conta il ferro, non il fatto di essere un metallo.', 'Il ferro, il nichel, il cobalto e le loro leghe.')],
    },
    {
      id: 'e03-2', kind: 'lezione', title: 'Poli nord e sud',
      sim: 'magneti', params: { mode: 'poli', faccia: 'S' }, controls: ['faccia'],
      intro: T(
        'Ogni calamita ha due estremità, i poli: il polo nord e il polo sud. Avvicina due calamite: a volte si attirano, a volte si respingono!',
        'Ogni calamita ha due <b>poli</b>, nord (N) e sud (S). Come per le cariche elettriche: <b>poli uguali si respingono, poli opposti si attirano</b>. E la forza agisce a distanza, anche attraverso la carta, il legno, la plastica.',
        'Le calamite si conoscono da più di duemila anni: in Grecia, nella regione della Magnesia, si trovavano pietre che attiravano il ferro, la magnetite. I poli si attirano e si respingono come le cariche, ma con una differenza profonda, che scoprirai alla fine della zona.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova il nord davanti al sud, e il nord davanti al nord.', 'Prova il nord della prima calamita davanti al sud della seconda, e davanti al nord.'),
          need: [
            { when: "faccia == 'S'", try: { faccia: 'S' }, msg: T('Prova il nord davanti al sud.', 'Manca la prova con il nord davanti al sud.') },
            { when: "faccia == 'N'", try: { faccia: 'N' }, msg: T('Ora il nord davanti al nord.', 'Manca la prova con il nord davanti al nord.') },
          ],
        },
        {
          kind: 'q',
          text: T('Nord davanti a nord: le calamite…', 'Due poli nord, uno davanti all’altro:', 'Due poli uguali, vicini:'),
          options: [T('si respingono', 'si respingono', 'si respingono'), T('si attirano', 'si attirano', 'si attirano'), T('restano ferme', 'non si fanno niente', 'non si fanno niente')],
          answer: 0,
          explain: T('Giusto: poli uguali si spingono via.', 'Esatto: poli uguali si respingono.', 'Esatto: come due cariche uguali.'),
        },
        {
          kind: 'q',
          text: T('Nord davanti a sud: le calamite…', 'Un polo nord davanti a un polo sud:', 'Due poli opposti, vicini:'),
          options: [T('si attirano', 'si attirano', 'si attirano'), T('si respingono', 'si respingono', 'si respingono'), T('girano su se stesse', 'girano su se stesse', 'si annullano')],
          answer: 0,
          explain: T('Giusto: poli diversi si tirano.', 'Esatto: poli opposti si attirano.', 'Esatto: come due cariche opposte.'),
        },
        {
          kind: 'q',
          text: T('Che cosa attira il polo nord di una calamita?', 'Due calamite si attirano anche con un foglio di carta in mezzo?', 'In che cosa la forza fra due calamite somiglia a quella fra due cariche?'),
          options: [T('il polo sud di un’altra calamita', 'sì, anche attraverso la carta', 'uguali si respingono e opposti si attirano, a distanza'), T('il polo nord di un’altra calamita', 'no: la carta ferma la forza magnetica', 'diventa più forte quando sono lontane'), T('niente, solo il legno', 'solo se la carta è bagnata d’acqua', 'agisce solo se si toccano')],
          answer: 0,
          explain: T('Giusto: nord e sud si attirano.', 'Esatto: la forza magnetica agisce a distanza, attraverso molti materiali.', 'Esatto: anche la forza magnetica agisce a distanza, e cala allontanandosi.'),
        },
      ],
      hints: [T('Uguali si spingono via, diversi si tirano.', 'Poli uguali si respingono, opposti si attirano.', 'Come le cariche: uguali si respingono, opposti si attirano.')],
      solution: T(
        'Nord e nord si respingono; nord e sud si attirano.',
        'Poli uguali si respingono, poli opposti si attirano.',
        'Poli uguali si respingono, opposti si attirano, anche a distanza.'),
    },
    {
      id: 'e03-3', kind: 'lezione', title: 'Il campo magnetico e la bussola',
      sim: 'magneti', params: { mode: 'linee', conf: 'una' }, controls: ['conf'],
      intro: T(
        'Intorno a una calamita c’è un campo magnetico: la limatura di ferro lo fa vedere, con tante linee che vanno dal nord al sud. Anche la Terra è una grande calamita: per questo la bussola indica il nord!',
        'Intorno a una calamita c’è un <b>campo magnetico</b>: la limatura di ferro si mette in fila lungo le sue linee, che escono dal polo nord ed entrano nel polo sud. Anche la Terra è una grande calamita, e l’ago della <b>bussola</b>, una piccola calamita, si allinea alle sue linee. Il campo magnetico si misura in <b>tesla</b> (T); quello della Terra è di circa 50 milionesimi di tesla.',
        'La bussola arrivò in Europa dalla Cina nel Medioevo e cambiò la navigazione. L’ago indica il nord perché segue le linee del campo della Terra: vicino al Nord geografico c’è un polo sud magnetico, che attira il nord dell’ago. E più ci si avvicina al polo, più l’ago punta verso il basso.'),
      steps: [
        {
          kind: 'free',
          text: T('Prova una calamita sola, poi due con il nord davanti al sud.', 'Prova una calamita sola, poi due calamite con il nord davanti al sud.'),
          need: [
            { when: "conf == 'una'", try: { conf: 'una' }, msg: T('Prova una calamita sola.', 'Manca la calamita sola.') },
            { when: "conf == 'attira'", try: { conf: 'attira' }, msg: T('Ora due, nord davanti a sud.', 'Manca la prova con il nord davanti al sud.') },
          ],
        },
        {
          kind: 'q',
          text: T('Le linee del campo vanno…', 'Le linee del campo magnetico…', 'Che cosa mostrano le linee disegnate dalla limatura?'),
          options: [T('dal nord al sud', 'escono dal nord ed entrano nel sud', 'la direzione del campo'), T('dal sud al nord', 'escono dal sud ed entrano nel nord', 'dove la calamita è più pesante'), T('in tondo, intorno alla calamita', 'girano intorno alla calamita', 'il percorso della corrente')],
          answer: 0,
          explain: T('Giusto: dal nord al sud.', 'Esatto: fuori dalla calamita vanno dal nord al sud.', 'Esatto: la direzione del campo in ogni punto: ogni granello di ferro diventa un piccolo ago di bussola.'),
        },
        {
          kind: 'free', set: { mode: 'terra', lat: 0 }, controls: ['lat'],
          text: T('Ora la Terra: prova la bussola all’equatore e vicino al polo.', 'Ora la Terra: prova la bussola all’equatore, a 0°, e vicino al polo, a 85° o più.'),
          need: [
            { when: 'lat <= 5', try: { lat: 0 }, msg: T('Prova la bussola all’equatore.', 'Manca la prova all’equatore.') },
            { when: 'lat >= 85', try: { lat: 90 }, msg: T('Ora portala vicino al polo.', 'Manca la prova vicino al polo.') },
          ],
        },
        {
          kind: 'q', controls: [],
          text: T('Perché la bussola indica il nord?', 'Perché l’ago della bussola si gira verso nord?', 'Vicino al Nord geografico c’è un polo magnetico. Quale?'),
          options: [T('la Terra è una calamita', 'segue il campo della Terra', 'un polo sud magnetico'), T('al nord fa molto più freddo', 'perché al nord c’è più ferro nella terra', 'un polo nord magnetico, che respinge l’ago'), T('il vento la spinge sempre', 'perché il vento soffia sempre da nord', 'nessuno: i poli magnetici sono all’equatore')],
          answer: 0,
          explain: T('Giusto: e l’ago è una piccola calamita.', 'Esatto: l’ago è una piccola calamita, e si allinea alle linee del campo della Terra.', 'Esatto: un polo sud magnetico, che attira il nord dell’ago.'),
        },
        {
          kind: 'q', controls: [],
          text: T('Vicino al polo, l’ago della bussola…', 'Vicino al polo, l’ago della bussola…', 'Perché vicino al polo l’ago punta verso il basso?'),
          options: [T('punta in giù', 'punta verso il basso', 'perché lì le linee del campo entrano nella Terra'), T('gira in tondo', 'gira all’impazzata', 'perché fa troppo freddo per il magnete'), T('sparisce', 'si smagnetizza', 'perché lì il campo è zero')],
          answer: 0,
          explain: T('Giusto: punta verso terra.', 'Esatto: le linee del campo, lì, entrano nella Terra.', 'Esatto: è l’inclinazione magnetica, quasi 90° al polo.'),
        },
      ],
      hints: [T('L’ago della bussola è una piccola calamita.', 'Le linee escono dal nord ed entrano nel sud; l’ago le segue.', 'L’ago segue le linee del campo, anche verso il basso.')],
      solution: T(
        'Le linee vanno dal nord al sud; la bussola segue quelle della Terra.',
        'Linee dal nord al sud; l’ago della bussola si allinea al campo della Terra.',
        'Il campo magnetico ha linee dal nord al sud, e l’ago le segue ovunque.'),
    },
    {
      id: 'e03-4', kind: 'lezione', title: 'La corrente fa una calamita',
      sim: 'magneti', params: { mode: 'oersted', acceso: false, verso: 'su' }, controls: ['acceso', 'verso'],
      intro: T(
        'Nel 1820 Hans Christian Ørsted vide una cosa strana: un filo con la corrente fa girare l’ago della bussola! La corrente fa una calamita. Accendi la corrente e guarda le bussole.',
        'Nel 1820 Ørsted scoprì che <b>la corrente crea un campo magnetico</b>: intorno a un filo le linee sono cerchi, e il loro verso dipende dal verso della corrente. Avvolgendo il filo in tante <b>spire</b> intorno a un chiodo di ferro si ottiene un’<b>elettrocalamita</b>: più spire e più corrente, più è forte. E si spegne quando spegni la corrente.',
        'Con l’esperimento di Ørsted elettricità e magnetismo diventarono una cosa sola. Le elettrocalamite sono ovunque: nelle gru dei rottamatori, nei campanelli, negli altoparlanti, nelle macchine per la risonanza magnetica. Il campo di una bobina cresce con le spire e con la corrente. [[B ∝ N · I]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova la corrente spenta, poi accesa in un verso e nell’altro.', 'Prova la corrente spenta, poi accesa verso di te e lontano da te.'),
          need: [
            { when: '!acceso', try: { acceso: false }, msg: T('Prova con la corrente spenta.', 'Manca la prova con la corrente spenta.') },
            { when: "acceso && verso == 'su'", try: { acceso: true, verso: 'su' }, msg: T('Ora accendila, verso di te.', 'Manca la corrente accesa verso di te.') },
            { when: "acceso && verso == 'giu'", try: { acceso: true, verso: 'giu' }, msg: T('Ora accendila lontano da te.', 'Manca la corrente accesa lontano da te.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la corrente accesa, le bussole…', 'Con la corrente accesa, le bussole…', 'Che forma ha il campo magnetico intorno a un filo?'),
          options: [T('girano intorno al filo', 'stanno in cerchio intorno al filo', 'cerchi intorno al filo'), T('indicano ancora il nord, come prima', 'indicano ancora il nord, come prima', 'linee dritte, lungo il filo'), T('puntano tutte verso il filo', 'puntano tutte verso il filo', 'linee che escono dal filo, come da una carica')],
          answer: 0,
          explain: T('Giusto: la corrente fa una calamita!', 'Esatto: il campo forma cerchi intorno al filo.', 'Esatto: linee chiuse, senza inizio e senza fine.'),
        },
        {
          kind: 'q',
          text: T('Con la corrente al contrario, le bussole…', 'Invertendo la corrente, le bussole…', 'Che cosa decide il verso dei cerchi del campo?'),
          options: [T('girano al contrario', 'si girano dall’altra parte', 'il verso della corrente'), T('restano uguali', 'restano come prima', 'il nord della Terra'), T('si fermano', 'tornano a indicare il nord', 'lo spessore del filo')],
          answer: 0,
          explain: T('Giusto: si girano dall’altra parte.', 'Esatto: il campo cambia verso con la corrente.', 'Esatto: corrente al contrario, campo al contrario.'),
        },
        {
          kind: 'free', set: { mode: 'bobina', spire: 10, I: 1 }, controls: ['spire', 'I'],
          text: T('Ora un’elettrocalamita: prova pochi giri di filo e poca corrente, poi tanti e tanta.', 'Ora un’elettrocalamita: prova 10 spire con 1 A, poi 50 spire con 2 A o più.'),
          need: [
            { when: 'spire * I <= 10 && I > 0', try: { spire: 10, I: 1 }, msg: T('Prova pochi giri e poca corrente.', 'Manca la prova con 10 spire e 1 A.') },
            { when: 'spire * I >= 100', try: { spire: 50, I: 2 }, msg: T('Ora tanti giri e tanta corrente.', 'Manca una prova con 50 spire e 2 A o più.') },
          ],
        },
        {
          kind: 'q', controls: [],
          text: T('Per un’elettrocalamita più forte…', 'Per un’elettrocalamita più forte servono…', 'Da che cosa dipende la forza di un’elettrocalamita?'),
          options: [T('più giri e più corrente', 'più spire e più corrente', 'dalle spire e dalla corrente'), T('un filo più corto e più sottile', 'meno spire e meno corrente', 'solo dal colore del filo'), T('un chiodo più colorato', 'un chiodo di plastica', 'solo dalla lunghezza del chiodo')],
          answer: 0,
          explain: T('Giusto: più giri e più corrente.', 'Esatto: il campo cresce con le spire e con la corrente.', 'Esatto: dal prodotto N·I, e da un nucleo di ferro.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Le graffette dell’elettrocalamita.'),
          vals: { N: [30, 40, 50] }, calc: '4 * N / 20', unit: '', tol: 0.1,
          ask: T(null,
            'Un’elettrocalamita con 20 spire e una corrente di 2 A solleva 4 graffette. Quante ne solleva con <b>{N} spire</b> e la stessa corrente?',
            '20 spire e 2 A: 4 graffette. Con <b>{N} spire</b> e 2 A? [[B ∝ N · I]]'),
          explain: T(null, 'Esatto: il campo cresce con le spire: 4 × {N} / 20 = {ans:0} graffette.', 'Esatto: {ans:0} graffette.'),
        },
        {
          kind: 'q', controls: [],
          text: T('La gru dei rottami ha un’elettrocalamita. Se spegne la corrente…', 'Che cosa fa la gru dei rottami quando spegne la corrente?', 'Che vantaggio ha un’elettrocalamita su una calamita normale?'),
          options: [T('lascia cadere il ferro', 'lascia cadere il ferro', 'si accende, si spegne e si regola'), T('tiene il ferro per sempre', 'tiene il ferro ancora più forte', 'non ha bisogno di corrente'), T('attira la plastica', 'comincia ad attirare l’alluminio', 'attira tutti i metalli')],
          answer: 0,
          explain: T('Giusto: senza corrente non è più una calamita.', 'Esatto: senza corrente non c’è campo.', 'Esatto: basta un interruttore per accenderla e spegnerla.'),
        },
      ],
      hints: [T('Accendi la corrente e guarda le bussole.', 'La corrente crea un campo a cerchi; più spire e più corrente, più forza.', 'Il campo di un filo forma cerchi; quello di una bobina cresce con N·I.')],
      solution: T(
        'La corrente fa girare le bussole: è una calamita. Più giri di filo e più corrente, più è forte.',
        'Campo a cerchi intorno al filo; elettrocalamita più forte con più spire e più corrente.',
        'La corrente crea un campo magnetico: cerchi intorno al filo, e in una bobina un campo che cresce con le spire e con la corrente.'),
    },
    {
      id: 'e03-5', kind: 'lezione', title: 'Il motore elettrico',
      sim: 'magneti', params: { mode: 'motore', I: 2, giro: 'avanti' }, controls: ['I', 'giro'],
      intro: T(
        'Una calamita e una corrente insieme fanno muovere le cose! Una bobina fra i poli di una calamita, con la corrente, gira: è un motore elettrico, come quello dei giocattoli, del frullatore e del treno.',
        'Un filo con la corrente, in un campo magnetico, sente una forza: <b>F = B·I·L</b>, con B il campo, I la corrente e L la lunghezza del filo. In una bobina fra i poli di una calamita la corrente va in versi opposti sui due lati: le due forze sono opposte, e la bobina gira. Un collettore inverte la corrente a ogni mezzo giro, così la bobina continua a girare: è il <b>motore elettrico</b>.',
        'Il motore elettrico trasforma energia elettrica in movimento quasi senza sprechi: più del 90 per cento, contro il 30 o 40 di un motore a scoppio. Nato nell’Ottocento dalle idee di Faraday, oggi muove treni, auto, frullatori e lavatrici. [[F = B · I · L]]'),
      steps: [
        {
          kind: 'free',
          text: T('Prova senza corrente e con tanta corrente.', 'Prova la bobina con 0 A e con 2 A o più.'),
          need: [
            { when: 'I == 0', try: { I: 0 }, msg: T('Prova senza corrente.', 'Manca la prova con 0 A.') },
            { when: 'I >= 2', try: { I: 2 }, msg: T('Ora con tanta corrente.', 'Manca una prova con 2 A o più.') },
          ],
        },
        {
          kind: 'q',
          text: T('Senza corrente, la bobina…', 'Senza corrente, la bobina…', 'Perché senza corrente la bobina non gira, anche se c’è la calamita?'),
          options: [T('sta ferma', 'sta ferma', 'perché la forza magnetica agisce sulla corrente'), T('gira lo stesso', 'gira lo stesso, più piano', 'perché la calamita è troppo debole'), T('gira al contrario', 'gira al contrario', 'perché la bobina è di rame e il rame non è magnetico')],
          answer: 0,
          explain: T('Giusto: serve la corrente.', 'Esatto: la forza agisce solo su un filo con la corrente.', 'Esatto: senza corrente la forza è zero.'),
        },
        {
          kind: 'q',
          text: T('Perché la bobina gira?', 'Sui due lati della bobina, le forze sono…', 'Perché le forze sui due lati della bobina sono opposte?'),
          options: [T('due spinte opposte', 'opposte: una in su e una in giù', 'la corrente va in versi opposti'), T('il vento la spinge da dietro', 'uguali, tutte e due in su', 'perché un lato è più vicino al nord'), T('la calamita gira insieme a lei', 'nulle', 'perché la bobina è più pesante da un lato')],
          answer: 0,
          explain: T('Giusto: una in su e una in giù, come quando giri un volante.', 'Esatto: due forze opposte la fanno girare.', 'Esatto: sui due lati la corrente è opposta, e anche la forza: la bobina gira.'),
        },
        {
          kind: 'free',
          text: T('Ora prova la corrente in un verso e nell’altro.', 'Prova la corrente avanti e al contrario, con almeno 1 A.'),
          need: [
            { when: "I >= 1 && giro == 'avanti'", try: { I: 2, giro: 'avanti' }, msg: T('Prova la corrente avanti.', 'Manca la corrente avanti, con almeno 1 A.') },
            { when: "I >= 1 && giro == 'indietro'", try: { I: 2, giro: 'indietro' }, msg: T('Ora al contrario.', 'Manca la corrente al contrario, con almeno 1 A.') },
          ],
        },
        {
          kind: 'q',
          text: T('Con la corrente al contrario, il motore…', 'Invertendo la corrente, il motore…', 'Come si fa andare in retromarcia un’auto elettrica?'),
          options: [T('gira al contrario', 'gira al contrario', 'si inverte la corrente nel motore'), T('gira uguale', 'gira nello stesso verso', 'si gira la calamita del motore a mano'), T('si rompe', 'si ferma per sempre', 'non si può: serve un cambio a ingranaggi')],
          answer: 0,
          explain: T('Giusto: gira all’indietro.', 'Esatto: corrente al contrario, forze al contrario.', 'Esatto: basta invertire la corrente.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'La forza sul filo.'),
          vals: { I: [2, 4, 6] }, calc: '0.5 * I * 0.1', unit: 'N', tol: 0.005,
          ask: T(null,
            'Un filo lungo 0,1 m, con una corrente di <b>{I} A</b>, sta in un campo magnetico di 0,5 T. Quanto vale la forza sul filo?',
            'Campo di 0,5 T, filo di 0,1 m, corrente di <b>{I} A</b>: forza? [[F = B · I · L]]'),
          explain: T(null, 'Esatto: F = 0,5 T × {I} A × 0,1 m = {ans:1} N.', 'Esatto: {ans:1} N.'),
        },
      ],
      hints: [T('Serve la corrente; al contrario, gira al contrario.', 'Forze opposte sui due lati della bobina: F = B·I·L.', 'La forza magnetica agisce sulla corrente, e il collettore la inverte a ogni mezzo giro.')],
      solution: T(
        'Con la corrente la bobina gira; con la corrente al contrario gira al contrario.',
        'F = B·I·L su ogni lato: forze opposte, e la bobina gira.',
        'Il motore elettrico: forze magnetiche opposte sui due lati della bobina.'),
    },
    {
      id: 'e03-6', kind: 'costruisci', title: 'La ruota panoramica',
      sim: 'magneti', params: { mode: 'ruota', V: 8 }, controls: ['V'],
      intro: T(
        'Nel parco arriva la ruota panoramica! La muove un motore elettrico: più volt gli dai, più gira veloce. Ogni 4 volt, fa 1 giro al minuto. Dai al motore i volt giusti!',
        'Costruisci la ruota panoramica del parco. Il suo motore elettrico gira tanto più veloce quanto più è alta la tensione: fa 1 giro al minuto ogni 4 V. Troppo veloce fa paura, troppo lenta annoia: trova la tensione per la velocità chiesta.',
        'La ruota panoramica del parco: un motore elettrico la cui velocità è proporzionale alla tensione. È così che si regola la velocità dei treni e delle auto elettriche: cambiando la tensione del motore. [[V = 4 V × giri al minuto]]'),
      piece: { id: 'ruota', name: 'La ruota panoramica', desc: 'Un motore elettrico la fa girare piano piano: un giro al minuto ogni 4 volt.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Scegli i volt, poi accendi il motore.', 'Scegli la tensione, poi accendi il motore.'),
          vals: { e: { giri: [[3], [5]] }, s: { giri: [[2, 3], [4, 6]] } },
          ask: T(
            'La ruota deve fare <b>{giri} giri al minuto</b>. Quanti volt dai al motore?',
            'Velocità chiesta: <b>{giri} giri al minuto</b>. Con 1 giro al minuto ogni 4 V, che tensione serve?',
            'Velocità: <b>{giri} giri al minuto</b>. Tensione? [[V = 4 V × giri al minuto]]'),
          measure: 'V', goal: '4 * giri', tol: 0.5,
          ok: T('Perfetto! La ruota gira alla velocità giusta!', 'Esatto: la velocità chiesta.'),
          high: T('Troppo veloce: i passeggeri si spaventano! Abbassa i volt.', 'Tensione troppo alta: gira troppo in fretta.'),
          low: T('Troppo piano: un giro dura un’eternità. Alza i volt.', 'Tensione troppo bassa: gira troppo piano.'),
          solve: { V: '4 * giri' },
        },
        {
          kind: 'q',
          text: T('Per far girare la ruota due volte più veloce, servono…', 'Per raddoppiare la velocità della ruota, la tensione…', 'Come si regola la velocità di un treno elettrico?'),
          options: [T('il doppio dei volt', 'raddoppia', 'cambiando la tensione del motore'), T('la metà dei volt', 'si dimezza', 'cambiando il colore dei binari'), T('gli stessi volt', 'resta uguale', 'cambiando la calamita a ogni stazione')],
          answer: 0,
          explain: T('Giusto: il doppio dei volt, il doppio dei giri.', 'Esatto: la velocità è proporzionale alla tensione.', 'Esatto: più tensione, più velocità.'),
        },
      ],
      hints: [T('4 volt per ogni giro al minuto: moltiplica per 4.', 'V = 4 V × giri al minuto: 3 giri, 12 V.', 'La velocità è proporzionale alla tensione: 1 giro al minuto ogni 4 V.')],
      solution: T('3 giri al minuto: 12 volt; 5 giri: 20 volt.', 'V = 4 V × giri: 8, 12, 16 o 24 V.', 'Una tensione proporzionale alla velocità chiesta: 4 V per ogni giro al minuto.'),
    },
    {
      id: 'e03-7', kind: 'ripasso', title: 'Ripasso dei magneti',
      intro: T('Ripassiamo: calamite, poli, bussole e motori!', 'Ripasso: poli, campo magnetico, Ørsted, elettrocalamite e motori.', 'Ripasso: il magnetismo e la corrente.'),
      steps: [
        {
          kind: 'q',
          text: T('Quale di questi la calamita attira?', 'Quale di questi materiali è attratto da una calamita?', 'Perché una lattina di alluminio non si attacca alla calamita?'),
          options: [T('un chiodo di ferro', 'l’acciaio', 'perché l’alluminio non è magnetico'), T('una lattina di alluminio', 'l’alluminio', 'perché è troppo leggera'), T('un bicchiere di vetro', 'il rame', 'perché è vuota')],
          answer: 0,
          explain: T('Giusto: è di ferro.', 'Esatto: l’acciaio è quasi tutto ferro.', 'Esatto: solo ferro, nichel, cobalto e le loro leghe.'),
        },
        {
          kind: 'q',
          text: T('Due poli sud vicini…', 'Poli uguali…', 'Poli opposti, vicini…'),
          options: [T('si respingono', 'si respingono', 'si attirano'), T('si attirano', 'si attirano', 'si respingono'), T('si annullano', 'si annullano', 'si annullano')],
          answer: 0,
          explain: T('Giusto: uguali si spingono via.', 'Esatto: si respingono.', 'Esatto: si attirano.'),
        },
        {
          kind: 'q',
          text: T('La bussola indica il nord perché…', 'Perché la bussola indica il nord?', 'Che cosa attira il nord dell’ago della bussola, verso il Nord geografico?'),
          options: [T('la Terra è una grande calamita', 'perché segue il campo magnetico della Terra', 'un polo sud magnetico'), T('al nord c’è più ferro', 'perché al nord fa freddo', 'un polo nord magnetico'), T('glielo dice il vento', 'perché la Terra gira', 'la Stella Polare')],
          answer: 0,
          explain: T('Giusto: e l’ago è una piccola calamita.', 'Esatto: l’ago si allinea al campo della Terra.', 'Esatto: poli opposti si attirano.'),
        },
        {
          kind: 'q',
          text: T('Ørsted vide che un filo con la corrente…', 'Che cosa scoprì Ørsted nel 1820?', 'Che cosa unì l’esperimento di Ørsted?'),
          options: [T('fa girare la bussola', 'che la corrente crea un campo magnetico', 'l’elettricità e il magnetismo'), T('diventa freddo', 'che i fili di rame sono magnetici', 'la luce e il suono'), T('si accende come una lampadina', 'che la bussola fa la corrente', 'il calore e il movimento')],
          answer: 0,
          explain: T('Giusto: la corrente fa una calamita.', 'Esatto: una corrente crea un campo magnetico.', 'Esatto: da lì nasce l’elettromagnetismo.'),
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: T(null, 'Ancora la forza sul filo.'),
          vals: { I: [3, 5, 8] }, calc: '0.2 * I * 0.5', unit: 'N', tol: 0.01,
          ask: T(null,
            'Un filo lungo 0,5 m, con <b>{I} A</b>, in un campo magnetico di 0,2 T. Quanto vale la forza sul filo?',
            'Campo 0,2 T, filo di 0,5 m, <b>{I} A</b>: forza? [[F = B · I · L]]'),
          explain: T(null, 'Esatto: F = 0,2 T × {I} A × 0,5 m = {ans:1} N.', 'Esatto: {ans:1} N.'),
        },
        {
          kind: 'q',
          text: T('Che cosa fa girare un motore elettrico?', 'In un motore elettrico, che cosa fa girare la bobina?', 'Perché in un motore elettrico serve il collettore?'),
          options: [T('una calamita e la corrente', 'le forze magnetiche sulla corrente della bobina', 'per invertire la corrente a ogni mezzo giro'), T('una molla carica, nascosta dentro', 'una molla nascosta', 'per raffreddare la bobina'), T('il vento che soffia dentro', 'il calore della corrente', 'per misurare la corrente')],
          answer: 0,
          explain: T('Giusto: calamita più corrente.', 'Esatto: forze opposte sui due lati.', 'Esatto: senza, la bobina si fermerebbe dopo mezzo giro.'),
        },
      ],
    },
    {
      id: 'e03-8', kind: 'boss', title: 'Il mito della calamita spezzata',
      sim: 'magneti', params: { mode: 'spezza', pezzi: 1 }, controls: ['pezzi'],
      intro: T(
        'Sono Vetrino. Si dice: <i>“Se spezzi una calamita a metà, da una parte resta il polo nord e dall’altra il polo sud”</i>. Così avresti un nord tutto da solo! Sarà vero? Mettiamolo alla prova!',
        'Sono Vetrino. Il mito: <i>“spezzando una calamita a metà si separano il polo nord e il polo sud”</i>. Un pezzo sarebbe tutto nord, l’altro tutto sud. Proviamo: la calamita intera, in 2 pezzi, in 4 pezzi.',
        'Sono Vetrino. Il mito della calamita spezzata: <i>“dividendo una calamita si ottengono un polo nord e un polo sud separati”</i>. Se fosse vero esisterebbero i monopoli magnetici, che i fisici cercano da un secolo senza averne mai trovato uno. Mettiamolo alla prova.'),
      steps: [
        {
          kind: 'q',
          text: T('Come lo provi?', 'Come si mette alla prova il mito?', 'Qual è la prova che decide?'),
          options: [T('la spezzi e guardi', 'si spezza la calamita e si cercano i poli di ogni pezzo', 'spezzarla e cercare un nord e un sud in ogni pezzo'), T('la guardi da lontano, con attenzione', 'si pesa la calamita intera', 'misurare quanto pesa ogni pezzo'), T('la metti in frigo per una notte', 'si scalda la calamita', 'chiedere a chi l’ha fabbricata')],
          answer: 0,
          explain: T('Giusto: si spezza davvero, e si guardano i pezzi.', 'Esatto: si guarda che poli ha ogni pezzo.', 'Esatto: basta trovare un pezzo con un polo solo.'),
        },
        {
          kind: 'free',
          text: T('Prova la calamita intera, in 2 pezzi e in 4 pezzi.', 'Prova la calamita intera, spezzata in 2 e spezzata in 4.'),
          need: [
            { when: 'pezzi == 1', try: { pezzi: 1 }, msg: T('Prova la calamita intera.', 'Manca la calamita intera.') },
            { when: 'pezzi == 2', try: { pezzi: 2 }, msg: T('Ora spezzala in 2.', 'Manca la calamita in 2 pezzi.') },
            { when: 'pezzi == 4', try: { pezzi: 4 }, msg: T('Ora in 4.', 'Manca la calamita in 4 pezzi.') },
          ],
        },
        {
          kind: 'q',
          text: T('Spezzata a metà, ogni pezzo ha…', 'Spezzata a metà, ogni pezzo ha…', 'Che cosa compare dove la calamita si rompe?'),
          options: [T('un nord e un sud', 'un polo nord e un polo sud', 'due poli nuovi, un nord e un sud'), T('solo un nord o solo un sud', 'un polo solo, nord o sud', 'niente: lì la calamita è spenta'), T('nessun polo', 'nessun polo: non è più una calamita', 'un polo nord da tutte e due le parti')],
          answer: 0,
          explain: T('Giusto: ogni pezzo è una calamita intera!', 'Esatto: nascono due poli nuovi, dove si è rotta.', 'Esatto: ogni metà ha di nuovo un nord e un sud.'),
        },
        {
          kind: 'q',
          text: T('In 4 pezzi, quanti poli nord ci sono?', 'In 4 pezzi, quanti poli ci sono in tutto?', 'Spezzandola ancora e ancora, che cosa trovi?'),
          options: [T('4, uno per pezzo', '8: 4 nord e 4 sud', 'calamite intere, più piccole'), T('1, solo in un pezzo', '2: un nord e un sud', 'alla fine, un polo nord tutto da solo'), T('nessuno', '4: due nord e due sud', 'alla fine, pezzetti senza nessun polo')],
          answer: 0,
          explain: T('Giusto: ogni pezzo ha il suo nord.', 'Esatto: ogni pezzo ha un nord e un sud.', 'Esatto: fino agli atomi, che sono piccolissime calamite.'),
        },
        {
          kind: 'q',
          text: T('Se spezzi ancora, i pezzetti…', 'Da dove viene il magnetismo di una calamita?', 'Perché ogni pezzo resta una calamita completa?'),
          options: [T('sono calamite anche loro', 'da tanti piccolissimi magneti, gli atomi, allineati', 'perché è fatta di piccolissimi magneti allineati, gli atomi'), T('perdono il magnetismo', 'da un polo nascosto nel mezzo', 'perché i poli si spostano sulle punte'), T('diventano di plastica', 'dalla vernice rossa e blu', 'perché la carica resta dentro')],
          answer: 0,
          explain: T('Giusto: tutte calamite, con nord e sud.', 'Esatto: ogni atomo di ferro è una piccolissima calamita.', 'Esatto: ogni pezzo contiene tanti magneti atomici allineati, con i loro nord e sud.'),
        },
        {
          kind: 'q',
          text: T('Allora il mito…', 'Che cosa concludi sul mito della calamita spezzata?', 'Il mito della calamita spezzata: il verdetto?'),
          options: [T('è falso: ogni pezzo ha un nord e un sud', 'falso: ogni pezzo ha sempre un nord e un sud', 'falso: nessuno ha mai trovato un polo magnetico da solo'), T('è vero: ogni pezzo ha un polo solo', 'vero: a metà si separano nord e sud', 'vero: spezzandola si separano i poli'), T('è vero solo per le calamite rosse', 'vero a metà: solo con le calamite piccole', 'vero, ma solo per le elettrocalamite')],
          answer: 0,
          explain: T('Mito smontato! Ogni pezzo è una calamita intera, con il suo nord e il suo sud.', 'Mito smontato: spezzando una calamita nascono due calamite, ognuna con nord e sud.', 'Mito smontato: i poli magnetici vengono sempre in coppia. È la differenza profonda con le cariche, che invece stanno anche da sole.'),
        },
      ],
      hints: [T('Guarda le lettere su ogni pezzo.', 'Conta i poli nord e sud di ogni pezzo.', 'Esiste un pezzo con un polo solo?')],
      solution: T(
        'Ogni pezzo ha il suo nord e il suo sud: il mito è falso.',
        'Falso: in 4 pezzi ci sono 4 nord e 4 sud.',
        'Il mito è falso: i poli vengono sempre in coppia.'),
    },
  ],
};
