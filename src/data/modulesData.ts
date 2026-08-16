export interface ModuleInfo {
  id: string;
  name: string;
  category: 'network' | 'storage' | 'ui' | 'form' | 'performance' | 'utilities' | 'security' | 'file' | 'media' | 'timers';
  description: string;
  methods: { name: string; params: string; returns: string; desc: string }[];
  codeExample: string;
  sourceFile: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'All Modules', count: 34, icon: 'Layers' },
  { id: 'network', name: 'Network', count: 4, icon: 'Globe' },
  { id: 'storage', name: 'Storage & Cookies', count: 3, icon: 'HardDrive' },
  { id: 'ui', name: 'UI & Interactions', count: 6, icon: 'MousePointer' },
  { id: 'form', name: 'Form & Validation', count: 2, icon: 'CheckSquare' },
  { id: 'performance', name: 'Performance', count: 3, icon: 'Zap' },
  { id: 'utilities', name: 'Utilities & Queues', count: 4, icon: 'Wrench' },
  { id: 'security', name: 'Security & Crypto', count: 3, icon: 'Shield' },
  { id: 'file', name: 'File & Media Reader', count: 2, icon: 'FileText' },
  { id: 'media', name: 'Device & Media', count: 3, icon: 'Monitor' },
  { id: 'timers', name: 'Timers & Profiler', count: 5, icon: 'Clock' },
] as const;

export const MODULES: ModuleInfo[] = [
  {
    id: 'fetch',
    name: 'useFetch',
    category: 'network',
    description: 'Advanced HTTP client with request/response interceptors, memory caching with TTL, timeouts, and error handling.',
    methods: [
      { name: 'get(endpoint, options)', params: 'endpoint: string, options?: object', returns: 'Promise<Response>', desc: 'Fetch GET with optional caching' },
      { name: 'post(endpoint, data, options)', params: 'endpoint: string, data: any, options?: object', returns: 'Promise<Response>', desc: 'Fetch POST with JSON payload' },
      { name: 'put(endpoint, data, options)', params: 'endpoint: string, data: any, options?: object', returns: 'Promise<Response>', desc: 'Fetch PUT with JSON payload' },
      { name: 'delete(endpoint, options)', params: 'endpoint: string, options?: object', returns: 'Promise<Response>', desc: 'Fetch DELETE request' },
      { name: 'addRequestInterceptor(fn)', params: 'fn: (config) => config', returns: '() => void', desc: 'Add request transform interceptor' },
      { name: 'addResponseInterceptor(fn)', params: 'fn: (data) => data', returns: '() => void', desc: 'Add response transform interceptor' },
      { name: 'clearCache()', params: 'none', returns: 'void', desc: 'Clear in-memory cache' },
    ],
    codeExample: `import { useFetch } from 'vexorion';

const api = new useFetch({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  cacheTTL: 30000
});

// Add auth header interceptor
api.addRequestInterceptor((config) => {
  config.headers['Authorization'] = 'Bearer token123';
  return config;
});

const { data, status } = await api.get('/todos/1');
console.log(data);`,
    sourceFile: 'src/core/Fetch.js'
  },
  {
    id: 'storage',
    name: 'useLocalStorage & useSessionStorage',
    category: 'storage',
    description: 'Type-safe storage wrapper with namespace prefixes, TTL expiration timestamps, multi-tab sync, and change subscribers.',
    methods: [
      { name: 'set(key, value, expiry)', params: 'key: string, value: any, expiry?: ms', returns: 'boolean', desc: 'Store item with optional TTL expiration' },
      { name: 'get(key, defaultValue)', params: 'key: string, defaultValue?: any', returns: 'any', desc: 'Retrieve item; cleans expired keys automatically' },
      { name: 'remove(key)', params: 'key: string', returns: 'boolean', desc: 'Remove specific key and notify listeners' },
      { name: 'clear()', params: 'none', returns: 'boolean', desc: 'Clear all namespace items' },
      { name: 'keys()', params: 'none', returns: 'string[]', desc: 'Get all keys in this namespace' },
      { name: 'subscribe(key, callback)', params: 'key: string, cb: (val) => void', returns: 'unsubscribe', desc: 'Subscribe to cross-tab or local updates' },
    ],
    codeExample: `import { useLocalStorage, useSessionStorage } from 'vexorion';

const storage = new useLocalStorage({ prefix: 'my_app' });

// Store with 1-hour expiration
storage.set('user_profile', { id: 101, name: 'Alice' }, 3600000);

// Subscribe to changes
const unsub = storage.subscribe('user_profile', (newVal) => {
  console.log('Profile changed:', newVal);
});`,
    sourceFile: 'src/core/Storage.js'
  },
  {
    id: 'cookie',
    name: 'useCookie',
    category: 'storage',
    description: 'Complete client-side cookie manager with TTL expiration in days, custom domains, secure flags, and SameSite configuration.',
    methods: [
      { name: 'set(key, value, options)', params: 'key: string, value: string, options?: object', returns: 'boolean', desc: 'Set cookie with days, domain, path, secure, sameSite' },
      { name: 'get(key)', params: 'key: string', returns: 'string | null', desc: 'Read cookie value by name' },
      { name: 'getAll()', params: 'none', returns: 'Record<string, string>', desc: 'Get all document cookies as key-value pairs' },
      { name: 'remove(key, options)', params: 'key: string, options?: object', returns: 'boolean', desc: 'Delete cookie immediately' },
      { name: 'has(key)', params: 'key: string', returns: 'boolean', desc: 'Check if cookie exists' },
      { name: 'clear()', params: 'none', returns: 'boolean', desc: 'Clear all cookies' },
    ],
    codeExample: `import { useCookie } from 'vexorion';

const cookie = new useCookie({ sameSite: 'lax', secure: true });

cookie.set('theme', 'dark', { days: 30 });
const theme = cookie.get('theme'); // 'dark'`,
    sourceFile: 'src/core/Cookie.js'
  },
  {
    id: 'debounce',
    name: 'useDebounce & createDebounce',
    category: 'performance',
    description: 'High-performance debouncer supporting leading & trailing edge execution, maxWait guarantees, cancellation, and immediate flush.',
    methods: [
      { name: 'debounce(fn)', params: 'fn: Function', returns: 'DebouncedFunction', desc: 'Wrap function with debounce behavior' },
      { name: 'cancel()', params: 'none', returns: 'void', desc: 'Cancel pending debounced calls' },
      { name: 'flush(fn)', params: 'fn?: Function', returns: 'any', desc: 'Immediately execute pending call' },
    ],
    codeExample: `import { createDebounce } from 'vexorion';

const searchApi = createDebounce((query) => {
  console.log('Searching for:', query);
}, 300, { leading: false, trailing: true, maxWait: 1000 });

// Trigger rapidly
searchApi('v');
searchApi('ve');
searchApi('vexorion'); // only executed after 300ms`,
    sourceFile: 'src/core/Debounce.js'
  },
  {
    id: 'throttle',
    name: 'useThrottle & createThrottle',
    category: 'performance',
    description: 'Throttler guaranteeing execution rates with customizable leading/trailing options, cancellation, and manual flush.',
    methods: [
      { name: 'throttle(fn)', params: 'fn: Function', returns: 'ThrottledFunction', desc: 'Wrap function with throttle behavior' },
      { name: 'cancel()', params: 'none', returns: 'void', desc: 'Cancel pending execution' },
      { name: 'flush(fn)', params: 'fn?: Function', returns: 'any', desc: 'Flush pending throttled call' },
    ],
    codeExample: `import { createThrottle } from 'vexorion';

const handleResize = createThrottle((w, h) => {
  console.log('Resized:', w, h);
}, 200, { leading: true, trailing: true });`,
    sourceFile: 'src/core/Throttle.js'
  },
  {
    id: 'memoize',
    name: 'useMemoize & createMemoize',
    category: 'performance',
    description: 'LRU caching memoizer for expensive function calls with maximum capacity eviction, TTL expirations, and cache statistics.',
    methods: [
      { name: 'memoize(fn)', params: 'fn: Function', returns: 'MemoizedFunction', desc: 'Wrap function with LRU cached results' },
      { name: 'getStats()', params: 'none', returns: '{ size, maxSize, keys }', desc: 'Inspect cache stats' },
      { name: 'clear()', params: 'none', returns: 'void', desc: 'Clear all memoized cache entries' },
    ],
    codeExample: `import { createMemoize } from 'vexorion';

const fibonacci = createMemoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}, { maxSize: 500, ttl: 60000 });

console.log(fibonacci(40)); // Instant calculation on repeated calls`,
    sourceFile: 'src/core/Memoize.js'
  },
  {
    id: 'toggle',
    name: 'useToggle & createToggle',
    category: 'ui',
    description: 'Reactive boolean state manager with toggle, on, off, reset, function updates, and listener subscription callbacks.',
    methods: [
      { name: 'get()', params: 'none', returns: 'boolean', desc: 'Get current boolean state' },
      { name: 'toggle()', params: 'none', returns: 'void', desc: 'Flip boolean state' },
      { name: 'on()', params: 'none', returns: 'void', desc: 'Set state to true' },
      { name: 'off()', params: 'none', returns: 'void', desc: 'Set state to false' },
      { name: 'set(val)', params: 'boolean | (prev) => boolean', returns: 'void', desc: 'Set explicit or calculated value' },
      { name: 'subscribe(cb)', params: 'cb: (val) => void', returns: 'unsubscribe', desc: 'Listen to boolean state changes' },
    ],
    codeExample: `import { useToggle } from 'vexorion';

const modalOpen = new useToggle(false);
modalOpen.subscribe((isOpen) => console.log('Modal is:', isOpen));

modalOpen.on();     // Modal is: true
modalOpen.toggle(); // Modal is: false`,
    sourceFile: 'src/core/Toggle.js'
  },
  {
    id: 'clickoutside',
    name: 'useClickOutside',
    category: 'ui',
    description: 'Dismiss dropdowns, modals, and tooltips by detecting clicks outside element bounds with excluded selector filtering.',
    methods: [
      { name: 'constructor(element, handler, options)', params: 'el, fn, { enabled, excludeSelectors }', returns: 'useClickOutside', desc: 'Initialize click outside detector' },
      { name: 'setEnabled(boolean)', params: 'enabled: boolean', returns: 'void', desc: 'Enable or disable listener' },
      { name: 'destroy()', params: 'none', returns: 'void', desc: 'Detach listeners and clean up' },
    ],
    codeExample: `import { useClickOutside } from 'vexorion';

const dropdown = document.querySelector('#menu');
const outside = new useClickOutside(dropdown, () => {
  console.log('Clicked outside dropdown!');
}, { excludeSelectors: ['.menu-trigger-button'] });`,
    sourceFile: 'src/core/ClickOutside.js'
  },
  {
    id: 'hover',
    name: 'useHover',
    category: 'ui',
    description: 'Element hover detection with configurable debounce enter/leave delay timings to eliminate mouse flicker.',
    methods: [
      { name: 'constructor(element, options)', params: 'el, { enterDelay, leaveDelay, onEnter, onLeave }', returns: 'useHover', desc: 'Bind hover detector to DOM element' },
      { name: 'destroy()', params: 'none', returns: 'void', desc: 'Detach hover listeners' },
    ],
    codeExample: `import { useHover } from 'vexorion';

const hoverDetector = new useHover(cardElement, {
  enterDelay: 100,
  leaveDelay: 200,
  onEnter: () => console.log('Hover entered'),
  onLeave: () => console.log('Hover left')
});`,
    sourceFile: 'src/core/Hover.js'
  },
  {
    id: 'focus',
    name: 'useFocus',
    category: 'ui',
    description: 'Reactive focus and blur state tracking with programmatic focus control and event callbacks.',
    methods: [
      { name: 'focus()', params: 'none', returns: 'void', desc: 'Trigger element focus' },
      { name: 'blur()', params: 'none', returns: 'void', desc: 'Trigger element blur' },
      { name: 'destroy()', params: 'none', returns: 'void', desc: 'Remove event listeners' },
    ],
    codeExample: `import { useFocus } from 'vexorion';

const focusTracker = new useFocus(inputElement, {
  onFocus: () => console.log('Input focused'),
  onBlur: () => console.log('Input blurred')
});`,
    sourceFile: 'src/core/Focus.js'
  },
  {
    id: 'scroll',
    name: 'useScroll',
    category: 'ui',
    description: 'Throttled scroll tracking with x/y coordinate monitoring, scrolling status flags, direction detection (up/down/left/right), and smooth scroll helpers.',
    methods: [
      { name: 'get()', params: 'none', returns: '{ x, y, isScrolling, direction }', desc: 'Get current scroll snapshot' },
      { name: 'scrollToTop()', params: 'none', returns: 'void', desc: 'Smooth scroll to top' },
      { name: 'scrollToElement(el, options)', params: 'el, options', returns: 'void', desc: 'Smooth scroll element into view' },
    ],
    codeExample: `import { useScroll } from 'vexorion';

const scroll = new useScroll({
  throttle: 50,
  onScroll: ({ x, y, direction }) => {
    console.log('Scroll:', y, 'Direction:', direction);
  }
});`,
    sourceFile: 'src/core/Scroll.js'
  },
  {
    id: 'draggable',
    name: 'useDraggable',
    category: 'ui',
    description: 'Complete absolute and bounded element dragging engine with handle targeting, axis locking (x/y/both), and position callbacks.',
    methods: [
      { name: 'setPosition(x, y)', params: 'x: number, y: number', returns: 'void', desc: 'Set element coordinate position' },
      { name: 'getPosition()', params: 'none', returns: '{ x, y }', desc: 'Get current coordinates' },
      { name: 'setDisabled(boolean)', params: 'boolean', returns: 'void', desc: 'Enable or disable dragging' },
    ],
    codeExample: `import { useDraggable } from 'vexorion';

const drag = new useDraggable(modalEl, {
  axis: 'both',
  bounds: { top: 0, left: 0, right: 800, bottom: 600 },
  onDrag: ({ x, y }) => console.log('Pos:', x, y)
});`,
    sourceFile: 'src/core/Draggable.js'
  },
  {
    id: 'form',
    name: 'useForm',
    category: 'form',
    description: 'Reactive form state container with two-way field binding props, error and touched tracking, validation triggers, and asynchronous submission handling.',
    methods: [
      { name: 'getFieldProps(name)', params: 'name: string', returns: '{ name, value, onChange, onBlur, error, touched }', desc: 'Get props for standard inputs' },
      { name: 'handleSubmit(e)', params: 'e?: Event', returns: 'Promise<void>', desc: 'Validate all fields and execute onSubmit' },
      { name: 'setFieldValue(name, val)', params: 'name: string, val: any', returns: 'void', desc: 'Set single field value' },
      { name: 'resetForm(newValues?)', params: 'newValues?: object', returns: 'void', desc: 'Reset form to initial or new values' },
      { name: 'subscribe(cb)', params: 'cb: (values, errors, touched) => void', returns: 'unsubscribe', desc: 'Subscribe to form state updates' },
    ],
    codeExample: `import { useForm } from 'vexorion';

const form = new useForm({
  initialValues: { username: '', email: '' },
  validate: (vals) => {
    const errors = {};
    if (!vals.username) errors.username = 'Username required';
    return errors;
  },
  onSubmit: async (vals) => {
    console.log('Submitted successfully:', vals);
  }
});`,
    sourceFile: 'src/core/Form.js'
  },
  {
    id: 'validation',
    name: 'useValidation & validationRules',
    category: 'form',
    description: 'Declarative schema validator with built-in rules (required, email, minLength, maxLength, range, regex, phone, url, confirm match).',
    methods: [
      { name: 'validate(values)', params: 'values: object', returns: '{ isValid, errors }', desc: 'Validate complete object against schema' },
      { name: 'validateField(field, value, values)', params: 'field, val, vals', returns: '{ isValid, message }', desc: 'Validate single field' },
      { name: 'clearErrors()', params: 'none', returns: 'void', desc: 'Clear all validation error messages' },
    ],
    codeExample: `import { useValidation, validationRules } from 'vexorion';

const validator = new useValidation({
  email: [{ type: 'required' }, { type: 'email', message: 'Valid email is required' }],
  password: [{ type: 'minLength', params: 8, message: 'Must be at least 8 characters' }],
  confirmPassword: [{ type: 'confirm', params: 'password', message: 'Passwords must match' }]
});

const result = validator.validate({ email: 'test@example.com', password: '123', confirmPassword: '456' });
console.log(result.isValid, result.errors);`,
    sourceFile: 'src/core/Validation.js'
  },
  {
    id: 'mediaquery',
    name: 'useMediaQuery & Helpers',
    category: 'media',
    description: 'Reactive matchMedia subscriber with helper shortcuts (useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode, useIsPortrait).',
    methods: [
      { name: 'get()', params: 'none', returns: 'boolean', desc: 'Current boolean match state' },
      { name: 'subscribe(cb)', params: 'cb: (matches) => void', returns: 'unsubscribe', desc: 'Subscribe to breakpoint changes' },
    ],
    codeExample: `import { useMediaQuery, useIsMobile, useIsDarkMode } from 'vexorion';

const isMobile = useIsMobile();
const isDark = useIsDarkMode();

console.log('Is mobile screen:', isMobile.get());
isMobile.subscribe((matches) => console.log('Mobile view changed:', matches));`,
    sourceFile: 'src/core/MediaQuery.js'
  },
  {
    id: 'windowsize',
    name: 'useWindowSize',
    category: 'media',
    description: 'Throttled viewport window dimension tracking with width, height, and change subscribers.',
    methods: [
      { name: 'get()', params: 'none', returns: '{ width, height }', desc: 'Get viewport dimensions' },
      { name: 'getWidth()', params: 'none', returns: 'number', desc: 'Get window innerWidth' },
      { name: 'getHeight()', params: 'none', returns: 'number', desc: 'Get window innerHeight' },
    ],
    codeExample: `import { useWindowSize } from 'vexorion';

const win = new useWindowSize({ throttle: 100 });
console.log(win.getWidth(), win.getHeight());

win.subscribe(({ width, height }) => {
  console.log('Window size:', width, 'x', height);
});`,
    sourceFile: 'src/core/WindowSize.js'
  },
  {
    id: 'geolocation',
    name: 'useGeolocation',
    category: 'media',
    description: 'Promise-based and continuous watch geolocation tracking with accuracy, altitude, heading, and speed coords.',
    methods: [
      { name: 'getCurrentPosition()', params: 'none', returns: 'Promise<Position>', desc: 'Get current GPS coordinates' },
      { name: 'watchPosition()', params: 'none', returns: 'void', desc: 'Continuously watch position stream' },
      { name: 'clearWatch()', params: 'none', returns: 'void', desc: 'Stop continuous position watching' },
    ],
    codeExample: `import { useGeolocation } from 'vexorion';

const geo = new useGeolocation({ enableHighAccuracy: true });
const pos = await geo.getCurrentPosition();
console.log('Lat:', pos.latitude, 'Lng:', pos.longitude);`,
    sourceFile: 'src/core/Geolocation.js'
  },
  {
    id: 'interval',
    name: 'useInterval',
    category: 'timers',
    description: 'Controllable timer interval with start, stop, toggle, dynamic delay updating, and status subscription.',
    methods: [
      { name: 'start()', params: 'none', returns: 'void', desc: 'Start interval timer' },
      { name: 'stop()', params: 'none', returns: 'void', desc: 'Pause/stop interval timer' },
      { name: 'toggle()', params: 'none', returns: 'void', desc: 'Toggle running state' },
      { name: 'setDelay(ms)', params: 'ms: number', returns: 'void', desc: 'Dynamically update interval frequency' },
    ],
    codeExample: `import { useInterval } from 'vexorion';

let count = 0;
const ticker = new useInterval(() => {
  count++;
  console.log('Tick:', count);
}, 1000, { immediate: true });

// Stop after 5 seconds
setTimeout(() => ticker.stop(), 5000);`,
    sourceFile: 'src/core/Interval.js'
  },
  {
    id: 'timeout',
    name: 'useTimeout',
    category: 'timers',
    description: 'Managed single-shot timeout with start, stop, restart, dynamic delay, and running state listeners.',
    methods: [
      { name: 'start()', params: 'none', returns: 'void', desc: 'Start or schedule timeout' },
      { name: 'stop()', params: 'none', returns: 'void', desc: 'Cancel scheduled timeout' },
      { name: 'restart()', params: 'none', returns: 'void', desc: 'Stop and restart timer' },
    ],
    codeExample: `import { useTimeout } from 'vexorion';

const timer = new useTimeout(() => {
  console.log('Timeout completed!');
}, 3000, { autoStart: true });`,
    sourceFile: 'src/core/Timeout.js'
  },
  {
    id: 'countdown',
    name: 'useCountdown',
    category: 'timers',
    description: 'Second-accurate countdown timer with onTick and onComplete callbacks, remaining time getters, and reset/restart controls.',
    methods: [
      { name: 'start()', params: 'none', returns: 'void', desc: 'Begin countdown' },
      { name: 'stop()', params: 'none', returns: 'void', desc: 'Pause countdown' },
      { name: 'reset()', params: 'none', returns: 'void', desc: 'Reset to initial seconds' },
      { name: 'getTimeLeft()', params: 'none', returns: 'number', desc: 'Get remaining seconds' },
    ],
    codeExample: `import { useCountdown } from 'vexorion';

const timer = new useCountdown(60, {
  onTick: (sec) => console.log('Seconds left:', sec),
  onComplete: () => console.log('Countdown finished!')
});

timer.start();`,
    sourceFile: 'src/core/Countdown.js'
  },
  {
    id: 'logger',
    name: 'useLogger',
    category: 'utilities',
    description: 'Configurable runtime logger with debug, info, warn, error levels, custom prefixes, ISO timestamps, listener streams, and grouping.',
    methods: [
      { name: 'debug(...args)', params: '...args', returns: 'void', desc: 'Log debug level message' },
      { name: 'info(...args)', params: '...args', returns: 'void', desc: 'Log info level message' },
      { name: 'warn(...args)', params: '...args', returns: 'void', desc: 'Log warning level message' },
      { name: 'error(...args)', params: '...args', returns: 'void', desc: 'Log error level message' },
      { name: 'setLevel(level)', params: 'level: "debug"|"info"|"warn"|"error"|"off"', returns: 'void', desc: 'Change log threshold' },
      { name: 'subscribe(cb)', params: 'cb: (logData) => void', returns: 'unsubscribe', desc: 'Stream log messages to UI console' },
    ],
    codeExample: `import { useLogger } from 'vexorion';

const log = new useLogger({ prefix: 'AuthService', level: 'debug' });
log.info('User logged in', { id: 'usr_99' });
log.warn('Session expiring soon');`,
    sourceFile: 'src/core/Logger.js'
  },
  {
    id: 'cache',
    name: 'useCache',
    category: 'utilities',
    description: 'In-memory key-value cache with individual item TTL expiration, LRU maximum size eviction, and change notification subscriptions.',
    methods: [
      { name: 'set(key, value, ttl)', params: 'key: string, val: any, ttl?: ms', returns: 'void', desc: 'Store item with custom TTL' },
      { name: 'get(key)', params: 'key: string', returns: 'any', desc: 'Retrieve item; deletes if expired' },
      { name: 'delete(key)', params: 'key: string', returns: 'void', desc: 'Remove specific key' },
      { name: 'clear()', params: 'none', returns: 'void', desc: 'Flush all cache entries' },
      { name: 'getStats()', params: 'none', returns: '{ size, maxSize, ttl }', desc: 'Get cache size and config' },
    ],
    codeExample: `import { useCache } from 'vexorion';

const cache = new useCache({ maxSize: 100, ttl: 30000 });
cache.set('config', { theme: 'dark', lang: 'en' });
console.log(cache.get('config'));`,
    sourceFile: 'src/core/Cache.js'
  },
  {
    id: 'queue',
    name: 'useQueue',
    category: 'utilities',
    description: 'Asynchronous task queue with concurrency control (process N tasks in parallel), maximum queue size bounds, and status subscribers.',
    methods: [
      { name: 'enqueue(task)', params: 'task: () => Promise<any>', returns: 'void', desc: 'Push async task onto processing queue' },
      { name: 'enqueueMany(tasks)', params: 'tasks: Function[]', returns: 'void', desc: 'Push batch of tasks' },
      { name: 'setConcurrent(n)', params: 'n: number', returns: 'void', desc: 'Configure max concurrent tasks' },
      { name: 'clear()', params: 'none', returns: 'void', desc: 'Empty remaining queue' },
    ],
    codeExample: `import { useQueue } from 'vexorion';

const queue = new useQueue({ concurrent: 2 });

queue.enqueue(async () => {
  await fetch('/api/task1');
  console.log('Task 1 done');
});
queue.enqueue(async () => {
  await fetch('/api/task2');
  console.log('Task 2 done');
});`,
    sourceFile: 'src/core/Queue.js'
  },
  {
    id: 'eventemitter',
    name: 'useEventEmitter',
    category: 'utilities',
    description: 'Pub/Sub event emitter supporting on, once, off, synchronous emit, asynchronous emitAsync with Promise.all, and listener limits.',
    methods: [
      { name: 'on(event, cb)', params: 'event: string, cb: Function', returns: 'unsubscribe', desc: 'Register event listener' },
      { name: 'once(event, cb)', params: 'event: string, cb: Function', returns: 'unsubscribe', desc: 'Register one-time event listener' },
      { name: 'off(event, cb)', params: 'event: string, cb: Function', returns: 'void', desc: 'Remove specific listener' },
      { name: 'emit(event, ...args)', params: 'event: string, ...args', returns: 'boolean', desc: 'Emit synchronous event to all listeners' },
      { name: 'emitAsync(event, ...args)', params: 'event: string, ...args', returns: 'Promise<any[]>', desc: 'Emit async event returning all promises' },
    ],
    codeExample: `import { useEventEmitter } from 'vexorion';

const bus = new useEventEmitter();
const unsub = bus.on('order:placed', (order) => {
  console.log('New order received:', order.id);
});

bus.emit('order:placed', { id: 4891, total: 99.5 });`,
    sourceFile: 'src/core/EventEmitter.js'
  },
  {
    id: 'encryption',
    name: 'useEncryption',
    category: 'security',
    description: 'Browser-native Web Crypto API AES-GCM 256-bit symmetric encryption/decryption, PBKDF2 key derivation, random token generator, and UUID v4.',
    methods: [
      { name: 'encrypt(plaintext)', params: 'plaintext: string', returns: 'Promise<string>', desc: 'Encrypt text with AES-GCM' },
      { name: 'decrypt(ciphertext)', params: 'ciphertext: string', returns: 'Promise<string>', desc: 'Decrypt base64 ciphertext' },
      { name: 'generateToken(length)', params: 'length?: number', returns: 'string', desc: 'Cryptographically secure random hex string' },
      { name: 'generateUUID()', params: 'none', returns: 'string', desc: 'Generate RFC4122 compliant UUID v4' },
    ],
    codeExample: `import { useEncryption } from 'vexorion';

const crypt = new useEncryption({ secret: 'my-super-secret-key-32chars!' });

const encrypted = await crypt.encrypt('Confidential User Information');
console.log('Encrypted Base64:', encrypted);

const decrypted = await crypt.decrypt(encrypted);
console.log('Decrypted Plaintext:', decrypted);`,
    sourceFile: 'src/core/Encryption.js'
  },
  {
    id: 'hash',
    name: 'useHash',
    category: 'security',
    description: 'Cryptographic hashing suite providing SHA-256, SHA-384, SHA-512 (via Web Crypto), MD5, Base64, and URL-safe Base64 encoding.',
    methods: [
      { name: 'sha256(text)', params: 'text: string', returns: 'Promise<string>', desc: 'Calculate SHA-256 hex digest' },
      { name: 'sha384(text)', params: 'text: string', returns: 'Promise<string>', desc: 'Calculate SHA-384 hex digest' },
      { name: 'sha512(text)', params: 'text: string', returns: 'Promise<string>', desc: 'Calculate SHA-512 hex digest' },
      { name: 'md5(text)', params: 'text: string', returns: 'string', desc: 'Calculate MD5 hex hash' },
      { name: 'base64(text)', params: 'text: string', returns: 'string', desc: 'Encode UTF-8 string to Base64' },
      { name: 'base64Decode(b64)', params: 'b64: string', returns: 'string', desc: 'Decode Base64 to UTF-8' },
    ],
    codeExample: `import { useHash } from 'vexorion';

const hasher = new useHash();
const sha = await hasher.sha256('Hello Vexorion');
const md5Hash = hasher.md5('Hello Vexorion');
const b64 = hasher.base64('Hello Vexorion');`,
    sourceFile: 'src/core/Hash.js'
  },
  {
    id: 'token',
    name: 'useToken',
    category: 'security',
    description: 'Token generator for secure numeric OTPs, alphanumeric keys, and HMAC-SHA256 signed JSON Web Tokens (JWT) with expiration validation.',
    methods: [
      { name: 'generateJWT(payload, secret, expiresIn)', params: 'payload, secret, expiresIn?', returns: 'Promise<string>', desc: 'Generate signed HS256 JWT' },
      { name: 'verifyJWT(token, secret)', params: 'token: string, secret: string', returns: 'Promise<object|null>', desc: 'Verify signature and expiration' },
      { name: 'generateOTP(length, expiresIn)', params: 'length?, expiresIn?', returns: '{ code, expiresAt }', desc: 'Generate numeric OTP' },
      { name: 'verifyOTP(otp, code, expiresAt)', params: 'otp, code, expiresAt', returns: 'boolean', desc: 'Verify OTP code and validity' },
      { name: 'generateAlphaNumeric(length)', params: 'length?: number', returns: 'string', desc: 'Random alphanumeric code' },
    ],
    codeExample: `import { useToken } from 'vexorion';

const tokenMgr = new useToken();

// Generate signed JWT
const jwt = await tokenMgr.generateJWT({ userId: 42, role: 'admin' }, 'secret_key', 3600);
console.log('JWT:', jwt);

// Verify JWT
const payload = await tokenMgr.verifyJWT(jwt, 'secret_key');
console.log('Decoded Payload:', payload);`,
    sourceFile: 'src/core/Token.js'
  },
  {
    id: 'fileupload',
    name: 'useFileUpload',
    category: 'file',
    description: 'File upload manager with multi-file queueing, client-side type & size validation, progress tracking, preview URLs, and upload cancellation.',
    methods: [
      { name: 'addFiles(fileList)', params: 'fileList: File[] | FileList', returns: 'number', desc: 'Validate and add files to upload queue' },
      { name: 'removeFile(index)', params: 'index: number', returns: 'FileItem', desc: 'Remove file and revoke object URL' },
      { name: 'upload(url, options)', params: 'url: string, options?: object', returns: 'Promise<void>', desc: 'Upload queue with XHR progress' },
      { name: 'cancelUpload(index)', params: 'index: number', returns: 'void', desc: 'Abort in-progress upload' },
      { name: 'getStats()', params: 'none', returns: '{ total, uploaded, failed, pending, totalSize }', desc: 'Get batch summary statistics' },
    ],
    codeExample: `import { useFileUpload } from 'vexorion';

const uploader = new useFileUpload({
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ['image/png', 'image/jpeg', 'application/pdf'],
  maxFiles: 5
});

uploader.subscribe((files, errors, uploading, progress) => {
  console.log('Progress:', progress, '%');
});`,
    sourceFile: 'src/core/FileUpload.js'
  },
  {
    id: 'filereader',
    name: 'useFileReader',
    category: 'file',
    description: 'Promise-based browser FileReader helper supporting text, Data URL (base64 images), ArrayBuffer, and binary string conversions.',
    methods: [
      { name: 'readAsText(file)', params: 'file: File', returns: 'Promise<string>', desc: 'Read file contents as UTF-8 text' },
      { name: 'readAsDataURL(file)', params: 'file: File', returns: 'Promise<string>', desc: 'Read file as base64 Data URL' },
      { name: 'readAsArrayBuffer(file)', params: 'file: File', returns: 'Promise<ArrayBuffer>', desc: 'Read file as binary ArrayBuffer' },
    ],
    codeExample: `import { useFileReader } from 'vexorion';

const reader = new useFileReader();
const dataUrl = await reader.readAsDataURL(imageFileInput.files[0]);
console.log('Image Data URL preview:', dataUrl);`,
    sourceFile: 'src/core/FileReader.js'
  },
  {
    id: 'websocket',
    name: 'useWebSocket',
    category: 'network',
    description: 'Resilient WebSocket client with automatic reconnection backoff, keep-alive heartbeat ping intervals, typed message routing, and connection state management.',
    methods: [
      { name: 'connect()', params: 'none', returns: 'void', desc: 'Establish WebSocket connection' },
      { name: 'send(data)', params: 'data: string | object', returns: 'void', desc: 'Send text or serialized JSON' },
      { name: 'on(event, cb)', params: 'event: "open"|"message"|"data"|"close"|"error", cb', returns: 'unsubscribe', desc: 'Listen for WS events' },
      { name: 'close(code?, reason?)', params: 'code?, reason?', returns: 'void', desc: 'Gracefully close connection' },
    ],
    codeExample: `import { useWebSocket } from 'vexorion';

const ws = new useWebSocket('wss://echo.websocket.org', {
  reconnect: true,
  reconnectInterval: 3000,
  heartbeatInterval: 25000,
  heartbeatMessage: 'ping'
});

ws.on('data', (msg) => console.log('Received JSON:', msg));
ws.connect();`,
    sourceFile: 'src/core/WebSocket.js'
  },
  {
    id: 'sse',
    name: 'useSSE',
    category: 'network',
    description: 'Server-Sent Events (EventSource) client wrapper with custom named event listener dispatch, automatic reconnect, and JSON parsing.',
    methods: [
      { name: 'connect()', params: 'none', returns: 'void', desc: 'Connect to SSE stream' },
      { name: 'on(event, cb)', params: 'event: string, cb: Function', returns: 'unsubscribe', desc: 'Listen for default or custom named events' },
      { name: 'close()', params: 'none', returns: 'void', desc: 'Close EventSource connection' },
    ],
    codeExample: `import { useSSE } from 'vexorion';

const sse = new useSSE('/api/live-stream', { reconnect: true });
sse.on('price_update', (data) => console.log('Live Price:', data));
sse.connect();`,
    sourceFile: 'src/core/SSE.js'
  },
  {
    id: 'polling',
    name: 'usePolling',
    category: 'network',
    description: 'Configurable polling engine for recurring background API sync with max attempt limits, manual trigger, interval adjustments, and result events.',
    methods: [
      { name: 'start()', params: 'none', returns: 'void', desc: 'Start background polling cycle' },
      { name: 'stop()', params: 'none', returns: 'void', desc: 'Stop polling timer' },
      { name: 'setInterval(ms)', params: 'ms: number', returns: 'void', desc: 'Change polling interval' },
      { name: 'on(event, cb)', params: 'event: "success"|"error"|"maxattempts", cb', returns: 'unsubscribe', desc: 'Listen to polling events' },
    ],
    codeExample: `import { usePolling } from 'vexorion';

const poll = new usePolling(async () => {
  const res = await fetch('/api/job-status');
  return res.json();
}, 5000, { immediate: true, maxAttempts: 20 });

poll.on('success', (data) => console.log('Job status:', data));`,
    sourceFile: 'src/core/Polling.js'
  },
  {
    id: 'profiler',
    name: 'useProfiler',
    category: 'timers',
    description: 'High-resolution performance profiling utility with marks, measures, duration metrics, and wrapped async execution timers.',
    methods: [
      { name: 'start(name)', params: 'name: string', returns: 'void', desc: 'Record start timestamp mark' },
      { name: 'end(name)', params: 'name: string', returns: 'number', desc: 'Record end mark and calculate duration (ms)' },
      { name: 'profile(name, fn)', params: 'name: string, fn: Function', returns: 'Promise<any>', desc: 'Measure async function runtime' },
      { name: 'getAllMeasures()', params: 'none', returns: 'Record<string, object>', desc: 'Get all measured durations' },
    ],
    codeExample: `import { useProfiler } from 'vexorion';

const profiler = new useProfiler({ name: 'AppPerf' });

await profiler.profile('data_processing', async () => {
  // Heavy computation or API fetch
  await heavyTask();
});

console.log(profiler.getAllMeasures());`,
    sourceFile: 'src/core/Profiler.js'
  },
  {
    id: 'timer',
    name: 'useTimer',
    category: 'timers',
    description: 'Precision stopwatch timer with start, pause, reset, elapsed seconds/minutes/hours calculation, and formatted HH:MM:SS.mmm display.',
    methods: [
      { name: 'start()', params: 'none', returns: 'void', desc: 'Start or resume stopwatch' },
      { name: 'stop()', params: 'none', returns: 'void', desc: 'Pause stopwatch' },
      { name: 'reset()', params: 'none', returns: 'void', desc: 'Reset elapsed time to 0' },
      { name: 'getFormatted()', params: 'none', returns: 'string', desc: 'Formatted "HH:MM:SS.mmm"' },
      { name: 'getElapsedSeconds()', params: 'none', returns: 'number', desc: 'Total elapsed time in seconds' },
    ],
    codeExample: `import { useTimer } from 'vexorion';

const timer = new useTimer({ autoStart: true });
setTimeout(() => {
  console.log('Elapsed:', timer.getFormatted());
  timer.stop();
}, 2500);`,
    sourceFile: 'src/core/Timer.js'
  }
];
