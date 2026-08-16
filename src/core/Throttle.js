// src/core/Throttle.js
export class useThrottle {
  constructor(options = {}) {
    this.interval = options.interval || 500;
    this.leading = options.leading !== undefined ? options.leading : true;
    this.trailing = options.trailing !== undefined ? options.trailing : true;
    this.timeout = null;
    this.lastExecuted = 0;
    this.lastArgs = null;
    this.lastThis = null;
    this.result = null;
  }

  throttle(fn) {
    return (...args) => {
      const now = Date.now();
      const timeSinceLastExecution = now - this.lastExecuted;
      this.lastArgs = args;
      this.lastThis = this;
      if (this.leading && timeSinceLastExecution >= this.interval) {
        this.lastExecuted = now;
        this.result = fn.apply(this, args);
        return this.result;
      }
      if (this.trailing && !this.timeout) {
        this.timeout = setTimeout(() => {
          const remaining = Math.max(0, this.interval - (Date.now() - this.lastExecuted));
          if (remaining > 0 && this.lastArgs) {
            this.lastExecuted = Date.now();
            this.result = fn.apply(this.lastThis, this.lastArgs);
          }
          this.timeout = null;
        }, Math.max(0, this.interval - timeSinceLastExecution));
      }
      return this.result;
    };
  }

  cancel() { if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; } }
  flush(fn) {
    this.cancel();
    if (this.lastArgs && fn) { this.result = fn.apply(this.lastThis, this.lastArgs); this.lastArgs = null; return this.result; }
    return this.result;
  }
}

export function createThrottle(fn, interval = 500, options = {}) {
  const throttler = new useThrottle({ interval, ...options });
  return throttler.throttle(fn);
}
