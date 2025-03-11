import { hashPassword, comparePassword, generateToken } from "../helper/authHelper.js";
import userModel from "../Models/userModel.js";
import homeModel from "../Models/homeModel.js";


// Home Owner Registration
export const homeOwnerRegisterController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists, please login." });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      role: "homeOwner",
    }).save();

    res.status(201).json({ success: true, message: "User registered successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in registration", error });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({ success: true, message: "Login successful", token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};

// Add Home Member
export const addHomeMemberController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, homeID, ownerID } = req.body;

    if (!name || !email || !password || !phone || !address || !answer || !homeID || !ownerID) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if home exists
    const home = await homeModel.findById(homeID);
    if (!home || home.ownerID.toString() !== ownerID) {
      return res.status(400).json({ success: false, message: "Home not found or unauthorized" });
    }

    // Hash password and create member
    const hashedPassword = await hashPassword(password);
    const member = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      role: "homeMember",
      homeID,
    }).save();

    res.status(201).json({ success: true, message: "Home member added successfully", member });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in adding member", error });
  }
};
