/**
 * UUID formatting utilities
 * @class Formatter
 */
export class Formatter {
  /**
   * Remove dashes from UUID
   * @param {string} uuid - UUID to compact
   * @returns {string} Compact UUID
   */
  static compact(uuid) {
    if (uuid.startsWith('vxr-')) {
      uuid = uuid.substring(4);
    }
    return uuid.replace(/-/g, '');
  }

  /**
   * Add dashes to compact UUID
   * @param {string} compact - Compact UUID (32 hex chars)
   * @returns {string} Formatted UUID
   */
  static expand(compact) {
    const pattern = /^[0-9a-f]{32}$/i;
    if (compact.length === 32 && pattern.test(compact)) {
      return compact.substring(0, 8) + '-' +
             compact.substring(8, 12) + '-' +
             compact.substring(12, 16) + '-' +
             compact.substring(16, 20) + '-' +
             compact.substring(20, 32);
    }
    return compact;
  }

  /**
   * Add brand prefix to UUID
   * @param {string} uuid - UUID to brand
   * @param {string} prefix - Brand prefix (default: 'vxr-')
   * @returns {string} Branded UUID
   */
  static brand(uuid, prefix = 'vxr-') {
    if (uuid.startsWith(prefix)) return uuid;
    return `${prefix}${uuid}`;
  }

  /**
   * Remove brand prefix from UUID
   * @param {string} uuid - Branded UUID
   * @param {string} prefix - Brand prefix (default: 'vxr-')
   * @returns {string} Unbranded UUID
   */
  static unbrand(uuid, prefix = 'vxr-') {
    if (uuid.startsWith(prefix)) {
      return uuid.substring(prefix.length);
    }
    return uuid;
  }

  /**
   * Check if UUID is branded
   * @param {string} uuid - UUID to check
   * @param {string} prefix - Brand prefix (default: 'vxr-')
   * @returns {boolean} True if branded
   */
  static isBranded(uuid, prefix = 'vxr-') {
    return typeof uuid === 'string' && uuid.startsWith(prefix);
  }

  /**
   * Format UUID with specified style
   * @param {string} uuid - UUID to format
   * @param {string} style - Style: 'standard', 'compact', 'branded'
   * @returns {string} Formatted UUID
   */
  static format(uuid, style = 'standard') {
    switch(style) {
      case 'compact': return this.compact(uuid);
      case 'branded': return this.brand(uuid);
      case 'standard':
      default: return uuid;
    }
  }
}

export default Formatter;
