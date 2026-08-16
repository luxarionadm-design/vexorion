# Migration Guide: v1.0.1 → v2.0.0

## Breaking Changes

### Import Changes

**v1.0.1:**
```javascript
const Vexorion = require('@luxarionadm-design/vexorion');
// or
import Vexorion from '@luxarionadm-design/vexorion';
```

v2.0.0:

```javascript
import VexorionUUID, { generate } from '@luxarionadm-design/vexorion';
// or
const VexorionUUID = require('@luxarionadm-design/vexorion');
```

API Changes

v1.0.1 v2.0.0
Vexorion.generate() VexorionUUID.generate()
Vexorion.validate() VexorionUUID.isUUID()
Vexorion.format() VexorionUUID.compact()
- VexorionUUID.generateV7() (new)
- VexorionUUID.generateSecure() (new)

Configuration

v1.0.1:

```javascript
Vexorion.config({ ... });
```

v2.0.0:

```javascript
VexorionUUID.configure({ ... });
```

Quick Migration Example

```javascript
// v1.0.1
import Vexorion from '@luxarionadm-design/vexorion';
const id = Vexorion.generate();
const isValid = Vexorion.validate(id);

// v2.0.0
import VexorionUUID from '@luxarionadm-design/vexorion';
const id = VexorionUUID.generate();
const isValid = VexorionUUID.isUUID(id);
```
