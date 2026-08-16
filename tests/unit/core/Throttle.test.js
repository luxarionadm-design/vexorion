import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useThrottle, createThrottle } from '../../../src/core/Throttle.js';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttler = new useThrottle({ interval: 500 });
    const throttled = throttler.throttle(fn);

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const fn = vi.fn();
    const throttler = new useThrottle({ interval: 500 });
    const throttled = throttler.throttle(fn);

    throttled('test', 123);
    expect(fn).toHaveBeenCalledWith('test', 123);
  });

  it('should call on trailing edge', () => {
    const fn = vi.fn();
    const throttler = new useThrottle({ interval: 500, trailing: true });
    const throttled = throttler.throttle(fn);

    throttled();
    vi.advanceTimersByTime(600);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not call on trailing when disabled', () => {
    const fn = vi.fn();
    const throttler = new useThrottle({ interval: 500, trailing: false });
    const throttled = throttler.throttle(fn);

    throttled();
    vi.advanceTimersByTime(600);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const fn = vi.fn();
    const throttler = new useThrottle({ interval: 500, trailing: true });
    const throttled = throttler.throttle(fn);

    throttled();
    throttler.cancel();
    vi.advanceTimersByTime(600);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should flush pending execution', () => {
    const fn = vi.fn();
    const throttler = new useThrottle({ interval: 500, trailing: true });
    const throttled = throttler.throttle(fn);

    throttled();
    throttler.flush(fn);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should create throttled function with helper', () => {
    const fn = vi.fn();
    const throttled = createThrottle(fn, 300);
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
