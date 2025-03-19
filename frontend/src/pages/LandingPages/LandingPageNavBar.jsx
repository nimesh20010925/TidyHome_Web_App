import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo/TidyHome_Logo.png";

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
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/work">Work</Link></li>
        <li><Link to="/info">Info</Link></li>
      </ul>
      <Link to="/auth/login" className="get-started">Login</Link>
    </nav>
  );
};

export default LandingPageNavBar;
