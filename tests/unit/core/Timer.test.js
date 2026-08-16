import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTimer, createTimer } from '../../../src/core/Timer.js';

describe('useTimer', () => {
  let timer;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockReturnValue(0);
    timer = new useTimer({ autoStart: false });
  });

  it('should start timer', () => {
    timer.start();
    expect(timer.isRunningState()).toBe(true);
  });

  it('should auto start', () => {
    const autoTimer = new useTimer({ autoStart: true });
    expect(autoTimer.isRunningState()).toBe(true);
  });

  it('should stop timer', () => {
    timer.start();
    timer.stop();
    expect(timer.isRunningState()).toBe(false);
  });

  it('should reset timer', () => {
    timer.start();
    performance.now.mockReturnValue(5000);
    timer.stop();
    timer.reset();
    expect(timer.getElapsed()).toBe(0);
  });

  it('should restart timer', () => {
    timer.start();
    performance.now.mockReturnValue(5000);
    timer.restart();
    expect(timer.isRunningState()).toBe(true);
  });

  it('should get elapsed time', () => {
    timer.start();
    performance.now.mockReturnValue(5000);
    expect(timer.getElapsed()).toBe(5000);
  });

  it('should get elapsed seconds', () => {
    timer.start();
    performance.now.mockReturnValue(5000);
    expect(timer.getElapsedSeconds()).toBe(5);
  });

  it('should get elapsed minutes', () => {
    timer.start();
    performance.now.mockReturnValue(120000);
    expect(timer.getElapsedMinutes()).toBe(2);
  });

  it('should get elapsed hours', () => {
    timer.start();
    performance.now.mockReturnValue(3600000);
    expect(timer.getElapsedHours()).toBe(1);
  });

  it('should get formatted time', () => {
    timer.start();
    performance.now.mockReturnValue(3661000); // 1 hour, 1 minute, 1 second
    const formatted = timer.getFormatted();
    expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}\.\d{3}/);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    timer.subscribe(subscriber);
    timer.start();
    expect(subscriber).toHaveBeenCalled();
  });

  it('should destroy', () => {
    timer.destroy();
    expect(timer._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createTimer();
    expect(instance).toBeInstanceOf(useTimer);
  });
});
