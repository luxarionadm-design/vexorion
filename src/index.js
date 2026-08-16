/**
 * Vexorion - Universal JavaScript Utility Library
 * Entry point that exports all public APIs
 */

export { Vexorion } from './core/Vexorion.js';
export { Module } from './core/Module.js';
export { Observable } from './core/Observable.js';
export { Singleton } from './core/Singleton.js';

export { FetchModule } from './modules/fetch/index.js';
export { StorageModule } from './modules/storage/index.js';
export { ToggleModule } from './modules/toggle/index.js';
export { FormModule } from './modules/form/index.js';
export { DebounceModule } from './modules/debounce/index.js';
export { ThrottleModule } from './modules/throttle/index.js';
export { LoggerModule } from './modules/logger/index.js';
export { TimerModule } from './modules/timer/index.js';
export { QueueModule } from './modules/queue/index.js';
export { EncryptionModule } from './modules/encryption/index.js';
export { HashModule } from './modules/hash/index.js';
export { TokenModule } from './modules/token/index.js';
export { EventEmitterModule } from './modules/event-emitter/index.js';
export { CacheModule } from './modules/cache/index.js';
export { PollingModule } from './modules/polling/index.js';
export { WebSocketModule } from './modules/websocket/index.js';
export { FileModule } from './modules/file/index.js';
export { ProfilerModule } from './modules/profiler/index.js';

export {
    MathUtils,
    DEG2RAD,
    RAD2DEG,
    generateUUID,
    clamp,
    euclideanModulo,
    mapLinear,
    inverseLerp,
    lerp,
    damp,
    pingpong,
    smoothstep,
    smootherstep,
    randInt,
    randFloat,
    randFloatSpread,
    seededRandom,
    degToRad,
    radToDeg,
    isPowerOfTwo,
    ceilPowerOfTwo,
    floorPowerOfTwo,
    setQuaternionFromProperEuler,
    normalize,
    denormalize
} from './utils/MathUtils.js';

export { Vector2 } from './math/Vector2.js';
export { Vector3 } from './math/Vector3.js';
export { Vector4 } from './math/Vector4.js';
export { Quaternion } from './math/Quaternion.js';
export { Matrix2 } from './math/Matrix2.js';
export { Matrix3 } from './math/Matrix3.js';
export { Matrix4 } from './math/Matrix4.js';
export { Color } from './math/Color.js';
export { ColorSpace } from './math/ColorSpace.js';

export * from './utils/helpers.js';
export * from './utils/validators.js';
export * from './utils/formatters.js';

export * from './shared/constants.js';
export * from './shared/types.js';
export * from './shared/errors.js';
