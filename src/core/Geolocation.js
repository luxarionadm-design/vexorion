// src/core/Geolocation.js
export class useGeolocation {
  constructor(options = {}) {
    this.enableHighAccuracy = options.enableHighAccuracy || false;
    this.timeout = options.timeout || 30000;
    this.maximumAge = options.maximumAge || 0;
    this.position = null;
    this.error = null;
    this.loading = false;
    this.watchId = null;
    this._listeners = new Set();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.position, this.error); } catch (e) {} }); }

  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        const err = new Error('Geolocation not supported');
        this.error = err;
        this._notify();
        reject(err);
        return;
      }
      this.loading = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.position = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, altitude: pos.coords.altitude, altitudeAccuracy: pos.coords.altitudeAccuracy, heading: pos.coords.heading, speed: pos.coords.speed };
          this.error = null;
          this.loading = false;
          this._notify();
          resolve(this.position);
        },
        (err) => {
          this.error = err.message;
          this.loading = false;
          this._notify();
          reject(err);
        },
        { enableHighAccuracy: this.enableHighAccuracy, timeout: this.timeout, maximumAge: this.maximumAge }
      );
    });
  }

  watchPosition() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) { const err = new Error('Geolocation not supported'); this.error = err; this._notify(); return; }
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.position = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy, altitude: pos.coords.altitude, altitudeAccuracy: pos.coords.altitudeAccuracy, heading: pos.coords.heading, speed: pos.coords.speed };
        this.error = null;
        this._notify();
      },
      (err) => {
        this.error = err.message;
        this._notify();
      },
      { enableHighAccuracy: this.enableHighAccuracy, timeout: this.timeout, maximumAge: this.maximumAge }
    );
  }

  clearWatch() {
    if (this.watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  destroy() { this.clearWatch(); this._listeners.clear(); }
  getPosition() { return this.position; }
  getError() { return this.error; }
  isLoading() { return this.loading; }
}

export function createGeolocation(options = {}) {
  return new useGeolocation(options);
}
