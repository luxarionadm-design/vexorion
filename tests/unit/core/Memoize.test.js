import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMemoize, createMemoize } from '../../../src/core/Memoize.js';

describe('useMemoize', () => {
  let memoizer;

  beforeEach(() => {
    memoizer = new useMemoize({ maxSize: 3, ttl: 1000 });
  });

  it('should memoize function results', () => {
    const fn = vi.fn((x) => x * 2);
    const memoized = memoizer.memoize(fn);

    expect(memoized(2)).toBe(4);
    expect(memoized(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cache different arguments', () => {
    const fn = vi.fn((x) => x * 2);
    const memoized = memoizer.memoize(fn);

    memoized(2);
    memoized(3);
    memoized(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should respect maxSize', () => {
    const fn = vi.fn((x) => x);
    const memoized = memoizer.memoize(fn);

    memoized(1);
    memoized(2);
    memoized(3);
    memoized(4);
    expect(memoizer.getStats().size).toBe(3);
  });

  it('should respect TTL', () => {
    const fn = vi.fn((x) => x);
    const memoized = memoizer.memoize(fn);

    memoized(1);
    vi.advanceTimersByTime(1500);
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should clear cache', () => {
    const fn = vi.fn((x) => x);
    const memoized = memoizer.memoize(fn);

    memoized(1);
    memoizer.clear();
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should remove specific cache', () => {
    const fn = vi.fn((x) => x);
    const memoized = memoizer.memoize(fn);

    memoized(1);
    memoizer.remove(1);
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should check if key exists', () => {
    const fn = vi.fn((x) => x);
    const memoized = memoizer.memoize(fn);

    memoized(1);
    expect(memoizer.has(1)).toBe(true);
    expect(memoizer.has(2)).toBe(false);
  });

  it('should get cached value', () => {
    const fn = vi.fn((x) => x * 2);
    const memoized = memoizer.memoize(fn);

    memoized(5);
    expect(memoizer.get(5)).toBe(10);
  });

  it('should get stats', () => {
    const fn = vi.fn((x) => x);
    const memoized = memoizer.memoize(fn);

    memoized(1);
    memoized(2);
    const stats = memoizer.getStats();
    expect(stats.size).toBe(2);
    expect(stats.maxSize).toBe(3);
    expect(stats.keys).toHaveLength(2);
  });

  it('should create memoized with helper', () => {
    const fn = vi.fn((x) => x);
    const memoized = createMemoize(fn, { maxSize: 5 });
    memoized(1);
    memoized(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
