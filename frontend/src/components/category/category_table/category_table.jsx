// CategoryTable.jsx
import { useEffect, useState } from "react";
import { CategoryService } from "../../../services/categoryServices";
import "./category_table.css";
import {
  Button,
  Modal,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await CategoryService.deleteCategory(deleteId);
      setCategories(categories.filter((cat) => cat._id !== deleteId));
      setOpenDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category_name", editCategory.category_name);
      formData.append("category_type", editCategory.category_type);
      formData.append("category_description", editCategory.category_description);
      formData.append("date", editCategory.date);
      if (imageFile) {
        formData.append("category_image", imageFile);
      }

      const updatedCategory = await CategoryService.updateCategory(editCategory._id, formData);
      setCategories(
        categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
      setOpenEditModal(false);
      setEditCategory(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Category Management
      </Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No categories available
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell>
                    <img
                      src={category.category_image ? `http://localhost:3500${category.category_image}` : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                      alt={category.category_name}
                      style={{ width: 50, height: 50, borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell>{category.category_type}</TableCell>
                  <TableCell>{category.category_description}</TableCell>
                  <TableCell>
                    {new Date(category.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setViewCategory(category);
                        setOpenViewModal(true);
                      }}
                    >
                      <Visibility color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEditCategory(category);
                        setOpenEditModal(true);
                      }}
                    >
                      <Edit color="info" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setDeleteId(category._id);
                        setOpenDeleteModal(true);
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography>Are you sure you want to delete this category?</Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          {editCategory && (
            <form onSubmit={handleEditSubmit}>
              <Typography variant="h6" gutterBottom>
                Edit Category
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={editCategory.category_name}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        category_name: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Type"
                    value={editCategory.category_type}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        category_type: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={editCategory.category_description}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        category_description: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    inputProps={{ accept: "image/*" }}
                  />
                  {editCategory.category_image && (
                    <img
                      src={`http://localhost:5000${editCategory.category_image}`}
                      alt="Preview"
                      style={{ width: 100, height: 100, marginTop: 10 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    <Button variant="contained" type="submit">
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenEditModal(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Modal>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          {viewCategory && (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {viewCategory.category_name}
                </Typography>
                <img
                  src={viewCategory.category_image ? `http://localhost:5000${viewCategory.category_image}` : "placeholder.jpg"}
                  alt={viewCategory.category_name}
                  style={{ width: 100, height: 100, borderRadius: 4, mb: 2 }}
                />
                <Typography>
                  <strong>Type:</strong> {viewCategory.category_type}
                </Typography>
                <Typography>
                  <strong>Description:</strong> {viewCategory.category_description}
                </Typography>
                <Typography>
                  <strong>Date:</strong> {new Date(viewCategory.date).toLocaleDateString()}
                </Typography>
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => setOpenViewModal(false)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default CategoryTable;