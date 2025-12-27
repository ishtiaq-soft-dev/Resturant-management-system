import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { menuService } from "../services/api/menu";
import api from "../services/api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";

const MenuItemDetail = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await menuService.getAll();
        setAllItems(res.data);
        const foundItem = res.data.find((i) => i.id === parseInt(id));
        setItem(foundItem);
      } catch (err) {
        console.error("Failed to fetch menu item:", err);
      }
    };
    fetchItem();
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (!item) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    // Dynamic import for SweetAlert2
    const { default: Swal } = await import("sweetalert2");
    Swal.fire({
      title: "Added!",
      text: `${quantity}x ${item.name} has been added to your cart.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  }, [item, quantity, addToCart]);

  // Memoize suggestions to avoid recalculation
  const suggestions = useMemo(
    () =>
      allItems
        .filter((i) => item && i.category === item.category && i.id !== item.id)
        .slice(0, 3),
    [allItems, item]
  );

  const dealItems = useMemo(
    () =>
      allItems.filter((i) => item && i.is_deal && i.id !== item.id).slice(0, 3),
    [allItems, item]
  );

  const relatedDeals = useMemo(
    () =>
      allItems.filter(
        (i) =>
          item && i.is_deal && i.category === item.category && i.id !== item.id
      ),
    [allItems, item]
  );

  if (!item) {
    return <Loading message="Loading item details..." />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--light-color)",
      }}
    >
      {/* Left Side - Menu Grid (Background) */}
      <div
        style={{
          flex: "1",
          padding: "40px",
          overflowY: "auto",
        }}
      >
        <Link
          to="/menu"
          style={{
            color: "var(--primary-color)",
            fontWeight: "bold",
            marginBottom: "20px",
            display: "inline-block",
            fontSize: "1.1rem",
          }}
        >
          &lt;- Back to Menu
        </Link>

        <h2 style={{ color: "var(--dark-color)", marginBottom: "20px" }}>
          You Might Also Like
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {suggestions.map((sug) => (
            <Link
              key={sug.id}
              to={`/menu/${sug.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                }}
              >
                <img
                  src={sug.image_url}
                  alt={sug.name}
                  style={{ width: "100%", height: "120px", objectFit: "cover" }}
                />
                <div style={{ padding: "15px" }}>
                  <h4
                    style={{ margin: "0 0 5px 0", color: "var(--dark-color)" }}
                  >
                    {sug.name}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--primary-color)",
                      fontWeight: "bold",
                    }}
                  >
                    ${sug.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Deal Suggestions */}
        {dealItems.length > 0 && (
          <>
            <h2
              style={{
                color: "var(--primary-color)",
                marginTop: "40px",
                marginBottom: "20px",
              }}
            >
              Hot Deals For You
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {dealItems.map((deal) => (
                <Link
                  key={deal.id}
                  to={`/menu/${deal.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      transition: "transform 0.3s ease",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "var(--accent-color)",
                        color: "var(--dark-color)",
                        padding: "3px 10px",
                        borderRadius: "10px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      DEAL
                    </span>
                    <img
                      src={deal.image_url}
                      alt={deal.name}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ padding: "15px" }}>
                      <h4 style={{ margin: "0 0 5px 0", color: "white" }}>
                        {deal.name}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--accent-color)",
                          fontWeight: "bold",
                        }}
                      >
                        ${deal.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Side - Item Detail Panel */}
      <div
        style={{
          width: "400px",
          background: "white",
          boxShadow: "-5px 0 30px rgba(0,0,0,0.1)",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          height: "100vh",
          animation: "slideInRight 0.3s ease-out",
        }}
      >
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: "100%", height: "250px", objectFit: "cover" }}
        />
        <div style={{ padding: "25px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <h2 style={{ margin: 0, color: "var(--dark-color)" }}>
              {item.name}
            </h2>
            {item.is_deal && (
              <span
                style={{
                  background: "var(--accent-color)",
                  color: "var(--dark-color)",
                  padding: "4px 12px",
                  borderRadius: "15px",
                  fontWeight: "bold",
                  fontSize: "0.8rem",
                }}
              >
                HOT DEAL
              </span>
            )}
          </div>
          <p
            style={{
              color: "var(--secondary-color)",
              fontWeight: "bold",
              marginBottom: "15px",
            }}
          >
            {item.category}
          </p>
          <p style={{ color: "#666", lineHeight: "1.7", fontSize: "0.95rem" }}>
            {item.description}
          </p>

          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--primary-color)",
              margin: "25px 0",
            }}
          >
            ${item.price.toFixed(2)}
          </p>

          {/* Quantity Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontWeight: "bold", color: "var(--dark-color)" }}>
              Quantity:
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  border: "2px solid var(--dark-color)",
                  background: "white",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                -
              </button>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  minWidth: "25px",
                  textAlign: "center",
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  border: "2px solid var(--dark-color)",
                  background: "white",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
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
            Add to Cart - ${(item.price * quantity).toFixed(2)}
          </button>

          {/* Deal Suggestion Alert */}
          {relatedDeals.length > 0 && !item.is_deal && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                borderRadius: "12px",
                border: "2px solid var(--secondary-color)",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px 0",
                  fontWeight: "bold",
                  color: "var(--dark-color)",
                }}
              >
                Tip: Save more with deals!
              </p>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                Check out{" "}
                <Link
                  to="/deals"
                  style={{ color: "var(--primary-color)", fontWeight: "bold" }}
                >
                  our deals
                </Link>{" "}
                in {item.category}!
              </p>
            </div>
          )}

          {/* Reviews Section */}
          <div
            style={{
              marginTop: "40px",
              borderTop: "2px solid #eee",
              paddingTop: "20px",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>Customer Reviews</h3>
            <ReviewsList itemId={id} />
            <AddReview
              itemId={id}
              user={user}
              onReviewAdded={() => window.location.reload()}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

const ReviewsList = memo(({ itemId }) => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/menu/${itemId}/reviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [itemId]);

  return (
    <div style={{ display: "grid", gap: "15px" }}>
      {reviews.map((r, i) => (
        <div
          key={i}
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{r.user}</span>
            <span style={{ color: "#FFD700", letterSpacing: "2px" }}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
            {r.comment}
          </p>
        </div>
      ))}
      {reviews.length === 0 && (
        <p style={{ color: "#999", fontSize: "0.9rem" }}>No reviews yet.</p>
      )}
    </div>
  );
});

const AddReview = ({ itemId, user, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!user) {
    return (
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#666" }}>
          <Link
            to="/login"
            style={{ color: "var(--primary-color)", fontWeight: "bold" }}
          >
            Login
          </Link>{" "}
          to share your experience with this item.
        </p>
      </div>
    );
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await api.post(`/menu/${itemId}/reviews`, { rating, comment });
        const { default: Swal } = await import("sweetalert2");
        Swal.fire({
          title: "Review Added!",
          text: "Thank you for your feedback.",
          icon: "success",
          confirmButtonColor: "var(--secondary-color)",
        });
        setComment("");
        onReviewAdded();
      } catch (err) {
        const { default: Swal } = await import("sweetalert2");
        Swal.fire({
          title: "Failed",
          text: "Could not add review. Please make sure you are logged in.",
          icon: "error",
          confirmButtonColor: "var(--primary-color)",
        });
      }
    },
    [itemId, rating, comment, onReviewAdded]
  );

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h4 style={{ marginBottom: "10px" }}>Add a Review</h4>
      <select
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
      >
        {[5, 4, 3, 2, 1].map((num) => (
          <option key={num} value={num}>
            {num} Stars
          </option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          height: "80px",
          marginBottom: "10px",
          border: "1px solid #ddd",
        }}
      />
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          background: "var(--primary-color)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit Review
      </button>
    </form>
  );
};

export default MenuItemDetail;
