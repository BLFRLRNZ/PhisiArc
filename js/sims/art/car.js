// La macchinina a linee delle gare (e del laboratorio dei grafici): carrozzeria, abitacolo e ruote che girano.
// (x, y) = muso dell'auto, a metà altezza; col = colore; rot = rotazione delle ruote (di solito posizione / 0.35).
export function drawCar(sim, x, y, col, rot = 0) {
  const g = sim.ctx;
  g.save();
  g.strokeStyle = col; g.lineWidth = 2.2; g.lineJoin = 'round'; g.lineCap = 'round';
  // carrozzeria con il suo velo di colore
  g.fillStyle = col; g.globalAlpha = 0.18;
  g.beginPath(); g.roundRect(x - 30, y - 6, 30, 11, 4); g.fill();
  g.globalAlpha = 1;
  g.beginPath(); g.roundRect(x - 30, y - 6, 30, 11, 4); g.stroke();
  // abitacolo
  g.beginPath(); g.moveTo(x - 22, y - 6); g.lineTo(x - 18, y - 12); g.lineTo(x - 9, y - 12); g.lineTo(x - 5, y - 6); g.stroke();
  // ruote con il raggio che gira
  for (const wx of [x - 23, x - 7]) {
    g.fillStyle = sim.c('sim-bg');
    g.beginPath(); g.arc(wx, y + 6, 4.2, 0, 7); g.fill(); g.stroke();
    g.beginPath();
    g.moveTo(wx + Math.cos(rot) * 3.6, y + 6 + Math.sin(rot) * 3.6);
    g.lineTo(wx - Math.cos(rot) * 3.6, y + 6 - Math.sin(rot) * 3.6);
    g.stroke();
  }
  g.restore();
}
