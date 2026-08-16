// src/core/Timeout.js
export class useTimeout {
  constructor(callback, delay, options = {}) {
    this.callback = callback;
    this.delay = delay;
    this.autoStart = options.autoStart !== undefined ? options.autoStart : true;
    this.timeoutId = null;
    this.isRunning = false;
    this._listeners = new Set();
    if (this.autoStart) this.start();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.isRunning); } catch (e) {} }); }

  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }

  start() {
    if (this.isRunning || this.delay === null) return;
    this.isRunning = true;
    this.timeoutId = setTimeout(() => {
      this.isRunning = false;
      this._notify();
      if (this.callback) this.callback();
    }, this.delay);
    this._notify();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }
    this._notify();
  }

  restart() { this.stop(); this.start(); }
  isRunningState() { return this.isRunning; }
  setDelay(delay) { this.delay = delay; }
  destroy() { this.stop(); this._listeners.clear(); }
}

export function createTimeout(callback, delay, options = {}) {
  return new useTimeout(callback, delay, options);
}
