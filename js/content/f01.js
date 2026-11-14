// F01 · Cos'è la fisica e il metodo scientifico. Simulazione: il pendolo.
import { T, pick, num } from '../util.js';

const swingCheck = (r, tg, lens) => {
  const tol = lens === 'e' ? 0.2 : 0.1;
  const d = r.T - tg.T;
  if (Math.abs(d) <= tol) return { ok: true, msg: `Un’oscillazione dura ${num(r.T, 2)} s: proprio quello che serviva!` };
  return {
    ok: false,
    msg: d > 0
      ? `Dura ${num(r.T, 2)} s: troppo lenta. ${lens === 'e' ? 'Prova a cambiare il filo.' : 'Quale grandezza la rende più veloce?'}`
      : `Dura ${num(r.T, 2)} s: troppo veloce. ${lens === 'e' ? 'Prova a cambiare il filo.' : 'Quale grandezza la rende più lenta?'}`,
  };
};

export default {
  id: 'F01',
  title: 'Il metodo scientifico',
  sim: 'pendulum',
  levels: [
    {
      id: 'f01-1', kind: 'lezione', title: 'Prima indovini, poi controlli',
      sim: 'pendulum', params: { L: 1, m: 0.5, a: 20, n: 5 }, controls: ['L', 'm', 'a'],
      intro: T(
        'Questo è un <b>pendolo</b>: una pallina appesa a un filo. Premi ▶ Lancia e guardalo andare avanti e indietro.',
        'La fisica parte sempre da un’osservazione. Questo è un <b>pendolo</b>: lancialo e osserva quanto dura un’oscillazione (un’andata e ritorno).',
        'Tutta la fisica comincia con una domanda su qualcosa che si vede. Ecco un <b>pendolo</b>, lo stesso oggetto che incuriosì Galileo in una chiesa di Pisa.'),
      steps: [
        { kind: 'free', runs: 1, text: T('Premi ▶ Lancia e guarda il pendolo.', 'Lancia il pendolo: il cronometro misura 5 oscillazioni e calcola quanto dura una sola.') },
        {
          kind: 'q',
          text: T('Vuoi sapere se una cosa è vera. Cosa fa uno scienziato?', 'Qual è il primo passo del metodo scientifico dopo l’osservazione?', 'Cosa distingue un’idea scientifica da un’opinione?'),
          options: [
            T('Chiede all’amico più grande', 'Cercare la risposta su internet', 'Che la dice un esperto famoso'),
            T('Fa una previsione e poi prova a vedere se è giusta', 'Formulare un’ipotesi che si può controllare con un esperimento', 'Che si può mettere alla prova con un esperimento, e potrebbe risultare falsa'),
            T('Sceglie la risposta che gli piace di più', 'Scegliere la spiegazione più semplice', 'Che piace alla maggior parte delle persone'),
          ],
          answer: 1,
          explain: T('Esatto! <b>Prima indovini, poi controlli.</b> È il trucco di tutti gli scienziati.',
            'Esatto: un’<b>ipotesi</b> è una previsione che un esperimento può confermare o smentire.',
            'Esatto: un’idea è scientifica se un esperimento potrebbe smentirla. È ciò che la rende affidabile.'),
        },
      ],
      hints: [T('Pensa a quello che hai appena fatto: hai guardato e poi…?', 'Un’ipotesi deve poter essere controllata.'), T('La risposta giusta ha due parti: una previsione e una prova.')],
      solution: T('La seconda risposta: si fa una previsione e poi la si controlla con un esperimento.'),
    },
    {
      id: 'f01-2', kind: 'lezione', title: 'Una cosa alla volta',
      sim: 'pendulum', params: { L: 1, m: 0.5, a: 20, n: 5 }, controls: ['L', 'm', 'a'],
      intro: T(
        'Il pendolo ha tre cose che puoi cambiare: il <b>filo</b>, il <b>peso</b> e quanto lo <b>sposti</b> all’inizio.',
        'Il pendolo ha tre <b>variabili</b>: lunghezza del filo, massa e angolo di partenza. Per capire quale conta, si cambia <b>una sola variabile alla volta</b>.',
        'Per capire da cosa dipende qualcosa, gli scienziati cambiano <b>una sola cosa alla volta</b> e tengono ferme le altre. Si chiama controllo delle variabili.'),
      steps: [
        {
          kind: 'q',
          text: T('Vuoi scoprire se il <b>peso</b> della pallina cambia il pendolo. Cosa cambi?', 'Vuoi scoprire se la <b>massa</b> influisce sul periodo. Cosa cambi tra un esperimento e l’altro?'),
          options: [T('Il peso e anche il filo', 'Massa e lunghezza insieme'), T('Tutto quanto', 'Tutte e tre le variabili'), T('Solo il peso', 'Solo la massa')],
          answer: 2,
          explain: T('Giusto: cambi solo il peso, così se qualcosa cambia sai che è merito suo.', 'Giusto: se cambi solo la massa, ogni differenza nel periodo dipende dalla massa.'),
          wrong: T('Se cambi due cose insieme, poi non sai quale delle due ha fatto la differenza!', 'Se cambi due variabili insieme non puoi sapere quale ha causato l’effetto.'),
        },
        {
          kind: 'free', runs: 2, controls: ['m'],
          text: T('Prova tu: lancia con un peso, poi cambia <b>solo il peso</b> e lancia di nuovo.', 'Esperimento: lancia, cambia <b>solo la massa</b>, rilancia. Confronta i due periodi.'),
          onRun: (r) => `Questa volta: un’oscillazione dura <b>${num(r.T, 2)} s</b>.`,
        },
        {
          kind: 'q',
          text: T('Il peso ha cambiato il tempo del pendolo?', 'Cosa mostrano i tuoi due esperimenti?'),
          options: [T('Sì, molto', 'Più massa, periodo molto più lungo'), T('No, quasi per niente', 'Il periodo non dipende dalla massa'), T('Sì, è più veloce', 'Più massa, periodo molto più breve')],
          answer: 1,
          explain: T('Proprio così: pesante o leggero, il pendolo va allo stesso ritmo. Sorprendente, vero?', 'Esatto: il periodo non dipende dalla massa. Lo scoprì Galileo, e lo spiegò Newton.'),
        },
      ],
      hints: [T('Guarda il numero in basso dopo ogni lancio: è cambiato tanto?'), T('Confronta i due tempi: differiscono solo di qualche millesimo.')],
      solution: T('Si cambia solo il peso, e il tempo resta lo stesso: il peso non conta.', 'Si cambia solo la massa; il periodo resta uguale, quindi non dipende dalla massa.'),
    },
    {
      id: 'f01-3', kind: 'prevedi', title: 'Il filo lungo',
      sim: 'pendulum', params: { L: 0.5, m: 0.5, a: 20, n: 3 }, controls: ['L', 'm', 'a'],
      intro: T('Adesso il filo cambia: prima corto, poi lungo. Fai la tua previsione!', 'Ora la variabile è la lunghezza del filo. Prima la previsione, poi l’esperimento.'),
      steps: [
        {
          kind: 'q',
          text: T('Allunghi il filo da 0,5 m a 2 m. Il pendolo andrà…', 'Il filo passa da 0,5 m a 2 m (4 volte più lungo). Il periodo…'),
          options: [T('più veloce', 'diventa più breve'), T('uguale', 'resta uguale'), T('più lento', 'diventa più lungo')],
          answer: 2,
          predict: [{ L: 0.5 }, { L: 2 }],
          explain: T('Con il filo lungo il pendolo è più lento. Le altalene con le catene lunghe vanno piano!',
            'Il periodo raddoppia (da 1,4 s a 2,8 s) quando il filo diventa 4 volte più lungo: dipende dalla <b>radice quadrata</b> della lunghezza. T = 2π·√(L/g).',
            'Il filo lungo rende il pendolo più lento: 4 volte più lungo, il doppio del tempo. Per questo gli orologi a pendolo si regolano spostando il peso su o giù.'),
        },
      ],
      hints: [T('Pensa a un’altalena con le catene lunghissime.')],
      solution: T('Più lento: il filo lungo allunga il tempo di ogni oscillazione.'),
    },
    {
      id: 'f01-4', kind: 'costruisci', title: 'L’altalena del parco',
      sim: 'pendulum', params: { L: 1, m: 1, a: 20, n: 3 }, controls: ['L', 'm'],
      intro: T(
        'Cominciamo a costruire il tuo <b>parco divertimenti</b>! Il primo gioco è un’altalena. Il custode vuole che ogni andata e ritorno duri un tempo preciso.',
        'Primo pezzo del tuo <b>parco divertimenti</b>: un’altalena (un pendolo) con un periodo preciso. Usa quello che hai scoperto sulle variabili.',
        'Primo pezzo del tuo <b>parco divertimenti</b>: un’altalena con un ritmo preciso. Scegli la variabile giusta.'),
      piece: { id: 'altalena', icon: '🎠', name: 'L’altalena', desc: 'Oscilla con il ritmo che hai scelto tu, regolando la lunghezza.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Regola l’altalena e lanciala.', 'Regola il pendolo per ottenere il periodo richiesto. La verifica cambierà valore: serve la regola, non la fortuna.'),
          gen: (lens, r) => {
            const T0 = pick(r === 0 ? [1.4, 1.6, 2.0, 2.2] : [1.2, 1.8, 2.4, 2.8]);
            return { T: T0, text: `Un’oscillazione deve durare <b>${num(T0, 1)} secondi</b>.` };
          },
          check: swingCheck,
        },
      ],
      hints: [T('Il peso non cambia il ritmo, ricordi? Allora cosa resta da cambiare?', 'Delle due variabili, una non conta. Quale resta?'), T('Filo più lungo, altalena più lenta. Filo più corto, più veloce.', 'Il periodo cresce con la radice della lunghezza: per raddoppiare il periodo serve un filo 4 volte più lungo.')],
      solution: T('Cambia solo il filo: circa 1 metro per 2 secondi, mezzo metro per 1,4 secondi, 2 metri per 2,8 secondi.', 'L = g·T²/(4π²): per T = 2 s, L ≈ 0,99 m; per T = 1,4 s, L ≈ 0,49 m.'),
    },
    {
      id: 'f01-5', kind: 'ripasso', title: 'Ripasso del metodo',
      intro: T('Ripassiamo! Quattro domande sul metodo degli scienziati.', 'Ripasso: quattro domande sul metodo scientifico.'),
      steps: [
        {
          kind: 'q', text: T('Hai previsto una cosa, ma l’esperimento dice il contrario. Cosa fai?', 'L’esperimento smentisce la tua ipotesi. Cosa fai?'),
          options: [T('Faccio finta di niente', 'Ignori il risultato'), T('Cambio idea: l’esperimento ha ragione', 'Cambi o correggi l’ipotesi'), T('Rifaccio finché viene come dico io', 'Ripeti finché il risultato ti dà ragione')],
          answer: 1, explain: T('Bravo! Anche i grandi scienziati cambiano idea quando l’esperimento lo dice.', 'Esatto: un’ipotesi smentita va corretta. È così che la scienza migliora.'),
        },
        {
          kind: 'q', text: T('Perché il cronometro conta 5 oscillazioni e non una sola?', 'Perché si misura il tempo di 5 oscillazioni e poi si divide per 5?'),
          options: [T('Per fare prima', 'Per risparmiare tempo'), T('Perché una sola è troppo veloce da misurare bene', 'Per ridurre l’errore di misura'), T('Perché 5 è un numero fortunato', 'Perché il pendolo all’inizio è lento')],
          answer: 1, explain: T('Giusto: un tempo più lungo si misura meglio.', 'Giusto: l’errore del cronometro (la reazione del dito, per esempio) si divide per 5.'),
        },
        {
          kind: 'q', text: T('Cosa cambia il ritmo di un pendolo?', 'Da quale variabile dipende davvero il periodo del pendolo?'),
          options: [T('Il peso della pallina', 'La massa'), T('La lunghezza del filo', 'La lunghezza'), T('Il colore della pallina', 'Il colore')],
          answer: 1, explain: T('Esatto: conta il filo!', 'Esatto: per angoli piccoli conta solo la lunghezza (e la gravità del pianeta).'),
        },
        {
          kind: 'q', text: T('Per sapere se il filo conta, cosa tieni uguale?', 'Per studiare l’effetto della lunghezza, quali variabili tieni fisse?'),
          options: [T('Niente', 'Nessuna'), T('Solo il filo', 'Solo la lunghezza'), T('Il peso e quanto lo sposti', 'Massa e angolo')],
          answer: 2, explain: T('Proprio così: tutto uguale tranne quello che vuoi studiare.', 'Esatto: si cambia la variabile studiata e si tengono fisse tutte le altre.'),
        },
      ],
      hints: [T('Ripensa al livello “Una cosa alla volta”.')],
    },
    {
      id: 'f01-6', kind: 'boss', title: 'Il mito del pendolo pesante',
      sim: 'pendulum', params: { L: 1, m: 0.5, a: 20, n: 3 }, controls: ['L', 'm', 'a'],
      intro: T(
        'Ciao, sono Dubbia. Un signore al parco dice: <i>“Il pendolo pesante va più piano, è ovvio!”</i>. È davvero ovvio? Scopriamolo con un esperimento.',
        'Sono Dubbia. Un cartello al parco dice: <i>“Più è pesante, più il pendolo è lento”</i>. Sembra sensato. Ma lo hai controllato?',
        'Sono Dubbia. Molti pensano: <i>“Un pendolo più pesante oscilla più lentamente”</i>. Non ti dico se è vero: chiedi all’esperimento.'),
      steps: [
        {
          kind: 'q', text: T('Quale esperimento ci serve?', 'Quale esperimento mette alla prova il mito?'),
          options: [
            T('Due pendoli con lo stesso filo, uno leggero e uno pesante', 'Stessa lunghezza e angolo, massa 0,2 kg e poi 3 kg'),
            T('Un pendolo corto leggero e uno lungo pesante', 'Massa 0,2 kg con filo corto, massa 3 kg con filo lungo'),
            T('Un pendolo solo, guardato tanto', 'Un solo pendolo, misurato molte volte'),
          ],
          answer: 0, explain: T('Giusto: cambia solo il peso. Ora guardiamo!', 'Giusto: cambia solo la massa. Ora l’esperimento.'),
          wrong: T('Mmh, così cambiano due cose insieme… o nessuna. Come capiresti chi ha ragione?', 'Così non isoli la massa: che cosa causerebbe la differenza?'),
        },
        { kind: 'run', text: T('Ecco l’esperimento: prima il pendolo leggero, poi quello pesante.', 'Esperimento: 0,2 kg e poi 3 kg, stesso filo da 1 m.'), seq: [{ m: 0.2, L: 1, a: 20 }, { m: 3, L: 1, a: 20 }], explain: T('Guarda i due tempi.', 'Confronta i due periodi.') },
        {
          kind: 'q', text: T('Allora, il signore aveva ragione?', 'Conclusione?'),
          options: [T('Sì', 'Il mito è vero'), T('No: pesante o leggero, il tempo è lo stesso', 'Il mito è falso: il periodo non dipende dalla massa'), T('Non si può sapere', 'Non si può concludere niente')],
          answer: 1,
          explain: T('Mito smontato! Ricorda: anche le cose “ovvie” vanno controllate.', 'Mito smontato: il periodo dipende da L e g, non dalla massa. Le cose “ovvie” si controllano.'),
        },
      ],
      hints: [T('Dubbia chiede: se cambi due cose insieme, a chi dai la colpa?'), T('Dubbia chiede: i due tempi che hai visto sono davvero diversi?')],
      solution: T('Stesso filo, pesi diversi: i tempi sono uguali, quindi il mito è falso.'),
    },
  ],
};
