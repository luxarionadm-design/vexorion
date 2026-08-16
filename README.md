# Vexorion

Universal JavaScript Utility Library

## Installation

```bash
npm install vexorion
```

## Usage

### Method 1: Import Individual

```javascript
import { useFetch, useToggle, useForm } from 'vexorion';

const api = new useFetch({ baseURL: 'https://api.example.com' });
const data = await api.get('/users');
```

### Method 2: Using Vexorion Entry Point

```javascript
import Vexorion from 'vexorion';

const vex = new Vexorion({
  baseURL: 'https://api.example.com',
  prefix: 'app_'
});

// Fetch
const api = vex.fetch();
const { data } = await api.get('/users');

// Storage
const storage = vex.localStorage();
storage.set('user', { name: 'Budi' });

// Toggle
const darkMode = vex.toggle(false);
darkMode.subscribe((isDark) => console.log('Dark mode:', isDark));
darkMode.toggle();

// Form
const form = vex.form({
  initialValues: { name: '', email: '' },
  onSubmit: (values) => console.log('Submit:', values)
});
```

## Features

- **Network**: Fetch, WebSocket, SSE, Polling
- **Storage**: LocalStorage, SessionStorage, Cookie
- **UI**: Toggle, ClickOutside, Hover, Focus, Scroll, Draggable
- **Form**: Form Management, Validation
- **Performance**: Debounce, Throttle, Memoize
- **Utilities**: Logger, Cache, Queue, EventEmitter
- **Security**: Encryption, Hash, Token
- **File**: FileUpload, FileReader
- **Debug**: Profiler, Timer
- **Media & Sensors**: MediaQuery, WindowSize, Geolocation

## License

MIT
