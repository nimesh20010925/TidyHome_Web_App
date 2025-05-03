import axios from "axios";

const API_URL = "http://localhost:3500/api/shoppingList";

export class ShoppingListService {
  static async updateShoppingList(listId, updateData) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/shopping-lists/${listId}`,
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
      console.error("Error updating shopping list:", error);
      throw error;
    }
  }

  static async getShoppingLists() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/shopping-lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        return response.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      throw error;
    }
  }

  static async deleteShoppingListItem(itemId) {
    console.log(itemId);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/shopping-list-items/${itemId}`,
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
      console.error("Error deleting shopping list item:", error);
      throw error;
    }
  }
}
