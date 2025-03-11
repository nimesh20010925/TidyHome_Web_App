import express from "express";
import { createHomeController } from "../Controlers/homeController.js";
import { authenticateUser, authorizeHomeOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Home - Only Home Owners can create a home
router.post("/create", authenticateUser, authorizeHomeOwner, createHomeController);

export default router;
