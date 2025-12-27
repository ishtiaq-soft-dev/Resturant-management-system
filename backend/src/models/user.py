"""
User model
"""
from src.extension.db import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    address = db.Column(db.String(200), nullable=True)
    role = db.Column(db.String(10), default="customer")  # customer, admin
    orders = db.relationship("Order", backref="customer", lazy=True)
    reservations = db.relationship("Reservation", backref="customer", lazy=True)
    reviews = db.relationship("Review", backref="author", lazy=True)

