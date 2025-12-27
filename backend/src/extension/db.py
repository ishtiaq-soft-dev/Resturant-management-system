"""
Database extensions and configuration
"""
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
bcrypt = Bcrypt()
jwt = JWTManager()

# Configure login manager
login_manager.login_view = "auth.login"
login_manager.login_message = "Please log in to access this page."
login_manager.login_message_category = "info"


def init_db(app):
    """Initialize database with app context"""
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    return db, login_manager, bcrypt, jwt

