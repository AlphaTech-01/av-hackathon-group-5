import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { formatINR } from '../middleware/financialMiddleware';

const COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#EC4899', '#3B82F6', '#14B8A6', '#F97316'
];

export const CategoryDonutChart = ({ categoryData }) => {
  const totalExpense = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const pct = ((data.value / totalExpense) * 100).toFixed(1);
      return (
        <div className="bg-[#0B1120]/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs z-50">
          <p className="font-bold text-white mb-1">{data.name}</p>
          <p className="text-slate-300 font-mono">{formatINR(data.value)} ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full">
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Category Outflow Allocation</h3>
            <p className="text-xs text-slate-400">Total 24-Month Expenditure Breakdown</p>
          </div>
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <PieIcon className="h-4 w-4" />
          </div>
        </div>

        {/* Donut Chart Canvas */}
        <div className="h-52 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Central Summary overlay */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total</span>
            <span className="text-sm font-extrabold text-white">{formatINR(totalExpense, true)}</span>
          </div>
        </div>
      </div>

      {/* Top 4 Categories list */}
      <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-xs">
        {categoryData.slice(0, 4).map((cat, idx) => {
          const pct = ((cat.value / totalExpense) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-300 font-medium">{cat.name}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-400">{pct}%</span>
                <span className="font-bold text-white">{cat.formatted}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
