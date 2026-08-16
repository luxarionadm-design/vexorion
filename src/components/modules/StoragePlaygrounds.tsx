import React, { useState, useEffect } from 'react';
import { useLocalStorage, useSessionStorage } from '../../core/Storage.js';
import { useCookie } from '../../core/Cookie.js';
import { Plus, Trash2, Key, Database, Cookie as CookieIcon, RefreshCw } from 'lucide-react';

export function StoragePlaygrounds({ moduleId }: { moduleId: string }) {
  const [localKey, setLocalKey] = useState('user_settings');
  const [localVal, setLocalVal] = useState('{"theme":"dark","notifications":true}');
  const [localExpiry, setLocalExpiry] = useState<number>(0);
  const [storedItems, setStoredItems] = useState<Record<string, any>>({});
  const [storagePrefix, setStoragePrefix] = useState('vex');

  // Cookie states
  const [cookieKey, setCookieKey] = useState('session_token');
  const [cookieVal, setCookieVal] = useState('vex_sess_89a19c');
  const [cookieDays, setCookieDays] = useState(7);
  const [allCookies, setAllCookies] = useState<Record<string, string>>({});

  const storageInstance = new useLocalStorage({ prefix: storagePrefix });
  const cookieInstance = new useCookie();

  const refreshStorage = () => {
    setStoredItems(storageInstance.getAll());
    setAllCookies(cookieInstance.getAll());
  };

  useEffect(() => {
    refreshStorage();
  }, [storagePrefix, moduleId]);

  const handleSetStorage = () => {
    if (!localKey.trim()) return;
    let parsed: any = localVal;
    try {
      parsed = JSON.parse(localVal);
    } catch {}
    storageInstance.set(localKey, parsed, localExpiry > 0 ? localExpiry * 1000 : null);
    refreshStorage();
  };

  const handleRemoveStorage = (key: string) => {
    storageInstance.remove(key);
    refreshStorage();
  };

  const handleClearStorage = () => {
    storageInstance.clear();
    refreshStorage();
  };

  const handleSetCookie = () => {
    if (!cookieKey.trim()) return;
    cookieInstance.set(cookieKey, cookieVal, { days: cookieDays });
    refreshStorage();
  };

  const handleRemoveCookie = (key: string) => {
    cookieInstance.remove(key);
    refreshStorage();
  };

  if (moduleId === 'cookie') {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Cookie Key</label>
            <input
              type="text"
              value={cookieKey}
              onChange={(e) => setCookieKey(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Cookie Value</label>
            <input
              type="text"
              value={cookieVal}
              onChange={(e) => setCookieVal(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Expires (Days)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={cookieDays}
                onChange={(e) => setCookieDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
              />
              <button
                onClick={handleSetCookie}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Set
              </button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <CookieIcon className="w-4 h-4 text-amber-500" /> Active Document Cookies ({Object.keys(allCookies).length})
            </span>
            <button
              onClick={() => { cookieInstance.clear(); refreshStorage(); }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Cookies
            </button>
          </div>

          <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
            {Object.keys(allCookies).length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">No cookies found in current scope.</p>
            ) : (
              Object.entries(allCookies).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-2.5 bg-neutral-900/70 rounded-lg border border-neutral-800 text-xs font-mono">
                  <div>
                    <span className="text-amber-400 font-semibold">{k}</span>
                    <span className="text-neutral-500 mx-2">=</span>
                    <span className="text-neutral-200">{v}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCookie(k)}
                    className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                  >
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

  // LocalStorage / SessionStorage
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
        <label className="text-xs text-neutral-400">Namespace Prefix:</label>
        <input
          type="text"
          value={storagePrefix}
          onChange={(e) => setStoragePrefix(e.target.value)}
          className="px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-100 rounded text-xs font-mono w-24"
        />
        <span className="text-xs text-neutral-500">(All keys will be stored as {storagePrefix}_key)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-1">Key</label>
          <input
            type="text"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-1">Value (string or JSON)</label>
          <input
            type="text"
            value={localVal}
            onChange={(e) => setLocalVal(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-1">TTL Expiration (seconds, 0=none)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={localExpiry}
              onChange={(e) => setLocalExpiry(Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-lg text-sm font-mono"
            />
            <button
              onClick={handleSetStorage}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>

      <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" /> Stored Keys under "{storagePrefix}_*" ({Object.keys(storedItems).length})
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshStorage}
              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
            <button
              onClick={handleClearStorage}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear Namespace
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
          {Object.keys(storedItems).length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-2">Namespace is empty. Add a key-value above.</p>
          ) : (
            Object.entries(storedItems).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-2.5 bg-neutral-900/70 rounded-lg border border-neutral-800 text-xs font-mono">
                <div>
                  <span className="text-amber-400 font-semibold">{k}</span>
                  <span className="text-neutral-500 mx-2">:</span>
                  <span className="text-emerald-300">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                </div>
                <button
                  onClick={() => handleRemoveStorage(k)}
                  className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                >
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
