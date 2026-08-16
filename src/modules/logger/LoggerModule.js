/**
 * LoggerModule - Logger Module
 * Provides structured logging with levels, prefixes, and subscriptions
 */

import { Module } from '../../core/Module.js';
import { Observable } from '../../core/Observable.js';
import { VexorionError } from '../../shared/errors.js';

export class LoggerModule extends Module {
  /**
   * Private fields
   */
  #observable = null;
  #prefix = '';
  #level = 'info';
  #levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4
  };
  #maxLogs = 1000;
  #logs = [];

  /**
   * Constructor
   * @param {Object} config - Logger configuration
   * @param {string} config.prefix - Logger prefix
   * @param {string} config.level - Log level
   * @param {number} config.maxLogs - Maximum number of logs to store
   */
  constructor(config = {}) {
    super('LoggerModule', config);
    
    this.#prefix = config.prefix || 'VEX';
    this.#level = config.level || 'info';
    this.#maxLogs = config.maxLogs || 1000;
    this.#observable = new Observable(this.#logs);
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validated configuration
   */
  #validateConfig(config) {
    const validLevels = ['debug', 'info', 'warn', 'error', 'none'];
    if (config.level && !validLevels.includes(config.level)) {
      throw new VexorionError(
        `Invalid log level. Must be one of: ${validLevels.join(', ')}`,
        'INVALID_LOG_LEVEL'
      );
    }
    return config;
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {Array} args - Log arguments
   * @returns {Object} Formatted log entry
   */
  #formatLog(level, args) {
    const timestamp = new Date().toISOString();
    const prefix = this.#prefix;
    const color = this.#getColorForLevel(level);
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    return {
      timestamp,
      level,
      prefix,
      message,
      color,
      raw: args
    };
  }

  /**
   * Get color for log level
   * @param {string} level - Log level
   * @returns {string} ANSI color code
   */
  #getColorForLevel(level) {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m'  // Red
    };
    return colors[level] || '\x1b[37m'; // White
  }

  /**
   * Check if log level should be logged
   * @param {string} level - Log level
   * @returns {boolean} Whether level should be logged
   */
  #shouldLog(level) {
    const currentLevelValue = this.#levels[this.#level] || 0;
    const levelValue = this.#levels[level] || 0;
    return levelValue >= currentLevelValue;
  }

  /**
   * Log a message
   * @param {string} level - Log level
   * @param {Array} args - Log arguments
   */
  #log(level, args) {
    if (!this.#shouldLog(level)) {
      return;
    }

    const entry = this.#formatLog(level, args);
    this.#logs.push(entry);
    
    // Trim logs if exceeding max
    if (this.#logs.length > this.#maxLogs) {
      this.#logs = this.#logs.slice(-this.#maxLogs);
    }
    
    this.#observable.setValue(this.#logs);
    this.emit('log', entry);
    
    // Console output with color
    const consoleMethod = console[level] || console.log;
    consoleMethod(
      `[${entry.timestamp}] [${entry.level}] [${entry.prefix}]`,
      ...args
    );
  }

  /**
   * Log debug message
   * @param {...any} args - Arguments
   */
  debug(...args) {
    this.#log('debug', args);
  }

  /**
   * Log info message
   * @param {...any} args - Arguments
   */
  info(...args) {
    this.#log('info', args);
  }

  /**
   * Log warn message
   * @param {...any} args - Arguments
   */
  warn(...args) {
    this.#log('warn', args);
  }

  /**
   * Log error message
   * @param {...any} args - Arguments
   */
  error(...args) {
    this.#log('error', args);
  }

  /**
   * Subscribe to log entries
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    return this.#observable.subscribe(callback);
  }

  /**
   * Get all logs
   * @param {Object} options - Query options
   * @param {string} options.level - Filter by level
   * @param {number} options.limit - Limit number of logs
   * @param {number} options.offset - Offset for pagination
   * @returns {Array} Filtered logs
   */
  getLogs(options = {}) {
    let logs = [...this.#logs];
    
    if (options.level) {
      logs = logs.filter(log => log.level === options.level);
    }
    
    if (options.offset) {
      logs = logs.slice(options.offset);
    }
    
    if (options.limit) {
      logs = logs.slice(0, options.limit);
    }
    
    return logs;
  }

  /**
   * Clear all logs
   */
  clear() {
    this.#logs = [];
    this.#observable.setValue(this.#logs);
    this.emit('clear');
  }

  /**
   * Set log level
   * @param {string} level - New log level
   */
  setLevel(level) {
    if (!this.#levels[level]) {
      throw new VexorionError(
        `Invalid log level: ${level}`,
        'INVALID_LOG_LEVEL'
      );
    }
    this.#level = level;
  }

  /**
   * Get current log level
   * @returns {string} Current log level
   */
  getLevel() {
    return this.#level;
  }

  /**
   * Set maximum number of logs to store
   * @param {number} maxLogs - Maximum number of logs
   */
  setMaxLogs(maxLogs) {
    this.#maxLogs = maxLogs;
    if (this.#logs.length > this.#maxLogs) {
      this.#logs = this.#logs.slice(-this.#maxLogs);
      this.#observable.setValue(this.#logs);
    }
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.#logs = [];
    this.#observable.unsubscribeAll();
    this.removeAllListeners();
  }
}
