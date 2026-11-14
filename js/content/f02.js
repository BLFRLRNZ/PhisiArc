// F02 · Grandezze, unità di misura e ordini di grandezza. Simulazione: lo zoom delle scale.
import { T, pick } from '../util.js';

const conv = (lens, r) => {
  if (lens === 'e') {
    const kind = r === 0 ? 'treno' : 'ruota';
    if (kind === 'treno') {
      const n = pick([3, 4, 5, 6, 7]);
      return { text: `Il trenino del parco ha <b>${n} vagoni</b>, e ogni vagone è lungo <b>2 metri</b>. Quanto è lungo tutto il trenino?`, ans: n * 2, tol: 0, unit: 'metri', explain: `Giusto: ${n} volte 2 fa ${n * 2} metri.` };
    }
    const m = pick([2, 3, 4, 5]);
    return { text: `Un giro sulla ruota panoramica dura <b>${m} minuti</b>. Un minuto ha 60 secondi. Quanti secondi dura il giro?`, ans: m * 60, tol: 0, unit: 'secondi', explain: `Giusto: ${m} × 60 = ${m * 60} secondi.` };
  }
  const opts = [
    () => { const v = pick([35, 42, 48, 55, 63]); return { text: `La montagna russa è alta <b>0,0${v} km</b>. Quanti metri sono?`, ans: v, tol: 0.01, unit: 'm', explain: `1 km = 1000 m, quindi 0,0${v} × 1000 = ${v} m.` }; },
    () => { const v = pick([120, 135, 150, 185]); return { text: `Per salire su una giostra bisogna essere alti almeno <b>${v} cm</b>. In metri?`, ans: v / 100, tol: 0.001, unit: 'm', explain: `100 cm = 1 m, quindi ${v} cm = ${String(v / 100).replace('.', ',')} m.` }; },
    () => { const m = pick([2, 3, 4]), s = pick([15, 20, 40]); return { text: `Un giro di giostra dura <b>${m} minuti e ${s} secondi</b>. Quanti secondi in tutto?`, ans: m * 60 + s, tol: 0, unit: 's', explain: `${m} × 60 + ${s} = ${m * 60 + s} s.` }; },
    () => { const g = pick([250, 400, 750, 1500]); return { text: `Il sacchetto di zucchero filato pesa <b>${g} g</b>. In chilogrammi?`, ans: g / 1000, tol: 0.0001, unit: 'kg', explain: `1 kg = 1000 g, quindi ${g} g = ${String(g / 1000).replace('.', ',')} kg.` }; },
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
          text: T('Chi è più grande?', 'Il diametro del Sole è circa quante volte quello della Terra?', 'Quante Terre servono, in fila, per coprire il diametro del Sole?'),
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
          kind: 'q', only: ['e'], text: 'Con cosa misuri quanto sei alto?',
          options: ['Con i secondi', 'Con i metri', 'Con i chili'], answer: 1, explain: 'Esatto: l’altezza è una lunghezza, e si misura in metri.',
        },
        {
          kind: 'q', only: ['e'], text: 'Quanto dura una canzone? Scegli l’unità giusta.',
          options: ['Pochi minuti', 'Pochi metri', 'Pochi chili'], answer: 0, explain: 'Giusto: il tempo si misura in secondi e minuti.',
        },
        {
          kind: 'q', only: ['s', 'c'], text: T('', 'Quale di queste è un’unità fondamentale del SI?', 'Quale di queste è un’unità del Sistema Internazionale?'),
          options: ['Il pollice', 'Il chilogrammo', 'L’ora'], answer: 1, explain: T('', 'Il kg è l’unità SI della massa. L’ora si usa, ma l’unità SI del tempo è il secondo.'),
        },
        {
          kind: 'q', only: ['s', 'c'], text: '1 km è uguale a…', options: ['10 m', '100 m', '1000 m'], answer: 2,
          explain: T('', '“Kilo” vuol dire mille: 1 km = 10³ m. “Milli” vuol dire un millesimo: 1 mm = 10⁻³ m.'),
        },
      ],
      hints: [T('Pensa a cosa stai misurando: una lunghezza, un tempo o un peso?'), T('Nel SI: metro, secondo, chilogrammo.')],
      solution: T('Lunghezze in metri, tempi in secondi, masse in chilogrammi.'),
    },
    {
      id: 'f02-3', kind: 'prevedi', title: 'Quanto è alta la Torre Eiffel?',
      sim: 'scale', params: { exp: 0 }, controls: ['exp'],
      intro: T('Stima! Non serve sapere il numero esatto, basta avvicinarsi.', 'Una <b>stima</b> è una risposta approssimata: basta indovinare l’<b>ordine di grandezza</b>, cioè la potenza di 10.'),
      steps: [
        {
          kind: 'q',
          text: T('Quante persone, una sopra l’altra, servono per arrivare in cima alla Torre Eiffel?', 'Qual è l’ordine di grandezza dell’altezza della Torre Eiffel?', 'Quanto è alta, più o meno, la Torre Eiffel?'),
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
          kind: 'q', text: T('Prima di un esperimento, cosa fai?', 'Il metodo scientifico: cosa viene prima dell’esperimento?'),
          options: [T('Una previsione', 'L’ipotesi'), T('Si scrive il risultato', 'La conclusione'), T('Si chiede a un esperto', 'La pubblicazione')], answer: 0,
          explain: T('Esatto: prima indovini, poi controlli!', 'Esatto: ipotesi, poi esperimento, poi conclusione.'), wrong: 'Ripensa al Laboratorio: prima indovini, poi…',
        },
        {
          kind: 'num', only: ['s', 'c'], rounds: 1, text: 'Da kg a grammi.',
          gen: () => { const k = pick([0.15, 0.25, 0.4, 0.75, 1.2]), g = Math.round(k * 1000); return { text: `<b>${String(k).replace('.', ',')} kg</b> quanti grammi sono?`, ans: g, tol: 0, unit: 'g', explain: `Giusto: ${String(k).replace('.', ',')} × 1000 = ${g} g.` }; },
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
          kind: 'q', text: T('Secondo te, quanti atomi in fila servono per fare un granello di sabbia?', 'Granello: 10⁻³ m. Atomo: 10⁻¹⁰ m. Quante volte è più piccolo l’atomo?'),
          options: [T('Circa 10', '10 volte (10¹)'), T('Circa 1000', '1000 volte (10³)'), T('Circa 10 milioni', '10 milioni di volte (10⁷)')], answer: 2,
          predict: [{ exp: -3 }, { exp: -10 }],
          explain: T('Dieci milioni! Il granello è un gigante per un atomo.', '10⁻³ / 10⁻¹⁰ = 10⁷: dieci milioni di volte.'),
        },
        {
          kind: 'q', text: T('Allora il bambino aveva ragione?', 'Il mito è vero?'),
          options: [T('Sì: sono tutti e due piccolissimi', 'Sì, la differenza è piccola'), T('No: l’atomo è molto, molto più piccolo', 'No: 7 ordini di grandezza di differenza'), T('Quasi: l’atomo è la metà', 'Quasi: al massimo un fattore 10 o 20')], answer: 1,
          explain: T('Mito smontato! Gli atomi sono così piccoli che non si vedono nemmeno col microscopio normale.', 'Mito smontato: 7 ordini di grandezza. Se un atomo fosse grande come un granello, il granello sarebbe lungo 10 km!'),
        },
      ],
      hints: [T('Vetrino chiede: quante volte hai mosso lo zoom per passare dal granello all’atomo?'), T('Vetrino chiede: ogni scatto dello zoom vale 10 volte. Quanti scatti sono 7?')],
      solution: T('Dieci milioni di volte (10⁷): il mito è falso.'),
    },
  ],
};
