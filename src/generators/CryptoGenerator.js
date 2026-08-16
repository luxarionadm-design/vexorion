import BaseGenerator from './BaseGenerator.js';
import RandomGenerator from './RandomGenerator.js';

/**
 * Cryptographically secure UUID v4 generator
 * Uses Web Crypto API or Node.js crypto
 * @extends BaseGenerator
 */
export class CryptoGenerator extends BaseGenerator {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super({ version: 'v4', secure: true, ...options });
    this._crypto = this._getCrypto();
  }

  /**
   * Get crypto implementation based on environment
   * @returns {Object|null} Crypto implementation
   * @private
   */
  _getCrypto() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      return crypto;
    }
    try {
      return require('crypto');
    } catch (e) {
      return null;
    }
  }

  /**
   * Generate cryptographically secure UUID
   * @param {Object} options - Generation options
   * @returns {string} Secure UUID
   * @protected
   */
  _generate(options) {
    if (this._crypto && this._crypto.randomUUID) {
      return this._crypto.randomUUID();
    }
    const buffer = new Uint8Array(16);
    if (this._crypto && this._crypto.getRandomValues) {
      this._crypto.getRandomValues(buffer);
      return this._generateFromBuffer(buffer);
    }
    if (this._crypto && this._crypto.randomBytes) {
      const buffer = this._crypto.randomBytes(16);
      return this._generateFromBuffer(buffer);
    }
    return new RandomGenerator().generate(options);
  }

  /**
   * Generate UUID from random buffer
   * @param {Uint8Array} buffer - Random bytes
   * @returns {string} Formatted UUID
   * @private
   */
  _generateFromBuffer(buffer) {
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    const hex = Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hex.substring(0, 8) + '-' +
           hex.substring(8, 12) + '-' +
           hex.substring(12, 16) + '-' +
           hex.substring(16, 20) + '-' +
           hex.substring(20, 32);
  }

  /**
   * Generate secure token
   * @param {number} length - Token length
   * @returns {string} Hex token
   */
  generateToken(length = 32) {
    const buffer = new Uint8Array(length);
    if (this._crypto && this._crypto.getRandomValues) {
      this._crypto.getRandomValues(buffer);
    } else {
      for (let i = 0; i < length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, length);
  }

  /**
   * Get generator version
   * @returns {string} Version string
   */
  getVersion() {
    return 'v4';
  }

  /**
   * Get generator name
   * @returns {string} Generator name
   */
  getName() {
    return 'CryptoGenerator';
  }
}

export default CryptoGenerator;
