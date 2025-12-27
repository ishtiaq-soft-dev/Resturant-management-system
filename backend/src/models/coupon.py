"""
Coupon model
"""

from src.extension.db import db


class Coupon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20), unique=True, nullable=False)
    discount_percent = db.Column(db.Float, nullable=False)
    valid_until = db.Column(db.DateTime, nullable=False)
    usage_limit = db.Column(db.Integer, default=100)
