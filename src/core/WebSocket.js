// src/core/WebSocket.js
export class useWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.protocols = options.protocols || [];
    this.reconnect = options.reconnect !== undefined ? options.reconnect : true;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.heartbeatMessage = options.heartbeatMessage || 'ping';
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.listeners = new Map();
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
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
    if (typeof WebSocket === 'undefined') {
      this._emit('error', new Error('WebSocket is not supported in this environment'));
      return;
    }
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    try {
      this.ws = new WebSocket(this.url, this.protocols);
      this.ws.onopen = this._handleOpen.bind(this);
      this.ws.onmessage = this._handleMessage.bind(this);
      this.ws.onclose = this._handleClose.bind(this);
      this.ws.onerror = this._handleError.bind(this);
    } catch (error) {
      this._emit('error', error);
      this._handleReconnect();
    }
  }

  _handleOpen(event) {
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this._emit('open', event);
    this._startHeartbeat();
  }

  _handleMessage(event) {
    this._emit('message', event);
    try {
      const data = JSON.parse(event.data);
      this._emit('data', data);
    } catch {
      this._emit('raw', event.data);
    }
  }

  _handleClose(event) {
    this.isConnected = false;
    this._stopHeartbeat();
    this._emit('close', event);
    this._handleReconnect();
  }

  _handleError(event) {
    this._emit('error', event);
  }

  _handleReconnect() {
    if (!this.reconnect) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this._emit('maxreconnect', this.reconnectAttempts);
      return;
    }
    this.reconnectAttempts++;
    this._emit('reconnecting', this.reconnectAttempts);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send(this.heartbeatMessage);
        this._emit('heartbeat');
      }
    }, this.heartbeatInterval);
  }

  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  send(data) {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    this.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
  }

  close(code = 1000, reason = '') {
    this.reconnect = false;
    this._stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(code, reason);
      this.ws = null;
    }
    this.isConnected = false;
  }

  isConnectedState() { return this.isConnected; }
  getReadyState() { return this.ws ? this.ws.readyState : -1; }
  destroy() { this.close(); this.listeners.clear(); }
}

export function createWebSocket(url, options = {}) {
  return new useWebSocket(url, options);
}
