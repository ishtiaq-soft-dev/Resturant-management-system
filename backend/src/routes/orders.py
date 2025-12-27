"""
Order routes
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.extension.db import db
from src.models import Order, OrderItem

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/api/orders', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    # Expect data: {'items': [{'id': 1, 'quantity': 2}], 'total': 100, 'payment': 'cash', 'type': 'delivery'}
    try:
        new_order = Order(
            user_id=current_user.id, 
            total_amount=data['total'], 
            payment_method=data['payment'], 
            order_type=data['type']
        )
        db.session.add(new_order)
        db.session.commit() # Commit to get ID
        
        for item in data['items']:
            menu_item_id = None
            combo_deal_id = None
            
            if isinstance(item['id'], int):
                menu_item_id = item['id']
            elif isinstance(item['id'], str):
                if item['id'].startswith('combo-'):
                    try:
                        # Extract ID from "combo-1-timestamp"
                        parts = item['id'].split('-')
                        if len(parts) >= 2:
                            combo_deal_id = int(parts[1])
                    except (ValueError, IndexError):
                        pass
                else:
                    try:
                        menu_item_id = int(item['id'])
                    except ValueError:
                        pass

            order_item = OrderItem(
                order_id=new_order.id, 
                menu_item_id=menu_item_id,
                combo_deal_id=combo_deal_id,
                name=item['name'],
                quantity=item['quantity'], 
                price=item['price']
            )
            db.session.add(order_item)
        
        db.session.commit()
        return jsonify({'message': 'Order placed', 'order_id': new_order.id}), 201
    except Exception as e:
        print(f"Error creating order: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/api/orders', methods=['GET'])
@login_required
def get_orders():
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return jsonify([{
        'id': o.id, 'status': o.status, 'total': o.total_amount, 'date': o.created_at.isoformat(),
        'items': [{
            'name': item.name, 
            'quantity': item.quantity, 
            'id': item.menu_item_id,
            'combo_id': item.combo_deal_id
        } for item in o.items]
    } for o in orders])

