// src/core/Hover.js
export class useHover {
  constructor(element, options = {}) {
    this.element = element;
    this.isHovered = false;
    this.enterDelay = options.enterDelay || 0;
    this.leaveDelay = options.leaveDelay || 0;
    this.onEnter = options.onEnter || null;
    this.onLeave = options.onLeave || null;
    this._enterTimeout = null;
    this._leaveTimeout = null;
    this._boundEnter = this._handleEnter.bind(this);
    this._boundLeave = this._handleLeave.bind(this);
    this.attach();
  }

  _handleEnter(event) {
    if (this._leaveTimeout) { clearTimeout(this._leaveTimeout); this._leaveTimeout = null; }
    if (this.enterDelay > 0) {
      this._enterTimeout = setTimeout(() => { this.isHovered = true; if (this.onEnter) this.onEnter(event); }, this.enterDelay);
    } else {
      this.isHovered = true;
      if (this.onEnter) this.onEnter(event);
    }
  }

  _handleLeave(event) {
    if (this._enterTimeout) { clearTimeout(this._enterTimeout); this._enterTimeout = null; }
    if (this.leaveDelay > 0) {
      this._leaveTimeout = setTimeout(() => { this.isHovered = false; if (this.onLeave) this.onLeave(event); }, this.leaveDelay);
    } else {
      this.isHovered = false;
      if (this.onLeave) this.onLeave(event);
    }
  }

  attach() {
    if (!this.element) return;
    this.element.addEventListener('mouseenter', this._boundEnter);
    this.element.addEventListener('mouseleave', this._boundLeave);
  }

  detach() {
    if (!this.element) return;
    this.element.removeEventListener('mouseenter', this._boundEnter);
    this.element.removeEventListener('mouseleave', this._boundLeave);
    if (this._enterTimeout) { clearTimeout(this._enterTimeout); this._enterTimeout = null; }
    if (this._leaveTimeout) { clearTimeout(this._leaveTimeout); this._leaveTimeout = null; }
  }

  destroy() { this.detach(); this.element = null; }
  setElement(element) { this.detach(); this.element = element; this.attach(); }
}

export function createHover(element, options = {}) {
  return new useHover(element, options);
}
