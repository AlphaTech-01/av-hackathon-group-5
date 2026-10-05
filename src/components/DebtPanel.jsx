import React from 'react';
import { formatINR, formatPercent } from '../utils/format';

/**
 * Debt assessment panel showing loan schedule, interest rates, and burden ratios.
 */
export default function DebtPanel({ debtData }) {
  if (!debtData || !debtData.items) {
    return <div className="debt-card">Loading debt information...</div>;
  }

  const { items, total_liabilities, total_emi, weighted_interest_rate, emi_to_income, debt_to_asset, highest_interest_liability } = debtData;

  const emiStatus = emi_to_income <= 0.20 ? 'Healthy' : emi_to_income <= 0.40 ? 'Moderate' : 'High Risk';
  const debtStatus = debt_to_asset <= 0.20 ? 'Strong' : debt_to_asset <= 0.50 ? 'Manageable' : 'Over-leveraged';

  return (
    <div className="debt-card">
      <div className="debt-header">
        <div>
          <span className="section-label">LIABILITIES & LEVERAGE</span>
          <h3 className="debt-title">Debt Obligations & Repayment Schedule</h3>
        </div>
        {highest_interest_liability && (
          <div className="urgent-debt-badge">
            ⚠️ Highest Rate: {highest_interest_liability.type} ({highest_interest_liability.interest_rate}% APR)
          </div>
        )}
      </div>

      {/* Ratios quick grid */}
      <div className="debt-kpi-grid">
        <div className="debt-stat-box">
          <span className="stat-label">EMI-to-Income Ratio</span>
          <span className="stat-val" style={{ color: emi_to_income <= 0.20 ? '#22C55E' : '#F59E0B' }}>
            {formatPercent(emi_to_income)}
          </span>
          <span className="stat-desc">Status: {emiStatus} (Benchmark: &le; 20%)</span>
        </div>

        <div className="debt-stat-box">
          <span className="stat-label">Debt-to-Asset Ratio</span>
          <span className="stat-val" style={{ color: debt_to_asset <= 0.50 ? '#38BDF8' : '#EF4444' }}>
            {formatPercent(debt_to_asset)}
          </span>
          <span className="stat-desc">Status: {debtStatus} (Benchmark: &le; 20%)</span>
        </div>

        <div className="debt-stat-box">
          <span className="stat-label">Total Monthly EMI</span>
          <span className="stat-val">{formatINR(total_emi)}</span>
          <span className="stat-desc">Committed monthly payment</span>
        </div>

        <div className="debt-stat-box">
          <span className="stat-label">Weighted Interest Rate</span>
          <span className="stat-val">{weighted_interest_rate}%</span>
          <span className="stat-desc">Average cost of borrowing</span>
        </div>
      </div>

      {/* Liabilities detail table */}
      <div className="table-responsive">
        <table className="debt-table">
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Outstanding Balance</th>
              <th>Interest Rate (APR)</th>
              <th>Monthly EMI</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isHighRate = item.interest_rate >= 20;
              return (
                <tr key={item.liability_id}>
                  <td className="font-semibold">
                    {item.type}
                    {isHighRate && <span className="rate-flag">High APR</span>}
                  </td>
                  <td>{formatINR(item.outstanding)}</td>
                  <td style={{ color: isHighRate ? '#EF4444' : '#E2E8F0', fontWeight: isHighRate ? 700 : 400 }}>
                    {item.interest_rate}%
                  </td>
                  <td>{formatINR(item.emi)}</td>
                  <td>Day {item.due_date.split('-')[2]} of month</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total Debt</td>
              <td>{formatINR(total_liabilities)}</td>
              <td>—</td>
              <td>{formatINR(total_emi)} / mo</td>
              <td>—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
