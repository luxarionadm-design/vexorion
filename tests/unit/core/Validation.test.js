import { describe, it, expect, vi } from 'vitest';
import { useValidation, validationRules } from '../../../src/core/Validation.js';

describe('validationRules', () => {
  it('should validate required', () => {
    expect(validationRules.required('').isValid).toBe(false);
    expect(validationRules.required('test').isValid).toBe(true);
    expect(validationRules.required(null).isValid).toBe(false);
    expect(validationRules.required(undefined).isValid).toBe(false);
    expect(validationRules.required(0).isValid).toBe(true);
  });

  it('should validate email', () => {
    expect(validationRules.email('test@test.com').isValid).toBe(true);
    expect(validationRules.email('test@test.co.id').isValid).toBe(true);
    expect(validationRules.email('invalid').isValid).toBe(false);
    expect(validationRules.email('test@').isValid).toBe(false);
    expect(validationRules.email('@test.com').isValid).toBe(false);
  });

  it('should validate minLength', () => {
    const validator = validationRules.minLength(5);
    expect(validator('hello').isValid).toBe(true);
    expect(validator('hi').isValid).toBe(false);
    expect(validator('').isValid).toBe(false);
  });

  it('should validate maxLength', () => {
    const validator = validationRules.maxLength(5);
    expect(validator('hello').isValid).toBe(true);
    expect(validator('hello world').isValid).toBe(false);
    expect(validator('').isValid).toBe(true);
  });

  it('should validate min', () => {
    const validator = validationRules.min(10);
    expect(validator(15).isValid).toBe(true);
    expect(validator(5).isValid).toBe(false);
    expect(validator('15').isValid).toBe(true);
  });

  it('should validate max', () => {
    const validator = validationRules.max(10);
    expect(validator(5).isValid).toBe(true);
    expect(validator(15).isValid).toBe(false);
    expect(validator('5').isValid).toBe(true);
  });

  it('should validate pattern', () => {
    const validator = validationRules.pattern(/^\d+$/, 'Must be digits');
    expect(validator('123').isValid).toBe(true);
    expect(validator('abc').isValid).toBe(false);
    expect(validator('123abc').isValid).toBe(false);
  });

  it('should validate URL', () => {
    expect(validationRules.url('https://example.com').isValid).toBe(true);
    expect(validationRules.url('http://example.com').isValid).toBe(true);
    expect(validationRules.url('example.com').isValid).toBe(true);
    expect(validationRules.url('invalid').isValid).toBe(false);
  });

  it('should validate phone', () => {
    expect(validationRules.phone('08123456789').isValid).toBe(true);
    expect(validationRules.phone('+628123456789').isValid).toBe(true);
    expect(validationRules.phone('abc').isValid).toBe(false);
  });

  it('should validate number', () => {
    expect(validationRules.number('123').isValid).toBe(true);
    expect(validationRules.number('abc').isValid).toBe(false);
    expect(validationRules.number('123abc').isValid).toBe(false);
  });
});

describe('useValidation', () => {
  it('should validate entire form', () => {
    const schema = {
      name: [validationRules.required],
      email: [validationRules.required, validationRules.email]
    };
    const validator = new useValidation(schema);
    
    const result = validator.validate({
      name: '',
      email: 'invalid'
    });
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
  });

  it('should validate valid form', () => {
    const schema = {
      name: [validationRules.required],
      email: [validationRules.email]
    };
    const validator = new useValidation(schema);
    
    const result = validator.validate({
      name: 'John',
      email: 'john@test.com'
    });
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should validate single field', () => {
    const schema = {
      name: [validationRules.required]
    };
    const validator = new useValidation(schema);
    
    const result = validator.validateField('name', '');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Field ini wajib diisi');
  });

  it('should validate single field with valid value', () => {
    const schema = {
      name: [validationRules.required]
    };
    const validator = new useValidation(schema);
    
    const result = validator.validateField('name', 'John');
    expect(result.isValid).toBe(true);
  });

  it('should clear errors', () => {
    const schema = {
      name: [validationRules.required]
    };
    const validator = new useValidation(schema);
    
    validator.validate({ name: '' });
    expect(validator.getErrors()).toHaveProperty('name');
    
    validator.clearErrors();
    expect(validator.getErrors()).toEqual({});
    expect(validator.isValidForm()).toBe(true);
  });

  it('should notify subscribers', () => {
    const callback = vi.fn();
    const schema = {
      name: [validationRules.required]
    };
    const validator = new useValidation(schema);
    validator.subscribe(callback);
    
    validator.validate({ name: '' });
    expect(callback).toHaveBeenCalled();
  });

  it('should handle object rules', () => {
    const schema = {
      age: [{ type: 'min', params: 18, message: 'Must be 18+' }]
    };
    const validator = new useValidation(schema);
    
    const result = validator.validate({ age: 16 });
    expect(result.isValid).toBe(false);
    expect(result.errors.age).toBe('Must be 18+');
  });

  it('should handle custom function rules', () => {
    const schema = {
      age: [(value) => ({ isValid: value >= 18, message: 'Must be 18+' })]
    };
    const validator = new useValidation(schema);
    
    const result = validator.validate({ age: 16 });
    expect(result.isValid).toBe(false);
    expect(result.errors.age).toBe('Must be 18+');
  });

  it('should get errors', () => {
    const schema = {
      name: [validationRules.required]
    };
    const validator = new useValidation(schema);
    
    validator.validate({ name: '' });
    expect(validator.getErrors()).toHaveProperty('name');
  });

  it('should check isValidForm', () => {
    const schema = {
      name: [validationRules.required]
    };
    const validator = new useValidation(schema);
    
    validator.validate({ name: '' });
    expect(validator.isValidForm()).toBe(false);
    
    validator.validate({ name: 'John' });
    expect(validator.isValidForm()).toBe(true);
  });
});
