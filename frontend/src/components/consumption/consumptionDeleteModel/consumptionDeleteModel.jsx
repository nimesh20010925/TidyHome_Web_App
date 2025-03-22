import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Warning as WarningIcon, Delete as DeleteIcon, Cancel as CancelIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

const DeleteModal = ({ open, onClose, item, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (item) {
      setLoading(true);
      try {
        await onDelete(item._id); // Trigger deletion in parent (assuming it returns a Promise)
        setLoading(false);
        onClose(); // Close modal
        window.location.reload(); // Refresh the page
      } catch (error) {
        console.error("Error deleting item:", error);
        setLoading(false);
      }
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
            width: { xs: "90%", sm: 400 },
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            p: 3,
            background: "linear-gradient(135deg, #ffffff, #f5f7fa)",
          }}
        >
          <Box
            sx={{
              bgcolor: "error.main",
              color: "white",
              p: 2,
              borderRadius: "12px 12px 0 0",
              background: "linear-gradient(90deg, #d32f2f, #f44336)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <WarningIcon />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Delete Consumption
            </Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
              Are you sure you want to delete this consumption record?
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Product:</strong> {item?.product_name || "N/A"}
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress size={24} color="error" />
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  startIcon={<DeleteIcon />}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    background: "linear-gradient(90deg, #d32f2f, #f44336)",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onClose}
                  startIcon={<CancelIcon />}
                  disabled={loading}
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
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

DeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_name: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteModal;