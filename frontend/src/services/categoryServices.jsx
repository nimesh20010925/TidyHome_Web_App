import axios from "axios";

import { API_BASE_URL } from "../config/config";

export class CategoryService {
  static async getAllCategorys() {
    try {
      const response = await axios.get(`${API_BASE_URL}/category`);

      if (response.data && Array.isArray(response.data.categorys)) {
        return response.data.categorys;
      } else {
        console.error("Unexpected API response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching categorys:", error);
      return [];
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw error;
    }
  }

  static async createCategory(categoryData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/category/create`, categoryData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error.response?.data || error);
      throw error;
    }
  }
  

  static async updateCategory(id, updatedData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/category/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/category/${id}`);

      if (response.data.success) {
        return response.data;
      } else {
        console.error("Error:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}
