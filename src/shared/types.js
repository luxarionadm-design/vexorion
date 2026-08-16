/**
 * Types - Type Definitions
 * Provides JSDoc type definitions for better IDE support
 */

/**
 * @typedef {Object} VexorionConfig
 * @property {string} baseURL - Base URL for fetch requests
 * @property {string} prefix - Prefix for storage keys
 * @property {string} logLevel - Log level (debug, info, warn, error)
 * @property {number} timeout - Default timeout for async operations
 */

/**
 * @typedef {Object} FetchConfig
 * @property {string} baseURL - Base URL
 * @property {Object} headers - Default headers
 * @property {number} timeout - Request timeout in ms
 * @property {number} retry - Number of retry attempts
 */

/**
 * @typedef {Object} FetchResponse
 * @property {any} data - Response data
 * @property {number} status - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {Headers} headers - Response headers
 * @property {boolean} ok - Whether request was successful
 */

/**
 * @typedef {Object} StorageConfig
 * @property {string} prefix - Key prefix
 * @property {Object} encryption - Encryption instance
 * @property {number} expiry - Cookie expiry in seconds
 * @property {string} path - Cookie path
 * @property {string} domain - Cookie domain
 * @property {boolean} secure - Cookie secure flag
 * @property {string} sameSite - Cookie SameSite attribute
 */

/**
 * @typedef {Object} FormConfig
 * @property {Object} initialValues - Initial form values
 * @property {Function} validate - Validation function
 * @property {Function} onSubmit - Submit handler
 * @property {boolean} validateOnChange - Validate on change
 */

/**
 * @typedef {Object} DebounceConfig
 * @property {number} delay - Debounce delay in milliseconds
 * @property {boolean} immediate - Execute immediately on first call
 */

/**
 * @typedef {Object} ThrottleConfig
 * @property {number} interval - Throttle interval in milliseconds
 * @property {boolean} leading - Execute on leading edge
 * @property {boolean} trailing - Execute on trailing edge
 */

/**
 * @typedef {Object} LoggerConfig
 * @property {string} prefix - Logger prefix
 * @property {string} level - Log level
 * @property {number} maxLogs - Maximum number of logs to store
 */

/**
 * @typedef {Object} TimerConfig
 * @property {string} format - Time format
 * @property {number} tickInterval - Tick interval in milliseconds
 */

/**
 * @typedef {Object} QueueConfig
 * @property {number} concurrent - Number of concurrent tasks
 * @property {number} retry - Number of retry attempts
 * @property {boolean} autoStart - Auto start processing
 */

/**
 * @typedef {Object} EncryptionConfig
 * @property {string} secret - Secret key
 * @property {string} algorithm - Encryption algorithm
 * @property {number} iterations - PBKDF2 iterations
 * @property {number} keyLength - Key length in bits
 */

/**
 * @typedef {Object} HashConfig
 * @property {string} algorithm - Hash algorithm
 */

/**
 * @typedef {Object} TokenConfig
 * @property {string} secret - Secret key for JWT
 * @property {number} expiresIn - Token expiration in seconds
 */

/**
 * @typedef {Object} EventEmitterConfig
 * @property {number} maxListeners - Maximum listeners per event
 * @property {boolean} wildcard - Enable wildcard support
 */

/**
 * @typedef {Object} CacheConfig
 * @property {number} ttl - Time to live in milliseconds
 * @property {number} maxSize - Maximum number of items
 * @property {number} maxItemSize - Maximum item size in bytes
 */

/**
 * @typedef {Object} PollingConfig
 * @property {boolean} immediate - Start immediately
 * @property {number} maxAttempts - Maximum polling attempts
 */

/**
 * @typedef {Object} WebSocketConfig
 * @property {boolean} reconnect - Auto reconnect
 * @property {number} reconnectInterval - Reconnect interval in milliseconds
 * @property {number} maxReconnectAttempts - Maximum reconnect attempts
 */

/**
 * @typedef {Object} FileConfig
 * @property {number} maxSize - Maximum file size in bytes
 * @property {Array} allowedTypes - Allowed MIME types
 * @property {number} maxFiles - Maximum number of files
 */

/**
 * @typedef {Object} ProfilerConfig
 * @property {boolean} autoStart - Start profiling automatically
 * @property {string} prefix - Profiler prefix
 * @property {number} maxMeasurements - Maximum measurements to store
 */

/**
 * @typedef {Object} Measurement
 * @property {string} label - Measurement label
 * @property {number} duration - Duration in milliseconds
 * @property {Object} metadata - Additional metadata
 * @property {number} timestamp - Timestamp of measurement
 */

/**
 * @typedef {Object} QueueStats
 * @property {number} total - Total tasks
 * @property {number} completed - Completed tasks
 * @property {number} failed - Failed tasks
 * @property {number} pending - Pending tasks
 * @property {number} running - Running tasks
 * @property {boolean} paused - Whether queue is paused
 * @property {number} concurrent - Concurrent tasks
 */

/**
 * @typedef {Object} CacheStats
 * @property {number} size - Current number of items
 * @property {number} maxSize - Maximum number of items
 * @property {number} totalSize - Total size of all items
 * @property {number} maxItemSize - Maximum item size in bytes
 * @property {number} expiredCount - Number of expired items
 * @property {number} ttl - Time to live in milliseconds
 */

export const Types = {
  // This is a documentation-only file
  // No actual code is exported
};
