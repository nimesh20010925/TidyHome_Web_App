import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Modal, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Grid, Snackbar, Alert,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete, Add, Visibility, ArrowBack, ArrowForward } from '@mui/icons-material';

const SupplierService = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    supplier_id: '',
    supplier_name: '',
    supplier_contact: '',
    supplier_email: '',
    supplier_address: '',
    date: '',
    type: 'Supplier'
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:3500/api/supplier');
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Fetch suppliers error:', error);
      const errorMessage = error.response?.data?.message || 'Error fetching suppliers';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3500/api/supplier/create', formData);
      setOpenCreate(false);
      resetForm();
      fetchSuppliers();
      showSnackbar('Supplier created successfully');
    } catch (error) {
      console.error('Create supplier error:', error);
      const errorMessage = error.response?.data?.message || 'Error creating supplier';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3500/api/supplier/${selectedSupplier._id}`, formData);
      setOpenUpdate(false);
      resetForm();
      fetchSuppliers();
      showSnackbar('Supplier updated successfully');
    } catch (error) {
      console.error('Update supplier error:', error);
      const errorMessage = error.response?.data?.message || 'Error updating supplier';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:3500/api/supplier/${id}`);
        fetchSuppliers();
        showSnackbar('Supplier deleted successfully');
      } catch (error) {
        console.error('Delete supplier error:', error);
        const errorMessage = error.response?.data?.message || 'Error deleting supplier';
        showSnackbar(errorMessage, 'error');
      }
    }
  };

  const handleViewClick = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenView(true);
  };

  const resetForm = () => {
    setFormData({
      supplier_id: '',
      supplier_name: '',
      supplier_contact: '',
      supplier_email: '',
      supplier_address: '',
      date: '',
      type: 'Supplier'
    });
    setSelectedSupplier(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({ ...supplier, date: supplier.date.split('T')[0] });
    setOpenUpdate(true);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
  };

  const paginatedSuppliers = suppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Custom Purple Theme
  const purpleTheme = {
    lightPurple: '#DAD5FB', // Table header
    buttonPurple: '#AC9EFF', // Add Supplier button
    buttonHover: '#9a80ff', // Hover for Add Supplier button
    accentPurple: '#7b1fa2', // Pagination accent
  };

  // Pagination Logic
  const totalPages = Math.ceil(suppliers.length / rowsPerPage);
  const pageNumbers = [];
  for (let i = Math.max(0, page - 2); i < Math.min(totalPages, page + 3); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenCreate(true)}
        sx={{
          mb: 2,
          backgroundColor: purpleTheme.buttonPurple,
          color: 'white',
          '&:hover': { backgroundColor: purpleTheme.buttonHover },
          float: 'right',
        }}
      >
        Add Supplier
      </Button>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 2 }}>
        <Table sx={{ width: '100%' }}>
          <TableHead sx={{ backgroundColor: purpleTheme.lightPurple }}>
            <TableRow>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>ID</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Contact</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Email</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Address</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Date</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Type</TableCell>
              <TableCell sx={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSuppliers.map((supplier) => (
              <TableRow key={supplier._id} hover>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{supplier.supplier_id}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{supplier.supplier_name}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{supplier.supplier_contact}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{supplier.supplier_email}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{supplier.supplier_address}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(supplier.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>{supplier.type}</TableCell>
                <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <IconButton color="primary" onClick={() => handleViewClick(supplier)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditClick(supplier)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(supplier._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Advanced Pagination */}
        {suppliers.length > 4 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              backgroundColor: '#f9f9f9',
              borderTop: '1px solid #e0e0e0',
            }}
          >
            {/* Rows Per Page Dropdown */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                label="Rows per page"
                sx={{
                  color: purpleTheme.accentPurple,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: purpleTheme.accentPurple,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: purpleTheme.buttonHover,
                  },
                }}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>
            </FormControl>

            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                sx={{
                  color: page === 0 ? '#bdbdbd' : purpleTheme.accentPurple,
                  '&:hover': {
                    backgroundColor: `${purpleTheme.accentPurple}20`,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ArrowBack />
              </IconButton>

              {pageNumbers.map((num) => (
                <Button
                  key={num}
                  onClick={() => handleChangePage(num)}
                  sx={{
                    minWidth: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: page === num ? purpleTheme.accentPurple : 'transparent',
                    color: page === num ? 'white' : purpleTheme.accentPurple,
                    '&:hover': {
                      backgroundColor: page === num ? purpleTheme.accentPurple : `${purpleTheme.accentPurple}20`,
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    fontWeight: 'bold',
                  }}
                >
                  {num + 1}
                </Button>
              ))}

              <IconButton
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
                sx={{
                  color: page >= totalPages - 1 ? '#bdbdbd' : purpleTheme.accentPurple,
                  '&:hover': {
                    backgroundColor: `${purpleTheme.accentPurple}20`,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>

            {/* Page Info */}
            <Typography
              sx={{
                color: purpleTheme.accentPurple,
                fontWeight: 'bold',
              }}
            >
              {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, suppliers.length)} of ${suppliers.length}`}
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Create Modal */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Create Supplier</Typography>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) =>
              key === 'type' ? (
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
              ) : (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key.replace('_', ' ').toUpperCase()}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    type={key === 'date' ? 'date' : 'text'}
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
                  color: 'white',
                  '&:hover': { backgroundColor: purpleTheme.buttonHover },
                }}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Update Modal */}
      <Modal open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Update Supplier</Typography>
          <Grid container spacing={2}>
            {Object.keys(formData).map((key) =>
              key === 'type' ? (
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
              ) : (
                <Grid item xs={12} key={key}>
                  <TextField
                    fullWidth
                    label={key.replace('_', ' ').toUpperCase()}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    type={key === 'date' ? 'date' : 'text'}
                    variant="outlined"
                  />
                </Grid>
              )
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                fullWidth
                sx={{
                  backgroundColor: purpleTheme.buttonPurple,
                  color: 'white',
                  '&:hover': { backgroundColor: purpleTheme.buttonHover },
                }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* View Modal */}
      <Modal open={openView} onClose={() => setOpenView(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>View Supplier Details</Typography>
          {selectedSupplier && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER ID"
                  value={selectedSupplier.supplier_id}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER NAME"
                  value={selectedSupplier.supplier_name}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER CONTACT"
                  value={selectedSupplier.supplier_contact}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER EMAIL"
                  value={selectedSupplier.supplier_email}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SUPPLIER ADDRESS"
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
                    '&:hover': { borderColor: purpleTheme.buttonHover, color: purpleTheme.buttonHover },
                  }}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          )}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierService;