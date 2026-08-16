import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCountdown, createCountdown } from '../../../src/core/Countdown.js';

describe('useCountdown', () => {
  let countdown;

  beforeEach(() => {
    vi.useFakeTimers();
    countdown = new useCountdown(5);
  });

  it('should initialize with seconds', () => {
    expect(countdown.get()).toBe(5);
  });

  it('should start countdown', () => {
    countdown.start();
    
    vi.advanceTimersByTime(3000);
    expect(countdown.get()).toBe(2);
  });

  it('should call onTick', () => {
    const onTick = vi.fn();
    const countdownWithTick = new useCountdown(5, { onTick });
    
    countdownWithTick.start();
    vi.advanceTimersByTime(3000);
    expect(onTick).toHaveBeenCalledTimes(3);
  });

  it('should call onComplete', () => {
    const onComplete = vi.fn();
    const countdownWithComplete = new useCountdown(2, { onComplete });
    
    countdownWithComplete.start();
    vi.advanceTimersByTime(2000);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should stop countdown', () => {
    countdown.start();
    countdown.stop();
    
    vi.advanceTimersByTime(3000);
    expect(countdown.get()).toBe(5);
  });

  it('should reset countdown', () => {
    countdown.start();
    vi.advanceTimersByTime(2000);
    countdown.reset();
    expect(countdown.get()).toBe(5);
  });

  it('should restart countdown', () => {
    countdown.restart();
    vi.advanceTimersByTime(2000);
    expect(countdown.get()).toBe(3);
  });

  it('should check if running', () => {
    expect(countdown.isRunningState()).toBe(false);
    countdown.start();
    expect(countdown.isRunningState()).toBe(true);
  });

  it('should check if complete', () => {
    const countdownShort = new useCountdown(1);
    expect(countdownShort.isCompleteState()).toBe(false);
    
    countdownShort.start();
    vi.advanceTimersByTime(1000);
    expect(countdownShort.isCompleteState()).toBe(true);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    countdown.subscribe(subscriber);
    
    countdown.start();
    vi.advanceTimersByTime(1000);
    expect(subscriber).toHaveBeenCalled();
  });

  it('should destroy', () => {
    countdown.destroy();
    expect(countdown._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createCountdown(5);
    expect(instance).toBeInstanceOf(useCountdown);
  });
});
