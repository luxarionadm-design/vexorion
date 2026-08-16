<!-- Banner / Header -->
<p align="center">
  <img src="https://img.shields.io/badge/vexorion-1.0.1-blue?style=for-the-badge&logo=npm" alt="npm version" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge" alt="Build" />
  <img src="https://img.shields.io/badge/coverage-92%25-success?style=for-the-badge" alt="Coverage" />
</p>

<h1 align="center">⚡ Vexorion</h1>
<p align="center">
  <strong>Universal JavaScript Utility Library</strong><br />
  Lightweight · Modular · Zero Dependencies
</p>

<p align="center">
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-features">Features</a> •
  <a href="#-api">API</a> •
  <a href="#-license">License</a>
</p>

---

## 📦 Installation

```bash
npm install @luxarionadm-design/vexorion
```

Or with Yarn:

```bash
yarn add @luxarionadm-design/vexorion
```

Or with pnpm:

```bash
pnpm add @luxarionadm-design/vexorion
```

---

## 🚀 Usage

🔹 Import Individual Functions

```typescript
import { useFetch, useToggle, useForm } from '@luxarionadm-design/vexorion';

// Fetch API
const api = new useFetch({ baseURL: 'https://api.example.com' });
const users = await api.get('/users');

// Toggle state
const darkMode = useToggle(false);
darkMode.toggle();
console.log(darkMode.value); // true

// Form management
const form = useForm({
  initialValues: { name: '', email: '' },
  onSubmit: (values) => console.log('Submit:', values)
});
```

## 🔸 Using Vexorion Entry Point

```typescript
import Vexorion from '@luxarionadm-design/vexorion';

const vex = new Vexorion({
  baseURL: 'https://api.example.com',
  prefix: 'app_'
});

// Storage
vex.localStorage().set('user', { name: 'Budi' });

// Toggle with subscription
const darkMode = vex.toggle(false);
darkMode.subscribe((isDark) => {
  document.body.classList.toggle('dark', isDark);
});

// Form
const form = vex.form({
  initialValues: { name: '', email: '' },
  onSubmit: (values) => console.log(values)
});
```

---

## ✨ Features

Category Utilities
🌐 Network Fetch, WebSocket, SSE, Polling
💾 Storage LocalStorage, SessionStorage, Cookie
🎛️ UI Utilities Toggle
📝 Form Form Management, Validation
⚡ Performance Debounce, Throttle, Memoize
🧰 Utilities Logger, Cache, Queue, EventEmitter
🔒 Security Encryption, Hash, Token
📁 File FileUpload, FileReader
🐞 Debug Profiler, Timer

---

## 📖 API

useFetch(options)

Create an HTTP client with built-in interceptors.

```typescript
const api = useFetch({ baseURL: 'https://api.example.com' });
await api.get('/users');
await api.post('/users', { name: 'Budi' });
```

useToggle(initialState)

Manage boolean state with subscription.

```typescript
const toggle = useToggle(false);
toggle.toggle();
toggle.set(true);
toggle.subscribe((value) => console.log(value));
```

useForm(config)

Form handling with validation.

```typescript
const form = useForm({
  initialValues: { email: '' },
  validate: (values) => {
    if (!values.email) return { email: 'Email is required' };
  },
  onSubmit: (values) => console.log(values)
});
```

---

🛠️ Development

```bash
# Clone repository
git clone https://github.com/luxarionadm-design/vexorion.git

# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build

# Watch mode
npm run test:watch
```

---

## 🤝 Contributing

Contributions are welcome! Please read our Contributing Guide first.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing)
5. Open a Pull Request

---

## 📄 License

MIT © luxarionadm-design

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/luxarionadm-design">luxarionadm-design</a>
</p>
