/**
 * Helpers - Utility Functions
 * Reusable helper functions used across the library
 */

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Whether object is empty
 */
export function isEmpty(obj) {
  if (obj === null || obj === undefined) {
    return true;
  }
  
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  
  return false;
}

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Debounce helper (standalone)
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Debounce delay
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId = null;
  
  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle helper (standalone)
 * @param {Function} fn - Function to throttle
 * @param {number} interval - Throttle interval
 * @returns {Function} Throttled function
 */
export function throttle(fn, interval = 300) {
  let lastCall = 0;
  let timeoutId = null;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, interval - (now - lastCall));
    }
  };
}

/**
 * Memoize function
 * @param {Function} fn - Function to memoize
 * @param {Function} keyGenerator - Key generator function
 * @returns {Function} Memoized function
 */
export function memoize(fn, keyGenerator = null) {
  const cache = new Map();
  
  return function(...args) {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Promise timeout
 * @param {Promise} promise - Promise to timeout
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} message - Timeout message
 * @returns {Promise} Promise with timeout
 */
export function promiseTimeout(promise, timeout = 30000, message = 'Timeout') {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeout);
    
    promise.then(
      (result) => {
        clearTimeout(timeoutId);
        resolve(result);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

/**
 * Retry promise
 * @param {Function} fn - Function returning promise
 * @param {number} retries - Number of retries
 * @param {number} delay - Retry delay
 * @returns {Promise} Promise with retry
 */
export function retryPromise(fn, retries = 3, delay = 1000) {
  let attempts = 0;
  
  const execute = () => {
    attempts++;
    return fn().catch((error) => {
      if (attempts >= retries) {
        throw error;
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(execute()), delay * attempts);
      });
    });
  };
  
  return execute();
}

/**
 * Sleep
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * URL parameters to object
 * @param {string} url - URL to parse
 * @returns {Object} Query parameters
 */
export function parseQueryParams(url) {
  const params = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) {
    return params;
  }
  
  const pairs = queryString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  }
  
  return params;
}

/**
 * Object to URL parameters
 * @param {Object} params - Query parameters
 * @returns {string} URL query string
 */
export function stringifyQueryParams(params) {
  const pairs = [];
  
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (value !== null && value !== undefined) {
        pairs.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        );
      }
    }
  }
  
  return pairs.length ? `?${pairs.join('&')}` : '';
}
