import { describe, it, expect, beforeEach } from 'vitest';
import { useCookie } from '../../../src/core/Cookie.js';

describe('useCookie', () => {
  let cookie;

  beforeEach(() => {
    document.cookie = '';
    cookie = new useCookie({ path: '/', secure: false, sameSite: 'lax' });
  });

  it('should set and get cookie', () => {
    cookie.set('test', 'value');
    expect(cookie.get('test')).toBe('value');
  });

  it('should set with options', () => {
    cookie.set('test', 'value', { days: 1, path: '/custom' });
    expect(cookie.get('test')).toBe('value');
  });

  it('should get all cookies', () => {
    cookie.set('key1', 'value1');
    cookie.set('key2', 'value2');
    const all = cookie.getAll();
    expect(all.key1).toBe('value1');
    expect(all.key2).toBe('value2');
  });

  it('should remove cookie', () => {
    cookie.set('test', 'value');
    cookie.remove('test');
    expect(cookie.get('test')).toBeNull();
  });

  it('should check if cookie exists', () => {
    cookie.set('test', 'value');
    expect(cookie.has('test')).toBe(true);
    expect(cookie.has('nonexistent')).toBe(false);
  });

  it('should clear all cookies', () => {
    cookie.set('key1', 'value1');
    cookie.set('key2', 'value2');
    cookie.clear();
    expect(cookie.get('key1')).toBeNull();
    expect(cookie.get('key2')).toBeNull();
  });

  it('should handle special characters', () => {
    cookie.set('key with space', 'value with space');
    expect(cookie.get('key with space')).toBe('value with space');
  });
});
