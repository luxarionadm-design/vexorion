// src/core/Profiler.js
export class useProfiler {
  constructor(options = {}) {
    this.name = options.name || 'Profiler';
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.marks = {};
    this.measures = {};
    this.listeners = new Set();
  }

  _notify(data) { this.listeners.forEach(cb => { try { cb(data); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  mark(name) {
    if (!this.enabled) return;
    const time = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.marks[name] = time;
    this._notify({ type: 'mark', name, time });
  }

  measure(name, startMark, endMark) {
    if (!this.enabled) return null;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const start = startMark && this.marks[startMark] !== undefined ? this.marks[startMark] : 0;
    const end = endMark && this.marks[endMark] !== undefined ? this.marks[endMark] : now;
    const duration = end - start;
    this.measures[name] = { start, end, duration };
    this._notify({ type: 'measure', name, duration, start, end });
    return duration;
  }

  start(name) {
    if (!this.enabled) return;
    this.mark(`${name}_start`);
  }

  end(name) {
    if (!this.enabled) return null;
    this.mark(`${name}_end`);
    return this.measure(name, `${name}_start`, `${name}_end`);
  }

  async profile(name, fn) {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  getMeasure(name) { return this.measures[name] || null; }
  getAllMeasures() { return this.measures; }
  getMark(name) { return this.marks[name] || null; }
  clearMarks() { this.marks = {}; }
  clearMeasures() { this.measures = {}; }
  clearAll() { this.clearMarks(); this.clearMeasures(); }
  setEnabled(enabled) { this.enabled = enabled; }
}

export function createProfiler(options = {}) {
  return new useProfiler(options);
}
