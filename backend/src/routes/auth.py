"""
Authentication routes
"""
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from flask_jwt_extended import create_access_token
from src.extension.db import db, bcrypt
from src.models import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    role = data.get('role', 'customer')  # Default to 'customer' if not provided
    # Validate role
    if role not in ['customer', 'admin']:
        role = 'customer'
    user = User(username=data['username'], email=data['email'], password_hash=hashed_password, address=data.get('address'), role=role)
    db.session.add(user)
    try:
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        login_user(user)
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Login successful', 
            'token': access_token,
            'user': {'id': user.id, 'username': user.username, 'role': user.role}
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401


@auth_bp.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/api/auth/user', methods=['GET'])
@login_required
def get_user():
    return jsonify({
        'id': current_user.id, 
        'username': current_user.username, 
        'email': current_user.email, 
        'role': current_user.role, 
        'address': current_user.address
    })

