import React, { useState } from 'react';
import { Layers, ShieldCheck, Zap, Package, Feather, Check, Copy, Terminal, Cpu, FileCode2 } from 'lucide-react';

export function ArchitectureView() {
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleCopyCmd = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" /> Core Architecture & Engine Design
        </div>
        <h2 className="text-xl font-bold text-neutral-100">
          Zero External Runtime Dependencies. 100% Tree-Shakeable ESM & CJS.
        </h2>
        <p className="text-xs text-neutral-400 max-w-3xl leading-relaxed">
          Vexorion is engineered from the ground up to replace dozens of single-purpose npm packages with a coherent, standard-compliant, type-safe suite of 34 modern utilities built directly on native Web standards (Web Crypto API, Fetch API, Performance API, BroadcastChannel, EventSource, and WebSockets).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800 font-mono text-xs text-neutral-300">
            <Terminal className="w-3.5 h-3.5 mr-2 text-amber-400" />
            npm install vexorion
          </div>
          <button
            onClick={() => handleCopyCmd('npm install vexorion')}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 flex items-center gap-1.5"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCmd ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Feather className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-200">Zero Dependencies</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Eliminate dependency hell and security supply chain vulnerabilities. No lodash, no axios, no crypto-js bloat.
          </p>
        </div>

        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-200">Micro-Bundle Tree Shaking</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Import only what you use (e.g. <code className="text-amber-400 font-mono">import &#123; useDebounce &#125; from 'vexorion'</code>). Individual utilities range from 0.4 KB to 2.1 KB minified + gzipped.
          </p>
        </div>

        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-200">Browser & Node.js Universal</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Compatible across modern browsers, Node.js 18+, Bun, Deno, Next.js, Vite, and Remix with full SSR safety guards.
          </p>
        </div>
      </div>

      {/* Module Inventory Matrix */}
      <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-amber-400" />
          34 Core Modules Breakdown by Architecture Domain
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {[
            { cat: 'Network Engine', count: '4 modules', list: 'useFetch, useWebSocket, useSSE, usePolling' },
            { cat: 'Storage & Cookies', count: '3 modules', list: 'useLocalStorage, useSessionStorage, useCookie' },
            { cat: 'UI & DOM Control', count: '6 modules', list: 'useToggle, useClickOutside, useHover, useFocus, useScroll, useDraggable' },
            { cat: 'Forms & Validation', count: '2 modules', list: 'useForm, useValidation (9 built-in rules)' },
            { cat: 'Performance Optimization', count: '3 modules', list: 'useDebounce, useThrottle, useMemoize (LRU)' },
            { cat: 'Utilities & Queuing', count: '4 modules', list: 'useLogger, useCache, useQueue, useEventEmitter' },
            { cat: 'Security & Crypto', count: '3 modules', list: 'useEncryption (AES-GCM), useHash (SHA-256), useToken (JWT/OTP)' },
            { cat: 'File & Binary IO', count: '2 modules', list: 'useFileUpload, useFileReader' },
            { cat: 'Device & Media', count: '3 modules', list: 'useMediaQuery, useWindowSize, useGeolocation' },
            { cat: 'Timers & Benchmarking', count: '5 modules', list: 'useTimer, useCountdown, useInterval, useTimeout, useProfiler' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-300">{item.cat}</span>
                <span className="text-[10px] text-neutral-500">{item.count}</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">{item.list}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
