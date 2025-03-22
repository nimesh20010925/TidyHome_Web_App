import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConsumptionService } from '../../../services/consumptionServices';
import { InventoryService } from '../../../services/InventoryServices';
import { Modal as BootstrapModal, Form, Button, Spinner, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './consumptionCreateModel.css';


const ConsumptionCreateModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    amount_used: '',
    user: '',
    date: '',
    remaining_stock: '',
    notes: '',
  });
  const [itemNames, setItemNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const items = await InventoryService.getAllInventoryItems();
        setInventoryItems(items);
        const names = items.map(item => item.itemName);
        setItemNames(names);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        user: userData.name,
      }));
    } else {
      console.error("No user data found in localStorage");
    }

    if (isOpen) {
      fetchInventoryData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.product_name && formData.amount_used) {
      const selectedItem = inventoryItems.find(
        item => item.itemName === formData.product_name
      );
      if (selectedItem) {
        const currentStock = selectedItem.quantity;
        const remaining = parseFloat(currentStock) - parseFloat(formData.amount_used);
        setFormData(prev => ({
          ...prev,
          remaining_stock: remaining >= 0 ? remaining.toString() : '0'
        }));
      }
    }
  }, [formData.product_name, formData.amount_used, inventoryItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      await ConsumptionService.createConsumption(formData);
      closeModal();
    } catch (error) {
      console.error('Error creating consumption:', error);
    }
  };

  return (
    <BootstrapModal
      show={isOpen}
      onHide={closeModal}
      centered
      className="ccm-consumption-modal"
    >
      <BootstrapModal.Header className="ccm-modal-header bg-gradient-primary text-white">
        <BootstrapModal.Title>Create Consumption</BootstrapModal.Title>
        <Button variant="close" onClick={closeModal} aria-label="Close" />
      </BootstrapModal.Header>
      <BootstrapModal.Body className="ccm-modal-body">
        {loading ? (
          <div className="ccm-text-center ccm-py-5">
            <Spinner animation="border" variant="primary" />
            <p className="ccm-mt-2">Loading inventory data...</p>
          </div>
        ) : (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel controlId="productName" label="Product Name" className="ccm-mb-3">
              <Form.Select
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                required
                aria-label="Select product name"
              >
                <option value="">Select a product</option>
                {itemNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a product.
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="amountUsed" label="Amount Used" className="ccm-mb-3">
              <Form.Control
                type="number"
                name="amount_used"
                value={formData.amount_used}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter amount used"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid amount (greater than or equal to 0).
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="user" label="User" className="ccm-mb-3">
              <Form.Control
                type="text"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                disabled
                placeholder="User"
              />
            </FloatingLabel>

            <FloatingLabel controlId="date" label="Date" className="ccm-mb-3">
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={getTodayDate()} // Restrict to today and future dates
              />
              <Form.Control.Feedback type="invalid">
                Please select a date from today onwards.
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel controlId="remainingStock" label="Remaining Stock" className="ccm-mb-3">
              <Form.Control
                type="text"
                name="remaining_stock"
                value={formData.remaining_stock}
                readOnly
                placeholder="Remaining stock"
              />
            </FloatingLabel>

            <FloatingLabel controlId="notes" label="Notes" className="ccm-mb-3">
              <Form.Control
                as="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Add notes"
              />
              <Form.Control.Feedback type="invalid">
                Please add some notes.
              </Form.Control.Feedback>
            </FloatingLabel>

            <div className="ccm-d-flex ccm-gap-2 ccm-justify-content-end">
              <Button
                variant="secondary"
                onClick={closeModal}
                className="ccm-modal-btn"
              >
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ccm-modal-btn"
              >
                Submit
              </Button>
            </div>
          </Form>
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