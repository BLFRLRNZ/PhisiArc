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
        { kind: 'free', runs: 1, text: T('Premi ▶ Lancia e guarda il pendolo. Il cronometro conta 5 andate e ritorni: un tempo lungo si misura meglio di uno corto.', 'Lancia il pendolo: il cronometro misura 5 oscillazioni e divide per 5. Chi preme il cronometro sbaglia sempre di un soffio: su un tempo più lungo, quell’errore pesa meno.') },
        {
          kind: 'q',
          text: T('Hai un’idea: «se spingo forte, il pendolo va più veloce». Come scopri se è vera?', 'Il <b>metodo scientifico</b> è la strada che porta da quello che vedi a una conoscenza di cui ti puoi fidare. Il primo passo è osservare, come hai fatto con il pendolo. Che cosa viene subito dopo l’osservazione?', 'Tutti hanno idee su come funziona il mondo, ma non tutte sono scientifiche. Pensa a che cosa si può fare con un’idea scientifica che con una semplice opinione non si può fare. Che cosa le distingue?'),
          options: [
            T('Lo chiedo a un amico più grande', 'Cercare la risposta su internet o sul libro', 'Che la sostiene un esperto famoso e stimato'),
            T('Faccio una prova e guardo', 'Un’ipotesi da controllare con un esperimento', 'Che un esperimento potrebbe smentirla'),
            T('Scelgo la risposta che mi piace', 'Scegliere la spiegazione più semplice', 'Che piace alla maggior parte delle persone'),
          ],
          answer: 1,
          explain: T('Esatto! <b>Prima indovini, poi controlli.</b> È il trucco di tutti gli scienziati.',
            'Esatto: un’<b>ipotesi</b> è una previsione che un esperimento può confermare o smentire.',
            'Esatto: un’idea è scientifica se un esperimento potrebbe smentirla. È ciò che la rende affidabile.'),
        },
      ],
      hints: [T('Pensa a quello che hai appena fatto: hai guardato e poi…?', 'Un’ipotesi deve poter essere controllata.', 'Un’opinione si può solo condividere o no. E un’idea scientifica?'), T('La risposta giusta parla di una prova.', 'La risposta giusta ha due parti: una previsione e una prova.', 'Pensa a che cosa può succedere a un’idea quando la metti alla prova.')],
      solution: T('Si fa una prova e si guarda che cosa succede.', 'Si fa un’ipotesi e poi la si controlla con un esperimento.', 'Un’idea è scientifica se un esperimento potrebbe smentirla.'),
    },
    {
      id: 'f01-2', kind: 'lezione', title: 'Una cosa alla volta',
      // Solo filo e peso: l'angolo cambia il tempo di pochissimo (2,02 s a 20°, 2,04 s a 30°) e la risposta sarebbe ambigua. All'angolo pensa il boss.
      sim: 'pendulum', params: { L: 1, m: 0.5, a: 20, n: 5 }, controls: ['L', 'm'],
      intro: T(
        'Del pendolo puoi cambiare due cose: quanto è lungo il <b>filo</b> e quanto pesa la <b>pallina</b>.',
        'Qui il pendolo ha due <b>variabili</b>: la lunghezza del filo e la massa. Per capire quale conta, si cambia <b>una sola variabile alla volta</b>.',
        'Per capire da cosa dipende qualcosa, gli scienziati cambiano <b>una sola cosa alla volta</b> e tengono ferme le altre. Si chiama controllo delle variabili.'),
      steps: [
        {
          // Il passo è una scoperta: la domanda non dice quale cosa non conta, lo trova chi gioca cambiando una cosa alla volta.
          kind: 'free', runs: 3, distinct: true, controls: ['L', 'm'],
          text: T('Una delle due <b>non cambia</b> il tempo del pendolo. <b>Scopri quale!</b> Lancia, poi cambia <b>una cosa sola</b> e rilancia.', 'Una delle due variabili <b>non influisce</b> sul periodo, cioè sul tempo di un’andata e ritorno. <b>Scopri quale.</b> Fai un lancio, poi cambia <b>una sola variabile</b> e rilancia: se ne cambi due insieme, non sai quale ha fatto la differenza.'),
          onRun: (r) => t('Un’oscillazione dura <b>{T} s</b>. Ora cambia una cosa sola e rilancia.', { T: r.T }),
        },
        {
          kind: 'q',
          text: T('Allora: quale delle due <b>non cambia</b> il tempo del pendolo?', 'Quale variabile <b>non influisce</b> sul periodo del pendolo?'),
          options: [T('il filo', 'la lunghezza del filo'), T('il peso della pallina', 'la massa della pallina'), T('nessuna: contano tutte e due', 'nessuna: influiscono entrambe')],
          answer: 1,
          wrong: T('Non è questa: prova a cambiare solo quella e rilancia. Il tempo cambia?', 'Non è questa: cambia solo quella variabile e rilancia. Il periodo cambia?'),
          explain: T('Esatto: pesante o leggera, la pallina va allo stesso ritmo. L’hai scoperto cambiando <b>una cosa alla volta</b>, come fanno gli scienziati!',
            'Esatto: il periodo <b>non dipende dalla massa</b> (lo scoprì Galileo). Il filo invece conta molto. L’hai scoperto cambiando una variabile alla volta: si chiama <b>controllo delle variabili</b>. C’è una terza variabile, l’angolo di partenza: la metterà alla prova Vetrino.'),
        },
      ],
      hints: [T('Muovi un cursore solo per volta. Prova con il peso: lancia con la pallina leggera, poi con quella pesante. Il tempo cambia?', 'Muovi un cursore solo per volta. Prova con la massa: lancia con 0,5 kg, poi con 3 kg. Il periodo cambia?'), T('Se il numero resta uguale dopo che hai cambiato una cosa, quella cosa non conta.')],
      solution: T('Il peso: se cambi solo il peso, il tempo di andata e ritorno resta uguale.', 'La massa: se cambi solo la massa, il periodo resta uguale.'),
    },
    {
      id: 'f01-3', kind: 'prevedi', title: 'Il filo lungo',
      sim: 'pendulum', params: { L: 0.5, m: 0.5, a: 20, n: 3 }, controls: ['L', 'm', 'a'],
      intro: T('Adesso il filo cambia: prima corto, poi lungo. Fai la tua previsione!', 'Ora la variabile è la lunghezza del filo. Prima la previsione, poi l’esperimento.'),
      steps: [
        {
          kind: 'q',
          text: T('Il filo diventa quattro volte più lungo. Con il filo lungo, il pendolo va avanti e indietro…', 'Ora la variabile che cambi è la lunghezza del filo: passa da 0,5 m a 2 m, cioè diventa 4 volte più lunga. Massa e angolo restano uguali. Prima di lanciare, prevedi: il periodo, cioè il tempo di un’oscillazione completa…'),
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
            // all'Esploratore solo tempi interi: 2 secondi (filo di 1 metro), poi 3 (poco più di 2 metri)
            const T0 = lens === 'e' ? (r === 0 ? 2 : 3) : pick(r === 0 ? [1.4, 1.6, 2.0, 2.2] : [1.2, 1.8, 2.4, 2.8]);
            return { T: T0, text: t('Un’oscillazione deve durare <b>{T:1} secondi</b>.', { T: T0 }) };
          },
          // valori che risolvono la prova: servono al test automatico che gioca tutti i livelli
          solve: (tg) => ({ L: (9.81 * tg.T * tg.T) / (4 * Math.PI * Math.PI) }),
          check: swingCheck,
        },
      ],
      hints: [T('Il peso non cambia il ritmo, ricordi? Allora cosa resta da cambiare?', 'Delle due variabili, una non conta. Quale resta?'), T('Filo più lungo, altalena più lenta. Filo più corto, più veloce.', 'Il periodo cresce con la radice della lunghezza: per raddoppiare il periodo serve un filo 4 volte più lungo.')],
      solution: T('Cambia solo il filo: circa 1 metro per 2 secondi, poco più di 2 metri per 3 secondi.', 'L = g·T²/(4π²): per T = 2 s, L ≈ 0,99 m; per T = 1,4 s, L ≈ 0,49 m.'),
    },
    {
      id: 'f01-5', kind: 'ripasso', title: 'Ripasso del metodo',
      intro: T('Ripassiamo! Quattro domande sul metodo degli scienziati.', 'Ripasso: quattro domande sul metodo scientifico.'),
      steps: [
        {
          kind: 'q', text: T('Avevi previsto una cosa, ma l’esperimento mostra il contrario. Che cosa fai?', 'Hai fatto un’ipotesi e l’hai messa alla prova, ma il risultato dell’esperimento la smentisce: dice il contrario di quello che ti aspettavi. Che cosa fai con la tua ipotesi?'),
          options: [T('Faccio finta di niente', 'Ignori il risultato'), T('Cambio idea: l’esperimento ha ragione', 'Cambi o correggi l’ipotesi'), T('Rifaccio finché viene come dico io', 'Ripeti finché il risultato ti dà ragione')],
          answer: 1, explain: T('Bravo! Anche i grandi scienziati cambiano idea quando l’esperimento lo dice.', 'Esatto: un’ipotesi smentita va corretta. È così che la scienza migliora.'),
        },
        {
          kind: 'q', text: T('Il cronometro conta 5 andate e ritorni del pendolo, non una sola. Perché?', 'Una sola oscillazione dura poco più di un secondo, e premere il cronometro proprio al momento giusto non riesce mai perfetto. Per questo si misura il tempo di 5 oscillazioni e poi lo si divide per 5. Perché questo aiuta?'),
          options: [T('Per finire prima', 'Per risparmiare tempo nei calcoli'), T('Una sola dura troppo poco', 'Per ridurre l’errore di misura'), T('All’inizio il pendolo va più piano', 'Perché il pendolo all’inizio è lento')],
          answer: 1, explain: T('Giusto: un tempo più lungo si misura meglio di uno corto.', 'Giusto: l’errore del cronometro (la reazione del dito, per esempio) si divide per 5.'),
        },
        {
          kind: 'q', text: T('Che cosa cambia davvero il tempo del pendolo?', 'Con il pendolo hai cambiato una variabile alla volta: prima la massa, poi la lunghezza del filo. Da quale delle due dipende il periodo, cioè il tempo di un’oscillazione completa?'),
          options: [T('Il peso della pallina', 'La massa'), T('La lunghezza del filo', 'La lunghezza'), T('Nessuna delle due')],
          answer: 1, explain: T('Esatto: conta il filo!', 'Esatto: conta la lunghezza (e la gravità del pianeta). La massa no.'),
        },
        {
          kind: 'vars', text: T('Vuoi scoprire se il <b>filo</b> cambia il pendolo. Tra un lancio e l’altro, che cosa <b>cambi</b> e che cosa lasci <b>uguale</b>?', 'Ora vuoi scoprire se la <b>lunghezza</b> del filo influisce sul periodo. Prepara i due lanci: per ogni variabile, tra un lancio e l’altro la <b>cambi</b> o la tieni <b>uguale</b>?'),
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
          kind: 'q', text: T('Vuoi controllare il mito. Che cosa cambi tra un lancio e l’altro?', 'Il mito sostiene che il periodo cresce molto se aumenti l’angolo di partenza. Un esperimento onesto cambia solo la variabile che vuoi studiare e tiene ferme tutte le altre. Quale esperimento mette davvero alla prova il mito?'),
          options: [
            T('Solo quanto sposto il pendolo', 'Stessi L e m, angolo 5° e poi 60°'),
            T('Il filo e quanto lo sposto', 'Angolo 5° con filo corto, 60° con filo lungo'),
            T('Niente: lo lancio una volta sola', 'Un solo lancio a 60°, misurato con cura'),
          ],
          answer: 0, explain: T('Giusto: cambia solo quanto lo sposti. Ora la previsione!', 'Giusto: cambia solo l’angolo. Ora la previsione.'),
          wrong: T('Mmh, così cambiano due cose insieme… o non confronti niente. Come capiresti chi ha ragione?', 'Così non isoli l’angolo: che cosa causerebbe la differenza?'),
        },
        {
          kind: 'q', text: T('Prima sposti il pendolo poco, poi tantissimo. Spostato tanto, quanto ci mette ad andare e tornare?', 'Stesso filo e stessa massa: cambia solo l’angolo di partenza, da 5° a 60°, cioè 12 volte di più. Se il mito avesse ragione, anche il periodo crescerebbe di tanto. Che cosa prevedi? Rispetto al lancio a 5°, il periodo sarà…'),
          options: [T('il doppio del tempo', 'circa il doppio'), T('quasi lo stesso tempo', 'quasi uguale, appena più lungo'), T('la metà del tempo', 'circa la metà')],
          answer: 1,
          predict: [{ L: 1, m: 0.5, a: 5 }, { L: 1, m: 0.5, a: 60 }],
          explain: T('Quasi uguale: circa 2,0 s e 2,15 s. Va più veloce, ma fa anche più strada!',
            '5°: circa 2,01 s; 60°: circa 2,15 s. Solo il 7% in più: T = 2π·√(L/g) vale bene per angoli piccoli, e resta una buona stima fino a 20–30°.',
            'Circa 2,01 s contro 2,15 s: solo il 7% in più. Per questo un orologio a pendolo resta preciso anche se l’oscillazione si smorza piano piano.'),
        },
        {
          kind: 'q', review: false, text: T('Il bambino diceva: «spinto in alto, ci mette tantissimo di più». Aveva ragione?', 'Confronta i due periodi misurati, a 5° e a 60°. Il mito diceva che il periodo cresce tanto quanto l’angolo. Che cosa puoi concludere?'),
          options: [T('Sì: spinto in alto ci mette molto di più', 'Il mito è vero: il periodo cresce quanto l’angolo'), T('No: il tempo cambia pochissimo', 'Il mito è falso: il periodo cresce appena'), T('Dipende da quanto pesa chi è sopra', 'Dipende dalla massa appesa')],
          answer: 1,
          explain: T('Mito smontato! Spingere di più fa andare più in alto, non più lenti.', 'Mito smontato: il periodo dipende quasi solo da L e g; l’angolo conta poco, e solo quando è grande.'),
        },
      ],
      hints: [T('Vetrino chiede: se cambi due cose insieme, a chi dai la colpa?'), T('Vetrino chiede: un pendolo spostato tanto va più veloce in basso, ma fa anche più strada. Chi vince?')],
      solution: T('Stesso pendolo, 5° e poi 60°: i tempi sono quasi uguali (2,0 e 2,15 s), quindi il mito è falso.'),
    },
  ],
};
