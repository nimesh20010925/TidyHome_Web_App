import axios from "axios";
import { API_BASE_URL } from "../config/config";
import  NotificationServices  from "./NotificationService";

export class NotificationService {
  static async getAllNotifications() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customNotification`);
      return response.data.notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  static async getNotificationById(id) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customNotification/${id}`
      );
      return response.data.notification;
    } catch (error) {
      console.error("Error fetching notification by ID:", error);
      throw error;
    }
  }

  static async createNotification(notificationData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/customNotification/create`,
        notificationData
      );
      NotificationServices.sendNotification({
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
      const response = await axios.put(
        `${API_BASE_URL}/customNotification/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }

  static async deleteNotification(id) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/customNotification/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}