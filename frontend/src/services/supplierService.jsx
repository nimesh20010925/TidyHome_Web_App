import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { NotificationService } from "./NotificationService";

export class SupplierService {
  static getAuthToken() {
    return localStorage.getItem("token");
  }

  static async createSupplier(supplierData, homeId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/supplier/create`,
        supplierData,
        {
          params: { homeId }, // Pass homeId as a query parameter
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );
      NotificationService.sendNotification({
        message: `New supplier created: ${supplierData.supplier_name}`,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error.response?.data || { message: error.message };
    }
  }

  static async getAllSuppliers(homeId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/supplier`, {
        params: { homeId }, // Pass homeId as a query parameter
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (response.data && Array.isArray(response.data.suppliers)) {
        return response.data.suppliers;
      } else {
        console.error("Unexpected API response format:", response.data);
        NotificationService.error("Unexpected response format from server");
        return [];
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      if (error.response && error.response.status === 401) {
        NotificationService.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        NotificationService.error("Failed to fetch suppliers");
      }
      return [];
    }
  }

  static async getSupplierById(id, homeId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/supplier/${id}`, {
        params: { homeId }, // Pass homeId as a query parameter
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (response.data.success) {
        return response.data.supplierRecord;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching supplier by ID:", error);
      throw error;
    }
  }

  static async updateSupplier(id, supplierData, homeId) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/supplier/${id}`,
        supplierData,
        {
          params: { homeId }, // Pass homeId as a query parameter
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error.response?.data || { message: error.message };
    }
  }

  static async deleteSupplier(id, homeId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/supplier/${id}`, {
        params: { homeId }, // Pass homeId as a query parameter
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (response.data.success) {
        return response.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error.response?.data || { message: error.message };
    }
  }
}

export default SupplierService;