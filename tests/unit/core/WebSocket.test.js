import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWebSocket, createWebSocket } from '../../../src/core/WebSocket.js';

describe('useWebSocket', () => {
  let ws;

  beforeEach(() => {
    vi.useFakeTimers();
    global.WebSocket.instances.length = 0;
    ws = new useWebSocket('ws://test.com', {
      reconnect: true,
      reconnectInterval: 1000,
      maxReconnectAttempts: 3,
      heartbeatInterval: 5000
    });
  });

  it('should connect', () => {
    ws.connect();
    expect(global.WebSocket).toHaveBeenCalledWith('ws://test.com', []);
  });

  it('should handle open event', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.onopen({});
    expect(ws.isConnected).toBe(true);
  });

  it('should handle message event', () => {
    const listener = vi.fn();
    ws.on('message', listener);
    
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.onmessage({ data: 'test' });
    
    expect(listener).toHaveBeenCalled();
  });

  it('should handle close event', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.readyState = 3;
    mockWs.onclose({});
    expect(ws.isConnected).toBe(false);
  });

  it('should send data', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.readyState = 1;
    mockWs.onopen({});
    ws.send('test');
    expect(mockWs.send).toHaveBeenCalledWith('test');
  });

  it('should send JSON data', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.readyState = 1;
    mockWs.onopen({});
    ws.send({ test: 'data' });
    expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify({ test: 'data' }));
  });

  it('should close connection', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    ws.close();
    expect(mockWs.close).toHaveBeenCalled();
  });

  it('should reconnect on close', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.readyState = 3;
    mockWs.onclose({});
    
    vi.advanceTimersByTime(1000);
    expect(global.WebSocket.instances.length).toBe(2);
  });

  it('should stop reconnecting after max attempts', () => {
    ws.connect();
    
    for (let i = 0; i < 4; i++) {
      const currentMock = global.WebSocket.instances[global.WebSocket.instances.length - 1];
      if (currentMock) {
        currentMock.readyState = 3;
        if (currentMock.onclose) {
          currentMock.onclose({});
        }
      }
      vi.advanceTimersByTime(1000);
    }
    
    expect(global.WebSocket.instances.length).toBe(4);
  });

  it('should check connection state', () => {
    expect(ws.isConnectedState()).toBe(false);
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.onopen({});
    expect(ws.isConnectedState()).toBe(true);
  });

  it('should get ready state', () => {
    ws.connect();
    const mockWs = global.WebSocket.instances[global.WebSocket.instances.length - 1];
    mockWs.readyState = 1;
    expect(ws.getReadyState()).toBe(1);
  });

  it('should destroy', () => {
    ws.destroy();
    expect(ws.isConnected).toBe(false);
    expect(ws.listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createWebSocket('ws://test.com');
    expect(instance).toBeInstanceOf(useWebSocket);
  });
});
