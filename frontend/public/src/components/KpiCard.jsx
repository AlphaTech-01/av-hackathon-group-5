import React from 'react';

/**
 * Reusable KPI stat card with optional status tag and contextual subtitle.
 */
export default function KpiCard({ title, value, subtitle, tag, status = 'neutral' }) {
  // Determine badge styling based on health status
  const tagClass = `kpi-tag kpi-tag-${status}`;

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {tag && <span className={tagClass}>{tag}</span>}
      </div>
      <div className="kpi-value">{value}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
    </div>
  );
}
