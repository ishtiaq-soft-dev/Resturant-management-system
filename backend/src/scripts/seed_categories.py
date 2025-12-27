"""
Seed script for categories.
Run with: python -m src.scripts.seed_categories
"""
from src import create_app
from src.extension.db import db
from src.models import Category, MenuItem

app = create_app()

def seed_categories():
    with app.app_context():
        # Get unique categories from existing menu items
        existing_categories = db.session.query(MenuItem.category).distinct().all()
        existing_category_names = [cat[0] for cat in existing_categories]
        
        # Default categories if none exist
        default_categories = [
            {"name": "Burgers", "description": "Juicy burgers and sandwiches"},
            {"name": "Pizza", "description": "Freshly baked pizzas"},
            {"name": "Pasta", "description": "Italian pasta dishes"},
            {"name": "Sushi", "description": "Fresh sushi and rolls"},
            {"name": "Desserts", "description": "Sweet treats and desserts"},
            {"name": "Drinks", "description": "Beverages and drinks"}
        ]
        
        # Combine existing and default categories
        all_category_names = set(existing_category_names)
        for cat in default_categories:
            all_category_names.add(cat["name"])
        
        # Create categories
        created_count = 0
        for cat_name in sorted(all_category_names):
            # Check if category already exists
            existing = Category.query.filter_by(name=cat_name).first()
            if not existing:
                # Find description from default categories if available
                description = next((c["description"] for c in default_categories if c["name"] == cat_name), "")
                category = Category(name=cat_name, description=description, is_active=True)
                db.session.add(category)
                created_count += 1
        
        db.session.commit()
        print(f"Successfully created {created_count} new categories!")
        print(f"Total categories: {Category.query.count()}")

if __name__ == '__main__':
    seed_categories()

