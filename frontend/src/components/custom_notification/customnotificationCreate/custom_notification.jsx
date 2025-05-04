import { useState } from "react";
import PropTypes from "prop-types";
import emailjs from "@emailjs/browser";
import { NotificationService } from "../../../services/customNotificationServices";

const NotificationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    notification_title: "",
    email: "",
    notification_type: "",
    assign_to: "",
    repeat_notification: "none",
    send_notification_via: "",
    priority_level: "medium",
    date: "",
    time: "",
    message: "",
    actions: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState("");

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    // Required fields validation
    if (!formData.notification_title.trim()) {
      newErrors.notification_title = "Title is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.notification_type) {
      newErrors.notification_type = "Notification type is required";
    }
    if (!formData.assign_to.trim()) {
      newErrors.assign_to = "Assignee is required";
    }
    if (!formData.send_notification_via) {
      newErrors.send_notification_via = "Send method is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else if (formData.date < today) {
      newErrors.date = "Date must be today or later";
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const sendEmail = async () => {
    const emailParams = {
      to_email: formData.email,
      notification_title: formData.notification_title,
      message: formData.message,
      date: formData.date,
      time: formData.time,
      assign_to: formData.assign_to,
      priority_level: formData.priority_level,
    };

    try {
      await emailjs.send(
        "service_r7lopns", // Replace with your EmailJS service ID
        "template_98eio7j", // Replace with your EmailJS template ID
        emailParams,
        "jjpEgn36J2PLbAw7G" // Replace with your EmailJS public key
      );
      setEmailStatus("Email sent successfully!");
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus("Failed to send email");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Send email first
    const emailSent = await sendEmail();
    if (!emailSent) {
      alert("Failed to send email, but proceeding with notification creation.");
    }

    try {
      await NotificationService.createNotification(formData);
      alert("Notification created successfully!");
      setFormData({
        notification_title: "",
        email: "",
        notification_type: "",
        assign_to: "",
        repeat_notification: "none",
        send_notification_via: "",
        priority_level: "medium",
        date: "",
        time: "",
        message: "",
        actions: "",
        notes: "",
      });
      setErrors({});
      setEmailStatus("");
      onClose();
    } catch (error) {
      console.error("Error creating notification:", error);
      alert("Error creating notification");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#C799FF" }}>Create Notification</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <p style={{ textAlign: "center", color: "#6c757d" }}>
          Schedule and customize your notification
        </p>
        {emailStatus && (
          <p
            style={{
              textAlign: "center",
              color: emailStatus.includes("successfully") ? "green" : "red",
            }}
          >
            {emailStatus}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "15px" }}>
            <div>
              <label htmlFor="notification_title">Notification Title</label>
              <input
                type="text"
                id="notification_title"
                name="notification_title"
                value={formData.notification_title}
                onChange={handleChange}
                placeholder="Title"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: errors.notification_title
                    ? "1px solid red"
                    : "1px solid #ddd",
                }}
              />
              {errors.notification_title && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.notification_title}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: errors.email ? "1px solid red" : "1px solid #ddd",
                }}
              />
              {errors.email && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.email}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="notification_type">Notification Type</label>
              <select
                id="notification_type"
                name="notification_type"
                value={formData.notification_type}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: errors.notification_type
                    ? "1px solid red"
                    : "1px solid #ddd",
                }}
              >
                <option value="">Select Type</option>
                <option value="alert">Alert</option>
                <option value="reminder">Reminder</option>
                <option value="update">Update</option>
              </select>
              {errors.notification_type && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.notification_type}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="assign_to">Assign To</label>
              <input
                type="text"
                id="assign_to"
                name="assign_to"
                value={formData.assign_to}
                onChange={handleChange}
                placeholder="Assign To"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: errors.assign_to ? "1px solid red" : "1px solid #ddd",
                }}
              />
              {errors.assign_to && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.assign_to}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="repeat_notification">Repeat Notification</label>
              <select
                id="repeat_notification"
                name="repeat_notification"
                value={formData.repeat_notification}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="send_notification_via">Send Via</label>
              <select
                id="send_notification_via"
                name="send_notification_via"
                value={formData.send_notification_via}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: errors.send_notification_via
                    ? "1px solid red"
                    : "1px solid #ddd",
                }}
              >
                <option value="">Select Method</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
              </select>
              {errors.send_notification_via && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.send_notification_via}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="priority_level">Priority Level</label>
              <select
                id="priority_level"
                name="priority_level"
                value={formData.priority_level}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: errors.date ? "1px solid red" : "1px solid #ddd",
                  }}
                />
                {errors.date && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.date}
                  </span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: errors.time ? "1px solid red" : "1px solid #ddd",
                  }}
                />
                {errors.time && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {errors.time}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: errors.message ? "1px solid red" : "1px solid #ddd",
                  resize: "vertical",
                }}
              />
              {errors.message && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.message}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="actions">Actions (comma-separated)</label>
              <input
                type="text"
                id="actions"
                name="actions"
                value={formData.actions}
                onChange={handleChange}
                placeholder="Actions"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div>
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(to right, #C799FF, #8f94fb)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "translateY(0)")
                }
              >
                Create Notification
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationModal;
