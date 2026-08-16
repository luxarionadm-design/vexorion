import { describe, it, expect } from 'vitest';
import VexorionUUID from '../../src/core/VexorionUUID.js';
import { NAMESPACES } from '../../src/constants/Namespaces.js';

describe('Integration Tests', () => {
  it('should generate all UUID versions', () => {
    const versions = ['v1', 'v4', 'v6', 'v7'];
    versions.forEach(version => {
      const uuid = VexorionUUID.generate({ version });
      expect(VexorionUUID.isUUID(uuid)).toBe(true);
      const info = VexorionUUID.getInfo(uuid);
      expect(info.isValid).toBe(true);
    });
  });

  it('should work with namespaces', () => {
    const uuid = VexorionUUID.generateV5(NAMESPACES.DNS, 'example.com');
    expect(VexorionUUID.isUUID(uuid)).toBe(true);
    expect(VexorionUUID.getVersion(uuid)).toBe(5);
  });

  it('should handle custom generator registration', () => {
    class CustomGen {
      generate() { return 'custom-uuid'; }
      getVersion() { return 'custom'; }
      getName() { return 'CustomGen'; }
    }
    
    VexorionUUID.registerGenerator('custom', CustomGen);
    const uuid = VexorionUUID.generate({ version: 'custom' });
    expect(uuid).toBe('custom-uuid');
  });
});
