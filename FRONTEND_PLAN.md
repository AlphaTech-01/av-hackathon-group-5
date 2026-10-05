# React Frontend Implementation Plan: Financial Health Engine

> **Design Goal**: A state-of-the-art, dark-themed financial dashboard with glassmorphism aesthetics, dynamic Recharts visualizations, interactive "Why this score?" breakdown drawer, and 3 actionable AI/fallback recommendation cards.

---

## 1. Aesthetic & UI Design System

- **Theme**: Dark Luxury / Modern Fintech (`#0F172A` Slate base, `#1E293B` Card backgrounds, `#334155` borders).
- **Color Accents**:
  - **Healthy / Income / Positive**: Emerald Green (`#10B981` / `#059669`)
  - **Warning / Outflows / Debt**: Amber / Rose (`#F59E0B` / `#EF4444`)
  - **Primary Accents & Highlights**: Electric Indigo / Violet (`#6366F1` / `#8B5CF6`)
- **Typography**: `Plus Jakarta Sans` or `Inter` (Google Fonts).
- **Surface Effects**: Glassmorphism cards with subtle border gradients (`backdrop-blur-lg bg-slate-900/70 border border-slate-800/80 shadow-2xl`).
- **Animations**: Framer Motion / CSS keyframes for score gauge count-up, drawer slide-in, and micro-hover glow effects.

---

## 2. Component Hierarchy & Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Navbar] Logo | Financial Health Engine | Data Quality Score (98.4%) [Audit Log] │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────┐ ┌───────────────────────────────────────┐ │
│ │ 0-100 Score Gauge Card    │ │ 3 Actionable Recommendations Panel    │ │
│ │  - Health Score: 72/100   │ │  - Priority 1: Pay Credit Card        │ │
│ │  - [Why this score? Btn]  │ │  - Priority 2: Audit Utility Spike    │ │
│ └─────────────┬─────────────┘ │  - Priority 3: Increase SIP           │ │
│               │ (Opens)       │  [ AI / Rule-Based Fallback Toggle ]  │ │
│               ▼               └───────────────────────────────────────┘ │
│ ┌───────────────────────────┐                                           │
│ │ Slide-out Drawer:         │                                           │
│ │ Component Breakdown Table │                                           │
│ └───────────────────────────┘                                           │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Key Financial Metrics Grid (8 Cards with Tooltips & Sparklines)     │ │
│ │  - Income | Expenses | Debt Service | Investments | Net Cash Flow   │ │
│ │  - Savings Rate (18.5%) | Liquidity (4.2 mos) | Net Worth (₹3.68M)  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────┐ ┌───────────────────────────────┐ │
│ │ Cash Flow Journey Chart (Recharts)│ │ Category Breakdown (Donut)   │ │
│ │  - 24-Mo Income vs Expense vs NCF │ │  - Living vs Investment vs Debt│ │
│ └───────────────────────────────────┘ └───────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Anomaly Detection Banner (IQR Spikes - e.g. ₹185,000 Mobile Bill)   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Cleaned Transactions Table (Search, Category Filter, Audit Badges)  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Specifications

### 1. `Header.tsx`
- Project Title & Status Indicator (Backend Connected / Mock Mode).
- **Data Quality Pill**: Clicking opens the `AuditLogModal`.

### 2. `HealthScoreGauge.tsx`
- Circular animated score ring (0-100 score).
- Color segments: Red (0-49), Amber (50-74), Emerald (75-100).
- Action button: **"Why this score?"** triggering `ScoreBreakdownDrawer`.

### 3. `ScoreBreakdownDrawer.tsx`
- Slide-out side panel showing the 5 score components:
  1. Savings Rate (25% weight)
  2. Liquidity Buffer (25% weight)
  3. Debt Burden (25% weight)
  4. Solvency / Debt-to-Asset (15% weight)
  5. Cash Flow Stability (10% weight)
- Shows actual user metric value vs target threshold and points earned.

### 4. `MetricCardsGrid.tsx`
- Grid of 8 glassmorphic KPI cards:
  - Total Monthly Income
  - Total Living Expenses
  - Debt Service (EMIs)
  - Investments (Wealth Building)
  - Net Cash Flow
  - Savings Rate (%)
  - Liquidity Months
  - Net Worth (Assets - Liabilities)

### 5. `CashFlowChart.tsx`
- Recharts `ComposedChart`:
  - Bars: Income (Green), Outflows (Rose).
  - Line: Net Cash Flow (Indigo line with gradient fill).
  - 3-Month Moving Average line overlay.

### 6. `SpendingDonutChart.tsx`
- Recharts `PieChart` with inner radius (Donut) showing category allocation.

### 7. `RecommendationsPanel.tsx`
- Exactly 3 structured action cards:
  - **Header**: Priority Badge (`#1`, `#2`, `#3`), Urgency Pill (`HIGH`, `MEDIUM`, `LOW`).
  - **Body**: Action title, Reason, and Expected Impact.
  - **Toggle**: Switch between AI LLM Generated vs Deterministic Rule-Based Fallback.

### 8. `AnomaliesBanner.tsx`
- Highlight card showing IQR outliers with human-readable explanations (e.g. *"₹185,000.00 spent on Mobile Utilities — 154.1x the usual median for Utilities"*).

### 9. `AuditLogModal.tsx`
- Modal dialog presenting Data Quality Score formula, total cleanings count, and searchable table of logged cleaning actions (Issue, Action Taken, Reason).

---

## 4. Technology Stack & Packages

- **Build Tool**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + `clsx` + `tailwind-merge`
- **Charts**: `recharts`
- **Icons**: `lucide-react`
- **HTTP Client**: `axios` with fallback to local mock JSON generator if API is offline.

---

## 5. Implementation Phases & Verification Gates

| Phase | Tasks | Verification Gate |
| :--- | :--- | :--- |
| **Phase F1** | Setup `frontend/` with Vite, React, TypeScript, Tailwind CSS, and Lucide icons. | `npm run build` passes with zero TypeScript errors. |
| **Phase F2** | Build Mock Data Provider & API Client Layer (`src/services/api.ts`). | Unit test verifying mock provider returns valid schema structure. |
| **Phase F3** | Implement Score Gauge, KPI Grid, and "Why this score?" Drawer. | Visual & interactive check: Drawer opens/closes and displays exact weighted scores. |
| **Phase F4** | Implement Recharts Cash Flow & Category Donut charts. | Chart renders 24-month data cleanly without layout shifts. |
| **Phase F5** | Implement 3-Action Recommendations & Anomaly Detection Panel. | Toggle between AI and Fallback updates recommendation cards seamlessly. |
| **Phase F6** | Implement Data Quality & Audit Log Modal + Final Polish. | Clicking Audit Quality Badge opens modal showing cleaning records. |

---

## 6. STOP & APPROVAL GATE

This plan is presented for your review. No frontend files or code will be written until you give explicit approval.
