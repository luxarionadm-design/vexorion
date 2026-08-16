// src/core/Focus.js
export class useFocus {
  constructor(element, options = {}) {
    this.element = element;
    this.isFocused = false;
    this.onFocus = options.onFocus || null;
    this.onBlur = options.onBlur || null;
    this._boundFocus = this._handleFocus.bind(this);
    this._boundBlur = this._handleBlur.bind(this);
    this.attach();
  }

  _handleFocus(event) { this.isFocused = true; if (this.onFocus) this.onFocus(event); }
  _handleBlur(event) { this.isFocused = false; if (this.onBlur) this.onBlur(event); }

  attach() {
    if (!this.element) return;
    this.element.addEventListener('focus', this._boundFocus);
    this.element.addEventListener('blur', this._boundBlur);
  }

  detach() {
    if (!this.element) return;
    this.element.removeEventListener('focus', this._boundFocus);
    this.element.removeEventListener('blur', this._boundBlur);
  }

  destroy() { this.detach(); this.element = null; }
  focus() { if (this.element) this.element.focus(); }
  blur() { if (this.element) this.element.blur(); }
  setElement(element) { this.detach(); this.element = element; this.attach(); }
}

export function createFocus(element, options = {}) {
  return new useFocus(element, options);
}
