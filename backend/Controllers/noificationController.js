// controllers/NotificationController.js

import Notification from "../Models/notificationModel.js";

// Get the latest notifications
const getLatestNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { message } = req.body; // Assume message is passed in the body
    const newNotification = new Notification({ message });

    await newNotification.save();

    res.status(201).json({
      message: "Notification created successfully",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // Notification ID

    const notification = await Notification.findByIdAndUpdate(id, {
      read: true,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

// Exporting the functions
export {
  getLatestNotifications,
  createNotification,
  markAsRead
};