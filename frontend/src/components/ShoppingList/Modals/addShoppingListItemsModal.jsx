import { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Row,
  Button,
  ListGroupItem,
} from "reactstrap";
import { InventoryService } from "../../../services/InventoryServices.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { FaSearchPlus } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { ShoppingListService } from "../../../services/ShoppingListSevices.jsx";
import { toast } from "react-hot-toast";

const AddShoppingListItemsModal = ({
  isOpen,
  toggle,
  selectedShoppingList,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);
  const [inventories, setInventories] = useState([]);
  const [addNewItemModal, setAddNewItemModal] = useState(false);
  const [itemCount, setItemCount] = useState(1);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState();
  const [totalItemCost, setTotalItemCost] = useState(
    selectedInventoryItem?.price
  );
  const [isUrgent, setIsUrgent] = useState(false);
  const [shoppingListItems, setShoppingListItems] = useState([]);
  const [updatedShoppingListItems, setUpdatedShoppingListItems] = useState([]);
  const [user, setUser] = useState();

  const { t } = useTranslation();

  const addNewItemToggle = () => setAddNewItemModal(!addNewItemModal);

  useEffect(() => {
    if (selectedInventoryItem?.price) {
      setTotalItemCost(selectedInventoryItem.price * itemCount);
    }
  }, [selectedInventoryItem?.price, itemCount]);

  useEffect(() => {
    setShoppingListItems(selectedShoppingList.itemList);
    console.log(selectedShoppingList);
  }, [selectedShoppingList]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleUpdateShoppingList = async () => {
    const updateData = {
      homeId: user.homeID,
      createdBy: selectedShoppingList.createdBy,
      listName: selectedShoppingList.listName,
      shoppingDate: selectedShoppingList.shoppingDate,
      itemList: updatedShoppingListItems,
    };

    try {
      const response = await ShoppingListService.updateShoppingList(
        selectedShoppingList._id,
        updateData
      );

      if (response.success) {
        console.log("Shopping list updated successfully!");
        toast.success(t("Shopping list updated successfully!"), {
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });
        toggle();
      } else {
        console.error("Failed to update shopping list:", response.message);
      }
    } catch (error) {
      console.error("Error while updating shopping list:", error.message);
    }
  };

  const handleUrgentChange = (e) => {
    setIsUrgent(e.target.checked);
  };

  const handleAddItem = () => {
    if (!selectedInventoryItem) return;

    const newItem = {
      homeId: user.homeID,
      shoppingListId: selectedShoppingList._id,
      inventoryId: selectedInventoryItem?._id,
      itemName: selectedInventoryItem.itemName,
      itemType: selectedInventoryItem.itemType,
      quantity: itemCount,
      price: selectedInventoryItem.price,
      estimatedItemCost: totalItemCost,
      isUrgent: isUrgent,
      status: "Pending",
    };

    setShoppingListItems((prev) => [...prev, newItem]);
    setUpdatedShoppingListItems((prev) => [...prev, newItem]);
    setIsUrgent(false);

    setIsInputFocused(false);
    addNewItemToggle();
  };

  const getAllInventoryItems = async () => {
    const data = await InventoryService.getAllInventoryItems();
    setInventories(data);
    console.log(data);
  };

  useEffect(() => {
    getAllInventoryItems();
  }, []);

  const decrementCount = () => setItemCount((prev) => Math.max(prev - 1, 0));
  const incrementCount = () => {
    setItemCount((prev) => prev + 1);
  };

  const handleCountChange = (e) => {
    const value = e.target.value.trim();
    const newCount = value === "" ? 0 : Math.max(0, parseFloat(value));
    setItemCount(newCount);
  };

  const handleToggle = () => {
    toggle();
  };

  const handleCancel = () => {
    setIsInputFocused(false);
    // setSearchTag("");
    // getAllInventories([]);
  };

  const handleAddNewItemBtn = () => {
    addNewItemToggle();
    setItemCount(1);
  };

  const handleClickAddItemBtn = (item) => {
    // setItemPrice(item.price ?? 0);
    // setTotalAmount(item.price ?? 0);
    // setAvailableQuantity(item.quantity ?? 0);
    setSelectedInventoryItem(item);
    handleAddNewItemBtn();
    console.log(item);
  };

  const cancelBtn = (
    <button
      className="search-cancel-btn"
      style={{ backgroundColor: "#976BDB", height: "36px", color: "#ffffff" }}
      onClick={handleCancel}
    >
      Cancel
    </button>
  );

  const closeBtn = (
    <button
      className="close-btn"
      onClick={handleToggle}
      disabled={isInputFocused}
      type="button"
    >
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="Close"
      />
    </button>
  );

  const closeAddNewItemBtn = (
    <button className="close-btn" onClick={addNewItemToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      scrollable
      modalClassName="custom-modal mt-4"
    >
      <ModalHeader
        toggle={toggle}
        close={isInputFocused ? cancelBtn : closeBtn}
        className="border-0 poppins-medium ms-3 me-3 mt-1 pb-0 mb-0 pt-2"
      >
        <div className="d-flex align-items-center mb-3">
          <span
            style={{
              color: "#898989",
              fontSize: "20px",
              marginRight: "12px",
              marginTop: "12px",
              cursor: "pointer",
            }}
            onClick={() => setIsInputFocused(true)}
          >
            <FaSearchPlus />
          </span>

          <input
            ref={inputRef}
            className="mt-3"
            type="text"
            placeholder="Search New Item"
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "18px",
              color: "#898989",
              width: "100%",
            }}
            // value={searchTag}
            // onChange={handleSearchChange}
            onFocus={() => setIsInputFocused(true)}
          />
        </div>
      </ModalHeader>

      <ModalBody className="pb-2 pt-0">
        {isInputFocused ? (
          <div className="py-1 pr-3 pl-3">
            <div
              className="mb-1"
              style={{
                height: "1px",
                backgroundColor: "#898989",
                width: "100%",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            />
            {inventories && inventories.length > 0 ? (
              inventories.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between align-items-center border-bottom py-2 px-1"
                  style={{ color: "#000000" }}
                >
                  <span>{item.itemName}</span>
                  <button
                    className="shopping-add-add-btn"
                    onClick={() => handleClickAddItemBtn(item)}
                  >
                    ADD <FiPlusCircle />
                  </button>
                </div>
              ))
            ) : (
              <p className="d-flex justify-content-center mt-5 vh-100">
                No data to display
              </p>
            )}
            <Modal
              isOpen={addNewItemModal}
              toggle={addNewItemToggle}
              centered={true}
              onClosed={() => setItemCount(1)}
            >
              <ModalHeader
                className="border-0 mr-3 mb-0 pb-1 p-2"
                toggle={addNewItemToggle}
                close={closeAddNewItemBtn}
              >
                <Col className="pt-3">
                  <div
                    className="fw-bold"
                    style={{ fontSize: "18px", color: "#976bdb" }}
                  >
                    <span
                      style={{
                        marginLeft: "16px",
                        marginRight: "20px",
                        color: "#000000",
                      }}
                    >
                      {selectedInventoryItem?.itemName}
                    </span>
                    <span
                      style={{
                        marginRight: "20px",
                        color: "#000000",
                      }}
                    >
                      -
                    </span>
                    {Number(selectedInventoryItem?.price).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                    {"LKR"}
                    {selectedInventoryItem?.itemType === "Litre" ||
                    selectedInventoryItem?.itemType === "Mitre" ||
                    selectedInventoryItem?.itemType === "Kg" ||
                    selectedInventoryItem?.itemType === "Bottle" ||
                    selectedInventoryItem?.itemType === "Pack"
                      ? ` per ${selectedInventoryItem?.itemType}`
                      : ""}
                  </div>
                </Col>
              </ModalHeader>
              <ModalBody className="p-4">
                <div className="mb-2 d-flex justify-content-between align-items-center pt-0 mt-0 pb-2">
                  <span style={{ fontWeight: "500" }}>
                    Quantity{" "}
                    {selectedInventoryItem?.itemType !== "Unit" &&
                      selectedInventoryItem?.itemType &&
                      `(${selectedInventoryItem.itemType})`}
                  </span>
                  <div
                    className="d-flex align-items-center px-3 py-2"
                    style={{
                      color: "#5f5f5f",
                      width: "190px",
                      border: "1px solid",
                      borderRadius: "50px",
                    }}
                  >
                    {selectedInventoryItem?.itemType !== "Litre" &&
                      selectedInventoryItem?.itemType !== "Mitre" &&
                      selectedInventoryItem?.itemType !== "Kg" && (
                        <FaCircleMinus
                          style={{
                            cursor: "pointer",
                            fontSize: "22px",
                          }}
                          onClick={decrementCount}
                        />
                      )}
                    <input
                      type="number"
                      style={{
                        textAlign:
                          selectedInventoryItem?.itemType !== "Litre" &&
                          selectedInventoryItem?.itemType !== "Mitre" &&
                          selectedInventoryItem?.itemType !== "Kg"
                            ? "center"
                            : "left",
                        color: "#000",
                        fontSize: "16px",
                        width: "114px",
                        border: "none",
                        outline: "none",
                      }}
                      value={itemCount}
                      onChange={handleCountChange}
                    />
                    {selectedInventoryItem?.itemType !== "Litre" &&
                      selectedInventoryItem?.itemType !== "Mitre" &&
                      selectedInventoryItem?.itemType !== "Kg" && (
                        <FaCirclePlus
                          style={{
                            cursor: "pointer",
                            fontSize: "22px",
                          }}
                          onClick={incrementCount}
                        />
                      )}
                    {selectedInventoryItem?.itemType !== "Unit" && (
                      <div className="text-end fw-bold">
                        {selectedInventoryItem?.itemType}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-2 d-flex justify-content-between align-items-center py-2">
                  <span style={{ fontWeight: "500" }}>
                    Available Inventory Stock
                  </span>
                  <span style={{ fontWeight: "500", marginRight: "140px" }}>
                    {selectedInventoryItem?.itemType == "Units"
                      ? selectedInventoryItem?.quantity
                      : selectedInventoryItem?.quantity.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          }
                        )}{" "}
                    {selectedInventoryItem?.itemType !== "Unit" &&
                      selectedInventoryItem?.itemType &&
                      `${selectedInventoryItem.itemType}`}
                  </span>
                </div>

                <div className="mb-2 d-flex justify-content-between align-items-center py-2">
                  <span style={{ fontWeight: "500" }}>
                    Item Latest Price{" "}
                    {` per ${selectedInventoryItem?.itemType}`}
                  </span>
                  <div
                    className="d-flex justify-content-between px-3 py-2 rounded-border fw-bold"
                    style={{
                      color: "#5f5f5f",
                      width: "195px",
                      border: "1px solid #000000",
                      borderRadius: "50px",
                    }}
                  >
                    <span>{selectedInventoryItem?.price ?? 0}</span>
                    <span className="text-right">LKR</span>
                  </div>
                </div>

                <div className="mb-2 d-flex justify-content-between align-items-center py-2">
                  <span style={{ fontWeight: "500" }}>
                    Estimated Added Item Cost
                  </span>
                  <div
                    className="d-flex justify-content-between px-3 py-2 rounded-border fw-bold"
                    style={{
                      color: "5f5f5f#",
                      width: "195px",
                      border: "1px solid #000000",
                      borderRadius: "50px",
                    }}
                  >
                    <span>
                      {Number(totalItemCost).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-right">LKR</span>
                  </div>
                </div>

                <div className="mb-2 d-flex align-items-center urgent-item">
                  <span className="mr-4">This is an urgent item</span>
                  <input
                    className="urgent-items-checkbox"
                    type="checkbox"
                    checked={isUrgent}
                    onChange={handleUrgentChange}
                  />
                </div>

                <div className={"pt-3 d-flex justify-content-between mb-1"}>
                  <Button
                    className={"col-5 border-0 rounded-pill bg-black fw-bold"}
                    onClick={addNewItemToggle}
                  >
                    {t("CANCEL")}
                  </Button>
                  <Button
                    className="col-5 border-0 rounded-pill ms-3 fw-bold"
                    style={{ backgroundColor: "#976BDB", height: "36px" }}
                    onClick={handleAddItem}
                  >
                    Add Item
                  </Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        ) : (
          <div>
            <div className="rounded-lg text-center">
              <div
                className="mb-3"
                style={{
                  height: "1px",
                  backgroundColor: "#898989",
                  width: "100%",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              />
              <Row className="mb-4">
                <Col>
                  <h5 style={{ fontSize: "20px" }}>
                    {selectedShoppingList.listName}
                  </h5>
                  <h5 style={{ fontSize: "16px", color: "#555555" }}>
                    Shopping date:{" "}
                    {selectedShoppingList?.shoppingDate &&
                    !isNaN(
                      new Date(selectedShoppingList.shoppingDate).getTime()
                    )
                      ? new Date(selectedShoppingList.shoppingDate)
                          .toISOString()
                          .split("T")[0]
                      : ""}
                  </h5>
                </Col>
                {/* <Col>
                  {selectedShoppingList.shopVisitors && selectedShoppingList.shopVisitors.length > 0 ? (
                    getVisitorNames(list.shopVisitors).map(
                      (visitorName, index) => <p key={index}>{visitorName}</p>
                    )
                  ) : (
                    <p>No visitors</p>
                  )}
                </Col> */}
              </Row>

              {Array.isArray(selectedShoppingList.itemList) &&
                selectedShoppingList.itemList.length > 0 && (
                  <Row className="pb-2 ps-1 pr-2">
                    <Col
                      xs={6}
                      className="text-start"
                      style={{ fontWeight: 600, color: "#898989" }}
                    >
                      {t("ITEM_DESCRIPTION")}
                    </Col>
                    <Col
                      xs={2}
                      className="text-center"
                      style={{ fontWeight: 600, color: "#898989" }}
                    >
                      {t("QUANTITY")}
                    </Col>
                    <Col
                      xs={4}
                      className="text-end"
                      style={{ fontWeight: 600, color: "#898989" }}
                    >
                      {t("AMOUNT")} (LKR)
                    </Col>
                  </Row>
                )}

              {Array.isArray(selectedShoppingList.itemList) &&
                selectedShoppingList.itemList.length === 0 && (
                  <div className="mt-5" style={{ color: "#976bdb" }}>
                    No Shopping List Items Added Yet
                  </div>
                )}
              <div
                style={{
                  maxHeight: "340px",
                  minHeight: "240px",
                  marginBottom: "10px",
                }}
              >
                {shoppingListItems?.map((item, index) => (
                  <ListGroupItem
                    key={index}
                    className="customer-body-text shadow-sm rounded mb-2 pt-1 pb-1 pr-2 pl-2 border-0 px-2"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <Row className="align-items-center">
                      <Col xs={6} className="text-start">
                        <Row className="g-2">
                          <Col
                            xs="auto"
                            className="d-flex justify-content-center align-items-center"
                            style={{ color: "red" }}
                          >
                            {item?.isUrgent && <FaStar />}
                          </Col>
                          <Col>
                            <div
                              style={{ fontSize: "14px", fontWeight: "bold" }}
                            >
                              {item?.itemName}
                            </div>
                            <div style={{ fontSize: "13px", color: "#666" }}>
                              {Number(item?.price).toLocaleString(undefined, {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                              })}{" "}
                              LKR
                            </div>
                          </Col>
                        </Row>
                      </Col>

                      <Col
                        xs={2}
                        className="text-center"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        {item?.itemType === "Kg" ||
                        item?.itemType === "Litre" ||
                        item?.itemType === "Mitre"
                          ? Number(item?.quantity).toFixed(1)
                          : item?.quantity}{" "}
                        {item?.itemType !== "Unit" && item?.itemType}
                      </Col>

                      <Col
                        xs={4}
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        {Number(item?.estimatedItemCost).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      {!isInputFocused && (
        <div className={"pt-3 text-end mx-4 mb-4"}>
          <Button
            className={"col-4 border-0 rounded-pill bg-black fw-bold"}
            style={{ height: "36px" }}
            onClick={handleToggle}
          >
            {t("CANCEL")}
          </Button>
          <Button
            className="col-3 border-0 rounded-pill ms-3 fw-bold"
            style={{ backgroundColor: "#976BDB", height: "36px" }}
            onClick={handleUpdateShoppingList}
          >
            {t("SAVE")}
          </Button>
        </div>
      )}
    </Modal>
  );
};

AddShoppingListItemsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedShoppingList: PropTypes.any.isRequired,
};

export default AddShoppingListItemsModal;
