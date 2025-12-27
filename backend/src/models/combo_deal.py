"""
ComboDeal model
"""
from src.extension.db import db


class ComboDeal(db.Model):
    """A combo deal bundles multiple menu items at a discounted price"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    combo_price = db.Column(db.Float, nullable=False)  # Discounted total price
    image_url = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(50), nullable=True)  # Primary category for filtering
    is_active = db.Column(db.Boolean, default=True)
    items = db.relationship("ComboDealItem", backref="combo", lazy=True)
    reviews = db.relationship("Review", backref="combo", lazy=True)

