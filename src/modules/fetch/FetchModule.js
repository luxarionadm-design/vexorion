/**
 * FetchModule - HTTP Client Module
 * Provides fetch with interceptors, retries, and timeout
 */

import { Module } from '../../core/Module.js';
import { VexorionError } from '../../shared/errors.js';
import { DEFAULT_TIMEOUT } from '../../shared/constants.js';

export class FetchModule extends Module {
  /**
   * Private fields
   */
  #baseURL = '';
  #headers = {};
  #interceptors = {
    request: [],
    response: [],
    error: []
  };
  #retry = 0;
  #timeout = DEFAULT_TIMEOUT;
  #abortController = null;

  /**
   * Constructor
   * @param {Object} config - Fetch configuration
   * @param {string} config.baseURL - Base URL
   * @param {Object} config.headers - Default headers
   * @param {number} config.timeout - Request timeout in ms
   * @param {number} config.retry - Number of retry attempts
   */
  constructor(config = {}) {
    super('FetchModule', config);
    
    this.#baseURL = config.baseURL || '';
    this.#headers = { 'Content-Type': 'application/json', ...config.headers };
    this.#timeout = config.timeout || DEFAULT_TIMEOUT;
    this.#retry = config.retry || 0;
  }

  /**
   * Validate configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validated configuration
   */
  #validateConfig(config) {
    if (config.retry && (typeof config.retry !== 'number' || config.retry < 0)) {
      throw new VexorionError(
        'Retry must be a non-negative number',
        'INVALID_RETRY'
      );
    }
    return config;
  }

  /**
   * Add request interceptor
   * @param {Function} interceptor - Interceptor function
   * @returns {Function} Remove interceptor function
   */
  addRequestInterceptor(interceptor) {
    this.#interceptors.request.push(interceptor);
    return () => {
      this.#interceptors.request = this.#interceptors.request.filter(
        fn => fn !== interceptor
      );
    };
  }

  /**
   * Add response interceptor
   * @param {Function} interceptor - Interceptor function
   * @returns {Function} Remove interceptor function
   */
  addResponseInterceptor(interceptor) {
    this.#interceptors.response.push(interceptor);
    return () => {
      this.#interceptors.response = this.#interceptors.response.filter(
        fn => fn !== interceptor
      );
    };
  }

  /**
   * Add error interceptor
   * @param {Function} interceptor - Interceptor function
   * @returns {Function} Remove interceptor function
   */
  addErrorInterceptor(interceptor) {
    this.#interceptors.error.push(interceptor);
    return () => {
      this.#interceptors.error = this.#interceptors.error.filter(
        fn => fn !== interceptor
      );
    };
  }

  /**
   * Execute request with interceptors
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method
   * @param {Object} options.headers - Request headers
   * @param {any} options.body - Request body
   * @param {number} options.timeout - Request timeout
   * @param {number} options.retry - Number of retries
   * @returns {Promise<Object>} Response object
   */
  async #executeRequest(url, options = {}) {
    const fullURL = this.#baseURL + url;
    const method = options.method || 'GET';
    const headers = { ...this.#headers, ...options.headers };
    const timeout = options.timeout || this.#timeout;
    const retry = options.retry !== undefined ? options.retry : this.#retry;

    // Build request configuration
    const config = {
      method,
      headers,
      signal: options.signal || this.#createAbortSignal(timeout),
      ...(options.body && { body: JSON.stringify(options.body) })
    };

    // Apply request interceptors
    let interceptedConfig = config;
    for (const interceptor of this.#interceptors.request) {
      interceptedConfig = await interceptor(interceptedConfig, url, options);
    }

    try {
      const response = await fetch(fullURL, interceptedConfig);
      
      let data = await this.#parseResponse(response);
      
      // Apply response interceptors
      for (const interceptor of this.#interceptors.response) {
        data = await interceptor(data, response);
      }
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        ok: response.ok
      };
    } catch (error) {
      // Handle retries
      if (retry > 0 && this.#shouldRetry(error)) {
        const newOptions = {
          ...options,
          retry: retry - 1,
          timeout: timeout * 1.5 // Exponential backoff
        };
        return this.#executeRequest(url, newOptions);
      }
      
      // Apply error interceptors
      let processedError = error;
      for (const interceptor of this.#interceptors.error) {
        processedError = await interceptor(processedError, url, options);
      }
      
      throw processedError;
    }
  }

  /**
   * Parse response body
   * @param {Response} response - Fetch response
   * @returns {Promise<any>} Parsed response body
   */
  async #parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else if (contentType && contentType.includes('text')) {
      return response.text();
    } else {
      return response.blob();
    }
  }

  /**
   * Check if request should be retried
   * @param {Error} error - Error object
   * @returns {boolean} Whether to retry
   */
  #shouldRetry(error) {
    // Retry on network errors, 5xx errors, and timeout errors
    if (error.name === 'AbortError') {
      return false;
    }
    if (error.status >= 500 && error.status < 600) {
      return true;
    }
    if (error.message && error.message.includes('NetworkError')) {
      return true;
    }
    if (error.code === 'ECONNABORTED') {
      return true;
    }
    return false;
  }

  /**
   * Create abort controller with timeout
   * @param {number} timeout - Timeout in milliseconds
   * @returns {AbortSignal} Abort signal
   */
  #createAbortSignal(timeout) {
    if (this.#abortController) {
      this.#abortController.abort();
    }
    this.#abortController = new AbortController();
    
    if (timeout && timeout > 0) {
      setTimeout(() => {
        this.#abortController.abort();
      }, timeout);
    }
    
    return this.#abortController.signal;
  }

  /**
   * HTTP GET request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response object
   */
  get(url, options = {}) {
    return this.#executeRequest(url, { ...options, method: 'GET' });
  }

  /**
   * HTTP POST request
   * @param {string} url - Request URL
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response object
   */
  post(url, body, options = {}) {
    return this.#executeRequest(url, { ...options, method: 'POST', body });
  }

  /**
   * HTTP PUT request
   * @param {string} url - Request URL
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response object
   */
  put(url, body, options = {}) {
    return this.#executeRequest(url, { ...options, method: 'PUT', body });
  }

  /**
   * HTTP PATCH request
   * @param {string} url - Request URL
   * @param {Object} body - Request body
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response object
   */
  patch(url, body, options = {}) {
    return this.#executeRequest(url, { ...options, method: 'PATCH', body });
  }

  /**
   * HTTP DELETE request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response object
   */
  delete(url, options = {}) {
    return this.#executeRequest(url, { ...options, method: 'DELETE' });
  }

  /**
   * Set global headers
   * @param {Object} headers - Headers to merge
   */
  setHeaders(headers) {
    this.#headers = { ...this.#headers, ...headers };
  }

  /**
   * Get current headers
   * @returns {Object} Current headers
   */
  getHeaders() {
    return { ...this.#headers };
  }

  /**
   * Set base URL
   * @param {string} baseURL - New base URL
   */
  setBaseURL(baseURL) {
    this.#baseURL = baseURL;
  }

  /**
   * Get base URL
   * @returns {string} Current base URL
   */
  getBaseURL() {
    return this.#baseURL;
  }

  /**
   * Set timeout
   * @param {number} timeout - Timeout in milliseconds
   */
  setTimeout(timeout) {
    this.#timeout = timeout;
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    if (this.#abortController) {
      this.#abortController.abort();
      this.#abortController = null;
    }
    this.#interceptors.request = [];
    this.#interceptors.response = [];
    this.#interceptors.error = [];
  }
}
