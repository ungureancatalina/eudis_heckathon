import json
from db_setup import get_connection

def add_route(name: str, route_obj: dict):
    """Insert or update a route by name."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT OR REPLACE INTO routes (name, data) VALUES (?, ?)",
        (name, json.dumps(route_obj))
    )

    conn.commit()
    conn.close()

def get_route(name: str):
    """Fetch a single route by name."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT data FROM routes WHERE name = ?", (name,))
    row = cur.fetchone()
    conn.close()

    if row:
        return json.loads(row["data"])
    return None

def list_routes():
    """Return all route names."""
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT name FROM routes")
    names = [r["name"] for r in cur.fetchall()]
    conn.close()

    return names
