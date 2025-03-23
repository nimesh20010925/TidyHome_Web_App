import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

const AddHomeMembers = ({ isOpen, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   const { t } = useTranslation();
  // Formik setup for form validation and submission
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
    }),
    
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication failed. Please log in again.");
          toast.error("Authentication failed. Please log in again.");
          return;
        }

        const response = await axios.post(
          "http://localhost:3500/api/auth/add-home-member",
          values,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSuccess(response.data.message);
        toast.success(response.data.message)
        formik.resetForm(); // Reset form after successful submission
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong.");
        toast.error("Something went wrong.")
      } finally {
        setLoading(false);
      }
    },
  });

  const handleToggle = () => {
    toggle();
    formik.resetForm();
  };

  const closeBtn = (
    <button className="close-btn" onClick={handleToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  return (
    <Modal
      className="add-home-member-modal"
      isOpen={isOpen}
      toggle={toggle}
      centered
    >
      <ModalHeader
        toggle={toggle}
        close={closeBtn}
        className="border-0 poppins-medium mx-4 mt-2 fw-bold"
      >
        {t("ADDHOMEMEMBERFORM")}
      </ModalHeader>

      <ModalBody className="add-home-member-modal-body">
        <div>
          {/* Modal Body */}
          <div>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">{success}</p>}

            <form onSubmit={formik.handleSubmit}>
              {/* Full Name */}
              <div className="custom-add-home-member-form-group">
                <label htmlFor="name">{t("USERNAME")}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-home-member-form-input"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div className="custom-add-home-member-form-group">
                <label htmlFor="email">{t("EMAIL")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-home-member-form-input"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div className="custom-add-home-member-form-group">
                <label htmlFor="password">{t("PASSWORD")}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-home-member-form-input"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger">{formik.errors.password}</div>
                )}
              </div>

              {/* Phone */}
              <div className="custom-add-home-member-form-group">
                <label htmlFor="phone">{t("PHONE")}</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter Phone Number"
                  value={formik.values.phone}
                  onChange={(e) => {
                    // Prevent non-numeric characters by allowing only digits
                    const value = e.target.value.replace(/\D/g, ''); // Replace non-digit characters
                    formik.setFieldValue("phone", value); // Update Formik state
                  }}
                  onBlur={formik.handleBlur}
                  className="custom-home-member-form-input"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-danger">{formik.errors.phone}</div>
                )}
              </div>

              {/* Address */}
              <div className="custom-add-home-member-form-group">
                <label htmlFor="address">{t("ADDRESS")}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter Address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="custom-home-member-form-input"
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="text-danger">{formik.errors.address}</div>
                )}
              </div>

              {/* Modal Footer */}

              <Button
                type="submit"
                className="w-100 pt-2 pb-2 fw-bold"
                style={{
                  backgroundColor: "#bb87fa",
                  border: "none",
                  fontSize: "17px",
                }}
                disabled={loading}
              >
               {loading ? "Adding..." : t("ADDHOMEMEMBER")}
              </Button>
            </form>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

AddHomeMembers.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default AddHomeMembers;
