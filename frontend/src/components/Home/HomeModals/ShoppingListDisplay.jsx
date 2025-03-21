import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShoppingListDisplay = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    listName: '',
    shoppingDate: '',
    shopVisitors: [], // Array to store selected visitors
  });
  const [homeMembers, setHomeMembers] = useState([]); // To store home members

  useEffect(() => {
    fetchShoppingLists();
    fetchHomeMembers(); // Fetch home members when the component mounts
  }, []);

  // Fetch shopping lists from the server
  const fetchShoppingLists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3500/api/shoppingList/shopping-lists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShoppingLists(response.data);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    }
  };

  // Fetch home members from the server
  const fetchHomeMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3500/api/auth/home/members', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHomeMembers(response.data.members); // Store members in the state
    } catch (error) {
      console.error('Error fetching home members:', error);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle shop visitors selection (multiple selection)
  const handleVisitorsChange = (e) => {
    const visitorIds = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, shopVisitors: visitorIds });
  };

  // Handle form submission to create a new shopping list
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.homeID || !user._id) {
        console.error('Missing homeID or user ID in localStorage');
        return;
      }

      const requestData = {
        homeId: user.homeID,
        createdBy: user._id,
        listName: formData.listName,
        shoppingDate: formData.shoppingDate,
        shopVisitors: formData.shopVisitors, // Array of selected visitor IDs
      };

      const response = await axios.post('http://localhost:3500/api/shoppingList/shopping-lists', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response Data:', response.data);
      setShowModal(false);
      fetchShoppingLists(); // Refresh the list
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }
  };

  // Function to get the visitor names from IDs
  const getVisitorNames = (visitorIds) => {
    return visitorIds.map((id) => {
      const member = homeMembers.find((member) => member._id === id);
      return member ? member.name : 'Unknown Visitor';
    });
  };

  return (
    <div className="shopping-container">
      <h2>Shopping Schedules</h2>
      <button className="create-btn" onClick={() => setShowModal(true)}>
        Create Shopping Schedules
      </button>

      {shoppingLists.length === 0 ? (
        <p>No shopping lists available.</p>
      ) : (
        shoppingLists.map((list) => (
          <div key={list._id} className="shopping-card">
            <div className="shopping-header">
              <strong>{list.listName}</strong>
              <span>{new Date(list.shoppingDate).toISOString().split('T')[0]}</span>
            </div>
            <div className="shopping-members">
              {list.shopVisitors && list.shopVisitors.length > 0 ? (
                getVisitorNames(list.shopVisitors).map((visitorName, index) => (
                  <p key={index}>{visitorName}</p>
                ))
              ) : (
                <p>No visitors</p>
              )}
            </div>
            <div className="shopping-actions">
              <button className="edit-btn">✏️</button>
              <button className="delete-btn">🗑️</button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Shopping List</h3>
            <form onSubmit={handleSubmit}>
              <label>List Name:</label>
              <input type="text" name="listName" value={formData.listName} onChange={handleInputChange} required />

              <label>Shopping Date:</label>
              <input type="date" name="shoppingDate" value={formData.shoppingDate} onChange={handleInputChange} required />

              <label>Shop Visitors:</label>
              <select
                name="shopVisitors"
                multiple
                value={formData.shopVisitors}
                onChange={handleVisitorsChange}
                size={homeMembers.length} // Adjust the dropdown size based on the number of members
              >
                {homeMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="submit-btn">Create</button>
              <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDisplay;
