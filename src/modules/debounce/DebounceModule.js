/**
 * DebounceModule - Debounce Module
 * Limits the rate at which a function can be called
 */

import { Module } from '../../core/Module.js';
import { VexorionError } from '../../shared/errors.js';

export class DebounceModule extends Module {
  /**
   * Private fields
   */
  #delay = 300;
  #immediate = false;
  #timeoutId = null;
  #lastCall = 0;
  #isPending = false;

  /**
   * Constructor
   * @param {Object} config - Debounce configuration
   * @param {number} config.delay - Debounce delay in milliseconds
   * @param {boolean} config.immediate - Execute immediately on first call
   */
  constructor(config = {}) {
    super('DebounceModule', config);
    
    this.#delay = config.delay || 300;
    this.#immediate = config.immediate || false;
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validated configuration
   */
  #validateConfig(config) {
    if (config.delay && (typeof config.delay !== 'number' || config.delay < 0)) {
      throw new VexorionError(
        'Delay must be a non-negative number',
        'INVALID_DELAY'
      );
    }
    return config;
  }

  /**
   * Debounce a function
   * @param {Function} fn - Function to debounce
   * @param {Object} options - Debounce options
   * @param {number} options.delay - Custom delay
   * @param {boolean} options.immediate - Execute immediately
   * @returns {Function} Debounced function
   */
  debounce(fn, options = {}) {
    const delay = options.delay || this.#delay;
    const immediate = options.immediate !== undefined ? options.immediate : this.#immediate;

    return (...args) => {
      const now = Date.now();
      
      // Clear existing timeout
      if (this.#timeoutId) {
        clearTimeout(this.#timeoutId);
        this.#timeoutId = null;
      }

      // Immediate execution on first call
      if (immediate && !this.#isPending) {
        this.#isPending = true;
        this.#lastCall = now;
        return fn.apply(this, args);
      }

      // Schedule execution
      this.#timeoutId = setTimeout(() => {
        this.#isPending = false;
        this.#timeoutId = null;
        this.#lastCall = Date.now();
        return fn.apply(this, args);
      }, delay - (now - this.#lastCall));

      this.#lastCall = now;
    };
  }

  /**
   * Cancel pending debounced call
   */
  cancel() {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = null;
      this.#isPending = false;
    }
  }

  /**
   * Check if debounce is pending
   * @returns {boolean} Whether debounce is pending
   */
  isPending() {
    return this.#isPending;
  }

  /**
   * Get current delay
   * @returns {number} Current delay in milliseconds
   */
  getDelay() {
    return this.#delay;
  }

  /**
   * Set delay
   * @param {number} delay - New delay in milliseconds
   */
  setDelay(delay) {
    this.#delay = delay;
    this.cancel();
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.cancel();
  }
}
