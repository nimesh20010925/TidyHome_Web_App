import React, { useState } from "react";
import axios from "axios";
import SignupImage from "../../assets/login/signup.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const navigate = useNavigate(); // Use useNavigate for react-router-dom v6
  const { t } = useTranslation();

  // Define states for the form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (!/^[0-9]*$/.test(value)) return; // Only allow numbers
      if (value.length > 10) return; // Prevent input beyond 10 digits
      setPhoneError(value.length === 10 ? "" : t("PHONEMUSTBE10DIGITS"));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (formData.phone.length !== 10) {
      setPhoneError(t("PHONEMUSTBE10DIGITS"));
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post("http://localhost:3500/api/auth/register", formData);
      if (response.data.success) {
        navigate("/auth/login"); // Redirect on success
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="imgBx">
        <img src={SignupImage} alt="Signup" />
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2 className="signuph2">{t("SIGNUP")}</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>} {/* Show error message if any */}

            <div className="signupinputBx">
              <span>{t("USERNAME")}</span>
              <input
                type="text"
                className="signupinput"
                placeholder={t("EXJOHNPERERA")}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

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

            <div className="signupinputBx">
              <span>{t("PHONE")}</span>
              <input
                type="tel"
                className="signupinput"
                placeholder={t("EXPHONE")}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {phoneError && <div className="error-message">{phoneError}</div>}
            </div>

            <div className="signupinputBx">
              <span>{t("ADDRESS")}</span>
              <input
                type="text"
                className="signupinput"
                placeholder={t("EXADDRESS")}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="remember">
              <label>
                <input type="checkbox" /> {t("REMEMBERME")}
              </label>
            </div>

            <div className="signupinputBx">
              <input
                type="submit"
                value={isLoading ? t("LOADING") : t("SIGNUP")}
                className="signupbutton"
                disabled={isLoading} // Disable the button during loading
              />
            </div>

            <div>
              <p className="signuppara">
                {t("ALREADYHAVEANACCOUNT")} <Link to="/auth/login" className="signuplink">{t("LOGIN")}</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
