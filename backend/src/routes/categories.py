"""
Category routes
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.extension.db import db
from src.models import Category, MenuItem

categories_bp = Blueprint('categories', __name__)


@categories_bp.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all active categories"""
    categories = Category.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description,
        'is_active': c.is_active
    } for c in categories])


@categories_bp.route('/api/admin/categories', methods=['GET'])
@login_required
def admin_get_categories():
    """Get all categories (including inactive) for admin"""
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    categories = Category.query.order_by(Category.name).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description,
        'is_active': c.is_active,
        'created_at': c.created_at.isoformat()
    } for c in categories])


@categories_bp.route('/api/admin/categories', methods=['POST'])
@login_required
def create_category():
    """Create a new category"""
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'message': 'Category name is required'}), 400
    
    # Check if category already exists
    existing = Category.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'message': 'Category already exists'}), 400
    
    new_category = Category(
        name=data['name'],
        description=data.get('description', ''),
        is_active=data.get('is_active', True)
    )
    db.session.add(new_category)
    try:
        db.session.commit()
        return jsonify({'message': 'Category created', 'id': new_category.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@categories_bp.route('/api/admin/categories/<int:category_id>', methods=['PUT'])
@login_required
def update_category(category_id):
    """Update a category"""
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    category = Category.query.get_or_404(category_id)
    data = request.get_json()
    
    if 'name' in data:
        # Check if name already exists (excluding current category)
        existing = Category.query.filter(Category.name == data['name'], Category.id != category_id).first()
        if existing:
            return jsonify({'message': 'Category name already exists'}), 400
        category.name = data['name']
    
    if 'description' in data:
        category.description = data['description']
    
    if 'is_active' in data:
        category.is_active = data['is_active']
    
    try:
        db.session.commit()
        return jsonify({'message': 'Category updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@categories_bp.route('/api/admin/categories/<int:category_id>', methods=['DELETE'])
@login_required
def delete_category(category_id):
    """Delete a category (soft delete by setting is_active=False)"""
    if current_user.role != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    category = Category.query.get_or_404(category_id)
    
    # Check if category is used by any menu items
    items_count = MenuItem.query.filter_by(category=category.name).count()
    if items_count > 0:
        # Soft delete instead of hard delete
        category.is_active = False
        db.session.commit()
        return jsonify({'message': f'Category deactivated. {items_count} menu items still use this category.'}), 200
    
    # Hard delete if no items use it
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'}), 200

