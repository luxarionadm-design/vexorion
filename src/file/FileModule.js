/**
 * FileModule - File Module
 * Provides file upload, reading, and validation
 */

import { Module } from '../../core/Module.js';
import { FileError } from '../../shared/errors.js';
import { formatFileSize } from '../../utils/formatters.js';

export class FileModule extends Module {
  /**
   * Private fields
   */
  #maxSize = 10485760; // 10MB
  #allowedTypes = [];
  #maxFiles = 10;

  /**
   * Constructor
   * @param {Object} config - File configuration
   * @param {number} config.maxSize - Maximum file size in bytes
   * @param {Array} config.allowedTypes - Allowed MIME types
   * @param {number} config.maxFiles - Maximum number of files
   */
  constructor(config = {}) {
    super('FileModule', config);
    
    this.#maxSize = config.maxSize || 10485760;
    this.#allowedTypes = config.allowedTypes || [];
    this.#maxFiles = config.maxFiles || 10;
  }

  /**
   * Validate a file
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile(file, options = {}) {
    const result = {
      valid: true,
      errors: []
    };

    // Check if file exists
    if (!file || !(file instanceof File)) {
      result.valid = false;
      result.errors.push('Invalid file object');
      return result;
    }

    // Check file size
    const maxSize = options.maxSize || this.#maxSize;
    if (file.size > maxSize) {
      result.valid = false;
      result.errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum (${formatFileSize(maxSize)})`);
    }

    // Check file type
    const allowedTypes = options.allowedTypes || this.#allowedTypes;
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      result.valid = false;
      result.errors.push(`File type "${file.type}" is not allowed`);
    }

    return result;
  }

  /**
   * Validate multiple files
   * @param {FileList} files - Files to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFiles(files, options = {}) {
    const result = {
      valid: true,
      errors: [],
      files: []
    };

    if (!files || files.length === 0) {
      result.valid = false;
      result.errors.push('No files provided');
      return result;
    }

    const maxFiles = options.maxFiles || this.#maxFiles;
    if (files.length > maxFiles) {
      result.valid = false;
      result.errors.push(`Too many files (${files.length}). Maximum: ${maxFiles}`);
    }

    for (let i = 0; i < files.length; i++) {
      const fileResult = this.validateFile(files[i], options);
      result.files.push({
        file: files[i],
        valid: fileResult.valid,
        errors: fileResult.errors
      });
      if (!fileResult.valid) {
        result.valid = false;
      }
    }

    return result;
  }

  /**
   * Read file as text
   * @param {File} file - File to read
   * @returns {Promise<string>} File content as text
   */
  readAsText(file) {
    return new Promise((resolve, reject) => {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        reject(new FileError('Invalid file', { errors: validation.errors }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        this.emit('read', { file, result: event.target.result });
        resolve(event.target.result);
      };
      reader.onerror = () => {
        reject(new FileError('Failed to read file as text'));
      };
      reader.readAsText(file);
    });
  }

  /**
   * Read file as data URL
   * @param {File} file - File to read
   * @returns {Promise<string>} File as data URL
   */
  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        reject(new FileError('Invalid file', { errors: validation.errors }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        this.emit('read', { file, result: event.target.result });
        resolve(event.target.result);
      };
      reader.onerror = () => {
        reject(new FileError('Failed to read file as data URL'));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Read file as array buffer
   * @param {File} file - File to read
   * @returns {Promise<ArrayBuffer>} File as array buffer
   */
  readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const validation = this.validateFile(file);
      if (!validation.valid) {
        reject(new FileError('Invalid file', { errors: validation.errors }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        this.emit('read', { file, result: event.target.result });
        resolve(event.target.result);
      };
      reader.onerror = () => {
        reject(new FileError('Failed to read file as array buffer'));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Upload a file
   * @param {File} file - File to upload
   * @param {string} url - Upload URL
   * @param {Object} options - Upload options
   * @param {Object} options.headers - Additional headers
   * @param {Function} options.onProgress - Progress callback
   * @returns {Promise<Object>} Upload response
   */
  async upload(file, url, options = {}) {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new FileError('Invalid file', { errors: validation.errors });
    }

    const formData = new FormData();
    formData.append('file', file);

    const fetchOptions = {
      method: 'POST',
      body: formData,
      headers: options.headers || {}
    };

    // Add progress tracking
    if (options.onProgress && typeof options.onProgress === 'function') {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100)
          };
          options.onProgress(progress);
          this.emit('progress', { file, progress });
        }
      });

      return new Promise((resolve, reject) => {
        xhr.open('POST', url);
        
        // Set headers
        for (const [key, value] of Object.entries(fetchOptions.headers)) {
          xhr.setRequestHeader(key, value);
        }
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              this.emit('upload', { file, response });
              resolve(response);
            } catch {
              resolve(xhr.responseText);
            }
          } else {
            reject(new FileError(`Upload failed: ${xhr.status}`, { status: xhr.status }));
          }
        };
        
        xhr.onerror = () => {
          reject(new FileError('Upload failed due to network error'));
        };
        
        xhr.send(formData);
      });
    }

    // Fallback to fetch if no progress callback
    try {
      const response = await fetch(url, fetchOptions);
      if (!response.ok) {
        throw new FileError(`Upload failed: ${response.status}`);
      }
      const result = await response.json();
      this.emit('upload', { file, result });
      return result;
    } catch (error) {
      throw new FileError('Upload failed', { error: error.message });
    }
  }

  /**
   * Upload multiple files
   * @param {FileList} files - Files to upload
   * @param {string} url - Upload URL
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Upload responses
   */
  async uploadMultiple(files, url, options = {}) {
    const results = [];
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append(`file_${i}`, files[i]);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: options.headers || {}
      });
      
      if (!response.ok) {
        throw new FileError(`Upload failed: ${response.status}`);
      }
      
      const result = await response.json();
      this.emit('upload_multiple', { files, result });
      return result;
    } catch (error) {
      throw new FileError('Multiple upload failed', { error: error.message });
    }
  }

  /**
   * Set max file size
   * @param {number} maxSize - Maximum file size in bytes
   * @returns {FileModule} This instance for chaining
   */
  setMaxSize(maxSize) {
    if (maxSize < 0) {
      throw new FileError('Max size must be non-negative');
    }
    this.#maxSize = maxSize;
    return this;
  }

  /**
   * Get max file size
   * @returns {number} Current max file size
   */
  getMaxSize() {
    return this.#maxSize;
  }

  /**
   * Set allowed file types
   * @param {Array} allowedTypes - Allowed MIME types
   * @returns {FileModule} This instance for chaining
   */
  setAllowedTypes(allowedTypes) {
    this.#allowedTypes = allowedTypes || [];
    return this;
  }

  /**
   * Get allowed file types
   * @returns {Array} Current allowed types
   */
  getAllowedTypes() {
    return [...this.#allowedTypes];
  }

  /**
   * Set max number of files
   * @param {number} maxFiles - Maximum number of files
   * @returns {FileModule} This instance for chaining
   */
  setMaxFiles(maxFiles) {
    if (maxFiles < 0) {
      throw new FileError('Max files must be non-negative');
    }
    this.#maxFiles = maxFiles;
    return this;
  }

  /**
   * Get max number of files
   * @returns {number} Current max files
   */
  getMaxFiles() {
    return this.#maxFiles;
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.removeAllListeners();
  }
}
