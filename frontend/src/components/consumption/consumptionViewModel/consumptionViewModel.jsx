import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ConsumptionService } from "../../../services/consumptionServices";
import PropTypes from "prop-types";

// Custom styled components for enhanced beauty
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    maxWidth: "500px",
    padding: theme.spacing(0),
    width: "100%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(to right, #C799FF, #8f94fb) !important;",
  color: "#fff",
  padding: theme.spacing(2),
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#fafafa",
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
}));

const ViewModal = ({ open, onClose, item }) => {
  const [extraData, setExtraData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExtraData = async () => {
      if (item) {
        setLoading(true);
        try {
          const response = await ConsumptionService.getExtraConsumptionData(item._id);
          setExtraData(response);
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
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>
        <Typography variant="h6" component="div">
          View Consumption Record
        </Typography>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Box>
          <InfoRow>
            <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
              Product Name:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {item.product_name}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
              Amount Used:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {item.amount_used}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
              User:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {item.user}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
              Date:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {new Date(item.date).toLocaleDateString()}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
              Remaining Stock:
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {item.remaining_stock}
            </Typography>
          </InfoRow>
          <InfoRow>
            <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
              Notes:
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ wordBreak: "break-word" }}>
              {item.notes}
            </Typography>
          </InfoRow>

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <CircularProgress size={24} color="primary" />
              <Typography variant="body2" color="textSecondary" ml={2}>
                Loading additional data...
              </Typography>
            </Box>
          )}

          {extraData && (
            <>
              <Divider sx={{ my: 2 }} />
              <InfoRow>
                <Typography variant="subtitle1" color="textPrimary" fontWeight="bold">
                  Extra Data:
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {extraData}
                </Typography>
              </InfoRow>
            </>
          )}
        </Box>
      </StyledDialogContent>
      <DialogActions sx={{ p: 2, backgroundColor: "#fafafa", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
        <StyledButton onClick={onClose}  variant="contained" style={{ backgroundColor: "#C799FF", color: "#fff" }}>
          Close
        </StyledButton>
      </DialogActions>
    </StyledDialog>
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