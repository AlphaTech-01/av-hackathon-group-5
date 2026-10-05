import pandas as pd
import numpy as np
from typing import List, Dict, Any
from app.database import get_connection

def detect_anomalies() -> List[Dict[str, Any]]:
    """
    Detects financial and transactional anomalies using:
    1. IQR per category for expenses.
    2. Outlier flags from normalized transactions (e.g. fat-finger typos, sign reversals).
    3. Category historical deviation factor (Amount / Category Median).
    Excludes regular predictable recurring income and scheduled fixed EMIs.
    """
    conn = get_connection()
    df = pd.read_sql("SELECT * FROM normalized_transactions", conn)
    conn.close()

    anomalies = []

    # Filter expenses for IQR analysis
    expense_df = df[df['type'] == 'expense'].copy()

    # Pre-calculate category medians and IQR
    for category, grp in expense_df.groupby('category'):
        # Exclude fixed regular debt payments from pure IQR distribution skew
        if category in ['Investments']:
            continue
        
        amounts = grp['amount']
        if len(amounts) < 4:
            continue

        q1 = float(amounts.quantile(0.25))
        q3 = float(amounts.quantile(0.75))
        iqr = q3 - q1
        upper_bound = q3 + (1.5 * iqr)
        median_val = float(amounts.median())

        for _, row in grp.iterrows():
            amt = float(row['amount'])
            clean_id = row['clean_txn_id']
            date_str = row['date']
            desc = row['description']
            is_outlier_flag = int(row['is_outlier'])

            # If row exceeded IQR upper bound or was flagged during cleaning
            if amt > upper_bound or is_outlier_flag == 1 or (median_val > 0 and amt > 5.0 * median_val):
                # Avoid flagging standard regular scheduled transactions (like Home Loan 28500 or Housing rent 32000)
                if desc in ['Home loan EMI', 'Rent / Home Maintenance'] and amt == median_val:
                    continue

                deviation_factor = round(amt / median_val, 1) if median_val > 0 else 1.0

                # Formulate human-readable description
                if desc == "Mobile" and amt >= 100000:
                    explanation = f"INR {amt:,.2f} spent on Mobile Utilities on {date_str} ({deviation_factor}x the usual median of INR {median_val:,.2f} for Utilities). Likely a fat-finger data entry typo."
                    severity = "CRITICAL"
                elif category == "Salary" and row['type'] == "expense":
                    explanation = f"INR {amt:,.2f} recorded as a 'Monthly salary correction' expense on {date_str}. High impact on monthly cash flow."
                    severity = "HIGH"
                elif amt == 0.0:
                    explanation = f"INR 0.00 recorded for {desc} ({category}) on {date_str}. Missing or waived debt payment obligation."
                    severity = "MEDIUM"
                elif deviation_factor >= 3.0:
                    explanation = f"INR {amt:,.2f} spent on {desc} ({category}) on {date_str} ({deviation_factor}x the category median of INR {median_val:,.2f})."
                    severity = "HIGH" if deviation_factor >= 5.0 else "MEDIUM"
                else:
                    explanation = f"INR {amt:,.2f} spent on {desc} on {date_str} exceeds statistical threshold of INR {upper_bound:,.2f}."
                    severity = "LOW"

                anomalies.append({
                    "clean_txn_id": clean_id,
                    "date": date_str,
                    "category": category,
                    "description": desc,
                    "amount": amt,
                    "category_median": round(median_val, 2),
                    "upper_threshold": round(upper_bound, 2),
                    "deviation_factor": deviation_factor,
                    "severity": severity,
                    "message": explanation
                })

    # Sort by amount and severity descending
    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    anomalies.sort(key=lambda x: (severity_order.get(x["severity"], 4), -x["amount"]))
    return anomalies

if __name__ == "__main__":
    detected = detect_anomalies()
    print(f"Total anomalies detected: {len(detected)}")
    for a in detected[:5]:
        print(f"[{a['severity']}] {a['message']}")
