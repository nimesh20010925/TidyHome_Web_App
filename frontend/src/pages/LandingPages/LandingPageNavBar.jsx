import React from "react";
import { Link } from "react-router-dom";  
import Logo from "../../assets/logo/TidyHome_Logo.png";

const LandingPageNavBar = () => {
  return (
    <header className="landingnavbarHeader">
      <Link to="/">
        <img className="landingnavbarlogo" src={Logo} alt="TidyHome Home Logo" />
      </Link>
      <nav>
        <ul className="landingpagenavlink">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </nav>
      <Link to="/auth/login" className="cta">
        <button className="landingpagebutton">Login</button>
      </Link>
    </header>
  );
};

export default LandingPageNavBar;
