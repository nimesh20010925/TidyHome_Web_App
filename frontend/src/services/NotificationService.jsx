// services/NotificationService.js
import axios from "axios";
import { API_BASE_URL } from "../config/config";

export class NotificationService {
  // Fetch latest notifications for the authenticated user
  static async getLatestNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && Array.isArray(response.data.notifications)) {
        return response.data.notifications;
      } else {
        console.error("Unexpected API response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      }
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Send a notification for the authenticated user
  static async sendNotification(notificationData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/notifications/create`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Notification sent:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}

export default NotificationService;
