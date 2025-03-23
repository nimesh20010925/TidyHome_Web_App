import express from "express";
import { 
  homeOwnerRegisterController, 
  loginController, 
  addHomeMemberController, 
  getHomeMembersController, 
  deleteHomeMemberController, 
  updateHomeMemberController 
} from "../Controllers/authControler.js";
import { authenticateUser, authorizeHomeOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register Home Owner
router.post("/register", homeOwnerRegisterController);

// Login User
router.post("/login", loginController);

// Add Home Member (Only Home Owner can add)
router.post("/add-home-member", authenticateUser, authorizeHomeOwner, addHomeMemberController);

// Get Home Members
router.get("/home/members", authenticateUser, getHomeMembersController);

// Delete Home Member (Only Home Owner can delete)
router.delete("/home/members/:memberID", authenticateUser, authorizeHomeOwner, deleteHomeMemberController);

// Update Home Member (Home Owner can update any member, Member can only update themselves)
router.put("/home/members/:memberID", authenticateUser, updateHomeMemberController);

export default router;
