// src/core/Scroll.js
export class useScroll {
  constructor(options = {}) {
    this.target = options.target || (typeof window !== 'undefined' ? window : null);
    this.throttle = options.throttle || 100;
    this.onScroll = options.onScroll || null;
    this.scroll = { x: 0, y: 0, isScrolling: false, direction: 'none' };
    this.lastScrollY = 0;
    this.lastScrollX = 0;
    this.timeoutRef = null;
    this.isScrollingRef = false;
    this._boundHandler = this._handleScroll.bind(this);
    this.attach();
  }

  _handleScroll() {
    if (!this.target) return;
    const x = this.target === window ? window.scrollX : (this.target.scrollLeft || 0);
    const y = this.target === window ? window.scrollY : (this.target.scrollTop || 0);
    let direction = 'none';
    if (y > this.lastScrollY) direction = 'down';
    else if (y < this.lastScrollY) direction = 'up';
    else if (x > this.lastScrollX) direction = 'right';
    else if (x < this.lastScrollX) direction = 'left';
    this.lastScrollY = y;
    this.lastScrollX = x;
    if (!this.isScrollingRef) {
      this.isScrollingRef = true;
      this.scroll.isScrolling = true;
    }
    clearTimeout(this.timeoutRef);
    this.timeoutRef = setTimeout(() => {
      this.isScrollingRef = false;
      this.scroll.isScrolling = false;
    }, 150);
    this.scroll.x = x;
    this.scroll.y = y;
    this.scroll.direction = direction;
    if (this.onScroll) this.onScroll({ x, y, direction });
  }

  attach() {
    if (!this.target) return;
    let lastCall = 0;
    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastCall >= this.throttle) { lastCall = now; this._handleScroll(); }
    };
    this.target.addEventListener('scroll', throttledScroll, { passive: true });
    this._boundThrottled = throttledScroll;
    this._handleScroll();
  }

  detach() {
    if (!this.target) return;
    this.target.removeEventListener('scroll', this._boundThrottled);
    clearTimeout(this.timeoutRef);
  }

  destroy() { this.detach(); this.target = null; }
  get() { return this.scroll; }
  scrollTo(options) { if (this.target === window) window.scrollTo(options); else if (this.target) this.target.scrollTo(options); }
  scrollToTop() { this.scrollTo({ top: 0, behavior: 'smooth' }); }
  scrollToElement(element, options = {}) { if (!element) return; const { block = 'start', behavior = 'smooth' } = options; element.scrollIntoView({ block, behavior }); }
}

export function createScroll(options = {}) {
  return new useScroll(options);
}
