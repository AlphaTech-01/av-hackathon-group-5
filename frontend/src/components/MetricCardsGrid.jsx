import React from 'react';
import { Wallet, Landmark, CreditCard, ArrowUpRight, ArrowDownRight, PiggyBank, ShieldAlert, Compass } from 'lucide-react';

export const MetricCardsGrid = ({ summary }) => {
  const cards = [
    {
      title: 'Net Worth',
      value: summary.netWorthFormatted,
      subtitle: 'Assets - Liabilities',
      icon: Wallet,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      trend: '+12.4% YoY',
      isPositive: true
    },
    {
      title: 'Total Assets',
      value: summary.totalAssetsFormatted,
      subtitle: 'Liquid + Investments + Property',
      icon: Landmark,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      trend: '₹70.25 L Total',
      isPositive: true
    },
    {
      title: 'Total Liabilities',
      value: summary.totalLiabilitiesFormatted,
      subtitle: 'Home + Car + Credit Card',
      icon: CreditCard,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      trend: '3 Debt Obligations',
      isPositive: false
    },
    {
      title: 'Savings Rate',
      value: summary.savingsRatePct,
      subtitle: 'Income saved & invested',
      icon: PiggyBank,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      trend: 'Target: >20%',
      isPositive: true
    },
    {
      title: 'Avg Monthly Income',
      value: summary.avgMonthlyIncome,
      subtitle: 'Salary + Consulting',
      icon: ArrowUpRight,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      trend: '24 Mo Avg',
      isPositive: true
    },
    {
      title: 'Avg Monthly Expense',
      value: summary.avgMonthlyExpense,
      subtitle: 'Living + Debt Service',
      icon: ArrowDownRight,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      trend: 'Normalized',
      isPositive: false
    },
    {
      title: 'EMI Burden (DTI)',
      value: summary.dtiPct,
      subtitle: 'Debt-to-Income ratio',
      icon: ShieldAlert,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      trend: 'Safe < 30%',
      isPositive: true
    },
    {
      title: 'Emergency Runway',
      value: summary.emergencyRunwayMonths,
      subtitle: 'Liquid cash buffer',
      icon: Compass,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      trend: '9.6 Months Liquid',
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel glass-panel-hover rounded-2xl p-4.5 border border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{card.title}</span>
              <div className={`h-8 w-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center border ${card.borderColor}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </div>

            <div className="my-1">
              <span className="text-2xl font-extrabold text-white tracking-tight font-sans block">
                {card.value}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">{card.subtitle}</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">{card.trend}</span>
              <span className={`px-2 py-0.5 rounded-md font-semibold ${card.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                Active
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
