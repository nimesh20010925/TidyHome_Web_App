import { verifyToken } from "../helper/authHelper.js";
import userModel from "../Models/userModel.js";

// Middleware to check if user is authenticated
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("Authentication failed: No token provided");
      return res.status(403).json({ success: false, message: "No token provided" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.error("Authentication failed: Invalid or expired token");
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      console.error(`Authentication failed: User not found for ID ${decoded.id}`);
      return res.status(403).json({ success: false, message: "User not found" });
    }

    req.user = user; // Add user to request object
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};

// Middleware to check if user is homeOwner
export const authorizeHomeOwner = (req, res, next) => {
  if (req.user.role !== "homeOwner") {
    return res.status(403).json({ success: false, message: "Access restricted to Home Owners only" });
  }
  next();
};

// Middleware to check if user is homeMember
export const authorizeHomeMember = (req, res, next) => {
  if (req.user.role !== "homeMember") {
    return res.status(403).json({ success: false, message: "Access restricted to Home Members only" });
  }
  next();
};