import React from 'react';

/**
 * 3 Prioritized rule-based actionable recommendations.
 */
export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return <div className="rec-loading">Loading recommendations...</div>;
  }

  const priorityColors = {
    1: '#EF4444', // Priority 1 (Red / Urgent)
    2: '#F59E0B', // Priority 2 (Orange / High)
    3: '#38BDF8', // Priority 3 (Sky Blue / Medium)
  };

  return (
    <div className="recommendations-container">
      <div className="rec-grid">
        {recommendations.map((rec) => {
          const color = priorityColors[rec.priority] || '#38BDF8';
          return (
            <div key={rec.priority} className="rec-card">
              <div className="rec-header">
                <span
                  className="rec-priority-badge"
                  style={{ backgroundColor: `${color}22`, color: color, borderColor: color }}
                >
                  PRIORITY #{rec.priority}
                </span>
              </div>

              <h4 className="rec-title">{rec.title}</h4>

              <div className="rec-section">
                <span className="rec-label">WHY THIS MATTERS</span>
                <p className="rec-text">{rec.why}</p>
              </div>

              <div className="rec-section rec-action-box">
                <span className="rec-label action-label">RECOMMENDED ACTION</span>
                <p className="rec-action-text">{rec.action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
