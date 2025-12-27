"""
Reservation routes
"""
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.extension.db import db
from src.models import Reservation
from datetime import datetime

reservations_bp = Blueprint('reservations', __name__)


@reservations_bp.route('/api/reservations', methods=['POST'])
@login_required
def make_reservation():
    data = request.get_json()
    # Expect date string format needed
    res_time = datetime.strptime(data['time'], '%Y-%m-%dT%H:%M')
    res = Reservation(
        user_id=current_user.id, 
        party_size=data['party_size'], 
        reservation_time=res_time,
        special_requests=data.get('requests')
    )
    db.session.add(res)
    db.session.commit()
    return jsonify({'message': 'Reservation confirmed'}), 201

