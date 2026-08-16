// src/core/Interval.js
export class useInterval {
  constructor(callback, delay, options = {}) {
    this.callback = callback;
    this.delay = delay;
    this.immediate = options.immediate || false;
    this.intervalId = null;
    this.isRunning = false;
    this._listeners = new Set();
    if (this.immediate && this.delay !== null) this.start();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.isRunning); } catch (e) {} }); }

  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }

  start() {
    if (this.isRunning || this.delay === null) return;
    this.isRunning = true;
    this.intervalId = setInterval(this.callback, this.delay);
    this._notify();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
    this._notify();
  }

  toggle() { if (this.isRunning) this.stop(); else this.start(); }
  isRunningState() { return this.isRunning; }
  setDelay(delay) { this.delay = delay; if (this.isRunning) { this.stop(); this.start(); } }
  destroy() { this.stop(); this._listeners.clear(); }
}

export function createInterval(callback, delay, options = {}) {
  return new useInterval(callback, delay, options);
}
