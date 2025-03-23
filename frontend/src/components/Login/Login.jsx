import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

import LoginImage from "../../assets/login/login.jpg";
import Logo from "../../assets/logo/TidyHome_Logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form before submission
  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = t("EMAILREQUIRED");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("INVALIDEMAIL");
    }

    if (!formData.password) {
      newErrors.password = t("PASSWORDREQUIRED");
    } else if (formData.password.length < 6) {
      newErrors.password = t("PASSWORDTOOSHORT");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3500/api/auth/login", formData);
      
      if (response.data.success) {
        const { token, user, redirectTo } = response.data;

        // Store user data and token
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate(redirectTo);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || t("LOGINERROR"));
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
          <div>
            <img src={Logo} alt="TidyHome Logo" className="loginlogo" />
            <div className="loginh2">
              <h2>{t("LOGIN")}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="signupinputBx">
              <span>{t("EMAIL")}</span>
              <input
                type="email"
                className={`signupinput ${errors.email ? "login-input-error" : ""}`}
                placeholder={t("EXEMAIL")}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="login-error-message">{errors.email}</div>}
            </div>

            {/* Password input */}
            <div className="signupinputBx">
              <span>{t("PASSWORD")}</span>
              <input
                type="password"
                className={`signupinput ${errors.password ? "login-input-error" : ""}`}
                placeholder={t("EXPASSWORD")}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && <div className="login-error-message">{errors.password}</div>}
            </div>

            {/* Remember me & Forgot password */}
            <div className="remember">
              <label>
                <input type="checkbox" /> {t("REMEMBERME")}
                <Link to="/forgot-password" className="forgotpasswordlink">
                  {t("FOGOTPASSWORD")}
                </Link>
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
                <Link to="/auth/signup" className="signuplink">{t("SIGNUP")}</Link>
              </p>
            </div>
          </form>

          {/* Show server error message */}
          {serverError && <div className="login-error-message">{serverError}</div>}
        </div>
      </div>
    </section>
  );
};

export default Login;
