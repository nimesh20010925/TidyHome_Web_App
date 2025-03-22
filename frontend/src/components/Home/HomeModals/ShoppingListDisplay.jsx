import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ShoppingListDisplay = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentList, setCurrentList] = useState(null);  // For editing
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    listName: "",
    shoppingDate: "",
    shopVisitors: [],
  });
  const [homeMembers, setHomeMembers] = useState([]);

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
      setShoppingLists(response.data);
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
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
    const visitorIds = Array.from(e.target.selectedOptions, (option) => option.value);
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
        await axios.put(`http://localhost:3500/api/shoppingList/shopping-lists/${currentList._id}`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // If creating a new shopping list
        await axios.post("http://localhost:3500/api/shoppingList/shopping-lists", requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      setShowModal(false);
      setCurrentList(null);
      fetchShoppingLists();
    } catch (error) {
      console.error("Error saving shopping list:", error);
    }
  };

  const handleDelete = async (listId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3500/api/shoppingList/shopping-lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    setShowModal(true);
  };

  const getVisitorNames = (visitorIds) => {
    return visitorIds.map((id) => {
      const member = homeMembers.find((member) => member._id === id);
      return member ? member.name : "Unknown Visitor";
    });
  };

  return (
    <div className="home-shopping-container">
      <h2 className="home-shopping-h2">{t("SHOPPINGSCHEDULES")}</h2>
      <button className="home-shopin-create-btn" onClick={() => setShowModal(true)}>
        {t("CREATESHOPPINGSCHEDULES")}
      </button>

      <div className="home-shopping-list-wrapper">
        {shoppingLists.length === 0 ? (
          <p>No shopping lists available.</p>
        ) : (
          shoppingLists.map((list) => (
            <div key={list._id} className="home-shopping-card">
              <div className="home-shopping-header">
                <strong>{list.listName}</strong>
                <span>{new Date(list.shoppingDate).toISOString().split("T")[0]}</span>
              </div>
              <div className="home-shopping-members">
                {list.shopVisitors && list.shopVisitors.length > 0 ? (
                  getVisitorNames(list.shopVisitors).map((visitorName, index) => (
                    <p key={index}>{visitorName}</p>
                  ))
                ) : (
                  <p>No visitors</p>
                )}
              </div>
              <div className="home-shopping-actions">
                {/* Show Edit and Delete buttons only if the user is a homeOwner */}
                {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).role === "homeOwner" && (
                  <>
                    <button className="home-shopping-edit-btn" onClick={() => handleEdit(list)} onMouseDown={(e) => e.stopPropagation()}>✏️</button>
                    <button className="home-shopping-delete-btn" onClick={() => handleDelete(list._id)} onMouseDown={(e) => e.stopPropagation()}>🗑️</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentList ? "Edit Shopping List" : "Create Shopping List"}</h3>
            <form onSubmit={handleSubmit}>
              <label>List Name:</label>
              <input type="text" name="listName" value={formData.listName} onChange={handleInputChange} required />

              <label>Shopping Date:</label>
              <input type="date" name="shoppingDate" value={formData.shoppingDate} onChange={handleInputChange} required />

              <label>Shop Visitors:</label>
              <select name="shopVisitors" multiple value={formData.shopVisitors} onChange={handleVisitorsChange} size={homeMembers.length}>
                {homeMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="submit-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDisplay;
