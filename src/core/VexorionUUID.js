import GeneratorRegistry from './GeneratorRegistry.js';
import VexorionValidator from './VexorionValidator.js';
import Formatter from '../utils/Formatter.js';
import Converter from '../utils/Converter.js';
import OSDetector from '../utils/OSDetector.js';
import { NAMESPACES, VERSION } from '../constants/Namespaces.js';
import RandomGenerator from '../generators/RandomGenerator.js';
import CryptoGenerator from '../generators/CryptoGenerator.js';
import TimeBasedGenerator from '../generators/TimeBasedGenerator.js';

/**
 * Main UUID generation facade
 * Implements Singleton and Facade patterns
 * @class VexorionUUID
 */
export class VexorionUUID {
  static #instance = null;
  static #registry = new GeneratorRegistry();
  static #initialized = false;

  /**
   * Private constructor (use getInstance)
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    if (VexorionUUID.#instance) {
      return VexorionUUID.#instance;
    }
    this._initialize(options);
    VexorionUUID.#instance = this;
    return this;
  }

  /**
   * Initialize the instance
   * @param {Object} options - Configuration options
   * @private
   */
  _initialize(options = {}) {
    if (VexorionUUID.#initialized) return;
    this._registerDefaultGenerators();
    this._configure(options);
    VexorionUUID.#initialized = true;
  }

  /**
   * Register default generators
   * @private
   */
  _registerDefaultGenerators() {
    const registry = VexorionUUID.#registry;
    registry.register('v4', RandomGenerator, {
      default: true,
      aliases: ['random', 'default']
    });
    registry.register('secure', CryptoGenerator, {
      aliases: ['crypto']
    });
    registry.register('v1', TimeBasedGenerator, {
      aliases: ['time', 'timestamp']
    });
    registry.register('v6', TimeBasedGenerator);
    registry.register('v7', TimeBasedGenerator);
  }

  /**
   * Configure instance
   * @param {Object} options - Configuration options
   * @private
   */
  _configure(options = {}) {
    this._config = {
      defaultVersion: options.defaultVersion || 'v4',
      branding: options.branding !== undefined ? options.branding : true,
      prefix: options.prefix || 'vxr-',
      ...options
    };
  }

  /**
   * Get singleton instance
   * @param {Object} options - Configuration options
   * @returns {VexorionUUID} Singleton instance
   */
  static getInstance(options = {}) {
    if (!this.#instance) {
      this.#instance = new VexorionUUID(options);
    }
    return this.#instance;
  }

  /**
   * Generate UUID (main method)
   * @param {Object} options - Generation options
   * @param {string} options.version - UUID version ('v4', 'v7', etc.)
   * @param {boolean} options.secure - Use secure generation
   * @param {boolean} options.unbranded - Skip branding
   * @returns {string} Generated UUID
   */
  static generate(options = {}) {
    const instance = this.getInstance();
    const version = options.version || instance._config.defaultVersion;
    const generator = this.#registry.get(version);
    let uuid = generator.generate(options);
    if (instance._config.branding && !options.unbranded) {
      uuid = Formatter.brand(uuid, instance._config.prefix);
    }
    return uuid;
  }

  /**
   * Generate UUID v1
   * @param {Object} options - Generation options
   * @returns {string} UUID v1
   */
  static generateV1(options = {}) {
    return this.generate({ version: 'v1', ...options });
  }

  /**
   * Generate UUID v4 (random)
   * @param {Object} options - Generation options
   * @returns {string} UUID v4
   */
  static generateV4(options = {}) {
    return this.generate({ version: 'v4', ...options });
  }

  /**
   * Generate UUID v6 (time-ordered)
   * @param {Object} options - Generation options
   * @returns {string} UUID v6
   */
  static generateV6(options = {}) {
    return this.generate({ version: 'v6', ...options });
  }

  /**
   * Generate UUID v7 (time-sorted)
   * @param {Object} options - Generation options
   * @returns {string} UUID v7
   */
  static generateV7(options = {}) {
    return this.generate({ version: 'v7', ...options });
  }

  /**
   * Generate cryptographically secure UUID
   * @param {Object} options - Generation options
   * @returns {string} Secure UUID
   */
  static generateSecure(options = {}) {
    const generator = this.#registry.get('secure');
    let uuid = generator.generate(options);
    if (this.getInstance()._config.branding) {
      uuid = Formatter.brand(uuid);
    }
    return uuid;
  }

  /**
   * Generate UUID v3 (name-based, MD5)
   * @param {string} namespace - Namespace UUID
   * @param {string} name - Name to hash
   * @param {Object} options - Generation options
   * @returns {string} UUID v3
   */
  static generateV3(namespace, name, options = {}) {
    const str = namespace.toLowerCase().replace(/-/g, '') + name;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(32, '0');
    const uuid = hex.substring(0, 8) + '-' +
                 hex.substring(8, 12) + '-' +
                 '3' + hex.substring(13, 16) + '-' +
                 '8' + hex.substring(17, 20) + '-' +
                 hex.substring(20, 32);
    return this._applyBranding(uuid, options);
  }

  /**
   * Generate UUID v5 (name-based, SHA-1)
   * @param {string} namespace - Namespace UUID
   * @param {string} name - Name to hash
   * @param {Object} options - Generation options
   * @returns {string} UUID v5
   */
  static generateV5(namespace, name, options = {}) {
    const str = namespace.toLowerCase().replace(/-/g, '') + name;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(32, '0');
    const uuid = hex.substring(0, 8) + '-' +
                 hex.substring(8, 12) + '-' +
                 '5' + hex.substring(13, 16) + '-' +
                 '8' + hex.substring(17, 20) + '-' +
                 hex.substring(20, 32);
    return this._applyBranding(uuid, options);
  }

  /**
   * Generate batch of UUIDs
   * @param {number} count - Number of UUIDs
   * @param {string} version - UUID version
   * @param {Object} options - Generation options
   * @returns {string[]} Array of UUIDs
   */
  static generateBatch(count = 10, version = 'v4', options = {}) {
    const uuids = [];
    for (let i = 0; i < count; i++) {
      uuids.push(this.generate({ version, ...options }));
    }
    return uuids;
  }

  /**
   * Generate short ID
   * @param {Object} options - Generation options
   * @returns {string} Short ID
   */
  static generateShort(options = {}) {
    const generator = this.#registry.get('v4');
    const id = generator.generateShort();
    return this._applyBranding(id, options);
  }

  /**
   * Generate numeric ID
   * @param {number} length - Length of ID
   * @param {Object} options - Generation options
   * @returns {string} Numeric ID
   */
  static generateNumeric(length = 10, options = {}) {
    const generator = this.#registry.get('v4');
    return generator.generateNumeric(length);
  }

  /**
   * Generate hex ID
   * @param {number} length - Length of hex string
   * @param {Object} options - Generation options
   * @returns {string} Hex string
   */
  static generateHex(length = 8, options = {}) {
    const generator = this.#registry.get('v4');
    return generator.generateHex(length);
  }

  /**
   * Apply branding to UUID
   * @param {string} uuid - UUID to brand
   * @param {Object} options - Options
   * @returns {string} Branded UUID
   * @private
   */
  static _applyBranding(uuid, options = {}) {
    const instance = this.getInstance();
    if (instance._config.branding && !options.unbranded) {
      return Formatter.brand(uuid, instance._config.prefix);
    }
    return uuid;
  }

  /**
   * Check if string is valid UUID
   * @param {string} uuid - UUID to validate
   * @returns {boolean} True if valid
   */
  static isUUID(uuid) {
    return VexorionValidator.isUUID(uuid);
  }

  /**
   * Validate UUID (alias)
   * @param {string} uuid - UUID to validate
   * @returns {boolean} True if valid
   */
  static validate(uuid) {
    return VexorionValidator.validate(uuid);
  }

  /**
   * Detailed validation
   * @param {string} uuid - UUID to validate
   * @returns {Object} Validation result
   */
  static validateDetailed(uuid) {
    return VexorionValidator.validateDetailed(uuid);
  }

  /**
   * Compact UUID (remove dashes)
   * @param {string} uuid - UUID to compact
   * @returns {string} Compact UUID
   */
  static compact(uuid) {
    return Formatter.compact(uuid);
  }

  /**
   * Expand UUID (add dashes)
   * @param {string} compact - Compact UUID
   * @returns {string} Expanded UUID
   */
  static expand(compact) {
    return Formatter.expand(compact);
  }

  /**
   * Add brand prefix
   * @param {string} uuid - UUID to brand
   * @param {string} prefix - Brand prefix
   * @returns {string} Branded UUID
   */
  static brand(uuid, prefix = 'vxr-') {
    return Formatter.brand(uuid, prefix);
  }

  /**
   * Remove brand prefix
   * @param {string} uuid - Branded UUID
   * @param {string} prefix - Brand prefix
   * @returns {string} Unbranded UUID
   */
  static unbrand(uuid, prefix = 'vxr-') {
    return Formatter.unbrand(uuid, prefix);
  }

  /**
   * Check if branded
   * @param {string} uuid - UUID to check
   * @param {string} prefix - Brand prefix
   * @returns {boolean} True if branded
   */
  static isBranded(uuid, prefix = 'vxr-') {
    return Formatter.isBranded(uuid, prefix);
  }

  /**
   * Convert UUID to bytes
   * @param {string} uuid - UUID to convert
   * @returns {Uint8Array} Byte array
   */
  static toBytes(uuid) {
    return Converter.toBytes(uuid);
  }

  /**
   * Convert bytes to UUID
   * @param {Uint8Array} bytes - Byte array
   * @returns {string} UUID string
   */
  static fromBytes(bytes) {
    return Converter.fromBytes(bytes);
  }

  /**
   * Convert UUID to Base64
   * @param {string} uuid - UUID to convert
   * @returns {string} Base64 string
   */
  static toBase64(uuid) {
    return Converter.toBase64(uuid);
  }

  /**
   * Convert Base64 to UUID
   * @param {string} base64 - Base64 string
   * @returns {string} UUID string
   */
  static fromBase64(base64) {
    return Converter.fromBase64(base64);
  }

  /**
   * Get UUID version
   * @param {string} uuid - UUID to check
   * @returns {number|null} Version number
   */
  static getVersion(uuid) {
    return VexorionValidator.getVersion(uuid);
  }

  /**
   * Get UUID variant
   * @param {string} uuid - UUID to check
   * @returns {string|null} Variant name
   */
  static getVariant(uuid) {
    return VexorionValidator.getVariant(uuid);
  }

  /**
   * Extract timestamp from UUID
   * @param {string} uuid - UUID to extract from
   * @returns {number|null} Timestamp
   */
  static getTimestamp(uuid) {
    const generator = this.#registry.get('v7');
    return generator.getTimestamp(uuid);
  }

  /**
   * Get complete UUID info
   * @param {string} uuid - UUID to analyze
   * @returns {Object} Info object
   */
  static getInfo(uuid) {
    return VexorionValidator.getInfo(uuid);
  }

  /**
   * Get OS information
   * @returns {Object} OS info
   */
  static getOSInfo() {
    return OSDetector.getOSInfo();
  }

  /**
   * Get platform name
   * @returns {string} Platform name
   */
  static getPlatform() {
    return OSDetector.getPlatform();
  }

  /**
   * Get standard namespaces
   * @returns {Object} Namespaces object
   */
  static getNamespaces() {
    return { ...NAMESPACES };
  }

  /**
   * Get library version
   * @returns {string} Version string
   */
  static getVersionNumber() {
    return VERSION;
  }

  /**
   * Check if UUID is v3
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v3
   */
  static isV3(uuid) { return VexorionValidator.isV3(uuid); }

  /**
   * Check if UUID is v4
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v4
   */
  static isV4(uuid) { return VexorionValidator.isV4(uuid); }

  /**
   * Check if UUID is v5
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v5
   */
  static isV5(uuid) { return VexorionValidator.isV5(uuid); }

  /**
   * Check if UUID is v6
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v6
   */
  static isV6(uuid) { return VexorionValidator.isV6(uuid); }

  /**
   * Check if UUID is v7
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v7
   */
  static isV7(uuid) { return VexorionValidator.isV7(uuid); }

  /**
   * Compare two UUIDs
   * @param {string} uuid1 - First UUID
   * @param {string} uuid2 - Second UUID
   * @returns {boolean} True if equal
   */
  static equals(uuid1, uuid2) {
    return VexorionValidator.equals(uuid1, uuid2);
  }

  /**
   * Sort UUIDs
   * @param {string[]} uuids - Array of UUIDs
   * @returns {string[]} Sorted array
   */
  static sort(uuids) {
    return VexorionValidator.sort(uuids);
  }

  /**
   * Increment UUID (last part)
   * @param {string} uuid - UUID to increment
   * @returns {string} Incremented UUID
   */
  static increment(uuid) {
    const parts = uuid.split('-');
    const last = parseInt(parts[4], 16);
    const incremented = (last + 1).toString(16).padStart(12, '0');
    parts[4] = incremented;
    return parts.join('-');
  }

  /**
   * Decrement UUID (last part)
   * @param {string} uuid - UUID to decrement
   * @returns {string} Decremented UUID
   */
  static decrement(uuid) {
    const parts = uuid.split('-');
    const last = parseInt(parts[4], 16);
    const decremented = Math.max(0, last - 1).toString(16).padStart(12, '0');
    parts[4] = decremented;
    return parts.join('-');
  }

  /**
   * Create custom namespace from name
   * @param {string} name - Namespace name
   * @returns {string} Namespace UUID
   */
  static createNamespace(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(32, '0');
    return hex.substring(0, 8) + '-' +
           hex.substring(8, 12) + '-' +
           '4' + hex.substring(13, 16) + '-' +
           '8' + hex.substring(17, 20) + '-' +
           hex.substring(20, 32);
  }

  /**
   * Create deterministic UUID from string
   * @param {string} str - Input string
   * @returns {string} Deterministic UUID
   */
  static createFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(32, '0');
    return hex.substring(0, 8) + '-' +
           hex.substring(8, 12) + '-' +
           '4' + hex.substring(13, 16) + '-' +
           '8' + hex.substring(17, 20) + '-' +
           hex.substring(20, 32);
  }

  /**
   * Alias for generate()
   * @param {Object} options - Generation options
   * @returns {string} Generated UUID
   */
  static random(options = {}) {
    return this.generate(options);
  }

  /**
   * Alias for generate()
   * @param {Object} options - Generation options
   * @returns {string} Generated UUID
   */
  static create(options = {}) {
    return this.generate(options);
  }

  /**
   * Register custom generator
   * @param {string} name - Generator name
   * @param {Function} GeneratorClass - Generator class
   * @param {Object} options - Registration options
   * @returns {GeneratorRegistry} Registry instance
   */
  static registerGenerator(name, GeneratorClass, options = {}) {
    return this.#registry.register(name, GeneratorClass, options);
  }

  /**
   * Get generator instance
   * @param {string} name - Generator name
   * @returns {Object} Generator instance
   */
  static getGenerator(name) {
    return this.#registry.get(name);
  }

  /**
   * Get registry instance
   * @returns {GeneratorRegistry} Registry instance
   */
  static getRegistry() {
    return this.#registry;
  }

  /**
   * Configure global settings
   * @param {Object} options - Configuration options
   * @returns {VexorionUUID} Self for chaining
   */
  static configure(options = {}) {
    const instance = this.getInstance();
    instance._configure(options);
    return this;
  }

  /**
   * Reset singleton instance
   * @returns {VexorionUUID} Self for chaining
   */
  static reset() {
    this.#instance = null;
    this.#registry = new GeneratorRegistry();
    this.#initialized = false;
    return this;
  }
}

export default VexorionUUID;
