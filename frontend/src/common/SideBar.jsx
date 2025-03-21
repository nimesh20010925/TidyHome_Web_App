import { useState, useEffect } from "react";
import { Card, Dropdown, ListGroup, Button } from "react-bootstrap";
import { FaPlus, FaBox, FaTruck, FaFileExport, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userAvatar from "../assets/navBar/dummy-user.png";
import addNotification from "../assets/sideBar/add-notification.png";
import addShopping from "../assets/sideBar/add-shopping.png";
import categories from "../assets/sideBar/categories.png";
import AddHomeMembers from "../components/Home/AddHomeMembers";
import NotificationModal from "../components/custom_notification/customnotificationCreate/custom_notification";
// import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
// import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";

import Modal from "../components/consumption/consumptionCreateModel/consumptionCreateModel";
const SideBar = () => {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [addHomeMembersModal, setAddHomeMembersModal] = useState(false);

  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isConsumptionModalOpen, setConsumptionModalOpen] = useState(false);

  const openNotificationModal = () => setNotificationModalOpen(true);
  const closeNotificationModal = () => setNotificationModalOpen(false);

  const openConsumptionModal = () => setConsumptionModalOpen(true);
  const closeConsumptionModal = () => setConsumptionModalOpen(false);

  const addHomeMembersToggle = () =>
    setAddHomeMembersModal(!addHomeMembersModal);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Convert string to object
      setUserRole(parsedUser.role); // Set role (e.g., "homeOwner")
    }

    const fetchHomeMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3500/api/auth/home/members",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFamilyMembers(response.data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeMembers();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <div className="sidebar border-start h-100">
      <Card className="mb-3 border-0 shadow-none">
        <Card.Body className="d-flex align-items-center justify-content-between pb-0">
          <div className="d-flex align-items-center">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="rounded-circle me-2"
              width="40"
            />
            <div>
              <h6 className="mb-0">User</h6>
              <small>
                {userRole === "homeOwner" ? "Home Owner" : "Member"}
              </small>
            </div>
          </div>
          <Dropdown className="ms-2">
            <Dropdown.Toggle variant="light" size="sm" className="border-0">
              ⋮
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} className="sidebar-logout">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Body>
      </Card>

      <div className="border-top m-2 mt-3"></div>
      <h6 className="fw-bold mt-2 pt-1 ms-3">QUICK ACTIONS</h6>

      <ListGroup variant="flush">
        <a href="/category-home">
          <ListGroup.Item action className="border-0">
            <img
              src={categories}
              className="me-2"
              width="22px"
              height="22px"
              alt="Categories"
            />{" "}
            Categories
          </ListGroup.Item>
        </a>
        <ListGroup.Item
          onClick={openConsumptionModal}
          action
          className="border-0"
        >
          <FaPlus className="me-2" />
          Create Consumption
        </ListGroup.Item>
        <Modal
          isOpen={isConsumptionModalOpen}
          closeModal={closeConsumptionModal}
        />

        <ListGroup.Item
          onClick={openConsumptionModal}
          action
          className="border-0"
        >
          <FaClock className="me-2" />
          Reminders
        </ListGroup.Item>

        <ListGroup.Item
          onClick={openNotificationModal}
          action
          className="border-0"
        >
          <img
            src={addNotification}
            className="me-2"
            width="22px"
            height="22px"
            alt="Add Notification"
          />
          Custom Reminders
        </ListGroup.Item>
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={closeNotificationModal}
        />

        <ListGroup.Item action className="border-0">
          <img
            src={addShopping}
            className="me-2"
            width="22px"
            height="22px"
            alt="Create Shopping List"
          />{" "}
          Create New Shopping List
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaBox className="me-2" /> Add New Inventory
        </ListGroup.Item>
        <a href="/supplier-home">
          <ListGroup.Item action className="border-0">
            <FaTruck className="me-2" /> Add Supplier
          </ListGroup.Item>
        </a>
        <ListGroup.Item action className="border-0">
          <FaFileExport className="me-2" /> Export Reports
        </ListGroup.Item>
      </ListGroup>

      {/* Family Members Section */}
      <div className="d-flex align-items-center justify-content-between mt-3 ms-3">
        <h6 className="fw-bold">FAMILY MEMBERS</h6>
        {userRole === "homeOwner" && (
          <Button
            variant=""
            size="sm"
            className="me-3"
            onClick={setAddHomeMembersModal}
          >
            <FaPlus />
          </Button>
        )}
      </div>

      <ListGroup variant="flush">
        {loading ? (
          <p className="ms-3 mt-2">Loading...</p>
        ) : familyMembers.length > 0 ? (
          familyMembers.map((member) => (
            <ListGroup.Item
              key={member._id}
              className="d-flex align-items-center border-0"
            >
              <img
                src={member.avatar || userAvatar}
                alt="Member Avatar"
                className="rounded-circle me-2"
                width="30"
              />
              {member.name}
            </ListGroup.Item>
          ))
        ) : (
          <p className="ms-3 mt-2">No family members found.</p>
        )}
      </ListGroup>

      {/* Modal for Adding Home Members */}
      <AddHomeMembers
        isOpen={addHomeMembersModal}
        toggle={addHomeMembersToggle}
      />
    </div>
  );
};

export default SideBar;
