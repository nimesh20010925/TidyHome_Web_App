import mongoose from "mongoose";

const customNotificationSchema = new mongoose.Schema(
  {
    notification: {
      type: String,
      required: true,
    },
    notification_type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    user: {
      type: String,
      required: true,

    },
    notification_action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const customNotification = mongoose.model("customNotifications", customNotificationSchema);




