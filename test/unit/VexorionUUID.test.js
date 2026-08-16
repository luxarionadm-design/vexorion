import { describe, it, expect, beforeEach, vi } from 'vitest';
import VexorionUUID from '../../src/core/VexorionUUID.js';

describe('VexorionUUID', () => {
  beforeEach(() => {
    VexorionUUID.reset();
  });

  describe('Generation', () => {
    it('should generate v4 UUID', () => {
      const uuid = VexorionUUID.generate();
      expect(uuid).toBeTypeOf('string');
      expect(uuid.length).toBe(36);
      expect(VexorionUUID.isUUID(uuid)).toBe(true);
    });

    it('should generate v7 UUID', () => {
      const uuid = VexorionUUID.generateV7();
      expect(VexorionUUID.getVersion(uuid)).toBe(7);
      expect(VexorionUUID.isUUID(uuid)).toBe(true);
    });

    it('should generate branded UUID', () => {
      VexorionUUID.configure({ branding: true, prefix: 'test-' });
      const uuid = VexorionUUID.generate();
      expect(uuid.startsWith('test-')).toBe(true);
    });

    it('should generate batch of UUIDs', () => {
      const batch = VexorionUUID.generateBatch(5);
      expect(batch).toHaveLength(5);
      batch.forEach(uuid => {
        expect(VexorionUUID.isUUID(uuid)).toBe(true);
      });
    });
  });

  describe('Validation', () => {
    it('should validate correct UUID', () => {
      const uuid = VexorionUUID.generate();
      expect(VexorionUUID.isUUID(uuid)).toBe(true);
    });

    it('should invalidate wrong UUID', () => {
      expect(VexorionUUID.isUUID('invalid')).toBe(false);
      expect(VexorionUUID.isUUID('123')).toBe(false);
    });

    it('should get detailed validation info', () => {
      const uuid = VexorionUUID.generate();
      const info = VexorionUUID.validateDetailed(uuid);
      expect(info.valid).toBe(true);
      expect(info.version).toBe(4);
      expect(info.variant).toBe('RFC4122');
    });
  });

  describe('Formatting', () => {
    it('should compact UUID', () => {
      const uuid = VexorionUUID.generate();
      const compact = VexorionUUID.compact(uuid);
      expect(compact).toHaveLength(32);
      expect(compact.includes('-')).toBe(false);
    });

    it('should expand compact UUID', () => {
      const uuid = VexorionUUID.generate();
      const compact = VexorionUUID.compact(uuid);
      const expanded = VexorionUUID.expand(compact);
      expect(expanded).toBe(uuid);
    });
  });

  describe('Conversion', () => {
    it('should convert to and from bytes', () => {
      const uuid = VexorionUUID.generate();
      const bytes = VexorionUUID.toBytes(uuid);
      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes).toHaveLength(16);
      const restored = VexorionUUID.fromBytes(bytes);
      expect(restored).toBe(uuid);
    });

    it('should convert to and from Base64', () => {
      const uuid = VexorionUUID.generate();
      const base64 = VexorionUUID.toBase64(uuid);
      expect(base64).toBeTypeOf('string');
      const restored = VexorionUUID.fromBase64(base64);
      expect(restored).toBe(uuid);
    });
  });

  describe('Configuration', () => {
    it('should configure default version', () => {
      VexorionUUID.configure({ defaultVersion: 'v7' });
      const uuid = VexorionUUID.generate();
      expect(VexorionUUID.getVersion(uuid)).toBe(7);
    });

    it('should reset configuration', () => {
      VexorionUUID.configure({ defaultVersion: 'v7' });
      VexorionUUID.reset();
      const uuid = VexorionUUID.generate();
      expect(VexorionUUID.getVersion(uuid)).toBe(4);
    });
  });
});
