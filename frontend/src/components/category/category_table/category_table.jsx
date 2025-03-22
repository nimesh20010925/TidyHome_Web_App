// CategoryTable.jsx
import React, { useEffect, useState } from "react";
import { CategoryService } from "../../../services/categoryServices";
import "./category_table.css";
import { Button, Modal, Card, CardContent, Typography } from "@mui/material";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTocat, setDeleteTocat] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [viewCategory, setViewCategory] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await CategoryService.getAllCategorys();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const deleteCategory = async () => {
    if (!deleteTocat) return;
    try {
      const response = await fetch(`/api/category/deletecat/${deleteTocat}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete category");
      const data = await response.json();
      if (data.message === "Category deleted successfully") {
        setCategories((prev) => prev.filter((cat) => cat._id !== deleteTocat));
        setOpenDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleViewClick = (category) => {
    setViewCategory(category);
    setOpenViewModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="category-table-container">
      <h2 className="table-title">Categories Management</h2>
      <div className="table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No categories found</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="table-row">
                  <td>
                    <img
                      src={category.category_image}
                      alt={category.category_name}
                      className="category-image"
                    />
                  </td>
                  <td>{category.category_name}</td>
                  <td>{category.category_type}</td>
                  <td className="description-cell">{category.category_description}</td>
                  <td>{new Date(category.date).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button className="action-btn view-btn" onClick={() => handleViewClick(category)}>
                      View
                    </button>
                    <button className="action-btn edit-btn" onClick={() => console.log("Edit", category._id)}>
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setDeleteTocat(category._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className="modal-content delete-modal">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this category?</p>
          <div className="modal-buttons">
            <Button className="confirm-delete" onClick={deleteCategory}>
              Delete
            </Button>
            <Button className="cancel-btn" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <div className="modal-overlay">
          <div className="modal-content view-modal">
            {viewCategory && (
              <Card className="view-card">
                <CardContent>
                  <Typography variant="h5" className="view-title">
                    {viewCategory.category_name}
                  </Typography>
                  <img
                    src={viewCategory.category_image}
                    alt={viewCategory.category_name}
                    className="view-image"
                  />
                  <div className="view-details">
                    <Typography><strong>Type:</strong> {viewCategory.category_type}</Typography>
                    <Typography><strong>Description:</strong> {viewCategory.category_description}</Typography>
                    <Typography><strong>Created:</strong> {new Date(viewCategory.date).toLocaleDateString()}</Typography>
                  </div>
                  <Button className="close-btn" onClick={() => setOpenViewModal(false)}>
                    Close
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryTable;