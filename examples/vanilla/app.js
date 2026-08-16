import Vexorion from 'vexorion';

// Initialize Vexorion
const vex = new Vexorion({
  baseURL: 'https://jsonplaceholder.typicode.com',
  prefix: 'vex_'
});

// ============ FETCH EXAMPLE ============
const api = vex.fetch();

window.fetchUsers = async function() {
  try {
    const result = await api.get('/users');
    displayFetchResult(result.data);
  } catch (error) {
    displayFetchResult(`❌ Error: ${error.message}`, true);
  }
};

window.fetchPosts = async function() {
  try {
    const result = await api.get('/posts?_limit=3');
    displayFetchResult(result.data);
  } catch (error) {
    displayFetchResult(`❌ Error: ${error.message}`, true);
  }
};

function displayFetchResult(data, isError = false) {
  const el = document.getElementById('fetchResult');
  if (isError) {
    el.innerHTML = `<span class="error">${data}</span>`;
    return;
  }
  el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

window.clearFetchResult = function() {
  document.getElementById('fetchResult').textContent = 'Click a button to fetch data';
};

// ============ STORAGE EXAMPLE ============
const storage = vex.localStorage();

window.saveStorage = function() {
  const key = document.getElementById('storageKey').value;
  const value = document.getElementById('storageValue').value;
  storage.set(key, value);
  document.getElementById('storageResult').textContent = `✅ Saved: ${key} = ${value}`;
};

window.getStorage = function() {
  const key = document.getElementById('storageKey').value;
  const value = storage.get(key);
  document.getElementById('storageResult').textContent = value !== null 
    ? `📖 ${key} = ${value}` 
    : '❌ Key not found';
};

window.removeStorage = function() {
  const key = document.getElementById('storageKey').value;
  storage.remove(key);
  document.getElementById('storageResult').textContent = `🗑️ Removed: ${key}`;
};

window.clearStorage = function() {
  storage.clear();
  document.getElementById('storageResult').textContent = '🧹 All storage cleared';
};

// ============ TOGGLE EXAMPLE ============
const darkMode = vex.toggle(false);

darkMode.subscribe((isDark) => {
  const el = document.getElementById('toggleResult');
  if (isDark) {
    document.body.style.background = '#1a1a1a';
    document.body.style.color = '#ffffff';
    el.textContent = '🌙 Dark Mode: ON';
    el.style.background = '#2d2d2d';
  } else {
    document.body.style.background = '#f5f5f5';
    document.body.style.color = '#000000';
    el.textContent = '☀️ Dark Mode: OFF';
    el.style.background = '#e9ecef';
  }
});

window.toggleDarkMode = function() {
  darkMode.toggle();
};

window.darkMode = darkMode;

// ============ DEBOUNCE EXAMPLE ============
const debouncer = new vex.debounce({ delay: 500 });
const debouncedSearch = debouncer.debounce((value) => {
  document.getElementById('debounceResult').textContent = `🔍 Searching: "${value}"`;
});

window.handleDebounceInput = function(value) {
  document.getElementById('debounceResult').textContent = `⏳ Typing...`;
  debouncedSearch(value);
};

// ============ FORM EXAMPLE ============
const form = vex.form({
  initialValues: { name: '', email: '', age: '' },
  validateOnChange: true,
  validate: (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    if (!values.email?.includes('@')) errors.email = 'Invalid email';
    if (values.age && (values.age < 1 || values.age > 150)) {
      errors.age = 'Age must be between 1 and 150';
    }
    return errors;
  },
  onSubmit: (values) => {
    document.getElementById('formResult').innerHTML = `
      ✅ Form submitted successfully!<br>
      <pre>${JSON.stringify(values, null, 2)}</pre>
    `;
  }
});

document.getElementById('demoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  form.handleSubmit(e);
});

// Auto-bind form inputs
document.getElementById('formName').addEventListener('input', (e) => {
  form.handleChange(e);
  updateFormStatus();
});
document.getElementById('formEmail').addEventListener('input', (e) => {
  form.handleChange(e);
  updateFormStatus();
});
document.getElementById('formAge').addEventListener('input', (e) => {
  form.handleChange(e);
  updateFormStatus();
});

function updateFormStatus() {
  const errors = form.getErrors();
  const el = document.getElementById('formResult');
  if (Object.keys(errors).length > 0) {
    el.innerHTML = `<span class="error">❌ ${Object.values(errors).join(', ')}</span>`;
  } else {
    el.innerHTML = '✅ All fields valid!';
    el.className = 'status success';
  }
}

// ============ LOGGER EXAMPLE ============
const logger = vex.logger({ prefix: 'DEMO', level: 'debug' });

logger.subscribe((data) => {
  const container = document.getElementById('logContainer');
  const entry = document.createElement('div');
  entry.textContent = `[${data.timestamp}] [${data.level}] ${data.args.join(' ')}`;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
});

window.logInfo = function() {
  logger.info('This is an info message', { user: 'John', action: 'login' });
};

window.logWarn = function() {
  logger.warn('This is a warning message', { timeout: 5000 });
};

window.logError = function() {
  logger.error('This is an error message', new Error('Something went wrong'));
};

window.clearLogs = function() {
  document.getElementById('logContainer').innerHTML = 'Logs cleared...';
};

// ============ WEBSOCKET EXAMPLE ============
let ws = null;

window.connectWebSocket = function() {
  ws = vex.webSocket('wss://echo.websocket.org', {
    reconnect: true,
    reconnectInterval: 3000
  });

  ws.on('open', () => {
    document.getElementById('wsStatus').textContent = '✅ Connected';
    document.getElementById('wsStatus').className = 'status success';
  });

  ws.on('message', (event) => {
    const messages = document.getElementById('wsMessages');
    messages.innerHTML += `<div>📩 Received: ${event.data}</div>`;
  });

  ws.on('close', () => {
    document.getElementById('wsStatus').textContent = '❌ Disconnected';
    document.getElementById('wsStatus').className = 'status error';
  });

  ws.on('error', (error) => {
    document.getElementById('wsStatus').textContent = `⚠️ Error: ${error.message}`;
  });

  ws.connect();
};

window.sendWebSocketMessage = function() {
  if (!ws || !ws.isConnected) {
    alert('WebSocket is not connected!');
    return;
  }
  const msg = `Hello from Vexorion! ${new Date().toLocaleTimeString()}`;
  ws.send(msg);
  document.getElementById('wsMessages').innerHTML += `<div>📤 Sent: ${msg}</div>`;
};

window.closeWebSocket = function() {
  if (ws) {
    ws.close();
    ws = null;
  }
};

// ============ TIMER EXAMPLE ============
const timer = vex.timer();

timer.subscribe(() => {
  document.getElementById('timerDisplay').textContent = timer.getFormatted();
});

window.timer = timer;

// ============ COUNTDOWN EXAMPLE ============
const countdown = vex.countdown(10, {
  onTick: (seconds) => {
    console.log(`Countdown: ${seconds}s`);
  },
  onComplete: () => {
    console.log('Countdown complete! 🎉');
  }
});

// Start countdown after 2 seconds
setTimeout(() => countdown.start(), 2000);

// ============ POLLING EXAMPLE ============
const poll = vex.polling(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  return response.json();
}, 5000, { immediate: true });

poll.on('success', (data) => {
  console.log('Polling data:', data);
});

// ============ MEDIA QUERY EXAMPLE ============
const isMobile = vex.mediaQuery('(max-width: 767px)');
isMobile.subscribe((matches) => {
  console.log('Is mobile:', matches);
});

// ============ WINDOW SIZE EXAMPLE ============
const windowSize = vex.windowSize();
windowSize.subscribe((size) => {
  console.log('Window size:', size);
});

console.log('🚀 Vexorion initialized!');
console.log('📚 Check the browser console for more examples.');
