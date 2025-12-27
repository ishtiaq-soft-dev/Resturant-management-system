"""
Review model
"""
from datetime import datetime
from src.extension.db import db


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_item.id"), nullable=True)
    combo_deal_id = db.Column(db.Integer, db.ForeignKey("combo_deal.id"), nullable=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

