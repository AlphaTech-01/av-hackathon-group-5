import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { formatINR, formatPctValue } from '../utils/format';

// Vibrant palette for categorized outflows
const CATEGORY_COLORS = [
  '#38BDF8', '#818CF8', '#C084FC', '#F472B6', '#FB7185',
  '#FBBF24', '#34D399', '#2DD4BF', '#A78BFA', '#F87171',
];

export default function CategoryChart({ categories }) {
  if (!categories || categories.length === 0) {
    return <div className="chart-placeholder">No category data available.</div>;
  }

  // Focus on top 8 categories for visual clarity
  const displayCategories = categories.slice(0, 8);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <span className="section-label">LAST 3 MONTHS EXPENDITURE</span>
          <h3 className="chart-title">Where Does the Money Go?</h3>
        </div>
      </div>

      <div className="category-layout">
        {/* Horizontal ranked bar visualization */}
        <div className="category-chart-wrapper" style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={displayCategories}
              margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis
                type="number"
                stroke="#94A3B8"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="category"
                stroke="#94A3B8"
                tick={{ fill: '#CBD5E1', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1220',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                }}
                formatter={(val, name, item) => [
                  `${formatINR(val)} (${formatPctValue(item.payload.percentage)})`,
                  'Total Outflow',
                ]}
              />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                {displayCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown pill list */}
        <div className="category-legend-list">
          {displayCategories.map((cat, idx) => (
            <div key={cat.category} className="category-legend-item">
              <div className="cat-bullet" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
              <div className="cat-info">
                <span className="cat-name">{cat.category}</span>
                <span className="cat-pct">{formatPctValue(cat.percentage)}</span>
              </div>
              <div className="cat-amount">{formatINR(cat.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
