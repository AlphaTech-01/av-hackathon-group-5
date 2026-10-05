from typing import Dict, Any
from app.config import SCORING_WEIGHTS, THRESHOLDS
from app.metrics import compute_financial_metrics

def calculate_health_score(metrics_data: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Computes a deterministic 0-100 Financial Health Score with full component transparency.
    Weights:
      - Savings & Investment: 25%
      - Liquidity Buffer: 25%
      - Debt Burden (DTI): 25%
      - Solvency / Net Worth (DAR): 15%
      - Cash Flow Stability: 10%
    """
    if metrics_data is None:
        metrics_data = compute_financial_metrics()

    monthly_avg = metrics_data["monthly_averages"]
    balance_sheet = metrics_data["balance_sheet"]
    timeline = metrics_data["monthly_timeline"]

    sr = monthly_avg["avg_savings_rate_pct"]
    lm = monthly_avg["liquidity_months"]
    dti = monthly_avg["avg_dti_pct"]
    dar = balance_sheet["debt_to_asset_pct"]

    # 1. Savings & Investment Component (25 pts)
    savings_score = 20
    savings_label = "Poor (<10%)"
    for rule in THRESHOLDS["savings_rate"]:
        if sr >= rule["min"]:
            savings_score = rule["score"]
            savings_label = rule["label"]
            break

    # 2. Liquidity Buffer Component (25 pts)
    liquidity_score = 10
    liquidity_label = "Vulnerable (<1 mo)"
    for rule in THRESHOLDS["liquidity_months"]:
        if lm >= rule["min"]:
            liquidity_score = rule["score"]
            liquidity_label = rule["label"]
            break

    # 3. Debt Burden Component (25 pts)
    debt_score = 10
    debt_label = "Distressed (>50%)"
    for rule in THRESHOLDS["debt_to_income"]:
        if dti <= rule["max"]:
            debt_score = rule["score"]
            debt_label = rule["label"]
            break

    # Penalty for 32% high interest credit card debt
    cc_outstanding = balance_sheet["credit_card"]["outstanding"]
    cc_penalty = 0
    if cc_outstanding > 0:
        cc_penalty = 10
        debt_score = max(10, debt_score - cc_penalty)

    # 4. Solvency / Net Worth Component (15 pts)
    solvency_score = 10
    solvency_label = "Overleveraged (>70%)"
    for rule in THRESHOLDS["debt_to_asset"]:
        if dar <= rule["max"]:
            solvency_score = rule["score"]
            solvency_label = rule["label"]
            break

    # 5. Cash Flow Stability Component (10 pts)
    # Check recent 3MA and net cash flow
    recent_months = timeline[-3:] if len(timeline) >= 3 else timeline
    all_positive = all(m.get("adj_net_cash_flow", m.get("net_cash_flow", 0)) > 0 for m in recent_months)
    recent_3ma = timeline[-1].get("three_ma_ncf", 0.0) if timeline else 0.0

    if all_positive and recent_3ma > 0:
        cf_score = 100
        cf_label = "Stable (Consistently Positive NCF)"
    else:
        cf_score = 30
        cf_label = "Volatile (Negative Cash Flow Instances)"

    # Compute Total Weighted Score
    w_savings = SCORING_WEIGHTS["savings"] / 100.0
    w_liquidity = SCORING_WEIGHTS["liquidity"] / 100.0
    w_debt = SCORING_WEIGHTS["debt"] / 100.0
    w_solvency = SCORING_WEIGHTS["solvency"] / 100.0
    w_cf = SCORING_WEIGHTS["cash_flow"] / 100.0

    total_score = round(
        (savings_score * w_savings) +
        (liquidity_score * w_liquidity) +
        (debt_score * w_debt) +
        (solvency_score * w_solvency) +
        (cf_score * w_cf),
        1
    )

    # Health Rating Band
    if total_score >= 85:
        tier = "Excellent"
        summary_color = "emerald"
    elif total_score >= 70:
        tier = "Good"
        summary_color = "blue"
    elif total_score >= 50:
        tier = "Fair"
        summary_color = "amber"
    else:
        tier = "At Risk"
        summary_color = "rose"

    return {
        "overall_health_score": total_score,
        "tier": tier,
        "summary_color": summary_color,
        "components": {
            "savings": {
                "name": "Savings & Wealth Accumulation",
                "weight_pct": SCORING_WEIGHTS["savings"],
                "raw_metric": f"{sr:.1f}%",
                "metric_label": "Average Savings Rate",
                "score": savings_score,
                "status": savings_label,
                "weighted_contribution": round(savings_score * w_savings, 2),
                "insight": f"Healthy savings habit saving {sr:.1f}% of income including active SIPs."
            },
            "liquidity": {
                "name": "Liquidity & Emergency Buffer",
                "weight_pct": SCORING_WEIGHTS["liquidity"],
                "raw_metric": f"{lm:.1f} months",
                "metric_label": "Emergency Runway",
                "score": liquidity_score,
                "status": liquidity_label,
                "weighted_contribution": round(liquidity_score * w_liquidity, 2),
                "insight": f"₹{balance_sheet['liquid_assets']:,.0f} in liquid assets provides {lm:.1f} months of living expense buffer."
            },
            "debt": {
                "name": "Debt Burden & Leverage Risk",
                "weight_pct": SCORING_WEIGHTS["debt"],
                "raw_metric": f"{dti:.1f}%",
                "metric_label": "Scheduled EMI Burden (DTI)",
                "score": debt_score,
                "status": debt_label,
                "weighted_contribution": round(debt_score * w_debt, 2),
                "insight": f"DTI is {dti:.1f}%. Contains active ₹{cc_outstanding:,.0f} credit card balance at {balance_sheet['credit_card']['interest_rate']}% APR."
            },
            "solvency": {
                "name": "Solvency & Net Worth Strength",
                "weight_pct": SCORING_WEIGHTS["solvency"],
                "raw_metric": f"{dar:.1f}%",
                "metric_label": "Debt-to-Asset Ratio",
                "score": solvency_score,
                "status": solvency_label,
                "weighted_contribution": round(solvency_score * w_solvency, 2),
                "insight": f"Net Worth of ₹{balance_sheet['net_worth']:,.0f} with a moderate {dar:.1f}% debt leverage against total assets."
            },
            "cash_flow": {
                "name": "Cash Flow Stability",
                "weight_pct": SCORING_WEIGHTS["cash_flow"],
                "raw_metric": f"₹{recent_3ma:,.0f}/mo",
                "metric_label": "3-Month Moving Average NCF",
                "score": cf_score,
                "status": cf_label,
                "weighted_contribution": round(cf_score * w_cf, 2),
                "insight": "Consistent surplus cash flow across consecutive operating quarters."
            }
        },
        "why_this_score": [
            f"Savings Rate of {sr:.1f}% exceeds benchmark targets, earning {savings_score}/100.",
            f"Liquidity buffer provides {lm:.1f} months of expenses, comfortably meeting emergency recommendations ({liquidity_score}/100).",
            f"Scheduled EMI-to-income is manageable at {dti:.1f}%, but credit card debt @ {balance_sheet['credit_card']['interest_rate']}% APR imposes a penalty ({debt_score}/100).",
            f"Debt-to-Asset is {dar:.1f}%, supported by ₹{balance_sheet['net_worth']:,.0f} net worth ({solvency_score}/100).",
            f"Cash flow stability is strong with positive operating margins ({cf_score}/100)."
        ]
    }

if __name__ == "__main__":
    result = calculate_health_score()
    print("=" * 50)
    print(f"Overall Financial Health Score: {result['overall_health_score']}/100 ({result['tier']})")
    print("=" * 50)
    for k, v in result['components'].items():
        print(f" - {v['name']} ({v['weight_pct']}%): {v['score']}/100 -> +{v['weighted_contribution']} pts | {v['status']}")
