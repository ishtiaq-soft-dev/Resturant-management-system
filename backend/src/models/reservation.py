"""
Reservation model
"""
from src.extension.db import db


class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    reservation_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default="confirmed")  # confirmed, cancelled
    special_requests = db.Column(db.String(200), nullable=True)

