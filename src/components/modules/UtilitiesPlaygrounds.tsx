import React, { useState, useRef, useEffect } from 'react';
import { useLogger } from '../../core/Logger.js';
import { useCache } from '../../core/Cache.js';
import { useQueue } from '../../core/Queue.js';
import { useEventEmitter } from '../../core/EventEmitter.js';
import { Terminal, Plus, Play, Radio, RefreshCw, Trash2, ListFilter } from 'lucide-react';

export function UtilitiesPlaygrounds({ moduleId }: { moduleId: string }) {
  // Logger State
  const [logPrefix, setLogPrefix] = useState('PaymentGateway');
  const [logMessage, setLogMessage] = useState('Card transaction processed successfully');
  const [logLogs, setLogLogs] = useState<{ level: string; formatted: string; time: string }[]>([]);
  const loggerRef = useRef<useLogger | null>(null);

  useEffect(() => {
    loggerRef.current = new useLogger({ prefix: logPrefix, level: 'debug' });
    const unsub = loggerRef.current.subscribe((data: any) => {
      setLogLogs((prev) => [
        { level: data.level, formatted: data.formatted, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 15)
      ]);
    });
    return () => unsub();
  }, [logPrefix]);

  const emitLog = (level: 'debug' | 'info' | 'warn' | 'error') => {
    if (loggerRef.current) {
      (loggerRef.current as any)[level](logMessage, { traceId: 'tr_' + Math.random().toString(36).slice(2, 7) });
    }
  };

  // Queue State
  const [queueConcurrent, setQueueConcurrent] = useState(2);
  const [queueTasks, setQueueTasks] = useState<{ id: number; status: 'queued' | 'running' | 'done'; progress: number }[]>([]);
  const queueRef = useRef<useQueue | null>(null);

  useEffect(() => {
    queueRef.current = new useQueue({ concurrent: queueConcurrent });
  }, [queueConcurrent]);

  const handleAddTasksToQueue = (count: number = 3) => {
    const newTasks = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      status: 'queued' as const,
      progress: 0
    }));

    setQueueTasks((prev) => [...prev, ...newTasks]);

    newTasks.forEach((task) => {
      queueRef.current?.enqueue(async () => {
        setQueueTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'running', progress: 30 } : t)));
        await new Promise((r) => setTimeout(r, 600));
        setQueueTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'running', progress: 75 } : t)));
        await new Promise((r) => setTimeout(r, 600));
        setQueueTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: 'done', progress: 100 } : t)));
      });
    });
  };

  // EventEmitter State
  const [eventName, setEventName] = useState('user:signup');
  const [eventPayload, setEventPayload] = useState('{"userId": 109, "tier": "PRO"}');
  const [busLogs, setBusLogs] = useState<{ event: string; payload: any; time: string }[]>([]);
  const busRef = useRef<useEventEmitter>(new useEventEmitter());

  useEffect(() => {
    const unsub = busRef.current.on(eventName, (data: any) => {
      setBusLogs((prev) => [
        { event: eventName, payload: data, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 10)
      ]);
    });
    return () => unsub();
  }, [eventName]);

  const handleEmitEvent = () => {
    let parsed = eventPayload;
    try {
      parsed = JSON.parse(eventPayload);
    } catch {}
    busRef.current.emit(eventName, parsed);
  };

  // Cache State
  const [cacheKey, setCacheKey] = useState('featured_products');
  const [cacheVal, setCacheVal] = useState('["Alpha", "Beta", "Gamma"]');
  const [cacheTTL, setCacheTTL] = useState(30);
  const [cacheStore, setCacheStore] = useState<Record<string, any>>({});
  const cacheRef = useRef<useCache>(new useCache({ maxSize: 10, ttl: 30000 }));

  const handleSetCache = () => {
    if (!cacheKey.trim()) return;
    let parsed = cacheVal;
    try {
      parsed = JSON.parse(cacheVal);
    } catch {}
    cacheRef.current.set(cacheKey, parsed, cacheTTL * 1000);
    setCacheStore(cacheRef.current.getAll());
  };

  const handleGetCache = (k: string) => {
    cacheRef.current.get(k);
    setCacheStore(cacheRef.current.getAll());
  };

  const handleDeleteCache = (k: string) => {
    cacheRef.current.delete(k);
    setCacheStore(cacheRef.current.getAll());
  };

  if (moduleId === 'queue') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          Asynchronous worker task queue with strict concurrency limit control.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-400">Concurrency:</label>
            <select
              value={queueConcurrent}
              onChange={(e) => setQueueConcurrent(Number(e.target.value))}
              className="bg-neutral-800 text-neutral-200 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 font-mono"
            >
              <option value={1}>1 Task (Sequential)</option>
              <option value={2}>2 Tasks Parallel</option>
              <option value={4}>4 Tasks Parallel</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAddTasksToQueue(3)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Enqueue 3 Tasks
            </button>
            <button
              onClick={() => { queueRef.current?.clear(); setQueueTasks([]); }}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-700"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {queueTasks.length === 0 ? (
            <div className="col-span-3 p-6 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
              Queue is idle. Click "Enqueue 3 Tasks" to watch parallel execution.
            </div>
          ) : (
            queueTasks.slice(-6).map((t) => (
              <div key={t.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400">Task #{String(t.id).slice(-4)}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      t.status === 'done'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : t.status === 'running'
                        ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${t.status === 'done' ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (moduleId === 'eventemitter') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Event Channel</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Payload (JSON or string)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventPayload}
                onChange={(e) => setEventPayload(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
              />
              <button
                onClick={handleEmitEvent}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg flex items-center gap-1.5 shrink-0"
              >
                <Radio className="w-4 h-4" /> Emit
              </button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs space-y-2">
          <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex justify-between">
            <span>EventEmitter Listener Dispatch Log</span>
            <span>Channel: {eventName}</span>
          </div>
          {busLogs.length === 0 ? (
            <p className="text-neutral-500 italic py-1">No events dispatched yet. Click Emit.</p>
          ) : (
            busLogs.map((log, i) => (
              <div key={i} className="p-2 bg-neutral-900 rounded border border-neutral-800 flex justify-between items-center">
                <span className="text-amber-400 font-semibold">{log.event}</span>
                <span className="text-emerald-300">{typeof log.payload === 'object' ? JSON.stringify(log.payload) : log.payload}</span>
                <span className="text-neutral-500">{log.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (moduleId === 'cache') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Key</label>
            <input
              type="text"
              value={cacheKey}
              onChange={(e) => setCacheKey(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Value</label>
            <input
              type="text"
              value={cacheVal}
              onChange={(e) => setCacheVal(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">TTL (seconds)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={cacheTTL}
                onChange={(e) => setCacheTTL(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
              />
              <button
                onClick={handleSetCache}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg shrink-0"
              >
                Cache
              </button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800 text-xs font-semibold text-neutral-400">
            <span>In-Memory LRU Items ({Object.keys(cacheStore).length})</span>
            <button
              onClick={() => { cacheRef.current.clear(); setCacheStore({}); }}
              className="text-rose-400 hover:text-rose-300"
            >
              Clear Cache
            </button>
          </div>
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {Object.keys(cacheStore).length === 0 ? (
              <p className="text-xs text-neutral-500 italic">Cache is empty.</p>
            ) : (
              Object.entries(cacheStore).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-2.5 bg-neutral-900 rounded border border-neutral-800 text-xs font-mono">
                  <div>
                    <span className="text-amber-400 font-semibold">{k}</span>
                    <span className="text-neutral-500 mx-2">:</span>
                    <span className="text-emerald-300">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                  </div>
                  <button onClick={() => handleDeleteCache(k)} className="text-neutral-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: useLogger
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={logMessage}
          onChange={(e) => setLogMessage(e.target.value)}
          className="flex-1 min-w-[240px] px-3.5 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 text-sm rounded-lg font-mono"
          placeholder="Message to log"
        />
        <div className="flex gap-2">
          <button
            onClick={() => emitLog('debug')}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg border border-neutral-700"
          >
            DEBUG
          </button>
          <button
            onClick={() => emitLog('info')}
            className="px-3 py-2 bg-sky-600/30 hover:bg-sky-600/40 text-sky-300 text-xs font-bold rounded-lg border border-sky-500/40"
          >
            INFO
          </button>
          <button
            onClick={() => emitLog('warn')}
            className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/40 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40"
          >
            WARN
          </button>
          <button
            onClick={() => emitLog('error')}
            className="px-3 py-2 bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 text-xs font-bold rounded-lg border border-rose-500/40"
          >
            ERROR
          </button>
        </div>
      </div>

      <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
        <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex justify-between">
          <span>Logger Console Output</span>
          <button onClick={() => setLogLogs([])} className="hover:text-neutral-300">Clear</button>
        </div>
        {logLogs.length === 0 ? (
          <p className="text-neutral-500 italic py-1">Click a log level button to generate formatted timestamped logs.</p>
        ) : (
          logLogs.map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-neutral-500">{l.time}</span>
              <span
                className={`font-semibold ${
                  l.level === 'error'
                    ? 'text-rose-400'
                    : l.level === 'warn'
                    ? 'text-amber-400'
                    : l.level === 'info'
                    ? 'text-sky-400'
                    : 'text-neutral-400'
                }`}
              >
                [{l.level.toUpperCase()}]
              </span>
              <span className="text-neutral-200">{l.formatted}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
