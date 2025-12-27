"""
Routes package - registers all blueprints
"""
from src.routes.auth import auth_bp
from src.routes.menu import menu_bp
from src.routes.orders import orders_bp
from src.routes.reviews import reviews_bp
from src.routes.reservations import reservations_bp
from src.routes.coupons import coupons_bp
from src.routes.combos import combos_bp
from src.routes.categories import categories_bp
from src.routes.admin import admin_bp
from src.routes.uploads import uploads_bp


def register_routes(app):
    """Register all blueprints with the app"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(reservations_bp)
    app.register_blueprint(coupons_bp)
    app.register_blueprint(combos_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(uploads_bp)

