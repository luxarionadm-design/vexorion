import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHash, createHash } from '../../../src/core/Hash.js';

describe('useHash', () => {
  let hash;

  beforeEach(() => {
    hash = new useHash();
    crypto.subtle.digest = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]).buffer);
  });

  it('should generate SHA-256 hash', async () => {
    const result = await hash.sha256('test');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should generate SHA-384 hash', async () => {
    const result = await hash.sha384('test');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should generate SHA-512 hash', async () => {
    const result = await hash.sha512('test');
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('should encode base64', () => {
    const result = hash.base64('test');
    expect(result).toBe('dGVzdA==');
  });

  it('should decode base64', () => {
    const result = hash.base64Decode('dGVzdA==');
    expect(result).toBe('test');
  });

  it('should generate URL safe base64', () => {
    const result = hash.urlSafeBase64('test');
    expect(result).toBeDefined();
    expect(result).not.toContain('+');
    expect(result).not.toContain('/');
  });

  it('should create with helper', () => {
    const instance = createHash();
    expect(instance).toBeInstanceOf(useHash);
  });
});
