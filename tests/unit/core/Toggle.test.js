import { describe, it, expect, vi } from 'vitest';
import { useToggle, createToggle } from '../../../src/core/Toggle.js';

describe('useToggle', () => {
  it('should initialize with false', () => {
    const toggle = new useToggle();
    expect(toggle.get()).toBe(false);
  });

  it('should initialize with custom value', () => {
    const toggle = new useToggle(true);
    expect(toggle.get()).toBe(true);
  });

  it('should toggle value', () => {
    const toggle = new useToggle(false);
    toggle.toggle();
    expect(toggle.get()).toBe(true);
    toggle.toggle();
    expect(toggle.get()).toBe(false);
  });

  it('should set on', () => {
    const toggle = new useToggle(false);
    toggle.on();
    expect(toggle.get()).toBe(true);
  });

  it('should set off', () => {
    const toggle = new useToggle(true);
    toggle.off();
    expect(toggle.get()).toBe(false);
  });

  it('should set value', () => {
    const toggle = new useToggle(false);
    toggle.set(true);
    expect(toggle.get()).toBe(true);
  });

  it('should set with function', () => {
    const toggle = new useToggle(false);
    toggle.set((prev) => !prev);
    expect(toggle.get()).toBe(true);
  });

  it('should reset', () => {
    const toggle = new useToggle(false);
    toggle.toggle();
    toggle.reset();
    expect(toggle.get()).toBe(false);
  });

  it('should reset with custom value', () => {
    const toggle = new useToggle(false);
    toggle.toggle();
    toggle.reset(true);
    expect(toggle.get()).toBe(true);
  });

  it('should check isOn', () => {
    const toggle = new useToggle(true);
    expect(toggle.isOn()).toBe(true);
  });

  it('should check isOff', () => {
    const toggle = new useToggle(false);
    expect(toggle.isOff()).toBe(true);
  });

  it('should notify subscribers', () => {
    const callback = vi.fn();
    const toggle = new useToggle(false);
    toggle.subscribe(callback);
    toggle.toggle();
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('should unsubscribe', () => {
    const callback = vi.fn();
    const toggle = new useToggle(false);
    const unsubscribe = toggle.subscribe(callback);
    unsubscribe();
    toggle.toggle();
    expect(callback).not.toHaveBeenCalled();
  });

  it('should create toggle with helper', () => {
    const toggle = createToggle(true);
    expect(toggle.get()).toBe(true);
  });
});
