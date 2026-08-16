import GeneratorInterface from '../interfaces/GeneratorInterface.js';

/**
 * Abstract base class for all UUID generators
 * Implements Template Method pattern
 * @abstract
 * @extends GeneratorInterface
 */
export class BaseGenerator extends GeneratorInterface {
  /**
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();
    this.options = this.validateOptions(options);
    this._cache = new WeakMap();
  }

  /**
   * Template method for generating UUID
   * @param {Object} options - Generation options
   * @returns {string} Generated UUID
   */
  generate(options = {}) {
    const mergedOptions = { ...this.options, ...options };
    this._preGenerate(mergedOptions);
    const result = this._generate(mergedOptions);
    this._postGenerate(result, mergedOptions);
    return result;
  }

  /**
   * Hook: Called before generation
   * @param {Object} options - Generation options
   * @protected
   */
  _preGenerate(options) {
    // Override in subclass
  }

  /**
   * Core generation logic (must be implemented)
   * @param {Object} options - Generation options
   * @returns {string} Generated UUID
   * @abstract
   * @protected
   */
  _generate(options) {
    throw new Error('_generate() must be implemented by subclass');
  }

  /**
   * Hook: Called after generation
   * @param {string} result - Generated UUID
   * @param {Object} options - Generation options
   * @protected
   */
  _postGenerate(result, options) {
    // Override in subclass
  }

  /**
   * Format bytes as hex string
   * @param {Uint8Array} bytes - Bytes to format
   * @returns {string} Hex string
   * @protected
   */
  _formatHex(bytes) {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Format hex as UUID string
   * @param {string} hex - Hex string (32 chars)
   * @returns {string} Formatted UUID
   * @protected
   */
  _formatUUID(hex) {
    return hex.substring(0, 8) + '-' +
           hex.substring(8, 12) + '-' +
           hex.substring(12, 16) + '-' +
           hex.substring(16, 20) + '-' +
           hex.substring(20, 32);
  }

  /**
   * Validate options
   * @param {Object} options - Options to validate
   * @returns {Object} Validated options
   */
  validateOptions(options) {
    return {
      version: options.version || 'v4',
      secure: options.secure || false,
      ...options
    };
  }

  /**
   * Clear internal cache
   */
  clearCache() {
    this._cache = new WeakMap();
  }

  /**
   * Get generator version
   * @returns {string} Version string
   */
  getVersion() {
    return this.options.version || 'unknown';
  }

  /**
   * Get generator name
   * @returns {string} Generator name
   */
  getName() {
    return this.constructor.name;
  }
}

export default BaseGenerator;
