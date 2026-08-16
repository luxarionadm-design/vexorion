import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocalStorage, useSessionStorage } from '../../../src/core/Storage.js';

describe('useLocalStorage', () => {
  let storage;

  beforeEach(() => {
    localStorage.clear();
    storage = new useLocalStorage({ prefix: 'test' });
  });

  it('should set and get value', () => {
    storage.set('key', 'value');
    expect(storage.get('key')).toBe('value');
  });

  it('should get default value if key not found', () => {
    expect(storage.get('nonexistent', 'default')).toBe('default');
  });

  it('should remove value', () => {
    storage.set('key', 'value');
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });

  it('should clear all values', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.clear();
    expect(storage.keys()).toHaveLength(0);
  });

  it('should get all keys', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    expect(storage.keys()).toEqual(['key1', 'key2']);
  });

  it('should get all values', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    expect(storage.getAll()).toEqual({ key1: 'value1', key2: 'value2' });
  });

  it('should handle expiry', () => {
    storage.set('temp', 'value', 100);
    expect(storage.get('temp')).toBe('value');
    vi.advanceTimersByTime(150);
    expect(storage.get('temp')).toBeNull();
  });

  it('should notify subscribers', () => {
    const callback = vi.fn();
    storage.subscribe('key', callback);
    storage.set('key', 'new value');
    expect(callback).toHaveBeenCalledWith('new value');
  });

  it('should unsubscribe', () => {
    const callback = vi.fn();
    const unsubscribe = storage.subscribe('key', callback);
    unsubscribe();
    storage.set('key', 'value');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle complex objects', () => {
    const obj = { name: 'John', age: 30, nested: { prop: 'value' } };
    storage.set('obj', obj);
    expect(storage.get('obj')).toEqual(obj);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3, 'test'];
    storage.set('arr', arr);
    expect(storage.get('arr')).toEqual(arr);
  });

  it('should handle storage errors', () => {
    const mockStorage = {
      setItem: vi.fn(() => { throw new Error('Error'); })
    };
    const errorStorage = new useLocalStorage({ storage: mockStorage });
    expect(errorStorage.set('key', 'value')).toBe(false);
  });

  it('should check availability', () => {
    expect(storage.isAvailable()).toBe(true);
  });

  it('should use prefix', () => {
    const prefixed = new useLocalStorage({ prefix: 'app' });
    prefixed.set('key', 'value');
    expect(localStorage.getItem('app_key')).toBe(JSON.stringify({ value: 'value', expiry: null }));
  });
});

describe('useSessionStorage', () => {
  it('should use sessionStorage', () => {
    const session = new useSessionStorage({ prefix: 'session' });
    expect(session.storage).toBe(sessionStorage);
  });
});
