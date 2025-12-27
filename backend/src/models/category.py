"""
Category model
"""
from datetime import datetime
from src.extension.db import db


class Category(db.Model):
    """Food categories for menu items"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    # Note: MenuItem.category is a string field, not a foreign key, so no relationship defined

