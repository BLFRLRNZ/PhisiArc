// Base comune delle simulazioni: canvas nitido, ciclo a passi piccoli, fine esperimento.

export class Sim {
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
    this.resize();
    this.init();
    this._ro = new ResizeObserver(() => { this.resize(); this.draw(); });
    this._ro.observe(canvas);
    this.draw();
  }

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

  set(p) {
    Object.assign(this.params, p);
    if (!this.running) this.reset();
  }

  reset() {
    this.stop();
    this.t = 0;
    this.result = null;
    this.init();
    this.draw();
  }

  start() {
    this.reset();
    this.running = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)) * this.speed;
      last = now;
      const sub = 20;
      for (let i = 0; i < sub && this.running; i++) {
        this.t += dt / sub;
        this.step(dt / sub);
      }
      this.draw();
      if (this.running) this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  finish(result) {
    this.running = false;
    this.result = result;
    this.draw();
    if (this.onDone) this.onDone(result);
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  destroy() {
    this.stop();
    this._ro.disconnect();
  }

  // Colori presi dal tema (chiaro o scuro).
  c(name) {
    return getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim() || '#888';
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
  ground(y, { color, x0 = 0, x1 = this.W } = {}) {
    const g = this.ctx;
    g.save();
    g.strokeStyle = this.c('edge'); g.lineWidth = 1.5; g.lineCap = 'round';
    g.beginPath();
    for (let x = x0 + 10; x < x1 + 10; x += 16) { g.moveTo(x, y + 4); g.lineTo(x - 8, y + 12); }
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
