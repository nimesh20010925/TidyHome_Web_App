// supplierService.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/supplier'; // Adjust based on your server URL

const supplierService = {
  // Create a new supplier
  createSupplier: async (supplierData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, supplierData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all suppliers
  getAllSuppliers: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get supplier by ID
  getSupplierById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update supplier
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete supplier
  deleteSupplier: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default supplierService;