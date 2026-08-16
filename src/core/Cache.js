// src/core/Cache.js
export class useCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 60000;
    this.cacheOrder = [];
    this.listeners = new Set();
  }

  _notify(key, value) { this.listeners.forEach(cb => { try { cb(key, value); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  set(key, value, ttl = this.ttl) {
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cacheOrder.shift();
      if (oldest) this.cache.delete(oldest);
    }
    this.cache.set(key, { value, expiry: Date.now() + ttl });
    this.cacheOrder.push(key);
    this._notify(key, value);
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    const item = this.cache.get(key);
    if (Date.now() > item.expiry) {
      this.delete(key);
      return undefined;
    }
    this._updateOrder(key);
    return item.value;
  }

  delete(key) {
    this.cache.delete(key);
    this._removeFromOrder(key);
    this._notify(key, undefined);
  }

  clear() { this.cache.clear(); this.cacheOrder = []; this.listeners.clear(); }
  has(key) { return this.cache.has(key); }
  size() { return this.cache.size; }
  keys() { return Array.from(this.cache.keys()); }
  getAll() { const result = {}; for (const [key, item] of this.cache) { if (Date.now() <= item.expiry) result[key] = item.value; } return result; }
  getStats() { return { size: this.cache.size, maxSize: this.maxSize, ttl: this.ttl }; }

  _updateOrder(key) {
    const index = this.cacheOrder.indexOf(key);
    if (index > -1) { this.cacheOrder.splice(index, 1); this.cacheOrder.push(key); }
  }
  _removeFromOrder(key) {
    const index = this.cacheOrder.indexOf(key);
    if (index > -1) this.cacheOrder.splice(index, 1);
  }
}

export function createCache(options = {}) {
  return new useCache(options);
}
