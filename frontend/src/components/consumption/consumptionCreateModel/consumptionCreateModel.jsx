import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ConsumptionService } from '../../../services/consumptionServices';
import { InventoryService } from '../../../services/InventoryServices';
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
  
  const [itemNames, setItemNames] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]); // Store full inventory items
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const items = await InventoryService.getAllInventoryItems();
        setInventoryItems(items);
        const names = items.map(item => item.itemName);
        setItemNames(names);
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        user: userData.name, // Changed from username to user
      }));
    } else {
      console.error("No user data found in localStorage");
    }

    if (isOpen) {
      fetchInventoryData();
    }
  }, [isOpen]);

  // Update remaining stock when product or amount used changes
  useEffect(() => {
    if (formData.product_name && formData.amount_used) {
      const selectedItem = inventoryItems.find(
        item => item.itemName === formData.product_name
      );
      if (selectedItem) {
        const currentStock = selectedItem.quantity; // Assuming quantity field exists in inventory item
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
    try {
      await ConsumptionService.createConsumption(formData);
      closeModal();
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
                list="productNames"
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                required
              />
              <datalist id="productNames">
                {itemNames.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
            </div>
            <div>
              <label>Amount Used</label>
              <input
                type="number"
                name="amount_used"
                value={formData.amount_used}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div>
              <label>User</label>
              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleInputChange}
                disabled
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
                readOnly 
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

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;