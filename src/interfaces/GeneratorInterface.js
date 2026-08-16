/**
 * Interface for all UUID generators
 * @interface GeneratorInterface
 */
export class GeneratorInterface {
  /**
   * Generate a UUID
   * @param {Object} options - Generation options
   * @returns {string} Generated UUID
   */
  generate(options = {}) {
    throw new Error('generate() must be implemented by subclass');
  }

  /**
   * Get generator version (e.g., 'v4', 'v7')
   * @returns {string} Version string
   */
  getVersion() {
    throw new Error('getVersion() must be implemented by subclass');
  }

  /**
   * Get generator name
   * @returns {string} Generator name
   */
  getName() {
    throw new Error('getName() must be implemented by subclass');
  }

  /**
   * Validate options before generation
   * @param {Object} options - Options to validate
   * @returns {Object} Validated options
   */
  validateOptions(options) {
    return options || {};
  }
}

export default GeneratorInterface;
