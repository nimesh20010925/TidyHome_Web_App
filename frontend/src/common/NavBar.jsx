import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Input } from "reactstrap";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { FaBell, FaSearch } from "react-icons/fa";
import TidyHomeLogo from "../assets/logo/TidyHome_Logo.png";
import UserDummyImg from "../assets/navBar/dummy-user.png";
import Language from "../assets/navBar/language.png";
import Home from "../assets/navBar/home.png";
import ShoppingList from "../assets/navBar/shopping.png";
import Inventory from "../assets/navBar/inventory.png";
import Supplier from "../assets/navBar/supplier.png";
import HomeActive from "../assets/navBar/home-purple.png";
import InventoryActive from "../assets/navBar/inventory-purple.png";
import SupplierActive from "../assets/navBar/supplier-purple.png";
import ShoppingListActive from "../assets/navBar/shopping-purple.png";
import LanguageSelector from "../translations/languageSelector.jsx";
import ConsumptionActive from "../assets/navBar/consumptionactive.svg";
import Consumption from "../assets/navBar/consumption.svg";
import CustomNotificationActive from "../assets/navBar/CustomNotificationActive.svg";
import CustomNotification from "../assets/navBar/CustomNotification.svg";

const NavBar = () => {
  const navigate = useNavigate();
  const [activeNavTab, setActiveNavTab] = useState("HOME");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const handleNavTab = (tab, route) => {
    setActiveNavTab(tab);
    navigate(route);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    console.log("Searching for:", searchQuery);
  };

  const renderProfileSection = () => (
    <div className="d-flex align-items-center">
      <img src={UserDummyImg} className="profile-picture-preview" alt="User" />
      <div className="d-flex flex-column ml-2">
        <div className="avatar-head-txt">{"User"}</div>
        <div className="avatar-role-txt">{"Role"}</div>
      </div>
    </div>
  );

  const buttonsData = [
    {
      tab: "HOME",
      route: "/home",
      icon: Home,
      activeIcon: HomeActive,
      label: t("HOME"),
    },
    {
      tab: "INVENTORY",
      route: "/inventory",
      icon: Inventory,
      activeIcon: InventoryActive,
      label: t("INVENTORY"),
    },
    {
      tab: "SHOPPING LIST",
      route: "/shopping-list",
      icon: ShoppingList,
      activeIcon: ShoppingListActive,
      label: t("SHOPPING_LIST"),
    },
    {
      tab: "SUPPLIERS",
      route: "/suppliers",
      icon: Supplier,
      activeIcon: SupplierActive,
      label: t("SUPPLIERS"),
    },
    {
      tab: "Consumption",
      route: "/consumption_home",
      icon: Consumption,
      activeIcon: ConsumptionActive,
      label: t("Consumption"),
    },
    {
      tab: "CUSTOM_NOTIFICATION",
      route: "/custom_notification",
      icon: CustomNotification,
      activeIcon: CustomNotificationActive,
      label: t("NOTIFICATIONS"),
    },
  ];

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <div className="container">
          <div className="outer-layer">
            <Navbar.Brand href="/home" className="logo-container">
              <img src={TidyHomeLogo} alt="Logo" className="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav">
              <Nav className="nav-links">
                {buttonsData.map(({ tab, route, icon, activeIcon, label }) => (
                  <div
                    key={tab}
                    className={`nav-item ${
                      activeNavTab === tab ? "active" : ""
                    }`}
                    onClick={() => handleNavTab(tab, route)}
                  >
                    <img
                      src={activeNavTab === tab ? activeIcon : icon}
                      alt={tab}
                      className="nav-icon"
                    />
                    <span className="nav-label">{label}</span>
                  </div>
                ))}
              </Nav>

              <div className="search-bar-container d-flex align-items-center ml-3">
                <Input
                  type="text"
                  placeholder={t("Search")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-bar"
                />
                <button
                  className="search-btn"
                  onClick={handleSearchClick}
                  style={{
                    border: "none",
                    borderRadius: "20px",
                    background: "#C799FF",
                    cursor: "pointer",
                    padding: "3px 31px",
                    color: "white",
                  }}
                >
                  <FaSearch size={20} />
                </button>
              </div>

              <Row className="d-flex ">
                
                <Col className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={Language}
                      width="20px"
                      height="20px"
                      alt="Language"
                    />
                    <LanguageSelector />
                  </div>
                  <FaBell
                    className="icon"
                    onClick={() =>
                      handleNavTab(
                        "CUSTOM_NOTIFICATION",
                        "/custom_notification"
                      )
                    }
                    style={{ cursor: "pointer" }}
                  />
                </Col>
                <Col className="d-flex align-items-center mt-1">
                  {renderProfileSection()}
                </Col>
              </Row>
            </Navbar.Collapse>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
