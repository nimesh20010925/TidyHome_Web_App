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
  TablePagination,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "#AC9EFF",
  "& .MuiTableCell-head": {
    color: "white",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.3s ease, transform 0.2s ease",
  "&:hover": {
    backgroundColor: "#F1F5F9",
    transform: "translateY(-2px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  textTransform: "none",
  padding: "6px 16px",
  fontWeight: 500,
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  background: "linear-gradient(135deg, #F9FAFB, #EFF3F6)",
  borderTop: "1px solid #E5E7EB",
  borderRadius: "0 0 12px 12px",
  "& .MuiTablePagination-toolbar": {
    padding: "8px 16px",
    color: "#4B5563",
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    fontWeight: 500,
    color: "#374151",
  },
  "& .MuiTablePagination-select": {
    borderRadius: "8px",
    padding: "4px 8px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  "& .MuiTablePagination-actions": {
    "& .MuiIconButton-root": {
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      color: "#1976D2",
      margin: "0 4px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      "&:hover": {
        backgroundColor: "#1976D2",
        color: "#FFFFFF",
        transform: "scale(1.1)",
      },
      "&.Mui-disabled": {
        backgroundColor: "#E5E7EB",
        color: "#9CA3AF",
        boxShadow: "none",
      },
    },
  },
}));

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  // Define category type options
  const categoryTypes = ["Food", "Grocery", "Cleaning Supplies"];

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
      if (categories.length - 1 <= page * rowsPerPage) {
        setPage(Math.max(0, page - 1));
      }
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedCategories = categories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Fade in={loading}>
          <Typography variant="h6" color="text.secondary">
            Loading Categories...
          </Typography>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, background: "white" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: "22px",
          color: "#1F2937",
          textAlign: "left",
          mb: 4,
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        Category Management
      </Typography>

      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    No categories available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCategories.map((category) => (
                <StyledTableRow key={category._id}>
                  <TableCell>
                    <img
                      src={
                        category.category_image
                          ? `http://localhost:3500${category.category_image}`
                          : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                      }
                      alt={category.category_name}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "8px",
                        objectFit: "cover",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}
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
                      sx={{ color: "#1976D2" }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setEditCategory(category);
                        setOpenEditModal(true);
                      }}
                      sx={{ color: "#0288D1" }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setDeleteId(category._id);
                        setOpenDeleteModal(true);
                      }}
                      sx={{ color: "#D32F2F" }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {categories.length > 3 && (
        <StyledTablePagination
          rowsPerPageOptions={[3, 5, 10, 25]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Delete Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Fade in={openDeleteModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom sx={{ color: "#D32F2F" }}>
              Confirm Deletion
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to delete this category?
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <StyledButton variant="contained" color="error" onClick={handleDelete}>
                Delete
              </StyledButton>
              <StyledButton
                variant="outlined"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </StyledButton>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Fade in={openEditModal}>
          <Box sx={modalStyle}>
            {editCategory && (
              <form onSubmit={handleEditSubmit}>
                <Typography variant="h6" gutterBottom sx={{ color: "#1976D2" }}>
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
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}>
                      <InputLabel id="category-type-label">Type</InputLabel>
                      <Select
                        labelId="category-type-label"
                        label="Type"
                        value={editCategory.category_type || ""}
                        onChange={(e) =>
                          setEditCategory({
                            ...editCategory,
                            category_type: e.target.value,
                          })
                        }
                      >
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
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      inputProps={{ accept: "image/*" }}
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    {editCategory.category_image && (
                      <img
                        src={`http://localhost:5000${editCategory.category_image}`}
                        alt="Preview"
                        style={{
                          width: 100,
                          height: 100,
                          marginTop: 10,
                          borderRadius: "8px",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                      <StyledButton variant="contained" color="primary" type="submit">
                        Save
                      </StyledButton>
                      <StyledButton
                        variant="outlined"
                        onClick={() => setOpenEditModal(false)}
                      >
                        Cancel
                      </StyledButton>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Fade in={openViewModal}>
          <Box sx={modalStyle}>
            {viewCategory && (
              <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ color: "#1F2937", fontWeight: 600 }}
                  >
                    {viewCategory.category_name}
                  </Typography>
                  <img
                    src={
                      viewCategory.category_image
                        ? `http://localhost:5000${viewCategory.category_image}`
                        : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                    }
                    alt={viewCategory.category_name}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "12px",
                      marginBottom: "16px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                  <Typography sx={{ mb: 1 }}>
                    <strong>Type:</strong> {viewCategory.category_type}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    <strong>Description:</strong> {viewCategory.category_description}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    <strong>Date:</strong> {new Date(viewCategory.date).toLocaleDateString()}
                  </Typography>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenViewModal(false)}
                  >
                    Close
                  </StyledButton>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "white",
  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
  p: 4,
  borderRadius: "16px",
  backdropFilter: "blur(5px)",
};

export default CategoryTable;