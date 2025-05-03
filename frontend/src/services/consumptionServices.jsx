import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { NotificationService } from "./NotificationService";

export class ConsumptionService {
  static async getAllConsumptions() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/consumption`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      if (response.data && Array.isArray(response.data.consumptions)) {
        return response.data.consumptions;
      } else {
        console.error("Unexpected API response format:", response.data);
        NotificationService.error("Unexpected response format from server");
        return [];
      }
    } catch (error) {
      console.error("Error fetching consumptions:", error);
      if (error.response && error.response.status === 401) {
        NotificationService.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        NotificationService.error("Failed to fetch consumptions");
      }
      return [];
    }
  }

  static async getConsumptionById(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/consumption/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching consumption by ID:", error);
      throw error;
    }
  }

  static async createConsumption(consumptionData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/consumption/create`,
        consumptionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      NotificationService.sendNotification({
        message: `New consumption created for ${consumptionData.product_name}`,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating consumption:", error);
      throw error;
    }
  }

  static async updateConsumption(id, updatedData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/consumption/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating consumption:", error);
      throw error;
    }
  }

  static async deleteConsumption(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/consumption/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        return response.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting consumption:", error);
      throw error;
    }
  }
}
