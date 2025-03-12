import React from "react";
import { Card, Dropdown, ListGroup } from "react-bootstrap";
import { FaPlus, FaBox, FaTruck, FaFileExport } from "react-icons/fa";
import userAvatar from "../assets/navBar/dummy-user.png";
import addNotification from "../assets/sideBar/add-notification.png";
import addShopping from "../assets/sideBar/add-shopping.png";

const SideBar = () => {
  const user = {
    name: "Himasha Sendanayaka",
    role: "Daughter",
    avatar: userAvatar, // Use variable instead of string
  };

  const familyMembers = [
    { id: 1, name: "USER 1", avatar: userAvatar },
    { id: 2, name: "USER 2", avatar: userAvatar },
    { id: 3, name: "USER 3", avatar: userAvatar },
    { id: 4, name: "USER 4", avatar: userAvatar },
    { id: 5, name: "USER 5", avatar: userAvatar },
    { id: 6, name: "USER 6", avatar: userAvatar },
    { id: 7, name: "USER 7", avatar: userAvatar },
  ];

  return (
    <div className="sidebar border-start h-100">
      <Card className="mb-3 border-0 shadow-none">
        <Card.Body className="d-flex align-items-center justify-content-between pb-0">
          <div className="d-flex align-items-center">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="rounded-circle me-2"
              width="40"
            />
            <div>
              <h6 className="mb-0">{user.name}</h6>
              <small>{user.role}</small>
            </div>
          </div>
          <Dropdown className="ms-2">
            <Dropdown.Toggle variant="light" size="sm" className="border-0">
              ⋮
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
      </Card>
      <div className="border-top m-2 mt-3"></div>
      <h6 className="fw-bold mt-2 pt-1">QUICK ACTIONS</h6>

      <ListGroup variant="flush">
        <ListGroup.Item action className="border-0">
          <FaPlus className="me-2" /> Create Consumption
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <img
            src={addNotification}
            className="me-2 add-notification-icon"
            width="22px"
            height="22px"
            alt="Add Notification"
          />
          Create Custom Notification
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <img
            src={addShopping}
            className="me-2 add-notification-icon"
            width="22px"
            height="22px"
            alt="Create Shopping List"
          />
          Create New Shopping List
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaBox className="me-2" /> Add Product
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaTruck className="me-2" /> Add Supplier
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaFileExport className="me-2" /> Export Reports
        </ListGroup.Item>
      </ListGroup>
      <div className="border-top m-2 mt-2 pt-1"></div>
      <h6 className="fw-bold mt-2">FAMILY MEMBERS</h6>
      <ListGroup variant="flush">
        {familyMembers.map((member) => (
          <ListGroup.Item
            key={member.id}
            className="d-flex align-items-center border-0"
          >
            <img
              src={member.avatar}
              alt="Member Avatar"
              className="rounded-circle me-2"
              width="30"
            />
            {member.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SideBar;
