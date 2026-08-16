import { vi } from 'vitest';

// Global fetch mock
global.fetch = vi.fn();
window.fetch = global.fetch;

// Mock WebSocket
export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  constructor(url, protocols = []) {
    this.url = url;
    this.protocols = protocols;
    this.readyState = 0;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.send = vi.fn();
    this.close = vi.fn((code, reason) => {
      this.readyState = 3;
      if (typeof this.onclose === 'function') this.onclose({ code, reason });
    });
  }
}

MockWebSocket.prototype.CONNECTING = 0;
MockWebSocket.prototype.OPEN = 1;
MockWebSocket.prototype.CLOSING = 2;
MockWebSocket.prototype.CLOSED = 3;

const mockInstances = [];
const mockWebSocketFn = vi.fn(function (url, protocols) {
  const instance = new MockWebSocket(url, protocols);
  mockInstances.push(instance);
  return instance;
});
mockWebSocketFn.CONNECTING = 0;
mockWebSocketFn.OPEN = 1;
mockWebSocketFn.CLOSING = 2;
mockWebSocketFn.CLOSED = 3;
mockWebSocketFn.instances = mockInstances;

global.WebSocket = mockWebSocketFn;
window.WebSocket = mockWebSocketFn;

// Mock EventSource
export class MockEventSource {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.readyState = 0;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.close = vi.fn(() => {
      this.readyState = 2;
    });
  }
}
const mockEsInstances = [];
const mockEventSourceFn = vi.fn(function (url, options) {
  const instance = new MockEventSource(url, options);
  mockEsInstances.push(instance);
  return instance;
});
mockEventSourceFn.CONNECTING = 0;
mockEventSourceFn.OPEN = 1;
mockEventSourceFn.CLOSED = 2;
mockEventSourceFn.instances = mockEsInstances;

global.EventSource = mockEventSourceFn;
window.EventSource = mockEventSourceFn;

// Mock Geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
  configurable: true,
});
Object.defineProperty(window.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
  configurable: true,
});

// Mock Crypto subtle
const subtleMock = {
  importKey: vi.fn().mockResolvedValue({}),
  deriveKey: vi.fn().mockResolvedValue({}),
  encrypt: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
  decrypt: vi.fn().mockResolvedValue(new TextEncoder().encode('test').buffer),
  digest: vi.fn().mockResolvedValue(new Uint8Array(32).buffer),
  sign: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
};

if (!global.crypto) {
  global.crypto = {};
}
try {
  Object.defineProperty(global.crypto, 'subtle', {
    value: subtleMock,
    writable: true,
    configurable: true,
  });
} catch (e) {
  global.crypto.subtle = subtleMock;
}

if (typeof window !== 'undefined' && window.crypto) {
  try {
    Object.defineProperty(window.crypto, 'subtle', {
      value: subtleMock,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    window.crypto.subtle = subtleMock;
  }
}
