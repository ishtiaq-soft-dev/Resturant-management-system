# 🍽️ Restaurant Management System

A comprehensive full-stack restaurant management system built with React and Flask, featuring role-based access control, menu management, order processing, reservations, and analytics.

## ✨ Features

### 👥 User Features
- **User Authentication**: Secure registration and login system
- **Menu Browsing**: Browse menu items organized by categories
- **Shopping Cart**: Add items to cart and manage quantities
- **Deals & Combos**: View and purchase combo deals
- **Order Tracking**: Track order status in real-time
- **Reservations**: Make table reservations
- **Reviews**: Leave reviews and ratings for menu items
- **Responsive Design**: Fully responsive design for all devices

### 👨‍💼 Admin Features
- **Dashboard**: Comprehensive admin dashboard with analytics
- **Menu Management**: Add, edit, delete menu items with image uploads
- **Category Management**: Create and manage food categories
- **Order Management**: View and manage customer orders
- **User Management**: View and manage user accounts
- **Reservation Management**: Manage table reservations
- **Sales Analytics**: View sales charts (daily, weekly, monthly, yearly)
- **Image Upload**: Upload and manage menu item images

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **SweetAlert2** - Beautiful alerts and modals
- **Recharts** - Data visualization for analytics
- **Vite** - Build tool and dev server

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-Login** - User session management
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Bcrypt** - Password hashing
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Database (can be easily switched to PostgreSQL/MySQL)

## 📁 Project Structure

```
restaurant-management-system/
├── backend/
│   ├── app.py                 # Application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── instance/
│   │   └── site.db           # SQLite database
│   ├── uploads/              # Uploaded images
│   └── src/
│       ├── __init__.py       # Application factory
│       ├── extension/        # Flask extensions
│       │   └── db.py
│       ├── models/           # Database models
│       │   ├── user.py
│       │   ├── menu_item.py
│       │   ├── category.py
│       │   ├── order.py
│       │   └── ...
│       ├── routes/           # API routes (blueprints)
│       │   ├── auth.py
│       │   ├── menu.py
│       │   ├── orders.py
│       │   └── ...
│       ├── schemas/          # Data schemas
│       └── scripts/          # Utility scripts
│           ├── create_db.py
│           ├── seed_data.py
│           └── ...
│
└── frontend/
    ├── package.json          # Node dependencies
    ├── vite.config.js        # Vite configuration
    └── src/
        ├── App.jsx           # Main app component
        ├── main.jsx          # Entry point
        ├── index.css        # Global styles
        ├── components/      # React components
        │   ├── admin/
        │   ├── common/
        │   └── menu/
        ├── pages/           # Page components
        ├── context/         # React contexts
        ├── services/        # API services
        ├── hooks/           # Custom hooks
        └── utils/           # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize database**
   ```bash
   python -m src.scripts.create_db
   python -m src.scripts.seed_categories
   python -m src.scripts.seed_data
   python -m src.scripts.seed_combos
   ```

6. **Run the server**
   ```bash
   python app.py
   ```
   The backend will run on `http://127.0.0.1:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔐 Default Admin Credentials

After seeding the database, you can register a new admin account or use the seeded admin:
- **Email**: admin@restaurant.com
- **Password**: admin123

**Note**: Make sure to change the default password in production!

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/<id>` - Get menu item by ID
- `POST /api/admin/menu` - Create menu item (Admin only)
- `PUT /api/admin/menu/<id>` - Update menu item (Admin only)
- `DELETE /api/admin/menu/<id>` - Delete menu item (Admin only)

### Categories
- `GET /api/categories` - Get all active categories
- `GET /api/admin/categories` - Get all categories (Admin only)
- `POST /api/admin/categories` - Create category (Admin only)
- `PUT /api/admin/categories/<id>` - Update category (Admin only)
- `DELETE /api/admin/categories/<id>` - Delete category (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/admin/orders` - Get all orders (Admin only)
- `PUT /api/admin/orders/<id>` - Update order status (Admin only)

### Analytics
- `GET /api/admin/analytics/sales` - Get sales data (Admin only)
- `GET /api/admin/analytics/stats` - Get dashboard stats (Admin only)

## 🎨 Features in Detail

### Menu Management
- Add menu items with images, categories, prices, and descriptions
- Edit existing menu items
- Delete menu items (with cascade delete for related data)
- Toggle item availability
- Organize items by categories

### Category Management
- Create custom categories
- Edit category details
- Activate/deactivate categories
- Delete unused categories

### Order Processing
- Customers can place orders
- Admin can view all orders
- Order status tracking
- Order history

### Analytics Dashboard
- Sales charts (Line, Bar, Area)
- Daily, weekly, monthly, yearly views
- Total sales, orders, users statistics
- Average sales calculations

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Customer/Admin)
- CORS configuration
- Input validation
- SQL injection prevention (SQLAlchemy ORM)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Performance Optimizations

- Lazy loading of components
- Code splitting
- React.memo for component memoization
- useCallback and useMemo hooks
- Optimized image handling
- Efficient API calls

## 📦 Building for Production

### Backend
The Flask app is ready for production deployment. Consider using:
- Gunicorn or uWSGI for production server
- PostgreSQL or MySQL for production database
- Environment variables for configuration

### Frontend
```bash
cd frontend
npm run build
```
The build output will be in `frontend/dist/`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ishtiaq Soft Dev**
- GitHub: [@ishtiaq-soft-dev](https://github.com/ishtiaq-soft-dev)

## 🙏 Acknowledgments

- Flask community
- React community
- All open-source contributors

## 📞 Support

For support, email support@restaurant.com or create an issue in the repository.

---

Made with ❤️ using React and Flask

