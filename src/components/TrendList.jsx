import React from 'react';
import { formatINR } from '../utils/format';

/**
 * List of recent spending trends and savings velocity.
 */
export default function TrendList({ trendsData }) {
  if (!trendsData) {
    return <div className="trend-card">Loading spending trends...</div>;
  }

  const { category_trends = [], savings_rate_trend = 'stable' } = trendsData;
  const flaggedTrends = category_trends.filter((t) => t.is_flagged);

  const srTrendBadgeClass =
    savings_rate_trend === 'improving'
      ? 'sr-badge sr-badge-positive'
      : savings_rate_trend === 'worsening'
      ? 'sr-badge sr-badge-negative'
      : 'sr-badge sr-badge-neutral';

  return (
    <div className="trend-card">
      <div className="trend-header">
        <div>
          <span className="section-label">RECENT SHIFTS & SURGES</span>
          <h3 className="trend-title">Monthly Spending Trends</h3>
        </div>
        <div className="sr-trend-indicator">
          <span className="sr-trend-label">Savings Velocity:</span>
          <span className={srTrendBadgeClass}>
            {savings_rate_trend.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="trend-items">
        {flaggedTrends.length === 0 ? (
          <div className="empty-notice">No unusual category spending surges detected.</div>
        ) : (
          flaggedTrends.map((trend) => {
            const isUp = trend.direction === 'up';
            const badgeClass = isUp ? 'trend-arrow-up' : 'trend-arrow-down';
            const sign = isUp ? '+' : '';

            return (
              <div key={trend.category} className="trend-row">
                <div className="trend-main">
                  <div className="trend-symbol-group">
                    <span className={badgeClass}>{isUp ? '▲' : '▼'}</span>
                    <span className="trend-category-name">{trend.category}</span>
                  </div>
                  <div className="trend-narrative">{trend.message}</div>
                </div>

                <div className="trend-metric">
                  <span className={`trend-pct-val ${isUp ? 'text-surge' : 'text-drop'}`}>
                    {sign}{trend.pct_change}%
                  </span>
                  <span className="trend-diff-rupees">
                    {sign}{formatINR(trend.abs_change)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
