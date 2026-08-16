// src/core/WindowSize.js
export class useWindowSize {
  constructor(options = {}) {
    this.throttle = options.throttle || 100;
    this.size = { width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 };
    this._listeners = new Set();
    this._boundHandler = this._handleResize.bind(this);
    this.attach();
  }

  _handleResize() {
    this.size = { width: window.innerWidth, height: window.innerHeight };
    this._notify();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.size); } catch (e) {} }); }

  attach() {
    if (typeof window === 'undefined') return;
    let lastCall = 0;
    const throttledResize = () => {
      const now = Date.now();
      if (now - lastCall >= this.throttle) { lastCall = now; this._handleResize(); }
    };
    this._boundThrottled = throttledResize;
    window.addEventListener('resize', throttledResize);
  }

  detach() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', this._boundThrottled);
  }

  destroy() { this.detach(); this._listeners.clear(); }
  get() { return this.size; }
  getWidth() { return this.size.width; }
  getHeight() { return this.size.height; }
  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }
}

export function createWindowSize(options = {}) {
  return new useWindowSize(options);
}
