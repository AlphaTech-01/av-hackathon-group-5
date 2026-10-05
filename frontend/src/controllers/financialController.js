/**
 * Financial Controller Layer
 * Manages financial logic, component breakdowns, simulated improvements,
 * and anomaly explanations.
 */

import { formatINR, formatPercent, processCashFlowSeries, calculateDataQualityScore } from '../middleware/financialMiddleware';

export class FinancialController {
  constructor(data) {
    this.raw = data;
  }

  getSummary() {
    const s = this.raw.summary;
    return {
      netWorthFormatted: formatINR(s.net_worth, true),
      netWorthRaw: s.net_worth,
      totalAssetsFormatted: formatINR(s.total_assets, true),
      totalLiabilitiesFormatted: formatINR(s.total_liabilities, true),
      avgMonthlyIncome: formatINR(s.avg_monthly_income),
      avgMonthlyExpense: formatINR(s.avg_monthly_expense),
      savingsRatePct: formatPercent(s.savings_rate_pct),
      dtiPct: formatPercent(s.dti_pct),
      emergencyRunwayMonths: `${s.emergency_runway_months.toFixed(1)} mos`
    };
  }

  getHealthScore() {
    const sc = this.raw.score;
    return {
      totalScore: Math.round(sc.total),
      rawTotal: sc.total,
      breakdown: [
        { name: 'Emergency Runway', pts: sc.runway_pts, max: 20, weight: '20%', status: 'Optimal (9.6 mos vs 6 mo target)' },
        { name: 'Savings Rate', pts: sc.savings_pts, max: 20, weight: '20%', status: 'Good (22.4% vs 30% target)' },
        { name: 'Debt Burden (DTI)', pts: sc.debt_pts, max: 25, weight: '25%', status: 'Fair (18.0% DTI, CC @ 32% interest)' },
        { name: 'Investment Ratio', pts: sc.investment_pts, max: 15, weight: '15%', status: 'Healthy Mutual Fund & Equity allocation' },
        { name: 'Budget Discipline', pts: sc.discipline_pts, max: 20, weight: '20%', status: 'High consistency (1 outlier resolved)' }
      ]
    };
  }

  getSimulatedScore() {
    const sim = this.raw.simulated_score;
    return {
      simulatedTotal: Math.round(sim.total),
      gain: Math.round(sim.total - this.raw.score.total)
    };
  }

  getCashFlowSeries() {
    return processCashFlowSeries(this.raw.monthly_cashflow);
  }

  getCategoryBreakdown() {
    const cat = this.raw.category_breakdown;
    const items = Object.entries(cat).map(([name, value]) => ({
      name,
      value: Math.round(value),
      formatted: formatINR(value, true)
    }));
    return items.sort((a, b) => b.value - a.value);
  }

  getAssetsAndLiabilities() {
    return {
      assets: this.raw.assets || [],
      liabilities: this.raw.liabilities || []
    };
  }

  getDataQualityInfo() {
    return {
      ...calculateDataQualityScore(this.raw.data_quality_logs.length),
      logs: this.raw.data_quality_logs
    };
  }

  getAnomalies() {
    return this.raw.anomalies || [];
  }
}
