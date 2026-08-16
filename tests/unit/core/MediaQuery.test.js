import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMediaQuery, createMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode, useIsPortrait } from '../../../src/core/MediaQuery.js';

describe('useMediaQuery', () => {
  let mediaQuery;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    };
    window.matchMedia = vi.fn().mockReturnValue(mockMediaQueryList);
    mediaQuery = new useMediaQuery('(max-width: 768px)');
  });

  it('should initialize with default matches', () => {
    const mq = new useMediaQuery('(max-width: 768px)', { defaultMatches: true });
    expect(mq.get()).toBe(true);
  });

  it('should attach media query', () => {
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('should notify subscribers on change', () => {
    const callback = vi.fn();
    mediaQuery.subscribe(callback);
    
    const mockEvent = { matches: true };
    mediaQuery._handleChange(mockEvent);
    
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('should detach', () => {
    mediaQuery.detach();
    const mockMediaQueryList = window.matchMedia('(max-width: 768px)');
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
  });

  it('should destroy', () => {
    mediaQuery.destroy();
    expect(mediaQuery._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createMediaQuery('(max-width: 768px)');
    expect(instance).toBeInstanceOf(useMediaQuery);
  });

  it('should use predefined mobile query', () => {
    const mobile = useIsMobile();
    expect(mobile.query).toBe('(max-width: 767px)');
  });

  it('should use predefined tablet query', () => {
    const tablet = useIsTablet();
    expect(tablet.query).toBe('(min-width: 768px) and (max-width: 1023px)');
  });

  it('should use predefined desktop query', () => {
    const desktop = useIsDesktop();
    expect(desktop.query).toBe('(min-width: 1024px)');
  });

  it('should use predefined dark mode query', () => {
    const darkMode = useIsDarkMode();
    expect(darkMode.query).toBe('(prefers-color-scheme: dark)');
  });

  it('should use predefined portrait query', () => {
    const portrait = useIsPortrait();
    expect(portrait.query).toBe('(orientation: portrait)');
  });
});
