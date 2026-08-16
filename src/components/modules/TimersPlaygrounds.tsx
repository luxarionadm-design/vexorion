import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '../../core/Timer.js';
import { useCountdown } from '../../core/Countdown.js';
import { useInterval } from '../../core/Interval.js';
import { useTimeout } from '../../core/Timeout.js';
import { useProfiler } from '../../core/Profiler.js';
import { Play, Pause, RotateCcw, Clock, Zap, Gauge, Flame, CheckCircle2 } from 'lucide-react';

export function TimersPlaygrounds({ moduleId }: { moduleId: string }) {
  // Timer (Stopwatch) State
  const [stopwatchFormatted, setStopwatchFormatted] = useState('00:00:00.000');
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const timerRef = useRef<useTimer | null>(null);

  useEffect(() => {
    timerRef.current = new useTimer({
      interval: 30,
      onTick: (elapsed) => {
        if (timerRef.current) {
          setStopwatchFormatted(timerRef.current.getFormatted());
        }
      }
    });
    return () => {
      timerRef.current?.stop();
    };
  }, []);

  const handleStartStopwatch = () => {
    timerRef.current?.start();
    setStopwatchRunning(true);
  };

  const handlePauseStopwatch = () => {
    timerRef.current?.stop();
    setStopwatchRunning(false);
  };

  const handleResetStopwatch = () => {
    timerRef.current?.reset();
    setStopwatchRunning(false);
    setStopwatchFormatted('00:00:00.000');
  };

  // Countdown State
  const [cdSeconds, setCdSeconds] = useState(30);
  const [cdRemaining, setCdRemaining] = useState(30);
  const [cdRunning, setCdRunning] = useState(false);
  const [cdFinished, setCdFinished] = useState(false);
  const cdRef = useRef<useCountdown | null>(null);

  useEffect(() => {
    cdRef.current = new useCountdown(cdSeconds, {
      onTick: (left) => {
        setCdRemaining(left);
        setCdFinished(false);
      },
      onComplete: () => {
        setCdRunning(false);
        setCdFinished(true);
      }
    });
    setCdRemaining(cdSeconds);
    return () => {
      cdRef.current?.stop();
    };
  }, [cdSeconds]);

  const handleStartCountdown = () => {
    cdRef.current?.start();
    setCdRunning(true);
    setCdFinished(false);
  };

  const handleStopCountdown = () => {
    cdRef.current?.stop();
    setCdRunning(false);
  };

  const handleResetCountdown = () => {
    cdRef.current?.reset();
    setCdRunning(false);
    setCdFinished(false);
    setCdRemaining(cdSeconds);
  };

  // Interval State
  const [intDelay, setIntDelay] = useState(1000);
  const [intCount, setIntCount] = useState(0);
  const [intRunning, setIntRunning] = useState(false);
  const intRef = useRef<useInterval | null>(null);

  useEffect(() => {
    intRef.current = new useInterval(() => {
      setIntCount((c) => c + 1);
    }, intDelay);
    return () => {
      intRef.current?.stop();
    };
  }, [intDelay]);

  const handleToggleInterval = () => {
    if (intRunning) {
      intRef.current?.stop();
      setIntRunning(false);
    } else {
      intRef.current?.start();
      setIntRunning(true);
    }
  };

  // Timeout State
  const [toDelay, setToDelay] = useState(2500);
  const [toFired, setToFired] = useState(false);
  const [toRunning, setToRunning] = useState(false);
  const toRef = useRef<useTimeout | null>(null);

  const handleTriggerTimeout = () => {
    setToFired(false);
    setToRunning(true);
    if (toRef.current) toRef.current.stop();
    toRef.current = new useTimeout(() => {
      setToFired(true);
      setToRunning(false);
    }, toDelay);
    toRef.current.start();
  };

  // Profiler State
  const [benchmarks, setBenchmarks] = useState<{ name: string; duration: number; memory?: any; time: string }[]>([]);
  const [isProfiling, setIsProfiling] = useState(false);
  const profilerRef = useRef<useProfiler>(new useProfiler({ name: 'SuiteProfiler' }));

  const runBenchmark = async (type: 'array_sort' | 'crypto_hash' | 'matrix_multiply') => {
    setIsProfiling(true);
    const p = profilerRef.current;

    let resultDuration = 0;
    if (type === 'array_sort') {
      const { duration } = await p.profile('Array Sort (200,000 items)', async () => {
        const arr = Array.from({ length: 200000 }, () => Math.random());
        arr.sort();
      });
      resultDuration = duration;
    } else if (type === 'crypto_hash') {
      const { duration } = await p.profile('WebCrypto 500x SHA-256', async () => {
        const encoder = new TextEncoder();
        for (let i = 0; i < 500; i++) {
          await crypto.subtle.digest('SHA-256', encoder.encode('benchmark_' + i));
        }
      });
      resultDuration = duration;
    } else {
      const { duration } = await p.profile('Matrix Multiply (300x300)', async () => {
        const n = 300;
        const A = Array.from({ length: n }, () => Array(n).fill(1.5));
        const B = Array.from({ length: n }, () => Array(n).fill(2.5));
        const C = Array.from({ length: n }, () => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) sum += A[i][k] * B[k][j];
            C[i][j] = sum;
          }
        }
      });
      resultDuration = duration;
    }

    setBenchmarks((prev) => [
      { name: type.replace('_', ' ').toUpperCase(), duration: Number(resultDuration.toFixed(2)), time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 8)
    ]);
    setIsProfiling(false);
  };

  if (moduleId === 'countdown') {
    const progress = Math.max(0, Math.min(100, ((cdSeconds - cdRemaining) / cdSeconds) * 100));

    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-400">Duration (sec):</label>
            <input
              type="number"
              value={cdSeconds}
              disabled={cdRunning}
              onChange={(e) => setCdSeconds(Math.max(1, Number(e.target.value)))}
              className="w-20 px-2.5 py-1.5 bg-neutral-800 text-neutral-200 text-xs rounded-lg border border-neutral-700 font-mono"
            />
          </div>

          <div className="flex gap-2">
            {!cdRunning ? (
              <button
                onClick={handleStartCountdown}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Start Countdown
              </button>
            ) : (
              <button
                onClick={handleStopCountdown}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-neutral-700"
              >
                <Pause className="w-3.5 h-3.5 fill-current" /> Pause
              </button>
            )}
            <button
              onClick={handleResetCountdown}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col items-center justify-center space-y-4">
          <div className="text-6xl font-bold font-mono text-amber-400 tracking-tight">
            {cdRemaining}<span className="text-lg text-neutral-500 ml-1">s</span>
          </div>

          <div className="w-full max-w-md bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-300 ${cdFinished ? 'bg-emerald-400' : 'bg-amber-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {cdFinished && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Countdown Completed!
            </div>
          )}
        </div>
      </div>
    );
  }

  if (moduleId === 'interval') {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-400">Delay Interval (ms):</label>
            <select
              value={intDelay}
              onChange={(e) => setIntDelay(Number(e.target.value))}
              className="bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 font-mono"
            >
              <option value={200}>200ms (Fast 5Hz)</option>
              <option value={500}>500ms (2Hz)</option>
              <option value={1000}>1000ms (1Hz Standard)</option>
              <option value={2000}>2000ms (Slow)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleInterval}
              className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 ${
                intRunning ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {intRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {intRunning ? 'Stop Interval' : 'Start Interval'}
            </button>
            <button
              onClick={() => setIntCount(0)}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col items-center justify-center space-y-2">
          <div className="text-neutral-500 uppercase text-xs font-bold tracking-wider">Tick Counter</div>
          <div className="text-6xl font-bold font-mono text-sky-400">{intCount}</div>
          <div className="text-xs text-neutral-500 font-mono">Status: {intRunning ? 'RUNNING (ACTIVE)' : 'PAUSED'}</div>
        </div>
      </div>
    );
  }

  if (moduleId === 'timeout') {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-400">Delay:</label>
            <select
              value={toDelay}
              onChange={(e) => setToDelay(Number(e.target.value))}
              className="bg-neutral-800 text-neutral-200 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 font-mono"
            >
              <option value={1000}>1,000 ms (1 sec)</option>
              <option value={2500}>2,500 ms (2.5 sec)</option>
              <option value={5000}>5,000 ms (5 sec)</option>
            </select>
          </div>

          <button
            onClick={handleTriggerTimeout}
            disabled={toRunning}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Clock className="w-3.5 h-3.5" /> {toRunning ? `Waiting ${toDelay}ms...` : 'Trigger Timeout'}
          </button>
        </div>

        <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col items-center justify-center space-y-3">
          {toRunning ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-amber-300">Timeout scheduled, waiting for completion...</span>
            </div>
          ) : toFired ? (
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
              <CheckCircle2 className="w-5 h-5" /> Timeout callback successfully executed!
            </div>
          ) : (
            <span className="text-xs text-neutral-500 font-mono">Click "Trigger Timeout" to start single-shot timer.</span>
          )}
        </div>
      </div>
    );
  }

  if (moduleId === 'profiler') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          High-resolution micro-benchmark profiler using window.performance.mark and performance.measure.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runBenchmark('array_sort')}
            disabled={isProfiling}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5" /> Benchmark Array Sort (200k)
          </button>
          <button
            onClick={() => runBenchmark('crypto_hash')}
            disabled={isProfiling}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" /> Benchmark 500x SHA-256
          </button>
          <button
            onClick={() => runBenchmark('matrix_multiply')}
            disabled={isProfiling}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
          >
            <Gauge className="w-3.5 h-3.5" /> Benchmark Matrix 300x300
          </button>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs space-y-2">
          <div className="text-neutral-500 pb-2 border-b border-neutral-800 flex justify-between">
            <span>Benchmark Profiler Runs</span>
            <button onClick={() => setBenchmarks([])} className="hover:text-neutral-300">Clear</button>
          </div>

          {benchmarks.length === 0 ? (
            <p className="text-neutral-500 italic py-2">No benchmarks executed yet. Click a button above.</p>
          ) : (
            benchmarks.map((b, i) => (
              <div key={i} className="flex justify-between items-center p-2.5 bg-neutral-900 rounded border border-neutral-800">
                <span className="text-neutral-300 font-semibold">{b.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{b.duration} ms</span>
                  <span className="text-neutral-500 text-[10px]">{b.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Default: Timer (Stopwatch)
  return (
    <div className="space-y-5">
      <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col items-center justify-center space-y-4">
        <div className="text-5xl md:text-6xl font-bold font-mono text-amber-400 tracking-tight">
          {stopwatchFormatted}
        </div>

        <div className="flex gap-2">
          {!stopwatchRunning ? (
            <button
              onClick={handleStartStopwatch}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start Timer
            </button>
          ) : (
            <button
              onClick={handlePauseStopwatch}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-neutral-700"
            >
              <Pause className="w-3.5 h-3.5 fill-current" /> Pause
            </button>
          )}
          <button
            onClick={handleResetStopwatch}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-700 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
