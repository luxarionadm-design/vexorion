# @luxarionadm-design/vexorion

[![npm version](https://badge.fury.io/js/@luxarionadm-design%2Fvexorion.svg)](https://badge.fury.io/js/@luxarionadm-design%2Fvexorion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**VexorionUUID** - Modular UUID Generator dengan custom dependencies dan arsitektur yang fleksibel.

## ✨ Features

- ✅ Support UUID v1, v3, v4, v5, v6, v7
- 🔒 Cryptographically secure generation (Web Crypto / Node.js crypto)
- 🎨 Branding support (`vxr-` prefix)
- 🔄 Modular architecture with dependency injection
- 📦 Registry pattern for custom generators
- 🛠️ Utilities: Formatter, Converter, Validator
- 🌐 Cross-platform (Node.js, Browser, Bun, Deno)
- 💪 TypeScript support (JSDoc + types)
- 🧪 Fully tested

## 📦 Installation

```bash
npm install @luxarionadm-design/vexorion
```

## 🚀 Quick Start

```javascript
import VexorionUUID, { generate, generateV7, brand } from '@luxarionadm-design/vexorion';

// Generate UUID v4
const id = VexorionUUID.generate();

// Generate UUID v7 dengan branding
const id7 = VexorionUUID.generateV7();

// Generate secure UUID
const secure = VexorionUUID.generateSecure();

// With named imports
const short = generateShort();

// Custom configuration
VexorionUUID.configure({
  defaultVersion: 'v7',
  branding: true,
  prefix: 'myapp-'
});

// Register custom generator
VexorionUUID.registerGenerator('myGen', MyCustomGenerator, {
  default: true,
  aliases: ['custom']
});
```

## 📚 API Reference

Generation Methods

· generate(options) - Generate UUID (default v4)
· generateV1() - Time-based UUID
· generateV3(namespace, name) - Name-based (MD5)
· generateV4() - Random UUID
· generateV5(namespace, name) - Name-based (SHA-1)
· generateV6() - Time-ordered UUID
· generateV7() - Time-sorted UUID
· generateSecure() - Cryptographically secure
· generateShort() - Short alphanumeric ID
· generateNumeric(length) - Numeric ID
· generateHex(length) - Hex ID
· generateBatch(count, version) - Batch generation

Validation Methods

· isUUID(uuid) - Check if valid UUID
· validate(uuid) - Alias for isUUID
· validateDetailed(uuid) - Detailed validation with metadata
· getVersion(uuid) - Get UUID version
· getVariant(uuid) - Get UUID variant
· getInfo(uuid) - Complete UUID info

Formatting Methods

· compact(uuid) - Remove dashes
· expand(compact) - Add dashes
· brand(uuid, prefix) - Add brand prefix
· unbrand(uuid, prefix) - Remove brand prefix
· isBranded(uuid) - Check if branded

Conversion Methods

· toBytes(uuid) - Convert to Uint8Array
· fromBytes(bytes) - Convert from Uint8Array
· toBase64(uuid) - Convert to Base64
· fromBase64(base64) - Convert from Base64

Utility Methods

· getTimestamp(uuid) - Extract timestamp
· equals(uuid1, uuid2) - Compare UUIDs
· sort(uuids) - Sort UUIDs
· increment(uuid) - Increment UUID
· decrement(uuid) - Decrement UUID
· createNamespace(name) - Create custom namespace
· createFromString(str) - Deterministic UUID from string

System Methods

· getOSInfo() - Get OS information
· getPlatform() - Get platform name
· getNamespaces() - Get standard namespaces
· getVersionNumber() - Library version
· configure(options) - Configure global settings
· reset() - Reset singleton instance

## 🏗️ Architecture

```
VexorionUUID (Facade + Singleton)
    ├── GeneratorRegistry (Registry Pattern)
    │   ├── RandomGenerator (v4)
    │   ├── CryptoGenerator (Secure v4)
    │   └── TimeBasedGenerator (v1, v6, v7)
    ├── VexorionValidator (Validation)
    ├── Formatter (Formatting)
    ├── Converter (Conversion)
    └── OSDetector (Platform Detection)
```

## 🔧 Custom Generator

```javascript
import { BaseGenerator } from '@luxarionadm-design/vexorion';

class MyCustomGenerator extends BaseGenerator {
  constructor(options = {}) {
    super({ version: 'custom', ...options });
  }

  _generate(options) {
    // Your custom generation logic
    return 'custom-uuid';
  }

  getVersion() {
    return 'custom';
  }

  getName() {
    return 'MyCustomGenerator';
  }
}

// Register
VexorionUUID.registerGenerator('custom', MyCustomGenerator, {
  default: true,
  aliases: ['my']
});

// Use
const id = VexorionUUID.generate({ version: 'custom' });
```

## 🌐 Browser Support

```html
<script type="module">
  import { generate } from 'https://unpkg.com/@luxarionadm-design/vexorion';
  console.log(generate());
</script>
```

## 📝 License

MIT © luxarionadm-design
