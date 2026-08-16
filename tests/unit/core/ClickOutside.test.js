import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClickOutside, createClickOutside } from '../../../src/core/ClickOutside.js';

describe('useClickOutside', () => {
  let element, handler, clickOutside;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    handler = vi.fn();
    clickOutside = new useClickOutside(element, handler);
  });

  it('should trigger handler when clicking outside', () => {
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('mousedown', { target: outsideElement });
    document.dispatchEvent(event);
    
    expect(handler).toHaveBeenCalled();
  });

  it('should not trigger when clicking inside', () => {
    const event = new MouseEvent('mousedown', { target: element });
    element.dispatchEvent(event);
    
    expect(handler).not.toHaveBeenCalled();
  });

  it('should exclude selectors', () => {
    clickOutside.addExclude('.exclude');
    const excluded = document.createElement('div');
    excluded.className = 'exclude';
    document.body.appendChild(excluded);
    
    const event = new MouseEvent('mousedown', { target: excluded });
    document.dispatchEvent(event);
    
    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove exclude selector', () => {
    clickOutside.addExclude('.exclude');
    clickOutside.removeExclude('.exclude');
    
    const excluded = document.createElement('div');
    excluded.className = 'exclude';
    document.body.appendChild(excluded);
    
    const event = new MouseEvent('mousedown', { target: excluded });
    document.dispatchEvent(event);
    
    expect(handler).toHaveBeenCalled();
  });

  it('should enable/disable', () => {
    clickOutside.setEnabled(false);
    
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('mousedown', { target: outsideElement });
    document.dispatchEvent(event);
    
    expect(handler).not.toHaveBeenCalled();
    
    clickOutside.setEnabled(true);
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalled();
  });

  it('should detach', () => {
    clickOutside.detach();
    
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('mousedown', { target: outsideElement });
    document.dispatchEvent(event);
    
    expect(handler).not.toHaveBeenCalled();
  });

  it('should destroy', () => {
    clickOutside.destroy();
    
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('mousedown', { target: outsideElement });
    document.dispatchEvent(event);
    
    expect(handler).not.toHaveBeenCalled();
    expect(clickOutside.element).toBeNull();
    expect(clickOutside.handler).toBeNull();
  });

  it('should create with helper', () => {
    const instance = createClickOutside(element, handler);
    expect(instance).toBeInstanceOf(useClickOutside);
  });

  it('should use custom event type', () => {
    const customHandler = vi.fn();
    const custom = new useClickOutside(element, customHandler, { eventType: 'click' });
    
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);
    
    const event = new MouseEvent('click', { target: outsideElement });
    document.dispatchEvent(event);
    
    expect(customHandler).toHaveBeenCalled();
  });
});
