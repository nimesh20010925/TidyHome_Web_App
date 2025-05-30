import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/TidyHome_Logo.png";
import LanguageSelector from "../../translations/languageSelector.jsx";
import Language from "../../assets/navBar/language.png";

const LandingPageNavBar = () => {
  const [navbarBackground, setNavbarBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarBackground(true);
      } else {
        setNavbarBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar-landing ${navbarBackground ? "scrolled" : ""}`}>
      <div className="logo-landing">
        <img src={Logo} alt="TidyHome Logo" className="logo-image" />
      </div>
      <ul className="nav-links-landing">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/features">Features</Link>
        </li>
        <li>
          <Link to="/work">Contact Us</Link>
        </li>
      </ul>
      <div className="d-flex align-items-center">
        <img src={Language} width="30px" height="30px" alt="Language" />
        <LanguageSelector />
      </div>
      <Link to="/auth/login" className="get-started">
        LOGIN
      </Link>
    </nav>
  );
};

export default LandingPageNavBar;
