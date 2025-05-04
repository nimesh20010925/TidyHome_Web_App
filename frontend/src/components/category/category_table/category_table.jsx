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
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Menu,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  ArrowBack,
  ArrowForward,
  Download,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
    fontFamily: "'Roboto Slab', Sans-serif",
    fontSize: "16px",
    fontStyle: "normal",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const categoryTypes = [
    "Food & Grocery",
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

  const openMenu = Boolean(anchorEl);

  const purpleTheme = {
    lightPurple: "#DAD5FB",
    buttonPurple: "#AC9EFF",
    buttonHover: "#9a80ff",
    accentPurple: "#7b1fa2",
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoryData = await CategoryService.getAllCategorys();
      const sortedCategories = categoryData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showSnackbar("Error fetching categories", "error");
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
      showSnackbar("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      showSnackbar("Error deleting category", "error");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category_name", editCategory.category_name);
      formData.append("category_type", editCategory.category_type);
      formData.append(
        "category_description",
        editCategory.category_description
      );
      formData.append("date", editCategory.date);
      if (imageFile) {
        formData.append("category_image", imageFile);
      }

      const updatedCategory = await CategoryService.updateCategory(
        editCategory._id,
        formData
      );
      setCategories(
        categories.map((cat) =>
          cat._id === updatedCategory._id ? updatedCategory : cat
        )
      );
      setOpenEditModal(false);
      setEditCategory(null);
      setImageFile(null);
      showSnackbar("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      showSnackbar("Error updating category", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const generateCSVReport = () => {
    if (filteredCategories.length === 0) {
      showSnackbar("No categories available to generate a report", "warning");
      return;
    }

    const headers = ["Name", "Type", "Description", "Date"];
    const rows = filteredCategories.map((category) => [
      `"${category.category_name.replace(/"/g, '""')}"`,
      `"${category.category_type.replace(/"/g, '""')}"`,
      `"${category.category_description.replace(/"/g, '""')}"`,
      new Date(category.date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `category_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSnackbar("CSV report generated successfully");
    handleMenuClose();
  };

  const generatePDFReport = () => {
    if (filteredCategories.length === 0) {
      showSnackbar("No categories available to generate a report", "warning");
      return;
    }

    try {
      const doc = new jsPDF();
      // Adding a simple logo (circle with text) at the top center
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoX = pageWidth / 2; // Center horizontally
      doc.setFillColor(172, 158, 255);
      doc.circle(logoX, 14, 8, 'F');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('CM', logoX, 16, { align: 'center' });

      // Set font to bold for the report title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text("Category Report", pageWidth / 2, 28, { align: 'center' });
      
      // Reset font to normal for subsequent text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

      const tableData = filteredCategories.map((category) => [
        category.category_name || "",
        category.category_type || "",
        category.category_description || "",
        new Date(category.date).toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: 46,
        head: [["Name", "Type", "Description", "Date"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [172, 158, 255],
          textColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 3,
          fontSize: 10,
          overflow: "linebreak",
        },
        columnStyles: {
          2: { cellWidth: 60 }, // Wider column for Description
        },
      });

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `category_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSnackbar("PDF report generated successfully");
    } catch (error) {
      console.error("Error generating PDF report:", error);
      showSnackbar("Failed to generate PDF report", "error");
    }
    handleMenuClose();
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter((category) =>
    [
      category.category_name || "",
      category.category_type || "",
      category.category_description || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const pageNumbers = [];
  for (let i = Math.max(0, page - 2); i < Math.min(totalPages, page + 3); i++) {
    pageNumbers.push(i);
  }

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: "22px",
            color: "#1F2937",
            textAlign: "left",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          Category Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Search Categories"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: 300,
              backgroundColor: "#fff",
              borderRadius: "25px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                "& fieldset": {
                  borderColor: purpleTheme.accentPurple,
                },
                "&:hover fieldset": {
                  borderColor: purpleTheme.buttonHover,
                },
                "&.Mui-focused fieldset": {
                  borderColor: purpleTheme.buttonPurple,
                },
              },
              "& .MuiInputLabel-root": {
                color: purpleTheme.accentPurple,
                fontWeight: "500",
                "&.Mui-focused": {
                  color: purpleTheme.buttonPurple,
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 20px",
                fontSize: "16px",
              },
            }}
            InputProps={{
              sx: {
                "&::placeholder": {
                  color: "#9CA3AF",
                  opacity: 1,
                },
              },
            }}
          />
          <StyledButton
            variant="outlined"
            startIcon={<Download />}
            onClick={handleMenuOpen}
            sx={{
              borderColor: purpleTheme.buttonPurple,
              color: purpleTheme.buttonPurple,
              borderRadius: "25px",
              borderWidth: "2px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              padding: "10px 20px",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: purpleTheme.buttonHover,
                color: purpleTheme.buttonHover,
                backgroundColor: `${purpleTheme.buttonPurple}10`,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Generate Report
          </StyledButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <MenuItem
              onClick={generateCSVReport}
              sx={{
                color: purpleTheme.buttonPurple,
                "&:hover": {
                  backgroundColor: `${purpleTheme.buttonPurple}10`,
                },
              }}
            >
              Generate CSV Report
            </MenuItem>
            <MenuItem
              onClick={generatePDFReport}
              sx={{
                color: purpleTheme.buttonPurple,
                "&:hover": {
                  backgroundColor: `${purpleTheme.buttonPurple}10`,
                },
              }}
            >
              Generate PDF Report
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Category Type</TableCell>
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

        {filteredCategories.length > 3 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: "#f9f9f9",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                label="Rows per page"
                sx={{
                  color: purpleTheme.accentPurple,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: purpleTheme.accentPurple,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: purpleTheme.buttonHover,
                  },
                }}
              >
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                sx={{
                  color: page === 0 ? "#bdbdbd" : purpleTheme.accentPurple,
                  "&:hover": {
                    backgroundColor: `${purpleTheme.accentPurple}20`,
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ArrowBack />
              </IconButton>

              {pageNumbers.map((num) => (
                <Button
                  key={num}
                  onClick={() => handleChangePage(num)}
                  sx={{
                    minWidth: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor:
                      page === num ? purpleTheme.accentPurple : "transparent",
                    color: page === num ? "white" : purpleTheme.accentPurple,
                    "&:hover": {
                      backgroundColor:
                        page === num
                          ? purpleTheme.accentPurple
                          : `${purpleTheme.accentPurple}20`,
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease-in-out",
                    fontWeight: "bold",
                  }}
                >
                  {num + 1}
                </Button>
              ))}

              <IconButton
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                sx={{
                  color:
                    page >= totalPages - 1
                      ? "#bdbdbd"
                      : purpleTheme.accentPurple,
                  "&:hover": {
                    backgroundColor: `${purpleTheme.accentPurple}20`,
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>

            <Typography
              sx={{
                color: purpleTheme.accentPurple,
                fontWeight: "bold",
              }}
            >
              {`${page * rowsPerPage + 1}-${Math.min(
                (page + 1) * rowsPerPage,
                filteredCategories.length
              )} of ${filteredCategories.length}`}
            </Typography>
          </Box>
        )}
      </StyledTableContainer>

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
              <StyledButton
                variant="contained"
                color="error"
                onClick={handleDelete}
              >
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
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    >
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
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      inputProps={{ accept: "image/*" }}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                    {editCategory.category_image && (
                      <img
                        src={`http://localhost:3500${editCategory.category_image}`}
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                      }}
                    >
                      <StyledButton
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
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

      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Fade in={openViewModal}>
          <Box sx={modalStyle}>
            {viewCategory && (
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
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
                        ? `http://localhost:3500${viewCategory.category_image}`
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
                    <strong>Description:</strong>{" "}
                    {viewCategory.category_description}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    <strong>Date:</strong>{" "}
                    {new Date(viewCategory.date).toLocaleDateString()}
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