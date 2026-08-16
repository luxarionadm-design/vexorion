// src/core/Form.js
export class useForm {
  constructor(options = {}) {
    this.initialValues = options.initialValues || {};
    this.validate = options.validate || null;
    this.onSubmit = options.onSubmit || null;
    this.validateOnChange = options.validateOnChange !== undefined ? options.validateOnChange : true;
    this.validateOnBlur = options.validateOnBlur !== undefined ? options.validateOnBlur : true;
    this.values = { ...this.initialValues };
    this.errors = {};
    this.touched = {};
    this.isSubmitting = false;
    this.isValid = true;
    this.submitCount = 0;
    this._listeners = new Set();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.values, this.errors, this.touched); } catch (e) {} }); }

  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }

  _validateForm(formValues = this.values) {
    if (!this.validate) return {};
    try {
      const validationErrors = this.validate(formValues);
      this.errors = validationErrors || {};
      return validationErrors || {};
    } catch (error) { console.error('Validation error:', error); return {}; }
  }

  handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    this.values[name] = newValue;
    if (this.validateOnChange) this._validateForm(this.values);
    this._notify();
  }

  handleBlur(e) {
    const { name } = e.target;
    this.touched[name] = true;
    if (this.validateOnBlur) this._validateForm(this.values);
    this._notify();
  }

  setFieldValue(name, value) {
    this.values[name] = value;
    if (this.validateOnChange) this._validateForm(this.values);
    this._notify();
  }

  setFieldError(name, error) { this.errors[name] = error; this._notify(); }

  resetForm(newValues = this.initialValues) {
    this.values = { ...newValues };
    this.errors = {};
    this.touched = {};
    this.isSubmitting = false;
    this.submitCount = 0;
    this.isValid = true;
    this._notify();
  }

  async handleSubmit(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    this.submitCount++;
    const allTouched = Object.keys(this.values).reduce((acc, key) => { acc[key] = true; return acc; }, {});
    this.touched = allTouched;
    const validationErrors = this._validateForm(this.values);
    const hasErrors = Object.keys(validationErrors).length > 0;
    this.isValid = !hasErrors;
    if (hasErrors) {
      const firstErrorField = Object.keys(validationErrors)[0];
      if (typeof document !== 'undefined') {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) element.focus();
      }
      this._notify();
      return;
    }
    if (!this.onSubmit) { this._notify(); return; }
    this.isSubmitting = true;
    this._notify();
    try {
      await this.onSubmit(this.values);
    } catch (error) {
      console.error('Submit error:', error);
      this.errors.submit = error.message;
    } finally {
      this.isSubmitting = false;
      this._notify();
    }
  }

  getFieldProps(name) {
    return {
      name,
      value: this.values[name] !== undefined ? this.values[name] : '',
      onChange: this.handleChange.bind(this),
      onBlur: this.handleBlur.bind(this),
      error: this.errors[name],
      touched: this.touched[name],
    };
  }

  getValues() { return this.values; }
  getErrors() { return this.errors; }
  getTouched() { return this.touched; }
  isValidForm() { return this.isValid; }
  isSubmittingForm() { return this.isSubmitting; }
}

export function createForm(options = {}) {
  return new useForm(options);
}
