/**
 * Financial Controller Layer
 * Manages financial logic, component breakdowns, simulated improvements,
 * and anomaly explanations. Supports both Live FastAPI responses & local dataset fallback.
 */

import { formatINR, formatPercent, processCashFlowSeries, calculateDataQualityScore } from '../middleware/financialMiddleware';

export class FinancialController {
  constructor(data) {
    this.raw = data || {};
  }

  getSummary() {
    // Live FastAPI format uses balance_sheet and monthly_averages
    const bs = this.raw.balance_sheet;
    const ma = this.raw.monthly_averages;
    const s = this.raw.summary || {};

    const netWorth = bs?.net_worth ?? s.net_worth ?? 3687000;
    const totalAssets = bs?.total_assets ?? s.total_assets ?? 7025000;
    const totalLiabilities = bs?.total_liabilities ?? s.total_liabilities ?? 3338000;
    const income = ma?.avg_monthly_income ?? s.avg_monthly_income ?? 259000;
    const expense = ma?.avg_living_expenses ?? s.avg_monthly_expense ?? 197745;
    const savingsRate = ma?.avg_savings_rate_pct ?? s.savings_rate_pct ?? 22.38;
    const dti = ma?.avg_dti_pct ?? s.dti_pct ?? 18.03;
    const runway = ma?.liquidity_months ?? s.emergency_runway_months ?? 9.5;

    return {
      netWorthFormatted: formatINR(netWorth, true),
      netWorthRaw: netWorth,
      totalAssetsFormatted: formatINR(totalAssets, true),
      totalLiabilitiesFormatted: formatINR(totalLiabilities, true),
      avgMonthlyIncome: formatINR(income),
      avgMonthlyExpense: formatINR(expense),
      savingsRatePct: formatPercent(savingsRate),
      dtiPct: formatPercent(dti),
      emergencyRunwayMonths: `${typeof runway === 'number' ? runway.toFixed(1) : runway} mos`
    };
  }

  getHealthScore() {
    const sc = this.raw.score || this.raw.health_score || {
      total: 79.9,
      runway_pts: 20.0,
      debt_pts: 15.0,
      savings_pts: 17.9,
      investment_pts: 15.0,
      discipline_pts: 12.0
    };
    const total = sc.total ?? sc.overall_health_score ?? 80;

    return {
      totalScore: Math.round(total),
      rawTotal: total,
      breakdown: [
        { name: 'Emergency Runway', pts: sc.runway_pts ?? 20, max: 20, weight: '20%', status: 'Optimal (9.6 mos vs 6 mo target)' },
        { name: 'Savings Rate', pts: sc.savings_pts ?? 18, max: 20, weight: '20%', status: 'Good (22.4% vs 30% target)' },
        { name: 'Debt Burden (DTI)', pts: sc.debt_pts ?? 15, max: 25, weight: '25%', status: 'Fair (18.0% DTI, CC @ 32% interest)' },
        { name: 'Investment Ratio', pts: sc.investment_pts ?? 15, max: 15, weight: '15%', status: 'Healthy Mutual Fund & Equity allocation' },
        { name: 'Budget Discipline', pts: sc.discipline_pts ?? 12, max: 20, weight: '20%', status: 'High consistency (1 outlier resolved)' }
      ]
    };
  }

  getSimulatedScore() {
    const debtSim = this.raw.predictions?.debt_free_simulation;
    const simTotal = this.raw.simulated_score?.total ?? (debtSim ? debtSim.score_with_credit_card_cleared : 100);
    const currentTotal = this.getHealthScore().rawTotal;

    return {
      simulatedTotal: Math.round(simTotal),
      gain: Math.round(simTotal - currentTotal)
    };
  }

  getCashFlowSeries() {
    const list = this.raw.monthly_timeline || this.raw.monthly_cashflow || [];
    const normalized = list.map(item => ({
      month: item.month,
      income: item.income ?? item.total_income ?? 0,
      expense: item.expense ?? item.total_outflows ?? item.living_expenses ?? 0,
      net_savings: item.net_savings ?? item.net_cash_flow ?? 0,
      savings_rate: item.savings_rate ?? item.savings_rate_pct ?? 0
    }));
    return processCashFlowSeries(normalized);
  }

  getCategoryBreakdown() {
    if (Array.isArray(this.raw.category_distribution)) {
      return this.raw.category_distribution.map(c => ({
        name: c.category,
        value: Math.round(c.total_amount),
        formatted: formatINR(c.total_amount, true)
      })).sort((a, b) => b.value - a.value);
    }
    const cat = this.raw.category_breakdown || {};
    const items = Object.entries(cat).map(([name, value]) => ({
      name,
      value: Math.round(value),
      formatted: formatINR(value, true)
    }));
    return items.sort((a, b) => b.value - a.value);
  }

  getAssetsAndLiabilities() {
    if (this.raw.balance_sheet) {
      const bs = this.raw.balance_sheet;
      return {
        assets: [
          { asset_id: 'A001', type: 'Liquid Savings & FD', value: bs.liquid_assets || 860000, as_of_date: '2026-10-01', category: 'Liquid' },
          { asset_id: 'A002', type: 'Mutual Funds & Equities', value: bs.investment_assets || 1315000, as_of_date: '2026-10-01', category: 'Investments' },
          { asset_id: 'A003', type: 'Property & Fixed Assets', value: bs.fixed_assets || 4850000, as_of_date: '2026-10-01', category: 'Fixed Assets' }
        ],
        liabilities: [
          { liability_id: 'L001', type: 'Total Liabilities (Mortgage & Loans)', outstanding: bs.total_liabilities || 3338000, interest_rate: 8.5, emi: bs.monthly_scheduled_emi || 46700, due_date: '2026-10-10' },
          { liability_id: 'L002', type: 'High-Interest Credit Card', outstanding: bs.credit_card?.outstanding || 68000, interest_rate: bs.credit_card?.interest_rate || 32.0, emi: 7000, due_date: '2026-10-05' }
        ]
      };
    }
    return {
      assets: this.raw.assets || [],
      liabilities: this.raw.liabilities || []
    };
  }

  getDataQualityInfo() {
    const logs = this.raw.data_quality_logs || this.raw.audit_observations || [
      { id: 1, type: 'DEDUPLICATION', desc: 'Dropped duplicate row T0410', severity: 'Medium', impact: 'Prevents double-counting ₹5,007.03 food delivery expense' },
      { id: 2, type: 'ID_COLLISION_RESOLVED', desc: 'Reassigned duplicate ID T0031 -> T0032', severity: 'Low', impact: 'Fixes primary key conflict between Home loan and Car loan EMIs' },
      { id: 3, type: 'OUTLIER_ISOLATED', desc: 'T0488 mobile utility of ₹1,85,000 quarantined (normalized to ₹900)', severity: 'High', impact: 'Eliminates 154.1x spending distortion in March 2026 budget' }
    ];
    return {
      ...calculateDataQualityScore(logs.length),
      logs
    };
  }

  getAnomalies() {
    return this.raw.anomalies || [
      {
        txn_id: 'T0488',
        date: '2026-03-14',
        category: 'Utilities',
        description: 'Mobile',
        amount: 185000.0,
        median_amount: 1200.0,
        multiplier: 154.1,
        status: 'Quarantined',
        recommendation: 'Audit bill with mobile carrier for billing error'
      }
    ];
  }
}
