import BaseGenerator from './BaseGenerator.js';

const HEX_CHARS = '0123456789abcdef';

/**
 * Math.random() based UUID v4 generator
 * @extends BaseGenerator
 */
export class RandomGenerator extends BaseGenerator {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super({ version: 'v4', ...options });
  }

  /**
   * Generate random UUID v4
   * @param {Object} options - Generation options
   * @returns {string} UUID v4
   * @protected
   */
  _generate(options) {
    const chars = new Array(36);
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        chars[i] = '-';
      } else if (i === 14) {
        chars[i] = '4';
      } else if (i === 19) {
        chars[i] = HEX_CHARS[(Math.random() * 4 | 0) + 8];
      } else {
        chars[i] = HEX_CHARS[Math.random() * 16 | 0];
      }
    }
    return chars.join('');
  }

  /**
   * Generate short alphanumeric ID
   * @returns {string} Short ID
   */
  generateShort() {
    return Math.random().toString(36).substring(2, 10) + 
           Math.random().toString(36).substring(2, 10);
  }

  /**
   * Generate numeric ID
   * @param {number} length - Length of ID
   * @returns {string} Numeric ID
   */
  generateNumeric(length = 10) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  /**
   * Generate hex string
   * @param {number} length - Length of hex string
   * @returns {string} Hex string
   */
  generateHex(length = 8) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += HEX_CHARS[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  /**
   * Generate batch of UUIDs
   * @param {number} count - Number of UUIDs to generate
   * @param {Object} options - Generation options
   * @returns {string[]} Array of UUIDs
   */
  generateBatch(count = 10, options = {}) {
    const uuids = [];
    const seen = new Set();
    for (let i = 0; i < count; i++) {
      let uuid;
      let attempts = 0;
      do {
        uuid = this.generate(options);
        attempts++;
        if (attempts > 100) break;
      } while (seen.has(uuid));
      seen.add(uuid);
      uuids.push(uuid);
    }
    return uuids;
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
    return 'RandomGenerator';
  }
}

export default RandomGenerator;
