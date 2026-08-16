// src/core/Draggable.js
export class useDraggable {
  constructor(element, options = {}) {
    this.element = element;
    this.axis = options.axis || 'both';
    this.position = { x: options.initialX || 0, y: options.initialY || 0 };
    this.bounds = options.bounds || null;
    this.onDragStart = options.onDragStart || null;
    this.onDrag = options.onDrag || null;
    this.onDragEnd = options.onDragEnd || null;
    this.disabled = options.disabled || false;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.elementStart = { x: 0, y: 0 };
    this._boundMouseDown = this._handleMouseDown.bind(this);
    this._boundMouseMove = this._handleMouseMove.bind(this);
    this._boundMouseUp = this._handleMouseUp.bind(this);
    this.attach();
  }

  _clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  _applyBounds(x, y) {
    if (!this.bounds) return { x, y };
    const { top, right, bottom, left } = this.bounds;
    const elementWidth = this.element?.offsetWidth || 0;
    const elementHeight = this.element?.offsetHeight || 0;
    return {
      x: this._clamp(x, left !== undefined ? left : -Infinity, right !== undefined ? right - elementWidth : Infinity),
      y: this._clamp(y, top !== undefined ? top : -Infinity, bottom !== undefined ? bottom - elementHeight : Infinity),
    };
  }

  _handleMouseDown(e) {
    if (this.disabled) return;
    if (e.button !== 0) return;
    if (e.target && !e.target.dataset?.dragHandle && e.target.closest && e.target.closest('[data-drag-handle]') === null && this.element.querySelector('[data-drag-handle]')) return;
    if (!this.element) return;
    this.dragStart = { x: e.clientX, y: e.clientY };
    this.elementStart = { x: parseInt(this.element.style.left, 10) || this.position.x || 0, y: parseInt(this.element.style.top, 10) || this.position.y || 0 };
    this.isDragging = true;
    if (this.onDragStart) this.onDragStart({ x: this.elementStart.x, y: this.elementStart.y });
    e.preventDefault();
    document.addEventListener('mousemove', this._boundMouseMove);
    document.addEventListener('mouseup', this._boundMouseUp);
  }

  _handleMouseMove(e) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    let newX = this.elementStart.x;
    let newY = this.elementStart.y;
    if (this.axis === 'x' || this.axis === 'both') newX = this.elementStart.x + dx;
    if (this.axis === 'y' || this.axis === 'both') newY = this.elementStart.y + dy;
    const bounded = this._applyBounds(newX, newY);
    this.position = bounded;
    if (this.element) { this.element.style.left = bounded.x + 'px'; this.element.style.top = bounded.y + 'px'; }
    if (this.onDrag) this.onDrag(bounded);
  }

  _handleMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.onDragEnd) this.onDragEnd(this.position);
    document.removeEventListener('mousemove', this._boundMouseMove);
    document.removeEventListener('mouseup', this._boundMouseUp);
  }

  attach() {
    if (!this.element) return;
    this.element.addEventListener('mousedown', this._boundMouseDown);
    this.element.style.position = this.element.style.position || 'absolute';
    this.element.style.left = this.position.x + 'px';
    this.element.style.top = this.position.y + 'px';
  }

  detach() {
    if (!this.element) return;
    this.element.removeEventListener('mousedown', this._boundMouseDown);
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', this._boundMouseMove);
      document.removeEventListener('mouseup', this._boundMouseUp);
    }
  }

  destroy() { this.detach(); this.element = null; }
  setPosition(x, y) { this.position = { x, y }; if (this.element) { this.element.style.left = x + 'px'; this.element.style.top = y + 'px'; } }
  setDisabled(disabled) { this.disabled = disabled; }
  getPosition() { return this.position; }
}

export function createDraggable(element, options = {}) {
  return new useDraggable(element, options);
}
