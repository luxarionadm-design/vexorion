/**
 * ToggleModule - Toggle State Module
 * Manages boolean state with subscription pattern
 * Used for dark mode, show/hide, etc.
 */

import { Observable } from '../../core/Observable.js';
import { Module } from '../../core/Module.js';

export class ToggleModule extends Module {
  /**
   * Private fields
   */
  #observable = null;
  #state = false;

  /**
   * Constructor
   * @param {boolean} initialValue - Initial toggle state
   * @param {Object} config - Toggle configuration
   */
  constructor(initialValue = false, config = {}) {
    super('ToggleModule', config);
    
    this.#state = initialValue;
    this.#observable = new Observable(initialValue);
  }

  /**
   * Get current state
   * @returns {boolean} Current state
   */
  getValue() {
    return this.#state;
  }

  /**
   * Check if toggle is on
   * @returns {boolean} Whether toggle is on
   */
  isOn() {
    return this.#state === true;
  }

  /**
   * Check if toggle is off
   * @returns {boolean} Whether toggle is off
   */
  isOff() {
    return this.#state === false;
  }

  /**
   * Toggle the state
   * @returns {boolean} New state
   */
  toggle() {
    this.#state = !this.#state;
    this.#observable.setValue(this.#state);
    this.emit('toggle', this.#state);
    return this.#state;
  }

  /**
   * Set to true
   * @returns {boolean} New state
   */
  on() {
    if (this.#state === true) {
      return true;
    }
    this.#state = true;
    this.#observable.setValue(this.#state);
    this.emit('toggle', this.#state);
    return this.#state;
  }

  /**
   * Set to false
   * @returns {boolean} New state
   */
  off() {
    if (this.#state === false) {
      return false;
    }
    this.#state = false;
    this.#observable.setValue(this.#state);
    this.emit('toggle', this.#state);
    return this.#state;
  }

  /**
   * Set specific state
   * @param {boolean} value - Value to set
   * @returns {boolean} New state
   */
  set(value) {
    if (typeof value !== 'boolean') {
      throw new Error('Value must be a boolean');
    }
    if (this.#state === value) {
      return this.#state;
    }
    this.#state = value;
    this.#observable.setValue(this.#state);
    this.emit('toggle', this.#state);
    return this.#state;
  }

  /**
   * Subscribe to toggle changes
   * @param {Function} callback - Callback function
   * @param {Object} options - Subscription options
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback, options = {}) {
    return this.#observable.subscribe(callback, options);
  }

  /**
   * Get the underlying observable
   * @returns {Observable} Observable instance
   */
  getObservable() {
    return this.#observable;
  }

  /**
   * Toggle with custom logic
   * @param {Function} predicate - Custom toggle logic
   * @returns {boolean} New state
   */
  toggleWith(predicate) {
    if (typeof predicate !== 'function') {
      throw new Error('Predicate must be a function');
    }
    const newState = predicate(this.#state);
    return this.set(newState);
  }

  /**
   * Reset to initial state
   * @param {boolean} initialValue - Initial value
   * @returns {boolean} New state
   */
  reset(initialValue = false) {
    return this.set(initialValue);
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.#observable.unsubscribeAll();
    this.#state = false;
    this.removeAllListeners();
  }
}
