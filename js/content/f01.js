// F01 · Cos'è la fisica e il metodo scientifico. Simulazione: il pendolo.
import { T, pick } from '../util.js';
import { t } from '../i18n.js';

const swingCheck = (r, tg, lens) => {
  const tol = lens === 'e' ? 0.2 : 0.1;
  const d = r.T - tg.T;
  if (Math.abs(d) <= tol) return { ok: true, msg: t('Un’oscillazione dura {T} s: proprio quello che serviva!', { T: r.T }) };
  return {
    ok: false,
    msg: d > 0
      ? t('Dura {T} s: troppo lenta.', { T: r.T }) + ' ' + (lens === 'e' ? t('Prova a cambiare il filo.') : t('Quale grandezza la rende più veloce?'))
      : t('Dura {T} s: troppo veloce.', { T: r.T }) + ' ' + (lens === 'e' ? t('Prova a cambiare il filo.') : t('Quale grandezza la rende più lenta?')),
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
            T('Chiede all’amico più grande e fa come dice lui', 'Cercare la risposta su internet o sul libro', 'Che la sostiene un esperto famoso e stimato'),
            T('Prova a indovinare, poi controlla con una prova', 'Un’ipotesi da controllare con un esperimento', 'Che un esperimento potrebbe smentirla'),
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
          // Controllo delle variabili come passo interattivo: per ogni variabile scegli se cambia o resta uguale.
          kind: 'vars',
          text: T('Vuoi scoprire se il <b>peso</b> della pallina cambia il pendolo. Tra un esperimento e l’altro, cosa cambi e cosa tieni uguale?', 'Vuoi scoprire se la <b>massa</b> influisce sul periodo. Prepara l’esperimento: per ogni variabile, cambia o resta uguale?'),
          vars: [{ k: 'L', t: T('il filo', 'la lunghezza del filo') }, { k: 'm', t: T('il peso', 'la massa') }, { k: 'a', t: T('quanto lo sposti', 'l’angolo di partenza') }],
          change: 'm',
          explain: T('Giusto: cambi solo il peso, così se qualcosa cambia sai che è merito suo.', 'Giusto: se cambi solo la massa, ogni differenza nel periodo dipende dalla massa.'),
          wrong: T('Se cambi due cose insieme, poi non sai quale delle due ha fatto la differenza!', 'Se cambi due variabili insieme non puoi sapere quale ha causato l’effetto.'),
        },
        {
          kind: 'free', runs: 2, controls: ['m'],
          text: T('Prova tu: lancia con un peso, poi cambia <b>solo il peso</b> e lancia di nuovo.', 'Esperimento: lancia, cambia <b>solo la massa</b>, rilancia. Confronta i due periodi.'),
          onRun: (r) => t('Questa volta: un’oscillazione dura <b>{T} s</b>.', { T: r.T }),
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
            'Il periodo raddoppia (da circa 1,43 s a 2,86 s) quando il filo diventa 4 volte più lungo: dipende dalla <b>radice quadrata</b> della lunghezza. T = 2π·√(L/g), dove g = 9,81 m/s² misura quanto tira la gravità (la studierai nella Pista).',
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
      piece: { id: 'altalena', name: 'L’altalena', desc: 'Oscilla con il ritmo che hai scelto tu, regolando la lunghezza.' },
      steps: [
        {
          kind: 'tune', rounds: 2,
          text: T('Regola l’altalena e lanciala.', 'Regola il pendolo per ottenere il periodo richiesto. La verifica cambierà valore: serve la regola, non la fortuna.'),
          gen: (lens, r) => {
            const T0 = pick(r === 0 ? [1.4, 1.6, 2.0, 2.2] : [1.2, 1.8, 2.4, 2.8]);
            return { T: T0, text: t('Un’oscillazione deve durare <b>{T:1} secondi</b>.', { T: T0 }) };
          },
          // valori che risolvono la prova: servono al test automatico che gioca tutti i livelli
          solve: (tg) => ({ L: (9.81 * tg.T * tg.T) / (4 * Math.PI * Math.PI) }),
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
          options: [T('Per fare prima e finire presto', 'Per risparmiare tempo nei calcoli'), T('Perché una sola dura troppo poco per misurarla', 'Per ridurre l’errore di misura'), T('Perché all’inizio il pendolo va più piano', 'Perché il pendolo all’inizio è lento')],
          answer: 1, explain: T('Giusto: un tempo più lungo si misura meglio.', 'Giusto: l’errore del cronometro (la reazione del dito, per esempio) si divide per 5.'),
        },
        {
          kind: 'q', text: T('Cosa cambia il ritmo di un pendolo?', 'Da quale variabile dipende davvero il periodo del pendolo?'),
          options: [T('Il peso della pallina', 'La massa'), T('La lunghezza del filo', 'La lunghezza'), T('Quanto lo sposti all’inizio', 'L’angolo')],
          answer: 1, explain: T('Esatto: conta il filo!', 'Esatto: per angoli piccoli conta solo la lunghezza (e la gravità del pianeta).'),
        },
        {
          kind: 'vars', text: T('Vuoi sapere se il <b>filo</b> conta. Prepara l’esperimento: cosa cambi e cosa tieni uguale?', 'Vuoi studiare l’effetto della <b>lunghezza</b>. Per ogni variabile: cambia o resta fissa?'),
          vars: [{ k: 'L', t: T('il filo', 'la lunghezza del filo') }, { k: 'm', t: T('il peso', 'la massa') }, { k: 'a', t: T('quanto lo sposti', 'l’angolo di partenza') }],
          change: 'L',
          wrong: T('Tieni tutto uguale tranne quello che vuoi studiare.', 'Si cambia solo la variabile studiata.'),
          explain: T('Proprio così: tutto uguale tranne quello che vuoi studiare.', 'Esatto: si cambia la variabile studiata e si tengono fisse tutte le altre.'),
        },
      ],
      hints: [T('Ripensa al livello “Una cosa alla volta”.')],
    },
    {
      // Boss: applica il metodo a una variabile nuova (l'angolo), invece di rifare la lezione sulla massa.
      id: 'f01-6', kind: 'boss', title: 'Il mito della spinta forte',
      sim: 'pendulum', params: { L: 1, m: 0.5, a: 20, n: 3 }, controls: ['L', 'm', 'a'],
      intro: T(
        'Ciao, sono Vetrino. Un bambino al parco dice: <i>“Se spingo l’altalena più in alto, ci mette tantissimo di più a tornare!”</i>. Sarà vero? Scopriamolo con un esperimento.',
        'Sono Vetrino. Un cartello al parco dice: <i>“Più grande è l’oscillazione, molto più lungo è il periodo”</i>. Hai già visto massa e lunghezza: ora tocca all’angolo.',
        'Sono Vetrino. Molti pensano: <i>“Un pendolo che oscilla largo impiega molto più tempo”</i>. Non ti dico se è vero: chiedi all’esperimento.'),
      steps: [
        {
          kind: 'q', text: T('Quale esperimento ci serve?', 'Quale esperimento mette alla prova il mito?'),
          options: [
            T('Stesso filo e stesso peso: prima spostato poco, poi tanto', 'Stessi L e m, angolo 5° e poi 60°'),
            T('Un filo corto spostato poco e uno lungo spostato tanto', 'Angolo 5° con filo corto, 60° con filo lungo'),
            T('Spostato tanto, una volta sola, guardando bene', 'Un solo lancio a 60°, misurato con cura'),
          ],
          answer: 0, explain: T('Giusto: cambia solo quanto lo sposti. Ora la previsione!', 'Giusto: cambia solo l’angolo. Ora la previsione.'),
          wrong: T('Mmh, così cambiano due cose insieme… o non confronti niente. Come capiresti chi ha ragione?', 'Così non isoli l’angolo: che cosa causerebbe la differenza?'),
        },
        {
          kind: 'q', text: T('Spostato tanto (60°), il pendolo ci metterà…', 'A 60° invece che a 5°, il periodo sarà…'),
          options: [T('il doppio del tempo', 'circa il doppio'), T('quasi lo stesso tempo', 'quasi uguale, appena più lungo'), T('la metà del tempo', 'circa la metà')],
          answer: 1,
          predict: [{ L: 1, m: 0.5, a: 5 }, { L: 1, m: 0.5, a: 60 }],
          explain: T('Quasi uguale: circa 2,0 s e 2,15 s. Va più veloce, ma fa anche più strada!',
            '5°: circa 2,01 s; 60°: circa 2,15 s. Solo il 7% in più: T = 2π·√(L/g) vale bene per angoli piccoli, e resta una buona stima fino a 20–30°.',
            'Circa 2,01 s contro 2,15 s: solo il 7% in più. Per questo un orologio a pendolo resta preciso anche se l’oscillazione si smorza piano piano.'),
        },
        {
          kind: 'q', text: T('Allora, il bambino aveva ragione?', 'Conclusione?'),
          options: [T('Sì: spinto in alto ci mette molto di più', 'Il mito è vero: angolo triplo, periodo triplo'), T('No: il tempo cambia pochissimo', 'Il mito è falso: il periodo cresce appena'), T('Dipende da quanto pesa chi è sopra', 'Dipende dalla massa appesa')],
          answer: 1,
          explain: T('Mito smontato! Spingere di più fa andare più in alto, non più lenti.', 'Mito smontato: il periodo dipende quasi solo da L e g; l’angolo conta poco, e solo quando è grande.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi due cose insieme, a chi dai la colpa?'), T('Vetrino chiede: un pendolo spostato tanto va più veloce in basso, ma fa anche più strada. Chi vince?')],
      solution: T('Stesso pendolo, 5° e poi 60°: i tempi sono quasi uguali (2,0 e 2,15 s), quindi il mito è falso.'),
    },
  ],
};
