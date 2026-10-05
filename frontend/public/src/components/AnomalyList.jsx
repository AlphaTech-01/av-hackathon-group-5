import React from 'react';
import { formatINR } from '../utils/format';

/**
 * Top 5 flagged statistical anomalies detected via 3x IQR rule.
 */
export default function AnomalyList({ anomalies }) {
  if (!anomalies || anomalies.length === 0) {
    return <div className="anomaly-card">No transaction anomalies detected.</div>;
  }

  return (
    <div className="anomaly-card">
      <div className="anomaly-header">
        <div>
          <span className="section-label">STATISTICAL OUTLIERS (3x IQR)</span>
          <h3 className="anomaly-title">Top 5 Flagged Transactions</h3>
        </div>
      </div>

      <div className="anomaly-table-wrapper">
        <table className="anomaly-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Deviation</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((item) => {
              const isSuperExtreme = item.multiplier > 10;
              return (
                <tr key={item.txn_id}>
                  <td className="text-muted">{item.date}</td>
                  <td className="font-semibold">{item.category}</td>
                  <td>{item.description || '—'}</td>
                  <td className="anomaly-amount">{formatINR(item.amount)}</td>
                  <td>
                    <span className={`multiplier-badge ${isSuperExtreme ? 'extreme-badge' : ''}`}>
                      {item.multiplier}x typical {item.category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
