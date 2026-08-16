import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfiler, createProfiler } from '../../../src/core/Profiler.js';

describe('useProfiler', () => {
  let profiler;

  beforeEach(() => {
    profiler = new useProfiler({ name: 'TestProfiler', enabled: true });
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  it('should mark', () => {
    profiler.mark('start');
    expect(profiler.getMark('start')).toBe(1000);
  });

  it('should measure', () => {
    profiler.mark('start');
    performance.now.mockReturnValue(2000);
    profiler.mark('end');
    
    const duration = profiler.measure('test', 'start', 'end');
    expect(duration).toBe(1000);
  });

  it('should start and end', () => {
    profiler.start('test');
    performance.now.mockReturnValue(2000);
    const duration = profiler.end('test');
    expect(duration).toBe(1000);
  });

  it('should profile async function', async () => {
    const fn = vi.fn().mockResolvedValue('result');
    profiler.start('test');
    performance.now.mockReturnValue(2000);
    const result = await profiler.profile('test', fn);
    expect(result).toBe('result');
  });

  it('should get measure', () => {
    profiler.mark('start');
    performance.now.mockReturnValue(2000);
    profiler.mark('end');
    profiler.measure('test', 'start', 'end');
    
    const measure = profiler.getMeasure('test');
    expect(measure).toBeDefined();
    expect(measure.duration).toBe(1000);
  });

  it('should get all measures', () => {
    profiler.mark('start');
    performance.now.mockReturnValue(2000);
    profiler.mark('end');
    profiler.measure('test1', 'start', 'end');
    
    const measures = profiler.getAllMeasures();
    expect(measures).toHaveProperty('test1');
  });

  it('should clear marks', () => {
    profiler.mark('test');
    profiler.clearMarks();
    expect(profiler.getMark('test')).toBeNull();
  });

  it('should clear measures', () => {
    profiler.mark('start');
    performance.now.mockReturnValue(2000);
    profiler.mark('end');
    profiler.measure('test', 'start', 'end');
    profiler.clearMeasures();
    expect(profiler.getMeasure('test')).toBeNull();
  });

  it('should clear all', () => {
    profiler.mark('test');
    profiler.mark('start');
    performance.now.mockReturnValue(2000);
    profiler.mark('end');
    profiler.measure('test', 'start', 'end');
    profiler.clearAll();
    expect(profiler.getMark('test')).toBeNull();
    expect(profiler.getMeasure('test')).toBeNull();
  });

  it('should set enabled', () => {
    profiler.setEnabled(false);
    profiler.mark('test');
    expect(profiler.getMark('test')).toBeUndefined();
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    profiler.subscribe(subscriber);
    profiler.mark('test');
    expect(subscriber).toHaveBeenCalled();
  });

  it('should create with helper', () => {
    const instance = createProfiler();
    expect(instance).toBeInstanceOf(useProfiler);
  });
});
