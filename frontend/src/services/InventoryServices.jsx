import axios from "axios";

const API_URL = "http://localhost:3500/api/inventory";

export class InventoryService {
  static async getAllInventoryItems() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/getAllInventories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("Error:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      return [];
    }
  }

  static async createInventoryItem(inventoryData) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/createNewInventory`,
        inventoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating inventory item:", error);
      throw error;
    }
  }

  static async deleteInventoryItem(id) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${API_URL}/deleteInventory/${id}`, {
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
      console.error("Error deleting inventory item:", error);
      throw error;
    }
  }

  static async updateInventoryItem(id, updateData) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/updateInventory/${id}`,
        updateData,
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
      console.error("Error updating inventory item:", error);
      throw error;
    }
  }

  
}
