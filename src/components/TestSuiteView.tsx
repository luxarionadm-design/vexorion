import React, { useState } from 'react';
import { TEST_SUITE, TestCase } from '../data/testSuite.js';
import { Play, CheckCircle2, XCircle, Clock, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export function TestSuiteView() {
  const [results, setResults] = useState<Record<string, { passed: boolean; message: string; durationMs: number }>>({});
  const [running, setRunning] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'passed' | 'failed'>('all');

  const runAllTests = async () => {
    setRunning(true);
    const newResults: Record<string, { passed: boolean; message: string; durationMs: number }> = {};

    for (const test of TEST_SUITE) {
      try {
        const res = await test.run();
        newResults[test.id] = res;
      } catch (err: any) {
        newResults[test.id] = {
          passed: false,
          message: err?.message || String(err),
          durationMs: 0
        };
      }
      setResults({ ...newResults });
    }
    setRunning(false);
  };

  const total = TEST_SUITE.length;
  const testedCount = Object.keys(results).length;
  const resultList = Object.values(results) as { passed: boolean; message: string; durationMs: number }[];
  const passedCount = resultList.filter((r) => r.passed).length;
  const failedCount = resultList.filter((r) => !r.passed).length;
  const totalDuration = resultList.reduce((acc, r) => acc + r.durationMs, 0);

  const filteredTests = TEST_SUITE.filter((test) => {
    const res = results[test.id];
    if (activeFilter === 'passed') return res?.passed === true;
    if (activeFilter === 'failed') return res && !res.passed;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header Summary Card */}
      <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Automated In-Browser Test Suite
            </h3>
            <p className="text-xs text-neutral-400">
              Unit tests executed live against the compiled Vexorion browser runtime core.
            </p>
          </div>

          <button
            onClick={runAllTests}
            disabled={running}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {running ? `Executing (${testedCount}/${total})...` : 'Run All Test Cases'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-800">
          <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Suites</span>
            <span className="text-xl font-bold font-mono text-neutral-200">{total}</span>
          </div>

          <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-800/30">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Passed</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{passedCount}</span>
          </div>

          <div className="p-3 bg-rose-950/20 rounded-lg border border-rose-800/30">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">Failed</span>
            <span className="text-xl font-bold font-mono text-rose-300">{failedCount}</span>
          </div>

          <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800/80">
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Total Runtime</span>
            <span className="text-xl font-bold font-mono text-amber-300">{totalDuration} ms</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
          }`}
        >
          All Tests ({TEST_SUITE.length})
        </button>
        <button
          onClick={() => setActiveFilter('passed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'passed' ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
          }`}
        >
          Passed ({passedCount})
        </button>
        <button
          onClick={() => setActiveFilter('failed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeFilter === 'failed' ? 'bg-rose-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
          }`}
        >
          Failed ({failedCount})
        </button>
      </div>

      {/* Test List */}
      <div className="space-y-2.5">
        {filteredTests.map((test) => {
          const res = results[test.id];
          return (
            <div
              key={test.id}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs transition-colors ${
                res?.passed === true
                  ? 'bg-neutral-950/80 border-emerald-900/40'
                  : res?.passed === false
                  ? 'bg-rose-950/20 border-rose-800/40'
                  : 'bg-neutral-950/40 border-neutral-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {res?.passed === true ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : res?.passed === false ? (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-600 shrink-0" />
                  )}
                  <span className="font-semibold text-neutral-200">{test.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 border border-neutral-700">
                    {test.category}
                  </span>
                </div>
                {res && (
                  <p className={`text-[11px] ml-6 ${res.passed ? 'text-neutral-400' : 'text-rose-300 font-sans'}`}>
                    {res.message}
                  </p>
                )}
              </div>

              {res && (
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {res.durationMs}ms
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      res.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {res.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
