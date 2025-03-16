import axios from "axios";

import { API_BASE_URL } from "../config/config";

export class ConsumptionService {

    static async getAllConsumptions() {
        try {
          const response = await axios.get(`${API_BASE_URL}/consumption`);
          
          if (response.data && Array.isArray(response.data.consumptions)) {
            return response.data.consumptions;
          } else {
            console.error("Unexpected API response format:", response.data);
            return [];
          }
        } catch (error) {
          console.error("Error fetching consumptions:", error);
          return [];
        }
      }

  static async getConsumptionById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/consumption/${id}`);

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
      const response = await axios.post(`${API_BASE_URL}/consumption/create`, consumptionData);
      return response.data;
    } catch (error) {
      console.error("Error creating consumption:", error);
      throw error;
    }
  }

  static async updateConsumption(id, updatedData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/consumption/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating consumption:", error);
      throw error;
    }
  }

  static async deleteConsumption(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/consumption/${id}`);

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