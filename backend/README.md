# Financial Health Engine - Backend (FastAPI + SQLite + pandas)

Deterministic financial analytics engine and REST API built for the Asset Vantage Hackathon.

## Features Built
1. **Raw Ingestion & Data Cleaning Audit Log**: Ingests `transactions.csv`, `assets.csv`, and `liabilities.csv`. Standardizes duplicates, cleans negative EMI signs, corrects category typos (`Foods` -> `Debt Payment`), resolves non-ISO slash dates, and imputes missing fields. Every modification is logged to `cleaning_audit_log`.
2. **Data Quality Score**: Calculates a deterministic 0–100 Data Quality Score (currently **99.81/100**) penalizing missing cells, duplicate rows, duplicate keys, and invalid formats.
3. **Deterministic Financial Calculation Engine**: Calculates monthly cash flow, 3-Month Moving Average (3MA) NCF, savings rates, debt-to-income, liquidity runway months, net worth (₹36.87L), and category breakdowns using pure pandas.
4. **0–100 Financial Health Scoring**: Weighted 5-pillar scoring model with transparent "Why this score?" breakdown:
   - Savings & Wealth Accumulation (25%)
   - Liquidity & Emergency Buffer (25%)
   - Debt Burden & High-Interest Risk (25%)
   - Solvency / Net Worth Leverage (15%)
   - Cash Flow Stability (10%)
5. **IQR Anomaly Detection**: Statistical anomaly detector flagging extreme outliers (e.g. ₹1.85L mobile bill typo) with human-readable explanations and deviation factors.
6. **AI Recommendation Engine + Deterministic Fallback**: Returns exactly 3 prioritized actions via Gemini Flash or instant rule-based fallback.

---

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Backend API Server
```bash
python run.py
```
* Server URL: `http://127.0.0.1:8000`
* Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

### 3. Run Automated Tests
```bash
python -m pytest tests/
```

---

## API Endpoints for Frontend (React / Vite)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health-check` | GET | System status and service info. |
| `/api/data-quality` | GET | Data quality score (0–100), penalties, and complete cleaning audit log. |
| `/api/financial-summary` | GET | Balance sheet (Net Worth, Assets, Liabilities), 24-month timeline, and category spending. |
| `/api/health-score` | GET | Overall 0–100 score, tier (Excellent), component breakdown, and "Why this score?" insights. |
| `/api/anomalies` | GET | List of detected anomalies with severity, category median, and human-readable explanation. |
| `/api/recommendations` | GET | Exactly 3 prioritized actions with urgency and expected financial impact. |
