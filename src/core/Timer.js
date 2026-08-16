// src/core/Timer.js
export class useTimer {
  constructor(options = {}) {
    this.autoStart = options.autoStart || false;
    this.startTime = null;
    this.elapsed = 0;
    this.isRunning = false;
    this.listeners = new Set();
    if (this.autoStart) this.start();
  }

  _notify() { this.listeners.forEach(cb => { try { cb(this.elapsed, this.isRunning); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.startTime = now - this.elapsed;
    this._notify();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.elapsed = now - (this.startTime || now);
    this._notify();
  }

  reset() {
    this.stop();
    this.elapsed = 0;
    this.startTime = null;
    this._notify();
  }

  restart() { this.reset(); this.start(); }
  getElapsed() {
    if (!this.isRunning) return this.elapsed;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    return now - (this.startTime || now);
  }
  getElapsedSeconds() { return this.getElapsed() / 1000; }
  getElapsedMinutes() { return this.getElapsedSeconds() / 60; }
  getElapsedHours() { return this.getElapsedMinutes() / 60; }
  getFormatted() {
    const elapsed = this.getElapsed();
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const milliseconds = Math.floor(elapsed % 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }
  isRunningState() { return this.isRunning; }
  destroy() { this.stop(); this.listeners.clear(); }
}

export function createTimer(options = {}) {
  return new useTimer(options);
}
