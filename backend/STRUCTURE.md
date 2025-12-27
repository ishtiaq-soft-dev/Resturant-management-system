# Project Structure

This project follows a factory pattern with organized folder structure.

## Backend Structure

```
backend/
├── app.py                     # ✅ Application entry point (ONLY FILE IN ROOT)
├── src/
│   ├── extension/
│   │   ├── __init__.py
│   │   └── db.py              # Database extensions (SQLAlchemy, LoginManager, Bcrypt, JWT)
│   ├── routes/
│   │   ├── __init__.py        # Registers all blueprints
│   │   ├── utils.py           # Shared utility functions (file uploads)
│   │   ├── auth.py            # Authentication routes
│   │   ├── menu.py            # Menu item routes
│   │   ├── orders.py          # Order routes
│   │   ├── reviews.py         # Review routes
│   │   ├── reservations.py    # Reservation routes
│   │   ├── coupons.py         # Coupon routes
│   │   ├── combos.py          # Combo deal routes
│   │   ├── categories.py      # Category routes
│   │   ├── admin.py           # Admin routes
│   │   └── uploads.py         # File upload routes
│   ├── models/
│   │   ├── __init__.py        # Exports all models
│   │   ├── user.py
│   │   ├── menu_item.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── reservation.py
│   │   ├── review.py
│   │   ├── coupon.py
│   │   ├── combo_deal.py
│   │   ├── combo_deal_item.py
│   │   └── category.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user_schema.py     # Marshmallow schemas for User
│   │   └── menu_schema.py     # Marshmallow schemas for MenuItem
│   ├── scripts/
│   │   ├── __init__.py
│   │   ├── seed_data.py       # Seed menu items and coupons
│   │   ├── seed_categories.py # Seed categories
│   │   ├── seed_combos.py     # Seed combo deals
│   │   ├── create_db.py       # Create MySQL database
│   │   └── fix_db.py          # Database migration/fix script
│   ├── uploads/               # ✅ Uploaded images (in src/)
│   └── __init__.py            # Application factory
├── instance/
│   └── site.db               # SQLite database
└── requirements.txt
```

## Frontend Structure

```
frontend/src/
├── components/
│   ├── common/
│   │   └── Loading.jsx       # Reusable loading component
│   ├── admin/                # Admin components (future)
│   └── menu/                 # Menu components (future)
├── services/
│   └── api/
│       ├── api.js            # Centralized API instance
│       ├── auth.js           # Auth API service
│       └── menu.js           # Menu API service
├── hooks/
│   └── useApi.js             # Custom API hook
├── utils/
│   └── lazyLoad.js           # Lazy loading utilities
├── routing/                  # Route configuration (future)
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── pages/                    # All pages (lazy loaded)
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Menu.jsx
│   ├── MenuItemDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderTracking.jsx
│   ├── Reservations.jsx
│   ├── Deals.jsx
│   ├── ComboDetail.jsx
│   ├── Reviews.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminMenu.jsx
│       ├── AdminOrders.jsx
│       ├── AdminUsers.jsx
│       ├── AdminReservations.jsx
│       └── AdminCategories.jsx
├── App.jsx                   # Main app component
└── main.jsx                  # Entry point
```

## Key Features

1. **Factory Pattern**: Application is created using `create_app()` function
2. **Separated Routes**: Each feature has its own route file
3. **Separated Models**: Each model is in its own file
4. **Extension Management**: All Flask extensions are managed in `extension/db.py`
5. **Schemas**: Marshmallow schemas for validation/serialization (optional)
6. **Scripts**: All utility scripts organized in `src/scripts/`
7. **Uploads**: Upload folder in `src/uploads/` following factory pattern

## Running the Application

```bash
# Backend
python app.py

# Frontend
npm run dev
```

## Seed Scripts

All scripts are in `src/scripts/`:

```bash
# Seed menu items, coupons, users, and reviews
python -m src.scripts.seed_data

# Seed categories
python -m src.scripts.seed_categories

# Seed combo deals
python -m src.scripts.seed_combos
```

## Performance Optimizations

- **Code Splitting**: All routes lazy loaded
- **React.memo()**: Components memoized to prevent re-renders
- **Dynamic Imports**: SweetAlert2 loaded on demand
- **Centralized API**: Single axios instance with interceptors
- **Vite Optimizations**: Manual chunks and code splitting

## Import Examples

```python
# Backend - From models
from src.models import User, MenuItem, Order

# Backend - From extensions
from src.extension.db import db, bcrypt

# Backend - Create app
from src import create_app
app = create_app()
```

```javascript
// Frontend - From services
import { menuService } from '../services/api/menu';
import api from '../services/api/api';

// Frontend - Lazy loaded components
import { Menu, AdminDashboard } from '../utils/lazyLoad';
```
