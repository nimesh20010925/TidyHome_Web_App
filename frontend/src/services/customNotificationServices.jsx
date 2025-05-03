import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { NotificationService as NotificationServiceHelper } from "./NotificationService";

export class NotificationService {
  static async getAllNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/customNotification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      if (response.data && Array.isArray(response.data.notifications)) {
        return response.data.notifications;
      } else {
        console.error("Unexpected API response format:", response.data);
        NotificationServiceHelper.error(
          "Unexpected response format from server"
        );
        return [];
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response && error.response.status === 401) {
        NotificationServiceHelper.error(
          "Session expired. Please log in again."
        );
        window.location.href = "/login";
      } else {
        NotificationServiceHelper.error("Failed to fetch notifications");
      }
      return [];
    }
  }

  static async getNotificationById(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/customNotification/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        return response.data.notification;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching notification by ID:", error);
      throw error;
    }
  }

  static async createNotification(notificationData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/customNotification/create`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      NotificationServiceHelper.sendNotification({
        message: `New custom notification created for ${notificationData.notification_title}`,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  static async updateNotification(id, updatedData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/customNotification/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }

  static async deleteNotification(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/customNotification/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        return response.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}
