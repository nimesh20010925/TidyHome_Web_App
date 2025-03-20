import  { useState, useEffect } from "react";
import { NotificationService } from "../../services/NotificationService";
import { Container, Card, Button, ListGroup } from "react-bootstrap";
import "./singleNotification.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const allNotifications = await NotificationService.getLatestNotifications();
      console.log("Fetched notifications:", allNotifications);
      setNotifications(allNotifications);
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    console.log("Marking as read for notification ID:", notificationId);

    // Mark the notification as read on the server and get the updated data
    const updatedNotification = await NotificationService.markAsRead(notificationId);
    console.log("Updated notification after marking as read:", updatedNotification);

    // Update state to reflect the change for that specific notification
    setNotifications(prevNotifications => 
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <Container className="notification-page mt-5">
      <Card className="shadow-lg">
        <Card.Header className="page-header">
          <h2>All Notifications</h2>
        </Card.Header>
        <Card.Body>
          {notifications.length === 0 ? (
            <div className="empty-state">No notifications available</div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
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
                        onClick={() => handleMarkAsRead(notification.id)}
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