import React from 'react';

/**
 * Visual semicircle SVG gauge displaying overall health score and rating band.
 */
function getBandColor(score) {
  if (score >= 80) return '#22C55E'; // Healthy (Green)
  if (score >= 60) return '#38BDF8'; // Fair (Sky Blue / Cyan)
  if (score >= 40) return '#F59E0B'; // Needs Attention (Orange)
  return '#EF4444';                  // At Risk (Red)
}

export default function ScoreGauge({ score, band }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const bandColor = getBandColor(safeScore);

  // SVG semicircle geometry (radius = 80, stroke = 14)
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference * (1 - safeScore / 100);

  return (
    <div className="gauge-card">
      <div className="gauge-header">
        <span className="section-label">OVERALL HEALTH SCORE</span>
        <h2 className="gauge-title">Financial Vitality</h2>
      </div>

      <div className="gauge-container">
        <svg viewBox="0 0 200 115" className="gauge-svg">
          {/* Background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Active progress arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={bandColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>

        <div className="gauge-center-content">
          <div className="gauge-score-value" style={{ color: bandColor }}>
            {safeScore}
          </div>
          <div className="gauge-score-max">/ 100</div>
        </div>
      </div>

      <div className="gauge-footer">
        <span className="band-pill" style={{ backgroundColor: `${bandColor}22`, color: bandColor, borderColor: bandColor }}>
          {band || 'Analyzing'}
        </span>
        <p className="gauge-caption">
          Transparent, rule-based composite of savings, debt, liquidity, and stability.
        </p>
      </div>
    </div>
  );
}
