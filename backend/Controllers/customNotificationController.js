import { customNotification } from "../Models/customNotificationModel.js";


const createCustomNotification = async (req, res) => {
  try {
    const { notification, notification_type, status, date, user,notification_action } = req.body;

    if (!notification || !notification_type || !status || !date || !user || !notification_action) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCustomNotification = new customNotification({
      notification,
      notification_type,
      status,
      date,
      user,
      notification_action,
    });

    const savedCustomNotification = await newCustomNotification.save();
    res.status(201).json({ message: "Custom Notification created successfully", savedCustomNotification });
  } catch (error) {
    res.status(500).json({ message: "error creating Custom Notification", error: error.message });
  }
};

const getCustomNotification = async (req, res) => {
  try {
    const customNotifications = await customNotification.find();
    res.status(200).json({ message: "customNotification fetched successfully", customNotifications });
  } catch (error) {
    res.status(500).json({ message: "error fetching customNotification", error: error.message });
  }
};

const getCustomNotificationById = async (req, res) => {
  try {
    const CustomNotificationRecord = await customNotification.findById(req.params.id);
    if (!CustomNotificationRecord) {
      return res.status(404).json({ message: "customNotification not record found" });
    }
    res.status(200).json({ message: "custopmNotification fetched successfully", CustomNotificationRecord });
  } catch (error) {
    res.status(500).json({ message: "error fetching custopmNotification", error: error.message });
  }
};

const updateCustomNotification = async (req, res) => {
  try {
    const CustomNotificationRecord = await customNotification.findById(req.params.id);
    if (!CustomNotificationRecord) {
      return res.status(404).json({ message: "consumption not record found" });
    }
    const updatedCustomNotification = await customNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Custom Notification updated successfully", updatedCustomNotification });
  } catch (error) {
    res.status(500).json({ message: "error updating Custom Notification", error: error.message });
  }
};

const deleteCustomNotification = async (req, res) => {
  try {
    const CustomNotificationRecord = await customNotification.findById(req.params.id);
    if (!CustomNotificationRecord) {
      return res.status(404).json({ message: "Custom Notification not record found" });
    }
    await customNotification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Custom Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "error deleting CustomNotification", error: error.message });
  }
};


const consumptionController = {
  createCustomNotification,
  getCustomNotification,
  getCustomNotificationById,
  updateCustomNotification,
  deleteCustomNotification,
};

export default consumptionController;

