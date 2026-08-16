/**
 * FormModule - Form Management Module
 * Handles form state, validation, and submission
 */

import { Module } from '../../core/Module.js';
import { Observable } from '../../core/Observable.js';
import { VexorionError } from '../../shared/errors.js';

export class FormModule extends Module {
  /**
   * Private fields
   */
  #initialValues = {};
  #values = {};
  #errors = {};
  #touched = {};
  #isDirty = false;
  #isValid = true;
  #isSubmitting = false;
  #validate = null;
  #onSubmit = null;
  #validateOnChange = false;
  #observable = null;

  /**
   * Constructor
   * @param {Object} config - Form configuration
   * @param {Object} config.initialValues - Initial form values
   * @param {Function} config.validate - Validation function
   * @param {Function} config.onSubmit - Submit handler
   * @param {boolean} config.validateOnChange - Validate on change
   */
  constructor(config = {}) {
    super('FormModule', config);
    
    this.#initialValues = { ...config.initialValues };
    this.#values = { ...config.initialValues };
    this.#validate = config.validate || (() => ({}));
    this.#onSubmit = config.onSubmit || (() => {});
    this.#validateOnChange = config.validateOnChange || false;
    this.#observable = new Observable({ ...this.#values });
    
    if (this.#validateOnChange) {
      this.#validateForm();
    }
  }

  /**
   * Validate form
   * @param {Object} values - Values to validate
   * @returns {Object} Validation errors
   */
  #validateForm(values = this.#values) {
    try {
      this.#errors = this.#validate(values) || {};
      this.#isValid = Object.keys(this.#errors).length === 0;
      this.#observable.setValue({ ...this.#values });
      return this.#errors;
    } catch (error) {
      throw new VexorionError(
        'Validation error: ' + error.message,
        'VALIDATION_ERROR'
      );
    }
  }

  /**
   * Get current form values
   * @returns {Object} Current values
   */
  getValues() {
    return { ...this.#values };
  }

  /**
   * Get current form errors
   * @returns {Object} Current errors
   */
  getErrors() {
    return { ...this.#errors };
  }

  /**
   * Get error for specific field
   * @param {string} field - Field name
   * @returns {string|null} Error message or null
   */
  getFieldError(field) {
    return this.#errors[field] || null;
  }

  /**
   * Check if field has error
   * @param {string} field - Field name
   * @returns {boolean} Whether field has error
   */
  hasFieldError(field) {
    return !!this.#errors[field];
  }

  /**
   * Check if field is touched
   * @param {string} field - Field name
   * @returns {boolean} Whether field is touched
   */
  isFieldTouched(field) {
    return !!this.#touched[field];
  }

  /**
   * Check if form is dirty
   * @returns {boolean} Whether form is dirty
   */
  isDirty() {
    return this.#isDirty;
  }

  /**
   * Check if form is valid
   * @returns {boolean} Whether form is valid
   */
  isValid() {
    return this.#isValid;
  }

  /**
   * Check if form is submitting
   * @returns {boolean} Whether form is submitting
   */
  isSubmitting() {
    return this.#isSubmitting;
  }

  /**
   * Handle field change
   * @param {Event} event - Input event
   */
  handleChange(event) {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    this.setFieldValue(name, fieldValue);
    
    if (this.#validateOnChange) {
      this.#validateForm();
    }
  }

  /**
   * Set field value
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  setFieldValue(field, value) {
    this.#values[field] = value;
    this.#isDirty = true;
    this.#touched[field] = true;
    this.#observable.setValue({ ...this.#values });
  }

  /**
   * Set multiple field values
   * @param {Object} values - Values to set
   */
  setValues(values) {
    this.#values = { ...this.#values, ...values };
    this.#isDirty = true;
    this.#observable.setValue({ ...this.#values });
    
    if (this.#validateOnChange) {
      this.#validateForm();
    }
  }

  /**
   * Reset form to initial values
   */
  reset() {
    this.#values = { ...this.#initialValues };
    this.#errors = {};
    this.#touched = {};
    this.#isDirty = false;
    this.#isValid = true;
    this.#observable.setValue({ ...this.#values });
  }

  /**
   * Submit form
   * @param {Event} event - Submit event
   */
  async handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched
    for (const key in this.#values) {
      this.#touched[key] = true;
    }

    // Validate form
    this.#validateForm();
    
    if (!this.#isValid) {
      this.emit('invalid', this.#errors);
      return;
    }

    this.#isSubmitting = true;
    this.emit('submitting', this.#values);

    try {
      await this.#onSubmit(this.#values);
      this.emit('success', this.#values);
    } catch (error) {
      this.emit('error', error);
      throw error;
    } finally {
      this.#isSubmitting = false;
    }
  }

  /**
   * Subscribe to form changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    return this.#observable.subscribe(callback);
  }

  /**
   * Get observable for a specific field
   * @param {string} field - Field name
   * @returns {Observable} Field observable
   */
  getFieldObservable(field) {
    const fieldObservable = new Observable(this.#values[field]);
    this.#observable.subscribe((values) => {
      fieldObservable.setValue(values[field]);
    });
    return fieldObservable;
  }

  /**
   * Lifecycle - Destroy module
   */
  onDestroy() {
    this.#values = {};
    this.#errors = {};
    this.#touched = {};
    this.#observable.unsubscribeAll();
    this.removeAllListeners();
  }
}
