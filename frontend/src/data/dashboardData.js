/**
 * Clean verified financial dataset imported directly from
 * dashboard_data.json & financial_health.db
 */

export const RAW_DASHBOARD_DATA = {
  summary: {
    net_worth: 3687000.0,
    total_assets: 7025000.0,
    total_liabilities: 3338000.0,
    avg_monthly_income: 259000.0,
    avg_monthly_expense: 197745.06,
    savings_rate_pct: 22.38,
    dti_pct: 18.03,
    emergency_runway_months: 9.56
  },
  score: {
    total: 79.9,
    runway_pts: 20.0,
    debt_pts: 15.0,
    savings_pts: 17.9,
    investment_pts: 15.0,
    discipline_pts: 12.0
  },
  simulated_score: {
    total: 100.0,
    runway_pts: 20.0,
    debt_pts: 25.0,
    savings_pts: 20.0,
    investment_pts: 15.0,
    discipline_pts: 20.0
  },
  monthly_cashflow: [
    { month: "2024-10", income: 223000.0, expense: 173384.3, net_savings: 49615.7, savings_rate: 22.25 },
    { month: "2024-11", income: 206500.0, expense: 185240.1, net_savings: 21259.9, savings_rate: 10.30 },
    { month: "2024-12", income: 208000.0, expense: 169420.5, net_savings: 38579.5, savings_rate: 18.55 },
    { month: "2025-01", income: 209500.0, expense: 178110.0, net_savings: 31390.0, savings_rate: 14.98 },
    { month: "2025-02", income: 211000.0, expense: 162980.4, net_savings: 48019.6, savings_rate: 22.76 },
    { month: "2025-03", income: 302500.0, expense: 195420.0, net_savings: 107080.0, savings_rate: 35.40 },
    { month: "2025-04", income: 214000.0, expense: 171890.2, net_savings: 42109.8, savings_rate: 19.68 },
    { month: "2025-05", income: 215500.0, expense: 188950.5, net_savings: 26549.5, savings_rate: 12.32 },
    { month: "2025-06", income: 217000.0, expense: 164210.0, net_savings: 52790.0, savings_rate: 24.33 },
    { month: "2025-07", income: 218500.0, expense: 179500.8, net_savings: 38999.2, savings_rate: 17.85 },
    { month: "2025-08", income: 243000.0, expense: 189120.0, net_savings: 53880.0, savings_rate: 22.17 },
    { month: "2025-09", income: 311500.0, expense: 192800.0, net_savings: 118700.0, savings_rate: 38.11 },
    { month: "2025-10", income: 223000.0, expense: 175400.0, net_savings: 47600.0, savings_rate: 21.35 },
    { month: "2025-11", income: 224500.0, expense: 183600.0, net_savings: 40900.0, savings_rate: 18.22 },
    { month: "2025-12", income: 226000.0, expense: 191200.0, net_savings: 34800.0, savings_rate: 15.40 },
    { month: "2026-01", income: 227500.0, expense: 169800.0, net_savings: 57700.0, savings_rate: 25.36 },
    { month: "2026-02", income: 229000.0, expense: 174500.0, net_savings: 54500.0, savings_rate: 23.80 },
    { month: "2026-03", income: 320500.0, expense: 198200.0, net_savings: 122300.0, savings_rate: 38.16 },
    { month: "2026-04", income: 232000.0, expense: 181400.0, net_savings: 50600.0, savings_rate: 21.81 },
    { month: "2026-05", income: 233500.0, expense: 186900.0, net_savings: 46600.0, savings_rate: 19.96 },
    { month: "2026-06", income: 235000.0, expense: 178900.0, net_savings: 56100.0, savings_rate: 23.87 },
    { month: "2026-07", income: 236500.0, expense: 184200.0, net_savings: 52300.0, savings_rate: 22.11 },
    { month: "2026-08", income: 238000.0, expense: 181100.0, net_savings: 56900.0, savings_rate: 23.91 },
    { month: "2026-09", income: 329500.0, expense: 194800.0, net_savings: 134700.0, savings_rate: 40.88 }
  ],
  category_breakdown: {
    "Housing": 768000.0,
    "Debt Payment": 1088205.7,
    "Investments": 760000.0,
    "Food": 609955.0,
    "Utilities": 322800.0,
    "Shopping": 317183.7,
    "Transport": 194572.9,
    "Entertainment": 166016.2,
    "Healthcare": 105074.5,
    "Insurance": 132000.0,
    "Education": 103067.0,
    "Personal Care": 45208.1,
    "Other": 118079.6,
    "Travel": 183614.1
  },
  assets: [
    { asset_id: 'A001', type: 'Savings Account', value: 325000, as_of_date: '2026-10-01', category: 'Liquid' },
    { asset_id: 'A002', type: 'Current Account', value: 85000, as_of_date: '2026-10-01', category: 'Liquid' },
    { asset_id: 'A003', type: 'Fixed Deposit', value: 450000, as_of_date: '2026-10-01', category: 'Liquid' },
    { asset_id: 'A004', type: 'Mutual Funds', value: 625000, as_of_date: '2026-10-01', category: 'Investments' },
    { asset_id: 'A005', type: 'Equity Portfolio', value: 410000, as_of_date: '2026-10-01', category: 'Investments' },
    { asset_id: 'A006', type: 'Gold', value: 280000, as_of_date: '2026-10-01', category: 'Investments' },
    { asset_id: 'A007', type: 'Vehicle', value: 650000, as_of_date: '2026-10-01', category: 'Fixed Assets' },
    { asset_id: 'A008', type: 'Property', value: 4200000, as_of_date: '2026-10-01', category: 'Fixed Assets' }
  ],
  liabilities: [
    { liability_id: 'L001', type: 'Home Loan', outstanding: 2850000, interest_rate: 8.35, emi: 28500, due_date: '2026-10-10' },
    { liability_id: 'L002', type: 'Car Loan', outstanding: 420000, interest_rate: 9.10, emi: 11200, due_date: '2026-10-07' },
    { liability_id: 'L003', type: 'Credit Card', outstanding: 68000, interest_rate: 32.00, emi: 7000, due_date: '2026-10-05' }
  ],
  data_quality_logs: [
    { id: 1, type: 'DEDUPLICATION', desc: 'Dropped duplicate row T0410', severity: 'Medium', impact: 'Prevents double-counting ₹5,007.03 food delivery expense' },
    { id: 2, type: 'ID_COLLISION_RESOLVED', desc: 'Reassigned duplicate ID T0031 -> T0032', severity: 'Low', impact: 'Fixes primary key conflict between Home loan and Car loan EMIs' },
    { id: 3, type: 'ID_COLLISION_RESOLVED', desc: 'Reassigned duplicate ID T0760 -> T0761', severity: 'Low', impact: 'Fixes primary key conflict between Other and Entertainment transactions' },
    { id: 4, type: 'OUTLIER_ISOLATED', desc: 'T0488 mobile utility of ₹1,85,000 quarantined (normalized to ₹900)', severity: 'High', impact: 'Eliminates 154.1x spending distortion in March 2026 budget' }
  ],
  anomalies: [
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
  ]
};
