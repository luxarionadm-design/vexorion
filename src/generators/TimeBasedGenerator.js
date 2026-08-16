import BaseGenerator from './BaseGenerator.js';
import OSDetector from '../utils/OSDetector.js';

/**
 * Time-based UUID generators (v1, v6, v7)
 * @extends BaseGenerator
 */
export class TimeBasedGenerator extends BaseGenerator {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super({ version: 'v7', ...options });
    this._nodeId = options.nodeId || OSDetector.getNodeId();
    this._clockSeq = options.clockSeq || this._generateClockSeq();
  }

  /**
   * Generate random clock sequence
   * @returns {string} Clock sequence hex
   * @private
   */
  _generateClockSeq() {
    return Math.floor(Math.random() * 0x4000).toString(16).padStart(4, '0');
  }

  /**
   * Main generation method
   * @param {Object} options - Generation options
   * @returns {string} Generated UUID
   * @protected
   */
  _generate(options) {
    const version = options.version || this.options.version;
    switch(version) {
      case 'v1': return this._generateV1(options);
      case 'v6': return this._generateV6(options);
      case 'v7': return this._generateV7(options);
      default: return this._generateV7(options);
    }
  }

  /**
   * Generate UUID v1 (timestamp + node)
   * @param {Object} options - Generation options
   * @returns {string} UUID v1
   * @private
   */
  _generateV1(options) {
    const timestamp = Date.now().toString(16).padStart(12, '0');
    const clockSeq = options.clockSeq || this._clockSeq;
    const node = options.nodeId || this._nodeId;
    return timestamp.substring(0, 8) + '-' +
           timestamp.substring(8, 12) + '-' +
           '1' + clockSeq.substring(1, 4) + '-' +
           '8' + node.substring(0, 3) + '-' +
           node.substring(3);
  }

  /**
   * Generate UUID v6 (time-ordered)
   * @param {Object} options - Generation options
   * @returns {string} UUID v6
   * @private
   */
  _generateV6(options) {
    const timestamp = Date.now().toString(16).padStart(12, '0');
    const clockSeq = options.clockSeq || this._clockSeq;
    const node = options.nodeId || this._nodeId;
    const timestampHigh = timestamp.substring(0, 8);
    const timestampMid = timestamp.substring(8, 12);
    const timestampLow = timestamp.substring(12, 16);
    return timestampHigh + '-' +
           timestampMid + '-' +
           '6' + timestampLow.substring(0, 3) + '-' +
           '8' + clockSeq.substring(1, 4) + '-' +
           node;
  }

  /**
   * Generate UUID v7 (time-sorted)
   * @param {Object} options - Generation options
   * @returns {string} UUID v7
   * @private
   */
  _generateV7(options) {
    const timestamp = Date.now().toString(16).padStart(12, '0');
    const randomPart = options.random || 
                      Math.floor(Math.random() * 0x10000000000).toString(16).padStart(12, '0');
    return timestamp.substring(0, 8) + '-' +
           timestamp.substring(8, 12) + '-' +
           '7' + timestamp.substring(12, 15) + '-' +
           '8' + randomPart.substring(0, 3) + '-' +
           randomPart.substring(3);
  }

  /**
   * Extract timestamp from UUID
   * @param {string} uuid - UUID to extract timestamp from
   * @returns {number|null} Timestamp in milliseconds
   */
  getTimestamp(uuid) {
    if (uuid.length === 36) {
      const timeHex = uuid.substring(0, 8) + uuid.substring(9, 13);
      return parseInt(timeHex, 16);
    }
    return null;
  }

  /**
   * Generate UUID v1
   * @param {Object} options - Generation options
   * @returns {string} UUID v1
   */
  generateV1(options = {}) {
    return this._generateV1({ ...this.options, ...options });
  }

  /**
   * Generate UUID v6
   * @param {Object} options - Generation options
   * @returns {string} UUID v6
   */
  generateV6(options = {}) {
    return this._generateV6({ ...this.options, ...options });
  }

  /**
   * Generate UUID v7
   * @param {Object} options - Generation options
   * @returns {string} UUID v7
   */
  generateV7(options = {}) {
    return this._generateV7({ ...this.options, ...options });
  }

  /**
   * Get generator version
   * @returns {string} Version string
   */
  getVersion() {
    return 'v7';
  }

  /**
   * Get generator name
   * @returns {string} Generator name
   */
  getName() {
    return 'TimeBasedGenerator';
  }
}

export default TimeBasedGenerator;
