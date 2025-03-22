import React, { useEffect, useState } from "react";
import axios from "axios";
import userAvatar from "../../../assets/navBar/dummy-user.png";

import AddHomeMembers from "../AddHomeMembers.jsx"; // Assuming this is the modal component
import { Button } from "react-bootstrap"; // If you're using react-bootstrap for buttons

const HomeMembersTable = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [userRole, setUserRole] = useState(""); // Initialize userRole state
  const [addHomeMembersModal, setAddHomeMembersModal] = useState(false);

  const addHomeMembersToggle = () => setAddHomeMembersModal(!addHomeMembersModal); // Toggle modal visibility

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    }
  }, []); // Effect to get user role from local storage

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3500/api/auth/home/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching members", error);
    }
  };

  const handleDelete = async (memberID) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3500/api/auth/home/members/${memberID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((member) => member._id !== memberID));
    } catch (error) {
      console.error("Error deleting member", error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member._id);
    setUpdatedName(member.name);
  };

  const handleUpdate = async (memberID) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3500/api/auth/home/members/${memberID}`,
        { name: updatedName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(
        members.map((member) =>
          member._id === memberID ? { ...member, name: updatedName } : member
        )
      );
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating member", error);
    }
  };

  return (
    <div className="home-members-table-container">
      <div className="table-header">
        <h2 className="table-title">Home Member List</h2>
        {userRole === "homeOwner" && (
          <Button variant="primary" size="sm" className="me-3" onClick={addHomeMembersToggle}>
           + Add Home Member 
          </Button>
        )}
      </div>

      <table className="members-table">
        <thead>
          <tr>
            <th>User Image</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>
                <img
                  src={userAvatar}
                  alt="User"
                  className="user-avatar"
                />
              </td>
              <td>
                {editingMember === member._id ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                  />
                ) : (
                  member.name
                )}
              </td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>{member.address}</td>
              <td>
                <div className="action-icons">
                  <button className="view-btn">👁️</button>
                  {editingMember === member._id ? (
                    <button className="save-btn" onClick={() => handleUpdate(member._id)}>
                      💾
                    </button>
                  ) : (
                    <button className="edit-btn" onClick={() => handleEdit(member)}>
                      ✏️
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => handleDelete(member._id)}>
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddHomeMembers isOpen={addHomeMembersModal} toggle={addHomeMembersToggle} />
    </div>
  );
};

export default HomeMembersTable;
