"""
Application factory pattern
"""
from flask import Flask
from flask_cors import CORS
import os
from src.extension.db import init_db, login_manager
from src.models import User
from src.routes import register_routes


def create_app(config=None):
    """
    Application factory function
    
    Args:
        config: Optional configuration dictionary
    
    Returns:
        Flask application instance
    """
    app = Flask(__name__, instance_relative_config=True)
    
    # Configuration
    app.config["SECRET_KEY"] = config.get("SECRET_KEY", "dev_secret_key") if config else "dev_secret_key"
    app.config["JWT_SECRET_KEY"] = config.get("JWT_SECRET_KEY", "jwt_dev_secret_key") if config else "jwt_dev_secret_key"
    app.config["SQLALCHEMY_DATABASE_URI"] = config.get("SQLALCHEMY_DATABASE_URI", "sqlite:///site.db") if config else "sqlite:///site.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    # Initialize extensions
    db, login_manager_instance, bcrypt, jwt = init_db(app)
    
    # Configure login manager user loader
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # CORS configuration
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    )
    
    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Register routes
    register_routes(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

