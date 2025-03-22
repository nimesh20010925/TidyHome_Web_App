import React, { useEffect, useState } from "react";
import { CategoryService } from "../../../services/categoryServices";
import "./category_table.css";
import { Button, Modal, Card, CardContent, Typography } from "@mui/material";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTocat, setDeleteTocat] = useState(""); // ✅ Ensured it's null initially
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
  
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
  
      const data = await response.json(); // ✅ Ensure response is processed
  
      // ✅ Check if the response contains a success message and handle accordingly
      if (data.message === "Category deleted successfully") {
        // ✅ Remove deleted category from state
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat._id !== deleteTocat)
        );
        setOpenDeleteModal(false); // ✅ Close modal after deletion
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  

  const handleViewClick = (category) => {
    setViewCategory(category);
    setOpenViewModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="category-table-container">
      <h2>Categories</h2>
      <table className="category-table">
        <thead>
          <tr>
            <th>Category Image</th>
            <th>Category Name</th>
            <th>Category Type</th>
            <th>Description</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="6">No categories available</td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category._id}>
                <td>
                  <img
                    src={category.category_image}
                    alt={category.category_name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{category.category_name}</td>
                <td>{category.category_type}</td>
                <td>{category.category_description}</td>
                <td>{new Date(category.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleViewClick(category)}>View</button>
                  <button onClick={() => console.log("Edit", category._id)}>Edit</button>
                  <button
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

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className="modal-content">
          <h3>Are you sure you want to delete this category?</h3>
          <div className="modal-buttons">
            <Button color="error" onClick={deleteCategory}>
              Delete
            </Button>
            <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* View Category Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <div className="modal-overlay">
          <div className="modal-content">
            {viewCategory && (
              <Card sx={{ minWidth: 300, padding: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {viewCategory.category_name}
                  </Typography>
                  <img
                    src={viewCategory.category_image}
                    alt={viewCategory.category_name}
                    style={{
                      width: "100px",
                      height: "100px",
                      marginBottom: "10px",
                    }}
                  />
                  <Typography variant="body1">
                    <strong>Type:</strong> {viewCategory.category_type}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Description:</strong> {viewCategory.category_description}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Created Date:</strong> {new Date(viewCategory.date).toLocaleDateString()}
                  </Typography>
                  <Button
                    sx={{ marginTop: 2 }}
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenViewModal(false)}
                  >
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
