/**
 * Singleton - Base Class for Singleton Pattern
 * Ensures only one instance of a class exists
 * Used by Vexorion root class and other global modules
 */

import { VexorionError } from '../shared/errors.js';

export class Singleton {
  /**
   * Static instance storage
   */
  static instance = null;

  /**
   * Constructor - Private
   * @throws {VexorionError} If instance already exists
   */
  constructor() {
    if (this.constructor.instance) {
      throw new VexorionError(
        `${this.constructor.name} is a singleton and already instantiated. Use getInstance() instead.`,
        'SINGLETON_ERROR'
      );
    }
    this.constructor.instance = this;
  }

  /**
   * Get singleton instance
   * @param {...any} args - Constructor arguments
   * @returns {Singleton} Singleton instance
   */
  static getInstance(...args) {
    if (!this.instance) {
      this.instance = new this(...args);
    }
    return this.instance;
  }

  /**
   * Check if instance exists
   * @returns {boolean} Whether instance exists
   */
  static hasInstance() {
    return !!this.instance;
  }

  /**
   * Get instance or null
   * @returns {Singleton|null} Instance or null
   */
  static getInstanceOrNull() {
    return this.instance || null;
  }

  /**
   * Destroy singleton instance
   */
  static destroyInstance() {
    if (this.instance && typeof this.instance.destroy === 'function') {
      this.instance.destroy();
    }
    this.instance = null;
  }

  /**
   * Static method to reset instance (useful for testing)
   */
  static resetInstance() {
    this.instance = null;
  }
}
