import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { formatINR } from '../utils/format';

/**
 * 24-Month Income vs Expenses cash flow trajectory chart.
 */
export default function CashFlowChart({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) {
    return <div className="chart-placeholder">No cash flow data available.</div>;
  }

  // Format Y-axis in thousands (k) or Lakhs (L) for clean display
  const formatYAxis = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <span className="section-label">24-MONTH CASH FLOW</span>
          <h3 className="chart-title">Income vs Expenses Trajectory</h3>
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(m) => m.slice(2)} // Short 'YY-MM'
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B1220',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: '#FFFFFF',
              }}
              formatter={(value) => [formatINR(value)]}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(val) => <span style={{ color: '#E2E8F0', fontSize: '13px' }}>{val}</span>}
            />
            <Bar dataKey="income" name="Monthly Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Monthly Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
