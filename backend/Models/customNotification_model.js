import mongoose from "mongoose";

const customNotificationSchema = new mongoose.Schema(
  {
    notification_title: { type: String, required: true },
    email: { type: String, required: true },
    notification_type: { type: String, required: true },
    assign_to: { type: String, required: true },
    repeat_notification: { type: String, required: true },
    send_notification_via: { type: String, required: true },
    priority_level: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    message: { type: String, required: true },
    actions: { type: String, required: true },
    notes: { type: String, required: true },
  },
  { timestamps: true }
);

export const customNotification = mongoose.model(
  "customNotifications",
  customNotificationSchema
);