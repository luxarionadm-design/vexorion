// src/core/Logger.js
export class useLogger {
  constructor(options = {}) {
    this.prefix = options.prefix || 'LOG';
    this.level = options.level || 'info';
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.levels = { debug: 0, info: 1, warn: 2, error: 3, off: 4 };
    this.currentLevel = this.levels[this.level] !== undefined ? this.levels[this.level] : 1;
    this.listeners = new Set();
  }

  _log(level, ...args) {
    if (!this.enabled) return;
    if (this.levels[level] < this.currentLevel) return;
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.prefix}] [${level.toUpperCase()}]`;
    const method = console[level] || console.log;
    method(prefix, ...args);
    this._notify({ level, args, timestamp, formatted: `${prefix} ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}` });
  }

  _notify(data) { this.listeners.forEach(cb => { try { cb(data); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  debug(...args) { this._log('debug', ...args); }
  info(...args) { this._log('info', ...args); }
  warn(...args) { this._log('warn', ...args); }
  error(...args) { this._log('error', ...args); }
  setLevel(level) { this.level = level; this.currentLevel = this.levels[level] !== undefined ? this.levels[level] : 1; }
  setEnabled(enabled) { this.enabled = enabled; }
  setPrefix(prefix) { this.prefix = prefix; }
  group(label) { if (this.enabled && console.group) console.group(label); }
  groupEnd() { if (this.enabled && console.groupEnd) console.groupEnd(); }
  time(label) { if (this.enabled && console.time) console.time(label); }
  timeEnd(label) { if (this.enabled && console.timeEnd) console.timeEnd(); }
  table(data) { if (this.enabled && console.table) console.table(data); }
  clear() { if (this.enabled && console.clear) console.clear(); }
}

export function createLogger(options = {}) {
  return new useLogger(options);
}
