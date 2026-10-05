import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Calendar, Info } from 'lucide-react';
import { formatINR } from '../middleware/financialMiddleware';

export const CashFlowChart = ({ cashFlowData }) => {
  const [viewMode, setViewMode] = useState('all'); // 'all', '12m', '6m'

  const getFilteredData = () => {
    if (viewMode === '6m') return cashFlowData.slice(-6);
    if (viewMode === '12m') return cashFlowData.slice(-12);
    return cashFlowData;
  };

  const filteredData = getFilteredData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B1120]/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl text-xs z-50">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-white text-sm">{label}</span>
            <span className="text-slate-400">24-Mo Journey</span>
          </div>
          <div className="space-y-1.5 font-mono">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}:
                </span>
                <span className="font-bold text-white">{formatINR(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
      
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Monthly Cash Flow Journey</h3>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
              24 Months
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Track Income, Normalized Expenses & 3-Month Moving Average</p>
        </div>

        {/* Time horizon buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'all' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All 24M
          </button>
          <button
            onClick={() => setViewMode('12m')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === '12m' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 12M
          </button>
          <button
            onClick={() => setViewMode('6m')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === '6m' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 6M
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => formatINR(val, true)} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />

            <Bar dataKey="income" name="Monthly Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expense" name="Living Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Line type="monotone" dataKey="net_savings" name="Net Savings" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366F1' }} />
            <Line type="monotone" dataKey="ma3" name="3MA Trend" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info Pill */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-indigo-400" />
          <span>Salary bonuses included in March & September annual cycles.</span>
        </div>
        <span className="text-emerald-400 font-semibold">Net Cash Flow Always Positive</span>
      </div>

    </div>
  );
};
