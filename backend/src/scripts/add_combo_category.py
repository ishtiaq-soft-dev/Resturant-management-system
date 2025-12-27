"""
Add category column to combo_deal table
"""
from src import create_app
from src.extension.db import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        # Add category column if it doesn't exist
        with db.engine.connect() as conn:
            # SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
            # So we'll try to add it and catch the error if it exists
            try:
                conn.execute(text("ALTER TABLE combo_deal ADD COLUMN category VARCHAR(50);"))
                conn.commit()
                print("Successfully added category column to combo_deal table.")
            except Exception as e:
                if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                    print("Category column already exists.")
                else:
                    raise
    except Exception as e:
        print(f"Error: {e}")
        # Fallback: Drop and recreate combo_deal table
        print("Falling back to recreating combo_deal table...")
        try:
            # Drop the table
            db.engine.execute(text("DROP TABLE IF EXISTS combo_deal_item;"))
            db.engine.execute(text("DROP TABLE IF EXISTS combo_deal;"))
            # Recreate tables
            from src.models import ComboDeal, ComboDealItem
            db.create_all()
            print("combo_deal table recreated with category column.")
        except Exception as e2:
            print(f"Error recreating table: {e2}")

