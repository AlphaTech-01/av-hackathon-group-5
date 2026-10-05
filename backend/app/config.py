import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = os.environ.get("DB_PATH", str(BASE_DIR / "financial_engine.db"))

DEFAULT_DATASET_DIR = Path("C:/Users/HP/Downloads/Hackathon/Dataset")
if not DEFAULT_DATASET_DIR.exists():
    # Fallback to local Dataset directory if copied into backend or repo
    DEFAULT_DATASET_DIR = BASE_DIR.parent / "Dataset"

DATASET_DIR = Path(os.environ.get("DATASET_DIR", str(DEFAULT_DATASET_DIR)))

# AI Configuration
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

# Scoring Weights (Must sum to 100)
SCORING_WEIGHTS = {
    "savings": 25,
    "liquidity": 25,
    "debt": 25,
    "solvency": 15,
    "cash_flow": 10
}

# Scoring Thresholds
THRESHOLDS = {
    "savings_rate": [
        {"min": 30.0, "score": 100, "label": "Excellent (>=30%)"},
        {"min": 20.0, "score": 80, "label": "Good (20-30%)"},
        {"min": 10.0, "score": 50, "label": "Fair (10-20%)"},
        {"min": 0.0, "score": 20, "label": "Poor (<10%)"}
    ],
    "liquidity_months": [
        {"min": 6.0, "score": 100, "label": "Solid Buffer (>=6 months)"},
        {"min": 3.0, "score": 75, "label": "Moderate Buffer (3-6 months)"},
        {"min": 1.0, "score": 40, "label": "Thin Buffer (1-3 months)"},
        {"min": 0.0, "score": 10, "label": "Vulnerable (<1 month)"}
    ],
    "debt_to_income": [
        {"max": 30.0, "score": 100, "label": "Healthy (<=30%)"},
        {"max": 40.0, "score": 70, "label": "Moderate (30-40%)"},
        {"max": 50.0, "score": 40, "label": "Heavy (40-50%)"},
        {"max": float("inf"), "score": 10, "label": "Distressed (>50%)"}
    ],
    "debt_to_asset": [
        {"max": 30.0, "score": 100, "label": "Low Leverage (<=30%)"},
        {"max": 50.0, "score": 70, "label": "Moderate Leverage (30-50%)"},
        {"max": 70.0, "score": 40, "label": "High Leverage (50-70%)"},
        {"max": float("inf"), "score": 10, "label": "Overleveraged (>70%)"}
    ]
}
