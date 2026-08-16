import { describe, it, expect } from 'vitest';
import Vexorion, * as exports from '../../src/index.js';

describe('Vexorion Entry Point', () => {
  it('should export all modules', () => {
    const modules = [
      'useFetch', 'useFetchError',
      'useLocalStorage', 'useSessionStorage',
      'useCookie',
      'useDebounce', 'createDebounce',
      'useThrottle', 'createThrottle',
      'useMemoize', 'createMemoize',
      'useToggle', 'createToggle',
      'useClickOutside', 'createClickOutside',
      'useHover', 'createHover',
      'useFocus', 'createFocus',
      'useScroll', 'createScroll',
      'useDraggable', 'createDraggable',
      'useForm', 'createForm',
      'useValidation', 'createValidation', 'validationRules',
      'useMediaQuery', 'createMediaQuery', 'useIsMobile', 'useIsTablet', 'useIsDesktop', 'useIsDarkMode', 'useIsPortrait',
      'useWindowSize', 'createWindowSize',
      'useGeolocation', 'createGeolocation',
      'useInterval', 'createInterval',
      'useTimeout', 'createTimeout',
      'useCountdown', 'createCountdown',
      'useLogger', 'createLogger',
      'useCache', 'createCache',
      'useQueue', 'createQueue',
      'useEventEmitter', 'createEventEmitter',
      'useEncryption', 'createEncryption',
      'useHash', 'createHash',
      'useToken', 'createToken',
      'useFileUpload', 'createFileUpload',
      'useFileReader', 'createFileReader',
      'useWebSocket', 'createWebSocket',
      'useSSE', 'createSSE',
      'usePolling', 'createPolling',
      'useProfiler', 'createProfiler',
      'useTimer', 'createTimer'
    ];

    modules.forEach(module => {
      expect(exports[module]).toBeDefined();
    });
  });

  describe('Vexorion class', () => {
    it('should create instance', () => {
      const vex = new Vexorion();
      expect(vex).toBeInstanceOf(Vexorion);
    });

    it('should lazy load instances', () => {
      const vex = new Vexorion({ prefix: 'app' });
      
      const fetch1 = vex.fetch();
      const fetch2 = vex.fetch();
      
      expect(fetch1).toBe(fetch2);
      expect(vex.getInstance('fetch')).toBe(fetch1);
    });

    it('should create new instances for non-singleton methods', () => {
      const vex = new Vexorion();
      
      const toggle1 = vex.toggle();
      const toggle2 = vex.toggle();
      
      expect(toggle1).not.toBe(toggle2);
    });

    it('should clear all instances', () => {
      const vex = new Vexorion();
      vex.fetch();
      vex.localStorage();
      
      expect(vex.getInstance('fetch')).toBeDefined();
      expect(vex.getInstance('localStorage')).toBeDefined();
      
      vex.clearInstances();
      
      expect(vex.getInstance('fetch')).toBeNull();
      expect(vex.getInstance('localStorage')).toBeNull();
    });

    it('should create all utility instances', () => {
      const vex = new Vexorion();
      
      expect(vex.fetch()).toBeDefined();
      expect(vex.localStorage()).toBeDefined();
      expect(vex.sessionStorage()).toBeDefined();
      expect(vex.cookie()).toBeDefined();
      expect(vex.debounce()).toBeDefined();
      expect(vex.throttle()).toBeDefined();
      expect(vex.memoize()).toBeDefined();
      expect(vex.toggle()).toBeDefined();
      expect(vex.clickOutside(document.createElement('div'), () => {})).toBeDefined();
      expect(vex.hover(document.createElement('div'))).toBeDefined();
      expect(vex.focus(document.createElement('input'))).toBeDefined();
      expect(vex.scroll()).toBeDefined();
      expect(vex.draggable(document.createElement('div'))).toBeDefined();
      expect(vex.form()).toBeDefined();
      expect(vex.validation()).toBeDefined();
      expect(vex.mediaQuery('(max-width: 768px)')).toBeDefined();
      expect(vex.windowSize()).toBeDefined();
      expect(vex.geolocation()).toBeDefined();
      expect(vex.interval(() => {}, 1000)).toBeDefined();
      expect(vex.timeout(() => {}, 1000)).toBeDefined();
      expect(vex.countdown(5)).toBeDefined();
      expect(vex.logger()).toBeDefined();
      expect(vex.cache()).toBeDefined();
      expect(vex.queue()).toBeDefined();
      expect(vex.eventEmitter()).toBeDefined();
      expect(vex.encryption()).toBeDefined();
      expect(vex.hash()).toBeDefined();
      expect(vex.token()).toBeDefined();
      expect(vex.fileUpload()).toBeDefined();
      expect(vex.fileReader()).toBeDefined();
      expect(vex.webSocket('ws://test.com')).toBeDefined();
      expect(vex.sse('http://test.com')).toBeDefined();
      expect(vex.polling(() => {}, 1000)).toBeDefined();
      expect(vex.profiler()).toBeDefined();
      expect(vex.timer()).toBeDefined();
    });
  });
});
