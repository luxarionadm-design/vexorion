import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeolocation, createGeolocation } from '../../../src/core/Geolocation.js';

describe('useGeolocation', () => {
  let geolocation;

  beforeEach(() => {
    geolocation = new useGeolocation();
    vi.clearAllMocks();
  });

  it('should get current position', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      }
    };

    navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => {
      success(mockPosition);
    });

    await geolocation.getCurrentPosition();
    expect(geolocation.getPosition()).toEqual({
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    });
  });

  it('should handle geolocation error', async () => {
    const mockError = new Error('Permission denied');

    navigator.geolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error(mockError);
    });

    await expect(geolocation.getCurrentPosition()).rejects.toThrow('Permission denied');
    expect(geolocation.getError()).toBe('Permission denied');
  });

  it('should handle geolocation not supported', async () => {
    const origGeo = navigator.geolocation;
    navigator.geolocation = undefined;
    const geo = new useGeolocation();

    await expect(geo.getCurrentPosition()).rejects.toThrow('Geolocation not supported');
    expect(geo.getError()).toBeInstanceOf(Error);
    navigator.geolocation = origGeo;
  });

  it('should watch position', () => {
    const mockPosition = {
      coords: { latitude: 37.7749, longitude: -122.4194 }
    };

    navigator.geolocation.watchPosition.mockImplementationOnce((success) => {
      success(mockPosition);
      return 123;
    });

    geolocation.watchPosition();
    expect(geolocation.watchId).toBe(123);
  });

  it('should clear watch', () => {
    geolocation.watchId = 123;
    geolocation.clearWatch();
    expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(123);
    expect(geolocation.watchId).toBeNull();
  });

  it('should notify subscribers', async () => {
    const callback = vi.fn();
    geolocation.subscribe(callback);

    const mockPosition = {
      coords: { latitude: 37.7749, longitude: -122.4194 }
    };

    navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => {
      success(mockPosition);
    });

    await geolocation.getCurrentPosition();
    expect(callback).toHaveBeenCalled();
  });

  it('should check loading state', async () => {
    navigator.geolocation.getCurrentPosition.mockImplementationOnce(() => {
      // Never resolve
    });

    const promise = geolocation.getCurrentPosition();
    expect(geolocation.isLoading()).toBe(true);
  });

  it('should create with helper', () => {
    const instance = createGeolocation();
    expect(instance).toBeInstanceOf(useGeolocation);
  });

  it('should destroy', () => {
    geolocation.destroy();
    expect(geolocation._listeners.size).toBe(0);
  });
});
