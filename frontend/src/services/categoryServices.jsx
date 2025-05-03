import axios from "axios";
import { API_BASE_URL } from "../config/config";

export class CategoryService {
  static getAuthToken() {
    return localStorage.getItem("token"); // Adjust based on how you store the token
  }

  static async getAllCategorys() {
    try {
      const response = await axios.get(`${API_BASE_URL}/category`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (response.data && Array.isArray(response.data.categorys)) {
        return response.data.categorys;
      }
      console.error("Unexpected API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/getone/${id}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (response.data.categoryRecord) {
        return response.data.categoryRecord;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/category/create`, categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.data.savedcategory;
    } catch (error) {
      console.error("Error creating category:", error.response?.data || error);
      throw error;
    }
  }

  static async updateCategory(id, updatedData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/category/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      return response.data.updatedcategory;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/category/${id}`, {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || "Delete failed");
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error);
      throw error;
    }
  }
}