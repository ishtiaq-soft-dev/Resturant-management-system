"""
Order model
"""
from datetime import datetime
from src.extension.db import db


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    status = db.Column(
        db.String(20), default="pending"
    )  # pending, preparing, ready, delivered, picked_up
    total_amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)  # cash, card
    order_type = db.Column(db.String(20), nullable=False)  # pickup, delivery
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    items = db.relationship("OrderItem", backref="order", lazy=True)

