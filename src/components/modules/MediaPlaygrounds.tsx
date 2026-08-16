import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../../core/Geolocation.js';
import { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop, useIsDarkMode, useIsPortrait } from '../../core/MediaQuery.js';
import { useWindowSize } from '../../core/WindowSize.js';
import { MapPin, Monitor, Smartphone, Tablet, Sun, Moon, Maximize2, RefreshCw } from 'lucide-react';

export function MediaPlaygrounds({ moduleId }: { moduleId: string }) {
  // Geolocation state
  const [geoCoords, setGeoCoords] = useState<any>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [geoInstance, setGeoInstance] = useState<useGeolocation | null>(null);

  useEffect(() => {
    const geo = new useGeolocation({ enableHighAccuracy: true, timeout: 10000 });
    setGeoInstance(geo);
    const unsub = geo.subscribe((pos: any, err: any) => {
      if (pos) setGeoCoords(pos);
      if (err) setGeoError(typeof err === 'string' ? err : err.message || 'Geolocation error');
    });
    return () => {
      unsub();
      geo.clearWatch();
    };
  }, []);

  const handleGetLocation = async () => {
    if (!geoInstance) return;
    setGeoLoading(true);
    setGeoError(null);
    try {
      const pos = await geoInstance.getCurrentPosition();
      setGeoCoords(pos);
    } catch (e: any) {
      setGeoError(e?.message || 'Unable to retrieve location or permission denied.');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleToggleWatch = () => {
    if (!geoInstance) return;
    if (isWatching) {
      geoInstance.clearWatch();
      setIsWatching(false);
    } else {
      geoInstance.watchPosition();
      setIsWatching(true);
    }
  };

  // MediaQuery State
  const [customQuery, setCustomQuery] = useState('(min-width: 1024px)');
  const [customQueryMatch, setCustomQueryMatch] = useState(false);
  const [isMobileMatch, setIsMobileMatch] = useState(false);
  const [isTabletMatch, setIsTabletMatch] = useState(false);
  const [isDesktopMatch, setIsDesktopMatch] = useState(false);
  const [isDarkMatch, setIsDarkMatch] = useState(false);
  const [isPortraitMatch, setIsPortraitMatch] = useState(false);

  useEffect(() => {
    const m = useIsMobile();
    const t = useIsTablet();
    const d = useIsDesktop();
    const dark = useIsDarkMode();
    const port = useIsPortrait();

    setIsMobileMatch(m.get());
    setIsTabletMatch(t.get());
    setIsDesktopMatch(d.get());
    setIsDarkMatch(dark.get());
    setIsPortraitMatch(port.get());

    const unsubM = m.subscribe(setIsMobileMatch);
    const unsubT = t.subscribe(setIsTabletMatch);
    const unsubD = d.subscribe(setIsDesktopMatch);
    const unsubDark = dark.subscribe(setIsDarkMatch);
    const unsubPort = port.subscribe(setIsPortraitMatch);

    return () => {
      unsubM(); unsubT(); unsubD(); unsubDark(); unsubPort();
    };
  }, []);

  useEffect(() => {
    try {
      const mq = new useMediaQuery(customQuery);
      setCustomQueryMatch(mq.get());
      const unsub = mq.subscribe(setCustomQueryMatch);
      return () => unsub();
    } catch {
      setCustomQueryMatch(false);
    }
  }, [customQuery]);

  // WindowSize State
  const [winDim, setWinDim] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const winSize = new useWindowSize({ throttle: 60 });
    setWinDim(winSize.get());
    const unsub = winSize.subscribe(setWinDim);
    return () => unsub();
  }, []);

  if (moduleId === 'mediaquery') {
    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          Reactive media query matcher with automated window resize event binding and presets.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
            isMobileMatch ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
          }`}>
            <Smartphone className="w-5 h-5" />
            <span className="text-xs font-semibold">isMobile</span>
            <span className="text-[10px] font-mono uppercase">{String(isMobileMatch)}</span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
            isTabletMatch ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
          }`}>
            <Tablet className="w-5 h-5" />
            <span className="text-xs font-semibold">isTablet</span>
            <span className="text-[10px] font-mono uppercase">{String(isTabletMatch)}</span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
            isDesktopMatch ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
          }`}>
            <Monitor className="w-5 h-5" />
            <span className="text-xs font-semibold">isDesktop</span>
            <span className="text-[10px] font-mono uppercase">{String(isDesktopMatch)}</span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
            isDarkMatch ? 'bg-purple-500/10 border-purple-500/40 text-purple-300' : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
          }`}>
            <Moon className="w-5 h-5" />
            <span className="text-xs font-semibold">isDarkMode</span>
            <span className="text-[10px] font-mono uppercase">{String(isDarkMatch)}</span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
            isPortraitMatch ? 'bg-sky-500/10 border-sky-500/40 text-sky-300' : 'bg-neutral-900/60 border-neutral-800 text-neutral-500'
          }`}>
            <Maximize2 className="w-5 h-5" />
            <span className="text-xs font-semibold">isPortrait</span>
            <span className="text-[10px] font-mono uppercase">{String(isPortraitMatch)}</span>
          </div>
        </div>

        <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-3">
          <label className="text-xs text-neutral-400 block">Custom Media Query Expression</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 text-neutral-100 rounded-lg text-xs font-mono"
              placeholder="(prefers-reduced-motion: reduce)"
            />
            <div className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center shrink-0 ${
              customQueryMatch ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}>
              MATCH: {String(customQueryMatch).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (moduleId === 'windowsize') {
    const isSm = winDim.width < 640;
    const isMd = winDim.width >= 640 && winDim.width < 768;
    const isLg = winDim.width >= 768 && winDim.width < 1024;
    const isXl = winDim.width >= 1024 && winDim.width < 1280;
    const is2Xl = winDim.width >= 1280;

    return (
      <div className="space-y-5">
        <p className="text-xs text-neutral-400">
          Throttled window resize listener returning live pixel dimensions and breakpoint metrics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Width</div>
            <div className="text-3xl font-bold font-mono text-amber-400">{winDim.width}<span className="text-xs text-neutral-500 ml-1">px</span></div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Height</div>
            <div className="text-3xl font-bold font-mono text-sky-400">{winDim.height}<span className="text-xs text-neutral-500 ml-1">px</span></div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Aspect Ratio</div>
            <div className="text-3xl font-bold font-mono text-emerald-400">{(winDim.width / (winDim.height || 1)).toFixed(2)}:1</div>
          </div>
        </div>

        <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
          <div className="text-xs text-neutral-400 mb-2">Tailwind CSS Breakpoint Range:</div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'sm (<640px)', active: isSm },
              { label: 'md (640-767px)', active: isMd },
              { label: 'lg (768-1023px)', active: isLg },
              { label: 'xl (1024-1279px)', active: isXl },
              { label: '2xl (≥1280px)', active: is2Xl },
            ].map((bp, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                  bp.active ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {bp.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: Geolocation
  return (
    <div className="space-y-5">
      <p className="text-xs text-neutral-400">
        HTML5 Geolocation API wrapper with Promise resolution, continuous position watching, and high accuracy config.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleGetLocation}
          disabled={geoLoading}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
        >
          <MapPin className="w-3.5 h-3.5" /> {geoLoading ? 'Acquiring GPS...' : 'Get Current Position'}
        </button>

        <button
          onClick={handleToggleWatch}
          className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-colors ${
            isWatching ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isWatching ? 'animate-spin' : ''}`} />
          {isWatching ? 'Stop Continuous Watch' : 'Watch Position Stream'}
        </button>
      </div>

      {geoError && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
          Notice: {geoError}
        </div>
      )}

      {geoCoords ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
            <span className="text-neutral-500 text-[10px] block font-bold">LATITUDE</span>
            <span className="text-amber-400 text-sm font-semibold">{geoCoords.latitude?.toFixed(6)}°</span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
            <span className="text-neutral-500 text-[10px] block font-bold">LONGITUDE</span>
            <span className="text-amber-400 text-sm font-semibold">{geoCoords.longitude?.toFixed(6)}°</span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
            <span className="text-neutral-500 text-[10px] block font-bold">ACCURACY</span>
            <span className="text-emerald-400 text-sm font-semibold">±{geoCoords.accuracy ? Math.round(geoCoords.accuracy) : 0}m</span>
          </div>
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
            <span className="text-neutral-500 text-[10px] block font-bold">ALTITUDE</span>
            <span className="text-sky-400 text-sm font-semibold">{geoCoords.altitude ? `${geoCoords.altitude.toFixed(1)}m` : 'N/A'}</span>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-neutral-950 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
          Click "Get Current Position" or "Watch Position Stream" to access coordinates via navigator.geolocation.
        </div>
      )}
    </div>
  );
}
