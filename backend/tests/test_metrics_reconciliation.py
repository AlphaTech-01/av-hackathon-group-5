import pytest
import sqlite3
import pandas as pd
from app.ingestion import ingest_and_clean_data
from app.metrics import compute_financial_metrics
from app.scoring import calculate_health_score
from app.anomalies import detect_anomalies
from app.ai_recommender import get_recommendations, generate_deterministic_fallback

def test_data_ingestion_and_cleaning():
    res = ingest_and_clean_data()
    assert res["raw_counts"]["transactions"] == 817
    assert res["cleaned_transactions_count"] == 816  # exactly 1 duplicate row dropped
    assert res["data_quality_score"] > 95.0
    assert res["audit_logs_count"] >= 10

def test_cash_flow_reconciliation():
    """
    Verification Gate: Total Income - Total Outflows == Net Cash Flow across all 24 months.
    """
    metrics = compute_financial_metrics()
    timeline = metrics["monthly_timeline"]
    assert len(timeline) == 24, "Should have exactly 24 monthly periods"

    for month_data in timeline:
        income = month_data["total_income"]
        outflows = month_data["total_outflows"]
        ncf = month_data["net_cash_flow"]
        # Float tolerance
        assert abs((income - outflows) - ncf) < 0.01, f"Reconciliation failed in {month_data['month']}"

def test_balance_sheet_reconciliation():
    """
    Verification Gate: Liquid assets sum and Net Worth = Assets - Liabilities.
    """
    metrics = compute_financial_metrics()
    bs = metrics["balance_sheet"]
    assert bs["total_assets"] == 7025000.0
    assert bs["total_liabilities"] == 3338000.0
    assert bs["net_worth"] == (7025000.0 - 3338000.0)
    assert bs["liquid_assets"] == (325000 + 85000 + 450000)
    assert abs(bs["debt_to_asset_pct"] - 47.52) < 0.05

def test_scoring_bounds_and_components():
    score_res = calculate_health_score()
    score = score_res["overall_health_score"]
    assert 0 <= score <= 100
    assert len(score_res["components"]) == 5
    assert len(score_res["why_this_score"]) == 5

def test_scoring_edge_cases():
    """
    Verification Gate: Extreme edge cases (0 income, extreme debt) produce valid score bounds.
    """
    mock_metrics = {
        "balance_sheet": {
            "total_assets": 100000.0,
            "liquid_assets": 0.0,
            "investment_assets": 0.0,
            "fixed_assets": 100000.0,
            "total_liabilities": 200000.0,
            "net_worth": -100000.0,
            "debt_to_asset_pct": 200.0,
            "monthly_scheduled_emi": 50000.0,
            "credit_card": {"outstanding": 100000.0, "interest_rate": 36.0}
        },
        "monthly_averages": {
            "avg_monthly_income": 0.0,
            "avg_living_expenses": 50000.0,
            "avg_savings_rate_pct": -100.0,
            "avg_dti_pct": 100.0,
            "liquidity_months": 0.0
        },
        "monthly_timeline": []
    }
    edge_score = calculate_health_score(mock_metrics)
    assert 0 <= edge_score["overall_health_score"] <= 100
    assert edge_score["tier"] == "At Risk"

def test_recommendations_exactly_three():
    """
    Verification Gate: AI recommendation engine always returns exactly 3 prioritized actions.
    """
    advice = get_recommendations()
    assert len(advice.actions) == 3
    priorities = [a.priority for a in advice.actions]
    assert priorities == [1, 2, 3]

def test_anomalies_detection():
    anomalies = detect_anomalies()
    assert len(anomalies) > 0
    # Must catch mobile outlier
    mobile_anomalies = [a for a in anomalies if a["description"] == "Mobile"]
    assert len(mobile_anomalies) >= 1
    assert mobile_anomalies[0]["amount"] == 185000.0
