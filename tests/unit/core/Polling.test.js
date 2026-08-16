import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePolling, createPolling } from '../../../src/core/Polling.js';

describe('usePolling', () => {
  let fn;

  beforeEach(() => {
    vi.useFakeTimers();
    fn = vi.fn().mockResolvedValue('data');
  });

  it('should start polling', () => {
    const poll = new usePolling(fn, 1000);
    poll.start();
    
    vi.advanceTimersByTime(3000);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should start immediately when immediate is true', () => {
    const poll = new usePolling(fn, 1000, { immediate: true });
    
    vi.advanceTimersByTime(3000);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should stop polling', () => {
    const poll = new usePolling(fn, 1000);
    poll.start();
    poll.stop();
    
    vi.advanceTimersByTime(3000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should respect maxAttempts', () => {
    const poll = new usePolling(fn, 1000, { maxAttempts: 3 });
    poll.start();
    
    vi.advanceTimersByTime(4000);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should handle errors', async () => {
    const errorFn = vi.fn().mockRejectedValue(new Error('Polling error'));
    const poll = new usePolling(errorFn, 1000);
    poll.start();
    
    vi.advanceTimersByTime(1000);
    expect(poll.getError()).toBeInstanceOf(Error);
  });

  it('should get data', () => {
    const poll = new usePolling(fn, 1000);
    poll.start();
    
    vi.advanceTimersByTime(1000);
    expect(poll.getData()).toBe('data');
  });

  it('should set interval', () => {
    const poll = new usePolling(fn, 1000);
    poll.start();
    poll.setInterval(500);
    
    vi.advanceTimersByTime(1500);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should check if running', () => {
    const poll = new usePolling(fn, 1000);
    expect(poll.isRunningState()).toBe(false);
    poll.start();
    expect(poll.isRunningState()).toBe(true);
  });

  it('should restart', () => {
    const poll = new usePolling(fn, 1000);
    poll.start();
    vi.advanceTimersByTime(1000);
    poll.restart();
    
    vi.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    const poll = new usePolling(fn, 1000);
    poll.subscribe(subscriber);
    poll.start();
    
    vi.advanceTimersByTime(1000);
    expect(subscriber).toHaveBeenCalled();
  });

  it('should destroy', () => {
    const poll = new usePolling(fn, 1000);
    poll.destroy();
    expect(poll._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const poll = createPolling(fn, 1000);
    expect(poll).toBeInstanceOf(usePolling);
  });
});
