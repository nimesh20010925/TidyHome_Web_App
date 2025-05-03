import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Fade,
  InputAdornment,
  MenuItem,
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
  const [editedItem, setEditedItem] = useState({
    product_name: "",
    amount_used: "",
    user: "",
    date: "",
    remaining_stock: "",
    notes: "",
    _id: "",
  });
  const [errors, setErrors] = useState({});
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.homeID) {
          setErrors({ general: "User does not belong to any home" });
          return;
        }
        const items = await InventoryService.getAllInventoryItems(user.homeID);
        setInventoryItems(items);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        setErrors({ general: "Failed to load inventory items" });
      }
    };

    fetchInventoryData();

    // Initialize editedItem with item data and logged-in user's name
    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "Unknown User"; // Adjust based on your user object structure

    if (item && typeof item === "object") {
      setEditedItem({
        _id: item._id || "",
        product_name: item.product_name || "",
        amount_used: item.amount_used?.toString() || "",
        user: item.user || userName, // Pre-populate with logged-in user's name if item.user is empty
        date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
        remaining_stock: item.remaining_stock?.toString() || "",
        notes: item.notes || "",
      });
      setErrors({});
    }
  }, [item]);

  useEffect(() => {
    // Calculate remaining_stock when product_name or amount_used changes
    if (
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
          remaining_stock: newStock >= 0 ? newStock.toFixed(3) : "0",
        }));
      }
    }
  }, [editedItem.product_name, editedItem.amount_used, inventoryItems, item]);

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

    if (!editedItem.product_name)
      newErrors.product_name = "Product name is required";
    if (
      !editedItem.amount_used ||
      isNaN(editedItem.amount_used) ||
      parseFloat(editedItem.amount_used) <= 0
    )
      newErrors.amount_used = "Enter a valid amount (> 0)";
    if (!editedItem.user) newErrors.user = "User is required";
    if (
      !editedItem.remaining_stock ||
      isNaN(editedItem.remaining_stock) ||
      parseFloat(editedItem.remaining_stock) < 0
    )
      newErrors.remaining_stock = "Remaining stock cannot be negative";
    if (!editedItem.notes || editedItem.notes.length < 5)
      newErrors.notes = "Notes must be at least 5 characters";
    if (!editedItem.date) {
      newErrors.date = "Date is required";
    } else if (editedItem.date < today) {
      newErrors.date = "Date must be today or a future date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...editedItem,
        amount_used: parseFloat(editedItem.amount_used),
        remaining_stock: parseFloat(editedItem.remaining_stock),
      });
      onClose();
    }
  };

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
          -OrReplace
          {errors.general && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errors.general}
            </Typography>
          )}
          <TextField
            select
            label="Product Name"
            name="product_name"
            value={editedItem.product_name || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
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
          >
            {inventoryItems.map((inv, index) => (
              <MenuItem key={index} value={inv.itemName}>
                {inv.itemName}
              </MenuItem>
            ))}
          </TextField>
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
              inputProps: { min: 0, step: 0.01 },
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
            // disabled // Uncomment this line to make the user field read-only
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
    _id: PropTypes.string,
    product_name: PropTypes.string,
    amount_used: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    remaining_stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notes: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default EditModal;
