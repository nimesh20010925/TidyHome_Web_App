import homeModel from "../Models/homeModel.js";
import userModel from "../Models/userModel.js";

export const createHomeController = async (req, res) => {
  try {
    const { homeName, number_of_members, homePhone, address, ownerID } = req.body;

    // Check if all required fields are provided
    if (!homeName || !number_of_members || !homePhone || !address || !ownerID) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the owner exists and is a valid homeOwner
    const user = await userModel.findById(ownerID);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.role !== "homeOwner") {
      return res.status(400).json({ success: false, message: "User is not authorized to create a home" });
    }

    // Include OwnerName from the user model
    const OwnerName = user.name; // Assuming 'name' exists in the user model

    // Create new home
    const newHome = new homeModel({
      homeName,
      ownerID: user._id,
      OwnerName, // Fixed missing OwnerName
      number_of_members,
      homePhone,
      address,
    });

    // Save the home
    const home = await newHome.save();

    // Ensure user model has homeID before updating
    user.homeID = home._id;
    await user.save();

    // Send success response with the created home data
    res.status(201).json({
      success: true,
      message: "Home created successfully",
      home: {
        _id: home._id,
        homeName: home.homeName,
        OwnerName: home.OwnerName,
        ownerID: home.ownerID,
        number_of_members: home.number_of_members,
        homePhone: home.homePhone,
        address: home.address,
        createdAt: home.createdAt,
        updatedAt: home.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating home:", error);
    res.status(500).json({
      success: false,
      message: "Error in creating home",
      error: error.message,
    });
  }
};
