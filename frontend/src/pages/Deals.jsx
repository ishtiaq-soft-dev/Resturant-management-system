import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api/api";
import { useCart } from "../context/CartContext";
import Loading from "../components/common/Loading";

const Deals = memo(() => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const res = await api.get("/combos");
        setCombos(res.data);
      } catch (err) {
        console.error("Failed to fetch combos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  const handleAddCombo = useCallback(
    async (combo) => {
      // Add all items in the combo to cart
      combo.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image_url: item.image_url,
            isComboItem: true,
            comboName: combo.name,
          });
        }
      });
      // Dynamic import for SweetAlert2
      const { default: Swal } = await import("sweetalert2");
      Swal.fire({
        title: "Combo Added!",
        text: `Added ${combo.name}. You saved $${combo.savings.toFixed(2)}!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    },
    [addToCart]
  );

  // Get unique categories from combos
  const categories = useMemo(
    () => ["All", ...new Set(combos.map((combo) => combo.category || "Mixed"))],
    [combos]
  );

  // Filter combos by selected category
  const filteredCombos = useMemo(
    () =>
      selectedCategory === "All"
        ? combos
        : combos.filter(
            (combo) => (combo.category || "Mixed") === selectedCategory
          ),
    [combos, selectedCategory]
  );

  if (loading) {
    return <Loading message="Loading deals..." />;
  }

  return (
    <div
      style={{
        padding: "60px",
        background: "linear-gradient(135deg, var(--light-color) 0%, #fff 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            textAlign: "center",
            color: "var(--primary-color)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            marginBottom: "1rem",
            fontFamily: "var(--font-heading)",
            fontWeight: "800",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          🎉 Combo Deals
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--dark-light)",
            fontSize: "1.2rem",
            marginBottom: "0",
            fontWeight: "400",
          }}
        >
          Bundle up and save big! These combos give you more for less 💰
        </p>
      </div>

      {/* Category Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px 25px",
              borderRadius: "25px",
              border: "none",
              background:
                selectedCategory === cat ? "var(--primary-color)" : "white",
              color: selectedCategory === cat ? "white" : "var(--dark-color)",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Coupon Codes Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "50px",
          flexWrap: "wrap",
        }}
      >
        {[
          { code: "WELCOME20", discount: "20% OFF", desc: "First order" },
          { code: "FOODIE10", discount: "10% OFF", desc: "All orders" },
          { code: "HOLIDAY25", discount: "25% OFF", desc: "Limited time" },
        ].map((coupon) => (
          <div
            key={coupon.code}
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "20px 30px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              border: "2px dashed var(--secondary-color)",
              minWidth: "180px",
            }}
          >
            <p
              style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "var(--primary-color)",
                margin: "0 0 5px 0",
              }}
            >
              {coupon.discount}
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#777",
                margin: "0 0 10px 0",
              }}
            >
              {coupon.desc}
            </p>
            <code
              style={{
                background: "var(--light-color)",
                padding: "6px 12px",
                borderRadius: "8px",
                fontWeight: "bold",
                color: "var(--dark-color)",
              }}
            >
              {coupon.code}
            </code>
          </div>
        ))}
      </div>

      {/* Combo Deals Grid */}
      <div
        className="deals-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {filteredCombos.map((combo) => (
          <div
            key={combo.id}
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* Savings Badge */}
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "var(--primary-color)",
                color: "white",
                padding: "8px 15px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                zIndex: 10,
              }}
            >
              Save ${combo.savings.toFixed(2)}
            </div>

            <Link
              to={`/deals/${combo.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={combo.image_url}
                alt={combo.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />

              <div style={{ padding: "25px 25px 0 25px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h2 style={{ margin: 0, color: "var(--dark-color)" }}>
                    {combo.name}
                  </h2>
                  {combo.category && (
                    <span
                      style={{
                        background: "var(--secondary-color)",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                      }}
                    >
                      {combo.category}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    color: "#777",
                    fontSize: "0.95rem",
                    marginBottom: "20px",
                  }}
                >
                  {combo.description}
                </p>
              </div>
            </Link>

            <div style={{ padding: "0 25px 25px 25px" }}>
              {/* Items in Combo */}
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "var(--dark-color)",
                    marginBottom: "10px",
                  }}
                >
                  Includes:
                </p>
                {combo.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                      padding: "8px",
                      background: "var(--light-color)",
                      borderRadius: "8px",
                    }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <span style={{ flex: 1, fontWeight: "500" }}>
                      {item.quantity > 1 ? `${item.quantity}x ` : ""}
                      {item.name}
                    </span>
                    <span
                      style={{
                        color: "#999",
                        textDecoration: "line-through",
                        fontSize: "0.9rem",
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#999",
                      textDecoration: "line-through",
                      fontSize: "1rem",
                      marginRight: "10px",
                    }}
                  >
                    ${combo.original_price.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "var(--primary-color)",
                    }}
                  >
                    ${combo.combo_price.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAddCombo(combo)}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "var(--primary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 5px 20px rgba(211, 47, 47, 0.3)",
                }}
              >
                Add Combo to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCombos.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", fontSize: "1.2rem" }}>
          {combos.length === 0
            ? "No combo deals available at the moment."
            : `No combo deals found in the "${selectedCategory}" category.`}
        </p>
      )}
    </div>
  );
});

export default Deals;
