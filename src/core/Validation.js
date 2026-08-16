// src/core/Validation.js
export const validationRules = {
  required: (value) => ({ isValid: value !== undefined && value !== null && value !== '', message: 'Field ini wajib diisi' }),
  email: (value) => ({ isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Email tidak valid' }),
  minLength: (min) => (value) => ({ isValid: String(value || '').length >= min, message: `Minimal ${min} karakter` }),
  maxLength: (max) => (value) => ({ isValid: String(value || '').length <= max, message: `Maksimal ${max} karakter` }),
  min: (min) => (value) => ({ isValid: Number(value) >= min, message: `Nilai minimal ${min}` }),
  max: (max) => (value) => ({ isValid: Number(value) <= max, message: `Nilai maksimal ${max}` }),
  pattern: (pattern, message) => (value) => ({ isValid: pattern.test(value), message: message || 'Format tidak valid' }),
  confirm: (field) => (value, values) => ({ isValid: value === (values ? values[field] : undefined), message: `Harus sama dengan ${field}` }),
  url: (value) => ({ isValid: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value), message: 'URL tidak valid' }),
  phone: (value) => ({ isValid: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value), message: 'Nomor telepon tidak valid' }),
  number: (value) => ({ isValid: /^\d+$/.test(String(value)), message: 'Harus berupa angka' }),
};

export class useValidation {
  constructor(schema = {}) {
    this.schema = schema;
    this.errors = {};
    this.isValid = true;
    this._listeners = new Set();
  }

  _notify() { this._listeners.forEach(cb => { try { cb(this.errors, this.isValid); } catch (e) {} }); }
  subscribe(callback) { this._listeners.add(callback); return () => this._listeners.delete(callback); }

  validate(values) {
    const newErrors = {};
    let valid = true;
    for (const [field, fieldRules] of Object.entries(this.schema)) {
      const value = values ? values[field] : undefined;
      for (const rule of fieldRules) {
        let result;
        if (typeof rule === 'function') {
          result = rule(value, values);
        } else if (typeof rule === 'object') {
          const { type, params, message } = rule;
          const ruleFn = validationRules[type];
          if (ruleFn) {
            const validator = params !== undefined ? ruleFn(params) : ruleFn;
            result = validator(value, values);
            if (result && result.isValid === false && message) result.message = message;
          }
        }
        if (result && !result.isValid) {
          newErrors[field] = result.message;
          valid = false;
          break;
        }
      }
    }
    this.errors = newErrors;
    this.isValid = valid;
    this._notify();
    return { isValid: valid, errors: newErrors };
  }

  validateField(field, value, values) {
    const fieldRules = this.schema[field];
    if (!fieldRules) return { isValid: true };
    for (const rule of fieldRules) {
      let result;
      if (typeof rule === 'function') {
        result = rule(value, values);
      } else if (typeof rule === 'object') {
        const { type, params, message } = rule;
        const ruleFn = validationRules[type];
        if (ruleFn) {
          const validator = params !== undefined ? ruleFn(params) : ruleFn;
          result = validator(value, values);
          if (result && result.isValid === false && message) result.message = message;
        }
      }
      if (result && !result.isValid) {
        this.errors[field] = result.message;
        this.isValid = false;
        this._notify();
        return { isValid: false, message: result.message };
      }
    }
    delete this.errors[field];
    this.isValid = Object.keys(this.errors).length === 0;
    this._notify();
    return { isValid: true };
  }

  clearErrors() { this.errors = {}; this.isValid = true; this._notify(); }
  getErrors() { return this.errors; }
  isValidForm() { return this.isValid; }
}

export function createValidation(schema = {}) {
  return new useValidation(schema);
}
