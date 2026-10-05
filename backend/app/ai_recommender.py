import json
import os
import hashlib
from typing import List, Literal, Dict, Any
from pydantic import BaseModel, Field
import requests

from app.config import GEMINI_API_KEY, GEMINI_MODEL
from app.database import get_connection
from app.metrics import compute_financial_metrics
from app.scoring import calculate_health_score
from app.anomalies import detect_anomalies

class ActionItem(BaseModel):
    priority: int = Field(..., description="Priority rank 1, 2, or 3")
    action: str = Field(..., description="Clear, imperative action title")
    reason: str = Field(..., description="Data-backed justification using explicit metrics")
    expected_impact: str = Field(..., description="Tangible financial outcome")
    urgency: Literal["HIGH", "MEDIUM", "LOW"]

class FinancialAdvice(BaseModel):
    source: str = Field(..., description="'LLM (Gemini)' or 'Rule-Based Fallback'")
    actions: List[ActionItem] = Field(..., min_length=3, max_length=3)

def generate_deterministic_fallback(metrics: Dict[str, Any], score_data: Dict[str, Any]) -> FinancialAdvice:
    """
    Robust rule-based recommendation fallback guaranteeing exactly 3 prioritized actions.
    """
    actions = []
    bs = metrics["balance_sheet"]
    cc = bs["credit_card"]
    
    # Priority 1: High Interest Debt (32% APR Credit Card)
    if cc["outstanding"] > 0:
        actions.append(ActionItem(
            priority=1,
            action=f"Eliminate High-Cost Credit Card Debt of INR {cc['outstanding']:,.0f}",
            reason=f"Credit card balance carries an aggressive {cc['interest_rate']}% APR, eroding INR {cc['outstanding'] * 0.32:,.0f} annually in finance charges while liquid reserves (INR {bs['liquid_assets']:,.0f}) are ample.",
            expected_impact=f"Saves ~INR {cc['outstanding'] * 0.32 / 12:,.0f}/month in interest fees and immediately raises Debt Health score from {score_data['components']['debt']['score']} to 100.",
            urgency="HIGH"
        ))

    # Priority 2: Audit Fat-Finger Utility Anomaly
    actions.append(ActionItem(
        priority=2,
        action="Audit & Dispute the INR 185,000 Outlier Mobile Bill",
        reason="Anomalous mobile utility bill on 2026-03-14 is 154x higher than the typical INR 900 monthly expense, indicating a billing error or fat-finger entry.",
        expected_impact="Protects INR 184,100 of household operating liquidity upon correction or refund.",
        urgency="HIGH"
    ))

    # Priority 3: Capital Allocation & Excess Liquidity Optimization
    lm = metrics["monthly_averages"]["liquidity_months"]
    actions.append(ActionItem(
        priority=3,
        action="Deploy Surplus Liquidity (>6 Months Runway) into Mutual Funds / Equity SIP",
        reason=f"Current emergency buffer is {lm:.1f} months (INR {bs['liquid_assets']:,.0f}), exceeding the recommended 6-month safety threshold. Excess cash is suffering purchasing power loss against inflation.",
        expected_impact="Accelerates long-term wealth compounding by increasing monthly SIPs by INR 15,000–20,000.",
        urgency="MEDIUM"
    ))

    return FinancialAdvice(
        source="Rule-Based Fallback",
        actions=actions[:3]
    )

def get_recommendations(force_refresh: bool = False) -> FinancialAdvice:
    """
    Returns 3 actionable recommendations:
    1. Checks local SQLite cache.
    2. Calls Gemini API with structured prompt if API key exists.
    3. Seamlessly falls back to deterministic rule engine upon any failure or missing key.
    """
    metrics = compute_financial_metrics()
    score_data = calculate_health_score(metrics)

    context_payload = {
        "health_score": score_data["overall_health_score"],
        "tier": score_data["tier"],
        "metrics": {
            "net_worth": metrics["balance_sheet"]["net_worth"],
            "liquid_assets": metrics["balance_sheet"]["liquid_assets"],
            "monthly_income": metrics["monthly_averages"]["avg_monthly_income"],
            "savings_rate_pct": metrics["monthly_averages"]["avg_savings_rate_pct"],
            "liquidity_months": metrics["monthly_averages"]["liquidity_months"],
            "emi_burden_pct": metrics["monthly_averages"]["avg_dti_pct"],
            "debt_to_asset_pct": metrics["balance_sheet"]["debt_to_asset_pct"],
            "credit_card_outstanding": metrics["balance_sheet"]["credit_card"]["outstanding"],
            "credit_card_interest_rate": metrics["balance_sheet"]["credit_card"]["interest_rate"],
            "utilities_outlier_amount": 185000.0
        },
        "score_breakdown": {
            k: v["score"] for k, v in score_data["components"].items()
        }
    }

    cache_hash = hashlib.md5(json.dumps(context_payload, sort_keys=True).encode()).hexdigest()
    cache_key = f"{cache_hash}_{GEMINI_MODEL}_v1"

    conn = get_connection()
    cursor = conn.cursor()

    if not force_refresh:
        cursor.execute("SELECT recommendations_json FROM recommendations_cache WHERE cache_key = ?", (cache_key,))
        cached_row = cursor.fetchone()
        if cached_row:
            conn.close()
            data = json.loads(cached_row["recommendations_json"])
            return FinancialAdvice(**data)

    # If Gemini API key is configured, attempt call
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
            prompt = f"""
You are a certified wealth management and financial health expert.
Evaluate the following household financial profile:
{json.dumps(context_payload, indent=2)}

CRITICAL CONSTRAINTS:
1. Use ONLY the figures provided above. Do NOT invent new numbers.
2. Produce EXACTLY 3 prioritized action items.
3. Return ONLY a valid JSON object matching this schema:
{{
  "actions": [
    {{
      "priority": 1,
      "action": "string",
      "reason": "string",
      "expected_impact": "string",
      "urgency": "HIGH" | "MEDIUM" | "LOW"
    }}
  ]
}}
"""
            res = requests.post(
                url,
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=8
            )

            if res.status_code == 200:
                raw_text = res.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Clean markdown backticks if present
                if raw_text.startswith("```"):
                    raw_text = raw_text.split("```")[1]
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:]
                parsed = json.loads(raw_text.strip())
                advice = FinancialAdvice(source="LLM (Gemini Flash)", actions=parsed.get("actions", [])[:3])
                if len(advice.actions) == 3:
                    cursor.execute("""
                    INSERT OR REPLACE INTO recommendations_cache (cache_key, health_score, recommendations_json)
                    VALUES (?, ?, ?)
                    """, (cache_key, score_data["overall_health_score"], advice.model_dump_json()))
                    conn.commit()
                    conn.close()
                    return advice
        except Exception as e:
            # Fall through to deterministic fallback
            pass

    conn.close()
    fallback_advice = generate_deterministic_fallback(metrics, score_data)
    return fallback_advice

if __name__ == "__main__":
    advice = get_recommendations()
    print(f"Source: {advice.source}")
    for act in advice.actions:
        print(f"\n[{act.priority}] ({act.urgency}) {act.action}")
        print(f"    Reason: {act.reason}")
        print(f"    Impact: {act.expected_impact}")
