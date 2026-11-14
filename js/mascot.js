// Mascotte disegnate in SVG: un corpo tondo con occhi e un accessorio per mondo.

const ACC = {
  flask: '<path d="M40 6h20v10l-4 4v6h-12v-6l-4-4z" fill="#fff" opacity=".85"/><rect x="44" y="10" width="12" height="4" fill="#7fd1ff"/>',
  ball: '<path d="M30 14 q20 -14 40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>',
  owl: '<path d="M26 22 l8 -14 l8 12 M74 22 l-8 -14 l-8 12" stroke="#fff" stroke-width="4" fill="#fff" opacity=".9"/>',
  drop: '<path d="M50 2 q10 14 0 20 q-10 -6 0 -20z" fill="#fff" opacity=".8"/>',
  bolt: '<path d="M54 2 l-12 18 h10 l-6 14 l16 -20 h-10z" fill="#ffe14d"/>',
  none: '',
};

export function mascot(color = '#4f8cff', acc = 'none', mood = 'happy', size = 64) {
  const mouth = mood === 'doubt'
    ? '<path d="M40 70 q10 -6 20 0" stroke="#1b1b2a" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : '<path d="M38 66 q12 12 24 0" stroke="#1b1b2a" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  return `<svg class="mascot" width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
    <ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity=".15"/>
    <circle cx="50" cy="56" r="36" fill="${color}"/>
    <circle cx="38" cy="50" r="9" fill="#fff"/><circle cx="62" cy="50" r="9" fill="#fff"/>
    <circle cx="40" cy="52" r="4.5" fill="#1b1b2a"/><circle cx="64" cy="52" r="4.5" fill="#1b1b2a"/>
    <circle cx="30" cy="64" r="4" fill="#ff8fa3" opacity=".6"/><circle cx="70" cy="64" r="4" fill="#ff8fa3" opacity=".6"/>
    ${mouth}${ACC[acc] || ''}
  </svg>`;
}

// La scienziata dei boss: risponde con domande, come Papera in Arcode.
export const DUBBIA = { name: 'Dubbia', color: '#a46cff', acc: 'owl' };
