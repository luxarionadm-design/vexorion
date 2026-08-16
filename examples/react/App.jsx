import React, { useState, useEffect } from 'react';
import Vexorion from 'vexorion';

const vex = new Vexorion({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [darkMode, setDarkMode] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const api = vex.fetch();
      const result = await api.get('/users?_limit=5');
      setUsers(result.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Form handling
  const form = vex.form({
    initialValues: { name: '', email: '' },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = 'Name required';
      if (!values.email) errors.email = 'Email required';
      return errors;
    },
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      alert('Form submitted! Check console.');
    }
  });

  // Toggle
  const toggle = vex.toggle(false);
  toggle.subscribe((isDark) => {
    setDarkMode(isDark);
    document.body.style.background = isDark ? '#1a1a1a' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
  });

  // Debounce search
  const debouncer = vex.debounce({ delay: 300 });
  const debouncedSearch = debouncer.debounce((value) => {
    console.log('Searching for:', value);
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🚀 Vexorion React Example</h1>
      
      {/* Dark Mode Toggle */}
      <button onClick={() => toggle.toggle()}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Users */}
      <div style={{ margin: '20px 0' }}>
        <h2>Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name} - {user.email}</li>
            ))}
          </ul>
        )}
        <button onClick={fetchUsers}>Refresh Users</button>
      </div>

      {/* Form */}
      <div style={{ margin: '20px 0' }}>
        <h2>Form</h2>
        <input
          name="name"
          placeholder="Name"
          onChange={(e) => {
            form.handleChange(e);
            setFormData({ ...formData, name: e.target.value });
          }}
        />
        <input
          name="email"
          placeholder="Email"
          onChange={(e) => {
            form.handleChange(e);
            setFormData({ ...formData, email: e.target.value });
          }}
        />
        <button onClick={(e) => form.handleSubmit(e)}>Submit</button>
        {Object.keys(form.getErrors()).length > 0 && (
          <p style={{ color: 'red' }}>
            {Object.values(form.getErrors()).join(', ')}
          </p>
        )}
      </div>

      {/* Search with Debounce */}
      <div style={{ margin: '20px 0' }}>
        <h2>Search</h2>
        <input
          placeholder="Type to search..."
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      {/* WebSocket */}
      <div style={{ margin: '20px 0' }}>
        <h2>WebSocket</h2>
        <button onClick={() => {
          const ws = vex.webSocket('wss://echo.websocket.org');
          ws.on('open', () => console.log('WebSocket connected'));
          ws.on('message', (event) => console.log('WS Message:', event.data));
          ws.connect();
        }}>
          Connect WebSocket
        </button>
      </div>

      {/* Timer */}
      <div style={{ margin: '20px 0' }}>
        <h2>Timer</h2>
        <button onClick={() => {
          const timer = vex.timer();
          timer.start();
          setInterval(() => {
            document.getElementById('timerDisplay').textContent = timer.getFormatted();
          }, 100);
        }}>
          Start Timer
        </button>
        <div id="timerDisplay">00:00:00.000</div>
      </div>
    </div>
  );
}

export default App;
