import React from 'react';

/**
 * Data Quality and Ingestion Integrity audit card (showcasing automated cleaning).
 */
export default function DataQualityCard({ qualityData }) {
  if (!qualityData) {
    return null;
  }

  const {
    rows_in = 0,
    rows_out = 0,
    duplicates_removed = 0,
    missing_dates_dropped = 0,
    missing_amounts_dropped = 0,
    missing_categories_filled = 0,
    missing_types_inferred = 0,
    outliers_flagged = 0,
  } = qualityData;

  const metrics = [
    { label: 'Raw Records In', value: rows_in, tag: 'Source' },
    { label: 'Clean Records Out', value: rows_out, tag: 'Processed' },
    { label: 'Duplicates Removed', value: duplicates_removed, tag: 'Cleaned' },
    { label: 'Unparseable Dates', value: missing_dates_dropped, tag: 'Dropped' },
    { label: 'Missing Categories', value: missing_categories_filled, tag: 'Auto-filled' },
    { label: 'Outliers Flagged', value: outliers_flagged, tag: '3x IQR Audit' },
  ];

  return (
    <div className="quality-card">
      <div className="quality-header">
        <div>
          <span className="section-label">DATA PIPELINE AUDIT</span>
          <h3 className="quality-title">Automated Data Ingestion & Quality Report</h3>
        </div>
        <span className="quality-badge">✓ Pipeline Validated</span>
      </div>

      <p className="quality-desc">
        The synthetic dataset contained intentional anomalies, duplicates, and missing values.
        Our Step 1 ingestion engine cleaned the data in real-time before computing any metrics.
      </p>

      <div className="quality-grid">
        {metrics.map((m) => (
          <div key={m.label} className="quality-metric-item">
            <div className="quality-metric-top">
              <span className="quality-metric-label">{m.label}</span>
              <span className="quality-metric-tag">{m.tag}</span>
            </div>
            <div className="quality-metric-val">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
