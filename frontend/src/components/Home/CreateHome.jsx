import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomeImage from "../../assets/home/home.png";
import axios from "axios";
import { toast } from "react-hot-toast";
const CreateHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    homeName: "",
    ownerName: user ? user.name : "",
    homePhone: "",
    address: "",
    number_of_members: "",
    ownerID: user ? user._id : "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle validation for phone number and members
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    // Only allow numbers and limit the length to 10
    if (/^\d{0,10}$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        homePhone: value,
      }));
    }
  };

  const handleMembersChange = (e) => {
    const { value } = e.target;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        number_of_members: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      toast.error("Authentication token is missing. Please log in again.")
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3500/api/home/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const updatedUser = { ...user, homeID: response.data.home._id };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("you successfully create your home")
        navigate("/app/home");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error creating home");
      toast.error("Error creating home")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="imgBx">
        <img src={HomeImage} alt="Signup" />
      </div>
      <div className="contentBx">
        <div className="formBx">
          <h2 className="signuph2">{t("CREATEHOME")}</h2>
          <form onSubmit={handleSubmit}>
            <div className="signupinputBx">
              <span>{t("HOMENAME")}</span>
              <input type="text" className="signupinput" name="homeName" value={formData.homeName} onChange={handleInputChange} required />
            </div>
            <div className="signupinputBx">
              <span>{t("OWNERNAME")}</span>
              <input type="text" className="signupinput" name="ownerName" value={formData.ownerName} readOnly />
            </div>
            <div className="signupinputBx">
              <span>{t("HOMEPHONENUMBER")}</span>
              <input 
                type="tel" 
                className="signupinput" 
                name="homePhone" 
                value={formData.homePhone} 
                onChange={handlePhoneChange} 
                maxLength="10" // Limit to 10 digits
                required 
              />
            </div>
            <div className="signupinputBx">
              <span>{t("HOMEADDRESS")}</span>
              <input type="text" className="signupinput" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="signupinputBx">
              <span>{t("HOMEMEMBERS")}</span>
              <input 
                type="number" 
                className="signupinput" 
                name="number_of_members" 
                value={formData.number_of_members} 
                onChange={handleMembersChange} 
                required 
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <div className="signupinputBx">
              <input type="submit" value={isLoading ? t("LOADING") : t("CREATEHOME")} className="signupbutton" disabled={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateHome;
