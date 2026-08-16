<template>
  <div id="app">
    <h1>🚀 Vexorion Vue Example</h1>
    
    <!-- Dark Mode Toggle -->
    <button @click="toggleDarkMode">
      {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
    </button>

    <!-- Users -->
    <div class="section">
      <h2>Users</h2>
      <button @click="fetchUsers">Refresh</button>
      <ul v-if="!loading">
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
        </li>
      </ul>
      <p v-else>Loading...</p>
    </div>

    <!-- Form -->
    <div class="section">
      <h2>Form</h2>
      <form @submit.prevent="handleSubmit">
        <input v-model="form.name" placeholder="Name" />
        <input v-model="form.email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
      <p v-if="formErrors.length" style="color: red">
        {{ formErrors.join(', ') }}
      </p>
    </div>

    <!-- Debounce Search -->
    <div class="section">
      <h2>Search</h2>
      <input v-model="searchQuery" placeholder="Type to search..." />
    </div>

    <!-- Timer -->
    <div class="section">
      <h2>Timer</h2>
      <button @click="startTimer">Start</button>
      <button @click="stopTimer">Stop</button>
      <button @click="resetTimer">Reset</button>
      <div>{{ timerDisplay }}</div>
    </div>

    <!-- Logger -->
    <div class="section">
      <h2>Logger</h2>
      <button @click="logInfo">Info</button>
      <button @click="logWarn">Warn</button>
      <button @click="logError">Error</button>
      <div class="log-container">
        <div v-for="(log, i) in logs" :key="i">
          [{{ log.timestamp }}] [{{ log.level }}] {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import Vexorion from 'vexorion';

const vex = new Vexorion({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

export default {
  name: 'App',
  setup() {
    const darkMode = ref(false);
    const users = ref([]);
    const loading = ref(false);
    const form = ref({ name: '', email: '' });
    const formErrors = ref([]);
    const searchQuery = ref('');
    const timerDisplay = ref('00:00:00.000');
    const logs = ref([]);

    // Toggle
    const toggle = vex.toggle(false);
    toggle.subscribe((isDark) => {
      darkMode.value = isDark;
      document.body.style.background = isDark ? '#1a1a1a' : '#ffffff';
      document.body.style.color = isDark ? '#ffffff' : '#000000';
    });

    window.toggleDarkMode = () => toggle.toggle();

    // Fetch
    const api = vex.fetch();
    const fetchUsers = async () => {
      loading.value = true;
      try {
        const result = await api.get('/users?_limit=5');
        users.value = result.data;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };
    fetchUsers();

    // Form
    const formValidator = vex.form({
      initialValues: { name: '', email: '' },
      validate: (values) => {
        const errors = {};
        if (!values.name) errors.name = 'Name required';
        if (!values.email) errors.email = 'Email required';
        return errors;
      },
      onSubmit: (values) => {
        console.log('Form submitted:', values);
        alert('Form submitted!');
      }
    });

    const handleSubmit = (e) => {
      formValidator.handleSubmit(e);
      formErrors.value = Object.values(formValidator.getErrors());
    };

    // Debounce
    const debouncer = vex.debounce({ delay: 300 });
    const debouncedSearch = debouncer.debounce((value) => {
      console.log('Searching for:', value);
    });

    watch(searchQuery, (newVal) => {
      debouncedSearch(newVal);
    });

    // Timer
    const timer = vex.timer();
    let timerInterval = null;

    const startTimer = () => {
      timer.start();
      timerInterval = setInterval(() => {
        timerDisplay.value = timer.getFormatted();
      }, 100);
    };

    const stopTimer = () => {
      timer.stop();
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };

    const resetTimer = () => {
      timer.reset();
      timerDisplay.value = timer.getFormatted();
    };

    // Logger
    const logger = vex.logger({ prefix: 'VUE', level: 'debug' });
    logger.subscribe((data) => {
      logs.value.unshift({
        timestamp: data.timestamp,
        level: data.level,
        message: data.args.join(' ')
      });
      if (logs.value.length > 50) logs.value.pop();
    });

    const logInfo = () => logger.info('This is an info message');
    const logWarn = () => logger.warn('This is a warning');
    const logError = () => logger.error('This is an error');

    return {
      darkMode,
      users,
      loading,
      form,
      formErrors,
      searchQuery,
      timerDisplay,
      logs,
      toggleDarkMode: () => toggle.toggle(),
      fetchUsers,
      handleSubmit,
      startTimer,
      stopTimer,
      resetTimer,
      logInfo,
      logWarn,
      logError
    };
  }
};
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; background: #f5f5f5; }
#app { max-width: 800px; margin: 0 auto; }
.section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
h2 { margin-bottom: 12px; }
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  margin: 4px;
}
button:hover { background: #0056b3; }
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 8px 0;
}
ul { list-style: none; padding: 0; }
li { padding: 8px; border-bottom: 1px solid #eee; }
.log-container {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}
</style>
