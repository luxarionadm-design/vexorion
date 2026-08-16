import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSSE, createSSE } from '../../../src/core/SSE.js';

describe('useSSE', () => {
  let sse;

  beforeEach(() => {
    vi.useFakeTimers();
    global.EventSource.instances.length = 0;
    sse = new useSSE('http://test.com/events', { reconnect: true });
  });

  it('should connect', () => {
    sse.connect();
    expect(global.EventSource).toHaveBeenCalledWith('http://test.com/events', { reconnect: true });
  });

  it('should handle open event', () => {
    sse.connect();
    const mockEventSource = global.EventSource.instances[global.EventSource.instances.length - 1];
    mockEventSource.onopen({});
    expect(sse.isConnected).toBe(true);
  });

  it('should handle message event', () => {
    const listener = vi.fn();
    sse.on('message', listener);
    
    sse.connect();
    const mockEventSource = global.EventSource.instances[global.EventSource.instances.length - 1];
    mockEventSource.onmessage({ data: '{"test":"data"}' });
    
    expect(listener).toHaveBeenCalled();
  });

  it('should handle error event', () => {
    sse.connect();
    const mockEventSource = global.EventSource.instances[global.EventSource.instances.length - 1];
    mockEventSource.onerror({});
    expect(sse.isConnected).toBe(false);
  });

  it('should close connection', () => {
    sse.connect();
    const mockEventSource = global.EventSource.instances[global.EventSource.instances.length - 1];
    sse.close();
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  it('should check connection state', () => {
    expect(sse.isConnectedState()).toBe(false);
    sse.connect();
    const mockEventSource = global.EventSource.instances[global.EventSource.instances.length - 1];
    mockEventSource.onopen({});
    expect(sse.isConnectedState()).toBe(true);
  });

  it('should destroy', () => {
    sse.destroy();
    expect(sse.isConnected).toBe(false);
    expect(sse.listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createSSE('http://test.com');
    expect(instance).toBeInstanceOf(useSSE);
  });
});
