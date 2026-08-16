// src/core/Storage.js
export class useLocalStorage {
  constructor(config = {}) {
    this.prefix = config.prefix || '';
    this.storage = config.storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    this.serializer = config.serializer || JSON.stringify;
    this.deserializer = config.deserializer || JSON.parse;
    this.listeners = new Map();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (!event.key) return;
        const key = event.key.startsWith(this.prefix) ? event.key.replace(this.prefix, '') : null;
        if (key && this.listeners.has(key)) {
          const value = event.newValue ? this.deserializer(event.newValue) : null;
          this._notifyListeners(key, value);
        }
      });
    }
  }

  _getKey(key) { return this.prefix ? `${this.prefix}_${key}` : key; }
  _notifyListeners(key, value) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => { try { cb(value); } catch (e) {} });
    }
  }

  set(key, value, expiry = null) {
    if (!this.storage) return false;
    const fullKey = this._getKey(key);
    const item = { value, expiry: expiry ? Date.now() + expiry : null };
    try { this.storage.setItem(fullKey, this.serializer(item)); this._notifyListeners(key, value); return true; }
    catch (error) { console.error('Storage set error:', error); return false; }
  }

  get(key, defaultValue = null) {
    if (!this.storage) return defaultValue;
    const fullKey = this._getKey(key);
    try {
      const item = this.storage.getItem(fullKey);
      if (!item) return defaultValue;
      const parsed = this.deserializer(item);
      if (parsed.expiry && Date.now() > parsed.expiry) { this.remove(key); return defaultValue; }
      return parsed.value;
    } catch (error) { console.error('Storage get error:', error); return defaultValue; }
  }

  remove(key) {
    if (!this.storage) return false;
    const fullKey = this._getKey(key);
    try { this.storage.removeItem(fullKey); this._notifyListeners(key, null); return true; }
    catch (error) { console.error('Storage remove error:', error); return false; }
  }

  clear() {
    if (!this.storage) return false;
    try {
      const keys = Object.keys(this.storage);
      const prefixKeys = keys.filter(k => k.startsWith(this.prefix));
      prefixKeys.forEach(k => this.storage.removeItem(k));
      this.listeners.clear();
      return true;
    } catch (error) { console.error('Storage clear error:', error); return false; }
  }

  keys() {
    if (!this.storage) return [];
    try {
      const keys = Object.keys(this.storage);
      return keys.filter(k => k.startsWith(this.prefix)).map(k => k.replace(this.prefix ? `${this.prefix}_` : '', ''));
    } catch (error) { console.error('Storage keys error:', error); return []; }
  }

  getAll() {
    const result = {};
    const keys = this.keys();
    keys.forEach(key => { result[key] = this.get(key); });
    return result;
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key).add(callback);
    return () => {
      if (this.listeners.has(key)) {
        this.listeners.get(key).delete(callback);
        if (this.listeners.get(key).size === 0) this.listeners.delete(key);
      }
    };
  }

  isAvailable() { return this.storage !== null; }
}

export class useSessionStorage extends useLocalStorage {
  constructor(config = {}) {
    super({ ...config, storage: typeof sessionStorage !== 'undefined' ? sessionStorage : null });
  }
}
