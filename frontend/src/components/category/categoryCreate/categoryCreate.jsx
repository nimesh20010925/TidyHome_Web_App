import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CategoryService } from "../../../services/categoryServices"; // Adjust the import path if needed

const CategoryTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [categoryType, setCategoryType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null); // State for image file

  // Updated Category type options
  const categoryTypes = [
    "Food & Groceries",
    "Cleaning Supplies",
    "Personal Care & Hygiene",
    "Emergency & Safety Items",
    "Clothing & Accessories",
    "Electronics & Gadgets",
    "Outdoor & Gardening",
    "Automotive & Accessories",
    "Pet Supplies",
    "Kitchenware & Dining",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryType || !categoryName || !categoryDescription) {
      alert("All fields except image are required");
      return;
    }

    // Validation for Category Name: only letters, numbers, and spaces
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(categoryName)) {
      alert(
        "Category Name can only contain letters, numbers, and spaces. No special characters allowed."
      );
      return;
    }

    // Validation for Description: min 10 characters, max 500 characters
    if (
      categoryDescription.length < 10 ||
      categoryDescription.length > 500
    ) {
      alert("Description must be between 10 and 500 characters long.");
      return;
    }

    const formData = new FormData();
    formData.append("category_type", categoryType);
    formData.append("category_name", categoryName);
    formData.append("category_description", categoryDescription);
    formData.append("date", new Date().toISOString());
    if (categoryImage) {
      formData.append("category_image", categoryImage); // Append image file
    }

    try {
      const response = await CategoryService.createCategory(formData);
      console.log("Category created:", response);
      alert("Category created successfully!");
      setShowModal(false); // Close modal after successful creation
      // Reset form fields
      setCategoryType("");
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImage(null);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Error creating category. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file); // Set the selected image file
    }
  };

  // Modal styling from SupplierService
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
  };

  // Purple theme from SupplierService
  const purpleTheme = {
    buttonPurple: "#AC9EFF",
    buttonHover: "#9a80ff",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-light mb-3"
          style={{
            background: "linear-gradient(135deg, #AC9EFF 0%, #7B68EE 100%)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "25px",
            border: "2px solid #6A5ACD",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
          onMouseOver={(e) =>
            (e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)")
          }
          onMouseOut={(e) =>
            (e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)")
          }
        >
          + Add New Category
        </button>
      </div>

      {/* Modal for Create Form */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Add New Category
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Category Image */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CATEGORY IMAGE"
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: "image/*" }}
                  onChange={handleImageChange}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#6A5ACD" },
                      "&:hover fieldset": { borderColor: "#7B68EE" },
                    },
                  }}
                />
                {categoryImage && (
                  <img
                    src={URL.createObjectURL(categoryImage)}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginTop: "10px",
                    }}
                  />
                )}
              </Grid>

              {/* Category Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CATEGORY NAME"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  type="text"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#6A5ACD" },
                      "&:hover fieldset": { borderColor: "#7B68EE" },
                    },
                  }}
                />
              </Grid>

              {/* Category Type */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>CATEGORY TYPE</InputLabel>
                  <Select
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    label="CATEGORY TYPE"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#6A5ACD" },
                        "&:hover fieldset": { borderColor: "#7B68EE" },
                      },
                    }}
                  >
                    <MenuItem value="">Select a category type</MenuItem>
                    {categoryTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#6A5ACD" },
                      "&:hover fieldset": { borderColor: "#7B68EE" },
                    },
                  }}
                />
              </Grid>

              {/* Submit and Cancel Buttons */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  sx={{
                    backgroundColor: purpleTheme.buttonPurple,
                    color: "white",
                    "&:hover": { backgroundColor: purpleTheme.buttonHover },
                    mb: 1, // Margin bottom for spacing
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowModal(false)}
                  fullWidth
                  sx={{
                    color: purpleTheme.buttonPurple,
                    borderColor: purpleTheme.buttonPurple,
                    "&:hover": {
                      borderColor: purpleTheme.buttonHover,
                      color: purpleTheme.buttonHover,
                    },
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CategoryTable;