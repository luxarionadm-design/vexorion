/**
 * Custom Errors - Shared Error Classes
 * Provides consistent error handling across the library
 */

import { ERROR_CODES } from './constants.js';

export class VexorionError extends Error {
  /**
   * Private fields
   */
  #code = '';
  #details = null;
  #timestamp = null;

  /**
   * Constructor
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {Object} details - Additional error details
   */
  constructor(message, code = ERROR_CODES.INVALID_CONFIG, details = null) {
    super(message);
    this.name = 'VexorionError';
    this.#code = code;
    this.#details = details;
    this.#timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VexorionError);
    }
  }

  /**
   * Get error code
   * @returns {string} Error code
   */
  getCode() {
    return this.#code;
  }

  /**
   * Get error details
   * @returns {Object} Error details
   */
  getDetails() {
    return this.#details;
  }

  /**
   * Get timestamp
   * @returns {string} ISO timestamp
   */
  getTimestamp() {
    return this.#timestamp;
  }

  /**
   * Convert error to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.#code,
      details: this.#details,
      timestamp: this.#timestamp,
      stack: this.stack
    };
  }

  /**
   * String representation
   * @returns {string} String representation
   */
  toString() {
    return `${this.name}[${this.#code}]: ${this.message}`;
  }
}

export class ValidationError extends VexorionError {
  /**
   * Constructor
   * @param {string} message - Error message
   * @param {Object} details - Validation details
   */
  constructor(message, details = null) {
    super(message, ERROR_CODES.VALIDATION_ERROR, details);
    this.name = 'ValidationError';
  }
}

export class StorageError extends VexorionError {
  /**
   * Constructor
   * @param {string} message - Error message
   * @param {Object} details - Storage details
   */
  constructor(message, details = null) {
    super(message, ERROR_CODES.STORAGE_ERROR, details);
    this.name = 'StorageError';
  }
}

export class EncryptionError extends VexorionError {
  /**
   * Constructor
   * @param {string} message - Error message
   * @param {Object} details - Encryption details
   */
  constructor(message, details = null) {
    super(message, ERROR_CODES.ENCRYPTION_ERROR, details);
    this.name = 'EncryptionError';
  }
}

export class TokenError extends VexorionError {
  /**
   * Constructor
   * @param {string} message - Error message
   * @param {Object} details - Token details
   */
  constructor(message, details = null) {
    super(message, ERROR_CODES.TOKEN_ERROR, details);
    this.name = 'TokenError';
  }
}

export class WebSocketError extends VexorionError {
  /**
   * Constructor
   * @param {string} message - Error message
   * @param {Object} details - WebSocket details
   */
  constructor(message, details = null) {
    super(message, ERROR_CODES.WEBSOCKET_ERROR, details);
    this.name = 'WebSocketError';
  }
}

export class FileError extends VexorionError {
  /**
   * Constructor
   * @param {string} message - Error message
   * @param {Object} details - File details
   */
  constructor(message, details = null) {
    super(message, ERROR_CODES.FILE_ERROR, details);
    this.name = 'FileError';
  }
}
