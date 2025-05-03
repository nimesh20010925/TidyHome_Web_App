import axios from 'axios';
import { API_BASE_URL } from '../config/config';

const supplierService = {
  getAuthToken() {
    return localStorage.getItem("token");
  },

  createSupplier: async (supplierData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/supplier/create`, supplierData, {
        headers: {
          Authorization: `Bearer ${supplierService.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  getAllSuppliers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/supplier`, {
        headers: {
          Authorization: `Bearer ${supplierService.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  getSupplierById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${supplierService.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/supplier/${id}`, supplierData, {
        headers: {
          Authorization: `Bearer ${supplierService.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  deleteSupplier: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/supplier/${id}`, {
        headers: {
          Authorization: `Bearer ${supplierService.getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};

export default supplierService;