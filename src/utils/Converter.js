/**
 * UUID conversion utilities
 * @class Converter
 */
export class Converter {
  /**
   * Convert UUID to bytes
   * @param {string} uuid - UUID to convert
   * @returns {Uint8Array} Byte array
   */
  static toBytes(uuid) {
    if (uuid.startsWith('vxr-')) {
      uuid = uuid.substring(4);
    }
    const hex = uuid.replace(/-/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }

  /**
   * Convert bytes to UUID
   * @param {Uint8Array} bytes - Byte array
   * @returns {string} UUID string
   */
  static fromBytes(bytes) {
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return hex.substring(0, 8) + '-' +
           hex.substring(8, 12) + '-' +
           hex.substring(12, 16) + '-' +
           hex.substring(16, 20) + '-' +
           hex.substring(20, 32);
  }

  /**
   * Convert UUID to hex string
   * @param {string} uuid - UUID to convert
   * @returns {string} Hex string
   */
  static toHex(uuid) {
    return this.compact(uuid);
  }

  /**
   * Convert UUID to Base64
   * @param {string} uuid - UUID to convert
   * @returns {string} Base64 string
   */
  static toBase64(uuid) {
    const bytes = this.toBytes(uuid);
    if (typeof btoa !== 'undefined') {
      return btoa(String.fromCharCode(...bytes));
    }
    return Buffer.from(bytes).toString('base64');
  }

  /**
   * Convert Base64 to UUID
   * @param {string} base64 - Base64 string
   * @returns {string} UUID string
   */
  static fromBase64(base64) {
    let bytes;
    if (typeof atob !== 'undefined') {
      bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    } else {
      bytes = Buffer.from(base64, 'base64');
    }
    return this.fromBytes(bytes);
  }

  /**
   * Alias for compact
   * @param {string} uuid - UUID to compact
   * @returns {string} Compact UUID
   */
  static compact(uuid) {
    return uuid.replace(/-/g, '');
  }
}

export default Converter;
