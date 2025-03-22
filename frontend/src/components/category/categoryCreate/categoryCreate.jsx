import React, { useState } from "react";
import { CategoryService } from "../../../services/categoryServices"; // Adjust the import path if needed


const CategoryTable = () => {
  const [showModal, setShowModal] = useState(false);

  const [categoryType, setCategoryType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryType || !categoryName || !categoryDescription) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    
    formData.append("category_type", categoryType);
    formData.append("category_name", categoryName);
    formData.append("category_description", categoryDescription);
    formData.append("date", new Date().toISOString());

    try {
      const response = await CategoryService.createCategory(formData);
      console.log("Category created:", response);
      alert("Category created successfully!");
      setShowModal(false); // Close modal after successful creation
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category. Please try again.");
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        + Add New Category
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Category</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="mb-3">
                <label className="form-label">Category Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
