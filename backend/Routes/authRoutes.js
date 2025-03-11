import express from "express";
import { homeOwnerRegisterController, loginController, addHomeMemberController } from "../Controllers/authControler.js";
import { authenticateUser, authorizeHomeOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register Home Owner
router.post("/register", homeOwnerRegisterController);

// Login User
router.post("/login", loginController);

// Add Home Member (Only Home Owner can add)
router.post("/add-home-member", authenticateUser, authorizeHomeOwner, addHomeMemberController);

export default router;
