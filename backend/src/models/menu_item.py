"""
MenuItem model
"""
from src.extension.db import db


class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    is_deal = db.Column(db.Boolean, default=False)
    availability = db.Column(db.Boolean, default=True)
    reviews = db.relationship("Review", backref="item", lazy=True)

