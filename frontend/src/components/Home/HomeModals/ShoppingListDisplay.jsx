import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ShoppingListDisplay = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    listName: "",
    shoppingDate: "",
    shopVisitors: [],
  });
  const [homeMembers, setHomeMembers] = useState([]);
  const [user, setUser] = useState(null); // To store the user details

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);  // Get user data from localStorage
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

      setShowModal(false);
      fetchShoppingLists();
    } catch (error) {
      console.error("Error creating shopping list:", error);
    }
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
      
      {/* Only show this button if the user is a home owner */}
      {user && user.role === "homeOwner" && (
        <button className="home-shopin-create-btn" onClick={() => setShowModal(true)}>
          {t("CREATESHOPPINGSCHEDULES")}
        </button>
      )}

      <div className="home-shopping-list-wrapper">
        {shoppingLists.length === 0 ? (
          <p>No shopping lists available.</p>
        ) : (
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
                {/* Only show edit and delete buttons if the user is the home owner */}
                {user && user.role === "homeOwner" && (
                  <>
                    <button className="home-shopping-edit-btn" onMouseDown={(e) => e.stopPropagation()}>✏️</button>
                    <button className="home-shopping-delete-btn" onMouseDown={(e) => e.stopPropagation()}>🗑️</button>
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
            <h3>Create Shopping List</h3>
            <form onSubmit={handleSubmit}>
              <label>List Name:</label>
              <input
                type="text"
                name="listName"
                value={formData.listName}
                onChange={handleInputChange}
                required
              />

              <label>Shopping Date:</label>
              <input type="date" name="shoppingDate" value={formData.shoppingDate} onChange={handleInputChange} required onMouseDown={(e) => e.stopPropagation()}/>

              <label>Shop Visitors:</label>
              <select
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
              </select>

              <button type="submit" className="submit-btn" onMouseDown={(e) => e.stopPropagation()}>Create</button>
              <button type="button" className="cancel-btn" onMouseDown={(e) => e.stopPropagation()} onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDisplay;
