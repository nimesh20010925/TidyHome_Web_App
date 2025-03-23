import { useState, useEffect } from "react";
import { Card, Dropdown, ListGroup, Button } from "react-bootstrap";
import { FaPlus, FaBox, FaTruck, FaFileExport, FaClock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import userAvatar from "../assets/navBar/dummy-user.png";
import addNotification from "../assets/sideBar/add-notification.png";
import addShopping from "../assets/sideBar/add-shopping.png";
import categories from "../assets/sideBar/categories.png";
import AddHomeMembers from "../components/Home/AddHomeMembers";
import { TbLayoutSidebarRightExpandFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import NotificationModal from "../components/custom_notification/customnotificationCreate/custom_notification";
// import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
// import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";

import Modal from "../components/consumption/consumptionCreateModel/consumptionCreateModel";
const SideBar = () => {
  const navigate = useNavigate();
    const { t } = useTranslation();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [addHomeMembersModal, setAddHomeMembersModal] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);
  const [isConsumptionModalOpen, setConsumptionModalOpen] = useState(false);

  const openNotificationModal = () => setNotificationModalOpen(true);
  const closeNotificationModal = () => setNotificationModalOpen(false);

  const openConsumptionModal = () => setConsumptionModalOpen(true);
  const closeConsumptionModal = () => setConsumptionModalOpen(false);

  const addHomeMembersToggle = () =>
    setAddHomeMembersModal(!addHomeMembersModal);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
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
    <>
      {/* Toggle Button - Always Visible on Small Screens */}
      <Button
        variant="light"
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarVisible((prev) => !prev)}
      >
        {isSidebarVisible ? <TbLayoutSidebarLeftExpandFilled /> : <TbLayoutSidebarRightExpandFilled />}
      </Button>

      <div className={`sidebar border-start h-100 ${isSidebarVisible ? "visible" : "d-none d-lg-block"}`}>
        <Card className="mb-3 border-0 shadow-none">
          <Card.Body className="d-flex align-items-center justify-content-between pb-0">
            <div className="d-flex align-items-center">
              <img src={userAvatar} alt="User Avatar" className="rounded-circle me-2" width="40" />
              <div>
                <h6 className="mb-0">{t("USER")}</h6>
                <small>{userRole === "homeOwner" ? "Home Owner" : "Member"}</small>
              </div>
            </div>
            <Dropdown className="ms-2">
              <Dropdown.Toggle variant="light" size="sm" className="border-0">⋮</Dropdown.Toggle>
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
        <h6 className="fw-bold mt-2 pt-1 ms-3">{t("QUICKACTION")}</h6>

      <ListGroup variant="flush">
        <a href="/app/category-home">
          <ListGroup.Item action className="border-0">
            <img
              src={categories}
              className="me-2"
              width="22px"
              height="22px"
              alt="Categories"
            />{" "}
            {t("CATEGORIES")}
          </ListGroup.Item>
        </a>
        <ListGroup.Item
          onClick={openConsumptionModal}
          action
          className="border-0"
        >
          <FaPlus className="me-2" />
          {t("CREATECONSUMPTION")}
        </ListGroup.Item>
        <Modal
          isOpen={isConsumptionModalOpen}
          closeModal={closeConsumptionModal}
        />

        <ListGroup.Item className="border-0">
          <Link
            to="/app/custom-notification"
            className="text-decoration-none text-dark"
          >
            <FaClock className="me-2" />
            Reminders
          </Link>
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
          {t("CREATECUSTOMREMINDERS")}
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
          {t("CREATENEWSHOPPINGLIST")}
        </ListGroup.Item>
        <ListGroup.Item action className="border-0">
          <FaBox className="me-2" /> {t("ADDNEWINVENTORY")}
        </ListGroup.Item>
        <a href="/app/supplier-home">
          <ListGroup.Item action className="border-0">
            <FaTruck className="me-2" />{t("ADDSUPPLIER")}
          </ListGroup.Item>
        </a>
        <ListGroup.Item action className="border-0">
          <FaFileExport className="me-2" /> {t("EXPORTREPORT")}
        </ListGroup.Item>
      </ListGroup>

        <div className="d-flex align-items-center justify-content-between mt-3 ms-3">
          <h6 className="fw-bold">{t("FAMILYMEMBERS")}</h6>
          {userRole === "homeOwner" && (
            <Button variant="" size="sm" className="me-3" onClick={setAddHomeMembersModal}>
              <FaPlus />
            </Button>
          )}
        </div>

        <ListGroup variant="flush">
          {loading ? (
            <p className="ms-3 mt-2">Loading...</p>
          ) : familyMembers.length > 0 ? (
            familyMembers.map((member) => (
              <ListGroup.Item key={member._id} className="d-flex align-items-center border-0">
                <img src={member.avatar || userAvatar} alt="Member Avatar" className="rounded-circle me-2" width="30" />
                {member.name}
              </ListGroup.Item>
            ))
          ) : (
            <p className="ms-3 mt-2">No family members found.</p>
          )}
        </ListGroup>

        <AddHomeMembers isOpen={addHomeMembersModal} toggle={addHomeMembersToggle} />
      </div>
    </>
  );
};

export default SideBar;