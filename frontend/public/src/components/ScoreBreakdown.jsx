import React from 'react';

/**
 * Detailed 5-pillar breakdown showing weights, points earned, and rationale.
 */
export default function ScoreBreakdown({ components }) {
  if (!components || components.length === 0) {
    return <div className="breakdown-card">Loading breakdown...</div>;
  }

  return (
    <div className="breakdown-card">
      <div className="breakdown-header">
        <span className="section-label">TRANSPARENT EVALUATION</span>
        <h2 className="breakdown-title">Score Components (100 Pts Total)</h2>
      </div>

      <div className="component-list">
        {components.map((comp) => {
          const percentEarned = comp.weight > 0 ? (comp.points / comp.weight) * 100 : 0;
          const isHigh = percentEarned >= 70;
          const isMedium = percentEarned >= 40 && percentEarned < 70;
          const barColor = isHigh ? '#22C55E' : isMedium ? '#F59E0B' : '#EF4444';

          return (
            <div key={comp.key} className="component-item">
              <div className="component-top-row">
                <div className="component-title-group">
                  <span className="component-name">{comp.label}</span>
                  <span className="component-explanation">{comp.explanation}</span>
                </div>
                <div className="component-points-group">
                  <span className="points-earned" style={{ color: barColor }}>
                    {comp.points}
                  </span>
                  <span className="points-max"> / {comp.weight} pts</span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, percentEarned))}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
