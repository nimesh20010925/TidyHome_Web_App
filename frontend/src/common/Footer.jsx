import { Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TidyHomeLogo from "../assets/logo/TidyHome_Logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (route) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <Row className="footer-nav">
        <Col className="footer-logo-container">
          <img src={TidyHomeLogo} alt="Logo" className="footer-logo" />
          <div className="fw-bold custom-font">
            <span className="large-letter">T</span>
            <span className="normal-text">IDY</span>
            <span className="large-letter">H</span>
            <span className="normal-text">OME</span>
          </div>
        </Col>
        <Col className="d-flex justify-content-end gap-4">
          <div
            className="footer-tab-links"
            onClick={() => handleNavigation("/home")}
          >
            {t("HOME")}
          </div>
          <div
            className="footer-tab-links"
            onClick={() => handleNavigation("/inventory")}
          >
            {t("INVENTORY")}
          </div>
          <div
            className="footer-tab-links"
            onClick={() => handleNavigation("/shopping-list")}
          >
            {t("SHOPPING_LIST")}
          </div>
          <div
            className="footer-tab-links"
            onClick={() => handleNavigation("/consumption_home")}
          >
            {t("CONSUMPTION")}
          </div>
          <div
            className="footer-tab-links"
            onClick={() => handleNavigation("/suppliers")}
          >
            {t("SUPPLIERS")}
          </div>
          <div
            className="footer-tab-links"
            onClick={() => handleNavigation("/contact-us")}
          >
            {t("CONTACTUS")}
          </div>
        </Col>
      </Row>

      <Row className="d-flex justify-content-between align-items-center my-3 mb-4">
        <Col className="text-start">
          <p className="footer-text">
            {t("CULTIVATING_EFFICIENCY")} —<br />
            {t("YOUR_THRUSTED_INVENTORY_MANAGEMENT_PARTNER")}
          </p>
        </Col>

        <Col className="text-end">
          <FaFacebook className="social-icon" />
          <FaInstagram className="social-icon" />
          <FaTwitter className="social-icon" />
        </Col>
      </Row>

      <hr className="footer-divider" />

      <Row className="align-items-center footer-bottom">
        <Col className="text-start">
          <a href="/privacy-policy" className="footer-link">
            Privacy Policy
          </a>
        </Col>

        <Col className="text-center">
          <span className="footer-copyright">
            © 2025 Tidy Home Technologies.
          </span>
        </Col>

        <Col className="text-end">
          <a href="/terms-conditions" className="footer-link">
            Terms & Conditions
          </a>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
