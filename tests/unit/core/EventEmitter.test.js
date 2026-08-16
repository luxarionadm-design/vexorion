import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEventEmitter, createEventEmitter } from '../../../src/core/EventEmitter.js';

describe('useEventEmitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new useEventEmitter();
  });

  it('should register and emit event', () => {
    const listener = vi.fn();
    emitter.on('test', listener);
    emitter.emit('test', 'data');
    expect(listener).toHaveBeenCalledWith('data');
  });

  it('should unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = emitter.on('test', listener);
    unsubscribe();
    emitter.emit('test');
    expect(listener).not.toHaveBeenCalled();
  });

  it('should trigger once', () => {
    const listener = vi.fn();
    emitter.once('test', listener);
    emitter.emit('test');
    emitter.emit('test');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should remove specific listener', () => {
    const listener = vi.fn();
    emitter.on('test', listener);
    emitter.off('test', listener);
    emitter.emit('test');
    expect(listener).not.toHaveBeenCalled();
  });

  it('should remove all listeners', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on('test', listener1);
    emitter.on('test', listener2);
    emitter.removeAllListeners();
    emitter.emit('test');
    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).not.toHaveBeenCalled();
  });

  it('should remove all listeners for specific event', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on('test', listener1);
    emitter.on('other', listener2);
    emitter.removeAllListeners('test');
    emitter.emit('test');
    emitter.emit('other');
    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
  });

  it('should count listeners', () => {
    expect(emitter.listenerCount('test')).toBe(0);
    emitter.on('test', () => {});
    emitter.on('test', () => {});
    expect(emitter.listenerCount('test')).toBe(2);
  });

  it('should get event names', () => {
    emitter.on('event1', () => {});
    emitter.on('event2', () => {});
    expect(emitter.eventNames()).toEqual(['event1', 'event2']);
  });

  it('should emit async', async () => {
    const listener = vi.fn().mockResolvedValue('result');
    emitter.on('test', listener);
    const results = await emitter.emitAsync('test');
    expect(results).toEqual(['result']);
  });

  it('should warn on max listeners', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    emitter.setMaxListeners(1);
    emitter.on('test', () => {});
    emitter.on('test', () => {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should handle error in listener', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const listener = vi.fn(() => { throw new Error('Listener error'); });
    emitter.on('test', listener);
    emitter.emit('test');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should create with helper', () => {
    const instance = createEventEmitter();
    expect(instance).toBeInstanceOf(useEventEmitter);
  });
});
