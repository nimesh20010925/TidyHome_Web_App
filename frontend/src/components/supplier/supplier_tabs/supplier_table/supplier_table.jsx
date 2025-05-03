import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Menu,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  Visibility,
  ArrowBack,
  ArrowForward,
  Download,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import HomeSummary from "../../../Home/HomeModals/HomeSummary.jsx";

const SupplierService = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    supplier_id: "",
    supplier_name: "",
    supplier_contact: "",
    supplier_email: "",
    supplier_address: "",
    date: "",
    type: "Supplier",
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3500/api/supplier");
      const sortedSuppliers = response.data.suppliers.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.date);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.date);
        return dateB - dateA;
      });
      setSuppliers(sortedSuppliers);
    } catch (error) {
      console.error("Fetch suppliers error:", error);
      const errorMessage =
        error.response?.data?.message || "Error fetching suppliers/stores";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    const {
      supplier_id,
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      date,
    } = formData;

    if (supplier_id.length < 5 || supplier_id.length > 10) {
      showSnackbar(
        "Supplier/Store ID must be between 5 and 10 characters long",
        "error"
      );
      return;
    }
    const alphanumericRegex = /^[a-zA-Z0-9.]+$/;
    if (!alphanumericRegex.test(supplier_id)) {
      showSnackbar(
        "Supplier/Store ID can only contain letters, numbers, and dots",
        "error"
      );
      return;
    }
    try {
      const response = await axios.get("http://localhost:3500/api/supplier");
      const existingSuppliers = response.data.suppliers;
      if (
        existingSuppliers.some(
          (supplier) => supplier.supplier_id === supplier_id
        )
      ) {
        showSnackbar("Supplier/Store ID already exists", "error");
        return;
      }
    } catch (error) {
      console.error("Error checking supplier/store ID uniqueness:", error);
      showSnackbar("Error validating Supplier/Store ID", "error");
      return;
    }

    if (supplier_name.length < 3 || supplier_name.length > 50) {
      showSnackbar(
        "Supplier/Store Name must be between 3 and 50 characters long",
        "error"
      );
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(supplier_name)) {
      showSnackbar(
        "Supplier/Store Name can only contain letters and spaces",
        "error"
      );
      return;
    }

    if (supplier_contact.length !== 10) {
      showSnackbar(
        "Supplier/Store Contact must be exactly 10 digits",
        "error"
      );
      return;
    }
    const contactRegex = /^[0-9]+$/;
    if (!contactRegex.test(supplier_contact)) {
      showSnackbar(
        "Supplier/Store Contact can only contain numbers",
        "error"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplier_email)) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3500/api/supplier");
      const existingSuppliers = response.data.suppliers;
      if (
        existingSuppliers.some(
          (supplier) => supplier.supplier_email === supplier_email
        )
      ) {
        showSnackbar("Email already exists", "error");
        return;
      }
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      showSnackbar("Error validating Email", "error");
      return;
    }

    if (supplier_address.length < 10 || supplier_address.length > 100) {
      showSnackbar(
        "Supplier/Store Address must be between 10 and 100 characters long",
        "error"
      );
      return;
    }
    const addressRegex = /^[a-zA-Z0-9\s,.-/]+$/;
    if (!addressRegex.test(supplier_address)) {
      showSnackbar(
        "Supplier/Store Address can only contain letters, numbers, spaces, and , . - /",
        "error"
      );
      return;
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      showSnackbar("Date must be in YYYY-MM-DD format", "error");
      return;
    }
    const inputDate = new Date(date);
    const currentDate = new Date();
    if (inputDate > currentDate) {
      showSnackbar("Date cannot be in the future", "error");
      return;
    }
    const minDate = new Date("2015-03-22");
    if (inputDate < minDate) {
      showSnackbar("Date cannot be older than 10 years", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3500/api/supplier/create",
        formData
      );
      const newSupplier = {
        ...response.data,
        createdAt: new Date().toISOString(),
      };
      setSuppliers((prevSuppliers) => {
        const updatedSuppliers = [newSupplier, ...prevSuppliers];
        return updatedSuppliers.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.date);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.date);
          return dateB - dateA;
        });
      });
      setOpenCreate(false);
      resetForm();
      showSnackbar("Supplier/Store created successfully");
    } catch (error) {
      console.error("Create supplier/store error:", error);
      const errorMessage =
        error.response?.data?.message || "Error creating supplier/store";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleUpdate = async () => {
    const {
      supplier_id,
      supplier_name,
      supplier_contact,
      supplier_email,
      supplier_address,
      date,
    } = formData;

    if (supplier_id.length < 5 || supplier_id.length > 10) {
      showSnackbar(
        "Supplier/Store ID must be between 5 and 10 characters long",
        "error"
      );
      return;
    }
    const alphanumericRegex = /^[a-zA-Z0-9.]+$/;
    if (!alphanumericRegex.test(supplier_id)) {
      showSnackbar(
        "Supplier/Store ID can only contain letters, numbers, and dots",
        "error"
      );
      return;
    }
    try {
      const response = await axios.get("http://localhost:3500/api/supplier");
      const existingSuppliers = response.data.suppliers;
      if (
        existingSuppliers.some(
          (supplier) =>
            supplier.supplier_id === supplier_id &&
            supplier._id !== selectedSupplier._id
        )
      ) {
        showSnackbar("Supplier/Store ID already exists", "error");
        return;
      }
    } catch (error) {
      console.error("Error checking supplier/store ID uniqueness:", error);
      showSnackbar("Error validating Supplier/Store ID", "error");
      return;
    }

    if (supplier_name.length < 3 || supplier_name.length > 50) {
      showSnackbar(
        "Supplier/Store Name must be between 3 and 50 characters long",
        "error"
      );
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(supplier_name)) {
      showSnackbar(
        "Supplier/Store Name can only contain letters and spaces",
        "error"
      );
      return;
    }

    if (supplier_contact.length !== 10) {
      showSnackbar(
        "Supplier/Store Contact must be exactly 10 digits",
        "error"
      );
      return;
    }
    const contactRegex = /^[0-9]+$/;
    if (!contactRegex.test(supplier_contact)) {
      showSnackbar(
        "Supplier/Store Contact can only contain numbers",
        "error"
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplier_email)) {
      showSnackbar("Please enter a valid email address", "error");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3500/api/supplier");
      const existingSuppliers = response.data.suppliers;
      if (
        existingSuppliers.some(
          (supplier) =>
            supplier.supplier_email === supplier_email &&
            supplier._id !== selectedSupplier._id
        )
      ) {
        showSnackbar("Email already exists", "error");
        return;
      }
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      showSnackbar("Error validating Email", "error");
      return;
    }

    if (supplier_address.length < 10 || supplier_address.length > 100) {
      showSnackbar(
        "Supplier/Store Address must be between 10 and 100 characters long",
        "error"
      );
      return;
    }
    const addressRegex = /^[a-zA-Z0-9\s,.-/]+$/;
    if (!addressRegex.test(supplier_address)) {
      showSnackbar(
        "Supplier/Store Address can only contain letters, numbers, spaces, and , . - /",
        "error"
      );
      return;
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      showSnackbar("Date must be in YYYY-MM-DD format", "error");
      return;
    }
    const inputDate = new Date(date);
    const currentDate = new Date();
    if (inputDate > currentDate) {
      showSnackbar("Date cannot be in the future", "error");
      return;
    }
    const minDate = new Date("2015-03-22");
    if (inputDate < minDate) {
      showSnackbar("Date cannot be older than 10 years", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3500/api/supplier/${selectedSupplier._id}`,
        formData
      );
      setOpenUpdate(false);
      resetForm();
      fetchSuppliers();
      showSnackbar("Supplier/Store updated successfully");
    } catch (error) {
      console.error("Update supplier/store error:", error);
      const errorMessage =
        error.response?.data?.message || "Error updating supplier/store";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleDelete = async (id) => {
    setSupplierToDelete(id);
    setOpenDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3500/api/supplier/${supplierToDelete}`);
      fetchSuppliers();
      showSnackbar("Supplier/Store deleted successfully");
      setOpenDeleteConfirm(false);
      setSupplierToDelete(null);
    } catch (error) {
      console.error("Delete supplier/store error:", error);
      const errorMessage =
        error.response?.data?.message || "Error deleting supplier/store";
      showSnackbar(errorMessage, "error");
      setOpenDeleteConfirm(false);
      setSupplierToDelete(null);
    }
  };

  const handleViewClick = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenView(true);
  };

  const resetForm = () => {
    setFormData({
      supplier_id: "",
      supplier_name: "",
      supplier_contact: "",
      supplier_email: "",
      supplier_address: "",
      date: "",
      type: "Supplier",
    });
    setSelectedSupplier(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      supplier_id: supplier.supplier_id,
      supplier_name: supplier.supplier_name,
      supplier_contact: supplier.supplier_contact,
      supplier_email: supplier.supplier_email,
      supplier_address: supplier.supplier_address,
      date: supplier.date.split("T")[0],
      type: supplier.type,
    });
    setOpenUpdate(true);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const generateCSVReport = () => {
    if (suppliers.length === 0) {
      showSnackbar(
        "No suppliers/stores available to generate a report",
        "warning"
      );
      return;
    }

    const headers = [
      "Supplier/Store ID",
      "Supplier/Store Name",
      "Contact",
      "Email",
      "Address",
      "Date",
      "Type",
    ];

    const rows = suppliers.map((supplier) => [
      supplier.supplier_id,
      `"${supplier.supplier_name.replace(/"/g, '""')}"`,
      supplier.supplier_contact,
      supplier.supplier_email,
      `"${supplier.supplier_address.replace(/"/g, '""')}"`,
      new Date(supplier.date).toLocaleDateString(),
      supplier.type,
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
      `suppliers_stores_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showSnackbar("CSV report generated successfully");
    handleMenuClose();
  };

  const generatePDFReport = () => {
    if (suppliers.length === 0) {
      showSnackbar(
        "No suppliers/stores available to generate a report",
        "warning"
      );
      return;
    }

    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Supplier/Store Report", 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      const headers = [
        "Supplier/Store ID",
        "Name",
        "Contact",
        "Email",
        "Address",
        "Date",
        "Type",
      ];

      const data = suppliers.map((supplier) => [
        supplier.supplier_id || "",
        supplier.supplier_name || "",
        supplier.supplier_contact || "",
        supplier.supplier_email || "",
        supplier.supplier_address || "",
        supplier.date ? new Date(supplier.date).toLocaleDateString() : "",
        supplier.type || "",
      ]);

      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 40,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [172, 158, 255] },
        columnStyles: {
          4: { cellWidth: 40 },
          3: { cellWidth: 30 },
        },
      });

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `suppliers_stores_report_${new Date().toISOString().split(
        "T"
      )[0]}.pdf`;
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

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = [
      supplier.supplier_id || "",
      supplier.supplier_name || "",
      supplier.supplier_contact || "",
      supplier.supplier_email || "",
      supplier.supplier_address || "",
      supplier.type || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "All" || supplier.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const paginatedSuppliers = filteredSuppliers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const purpleTheme = {
    lightPurple: "#DAD5FB",
    buttonPurple: "#AC9EFF",
    buttonHover: "#9a80ff",
    accentPurple: "#7b1fa2",
  };

  const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage);
  const pageNumbers = [];
  for (let i = Math.max(0, page - 2); i < Math.min(totalPages, page + 3); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box sx={{ p: 3 }}>
      <HomeSummary />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1F2937" }}>
          Supplier/Store Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            label="Search Suppliers/Stores"
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
          <FormControl sx={{ width: 200 }} >
            <InputLabel>Filter by Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(0);
              }}
              label="Filter by Type"
              sx={{
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
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Supplier">Supplier</MenuItem>
              <MenuItem value="Store">Store</MenuItem>
            </Select>
          </FormControl>
          <Button
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
          </Button>
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreate(true)}
            sx={{
              background: "linear-gradient(135deg, #AC9EFF 0%, #7B68EE 100%)",
              color: "white",
              borderRadius: "25px",
              border: "2px solid #6A5ACD",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
              padding: "10px 20px",
              "&:hover": {
                background: "linear-gradient(135deg, #AC9EFF 0%, #7B68EE 100%)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Add Supplier/Store
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
        <Table sx={{ width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#AC9EFF" }}>
            <TableRow>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Supplier/Store ID
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Supplier/Store Name
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Supplier/Store Contact
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Supplier/Store Email
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Supplier/Store Address
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSuppliers.map((supplier) => (
              <TableRow key={supplier._id} hover>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {supplier.supplier_id}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {supplier.supplier_name}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {supplier.supplier_contact}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {supplier.supplier_email}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {supplier.supplier_address}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {new Date(supplier.date).toLocaleDateString()}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {supplier.type}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleViewClick(supplier)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(supplier)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(supplier._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredSuppliers.length > 4 && (
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
                <MenuItem value={4}>4</MenuItem>
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
                filteredSuppliers.length
              )} of ${filteredSuppliers.length}`}
            </Typography>
          </Box>
        )}
      </TableContainer>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Create Supplier/Store
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) =>
              key === "type" ? (
                <Grid item xs={12} key={key}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      label="Type"
                    >
                      <MenuItem value="Supplier">Supplier</MenuItem>
                      <MenuItem value="Store">Store</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ) : key === "date" ? (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#6A5ACD",
                        },
                        "&:hover fieldset": {
                          borderColor: "#7B68EE",
                        },
                      },
                    }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key
                      .replace("supplier_", "Supplier/Store ")
                      .replace("_", " ")
                      .toUpperCase()}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    type="text"
                    variant="outlined"
                  />
                </Grid>
              )
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleCreate}
                fullWidth
                sx={{
                  backgroundColor: purpleTheme.buttonPurple,
                  color: "white",
                  "&:hover": { backgroundColor: purpleTheme.buttonHover },
                }}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <Modal open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              p: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Supplier/Store
            </Typography>
            <Grid container spacing={2}>
              {Object.keys(formData).map((key) =>
                key === "type" ? (
                  <Grid item xs={12} key={key}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Type</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        label="Type"
                      >
                        <MenuItem value="Supplier">Supplier</MenuItem>
                        <MenuItem value="Store">Store</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                ) : key === "date" ? (
                  <Grid item xs={12} key={key}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      type="date"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#6A5ACD",
                          },
                          "&:hover fieldset": {
                            borderColor: "#7B68EE",
                          },
                        },
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} key={key}>
                    <TextField
                      fullWidth
                      label={key
                        .replace("supplier_", "Supplier/Store ")
                        .replace("_", " ")
                        .toUpperCase()}
                      name={key}
                      value={formData[key]}
                      onChange={handleInputChange}
                      type="text"
                      variant="outlined"
                    />
                  </Grid>
                )
              )}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    pt: 2,
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    sx={{
                      backgroundColor: purpleTheme.buttonPurple,
                      color: "white",
                      "&:hover": { backgroundColor: purpleTheme.buttonHover },
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenUpdate(false)}
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
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>

      <Modal open={openView} onClose={() => setOpenView(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            View Supplier/Store Details
          </Typography>
          {selectedSupplier && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER/STORE ID"
                  value={selectedSupplier.supplier_id}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER/STORE NAME"
                  value={selectedSupplier.supplier_name}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER/STORE CONTACT"
                  value={selectedSupplier.supplier_contact}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER/STORE EMAIL"
                  value={selectedSupplier.supplier_email}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER/STORE ADDRESS"
                  value={selectedSupplier.supplier_address}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DATE"
                  value={new Date(selectedSupplier.date).toLocaleDateString()}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="TYPE"
                  value={selectedSupplier.type}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenView(false)}
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
                  Close
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      <Modal open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <Box sx={{ ...modalStyle, width: { xs: "90%", sm: 350 } }}>
          <Typography variant="h6" gutterBottom>
            Confirm Deletion
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this supplier/store?
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={confirmDelete}
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteConfirm(false)}
              sx={{
                color: purpleTheme.buttonPurple,
                borderColor: purpleTheme.buttonPurple,
                "&:hover": {
                  borderColor: purpleTheme.buttonHover,
                  color: purpleTheme.buttonHover,
                },
              }}
            >
              No
            </Button>
          </Box>
        </Box>
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

export default SupplierService;