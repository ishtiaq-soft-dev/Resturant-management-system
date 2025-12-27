"""
Combo Deal routes
"""
from flask import Blueprint, jsonify
from src.models import ComboDeal

combos_bp = Blueprint('combos', __name__)


@combos_bp.route('/api/combos', methods=['GET'])
def get_combos():
    combos = ComboDeal.query.filter_by(is_active=True).all()
    result = []
    for combo in combos:
        # Calculate original total price
        original_price = sum(item.menu_item.price * item.quantity for item in combo.items)
        savings = original_price - combo.combo_price
        
        # Get category from combo or derive from first item
        category = combo.category
        if not category and combo.items:
            # Get unique categories from items
            categories = list(set(item.menu_item.category for item in combo.items))
            category = categories[0] if categories else "Mixed"
        
        result.append({
            'id': combo.id,
            'name': combo.name,
            'description': combo.description,
            'combo_price': combo.combo_price,
            'original_price': original_price,
            'savings': savings,
            'image_url': combo.image_url,
            'category': category or "Mixed",
            'items': [{
                'id': item.menu_item.id,
                'name': item.menu_item.name,
                'price': item.menu_item.price,
                'quantity': item.quantity,
                'image_url': item.menu_item.image_url,
                'category': item.menu_item.category
            } for item in combo.items]
        })
    return jsonify(result)

