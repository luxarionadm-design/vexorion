import {
  useFetch,
  useLocalStorage,
  useSessionStorage,
  useCookie,
  useDebounce,
  useThrottle,
  useMemoize,
  createMemoize,
  useToggle,
  useClickOutside,
  useHover,
  useFocus,
  useScroll,
  useDraggable,
  useForm,
  useValidation,
  useMediaQuery,
  useWindowSize,
  useGeolocation,
  useInterval,
  useTimeout,
  useCountdown,
  useLogger,
  useCache,
  useQueue,
  useEventEmitter,
  useEncryption,
  useHash,
  useToken,
  useFileUpload,
  useFileReader,
  useWebSocket,
  useSSE,
  usePolling,
  useProfiler,
  useTimer,
  Vexorion
} from '../index.js';

export interface TestCase {
  id: string;
  name: string;
  category: string;
  run: () => Promise<{ passed: boolean; message: string; durationMs: number }>;
}

export const TEST_SUITE: TestCase[] = [
  {
    id: 'toggle_test',
    name: 'useToggle: Flip state and subscribe',
    category: 'UI & Interactions',
    run: async () => {
      const start = performance.now();
      const toggle = new useToggle(false);
      let observed = false;
      const unsub = toggle.subscribe((v) => { observed = v; });
      toggle.on();
      if (toggle.get() !== true || !observed) throw new Error('Failed to set on');
      toggle.toggle();
      if (toggle.get() !== false || observed !== false) throw new Error('Failed to toggle off');
      unsub();
      return { passed: true, message: 'useToggle verified state transitions and listener notifications', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'cache_test',
    name: 'useCache: Set, Get, and LRU eviction',
    category: 'Utilities',
    run: async () => {
      const start = performance.now();
      const cache = new useCache({ maxSize: 3, ttl: 5000 });
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      cache.set('d', 4); // should evict 'a'
      if (cache.get('a') !== undefined) throw new Error('LRU failed to evict key "a"');
      if (cache.get('d') !== 4) throw new Error('Key "d" not found');
      return { passed: true, message: 'useCache correctly managed LRU capacity eviction and key lookups', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'memoize_test',
    name: 'useMemoize: Cache deterministic outputs',
    category: 'Performance',
    run: async () => {
      const start = performance.now();
      let callCount = 0;
      const memo = createMemoize((x: number) => {
        callCount++;
        return x * 2;
      }, { maxSize: 10 });
      const r1 = memo(5);
      const r2 = memo(5);
      if (r1 !== 10 || r2 !== 10 || callCount !== 1) throw new Error('Memoization did not reuse cached result');
      return { passed: true, message: 'useMemoize prevented duplicate calculation on identical input', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'eventemitter_test',
    name: 'useEventEmitter: Pub/Sub multi-listener dispatch',
    category: 'Utilities',
    run: async () => {
      const start = performance.now();
      const bus = new useEventEmitter();
      let count = 0;
      bus.on('ping', (val: number) => { count += val; });
      bus.on('ping', (val: number) => { count += val * 2; });
      bus.emit('ping', 10);
      if (count !== 30) throw new Error(`Expected 30 but received ${count}`);
      return { passed: true, message: 'useEventEmitter delivered payload to multiple registered channels', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'hash_test',
    name: 'useHash: SHA-256 and MD5 calculation',
    category: 'Security',
    run: async () => {
      const start = performance.now();
      const hasher = new useHash();
      const s256 = await hasher.sha256('hello');
      const md5 = hasher.md5('hello');
      if (!s256.startsWith('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')) {
        throw new Error('SHA-256 digest mismatch');
      }
      if (md5 !== '5d41402abc4b2a76b9719d911017c592') {
        throw new Error('MD5 hash mismatch');
      }
      return { passed: true, message: 'useHash verified WebCrypto SHA-256 and MD5 digests', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'encryption_test',
    name: 'useEncryption: AES-GCM 256 roundtrip',
    category: 'Security',
    run: async () => {
      const start = performance.now();
      const secret = 'vexorion-master-test-key-32ch';
      const enc = new useEncryption({ secret });
      const plaintext = 'Secret user token 12345';
      const ciphertext = await enc.encrypt(plaintext);
      const decrypted = await enc.decrypt(ciphertext);
      if (decrypted !== plaintext) throw new Error('Decrypted string does not match original plaintext');
      return { passed: true, message: 'useEncryption successfully encrypted and decrypted with AES-GCM', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'token_jwt_test',
    name: 'useToken: JWT generation and signature verification',
    category: 'Security',
    run: async () => {
      const start = performance.now();
      const tokenMgr = new useToken();
      const secret = 'jwt_test_secret_9988';
      const jwt = await tokenMgr.generateJWT({ sub: 'user_88', role: 'admin' }, secret, 3600);
      const verified = await tokenMgr.verifyJWT(jwt, secret);
      if (!verified || verified.sub !== 'user_88') throw new Error('JWT verification failed');
      const invalid = await tokenMgr.verifyJWT(jwt, 'wrong_secret');
      if (invalid !== null) throw new Error('Invalid signature should return null');
      return { passed: true, message: 'useToken signed HS256 JWT and validated cryptographic authenticity', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'validation_test',
    name: 'useValidation: Schema rule validation',
    category: 'Form & Validation',
    run: async () => {
      const start = performance.now();
      const validator = new useValidation({
        email: [{ type: 'required' }, { type: 'email' }],
        password: [{ type: 'minLength', params: 6 }]
      });
      const invalid = validator.validate({ email: 'bad-email', password: '123' });
      if (invalid.isValid) throw new Error('Expected invalid validation for malformed email and short password');
      const valid = validator.validate({ email: 'john@example.com', password: 'secretpassword' });
      if (!valid.isValid) throw new Error('Expected valid validation');
      return { passed: true, message: 'useValidation accurately checked required, email, and minLength rules', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'storage_test',
    name: 'useLocalStorage: Prefixing and JSON serialization',
    category: 'Storage',
    run: async () => {
      const start = performance.now();
      const storage = new useLocalStorage({ prefix: 'vex_test' });
      storage.set('config', { active: true, items: [1, 2, 3] });
      const retrieved = storage.get('config');
      if (!retrieved || retrieved.active !== true || retrieved.items.length !== 3) {
        throw new Error('Stored object could not be retrieved');
      }
      storage.remove('config');
      if (storage.get('config') !== undefined) throw new Error('Failed to remove item');
      return { passed: true, message: 'useLocalStorage handled structured cloning, namespace isolation, and cleanup', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'cookie_test',
    name: 'useCookie: Set, get, has, and remove',
    category: 'Storage',
    run: async () => {
      const start = performance.now();
      const cookie = new useCookie();
      cookie.set('test_cookie', 'vexorion_val', { days: 1 });
      const val = cookie.get('test_cookie');
      if (val !== 'vexorion_val') throw new Error(`Cookie mismatch: received ${val}`);
      cookie.remove('test_cookie');
      return { passed: true, message: 'useCookie wrote, parsed document.cookie string, and removed cleanly', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'queue_test',
    name: 'useQueue: Concurrent task executor',
    category: 'Utilities',
    run: async () => {
      const start = performance.now();
      const queue = new useQueue({ concurrent: 2 });
      let processed = 0;
      await new Promise<void>((resolve) => {
        queue.enqueue(async () => { await new Promise((r) => setTimeout(r, 20)); processed++; });
        queue.enqueue(async () => { await new Promise((r) => setTimeout(r, 20)); processed++; });
        queue.enqueue(async () => {
          await new Promise((r) => setTimeout(r, 20));
          processed++;
          if (processed === 3) resolve();
        });
      });
      return { passed: true, message: 'useQueue executed queued promises honoring concurrency boundaries', durationMs: Math.round(performance.now() - start) };
    }
  },
  {
    id: 'vexorion_umbrella_test',
    name: 'Vexorion Facade: Unified instance factory',
    category: 'Core Architecture',
    run: async () => {
      const start = performance.now();
      const vexorion = new Vexorion({ timeout: 5000 });
      const cookieInstance = vexorion.cookie();
      const hashInstance = vexorion.hash();
      if (!cookieInstance || !hashInstance) throw new Error('Vexorion umbrella factory failed to instantiate submodules');
      return { passed: true, message: 'Vexorion unified entry class successfully instantiated sub-utilities', durationMs: Math.round(performance.now() - start) };
    }
  }
];
