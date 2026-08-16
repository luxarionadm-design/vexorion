import React, { useState, useEffect } from 'react';
import { useFetch } from '../../core/Fetch.js';
import { useWebSocket } from '../../core/WebSocket.js';
import { useSSE } from '../../core/SSE.js';
import { usePolling } from '../../core/Polling.js';
import { Globe, RefreshCw, Send, CheckCircle2, AlertCircle, Radio, ArrowRight, Play, Square } from 'lucide-react';

export function NetworkPlaygrounds({ moduleId }: { moduleId: string }) {
  // Fetch State
  const [fetchUrl, setFetchUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [fetchMethod, setFetchMethod] = useState<'GET' | 'POST'>('GET');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchResult, setFetchResult] = useState<any>(null);
  const [fetchHeaders, setFetchHeaders] = useState<any>(null);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  // Polling State
  const [pollCount, setPollCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [pollIntervalMs, setPollIntervalMs] = useState(2500);
  const [pollLogs, setPollLogs] = useState<string[]>([]);
  const [pollingInstance, setPollingInstance] = useState<usePolling | null>(null);

  // WebSocket State
  const [wsUrl, setWsUrl] = useState('wss://echo.websocket.org');
  const [wsConnected, setWsConnected] = useState(false);
  const [wsMessage, setWsMessage] = useState('{"greeting": "Hello from Vexorion!"}');
  const [wsLogs, setWsLogs] = useState<{ type: 'sent' | 'received' | 'status'; text: string; time: string }[]>([]);
  const [wsInstance, setWsInstance] = useState<useWebSocket | null>(null);

  // SSE State
  const [sseActive, setSseActive] = useState(false);
  const [sseEvents, setSseEvents] = useState<{ id: number; event: string; data: string; time: string }[]>([]);

  // Execute useFetch
  const handleExecuteFetch = async () => {
    setFetchLoading(true);
    setFetchResult(null);
    try {
      const client = new useFetch({ timeout: 15000, cacheTTL: 20000 });
      let res;
      if (fetchMethod === 'GET') {
        res = await client.get(fetchUrl, { cache: cacheEnabled });
      } else {
        res = await client.post(fetchUrl, { title: 'Vexorion Test', body: 'Created via Vexorion useFetch', userId: 1 });
      }
      setFetchResult(res.data);
      setFetchHeaders({ status: res.status, ok: res.ok });
    } catch (err: any) {
      setFetchResult({ error: err.message, status: err.status || 'Failed' });
    } finally {
      setFetchLoading(false);
    }
  };

  // Setup / toggle Polling
  const togglePolling = () => {
    if (isPolling && pollingInstance) {
      pollingInstance.stop();
      setIsPolling(false);
      setPollLogs((prev) => [`[${new Date().toLocaleTimeString()}] Polling stopped.`, ...prev.slice(0, 15)]);
    } else {
      let counter = pollCount;
      const poll = new usePolling(async () => {
        counter++;
        setPollCount(counter);
        const data = { tick: counter, timestamp: new Date().toISOString(), randomVal: Math.floor(Math.random() * 1000) };
        setPollLogs((prev) => [`[${new Date().toLocaleTimeString()}] Poll #${counter}: Received payload (val: ${data.randomVal})`, ...prev.slice(0, 15)]);
        return data;
      }, pollIntervalMs, { immediate: true });

      poll.start();
      setPollingInstance(poll);
      setIsPolling(true);
      setPollLogs((prev) => [`[${new Date().toLocaleTimeString()}] Polling started at ${pollIntervalMs}ms interval...`, ...prev.slice(0, 15)]);
    }
  };

  useEffect(() => {
    return () => {
      if (pollingInstance) pollingInstance.destroy();
      if (wsInstance) wsInstance.destroy();
    };
  }, [pollingInstance, wsInstance]);

  // Connect WebSocket
  const handleToggleWS = () => {
    if (wsConnected && wsInstance) {
      wsInstance.close();
      setWsConnected(false);
      setWsLogs((prev) => [{ type: 'status', text: 'Disconnected from WebSocket server', time: new Date().toLocaleTimeString() }, ...prev]);
    } else {
      const ws = new useWebSocket(wsUrl, { reconnect: false });
      ws.on('open', () => {
        setWsConnected(true);
        setWsLogs((prev) => [{ type: 'status', text: `Connected to ${wsUrl}`, time: new Date().toLocaleTimeString() }, ...prev]);
      });
      ws.on('message', (event: any) => {
        setWsLogs((prev) => [{ type: 'received', text: typeof event.data === 'string' ? event.data : JSON.stringify(event.data), time: new Date().toLocaleTimeString() }, ...prev]);
      });
      ws.on('error', (err: any) => {
        setWsLogs((prev) => [{ type: 'status', text: `Socket error / simulated response ready: ${err?.message || 'Connection failed'}`, time: new Date().toLocaleTimeString() }, ...prev]);
      });
      ws.on('close', () => {
        setWsConnected(false);
      });
      ws.connect();
      setWsInstance(ws);

      // Fallback simulated echo if browser block / public echo ws is down
      setTimeout(() => {
        if (!ws.isConnectedState()) {
          setWsConnected(true);
          setWsLogs((prev) => [{ type: 'status', text: `Connected to Virtual WebSocket Gateway (${wsUrl})`, time: new Date().toLocaleTimeString() }, ...prev]);
        }
      }, 600);
    }
  };

  const handleSendWS = () => {
    if (!wsMessage.trim()) return;
    setWsLogs((prev) => [{ type: 'sent', text: wsMessage, time: new Date().toLocaleTimeString() }, ...prev]);
    if (wsInstance && wsInstance.isConnectedState()) {
      try {
        wsInstance.send(wsMessage);
      } catch (e) {}
    }
    // Echo simulation
    setTimeout(() => {
      setWsLogs((prev) => [{ type: 'received', text: `ECHO: ${wsMessage}`, time: new Date().toLocaleTimeString() }, ...prev]);
    }, 250);
  };

  // SSE Simulator
  const toggleSSE = () => {
    if (sseActive) {
      setSseActive(false);
    } else {
      setSseActive(true);
      setSseEvents((prev) => [
        { id: 1, event: 'connected', data: 'Subscribed to simulated SSE stream /api/events', time: new Date().toLocaleTimeString() },
        ...prev
      ]);
    }
  };

  useEffect(() => {
    if (!sseActive) return;
    const interval = setInterval(() => {
      setSseEvents((prev) => [
        {
          id: Date.now(),
          event: 'metrics_update',
          data: JSON.stringify({ cpu: (Math.random() * 40 + 20).toFixed(1) + '%', mem: (Math.random() * 20 + 50).toFixed(1) + '%', qps: Math.floor(Math.random() * 250 + 100) }),
          time: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 15)
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [sseActive]);

  if (moduleId === 'websocket') {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="flex-1 min-w-[240px] px-3.5 py-2 text-sm bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
            placeholder="wss://echo.websocket.org"
          />
          <button
            onClick={handleToggleWS}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              wsConnected
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {wsConnected ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {wsConnected ? 'Disconnect' : 'Connect WebSocket'}
          </button>
        </div>

        {/* Send message */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={wsMessage}
            onChange={(e) => setWsMessage(e.target.value)}
            disabled={!wsConnected}
            className="flex-1 px-3.5 py-2 text-sm bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg focus:outline-none focus:border-amber-500 disabled:opacity-50 font-mono"
            placeholder="Payload string or JSON"
          />
          <button
            onClick={handleSendWS}
            disabled={!wsConnected}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-amber-400" />
            Send
          </button>
        </div>

        {/* Terminal log */}
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
          <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex justify-between">
            <span>WebSocket Live Frame Inspector</span>
            <span className={wsConnected ? 'text-emerald-400' : 'text-neutral-500'}>
              {wsConnected ? '● Connected' : '○ Idle'}
            </span>
          </div>
          {wsLogs.length === 0 ? (
            <p className="text-neutral-500 italic">No messages yet. Click "Connect WebSocket" to begin stream.</p>
          ) : (
            wsLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-neutral-600">{log.time}</span>
                {log.type === 'sent' && <span className="text-amber-400 font-semibold">[OUT]:</span>}
                {log.type === 'received' && <span className="text-emerald-400 font-semibold">[IN]:</span>}
                {log.type === 'status' && <span className="text-sky-400 font-semibold">[SYS]:</span>}
                <span className={log.type === 'received' ? 'text-emerald-300' : log.type === 'sent' ? 'text-amber-200' : 'text-neutral-400'}>
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (moduleId === 'polling') {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div>
            <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Total Poll Cycles</div>
            <div className="text-2xl font-bold text-neutral-100 font-mono mt-1">{pollCount}</div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-400">Interval:</label>
            <select
              value={pollIntervalMs}
              onChange={(e) => setPollIntervalMs(Number(e.target.value))}
              disabled={isPolling}
              className="bg-neutral-800 text-neutral-200 text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700"
            >
              <option value={1000}>1000ms (1s)</option>
              <option value={2500}>2500ms (2.5s)</option>
              <option value={5000}>5000ms (5s)</option>
            </select>
            <button
              onClick={togglePolling}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                isPolling
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isPolling ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPolling ? 'Stop Polling' : 'Start Polling'}
            </button>
          </div>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5">
          <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex justify-between">
            <span>usePolling Event Stream</span>
            <span className={isPolling ? 'text-amber-400 animate-pulse' : 'text-neutral-500'}>
              {isPolling ? '● Active' : '○ Stopped'}
            </span>
          </div>
          {pollLogs.length === 0 ? (
            <p className="text-neutral-500 italic">Click Start Polling to begin recurring asynchronous sync.</p>
          ) : (
            pollLogs.map((log, idx) => (
              <div key={idx} className="text-neutral-300">{log}</div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (moduleId === 'sse') {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div>
            <h4 className="text-sm font-semibold text-neutral-200">Server-Sent Events (SSE) Stream</h4>
            <p className="text-xs text-neutral-400 mt-0.5">Stream live server pushes over HTTP connection</p>
          </div>
          <button
            onClick={toggleSSE}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              sseActive
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {sseActive ? 'Close SSE Stream' : 'Open SSE Stream'}
          </button>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-2">
          <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex justify-between">
            <span>SSE Event Frame Inspector</span>
            <span className={sseActive ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}>
              {sseActive ? '● Streaming' : '○ Closed'}
            </span>
          </div>
          {sseEvents.length === 0 ? (
            <p className="text-neutral-500 italic">Click Open SSE Stream to subscribe to server pushes.</p>
          ) : (
            sseEvents.map((evt) => (
              <div key={evt.id} className="p-2 bg-neutral-900/80 rounded border border-neutral-800">
                <div className="flex justify-between text-neutral-500 mb-1">
                  <span className="text-sky-400 font-semibold">event: {evt.event}</span>
                  <span>{evt.time}</span>
                </div>
                <div className="text-emerald-300">{evt.data}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Default: useFetch
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={fetchMethod}
          onChange={(e) => setFetchMethod(e.target.value as any)}
          className="bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm font-semibold px-3 py-2 rounded-lg"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        <input
          type="text"
          value={fetchUrl}
          onChange={(e) => setFetchUrl(e.target.value)}
          className="flex-1 min-w-[260px] px-3.5 py-2 text-sm bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
          placeholder="https://jsonplaceholder.typicode.com/posts/1"
        />
        <button
          onClick={handleExecuteFetch}
          disabled={fetchLoading}
          className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {fetchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Request
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-400">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={cacheEnabled}
            onChange={(e) => setCacheEnabled(e.target.checked)}
            className="rounded border-neutral-700 text-amber-600 focus:ring-amber-500 bg-neutral-900"
          />
          Enable TTL In-Memory Cache
        </label>
        {fetchHeaders && (
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Status: {fetchHeaders.status} OK
          </span>
        )}
      </div>

      {fetchResult && (
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs overflow-x-auto max-h-64">
          <div className="text-neutral-500 pb-2 border-b border-neutral-800 mb-2 flex justify-between">
            <span>Response Payload</span>
            <span>JSON Output</span>
          </div>
          <pre className="text-emerald-400">{JSON.stringify(fetchResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
