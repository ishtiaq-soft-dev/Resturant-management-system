"""
Coupon routes
"""
from flask import Blueprint, request, jsonify
from src.extension.db import db
from src.models import Coupon
from datetime import datetime

coupons_bp = Blueprint('coupons', __name__)


@coupons_bp.route('/api/coupons/verify', methods=['POST'])
def verify_coupon():
    data = request.get_json()
    code = data.get('code')
    coupon = Coupon.query.filter_by(code=code).first()
    if coupon and coupon.valid_until > datetime.utcnow() and coupon.usage_limit > 0:
        return jsonify({'discount': coupon.discount_percent, 'valid': True}), 200
    return jsonify({'valid': False, 'message': 'Invalid or expired coupon'}), 400

