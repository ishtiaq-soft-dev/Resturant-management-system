"""
ComboDealItem model
"""
from src.extension.db import db


class ComboDealItem(db.Model):
    """Links menu items to a combo deal"""

    id = db.Column(db.Integer, primary_key=True)
    combo_deal_id = db.Column(
        db.Integer, db.ForeignKey("combo_deal.id"), nullable=False
    )
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_item.id"), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    menu_item = db.relationship("MenuItem")

