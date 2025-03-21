import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { NotificationService } from "../../../services/customNotificationServices"; // Ensure this path is correct

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, color: "#4e54c8" }}>Create Notification</h2>
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
        <p style={{ textAlign: "center", color: "#6c757d" }}>Schedule and customize your notification</p>

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
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
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
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
            </div>
            <div>
              <label htmlFor="notification_type">Notification Type</label>
              <select
                id="notification_type"
                name="notification_type"
                value={formData.notification_type}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="">Select Type</option>
                <option value="alert">Alert</option>
                <option value="reminder">Reminder</option>
                <option value="update">Update</option>
              </select>
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
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              />
            </div>
            <div>
              <label htmlFor="repeat_notification">Repeat Notification</label>
              <select
                id="repeat_notification"
                name="repeat_notification"
                value={formData.repeat_notification}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
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
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="">Select Method</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority_level">Priority Level</label>
              <select
                id="priority_level"
                name="priority_level"
                value={formData.priority_level}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
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
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="time">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
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
                  border: "1px solid #ddd",
                  resize: "vertical",
                }}
              />
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
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
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
                  background: "linear-gradient(to right, #4e54c8, #8f94fb)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
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

// Define PropTypes for the component
NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen is a required boolean
  onClose: PropTypes.func.isRequired, // onClose is a required function
};

// Parent Component to Test the Modal


export default NotificationModal; // Export App for testing, or NotificationModal if using elsewhere