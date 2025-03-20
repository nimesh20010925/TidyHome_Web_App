import axios from "axios";

import { API_BASE_URL } from "../config/config";

export const createCustomNotification = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/create`, data);
  return response.data;
};

export const getAllCustomNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data.customNotifications;
};

export const getCustomNotificationById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data.CustomNotificationRecord;
};

export const updateCustomNotification = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteCustomNotification = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};