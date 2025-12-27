"""
Seed script to populate the database with delicious menu items and coupons.
"""
from datetime import datetime, timedelta
from src import create_app
from src.extension.db import db
from src.models import MenuItem, Coupon, User, Review

app = create_app()

MENU_ITEMS = [
    # Burgers
    {
        "name": "Classic Smash Burger",
        "description": "Juicy beef patty with American cheese, pickles, onions, and our secret sauce.",
        "price": 9.99,
        "category": "Burgers",
        "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        "is_deal": False
    },
    {
        "name": "BBQ Bacon Burger",
        "description": "Smoky BBQ sauce, crispy bacon, cheddar cheese, and onion rings.",
        "price": 12.99,
        "category": "Burgers",
        "image_url": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500",
        "is_deal": True
    },
    {
        "name": "Mushroom Swiss Burger",
        "description": "Sauteed mushrooms, melted Swiss cheese, and garlic aioli.",
        "price": 11.49,
        "category": "Burgers",
        "image_url": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500",
        "is_deal": False
    },
    # Pizza
    {
        "name": "Pepperoni Supreme",
        "description": "Loaded with premium pepperoni, mozzarella, and our signature tomato sauce.",
        "price": 14.99,
        "category": "Pizza",
        "image_url": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
        "is_deal": False
    },
    {
        "name": "Margherita Pizza",
        "description": "Fresh basil, buffalo mozzarella, and San Marzano tomatoes.",
        "price": 12.99,
        "category": "Pizza",
        "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        "is_deal": False
    },
    {
        "name": "BBQ Chicken Pizza",
        "description": "Grilled chicken, red onions, cilantro, and tangy BBQ sauce.",
        "price": 15.99,
        "category": "Pizza",
        "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
        "is_deal": True
    },
    # Pasta
    {
        "name": "Creamy Alfredo Pasta",
        "description": "Fettuccine in rich, creamy parmesan sauce with grilled chicken.",
        "price": 13.99,
        "category": "Pasta",
        "image_url": "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500",
        "is_deal": False
    },
    {
        "name": "Spaghetti Bolognese",
        "description": "Classic Italian meat sauce slow-cooked with fresh herbs.",
        "price": 12.49,
        "category": "Pasta",
        "image_url": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
        "is_deal": False
    },
    # Sushi
    {
        "name": "Dragon Roll",
        "description": "Eel, cucumber, avocado topped with spicy mayo and eel sauce.",
        "price": 16.99,
        "category": "Sushi",
        "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
        "is_deal": False
    },
    {
        "name": "Rainbow Roll",
        "description": "California roll topped with assorted fresh sashimi.",
        "price": 18.99,
        "category": "Sushi",
        "image_url": "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500",
        "is_deal": True
    },
    {
        "name": "Salmon Nigiri (4 pcs)",
        "description": "Fresh Atlantic salmon over seasoned sushi rice.",
        "price": 10.99,
        "category": "Sushi",
        "image_url": "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500",
        "is_deal": False
    },
    # Desserts
    {
        "name": "Chocolate Lava Cake",
        "description": "Warm, gooey chocolate center with vanilla ice cream.",
        "price": 7.99,
        "category": "Desserts",
        "image_url": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
        "is_deal": False
    },
    {
        "name": "New York Cheesecake",
        "description": "Creamy classic cheesecake with strawberry drizzle.",
        "price": 6.99,
        "category": "Desserts",
        "image_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500",
        "is_deal": False
    },
    {
        "name": "Tiramisu",
        "description": "Layers of espresso-soaked ladyfingers and mascarpone cream.",
        "price": 8.49,
        "category": "Desserts",
        "image_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
        "is_deal": False
    },
    # Drinks
    {
        "name": "Fresh Lemonade",
        "description": "Refreshing homemade lemonade with a hint of mint.",
        "price": 3.99,
        "category": "Drinks",
        "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
        "is_deal": False
    },
    {
        "name": "Mango Smoothie",
        "description": "Tropical mango blended with yogurt and honey.",
        "price": 5.49,
        "category": "Drinks",
        "image_url": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500",
        "is_deal": True
    }
]

COUPONS = [
    {
        "code": "WELCOME20",
        "discount_percent": 20.0,
        "valid_until": datetime.utcnow() + timedelta(days=30),
        "usage_limit": 100
    },
    {
        "code": "FOODIE10",
        "discount_percent": 10.0,
        "valid_until": datetime.utcnow() + timedelta(days=60),
        "usage_limit": 500
    },
    {
        "code": "HOLIDAY25",
        "discount_percent": 25.0,
        "valid_until": datetime.utcnow() + timedelta(days=15),
        "usage_limit": 50
    },
    {
        "code": "BURGER15",
        "discount_percent": 15.0,
        "valid_until": datetime.utcnow() + timedelta(days=45),
        "usage_limit": 200
    }
]

def seed_menu():
    with app.app_context():
        # Clear existing data and recreate tables for schema updates
        db.drop_all()
        db.create_all()
        db.session.commit()

        from src.extension.db import bcrypt
        print("Cleared all existing data (Reviews, Reservations, Orders, Users, Combos, Menu Items).")

        # Add initial admin user
        admin = User(username='admin', email='admin@test.com', role='admin', address='Admin HQ')
        admin.password_hash = bcrypt.generate_password_hash('admin123').decode('utf-8')
        db.session.add(admin)
        db.session.commit()
        print("Initial Admin created (admin@test.com:admin123)")

        # Add new items
        for item_data in MENU_ITEMS:
            item = MenuItem(**item_data)
            db.session.add(item)
        
        db.session.commit()
        print(f"Successfully added {len(MENU_ITEMS)} menu items!")

        # Clear existing coupons
        Coupon.query.delete()
        db.session.commit()
        print("Cleared existing coupons.")

        # Add new coupons
        for coupon_data in COUPONS:
            coupon = Coupon(**coupon_data)
            db.session.add(coupon)
        
        db.session.commit()
        print(f"Successfully added {len(COUPONS)} coupons!")

        # Add dummy reviews
        dummy_users = [
            {'username': 'JaneDoe', 'email': 'jane@example.com', 'password': 'password123', 'address': '123 Maple St'},
            {'username': 'JohnSmith', 'email': 'john@example.com', 'password': 'password123', 'address': '456 Oak Ave'},
            {'username': 'AliceWonder', 'email': 'alice@example.com', 'password': 'password123', 'address': '789 Pine Ln'}
        ]
        
        seeded_users = []
        for u_data in dummy_users:
            u = User(username=u_data['username'], email=u_data['email'], address=u_data['address'])
            u.password_hash = bcrypt.generate_password_hash(u_data['password']).decode('utf-8')
            db.session.add(u)
            seeded_users.append(u)
        db.session.commit()

        # Get some menu items to review
        items = MenuItem.query.limit(5).all()
        review_comments = [
            "Absolutely delicious! The flavors were perfectly balanced.",
            "Great service and even better food. Will definitely order again.",
            "Good value for money. The portion size was generous.",
            "A bit too spicy for my taste, but still very high quality.",
            "The best I've had in a long time. Highly recommended!"
        ]

        import random
        for i, item in enumerate(items):
            for j in range(2): # 2 reviews per item
                user = random.choice(seeded_users)
                review = Review(
                    user_id=user.id,
                    menu_item_id=item.id,
                    rating=random.randint(4, 5),
                    comment=random.choice(review_comments)
                )
                db.session.add(review)
        
        db.session.commit()
        print("Successfully added dummy users and reviews!")

if __name__ == '__main__':
    seed_menu()

