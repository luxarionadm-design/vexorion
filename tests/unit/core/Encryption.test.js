import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEncryption, createEncryption } from '../../../src/core/Encryption.js';

describe('useEncryption', () => {
  let encryption;

  beforeEach(() => {
    encryption = new useEncryption({ secret: 'test-secret' });
    
    // Mock crypto.subtle
    const mockKey = {};
    crypto.subtle.importKey = vi.fn().mockResolvedValue(mockKey);
    crypto.subtle.deriveKey = vi.fn().mockResolvedValue(mockKey);
    crypto.subtle.encrypt = vi.fn().mockResolvedValue(new ArrayBuffer(32));
    crypto.subtle.decrypt = vi.fn().mockResolvedValue(new TextEncoder().encode('test').buffer);
    crypto.subtle.digest = vi.fn().mockResolvedValue(new ArrayBuffer(32));
  });

  it('should encrypt text', async () => {
    const encrypted = await encryption.encrypt('test');
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');
  });

  it('should decrypt text', async () => {
    const encrypted = await encryption.encrypt('test');
    const decrypted = await encryption.decrypt(encrypted);
    expect(decrypted).toBe('test');
  });

  it('should return null on encryption error', async () => {
    crypto.subtle.encrypt.mockRejectedValue(new Error('Encryption error'));
    const result = await encryption.encrypt('test');
    expect(result).toBeNull();
  });

  it('should return null on decryption error', async () => {
    crypto.subtle.decrypt.mockRejectedValue(new Error('Decryption error'));
    const result = await encryption.decrypt('invalid');
    expect(result).toBeNull();
  });

  it('should generate hash', async () => {
    const hash = await encryption.hash('test');
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
  });

  it('should generate token', () => {
    const token = encryption.generateToken(16);
    expect(token).toBeDefined();
    expect(token.length).toBe(32);
  });

  it('should generate UUID', () => {
    const uuid = encryption.generateUUID();
    expect(uuid).toBeDefined();
    expect(uuid).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/);
  });

  it('should create with helper', () => {
    const instance = createEncryption();
    expect(instance).toBeInstanceOf(useEncryption);
  });
});
