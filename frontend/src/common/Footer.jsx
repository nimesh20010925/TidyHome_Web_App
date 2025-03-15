import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-light text-dark py-4 border-top">
      <Container>
        {/* Top Section */}
        <Row className="align-items-center">
          {/* Left - Description */}
          <Col md={4} className="text-start">
            <p className="mb-0 fw-semibold">
              Cultivating Efficiency, Tracking Excellence —
              <br />
              Your Trusted Inventory Management Partner
            </p>
          </Col>

          {/* Center - Navigation Links */}
          <Col md={4} className="text-center">
            <a href="/dashboard" className="text-dark mx-2 text-decoration-none">
              Dashboard
            </a>
            <a href="/inventory" className="text-dark mx-2 text-decoration-none">
              Inventory
            </a>
            <a href="/shopping-list" className="text-dark mx-2 text-decoration-none">
              Shopping List
            </a>
            <a href="/suppliers" className="text-dark mx-2 text-decoration-none">
              Suppliers
            </a>
            <a href="/contact" className="text-dark mx-2 text-decoration-none">
              Contact Us
            </a>
          </Col>

          {/* Right - Social Media Icons */}
          <Col md={4} className="text-end">
            <a href="https://facebook.com" className="text-dark mx-2">
              <FaFacebookF size={20} className="text-primary" />
            </a>
            <a href="https://instagram.com" className="text-dark mx-2">
              <FaInstagram size={20} className="text-primary" />
            </a>
            <a href="https://twitter.com" className="text-dark mx-2">
              <FaTwitter size={20} className="text-primary" />
            </a>
          </Col>
        </Row>

        {/* Horizontal Line */}
        <hr className="my-3" />

        {/* Bottom Section */}
        <Row className="align-items-center">
          {/* Left - Privacy Policy */}
          <Col md={4} className="text-start">
            <a href="/privacy-policy" className="text-dark text-decoration-none">
              Privacy Policy
            </a>
          </Col>

          {/* Center - Copyright */}
          <Col md={4} className="text-center">
            <span>© 2023 Tidy Home Technologies, Inc.</span>
          </Col>

          {/* Right - Terms & Conditions */}
          <Col md={4} className="text-end">
            <a href="/terms" className="text-dark text-decoration-none">
              Terms & Conditions
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
