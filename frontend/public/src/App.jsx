import React, { useState, useEffect } from 'react';
import { fetchAnalysis, fetchAiSummary } from './api';
import { formatINR, formatPercent } from './utils/format';

import ScoreGauge from './components/ScoreGauge';
import ScoreBreakdown from './components/ScoreBreakdown';
import KpiCard from './components/KpiCard';
import CashFlowChart from './components/CashFlowChart';
import CategoryChart from './components/CategoryChart';
import SavingsChart from './components/SavingsChart';
import DebtPanel from './components/DebtPanel';
import TrendList from './components/TrendList';
import AnomalyList from './components/AnomalyList';
import Recommendations from './components/Recommendations';
import AiInsight from './components/AiInsight';
import DataQualityCard from './components/DataQualityCard';

import './App.css';

export default function App() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    // 1. Fetch main precomputed analytics payload first
    fetchAnalysis()
      .then((data) => {
        setAnalysis(data);
        setLoading(false);

        // 2. Fetch AI executive verdict asynchronously without blocking UI
        setLoadingAi(true);
        fetchAiSummary()
          .then((aiRes) => {
            setAiData(aiRes);
          })
          .catch((aiErr) => {
            setAiError(aiErr.message);
          })
          .finally(() => {
            setLoadingAi(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="spinner" />
        <h2>Analyzing Household Financial Health...</h2>
        <p className="state-hint">Loading 24 months of transactions and balance sheet data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-screen">
        <div className="error-icon">⚠️</div>
        <h2>Connection Error</h2>
        <p className="state-error-message">{error}</p>
        <div className="troubleshoot-box">
          <p><strong>To start the backend server:</strong></p>
          <code>cd backend && python app.py</code>
        </div>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  const { summary, score, monthly, categories, debt, trends, anomalies, recommendations, data_quality } = analysis;

  return (
    <div className="dashboard-wrapper">
      {/* 1. Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <span className="brand-tag">ASSET VANTAGE HACKATHON</span>
          <h1 className="header-title">Financial Health Check</h1>
        </div>
        <div className="header-question-box">
          <span className="question-label">CORE QUESTION</span>
          <p className="question-text">"Are we financially healthy?"</p>
        </div>
      </header>

      {/* 2. Hero Section: Gauge + Component Breakdown */}
      <section className="hero-section">
        <div className="hero-grid">
          <ScoreGauge score={score.total_score} band={score.band} />
          <ScoreBreakdown components={score.components} />
        </div>
      </section>

      {/* 3. Six Numbered User Questions */}
      <main className="sections-container">
        {/* Question 1: How much do we earn? */}
        <section className="content-section">
          <div className="section-title-wrap">
            <span className="section-number-pill">01</span>
            <div>
              <span className="section-label">INCOME & LIQUIDITY</span>
              <h2 className="section-heading">How much do we earn?</h2>
            </div>
          </div>

          <div className="kpi-row">
            <KpiCard
              title="Typical Monthly Income"
              value={formatINR(summary.typical_income)}
              subtitle="6-Month baseline average"
              tag="Benchmark"
              status="positive"
            />
            <KpiCard
              title="Latest Month Income"
              value={formatINR(summary.last_month_income)}
              subtitle="Includes consulting & bonus"
              tag="Recent"
              status="positive"
            />
            <KpiCard
              title="Net Worth"
              value={formatINR(summary.net_worth)}
              subtitle={`Assets ${formatINR(summary.total_assets)} − Debt ${formatINR(summary.total_liabilities)}`}
              tag="Solvency"
              status="neutral"
            />
          </div>

          <CashFlowChart monthlyData={monthly} />
        </section>

        {/* Question 2: Where does the money go? */}
        <section className="content-section">
          <div className="section-title-wrap">
            <span className="section-number-pill">02</span>
            <div>
              <span className="section-label">EXPENSE ATTRIBUTION</span>
              <h2 className="section-heading">Where does the money go?</h2>
            </div>
          </div>

          <CategoryChart categories={categories} />
        </section>

        {/* Question 3: Are we saving enough? */}
        <section className="content-section">
          <div className="section-title-wrap">
            <span className="section-number-pill">03</span>
            <div>
              <span className="section-label">SAVINGS & RUNWAY</span>
              <h2 className="section-heading">Are we saving enough?</h2>
            </div>
          </div>

          <div className="kpi-row">
            <KpiCard
              title="Current Savings Rate"
              value={formatPercent(summary.typical_savings_rate)}
              subtitle="Target benchmark is 20%+"
              tag={summary.typical_savings_rate >= 0.20 ? 'Target Met' : 'Below Target'}
              status={summary.typical_savings_rate >= 0.20 ? 'positive' : 'warning'}
            />
            <KpiCard
              title="Emergency Fund Runway"
              value={`${summary.emergency_fund_months} Months`}
              subtitle={`Liquid assets: ${formatINR(summary.liquid_assets)}`}
              tag={summary.emergency_fund_months >= 6.0 ? 'Optimal' : 'Building'}
              status={summary.emergency_fund_months >= 6.0 ? 'positive' : 'warning'}
            />
            <KpiCard
              title="Typical Monthly Expenses"
              value={formatINR(summary.typical_expenses)}
              subtitle="Monthly living & obligations baseline"
              tag="Outflow"
              status="neutral"
            />
          </div>

          <SavingsChart monthlyData={monthly} />
        </section>

        {/* Question 4: Can we handle our debt? */}
        <section className="content-section">
          <div className="section-title-wrap">
            <span className="section-number-pill">04</span>
            <div>
              <span className="section-label">DEBT CAPACITY</span>
              <h2 className="section-heading">Can we handle our debt?</h2>
            </div>
          </div>

          <DebtPanel debtData={debt} />
        </section>

        {/* Question 5: What changed recently? */}
        <section className="content-section">
          <div className="section-title-wrap">
            <span className="section-number-pill">05</span>
            <div>
              <span className="section-label">VARIANCE & DETECTIONS</span>
              <h2 className="section-heading">What changed recently?</h2>
            </div>
          </div>

          <div className="dual-grid">
            <TrendList trendsData={trends} />
            <AnomalyList anomalies={anomalies} />
          </div>
        </section>

        {/* Question 6: What should we do next? */}
        <section className="content-section">
          <div className="section-title-wrap">
            <span className="section-number-pill">06</span>
            <div>
              <span className="section-label">ACTION PLAN</span>
              <h2 className="section-heading">What should we do next?</h2>
            </div>
          </div>

          <Recommendations recommendations={recommendations} />
          <AiInsight aiData={aiData} loading={loadingAi} error={aiError} />
        </section>
      </main>

      {/* 4. Footer: Data Quality Audit */}
      <footer className="dashboard-footer">
        <DataQualityCard qualityData={data_quality} />
        <div className="footer-credits">
          <p>© 2026 Asset Vantage Hackathon — Financial Health Check Pipeline</p>
        </div>
      </footer>
    </div>
  );
}
