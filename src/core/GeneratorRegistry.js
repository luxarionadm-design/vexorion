/**
 * Registry for managing UUID generators
 * Implements Registry pattern with lazy loading
 */
export class GeneratorRegistry {
  constructor() {
    this._generators = new Map();
    this._aliases = new Map();
    this._instances = new Map();
    this._defaultGenerator = null;
  }

  /**
   * Register a generator class
   * @param {string} name - Generator name
   * @param {Function} GeneratorClass - Generator class
   * @param {Object} options - Registration options
   * @param {boolean} options.default - Set as default
   * @param {string[]} options.aliases - Aliases for this generator
   * @returns {GeneratorRegistry} Self for chaining
   */
  register(name, GeneratorClass, options = {}) {
    if (typeof GeneratorClass !== 'function') {
      throw new Error('Generator must be a class');
    }
    this._generators.set(name, GeneratorClass);
    if (options.default) {
      this._defaultGenerator = name;
    }
    if (options.aliases) {
      options.aliases.forEach(alias => {
        this._aliases.set(alias, name);
      });
    }
    return this;
  }

  /**
   * Get generator instance (lazy loaded)
   * @param {string} name - Generator name or alias
   * @returns {Object} Generator instance
   */
  get(name) {
    const resolvedName = this._aliases.get(name) || name;
    if (!this._generators.has(resolvedName)) {
      throw new Error(`Generator "${name}" not found. Available: ${this.list().join(', ')}`);
    }
    if (!this._instances.has(resolvedName)) {
      const GeneratorClass = this._generators.get(resolvedName);
      this._instances.set(resolvedName, new GeneratorClass());
    }
    return this._instances.get(resolvedName);
  }

  /**
   * Get default generator
   * @returns {Object} Default generator instance
   */
  getDefault() {
    if (!this._defaultGenerator) {
      throw new Error('No default generator registered');
    }
    return this.get(this._defaultGenerator);
  }

  /**
   * List all registered generator names
   * @returns {string[]} Array of names
   */
  list() {
    return Array.from(this._generators.keys());
  }

  /**
   * Check if generator exists
   * @param {string} name - Generator name
   * @returns {boolean} True if exists
   */
  has(name) {
    const resolvedName = this._aliases.get(name) || name;
    return this._generators.has(resolvedName);
  }

  /**
   * Unregister a generator
   * @param {string} name - Generator name
   * @returns {GeneratorRegistry} Self for chaining
   */
  unregister(name) {
    const resolvedName = this._aliases.get(name) || name;
    this._generators.delete(resolvedName);
    this._instances.delete(resolvedName);
    if (this._defaultGenerator === resolvedName) {
      this._defaultGenerator = null;
    }
    return this;
  }

  /**
   * Clear all registrations
   * @returns {GeneratorRegistry} Self for chaining
   */
  clear() {
    this._generators.clear();
    this._aliases.clear();
    this._instances.clear();
    this._defaultGenerator = null;
    return this;
  }

  /**
   * Set default generator
   * @param {string} name - Generator name
   * @returns {GeneratorRegistry} Self for chaining
   */
  setDefault(name) {
    if (!this.has(name)) {
      throw new Error(`Generator "${name}" not found`);
    }
    this._defaultGenerator = name;
    return this;
  }
}

export default GeneratorRegistry;
