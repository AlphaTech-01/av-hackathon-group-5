import sqlite3
from typing import Generator
from app.config import DB_PATH

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Raw layer
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS raw_transactions (
        raw_id INTEGER PRIMARY KEY AUTOINCREMENT,
        txn_id TEXT,
        date TEXT,
        category TEXT,
        description TEXT,
        amount REAL,
        type TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS raw_assets (
        raw_id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset_id TEXT,
        type TEXT,
        value REAL,
        as_of_date TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS raw_liabilities (
        raw_id INTEGER PRIMARY KEY AUTOINCREMENT,
        liability_id TEXT,
        type TEXT,
        outstanding REAL,
        interest_rate REAL,
        emi REAL,
        due_date TEXT
    );
    """)

    # Audit Log
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cleaning_audit_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_row_index INTEGER,
        txn_id TEXT,
        issue TEXT,
        action TEXT,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Normalized / Cleaned Layer
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS normalized_transactions (
        clean_txn_id TEXT PRIMARY KEY,
        raw_txn_id TEXT,
        date TEXT,
        category TEXT,
        description TEXT,
        amount REAL,
        type TEXT,
        is_outlier INTEGER DEFAULT 0,
        notes TEXT
    );
    """)

    # Computed Monthly Metrics Layer
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS computed_metrics_monthly (
        month TEXT PRIMARY KEY,
        total_income REAL,
        living_expenses REAL,
        debt_service REAL,
        investments REAL,
        total_outflows REAL,
        net_cash_flow REAL,
        savings_rate_pct REAL,
        dti_pct REAL,
        three_ma_ncf REAL
    );
    """)

    # Recommendations Cache
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendations_cache (
        cache_key TEXT PRIMARY KEY,
        health_score REAL,
        recommendations_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
