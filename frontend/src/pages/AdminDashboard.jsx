import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api/api";
import SalesChart from "../components/admin/SalesChart";
import Loading from "../components/common/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/analytics/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    padding: "2rem",
    borderRadius: "15px",
    background: "white",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    flex: "1",
    minWidth: "250px",
    border: "2px solid transparent",
  };

  const statCardStyle = {
    padding: "1.5rem",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    minWidth: "200px",
  };

  const containerStyle = {
    padding: "2rem 1rem",
    maxWidth: "1400px",
    margin: "0 auto",
    minHeight: "100vh",
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Show message if no stats available
  if (!stats) {
    return (
      <div style={containerStyle}>
        <h1
          style={{
            marginBottom: "2rem",
            fontSize: "2.5rem",
            fontWeight: "900",
            color: "var(--primary-color)",
          }}
        >
          Admin Dashboard
        </h1>
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "white",
            borderRadius: "15px",
          }}
        >
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            No statistics available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1
        style={{
          marginBottom: "2rem",
          fontSize: "2.5rem",
          fontWeight: "900",
          color: "var(--primary-color)",
        }}
      >
        Admin Dashboard
      </h1>

      {/* Quick Stats */}
      {stats && (
        <div
          className="admin-dashboard-stats"
          style={{
            marginBottom: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              ...statCardStyle,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                opacity: 0.9,
                fontSize: "0.9rem",
              }}
            >
              Today's Sales
            </p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
              ${stats.today.sales.toFixed(2)}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              {stats.today.orders} orders
            </p>
          </div>
          <div
            style={{
              ...statCardStyle,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                opacity: 0.9,
                fontSize: "0.9rem",
              }}
            >
              This Week
            </p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
              ${stats.week.sales.toFixed(2)}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              {stats.week.orders} orders
            </p>
          </div>
          <div
            style={{
              ...statCardStyle,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                opacity: 0.9,
                fontSize: "0.9rem",
              }}
            >
              This Month
            </p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
              ${stats.month.sales.toFixed(2)}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              {stats.month.orders} orders
            </p>
          </div>
          <div
            style={{
              ...statCardStyle,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                opacity: 0.9,
                fontSize: "0.9rem",
              }}
            >
              Total Sales
            </p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
              ${stats.total.sales.toFixed(2)}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              {stats.total.orders} total orders
            </p>
          </div>
          <div
            style={{
              ...statCardStyle,
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                opacity: 0.9,
                fontSize: "0.9rem",
              }}
            >
              Total Users
            </p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
              {stats.total.users}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              {stats.total.menu_items} menu items
            </p>
          </div>
          <div
            style={{
              ...statCardStyle,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
              color: "white",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                opacity: 0.9,
                fontSize: "0.9rem",
              }}
            >
              Pending Orders
            </p>
            <h2 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>
              {stats.total.pending_orders}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              Require attention
            </p>
          </div>
        </div>
      )}

      {/* Sales Charts */}
      <SalesChart />

      {/* Management Cards */}
      <h2
        style={{
          marginBottom: "1.5rem",
          fontSize: "2rem",
          fontWeight: "700",
          color: "var(--dark-color)",
        }}
      >
        Quick Actions
      </h2>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <Link
          to="/admin/menu"
          style={{
            textDecoration: "none",
            color: "inherit",
            flex: "1",
            minWidth: "250px",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 15px 30px rgba(211, 47, 47, 0.2)";
              e.currentTarget.style.borderColor = "var(--primary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
            <h2
              style={{ color: "var(--primary-color)", marginBottom: "0.5rem" }}
            >
              Manage Menu
            </h2>
            <p style={{ color: "#666", margin: 0 }}>
              Add, edit, or remove menu items
            </p>
          </div>
        </Link>
        <Link
          to="/admin/orders"
          style={{
            textDecoration: "none",
            color: "inherit",
            flex: "1",
            minWidth: "250px",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 15px 30px rgba(255, 152, 0, 0.2)";
              e.currentTarget.style.borderColor = "var(--secondary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
            <h2
              style={{
                color: "var(--secondary-color)",
                marginBottom: "0.5rem",
              }}
            >
              Manage Orders
            </h2>
            <p style={{ color: "#666", margin: 0 }}>
              Accept, deny, and update order status
            </p>
          </div>
        </Link>
        <Link
          to="/admin/users"
          style={{
            textDecoration: "none",
            color: "inherit",
            flex: "1",
            minWidth: "250px",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 15px 30px rgba(156, 39, 176, 0.2)";
              e.currentTarget.style.borderColor = "#9C27B0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
            <h2 style={{ color: "#9C27B0", marginBottom: "0.5rem" }}>
              Manage Users
            </h2>
            <p style={{ color: "#666", margin: 0 }}>
              Promote or demote users to admin
            </p>
          </div>
        </Link>
        <Link
          to="/admin/reservations"
          style={{
            textDecoration: "none",
            color: "inherit",
            flex: "1",
            minWidth: "250px",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 15px 30px rgba(76, 175, 80, 0.2)";
              e.currentTarget.style.borderColor = "#4CAF50";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
            <h2 style={{ color: "#4CAF50", marginBottom: "0.5rem" }}>
              Manage Reservations
            </h2>
            <p style={{ color: "#666", margin: 0 }}>
              View upcoming table bookings
            </p>
          </div>
        </Link>
        <Link
          to="/admin/categories"
          style={{
            textDecoration: "none",
            color: "inherit",
            flex: "1",
            minWidth: "250px",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow =
                "0 15px 30px rgba(255, 152, 0, 0.2)";
              e.currentTarget.style.borderColor = "#FF9800";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏷️</div>
            <h2 style={{ color: "#FF9800", marginBottom: "0.5rem" }}>
              Manage Categories
            </h2>
            <p style={{ color: "#666", margin: 0 }}>
              Add, edit, or remove food categories
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
