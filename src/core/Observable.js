/**
 * Observable - Reactive State Pattern
 * Provides subscription-based state management
 * Used for toggle, timer, and other reactive modules
 */

import { VexorionError } from '../shared/errors.js';

export class Observable {
  /**
   * Private fields
   */
  #value = null;
  #listeners = new Set();
  #isObservable = true;

  /**
   * Constructor
   * @param {any} initialValue - Initial value
   */
  constructor(initialValue = null) {
    this.#value = initialValue;
  }

  /**
   * Get current value
   * @returns {any} Current value
   */
  getValue() {
    return this.#value;
  }

  /**
   * Set value and notify listeners
   * @param {any} newValue - New value
   */
  setValue(newValue) {
    const oldValue = this.#value;
    if (oldValue === newValue) {
      return;
    }
    this.#value = newValue;
    this.notify(newValue, oldValue);
  }

  /**
   * Subscribe to changes
   * @param {Function} callback - Callback function
   * @param {Object} options - Subscription options
   * @param {boolean} options.immediate - Call immediately with current value
   * @param {boolean} options.once - Unsubscribe after first call
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback, options = {}) {
    if (typeof callback !== 'function') {
      throw new VexorionError(
        'Callback must be a function',
        'INVALID_CALLBACK'
      );
    }

    const wrappedCallback = options.once
      ? (value, oldValue) => {
          callback(value, oldValue);
          this.unsubscribe(wrappedCallback);
        }
      : callback;

    this.#listeners.add(wrappedCallback);

    // Immediate callback with current value
    if (options.immediate && this.#value !== null && this.#value !== undefined) {
      wrappedCallback(this.#value, null);
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(wrappedCallback);
    };
  }

  /**
   * Unsubscribe from changes
   * @param {Function} callback - Callback to remove
   */
  unsubscribe(callback) {
    this.#listeners.delete(callback);
  }

  /**
   * Unsubscribe all listeners
   */
  unsubscribeAll() {
    this.#listeners.clear();
  }

  /**
   * Notify all listeners of value change
   * @param {any} value - New value
   * @param {any} oldValue - Old value
   */
  notify(value, oldValue) {
    for (const listener of this.#listeners) {
      try {
        listener(value, oldValue);
      } catch (error) {
        console.error('Error in observable listener:', error);
      }
    }
  }

  /**
   * Get number of listeners
   * @returns {number} Number of listeners
   */
  getListenerCount() {
    return this.#listeners.size;
  }

  /**
   * Check if observable has listeners
   * @returns {boolean} Whether there are listeners
   */
  hasListeners() {
    return this.#listeners.size > 0;
  }

  /**
   * Check if this is an observable
   * @returns {boolean} Always true
   */
  isObservable() {
    return this.#isObservable;
  }

  /**
   * Map observable value
   * @param {Function} transform - Transformation function
   * @returns {Observable} New observable with transformed value
   */
  map(transform) {
    const mapped = new Observable(transform(this.#value));
    this.subscribe((value) => {
      mapped.setValue(transform(value));
    });
    return mapped;
  }

  /**
   * Filter observable value
   * @param {Function} predicate - Filter function
   * @returns {Observable} New observable with filtered value
   */
  filter(predicate) {
    const filtered = new Observable();
    this.subscribe((value) => {
      if (predicate(value)) {
        filtered.setValue(value);
      }
    });
    return filtered;
  }

  /**
   * Debounce observable value changes
   * @param {number} delay - Debounce delay in milliseconds
   * @returns {Observable} New observable with debounced value
   */
  debounce(delay = 300) {
    const debounced = new Observable(this.#value);
    let timeoutId = null;

    this.subscribe((value) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        debounced.setValue(value);
        timeoutId = null;
      }, delay);
    });

    return debounced;
  }

  /**
   * Throttle observable value changes
   * @param {number} interval - Throttle interval in milliseconds
   * @returns {Observable} New observable with throttled value
   */
  throttle(interval = 300) {
    const throttled = new Observable(this.#value);
    let lastTime = 0;
    let timeoutId = null;

    this.subscribe((value) => {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        throttled.setValue(value);
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          throttled.setValue(value);
          lastTime = Date.now();
          timeoutId = null;
        }, interval - (now - lastTime));
      }
    });

    return throttled;
  }

  /**
   * Create a promise that resolves when value meets condition
   * @param {Function} predicate - Condition function
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<any>} Promise that resolves with the value
   */
  waitFor(predicate, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // Check if current value already satisfies predicate
      if (predicate(this.#value)) {
        resolve(this.#value);
        return;
      }

      let timeoutId = null;
      let unsubscribe = null;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      };

      timeoutId = setTimeout(() => {
        cleanup();
        reject(new VexorionError(
          'Timeout waiting for condition',
          'WAIT_FOR_TIMEOUT'
        ));
      }, timeout);

      unsubscribe = this.subscribe((value) => {
        if (predicate(value)) {
          cleanup();
          resolve(value);
        }
      });
    });
  }
}
