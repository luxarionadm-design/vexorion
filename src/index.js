import VexorionUUID from './core/VexorionUUID.js';
import { NAMESPACES, VERSION } from './constants/Namespaces.js';
import VexorionValidator from './core/VexorionValidator.js';
import GeneratorRegistry from './core/GeneratorRegistry.js';
import RandomGenerator from './generators/RandomGenerator.js';
import CryptoGenerator from './generators/CryptoGenerator.js';
import TimeBasedGenerator from './generators/TimeBasedGenerator.js';
import Formatter from './utils/Formatter.js';
import Converter from './utils/Converter.js';
import OSDetector from './utils/OSDetector.js';

export {
  VexorionUUID,
  VexorionValidator,
  GeneratorRegistry,
  RandomGenerator,
  CryptoGenerator,
  TimeBasedGenerator,
  Formatter,
  Converter,
  OSDetector,
  NAMESPACES,
  VERSION
};

export const generate = VexorionUUID.generate.bind(VexorionUUID);
export const generateSecure = VexorionUUID.generateSecure.bind(VexorionUUID);
export const generateV1 = VexorionUUID.generateV1.bind(VexorionUUID);
export const generateV3 = VexorionUUID.generateV3.bind(VexorionUUID);
export const generateV4 = VexorionUUID.generateV4.bind(VexorionUUID);
export const generateV5 = VexorionUUID.generateV5.bind(VexorionUUID);
export const generateV6 = VexorionUUID.generateV6.bind(VexorionUUID);
export const generateV7 = VexorionUUID.generateV7.bind(VexorionUUID);
export const generateShort = VexorionUUID.generateShort.bind(VexorionUUID);
export const generateNumeric = VexorionUUID.generateNumeric.bind(VexorionUUID);
export const generateHex = VexorionUUID.generateHex.bind(VexorionUUID);
export const generateBatch = VexorionUUID.generateBatch.bind(VexorionUUID);

export const isUUID = VexorionUUID.isUUID.bind(VexorionUUID);
export const validate = VexorionUUID.validate.bind(VexorionUUID);
export const validateDetailed = VexorionUUID.validateDetailed.bind(VexorionUUID);

export const compact = VexorionUUID.compact.bind(VexorionUUID);
export const expand = VexorionUUID.expand.bind(VexorionUUID);
export const brand = VexorionUUID.brand.bind(VexorionUUID);
export const unbrand = VexorionUUID.unbrand.bind(VexorionUUID);
export const isBranded = VexorionUUID.isBranded.bind(VexorionUUID);

export const toBytes = VexorionUUID.toBytes.bind(VexorionUUID);
export const fromBytes = VexorionUUID.fromBytes.bind(VexorionUUID);
export const toBase64 = VexorionUUID.toBase64.bind(VexorionUUID);
export const fromBase64 = VexorionUUID.fromBase64.bind(VexorionUUID);

export const getVersion = VexorionUUID.getVersion.bind(VexorionUUID);
export const getVariant = VexorionUUID.getVariant.bind(VexorionUUID);
export const getTimestamp = VexorionUUID.getTimestamp.bind(VexorionUUID);
export const getInfo = VexorionUUID.getInfo.bind(VexorionUUID);
export const getOSInfo = VexorionUUID.getOSInfo.bind(VexorionUUID);
export const getPlatform = VexorionUUID.getPlatform.bind(VexorionUUID);
export const getNamespaces = VexorionUUID.getNamespaces.bind(VexorionUUID);
export const getVersionNumber = VexorionUUID.getVersionNumber.bind(VexorionUUID);

export const isV3 = VexorionUUID.isV3.bind(VexorionUUID);
export const isV4 = VexorionUUID.isV4.bind(VexorionUUID);
export const isV5 = VexorionUUID.isV5.bind(VexorionUUID);
export const isV6 = VexorionUUID.isV6.bind(VexorionUUID);
export const isV7 = VexorionUUID.isV7.bind(VexorionUUID);

export const equals = VexorionUUID.equals.bind(VexorionUUID);
export const sort = VexorionUUID.sort.bind(VexorionUUID);
export const increment = VexorionUUID.increment.bind(VexorionUUID);
export const decrement = VexorionUUID.decrement.bind(VexorionUUID);
export const createNamespace = VexorionUUID.createNamespace.bind(VexorionUUID);
export const createFromString = VexorionUUID.createFromString.bind(VexorionUUID);
export const random = VexorionUUID.random.bind(VexorionUUID);
export const create = VexorionUUID.create.bind(VexorionUUID);

export const registerGenerator = VexorionUUID.registerGenerator.bind(VexorionUUID);
export const getGenerator = VexorionUUID.getGenerator.bind(VexorionUUID);
export const getRegistry = VexorionUUID.getRegistry.bind(VexorionUUID);
export const configure = VexorionUUID.configure.bind(VexorionUUID);
export const reset = VexorionUUID.reset.bind(VexorionUUID);

export default VexorionUUID;
