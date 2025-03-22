import { useState, useEffect } from 'react';
import { NotificationService } from '../../../services/customNotificationServices';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './customNotificationView.css';

const NotificationShow = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationService.getAllNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const validateEditForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!editForm.notification_title?.trim()) errors.notification_title = 'Title is required';
    if (!editForm.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(editForm.email)) errors.email = 'Invalid email format';
    if (!editForm.notification_type?.trim()) errors.notification_type = 'Type is required';
    if (!editForm.assign_to?.trim()) errors.assign_to = 'Assignee is required';
    if (!editForm.date) errors.date = 'Date is required';
    else if (editForm.date < today) errors.date = 'Date must be today or later';
    if (!editForm.time) errors.time = 'Time is required';
    if (!editForm.message?.trim()) errors.message = 'Message is required';

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await NotificationService.deleteNotification(deleteId);
      setNotifications(notifications.filter((n) => n._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const handleEdit = (notification) => {
    setEditingId(notification._id);
    setEditForm({ ...notification });
    setEditErrors({});
  };

  const handleSave = async (id) => {
    if (!validateEditForm()) return;
    try {
      const updatedData = { ...editForm };
      await NotificationService.updateNotification(id, updatedData);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, ...updatedData } : n))
      );
      setEditingId(null);
      setEditErrors({});
    } catch (err) {
      setError('Failed to update notification');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) {
      setEditErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="text-center py-5 text-danger fw-bold">{error}</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center fw-bold text-uppercase">Notifications Dashboard</h2>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Are you sure you want to delete this notification? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-center text-muted fs-5">No notifications available</p>
      ) : (
        <div className="row g-4">
          {notifications.map((notification) => (
            <div key={notification._id} className="col-lg-4 col-md-6 col-sm-12">
              <div className={`card notification-card shadow-lg border-0 ${editingId === notification._id ? 'edit-mode' : 'view-mode'}`}>
                <div className="card-header bg-gradient-primary text-white position-relative">
                  <h5 className="mb-0 fw-bold">{notification.notification_title}</h5>
                  <div className="dropdown position-absolute end-0 top-0 mt-2 me-2">
                    <button
                      className="btn btn-sm btn-outline-light dropdown-toggle p-1"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      ⋮ {/* Using vertical ellipsis character */}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                      <li>
                        <button className="dropdown-item text-primary" onClick={() => handleEdit(notification)}>
                          <i className="bi bi-pencil-square me-2"></i>Edit
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(notification._id)}>
                          <i className="bi bi-trash me-2"></i>Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body p-4">
                  {editingId === notification._id ? (
                    <div className="edit-form">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Title</label>
                        <input
                          type="text"
                          name="notification_title"
                          value={editForm.notification_title || ''}
                          onChange={handleChange}
                          className={`form-control shadow-sm ${editErrors.notification_title ? 'is-invalid' : ''}`}
                        />
                        {editErrors.notification_title && <div className="invalid-feedback">{editErrors.notification_title}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email || ''}
                          onChange={handleChange}
                          className={`form-control shadow-sm ${editErrors.email ? 'is-invalid' : ''}`}
                        />
                        {editErrors.email && <div className="invalid-feedback">{editErrors.email}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Type</label>
                        <input
                          type="text"
                          name="notification_type"
                          value={editForm.notification_type || ''}
                          onChange={handleChange}
                          className={`form-control shadow-sm ${editErrors.notification_type ? 'is-invalid' : ''}`}
                        />
                        {editErrors.notification_type && <div className="invalid-feedback">{editErrors.notification_type}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Assigned to</label>
                        <input
                          type="text"
                          name="assign_to"
                          value={editForm.assign_to || ''}
                          onChange={handleChange}
                          className={`form-control shadow-sm ${editErrors.assign_to ? 'is-invalid' : ''}`}
                        />
                        {editErrors.assign_to && <div className="invalid-feedback">{editErrors.assign_to}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Priority</label>
                        <select
                          name="priority_level"
                          value={editForm.priority_level || ''}
                          onChange={handleChange}
                          className="form-control shadow-sm"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={editForm.date ? new Date(editForm.date).toISOString().split('T')[0] : ''}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`form-control shadow-sm ${editErrors.date ? 'is-invalid' : ''}`}
                        />
                        {editErrors.date && <div className="invalid-feedback">{editErrors.date}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Time</label>
                        <input
                          type="time"
                          name="time"
                          value={editForm.time || ''}
                          onChange={handleChange}
                          className={`form-control shadow-sm ${editErrors.time ? 'is-invalid' : ''}`}
                        />
                        {editErrors.time && <div className="invalid-feedback">{editErrors.time}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Message</label>
                        <textarea
                          name="message"
                          value={editForm.message || ''}
                          onChange={handleChange}
                          className={`form-control shadow-sm ${editErrors.message ? 'is-invalid' : ''}`}
                          rows="3"
                        />
                        {editErrors.message && <div className="invalid-feedback">{editErrors.message}</div>}
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success flex-grow-1 fw-bold save-button" onClick={() => handleSave(notification._id)}>
                          <i className="bi bi-check-circle me-2"></i>Save Changes
                        </button>
                        <button className="btn cancle-button flex-grow-1 fw-bold" onClick={handleCancel}>
                          <i className="bi bi-x-circle me-2"></i>Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="notification-details">
                      <p className="mb-2"><strong>Email:</strong> <span className="text-muted">{notification.email}</span></p>
                      <p className="mb-2"><strong>Type:</strong> <span className="text-muted">{notification.notification_type}</span></p>
                      <p className="mb-2"><strong>Assigned to:</strong> <span className="text-muted">{notification.assign_to}</span></p>
                      <p className="mb-2">
                        <strong>Priority:</strong>
                        <span className={`badge ${notification.priority_level === 'High' ? 'bg-danger' : notification.priority_level === 'Medium' ? 'bg-warning' : 'bg-success'} ms-2`}>
                          {notification.priority_level}
                        </span>
                      </p>
                      <p className="mb-2"><strong>Date:</strong> <span className="text-muted">{new Date(notification.date).toLocaleDateString()}</span></p>
                      <p className="mb-2"><strong>Time:</strong> <span className="text-muted">{notification.time}</span></p>
                      <p className="mb-0"><strong>Message:</strong> <span className="text-muted">{notification.message}</span></p>
                    </div>
                  )}
                </div>
                <div className="card-footer bg-light text-muted small">
                  Created: {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationShow;