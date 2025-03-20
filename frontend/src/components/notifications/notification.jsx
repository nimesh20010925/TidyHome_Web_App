import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../services/NotificationService";
import { Dropdown } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import "./notification.css";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const latestNotifications = await NotificationService.getLatestNotifications();
      console.log("Raw API response:", latestNotifications);
      if (Array.isArray(latestNotifications)) {
        setNotifications(latestNotifications);

        // Calculate unread notifications count globally
        const unreadNotificationsCount = notifications.filter(n => !n.read).length;
        setUnreadCount(unreadNotificationsCount);
        console.log("Total notifications:", latestNotifications.length);
        console.log("Unread notifications count:", unreadNotificationsCount);
      } else {
        console.error("API did not return an array:", latestNotifications);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, [showDropdown]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(notif =>
          (notif._id === notificationId || notif.id === notificationId)
            ? { ...notif, read: true }
            : notif
        );
        
        // Recalculate unread count after updating the notifications state
        const unreadNotificationsCount = notifications.filter(n => !n.read).length;
        setUnreadCount(unreadNotificationsCount);
        console.log("Updated unread count after marking as read:", unreadNotificationsCount);
        
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  // Toggle the dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setCurrentPage(1); // Reset to first page
  };

  // Navigate to the full notifications page
  const handleShowAll = () => {
    console.log("Navigating to full notifications page");
    navigate("/app/single-notification");
    setShowDropdown(false);
  };

  // Pagination calculations
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedNotifications = notifications.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="notification-wrapper">
      <div className="bell-container" onClick={toggleDropdown}>
        <FaBell className="bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      <Dropdown show={showDropdown} onToggle={toggleDropdown} align="end">
        <Dropdown.Menu className="notification-dropdown shadow-lg">
          <Dropdown.Header className="notification-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="unread-count">({unreadCount} unread)</span>
            )}
          </Dropdown.Header>

          {notifications.length === 0 ? (
            <Dropdown.Item className="empty-state" disabled>
              <span>No new notifications</span>
            </Dropdown.Item>
          ) : (
            <>
              {displayedNotifications.map((notification) => (
                <Dropdown.Item
                  key={notification._id || notification.id}
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                >
                  <div className="notification-content">
                    <span className="notification-message">{notification.message}</span>
                    <small className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {!notification.read && (
                    <button
                      className="mark-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification._id || notification.id);
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                </Dropdown.Item>
              ))}

              {totalPages > 1 && (
                <div className="pagination-controls" style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    style={{ marginRight: '10px' }}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    style={{ marginLeft: '10px' }}
                  >
                    Next
                  </button>
                </div>
              )}

              <Dropdown.Item className="show-all" onClick={handleShowAll}>
                Show All Notifications ({notifications.length})
              </Dropdown.Item>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;