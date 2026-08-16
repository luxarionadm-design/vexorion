import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInterval, createInterval } from '../../../src/core/Interval.js';

describe('useInterval', () => {
  let callback;

  beforeEach(() => {
    vi.useFakeTimers();
    callback = vi.fn();
  });

  it('should start interval', () => {
    const interval = new useInterval(callback, 1000);
    interval.start();
    
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should start immediately when immediate is true', () => {
    const interval = new useInterval(callback, 1000, { immediate: true });
    
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should stop interval', () => {
    const interval = new useInterval(callback, 1000);
    interval.start();
    interval.stop();
    
    vi.advanceTimersByTime(3000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should toggle interval', () => {
    const interval = new useInterval(callback, 1000);
    interval.start();
    interval.toggle();
    
    vi.advanceTimersByTime(3000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should check if running', () => {
    const interval = new useInterval(callback, 1000);
    expect(interval.isRunningState()).toBe(false);
    
    interval.start();
    expect(interval.isRunningState()).toBe(true);
  });

  it('should set delay', () => {
    const interval = new useInterval(callback, 1000);
    interval.start();
    interval.setDelay(500);
    
    vi.advanceTimersByTime(1500);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    const interval = new useInterval(callback, 1000);
    interval.subscribe(subscriber);
    
    interval.start();
    expect(subscriber).toHaveBeenCalledWith(true);
    
    interval.stop();
    expect(subscriber).toHaveBeenCalledWith(false);
  });

  it('should destroy', () => {
    const interval = new useInterval(callback, 1000);
    interval.start();
    interval.destroy();
    
    expect(interval.isRunningState()).toBe(false);
    expect(interval._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const interval = createInterval(callback, 1000);
    expect(interval).toBeInstanceOf(useInterval);
  });
});
