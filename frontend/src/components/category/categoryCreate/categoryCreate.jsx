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
  Snackbar,
  Alert,
} from "@mui/material";
import { CategoryService } from "../../../services/categoryServices";

const CategoryTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [categoryType, setCategoryType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const handleSubmit = async () => {
    if (!categoryType || !categoryName || !categoryDescription) {
      setSnackbar({
        open: true,
        message: "All fields except image are required",
        severity: "error",
      });
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s&]+$/;
    if (!nameRegex.test(categoryName)) {
      setSnackbar({
        open: true,
        message:
          "Category Name can only contain letters, numbers, and spaces. No special characters allowed.",
        severity: "error",
      });
      return;
    }

    if (
      categoryDescription.length < 10 ||
      categoryDescription.length > 500
    ) {
      setSnackbar({
        open: true,
        message: "Description must be between 10 and 500 characters long.",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("category_type", categoryType);
    formData.append("category_name", categoryName);
    formData.append("category_description", categoryDescription);
    formData.append("date", new Date().toISOString());
    if (categoryImage) {
      formData.append("category_image", categoryImage);
    }

    try {
      const response = await CategoryService.createCategory(formData);
      console.log("Category created:", response);
      setSnackbar({
        open: true,
        message: "Category created successfully!",
        severity: "success",
      });
      setShowModal(false);
      setCategoryType("");
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImage(null);
    } catch (error) {
      console.error("Error creating category:", error);
      setSnackbar({
        open: true,
        message: "Error creating category. Please try again.",
        severity: "error",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
    }
  };

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
          <Typography variant="h6" gutterBottom>Add New Category</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CATEGORY IMAGE"
                type="file"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
                onChange={handleImageChange}
                variant="outlined"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CATEGORY NAME"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                type="text"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>CATEGORY TYPE</InputLabel>
                <Select
                  value={categoryType}
                  onChange={(e) => setCategoryType(e.target.value)}
                  label="CATEGORY TYPE"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="DESCRIPTION"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                fullWidth
                sx={{
                  backgroundColor: purpleTheme.buttonPurple,
                  color: "white",
                  "&:hover": { backgroundColor: purpleTheme.buttonHover },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CategoryTable;