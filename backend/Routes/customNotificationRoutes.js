import express from "express";
import customNotificationController from "../Controllers/customNotificationController.js";

const router = express.Router();

router.post("/create", customNotificationController.createCustomNotification);
router.get("/", customNotificationController.getCustomNotifications);
router.get("/:id", customNotificationController.getCustomNotificationById);
router.put("/:id", customNotificationController.updateCustomNotification);
router.delete("/:id", customNotificationController.deleteCustomNotification);

export default router;