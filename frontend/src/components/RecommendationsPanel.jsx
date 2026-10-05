import React, { useState } from 'react';
import { Sparkles, Bot, ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';
import { fetchAIRecommendations } from '../api/financialApi';

export const RecommendationsPanel = () => {
  const [useFallback, setUseFallback] = useState(false);
  const [recommendations, setRecommendations] = useState([
    {
      priority: 1,
      action: "Pay off high-interest Credit Card debt of ₹68,000 immediately",
      reason: "Credit card carries a high 32.0% APR, incurring ₹1,813 in monthly interest costs. Liquid savings pool (₹8.60L) comfortably covers this payoff.",
      expected_impact: "Saves ₹21,760 in annual interest & boosts Health Score by +10.0 pts.",
      urgency: "HIGH"
    },
    {
      priority: 2,
      action: "Audit and dispute ₹1,85,000 utility charge spike (T0488)",
      reason: "March 2026 Mobile Utility bill is 154.1x higher than category median (₹1,200). Outlier isolated by cleaning engine.",
      expected_impact: "Protects cash flow from erroneous bill deduction.",
      urgency: "HIGH"
    },
    {
      priority: 3,
      action: "Increase Monthly Mutual Fund SIP by ₹15,000",
      reason: "Current savings rate is 22.38%. Increasing investments raises long-term wealth building towards 30%+ benchmark.",
      expected_impact: "Boosts long-term net worth & improves Savings score component.",
      urgency: "MEDIUM"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    const isChecked = e.target.checked;
    setUseFallback(isChecked);
    setLoading(true);
    const res = await fetchAIRecommendations(isChecked);
    setRecommendations(res.actions);
    setLoading(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between h-full">
      
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Recommended Action Plan</h3>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Exactly 3 Actions
              </span>
            </div>
            <p className="text-xs text-slate-400">Pydantic Validated • Precomputed Financial Metrics Only</p>
          </div>
        </div>

        {/* AI / Fallback Toggle Switch */}
        <label className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-xs cursor-pointer hover:border-slate-700 transition-all">
          <Bot className="h-4 w-4 text-indigo-400" />
          <span className="text-slate-300 font-medium">Rule-Based Fallback Mode</span>
          <input
            type="checkbox"
            checked={useFallback}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
        </label>
      </div>

      {/* 3 Action Cards */}
      <div className="space-y-4">
        {recommendations.map((item) => (
          <div
            key={item.priority}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/30 transition-all group relative overflow-hidden"
          >
            {/* Priority Indicator Pill */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-extrabold text-xs flex items-center justify-center border border-indigo-500/30">
                  #{item.priority}
                </span>
                <span className="text-xs font-bold text-white tracking-wide">{item.action}</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  item.urgency === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {item.urgency} URGENCY
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-2.5 leading-relaxed pl-8">
              {item.reason}
            </p>

            {/* Expected Impact Footer */}
            <div className="ml-8 pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
              <Zap className="h-3.5 w-3.5 shrink-0" />
              <span>Expected Impact: {item.expected_impact}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>LLM is strictly forbidden from doing math calculations.</span>
        </span>
        <span className="font-mono text-slate-400">Gemini Flash / Flash-Lite</span>
      </div>

    </div>
  );
};
