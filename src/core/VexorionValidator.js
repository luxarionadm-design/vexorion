const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * UUID validation utilities
 * @class VexorionValidator
 */
export class VexorionValidator {
  /**
   * Check if string is a valid UUID
   * @param {string} uuid - UUID to validate
   * @returns {boolean} True if valid
   */
  static isUUID(uuid) {
    if (typeof uuid !== 'string') return false;
    if (uuid.startsWith('vxr-')) {
      uuid = uuid.substring(4);
    }
    return UUID_PATTERN.test(uuid);
  }

  /**
   * Alias for isUUID
   * @param {string} uuid - UUID to validate
   * @returns {boolean} True if valid
   */
  static validate(uuid) {
    return this.isUUID(uuid);
  }

  /**
   * Detailed validation with metadata
   * @param {string} uuid - UUID to validate
   * @returns {Object} Validation result with metadata
   */
  static validateDetailed(uuid) {
    const result = {
      valid: false,
      version: null,
      variant: null,
      isBranded: false,
      errors: []
    };

    if (typeof uuid !== 'string') {
      result.errors.push('Input must be a string');
      return result;
    }

    if (uuid.startsWith('vxr-')) {
      result.isBranded = true;
      uuid = uuid.substring(4);
    }

    if (!UUID_PATTERN.test(uuid)) {
      result.errors.push('Invalid UUID format');
      return result;
    }

    result.valid = true;
    result.version = parseInt(uuid.charAt(14), 10);

    const variant = parseInt(uuid.charAt(19), 10);
    if (variant >= 8 && variant <= 9) result.variant = 'RFC4122';
    else if (variant >= 0 && variant <= 7) result.variant = 'NCS';
    else if (variant >= 10 && variant <= 11) result.variant = 'Microsoft';
    else result.variant = 'Future';

    return result;
  }

  /**
   * Get UUID version
   * @param {string} uuid - UUID to check
   * @returns {number|null} Version number or null
   */
  static getVersion(uuid) {
    if (uuid.startsWith('vxr-')) {
      uuid = uuid.substring(4);
    }
    if (uuid.length === 36) {
      return parseInt(uuid.charAt(14), 10);
    }
    return null;
  }

  /**
   * Get UUID variant
   * @param {string} uuid - UUID to check
   * @returns {string|null} Variant name or null
   */
  static getVariant(uuid) {
    if (uuid.startsWith('vxr-')) {
      uuid = uuid.substring(4);
    }
    if (uuid.length === 36) {
      const variant = parseInt(uuid.charAt(19), 10);
      if (variant >= 8 && variant <= 9) return 'RFC4122';
      if (variant >= 0 && variant <= 7) return 'NCS';
      if (variant >= 10 && variant <= 11) return 'Microsoft';
      return 'Future';
    }
    return null;
  }

  /**
   * Check if UUID is version 3
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v3
   */
  static isV3(uuid) { return this.getVersion(uuid) === 3; }

  /**
   * Check if UUID is version 4
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v4
   */
  static isV4(uuid) { return this.getVersion(uuid) === 4; }

  /**
   * Check if UUID is version 5
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v5
   */
  static isV5(uuid) { return this.getVersion(uuid) === 5; }

  /**
   * Check if UUID is version 6
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v6
   */
  static isV6(uuid) { return this.getVersion(uuid) === 6; }

  /**
   * Check if UUID is version 7
   * @param {string} uuid - UUID to check
   * @returns {boolean} True if v7
   */
  static isV7(uuid) { return this.getVersion(uuid) === 7; }

  /**
   * Compare two UUIDs for equality
   * @param {string} uuid1 - First UUID
   * @param {string} uuid2 - Second UUID
   * @returns {boolean} True if equal
   */
  static equals(uuid1, uuid2) {
    if (uuid1.startsWith('vxr-')) uuid1 = uuid1.substring(4);
    if (uuid2.startsWith('vxr-')) uuid2 = uuid2.substring(4);
    return uuid1.toLowerCase() === uuid2.toLowerCase();
  }

  /**
   * Sort UUIDs
   * @param {string[]} uuids - Array of UUIDs
   * @returns {string[]} Sorted array
   */
  static sort(uuids) {
    return uuids.slice().sort((a, b) => {
      let aClean = a.startsWith('vxr-') ? a.substring(4) : a;
      let bClean = b.startsWith('vxr-') ? b.substring(4) : b;
      if (aClean < bClean) return -1;
      if (aClean > bClean) return 1;
      return 0;
    });
  }

  /**
   * Get complete info about UUID
   * @param {string} uuid - UUID to analyze
   * @returns {Object} Info object
   */
  static getInfo(uuid) {
    return {
      version: this.getVersion(uuid),
      variant: this.getVariant(uuid),
      isValid: this.isUUID(uuid),
      isBranded: uuid.startsWith('vxr-')
    };
  }
}

export default VexorionValidator;
