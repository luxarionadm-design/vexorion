/**
 * ProfilerModule - Profiler Module
 * Provides performance profiling and benchmarking
 */

import { Module } from '../../core/Module.js';
import { formatTime } from '../../utils/formatters.js';

export class ProfilerModule extends Module {
  /**
   * Private fields
   */
  #measurements = [];
  #labels = new Map();
  #maxMeasurements = 100;
  #enabled = true;

  /**
   * Constructor
   * @param {Object} config - Profiler configuration
   * @param {boolean} config.autoStart - Start profiling automatically
   * @param {string} config.prefix - Profiler prefix
   * @param {number} config.maxMeasurements - Maximum measurements to store
   */
  constructor(config = {}) {
    super('ProfilerModule', config);
    
    this.#maxMeasurements = config.maxMeasurements || 100;
    this.#enabled = config.autoStart !== false;
    
    if (this.#enabled) {
      this.start();
    }
  }

  /**
   * Start profiling
   * @returns {ProfilerModule} This instance for chaining
   */
  start() {
    this.#enabled = true;
    this.emit('start');
    return this;
  }

  /**
   * Stop profiling
   * @returns {ProfilerModule} This instance for chaining
   */
  stop() {
    this.#enabled = false;
    this.emit('stop');
    return this;
  }

  /**
   * Check if profiling is enabled
   * @returns {boolean} Whether profiling is enabled
   */
  isEnabled() {
    return this.#enabled;
  }

  /**
   * Record a measurement
   * @param {string} label - Measurement label
   * @param {number} duration - Duration in milliseconds
   * @param {Object} metadata - Additional metadata
   * @returns {ProfilerModule} This instance for chaining
   */
  record(label, duration, metadata = {}) {
    if (!this.#enabled) {
      return this;
    }

    const measurement = {
      label,
      duration,
      metadata,
      timestamp: Date.now()
    };

    this.#measurements.push(measurement);
    if (this.#measurements.length > this.#maxMeasurements) {
      this.#measurements.shift();
    }

    this.emit('record', measurement);
    return this;
  }

  /**
   * Measure a function execution time
   * @param {Function} fn - Function to measure
   * @param {string} label - Measurement label
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<any>} Function result
   */
  async measure(fn, label = 'anonymous', metadata = {}) {
    if (!this.#enabled) {
      return fn();
    }

    const start = performance.now();
    let result;
    let error = null;

    try {
      result = await fn();
    } catch (e) {
      error = e;
      throw e;
    } finally {
      const duration = performance.now() - start;
      this.record(label, duration, { ...metadata, error: !!error });
    }

    return result;
  }

  /**
   * Measure a function synchronously
   * @param {Function} fn - Function to measure
   * @param {string} label - Measurement label
   * @param {Object} metadata - Additional metadata
   * @returns {any} Function result
   */
  measureSync(fn, label = 'anonymous', metadata = {}) {
    if (!this.#enabled) {
      return fn();
    }

    const start = performance.now();
    let result;
    let error = null;

    try {
      result = fn();
    } catch (e) {
      error = e;
      throw e;
    } finally {
      const duration = performance.now() - start;
      this.record(label, duration, { ...metadata, error: !!error });
    }

    return result;
  }

  /**
   * Start a labeled timer
   * @param {string} label - Timer label
   * @returns {Function} Stop function
   */
  startTimer(label) {
    if (!this.#enabled) {
      return () => {};
    }

    const start = performance.now();
    this.#labels.set(label, start);
    
    return (metadata = {}) => {
      const duration = performance.now() - start;
      this.record(label, duration, metadata);
      this.#labels.delete(label);
    };
  }

  /**
   * Get all measurements
   * @param {Object} options - Query options
   * @param {string} options.label - Filter by label
   * @param {number} options.limit - Limit number of measurements
   * @param {number} options.offset - Offset for pagination
   * @returns {Array} Measurements
   */
  getMeasurements(options = {}) {
    let measurements = [...this.#measurements];
    
    if (options.label) {
      measurements = measurements.filter(m => m.label === options.label);
    }
    
    if (options.offset) {
      measurements = measurements.slice(options.offset);
    }
    
    if (options.limit) {
      measurements = measurements.slice(0, options.limit);
    }
    
    return measurements;
  }

  /**
   * Get statistics for a label
   * @param {string} label - Measurement label
   * @returns {Object} Statistics
   */
  getStats(label) {
    const measurements = this.#measurements.filter(m => m.label === label);
    
    if (measurements.length === 0) {
      return {
        label,
        count: 0,
        min: 0,
        max: 0,
        avg: 0,
        total: 0
      };
    }

    const durations = measurements.map(m => m.duration);
    const count = durations.length;
    const total = durations.reduce((a, b) => a + b, 0);
    const avg = total / count;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    return {
      label,
      count,
      min,
      max,
      avg,
      total
    };
  }

  /**
   * Get summary of all measurements
   * @returns {Object} Summary statistics
   */
  getSummary() {
    const labels = new Set(this.#measurements.map(m => m.label));
    const summary = {};

    for (const label of labels) {
      summary[label] = this.getStats(label);
    }

    return summary;
  }

  /**
   * Clear all measurements
   * @returns {ProfilerModule} This instance for chaining
   */
  clear() {
    this.#measurements = [];
    this.#labels.clear();
    this.emit('clear');
    return this;
  }

  /**
   * Set max measurements
   * @param {number} max - Maximum number of measurements
   * @returns {ProfilerModule} This instance for chaining
   */
  setMaxMeasurements(max) {
    if (max < 0) {
      throw new Error('Max measurements must be non-negative');
    }
    this.#maxMeasurements = max;
    while (this.#measurements.length > this.#maxMeasurements) {
      this.#measurements.shift();
    }
    return this;
  }

  /**
   * Get max measurements
   * @returns {number} Current max measurements
   */
  getMaxMeasurements() {
    return this.#maxMeasurements;
  }

  /**
   * Export measurements as JSON
   * @returns {string} JSON string
   */
  exportJSON() {
    return JSON.stringify({
      measurements: this.#measurements,
      summary: this.getSummary()
    }, null, 2);
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.#measurements = [];
    this.#labels.clear();
    this.removeAllListeners();
  }
}
