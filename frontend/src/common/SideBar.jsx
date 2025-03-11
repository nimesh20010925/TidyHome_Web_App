import React from "react";
import { Card, Dropdown, ListGroup } from "react-bootstrap";
import { FaPlus, FaBox, FaTruck, FaFileExport } from "react-icons/fa";
import userAvatar from "../assets/navBar/dummy-user.png"; // Correct import

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
    <div className="sidebar border-start mh-100">
      <Card className="mb-3 border-0 shadow-none">
        <Card.Body className="d-flex align-items-center justify-content-between">
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
          <Dropdown>
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
      <h6 className="fw-bold">Quick Actions</h6> 
      
      <ListGroup variant="flush">
        <ListGroup.Item action className="border-0">
          <FaPlus className="me-2" /> Create Consumption
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaBox className="me-2" /> Add Product
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaTruck className="me-2" /> Add Supplier
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaFileExport className="me-2" /> Export Report
        </ListGroup.Item>
      </ListGroup>
      <div className="border-top m-2 mt-3"></div>
      <h6 className="fw-bold mt-3">FAMILY MEMBERS</h6>
      <ListGroup variant="flush">
        {familyMembers.map((member) => (
          <ListGroup.Item key={member.id} className="d-flex align-items-center border-0">
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
