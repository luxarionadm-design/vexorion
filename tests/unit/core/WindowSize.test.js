import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWindowSize, createWindowSize } from '../../../src/core/WindowSize.js';

describe('useWindowSize', () => {
  let windowSize;

  beforeEach(() => {
    vi.useFakeTimers();
    windowSize = new useWindowSize({ throttle: 100 });
  });

  it('should initialize with window size', () => {
    expect(windowSize.get()).toHaveProperty('width');
    expect(windowSize.get()).toHaveProperty('height');
  });

  it('should get width', () => {
    expect(windowSize.getWidth()).toBe(window.innerWidth);
  });

  it('should get height', () => {
    expect(windowSize.getHeight()).toBe(window.innerHeight);
  });

  it('should update on resize', () => {
    window.innerWidth = 1024;
    window.innerHeight = 768;
    
    const event = new Event('resize');
    window.dispatchEvent(event);
    
    vi.advanceTimersByTime(150);
    expect(windowSize.getWidth()).toBe(1024);
    expect(windowSize.getHeight()).toBe(768);
  });

  it('should notify subscribers on resize', () => {
    const callback = vi.fn();
    windowSize.subscribe(callback);
    
    window.innerWidth = 1024;
    const event = new Event('resize');
    window.dispatchEvent(event);
    
    vi.advanceTimersByTime(150);
    expect(callback).toHaveBeenCalled();
  });

  it('should detach', () => {
    windowSize.detach();
    
    const event = new Event('resize');
    window.dispatchEvent(event);
    
    const callback = vi.fn();
    windowSize.subscribe(callback);
    vi.advanceTimersByTime(150);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should destroy', () => {
    windowSize.destroy();
    expect(windowSize._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createWindowSize();
    expect(instance).toBeInstanceOf(useWindowSize);
  });
});
