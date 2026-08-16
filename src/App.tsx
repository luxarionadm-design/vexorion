import React, { useState, useMemo } from 'react';
import {
  CATEGORIES,
  MODULES,
  ModuleInfo
} from './data/modulesData.js';
import { NetworkPlaygrounds } from './components/modules/NetworkPlaygrounds.js';
import { StoragePlaygrounds } from './components/modules/StoragePlaygrounds.js';
import { UIPlaygrounds } from './components/modules/UIPlaygrounds.js';
import { FormPlaygrounds } from './components/modules/FormPlaygrounds.js';
import { PerformancePlaygrounds } from './components/modules/PerformancePlaygrounds.js';
import { UtilitiesPlaygrounds } from './components/modules/UtilitiesPlaygrounds.js';
import { SecurityPlaygrounds } from './components/modules/SecurityPlaygrounds.js';
import { FilePlaygrounds } from './components/modules/FilePlaygrounds.js';
import { MediaPlaygrounds } from './components/modules/MediaPlaygrounds.js';
import { TimersPlaygrounds } from './components/modules/TimersPlaygrounds.js';
import { InteractiveRepl } from './components/InteractiveRepl.js';
import { TestSuiteView } from './components/TestSuiteView.js';
import { ArchitectureView } from './components/ArchitectureView.js';
import {
  Search,
  BookOpen,
  Terminal,
  ShieldCheck,
  Layers,
  Copy,
  Check,
  Play,
  Code2,
  Package,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'repl' | 'tests' | 'architecture'>('explorer');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('fetch');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [replCode, setReplCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  // Filter modules by category and search query
  const filteredModules = useMemo(() => {
    return MODULES.filter((m) => {
      const matchCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.methods.some((meth) => meth.name.toLowerCase().includes(q) || meth.desc.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Active module object
  const activeModule: ModuleInfo = useMemo(() => {
    return MODULES.find((m) => m.id === selectedModuleId) || MODULES[0];
  }, [selectedModuleId]);

  const handleCopy = (text: string, type: 'code' | 'install') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    }
  };

  const handleRunInRepl = (codeSnippet: string) => {
    setReplCode(codeSnippet);
    setActiveTab('repl');
  };

  const renderModulePlayground = (module: ModuleInfo) => {
    switch (module.category) {
      case 'network':
        return <NetworkPlaygrounds moduleId={module.id} />;
      case 'storage':
        return <StoragePlaygrounds moduleId={module.id} />;
      case 'ui':
        return <UIPlaygrounds moduleId={module.id} />;
      case 'form':
        return <FormPlaygrounds moduleId={module.id} />;
      case 'performance':
        return <PerformancePlaygrounds moduleId={module.id} />;
      case 'utilities':
        return <UtilitiesPlaygrounds moduleId={module.id} />;
      case 'security':
        return <SecurityPlaygrounds moduleId={module.id} />;
      case 'file':
        return <FilePlaygrounds moduleId={module.id} />;
      case 'media':
        return <MediaPlaygrounds moduleId={module.id} />;
      case 'timers':
        return <TimersPlaygrounds moduleId={module.id} />;
      default:
        return null;
    }
  };

  return (
    <div id="vexorion_app_root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation Bar */}
      <header id="vexorion_header" className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-400/30">
              <Zap className="w-5 h-5 text-neutral-950 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base text-neutral-100 font-mono">VEXORION</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-amber-400 border border-neutral-700">
                  v1.0.0
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">Universal JS/TS Utility Suite (34 Modules)</p>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <nav className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
            <button
              id="tab_explorer"
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'explorer'
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Module</span> Explorer
            </button>

            <button
              id="tab_repl"
              onClick={() => setActiveTab('repl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'repl'
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Interactive REPL
            </button>

            <button
              id="tab_tests"
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'tests'
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Test Runner
            </button>

            <button
              id="tab_architecture"
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'architecture'
                  ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Architecture
            </button>
          </nav>

          {/* Quick Install Pill */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-lg border border-neutral-800 font-mono text-xs text-neutral-300">
              <span className="text-amber-400">$</span>
              <span>npm i vexorion</span>
              <button
                onClick={() => handleCopy('npm install vexorion', 'install')}
                className="text-neutral-400 hover:text-neutral-200 ml-1"
                title="Copy install command"
              >
                {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'repl' && <InteractiveRepl initialCode={replCode} />}
        {activeTab === 'tests' && <TestSuiteView />}
        {activeTab === 'architecture' && <ArchitectureView />}

        {activeTab === 'explorer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar / Category & Module Selector */}
            <aside className="lg:col-span-4 space-y-4">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 34 modules or methods..."
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-900/80 border border-neutral-800 focus:border-amber-500 text-xs rounded-xl text-neutral-100 placeholder:text-neutral-500 focus:outline-none transition-colors font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 hover:text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Category Horizontal Scroll Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-neutral-950 font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Module Cards List */}
              <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredModules.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-900/40 rounded-xl border border-neutral-800">
                    No modules match "{searchQuery}". Try a different keyword.
                  </div>
                ) : (
                  filteredModules.map((mod) => {
                    const isSelected = mod.id === activeModule.id;
                    return (
                      <button
                        key={mod.id}
                        id={`module_btn_${mod.id}`}
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                            : 'bg-neutral-900/40 hover:bg-neutral-900/80 border-neutral-800/80 text-neutral-300'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-xs font-semibold truncate ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                              {mod.name}
                            </span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 bg-neutral-800/80 text-neutral-400 rounded border border-neutral-700/60 shrink-0">
                              {mod.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">
                            {mod.description}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-neutral-600 group-hover:text-neutral-400'}`} />
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Main Module Detail & Interactive Playground */}
            <section className="lg:col-span-8 space-y-6">
              {/* Module Header Card */}
              <div className="p-6 bg-neutral-900/60 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-neutral-100 font-mono tracking-tight">
                        {activeModule.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {activeModule.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
                      {activeModule.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunInRepl(activeModule.codeExample)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run in REPL
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono pt-2 border-t border-neutral-800/80">
                  <span className="text-neutral-400">Source:</span>
                  <span className="text-amber-400/90">{activeModule.sourceFile}</span>
                </div>
              </div>

              {/* Interactive Live Playground Widget */}
              <div className="p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Live Interactive Playground
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500">Real-time execution</span>
                </div>

                {/* Render corresponding category playground */}
                {renderModulePlayground(activeModule)}
              </div>

              {/* API Method Reference Table */}
              <div className="p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-4">
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  API Method Reference
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 text-[11px]">
                        <th className="pb-2 font-semibold">Method</th>
                        <th className="pb-2 font-semibold">Parameters</th>
                        <th className="pb-2 font-semibold">Returns</th>
                        <th className="pb-2 font-semibold font-sans">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {activeModule.methods.map((method, idx) => (
                        <tr key={idx} className="hover:bg-neutral-800/30">
                          <td className="py-2.5 text-amber-400 font-bold pr-3 whitespace-nowrap">{method.name}</td>
                          <td className="py-2.5 text-neutral-300 pr-3 text-[11px] whitespace-nowrap">{method.params}</td>
                          <td className="py-2.5 text-emerald-400 pr-3 text-[11px] whitespace-nowrap">{method.returns}</td>
                          <td className="py-2.5 text-neutral-400 font-sans text-xs">{method.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Snippet Example */}
              <div className="p-6 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Usage Example
                  </h3>
                  <button
                    onClick={() => handleCopy(activeModule.codeExample, 'code')}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs flex items-center gap-1.5 border border-neutral-700"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Copied' : 'Copy Snippet'}
                  </button>
                </div>

                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 overflow-x-auto">
                  <pre className="font-mono text-xs text-neutral-200 leading-relaxed whitespace-pre">
                    {activeModule.codeExample}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-800/80 py-6 px-4 text-center text-xs text-neutral-500 font-mono mt-12">
        <p>Vexorion Universal JS Utility Library • 34 Production Modules • Zero Runtime Dependencies</p>
      </footer>
    </div>
  );
}
