import Vexorion from '../../dist/index.mjs';

const vex = new Vexorion({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

console.log('🚀 Vexorion Node.js Example\n');

console.log('📡 Fetch Example:');
const api = vex.fetch();

api.get('/users/1')
  .then(result => {
    console.log('User:', result.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

console.log('\n💾 Storage Example:');
const storage = vex.localStorage();
storage.set('node-test', 'Hello from Node!');
console.log('Stored value:', storage.get('node-test'));

console.log('\n🔐 Encryption Example:');
const encryption = vex.encryption({ secret: 'my-secret-key' });

(async () => {
  const text = 'Sensitive data';
  const encrypted = await encryption.encrypt(text);
  console.log('Original:', text);
  console.log('Encrypted:', encrypted);

  const decrypted = await encryption.decrypt(encrypted);
  console.log('Decrypted:', decrypted);
})();

console.log('\n🎫 Token Example:');
const token = vex.token();
const jwt = token.generateJWT({ userId: 123, role: 'admin' }, 'jwt-secret');
console.log('JWT:', jwt);

const verified = token.verifyJWT(jwt, 'jwt-secret');
console.log('Verified:', verified);

console.log('\n🔑 Hash Example:');
const hash = vex.hash();
(async () => {
  const sha256 = await hash.sha256('Hello World');
  console.log('SHA-256:', sha256);
})();

console.log('\n📋 Logger Example:');
const logger = vex.logger({ prefix: 'NODE', level: 'debug' });
logger.info('Node.js example running');
logger.warn('This is a warning');
logger.error('This is an error');

console.log('\n⏰ Timer Example:');
const timer = vex.timer();
timer.start();

setTimeout(() => {
  timer.stop();
  console.log('Elapsed time:', timer.getFormatted());
}, 1000);

console.log('\n📊 Queue Example:');
const queue = vex.queue({ concurrent: 2 });

for (let i = 1; i <= 5; i++) {
  queue.enqueue(async () => {
    console.log(`Task ${i} started`);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Task ${i} completed`);
  });
}

console.log('\n🔄 Polling Example:');
let count = 0;
const poll = vex.polling(async () => {
  count++;
  console.log(`Poll #${count}`);
  return { count };
}, 2000, { immediate: true });

setTimeout(() => {
  poll.stop();
  console.log('Polling stopped');
}, 7000);

console.log('\n✅ All examples completed!');
