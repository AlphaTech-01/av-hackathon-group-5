# Financial Health Engine (Asset Vantage Hackathon - Group 5)

> **"From raw transactions to one financial answer"**

Welcome to the Asset Vantage Hackathon Group 5 repository. This project ingests raw financial transaction data, asset snapshots, and debt obligations to calculate a deterministic 0–100 Financial Health Score and deliver exactly 3 prioritized, actionable recommendations.

---

## 📋 Master Plan & Implementation Blueprint

The comprehensive, empirical, data-verified implementation plan is documented in [`PLAN.md`](PLAN.md).

### Key Plan Highlights
1. **Verified Data Profile**: Thorough breakdown of 817 transactions, 8 assets, and 3 liabilities. Identifies duplicate records, typo categories (`Foods`), date format variations (`YYYY/MM/DD`), zero/negative amounts, and extreme outliers (₹185k Utility spike).
2. **Deterministic Financial Engine**: Python computes all cash flows, ratios (Savings Rate, Debt-to-Asset, EMI Burden, Liquidity Months), and IQR anomaly detection. The LLM is strictly prohibited from doing math.
3. **Scoring Model (0–100)**: Configurable weighted scoring model evaluating Savings, Liquidity, Debt, Solvency, and Cash Flow stability.
4. **AI + Deterministic Fallback**: Uses Gemini Flash (or configurable free-tier model) with Pydantic output validation to generate 3 actionable recommendations, with a 100% deterministic rule-based fallback if offline or rate-limited.
5. **Full Stack Architecture**: React + Vite + TypeScript + Tailwind CSS + Recharts frontend; FastAPI + pandas + SQLite backend.

---

## 🛠 Next Steps
Awaiting developer plan approval before proceeding to Phase 1 (Ingestion & Database Setup).
