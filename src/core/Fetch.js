// src/core/Fetch.js
export class useFetch {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
    this.interceptors = { request: [], response: [], error: [] };
    this.cache = new Map();
    this.cacheTTL = config.cacheTTL || 60000;
  }

  addRequestInterceptor(fn) {
    this.interceptors.request.push(fn);
    return () => { const i = this.interceptors.request.indexOf(fn); if (i > -1) this.interceptors.request.splice(i, 1); };
  }

  addResponseInterceptor(fn) {
    this.interceptors.response.push(fn);
    return () => { const i = this.interceptors.response.indexOf(fn); if (i > -1) this.interceptors.response.splice(i, 1); };
  }

  addErrorInterceptor(fn) {
    this.interceptors.error.push(fn);
    return () => { const i = this.interceptors.error.indexOf(fn); if (i > -1) this.interceptors.error.splice(i, 1); };
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http://') || endpoint.startsWith('https://') ? endpoint : `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    let config = { ...options, headers: { 'Content-Type': 'application/json', ...this.headers, ...options.headers }, signal: controller.signal };
    for (const interceptor of this.interceptors.request) config = interceptor(config) || config;
    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = errorData;
        for (const interceptor of this.interceptors.error) interceptor(error);
        throw error;
      }
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) data = await response.json();
      else data = await response.text();
      for (const interceptor of this.interceptors.response) data = interceptor(data) || data;
      return { data, status: response.status, headers: response.headers, ok: true };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.name = 'useFetchTimeoutError';
        throw timeoutError;
      }
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    if (options.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) return cached.data;
    }
    const result = await this.request(endpoint, { ...options, method: 'GET' });
    if (options.cache !== false) this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) });
  }

  clearCache() { this.cache.clear(); }
  invalidateCache(endpoint) { for (const key of this.cache.keys()) { if (key.startsWith(endpoint)) this.cache.delete(key); } }
}

export class useFetchError extends Error {
  constructor(status, statusText, data) {
    super(`HTTP ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.name = 'useFetchError';
  }
}
