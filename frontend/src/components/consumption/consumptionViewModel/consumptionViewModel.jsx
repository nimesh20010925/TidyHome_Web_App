import  { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { ConsumptionService } from "../../../services/consumptionServices";
import PropTypes from "prop-types"; // Import PropTypes

const ViewModal = ({ open, onClose, item }) => {
  const [extraData, setExtraData] = useState(null); // State to hold additional data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExtraData = async () => {
      if (item) {
        setLoading(true);
        try {
          const response = await ConsumptionService.getExtraConsumptionData(item._id); // Fetch additional data (for example)
          setExtraData(response); // Set additional data in state
        } catch (error) {
          console.error("Failed to fetch additional data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) {
      fetchExtraData();
    }
  }, [open, item]);

  if (!item) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>View Consumption Record</DialogTitle>
      <DialogContent>
        <Typography variant="body1"><strong>Product Name:</strong> {item.product_name}</Typography>
        <Typography variant="body1"><strong>Amount Used:</strong> {item.amount_used}</Typography>
        <Typography variant="body1"><strong>User:</strong> {item.user}</Typography>
        <Typography variant="body1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</Typography>
        <Typography variant="body1"><strong>Remaining Stock:</strong> {item.remaining_stock}</Typography>
        <Typography variant="body1"><strong>Notes:</strong> {item.notes}</Typography>

        {loading && <Typography variant="body2" color="textSecondary">Loading additional data...</Typography>}
        
        {extraData && (
          <div>
            <Typography variant="body1"><strong>Extra Data:</strong> {extraData}</Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
ViewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    amount_used: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    remaining_stock: PropTypes.number.isRequired,
    notes: PropTypes.string.isRequired,
  }).isRequired,
};

export default ViewModal;