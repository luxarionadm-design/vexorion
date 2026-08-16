import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useForm } from '../../../src/core/Form.js';

describe('useForm', () => {
  let form;

  beforeEach(() => {
    form = new useForm({
      initialValues: { name: '', email: '' },
      validate: (values) => {
        const errors = {};
        if (!values.name) errors.name = 'Name required';
        if (!values.email) errors.email = 'Email required';
        return errors;
      }
    });
  });

  it('should initialize with default values', () => {
    expect(form.getValues()).toEqual({ name: '', email: '' });
    expect(form.getErrors()).toEqual({});
    expect(form.isValidForm()).toBe(true);
  });

  it('should handle change', () => {
    const event = { target: { name: 'name', value: 'John', type: 'text' } };
    form.handleChange(event);
    expect(form.getValues().name).toBe('John');
  });

  it('should handle checkbox', () => {
    const event = { target: { name: 'active', checked: true, type: 'checkbox' } };
    form.handleChange(event);
    expect(form.getValues().active).toBe(true);
  });

  it('should handle blur', () => {
    const event = { target: { name: 'name' } };
    form.handleBlur(event);
    expect(form.getTouched().name).toBe(true);
  });

  it('should set field value', () => {
    form.setFieldValue('name', 'Jane');
    expect(form.getValues().name).toBe('Jane');
  });

  it('should set field error', () => {
    form.setFieldError('name', 'Custom error');
    expect(form.getErrors().name).toBe('Custom error');
  });

  it('should reset form', () => {
    form.setFieldValue('name', 'John');
    form.resetForm();
    expect(form.getValues()).toEqual({ name: '', email: '' });
  });

  it('should reset with custom values', () => {
    form.resetForm({ name: 'Custom', email: 'custom@test.com' });
    expect(form.getValues()).toEqual({ name: 'Custom', email: 'custom@test.com' });
  });

  it('should submit valid form', async () => {
    const onSubmit = vi.fn();
    const formWithSubmit = new useForm({
      initialValues: { name: 'John', email: 'john@test.com' },
      onSubmit
    });

    await formWithSubmit.handleSubmit({ preventDefault: vi.fn() });
    expect(onSubmit).toHaveBeenCalledWith({ name: 'John', email: 'john@test.com' });
  });

  it('should not submit invalid form', async () => {
    const onSubmit = vi.fn();
    const formWithSubmit = new useForm({
      initialValues: { name: '', email: '' },
      validate: (values) => {
        const errors = {};
        if (!values.name) errors.name = 'Required';
        return errors;
      },
      onSubmit
    });

    await formWithSubmit.handleSubmit({ preventDefault: vi.fn() });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should handle submit error', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Submit failed'));
    const formWithSubmit = new useForm({
      initialValues: { name: 'John' },
      onSubmit
    });

    await formWithSubmit.handleSubmit({ preventDefault: vi.fn() });
    expect(formWithSubmit.getErrors().submit).toBe('Submit failed');
  });

  it('should notify subscribers', () => {
    const callback = vi.fn();
    form.subscribe(callback);
    form.setFieldValue('name', 'John');
    expect(callback).toHaveBeenCalled();
  });

  it('should unsubscribe', () => {
    const callback = vi.fn();
    const unsubscribe = form.subscribe(callback);
    unsubscribe();
    form.setFieldValue('name', 'John');
    expect(callback).not.toHaveBeenCalled();
  });

  it('should return field props', () => {
    const props = form.getFieldProps('name');
    expect(props).toHaveProperty('name', 'name');
    expect(props).toHaveProperty('value');
    expect(props).toHaveProperty('onChange');
    expect(props).toHaveProperty('onBlur');
    expect(props).toHaveProperty('error');
    expect(props).toHaveProperty('touched');
  });

  it('should validate on change when enabled', () => {
    const event = { target: { name: 'name', value: '', type: 'text' } };
    form.handleChange(event);
    expect(form.getErrors().name).toBe('Name required');
  });

  it('should validate on blur when enabled', () => {
    const event = { target: { name: 'email', value: '' } };
    form.handleBlur(event);
    expect(form.getErrors().email).toBe('Email required');
  });
});
