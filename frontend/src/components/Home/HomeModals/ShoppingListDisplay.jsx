import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import Form from "react-bootstrap/Form";

const ShoppingListDisplay = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [currentList, setCurrentList] = useState(null); // For editing
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    listName: "",
    shoppingDate: "",
    shopVisitors: [],
  });
  const [homeMembers, setHomeMembers] = useState([]);
  const [createShoppingScheduleModal, setCreateShoppingScheduleModal] =
    useState(false);

  const createShoppingScheduleToggle = () =>
    setCreateShoppingScheduleModal(!createShoppingScheduleModal);

  useEffect(() => {
    fetchShoppingLists();
    fetchHomeMembers();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3500/api/shoppingList/shopping-lists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched Shopping Lists Response:", response.data); // Log to confirm structure

      // Extract the shoppingLists array from the response
      if (response.data && Array.isArray(response.data.shoppingLists)) {
        setShoppingLists(response.data.shoppingLists);
      } else {
        console.error("Unexpected response format:", response.data);
        setShoppingLists([]); // Ensure state is always an array
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      setShoppingLists([]); // Prevent UI errors
    }
  };

  const fetchHomeMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3500/api/auth/home/members",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHomeMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching home members:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVisitorsChange = (e) => {
    const visitorIds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, shopVisitors: visitorIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.homeID || !user._id) {
        console.error("Missing homeID or user ID in localStorage");
        return;
      }

      const requestData = {
        homeId: user.homeID,
        createdBy: user._id,
        listName: formData.listName,
        shoppingDate: formData.shoppingDate,
        shopVisitors: formData.shopVisitors,
      };

      if (currentList) {
        // If editing an existing shopping list
        await axios.put(
          `http://localhost:3500/api/shoppingList/shopping-lists/${currentList._id}`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // If creating a new shopping list
        await axios.post(
          "http://localhost:3500/api/shoppingList/shopping-lists",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      createShoppingScheduleToggle();

      setCurrentList(null);
      fetchShoppingLists();
    } catch (error) {
      console.error("Error saving shopping list:", error);
    }
  };

  const handleDelete = async (listId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3500/api/shoppingList/shopping-lists/${listId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchShoppingLists();
    } catch (error) {
      console.error("Error deleting shopping list:", error);
    }
  };

  const handleEdit = (list) => {
    setFormData({
      listName: list.listName,
      shoppingDate: list.shoppingDate,
      shopVisitors: list.shopVisitors,
    });
    setCurrentList(list);
    createShoppingScheduleToggle();
  };

  const getVisitorNames = (visitorIds) => {
    return visitorIds.map((id) => {
      const member = homeMembers.find((member) => member._id === id);
      return member ? member.name : "Unknown Visitor";
    });
  };

  const closeBtn = (
    <button
      className="close-btn"
      onClick={createShoppingScheduleToggle}
      onMouseDown={(e) => e.stopPropagation()}
      type="button"
    >
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  return (
    <div className="home-shopping-container">
      <h2 className="home-shopping-h2">{t("SHOPPINGSCHEDULES")}</h2>
      {localStorage.getItem("user") &&
        JSON.parse(localStorage.getItem("user")).role === "homeOwner" && (
          <button
            className="home-shopin-create-btn"
            onClick={createShoppingScheduleToggle}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {t("CREATESHOPPINGSCHEDULES")}
          </button>
        )}

      <div className="home-shopping-list-wrapper">
        {Array.isArray(shoppingLists) && shoppingLists.length === 0 ? (
          <p>No shopping lists available.</p>
        ) : (
          Array.isArray(shoppingLists) &&
          shoppingLists.map((list) => (
            <div key={list._id} className="home-shopping-card">
              <div className="home-shopping-header">
                <strong>{list.listName}</strong>
                <span>
                  {new Date(list.shoppingDate).toISOString().split("T")[0]}
                </span>
              </div>
              <div className="home-shopping-members">
                {list.shopVisitors && list.shopVisitors.length > 0 ? (
                  getVisitorNames(list.shopVisitors).map(
                    (visitorName, index) => <p key={index}>{visitorName}</p>
                  )
                ) : (
                  <p>No visitors</p>
                )}
              </div>
              <div className="home-shopping-actions">
                {/* Show Edit and Delete buttons only if the user is a homeOwner */}
                {localStorage.getItem("user") &&
                  JSON.parse(localStorage.getItem("user")).role ===
                    "homeOwner" && (
                    <>
                      <button
                        className="home-shopping-edit-btn"
                        onClick={() => handleEdit(list)}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        ✏️
                      </button>
                      <button
                        className="home-shopping-delete-btn"
                        onClick={() => handleDelete(list._id)}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        🗑️
                      </button>
                    </>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        className="add-inventory-modal"
        isOpen={createShoppingScheduleModal}
        toggle={createShoppingScheduleToggle}
        centered
      >
        <ModalHeader
          toggle={createShoppingScheduleToggle}
          close={closeBtn}
          className="border-0 poppins-medium mx-4 mt-2 fw-bold"
        >
          Create Shopping List
        </ModalHeader>

        <ModalBody className="add-inventory-modal-body">
          <div>
            <form onSubmit={handleSubmit}>
              <Form.Group className="custom-inventory-form-group">
                <Form.Control
                  className="custom-inventory-form-input"
                  type="text"
                  name="listName"
                  value={formData.listName}
                  onChange={handleInputChange}
                  required
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <Form.Label>List Name:</Form.Label>
              </Form.Group>

              <Form.Group className="custom-inventory-form-group">
                <Form.Control
                  type="date"
                  name="shoppingDate"
                  value={formData.shoppingDate}
                  onChange={handleInputChange}
                  required
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <Form.Label>Shopping Date:</Form.Label>
              </Form.Group>

              <Form.Group className="custom-inventory-form-group">
                <Form.Label>
                  Shop Visitors: <span className="required">*</span>
                </Form.Label>
                <Form.Select
                  name="shopVisitors"
                  multiple
                  value={formData.shopVisitors}
                  onChange={handleVisitorsChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  size={homeMembers.length}
                >
                  {homeMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 pt-2 pb-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{
                  backgroundColor: "#bb87fa",
                  border: "none",
                  fontSize: "17px",
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                Create
              </Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ShoppingListDisplay;
