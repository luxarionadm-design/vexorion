import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDraggable, createDraggable } from '../../../src/core/Draggable.js';

describe('useDraggable', () => {
  let element, draggable;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.dataset.dragHandle = 'true';
    document.body.appendChild(element);
    draggable = new useDraggable(element);
  });

  it('should initialize with position', () => {
    expect(draggable.getPosition()).toEqual({ x: 0, y: 0 });
  });

  it('should start drag on mousedown', () => {
    const event = new MouseEvent('mousedown', { button: 0 });
    element.dispatchEvent(event);
    expect(draggable.isDragging).toBe(true);
  });

  it('should not start drag on right click', () => {
    const event = new MouseEvent('mousedown', { button: 2 });
    element.dispatchEvent(event);
    expect(draggable.isDragging).toBe(false);
  });

  it('should not start drag when disabled', () => {
    draggable.setDisabled(true);
    const event = new MouseEvent('mousedown', { button: 0 });
    element.dispatchEvent(event);
    expect(draggable.isDragging).toBe(false);
  });

  it('should call onDragStart', () => {
    const onDragStart = vi.fn();
    const dragWithCallback = new useDraggable(element, { onDragStart });
    
    const event = new MouseEvent('mousedown', { button: 0 });
    element.dispatchEvent(event);
    
    expect(onDragStart).toHaveBeenCalled();
  });

  it('should set position', () => {
    draggable.setPosition(100, 200);
    expect(draggable.getPosition()).toEqual({ x: 100, y: 200 });
    expect(element.style.left).toBe('100px');
    expect(element.style.top).toBe('200px');
  });

  it('should respect axis constraint', () => {
    const axisDrag = new useDraggable(element, { axis: 'x', initialX: 0, initialY: 0 });
    
    const event = new MouseEvent('mousedown', { button: 0, clientX: 0, clientY: 0 });
    element.dispatchEvent(event);
    
    const moveEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 50 });
    document.dispatchEvent(moveEvent);
    
    expect(axisDrag.getPosition().x).toBe(100);
    expect(axisDrag.getPosition().y).toBe(0);
  });

  it('should detach', () => {
    draggable.detach();
    
    const event = new MouseEvent('mousedown', { button: 0 });
    element.dispatchEvent(event);
    expect(draggable.isDragging).toBe(false);
  });

  it('should destroy', () => {
    draggable.destroy();
    expect(draggable.element).toBeNull();
  });

  it('should create with helper', () => {
    const instance = createDraggable(element);
    expect(instance).toBeInstanceOf(useDraggable);
  });
});
