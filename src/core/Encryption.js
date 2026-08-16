// src/core/Encryption.js
export class useEncryption {
  constructor(options = {}) {
    this.secret = options.secret || 'default-secret-key';
    this.algorithm = options.algorithm || 'AES-GCM';
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  async _getKey() {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(this.secret.padEnd(32, ' ').slice(0, 32)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: this.encoder.encode('salt_vexorion'), iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: this.algorithm, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(text) {
    try {
      const key = await this._getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = this.encoder.encode(text);
      const encrypted = await crypto.subtle.encrypt(
        { name: this.algorithm, iv },
        key,
        encoded
      );
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  async decrypt(encryptedText) {
    try {
      const key = await this._getKey();
      const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      const decrypted = await crypto.subtle.decrypt(
        { name: this.algorithm, iv },
        key,
        encrypted
      );
      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  async hash(text, algorithm = 'SHA-256') {
    const encoded = this.encoder.encode(text);
    const hash = await crypto.subtle.digest(algorithm, encoded);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  generateToken(length = 32) {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  generateUUID() {
    return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export function createEncryption(options = {}) {
  return new useEncryption(options);
}
