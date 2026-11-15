// F02 · Grandezze, unità di misura e ordini di grandezza. Simulazione: lo zoom delle scale.
import { T, pick } from '../util.js';
import { t } from '../i18n.js';

const conv = (lens, r) => {
  if (lens === 'e') {
    if (r === 0) {
      const n = pick([3, 4, 5, 6, 7]);
      return { text: t('Il trenino del parco ha <b>{n} vagoni</b>, e ogni vagone è lungo <b>2 metri</b>. Quanto è lungo tutto il trenino?', { n }), ans: n * 2, tol: 0, unit: t('metri'), explain: t('Giusto: {n} volte 2 fa {a} metri.', { n, a: n * 2 }) };
    }
    if (r === 1) {
      const m = pick([2, 3, 4, 5]);
      return { text: t('Un giro sulla ruota panoramica dura <b>{m} minuti</b>. Un minuto ha 60 secondi. Quanti secondi dura il giro?', { m }), ans: m * 60, tol: 0, unit: t('secondi'), explain: t('Giusto: {m} × 60 = {a} secondi.', { m, a: m * 60 }) };
    }
    const g = pick([3, 4, 5]);
    return { text: t('Lo scivolo del parco è alto <b>{g} metri</b>. Un metro sono 100 centimetri. Quanti centimetri è alto?', { g }), ans: g * 100, tol: 0, unit: t('centimetri'), explain: t('Giusto: {g} × 100 = {a} centimetri.', { g, a: g * 100 }) };
  }
  const opts = [
    () => { const v = pick([35, 42, 48, 55, 63]); return { text: t('La montagna russa è alta <b>{k:3} km</b>. Quanti metri sono?', { k: v / 1000 }), ans: v, tol: 0.01, unit: 'm', explain: t('1 km = 1000 m, quindi {k:3} × 1000 = {v} m.', { k: v / 1000, v }) }; },
    () => { const v = pick([120, 135, 150, 185]); return { text: t('Per salire su una giostra bisogna essere alti almeno <b>{v} cm</b>. In metri?', { v }), ans: v / 100, tol: 0.001, unit: 'm', explain: t('100 cm = 1 m, quindi {v} cm = {m} m.', { v, m: v / 100 }) }; },
    () => { const m = pick([2, 3, 4]), s = pick([15, 20, 40]); return { text: t('Un giro di giostra dura <b>{m} minuti e {s} secondi</b>. Quanti secondi in tutto?', { m, s }), ans: m * 60 + s, tol: 0, unit: 's', explain: t('{m} × 60 + {s} = {a} s.', { m, s, a: m * 60 + s }) }; },
    () => { const g = pick([250, 400, 750, 1500]); return { text: t('Il sacchetto di zucchero filato pesa <b>{g} g</b>. In chilogrammi?', { g }), ans: g / 1000, tol: 0.0001, unit: 'kg', explain: t('1 kg = 1000 g, quindi {g} g = {k:3} kg.', { g, k: g / 1000 }) }; },
  ];
  return opts[(r * 2 + Math.floor(Math.random() * 2)) % opts.length]();
};

export default {
  id: 'F02',
  title: 'Grandezze e misure',
  levels: [
    {
      id: 'f02-1', kind: 'lezione', title: 'Dal piccolo al grandissimo',
      sim: 'scale', params: { exp: 0 }, controls: ['exp'],
      intro: T(
        'Muovi il cursore dello <b>zoom</b>: puoi rimpicciolire fino al cuore dell’atomo o ingrandire fino a tutto l’universo!',
        'Ogni passo dello zoom moltiplica o divide per 10: è una <b>potenza di 10</b>. 10³ m = 1000 m, 10⁻³ m = 0,001 m.',
        'In natura le misure vanno dal protone (10⁻¹⁵ m) all’universo osservabile (circa 10²⁷ m): oltre 40 potenze di 10. Esplorale con lo zoom.'),
      steps: [
        { kind: 'free', text: T('Esplora: trova la formica, la Terra e il Sole. Poi premi Avanti.', 'Esplora tutta la scala, dal protone all’universo osservabile. Poi premi Avanti.') },
        {
          kind: 'q',
          text: T('Sulla scala delle grandezze hai incontrato la Terra e il Sole. Da lontano, nel cielo, sembrano grandi più o meno uguali. Ma se li mettessi uno accanto all’altro, chi sarebbe più grande?', 'Sulla scala hai visto la Terra e il Sole. Il <b>diametro</b> è la larghezza di una sfera, da un bordo all’altro passando per il centro. Il diametro del Sole è circa quante volte quello della Terra?', 'Mettiamo tante Terre in fila, una accanto all’altra, da un bordo all’altro del Sole passando per il centro. Quante ne servono per coprire il suo diametro?'),
          options: [T('La Terra', 'Circa 10'), T('Il Sole', 'Circa 100'), T('Sono uguali', 'Circa 10.000')],
          answer: 1,
          set: { exp: 8 },
          explain: T('Il Sole è enorme: dentro ci starebbero più di un milione di Terre!', 'Circa 109 volte: Terra 1,27·10⁷ m, Sole 1,39·10⁹ m. Due potenze di 10 di differenza, cioè ~100.', 'Circa 109. E in volume, dentro il Sole stanno più di un milione di Terre.'),
        },
      ],
      hints: [T('Porta lo zoom vicino a 10⁸ e guarda la Terra e il Sole.'), T('Conta quante potenze di 10 ci sono tra i due.')],
      solution: T('Il Sole. Il suo diametro è circa 100 volte quello della Terra.'),
    },
    {
      id: 'f02-2', kind: 'lezione', title: 'Le unità di misura',
      sim: 'scale', params: { exp: 0 }, controls: ['exp'],
      intro: T(
        'Per misurare servono delle <b>unità</b>: il <b>metro</b> per le lunghezze, il <b>secondo</b> per il tempo, il <b>chilogrammo</b> per il peso.',
        'Il <b>Sistema Internazionale</b> (SI) usa metro (m), secondo (s) e chilogrammo (kg). Così tutti nel mondo misurano allo stesso modo.',
        'Dal 1960 quasi tutto il mondo usa il <b>Sistema Internazionale</b>: metro, secondo, chilogrammo. Nel 1999 una sonda della NASA andò persa perché due squadre usavano unità diverse.'),
      steps: [
        {
          kind: 'q', only: ['e'], text: 'Ogni cosa si misura con la sua <b>unità di misura</b>: è il «pezzetto» che usi per contare. Per il tempo usi i secondi, per il peso i chili. E se vuoi sapere quanto sei alto, quale unità usi?',
          options: ['Con i secondi', 'Con i metri', 'Con i chili'], answer: 1, explain: 'Esatto: l’altezza è una lunghezza, e si misura in metri.',
        },
        {
          kind: 'q', only: ['e'], text: 'Il tempo si misura in secondi, minuti e ore; le lunghezze in metri; il peso in chili. Pensa alla tua canzone preferita: quanto dura? Scegli la risposta con l’unità giusta.',
          options: ['Pochi minuti', 'Pochi metri', 'Pochi chili'], answer: 0, explain: 'Giusto: il tempo si misura in secondi e minuti.',
        },
        {
          kind: 'q', only: ['s', 'c'], text: T('', 'Gli scienziati di tutto il mondo usano le stesse unità, quelle del <b>Sistema Internazionale</b> (SI): così una misura si capisce ovunque. Le unità fondamentali sono poche, come il metro per le lunghezze e il secondo per il tempo. Quale di queste è un’unità fondamentale del SI?', 'Il <b>Sistema Internazionale</b> (SI) è l’insieme di unità che usano gli scienziati di tutto il mondo, come il metro e il secondo. Alcune unità di tutti i giorni invece non ne fanno parte. Quale di queste è un’unità del SI?'),
          options: ['Il pollice', 'Il chilogrammo', 'L’ora'], answer: 1, explain: T('', 'Il kg è l’unità SI della massa. L’ora si usa, ma l’unità SI del tempo è il secondo.'),
        },
        {
          kind: 'q', only: ['s', 'c'], text: 'Il prefisso <b>chilo</b> vuol dire «mille»: lo trovi in chilometro e in chilogrammo. Allora 1 km è uguale a…', options: ['10 m', '100 m', '1000 m'], answer: 2,
          explain: T('', '“Kilo” vuol dire mille: 1 km = 10³ m. “Milli” vuol dire un millesimo: 1 mm = 10⁻³ m.'),
        },
      ],
      hints: [T('Pensa a cosa stai misurando: una lunghezza, un tempo o un peso?'), T('Nel SI: metro, secondo, chilogrammo.')],
      solution: T('Lunghezze in metri, tempi in secondi, masse in chilogrammi.'),
    },
    {
      id: 'f02-3', kind: 'prevedi', title: 'Quanto è alta la Torre Eiffel?',
      sim: 'scale', params: { exp: 0 }, controls: ['exp'],
      intro: T('Una sfida di stima, come fanno gli scienziati quando non possono misurare tutto.', 'Una <b>stima</b> è una risposta approssimata: basta indovinare l’<b>ordine di grandezza</b>, cioè la potenza di 10.'),
      steps: [
        {
          kind: 'q',
          text: T('La Torre Eiffel, a Parigi, è una torre di ferro altissima. Immagina tante persone, ognuna in piedi sulle spalle di quella sotto. Non serve il numero esatto, basta una stima: quante persone servono per arrivare fino in cima?', 'L’<b>ordine di grandezza</b> è la potenza di 10 più vicina a una misura: non il numero esatto, ma se si tratta di decine, centinaia o migliaia. Un palazzo di 10 piani è alto circa 30 m, e la Torre Eiffel è molto più alta. Qual è l’ordine di grandezza della sua altezza?', 'Non serve il numero esatto: basta l’ordine di grandezza, cioè capire se sono decine, centinaia o migliaia di metri. Per confronto, un palazzo di 10 piani è alto circa 30 m. Quanto è alta, più o meno, la Torre Eiffel?'),
          options: [T('Circa 20', '10¹ m (decine di metri)', 'Come un palazzo di 5 piani'), T('Circa 200', '10² m (centinaia di metri)', 'Come un palazzo di 100 piani'), T('Circa 20.000', '10⁴ m (decine di km)', 'Come una montagna di 10 km')],
          answer: 1,
          predict: [{ exp: 0.2 }, { exp: 2.5 }],
          explain: T('La Torre è alta 330 metri: servono circa 200 persone una sopra l’altra!', '330 m = 3,3·10² m: ordine di grandezza 10² m.', '330 metri: circa quanto un palazzo di 100 piani.'),
        },
      ],
      hints: [T('Una persona è alta quasi 2 metri. La torre è molto più alta di un palazzo.')],
      solution: T('Circa 200 persone, cioè 330 metri.', '10² m: la torre è alta 330 m.'),
    },
    {
      id: 'f02-4', kind: 'costruisci', title: 'I cartelli del parco',
      intro: T('Il parco ha bisogno di cartelli con le misure giuste. Aiuta il custode con i conti!', 'Il parco ha bisogno di cartelli con le misure nel SI. Converti le unità.'),
      piece: { id: 'cartelli', name: 'I cartelli', desc: 'Altezze minime e durate dei giri scritte nelle unità giuste.' },
      steps: [{ kind: 'num', rounds: 3, text: T('Calcola e scrivi il numero.', 'Converti e scrivi solo il numero (la virgola va bene).'), gen: conv }],
      hints: [T('Fai una moltiplicazione.', 'Kilo = 1000, centi = 1/100, milli = 1/1000. Un minuto = 60 s.'), T('Scrivi solo il numero, senza unità.', 'Per passare da km a m moltiplichi per 1000; da cm a m dividi per 100; da g a kg dividi per 1000.')],
      solution: T('Moltiplica il numero dei pezzi per quanto è lungo (o dura) ognuno.', 'km→m ×1000 · cm→m ÷100 · g→kg ÷1000 · minuti→s ×60.'),
    },
    {
      id: 'f02-5', kind: 'ripasso', title: 'Ripasso delle misure',
      intro: T('Ripasso! Metti in ordine e rispondi.', 'Ripasso: ordini di grandezza, unità e metodo.'),
      steps: [
        {
          kind: 'order', text: T('Metti in ordine, dal più <b>piccolo</b> al più <b>grande</b>.', 'Ordina dal più piccolo al più grande.'),
          items: [
            { t: T('formica'), v: 4e-3 }, { t: T('persona'), v: 1.7 }, { t: T('balena'), v: 25 },
            { t: T('Torre Eiffel'), v: 330 }, { t: T('Everest'), v: 8848 }, { t: T('virus', 'virus (10⁻⁷ m)'), v: 1e-7 },
          ],
          explain: T('Perfetto! Dal virus all’Everest.', 'Perfetto: 10⁻⁷, 10⁻³, 10⁰, 10¹, 10², 10⁴ m.'),
        },
        {
          kind: 'q', text: T('Ripensa al pendolo: prima di lanciarlo dicevi che cosa, secondo te, sarebbe successo. Poi l’esperimento ti diceva se avevi ragione. Come si chiama quello che fai prima di un esperimento?', 'Nel metodo scientifico i passi hanno un ordine: si osserva, si fa una previsione che si possa controllare, si prova, si conclude. Che cosa viene subito prima dell’esperimento?'),
          options: [T('Una previsione', 'L’ipotesi'), T('Si scrive il risultato', 'La conclusione'), T('Si chiede a un esperto', 'La pubblicazione')], answer: 0,
          explain: T('Esatto: prima indovini, poi controlli!', 'Esatto: ipotesi, poi esperimento, poi conclusione.'), wrong: 'Ripensa al Laboratorio: prima indovini, poi…',
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: 'Da kg a grammi.',
          gen: () => { const k = pick([0.15, 0.25, 0.4, 0.75, 1.2]), g = Math.round(k * 1000); return { text: t('Sulla bilancia del parco c’è un pacco da <b>{k} kg</b>. Ricorda che «chilo» vuol dire mille: 1 kg = 1000 g. Quanti grammi pesa il pacco?', { k }), ans: g, tol: 0, unit: 'g', explain: t('Giusto: {k} × 1000 = {g} g.', { k, g }) }; },
        },
      ],
      hints: [T('Confronta due cose vicine alla volta: quale è più grande?')],
    },
    {
      id: 'f02-6', kind: 'boss', title: 'Il mito dell’atomo quasi visibile',
      sim: 'scale', params: { exp: -3 }, controls: ['exp'],
      intro: T(
        'Sono Vetrino. Un bambino dice: <i>“Un atomo è un granello di sabbia un po’ più piccolo”</i>. Sarà vero?',
        'Sono Vetrino. Un compagno sostiene: <i>“Un atomo è solo un po’ più piccolo di un granello di sabbia”</i>. Quanto è “un po’”?',
        'Sono Vetrino. Si sente dire che un atomo è “appena più piccolo di un granello di sabbia”. Vediamo i numeri.'),
      steps: [
        {
          kind: 'q', text: T('Tutto è fatto di <b>atomi</b>, pezzettini piccolissimi. Un granello di sabbia è già piccolo, ma un atomo lo è molto, molto di più. Secondo te, quanti atomi messi in fila servono per coprire la larghezza di un granello?', 'Un granello di sabbia è largo circa 10⁻³ m (un millimetro), un atomo circa 10⁻¹⁰ m. Per sapere quante volte uno sta nell’altro si dividono le due misure: con le potenze di 10 basta sottrarre gli esponenti. Quante volte è più piccolo l’atomo?'),
          options: [T('Circa 10', '10 volte (10¹)'), T('Circa 1000', '1000 volte (10³)'), T('Circa 10 milioni', '10 milioni di volte (10⁷)')], answer: 2,
          predict: [{ exp: -3 }, { exp: -10 }],
          explain: T('Dieci milioni! Il granello è un gigante per un atomo.', '10⁻³ / 10⁻¹⁰ = 10⁷: dieci milioni di volte.'),
        },
        {
          kind: 'q', text: T('Il bambino del mito diceva che un atomo è appena un po’ più piccolo di un granello di sabbia, quasi abbastanza grande da vederlo. Dopo quello che hai scoperto, aveva ragione?', 'Il mito dice che un atomo è «quasi visibile», appena più piccolo di un granello di sabbia. Un granello misura circa 10⁻³ m, un atomo circa 10⁻¹⁰ m: confronta i due ordini di grandezza. Il mito è vero?'),
          options: [T('Sì: sono tutti e due piccolissimi', 'Sì, la differenza è piccola'), T('No: l’atomo è molto, molto più piccolo', 'No: 7 ordini di grandezza di differenza'), T('Quasi: l’atomo è la metà', 'Quasi: al massimo un fattore 10 o 20')], answer: 1,
          explain: T('Mito smontato! Gli atomi sono così piccoli che non si vedono nemmeno col microscopio normale.', 'Mito smontato: 7 ordini di grandezza. Se un atomo fosse grande come un granello, il granello sarebbe lungo 10 km!'),
        },
      ],
      hints: [T('Vetrino chiede: quante volte hai mosso lo zoom per passare dal granello all’atomo?'), T('Vetrino chiede: ogni scatto dello zoom vale 10 volte. Quanti scatti sono 7?')],
      solution: T('Dieci milioni di volte (10⁷): il mito è falso.'),
    },
  ],
};
