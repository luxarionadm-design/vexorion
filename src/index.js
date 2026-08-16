// src/index.js - BARREL EXPORT + ENTRY POINT

// Core
export { useFetch, useFetchError } from './core/Fetch.js';
export { useLocalStorage, useSessionStorage } from './core/Storage.js';
export { useCookie } from './core/Cookie.js';
export { useDebounce, createDebounce } from './core/Debounce.js';
export { useThrottle, createThrottle } from './core/Throttle.js';
export { useMemoize, createMemoize } from './core/Memoize.js';
export { useToggle, createToggle } from './core/Toggle.js';
export { useClickOutside, createClickOutside } from './core/ClickOutside.js';
export { useHover, createHover } from './core/Hover.js';
export { useFocus, createFocus } from './core/Focus.js';
export { useScroll, createScroll } from './core/Scroll.js';
export { useDraggable, createDraggable } from './core/Draggable.js';
export { useForm, createForm } from './core/Form.js';
export { useValidation, createValidation, validationRules } from './core/Validation.js';
export { useMediaQuery, createMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode, useIsPortrait } from './core/MediaQuery.js';
export { useWindowSize, createWindowSize } from './core/WindowSize.js';
export { useGeolocation, createGeolocation } from './core/Geolocation.js';
export { useInterval, createInterval } from './core/Interval.js';
export { useTimeout, createTimeout } from './core/Timeout.js';
export { useCountdown, createCountdown } from './core/Countdown.js';
export { useLogger, createLogger } from './core/Logger.js';
export { useCache, createCache } from './core/Cache.js';
export { useQueue, createQueue } from './core/Queue.js';
export { useEventEmitter, createEventEmitter } from './core/EventEmitter.js';
export { useEncryption, createEncryption } from './core/Encryption.js';
export { useHash, createHash } from './core/Hash.js';
export { useToken, createToken } from './core/Token.js';
export { useFileUpload, createFileUpload } from './core/FileUpload.js';
export { useFileReader, createFileReader } from './core/FileReader.js';
export { useWebSocket, createWebSocket } from './core/WebSocket.js';
export { useSSE, createSSE } from './core/SSE.js';
export { usePolling, createPolling } from './core/Polling.js';
export { useProfiler, createProfiler } from './core/Profiler.js';
export { useTimer, createTimer } from './core/Timer.js';

import { useFetch } from './core/Fetch.js';
import { useLocalStorage, useSessionStorage } from './core/Storage.js';
import { useCookie } from './core/Cookie.js';
import { useDebounce } from './core/Debounce.js';
import { useThrottle } from './core/Throttle.js';
import { useMemoize } from './core/Memoize.js';
import { useToggle } from './core/Toggle.js';
import { useClickOutside } from './core/ClickOutside.js';
import { useHover } from './core/Hover.js';
import { useFocus } from './core/Focus.js';
import { useScroll } from './core/Scroll.js';
import { useDraggable } from './core/Draggable.js';
import { useForm } from './core/Form.js';
import { useValidation } from './core/Validation.js';
import { useMediaQuery } from './core/MediaQuery.js';
import { useWindowSize } from './core/WindowSize.js';
import { useGeolocation } from './core/Geolocation.js';
import { useInterval } from './core/Interval.js';
import { useTimeout } from './core/Timeout.js';
import { useCountdown } from './core/Countdown.js';
import { useLogger } from './core/Logger.js';
import { useCache } from './core/Cache.js';
import { useQueue } from './core/Queue.js';
import { useEventEmitter } from './core/EventEmitter.js';
import { useEncryption } from './core/Encryption.js';
import { useHash } from './core/Hash.js';
import { useToken } from './core/Token.js';
import { useFileUpload } from './core/FileUpload.js';
import { useFileReader } from './core/FileReader.js';
import { useWebSocket } from './core/WebSocket.js';
import { useSSE } from './core/SSE.js';
import { usePolling } from './core/Polling.js';
import { useProfiler } from './core/Profiler.js';
import { useTimer } from './core/Timer.js';

// MAIN CLASS - Entry Point
export class Vexorion {
  constructor(config = {}) {
    this.config = config;
    this._instances = new Map();
  }

  // Lazy loading instances
  _getInstance(key, Class, config = {}) {
    if (!this._instances.has(key)) {
      this._instances.set(key, new Class({ ...this.config, ...config }));
    }
    return this._instances.get(key);
  }

  // Fetch
  fetch(config = {}) { return this._getInstance('fetch', useFetch, config); }

  // Storage
  localStorage(config = {}) { return this._getInstance('localStorage', useLocalStorage, config); }
  sessionStorage(config = {}) { return this._getInstance('sessionStorage', useSessionStorage, config); }

  // Cookie
  cookie(config = {}) { return this._getInstance('cookie', useCookie, config); }

  // Performance
  debounce(config = {}) { return new useDebounce(config); }
  throttle(config = {}) { return new useThrottle(config); }
  memoize(config = {}) { return new useMemoize(config); }

  // UI
  toggle(initial = false) { return new useToggle(initial); }
  clickOutside(element, handler, options = {}) { return new useClickOutside(element, handler, options); }
  hover(element, options = {}) { return new useHover(element, options); }
  focus(element, options = {}) { return new useFocus(element, options); }
  scroll(options = {}) { return new useScroll(options); }
  draggable(element, options = {}) { return new useDraggable(element, options); }

  // Form
  form(options = {}) { return new useForm(options); }
  validation(schema = {}) { return new useValidation(schema); }

  // Media
  mediaQuery(query, options = {}) { return new useMediaQuery(query, options); }
  windowSize(options = {}) { return new useWindowSize(options); }
  geolocation(options = {}) { return new useGeolocation(options); }

  // Timers
  interval(callback, delay, options = {}) { return new useInterval(callback, delay, options); }
  timeout(callback, delay, options = {}) { return new useTimeout(callback, delay, options); }
  countdown(seconds, options = {}) { return new useCountdown(seconds, options); }
  timer(options = {}) { return new useTimer(options); }

  // Utilities
  logger(options = {}) { return new useLogger(options); }
  cache(options = {}) { return new useCache(options); }
  queue(options = {}) { return new useQueue(options); }
  eventEmitter() { return new useEventEmitter(); }

  // Security
  encryption(options = {}) { return new useEncryption(options); }
  hash() { return new useHash(); }
  token() { return new useToken(); }

  // File
  fileUpload(options = {}) { return new useFileUpload(options); }
  fileReader() { return new useFileReader(); }

  // Network
  webSocket(url, options = {}) { return new useWebSocket(url, options); }
  sse(url, options = {}) { return new useSSE(url, options); }
  polling(fn, interval, options = {}) { return new usePolling(fn, interval, options); }

  // Debug
  profiler(options = {}) { return new useProfiler(options); }

  // Clear all instances
  clearInstances() { this._instances.clear(); }

  // Get instance
  getInstance(key) { return this._instances.get(key) || null; }
}

// Default export
export default Vexorion;
