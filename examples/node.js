import VexorionUUID from '@luxarionadm-design/vexorion';

console.log('=== VexorionUUID Node.js Example ===\n');

// Basic generation
const id1 = VexorionUUID.generate();
console.log('Basic UUID v4:', id1);
console.log('Is valid?', VexorionUUID.isUUID(id1));
console.log('Version:', VexorionUUID.getVersion(id1));

// Secure generation
const secure = VexorionUUID.generateSecure();
console.log('\nSecure UUID:', secure);

// Time-based generation
const v7 = VexorionUUID.generateV7();
console.log('\nUUID v7:', v7);
console.log('Timestamp:', new Date(VexorionUUID.getTimestamp(v7)).toISOString());

// With branding
VexorionUUID.configure({ branding: true, prefix: 'myapp-' });
const branded = VexorionUUID.generate();
console.log('\nBranded UUID:', branded);

// Formatting
console.log('\nCompact:', VexorionUUID.compact(branded));
console.log('Is branded?', VexorionUUID.isBranded(branded));

// Batch generation
const batch = VexorionUUID.generateBatch(3);
console.log('\nBatch:', batch);

// System info
console.log('\nOS Info:', VexorionUUID.getOSInfo());
console.log('Platform:', VexorionUUID.getPlatform());
console.log('Version:', VexorionUUID.getVersionNumber());
