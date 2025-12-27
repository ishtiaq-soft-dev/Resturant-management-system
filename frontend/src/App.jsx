import { Suspense, lazy, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Loading from "./components/common/Loading";
import Logo from "./components/common/Logo";
import {
  Home,
  Login,
  Register,
  Menu,
  Cart,
  Checkout,
  OrderTracking,
  Reservations,
  MenuItemDetail,
  Deals,
  ComboDetail,
  Reviews,
  AdminDashboard,
  AdminMenu,
  AdminOrders,
  AdminUsers,
  AdminReservations,
  AdminCategories,
} from "./utils/lazyLoad";

const Navbar = memo(() => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const navStyle = {
    padding: "1rem 2rem",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
    borderBottom: "1px solid rgba(211, 47, 47, 0.1)",
  };

  const navLinkBase = {
    color: "var(--dark-color)",
    fontWeight: "600",
    transition: "all var(--transition-base)",
    fontSize: "1rem",
    textDecoration: "none",
    borderBottom: "3px solid transparent",
    paddingBottom: "8px",
    position: "relative",
  };

  const linkStyle = ({ isActive }) => ({
    ...navLinkBase,
    color: isActive ? "var(--primary-color)" : "var(--dark-color)",
    fontWeight: isActive ? "700" : "600",
    borderBottom: isActive
      ? "3px solid var(--primary-color)"
      : "3px solid transparent",
    transform: isActive ? "translateY(-2px)" : "translateY(0)",
  });

  const btnStyle = {
    background: "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)",
    color: "white",
    padding: "0.6rem 1.8rem",
    borderRadius: "var(--radius-full)",
    fontWeight: "700",
    transition: "all var(--transition-base)",
    marginLeft: "10px",
    boxShadow: "0 4px 15px rgba(211, 47, 47, 0.3)",
    border: "none",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <Logo size="medium" showText={true} color="primary" />

        {/* Auth Links on the Left as requested */}
        {!user ? (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Link to="/login" style={navLinkBase}>
              Login
            </Link>
            <Link to="/register" style={btnStyle}>
              Register
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <span
              style={{ fontWeight: "bold", color: "var(--secondary-color)" }}
            >
              Hi, {user.username}
            </span>
            <button
              onClick={logout}
              style={{
                ...navLinkBase,
                background: "none",
                cursor: "pointer",
                border: "1px solid var(--dark-color)",
                padding: "5px 15px",
                borderRadius: "15px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        {user && user.role === "admin" ? (
          // Admin-only navigation
          <>
            <NavLink to="/admin" style={linkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/menu" style={linkStyle}>
              Menu
            </NavLink>
            <NavLink to="/admin/orders" style={linkStyle}>
              Orders
            </NavLink>
            <NavLink to="/admin/users" style={linkStyle}>
              Users
            </NavLink>
            <NavLink to="/admin/reservations" style={linkStyle}>
              Reservations
            </NavLink>
            <NavLink to="/admin/categories" style={linkStyle}>
              Categories
            </NavLink>
          </>
        ) : (
          // Customer navigation
          <>
            <NavLink to="/menu" style={linkStyle}>
              Menu
            </NavLink>
            <NavLink to="/deals" style={linkStyle}>
              Deals
            </NavLink>
            <NavLink to="/reviews" style={linkStyle}>
              Reviews
            </NavLink>
            <NavLink to="/reservations" style={linkStyle}>
              Reservations
            </NavLink>
            {user && (
              <NavLink to="/tracking" style={linkStyle}>
                Orders
              </NavLink>
            )}
            <NavLink to="/cart" style={linkStyle}>
              Cart
              <span
                style={{
                  background: "var(--secondary-color)",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 8px",
                  fontSize: "0.8rem",
                  marginLeft: "5px",
                }}
              >
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
});

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<MenuItemDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/tracking" element={<OrderTracking />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/deals/:id" element={<ComboDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route
                path="/admin/reservations"
                element={<AdminReservations />}
              />
              <Route path="/admin/categories" element={<AdminCategories />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
