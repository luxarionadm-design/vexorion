import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHover, createHover } from '../../../src/core/Hover.js';

describe('useHover', () => {
  let element, hover;

  beforeEach(() => {
    vi.useFakeTimers();
    element = document.createElement('div');
    document.body.appendChild(element);
    hover = new useHover(element);
  });

  it('should detect hover enter', () => {
    const event = new MouseEvent('mouseenter');
    element.dispatchEvent(event);
    expect(hover.isHovered).toBe(true);
  });

  it('should detect hover leave', () => {
    const enterEvent = new MouseEvent('mouseenter');
    element.dispatchEvent(enterEvent);
    expect(hover.isHovered).toBe(true);

    const leaveEvent = new MouseEvent('mouseleave');
    element.dispatchEvent(leaveEvent);
    expect(hover.isHovered).toBe(false);
  });

  it('should call onEnter callback', () => {
    const onEnter = vi.fn();
    const hoverWithCallback = new useHover(element, { onEnter });
    
    const event = new MouseEvent('mouseenter');
    element.dispatchEvent(event);
    
    expect(onEnter).toHaveBeenCalled();
  });

  it('should call onLeave callback', () => {
    const onLeave = vi.fn();
    const hoverWithCallback = new useHover(element, { onLeave });
    
    const enterEvent = new MouseEvent('mouseenter');
    element.dispatchEvent(enterEvent);
    
    const leaveEvent = new MouseEvent('mouseleave');
    element.dispatchEvent(leaveEvent);
    
    expect(onLeave).toHaveBeenCalled();
  });

  it('should use enter delay', () => {
    const onEnter = vi.fn();
    const hoverWithDelay = new useHover(element, { enterDelay: 500, onEnter });
    
    const event = new MouseEvent('mouseenter');
    element.dispatchEvent(event);
    expect(onEnter).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(500);
    expect(onEnter).toHaveBeenCalled();
  });

  it('should use leave delay', () => {
    const onLeave = vi.fn();
    const hoverWithDelay = new useHover(element, { leaveDelay: 500, onLeave });
    
    const enterEvent = new MouseEvent('mouseenter');
    element.dispatchEvent(enterEvent);
    
    const leaveEvent = new MouseEvent('mouseleave');
    element.dispatchEvent(leaveEvent);
    expect(onLeave).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(500);
    expect(onLeave).toHaveBeenCalled();
  });

  it('should cancel enter delay on leave', () => {
    const onEnter = vi.fn();
    const hoverWithDelay = new useHover(element, { enterDelay: 500, onEnter });
    
    const enterEvent = new MouseEvent('mouseenter');
    element.dispatchEvent(enterEvent);
    
    const leaveEvent = new MouseEvent('mouseleave');
    element.dispatchEvent(leaveEvent);
    
    vi.advanceTimersByTime(500);
    expect(onEnter).not.toHaveBeenCalled();
  });

  it('should detach', () => {
    hover.detach();
    
    const event = new MouseEvent('mouseenter');
    element.dispatchEvent(event);
    expect(hover.isHovered).toBe(false);
  });

  it('should destroy', () => {
    hover.destroy();
    expect(hover.element).toBeNull();
  });

  it('should set new element', () => {
    const newElement = document.createElement('div');
    hover.setElement(newElement);
    expect(hover.element).toBe(newElement);
  });

  it('should create with helper', () => {
    const instance = createHover(element);
    expect(instance).toBeInstanceOf(useHover);
  });
});
