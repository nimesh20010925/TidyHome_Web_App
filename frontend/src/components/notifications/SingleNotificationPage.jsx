import { useState, useEffect } from "react";
import { NotificationService } from "../../services/NotificationService";
import { Container, Card, Button, ListGroup } from "react-bootstrap";
import "./singleNotification.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const allNotifications = await NotificationService.getLatestNotifications();
        console.log("Fetched notifications:", allNotifications);
        setNotifications(allNotifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      }
    };
    fetchNotifications();
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    console.log("Marking as read for notification ID:", notificationId);
    try {
      // Mark the notification as read on the server
      const updatedNotification = await NotificationService.markAsRead(notificationId);
      console.log("Updated notification after marking as read:", updatedNotification);

      // Update the state to mark only this notification as read
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

  return (
    <Container className="notification-page mt-5">
      <Card className="shadow-lg">
        <Card.Header className="page-header">
          <h2>All Notifications</h2>
        </Card.Header>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {notifications.length === 0 && !error ? (
            <div className="empty-state">No notifications available</div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification._id} // Use _id as the key
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="notification-message">{notification.message}</span>
                      <small className="notification-time d-block">
                        {new Date(notification.created_at).toLocaleString()}
                      </small>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification._id)} // Pass _id
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