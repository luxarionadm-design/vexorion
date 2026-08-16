import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFocus, createFocus } from '../../../src/core/Focus.js';

describe('useFocus', () => {
  let element, focus;

  beforeEach(() => {
    element = document.createElement('input');
    document.body.appendChild(element);
    focus = new useFocus(element);
  });

  it('should detect focus', () => {
    const event = new FocusEvent('focus');
    element.dispatchEvent(event);
    expect(focus.isFocused).toBe(true);
  });

  it('should detect blur', () => {
    const focusEvent = new FocusEvent('focus');
    element.dispatchEvent(focusEvent);
    expect(focus.isFocused).toBe(true);

    const blurEvent = new FocusEvent('blur');
    element.dispatchEvent(blurEvent);
    expect(focus.isFocused).toBe(false);
  });

  it('should call onFocus callback', () => {
    const onFocus = vi.fn();
    const focusWithCallback = new useFocus(element, { onFocus });
    
    const event = new FocusEvent('focus');
    element.dispatchEvent(event);
    
    expect(onFocus).toHaveBeenCalled();
  });

  it('should call onBlur callback', () => {
    const onBlur = vi.fn();
    const focusWithCallback = new useFocus(element, { onBlur });
    
    const focusEvent = new FocusEvent('focus');
    element.dispatchEvent(focusEvent);
    
    const blurEvent = new FocusEvent('blur');
    element.dispatchEvent(blurEvent);
    
    expect(onBlur).toHaveBeenCalled();
  });

  it('should focus programmatically', () => {
    const spy = vi.spyOn(element, 'focus');
    focus.focus();
    expect(spy).toHaveBeenCalled();
  });

  it('should blur programmatically', () => {
    const spy = vi.spyOn(element, 'blur');
    focus.blur();
    expect(spy).toHaveBeenCalled();
  });

  it('should detach', () => {
    focus.detach();
    
    const event = new FocusEvent('focus');
    element.dispatchEvent(event);
    expect(focus.isFocused).toBe(false);
  });

  it('should destroy', () => {
    focus.destroy();
    expect(focus.element).toBeNull();
  });

  it('should set new element', () => {
    const newElement = document.createElement('input');
    focus.setElement(newElement);
    expect(focus.element).toBe(newElement);
  });

  it('should create with helper', () => {
    const instance = createFocus(element);
    expect(instance).toBeInstanceOf(useFocus);
  });
});
