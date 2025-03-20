// Routes/notificationRoute.js

import express from "express";
import { getLatestNotifications, createNotification, markAsRead } from "../Controllers/noificationController.js"; // Named imports

const router = express.Router();

// Route to fetch latest notifications
router.get("/", getLatestNotifications);

// Route to create a new notification
router.post("/create", createNotification);

// Route to mark notification as read
router.post("/:id/read", markAsRead);

export default router;