// Controllers/notificationController.js
import Notification from "../Models/notificationModel.js";

const getLatestNotifications = async (req, res) => {
  try {
    const userID = req.user._id;
    const notifications = await Notification.find({ user: userID })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const userID = req.user._id;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newNotification = new Notification({
      message,
      user: userID,
    });

    const savedNotification = await newNotification.save();

    res.status(201).json({
      message: "Notification created successfully",
      notification: savedNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user._id;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== userID.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized: You can only mark your own notifications as read",
      });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    res.status(200).json({
      message: "Notification marked as read",
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user._id;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== userID.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete your own notifications",
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

export {
  getLatestNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
};
