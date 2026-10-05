import React from 'react';
import { Activity, ShieldCheck, Database, Sparkles, SlidersHorizontal } from 'lucide-react';

export const Header = ({ onOpenAuditModal, onOpenUploadModal, isLiveBackend, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
              <Activity className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-sans">Financial Health Engine</h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  v2.0 Clean Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Asset Vantage Hackathon • Group 5</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 text-xs font-medium w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('cashflow')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'cashflow'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Cash Flow Analytics
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'assets'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Balance Sheet
          </button>
        </div>

        {/* Data Quality & System Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          
          {/* Upload CSV Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-3.5 py-1.5 rounded-xl transition-all text-xs font-semibold cursor-pointer shadow-sm hover:border-indigo-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Upload CSV</span>
          </button>

          {/* Data Quality Score Pill */}
          <button
            onClick={onOpenAuditModal}
            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl transition-all shadow-sm glow-emerald-card text-xs font-semibold group cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>98.4% Data Quality</span>
            <span className="bg-emerald-500/20 text-[10px] px-1.5 py-0.5 rounded text-emerald-300 font-mono">
              Audit Log
            </span>
          </button>

          {/* Backend Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Database className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-300 font-medium">
              {isLiveBackend ? 'FastAPI Live' : 'Verified SQLite'}
            </span>
            <span className={`h-2 w-2 rounded-full ${isLiveBackend ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}></span>
          </div>
        </div>

      </div>
    </header>
  );
};
