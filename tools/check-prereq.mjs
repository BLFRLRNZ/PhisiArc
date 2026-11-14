// Controllo dei prerequisiti: segue il percorso (mondi in ordine, zone scritte e poi quelle in arrivo)
// e segnala ogni idea usata prima di essere spiegata. Uso: node tools/check-prereq.mjs
globalThis.localStorage = { getItem: (k) => (k === 'phisiarc-lingua' ? 'it' : null), setItem() {} };
const { WORLDS } = await import('../js/content/index.js');
const { PREREQ } = await import('../js/content/prereq.js');

const order = WORLDS.flatMap((w) => [...(w.zones || []), ...(w.soon || []).map((x) => x.split(' ')[0])]);
const known = new Set();
const problems = [];
for (const z of order) {
  const p = PREREQ[z];
  if (!p) { problems.push(`${z}: manca nella mappa dei prerequisiti`); continue; }
  for (const u of p.usa) if (!known.has(u)) problems.push(`${z} usa “${u}” prima che sia spiegato`);
  for (const i of p.introduce) known.add(i);
}
for (const z of Object.keys(PREREQ)) if (!order.includes(z)) problems.push(`${z}: è nella mappa ma non nel percorso`);
console.log(`Percorso: ${order.join(' → ')}`);
if (problems.length) { console.log(`\n${problems.length} problemi:\n- ` + problems.join('\n- ')); process.exit(1); }
console.log('\nNessuna idea usata prima di essere spiegata.');
