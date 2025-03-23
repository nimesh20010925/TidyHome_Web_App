import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import PropTypes from "prop-types";
import deleteIcon from "../../../assets/inventory/delete-red.png";
import editIcon from "../../../assets/shoppingList/edit-item-black.png";

const ShoppingListModal = ({ isOpen, toggle }) => {
  const items = [
    { name: "BELLOSE Conditioner (100ml)", price: 1000, urgent: true },
    { name: "POND’S White Beauty Cream (50ml)", price: 1500, urgent: true },
    { name: "Nature’s Secrets Aloera Cream (50ml)", price: 800 },
    { name: "Nature’s Secrets Carrot Face Wash (100ml)", price: 1400 },
    { name: "Gillette Sensor 3 Razor x 3", price: 300 },
  ];

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="shopping-list-modal-container"
      scrollable
    >
      <ModalHeader toggle={toggle} className="shopping-list-modal-header">
        Personal & Beauty Care Shopping List
      </ModalHeader>
      <ModalBody className="shopping-list-modal-body">
        <div className="shopping-details-section">
          <p className="shopping-date">Shopping Date: 2025-03-21</p>
          <p className="shopping-items-count">No. of Items: {items.length}</p>
        </div>

        {items.map((item, index) => (
          <div className="shopping-item-card" key={index}>
            {item.urgent && <span className="shopping-urgent-icon">★</span>}
            <div className="shopping-item-info">
              <p className="shopping-item-name">{item.name}</p>
              <p className="shopping-item-price">Rs.{item.price.toFixed(2)}</p>
            </div>
            <div className="shopping-action-icons">
              <Button className="shopping-modal-delete-btn">
                <img src={deleteIcon} alt="Delete" width={40} height={40}/>
              </Button>
              <Button className="shopping-model-edit-btn">
                <img src={editIcon} alt="Delete" width={40} height={36}/>
              </Button>
            </div>
          </div>
        ))}

        <div className="shopping-summary">
          <p className="shopping-urgent-cost">
            Estimated Urgent Items Cost: Rs. 2,500.00
          </p>
          <p className="shopping-total-cost">
            Estimated Total Shopping Cost: Rs. 5,000.00
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
};

ShoppingListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default ShoppingListModal;
