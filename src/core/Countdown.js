// src/core/Countdown.js
export class useCountdown {
  constructor(seconds, options = {}) {
    this.initialSeconds = seconds;
    this.seconds = seconds;
    this.onTick = options.onTick || null;
    this.onComplete = options.onComplete || null;
    this.interval = null;
    this.isRunning = false;
    this.isComplete = false;
    this._listeners = new Set();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.seconds, this.isRunning, this.isComplete); } catch (e) {} }); }

  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }

  start() {
    if (this.isRunning) return;
    if (this.seconds <= 0) {
      this.isComplete = true;
      this._notify();
      if (this.onComplete) this.onComplete();
      return;
    }
    this.isRunning = true;
    this.isComplete = false;
    this.interval = setInterval(() => {
      this.seconds--;
      if (this.onTick) this.onTick(this.seconds);
      this._notify();
      if (this.seconds <= 0) {
        this.stop();
        this.isComplete = true;
        this._notify();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
    this._notify();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.interval) { clearInterval(this.interval); this.interval = null; }
    this._notify();
  }

  reset() { this.stop(); this.seconds = this.initialSeconds; this.isComplete = false; this._notify(); }
  restart() { this.reset(); this.start(); }
  get() { return this.seconds; }
  getTimeLeft() { return this.seconds; }
  isRunningState() { return this.isRunning; }
  isCompleteState() { return this.isComplete; }
  destroy() { this.stop(); this._listeners.clear(); }
}

export function createCountdown(seconds, options = {}) {
  return new useCountdown(seconds, options);
}
