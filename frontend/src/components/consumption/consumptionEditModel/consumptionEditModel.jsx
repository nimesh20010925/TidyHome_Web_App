import  { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import PropTypes from "prop-types"; 

const EditModal = ({ open, onClose, item, onSave }) => {
  const [editedItem, setEditedItem] = useState(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedItem); 
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 2, maxWidth: 400, margin: "0 auto", backgroundColor: "white", borderRadius: 2 }}>
        <Typography variant="h6">Edit Consumption</Typography>
        <TextField
          label="Product Name"
          name="product_name"
          value={editedItem?.product_name || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount Used"
          name="amount_used"
          value={editedItem?.amount_used || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="User"
          name="user"
          value={editedItem?.user || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Remaining Stock"
          name="remaining_stock"
          value={editedItem?.remaining_stock || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Notes"
          name="notes"
          value={editedItem?.notes || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: 2 }}>
          Save Changes
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose} sx={{ marginTop: 2, marginLeft: 1 }}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

// Add prop types validation
EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditModal;