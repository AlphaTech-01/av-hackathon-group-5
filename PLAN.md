# Master Implementation Plan: Financial Health Engine

> **System Goal**: Transform raw, messy financial datasets (transactions, assets, liabilities) into a deterministic 0–100 Financial Health Score, explicit metric breakdowns, anomaly detections, and exactly 3 actionable recommendations (via free-tier LLM with deterministic fallback).

---

## 1. Verified Data Profile

Data profile established via direct pandas and Python script execution on `c:/Users/Lenovo/Desktop/AV Hackathon/Dataset/Dataset/`.

### File Overview & Command Proof

```powershell
Command Used: python scratch/inspect_dataset.py
```

| File | Rows | Columns | Null Counts | Duplicate Rows | Duplicate Primary Key | Key Date Formats |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `transactions.csv` | 817 | `txn_id`, `date`, `category`, `description`, `amount`, `type` | `category`: 1<br>`description`: 1 | 1 exact row | 3 duplicate `txn_id`s | 816 rows `YYYY-MM-DD`<br>1 row `YYYY/MM/DD` |
| `assets.csv` | 8 | `asset_id`, `type`, `value`, `as_of_date` | None (0) | 0 | 0 | All `2026-10-01` |
| `liabilities.csv` | 3 | `liability_id`, `type`, `outstanding`, `interest_rate`, `emi`, `due_date` | None (0) | 0 | 0 | `2026-10-10`, `2026-10-07`, `2026-10-05` |

---

### Detailed Findings per Dataset

#### A. `transactions.csv`
- **Total Rows**: 817 rows (indices 0 to 816).
- **Columns & Dtypes**: `txn_id` (str), `date` (str), `category` (str), `description` (str), `amount` (float64), `type` (str).
- **Date Range**: `2024-10-02` to `2026-11-15` (24 active months: Oct 2024 – Sep 2026, plus 1 out-of-sequence transaction).
- **Amount Sign Convention**: Amounts are positive floats regardless of `type` (`income` or `expense`), with 1 negative amount anomaly (`-4500.0`).
- **Types Present**: `expense` (769 rows, mean: ₹6,663.57), `income` (48 rows, mean: ₹129,500.00).

##### Identified Data Quality Anomalies (Command Proof: `scratch/inspect_anomalies.py` & `scratch/check_dates.py`)

1. **Exact Duplicate Row**:
   - Index 410 is an exact duplicate of Index 409: `T0410 | 2025-12-18 | Food | Food delivery | 5007.03 | expense`.
2. **Duplicate `txn_id`s (Non-identical contents)**:
   - `T0031`: Index 30 (`2024-11-07 | Debt Payment | Home loan EMI | 28500.00`) vs Index 31 (`2024-11-08 | Debt Payment | Car loan EMI | 11200.00`).
   - `T0760`: Index 759 (`2026-01-16 | Other | 1582.19`) vs Index 760 (`2026-02-21 | Entertainment | 1477.14`).
3. **Category Anomalies & Typos**:
   - `Foods` (1 row, Index 201): `T0202 | 2025-05-08 | Foods | Car loan EMI | 11200.00 | expense` -> Typo for `Food` or misclassified `Debt Payment`.
   - `Salary` as `expense` (1 row, Index 555): `T0556 | 2026-05-02 | Salary | Monthly salary correction | 205000.00 | expense`.
   - `NaN` Category (1 row, Index 701): `T0702 | 2025-03-23 | NaN | Streaming | 931.64 | expense`.
   - `NaN` Description (1 row, Index 137): `T0138 | 2025-02-08 | Other | NaN | 3099.51 | expense`.
4. **Amount Anomalies**:
   - Negative amount: Index 88 (`T0089 | 2025-01-08 | Debt Payment | Car loan EMI | -4500.00 | expense`).
   - Zero amount: Index 342 (`T0343 | 2025-10-08 | Debt Payment | Car loan EMI | 0.0 | expense`).
   - Extreme Outlier: Index 487 (`T0488 | 2026-03-14 | Utilities | Mobile | 185000.00 | expense`) vs category median ₹1,200.00.
5. **Date Anomalies**:
   - Non-ISO Slash Date: Index 642 (`T0643 | 2026/06/15 | Entertainment | Movies | 2629.63`).
   - Out-of-Sequence / Future Date: Index 276 (`T0277 | 2026-11-15 | Healthcare | Pharmacy | 1376.22`) situated among July 2025 transactions (`T0276` is `2025-07-22` and `T0278` is `2025-07-19`).

##### Category Statistics (Raw Data)

| Category | Type | Count | Min (₹) | Median (₹) | Mean (₹) | Max (₹) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Salary** | income | 24 | 205,000.00 | 225,250.00 | 237,250.00 | 329,500.00 |
| **Salary** | expense | 1 | 205,000.00 | 205,000.00 | 205,000.00 | 205,000.00 |
| **Other Income** | income | 24 | 18,000.00 | 21,750.00 | 21,750.00 | 25,500.00 |
| **Housing** | expense | 24 | 32,000.00 | 32,000.00 | 32,000.00 | 32,000.00 |
| **Debt Payment** | expense | 70 | -4,500.00 | 11,200.00 | 15,610.08 | 28,500.00 |
| **Insurance** | expense | 24 | 5,500.00 | 5,500.00 | 5,500.00 | 5,500.00 |
| **Investments** | expense | 48 | 10,000.00 | 17,500.00 | 15,833.33 | 20,000.00 |
| **Food** | expense | 150 | 328.23 | 4,179.45 | 3,992.23 | 10,786.69 |
| **Foods** | expense | 1 | 11,200.00 | 11,200.00 | 11,200.00 | 11,200.00 |
| **Utilities** | expense | 72 | 900.00 | 1,200.00 | 4,483.33 | 185,000.00 |
| **Transport** | expense | 100 | 329.98 | 1,910.12 | 1,945.73 | 4,430.52 |
| **Shopping** | expense | 47 | 2,056.32 | 6,315.35 | 6,748.59 | 15,640.82 |
| **Entertainment** | expense | 91 | 315.39 | 1,896.40 | 1,824.35 | 3,661.44 |
| **Healthcare** | expense | 24 | 1,198.71 | 4,698.29 | 4,378.10 | 7,824.46 |
| **Personal Care** | expense | 24 | 914.64 | 1,937.21 | 1,883.67 | 3,230.42 |
| **Education** | expense | 24 | 2,187.78 | 4,393.25 | 4,294.46 | 6,581.51 |
| **Travel** | expense | 6 | 21,554.25 | 31,768.73 | 30,602.36 | 38,666.47 |
| **Other** | expense | 62 | 317.86 | 1,571.50 | 1,904.51 | 6,061.07 |
| **NaN** | expense | 1 | 931.64 | 931.64 | 931.64 | 931.64 |

---

#### B. `assets.csv`
- **Total Rows**: 8. Columns: `asset_id`, `type`, `value`, `as_of_date`.
- **Total Asset Value**: ₹7,025,000.
- **Liquid Assets**: Savings (₹325k) + Current (₹85k) + Fixed Deposit (₹450k) = ₹860,000.
- **Investment Assets**: Mutual Funds (₹625k) + Equity (₹410k) + Gold (₹280k) = ₹1,315,000.
- **Fixed/Real Assets**: Vehicle (₹650k) + Property (₹4,200,000) = ₹4,850,000.

#### C. `liabilities.csv`
- **Total Rows**: 3. Columns: `liability_id`, `type`, `outstanding`, `interest_rate`, `emi`, `due_date`.
- **Total Liabilities Outstanding**: ₹3,338,000.
  1. Home Loan (L001): ₹2,850,000 @ 8.35%, EMI ₹28,500.
  2. Car Loan (L002): ₹420,000 @ 9.10%, EMI ₹11,200.
  3. Credit Card (L003): ₹68,000 @ 32.00%, EMI ₹7,000.
- **Total Monthly Scheduled EMI Burden**: ₹46,700/month.

---

## 2. Requirements Extracted from `Hackathon.pptx`

### Slide 1: Challenge & Analytics Journey
- **Core Challenge**: "From raw transactions to one financial answer — Are we financially healthy?"
- **6 User Questions to Answer**:
  1. *How much do we earn?* -> Monthly Total Income calculation.
  2. *Where does the money go?* -> Category breakdown & living expenses tracking.
  3. *Are we saving enough?* -> Savings Rate calculation (including wealth building/investments).
  4. *Can we handle our debt?* -> Debt-to-Asset ratio, Debt-to-Income, EMI burden tracking.
  5. *What changed recently?* -> MoM trend analysis, 3-month moving average, anomaly detection.
  6. *What should we do next?* -> 0–100 score + exactly 3 prioritized recommendations.
- **5-Step Analytics Pipeline**:
  - `01 Ingest` (817 transactions + data cleaning audit log)
  - `02 Calculate` (Deterministic cash flow + ratios)
  - `03 Detect` (Trends + IQR anomalies)
  - `04 Score` (0–100 health score with component breakdown)
  - `05 Recommend` (3 actions via structured LLM + fallback)

### Slide 2: Dataset Characteristics
- **Scope**: Synthetic INR dataset covering 24 months, 8 assets, 3 liabilities.
- **Explicit Intentional Issues**: Duplicates, missing fields, outliers.

---

## 3. System Architecture & Data Layer Separation

```
         ┌─────────────────────────────────────────────────────────┐
         │                    React + Vite UI                      │
         │  (Tailwind CSS + Recharts + "Why this Score?" Drawer)   │
         └────────────────────────────▲────────────────────────────┘
                                      │ REST API (JSON)
         ┌────────────────────────────▼────────────────────────────┐
         │                    FastAPI Backend                      │
         │   ┌─────────────────────────────────────────────────┐   │
         │   │ 1. Data Cleaning Engine & Audit Logger          │   │
         │   │ 2. Deterministic Metric Calculator (pandas)     │   │
         │   │ 3. Scoring Engine (Configurable Thresholds)     │   │
         │   │ 4. Anomaly Engine (IQR + Category History)      │   │
         │   │ 5. AI Recommendation Service + Rule Fallback   │   │
         │   └─────────────────────────────────────────────────┘   │
         └────────────────────────────▲────────────────────────────┘
                                      │
         ┌────────────────────────────▼────────────────────────────┐
         │                    SQLite Database                      │
         │  - raw_transactions / raw_assets / raw_liabilities      │
         │  - normalized_transactions                              │
         │  - cleaning_audit_log                                   │
         │  - computed_monthly_metrics                             │
         │  - health_scores & recommendations_cache                │
         └─────────────────────────────────────────────────────────┘
```

### Data Pipeline & Audit Logging
1. **Raw Layer**: Ingest csv files directly into `raw_transactions`, `raw_assets`, `raw_liabilities` without modifying values.
2. **Cleaning & Normalization Layer**:
   - Parse dates consistently using `pd.to_datetime(s, format='mixed')`.
   - Re-index / standardize duplicate `txn_id`s by auto-generating clean surrogate keys `clean_txn_id`.
   - Correct typos (`Foods` -> `Food`).
   - Fix negative debt payment amounts (`abs(amount)` or standard sign handling).
   - Flag/impute `NaN` category as `Uncategorized`.
   - Log every single modification to `cleaning_audit_log`:

```sql
CREATE TABLE cleaning_audit_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_row_index INTEGER,
    txn_id TEXT,
    issue TEXT,
    action TEXT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Deterministic Financial Metric Definitions & Formulas

All calculations are performed strictly in Python (`pandas`). The LLM NEVER calculates these numbers.

### Core Metrics

1. **Total Income ($I_m$)**:
   $$\text{Income}_m = \sum \text{amount} \quad \text{where type = 'income' in month } m$$
2. **Living Expenses ($E_m$)**:
   $$\text{Living Expenses}_m = \sum \text{amount} \quad \text{where type = 'expense' AND category NOT IN ('Investments', 'Debt Payment')}$$
3. **Debt Service ($D_m$)**:
   $$\text{Debt Service}_m = \sum \text{amount} \quad \text{where type = 'expense' AND category = 'Debt Payment'}$$
4. **Investments ($Inv_m$)**:
   $$\text{Investments}_m = \sum \text{amount} \quad \text{where category = 'Investments'}$$
   *Note: Investments are tracked separately as wealth accumulation and NOT treated as consumption/living expense.*
5. **Total Outflows ($O_m$)**:
   $$O_m = E_m + D_m + Inv_m$$
6. **Net Cash Flow ($NCF_m$)**:
   $$NCF_m = I_m - O_m$$
7. **Savings Rate ($SR_m$)**:
   $$SR_m = \frac{I_m - (E_m + D_m)}{I_m} = \frac{NCF_m + Inv_m}{I_m}$$
   *Explicitly includes direct investments as savings.*
8. **Debt-to-Asset Ratio ($DAR$)**:
   $$DAR = \frac{\sum \text{Outstanding Liabilities}}{\sum \text{Total Asset Value}} = \frac{3,338,000}{7,025,000} \approx 47.51\%$$
9. **EMI Burden (Debt-to-Income Ratio, $DTI_m$)**:
   $$DTI_m = \frac{\text{Total Scheduled Monthly EMIs}}{\text{Total Monthly Income}_m} = \frac{46,700}{I_m}$$
10. **Liquidity Months ($LM$)**:
    $$LM = \frac{\text{Liquid Assets (Savings + Current + Fixed Deposit)}}{\text{Average Monthly Living Expenses } (\bar{E})}$$
11. **Net Worth ($NW$)**:
    $$NW = \sum \text{Assets} - \sum \text{Liabilities} = 7,025,000 - 3,338,000 = 3,687,000 \text{ INR}$$
12. **MoM Trend & 3-Month Moving Average**:
    $$\text{3MA}_{NCF, m} = \frac{NCF_m + NCF_{m-1} + NCF_{m-2}}{3}$$

---

## 5. Anomaly Detection Method

- **Method**: IQR (Interquartile Range) per category combined with historical category deviation.
- **Formula**:
  - $Q_1 = 25\text{th percentile}$, $Q_3 = 75\text{th percentile}$, $IQR = Q_3 - Q_1$.
  - Upper threshold: $T_{upper} = Q_3 + 1.5 \times IQR$.
  - Deviation Factor: $X = \frac{\text{Amount}}{\text{Category Median}}$.
- **Human-Readable Output Format**:
  - *"₹185,000.00 spent on Mobile Utilities on 2026-03-14 (154.1x the usual median amount of ₹1,200.00 for Utilities)"*.
- **Exclusion Rule**: Known fixed recurring transfers (e.g. standard monthly Salary income or standard scheduled EMI amounts) are excluded from anomaly flagging.

---

## 6. Scoring Model (0–100 Financial Health Score)

Configurable via `backend/config/scoring_rules.py`. Total Score = Sum of weighted component scores.

| Component | Weight | Target Metric | Thresholds & Scoring Logic | Justification |
| :--- | :--- | :--- | :--- | :--- |
| **Savings & Investment** | 25% | Savings Rate ($SR$) | • $\ge 30\% \rightarrow 100$<br>• $20-30\% \rightarrow 80$<br>• $10-20\% \rightarrow 50$<br>• $<10\% \rightarrow 20$ | Benchmark: 20%+ is standard healthy household savings. |
| **Liquidity Buffer** | 25% | Liquidity Months ($LM$) | • $\ge 6 \text{ mos} \rightarrow 100$<br>• $3-6 \text{ mos} \rightarrow 75$<br>• $1-3 \text{ mos} \rightarrow 40$<br>• $<1 \text{ mo} \rightarrow 10$ | 6 months living expenses is standard emergency fund requirement. |
| **Debt Burden** | 25% | EMI Burden ($DTI$) | • $\le 30\% \rightarrow 100$<br>• $30-40\% \rightarrow 70$<br>• $40-50\% \rightarrow 40$<br>• $>50\% \rightarrow 10$ | Debt service >40% indicates high financial distress risk. |
| **Solvency / Net Worth**| 15% | Debt-to-Asset ($DAR$) | • $\le 30\% \rightarrow 100$<br>• $30-50\% \rightarrow 70$<br>• $50-70\% \rightarrow 40$<br>• $>70\% \rightarrow 10$ | Healthy balance sheet keeps leverage below 50%. |
| **Cash Flow Stability** | 10% | MoM NCF Trend | • Positive 3MA & Net Cash Flow $>0 \rightarrow 100$<br>• Negative 3MA or Net Cash Flow $<0 \rightarrow 30$ | Consistent positive net cash flow indicates stability. |

*Breakdown JSON is returned by API so UI renders an interactive "Why this score?" panel.*

---

## 7. Data Quality Score Formula

A single, explicit, reproducible metric calculated before data visualization:

$$\text{Data Quality Score} = 100 - \left( 25 \times \frac{N_{\text{missing}}}{N_{\text{total\_cells}}} + 25 \times \frac{N_{\text{dup\_rows}}}{N_{\text{rows}}} + 25 \times \frac{N_{\text{dup\_keys}}}{N_{\text{rows}}} + 25 \times \frac{N_{\text{invalid\_dates\_or\_types}}}{N_{\text{rows}}} \right)$$

---

## 8. AI Recommendation Engine & Deterministic Fallback

### Compact Precomputed Metrics JSON Context Sent to LLM
```json
{
  "health_score": 72.5,
  "metrics": {
    "net_worth": 3687000,
    "monthly_income": 235000,
    "savings_rate_pct": 18.5,
    "liquidity_months": 4.2,
    "emi_burden_pct": 38.2,
    "credit_card_outstanding": 68000,
    "credit_card_interest_rate": 32.0,
    "utilities_outlier_amount": 185000
  },
  "score_breakdown": {
    "savings": 50,
    "liquidity": 75,
    "debt": 70,
    "solvency": 70,
    "cash_flow": 100
  }
}
```

### LLM Prompt & Validation
- **System Prompt Constraint**: *"You are a certified financial advisor. Use ONLY the provided numbers. Do NOT compute any new math or invent figures. Produce EXACTLY 3 actionable steps."*
- **Pydantic Response Schema**:
```python
class ActionItem(BaseModel):
    priority: int  # 1, 2, or 3
    action: str
    reason: str
    expected_impact: str
    urgency: Literal["HIGH", "MEDIUM", "LOW"]

class FinancialAdvice(BaseModel):
    actions: List[ActionItem] # Exactly 3
```

### Deterministic Rule-Based Fallback Engine
If LLM call fails, times out, or exceeds rate limit, the backend triggers rule-based fallback logic:
1. **Action 1 (High Interest Debt)**: If Credit Card debt exists @ 32% interest -> Pay off ₹68,000 Credit Card balance using liquid cash.
2. **Action 2 (Anomaly Investigation)**: If Utility outlier ₹185,000 exists -> Audit and dispute one-off ₹185,000 utility charge.
3. **Action 3 (Savings Optimization)**: If Savings Rate < 20% -> Increase monthly investment by ₹15,000 to reach 25% savings target.

---

## 9. API Endpoints, DB Schema & Project Structure

### API Endpoints
- `GET /api/health-check`: System status & environment info.
- `GET /api/data-quality`: Data quality score, error breakdown, and audit log.
- `GET /api/financial-summary`: Computed monthly metrics, net worth, cash flows, and trends.
- `GET /api/anomalies`: List of detected category and amount anomalies.
- `GET /api/health-score`: Overall 0-100 score + "Why this score?" breakdown.
- `GET /api/recommendations`: Exactly 3 actions (LLM response or fallback).

### Database Schema (SQLite: `financial_engine.db`)
- `raw_transactions`, `raw_assets`, `raw_liabilities`
- `cleaning_audit_log`
- `normalized_transactions`
- `computed_metrics_monthly`
- `recommendations_cache` (keyed by `data_hash + model_name + prompt_version`)

### File Structure
```
av-hackathon-group-5/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── ingestion.py
│   │   ├── metrics.py
│   │   ├── scoring.py
│   │   ├── anomalies.py
│   │   └── ai_recommender.py
│   ├── requirements.txt
│   └── tests/
│       └── test_metrics_reconciliation.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ScoreCard.tsx
   │   │   ├── MetricGrid.tsx
   │   │   ├── CashFlowChart.tsx
   │   │   ├── RecommendationsList.tsx
   │   │   └── AuditLogModal.tsx
   │   ├── App.tsx
   │   └── index.css
   ├── package.json
   └── vite.config.ts
├── PLAN.md
└── README.md
```

---

## 10. Build Phases & Verification Gates

### Phase 1: Database Setup, Data Ingestion & Audit Logging
- **Deliverables**: SQLite schema creation, raw CSV loading, cleaning pipeline, audit log generation.
- **Verification Gate**: Run pytest to check `cleaning_audit_log` records exact number of expected cleaning actions (1 duplicate row, 3 duplicate txn_ids, 1 typo, 1 missing date format).

### Phase 2: Deterministic Calculation Engine & Anomaly Detection
- **Deliverables**: Pandas metric calculation pipeline and IQR anomaly detection engine.
- **Verification Gate**: **Reconciliation Test**: Unit test verifying `Total Income - Total Outflows == Net Cash Flow` across all 24 months, and verifying liquid assets calculation matches independent sum of liquid rows.

### Phase 3: Financial Health Scoring Engine
- **Deliverables**: Scoring module returning overall score + breakdown JSON.
- **Verification Gate**: Unit test checking extreme edge cases (e.g. 0 income, 100% debt) produce expected score bounds without throwing errors.

### Phase 4: AI Recommendation Engine + Fallback
- **Deliverables**: FastAPI endpoint calling Gemini Flash/Flash-Lite with Pydantic validation and fallback logic.
- **Verification Gate**: Test endpoint under both valid LLM key and mock network failure to verify fallback always returns valid 3-action structure.

### Phase 5: React + Vite + Tailwind Frontend Integration
- **Deliverables**: Interactive dashboard featuring Score Gauge, "Why this score?" drawer, Cash Flow charts (Recharts), Anomaly table, and 3 Actions view.
- **Verification Gate**: End-to-end verification check: UI displays exact figures matching API responses.

---

## 11. UNVERIFIED / OPEN QUESTIONS & RISKS

1. **Free-Tier LLM Rate Limits & Latency**:
   - Risk: Gemini free-tier rate limits or cold-start latency.
   - Mitigation: Strict response caching in SQLite and fast fallback logic.
2. **Date Anomaly `T0277` (2026-11-15)**:
   - UNVERIFIED: Whether `2026-11-15` was intended as a future-dated transaction or a typo for `2025-07-15`.
   - Mitigation: Treat as recorded date but log in data quality audit log.
3. **Data Privacy**:
   - All synthetic INR data remains local; only anonymized precomputed summary metrics are sent to LLM prompt.

---

## 12. Explicit Out-of-Scope List

- User authentication / multi-tenancy login.
- Microservice architecture or message queues.
- Real-time bank aggregator API integrations (Plaid/Yodlee).
- Machine learning model training or custom model weights.
- Native iOS/Android mobile applications.
