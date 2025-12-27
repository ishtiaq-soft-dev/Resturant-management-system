"""
Menu routes
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.extension.db import db
from src.models import MenuItem, Review, ComboDealItem, OrderItem
from src.routes.utils import save_uploaded_file, UPLOAD_FOLDER
import os

menu_bp = Blueprint('menu', __name__)


@menu_bp.route('/api/menu', methods=['GET'])
def get_menu():
    # Check if admin is requesting all items
    from flask_login import current_user
    show_all = request.args.get('all', 'false').lower() == 'true'
    
    if show_all and current_user.is_authenticated and current_user.role == 'admin':
        items = MenuItem.query.all()
    else:
        items = MenuItem.query.filter_by(availability=True).all()
    
    return jsonify([{
        'id': i.id, 'name': i.name, 'description': i.description, 
        'price': i.price, 'category': i.category, 'image_url': i.image_url, 
        'is_deal': i.is_deal, 'availability': i.availability
    } for i in items])


@menu_bp.route('/api/menu', methods=['POST'])
@login_required
def create_menu_item():
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    # Handle file upload
    image_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename:
            filename = save_uploaded_file(file)
            if filename:
                image_url = f'/api/uploads/{filename}'
    
    # Get form data
    name = request.form.get('name')
    description = request.form.get('description', '')
    price = request.form.get('price')
    category = request.form.get('category')
    is_deal = request.form.get('is_deal', 'false').lower() == 'true'
    
    # Fallback to JSON if no form data (for backward compatibility)
    if not name:
        data = request.get_json() or {}
        name = data.get('name')
        description = data.get('description', '')
        price = data.get('price')
        category = data.get('category')
        is_deal = data.get('is_deal', False)
        if not image_url:
            image_url = data.get('image_url', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500')
    
    if not name or not price or not category:
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        price = float(price)
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid price'}), 400
    
    new_item = MenuItem(
        name=name,
        description=description,
        price=price,
        category=category,
        image_url=image_url or 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        is_deal=is_deal,
        availability=True
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Item created', 'id': new_item.id}), 201


@menu_bp.route('/api/menu/<int:item_id>', methods=['PUT'])
@login_required
def update_menu_item(item_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    
    item = MenuItem.query.get_or_404(item_id)
    
    # Handle file upload if present
    if 'image' in request.files:
        file = request.files['image']
        if file.filename:
            filename = save_uploaded_file(file)
            if filename:
                # Delete old image if it's a local file
                if item.image_url and item.image_url.startswith('/api/uploads/'):
                    old_filename = item.image_url.split('/')[-1]
                    old_filepath = os.path.join(UPLOAD_FOLDER, old_filename)
                    if os.path.exists(old_filepath):
                        try:
                            os.remove(old_filepath)
                        except:
                            pass
                item.image_url = f'/api/uploads/{filename}'
    
    # Get form data or JSON
    # Check if form data exists (multipart/form-data)
    if request.content_type and 'multipart/form-data' in request.content_type:
        if 'name' in request.form:
            item.name = request.form.get('name')
        if 'description' in request.form:
            item.description = request.form.get('description')
        if 'price' in request.form:
            try:
                item.price = float(request.form.get('price'))
            except (ValueError, TypeError):
                pass
        if 'category' in request.form:
            item.category = request.form.get('category')
        if 'is_deal' in request.form:
            item.is_deal = request.form.get('is_deal', 'false').lower() == 'true'
        if 'availability' in request.form:
            item.availability = request.form.get('availability', 'true').lower() == 'true'
    elif request.is_json:
        # Fallback to JSON
        data = request.get_json() or {}
        for key, value in data.items():
            if hasattr(item, key) and key != 'image_url':  # Don't update image_url from JSON if file was uploaded
                setattr(item, key, value)
    else:
        # Try form data anyway (for compatibility)
        if 'name' in request.form:
            item.name = request.form.get('name')
        if 'description' in request.form:
            item.description = request.form.get('description')
        if 'price' in request.form:
            try:
                item.price = float(request.form.get('price'))
            except (ValueError, TypeError):
                pass
        if 'category' in request.form:
            item.category = request.form.get('category')
        if 'is_deal' in request.form:
            item.is_deal = request.form.get('is_deal', 'false').lower() == 'true'
        if 'availability' in request.form:
            item.availability = request.form.get('availability', 'true').lower() == 'true'
    
    db.session.commit()
    return jsonify({'message': 'Item updated'}), 200


@menu_bp.route('/api/menu/<int:item_id>', methods=['DELETE'])
@login_required
def delete_menu_item(item_id):
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    item = MenuItem.query.get_or_404(item_id)
    
    # Delete related reviews
    Review.query.filter_by(menu_item_id=item_id).delete()
    
    # Delete related combo deal items (this will remove the item from combos)
    ComboDealItem.query.filter_by(menu_item_id=item_id).delete()
    
    # Note: OrderItems keep the menu_item_id for historical records, but we can set it to None
    # since OrderItems store the name and price at time of order (historical data)
    OrderItem.query.filter_by(menu_item_id=item_id).update({OrderItem.menu_item_id: None})
    
    # Delete the uploaded image file if it exists
    if item.image_url and item.image_url.startswith('/api/uploads/'):
        old_filename = item.image_url.split('/')[-1]
        old_filepath = os.path.join(UPLOAD_FOLDER, old_filename)
        if os.path.exists(old_filepath):
            try:
                os.remove(old_filepath)
            except Exception as e:
                print(f"Error deleting image file: {e}")
    
    # Delete the menu item
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully'}), 200

