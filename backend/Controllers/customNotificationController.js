import { customNotification } from "../Models/customNotification_model.js";

const createCustomNotification = async (req, res) => {
  try {
    const {
      notification_title,
      email,
      notification_type,
      assign_to,
      repeat_notification,
      send_notification_via,
      priority_level,
      date,
      time,
      message,
      actions,
      notes,
    } = req.body;

    if (
      !notification_title ||
      !email ||
      !notification_type ||
      !assign_to ||
      !repeat_notification ||
      !send_notification_via ||
      !priority_level ||
      !date ||
      !time ||
      !message ||
      !actions ||
      !notes
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newNotification = new customNotification({
      notification_title,
      email,
      notification_type,
      assign_to,
      repeat_notification,
      send_notification_via,
      priority_level,
      date,
      time,
      message,
      actions,
      notes,
    });

    const savedNotification = await newNotification.save();
    res.status(201).json({
      message: "Notification created successfully",
      savedNotification,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating notification", error: error.message });
  }
};

const getCustomNotifications = async (req, res) => {
  try {
    const notifications = await customNotification.find();
    res
      .status(200)
      .json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

const getCustomNotificationById = async (req, res) => {
  try {
    const notification = await customNotification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res
      .status(200)
      .json({ message: "Notification fetched successfully", notification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notification", error: error.message });
  }
};

const updateCustomNotification = async (req, res) => {
  try {
    const notification = await customNotification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const updatedNotification = await customNotification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Notification updated successfully", updatedNotification });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating notification", error: error.message });
  }
};

const deleteCustomNotification = async (req, res) => {
  try {
    const notification = await customNotification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await customNotification.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
};

const customNotificationController = {
  createCustomNotification,
  getCustomNotifications,
  getCustomNotificationById,
  updateCustomNotification,
  deleteCustomNotification,
};

export default customNotificationController;