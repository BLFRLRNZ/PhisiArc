// Base comune delle simulazioni: canvas nitido, ciclo a passi piccoli, fine esperimento.

export class Sim {
  static IDLE = 6; // secondi di quiete dopo i quali si smette di ridisegnare
  static controls = {};
  static staticSim = false; // true = niente pulsante Lancia (si esplora con i cursori)

  constructor(canvas, params = {}) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.params = { ...this.defaults(), ...params };
    this.running = false;
    this.t = 0;
    this.speed = 1;
    this.onDone = null;
    this.clock = 0;      // secondi dall'apertura: serve alle animazioni "di contorno"
    this.fdt = 0;        // durata dell'ultimo fotogramma
    this.doneAt = -1;    // quando è finito l'ultimo esperimento (per i disegni che compaiono dopo)
    this._sm = {};
    this.calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    this.init();
    this._act = 0; this._seen = true;
    this._ro = new ResizeObserver(() => { this.resize(); this.wake(); this.draw(); });
    this._ro.observe(canvas);
    this._io = typeof IntersectionObserver === 'function' ? new IntersectionObserver((en) => { this._seen = en[en.length - 1].isIntersecting; if (this._seen) this.wake(); }) : null;
    if (this._io) this._io.observe(canvas);
    canvas.addEventListener('pointerdown', () => this.wake());
    this.draw();
    // Un solo ciclo sempre acceso: fa la fisica quando l'esperimento corre e anima tutto il resto.
    let last = performance.now();
    const loop = (now) => {
      if (this._dead) return;
      const real = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      this.fdt = real;
      this.clock += real;
      if (this.running) {
        const dt = real * this.speed * (this.mul || 1), sub = 20 * (this.mul || 1);
        for (let i = 0; i < sub && this.running; i++) { this.t += dt / sub; this.step(dt / sub); }
      }
      // si disegna solo se serve: esperimento in corso, oppure qualcosa è cambiato da poco (le animazioni di contorno
      // si fermano dopo qualche secondo di quiete), e mai se il disegno è fuori dallo schermo o la scheda è nascosta
      const idle = !this.running && this.clock - this._act > Sim.IDLE;
      if (this.cv.isConnected && this._seen && !document.hidden && !idle) this.draw();
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  // Valore che segue il suo obiettivo con morbidezza (cursori, zoom, comparse).
  sm(key, target, rate = 10) {
    const cur = this._sm[key];
    if (cur == null || this.calm) { this._sm[key] = target; return target; }
    const v = cur + (target - cur) * (1 - Math.exp(-rate * this.fdt));
    this._sm[key] = Math.abs(v - target) < 1e-4 ? target : v;
    return this._sm[key];
  }

  // Secondi passati da quando è finito l'esperimento (-1 se non è finito): serve a far comparire i disegni del risultato.
  get age() { return this.result && this.doneAt >= 0 ? (this.calm ? 99 : this.clock - this.doneAt) : -1; }

  defaults() { return {}; }
  init() {}
  step() {}
  draw() {}

  resize() {
    const r = this.cv.getBoundingClientRect();
    const d = window.devicePixelRatio || 1;
    this.W = Math.max(240, r.width);
    this.H = Math.max(180, r.height);
    this.cv.width = Math.round(this.W * d);
    this.cv.height = Math.round(this.H * d);
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  // qualcosa è cambiato: si torna a disegnare per qualche secondo
  wake() { this._act = this.clock; }

  set(p) {
    this.wake();
    Object.assign(this.params, p);
    if (!this.running) this.reset();
  }

  reset() {
    this.wake();
    this.stop();
    this.t = 0;
    this.result = null;
    this.init();
    this.draw();
  }

  start() {
    this.reset();
    this.startedAt = this.clock;
    this.running = true;
  }

  finish(result) {
    this.wake();
    this.running = false;
    this.result = result;
    this.doneAt = this.clock;
    this.draw();
    if (this.onDone) this.onDone(result);
  }

  stop() {
    this.running = false;
  }

  destroy() {
    this.stop();
    this._dead = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._ro.disconnect();
    if (this._io) this._io.disconnect();
  }

  // Colori presi dal foglio di stile (memorizzati: si leggono una volta sola).
  c(name) {
    const C = Sim._colors || (Sim._colors = {});
    if (!C[name]) C[name] = getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim() || '#888';
    return C[name];
  }

  // ---------- disegno a linee, stile lavagna ----------
  line(pts, { color, width = 2.5, dash, alpha = 1, upto = 1 } = {}) {
    const g = this.ctx;
    if (pts.length < 2 || upto <= 0) return;
    g.save();
    g.globalAlpha = alpha; g.strokeStyle = color || this.c('ink'); g.lineWidth = width;
    g.lineCap = 'round'; g.lineJoin = 'round';
    if (dash) g.setLineDash(dash);
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    if (upto >= 1) for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    else { // si disegna da solo: solo la frazione "upto" della lunghezza totale
      let tot = 0;
      for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      let left = tot * upto;
      for (let i = 1; i < pts.length && left > 0; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], d = Math.hypot(x1 - x0, y1 - y0);
        if (d <= left) { g.lineTo(x1, y1); left -= d; } else { g.lineTo(x0 + ((x1 - x0) * left) / d, y0 + ((y1 - y0) * left) / d); left = 0; }
      }
    }
    g.stroke();
    g.restore();
  }

  // Freccia (vettore) con etichetta opzionale.
  arrow(x1, y1, x2, y2, { color, width = 2.5, label, head = 9, dash, alpha = 1 } = {}) {
    const g = this.ctx, L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 2) return;
    const a = Math.atan2(y2 - y1, x2 - x1), hd = Math.min(head, L * 0.5);
    g.save();
    g.globalAlpha = alpha; g.strokeStyle = color || this.c('orange'); g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
    if (dash) g.setLineDash(dash);
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    g.setLineDash([]);
    g.beginPath();
    g.moveTo(x2 - hd * Math.cos(a - 0.45), y2 - hd * Math.sin(a - 0.45)); g.lineTo(x2, y2);
    g.lineTo(x2 - hd * Math.cos(a + 0.45), y2 - hd * Math.sin(a + 0.45));
    g.stroke();
    g.restore();
    if (label) this.text(label, x2 + 8 * Math.cos(a) + 4, y2 + 8 * Math.sin(a) + 4, { size: 12, color: color || this.c('orange'), mono: true });
  }

  // Cerchio a linee con un velo di colore dentro (come i personaggi).
  ball(x, y, r, { color, fill = 0.18, width = 2.5, alpha = 1, shine = true } = {}) {
    const g = this.ctx, col = color || this.c('sky');
    g.save();
    g.globalAlpha = alpha;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
    g.globalAlpha = alpha * fill; g.fillStyle = col; g.fill();
    g.globalAlpha = alpha; g.strokeStyle = col; g.lineWidth = width; g.stroke();
    if (shine && r > 7) {
      g.globalAlpha = alpha * 0.55; g.strokeStyle = this.c('chalk'); g.lineWidth = 2; g.lineCap = 'round';
      g.beginPath(); g.arc(x, y, r * 0.62, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
    }
    g.restore();
  }

  // Anello che si allarga e svanisce (urti, arrivi, centri).
  ripple(x, y, age, { color, r0 = 6, r1 = 34, dur = 0.7 } = {}) {
    if (age < 0 || age > dur) return;
    const u = age / dur, g = this.ctx;
    g.save();
    g.globalAlpha = (1 - u) * 0.9; g.strokeStyle = color || this.c('chalk'); g.lineWidth = 2;
    g.beginPath(); g.arc(x, y, r0 + (r1 - r0) * (1 - (1 - u) ** 3), 0, Math.PI * 2); g.stroke();
    g.restore();
  }

  // Piccole linee che schizzano via come scintille (centro colpito, arrivo).
  burst(x, y, age, { color, n = 10, r = 40, dur = 0.6 } = {}) {
    if (age < 0 || age > dur) return;
    const u = age / dur, e = 1 - (1 - u) ** 3, g = this.ctx;
    g.save();
    g.globalAlpha = 1 - u; g.strokeStyle = color || this.c('sun'); g.lineWidth = 2.4; g.lineCap = 'round';
    g.beginPath();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.3;
      g.moveTo(x + Math.cos(a) * r * e * 0.55, y + Math.sin(a) * r * e * 0.55);
      g.lineTo(x + Math.cos(a) * r * e, y + Math.sin(a) * r * e);
    }
    g.stroke();
    g.restore();
  }

  // Testo: Lexend per le parole, IBM Plex Mono per i numeri (mono: true).
  text(str, x, y, { size = 14, color, align = 'left', weight = 500, base = 'alphabetic', mono } = {}) {
    const g = this.ctx;
    if (mono == null) mono = /^[\s\d.,:+−\-°%/=]*[\d][\s\d.,:+−\-°%/=a-zA-Z²]*$/.test(String(str)) && String(str).length < 14;
    g.font = mono ? `${Math.min(weight, 500)} ${size}px "IBM Plex Mono", ui-monospace, monospace` : `${weight} ${size}px Lexend, system-ui, -apple-system, "Segoe UI", sans-serif`;
    g.fillStyle = color || this.c('ink');
    g.textAlign = align;
    g.textBaseline = base;
    g.fillText(str, x, y);
  }

  // Il terreno come in una lavagna: una linea di gesso con un tratteggio sotto.
  ground(y, { color, x0 = 0, x1 = this.W, up = false } = {}) {
    const g = this.ctx, k = up ? -1 : 1;
    g.save();
    g.strokeStyle = this.c('edge'); g.lineWidth = 1.5; g.lineCap = 'round';
    g.beginPath();
    for (let x = x0 + 10; x < x1 + 2; x += 16) { g.moveTo(x, y + 4 * k); g.lineTo(x - 8, y + 12 * k); }
    g.stroke();
    g.strokeStyle = color || this.c('ink'); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    g.restore();
  }

  clear() {
    const g = this.ctx;
    g.fillStyle = this.c('sim-bg');
    g.fillRect(0, 0, this.W, this.H);
  }
}

export const fmt = (x, d = 2) =>
  Number(x).toLocaleString('it-IT', { maximumFractionDigits: d, minimumFractionDigits: d });

export const clamp01 = (u) => Math.max(0, Math.min(1, u));
export const easeOut = (u) => 1 - (1 - clamp01(u)) ** 3;
export const easeInOut = (u) => { u = clamp01(u); return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2; };
