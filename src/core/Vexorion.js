import { FetchModule } from '../modules/fetch/index.js';
import { StorageModule } from '../modules/storage/index.js';
import { ToggleModule } from '../modules/toggle/index.js';
import { FormModule } from '../modules/form/index.js';
import { DebounceModule } from '../modules/debounce/index.js';
import { ThrottleModule } from '../modules/throttle/index.js';
import { LoggerModule } from '../modules/logger/index.js';
import { TimerModule } from '../modules/timer/index.js';
import { QueueModule } from '../modules/queue/index.js';
import { EncryptionModule } from '../modules/encryption/index.js';
import { HashModule } from '../modules/hash/index.js';
import { TokenModule } from '../modules/token/index.js';
import { EventEmitterModule } from '../modules/event-emitter/index.js';
import { CacheModule } from '../modules/cache/index.js';
import { PollingModule } from '../modules/polling/index.js';
import { WebSocketModule } from '../modules/websocket/index.js';
import { FileModule } from '../modules/file/index.js';
import { ProfilerModule } from '../modules/profiler/index.js';
import { Singleton } from './Singleton.js';
import { MathUtils } from '../utils/MathUtils.js';

export class Vexorion extends Singleton {
  #config = null;
  #instances = new Map();
  #initialized = false;

  constructor(config = {}) {
    super();
    
    if (Vexorion.instance) {
      return Vexorion.instance;
    }

    this.#config = this.#validateConfig(config);
    this.#initialized = true;
    
    Object.freeze(this);
    
    Vexorion.instance = this;
  }

  static getInstance(config = {}) {
    if (!Vexorion.instance) {
      Vexorion.instance = new Vexorion(config);
    }
    return Vexorion.instance;
  }

  #validateConfig(config) {
    const validated = {
      baseURL: config.baseURL || '',
      prefix: config.prefix || 'vx_',
      logLevel: config.logLevel || 'info',
      timeout: config.timeout || 30000,
      ...config
    };

    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(validated.logLevel)) {
      throw new Error(`Invalid logLevel. Must be one of: ${validLogLevels.join(', ')}`);
    }

    if (typeof validated.timeout !== 'number' || validated.timeout < 0) {
      throw new Error('Timeout must be a positive number');
    }

    return validated;
  }

  getConfig() {
    return { ...this.#config };
  }

  updateConfig(newConfig) {
    this.#config = {
      ...this.#config,
      ...this.#validateConfig(newConfig)
    };
  }

  #getInstance(key, factory) {
    if (!this.#instances.has(key)) {
      this.#instances.set(key, factory());
    }
    return this.#instances.get(key);
  }

  fetch(config = {}) {
    const fetchConfig = {
      baseURL: this.#config.baseURL,
      timeout: this.#config.timeout,
      ...config
    };
    
    return this.#getInstance(
      `fetch:${JSON.stringify(fetchConfig)}`,
      () => new FetchModule(fetchConfig)
    );
  }

  storage(type = 'local', config = {}) {
    const storageConfig = {
      prefix: this.#config.prefix,
      ...config
    };
    
    return new StorageModule(type, storageConfig);
  }

  toggle(initialValue = false) {
    return new ToggleModule(initialValue);
  }

  form(config) {
    return new FormModule(config);
  }

  debounce(config = {}) {
    return new DebounceModule(config);
  }

  throttle(config = {}) {
    return new ThrottleModule(config);
  }

  logger(config = {}) {
    const loggerConfig = {
      prefix: config.prefix || 'VEX',
      level: config.level || this.#config.logLevel,
      ...config
    };
    
    return new LoggerModule(loggerConfig);
  }

  timer(config = {}) {
    return new TimerModule(config);
  }

  queue(config = {}) {
    return new QueueModule(config);
  }

  encryption(config = {}) {
    return new EncryptionModule(config);
  }

  hash(config = {}) {
    return new HashModule(config);
  }

  token(config = {}) {
    return new TokenModule(config);
  }

  eventEmitter(config = {}) {
    return new EventEmitterModule(config);
  }

  cache(config = {}) {
    return new CacheModule(config);
  }

  polling(fn, interval, config = {}) {
    return new PollingModule(fn, interval, config);
  }

  webSocket(url, config = {}) {
    return new WebSocketModule(url, config);
  }

  file(config = {}) {
    return new FileModule(config);
  }

  profiler(config = {}) {
    return new ProfilerModule(config);
  }

  getMath() {
    return MathUtils;
  }

  uuid() {
    return MathUtils.generateUUID();
  }

  clamp(value, min, max) {
    return MathUtils.clamp(value, min, max);
  }

  lerp(x, y, t) {
    return MathUtils.lerp(x, y, t);
  }

  destroy() {
    for (const [key, instance] of this.#instances) {
      if (instance.destroy && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    }
    this.#instances.clear();
    this.#initialized = false;
  }

  isInitialized() {
    return this.#initialized;
  }

  static hasInstance() {
    return !!Vexorion.instance;
  }

  static getGlobalInstance() {
    return Vexorion.instance || null;
  }

  static destroyGlobalInstance() {
    if (Vexorion.instance) {
      Vexorion.instance.destroy();
      Vexorion.instance = null;
    }
  }
}

export const vex = Vexorion.getInstance();
