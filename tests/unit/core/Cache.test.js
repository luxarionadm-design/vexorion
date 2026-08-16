import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCache, createCache } from '../../../src/core/Cache.js';

describe('useCache', () => {
  let cache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new useCache({ maxSize: 3, ttl: 1000 });
  });

  it('should set and get value', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('should return undefined for non-existent key', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('should delete value', () => {
    cache.set('key', 'value');
    cache.delete('key');
    expect(cache.get('key')).toBeUndefined();
  });

  it('should clear cache', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.size()).toBe(0);
  });

  it('should check if key exists', () => {
    cache.set('key', 'value');
    expect(cache.has('key')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });

  it('should respect maxSize', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    cache.set('key4', 'value4');
    
    expect(cache.size()).toBe(3);
    expect(cache.get('key1')).toBeUndefined();
  });

  it('should respect TTL', () => {
    cache.set('key', 'value');
    vi.advanceTimersByTime(1500);
    expect(cache.get('key')).toBeUndefined();
  });

  it('should get all values', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    const all = cache.getAll();
    expect(all).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should get keys', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    expect(cache.keys()).toEqual(['key1', 'key2']);
  });

  it('should get stats', () => {
    cache.set('key', 'value');
    const stats = cache.getStats();
    expect(stats.size).toBe(1);
    expect(stats.maxSize).toBe(3);
    expect(stats.ttl).toBe(1000);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    cache.subscribe(subscriber);
    cache.set('key', 'value');
    expect(subscriber).toHaveBeenCalledWith('key', 'value');
  });

  it('should create with helper', () => {
    const instance = createCache();
    expect(instance).toBeInstanceOf(useCache);
  });
});
