import React, { useState, useEffect } from "react";
import api from "../services/api/api";
import Swal from "sweetalert2";
import Loading from "../components/common/Loading";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    // Common input styles for consistency - ensure all fields have identical styling
    const inputStyle =
      "width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #ddd; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s ease; margin: 0; display: block; line-height: 1.5; min-height: 44px;";
    const labelStyle =
      "display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color); font-size: 0.95rem; width: 100%; text-align: left;";
    const fieldContainerStyle =
      "margin-bottom: 20px; width: 100%; display: block;";

    const { value: formValues } = await Swal.fire({
      title: "Add New Category",
      html:
        '<div style="text-align: left; width: 100%;">' +
        `<div style="${fieldContainerStyle}">
                    <label style="${labelStyle}">Category Name *</label>
                    <input id="swal-name" class="swal2-input" placeholder="Enter category name" style="${inputStyle}">
                </div>` +
        `<div style="${fieldContainerStyle}">
                    <label style="${labelStyle}">Description</label>
                    <textarea id="swal-description" class="swal2-textarea" placeholder="Enter item description" style="${inputStyle} min-height: 80px; resize: vertical;"></textarea>
                </div>` +
        "</div>",
      focusConfirm: false,
      width: window.innerWidth < 768 ? "90%" : "500px",
      customClass: {
        popup: "swal2-popup-responsive",
        container: "swal2-container-responsive",
      },
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const description = document
          .getElementById("swal-description")
          .value.trim();

        if (!name) {
          Swal.showValidationMessage("Please enter a category name");
          return false;
        }

        return { name, description };
      },
    });

    if (formValues) {
      try {
        await api.post("/admin/categories", formValues);
        Swal.fire("Success", "Category added successfully", "success");
        fetchCategories();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to add category";
        Swal.fire("Error", errorMsg, "error");
      }
    }
  };

  const handleEditCategory = async (category) => {
    // Common input styles for consistency - ensure all fields have identical styling
    const inputStyle =
      "width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #ddd; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s ease; margin: 0; display: block; line-height: 1.5; min-height: 44px;";
    const labelStyle =
      "display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color); font-size: 0.95rem; width: 100%; text-align: left;";
    const fieldContainerStyle =
      "margin-bottom: 20px; width: 100%; display: block;";

    const { value: formValues } = await Swal.fire({
      title: "Edit Category",
      html:
        '<div style="text-align: left; width: 100%;">' +
        `<div style="${fieldContainerStyle}">
                    <label style="${labelStyle}">Category Name *</label>
                    <input id="swal-name" class="swal2-input" placeholder="Enter category name" value="${category.name}" style="${inputStyle}">
                </div>` +
        `<div style="${fieldContainerStyle}">
                    <label style="${labelStyle}">Description</label>
                    <textarea id="swal-description" class="swal2-textarea" placeholder="Enter item description" style="${inputStyle} min-height: 80px; resize: vertical;">${
          category.description || ""
        }</textarea>
                </div>` +
        "</div>",
      focusConfirm: false,
      width: window.innerWidth < 768 ? "90%" : "500px",
      customClass: {
        popup: "swal2-popup-responsive",
        container: "swal2-container-responsive",
      },
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const description = document
          .getElementById("swal-description")
          .value.trim();

        if (!name) {
          Swal.showValidationMessage("Please enter a category name");
          return false;
        }

        return { name, description };
      },
    });

    if (formValues) {
      try {
        await api.put(`/admin/categories/${category.id}`, formValues);
        Swal.fire("Success", "Category updated successfully", "success");
        fetchCategories();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to update category";
        Swal.fire("Error", errorMsg, "error");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/categories/${id}`, { is_active: !currentStatus });
      Swal.fire("Success", "Category status updated", "success");
      fetchCategories();
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: category.is_active
        ? "This will deactivate the category. Menu items using this category will still be visible."
        : "This will permanently delete the category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/categories/${category.id}`);
        Swal.fire("Deleted!", "Category has been removed.", "success");
        fetchCategories();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to delete category";
        Swal.fire("Error", errorMsg, "error");
      }
    }
  };

  if (loading) {
    return <Loading message="Loading categories..." />;
  }

  return (
    <div
      style={{
        padding: "2rem 1rem",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: "900",
            color: "var(--primary-color)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Manage Categories
        </h1>
        <button
          onClick={handleAddCategory}
          style={{
            background:
              "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)",
            color: "white",
            padding: "0.8rem 1.5rem",
            borderRadius: "var(--radius-full)",
            border: "none",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "var(--shadow-lg)",
            transition: "all var(--transition-base)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "var(--shadow-xl)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          }}
        >
          ➕ Add New Category
        </button>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          border: "1px solid rgba(211, 47, 47, 0.1)",
        }}
      >
        {window.innerWidth < 768 ? (
          // Mobile Card View
          <div className="admin-menu-mobile" style={{ padding: "1rem" }}>
            {categories.map((category, index) => (
              <div
                key={category.id}
                style={{
                  background: index % 2 === 0 ? "white" : "var(--gray-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                  border: "1px solid var(--gray-medium)",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "var(--primary-color)",
                      fontSize: "1.3rem",
                    }}
                  >
                    {category.name}
                  </h3>
                  <p
                    style={{ margin: "0 0 1rem 0", color: "var(--gray-dark)" }}
                  >
                    {category.description || "No description"}
                  </p>
                  <span
                    style={{
                      padding: "0.3rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      background: category.is_active ? "#e8f5e9" : "#ffebee",
                      color: category.is_active ? "#2e7d32" : "#c62828",
                    }}
                  >
                    {category.is_active ? "✓ Active" : "✗ Inactive"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => handleEditCategory(category)}
                    style={{
                      flex: 1,
                      background: "var(--primary-color)",
                      color: "white",
                      border: "none",
                      padding: "0.6rem 1rem",
                      borderRadius: "var(--radius-md)",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleToggleStatus(category.id, category.is_active)
                    }
                    style={{
                      flex: 1,
                      background: "var(--secondary-color)",
                      color: "white",
                      border: "none",
                      padding: "0.6rem 1rem",
                      borderRadius: "var(--radius-md)",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    style={{
                      flex: 1,
                      background: "#ff4444",
                      color: "white",
                      border: "none",
                      padding: "0.6rem 1rem",
                      borderRadius: "var(--radius-md)",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <div className="admin-menu-desktop">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    borderBottom: "2px solid var(--primary-color)",
                  }}
                >
                  <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                    Name
                  </th>
                  <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                    Description
                  </th>
                  <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                    Status
                  </th>
                  <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.id}
                    style={{
                      borderBottom: "1px solid var(--gray-medium)",
                      background:
                        index % 2 === 0 ? "white" : "var(--gray-light)",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fff3e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        index % 2 === 0 ? "white" : "var(--gray-light)";
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                      }}
                    >
                      {category.name}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--gray-dark)" }}>
                      {category.description || "No description"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.3rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          background: category.is_active
                            ? "#e8f5e9"
                            : "#ffebee",
                          color: category.is_active ? "#2e7d32" : "#c62828",
                        }}
                      >
                        {category.is_active ? "✓ Active" : "✗ Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => handleEditCategory(category)}
                          style={{
                            background: "var(--primary-color)",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "all var(--transition-base)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow =
                              "var(--shadow-md)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(category.id, category.is_active)
                          }
                          style={{
                            background: "var(--secondary-color)",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "all var(--transition-base)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow =
                              "var(--shadow-md)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          style={{
                            background: "#ff4444",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            transition: "all var(--transition-base)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow =
                              "var(--shadow-md)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {categories.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "var(--radius-lg)",
            marginTop: "2rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏷️</div>
          <p
            style={{
              color: "var(--gray-dark)",
              fontSize: "1.1rem",
              marginBottom: "1rem",
            }}
          >
            No categories found.
          </p>
          <button
            onClick={handleAddCategory}
            style={{
              background: "var(--primary-color)",
              color: "white",
              padding: "0.8rem 2rem",
              borderRadius: "var(--radius-full)",
              border: "none",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Add Your First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
