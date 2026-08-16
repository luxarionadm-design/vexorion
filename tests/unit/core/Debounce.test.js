import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDebounce, createDebounce } from '../../../src/core/Debounce.js';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500 });
    const debounced = debouncer.debounce(fn);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments correctly', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500 });
    const debounced = debouncer.debounce(fn);

    debounced('test', 123);
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledWith('test', 123);
  });

  it('should preserve context', () => {
    const obj = {
      value: 'test',
      fn: vi.fn(function() { return this.value; })
    };
    const debouncer = new useDebounce({ delay: 500 });
    const debounced = debouncer.debounce(obj.fn.bind(obj));

    debounced();
    vi.advanceTimersByTime(500);
    expect(obj.fn).toHaveReturnedWith('test');
  });

  it('should call on leading edge', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500, leading: true });
    const debounced = debouncer.debounce(fn);

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call on leading and trailing', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500, leading: true });
    const debounced = debouncer.debounce(fn);

    debounced();
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use maxWait', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500, maxWait: 1000, trailing: true });
    const debounced = debouncer.debounce(fn);

    debounced();
    vi.advanceTimersByTime(600);
    debounced();
    vi.advanceTimersByTime(600);
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(400);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should cancel pending execution', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500 });
    const debounced = debouncer.debounce(fn);

    debounced();
    debouncer.cancel();
    vi.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should flush pending execution', () => {
    const fn = vi.fn();
    const debouncer = new useDebounce({ delay: 500 });
    const debounced = debouncer.debounce(fn);

    debounced();
    debouncer.flush(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should create debounced function with helper', () => {
    const fn = vi.fn();
    const debounced = createDebounce(fn, 300);
    debounced();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalled();
  });
});
