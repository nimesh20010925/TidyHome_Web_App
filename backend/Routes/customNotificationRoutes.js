import express from "express";
import customNotificationController from "../Controllers/customNotificationController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  customNotificationController.createCustomNotification
);
router.get(
  "/",
  authenticateUser,
  customNotificationController.getCustomNotifications
);
router.get(
  "/:id",
  authenticateUser,
  customNotificationController.getCustomNotificationById
);
router.put(
  "/:id",
  authenticateUser,
  customNotificationController.updateCustomNotification
);
router.delete(
  "/:id",
  authenticateUser,
  customNotificationController.deleteCustomNotification
);

export default router;
