import  { useState } from "react";
import { NotificationService } from "../../services/customNotificationServices";

const NotificationForm = () => {
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
    } catch (error) {
      alert("Error creating notification");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInUp" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
              {/* Header */}
              <div className="card-header bg-transparent border-0 p-4">
                <h2 className="mb-0 text-center fw-bold" style={{
                  background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Create Notification
                </h2>
                <p className="text-center text-muted mt-2">Schedule and customize your notification</p>
              </div>

              {/* Body */}
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Notification Title */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control border-0 shadow-sm rounded-3"
                          id="notification_title"
                          name="notification_title"
                          value={formData.notification_title}
                          onChange={handleChange}
                          placeholder="Title"
                          style={{ background: '#f8f9fa' }}
                        />
                        <label htmlFor="notification_title" className="text-muted">Notification Title</label>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control border-0 shadow-sm rounded-3"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          style={{ background: '#f8f9fa' }}
                        />
                        <label htmlFor="email" className="text-muted">Email Address</label>
                      </div>
                    </div>

                    {/* Notification Type */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select border-0 shadow-sm rounded-3"
                          id="notification_type"
                          name="notification_type"
                          value={formData.notification_type}
                          onChange={handleChange}
                          style={{ background: '#f8f9fa' }}
                        >
                          <option value="">Select Type</option>
                          <option value="alert">Alert</option>
                          <option value="reminder">Reminder</option>
                          <option value="update">Update</option>
                        </select>
                        <label htmlFor="notification_type" className="text-muted">Notification Type</label>
                      </div>
                    </div>

                    {/* Assign To */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control border-0 shadow-sm rounded-3"
                          id="assign_to"
                          name="assign_to"
                          value={formData.assign_to}
                          onChange={handleChange}
                          placeholder="Assign To"
                          style={{ background: '#f8f9fa' }}
                        />
                        <label htmlFor="assign_to" className="text-muted">Assign To</label>
                      </div>
                    </div>

                    {/* Repeat Notification */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select border-0 shadow-sm rounded-3"
                          id="repeat_notification"
                          name="repeat_notification"
                          value={formData.repeat_notification}
                          onChange={handleChange}
                          style={{ background: '#f8f9fa' }}
                        >
                          <option value="none">None</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                        <label htmlFor="repeat_notification" className="text-muted">Repeat Notification</label>
                      </div>
                    </div>

                    {/* Send Via */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select border-0 shadow-sm rounded-3"
                          id="send_notification_via"
                          name="send_notification_via"
                          value={formData.send_notification_via}
                          onChange={handleChange}
                          style={{ background: '#f8f9fa' }}
                        >
                          <option value="">Select Method</option>
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                          <option value="push">Push Notification</option>
                        </select>
                        <label htmlFor="send_notification_via" className="text-muted">Send Via</label>
                      </div>
                    </div>

                    {/* Priority Level */}
                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select border-0 shadow-sm rounded-3"
                          id="priority_level"
                          name="priority_level"
                          value={formData.priority_level}
                          onChange={handleChange}
                          style={{ background: '#f8f9fa' }}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                        <label htmlFor="priority_level" className="text-muted">Priority Level</label>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="col-md-6">
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="date"
                              className="form-control border-0 shadow-sm rounded-3"
                              id="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              style={{ background: '#f8f9fa' }}
                            />
                            <label htmlFor="date" className="text-muted">Date</label>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="time"
                              className="form-control border-0 shadow-sm rounded-3"
                              id="time"
                              name="time"
                              value={formData.time}
                              onChange={handleChange}
                              style={{ background: '#f8f9fa' }}
                            />
                            <label htmlFor="time" className="text-muted">Time</label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control border-0 shadow-sm rounded-3"
                          id="message"
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Message"
                          style={{ background: '#f8f9fa', minHeight: '120px' }}
                        ></textarea>
                        <label htmlFor="message" className="text-muted">Message</label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control border-0 shadow-sm rounded-3"
                          id="actions"
                          name="actions"
                          value={formData.actions}
                          onChange={handleChange}
                          placeholder="Actions"
                          style={{ background: '#f8f9fa' }}
                        />
                        <label htmlFor="actions" className="text-muted">Actions (comma-separated)</label>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control border-0 shadow-sm rounded-3"
                          id="notes"
                          name="notes"
                          rows="3"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="Notes"
                          style={{ background: '#f8f9fa', minHeight: '100px' }}
                        ></textarea>
                        <label htmlFor="notes" className="text-muted">Additional Notes</label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 text-end mt-5">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg animate__animated animate__pulse animate__infinite"
                        style={{
                          background: 'linear-gradient(to right, #4e54c8, #8f94fb)',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        Create Notification
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationForm;