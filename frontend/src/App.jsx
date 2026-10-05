import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HealthScoreGauge } from './components/HealthScoreGauge';
import { ScoreBreakdownDrawer } from './components/ScoreBreakdownDrawer';
import { MetricCardsGrid } from './components/MetricCardsGrid';
import { CashFlowChart } from './components/CashFlowChart';
import { CategoryDonutChart } from './components/CategoryDonutChart';
import { AnomaliesBanner } from './components/AnomaliesBanner';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { AuditLogModal } from './components/AuditLogModal';
import { TransactionsTable } from './components/TransactionsTable';

import { fetchDashboardData } from './api/financialApi';
import { FinancialController } from './controllers/financialController';

export default function App() {
  const [controller, setController] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData().then(({ data, isLive }) => {
      setController(new FinancialController(data));
      setIsLiveBackend(isLive);
    });
  }, []);

  if (!controller) {
    return (
      <div className="min-h-screen bg-[#060911] flex flex-col items-center justify-center text-white space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 animate-spin flex items-center justify-center">
          <div className="h-4 w-4 bg-white rounded-full"></div>
        </div>
        <p className="text-sm font-semibold tracking-wider text-slate-400">Loading Financial Engine Data...</p>
      </div>
    );
  }

  const summary = controller.getSummary();
  const scoreData = controller.getHealthScore();
  const simulatedScore = controller.getSimulatedScore();
  const cashFlowSeries = controller.getCashFlowSeries();
  const categoryBreakdown = controller.getCategoryBreakdown();
  const auditInfo = controller.getDataQualityInfo();
  const anomalies = controller.getAnomalies();
  const { assets, liabilities } = controller.getAssetsAndLiabilities();

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 font-sans pb-16">
      
      {/* Navbar */}
      <Header
        onOpenAuditModal={() => setIsAuditModalOpen(true)}
        isLiveBackend={isLiveBackend}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* Anomaly Detection Banner */}
        <AnomaliesBanner anomalies={anomalies} />

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <>
            {/* Top Grid: Health Score Gauge + 3 Action Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 h-full">
                <HealthScoreGauge
                  scoreData={scoreData}
                  simulatedScore={simulatedScore}
                  onOpenDrawer={() => setIsDrawerOpen(true)}
                />
              </div>
              <div className="lg:col-span-7 h-full">
                <RecommendationsPanel />
              </div>
            </div>

            {/* 8 KPI Cards Grid */}
            <MetricCardsGrid summary={summary} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <CashFlowChart cashFlowData={cashFlowSeries} />
              </div>
              <div className="lg:col-span-4">
                <CategoryDonutChart categoryData={categoryBreakdown} />
              </div>
            </div>

            {/* Cleaned Transactions Table View */}
            <TransactionsTable categoryBreakdown={categoryBreakdown} />
          </>
        )}

        {/* Tab 2: Cash Flow Analytics */}
        {activeTab === 'cashflow' && (
          <div className="space-y-6">
            <CashFlowChart cashFlowData={cashFlowSeries} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryDonutChart categoryData={categoryBreakdown} />
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-white">Cash Flow Insights</h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">Average Monthly Net Savings</span>
                    <p>₹61,255/month saved across 24 active months. Highest savings rate achieved in Sep 2026 (40.88%).</p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="font-bold text-indigo-400 block mb-1">Moving Average Stability</span>
                    <p>3-Month Moving Average (3MA) shows positive cash flow trend throughout the entire period.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Balance Sheet (Assets & Liabilities) */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assets Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">Assets Breakdown</h3>
                  <span className="text-xs font-mono font-bold text-emerald-400">Total: ₹70,25,000</span>
                </div>
                <div className="space-y-2 text-xs">
                  {assets.map((asset) => (
                    <div key={asset.asset_id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div>
                        <span className="font-bold text-white block">{asset.type}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{asset.asset_id} • {asset.category}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-sm">₹{asset.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liabilities Card */}
              <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">Liabilities & Obligations</h3>
                  <span className="text-xs font-mono font-bold text-rose-400">Total: ₹33,38,000</span>
                </div>
                <div className="space-y-3 text-xs">
                  {liabilities.map((liab) => (
                    <div key={liab.liability_id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{liab.type}</span>
                        <span className="font-mono font-bold text-rose-400">₹{liab.outstanding.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                        <span>Interest: {liab.interest_rate}% APR</span>
                        <span>EMI: ₹{liab.emi.toLocaleString('en-IN')}/mo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Slide-out Score Breakdown Drawer */}
      <ScoreBreakdownDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        scoreData={scoreData}
      />

      {/* Data Quality Audit Log Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditData={auditInfo}
      />

    </div>
  );
}
