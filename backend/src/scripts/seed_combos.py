"""
Seed script for combo deals.
Run with: python -m src.scripts.seed_combos
"""
from src import create_app
from src.extension.db import db
from src.models import MenuItem, ComboDeal, ComboDealItem

app = create_app()

def seed_combos():
    with app.app_context():
        # Clear existing combos
        ComboDealItem.query.delete()
        ComboDeal.query.delete()
        db.session.commit()
        print("Cleared existing combo deals.")

        # Get some menu items by name
        items = {item.name: item for item in MenuItem.query.all()}
        
        # Create combo deals
        combos_data = [
            {
                "name": "Burger Feast Combo",
                "description": "Classic Smash Burger + Fresh Lemonade + New York Cheesecake",
                "combo_price": 15.99,  # Original: 9.99 + 3.99 + 6.99 = 20.97
                "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
                "category": "Burgers",
                "items": [
                    ("Classic Smash Burger", 1),
                    ("Fresh Lemonade", 1),
                    ("New York Cheesecake", 1)
                ]
            },
            {
                "name": "Pizza Party Deal",
                "description": "Pepperoni Supreme + Margherita Pizza + 2x Fresh Lemonade",
                "combo_price": 29.99,  # Original: 14.99 + 12.99 + 7.98 = 35.96
                "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
                "category": "Pizza",
                "items": [
                    ("Pepperoni Supreme", 1),
                    ("Margherita Pizza", 1),
                    ("Fresh Lemonade", 2)
                ]
            },
            {
                "name": "Sushi Lovers Combo",
                "description": "Dragon Roll + Rainbow Roll + Mango Smoothie",
                "combo_price": 38.99,  # Original: 16.99 + 18.99 + 5.49 = 41.47
                "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
                "category": "Sushi",
                "items": [
                    ("Dragon Roll", 1),
                    ("Rainbow Roll", 1),
                    ("Mango Smoothie", 1)
                ]
            },
            {
                "name": "Family Dinner Bundle",
                "description": "BBQ Bacon Burger + Creamy Alfredo Pasta + 2x Mango Smoothie + Tiramisu",
                "combo_price": 35.99,  # Original: 12.99 + 13.99 + 10.98 + 8.49 = 46.45
                "image_url": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
                "category": "Mixed",
                "items": [
                    ("BBQ Bacon Burger", 1),
                    ("Creamy Alfredo Pasta", 1),
                    ("Mango Smoothie", 2),
                    ("Tiramisu", 1)
                ]
            },
            {
                "name": "Sweet Treat Combo",
                "description": "Chocolate Lava Cake + Tiramisu + Fresh Lemonade",
                "combo_price": 16.99,  # Original: 7.99 + 8.49 + 3.99 = 20.47
                "image_url": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
                "category": "Desserts",
                "items": [
                    ("Chocolate Lava Cake", 1),
                    ("Tiramisu", 1),
                    ("Fresh Lemonade", 1)
                ]
            },
            {
                "name": "Ultimate Burger Combo",
                "description": "BBQ Bacon Burger + Mushroom Swiss Burger + 2x Fresh Lemonade",
                "combo_price": 24.99,  # Original: 12.99 + 11.49 + 7.98 = 32.46
                "image_url": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
                "category": "Burgers",
                "items": [
                    ("BBQ Bacon Burger", 1),
                    ("Mushroom Swiss Burger", 1),
                    ("Fresh Lemonade", 2)
                ]
            },
            {
                "name": "Pasta Paradise Combo",
                "description": "Creamy Alfredo Pasta + Spaghetti Bolognese + Fresh Lemonade",
                "combo_price": 24.99,  # Original: 13.99 + 12.49 + 3.99 = 30.47
                "image_url": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500",
                "category": "Pasta",
                "items": [
                    ("Creamy Alfredo Pasta", 1),
                    ("Spaghetti Bolognese", 1),
                    ("Fresh Lemonade", 1)
                ]
            },
            {
                "name": "Sushi Deluxe Combo",
                "description": "Dragon Roll + Rainbow Roll + Salmon Nigiri (4 pcs) + Mango Smoothie",
                "combo_price": 44.99,  # Original: 16.99 + 18.99 + 10.99 + 5.49 = 52.46
                "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
                "category": "Sushi",
                "items": [
                    ("Dragon Roll", 1),
                    ("Rainbow Roll", 1),
                    ("Salmon Nigiri (4 pcs)", 1),
                    ("Mango Smoothie", 1)
                ]
            },
            {
                "name": "Pizza Duo Deal",
                "description": "Pepperoni Supreme + BBQ Chicken Pizza + Fresh Lemonade",
                "combo_price": 32.99,  # Original: 14.99 + 15.99 + 3.99 = 34.97
                "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
                "category": "Pizza",
                "items": [
                    ("Pepperoni Supreme", 1),
                    ("BBQ Chicken Pizza", 1),
                    ("Fresh Lemonade", 1)
                ]
            },
            {
                "name": "Dessert Dream Combo",
                "description": "Chocolate Lava Cake + New York Cheesecake + Tiramisu + Mango Smoothie",
                "combo_price": 28.99,  # Original: 7.99 + 6.99 + 8.49 + 5.49 = 28.96
                "image_url": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
                "category": "Desserts",
                "items": [
                    ("Chocolate Lava Cake", 1),
                    ("New York Cheesecake", 1),
                    ("Tiramisu", 1),
                    ("Mango Smoothie", 1)
                ]
            }
        ]

        for combo_data in combos_data:
            combo = ComboDeal(
                name=combo_data["name"],
                description=combo_data["description"],
                combo_price=combo_data["combo_price"],
                image_url=combo_data["image_url"],
                category=combo_data.get("category", "Mixed")
            )
            db.session.add(combo)
            db.session.flush()  # Get combo ID
            
            for item_name, qty in combo_data["items"]:
                if item_name in items:
                    combo_item = ComboDealItem(
                        combo_deal_id=combo.id,
                        menu_item_id=items[item_name].id,
                        quantity=qty
                    )
                    db.session.add(combo_item)
        
        db.session.commit()
        print(f"Successfully added {len(combos_data)} combo deals!")

if __name__ == '__main__':
    seed_combos()

