import  { useState, useEffect } from 'react';
import { NotificationService } from '../../../services/customNotificationServices';
import './customNotificationView.css';

const NotificationCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const data = await NotificationService.getAllNotifications();
    setNotifications(data);
  };

  const handleDropdown = (id) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleAdd = () => {
    console.log('Add new notification');
  };

  const handleUpdate = (id) => {
    console.log('Update notification:', id);
  };

  const handleDelete = (id) => {
    NotificationService.deleteNotification(id)
      .then(() => fetchNotifications())
      .catch(err => console.error(err));
  };

  const closeModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="notification-container">
      <div className="header">
        <h2>Notifications</h2>
        <button className="add-btn" onClick={handleAdd}>
          + Add Notification
        </button>
      </div>

      <div className="cards-container">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-card">
            <div className="card-header">
              <h3>{notification.notification_title}</h3>
              <div className="dropdown">
                <button 
                  className="dropdown-btn" 
                  onClick={() => handleDropdown(notification.id)}
                >
                  ⋮
                </button>
                {showDropdown === notification.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => setSelectedNotification(notification)}>
                      View
                    </button>
                    <button onClick={() => handleUpdate(notification.id)}>
                      Update
                    </button>
                    <button onClick={() => handleDelete(notification.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card-content">
              <div className="priority" style={{
                backgroundColor: notification.priority_level === 'high' ? '#ff4444' :
                                notification.priority_level === 'medium' ? '#ffbb33' : '#00C851'
              }}>
                {notification.priority_level}
              </div>
              <p><strong>Email:</strong> {notification.email}</p>
              <p><strong>Type:</strong> {notification.notification_type}</p>
              <p><strong>Assigned to:</strong> {notification.assign_to}</p>
              <p><strong>Date:</strong> {notification.date} {notification.time}</p>
              <p><strong>Message:</strong> {notification.message}</p>
              {notification.repeat_notification && (
                <span className="repeat-badge">Repeating</span>
              )}
            </div>

            <div className="card-footer">
              <span>Sent via: {notification.send_notification_via}</span>
              {notification.notes && (
                <span className="notes">Has notes</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing notification details */}
      {selectedNotification && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedNotification.notification_title}</h2>
            <div className="modal-body">
              <p><strong>Email:</strong> {selectedNotification.email}</p>
              <p><strong>Type:</strong> {selectedNotification.notification_type}</p>
              <p><strong>Assigned to:</strong> {selectedNotification.assign_to}</p>
              <p><strong>Priority:</strong> {selectedNotification.priority_level}</p>
              <p><strong>Date:</strong> {selectedNotification.date} {selectedNotification.time}</p>
              <p><strong>Message:</strong> {selectedNotification.message}</p>
              <p><strong>Sent via:</strong> {selectedNotification.send_notification_via}</p>
              <p><strong>Repeat:</strong> {selectedNotification.repeat_notification ? 'Yes' : 'No'}</p>
              {selectedNotification.notes && (
                <p><strong>Notes:</strong> {selectedNotification.notes}</p>
              )}
            </div>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;