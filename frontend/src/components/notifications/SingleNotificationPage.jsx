import { useState, useEffect } from "react";
import { NotificationService } from "../../services/NotificationService";
import { Container, Card, Button, ListGroup, Spinner, Badge } from "react-bootstrap";
import { FaCheckCircle, FaBell } from "react-icons/fa";
import "./singleNotification.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const allNotifications = await NotificationService.getLatestNotifications();
        console.log("Fetched notifications:", allNotifications);
        // Sort by date, newest first
        const sortedNotifications = allNotifications.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sortedNotifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Handle marking a single notification as read
  const handleMarkAsRead = async (notificationId) => {
    console.log("Marking as read for notification ID:", notificationId);
    try {
      const updatedNotification = await NotificationService.markAsRead(notificationId);
      console.log("Updated notification after marking as read:", updatedNotification);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read. Please try again.");
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
      if (unreadIds.length === 0) return;
      await Promise.all(unreadIds.map(id => NotificationService.markAsRead(id)));
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError("Failed to mark all notifications as read.");
    }
  };

  return (
    <Container className="notification-page mt-5">
      <Card className="notification-card " style={{ width: "100%" }}>
        <Card.Header className="page-header d-flex justify-content-between align-items-center">
          <h2>
            <FaBell className="me-2" /> All Notifications
          </h2>
          {notifications.some(n => !n.read) && (
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="mark-all-btn"
            >
              <FaCheckCircle className="me-1" /> Mark All as Read
            </Button>
          )}
        </Card.Header>
        <Card.Body className="card-body">
          {loading ? (
            <div className="loading-state">
              <Spinner animation="border" variant="primary" />
              <span className="ms-2">Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <FaBell className="mb-2" size={30} />
              <p>No notifications available</p>
            </div>
          ) : (
            <ListGroup variant="flush" className="notification-list">
              {notifications.map((notification, index) => (
                <ListGroup.Item
                  key={notification._id}
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="notification-message">
                        {notification.message}
                        {!notification.read && (
                          <Badge bg="primary" className="ms-2" style={{fontSize:'10px'}}>New</Badge>
                        )}
                      </span>
                      <small className="notification-time d-block">
                        {new Date(notification.created_at).toLocaleString()}
                      </small>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="mark-read-btn"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotificationPage;