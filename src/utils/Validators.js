/**
 * Validators - Validation Functions
 * Reusable validation utilities for forms and data
 */

/**
 * Check if value is a string
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is a string
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is a number
 */
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a boolean
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is a boolean
 */
export function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * Check if value is an array
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is an array
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Check if value is an object
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is an object
 */
export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if value is a function
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is a function
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Check if value is a Date
 * @param {any} value - Value to check
 * @returns {boolean} Whether value is a Date
 */
export function isDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if string is empty
 * @param {string} str - String to check
 * @returns {boolean} Whether string is empty
 */
export function isEmptyString(str) {
  return !str || str.trim().length === 0;
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 */
export function isValidURL(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @param {string} country - Country code (default: 'US')
 * @returns {boolean} Whether phone number is valid
 */
export function isValidPhone(phone, country = 'US') {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  const patterns = {
    US: /^[+]?[0-9]{10,12}$/,
    ID: /^[+]?[0-9]{10,13}$/
  };
  
  const pattern = patterns[country] || patterns.US;
  return pattern.test(phone.replace(/[-\s()]/g, ''));
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length
 * @param {number} options.maxLength - Maximum length
 * @param {boolean} options.requireUppercase - Require uppercase
 * @param {boolean} options.requireLowercase - Require lowercase
 * @param {boolean} options.requireNumber - Require number
 * @param {boolean} options.requireSpecial - Require special character
 * @returns {Object} Validation result
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 8,
    maxLength = 32,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true
  } = options;
  
  const result = {
    valid: true,
    errors: []
  };
  
  if (!password || typeof password !== 'string') {
    result.valid = false;
    result.errors.push('Password is required');
    return result;
  }
  
  if (password.length < minLength) {
    result.valid = false;
    result.errors.push(`Password must be at least ${minLength} characters`);
  }
  
  if (password.length > maxLength) {
    result.valid = false;
    result.errors.push(`Password must be less than ${maxLength} characters`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    result.valid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    result.valid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumber && !/[0-9]/.test(password)) {
    result.valid = false;
    result.errors.push('Password must contain at least one number');
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.valid = false;
    result.errors.push('Password must contain at least one special character');
  }
  
  return result;
}

/**
 * Validate required fields
 * @param {Object} data - Data to validate
 * @param {Array} fields - Required fields
 * @returns {Object} Validation result
 */
export function validateRequired(data, fields) {
  const result = {
    valid: true,
    errors: {}
  };
  
  for (const field of fields) {
    const value = data[field];
    if (value === undefined || value === null || value === '') {
      result.valid = false;
      result.errors[field] = `${field} is required`;
    }
  }
  
  return result;
}

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} Whether number is in range
 */
export function isInRange(value, min, max) {
  if (!isNumber(value)) {
    return false;
  }
  return value >= min && value <= max;
}

/**
 * Validate array length
 * @param {Array} array - Array to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {boolean} Whether array length is valid
 */
export function isValidArrayLength(array, min = 0, max = Infinity) {
  if (!Array.isArray(array)) {
    return false;
  }
  return array.length >= min && array.length <= max;
}
