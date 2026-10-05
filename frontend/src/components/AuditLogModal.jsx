import React, { useState } from 'react';
import { X, ShieldCheck, Database, CheckCircle, Search, Filter } from 'lucide-react';

export const AuditLogModal = ({ isOpen, onClose, auditData }) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const { score, grade, formula, logs } = auditData;

  const filteredLogs = logs.filter(
    (log) =>
      log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.impact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 glow-emerald-card">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Data Quality Audit Log Engine</h3>
              <p className="text-xs text-slate-400">Verifiable Data Transformations & Deduplications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quality Score Formula Card */}
        <div className="p-6 bg-slate-900/30 border-b border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/20">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Data Quality Score</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">{score}%</span>
              <span className="text-xs text-slate-300 ml-2 font-medium">({grade})</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Cleaned Record Actions</span>
              <span className="text-sm font-bold text-white">{logs.length} Issues Resolved</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="text-slate-400 block mb-1">Explicit Deterministic Formula:</span>
            <code>{formula}</code>
          </div>
        </div>

        {/* Search Bar & Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit actions, descriptions or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">{filteredLogs.length} Records</span>
          </div>

          {/* Audit Log Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4 font-semibold">Action Type</th>
                  <th className="py-3 px-4 font-semibold">Issue & Transformation Log</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Financial Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      {log.type}
                    </td>
                    <td className="py-3 px-4 text-slate-200">{log.desc}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'High'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-500/20"
          >
            Close Audit Inspector
          </button>
        </div>

      </div>

    </div>
  );
};
