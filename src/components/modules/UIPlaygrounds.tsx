import React, { useState, useRef, useEffect } from 'react';
import { useToggle } from '../../core/Toggle.js';
import { useClickOutside } from '../../core/ClickOutside.js';
import { useHover } from '../../core/Hover.js';
import { useFocus } from '../../core/Focus.js';
import { useScroll } from '../../core/Scroll.js';
import { useDraggable } from '../../core/Draggable.js';
import { Check, X, MousePointer, Move, ArrowUp, Sparkles } from 'lucide-react';

export function UIPlaygrounds({ moduleId }: { moduleId: string }) {
  // Toggle State
  const [toggleVal, setToggleVal] = useState(false);
  const [toggleLog, setToggleLog] = useState<string[]>([]);
  const toggleInstance = useRef<useToggle | null>(null);

  useEffect(() => {
    if (!toggleInstance.current) {
      toggleInstance.current = new useToggle(false);
      toggleInstance.current.subscribe((v: boolean) => {
        setToggleVal(v);
        setToggleLog((prev) => [`State changed to: ${v} at ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 5)]);
      });
    }
  }, []);

  // Click Outside State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [outsideClicksCount, setOutsideClicksCount] = useState(0);

  useEffect(() => {
    if (dropdownRef.current) {
      const co = new useClickOutside(dropdownRef.current, () => {
        if (dropdownOpen) {
          setDropdownOpen(false);
          setOutsideClicksCount((c) => c + 1);
        }
      });
      return () => co.destroy();
    }
  }, [dropdownOpen]);

  // Hover State
  const hoverBoxRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);

  useEffect(() => {
    if (hoverBoxRef.current) {
      const h = new useHover(hoverBoxRef.current, {
        enterDelay: 50,
        leaveDelay: 100,
        onEnter: () => {
          setIsHovered(true);
          setHoverCount((c) => c + 1);
        },
        onLeave: () => {
          setIsHovered(false);
        }
      });
      return () => h.destroy();
    }
  }, []);

  // Focus State
  const focusInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [focusHistory, setFocusHistory] = useState<string[]>([]);

  useEffect(() => {
    if (focusInputRef.current) {
      const f = new useFocus(focusInputRef.current, {
        onFocus: () => {
          setIsFocused(true);
          setFocusHistory((prev) => [`Focused at ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 5)]);
        },
        onBlur: () => {
          setIsFocused(false);
          setFocusHistory((prev) => [`Blurred at ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 5)]);
        }
      });
      return () => f.destroy();
    }
  }, []);

  // Scroll State
  const [scrollData, setScrollData] = useState<{ x: number; y: number; direction: string }>({ x: 0, y: 0, direction: 'none' });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = new useScroll({
      throttle: 50,
      onScroll: (data: any) => {
        setScrollData({ x: data.x, y: data.y, direction: data.direction });
      }
    });
    return () => s.destroy();
  }, []);

  // Draggable State
  const dragBoxRef = useRef<HTMLDivElement>(null);
  const [dragPos, setDragPos] = useState({ x: 40, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (dragBoxRef.current) {
      const d = new useDraggable(dragBoxRef.current, {
        axis: 'both',
        onDragStart: () => setIsDragging(true),
        onDrag: ({ x, y }: any) => {
          setDragPos({ x, y });
        },
        onDragEnd: () => setIsDragging(false)
      });
      return () => d.destroy();
    }
  }, []);

  if (moduleId === 'clickoutside') {
    return (
      <div className="space-y-4">
        <p className="text-xs text-neutral-400">
          Click inside the menu to toggle, then click anywhere outside in the surrounding area to trigger outside dismissal.
        </p>
        <div className="p-8 bg-neutral-950 border border-neutral-800 rounded-xl relative min-h-[220px] flex items-center justify-center">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg shadow flex items-center gap-2"
            >
              {dropdownOpen ? 'Close Menu' : 'Open Dropdown Menu'}
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl p-2 z-20 space-y-1 text-xs">
                <div className="px-3 py-1.5 font-semibold text-neutral-300 border-b border-neutral-800">Menu Options</div>
                <div className="px-3 py-1.5 text-neutral-300 hover:bg-neutral-800 rounded cursor-pointer">Profile Settings</div>
                <div className="px-3 py-1.5 text-neutral-300 hover:bg-neutral-800 rounded cursor-pointer">API Keys</div>
                <div className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer">Logout</div>
              </div>
            )}
          </div>
        </div>
        <div className="text-xs font-mono text-neutral-400 flex justify-between bg-neutral-900 p-3 rounded-lg border border-neutral-800">
          <span>Outside Closes Triggered: <strong className="text-amber-400">{outsideClicksCount}</strong></span>
          <span>State: <strong className={dropdownOpen ? 'text-emerald-400' : 'text-neutral-400'}>{dropdownOpen ? 'OPEN' : 'CLOSED'}</strong></span>
        </div>
      </div>
    );
  }

  if (moduleId === 'hover') {
    return (
      <div className="space-y-4">
        <div
          ref={hoverBoxRef}
          className={`p-8 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
            isHovered
              ? 'bg-amber-500/15 border-amber-500 text-amber-300 scale-[1.02] shadow-lg shadow-amber-500/10'
              : 'bg-neutral-900/80 border-neutral-700 text-neutral-300'
          }`}
        >
          <MousePointer className={`w-8 h-8 mb-2 transition-transform ${isHovered ? 'scale-125 text-amber-400' : 'text-neutral-500'}`} />
          <h4 className="text-base font-semibold">{isHovered ? 'Cursor Detected (useHover Active)' : 'Hover Over This Element'}</h4>
          <p className="text-xs text-neutral-400 mt-1">Configured with 50ms enter and 100ms leave debounce</p>
        </div>
        <div className="text-xs font-mono text-neutral-400 bg-neutral-900 p-3 rounded-lg border border-neutral-800 flex justify-between">
          <span>Total Hover Interactions: <strong className="text-amber-400">{hoverCount}</strong></span>
          <span>Current State: <strong className={isHovered ? 'text-emerald-400' : 'text-neutral-500'}>{isHovered ? 'HOVERING' : 'IDLE'}</strong></span>
        </div>
      </div>
    );
  }

  if (moduleId === 'focus') {
    return (
      <div className="space-y-4">
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-xl space-y-4">
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-1">Interactive useFocus Input Field</label>
            <input
              ref={focusInputRef}
              type="text"
              placeholder="Click here or use buttons below..."
              className={`w-full px-4 py-2.5 bg-neutral-900 border text-sm rounded-lg transition-colors font-mono ${
                isFocused ? 'border-amber-500 ring-2 ring-amber-500/20 text-neutral-100' : 'border-neutral-700 text-neutral-300'
              }`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => focusInputRef.current?.focus()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700"
            >
              Programmatic .focus()
            </button>
            <button
              onClick={() => focusInputRef.current?.blur()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700"
            >
              Programmatic .blur()
            </button>
          </div>
        </div>

        <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 font-mono text-xs text-neutral-400 space-y-1">
          <div className="flex justify-between border-b border-neutral-800 pb-1 mb-1">
            <span>Focus Activity Log</span>
            <span className={isFocused ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}>{isFocused ? 'FOCUSED' : 'BLURRED'}</span>
          </div>
          {focusHistory.map((h, i) => (
            <div key={i} className="text-neutral-300">{h}</div>
          ))}
        </div>
      </div>
    );
  }

  if (moduleId === 'scroll') {
    return (
      <div className="space-y-4">
        <div
          ref={scrollContainerRef}
          className="h-44 overflow-y-auto p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3 font-mono text-xs text-neutral-400"
        >
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">Scroll Down Container to Inspect Stream ⬇</div>
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">Vexorion useScroll throttles events to 60fps / custom ms</div>
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">Calculates X, Y offsets and Direction (up/down/left/right)</div>
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">Supports smooth scrollToTop and scrollToElement helpers</div>
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">Bottom reached. Scroll back up to test reverse direction!</div>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-neutral-900 p-3 rounded-lg border border-neutral-800">
          <div>Scroll Y: <strong className="text-amber-400">{Math.round(scrollData.y)}px</strong></div>
          <div>Scroll X: <strong className="text-amber-400">{Math.round(scrollData.x)}px</strong></div>
          <div>Direction: <strong className="text-emerald-400 uppercase">{scrollData.direction}</strong></div>
        </div>
      </div>
    );
  }

  if (moduleId === 'draggable') {
    return (
      <div className="space-y-4">
        <div className="relative h-64 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden p-2">
          <div className="absolute top-2 left-3 text-xs font-mono text-neutral-500">
            Drag bounded canvas • Position: ({Math.round(dragPos.x)}, {Math.round(dragPos.y)})
          </div>
          <div
            ref={dragBoxRef}
            className={`absolute select-none cursor-grab active:cursor-grabbing p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-3 transition-colors ${
              isDragging ? 'bg-amber-600/30 border-amber-500 ring-2 ring-amber-500/40 text-white' : 'bg-neutral-800/90 border-neutral-700 text-neutral-200'
            }`}
            style={{ transform: `translate(${dragPos.x}px, ${dragPos.y}px)` }}
          >
            <Move className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold font-mono">useDraggable Element</div>
              <div className="text-[10px] text-neutral-400">Click & drag anywhere</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: useToggle
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-neutral-900/70 rounded-xl border border-neutral-800">
        <div>
          <div className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Reactive Boolean State</div>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-2xl font-bold font-mono ${toggleVal ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {toggleVal ? 'TRUE (ON)' : 'FALSE (OFF)'}
            </span>
            <div className={`w-3 h-3 rounded-full ${toggleVal ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => toggleInstance.current?.toggle()}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors shadow"
          >
            .toggle()
          </button>
          <button
            onClick={() => toggleInstance.current?.on()}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700"
          >
            .on()
          </button>
          <button
            onClick={() => toggleInstance.current?.off()}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700"
          >
            .off()
          </button>
          <button
            onClick={() => toggleInstance.current?.reset()}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700"
          >
            .reset()
          </button>
        </div>
      </div>

      <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-4 font-mono text-xs space-y-1 max-h-40 overflow-y-auto">
        <div className="text-neutral-500 pb-1 border-b border-neutral-800">useToggle Event Listener Stream</div>
        {toggleLog.map((log, i) => (
          <div key={i} className="text-neutral-300">{log}</div>
        ))}
      </div>
    </div>
  );
}
