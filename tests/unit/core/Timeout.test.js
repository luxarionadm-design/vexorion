import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimeout, createTimeout } from '../../../src/core/Timeout.js';

describe('useTimeout', () => {
  let callback;

  beforeEach(() => {
    vi.useFakeTimers();
    callback = vi.fn();
  });

  it('should start timeout', () => {
    const timeout = new useTimeout(callback, 1000, { autoStart: false });
    timeout.start();
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should auto start', () => {
    const timeout = new useTimeout(callback, 1000);
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should stop timeout', () => {
    const timeout = new useTimeout(callback, 1000);
    timeout.stop();
    
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should restart timeout', () => {
    const timeout = new useTimeout(callback, 1000);
    timeout.restart();
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should check if running', () => {
    const timeout = new useTimeout(callback, 1000, { autoStart: false });
    expect(timeout.isRunningState()).toBe(false);
    
    timeout.start();
    expect(timeout.isRunningState()).toBe(true);
    
    vi.advanceTimersByTime(1000);
    expect(timeout.isRunningState()).toBe(false);
  });

  it('should set delay', () => {
    const timeout = new useTimeout(callback, 1000, { autoStart: false });
    timeout.setDelay(500);
    timeout.start();
    
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    const timeout = new useTimeout(callback, 1000, { autoStart: false });
    timeout.subscribe(subscriber);
    
    timeout.start();
    expect(subscriber).toHaveBeenCalledWith(true);
    
    vi.advanceTimersByTime(1000);
    expect(subscriber).toHaveBeenCalledWith(false);
  });

  it('should destroy', () => {
    const timeout = new useTimeout(callback, 1000);
    timeout.destroy();
    
    expect(timeout.isRunningState()).toBe(false);
    expect(timeout._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const timeout = createTimeout(callback, 1000);
    expect(timeout).toBeInstanceOf(useTimeout);
  });
});
