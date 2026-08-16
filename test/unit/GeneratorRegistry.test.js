import { describe, it, expect, beforeEach } from 'vitest';
import GeneratorRegistry from '../../src/core/GeneratorRegistry.js';
import RandomGenerator from '../../src/generators/RandomGenerator.js';

describe('GeneratorRegistry', () => {
  let registry;

  beforeEach(() => {
    registry = new GeneratorRegistry();
  });

  it('should register and get generator', () => {
    registry.register('test', RandomGenerator);
    const generator = registry.get('test');
    expect(generator).toBeInstanceOf(RandomGenerator);
  });

  it('should support aliases', () => {
    registry.register('test', RandomGenerator, { aliases: ['t', 'rand'] });
    expect(registry.get('t')).toBeInstanceOf(RandomGenerator);
    expect(registry.get('rand')).toBeInstanceOf(RandomGenerator);
  });

  it('should set default generator', () => {
    registry.register('test', RandomGenerator, { default: true });
    expect(registry.getDefault()).toBeInstanceOf(RandomGenerator);
  });

  it('should list registered generators', () => {
    registry.register('test1', RandomGenerator);
    registry.register('test2', RandomGenerator);
    expect(registry.list()).toContain('test1');
    expect(registry.list()).toContain('test2');
  });

  it('should throw error for unknown generator', () => {
    expect(() => registry.get('unknown')).toThrow('Generator "unknown" not found');
  });
});
