import { Modal, Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types"; 

const DeleteModal = ({ open, onClose, item, onDelete }) => {
  const handleDelete = () => {
    if (item) {
      onDelete(item._id); // Trigger deletion in parent
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 2, maxWidth: 400, margin: "0 auto", backgroundColor: "white", borderRadius: 2 }}>
        <Typography variant="h6">Delete Consumption</Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Are you sure you want to delete this consumption record?
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          <strong>{item?.product_name}</strong>
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          sx={{ marginRight: 2 }}
        >
          Delete
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

// Prop Types
DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteModal;