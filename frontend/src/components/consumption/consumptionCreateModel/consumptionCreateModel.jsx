// Frontend/src/components/ConsumptionCreateModal.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ConsumptionService } from "../../../services/consumptionServices";
import { InventoryService } from "../../../services/InventoryServices";
import {
  Modal as BootstrapModal,
  Form,
  Button,
  Spinner,
  FloatingLabel,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./consumptionCreateModel.css";

const ConsumptionCreateModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    amount_used: "",
    date: "",
    remaining_stock: "",
    notes: "",
  });
  const [itemNames, setItemNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [homeId, setHomeId] = useState("");

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.homeID) {
          setError("User does not belong to any home");
          setLoading(false);
          return;
        }
        setHomeId(user.homeID);
        const items = await InventoryService.getAllInventoryItems(user.homeID);
        setInventoryItems(items);
        const names = items.map((item) => item.itemName);
        setItemNames(names);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        setError("Failed to load inventory items");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchInventoryData();
      setFormData({
        product_name: "",
        amount_used: "",
        date: getTodayDate(),
        remaining_stock: "",
        notes: "",
      });
      setError("");
      setValidated(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.product_name && formData.amount_used) {
      const selectedItem = inventoryItems.find(
        (item) => item.itemName === formData.product_name
      );
      if (selectedItem) {
        const currentStock = selectedItem.quantity;
        const remaining = currentStock - parseFloat(formData.amount_used || 0);
        setFormData((prev) => ({
          ...prev,
          remaining_stock: remaining >= 0 ? remaining.toString() : "0",
        }));
      }
    }
  }, [formData.product_name, formData.amount_used, inventoryItems]); // Fixed dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await ConsumptionService.createConsumption({ ...formData, homeId });
      closeModal();
    } catch (error) {
      console.error("Error creating consumption:", error);
      setError(error.response?.data?.message || "Failed to create consumption");
    }
  };

  return (
    <BootstrapModal
      show={isOpen}
      onHide={closeModal}
      centered
      className="ccm-modal"
    >
      <BootstrapModal.Header className="ccm-modal-header">
        <BootstrapModal.Title>Create Consumption</BootstrapModal.Title>
        <Button
          variant="link"
          onClick={closeModal}
          aria-label="Close"
          className="ccm-close-btn"
        >
          ×
        </Button>
      </BootstrapModal.Header>
      <BootstrapModal.Body className="ccm-modal-body">
        {loading ? (
          <div className="ccm-loading">
            <Spinner animation="border" variant="primary" />
            <p>Loading inventory data...</p>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="danger" className="ccm-alert">
                {error}
              </Alert>
            )}
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              className="ccm-form"
            >
              <FloatingLabel
                controlId="productName"
                label="Product Name"
                className="ccm-form-group"
              >
                <Form.Select
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  required
                  aria-label="Select product name"
                  className="ccm-form-control"
                >
                  <option value="">Select a product</option>
                  {itemNames.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid" className="ccm-feedback">
                  Please select a product.
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel
                controlId="amountUsed"
                label="Amount Used"
                className="ccm-form-group"
              >
                <Form.Control
                  type="number"
                  name="amount_used"
                  value={formData.amount_used}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter amount used"
                  className="ccm-form-control"
                />
                <Form.Control.Feedback type="invalid" className="ccm-feedback">
                  Please enter a valid amount (greater than or equal to 0).
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel
                controlId="date"
                label="Date"
                className="ccm-form-group"
              >
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={getTodayDate()}
                  className="ccm-form-control"
                />
                <Form.Control.Feedback type="invalid" className="ccm-feedback">
                  Please select a date from today onwards.
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel
                controlId="remainingStock"
                label="Remaining Stock"
                className="ccm-form-group"
              >
                <Form.Control
                  type="text"
                  name="remaining_stock"
                  value={formData.remaining_stock}
                  readOnly
                  placeholder="Remaining stock"
                  className="ccm-form-control ccm-readonly"
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="notes"
                label="Notes"
                className="ccm-form-group"
              >
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  minLength={5}
                  maxLength={10}
                  placeholder="Add notes (5-10 chars)"
                  className="ccm-form-control"
                />
                <Form.Control.Feedback type="invalid" className="ccm-feedback">
                  {formData.notes.length === 0
                    ? "Please add some notes."
                    : formData.notes.length < 5
                    ? "Notes must be at least 5 characters."
                    : "Notes cannot exceed 10 characters."}
                </Form.Control.Feedback>
              </FloatingLabel>

              <div className="ccm-button-group">
                <Button
                  variant="outline-secondary"
                  onClick={closeModal}
                  className="ccm-btn ccm-btn-cancel"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="ccm-btn ccm-btn-submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </>
        )}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

ConsumptionCreateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ConsumptionCreateModal;
