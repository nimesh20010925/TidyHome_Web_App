import express from "express";
import { createHomeController, getHomesByOwnerController, updateHomeController } from "../Controllers/homeController.js";
import { authenticateUser, authorizeHomeOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Home - Only Home Owners can create a home
router.post("/create", authenticateUser, authorizeHomeOwner, createHomeController);

router.get("/myhomes", authenticateUser, getHomesByOwnerController);

router.put("/update/:homeID",authenticateUser,authorizeHomeOwner,updateHomeController)
export default router;
