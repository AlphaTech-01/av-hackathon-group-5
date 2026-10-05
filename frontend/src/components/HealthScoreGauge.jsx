import React from 'react';
import { HelpCircle, ChevronRight, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export const HealthScoreGauge = ({ scoreData, simulatedScore, onOpenDrawer }) => {
  const { totalScore, rawTotal } = scoreData;
  const { simulatedTotal, gain } = simulatedScore;

  // SVG Radial constants
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full border border-slate-800">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Financial Health Score</span>
          <h2 className="text-xl font-bold text-white mt-0.5">Overall Stability</h2>
        </div>
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Why this score?</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Center Circle Gauge */}
      <div className="my-6 flex flex-col items-center justify-center relative z-10">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Track Circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Score Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-white tracking-tight font-sans">
              {rawTotal.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-0.5">out of 100</span>
          </div>
        </div>

        {/* Health Rating Pill */}
        <div className="mt-4 flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1 rounded-full text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Good Financial Standing</span>
        </div>
      </div>

      {/* Footer Simulation Banner */}
      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Post-Action Potential</span>
            <span className="text-white font-bold">{simulatedTotal}/100 Perfect Score</span>
          </div>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
          +{gain} pts Gain
        </span>
      </div>

    </div>
  );
};
