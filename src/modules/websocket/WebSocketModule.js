/**
 * WebSocketModule - WebSocket Module
 * Provides WebSocket connection with auto-reconnect and event handling
 */

import { Module } from '../../core/Module.js';
import { WebSocketError } from '../../shared/errors.js';

export class WebSocketModule extends Module {
  /**
   * Private fields
   */
  #url = '';
  #ws = null;
  #reconnect = false;
  #reconnectInterval = 3000;
  #maxReconnectAttempts = 5;
  #reconnectAttempts = 0;
  #connected = false;
  #readyState = WebSocket.CLOSED;
  #messageQueue = [];

  /**
   * Constructor
   * @param {string} url - WebSocket URL
   * @param {Object} config - WebSocket configuration
   * @param {boolean} config.reconnect - Auto reconnect
   * @param {number} config.reconnectInterval - Reconnect interval in milliseconds
   * @param {number} config.maxReconnectAttempts - Maximum reconnect attempts
   */
  constructor(url, config = {}) {
    super('WebSocketModule', config);
    
    this.#url = url;
    this.#reconnect = config.reconnect || false;
    this.#reconnectInterval = config.reconnectInterval || 3000;
    this.#maxReconnectAttempts = config.maxReconnectAttempts || 5;
    
    // Auto-connect
    this.connect();
  }

  /**
   * Connect to WebSocket
   * @param {string} url - Optional custom URL
   * @returns {WebSocketModule} This instance for chaining
   */
  connect(url = this.#url) {
    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      return this;
    }

    this.#url = url;
    
    try {
      this.#ws = new WebSocket(this.#url);
      this.#ws.onopen = this.#handleOpen.bind(this);
      this.#ws.onmessage = this.#handleMessage.bind(this);
      this.#ws.onclose = this.#handleClose.bind(this);
      this.#ws.onerror = this.#handleError.bind(this);
    } catch (error) {
      throw new WebSocketError('Failed to connect', { error: error.message });
    }

    return this;
  }

  /**
   * Handle WebSocket open event
   */
  #handleOpen(event) {
    this.#connected = true;
    this.#readyState = WebSocket.OPEN;
    this.#reconnectAttempts = 0;
    
    // Send queued messages
    while (this.#messageQueue.length > 0) {
      const msg = this.#messageQueue.shift();
      this.send(msg);
    }
    
    this.emit('open', event);
  }

  /**
   * Handle WebSocket message event
   * @param {MessageEvent} event - Message event
   */
  #handleMessage(event) {
    let data = event.data;
    
    // Parse JSON if possible
    try {
      data = JSON.parse(data);
    } catch {
      // Keep as raw string
    }
    
    this.emit('message', data);
    this.emit('data', data);
  }

  /**
   * Handle WebSocket close event
   * @param {CloseEvent} event - Close event
   */
  #handleClose(event) {
    this.#connected = false;
    this.#readyState = WebSocket.CLOSED;
    this.emit('close', event);

    // Attempt reconnect
    if (this.#reconnect && this.#reconnectAttempts < this.#maxReconnectAttempts) {
      this.#reconnectAttempts++;
      const delay = this.#reconnectInterval * this.#reconnectAttempts;
      
      setTimeout(() => {
        if (this.#reconnectAttempts < this.#maxReconnectAttempts) {
          this.emit('reconnect', { attempt: this.#reconnectAttempts });
          this.connect();
        } else {
          this.emit('reconnect_failed', { attempts: this.#reconnectAttempts });
        }
      }, delay);
    }
  }

  /**
   * Handle WebSocket error event
   * @param {Event} event - Error event
   */
  #handleError(event) {
    this.emit('error', event);
  }

  /**
   * Send a message
   * @param {any} data - Message data
   * @returns {WebSocketModule} This instance for chaining
   */
  send(data) {
    if (!this.#ws || this.#ws.readyState !== WebSocket.OPEN) {
      // Queue message if not connected
      this.#messageQueue.push(data);
      return this;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.#ws.send(message);
      this.emit('send', data);
    } catch (error) {
      throw new WebSocketError('Failed to send message', { error: error.message });
    }

    return this;
  }

  /**
   * Close the WebSocket connection
   * @param {number} code - Close code
   * @param {string} reason - Close reason
   * @returns {WebSocketModule} This instance for chaining
   */
  close(code = 1000, reason = '') {
    if (this.#ws) {
      this.#reconnect = false; // Prevent auto-reconnect on manual close
      this.#ws.close(code, reason);
      this.#ws = null;
    }
    return this;
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean} Whether WebSocket is connected
   */
  isConnected() {
    return this.#connected && this.#ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get ready state
   * @returns {number} WebSocket ready state
   */
  getReadyState() {
    return this.#readyState;
  }

  /**
   * Get URL
   * @returns {string} Current WebSocket URL
   */
  getUrl() {
    return this.#url;
  }

  /**
   * Set reconnect
   * @param {boolean} reconnect - Enable/disable reconnect
   * @param {Object} options - Reconnect options
   * @param {number} options.interval - Reconnect interval
   * @param {number} options.maxAttempts - Maximum reconnect attempts
   * @returns {WebSocketModule} This instance for chaining
   */
  setReconnect(reconnect, options = {}) {
    this.#reconnect = reconnect;
    if (options.interval !== undefined) {
      this.#reconnectInterval = options.interval;
    }
    if (options.maxAttempts !== undefined) {
      this.#maxReconnectAttempts = options.maxAttempts;
    }
    return this;
  }

  /**
   * Get reconnect status
   * @returns {Object} Reconnect configuration
   */
  getReconnect() {
    return {
      enabled: this.#reconnect,
      interval: this.#reconnectInterval,
      maxAttempts: this.#maxReconnectAttempts,
      attempts: this.#reconnectAttempts
    };
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.close();
    this.#messageQueue = [];
    this.removeAllListeners();
  }
}
