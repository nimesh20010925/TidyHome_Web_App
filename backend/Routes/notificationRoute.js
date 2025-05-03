// Routes/notificationRoute.js
import express from "express";
import {
  getLatestNotifications,
  createNotification,
  markAsRead,
} from "../Controllers/noificationController.js"; // Fixed typo
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getLatestNotifications);
router.post("/create", authenticateUser, createNotification);
router.post("/:id/read", authenticateUser, markAsRead);

export default router;
