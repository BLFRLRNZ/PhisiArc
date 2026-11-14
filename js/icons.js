// Icone a linee (24×24), stesso tratto dei personaggi. Usano currentColor.
const s = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
export const IC = {
  grade: s('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/><path d="M22 9v6"/>'),
  bolt: s('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  park: s('<circle cx="12" cy="10" r="7"/><path d="M12 3v14M5 10h14M7.05 5.05l9.9 9.9M16.95 5.05l-9.9 9.9"/><path d="M8 22l4-5 4 5"/>'),
  gear: s('<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>'),
  back: s('<path d="M15 5l-7 7 7 7"/>'),
  next: s('<path d="M9 5l7 7-7 7"/>'),
  hint: s('<path d="M9 18h6M10 21h4"/><path d="M8.5 14.5C6.5 13 6 11 6 9a6 6 0 0 1 12 0c0 2-.5 4-2.5 5.5-.8.6-1 1.5-1 2.5h-5c0-1-.2-1.9-1-2.5z"/>'),
  sound: s('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'),
  lezione: s('<path d="M3 5.5c3-1.5 6-1.5 9 .5 3-2 6-2 9-.5v13.5c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z"/><path d="M12 6v14"/>'),
  prevedi: s('<path d="M3 19C6 7 13 4 20 10" stroke-dasharray="2.4 3"/><circle cx="20.2" cy="10.2" r="1.8"/><path d="M2 21h20"/>'),
  costruisci: s('<path d="M14.7 4.2a5 5 0 0 0-4.4 6.6l-6.6 6.6a2 2 0 0 0 2.9 2.9l6.6-6.6a5 5 0 0 0 6.6-4.4l-3 1.8-2.4-1.4-.1-2.8z"/>'),
  ripasso: s('<path d="M20 11a8 8 0 0 0-14.3-4.6L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.6L20 16"/><path d="M20 21v-5h-5"/>'),
  boss: s('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4L21 21"/><path d="M7.5 9a3.2 3.2 0 0 1 3-2.5"/>'),
  lock: s('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  check: s('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  play: s('<path d="M7 5v14l12-7z"/>'),
  reset: s('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>'),
  film: s('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5v5l4.5-2.5z"/>'),
};
