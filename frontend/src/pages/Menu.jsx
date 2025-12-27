import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { menuService } from "../services/api/menu";
import { useCart } from "../context/CartContext";
import Loading from "../components/common/Loading";
import { lazy } from "react";

// Lazy load SweetAlert2
const Swal = lazy(() =>
  import("sweetalert2").then((module) => ({ default: module.default }))
);

const Menu = memo(() => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuService.getAll();
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = useCallback(
    async (item) => {
      addToCart(item);
      // Dynamic import for SweetAlert2
      const { default: Swal } = await import("sweetalert2");
      Swal.fire({
        title: "Added!",
        text: `${item.name} has been added to your cart.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    },
    [addToCart]
  );

  const categories = useMemo(
    () => ["All", ...new Set(items.map((item) => item.category))],
    [items]
  );
  const filteredItems = useMemo(
    () =>
      selectedCategory === "All"
        ? items
        : items.filter((item) => item.category === selectedCategory),
    [items, selectedCategory]
  );

  if (loading) {
    return <Loading message="Loading menu..." />;
  }

  const cardStyle = {
    background: "white",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    boxShadow: "var(--shadow-md)",
    transition: "all var(--transition-base)",
    cursor: "pointer",
    border: "1px solid rgba(211, 47, 47, 0.1)",
  };

  const cardHoverStyle = {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "var(--shadow-xl)",
    borderColor: "var(--primary-color)",
  };

  return (
    <div
      style={{
        padding: "3rem 2rem",
        background: "transparent",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--primary-color)",
            marginBottom: "1rem",
            fontFamily: "var(--font-heading)",
            fontWeight: "800",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Our Delicious Menu
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--dark-light)",
            marginBottom: "0",
            fontSize: "1.2rem",
            fontWeight: "400",
          }}
        >
          Handcrafted with love, served with passion ✨
        </p>
      </div>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "3rem",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-full)",
              border: selectedCategory === cat ? "none" : "2px solid var(--gray-medium)",
              background: selectedCategory === cat
                ? "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)"
                : "white",
              color: selectedCategory === cat ? "white" : "var(--dark-color)",
              fontWeight: selectedCategory === cat ? "700" : "600",
              boxShadow: selectedCategory === cat
                ? "0 4px 15px rgba(211, 47, 47, 0.3)"
                : "var(--shadow-sm)",
              cursor: "pointer",
              transition: "all var(--transition-base)",
              fontSize: "0.95rem",
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div
        className="menu-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={cardStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, cardHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, cardStyle)
            }
          >
            <Link
              to={`/menu/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
              )}
              <div style={{ padding: "20px 20px 0 20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: 0, color: "var(--dark-color)" }}>
                    {item.name}
                  </h3>
                  {item.is_deal && (
                    <span
                      style={{
                        background: "var(--accent-color)",
                        color: "var(--dark-color)",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      DEAL
                    </span>
                  )}
                </div>
                <p
                  style={{
                    color: "#777",
                    fontSize: "0.9rem",
                    margin: "10px 0",
                    minHeight: "40px",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </Link>
            <div style={{ padding: "0 20px 20px 20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    color: "var(--primary-color)",
                    margin: 0,
                  }}
                >
                  ${item.price.toFixed(2)}
                </p>
                 <button
                   onClick={() => handleAddToCart(item)}
                   style={{
                     padding: "0.75rem 1.5rem",
                     background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--secondary-dark) 100%)",
                     color: "white",
                     borderRadius: "var(--radius-full)",
                     fontWeight: "700",
                     border: "none",
                     cursor: "pointer",
                     transition: "all var(--transition-base)",
                     boxShadow: "0 4px 15px rgba(255, 152, 0, 0.3)",
                     fontSize: "0.9rem",
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "scale(1.05)";
                     e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 152, 0, 0.4)";
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "scale(1)";
                     e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 152, 0, 0.3)";
                   }}
                 >
                   🛒 Add to Cart
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Menu;
