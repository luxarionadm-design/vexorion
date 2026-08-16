// src/core/SSE.js
export class useSSE {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.eventSource = null;
    this.isConnected = false;
    this.reconnect = options.reconnect !== undefined ? options.reconnect : true;
    this.listeners = new Map();
  }

  _addListener(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(callback);
    return () => this._removeListener(event, callback);
  }

  _removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) this.listeners.delete(event);
    }
  }

  _emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => { try { cb(data); } catch (e) {} });
    }
  }

  on(event, callback) { return this._addListener(event, callback); }
  off(event, callback) { this._removeListener(event, callback); }
  removeAllListeners(event) { if (event) this.listeners.delete(event); else this.listeners.clear(); }

  connect() {
    if (typeof EventSource === 'undefined') {
      this._emit('error', new Error('EventSource is not supported'));
      return;
    }
    if (this.eventSource) this.close();
    try {
      this.eventSource = new EventSource(this.url, this.options);
      this.eventSource.onopen = this._handleOpen.bind(this);
      this.eventSource.onmessage = this._handleMessage.bind(this);
      this.eventSource.onerror = this._handleError.bind(this);
    } catch (error) {
      this._emit('error', error);
    }
  }

  _handleOpen(event) {
    this.isConnected = true;
    this._emit('open', event);
  }

  _handleMessage(event) {
    this._emit('message', event);
    try {
      const data = JSON.parse(event.data);
      this._emit('data', data);
      if (event.type && event.type !== 'message') this._emit(event.type, data);
    } catch {
      this._emit('raw', event.data);
    }
  }

  _handleError(event) {
    this.isConnected = false;
    this._emit('error', event);
    if (this.reconnect) {
      this._emit('reconnecting');
      setTimeout(() => this.connect(), 3000);
    }
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
  }

  isConnectedState() { return this.isConnected; }
  destroy() { this.close(); this.listeners.clear(); }
}

export function createSSE(url, options = {}) {
  return new useSSE(url, options);
}
