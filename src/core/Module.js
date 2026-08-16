/**
 * Module - Abstract Base Class
 * All modules should extend this class
 * Provides common functionality and lifecycle methods
 */

import { Observable } from './Observable.js';
import { VexorionError } from '../shared/errors.js';

export class Module extends Observable {
  /**
   * Private fields
   */
  #name = '';
  #config = null;
  #initialized = false;
  #eventListeners = new Map();

  /**
   * Constructor
   * @param {string} name - Module name
   * @param {Object} config - Module configuration
   */
  constructor(name, config = {}) {
    super();
    
    if (this.constructor === Module) {
      throw new VexorionError(
        'Module is an abstract class and cannot be instantiated directly',
        'ABSTRACT_CLASS_ERROR'
      );
    }

    this.#name = name;
    this.#config = this.#validateConfig(config);
    this.#initialized = true;
    
    // Call initialization hook
    this.onInit();
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validated configuration
   */
  #validateConfig(config) {
    // Override in child classes
    return config;
  }

  /**
   * Get module name
   * @returns {string} Module name
   */
  getName() {
    return this.#name;
  }

  /**
   * Get module configuration
   * @returns {Object} Module configuration
   */
  getConfig() {
    return { ...this.#config };
  }

  /**
   * Update module configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.#config = {
      ...this.#config,
      ...this.#validateConfig(newConfig)
    };
    this.onConfigUpdate();
  }

  /**
   * Check if module is initialized
   * @returns {boolean} Initialization status
   */
  isInitialized() {
    return this.#initialized;
  }

  /**
   * Lifecycle method - Called on module initialization
   * Override in child classes
   */
  onInit() {
    // Override in child classes
  }

  /**
   * Lifecycle method - Called on configuration update
   * Override in child classes
   */
  onConfigUpdate() {
    // Override in child classes
  }

  /**
   * Lifecycle method - Called before module destruction
   * Override in child classes
   */
  onDestroy() {
    // Override in child classes
  }

  /**
   * Add an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.#eventListeners.has(event)) {
      this.#eventListeners.set(event, new Set());
    }
    this.#eventListeners.get(event).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    if (!this.#eventListeners.has(event)) {
      return;
    }
    this.#eventListeners.get(event).delete(callback);
    if (this.#eventListeners.get(event).size === 0) {
      this.#eventListeners.delete(event);
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  emit(event, data) {
    if (!this.#eventListeners.has(event)) {
      return;
    }
    const callbacks = this.#eventListeners.get(event);
    for (const callback of callbacks) {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    this.#eventListeners.clear();
  }

  /**
   * Destroy the module
   */
  destroy() {
    if (!this.#initialized) {
      return;
    }
    
    this.onDestroy();
    this.removeAllListeners();
    this.#initialized = false;
    this.#eventListeners.clear();
    this.#config = null;
  }

  /**
   * Static method to create a module
   * @param {string} name - Module name
   * @param {Object} config - Module configuration
   * @returns {Module} Module instance
   */
  static create(name, config = {}) {
    return new this(name, config);
  }
}
