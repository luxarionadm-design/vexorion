// src/core/ClickOutside.js
export class useClickOutside {
  constructor(element, handler, options = {}) {
    this.element = element;
    this.handler = handler;
    this.enabled = options.enabled !== undefined ? options.enabled : true;
    this.excludeSelectors = options.excludeSelectors || [];
    this.eventType = options.eventType || 'mousedown';
    this.capture = options.capture || false;
    this._boundHandler = this._handleClick.bind(this);
    if (this.enabled) this.attach();
  }

  _handleClick(event) {
    if (!this.element || !this.enabled) return;
    const target = event.target;
    if (this.element.contains(target)) return;
    for (const selector of this.excludeSelectors) {
      if (typeof selector === 'string') {
        if (target.matches && (target.matches(selector) || target.closest(selector))) return;
      } else if (selector && selector.contains && selector.contains(target)) {
        return;
      }
    }
    if (this.handler) this.handler(event);
  }

  attach() {
    if (typeof document === 'undefined') return;
    document.addEventListener(this.eventType, this._boundHandler, this.capture);
  }
  detach() {
    if (typeof document === 'undefined') return;
    document.removeEventListener(this.eventType, this._boundHandler, this.capture);
  }
  setEnabled(enabled) { this.enabled = enabled; if (enabled) this.attach(); else this.detach(); }
  destroy() { this.detach(); this.element = null; this.handler = null; }
  setElement(element) { this.element = element; }
  setHandler(handler) { this.handler = handler; }
  addExclude(selector) { this.excludeSelectors.push(selector); }
  removeExclude(selector) { const index = this.excludeSelectors.indexOf(selector); if (index > -1) this.excludeSelectors.splice(index, 1); }
}

export function createClickOutside(element, handler, options = {}) {
  return new useClickOutside(element, handler, options);
}
