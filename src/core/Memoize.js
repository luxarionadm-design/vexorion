// src/core/Memoize.js
export class useMemoize {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 0;
    this.cacheOrder = [];
  }

  memoize(fn) {
    return (...args) => {
      const key = this._getKey(args);
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        if (this.ttl > 0 && Date.now() - cached.timestamp > this.ttl) {
          this.cache.delete(key);
          this._removeFromOrder(key);
        } else {
          this._updateOrder(key);
          return cached.value;
        }
      }
      const result = fn(...args);
      this._set(key, result);
      return result;
    };
  }

  _getKey(args) {
    try { return JSON.stringify(args); } catch { return args.join('|'); }
  }

  _set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cacheOrder.shift();
      if (oldest) this.cache.delete(oldest);
    }
    this.cache.set(key, { value, timestamp: Date.now() });
    this.cacheOrder.push(key);
  }

  _updateOrder(key) {
    const index = this.cacheOrder.indexOf(key);
    if (index > -1) { this.cacheOrder.splice(index, 1); this.cacheOrder.push(key); }
  }

  _removeFromOrder(key) {
    const index = this.cacheOrder.indexOf(key);
    if (index > -1) this.cacheOrder.splice(index, 1);
  }

  clear() { this.cache.clear(); this.cacheOrder = []; }
  remove(...args) { const key = this._getKey(args); this.cache.delete(key); this._removeFromOrder(key); }
  getStats() { return { size: this.cache.size, maxSize: this.maxSize, keys: Array.from(this.cache.keys()) }; }
  has(...args) { const key = this._getKey(args); return this.cache.has(key); }
  get(...args) { const key = this._getKey(args); if (this.cache.has(key)) return this.cache.get(key).value; return undefined; }
}

export function createMemoize(fn, options = {}) {
  const memoizer = new useMemoize(options);
  return memoizer.memoize(fn);
}
