import React from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { formatINR } from '../middleware/financialMiddleware';

export const AnomaliesBanner = ({ anomalies }) => {
  if (!anomalies || anomalies.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-slate-900 shadow-xl relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 glow-amber-card">
            <ShieldAlert className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">IQR Anomaly Engine Detected Outlier Spike</h3>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-amber-500/30">
                154.1x Deviation
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong className="text-white">Transaction T0488 (2026-03-14):</strong> Mobile Utility bill of{' '}
              <span className="font-mono text-amber-300 font-bold">{formatINR(185000)}</span> is{' '}
              <span className="underline decoration-amber-400">154.1x higher than category median ({formatINR(1200)})</span>.
            </p>
          </div>
        </div>

        {/* Action Taken Badge */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-xs shrink-0 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">Cleaning Engine Status:</span>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Quarantined to ₹900
          </span>
        </div>

      </div>

    </div>
  );
};
