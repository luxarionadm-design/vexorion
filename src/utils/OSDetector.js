/**
 * Operating system detection utilities
 * @class OSDetector
 */
export class OSDetector {
  /**
   * Get platform name
   * @returns {string} Platform name
   */
  static getPlatform() {
    if (typeof navigator !== 'undefined') {
      return navigator.platform || 'unknown';
    }
    if (typeof process !== 'undefined') {
      return process.platform || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Check if running in Node.js
   * @returns {boolean} True if Node.js
   */
  static isNode() {
    return typeof process !== 'undefined' && process.versions && process.versions.node;
  }

  /**
   * Check if running in browser
   * @returns {boolean} True if browser
   */
  static isBrowser() {
    return typeof window !== 'undefined' && window.document;
  }

  /**
   * Get node ID (MAC address or fallback)
   * @returns {string} Node ID (12 hex chars)
   */
  static getNodeId() {
    try {
      const nodeId = this._getNodeIdFromOS();
      if (nodeId) return nodeId;
    } catch (e) {}
    return this._generateFallbackNodeId();
  }

  /**
   * Get node ID from OS
   * @returns {string|null} Node ID or null
   * @private
   */
  static _getNodeIdFromOS() {
    const platform = this.getPlatform();
    if (platform.includes('Win')) {
      return this._getWindowsNodeId();
    } else if (platform.includes('Mac') || platform === 'darwin') {
      return this._getMacNodeId();
    } else if (platform.includes('Linux') || platform === 'linux') {
      return this._getLinuxNodeId();
    }
    return null;
  }

  /**
   * Get Windows node ID
   * @returns {string|null} Node ID or null
   * @private
   */
  static _getWindowsNodeId() {
    try {
      if (typeof require !== 'undefined') {
        const { execSync } = require('child_process');
        const output = execSync('getmac /fo csv /nh').toString();
        const mac = output.replace(/"/g, '').split(',')[0].trim();
        if (mac && mac.length === 17) {
          return mac.replace(/:/g, '');
        }
      }
    } catch (e) {}
    return null;
  }

  /**
   * Get macOS node ID
   * @returns {string|null} Node ID or null
   * @private
   */
  static _getMacNodeId() {
    try {
      if (typeof require !== 'undefined') {
        const { execSync } = require('child_process');
        const output = execSync('ifconfig en0 | grep ether').toString();
        const match = output.match(/([0-9a-f]{2}[:]){5}([0-9a-f]{2})/i);
        if (match) {
          return match[0].replace(/:/g, '');
        }
      }
    } catch (e) {}
    return null;
  }

  /**
   * Get Linux node ID
   * @returns {string|null} Node ID or null
   * @private
   */
  static _getLinuxNodeId() {
    try {
      if (typeof require !== 'undefined') {
        const { execSync } = require('child_process');
        const output = execSync('cat /sys/class/net/eth0/address 2>/dev/null || ip link show | grep ether').toString();
        const match = output.match(/([0-9a-f]{2}[:]){5}([0-9a-f]{2})/i);
        if (match) {
          return match[0].replace(/:/g, '');
        }
      }
    } catch (e) {}
    return null;
  }

  /**
   * Generate fallback node ID
   * @returns {string} Random node ID
   * @private
   */
  static _generateFallbackNodeId() {
    const HEX_CHARS = '0123456789abcdef';
    const parts = [];
    for (let i = 0; i < 6; i++) {
      parts.push(HEX_CHARS[Math.floor(Math.random() * 16)]);
      parts.push(HEX_CHARS[Math.floor(Math.random() * 16)]);
    }
    return parts.join('');
  }

  /**
   * Get complete OS information
   * @returns {Object} OS info object
   */
  static getOSInfo() {
    return {
      platform: this.getPlatform(),
      nodeId: this.getNodeId(),
      isNode: this.isNode(),
      isBrowser: this.isBrowser(),
      nodeVersion: this.isNode() ? process.version : null,
      userAgent: this.isBrowser() ? navigator.userAgent : null
    };
  }
}

export default OSDetector;
