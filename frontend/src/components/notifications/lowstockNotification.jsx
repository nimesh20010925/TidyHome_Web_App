import axios from "axios";
const Twilio = require('twilio');

const API_URL = "http://localhost:3500/api/inventory";


const TWILIO_ACCOUNT_SID = 'ACb133e0bca437997d9d78b3921218aed5';
const TWILIO_AUTH_TOKEN = '221bd34964d32d2f9568e867c5baf163';
const TWILIO_PHONE_NUMBER = 'whatsapp:+14155238886'; 

const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const WHATSAPP_NUMBER = 'whatsapp:+94766738383'; 

export class InventoryService {
  // Function to send WhatsApp message
  static async sendLowStockAlert(itemName, quantity) {
    try {
      await client.messages.create({
        from: TWILIO_PHONE_NUMBER,
        to: WHATSAPP_NUMBER,
        body: `Low Stock Alert: ${itemName} - Current quantity: ${quantity}`
      });
      console.log(`Low stock message sent for ${itemName}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }

  static async getAllInventoryItems() {
    try {
      const response = await axios.get(`${API_URL}/getAllInventories`);
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
      const response = await axios.post(
        `${API_URL}/createNewInventory`,
        inventoryData
      );
      
      // Check stock level after creating
      if (inventoryData.quantity <= inventoryData.lowStockLevel) {
        await this.sendLowStockAlert(inventoryData.itemName, inventoryData.quantity);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating inventory item:", error);
      throw error;
    }
  }

  static async deleteInventoryItem(id) {
    try {
      const response = await axios.delete(`${API_URL}/deleteInventory/${id}`);
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
      const response = await axios.put(
        `${API_URL}/updateInventory/${id}`,
        updateData
      );
      
      // Check stock level after updating
      if (response.data.success && 
          updateData.quantity <= updateData.lowStockLevel) {
        await this.sendLowStockAlert(updateData.itemName, updateData.quantity);
      }
      
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

  // Optional: Method to check all inventory periodically
  static async checkAllInventoryLevels() {
    try {
      const items = await this.getAllInventoryItems();
      for (const item of items) {
        if (item.quantity <= item.lowStockLevel) {
          await this.sendLowStockAlert(item.itemName, item.quantity);
        }
      }
    } catch (error) {
      console.error("Error checking inventory levels:", error);
    }
  }
}

// Optional: Set up periodic checking (runs every hour)
setInterval(() => {
  InventoryService.checkAllInventoryLevels();
}, 60 * 60 * 1000);