// src/core/Polling.js
export class usePolling {
  constructor(fn, interval = 5000, options = {}) {
    this.fn = fn;
    this.interval = interval;
    this.immediate = options.immediate || false;
    this.maxAttempts = options.maxAttempts || 0;
    this.attempts = 0;
    this.timer = null;
    this.isRunning = false;
    this.data = null;
    this.error = null;
    this.listeners = new Set();
    this.customListeners = new Map();
    if (this.immediate) this.start();
  }

  _notify() { this.listeners.forEach(cb => { try { cb(this.data, this.error, this.isRunning); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  async _poll() {
    if (this.maxAttempts > 0 && this.attempts >= this.maxAttempts) {
      this.stop();
      this._emit('maxattempts', this.attempts);
      return;
    }
    this.attempts++;
    try {
      this.data = await this.fn();
      this.error = null;
      this._emit('success', this.data);
    } catch (err) {
      this.error = err;
      this._emit('error', err);
    }
    this._notify();
  }

  _emit(event, data) {
    if (this.customListeners.has(event)) {
      this.customListeners.get(event).forEach(cb => { try { cb(data); } catch (e) {} });
    }
  }

  on(event, callback) {
    if (!this.customListeners.has(event)) this.customListeners.set(event, new Set());
    this.customListeners.get(event).add(callback);
    return () => {
      if (this.customListeners.has(event)) {
        this.customListeners.get(event).delete(callback);
        if (this.customListeners.get(event).size === 0) this.customListeners.delete(event);
      }
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.attempts = 0;
    this._poll();
    this.timer = setInterval(() => this._poll(), this.interval);
    this._notify();
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this._notify();
  }

  restart() { this.stop(); this.start(); }
  isRunningState() { return this.isRunning; }
  getData() { return this.data; }
  getError() { return this.error; }
  setInterval(interval) { this.interval = interval; if (this.isRunning) { this.stop(); this.start(); } }
  destroy() { this.stop(); this.listeners.clear(); this.customListeners.clear(); }
}

export function createPolling(fn, interval, options = {}) {
  return new usePolling(fn, interval, options);
}
