import React, { useState, useEffect, useCallback, memo } from "react";
import { menuService } from "../services/api/menu";
import api from "../services/api/api";
import Loading from "../components/common/Loading";
import Swal from "sweetalert2";

const AdminMenu = memo(() => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await api.get("/menu?all=true");
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleToggleAvailability = useCallback(
    async (id, currentStatus) => {
      try {
        const formData = new FormData();
        formData.append("availability", !currentStatus);
        await menuService.update(id, formData);
        Swal.fire("Success", "Availability updated", "success");
        fetchMenu();
      } catch (err) {
        console.error("Toggle availability error:", err);
        Swal.fire("Error", "Failed to update", "error");
      }
    },
    [fetchMenu]
  );

  const handleDelete = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the item. This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await menuService.delete(id);
          Swal.fire(
            "Deleted!",
            "Item has been permanently removed.",
            "success"
          );
          fetchMenu();
        } catch (err) {
          console.error("Delete item error:", err);
          Swal.fire(
            "Error",
            err.response?.data?.message || "Failed to delete item",
            "error"
          );
        }
      }
    },
    [fetchMenu]
  );

  const handleAddItem = async () => {
    // Refresh categories before showing form
    await fetchCategories();

    // Build category dropdown HTML with "Add New Category" option
    const categoryOptions = categories
      .filter((cat) => cat.is_active !== false)
      .map((cat) => `<option value="${cat.name}">${cat.name}</option>`)
      .join("");

    // Common input styles for consistency - ensure all fields have identical styling
    const inputStyle =
      "width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #ddd; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s ease; margin: 0; display: block; line-height: 1.5; min-height: 44px;";
    const selectStyle =
      'width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #ddd; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s ease; margin: 0; display: block; line-height: 1.5; min-height: 44px; background-color: white; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"%3E%3Cpath fill="%23333" d="M6 9L1 4h10z"/%3E%3C/svg%3E\'); background-repeat: no-repeat; background-position: right 12px center; padding-right: 40px;';
    const labelStyle =
      "display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color); font-size: 0.95rem; width: 100%; text-align: left;";
    const fieldContainerStyle =
      "margin-bottom: 20px; width: 100%; display: block;";

    const categoryDropdown = `
      <div style="${fieldContainerStyle}">
        <label style="${labelStyle}">Category *</label>
        <select id="swal-category" class="swal2-input" style="${selectStyle}">
          <option value="">-- Select Category --</option>
          ${categoryOptions}
          <option value="__NEW__">➕ Add New Category</option>
        </select>
      </div>
      <div id="new-category-section" style="display: none; ${fieldContainerStyle}">
        <label style="${labelStyle}">New Category Name *</label>
        <input id="swal-new-category" class="swal2-input" placeholder="Enter new category name" style="${inputStyle}">
        <label style="${labelStyle} margin-top: 15px;">Category Description (optional)</label>
        <textarea id="swal-new-category-desc" class="swal2-textarea" placeholder="Enter category description" style="${inputStyle} min-height: 80px; resize: vertical;"></textarea>
      </div>
    `;

    const { value: formValues } = await Swal.fire({
      title: "Add New Menu Item",
      html:
        '<div style="text-align: left; width: 100%;">' +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Item Name *</label>
          <input id="swal-name" class="swal2-input" placeholder="Enter item name" style="${inputStyle}">
        </div>` +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Price *</label>
          <input id="swal-price" type="number" step="0.01" class="swal2-input" placeholder="0.00" style="${inputStyle}">
        </div>` +
        categoryDropdown +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Image</label>
          <input id="swal-image" type="file" accept="image/*" class="swal2-input" style="${inputStyle} cursor: pointer;">
        </div>` +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Description</label>
          <textarea id="swal-description" class="swal2-textarea" placeholder="Enter item description" style="${inputStyle} min-height: 80px; resize: vertical;"></textarea>
        </div>` +
        "</div>",
      focusConfirm: false,
      width: window.innerWidth < 768 ? "90%" : "600px",
      customClass: {
        popup: "swal2-popup-responsive",
        container: "swal2-container-responsive",
      },
      didOpen: () => {
        const categorySelect = document.getElementById("swal-category");
        const newCategorySection = document.getElementById(
          "new-category-section"
        );

        if (categorySelect && newCategorySection) {
          categorySelect.addEventListener("change", (e) => {
            if (e.target.value === "__NEW__") {
              newCategorySection.style.display = "block";
              document.getElementById("swal-new-category").focus();
            } else {
              newCategorySection.style.display = "none";
            }
          });
        }
      },
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value.trim();
        const price = parseFloat(document.getElementById("swal-price").value);
        const categorySelect = document.getElementById("swal-category");
        const category = categorySelect ? categorySelect.value : "";
        const description = document
          .getElementById("swal-description")
          .value.trim();
        const imageFile = document.getElementById("swal-image").files[0];

        let finalCategory = category;

        // Handle new category creation
        if (category === "__NEW__") {
          const newCategoryName = document
            .getElementById("swal-new-category")
            .value.trim();
          const newCategoryDesc = document
            .getElementById("swal-new-category-desc")
            .value.trim();

          if (!newCategoryName) {
            Swal.showValidationMessage("Please enter a category name");
            return false;
          }

          try {
            const res = await api.post("/admin/categories", {
              name: newCategoryName,
              description: newCategoryDesc,
            });
            finalCategory = newCategoryName;
            // Refresh categories list
            await fetchCategories();
          } catch (err) {
            Swal.showValidationMessage(
              err.response?.data?.message || "Failed to create category"
            );
            return false;
          }
        }

        if (!name || isNaN(price) || !finalCategory) {
          Swal.showValidationMessage("Please fill name, price, and category");
          return false;
        }

        return { name, price, category: finalCategory, description, imageFile };
      },
    });

    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("price", formValues.price);
        formData.append("category", formValues.category);
        formData.append("description", formValues.description || "");
        if (formValues.imageFile) {
          formData.append("image", formValues.imageFile);
        }

        await menuService.create(formData);
        Swal.fire("Success", "Item added successfully", "success");
        fetchMenu();
      } catch (err) {
        console.error("Add item error:", err);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to add item",
          "error"
        );
      }
    }
  };

  const handleEditItem = async (item) => {
    // Refresh categories before showing form
    await fetchCategories();

    // Build category dropdown HTML with current category selected
    const categoryOptions = categories
      .filter((cat) => cat.is_active !== false)
      .map(
        (cat) =>
          `<option value="${cat.name}" ${
            cat.name === item.category ? "selected" : ""
          }>${cat.name}</option>`
      )
      .join("");

    // Common input styles for consistency - ensure all fields have identical styling
    const inputStyle =
      "width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #ddd; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s ease; margin: 0; display: block; line-height: 1.5; min-height: 44px;";
    const selectStyle =
      'width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #ddd; font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border-color 0.3s ease; margin: 0; display: block; line-height: 1.5; min-height: 44px; background-color: white; cursor: pointer; -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"%3E%3Cpath fill="%23333" d="M6 9L1 4h10z"/%3E%3C/svg%3E\'); background-repeat: no-repeat; background-position: right 12px center; padding-right: 40px;';
    const labelStyle =
      "display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark-color); font-size: 0.95rem; width: 100%; text-align: left;";
    const fieldContainerStyle =
      "margin-bottom: 20px; width: 100%; display: block;";

    const categoryDropdown = `
      <div style="${fieldContainerStyle}">
        <label style="${labelStyle}">Category *</label>
        <select id="swal-category" class="swal2-input" style="${selectStyle}">
          <option value="">-- Select Category --</option>
          ${categoryOptions}
          <option value="__NEW__">➕ Add New Category</option>
        </select>
      </div>
      <div id="new-category-section" style="display: none; ${fieldContainerStyle}">
        <label style="${labelStyle}">New Category Name *</label>
        <input id="swal-new-category" class="swal2-input" placeholder="Enter new category name" style="${inputStyle}">
        <label style="${labelStyle} margin-top: 15px;">Category Description (optional)</label>
        <textarea id="swal-new-category-desc" class="swal2-textarea" placeholder="Enter category description" style="${inputStyle} min-height: 80px; resize: vertical;"></textarea>
      </div>
    `;

    const { value: formValues } = await Swal.fire({
      title: "Edit Menu Item",
      html:
        '<div style="text-align: left; width: 100%;">' +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Item Name *</label>
          <input id="swal-name" class="swal2-input" placeholder="Enter item name" value="${item.name}" style="${inputStyle}">
        </div>` +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Price *</label>
          <input id="swal-price" type="number" step="0.01" class="swal2-input" placeholder="0.00" value="${item.price}" style="${inputStyle}">
        </div>` +
        categoryDropdown +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Image</label>
          <input id="swal-image" type="file" accept="image/*" class="swal2-input" style="${inputStyle} cursor: pointer;">
          <small style="display: block; margin-top: 8px; color: #666; font-size: 0.85rem;">Current: ${
            item.image_url
              ? item.image_url.length > 50
                ? item.image_url.substring(0, 50) + "..."
                : item.image_url
              : "No image"
          }</small>
        </div>` +
        `<div style="${fieldContainerStyle}">
          <label style="${labelStyle}">Description</label>
          <textarea id="swal-description" class="swal2-textarea" placeholder="Enter item description" style="${inputStyle} min-height: 80px; resize: vertical;">${
          item.description || ""
        }</textarea>
        </div>` +
        "</div>",
      focusConfirm: false,
      width: window.innerWidth < 768 ? "90%" : "600px",
      customClass: {
        popup: "swal2-popup-responsive",
        container: "swal2-container-responsive",
      },
      didOpen: () => {
        const categorySelect = document.getElementById("swal-category");
        const newCategorySection = document.getElementById(
          "new-category-section"
        );

        if (categorySelect && newCategorySection) {
          categorySelect.addEventListener("change", (e) => {
            if (e.target.value === "__NEW__") {
              newCategorySection.style.display = "block";
              document.getElementById("swal-new-category").focus();
            } else {
              newCategorySection.style.display = "none";
            }
          });
        }
      },
      preConfirm: async () => {
        const name = document.getElementById("swal-name").value.trim();
        const price = parseFloat(document.getElementById("swal-price").value);
        const categorySelect = document.getElementById("swal-category");
        const category = categorySelect ? categorySelect.value : "";
        const description = document
          .getElementById("swal-description")
          .value.trim();
        const imageFile = document.getElementById("swal-image").files[0];

        let finalCategory = category;

        // Handle new category creation
        if (category === "__NEW__") {
          const newCategoryName = document
            .getElementById("swal-new-category")
            .value.trim();
          const newCategoryDesc = document
            .getElementById("swal-new-category-desc")
            .value.trim();

          if (!newCategoryName) {
            Swal.showValidationMessage("Please enter a category name");
            return false;
          }

          try {
            const res = await api.post("/admin/categories", {
              name: newCategoryName,
              description: newCategoryDesc,
            });
            finalCategory = newCategoryName;
            // Refresh categories list
            await fetchCategories();
          } catch (err) {
            Swal.showValidationMessage(
              err.response?.data?.message || "Failed to create category"
            );
            return false;
          }
        }

        if (!name || isNaN(price) || !finalCategory) {
          Swal.showValidationMessage("Please fill name, price, and category");
          return false;
        }

        return { name, price, category: finalCategory, description, imageFile };
      },
    });

    if (formValues) {
      try {
        const formData = new FormData();
        formData.append("name", formValues.name);
        formData.append("price", formValues.price);
        formData.append("category", formValues.category);
        formData.append("description", formValues.description || "");
        if (formValues.imageFile) {
          formData.append("image", formValues.imageFile);
        }

        await menuService.update(item.id, formData);
        Swal.fire("Success", "Item updated successfully", "success");
        fetchMenu();
      } catch (err) {
        console.error("Update item error:", err);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to update item",
          "error"
        );
      }
    }
  };

  if (loading) {
    return <Loading message="Loading menu..." />;
  }

  return (
    <div
      style={{
        padding: "2rem 1rem",
        maxWidth: "1400px",
        margin: "0 auto",
        minHeight: "100vh",
        background: "transparent",
      }}
    >
      {/* Header */}
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          gap: "1rem",
        }}
      >
        <h1
          className="admin-title"
          style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            color: "var(--primary-color)",
          }}
        >
          Manage Menu
        </h1>
        <button
          onClick={handleAddItem}
          style={{
            background: "var(--primary-color)",
            color: "white",
            padding: "0.8rem 1.5rem",
            borderRadius: "25px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(211, 47, 47, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(211, 47, 47, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 15px rgba(211, 47, 47, 0.3)";
          }}
        >
          + Add New Item
        </button>
      </div>

      {/* Table Container - Responsive */}
      <div
        style={{
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}
      >
        {/* Mobile Card View - Hidden on desktop */}
        <div
          className="admin-menu-mobile"
          style={{ display: "none", padding: "1rem" }}
        >
          {menu.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid #eee",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                    {item.category}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "var(--primary-color)",
                    }}
                  >
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    padding: "0.3rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    background:
                      item.availability === false ? "#ffebee" : "#e8f5e9",
                    color: item.availability === false ? "#c62828" : "#2e7d32",
                  }}
                >
                  {item.availability === false ? "Unavailable" : "Available"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => handleEditItem(item)}
                  style={{
                    flex: 1,
                    background: "var(--primary-color)",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleToggleAvailability(item.id, item.availability)
                  }
                  style={{
                    flex: 1,
                    background: "var(--secondary-color)",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  Toggle
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    flex: 1,
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View - Hidden on mobile */}
        <div className="admin-menu-desktop" style={{ overflowX: "auto" }}>
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
                  Image
                </th>
                <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                  Name
                </th>
                <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                  Price
                </th>
                <th style={{ padding: "1.2rem 1rem", fontWeight: "700" }}>
                  Category
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
              {menu.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    transition: "background 0.2s ease",
                    background: index % 2 === 0 ? "white" : "#fafafa",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fff3e0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      index % 2 === 0 ? "white" : "#fafafa";
                  }}
                >
                  <td style={{ padding: "1rem" }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "600" }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>
                    ${item.price.toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.3rem 0.8rem",
                        borderRadius: "15px",
                        background: "var(--light-color)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        background:
                          item.availability === false ? "#ffebee" : "#e8f5e9",
                        color:
                          item.availability === false ? "#c62828" : "#2e7d32",
                      }}
                    >
                      {item.availability === false
                        ? "Unavailable"
                        : "Available"}
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
                        onClick={() => handleEditItem(item)}
                        style={{
                          background: "var(--primary-color)",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(211, 47, 47, 0.3)";
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
                          handleToggleAvailability(item.id, item.availability)
                        }
                        style={{
                          background: "var(--secondary-color)",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(255, 152, 0, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: "#ff4444",
                          color: "white",
                          border: "none",
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(255, 68, 68, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {menu.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "white",
            borderRadius: "15px",
            marginTop: "2rem",
          }}
        >
          <p
            style={{ color: "#666", fontSize: "1.1rem", marginBottom: "1rem" }}
          >
            No menu items found.
          </p>
          <button
            onClick={handleAddItem}
            style={{
              background: "var(--primary-color)",
              color: "white",
              padding: "0.8rem 2rem",
              borderRadius: "25px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
});

export default AdminMenu;
