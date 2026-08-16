// src/core/FileReader.js
export class useFileReader {
  constructor() {
    this.reader = typeof FileReader !== 'undefined' ? new FileReader() : null;
    this.result = null;
    this.error = null;
    this.loading = false;
    this.listeners = new Set();
  }

  _notify() { this.listeners.forEach(cb => { try { cb(this.result, this.error, this.loading); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  readAsText(file) {
    return new Promise((resolve, reject) => {
      if (!this.reader) {
        reject(new Error('FileReader not supported in this environment'));
        return;
      }
      this.loading = true;
      this.error = null;
      this._notify();
      this.reader.onload = () => {
        this.result = this.reader.result;
        this.loading = false;
        this._notify();
        resolve(this.result);
      };
      this.reader.onerror = () => {
        this.error = this.reader.error;
        this.loading = false;
        this._notify();
        reject(this.error);
      };
      this.reader.readAsText(file);
    });
  }

  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!this.reader) {
        reject(new Error('FileReader not supported in this environment'));
        return;
      }
      this.loading = true;
      this.error = null;
      this._notify();
      this.reader.onload = () => {
        this.result = this.reader.result;
        this.loading = false;
        this._notify();
        resolve(this.result);
      };
      this.reader.onerror = () => {
        this.error = this.reader.error;
        this.loading = false;
        this._notify();
        reject(this.error);
      };
      this.reader.readAsDataURL(file);
    });
  }

  readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      if (!this.reader) {
        reject(new Error('FileReader not supported in this environment'));
        return;
      }
      this.loading = true;
      this.error = null;
      this._notify();
      this.reader.onload = () => {
        this.result = this.reader.result;
        this.loading = false;
        this._notify();
        resolve(this.result);
      };
      this.reader.onerror = () => {
        this.error = this.reader.error;
        this.loading = false;
        this._notify();
        reject(this.error);
      };
      this.reader.readAsArrayBuffer(file);
    });
  }

  readAsBinaryString(file) {
    return new Promise((resolve, reject) => {
      if (!this.reader) {
        reject(new Error('FileReader not supported in this environment'));
        return;
      }
      this.loading = true;
      this.error = null;
      this._notify();
      this.reader.onload = () => {
        this.result = this.reader.result;
        this.loading = false;
        this._notify();
        resolve(this.result);
      };
      this.reader.onerror = () => {
        this.error = this.reader.error;
        this.loading = false;
        this._notify();
        reject(this.error);
      };
      this.reader.readAsBinaryString(file);
    });
  }

  abort() {
    if (this.reader && this.loading) {
      this.reader.abort();
    }
    this.loading = false;
    this._notify();
  }

  getResult() { return this.result; }
  getError() { return this.error; }
  isLoading() { return this.loading; }
  destroy() { this.abort(); this.listeners.clear(); }
}

export function createFileReader() {
  return new useFileReader();
}
