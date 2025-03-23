// services/NotificationService.js
import axios from "axios";
import { API_BASE_URL } from "../config/config";

export class NotificationService {
  // Fetch latest notifications
  static async getLatestNotifications() {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications`);
      if (response.data && Array.isArray(response.data.notifications)) {
        return response.data.notifications;
      } else {
        console.error("Unexpected API response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      await axios.post(`${API_BASE_URL}/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Send a notification
  static async sendNotification(notificationData) {
    try {
      // You can modify this based on how you want to send notifications
      const response = await axios.post(`${API_BASE_URL}/notifications/create`, notificationData);
      console.log('Notification sent:', response.data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
}

export default NotificationService;