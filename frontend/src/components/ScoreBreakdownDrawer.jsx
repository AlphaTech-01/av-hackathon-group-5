import React from 'react';
import { X, Shield, Award, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ScoreBreakdownDrawer = ({ isOpen, onClose, scoreData }) => {
  if (!isOpen) return null;

  const { totalScore, rawTotal, breakdown } = scoreData;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0B1120] border-l border-slate-800 h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Score Breakdown Engine</h3>
                <p className="text-xs text-slate-400">Deterministic Weighted Scoring Model</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Overall Score Summary */}
          <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Overall Score</span>
              <span className="text-3xl font-extrabold text-white">{rawTotal.toFixed(1)} <span className="text-sm text-slate-400 font-normal">/ 100</span></span>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 block">
                Grade: B+ Good
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">5 Rules Evaluated</span>
            </div>
          </div>

          {/* Component Breakdown List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Component Weights & Metrics</h4>
            {breakdown.map((item, idx) => {
              const pct = (item.pts / item.max) * 100;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                        Weight {item.weight}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {item.pts} / {item.max} pts
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>

                  <p className="text-xs text-slate-400 flex items-start gap-1.5 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.status}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-slate-800 mt-6">
          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Scores are computed deterministically in Python according to verified benchmark rules defined in <code className="text-indigo-400">PLAN.md</code>.
          </p>
        </div>

      </div>
    </div>
  );
};
