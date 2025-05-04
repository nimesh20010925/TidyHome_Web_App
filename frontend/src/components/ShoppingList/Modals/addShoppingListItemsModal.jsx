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
import { FaSearchPlus, FaEdit, FaTrash } from "react-icons/fa";
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
  const [updateItemModal, setUpdateItemModal] = useState(false);
  const [addNewestItemModal, setAddNewestItemModal] = useState(false);
  const [itemCount, setItemCount] = useState(1);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState();
  const [selectedListItem, setSelectedListItem] = useState();
  const [totalItemCost, setTotalItemCost] = useState(
    selectedInventoryItem?.price
  );
  const [totalUpdatedItemCost, setTotalUpdatedItemCost] = useState(
    selectedListItem?.price
  );
  const [isUrgent, setIsUrgent] = useState(false);
  const [shoppingListItems, setShoppingListItems] = useState([]);
  const [updatedShoppingListItems, setUpdatedShoppingListItems] = useState([]);
  const [user, setUser] = useState();
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemType: "Unit",
    quantity: 1,
    price: null,
    estimatedItemCost: 0,
    isUrgent: false,
  });
  const [totalCost, setTotalCost] = useState(0);
  const [urgentItemsCost, setUrgentItemsCost] = useState(0);
  const [itemQuantity, setItemQuantity] = useState();
  const [itemPrice, setItemPrice] = useState();
  const [isItemUrgent, setIsItemUrgent] = useState();
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState();
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const { t } = useTranslation();

  const addNewItemToggle = () => setAddNewItemModal(!addNewItemModal);

  const updateItemToggle = () => setUpdateItemModal(!updateItemModal);

  const addNewestItemToggle = () => setAddNewestItemModal(!addNewestItemModal);

  const deleteItemToggle = () => {
    setDeleteItemModal(!deleteItemModal);
  };

  useEffect(() => {
    if (selectedInventoryItem?.price) {
      setTotalItemCost(selectedInventoryItem.price * itemCount);
    }
  }, [selectedInventoryItem?.price, itemCount]);

  useEffect(() => {
    if (itemPrice) {
      setTotalUpdatedItemCost(itemPrice * itemQuantity);
    }
  }, [itemPrice, itemQuantity]);

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
    setIsUserLoaded(true);
  }, []);

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

  useEffect(() => {
    setIsUrgent(selectedInventoryItem?.isUrgent || false);
  }, [selectedInventoryItem]);

  const handleUrgentUpdate = (e) => {
    const checked = e.target.checked;
    setIsItemUrgent(checked);

    if (selectedListItem) {
      setSelectedListItem({
        ...selectedListItem,
        isUrgent: checked,
      });
    }
  };

  const handleUpdateShoppingList = async () => {
    const updateData = {
      homeId: user.homeID,
      createdBy: selectedShoppingList.createdBy,
      listName: selectedShoppingList.listName,
      shoppingDate: selectedShoppingList.shoppingDate,
      itemList: updatedShoppingListItems,
    };

    console.log(updateData);

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
        setUpdatedShoppingListItems([]);
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

  const handleAddNewItem = (itemToAdd) => {
    const newItem = {
      homeId: user.homeID,
      shoppingListId: selectedShoppingList._id,
      itemName: itemToAdd.itemName,
      itemType: itemToAdd.itemType,
      quantity: parseFloat(itemToAdd.quantity) || 0,
      price: parseFloat(itemToAdd.price) || 0,
      estimatedItemCost: parseFloat(itemToAdd.estimatedItemCost) || 0,
      isUrgent: itemToAdd.isUrgent || false,
      status: "Pending",
    };

    console.log(newItem);

    setShoppingListItems((prev) => [...prev, newItem]);

    setUpdatedShoppingListItems((prev) => [...prev, newItem]);

    setNewItem({
      itemName: "",
      itemType: "Unit",
      quantity: "",
      price: "",
      estimatedItemCost: "",
      isUrgent: false,
    });
  };

  const handleUpdateItem = () => {
    if (!selectedListItem) return;

    const updatedItem = {
      homeId: user.homeID,
      shoppingListId: selectedShoppingList._id,
      inventoryId: selectedListItem?.inventoryId || null,
      itemId: selectedListItem?._id,
      itemName: selectedListItem.itemName,
      itemType: selectedListItem.itemType,
      quantity: itemQuantity,
      price: itemPrice,
      estimatedItemCost: totalUpdatedItemCost,
      isUrgent: isItemUrgent,
      status: "Pending",
      isUpdated: true,
    };

    const existingItemIndex = shoppingListItems.findIndex(
      (item) => item._id === selectedListItem?._id
    );

    console.log(updatedItem);

    if (existingItemIndex >= 0) {
      setShoppingListItems((prev) => [
        ...prev.slice(0, existingItemIndex),
        updatedItem,
        ...prev.slice(existingItemIndex + 1),
      ]);

      setUpdatedShoppingListItems((prev) => [
        ...prev.slice(0, existingItemIndex),
        updatedItem,
        ...prev.slice(existingItemIndex + 1),
      ]);
    } else {
      setShoppingListItems((prev) => [...prev, updatedItem]);
      setUpdatedShoppingListItems((prev) => [...prev, updatedItem]);
    }

    setIsUrgent(false);
    setIsInputFocused(false);
    updateItemToggle();
  };

  const handleDeleteItem = (itemId) => {
    setSelectedItemToDelete(itemId);
    deleteItemToggle();
  };

  const deleteShoppinglistItem = async (itemId) => {
    console.log(itemId);
    try {
      const response = await ShoppingListService.deleteShoppingListItem(itemId);
      console.log("Deleted item:", response.shoppingListItem);

      // Remove the deleted item from the state
      setShoppingListItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );

      deleteItemToggle();
    } catch (error) {
      console.error("Failed to delete item:", error.message);
    }
  };

  const getAllInventoryItems = async () => {
    try {
      const data = await InventoryService.getAllInventoryItems(user?.homeID);
      setInventories(data || []);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error(t("INVENTORY_FETCH_FAILED"));
      setInventories([]);
    }
  };

  useEffect(() => {
    if (user?.homeID) {
      getAllInventoryItems();
    }
  }, [user?.homeID]);

  const decrementCount = () => setItemCount((prev) => Math.max(prev - 1, 0));
  const incrementCount = () => {
    setItemCount((prev) => prev + 1);
  };

  const handleCountChange = (e) => {
    const value = e.target.value.trim();
    const newCount = value === "" ? 0 : Math.max(0, parseFloat(value));
    setItemCount(newCount);
  };

  const handleUpdatedQuantityChange = (e) => {
    const value = e.target.value.trim();
    const newCount = value === "" ? 0 : Math.max(0, parseFloat(value));
    setItemQuantity(newCount);
  };

  const handleUpdatedPriceChange = (e) => {
    const value = e.target.value.trim();
    const newPrice = value === "" ? 0 : Math.max(0, parseFloat(value));
    setItemPrice(newPrice);
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

  const handleUpdateItemBtn = () => {
    updateItemToggle();
    setItemCount(1);
  };

  const handleAddNewestItemBtn = () => {
    addNewestItemToggle();
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

  const handleClickUpdateItemBtn = (item) => {
    // setItemPrice(item.price ?? 0);
    // setTotalAmount(item.price ?? 0);
    // setAvailableQuantity(item.quantity ?? 0);
    setSelectedListItem(item);
    setItemQuantity(item.quantity);
    setIsItemUrgent(item.isUrgent);
    setItemPrice(item.price);
    handleUpdateItemBtn();
    console.log(item);
  };

  const handleClickAddNewestItemBtn = () => {
    // setItemPrice(item.price ?? 0);
    // setTotalAmount(item.price ?? 0);
    // setAvailableQuantity(item.quantity ?? 0);
    // setSelectedInventoryItem(item);
    handleAddNewestItemBtn();
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

  const closeUpdateItemBtn = (
    <button className="close-btn" onClick={updateItemToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  const closeAddNewestItemBtn = (
    <button className="close-btn" onClick={addNewestItemToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  const closeDeleteItemBtn = (
    <button className="close-btn" onClick={deleteItemToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  if (!isUserLoaded) return null;

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      scrollable
      modalClassName="custom-shopping-modal shopping-height mt-4"
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
            placeholder="Search Existing Item"
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

                <div className={"pt-3 d-flex justify-content-between mt-3"}>
                  <Button
                    className={"col-5 border-0 rounded-pill bg-black fw-bold"}
                    onClick={addNewItemToggle}
                  >
                    {t("CANCEL")}
                  </Button>
                  <button
                    className="col-5 border-0 rounded-pill ms-3 fw-bold"
                    style={{ backgroundColor: "#976BDB", color: "#ffffff" }}
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
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
              <Row className="mb-4 align-items-center">
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

                <Col className="text-end">
                  <button
                    className="col-12 border-0 rounded-pill fw-bold"
                    style={{
                      backgroundColor: "#976BDB",
                      height: "36px",
                      color: "#ffffff",
                    }}
                    onClick={() => handleClickAddNewestItemBtn()}
                  >
                    {t("ADD_NIWEST_ITEM")}
                  </button>
                </Col>
              </Row>

              <Modal
                isOpen={addNewestItemModal}
                toggle={addNewestItemToggle}
                centered={true}
                onClosed={() => {
                  setItemCount(1);
                  setNewItem({
                    itemName: "",
                    itemType: "Unit",
                    quantity: 1,
                    price: "",
                    estimatedItemCost: "",
                    isUrgent: false,
                  });
                }}
              >
                <ModalHeader
                  className="border-0 mr-3 mb-0 pb-1 p-2 pb-3"
                  toggle={addNewestItemToggle}
                  close={closeAddNewestItemBtn}
                >
                  <Col className="pt-3">
                    <div
                      className="fw-bold"
                      style={{ fontSize: "18px", color: "#976bdb" }}
                    >
                      Add New Item
                    </div>
                  </Col>
                </ModalHeader>

                <ModalBody className="p-2">
                  <div className="mb-3">
                    <label
                      style={{
                        fontWeight: "500",
                        marginBottom: "6px",
                        marginLeft: "6px",
                      }}
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newItem.itemName}
                      onChange={(e) =>
                        setNewItem({ ...newItem, itemName: e.target.value })
                      }
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      style={{
                        fontWeight: "500",
                        marginBottom: "6px",
                        marginLeft: "6px",
                      }}
                    >
                      Item Type
                    </label>
                    <select
                      className="form-control"
                      value={newItem.itemType}
                      onChange={(e) => {
                        const itemType = e.target.value;
                        setNewItem((prev) => ({
                          ...prev,
                          itemType,
                          quantity: itemType === "Unit" ? 1 : 0.1,
                          estimatedItemCost:
                            prev.price && prev.quantity
                              ? parseFloat(prev.price) * prev.quantity
                              : "",
                        }));
                      }}
                    >
                      <option value="Unit">Unit</option>
                      <option value="Kg">Kg</option>
                      <option value="Litre">Litre</option>
                      <option value="Metre">Metre</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label
                      style={{
                        fontWeight: "500",
                        marginBottom: "6px",
                        marginLeft: "6px",
                      }}
                    >
                      Quantity{" "}
                      {newItem.itemType !== "Unit" && `(${newItem.itemType})`}
                    </label>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary rounded-circle"
                        style={{
                          width: "40px",
                          height: "34px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          paddingBottom: "10px",
                          fontWeight: "bolder",
                          fontSize: "24px",
                        }}
                        onClick={() =>
                          setNewItem((prev) => {
                            const currentQty = parseFloat(prev.quantity) || 0;
                            const newQty = Math.max(
                              prev.itemType === "Unit" ? 1 : 0.1,
                              currentQty - (prev.itemType === "Unit" ? 1 : 0.1)
                            );
                            return {
                              ...prev,
                              quantity: newQty.toString(),
                              estimatedItemCost: prev.price
                                ? (parseFloat(prev.price) * newQty).toString()
                                : "",
                            };
                          })
                        }
                      >
                        -
                      </button>

                      <input
                        type="number"
                        className="form-control mx-2 text-center"
                        value={newItem.quantity}
                        onChange={(e) => {
                          const quantity =
                            e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value);
                          setNewItem((prev) => ({
                            ...prev,
                            quantity: quantity.toString(),
                            estimatedItemCost:
                              quantity && prev.price
                                ? (parseFloat(prev.price) * quantity).toString()
                                : "",
                          }));
                        }}
                        min={newItem.itemType === "Unit" ? "" : ""}
                        step={newItem.itemType === "Unit" ? "1" : "1"}
                        placeholder="0"
                        required
                      />

                      <button
                        className="btn btn-outline-secondary rounded-circle"
                        style={{
                          width: "38px",
                          height: "34px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingBottom: "10px",
                          fontWeight: "bolder",
                          fontSize: "24px",
                        }}
                        onClick={() =>
                          setNewItem((prev) => {
                            const currentQty = parseFloat(prev.quantity) || 0;
                            const newQty =
                              currentQty + (prev.itemType === "Unit" ? 1 : 0.1);
                            return {
                              ...prev,
                              quantity: newQty.toString(),
                              estimatedItemCost: prev.price
                                ? (parseFloat(prev.price) * newQty).toString()
                                : "",
                            };
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      style={{
                        fontWeight: "500",
                        marginBottom: "6px",
                        marginLeft: "6px",
                      }}
                    >
                      Estimated Price per{" "}
                      {newItem.itemType !== "Unit" ? newItem.itemType : "Unit"}{" "}
                      (LKR)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={newItem.price}
                      onChange={(e) => {
                        const price = e.target.value;
                        setNewItem((prev) => ({
                          ...prev,
                          price,
                          estimatedItemCost:
                            price && prev.quantity
                              ? parseFloat(price) * prev.quantity
                              : "",
                        }));
                      }}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      style={{
                        fontWeight: "500",
                        marginBottom: "6px",
                        marginLeft: "6px",
                      }}
                    >
                      Estimated Item Cost (LKR)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={newItem.estimatedItemCost || ""}
                      readOnly
                      style={{
                        backgroundColor: "#f8f9fa",
                        cursor: "not-allowed",
                      }}
                    />
                  </div>

                  <div className="mb-2 d-flex align-items-center urgent-item">
                    <input
                      className="urgent-items-checkbox me-3"
                      type="checkbox"
                      id="urgentItemCheck"
                      checked={newItem.isUrgent}
                      onChange={(e) =>
                        setNewItem({ ...newItem, isUrgent: e.target.checked })
                      }
                    />
                    <span>This is an urgent item</span>
                  </div>

                  <div className="pt-3 d-flex justify-content-between mb-1">
                    <button
                      className="col-5 border-0 rounded-pill bg-black fw-bold"
                      style={{ color: "#ffffff" }}
                      onClick={addNewestItemToggle}
                    >
                      {t("CANCEL")}
                    </button>
                    <button
                      className="col-5 border-0 rounded-pill ms-3 fw-bold"
                      style={{
                        backgroundColor: "#976BDB",
                        height: "36px",
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        const itemToAdd = {
                          ...newItem,
                          price: newItem.price ? parseFloat(newItem.price) : 0,
                          estimatedItemCost: newItem.estimatedItemCost || 0,
                        };
                        handleAddNewItem(itemToAdd);
                        addNewestItemToggle();
                      }}
                      disabled={
                        !newItem.itemName ||
                        !newItem.price ||
                        newItem.quantity <= 0
                      }
                    >
                      Add Item
                    </button>
                  </div>
                </ModalBody>
              </Modal>

              {Array.isArray(selectedShoppingList.itemList) &&
                selectedShoppingList.itemList.length > 0 && (
                  <Row className="pb-2 ps-1 pr-2 align-items-center">
                    <Col
                      xs={5}
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
              {Array.isArray(shoppingListItems) &&
                shoppingListItems.length === 0 && (
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
                      <Col xs={5} className="text-start">
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
                        xs={3}
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

                      <Col xs={2} className="text-end pe-3">
                        <FaEdit
                          className="me-2"
                          style={{
                            color: "#976BDB",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                          onClick={() => handleClickUpdateItemBtn(item)}
                        />
                        <FaTrash
                          style={{
                            color: "#dc3545",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                          onClick={() => handleDeleteItem(item._id)}
                        />
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </div>
              <Modal
                isOpen={updateItemModal}
                toggle={updateItemToggle}
                centered={true}
                onClosed={() => setItemCount(1)}
              >
                <ModalHeader
                  className="border-0 mr-3 mb-0 pb-1 p-2"
                  toggle={updateItemToggle}
                  close={closeUpdateItemBtn}
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
                        {selectedListItem?.itemName}
                      </span>
                      <span
                        style={{
                          marginRight: "20px",
                          color: "#000000",
                        }}
                      >
                        -
                      </span>
                      {Number(selectedListItem?.price).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      {"LKR"}
                      {selectedListItem?.itemType === "Litre" ||
                      selectedListItem?.itemType === "Mitre" ||
                      selectedListItem?.itemType === "Kg" ||
                      selectedListItem?.itemType === "Bottle" ||
                      selectedListItem?.itemType === "Pack"
                        ? ` per ${selectedListItem?.itemType}`
                        : ""}
                    </div>
                  </Col>
                </ModalHeader>
                <ModalBody className="p-4">
                  <div className="mb-2 d-flex justify-content-between align-items-center pt-0 mt-0 pb-2">
                    <span style={{ fontWeight: "500" }}>
                      Quantity{" "}
                      {selectedListItem?.itemType !== "Unit" &&
                        selectedListItem?.itemType &&
                        `(${selectedListItem.itemType})`}
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
                      {selectedListItem?.itemType !== "Litre" &&
                        selectedListItem?.itemType !== "Mitre" &&
                        selectedListItem?.itemType !== "Kg" && (
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
                            selectedListItem?.itemType !== "Litre" &&
                            selectedListItem?.itemType !== "Mitre" &&
                            selectedListItem?.itemType !== "Kg"
                              ? "center"
                              : "left",
                          color: "#000",
                          fontSize: "16px",
                          width: "114px",
                          border: "none",
                          outline: "none",
                        }}
                        value={itemQuantity}
                        onChange={handleUpdatedQuantityChange}
                      />
                      {selectedListItem?.itemType !== "Litre" &&
                        selectedListItem?.itemType !== "Mitre" &&
                        selectedListItem?.itemType !== "Kg" && (
                          <FaCirclePlus
                            style={{
                              cursor: "pointer",
                              fontSize: "22px",
                            }}
                            onClick={incrementCount}
                          />
                        )}
                      {selectedListItem?.itemType !== "Unit" && (
                        <div className="text-end fw-bold">
                          {selectedListItem?.itemType}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-2 d-flex justify-content-between align-items-center py-2">
                    <span style={{ fontWeight: "500" }}>
                      Available Inventory Stock
                    </span>
                    <span style={{ fontWeight: "500", marginRight: "140px" }}>
                      {selectedListItem?.itemType == "Units"
                        ? selectedListItem?.quantity
                        : selectedListItem?.quantity.toLocaleString(undefined, {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}{" "}
                      {selectedListItem?.itemType !== "Unit" &&
                        selectedListItem?.itemType &&
                        `${selectedListItem.itemType}`}
                    </span>
                  </div>

                  <div className="mb-2 d-flex justify-content-between align-items-center py-2">
                    <span style={{ fontWeight: "500" }}>
                      Item Latest Price {` per ${selectedListItem?.itemType}`}
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
                      <input
                        type="number"
                        // value={selectedListItem?.price ?? 0}
                        // onChange={(e) => {
                        //   const newPrice = parseFloat(e.target.value) || 0;
                        //   setSelectedListItem((prev) => ({
                        //     ...prev,
                        //     price: newPrice,
                        //     estimatedItemCost: newPrice * (prev?.quantity || 1),
                        //   }));
                        // }}
                        value={itemPrice}
                        onChange={handleUpdatedPriceChange}
                        style={{
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          width: "100%",
                          color: "#000",
                          fontWeight: "bold",
                        }}
                      />
                      <span className="text-right">LKR</span>
                    </div>
                  </div>

                  <div className="mb-2 d-flex justify-content-between align-items-center py-2">
                    <span style={{ fontWeight: "500" }}>
                      Estimated Item Cost
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
                        {Number(totalUpdatedItemCost).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </span>
                      <span className="text-right">LKR</span>
                    </div>
                  </div>

                  <div className="mb-2 d-flex align-items-center urgent-item">
                    <span className="mr-4">This is an urgent item</span>
                    <input
                      className="urgent-items-checkbox"
                      type="checkbox"
                      checked={isItemUrgent}
                      onChange={handleUrgentUpdate}
                    />
                  </div>

                  <div className={"pt-3 d-flex justify-content-between mt-3"}>
                    <Button
                      className={"col-5 border-0 rounded-pill bg-black fw-bold"}
                      onClick={updateItemToggle}
                    >
                      {t("CANCEL")}
                    </Button>
                    <Button
                      className="col-5 border-0 rounded-pill ms-3 fw-bold"
                      style={{
                        backgroundColor: "#976BDB",
                        color: "#ffffff",
                      }}
                      onClick={handleUpdateItem}
                    >
                      Update
                    </Button>
                  </div>
                </ModalBody>
              </Modal>
              <Modal
                isOpen={deleteItemModal}
                toggle={deleteItemToggle}
                centered
                scrollable
              >
                <ModalHeader
                  toggle={deleteItemToggle}
                  close={closeDeleteItemBtn}
                  className="border-0 pb-0 pr-4 pl-4 ms-2 mr-2 fw-bold"
                >
                  {t("INVENTORY_DELETION_CONFIRMATION")}
                </ModalHeader>
                <ModalBody>
                  <div className="d-flex flex-column">
                    <div className="form-group mb-4 ms-3 justify-content-center align-items-center">
                      {t("ARE_YOU_SURE_INVENTORY_DELETION")}
                    </div>
                    <Row className="form-group mb-2 mr-1 d-flex justify-content-end">
                      <Col xs="auto">
                        <Button
                          style={{ cursor: "pointer" }}
                          onClick={deleteItemToggle}
                          className="ps-4 pe-4 border-0 rounded-pill bg-black fw-bold"
                        >
                          {t("CANCEL")}
                        </Button>
                      </Col>
                      <Col xs="auto">
                        <Button
                          style={{
                            backgroundColor: "#ff0000",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            deleteShoppinglistItem(selectedItemToDelete)
                          }
                          className="ps-4 pe-4 border-0 rounded-pill ms-3 fw-bold"
                        >
                          {t("DELETE")}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        )}
      </ModalBody>

      {!isInputFocused && (
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
      )}

      {!isInputFocused && (
        <div className="mb-2 ps-3 pe-3">
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
      )}

      {!isInputFocused && (
        <div className={"pt-3 text-end mx-4 mb-4"}>
          <button
            className={"col-4 border-0 rounded-pill bg-black fw-bold"}
            style={{ height: "36px", color: "#ffffff" }}
            onClick={handleToggle}
          >
            {t("CANCEL")}
          </button>
          <button
            className="col-3 border-0 rounded-pill ms-3 fw-bold"
            style={{
              backgroundColor: "#976BDB",
              height: "36px",
              color: "#ffffff",
            }}
            onClick={handleUpdateShoppingList}
          >
            {t("SAVE")}
          </button>
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
