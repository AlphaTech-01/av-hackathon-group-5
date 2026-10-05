import React from 'react';

/**
 * AI Narrative Executive Verdict with loading skeleton and source badge.
 */
export default function AiInsight({ aiData, loading, error }) {
  const isAi = aiData && aiData.source === 'ai';
  const badgeLabel = isAi ? '✨ AI Executive Verdict' : '📊 Rule-Based Synthesis';
  const badgeClass = isAi ? 'ai-badge ai-badge-active' : 'ai-badge ai-badge-fallback';

  return (
    <div className="ai-insight-card">
      <div className="ai-insight-header">
        <div className="ai-title-group">
          <span className="section-label">EXECUTIVE NARRATIVE</span>
          <h3 className="ai-insight-title">Executive Summary & Next Best Move</h3>
        </div>
        {!loading && (
          <span className={badgeClass}>{badgeLabel}</span>
        )}
      </div>

      <div className="ai-insight-body">
        {loading ? (
          <div className="skeleton-container">
            <div className="skeleton-line skeleton-line-long" />
            <div className="skeleton-line skeleton-line-med" />
            <div className="skeleton-line skeleton-line-short" />
          </div>
        ) : error ? (
          <p className="ai-error-text">Unable to load narrative: {error}</p>
        ) : (
          <p className="ai-summary-text">{aiData?.summary}</p>
        )}
      </div>
    </div>
  );
}
