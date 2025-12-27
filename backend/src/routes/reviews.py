"""
Review routes
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.extension.db import db
from src.models import Review

reviews_bp = Blueprint('reviews', __name__)


@reviews_bp.route('/api/menu/<int:item_id>/reviews', methods=['POST'])
@login_required
def add_review(item_id):
    data = request.get_json()
    review = Review(user_id=current_user.id, menu_item_id=item_id, rating=data['rating'], comment=data.get('comment'))
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added'}), 201


@reviews_bp.route('/api/combos/<int:combo_id>/reviews', methods=['POST'])
@login_required
def add_combo_review(combo_id):
    data = request.get_json()
    review = Review(user_id=current_user.id, combo_deal_id=combo_id, rating=data['rating'], comment=data.get('comment'))
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added'}), 201


@reviews_bp.route('/api/menu/<int:item_id>/reviews', methods=['GET'])
def get_reviews(item_id):
    reviews = Review.query.filter_by(menu_item_id=item_id).all()
    return jsonify([{
        'user': r.author.username, 'rating': r.rating, 'comment': r.comment, 'date': r.created_at.isoformat()
    } for r in reviews])


@reviews_bp.route('/api/reviews', methods=['GET'])
def get_all_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([{
        'id': r.id,
        'user': r.author.username,
        'item_name': r.item.name if r.item else (r.combo.name if r.combo else "Unknown"),
        'rating': r.rating,
        'comment': r.comment,
        'date': r.created_at.isoformat()
    } for r in reviews])

