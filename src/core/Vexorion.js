/**
 * Vexorion - Root Class
 * Main entry point for the library
 * Implements Singleton pattern to ensure only one instance
 */

import { FetchModule } from '../modules/fetch/index.js';
import { StorageModule } from '../modules/storage/index.js';
import { ToggleModule } from '../modules/toggle/index.js';
import { FormModule } from '../modules/form/index.js';
import { DebounceModule } from '../modules/debounce/index.js';
import { ThrottleModule } from '../modules/throttle/index.js';
import { LoggerModule } from '../modules/logger/index.js';
import { TimerModule } from '../modules/timer/index.js';
import { QueueModule } from '../modules/queue/index.js';
import { EncryptionModule } from '../modules/encryption/index.js';
import { HashModule } from '../modules/hash/index.js';
import { TokenModule } from '../modules/token/index.js';
import { EventEmitterModule } from '../modules/event-emitter/index.js';
import { CacheModule } from '../modules/cache/index.js';
import { PollingModule } from '../modules/polling/index.js';
import { WebSocketModule } from '../modules/websocket/index.js';
import { FileModule } from '../modules/file/index.js';
import { ProfilerModule } from '../modules/profiler/index.js';
import { Singleton } from './Singleton.js';

export class Vexorion extends Singleton {
  /**
   * Private fields (ES2022)
   */
  #config = null;
  #instances = new Map();
  #initialized = false;

  /**
   * Constructor - Private (Singleton pattern)
   * @param {Object} config - Configuration object
   * @param {string} config.baseURL - Base URL for fetch requests
   * @param {string} config.prefix - Prefix for storage keys
   * @param {string} config.logLevel - Log level (debug, info, warn, error)
   * @param {number} config.timeout - Default timeout for async operations
   */
  constructor(config = {}) {
    super();
    
    if (Vexorion.instance) {
      return Vexorion.instance;
    }

    this.#config = this.#validateConfig(config);
    this.#initialized = true;
    
    // Freeze the instance to prevent modifications
    Object.freeze(this);
    
    Vexorion.instance = this;
  }

  /**
   * Get singleton instance
   * @param {Object} config - Configuration (only used for first initialization)
   * @returns {Vexorion} The singleton instance
   */
  static getInstance(config = {}) {
    if (!Vexorion.instance) {
      Vexorion.instance = new Vexorion(config);
    }
    return Vexorion.instance;
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validated configuration
   * @throws {VexorionError} If configuration is invalid
   */
  #validateConfig(config) {
    const validated = {
      baseURL: config.baseURL || '',
      prefix: config.prefix || 'vx_',
      logLevel: config.logLevel || 'info',
      timeout: config.timeout || 30000,
      ...config
    };

    // Validate log level
    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(validated.logLevel)) {
      throw new VexorionError(
        `Invalid logLevel. Must be one of: ${validLogLevels.join(', ')}`,
        'INVALID_LOG_LEVEL'
      );
    }

    // Validate timeout
    if (typeof validated.timeout !== 'number' || validated.timeout < 0) {
      throw new VexorionError(
        'Timeout must be a positive number',
        'INVALID_TIMEOUT'
      );
    }

    return validated;
  }

  /**
   * Get configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.#config };
  }

  /**
   * Update configuration (partial update allowed)
   * @param {Object} newConfig - New configuration to merge
   */
  updateConfig(newConfig) {
    this.#config = {
      ...this.#config,
      ...this.#validateConfig(newConfig)
    };
  }

  /**
   * Get or create a cached instance
   * @param {string} key - Cache key
   * @param {Function} factory - Factory function to create instance
   * @returns {Object} Cached instance
   */
  #getInstance(key, factory) {
    if (!this.#instances.has(key)) {
      this.#instances.set(key, factory());
    }
    return this.#instances.get(key);
  }

  /**
   * Create a fetch module instance
   * @param {Object} config - Custom fetch configuration
   * @returns {FetchModule} Fetch module instance
   */
  fetch(config = {}) {
    const fetchConfig = {
      baseURL: this.#config.baseURL,
      timeout: this.#config.timeout,
      ...config
    };
    
    return this.#getInstance(
      `fetch:${JSON.stringify(fetchConfig)}`,
      () => new FetchModule(fetchConfig)
    );
  }

  /**
   * Create a storage module instance
   * @param {string} type - Storage type ('local' | 'session' | 'cookie')
   * @param {Object} config - Custom storage configuration
   * @returns {StorageModule} Storage module instance
   */
  storage(type = 'local', config = {}) {
    const storageConfig = {
      prefix: this.#config.prefix,
      ...config
    };
    
    return new StorageModule(type, storageConfig);
  }

  /**
   * Create a toggle module instance
   * @param {boolean} initialValue - Initial toggle state
   * @returns {ToggleModule} Toggle module instance
   */
  toggle(initialValue = false) {
    return new ToggleModule(initialValue);
  }

  /**
   * Create a form module instance
   * @param {Object} config - Form configuration
   * @param {Object} config.initialValues - Initial form values
   * @param {Function} config.validate - Validation function
   * @param {Function} config.onSubmit - Submit handler
   * @param {boolean} config.validateOnChange - Validate on change
   * @returns {FormModule} Form module instance
   */
  form(config) {
    return new FormModule(config);
  }

  /**
   * Create a debounce module instance
   * @param {Object} config - Debounce configuration
   * @param {number} config.delay - Debounce delay in milliseconds
   * @param {boolean} config.immediate - Execute immediately on first call
   * @returns {DebounceModule} Debounce module instance
   */
  debounce(config = {}) {
    return new DebounceModule(config);
  }

  /**
   * Create a throttle module instance
   * @param {Object} config - Throttle configuration
   * @param {number} config.interval - Throttle interval in milliseconds
   * @param {boolean} config.leading - Execute on leading edge
   * @param {boolean} config.trailing - Execute on trailing edge
   * @returns {ThrottleModule} Throttle module instance
   */
  throttle(config = {}) {
    return new ThrottleModule(config);
  }

  /**
   * Create a logger module instance
   * @param {Object} config - Logger configuration
   * @param {string} config.prefix - Logger prefix
   * @param {string} config.level - Log level
   * @returns {LoggerModule} Logger module instance
   */
  logger(config = {}) {
    const loggerConfig = {
      prefix: config.prefix || 'VEX',
      level: config.level || this.#config.logLevel,
      ...config
    };
    
    return new LoggerModule(loggerConfig);
  }

  /**
   * Create a timer module instance
   * @param {Object} config - Timer configuration
   * @returns {TimerModule} Timer module instance
   */
  timer(config = {}) {
    return new TimerModule(config);
  }

  /**
   * Create a queue module instance
   * @param {Object} config - Queue configuration
   * @param {number} config.concurrent - Number of concurrent tasks
   * @param {number} config.retry - Number of retry attempts
   * @returns {QueueModule} Queue module instance
   */
  queue(config = {}) {
    return new QueueModule(config);
  }

  /**
   * Create an encryption module instance
   * @param {Object} config - Encryption configuration
   * @param {string} config.secret - Secret key for encryption
   * @param {string} config.algorithm - Encryption algorithm
   * @returns {EncryptionModule} Encryption module instance
   */
  encryption(config = {}) {
    return new EncryptionModule(config);
  }

  /**
   * Create a hash module instance
   * @param {Object} config - Hash configuration
   * @param {string} config.algorithm - Hash algorithm
   * @returns {HashModule} Hash module instance
   */
  hash(config = {}) {
    return new HashModule(config);
  }

  /**
   * Create a token module instance
   * @param {Object} config - Token configuration
   * @param {string} config.secret - Secret key for JWT
   * @param {number} config.expiresIn - Token expiration in seconds
   * @returns {TokenModule} Token module instance
   */
  token(config = {}) {
    return new TokenModule(config);
  }

  /**
   * Create an event emitter module instance
   * @param {Object} config - Event emitter configuration
   * @param {number} config.maxListeners - Maximum number of listeners
   * @returns {EventEmitterModule} Event emitter module instance
   */
  eventEmitter(config = {}) {
    return new EventEmitterModule(config);
  }

  /**
   * Create a cache module instance
   * @param {Object} config - Cache configuration
   * @param {number} config.ttl - Time to live in milliseconds
   * @param {number} config.maxSize - Maximum cache size
   * @returns {CacheModule} Cache module instance
   */
  cache(config = {}) {
    return new CacheModule(config);
  }

  /**
   * Create a polling module instance
   * @param {Function} fn - Polling function
   * @param {number} interval - Polling interval in milliseconds
   * @param {Object} config - Polling configuration
   * @param {boolean} config.immediate - Start immediately
   * @param {number} config.maxAttempts - Maximum polling attempts
   * @returns {PollingModule} Polling module instance
   */
  polling(fn, interval, config = {}) {
    return new PollingModule(fn, interval, config);
  }

  /**
   * Create a WebSocket module instance
   * @param {string} url - WebSocket URL
   * @param {Object} config - WebSocket configuration
   * @param {boolean} config.reconnect - Auto reconnect
   * @param {number} config.reconnectInterval - Reconnect interval
   * @param {number} config.maxReconnectAttempts - Maximum reconnect attempts
   * @returns {WebSocketModule} WebSocket module instance
   */
  webSocket(url, config = {}) {
    return new WebSocketModule(url, config);
  }

  /**
   * Create a file module instance
   * @param {Object} config - File configuration
   * @param {number} config.maxSize - Maximum file size in bytes
   * @param {Array} config.allowedTypes - Allowed MIME types
   * @returns {FileModule} File module instance
   */
  file(config = {}) {
    return new FileModule(config);
  }

  /**
   * Create a profiler module instance
   * @param {Object} config - Profiler configuration
   * @param {boolean} config.autoStart - Start profiling automatically
   * @param {string} config.prefix - Profiler prefix
   * @returns {ProfilerModule} Profiler module instance
   */
  profiler(config = {}) {
    return new ProfilerModule(config);
  }

  /**
   * Clean up all instances
   */
  destroy() {
    for (const [key, instance] of this.#instances) {
      if (instance.destroy && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    }
    this.#instances.clear();
    this.#initialized = false;
  }

  /**
   * Check if Vexorion is initialized
   * @returns {boolean} Initialization status
   */
  isInitialized() {
    return this.#initialized;
  }

  /**
   * Static method to check if an instance exists
   * @returns {boolean} Whether an instance exists
   */
  static hasInstance() {
    return !!Vexorion.instance;
  }

  /**
   * Static method to get the global instance
   * @returns {Vexorion|null} The global instance
   */
  static getGlobalInstance() {
    return Vexorion.instance || null;
  }

  /**
   * Static method to destroy the global instance
   */
  static destroyGlobalInstance() {
    if (Vexorion.instance) {
      Vexorion.instance.destroy();
      Vexorion.instance = null;
    }
  }
}

// Export singleton instance accessor
export const vex = Vexorion.getInstance();
