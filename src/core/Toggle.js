// src/core/Toggle.js
export class useToggle {
  constructor(initial = false) {
    this._value = initial;
    this._listeners = new Set();
  }

  get() { return this._value; }

  set(value) {
    const newValue = typeof value === 'function' ? value(this._value) : value;
    if (this._value !== newValue) {
      this._value = newValue;
      this._notify();
    }
  }

  toggle() { this.set(!this._value); }
  on() { this.set(true); }
  off() { this.set(false); }

  subscribe(callback) {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this._value); } catch (e) {} }); }

  reset(initial = false) { this._value = initial; this._notify(); }
  isOn() { return this._value === true; }
  isOff() { return this._value === false; }
}

export function createToggle(initial = false) {
  return new useToggle(initial);
}
