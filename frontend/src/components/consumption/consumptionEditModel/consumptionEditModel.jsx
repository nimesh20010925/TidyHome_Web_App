// frontend/src/components/EditModal.js
import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Fade,
  InputAdornment,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Note as NoteIcon,
  ShoppingCart as ShoppingCartIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { InventoryService } from "../../../services/InventoryServices";

const EditModal = ({ open, onClose, item, onSave }) => {
  const [editedItem, setEditedItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const items = await InventoryService.getAllInventoryItems();
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    fetchInventoryData();

    // Only set editedItem if item is valid
    if (item && typeof item === "object") {
      setEditedItem({
        ...item,
        date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      });
    } else {
      setEditedItem(null); // Reset if item is invalid
    }
    setErrors({});
  }, [item]);

  useEffect(() => {
    // Only calculate remaining_stock if editedItem is valid
    if (
      editedItem &&
      editedItem.product_name &&
      editedItem.amount_used &&
      inventoryItems.length > 0
    ) {
      const selectedItem = inventoryItems.find(
        (inv) => inv.itemName === editedItem.product_name
      );
      if (selectedItem) {
        const originalAmountUsed = parseFloat(item?.amount_used || 0);
        const newAmountUsed = parseFloat(editedItem.amount_used || 0);
        const stockDifference = originalAmountUsed - newAmountUsed;
        const newStock = selectedItem.quantity + stockDifference;
        setEditedItem((prev) => ({
          ...prev,
          remaining_stock: newStock >= 0 ? newStock.toString() : "0",
        }));
      }
    }
  }, [editedItem?.product_name, editedItem?.amount_used, inventoryItems, item]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const today = getTodayDate();

    if (!editedItem?.product_name)
      newErrors.product_name = "Product name is required";
    if (
      !editedItem?.amount_used ||
      isNaN(editedItem.amount_used) ||
      parseFloat(editedItem.amount_used) < 0
    )
      newErrors.amount_used = "Enter a valid amount (≥ 0)";
    if (!editedItem?.user) newErrors.user = "User is required";
    if (
      !editedItem?.remaining_stock ||
      isNaN(editedItem.remaining_stock) ||
      parseFloat(editedItem.remaining_stock) < 0
    )
      newErrors.remaining_stock = "Remaining stock cannot be negative";
    if (!editedItem?.notes) newErrors.notes = "Notes are required";
    if (!editedItem?.date) {
      newErrors.date = "Date is required";
    } else if (editedItem.date < today) {
      newErrors.date = "Date must be today or a future date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (editedItem && validateForm()) {
      onSave(editedItem);
      onClose();
    }
  };

  // Don't render the modal content if editedItem is not initialized
  if (!editedItem) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 450 },
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            p: 3,
            background: "linear-gradient(135deg, #ffffff, #f5f7fa)",
          }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 2,
              borderRadius: "12px 12px 0 0",
              background: "linear-gradient(to right, #C799FF, #8f94fb)",
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Edit Consumption
            </Typography>
          </Box>

          <TextField
            label="Product Name"
            name="product_name"
            value={editedItem.product_name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.product_name}
            helperText={errors.product_name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ShoppingCartIcon />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Amount Used"
            name="amount_used"
            type="number"
            value={editedItem.amount_used || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.amount_used}
            helperText={errors.amount_used}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="User"
            name="user"
            value={editedItem.user || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.user}
            helperText={errors.user}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Date"
            name="date"
            type="date"
            value={editedItem.date || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: getTodayDate() }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Remaining Stock"
            name="remaining_stock"
            type="number"
            value={editedItem.remaining_stock || ""}
            fullWidth
            disabled
            margin="normal"
            variant="outlined"
            error={!!errors.remaining_stock}
            helperText={errors.remaining_stock}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InventoryIcon />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            label="Notes"
            name="notes"
            value={editedItem.notes || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            error={!!errors.notes}
            helperText={errors.notes}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NoteIcon />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              startIcon={<CancelIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    product_name: PropTypes.string,
    amount_used: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    remaining_stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notes: PropTypes.string,
  }), // Allow item to be null/undefined
  onSave: PropTypes.func.isRequired,
};

export default EditModal;
