// src/core/MediaQuery.js
export class useMediaQuery {
  constructor(query, options = {}) {
    this.query = query;
    this.defaultMatches = options.defaultMatches || false;
    this.onChange = options.onChange || null;
    this.matches = this.defaultMatches;
    this._listeners = new Set();
    this._boundHandler = this._handleChange.bind(this);
    this.attach();
  }

  _handleChange(event) {
    this.matches = event.matches;
    this._notify();
    if (this.onChange) this.onChange(event);
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.matches); } catch (e) {} }); }

  attach() {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    this.mediaQueryList = window.matchMedia(this.query);
    this.matches = this.mediaQueryList.matches;
    if (this.mediaQueryList.addEventListener) {
      this.mediaQueryList.addEventListener('change', this._boundHandler);
    } else if (this.mediaQueryList.addListener) {
      this.mediaQueryList.addListener(this._boundHandler);
    }
  }

  detach() {
    if (!this.mediaQueryList) return;
    if (this.mediaQueryList.removeEventListener) {
      this.mediaQueryList.removeEventListener('change', this._boundHandler);
    } else if (this.mediaQueryList.removeListener) {
      this.mediaQueryList.removeListener(this._boundHandler);
    }
  }

  destroy() { this.detach(); this._listeners.clear(); }
  get() { return this.matches; }
  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }
}

export function createMediaQuery(query, options = {}) {
  return new useMediaQuery(query, options);
}

// Predefined
export function useIsMobile() { return new useMediaQuery('(max-width: 767px)'); }
export function useIsTablet() { return new useMediaQuery('(min-width: 768px) and (max-width: 1023px)'); }
export function useIsDesktop() { return new useMediaQuery('(min-width: 1024px)'); }
export function useIsDarkMode() { return new useMediaQuery('(prefers-color-scheme: dark)'); }
export function useIsPortrait() { return new useMediaQuery('(orientation: portrait)'); }
