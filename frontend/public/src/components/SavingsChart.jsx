import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { formatINR } from '../utils/format';

/**
 * Monthly Net Savings (Surplus / Deficit) bar chart with positive/negative coloring.
 */
export default function SavingsChart({ monthlyData }) {
  if (!monthlyData || monthlyData.length === 0) {
    return <div className="chart-placeholder">No net savings data available.</div>;
  }

  const formatYAxis = (val) => {
    if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (Math.abs(val) >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <span className="section-label">MONTHLY SURPLUS / DEFICIT</span>
          <h3 className="chart-title">Net Savings Trajectory (Income - Expenses)</h3>
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(m) => m.slice(2)}
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
              formatter={(value) => [formatINR(value), 'Net Savings']}
            />
            <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.3)" />
            <Bar dataKey="net_savings" radius={[4, 4, 0, 0]}>
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.net_savings >= 0 ? '#22C55E' : '#EF4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
