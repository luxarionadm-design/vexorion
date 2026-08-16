// src/core/Debounce.js
export class useDebounce {
  constructor(options = {}) {
    this.delay = options.delay || 500;
    this.leading = options.leading || false;
    this.trailing = options.trailing !== undefined ? options.trailing : true;
    this.maxWait = options.maxWait || 0;
    this.timeout = null;
    this.maxTimeout = null;
    this.lastCallTime = 0;
    this.lastArgs = null;
    this.lastThis = null;
    this.leadingCalled = false;
    this.result = null;
  }

  debounce(fn) {
    return (...args) => {
      const time = Date.now();
      const isInvoking = time - this.lastCallTime > this.delay;
      this.lastArgs = args;
      this.lastThis = this;
      this.lastCallTime = time;
      if (this.leading && isInvoking && !this.leadingCalled) {
        this.leadingCalled = true;
        this.result = fn.apply(this, args);
        return this.result;
      }
      if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; }
      if (this.maxWait > 0 && !this.maxTimeout) {
        this.maxTimeout = setTimeout(() => {
          if (this.trailing && this.lastArgs) { this.result = fn.apply(this.lastThis, this.lastArgs); }
          this.maxTimeout = null;
          this.leadingCalled = false;
        }, this.maxWait);
      }
      if (this.trailing) {
        this.timeout = setTimeout(() => {
          this.leadingCalled = false;
          if (this.maxTimeout) { clearTimeout(this.maxTimeout); this.maxTimeout = null; }
          if (this.lastArgs) { this.result = fn.apply(this.lastThis, this.lastArgs); }
          this.timeout = null;
        }, this.delay);
      }
      return this.result;
    };
  }

  cancel() {
    if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; }
    if (this.maxTimeout) { clearTimeout(this.maxTimeout); this.maxTimeout = null; }
    this.leadingCalled = false;
    this.lastArgs = null;
  }

  flush(fn) {
    this.cancel();
    if (this.lastArgs && fn) { this.result = fn.apply(this.lastThis, this.lastArgs); this.lastArgs = null; return this.result; }
    return this.result;
  }
}

export function createDebounce(fn, delay = 500, options = {}) {
  const debouncer = new useDebounce({ delay, ...options });
  return debouncer.debounce(fn);
}
