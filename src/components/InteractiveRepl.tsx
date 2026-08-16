import React, { useState } from 'react';
import { Play, RotateCcw, Trash2, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import * as VexorionExports from '../index.js';

const CODE_PRESETS: { title: string; code: string }[] = [
  {
    title: 'AES-GCM Encryption & Hash',
    code: `// 1. Initialize WebCrypto AES-GCM Encryptor
const enc = new useEncryption({ secret: 'my-super-secret-key-32chars!' });
const encrypted = await enc.encrypt('Confidential User Information: API_KEY_9988');
console.log('Encrypted Base64:', encrypted);

const decrypted = await enc.decrypt(encrypted);
console.log('Decrypted Plaintext:', decrypted);

// 2. Cryptographic Hash
const hasher = new useHash();
const sha256 = await hasher.sha256('Vexorion Universal JS');
console.log('SHA-256 Digest:', sha256);`
  },
  {
    title: 'Signed JWT & OTP Tokens',
    code: `// Generate HS256 JWT Token
const token = new useToken();
const secret = 'jwt_secret_token_key_2026';
const jwt = await token.generateJWT({ userId: 1042, role: 'architect', plan: 'enterprise' }, secret, 3600);
console.log('Generated JWT:', jwt);

// Verify JWT Token
const verified = await token.verifyJWT(jwt, secret);
console.log('Decoded & Verified Payload:', verified);

// Generate 6-digit OTP
const otp = token.generateOTP(6, 300);
console.log('One-Time Password:', otp.code, 'Expires at:', new Date(otp.expiresAt).toLocaleTimeString());`
  },
  {
    title: 'Async Task Queue with Concurrency',
    code: `const queue = new useQueue({ concurrent: 2 });
console.log('Starting 4 async tasks with max 2 concurrent...');

const makeTask = (id, ms) => async () => {
  console.log(\`Task \${id} started (takes \${ms}ms)\`);
  await new Promise(r => setTimeout(r, ms));
  console.log(\`Task \${id} finished!\`);
  return \`Result \${id}\`;
};

queue.enqueue(makeTask(1, 400));
queue.enqueue(makeTask(2, 600));
queue.enqueue(makeTask(3, 300));
queue.enqueue(makeTask(4, 200));`
  },
  {
    title: 'LRU Cache & Memoization',
    code: `// 1. In-memory LRU Cache
const cache = new useCache({ maxSize: 3, ttl: 10000 });
cache.set('item1', { name: 'Alpha' });
cache.set('item2', { name: 'Beta' });
cache.set('item3', { name: 'Gamma' });
cache.set('item4', { name: 'Delta' }); // Evicts item1

console.log('Item 1 (should be undefined):', cache.get('item1'));
console.log('Item 4 (should be Delta):', cache.get('item4'));

// 2. Memoized expensive function
let computedCount = 0;
const expensiveCalc = createMemoize((n) => {
  computedCount++;
  return n * n * 42;
}, { maxSize: 10 });

console.log('Run 1 (n=8):', expensiveCalc(8), '(Computation count:', computedCount, ')');
console.log('Run 2 (n=8):', expensiveCalc(8), '(Computation count:', computedCount, ')');`
  },
  {
    title: 'Micro-Benchmark Profiler',
    code: `const profiler = new useProfiler({ name: 'BenchmarkSuite' });

console.log('Profiling 100,000 array sort operations...');
const { duration } = await profiler.profile('sort_benchmark', async () => {
  const data = Array.from({ length: 100000 }, () => Math.random());
  data.sort();
});

console.log(\`Done in \${duration.toFixed(2)} ms!\`);
console.log('All profile records:', profiler.getAllMeasures());`
  }
];

export function InteractiveRepl({ initialCode }: { initialCode?: string }) {
  const [code, setCode] = useState(
    initialCode ||
      `// Try any Vexorion utility right here!
const token = new useToken();
const otp = token.generateOTP(6);
console.log('Generated OTP:', otp.code);

const hasher = new useHash();
const digest = await hasher.sha256('Hello Vexorion');
console.log('SHA-256:', digest);`
  );
  const [logs, setLogs] = useState<{ type: 'log' | 'warn' | 'error' | 'result'; text: string; time: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    const newLogs: { type: 'log' | 'warn' | 'error' | 'result'; text: string; time: string }[] = [];

    const customConsole = {
      log: (...args: any[]) => {
        newLogs.push({
          type: 'log',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          time: new Date().toLocaleTimeString()
        });
      },
      warn: (...args: any[]) => {
        newLogs.push({
          type: 'warn',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          time: new Date().toLocaleTimeString()
        });
      },
      error: (...args: any[]) => {
        newLogs.push({
          type: 'error',
          text: args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' '),
          time: new Date().toLocaleTimeString()
        });
      }
    };

    try {
      // Build execution context injecting all Vexorion exports
      const contextKeys = Object.keys(VexorionExports);
      const contextValues = Object.values(VexorionExports);

      // Async wrapper
      const asyncFn = new Function(
        'console',
        ...contextKeys,
        `return (async () => {
          ${code}
        })();`
      );

      const result = await asyncFn(customConsole, ...contextValues);
      if (result !== undefined) {
        newLogs.push({
          type: 'result',
          text: `↪ ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`,
          time: new Date().toLocaleTimeString()
        });
      }
    } catch (err: any) {
      newLogs.push({
        type: 'error',
        text: `Runtime Error: ${err?.message || String(err)}`,
        time: new Date().toLocaleTimeString()
      });
    } finally {
      setLogs((prev) => [...newLogs, ...prev]);
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {CODE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setCode(p.code)}
              className="text-xs px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md border border-neutral-700 transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700 text-xs flex items-center gap-1"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 rounded-lg border border-neutral-700"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> {isRunning ? 'Running...' : 'Execute JS'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor Area */}
        <div className="flex flex-col bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden shadow-inner">
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              Interactive Editor (ES6+ / async / await)
            </span>
            <span className="text-[11px] text-neutral-500">Auto-injected Vexorion SDK</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={15}
            spellCheck={false}
            className="w-full p-4 bg-transparent text-neutral-100 font-mono text-xs leading-relaxed focus:outline-none resize-y border-none selection:bg-amber-500/30"
          />
        </div>

        {/* Live Output Console */}
        <div className="flex flex-col bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              Console Output ({logs.length})
            </span>
            <span className="text-[11px] text-neutral-500">Live output stream</span>
          </div>

          <div className="p-4 font-mono text-xs space-y-2 overflow-y-auto max-h-[380px] min-h-[250px] bg-neutral-950/80">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-12">
                <Terminal className="w-8 h-8 mb-2 opacity-40" />
                <p>Console is currently empty.</p>
                <p className="text-[11px] text-neutral-600 mt-1">Click "Execute JS" to run your code snippet.</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border text-xs whitespace-pre-wrap ${
                    log.type === 'error'
                      ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                      : log.type === 'warn'
                      ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                      : log.type === 'result'
                      ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300 font-semibold'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-200'
                  }`}
                >
                  <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                    <span>{log.type.toUpperCase()}</span>
                    <span>{log.time}</span>
                  </div>
                  <div>{log.text}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
