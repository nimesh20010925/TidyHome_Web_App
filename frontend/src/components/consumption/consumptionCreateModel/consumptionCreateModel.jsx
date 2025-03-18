// Modal.js
import  { useState } from 'react';
import PropTypes from 'prop-types'; 
import { ConsumptionService } from '../../../services/consumptionServices'; 
import './consumptionCreateModel.css'; 
const Modal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    amount_used: '',
    user: '',
    date: '',
    remaining_stock: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ConsumptionService.createConsumption(formData); // Use the service to create consumption
      closeModal(); // Close the modal after submitting
    } catch (error) {
      console.error('Error creating consumption:', error);
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Create Consumption</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Amount Used</label>
              <input
                type="text"
                name="amount_used"
                value={formData.amount_used}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>User</label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Remaining Stock</label>
              <input
                type="text"
                name="remaining_stock"
                value={formData.remaining_stock}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
            <button type="button" onClick={closeModal}>
              Close
            </button>
          </form>
        </div>
      </div>
    )
  );
};

// Add prop validation
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  closeModal: PropTypes.func.isRequired, 
};

export default Modal;