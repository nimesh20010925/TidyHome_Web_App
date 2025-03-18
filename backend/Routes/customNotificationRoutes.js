import express from "express";
import CustomNotificationControllers from "../Controllers/customNotificationController.js";

const router = express.Router();


router.post("/create", CustomNotificationControllers.createCustomNotification);
router.get("/", CustomNotificationControllers.getCustomNotification);
router.get("/:id", CustomNotificationControllers.getCustomNotificationById);
router.put("/:id", CustomNotificationControllers.updateCustomNotification);
router.delete("/:id", CustomNotificationControllers.deleteCustomNotification);

export default router;