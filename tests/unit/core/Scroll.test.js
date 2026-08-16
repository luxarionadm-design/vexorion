import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScroll, createScroll } from '../../../src/core/Scroll.js';

describe('useScroll', () => {
  let scroll;

  beforeEach(() => {
    vi.useFakeTimers();
    scroll = new useScroll({ throttle: 100 });
  });

  it('should track scroll position', () => {
    window.scrollX = 100;
    window.scrollY = 200;
    
    const event = new Event('scroll');
    window.dispatchEvent(event);
    
    vi.advanceTimersByTime(150);
    expect(scroll.get().x).toBe(100);
    expect(scroll.get().y).toBe(200);
  });

  it('should detect scroll direction', () => {
    window.scrollY = 100;
    const event1 = new Event('scroll');
    window.dispatchEvent(event1);
    vi.advanceTimersByTime(150);
    expect(scroll.get().direction).toBe('down');

    window.scrollY = 50;
    const event2 = new Event('scroll');
    window.dispatchEvent(event2);
    vi.advanceTimersByTime(150);
    expect(scroll.get().direction).toBe('up');
  });

  it('should call onScroll callback', () => {
    const onScroll = vi.fn();
    const scrollWithCallback = new useScroll({ onScroll, throttle: 100 });
    
    window.scrollY = 100;
    const event = new Event('scroll');
    window.dispatchEvent(event);
    
    vi.advanceTimersByTime(150);
    expect(onScroll).toHaveBeenCalled();
  });

  it('should scroll to top', () => {
    const spy = vi.spyOn(window, 'scrollTo');
    scroll.scrollToTop();
    expect(spy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should scroll to element', () => {
    const element = document.createElement('div');
    const spy = vi.spyOn(element, 'scrollIntoView');
    scroll.scrollToElement(element);
    expect(spy).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
  });

  it('should detach', () => {
    scroll.detach();
    
    const event = new Event('scroll');
    window.dispatchEvent(event);
    expect(scroll.get().x).toBe(0);
  });

  it('should destroy', () => {
    scroll.destroy();
    expect(scroll.target).toBeNull();
  });

  it('should create with helper', () => {
    const instance = createScroll();
    expect(instance).toBeInstanceOf(useScroll);
  });
});
