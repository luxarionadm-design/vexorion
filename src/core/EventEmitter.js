// src/core/EventEmitter.js
export class useEventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;
  }

  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, []);
    const listeners = this.events.get(event);
    if (listeners.length >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) exceeded for event "${event}"`);
    }
    listeners.push(listener);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    this.on(event, wrapper);
    return () => this.off(event, wrapper);
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
    if (listeners.length === 0) this.events.delete(event);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    const listeners = this.events.get(event);
    for (const listener of [...listeners]) {
      try { listener(...args); } catch (error) { console.error(`Error in event "${event}":`, error); }
    }
    return true;
  }

  emitAsync(event, ...args) {
    if (!this.events.has(event)) return Promise.resolve(false);
    const listeners = this.events.get(event);
    return Promise.all(listeners.map(listener => {
      try { return Promise.resolve(listener(...args)); } catch (error) { console.error(`Error in event "${event}":`, error); return Promise.reject(error); }
    }));
  }

  listenerCount(event) {
    if (!this.events.has(event)) return 0;
    return this.events.get(event).length;
  }

  eventNames() { return Array.from(this.events.keys()); }
  removeAllListeners(event) {
    if (event) { this.events.delete(event); }
    else { this.events.clear(); }
  }
  setMaxListeners(n) { this.maxListeners = n; }
}

export function createEventEmitter() {
  return new useEventEmitter();
}
