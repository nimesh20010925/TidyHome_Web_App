import { hashPassword, comparePassword, generateToken } from "../helper/authHelper.js";
import userModel from "../Models/userModel.js";
import homeModel from "../Models/homeModel.js";



// Home Owner Registration
export const homeOwnerRegisterController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validate inputs
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long and contain at least one number",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login.",
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "homeOwner",
    });

    // Save new user to the database
    await newUser.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    // Sending a more detailed error response for debugging
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: `Validation error: ${error.message}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error occurred during registration. Please try again later.",
    });
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

    // Determine redirection path
    let redirectTo = "/app/home";
    if (user.role === "homeOwner" && !user.homeID) {
      redirectTo = "/create-home";
    }

    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token, 
      user, 
      redirectTo 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};

// Add Home Member

export const addHomeMemberController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const homeownerID = req.user._id; // Extracted from authentication middleware

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the user is the homeowner
    const home = await homeModel.findOne({ ownerID: homeownerID });
    if (!home) {
      return res.status(403).json({ success: false, message: "Unauthorized: Only the homeowner can add members" });
    }

    // Hash password and create member
    const hashedPassword = await hashPassword(password);
    const member = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "homeMember",
      homeID: home._id,
    }).save();

    res.status(201).json({ success: true, message: "Home member added successfully", member });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error in adding member", error });
  }
};

export const getHomeMembersController = async (req, res) => {
  try {
    const userID = req.user._id;

    // Find the user's home (whether they are a homeowner or a home member)
    const user = await userModel.findById(userID);
    if (!user || !user.homeID) {
      return res.status(403).json({ success: false, message: "Unauthorized: You do not belong to any home" });
    }

    // Fetch all home members of the same home
    const members = await userModel.find({ homeID: user.homeID }).select("-password");

    res.status(200).json({ success: true, members });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching home members", error });
  }
};

export const deleteHomeMemberController = async (req, res) => {
  try {
    const { memberID } = req.params;
    const homeownerID = req.user._id; // Extracted from authentication middleware

    // Check if the user is the homeowner
    const home = await homeModel.findOne({ ownerID: homeownerID });
    if (!home) {
      return res.status(403).json({ success: false, message: "Unauthorized: Only the homeowner can remove members" });
    }

    // Find the member to delete
    const member = await userModel.findById(memberID);
    if (!member || member.homeID.toString() !== home._id.toString()) {
      return res.status(404).json({ success: false, message: "Member not found or does not belong to your home" });
    }

    // Delete the member
    await userModel.findByIdAndDelete(memberID);

    res.status(200).json({ success: true, message: "Home member removed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting home member", error });
  }
};



export const updateHomeMemberController = async (req, res) => {
  try {
    const { memberID } = req.params;
    const { name, email, phone, address } = req.body;
    const requestingUserID = req.user._id; // Extracted from authentication middleware

    // Find the member to update
    const member = await userModel.findById(memberID);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Find the home of the requesting user
    const home = await homeModel.findOne({ ownerID: requestingUserID });

    // Allow updates if the requester is either:
    // 1. The homeowner (can update any member)
    // 2. The member themselves (can only update their own details)
    if (!home && requestingUserID.toString() !== memberID.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized: You can only update your own details" });
    }

    // Update member details
    member.name = name || member.name;
    member.email = email || member.email;
    member.phone = phone || member.phone;
    member.address = address || member.address;

    await member.save();

    res.status(200).json({ success: true, message: "Home member updated successfully", member });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating home member", error });
  }
};
