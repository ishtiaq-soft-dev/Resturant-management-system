"""
Database fix script
"""
from src import create_app
from src.extension.db import db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        # Check if the column exists
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE order_item ADD COLUMN combo_deal_id INT DEFAULT NULL;"))
            conn.execute(text("ALTER TABLE order_item ADD FOREIGN KEY (combo_deal_id) REFERENCES combo_deal(id);"))
            conn.commit()
        print("Successfully added combo_deal_id column to order_item table.")
    except Exception as e:
        print(f"Error: {e}")
        # If the error is because it already exists, that's fine.
        if "Duplicate column name" in str(e):
            print("Column already exists.")
        else:
            # Fallback: Drop and recreate tables (more drastic)
            print("Falling back to recreating table...")
            # Note: This will lose current order data.
            # db.drop_all()
            # db.create_all()
            # print("Tables recreated.")
            pass

