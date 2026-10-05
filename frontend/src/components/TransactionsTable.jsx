import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { formatINR } from '../middleware/financialMiddleware';

export const TransactionsTable = ({ categoryBreakdown }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Sample clean transactions matching the verified dataset
  const sampleTransactions = [
    { id: 'T0001', date: '2024-10-02', category: 'Salary', desc: 'Monthly salary', amount: 205000, type: 'income', isOutlier: false },
    { id: 'T0002', date: '2024-10-05', category: 'Other Income', desc: 'Consulting income', amount: 18000, type: 'income', isOutlier: false },
    { id: 'T0031', date: '2024-11-07', category: 'Debt Payment', desc: 'Home loan EMI', amount: 28500, type: 'expense', isOutlier: false },
    { id: 'T0032', date: '2024-11-08', category: 'Debt Payment', desc: 'Car loan EMI (Collision Resolved)', amount: 11200, type: 'expense', isOutlier: false },
    { id: 'T0138', date: '2025-02-08', category: 'Other', desc: 'Unspecified Expense (Imputed)', amount: 3099.51, type: 'expense', isOutlier: false },
    { id: 'T0202', date: '2025-05-08', category: 'Food', desc: 'Car loan EMI (Corrected from Foods)', amount: 11200, type: 'expense', isOutlier: false },
    { id: 'T0410', date: '2025-12-18', category: 'Food', desc: 'Food delivery (Deduplicated)', amount: 5007.03, type: 'expense', isOutlier: false },
    { id: 'T0488', date: '2026-03-14', category: 'Utilities', desc: 'Mobile Utility Spike', amount: 185000, type: 'expense', isOutlier: true, normalized: 900 },
    { id: 'T0702', date: '2025-03-23', category: 'Entertainment', desc: 'Streaming (Category Imputed from NaN)', amount: 931.64, type: 'expense', isOutlier: false },
    { id: 'T0816', date: '2026-09-26', category: 'Entertainment', desc: 'Movies', amount: 1909.82, type: 'expense', isOutlier: false }
  ];

  const categories = ['ALL', ...categoryBreakdown.map((c) => c.name)];

  const filtered = sampleTransactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || tx.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Cleaned Transaction Audit View</h3>
          <p className="text-xs text-slate-400">816 Cleaned Records • Outliers Isolated & Deduplicated</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search txn ID or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-all"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <th className="py-3 px-4 font-semibold">Txn ID</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold text-right">Amount</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-indigo-400">{tx.id}</td>
                <td className="py-3 px-4 text-slate-400 font-mono">{tx.date}</td>
                <td className="py-3 px-4">
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
                    {tx.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">{tx.desc}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {tx.type.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {formatINR(tx.amount)}
                </td>
                <td className="py-3 px-4 text-center">
                  {tx.isOutlier ? (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Quarantined
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                      Clean
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
