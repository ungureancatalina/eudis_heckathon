import sqlite3

DB_PATH = "routes.db"

def get_connection():
    """Create or reuse a SQLite connection."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row  # nicer dict-style access
    return conn

def init_db():
    """Initialize database schema if it doesn't exist."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        data TEXT
    )
    """)
    conn.commit()
    conn.close()

# Initialize when imported
if __name__ == "__main__":
    init_db()
    print("Database initialized.")
