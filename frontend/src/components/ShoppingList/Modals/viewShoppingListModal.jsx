import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import PropTypes from "prop-types";

const ShoppingListModal = ({ isOpen, toggle, selectedShoppingList }) => {
  const [shoppingListItems, setShoppingListItems] = useState([]);
  const [urgentItemsCost, setUrgentItemsCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setShoppingListItems(selectedShoppingList.itemList);
    console.log(selectedShoppingList);
  }, [selectedShoppingList]);

  useEffect(() => {
    try {
      const sum = (shoppingListItems || []).reduce(
        (total, item) => total + (item?.estimatedItemCost || 0),
        0
      );
      setTotalCost(sum);
    } catch (error) {
      console.error("Error calculating total:", error);
      setTotalCost(0);
    }
  }, [shoppingListItems]);

  useEffect(() => {
    const { total, urgentTotal } = (shoppingListItems || []).reduce(
      (acc, item) => {
        const cost = Number(item?.estimatedItemCost) || 0;
        return {
          total: acc.total + cost,
          urgentTotal: item?.isUrgent
            ? acc.urgentTotal + cost
            : acc.urgentTotal,
        };
      },
      { total: 0, urgentTotal: 0 }
    );

    setTotalCost(total);
    setUrgentItemsCost(urgentTotal);
  }, [shoppingListItems]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="shopping-list-modal-container"
      scrollable
    >
      <ModalHeader toggle={toggle} className="shopping-list-modal-header">
        {selectedShoppingList.listName}
      </ModalHeader>
      <ModalBody className="shopping-list-modal-body">
        <div className="shopping-details-section">
          <p className="shopping-date">
            Shopping Date:{" "}
            {new Date(selectedShoppingList.shoppingDate).toLocaleDateString()}
          </p>
          <p className="shopping-items-count">
            No. of Items: {shoppingListItems?.length}
          </p>
        </div>

        {shoppingListItems?.map((item, index) => (
          <div
            className="shopping-item-card"
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {item.isUrgent && <span className="shopping-urgent-icon">★</span>}

            <div style={{ flex: 2 }}>
              <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>
                {item.itemName}
              </p>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                {Number(item.price).toLocaleString(undefined, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{" "}
                LKR
              </p>
            </div>

            <div
              style={{
                flex: 1,
                fontSize: "18px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#976bdb",
                marginLeft: item.isUrgent ? "0px" : "36px",
              }}
            >
              {item?.itemType === "Kg" ||
              item?.itemType === "Litre" ||
              item?.itemType === "Mitre"
                ? Number(item?.quantity).toFixed(1)
                : item?.quantity}{" "}
              {item?.itemType !== "Unit" && item?.itemType}
            </div>

            <div
              style={{
                flex: 1,
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {Number(item?.estimatedItemCost).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              LKR
            </div>
          </div>
        ))}

        <div className="shopping-summary">
          <div className="mb-1 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontWeight: "600", fontSize: "16px" }}>
                Estimated Total Shopping Cost:
              </span>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "17px",
                  color: "#976BDB",
                }}
              >
                {Number(totalCost).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                LKR
              </span>
            </div>
          </div>
          <div className="ps-3 pe-3">
            <div className="d-flex justify-content-between align-items-center">
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#dc3545",
                }}
              >
                Estimated Total Urgent Items Cost:
              </span>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "17px",
                  color: "#dc3545",
                }}
              >
                {urgentItemsCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                LKR
              </span>
            </div>
          </div>
          {totalCost > urgentItemsCost && (
            <div className="pe-3 ps-3 pt-4 ps-0">
              <div className="alert alert-success mt-2 mb-0 pe-5"  style={{paddingLeft: "0px"}} role="alert">
                You can save{" "}
                <strong>
                  {(totalCost - urgentItemsCost).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  LKR
                </strong>{" "}
                if you only buy urgent items.
              </div>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

ShoppingListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedShoppingList: PropTypes.any.isRequired,
};

export default ShoppingListModal;
