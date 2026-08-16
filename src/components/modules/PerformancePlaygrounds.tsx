import React, { useState, useRef } from 'react';
import { createDebounce } from '../../core/Debounce.js';
import { createThrottle } from '../../core/Throttle.js';
import { createMemoize } from '../../core/Memoize.js';
import { Zap, Play, RotateCcw, Activity } from 'lucide-react';

export function PerformancePlaygrounds({ moduleId }: { moduleId: string }) {
  // Debounce state
  const [debouncedInput, setDebouncedInput] = useState('');
  const [debounceResult, setDebounceResult] = useState('');
  const [debounceCount, setDebounceCount] = useState(0);
  const [rawInputCount, setRawInputCount] = useState(0);

  const debouncedFn = useRef(
    createDebounce((val: string) => {
      setDebounceResult(val);
      setDebounceCount((c) => c + 1);
    }, 400)
  );

  const handleDebounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDebouncedInput(val);
    setRawInputCount((c) => c + 1);
    debouncedFn.current(val);
  };

  // Throttle state
  const [throttleClicks, setThrottleClicks] = useState(0);
  const [throttleExecuted, setThrottleExecuted] = useState(0);

  const throttledFn = useRef(
    createThrottle(() => {
      setThrottleExecuted((c) => c + 1);
    }, 800)
  );

  const handleThrottleClick = () => {
    setThrottleClicks((c) => c + 1);
    throttledFn.current();
  };

  // Memoize state
  const [memoInput, setMemoInput] = useState(38);
  const [memoResults, setMemoResults] = useState<{ n: number; time: number; cached: boolean; result: number }[]>([]);

  const expensiveFib = useRef(
    createMemoize((n: number): number => {
      const calc = (num: number): number => (num <= 1 ? num : calc(num - 1) + calc(num - 2));
      return calc(n);
    }, { maxSize: 50, ttl: 60000 })
  );

  const handleRunMemo = () => {
    const start = performance.now();
    const res = expensiveFib.current(memoInput);
    const duration = performance.now() - start;
    const isCached = duration < 0.2;

    setMemoResults((prev) => [
      { n: memoInput, time: parseFloat(duration.toFixed(3)), cached: isCached, result: res },
      ...prev.slice(0, 8)
    ]);
  };

  if (moduleId === 'throttle') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          Guarantees execution rate of at most once every 800ms, ignoring burst rapid clicks in between.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleThrottleClick}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> Click Rapidly (Throttle 800ms)
          </button>

          <button
            onClick={() => { setThrottleClicks(0); setThrottleExecuted(0); }}
            className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl border border-neutral-700"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 text-center">
            <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Raw Clicks Sent</div>
            <div className="text-3xl font-bold text-neutral-100 font-mono mt-1">{throttleClicks}</div>
          </div>
          <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 text-center">
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Throttled Executions</div>
            <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">{throttleExecuted}</div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'memoize') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          LRU memoization cache stores heavy computational returns to yield instantaneous sub-millisecond repeated lookups.
        </p>

        <div className="flex items-center gap-3">
          <label className="text-xs text-neutral-400">Fibonacci (N):</label>
          <input
            type="number"
            min={1}
            max={42}
            value={memoInput}
            onChange={(e) => setMemoInput(Number(e.target.value))}
            className="w-24 px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm rounded-lg font-mono"
          />
          <button
            onClick={handleRunMemo}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Calculate fib({memoInput})
          </button>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs space-y-2">
          <div className="flex justify-between text-neutral-500 border-b border-neutral-800 pb-2">
            <span>Call History & LRU Cache Timing</span>
            <span>Duration (ms)</span>
          </div>
          {memoResults.length === 0 ? (
            <p className="text-neutral-500 italic py-1">Click Calculate fib({memoInput}) to see first-run vs instant cached performance.</p>
          ) : (
            memoResults.map((m, i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded bg-neutral-900 border border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className={m.cached ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    fib({m.n}) = {m.result}
                  </span>
                  {m.cached && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      ⚡ CACHE HIT
                    </span>
                  )}
                </div>
                <span className={m.cached ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                  {m.time} ms
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Default: useDebounce
  return (
    <div className="space-y-5">
      <p className="text-xs text-neutral-400">
        Debounce delays function execution until 400ms after the user finishes typing.
      </p>

      <div>
        <label className="text-xs text-neutral-400 block mb-1">Type Rapidly (Search simulation):</label>
        <input
          type="text"
          value={debouncedInput}
          onChange={handleDebounceChange}
          placeholder="Start typing quickly..."
          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 text-center">
          <div className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Keystrokes Fired</div>
          <div className="text-3xl font-bold text-neutral-100 font-mono mt-1">{rawInputCount}</div>
        </div>
        <div className="p-4 bg-neutral-900/80 rounded-xl border border-neutral-800 text-center">
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Debounced Calls</div>
          <div className="text-3xl font-bold text-amber-400 font-mono mt-1">{debounceCount}</div>
        </div>
      </div>

      <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 flex justify-between">
        <span>Settled Query: <strong className="text-emerald-400">{debounceResult || 'None'}</strong></span>
        <span>Delay: <strong>400ms</strong></span>
      </div>
    </div>
  );
}
