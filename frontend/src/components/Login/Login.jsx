
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';

import LoginImage from "../../assets/login/login.jpg";
import Logo from "../../assets/logo/TidyHome_Logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", formData);
      
      if (response.data.success) {
        const { token, user, redirectTo } = response.data;

        // Store user data and token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect user to the appropriate page
        navigate(redirectTo);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      {/* Left Image Box */}
      <div className="imgBx">
        <img src={LoginImage} alt="Login" />
      </div>

      {/* Right Content Box */}
      <div className="contentBx">
        <div className="formBx">
          {/* Logo & Title */}
          <div>
            <img src={Logo} alt="TidyHome Logo" className="loginlogo" />
            <div className='loginh2'>
              <h2>{t("LOGIN")}</h2>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="signupinputBx">
              <span>{t("EMAIL")}</span>
              <input
                type="email"
                className="signupinput"
                placeholder={t("EXEMAIL")}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password input */}
            <div className="signupinputBx">
              <span>{t("PASSWORD")}</span>
              <input
                type="password"
                className="signupinput"
                placeholder={t("EXPASSWORD")}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="remember">
              <label>
                <input type="checkbox" /> {t("REMEMBERME")}
                <Link to="/forgot-password" className="forgotpasswordlink">{t("FOGOTPASSWORD")}</Link>
              </label>
            </div>

            {/* Submit button */}
            <div className="signupinputBx">
              <input 
                type="submit" 
                value={isLoading ? t("LOADING") : t("LOGIN")} 
                className="signupbutton" 
                disabled={isLoading}
              />
            </div>

            {/* Sign up link */}
            <div>
              <p className="signuppara">
                {t("DONTHAVEANACCOUNT")}{" "}
                <Link to="/signup" className="signuplink">{t("SIGNUP")}</Link>
              </p>
            </div>
          </form>

          {/* Show error message */}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default Login;
