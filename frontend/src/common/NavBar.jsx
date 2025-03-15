import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { FaBell } from "react-icons/fa";
import TidyHomeLogo from "../assets/logo/TidyHome_Logo.png";
import HomeDummyImg from "../assets/navBar/dummy-home.jpg";
import Language from "../assets/navBar/language.png";
import Home from "../assets/navBar/home.png";
import ShoppingList from "../assets/navBar/shopping.png";
import Inventory from "../assets/navBar/inventory.png";
import Supplier from "../assets/navBar/supplier.png";
import HomeActive from "../assets/navBar/home-purple.png";
import Consumption from "../assets/navBar/consumption.png";
import ConsumptionActive from "../assets/navBar/consumption-purple.png";
import InventoryActive from "../assets/navBar/inventory-purple.png";
import SupplierActive from "../assets/navBar/supplier-purple.png";
import ShoppingListActive from "../assets/navBar/shopping-purple.png";
import LanguageSelector from "../translations/languageSelector.jsx";

const NavBar = () => {
  const navigate = useNavigate();
  const [activeNavTab, setActiveNavTab] = useState("HOME");
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  const handleNavTab = (tab, route) => {
    setActiveNavTab(tab);
    navigate(route);
  };

  const renderProfileSection = () => (
    <div className="d-flex align-items-center mb-1">
      <div className="position-relative">
        <img
          src={HomeDummyImg}
          className="me-3 rounded-circle"
          alt="User"
          width="40"
          height="40"
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="d-flex flex-column justify-content-center">
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
      tab: "CONSUMPTION",
      route: "/consumption_home",
      icon: Consumption,
      activeIcon: ConsumptionActive,
      label: t("CONSUMPTION"),
    },
    {
      tab: "SUPPLIERS",
      route: "/suppliers",
      icon: Supplier,
      activeIcon: SupplierActive,
      label: t("SUPPLIERS"),
    },
  ];

  return (
    <Navbar expand="lg" className="custom-navbar fixed-top ">
      <Container fluid>
        <Navbar.Brand href="/home" className="logo-container">
          <img src={TidyHomeLogo} alt="Logo" className="nav-logo" />
        </Navbar.Brand>
        <Nav className="nav-links">
          {buttonsData.map(({ tab, route, icon, activeIcon, label }) => (
            <div
              key={tab}
              className={`nav-item ${activeNavTab === tab ? "active" : ""}`}
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
        <Row className="d-flex align-items-center justify-content-end">
          <Col className="d-flex align-items-center gap-2 me-1">
            <FaBell className="bell-icon" />
            <div className="d-flex align-items-center">
              <img src={Language} width="28px" height="28px" alt="Language" />
              <LanguageSelector />
            </div>
          </Col>

          <Col className="d-flex align-items-center mt-1">
            {renderProfileSection()}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default NavBar;